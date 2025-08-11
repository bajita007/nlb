-- COMPLETE FRESH DATABASE SETUP
-- Menghapus semua tabel lama dan membuat database baru dari awal

-- =============================================
-- DROP ALL EXISTING TABLES
-- =============================================
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS respondents CASCADE;
DROP TABLE IF EXISTS questionnaire_questions CASCADE;
DROP TABLE IF EXISTS health_units CASCADE;
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Drop functions and triggers
DROP FUNCTION IF EXISTS update_health_unit_respondent_count() CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CREATE ADMIN USERS TABLE
-- =============================================
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT, -- Plain text password for development
    password_hash TEXT, -- Hashed password (optional)
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CREATE HEALTH UNITS TABLE
-- =============================================
CREATE TABLE health_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL, -- Puskesmas, RS, Klinik
    is_active BOOLEAN DEFAULT true,
    respondent_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CREATE QUESTIONNAIRE QUESTIONS TABLE
-- =============================================
CREATE TABLE questionnaire_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_number INTEGER NOT NULL UNIQUE,
    question_text TEXT NOT NULL,
    scoring_options JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CREATE RESPONDENTS TABLE (STRUKTUR ASLI)
-- =============================================
CREATE TABLE respondents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    respondent_number TEXT NOT NULL,
    user_id TEXT NOT NULL,
    device_id TEXT NOT NULL,
    nama TEXT NOT NULL,
    tanggal_lahir DATE NOT NULL,
    alamat TEXT NOT NULL,
    nomor_telepon TEXT NOT NULL,
    nama_puskesmas TEXT NOT NULL,
    berat_badan TEXT NOT NULL,
    tinggi_badan TEXT NOT NULL,
    lila TEXT NOT NULL,
    pendidikan TEXT NOT NULL,
    pekerjaan TEXT NOT NULL,
    status_pernikahan TEXT NOT NULL,
    pekerjaan_suami TEXT NOT NULL,
    pendidikan_suami TEXT NOT NULL,
    riwayat_antidepresan TEXT NOT NULL,
    riwayat_keluarga_antidepresan TEXT NOT NULL,
    dukungan_suami TEXT NOT NULL,
    dukungan_keluarga TEXT NOT NULL,
    nama_anggota_keluarga TEXT,
    riwayat_masalah_kesehatan TEXT,
    masalah_kehamilan TEXT[] DEFAULT '{}',
    kuesioner INTEGER[] NOT NULL,
    total_score INTEGER NOT NULL,
    category TEXT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CREATE NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    respondent_id UUID REFERENCES respondents(id) ON DELETE CASCADE,
    recipient_name VARCHAR(100) NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    device_id VARCHAR(100),
    message TEXT NOT NULL,
    notification_type VARCHAR(20) DEFAULT 'info',
    is_sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INSERT ADMIN USERS
-- =============================================
INSERT INTO admin_users (username, password, password_hash, full_name, email, role) VALUES
('admin', 'admin123', '$2b$10$admin123hash', 'Administrator Penelitian', 'admin@research.local', 'admin'),
('researcher', 'research2025', '$2b$10$research2025hash', 'Fitriani Sukardi, SKM', 'fitriani@research.unhas.ac.id', 'researcher'),
('bidan', 'bidan123', '$2b$10$bidan123hash', 'Bidan Koordinator', 'bidan@jeneponto.go.id', 'bidan');

-- =============================================
-- INSERT HEALTH UNITS (TEMPAT KONSULTASI)
-- =============================================
INSERT INTO health_units (name, type) VALUES
('Puskesmas Bangkala', 'Puskesmas'),
('Puskesmas Batang', 'Puskesmas'),
('Puskesmas Binamu', 'Puskesmas'),
('Puskesmas Bontoramba', 'Puskesmas'),
('Puskesmas Kelara', 'Puskesmas'),
('Puskesmas Rumbia', 'Puskesmas'),
('Puskesmas Tamalatea', 'Puskesmas'),
('Puskesmas Turatea', 'Puskesmas'),
('Puskesmas Arungkeke', 'Puskesmas'),
('Puskesmas Bonto Cani', 'Puskesmas'),
('RSUD Jeneponto', 'RS'),
('RS Bersalin Siti Khadijah', 'RS'),
('RS Ibu dan Anak Pertiwi', 'RS'),
('Klinik Pratama Sehat', 'Klinik'),
('Klinik Bersalin Harapan', 'Klinik'),
('Klinik Pratama Lainnya', 'Klinik');

-- =============================================
-- INSERT QUESTIONNAIRE QUESTIONS (10 PERTANYAAN EPDS)
-- =============================================
INSERT INTO questionnaire_questions (question_number, question_text, scoring_options) VALUES
(1, 'Saya dapat tertawa dan melihat sisi lucu dari sesuatu', '[
    {"value": 0, "label": "Sama seperti biasanya"},
    {"value": 1, "label": "Tidak sebanyak sekarang"},
    {"value": 2, "label": "Jelas kurang dari sekarang"},
    {"value": 3, "label": "Sama sekali tidak"}
]'::jsonb),

(2, 'Saya dapat menantikan sesuatu dengan penuh kegembiraan', '[
    {"value": 0, "label": "Sama seperti biasanya"},
    {"value": 1, "label": "Agak kurang dari biasanya"},
    {"value": 2, "label": "Jelas kurang dari biasanya"},
    {"value": 3, "label": "Hampir tidak sama sekali"}
]'::jsonb),

(3, 'Saya menyalahkan diri sendiri tanpa perlu ketika hal-hal berjalan salah', '[
    {"value": 0, "label": "Tidak, tidak pernah"},
    {"value": 1, "label": "Tidak, tidak terlalu sering"},
    {"value": 2, "label": "Ya, kadang-kadang"},
    {"value": 3, "label": "Ya, hampir selalu"}
]'::jsonb),

(4, 'Saya cemas atau khawatir tanpa alasan yang jelas', '[
    {"value": 0, "label": "Tidak, tidak sama sekali"},
    {"value": 1, "label": "Hampir tidak pernah"},
    {"value": 2, "label": "Ya, kadang-kadang"},
    {"value": 3, "label": "Ya, amat sering"}
]'::jsonb),

(5, 'Saya merasa takut atau panik tanpa alasan yang jelas', '[
    {"value": 0, "label": "Tidak, tidak pernah sama sekali"},
    {"value": 1, "label": "Tidak, tidak perlu"},
    {"value": 2, "label": "Ya, kadang-kadang"},
    {"value": 3, "label": "Ya, sering sekali"}
]'::jsonb),

(6, 'Hal-hal menumpuk di atas saya', '[
    {"value": 0, "label": "Tidak, saya dapat mengatasinya dengan baik seperti biasanya"},
    {"value": 1, "label": "Tidak, biasanya saya dapat mengatasinya dengan baik"},
    {"value": 2, "label": "Ya, kadang saya tidak dapat mengatasi seperti biasanya"},
    {"value": 3, "label": "Ya, seringkali saya sama sekali tidak dapat mengatasinya"}
]'::jsonb),

(7, 'Saya sangat tidak bahagia sehingga saya sulit tidur', '[
    {"value": 0, "label": "Tidak, tidak pernah"},
    {"value": 1, "label": "Tidak, tidak sering"},
    {"value": 2, "label": "Ya, kadang-kadang"},
    {"value": 3, "label": "Ya, hampir selalu"}
]'::jsonb),

(8, 'Saya merasa sedih atau sengsara', '[
    {"value": 0, "label": "Tidak pernah"},
    {"value": 1, "label": "Jarang"},
    {"value": 2, "label": "Ya, sering"},
    {"value": 3, "label": "Ya, hampir selalu"}
]'::jsonb),

(9, 'Saya sangat tidak bahagia sehingga saya menangis', '[
    {"value": 0, "label": "Tidak pernah"},
    {"value": 1, "label": "Hanya sekali-kali"},
    {"value": 2, "label": "Ya, sering"},
    {"value": 3, "label": "Ya, hampir selalu"}
]'::jsonb),

(10, 'Pikiran untuk mencelakai diri sendiri sering muncul', '[
    {"value": 0, "label": "Tidak pernah"},
    {"value": 1, "label": "Hampir tidak pernah"},
    {"value": 2, "label": "Kadang-kadang"},
    {"value": 3, "label": "Ya, agak sering"}
]'::jsonb);

-- =============================================
-- INSERT SAMPLE RESPONDENTS DATA
-- =============================================
INSERT INTO respondents (
    respondent_number, user_id, device_id, nama, tanggal_lahir, alamat, nomor_telepon, 
    nama_puskesmas, berat_badan, tinggi_badan, lila, pendidikan, pekerjaan, 
    status_pernikahan, pekerjaan_suami, pendidikan_suami, riwayat_antidepresan, 
    riwayat_keluarga_antidepresan, dukungan_suami, dukungan_keluarga, 
    nama_anggota_keluarga, riwayat_masalah_kesehatan, masalah_kehamilan, 
    kuesioner, total_score, category, submitted_at
) VALUES
('R001', 'user001', 'device001', 'Siti Aminah', '1995-03-15', 'Jl. Merdeka No. 123, Bangkala', '081234567890', 
 'Puskesmas Bangkala', '65', '160', '28', 'SMA', 'Ibu Rumah Tangga', 'Menikah', 'Petani', 'SMP', 
 'Tidak Pernah', 'Tidak Ada', 'Sangat Mendukung', 'Mendukung', 'Ibu Mertua: Hj. Fatimah', 
 'Tidak Ada', '{"Mual muntah", "Pusing"}', '{2,1,0,1,0,2,1,1,0,0}', 8, 'Ringan-Sedang', NOW() - INTERVAL '5 days'),

('R002', 'user002', 'device002', 'Nurhayati', '1992-07-22', 'Jl. Pahlawan No. 45, Batang', '081234567891', 
 'Puskesmas Batang', '58', '155', '26', 'SMP', 'Pedagang', 'Menikah', 'Nelayan', 'SD', 
 'Tidak Pernah', 'Tidak Ada', 'Mendukung', 'Kurang Mendukung', 'Suami: Ahmad', 
 'Hipertensi ringan', '{"Kaki bengkak"}', '{1,2,1,2,1,1,2,2,1,0}', 13, 'Berat', NOW() - INTERVAL '3 days'),

('R003', 'user003', 'device003', 'Fatimah', '1998-11-08', 'Jl. Sudirman No. 67, Binamu', '081234567892', 
 'Puskesmas Binamu', '70', '165', '30', 'D3', 'Guru', 'Menikah', 'PNS', 'S1', 
 'Tidak Pernah', 'Tidak Ada', 'Sangat Mendukung', 'Sangat Mendukung', 'Ibu Kandung: Hj. Khadijah', 
 'Tidak Ada', '{}', '{0,0,1,0,0,1,0,1,0,0}', 3, 'Sangat Ringan', NOW() - INTERVAL '1 day'),

('R004', 'user004', 'device004', 'Aisyah', '1994-05-30', 'Jl. Diponegoro No. 89, Kelara', '081234567893', 
 'Puskesmas Kelara', '62', '158', '27', 'SMA', 'Ibu Rumah Tangga', 'Menikah', 'Wiraswasta', 'SMA', 
 'Tidak Pernah', 'Ada (Kakak)', 'Mendukung', 'Mendukung', 'Kakak: Nur Halimah', 
 'Anemia ringan', '{"Mudah lelah", "Pusing"}', '{1,1,2,1,1,2,2,1,1,0}', 12, 'Sedang-Berat', NOW() - INTERVAL '2 days'),

('R005', 'user005', 'device005', 'Maryam', '1996-09-12', 'Jl. Ahmad Yani No. 12, Rumbia', '081234567894', 
 'Puskesmas Rumbia', '55', '152', '25', 'SD', 'Petani', 'Menikah', 'Petani', 'SD', 
 'Tidak Pernah', 'Tidak Ada', 'Kurang Mendukung', 'Kurang Mendukung', 'Tetangga: Bu Sari', 
 'Kurang gizi', '{"Berat badan kurang", "Mudah sakit"}', '{2,2,2,2,1,2,2,2,2,1}', 18, 'Berat', NOW() - INTERVAL '4 days');

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_admin_users_is_active ON admin_users(is_active);

CREATE INDEX idx_health_units_name ON health_units(name);
CREATE INDEX idx_health_units_type ON health_units(type);
CREATE INDEX idx_health_units_is_active ON health_units(is_active);

CREATE INDEX idx_questionnaire_questions_number ON questionnaire_questions(question_number);
CREATE INDEX idx_questionnaire_questions_active ON questionnaire_questions(is_active);

CREATE INDEX idx_respondents_nomor_telepon ON respondents(nomor_telepon);
CREATE INDEX idx_respondents_nama_puskesmas ON respondents(nama_puskesmas);
CREATE INDEX idx_respondents_category ON respondents(category);
CREATE INDEX idx_respondents_submitted_at ON respondents(submitted_at);
CREATE INDEX idx_respondents_user_id ON respondents(user_id);

CREATE INDEX idx_notifications_recipient_phone ON notifications(recipient_phone);
CREATE INDEX idx_notifications_is_sent ON notifications(is_sent);

-- =============================================
-- CREATE FUNCTION TO UPDATE RESPONDENT COUNT
-- =============================================
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

-- =============================================
-- CREATE TRIGGER FOR AUTO UPDATE RESPONDENT COUNT
-- =============================================
CREATE TRIGGER trigger_update_health_unit_count
    AFTER INSERT OR UPDATE OR DELETE ON respondents
    FOR EACH ROW
    EXECUTE FUNCTION update_health_unit_respondent_count();

-- =============================================
-- UPDATE EXISTING RESPONDENT COUNTS
-- =============================================
UPDATE health_units 
SET respondent_count = (
    SELECT COUNT(*) 
    FROM respondents 
    WHERE respondents.nama_puskesmas = health_units.name
),
updated_at = NOW();

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Show all tables created
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Show admin users
SELECT 
    username,
    full_name,
    email,
    role,
    is_active,
    created_at
FROM admin_users
ORDER BY created_at;

-- Show health units with respondent counts
SELECT 
    name,
    type,
    respondent_count,
    is_active,
    created_at
FROM health_units
ORDER BY type, name;

-- Show questionnaire questions count
SELECT 
    COUNT(*) as total_questions,
    COUNT(*) FILTER (WHERE is_active = true) as active_questions
FROM questionnaire_questions;

-- Show respondents summary
SELECT 
    COUNT(*) as total_respondents,
    COUNT(*) FILTER (WHERE category = 'Sangat Ringan') as sangat_ringan,
    COUNT(*) FILTER (WHERE category = 'Ringan-Sedang') as ringan_sedang,
    COUNT(*) FILTER (WHERE category = 'Sedang-Berat') as sedang_berat,
    COUNT(*) FILTER (WHERE category = 'Berat') as berat
FROM respondents;

-- Show notifications count
SELECT COUNT(*) as total_notifications FROM notifications;

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
DO $$
BEGIN
    RAISE NOTICE '==============================================';
    RAISE NOTICE '✅ COMPLETE FRESH DATABASE SETUP SUCCESSFUL!';
    RAISE NOTICE '==============================================';
    RAISE NOTICE '👤 Admin Users: 3 (admin, researcher, bidan)';
    RAISE NOTICE '🏥 Health Units: 16 (Puskesmas, RS, Klinik)';
    RAISE NOTICE '❓ Questions: 10 (EPDS Questionnaire)';
    RAISE NOTICE '👥 Sample Respondents: 5';
    RAISE NOTICE '📧 Notifications: 0';
    RAISE NOTICE '🔧 Triggers: Auto-update respondent counts';
    RAISE NOTICE '📊 Indexes: Created for performance';
    RAISE NOTICE '🚀 System ready for use!';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Login credentials:';
    RAISE NOTICE '- admin / admin123';
    RAISE NOTICE '- researcher / research2025';
    RAISE NOTICE '- bidan / bidan123';
    RAISE NOTICE '==============================================';
END $$;
