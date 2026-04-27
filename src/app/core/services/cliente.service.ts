import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/clientes';

  listarClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  // NUEVO MÉTODO PARA CREAR
  crearCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }


  eliminarCliente(clienteId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${clienteId}`);
  }

  // NUEVO MÉTODO PARA ACTUALIZAR (PUT)
  actualizarCliente(clienteid: string, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${clienteid}`, cliente);
  }

  buscarClientes(termino: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/buscar`, {
      params: { termino }
    });
  }
}
