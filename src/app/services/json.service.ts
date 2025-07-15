import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

    /**
    * Componente que obtiene json locales y de github
    */

export interface MaterialDetalle {
  nombre: string;
  tamano: string;
}

export interface MaterialCategoria {
  categoria: string;
  materiales: MaterialDetalle[];
}

@Injectable({
  providedIn: 'root'
})

    /**
    * Se obtiene json de github con regiones y comunas como arreglo
    */

export class JsonService {

  private regionComuna  = 'https://raw.githubusercontent.com/DiegoMoralesDuoc/json-api/main/regiones-comunas.json';
  private marcas = 'assets/marcas.json';
  private modelosHerramientas = 'assets/modelos-herramientas.json';
  private materiales = 'assets/materiales.json';

  constructor(private http: HttpClient) {}

  getRegionesYComunas(): Observable<{ region: string, comunas: string[] }[]> {
    return this.http.get(this.regionComuna, { responseType: 'text' }).pipe(
      map(response => JSON.parse(response))
    );
  }

  getMarcas(): Observable<string[]> {
  return this.http.get<string[]>(this.marcas);
}

  getModelosHerramientas(): Observable<{ marca: string; modelos: string[] }[]> {
    return this.http.get<{ marca: string; modelos: string[] }[]>(this.modelosHerramientas);
  }

  getMateriales(): Observable<MaterialCategoria[]> {
    return this.http.get<MaterialCategoria[]>(this.materiales);
  }
}
