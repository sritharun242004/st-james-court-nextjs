import { NextRequest, NextResponse } from 'next/server';
import { sendContactEnquiry } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
    }

    const submittedAt = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    sendContactEnquiry({ name, email, phone, message, submittedAt }).catch((err) =>
      console.error('[Email] Contact enquiry failed:', err)
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
