import { Component, OnInit } from '@angular/core';

import { Chart,registerables } from 'chart.js';
import { DashBoardService } from 'src/app/Services/dash-board.service';
Chart.register(...registerables);


@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit {

  totalIngresos: string = "0";
  totalVentas: string = "0";
  totalProductos: string = "0";

  constructor(
    private _dashboardServicio: DashBoardService
  ) { }

  mostrarGrafico(labelGrafico: any[], dataGrafico: any[]) {
    const chartBar = new Chart('chartBar',{
      type:'bar',
      data: {
        labels: labelGrafico,
        datasets: [{
          label: '# de ventas',
          data: dataGrafico,
          backgroundColor:[
            'rgba(55,160,240,0.2)'
          ],
          borderColor: [
            'rgba(55,160,240,1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }

  ngOnInit(): void {
    this._dashboardServicio.resumen().subscribe({
      next: (data) => {
        this.totalIngresos = data.value.totalIngresos;
        this.totalVentas = data.value.totalVentas;
        this.totalProductos = data.value.totalProductos;

        const arrayData: any[] = data.value.ventasUltimaSemana;
        
        const labelTemp = arrayData.map((value) => value.fecha);
        const dataTemp = arrayData.map((value) => value.total);
        
        console.log(labelTemp, dataTemp);
        this.mostrarGrafico(labelTemp, dataTemp);
      },
      error: (e) => {}
    })
  }

}
