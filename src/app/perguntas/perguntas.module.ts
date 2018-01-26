import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerguntasRoutingModule } from './perguntas-routing.module';
import { PerguntasComponent } from './perguntas.component';
import { CriarComponent } from './criar/criar.component';
import { DevsComponent } from './devs/devs.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ListarComponent } from './listar/listar.component';
import { PerguntaComponent } from './pergunta/pergunta.component';

@NgModule({
  imports: [
    CommonModule,
    PerguntasRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    PerguntasComponent,
    CriarComponent,
    DevsComponent,
    ListarComponent,
    PerguntaComponent
  ],
  exports: [
    PerguntaComponent
  ]
})
export class PerguntasModule { }
