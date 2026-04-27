import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bell, Menu, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useProfile } from '../../hooks/useProfile';

const links = [
  { to: '/browse', label: 'Home' },
  { to: '/movies', label: 'Movies' },
  { to: '/tv', label: 'TV Shows' },
  { to: '/my-list', label: 'My List' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const signOut = useAuthStore((s) => s.signOut);
  const { data: profile } = useProfile();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQ.trim())}`);
      setSearchOpen(false);
      setSearchQ('');
    }
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 flex items-center gap-4 md:gap-8">
        <Link to="/browse" className="flex items-center gap-2 shrink-0">
          <span className="font-display text-2xl md:text-3xl tracking-wider text-primary">
            STREAM<span className="text-white">VAULT</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `transition-colors hover:text-white ${
                  isActive ? 'text-white font-medium' : 'text-white/70'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2 md:gap-4">
          <AnimatePresence>
            {searchOpen ? (
              <motion.form
                onSubmit={submitSearch}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="overflow-hidden flex items-center bg-black/70 border border-white/20 rounded"
              >
                <input
                  autoFocus
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Search titles…"
                  className="bg-transparent px-3 py-1.5 w-full text-sm focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="px-2 text-muted hover:text-white"
                >
                  <X size={16} />
                </button>
              </motion.form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="p-2 hover:text-primary transition"
              >
                <Search size={20} />
              </button>
            )}
          </AnimatePresence>

          <button
            aria-label="Notifications"
            className="hidden sm:block p-2 hover:text-primary transition"
          >
            <Bell size={20} />
          </button>

          <div className="relative">
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="w-8 h-8 rounded overflow-hidden bg-primary/30 flex items-center justify-center text-xs font-bold"
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                (profile?.username?.[0] || 'V').toUpperCase()
              )}
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 mt-2 w-48 bg-card border border-white/10 rounded-md shadow-xl py-2 text-sm"
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <Link to="/profile" className="block px-4 py-2 hover:bg-white/5">
                    Profile
                  </Link>
                  <Link to="/my-list" className="block px-4 py-2 hover:bg-white/5">
                    My List
                  </Link>
                  <div className="border-t border-white/10 my-1" />
                  <button
                    onClick={async () => {
                      await signOut();
                      navigate('/');
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-white/5 text-primary"
                  >
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            className="md:hidden p-2"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-background border-t border-white/10 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-3 text-sm">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive ? 'text-white font-medium' : 'text-white/70'
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
