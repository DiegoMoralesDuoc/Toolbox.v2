import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { FooterComponent } from '../../shared/footer/footer';
import { FormsModule } from '@angular/forms';

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
  imports: [HeaderComponent, SidebarComponent, FooterComponent, FormsModule]
})
export class Perfil implements OnInit {
  currentUser: Usuario | null = null;
  nuevoCorreo: string = '';
  nuevaPassword: string = '';

  ngOnInit(): void {
    const userData = sessionStorage.getItem('currentUser');
    this.currentUser = userData ? JSON.parse(userData) : null;
  }

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

      // Actualizar sessionStorage y localStorage
      sessionStorage.setItem('currentUser', JSON.stringify(usuarios[index]));
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      alert('Datos actualizados correctamente.');
      // Puedes recargar o actualizar la vista, o resetear inputs:
      this.currentUser = usuarios[index];
      this.nuevoCorreo = '';
      this.nuevaPassword = '';
    } else {
      alert('Error: Usuario no encontrado.');
    }
  }
}
