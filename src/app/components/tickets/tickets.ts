import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  ngOnInit(): void {
    this.tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
  }

  eliminarTicket(id: number) {
    if (confirm('¿Seguro que quieres eliminar este ticket?')) {
      this.tickets = this.tickets.filter(t => t.id !== id);
      localStorage.setItem('tickets', JSON.stringify(this.tickets));
    }
  }
}
