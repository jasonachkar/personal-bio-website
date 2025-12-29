'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminGuard from '@/components/admin/AdminGuard';
import Card from '@/components/ui/Card';
import { LogOut, Save, Home, AlertCircle, CheckCircle } from 'lucide-react';

type ContentSection =
  | 'hero'
  | 'about'
  | 'certifications'
  | 'education'
  | 'experience'
  | 'projects'
  | 'writeups'
  | 'contact'
  | 'social';

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<ContentSection>('hero');
  const [content, setContent] = useState<any>(null);
  const [originalContent, setOriginalContent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const sections: { id: ContentSection; label: string }[] = [
    { id: 'hero', label: 'Hero' },
    { id: 'about', label: 'About' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'education', label: 'Education' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'writeups', label: 'Writeups' },
    { id: 'contact', label: 'Contact' },
    { id: 'social', label: 'Social Links' },
  ];

  useEffect(() => {
    loadContent(activeSection);
  }, [activeSection]);

  const loadContent = async (section: ContentSection) => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/content/${section}`);
      if (response.ok) {
        const data = await response.json();
        setContent(data);
        setOriginalContent(JSON.parse(JSON.stringify(data)));
      } else {
        setMessage({ type: 'error', text: 'Failed to load content' });
      }
    } catch (error) {
      console.error('Load error:', error);
      setMessage({ type: 'error', text: 'Error loading content' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/content/${activeSection}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Content saved successfully!' });
        setOriginalContent(JSON.parse(JSON.stringify(content)));
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to save content' });
      }
    } catch (error) {
      console.error('Save error:', error);
      setMessage({ type: 'error', text: 'Error saving content' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const hasChanges = JSON.stringify(content) !== JSON.stringify(originalContent);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-background-card">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-text-primary">Admin Panel</h1>
              {hasChanges && (
                <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
                  Unsaved changes
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-background-elevated"
              >
                <Home className="h-4 w-4" />
                View Site
              </a>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-background-elevated"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
            {/* Sidebar */}
            <aside className="space-y-2">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted">
                Content Sections
              </h2>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full rounded-lg px-4 py-2 text-left text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary text-white'
                      : 'text-text-primary hover:bg-background-elevated'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </aside>

            {/* Content Editor */}
            <div className="space-y-6">
              {message && (
                <div
                  className={`flex items-center gap-3 rounded-lg border p-4 ${
                    message.type === 'success'
                      ? 'border-green-500/20 bg-green-500/10 text-green-400'
                      : 'border-red-500/20 bg-red-500/10 text-red-400'
                  }`}
                >
                  {message.type === 'success' ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  <span>{message.text}</span>
                </div>
              )}

              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-text-primary">
                    Edit {sections.find((s) => s.id === activeSection)?.label}
                  </h2>
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges || saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>

                {loading ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="text-text-secondary">Loading content...</p>
                  </div>
                ) : content ? (
                  <div className="space-y-4">
                    <textarea
                      value={JSON.stringify(content, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          setContent(parsed);
                        } catch {
                          // Invalid JSON, keep typing
                        }
                      }}
                      className="h-[600px] w-full rounded-lg border border-border bg-background-card p-4 font-mono text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      spellCheck={false}
                    />
                    <p className="text-xs text-text-muted">
                      Edit the JSON content above. Make sure the JSON is valid before saving.
                    </p>
                  </div>
                ) : (
                  <div className="py-12 text-center text-text-secondary">
                    No content loaded
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
