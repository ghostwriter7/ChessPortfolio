import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Validates that a form control's value is not blank (empty or whitespace only).
 * This validator can be used with Angular's form controls to ensure that text input
 * contains actual content and not just spaces.
 *
 * @param control - The form control to validate
 * @returns null if the value is a non-empty string with non-whitespace characters,
 *          or {nonBlank: true} if validation fails
 * @example
 * ```TypeScript
 * const control = new FormControl('', [nonBlankValidator]);
 * ```
 */
export function nonBlankValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;

  return typeof value === 'string' && value?.trim().length
    ? null
    : { nonBlank: true };
}
