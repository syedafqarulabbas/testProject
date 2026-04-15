import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Text, CustomLink } from "components/SitecoreFields";

import type { LinkField, TextField } from "@sitecore-jss/sitecore-jss-nextjs";

type HeaderFields = {
  logoText: TextField;
  navAbout: LinkField;
  navServices: LinkField;
  navProducts: LinkField;
  navCareer: LinkField;
  navContact: LinkField;
};

const Header = ({ fields }: { fields: HeaderFields }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const f = fields;

  return (
    <header className="bg-background/90 max-w-[1540px] mx-auto">
  <div className="container py-8 px-0.5">
    <div className="grid grid-cols-12 items-center">
      {/* Logo - Grid 4 columns */}
      <div className="col-span-4 max-w-[268px] max-h-[93px] ">
        <div className="flex items-center mx-8 ">
          <img 
            src="/assets/bitlogix.svg" 
            alt="Bit Logix" 
            className=" object-contain"
          />
        </div>
      </div>
      
      {/* Desktop Nav - Grid 8 columns */}
      <nav className="hidden md:flex items-center justify-end gap-8 col-span-8 text-sm font-medium text-foreground px-[20px]">
        <CustomLink field={f.navAbout} className="hover:text-primary transition-colors" />
        <CustomLink field={f.navServices} className="hover:text-primary transition-colors flex items-center gap-1">
          {/* <span>{f.navServices?.value?.text}</span> <ChevronDown className="w-3.5 h-3.5" /> */}
        </CustomLink>
        <CustomLink field={f.navProducts} className="hover:text-primary transition-colors" />
        <CustomLink field={f.navCareer} className="hover:text-primary transition-colors" />
        <CustomLink field={f.navContact} className="hover:text-primary transition-colors" />
      </nav>
    </div>
    
    {/* Mobile toggle - positioned separately */}
    <button 
      className="md:hidden text-foreground absolute top-8 right-4" 
      onClick={() => setMobileOpen(!mobileOpen)}
      aria-label="Toggle menu"
    >
      {mobileOpen ? <X /> : <Menu />}
    </button>
  </div>

  {mobileOpen && (
    <nav className="md:hidden flex flex-col gap-4 px-6 pb-6 text-sm font-medium text-foreground bg-background">
      <CustomLink field={f.navAbout} />
      <CustomLink field={f.navServices} />
      <CustomLink field={f.navProducts} />
      <CustomLink field={f.navCareer} />
      <CustomLink field={f.navContact} />
    </nav>
  )}
</header>
  );
};

export default Header;