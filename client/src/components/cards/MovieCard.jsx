import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronDown, Play, Plus, Star, Volume2, VolumeX } from 'lucide-react';
import { backdropUrl, posterUrl } from '../../utils/constants';
import { formatRating, formatYear, mediaTypeOf, releaseOf, titleOf, truncate } from '../../utils/formatters';
import { useUiStore } from '../../store/uiStore';
import { useAddToWatchlist, useRemoveFromWatchlist, useWatchlist } from '../../hooks/useWatchlist';
import { fetchMovieDetail, fetchTvDetail } from '../../api/movies';

const HOVER_DELAY = 550;

export default function MovieCard({ item }) {
  const setDetailItem = useUiStore((s) => s.setDetailItem);
  const { data: list } = useWatchlist();
  const addMutation = useAddToWatchlist();
  const removeMutation = useRemoveFromWatchlist();
  const navigate = useNavigate();
  const [hovering, setHovering] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [muted, setMuted] = useState(true);
  const hoverTimerRef = useRef(null);

  const mediaType = mediaTypeOf(item);
  const inList = list?.some(
    (w) => Number(w.tmdb_id) === Number(item.id) && w.media_type === mediaType
  );

  const detailQuery = useQuery({
    queryKey: ['hoverDetail', mediaType, item.id],
    queryFn: () => (mediaType === 'movie' ? fetchMovieDetail(item.id) : fetchTvDetail(item.id)),
    enabled: hovering,
    staleTime: 1000 * 60 * 30,
  });

  const trailer = detailQuery.data?.videos?.results?.find(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );

  const onMouseEnter = () => {
    setHovering(true);
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => setShowVideo(true), HOVER_DELAY);
  };

  const onMouseLeave = () => {
    setHovering(false);
    setShowVideo(false);
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  };

  useEffect(() => () => hoverTimerRef.current && clearTimeout(hoverTimerRef.current), []);

  const stop = (e) => e.stopPropagation();

  const onToggleList = (e) => {
    stop(e);
    if (inList) removeMutation.mutate({ tmdb_id: item.id, media_type: mediaType });
    else
      addMutation.mutate({
        tmdb_id: item.id,
        media_type: mediaType,
        title: titleOf(item),
        poster_path: item.poster_path,
      });
  };

  const onPlay = (e) => {
    stop(e);
    navigate(`/watch/${mediaType}/${item.id}`);
  };

  const onInfo = (e) => {
    stop(e);
    setDetailItem({ id: item.id, media_type: mediaType });
  };

  const overview = detailQuery.data?.overview || item.overview;
  const genres = detailQuery.data?.genres?.slice(0, 3);
  const hasBackdrop = Boolean(item.backdrop_path);
  const imageSrc = hasBackdrop
    ? backdropUrl(item.backdrop_path, 'w780')
    : posterUrl(item.poster_path, 'w500');

  return (
    <motion.div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onInfo}
      whileHover={{ scale: 1.08, y: -10, zIndex: 50 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      className="relative isolate shrink-0 cursor-pointer rounded-md bg-[#181818] shadow-xl shadow-black/30 outline outline-1 outline-white/0 transition-[outline-color,box-shadow] duration-300 hover:shadow-2xl hover:shadow-black/90 hover:outline-white/10 group/card"
      style={{ transformOrigin: 'center bottom' }}
    >
      <div className="relative w-full aspect-video overflow-hidden rounded-md bg-zinc-950">
        {hasBackdrop ? (
          <img
            src={imageSrc}
            alt={titleOf(item)}
            loading="lazy"
            className={`h-full w-full object-cover transition duration-500 group-hover/card:scale-105 ${
              showVideo && trailer ? 'opacity-0' : 'opacity-100'
            }`}
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/780x439/141414/808080?text=StreamVault';
            }}
          />
        ) : (
          <>
            <img
              src={imageSrc}
              alt=""
              loading="lazy"
              className={`absolute inset-0 h-full w-full scale-125 object-cover opacity-35 blur-md transition-opacity duration-500 ${
                showVideo && trailer ? 'opacity-0' : 'opacity-35'
              }`}
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/780x439/141414/808080?text=StreamVault';
              }}
            />
            <img
              src={imageSrc}
              alt={titleOf(item)}
              loading="lazy"
              className={`relative mx-auto h-full w-auto object-contain drop-shadow-2xl transition duration-500 group-hover/card:scale-105 ${
                showVideo && trailer ? 'opacity-0' : 'opacity-100'
              }`}
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/342x513/141414/808080?text=No+Image';
              }}
            />
          </>
        )}

        <AnimatePresence>
          {showVideo && trailer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
            >
              <iframe
                key={trailer.key + (muted ? 'm' : 'u')}
                title={`${titleOf(item)} trailer`}
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&modestbranding=1&rel=0&loop=1&playlist=${trailer.key}&playsinline=1&iv_load_policy=3`}
                className="absolute inset-0 w-[150%] h-[150%] -translate-x-[16.67%] -translate-y-[16.67%] pointer-events-none"
                allow="autoplay; encrypted-media"
                frameBorder="0"
              />
              <button
                onClick={(e) => {
                  stop(e);
                  setMuted((m) => !m);
                }}
                className="absolute right-2 top-2 z-20 rounded-full border border-white/30 bg-black/70 p-1.5 transition hover:bg-black pointer-events-auto"
                aria-label={muted ? 'Unmute preview' : 'Mute preview'}
              >
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent px-3 pb-3 pt-12">
          <h3 className="font-display text-xl leading-none tracking-wide text-white drop-shadow md:text-2xl line-clamp-1">
            {titleOf(item)}
          </h3>
        </div>
      </div>

      <div
        className={`absolute left-0 right-0 top-[calc(100%-2px)] z-40 rounded-b-md border border-t-0 border-white/10 bg-[#181818] p-3 shadow-2xl shadow-black/90 transition-all duration-200 md:p-4 ${
          hovering
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-2 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={onPlay}
            className="rounded-full bg-white p-2.5 text-black shadow-md transition hover:scale-110 hover:bg-white/90"
            aria-label="Play"
          >
            <Play size={16} className="fill-current" />
          </button>
          <button
            onClick={onToggleList}
            className={`rounded-full border p-2.5 shadow-md transition hover:scale-110 ${
              inList
                ? 'border-emerald-400 bg-emerald-500 text-white hover:bg-emerald-600'
                : 'border-white/45 bg-zinc-900 text-white hover:border-white hover:bg-zinc-800'
            }`}
            aria-label={inList ? 'Remove from list' : 'Add to list'}
          >
            {inList ? <Check size={16} /> : <Plus size={16} />}
          </button>
          <button
            onClick={onInfo}
            className="ml-auto rounded-full border border-white/45 bg-zinc-900 p-2.5 text-white shadow-md transition hover:scale-110 hover:border-white hover:bg-zinc-800"
            aria-label="More info"
          >
            <ChevronDown size={16} />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-medium text-white/85">
          {item.vote_average > 0 && (
            <span className="flex items-center gap-1 text-emerald-400">
              <Star size={11} className="fill-emerald-400" />
              {formatRating(item.vote_average)}
            </span>
          )}
          <span>{formatYear(releaseOf(item))}</span>
          <span className="border border-white/35 px-1 text-[10px] uppercase tracking-wider text-white/75">
            {mediaType === 'tv' ? 'Series' : 'Film'}
          </span>
          <span className="text-white/65">HD</span>
        </div>

        {genres?.length > 0 && (
          <p className="mt-2 text-[12px] text-white/75 line-clamp-1">
            {genres.map((g) => g.name).join(' • ')}
          </p>
        )}

        {overview && (
          <p className="mt-2 text-[12px] leading-snug text-white/65 line-clamp-2">
            {truncate(overview, 130)}
          </p>
        )}
      </div>
    </motion.div>
  );
}
