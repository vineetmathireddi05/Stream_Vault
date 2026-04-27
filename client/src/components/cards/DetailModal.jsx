import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import { Play, Plus, Check, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';
import Badge from '../ui/Badge';
import MovieCard from './MovieCard';
import { useUiStore } from '../../store/uiStore';
import { useMovieDetail, useTvDetail } from '../../hooks/useMovies';
import { useAddToWatchlist, useRemoveFromWatchlist, useWatchlist } from '../../hooks/useWatchlist';
import { backdropUrl, profileUrl, youTubeUrl } from '../../utils/constants';
import { formatRating, formatRuntime, formatYear, releaseOf, titleOf } from '../../utils/formatters';

export default function DetailModal() {
  const detailItem = useUiStore((s) => s.detailItem);
  const closeDetail = useUiStore((s) => s.closeDetail);
  const navigate = useNavigate();

  return (
    <Modal open={!!detailItem} onClose={closeDetail}>
      {detailItem && (
        <DetailContent
          id={detailItem.id}
          mediaType={detailItem.media_type}
          onClose={closeDetail}
          onPlay={() => {
            navigate(`/watch/${detailItem.media_type}/${detailItem.id}`);
            closeDetail();
          }}
        />
      )}
    </Modal>
  );
}

function DetailContent({ id, mediaType, onPlay }) {
  const isMovie = mediaType === 'movie';
  const movie = useMovieDetail(isMovie ? id : null);
  const tv = useTvDetail(!isMovie ? id : null);
  const query = isMovie ? movie : tv;
  const item = query.data;

  const [rating, setRating] = useState(0);
  const { data: list } = useWatchlist();
  const addMutation = useAddToWatchlist();
  const removeMutation = useRemoveFromWatchlist();

  const inList = list?.some(
    (w) => Number(w.tmdb_id) === Number(id) && w.media_type === mediaType
  );

  useEffect(() => {
    setRating(0);
  }, [id]);

  if (query.isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size={36} />
      </div>
    );
  }

  if (query.isError || !item) {
    return (
      <div className="p-10 text-center text-muted">
        Could not load details. {query.error?.message}
      </div>
    );
  }

  const trailer = item.videos?.results?.find(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );

  const cast = item.credits?.cast?.slice(0, 12) || [];
  const recommendations = item.recommendations?.results?.slice(0, 12) || [];

  const onToggleList = () => {
    if (inList) removeMutation.mutate({ tmdb_id: id, media_type: mediaType });
    else
      addMutation.mutate({
        tmdb_id: id,
        media_type: mediaType,
        title: titleOf(item),
        poster_path: item.poster_path,
      });
  };

  return (
    <div>
      <div className="relative aspect-video bg-black">
        {trailer ? (
          <ReactPlayer
            url={youTubeUrl(trailer.key)}
            playing
            muted
            controls
            width="100%"
            height="100%"
            style={{ position: 'absolute', inset: 0 }}
          />
        ) : (
          <img
            src={backdropUrl(item.backdrop_path, 'original')}
            alt={titleOf(item)}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
      </div>

      <div className="p-6 md:p-8 -mt-16 relative">
        <h2 className="font-display text-3xl md:text-5xl tracking-wide mb-3">{titleOf(item)}</h2>

        <div className="flex flex-wrap items-center gap-3 text-sm text-white/80 mb-4">
          <span>{formatYear(releaseOf(item))}</span>
          {item.runtime ? <span>{formatRuntime(item.runtime)}</span> : null}
          {item.episode_run_time?.[0] ? <span>{formatRuntime(item.episode_run_time[0])}/ep</span> : null}
          <Badge>{formatRating(item.vote_average)} ★</Badge>
          {item.genres?.slice(0, 3).map((g) => <Badge key={g.id}>{g.name}</Badge>)}
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button onClick={onPlay} className="btn-primary">
            <Play size={16} className="fill-current" /> Play
          </button>
          <button onClick={onToggleList} className="btn-secondary">
            {inList ? <Check size={16} /> : <Plus size={16} />}
            {inList ? 'In My List' : 'Add to My List'}
          </button>
          <div className="flex items-center gap-1 ml-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setRating(n)}
                aria-label={`Rate ${n}`}
                className="p-1 hover:scale-110 transition"
              >
                <Star
                  size={20}
                  className={n <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/40'}
                />
              </button>
            ))}
          </div>
        </div>

        <p className="text-white/85 leading-relaxed max-w-3xl mb-8">{item.overview}</p>

        {cast.length > 0 && (
          <div className="mb-8">
            <h3 className="font-display text-xl tracking-wider mb-3">Cast</h3>
            <div className="flex gap-4 overflow-x-auto scroll-row pb-2">
              {cast.map((c) => (
                <div key={c.cast_id || c.credit_id} className="shrink-0 w-24 text-center">
                  <img
                    src={profileUrl(c.profile_path)}
                    alt={c.name}
                    className="w-24 h-24 rounded-full object-cover bg-card"
                  />
                  <p className="text-xs mt-2 font-medium leading-tight">{c.name}</p>
                  <p className="text-xs text-muted leading-tight">{c.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendations.length > 0 && (
          <div>
            <h3 className="font-display text-xl tracking-wider mb-3">More Like This</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {recommendations.map((r) => (
                <MovieCard key={r.id} item={{ ...r, media_type: r.media_type || mediaType }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
