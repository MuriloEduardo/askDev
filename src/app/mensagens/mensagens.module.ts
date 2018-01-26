import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MensagensRoutingModule } from './mensagens-routing.module';
import { MensagensComponent } from './mensagens.component';
import { PropostaComponent } from './proposta/proposta.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PerguntasModule } from '../perguntas/perguntas.module';
import { ListarComponent } from './listar/listar.component';
import { MensagemComponent } from './mensagem/mensagem.component';

@NgModule({
  imports: [
    CommonModule,
    MensagensRoutingModule,
    ReactiveFormsModule,
    PerguntasModule
  ],
  declarations: [
    MensagensComponent,
    PropostaComponent,
    ListarComponent,
    MensagemComponent
  ]
})
export class MensagensModule { }
