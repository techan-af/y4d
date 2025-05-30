interface EmailData {
  to: string
  subject: string
  html: string
}

export async function sendEmail(emailData: EmailData) {
  try {
    // For now, we'll log the email content
    // You can replace this with your preferred email service (SendGrid, Resend, etc.)
    console.log("📧 EMAIL NOTIFICATION:")
    console.log("To:", emailData.to)
    console.log("Subject:", emailData.subject)
    console.log("Content:", emailData.html)

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return { success: true, message: "Email sent successfully" }
  } catch (error) {
    console.error("Email sending failed:", error)
    return { success: false, message: "Failed to send email" }
  }
}

export function generateApprovalEmail(beneficiaryName: string, projectTitle: string) {
  return {
    subject: `🎉 Your Application has been Approved - ${projectTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .success-icon { font-size: 48px; margin-bottom: 20px; }
          .button { background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">✅</div>
            <h1>Congratulations ${beneficiaryName}!</h1>
            <p>Your application has been approved</p>
          </div>
          <div class="content">
            <h2>Great News!</h2>
            <p>We are pleased to inform you that your application for the <strong>${projectTitle}</strong> program has been <strong>approved</strong>.</p>
            
            <h3>What happens next?</h3>
            <ul>
              <li>Our team will contact you within 2-3 business days</li>
              <li>You will receive detailed information about the program schedule</li>
              <li>Please keep your documents ready for verification</li>
              <li>Attend the orientation session (details will be shared soon)</li>
            </ul>
            
            <h3>Important Information:</h3>
            <p>Please ensure your contact details are up to date. If you have any questions or need to update your information, please contact us immediately.</p>
            
            <a href="#" class="button">View Program Details</a>
            
            <p><strong>Contact Information:</strong><br>
            📧 Email: support@y4dngo.org<br>
            📞 Phone: +91 98765 43210<br>
            🕒 Office Hours: Monday to Friday, 9:00 AM - 6:00 PM</p>
          </div>
          <div class="footer">
            <p>Thank you for choosing Y4D NGO. Together, we can make a difference!</p>
            <p>© 2024 Y4D NGO. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }
}

export function generateRejectionEmail(beneficiaryName: string, projectTitle: string) {
  return {
    subject: `Application Update - ${projectTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-icon { font-size: 48px; margin-bottom: 20px; }
          .button { background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="info-icon">📋</div>
            <h1>Application Update</h1>
            <p>Regarding your application for ${projectTitle}</p>
          </div>
          <div class="content">
            <p>Dear ${beneficiaryName},</p>
            
            <p>Thank you for your interest in the <strong>${projectTitle}</strong> program. After careful review of your application, we regret to inform you that we are unable to approve your application at this time.</p>
            
            <h3>Why was my application not approved?</h3>
            <p>Applications may not be approved due to various reasons including:</p>
            <ul>
              <li>Program capacity has been reached</li>
              <li>Eligibility criteria not fully met</li>
              <li>Incomplete or missing documentation</li>
              <li>Geographic limitations of the program</li>
            </ul>
            
            <h3>What can I do next?</h3>
            <ul>
              <li>Apply for other programs that may be suitable for you</li>
              <li>Contact us to understand specific reasons for your application</li>
              <li>Reapply when the next enrollment period opens</li>
              <li>Ensure all eligibility criteria are met for future applications</li>
            </ul>
            
            <p>We encourage you to explore other opportunities with Y4D NGO. Our team is committed to supporting community development and may have other programs that align with your needs.</p>
            
            <a href="#" class="button">View Other Programs</a>
            
            <p><strong>Contact Information:</strong><br>
            📧 Email: support@y4dngo.org<br>
            📞 Phone: +91 98765 43210<br>
            🕒 Office Hours: Monday to Friday, 9:00 AM - 6:00 PM</p>
          </div>
          <div class="footer">
            <p>Thank you for your interest in Y4D NGO programs.</p>
            <p>© 2024 Y4D NGO. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }
}
