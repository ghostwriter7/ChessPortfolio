import { Signal } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

export abstract class BaseForm {
  public abstract isInvalid: Signal<boolean>;

  protected abstract formGroup: UntypedFormGroup;

  public getValue<T>(): T {
    return this.formGroup.value as T;
  }

  protected createIsInvalid(): Signal<boolean> {
    return toSignal(
      this.formGroup.events.pipe(map(() => this.formGroup.invalid)),
      { initialValue: true }
    );
  }
}
