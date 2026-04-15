import { Text, RichText, CustomImage } from "components/SitecoreFields";

import type { ImageField, RichTextField, TextField } from "@sitecore-jss/sitecore-jss-nextjs";

type TestimonialsFields = {
  characterImage: ImageField;
  quote1: TextField;
  body1: RichTextField;
  author1: RichTextField;
  quote2: TextField;
  body2: RichTextField;
  author2: RichTextField;
};
const TestimonialsSection = ({ fields }: { fields: TestimonialsFields }) => {
  const f = fields;
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 overflow-hidden">
      <div className="container mx-auto">
        <div className="flex justify-center mb-0 -mt-4">
          <CustomImage
            field={f.characterImage}
            className="w-40 h-40 sm:w-56 sm:h-56 lg:w-64 lg:h-64 object-contain relative z-10 motion-safe:animate-[testimonial-float_3.2s_ease-in-out_infinite]"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 -mt-6 sm:-mt-10">
          <div className="flex-1 bg-secondary rounded-2xl sm:rounded-3xl px-6 sm:px-10 py-8 sm:py-10 relative">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <Text field={f.quote1} tag="span" className="text-4xl sm:text-5xl font-bold text-foreground leading-none" />
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-foreground/20 overflow-hidden">
                <div className="w-full h-full bg-muted-foreground/30 flex items-center justify-center text-xs text-background">
                  👤
                </div>
              </div>
            </div>
            <RichText field={f.body1} className="text-foreground text-base sm:text-lg lg:text-xl font-bold leading-snug mb-4 sm:mb-6" />
            <RichText field={f.author1} className="text-foreground/80 text-xs sm:text-sm" />
          </div>

          <div className="flex-1 bg-background border border-border rounded-2xl sm:rounded-3xl px-6 sm:px-10 py-8 sm:py-10 relative">
            <Text
              field={f.quote2}
              tag="span"
              className="text-4xl sm:text-5xl font-bold text-muted-foreground/40 leading-none mb-4 sm:mb-6 block"
            />
            <RichText field={f.body2} className="text-foreground text-base sm:text-lg lg:text-xl font-bold leading-snug mb-4 sm:mb-6" />
            <RichText field={f.author2} className="text-muted-foreground text-xs sm:text-sm" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;