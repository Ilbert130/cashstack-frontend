export interface Cuenta {
  numeroCuenta?: string;
  tipoCuenta: 'AHORRO' | 'CORRIENTE'; // Quitamos la "S"
  saldoInicial: number;
  clienteId: string;
}
