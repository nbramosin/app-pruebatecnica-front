import { Routes } from '@angular/router';
import { ProductoListaComponent } from './features/productos/pages/producto.lista.component';
import { ProductoFormComponent } from './features/productos/pages/producto.form.component';

export const routes: Routes = [
    // Ruta por defecto
    { path: '', redirectTo: 'producto/lista', pathMatch: 'full' },

    { path: 'producto/lista', component: ProductoListaComponent },
    { path: 'producto/crear', component: ProductoFormComponent },

  // opcional: fallback
  { path: '**', redirectTo: 'producto/lista' }
];
