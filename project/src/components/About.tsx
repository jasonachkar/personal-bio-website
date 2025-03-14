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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative w-16 h-16"
        >
          <div className="absolute inset-0 rounded-full bg-blue-500/30" />
          <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 bg-[#0a0a0a] bg-opacity-95 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
          className="bg-black/40 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(0,255,0,0.1)] border border-green-500/20 hover:border-green-500/40 p-8 mb-12"
        >
          <h2 className="text-3xl font-bold font-mono bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">Professional Summary</h2>
          <p className="text-green-400/80 leading-relaxed font-mono">
            Highly motivated technology professional with a strong academic foundation in Computer Science from Concordia University and practical experience from internships at Genetec and Matrox. I have honed my skills in software development, systems design, and emerging technologies like AI and machine learning, applying them in projects using C#, Java, C++, Flutter, and ReactJS. This blend of academic rigor and hands-on work enables me to drive digital innovation in collaborative environments.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.6, -0.05, 0.01, 0.99] }}
          className="bg-black/40 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(0,255,0,0.1)] border border-green-500/20 hover:border-green-500/40 p-8"
        >
          <h2 className="text-3xl font-bold font-mono bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-8">Technical Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <div key={skill.id} className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-xl border border-green-500/20 hover:border-green-500/40 shadow-[0_0_15px_rgba(0,255,0,0.1)] hover:shadow-[0_0_30px_rgba(0,255,0,0.2)] transition-all duration-300"
                />
                <div className="relative z-10 p-6">
                  <div className="text-green-500 mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {getIcon(skill.name)}
                  </div>
                  <h3 className="font-semibold text-green-400 mb-2 text-lg font-mono">{skill.name}</h3>
                  <p className="text-sm text-green-400/70 leading-relaxed font-mono">{skill.details}</p>
                </div>
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

export default About;