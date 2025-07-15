import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

    /**
    * Componente que registra nuevos usuarios
    */


    /**
    * interfaz de usuario
    */

interface Usuario {
  email: string;
  name: string;
  password: string;
  rol: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  imports: [FormsModule,CommonModule  ]
})

    /**
    * Se toman los valores de un registro de nuevo usuario
    * nombre, correo, contrasena y rol
    */

export class Register implements OnInit {
  name: string = '';
  email: string = '';
  password: string = '';
  rol: string = 'user'; // valor por defecto
  alerta: { mensaje: string; tipo: 'success' | 'danger' | 'warning' } | null = null;

  usuarios: Usuario[] = [];

  constructor(private router: Router) {}

    /**
    * Se validan los permisos para registrar usuarios
    */

  ngOnInit(): void {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
    if (!currentUser || (currentUser.rol !== 'admin' && currentUser.rol !== 'jefatura')) {
      alert('No tienes permiso para registrar usuarios');
      this.router.navigate(['/dashboard']);
      return;
    }

    this.usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  }

  mostrarAlerta(mensaje: string, tipo: 'success' | 'danger' | 'warning' = 'success') {
    this.alerta = { mensaje, tipo };
    setTimeout(() => (this.alerta = null), 5000);
  }

    /**
    * Validacion que contraseña tenga
    * Al menos 8 caracteres, 1 mayúscula, 1 número y 1 símbolo
    */

  validarContrasena(password: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  }

    /**
    * Validacion qque tenga todos los campos requeridos
    */  
  registrarUsuario() {
    if (!this.name.trim() || !this.email.trim() || !this.password) {
      this.mostrarAlerta('Por favor completa todos los campos.', 'danger');
      return;
    }

    if (!this.validarContrasena(this.password)) {
      this.mostrarAlerta(
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.',
        'danger'
      );
      return;
    }

    /**
    * No permite crear un usuario con un correo 
    * ya registrado
    */

    const usuarioExistente = this.usuarios.find(user => user.email === this.email);
    if (usuarioExistente) {
      this.mostrarAlerta('El usuario ya existe.', 'danger');
      return;
    }

    const nuevoUsuario: Usuario = {
      email: this.email,
      name: this.name,
      password: this.password,
      rol: this.rol,
    };

    this.usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
    this.mostrarAlerta('Usuario registrado exitosamente.', 'success');

    this.limpiarFormulario();
  }
    /**
    * Limpia el formulario
    */

  limpiarFormulario() {
    this.name = '';
    this.email = '';
    this.password = '';
    this.rol = 'user';
  }
}