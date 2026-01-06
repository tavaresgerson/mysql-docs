### 24.4.22 A tabela INFORMATION\_SCHEMA INNODB\_SYS\_INDEXES

A tabela [`INNODB_SYS_INDEXES`](https://pt.wikipedia.org/wiki/Tabela_information-schema-innodb-sys-indexes) fornece metadados sobre os índices do `InnoDB`, equivalentes às informações na tabela `SYS_INDEXES` interna do dicionário de dados do `InnoDB`.

Para informações de uso relacionadas e exemplos, consulte Seção 14.16.3, “Tabelas do Sistema InnoDB INFORMATION\_SCHEMA”.

A tabela `INNODB_SYS_INDEXES` tem as seguintes colunas:

- `INDEX_ID`

  Um identificador para o índice. Os identificadores de índice são únicos em todas as bases de dados de uma instância.

- `NOME`

  O nome do índice. A maioria dos índices criados implicitamente pelo `InnoDB` tem nomes consistentes, mas os nomes dos índices nem sempre são exclusivos. Exemplos: `PRIMARY` para um índice de chave primária, `GEN_CLUST_INDEX` para o índice que representa uma chave primária quando uma não é especificada, e `ID_IND`, `FOR_IND` e `REF_IND` para restrições de chave estrangeira.

- `TABLE_ID`

  Um identificador que representa a tabela associada ao índice; o mesmo valor que `INNODB_SYS_TABLES.TABLE_ID`.

- `TIPO`

  Um valor numérico derivado de informações de nível de bits que identifica o tipo de índice. 0 = índice secundário não exclusivo; 1 = índice agrupado gerado automaticamente (`GEN_CLUST_INDEX`); 2 = índice não agrupado exclusivo; 3 = índice agrupado; 32 = índice de texto completo; 64 = índice espacial; 128 = índice secundário em uma coluna gerada virtualmente.

- `N_FIELDS`

  O número de colunas na chave do índice. Para índices `GEN_CLUST_INDEX`, esse valor é 0 porque o índice é criado usando um valor artificial em vez de uma coluna real da tabela.

- `PAGE_NO`

  O número da página raiz da árvore B-tree do índice. Para índices de texto completo, a coluna `PAGE_NO` é desativada e definida como -1 (`FIL_NULL`), porque o índice de texto completo é organizado em várias árvores B-tree (tabelas auxiliares).

- `ESPACO`

  Um identificador para o espaço de tabelas onde o índice reside. 0 significa o `InnoDB` espaço de tabelas do sistema. Qualquer outro número representa uma tabela criada com um arquivo `.ibd` separado no modo file-per-table. Esse identificador permanece o mesmo após uma declaração de `TRUNCATE TABLE`. Como todos os índices de uma tabela residem no mesmo espaço de tabelas da tabela, esse valor não é necessariamente único.

- `MERGE_THRESHOLD`

  O valor do limiar de fusão para páginas de índice. Se a quantidade de dados em uma página de índice cair abaixo do valor de `MERGE_THRESHOLD` quando uma linha é excluída ou quando uma linha é encurtada por uma operação de atualização, o `InnoDB` tenta fusão a página de índice com a página de índice vizinha. O valor padrão do limiar é de 50%. Para mais informações, consulte Seção 14.8.12, “Configurando o Limiar de Fusão para Páginas de Índice”.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_INDEXES WHERE TABLE_ID = 34\G
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

- Você deve ter o privilégio `PROCESSO` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.
