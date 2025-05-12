export interface Transaccion {
    id: number;
    idUsuario: number;
    idProducto: number;
    nombreProducto: string;
    fecha: Date;// Formato ISO: "2024-05-09T14:23:00Z"
    monto: number;
  }