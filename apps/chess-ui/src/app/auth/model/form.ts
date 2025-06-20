export interface SignInForm {
  username: string;
  password: string;
}

export interface SignUpForm extends SignInForm {
  email: string;
}
