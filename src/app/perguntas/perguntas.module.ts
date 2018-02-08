import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { SharedModule } from './../shared/shared.module';
import { PerguntasService } from './perguntas.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerguntasRoutingModule } from './perguntas-routing.module';
import { PerguntasComponent } from './perguntas.component';
import { CriarComponent } from './criar/criar.component';
import { DevsComponent } from './devs/devs.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ListarComponent } from './listar/listar.component';
import { PerguntaComponent } from './pergunta/pergunta.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserComponent } from './criar/user/user.component';
import { AuthModule } from '../auth/auth.module';
import { EditarComponent } from './editar/editar.component';
import { CancelarComponent } from './cancelar/cancelar.component';

@NgModule({
  imports: [
    CommonModule,
    PerguntasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AuthModule,
    SharedModule,
    AngularMultiSelectModule
  ],
  declarations: [
    PerguntasComponent,
    CriarComponent,
    DevsComponent,
    ListarComponent,
    PerguntaComponent,
    UserComponent,
    EditarComponent,
    CancelarComponent
  ],
  providers: [
    PerguntasService
  ],
  exports: [
    PerguntaComponent
  ]
})
export class PerguntasModule { }
