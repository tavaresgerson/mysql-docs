### 28.4.23 A tabela INFORMATION\_SCHEMA INNODB\_TABLES

A tabela `INNODB_TABLES` fornece metadados sobre as tabelas `InnoDB`.

Para informações de uso relacionadas e exemplos, consulte a Seção 17.15.3, “Tabelas de Objetos do Schema InnoDB INFORMATION\_SCHEMA”.

A tabela `INNODB_TABLES` tem essas colunas:

- `TABLE_ID`

  Um identificador para a tabela `InnoDB`. Esse valor é único em todos os bancos de dados da instância.

- `NAME`

  O nome da tabela, precedido pelo nome do esquema (banco de dados), quando aplicável (por exemplo, `test/t1`). Os nomes dos bancos de dados e das tabelas de usuários estão no mesmo caso em que foram originalmente definidos, possivelmente influenciados pelo ajuste `lower_case_table_names`.

- `FLAG`

  Um valor numérico que representa informações de nível de bits sobre o formato da tabela e as características de armazenamento.

- `N_COLS`

  O número de colunas na tabela. O número reportado inclui três colunas ocultas que são criadas por `InnoDB` (`DB_ROW_ID`, `DB_TRX_ID` e `DB_ROLL_PTR`). O número reportado também inclui colunas geradas virtualmente, se estiverem presentes.

- `SPACE`

  Um identificador para o espaço de tabelas onde a tabela reside. 0 significa o espaço de tabelas `InnoDB` do sistema. Qualquer outro número representa um espaço de tabelas por arquivo ou um espaço de tabelas geral. Esse identificador permanece o mesmo após uma declaração `TRUNCATE TABLE`. Para espaços de tabelas por arquivo, esse identificador é único para tabelas em todos os bancos de dados da instância.

- `ROW_FORMAT`

  O formato da linha da tabela (`Compact`, `Redundant`, `Dynamic` ou `Compressed`).

- `ZIP_PAGE_SIZE`

  O tamanho do arquivo ZIP. Aplica-se apenas a tabelas com um formato de linha de `Compressed`.

- `SPACE_TYPE`

  O tipo de espaço de tabela ao qual a tabela pertence. Os valores possíveis incluem `System` para o espaço de tabela do sistema, `General` para espaços de tabela gerais e `Single` para espaços de tabela por arquivo. As tabelas atribuídas ao espaço de tabela do sistema usando `CREATE TABLE` ou `ALTER TABLE` `TABLESPACE=innodb_system` têm um `SPACE_TYPE` de `General`. Para mais informações, consulte `CREATE TABLESPACE`.

- `INSTANT_COLS`

  O número de colunas que existiam antes da primeira coluna instantânea ser adicionada usando `ALTER TABLE ... ADD COLUMN` com `ALGORITHM=INSTANT`. Esta coluna não é mais usada a partir do MySQL 8.0.29, mas continua a exibir informações para tabelas com colunas adicionadas instantaneamente antes do MySQL 8.0.29.

- `TOTAL_ROW_VERSIONS`

  O número de versões de linha para a tabela. O valor inicial é

  0. O valor é incrementado por operações `ALTER TABLE ... ALGORITHM=INSTANT` que adicionam ou removem colunas. Quando uma tabela com colunas adicionadas ou removidas instantaneamente é reconstruída devido a uma operação de reconstrução de tabela `ALTER TABLE` ou `OPTIMIZE TABLE`, o valor é redefinido para 0. Para mais informações, consulte Operações de Colunas.

#### Exemplo

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TABLES WHERE TABLE_ID = 214\G
*************************** 1. row ***************************
          TABLE_ID: 1064
              NAME: test/t1
              FLAG: 33
            N_COLS: 6
             SPACE: 3
        ROW_FORMAT: Dynamic
     ZIP_PAGE_SIZE: 0
        SPACE_TYPE: Single
      INSTANT_COLS: 0
TOTAL_ROW_VERSIONS: 3
```

#### Notas

- Você deve ter o privilégio `PROCESS` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.
