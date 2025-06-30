import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

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

  constructor() {
    const { confirmText, message, title } = inject(MAT_DIALOG_DATA) as {
      message: string;
      title: string;
      confirmText: string;
    };
    this.confirmText = confirmText || 'OK';
    this.title = title || 'Notification';
    this.message = message;
  }
}
