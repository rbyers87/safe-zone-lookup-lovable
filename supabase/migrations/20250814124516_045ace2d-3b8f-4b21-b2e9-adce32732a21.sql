-- Add more Texas agencies including smaller cities and missing counties
INSERT INTO public.texas_agencies (agency_name, agency_type, jurisdiction_name, non_emergency_phone, physical_address, website, fips_code) VALUES
-- Port Arthur and other Southeast Texas cities
('Port Arthur Police Department', 'city', 'Port Arthur', '409-983-8600', '645 4th St, Port Arthur, TX 77640', 'https://www.portarthur.com/police', NULL),
('Beaumont Police Department', 'city', 'Beaumont', '409-832-1234', '255 College St, Beaumont, TX 77701', 'https://www.beaumont.gov/departments/police', NULL),
('Orange Police Department', 'city', 'Orange', '409-883-1026', '220 N 6th St, Orange, TX 77630', 'https://www.orangetx.gov/departments/police', NULL),

-- Jefferson County (for the current request)
('Jefferson County Sheriff''s Office', 'county', 'Jefferson County', '409-835-8411', '1001 Pearl St, Beaumont, TX 77701', 'https://www.co.jefferson.tx.us/sheriff', '48245'),

-- More major counties that were missing
('Collin County Sheriff''s Office', 'county', 'Collin County', '972-547-5100', '4690 Community Ave, McKinney, TX 75071', 'https://www.collincountytx.gov/sheriff', '48085'),
('Denton County Sheriff''s Office', 'county', 'Denton County', '940-349-1600', '127 N Woodrow Ln, Denton, TX 76201', 'https://www.dentoncounty.gov/259/Sheriffs-Office', '48121'),
('Williamson County Sheriff''s Office', 'county', 'Williamson County', '512-943-1300', '508 S Rock St, Georgetown, TX 78626', 'https://www.wilco.org/Departments/Sheriff', '48491'),
('Montgomery County Sheriff''s Office', 'county', 'Montgomery County', '936-760-5800', '500 N San Jacinto St, Conroe, TX 77301', 'https://www.mctx.org/departments/sheriff', '48339'),
('Galveston County Sheriff''s Office', 'county', 'Galveston County', '409-766-2322', '5600 39th St, Galveston, TX 77550', 'https://www.galvestoncountytx.gov/departments/sheriff', '48167'),
('Brazoria County Sheriff''s Office', 'county', 'Brazoria County', '979-864-2392', '111 E Locust St, Angleton, TX 77515', 'https://www.brazoriacountytx.gov/departments/sheriff', '48039'),

-- More major cities
('Garland Police Department', 'city', 'Garland', '972-485-4840', '1891 Forest Ln, Garland, TX 75042', 'https://www.garlandtx.gov/departments/police', NULL),
('Irving Police Department', 'city', 'Irving', '972-273-1010', '305 N O''Connor Rd, Irving, TX 75061', 'https://www.cityofirving.org/150/Police', NULL),
('Laredo Police Department', 'city', 'Laredo', '956-795-2800', '4712 Maher Ave, Laredo, TX 78041', 'https://www.cityoflaredo.com/departments/police', NULL),
('Amarillo Police Department', 'city', 'Amarillo', '806-378-3038', '200 SE 3rd Ave, Amarillo, TX 79101', 'https://www.amarillo.gov/departments/police', NULL),
('Grand Prairie Police Department', 'city', 'Grand Prairie', '972-237-8790', '300 W Main St, Grand Prairie, TX 75050', 'https://www.gptx.org/departments/police', NULL),
('McKinney Police Department', 'city', 'McKinney', '972-547-2700', '2200 Taylor Burk Dr, McKinney, TX 75071', 'https://www.mckinneytexas.org/departments/police', NULL),
('Frisco Police Department', 'city', 'Frisco', '972-292-6010', '7200 Stonebrook Pkwy, Frisco, TX 75034', 'https://www.friscotexas.gov/departments/police', NULL),

-- Add state-level fallback
('Texas Department of Public Safety', 'state', 'Texas', '512-424-2000', '5805 N Lamar Blvd, Austin, TX 78752', 'https://www.dps.texas.gov', NULL);