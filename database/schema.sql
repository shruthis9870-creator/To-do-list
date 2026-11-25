-- ====================================================================
-- TaskFlow Database Schema & Row-Level Security (RLS) Setup
-- Target Database: Supabase PostgreSQL
-- ====================================================================

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Create PROFILES Table
-- Stores user profile metadata linked to Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create TASKS Table
-- Stores user tasks linked to auth.users
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    category TEXT NOT NULL DEFAULT 'Personal' CHECK (category IN ('Personal', 'Work', 'Study', 'Other')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Indexes for High Performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for PROFILES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 6. RLS Policies for TASKS
DROP POLICY IF EXISTS "Users can view own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON public.tasks;

CREATE POLICY "Users can view own tasks"
    ON public.tasks
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
    ON public.tasks
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
    ON public.tasks
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
    ON public.tasks
    FOR DELETE
    USING (auth.uid() = user_id);

-- 7. Trigger to automatically update updated_at on tasks
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_tasks_updated_at ON public.tasks;
CREATE TRIGGER set_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 8. Trigger to automatically create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, created_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        timezone('utc'::text, now())
    )
    ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- 9. Seed Default / Demo User & Starter Tasks
-- Credentials:
-- Email:    demo@taskflow.com
-- Password: TaskFlow123!
-- ====================================================================
DO $$
DECLARE
    demo_user_id UUID := 'd0000000-0000-0000-0000-000000000001';
BEGIN
    -- Check if demo user already exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'demo@taskflow.com') THEN
        -- Insert into auth.users with encrypted password
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            demo_user_id,
            'authenticated',
            'authenticated',
            'demo@taskflow.com',
            crypt('TaskFlow123!', gen_salt('bf')),
            timezone('utc'::text, now()),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"full_name":"Demo User"}'::jsonb,
            timezone('utc'::text, now()),
            timezone('utc'::text, now()),
            ''
        );

        -- Insert identity record for Supabase GoTrue authentication
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'identities') THEN
            BEGIN
                INSERT INTO auth.identities (
                    id,
                    user_id,
                    identity_data,
                    provider,
                    provider_id,
                    last_sign_in_at,
                    created_at,
                    updated_at
                ) VALUES (
                    demo_user_id,
                    demo_user_id,
                    jsonb_build_object('sub', demo_user_id::text, 'email', 'demo@taskflow.com'),
                    'email',
                    demo_user_id::text,
                    timezone('utc'::text, now()),
                    timezone('utc'::text, now()),
                    timezone('utc'::text, now())
                )
                ON CONFLICT DO NOTHING;
            EXCEPTION WHEN OTHERS THEN
                BEGIN
                    INSERT INTO auth.identities (
                        id,
                        user_id,
                        identity_data,
                        provider,
                        last_sign_in_at,
                        created_at,
                        updated_at
                    ) VALUES (
                        demo_user_id,
                        demo_user_id,
                        jsonb_build_object('sub', demo_user_id::text, 'email', 'demo@taskflow.com'),
                        'email',
                        timezone('utc'::text, now()),
                        timezone('utc'::text, now()),
                        timezone('utc'::text, now())
                    )
                    ON CONFLICT DO NOTHING;
                EXCEPTION WHEN OTHERS THEN
                    NULL; -- Safely ignore if identity table structure differs
                END;
            END;
        END IF;

        -- Ensure profile exists
        INSERT INTO public.profiles (id, full_name, created_at)
        VALUES (demo_user_id, 'Demo User', timezone('utc'::text, now()))
        ON CONFLICT (id) DO UPDATE SET full_name = 'Demo User';

        -- Insert starter tasks
        INSERT INTO public.tasks (user_id, title, description, due_date, priority, category, status)
        VALUES 
            (
                demo_user_id, 
                'Welcome to TaskFlow! 👋', 
                'Explore your dashboard, review task metrics, and check off items to stay productive.', 
                CURRENT_DATE, 
                'high', 
                'Personal', 
                'completed'
            ),
            (
                demo_user_id, 
                'Organize project deliverables 📊', 
                'Review upcoming deadlines, assign priorities (High, Medium, Low), and set categories.', 
                CURRENT_DATE + INTERVAL '1 day', 
                'medium', 
                'Work', 
                'pending'
            ),
            (
                demo_user_id, 
                'Try creating your own custom task ✨', 
                'Click the "+ Add New Task" button in the upper right to create your first personal task.', 
                CURRENT_DATE + INTERVAL '3 days', 
                'low', 
                'Study', 
                'pending'
            );
    END IF;
END $$;
