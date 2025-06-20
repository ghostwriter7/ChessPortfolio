import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Injector,
  input,
  OnInit,
  Signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlEvent,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatError, MatHint, MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { toSignal } from '@angular/core/rxjs-interop';

type MinMaxLengthError = {
  actualLength: number;
  requiredLength: number;
};

@Component({
  selector: 'app-form-field',
  imports: [
    CommonModule,
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    MatError,
    MatHint,
  ],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent implements OnInit {
  public control = input.required<FormControl<string | null>>();
  public label = input.required<string>();
  public hint = input<string>();
  public placeholder = input<string>('');
  public type = input('text');

  protected readonly controlError = computed(() => {
    const formControl = this.control();
    if (this.events() && formControl.invalid) {
      const label = this.label();
      if (formControl.hasError('required')) {
        return `${label} is required`;
      }

      if (formControl.hasError('nonBlank')) {
        return `${label} cannot be blank`;
      }

      if (formControl.errors?.['minlength']) {
        const { requiredLength } = formControl.errors[
          'minlength'
        ] as MinMaxLengthError;
        return `${label} must be at least ${requiredLength} characters long`;
      }

      if (formControl.errors?.['maxlength']) {
        const { requiredLength } = formControl.errors[
          'maxlength'
        ] as MinMaxLengthError;
        return `${label} must be at most ${requiredLength} characters long`;
      }
    }
    return null;
  });
  private events!: Signal<ControlEvent<string | null> | undefined>;

  private readonly injector = inject(Injector);

  public ngOnInit(): void {
    const formControl = this.control();
    this.events = toSignal(formControl.events, { injector: this.injector });
  }
}
