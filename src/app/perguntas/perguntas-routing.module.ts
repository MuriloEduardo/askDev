import { PerguntaComponent } from './pergunta/pergunta.component';
import { ListarComponent } from './listar/listar.component';
import { DevsComponent } from './devs/devs.component';
import { CriarComponent } from './criar/criar.component';
import { PerguntasComponent } from './perguntas.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: PerguntasComponent,
    children: [
      {
        path: ':id/:titulo',
        component: PerguntaComponent
      },
      {
        path: 'devs',
        component: DevsComponent
      },
      {
        path: 'criar',
        component: CriarComponent
      },
      {
        path: '',
        component: ListarComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerguntasRoutingModule { }
