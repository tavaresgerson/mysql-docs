### 10.2.4 Otimizando Consultas do Schema de Desempenho

Aplicações que monitoram bancos de dados podem fazer uso frequente das tabelas do Schema de Desempenho. Para escrever consultas para essas tabelas de forma mais eficiente, aproveite seus índices. Por exemplo, inclua uma cláusula `WHERE` que restrinja as linhas recuperadas com base na comparação a valores específicos em uma coluna indexada.

A maioria das tabelas do Schema de Desempenho tem índices. As tabelas que não têm são aquelas que normalmente contêm poucas linhas ou são improváveis de serem consultadas com frequência. Os índices do Schema de Desempenho dão ao otimizador acesso a planos de execução diferentes de varreduras completas da tabela. Esses índices também melhoram o desempenho para objetos relacionados, como as visualizações do esquema `sys` que usam essas tabelas.

Para ver se uma determinada tabela do Schema de Desempenho tem índices e quais são eles, use `SHOW INDEX` ou `SHOW CREATE TABLE`:

```
mysql> SHOW INDEX FROM performance_schema.accounts\G
*************************** 1. row ***************************
        Table: accounts
   Non_unique: 0
     Key_name: ACCOUNT
 Seq_in_index: 1
  Column_name: USER
    Collation: NULL
  Cardinality: NULL
     Sub_part: NULL
       Packed: NULL
         Null: YES
   Index_type: HASH
      Comment:
Index_comment:
      Visible: YES
*************************** 2. row ***************************
        Table: accounts
   Non_unique: 0
     Key_name: ACCOUNT
 Seq_in_index: 2
  Column_name: HOST
    Collation: NULL
  Cardinality: NULL
     Sub_part: NULL
       Packed: NULL
         Null: YES
   Index_type: HASH
      Comment:
Index_comment:
      Visible: YES

mysql> SHOW CREATE TABLE performance_schema.rwlock_instances\G
*************************** 1. row ***************************
       Table: rwlock_instances
Create Table: CREATE TABLE `rwlock_instances` (
  `NAME` varchar(128) NOT NULL,
  `OBJECT_INSTANCE_BEGIN` bigint(20) unsigned NOT NULL,
  `WRITE_LOCKED_BY_THREAD_ID` bigint(20) unsigned DEFAULT NULL,
  `READ_LOCKED_BY_COUNT` int(10) unsigned NOT NULL,
  PRIMARY KEY (`OBJECT_INSTANCE_BEGIN`),
  KEY `NAME` (`NAME`),
  KEY `WRITE_LOCKED_BY_THREAD_ID` (`WRITE_LOCKED_BY_THREAD_ID`)
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

Para ver o plano de execução para uma consulta do Schema de Desempenho e se ela usa algum índice, use `EXPLAIN`:

```
mysql> EXPLAIN SELECT * FROM performance_schema.accounts
       WHERE (USER,HOST) = ('root','localhost')\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: accounts
   partitions: NULL
         type: const
possible_keys: ACCOUNT
          key: ACCOUNT
      key_len: 278
          ref: const,const
         rows: 1
     filtered: 100.00
        Extra: NULL
```

A saída do `EXPLAIN` indica que o otimizador usa o índice da tabela `ACCOUNT` do `accounts` que compreende as colunas `USER` e `HOST`.

Os índices do Schema de Desempenho são virtuais: são uma construção do motor de armazenamento do Schema de Desempenho e não usam memória ou armazenamento em disco. O Schema de Desempenho relata informações sobre os índices ao otimizador para que ele possa construir planos de execução eficientes. O Schema de Desempenho, por sua vez, usa informações do otimizador sobre o que procurar (por exemplo, um valor de chave particular), para que ele possa realizar buscas eficientes sem construir estruturas de índice reais. Essa implementação oferece dois benefícios importantes:

* Evita completamente o custo de manutenção normalmente incorrido para tabelas que passam por atualizações frequentes.

* Reduz, em uma fase inicial da execução da consulta, a quantidade de dados recuperados. Para condições nas colunas indexadas, o Schema de Desempenho retorna eficientemente apenas as linhas da tabela que satisfazem as condições da consulta. Sem um índice, o Schema de Desempenho retornaria todas as linhas da tabela, exigindo que o otimizador avaliasse as condições contra cada linha posteriormente para produzir o resultado final.

Os índices do Schema de Desempenho são pré-definidos e não podem ser excluídos, adicionados ou alterados.

Os índices do Schema de Desempenho são semelhantes aos índices de hash. Por exemplo:

* Eles são usados apenas para comparações de igualdade que utilizam os operadores `=` ou `<=>`.

* Eles não têm ordem. Se o resultado de uma consulta deve ter características específicas de ordem de linha, inclua uma cláusula `ORDER BY`.

Para obter informações adicionais sobre índices de hash, consulte a Seção 10.3.9, “Comparação de Índices B-Tree e Hash”.