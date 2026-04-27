import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MovimientoService } from '../../core/services/movimiento.service';
import { CuentaService } from '../../core/services/cuenta.service';
import { Movimiento } from '../../core/models/movimiento.model';
import { Cuenta } from '../../core/models/cuenta.model';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movimientos.html',
  styleUrl: './movimientos.scss'
})
export class Movimientos implements OnInit {
  private movimientoService = inject(MovimientoService);
  private cuentaService = inject(CuentaService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  listaMovimientos: Movimiento[] = [];
  listaCuentas: Cuenta[] = [];
  mostrarFormulario = false;
  movimientoForm!: FormGroup;

  ngOnInit(): void {
    this.cargarDatos();
    this.inicializarFormulario();
  }

  cargarDatos(): void {
    // Cargamos el historial completo y las cuentas para el select
    this.movimientoService.findAll().subscribe({
      next: (data) => {
        this.listaMovimientos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar movimientos', err)
    });

    this.cuentaService.listarCuentas().subscribe({
      next: (data) => this.listaCuentas = data,
      error: (err) => console.error('Error al cargar cuentas', err)
    });
  }

  inicializarFormulario(): void {
    this.movimientoForm = this.fb.group({
      numeroCuenta: ['', Validators.required],
      tipoMovimiento: ['DEPOSITO', Validators.required],
      valor: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  guardarMovimiento(): void {
    if (this.movimientoForm.invalid) {
      this.movimientoForm.markAllAsTouched();
      return;
    }

    this.movimientoService.save(this.movimientoForm.value).subscribe({
      next: (res) => {
        // Agregamos al inicio para que se vea el cambio inmediatamente
        this.listaMovimientos = [res, ...this.listaMovimientos];
        this.alternarVista();
        this.cdr.detectChanges();
        alert('Transacción exitosa');
      },
      error: (err) => {
        alert('Error: ' + (err.error?.message || 'No se pudo procesar el movimiento'));
      }
    });
  }

  alternarVista(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.movimientoForm.reset({ tipoMovimiento: 'DEPOSITO' });
    }
  }
}
