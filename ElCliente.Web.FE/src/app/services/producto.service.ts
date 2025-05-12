import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private url: string = environment.apiUrl + '/Producto'; 

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.url);
  }

  getProductosNoInscritos(idUsuario: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.url}/no-inscritos/${idUsuario}`);
  }

  inscribirProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.url, producto);
  }

  cancelarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
