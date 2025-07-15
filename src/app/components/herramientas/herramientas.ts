import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { JsonService } from '../../services/json.service';

/**
 * Componente que maneja las herramientas 
 * las cuales leen por json las marcas y modelos almacenados
 */


/**
 * Se crean las interfaces de Herramientas, proyecto y usuario
 * los cuales se usarán para tomar los valores.
 * Destacando que Marca y Modelo estan en un arreglo en el 
 * json Modelos-herramientas.json
 */


interface Herramienta {
  nombre: string;
  marca: string;
  modelo: string;
  proyectoActual?: string;
  usuarioCargo?: string;
  bodega: string;
}

interface Proyecto {
  nombre: string;
}

interface Usuario {
  name: string;
  email: string;
  rol: string;
}

@Component({
  selector: 'app-herramientas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './herramientas.html',
  styleUrls: ['./herramientas.scss']
})


export class Herramientas implements OnInit {
  herramientaForm!: FormGroup;
  herramientas: Herramienta[] = [];
  proyectos: Proyecto[] = [];
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];

  marcas: string[] = [];
  modelosPorMarca: { [marca: string]: string[] } = {};
  modelosFiltrados: string[] = [];

  showAdminSection: boolean = false;
  isAdmin: boolean = false;
  herramientaSeleccionada?: Herramienta;

  private marcaChangeSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object,
    private jsonService: JsonService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const user = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
      this.showAdminSection = !!(user && (user.rol === 'admin' || user.rol === 'jefatura'));
      this.isAdmin = user?.rol === 'admin' || user?.rol === 'jefatura';

      this.herramientas = JSON.parse(localStorage.getItem('herramientas') || '[]');
      this.proyectos = JSON.parse(localStorage.getItem('proyectos') || '[]');
      this.usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      this.usuariosFiltrados = this.usuarios.filter(u => u.rol && u.rol !== 'admin');

      this.jsonService.getMarcas().subscribe(data => {
        this.marcas = data;
      });

      this.jsonService.getModelosHerramientas().subscribe(data => {
        this.modelosPorMarca = {};
        data.forEach(item => {
          this.modelosPorMarca[item.marca] = item.modelos;
        });
      });
    }

    this.initForm();
  }

  initForm() {
    this.herramientaForm = this.fb.group({
      nombre: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      proyectoActual: [''],
      usuarioCargo: [''],
      bodega: ['', Validators.required]
    });
  }

    /**
     * Cuando la marca cambia, 
     * nos mostrará los modelos de esa marca seleccionada
     */
  onMarcaChange() {
    const marcaSeleccionada = this.herramientaForm.get('marca')?.value;
    this.modelosFiltrados = this.modelosPorMarca[marcaSeleccionada] || [];
    this.herramientaForm.patchValue({ modelo: '' });
  }

      /**
       * Agrega nueva herramienta
       */
  agregarHerramienta() {
    if (this.herramientaForm.valid) {
      this.herramientas.push(this.herramientaForm.value);
      localStorage.setItem('herramientas', JSON.stringify(this.herramientas));
      this.herramientaForm.reset();
    }
  }

        /**
         * Elimina herramienta seleccionada
         */

  eliminarHerramienta(nombre: string) {
    if (confirm('¿Seguro que quieres eliminar esta herramienta?')) {
      this.herramientas = this.herramientas.filter(h => h.nombre !== nombre);
      localStorage.setItem('herramientas', JSON.stringify(this.herramientas));
    }
  }

        /**
         * Modifica herramienta seleccionada, 
         * pero en caso que no sea jefatura o admin 
         * solo permite cambios seleccionados, en este caso: 
         * si esta en bodega y en que proyecto actual estan. 
         * Caso contrario, permite modificar todo.
         */
  modificarHerramienta(nombre: string) {
    this.marcaChangeSub?.unsubscribe();

    this.herramientaSeleccionada = this.herramientas.find(h => h.nombre === nombre);
    if (!this.herramientaSeleccionada) return;

    this.modelosFiltrados = this.modelosPorMarca[this.herramientaSeleccionada.marca] || [];

    if (this.isAdmin) {
      this.herramientaForm = this.fb.group({
        nombre: [this.herramientaSeleccionada.nombre, Validators.required],
        marca: [this.herramientaSeleccionada.marca, Validators.required],
        modelo: [this.herramientaSeleccionada.modelo, Validators.required],
        proyectoActual: [this.herramientaSeleccionada.proyectoActual || ''],
        usuarioCargo: [this.herramientaSeleccionada.usuarioCargo || ''],
        bodega: [this.herramientaSeleccionada.bodega, Validators.required]
      });

      this.marcaChangeSub = this.herramientaForm.get('marca')?.valueChanges.subscribe(() => {
        this.onMarcaChange();
      });

    } else {
      this.herramientaForm = this.fb.group({
        proyectoActual: [this.herramientaSeleccionada.proyectoActual || ''],
        bodega: [this.herramientaSeleccionada.bodega, Validators.required]
      });
    }
  }

        /**
         * En caso que la herramienta no tenga proyecto
         * Se marca automáticamente que esta en bodega
         */
  marcarEnBodega() {
    if (!this.herramientaSeleccionada) return;

    const index = this.herramientas.findIndex(h => h.nombre === this.herramientaSeleccionada!.nombre);
    if (index < 0) return;

    this.herramientas[index].proyectoActual = '';
    this.herramientas[index].bodega = 'En bodega';
    localStorage.setItem('herramientas', JSON.stringify(this.herramientas));

    this.cancelarEdicion();
  }

        /**
         * Guarda los cambios realizados
         */
  guardarCambios() {
    if (!this.herramientaForm.valid || !this.herramientaSeleccionada) return;

    const index = this.herramientas.findIndex(h => h.nombre === this.herramientaSeleccionada!.nombre);

    if (this.isAdmin) {
      this.herramientas[index] = this.herramientaForm.value;
    } else {
      this.herramientas[index].proyectoActual = this.herramientaForm.value.proyectoActual;
      this.herramientas[index].bodega = this.herramientaForm.value.bodega;
    }

    localStorage.setItem('herramientas', JSON.stringify(this.herramientas));
    this.cancelarEdicion();
  }

        /**
         * Cancela la edición
         */
  cancelarEdicion() {
    this.herramientaSeleccionada = undefined;
    this.modelosFiltrados = [];
    this.marcaChangeSub?.unsubscribe();
    this.initForm();
  }
}
