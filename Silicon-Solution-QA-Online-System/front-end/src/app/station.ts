export class Station {
    vender: string;
    chipset: number;
    device: number;
    detail_info:{
        DUT_name: string;
        DUT_HW_version: string;
        DUT_WIFI_FW_version: string;
        DUT_BT_HCD_file: string;
        DUT_username: string;
        DUT_password: string;
        external_power_supply: string;
        DUT_connection_picture: Blob;
        additional_comments: string;
    }
  }