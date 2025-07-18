"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2, Save } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

// Zod schema for validation
const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Price must be positive"),
  taxRate: z.number().min(0, "Tax rate must be positive").max(100, "Tax rate can't exceed 100%")
});

const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  date: z.date(),
  dueDate: z.date(),
  customer: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    address: z.string().min(1, "Address is required")
  }),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required")
});

type Invoice = z.infer<typeof invoiceSchema>;
type InvoiceItem = z.infer<typeof invoiceItemSchema>;

const InvoiceCreatePage = () => {
  const { register, handleSubmit, formState: { errors }, control, setValue, watch, trigger } = useForm<Invoice>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      customer: {
        name: '',
        email: '',
        address: ''
      },
      items: []
    }
  });

  const items = watch("items") || [];

  const addItem = () => {
    const newItem: InvoiceItem = {
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 0
    };
    setValue("items", [...items, newItem]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setValue("items", newItems);
  };

  const calculateItemTax = (item: InvoiceItem) => item.quantity * item.unitPrice * (item.taxRate / 100);
  const calculateItemTotal = (item: InvoiceItem) => item.quantity * item.unitPrice + calculateItemTax(item);
  const calculateSubtotal = () => items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const calculateTotalTax = () => items.reduce((sum, item) => sum + calculateItemTax(item), 0);
  const calculateGrandTotal = () => calculateSubtotal() + calculateTotalTax();

  const onSubmit = (data: Invoice) => {
    console.log('Valid Invoice Data:', data);
    // Add API call or further logic here
    alert('Invoice saved successfully!');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 md:p-6"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <motion.section
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Create Invoice</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Invoice Number</label>
                  <Input
                    {...register("invoiceNumber")}
                    className="w-full"
                    readOnly
                  />
                  {errors.invoiceNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.invoiceNumber.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !watch("date") && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {watch("date") ? format(watch("date"), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={watch("date")}
                        onSelect={(date) => date && setValue("date", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Due Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !watch("dueDate") && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {watch("dueDate") ? format(watch("dueDate"), "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={watch("dueDate")}
                        onSelect={(date) => date && setValue("dueDate", date)}
                        initialFocus
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
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    {...register("customer.name")}
                    className="w-full"
                    placeholder="John Doe"
                  />
                  {errors.customer?.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.customer.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    {...register("customer.email")}
                    className="w-full"
                    placeholder="john@example.com"
                    type="email"
                  />
                  {errors.customer?.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.customer.email.message}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <Textarea
                    {...register("customer.address")}
                    className="w-full"
                    placeholder="123 Main St, City, Country"
                    rows={3}
                  />
                  {errors.customer?.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.customer.address.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Items Table */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-xl font-semibold">Items</CardTitle>
                <Button
                  type="button"
                  onClick={addItem}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  {items.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      No items added yet.
                    </motion.div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-24">Qty</TableHead>
                          <TableHead className="w-32">Unit Price</TableHead>
                          <TableHead className="w-32">Tax Rate (%)</TableHead>
                          <TableHead className="w-32">Tax Amount</TableHead>
                          <TableHead className="w-32">Total</TableHead>
                          <TableHead className="w-16">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence>
                          {items.map((_, index) => (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-b dark:border-gray-700"
                            >
                              <TableCell>
                                <Input
                                  {...register(`items.${index}.description` as const)}
                                  className="w-full"
                                  onBlur={() => trigger(`items.${index}.description`)}
                                />
                                {errors.items?.[index]?.description && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {errors.items[index]?.description?.message}
                                  </p>
                                )}
                              </TableCell>
                              
                              <TableCell>
                                <Input
                                  {...register(`items.${index}.quantity` as const, {
                                    valueAsNumber: true
                                  })}
                                  className="w-full"
                                  type="number"
                                  min="1"
                                  step="1"
                                  onBlur={() => trigger(`items.${index}.quantity`)}
                                />
                                {errors.items?.[index]?.quantity && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {errors.items[index]?.quantity?.message}
                                  </p>
                                )}
                              </TableCell>
                              
                              <TableCell>
                                <Input
                                  {...register(`items.${index}.unitPrice` as const, {
                                    valueAsNumber: true
                                  })}
                                  className="w-full"
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  onBlur={() => trigger(`items.${index}.unitPrice`)}
                                />
                                {errors.items?.[index]?.unitPrice && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {errors.items[index]?.unitPrice?.message}
                                  </p>
                                )}
                              </TableCell>
                              
                              <TableCell>
                                <Input
                                  {...register(`items.${index}.taxRate` as const, {
                                    valueAsNumber: true
                                  })}
                                  className="w-full"
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.1"
                                  onBlur={() => trigger(`items.${index}.taxRate`)}
                                />
                                {errors.items?.[index]?.taxRate && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {errors.items[index]?.taxRate?.message}
                                  </p>
                                )}
                              </TableCell>
                              
                              <TableCell>
                                {calculateItemTax(items[index]).toFixed(2)}
                              </TableCell>
                              
                              <TableCell>
                                {calculateItemTotal(items[index]).toFixed(2)}
                              </TableCell>
                              
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeItem(index)}
                                  className="text-red-500 hover:text-red-700"
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
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.section>

          {/* Summary */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Tax</span>
                  <span>{calculateTotalTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t dark:border-gray-700">
                  <span>Grand Total</span>
                  <span>{calculateGrandTotal().toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end"
          >
            <Button
              type="submit"
              className="gap-2"
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