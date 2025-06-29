import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Usuario {
  email: string;
  name: string;
  password: string;
  role: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register implements OnInit {
  name: string = '';
  email: string = '';
  password: string = '';
  role: string = 'user'; // valor por defecto
  alerta: { mensaje: string; tipo: string } | null = null;

  usuarios: Usuario[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Validar permisos
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'jefatura')) {
      alert('No tienes permiso para registrar usuarios');
      this.router.navigate(['/dashboard']);
      return;
    }

    this.usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  }

  mostrarAlerta(mensaje: string, tipo: string = 'success') {
    this.alerta = { mensaje, tipo };
    setTimeout(() => (this.alerta = null), 5000);
  }

  registrarUsuario() {
    if (this.password.length < 8) {
      this.mostrarAlerta('La contraseña debe tener al menos 8 caracteres.', 'danger');
      return;
    }

    const usuarioExistente = this.usuarios.find(user => user.email === this.email);
    if (usuarioExistente) {
      this.mostrarAlerta('El usuario ya existe.', 'danger');
      return;
    }

    const nuevoUsuario: Usuario = {
      email: this.email,
      name: this.name,
      password: this.password,
      role: this.role,
    };

    this.usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
    this.mostrarAlerta('Usuario registrado exitosamente.', 'success');

    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.name = '';
    this.email = '';
    this.password = '';
    this.role = 'user';
  }
}
