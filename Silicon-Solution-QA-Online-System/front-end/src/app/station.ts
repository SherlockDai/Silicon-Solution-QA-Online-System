export class Station {
    id: string;
    vender: string;
    chipset: string;
    device: string;
    status: string;
    creation_time: Date;
    update_time: Date;
    station_picture: Blob
    DUT_name: string;
    DUT_HW_version: string;
    DUT_WIFI_FW_version: Array<FileLocation>;
    DUT_BT_HCD_file: Array<FileLocation>;
    DUT_username: string;
    DUT_password: string;
    external_power_supply: string;
    DUT_connection_picture: Blob;
    additional_comments: string;
    computer_IP: string;
    computer_username: string;
    computer_password: string;
    most_recent_package_tested: string;
    flow_used: string;
    tester: Array<Tester>;
    setup_files: string;
    constructor(){
      this.id = "";
      this.vender = "";
      this.chipset = "";
      this.device = "";
      this.status = "";
      this.creation_time = new Date();
      this.update_time = new Date();
      this.DUT_name = "";
      this.DUT_HW_version = "";
      this.DUT_WIFI_FW_version = [];
      this.DUT_BT_HCD_file = [];
      this.DUT_username = "";
      this.DUT_password = "";
      this.external_power_supply = "";
      this.additional_comments = "";
      this.computer_IP = "";
      this.computer_username = "";
      this.computer_password = "";
      this.most_recent_package_tested = "";
      this.flow_used = "";
      this.tester = new Array<Tester>();
      this.setup_files = "";
    }
  }

export class FileLocation{
  description: string;
  location: string;

  constructor(){
    this.description = "";
    this.location = "";
  }
}

export class Tester{
  tester_model: string;
  firmware_version: string;
  tester_IP: string;

  constructor(){
    this.tester_model = "";
    this.firmware_version = "";
    this.tester_IP = "";
  }
}