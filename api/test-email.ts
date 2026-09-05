import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    })
  }

  try {
    const { email } = req.body ?? {}

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Email is required.',
      })
    }

    const { data, error } = await resend.emails.send({
      from: 'The Fruit House <onboarding@resend.dev>',
      to: [email],
      subject: 'The Fruit House — Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>The Fruit House</h2>
          <p>This is a test email from The Fruit House.</p>
          <p>If you received this, Resend is working correctly.</p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)

      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to send email.',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Test email sent successfully.',
      emailId: data?.id,
    })
  } catch (error) {
    console.error('Test email error:', error)

    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    })
  }
}