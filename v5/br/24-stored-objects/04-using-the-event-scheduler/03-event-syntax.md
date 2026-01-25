### 23.4.3 Sintaxe de EVENTs

O MySQL fornece diversas declarações SQL para trabalhar com *scheduled events* (eventos agendados):

* Novos *events* são definidos usando a declaração `CREATE EVENT`. Consulte a Seção 13.1.12, “Declaração CREATE EVENT”.

* A definição de um *event* existente pode ser alterada por meio da declaração `ALTER EVENT`. Consulte a Seção 13.1.2, “Declaração ALTER EVENT”.

* Quando um *scheduled event* não é mais desejado ou necessário, ele pode ser excluído do servidor pelo seu *definer* usando a declaração `DROP EVENT`. Consulte a Seção 13.1.23, “Declaração DROP EVENT”. A persistência de um *event* após o término de seu agendamento também depende de sua *clause* `ON COMPLETION`, se houver. Consulte a Seção 13.1.12, “Declaração CREATE EVENT”.

  Um *event* pode ser descartado por qualquer usuário que possua o *privilege* `EVENT` para o *database* no qual o *event* está definido. Consulte a Seção 23.4.6, “O Agendador de Eventos e os Privilégios do MySQL”.