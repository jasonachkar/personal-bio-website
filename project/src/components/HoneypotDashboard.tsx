import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Link2, CheckCircle, XCircle, HelpCircle, Smartphone, QrCode, User, Globe, Share2, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PhishingQuestion {
  id: number;
  type: 'email' | 'url' | 'sms' | 'login' | 'qr';
  prompt: string;
  scenario: Record<string, string>; // e.g. { sender, subject, body, url, ... }
  isPhishing: boolean;
  highlight?: string; // part to highlight
  explanation: string;
}

const questions: PhishingQuestion[] = [
  {
    id: 1,
    type: 'email',
    prompt: 'Is this email safe or a phishing attempt?',
    scenario: {
      sender: 'support@paypa1.com',
      subject: 'Urgent: Account Locked!',
      body: 'Dear user, your account has been locked. Click the link below to restore access.',
      button: 'Restore Access',
    },
    isPhishing: true,
    highlight: 'paypa1.com',
    explanation: 'Lookalike domains (paypa1.com) and urgent language are classic phishing tactics.',
  },
  {
    id: 2,
    type: 'email',
    prompt: 'Is this email safe or a phishing attempt?',
    scenario: {
      sender: 'support@paypal.com',
      subject: 'Your monthly statement is ready.',
      body: 'Hi, your monthly statement is attached. Thank you for using PayPal.',
      button: 'View Statement',
    },
    isPhishing: false,
    explanation: 'This is a typical, safe notification from PayPal.',
  },
  {
    id: 3,
    type: 'url',
    prompt: 'Is this login page safe or a phishing attempt?',
    scenario: {
      url: 'https://secure-paypal.com/login',
      form: 'PayPal Login',
    },
    isPhishing: true,
    highlight: 'secure-paypal.com',
    explanation: 'Always check the real domain. "secure-paypal.com" is not the official PayPal site.',
  },
  {
    id: 4,
    type: 'url',
    prompt: 'Is this login page safe or a phishing attempt?',
    scenario: {
      url: 'https://www.paypal.com/signin',
      form: 'PayPal Login',
    },
    isPhishing: false,
    explanation: 'This is the real PayPal login page.',
  },
  {
    id: 5,
    type: 'sms',
    prompt: 'Is this SMS safe or a phishing attempt?',
    scenario: {
      from: '+1 555-123-4567',
      message: 'Your bank account is locked. Visit http://bank-login-alert.com to unlock.',
    },
    isPhishing: true,
    highlight: 'bank-login-alert.com',
    explanation: 'Phishing SMS often use fake links and urgent language.',
  },
  {
    id: 6,
    type: 'sms',
    prompt: 'Is this SMS safe or a phishing attempt?',
    scenario: {
      from: 'YourBank',
      message: 'Your balance is $1,234.56. Thank you for banking with us.',
    },
    isPhishing: false,
    explanation: 'This is a typical, safe bank notification.',
  },
  {
    id: 7,
    type: 'login',
    prompt: 'Is this login page safe or a phishing attempt?',
    scenario: {
      url: 'https://accounts.g00gle.com',
      form: 'Google Account Login',
    },
    isPhishing: true,
    highlight: 'g00gle.com',
    explanation: 'Phishing sites often use lookalike domains (g00gle.com instead of google.com).',
  },
  {
    id: 8,
    type: 'login',
    prompt: 'Is this login page safe or a phishing attempt?',
    scenario: {
      url: 'https://accounts.google.com',
      form: 'Google Account Login',
    },
    isPhishing: false,
    explanation: 'This is the real Google login page.',
  },
  {
    id: 9,
    type: 'qr',
    prompt: 'Is this QR code safe or a phishing attempt?',
    scenario: {
      qr: 'https://secure-paypal.com',
      label: 'Scan to pay',
    },
    isPhishing: true,
    highlight: 'secure-paypal.com',
    explanation: 'QR codes can hide malicious links. Always verify the destination.',
  },
  {
    id: 10,
    type: 'qr',
    prompt: 'Is this QR code safe or a phishing attempt?',
    scenario: {
      qr: 'https://www.paypal.com',
      label: 'Scan to pay',
    },
    isPhishing: false,
    explanation: 'This QR code leads to the real PayPal site.',
  },
];

function shuffle<T>(arr: T[]): T[] {
  return arr
    .map((a) => [Math.random(), a] as const)
    .sort(([a], [b]) => a - b)
    .map(([, a]) => a);
}

const PhishingSimulator: React.FC = () => {
  const { t } = useTranslation();
  const [order, setOrder] = useState(() => shuffle([...Array(questions.length).keys()]));
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showFinal, setShowFinal] = useState(false);

  const current = questions[order[step]];

  const handleSelect = (isPhishing: boolean) => {
    setSelected(isPhishing);
    setShowResult(true);
    if (isPhishing === current.isPhishing) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setShowResult(false);
    if (step + 1 < questions.length) {
      setStep((s) => s + 1);
    } else {
      setShowFinal(true);
    }
  };

  const handleRestart = () => {
    setOrder(shuffle([...Array(questions.length).keys()]));
    setStep(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setStreak(0);
    setShowFinal(false);
  };

  // Visual feedback animations
  const feedbackAnim = showResult
    ? selected === current.isPhishing
      ? { scale: [1, 1.1, 1], backgroundColor: '#16a34a22' }
      : { x: [0, -10, 10, -10, 10, 0], backgroundColor: '#ef444422' }
    : {};

  // Render scenario UI
  function renderScenario() {
    switch (current.type) {
      case 'email':
        return (
          <motion.div className="bg-white/5 rounded-lg border border-green-500/10 p-4 shadow relative overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center mb-2">
              <Mail className="w-5 h-5 text-cyan-400 mr-2" />
              <span className="font-mono text-green-400">{current.scenario.sender}</span>
            </div>
            <div className="font-mono text-green-400/80 mb-1">
              <span className="font-bold">Subject:</span> {current.scenario.subject}
            </div>
            <div className="font-mono text-green-100 mb-3 whitespace-pre-line">{current.scenario.body}</div>
            <motion.button
              className="px-4 py-2 rounded bg-cyan-500/80 hover:bg-cyan-400 text-black font-mono text-sm transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              {current.scenario.button}
            </motion.button>
            {current.highlight && (
              <span className="absolute top-2 right-2 text-xs bg-red-500/80 text-white px-2 py-1 rounded font-mono animate-pulse">
                {current.highlight}
              </span>
            )}
          </motion.div>
        );
      case 'url':
      case 'login':
        return (
          <motion.div className="bg-white/5 rounded-lg border border-green-500/10 p-4 shadow relative overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center mb-2">
              <Globe className="w-5 h-5 text-cyan-400 mr-2" />
              <span className="font-mono text-green-400">{current.scenario.url}</span>
            </div>
            <div className="font-mono text-green-100 mb-3">{current.scenario.form || 'Login Form'}</div>
            <input className="w-full mb-2 px-3 py-2 rounded border border-green-500/20 bg-black/30 text-green-400 font-mono" placeholder="Email" disabled />
            <input className="w-full mb-4 px-3 py-2 rounded border border-green-500/20 bg-black/30 text-green-400 font-mono" placeholder="Password" type="password" disabled />
            <motion.button
              className="px-4 py-2 rounded bg-cyan-500/80 hover:bg-cyan-400 text-black font-mono text-sm transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Log In
            </motion.button>
            {current.highlight && (
              <span className="absolute top-2 right-2 text-xs bg-red-500/80 text-white px-2 py-1 rounded font-mono animate-pulse">
                {current.highlight}
              </span>
            )}
          </motion.div>
        );
      case 'sms':
        return (
          <motion.div className="bg-white/5 rounded-lg border border-green-500/10 p-4 shadow relative overflow-hidden" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center mb-2">
              <Smartphone className="w-5 h-5 text-cyan-400 mr-2" />
              <span className="font-mono text-green-400">{current.scenario.from}</span>
            </div>
            <div className="font-mono text-green-100 mb-3">{current.scenario.message}</div>
            {current.highlight && (
              <span className="absolute top-2 right-2 text-xs bg-red-500/80 text-white px-2 py-1 rounded font-mono animate-pulse">
                {current.highlight}
              </span>
            )}
          </motion.div>
        );
      case 'qr':
        return (
          <motion.div className="bg-white/5 rounded-lg border border-green-500/10 p-4 shadow relative overflow-hidden flex flex-col items-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <QrCode className="w-16 h-16 text-cyan-400 mb-2" />
            <span className="font-mono text-green-400 mb-2">{current.scenario.label}</span>
            <span className="font-mono text-green-100 mb-2">{current.scenario.qr}</span>
            {current.highlight && (
              <span className="absolute top-2 right-2 text-xs bg-red-500/80 text-white px-2 py-1 rounded font-mono animate-pulse">
                {current.highlight}
              </span>
            )}
          </motion.div>
        );
      default:
        return null;
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(0,255,0,0.1)] border border-green-500/20 hover:border-green-500/40 overflow-hidden max-w-xl mx-auto"
      role="region"
      aria-label="Phishing Simulator"
    >
      <div className="bg-black/60 p-4 flex items-center space-x-2 border-b border-green-500/20">
        <ShieldIcon type={current.type} />
        <h3 className="text-lg font-mono bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
          {t('Phishing Simulator')}
        </h3>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-green-400/80 font-mono text-sm">Score: {score}</span>
          <span className="text-cyan-400/80 font-mono text-sm">Streak: {streak}</span>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <h4 className="text-base font-mono text-green-400/80 mb-2">{t(current.prompt)}</h4>
        <div className="mb-6">{renderScenario()}</div>
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            disabled={showResult}
            onClick={() => handleSelect(true)}
            className={`flex-1 px-4 py-3 rounded-lg font-mono text-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/60
              ${showResult && current.isPhishing ? 'border-green-500/60 bg-green-500/10' : 'border-green-500/20 bg-black/30 hover:bg-green-500/5'}
            `}
            aria-pressed={selected === true}
          >
            <HelpCircle className="w-5 h-5 text-orange-400 inline mr-2" /> Phishing
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            disabled={showResult}
            onClick={() => handleSelect(false)}
            className={`flex-1 px-4 py-3 rounded-lg font-mono text-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400/60
              ${showResult && !current.isPhishing ? 'border-green-500/60 bg-green-500/10' : 'border-green-500/20 bg-black/30 hover:bg-green-500/5'}
            `}
            aria-pressed={selected === false}
          >
            <CheckCircle className="w-5 h-5 text-green-400 inline mr-2" /> Safe
          </motion.button>
        </div>
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, ...feedbackAnim }}
              exit={{ opacity: 0, y: 10 }}
              className={`mt-4 p-4 rounded-lg border font-mono text-lg flex items-center gap-3
                ${selected === current.isPhishing ? 'bg-green-500/10 border-green-500/40 text-green-400' : 'bg-red-500/10 border-red-500/40 text-red-400'}
              `}
              role="status"
            >
              {selected === current.isPhishing ? (
                <Trophy className="w-6 h-6 text-green-400 animate-bounce" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400 animate-shake" />
              )}
              <span>
                {selected === current.isPhishing
                  ? t('Correct!') + ' ' + current.explanation
                  : t('Oops!') + ' ' + current.explanation}
              </span>
              <motion.button
                onClick={handleNext}
                className="ml-auto px-4 py-2 rounded bg-cyan-500/80 hover:bg-cyan-400 text-black font-mono text-sm transition-colors"
                autoFocus
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                {step + 1 < questions.length ? t('Next') : t('Finish')}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showFinal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-8 p-6 rounded-xl bg-black/80 border border-green-500/30 text-center flex flex-col items-center"
            >
              <Trophy className="w-12 h-12 text-yellow-400 mb-2 animate-bounce" />
              <h4 className="text-2xl font-mono text-green-400 mb-2">{t('Your Score')}</h4>
              <div className="text-4xl font-mono text-cyan-400 mb-4">{score} / {questions.length}</div>
              <div className="text-green-400/80 font-mono mb-4">{score === questions.length ? t('Perfect! You are a cyber sleuth!') : t('Try again to improve your score!')}</div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleRestart}
                className="px-6 py-3 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 font-mono text-lg border border-green-500/40 mb-4"
              >
                {t('Play Again')}
              </motion.button>
              <ShareButton score={score} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

function ShieldIcon({ type }: { type: string }) {
  switch (type) {
    case 'email':
      return <Mail className="w-5 h-5 text-cyan-400" />;
    case 'url':
    case 'login':
      return <Globe className="w-5 h-5 text-cyan-400" />;
    case 'sms':
      return <Smartphone className="w-5 h-5 text-cyan-400" />;
    case 'qr':
      return <QrCode className="w-5 h-5 text-cyan-400" />;
    default:
      return <ShieldIcon type="email" />;
  }
}

const ShareButton: React.FC<{ score: number }> = ({ score }) => {
  const [copied, setCopied] = useState(false);
  const shareText = `I scored ${score} on the Phishing Simulator! Can you beat me?`;
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 rounded bg-cyan-500/80 hover:bg-cyan-400 text-black font-mono text-sm transition-colors"
    >
      <Share2 className="w-4 h-4" />
      {copied ? 'Copied!' : 'Share your score'}
    </motion.button>
  );
};

export default PhishingSimulator; 