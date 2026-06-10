import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ShipmentService } from '../../services/shipment.service';
import { ShipmentStore } from '../../store/shipment.store';
import { ShipmentTabFilter } from '../../models/shipment.model';
import { ShipmentCardComponent } from '../../components/shipment-card/shipment-card.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-shipments-page',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    ShipmentCardComponent,
    SearchBarComponent,
    SkeletonLoaderComponent,
    EmptyStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- App Shell -->
    <div class="app-shell">

      <!-- Top Header -->
      <header class="top-header">
        <div class="header-inner">
          <div class="logo">
            <svg width="120" height="32" viewBox="0 0 120 32" fill="none">
              <text x="0" y="24" font-family="Arial" font-weight="800" font-size="20" fill="#1e40af">almanara</text>
              <path d="M108 6l6 5-6 5" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <nav class="top-nav">
            <a class="nav-link">How it works</a>
            <a class="nav-link">Stores in Turkey</a>
            <a class="nav-link">Shipping Calculator</a>
            <a class="nav-link">Buy for me</a>
          </nav>
          <div class="header-actions">
            <button class="btn-address">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#3b82f6"/>
              </svg>
              My Address
            </button>
            <div class="user-badge">
              <div class="user-avatar">MO</div>
              <span class="user-name">Mohamed Elnaeh</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="#6b7280" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </header>

      <!-- Sub Nav Tabs -->
      <div class="sub-nav">
        <div class="sub-nav-inner">
          <div class="sub-nav-tabs">
            <button class="sub-tab">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>
              </svg>
              Box Locker
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <div class="sub-tab-divider"></div>
            <button class="sub-tab">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Shipping Box
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <div class="sub-tab-divider"></div>
            <button class="sub-tab active-sub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              My Shipments
            </button>
          </div>
        </div>
      </div>

      <!-- Page Content -->
      <main class="page-content">
        <div class="content-inner">

          <!-- Page Title + Tabs -->
          <div class="page-header">
            <h1 class="page-title">My Shipments</h1>
            <div class="status-tabs">
              <button
                class="status-tab"
                [class.active]="store.activeTab$.value === 'active'"
                (click)="setTab('active')"
              >
                Active
                <span class="tab-count" *ngIf="store.activeCount() > 0">
                  {{ store.activeCount() }}
                </span>
              </button>
              <button
                class="status-tab"
                [class.active]="store.activeTab$.value === 'delivered'"
                (click)="setTab('delivered')"
              >
                Delivered
                <span class="tab-count delivered" *ngIf="store.deliveredCount() > 0">
                  {{ store.deliveredCount() }}
                </span>
              </button>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="search-section">
            <app-search-bar
              placeholder="Search by order id or date"
              (searchChange)="onSearch($event)"
            />
          </div>

          <!-- Shipment List -->
          <div class="shipments-list">

            <!-- Loading Skeleton -->
            <ng-container *ngIf="store.loading()">
              <app-skeleton-loader [count]="5" />
            </ng-container>

            <!-- Loaded State -->
            <ng-container *ngIf="!store.loading()">
              <ng-container *ngIf="filteredShipments$ | async as shipments">

                <!-- Group: Today -->
                <ng-container *ngIf="todayShipments(shipments) as todayList">
                  <div *ngIf="todayList.length > 0" class="date-group">
                    <div class="date-label">Today</div>
                    <app-shipment-card
                      *ngFor="let s of todayList; trackBy: trackById"
                      [shipment]="s"
                      [expanded]="store.expandedId() === s.id"
                      (toggle)="store.toggleExpanded($event)"
                    />
                  </div>
                </ng-container>

                <!-- Group: Older -->
                <ng-container *ngIf="olderShipments(shipments) as olderList">
                  <div *ngIf="olderList.length > 0" class="date-group">
                    <div class="date-label">05/22/2022</div>
                    <app-shipment-card
                      *ngFor="let s of olderList; trackBy: trackById"
                      [shipment]="s"
                      [expanded]="store.expandedId() === s.id"
                      (toggle)="store.toggleExpanded($event)"
                    />
                  </div>
                </ng-container>

                <!-- Empty State -->
                <app-empty-state
                  *ngIf="shipments.length === 0"
                  [title]="emptyTitle"
                  [description]="emptyDescription"
                />

              </ng-container>
            </ng-container>

          </div>

          <!-- Pagination -->
          <div class="pagination" *ngIf="!store.loading()">
            <button class="page-btn" disabled>Prev</button>
            <button class="page-btn active-page">1</button>
            <button class="page-btn">2</button>
            <button class="page-btn">3</button>
            <button class="page-btn">4</button>
            <button class="page-btn">Next</button>
          </div>

        </div>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-inner">
          <div class="footer-brand">
            <div class="footer-logo">
              <svg width="100" height="28" viewBox="0 0 100 28" fill="none">
                <text x="0" y="22" font-family="Arial" font-weight="800" font-size="18" fill="#1e40af">almanara</text>
              </svg>
            </div>
            <div class="store-badges">
              <div class="store-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="white"/></svg>
                App Store
              </div>
              <div class="store-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M3.18 23.76c.3.17.64.21.96.1l12.5-7.21-2.54-2.54-10.92 9.65zm-1.1-20.7C2.03 3.4 2 3.77 2 4.18v15.64c0 .41.03.78.08 1.12l.02.11L13.27 9.84l.01-.01-11.2-6.77h-.02zM20.1 9.17l-2.62-1.52-2.83 2.83 2.84 2.84 2.64-1.53c.75-.44.75-1.18-.03-1.62zM4.14.22L16.64 7.43 14.1 9.97 3.18.32C3.5.21 3.84.25 4.14.42v-.2z" fill="white"/></svg>
                Google Play
              </div>
            </div>
          </div>
          <div class="footer-links">
            <div class="footer-col">
              <h4>Quick links</h4>
              <a>Contact us</a>
              <a>About Us</a>
              <a>Careers</a>
            </div>
            <div class="footer-col">
              <h4>Services</h4>
              <a>Box & Express</a>
              <a>Buy for me</a>
              <a>Stores in Turkey</a>
            </div>
            <div class="footer-col">
              <h4>Social Media</h4>
              <a>Facebook</a>
              <a>Twitter</a>
              <a>LinkedIn</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <span>Copyright © 2022 Almanara, All Rights Reserved.</span>
        </div>
      </footer>

    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }

    .app-shell {
      min-height: 100vh;
      background: #f8fafc;
      display: flex;
      flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    // ── Top Header ──────────────────────────────────────────
    .top-header {
      background: #fff;
      border-bottom: 1px solid #e5e7eb;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      height: 60px;
      display: flex;
      align-items: center;
      gap: 32px;
    }

    .logo { flex-shrink: 0; }

    .top-nav {
      display: flex;
      gap: 24px;
      flex: 1;
    }

    .nav-link {
      font-size: 13px;
      color: #6b7280;
      text-decoration: none;
      cursor: pointer;
      transition: color 0.15s;

      &:hover { color: #111827; }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-address {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border: 1.5px solid #3b82f6;
      border-radius: 8px;
      background: #fff;
      color: #3b82f6;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;

      &:hover { background: #eff6ff; }
    }

    .user-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.15s;

      &:hover { background: #f9fafb; }
    }

    .user-avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-name {
      font-size: 13px;
      font-weight: 600;
      color: #374151;
    }

    // ── Sub Nav ──────────────────────────────────────────────
    .sub-nav {
      background: #fff;
      border-bottom: 1px solid #e5e7eb;
    }

    .sub-nav-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .sub-nav-tabs {
      display: flex;
      align-items: center;
      height: 50px;
      gap: 0;
    }

    .sub-tab {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 24px;
      height: 100%;
      border: none;
      background: transparent;
      font-size: 13px;
      font-weight: 500;
      color: #9ca3af;
      cursor: pointer;
      transition: all 0.15s;

      &:hover { color: #374151; }

      &.active-sub {
        color: #1d4ed8;
        font-weight: 700;
        border-bottom: 3px solid #1d4ed8;
        margin-bottom: -1px;
      }
    }

    .sub-tab-divider {
      width: 1px;
      height: 24px;
      background: #e5e7eb;
    }

    // ── Main Content ─────────────────────────────────────────
    .page-content {
      flex: 1;
      padding: 28px 0;
    }

    .content-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .page-title {
      font-size: 22px;
      font-weight: 800;
      color: #111827;
      margin: 0;
    }

    .status-tabs {
      display: flex;
      border-radius: 10px;
      overflow: hidden;
      border: 1.5px solid #e5e7eb;
      background: #f9fafb;
    }

    .status-tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 24px;
      border: none;
      background: transparent;
      font-size: 13px;
      font-weight: 600;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.2s ease;

      &.active {
        background: #1d4ed8;
        color: #fff;
        box-shadow: 0 2px 8px rgba(29, 78, 216, 0.3);
      }
    }

    .tab-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      font-size: 11px;
      font-weight: 700;
      background: rgba(255,255,255,0.25);
      color: inherit;

      .status-tab:not(.active) & {
        background: #e5e7eb;
        color: #6b7280;
      }
    }

    .search-section {
      margin-bottom: 20px;
    }

    .shipments-list { }

    .date-group { margin-bottom: 24px; }

    .date-label {
      font-size: 12px;
      font-weight: 600;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 10px;
      padding-left: 4px;
    }

    // ── Pagination ───────────────────────────────────────────
    .pagination {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 6px;
      margin-top: 24px;
    }

    .page-btn {
      min-width: 36px;
      height: 36px;
      padding: 0 12px;
      border: 1.5px solid #e5e7eb;
      border-radius: 8px;
      background: #fff;
      font-size: 13px;
      font-weight: 500;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.15s;

      &:hover:not(:disabled) {
        border-color: #3b82f6;
        color: #3b82f6;
      }

      &.active-page {
        background: #1d4ed8;
        border-color: #1d4ed8;
        color: #fff;
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }

    // ── Footer ───────────────────────────────────────────────
    .footer {
      background: #fff;
      border-top: 1px solid #e5e7eb;
      margin-top: auto;
    }

    .footer-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px 24px;
      display: flex;
      justify-content: space-between;
      gap: 40px;
    }

    .footer-brand {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .store-badges {
      display: flex;
      gap: 10px;
    }

    .store-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: #111827;
      color: #fff;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;

      &:hover { background: #1f2937; }
    }

    .footer-links {
      display: flex;
      gap: 48px;
    }

    .footer-col {
      display: flex;
      flex-direction: column;
      gap: 8px;

      h4 {
        font-size: 13px;
        font-weight: 700;
        color: #111827;
        margin: 0 0 4px;
      }

      a {
        font-size: 13px;
        color: #6b7280;
        cursor: pointer;
        text-decoration: none;
        transition: color 0.15s;

        &:hover { color: #3b82f6; }
      }
    }

    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px 24px;
      border-top: 1px solid #f3f4f6;
      font-size: 12px;
      color: #9ca3af;
    }

    // ── Responsive ───────────────────────────────────────────
    @media (max-width: 768px) {
      .top-nav { display: none; }
      .header-inner { gap: 16px; }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .sub-nav-tabs { overflow-x: auto; }
      .sub-tab { padding: 0 16px; white-space: nowrap; }

      .footer-inner {
        flex-direction: column;
        gap: 24px;
      }

      .footer-links { flex-wrap: wrap; gap: 24px; }
    }
  `],
})
export class ShipmentsPageComponent implements OnInit, OnDestroy {
  protected readonly store = inject(ShipmentStore);
  private readonly service = inject(ShipmentService);
  private readonly destroy$ = new Subject<void>();

  readonly filteredShipments$ = this.store.filteredShipments$;

  get emptyTitle(): string {
    return this.store.searchQuery$.value
      ? 'No results found'
      : 'No shipments here yet';
  }

  get emptyDescription(): string {
    return this.store.searchQuery$.value
      ? `No shipments match "${this.store.searchQuery$.value}"`
      : 'Shipments will appear here once they are created.';
  }

  ngOnInit(): void {
    this.loadShipments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadShipments(): void {
    this.store.setLoading(true);
    this.service
      .getShipments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (shipments) => {
          this.store.setShipments(shipments);
          this.store.setLoading(false);
        },
        error: () => {
          this.store.setLoading(false);
        },
      });
  }

  onSearch(query: string): void {
    this.store.setSearch(query);
  }

  setTab(tab: ShipmentTabFilter): void {
    this.store.setTab(tab);
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }

  // Split into today/older for UI grouping
  todayShipments(shipments: ReturnType<typeof this.store.shipments>): typeof shipments {
    // In production this would compare real dates; here we show first 2 as "today"
    return shipments.slice(0, 2);
  }

  olderShipments(shipments: ReturnType<typeof this.store.shipments>): typeof shipments {
    return shipments.slice(2);
  }
}