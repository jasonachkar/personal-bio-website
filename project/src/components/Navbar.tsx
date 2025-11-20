import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Menu, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

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
      className="w-full z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="relative group">
            <span className="text-2xl font-bold font-mono text-primary" style={{ textShadow: '0 0 5px hsl(var(--primary))' }}>
              Jason
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>

          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative py-2 group font-mono ${location.pathname === item.path
                  ? 'text-primary'
                  : 'text-text/70 hover:text-primary'
                  }`}
                style={{ textShadow: location.pathname === item.path ? '0 0 5px hsl(var(--primary))' : 'none' }}
              >
                <span className="relative z-10">{item.label}</span>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 transform origin-left transition-transform duration-300 ease-out ${location.pathname === item.path
                  ? 'scale-x-100 bg-primary'
                  : 'scale-x-0 bg-primary/50 group-hover:scale-x-100'
                  }`}></span>
              </Link>
            ))}

            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 px-3 py-2 rounded-md bg-background/50 hover:bg-primary/10 border border-primary/20 hover:border-primary/40 transition-colors font-mono">
                <Languages size={18} className="text-primary" />
                <span className="text-sm font-medium text-primary">{i18n.language === 'en' ? 'EN' : 'FR'}</span>
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
                <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md bg-background/90 backdrop-blur-lg border border-primary/20 shadow-[0_0_30px_rgba(0,255,0,0.1)] focus:outline-none overflow-hidden">
                  <div className="py-1">
                    {languages.map((lang) => (
                      <Menu.Item key={lang.code}>
                        {({ active }) => (
                          <button
                            onClick={() => changeLanguage(lang.code)}
                            className={`${active
                              ? 'bg-primary/10 text-primary'
                              : 'text-text/70'
                              } flex w-full items-center px-4 py-2 text-sm font-medium transition-colors font-mono hover:text-primary`}
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