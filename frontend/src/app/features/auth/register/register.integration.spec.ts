import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA, EventEmitter, Pipe, PipeTransform } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { RegisterComponent } from './register.component';

@Pipe({ name: 'translate' })
class FakeTranslatePipe implements PipeTransform {
  transform(value: any): any { return value; }
}
import { AuthService } from '../../../core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

describe('RegisterComponent (Integration)', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        AuthService,
        { provide: TranslateService, useValue: translateStub }
      ]
    })
    .overrideComponent(RegisterComponent, {
      set: { imports: [ReactiveFormsModule, FakeTranslatePipe], schemas: [NO_ERRORS_SCHEMA] }
    })
    .compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should POST to /auth/register and navigate to / on success', () => {
    component.registerForm.setValue({
      fullName: 'New User',
      email: 'newuser@test.com',
      password: 'Secure1@pass',
      confirmPassword: 'Secure1@pass',
      role: 'Usuario'
    });
    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.nombre).toBe('New User');
    expect(req.request.body.email).toBe('newuser@test.com');

    req.flush({ token: 'new-token', nombre: 'New User', email: 'newuser@test.com', role: 'USUARIO' });

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should show server error message on 400 response with error.message', () => {
    component.registerForm.setValue({
      fullName: 'New User',
      email: 'exists@test.com',
      password: 'Secure1@pass',
      confirmPassword: 'Secure1@pass',
      role: 'Usuario'
    });
    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    req.flush({ message: 'El email ya está registrado' }, { status: 400, statusText: 'Bad Request' });

    expect(component.error).toBe('El email ya está registrado');
    expect(component.isLoading).toBeFalse();
  });

  it('should store token in localStorage after successful registration', () => {
    component.registerForm.setValue({
      fullName: 'John',
      email: 'john@test.com',
      password: 'JohnPass1@',
      confirmPassword: 'JohnPass1@',
      role: 'Usuario'
    });
    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    req.flush({ token: 'reg-token', nombre: 'John', email: 'john@test.com', role: 'USUARIO' });

    expect(localStorage.getItem('auth_token')).toBe('reg-token');
  });
});
