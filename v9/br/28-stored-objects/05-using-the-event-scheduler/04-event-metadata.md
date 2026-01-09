### 27.5.4 Metadados dos Eventos

Para obter metadados sobre os eventos:

* Faça uma consulta à tabela `EVENTS` do banco de dados `INFORMATION_SCHEMA`. Veja a Seção 28.3.14, “A Tabela INFORMATION\_SCHEMA EVENTS”.

* Use a instrução `SHOW CREATE EVENT`. Veja a Seção 15.7.7.8, “Instrução SHOW CREATE EVENT”.

* Use a instrução `SHOW EVENTS`. Veja a Seção 15.7.7.20, “Instrução SHOW EVENTS”.

**Representação do Tempo do Cronograma de Eventos**

Cada sessão no MySQL tem um fuso horário de sessão (STZ). Esse é o valor do `time_zone` da sessão que é inicializado a partir do valor global `time_zone` do servidor quando a sessão começa, mas pode ser alterado durante a sessão.

O fuso horário de sessão que está em vigor quando uma instrução `CREATE EVENT` ou `ALTER EVENT` é executada é usado para interpretar os tempos especificados na definição do evento. Isso se torna o fuso horário de tempo do evento (ETZ); ou seja, o fuso horário usado para a programação de eventos e que está em vigor dentro do evento conforme ele é executado.

Para a representação das informações dos eventos no dicionário de dados, os tempos `execute_at`, `starts` e `ends` são convertidos para UTC e armazenados junto com o fuso horário de tempo do evento. Isso permite que a execução do evento prossiga conforme definido, independentemente de quaisquer alterações subsequentes no fuso horário do servidor ou efeitos do horário de verão. O tempo `last_executed` também é armazenado em UTC.

Os tempos dos eventos podem ser obtidos selecionando a tabela `EVENTS` do Schema de Informações ou a partir de `SHOW EVENTS`, mas são relatados como valores ETZ ou STZ. A tabela a seguir resume a representação dos tempos dos eventos.

<table summary="Resumo da representação do tempo do evento (como valores em UTC, EZT ou STZ) da Tabela INFORMATION_SCHEMA.EVENTS e da Declaração SHOW EVENTS".><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>Valor</th> <th><a class="link" href="information-schema-events-table.html" title="28.3.14 A Tabela Tabela INFORMATION_SCHEMA EVENTS"><code>EVENTS</code></a></th> <th><a class="link" href="show-events.html" title="15.7.7.20 Declaração SHOW EVENTS"><code>SHOW EVENTS</code></a></th> </tr></thead><tbody><tr> <th>Executado em</th> <td>ETZ</td> <td>ETZ</td> </tr><tr> <th>Começa</th> <td>ETZ</td> <td>ETZ</td> </tr><tr> <th>Termina</th> <td>ETZ</td> <td>ETZ</td> </tr><tr> <th>Última execução</th> <td>ETZ</td> <td>n/a</td> </tr><tr> <th>Criado</th> <td>STZ</td> <td>n/a</td> </tr><tr> <th>Última alteração</th> <td>STZ</td> <td>n/a</td> </tr></tbody></table>