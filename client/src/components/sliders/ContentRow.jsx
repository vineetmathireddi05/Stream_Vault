import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from '../cards/MovieCard';
import { CardSkeleton } from '../ui/Skeleton';

export default function ContentRow({ title, items, isLoading, emptyMessage }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector('[data-card]');
    const step = card ? card.getBoundingClientRect().width * 2.5 + 48 : 820;
    el.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
  };

  return (
    <section className="my-8 md:my-10">
      <h2 className="font-display text-3xl md:text-4xl tracking-wide px-5 md:px-12 mb-2">
        {title}
      </h2>

      <div className="relative group/row">
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className="hidden md:flex absolute top-6 bottom-20 left-0 z-20 w-16 items-center justify-center bg-gradient-to-r from-black/95 to-transparent opacity-0 group-hover/row:opacity-100 transition"
        >
          <ChevronLeft size={36} />
        </button>

        <div
          ref={scrollRef}
          className="scroll-row flex gap-3 overflow-x-auto px-5 pb-36 pt-6 md:gap-4 md:px-12"
        >
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                data-card
                className="w-[250px] shrink-0 sm:w-[300px] md:w-[340px] xl:w-[380px]"
              >
                <CardSkeleton />
              </div>
            ))
          ) : items?.length ? (
            items.map((item) => (
              <div
                key={`${item.id}-${item.media_type || 'm'}`}
                data-card
                className="w-[250px] shrink-0 sm:w-[300px] md:w-[340px] xl:w-[380px]"
              >
                <MovieCard item={item} />
              </div>
            ))
          ) : (
            <p className="text-muted py-8">{emptyMessage || 'Nothing to show yet.'}</p>
          )}
        </div>

        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className="hidden md:flex absolute top-6 bottom-20 right-0 z-20 w-16 items-center justify-center bg-gradient-to-l from-black/95 to-transparent opacity-0 group-hover/row:opacity-100 transition"
        >
          <ChevronRight size={36} />
        </button>
      </div>
    </section>
  );
}
