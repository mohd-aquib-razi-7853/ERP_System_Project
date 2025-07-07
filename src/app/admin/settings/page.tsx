'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function AdminSettingsPage() {
  const [company, setCompany] = useState({
    name: "My ERP Inc.",
    currency: "INR",
    logo: "",
    enableEmail: true,
    theme: "system"
  })

  const handleSave = () => {
    console.log("Saving settings:", company)
    // Call API to save settings here
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-semibold">Admin Settings</h2>
        <p className="text-muted-foreground text-sm">Manage company-wide ERP preferences.</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              value={company.currency}
              onChange={(e) => setCompany({ ...company, currency: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Company Logo URL</Label>
            <Input
              id="logo"
              value={company.logo}
              onChange={(e) => setCompany({ ...company, logo: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Theme Preference */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Preference</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            defaultValue={company.theme}
            onValueChange={(val) => setCompany({ ...company, theme: val })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="r1" />
              <Label htmlFor="r1">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="r2" />
              <Label htmlFor="r2">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="r3" />
              <Label htmlFor="r3">System</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Email Settings</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Enable email notifications</p>
            <p className="text-sm text-muted-foreground">For invoices, reports, and alerts</p>
          </div>
          <Switch
            checked={company.enableEmail}
            onCheckedChange={(val) => setCompany({ ...company, enableEmail: val })}
          />
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end">
        <Button onClick={handleSave} className="w-40">Save Changes</Button>
      </div>
    </div>
  )
}
