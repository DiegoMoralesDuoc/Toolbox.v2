import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { SidebarComponent } from './shared/sidebar/sidebar';
import { HeaderComponent } from './shared/header/header';
import { FooterComponent } from './shared/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, 
    SidebarComponent, HeaderComponent, FooterComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected title = 'toolbox';
  sidebarVisible = true;
  showMainLayout = true;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('sidebarVisible');
      this.sidebarVisible = saved !== null ? JSON.parse(saved) : true;
    } else {
      this.sidebarVisible = true;
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
        const noLayoutRoutes = ['/login'];
        const currentUrl = event.urlAfterRedirects.split('?')[0].toLowerCase();

        this.showMainLayout = !noLayoutRoutes.includes(currentUrl);
    });
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('sidebarVisible', JSON.stringify(this.sidebarVisible));
    }
    const sidebar = document.querySelector('app-sidebar');
    if (sidebar) {
      if (this.sidebarVisible) {
        sidebar.classList.add('show');
      } else {
        sidebar.classList.remove('show');
      }
    }
  }
}
