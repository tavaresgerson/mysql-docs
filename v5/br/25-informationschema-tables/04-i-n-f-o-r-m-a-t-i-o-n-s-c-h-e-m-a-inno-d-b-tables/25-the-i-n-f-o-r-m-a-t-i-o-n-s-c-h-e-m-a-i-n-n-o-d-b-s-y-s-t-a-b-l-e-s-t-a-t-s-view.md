### 24.4.25 A visão INFORMATION_SCHEMA INNODB_SYS_TABLESTATS

A tabela [`INNODB_SYS_TABLESTATS`](https://pt.wikipedia.org/wiki/Tabela_innodb_sys_tablestats) fornece uma visão de informações de status de nível baixo sobre as tabelas `InnoDB`. Esses dados são usados pelo otimizador do MySQL para calcular qual índice usar ao consultar uma tabela `InnoDB`. Essas informações são derivadas de estruturas de dados em memória, e não de dados armazenados em disco. Não existe uma tabela interna correspondente do sistema `InnoDB`.

As tabelas do `InnoDB` são representadas nesta visualização se tiverem sido abertas desde o último reinício do servidor e não tiverem sido excluídas do cache da tabela. As tabelas para as quais estão disponíveis estatísticas persistentes são sempre representadas nesta visualização.

As estatísticas da tabela são atualizadas apenas para operações de `DELETE` ou `UPDATE` que modificam colunas indexadas. As estatísticas não são atualizadas por operações que modificam apenas colunas não indexadas.

`ANALYSE TABELA` limpa as estatísticas da tabela e define a coluna `STATS_INITIALIZED` como `Não inicializada`. As estatísticas são coletadas novamente na próxima vez que a tabela for acessada.

Para informações de uso relacionadas e exemplos, consulte Seção 14.16.3, “Tabelas do Sistema InnoDB INFORMATION_SCHEMA”.

A tabela [`INNODB_SYS_TABLESTATS`](https://docs.oracle.com/en/database/MySQL/8/dev/innodb-sys-tablestats-table.html) possui as seguintes colunas:

- `TABLE_ID`

  Um identificador que representa a tabela para a qual estão disponíveis estatísticas; o mesmo valor que `INNODB_SYS_TABLES.TABLE_ID`.

- `NOME`

  O nome da tabela; o mesmo valor que `INNODB_SYS_TABLES.NAME`.

- `STATS_INITIALIZED`

  O valor é `Inicializado` se as estatísticas já estiverem coletadas e `Não inicializado` se não estiverem.

- `NUM_ROWS`

  O número atual estimado de linhas na tabela. Atualizado após cada operação DML. O valor pode ser impreciso se transações não confirmadas estiverem inserindo ou excluindo da tabela.

- `CLUST_INDEX_SIZE`

  O número de páginas no disco que armazenam o índice agrupado, que contém os dados da tabela `InnoDB` na ordem da chave primária. Esse valor pode ser nulo se ainda não tiverem sido coletadas estatísticas para a tabela.

- `OUTRO_TAMANHO_DE_ÍNDICE`

  O número de páginas no disco que armazenam todos os índices secundários da tabela. Esse valor pode ser nulo se ainda não tiverem sido coletadas estatísticas para a tabela.

- `MODIFICADO_CONTADOR`

  O número de linhas modificadas por operações de DML, como `INSERT`, `UPDATE`, `DELETE`, e também operações de cascata a partir de chaves estrangeiras. Esta coluna é redefinida sempre que as estatísticas da tabela são recalculadas.

- `AUTOINC`

  O próximo número a ser emitido para qualquer operação baseada em autoincremento. A taxa em que o valor `AUTOINC` muda depende de quantas vezes os números de autoincremento foram solicitados e quantos números são concedidos por solicitação.

- `REF_COUNT`

  Quando esse contador atingir zero, os metadados da tabela podem ser removidos do cache da tabela.

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

- Esta tabela é útil principalmente para o monitoramento de desempenho em nível de especialista, ou quando se desenvolvem extensões relacionadas ao desempenho para o MySQL.

- Você deve ter o privilégio `PROCESSO` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.
