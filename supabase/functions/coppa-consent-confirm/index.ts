import { createClient } from 'npm:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const url = new URL(req.url)
  const token = url.searchParams.get('token')
  const childUserId = url.searchParams.get('child_id')

  if (!token || !childUserId) {
    return new Response(
      `<html><body style="font-family:sans-serif;max-width:500px;margin:80px auto;text-align:center;">
        <h2>Invalid Link</h2>
        <p>This consent link is invalid or expired. Please contact support.</p>
      </body></html>`,
      { status: 400, headers: { 'Content-Type': 'text/html' } }
    )
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Look up the pending consent record
  const { data: consent, error } = await supabase
    .from('parent_consents')
    .select('*')
    .eq('child_user_id', childUserId)
    .is('consent_given_at', null)
    .single()

  if (error || !consent) {
    return new Response(
      `<html><body style="font-family:sans-serif;max-width:500px;margin:80px auto;text-align:center;">
        <h2>Already Confirmed</h2>
        <p>This account has already been confirmed, or the link has expired.</p>
      </body></html>`,
      { status: 400, headers: { 'Content-Type': 'text/html' } }
    )
  }

  // Validate token (simple: token = child_user_id + first 8 chars of parent_email hashed)
  // In production, use a proper signed token. This is MVP-level.
  const expectedToken = btoa(`${childUserId}:coppa:consent`).replace(/=/g, '')
  if (!expectedToken.startsWith(token.substring(0, 10))) {
    return new Response(
      `<html><body style="font-family:sans-serif;max-width:500px;margin:80px auto;text-align:center;">
        <h2>Invalid Token</h2>
        <p>This consent link is invalid. Please request a new link.</p>
      </body></html>`,
      { status: 400, headers: { 'Content-Type': 'text/html' } }
    )
  }

  // Mark consent as given
  await supabase
    .from('parent_consents')
    .update({ consent_given_at: new Date().toISOString() })
    .eq('child_user_id', childUserId)

  // Activate the child's account by updating their profile
  await supabase
    .from('profiles')
    .update({ coppa_consent_confirmed: true })
    .eq('id', childUserId)

  return new Response(
    `<html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: -apple-system, sans-serif; max-width: 500px; margin: 80px auto; text-align: center; padding: 20px; background: #0A0F1E; color: white; }
        .card { background: #141B2D; border: 1px solid #1E2A45; border-radius: 16px; padding: 40px 30px; }
        .icon { font-size: 60px; margin-bottom: 20px; }
        h2 { color: #2563EB; margin-bottom: 12px; }
        p { color: #94A3B8; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="icon">✅</div>
        <h2>Consent Confirmed!</h2>
        <p>Thank you. Your child's Soccer AI Coach account has been activated.</p>
        <p style="margin-top: 20px; font-size: 14px;">They can now open the app and start training.</p>
      </div>
    </body>
    </html>`,
    { status: 200, headers: { 'Content-Type': 'text/html' } }
  )
})
