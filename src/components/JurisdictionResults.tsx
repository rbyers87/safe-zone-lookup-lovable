import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Phone, MapPin, Globe, ExternalLink } from "lucide-react";

interface JurisdictionInfo {
  agencyName: string;
  nonEmergencyPhone: string;
  physicalAddress: string;
  website: string;
}

interface JurisdictionResultsProps {
  jurisdiction: JurisdictionInfo;
}

const JurisdictionResults = ({ jurisdiction }: JurisdictionResultsProps) => {
  const handlePhoneCall = () => {
    window.location.href = `tel:${jurisdiction.nonEmergencyPhone}`;
  };

  const handleWebsiteVisit = () => {
    window.open(jurisdiction.website, '_blank', 'noopener,noreferrer');
  };

  const handleDirections = () => {
    const encodedAddress = encodeURIComponent(jurisdiction.physicalAddress);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="border-success/20 bg-success/5">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Shield className="h-6 w-6 text-success" />
          <div>
            <CardTitle className="text-success">Jurisdiction Found</CardTitle>
            <Badge variant="secondary" className="mt-1">Non-Emergency Information</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Agency Name */}
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {jurisdiction.agencyName}
          </h3>
        </div>

        {/* Contact Information */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">Non-Emergency Phone</h4>
                  <p className="text-lg font-mono text-muted-foreground mt-1">
                    {jurisdiction.nonEmergencyPhone}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handlePhoneCall}
                    className="mt-2"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">Physical Address</h4>
                  <p className="text-muted-foreground mt-1">
                    {jurisdiction.physicalAddress}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDirections}
                    className="mt-2"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Website */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Globe className="h-5 w-5 text-primary mt-1" />
              <div className="flex-1">
                <h4 className="font-medium text-foreground">Official Website</h4>
                <p className="text-muted-foreground mt-1 break-all">
                  {jurisdiction.website}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleWebsiteVisit}
                  className="mt-2"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Website
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Notice */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-4">
            <div className="text-center">
              <h4 className="font-semibold text-destructive mb-2">For Emergencies</h4>
              <p className="text-muted-foreground">
                Always dial <strong className="text-destructive">911</strong> for immediate emergency assistance
              </p>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default JurisdictionResults;