import { Component, OnInit, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

    /**
    * Componente que tiene el sidebar estatico del sistema
    */

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export class SidebarComponent implements OnInit {
  showAdminSection = false;
  @Input() visible = true;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

    /**
    * Funcionalidad que dependiendo del rol
    * muestra otras paginas para acceder si es admin o jefatura
    */

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const user = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
      this.showAdminSection = !!(user && (user.rol === 'admin' || user.rol === 'jefatura'));
    }
  }
}
