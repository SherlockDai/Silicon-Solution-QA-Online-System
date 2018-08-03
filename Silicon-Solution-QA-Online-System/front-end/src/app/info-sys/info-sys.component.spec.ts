import { TestBed, fakeAsync, async, tick, inject, ComponentFixture } from '@angular/core/testing';
import { QaSysService } from '../qa-sys.service';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { InfoSysComponent } from "./info-sys.component";
import { FormsModule, ReactiveFormsModule  } from "@angular/forms";
import * as XLSX from 'xlsx';
import { ChartModule } from "angular-highcharts";
import { of } from "rxjs";
import {CdkTableModule} from '@angular/cdk/table';
import { ActivatedRoute } from "@angular/router";
import { MatSnackBar, MatInputModule, MatProgressBarModule, MatSelectModule, MatPaginatorModule, MatTableDataSource,
    MatDialogModule, MatTableModule, MatListModule, MatDialogRef, MAT_DIALOG_DATA, MatButtonToggleModule,
    MatToolbarModule, MatAutocompleteModule, MatCheckboxModule, MatSlideToggleModule, MatBottomSheetModule} from '@angular/material';
import { IconCamera, IconHeart, IconGithub, IconHome,
    IconPlusSquare, IconRefreshCcw, IconEdit, IconTrash2, IconInfo, 
    IconSlash, IconFilePlus, IconArrowRight, IconClipboard, IconUploadCloud,
    IconXCircle, IconCheck, IconActivity, IconTrendingUp, IconX } from 'angular-feather';

describe('Unit test for detailed info excel visualization component', () => {
    let serviceSpy: jasmine.SpyObj<QaSysService>;
    let fixture: ComponentFixture<InfoSysComponent>;
    let component: InfoSysComponent;

    beforeEach(async(()=>{

        const stationInfoConfig = {
            dialog: null,
            bottomSheet: null,
            collection: "stationInfo",
            tableColumns: [
              { columnDef: 'vender', value: "vender", header: 'Vender', cell: (element: any) => `${element.vender}`     },
              { columnDef: 'chipset', value: "chipset", header: 'Chipset', cell: (element: any) => `${element.chipset}`   },
              { columnDef: 'device', value: "device", header: 'Device', cell: (element: any) => `${element.device}`   },
              { columnDef: 'status', value: "status", header: 'Status', cell: (element: any) => `${element.status}`   },
              { columnDef: 'update_time', value: "update_time", header: 'Date', cell: (element: any) => `${(new Date(parseInt(element.update_time))).toDateString()}`   },
            ],            
          
            pageDataSource: new MatTableDataSource(),
            fullDataSource: new MatTableDataSource(),
            favoriateDataSource: new MatTableDataSource(),
          }

        const spyS = jasmine.createSpyObj('QaSysService', ['login', 'getRedirectUrl']);
        const spyR = jasmine.createSpyObj('Router', ['navigate']);
        const spyB = jasmine.createSpyObj('MatSnackBar', ['open']);
        const spyBS = jasmine.createSpyObj('MatBottomSheetModule', ['open'])
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, MatInputModule, MatProgressBarModule, MatPaginatorModule,
                MatSlideToggleModule, ChartModule,CdkTableModule, MatBottomSheetModule,
                MatTableModule, MatSelectModule, BrowserAnimationsModule,IconCamera, IconHeart, IconGithub, IconHome, 
                MatListModule, IconPlusSquare, IconRefreshCcw, IconEdit, IconTrash2, IconInfo, MatButtonToggleModule,
                IconSlash, IconFilePlus, IconArrowRight, IconClipboard, IconUploadCloud, MatToolbarModule, MatAutocompleteModule,
                IconXCircle, IconCheck, IconActivity, IconTrendingUp, IconX, MatCheckboxModule, MatDialogModule],
            declarations: [InfoSysComponent],
            providers: [ 
                {provide: QaSysService, useValue: spyS},
                {provide: MatSnackBar, useValue: spyB},
                {provide: MatBottomSheetModule, useValue: spyBS},
                {provide: ActivatedRoute, useValue: {
                    snapshot: {data: stationInfoConfig}
                }}
            ]
        })
        .compileComponents()
        serviceSpy = TestBed.get(QaSysService);
        fixture = TestBed.createComponent(InfoSysComponent);
        component = fixture.componentInstance;
    }))

    it('should create', () => {
        expect(component).toBeDefined();
    })

})