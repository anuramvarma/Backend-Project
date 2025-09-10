// Test script for email functionality
require('dotenv').config();
const { sendWelcomeEmail, verifyEmailConfig } = require('./emailService');

async function testEmail() {
  console.log('🧪 Testing Email Configuration...\n');
  
  // Test email configuration
  const configValid = await verifyEmailConfig();
  
  if (configValid) {
    console.log('✅ Email configuration is valid\n');
    
    console.log('📧 Testing welcome email...');
    const testEmail = 'test@example.com'; 
    const testName = 'Test User';
    
    const result = await sendWelcomeEmail(testEmail, testName);
    
    if (result.success) {
      console.log('✅ Welcome email sent successfully!');
      console.log('📧 Message ID:', result.messageId);
    } else {
      console.log('❌ Failed to send welcome email:', result.error);
    }
  } else {
    console.log('❌ Email configuration is invalid');
    console.log('Please check your .env file and email credentials');
  }
}

// Run the test
testEmail().catch(console.error);
