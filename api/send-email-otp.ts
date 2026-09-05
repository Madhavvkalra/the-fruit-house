import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'
import { neon } from '@neondatabase/serverless'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

const OTP_EXPIRY_MINUTES = 5
const RESEND_COOLDOWN_SECONDS = 60

function hashOtp(otp: string) {
  return crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex')
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

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
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    return res.status(500).json({
      success: false,
      message: 'Database is not configured.',
    })
  }

  const sql = neon(databaseUrl)

  const { email } = req.body ?? {}

  if (!email || typeof email !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Email is required.',
    })
  }

    const normalizedEmail = normalizeEmail(email)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      })
    }

    const recent = await sql`
      SELECT created_at
      FROM email_verifications
      WHERE email = ${normalizedEmail}
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (recent.length > 0) {
      const createdAt = new Date(recent[0].created_at).getTime()
      const secondsSinceLastOtp =
        (Date.now() - createdAt) / 1000

      if (secondsSinceLastOtp < RESEND_COOLDOWN_SECONDS) {
        const remaining = Math.ceil(
          RESEND_COOLDOWN_SECONDS - secondsSinceLastOtp
        )

        return res.status(429).json({
          success: false,
          message: `Please wait ${remaining} seconds before requesting another code.`,
          retryAfterSeconds: remaining,
        })
      }
    }

    const otp = crypto.randomInt(100000, 1000000).toString()
    const otpHash = hashOtp(otp)

    const expiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    )

    await sql`
      UPDATE email_verifications
      SET verified_at = NULL
      WHERE email = ${normalizedEmail}
        AND verified_at IS NULL
    `

    await sql`
      INSERT INTO email_verifications (
        email,
        otp_hash,
        expires_at,
        attempts
      )
      VALUES (
        ${normalizedEmail},
        ${otpHash},
        ${expiresAt.toISOString()},
        0
      )
    `

    const { data, error } = await resend.emails.send({
      from: 'The Fruit House <onboarding@resend.dev>',
      to: [normalizedEmail],
      subject: 'Your The Fruit House verification code',
      html: `
        <div
          style="
            margin:0;
            padding:40px 20px;
            background:#f7f5ec;
            font-family:Arial,Helvetica,sans-serif;
            color:#17351d;
          "
        >
          <div
            style="
              max-width:520px;
              margin:0 auto;
              background:#ffffff;
              border-radius:18px;
              padding:40px 30px;
              text-align:center;
            "
          >
            <p
              style="
                margin:0 0 10px;
                font-size:11px;
                font-weight:700;
                letter-spacing:3px;
                text-transform:uppercase;
                color:#17351d;
              "
            >
              The Fruit House
            </p>

            <h1
              style="
                margin:0 0 18px;
                font-size:26px;
                color:#17351d;
              "
            >
              Verify your email
            </h1>

            <p
              style="
                margin:0 0 28px;
                font-size:15px;
                line-height:1.6;
                color:#536057;
              "
            >
              Use the verification code below to continue
              with your order.
            </p>

            <div
              style="
                display:inline-block;
                padding:16px 28px;
                border-radius:12px;
                background:#f2f0e6;
                font-size:32px;
                font-weight:700;
                letter-spacing:8px;
                color:#17351d;
              "
            >
              ${otp}
            </div>

            <p
              style="
                margin:25px 0 0;
                font-size:13px;
                color:#777;
              "
            >
              This code expires in ${OTP_EXPIRY_MINUTES} minutes.
            </p>

            <p
              style="
                margin:18px 0 0;
                font-size:12px;
                color:#999;
              "
            >
              If you didn't request this code, you can safely
              ignore this email.
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)

      return res.status(500).json({
        success: false,
        message: 'Unable to send verification email.',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Verification code sent successfully.',
      emailId: data?.id,
      expiresInMinutes: OTP_EXPIRY_MINUTES,
      retryAfterSeconds: RESEND_COOLDOWN_SECONDS,
    })
  } catch (error) {
    console.error('Send email OTP error:', error)

    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    })
  }
}