"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingCart, 
  Package,
  User,
  Calendar as CalendarIcon,
  MapPin,
  CreditCard,
  Truck,
  ChevronDown,
  ArrowLeft,
  Save,
  Plus,
  X,
  Phone,
  Mail,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Define order schema with Zod
const orderFormSchema = z.object({
  customer: z.object({
    id: z.string().min(1, "Customer is required"),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(1, "Phone is required"),
  }),
  shippingAddress: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  items: z.array(
    z.object({
      productId: z.string().min(1, "Product is required"),
      name: z.string().min(1, "Product name is required"),
      price: z.number().min(0.01, "Price must be greater than 0"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
    })
  ).min(1, "At least one item is required"),
  payment: z.object({
    method: z.enum(["credit_card", "paypal", "bank_transfer", "cash_on_delivery"]),
    status: z.enum(["pending", "completed", "failed", "refunded"]),
    transactionId: z.string().optional(),
  }),
  shipping: z.object({
    method: z.enum(["standard", "express", "priority", "pickup"]),
    cost: z.number().min(0, "Shipping cost cannot be negative"),
    estimatedDelivery: z.date().optional(),
    trackingNumber: z.string().optional(),
  }),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
  notes: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

const mockCustomers = [
  { id: "cus_001", name: "John Doe", email: "john@example.com", phone: "555-0101" },
  { id: "cus_002", name: "Jane Smith", email: "jane@example.com", phone: "555-0102" },
  { id: "cus_003", name: "Robert Johnson", email: "robert@example.com", phone: "555-0103" },
];

const mockProducts = [
  { id: "prod_001", name: "Premium Headphones", price: 199.99 },
  { id: "prod_002", name: "Wireless Keyboard", price: 89.99 },
  { id: "prod_003", name: "Ergonomic Mouse", price: 59.99 },
  { id: "prod_004", name: "4K Monitor", price: 349.99 },
];

export default function CreateOrderPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    customer: true,
    items: true,
    shipping: true,
    payment: true,
    notes: false
  });

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customer: {
        id: "",
        name: "",
        email: "",
        phone: ""
      },
      shippingAddress: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "United States"
      },
      items: [],
      payment: {
        method: "credit_card",
        status: "pending",
        transactionId: ""
      },
      shipping: {
        method: "standard",
        cost: 0,
        estimatedDelivery: undefined,
        trackingNumber: ""
      },
      status: "pending",
      notes: ""
    }
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const onSubmit = (data: OrderFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Order created:', data);
      
      toast.success('Order created successfully', {
        description: `Order #${Math.floor(Math.random() * 10000)} has been created.`,
        action: {
          label: 'View Orders',
          onClick: () => router.push('/admin/orders')
        }
      });
      
      setIsSubmitting(false);
      router.push('/admin/orders');
    }, 1500);
  };

  const addItem = () => {
    const items = form.getValues("items");
    form.setValue("items", [
      ...items,
      {
        productId: "",
        name: "",
        price: 0,
        quantity: 1
      }
    ]);
  };

  const removeItem = (index: number) => {
    const items = form.getValues("items");
    form.setValue("items", items.filter((_, i) => i !== index));
  };

  const handleCustomerSelect = (customerId: string) => {
    const customer = mockCustomers.find(c => c.id === customerId);
    if (customer) {
      form.setValue("customer", {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      });
    }
  };

  const handleProductSelect = (index: number, productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      form.setValue(`items.${index}`, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: form.getValues(`items.${index}.quantity`) || 1
      });
    }
  };

  // Calculate order total
  const calculateTotal = () => {
    const items = form.getValues("items");
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = form.getValues("shipping.cost") || 0;
    return subtotal + shipping;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-950 overflow-scroll no-scrollbar">
      <motion.div 
        className="flex-1 p-6 max-w-6xl w-full mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div>
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-6 hover:bg-gray-800/50 group transition-all hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Orders
          </Button>
        </motion.div>

        <motion.div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
            Create New Order
          </h1>
          <p className="text-gray-400">
            Fill in the details below to create a new order
          </p>
        </motion.div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer Information Section */}
            <motion.div 
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
            >
              <div 
                className="p-5 cursor-pointer flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                onClick={() => toggleSection('customer')}
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-500/10 mr-4">
                    <User className="h-5 w-5 text-blue-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">
                    Customer Information
                  </h2>
                </div>
                <ChevronDown className={cn(
                  "h-5 w-5 text-gray-400 transition-transform duration-300",
                  !expandedSections.customer && "transform -rotate-90"
                )} />
              </div>
              
              <AnimatePresence>
                {expandedSections.customer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-5 pb-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Customer Selection */}
                      <FormField
                        control={form.control}
                        name="customer.id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Customer*</FormLabel>
                            <Select onValueChange={(value) => {
                              field.onChange(value);
                              handleCustomerSelect(value);
                            }} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800/70">
                                  <SelectValue placeholder="Select a customer" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-gray-800 border-gray-700 text-gray-300">
                                {mockCustomers.map(customer => (
                                  <SelectItem key={customer.id} value={customer.id}>
                                    {customer.name} ({customer.email})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Customer Name */}
                      <FormField
                        control={form.control}
                        name="customer.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Full Name*</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  placeholder="John Doe"
                                  className="pl-10 bg-gray-800/50 border-gray-700"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Customer Email */}
                      <FormField
                        control={form.control}
                        name="customer.email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Email*</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  placeholder="john@example.com"
                                  className="pl-10 bg-gray-800/50 border-gray-700"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Customer Phone */}
                      <FormField
                        control={form.control}
                        name="customer.phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Phone*</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  placeholder="555-0101"
                                  className="pl-10 bg-gray-800/50 border-gray-700"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-6">
                      <h3 className="text-md font-semibold text-white mb-4 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-blue-400" />
                        Shipping Address
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Street Address */}
                        <FormField
                          control={form.control}
                          name="shippingAddress.street"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Street Address*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="123 Main St"
                                  className="bg-gray-800/50 border-gray-700"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* City */}
                        <FormField
                          control={form.control}
                          name="shippingAddress.city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">City*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="New York"
                                  className="bg-gray-800/50 border-gray-700"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* State */}
                        <FormField
                          control={form.control}
                          name="shippingAddress.state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">State/Province*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="NY"
                                  className="bg-gray-800/50 border-gray-700"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Postal Code */}
                        <FormField
                          control={form.control}
                          name="shippingAddress.postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Postal Code*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="10001"
                                  className="bg-gray-800/50 border-gray-700"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Country */}
                        <FormField
                          control={form.control}
                          name="shippingAddress.country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Country*</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800/70">
                                    <SelectValue placeholder="Select a country" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-300">
                                    <SelectItem value="United States">United States</SelectItem>
                                    <SelectItem value="Canada">Canada</SelectItem>
                                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                    <SelectItem value="Australia">Australia</SelectItem>
                                    <SelectItem value="Germany">Germany</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Order Items Section */}
            <motion.div 
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
            >
              <div 
                className="p-5 cursor-pointer flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                onClick={() => toggleSection('items')}
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-purple-500/10 mr-4">
                    <ShoppingCart className="h-5 w-5 text-purple-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">
                    Order Items
                  </h2>
                  <Badge variant="outline" className="ml-3 bg-purple-500/10 text-purple-400 border-purple-500/30">
                    {form.watch("items")?.length || 0} items
                  </Badge>
                </div>
                <ChevronDown className={cn(
                  "h-5 w-5 text-gray-400 transition-transform duration-300",
                  !expandedSections.items && "transform -rotate-90"
                )} />
              </div>
              
              <AnimatePresence>
                {expandedSections.items && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-5 pb-5"
                  >
                    {form.watch("items")?.map((item, index) => (
                      <div key={index} className="mb-6 last:mb-0 p-4 bg-gray-800/20 rounded-lg border border-gray-700/50">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-md font-medium text-white">Item #{index + 1}</h3>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-rose-500 hover:bg-rose-500/10 hover:text-rose-400"
                            onClick={() => removeItem(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Product Selection */}
                          <FormField
                            control={form.control}
                            name={`items.${index}.productId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Product*</FormLabel>
                                <Select 
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    handleProductSelect(index, value);
                                  }} 
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800/70">
                                      <SelectValue placeholder="Select a product" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-300">
                                    {mockProducts.map(product => (
                                      <SelectItem key={product.id} value={product.id}>
                                        {product.name} (${product.price.toFixed(2)})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Quantity */}
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Quantity*</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="1"
                                    className="bg-gray-800/50 border-gray-700"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Price */}
                          <FormField
                            control={form.control}
                            name={`items.${index}.price`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Price*</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                    <Input
                                      type="number"
                                      min="0.01"
                                      step="0.01"
                                      className="pl-8 bg-gray-800/50 border-gray-700"
                                      {...field}
                                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="mt-3 text-right">
                          <span className="text-sm text-gray-400">
                            Subtotal: ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2 bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 text-gray-300"
                      onClick={addItem}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Shipping & Payment Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Shipping Method */}
              <motion.div 
                className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
              >
                <div 
                  className="p-5 cursor-pointer flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                  onClick={() => toggleSection('shipping')}
                >
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-cyan-500/10 mr-4">
                      <Truck className="h-5 w-5 text-cyan-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">
                      Shipping Method
                    </h2>
                  </div>
                  <ChevronDown className={cn(
                    "h-5 w-5 text-gray-400 transition-transform duration-300",
                    !expandedSections.shipping && "transform -rotate-90"
                  )} />
                </div>
                
                <AnimatePresence>
                  {expandedSections.shipping && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 pb-5"
                    >
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="shipping.method"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Shipping Method*</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800/70">
                                    <SelectValue placeholder="Select shipping method" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-gray-800 border-gray-700 text-gray-300">
                                  <SelectItem value="standard">Standard (3-5 business days)</SelectItem>
                                  <SelectItem value="express">Express (1-2 business days)</SelectItem>
                                  <SelectItem value="priority">Priority (next business day)</SelectItem>
                                  <SelectItem value="pickup">Store Pickup</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="shipping.cost"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Shipping Cost*</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="pl-8 bg-gray-800/50 border-gray-700"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="shipping.estimatedDelivery"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Estimated Delivery</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full justify-start text-left font-normal bg-gray-800/50 border-gray-700 hover:bg-gray-800/70",
                                        !field.value && "text-gray-400"
                                      )}
                                    >
                                      <CalendarIcon className="h-4 w-4 mr-2" />
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                    className="bg-gray-800"
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="shipping.trackingNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Tracking Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Optional"
                                  className="bg-gray-800/50 border-gray-700"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Payment Information */}
              <motion.div 
                className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
              >
                <div 
                  className="p-5 cursor-pointer flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                  onClick={() => toggleSection('payment')}
                >
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-emerald-500/10 mr-4">
                      <CreditCard className="h-5 w-5 text-emerald-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">
                      Payment Information
                    </h2>
                  </div>
                  <ChevronDown className={cn(
                    "h-5 w-5 text-gray-400 transition-transform duration-300",
                    !expandedSections.payment && "transform -rotate-90"
                  )} />
                </div>
                
                <AnimatePresence>
                  {expandedSections.payment && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 pb-5"
                    >
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="payment.method"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Payment Method*</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800/70">
                                    <SelectValue placeholder="Select payment method" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-gray-800 border-gray-700 text-gray-300">
                                  <SelectItem value="credit_card">Credit Card</SelectItem>
                                  <SelectItem value="paypal">PayPal</SelectItem>
                                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                  <SelectItem value="cash_on_delivery">Cash on Delivery</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="payment.status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Payment Status*</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800/70">
                                    <SelectValue placeholder="Select payment status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-gray-800 border-gray-700 text-gray-300">
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="failed">Failed</SelectItem>
                                  <SelectItem value="refunded">Refunded</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="payment.transactionId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Transaction ID</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Optional"
                                  className="bg-gray-800/50 border-gray-700"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Order Status*</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800/70">
                                    <SelectValue placeholder="Select order status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-gray-800 border-gray-700 text-gray-300">
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Order Summary & Notes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Summary */}
              <motion.div 
                className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 lg:col-span-2"
              >
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-amber-400" />
                  Order Summary
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">
                      ${form.watch("items")?.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-white">
                      ${form.watch("shipping.cost")?.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-gray-700/50 my-2"></div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-white">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Order Notes */}
              <motion.div 
                className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
              >
                <div 
                  className="p-5 cursor-pointer flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                  onClick={() => toggleSection('notes')}
                >
                  <div className="flex items-center">
                    <div className="p-2 rounded-lg bg-violet-500/10 mr-4">
                      <Edit className="h-5 w-5 text-violet-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">
                      Order Notes
                    </h2>
                  </div>
                  <ChevronDown className={cn(
                    "h-5 w-5 text-gray-400 transition-transform duration-300",
                    !expandedSections.notes && "transform -rotate-90"
                  )} />
                </div>
                
                <AnimatePresence>
                  {expandedSections.notes && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 pb-5"
                    >
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <textarea
                                placeholder="Any special instructions or notes about this order..."
                                className="w-full min-h-[100px] bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-sm text-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Form Actions */}
            <motion.div 
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
            >
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-blue-500/20"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Order
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}