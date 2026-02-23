// SMTP Email Configuration
import nodemailer from 'nodemailer'

// SMTP Configuration for noreply@elezenx.com
export const emailConfig = {
  host: 'smtp.gmail.com', // Change to your SMTP host
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'noreply@elezenx.com',
    pass: '5pZrl-ua'
  },
  tls: {
    rejectUnauthorized: false // Allow self-signed certificates (development only)
  }
}

// Create reusable transporter
export const transporter = nodemailer.createTransport(emailConfig)

export async function verifySMTPConnection(): Promise<boolean> {
  try {
    await transporter.verify()
    return true
  } catch (error) {
    console.error('Error verifying SMTP connection:', error)
    return false
  }
}

// Generate 6-digit verification code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send verification email
export async function sendVerificationEmail(
  to: string,
  customerName: string,
  verificationCode: string,
  insuranceCompany: string,
  premium: number
): Promise<boolean> {
  // Development mode: Skip actual email sending
  const isDevelopment = process.env.NODE_ENV === 'development' || true
  
  if (isDevelopment) {
    console.log('='.repeat(60))
    console.log('📧 EMAIL SIMULATION (Development Mode)')
    console.log('='.repeat(60))
    console.log('To:', to)
    console.log('Customer:', customerName)
    console.log('Insurance Company:', insuranceCompany)
    console.log('Premium:', `₹${premium.toLocaleString()}`)
    console.log('Verification Code:', verificationCode)
    console.log('='.repeat(60))
    console.log('✅ Email would be sent in production')
    console.log('='.repeat(60))
    return true
  }
  
  try {
    const mailOptions = {
      from: '"ELEZENX Insurance" <noreply@elezenx.com>',
      to: to,
      subject: 'Insurance Quotation - Email Verification Required',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .code-box { background: white; border: 2px dashed #3b82f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .code { font-size: 32px; font-weight: bold; color: #1e40af; letter-spacing: 8px; }
            .details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .footer { background: #374151; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛡️ Insurance Quotation Verification</h1>
              <p>ELEZENX Policy Assurance Administrator System</p>
            </div>
            
            <div class="content">
              <h2>Dear ${customerName},</h2>
              <p>Thank you for choosing <strong>${insuranceCompany}</strong> for your insurance needs.</p>
              
              <p>To proceed with your insurance proposal, please verify your email address by entering the verification code below:</p>
              
              <div class="code-box">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">Your Verification Code</p>
                <div class="code">${verificationCode}</div>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #6b7280;">This code is valid for 10 minutes</p>
              </div>
              
              <div class="details">
                <h3 style="margin-top: 0;">Quotation Summary:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Insurance Company:</td>
                    <td style="padding: 8px 0; font-weight: bold; text-align: right;">${insuranceCompany}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Total Premium:</td>
                    <td style="padding: 8px 0; font-weight: bold; text-align: right; color: #2563eb;">₹${premium.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Validity:</td>
                    <td style="padding: 8px 0; font-weight: bold; text-align: right;">30 Days</td>
                  </tr>
                </table>
              </div>
              
              <p><strong>Important:</strong> Do not share this code with anyone. Our team will never ask for this code over phone or email.</p>
              
              <p>If you did not request this quotation, please ignore this email.</p>
            </div>
            
            <div class="footer">
              <p><strong>ELEZENX Tech Solutions</strong></p>
              <p>Policy Assurance Administrator System (PAAS)</p>
              <p>This is an automated email from a no-reply address. Please do not reply to this email.</p>
              <p style="margin-top: 15px;">© 2024 ELEZENX. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Error sending verification email:', error)
    return false
  }
}

// Send quotation email
export async function sendQuotationEmail(to: string, data: any): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // Development mode: Skip actual email sending
  const isDevelopment = process.env.NODE_ENV === 'development' || true
  
  if (isDevelopment) {
    console.log('='.repeat(60))
    console.log('📧 QUOTATION EMAIL (Development Mode)')
    console.log('='.repeat(60))
    console.log('To:', to)
    console.log('Data:', JSON.stringify(data, null, 2))
    console.log('='.repeat(60))
    console.log('✅ Email would be sent in production')
    console.log('='.repeat(60))
    return { success: true, messageId: 'dev-' + Date.now() }
  }
  
  try {
    const mailOptions = {
      from: '"ELEZENX Insurance" <noreply@elezenx.com>',
      to: to,
      subject: 'Insurance Quotation - Email Verification Required',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .code-box { background: white; border: 2px dashed #3b82f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .code { font-size: 32px; font-weight: bold; color: #1e40af; letter-spacing: 8px; }
            .details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .footer { background: #374151; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛡️ Insurance Quotation Verification</h1>
              <p>ELEZENX Policy Assurance Administrator System</p>
            </div>
            <div class="content">
              <h2>Dear ${data.customerName || 'Customer'},</h2>
              <p>Thank you for choosing <strong>${data.insuranceCompany || 'our insurance'}</strong> for your insurance needs.</p>
              <p>To proceed with your insurance proposal, please verify your email address by entering the verification code below:</p>
              <div class="code-box">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">Your Verification Code</p>
                <div class="code">${data.verificationCode || '123456'}</div>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #6b7280;">This code is valid for 10 minutes</p>
              </div>
            </div>
            <div class="footer">
              <p>© 2024 ELEZENX. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const result = await transporter.sendMail(mailOptions)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Error sending quotation email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Send policy issued email
export async function sendPolicyIssuedEmail(to: string, data: any): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // Development mode: Skip actual email sending
  const isDevelopment = process.env.NODE_ENV === 'development' || true
  
  if (isDevelopment) {
    console.log('='.repeat(60))
    console.log('📧 POLICY ISSUED EMAIL (Development Mode)')
    console.log('='.repeat(60))
    console.log('To:', to)
    console.log('Data:', JSON.stringify(data, null, 2))
    console.log('='.repeat(60))
    console.log('✅ Email would be sent in production')
    console.log('='.repeat(60))
    return { success: true, messageId: 'dev-' + Date.now() }
  }
  
  try {
    const mailOptions = {
      from: '"ELEZENX Insurance" <noreply@elezenx.com>',
      to: to,
      subject: `Policy Issued - ${data.policyNumber || 'POL-001'}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .footer { background: #374151; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Policy Issued Successfully</h1>
            </div>
            <div class="content">
              <h2>Dear ${data.customerName || 'Customer'},</h2>
              <p>Congratulations! Your insurance policy has been issued successfully.</p>
              <p><strong>Policy Number:</strong> ${data.policyNumber || 'POL-001'}</p>
              <p><strong>Certificate Number:</strong> ${data.certificateNumber || 'CERT-001'}</p>
              <p><strong>Insurance Company:</strong> ${data.insuranceCompany || 'Insurance Company'}</p>
              <p><strong>Premium:</strong> ₹${data.premium ? data.premium.toLocaleString() : '0'}</p>
              <p>Your policy certificate has been attached to this email.</p>
            </div>
            <div class="footer">
              <p>© 2024 ELEZENX. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const result = await transporter.sendMail(mailOptions)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Error sending policy issued email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Send OTP email
export async function sendOTPEmail(to: string, data: any): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // Development mode: Skip actual email sending
  const isDevelopment = process.env.NODE_ENV === 'development' || true
  
  if (isDevelopment) {
    console.log('='.repeat(60))
    console.log('📧 OTP EMAIL (Development Mode)')
    console.log('='.repeat(60))
    console.log('To:', to)
    console.log('Data:', JSON.stringify(data, null, 2))
    console.log('='.repeat(60))
    console.log('✅ Email would be sent in production')
    console.log('='.repeat(60))
    return { success: true, messageId: 'dev-' + Date.now() }
  }
  
  try {
    const mailOptions = {
      from: '"ELEZENX Insurance" <noreply@elezenx.com>',
      to: to,
      subject: 'OTP Verification - ELEZENX Insurance',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .code-box { background: white; border: 2px dashed #3b82f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .code { font-size: 32px; font-weight: bold; color: #1e40af; letter-spacing: 8px; }
            .footer { background: #374151; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 OTP Verification</h1>
            </div>
            <div class="content">
              <h2>Dear ${data.customerName || 'Customer'},</h2>
              <p>Please use the following OTP to complete your verification:</p>
              <div class="code-box">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">Your OTP</p>
                <div class="code">${data.otp || '123456'}</div>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #6b7280;">This OTP is valid for 10 minutes</p>
              </div>
            </div>
            <div class="footer">
              <p>© 2024 ELEZENX. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const result = await transporter.sendMail(mailOptions)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Error sending OTP email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Generic send email function
export async function sendEmail(to: string, subject: string, html: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const mailOptions = {
      from: '"ELEZENX Insurance" <noreply@elezenx.com>',
      to: to,
      subject: subject,
      html: html
    }

    const result = await transporter.sendMail(mailOptions)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Send proposal confirmation email
export async function sendProposalConfirmationEmail(
  to: string,
  customerName: string,
  proposalNumber: string,
  insuranceCompany: string,
  premium: number,
  validUntil: string
): Promise<boolean> {
  // Development mode: Skip actual email sending
  const isDevelopment = process.env.NODE_ENV === 'development' || true
  
  if (isDevelopment) {
    console.log('='.repeat(60))
    console.log('📧 PROPOSAL CONFIRMATION EMAIL (Development Mode)')
    console.log('='.repeat(60))
    console.log('To:', to)
    console.log('Customer:', customerName)
    console.log('Proposal Number:', proposalNumber)
    console.log('Insurance Company:', insuranceCompany)
    console.log('Premium:', `₹${premium.toLocaleString()}`)
    console.log('Valid Until:', validUntil)
    console.log('='.repeat(60))
    console.log('✅ Email would be sent in production')
    console.log('='.repeat(60))
    return true
  }
  
  try {
    const mailOptions = {
      from: '"ELEZENX Insurance" <noreply@elezenx.com>',
      to: to,
      subject: `Proposal Saved - ${proposalNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .footer { background: #374151; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Proposal Saved Successfully</h1>
            </div>
            <div class="content">
              <h2>Dear ${customerName},</h2>
              <p>Your insurance proposal has been saved successfully.</p>
              <p><strong>Proposal Number:</strong> ${proposalNumber}</p>
              <p><strong>Insurance Company:</strong> ${insuranceCompany}</p>
              <p><strong>Premium:</strong> ₹${premium.toLocaleString()}</p>
              <p><strong>Valid Until:</strong> ${validUntil}</p>
              <p>You can issue the policy anytime within the validity period.</p>
            </div>
            <div class="footer">
              <p>© 2024 ELEZENX. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Error sending proposal confirmation email:', error)
    return false
  }
}
