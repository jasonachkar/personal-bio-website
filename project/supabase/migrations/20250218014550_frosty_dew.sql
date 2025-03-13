/*
  # Add education details table and content

  1. New Tables
    - `education_details` for storing comprehensive education information
      - `id` (uuid, primary key)
      - `education_id` (uuid, foreign key)
      - `period` (text)
      - `description` (text)
      - `courses` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `education_details` table
    - Add policy for public read access
*/

-- Create education details table
CREATE TABLE IF NOT EXISTS education_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  education_id uuid REFERENCES education(id),
  period text NOT NULL,
  description text NOT NULL,
  courses jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE education_details ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow public read access to education_details"
  ON education_details
  FOR SELECT
  TO public
  USING (true);

-- Insert education details
INSERT INTO education_details (
  education_id,
  period,
  description,
  courses
) VALUES (
  (SELECT id FROM education WHERE institution = 'Concordia University' LIMIT 1),
  'January 2022 - April 2025',
  'Developed a strong foundation in software development, system design, and database management through coursework at Concordia University. Gained proficiency in object-oriented programming with Java and C++ (COMP 248/249), system architecture and design patterns (COMP 346/354), and relational database management (COMP 353/333). Acquired hands-on experience in building scalable, maintainable systems and implementing efficient data solutions.',
  '[
    {
      "code": "COMP 248/249",
      "topic": "Object-Oriented Programming",
      "description": "Gained proficiency in Java and C++"
    },
    {
      "code": "COMP 346/354",
      "topic": "System Architecture and Design Patterns",
      "description": "Learned system architecture principles and design patterns"
    },
    {
      "code": "COMP 353/333",
      "topic": "Relational Database Management",
      "description": "Studied database design and management"
    },
    {
      "code": "COMP 472",
      "topic": "Artificial Intelligence and Machine Learning",
      "description": "Implemented ML algorithms and studied AI methodologies"
    },
    {
      "code": "COMP 474",
      "topic": "Advanced Artificial Intelligence",
      "description": "Gained deeper insights into AI-driven problem-solving"
    },
    {
      "code": "COMP 445",
      "topic": "Networking",
      "description": "Studied network protocols, client-server communication, and distributed systems"
    },
    {
      "code": "SOEN 287",
      "topic": "Full-Stack Web Development",
      "description": "Built full-stack web applications using modern technologies"
    }
  ]'
);