import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { Inscripcion } from '../models/inscripcion';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {
  private url: string = environment.apiUrl + '/Inscripcion'; 

  constructor(private http: HttpClient) {}

  getProductosInscritos(idUsuario: number): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(`${this.url}/usuario/${idUsuario}`);
  }

  inscribirProducto(idProducto: number,nombreProducto: string ,idUsuario: number, fecha: Date): Observable<Inscripcion[]> {
    return this.http.post<Inscripcion[]>(this.url, {idProducto, nombreProducto, idUsuario, fecha});
  }

  eliminarInscripcion(inscripcionId: number): Observable<Inscripcion[]> {
    return this.http.delete<Inscripcion[]>(`${this.url}/${inscripcionId}`);
  }

}
 