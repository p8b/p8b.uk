﻿using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace P8B.UK.API.Database.Models
{
   [Table("Users")]
   public class User : IdentityUser<int>
   {
      public User() => UserName = $"p8b{new Random().Next(0, 99)}";

      #region nvarchar(256), Required, StringLength(256)
      [Column(TypeName = "nvarchar(256)")]
      [Required(ErrorMessage = "Name Required \n")]
      [StringLength(256, ErrorMessage = "Name must be less than 256 Characters \n")]
      #endregion
      public string FirstName { get; set; }

      #region nvarchar(256), Required, StringLength(256)
      [Column(TypeName = "nvarchar(256)")]
      [Required(ErrorMessage = "Surname Required \n")]
      [StringLength(256, ErrorMessage = "Surname must be less than 256 Characters \n")]
      #endregion
      public string Surname { get; set; }

      [Required(ErrorMessage = "Registration Info Required")]
      public RegistrationMethod RegistrationMethod { get; set; }

      [Required(ErrorMessage = "Role is Required.")]
      [ForeignKey("RoleId")]
      public Role Role { get; set; }

      [NotMapped]
      public string TempPassword { get; set; }

      [RegularExpression(@"^\+?(?:\d\s?){10,12}$", ErrorMessage = "Invalid UK Phone Number \n")]
      public override string PhoneNumber { get; set; }

      #region Required, DateType(EmailAddress), RegularExpression
      [DataType(DataType.EmailAddress, ErrorMessage = "Invalid Email \n")]
      [Required(ErrorMessage = "Email is Required \n")]
      [RegularExpression(@"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
          ErrorMessage = "Invalid Email \n")]
      #endregion
      public override string Email { get; set; }

      public bool SubscribeNewsLetter { get; set; }

      #region **** JsonIgnore extra properties and sensitive properties ****
      #region Required, DateType(Password), JsonIgnore
      [DataType(DataType.Password)]
      [Required(ErrorMessage = "Password Required \n")]
      [JsonIgnore]
      #endregion
      public override string PasswordHash { get; set; }
      [JsonIgnore]
      public override DateTimeOffset? LockoutEnd { get; set; }
      [JsonIgnore]
      public override bool TwoFactorEnabled { get; set; }
      [JsonIgnore]
      public override bool PhoneNumberConfirmed { get; set; }
      [JsonIgnore]
      public override string ConcurrencyStamp { get; set; }
      [JsonIgnore]
      public override string SecurityStamp { get; set; }
      [JsonIgnore]
      public override string NormalizedEmail { get; set; }
      [JsonIgnore]
      [NotMapped]
      public override string NormalizedUserName { get; set; }
      [JsonIgnore]
      [NotMapped]
      public override string UserName { get; set; }
      [JsonIgnore]
      public override bool LockoutEnabled { get; set; }
      [JsonIgnore]
      public override int AccessFailedCount { get; set; }
      #endregion
   }
}
