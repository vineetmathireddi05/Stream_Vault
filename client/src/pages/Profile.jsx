import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Save } from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import { useProfile, useUpdateProfile } from '../hooks/useProfile';
import { useHistory } from '../hooks/useWatchlist';
import { useAuthStore } from '../store/authStore';
import { posterUrl, AVATAR_PRESETS, PLAN_LABELS } from '../utils/constants';

export default function Profile() {
  const { data: profile, isLoading } = useProfile();
  const update = useUpdateProfile();
  const history = useHistory();
  const navigate = useNavigate();
  const signOut = useAuthStore((s) => s.signOut);

  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setAvatar(profile.avatar_url || AVATAR_PRESETS[0]);
    }
  }, [profile]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size={32} />
      </div>
    );
  }

  const onSave = async () => {
    setSaved(false);
    await update.mutateAsync({ username, avatar_url: avatar });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="px-6 md:px-12 pt-10 pb-16 animate-fade-in max-w-5xl mx-auto">
      <h1 className="font-display text-5xl md:text-6xl tracking-wider mb-8">Profile</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <section className="md:col-span-1 bg-surface rounded-xl p-6">
          <div className="flex flex-col items-center">
            <img
              src={avatar}
              alt="avatar"
              className="w-28 h-28 rounded-full bg-card object-cover"
              onError={(e) => (e.currentTarget.src = AVATAR_PRESETS[0])}
            />
            <Badge className="mt-4">{PLAN_LABELS[profile?.plan || 'free']} plan</Badge>
          </div>

          <p className="text-muted text-xs uppercase tracking-wider mt-6 mb-2">Choose avatar</p>
          <div className="grid grid-cols-4 gap-2">
            {AVATAR_PRESETS.map((url) => (
              <button
                key={url}
                onClick={() => setAvatar(url)}
                className={`rounded-lg overflow-hidden border-2 transition ${
                  avatar === url ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img src={url} alt="avatar option" className="w-full aspect-square object-cover" />
              </button>
            ))}
          </div>
        </section>

        <section className="md:col-span-2 bg-surface rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-muted mb-2">Display name</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              placeholder="What should we call you?"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-2">Plan</label>
            <div className="flex gap-2">
              {['free', 'standard', 'premium'].map((p) => (
                <button
                  key={p}
                  onClick={() => update.mutate({ plan: p })}
                  className={`flex-1 px-4 py-3 rounded-md text-sm transition ${
                    profile?.plan === p
                      ? 'bg-primary text-white'
                      : 'bg-card hover:bg-white/10 text-white/80'
                  }`}
                >
                  {PLAN_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button onClick={onSave} disabled={update.isPending} className="btn-primary">
              {update.isPending ? <Spinner size={16} /> : <Save size={16} />} Save Changes
            </button>
            {saved && <span className="text-sm text-emerald-400">Saved!</span>}
            <div className="flex-1" />
            <button
              onClick={async () => {
                await signOut();
                navigate('/');
              }}
              className="btn-ghost text-primary"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-3xl tracking-wider mb-4">Watch history</h2>
        {history.isLoading ? (
          <Spinner />
        ) : !history.data?.length ? (
          <p className="text-muted">No watch history yet — start exploring titles to fill it up.</p>
        ) : (
          <div className="space-y-3">
            {history.data.map((h) => {
              const pct = h.duration_seconds
                ? Math.min(100, Math.round((h.progress_seconds / h.duration_seconds) * 100))
                : 0;
              return (
                <div
                  key={h.id}
                  className="flex items-center gap-4 bg-card rounded-lg p-3 hover:bg-white/5 transition"
                >
                  <img
                    src={posterUrl(h.poster_path, 'w185')}
                    alt={h.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{h.title}</h3>
                    <p className="text-xs text-muted uppercase tracking-wider">{h.media_type}</p>
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-muted mt-1">
                      {pct}% watched · {new Date(h.watched_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
