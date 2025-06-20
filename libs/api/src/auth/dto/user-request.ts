interface UserRequest {
  username: string;
  password: string;
}

export type CreateUserRequest = UserRequest;
export type SignInRequest = UserRequest;
