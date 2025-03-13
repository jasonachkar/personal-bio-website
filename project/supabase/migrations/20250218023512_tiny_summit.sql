/*
  # Add translations support

  1. New Tables
    - `translations` - Stores translations for all content
      - `id` (uuid, primary key)
      - `table_name` (text) - The table the translation belongs to
      - `record_id` (uuid) - The ID of the record being translated
      - `field_name` (text) - The field being translated
      - `language` (text) - The language code (en/fr)
      - `content` (text) - The translated content
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Changes
    - Update profile_content table to include image_alt field
    - Add translations for all content

  3. Security
    - Enable RLS on translations table
    - Add policy for public read access
*/

-- Create translations table
CREATE TABLE translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  field_name text NOT NULL,
  language text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to translations"
  ON translations
  FOR SELECT
  TO public
  USING (true);

-- Add image_alt field to profile_content
ALTER TABLE profile_content
ADD COLUMN image_alt text;

-- Update profile_content with image alt text
UPDATE profile_content
SET image_alt = 'Profile picture of Jason Achkar Diab'
WHERE id = (SELECT id FROM profile_content LIMIT 1);

-- Insert translations for profile content
INSERT INTO translations (table_name, record_id, field_name, language, content)
SELECT 
  'profile_content',
  id,
  'title',
  'fr',
  'Ingénieur Logiciel & Diplômé en Informatique'
FROM profile_content;

INSERT INTO translations (table_name, record_id, field_name, language, content)
SELECT 
  'profile_content',
  id,
  'description',
  'fr',
  'Un ingénieur logiciel passionné avec de l''expérience chez Genetec et Matrox, spécialisé dans le développement logiciel, les applications mobiles et les solutions innovantes.'
FROM profile_content;

INSERT INTO translations (table_name, record_id, field_name, language, content)
SELECT 
  'profile_content',
  id,
  'image_alt',
  'fr',
  'Photo de profil de Jason Achkar Diab'
FROM profile_content;

-- Insert translations for experience
INSERT INTO translations (table_name, record_id, field_name, language, content)
SELECT 
  'experience',
  id,
  'role',
  'fr',
  CASE 
    WHEN company = 'Outlier.ai' THEN 'Formateur en IA'
    WHEN company = 'DataAnnotation' THEN 'Formateur en IA et Vérificateur de Faits'
    WHEN company = 'CommuniLink Solutions' THEN 'Directeur général et Ingénieur logiciel principal'
    WHEN company = 'Genetec' THEN 'Stagiaire ingénieur logiciel'
    WHEN company = 'Matrox' THEN 'Stagiaire ingénieur d''applications'
  END
FROM experience;

-- Insert translations for projects
INSERT INTO translations (table_name, record_id, field_name, language, content)
SELECT 
  'projects',
  id,
  'title',
  'fr',
  CASE 
    WHEN title = 'MaVille' THEN 'MaVille'
    WHEN title = 'Explorer' THEN 'Explorateur'
    WHEN title = 'FamilyTreeCreator' THEN 'CréateurArbreGénéalogique'
  END
FROM projects;

INSERT INTO translations (table_name, record_id, field_name, language, content)
SELECT 
  'projects',
  id,
  'description',
  'fr',
  CASE 
    WHEN title = 'MaVille' THEN 'Application multiplateforme améliorant la communication entre les municipalités et les résidents'
    WHEN title = 'Explorer' THEN 'Jeu d''aventure 3D immersif avec systèmes de combat et comportements IA'
    WHEN title = 'FamilyTreeCreator' THEN 'Plateforme full-stack pour créer et gérer des arbres généalogiques'
  END
FROM projects;

-- Insert translations for education
INSERT INTO translations (table_name, record_id, field_name, language, content)
SELECT 
  'education',
  id,
  'degree',
  'fr',
  'Baccalauréat en Informatique'
FROM education;

INSERT INTO translations (table_name, record_id, field_name, language, content)
SELECT 
  'education',
  id,
  'institution',
  'fr',
  'Université Concordia'
FROM education;

-- Create function to get translated content
CREATE OR REPLACE FUNCTION get_translation(
  p_table_name text,
  p_record_id uuid,
  p_field_name text,
  p_language text
) RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  v_translation text;
BEGIN
  SELECT content INTO v_translation
  FROM translations
  WHERE table_name = p_table_name
    AND record_id = p_record_id
    AND field_name = p_field_name
    AND language = p_language;
  
  RETURN v_translation;
END;
$$;