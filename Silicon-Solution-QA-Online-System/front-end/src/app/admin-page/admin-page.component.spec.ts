import { TestBed, fakeAsync, async, tick, inject, ComponentFixture } from '@angular/core/testing';
import { QaSysService } from '../qa-sys.service';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AdminPageComponent } from "./admin-page.component";
import { FormsModule, ReactiveFormsModule  } from "@angular/forms";
import { Router } from '@angular/router';
import { of } from "rxjs";
import { MatSnackBar, MatInputModule, MatProgressBarModule, MatSelectModule, MatPaginatorModule, MatTableModule } from '@angular/material';
import { IconCamera, IconHeart, IconGithub, IconHome, 
    IconPlusSquare, IconRefreshCcw, IconEdit, IconTrash2, IconInfo, 
    IconSlash, IconFilePlus, IconArrowRight, IconClipboard, IconUploadCloud,
    IconXCircle, IconCheck, IconActivity, IconTrendingUp, IconX } from 'angular-feather';

describe('Unit test for admin page component', () => {
    let serviceSpy: jasmine.SpyObj<QaSysService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
    let fixture: ComponentFixture<AdminPageComponent>;
    let component: AdminPageComponent;

    beforeEach(async(()=>{
        const spyS = jasmine.createSpyObj('QaSysService', ['login', 'getRedirectUrl']);
        const spyR = jasmine.createSpyObj('Router', ['navigate']);
        const spyB = jasmine.createSpyObj('MatSnackBar', ['open']);
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, MatInputModule, MatProgressBarModule, MatPaginatorModule,
                MatTableModule, MatSelectModule, BrowserAnimationsModule,IconCamera, IconHeart, IconGithub, IconHome, 
                IconPlusSquare, IconRefreshCcw, IconEdit, IconTrash2, IconInfo, 
                IconSlash, IconFilePlus, IconArrowRight, IconClipboard, IconUploadCloud,
                IconXCircle, IconCheck, IconActivity, IconTrendingUp, IconX],
            declarations: [AdminPageComponent],
            providers: [ 
                {provide: QaSysService, useValue: spyS},
                {provide: Router, useValue: spyR},
                {provide: MatSnackBar, useValue: spyB}
            ]
        })
        .compileComponents()
        serviceSpy = TestBed.get(QaSysService);
        routerSpy = TestBed.get(Router);
        snackBarSpy = TestBed.get(MatSnackBar);
        fixture = TestBed.createComponent(AdminPageComponent);
        component = fixture.componentInstance;
    }))

    it('should create', () => {
        expect(component).toBeDefined();
    })

})