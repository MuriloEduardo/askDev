import { PropostasComponent } from './propostas/propostas.component';
import { AjudadoComponent } from './ajudado/ajudado.component';
import { AjudanteComponent } from './ajudante/ajudante.component';
import { AtividadesComponent } from './atividades.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AtividadesComponent,
    children: [
      {
        path: '',
        redirectTo: 'ajudante',
      },
      {
        path: 'propostas/:id',
        component: PropostasComponent
      },
      {
        path: 'ajudante',
        component: AjudanteComponent
      },
      {
        path: 'ajudado',
        component: AjudadoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AtividadesRoutingModule { }
