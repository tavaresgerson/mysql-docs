### 25.4.6 Pré-Filtragem por Thread

A tabela [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") contém uma linha para cada server Thread. Cada linha contém informações sobre um Thread e indica se o monitoramento está ativado para ele. Para que o Performance Schema monitore um Thread, as seguintes condições devem ser verdadeiras:

* O `consumer` `thread_instrumentation` na tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") deve ser `YES`.

* A coluna `threads.INSTRUMENTED` deve ser `YES`.

* O monitoramento ocorre apenas para aqueles eventos de Thread produzidos a partir de `instruments` que estão habilitados na tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table").

A tabela [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") também indica, para cada server Thread, se deve ser realizado o logging de eventos históricos. Isso inclui eventos de wait, stage, statement e transaction, e afeta o logging nestas tabelas:

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

Para que o logging de eventos históricos ocorra, as seguintes condições devem ser verdadeiras:

* Os `consumers` apropriados relacionados ao histórico na tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") devem estar habilitados. Por exemplo, o logging de eventos de wait nas tabelas [`events_waits_history`](performance-schema-events-waits-history-table.html "25.12.4.2 The events_waits_history Table") e [`events_waits_history_long`](performance-schema-events-waits-history-long-table.html "25.12.4.3 The events_waits_history_long Table") requer que os `consumers` correspondentes `events_waits_history` e `events_waits_history_long` sejam `YES`.

* A coluna `threads.HISTORY` deve ser `YES`.

* O logging ocorre apenas para aqueles eventos de Thread produzidos a partir de `instruments` que estão habilitados na tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table").

Para foreground threads (resultantes de conexões de cliente), os valores iniciais das colunas `INSTRUMENTED` e `HISTORY` nas linhas da tabela [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") são determinados pelo fato de a conta de usuário associada a um Thread corresponder a alguma linha na tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table"). Os valores são extraídos das colunas `ENABLED` e `HISTORY` da linha correspondente da tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table").

Para background threads, não há usuário associado. `INSTRUMENTED` e `HISTORY` são `YES` por padrão e a tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") não é consultada.

O conteúdo inicial da tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") é o seguinte:

```sql
mysql> SELECT * FROM performance_schema.setup_actors;
+------+------+------+---------+---------+
| HOST | USER | ROLE | ENABLED | HISTORY |
+------+------+------+---------+---------+
| %    | %    | %    | YES     | YES     |
+------+------+------+---------+---------+
```

As colunas `HOST` e `USER` devem conter um host literal ou nome de usuário, ou `'%'` para corresponder a qualquer nome.

As colunas `ENABLED` e `HISTORY` indicam se devem ser ativadas a instrumentation e o logging de eventos históricos para os Threads correspondentes, sujeitas às outras condições descritas anteriormente.

Quando o Performance Schema verifica por uma correspondência para cada novo foreground thread em `setup_actors`, ele tenta encontrar as correspondências mais específicas primeiro, utilizando as colunas `USER` e `HOST` (`ROLE` não é utilizada):

* Linhas com `USER='literal'` e `HOST='literal'`.

* Linhas com `USER='literal'` e `HOST='%'`.

* Linhas com `USER='%'` e `HOST='literal'`.

* Linhas com `USER='%'` e `HOST='%'`.

A ordem em que a correspondência ocorre é importante, pois diferentes linhas de correspondência na tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") podem ter diferentes valores de `USER` e `HOST`. Isso permite que a instrumentation e o logging de eventos históricos sejam aplicados seletivamente por host, usuário ou conta (combinação de usuário e host), com base nos valores das colunas `ENABLED` e `HISTORY`:

* Quando a melhor correspondência é uma linha com `ENABLED=YES`, o valor `INSTRUMENTED` para o Thread se torna `YES`. Quando a melhor correspondência é uma linha com `HISTORY=YES`, o valor `HISTORY` para o Thread se torna `YES`.

* Quando a melhor correspondência é uma linha com `ENABLED=NO`, o valor `INSTRUMENTED` para o Thread se torna `NO`. Quando a melhor correspondência é uma linha com `HISTORY=NO`, o valor `HISTORY` para o Thread se torna `NO`.

* Quando nenhuma correspondência é encontrada, os valores `INSTRUMENTED` e `HISTORY` para o Thread se tornam `NO`.

As colunas `ENABLED` e `HISTORY` nas linhas da tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") podem ser definidas como `YES` ou `NO` independentemente uma da outra. Isso significa que você pode habilitar a instrumentation separadamente da coleta de eventos históricos.

Por padrão, o monitoramento e a coleta de eventos históricos são habilitados para todos os novos foreground threads, pois a tabela [`setup_actors`](performance-schema-schema-actors-table.html "25.12.2.1 The setup_actors Table") inicialmente contém uma linha com `'%'` tanto para `HOST` quanto para `USER`. Para realizar uma correspondência mais limitada, como habilitar o monitoramento apenas para alguns foreground threads, você deve alterar essa linha, pois ela corresponde a qualquer conexão, e adicionar linhas para combinações `HOST`/`USER` mais específicas.

Suponha que você modifique a tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") da seguinte forma:

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

A instrução [`UPDATE`](update.html "13.2.11 UPDATE Statement") altera a correspondência padrão para desabilitar a instrumentation e a coleta de eventos históricos. As instruções [`INSERT`](insert.html "13.2.5 INSERT Statement") adicionam linhas para correspondências mais específicas.

Agora, o Performance Schema determina como definir os valores `INSTRUMENTED` e `HISTORY` para novos connection threads da seguinte forma:

* Se `joe` se conectar a partir do host local, a conexão corresponde à primeira linha inserida. Os valores `INSTRUMENTED` e `HISTORY` para o Thread se tornam `YES`.

* Se `joe` se conectar a partir de `hosta.example.com`, a conexão corresponde à segunda linha inserida. O valor `INSTRUMENTED` para o Thread se torna `YES` e o valor `HISTORY` se torna `NO`.

* Se `joe` se conectar a partir de qualquer outro host, não há correspondência. Os valores `INSTRUMENTED` e `HISTORY` para o Thread se tornam `NO`.

* Se `sam` se conectar a partir de qualquer host, a conexão corresponde à terceira linha inserida. O valor `INSTRUMENTED` para o Thread se torna `NO` e o valor `HISTORY` se torna `YES`.

* Para qualquer outra conexão, a linha com `HOST` e `USER` definidos como `'%'` corresponde. Esta linha agora tem `ENABLED` e `HISTORY` definidos como `NO`, então os valores `INSTRUMENTED` e `HISTORY` para o Thread se tornam `NO`.

Modificações na tabela [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") afetam apenas foreground threads criados subsequentemente à modificação, e não Threads existentes. Para afetar Threads existentes, modifique as colunas `INSTRUMENTED` e `HISTORY` das linhas da tabela [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table").