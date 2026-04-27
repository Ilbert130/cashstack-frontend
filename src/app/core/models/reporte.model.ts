export interface ReporteEstadoCuenta {
  cliente: string;
  fechaInicio: string;
  fechaFin: string;
  cuentas: CuentaReporte[];
  pdfBase64: string;
}

export interface CuentaReporte {
  numeroCuenta: string;
  tipo: string;
  saldoActual: number;
  totalDebitos: number;
  totalCreditos: number;
  movimientos: MovimientoReporte[];
}

export interface MovimientoReporte {
  id: number;
  fecha: string;
  tipoMovimiento: string;
  valor: number;
  saldo: number;
}
