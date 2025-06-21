import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { SpinnerComponent } from '../../ui/spinner/spinner.component';
import { SignInFormValue, SignUpFormValue } from '../model/form';
import { AuthService } from '../services/auth/auth.service';
import { SignInFormComponent } from '../form/sign-in-form/sign-in-form.component';
import { SignUpFormComponent } from '../form/sign-up-form/sign-up-form.component';
import { BaseForm } from '../form/base-form';
import { MatError } from '@angular/material/input';

@Component({
  selector: 'app-auth-page',
  imports: [
    CommonModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatButton,
    MatCardSubtitle,
    MatCardTitle,
    ReactiveFormsModule,
    SpinnerComponent,
    SignInFormComponent,
    SignUpFormComponent,
    MatError,
  ],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPageComponent {
  protected readonly error = signal<string | null>(null);
  protected readonly label = computed(() =>
    this.isSignIn() ? 'Sign In' : 'Sign Up'
  );
  protected readonly isSignIn = computed(() => this.mode() === 'signIn');
  protected readonly isLoading = signal(false);
  protected readonly isSubmitDisabled = computed(
    () => this.isLoading() || this.form()?.isInvalid()
  );

  private readonly authService = inject(AuthService);
  private readonly form = viewChild<BaseForm>('form');
  private readonly mode = signal<'signIn' | 'signUp'>('signIn');

  protected onSubmit(): void {
    const form = this.form();

    if (form && !form.isInvalid()) {
      this.isLoading.set(true);
      this.error.set(null);

      (this.isSignIn()
        ? this.authService.signIn(form.getValue<SignInFormValue>())
        : this.authService.signUp(form.getValue<SignUpFormValue>())
      )
        .pipe(
          tap(() => this.mode.set('signIn')),
          catchError((err) => {
            this.error.set(err?.message || err);
            return EMPTY;
          }),
          finalize(() => {
            this.isLoading.set(false);
          })
        )
        .subscribe();
    }
  }

  protected toggleMode(): void {
    this.mode.update((mode) => (mode === 'signIn' ? 'signUp' : 'signIn'));
  }
}
