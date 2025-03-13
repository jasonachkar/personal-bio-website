import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Gamepad2, Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';

interface Project {
  id: string;
  title: string;
  type: string;
  description: string;
  details: string[];
  technologies: string[];
  status: string;
  order_num: number;
}

interface Translation {
  field_name: string;
  content: string;
}

const Projects = () => {
  const { i18n } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('order_num');

        if (projectsError) throw projectsError;

        // Fetch translations if language is French
        if (i18n.language === 'fr') {
          const { data: translationsData, error: translationsError } = await supabase
            .from('translations')
            .select('field_name, content, record_id')
            .eq('table_name', 'projects')
            .eq('language', 'fr');

          if (translationsError) throw translationsError;

          // Organize translations by project ID and field
          const translationsByProject = translationsData.reduce((acc: Record<string, Record<string, string>>, curr) => {
            if (!acc[curr.record_id]) {
              acc[curr.record_id] = {};
            }
            acc[curr.record_id][curr.field_name] = curr.content;
            return acc;
          }, {});

          setTranslations(translationsByProject);
        } else {
          setTranslations({});
        }

        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [i18n.language]);

  const getTranslatedContent = (projectId: string, fieldName: keyof Project, originalContent: any) => {
    if (i18n.language === 'fr' && translations[projectId]?.[fieldName]) {
      return translations[projectId][fieldName];
    }
    return originalContent;
  };

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'mobile application':
      case 'application mobile':
        return <Smartphone size={24} />;
      case '3d fps game':
      case 'jeu fps 3d':
        return <Gamepad2 size={24} />;
      case 'web application':
      case 'application web':
        return <Share2 size={24} />;
      default:
        return <Share2 size={24} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{i18n.t('projects.title')}</h2>
          <div className="grid grid-cols-1 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-blue-600 dark:text-blue-400 mr-3">
                      {getIcon(getTranslatedContent(project.id, 'type', project.type))}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {getTranslatedContent(project.id, 'title', project.title)}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400">
                        {getTranslatedContent(project.id, 'type', project.type)}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {getTranslatedContent(project.id, 'description', project.description)}
                  </p>
                  <ul className="space-y-2 mb-4">
                    {(getTranslatedContent(project.id, 'details', project.details) as string[]).map((detail, i) => (
                      <li key={i} className="text-gray-600 dark:text-gray-300 flex items-start">
                        <span className="mr-2 mt-1.5">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {i18n.t('projects.status')}: {getTranslatedContent(project.id, 'status', project.status)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Projects;