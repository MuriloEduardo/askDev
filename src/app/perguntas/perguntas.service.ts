import { Injectable } from '@angular/core';

@Injectable()
export class PerguntasService {

  nameStatus = [
    {
      icone: 'fa fa-hand-paper-o',
      nome: 'Analisando Propostas',
      class: 'warning'
    },
    {
      icone: 'fa fa-hand-pointer-o',
      nome: 'Aguardando Garantia',
      class: 'danger'
    },
    {
      icone: 'fa fa-hand-peace-o',
      nome: 'Pagamento Aprovado',
      class: 'info'
    },
    {
      icone: 'fa fa-hand-scissors-o',
      nome: 'Verificando o Pagamento',
      class: 'warning'
    },
    {
      icone: 'fa fa-hand-spock-o',
      nome: 'Finalizado',
      class: 'success'
    },
    {
      icone: 'fa fa-hand-grab-o',
      nome: 'Cancelado',
      class: 'danger'
    }
  ];

  constructor() { }

}
