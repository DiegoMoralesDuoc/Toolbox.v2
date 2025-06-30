import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

interface SmallBox {
  number: number | string;
  sup?: string;
  text: string;
  bgClass: string;
  svgPath: string;
  linkClass: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports: [
    CommonModule,
    FormsModule
  ],
})
export class Dashboard implements OnInit {
  smallBoxes: SmallBox[] = [];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const user = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
      if (!user && this.router.url !== '/login') {
        alert('Debes iniciar sesión para acceder a esta página.');
        this.router.navigate(['/login']);
        return;
      }

      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');

      this.smallBoxes = [
        {
          number: usuarios.length,
          text: 'Usuarios Registrados',
          bgClass: 'primary',
          svgPath: `<path d="M6.25 6.375a4.125 4.125 0 118.25 0 ..."></path>`,
          linkClass: 'link-light link-underline-opacity-0 link-underline-opacity-50-hover'
        },
        {
          number: tickets.length,
          text: 'Tickets Levantados',
          bgClass: 'success',
          svgPath: `<path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c..."></path>`,
          linkClass: 'link-light link-underline-opacity-0 link-underline-opacity-50-hover'
        },
        {
          number: '53',
          sup: '%',
          text: 'Bounce Rate',
          bgClass: 'warning',
          svgPath: `<path d="M2.25 13.5a8.25 8.25 0 018.25-8.25..."></path>`,
          linkClass: 'link-dark link-underline-opacity-0 link-underline-opacity-50-hover'
        },
        {
          number: 65,
          text: 'Unique Visitors',
          bgClass: 'danger',
          svgPath: `<path d="M6.25 6.375a4.125 4.125 0 118.25 0 ..."></path>`,
          linkClass: 'link-light link-underline-opacity-0 link-underline-opacity-50-hover'
        }
      ];
    }
  }
}
