### 29.4.6 Pré-filtragem por Fio

A tabela `threads` contém uma linha para cada fio do servidor. Cada linha contém informações sobre um fio e indica se o monitoramento está habilitado para ele. Para que o Schema de Desempenho possa monitorar um fio, essas coisas devem ser verdadeiras:

- O consumidor `thread_instrumentation` na tabela `setup_consumers` deve ser `YES`.

- A coluna `threads.INSTRUMENTED` deve ser `YES`.

- O monitoramento ocorre apenas para os eventos de thread gerados a partir de instrumentos habilitados na tabela `setup_instruments`.

A tabela `threads` também indica para cada fio do servidor se deve realizar o registro de eventos históricos. Isso inclui eventos de espera, estágio, declaração e transação e afeta o registro nessas tabelas:

```
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

- Os consumidores relacionados à história apropriados na tabela `setup_consumers` devem ser habilitados. Por exemplo, o registro de eventos de espera nas tabelas `events_waits_history` e `events_waits_history_long` requer que os consumidores correspondentes `events_waits_history` e `events_waits_history_long` estejam habilitados.

- A coluna `threads.HISTORY` deve ser `YES`.

- O registro ocorre apenas para aqueles eventos de thread gerados a partir de instrumentos habilitados na tabela `setup_instruments`.

Para os threads de primeiro plano (resultantes de conexões de clientes), os valores iniciais das colunas `INSTRUMENTED` e `HISTORY` nas linhas da tabela `threads` são determinados pelo fato de a conta de usuário associada a um thread corresponder a qualquer linha da tabela `setup_actors`. Os valores vêm das colunas `ENABLED` e `HISTORY` da linha de correspondência da tabela `setup_actors`.

Para os threads de segundo plano, não há um usuário associado. `INSTRUMENTED` e `HISTORY` são `YES` por padrão e `setup_actors` não é consultado.

O conteúdo inicial do `setup_actors` parece assim:

```
mysql> SELECT * FROM performance_schema.setup_actors;
+------+------+------+---------+---------+
| HOST | USER | ROLE | ENABLED | HISTORY |
+------+------+------+---------+---------+
| %    | %    | %    | YES     | YES     |
+------+------+------+---------+---------+
```

As colunas `HOST` e `USER` devem conter um nome de host ou usuário literal, ou `'%'` para corresponder a qualquer nome.

As colunas `ENABLED` e `HISTORY` indicam se é necessário habilitar a instrumentação e o registro de eventos históricos para os threads correspondentes, conforme as outras condições descritas anteriormente.

Quando o Schema de Desempenho verifica uma correspondência para cada novo fio em primeiro plano em `setup_actors`, ele tenta encontrar correspondências mais específicas primeiro, usando as colunas `USER` e `HOST` (`ROLE` é inutilizada):

- Linhas com `USER='literal'` e `HOST='literal'`.

- Linhas com `USER='literal'` e `HOST='%'`.

- Linhas com `USER='%'` e `HOST='literal'`.

- Linhas com `USER='%'` e `HOST='%'`.

A ordem em que a correspondência ocorre é importante porque diferentes linhas de correspondência `setup_actors` podem ter diferentes valores de `USER` e `HOST`. Isso permite que a instrumentação e o registro de eventos históricos sejam aplicados seletivamente por host, usuário ou conta (combinação de usuário e host), com base nos valores das colunas `ENABLED` e `HISTORY`:

- Quando a melhor correspondência é uma linha com `ENABLED=YES`, o valor `INSTRUMENTED` para o fio se torna `YES`. Quando a melhor correspondência é uma linha com `HISTORY=YES`, o valor `HISTORY` para o fio se torna `YES`.

- Quando a melhor correspondência é uma linha com `ENABLED=NO`, o valor `INSTRUMENTED` para o fio se torna `NO`. Quando a melhor correspondência é uma linha com `HISTORY=NO`, o valor `HISTORY` para o fio se torna `NO`.

- Quando não é encontrada nenhuma correspondência, os valores `INSTRUMENTED` e `HISTORY` para o fio se tornam `NO`.

As colunas `ENABLED` e `HISTORY` nas linhas `setup_actors` podem ser configuradas para `YES` ou `NO` independentemente uma da outra. Isso significa que você pode habilitar a instrumentação separadamente, independentemente de coletar eventos históricos.

Por padrão, o monitoramento e a coleta de eventos históricos estão habilitados para todos os novos threads em primeiro plano, pois a tabela `setup_actors` inicialmente contém uma linha com `'%'` para ambos `HOST` e `USER`. Para realizar uma correspondência mais limitada, como habilitar o monitoramento apenas para alguns threads em primeiro plano, você deve alterar essa linha, pois ela corresponde a qualquer conexão, e adicionar linhas para combinações mais específicas de `HOST`/`USER`.

Suponha que você modifique `setup_actors` da seguinte forma:

```
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

- Se `joe` se conectar do host local, a conexão corresponde à primeira linha inserida. Os valores `INSTRUMENTED` e `HISTORY` para o fio se tornam `YES`.

- Se `joe` se conecta a `hosta.example.com`, a conexão corresponde à segunda linha inserida. O valor `INSTRUMENTED` para o fio se torna `YES` e o valor `HISTORY` se torna `NO`.

- Se `joe` se conectar de qualquer outro host, não há correspondência. Os valores `INSTRUMENTED` e `HISTORY` para o thread se tornam `NO`.

- Se `sam` se conectar a qualquer host, a conexão corresponde à terceira linha inserida. O valor `INSTRUMENTED` para o thread se torna `NO` e o valor `HISTORY` se torna `YES`.

- Para qualquer outra conexão, a linha com `HOST` e `USER` definida como `'%'` corresponde. Essa linha agora tem `ENABLED` e `HISTORY` definidos como `NO`, então os valores de `INSTRUMENTED` e `HISTORY` para o fio se tornam `NO`.

As modificações na tabela `setup_actors` afetam apenas os threads de primeiro plano criados após a modificação, e não os threads existentes. Para afetar os threads existentes, modifique as colunas `INSTRUMENTED` e `HISTORY` das linhas da tabela `threads`.
