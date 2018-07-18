export class StationInfoBrief {
  id: string;
  vender: string;
  chipset: string;
  device: string;
  status: string;
  update_time: number;
}

export class Station {
    id: string;
    vender: string;
    chipset: string;
    device: string;
    status: string;
    update_time: number;
    station_picture: any
    DUT_name: string;
    DUT_HW_version: string;
    DUT_WIFI_FW_version: Array<FileLocation>;
    DUT_BT_HCD_file: Array<FileLocation>;
    DUT_username: string;
    DUT_password: string;
    external_power_supply: string;
    DUT_connection_picture: any;
    additional_comments: string;
    computer_IP: string;
    computer_username: string;
    computer_password: string;
    most_recent_package_tested: string;
    flow_used: string;
    tester: Array<Tester>;
    setup_files: string;
    station_description: string;
    documents: Array<Documnetation>;
    uploads: Array<File>;
    deleted: Array<Documnetation>;

    constructor(){
      this.id = "";
      this.vender = "";
      this.chipset = "";
      this.device = "";
      this.status = "";
      this.update_time = null;
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
      this.station_description = "";
      this.documents = new Array<Documnetation>();
      this.uploads = new Array<File>();
      this.deleted = new Array<Documnetation>();
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

export class Documnetation{
  fileName: string;
  size: number;
  lastModified: number;
  url: any;

  constructor(){
    this.fileName = "";
    this.size = null;
    this.url = "";
    this.lastModified = null;
  }

}

export class Test{
  id: string;
  prev_id: string;
  url: string;
  subject: string;
  date: number;
  status: string;
  station_id: string;
  readOnly: boolean;

  constructor(station_id){
    this.id = "";
    this.prev_id = null;
    this.subject = "";
    this.date = Date.now();
    this.status = "";
    this.station_id = station_id;
    this.readOnly = false;
  }
}