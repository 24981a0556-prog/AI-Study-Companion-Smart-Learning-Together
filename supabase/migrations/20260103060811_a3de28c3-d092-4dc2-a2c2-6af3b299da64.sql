-- Create enum for classroom roles
CREATE TYPE public.classroom_role AS ENUM ('admin', 'member');

-- Create enum for study preferences
CREATE TYPE public.study_preference AS ENUM ('revision', 'detailed', 'visual');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  course TEXT,
  exam_type TEXT,
  study_preference study_preference DEFAULT 'detailed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create classrooms table
CREATE TABLE public.classrooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  invite_code TEXT UNIQUE NOT NULL DEFAULT substring(md5(random()::text), 1, 8),
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create classroom members table with roles
CREATE TABLE public.classroom_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role classroom_role DEFAULT 'member' NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(classroom_id, user_id)
);

-- Create notes table
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE SET NULL,
  topic TEXT NOT NULL,
  style TEXT NOT NULL,
  content TEXT NOT NULL,
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create doubts table for chat history
CREATE TABLE public.doubts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create mock tests table
CREATE TABLE public.mock_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE SET NULL,
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  questions JSONB NOT NULL,
  answers JSONB,
  score INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create study streaks table
CREATE TABLE public.study_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  current_streak INTEGER DEFAULT 0 NOT NULL,
  longest_streak INTEGER DEFAULT 0 NOT NULL,
  last_study_date DATE,
  total_study_days INTEGER DEFAULT 0 NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doubts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_streaks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Function to check classroom membership
CREATE OR REPLACE FUNCTION public.is_classroom_member(_user_id UUID, _classroom_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.classroom_members
    WHERE user_id = _user_id AND classroom_id = _classroom_id
  )
$$;

-- Function to check classroom admin
CREATE OR REPLACE FUNCTION public.is_classroom_admin(_user_id UUID, _classroom_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.classroom_members
    WHERE user_id = _user_id AND classroom_id = _classroom_id AND role = 'admin'
  )
$$;

-- Classrooms policies
CREATE POLICY "Users can view classrooms they are members of"
ON public.classrooms FOR SELECT
USING (public.is_classroom_member(auth.uid(), id));

CREATE POLICY "Authenticated users can create classrooms"
ON public.classrooms FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Classroom admins can update classroom"
ON public.classrooms FOR UPDATE
USING (public.is_classroom_admin(auth.uid(), id));

CREATE POLICY "Classroom admins can delete classroom"
ON public.classrooms FOR DELETE
USING (public.is_classroom_admin(auth.uid(), id));

-- Classroom members policies
CREATE POLICY "Members can view other members in their classrooms"
ON public.classroom_members FOR SELECT
USING (public.is_classroom_member(auth.uid(), classroom_id));

CREATE POLICY "Authenticated users can join classrooms"
ON public.classroom_members FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update member roles"
ON public.classroom_members FOR UPDATE
USING (public.is_classroom_admin(auth.uid(), classroom_id));

CREATE POLICY "Admins can remove members or users can leave"
ON public.classroom_members FOR DELETE
USING (public.is_classroom_admin(auth.uid(), classroom_id) OR auth.uid() = user_id);

-- Notes policies
CREATE POLICY "Users can view their own notes"
ON public.notes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view shared notes in their classrooms"
ON public.notes FOR SELECT
USING (is_shared = true AND public.is_classroom_member(auth.uid(), classroom_id));

CREATE POLICY "Users can create their own notes"
ON public.notes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
ON public.notes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
ON public.notes FOR DELETE
USING (auth.uid() = user_id);

-- Doubts policies
CREATE POLICY "Users can view their own doubts"
ON public.doubts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own doubts"
ON public.doubts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Mock tests policies
CREATE POLICY "Users can view their own tests"
ON public.mock_tests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tests"
ON public.mock_tests FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tests"
ON public.mock_tests FOR UPDATE
USING (auth.uid() = user_id);

-- Study streaks policies
CREATE POLICY "Users can view their own streaks"
ON public.study_streaks FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own streaks"
ON public.study_streaks FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks"
ON public.study_streaks FOR UPDATE
USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  
  INSERT INTO public.study_streaks (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_classrooms_updated_at
  BEFORE UPDATE ON public.classrooms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();