import { EditarComponent } from './editar/editar.component';
import { PerguntaComponent } from './pergunta/pergunta.component';
import { ListarComponent } from './listar/listar.component';
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
        path: 'criar',
        component: CriarComponent
      },
      {
        path: 'editar/:perguntaId',
        component: EditarComponent
      },
      {
        path: ':perguntaId/:perguntaTitulo',
        component: PerguntaComponent
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
