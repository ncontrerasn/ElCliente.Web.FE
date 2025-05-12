import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Producto, ProductoParaInscribir } from '../../models/producto';
import { Transaccion } from '../../models/transaccion';
import { ProductoService } from '../../services/producto.service';
import { UsuarioService } from '../../services/usuario.service';
import { TransaccionService } from '../../services/transaccion.service';
import { Inscripcion, InscripcionEliminar } from '../../models/inscripcion';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ElegirMetodoNotificacionComponent } from '../elegir-metodo-notificacion/elegir-metodo-notificacion.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from '../../models/usuario';
import { InscripcionService } from '../../services/inscripcion.service';

@Component({
  selector: 'gestion-productos',
  imports: [
    MatTabsModule,
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './gestion-productos.component.html',
  styleUrl: './gestion-productos.component.css'
})
export class GestionProductosComponent implements OnInit {
  usuario?: Usuario;
  inscribiendo: boolean = false;
  eliminando: boolean = false;
  valorInscribir: number = 0;
  opcionNotificacion: string = '';
  productos: Producto[] = [];
  productoAgregando: ProductoParaInscribir = {};
  inscripcioEliminando: InscripcionEliminar = {};
  productosNoInscritos: Producto[] = [];
  transacciones: Transaccion[] = [];
  inscripciones: Inscripcion[] = [];
  idUsuario: number = 1;

  constructor(
    private productoService: ProductoService,
    private transaccionService: TransaccionService,
    private usuarioService: UsuarioService,
    private inscripcionService: InscripcionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  abrirDialogo() {
    const dialogRef = this.dialog.open(ElegirMetodoNotificacionComponent);

    dialogRef.afterClosed().subscribe(opcion => {
      if (opcion) {
        this.opcionNotificacion = opcion;
      }
    });
  }

  ngOnInit(): void {
    this.cargarUsuario();
    this.cargarProductos();
  }

  cargarUsuario(): void {
    this.usuarioService.getUsuario(this.idUsuario).subscribe(data => {
      this.usuario = data;

      this.productoService.getProductosNoInscritos(this.usuario.id).subscribe(data => {
        this.productosNoInscritos = data;
      });

      this.transaccionService.getTransaccionesPorUsuario(this.usuario.id).subscribe(data => {
        this.transacciones = data;
      });

      this.inscripcionService.getProductosInscritos(this.usuario.id).subscribe(data => {
        this.inscripciones = data;
      });
    });
  }

  cargarProductos(): void {
    this.productoService.getProductos().subscribe(data => {
      this.productos = data;
    });
  }

  iniciarInscripcionProducto(id: number): void {
    if (!this.inscribiendo) {
      const producto = this.productosNoInscritos.find(p => p.id === id);
      if (producto) {
        producto.editando = true;
        this.valorInscribir = producto!.montoMinimo;
        this.inscribiendo = true;
        this.productoAgregando = { ...producto }
        this.productoAgregando.valorInscripcion = this.valorInscribir;
      }
      else
        return;
    }
  }

  cancelarInscripcionProducto(id: number): void {
    const producto = this.productosNoInscritos.find(p => p.id === id);
    if (producto)
      producto.editando = false;

    this.valorInscribir = 0;
    this.productoAgregando = {}
    this.inscribiendo = false;
  }

  abortarInscripcion(mensaje: string, nombre: string): void{
    this.snackBar.open(`${mensaje} ${nombre}`, 'Cerrar', {
      duration: 4000,
      panelClass: ['snack-error']
    });
    this.inscribiendo = false;
    this.valorInscribir = 0;
  }

  guardarInscripcionProducto(id: number): void {
    const producto = this.productosNoInscritos.find(p => p.id === id);
    if (producto)
      producto.editando = false;

    if (producto?.montoMinimo == null)
      return;

    if (this.usuario != null) {
      if ((this.usuario.saldo < producto?.montoMinimo || this.usuario.saldo - this.valorInscribir < 0)) {
        this.abortarInscripcion("No tiene saldo suficiente para inscribir el producto", producto.nombre);
        return;
      }
      if (this.valorInscribir < producto?.montoMinimo) {
        this.abortarInscripcion("El valor ingresado para realizar la transacción no es suficiente para adquirir el producto", producto.nombre);
        return;
      }

      this.usuario.saldo -= this.valorInscribir;
      this.usuarioService.actualizarSaldo(this.usuario.id, this.usuario.saldo).subscribe(() => {
        this.productosNoInscritos = this.productosNoInscritos.filter(p => p.id !== id);
        this.inscripcionService.inscribirProducto(producto.id, producto.nombre, this.usuario!.id, new Date).subscribe(() => {
          this.transaccionService.agregarTransaccion(producto.id, producto.nombre, this.usuario!.id, this.valorInscribir, new Date).subscribe(() => {
            this.inscripcionService.getProductosInscritos(this.usuario!.id).subscribe(data => {
              this.inscripciones = data;
              this.transaccionService.getTransaccionesPorUsuario(this.usuario!.id).subscribe(data => {
                this.transacciones = data;
                this.inscribiendo = false;
                this.valorInscribir = 0;
                this.productoAgregando = {}
                this.abrirDialogo();
              });
            });
          });
        });
      });
    }
  }

  iniciarEliminacionInscripcion(id: number): void {
    if (!this.eliminando) {
      const inscripcion = this.inscripciones.find(i => i.id === id);
      if (inscripcion)
        inscripcion.eliminando = true;

      this.eliminando = true;
      this.inscripcioEliminando = { ...inscripcion }
      this.productoAgregando.valorInscripcion = this.valorInscribir;
    }
  }

  confrimarEliminacionInscripcion(id: number): void {
    const inscripcion = this.inscripciones.find(i => i.id === id);
    if (inscripcion) {
      inscripcion.eliminando = false;

      const transaccion = this.transacciones.find(t => t.idProducto == inscripcion?.idProducto)
      if (transaccion) {
        if (this.usuario) {
          this.usuarioService.actualizarSaldo(this.usuario.id, this.usuario.saldo + transaccion.monto).subscribe(() => {
            this.usuario!.saldo += transaccion.monto;

            this.inscripcionService.eliminarInscripcion(inscripcion.id).subscribe({
              complete: () => {
                this.inscripcionService.getProductosInscritos(this.usuario!.id).subscribe(data => {
                  this.inscripciones = data;
                  const producto = this.productos.find(p => p.id === transaccion.idProducto);
                  if (producto) {
                    if (this.usuario) {
                      this.transaccionService.agregarTransaccion(producto.id, producto.nombre, this.usuario!.id, - transaccion.monto, new Date).subscribe(() => {
                        this.transaccionService.getTransaccionesPorUsuario(this.usuario!.id).subscribe(data => {
                          this.transacciones = data;
                          this.productosNoInscritos.push(producto);
                          this.productosNoInscritos = [...this.productosNoInscritos];
                          this.eliminando = false;
                          this.inscripcioEliminando = {}
                        });
                      })
                    }
                  }
                });
              }
            })
          })
        }
      }
    }
  }

  cancelarEliminacionInscripcion(id: number): void {
    const inscripcion = this.inscripciones.find(i => i.id === id);
    if (inscripcion)
      inscripcion.eliminando = false;

    this.inscripcioEliminando = {}
    this.eliminando = false;
  }

}
