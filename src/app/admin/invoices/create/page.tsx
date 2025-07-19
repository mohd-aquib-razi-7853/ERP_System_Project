"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Plus,
  Trash2,
  Save,
  User,
  Mail,
  MapPin,
  ChevronDown,
  ShoppingCart,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Zod schema for validation
const invoiceItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0.01, "Price must be positive"),
  taxRate: z
    .number()
    .min(0, "Tax rate must be positive")
    .max(100, "Tax rate can't exceed 100%"),
});

const invoiceSchema = z.object({
  invoiceNumber: z.number().min(1, "Invoice number is required"),
  date: z.date(),
  dueDate: z.date(),
  status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]),
  customer: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    address: z.string().min(1, "Address is required"),
    phone: z.string().optional(),
  }),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
  notes: z.string().optional(),
  terms: z.string().optional(),
});

type Invoice = z.infer<typeof invoiceSchema>;
type InvoiceItem = z.infer<typeof invoiceItemSchema>;

const InvoiceCreatePage = () => {
  const [expandedSections, setExpandedSections] = useState({
    customer: true,
    items: true,
    summary: true,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<Invoice>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceNumber: Math.floor(Math.random() * 10000),
      date: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: "draft",
      customer: {
        name: "",
        email: "",
        address: "",
        phone: "",
      },
      items: [],
      notes: "",
      terms: "Payment due within 30 days of invoice date.",
    },
  });

  const items = watch("items") || [];
  const status = watch("status");

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      description: "",
      quantity: 1,
      unitPrice: 0,
      taxRate: 0,
    };
    setValue("items", [...items, newItem]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setValue("items", newItems);
  };

  const calculateItemTax = (item: InvoiceItem) =>
    item.quantity * item.unitPrice * (item.taxRate / 100);
  const calculateItemTotal = (item: InvoiceItem) =>
    item.quantity * item.unitPrice + calculateItemTax(item);
  const calculateSubtotal = () =>
    items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const calculateTotalTax = () =>
    items.reduce((sum, item) => sum + calculateItemTax(item), 0);
  const calculateGrandTotal = () => calculateSubtotal() + calculateTotalTax();

  const onSubmit = (data: Invoice) => {
    console.log("Valid Invoice Data:", data);
    // Add API call or further logic here
    alert("Invoice saved successfully!");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen bg-gray-950 text-gray-100 p-4 md:p-8 overflow-scroll no-scrollbar"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <motion.section
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gray-900 border-gray-800 shadow-2xl">
              <CardHeader className="flex flex-row justify-between items-center border-b border-gray-800 pb-4">
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Create Invoice
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={cn(
                      "mt-2 border-0 font-mono",
                      status === "draft" && "bg-gray-800 text-gray-300",
                      status === "sent" && "bg-blue-900/50 text-blue-300",
                      status === "paid" && "bg-green-900/50 text-green-300",
                      status === "overdue" && "bg-red-900/50 text-red-300",
                      status === "cancelled" && "bg-gray-800 text-gray-400"
                    )}
                  >
                    {status?.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setValue("status", "draft")}
                    className={cn(
                      "text-xs text-white border-gray-700 hover:bg-gray-900/30 bg-gray-900 hover:text-white",
                      status === "draft" && "bg-gray-800 text-white"
                    )}
                  >
                    Draft
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setValue("status", "sent")}
                    className={cn(
                      "text-xs   hover:text-gray-200  border-gray-700 hover:bg-gray-900/30",
                      status === "sent" && "bg-blue-900/30 text-gray-300"
                    )}
                  >
                    Sent
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setValue("status", "paid")}
                    className={cn(
                      "text-xs border-gray-700 hover:bg-gray-900/30 hover:text-white",
                      status === "paid" && "bg-green-900/30 text-green-300"
                    )}
                  >
                    Paid
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-400">
                    Invoice Number
                  </label>
                  <Input
                    {...register("invoiceNumber")}
                    className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.invoiceNumber && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.invoiceNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-400">
                    Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-gray-800 border-gray-700 hover:bg-gray-700 text-white",
                          !watch("date") && "text-gray-400"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-blue-400" />
                        {watch("date") ? (
                          format(watch("date"), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                      <Calendar
                        mode="single"
                        selected={watch("date")}
                        onSelect={(date) => date && setValue("date", date)}
                        initialFocus
                        className="bg-gray-800 text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-400">
                    Due Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-gray-800 border-gray-700 hover:bg-gray-700 text-white",
                          !watch("dueDate") && "text-gray-400"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-purple-400" />
                        {watch("dueDate") ? (
                          format(watch("dueDate"), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                      <Calendar
                        mode="single"
                        selected={watch("dueDate")}
                        onSelect={(date) => date && setValue("dueDate", date)}
                        initialFocus
                        className="bg-gray-800 text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Customer Information */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gray-900 border-gray-800 shadow-2xl">
              <CardHeader
                className="flex flex-row items-center justify-between cursor-pointer hover:bg-gray-800/50 rounded-lg transition-colors p-4"
                onClick={() => toggleSection("customer")}
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-900/30 mr-3">
                    <User className="h-5 w-5 text-blue-400" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-white">
                    Customer Information
                  </CardTitle>
                </div>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-gray-400 transition-transform",
                    !expandedSections.customer && "transform -rotate-90"
                  )}
                />
              </CardHeader>

              <AnimatePresence>
                {expandedSections.customer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-0">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-400">
                          Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            {...register("customer.name")}
                            className="w-full pl-10 bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="John Doe"
                          />
                        </div>
                        {errors.customer?.name && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.customer.name.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-400">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            {...register("customer.email")}
                            className="w-full pl-10 bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="john@example.com"
                            type="email"
                          />
                        </div>
                        {errors.customer?.email && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.customer.email.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-400">
                          Phone
                        </label>
                        <Input
                          {...register("customer.phone")}
                          className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="+1 (555) 123-4567"
                          type="tel"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2 text-gray-400">
                          Address
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                          <Textarea
                            {...register("customer.address")}
                            className="w-full pl-10 bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="123 Main St, City, Country"
                            rows={3}
                          />
                        </div>
                        {errors.customer?.address && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.customer.address.message}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.section>

          {/* Items Table */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gray-900 border-gray-800 shadow-2xl">
              <CardHeader
                className="flex flex-row items-center justify-between cursor-pointer hover:bg-gray-800/50 rounded-lg transition-colors p-4"
                onClick={() => toggleSection("items")}
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-purple-900/30 mr-3">
                    <ShoppingCart className="h-5 w-5 text-purple-400" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-white">
                    Invoice Items
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="ml-3 bg-purple-900/30 text-purple-300 border-purple-800"
                  >
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </Badge>
                </div>
                <div className="flex items-center">
                  <Button
                    type="button"
                    onClick={addItem}
                    className="gap-2 mr-4 bg-purple-600 hover:bg-purple-700 text-white"
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-gray-400 transition-transform",
                      !expandedSections.items && "transform -rotate-90"
                    )}
                  />
                </div>
              </CardHeader>

              <AnimatePresence>
                {expandedSections.items && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="pt-0">
                      {items.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="p-4 text-center text-gray-500 bg-gray-800/30 rounded-lg"
                        >
                          No items added yet. Click "Add Item" to get started.
                        </motion.div>
                      ) : (
                        <Table className="border-separate border-spacing-y-2">
                          <TableHeader>
                            <TableRow className="hover:bg-transparent border-b border-gray-800">
                              <TableHead className="w-[300px] text-gray-400">
                                Description
                              </TableHead>
                              <TableHead className="w-24 text-gray-400">
                                Qty
                              </TableHead>
                              <TableHead className="w-32 text-gray-400">
                                Unit Price
                              </TableHead>
                              <TableHead className="w-32 text-gray-400">
                                Tax Rate (%)
                              </TableHead>
                              <TableHead className="w-32 text-gray-400">
                                Amount
                              </TableHead>
                              <TableHead className="w-16 text-gray-400">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <AnimatePresence>
                              {items.map((_, index) => (
                                <motion.tr
                                  key={index}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="bg-gray-800/50 hover:bg-gray-800/70 rounded-lg overflow-hidden"
                                >
                                  <TableCell className="rounded-l-lg border-l border-gray-700">
                                    <Input
                                      {...register(
                                        `items.${index}.description` as const
                                      )}
                                      className="w-full bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      onBlur={() =>
                                        trigger(`items.${index}.description`)
                                      }
                                      placeholder="Item description"
                                    />
                                    {errors.items?.[index]?.description && (
                                      <p className="text-red-400 text-xs mt-1">
                                        {
                                          errors.items[index]?.description
                                            ?.message
                                        }
                                      </p>
                                    )}
                                  </TableCell>

                                  <TableCell className="border-t border-b border-gray-700">
                                    <Input
                                      {...register(
                                        `items.${index}.quantity` as const,
                                        {
                                          valueAsNumber: true,
                                        }
                                      )}
                                      className="w-full bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      type="number"
                                      min="1"
                                      step="1"
                                      onBlur={() =>
                                        trigger(`items.${index}.quantity`)
                                      }
                                    />
                                    {errors.items?.[index]?.quantity && (
                                      <p className="text-red-400 text-xs mt-1">
                                        {errors.items[index]?.quantity?.message}
                                      </p>
                                    )}
                                  </TableCell>

                                  <TableCell className="border-t border-b border-gray-700">
                                    <Input
                                      {...register(
                                        `items.${index}.unitPrice` as const,
                                        {
                                          valueAsNumber: true,
                                        }
                                      )}
                                      className="w-full bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      type="number"
                                      min="0.01"
                                      step="0.01"
                                      onBlur={() =>
                                        trigger(`items.${index}.unitPrice`)
                                      }
                                    />
                                    {errors.items?.[index]?.unitPrice && (
                                      <p className="text-red-400 text-xs mt-1">
                                        {
                                          errors.items[index]?.unitPrice
                                            ?.message
                                        }
                                      </p>
                                    )}
                                  </TableCell>

                                  <TableCell className="border-t border-b border-gray-700">
                                    <Input
                                      {...register(
                                        `items.${index}.taxRate` as const,
                                        {
                                          valueAsNumber: true,
                                        }
                                      )}
                                      className="w-full bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      type="number"
                                      min="0"
                                      max="100"
                                      step="0.1"
                                      onBlur={() =>
                                        trigger(`items.${index}.taxRate`)
                                      }
                                    />
                                    {errors.items?.[index]?.taxRate && (
                                      <p className="text-red-400 text-xs mt-1">
                                        {errors.items[index]?.taxRate?.message}
                                      </p>
                                    )}
                                  </TableCell>

                                  <TableCell className="border-t border-b border-gray-700 font-medium text-white">
                                    $
                                    {calculateItemTotal(items[index]).toFixed(
                                      2
                                    )}
                                  </TableCell>

                                  <TableCell className="rounded-r-lg border-r border-gray-700">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeItem(index)}
                                      className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </motion.tr>
                              ))}
                            </AnimatePresence>
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.section>

          {/* Summary & Notes */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gray-900 border-gray-800 shadow-2xl">
              <CardHeader
                className="flex flex-row items-center justify-between cursor-pointer hover:bg-gray-800/50 rounded-lg transition-colors p-4"
                onClick={() => toggleSection("summary")}
              >
                <CardTitle className="text-lg font-semibold text-white">
                  Summary & Notes
                </CardTitle>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-gray-400 transition-transform",
                    !expandedSections.summary && "transform -rotate-90"
                  )}
                />
              </CardHeader>

              <AnimatePresence>
                {expandedSections.summary && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-0">
                      <div className="space-y-4">
                        <h3 className="font-medium text-white">Summary</h3>
                        <div className="space-y-3 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                          <div className="flex justify-between text-gray-300">
                            <span>Subtotal</span>
                            <span>${calculateSubtotal().toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-gray-300">
                            <span>Tax</span>
                            <span>${calculateTotalTax().toFixed(2)}</span>
                          </div>
                          <div className="border-t border-gray-700 my-2"></div>
                          <div className="flex justify-between font-bold text-lg text-white">
                            <span>Total</span>
                            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                              ${calculateGrandTotal().toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-400">
                            Notes
                          </label>
                          <Textarea
                            {...register("notes")}
                            className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Additional notes for the customer"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-400">
                            Terms & Conditions
                          </label>
                          <Textarea
                            {...register("terms")}
                            className="w-full bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Payment terms and conditions"
                            rows={3}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.section>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end gap-4 pt-4"
          >
            <Button
              type="button"
              variant="outline"
              className="border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Discard
            </Button>
            <Button
              type="submit"
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            >
              <Save className="h-4 w-4" />
              Save Invoice
            </Button>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
};

export default InvoiceCreatePage;
