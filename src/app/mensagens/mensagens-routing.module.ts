import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MensagensComponent } from './mensagens.component';
import { PropostaComponent } from './proposta/proposta.component';
import { ListarComponent } from './listar/listar.component';
import { MensagemComponent } from './mensagem/mensagem.component';

const routes: Routes = [
  {
    path: '',
    component: MensagensComponent,
    children: [
      {
        path: '',
        component: ListarComponent
      },
      {
        path: 'proposta/:perguntaId/:perguntaTitulo',
        component: PropostaComponent
      },
      {
        path: ':mensagemId',
        component: MensagemComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MensagensRoutingModule { }
