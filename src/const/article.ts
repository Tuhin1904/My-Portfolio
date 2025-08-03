export const articles = [
  {
    title: "Server Side Rendering & Static Site Generation in Next.js",
    slug: "ssr-vs-ssg-nextjs",
    description:
      "Learn the difference between SSR and SSG in Next.js, their use cases, and how to implement them effectively for performance and SEO.",
    updatedDate: "Aug 2025",
    image: "/images/nextjs.jpg",
    content: `
      Next.js offers powerful rendering strategies: **Server-Side Rendering (SSR)** and **Static Site Generation (SSG)**.
      
      - **SSR (Server-Side Rendering)**: Pages are rendered on each request. Best for frequently changing dynamic data.
      - **SSG (Static Site Generation)**: Pages are built at build time and served as static HTML. Great for blogs and static content.
      
      Both approaches boost SEO and performance when used correctly.
    `,
    readMoreLink:
      "https://vercel.com/blog/nextjs-server-side-rendering-vs-static-generation",
  },
  {
    title: "Building Simple Sites Using Vue.js",
    slug: "simple-sites-vue",
    description:
      "Learn how to create lightweight and interactive web pages using Vue.js. Perfect for landing pages or small apps.",
    updatedDate: "Aug 2025",
    image: "/images/vuejs.svg",
    content: `
      Vue.js is a progressive JavaScript framework for building UI. It's perfect for:
      - Single-page applications
      - Small interactive components
      - Lightweight projects
      
      Setup is simple: use Vue CLI or Vite for quick development.
    `,
    readMoreLink: "https://vuejs.org/guide/introduction.html",
  },
  {
    title: "Creating a CRM using Netlify CMS (Decap)",
    slug: "crm-netlify-decap",
    description:
      "Discover how to build a lightweight CRM system using Netlify CMS (Decap) for easy content and user management.",
    updatedDate: "June 2025",
    image: "/images/CRM.svg",
    content: `
      Netlify CMS (Decap) allows developers to build JAMstack apps with headless CMS features.
      
      Steps:
      1. Setup a static site (Next.js, Gatsby, or Hugo).
      2. Add Netlify CMS to manage customer data.
      3. Deploy on Netlify for a fully integrated CRM solution.
    `,
    readMoreLink: "https://decapcms.org/docs/intro/",
  },
  {
    title: "Styling Modern Websites with Tailwind CSS",
    slug: "modern-websites-tailwind",
    description:
      "Tailwind CSS offers utility-first styling that speeds up development and makes responsive design effortless.",
    updatedDate: "May 2025",
    image: "/images/tailwind.svg",
    content:
      `
      Tailwind CSS lets you style directly in HTML or JSX using utility classes:
      
      - Responsive design with ` +
      "`sm:, md:, lg:`" +
      ` prefixes
      - Built-in dark mode support
      - Customizable themes via config
      
      Install via npm and start using utility classes for faster UI building.
    `,
    readMoreLink: "https://tailwindcss.com/docs",
  },
];
