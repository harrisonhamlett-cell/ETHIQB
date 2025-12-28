// Email service for sending invitations
// In production, this would integrate with SendGrid, AWS SES, or similar

export interface InviteEmailData {
  recipientEmail: string;
  recipientName: string;
  companyRelationship: string;
  userType: 'advisor' | 'company' | 'admin';
  advisorLearnMoreUrl: string;
}

export class EmailService {
  /**
   * Send invitation email to new user
   * In production, this would make an API call to your email service
   */
  static async sendInviteEmail(data: InviteEmailData): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate email
      if (!data.recipientEmail || !data.recipientEmail.includes('@')) {
        return { success: false, error: 'Invalid email address' };
      }

      // Validate required fields
      if (!data.recipientName) {
        return { success: false, error: 'Recipient name is required' };
      }

      if (!data.companyRelationship) {
        return { success: false, error: 'Company relationship is required' };
      }

      // In production, you would make an API call here:
      // const response = await fetch('/api/send-invite', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });

      // For demo purposes, we'll simulate the email being sent
      console.log('📧 INVITE EMAIL SENT (MOCK)');
      console.log('═══════════════════════════════════════');
      console.log(`To: ${data.recipientEmail}`);
      console.log(`Subject: ${data.companyRelationship} invited you to collaborate on EthIQ Board`);
      console.log('');
      console.log(`Hello ${data.recipientName},`);
      console.log('');
      console.log(`${data.companyRelationship} has invited you to collaborate on EthIQ Board to manage your relationship and engagement as ${data.userType === 'advisor' ? 'an Advisor' : 'a Company'}.`);
      console.log('');
      console.log(`Learn more about EthIQ: ${data.advisorLearnMoreUrl}`);
      console.log('');
      console.log('To get started, log in to your EthIQ account with the credentials provided by your administrator.');
      console.log('');
      console.log('Best regards,');
      console.log('The EthIQ Team');
      console.log('═══════════════════════════════════════');

      // Show browser alert for demo purposes
      alert(
        `📧 Invitation Email Sent!\n\n` +
        `To: ${data.recipientEmail}\n` +
        `From: ${data.companyRelationship}\n\n` +
        `In production, this would send a real email. Check the browser console to see the email content.`
      );

      return { success: true };
    } catch (error) {
      console.error('Error sending invite email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send email' 
      };
    }
  }

  /**
   * Generate a temporary password for new users
   * In production, you would use a more secure method
   */
  static generateTemporaryPassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}
