-- Drop existing tables if they exist
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS respondents CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS health_units CASCADE;
DROP TABLE IF EXISTS questionnaire_questions CASCADE;

-- Create admin_users table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health_units table (simplified - hanya nama tempat)
CREATE TABLE health_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL, -- Puskesmas, RS, Klinik
    is_active BOOLEAN DEFAULT true,
    respondent_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questionnaire_questions table
CREATE TABLE questionnaire_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_number INTEGER NOT NULL UNIQUE,
    question_text TEXT NOT NULL,
    scoring_options JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create respondents table
CREATE TABLE respondents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    respondent_number VARCHAR(20) UNIQUE NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    device_id VARCHAR(100) NOT NULL,
    
    -- Data Pribadi
    nama VARCHAR(100) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    umur INTEGER,
    alamat TEXT NOT NULL,
    rt_rw VARCHAR(20),
    kelurahan VARCHAR(50),
    kecamatan VARCHAR(50),
    nomor_telepon VARCHAR(20) NOT NULL,
    nik VARCHAR(20),
    
    -- Data Kesehatan & Kehamilan
    tempat_konsultasi VARCHAR(100), -- Ubah dari nama_puskesmas
    usia_kehamilan INTEGER, -- dalam minggu
    kehamilan_ke INTEGER DEFAULT 1,
    berat_badan DECIMAL(5,2),
    tinggi_badan DECIMAL(5,2),
    lila DECIMAL(5,2), -- Lingkar Lengan Atas
    tekanan_darah VARCHAR(20),
    
    -- Data Sosial Ekonomi
    pendidikan VARCHAR(50),
    pekerjaan VARCHAR(50),
    penghasilan_bulanan DECIMAL(12,2),
    status_pernikahan VARCHAR(30),
    
    -- Data Suami/Pasangan
    nama_suami VARCHAR(100),
    umur_suami INTEGER,
    pendidikan_suami VARCHAR(50),
    pekerjaan_suami VARCHAR(50),
    penghasilan_suami DECIMAL(12,2),
    
    -- Data Dukungan Sosial
    dukungan_suami VARCHAR(20), -- Sangat Baik, Baik, Cukup, Kurang, Sangat Kurang
    dukungan_keluarga VARCHAR(20),
    dukungan_masyarakat VARCHAR(20),
    nama_anggota_keluarga TEXT,
    jumlah_anak INTEGER DEFAULT 0,
    
    -- Riwayat Kesehatan
    riwayat_antidepresan VARCHAR(20) DEFAULT 'Tidak Pernah',
    riwayat_keluarga_antidepresan VARCHAR(30) DEFAULT 'Tidak Ada',
    riwayat_masalah_kesehatan TEXT,
    riwayat_kehamilan_sebelumnya TEXT,
    
    -- Masalah Kehamilan Saat Ini
    masalah_kehamilan JSONB DEFAULT '[]'::jsonb,
    keluhan_fisik TEXT,
    keluhan_psikologis TEXT,
    
    -- Data Kuesioner EPDS
    kuesioner JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_score INTEGER NOT NULL DEFAULT 0,
    category VARCHAR(20) NOT NULL DEFAULT 'Sangat Ringan',
    
    -- Rekomendasi & Tindak Lanjut
    rekomendasi TEXT,
    perlu_rujukan BOOLEAN DEFAULT false,
    status_rujukan VARCHAR(20) DEFAULT 'Belum',
    catatan_bidan TEXT,
    
    -- Metadata
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    respondent_id UUID REFERENCES respondents(id) ON DELETE CASCADE,
    recipient_name VARCHAR(100) NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    device_id VARCHAR(100),
    message TEXT NOT NULL,
    notification_type VARCHAR(20) DEFAULT 'info', -- info, warning, urgent
    is_sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert seed data untuk health_units (hanya nama tempat)
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
('Klinik Pratama Lainnya', 'Klinik');

-- Insert seed data untuk questionnaire_questions (10 pertanyaan EPDS)
INSERT INTO questionnaire_questions (question_number, question_text, scoring_options) VALUES
(1, 'Saya dapat tertawa dan melihat sisi lucu dari sesuatu', '[
    {"value": 0, "label": "Sama seperti biasanya", "description": "Dapat tertawa dengan mudah"},
    {"value": 1, "label": "Tidak sebanyak sekarang", "description": "Agak kurang dari biasanya"},
    {"value": 2, "label": "Jelas kurang dari sekarang", "description": "Jauh lebih sedikit"},
    {"value": 3, "label": "Sama sekali tidak", "description": "Tidak bisa tertawa sama sekali"}
]'::jsonb),

(2, 'Saya dapat menantikan sesuatu dengan penuh kegembiraan', '[
    {"value": 0, "label": "Sama seperti biasanya", "description": "Sangat menantikan"},
    {"value": 1, "label": "Agak kurang dari biasanya", "description": "Kurang menantikan"},
    {"value": 2, "label": "Jelas kurang dari biasanya", "description": "Jauh lebih sedikit"},
    {"value": 3, "label": "Hampir tidak sama sekali", "description": "Tidak menantikan sama sekali"}
]'::jsonb),

(3, 'Saya menyalahkan diri sendiri tanpa perlu ketika hal-hal berjalan salah', '[
    {"value": 0, "label": "Tidak, tidak pernah", "description": "Tidak menyalahkan diri"},
    {"value": 1, "label": "Tidak, tidak terlalu sering", "description": "Jarang menyalahkan diri"},
    {"value": 2, "label": "Ya, kadang-kadang", "description": "Kadang menyalahkan diri"},
    {"value": 3, "label": "Ya, hampir selalu", "description": "Selalu menyalahkan diri"}
]'::jsonb),

(4, 'Saya cemas atau khawatir tanpa alasan yang jelas', '[
    {"value": 0, "label": "Tidak, tidak sama sekali", "description": "Tidak pernah cemas"},
    {"value": 1, "label": "Hampir tidak pernah", "description": "Jarang cemas"},
    {"value": 2, "label": "Ya, kadang-kadang", "description": "Kadang cemas"},
    {"value": 3, "label": "Ya, amat sering", "description": "Sering cemas"}
]'::jsonb),

(5, 'Saya merasa takut atau panik tanpa alasan yang jelas', '[
    {"value": 0, "label": "Tidak, tidak pernah sama sekali", "description": "Tidak pernah takut"},
    {"value": 1, "label": "Tidak, tidak perlu", "description": "Jarang takut"},
    {"value": 2, "label": "Ya, kadang-kadang", "description": "Kadang takut"},
    {"value": 3, "label": "Ya, sering sekali", "description": "Sering takut"}
]'::jsonb),

(6, 'Hal-hal menumpuk di atas saya', '[
    {"value": 0, "label": "Tidak, saya dapat mengatasinya dengan baik seperti biasanya", "description": "Dapat mengatasi dengan baik"},
    {"value": 1, "label": "Tidak, biasanya saya dapat mengatasinya dengan baik", "description": "Biasanya dapat mengatasi"},
    {"value": 2, "label": "Ya, kadang saya tidak dapat mengatasi seperti biasanya", "description": "Kadang tidak dapat mengatasi"},
    {"value": 3, "label": "Ya, seringkali saya sama sekali tidak dapat mengatasinya", "description": "Tidak dapat mengatasi"}
]'::jsonb),

(7, 'Saya sangat tidak bahagia sehingga saya sulit tidur', '[
    {"value": 0, "label": "Tidak, tidak pernah", "description": "Tidur normal"},
    {"value": 1, "label": "Tidak, tidak sering", "description": "Jarang sulit tidur"},
    {"value": 2, "label": "Ya, kadang-kadang", "description": "Kadang sulit tidur"},
    {"value": 3, "label": "Ya, hampir selalu", "description": "Selalu sulit tidur"}
]'::jsonb),

(8, 'Saya merasa sedih atau sengsara', '[
    {"value": 0, "label": "Tidak pernah", "description": "Tidak pernah sedih"},
    {"value": 1, "label": "Jarang", "description": "Jarang sedih"},
    {"value": 2, "label": "Ya, sering", "description": "Sering sedih"},
    {"value": 3, "label": "Ya, hampir selalu", "description": "Selalu sedih"}
]'::jsonb),

(9, 'Saya sangat tidak bahagia sehingga saya menangis', '[
    {"value": 0, "label": "Tidak pernah", "description": "Tidak pernah menangis"},
    {"value": 1, "label": "Hanya sekali-kali", "description": "Jarang menangis"},
    {"value": 2, "label": "Ya, sering", "description": "Sering menangis"},
    {"value": 3, "label": "Ya, hampir selalu", "description": "Selalu menangis"}
]'::jsonb),

(10, 'Pikiran untuk mencelakai diri sendiri sering muncul', '[
    {"value": 0, "label": "Tidak pernah", "description": "Tidak pernah berpikir mencelakai diri"},
    {"value": 1, "label": "Hampir tidak pernah", "description": "Jarang berpikir mencelakai diri"},
    {"value": 2, "label": "Kadang-kadang", "description": "Kadang berpikir mencelakai diri"},
    {"value": 3, "label": "Ya, agak sering", "description": "Sering berpikir mencelakai diri"}
]'::jsonb);

-- Insert default admin user
INSERT INTO admin_users (username, password_hash, full_name, email) VALUES
('admin', '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZOeKq7QZ9QmjQZ9QmjQZ9QmjQZ9QmjQZ', 'Administrator', 'admin@jeneponto.go.id');

-- Create indexes for better performance
CREATE INDEX idx_respondents_phone ON respondents(nomor_telepon);
CREATE INDEX idx_respondents_tempat_konsultasi ON respondents(tempat_konsultasi);
CREATE INDEX idx_respondents_category ON respondents(category);
CREATE INDEX idx_respondents_submitted_at ON respondents(submitted_at);
CREATE INDEX idx_respondents_nik ON respondents(nik);
CREATE INDEX idx_notifications_recipient_phone ON notifications(recipient_phone);
CREATE INDEX idx_health_units_name ON health_units(name);
CREATE INDEX idx_questionnaire_questions_number ON questionnaire_questions(question_number);

-- Create function to update respondent count
CREATE OR REPLACE FUNCTION update_health_unit_respondent_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update count for old health unit (if updating)
    IF TG_OP = 'UPDATE' AND OLD.tempat_konsultasi IS DISTINCT FROM NEW.tempat_konsultasi THEN
        UPDATE health_units 
        SET respondent_count = (
            SELECT COUNT(*) FROM respondents 
            WHERE tempat_konsultasi = OLD.tempat_konsultasi
        )
        WHERE name = OLD.tempat_konsultasi;
    END IF;
    
    -- Update count for new/current health unit
    IF TG_OP IN ('INSERT', 'UPDATE') THEN
        UPDATE health_units 
        SET respondent_count = (
            SELECT COUNT(*) FROM respondents 
            WHERE tempat_konsultasi = NEW.tempat_konsultasi
        )
        WHERE name = NEW.tempat_konsultasi;
    END IF;
    
    -- Update count when deleting
    IF TG_OP = 'DELETE' THEN
        UPDATE health_units 
        SET respondent_count = (
            SELECT COUNT(*) FROM respondents 
            WHERE tempat_konsultasi = OLD.tempat_konsultasi
        )
        WHERE name = OLD.tempat_konsultasi;
        RETURN OLD;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update respondent count
CREATE TRIGGER trigger_update_health_unit_count
    AFTER INSERT OR UPDATE OR DELETE ON respondents
    FOR EACH ROW
    EXECUTE FUNCTION update_health_unit_respondent_count();
