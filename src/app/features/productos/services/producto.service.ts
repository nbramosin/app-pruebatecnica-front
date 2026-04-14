import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { APIResponseDTO, Producto, ProductoRequestDTO, ProductoResponseDTO } from '../models/producto.model';

@Injectable({ providedIn: 'root' })

export class ProductoService{
    private apiURL = 'http://localhost:5219/api';

    constructor(private http: HttpClient){}

    crearProducto(request: ProductoRequestDTO){
        return this.http.post<APIResponseDTO<object>>(`${this.apiURL}/Producto/producto`, request);
    }

    obtenerListaProductos(): Observable<Producto[]>{
        return this.http.get<APIResponseDTO<ProductoResponseDTO>>(`${this.apiURL}/Producto/productos`)
        .pipe(
            map((response) => (response.body?.producto || []).map(p => ({
                ...p,
                descripcion: `producto ${p.nombre}`
            })))
        );
    }

    FiltrarProductoPorCodigoNombre(codigo: number, nombre: string):Observable<Producto[]>{
        const params = new HttpParams().set('codigo', codigo).set('nombre', nombre);
        return this.http.get<APIResponseDTO<ProductoResponseDTO>>(`${this.apiURL}/Producto/buscar`, { params })
        .pipe(
            map((response) => (response.body?.producto || []).map(p => ({
                ...p,
                descripcion: `producto ${p.nombre}`
            })))
        );
    }
}