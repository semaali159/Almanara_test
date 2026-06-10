import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShipmentStatus, STATUS_LABELS } from '../../../features/shipments/models/shipment.model';

@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="status-chip" [ngClass]="statusClass">
      <span class="dot"></span>
      {{ label }}
    </span>
  `,
  styles: [`
    .status-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      letter-spacing: 0.3px;

      .dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      &.status-preparation {
        background: #fff8e6;
        color: #b45309;
        .dot { background: #f59e0b; }
      }
      &.status-transit {
        background: #eff6ff;
        color: #1d4ed8;
        .dot { background: #3b82f6; }
      }
      &.status-arrived {
        background: #f5f3ff;
        color: #6d28d9;
        .dot { background: #8b5cf6; }
      }
      &.status-delivered {
        background: #f0fdf4;
        color: #065f46;
        .dot { background: #10b981; }
      }
      &.status-cancelled {
        background: #fff1f2;
        color: #be123c;
        .dot { background: #ef4444; }
      }
    }
  `],
})
export class StatusChipComponent {
  @Input({ required: true }) status!: ShipmentStatus;

  get label(): string {
    return STATUS_LABELS[this.status];
  }

  get statusClass(): string {
    return `status-${this.status.toLowerCase()}`;
  }
}