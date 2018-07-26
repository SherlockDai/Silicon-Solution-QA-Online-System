import { TestBed, fakeAsync, async, tick, inject, ComponentFixture } from '@angular/core/testing';
import { QaSysService } from '../qa-sys.service';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoginPageComponent } from './login-page.component';
import { FormsModule, ReactiveFormsModule  } from "@angular/forms";
import { Router } from '@angular/router';
import { of } from "rxjs";
import { MatSnackBar, MatInputModule, MatProgressBarModule } from '@angular/material';

describe('Unit test for login component', () => {
    let serviceSpy: jasmine.SpyObj<QaSysService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
    let fixture: ComponentFixture<LoginPageComponent>;
    let component: LoginPageComponent;

    beforeEach(async(()=>{
        const spyS = jasmine.createSpyObj('QaSysService', ['login', 'getRedirectUrl']);
        const spyR = jasmine.createSpyObj('Router', ['navigate']);
        const spyB = jasmine.createSpyObj('MatSnackBar', ['open']);
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, MatInputModule, MatProgressBarModule, BrowserAnimationsModule],
            declarations: [LoginPageComponent],
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
        fixture = TestBed.createComponent(LoginPageComponent);
        component = fixture.componentInstance;
    }))

    it('should create', () => {
        expect(component).toBeDefined();
    })

    it('#login should send the result from service to #checkInfo', fakeAsync(() => {
        const fakeResult = {result: true, user: {id: "ddai"}, token: "token"};
        serviceSpy.login.and.returnValue(of(fakeResult))
        spyOn(component, 'checkInfo');
        component.login("username", "password");
        expect(component.checkInfo).toHaveBeenCalledWith(fakeResult);
    }))

    it('#checkInfo should navigate user to redirectUrl when result from back-end is positive', () => {
        const fakeResult = {result: true, user: {id: "ddai"}, token: "token"};
        const fakeRedirectUrl= "\home"
        serviceSpy.getRedirectUrl.and.returnValue(fakeRedirectUrl)
        component.checkInfo(JSON.parse(JSON.stringify(fakeResult)));
        expect(routerSpy.navigate).toHaveBeenCalledWith([fakeRedirectUrl]);

    })

    it("should show error message when login failed", fakeAsync(()=>{
        const fakeResult = {result: false};
        fixture.detectChanges();
        component.checkInfo(JSON.parse(JSON.stringify(fakeResult)));
        fixture.detectChanges();
        fixture.whenStable().then(() => { // wait for async getQuote
            const loginEl: HTMLElement = fixture.debugElement.nativeElement;
            const matErr = loginEl.querySelector('span.errMsg');
            expect(component.loginUsernameFormControl.getError('username')).toBe(true);
            expect(component.loginPasswordFormControl.getError('password')).toBe(true);
          });
        
    }))

});
