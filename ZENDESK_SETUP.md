# 🎯 Zendesk Integration Setup Guide

## 📋 Prerequisites

1. **Zendesk Account**: You need an active Zendesk Support account
2. **API Access**: API token enabled in your Zendesk settings
3. **Subdomain**: Your Zendesk subdomain (e.g., `company.zendesk.com`)

## 🔧 Environment Variables Setup

### 1. Create `.env` file
Create a `.env` file in your project root directory:

```bash
# In your project root
touch .env
```

### 2. Add Required Variables
Copy these variables to your `.env` file:

```env
# API Configuration
API_KEY=your_api_key_here
BASE_URL=https://api-dev.example.com

# Zendesk Configuration
ZENDESK_SUBDOMAIN=your-subdomain-here
ZENDESK_API_TOKEN=your_zendesk_api_token_here
ZENDESK_EMAIL=support@yourdomain.com
ZENDESK_BASE_URL=https://your-subdomain.zendesk.com

# Development/Production Flags
NODE_ENV=development
```

## 🔑 Getting Zendesk Credentials

### 1. Zendesk Subdomain
- Go to your Zendesk admin panel
- Your subdomain is in the URL: `https://company.zendesk.com`
- Use `company` as your `ZENDESK_SUBDOMAIN`

### 2. API Token
1. Go to **Admin** → **Channels** → **API**
2. Enable **Token Access**
3. Click **Add API token**
4. Give it a name (e.g., "cKash Mobile App")
5. Copy the generated token
6. Use this as your `ZENDESK_API_TOKEN`

### 3. Support Email
- Use the email address associated with your Zendesk account
- This should be the same email used to generate the API token

## 📱 How It Works

### Contact Form Flow:
1. User fills out contact form (name, email, message)
2. Form submits to Zendesk API
3. Creates/updates user in Zendesk
4. Creates support ticket linked to user
5. Shows success confirmation

### Ticket Details:
- **Subject**: "Support Request from [Name]"
- **Description**: Formatted message with user details
- **Priority**: Normal (configurable)
- **Tags**: `ckash-app`, `contact-form`, `mobile-app`
- **Custom Fields**: Source tracking, user info

## 🚀 Testing the Integration

### 1. Test with Development Credentials
```env
ZENDESK_SUBDOMAIN=ckash-support
ZENDESK_API_TOKEN=development_token
ZENDESK_EMAIL=support@ckash.app
ZENDESK_BASE_URL=https://ckash-support.zendesk.com
```

### 2. Test Ticket Creation
1. Navigate to Help → Contact in the app
2. Fill out the form
3. Submit and check Zendesk for the ticket
4. Verify user creation and ticket linking

## 🔒 Security Notes

- ✅ `.env` file is already in `.gitignore`
- ✅ API tokens are never exposed in client code
- ✅ All requests use HTTPS
- ✅ Authentication via Basic Auth with token

## 🐛 Troubleshooting

### Common Issues:

1. **"Zendesk API error: 401"**
   - Check API token is correct
   - Verify email matches token owner

2. **"Zendesk API error: 404"**
   - Verify subdomain is correct
   - Check base URL format

3. **"Failed to create support ticket"**
   - Check network connectivity
   - Verify Zendesk account is active

### Debug Mode:
Enable console logging by checking the browser console or React Native debugger for detailed error messages.

## 📚 Additional Resources

- [Zendesk API Documentation](https://developer.zendesk.com/api-reference/)
- [Zendesk API Authentication](https://developer.zendesk.com/api-reference/introduction/security-and-auth/)
- [React Native Environment Variables](https://docs.expo.dev/guides/environment-variables/)

## 🎉 Success Indicators

When everything is working correctly:
- ✅ Contact form submits without errors
- ✅ Success modal shows "Ticket Created"
- ✅ Ticket appears in Zendesk admin panel
- ✅ User is created/updated in Zendesk
- ✅ Ticket includes all form data and metadata
