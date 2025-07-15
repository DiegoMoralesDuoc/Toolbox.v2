import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

    /**
    * Componente que obtiene y muestra todos los tickets del sistema
    */


    /**
    * Interfaz de tickets
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
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tickets.html',
  styleUrls: ['./tickets.scss']
})
export class Tickets implements OnInit {
  tickets: Ticket[] = [];

    /**
    *  Obtencion de todos los tickets levantados
    */  
  ngOnInit(): void {
    this.tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
  }

    /**
    * Eliminar un ticket levantado
    */

  eliminarTicket(id: number) {
    if (confirm('¿Seguro que quieres eliminar este ticket?')) {
      this.tickets = this.tickets.filter(t => t.id !== id);
      localStorage.setItem('tickets', JSON.stringify(this.tickets));
    }
  }
}
