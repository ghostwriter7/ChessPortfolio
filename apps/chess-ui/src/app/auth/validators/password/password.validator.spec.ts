import { FormControl } from '@angular/forms';
import { passwordValidator } from './password.validator';

describe('PasswordValidator', () => {
  test.each<{
    input: string;
    message: string;
  }>([
    {
      input: 'abc123!!!',
      message: 'does not contain uppercase letter',
    },
    {
      input: 'ABC123!!!',
      message: 'does not container lowercase letter',
    },
    {
      input: 'abcABC!!!',
      message: 'does not contain digit',
    },
    {
      input: 'abcABC123',
      message: 'does not contain special character',
    },
    {
      input: 'aB1!',
      message: 'is shorter than 6 characters',
    },
    {
      input: '        ',
      message: 'is empty',
    },
  ])('should return error when $message', ({ input }) =>
    expect(passwordValidator(new FormControl(input))).toBeDefined()
  );

  it('should return null when input is valid', () =>
    expect(passwordValidator(new FormControl('abcABC123!'))).toBeNull());
});
