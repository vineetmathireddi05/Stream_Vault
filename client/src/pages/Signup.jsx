import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { AuthShell } from './Login';
import Spinner from '../components/ui/Spinner';

export default function Signup() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const navigate = useNavigate();
  const signUp = useAuthStore((s) => s.signUp);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await signUp(email, password, username);
      if (res.session) {
        navigate('/browse', { replace: true });
      } else {
        setInfo('Account created. Check your email to confirm, then sign in.');
      }
    } catch (err) {
      setError(err.message || 'Could not create account.');
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
        <h1 className="font-display text-3xl md:text-4xl tracking-wider mb-2">Create Account</h1>
        <p className="text-muted text-sm mb-6">Free to start. No credit card required.</p>

        <div className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Display name (optional)"
            className="input"
          />
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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6)"
            className="input"
          />
        </div>

        {error && <p className="mt-3 text-sm text-primary">{error}</p>}
        {info && <p className="mt-3 text-sm text-emerald-400">{info}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full mt-6 py-3 text-lg">
          {submitting ? <Spinner size={18} /> : 'Sign Up'}
        </button>

        <p className="text-muted text-sm mt-8">
          Already a member?{' '}
          <Link to="/login" className="text-white hover:underline">
            Sign in
          </Link>
        </p>
      </motion.form>
    </AuthShell>
  );
}
