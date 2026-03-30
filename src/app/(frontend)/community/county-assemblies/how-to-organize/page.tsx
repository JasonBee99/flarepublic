import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata: Metadata = { title: 'How to Organize Your County Assembly | FlaRepublic' }
export const dynamic = 'force-static'

const STEPS = [
  'Call me Jim. I am your coach here. If you fail it is because I failed to support you.',
  'Relax — it doesn\'t require a lot of time. Feel free to volunteer to be the County Organizer even if you have a full time job and a family.',
  'We will send you a list of Republic Members in your county in a spreadsheet so you can work with it. If you aren\'t comfortable with spreadsheets, I will do the hard stuff for you.',
  'When you say "Do It", I will email the Invitation Letter with your contact information on it, cutting myself out of the loop. If you want I can stay in the loop a little longer.',
  'If they respond agreeing to be on the County Assembly, we will gather more information from them and let them do some preparation work, if they choose. But this is not necessary.',
  'We will ask for head shot photos so you all can begin to recognize each other. We may ask them to search for a buddy to join with them, doubling your Assembly pool.',
  'We only need a minimum of 2 Assembly members, counting you as one. But it would be better if we have 13 members eventually, just in case. Note that as word gets out about the Re-Inhabited Republics, you will be getting 1,000 members per day.',
  'The Forum Chat Room for your county members is now operational on FlaRepublic.',
  'When you are ready, you will need to secure a meeting room. This may be hard for some timid folks. Call the local library or community center and book a free room under the name of "Your County Toastmasters Club" for a Saturday. Or you can rely on Zoom or Telegram electronic meetings and use Email Voting Add-ons for secure voting.',
  'We will help supply your Meeting Agenda. Just BS for 20 minutes, then call for a vote. The item being voted on will have been delivered to each member long before the meeting so they will be comfortable with it. The minutes from the meeting is all that is needed.',
  'After this meeting the bulk of your work is done, unless you want to remain on as County Organizer for another month or so in case a second meeting is needed. Your replacement can easily be found from the Chat Room.',
  'Elect your County Assembly Officers.',
]

export default function Page() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-3.5 w-3.5" />
        <Link href="/community/county-assemblies" className="hover:text-foreground">County Assemblies</Link><ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">How to Organize</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-1">How to Organize Your County Assembly</h1>
      <p className="text-sm text-muted-foreground mb-8">By Jim Costa · <a href="mailto:costa4670@gmail.com" className="text-primary hover:underline">costa4670@gmail.com</a> · <a href="tel:8504637711" className="text-primary hover:underline">850-463-7711</a></p>

      <div className="rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 mb-8 text-sm">
        <p className="font-semibold text-foreground mb-1">FLORIDA MUST ORGANIZE 67 COUNTIES! WE DO NOT HAVE TIME FOR MISTAKES!</p>
        <p className="text-muted-foreground">So YOU get the benefit of MY mistakes from 12 years ago when I tried to bring up 31 counties alone. Man, did I make mistakes. — Jim Costa</p>
      </div>

      <div className="space-y-3">
        {STEPS.map((step, i) => (
          <div key={i} className="flex gap-4 rounded-xl border border-border bg-card p-4">
            <span className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">{i + 1}</span>
            <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-muted/40 p-5 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground mb-2">Ready to start?</p>
        <p>Contact Jim Costa directly — he will personally coach you through the process.</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <a href="mailto:costa4670@gmail.com" className="text-primary hover:underline">costa4670@gmail.com</a>
          <a href="tel:8504637711" className="text-primary hover:underline">850-463-7711</a>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
        <Link href="/community/county-assemblies/why-we-need" className="text-sm text-muted-foreground hover:text-foreground">← Why We Need Assemblies</Link>
        <Link href="/community/county-assemblies/temporary-districts" className="text-sm font-medium text-primary hover:underline">Next: Temporary Districts →</Link>
      </div>
    </main>
  )
}
