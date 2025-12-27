### 28.4.26 A visão `INFORMATION\_SCHEMA\_INNODB\_TABLESTATS`

A tabela `INNODB\_TABLESTATS` fornece uma visão de informações de status de nível baixo sobre as tabelas `InnoDB`. Esses dados são usados pelo otimizador do MySQL para calcular qual índice usar ao consultar uma tabela `InnoDB`. Essas informações são derivadas de estruturas de dados em memória, e não de dados armazenados em disco. Não existe uma tabela interna correspondente do sistema `InnoDB`.

As tabelas `InnoDB` são representadas nesta visão se tiverem sido abertas desde a última reinicialização do servidor e não tiverem sido excluídas do cache de tabelas. As tabelas para as quais estatísticas persistentes estão disponíveis são sempre representadas nesta visão.

As estatísticas da tabela são atualizadas apenas para operações `DELETE` ou `UPDATE` que modificam colunas indexadas. As estatísticas não são atualizadas por operações que modificam apenas colunas não indexadas.

`ANALYZE TABLE` limpa as estatísticas da tabela e define a coluna `STATS\_INITIALIZED` como `Uninitialized`. As estatísticas são coletadas novamente na próxima vez que a tabela for acessada.

Para informações de uso relacionadas e exemplos, consulte a Seção 17.15.3, “Objetos de esquema do `INFORMATION\_SCHEMA` da tabela”.

A tabela `INNODB\_TABLESTATS` tem as seguintes colunas:

* `TABLE\_ID`

  Um identificador que representa a tabela para a qual as estatísticas estão disponíveis; o mesmo valor que `INNODB\_TABLES.TABLE\_ID`.

* `NAME`

  O nome da tabela; o mesmo valor que `INNODB\_TABLES.NAME`.

* `STATS\_INITIALIZED`

  O valor é `Initialized` se as estatísticas já estiverem coletadas, `Uninitialized` se não estiverem.

* `NUM\_ROWS`

  O número estimado atual de linhas na tabela. Atualizado após cada operação DML. O valor pode ser impreciso se transações não confirmadas estão inserindo ou excluindo da tabela.

* `CLUST\_INDEX\_SIZE`

O número de páginas no disco que armazenam o índice agrupado, que contém os dados da tabela `InnoDB` na ordem da chave primária. Esse valor pode ser nulo se ainda não tiverem sido coletadas estatísticas para a tabela.

* `OTHER_INDEX_SIZE`

  O número de páginas no disco que armazenam todos os índices secundários da tabela. Esse valor pode ser nulo se ainda não tiverem sido coletadas estatísticas para a tabela.

* `MODIFIED_COUNTER`

  O número de linhas modificadas por operações DML, como `INSERT`, `UPDATE`, `DELETE`, e também operações de cascata de chaves estrangeiras. Essa coluna é reinicializada sempre que as estatísticas da tabela são recalculadas.

* `AUTOINC`

  O próximo número a ser emitido para qualquer operação baseada em autoincremento. A taxa em que o valor `AUTOINC` muda depende de quantas vezes os números de autoincremento foram solicitados e quantos números são concedidos por solicitação.

* `REF_COUNT`

  Quando esse contador atingir zero, os metadados da tabela podem ser expulsos do cache da tabela.

#### Exemplo

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TABLESTATS where TABLE_ID = 71\G
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

* Esta tabela é útil principalmente para monitoramento de desempenho em nível de especialista ou quando se está desenvolvendo extensões relacionadas ao desempenho para o MySQL.

* Você deve ter o privilégio `PROCESS` para consultar essa tabela.

* Use a tabela `COLUMNS` do `INFORMATION_SCHEMA` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas dessa tabela, incluindo tipos de dados e valores padrão.