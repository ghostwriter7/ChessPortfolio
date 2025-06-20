export interface SignInFormValue {
  username: string;
  password: string;
}

export interface SignUpFormValue extends SignInFormValue {
  email: string;
}
