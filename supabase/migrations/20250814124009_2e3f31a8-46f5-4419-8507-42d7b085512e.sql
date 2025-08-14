-- Create table for Texas law enforcement agencies
CREATE TABLE public.texas_agencies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_name TEXT NOT NULL,
  agency_type TEXT NOT NULL CHECK (agency_type IN ('city', 'county', 'state')),
  jurisdiction_name TEXT NOT NULL, -- City name or County name
  non_emergency_phone TEXT,
  physical_address TEXT,
  website TEXT,
  fips_code TEXT, -- For county matching
  city_id TEXT, -- For city matching with GIS data
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.texas_agencies ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (this is public safety data)
CREATE POLICY "Public can view Texas agencies" 
ON public.texas_agencies 
FOR SELECT 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_texas_agencies_type_jurisdiction ON public.texas_agencies(agency_type, jurisdiction_name);
CREATE INDEX idx_texas_agencies_fips ON public.texas_agencies(fips_code);
CREATE INDEX idx_texas_agencies_city_id ON public.texas_agencies(city_id);

-- Insert sample Texas agencies data
INSERT INTO public.texas_agencies (agency_name, agency_type, jurisdiction_name, non_emergency_phone, physical_address, website, fips_code) VALUES
-- Major Counties
('Harris County Sheriff''s Office', 'county', 'Harris County', '713-755-7428', '1200 Baker St, Houston, TX 77002', 'https://www.hcso.org', '48201'),
('Dallas County Sheriff''s Department', 'county', 'Dallas County', '214-749-8641', '133 N Riverfront Blvd, Dallas, TX 75207', 'https://www.dallascounty.org/departments/sheriff', '48113'),
('Tarrant County Sheriff''s Office', 'county', 'Tarrant County', '817-884-1213', '100 N Lamar St, Fort Worth, TX 76196', 'https://www.tarrantcounty.com/en/sheriff', '48439'),
('Bexar County Sheriff''s Office', 'county', 'Bexar County', '210-335-6000', '200 N Comal St, San Antonio, TX 78207', 'https://www.bexar.org/1697/Sheriffs-Office', '48029'),
('Travis County Sheriff''s Office', 'county', 'Travis County', '512-854-9770', '5555 Airport Blvd, Austin, TX 78751', 'https://www.traviscountytx.gov/sheriff', '48453'),

-- Major Cities
('Houston Police Department', 'city', 'Houston', '713-884-3131', '1200 Travis St, Houston, TX 77002', 'https://www.houstontx.gov/police', NULL),
('Dallas Police Department', 'city', 'Dallas', '214-671-4500', '1400 S Lamar St, Dallas, TX 75215', 'https://www.dallaspolice.net', NULL),
('San Antonio Police Department', 'city', 'San Antonio', '210-207-7273', '315 S Santa Rosa Ave, San Antonio, TX 78207', 'https://www.sanantonio.gov/SAPD', NULL),
('Austin Police Department', 'city', 'Austin', '512-974-5000', '715 E 8th St, Austin, TX 78701', 'https://www.austintexas.gov/department/police', NULL),
('Fort Worth Police Department', 'city', 'Fort Worth', '817-392-4222', '350 W Belknap St, Fort Worth, TX 76102', 'https://www.fortworthtexas.gov/departments/police', NULL),
('El Paso Police Department', 'city', 'El Paso', '915-832-4400', '911 N Raynor St, El Paso, TX 79901', 'https://www.elpasotexas.gov/police', NULL),
('Arlington Police Department', 'city', 'Arlington', '817-459-5000', '620 W Division St, Arlington, TX 76011', 'https://www.arlingtontx.gov/city_hall/departments/police', NULL),
('Corpus Christi Police Department', 'city', 'Corpus Christi', '361-886-2600', '321 John Sartain St, Corpus Christi, TX 78401', 'https://www.cctexas.com/departments/police-department', NULL),
('Plano Police Department', 'city', 'Plano', '972-424-5678', '909 14th St, Plano, TX 75074', 'https://www.plano.gov/173/Police', NULL),
('Lubbock Police Department', 'city', 'Lubbock', '806-775-2865', '916 Texas Ave, Lubbock, TX 79401', 'https://www.mylubbock.us/departments/police', NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_texas_agencies_updated_at
BEFORE UPDATE ON public.texas_agencies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();