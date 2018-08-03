import { TestBed, fakeAsync, async, tick, inject, ComponentFixture } from '@angular/core/testing';
import { QaSysService } from '../qa-sys.service';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DialogPageComponent } from "./dialog-page.component";
import { FormsModule, ReactiveFormsModule  } from "@angular/forms";
import { Router, RouterModule } from '@angular/router';
import { of } from "rxjs";
import { MatSnackBar, MatInputModule, MatProgressBarModule, MatSelectModule, MatPaginatorModule, 
    MatDialogModule, MatTableModule, MatListModule, MatDialogRef, MAT_DIALOG_DATA, MatButtonToggleModule,
    MatToolbarModule, MatAutocompleteModule, MatCheckboxModule} from '@angular/material';
import { IconCamera, IconHeart, IconGithub, IconHome, 
    IconPlusSquare, IconRefreshCcw, IconEdit, IconTrash2, IconInfo, 
    IconSlash, IconFilePlus, IconArrowRight, IconClipboard, IconUploadCloud,
    IconXCircle, IconCheck, IconActivity, IconTrendingUp, IconX } from 'angular-feather';

describe('Unit test for detailed info dialog component', () => {
    let serviceSpy: jasmine.SpyObj<QaSysService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
    let dialogSpy: jasmine.SpyObj<MatDialogRef<DialogPageComponent>>;
    let fixture: ComponentFixture<DialogPageComponent>;
    let component: DialogPageComponent;

    beforeEach(async(()=>{
        const spyS = jasmine.createSpyObj('QaSysService', ['login', 'getRedirectUrl']);
        const spyR = jasmine.createSpyObj('Router', ['navigate']);
        const spyB = jasmine.createSpyObj('MatSnackBar', ['open']);
        const spyBS = jasmine.createSpyObj('MatDialogRef', ['close', 'disableClose']);
        const spyDD = jasmine.createSpyObj('MAT_DIALOG_DATA', ['']);
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, MatInputModule, MatProgressBarModule, MatPaginatorModule,
                MatTableModule, MatSelectModule, BrowserAnimationsModule,IconCamera, IconHeart, IconGithub, IconHome, 
                MatListModule, IconPlusSquare, IconRefreshCcw, IconEdit, IconTrash2, IconInfo, MatButtonToggleModule,
                IconSlash, IconFilePlus, IconArrowRight, IconClipboard, IconUploadCloud, MatToolbarModule, MatAutocompleteModule,
                IconXCircle, IconCheck, IconActivity, IconTrendingUp, IconX, RouterModule, MatCheckboxModule, MatDialogModule],
            declarations: [DialogPageComponent],
            providers: [ 
                {provide: QaSysService, useValue: spyS},
                {provide: Router, useValue: spyR},
                {provide: MatSnackBar, useValue: spyB},
                {provide: MatDialogRef, useValue: spyBS},
                {provide: MAT_DIALOG_DATA, useValue: {record: {id: 'brcm-4357-8UP'}, action: 'detail'}},
            ]
        })
        .compileComponents()
        serviceSpy = TestBed.get(QaSysService);
        routerSpy = TestBed.get(Router);
        snackBarSpy = TestBed.get(MatSnackBar);
        fixture = TestBed.createComponent(DialogPageComponent);
        component = fixture.componentInstance;
    }))

    it('should create', () => {
        expect(component).toBeDefined();
    })

})