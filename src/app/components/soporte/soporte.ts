import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

    /**
    * Componente que registra nuevos tickets en el sistema
    */


    /**
    * Interfaz de ticket
    */

interface Ticket {
  id: number;
  asunto: string;
  fecha: string;
  problemaRelacionado: string;
  descripcion: string;
  estado: string;
}

@Component({
  selector: 'app-soporte',
  standalone: true,
  templateUrl: './soporte.html',
  styleUrls: ['./soporte.scss'],
  imports: [FormsModule]
})
export class Soporte implements OnInit {
  hoy: string = '';
  asunto: string = '';
  fecha: string = '';
  problemaRelacionado: string = 'Usuarios';
  descripcion: string = '';

  ngOnInit() {
    const hoy = new Date();
    this.hoy = hoy.toISOString().split('T')[0];
  }

    /**
    * Registro de nuevo ticket
    * con alerta en caso que falten campos por completar
    */  
   
  registrarTicket() {
    if (!this.asunto || !this.fecha || !this.descripcion) {
      Swal.fire('Faltan campos', 'Completa todos los campos obligatorios', 'warning');
      return;
    }

    const tickets: Ticket[] = JSON.parse(localStorage.getItem('tickets') || '[]');

    /**
    * Obtencion de valores de los campos del ticket 
    */

    const nuevoTicket: Ticket = {
      id: Date.now(),
      asunto: this.asunto.trim(),
      fecha: this.fecha,
      problemaRelacionado: this.problemaRelacionado,
      descripcion: this.descripcion.trim(),
      estado: 'Abierto'
    };

    tickets.push(nuevoTicket);
    localStorage.setItem('tickets', JSON.stringify(tickets));

    Swal.fire('Enviado', 'El ticket fue registrado correctamente', 'success');

    /**
    * Limpia el formulario
    */

    this.asunto = '';
    this.fecha = '';
    this.problemaRelacionado = 'Usuarios';
    this.descripcion = '';
  }
}
