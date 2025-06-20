import { Validators } from '@angular/forms';

export const passwordValidator = Validators.pattern(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{6,}$'
);
