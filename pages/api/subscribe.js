const client = require('@sendgrid/client');
const sgMail = require('@sendgrid/mail');

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Extract email and optional name from request body
    const { email, name } = req.body;

    // Validate email exists
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }

    // Check required environment variables
    const listId = process.env.SENDGRID_LIST_ID;
    const apiKey = process.env.SENDGRID_API_KEY;

    if (!listId || !apiKey) {
      console.error('[Subscribe] Missing environment variables:', {
        hasListId: !!listId,
        hasApiKey: !!apiKey
      });
      return res.status(500).json({
        success: false,
        error: 'Server configuration error'
      });
    }

    // Set SendGrid API key
    client.setApiKey(apiKey);
    sgMail.setApiKey(apiKey);

    // Prepare contact data
    const contactData = {
      list_ids: [listId],
      contacts: [{
        email: email,
        first_name: name || ''
      }]
    };

    console.log('[Subscribe] Adding contact:', { email, name: name || '(no name)' });

    // Add contact to SendGrid list
    const request = {
      url: '/v3/marketing/contacts',
      method: 'PUT',
      body: contactData
    };

    const [response] = await client.request(request);

    console.log('[Subscribe] SendGrid response:', {
      statusCode: response.statusCode,
      email: email
    });

    // SendGrid returns 202 Accepted for async processing
    if (response.statusCode === 202) {
      // Send welcome email
      try {
        const welcomeEmail = {
          to: email,
          from: {
            email: 'hi@neelr.dev',
            name: 'hi its neel!'
          },
          subject: 'welcome to my livestream!',
          html: `
          <p><strong>hi!</strong></p>
          <p>i've always wanted a way to blast things to all my friends AND post more on my blog, so hopefully this can be a mix of both.</strong> i'll be sending you updates on my thoughts, projects, and other stuff i'm working on. you can unsubscribe at any time by replying to this email and i'll remove you from the list.</p>
          <p>feel free to reply to this email with any thoughts or questions or funny comments or anything else! i'll try to reply to all of them.</p>
          <p>good luck and stay tuned! :)</p>
          <br>
          <p>-neel</p>
          <br><img src="https://neelr.dev/hippo.png" alt="neel" width="50" height="50" />
          `.trim()
        };

        await sgMail.send(welcomeEmail);
        console.log('[Subscribe] Welcome email sent to:', email);
      } catch (emailError) {
        // Log error but don't fail the subscription
        console.error('[Subscribe] Failed to send welcome email:', emailError.message);
      }

      return res.status(202).json({
        success: true,
        message: 'Successfully subscribed! Updates incoming.... :)'
      });
    } else {
      return res.status(response.statusCode).json({
        success: false,
        error: 'Unexpected response from SendGrid'
      });
    }

  } catch (error) {

    return res.status(500).json({
      success: false,
      error: 'Failed to subscribe. Please try again later.'
    });
  }
}
