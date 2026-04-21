import { Text, RichText, CustomImage } from "components/SitecoreFields";

import type { RichTextField, TextField, ImageField } from "@sitecore-jss/sitecore-jss-nextjs";

type ClientsFields = {
  title: TextField;
  description: RichTextField;
  clients: Array<ImageField>;
};

const ClientsSection = ({ fields }: { fields: ClientsFields }) => {
  const f = fields;

  const partnerImages = [
    'partners1.png',
    'partners2.png',
    'partners3.png',
    'partners4.png',
    'partners5.png',
    'partners6.png',
    'partners7.png',
    'partners8.png',
    'partners9.png',
    'partners10.png',
    'partners11.png',
    'partners12.png',
    'partners13.png',
    'partners14.png',
    'partners15.png'
  ];

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
              {partnerImages.map((imageName, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center h-14 sm:h-16 lg:h-20 px-2  bg-white"
                >
                  <CustomImage
                    field={{
                      value: {
                        src: `/assets/${imageName}`,
                        alt: `Partner ${i + 1}`,
                        width: 100,
                        height: 50,
                      },
                    }}
                    className="w-auto h-8 sm:h-10 lg:h-12 object-contain"
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