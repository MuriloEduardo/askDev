import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { PropostasRoutingModule } from './propostas-routing.module';
import { PropostasComponent } from './propostas.component';
import { ListarComponent } from './listar/listar.component';
import { AceitarComponent } from './aceitar/aceitar.component';
import { PagamentoComponent } from './pagamento/pagamento.component';

@NgModule({
  imports: [
    CommonModule,
    PropostasRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    PropostasComponent,
    ListarComponent,
    AceitarComponent,
    PagamentoComponent
  ]
})
export class PropostasModule { }
