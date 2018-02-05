import { ResultadoComponent } from './resultado/resultado.component';
import { GarantiaComponent } from './garantia/garantia.component';
import { PagamentosComponent } from './pagamentos.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: PagamentosComponent,
    children: [
      {
        path: 'garantia/:mensagemId',
        component: GarantiaComponent
      },
      {
        path: 'resultado/:mensagemId',
        component: ResultadoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagamentosRoutingModule { }
