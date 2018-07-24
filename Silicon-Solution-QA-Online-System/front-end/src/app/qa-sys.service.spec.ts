import { TestBed, inject } from '@angular/core/testing';
import { Observable } from "rxjs";
import { HttpModule } from '@angular/http';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { QaSysService } from './qa-sys.service';

describe('Unit test for Login function', () => {
    let qaSysService: QaSysService
    beforeEach(() => {
        TestBed.configureTestingModule({ 
            imports: [HttpModule],
            providers: [QaSysService, HttpClient, HttpHandler] 
        });
        qaSysService = TestBed.get(QaSysService);
    })

    it('#login should return JSON Observable', () => 
            qaSysService.login("ddai", "dy12345DY").subscribe(
                result => {
                    expect(typeof result).toBe('object');
                }
            )
    )

    it('#login return JSON with result, user, and token property when successfully login', () =>
            qaSysService.login("ddai", "dy12345DY").subscribe(
                result => {
                    expect('result' in result).toBe(true);
                    expect('user' in result).toBe(true);
                    expect('token' in result).toBe(true);
                }
            )
    )

    it('#login return JSON with only result property when login failed', () => 
            qaSysService.login("ddai", "12345").subscribe(
                result => {
                    expect('result' in result).toBe(true);
                    expect('user' in result).toBe(false);
                    expect('token' in result).toBe(false);
                }
            )
    )
    it('#after login, token and user info should be stored in localStorage',()=>
        qaSysService.login("ddai", "12345").subscribe(result => {
            expect(window.localStorage.getItem('token')).not.toBe(null);
            expect(window.localStorage.getItem('user')).not.toBe(null);
        })

    )
});

describe('Unit test for logout function', () => {
    let qaSysService: QaSysService;
    beforeEach(() => {
        TestBed.configureTestingModule({ 
            imports: [HttpModule],
            providers: [QaSysService, HttpClient, HttpHandler] 
        });
        qaSysService = TestBed.get(QaSysService);
    })
    it('#logout should erase user info and token from localStorage', () => {
            qaSysService.logout()
            expect(window.localStorage.getItem('token')).toBe(null);
            expect(window.localStorage.getItem('user')).toBe(null);
        }
    )
    it('#logout should set user login state to false', () => {
            qaSysService.logout()
            expect(qaSysService.isLoggedIn).toBe(false);
        }
    )
})

describe('Unit test for getAll function', () => {
    let qaSysService: QaSysService;
    beforeEach(() => {
        TestBed.configureTestingModule({ 
            imports: [HttpModule],
            providers: [QaSysService, HttpClient, HttpHandler] 
        });
        qaSysService = TestBed.get(QaSysService);
    })
    it('#getAll should return list of records if exist', () => {
        qaSysService.getAll({_id: 0 }, "userInfo").subscribe(result => {
            expect(result instanceof Array).toBe(true)
        })
    })
})






