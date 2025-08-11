-- Create posttest_results table
CREATE TABLE IF NOT EXISTS posttest_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_phone VARCHAR(20) NOT NULL,
    answers INTEGER[] NOT NULL,
    total_depression_score INTEGER NOT NULL DEFAULT 0,
    depression_category VARCHAR(100) NOT NULL DEFAULT 'Normal',
    total_anxiety_score INTEGER NOT NULL DEFAULT 0,
    anxiety_category VARCHAR(100) NOT NULL DEFAULT 'Normal',
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_posttest_user_id ON posttest_results(user_id);
CREATE INDEX IF NOT EXISTS idx_posttest_created_at ON posttest_results(created_at);

-- Add RLS policies
ALTER TABLE posttest_results ENABLE ROW LEVEL SECURITY;

-- Policy for users to see their own results
CREATE POLICY "Users can view own posttest results" ON posttest_results
    FOR SELECT USING (true);

-- Policy for inserting posttest results
CREATE POLICY "Users can insert posttest results" ON posttest_results
    FOR INSERT WITH CHECK (true);
