import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Database, File as Mobile, Cloud, Lock, Github as Git, Terminal, Brain } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Skill {
  id: string;
  category: string;
  name: string;
  details: string;
  order_num: number;
}

const About = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('order_num');

      if (error) {
        console.error('Error fetching skills:', error);
        return;
      }

      setSkills(data);
      setLoading(false);
    };

    fetchSkills();
  }, []);

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'programming':
        return <Code size={24} />;
      case 'mobile development':
        return <Mobile size={24} />;
      case 'ai & machine learning':
        return <Brain size={24} />;
      case 'cloud computing':
        return <Cloud size={24} />;
      case 'database':
        return <Database size={24} />;
      case 'full-stack':
        return <Terminal size={24} />;
      case 'version control':
        return <Git size={24} />;
      case 'cybersecurity':
        return <Lock size={24} />;
      default:
        return <Code size={24} />;
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
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Professional Summary</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Highly motivated technology professional with a strong academic foundation in Computer Science from Concordia University and practical experience from internships at Genetec and Matrox. I have honed my skills in software development, systems design, and emerging technologies like AI and machine learning, applying them in projects using C#, Java, C++, Flutter, and ReactJS. This blend of academic rigor and hands-on work enables me to drive digital innovation in collaborative environments.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Technical Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
              >
                <div className="text-blue-600 dark:text-blue-400 mb-2">
                  {getIcon(skill.name)}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{skill.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{skill.details}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;