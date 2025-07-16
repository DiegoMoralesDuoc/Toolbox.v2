import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Herramientas } from './herramientas';
import { JsonService } from '../../services/json.service';
import { of } from 'rxjs';

describe('Herramientas', () => {
  let component: Herramientas;
  let fixture: ComponentFixture<Herramientas>;
  let mockJsonService: jasmine.SpyObj<JsonService>;

  beforeEach(async () => {
    mockJsonService = jasmine.createSpyObj('JsonService', [
      'getMarcas',
      'getModelosHerramientas',
    ]);

    // Retornos simulados
    mockJsonService.getMarcas.and.returnValue(of([]));
    mockJsonService.getModelosHerramientas.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [
        Herramientas,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: JsonService, useValue: mockJsonService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Herramientas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
