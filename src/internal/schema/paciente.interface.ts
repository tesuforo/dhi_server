export interface IPatient {
    id?: number;
    estado?: string;
    tipo_documento?: string;
    documento?: string;
    nombres: string;
    apellido_paterno: string;
    apellido_materno?: string;
    fecha_nacimiento?: string; // Formato de fecha: "YYYY-MM-DD"
    genero?: string;
    correo: string;
    indicativo: string;
    telefono: string;
    indicativo_2: string;
    telefono_2?: string;
    registrado?: boolean;
    estado_civil?: string;
    user_created?: string; // UUID
    date_created?: string; // Formato de fecha/hora: "YYYY-MM-DDTHH:mm:ss"
    user_updated?: string; // UUID
    date_updated?: string; // Formato de fecha/hora: "YYYY-MM-DDTHH:mm:ss"
}

export interface IPatientFile {
    id: number;
    pacientes_id: IPatient;
    directus_files_id: string; // UUID
}

export interface IPatientGaleria {
    id: number;
    pacientes_id: IPatient;
    galeria_id: number;
}