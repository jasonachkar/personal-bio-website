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
    <div className="min-h-screen pt-20 pb-16 px-4 bg-[#0a0a0a] bg-opacity-95 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Education Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
          className="mb-16"
        >
          <div className="flex items-center mb-8">
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 mr-4">
              <GraduationCap className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold font-mono bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">{t('Education')}</h2>
          </div>
          
          {education && educationDetails && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
              className="bg-black/40 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(0,255,0,0.1)] border border-green-500/20 hover:border-green-500/40 p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,0,0.2)]"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-green-400 mb-2 font-mono">
                    {getTranslatedContent(education.id, 'degree', education.degree)}
                  </h3>
                  <p className="text-cyan-400 font-medium text-lg font-mono">
                    {getTranslatedContent(education.id, 'institution', education.institution)}
                  </p>
                  {education.gpa && (
                    <p className="text-green-400/70 mt-2 flex items-center font-mono">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {t('GPA')}: {education.gpa}
                    </p>
                  )}
                </div>
                <div className="flex items-center text-green-400/70 mt-4 md:mt-0 bg-green-500/5 px-4 py-2 rounded-full border border-green-500/20 font-mono">
                  <Calendar size={18} className="mr-2" />
                  <span className="text-sm font-medium">
                    {getTranslatedContent(educationDetails.id, 'period', educationDetails.period)}
                  </span>
                </div>
              </div>
              
              <p className="text-green-400/70 text-sm mb-8 flex items-center font-mono">
                <MapPin size={16} className="mr-2" />
                {getTranslatedContent(education.id, 'location', education.location)}
              </p>
              
              <div className="mb-8">
                <p className="text-green-400/80 leading-relaxed font-mono">
                  {getTranslatedContent(educationDetails.id, 'description', educationDetails.description)}
                </p>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-green-400 mb-6 flex items-center font-mono">
                  <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 mr-3">
                    <BookOpen className="w-6 h-6 text-green-400" />
                  </div>
                  {t('Key Courses')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {educationDetails.courses.map((course, index) => (
                    <div key={course.code} className="relative">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="bg-black/40 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(0,255,0,0.1)] border border-green-500/20 hover:border-green-500/40 p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,0,0.2)]"
                      >
                        <h5 className="font-semibold text-green-400 mb-2 text-lg font-mono">
                          {getTranslatedContent(`${educationDetails.id}_course_${index}`, 'topic', course.topic)}
                        </h5>
                        <p className="text-sm text-cyan-400 mb-3 font-medium font-mono">{course.code}</p>
                        <p className="text-sm text-green-400/70 leading-relaxed font-mono">
                          {getTranslatedContent(`${educationDetails.id}_course_${index}`, 'description', course.description)}
                        </p>
                      </motion.div>
                    </div>
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
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 mr-4">
              <Briefcase className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold font-mono bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">{t('experience.title')}</h2>
          </div>
          
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.6, -0.05, 0.01, 0.99] }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-black/40 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(0,255,0,0.1)] border border-green-500/20 hover:border-green-500/40 p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,0,0.2)]"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-green-400 mb-2 font-mono">
                      {getTranslatedContent(exp.id, 'company', exp.company)}
                    </h3>
                    <p className="text-cyan-400 font-medium text-lg font-mono">
                      {getTranslatedContent(exp.id, 'role', exp.role)}
                    </p>
                  </div>
                  <div className="flex items-center text-green-400/70 mt-4 md:mt-0 bg-green-500/5 px-4 py-2 rounded-full border border-green-500/20 font-mono">
                    <Calendar size={18} className="mr-2" />
                    <span className="text-sm font-medium">{exp.period}</span>
                  </div>
                </div>
                <p className="text-green-400/70 text-sm mb-6 flex items-center font-mono">
                  <MapPin size={16} className="mr-2" />
                  {getTranslatedContent(exp.id, 'location', exp.location)}
                </p>
                <ul className="space-y-3">
                  {(getTranslatedContent(exp.id, 'description', exp.description) as string[]).map((item, i) => (
                    <li key={i} className="text-green-400/80 flex items-start font-mono">
                      <span className="mr-3 mt-1.5 text-green-500">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
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

export default Experience;