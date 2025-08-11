-- =============================================
-- SIMPLE CLEAN DATABASE SETUP
-- Drop all tables and recreate with dual password support
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CLEAN SLATE - DROP ALL EXISTING TABLES
-- =============================================
DROP TABLE IF EXISTS admin_login_logs CASCADE;
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS admin_roles CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS respondents CASCADE;

-- Drop any views
DROP VIEW IF EXISTS admin_user_summary CASCADE;

-- =============================================
-- CREATE ADMIN USERS TABLE (SIMPLE VERSION)
-- =============================================
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    password TEXT, -- Plain text password
    password_hash TEXT, -- Hashed password (for future use)
    full_name TEXT NOT NULL,
    email TEXT,
    role TEXT DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CREATE ADMIN SESSIONS TABLE (SIMPLE VERSION)
-- =============================================
CREATE TABLE admin_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CREATE RESPONDENTS TABLE
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
    recipient_id TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    recipient_phone TEXT NOT NULL,
    device_id TEXT NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INSERT DEFAULT ADMIN USERS
-- =============================================
INSERT INTO admin_users (username, password, password_hash, full_name, email, role) VALUES
('admin', 'admin123', '$2b$10$admin123hash', 'Administrator Penelitian', 'admin@research.local', 'admin'),
('researcher', 'research2025', '$2b$10$research2025hash', 'Fitriani Sukardi, SKM', 'fitriani@research.unhas.ac.id', 'researcher');

-- =============================================
-- CREATE BASIC INDEXES
-- =============================================
CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_admin_users_is_active ON admin_users(is_active);
CREATE INDEX idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX idx_respondents_nomor_telepon ON respondents(nomor_telepon);
CREATE INDEX idx_respondents_user_id ON respondents(user_id);
CREATE INDEX idx_respondents_submitted_at ON respondents(submitted_at);
CREATE INDEX idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX idx_notifications_sent_at ON notifications(sent_at);

-- =============================================
-- VERIFICATION
-- =============================================
-- Show created tables
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('admin_users', 'admin_sessions', 'respondents', 'notifications')
ORDER BY tablename;

-- Show created admin users
SELECT 
    username,
    full_name,
    email,
    role,
    is_active,
    CASE 
        WHEN password IS NOT NULL AND password_hash IS NOT NULL THEN 'both'
        WHEN password IS NOT NULL THEN 'plain'
        WHEN password_hash IS NOT NULL THEN 'hashed'
        ELSE 'none'
    END as password_type,
    created_at
FROM admin_users
ORDER BY created_at;

-- Show table counts
SELECT 
    'admin_users' as table_name, COUNT(*) as row_count FROM admin_users
UNION ALL
SELECT 
    'admin_sessions' as table_name, COUNT(*) as row_count FROM admin_sessions
UNION ALL
SELECT 
    'respondents' as table_name, COUNT(*) as row_count FROM respondents
UNION ALL
SELECT 
    'notifications' as table_name, COUNT(*) as row_count FROM notifications;

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
DO $$
BEGIN
    RAISE NOTICE '==============================================';
    RAISE NOTICE '✅ SIMPLE DATABASE SETUP COMPLETED!';
    RAISE NOTICE '==============================================';
    RAISE NOTICE '🧹 All old tables have been dropped and recreated';
    RAISE NOTICE '👤 Default admin users created:';
    RAISE NOTICE '   - admin / admin123 (Administrator)';
    RAISE NOTICE '   - researcher / research2025 (Researcher)';
    RAISE NOTICE '📊 Tables: admin_users, admin_sessions, respondents, notifications';
    RAISE NOTICE '🔑 Both password and password_hash columns available';
    RAISE NOTICE '🚀 Ready to use!';
    RAISE NOTICE '==============================================';
END $$;
