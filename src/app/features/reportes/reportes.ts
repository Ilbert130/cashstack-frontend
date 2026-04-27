import { ReporteService } from './../../core/services/reporte.service';
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReporteEstadoCuenta } from '../../core/models/reporte.model';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.scss'
})
export class Reportes {
  private fb = inject(FormBuilder);
  private reporteService = inject(ReporteService);
  private cdr = inject(ChangeDetectorRef);

  reporteForm: FormGroup = this.fb.group({
    inicio: ['', Validators.required],
    fin: ['', Validators.required],
    clienteId: ['', Validators.required]
  });

  datosReporte: ReporteEstadoCuenta | null = null;
  cargando = false;

  generarReporte() {
    if (this.reporteForm.invalid) return;

    this.cargando = true;
    const { inicio, fin, clienteId } = this.reporteForm.value;

    this.reporteService.obtenerReporte(inicio, fin, clienteId).subscribe({
      next: (res) => {
        this.datosReporte = res;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cargando = false;
        alert(err.error?.message || 'No se pudo generar el reporte');
      }
    });
  }

  descargarEstadoCuenta() {
    if (!this.datosReporte?.pdfBase64) return;

    const b64Data = this.datosReporte.pdfBase64;
    const blob = this.base64ToBlob(b64Data, 'application/pdf');
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `EstadoCuenta_${this.datosReporte.cliente}_${this.datosReporte.fechaInicio}.pdf`;
    link.click();

    window.URL.revokeObjectURL(url);
  }

  private base64ToBlob(base64: string, type: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: type });
  }
}
