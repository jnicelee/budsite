import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { homeCarouselSlides } from "../data/content";

export function PhotoCarousel({ slides = homeCarouselSlides }) {
  const carouselSlides = slides.length > 0 ? slides : homeCarouselSlides;
  const [activeIndex, setActiveIndex] = useState(0);
  const safeActiveIndex = Math.min(activeIndex, carouselSlides.length - 1);
  const activeSlide = carouselSlides[safeActiveIndex];

  const goToPrevious = () => {
    setActiveIndex((currentIndex) => (currentIndex - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const goToNext = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % carouselSlides.length);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % carouselSlides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [carouselSlides.length]);

  return (
    <div className="overflow-hidden border border-[#ded8d2] bg-white shadow-[0_16px_42px_rgba(45,41,38,0.08)]">
      <div className="relative aspect-[4/5] min-h-[16rem] bg-[#2D2926] sm:aspect-[16/9] sm:min-h-[20rem] lg:aspect-[21/8]">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeSlide.src}
            src={activeSlide.src}
            alt={activeSlide.alt}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.45 }}
          />
        </AnimatePresence>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2D2926]/88 via-[#2D2926]/52 to-transparent p-5 pt-16 text-white md:p-7 md:pt-24">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/75">{activeSlide.kicker}</p>
          <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-white sm:text-base sm:leading-7">{activeSlide.caption}</p>
        </div>
        <div className="absolute right-4 top-4 flex gap-2">
          <button
            type="button"
            onClick={goToPrevious}
            className="grid h-10 w-10 place-items-center border border-white/45 bg-[#2D2926]/60 text-white transition hover:bg-[#CC0000]"
            aria-label="Previous photo"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="grid h-10 w-10 place-items-center border border-white/45 bg-[#2D2926]/60 text-white transition hover:bg-[#CC0000]"
            aria-label="Next photo"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="absolute bottom-5 right-5 flex gap-2">
          {carouselSlides.map((slide, index) => (
            <button
              key={slide.id || slide.caption}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2 w-7 border border-white/70 transition ${index === safeActiveIndex ? "bg-white" : "bg-white/20"}`}
              aria-label={`Show ${slide.kicker} photo`}
              aria-current={index === safeActiveIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
