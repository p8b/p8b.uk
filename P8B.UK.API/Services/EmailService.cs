using MimeKit;
using MailKit.Net.Smtp;
using P8B.Core.CSharp.Models;
using P8B.Core.CSharp.Models.Interfaces;

using System.Threading.Tasks;
using System.Net.Security;
using MailKit.Security;

namespace P8B.UK.API.Services
{
   public class EmailService : IEmailService
   {

      #region *** properties ***
      private EmailSettings _EmailSettings { get; }
      #endregion

      public EmailService() { }
      public EmailService(EmailSettings es)
      {
         _EmailSettings = es;
      }

      /// <summary>
      ///     this method is used to send emails by using the email settings passed to this class
      /// </summary>
      /// <param name="email">the receiver email</param>
      /// <param name="subject">subject of the email</param>
      /// <param name="messege">the body of the email which can include html tags</param>
      /// <returns>void</returns>
      public async Task SendEmailAsync(string email, string subject, string messege)
      {
         /// Create a MineMessage object to setup an instance of email to be send
         MimeMessage message = new MimeMessage();

         /// Add the email settings for the sender of the email
         message.From.Add(new MailboxAddress(_EmailSettings.SenderName, _EmailSettings.Sender));

         /// Add the destination email to the message
         message.To.Add(new MailboxAddress("p8b", email));

         /// Add the subject of the email
         message.Subject = subject;

         /// Set the body of the email and type
         TextPart body = new TextPart("plain")
         {
            Text = messege
         };

         /// Create a multi part email body in order to enable attachment
         Multipart multiPartEmail = new Multipart("Mail");
         /// Add the body to the multi part email
         multiPartEmail.Add(body);

         /// Set the message body to the value of multi part email
         message.Body = multiPartEmail;

         /// Create a disposable "SmtpClient" object in order to send the email
         using (SmtpClient client = new SmtpClient())
         {
            /// call back method that validates the server certificate for security purposes
            client.ServerCertificateValidationCallback = (sender, certificate, chain, errors) =>
            {
               /// if there are no errors in the certificate then validate the check
               if (errors == SslPolicyErrors.None || !_EmailSettings.SslCheck)
                  return true;
               /// else the certificate is either a self-signed or has errors
               /// which both should be denied
               return false;
            };

            /// Try connecting to the smtp server using SSL connection
            await client.ConnectAsync(
                _EmailSettings.MailServer,
                _EmailSettings.MailPort,
                SecureSocketOptions.SslOnConnect).ConfigureAwait(false);

            /// Pass the authentication information to the connected server to perform outgoing email request
            await client.AuthenticateAsync(_EmailSettings.Sender, _EmailSettings.Password);

            /// use the smtp client to send the email
            await client.SendAsync(message);

            /// disconnect the smpt client connection
            await client.DisconnectAsync(true);
         }

      }
   }
}
