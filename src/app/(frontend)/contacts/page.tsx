// src/app/(frontend)/contacts/page.tsx
// Contact directory — fetches contacts from Payload, grouped by county.

import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Mail, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Directory | FlaRepublic',
  description: 'Find your county organizer and FlaRepublic contacts.',
}

export const revalidate = 600

export default async function ContactsPage() {
  const payload = await getPayload({ config: configPromise })

  const countyResult = await payload.find({
    collection: 'counties',
    where: { isActive: { equals: true } },
    limit: 50,
    sort: 'displayOrder',
    overrideAccess: false,
  })

  const contactResult = await payload.find({
    collection: 'contacts',
    where: { isActive: { equals: true } },
    limit: 200,
    depth: 2,
    sort: 'displayOrder',
    overrideAccess: false,
  })

  const counties = countyResult.docs
  const contacts = contactResult.docs

  // Group contacts by county id
  const grouped: Record<string, typeof contacts> = {}
  for (const c of contacts) {
    const countyId = typeof c.county === 'object' ? c.county?.id : c.county
    if (!countyId) continue
    if (!grouped[countyId]) grouped[countyId] = []
    grouped[countyId].push(c)
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Contact Directory</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Reach your county organizer or a FlaRepublic team member.
        </p>
      </div>

      <div className="space-y-10">
        {counties.map((county) => {
          const countyContacts = grouped[county.id] ?? []
          if (countyContacts.length === 0) return null

          return (
            <section key={county.id}>
              <h2 className="mb-4 border-b border-border pb-2 text-lg font-semibold">
                {county.name}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {countyContacts.map((contact) => {
                  const roleName =
                    typeof contact.role === 'object' ? contact.role?.title : null

                  return (
                    <div
                      key={contact.id}
                      className="rounded-lg border border-border bg-card p-5"
                    >
                      <p className="font-semibold">{contact.name}</p>
                      {roleName && (
                        <p className="mt-0.5 text-sm text-primary">{roleName}</p>
                      )}
                      <div className="mt-3 space-y-1.5">
                        {contact.email && (
                          <a
                            href={`mailto:${contact.email}${contact.emailSubject ? `?subject=${encodeURIComponent(contact.emailSubject)}` : ''}`}
                            className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                          >
                            <Mail className="h-4 w-4 shrink-0" />
                            {contact.email}
                          </a>
                        )}
                        {contact.phone && (
                          <a
                            href={`tel:${contact.phone}`}
                            className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                          >
                            <Phone className="h-4 w-4 shrink-0" />
                            {contact.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}

        {counties.every((c) => !grouped[c.id]?.length) && (
          <p className="text-muted-foreground">No contacts listed yet.</p>
        )}
      </div>
    </main>
  )
}
