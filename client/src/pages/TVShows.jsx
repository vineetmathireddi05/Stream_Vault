import ContentRow from '../components/sliders/ContentRow';
import MovieCard from '../components/cards/MovieCard';
import { CardSkeleton } from '../components/ui/Skeleton';
import { usePopularTv, useTopRatedTv, useTrending } from '../hooks/useMovies';

export default function TVShows() {
  const trending = useTrending();
  const popular = usePopularTv();
  const topRated = useTopRatedTv();

  const trendingTv = (trending.data?.results || []).filter((r) => r.media_type === 'tv');

  return (
    <div className="animate-fade-in">
      <div className="px-6 md:px-12 pt-10 pb-4">
        <h1 className="font-display text-5xl md:text-6xl tracking-wider">TV Shows</h1>
        <p className="text-muted mt-2 max-w-2xl">
          Sagas, dramas, comedies, and the bingeable series everyone's queueing up.
        </p>
      </div>

      <ContentRow
        title="Trending TV"
        items={trendingTv.map((r) => ({ ...r, media_type: 'tv' }))}
        isLoading={trending.isLoading}
      />
      <ContentRow
        title="Popular Shows"
        items={popular.data?.results?.map((m) => ({ ...m, media_type: 'tv' }))}
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
              <MovieCard key={m.id} item={{ ...m, media_type: 'tv' }} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
