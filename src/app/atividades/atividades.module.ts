import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AtividadesRoutingModule } from './atividades-routing.module';
import { AtividadesComponent } from './atividades.component';
import { AjudanteComponent } from './ajudante/ajudante.component';
import { PerguntasComponent } from './perguntas/perguntas.component';

@NgModule({
  imports: [
    CommonModule,
    AtividadesRoutingModule
  ],
  declarations: [
    AtividadesComponent,
    AjudanteComponent,
    PerguntasComponent
  ]
})
export class AtividadesModule { }
