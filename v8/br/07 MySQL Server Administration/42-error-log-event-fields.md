#### 7.4.2.3 Campos de Eventos de Erro

Eventos de erro destinados ao log de erros contêm um conjunto de campos, cada um dos quais consiste em um par chave/valor. Um campo de evento pode ser classificado como núcleo, opcional ou definido pelo usuário:

* Um campo núcleo é configurado automaticamente para eventos de erro. No entanto, sua presença no evento durante o processamento do evento não é garantida, pois um campo núcleo, como qualquer tipo de campo, pode ser desativado por um filtro de log. Se isso acontecer, o campo não pode ser encontrado pelo processamento subsequente dentro desse filtro e por componentes que executam após o filtro (como sinks de log).
* Um campo opcional normalmente está ausente, mas pode estar presente para certos tipos de eventos. Quando presente, um campo opcional fornece informações adicionais sobre o evento conforme apropriado e disponível.
* Um campo definido pelo usuário é qualquer campo com um nome que não esteja já definido como campo núcleo ou opcional. Um campo definido pelo usuário não existe até ser criado por um filtro de log.

Como implícito pela descrição anterior, qualquer campo dado pode estar ausente durante o processamento do evento, seja porque não estava presente no primeiro lugar, ou foi descartado por um filtro. Para sinks de log, o efeito da ausência de campo é específico do sink. Por exemplo, um sink pode omitir o campo da mensagem de log, indicar que o campo está ausente ou substituir um padrão. Quando em dúvida, teste: use um filtro que desativa o campo, depois verifique o que o sink de log faz com ele.

As seções seguintes descrevem os campos de eventos de erro núcleo e opcionais. Para componentes individuais de filtros de log, pode haver considerações adicionais específicas do filtro para esses campos, ou os filtros podem adicionar campos definidos pelo usuário não listados aqui. Para detalhes, consulte a documentação dos filtros específicos.

* Campos de Evento de Erro Núcleo
* Campos de Evento de Erro Opcional

O evento de prioridade, para indicar um sistema, erro, aviso ou evento de nota/informação. Este campo corresponde à gravidade no `syslog`. A tabela a seguir mostra os níveis de prioridade possíveis.

<table><thead><tr> <th>Tipo de Evento</th> <th>Prioridade Numérica</th> </tr></thead><tbody><tr> <td>Evento de Sistema</td> <td>0</td> </tr><tr> <td>Evento de Erro</td> <td>1</td> </tr><tr> <td>Evento de Aviso</td> <td>2</td> </tr><tr> <td>Evento de Nota/Informação</td> <td>3</td> </tr></tbody></table>

O valor `prio` é numérico. Relacionado a ele, um evento de erro também pode incluir um campo opcional `label` representando a prioridade como uma string. Por exemplo, um evento com um valor `prio` de 2 pode ter um valor `label` de `'Aviso'`.

Os componentes de filtro podem incluir ou descartar eventos de erro com base na prioridade, exceto que eventos de sistema são obrigatórios e não podem ser descartados.

Em geral, as prioridades das mensagens são determinadas da seguinte forma:

+ Sim: A situação ou evento é ignora?

    - Sim: A prioridade é de aviso.
    - Não: A prioridade é de erro.
+ Não: A situação ou evento é obrigatório?

    - Sim: A prioridade é de sistema.
    - Não: A prioridade é de nota/informação.
* `err_code`

  O código de erro do evento, como um número (por exemplo, `1022`).
* `err_symbol`

  O símbolo de erro do evento, como uma string (por exemplo, `'ER_DUP_KEY'`).
* `SQL_state`

  O valor SQLSTATE do evento, como uma string (por exemplo, `'23000'`).
* `subsystem`

  O subsistema em que o evento ocorreu. Os valores possíveis são `InnoDB` (o motor de armazenamento `InnoDB`), `Repl` (o subsistema de replicação), `Server` (caso contrário).

##### Campos Opcionais de Evento de Erro

Campos opcionais de evento de erro se enquadram nas seguintes categorias:

* Informações adicionais sobre o erro, como o erro sinalizado pelo sistema operacional ou o rótulo do erro:

  + `OS_errno`

    O número de erro do sistema operacional.
  + `OS_errmsg`

    A mensagem de erro do sistema operacional.
  + `label`

O rótulo correspondente ao valor `prio`, como uma string.
* Identificação do cliente para o qual o evento ocorreu:

  + `user`

    O usuário do cliente.
  + `host`

    O host do cliente.
  + `thread`

    O ID do thread dentro do `mysqld` responsável por produzir o evento de erro. Esse ID indica qual parte do servidor produziu o evento e é consistente com as mensagens do log de consultas gerais e do log de consultas lentas, que incluem o ID do thread de conexão.
  + `query_id`

    O ID da consulta.
* Informações de depuração:

  + `source_file`

    O arquivo de origem no qual o evento ocorreu, sem nenhum caminho inicial.
  + `source_line`

    A linha dentro do arquivo de origem na qual o evento ocorreu.
  + `function`

    A função na qual o evento ocorreu.
  + `component`

    O componente ou plugin no qual o evento ocorreu.