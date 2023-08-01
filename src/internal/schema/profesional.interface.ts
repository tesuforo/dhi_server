export type IProfessional = {
    id: number;
    estado: string;
    nombre: string;
    identificacion: string;
    cargo: string;
    especialidad: string;
    sexo: string;
    correo: string;
    telefono: string;
    disponible_agenda: boolean;
    user_created: string; // UUID
    date_created: string; // Formato de fecha/hora: "YYYY-MM-DDTHH:mm:ss"
    user_updated: string; // UUID
    date_updated: string; // Formato de fecha/hora: "YYYY-MM-DDTHH:mm:ss"
    avatar: string; // UUID
}