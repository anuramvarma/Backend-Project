const nodemailer = require('nodemailer');
// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER || 'anuramvarma811@gmail.com', // Replace with your email
    pass: process.env.EMAIL_PASS || 'evva qwiu kmoh xyle' // Replace with your app password
  }
});

// Welcome email template
const createWelcomeEmailTemplate = (userName) => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Our Platform</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 20px;
      background-color: #f4f4f4;
    }

    .container {
      max-width: 640px;
      margin: auto;
      background: #fff;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    }

    header {
      text-align: center;
      background: linear-gradient(135deg, #74ebd5, #ACB6E5);
      color: white;
      padding: 25px;
      border-radius: 10px;
      margin-bottom: 30px;
    }

    header h1 {
      margin: 0;
      font-size: 30px;
    }

    main {
      padding: 0 10px;
    }

    h2 {
      font-size: 22px;
      margin-bottom: 10px;
    }

    .highlight {
      background: linear-gradient(135deg, #74ebd5, #ACB6E5);
      color: white;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      font-weight: bold;
      margin: 20px 0;
    }

    ul {
      padding-left: 20px;
    }

    li {
      margin-bottom: 8px;
    }

    .button {
      display: inline-block;
      background: linear-gradient(135deg, #007BFF, #00c6ff);
      color: white;
      padding: 12px 25px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      transition: background 0.3s ease;
    }

    .button:hover,
    .button:focus {
      background: linear-gradient(135deg, #0056b3, #0096c7);
      outline: none;
    }

    footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      color: #666;
      font-size: 14px;
    }

    @media (max-width: 480px) {
      .container {
        padding: 20px;
      }

      header h1 {
        font-size: 24px;
      }

      h2 {
        font-size: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🎉 Welcome</h1>
    </header>

    <main>
      <section>
        <h2>Hello ${userName}!</h2>
        <p>Thank you for joining our platform! We're thrilled to have you in our community.</p>

        <div class="highlight">
          Your account has been successfully created. You're all set to begin!
        </div>

        <p>Here's what you can do next:</p>
        <ul>
          <li>✅ Complete your profile setup</li>
          <li>✅ Explore our features and services</li>
          <li>✅ Connect with other users</li>
          <li>✅ Start your journey with us</li>
        </ul>

        <p>If you have any questions or need assistance, our support team is just a click away.</p>

        <div style="text-align: center;">
          <a href="#" class="button">Get Started</a>
        </div>
      </section>
    </main>

    <footer>
      <p>Best regards,<br> Anuram Varma</p>
      <p><small>This is an automated message. Please do not reply to this email.</small></p>
    </footer>
  </div>
</body>
</html>
  `;
};



// Function to send welcome email
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: userEmail,
      subject: '🎉 Welcome to Our Platform!',
      html: createWelcomeEmailTemplate(userName)
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};



// Function to verify email configuration
const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    return false;
  }
};


module.exports = {
  sendWelcomeEmail,
  verifyEmailConfig,
  transporter
};
