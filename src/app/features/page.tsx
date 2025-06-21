"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  RocketIcon,
  BarChartIcon,
  FileTextIcon,
  BoxIcon,
} from "@radix-ui/react-icons";

const features = [
  {
    category: "AI Automation",
    icon: <RocketIcon className="w-5 h-5" />,
    items: [
      {
        title: "Smart Invoice Processing",
        description: "Extract data from PDFs with 99% accuracy",
        pro: true,
      },
      {
        title: "Predictive Inventory",
        description: "Automate restocking with AI forecasts",
        pro: true,
      },
    ],
  },
  {
    category: "Financial Tools",
    icon: <BoxIcon className="w-5 h-5" />,
    items: [
      {
        title: "Real-Time Analytics",
        description: "Live dashboards for revenue tracking",
        pro: false,
      },
      {
        title: "Tax Compliance",
        description: "Auto-generate VAT/GST reports",
        pro: true,
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="container py-10 m-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold tracking-tight">
          Power Up Your Workflow
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          100+ features designed to scale with your business
        </p>
      </motion.div>

      <div className="space-y-16 ">
        {features.map((section, sectionIdx) => (
          <motion.section
            key={section.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIdx * 0.1 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">{section.icon}</div>
              <h2 className="text-2xl font-semibold">{section.category}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((feature, featureIdx) => (
                <motion.div
                  key={feature.title}
                  whileHover={{ y: -5 }}
                  transition={{ delay: featureIdx * 0.05 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex justify-between">
                        <CardTitle>{feature.title}</CardTitle>
                        {feature.pro && <Badge variant="premium">PRO</Badge>}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                      <Button variant="link" className="px-0 mt-4">
                        Learn more →
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
