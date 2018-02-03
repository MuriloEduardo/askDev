import { PerguntasComponent } from './perguntas/perguntas.component';
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
        path: 'ajudante',
        component: AjudanteComponent
      },
      {
        path: '',
        component: PerguntasComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AtividadesRoutingModule { }
