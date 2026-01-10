# users/email_utils.py
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def send_otp_email(email, otp):
    """Send OTP email with beautiful HTML template"""
    
    subject = f'Your ReportMitra Login Code: {otp}'
    
    # HTML email template
    html_message = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ReportMitra - Login Code</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
            <tr>
                <td align="center" style="padding: 40px 20px;">
                    <!-- Main Container -->
                    <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                                <div style="background-color: #ffffff; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: inline-flex; align-items: center; justify-content: center;">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#000000" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M2 17L12 22L22 17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M2 12L12 17L22 12" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                    ReportMitra
                                </h1>
                                <p style="margin: 8px 0 0; color: #e5e5e5; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
                                    CIVIC | CONNECT | RESOLVE
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 50px 40px;">
                                <h2 style="margin: 0 0 24px; color: #1a1a1a; font-size: 24px; font-weight: 600; text-align: center;">
                                    Your Login Code
                                </h2>
                                
                                <p style="margin: 0 0 32px; color: #4a5568; font-size: 16px; line-height: 1.6; text-align: center;">
                                    Use this code to complete your login to ReportMitra. This code will expire in <strong>10 minutes</strong>.
                                </p>
                                
                                <!-- OTP Code Box -->
                                <div style="background: linear-gradient(135deg, #f7f7f7 0%, #e8e8e8 100%); border: 3px solid #000000; border-radius: 12px; padding: 30px; text-align: center; margin: 0 0 32px;">
                                    <div style="font-size: 48px; font-weight: 800; color: #000000; letter-spacing: 12px; font-family: 'Courier New', monospace;">
                                        {otp}
                                    </div>
                                </div>
                                
                                <!-- Security Notice -->
                                <div style="background-color: #fff5f5; border-left: 4px solid #ef4444; padding: 16px 20px; border-radius: 6px; margin: 0 0 24px;">
                                    <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.5;">
                                        <strong>⚠️ Security Notice:</strong> Never share this code with anyone. ReportMitra staff will never ask for your login code.
                                    </p>
                                </div>
                                
                                <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center;">
                                    If you didn't request this code, you can safely ignore this email.
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f9fafb; padding: 30px 40px; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
                                <p style="margin: 0 0 12px; color: #6b7280; font-size: 13px; text-align: center; line-height: 1.5;">
                                    This is a secure government portal. All activities are monitored and logged.
                                </p>
                                <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                                    © 2025 ReportMitra • Government of India • Ministry of Urban Development
                                </p>
                            </td>
                        </tr>
                        
                    </table>
                    
                    <!-- Bottom Spacer -->
                    <p style="margin: 24px 0 0; color: #9ca3af; font-size: 12px; text-align: center;">
                        Need help? Contact us at support@reportmitra.in
                    </p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    
    # Plain text fallback
    plain_message = f"""
    ReportMitra - Your Login Code
    
    Your login code is: {otp}
    
    This code will expire in 10 minutes.
    
    If you didn't request this code, you can safely ignore this email.
    
    ---
    ReportMitra
    Government of India
    Ministry of Urban Development
    """
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Failed to send OTP email: {e}")
        return False