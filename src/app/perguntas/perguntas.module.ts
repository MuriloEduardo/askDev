import { PerguntasService } from './perguntas.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerguntasRoutingModule } from './perguntas-routing.module';
import { PerguntasComponent } from './perguntas.component';
import { CriarComponent } from './criar/criar.component';
import { DevsComponent } from './devs/devs.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ListarComponent } from './listar/listar.component';
import { PerguntaComponent } from './pergunta/pergunta.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserComponent } from './criar/user/user.component';
import { AuthModule } from '../auth/auth.module';

@NgModule({
  imports: [
    CommonModule,
    PerguntasRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    AuthModule
  ],
  declarations: [
    PerguntasComponent,
    CriarComponent,
    DevsComponent,
    ListarComponent,
    PerguntaComponent,
    UserComponent
  ],
  providers: [
    PerguntasService
  ],
  exports: [
    PerguntaComponent
  ]
})
export class PerguntasModule { }
