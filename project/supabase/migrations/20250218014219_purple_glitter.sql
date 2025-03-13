/*
  # Update experience entries with English content

  1. Updates
    - Update all experience entries to English
    - Ensure exact match with provided content
*/

-- Update experience entries to English
UPDATE experience
SET 
  role = 'AI Trainer',
  period = 'December 2024 - Present',
  location = 'Remote',
  description = '["Train AI in coding, including Python, Java, and Go."]'
WHERE company = 'Outlier.ai';

UPDATE experience
SET 
  role = 'AI Trainer & Fact Checker',
  period = 'September 2024 - Present',
  location = 'Remote',
  description = '[
    "Train AI in Mathematics, Geography, and Sociology.",
    "Serve as a French Technical Writer and Fact Checker across all dialects.",
    "Act as an Arabic Technical Writer and Fact Checker covering various dialects."
  ]'
WHERE company = 'DataAnnotation';

UPDATE experience
SET 
  role = 'Managing Director & Lead Software Engineer',
  period = 'April 2024 - Present',
  location = 'Laval, QC',
  description = '[
    "Led the development of a cross-platform mobile app using Flutter and Firebase for emergency notifications.",
    "Directed a team of 4 to enhance software functionality, security, and user experience."
  ]'
WHERE company = 'CommuniLink Solutions';

UPDATE experience
SET 
  role = 'Software Engineer Intern',
  period = 'January 2024 - April 2024',
  location = 'Montreal, QC',
  description = '[
    "Developed secure C# and SQL code in a cybersecurity-focused environment.",
    "Collaborated with the Ktulu team, strengthening teamwork and problem-solving skills."
  ]'
WHERE company = 'Genetec';

UPDATE experience
SET 
  role = 'Applications Engineer Intern',
  period = 'May 2023 - September 2023',
  location = 'Dorval, QC',
  description = '[
    "Developed high-performance applications in C#, ReactJS, Java, and C++, integrating APIs for device control.",
    "Troubleshot hardware and software issues, showcasing effective solutions to customers."
  ]'
WHERE company = 'Matrox';