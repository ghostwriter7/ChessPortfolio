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
import { SpinnerComponent } from '../../ui/spinner/spinner.component';
import { AuthService } from '../services/auth/auth.service';
import { SignInFormComponent } from '../form/sign-in-form/sign-in-form.component';
import { SignUpFormComponent } from '../form/sign-up-form/sign-up-form.component';
import { BaseForm } from '../form/base-form';

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
  ],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPageComponent {
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
      const value = form.getValue();

      this.isLoading.set(true);

      // const request$ = this.isSignIn()
      // ? this.authService.signIn()
      //   : this.authService.signUp()
    }
  }

  protected toggleMode(): void {
    this.mode.update((mode) => (mode === 'signIn' ? 'signUp' : 'signIn'));
  }
}
