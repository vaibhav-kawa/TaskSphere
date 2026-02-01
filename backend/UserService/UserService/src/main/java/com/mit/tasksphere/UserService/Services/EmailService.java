package com.mit.tasksphere.UserService.Services;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.mit.tasksphere.UserService.Entities.User;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date; // Assuming entity dates might be java.util.Date

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender javaMailSender;

    /**
     * Helper method to convert a Date object to LocalDate for duration calculations.
     * Assuming getCheckInDate() / getCheckOutDate() return java.util.Date.
     * If your entities return java.time.LocalDate directly, this conversion can be simplified.
     */
    private LocalDate convertToLocalDate(Date dateToConvert) {
        return dateToConvert.toInstant()
          .atZone(ZoneId.systemDefault())
          .toLocalDate();
    }

    // Method to send a generic email (existing code)
    public void sendEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true indicates HTML content

            javaMailSender.send(message);
            logger.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Failed to send email to " + to, e);
        }
    }

    // 1] Welcome message for a new user
    public void sendWelcomeEmail(String name, String email) {

        String subject = "Welcome to TaskSphere — Let’s orchestrate your work";

        String htmlContent = String.format("""
            <html>
            <body style="margin:0; padding:0; background-color:hsl(220,33%%,98%%); font-family: Inter, Arial, sans-serif;">
                
                <table width="100%%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
                    <tr>
                        <td align="center">

                            <!-- Card -->
                            <table width="600" cellpadding="0" cellspacing="0"
                                style="background: linear-gradient(135deg, hsl(258,86%%,60%%), hsl(199,92%%,70%%));
                                       border-radius:24px;
                                       padding:1px;">
                                <tr>
                                    <td style="background:#ffffff; border-radius:23px; padding:36px;">

                                        <!-- Logo -->
                                        <h2 style="margin:0; font-family: 'Space Grotesk', Arial, sans-serif;
                                                   letter-spacing:-0.02em; color:hsl(258,86%%,60%%);">
                                            TaskSphere
                                        </h2>

                                        <p style="margin-top:20px; font-size:18px; color:#0f172a;">
                                            Welcome, <strong>%s</strong>
                                        </p>

                                        <p style="font-size:15px; line-height:1.6; color:#475569;">
                                            TaskSphere is your productivity OS for microservice-powered teams.
                                            Assign work, prioritise intelligently, and keep execution aligned — without context switching.
                                        </p>

                                        <!-- CTA -->
                                        <div style="margin:32px 0;">
                                            <a href="[YOUR_APP_URL]/workspace"
                                               style="background:hsl(258,86%%,60%%);
                                                      color:#ffffff;
                                                      padding:14px 28px;
                                                      text-decoration:none;
                                                      border-radius:12px;
                                                      font-weight:600;
                                                      display:inline-block;">
                                                Launch Workspace
                                            </a>
                                        </div>

                                        <!-- Feature bullets -->
                                        <ul style="padding-left:18px; color:#475569; font-size:14px;">
                                            <li>AI-prioritised sprints & execution</li>
                                            <li>Chat embedded directly into tasks</li>
                                            <li>Real-time notifications across microservices</li>
                                        </ul>

                                        <p style="font-size:12px; color:#94a3b8; margin-top:32px;">
                                            © 2025 TaskSphere Labs · Productivity for modern teams
                                        </p>

                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>
                </table>

            </body>
            </html>
            """, name);

        sendEmail(email, subject, htmlContent);
    }

    // 2] Forgot password email
    public void sendForgotPasswordEmail(String email, String name, String resetLink) {

        String subject = "Reset your TaskSphere password";

        String htmlContent = String.format("""
            <html>
            <body style="margin:0; padding:0; background-color:hsl(220,33%%,98%%); font-family: Inter, Arial, sans-serif;">

                <table width="100%%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
                    <tr>
                        <td align="center">

                            <table width="600" cellpadding="0" cellspacing="0"
                                style="background: linear-gradient(135deg, hsl(352,85%%,60%%), hsl(258,86%%,60%%));
                                       border-radius:24px;
                                       padding:1px;">
                                <tr>
                                    <td style="background:#ffffff; border-radius:23px; padding:36px;">

                                        <h2 style="margin:0;
                                                   font-family:'Space Grotesk', Arial, sans-serif;
                                                   letter-spacing:-0.02em;
                                                   color:hsl(352,85%%,60%%);">
                                            Password Reset
                                        </h2>

                                        <p style="margin-top:16px; font-size:15px; color:#334155;">
                                            Hi %s,
                                        </p>

                                        <p style="font-size:15px; line-height:1.6; color:#475569;">
                                            A request was made to reset your TaskSphere password.
                                            This link is time-limited and valid for security reasons.
                                        </p>

                                        <div style="margin:30px 0;">
                                            <a href="%s"
                                               style="background:hsl(352,85%%,60%%);
                                                      color:#ffffff;
                                                      padding:14px 28px;
                                                      text-decoration:none;
                                                      border-radius:12px;
                                                      font-weight:600;
                                                      display:inline-block;">
                                                Reset Password
                                            </a>
                                        </div>

                                        <p style="font-size:13px; color:#64748b;">
                                            If you didn’t request this, you can safely ignore this email.
                                            Your account remains secure.
                                        </p>

                                        <p style="font-size:12px; color:#94a3b8; margin-top:32px;">
                                            TaskSphere Security · © 2025
                                        </p>

                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>
                </table>

            </body>
            </html>
            """, name, resetLink);

        sendEmail(email, subject, htmlContent);
    }

    //3] Send Email for team invitation
    // 3] Send Email for team invitation
public void sendTeamInvitationEmail(String requesterEmail, String email, String name) {

    String subject = "You’ve been invited to join a TaskSphere team";

    String htmlContent = String.format("""
        <html>
        <body style="margin:0; padding:0; background-color:hsl(220,33%%,98%%); font-family: Inter, Arial, sans-serif;">

            <table width="100%%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
                <tr>
                    <td align="center">

                        <!-- Card -->
                        <table width="600" cellpadding="0" cellspacing="0"
                            style="background: linear-gradient(135deg, hsl(199,92%%,70%%), hsl(258,86%%,60%%));
                                   border-radius:24px;
                                   padding:1px;">
                            <tr>
                                <td style="background:#ffffff; border-radius:23px; padding:36px;">

                                    <!-- Logo -->
                                    <h2 style="margin:0;
                                               font-family:'Space Grotesk', Arial, sans-serif;
                                               letter-spacing:-0.02em;
                                               color:hsl(258,86%%,60%%);">
                                        TaskSphere
                                    </h2>

                                    <p style="margin-top:20px; font-size:16px; color:#0f172a;">
                                        Hello <strong>%s</strong>,
                                    </p>

                                    <p style="font-size:15px; line-height:1.6; color:#475569;">
                                        <strong>%s</strong> has invited you to join their team on TaskSphere.
                                        Collaborate on tasks, track progress, and execute faster — all in one workspace.
                                    </p>

                                    <!-- CTA -->
                                    <div style="margin:32px 0;">
                                        <a href="[YOUR_APP_URL]/invitations"
                                           style="background:hsl(258,86%%,60%%);
                                                  color:#ffffff;
                                                  padding:14px 28px;
                                                  text-decoration:none;
                                                  border-radius:12px;
                                                  font-weight:600;
                                                  display:inline-block;">
                                            Accept Invitation
                                        </a>
                                    </div>

                                    <p style="font-size:13px; color:#64748b;">
                                        If you weren’t expecting this invitation, you can safely ignore this email.
                                        No action is required.
                                    </p>

                                    <p style="font-size:12px; color:#94a3b8; margin-top:32px;">
                                        © 2025 TaskSphere Labs · Team collaboration, simplified
                                    </p>

                                </td>
                            </tr>
                        </table>

                    </td>
                </tr>
            </table>

        </body>
        </html>
        """, name, requesterEmail);

    sendEmail(email, subject, htmlContent);
}

    }