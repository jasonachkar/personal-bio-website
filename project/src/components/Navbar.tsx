import { Fragment, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Menu, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' }
  ];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: t('nav.about') },
    { path: '/projects', label: t('nav.projects') },
    { path: '/experience', label: t('nav.experience') },
    { path: '/contact', label: t('nav.contact') }
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
        ? 'bg-black/80 backdrop-blur-lg border-b border-green-500/20 shadow-[0_0_15px_rgba(0,255,0,0.1)]'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="relative group">
            <span className="text-2xl font-bold font-mono bg-gradient-to-r from-green-500 to-cyan-500 bg-clip-text text-transparent">
              Jason
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-cyan-500 transition-all group-hover:w-full"></span>
          </Link>

          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative py-2 group font-mono ${location.pathname === item.path
                  ? 'text-green-400'
                  : 'text-green-400/70'
                  }`}
              >
                <span className="relative z-10">{item.label}</span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 transform origin-left transition-transform duration-300 ease-out ${location.pathname === item.path
                  ? 'scale-x-100 bg-green-500'
                  : 'scale-x-0 bg-green-500/50 group-hover:scale-x-100'
                  }`}></span>
              </Link>
            ))}

            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 px-3 py-2 rounded-full bg-black/40 hover:bg-green-500/10 border border-green-500/20 hover:border-green-500/40 transition-colors font-mono">
                <Languages size={18} className="text-green-400" />
                <span className="text-sm font-medium text-green-400">{i18n.language === 'en' ? 'EN' : 'FR'}</span>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 rounded-xl bg-black/90 backdrop-blur-lg border border-green-500/20 shadow-[0_0_30px_rgba(0,255,0,0.1)] focus:outline-none overflow-hidden">
                  <div className="py-1">
                    {languages.map((lang) => (
                      <Menu.Item key={lang.code}>
                        {({ active }) => (
                          <button
                            onClick={() => changeLanguage(lang.code)}
                            className={`${active
                              ? 'bg-green-500/10 text-green-400'
                              : 'text-green-400/70'
                              } flex w-full items-center px-4 py-2 text-sm font-medium transition-colors font-mono`}
                          >
                            {lang.label}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;