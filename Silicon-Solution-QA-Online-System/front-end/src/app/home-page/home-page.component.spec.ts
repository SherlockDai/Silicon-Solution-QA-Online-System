import { TestBed, fakeAsync, async, tick, inject, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { QaSysService } from '../qa-sys.service';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HomePageComponent } from "./home-page.component";
import { FormsModule, ReactiveFormsModule  } from "@angular/forms";
import * as XLSX from 'xlsx';
import { ChartModule } from "angular-highcharts";
import { of } from "rxjs";
import { MatSnackBar, MatInputModule, MatProgressBarModule, MatSelectModule, MatPaginatorModule, 
    MatDialogModule, MatTableModule, MatListModule, MatDialogRef, MAT_DIALOG_DATA, MatButtonToggleModule,
    MatToolbarModule, MatAutocompleteModule, MatCheckboxModule, MatSlideToggleModule} from '@angular/material';
import { IconCamera, IconHeart, IconGithub, IconHome,
    IconPlusSquare, IconRefreshCcw, IconEdit, IconTrash2, IconInfo, 
    IconSlash, IconFilePlus, IconArrowRight, IconClipboard, IconUploadCloud,
    IconXCircle, IconCheck, IconActivity, IconTrendingUp, IconX } from 'angular-feather';

describe('Unit test for detailed info excel visualization component', () => {
    let serviceSpy: jasmine.SpyObj<QaSysService>;
    let fixture: ComponentFixture<HomePageComponent>;
    let component: HomePageComponent;

    beforeEach(async(()=>{
        const spyS = jasmine.createSpyObj('QaSysService', ['login', 'getRedirectUrl']);
        const spyR = jasmine.createSpyObj('Router', ['navigate']);
        const spyB = jasmine.createSpyObj('MatSnackBar', ['open']);
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, MatInputModule, MatProgressBarModule, MatPaginatorModule,
                MatSlideToggleModule, ChartModule, RouterTestingModule.withRoutes([]),
                MatTableModule, MatSelectModule, BrowserAnimationsModule,IconCamera, IconHeart, IconGithub, IconHome, 
                MatListModule, IconPlusSquare, IconRefreshCcw, IconEdit, IconTrash2, IconInfo, MatButtonToggleModule,
                IconSlash, IconFilePlus, IconArrowRight, IconClipboard, IconUploadCloud, MatToolbarModule, MatAutocompleteModule,
                IconXCircle, IconCheck, IconActivity, IconTrendingUp, IconX, MatCheckboxModule, MatDialogModule],
            declarations: [HomePageComponent],
            providers: [ 
                {provide: QaSysService, useValue: spyS},
                {provide: MatSnackBar, useValue: spyB},
            ]
        })
        .compileComponents()
        serviceSpy = TestBed.get(QaSysService);
        fixture = TestBed.createComponent(HomePageComponent);
        component = fixture.componentInstance;
    }))

    it('should create', () => {
        expect(component).toBeDefined();
    })

})