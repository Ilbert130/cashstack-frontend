import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cuenta } from '../models/cuenta.model';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  private http = inject(HttpClient);

  // Mantenemos tu URL base con la versión v1
  private apiUrl = 'http://localhost:8080/api/v1/cuentas';

  /**
   * Obtiene la lista de todas las cuentas registradas
   */
  listarCuentas(): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>(this.apiUrl);
  }

  /**
   * Busca cuentas por número de cuenta o ID de cliente en el backend
   * @param termino El texto a buscar
   */
  buscarCuentas(termino: string): Observable<Cuenta[]> {
    const params = new HttpParams().set('termino', termino);
    return this.http.get<Cuenta[]>(`${this.apiUrl}/buscar`, { params });
  }

  /**
   * Envía los datos para crear una nueva cuenta.
   * Cumple con el CuentaRequestDTO (clienteId, tipoCuenta, saldoInicial)
   */
  crearCuenta(cuenta: Cuenta): Observable<Cuenta> {
    return this.http.post<Cuenta>(this.apiUrl, cuenta);
  }

  /**
   * Elimina una cuenta utilizando su número de cuenta como identificador.
   */
  eliminarCuenta(numeroCuenta: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${numeroCuenta}`);
  }

  /**
   * Obtiene una cuenta específica por su número
   */
  obtenerCuentaPorNumero(numeroCuenta: string): Observable<Cuenta> {
    return this.http.get<Cuenta>(`${this.apiUrl}/${numeroCuenta}`);
  }

  actualizarTipoCuenta(numeroCuenta: string, tipoCuenta: 'AHORRO' | 'CORRIENTE'): Observable<Cuenta> {
    // El backend espera ?tipoCuenta=...
    const params = new HttpParams().set('tipoCuenta', tipoCuenta);

    // En Patch el cuerpo puede ir null si solo usamos parámetros
    return this.http.patch<Cuenta>(`${this.apiUrl}/${numeroCuenta}`, null, { params });
  }
}
