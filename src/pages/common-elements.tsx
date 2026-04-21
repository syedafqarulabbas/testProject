import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import ServicesSection from "../components/ServicesSection";
import TestimonialsSection from "../components/TestimonialsSection";
import ClientsSection from "../components/ClientsSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

const layoutData = {
  uid: "293d1ed4-99ee-4320-8c02-e5e66fd1c05e",
  componentName: "HeaderDammam",
  dataSource: "{12A32230-8C0B-419E-BF49-96CB342EEA9A}",
  fields: {
    Logo: {
      value: {
        src: "/",
        alt: "",
        width: "157",
        height: "29",
      },
    },
    items: [
      { Link: { value: { text: "About Us", href: "#about", linktype: "internal" } } },
      { Link: { value: { text: "Services", href: "#services", linktype: "internal" } } },
      { Link: { value: { text: "Products", href: "#products", linktype: "internal" } } },
      { Link: { value: { text: "Career", href: "#career", linktype: "internal" } } },
      { Link: { value: { text: "Contact Us", href: "#contact", linktype: "internal" } } },
    ],
  },
  placeholders: {
    hero: {
      fields: {
        watermarkLeft: { value: "LOGIX" },
        watermarkRight: { value: "BIT" },
        heroImage: { value: { src: "/assets/hero-team.jpg", alt: "Team meeting", width: "800", height: "1000" } },
        clientsStat: { value: "150+ Clients" },
        heading: { value: "Trusted Global" },
        subheading: { value: "Providing customer ready digital solutions to accelerate time to market." },
        description: {
          value:
            "Over more than a decade, we are delivering solutions by partnering with businesses to transform their digital strategy to successful execution.",
        },
        rightHeading: { value: "Enabling organizations to achieve digital excellence" },
        yearsBadge: { value: "14+ Years of Service" },
        projectsStat: { value: "250+ Projects Completed" },
        hoursStat: { value: "500k+ Hours" },
      },
    },
    about: {
      fields: {
        image: { value: { src: "/assets/team-illustration.png", alt: "Team illustration", width: "800", height: "1000" } },
        hoverImage: { value: { src: "/assets/coding.png", alt: "Coding illustration", width: "800", height: "1000" } },
        officesStat: { value: "3 Global Offices" },
        teamStat: { value: "50+ team members" },
        description1: {
          value:
            "Since inception, BITLogix has been providing services to diverse industry segments in tech architecture, emerging technologies, team augmentation and holistic tech-oriented consulting to enable organizations in adapting modern technologies and successful execution of digital transformation strategy.",
        },
        description2: {
          value:
            "We have successful track record of helping organizations in reducing operational cost by rationalizing enterprise architecture and optimizing processes through agile and lean methodologies that resulted into maximizing the revenue and greater customer satisfaction.",
        },
        socialLinks: [
          { field: { value: { href: "#", text: "f", linktype: "internal" } }, label: "f" },
          { field: { value: { href: "#", text: "o", linktype: "internal" } }, label: "o" },
          { field: { value: { href: "#", text: "X", linktype: "internal" } }, label: "X" },
          { field: { value: { href: "#", text: "in", linktype: "internal" } }, label: "in" },
        ],
      },
    },
    services: {
      fields: {
        slides: [
          {
            leftEyebrow: { value: "Full Stack Development" },
            leftTitle: { value: "Enterprise cloud ready tailor made solutions" },
            leftParagraph1: {
              value: "To remain competitive in the current business landscape, companies are forced to provide products and services that provide competitive edge.",
            },
            leftParagraph2: {
              value: "We provide services to the companies in developing digital products and solutions that are tailormade and meet business needs and customers expectations.",
            },
            rightLabel: { value: "Full Stack<br/>Development" },
            illustration: { value: { src: "/assets/fullstack-dev.png", alt: "Full Stack Development", width: "800", height: "800" } },
            readMore: { value: "Read More" },
          },
          {
            leftEyebrow: { value: "Product Engineering" },
            leftTitle: { value: "Build modern products with faster delivery cycles" },
            leftParagraph1: { value: "We help organizations design and deliver customer-centric digital products with scalable architecture and engineering best practices." },
            leftParagraph2: { value: "From discovery to release, our teams work with agile methods to reduce time-to-market while improving quality and product experience." },
            rightLabel: { value: "Product<br/>Engineering" },
            illustration: { value: { src: "/assets/hero-team.jpg", alt: "Product Engineering", width: "800", height: "800" } },
            readMore: { value: "Read More" },
          },
          {
            leftEyebrow: { value: "Cloud Solutions" },
            leftTitle: { value: "Scalable cloud infrastructure for modern businesses" },
            leftParagraph1: { 
              value: "Leverage the power of cloud computing to scale your business efficiently and reduce operational costs." 
            },
            leftParagraph2: { 
              value: "Our cloud experts help you migrate, manage, and optimize your infrastructure on AWS, Azure, or Google Cloud." 
            },
            rightLabel: { value: "Cloud<br/>Solutions" },
            illustration: { value: { src: "/assets/fullstack-dev.png", alt: "Cloud Solutions", width: "800", height: "800" } },
            readMore: { value: "Read More" },
          },
        ],
      },
    },
    testimonials: {
      fields: {
        characterImage: { value: { src: "/assets/testimonial-character.png", alt: "Testimonial character", width: "800", height: "800" } },
        quote1: { value: '"' },
        body1: { value: "Serving over more than a decade with a diverse range of clients, products." },
        author1: { value: "- Atif Arshad<br/>www.duofankaar.com" },
        quote2: { value: '"' },
        body2: { value: "Serving over more than a decade with a diverse range of clients, products." },
        author2: { value: "- Atif Arshad<br/>www.duofankaar.com" },
      },
    },
    clients: {
      fields: {
        title: { value: "Happy Clients" },
        description: { value: "A multinational team of industrious consultants united by a commitment to better deliver world-class solutions with our partners." },
        clients: [
          { value: "Medical Laboratories" },
          { value: "Hijaz Hospital" },
          { value: "Mughal Eye Hospital" },
          { value: "Duracell" },
          { value: "Lifeline Laboratories" },
          { value: "Woolworths" },
          { value: "HG" },
          { value: "Descon" },
          { value: "Ozone Solutions" },
          { value: "Alnoor Diagnostic" },
        ],
      },
    },
    contact: {
      fields: {
        eyebrow: { value: "Say Hello!" },
        title: { value: "Request an initial consultation or Zoom call" },
        infoTitle: { value: "Get in Touch" },
        infoHeading: { value: "Email Us" },
        infoSubheading: { value: "For project inquiries only:" },
        emailLink: { value: { href: "mailto:info@ebitlogix.com", text: "info@ebitlogix.com", linktype: "external" } },
        submitLabel: { value: "submit" },
        placeholderName: { value: "Your Name" },
        placeholderEmail: { value: "Your Email" },
        placeholderCompany: { value: "Company Name" },
        placeholderServices: { value: "Your Services" },
        placeholderMessage: { value: "Your Message (Optional)" },
      },
    },
    footer: {
      fields: {
        pakistanOfficeTitle: { value: "Pakistan Office" },
        pakistanOfficeName: { value: "BITLogix Pvt. Ltd." },
        pakistanOfficeAddress: { value: "46 B-II, Main Gulberg, Lahore, Pakistan." },
        pakistanOfficePhone: { value: "Tel: +92 42 35781941-42, Fax: +92 42 35782030" },
        ukTitle: { value: "UK" },
        ukOfficeName: { value: "BITLogix Ltd." },
        ukOfficeAddress: { value: "58 Weydown Close, SW 19 6JQ, London." },
        ukOfficePhone: { value: "Tel: +44 020 375 470 63, +44 079 575 449 60" },
        workInquiriesTitle: { value: "Work inquiries" },
        workInquiriesSubtitle: { value: "Interested in working with us" },
        workInquiriesEmail: { value: { href: "mailto:info@ebitlogix.com", text: "info@ebitlogix.com", linktype: "external" } },
        workInquiriesPhoneLabel: { value: "Phone" },
        workInquiriesPhone: { value: "+92 42 35781941-42" },
        stayInTouchTitle: { value: "Stay in touch" },
        stayInTouchPlaceholder: { value: "Your Email" },
        stayInTouchButton: { value: "Send" },
        socialLinks: [
          { value: { href: "#facebook", text: "facebook", linktype: "internal" } },
          { value: { href: "#instagram", text: "instagram", linktype: "internal" } },
          { value: { href: "#youtube", text: "youtube", linktype: "internal" } },
          { value: { href: "#twitter", text: "twitter", linktype: "internal" } },
          { value: { href: "#linkedin", text: "linkedin", linktype: "internal" } },
        ],
        copyrightText: { value: "© 2026, bitlogix (PVT) LTD." },
        rightsText: { value: "All rights reserved." },
      },
    },
  },
};

const pageData = {
  header: {
    logoText: { value: "BITLOGIX" },
    navAbout: layoutData.fields.items[0].Link,
    navServices: layoutData.fields.items[1].Link,
    navProducts: layoutData.fields.items[2].Link,
    navCareer: layoutData.fields.items[3].Link,
    navContact: layoutData.fields.items[4].Link,
  },
  hero: layoutData.placeholders.hero.fields,
  about: layoutData.placeholders.about.fields,
  services: layoutData.placeholders.services.fields,
  testimonials: layoutData.placeholders.testimonials.fields,
  clients: layoutData.placeholders.clients.fields,
  contact: layoutData.placeholders.contact.fields,
  footer: layoutData.placeholders.footer.fields,
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header fields={pageData.header} />
      <HeroSection fields={pageData.hero} />
      <AboutSection fields={pageData.about} />
      <ServicesSection fields={pageData.services} />
      <section id="products">
        <TestimonialsSection fields={pageData.testimonials} />
      </section>
      {/* <section id="career">
        <ClientsSection fields={pageData.clients} />
      </section> */}
      <ContactSection fields={pageData.contact} />
      <Footer fields={pageData.footer} />
    </div>
  );
};

export default Index;