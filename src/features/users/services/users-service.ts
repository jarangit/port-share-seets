import { users } from "@/features/users/data/users";
import type { UserProfile } from "@/features/users/types";

export interface UpdateCurrentUserInput {
  vehicle?: string;
  phone?: string;
  facebookUrl?: string;
}

let currentUser: UserProfile = users.me;

const wait = () => new Promise((resolve) => setTimeout(resolve, 120));

export async function getCurrentUser() {
  await wait();
  return currentUser;
}

export async function updateCurrentUser(input: UpdateCurrentUserInput) {
  await wait();
  currentUser = {
    ...currentUser,
    phone: input.phone ?? currentUser.phone,
    facebookUrl: input.facebookUrl ?? currentUser.facebookUrl,
  };
  return currentUser;
}
