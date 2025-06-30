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
  selector: 'app-alert-popup',
  imports: [
    CommonModule,
    MatButton,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './alert-popup.component.html',
  styleUrl: './alert-popup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertPopupComponent {
  protected readonly title: string;
  protected readonly message: string;
  protected readonly confirmText: string;

  constructor(
    data = inject(MAT_DIALOG_DATA) as {
      message: string;
      title: string;
      confirmText: string;
    }
  ) {
    const { confirmText, message, title } = data;
    this.confirmText = confirmText || 'OK';
    this.title = title || 'Notification';
    this.message = message;
  }
}
