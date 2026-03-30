'use client'
// src/components/ContactInfoCard.tsx
// Member-editable contact info card shown on the member dashboard.
// Saves phone, address, secondaryEmail to the users collection via PATCH.
// Visible to the member themselves, county organizers, and site admins.

import React, { useState } from 'react'
import { Phone, MapPin, Mail, Save, Check, Pencil } from 'lucide-react'

interface ContactInfo {
  phone?: string
  address?: string
  secondaryEmail?: string
}

interface Props {
  userId: string
  initialData: ContactInfo
}

export function ContactInfoCard({ userId, initialData }: Props) {
  const [editing, setEditing] = useState(false)
  const [phone, setPhone] = useState(initialData.phone ?? '')
  const [address, setAddress] = useState(initialData.address ?? '')
  const [secondaryEmail, setSecondaryEmail] = useState(initialData.secondaryEmail ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasData = initialData.phone || initialData.address || initialData.secondaryEmail

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          contactInfo: {
            phone: phone.trim() || null,
            address: address.trim() || null,
            secondaryEmail: secondaryEmail.trim() || null,
          },
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data?.errors?.[0]?.message ?? 'Failed to save. Please try again.')
        return
      }
      setSaved(true)
      setEditing(false)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Contact Information</h2>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="inline-flex items-center gap-1 text-sm text-green-600 font-medium">
              <Check className="h-4 w-4" /> Saved
            </span>
          )}
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition"
            >
              <Pencil className="h-3.5 w-3.5" /> {hasData ? 'Edit' : 'Add'}
            </button>
          )}
        </div>
      </div>

      {!editing ? (
        // ── View mode ────────────────────────────────────────────────────────
        <div>
          {!hasData ? (
            <p className="text-sm text-muted-foreground">
              No contact information added yet. Click <strong>Add</strong> to fill in your details.
              This information is only visible to your County Organizer and Site Admins.
            </p>
          ) : (
            <div className="space-y-3">
              {initialData.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground">{initialData.phone}</span>
                </div>
              )}
              {initialData.address && (
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{initialData.address}</span>
                </div>
              )}
              {initialData.secondaryEmail && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground">{initialData.secondaryEmail}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground pt-1">
                Visible to your County Organizer and Site Admins only.
              </p>
            </div>
          )}
        </div>
      ) : (
        // ── Edit mode ─────────────────────────────────────────────────────────
        <div className="space-y-4">
          {error && (
            <p className="text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" /> Phone number
              </span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="(555) 555-5555"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> Address
              </span>
            </label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="123 Main St, Tampa, FL 33601"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Secondary email
              </span>
            </label>
            <input
              type="email"
              value={secondaryEmail}
              onChange={e => setSecondaryEmail(e.target.value)}
              placeholder="alternate@example.com"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            This information is private — visible only to your County Organizer and Site Admins.
          </p>

          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={() => {
                setEditing(false)
                setError(null)
                // Reset to initial values on cancel
                setPhone(initialData.phone ?? '')
                setAddress(initialData.address ?? '')
                setSecondaryEmail(initialData.secondaryEmail ?? '')
              }}
              className="inline-flex items-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
