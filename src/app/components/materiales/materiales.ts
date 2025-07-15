import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { JsonService } from '../../services/json.service';

    /**
    * Componente que visualiza, registra, modifica y elimina
    * materiales
    */


  /**
    * Interfaz del detalle del material
    * e 
    * Interfaz de la categoria del material
    */

interface MaterialDetalle {
  nombre: string;
  tamano: string;
}

interface MaterialCategoria {
  categoria: string;
  materiales: MaterialDetalle[];
}

@Component({
  selector: 'app-materiales',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './materiales.html',
  styleUrls: ['./materiales.scss']
})

  /**
    * El material obtiene los datos del json
    * materiales.json
    * el cual es modificable tipo metodo CRUD
    */

export class Materiales implements OnInit {
  materiales: MaterialCategoria[] = [];
  materialForm!: FormGroup;
  categoriaSeleccionada?: MaterialCategoria;
  materialSeleccionado?: MaterialDetalle;
  isEditing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private jsonService: JsonService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    
  /**
    * Carga primero todos los materiales
    */

    this.initForm();

  /**
    * Selecciona los materiales del local storage (json)
    */

    if (isPlatformBrowser(this.platformId)) {
      const guardados = localStorage.getItem('materiales');
      if (guardados) {
        this.materiales = JSON.parse(guardados);
        if (this.materiales.length > 0) {
          this.seleccionarCategoria(this.materiales[0]);
        }
      } else {
        this.jsonService.getMateriales().subscribe(data => {
          console.log('Materiales cargados:', data);
          this.materiales = data;
          localStorage.setItem('materiales', JSON.stringify(this.materiales));
          if (this.materiales.length > 0) {
            this.seleccionarCategoria(this.materiales[0]);
          }
        });
      }
    }
    this.initForm();
  }

  /**
    * Se marca nombre y tamano del material como requeridos
    */  

  initForm() {
    this.materialForm = this.fb.group({
      nombre: ['', Validators.required],
      tamano: ['', Validators.required]
    });
  }

  /**
    *  Garantiza que haya arreglo el cat.materiales = [];
    */   
  seleccionarCategoria(cat: MaterialCategoria) {
    if (!cat.materiales) {
      cat.materiales = []; 
    }
    this.categoriaSeleccionada = cat;
    this.cancelarEdicion();
  }

    /**
    * Selecciona el material
    */

  seleccionarMaterial(mat: MaterialDetalle) {
    this.isEditing = true;
    this.materialSeleccionado = mat;
    this.materialForm.patchValue(mat);
  }

    /**
    * Cancela la edicion
    */

  cancelarEdicion() {
    this.isEditing = false;
    this.materialSeleccionado = undefined;
    if (this.materialForm) {
      this.materialForm.reset();
    }
  }

    /**
    * guarda el material seleccionado
    */  
  guardarMaterial() {
    if (!this.categoriaSeleccionada) {
      alert('Seleccione una categoría primero.');
      return;
    }
    if (this.materialForm.invalid) return;

    const nuevoMaterial: MaterialDetalle = this.materialForm.value;

    if (this.isEditing && this.materialSeleccionado) {
      const index = this.categoriaSeleccionada.materiales.findIndex(m => m === this.materialSeleccionado);
      if (index > -1) {
        this.categoriaSeleccionada.materiales[index] = nuevoMaterial;
      }
    } else {
      this.categoriaSeleccionada.materiales.push(nuevoMaterial);
    }

    localStorage.setItem('materiales', JSON.stringify(this.materiales));
    this.cancelarEdicion();
  }

    /**
    * elimina el material seleccionado
    */  
   
  eliminarMaterial(mat: MaterialDetalle) {
    if (!this.categoriaSeleccionada) return;
    if (confirm('¿Seguro que quieres eliminar este material?')) {
      this.categoriaSeleccionada.materiales = this.categoriaSeleccionada.materiales.filter(m => m !== mat);
      localStorage.setItem('materiales', JSON.stringify(this.materiales));
      if (this.materialSeleccionado === mat) {
        this.cancelarEdicion();
      }
    }
  }
}
