import { Text, RichText } from "components/SitecoreFields";

import type { RichTextField, TextField } from "@sitecore-jss/sitecore-jss-nextjs";

type ClientsFields = {
  title: TextField;
  description: RichTextField;
  clients: Array<TextField>;
};
const ClientsSection = ({ fields }: { fields: ClientsFields }) => {
  const f = fields;

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          <div className="lg:w-1/4 shrink-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">
              <Text field={f.title} tag="span" />
            </h2>
            <RichText field={f.description} className="text-muted-foreground text-xs sm:text-sm leading-relaxed" />
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {f.clients.map((client, i) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  className="flex items-center justify-center h-14 sm:h-16 lg:h-20 px-2 border border-border rounded-lg hover:shadow-md transition-shadow"
                >
                  <Text
                    field={client}
                    tag="span"
                    className="text-[10px] sm:text-xs font-semibold text-muted-foreground text-center leading-tight"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;