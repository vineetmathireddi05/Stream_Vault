import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import VideoPlayer from '../components/player/VideoPlayer';
import Spinner from '../components/ui/Spinner';
import { useMovieDetail, useTvDetail } from '../hooks/useMovies';
import { useUpsertHistory } from '../hooks/useWatchlist';
import { titleOf } from '../utils/formatters';
import { youTubeUrl } from '../utils/constants';

export default function Watch() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const isMovie = type === 'movie';
  const movie = useMovieDetail(isMovie ? id : null);
  const tv = useTvDetail(!isMovie ? id : null);
  const query = isMovie ? movie : tv;
  const item = query.data;
  const upsertHistory = useUpsertHistory();
  const lastSavedRef = useRef(0);

  const trailer = item?.videos?.results?.find(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );

  const url = trailer ? youTubeUrl(trailer.key) : 'https://www.youtube.com/watch?v=aqz-KE-bpKQ';

  const onProgress = ({ playedSeconds, duration }) => {
    if (!item || !playedSeconds) return;
    if (playedSeconds - lastSavedRef.current < 15) return;
    lastSavedRef.current = playedSeconds;
    upsertHistory.mutate({
      tmdb_id: Number(id),
      media_type: type,
      title: titleOf(item),
      poster_path: item.poster_path,
      progress_seconds: Math.round(playedSeconds),
      duration_seconds: Math.round(duration || 0),
    });
  };

  useEffect(() => {
    return () => {
      lastSavedRef.current = 0;
    };
  }, [id, type]);

  if (query.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Spinner size={36} />
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-center">
        <p className="text-primary mb-4">{query.error?.message || 'Failed to load.'}</p>
        <button onClick={() => navigate(-1)} className="btn-secondary">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="-mt-16 bg-black">
      <VideoPlayer
        url={url}
        title={titleOf(item)}
        onBack={() => navigate(-1)}
        onProgress={onProgress}
      />
    </div>
  );
}
