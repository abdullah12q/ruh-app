export default function Footer() {
  return (
    <footer className="border-t border-(--surface-glass-border) py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-secondary">
        <div className="flex items-center gap-2">
          <span className="font-bold font-jakarta text-text-primary">
            Rُuh
          </span>
          <span className="font-arabic-ui text-accent">رُوح</span>
          <span className="opacity-40 mx-1">·</span>
          <span>Feed your soul, distraction-free.</span>
        </div>
        <p className="font-inter opacity-60">
          © {new Date().getFullYear()} Rُuh Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
