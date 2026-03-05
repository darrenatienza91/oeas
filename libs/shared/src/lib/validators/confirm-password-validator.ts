import { UntypedFormControl } from '@angular/forms';

export const confirmationValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
  const newPassword = control.parent?.get('newPassword');
  if (!newPassword) {
    return { required: true };
  }

  if (!control.value) {
    return { required: true };
  } else if (control.value !== newPassword.value) {
    return { confirm: true, error: true };
  }
  return {};
};
