#### 29.12.2.1 A tabela setup\_actors

A tabela `setup_actors` contém informações que determinam se o monitoramento e o registro de eventos históricos para novos threads de servidor em primeiro plano (threads associados a conexões de cliente) devem ser habilitados. Essa tabela tem um tamanho máximo de 100 linhas por padrão. Para alterar o tamanho da tabela, modifique a variável de sistema `performance_schema_setup_actors_size` durante o início do servidor.

Para cada novo fio de plano de fundo, o Schema de Desempenho corresponde o usuário e o host do fio às linhas da tabela `setup_actors`. Se uma linha dessa tabela corresponder, os valores das colunas `ENABLED` e `HISTORY` são usados para definir as colunas `INSTRUMENTED` e `HISTORY` da linha da tabela `threads` para o fio. Isso permite que a instrumentação e o registro de eventos históricos sejam aplicados seletivamente por host, usuário ou conta (combinação de usuário e host). Se não houver correspondência, as colunas `INSTRUMENTED` e `HISTORY` para o fio são definidas como `NO`.

Para os threads de segundo plano, não há um usuário associado. `INSTRUMENTED` e `HISTORY` são `YES` por padrão e `setup_actors` não é consultado.

Os conteúdos iniciais da tabela `setup_actors` correspondem a qualquer combinação de usuário e host, portanto, o monitoramento e a coleta de eventos históricos são ativados por padrão para todos os threads em primeiro plano:

```
mysql> SELECT * FROM performance_schema.setup_actors;
+------+------+------+---------+---------+
| HOST | USER | ROLE | ENABLED | HISTORY |
+------+------+------+---------+---------+
| %    | %    | %    | YES     | YES     |
+------+------+------+---------+---------+
```

Para obter informações sobre como usar a tabela `setup_actors` para afetar o monitoramento de eventos, consulte a Seção 29.4.6, “Pré-filtragem por Fio”.

As modificações na tabela `setup_actors` afetam apenas os threads de primeiro plano criados após a modificação, e não os threads existentes. Para afetar os threads existentes, modifique as colunas `INSTRUMENTED` e `HISTORY` das linhas da tabela `threads`.

A tabela `setup_actors` tem essas colunas:

- `HOST`

  O nome do host. Deve ser um nome literal, ou `'%'` para significar “qualquer host”.

- `USER`

  O nome do usuário. Deve ser um nome literal, ou `'%'` para significar “qualquer usuário”.

- `ROLE`

  Unused.

- `ENABLED`

  Se habilitar a instrumentação para os threads de primeiro plano correspondentes à linha. O valor é `YES` ou `NO`.

- `HISTORY`

  Se deve registrar eventos históricos para os threads de primeiro plano correspondentes à linha. O valor é `YES` ou `NO`.

A tabela `setup_actors` tem esses índices:

- Chave primária em (`HOST`, `USER`, `ROLE`)

`TRUNCATE TABLE` é permitido para a tabela `setup_actors`. Ele remove as linhas.
