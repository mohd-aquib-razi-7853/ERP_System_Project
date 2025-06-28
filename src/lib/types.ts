export interface Employee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  designation: string;
  doj: Date;
  status: 'Active' | 'Probation' | 'Terminated';
  personalInfo: {
    dob: Date;
    gender: string;
    maritalStatus: string;
    address: { permanent: string; temporary: string };
  };
  emergencyContact: { name: string; phone: string; relation: string };
  documents: string[]; 
}
export interface Attendance {
  employeeId: string;
  date: Date;
  inTime: string;
  outTime: string;
  hoursWorked: number;
  isLate: boolean;
  isOnLeave: boolean;
  isPresent: boolean;
}
export interface Leave {
  employeeId: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedAt: Date;
  approvedBy?: string;
}

export interface Payroll {
  employeeId: string;
  month: string;
  salaryStructure: {
    basic: number;
    hra: number;
    ta: number;
    otherAllowance: number;
    deductions: number;
    taxes: number;
  };
  netPay: number;
  status: 'Paid' | 'Pending';
  paidAt?: Date;
  payslipUrl?: string;
}

export interface JobApplication {
  candidateName: string;
  email: string;
  resumeUrl: string;
  position: string;
  status: 'Applied' | 'Interview Scheduled' | 'Selected' | 'Rejected';
}

export interface Account {
  _id: string;
  name: string;
  code: string;
  type: 'Asset' | 'Liability' | 'Income' | 'Expense' | 'Equity';
  parentAccount?: string;
  isActive: boolean;
}

export interface Transaction {
  _id: string;
  date: Date;
  type: 'Income' | 'Expense';
  description: string;
  amount: number;
  accountId: string; 
  paymentMethod: 'Cash' | 'Bank' | 'Online';
  referenceNo?: string;
  createdBy: string;
}
export interface Invoice {
  _id: string;
  customerId: string;
  date: Date;
  dueDate: Date;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    taxPercent: number;
    total: number;
  }[];
  subTotal: number;
  taxTotal: number;
  discount: number;
  totalAmount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  paymentDate?: Date;
  invoiceNumber: string;
}

export interface Purchase {
  _id: string;
  supplierId: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    taxPercent: number;
  }[];
  totalAmount: number;
  status: 'Paid' | 'Unpaid' | 'Partial';
  purchaseDate: Date;
  dueDate: Date;
  paymentHistory: {
    amount: number;
    date: Date;
    mode: 'Bank' | 'Cash';
  }[];
}

export interface BankTransaction {
  _id: string;
  bankAccountId: string;
  type: 'Deposit' | 'Withdrawal' | 'Transfer';
  amount: number;
  date: Date;
  description: string;
  fromAccount?: string;
  toAccount?: string;
}

interface Tax {
  _id: string;
  name: string;
  rate: number;
  type: 'GST' | 'TDS' | 'VAT' | 'Service Tax';
  applicableAccounts: string[];
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  categoryId: string;
  description?: string;
  unit: 'kg' | 'litre' | 'piece';
  currentStock: number;
  reorderLevel: number;
  price: number;
  status: 'active' | 'inactive';
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockMovement {
  _id: string;
  productId: string;
  type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  sourceLocation?: string;
  destinationLocation?: string;
  reason?: string;
  referenceNo?: string;
  date: Date;
  createdBy: string;
}
export interface Supplier {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber?: string;
  contactPerson?: string;
  paymentTerms?: string;
  createdAt: Date;
}
export interface PurchaseOrder {
  _id: string;
  supplierId: string;
  products: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  totalAmount: number;
  orderDate: Date;
  expectedDelivery: Date;
  status: 'Draft' | 'Sent' | 'Approved' | 'Received' | 'Cancelled';
  createdBy: string;
  notes?: string;
}
export interface GoodsReceipt {
  _id: string;
  purchaseOrderId: string;
  receivedDate: Date;
  receivedItems: {
    productId: string;
    quantityReceived: number;
    quantityRejected: number;
    remarks?: string;
  }[];
  createdBy: string;
}
export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  source: 'Website' | 'Referral' | 'Campaign' | 'Other';
  stage: 'New' | 'Contacted' | 'Quoted' | 'Negotiation' | 'Won' | 'Lost';
  assignedTo: string;
  notes: string[];
  createdAt: Date;
}
export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  billingAddress: string;
  shippingAddress?: string;
  tags: string[];
  status: 'Active' | 'Inactive' | 'Blacklisted';
  createdAt: Date;
}
export interface Quotation {
  _id: string;
  customerId: string;
  date: Date;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }[];
  totalAmount: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Expired';
  notes?: string;
  expiresAt?: Date;
}
export interface SalesOrder {
  _id: string;
  customerId: string;
  date: Date;
  products: {
    productId: string;
    quantity: number;
    unitPrice: number;
    tax?: number;
    discount?: number;
  }[];
  totalAmount: number;
  status: 'Draft' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Unpaid' | 'Partially Paid' | 'Paid';
  invoiceId?: string;
}
export interface Activity {
  _id: string;
  relatedTo: 'Lead' | 'Customer';
  relatedId: string;
  type: 'Call' | 'Meeting' | 'Email';
  description: string;
  date: Date;
  assignedTo: string;
  status: 'Pending' | 'Done';
}
export interface Project {
  _id: string;
  name: string;
  description: string;
  managerId: string;
  teamMemberIds: string[];
  startDate: Date;
  endDate: Date;
  status: 'Planned' | 'In Progress' | 'On Hold' | 'Completed';
  progress: number; 
  tags?: string[];
  attachments?: string[]; 
  createdAt: Date;
}

export interface Task {
  _id: string;
  projectId: string;
  title: string;
  description?: string;
  assignedTo: string[]; 
  status: 'To Do' | 'In Progress' | 'Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate: Date;
  startDate?: Date;
  attachments?: string[];
  comments?: {
    userId: string;
    comment: string;
    createdAt: Date;
  }[];
  createdAt: Date;
}
export interface TimeLog {
  _id: string;
  taskId: string;
  employeeId: string;
  date: Date;
  hoursSpent: number;
  note?: string;
}
export interface Asset {
  _id: string;
  assetId: string;
  name: string;
  category: string;
  description?: string;
  purchaseDate: Date;
  purchaseCost: number;
  assignedTo?: string;
  status: 'Available' | 'In Use' | 'Maintenance' | 'Disposed';
  location: string;
  warrantyExpiry?: Date;
  vendorId?: string;
  depreciationRate?: number;
  attachments?: string[];
  createdAt: Date;
}
export interface AssetAssignment {
  _id: string;
  assetId: string;
  employeeId: string;
  assignedDate: Date;
  returnedDate?: Date;
  assignedBy: string;
  remarks?: string;
}
export interface AssetMaintenance {
  _id: string;
  assetId: string;
  reportedDate: Date;
  issueDescription: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  resolutionDate?: Date;
  repairCost?: number;
  vendorId?: string;
  remarks?: string;
}
export interface AssetDisposal {
  _id: string;
  assetId: string;
  disposalDate: Date;
  method: 'Sold' | 'Scrapped' | 'Donated' | 'Lost';
  valueRecovered?: number;
  reason?: string;
  approvedBy: string;
}
export interface User {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'Admin' | 'Manager' | 'Employee' | 'HR' | 'Finance' | 'Sales';
  department?: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  lastLogin?: Date;
  createdAt: Date;
}
export interface AuditLog {
  _id: string;
  userId: string;
  action: string;
  module: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}
