import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Capture wealth-advisor / brokerage leads (migrated from the Express backend).
export async function POST(req: Request) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { name, phone, city, branch, segment } = body || {};

  if (!name || !phone || !city) {
    return NextResponse.json(
      { error: 'Please provide all mandatory details (Name, Phone, City).' },
      { status: 400 }
    );
  }

  const lead = {
    id: Date.now(),
    name,
    phone,
    city,
    branch: branch || 'Nearest Local Branch',
    segment: segment || 'General Investment',
    timestamp: new Date().toISOString(),
  };

  console.log('[LEAD-CAPTURE] Qualified lead acquired:', lead);

  // Best-effort local persistence (no-op on read-only/serverless filesystems)
  try {
    const leadsPath = path.join(process.cwd(), 'leads.json');
    let currentLeads: any[] = [];
    if (fs.existsSync(leadsPath)) {
      try {
        currentLeads = JSON.parse(fs.readFileSync(leadsPath, 'utf8'));
      } catch {
        currentLeads = [];
      }
    }
    currentLeads.push(lead);
    fs.writeFileSync(leadsPath, JSON.stringify(currentLeads, null, 2));
  } catch (e) {
    // Filesystem not writable in this environment — lead is still logged above.
  }

  return NextResponse.json(
    {
      message: 'Lead captured successfully!',
      leadId: lead.id,
      advisoryAssignment: `Assigned to Senior Advisor at our ${city} (${lead.branch}) office.`,
    },
    { status: 201 }
  );
}
