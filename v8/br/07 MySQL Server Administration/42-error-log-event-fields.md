#### 7.4.2.3 Campos de ocorrência de erros

Os eventos de erro destinados ao log de erros contêm um conjunto de campos, cada um dos quais consiste de um par chave/valor.

- Um campo de núcleo é configurado automaticamente para eventos de erro. No entanto, sua presença no evento durante o processamento de eventos não é garantida porque um campo de núcleo, como qualquer tipo de campo, pode ser desativado por um filtro de log. Se isso acontecer, o campo não pode ser encontrado pelo processamento subsequente dentro desse filtro e por componentes que executam após o filtro (como sumidouros de log).
- Um campo opcional é normalmente ausente, mas pode estar presente para certos tipos de evento.
- Um campo definido pelo usuário é qualquer campo com um nome que ainda não está definido como um campo central ou opcional.

Como implícito na descrição anterior, qualquer campo pode estar ausente durante o processamento de eventos, seja porque não estava presente em primeiro lugar, ou foi descartado por um filtro. Para sinks de log, o efeito da ausência de campo é sink específico. Por exemplo, um sink pode omitir o campo da mensagem de log, indicar que o campo está faltando, ou substituir um padrão. Em caso de dúvida, teste: use um filtro que desativa o campo, em seguida, verificar o que o sink de log faz com ele.

As seções a seguir descrevem os campos de eventos de erro principais e opcionais. Para componentes individuais de filtro de log, pode haver considerações específicas de filtro adicionais para esses campos, ou os filtros podem adicionar campos definidos pelo usuário não listados aqui. Para detalhes, consulte a documentação para filtros específicos.

- Campos de evento de erro do núcleo
- Campos de evento de erro opcionais

##### Campos de evento de erro do núcleo

Estes campos de evento de erro são campos principais:

- `time`

  A marca de tempo do evento, com precisão de microssegundos.
- `msg`

  A sequência de mensagens do evento.
- `prio`

  A prioridade do evento, para indicar um sistema, erro, aviso, ou evento de nota/informação. Este campo corresponde à gravidade em `syslog`. A tabela a seguir mostra os possíveis níveis de prioridade.

  <table><col style="width: 35%"/><col style="width: 35%"/><thead><tr> <th>Tipo de evento</th> <th>Prioridade numérica</th> </tr></thead><tbody><tr> <td>Evento do sistema</td> <td>0 0</td> </tr><tr> <td>Evento de erro</td> <td>1 .</td> </tr><tr> <td>Evento de alerta</td> <td>2 .</td> </tr><tr> <td>Nota/evento de informação</td> <td>3 .</td> </tr></tbody></table>

  O valor `prio` é numérico. Relacionado a ele, um evento de erro também pode incluir um campo opcional `label` representando a prioridade como uma string. Por exemplo, um evento com um valor `prio` de 2 pode ter um valor `label` de `'Warning'`.

  Os componentes de filtro podem incluir ou descartar eventos de erro com base na prioridade, exceto que os eventos do sistema são obrigatórios e não podem ser descartados.

  Em geral, as prioridades das mensagens são determinadas do seguinte modo:

  A situação ou o acontecimento são passíveis de acção?

  - Sim: A situação ou o evento é ignorável?

    - Sim, a prioridade é o aviso.
    - Não: a prioridade é o erro.
  - Não: A situação ou o evento é obrigatório?

    - Sim, a prioridade é o sistema.
    - Não: a prioridade é nota/informação.
- `err_code`

  O código de erro do evento, como um número (por exemplo, `1022`).
- `err_symbol`

  O símbolo de erro de evento, como uma string (por exemplo, `'ER_DUP_KEY'`).
- `SQL_state`

  O valor SQLSTATE do evento, como uma string (por exemplo, `'23000'`).
- `subsystem`

  Os valores possíveis são `InnoDB` (o motor de armazenamento `InnoDB`), `Repl` (o subsistema de replicação), `Server` (caso contrário).

##### Campos de evento de erro opcionais

Os campos de evento de erro facultativos são classificados nas seguintes categorias:

- Informações adicionais sobre o erro, tais como o erro sinalizado pelo sistema operativo ou a etiqueta do erro:

  - `OS_errno`

    O número de erro do sistema operativo.
  - `OS_errmsg`

    A mensagem de erro do sistema operativo.
  - `label`

    O rótulo correspondente ao valor `prio`, como uma string.
- Identificação do cliente em relação ao qual ocorreu o evento:

  - `user`

    O utilizador cliente.
  - `host`

    O anfitrião cliente.
  - `thread`

    O ID do thread no `mysqld` responsável por produzir o evento de erro. Este ID indica qual parte do servidor produziu o evento e é consistente com o log de consulta geral e mensagens de log de consulta lenta, que incluem o ID do thread de conexão.
  - `query_id`

    A identificação da consulta.
- Informações de depuração:

  - `source_file`

    O arquivo de origem em que o evento ocorreu, sem qualquer caminho principal.
  - `source_line`

    A linha no ficheiro de origem em que ocorreu o evento.
  - `function`

    A função em que o evento ocorreu.
  - `component`

    O componente ou plugin em que ocorreu o evento.
