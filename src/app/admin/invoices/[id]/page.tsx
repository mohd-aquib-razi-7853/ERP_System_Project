"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import {
  PrinterIcon,
  DownloadIcon,
  MailIcon,
  ArrowLeftIcon,
  MoreVerticalIcon,
  CalendarIcon,
  FileTextIcon,
  CreditCardIcon,
  TruckIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
interface PageProps {
  params: {
    id: number;
  };
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}
export default function InvoiceDetailPage({ params }: PageProps) {
  // Mock invoice data
  const invoice = {
    id: params.id,
    number: "INV-2023-0456",
    date: "2023-11-15",
    dueDate: "2023-12-15",
    status: "pending",
    customer: {
      name: "Acme Corporation",
      email: "billing@acme.com",
      avatar: "/avatars/acme.png",
      address: "123 Business Rd, San Francisco, CA 94107",
    },
    items: [
      {
        id: 1,
        name: "ERP Module License",
        quantity: 2,
        price: 1200,
        total: 2400,
      },
      {
        id: 2,
        name: "Implementation Services",
        quantity: 40,
        price: 150,
        total: 6000,
      },
      { id: 3, name: "Annual Support", quantity: 1, price: 1800, total: 1800 },
    ],
    subtotal: 10200,
    tax: 918,
    discount: 500,
    total: 10618,
    paymentMethod: "Credit Card",
    transactionId: "TRX-789456123",
    shipping: {
      method: "Digital Delivery",
      tracking: "N/A",
    },
    notes:
      "Thank you for your business. Please contact support@erp.com for any assistance.",
  };

  const router = useRouter();
  const statusVariant =
    invoice.status === "paid"
      ? "default"
      : invoice.status === "pending"
      ? "outline"
      : "destructive";
  return (
    <div className="grid gap-6 p-6 bg-gray-900 text-gray-100 h-screen overflow-scroll no-scrollbar">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="text-gray-300 hover:text-gray-200 hover:bg-gray-700  "
          onClick={() => router.back()}
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Invoices
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-gray-700 text-gray-300 bg-gray-900 hover:bg-gray-800 hover:text-white"
          >
            <PrinterIcon className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button
            variant="outline"
            className="border-gray-700 bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button
            variant="outline"
            className="border-gray-700 text-gray-300 bg-gray-900 hover:bg-gray-800 hover:text-white"
          >
            <MailIcon className="mr-2 h-4 w-4" />
            Send
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-gray-700 bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <MoreVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 text-gray-300">
              <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700">
                Edit Invoice
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700">
                Duplicate Invoice
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-400 hover:bg-gray-700 focus:bg-gray-700">
                Cancel Invoice
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card className="border-gray-700 bg-gray-800">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-white">
                Invoice #{invoice.number}
              </CardTitle>
              <CardDescription className="text-gray-400 mt-2">
                Issued on {new Date(invoice.date).toLocaleDateString()}
              </CardDescription>
            </div>
            <Badge variant={statusVariant} className="uppercase">
              {invoice.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Customer Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 border border-gray-600">
                  <AvatarImage src={invoice.customer.avatar} />
                  <AvatarFallback>
                    {invoice.customer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-white">
                    {invoice.customer.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {invoice.customer.email}
                  </p>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-gray-400">{invoice.customer.address}</p>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <FileTextIcon className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-gray-400">Invoice</p>
                  <p className="font-medium text-white">#{invoice.number}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-gray-400">Date Issued</p>
                  <p className="font-medium text-white">
                    {new Date(invoice.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-gray-400">Due Date</p>
                  <p className="font-medium text-white">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <CreditCardIcon className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-gray-400">Payment Method</p>
                  <p className="font-medium text-white">
                    {invoice.paymentMethod}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <TruckIcon className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-gray-400">Delivery Method</p>
                  <p className="font-medium text-white">
                    {invoice.shipping.method}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Items</h3>
            <div className="border border-gray-700 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-750">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Item
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Qty
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-right">
                        ${item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-md space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="font-medium text-white">
                  ${invoice.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Discount</span>
                <span className="font-medium text-green-400">
                  -${invoice.discount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tax (9%)</span>
                <span className="font-medium text-white">
                  ${invoice.tax.toFixed(2)}
                </span>
              </div>
              <Separator className="my-2 bg-gray-700" />
              <div className="flex justify-between text-lg font-bold">
                <span className="text-white">Total</span>
                <span className="text-white">${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-2">Notes</h3>
              <p className="text-sm text-gray-400 bg-gray-750 p-4 rounded-lg">
                {invoice.notes}
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t border-gray-700 pt-6">
          <Button
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-700 bg-gray-900 hover:text-white"
          >
            Edit Invoice
          </Button>
          <div className="space-x-2">
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-700 bg-gray-900 hover:text-white"
            >
              Download PDF
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Send to Customer
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
