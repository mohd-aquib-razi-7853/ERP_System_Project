"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard,
  Calendar as CalendarIcon,
  FileText,
  ChevronDown,
  ArrowLeft,
  Save,
  WalletCards,
  BadgePercent,
  Globe
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
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { z } from 'zod';

// Zod schema definition
const customerSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  contactPerson: z.string().min(2, "Contact person must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(6, "Phone number must be at least 6 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  taxId: z.string().optional(),
  paymentTerms: z.enum(["net15", "net30", "net60", "cod"]),
  creditLimit: z.string().optional(),
  currency: z.string(),
  customerType: z.enum(["retail", "wholesale", "corporate"]),
  customerSince: z.date().optional(),
  notes: z.string().optional()
});

type CustomerFormData = z.infer<typeof customerSchema>;

export default function AddCustomerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CustomerFormData>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    taxId: '',
    paymentTerms: 'net30',
    creditLimit: '',
    currency: 'USD',
    customerType: 'retail',
    customerSince: undefined,
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    address: true,
    billing: true,
    additional: true
  });

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD'];
  const countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Japan'];

  const validateForm = () => {
    try {
      customerSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Customer submitted:', formData);
      
      toast.success('Customer added successfully', {
        description: `${formData.companyName} has been added to the system.`,
        action: {
          label: 'View',
          onClick: () => router.push('/admin/sales/customers')
        }
      });
      
      setIsSubmitting(false);
      router.push('/admin/sales/customers');
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: keyof CustomerFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name: keyof CustomerFormData, date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const sectionVariants = {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' },
    visible: { opacity: 1, height: 'auto', overflow: 'visible' }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-950 overflow-scroll no-scrollbar">
      <motion.div 
        className="flex-1 p-6 max-w-6xl w-full mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-6 hover:bg-gray-800/50 group transition-all"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Customers
          </Button>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Add New Customer
          </h1>
          <p className="text-gray-400">
            Fill in the details below to add a new customer to your system
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Information Section */}
            <motion.div 
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
              variants={itemVariants}
            >
              <div 
                className="p-5 cursor-pointer flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                onClick={() => toggleSection('basic')}
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-indigo-500/10 mr-4">
                    <Building2 className="h-5 w-5 text-indigo-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">
                    Basic Information
                  </h2>
                </div>
                <ChevronDown className={cn(
                  "h-5 w-5 text-gray-400 transition-transform duration-300",
                  !expandedSections.basic && "transform -rotate-90"
                )} />
              </div>
              
              <AnimatePresence>
                {expandedSections.basic && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={sectionVariants}
                    transition={{ duration: 0.3 }}
                    className="px-5 pb-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {/* Company Name */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="companyName" className="block mb-2 text-gray-300">
                          Company Name*
                        </Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="companyName"
                            name="companyName"
                            placeholder="Acme Inc."
                            className={cn(
                              "pl-10 bg-gray-800/50 border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30",
                              errors.companyName && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30"
                            )}
                            value={formData.companyName}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.companyName && (
                          <p className="mt-1 text-sm text-rose-500">{errors.companyName}</p>
                        )}
                      </motion.div>

                      {/* Contact Person */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="contactPerson" className="block mb-2 text-gray-300">
                          Contact Person*
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="contactPerson"
                            name="contactPerson"
                            placeholder="John Doe"
                            className={cn(
                              "pl-10 bg-gray-800/50 border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30",
                              errors.contactPerson && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30"
                            )}
                            value={formData.contactPerson}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.contactPerson && (
                          <p className="mt-1 text-sm text-rose-500">{errors.contactPerson}</p>
                        )}
                      </motion.div>

                      {/* Email */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="email" className="block mb-2 text-gray-300">
                          Email*
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="contact@acme.com"
                            className={cn(
                              "pl-10 bg-gray-800/50 border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30",
                              errors.email && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30"
                            )}
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-rose-500">{errors.email}</p>
                        )}
                      </motion.div>

                      {/* Phone */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="phone" className="block mb-2 text-gray-300">
                          Phone*
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="+1 (555) 123-4567"
                            className={cn(
                              "pl-10 bg-gray-800/50 border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30",
                              errors.phone && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30"
                            )}
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-sm text-rose-500">{errors.phone}</p>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Address Information Section */}
            <motion.div 
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
              variants={itemVariants}
            >
              <div 
                className="p-5 cursor-pointer flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                onClick={() => toggleSection('address')}
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-500/10 mr-4">
                    <MapPin className="h-5 w-5 text-blue-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">
                    Address Information
                  </h2>
                </div>
                <ChevronDown className={cn(
                  "h-5 w-5 text-gray-400 transition-transform duration-300",
                  !expandedSections.address && "transform -rotate-90"
                )} />
              </div>
              
              <AnimatePresence>
                {expandedSections.address && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={sectionVariants}
                    transition={{ duration: 0.3 }}
                    className="px-5 pb-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {/* Address */}
                      <motion.div variants={itemVariants} className="md:col-span-2">
                        <Label htmlFor="address" className="block mb-2 text-gray-300">
                          Address*
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="address"
                            name="address"
                            placeholder="123 Main Street"
                            className={cn(
                              "pl-10 bg-gray-800/50 border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30",
                              errors.address && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30"
                            )}
                            value={formData.address}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.address && (
                          <p className="mt-1 text-sm text-rose-500">{errors.address}</p>
                        )}
                      </motion.div>

                      {/* City */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="city" className="block mb-2 text-gray-300">
                          City*
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          placeholder="New York"
                          className={cn(
                            "bg-gray-800/50 border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30",
                            errors.city && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30"
                          )}
                          value={formData.city}
                          onChange={handleChange}
                        />
                        {errors.city && (
                          <p className="mt-1 text-sm text-rose-500">{errors.city}</p>
                        )}
                      </motion.div>

                      {/* State */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="state" className="block mb-2 text-gray-300">
                          State/Province*
                        </Label>
                        <Input
                          id="state"
                          name="state"
                          placeholder="NY"
                          className={cn(
                            "bg-gray-800/50 border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30",
                            errors.state && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30"
                          )}
                          value={formData.state}
                          onChange={handleChange}
                        />
                        {errors.state && (
                          <p className="mt-1 text-sm text-rose-500">{errors.state}</p>
                        )}
                      </motion.div>

                      {/* Postal Code */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="postalCode" className="block mb-2 text-gray-300">
                          Postal Code*
                        </Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          placeholder="10001"
                          className={cn(
                            "bg-gray-800/50 border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30",
                            errors.postalCode && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30"
                          )}
                          value={formData.postalCode}
                          onChange={handleChange}
                        />
                        {errors.postalCode && (
                          <p className="mt-1 text-sm text-rose-500">{errors.postalCode}</p>
                        )}
                      </motion.div>

                      {/* Country */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="country" className="block mb-2 text-gray-300">
                          Country*
                        </Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Select
                            value={formData.country}
                            onValueChange={(value) => handleSelectChange('country', value)}
                          >
                            <SelectTrigger className="pl-10 bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800/70 focus:ring-1 focus:ring-indigo-500/30">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700 text-gray-300">
                              {countries.map(country => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {errors.country && (
                          <p className="mt-1 text-sm text-rose-500">{errors.country}</p>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Billing Information Section */}
            <motion.div 
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
              variants={itemVariants}
            >
              <div 
                className="p-5 cursor-pointer flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                onClick={() => toggleSection('billing')}
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-purple-500/10 mr-4">
                    <CreditCard className="h-5 w-5 text-purple-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">
                    Billing Information
                  </h2>
                </div>
                <ChevronDown className={cn(
                  "h-5 w-5 text-gray-400 transition-transform duration-300",
                  !expandedSections.billing && "transform -rotate-90"
                )} />
              </div>
              
              <AnimatePresence>
                {expandedSections.billing && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={sectionVariants}
                    transition={{ duration: 0.3 }}
                    className="px-5 pb-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {/* Tax ID */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="taxId" className="block mb-2 text-gray-300">
                          Tax ID
                        </Label>
                        <Input
                          id="taxId"
                          name="taxId"
                          placeholder="123-45-6789"
                          className="bg-gray-800/50 border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                          value={formData.taxId}
                          onChange={handleChange}
                        />
                      </motion.div>

                      {/* Payment Terms */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="paymentTerms" className="block mb-2 text-gray-300">
                          Payment Terms
                        </Label>
                        <div className="relative">
                          <BadgePercent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Select
                            value={formData.paymentTerms}
                            onValueChange={(value) => handleSelectChange('paymentTerms', value)}
                          >
                            <SelectTrigger className="pl-10 bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800/70 focus:ring-1 focus:ring-indigo-500/30">
                              <SelectValue placeholder="Select terms" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700 text-gray-300">
                              <SelectItem value="net15">Net 15</SelectItem>
                              <SelectItem value="net30">Net 30</SelectItem>
                              <SelectItem value="net60">Net 60</SelectItem>
                              <SelectItem value="cod">COD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </motion.div>

                      {/* Credit Limit */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="creditLimit" className="block mb-2 text-gray-300">
                          Credit Limit
                        </Label>
                        <div className="relative">
                          <WalletCards className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="creditLimit"
                            name="creditLimit"
                            type="number"
                            placeholder="10000"
                            className="pl-10 bg-gray-800/50 border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                            value={formData.creditLimit}
                            onChange={handleChange}
                          />
                        </div>
                      </motion.div>

                      {/* Currency */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="currency" className="block mb-2 text-gray-300">
                          Currency
                        </Label>
                        <Select
                          value={formData.currency}
                          onValueChange={(value) => handleSelectChange('currency', value)}
                        >
                          <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800/70 focus:ring-1 focus:ring-indigo-500/30">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-gray-300">
                            {currencies.map(currency => (
                              <SelectItem key={currency} value={currency}>
                                {currency}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Additional Information Section */}
            <motion.div 
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
              variants={itemVariants}
            >
              <div 
                className="p-5 cursor-pointer flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                onClick={() => toggleSection('additional')}
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-emerald-500/10 mr-4">
                    <FileText className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">
                    Additional Information
                  </h2>
                </div>
                <ChevronDown className={cn(
                  "h-5 w-5 text-gray-400 transition-transform duration-300",
                  !expandedSections.additional && "transform -rotate-90"
                )} />
              </div>
              
              <AnimatePresence>
                {expandedSections.additional && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={sectionVariants}
                    transition={{ duration: 0.3 }}
                    className="px-5 pb-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {/* Customer Type */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="customerType" className="block mb-2 text-gray-300">
                          Customer Type
                        </Label>
                        <Select
                          value={formData.customerType}
                          onValueChange={(value) => handleSelectChange('customerType', value)}
                        >
                          <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800/70 focus:ring-1 focus:ring-indigo-500/30">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-gray-300">
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="wholesale">Wholesale</SelectItem>
                            <SelectItem value="corporate">Corporate</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>

                      {/* Customer Since */}
                      <motion.div variants={itemVariants}>
                        <Label className="block mb-2 text-gray-300">
                          Customer Since
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal bg-gray-800/50 border-gray-700 hover:bg-gray-800/70",
                                !formData.customerSince && "text-gray-400"
                              )}
                            >
                              <CalendarIcon className="h-4 w-4 mr-2" />
                              {formData.customerSince ? (
                                format(formData.customerSince, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                            <Calendar
                              mode="single"
                              selected={formData.customerSince}
                              onSelect={(date) => handleDateChange('customerSince', date)}
                              initialFocus
                              className="bg-gray-800"
                            />
                          </PopoverContent>
                        </Popover>
                      </motion.div>

                      {/* Notes */}
                      <motion.div variants={itemVariants} className="md:col-span-2">
                        <Label htmlFor="notes" className="block mb-2 text-gray-300">
                          Notes
                        </Label>
                        <textarea
                          id="notes"
                          name="notes"
                          placeholder="Any additional notes about this customer..."
                          className="w-full min-h-[100px] bg-gray-800/50 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none"
                          value={formData.notes}
                          onChange={handleChange}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Form Actions */}
            <motion.div 
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6"
              variants={itemVariants}
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
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-indigo-500/20"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Customer
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}