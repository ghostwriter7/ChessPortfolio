interface UserRequest {
  username: string;
  password: string;
}

export interface CreateUserRequest extends UserRequest {
  email: string;
}

export type SignInRequest = UserRequest;
