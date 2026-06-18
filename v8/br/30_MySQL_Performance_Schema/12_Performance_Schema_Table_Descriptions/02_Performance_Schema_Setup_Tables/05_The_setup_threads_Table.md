#### 29.12.2.5 A tabela setup\_threads

A tabela `setup_threads` lista as classes de thread instrumentadas. Ela exibe os nomes e atributos das classes de thread:

```
mysql> SELECT * FROM performance_schema.setup_threads\G
*************************** 1. row ***************************
         NAME: thread/performance_schema/setup
      ENABLED: YES
      HISTORY: YES
   PROPERTIES: singleton
   VOLATILITY: 0
DOCUMENTATION: NULL
...
*************************** 4. row ***************************
         NAME: thread/sql/main
      ENABLED: YES
      HISTORY: YES
   PROPERTIES: singleton
   VOLATILITY: 0
DOCUMENTATION: NULL
*************************** 5. row ***************************
         NAME: thread/sql/one_connection
      ENABLED: YES
      HISTORY: YES
   PROPERTIES: user
   VOLATILITY: 0
DOCUMENTATION: NULL
...
*************************** 10. row ***************************
         NAME: thread/sql/event_scheduler
      ENABLED: YES
      HISTORY: YES
   PROPERTIES: singleton
   VOLATILITY: 0
DOCUMENTATION: NULL
```

A tabela `setup_threads` tem essas colunas:

- `NAME`

  O nome do instrumento. Os instrumentos de rosca começam com `thread` (por exemplo, `thread/sql/parser_service` ou `thread/performance_schema/setup`).

- `ENABLED`

  Se o instrumento está habilitado. O valor é `YES` ou `NO`. Esta coluna pode ser modificada, embora definir `ENABLED` não tenha efeito para os threads que já estão em execução.

  Para os threads de fundo, definir o valor `ENABLED` controla se `INSTRUMENTED` será definido como `YES` ou `NO` para os threads que são posteriormente criados para este instrumento e listados na tabela `threads`. Para os threads de primeiro plano, essa coluna não tem efeito; a tabela `setup_actors` tem precedência.

- `HISTORY`

  Se deve registrar eventos históricos para o instrumento. O valor é `YES` ou `NO`. Esta coluna pode ser modificada, embora definir `HISTORY` não tenha efeito para os threads que já estão em execução.

  Para os threads de fundo, definir o valor `HISTORY` controla se `HISTORY` será definido como `YES` ou `NO` para os threads que são posteriormente criados para este instrumento e listados na tabela `threads`. Para os threads de primeiro plano, essa coluna não tem efeito; a tabela `setup_actors` tem precedência.

- `PROPERTIES`

  Propriedades do instrumento. Esta coluna utiliza o tipo de dados `SET`, portanto, várias bandeiras da lista a seguir podem ser definidas por instrumento:

  - `singleton`: O instrumento tem uma única instância. Por exemplo, há apenas um fio para o instrumento `thread/sql/main`.

  - `user`: O instrumento está diretamente relacionado à carga de trabalho do usuário (ao contrário da carga de trabalho do sistema). Por exemplo, os threads como `thread/sql/one_connection` que executam uma sessão do usuário têm a propriedade `user` para diferenciá-los dos threads do sistema.

- `VOLATILITY`

  Volatilidade do instrumento. Esta coluna tem o mesmo significado da tabela `setup_instruments`. Veja a Seção 29.12.2.3, “A tabela setup\_instruments”.

- `DOCUMENTATION`

  Uma cadeia que descreve o propósito do instrumento. O valor é `NULL` se nenhuma descrição estiver disponível.

A tabela `setup_threads` tem esses índices:

- Chave primária em (`NAME`)

`TRUNCATE TABLE` não é permitido para a tabela `setup_threads`.
