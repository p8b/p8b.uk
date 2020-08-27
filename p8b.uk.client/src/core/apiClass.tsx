import { RegistrationTypes } from "./constant.Variables";

export class ContactMe {
   name: string;
   email: string;
   subject: string;
   messege: string;
   constructor(name: string = "",
      email: string = "",
      subject: string = "",
      messege: string = "") {
      this.name = name;
      this.email = email;
      this.subject = subject;
      this.messege = messege;
   }
}

export class Role {
   id?: number;
   name?: string;
   accessClaim?: string;

   constructor(id?: number,
      name?: string,
      accessClaim?: string) {
      this.id = id;
      this.name = name;
      this.accessClaim = accessClaim;
   }
}

export class User {
   id?: number;
   firstName?: string;
   surname?: string;
   registrationMethod?: RegistrationMethod;
   role?: Role;
   tempPassword?: string;
   phoneNumber?: string;
   email?: string;
   emailConfirmed?: boolean;
   subscribeNewsLetter?: boolean;
   constructor(user?: User) {
      this.id = user?.id;
      this.firstName = user?.firstName;
      this.surname = user?.surname;
      this.registrationMethod = user?.registrationMethod;
      this.role = user?.role;
      this.tempPassword = user?.tempPassword;
      this.phoneNumber = user?.phoneNumber;
      this.email = user?.email;
      this.emailConfirmed = user?.emailConfirmed;
      this.subscribeNewsLetter = user?.subscribeNewsLetter;
   }
}

export class RegistrationMethod {
   linkedId?: string;
   type?: RegistrationTypes;
   registeredDate?: Date;
   constructor(
      linkedId?: string,
      type?: RegistrationTypes,
      registeredDate?: Date) {
      this.linkedId = linkedId;
      this.type = type;
      this.registeredDate = registeredDate;
   }
}

export class LoginInfo {
   email?: string;
   password?: string;
   rememberMe?: boolean;

   constructor(
      email?: string,
      password?: string,
      rememberMe?: boolean) {
      this.email = email;
      this.password = password;
      this.rememberMe = rememberMe;

   }
}

export class ExternalLoginInfo {
   Code?: string;
   State?: string;
   type?: RegistrationTypes;
   rememberMe?: boolean;

   constructor(code?: string, state?: string, type?: RegistrationTypes, rememberMe?: boolean) {
      this.Code = code;
      this.State = state;
      this.type = type;
      this.rememberMe = rememberMe;
   }
}