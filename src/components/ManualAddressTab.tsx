import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Search, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import JurisdictionResults from "@/components/JurisdictionResults";
import { useToast } from "@/hooks/use-toast";

interface JurisdictionInfo {
  agencyName: string;
  nonEmergencyPhone: string;
  physicalAddress: string;
  website: string;
}

const ManualAddressTab = () => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [jurisdictionInfo, setJurisdictionInfo] = useState<JurisdictionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address.trim()) {
      setError("Please enter a valid address.");
      return;
    }

    setLoading(true);
    setError(null);
    setJurisdictionInfo(null);

    try {
      await fetchJurisdictionByAddress(address);
    } catch (err) {
      setError("Failed to fetch jurisdiction information. Please check the address and try again.");
      toast({
        title: "Error",
        description: "Could not retrieve jurisdiction information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchJurisdictionByAddress = async (addressInput: string) => {
    try {
      console.log('Calling texas-jurisdiction function with address:', addressInput);
      
      const { data, error } = await supabase.functions.invoke('texas-jurisdiction', {
        body: {
          address: addressInput
        }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message);
      }

      if (!data) {
        console.error('No data returned from edge function');
        throw new Error('No data returned from jurisdiction service');
      }

      console.log('Setting jurisdiction info:', data);
      setJurisdictionInfo({
        agencyName: data.agencyName,
        nonEmergencyPhone: data.nonEmergencyPhone,
        physicalAddress: data.physicalAddress,
        website: data.website
      });

      toast({
        title: "Address Found",
        description: "Successfully retrieved jurisdiction information",
      });
    } catch (err) {
      console.error("Jurisdiction fetch error:", err);
      throw err;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Enter Full Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="e.g., 123 Main Street, City, State 12345"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={loading}
                className="w-full"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={loading || !address.trim()} 
              className="w-full"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              {loading ? "Searching..." : "Find Jurisdiction"}
            </Button>
          </form>

          {loading && (
            <Alert className="mt-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Searching for jurisdiction information...
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {jurisdictionInfo && (
        <JurisdictionResults jurisdiction={jurisdictionInfo} />
      )}
    </div>
  );
};

export default ManualAddressTab;