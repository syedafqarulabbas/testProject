/**
 * This Layout is needed for Starter Kit.
 */
import { JSX, useEffect } from "react";
import Head from "next/head";
import {
  LayoutServiceData,
  Field,
  HTMLLink,
  Placeholder,
  VisitorIdentification,
} from "@sitecore-jss/sitecore-jss-nextjs";
import config from "temp/config";
import Scripts from "src/Scripts";
// import AutoScrollPastHero from "src/components/KFIA/Common/AutoScrollPastHero";
// import AutoHashScroll from "src/components/KFIA/Common/AutoHashScroll";
// import { VisibilityProvider } from "components/DammamComponents/VisibilityProvider";
import AOS from "aos";

// Prefix public assets with a public URL to enable compatibility with Sitecore Experience Editor.
// If you're not supporting the Experience Editor, you can remove this.
const publicUrl = config.publicUrl;

interface LayoutProps {
  layoutData: LayoutServiceData; 
  headLinks: HTMLLink[];
}

interface RouteFields {
  [key: string]: unknown;
  Title?: Field;
}

const Layout = ({ layoutData, headLinks }: LayoutProps): JSX.Element => {
  const { route } = layoutData.sitecore;
  const fields = route?.fields as RouteFields;
  const isPageEditing = layoutData.sitecore.context.pageEditing;
  const mainClassPageEditing = isPageEditing
    ? "editing-mode font-sans text-slate-900"
    : "prod-mode font-sans text-slate-900";
  console.log(
    "Layout Data:",
    Object.values(layoutData?.sitecore?.route?.placeholders || {})[1],
  );
  console.log("Layout Data:", layoutData?.sitecore?.route?.placeholders);

  console.log("Layout Data:", layoutData);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 50,
    });
  }, []);

  const renderContent = () => (
    <>
      {/* <VisibilityProvider> */}
        <header>
          <div id="header">
            {route && <Placeholder name="headless-header" rendering={route} />}
          </div>
        </header>
        <main className="font-sans text-slate-900 bg-white antialiased min-h-screen">
          <div id="content">
            {route && <Placeholder name="headless-main" rendering={route} />}
          </div>
        </main>
        <footer>
          <div id="footer">
            {route && <Placeholder name="headless-footer" rendering={route} />}
          </div>
        </footer>
      {/* </VisibilityProvider> */}
    </>
  );

  useEffect(() => {
    const siteName = layoutData?.sitecore?.context?.site?.name;
    if (siteName !== "DACO") {
      const style = document.createElement("style");
      style.innerHTML = `
      .userway_buttons_wrapper {
        left: calc(100vw + 100px) !important;
      }
    `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <>
      <Scripts />
      <Head>
        <script src="https://cdn.userway.org/widget.js" data-account="R92UUEaAjP"></script>
        <title>{fields?.Title?.value?.toString() || "Page"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={`${publicUrl}/favicon.ico`} />
        {headLinks.map((headLink) => (
          <link rel={headLink.rel} key={headLink.href} href={headLink.href} />
        ))}
      </Head>

      {/* Auto scroll past hero on page navigation (no hash) */}
      {/* <AutoScrollPastHero /> */}

      {/* Smooth scroll to hash anchors (with hero offset) */}
      {/* <AutoHashScroll delayMs={150} /> */}

      {/* root placeholder for the app, which we add components to using route data */}
      <div className={mainClassPageEditing}>{renderContent()}</div>
    </>
  );
};

export default Layout;
