import { motion } from 'framer-motion';
import { Play, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { backdropUrl } from '../../utils/constants';
import { mediaTypeOf, titleOf, truncate } from '../../utils/formatters';
import { useUiStore } from '../../store/uiStore';

export default function HeroCard({ item }) {
  const navigate = useNavigate();
  const setDetailItem = useUiStore((s) => s.setDetailItem);

  if (!item) return <div className="h-[90vh] bg-card animate-pulse" />;

  const mediaType = mediaTypeOf(item);

  return (
    <section className="relative h-[80vh] md:h-[90vh] w-full overflow-hidden">
      <img
        src={backdropUrl(item.backdrop_path, 'original')}
        alt={titleOf(item)}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/30 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col justify-end pb-16 md:pb-24"
      >
        <span className="text-primary font-display text-xl md:text-2xl tracking-widest mb-2">
          ✦ Featured
        </span>
        <h1 className="font-display text-5xl md:text-7xl tracking-wide max-w-2xl text-balance">
          {titleOf(item)}
        </h1>
        <p className="text-white/90 text-base md:text-lg max-w-xl mt-4 leading-relaxed">
          {truncate(item.overview, 220)}
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <button
            onClick={() => navigate(`/watch/${mediaType}/${item.id}`)}
            className="btn-primary px-7 py-3 text-base"
          >
            <Play size={18} className="fill-current" /> Play
          </button>
          <button
            onClick={() => setDetailItem({ id: item.id, media_type: mediaType })}
            className="btn-secondary px-7 py-3 text-base"
          >
            <Info size={18} /> More Info
          </button>
        </div>
      </motion.div>
    </section>
  );
}
