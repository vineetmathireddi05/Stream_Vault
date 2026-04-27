import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import MovieCard from '../components/cards/MovieCard';
import { CardSkeleton } from '../components/ui/Skeleton';
import { useDebounce } from '../hooks/useDebounce';
import { useSearch } from '../hooks/useMovies';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'movie', label: 'Movies' },
  { id: 'tv', label: 'TV Shows' },
];

export default function Search() {
  const [params, setParams] = useSearchParams();
  const initialQ = params.get('q') || '';
  const [q, setQ] = useState(initialQ);
  const [filter, setFilter] = useState('all');
  const debouncedQ = useDebounce(q, 300);
  const { data, isLoading, isFetching } = useSearch(debouncedQ);

  useEffect(() => {
    if (debouncedQ) setParams({ q: debouncedQ }, { replace: true });
  }, [debouncedQ, setParams]);

  const results = (data?.results || []).filter((r) => {
    if (filter === 'all') return r.media_type === 'movie' || r.media_type === 'tv';
    return r.media_type === filter;
  });

  return (
    <div className="px-6 md:px-12 pt-10 pb-16 animate-fade-in">
      <h1 className="font-display text-4xl md:text-5xl tracking-wider mb-6">Search</h1>

      <div className="relative max-w-2xl">
        <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search for movies, shows, actors…"
          className="input pl-12 text-lg"
        />
      </div>

      <div className="flex gap-2 mt-4">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-1.5 rounded-full text-sm transition ${
              filter === f.id
                ? 'bg-primary text-white'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {!debouncedQ ? (
          <p className="text-muted">Type to search the catalog.</p>
        ) : isLoading || isFetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-40">
            {Array.from({ length: 12 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : results.length === 0 ? (
          <p className="text-muted">No results for "{debouncedQ}".</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-40">
            {results.map((r) => (
              <MovieCard key={`${r.id}-${r.media_type}`} item={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
