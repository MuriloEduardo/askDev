import { PagamentosService } from './pagamentos.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { PagamentosRoutingModule } from './pagamentos-routing.module';
import { PagamentosComponent } from './pagamentos.component';
import { GarantiaComponent } from './garantia/garantia.component';
import { ResultadoComponent } from './resultado/resultado.component';

@NgModule({
  imports: [
    CommonModule,
    PagamentosRoutingModule,
    HttpModule
  ],
  declarations: [
    PagamentosComponent,
    GarantiaComponent,
    ResultadoComponent
  ],
  providers: [
    PagamentosService
  ]
})
export class PagamentosModule { }
