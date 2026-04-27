import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play, Sparkles, Tv, Smartphone } from 'lucide-react';

const features = [
  {
    icon: Tv,
    title: 'Watch on any device',
    body: 'Stream on your phone, tablet, laptop, or TV with seamless cross-device syncing.',
  },
  {
    icon: Sparkles,
    title: 'Hand-picked recommendations',
    body: 'Our recommendation engine learns what you love and surfaces titles you actually want to watch.',
  },
  {
    icon: Smartphone,
    title: 'Download and go',
    body: 'Save your favorites offline so the road trip never needs a Wi-Fi signal.',
  },
];

const faqs = [
  {
    q: 'What is StreamVault?',
    a: 'StreamVault is a portfolio-grade Netflix clone that demonstrates a full-stack streaming UI built with React, Express, Supabase, and the TMDB API.',
  },
  {
    q: 'How much does it cost?',
    a: 'It is a demo project — there are no real charges. Plans (Free / Standard / Premium) are stored on user profiles to showcase tiered subscription UX.',
  },
  {
    q: 'Where does the content come from?',
    a: 'All metadata, posters, backdrops, and trailers are fetched live from TMDB. Trailers play via embedded YouTube.',
  },
  {
    q: 'Can I save things to watch later?',
    a: 'Yes. Sign up to use My List, save your watch progress, and rate titles 1–5 stars.',
  },
];

export default function Landing() {
  const [email, setEmail] = useState('');
  const [openFaq, setOpenFaq] = useState(0);
  const navigate = useNavigate();

  const submitEmail = (e) => {
    e.preventDefault();
    navigate('/signup', { state: { email } });
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <header className="absolute top-0 left-0 right-0 z-30 px-6 md:px-12 py-5 flex items-center justify-between">
        <span className="font-display text-3xl md:text-4xl tracking-wider text-primary">
          STREAM<span className="text-white">VAULT</span>
        </span>
        <Link to="/login" className="btn-primary px-5 py-2 text-sm">
          Sign in
        </Link>
      </header>

      <section className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=1920&q=80"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-watching-tv-late-at-night-2949/1080p.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wide max-w-4xl text-balance leading-none"
          >
            Unlimited movies, TV shows, and more
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg md:text-2xl mt-6 max-w-xl"
          >
            Watch anywhere. Cancel anytime.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-base md:text-lg mt-4 text-white/80"
          >
            Ready to watch? Enter your email to create or restart your membership.
          </motion.p>

          <motion.form
            onSubmit={submitEmail}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-2xl"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="flex-1 input"
            />
            <button type="submit" className="btn-primary text-lg px-8 py-3 whitespace-nowrap">
              Get Started <Play size={18} className="fill-current" />
            </button>
          </motion.form>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl text-center tracking-wider mb-12">
          Everything you'd expect — and a little more
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-8 border border-white/5 hover:border-primary/40 transition"
            >
              <f.icon size={36} className="text-primary mb-4" />
              <h3 className="font-display text-2xl tracking-wider mb-2">{f.title}</h3>
              <p className="text-white/70">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto bg-surface rounded-2xl my-10 mx-4 md:mx-12">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display text-4xl md:text-5xl tracking-wider mb-4">
              Made for binge nights
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Save titles to your list, pick up where you left off across devices, and lose
              yourself in trailers we autoplay the moment you hover. The kind of details
              that turn "what should we watch?" into "we're watching."
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=900&q=80"
            alt=""
            className="rounded-xl object-cover w-full h-80"
          />
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 max-w-3xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl text-center tracking-wider mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={faq.q} className="bg-card rounded-md overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition"
                >
                  <span className="text-lg font-medium">{faq.q}</span>
                  <ChevronDown
                    size={22}
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-white/80 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <form onSubmit={submitEmail} className="mt-10 flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="flex-1 input"
          />
          <button type="submit" className="btn-primary text-lg px-8 py-3 whitespace-nowrap">
            Get Started
          </button>
        </form>
      </section>

      <footer className="border-t border-white/10 py-10 px-6 md:px-12 text-center text-muted text-sm">
        <p>© {new Date().getFullYear()} StreamVault. Demo project. Powered by TMDB.</p>
      </footer>
    </div>
  );
}
