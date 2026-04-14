export interface Producto{
    id?: number;
    nombre?: string;
    precio?: number;
    fechaCreacion?: Date
}

export interface ProductoRequestDTO{
    nombre: string;
    precio: number;
    fechaCreacion: Date;
}

export interface ProductoResponseDTO{
  producto: Producto[];
}

export interface APIResponseDTO<T>{
    header: HeaderDTO;
    body: T;
}

export interface HeaderDTO{
    codigoRetorno: number;
    descRetorno: string;
}