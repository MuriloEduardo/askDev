import { MovimentacoesComponent } from './movimentacoes/movimentacoes.component';
import { FinancasComponent } from './financas.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: FinancasComponent,
    children: [
      {
        path: '',
        component: MovimentacoesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancasRoutingModule { }
