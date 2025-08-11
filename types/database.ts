export interface Respondent {
  id: string
  respondent_number: string
  user_id: string
  device_id: string
  nama: string
  tanggal_lahir: string
  alamat: string
  nomor_telepon: string
  nama_puskesmas: string
  berat_badan: string
  tinggi_badan: string
  lila: string
  pendidikan: string
  pekerjaan: string
  status_pernikahan: string
  pekerjaan_suami: string
  pendidikan_suami: string
  riwayat_antidepresan: string
  riwayat_keluarga_antidepresan: string
  dukungan_suami: string
  dukungan_keluarga: string
  nama_anggota_keluarga?: string
  riwayat_masalah_kesehatan?: string
  masalah_kehamilan: string[]
  kuesioner: number[]
  total_depression_score: number
  depression_category: string
  total_anxiety_score: number
  anxiety_category: string
  submitted_at: string
  created_at: string
}

export interface HealthUnit {
  id: string
  name: string
  type: string
  is_active: boolean
  respondent_count: number
  created_at: string
  updated_at: string
}

export interface QuestionnaireQuestion {
  id: string
  question_number: number
  question_text: string
  scoring_options: ScoringOption[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ScoringOption {
  value: number
  label: string
  description?: string
}

export interface AdminUser {
  id: string
  username: string
  password_hash: string
  full_name: string
  email?: string
  role: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  respondent_id?: string
  recipient_name: string
  recipient_phone: string
  device_id?: string
  message: string
  notification_type: string
  is_sent: boolean
  sent_at?: string
  created_at: string
}
