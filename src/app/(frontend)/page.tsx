// src/app/(frontend)/page.tsx
// FlaRepublic Home Page — custom, bypasses Payload slug template.
// Hero + mission strip + quick links + recent posts (hidden if empty).

import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'
import { ChevronRight, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'FlaRepublic — Florida Self-Governance',
  description:
    'The Florida Republic — restoring lawful self-governance for Florida nationals. County assemblies, member resources, and community.',
}

export const revalidate = 300

async function getRecentPosts() {
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'posts',
      limit: 3,
      sort: '-publishedAt',
      depth: 1,
      overrideAccess: false,
      where: { _status: { equals: 'published' } },
      select: { title: true, slug: true, meta: true, publishedAt: true, categories: true },
    })
    return result.docs
  } catch {
    return []
  }
}

export default async function HomePage() {
  const posts = await getRecentPosts()
  const hasPosts = posts.length > 0

  return (
    <div className="flex flex-col">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#111418] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#CC4A1B 1px, transparent 1px), linear-gradient(90deg, #CC4A1B 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(204,74,27,0.12) 0%, transparent 70%)',
          }}
        />

        <div className="container relative mx-auto max-w-5xl px-4 py-14 sm:py-18">
        {/* Decorative Florida map — centered, ghost overlay */}
        <div className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex">
          <Image
            src="/favicon-icon.png"
            alt=""
            width={480}
            height={480}
            className="select-none opacity-[0.09]"
            aria-hidden
          />
        </div>
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-10 bg-[#CC4A1B]" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e5a85a]">
              Florida Republic
            </span>
            <div className="h-px w-40 bg-[#CC4A1B]" />
          </div>

          <h1 className="mb-6 max-w-3xl text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
            Restoring{' '}
            <span className="italic text-[#e5824a]">Self-Governance</span>
            <br className="hidden sm:block" /> in Florida
          </h1>

          <p className="mb-10 max-w-xl text-lg leading-relaxed text-white/70">
            The Florida Republic is the lawful, de jure government of the people — operating
            under the original organic laws of America. County assemblies. Real authority.
            No permission required.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-md bg-[#CC4A1B] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#e05520]"
            >
              Join the Republic <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/learn/newbys-corner"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 transition hover:border-white/50 hover:text-white"
            >
              Learn More <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-10">
            {[
              { label: 'Counties Active', value: '2' },
              { label: 'Members', value: 'Growing' },
              { label: 'Founded', value: '2020' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-[#e5824a]">{s.value}</p>
                <p className="text-xs uppercase tracking-widest text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION STRIP */}
      <section className="border-b border-border bg-muted/40 py-14">
        <div className="container mx-auto max-w-5xl px-4">
          <blockquote className="mx-auto max-w-3xl text-center">
            <p className="text-xl font-medium leading-relaxed text-foreground/90 sm:text-2xl">
              &ldquo;We hold these truths to be self-evident, that all men are created equal,
              that they are endowed by their Creator with certain unalienable Rights&hellip;&rdquo;
            </p>
            <footer className="mt-4 text-sm text-muted-foreground">
              Declaration of Independence, 1776
            </footer>
          </blockquote>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">Get Started</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { emoji: '📖', title: "Newby's Corner", desc: 'New here? Start with the basics.', href: '/learn/newbys-corner' },
              { emoji: '⚡', title: 'Fast Track', desc: 'Six steps to become an active member.', href: '/learn/fast-track' },
              { emoji: '🏛', title: 'EscaRosa Chapter', desc: 'Escambia & Santa Rosa Counties.', href: '/community/escarosa' },
              { emoji: '📄', title: 'Documents', desc: 'Foundational texts and training materials.', href: '/resources/documents' },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition hover:border-primary/50 hover:shadow-md"
              >
                <span className="text-3xl">{card.emoji}</span>
                <span className="font-semibold leading-tight group-hover:text-primary">{card.title}</span>
                <span className="text-sm text-muted-foreground">{card.desc}</span>
                <span className="mt-auto flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition group-hover:opacity-100">
                  Go <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT POSTS — hidden when empty */}
      {hasPosts && (
        <section className="border-t border-border py-16">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Latest Updates</h2>
              <Link href="/posts" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                All posts <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => {
                const date = post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : null
                const category =
                  Array.isArray(post.categories) && post.categories.length > 0
                    ? typeof post.categories[0] === 'object'
                      ? (post.categories[0] as { title?: string }).title
                      : null
                    : null
                return (
                  <Link
                    key={post.id}
                    href={`/posts/${post.slug}`}
                    className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition hover:border-primary/50 hover:shadow-md"
                  >
                    {category && (
                      <span className="text-xs font-semibold uppercase tracking-widest text-primary">{category}</span>
                    )}
                    <h3 className="font-semibold leading-snug group-hover:text-primary">{post.title}</h3>
                    {post.meta?.description && (
                      <p className="line-clamp-2 text-sm text-muted-foreground">{post.meta.description}</p>
                    )}
                    {date && <p className="mt-auto pt-2 text-xs text-muted-foreground">{date}</p>}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* COUNTY CTA */}
      <section className="border-t border-border bg-muted/40 py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-lg">
              <h2 className="text-2xl font-bold tracking-tight">Find your county assembly</h2>
              <p className="mt-2 text-muted-foreground">
                Connect with your local organizer, attend an assembly, and start participating
                in lawful self-governance today.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                href="/contacts"
                className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Contact Directory
              </Link>
              <Link
                href="/procedures/assembly"
                className="rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold transition hover:border-primary/50"
              >
                Assembly Procedures
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
