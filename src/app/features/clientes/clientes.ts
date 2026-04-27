import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ClienteService } from '../../core/services/cliente.service';
import { Cliente } from '../../core/models/cliente.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss'
})
export class Clientes implements OnInit {
  private clienteService = inject(ClienteService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  listaClientes: Cliente[] = [];
  mostrarFormulario = false;
  clienteForm!: FormGroup;
  clienteEnEdicionId: string | null = null;
  clienteSeleccionado: Cliente | null = null;
  mostrarDetalle = false;

  // Flujo para la búsqueda
  private buscador$ = new Subject<string>();

  ngOnInit(): void {
    this.cargarClientes();
    this.inicializarFormulario();
    this.configurarBuscador();
  }

  // Carga inicial de datos
  cargarClientes(): void {
    this.clienteService.listarClientes().subscribe({
      next: (data) => {
        this.listaClientes = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar clientes', err)
    });
  }

  // Lógica del buscador con auto-recarga al borrar
  configurarBuscador(): void {
    this.buscador$.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      switchMap(termino => {
        // SI EL CAMPO ESTÁ VACÍO: Cargamos todo de nuevo
        if (!termino || !termino.trim()) {
          return this.clienteService.listarClientes();
        }
        // SI TIENE TEXTO: Buscamos por el término
        return this.clienteService.buscarClientes(termino);
      })
    ).subscribe({
      next: (resultados) => {
        this.listaClientes = resultados;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error en búsqueda', err)
    });
  }

  onBuscar(event: Event): void {
    const elemento = event.target as HTMLInputElement;
    this.buscador$.next(elemento.value);
  }

  inicializarFormulario(): void {
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      genero: ['MASCULINO', Validators.required],
      edad: ['', [Validators.required, Validators.min(18)]],
      identificacion: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      contrasena: ['', Validators.required]
    });
  }

  alternarVista(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.clienteForm.reset({ genero: 'MASCULINO' });
      this.clienteEnEdicionId = null;
    }
  }

  editarCliente(cliente: Cliente): void {
    this.clienteEnEdicionId = cliente.clienteid;
    this.clienteForm.patchValue({
      nombre: cliente.nombre,
      genero: cliente.genero,
      edad: cliente.edad,
      identificacion: cliente.identificacion,
      direccion: cliente.direccion,
      telefono: cliente.telefono,
      contrasena: ''
    });
    this.mostrarFormulario = true;
  }

  verDetalle(cliente: Cliente): void {
    this.clienteSeleccionado = cliente;
    this.mostrarDetalle = true;
    this.cdr.detectChanges();
  }

  cerrarDetalle(): void {
    this.mostrarDetalle = false;
    this.clienteSeleccionado = null;
  }

  guardarCliente(): void {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    const datosCliente: Cliente = this.clienteForm.value;

    if (this.clienteEnEdicionId) {
      this.clienteService.actualizarCliente(this.clienteEnEdicionId, datosCliente).subscribe({
        next: (res) => {
          this.cargarClientes(); // Recargamos para ver cambios
          this.alternarVista();
          alert('Actualizado con éxito');
        },
        error: (err) => alert('Error al actualizar')
      });
    } else {
      this.clienteService.crearCliente(datosCliente).subscribe({
        next: (res) => {
          this.listaClientes.push(res);
          this.alternarVista();
          alert('Guardado con éxito');
        },
        error: (err) => alert('Error al guardar')
      });
    }
  }

  eliminarCliente(clienteid: string | undefined): void {
    if (!clienteid || !confirm('¿Eliminar este cliente?')) return;

    this.clienteService.eliminarCliente(clienteid).subscribe({
      next: () => {
        this.listaClientes = this.listaClientes.filter(c => c.clienteid !== clienteid);
        this.cdr.detectChanges();
      },
      error: (err) => alert('Error al eliminar')
    });
  }
}
