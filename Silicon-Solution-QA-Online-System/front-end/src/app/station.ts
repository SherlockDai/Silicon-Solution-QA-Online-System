export class Station {
    id: string;
    vender: string;
    chipset: string;
    device: string;
    status: string;
    creationTime: Date;
    updateTime: Date;
    station_picture: Blob
    DUT_name: string;
    DUT_HW_version: string;
    DUT_WIFI_FW_version: string;
    DUT_BT_HCD_file: string;
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
    tester: Array<String>;
    setup_files: string;
    constructor(){
      this.id = "";
      this.vender = "";
      this.chipset = "";
      this.device = "";
      this.status = "";
      this.creationTime = new Date();
      this.updateTime = new Date();
      this.DUT_name = "";
      this.DUT_HW_version = "";
      this.DUT_WIFI_FW_version = "";
      this.DUT_BT_HCD_file = "";
      this.DUT_username = "";
      this.DUT_password = "";
      this.external_power_supply = "";
      this.additional_comments = "";
      this.computer_IP = "";
      this.computer_username = "";
      this.computer_password = "";
      this.most_recent_package_tested = "";
      this.flow_used = "";
      this.tester = new Array();
      this.setup_files = "";
    }
  }