import { Text, RichText, CustomImage, CustomLink } from "components/SitecoreFields";
import type { ImageField, LinkField, RichTextField, TextField } from "@sitecore-jss/sitecore-jss-nextjs";

interface AboutFields {
  image: ImageField;
  hoverImage: ImageField;
  officesStat: TextField;
  teamStat: TextField;
  description1: RichTextField;
  description2: RichTextField;
  socialLinks: { field: LinkField; label: string }[];
}

interface AboutSectionProps {
  fields: AboutFields;
}

const AboutSection = ({ fields }: AboutSectionProps) => {
  const f = fields;

  return (
    <section id="about" className="py-12 sm:py-20 lg:py-28 px-4 sm:px-6 overflow-hidden relative">
      <div className="hidden sm:flex absolute left-0 top-32 lg:top-40 flex-col gap-6 text-foreground z-20">
              {f.socialLinks.map((link, i) => (
                <CustomLink key={i} field={link.field} className="text-sm font-bold cursor-pointer hover:text-primary transition-colors">
                  {link.label}
                </CustomLink>
              ))}
            </div>
      <div className="container mx-auto">
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-20 lg:items-start">
          <div className="relative mb-10 lg:mb-0 group">
            <div className="absolute -top-6 sm:-top-10 left-8 sm:left-16 w-24 sm:w-36 lg:w-44 h-24 sm:h-36 lg:h-44 rounded-full bg-secondary z-0" />
            <div className="flex justify-center items-center  gap-3 ">
              <span className="w-10 h-px bg-foreground/60 z-10" />
              <Text field={f.officesStat} tag="span" className="text-xs sm:text-sm font-medium text-foreground z-10" />
            </div>
            {/* <div className="hidden sm:flex absolute left-0 top-32 lg:top-40 flex-col gap-6 text-foreground z-20">
              {f.socialLinks.map((link, i) => (
                <CustomLink key={i} field={link.field} className="text-sm font-bold cursor-pointer hover:text-primary transition-colors">
                  {link.label}
                </CustomLink>
              ))}
            </div> */}

            <div className="relative  z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto overflow-hidden">
              <CustomImage
                field={f.image}
                className="w-full h-full object-contain"
              />
              <CustomImage
                field={f.hoverImage}
                className="absolute inset-x-0 bottom-0 w-full h-full object-contain translate-y-1/4 opacity-0 transition-all duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100"
              />
            </div>

            <div className="flex sm:hidden gap-6 justify-center mt-4 text-foreground">
              {f.socialLinks.map((link, i) => (
                <CustomLink key={i} field={link.field} className="text-sm font-bold cursor-pointer hover:text-primary transition-colors">
                  {link.label}
                </CustomLink>
              ))}
            </div>
          </div>
          

          {/* <div className="relative lg:pt-8">
            <div className="absolute -top-10 -right-20 w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] rounded-full bg-muted/60 pointer-events-none hidden lg:block" />

            <div className="relative z-[1] border  ">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <Text field={f.teamStat} tag="span" className="text-xs sm:text-sm font-medium text-foreground" />
                <span className="w-10 h-px bg-foreground/60" />
              </div>

              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-accent mb-8 sm:mb-12" />

              <RichText field={f.description1} className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-5 sm:mb-7 text-justify" />
              <RichText field={f.description2} className="text-muted-foreground text-sm sm:text-base leading-relaxed text-justify" />
            </div>
          </div> */}
          <div className="relative lg:pt-8">
  <div className="absolute -top-10 -right-20 w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] rounded-full bg-muted/60 pointer-events-none hidden lg:block" />

  <div className="relative z-[1] ">
    <div className="flex items-center gap-3 mb-6 sm:mb-8">
      <Text field={f.teamStat} tag="span" className="text-xs sm:text-sm font-medium text-foreground" />
      <span className="w-10 h-px bg-foreground/60" />
    </div>

    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-accent mb-8 sm:mb-12 mx-[35%]" />

    <RichText field={f.description1} className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-5 sm:mb-7 text-justify" />
    <RichText field={f.description2} className="text-muted-foreground text-sm sm:text-base leading-relaxed text-justify" />
  </div>
</div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
