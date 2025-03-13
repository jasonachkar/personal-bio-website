/*
  # Update portfolio content with complete information

  1. Updates
    - Add education information
    - Add new skills
    - Add new projects (Explorer, FamilyTreeCreator)
    - Update profile content with complete information
    - Add language proficiency information

  2. Content Structure
    - Education details with GPA
    - Comprehensive skills list
    - Additional projects with detailed descriptions
    - Language proficiencies
*/

-- Add education table
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  degree text NOT NULL,
  institution text NOT NULL,
  location text NOT NULL,
  gpa text,
  order_num integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to education"
  ON education
  FOR SELECT
  TO public
  USING (true);

-- Insert education data
INSERT INTO education (degree, institution, location, gpa, order_num)
VALUES (
  'Bachelor of Computer Science',
  'Concordia University',
  'Montreal, QC',
  '3.56/4.3',
  1
);

-- Add languages table
CREATE TABLE IF NOT EXISTS languages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  proficiency text NOT NULL,
  order_num integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to languages"
  ON languages
  FOR SELECT
  TO public
  USING (true);

-- Insert language data
INSERT INTO languages (name, proficiency, order_num) VALUES
('English', 'Native', 1),
('French', 'Native', 2),
('Arabic', 'Native', 3),
('Spanish', 'Intermediate', 4);

-- Add new skills
INSERT INTO skills (category, name, details, order_num) VALUES
('Technical', 'API Integration', 'RESTful APIs, GraphQL', 9),
('Technical', 'Testing & Debugging', 'Unit Testing, Integration Testing', 10),
('Technical', 'Agile Methodologies', 'Scrum, Kanban', 11),
('Technical', 'Systems Architecture', 'Design Patterns, System Design', 12);

-- Add new projects
INSERT INTO projects (title, type, description, details, technologies, status, order_num) VALUES
('Explorer', '3D FPS Game', 'Immersive 3D adventure game with combat systems and AI behaviors',
  '[
    "Designed and developed a 3D adventure game where players rescue a kidnapped sister in a mysterious forest.",
    "Leveraged Unreal Engine''s 3D rendering and asset management tools for an immersive experience.",
    "Combined Blueprints and C++ to implement combat systems, AI behaviors, and dynamic environmental interactions.",
    "Applied object-oriented design and iterative testing to optimize performance and scalability."
  ]',
  '["Unreal Engine", "C++", "Blueprints", "3D Modeling"]',
  'Completed',
  2),
('FamilyTreeCreator', 'Web Application', 'Full-stack platform for creating and managing family trees',
  '[
    "Developed a full-stack platform enabling users to create, save, and manage personalized family trees.",
    "Engineered a secure Node.js backend with robust API endpoints for user authentication and data processing.",
    "Integrated NoSQL databases (Upstash and Blob) for efficient hierarchical data management.",
    "Implemented responsive design and security best practices for a seamless, multi-user experience."
  ]',
  '["Node.js", "React", "NoSQL", "REST API"]',
  'Completed',
  3);

-- Update profile content
UPDATE profile_content
SET 
  description = 'Highly motivated technology professional with a strong academic foundation in Computer Science from Concordia University and practical experience from internships at Genetec and Matrox. I have honed my skills in software development, systems design, and emerging technologies like AI and machine learning, applying them in projects using C#, Java, C++, Flutter, and ReactJS. This blend of academic rigor and hands-on work enables me to drive digital innovation in collaborative environments.'
WHERE id = (SELECT id FROM profile_content LIMIT 1);