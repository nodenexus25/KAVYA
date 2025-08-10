const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('Email transporter ready:', success);
  }
});

// Email templates
const emailTemplates = {
  contact: (data) => ({
    subject: `Contact Form: ${data.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Message:</strong></p>
          <p style="background-color: #fff; padding: 10px; border-left: 3px solid #007bff;">${data.message}</p>
        </div>
      </div>
    `
  }),

  quote: (data) => ({
    subject: `Quote Request from ${data.companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Quote Request</h2>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
          <p><strong>Company:</strong> ${data.companyName}</p>
          <p><strong>Contact:</strong> ${data.contactName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Industry:</strong> ${data.industry}</p>
          <p><strong>Product Interest:</strong> ${data.productInterest}</p>
          <p><strong>Quantity:</strong> ${data.quantity}</p>
          <p><strong>Requirements:</strong></p>
          <p style="background-color: #fff; padding: 10px; border-left: 3px solid #28a745;">${data.requirements}</p>
        </div>
      </div>
    `
  }),

  registration: (data) => ({
    subject: `New Registration: ${data.companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Registration</h2>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
          <p><strong>Company:</strong> ${data.companyName}</p>
          <p><strong>Contact:</strong> ${data.contactName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Address:</strong> ${data.address}, ${data.city}, ${data.state} ${data.zipCode}</p>
          <p><strong>Business Type:</strong> ${data.businessType}</p>
        </div>
      </div>
    `
  }),

  confirmation: (data) => ({
    subject: 'Thank you for contacting Kavya International',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Thank You!</h2>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
          <p>Dear ${data.name || data.contactName},</p>
          <p>Thank you for reaching out to Kavya International. We have received your inquiry and our team will get back to you shortly.</p>
          <p>If you have any urgent questions, please don't hesitate to contact us at sales@kavyaint.com</p>
          <p>Best regards,<br>Kavya International Team</p>
        </div>
      </div>
    `
  })
};

// Email service functions
const emailService = {
  async sendContactEmail(data) {
    const template = emailTemplates.contact(data);
    
    const mailOptions = {
      from: `"Kavya International" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO,
      replyTo: data.email,
      ...template
    };

    const confirmationMailOptions = {
      from: `"Kavya International" <${process.env.EMAIL_FROM}>`,
      to: data.email,
      ...emailTemplates.confirmation(data)
    };

    await transporter.sendMail(mailOptions);
    await transporter.sendMail(confirmationMailOptions);
  },

  async sendQuoteEmail(data) {
    const template = emailTemplates.quote(data);
    
    const mailOptions = {
      from: `"Kavya International" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO,
      replyTo: data.email,
      ...template
    };

    const confirmationMailOptions = {
      from: `"Kavya International" <${process.env.EMAIL_FROM}>`,
      to: data.email,
      ...emailTemplates.confirmation(data)
    };

    await transporter.sendMail(mailOptions);
    await transporter.sendMail(confirmationMailOptions);
  },

  async sendRegistrationEmail(data) {
    const template = emailTemplates.registration(data);
    
    const mailOptions = {
      from: `"Kavya International" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO,
      replyTo: data.email,
      ...template
    };

    const confirmationMailOptions = {
      from: `"Kavya International" <${process.env.EMAIL_FROM}>`,
      to: data.email,
      ...emailTemplates.confirmation(data)
    };

    await transporter.sendMail(mailOptions);
    await transporter.sendMail(confirmationMailOptions);
  }
};

module.exports = emailService;
