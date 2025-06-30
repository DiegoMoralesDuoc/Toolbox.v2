import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Usuario {
  name: string;
  email: string;
  rol: string;
}

@Component({
  selector: 'app-listalluser',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listalluser.html',
  styleUrls: ['./listalluser.scss'],
})
export class Listalluser implements OnInit {
  usuarios: Usuario[] = [];

  ngOnInit(): void {
    this.usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  }

  eliminarUsuario(email: string) {
    if (confirm('¿Seguro que quieres eliminar este usuario?')) {
      this.usuarios = this.usuarios.filter(u => u.email !== email);
      localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
    }
  }
}
