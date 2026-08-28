import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LuPlay, LuClock, LuStar } from 'react-icons/lu';
import Button from '../shared/Button';
import { HERO_MOVIES } from '../../data/mockMovies';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

export default function HeroCarousel({ movies = HERO_MOVIES }) {
  return (
    <section className="relative w-full h-[85vh] min-h-[600px]" id="hero-carousel">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-text-muted !opacity-50',
          bulletActiveClass: '!bg-accent-red-neon !opacity-100 !w-8 !rounded-full',
        }}
        loop
        className="w-full h-full"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div className="relative w-full h-full">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})` }}
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-bg-primary/30" />

              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full">
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                    {/* Left Column: Movie Details */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="max-w-2xl text-left"
                    >
                      {/* Genre Badge */}
                      <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="inline-block px-3.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border border-accent-red/40 text-accent-red-neon bg-accent-red/10 mb-4"
                      >
                        {movie.genre?.replace('_', ' ')}
                      </motion.span>

                      {/* Title */}
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-[var(--font-display)] leading-tight mb-4 text-white">
                        {movie.title}
                      </h1>

                      {/* Tagline */}
                      <p className="text-base sm:text-lg lg:text-xl text-text-secondary mb-6 leading-relaxed max-w-xl">
                        {movie.tagline}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-5 text-sm text-text-muted mb-8">
                        <span className="flex items-center gap-1.5 font-medium text-text-primary bg-bg-card/60 px-3 py-1.5 rounded-lg border border-border-subtle">
                          <LuStar className="w-4 h-4 text-accent-amber" />
                          {movie.rating} / 10
                        </span>
                        <span className="flex items-center gap-1.5 text-text-secondary">
                          <LuClock className="w-4 h-4 text-accent-red-neon" />
                          {movie.duration} min
                        </span>
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-4">
                        <Link to={`/movie/${movie.id}`}>
                          <Button variant="primary" size="lg" id={`hero-book-${movie.id}`}>
                            <LuPlay className="w-5 h-5" />
                            Book Now
                          </Button>
                        </Link>
                        <Link to={`/movie/${movie.id}`}>
                          <Button variant="secondary" size="lg">
                            Details
                          </Button>
                        </Link>
                      </div>
                    </motion.div>

                    {/* Right Column: Floating Highlights Card (balances the hero visual layout) */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="hidden lg:flex flex-col items-center flex-shrink-0"
                    >
                      <div className="relative p-4 glass rounded-3xl border border-white/10 shadow-2xl shadow-black/80 w-[280px] xl:w-[320px] transition-transform duration-300 hover:scale-105">
                        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-3.5 shadow-lg">
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent opacity-70" />
                          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-xs font-semibold text-white">
                            <LuStar className="w-3.5 h-3.5 text-accent-amber" />
                            {movie.rating}
                          </div>
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-text-secondary bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                            <span>Hall 1 • IMAX</span>
                            <span className="text-accent-red-neon font-semibold">Today</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-center">
                          <h3 className="font-bold text-base font-[var(--font-display)] truncate text-white">
                            {movie.title}
                          </h3>
                          <Link to={`/movie/${movie.id}`} className="block w-full pt-1">
                            <Button variant="primary" size="sm" className="w-full justify-center">
                              <LuPlay className="w-3.5 h-3.5" /> Quick Book
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
