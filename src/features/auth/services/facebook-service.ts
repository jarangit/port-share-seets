import { apiFetch, clearAccessToken, setAccessToken } from "@/lib/api-client";
import type { UserProfile } from "@/features/users/types";

export interface FacebookProfile {
  name: string;
  facebookUrl: string;
}

export interface FacebookLoginResult {
  profile: FacebookProfile;
  user: UserProfile;
}

export class FacebookNotConfiguredError extends Error {
  constructor() {
    super("NEXT_PUBLIC_FACEBOOK_APP_ID is not set");
    this.name = "FacebookNotConfiguredError";
  }
}

/* Minimal typings for the parts of the Facebook JS SDK we use. */
interface FacebookAuthResponse {
  accessToken: string;
  userID: string;
}

interface FacebookLoginStatus {
  status: "connected" | "not_authorized" | "unknown";
  authResponse: FacebookAuthResponse | null;
}

interface FacebookSdk {
  init: (params: { appId: string; cookie: boolean; xfbml: boolean; version: string }) => void;
  login: (callback: (response: FacebookLoginStatus) => void, options?: { scope?: string }) => void;
  getLoginStatus: (callback: (response: FacebookLoginStatus) => void) => void;
}

declare global {
  interface Window {
    FB?: FacebookSdk;
    fbAsyncInit?: () => void;
  }
}

const FACEBOOK_KEY = "pdk-member-facebook";
const SDK_URL = "https://connect.facebook.net/en_US/sdk.js";
const GRAPH_VERSION = "v23.0";

function facebookAppId(): string | null {
  return process.env.NEXT_PUBLIC_FACEBOOK_APP_ID?.trim() || null;
}

let sdkPromise: Promise<FacebookSdk> | null = null;

function loadFacebookSdk(appId: string): Promise<FacebookSdk> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Facebook Login needs a browser"));
  }
  if (window.FB) return Promise.resolve(window.FB);
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise<FacebookSdk>((resolve, reject) => {
    const previous = window.fbAsyncInit;
    window.fbAsyncInit = () => {
      try {
        previous?.();
        window.FB?.init({ appId, cookie: false, xfbml: false, version: GRAPH_VERSION });
        if (window.FB) resolve(window.FB);
        else reject(new Error("Facebook SDK failed to initialize"));
      } catch (error) {
        reject(error instanceof Error ? error : new Error("Facebook SDK failed to initialize"));
      }
    };
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SDK_URL}"]`);
    if (existing) {
      if (window.FB) resolve(window.FB);
      return;
    }
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      sdkPromise = null;
      reject(new Error("Facebook SDK failed to load"));
    };
    document.head.appendChild(script);
    // If the script was already cached and executed, fbAsyncInit may never
    // fire again — fall back to polling briefly.
    let polls = 0;
    const timer = setInterval(() => {
      polls += 1;
      if (window.FB) {
        clearInterval(timer);
        window.FB.init({ appId, cookie: false, xfbml: false, version: GRAPH_VERSION });
        resolve(window.FB);
      } else if (polls > 50) {
        clearInterval(timer);
      }
    }, 100);
  });
  return sdkPromise;
}

function readStored(): FacebookProfile | null {
  try {
    const raw = localStorage.getItem(FACEBOOK_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FacebookProfile;
    if (typeof parsed.name !== "string" || typeof parsed.facebookUrl !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getStoredFacebookProfile(): FacebookProfile | null {
  try {
    return readStored();
  } catch {
    return null;
  }
}

function fbLogin(sdk: FacebookSdk): Promise<FacebookLoginStatus> {
  return new Promise((resolve) => {
    sdk.login((response) => resolve(response), { scope: "public_profile" });
  });
}

interface BackendFacebookLogin {
  ok: true;
  user: UserProfile;
  accessToken: string;
}

export async function connectFacebook(): Promise<FacebookLoginResult> {
  const appId = facebookAppId();
  if (!appId) throw new FacebookNotConfiguredError();
  const sdk = await loadFacebookSdk(appId);
  const status = await fbLogin(sdk);
  if (status.status !== "connected" || !status.authResponse?.accessToken) {
    throw new Error("Facebook login was not completed");
  }
  // Real login: exchange the FB user token for our own JWT session.
  const result = await apiFetch<BackendFacebookLogin>("/auth/facebook/login", {
    method: "POST",
    body: JSON.stringify({ accessToken: status.authResponse.accessToken }),
  });
  setAccessToken(result.accessToken);
  const profile: FacebookProfile = {
    name: result.user.name,
    facebookUrl: result.user.facebookUrl ?? `https://www.facebook.com/${status.authResponse.userID}`,
  };
  try {
    localStorage.setItem(FACEBOOK_KEY, JSON.stringify(profile));
  } catch {
    // Treat unavailable storage as successful; the session is what matters.
  }
  return { profile, user: result.user };
}

export async function disconnectFacebook() {
  clearAccessToken();
  try {
    localStorage.removeItem(FACEBOOK_KEY);
  } catch {
    // Ignore storage errors.
  }
}
