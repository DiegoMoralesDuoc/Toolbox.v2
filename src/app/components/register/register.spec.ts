import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { Register } from './register';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('formulario inválido cuando está vacío', () => {
    const nameInput = fixture.debugElement.query(By.css('input[name="name"]')).nativeElement;
    const emailInput = fixture.debugElement.query(By.css('input[name="email"]')).nativeElement;
    const passwordInput = fixture.debugElement.query(By.css('input[name="password"]')).nativeElement;
    const rolSelect = fixture.debugElement.query(By.css('select[name="rol"]')).nativeElement;

    nameInput.value = '';
    nameInput.dispatchEvent(new Event('input'));

    emailInput.value = '';
    emailInput.dispatchEvent(new Event('input'));

    passwordInput.value = '';
    passwordInput.dispatchEvent(new Event('input'));

    rolSelect.value = ''; // Ningún valor seleccionado
    rolSelect.dispatchEvent(new Event('change'));

    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    expect(form.checkValidity()).toBeFalse();
  });

  it('botón submit deshabilitado cuando formulario inválido', () => {
    const nameInput = fixture.debugElement.query(By.css('input[name="name"]')).nativeElement;
    const emailInput = fixture.debugElement.query(By.css('input[name="email"]')).nativeElement;
    const passwordInput = fixture.debugElement.query(By.css('input[name="password"]')).nativeElement;
    const rolSelect = fixture.debugElement.query(By.css('select[name="rol"]')).nativeElement;

    nameInput.value = '';
    nameInput.dispatchEvent(new Event('input'));

    emailInput.value = '';
    emailInput.dispatchEvent(new Event('input'));

    passwordInput.value = '';
    passwordInput.dispatchEvent(new Event('input'));

    rolSelect.value = ''; // Ningún valor seleccionado
    rolSelect.dispatchEvent(new Event('change'));

    fixture.detectChanges();

    const submitBtn = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitBtn.disabled).toBeTrue();
  });

  it('botón submit habilitado cuando formulario válido', () => {
    const nameInput = fixture.debugElement.query(By.css('input[name="name"]')).nativeElement;
    const emailInput = fixture.debugElement.query(By.css('input[name="email"]')).nativeElement;
    const passwordInput = fixture.debugElement.query(By.css('input[name="password"]')).nativeElement;
    const rolSelect = fixture.debugElement.query(By.css('select[name="rol"]')).nativeElement;

    nameInput.value = 'Diego Morales';
    nameInput.dispatchEvent(new Event('input'));

    emailInput.value = 'diego@example.com';
    emailInput.dispatchEvent(new Event('input'));

    passwordInput.value = 'Abc12345!';
    passwordInput.dispatchEvent(new Event('input'));

    rolSelect.value = rolSelect.options[2].value; // 'admin'
    rolSelect.dispatchEvent(new Event('change'));

    fixture.detectChanges();

    const submitBtn = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitBtn.disabled).toBeFalse();
  });

  it('debe llamar a registrarUsuario al hacer submit cuando el formulario es válido', () => {
    spyOn(component, 'registrarUsuario');

    const nameInput = fixture.debugElement.query(By.css('input[name="name"]')).nativeElement;
    const emailInput = fixture.debugElement.query(By.css('input[name="email"]')).nativeElement;
    const passwordInput = fixture.debugElement.query(By.css('input[name="password"]')).nativeElement;
    const rolSelect = fixture.debugElement.query(By.css('select[name="rol"]')).nativeElement;

    nameInput.value = 'Diego Morales';
    nameInput.dispatchEvent(new Event('input'));

    emailInput.value = 'diego@example.com';
    emailInput.dispatchEvent(new Event('input'));

    passwordInput.value = 'Abc12345!';
    passwordInput.dispatchEvent(new Event('input'));

    rolSelect.value = rolSelect.options[2].value; // 'admin'
    rolSelect.dispatchEvent(new Event('change'));

    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form')).nativeElement;
    form.dispatchEvent(new Event('submit'));

    expect(component.registrarUsuario).toHaveBeenCalled();
  });
});
