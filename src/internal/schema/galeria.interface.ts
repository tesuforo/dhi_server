
export interface Galeria {
    id: number;
    estado: string;
    orden: number;
    user_created: string; // UUID
    date_created: string; // Formato de fecha/hora: "YYYY-MM-DDTHH:mm:ss"
    user_updated: string; // UUID
    date_updated: string; // Formato de fecha/hora: "YYYY-MM-DDTHH:mm:ss"
    descripcion: string;
}

export interface GaleriaFile {
    id: number;
    galeria_id: Galeria;
    directus_files_id: string; // UUID
}