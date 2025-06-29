import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface Usuario {
  email: string;
  name: string;
  password: string;
  role: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],  template: `<h1>Login Test</h1>
    <form (ngSubmit)="login()">
      <input [(ngModel)]="email" name="email" placeholder="Email" />
      <input [(ngModel)]="password" name="password" placeholder="Password" type="password" />
      <button type="submit">Ingresar</button>
    </form>
  `
})
export class Login implements OnInit {
  email: string = '';
  password: string = '';
  remember: boolean = false;
  usuarios: Usuario[] = [];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
      if (isLoggedIn) {
        this.router.navigate(['dashboard']);
        return;
      }

      this.usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

      const adminExiste = this.usuarios.some(
        (user) => user.email === 'diego.morales.alfaro@gmail.com'
      );

      if (!adminExiste) {
        const adminDefault: Usuario = {
          email: 'diego.morales.alfaro@gmail.com',
          name: 'Diego Morales Alfaro',
          password: 'admin',
          role: 'admin',
        };
        this.usuarios.push(adminDefault);
        localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
        console.log('Usuario admin creado automáticamente');
      }

      const savedEmail = localStorage.getItem('savedEmail');
      const remember = localStorage.getItem('remember');

      if (remember === 'true' && savedEmail) {
        this.email = savedEmail;
        this.remember = true;
      }
    }
  }

  public login(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const usuario = this.usuarios.find(
      (user) => user.email === this.email && user.password === this.password
    );

    if (usuario) {
      // Guardar sesión
      console.log('SESION GUARDADA');
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('currentUser', JSON.stringify(usuario));

      // Guardar o eliminar correo recordado
      if (this.remember) {
        localStorage.setItem('savedEmail', this.email);
        localStorage.setItem('remember', 'true');
      } else {
        localStorage.removeItem('savedEmail');
        localStorage.removeItem('remember');
      }

      Swal.fire({
        icon: 'success',
        title: '¡Inicio de sesión exitoso!',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        this.router.navigate(['/dashboard']);
      });

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Correo o contraseña incorrectos',
        confirmButtonText: 'Intentar de nuevo'
      });
    }
  }
}
