import { Heart } from "lucide-react";
import { Text, CustomImage } from "components/SitecoreFields";
import type { ImageField, TextField } from "@sitecore-jss/sitecore-jss-nextjs";

interface HeroFields {
  watermarkLeft: TextField;
  watermarkRight: TextField;
  heroImage: ImageField;
  clientsStat: TextField;
  heading: TextField;
  subheading: TextField;
  description: TextField;
  rightHeading: TextField;
  yearsBadge: TextField;
  projectsStat: TextField;
  hoursStat: TextField;
}

interface HeroSectionProps {
  fields: HeroFields;
}

const HeroSection = ({ fields }: HeroSectionProps) => {
  const f = fields;

  return (
    <section className=" pt-14 px-4 sm:px-6 overflow-hidden relative">

      <div className="container mx-auto relative">
        <span className="absolute left-0 top-[38%] -translate-y-1/2 text-[4rem] sm:text-[6rem] lg:text-[9rem] font-bold text-muted-foreground/10 leading-none select-none pointer-events-none tracking-tighter hidden md:block"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <Text field={f.watermarkLeft} />
        </span>

        <span className="absolute right-0 bottom-[-5%] text-[6rem] sm:text-[8rem] lg:text-[14rem] font-bold text-muted-foreground/8 leading-none select-none pointer-events-none tracking-tighter hidden lg:block"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <Text field={f.watermarkRight} />
        </span>


        {/* <div className="flex justify-center mb-8 sm:mb-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-[-10px] lg:z-10">
          <div className="w-36 h-48 sm:w-48 sm:h-64 lg:w-60 lg:h-76 rounded-[50%] overflow-hidden shadow-xl border-4 border-background relative bottom-[48px] right-[40%]">
            <CustomImage field={f.heroImage} className="w-full h-full object-cover" isLCP />
          </div>
        </div> */}
        <div className=" flex justify-center mb-8 sm:mb-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-[-10px] lg:z-10">
  <div className="rounded-full shadow-xl border-4 border-background relative bottom-[48px] right-[40%]">
    <CustomImage 
      field={f.heroImage} 
      className="w-[220px] h-[286.15px] object-cover rounded-full" 
      isLCP 
    />
  </div>
</div>
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start lg:pt-24">
          <div className="relative z-[1]">
            <div className="flex items-center gap-3 mb-10 sm:mb-14 lg:mb-16">
              <span className="w-10 h-px bg-foreground/60" />
              <Text field={f.clientsStat} tag="span" className="text-xs sm:text-sm font-medium text-foreground tracking-wide" />
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-[2.8rem] font-bold text-foreground mb-4 sm:mb-5 flex items-center gap-3 flex-wrap leading-tight">
              <Text field={f.heading} tag="span" />
              <Heart className="w-5 h-5 sm:w-7 sm:h-7 text-muted-foreground/50" strokeWidth={1.5} />
            </h1>

            <Text field={f.subheading} tag="h2" className="text-lg sm:text-xl lg:text-[1.7rem] font-semibold text-foreground mb-6 sm:mb-8 leading-snug max-w-lg" />

            <Text field={f.description} tag="p" className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-md" />
          </div>

          <div className="flex flex-col items-start lg:items-end gap-6 sm:gap-8 mt-10 lg:mt-0 lg:pt-0 relative z-[1]">
            <h3 className="text-base sm:text-lg lg:text-[1.35rem] font-bold text-foreground lg:text-right max-w-xs leading-snug ">
              <Text field={f.rightHeading} />
            </h3>

            <div className="bg-primary text-primary-foreground rounded-full px-10 sm:px-14 py-5 sm:py-6 text-sm sm:text-base font-semibold shadow-lg">
              <Text field={f.yearsBadge} />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-accent" />
            </div>

            <div className="flex items-center gap-3">
              <Text field={f.projectsStat} tag="span" className="text-xs sm:text-sm font-medium text-foreground" />
              <span className="w-10 h-px bg-foreground/60" />
            </div>

            <div className="flex items-center gap-3 mt-4 lg:mt-8">
              <span className="w-10 h-px bg-foreground/60" />
              <Text field={f.hoursStat} tag="span" className="text-xs sm:text-sm font-medium text-foreground" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
