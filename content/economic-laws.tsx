import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Share2, Tag, Home } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Template for the purposes of the Content behind Economic Laws portion.
 */

export type Breadcrumb = { label: string; href: string };
export type TOCItem = { id: string; text: string };

export interface ContentPageTemplateProps {
  title: string;
  description?: string;
  heroImage?: { src: string; alt?: string };
  author?: { name: string; url?: string; avatar?: string };
  publishedAt?: string; // ISO date
  updatedAt?: string; // ISO date
  tags?: string[];
  breadcrumbs?: Breadcrumb[];
  readingTime?: string;
  toc?: TOCItem[];
  enableShare?: boolean;
  /** Optional custom SEO component. If omitted, a default minimal SEO block will be rendered. */
  SEO?: React.ReactNode;
  /** Optional JSON-LD schema provider. If provided, will be injected into <script type="application/ld+json"> */
  jsonLd?: Record<string, unknown>;
  /** Main article content (MDX or React children). */
  children: React.ReactNode;
}

const container = "mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8";

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" },
};

export default function ContentPageTemplate(props: ContentPageTemplateProps) {
  const {
    title,
    description,
    heroImage,
    author,
    publishedAt,
    updatedAt,
    tags = [],
    breadcrumbs = [],
    readingTime,
    toc = [],
    enableShare,
    SEO,
    jsonLd,
    children,
  } = props;

  return (
    <article className="min-h-screen bg-background text-foreground">
      {/* Minimal SEO fallback (works in CRA/Vite). For Next.js app router, migrate to the Metadata API. */}
      {!SEO && (
        <head>
          <title>{title}</title>
          {description ? <meta name="description" content={description} /> : null}
          <meta property="og:title" content={title} />
          {description ? (
            <meta property="og:description" content={description} />
          ) : null}
          {heroImage?.src ? <meta property="og:image" content={heroImage.src} /> : null}
          <meta name="twitter:card" content="summary_large_image" />
        </head>
      )}
      {SEO}
      {jsonLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className={`${container} pt-6`}>
        {breadcrumbs.length > 0 && (
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <a href="/" className="inline-flex items-center gap-1 hover:underline">
                <Home className="h-4 w-4" /> Home
              </a>
            </li>
            {breadcrumbs.map((bc, i) => (
              <li key={`${bc.href}-${i}`} className="flex items-center gap-2">
                <span className="opacity-50">/</span>
                <a href={bc.href} className="hover:underline">
                  {bc.label}
                </a>
              </li>
            ))}
          </ol>
        )}
      </nav>

      {/* Hero */}
      <header className={`${container} pt-6 pb-4`}>        
        <motion.h1 {...fadeIn} className="text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </motion.h1>
        {description && (
          <motion.p {...fadeIn} transition={{ delay: 0.05, duration: 0.35 }} className="mt-2 text-lg text-muted-foreground">
            {description}
          </motion.p>
        )}
      </header>

      {/* Meta Bar */}
      <section className={`${container} pb-4`}
        aria-label="Article meta">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {author?.name && (
            <div className="flex items-center gap-2">
              {author.avatar && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={author.avatar} alt={author.name} className="h-8 w-8 rounded-full" />
              )}
              <a className="hover:underline" href={author.url || "#"}>{author.name}</a>
            </div>
          )}
          {publishedAt && (
            <div className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" />
              <time dateTime={publishedAt}>{formatNiceDate(publishedAt)}</time>
            </div>
          )}
          {readingTime && (
            <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />{readingTime}</span>
          )}
        </div>
      </section>

      {/* Hero Image */}
      {heroImage?.src && (
        <div className={`${container} pb-6`}>
          <motion.div {...fadeIn} className="overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage.src}
              alt={heroImage.alt || title}
              className="h-auto w-full object-cover"
            />
          </motion.div>
        </div>
      )}

      <div className={`${container} grid grid-cols-1 gap-8 pb-16 lg:grid-cols-12`}>
        {/* Main content */}
        <main className="prose prose-neutral dark:prose-invert lg:col-span-8">
          {children}

          {/* Updated date */}
          {(updatedAt && updatedAt !== publishedAt) && (
            <p className="mt-8 text-sm text-muted-foreground">Updated <time dateTime={updatedAt}>{formatNiceDate(updatedAt)}</time></p>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {tags.map((t) => (
                <Badge key={t} variant="secondary" className="inline-flex items-center gap-1">
                  <Tag className="h-3 w-3" /> {t}
                </Badge>
              ))}
            </div>
          )}

          <Separator className="my-8" />

          {/* Share bar */}
          {enableShare && (
            <ShareBar title={title} description={description} />
          )}
        </main>

        {/* Sidebar */}
        <aside className="lg:col-span-4 lg:pl-4">
          {toc.length > 0 && (
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">On this page</p>
                <nav className="mt-3 space-y-2">
                  {toc.map((item) => (
                    <a key={item.id} href={`#${item.id}`} className="block text-sm hover:underline">
                      {item.text}
                    </a>
                  ))}
                </nav>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>

      <Footer />
    </article>
  );
}

/**
 * Helpers & Subcomponents
 */

function formatNiceDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ShareBar({ title, description }: { title: string; description?: string }) {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const shareText = encodeURIComponent(`${title}${description ? ` — ${description}` : ""}`);
  const shareUrl = encodeURIComponent(url);

  const links = [
    { label: "X", href: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
  ];

  return (
    <div className="mt-4">
      <p className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Share2 className="h-4 w-4" /> Share
      </p>
      <div className="flex flex-wrap gap-2">
        {links.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="rounded-full border px-3 py-1 text-sm hover:underline">
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t py-10">
      <div className={`${container} text-sm text-muted-foreground`}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-medium text-foreground">About</p>
            <p className="mt-2 max-w-prose">This is a reusable content page template. Replace this footer with your site links.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Resources</p>
            <ul className="mt-2 space-y-1">
              <li><a className="hover:underline" href="#">Docs</a></li>
              <li><a className="hover:underline" href="#">GitHub</a></li>
              <li><a className="hover:underline" href="#">Contact</a></li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-foreground">Legal</p>
            <ul className="mt-2 space-y-1">
              <li><a className="hover:underline" href="#">Privacy</a></li>
              <li><a className="hover:underline" href="#">Terms</a></li>
            </ul>
          </div>
        </div>
        <p className="mt-8">© {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </div>
    </footer>
  );
}
