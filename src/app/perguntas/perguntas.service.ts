import { Injectable } from '@angular/core';

@Injectable()
export class PerguntasService {

  nameStatus = [
    {
      icone: 'fa fa-eye',
      nome: 'Analisando propostas',
      class: 'warning'
    },
    {
      icone: 'fa fa-handshake-o',
      nome: 'Aguardando garantia',
      class: 'danger'
    }
  ];

  constructor() { }

}
