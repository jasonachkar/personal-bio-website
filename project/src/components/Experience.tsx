import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, GraduationCap, Briefcase, BookOpen, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';

interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string[];
  order_num: number;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  gpa: string;
}

interface EducationDetails {
  id: string;
  period: string;
  description: string;
  courses: {
    code: string;
    topic: string;
    description: string;
  }[];
}

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const Experience = () => {
  const { t, i18n } = useTranslation();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education | null>(null);
  const [educationDetails, setEducationDetails] = useState<EducationDetails | null>(null);
  const [translations, setTranslations] = useState<Translations>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch experiences
        const { data: expData, error: expError } = await supabase
          .from('experience')
          .select('*')
          .order('order_num');

        if (expError) throw expError;
        setExperiences(expData);

        // Fetch education
        const { data: eduData, error: eduError } = await supabase
          .from('education')
          .select('*')
          .single();

        if (eduError) throw eduError;
        setEducation(eduData);

        // Fetch education details
        const { data: eduDetailsData, error: eduDetailsError } = await supabase
          .from('education_details')
          .select('*')
          .single();

        if (eduDetailsError) throw eduDetailsError;
        setEducationDetails(eduDetailsData);

        // Fetch translations if language is French
        if (i18n.language === 'fr') {
          // Fetch experience translations
          const { data: expTransData, error: expTransError } = await supabase
            .from('translations')
            .select('field_name, content, record_id')
            .eq('table_name', 'experience')
            .eq('language', 'fr');

          if (expTransError) throw expTransError;

          // Fetch education translations
          const { data: eduTransData, error: eduTransError } = await supabase
            .from('translations')
            .select('field_name, content, record_id')
            .eq('table_name', 'education')
            .eq('language', 'fr');

          if (eduTransError) throw eduTransError;

          // Fetch education details translations
          const { data: eduDetailsTransData, error: eduDetailsTransError } = await supabase
            .from('translations')
            .select('field_name, content, record_id')
            .eq('table_name', 'education_details')
            .eq('language', 'fr');

          if (eduDetailsTransError) throw eduDetailsTransError;

          // Combine all translations
          const allTranslations = [...expTransData, ...eduTransData, ...eduDetailsTransData];
          const translationsMap = allTranslations.reduce((acc: Translations, curr) => {
            if (!acc[curr.record_id]) {
              acc[curr.record_id] = {};
            }
            acc[curr.record_id][curr.field_name] = curr.content;
            return acc;
          }, {});

          setTranslations(translationsMap);
        } else {
          setTranslations({});
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language]);

  const getTranslatedContent = (recordId: string, fieldName: string, originalContent: any) => {
    if (i18n.language === 'fr' && translations[recordId]?.[fieldName]) {
      return translations[recordId][fieldName];
    }
    return originalContent;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto">
        {/* Education Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
          className="mb-16"
        >
          <div className="flex items-center mb-8">
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900 mr-4">
              <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">{t('experience.education')}</h2>
          </div>
          
          {education && educationDetails && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {getTranslatedContent(education.id, 'degree', education.degree)}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium text-lg">
                    {getTranslatedContent(education.id, 'institution', education.institution)}
                  </p>
                  {education.gpa && (
                    <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {t('experience.gpa')}: {education.gpa}
                    </p>
                  )}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 mt-4 md:mt-0 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-full">
                  <Calendar size={18} className="mr-2" />
                  <span className="text-sm font-medium">
                    {getTranslatedContent(educationDetails.id, 'period', educationDetails.period)}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-8 flex items-center">
                <MapPin size={16} className="mr-2" />
                {getTranslatedContent(education.id, 'location', education.location)}
              </p>
              
              <div className="mb-8">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {getTranslatedContent(educationDetails.id, 'description', educationDetails.description)}
                </p>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 mr-3">
                    <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  {t('experience.keyCourses')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {educationDetails.courses.map((course, index) => (
                    <motion.div
                      key={course.code}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
                        {getTranslatedContent(`${educationDetails.id}_course_${index}`, 'topic', course.topic)}
                      </h5>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mb-3 font-medium">{course.code}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {getTranslatedContent(`${educationDetails.id}_course_${index}`, 'description', course.description)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Work Experience Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.6, -0.05, 0.01, 0.99] }}
          className="mb-16"
        >
          <div className="flex items-center mb-8">
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900 mr-4">
              <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">{t('experience.title')}</h2>
          </div>
          
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.6, -0.05, 0.01, 0.99] }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {getTranslatedContent(exp.id, 'company', exp.company)}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium text-lg">
                      {getTranslatedContent(exp.id, 'role', exp.role)}
                    </p>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mt-4 md:mt-0 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-full">
                    <Calendar size={18} className="mr-2" />
                    <span className="text-sm font-medium">{exp.period}</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex items-center">
                  <MapPin size={16} className="mr-2" />
                  {getTranslatedContent(exp.id, 'location', exp.location)}
                </p>
                <ul className="space-y-3">
                  {(getTranslatedContent(exp.id, 'description', exp.description) as string[]).map((item, i) => (
                    <li key={i} className="text-gray-600 dark:text-gray-300 flex items-start">
                      <span className="mr-3 mt-1.5 text-blue-500">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Experience;