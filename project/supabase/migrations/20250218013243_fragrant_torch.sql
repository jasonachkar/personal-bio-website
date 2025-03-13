/*
  # Content Management System Tables

  1. New Tables
    - `profile_content`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `title` (text)
      - `description` (text)
      - `phone` (text)
      - `email` (text)
      - `location` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `experience`
      - `id` (uuid, primary key)
      - `company` (text)
      - `role` (text)
      - `period` (text)
      - `location` (text)
      - `description` (jsonb)
      - `order` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `type` (text)
      - `description` (text)
      - `details` (jsonb)
      - `technologies` (jsonb)
      - `status` (text)
      - `order` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `skills`
      - `id` (uuid, primary key)
      - `category` (text)
      - `name` (text)
      - `details` (text)
      - `order` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage content
*/

-- Profile Content Table
CREATE TABLE profile_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  phone text,
  email text,
  location text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Experience Table
CREATE TABLE experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  role text NOT NULL,
  period text NOT NULL,
  location text NOT NULL,
  description jsonb NOT NULL,
  order_num integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Projects Table
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL,
  description text NOT NULL,
  details jsonb NOT NULL,
  technologies jsonb NOT NULL,
  status text NOT NULL,
  order_num integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Skills Table
CREATE TABLE skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  details text NOT NULL,
  order_num integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profile_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to profile_content"
  ON profile_content
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to experience"
  ON experience
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to projects"
  ON projects
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to skills"
  ON skills
  FOR SELECT
  TO public
  USING (true);

-- Insert initial profile content
INSERT INTO profile_content (full_name, title, description, phone, email, location, image_url)
VALUES (
  'Jason Achkar Diab',
  'Software Engineer & Computer Science Graduate',
  'A passionate software engineer with experience at Genetec and Matrox, specializing in software development, mobile applications, and innovative solutions.',
  '+1 438-921 2508',
  'jasonachkardiab@gmail.com',
  'Montreal, Quebec',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces'
);