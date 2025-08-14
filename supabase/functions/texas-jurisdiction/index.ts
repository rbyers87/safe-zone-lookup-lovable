import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JurisdictionResult {
  agencyName: string;
  nonEmergencyPhone: string;
  physicalAddress: string;
  website: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { latitude, longitude, address } = await req.json();
    
    console.log('Processing jurisdiction request:', { latitude, longitude, address });

    let lat: number, lng: number;

    if (latitude && longitude) {
      lat = latitude;
      lng = longitude;
    } else if (address) {
      // Geocode the address first
      const geocodeResult = await geocodeAddress(address);
      if (!geocodeResult) {
        throw new Error('Could not geocode the provided address');
      }
      lat = geocodeResult.lat;
      lng = geocodeResult.lng;
    } else {
      throw new Error('Either coordinates or address must be provided');
    }

    console.log('Using coordinates:', { lat, lng });

    // Check if location is within a Texas city
    const cityInfo = await checkCityBoundary(lat, lng);
    console.log('City boundary check result:', cityInfo);

    if (cityInfo && cityInfo.cityName) {
      // Look for city law enforcement
      console.log('Searching for city agency:', cityInfo.cityName);
      const { data: cityAgency, error: cityError } = await supabase
        .from('texas_agencies')
        .select('*')
        .eq('agency_type', 'city')
        .ilike('jurisdiction_name', cityInfo.cityName)
        .limit(1)
        .single();

      console.log('City agency query result:', { cityAgency, cityError });

      if (cityAgency) {
        console.log('Found city agency:', cityAgency.agency_name);
        const result = {
          agencyName: cityAgency.agency_name,
          nonEmergencyPhone: cityAgency.non_emergency_phone || 'Not available',
          physicalAddress: cityAgency.physical_address || 'Not available',
          website: cityAgency.website || 'Not available'
        };
        console.log('Returning city result:', result);
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Fall back to county law enforcement
    const countyInfo = await getCountyFromCoordinates(lat, lng);
    console.log('County info:', countyInfo);

    if (countyInfo && countyInfo.countyName) {
      console.log('Searching for county agency:', `${countyInfo.countyName} County`);
      const { data: countyAgency, error: countyError } = await supabase
        .from('texas_agencies')
        .select('*')
        .eq('agency_type', 'county')
        .ilike('jurisdiction_name', `${countyInfo.countyName} County`)
        .limit(1)
        .single();

      console.log('County agency query result:', { countyAgency, countyError });

      if (countyAgency) {
        console.log('Found county agency:', countyAgency.agency_name);
        const result = {
          agencyName: countyAgency.agency_name,
          nonEmergencyPhone: countyAgency.non_emergency_phone || 'Not available',
          physicalAddress: countyAgency.physical_address || 'Not available',
          website: countyAgency.website || 'Not available'
        };
        console.log('Returning county result:', result);
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // If no specific agency found, return generic Texas info
    console.log('No specific agency found, returning Texas DPS');
    const fallbackResult = {
      agencyName: 'Texas Department of Public Safety',
      nonEmergencyPhone: '512-424-2000',
      physicalAddress: '5805 N Lamar Blvd, Austin, TX 78752',
      website: 'https://www.dps.texas.gov'
    };
    console.log('Returning fallback result:', fallbackResult);
    return new Response(JSON.stringify(fallbackResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in texas-jurisdiction function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      agencyName: 'Error - Contact 911 for emergencies',
      nonEmergencyPhone: '911',
      physicalAddress: 'Unknown',
      website: 'https://www.dps.texas.gov'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    // Using OpenStreetMap Nominatim for geocoding (free)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=us`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

async function checkCityBoundary(lat: number, lng: number): Promise<{ cityName: string } | null> {
  try {
    // TxDOT City Boundaries GIS API
    const url = `https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_City_Boundaries/FeatureServer/0/query`;
    const params = new URLSearchParams({
      f: 'json',
      geometry: `${lng},${lat}`,
      geometryType: 'esriGeometryPoint',
      inSR: '4326',
      spatialRel: 'esriSpatialRelWithin',
      outFields: 'CITY_NM',
      returnGeometry: 'false'
    });

    const response = await fetch(`${url}?${params}`);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      return { cityName: data.features[0].attributes.CITY_NM };
    }
    return null;
  } catch (error) {
    console.error('City boundary check error:', error);
    return null;
  }
}

async function getCountyFromCoordinates(lat: number, lng: number): Promise<{ countyName: string } | null> {
  try {
    // TxDOT County Boundaries GIS API
    const url = `https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/Texas_County_Boundaries/FeatureServer/0/query`;
    const params = new URLSearchParams({
      f: 'json',
      geometry: `${lng},${lat}`,
      geometryType: 'esriGeometryPoint',
      inSR: '4326',
      spatialRel: 'esriSpatialRelWithin',
      outFields: 'CNTY_NM',
      returnGeometry: 'false'
    });

    const response = await fetch(`${url}?${params}`);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      return { countyName: data.features[0].attributes.CNTY_NM };
    }
    return null;
  } catch (error) {
    console.error('County lookup error:', error);
    return null;
  }
}