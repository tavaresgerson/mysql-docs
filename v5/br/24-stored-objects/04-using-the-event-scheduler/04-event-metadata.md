### 23.4.4 Metadados do evento

Para obter metadados sobre eventos:

- Interrogue a tabela `event` do banco de dados `mysql`.

- Interrogue a tabela `EVENTS` do banco de dados `INFORMATION_SCHEMA`. Veja a Seção 24.3.8, “A Tabela INFORMATION\_SCHEMA EVENTS”.

- Use a instrução `SHOW CREATE EVENT`. Veja a Seção 13.7.5.7, “Instrução SHOW CREATE EVENT”.

- Use a instrução `SHOW EVENTS`. Veja a Seção 13.7.5.18, “Instrução SHOW EVENTS”.

**Representação de Tempo no Agendamento de Eventos**

Cada sessão no MySQL tem um fuso horário de sessão (STZ). Esse é o valor da sessão `time_zone` que é inicializado a partir do valor global `time_zone` do servidor quando a sessão começa, mas pode ser alterado durante a sessão.

O fuso horário da sessão que está em vigor quando uma instrução `CREATE EVENT` ou `ALTER EVENT` é executada é usado para interpretar os horários especificados na definição do evento. Isso se torna o fuso horário do evento (ETZ); ou seja, o fuso horário usado para a programação do evento e que está em vigor dentro do evento conforme ele é executado.

Para a representação das informações do evento na tabela `mysql.event`, os tempos `execute_at`, `starts` e `ends` são convertidos para UTC e armazenados juntamente com o fuso horário do evento. Isso permite que a execução do evento prossiga conforme definido, independentemente de quaisquer alterações subsequentes no fuso horário do servidor ou efeitos do horário de verão. O tempo `last_executed` também é armazenado em UTC.

Se você selecionar informações do `mysql.event`, os tempos mencionados acima são recuperados como valores em UTC. Esses tempos também podem ser obtidos selecionando a tabela `EVENTS` do Schema de Informações ou do `SHOW EVENTS`, mas são relatados como valores em ETZ. Outros tempos disponíveis nessas fontes indicam quando um evento foi criado ou alterado pela última vez; esses são exibidos como valores em STZ. A tabela a seguir resume a representação dos tempos dos eventos.

<table summary="Resumo da representação do tempo do evento (como valores em UTC, EZT ou STZ) a partir de mysql.event, INFORMATION_SCHEMA.EVENTS e SHOW EVENTS."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th scope="col">Valor</th> <th scope="col">[[<code>mysql.event</code>]]</th> <th scope="col"><a class="link" href="information-schema-events-table.html" title="24.3.8 A tabela INFORMATION_SCHEMA EVENTS">[[<code>EVENTS</code>]]</a>Tabela</th> <th scope="col"><a class="link" href="show-events.html" title="13.7.5.18 DESCRIÇÃO DOS EVENTOS DE EXPOSIÇÃO">[[<code>SHOW EVENTS</code>]]</a></th> </tr></thead><tbody><tr> <th scope="row">Execute em</th> <td>UTC</td> <td>ETZ</td> <td>ETZ</td> </tr><tr> <th scope="row">Começa</th> <td>UTC</td> <td>ETZ</td> <td>ETZ</td> </tr><tr> <th scope="row">Termina</th> <td>UTC</td> <td>ETZ</td> <td>ETZ</td> </tr><tr> <th scope="row">Última execução</th> <td>UTC</td> <td>ETZ</td> <td>n/a</td> </tr><tr> <th scope="row">Criado</th> <td>STZ</td> <td>STZ</td> <td>n/a</td> </tr><tr> <th scope="row">Última alteração</th> <td>STZ</td> <td>STZ</td> <td>n/a</td> </tr></tbody></table>
