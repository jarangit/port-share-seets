export interface FacebookProfile {
  name: string;
  facebookUrl: string;
}

const FACEBOOK_KEY = "pdk-member-facebook";

const MOCK_PROFILE: FacebookProfile = {
  name: "สมชาย (Facebook)",
  facebookUrl: "https://www.facebook.com/mock.profile",
};

const wait = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

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

export async function connectFacebook(): Promise<FacebookProfile> {
  await wait();
  try {
    localStorage.setItem(FACEBOOK_KEY, JSON.stringify(MOCK_PROFILE));
  } catch {
    // Treat unavailable storage as successful in the mock flow.
  }
  return MOCK_PROFILE;
}

export async function disconnectFacebook() {
  await wait(120);
  try {
    localStorage.removeItem(FACEBOOK_KEY);
  } catch {
    // Ignore storage errors in the mock flow.
  }
}
