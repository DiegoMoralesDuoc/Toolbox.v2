import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Materiales } from './materiales';
import { ReactiveFormsModule } from '@angular/forms';
import { JsonService } from '../../services/json.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

describe('Materiales (pruebas específicas)', () => {
  let component: Materiales;
  let fixture: ComponentFixture<Materiales>;
  let mockJsonService: jasmine.SpyObj<JsonService>;

  beforeEach(async () => {
    mockJsonService = jasmine.createSpyObj('JsonService', ['getMateriales']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, Materiales],
      providers: [
        { provide: JsonService, useValue: mockJsonService },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Materiales);
    component = fixture.componentInstance;

    /**
     * Espías para localStorage
     **/

    spyOn(window.localStorage, 'getItem').and.returnValue(null);
    spyOn(window.localStorage, 'setItem');
  });

  it('Seleccionar correctamente una categoría', () => {
    const categoria = { categoria: 'Madera', materiales: [] };
    component.seleccionarCategoria(categoria);

    expect(component.categoriaSeleccionada).toEqual(categoria);
    expect(component.isEditing).toBeFalse();
  });

  it('Eliminar correctamente un material', () => {
    const mat = { nombre: 'Pino', tamano: '2x4' };
    const cat = { categoria: 'Madera', materiales: [mat] };
    component.seleccionarCategoria(cat);

    /**
     * Simula confirmación de usuario
     **/
    spyOn(window, 'confirm').and.returnValue(true); 

    component.eliminarMaterial(mat);

    expect(cat.materiales.length).toBe(0);
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('Cancelar la edición', () => {
    component.initForm();
    component.isEditing = true;
    component.materialSeleccionado = { nombre: 'ABC', tamano: 'XYZ' };
    component.materialForm.setValue({ nombre: 'ABC', tamano: 'XYZ' });

    component.cancelarEdicion();

    expect(component.isEditing).toBeFalse();
    expect(component.materialSeleccionado).toBeUndefined();
    expect(component.materialForm.value).toEqual({ nombre: null, tamano: null });
  });

  it('deberia leer los datos desde jsonService si no hay localStorage', () => {
    const mockMateriales = [
      {
        categoria: 'Metales',
        materiales: [{ nombre: 'Acero Liviano', tamano: '6x6' }]
      }
    ];
    mockJsonService.getMateriales.and.returnValue(of(mockMateriales));

    component.ngOnInit();

    expect(mockJsonService.getMateriales).toHaveBeenCalled();
    expect(component.materiales).toEqual(mockMateriales);
    expect(localStorage.setItem).toHaveBeenCalledWith('materiales', JSON.stringify(mockMateriales));
  });
});
