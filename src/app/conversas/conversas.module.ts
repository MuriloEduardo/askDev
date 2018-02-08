import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversasRoutingModule } from './conversas-routing.module';
import { ConversasComponent } from './conversas.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PerguntasModule } from '../perguntas/perguntas.module';
import { ListarComponent } from './listar/listar.component';
import { ConversaComponent } from './conversa/conversa.component';
import { ListaComponent } from './listar/lista/lista.component';

@NgModule({
  imports: [
    CommonModule,
    ConversasRoutingModule,
    ReactiveFormsModule,
    PerguntasModule,
    SharedModule
  ],
  declarations: [
    ConversasComponent,
    ListarComponent,
    ConversaComponent,
    ListaComponent
  ],
  exports: [
    ListaComponent
  ]
})
export class ConversasModule { }
