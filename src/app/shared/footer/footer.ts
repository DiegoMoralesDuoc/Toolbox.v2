import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true, // 👈 esto es clave
  imports: [],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'] // estaba mal escrito como "styleUrl"
})
export class FooterComponent {}
