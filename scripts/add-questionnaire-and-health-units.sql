-- Create health_units table untuk tempat konsultasi
CREATE TABLE IF NOT EXISTS health_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL, -- Puskesmas, RS, Klinik
    is_active BOOLEAN DEFAULT true,
    respondent_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questionnaire_questions table
CREATE TABLE IF NOT EXISTS questionnaire_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_number INTEGER NOT NULL UNIQUE,
    question_text TEXT NOT NULL,
    scoring_options JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert seed data untuk health_units (tempat konsultasi)
INSERT INTO health_units (name, type) VALUES
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
ON CONFLICT (name) DO NOTHING;

-- Insert seed data untuk questionnaire_questions (10 pertanyaan EPDS)
INSERT INTO questionnaire_questions (question_number, question_text, scoring_options) VALUES
(1, 'Saya dapat tertawa dan melihat segi kelucuan hal-hal tertentu:', '[
    {"value": 0, "label": "Seperti biasanya", "description": "Dapat tertawa dengan mudah"},
    {"value": 1, "label": "Sekarang tidak terlalu sering", "description": "Agak kurang dari biasanya"},
    {"value": 2, "label": "Sekarang agak jarang", "description": "Jauh lebih sedikit"},
    {"value": 3, "label": "Tidak sama sekali", "description": "Tidak bisa tertawa sama sekali"}
]'::jsonb),

(2, 'Saya menanti-nanti untuk melakukan sesuatu dengan penuh harapan:', '[
    {"value": 0, "label": "Hampir seperti biasanya", "description": "Sangat menantikan"},
    {"value": 1, "label": "Agak berkurang dari biasanya", "description": "Kurang menantikan"},
    {"value": 2, "label": "Jelas kurang dari biasanya", "description": "Jauh lebih sedikit"},
    {"value": 3, "label": "Hampir tidak sama sekali", "description": "Tidak menantikan sama sekali"}
]'::jsonb),

(3, 'Saya menyalahkan diri sendiri jika ada sesuatu yang tidak berjalan dengan baik:', '[
    {"value": 0, "label": "Tidak, tidak pernah", "description": "Tidak menyalahkan diri"},
    {"value": 1, "label": "Tidak, tidak terlalu sering", "description": "Jarang menyalahkan diri"},
    {"value": 2, "label": "Ya, kadang-kadang", "description": "Kadang menyalahkan diri"},
    {"value": 3, "label": "Ya, hampir selalu", "description": "Selalu menyalahkan diri"}
]'::jsonb),

(4, 'Saya merasa cemas atau kuatir tanpa alasan:', '[
    {"value": 0, "label": "Tidak, tidak sama sekali", "description": "Tidak pernah cemas"},
    {"value": 1, "label": "Hampir tidak pernah", "description": "Jarang cemas"},
    {"value": 2, "label": "Ya, kadang-kadang", "description": "Kadang cemas"},
    {"value": 3, "label": "Ya, amat sering", "description": "Sering cemas"}
]'::jsonb),

(5, 'Saya merasa takut atau panik tanpa alasan:', '[
    {"value": 0, "label": "Tidak, tidak pernah sama sekali", "description": "Tidak pernah takut"},
    {"value": 1, "label": "Tidak, tidak perlu", "description": "Jarang takut"},
    {"value": 2, "label": "Ya, kadang-kadang", "description": "Kadang takut"},
    {"value": 3, "label": "Ya, sering sekali", "description": "Sering takut"}
]'::jsonb),

(6, 'Banyak hal menjadi beban untuk saya:', '[
    {"value": 0, "label": "Tidak, saya dapat mengatasinya dengan baik seperti biasanya", "description": "Dapat mengatasi dengan baik"},
    {"value": 1, "label": "Tidak, biasanya saya dapat mengatasinya dengan baik", "description": "Biasanya dapat mengatasi"},
    {"value": 2, "label": "Ya, kadang saya tidak dapat mengatasi seperti biasanya", "description": "Kadang tidak dapat mengatasi"},
    {"value": 3, "label": "Ya, seringkali saya sama sekali tidak dapat mengatasinya", "description": "Tidak dapat mengatasi"}
]'::jsonb),

(7, 'Saya merasa begitu sedih sampai sulit tidur:', '[
    {"value": 0, "label": "Tidak, tidak pernah", "description": "Tidur normal"},
    {"value": 1, "label": "Tidak, tidak sering", "description": "Jarang sulit tidur"},
    {"value": 2, "label": "Ya, kadang-kadang", "description": "Kadang sulit tidur"},
    {"value": 3, "label": "Ya, hampir selalu", "description": "Selalu sulit tidur"}
]'::jsonb),

(8, 'Saya merasa sedih atau susah:', '[
    {"value": 0, "label": "Tidak pernah", "description": "Tidak pernah sedih"},
    {"value": 1, "label": "Jarang", "description": "Jarang sedih"},
    {"value": 2, "label": "Ya, sering", "description": "Sering sedih"},
    {"value": 3, "label": "Ya, hampir selalu", "description": "Selalu sedih"}
]'::jsonb),

(9, 'Saya merasa sangat sedih sehingga saya menangis:', '[
    {"value": 0, "label": "Tidak pernah", "description": "Tidak pernah menangis"},
    {"value": 1, "label": "Hanya sekali-kali", "description": "Jarang menangis"},
    {"value": 2, "label": "Ya, sering", "description": "Sering menangis"},
    {"value": 3, "label": "Ya, hampir selalu", "description": "Selalu menangis"}
]'::jsonb),

(10, 'Pikiran untuk mencelakai diri sendiri sering muncul:', '[
    {"value": 0, "label": "Tidak pernah", "description": "Tidak pernah berpikir mencelakai diri"},
    {"value": 1, "label": "Hampir tidak pernah", "description": "Jarang berpikir mencelakai diri"},
    {"value": 2, "label": "Kadang-kadang", "description": "Kadang berpikir mencelakai diri"},
    {"value": 3, "label": "Ya, agak sering", "description": "Sering berpikir mencelakai diri"}
]'::jsonb)
ON CONFLICT (question_number) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_units_name ON health_units(name);
CREATE INDEX IF NOT EXISTS idx_questionnaire_questions_number ON questionnaire_questions(question_number);

-- Create function to update respondent count
CREATE OR REPLACE FUNCTION update_health_unit_respondent_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update count for old health unit (if updating)
    IF TG_OP = 'UPDATE' AND OLD.nama_puskesmas IS DISTINCT FROM NEW.nama_puskesmas THEN
        UPDATE health_units 
        SET respondent_count = (
            SELECT COUNT(*) FROM respondents 
            WHERE nama_puskesmas = OLD.nama_puskesmas
        )
        WHERE name = OLD.nama_puskesmas;
    END IF;
    
    -- Update count for new/current health unit
    IF TG_OP IN ('INSERT', 'UPDATE') THEN
        UPDATE health_units 
        SET respondent_count = (
            SELECT COUNT(*) FROM respondents 
            WHERE nama_puskesmas = NEW.nama_puskesmas
        )
        WHERE name = NEW.nama_puskesmas;
    END IF;
    
    -- Update count when deleting
    IF TG_OP = 'DELETE' THEN
        UPDATE health_units 
        SET respondent_count = (
            SELECT COUNT(*) FROM respondents 
            WHERE nama_puskesmas = OLD.nama_puskesmas
        )
        WHERE name = OLD.nama_puskesmas;
        RETURN OLD;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update respondent count
DROP TRIGGER IF EXISTS trigger_update_health_unit_count ON respondents;
CREATE TRIGGER trigger_update_health_unit_count
    AFTER INSERT OR UPDATE OR DELETE ON respondents
    FOR EACH ROW
    EXECUTE FUNCTION update_health_unit_respondent_count();

-- Update initial respondent counts
UPDATE health_units 
SET respondent_count = (
    SELECT COUNT(*) 
    FROM respondents 
    WHERE nama_puskesmas = health_units.name
);
