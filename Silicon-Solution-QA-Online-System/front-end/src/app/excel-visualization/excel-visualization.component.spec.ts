import { TestBed, fakeAsync, async, tick, inject, ComponentFixture } from '@angular/core/testing';
import { QaSysService } from '../qa-sys.service';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ExcelVisualizationComponent } from "./excel-visualization.component";
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
    let fixture: ComponentFixture<ExcelVisualizationComponent>;
    let component: ExcelVisualizationComponent;

    beforeEach(async(()=>{
        const spyS = jasmine.createSpyObj('QaSysService', ['login', 'getRedirectUrl']);
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, MatInputModule, MatProgressBarModule, MatPaginatorModule,
                MatTableModule, MatSelectModule, BrowserAnimationsModule,IconCamera, IconHeart, IconGithub, IconHome, 
                MatListModule, IconPlusSquare, IconRefreshCcw, IconEdit, IconTrash2, IconInfo, MatButtonToggleModule,
                IconSlash, IconFilePlus, IconArrowRight, IconClipboard, IconUploadCloud, MatToolbarModule, MatAutocompleteModule,
                IconXCircle, IconCheck, IconActivity, IconTrendingUp, IconX, RouterModule, MatCheckboxModule, MatDialogModule],
            declarations: [ExcelVisualizationComponent],
            providers: [ 
                {provide: QaSysService, useValue: spyS},
            ]
        })
        .compileComponents()
        serviceSpy = TestBed.get(QaSysService);
        fixture = TestBed.createComponent(ExcelVisualizationComponent);
        component = fixture.componentInstance;
    }))

    it('should create', () => {
        expect(component).toBeDefined();
    })

})