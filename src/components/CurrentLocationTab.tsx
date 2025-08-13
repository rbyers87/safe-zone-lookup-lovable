import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, MapPin, AlertCircle } from "lucide-react";
import JurisdictionResults from "@/components/JurisdictionResults";
import { useToast } from "@/hooks/use-toast";

interface LocationData {
  latitude: number;
  longitude: number;
}

interface JurisdictionInfo {
  agencyName: string;
  nonEmergencyPhone: string;
  physicalAddress: string;
  website: string;
}

const CurrentLocationTab = () => {
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [jurisdictionInfo, setJurisdictionInfo] = useState<JurisdictionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);
    setJurisdictionInfo(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocationData({ latitude, longitude });
        
        try {
          await fetchJurisdictionByLocation(latitude, longitude);
        } catch (err) {
          setError("Failed to fetch jurisdiction information. Please try again.");
          toast({
            title: "Error",
            description: "Could not retrieve jurisdiction information",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Location access denied. Please enable location permissions and try again.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            setError("Location request timed out. Please try again.");
            break;
          default:
            setError("An unknown error occurred while retrieving location.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const fetchJurisdictionByLocation = async (latitude: number, longitude: number) => {
    // This would call our Supabase Edge Function
    // For now, we'll use mock data
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    
    const mockData: JurisdictionInfo = {
      agencyName: "Metropolitan Police Department",
      nonEmergencyPhone: "(555) 123-4567",
      physicalAddress: "1234 Main Street, Your City, State 12345",
      website: "https://example-police.gov"
    };
    
    setJurisdictionInfo(mockData);
    toast({
      title: "Location Found",
      description: "Successfully retrieved jurisdiction information",
    });
  };

  // Auto-detect location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Current Location Detection</h3>
            </div>
            <Button 
              onClick={getCurrentLocation} 
              disabled={loading}
              size="sm"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <MapPin className="h-4 w-4 mr-2" />
              )}
              {loading ? "Detecting..." : "Refresh Location"}
            </Button>
          </div>

          {loading && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Detecting your location and finding jurisdiction information...
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {locationData && !loading && (
            <Alert>
              <MapPin className="h-4 w-4" />
              <AlertDescription>
                Location detected: {locationData.latitude.toFixed(6)}, {locationData.longitude.toFixed(6)}
              </AlertDescription>
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

export default CurrentLocationTab;