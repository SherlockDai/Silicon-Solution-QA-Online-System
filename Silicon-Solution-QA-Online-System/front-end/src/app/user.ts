export class User {
    id: string;
    role: string;
    email: string;
    readOnly: boolean;
    prev_id: string;

    constructor(){
      this.id = "";
      this.role = "user";
      this.email = "";
      this.readOnly = false;
      this.prev_id = null;
    }
  }