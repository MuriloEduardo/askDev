import { PagamentoComponent } from './pagamento/pagamento.component';
import { AceitarComponent } from './aceitar/aceitar.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PropostasComponent } from './propostas.component';
import { ListarComponent } from './listar/listar.component';

const routes: Routes = [
  {
    path: '',
    component: PropostasComponent,
    children: [
      {
        path: 'pagamento/:mensagemId',
        component: PagamentoComponent
      },
      {
        path: 'aceitar/:mensagemId',
        component: AceitarComponent
      },
      {
        path: ':perguntaId',
        component: ListarComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropostasRoutingModule { }
