import { LuFilm, LuGithub, LuTwitter, LuInstagram } from 'react-icons/lu';

export default function Footer() {
  return (
    <footer className="bg-bg-surface border-t border-border-subtle mt-auto">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <LuFilm className="w-6 h-6 text-accent-red-neon" />
            <span className="text-lg font-bold font-[var(--font-display)] text-gradient">
              CineVerse
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <a href="#" className="hover:text-text-primary transition-colors">About</a>
            <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-text-primary transition-colors">Contact</a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {[LuGithub, LuTwitter, LuInstagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-full bg-bg-card border border-border-subtle flex items-center justify-center text-text-muted hover:text-accent-red-neon hover:border-accent-red/30 transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border-subtle text-center text-xs text-text-muted">
          © {new Date().getFullYear()} CineVerse. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
