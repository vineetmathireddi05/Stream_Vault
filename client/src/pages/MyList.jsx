import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import MovieCard from '../components/cards/MovieCard';
import { CardSkeleton } from '../components/ui/Skeleton';
import { useWatchlist } from '../hooks/useWatchlist';

export default function MyList() {
  const { data, isLoading } = useWatchlist();

  return (
    <div className="px-6 md:px-12 pt-10 pb-16 animate-fade-in">
      <h1 className="font-display text-5xl md:text-6xl tracking-wider">My List</h1>
      <p className="text-muted mt-2 max-w-2xl">Everything you've saved to watch later.</p>

      <div className="mt-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-40">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : !data?.length ? (
          <div className="flex flex-col items-center text-center py-20">
            <Bookmark size={56} className="text-primary mb-4" />
            <h2 className="font-display text-3xl tracking-wider mb-2">Your list is empty</h2>
            <p className="text-muted max-w-sm mb-6">
              Save movies and shows from anywhere on StreamVault to find them here.
            </p>
            <Link to="/browse" className="btn-primary">
              Browse Titles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-40">
            {data.map((w) => (
              <MovieCard
                key={`${w.tmdb_id}-${w.media_type}`}
                item={{
                  id: w.tmdb_id,
                  media_type: w.media_type,
                  title: w.title,
                  poster_path: w.poster_path,
                  vote_average: 0,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
