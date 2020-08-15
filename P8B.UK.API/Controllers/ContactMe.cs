using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using P8B.Core.CSharp.Models;
using P8B.UK.API.Database.Models;
using P8B.UK.API.Services;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;

namespace P8B.UK.API.Controllers
{
   [Route("[controller]")]
   public class ContactMeController : Controller
   {
      private EmailSettings _EmailSettings { get; }
      private EmailService EmailService
      {
         get => new EmailService(_EmailSettings);
      }
      private List<Error> ErrorsList = new List<Error>();

      public ContactMeController(EmailSettings es)
      {
         _EmailSettings = es;
      }

      #region *** Extra Attributes ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      //[ValidateAntiForgeryToken]
      #endregion
      [HttpPost("PostMessege")]
      public async Task<IActionResult> PostMessage([FromBody] ContactMe contactMe)
      {
         try
         {
            ModelState.Clear();
            /// if model validation failed
            if (!TryValidateModel(contactMe))
            {
               AppFunc.ExtractErrors(ModelState, ref ErrorsList);
               /// return bad request with all the errors
               return UnprocessableEntity(ErrorsList);
            }
            /// ch
            await EmailService.SendEmailAsync("majid.joveini@gmail.com", $"{contactMe.Subject}", $"Email: {contactMe.Email}\nName:{contactMe.Name}\n\n{contactMe.Messege}").ConfigureAwait(false);
            return Ok("Thank you for your messege. I will get back to you soon.");
         }
         catch (Exception)
         {
            /// Add the error below to the error list and return bad request
            AppFunc.Error(ref ErrorsList, AppConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
