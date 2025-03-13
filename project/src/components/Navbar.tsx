import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Menu, Transition } from '@headlessui/react';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
  const { t, i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' }
  ];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <nav className={`fixed w-full z-50 ${darkMode ? 'bg-gray-900/90 text-white' : 'bg-white/90 text-gray-900'} backdrop-blur-sm shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">Jason</Link>
          <div className="flex items-center space-x-8">
            <Link to="/about" className="hover:text-blue-500 transition-colors">{t('nav.about')}</Link>
            <Link to="/projects" className="hover:text-blue-500 transition-colors">{t('nav.projects')}</Link>
            <Link to="/experience" className="hover:text-blue-500 transition-colors">{t('nav.experience')}</Link>
            <Link to="/contact" className="hover:text-blue-500 transition-colors">{t('nav.contact')}</Link>
            
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Languages size={20} />
                <span className="text-sm font-medium">{i18n.language === 'en' ? 'English' : 'Français'}</span>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1">
                    {languages.map((lang) => (
                      <Menu.Item key={lang.code}>
                        {({ active }) => (
                          <button
                            onClick={() => changeLanguage(lang.code)}
                            className={`${
                              active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-gray-100'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
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

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;