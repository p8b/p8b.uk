using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

using P8B.Core.CSharp.Models.Overrides;
using P8B.UK.API.Database.Models;

namespace P8B.UK.API.Database
{
   public class AppDbContext : IdentityUserContext<User, int,
       AccessClaim<int>,
       IdentityUserLogin<int>,
       IdentityUserToken<int>>
   {
      public DbSet<Role> Roles { get; set; }
      public DbSet<RegistrationMethod> RegistrationMethods { get; set; }


      protected override void OnModelCreating(ModelBuilder builder)
      {
         base.OnModelCreating(builder);


         builder.Entity<AccessClaim<int>>().HasKey(i => i.UserId);
         builder.Entity<IdentityUserLogin<int>>().ToTable("UserLogins");
         builder.Entity<IdentityUserToken<int>>().ToTable("UserLoginTokens");
         builder.Entity<User>().ToTable("Users");
         builder.Entity<AccessClaim<int>>().ToTable("AccessClaims");

         builder.Entity<User>().HasIndex(u => u.Email).IsUnique();
         builder.Entity<User>().Ignore(u => u.UserName);
         builder.Entity<User>().Ignore(u => u.NormalizedUserName);
         builder.Entity<AccessClaim<int>>().Ignore(i => i.Id);
         builder.Ignore<IdentityUserLogin<int>>();
         builder.Ignore<IdentityUserToken<int>>();
         //builder.Entity<RegistrationMethod>().HasOne(t => t.User).WithOne().OnDelete(DeleteBehavior.NoAction);
         builder.Entity<User>().HasOne(u => u.RegistrationMethod).WithOne(r => r.User).OnDelete(DeleteBehavior.Cascade);
         //builder.Entity<oToken>().HasOne(t => t.User).WithMany().OnDelete(DeleteBehavior.Cascade);
      }

      public AppDbContext(DbContextOptions<AppDbContext> options)
          : base(options)
      {
      }


   }
}
