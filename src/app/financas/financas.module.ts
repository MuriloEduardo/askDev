import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancasRoutingModule } from './financas-routing.module';
import { FinancasComponent } from './financas.component';
import { MovimentacoesComponent } from './movimentacoes/movimentacoes.component';

@NgModule({
  imports: [
    CommonModule,
    FinancasRoutingModule
  ],
  declarations: [FinancasComponent, MovimentacoesComponent]
})
export class FinancasModule { }
