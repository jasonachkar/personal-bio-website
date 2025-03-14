import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, Check, AlertCircle, MessageSquare, Globe } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useTranslation } from 'react-i18next';

// Initialize EmailJS with your public key
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

console.log('EmailJS Configuration:', {
  publicKey,
  serviceId,
  templateId
});

emailjs.init(publicKey);

const Contact = () => {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      console.log('Attempting to send email with form data');

      const result = await emailjs.sendForm(
        serviceId,
        templateId,
        formRef.current,
        publicKey
      );

      console.log('EmailJS response:', result);

      if (result.text === 'OK') {
        setSubmitStatus('success');
        formRef.current.reset();
      } else {
        throw new Error(`Failed to send email: ${result.text}`);
      }
    } catch (error) {
      console.error('Detailed error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      label: t('contact.info.phone'),
      value: '+1 438-921 2508',
      href: 'tel:+14389212508'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      label: t('contact.info.email'),
      value: 'jasonachkardiab@gmail.com',
      href: 'mailto:jasonachkardiab@gmail.com'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: t('contact.info.location'),
      value: 'Montreal, Quebec',
      href: null
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 bg-[#0a0a0a] bg-opacity-95 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold font-mono bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-6">{t('contact.title')}</h2>
              <p className="text-green-400/80 text-lg leading-relaxed font-mono">
                {t('contact.subtitle')}
              </p>
            </div>

            {contactInfo.map((info, index) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="group flex items-center space-x-4 p-4 rounded-xl bg-black/40 backdrop-blur-sm border border-green-500/20 hover:border-green-500/40 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,0,0.1)] hover:shadow-[0_0_30px_rgba(0,255,0,0.2)]"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 transform group-hover:scale-110 transition-transform duration-300">
                  {info.icon}
                </div>
                <div>
                  <p className="text-sm text-green-400/70 mb-1 font-mono">{info.label}</p>
                  {info.href ? (
                    <a
                      href={info.href}
                      className="text-green-400 hover:text-cyan-400 transition-colors text-lg font-medium font-mono"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-green-400 text-lg font-medium font-mono">{info.value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.6, -0.05, 0.01, 0.99] }}
            className="bg-black/40 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(0,255,0,0.1)] border border-green-500/20 hover:border-green-500/40 p-8 transition-all duration-300"
          >
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="from_name" className="block text-sm font-medium text-green-400/70 mb-2 font-mono">
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  id="from_name"
                  name="from_name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-green-500/20 bg-black/40 text-green-400 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 font-mono placeholder-green-400/30"
                />
              </div>

              <div>
                <label htmlFor="from_email" className="block text-sm font-medium text-green-400/70 mb-2 font-mono">
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  id="from_email"
                  name="from_email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-green-500/20 bg-black/40 text-green-400 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 font-mono placeholder-green-400/30"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-green-400/70 mb-2 font-mono">
                  {t('contact.form.subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-green-500/20 bg-black/40 text-green-400 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 font-mono placeholder-green-400/30"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-green-400/70 mb-2 font-mono">
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-green-500/20 bg-black/40 text-green-400 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 resize-none transition-all duration-300 font-mono placeholder-green-400/30"
                ></textarea>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/40 shadow-[0_0_15px_rgba(0,255,0,0.1)] hover:shadow-[0_0_30px_rgba(0,255,0,0.2)] font-medium transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-mono"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-400 border-t-transparent" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{t('contact.form.send')}</span>
                  </>
                )}
              </motion.button>

              {submitStatus !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center space-x-3 p-4 rounded-xl font-mono ${
                    submitStatus === 'success'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {submitStatus === 'success' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <p className="font-medium">
                    {submitStatus === 'success'
                      ? t('contact.form.success')
                      : t('contact.form.error')}
                  </p>
                </motion.div>
              )}
            </form>
          </motion.div>
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

export default Contact;