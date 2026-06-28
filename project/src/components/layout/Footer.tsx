export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background-card py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-text-muted">
          {currentYear} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
