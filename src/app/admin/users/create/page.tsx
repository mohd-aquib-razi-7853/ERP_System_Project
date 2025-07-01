"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Shield, 
  Edit, 
  Check, 
  X, 
  Clock,
  ArrowLeft,
  Save,
  Calendar as CalendarIcon,
  Briefcase,
  Building,
  Users as UsersIcon,
  Clock as ClockIcon,
  MapPin,
  Hash,
  ChevronDown,
  ChevronRight
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

export default function AddEmployeePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    employeeId: '',
    gender: '',
    dateOfBirth: undefined as Date | undefined,
    
    // Employment Details
    jobTitle: '',
    department: '',
    reportingManager: '',
    employmentType: 'full-time' as 'full-time' | 'part-time' | 'contract' | 'intern',
    joiningDate: undefined as Date | undefined,
    probationPeriod: '',
    workLocation: 'office' as 'office' | 'remote' | 'hybrid',
    shiftTiming: '',
    
    // Status
    employeeStatus: 'active' as 'active' | 'on-leave' | 'resigned' | 'terminated'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    employment: true,
    status: true
  });

  const departments = [
    'HR', 'Sales', 'IT', 'Finance', 'Marketing', 
    'Operations', 'Customer Support', 'R&D', 'Product'
  ];

  const validateForm = () => {
    let valid = true;
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      valid = false;
    }

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
      valid = false;
    }

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
      valid = false;
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
      valid = false;
    }

    if (!formData.joiningDate) {
      newErrors.joiningDate = 'Joining date is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      
      toast.success('Employee added successfully', {
        description: `${formData.fullName} has been added to the system.`,
        action: {
          label: 'View',
          onClick: () => router.push('/admin/users')
        }
      });
      
      setIsSubmitting(false);
      router.push('/admin/users');
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
        className="flex-1  p-6 max-w-6xl w-full mx-auto"
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
            Back to Users
          </Button>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Add New Employee
          </h1>
          <p className="text-gray-400">
            Fill in the details below to add a new employee to your system
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Personal Information Section */}
            <motion.div 
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
              variants={itemVariants}
            >
              <div 
                className="p-5 cursor-pointer flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                onClick={() => toggleSection('personal')}
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-indigo-500/10 mr-4">
                    <User className="h-5 w-5 text-indigo-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">
                    Personal Information
                  </h2>
                </div>
                <ChevronDown className={cn(
                  "h-5 w-5 text-gray-400 transition-transform duration-300",
                  !expandedSections.personal && "transform -rotate-90"
                )} />
              </div>
              
              <AnimatePresence>
                {expandedSections.personal && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={sectionVariants}
                    transition={{ duration: 0.3 }}
                    className="px-5 pb-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {/* Full Name */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="fullName" className="block mb-2 text-gray-300">
                          Full Name*
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="fullName"
                            name="fullName"
                            type="text"
                            placeholder="John Doe"
                            className={cn(
                              "pl-10 bg-gray-800/50 border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30",
                              errors.fullName && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30"
                            )}
                            value={formData.fullName}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.fullName && (
                          <p className="mt-1 text-sm text-rose-500">{errors.fullName}</p>
                        )}
                      </motion.div>

                      {/* Employee ID */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="employeeId" className="block mb-2 text-gray-300">
                          Employee ID*
                        </Label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="employeeId"
                            name="employeeId"
                            type="text"
                            placeholder="EMP-001"
                            className={cn(
                              "pl-10 bg-gray-800/50 border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30",
                              errors.employeeId && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30"
                            )}
                            value={formData.employeeId}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.employeeId && (
                          <p className="mt-1 text-sm text-rose-500">{errors.employeeId}</p>
                        )}
                      </motion.div>

                      {/* Gender */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="gender" className="block mb-2 text-gray-300">
                          Gender
                        </Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(value) => 
                            setFormData({...formData, gender: value})
                          }
                        >
                          <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800/70 focus:ring-1 focus:ring-indigo-500/30">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-gray-300">
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>

                      {/* Date of Birth */}
                      <motion.div variants={itemVariants}>
                        <Label className="block mb-2 text-gray-300">
                          Date of Birth
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal bg-gray-800/50 border-gray-700 hover:bg-gray-800/70",
                                !formData.dateOfBirth && "text-gray-400"
                              )}
                            >
                              <CalendarIcon className="h-4 w-4 mr-2" />
                              {formData.dateOfBirth ? (
                                format(formData.dateOfBirth, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                            <Calendar
                              mode="single"
                              selected={formData.dateOfBirth}
                              onSelect={(date) => setFormData({...formData, dateOfBirth: date})}
                              initialFocus
                              className="bg-gray-800"
                            />
                          </PopoverContent>
                        </Popover>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Employment Details Section */}
            <motion.div 
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
              variants={itemVariants}
            >
              <div 
                className="p-5 cursor-pointer flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                onClick={() => toggleSection('employment')}
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-500/10 mr-4">
                    <Briefcase className="h-5 w-5 text-blue-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">
                    Employment Details
                  </h2>
                </div>
                <ChevronDown className={cn(
                  "h-5 w-5 text-gray-400 transition-transform duration-300",
                  !expandedSections.employment && "transform -rotate-90"
                )} />
              </div>
              
              <AnimatePresence>
                {expandedSections.employment && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={sectionVariants}
                    transition={{ duration: 0.3 }}
                    className="px-5 pb-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {/* Job Title */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="jobTitle" className="block mb-2 text-gray-300">
                          Job Title*
                        </Label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="jobTitle"
                            name="jobTitle"
                            type="text"
                            placeholder="Software Engineer"
                            className={cn(
                              "pl-10 bg-gray-800/50 border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30",
                              errors.jobTitle && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/30"
                            )}
                            value={formData.jobTitle}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.jobTitle && (
                          <p className="mt-1 text-sm text-rose-500">{errors.jobTitle}</p>
                        )}
                      </motion.div>

                      {/* Department */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="department" className="block mb-2 text-gray-300">
                          Department*
                        </Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Select
                            value={formData.department}
                            onValueChange={(value) => 
                              setFormData({...formData, department: value})
                            }
                          >
                            <SelectTrigger className="pl-10 bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800/70 focus:ring-1 focus:ring-indigo-500/30">
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700 text-gray-300">
                              {departments.map(dept => (
                                <SelectItem key={dept} value={dept.toLowerCase()}>
                                  {dept}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {errors.department && (
                          <p className="mt-1 text-sm text-rose-500">{errors.department}</p>
                        )}
                      </motion.div>

                      {/* Reporting Manager */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="reportingManager" className="block mb-2 text-gray-300">
                          Reporting Manager
                        </Label>
                        <div className="relative">
                          <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="reportingManager"
                            name="reportingManager"
                            type="text"
                            placeholder="Manager's name"
                            className="pl-10 bg-gray-800/50 border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                            value={formData.reportingManager}
                            onChange={handleChange}
                          />
                        </div>
                      </motion.div>

                      {/* Employment Type */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="employmentType" className="block mb-2 text-gray-300">
                          Employment Type
                        </Label>
                        <Select
                          value={formData.employmentType}
                          onValueChange={(value: 'full-time' | 'part-time' | 'contract' | 'intern') => 
                            setFormData({...formData, employmentType: value})
                          }
                        >
                          <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800/70 focus:ring-1 focus:ring-indigo-500/30">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-gray-300">
                            <SelectItem value="full-time">Full-time</SelectItem>
                            <SelectItem value="part-time">Part-time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="intern">Intern</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>

                      {/* Joining Date */}
                      <motion.div variants={itemVariants}>
                        <Label className="block mb-2 text-gray-300">
                          Joining Date*
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal bg-gray-800/50 border-gray-700 hover:bg-gray-800/70",
                                !formData.joiningDate && "text-gray-400"
                              )}
                            >
                              <CalendarIcon className="h-4 w-4 mr-2" />
                              {formData.joiningDate ? (
                                format(formData.joiningDate, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                            <Calendar
                              mode="single"
                              selected={formData.joiningDate}
                              onSelect={(date) => setFormData({...formData, joiningDate: date})}
                              initialFocus
                              className="bg-gray-800"
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.joiningDate && (
                          <p className="mt-1 text-sm text-rose-500">{errors.joiningDate}</p>
                        )}
                      </motion.div>

                      {/* Probation Period */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="probationPeriod" className="block mb-2 text-gray-300">
                          Probation Period
                        </Label>
                        <Select
                          value={formData.probationPeriod}
                          onValueChange={(value) => 
                            setFormData({...formData, probationPeriod: value})
                          }
                        >
                          <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800/70 focus:ring-1 focus:ring-indigo-500/30">
                            <SelectValue placeholder="Select period" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-gray-300">
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="1-month">1 Month</SelectItem>
                            <SelectItem value="3-months">3 Months</SelectItem>
                            <SelectItem value="6-months">6 Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>

                      {/* Work Location */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="workLocation" className="block mb-2 text-gray-300">
                          Work Location
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Select
                            value={formData.workLocation}
                            onValueChange={(value: 'office' | 'remote' | 'hybrid') => 
                              setFormData({...formData, workLocation: value})
                            }
                          >
                            <SelectTrigger className="pl-10 bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800/70 focus:ring-1 focus:ring-indigo-500/30">
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700 text-gray-300">
                              <SelectItem value="office">Office</SelectItem>
                              <SelectItem value="remote">Remote</SelectItem>
                              <SelectItem value="hybrid">Hybrid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </motion.div>

                      {/* Shift Timing */}
                      <motion.div variants={itemVariants}>
                        <Label htmlFor="shiftTiming" className="block mb-2 text-gray-300">
                          Shift Timing
                        </Label>
                        <div className="relative">
                          <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Select
                            value={formData.shiftTiming}
                            onValueChange={(value) => 
                              setFormData({...formData, shiftTiming: value})
                            }
                          >
                            <SelectTrigger className="pl-10 bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800/70 focus:ring-1 focus:ring-indigo-500/30">
                              <SelectValue placeholder="Select shift" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700 text-gray-300">
                              <SelectItem value="general">General (9AM-6PM)</SelectItem>
                              <SelectItem value="morning">Morning (6AM-3PM)</SelectItem>
                              <SelectItem value="evening">Evening (2PM-11PM)</SelectItem>
                              <SelectItem value="night">Night (10PM-7AM)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Status Section */}
            <motion.div 
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
              variants={itemVariants}
            >
              <div 
                className="p-5 cursor-pointer flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                onClick={() => toggleSection('status')}
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-emerald-500/10 mr-4">
                    <Shield className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">
                    Employee Status
                  </h2>
                </div>
                <ChevronDown className={cn(
                  "h-5 w-5 text-gray-400 transition-transform duration-300",
                  !expandedSections.status && "transform -rotate-90"
                )} />
              </div>
              
              <AnimatePresence>
                {expandedSections.status && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={sectionVariants}
                    transition={{ duration: 0.3 }}
                    className="px-5 pb-5"
                  >
                    <div className="w-full">
                      <RadioGroup
                        value={formData.employeeStatus}
                        onValueChange={(value: 'active' | 'on-leave' | 'resigned' | 'terminated') => 
                          setFormData({...formData, employeeStatus: value})
                        }
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                      >
                        <div>
                          <RadioGroupItem
                            value="active"
                            id="active-status"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="active-status"
                            className={cn(
                              "flex flex-col items-center justify-between rounded-lg border-2 border-gray-700 bg-gray-800/30 p-4 hover:bg-gray-800/50 hover:text-white cursor-pointer transition-all",
                              formData.employeeStatus === 'active' && "border-emerald-500 bg-emerald-500/10"
                            )}
                          >
                            <Check className="h-6 w-6 mb-2 text-emerald-500" />
                            <Badge className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30">
                              Active
                            </Badge>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem
                            value="on-leave"
                            id="on-leave-status"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="on-leave-status"
                            className={cn(
                              "flex flex-col items-center justify-between rounded-lg border-2 border-gray-700 bg-gray-800/30 p-4 hover:bg-gray-800/50 hover:text-white cursor-pointer transition-all",
                              formData.employeeStatus === 'on-leave' && "border-amber-500 bg-amber-500/10"
                            )}
                          >
                            <Clock className="h-6 w-6 mb-2 text-amber-500" />
                            <Badge className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30">
                              On Leave
                            </Badge>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem
                            value="resigned"
                            id="resigned-status"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="resigned-status"
                            className={cn(
                              "flex flex-col items-center justify-between rounded-lg border-2 border-gray-700 bg-gray-800/30 p-4 hover:bg-gray-800/50 hover:text-white cursor-pointer transition-all",
                              formData.employeeStatus === 'resigned' && "border-blue-500 bg-blue-500/10"
                            )}
                          >
                            <Edit className="h-6 w-6 mb-2 text-blue-500" />
                            <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30">
                              Resigned
                            </Badge>
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem
                            value="terminated"
                            id="terminated-status"
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="terminated-status"
                            className={cn(
                              "flex flex-col items-center justify-between rounded-lg border-2 border-gray-700 bg-gray-800/30 p-4 hover:bg-gray-800/50 hover:text-white cursor-pointer transition-all",
                              formData.employeeStatus === 'terminated' && "border-rose-500 bg-rose-500/10"
                            )}
                          >
                            <X className="h-6 w-6 mb-2 text-rose-500" />
                            <Badge className="bg-rose-500/20 text-rose-500 hover:bg-rose-500/30">
                              Terminated
                            </Badge>
                          </Label>
                        </div>
                      </RadioGroup>
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
                      Save Employee
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