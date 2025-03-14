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
    <div className="min-h-screen pt-20 pb-16 px-4 bg-[#0a0a0a] bg-opacity-95 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
        >
          <h2 className="text-3xl font-bold mb-12 font-mono bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">{i18n.t('projects.title')}</h2>
          <div className="grid grid-cols-1 gap-8">
            {projects.map((project, index) => (
              <div key={project.id} className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.6, -0.05, 0.01, 0.99] }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-black/40 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(0,255,0,0.1)] border border-green-500/20 hover:border-green-500/40 p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,0,0.2)]"
                >
                  <div className="flex items-center mb-6">
                    <div className="text-green-500 mr-4 transform group-hover:scale-110 transition-transform duration-300">
                      {getIcon(getTranslatedContent(project.id, 'type', project.type))}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-green-400 mb-2 font-mono">
                        {getTranslatedContent(project.id, 'title', project.title)}
                      </h3>
                      <p className="text-cyan-400 font-medium font-mono">
                        {getTranslatedContent(project.id, 'type', project.type)}
                      </p>
                    </div>
                  </div>
                  <p className="text-green-400/80 mb-6 leading-relaxed font-mono">
                    {getTranslatedContent(project.id, 'description', project.description)}
                  </p>
                  <ul className="space-y-3 mb-6">
                    {(getTranslatedContent(project.id, 'details', project.details) as string[]).map((detail, i) => (
                      <li key={i} className="text-green-400/70 flex items-start font-mono">
                        <span className="mr-3 mt-1.5 text-green-500">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-4 py-2 bg-green-500/10 text-green-400 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow duration-300 border border-green-500/20 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-green-400/60 flex items-center font-mono">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {i18n.t('projects.status')}: {getTranslatedContent(project.id, 'status', project.status)}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Matrix-like Background Elements */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/5 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/5 rounded-full filter blur-3xl animate-pulse" />
      </div>
    </div>
  );
};

export default Projects;