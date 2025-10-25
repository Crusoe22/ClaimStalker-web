
-- ============================
-- Dimension Tables
-- ============================

-- Agencies Dimension
CREATE TABLE public."DimAgencies" (
    agency_id SERIAL PRIMARY KEY,
    agency_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100), -- Remove?
    contact_email VARCHAR(255), -- Possible connection key
    contact_phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Carriers Dimension
CREATE TABLE public."DimCarriers" (
    carrier_id SERIAL PRIMARY KEY,
    carrier_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    underwriter_name VARCHAR(100), -- Will possibly need Updated
    underwriter_phone VARCHAR(20),
    underwriter_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Dimension (keep minimal info for reporting only)
-- Use Agency email (e.g. @metronet.com) as verification for agency users
-- This has to be seperate from the Users table for security purposes
CREATE TABLE public."DimUsers" (
    user_id SERIAL PRIMARY KEY,
    display_name VARCHAR(100) NOT NULL,
    role VARCHAR(50),
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Claim Update Types Dimension (for standardized categories)
-- Allow sort by update type 
/*"Opened"

"Assigned to Adjuster"

"Investigation Ongoing"

"Reserve Set"

"Payment Issued"

"Closed"

"Payment Sent"

"Paid Out"
*/
CREATE TABLE public."DimClaimUpdateTypes" (
    update_type_id SERIAL PRIMARY KEY,
    update_type_name VARCHAR(100) NOT NULL
);

-- ============================
-- Fact Tables
-- ============================
-- These tables are designed for analysis and reporting purposes. 
-- They allow the Claims table (Table that interacts with the application/users) to remain separate and stops a query from locking the table.
-- They could be used to pull for the view claims page


-- Claims Fact Table
CREATE TABLE public."FactClaims" (
    claim_id SERIAL PRIMARY KEY,
    policy_number VARCHAR(100) NOT NULL,
    loss_date DATE,
    claim_status VARCHAR(50),
    agency_id INT REFERENCES public."DimAgencies"(agency_id),
    carrier_id INT REFERENCES public."DimCarriers"(carrier_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Claim Updates Fact Table
CREATE TABLE public."FactClaimUpdates" (
    update_id SERIAL PRIMARY KEY,
    claim_id INT NOT NULL REFERENCES public."FactClaims"(claim_id) ON DELETE CASCADE,
    update_type_id INT NOT NULL REFERENCES public."DimUpdateTypes"(update_type_id),
    update_description TEXT,
    adjuster_name VARCHAR(100),
    adjuster_email VARCHAR(255),
    adjuster_phone VARCHAR(20),
    reserve_amount DECIMAL(15, 2),
    payment_amount DECIMAL(15, 2),
    coverage_issued BOOLEAN DEFAULT FALSE,
    outstanding_item TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INT REFERENCES public."DimUsers"(user_id)
);


-- ============================
-- Current table updates
-- ============================
-- Operational tables that interact with the application/users


-- Adding foreign keys to Claims table to link with Agencies and Carriers
ALTER TABLE public."Claims"
    ADD COLUMN agency_id INT REFERENCES public."Agencies"(agency_id),
    ADD COLUMN carrier_id INT REFERENCES public."Carriers"(carrier_id);


-- ============================
-- Indexes for Performance
-- ============================

CREATE INDEX idx_factclaims_agency ON public."FactClaims"(agency_id);
CREATE INDEX idx_factclaims_carrier ON public."FactClaims"(carrier_id);
CREATE INDEX idx_claimupdates_claim ON public."FactClaimUpdates"(claim_id);
CREATE INDEX idx_claimupdates_updatetype ON public."FactClaimUpdates"(update_type_id);