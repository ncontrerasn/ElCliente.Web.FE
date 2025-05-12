export interface Inscripcion {
    id: number;
    idUsuario: number;
    idProducto: number;
    nombreProducto: string;
    fecha: Date;// Formato ISO: "2024-05-09T14:23:00Z"
    eliminando?: boolean;
  }

  export interface InscripcionEliminar {
    id?: number;
    idUsuario?: number;
    idProducto?: number;
    producto?: string;
    fecha?: Date;// Formato ISO: "2024-05-09T14:23:00Z"
  }