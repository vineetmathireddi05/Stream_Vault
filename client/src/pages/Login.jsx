import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import Spinner from '../components/ui/Spinner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const signIn = useAuthStore((s) => s.signIn);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await signIn(email, password);
      navigate(location.state?.from?.pathname || '/browse', { replace: true });
    } catch (err) {
      setError(err.message || 'Could not sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell>
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={onSubmit}
        className="bg-black/75 rounded-md p-8 md:p-10 w-full max-w-md backdrop-blur-sm"
      >
        <h1 className="font-display text-3xl md:text-4xl tracking-wider mb-6">Sign In</h1>

        <div className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input"
          />
        </div>

        {error && <p className="mt-3 text-sm text-primary">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full mt-6 py-3 text-lg">
          {submitting ? <Spinner size={18} /> : 'Sign In'}
        </button>

        <p className="text-muted text-sm mt-8">
          New to StreamVault?{' '}
          <Link to="/signup" className="text-white hover:underline">
            Create an account
          </Link>
        </p>
      </motion.form>
    </AuthShell>
  );
}

export function AuthShell({ children }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=1920&q=80"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-background" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="px-6 md:px-12 py-6">
          <Link to="/" className="font-display text-3xl text-primary tracking-wider">
            STREAM<span className="text-white">VAULT</span>
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 pb-12">{children}</div>
      </div>
    </div>
  );
}
