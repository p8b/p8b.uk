using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Mime;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using P8B.Core.CSharp;
using P8B.Core.CSharp.Extentions;
using P8B.Core.CSharp.Models;
using P8B.Core.CSharp.Models.Overrides;
using P8B.UK.API.Database;
using P8B.UK.API.Database.Models;

namespace P8B.UK.API.Controllers
{

   [Route("[controller]")]
   public class UserController : ControllerBase
   {
      private readonly AppDbContext _DbContext;
      private readonly UserManager<User> _UserManager;
      private readonly AuthManager<User> _AuthManager;
      private List<Error> ErrorsList = new List<Error>();

      public UserController(AppDbContext db,
        UserManager<User> um, AuthManager<User> am)
      {
         _DbContext = db;
         _UserManager = um;
         _AuthManager = am;
      }
      private bool isUserCreated { get; set; } = false;

      /// <summary>
      ///     Create a new Customer
      /// </summary>
      #region *** 201 Created, 422 UnprocessableEntity, 412 PreconditionFailed, 417 ExpectationFailed ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status201Created)]
      [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
      [ProducesResponseType(StatusCodes.Status412PreconditionFailed)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      [ValidateAntiForgeryToken]
      #endregion
      [HttpPost("Post/NewCustomer")]
      //[Authorize(oAppConst.AccessPolicies.LevelOne)]  /// Ready For Test
      public async Task<IActionResult> NewCustomer([FromBody] User newUser)
      {
         try
         {
            var test = CoreConst.AccessClaims.Customer;
            newUser.Role = await _DbContext.Roles.AsTracking()
                .FirstOrDefaultAsync(r => r.AccessClaim.Equals(CoreConst.AccessClaims.Customer))
                .ConfigureAwait(false);

            IActionResult result = await CreateUser(newUser).ConfigureAwait(false);

            if (isUserCreated)
            {
               //await EmailService
               //   .EmailConfirmationAsync(newUser, DateTime.UtcNow.AddYears(2))
               //   .ConfigureAwait(false);
               await _AuthManager.SignInAsync(newUser, false).ConfigureAwait(false);
            }
            else
            {
               return result;
            }

            newUser.TempPassword = string.Empty;

            return Created("", newUser);
         }
         catch (Exception ee) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            AppFunc.Error(ref ErrorsList, AppConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      ///     Create a new User
      /// </summary>
      private async Task<IActionResult> CreateUser(User newUser)
      {
         try
         {
            newUser.PasswordHash = newUser.TempPassword;
            if (newUser.RegistrationMethod.Type != CoreConst.RegistrationTypes.Application)
               newUser.PasswordHash = CoreFunc.PasswordGenerator(20, 5, 5, 5, 5);
            ModelState.Clear();
            /// if model validation failed
            if (!TryValidateModel(newUser))
            {
               AppFunc.ExtractErrors(ModelState, ref ErrorsList);
               /// return bad request with all the errors
               return UnprocessableEntity(ErrorsList);
            }
            /// check the database to see if a user with the same email exists
            if (_DbContext.Users.Any(d => d.Email == newUser.Email))
            {
               /// extract the errors and return bad request containing the errors
               AppFunc.Error(ref ErrorsList, "Email already exists.");
               return StatusCode(412, ErrorsList);
            }
            /// Create the new user
            IdentityResult newUserResult = await _UserManager.CreateAsync(newUser, newUser.PasswordHash)
                                                            .ConfigureAwait(false);
            /// If result failed
            if (!newUserResult.Succeeded)
            {
               /// Add the error below to the error list and return bad request
               foreach (var error in newUserResult.Errors)
               {
                  AppFunc.Error(ref ErrorsList, error.Description, error.Code);
               }
               return StatusCode(417, ErrorsList);
            }
            /// else result is successful the try to add the access claim for the user
            IdentityResult addedClaimResult = await _UserManager.AddClaimAsync(
                    newUser,
                    new Claim(AppConst.AccessClaims.Type, newUser.Role.AccessClaim)
                ).ConfigureAwait(false);
            /// if claim failed to be created
            if (!addedClaimResult.Succeeded)
            {
               /// remove the user account and return appropriate error
               _DbContext.Users.Remove(newUser);
               await _DbContext.SaveChangesAsync().ConfigureAwait(false);
               AppFunc.Error(ref ErrorsList, AppConst.CommonErrors.ServerError);
               return StatusCode(417, ErrorsList);
            }

            isUserCreated = true;
            /// return 201 created status with the new object
            /// and success message
            return Created("Success", newUser);
         }
         catch (Exception ee) // DbUpdateException, DbUpdateConcurrencyException
         {
            /// Add the error below to the error list and return bad request
            AppFunc.Error(ref ErrorsList, AppConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }
   }
}
