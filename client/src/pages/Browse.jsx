import HeroCard from '../components/cards/HeroCard';
import ContentRow from '../components/sliders/ContentRow';
import {
  usePopularMovies,
  usePopularTv,
  useTopRatedMovies,
  useTopRatedTv,
  useTrending,
} from '../hooks/useMovies';
import { useHistory, useWatchlist } from '../hooks/useWatchlist';

export default function Browse() {
  const trending = useTrending();
  const popularMovies = usePopularMovies();
  const topRatedTv = useTopRatedTv();
  const popularTv = usePopularTv();
  const topRatedMovies = useTopRatedMovies();
  const watchlist = useWatchlist();
  const history = useHistory();

  const heroItem = trending.data?.results?.[0];

  const continueWatching = (history.data || []).map((h) => ({
    id: h.tmdb_id,
    media_type: h.media_type,
    title: h.title,
    poster_path: h.poster_path,
    vote_average: 0,
  }));

  const myList = (watchlist.data || []).map((w) => ({
    id: w.tmdb_id,
    media_type: w.media_type,
    title: w.title,
    poster_path: w.poster_path,
    vote_average: 0,
  }));

  return (
    <div className="-mt-16 animate-fade-in">
      <HeroCard item={heroItem} />

      <div className="-mt-10 md:-mt-16 relative z-20">
        <ContentRow
          title="Trending Now"
          items={trending.data?.results}
          isLoading={trending.isLoading}
        />
        <ContentRow
          title="Popular on StreamVault"
          items={popularMovies.data?.results?.map((m) => ({ ...m, media_type: 'movie' }))}
          isLoading={popularMovies.isLoading}
        />
        {continueWatching.length > 0 && (
          <ContentRow title="Continue Watching" items={continueWatching} />
        )}
        <ContentRow
          title="Top Rated TV"
          items={topRatedTv.data?.results?.map((m) => ({ ...m, media_type: 'tv' }))}
          isLoading={topRatedTv.isLoading}
        />
        <ContentRow
          title="Popular TV Shows"
          items={popularTv.data?.results?.map((m) => ({ ...m, media_type: 'tv' }))}
          isLoading={popularTv.isLoading}
        />
        <ContentRow
          title="Top Rated Movies"
          items={topRatedMovies.data?.results?.map((m) => ({ ...m, media_type: 'movie' }))}
          isLoading={topRatedMovies.isLoading}
        />
        {myList.length > 0 && <ContentRow title="My List" items={myList} />}
      </div>
    </div>
  );
}
