export enum ShipmentStatus {
  PREPARATION = 'PREPARATION',
  TRANSIT = 'TRANSIT',
  ARRIVED = 'ARRIVED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export interface TimelineStep {
  label: string;
  date: string;
  completed: boolean;
  active: boolean;
}

export interface Shipment {
  id: string;
  customerName: string;
  productName: string;
  image: string;
  orderCount: number;
  weight: number; // kg
  deliveryDate: string;
  arrivalDate: string;
  status: ShipmentStatus;
  notes: string;
  receiverName: string;
  receiverPhone: string;
  receiverCity: string;
  receiverAddress: string;
  receiverCountry: string;
  timeline: TimelineStep[];
  orderDate: string;
  dimensions?: { length: number; width: number; height: number };
  category?: string;
  trackingNumber?: string;
}

export type ShipmentTabFilter = 'active' | 'delivered';

export const STATUS_LABELS: Record<ShipmentStatus, string> = {
  [ShipmentStatus.PREPARATION]: 'In Preparation',
  [ShipmentStatus.TRANSIT]: 'In Transit',
  [ShipmentStatus.ARRIVED]: 'Arrived',
  [ShipmentStatus.DELIVERED]: 'Delivered',
  [ShipmentStatus.CANCELLED]: 'Cancelled',
};

export const STATUS_COLORS: Record<ShipmentStatus, string> = {
  [ShipmentStatus.PREPARATION]: '#f59e0b',
  [ShipmentStatus.TRANSIT]: '#3b82f6',
  [ShipmentStatus.ARRIVED]: '#8b5cf6',
  [ShipmentStatus.DELIVERED]: '#10b981',
  [ShipmentStatus.CANCELLED]: '#ef4444',
};