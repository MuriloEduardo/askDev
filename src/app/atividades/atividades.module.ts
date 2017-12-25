import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AtividadesRoutingModule } from './atividades-routing.module';
import { AtividadesComponent } from './atividades.component';
import { AjudanteComponent } from './ajudante/ajudante.component';
import { AjudadoComponent } from './ajudado/ajudado.component';
import { PropostasComponent } from './propostas/propostas.component';

@NgModule({
  imports: [
    CommonModule,
    AtividadesRoutingModule
  ],
  declarations: [AtividadesComponent, AjudanteComponent, AjudadoComponent, PropostasComponent]
})
export class AtividadesModule { }
