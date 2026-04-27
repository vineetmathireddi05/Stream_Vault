import ContentRow from '../components/sliders/ContentRow';
import MovieCard from '../components/cards/MovieCard';
import { CardSkeleton } from '../components/ui/Skeleton';
import { usePopularMovies, useTopRatedMovies, useTrending } from '../hooks/useMovies';

export default function Movies() {
  const trending = useTrending();
  const popular = usePopularMovies();
  const topRated = useTopRatedMovies();

  const trendingMovies = (trending.data?.results || []).filter((r) => r.media_type === 'movie');

  return (
    <div className="animate-fade-in">
      <div className="px-6 md:px-12 pt-10 pb-4">
        <h1 className="font-display text-5xl md:text-6xl tracking-wider">Movies</h1>
        <p className="text-muted mt-2 max-w-2xl">
          Award winners, fan favorites, and what everyone's talking about right now.
        </p>
      </div>

      <ContentRow
        title="Trending Movies"
        items={trendingMovies.map((r) => ({ ...r, media_type: 'movie' }))}
        isLoading={trending.isLoading}
      />
      <ContentRow
        title="Popular"
        items={popular.data?.results?.map((m) => ({ ...m, media_type: 'movie' }))}
        isLoading={popular.isLoading}
      />

      <section className="px-6 md:px-12 my-10">
        <h2 className="font-display text-3xl tracking-wider mb-4">Top Rated</h2>
        {topRated.isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-40">
            {Array.from({ length: 12 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-40">
            {(topRated.data?.results || []).map((m) => (
              <MovieCard key={m.id} item={{ ...m, media_type: 'movie' }} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
