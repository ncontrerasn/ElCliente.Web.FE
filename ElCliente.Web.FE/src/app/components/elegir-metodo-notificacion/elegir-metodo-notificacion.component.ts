import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-elegir-metodo-notificacion',
  imports: [
    MatDialogModule
  ],
  templateUrl: './elegir-metodo-notificacion.component.html',
  styleUrl: './elegir-metodo-notificacion.component.css'
})
export class ElegirMetodoNotificacionComponent {
  constructor(private dialogRef: MatDialogRef<ElegirMetodoNotificacionComponent>) {}

  cerrar(opcion: 'correo' | 'sms') {
    this.dialogRef.close(opcion);
  }
}
