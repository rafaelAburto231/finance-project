import { Component, OnInit, ViewChild, ElementRef, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Chart, ChartConfiguration, registerables } from "chart.js";
import { FinanzasService } from "../finanzas.service";

Chart.register(...registerables);

@Component({
  selector: "app-inicio",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./inicio.component.html",
  styleUrls: ["./inicio.component.css"],
})
export class InicioComponent implements OnInit {
  private finanzasService = inject(FinanzasService);

  @ViewChild("chartCanvas", { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  anioSeleccionado = new Date().getFullYear();
  mesSeleccionado = new Date().getMonth() + 1;

  ingresos = 0;
  egresos = 0;
  ahorroMes = 0;
  balanceTotal = 0;

  private chart!: Chart;

  async ngOnInit() {
    await this.calcularEstadisticas();
  }

  async calcularEstadisticas() {
    const { ingresos, egresos } = await this.finanzasService.obtenerTransaccionesPorTipoYMes(
      this.anioSeleccionado,
      this.mesSeleccionado
    );

    this.ingresos = ingresos;
    this.egresos = egresos;
    this.ahorroMes = ingresos - egresos;
    this.balanceTotal = await this.finanzasService.calcularBalanceTotal();

    const datosMensuales = await this.finanzasService.obtenerDatosMensualesPorAnio(
      this.anioSeleccionado
    );

    this.actualizarGrafica(datosMensuales);
  }

  actualizarGrafica(datosMensuales: { ingresos: number[]; egresos: number[] }) {
    const config: ChartConfiguration = {
      type: "bar",
      data: {
        labels: this.meses,
        datasets: [
          {
            label: "Ingresos",
            data: datosMensuales.ingresos,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "Egresos",
            data: datosMensuales.egresos,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: {
              font: {
                size: 14,
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: 14,
              },
            },
          },
          y: {
            ticks: {
              font: {
                size: 14,
              },
            },
            beginAtZero: true,
          },
        },
      },
    };

    if (!this.chart) {
      this.chart = new Chart(this.chartCanvas.nativeElement, config);
    } else {
      this.chart.data = config.data;
      this.chart.update();
    }
  }
}
