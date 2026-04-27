export interface Cuenta {
  numeroCuenta: string;
  tipoCuenta: string; // Puede ser 'AHORROS' o 'CORRIENTE'
  saldoInicial: number;
  estado: boolean;
  clienteId?: string; // Opcional, dependiendo de si lo necesitas a este nivel
}
