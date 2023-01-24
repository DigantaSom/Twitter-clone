export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

export type SetCredenitalsPayload = {
  accessToken: string;
};

export type LoginMutationArg = {
  handle: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
};
