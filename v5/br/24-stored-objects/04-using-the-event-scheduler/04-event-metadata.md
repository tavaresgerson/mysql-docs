### 23.4.4 Metadados de Eventos

Para obter metadados sobre eventos:

* Faça uma Query na tabela `event` do Database `mysql`.

* Faça uma Query na tabela `EVENTS` do Database `INFORMATION_SCHEMA`. Consulte a Seção 24.3.8, “A Tabela EVENTS do INFORMATION_SCHEMA”.

* Use a instrução `SHOW CREATE EVENT`. Consulte a Seção 13.7.5.7, “Instrução SHOW CREATE EVENT”.

* Use a instrução `SHOW EVENTS`. Consulte a Seção 13.7.5.18, “Instrução SHOW EVENTS”.

**Representação de Tempo do Event Scheduler**

Cada sessão no MySQL possui um session time zone (STZ). Este é o valor `time_zone` da sessão que é inicializado a partir do valor `time_zone` global do server quando a sessão começa, mas pode ser alterado durante a sessão.

O session time zone que está ativo quando uma instrução `CREATE EVENT` ou `ALTER EVENT` é executada é usado para interpretar os tempos especificados na definição do Event. Este se torna o event time zone (ETZ); ou seja, o time zone que é usado para o Event scheduling e que está em vigor dentro do Event enquanto ele é executado.

Para a representação de informações de Event na tabela `mysql.event`, os tempos `execute_at`, `starts` e `ends` são convertidos para UTC e armazenados juntamente com o event time zone. Isso permite que a execução do Event prossiga conforme definido, independentemente de quaisquer alterações subsequentes no time zone do server ou efeitos do horário de verão. O tempo `last_executed` também é armazenado em UTC.

Se você selecionar informações de `mysql.event`, os tempos acabados de mencionar são recuperados como valores UTC. Esses tempos também podem ser obtidos selecionando a partir da tabela `EVENTS` do Information Schema ou de `SHOW EVENTS`, mas são relatados como valores ETZ. Outros tempos disponíveis dessas fontes indicam quando um Event foi criado ou alterado pela última vez; estes são exibidos como valores STZ. A tabela a seguir resume a representação dos tempos dos Events.

<table summary="Resumo da representação de tempo de Event (como valores UTC, EZT ou STZ) de mysql.event, INFORMATION_SCHEMA.EVENTS e SHOW EVENTS."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>Valor</th> <th><code>mysql.event</code></th> <th>Tabela <code>EVENTS</code></th> <th><code>SHOW EVENTS</code></th> </tr></thead><tbody><tr> <th>Hora de execução</th> <td>UTC</td> <td>ETZ</td> <td>ETZ</td> </tr><tr> <th>Início</th> <td>UTC</td> <td>ETZ</td> <td>ETZ</td> </tr><tr> <th>Fim</th> <td>UTC</td> <td>ETZ</td> <td>ETZ</td> </tr><tr> <th>Última execução</th> <td>UTC</td> <td>ETZ</td> <td>n/a</td> </tr><tr> <th>Criado</th> <td>STZ</td> <td>STZ</td> <td>n/a</td> </tr><tr> <th>Última alteração</th> <td>STZ</td> <td>STZ</td> <td>n/a</td> </tr> </tbody></table>
