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
