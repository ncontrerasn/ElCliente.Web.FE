export interface ProductoParaInscribir {
    id?: number;
    nombre?: string;
    categoria?: string;
    montoMinimo?: number;
    valorInscripcion?: number;
  }

  export interface Producto {
    id: number;
    nombre: string;
    categoria: string;
    montoMinimo: number;
    editando?: boolean;
  }