import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

    /**
    * Componente que muestra los datos del usuario conectado
    * y permite modificar sus datos como correo y contraseña
    */


    /**
    * interfaz de usuario
    */

interface Usuario {
  email: string;
  name: string;
  password?: string;
  rol?: string;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.html',
  standalone: true,
  styleUrls: ['./perfil.scss'],
  imports: [ CommonModule,FormsModule]
})

    /**
    * Solo se puede modificar el correo y contraseña
    * del usuario conectado
    */

export class Perfil implements OnInit {
  currentUser: Usuario | null = null;
  nuevoCorreo: string = '';
  nuevaPassword: string = '';

    /**
    * Obtencion de dato del usuario conectado 
    */

  ngOnInit(): void {
    const userData = sessionStorage.getItem('currentUser');
    this.currentUser = userData ? JSON.parse(userData) : null;
  }

    /**
    * Actualizacion de datos del usuario, en caso que el usuario actual 
    * sea distinto al conectado, retrocede.
    * 
    * Solo permite el cambio de contraseña y de correo
    */  
  actualizarDatos(): void {
    if (!this.currentUser) return;

    let usuarios: Usuario[] = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const index = usuarios.findIndex(u => u.email === this.currentUser!.email);

    if (index !== -1) {
      if (this.nuevoCorreo.trim() !== '') {
        usuarios[index].email = this.nuevoCorreo.trim();
      }
      if (this.nuevaPassword !== '') {
        usuarios[index].password = this.nuevaPassword;
      }

    /**
    * Actualizar sessionStorage y localStorage
    */      
      sessionStorage.setItem('currentUser', JSON.stringify(usuarios[index]));
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      alert('Datos actualizados correctamente.');    

      this.currentUser = usuarios[index];
      this.nuevoCorreo = '';
      this.nuevaPassword = '';
    } else {
      alert('Error: Usuario no encontrado.');
    }
  }
}