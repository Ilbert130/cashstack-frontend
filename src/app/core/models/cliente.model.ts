import { Cuenta } from './cuenta.model';

export interface Cliente {
  id?: number; // Opcional, por si tu base de datos lo sigue enviando internamente
  clienteid: string; // <-- Ajustado en minúsculas según tu JSON
  nombre: string;
  genero: 'MASCULINO' | 'FEMENINO' | 'OTRO';
  edad: number;
  identificacion: string;
  direccion: string;
  telefono: string;
  contrasena?: string; // <-- Necesario para enviar desde el formulario
  cuentas?: Cuenta[];
}
