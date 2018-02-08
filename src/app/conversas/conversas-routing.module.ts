import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConversasComponent } from './conversas.component';
import { ListarComponent } from './listar/listar.component';
import { ConversaComponent } from './conversa/conversa.component';

const routes: Routes = [
  {
    path: '',
    component: ConversasComponent,
    children: [
      {
        path: '',
        component: ListarComponent
      },
      {
        path: ':conversaId',
        component: ConversaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConversasRoutingModule { }
