import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, MapPin, Phone, Globe, Navigation } from "lucide-react";
import CurrentLocationTab from "@/components/CurrentLocationTab";
import ManualAddressTab from "@/components/ManualAddressTab";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-3">
            <Shield className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Public Safety Jurisdiction Finder</h1>
          </div>
          <p className="text-center mt-2 text-primary-foreground/80">
            Find your local law enforcement agency contact information
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Find Your Jurisdiction</CardTitle>
            <CardDescription>
              Choose how you'd like to find your local law enforcement agency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="current-location" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="current-location" className="flex items-center space-x-2">
                  <Navigation className="h-4 w-4" />
                  <span>Current Location</span>
                </TabsTrigger>
                <TabsTrigger value="manual-address" className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Manual Address</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="current-location" className="mt-6">
                <CurrentLocationTab />
              </TabsContent>
              
              <TabsContent value="manual-address" className="mt-6">
                <ManualAddressTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-muted mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>For emergencies, always dial 911</p>
          <p className="text-sm mt-1">This tool provides non-emergency contact information</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;