import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CuentaService } from '../../core/services/cuenta.service';
import { ClienteService } from '../../core/services/cliente.service';
import { Cuenta } from '../../core/models/cuenta.model';
import { Cliente } from '../../core/models/cliente.model';

@Component({
  selector: 'app-cuentas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cuentas.html',
  styleUrl: './cuentas.scss'
})
export class Cuentas implements OnInit {
  // Servicios
  private cuentaService = inject(CuentaService);
  private clienteService = inject(ClienteService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  // Variables de datos
  listaCuentas: Cuenta[] = [];
  listaClientes: Cliente[] = [];
  mostrarFormulario = false;
  cuentaForm!: FormGroup;

  // Variable para manejar la edición
  cuentaParaEditar: Cuenta | null = null;

  // Buscador reactivo
  private buscador$ = new Subject<string>();

  ngOnInit(): void {
    this.cargarCuentas();
    this.cargarClientes();
    this.inicializarFormulario();
    this.configurarBuscador();
  }

  /**
   * Carga inicial de todas las cuentas
   */
  cargarCuentas(): void {
    this.cuentaService.listarCuentas().subscribe({
      next: (data) => {
        this.listaCuentas = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar cuentas:', err)
    });
  }

  /**
   * Carga la lista de clientes para el select del formulario
   */
  cargarClientes(): void {
    this.clienteService.listarClientes().subscribe({
      next: (data) => {
        this.listaClientes = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar clientes:', err)
    });
  }

  /**
   * Configura la búsqueda reactiva con el endpoint del backend
   */
  configurarBuscador(): void {
    this.buscador$.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      switchMap(termino => {
        if (!termino || !termino.trim()) {
          return this.cuentaService.listarCuentas();
        }
        return this.cuentaService.buscarCuentas(termino);
      })
    ).subscribe({
      next: (resultados) => {
        this.listaCuentas = resultados;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error en la búsqueda:', err)
    });
  }

  onBuscar(event: Event): void {
    const elemento = event.target as HTMLInputElement;
    this.buscador$.next(elemento.value);
  }

  inicializarFormulario(): void {
    this.cuentaForm = this.fb.group({
      clienteId: ['', Validators.required],
      tipoCuenta: ['AHORRO', Validators.required],
      saldoInicial: [0, [Validators.required, Validators.min(0)]]
    });
  }

  /**
   * Prepara el formulario para editar el tipo de cuenta
   */
  prepararEdicion(cuenta: Cuenta): void {
    this.cuentaParaEditar = cuenta;
    this.mostrarFormulario = true;

    // Cargamos los valores actuales
    this.cuentaForm.patchValue({
      clienteId: cuenta.clienteId,
      tipoCuenta: cuenta.tipoCuenta,
      saldoInicial: cuenta.saldoInicial
    });

    // Deshabilitamos campos que no se pueden editar según el endpoint Patch
    this.cuentaForm.get('clienteId')?.disable();
    this.cuentaForm.get('saldoInicial')?.disable();
  }

  /**
   * Decide si crea una cuenta o actualiza el tipo de cuenta
   */
  guardarCuenta(): void {
    if (this.cuentaForm.invalid) {
      this.cuentaForm.markAllAsTouched();
      return;
    }

    if (this.cuentaParaEditar && this.cuentaParaEditar.numeroCuenta) {
      // LÓGICA DE ACTUALIZACIÓN (PATCH)
      const nuevoTipo = this.cuentaForm.get('tipoCuenta')?.value;

      this.cuentaService.actualizarTipoCuenta(this.cuentaParaEditar.numeroCuenta, nuevoTipo).subscribe({
        next: (res) => {
          const index = this.listaCuentas.findIndex(c => c.numeroCuenta === res.numeroCuenta);
          if (index !== -1) {
            this.listaCuentas[index] = res;
          }
          alert('Tipo de cuenta actualizado exitosamente');
          this.alternarVista();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          alert('Error al actualizar el tipo de cuenta');
        }
      });
    } else {
      // LÓGICA DE CREACIÓN (POST)
      const nuevaCuenta: Cuenta = this.cuentaForm.value;
      this.cuentaService.crearCuenta(nuevaCuenta).subscribe({
        next: (res) => {
          this.listaCuentas = [res, ...this.listaCuentas];
          this.buscador$.next('');
          this.alternarVista();
          this.cdr.detectChanges();
          alert('Cuenta creada exitosamente');
        },
        error: (err) => {
          console.error('Error al crear:', err);
          alert('Error al guardar la cuenta');
        }
      });
    }
  }

  eliminarCuenta(numeroCuenta: string | undefined): void {
    if (!numeroCuenta || !confirm(`¿Desea eliminar la cuenta ${numeroCuenta}?`)) return;

    this.cuentaService.eliminarCuenta(numeroCuenta).subscribe({
      next: () => {
        this.listaCuentas = this.listaCuentas.filter(c => c.numeroCuenta !== numeroCuenta);
        this.cdr.detectChanges();
      },
      error: (err) => alert('No se pudo eliminar la cuenta')
    });
  }

  alternarVista(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.cuentaParaEditar = null;
      // Re-habilitamos campos por si estaban deshabilitados por la edición
      this.cuentaForm.get('clienteId')?.enable();
      this.cuentaForm.get('saldoInicial')?.enable();
      this.cuentaForm.reset({ tipoCuenta: 'AHORRO', saldoInicial: 0 });
    }
  }
}
