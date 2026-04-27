export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 text-sm text-muted">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {[
            ['Company', ['About', 'Careers', 'Press', 'Blog']],
            ['Support', ['Help Center', 'Contact', 'Accessibility', 'Status']],
            ['Legal', ['Terms', 'Privacy', 'Cookies', 'Licenses']],
            ['Connect', ['Twitter', 'Instagram', 'YouTube', 'Discord']],
          ].map(([title, items]) => (
            <div key={title}>
              <h4 className="text-white/90 font-medium mb-3">{title}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-6 border-t border-white/10">
          <span>© {new Date().getFullYear()} StreamVault — Demo project. Movie data from TMDB.</span>
          <span>Built with React, Vite, Tailwind, Supabase.</span>
        </div>
      </div>
    </footer>
  );
}
