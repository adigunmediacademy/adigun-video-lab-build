import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const amount = typeof body?.amount === 'number' ? body.amount : 0

  if (!email || !email.includes('@') || !Number.isInteger(amount) || amount <= 0) {
    return NextResponse.json({ error: 'A valid email and positive amount are required.' }, { status: 400 })
  }

  if (!process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ error: 'Payments are not configured yet.', code: 'PAYSTACK_NOT_CONFIGURED' }, { status: 503 })
  }

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, amount, currency: 'NGN' }),
  })

  const result = await response.json()
  if (!response.ok || !result.status) return NextResponse.json({ error: 'Unable to initialize payment.' }, { status: 502 })
  return NextResponse.json({ authorizationUrl: result.data.authorization_url, reference: result.data.reference })
}
