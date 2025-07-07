import { LucideIcon } from "lucide-react";

export interface MenuItem {
  title: string;
  url: string;
  badge?: string;
  isActive?: boolean;
  subItems?: {
    title: string;
    url: string;
    isActive?: boolean;
  }[];
}

// types/inventory.ts

/**
 * Inventory Item Type
 */
export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: string;
  quantity: number;
  price?: number;
  cost?: number;
  warehouseId: string;
  reorderLevel: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated?: Date;
  barcode?: string;
  supplier?: string;
  location?: string; // Shelf/bin location
  notes?: string;
  imageUrl?: string;
}

/**
 * Warehouse Type
 */
export interface Warehouse {
  id: string;
  name: string;
  location: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  capacity: number;
  currentOccupancy: number;
  isActive: boolean;
}

/**
 * Inventory Movement Type
 */
export interface InventoryMovement {
  id: string;
  itemId: string;
  sku: string;
  itemName: string;
  movementType: 'Purchase' | 'Sale' | 'Transfer' | 'Adjustment' | 'Return';
  quantity: number;
  fromWarehouse?: string;
  toWarehouse?: string;
  referenceNumber?: string;
  date: Date;
  userId: string;
  userName: string;
  notes?: string;
}

/**
 * Inventory Report Type
 */
export interface InventoryReport {
  id: string;
  name: string;
  type: 'Stock Level' | 'Valuation' | 'Movement' | 'Aging';
  dateGenerated: Date;
  parameters: Record<string, any>;
  downloadUrl?: string;
}

/**
 * Inventory Transfer Request Type
 */
export interface TransferRequest {
  id: string;
  itemId: string;
  sku: string;
  itemName: string;
  quantity: number;
  fromWarehouseId: string;
  toWarehouseId: string;
  requestedBy: string;
  requestDate: Date;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  completedDate?: Date;
  notes?: string;
}

/**
 * Inventory Adjustment Type
 */
export interface InventoryAdjustment {
  id: string;
  itemId: string;
  sku: string;
  itemName: string;
  adjustmentType: 'Increase' | 'Decrease';
  quantity: number;
  warehouseId: string;
  reason: string;
  date: Date;
  userId: string;
  userName: string;
  notes?: string;
}

/**
 * Supplier Type
 */
export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  leadTime: number; // in days
  paymentTerms: string;
  isActive: boolean;
}

/**
 * Inventory Category Type
 */
export interface InventoryCategory {
  id: string;
  name: string;
  parentCategoryId?: string;
  description?: string;
}

/**
 * Inventory Alert Type
 */
export interface InventoryAlert {
  id: string;
  itemId: string;
  sku: string;
  itemName: string;
  alertType: 'Low Stock' | 'Out of Stock' | 'Expiry' | 'Excess Stock';
  warehouseId: string;
  currentQuantity: number;
  threshold: number;
  dateTriggered: Date;
  isResolved: boolean;
  resolvedDate?: Date;
  resolvedBy?: string;
}

/**
 * Dashboard Statistics Type
 */
export interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalWarehouses: number;
  recentMovements: InventoryMovement[];
  criticalAlerts: InventoryAlert[];
}

/**
 * API Response Types
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Filter Options for Inventory
 */
export interface InventoryFilterOptions {
  warehouseId?: string;
  category?: string;
  status?: 'In Stock' | 'Low Stock' | 'Out of Stock';
  minQuantity?: number;
  maxQuantity?: number;
  searchQuery?: string;
  sortBy?: 'name' | 'quantity' | 'warehouse' | 'category';
  sortOrder?: 'asc' | 'desc';
}

/**
 * New Inventory Item Form Type
 */
export interface NewInventoryItem {
  sku: string;
  name: string;
  description?: string;
  category: string;
  quantity: number;
  price?: number;
  cost?: number;
  warehouseId: string;
  reorderLevel: number;
  barcode?: string;
  supplier?: string;
  location?: string;
  notes?: string;
}