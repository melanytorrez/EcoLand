import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA, EventEmitter, Pipe, PipeTransform } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LoginComponent } from './login.component';

@Pipe({ name: 'translate' })
class FakeTranslatePipe implements PipeTransform {
  transform(value: any): any { return value; }
}
import { AuthService } from '../../../core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

describe('LoginComponent (Integration)', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  const translateStub = {
    instant: (key: string) => key,
    get: () => of(''),
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter(),
    use: () => of('')
  };

  const mockActivatedRoute = {
    snapshot: {
      queryParamMap: { get: (_: string) => null }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        AuthService,
        { provide: TranslateService, useValue: translateStub },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .overrideComponent(LoginComponent, {
      set: { imports: [ReactiveFormsModule, FakeTranslatePipe], schemas: [NO_ERRORS_SCHEMA] }
    })
    .compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should POST to /auth/login and navigate to / on success for usuario role', () => {
    component.loginForm.setValue({ email: 'user@test.com', password: 'Password1!' });
    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'user@test.com', password: 'Password1!' });

    req.flush({ token: 'valid-token', role: 'USUARIO', nombre: 'User', email: 'user@test.com' });

    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
    expect(component.error).toBe('');
  });

  it('should POST to /auth/login and navigate to /admin for admin role', () => {
    component.loginForm.setValue({ email: 'admin@test.com', password: 'Admin1!' });
    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush({ token: 'admin-token', role: 'ADMINISTRADOR', nombre: 'Admin', email: 'admin@test.com' });

    expect(router.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('should set error on HTTP 401 response', () => {
    component.loginForm.setValue({ email: 'wrong@test.com', password: 'WrongPass1!' });
    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(component.error).toBeTruthy();
    expect(component.isLoading).toBeFalse();
  });

  it('should store token in localStorage after successful login', () => {
    component.loginForm.setValue({ email: 'user@test.com', password: 'Password1!' });
    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    req.flush({ token: 'stored-token', role: 'USUARIO', nombre: 'User', email: 'user@test.com' });

    expect(localStorage.getItem('auth_token')).toBe('stored-token');
    localStorage.clear();
  });
});
