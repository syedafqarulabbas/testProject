import { useState } from "react";
import { Text, CustomLink } from "components/SitecoreFields";

import type { LinkField, TextField } from "@sitecore-jss/sitecore-jss-nextjs";

type ContactFields = {
  eyebrow: TextField;
  title: TextField;
  infoTitle: TextField;
  infoHeading: TextField;
  infoSubheading: TextField;
  emailLink: LinkField;
  submitLabel: TextField;
  placeholderName: TextField;
  placeholderEmail: TextField;
  placeholderCompany: TextField;
  placeholderServices: TextField;
  placeholderMessage: TextField;
};
const ContactSection = ({ fields }: { fields: ContactFields }) => {
  const f = fields;
  const [form, setForm] = useState({
    name: "", email: "", company: "", services: "", message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
          <div className="flex-1">
            <Text field={f.eyebrow} tag="p" className="text-xs sm:text-sm font-medium text-muted-foreground mb-2" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-8 sm:mb-10 leading-tight">
              <Text field={f.title} tag="span" />
            </h2>

            <form className="space-y-8 sm:space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder={String(f.placeholderName.value)}
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-border pb-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder={String(f.placeholderEmail.value)}
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-border pb-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <input
                    type="text"
                    name="company"
                    placeholder={String(f.placeholderCompany.value)}
                    value={form.company}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-border pb-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="services"
                    placeholder={String(f.placeholderServices.value)}
                    value={form.services}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-border pb-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder={String(f.placeholderMessage.value)}
                  value={form.message}
                  onChange={handleChange}
                  rows={1}
                  className="w-full bg-transparent border-b border-border pb-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="bg-primary text-primary-foreground px-10 sm:px-12 py-3 sm:py-3.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <Text field={f.submitLabel} tag="span" />
              </button>
            </form>
          </div>

          <div className="lg:w-64 shrink-0">
            <Text field={f.infoTitle} tag="p" className="text-xs sm:text-sm font-bold text-foreground mb-2" />
            <Text field={f.infoHeading} tag="h3" className="text-2xl sm:text-3xl font-bold text-foreground mb-3" />
            <Text field={f.infoSubheading} tag="p" className="text-xs sm:text-sm text-muted-foreground mb-2" />
            <CustomLink
              field={f.emailLink}
              className="text-primary text-sm font-medium underline hover:opacity-80 transition-opacity"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;