const sgMail = require('@sendgrid/mail');

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check Basic Auth
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Unauthorized - Missing Basic Auth' });
  }

  // Decode Basic Auth - expecting "Basic base64(username:password)"
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  // Verify against SENDGRID_SECRET
  const expectedSecret = process.env.SENDGRID_SECRET;

  if (!expectedSecret) {
    console.error('[TestMail] SENDGRID_SECRET not set in environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Username can be anything, password must match SENDGRID_SECRET
  if (password !== expectedSecret) {
    return res.status(401).json({ error: 'Unauthorized - Invalid credentials' });
  }

  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: 'neel.redkar@gmail.com',
      from: process.env.SENDGRID_FROM_EMAIL || 'neel@neelr.dev',
      subject: 'Test Email from Notebook',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Test Email</title>
</head>
<body>
  <h1 style="color: #EE6C4D;">Test Email</h1>
  <p style="color: #293241; font-family: Arial, Helvetica, sans-serif;">
    This is a test email from the notebook newsletter system.
  </p>
  <p style="color: #293241; font-family: Arial, Helvetica, sans-serif;">
    Sent at: ${new Date().toISOString()}
  </p>
</body>
</html>
      `.trim()
    };

    await sgMail.send(msg);

    return res.status(200).json({
      success: true,
      message: 'Test email sent to neel.redkar@gmail.com'
    });

  } catch (error) {
    console.error('[TestMail] Error:', error);

    if (error.response && error.response.body) {
      console.error('[TestMail] SendGrid Error Details:', JSON.stringify(error.response.body, null, 2));
    }

    return res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.body || null
    });
  }
}
