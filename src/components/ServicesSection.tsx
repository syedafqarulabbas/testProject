import { useState } from "react";
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const activeSlide = slides[currentSlide] || slides[0];

  const goToSlide = (nextIndex: number) => {
    if (isTransitioning || nextIndex === currentSlide) return;

    setIsTransitioning(true);
    window.setTimeout(() => {
      setCurrentSlide(nextIndex);
      setIsTransitioning(false);
    }, 180);
  };

  const handlePrev = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    goToSlide((currentSlide + 1) % slides.length);
  };

  return (
    <section id="services" className="w-full overflow-hidden">
      <div className="flex flex-col lg:grid lg:grid-cols-2 min-h-[400px] lg:min-h-[500px]">
        <div className="bg-accent text-accent-foreground px-6 sm:px-10 lg:px-16 py-12 sm:py-16 lg:py-20 flex flex-col justify-center">
          <Text
            field={activeSlide.leftEyebrow}
            tag="p"
            className={`text-xs sm:text-sm font-medium mb-3 sm:mb-4 opacity-90 transition-all duration-300 ${isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
          />
          <h2 className={`font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-6 sm:mb-8 transition-all duration-300 ${isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
            <Text field={activeSlide.leftTitle} tag="span" />
          </h2>
          <RichText
            field={activeSlide.leftParagraph1}
            className={`text-xs sm:text-sm leading-relaxed mb-4 opacity-90 transition-all duration-300 ${isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
          />
          <RichText
            field={activeSlide.leftParagraph2}
            className={`text-xs sm:text-sm leading-relaxed opacity-90 transition-all duration-300 ${isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
          />
        </div>

        <div className="bg-foreground relative px-6 sm:px-10 lg:px-16 py-12 sm:py-16 lg:py-20 flex flex-col items-center justify-center">
          <span className={`absolute top-6 right-6 sm:top-8 sm:right-10 text-background text-xs sm:text-sm font-bold transition-all duration-300 ${isTransitioning ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"}`}>
            <RichText field={activeSlide.rightLabel} />
          </span>

          <div className={`relative w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 transition-all duration-300 ${isTransitioning ? "opacity-0 translate-y-2 scale-[0.98]" : "opacity-100 translate-y-0 scale-100"}`}>
            <div className="absolute inset-0 rounded-full border-2 border-muted-foreground/30" />
            <div className="absolute inset-4 rounded-full border border-muted-foreground/20" />
            <CustomImage field={activeSlide.illustration} className="absolute inset-0 w-full h-full object-contain z-10" />
            <div className="absolute bottom-8 -left-2 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary z-20" />
          </div>

          <div className={`flex items-center gap-3 mt-6 sm:mt-8 text-background transition-all duration-300 ${isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}>
            <ArrowRight className="w-5 h-5" />
            <Text field={activeSlide.readMore} tag="span" className="text-xs sm:text-sm font-medium" />
          </div>

          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-3 text-background">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous service"
              disabled={isTransitioning}
              className="cursor-pointer hover:opacity-70 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next service"
              disabled={isTransitioning}
              className="cursor-pointer hover:opacity-70 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;