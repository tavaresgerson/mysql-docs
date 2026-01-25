### 24.4.25 A View INNODB_SYS_TABLESTATS do INFORMATION_SCHEMA

A tabela [`INNODB_SYS_TABLESTATS`](information-schema-innodb-sys-tablestats-table.html "24.4.25 A View INNODB_SYS_TABLESTATS do INFORMATION_SCHEMA") fornece uma visão de informações de status de baixo nível sobre tabelas `InnoDB`. Esses dados são usados pelo otimizador do MySQL para calcular qual Index usar ao executar uma Query em uma tabela `InnoDB`. Esta informação é derivada de estruturas de dados em memória, em vez de dados armazenados em disco. Não há uma tabela de sistema interna `InnoDB` correspondente.

Tabelas `InnoDB` são representadas nesta view se foram abertas desde a última reinicialização do servidor e não foram eliminadas (aged out) do table cache. Tabelas para as quais estatísticas persistentes estão disponíveis estão sempre representadas nesta view.

As estatísticas da tabela são atualizadas apenas para operações [`DELETE`](delete.html "13.2.2 DELETE Statement") ou [`UPDATE`](update.html "13.2.11 UPDATE Statement") que modificam colunas Indexadas. As estatísticas não são atualizadas por operações que modificam apenas colunas não Indexadas.

O comando [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") limpa as estatísticas da tabela e define a coluna `STATS_INITIALIZED` como `Uninitialized`. As estatísticas são coletadas novamente na próxima vez que a tabela for acessada.

Para informações de uso e exemplos relacionados, consulte [Seção 14.16.3, “Tabelas de Sistema INFORMATION_SCHEMA do InnoDB”](innodb-information-schema-system-tables.html "14.16.3 Tabelas de Sistema INFORMATION_SCHEMA do InnoDB").

A tabela [`INNODB_SYS_TABLESTATS`](information-schema-innodb-sys-tablestats-table.html "24.4.25 A View INNODB_SYS_TABLESTATS do INFORMATION_SCHEMA") possui estas colunas:

* `TABLE_ID`

  Um identificador que representa a tabela para a qual estatísticas estão disponíveis; o mesmo valor que `INNODB_SYS_TABLES.TABLE_ID`.

* `NAME`

  O nome da tabela; o mesmo valor que `INNODB_SYS_TABLES.NAME`.

* `STATS_INITIALIZED`

  O valor é `Initialized` se as estatísticas já foram coletadas, `Uninitialized` se não foram.

* `NUM_ROWS`

  O número estimado atual de linhas na tabela. Atualizado após cada operação DML. O valor pode ser impreciso se transações não confirmadas estiverem inserindo ou excluindo dados da tabela.

* `CLUST_INDEX_SIZE`

  O número de páginas em disco que armazenam o clustered Index, que mantém os dados da tabela `InnoDB` na ordem da Primary Key. Este valor pode ser nulo se nenhuma estatística tiver sido coletada para a tabela.

* `OTHER_INDEX_SIZE`

  O número de páginas em disco que armazenam todos os secondary Indexes para a tabela. Este valor pode ser nulo se nenhuma estatística tiver sido coletada para a tabela.

* `MODIFIED_COUNTER`

  O número de linhas modificadas por operações DML, como `INSERT`, `UPDATE`, `DELETE`, e também operações em cascata de foreign keys. Esta coluna é reiniciada toda vez que as estatísticas da tabela são recalculadas.

* `AUTOINC`

  O próximo número a ser emitido para qualquer operação baseada em auto-incremento. A taxa na qual o valor `AUTOINC` muda depende de quantas vezes os números de auto-incremento foram solicitados e quantos números são concedidos por solicitação.

* `REF_COUNT`

  Quando este contador atinge zero, os metadados da tabela podem ser despejados (evicted) do table cache.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLESTATS where TABLE_ID = 71\G
*************************** 1. row ***************************
         TABLE_ID: 71
             NAME: test/t1
STATS_INITIALIZED: Initialized
         NUM_ROWS: 1
 CLUST_INDEX_SIZE: 1
 OTHER_INDEX_SIZE: 0
 MODIFIED_COUNTER: 1
          AUTOINC: 0
        REF_COUNT: 1
```

#### Notas

* Esta tabela é útil principalmente para monitoramento de performance em nível de especialista, ou ao desenvolver extensões relacionadas à performance para o MySQL.

* Você deve ter o privilégio [`PROCESS`](privileges-provided.html#priv_process) para executar Query nesta tabela.

* Use a tabela [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") do `INFORMATION_SCHEMA` ou a instrução [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores default.