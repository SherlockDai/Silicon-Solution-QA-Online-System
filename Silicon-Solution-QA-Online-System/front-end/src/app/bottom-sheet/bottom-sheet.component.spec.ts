import { TestBed, fakeAsync, async, tick, inject, ComponentFixture } from '@angular/core/testing';
import { QaSysService } from '../qa-sys.service';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BottomSheetComponent } from "./bottom-sheet.component";
import { FormsModule, ReactiveFormsModule  } from "@angular/forms";
import { Router } from '@angular/router';
import { of } from "rxjs";
import { MatSnackBar, MatInputModule, MatProgressBarModule, MatSelectModule, MatPaginatorModule, 
    MatDialog, MatTableModule, MatListModule, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { IconCamera, IconHeart, IconGithub, IconHome, 
    IconPlusSquare, IconRefreshCcw, IconEdit, IconTrash2, IconInfo, 
    IconSlash, IconFilePlus, IconArrowRight, IconClipboard, IconUploadCloud,
    IconXCircle, IconCheck, IconActivity, IconTrendingUp, IconX } from 'angular-feather';

describe('Unit test for bottom sheet component', () => {
    let serviceSpy: jasmine.SpyObj<QaSysService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
    let bottomSheetSpy: jasmine.SpyObj<MatBottomSheetRef>;
    let dialogSpy: jasmine.SpyObj<MatDialog>;
    let fixture: ComponentFixture<BottomSheetComponent>;
    let component: BottomSheetComponent;

    beforeEach(async(()=>{
        const spyS = jasmine.createSpyObj('QaSysService', ['login', 'getRedirectUrl']);
        const spyR = jasmine.createSpyObj('Router', ['navigate']);
        const spyB = jasmine.createSpyObj('MatSnackBar', ['open']);
        const spyBS = jasmine.createSpyObj('MatBottomSheetRef', ['dismiss']);
        const spyD = jasmine.createSpyObj('MatDialog', ['open']);
        const spyBSD = jasmine.createSpyObj('MAT_BOTTOM_SHEET_DATA', ['']);
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, MatInputModule, MatProgressBarModule, MatPaginatorModule,
                MatTableModule, MatSelectModule, BrowserAnimationsModule,IconCamera, IconHeart, IconGithub, IconHome, 
                MatListModule, IconPlusSquare, IconRefreshCcw, IconEdit, IconTrash2, IconInfo, 
                IconSlash, IconFilePlus, IconArrowRight, IconClipboard, IconUploadCloud,
                IconXCircle, IconCheck, IconActivity, IconTrendingUp, IconX],
            declarations: [BottomSheetComponent],
            providers: [ 
                {provide: QaSysService, useValue: spyS},
                {provide: Router, useValue: spyR},
                {provide: MatSnackBar, useValue: spyB},
                {provide: MatBottomSheetRef, useValue: spyBS},
                {provide: MatDialog, useValue: spyD},
                {provide: MAT_BOTTOM_SHEET_DATA, useValue: spyBSD},
            ]
        })
        .compileComponents()
        serviceSpy = TestBed.get(QaSysService);
        routerSpy = TestBed.get(Router);
        snackBarSpy = TestBed.get(MatSnackBar);
        fixture = TestBed.createComponent(BottomSheetComponent);
        component = fixture.componentInstance;
    }))

    it('should create', () => {
        expect(component).toBeDefined();
    })

})