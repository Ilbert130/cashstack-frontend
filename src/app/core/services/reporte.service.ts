import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReporteEstadoCuenta } from '../models/reporte.model';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private http = inject(HttpClient);

  // URL ajustada al controlador de Spring Boot
  private apiUrl = 'http://localhost:8080/api/v1/reportes';

  /**
   * Obtiene el estado de cuenta consolidado de un cliente.
   * @param inicio Fecha inicial (formato YYYY-MM-DD)
   * @param fin Fecha final (formato YYYY-MM-DD)
   * @param clienteId Identificación única del cliente
   * @returns Observable con la data del reporte y el PDF en Base64
   */
  obtenerReporte(inicio: string, fin: string, clienteId: string): Observable<ReporteEstadoCuenta> {
    // Configuramos los parámetros exactamente como los espera el @RequestParam de Java
    const params = new HttpParams()
      .set('inicio', inicio)
      .set('fin', fin)
      .set('clienteId', clienteId);

    return this.http.get<ReporteEstadoCuenta>(this.apiUrl, { params });
  }
}
