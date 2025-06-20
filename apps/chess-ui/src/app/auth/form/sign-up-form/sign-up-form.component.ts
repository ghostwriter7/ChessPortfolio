import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../../ui/form-field/form-field.component';
import { nonBlankValidator } from '../../../validators/non-blank/non-blank';
import { passwordValidator } from '../../validators/password/password.validator';
import { BaseForm } from '../base-form';

@Component({
  selector: 'app-sign-up-form',
  imports: [CommonModule, FormFieldComponent],
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpFormComponent extends BaseForm {
  protected readonly formGroup = new FormGroup({
    email: new FormControl<string | null>(null, [
      Validators.required,
      Validators.email,
    ]),
    username: new FormControl<string | null>(null, [
      Validators.required,
      nonBlankValidator,
    ]),
    password: new FormControl<string | null>(null, [
      Validators.required,
      passwordValidator,
    ]),
  });

  public override readonly isInvalid: Signal<boolean> = this.createIsInvalid();

  constructor() {
    super();
  }
}
