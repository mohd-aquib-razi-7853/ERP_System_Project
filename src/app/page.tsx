import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6 md:px-20 py-20">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Transform Your Factory with AI ERP
          </h1>
          <p className="text-lg text-muted-foreground">
            Our smart ERP platform helps industries streamline operations, boost productivity, and make data-driven decisions.
          </p>
          <div className="flex gap-4">
            <Button className="erp-button-primary">Get Started</Button>
            <Button variant="outline" className="">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative aspect-video">
          <Image
            src="/factory-dashboard.png"
            alt="Factory ERP Dashboard"
            fill
            className="object-contain rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-20 py-16 bg-muted">
        <h2 className="text-3xl font-semibold mb-12 text-center">
          Powerful Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="erp-card">
            <CardContent>
              <h3 className="text-xl font-bold mb-2">Inventory Management</h3>
              <p className="text-muted-foreground text-sm">
                Real-time tracking, stock alerts, and integrated purchase orders.
              </p>
            </CardContent>
          </Card>
          <Card className="erp-card">
            <CardContent>
              <h3 className="text-xl font-bold mb-2">AI Analytics</h3>
              <p className="text-muted-foreground text-sm">
                Predict trends, monitor KPIs, and generate reports with AI.
              </p>
            </CardContent>
          </Card>
          <Card className="erp-card">
            <CardContent>
              <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
              <p className="text-muted-foreground text-sm">
                Assign tasks, share data, and communicate in real time.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-20 text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Ready to elevate your operations?
        </h2>
        <p className="text-muted-foreground mb-6">
          Start your 14-day free trial today. No credit card required.
        </p>
        <Button size="lg" className="erp-button-primary">
          Get Started Now
        </Button>
      </section>
    </main>
  );
}
