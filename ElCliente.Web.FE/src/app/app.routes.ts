import { Routes } from '@angular/router';
import { GestionProductosComponent } from './components/gestion-productos/gestion-productos.component';

export const routes: Routes = [
    { path: 'gestion-productos', component: GestionProductosComponent },
    { path: '', redirectTo: '/gestion-productos', pathMatch: 'full' }
];
