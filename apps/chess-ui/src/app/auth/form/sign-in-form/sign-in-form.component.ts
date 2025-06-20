import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../../ui/form-field/form-field.component';
import { nonBlankValidator } from '../../../validators/non-blank/non-blank';
import { passwordValidator } from '../../validators/password/password.validator';
import { BaseForm } from '../base-form';

@Component({
  selector: 'app-sign-in-form',
  imports: [CommonModule, FormFieldComponent],
  templateUrl: './sign-in-form.component.html',
  styleUrl: './sign-in-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInFormComponent extends BaseForm {
  protected readonly formGroup = new FormGroup({
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
