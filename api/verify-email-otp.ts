import type { VercelRequest, VercelResponse } from '@vercel/node'
import { neon } from '@neondatabase/serverless'
import crypto from 'crypto'

const MAX_ATTEMPTS = 3

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

    const { email, otp } = req.body ?? {}

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Email is required.',
      })
    }

    if (!otp || typeof otp !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Verification code is required.',
      })
    }

    const normalizedEmail = normalizeEmail(email)
    const normalizedOtp = otp.trim()

    if (!/^\d{6}$/.test(normalizedOtp)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 6-digit verification code.',
      })
    }

    const records = await sql`
      SELECT
        id,
        otp_hash,
        expires_at,
        attempts,
        verified_at
      FROM email_verifications
      WHERE email = ${normalizedEmail}
      ORDER BY created_at DESC
      LIMIT 1
    `

    if (records.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No verification code found. Please request a new code.',
      })
    }

    const verification = records[0]

    if (verification.verified_at) {
      return res.status(200).json({
        success: true,
        message: 'Email is already verified.',
      })
    }

    if (new Date(verification.expires_at).getTime() <= Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'This verification code has expired. Please request a new one.',
      })
    }

    if (Number(verification.attempts) >= MAX_ATTEMPTS) {
      return res.status(429).json({
        success: false,
        message: 'Too many incorrect attempts. Please request a new code.',
      })
    }

    const submittedHash = hashOtp(normalizedOtp)

    const hashesMatch = crypto.timingSafeEqual(
      Buffer.from(submittedHash, 'hex'),
      Buffer.from(verification.otp_hash, 'hex')
    )

    if (!hashesMatch) {
      await sql`
        UPDATE email_verifications
        SET attempts = attempts + 1
        WHERE id = ${verification.id}
      `

      const attemptsRemaining =
        MAX_ATTEMPTS - Number(verification.attempts) - 1

      return res.status(400).json({
        success: false,
        message:
          attemptsRemaining > 0
            ? `Incorrect verification code. ${attemptsRemaining} attempt${
                attemptsRemaining === 1 ? '' : 's'
              } remaining.`
            : 'Incorrect verification code. Please request a new code.',
        attemptsRemaining,
      })
    }

    await sql`
      UPDATE email_verifications
      SET verified_at = NOW()
      WHERE id = ${verification.id}
    `

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully.',
      email: normalizedEmail,
    })
  } catch (error) {
    console.error('Verify email OTP error:', error)

    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    })
  }
}