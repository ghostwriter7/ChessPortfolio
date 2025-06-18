import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { CdkTableDataSourceInput } from '@angular/cdk/table';
import { User } from '../../auth/model/user';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-lobby-page',
  imports: [
    CommonModule,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatButton,
  ],
  templateUrl: './lobby-page.component.html',
  styleUrl: './lobby-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LobbyPageComponent {
  protected readonly players = signal<CdkTableDataSourceInput<User>>([
    new User('John'),
    new User('John'),
    new User('John'),
    new User('John'),
    new User('John'),
    new User('John'),
  ]);
  protected readonly displayedColumns: Iterable<string> = [
    'index',
    'username',
    'action',
  ];
}
