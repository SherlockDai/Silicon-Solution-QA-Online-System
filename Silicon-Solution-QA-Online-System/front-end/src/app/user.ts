export class User {
    id: string;
    role: string;
    email: string;
    readOnly: boolean;

    constructor(){
      this.id = "";
      this.role = "user";
      this.email = "";
      this.readOnly = false;
    }
  }