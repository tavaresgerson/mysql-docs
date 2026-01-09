### 28.4.20 A Tabela `INFORMATION_SCHEMA_INNODB_INDEXES`

A tabela `INNODB_INDEXES` fornece metadados sobre os índices `InnoDB`.

Para informações de uso relacionadas e exemplos, consulte a Seção 17.15.3, “Objetos de esquema `INFORMATION_SCHEMA` da tabela `InnoDB`”.

A tabela `INNODB_INDEXES` tem as seguintes colunas:

* `INDEX_ID`

  Um identificador para o índice. Os identificadores de índice são únicos em todas as bases de dados de uma instância.

* `NAME`

  O nome do índice. A maioria dos índices criados implicitamente pelo `InnoDB` tem nomes consistentes, mas os nomes dos índices nem sempre são únicos. Exemplos: `PRIMARY` para um índice de chave primária, `GEN_CLUST_INDEX` para o índice que representa uma chave primária quando não é especificada, e `ID_IND`, `FOR_IND` e `REF_IND` para restrições de chave estrangeira.

* `TABLE_ID`

  Um identificador que representa a tabela associada ao índice; o mesmo valor que `INNODB_TABLES.TABLE_ID`.

* `TYPE`

  Um valor numérico derivado de informações de nível de bits que identifica o tipo de índice. 0 = índice secundário não exclusivo; 1 = índice agrupado gerado automaticamente (`GEN_CLUST_INDEX`); 2 = índice não agrupado exclusivo; 3 = índice agrupado; 32 = índice de texto completo; 64 = índice espacial; 128 = índice secundário em uma coluna gerada virtualmente.

* `N_FIELDS`

  O número de colunas na chave do índice. Para índices `GEN_CLUST_INDEX`, esse valor é 0 porque o índice é criado usando um valor artificial em vez de uma coluna real da tabela.

* `PAGE_NO`

  O número de página raiz do índice B-tree. Para índices de texto completo, a coluna `PAGE_NO` é inutilizada e definida como -1 (`FIL_NULL`) porque o índice de texto completo é organizado em várias B-trees (tabelas auxiliares).

* `SPACE`

Um identificador para o espaço de tabelas onde o índice reside. 0 significa o espaço de tabelas do sistema `InnoDB`. Qualquer outro número representa uma tabela criada com um arquivo separado `.ibd` no modo arquivo por tabela. Esse identificador permanece o mesmo após uma instrução `TRUNCATE TABLE`. Como todos os índices de uma tabela residem no mesmo espaço de tabelas da tabela, esse valor não é necessariamente único.

* `MERGE_THRESHOLD`

  O valor do limiar de fusão para as páginas de índice. Se a quantidade de dados em uma página de índice cair abaixo do valor `MERGE_THRESHOLD` quando uma linha é excluída ou quando uma linha é encurtada por uma operação de atualização, o `InnoDB` tenta fusão a página de índice com a página de índice vizinha. O valor padrão do limiar é 50%. Para mais informações, consulte a Seção 17.8.11, “Configurando o Limiar de Fusão para Páginas de Índice”.

#### Exemplo

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_INDEXES WHERE TABLE_ID = 34\G
*************************** 1. row ***************************
       INDEX_ID: 39
           NAME: GEN_CLUST_INDEX
       TABLE_ID: 34
           TYPE: 1
       N_FIELDS: 0
        PAGE_NO: 3
          SPACE: 23
MERGE_THRESHOLD: 50
*************************** 2. row ***************************
       INDEX_ID: 40
           NAME: i1
       TABLE_ID: 34
           TYPE: 0
       N_FIELDS: 1
        PAGE_NO: 4
          SPACE: 23
MERGE_THRESHOLD: 50
```

#### Notas

* Você deve ter o privilégio `PROCESS` para consultar essa tabela.

* Use a tabela `COLUMNS` do `INFORMATION_SCHEMA` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas dessa tabela, incluindo tipos de dados e valores padrão.