### 28.4.23 A Tabela `INFORMATION_SCHEMA.INNODB_TABLES`

A tabela `INNODB_TABLES` fornece metadados sobre as tabelas `InnoDB`.

Para informações de uso relacionadas e exemplos, consulte a Seção 17.15.3, “Objetos de Schema de Informação `INFORMATION_SCHEMA` da Tabela”.

A tabela `INNODB_TABLES` tem as seguintes colunas:

* `TABLE_ID`

  Um identificador para a tabela `InnoDB`. Esse valor é único em todas as bases de dados da instância.

* `NAME`

  O nome da tabela, precedido pelo nome do esquema (banco de dados), se aplicável (por exemplo, `test/t1`). Os nomes de bancos de dados e tabelas de usuários estão no mesmo caso em que foram originalmente definidos, possivelmente influenciados pelo ajuste `lower_case_table_names`.

* `FLAG`

  Um valor numérico que representa informações de nível de bit sobre o formato da tabela e as características de armazenamento.

* `N_COLS`

  O número de colunas na tabela. O número reportado inclui três colunas ocultas que são criadas pelo `InnoDB` (`DB_ROW_ID`, `DB_TRX_ID` e `DB_ROLL_PTR`). O número reportado também inclui colunas geradas virtualmente, se presentes.

* `SPACE`

  Um identificador para o tablespace onde a tabela reside. 0 significa o tablespace de sistema `InnoDB`. Qualquer outro número representa um tablespace por arquivo ou um tablespace geral. Esse identificador permanece o mesmo após uma instrução `TRUNCATE TABLE`. Para tablespaces por arquivo, esse identificador é único para tabelas em todas as bases de dados da instância.

* `ROW_FORMAT`

  O formato de linha da tabela (`Compact`, `Redundant`, `Dynamic` ou `Compressed`).

* `ZIP_PAGE_SIZE`

  O tamanho da página zip. Aplica-se apenas a tabelas com um formato de linha de `Compressed`.

* `SPACE_TYPE`

O tipo de espaço de tabela ao qual a tabela pertence. Os valores possíveis incluem `System` para o espaço de tabela do sistema, `General` para espaços de tabela gerais e `Single` para espaços de tabela por arquivo. As tabelas atribuídas ao espaço de tabela do sistema usando `CREATE TABLE` ou `ALTER TABLE` `TABLESPACE=innodb_system` têm um `SPACE_TYPE` de `General`. Para mais informações, consulte `CREATE TABLESPACE`.

* `INSTANT_COLS`

  O número de colunas que existiam antes da primeira coluna instantânea ser adicionada usando `ALTER TABLE ... ADD COLUMN` com `ALGORITHM=INSTANT`. Essa coluna não é mais usada.

* `TOTAL_ROW_VERSIONS`

  O número de versões de linha para a tabela. O valor inicial é

  0. O valor é incrementado por operações `ALTER TABLE ... ALGORITHM=INSTANT` que adicionam ou removem colunas. Quando uma tabela com colunas adicionadas ou removidas instantaneamente é reconstruída devido a uma operação `ALTER TABLE` ou `OPTIMIZE TABLE` de reconstrução de tabela, o valor é reiniciado para 0. Para mais informações, consulte Operações de Colunas.

  O valor máximo de `TOTAL_ROW_VERSIONS` é 255.

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

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `COLUMNS` do `INFORMATION_SCHEMA` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.