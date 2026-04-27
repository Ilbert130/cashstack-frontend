export interface Movimiento {
  id?: number;
  numeroCuenta: string;
  tipoMovimiento: 'DEPOSITO' | 'RETIRO'; // Valores exactos del backend
  valor: number;
  fecha?: string;
  saldoDisponible?: number;
}
