import { AuthGuard } from './auth/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './views/default/default.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule'
  },
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'perguntas',
      },
      {
        path: 'user',
        canActivate: [AuthGuard],
        loadChildren: './user/user.module#UserModule'
      },
      {
        path: 'perguntas',
        loadChildren: './perguntas/perguntas.module#PerguntasModule'
      },
      {
        path: 'atividades',
        canActivate: [AuthGuard],
        loadChildren: './atividades/atividades.module#AtividadesModule'
      },
      {
        path: 'propostas',
        canActivate: [AuthGuard],
        loadChildren: './propostas/propostas.module#PropostasModule'
      },
      {
        path: 'conversas',
        canActivate: [AuthGuard],
        loadChildren: './conversas/conversas.module#ConversasModule'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
