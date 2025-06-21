"use client"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "For small teams getting started",
    features: [
      "Up to 10 users",
      "Basic AI automation",
      "Email support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$99",
    period: "/month",
    description: "For growing businesses",
    features: [
      "Up to 50 users", 
      "Advanced AI tools",
      "Priority support",
      "API access",
    ],
    cta: "Try for Free", 
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations",
    features: [
      "Unlimited users",
      "Dedicated AI models",
      "24/7 support",
      "White-glove onboarding",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold tracking-tight">Simple, Transparent Pricing</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          No hidden fees. Start with a 14-day free trial.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {plan.popular && (
              <Badge variant="default" className="absolute -top-3 -right-3">
                POPULAR
              </Badge>
            )}
            <Card className={plan.popular ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckIcon className="w-4 h-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-16"
      >
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "Can I change plans later?",
              "Is there a minimum contract?",
              "How is billing handled?",
              "Do you offer discounts for non-profits?",
            ].map((question) => (
              <div key={question} className="space-y-1">
                <h3 className="font-medium">{question}</h3>
                <p className="text-sm text-muted-foreground">
                  {question.includes("change") 
                    ? "Yes, you can upgrade/downgrade anytime"
                    : question.includes("contract") 
                      ? "No, cancel anytime"
                      : question.includes("billing") 
                        ? "Monthly or annual billing with credit card"
                        : "Yes, contact our sales team for details"}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}