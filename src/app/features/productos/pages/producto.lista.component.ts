// app.component.ts
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule} from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../services/producto.service';
import { Producto } from '../models/producto.model';
import { RouterLink } from "@angular/router";

@Component({
  standalone: true,
  selector: 'app-producto-list',
  templateUrl: './producto.lista.component.html',
  styleUrls: ['./producto.lista.component.css'],
  imports: [CommonModule,
    MatTableModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    FormsModule, RouterLink]
})
export class ProductoListaComponent {
  productos: Producto[] = [];
  filtro = {
    codigo: '',
    nombre: ''
  };

  constructor(private productoService: ProductoService, private cd: ChangeDetectorRef){}

  ngOnInit(): void {
    this.listarProductos();
    
  }

  displayedColumns: string[] = ['codigo', 'nombre', 'descripcion', 'precio'];

  listarProductos(){
    this.productoService.obtenerListaProductos().subscribe({
      next: (data) => {
        console.log("Lista de productos", data);
        this.productos = data;
        this.cd.detectChanges();
        console.log("Lista de productos en objeto this.productos", this.productos);
      },
      error: (err) => console.error('Error al cargar productos', err)
    })
  }

  filtrarProducto(){
    const codigo = Number(this.filtro.codigo);
    const nombre = this.filtro.nombre;
    console.log("Param codigo: ", codigo);
    console.log("Param nombre: ", nombre);
    if(!codigo && !nombre){
      this.listarProductos();
      return;
    }

    this.productoService.FiltrarProductoPorCodigoNombre(codigo, nombre).subscribe({
      next: (data) => {
        this.productos = data;
        this.cd.detectChanges();
      }
    })
  }
}