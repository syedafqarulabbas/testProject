import { useState } from "react";
import { Text, CustomLink } from "components/SitecoreFields";
import type { LinkField, TextField } from "@sitecore-jss/sitecore-jss-nextjs";

type FooterFields = {
  pakistanOfficeTitle: TextField;
  pakistanOfficeName: TextField;
  pakistanOfficeAddress: TextField;
  pakistanOfficePhone: TextField;
  ukTitle: TextField;
  ukOfficeName: TextField;
  ukOfficeAddress: TextField;
  ukOfficePhone: TextField;
  workInquiriesTitle: TextField;
  workInquiriesSubtitle: TextField;
  workInquiriesEmail: LinkField;
  workInquiriesPhoneLabel: TextField;
  workInquiriesPhone: TextField;
  stayInTouchTitle: TextField;
  stayInTouchPlaceholder: TextField;
  stayInTouchButton: TextField;
  socialLinks: LinkField[];
  copyrightText: TextField;
  rightsText: TextField;
};
const Footer = ({ fields }: { fields: FooterFields }) => {
  const [email, setEmail] = useState("");
  const f = fields;

  return (
    <footer className="w-full bg-dark-bg text-dark-bg-foreground py-16 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <Text
              field={f.pakistanOfficeTitle}
              tag="p"
              className="text-sm font-medium italic text-dark-bg-foreground"
            />
            <div className="space-y-2 pt-4">
              <Text field={f.pakistanOfficeName} tag="p" className="text-sm font-semibold text-dark-bg-foreground brightness-150" />
              <Text field={f.pakistanOfficeAddress} tag="p" className="text-sm text-dark-bg-foreground" />
              <Text field={f.pakistanOfficePhone} tag="p" className="text-sm text-dark-bg-foreground" />
            </div>
          </div>

          <div className="space-y-4">
            <Text
              field={f.ukTitle}
              tag="p"
              className="text-sm font-medium italic text-dark-bg-foreground"
            />
            <div className="space-y-2 pt-4">
              <Text field={f.ukOfficeName} tag="p" className="text-sm font-semibold text-dark-bg-foreground brightness-150" />
              <Text field={f.ukOfficeAddress} tag="p" className="text-sm text-dark-bg-foreground" />
              <Text field={f.ukOfficePhone} tag="p" className="text-sm text-dark-bg-foreground" />
            </div>
          </div>

          <div className="space-y-4">
            <Text
              field={f.workInquiriesTitle}
              tag="p"
              className="text-sm font-medium italic text-dark-bg-foreground"
            />
            <div className="space-y-2 pt-4">
              <Text field={f.workInquiriesSubtitle} tag="p" className="text-sm text-dark-bg-foreground" />
              <CustomLink
                field={f.workInquiriesEmail}
                className="text-sm font-bold text-dark-bg-foreground brightness-150 underline underline-offset-4"
              />
              <div className="pt-4">
                <Text field={f.workInquiriesPhoneLabel} tag="p" className="text-sm font-medium text-dark-bg-foreground" />
                <Text field={f.workInquiriesPhone} tag="p" className="text-sm text-dark-bg-foreground" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Text
              field={f.stayInTouchTitle}
              tag="p"
              className="text-sm font-medium italic text-dark-bg-foreground"
            />
            <div className="pt-4 space-y-4">
              <input
                type="email"
                placeholder={String(f.stayInTouchPlaceholder.value)}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-dark-bg-foreground/30 pb-3 text-sm text-dark-bg-foreground placeholder:text-dark-bg-foreground/50 focus:outline-none focus:border-primary transition-colors"
              />
              <button className="bg-primary text-primary-foreground px-8 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
                <Text field={f.stayInTouchButton} tag="span" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-12">
          {f.socialLinks.map((field, i) => (
            <CustomLink
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              field={field}
              className="text-xs text-primary underline"
            />
          ))}
        </div>

        <div className="border-t border-dark-bg-foreground/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <Text
            field={f.copyrightText}
            tag="p"
            className="text-xs text-dark-bg-foreground/60"
          />
          <Text
            field={f.rightsText}
            tag="p"
            className="text-xs text-dark-bg-foreground/60 italic"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;