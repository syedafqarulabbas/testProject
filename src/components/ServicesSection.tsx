import { useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Text, RichText, CustomImage } from "components/SitecoreFields";

import type { ImageField, RichTextField, TextField } from "@sitecore-jss/sitecore-jss-nextjs";

type ServicesSlide = {
  leftEyebrow: TextField;
  leftTitle: TextField;
  leftParagraph1: RichTextField;
  leftParagraph2: RichTextField;
  rightLabel: RichTextField;
  illustration: ImageField;
  readMore: TextField;
};

type ServicesFields = {
  slides: ServicesSlide[];
};

const ServicesSection = ({ fields }: { fields: ServicesFields }) => {
  const slides = fields.slides;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');

  // Create extended array for infinite effect (duplicate slides)
  const extendedSlides = [...slides, ...slides, ...slides];
  const startIndex = slides.length;
  const [displayIndex, setDisplayIndex] = useState(startIndex);

  const goToNext = () => {
    if (isAnimating) return;
    setSlideDirection('next');
    setIsAnimating(true);
    setDisplayIndex(prev => prev + 1);
  };

  const goToPrev = () => {
    if (isAnimating) return;
    setSlideDirection('prev');
    setIsAnimating(true);
    setDisplayIndex(prev => prev - 1);
  };

  const handleTransitionEnd = () => {
    setIsAnimating(false);
    
    // Reset position for infinite loop
    if (displayIndex >= startIndex + slides.length) {
      setDisplayIndex(startIndex);
    } else if (displayIndex < startIndex) {
      setDisplayIndex(startIndex + slides.length - 1);
    }
    
    // Update current slide index
    const newCurrentIndex = ((displayIndex - startIndex + slides.length) % slides.length);
    setCurrentIndex(newCurrentIndex);
  };

  const activeSlide = extendedSlides[displayIndex] || slides[0];
  const currentActiveSlide = slides[currentIndex];

  // Get transform style for carousel
  const getTransformStyle = () => {
    const baseTranslate = -displayIndex * 100;
    return `translateX(${baseTranslate}%)`;
  };

  return (
    <section id="services" className="w-full overflow-hidden">
      <div className="flex flex-col lg:grid lg:grid-cols-2 min-h-[800px] lg:min-h-[800px]">
        {/* Left Section - Text content (updates with carousel) */}
        <div className="bg-accent text-accent-foreground px-6 sm:px-10 lg:px-16 py-12 sm:py-16 lg:py-20 flex flex-col justify-center transition-all duration-500">
          <Text
            field={currentActiveSlide.leftEyebrow}
            tag="p"
            className="text-xs sm:text-sm font-medium mb-3 sm:mb-4 opacity-90"
          />
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-6 sm:mb-8">
            <Text field={currentActiveSlide.leftTitle} tag="span" />
          </h2>
          <RichText
            field={currentActiveSlide.leftParagraph1}
            className="text-xs sm:text-sm leading-relaxed mb-4 opacity-90"
          />
          <RichText
            field={currentActiveSlide.leftParagraph2}
            className="text-xs sm:text-sm leading-relaxed opacity-90"
          />
        </div>

        {/* Right Section - Carousel with slide animation */}
        <div className="bg-foreground relative overflow-hidden">
          <div 
            className="flex h-full transition-transform duration-500 ease-out"
            style={{ transform: getTransformStyle() }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedSlides.map((slide, idx) => (
              <div
                key={idx}
                className="w-full flex-shrink-0 px-6 sm:px-10 lg:px-16 py-12 sm:py-16 lg:py-20 flex flex-col items-center justify-center"
              >
                <span className="absolute top-6 right-6 sm:top-8 sm:right-10 text-background text-xs sm:text-sm font-bold">
                  <RichText field={slide.rightLabel} />
                </span>

                <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80">
                  <div className="absolute inset-0 rounded-full border-2 border-muted-foreground/30" />
                  <div className="absolute inset-4 rounded-full border border-muted-foreground/20" />
                  <CustomImage field={slide.illustration} className="absolute inset-0 w-full h-full object-contain z-10" />
                  <div className="absolute bottom-8 -left-2 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary z-20" />
                </div>

                <div className="flex items-center gap-3 mt-6 sm:mt-8 text-background">
                  <ArrowRight className="w-5 h-5" />
                  <Text field={slide.readMore} tag="span" className="text-xs sm:text-sm font-medium" />
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-3 text-background z-20">
            <button
              type="button"
              onClick={goToPrev}
              aria-label="Previous service"
              disabled={isAnimating}
              className="cursor-pointer hover:opacity-70 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed bg-white/20 rounded-full p-2 backdrop-blur-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next service"
              disabled={isAnimating}
              className="cursor-pointer hover:opacity-70 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed bg-white/20 rounded-full p-2 backdrop-blur-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (isAnimating) return;
                  const diff = index - currentIndex;
                  if (diff > 0) {
                    setSlideDirection('next');
                    setDisplayIndex(displayIndex + diff);
                  } else if (diff < 0) {
                    setSlideDirection('prev');
                    setDisplayIndex(displayIndex + diff);
                  }
                  setIsAnimating(true);
                }}
                disabled={isAnimating}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-6 h-1.5 bg-primary'
                    : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;