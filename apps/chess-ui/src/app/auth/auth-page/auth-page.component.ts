import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { nonBlankValidator } from '../../validators/non-blank/non-blank';
import { MatInput } from '@angular/material/input';
import { SpinnerComponent } from '../../ui/spinner/spinner.component';

@Component({
  selector: 'app-auth-page',
  imports: [
    CommonModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatButton,
    MatFormField,
    MatFormField,
    MatFormField,
    MatLabel,
    MatInput,
    MatSuffix,
    MatIcon,
    MatLabel,
    MatFormField,
    MatHint,
    MatCardSubtitle,
    MatCardTitle,
    ReactiveFormsModule,
    MatError,
    SpinnerComponent,
  ],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPageComponent {
  protected readonly isLoading = signal(false);
  protected readonly isSubmitDisabled = computed(
    () => this.isLoading() || this.isControlInvalid()
  );
  protected readonly usernameControl = new FormControl<string | null>(null, [
    Validators.required,
    nonBlankValidator,
  ]);
  protected readonly usernameControlError = computed(() => {
    if (this.isControlInvalid()) {
      if (this.usernameControl.hasError('required')) {
        return 'Username is required';
      }

      if (this.usernameControl.hasError('nonBlank')) {
        return 'Username cannot be blank';
      }
    }
    return null;
  });

  private readonly authService = inject(AuthService);
  private readonly isControlInvalid = toSignal(
    this.usernameControl.events.pipe(map(() => this.usernameControl.invalid))
  );

  protected onSubmit(): void {
    const username = this.usernameControl.value?.trim();

    if (username) {
      this.isLoading.set(true);

      this.authService.signIn(username);
    } else {
      this.usernameControl.updateValueAndValidity();
      this.usernameControl.markAsTouched();
    }
  }
}
