### 25.4.6 Pré-filtragem por Fio

A tabela `threads` contém uma linha para cada thread do servidor. Cada linha contém informações sobre uma thread e indica se o monitoramento está habilitado para ela. Para que o Schema de Desempenho possa monitorar uma thread, essas coisas devem ser verdadeiras:

- O consumidor `thread_instrumentation` na tabela `setup_consumers` (performance-schema-setup-consumers-table.html) deve ser `YES`.

- A coluna `threads.INSTRUMENTED` deve ser `YES`.

- O monitoramento ocorre apenas para os eventos de thread gerados a partir de instrumentos que estão habilitados na tabela `setup_instruments` (performance-schema-setup-instruments-table.html).

A tabela `threads` também indica para cada thread do servidor se deve realizar o registro de eventos históricos. Isso inclui eventos de espera, estágio, declaração e transação e afeta o registro nessas tabelas:

```sql
events_waits_history
events_waits_history_long
events_stages_history
events_stages_history_long
events_statements_history
events_statements_history_long
events_transactions_history
events_transactions_history_long
```

Para que o registro de eventos históricos ocorra, essas coisas devem ser verdadeiras:

- Os consumidores apropriados relacionados à história na tabela `setup_consumers` devem estar habilitados. Por exemplo, para registrar eventos de espera na tabela `events_waits_history` e na tabela `events_waits_history_long`, é necessário que os consumidores `events_waits_history` e `events_waits_history_long` correspondentes estejam configurados como `YES`.

- A coluna `threads.HISTORY` deve ser `YES`.

- O registro ocorre apenas para aqueles eventos de thread gerados a partir de instrumentos que estão habilitados na tabela `setup_instruments` (performance-schema-setup-instruments-table.html).

Para os threads de primeiro plano (resultantes de conexões de clientes), os valores iniciais das colunas `INSTRUMENTED` e `HISTORY` nas linhas da tabela `threads` são determinados pelo fato de a conta de usuário associada a um thread corresponder a qualquer linha da tabela `setup_actors`. Os valores vêm das colunas `ENABLED` e `HISTORY` da linha de correspondência da tabela `setup_actors`.

Para os threads de plano de fundo, não há um usuário associado. `INSTRUMENTED` e `HISTORY` são `YES` por padrão e `setup_actors` não é consultado.

O conteúdo inicial do `setup_actors` parece assim:

```sql
mysql> SELECT * FROM performance_schema.setup_actors;
+------+------+------+---------+---------+
| HOST | USER | ROLE | ENABLED | HISTORY |
+------+------+------+---------+---------+
| %    | %    | %    | YES     | YES     |
+------+------+------+---------+---------+
```

As colunas `HOST` e `USER` devem conter um nome de host ou usuário literal ou `%'` para corresponder a qualquer nome.

As colunas `ENABLED` e `HISTORY` indicam se a instrumentação e o registro de eventos históricos devem ser habilitados para os threads correspondentes, conforme as outras condições descritas anteriormente.

Quando o Schema de Desempenho verifica uma correspondência para cada novo thread em primeiro plano em `setup_actors`, ele tenta encontrar correspondências mais específicas primeiro, usando as colunas `USER` e `HOST` (`ROLE` é inutilizado):

- Linhas com `USER='literal'` e `HOST='literal'`.

- Linhas com `USER='literal'` e `HOST='%'`.

- Linhas com `USER='%'` e `HOST='literal'`.

- Linhas com `USER='%'` e `HOST='%'`.

A ordem em que a correspondência ocorre é importante porque diferentes linhas da configuração de `setup_actors` podem ter diferentes valores de `USER` e `HOST`. Isso permite que a instrumentação e o registro de eventos históricos sejam aplicados seletivamente por host, usuário ou conta (combinação de usuário e host), com base nos valores das colunas `ENABLED` e `HISTORY`:

- Quando a melhor correspondência é uma linha com `ENABLED=YES`, o valor `INSTRUMENTED` para o thread se torna `YES`. Quando a melhor correspondência é uma linha com `HISTORY=YES`, o valor `HISTORY` para o thread se torna `YES`.

- Quando a melhor correspondência é uma linha com `ENABLED=NO`, o valor `INSTRUMENTED` para o thread se torna `NO`. Quando a melhor correspondência é uma linha com `HISTORY=NO`, o valor `HISTORY` para o thread se torna `NO`.

- Quando não é encontrada nenhuma correspondência, os valores `INSTRUMENTED` e `HISTORY` para o thread se tornam `NO`.

As colunas `ENABLED` e `HISTORY` nas linhas de `setup_actors` podem ser definidas como `YES` ou `NO`, independentemente uma da outra. Isso significa que você pode habilitar a instrumentação separadamente da coleta de eventos históricos.

Por padrão, o monitoramento e a coleta de eventos históricos estão habilitados para todos os novos threads em primeiro plano, pois a tabela `setup_actors` inicialmente contém uma linha com `'%'` para `HOST` e `USER`. Para realizar uma correspondência mais limitada, como habilitar o monitoramento apenas para alguns threads em primeiro plano, você deve alterar essa linha, pois ela corresponde a qualquer conexão, e adicionar linhas para combinações mais específicas de `HOST`/`USER`.

Suponha que você modifique `setup_actors` da seguinte forma:

```sql
UPDATE performance_schema.setup_actors
SET ENABLED = 'NO', HISTORY = 'NO'
WHERE HOST = '%' AND USER = '%';
INSERT INTO performance_schema.setup_actors
(HOST,USER,ROLE,ENABLED,HISTORY)
VALUES('localhost','joe','%','YES','YES');
INSERT INTO performance_schema.setup_actors
(HOST,USER,ROLE,ENABLED,HISTORY)
VALUES('hosta.example.com','joe','%','YES','NO');
INSERT INTO performance_schema.setup_actors
(HOST,USER,ROLE,ENABLED,HISTORY)
VALUES('%','sam','%','NO','YES');
```

A declaração `UPDATE` altera a correspondência padrão para desabilitar a instrumentação e a coleta de eventos históricos. As declarações `INSERT` adicionam linhas para correspondências mais específicas.

Agora, o Schema de Desempenho determina como definir os valores `INSTRUMENTED` e `HISTORY` para novos threads de conexão da seguinte forma:

- Se `joe` se conectar a partir do host local, a conexão corresponderá à primeira linha inserida. Os valores `INSTRUMENTED` e `HISTORY` para o thread se tornarão `YES`.

- Se `joe` se conectar a partir de `hosta.example.com`, a conexão corresponderá à segunda linha inserida. O valor `INSTRUMENTED` para o thread se tornará `YES` e o valor `HISTORY` se tornará `NO`.

- Se `joe` se conectar a qualquer outro host, não há correspondência. Os valores `INSTRUMENTED` e `HISTORY` para o thread se tornam `NO`.

- Se o `sam` se conectar a qualquer host, a conexão corresponderá à terceira linha inserida. O valor `INSTRUMENTED` para o thread se tornará `NO` e o valor `HISTORY` se tornará `YES`.

- Para qualquer outra conexão, a linha com `HOST` e `USER` definidos como `'%'` corresponde. Essa linha agora tem `ENABLED` e `HISTORY` definidos como `NO`, então os valores `INSTRUMENTED` e `HISTORY` para o thread se tornam `NO`.

As modificações na tabela `setup_actors` afetam apenas os threads de primeiro plano criados após a modificação, e não os threads existentes. Para afetar os threads existentes, modifique as colunas `INSTRUMENTED` e `HISTORY` das linhas da tabela `[threads]` (performance-schema-threads-table.html).
