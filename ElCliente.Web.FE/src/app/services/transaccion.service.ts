import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaccion } from '../models/transaccion';
import { environment } from '../environment/environment';

@Injectable({
    providedIn: 'root'
})
export class TransaccionService {
    private url: string = environment.apiUrl + '/Transaccion';

    constructor(private http: HttpClient) { }

    getTransaccionesPorUsuario(usuarioId: number): Observable<Transaccion[]> {
        return this.http.get<Transaccion[]>(`${this.url}/usuario/${usuarioId}`);
    }

    agregarTransaccion(idProducto: number, nombreProducto: string,  idUsuario: number, monto: number, fecha: Date): Observable<Transaccion[]> {
        return this.http.post<Transaccion[]>(this.url, {idProducto, nombreProducto, idUsuario, monto, fecha});
    }
}
