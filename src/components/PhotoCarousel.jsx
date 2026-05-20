import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { homeCarouselSlides } from "../data/content";
import { Eyebrow } from "./ui";

export function PhotoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = homeCarouselSlides[activeIndex];

  const goToPrevious = () => {
    setActiveIndex((currentIndex) => (currentIndex - 1 + homeCarouselSlides.length) % homeCarouselSlides.length);
  };

  const goToNext = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % homeCarouselSlides.length);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % homeCarouselSlides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="overflow-hidden border border-[#ded8d2] bg-white shadow-[0_20px_55px_rgba(45,41,38,0.1)]">
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
        <div className="absolute inset-x-0 bottom-0 bg-[#2D2926]/92 p-5 text-white md:p-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FF0000]">{activeSlide.kicker}</p>
          <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-white sm:text-base sm:leading-7 md:text-lg">{activeSlide.caption}</p>
        </div>
        <div className="absolute right-4 top-4 flex gap-2">
          <button
            type="button"
            onClick={goToPrevious}
            className="grid h-11 w-11 place-items-center border border-white/60 bg-[#2D2926]/82 text-white transition hover:bg-[#CC0000]"
            aria-label="Previous photo"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="grid h-11 w-11 place-items-center border border-white/60 bg-[#2D2926]/82 text-white transition hover:bg-[#CC0000]"
            aria-label="Next photo"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <Eyebrow>Photo Carousel</Eyebrow>
        <div className="flex gap-2">
          {homeCarouselSlides.map((slide, index) => (
            <button
              key={slide.caption}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 w-8 border border-[#CC0000] transition ${index === activeIndex ? "bg-[#CC0000]" : "bg-white"}`}
              aria-label={`Show ${slide.kicker} photo`}
              aria-current={index === activeIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
