using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Mime;
using System.Net.Http.Headers;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using P8B.Core.CSharp.Extentions;
using P8B.Core.CSharp.Models;
using P8B.UK.API.Database;
using P8B.UK.API.Database.Models;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Identity;
using P8B.Core.CSharp.Models.Overrides;
using P8B.Core.CSharp;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;

namespace P8B.UK.API.Controllers
{
   [Route("[controller]")]
   public class AuthenticationController : ControllerBase
   {
      private readonly AppDbContext _DbContext;
      private readonly UserManager<User> _UserManager;
      private readonly AuthManager<User> _AuthManager;
      private List<Error> ErrorsList = new List<Error>();

      public AuthenticationController(AppDbContext db,
          UserManager<User> um, AuthManager<User> am)
      {
         _DbContext = db;
         _UserManager = um;
         _AuthManager = am;
      }

      [ProducesResponseType(StatusCodes.Status200OK)]
      [ValidateAntiForgeryToken]
      [HttpPost("VarifyAntiforgeryToken")]
      public IActionResult VarifyAntiforgeryToken() => Ok("Valid");
      [ProducesResponseType(StatusCodes.Status200OK)]
      [HttpGet("GetAntiforgeryToken")]
      public IActionResult GetAntiforgeryToken() => Ok("Yout Got It");


      #region *** 201 Created, 422 UnprocessableEntity, 417 ExpectationFailed ***
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status204NoContent)]
      [ProducesResponseType(StatusCodes.Status206PartialContent)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      [ValidateAntiForgeryToken]
      #endregion
      [HttpPost("Post/ExternalLogin")]
      public async Task<IActionResult> ExternalLogin([FromBody] Core.CSharp.Models.ExternalLoginInfo externalLoginInfo)
      {
         try
         {
            if (!TryValidateModel(externalLoginInfo))
            {
               AppFunc.ExtractErrors(ModelState, ref ErrorsList);
               return UnprocessableEntity(ErrorsList);
            }

            User returnedUser = new User();
            switch (externalLoginInfo.Type)
            {
               case CoreConst.RegistrationTypes.Google:
                  returnedUser = await GetGoogleUserInfo(externalLoginInfo).ConfigureAwait(false);
                  break;
               case CoreConst.RegistrationTypes.Facebook:
                  returnedUser = await GetFacebookUserInfo(externalLoginInfo).ConfigureAwait(false);
                  break;
               case CoreConst.RegistrationTypes.Github:
                  returnedUser = await GetGithubUserInfo(externalLoginInfo).ConfigureAwait(false);
                  break;
            }

            // Try to retrieve the user information from App database 
            User newUser = await _DbContext.Users
              .Include(u => u.Role)
               .Include(u => u.RegistrationMethod)
               .SingleOrDefaultAsync(u => u.RegistrationMethod.Type == externalLoginInfo.Type && u.RegistrationMethod.ExternalLinkedId == returnedUser.RegistrationMethod.ExternalLinkedId)
               .ConfigureAwait(false);

            // if the user is already registered
            if (newUser != null)
            {
               // sign the user in without any password
               await _AuthManager.SignInAsync(newUser, externalLoginInfo.RememberMe).ConfigureAwait(false);
               var test = User;
               return Ok(newUser);
            }

            // else if the user is not registered
            // else return 206 partial content
            return StatusCode(206, returnedUser);
         }
         catch (Exception ee)
         {
            AppFunc.Error(ref ErrorsList, AppConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      ///     Login the user into the system
      /// </summary>
      #region ** Attributes: HttpPost, Return Status 200/ 401/ 400 **
      [Consumes(MediaTypeNames.Application.Json)]
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status401Unauthorized)]
      [ProducesResponseType(StatusCodes.Status400BadRequest)]
      [ValidateAntiForgeryToken]
      #endregion
      [HttpPost("[action]")] // Login Method
      public async Task<IActionResult> Login([FromBody] LoginInfo loginInfo)
      {
         try
         {
            /// If email parameter is empty
            /// return "unauthorized" response (stop code execution)
            if (string.IsNullOrWhiteSpace(loginInfo.Email))
            {
               /// in the case any exceptions return the following error
               AppFunc.Error(ref ErrorsList, "Email is required!");
               return BadRequest(ErrorsList);
            }

            /// Find the user with the provided email address
            User user = await _UserManager.Users.Include(u => u.RegistrationMethod)
                    .SingleOrDefaultAsync(u => u.Email.EqualCurrentCultureIgnoreCase(loginInfo.Email))
                    .ConfigureAwait(false);

            /// if no user is found on the database
            // return "unauthorized" response (stop code execution)
            if (user == null)
            {
               /// in the case any exceptions return the following error
               AppFunc.Error(ref ErrorsList, "Email not registered");
               return BadRequest(ErrorsList);
            }

            /// Check if user's account is locked
            if (user.LockoutEnabled)
            {
               /// get the current lockout end dateTime
               var currentLockoutDate =
                   await _UserManager.GetLockoutEndDateAsync(user).ConfigureAwait(false);

               /// if the user's lockout is not expired (stop code execution)
               if (user.LockoutEnd > DateTimeOffset.UtcNow)
               {
                  /// in the case any exceptions return the following error
                  AppFunc.Error(ref ErrorsList, string.Format("Account Locked for {0}"
                      , AppFunc.CompareWithCurrentTime(user.LockoutEnd)));
                  return BadRequest(ErrorsList);
               }
               /// else lockout time has expired
               // disable user lockout
               await _UserManager.SetLockoutEnabledAsync(user, false).ConfigureAwait(false);
               await _UserManager.ResetAccessFailedCountAsync(user).ConfigureAwait(false);
            }

            /// else user account is not locked
            // Attempt to sign in the user
            var SignInResult = await _AuthManager
                .PasswordSignInAsync(user,
                loginInfo.Password,
                loginInfo.RememberMe,
                false).ConfigureAwait(false);

            /// If password sign-in succeeds
            // responded ok 200 status code with
            //the user's role attached (stop code execution)
            if (!SignInResult.Succeeded)
            {
               switch (user.RegistrationMethod.Type)
               {
                  case CoreConst.RegistrationTypes.Google:
                     AppFunc.Error(ref ErrorsList, "Password not set or incorrect. Please Use Google login.");
                     return Unauthorized(ErrorsList);
                  case CoreConst.RegistrationTypes.Facebook:
                     AppFunc.Error(ref ErrorsList, "Password not set or incorrect. Please Use Facebook login.");
                     return Unauthorized(ErrorsList);
                  case CoreConst.RegistrationTypes.Github:
                     AppFunc.Error(ref ErrorsList, "Password not set or incorrect. Please Use Github login.");
                     return Unauthorized(ErrorsList);
               }

               /// else login attempt failed
               /// increase and update the user's failed login attempt by 1
               await _UserManager.AccessFailedAsync(user).ConfigureAwait(false);

               /// if failed login attempt is less than/ equal to 5 (stop code execution)
               if (user.AccessFailedCount <= 5)
               {
                  /// in the case any exceptions return the following error
                  AppFunc.Error(ref ErrorsList, "Incorrect Password!");
                  return Unauthorized(ErrorsList);
               }

               /// else user has tried their password more than 15 times
               // lock the user and ask them to reset their password
               user.LockoutEnabled = true;
               user.LockoutEnd = DateTimeOffset.UtcNow.AddMinutes(user.AccessFailedCount);

               /// in the case any exceptions return the following error
               AppFunc.Error(ref ErrorsList, string.Format("Account Locked for {0}"
                       , AppFunc.CompareWithCurrentTime(user.LockoutEnd)));
               return Unauthorized(ErrorsList);
            }
            user.Role = (await _DbContext.Users
              .Include(u => u.Role)
              .FirstOrDefaultAsync(u => u.Id == user.Id)
              .ConfigureAwait(false))
              ?.Role;
            return Ok(user);
         }
         catch (Exception ee)
         {
            /// Add the error below to the error list and return bad request
            AppFunc.Error(ref ErrorsList, AppConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      #region ** Attributes: HttpGet, Return Status 200/ 400 **
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status400BadRequest)]
      #endregion
      [Authorize(CoreConst.AccessPolicies.Official)]
      [HttpGet("[action]")]
      public async Task<IActionResult> Logout()
      {
         try
         {
            /// try to sign-out the user and return ok
            await _AuthManager.SignOutAsync().ConfigureAwait(false);
            return Ok(new { isAuthenticated = false });
         }
         catch (Exception ee)
         {
            /// Add the error below to the error list and return bad request
            AppFunc.Error(ref ErrorsList, AppConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      /// <summary>
      ///     Check if the user is still logged-in. 
      /// </summary>
      #region ** Attributes: HttpGet, Return Status 200/ 401/ 417 **
      [ProducesResponseType(StatusCodes.Status200OK)]
      [ProducesResponseType(StatusCodes.Status401Unauthorized)]
      [ProducesResponseType(StatusCodes.Status417ExpectationFailed)]
      #endregion
      [Authorize(CoreConst.AccessPolicies.Official)]
      [HttpGet("[action]")]
      public async Task<IActionResult> Silent()
      {
         try
         {
            int.TryParse(User.Claims
                .FirstOrDefault(c => c.Type == "UserId")?.Value, out int userId);

            User user = await _DbContext.Users
              .Include(u => u.Role)
              .FirstOrDefaultAsync(u => u.Id == userId)
              .ConfigureAwait(false);

            if (user == null)
               return Unauthorized();
            else
               return Ok(user);
         }
         catch (Exception)
         {
            /// Add the error below to the error list and return bad request
            AppFunc.Error(ref ErrorsList, CoreConst.CommonErrors.ServerError);
            return StatusCode(417, ErrorsList);
         }
      }

      private async Task<User> GetGoogleUserInfo(Core.CSharp.Models.ExternalLoginInfo externalLoginInfo)
      {
         ExternalEmailSecret googleSecrets = AppConst.Settings.ExternalLoginSecrets.FindObj(e => e.Provider.EqualCurrentCultureIgnoreCase("Google"));

         var caller = new HttpClient();
         var content = new StringContent($"client_id={googleSecrets?.ClientId}&client_secret={googleSecrets?.ClientSecret}&code={externalLoginInfo.Code}&grant_type=authorization_code&redirect_uri={googleSecrets.RedirectURI}");
         content.Headers.ContentType = new MediaTypeHeaderValue("application/x-www-form-urlencoded");
         // get the token from github API by using the provided "code", "state", "clientId" and "clientSecret".
         var tokenResult = await caller.PostAsync("https://oauth2.googleapis.com/token", content).ConfigureAwait(false);
         var tokenResultArray = JsonConvert.DeserializeObject<dynamic>(await tokenResult.Content.ReadAsStringAsync().ConfigureAwait(false));
         string tokenType = tokenResultArray.token_type;
         string accessToken = tokenResultArray.access_token;
         // Add the authorization information from the response above
         caller.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(tokenType, accessToken);
         caller.DefaultRequestHeaders.Add("User-Agent", "TwoMJ.Web.App (test app)");
         // get the user info by calling the github API with the above authorization
         var userInfoResult = await caller.GetAsync($"https://www.googleapis.com/oauth2/v2/userinfo").ConfigureAwait(false);
         var userInfoResultString = await userInfoResult.Content.ReadAsStringAsync().ConfigureAwait(false);
         var userInfoObj = JsonConvert.DeserializeObject<dynamic>(userInfoResultString);
         return new User
         {
            Email = (string)userInfoObj.email,
            FirstName = (string)userInfoObj.given_name,
            Surname = (string)userInfoObj.family_name,
            RegistrationMethod = new RegistrationMethod
            {
               ExternalLinkedId = (string)userInfoObj.id,
               RegisteredDate = DateTime.UtcNow,
               Type = externalLoginInfo.Type,
            }
         };
      }

      private async Task<User> GetFacebookUserInfo(Core.CSharp.Models.ExternalLoginInfo externalLoginInfo)
      {
         ExternalEmailSecret facebookSecrets = AppConst.Settings.ExternalLoginSecrets.FindObj(e => e.Provider.EqualCurrentCultureIgnoreCase("Facebook"));

         var caller = new HttpClient();
         // get the token from github API by using the provided "code", "state", "clientId" and "clientSecret".
         var tokenResult = await caller.GetAsync($"https://graph.facebook.com/v7.0/oauth/access_token?client_id={facebookSecrets?.ClientId}&redirect_uri={facebookSecrets.RedirectURI}&client_secret={facebookSecrets?.ClientSecret}&code={externalLoginInfo.Code}").ConfigureAwait(false);
         var tokenResultArray = JsonConvert.DeserializeObject<dynamic>(await tokenResult.Content.ReadAsStringAsync().ConfigureAwait(false));
         string tokenType = tokenResultArray.token_type;
         string accessToken = tokenResultArray.access_token;
         // Add the authorization information from the response above
         caller.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(tokenType, accessToken);
         caller.DefaultRequestHeaders.Add("User-Agent", "TwoMJ.Web.App (test app)");

         // get the user info by calling the github API with the above authorization
         var userInfoResult = await caller.GetAsync($"https://graph.facebook.com/me?fields=id,email,first_name,last_name&access_token={accessToken}").ConfigureAwait(false);
         var userInfoResultString = await userInfoResult.Content.ReadAsStringAsync().ConfigureAwait(false);
         var userInfoObj = JsonConvert.DeserializeObject<dynamic>(userInfoResultString);
         return new User
         {
            FirstName = (string)userInfoObj.first_name,
            Surname = (string)userInfoObj.last_name,
            Email = (string)userInfoObj.email,
            RegistrationMethod = new RegistrationMethod
            {
               ExternalLinkedId = (string)userInfoObj.id,
               RegisteredDate = DateTime.UtcNow,
               Type = externalLoginInfo.Type,
            }
         };
      }

      private async Task<User> GetGithubUserInfo(Core.CSharp.Models.ExternalLoginInfo externalLoginInfo)
      {
         ExternalEmailSecret githubSecrets = AppConst.Settings.ExternalLoginSecrets.FindObj(e => e.Provider.EqualCurrentCultureIgnoreCase("Github"));

         var caller = new HttpClient();
         // get the token from github API by using the provided "code", "state", "clientId" and "clientSecret".
         var tokenResult = await caller.GetAsync($"https://github.com/login/oauth/access_token?client_id={githubSecrets?.ClientId}&client_secret={githubSecrets?.ClientSecret}&code={externalLoginInfo.Code}&state={externalLoginInfo.State}").ConfigureAwait(false);
         var tokenResultArray = (await tokenResult.Content.ReadAsStringAsync().ConfigureAwait(false))
            .Replace("access_token", "").Replace("&scope", "").Replace("token_type", "").Split("=");

         // Add the authorization information from the response above
         caller.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(tokenResultArray[3], tokenResultArray[1]);
         caller.DefaultRequestHeaders.Add("User-Agent", "TwoMJ.Web.App (test app)");

         // get the user info by calling the github API with the above authorization
         var userInfoResult = await caller.GetAsync("https://api.github.com/user").ConfigureAwait(false);
         var userInfoResultString = await userInfoResult.Content.ReadAsStringAsync().ConfigureAwait(false);
         var userInfoObj = JsonConvert.DeserializeObject<dynamic>(userInfoResultString);
         return new User
         {
            Email = (string)userInfoObj.email,
            RegistrationMethod = new RegistrationMethod
            {
               ExternalLinkedId = (string)userInfoObj.id,
               RegisteredDate = DateTime.UtcNow,
               Type = externalLoginInfo.Type,
            }
         };
      }
   }
}
