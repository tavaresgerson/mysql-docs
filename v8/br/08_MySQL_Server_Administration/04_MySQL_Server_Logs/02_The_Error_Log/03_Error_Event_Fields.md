#### 7.4.2.3 Campos de evento de erro

Os eventos de erro destinados ao log de erro contêm um conjunto de campos, cada um dos quais consiste em um par chave/valor. Um campo de evento pode ser classificado como núcleo, opcional ou definido pelo usuário:

- Um campo principal é configurado automaticamente para eventos de erro. No entanto, sua presença no evento durante o processamento do evento não é garantida, pois um campo principal, como qualquer outro tipo de campo, pode ser desativado por um filtro de log. Se isso acontecer, o campo não poderá ser encontrado pelo processamento subsequente dentro desse filtro e por componentes que sejam executados após o filtro (como os sinks de log).

- Um campo opcional normalmente está ausente, mas pode estar presente para certos tipos de eventos. Quando presente, um campo opcional fornece informações adicionais sobre o evento, conforme apropriado e disponível.

- Um campo definido pelo usuário é qualquer campo com um nome que não esteja já definido como um campo principal ou opcional. Um campo definido pelo usuário não existe até ser criado por um filtro de registro.

Como indicado pela descrição anterior, qualquer campo específico pode estar ausente durante o processamento do evento, seja porque não estava presente no primeiro lugar, ou foi descartado por um filtro. Para os pontos de destino de logs, o efeito da ausência de um campo é específico do ponto de destino. Por exemplo, um ponto de destino pode omitir o campo da mensagem de log, indicar que o campo está ausente ou substituir um valor padrão. Quando houver dúvida, teste: use um filtro que desativa o campo, e depois verifique o que o ponto de destino faz com ele.

As seções a seguir descrevem os campos principais e opcionais de eventos de erro. Para componentes individuais de filtro de log, podem haver considerações adicionais específicas para esses campos, ou os filtros podem adicionar campos definidos pelo usuário que não estão listados aqui. Para detalhes, consulte a documentação dos filtros específicos.

- Campos de evento de erro principal
- Campos opcionais de evento de erro

##### Campos de evento de erro principal

Esses campos de evento de erro são campos principais:

- `time`

  O horário do evento, com precisão em microsegundos.

- `msg`

  A string da mensagem do evento.

- `prio`

  A prioridade do evento, para indicar um sistema, erro, aviso ou nota/informação. Este campo corresponde à gravidade em `syslog`. A tabela a seguir mostra os níveis de prioridade possíveis.

  <table summary="Níveis de prioridade de eventos de erro."><thead><tr> <th>Tipo de evento</th> <th>Prioridade Numérica</th> </tr></thead><tbody><tr> <td>Evento do sistema</td> <td>0</td> </tr><tr> <td>Evento de erro</td> <td>1</td> </tr><tr> <td>Evento de alerta</td> <td>2</td> </tr><tr> <td>Nota/evento de informação</td> <td>3</td> </tr></tbody></table>

  O valor `prio` é numérico. Relacionado a ele, um evento de erro também pode incluir um campo opcional `label` que representa a prioridade como uma string. Por exemplo, um evento com um valor `prio` de 2 pode ter um valor `label` de `'Warning'`.

  Os componentes de filtro podem incluir ou excluir eventos de erro com base na prioridade, exceto que os eventos do sistema são obrigatórios e não podem ser excluídos.

  Em geral, as prioridades das mensagens são determinadas da seguinte forma:

  A situação ou evento é passível de ação?

  - Sim: A situação ou evento é ignorável?

    - Sim: a prioridade é o alerta.
    - Não: a prioridade é o erro.
  - Não: A situação ou evento é obrigatório?

    - Sim: a prioridade é o sistema.
    - Não: a prioridade é a nota/informação.

- `err_code`

  O código de erro do evento, como um número (por exemplo, `1022`).

- `err_symbol`

  O símbolo de erro do evento, como uma string (por exemplo, `'ER_DUP_KEY'`).

- `SQL_state`

  O valor SQLSTATE do evento, como uma string (por exemplo, `'23000'`).

- `subsystem`

  O subsistema em que o evento ocorreu. Os valores possíveis são `InnoDB` (o mecanismo de armazenamento `InnoDB`), `Repl` (o subsistema de replicação), `Server` (caso contrário).

##### Campos opcionais de evento de erro

Os campos de evento de erro opcionais se enquadram nas seguintes categorias:

- Informações adicionais sobre o erro, como o erro sinalizado pelo sistema operacional ou a etiqueta de erro:

  - `OS_errno`

    O número do erro do sistema operacional.

  - `OS_errmsg`

    Mensagem de erro do sistema operacional.

  - `label`

    O rótulo correspondente ao valor `prio`, como uma string.

- Identificação do cliente para o qual o evento ocorreu:

  - `user`

    O usuário cliente.

  - `host`

    O host do cliente.

  - `thread`

    O ID do tópico dentro do **mysqld** responsável por produzir o evento de erro. Esse ID indica qual parte do servidor produziu o evento e é consistente com as mensagens do log de consultas gerais e do log de consultas lentas, que incluem o ID do tópico de conexão.

  - `query_id`

    O ID da consulta.

- Informações de depuração:

  - `source_file`

    O arquivo de origem em que o evento ocorreu, sem nenhum caminho inicial.

  - `source_line`

    A linha dentro do arquivo de origem onde o evento ocorreu.

  - `function`

    A função em que o evento ocorreu.

  - `component`

    O componente ou plugin em que o evento ocorreu.
