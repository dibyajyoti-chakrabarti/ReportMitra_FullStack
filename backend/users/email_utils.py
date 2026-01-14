from django.core.mail import send_mail
from django.conf import settings

def send_otp_email(email, otp):
    """Send OTP email with beautiful HTML template"""
    
    subject = 'ReportMitra Login OTP'
    
    html_message = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ReportMitra - Login OTP</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f0f0f;">
        <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #0f0f0f;">
            <tr>
                <td align="center" style="padding: 60px 20px;">
                    <!-- Main Container -->
                    <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.15); box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);">
                        
                        <!-- Header -->
                        <tr>
                            <td style="padding: 50px 40px 36px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.12);">
                                <!-- Logo Badge with "RM" -->
                                <div style="width: 100px; height: 100px; margin: 0 auto 28px; background: linear-gradient(135deg, #ffffff 0%, #e8e8e8 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 4px solid rgba(255, 255, 255, 0.3); box-shadow: 0 12px 35px rgba(255, 255, 255, 0.2);">
                                    <table role="presentation" style="width: 100%; height: 100%;">
                                        <tr>
                                            <td style="text-align: center; vertical-align: middle;">
                                                <span style="font-size: 42px; font-weight: 900; color: #000000; letter-spacing: -2px; font-family: 'Helvetica Neue', Arial, sans-serif;">RM</span>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <h1 style="margin: 0 0 12px; color: #ffffff; font-size: 38px; font-weight: 700; letter-spacing: -1px; text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);">
                                    ReportMitra
                                </h1>
                                <p style="margin: 0; color: rgba(255, 255, 255, 0.65); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 3px;">
                                    CIVIC · CONNECT · RESOLVE
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 48px 40px;">
                                <!-- Title -->
                                <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 28px; font-weight: 600; text-align: center; letter-spacing: -0.5px;">
                                    Your Login Code
                                </h2>
                                
                                <!-- Description -->
                                <p style="margin: 0 0 36px; color: rgba(255, 255, 255, 0.75); font-size: 16px; line-height: 1.7; text-align: center;">
                                    Enter this code to securely access your ReportMitra account.<br/>
                                    This code is valid for <span style="color: #ffffff; font-weight: 700; background: rgba(255, 255, 255, 0.1); padding: 3px 10px; border-radius: 5px;">10 minutes</span>.
                                </p>
                                
                                <!-- OTP Code Box -->
                                <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%); border: 3px solid rgba(255, 255, 255, 0.25); border-radius: 20px; padding: 38px 28px; text-align: center; margin: 0 0 40px; box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);">
                                    <div style="font-size: 52px; font-weight: 900; color: #ffffff; letter-spacing: 18px; font-family: 'Courier New', monospace; text-shadow: 0 2px 12px rgba(255, 255, 255, 0.3);">
                                        {otp}
                                    </div>
                                </div>
                                
                                <!-- Divider -->
                                <div style="height: 1px; background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%); margin: 40px 0;"></div>
                                
                                <!-- Security Notice -->
                                <div style="background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%); border: 2px solid rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 28px 32px; margin: 0 0 28px; text-align: center;">
                                    <p style="margin: 0 0 12px; color: #ffffff; font-size: 16px; font-weight: 700; letter-spacing: 0.5px;">
                                        SECURITY ALERT
                                    </p>
                                    <p style="margin: 0; color: rgba(255, 255, 255, 0.85); font-size: 14px; line-height: 1.7;">
                                        Never share this code with anyone. ReportMitra staff will never ask for your login code via email, phone, or any other channel.
                                    </p>
                                </div>
                                
                                <!-- Help Text -->
                                <p style="margin: 0; color: rgba(255, 255, 255, 0.65); font-size: 14px; line-height: 1.7; text-align: center;">
                                    If you didn't request this code, please ignore this email or contact our support team immediately.
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background: rgba(255, 255, 255, 0.04); padding: 36px 40px; border-radius: 0 0 20px 20px; border-top: 1px solid rgba(255, 255, 255, 0.12);">
                                <table role="presentation" style="width: 100%;">
                                    <tr>
                                        <td style="text-align: center;">
                                            <p style="margin: 0 0 14px; color: rgba(255, 255, 255, 0.7); font-size: 13px; line-height: 1.6; font-weight: 500;">
                                                Secure government portal · All activities are monitored
                                            </p>
                                            <p style="margin: 0 0 18px; color: rgba(255, 255, 255, 0.55); font-size: 12px;">
                                                © 2025 ReportMitra · Government of India
                                            </p>
                                            <div style="height: 1px; background: rgba(255, 255, 255, 0.15); margin: 18px auto; max-width: 200px;"></div>
                                            <p style="margin: 0; color: rgba(255, 255, 255, 0.65); font-size: 12px;">
                                                Need help? <a href="mailto:support@reportmitra.in" style="color: #ffffff; text-decoration: none; font-weight: 600; border-bottom: 1px solid rgba(255, 255, 255, 0.4);">support@reportmitra.in</a>
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        
                    </table>
                    
                    <!-- Bottom Text -->
                    <p style="margin: 28px 0 0; color: rgba(255, 255, 255, 0.5); font-size: 12px; text-align: center; line-height: 1.7;">
                        This email was sent to <span style="color: rgba(255, 255, 255, 0.75); font-weight: 600;">{email}</span><br/>
                        <span style="color: rgba(255, 255, 255, 0.45); font-size: 11px;">ReportMitra · Ministry of Urban Development · Government of India</span>
                    </p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    
    plain_message = f"""
    ═══════════════════════════════════════════════════
    REPORTMITRA - LOGIN OTP
    ═══════════════════════════════════════════════════
    
    Your secure login code is:
    
    ┌─────────────────────┐
    │      {otp}       │
    └─────────────────────┘
    
    This code will expire in 10 minutes.
    
    ───────────────────────────────────────────────────
    SECURITY ALERT
    ───────────────────────────────────────────────────
    
    Never share this code with anyone. ReportMitra staff
    will never ask for your login code.
    
    If you didn't request this code, please ignore this
    email or contact support immediately.
    
    ───────────────────────────────────────────────────
    
    Need help? support@reportmitra.in
    
    © 2025 ReportMitra
    Government of India · Ministry of Urban Development
    
    Secure government portal · All activities monitored
    ═══════════════════════════════════════════════════
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