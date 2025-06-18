import { PasswordHelper } from './password.helper';

describe('PasswordHelper', () => {
  describe('verifyPassword', () => {
    const dummyPassword = 'tHi$mYpAS$w0Rd';
    const hash = PasswordHelper.hashPassword(dummyPassword);

    it('should return true if the hashed string matches the password', () =>
      expect(PasswordHelper.verifyPassword(dummyPassword, hash)).toBe(true));

    it('should return false if the hashed string does not match the password', () =>
      expect(PasswordHelper.verifyPassword('another password!!!', hash)).toBe(
        false
      ));
  });
});
