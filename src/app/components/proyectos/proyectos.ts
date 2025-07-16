import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { JsonService } from '../../services/json.service';

    /**
    * Componente que registra, 
    * muestra
    * modifica
    * y elimina proyectos
    */


    /**
    * Interfaces de usuario y proyecto
    */

interface Usuario {
  name: string;
  email: string;
  rol: string;
}

interface Proyecto {
  nombre: string;
  region: string;
  comuna: string;
  direccion: string;
  jefe: string;
}

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './proyectos.html',
  styleUrls: ['./proyectos.scss']
})

    /**
    * Se obtiene la información de la cual se requiere trabajar
    * la region y comuna se obtiene de un json en un git
    */

export class Proyectos implements OnInit {
  proyectoForm!: FormGroup;
  proyectos: Proyecto[] = [];
  jefes: Usuario[] = [];
  showAdminSection: boolean = false;
  regiones: string[] = [];
  comunasPorRegion: { [region: string]: string[] } = {};
  comunasFiltradas: string[] = [];

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object,
    private jsonService: JsonService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const user = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
      this.showAdminSection = !!(user && (user.rol === 'admin' || user.rol === 'jefatura'));

      const usuarios: Usuario[] = JSON.parse(localStorage.getItem('usuarios') || '[]');
      this.jefes = usuarios.filter(u => u.rol === 'jefatura');

      this.proyectos = JSON.parse(localStorage.getItem('proyectos') || '[]');
    } else {
      this.jefes = [];
      this.proyectos = [];
    }

    /**
    * Se validan los campos requeridos
    */

    this.proyectoForm = this.fb.group({
      nombre: ['', Validators.required],
      region: ['', Validators.required],
      comuna: ['', Validators.required],
      direccion: ['', Validators.required],
      jefe: ['', Validators.required]
    });

    /**
    * Se obtiene la informacion de regiones y comunas por regiones 
    * por jsonservice
    */    

      this.jsonService.getRegionesYComunas().subscribe(data => {
      this.comunasPorRegion = {};
      this.regiones = [];

      data.forEach(item => {
        this.regiones.push(item.region);
        this.comunasPorRegion[item.region] = item.comunas;
      });
    });

    /**
    * Cambia las comunas en caso que otra region haya sido seleccionada
    */    
    this.proyectoForm.get('region')?.valueChanges.subscribe(() => {
      this.onRegionChange();
    });
  }


  onRegionChange() {
    const regionSeleccionada = this.proyectoForm.get('region')?.value;
    this.comunasFiltradas = this.comunasPorRegion[regionSeleccionada] || [];
    this.proyectoForm.patchValue({ comuna: '' });
  }

  agregarProyecto() {
    if (this.proyectoForm.valid) {
      this.proyectos.push(this.proyectoForm.value);
      localStorage.setItem('proyectos', JSON.stringify(this.proyectos));
      this.proyectoForm.reset();
    }
  }

  eliminarProyecto(nombre: string) {
    if (confirm('¿Seguro que quieres eliminar este proyecto?')) {
      this.proyectos = this.proyectos.filter(p => p.nombre !== nombre);
      localStorage.setItem('proyectos', JSON.stringify(this.proyectos));
    }
  }
}
