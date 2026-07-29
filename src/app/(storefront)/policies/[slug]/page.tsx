/**
 * /policies/[slug] — Policy Pages
 *
 * Fully static — content comes from src/data/policies.ts. There is no
 * admin panel; edit that file and redeploy to change this copy.
 *
 * generateStaticParams() pre-renders all 4 policy pages at build time.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { POLICIES, type PolicySlug } from "@/data/policies";
import { Breadcrumb } from "@/components/storefront/breadcrumb";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const POLICY_SLUGS = Object.keys(POLICIES) as PolicySlug[];

function isPolicySlug(slug: string): slug is PolicySlug {
  return (POLICY_SLUGS as readonly string[]).includes(slug);
}

interface PolicyPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return POLICY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PolicyPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isPolicySlug(slug)) {
    return { title: "Page Not Found" };
  }

  return {
    title: POLICIES[slug].title,
    alternates: { canonical: `/policies/${slug}` },
  };
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params;

  if (!isPolicySlug(slug)) {
    notFound();
  }

  const policy = POLICIES[slug];

  return (
    <div className="container-content py-8 lg:py-10">
      <Breadcrumb
        siteUrl={SITE_URL}
        items={[
          { label: "Home", href: "/" },
          { label: policy.title, href: `/policies/${slug}` },
        ]}
      />

      <h1 className="font-display text-2xl font-semibold text-[var(--color-heading)] lg:text-3xl">
        {policy.title}
      </h1>

      <div className="mt-6 max-w-3xl whitespace-pre-line leading-relaxed text-[var(--color-body)]">
        {policy.body}
      </div>
    </div>
  );
}
