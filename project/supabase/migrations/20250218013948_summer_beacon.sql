/*
  # Add initial data for the portfolio

  1. Data Population
    - Add skills data
    - Add experience data
    - Add projects data

  2. Content
    - Skills: Programming, Mobile Development, AI & ML, etc.
    - Experience: Outlier.ai, DataAnnotation, CommuniLink, etc.
    - Projects: MaVille and other projects
*/

-- Insert skills
INSERT INTO skills (category, name, details, order_num) VALUES
('Technical', 'Programming', 'C#, Java, C++, Python, Dart', 1),
('Technical', 'Mobile Development', 'Flutter, Cross-platform Development', 2),
('Technical', 'AI & Machine Learning', 'Model Training, Implementation', 3),
('Technical', 'Cloud Computing', 'Firebase, Cloud Services', 4),
('Technical', 'Database', 'Design & Architecture', 5),
('Technical', 'Full-Stack', 'End-to-end Development', 6),
('Technical', 'Version Control', 'Git, Team Collaboration', 7),
('Technical', 'Cybersecurity', 'Security Best Practices', 8);

-- Insert experience
INSERT INTO experience (company, role, period, location, description, order_num) VALUES
('Outlier.ai', 'Formateur en IA', 'Décembre 2024 - Présent', 'Télétravail', 
  '["Formé l''IA dans les domaines suivants : programmation (Python, Java, Go)."]', 1),
('DataAnnotation', 'Formateur en IA et Vérificateur de Faits', 'Septembre 2024 - Présent', 'Télétravail',
  '[
    "Formé l''IA dans divers domaines, notamment les mathématiques, la géographie et la sociologie.",
    "Occupé le rôle de rédacteur technique en français pour la formation de l''IA et vérificateur de faits en français, couvrant tous les dialectes.",
    "Travaillé en tant que rédacteur technique en arabe pour la formation de l''IA et vérificateur de faits en arabe, couvrant tous les dialectes."
  ]', 2),
('CommuniLink Solutions', 'Directeur général et Ingénieur logiciel principal', 'Avril 2024 - Présent', 'Laval, QC',
  '[
    "Dirigé le développement d''une application mobile multiplateforme utilisant Flutter et Firebase pour les notifications d''urgence.",
    "Supervisé une équipe de 4 personnes, améliorant la fonctionnalité, la sécurité et l''expérience utilisateur."
  ]', 3),
('Genetec', 'Stagiaire ingénieur logiciel', 'Janvier 2024 - Avril 2024', 'Montréal, QC',
  '[
    "Développé du code sécurisé en C# et SQL dans un environnement axé sur la cybersécurité.",
    "Collaboré avec l''équipe Ktulu, renforçant les compétences en travail d''équipe et en résolution de problèmes."
  ]', 4),
('Matrox', 'Stagiaire ingénieur d''applications', 'Mai 2023 - Septembre 2023', 'Dorval, QC',
  '[
    "Développé des applications en C#, ReactJS, Java et C++, intégrant des API pour le contrôle des dispositifs.",
    "Résolution de problèmes sur les dispositifs matériels/logiciels et présentation des solutions aux clients."
  ]', 5);

-- Insert projects
INSERT INTO projects (title, type, description, details, technologies, status, order_num) VALUES
('MaVille', 'Mobile Application', 'Application multiplateforme améliorant la communication entre les municipalités et les résidents',
  '[
    "Dirigé le développement d''une application mobile multiplateforme améliorant la communication entre les municipalités et les résidents.",
    "Mise en œuvre du suivi des demandes en temps réel, carte interactive de la ville, et notifications personnalisables via Firebase Cloud Messaging.",
    "Développé une interface utilisateur intuitive et formé/soutenu le personnel municipal.",
    "Intégré un chatbot IA pour assister les citoyens dans leurs demandes municipales."
  ]',
  '["Flutter", "Firebase", "AI", "Cloud Messaging"]',
  'Déployé sur App/Play Store',
  1);