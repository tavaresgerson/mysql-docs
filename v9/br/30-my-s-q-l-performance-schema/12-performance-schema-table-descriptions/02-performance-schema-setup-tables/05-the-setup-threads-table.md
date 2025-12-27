#### 29.12.2.5 A tabela `setup_threads`

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

A tabela `setup_threads` tem as seguintes colunas:

* `NAME`

  O nome do instrumento. Os instrumentos de thread começam com `thread` (por exemplo, `thread/sql/parser_service` ou `thread/performance_schema/setup`).

* `ENABLED`

  Se o instrumento está habilitado. O valor é `YES` ou `NO`. Esta coluna pode ser modificada, embora a definição de `ENABLED` não tenha efeito para threads que já estão em execução.

  Para threads de segundo plano, a definição do valor de `ENABLED` controla se `INSTRUMENTED` é definido como `YES` ou `NO` para threads que são posteriormente criadas para este instrumento e listadas na tabela `threads`. Para threads de primeiro plano, esta coluna não tem efeito; a tabela `setup_actors` tem precedência.

* `HISTORY`

  Se os eventos históricos devem ser registrados para o instrumento. O valor é `YES` ou `NO`. Esta coluna pode ser modificada, embora a definição de `HISTORY` não tenha efeito para threads que já estão em execução.

  Para threads de segundo plano, a definição do valor de `HISTORY` controla se `HISTORY` é definido como `YES` ou `NO` para threads que são posteriormente criadas para este instrumento e listadas na tabela `threads`. Para threads de primeiro plano, esta coluna não tem efeito; a tabela `setup_actors` tem precedência.

* `PROPERTIES`

  As propriedades do instrumento. Esta coluna usa o tipo de dados `SET`, então múltiplas flags da seguinte lista podem ser definidas por instrumento:

  + `singleton`: O instrumento tem uma única instância. Por exemplo, há apenas um thread para o instrumento `thread/sql/main`.

+ `user`: O instrumento está diretamente relacionado ao volume de trabalho do usuário (ao contrário do volume de trabalho do sistema). Por exemplo, os threads como `thread/sql/one_connection` que executam uma sessão do usuário têm a propriedade `user` para diferenciá-los dos threads do sistema.

* `VOLATILITY`

  A volatilidade do instrumento. Esta coluna tem o mesmo significado que na tabela `setup_instruments`. Veja a Seção 29.12.2.3, “A tabela setup\_instruments”.

* `DOCUMENTATION`

  Uma string que descreve o propósito do instrumento. O valor é `NULL` se não houver descrição disponível.

A tabela `setup_threads` tem esses índices:

* Chave primária em (`NAME`)

O `TRUNCATE TABLE` não é permitido para a tabela `setup_threads`.