-- Hanya menambahkan tabel baru tanpa mengubah tabel respondents yang sudah ada

-- Create health_units table (tempat konsultasi)
CREATE TABLE IF NOT EXISTS health_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL, -- Puskesmas, RS, Klinik
    is_active BOOLEAN DEFAULT true,
    respondent_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questionnaire_questions table
CREATE TABLE IF NOT EXISTS questionnaire_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_number INTEGER NOT NULL UNIQUE,
    question_text TEXT NOT NULL,
    scoring_options JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert seed data untuk health_units
INSERT INTO health_units (name, type) 
SELECT name, type FROM (VALUES
    ('Puskesmas Bangkala', 'Puskesmas'),
    ('Puskesmas Batang', 'Puskesmas'),
    ('Puskesmas Binamu', 'Puskesmas'),
    ('Puskesmas Bontoramba', 'Puskesmas'),
    ('Puskesmas Kelara', 'Puskesmas'),
    ('Puskesmas Rumbia', 'Puskesmas'),
    ('Puskesmas Tamalatea', 'Puskesmas'),
    ('Puskesmas Turatea', 'Puskesmas'),
    ('RSUD Jeneponto', 'RS'),
    ('RS Bersalin Siti Khadijah', 'RS'),
    ('Klinik Pratama Lainnya', 'Klinik')
) AS v(name, type)
WHERE NOT EXISTS (SELECT 1 FROM health_units WHERE health_units.name = v.name);

-- Insert seed data untuk questionnaire_questions (10 pertanyaan EPDS)
INSERT INTO questionnaire_questions (question_number, question_text, scoring_options) 
SELECT question_number, question_text, scoring_options::jsonb FROM (VALUES
    (1, 'Saya dapat tertawa dan melihat sisi lucu dari sesuatu', '[
        {"value": 0, "label": "Sama seperti biasanya"},
        {"value": 1, "label": "Tidak sebanyak sekarang"},
        {"value": 2, "label": "Jelas kurang dari sekarang"},
        {"value": 3, "label": "Sama sekali tidak"}
    ]'),
    
    (2, 'Saya dapat menantikan sesuatu dengan penuh kegembiraan', '[
        {"value": 0, "label": "Sama seperti biasanya"},
        {"value": 1, "label": "Agak kurang dari biasanya"},
        {"value": 2, "label": "Jelas kurang dari biasanya"},
        {"value": 3, "label": "Hampir tidak sama sekali"}
    ]'),
    
    (3, 'Saya menyalahkan diri sendiri tanpa perlu ketika hal-hal berjalan salah', '[
        {"value": 0, "label": "Tidak, tidak pernah"},
        {"value": 1, "label": "Tidak, tidak terlalu sering"},
        {"value": 2, "label": "Ya, kadang-kadang"},
        {"value": 3, "label": "Ya, hampir selalu"}
    ]'),
    
    (4, 'Saya cemas atau khawatir tanpa alasan yang jelas', '[
        {"value": 0, "label": "Tidak, tidak sama sekali"},
        {"value": 1, "label": "Hampir tidak pernah"},
        {"value": 2, "label": "Ya, kadang-kadang"},
        {"value": 3, "label": "Ya, amat sering"}
    ]'),
    
    (5, 'Saya merasa takut atau panik tanpa alasan yang jelas', '[
        {"value": 0, "label": "Tidak, tidak pernah sama sekali"},
        {"value": 1, "label": "Tidak, tidak perlu"},
        {"value": 2, "label": "Ya, kadang-kadang"},
        {"value": 3, "label": "Ya, sering sekali"}
    ]'),
    
    (6, 'Hal-hal menumpuk di atas saya', '[
        {"value": 0, "label": "Tidak, saya dapat mengatasinya dengan baik seperti biasanya"},
        {"value": 1, "label": "Tidak, biasanya saya dapat mengatasinya dengan baik"},
        {"value": 2, "label": "Ya, kadang saya tidak dapat mengatasi seperti biasanya"},
        {"value": 3, "label": "Ya, seringkali saya sama sekali tidak dapat mengatasinya"}
    ]'),
    
    (7, 'Saya sangat tidak bahagia sehingga saya sulit tidur', '[
        {"value": 0, "label": "Tidak, tidak pernah"},
        {"value": 1, "label": "Tidak, tidak sering"},
        {"value": 2, "label": "Ya, kadang-kadang"},
        {"value": 3, "label": "Ya, hampir selalu"}
    ]'),
    
    (8, 'Saya merasa sedih atau sengsara', '[
        {"value": 0, "label": "Tidak pernah"},
        {"value": 1, "label": "Jarang"},
        {"value": 2, "label": "Ya, sering"},
        {"value": 3, "label": "Ya, hampir selalu"}
    ]'),
    
    (9, 'Saya sangat tidak bahagia sehingga saya menangis', '[
        {"value": 0, "label": "Tidak pernah"},
        {"value": 1, "label": "Hanya sekali-kali"},
        {"value": 2, "label": "Ya, sering"},
        {"value": 3, "label": "Ya, hampir selalu"}
    ]'),
    
    (10, 'Pikiran untuk mencelakai diri sendiri sering muncul', '[
        {"value": 0, "label": "Tidak pernah"},
        {"value": 1, "label": "Hampir tidak pernah"},
        {"value": 2, "label": "Kadang-kadang"},
        {"value": 3, "label": "Ya, agak sering"}
    ]')
) AS v(question_number, question_text, scoring_options)
WHERE NOT EXISTS (SELECT 1 FROM questionnaire_questions WHERE questionnaire_questions.question_number = v.question_number);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_units_name ON health_units(name);
CREATE INDEX IF NOT EXISTS idx_health_units_type ON health_units(type);
CREATE INDEX IF NOT EXISTS idx_questionnaire_questions_number ON questionnaire_questions(question_number);
CREATE INDEX IF NOT EXISTS idx_questionnaire_questions_active ON questionnaire_questions(is_active);

-- Create function to update respondent count (menggunakan nama_puskesmas dari tabel respondents)
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

-- Update existing respondent counts
UPDATE health_units 
SET respondent_count = (
    SELECT COUNT(*) 
    FROM respondents 
    WHERE respondents.nama_puskesmas = health_units.name
),
updated_at = NOW();
