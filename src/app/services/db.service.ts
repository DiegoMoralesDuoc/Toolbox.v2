import { Injectable } from '@angular/core';

export interface Usuario {
  email: string;
  name: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private key = 'usuarios';

  constructor() {}

  obtenerUsuarios(): Usuario[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  registrarUsuario(email: string, name: string, password: string): { exito: boolean, mensaje: string } {
    const usuarios = this.obtenerUsuarios();
    const usuarioExistente = usuarios.find(user => user.email === email);

    if (usuarioExistente) {
      return { exito: false, mensaje: 'El usuario ya existe.' };
    }

    const nuevoUsuario = { email, name, password };
    usuarios.push(nuevoUsuario);
    localStorage.setItem(this.key, JSON.stringify(usuarios));
    return { exito: true, mensaje: 'Usuario registrado exitosamente.' };
  }

  iniciarSesion(email: string, password: string): { exito: boolean, mensaje: string, usuario?: Usuario } {
    const usuarios = this.obtenerUsuarios();
    const usuario = usuarios.find(user => user.email === email && user.password === password);
    if (usuario) {
      return { exito: true, mensaje: 'Inicio de sesión exitoso.', usuario };
    } else {
      return { exito: false, mensaje: 'Email o contraseña incorrectos.' };
    }
  }
}
