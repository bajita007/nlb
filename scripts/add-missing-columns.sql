-- Add missing columns to health_units table if they don't exist
DO $$ 
BEGIN
    -- Add respondent_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'health_units' AND column_name = 'respondent_count') THEN
        ALTER TABLE health_units ADD COLUMN respondent_count INTEGER DEFAULT 0;
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'health_units' AND column_name = 'updated_at') THEN
        ALTER TABLE health_units ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Update existing respondent counts based on current data
UPDATE health_units 
SET respondent_count = (
    SELECT COUNT(*) 
    FROM respondents 
    WHERE respondents.nama_puskesmas = health_units.name
),
updated_at = NOW();

-- Create or replace function to update respondent count
CREATE OR REPLACE FUNCTION update_health_unit_respondent_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update count for old health unit (if updating)
    IF TG_OP = 'UPDATE' AND OLD.nama_puskesmas IS DISTINCT FROM NEW.nama_puskesmas THEN
        UPDATE health_units 
        SET respondent_count = (
            SELECT COUNT(*) FROM respondents 
            WHERE nama_puskesmas = OLD.nama_puskesmas
        ),
        updated_at = NOW()
        WHERE name = OLD.nama_puskesmas;
    END IF;
    
    -- Update count for new/current health unit
    IF TG_OP IN ('INSERT', 'UPDATE') THEN
        UPDATE health_units 
        SET respondent_count = (
            SELECT COUNT(*) FROM respondents 
            WHERE nama_puskesmas = NEW.nama_puskesmas
        ),
        updated_at = NOW()
        WHERE name = NEW.nama_puskesmas;
    END IF;
    
    -- Update count when deleting
    IF TG_OP = 'DELETE' THEN
        UPDATE health_units 
        SET respondent_count = (
            SELECT COUNT(*) FROM respondents 
            WHERE nama_puskesmas = OLD.nama_puskesmas
        ),
        updated_at = NOW()
        WHERE name = OLD.nama_puskesmas;
        RETURN OLD;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update respondent count
DROP TRIGGER IF EXISTS trigger_update_health_unit_count ON respondents;
CREATE TRIGGER trigger_update_health_unit_count
    AFTER INSERT OR UPDATE OR DELETE ON respondents
    FOR EACH ROW
    EXECUTE FUNCTION update_health_unit_respondent_count();
