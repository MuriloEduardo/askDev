import { SharedModule } from './../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerguntasService } from './../perguntas/perguntas.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AtividadesRoutingModule } from './atividades-routing.module';
import { AtividadesComponent } from './atividades.component';
import { AjudanteComponent } from './ajudante/ajudante.component';
import { PerguntasComponent } from './perguntas/perguntas.component';

@NgModule({
  imports: [
    CommonModule,
    AtividadesRoutingModule,
    NgbModule,
    SharedModule
  ],
  declarations: [
    AtividadesComponent,
    AjudanteComponent,
    PerguntasComponent
  ],
  providers: [
    PerguntasService
  ]
})
export class AtividadesModule { }
