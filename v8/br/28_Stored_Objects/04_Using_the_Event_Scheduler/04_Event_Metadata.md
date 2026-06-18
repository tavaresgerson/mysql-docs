### 27.4.4 Metadados do evento

Para obter metadados sobre eventos:

- Interrogue a tabela `EVENTS` do banco de dados `INFORMATION_SCHEMA`. Veja a Seção 28.3.14, “A tabela INFORMATION\_SCHEMA EVENTS”.

- Use a declaração `SHOW CREATE EVENT`. Veja a Seção 15.7.7.7, “Declaração SHOW CREATE EVENT”.

- Use a declaração `SHOW EVENTS`. Veja a Seção 15.7.7.18, “Declaração SHOW EVENTS”.

**Representação de Tempo no Agendamento de Eventos**

Cada sessão no MySQL tem um fuso horário de sessão (STZ). Esse é o valor `time_zone` da sessão que é inicializado a partir do valor global `time_zone` do servidor quando a sessão começa, mas pode ser alterado durante a sessão.

O fuso horário da sessão que está em vigor quando uma declaração `CREATE EVENT` ou `ALTER EVENT` é executada é usado para interpretar os horários especificados na definição do evento. Isso se torna o fuso horário do evento (ETZ); ou seja, o fuso horário usado para a programação do evento e que está em vigor dentro do evento conforme ele é executado.

Para a representação das informações do evento no dicionário de dados, os tempos `execute_at`, `starts` e `ends` são convertidos para UTC e armazenados juntamente com o fuso horário do evento. Isso permite que a execução do evento prossiga conforme definido, independentemente de quaisquer alterações subsequentes no fuso horário do servidor ou efeitos do horário de verão. O tempo `last_executed` também é armazenado em UTC.

Os horários dos eventos podem ser obtidos selecionando a tabela Schema de Informações `EVENTS` ou a partir de `SHOW EVENTS`, mas são relatados como valores ETZ ou STZ. A tabela a seguir resume a representação dos horários dos eventos.

<table summary="Resumo da representação do tempo do evento (como valores UTC, EZT ou STZ) a partir da INFORMATION_SCHEMA.EVENTS e mostre eventos."><thead><tr> <th scope="col">Valor</th> <th scope="col">[[<code>EVENTS</code>]] Tabela</th> <th scope="col">[[<code>SHOW EVENTS</code>]]</th> </tr></thead><tbody><tr> <th>Execute em</th> <td>ETZ</td> <td>ETZ</td> </tr><tr> <th>Começa</th> <td>ETZ</td> <td>ETZ</td> </tr><tr> <th>Termina</th> <td>ETZ</td> <td>ETZ</td> </tr><tr> <th>Última execução</th> <td>ETZ</td> <td>n/a</td> </tr><tr> <th>Criado</th> <td>STZ</td> <td>n/a</td> </tr><tr> <th>Última alteração</th> <td>STZ</td> <td>n/a</td> </tr></tbody></table>
