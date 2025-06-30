import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-confirmation-popup',
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
  ],
  templateUrl: './confirmation-popup.component.html',
  styleUrl: './confirmation-popup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationPopupComponent {
  protected readonly title: string;
  protected readonly message: string;
  protected readonly confirmText: string;
  protected readonly cancelText: string;

  constructor(
    data = inject(MAT_DIALOG_DATA) as {
      message: string;
      title: string;
      confirmText: string;
      cancelText: string;
    }
  ) {
    const { confirmText, cancelText, message, title } = data;
    this.confirmText = confirmText || 'Confirm';
    this.cancelText = cancelText || 'Cancel';
    this.title = title || 'Confirmation';
    this.message = message || 'Are you sure?';
  }
}
