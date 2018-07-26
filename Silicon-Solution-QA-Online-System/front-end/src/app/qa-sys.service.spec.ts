import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { QaSysService } from './qa-sys.service';

describe('Unit test for qa-sys.service.ts', () => {
    beforeEach(() => {
        //set up test envrionment
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule
            ],
            providers: [QaSysService]
        });
    });

    describe('Unit test for login function', () => {
        it(`#login should issue a POST request toward http://192.168.0.65:3000/login`,
            // 1. declare as async test since the HttpClient works with Observables
            async(
                // 2. inject QaSysService, HttpClient and HttpTestingController into the test
                inject([QaSysService, HttpClient, HttpTestingController], 
                    (qaSysService: QaSysService, http: HttpClient, backend: HttpTestingController) => {
                    // 3. send a simple request
                    qaSysService.login("ddai", "dy12345DY").subscribe();
                    // 4. HttpTestingController supersedes `MockBackend` from the "old" Http package
                    // here two, it's significantly less boilerplate code needed to verify an expected request
                    backend.expectOne({
                        url: 'http://192.168.0.65:3000/login',
                        method: 'POST'
                    });
                })
            )
        );

        it(`#login should respond with data from back-end server`,
            // 1. declare as async test since the HttpClient works with Observables
            async(
                // 2. inject QaSysService, HttpClient and HttpTestingController into the test
                inject([QaSysService, HttpClient, HttpTestingController], 
                    (qaSysService: QaSysService, http: HttpClient, backend: HttpTestingController) => {
                    // 3. send a simple request
                    qaSysService.login("ddai", "dy12345DY").subscribe(result => {
                        expect(result).toEqual({ str: "test", arr: [1, 2, 3]});
                    });
                    // 4. HttpTestingController supersedes `MockBackend` from the "old" Http package
                    // here two, it's significantly less boilerplate code needed to verify an expected request
                    backend.match({
                        url: 'http://192.168.0.65:3000/login',
                        method: 'POST'
                    })[0].flush({ str: "test", arr: [1, 2 ,3] });
                })
            )
        )

        it(`#login should set login state to true and store user info as well as token in localStorage after successfully logging in`,
            // 1. declare as async test since the HttpClient works with Observables
            async(
                // 2. inject QaSysService, HttpClient and HttpTestingController into the test
                inject([QaSysService, HttpClient, HttpTestingController], 
                    (qaSysService: QaSysService, http: HttpClient, backend: HttpTestingController) => {
                    // 3. send a simple request
                    qaSysService.login("ddai", "dy12345DY").subscribe(result =>{
                        expect(window.localStorage.getItem("token")).toEqual("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MzI0NjQxMjUsImV4cCI6MTUzMjQ5MjkyNX0.jtiPf2_u9y21CIRVJFWg6GKh2Zwcw6Xnh_fuAljZc7o");
                        expect(JSON.parse(window.localStorage.getItem("user"))).toEqual("test user");
                    });
                    // 4. HttpTestingController supersedes `MockBackend` from the "old" Http package
                    // here two, it's significantly less boilerplate code needed to verify an expected request
                    backend.match({
                        url: 'http://192.168.0.65:3000/login',
                        method: 'POST'
                    })[0].flush({ result: true, token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MzI0NjQxMjUsImV4cCI6MTUzMjQ5MjkyNX0.jtiPf2_u9y21CIRVJFWg6GKh2Zwcw6Xnh_fuAljZc7o", user: "test user" });
                })
            )
        );

    })

    describe('Unit test for logout function', () => {
    
        it("#logout should erase the user info and token from localStorage",
            inject([QaSysService], (qaSysService: QaSysService) => {
                qaSysService.logout();
                expect(window.localStorage['token']).not.toBeDefined()
                expect(window.localStorage['user']).not.toBeDefined()
            }) 
        )
    })

    describe("Unit test for getAll function", ()=>{
        it(`#getAll should issue a POST request toward http://192.168.0.65:3000/getAll`,
            // 1. declare as async test since the HttpClient works with Observables
            async(
                // 2. inject QaSysService, HttpClient and HttpTestingController into the test
                inject([QaSysService, HttpClient, HttpTestingController], 
                    (qaSysService: QaSysService, http: HttpClient, backend: HttpTestingController) => {
                    // 3. send a simple request
                    qaSysService.getAll({_id: 0}, "userInfo").subscribe();
                    // 4. HttpTestingController supersedes `MockBackend` from the "old" Http package
                    // here two, it's significantly less boilerplate code needed to verify an expected request
                    backend.expectOne({
                        url: 'http://192.168.0.65:3000/getAll',
                        method: 'POST'
                    });
                })
            )
        );

        it(`#getAll should respond with data from back-end server`,
            // 1. declare as async test since the HttpClient works with Observables
            async(
                // 2. inject QaSysService, HttpClient and HttpTestingController into the test
                inject([QaSysService, HttpClient, HttpTestingController], 
                    (qaSysService: QaSysService, http: HttpClient, backend: HttpTestingController) => {
                    // 3. send a simple request
                    qaSysService.getAll({_id: 0}, "userInfo").subscribe(result => {
                        expect(result).toEqual({ str: "test", arr: [1, 2, 3]});
                    });
                    // 4. HttpTestingController supersedes `MockBackend` from the "old" Http package
                    // here two, it's significantly less boilerplate code needed to verify an expected request
                    backend.match({
                        url: 'http://192.168.0.65:3000/getAll',
                        method: 'POST'
                    })[0].flush({ str: "test", arr: [1, 2 ,3] });
                })
            )
        )
    })

    describe("Unit test for getMany function", ()=>{
        it(`#getMany should issue a POST request toward http://192.168.0.65:3000/getMany`,
            // 1. declare as async test since the HttpClient works with Observables
            async(
                // 2. inject QaSysService, HttpClient and HttpTestingController into the test
                inject([QaSysService, HttpClient, HttpTestingController], 
                    (qaSysService: QaSysService, http: HttpClient, backend: HttpTestingController) => {
                    // 3. send a simple request
                    qaSysService.getMany({_id: 0}, {id: "ddai"}, "userInfo").subscribe();
                    // 4. HttpTestingController supersedes `MockBackend` from the "old" Http package
                    // here two, it's significantly less boilerplate code needed to verify an expected request
                    backend.expectOne({
                        url: 'http://192.168.0.65:3000/getMany',
                        method: 'POST'
                    });
                })
            )
        );

        it(`#getMany should respond with data from back-end server`,
            // 1. declare as async test since the HttpClient works with Observables
            async(
                // 2. inject QaSysService, HttpClient and HttpTestingController into the test
                inject([QaSysService, HttpClient, HttpTestingController], 
                    (qaSysService: QaSysService, http: HttpClient, backend: HttpTestingController) => {
                    // 3. send a simple request
                    qaSysService.getMany({_id: 0}, {id: "ddai"}, "userInfo").subscribe(result => {
                        expect(result).toEqual({ str: "test", arr: [1, 2, 3]});
                    });
                    // 4. HttpTestingController supersedes `MockBackend` from the "old" Http package
                    // here two, it's significantly less boilerplate code needed to verify an expected request
                    backend.match({
                        url: 'http://192.168.0.65:3000/getMany',
                        method: 'POST'
                    })[0].flush({ str: "test", arr: [1, 2 ,3] });
                })
            )
        )
    })

    describe("Unit test for getOne function", ()=>{
        it(`#getOne should issue a POST request toward http://192.168.0.65:3000/getOne`,
            // 1. declare as async test since the HttpClient works with Observables
            async(
                // 2. inject QaSysService, HttpClient and HttpTestingController into the test
                inject([QaSysService, HttpClient, HttpTestingController], 
                    (qaSysService: QaSysService, http: HttpClient, backend: HttpTestingController) => {
                    // 3. send a simple request
                    qaSysService.getOne({id: "ddai"}, "userInfo").subscribe();
                    // 4. HttpTestingController supersedes `MockBackend` from the "old" Http package
                    // here two, it's significantly less boilerplate code needed to verify an expected request
                    backend.expectOne({
                        url: 'http://192.168.0.65:3000/getOne',
                        method: 'POST'
                    });
                })
            )
        );

        it(`#getOne should respond with data from back-end server`,
            // 1. declare as async test since the HttpClient works with Observables
            async(
                // 2. inject QaSysService, HttpClient and HttpTestingController into the test
                inject([QaSysService, HttpClient, HttpTestingController], 
                    (qaSysService: QaSysService, http: HttpClient, backend: HttpTestingController) => {
                    // 3. send a simple request
                    qaSysService.getOne({id: "ddai"}, "userInfo").subscribe(result => {
                        expect(result).toEqual({ str: "test", arr: [1, 2, 3]});
                    });
                    // 4. HttpTestingController supersedes `MockBackend` from the "old" Http package
                    // here two, it's significantly less boilerplate code needed to verify an expected request
                    backend.match({
                        url: 'http://192.168.0.65:3000/getOne',
                        method: 'POST'
                    })[0].flush({ str: "test", arr: [1, 2 ,3] });
                })
            )
        )
    })

    describe("Unit test for deleteOne function", ()=>{
        it(`#deleteOne should issue a POST request toward http://192.168.0.65:3000/deleteOne`,
            // 1. declare as async test since the HttpClient works with Observables
            async(
                // 2. inject QaSysService, HttpClient and HttpTestingController into the test
                inject([QaSysService, HttpClient, HttpTestingController], 
                    (qaSysService: QaSysService, http: HttpClient, backend: HttpTestingController) => {
                    // 3. send a simple request
                    qaSysService.deleteOne("ddai", "userInfo").subscribe();
                    // 4. HttpTestingController supersedes `MockBackend` from the "old" Http package
                    // here two, it's significantly less boilerplate code needed to verify an expected request
                    backend.expectOne({
                        url: 'http://192.168.0.65:3000/deleteOne',
                        method: 'POST'
                    });
                })
            )
        );

        it(`#deleteOne should respond with data from back-end server`,
            // 1. declare as async test since the HttpClient works with Observables
            async(
                // 2. inject QaSysService, HttpClient and HttpTestingController into the test
                inject([QaSysService, HttpClient, HttpTestingController], 
                    (qaSysService: QaSysService, http: HttpClient, backend: HttpTestingController) => {
                    // 3. send a simple request
                    qaSysService.deleteOne("ddai", "userInfo").subscribe(result => {
                        expect(result).toEqual({ str: "test", arr: [1, 2, 3]});
                    });
                    // 4. HttpTestingController supersedes `MockBackend` from the "old" Http package
                    // here two, it's significantly less boilerplate code needed to verify an expected request
                    backend.match({
                        url: 'http://192.168.0.65:3000/deleteOne',
                        method: 'POST'
                    })[0].flush({ str: "test", arr: [1, 2 ,3] });
                })
            )
        )
    })

    describe("Unit test for addOne function", ()=>{
        it(`#addOne should issue a POST request toward http://192.168.0.65:3000/addOne`,
            // 1. declare as async test since the HttpClient works with Observables
            async(
                // 2. inject QaSysService, HttpClient and HttpTestingController into the test
                inject([QaSysService, HttpClient, HttpTestingController], 
                    (qaSysService: QaSysService, http: HttpClient, backend: HttpTestingController) => {
                    // 3. send a simple request
                    qaSysService.addOne({id: 0}, "userInfo").subscribe();
                    // 4. HttpTestingController supersedes `MockBackend` from the "old" Http package
                    // here two, it's significantly less boilerplate code needed to verify an expected request
                    backend.expectOne({
                        url: 'http://192.168.0.65:3000/addOne',
                        method: 'POST'
                    });
                })
            )
        );

        it(`#addOne should respond with data from back-end server`,
            // 1. declare as async test since the HttpClient works with Observables
            async(
                // 2. inject QaSysService, HttpClient and HttpTestingController into the test
                inject([QaSysService, HttpClient, HttpTestingController], 
                    (qaSysService: QaSysService, http: HttpClient, backend: HttpTestingController) => {
                    // 3. send a simple request
                    qaSysService.addOne({id: 0}, "userInfo").subscribe(result => {
                        expect(result).toEqual({ str: "test", arr: [1, 2, 3]});
                    });
                    // 4. HttpTestingController supersedes `MockBackend` from the "old" Http package
                    // here two, it's significantly less boilerplate code needed to verify an expected request
                    backend.match({
                        url: 'http://192.168.0.65:3000/addOne',
                        method: 'POST'
                    })[0].flush({ str: "test", arr: [1, 2 ,3] });
                })
            )
        )

        it(`#addOne should emit error message for 400 bad request`,
            async(
                inject([QaSysService, HttpClient, HttpTestingController], 
                    (qaSysService: QaSysService, http: HttpClient, backend: HttpTestingController) => {
                    qaSysService.addOne({id: 0}, "userInfo").subscribe((result) => {
                        expect(result).toBeFalsy();
                    },
                    error => {
                        expect(error).toBe("duplicated key!");
                    }
                    );
                    backend.expectOne({
                        url: 'http://192.168.0.65:3000/addOne',
                        method: 'POST'
                    }).flush( "duplicated key!", { status: 400, statusText: 'Bad Request' });
                }
            ))
        )
    })

    describe("Unit test for updateOne function", ()=>{
        it(`#updateOne should issue a POST request toward http://192.168.0.65:3000/updateOne`,
            // 1. declare as async test since the HttpClient works with Observables
            async(
                // 2. inject QaSysService, HttpClient and HttpTestingController into the test
                inject([QaSysService, HttpClient, HttpTestingController], 
                    (qaSysService: QaSysService, http: HttpClient, backend: HttpTestingController) => {
                    // 3. send a simple request
                    qaSysService.updateOne("ddai", {id: 0}, "userInfo").subscribe();
                    // 4. HttpTestingController supersedes `MockBackend` from the "old" Http package
                    // here two, it's significantly less boilerplate code needed to verify an expected request
                    backend.expectOne({
                        url: 'http://192.168.0.65:3000/updateOne',
                        method: 'POST'
                    });
                })
            )
        );

        it(`#updateOne should respond with data from back-end server`,
            // 1. declare as async test since the HttpClient works with Observables
            async(
                // 2. inject QaSysService, HttpClient and HttpTestingController into the test
                inject([QaSysService, HttpClient, HttpTestingController], 
                    (qaSysService: QaSysService, http: HttpClient, backend: HttpTestingController) => {
                    // 3. send a simple request
                    qaSysService.updateOne("ddai", {id: 0}, "userInfo").subscribe(result => {
                        expect(result).toEqual({ str: "test", arr: [1, 2, 3]});
                    });
                    // 4. HttpTestingController supersedes `MockBackend` from the "old" Http package
                    // here two, it's significantly less boilerplate code needed to verify an expected request
                    backend.match({
                        url: 'http://192.168.0.65:3000/updateOne',
                        method: 'POST'
                    })[0].flush({ str: "test", arr: [1, 2 ,3] });
                })
            )
        )

        it(`#updateOne should emit error message for 400 bad request`,
            async(
                inject([QaSysService, HttpClient, HttpTestingController], 
                    (qaSysService: QaSysService, http: HttpClient, backend: HttpTestingController) => {
                    qaSysService.updateOne("ddai", {id: 0}, "userInfo").subscribe((result) => {
                        expect(result).toBeFalsy();
                    },
                    error => {
                        expect(error).toBe("duplicated key!");
                    }
                    );
                    backend.expectOne({
                        url: 'http://192.168.0.65:3000/updateOne',
                        method: 'POST'
                    }).flush( "duplicated key!", { status: 400, statusText: 'Bad Request' });
                }
            ))
        )
    })

    describe("Unit test for getSuggestion function", ()=>{
        it(`#getSuggestion should issue a POST request toward http://192.168.0.65:3000/getSuggestion`,
            // 1. declare as async test since the HttpClient works with Observables
            async(
                // 2. inject QaSysService, HttpClient and HttpTestingController into the test
                inject([QaSysService, HttpClient, HttpTestingController], 
                    (qaSysService: QaSysService, http: HttpClient, backend: HttpTestingController) => {
                    // 3. send a simple request
                    qaSysService.getSuggestion("id", "userInfo").subscribe();
                    // 4. HttpTestingController supersedes `MockBackend` from the "old" Http package
                    // here two, it's significantly less boilerplate code needed to verify an expected request
                    backend.expectOne({
                        url: 'http://192.168.0.65:3000/getSuggestion',
                        method: 'POST'
                    });
                })
            )
        );

        it(`#getSuggestion should respond with data from back-end server`,
            // 1. declare as async test since the HttpClient works with Observables
            async(
                // 2. inject QaSysService, HttpClient and HttpTestingController into the test
                inject([QaSysService, HttpClient, HttpTestingController], 
                    (qaSysService: QaSysService, http: HttpClient, backend: HttpTestingController) => {
                    // 3. send a simple request
                    qaSysService.getSuggestion("id", "userInfo").subscribe(result => {
                        expect(result).toEqual(["test", "test", "test"]);
                    });
                    // 4. HttpTestingController supersedes `MockBackend` from the "old" Http package
                    // here two, it's significantly less boilerplate code needed to verify an expected request
                    backend.match({
                        url: 'http://192.168.0.65:3000/getSuggestion',
                        method: 'POST'
                    })[0].flush(["test", "test", "test"]);
                })
            )
        )
    })

    describe("Unit test for checkExisting function", ()=>{
        it(`#checkExisting should issue a POST request toward http://192.168.0.65:3000/checkExisting`,
            // 1. declare as async test since the HttpClient works with Observables
            async(
                // 2. inject QaSysService, HttpClient and HttpTestingController into the test
                inject([QaSysService, HttpClient, HttpTestingController], 
                    (qaSysService: QaSysService, http: HttpClient, backend: HttpTestingController) => {
                    // 3. send a simple request
                    qaSysService.checkExisting("id", "ddai", "userInfo").subscribe();
                    // 4. HttpTestingController supersedes `MockBackend` from the "old" Http package
                    // here two, it's significantly less boilerplate code needed to verify an expected request
                    backend.expectOne({
                        url: 'http://192.168.0.65:3000/checkExisting',
                        method: 'POST'
                    });
                })
            )
        );

        it(`#checkExisting should respond with data from back-end server`,
            // 1. declare as async test since the HttpClient works with Observables
            async(
                // 2. inject QaSysService, HttpClient and HttpTestingController into the test
                inject([QaSysService, HttpClient, HttpTestingController], 
                    (qaSysService: QaSysService, http: HttpClient, backend: HttpTestingController) => {
                    // 3. send a simple request
                    qaSysService.checkExisting("id", "ddai", "userInfo").subscribe(result => {
                        expect(result).toEqual("true");
                    });
                    // 4. HttpTestingController supersedes `MockBackend` from the "old" Http package
                    // here two, it's significantly less boilerplate code needed to verify an expected request
                    backend.match({
                        url: 'http://192.168.0.65:3000/checkExisting',
                        method: 'POST'
                    })[0].flush(JSON.stringify(true));
                })
            )
        )
    })
})
