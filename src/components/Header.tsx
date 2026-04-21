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
          <div className="col-span-4 max-w-[268px] max-h-[93px] ">
            <div className="flex items-center mx-8 ">
              <img 
                src="/assets/bitlogix.svg" 
                alt="Bit Logix" 
                className="object-contain"
              />
            </div>
          </div>
          
          {/* Desktop Nav - Grid 8 columns */}
          <nav className="hidden md:flex items-center justify-end gap-8 col-span-8 text-sm font-medium text-foreground px-[20px]">
            <CustomLink 
              field={f.navAbout} 
              className="relative group inline-block pb-2"
            >
              About Us
              <span className="absolute left-0 w-full h-0.5 bg-black transition-all duration-300 ease-out opacity-0 group-hover:opacity-100 group-hover:-translate-y-2" style={{ bottom: '-8px' }}></span>
            </CustomLink>
            
            <CustomLink 
              field={f.navServices} 
              className="relative group inline-block pb-2"
            >
              Services
              <span className="absolute left-0 w-full h-0.5 bg-black transition-all duration-300 ease-out opacity-0 group-hover:opacity-100 group-hover:-translate-y-2" style={{ bottom: '-8px' }}></span>
            </CustomLink>
            
            <CustomLink 
              field={f.navProducts} 
              className="relative group inline-block pb-2"
            >
              Products
              <span className="absolute left-0 w-full h-0.5 bg-black transition-all duration-300 ease-out opacity-0 group-hover:opacity-100 group-hover:-translate-y-2" style={{ bottom: '-8px' }}></span>
            </CustomLink>
            
            <CustomLink 
              field={f.navCareer} 
              className="relative group inline-block pb-2"
            >
              Career
              <span className="absolute left-0 w-full h-0.5 bg-black transition-all duration-300 ease-out opacity-0 group-hover:opacity-100 group-hover:-translate-y-2" style={{ bottom: '-8px' }}></span>
            </CustomLink>
            
            <CustomLink 
              field={f.navContact} 
              className="relative group inline-block pb-2"
            >
              Contact Us
              <span className="absolute left-0 w-full h-0.5 bg-black transition-all duration-300 ease-out opacity-0 group-hover:opacity-100 group-hover:-translate-y-2" style={{ bottom: '-8px' }}></span>
            </CustomLink>
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
          <CustomLink field={f.navAbout} className="hover:text-primary transition-colors duration-300" />
          <CustomLink field={f.navServices} className="hover:text-primary transition-colors duration-300" />
          <CustomLink field={f.navProducts} className="hover:text-primary transition-colors duration-300" />
          <CustomLink field={f.navCareer} className="hover:text-primary transition-colors duration-300" />
          <CustomLink field={f.navContact} className="hover:text-primary transition-colors duration-300" />
        </nav>
      )}
    </header>
  );
};

export default Header;