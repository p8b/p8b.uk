using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using Newtonsoft.Json;

using P8B.Core.CSharp.Attributes;

namespace P8B.UK.API.Database.Models
{
   public class Role
   {
      [Key]
      public int Id { get; set; }

      [Column(TypeName = "nvarchar(30)")]
      [Required(ErrorMessage = "Role Name is Required \n")]
      public string Name { get; set; }

      [Column(TypeName = "nvarchar(30)")]
      [Required(ErrorMessage = "Access Claim is Required \n")]
      [ValidateAccessClaim]
      public string AccessClaim { get; set; }

      [JsonIgnore]
      [InverseProperty("Role")]
      public ICollection<User> Users { get; set; }
   }
}
