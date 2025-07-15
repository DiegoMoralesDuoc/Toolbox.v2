import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

    /**
    * Componente que permite el inicio de sesion al sistema
    */


  /**
    * Interfaz de usuario
    */

interface Usuario {
  email: string;
  name: string;
  password: string;
  rol: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: 'login.html',
  styleUrls: ['./login.scss']
})

  /**
    * Agregamos si quieremos que el usuario sea recordado
    */

export class Login implements OnInit {
  email: string = '';
  password: string = '';
  remember: boolean = false;
  usuarios: Usuario[] = [];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
    * En caso que el usuario este conectado, se redirige a dashboard automáticamente
    */
  ngOnInit(): void {
      console.log('[LoginComponent] ngOnInit called');
    if (isPlatformBrowser(this.platformId)) {
      const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
          console.log('[LoginComponent] ngOnInit - isLoggedIn from sessionStorage:', isLoggedIn);
      if (isLoggedIn) {
              console.log('[LoginComponent] ngOnInit - Already logged in, redirecting to dashboard');
        this.router.navigate(['dashboard']);
        return;
      }

      this.usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

      const adminExiste = this.usuarios.some(
        (user) => user.email === 'diego.morales.alfaro@gmail.com'
      );

  /**
    * Se crea automáticamente un usuario tipo admin 
    * como primer usuario de forma automática, 
    * solo en el caso que no exista otro usuario tipo admin
    */
      if (!adminExiste) {
        const adminDefault: Usuario = {
          email: 'diego.morales.alfaro@gmail.com',
          name: 'Diego Morales Alfaro',
          password: 'admin',
          rol: 'admin',
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

    /**
    * Permite hacer el login de usuario
    * siempre y cuando el correo con la contraseña coincidan
    */
  public login(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const usuario = this.usuarios.find(
      (user) => user.email === this.email && user.password === this.password
    );
  /**
    * Guarda sesión
    */

    if (usuario) {
      console.log('SESION GUARDADA');
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('currentUser', JSON.stringify(usuario));

  /**
    * Guardar o eliminar correo recordado
    */

      if (this.remember) {
        localStorage.setItem('savedEmail', this.email);
        localStorage.setItem('remember', 'true');
      } else {
        localStorage.removeItem('savedEmail');
        localStorage.removeItem('remember');
      }

  /**
    * Alertas de inicio de sesión exitoso o fallido
    */
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
