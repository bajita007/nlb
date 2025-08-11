-- Drop existing tables if they exist
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS respondents CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

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

-- Create respondents table with proper structure for masyarakat
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
    nama_puskesmas VARCHAR(100),
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

-- Create health_units table for better management
CREATE TABLE health_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL, -- Puskesmas, RS, Klinik
    address TEXT,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default health units
INSERT INTO health_units (name, type, address, phone) VALUES
('Puskesmas Bangkala', 'Puskesmas', 'Jl. Poros Bangkala, Jeneponto', '0411-123456'),
('Puskesmas Batang', 'Puskesmas', 'Jl. Batang Raya, Jeneponto', '0411-123457'),
('Puskesmas Binamu', 'Puskesmas', 'Jl. Binamu Utara, Jeneponto', '0411-123458'),
('Puskesmas Bontoramba', 'Puskesmas', 'Jl. Bontoramba, Jeneponto', '0411-123459'),
('Puskesmas Kelara', 'Puskesmas', 'Jl. Kelara Indah, Jeneponto', '0411-123460'),
('Puskesmas Rumbia', 'Puskesmas', 'Jl. Rumbia Timur, Jeneponto', '0411-123461'),
('Puskesmas Tamalatea', 'Puskesmas', 'Jl. Tamalatea, Jeneponto', '0411-123462'),
('Puskesmas Turatea', 'Puskesmas', 'Jl. Turatea Selatan, Jeneponto', '0411-123463'),
('RSUD Jeneponto', 'RS', 'Jl. Jenderal Sudirman, Jeneponto', '0411-123464'),
('RS Bersalin Siti Khadijah', 'RS', 'Jl. Veteran, Jeneponto', '0411-123465');

-- Insert default admin user
INSERT INTO admin_users (username, password_hash, full_name, email) VALUES
('admin', '$2b$10$rQZ9QmjQZ9QmjQZ9QmjQZOeKq7QZ9QmjQZ9QmjQZ9QmjQZ9QmjQZ', 'Administrator', 'admin@jeneponto.go.id');

-- Create indexes for better performance
CREATE INDEX idx_respondents_phone ON respondents(nomor_telepon);
CREATE INDEX idx_respondents_puskesmas ON respondents(nama_puskesmas);
CREATE INDEX idx_respondents_category ON respondents(category);
CREATE INDEX idx_respondents_submitted_at ON respondents(submitted_at);
CREATE INDEX idx_respondents_nik ON respondents(nik);
CREATE INDEX idx_notifications_recipient_phone ON notifications(recipient_phone);
