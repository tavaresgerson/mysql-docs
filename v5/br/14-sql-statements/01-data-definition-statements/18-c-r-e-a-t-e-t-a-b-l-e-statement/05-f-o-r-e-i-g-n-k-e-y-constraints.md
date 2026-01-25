#### 13.1.18.5 FOREIGN KEY Constraints

O MySQL suporta FOREIGN KEYs, que permitem a referência cruzada de dados relacionados entre tabelas, e FOREIGN KEY constraints (restrições de chave estrangeira), que ajudam a manter a consistência dos dados relacionados.

Um relacionamento de FOREIGN KEY envolve uma parent table que contém os valores iniciais da coluna, e uma child table com valores de coluna que referenciam os valores da coluna pai. Uma FOREIGN KEY constraint é definida na child table.

A sintaxe essencial para a definição de uma FOREIGN KEY constraint em uma instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") ou [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") inclui o seguinte:

```sql
[CONSTRAINT [symbol FOREIGN KEY
    [index_name] (col_name, ...)
    REFERENCES tbl_name (col_name,...)
    [ON DELETE reference_option]
    [ON UPDATE reference_option]

reference_option:
    RESTRICT | CASCADE | SET NULL | NO ACTION | SET DEFAULT
```

O uso de FOREIGN KEY constraints é descrito nos seguintes tópicos nesta seção:

* [Identificadores](create-table-foreign-keys.html#foreign-key-identifiers "Identifiers")
* [Condições e Restrições](create-table-foreign-keys.html#foreign-key-restrictions "Conditions and Restrictions")
* [Ações Referenciais](create-table-foreign-keys.html#foreign-key-referential-actions "Referential Actions")
* [Exemplos de FOREIGN KEY Constraint](create-table-foreign-keys.html#foreign-key-examples "Foreign Key Constraint Examples")
* [Adicionando FOREIGN KEY Constraints](create-table-foreign-keys.html#foreign-key-adding "Adding Foreign Key Constraints")
* [Removendo FOREIGN KEY Constraints](create-table-foreign-keys.html#foreign-key-dropping "Dropping Foreign Key Constraints")
* [Verificações de FOREIGN KEY](create-table-foreign-keys.html#foreign-key-checks "Foreign Key Checks")
* [Definições e Metadados de FOREIGN KEY](create-table-foreign-keys.html#foreign-key-metadata "Foreign Key Definitions and Metadata")
* [Erros de FOREIGN KEY](create-table-foreign-keys.html#foreign-key-errors "Foreign Key Errors")

##### Identificadores

A nomenclatura de FOREIGN KEY constraints é regida pelas seguintes regras:

* O valor `CONSTRAINT` *`symbol`* é usado, se definido.

* Se a cláusula `CONSTRAINT` *`symbol`* não for definida, ou um símbolo não for incluído após a palavra-chave `CONSTRAINT`:

  + Para tabelas `InnoDB`, um nome de constraint é gerado automaticamente.

  + Para tabelas `NDB`, o valor `FOREIGN KEY` *`index_name`* é usado, se definido. Caso contrário, um nome de constraint é gerado automaticamente.

* O valor `CONSTRAINT symbol`, se definido, deve ser único no Database. Um *`symbol`* duplicado resulta em um erro semelhante a: ERROR 1005 (HY000): Can't create table 'test.fk1' (errno: 121).

Identificadores de tabela e coluna em uma cláusula `FOREIGN KEY ... REFERENCES` podem ser citados entre backticks (`` ` ``). Alternativamente, aspas duplas (``"``) podem ser usadas se o SQL mode [`ANSI_QUOTES`](sql-mode.html#sqlmode_ansi_quotes) estiver habilitado. A configuração da variável de sistema [`lower_case_table_names`](server-system-variables.html#sysvar_lower_case_table_names) também é levada em consideração.

##### Condições e Restrições

FOREIGN KEY constraints estão sujeitas às seguintes condições e restrições:

* A parent table e a child table devem usar o mesmo storage engine, e não podem ser definidas como temporary tables.

* A criação de uma FOREIGN KEY constraint exige o privilégio [`REFERENCES`](privileges-provided.html#priv_references) na parent table.

* As colunas correspondentes na FOREIGN KEY e na chave referenciada devem ter tipos de dados semelhantes. *O tamanho e o sinal de tipos de precisão fixa, como [`INTEGER`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") e [`DECIMAL`](fixed-point-types.html "11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC"), devem ser os mesmos*. O comprimento dos tipos de string não precisa ser o mesmo. Para colunas de string não binárias (caractere), o character set e a collation devem ser os mesmos.

* O MySQL suporta referências de FOREIGN KEY entre uma coluna e outra dentro de uma tabela. (Uma coluna não pode ter uma referência de FOREIGN KEY para si mesma.) Nesses casos, um “registro da child table” refere-se a um registro dependente dentro da mesma tabela.

* O MySQL exige Indexes em FOREIGN KEYs e chaves referenciadas para que as verificações de FOREIGN KEY possam ser rápidas e não exijam uma table scan. Na tabela de referência, deve haver um Index onde as colunas da FOREIGN KEY estejam listadas como as *primeiras* colunas, na mesma ordem. Esse Index é criado na tabela de referência automaticamente, se não existir. Este Index pode ser descartado silenciosamente mais tarde se você criar outro Index que possa ser usado para aplicar a FOREIGN KEY constraint. *`index_name`*, se fornecido, é usado conforme descrito anteriormente.

* O `InnoDB` permite que uma FOREIGN KEY referencie qualquer coluna de Index ou grupo de colunas. No entanto, na tabela referenciada, deve haver um Index onde as colunas referenciadas sejam as *primeiras* colunas, na mesma ordem. Colunas ocultas que o `InnoDB` adiciona a um Index também são consideradas (veja [Seção 14.6.2.1, “Clustered and Secondary Indexes”](innodb-index-types.html "14.6.2.1 Clustered and Secondary Indexes")).

  O `NDB` exige uma UNIQUE KEY explícita (ou Primary Key) em qualquer coluna referenciada como uma FOREIGN KEY. O `InnoDB` não exige, o que é uma extensão do SQL padrão.

* Prefixos de Index em colunas de FOREIGN KEY não são suportados. Consequentemente, as colunas [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") e [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") não podem ser incluídas em uma FOREIGN KEY porque os Indexes nessas colunas devem sempre incluir um prefix length.

* O [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") atualmente não suporta FOREIGN KEYs para tabelas com particionamento definido pelo usuário. Isso inclui tanto a parent table quanto a child table.

  Esta restrição não se aplica a tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") que são particionadas por `KEY` ou `LINEAR KEY` (os únicos tipos de particionamento de usuário suportados pelo storage engine `NDB`); estas podem ter referências de FOREIGN KEY ou ser alvos de tais referências.

* Uma tabela em um relacionamento de FOREIGN KEY não pode ser alterada para usar outro storage engine. Para mudar o storage engine, você deve primeiro remover quaisquer FOREIGN KEY constraints.

* Uma FOREIGN KEY constraint não pode referenciar uma virtual generated column.

* Antes da versão 5.7.16, uma FOREIGN KEY constraint não pode referenciar um secondary index definido em uma virtual generated column.

Para obter informações sobre como a implementação do MySQL de FOREIGN KEY constraints difere do padrão SQL, veja [Seção 1.6.2.3, “FOREIGN KEY Constraint Differences”](ansi-diff-foreign-keys.html "1.6.2.3 FOREIGN KEY Constraint Differences").

##### Ações Referenciais

Quando uma operação [UPDATE](update.html "13.2.11 UPDATE Statement") ou [DELETE](delete.html "13.2.2 DELETE Statement") afeta um valor de chave na parent table que possui linhas correspondentes na child table, o resultado depende da *referential action* (ação referencial) especificada pelas subcláusulas `ON UPDATE` e `ON DELETE` da cláusula `FOREIGN KEY`. As ações referenciais incluem:

* `CASCADE`: Exclui ou atualiza a linha da parent table e automaticamente exclui ou atualiza as linhas correspondentes na child table. Tanto `ON DELETE CASCADE` quanto `ON UPDATE CASCADE` são suportados. Entre duas tabelas, não defina várias cláusulas `ON UPDATE CASCADE` que atuem na mesma coluna na parent table ou na child table.

  Se uma cláusula `FOREIGN KEY` for definida em ambas as tabelas em um relacionamento de FOREIGN KEY, tornando ambas as tabelas parent table e child table, uma subcláusula `ON UPDATE CASCADE` ou `ON DELETE CASCADE` definida para uma cláusula `FOREIGN KEY` deve ser definida para a outra para que as operações em cascata sejam bem-sucedidas. Se uma subcláusula `ON UPDATE CASCADE` ou `ON DELETE CASCADE` for definida apenas para uma cláusula `FOREIGN KEY`, as operações em cascata falharão com um erro.

  Nota

  Ações de FOREIGN KEY em cascata não ativam Triggers.

* `SET NULL`: Exclui ou atualiza a linha da parent table e define a coluna ou colunas da FOREIGN KEY na child table como `NULL`. Ambas as cláusulas `ON DELETE SET NULL` e `ON UPDATE SET NULL` são suportadas.

  Se você especificar uma ação `SET NULL`, *certifique-se de que você não declarou as colunas na child table como `NOT NULL`*.

* `RESTRICT`: Rejeita a operação de delete ou update para a parent table. Especificar `RESTRICT` (ou `NO ACTION`) é o mesmo que omitir a cláusula `ON DELETE` ou `ON UPDATE`.

* `NO ACTION`: Uma palavra-chave do SQL padrão. Para o [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), isso é equivalente a `RESTRICT`; a operação de delete ou update para a parent table é rejeitada imediatamente se houver um valor de FOREIGN KEY relacionado na tabela referenciada. O [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") suporta verificações adiadas, e `NO ACTION` especifica uma verificação adiada; quando isso é usado, as verificações de constraint não são realizadas até o momento do COMMIT. Observe que, para tabelas `NDB`, isso faz com que todas as verificações de FOREIGN KEY feitas para a parent table e a child table sejam adiadas.

* `SET DEFAULT`: Esta ação é reconhecida pelo parser do MySQL, mas tanto o [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") quanto o [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") rejeitam definições de tabela contendo cláusulas `ON DELETE SET DEFAULT` ou `ON UPDATE SET DEFAULT`.

Para storage engines que suportam FOREIGN KEYs, o MySQL rejeita qualquer operação [INSERT](insert.html "13.2.5 INSERT Statement") ou [UPDATE](update.html "13.2.11 UPDATE Statement") que tente criar um valor de FOREIGN KEY em uma child table se não houver um valor de chave candidata correspondente na parent table.

Para um `ON DELETE` ou `ON UPDATE` que não for especificado, a ação padrão é sempre `RESTRICT`.

Para tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), `ON UPDATE CASCADE` não é suportado onde a referência é para a Primary Key da parent table.

A partir do NDB 7.5.14 e NDB 7.6.10: Para tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), `ON DELETE CASCADE` não é suportado onde a child table contém uma ou mais colunas de qualquer um dos tipos [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") ou [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types"). (Bug #89511, Bug #27484882)

O `InnoDB` executa operações em cascata usando um algoritmo de busca em profundidade (depth-first search) nos registros do Index que corresponde à FOREIGN KEY constraint.

Uma FOREIGN KEY constraint em uma stored generated column não pode usar `CASCADE`, `SET NULL`, ou `SET DEFAULT` como ações referenciais `ON UPDATE`, nem pode usar `SET NULL` ou `SET DEFAULT` como ações referenciais `ON DELETE`.

Uma FOREIGN KEY constraint na base column de uma stored generated column não pode usar `CASCADE`, `SET NULL`, ou `SET DEFAULT` como ações referenciais `ON UPDATE` ou `ON DELETE`.

No MySQL 5.7.13 e anterior, o `InnoDB` não permite definir uma FOREIGN KEY constraint com uma ação referencial em cascata na [base column](glossary.html#glos_base_column "base column") de uma virtual generated column indexada. Esta restrição é removida no MySQL 5.7.14.

No MySQL 5.7.13 e anterior, o `InnoDB` não permite definir ações referenciais em cascata em colunas de FOREIGN KEY não virtuais que estão explicitamente incluídas em um [virtual index](glossary.html#glos_virtual_index "virtual index"). Esta restrição é removida no MySQL 5.7.14.

##### Exemplos de FOREIGN KEY Constraint

Este exemplo simples relaciona as tabelas `parent` e `child` através de uma FOREIGN KEY de coluna única:

```sql
CREATE TABLE parent (
    id INT NOT NULL,
    PRIMARY KEY (id)
) ENGINE=INNODB;

CREATE TABLE child (
    id INT,
    parent_id INT,
    INDEX par_ind (parent_id),
    FOREIGN KEY (parent_id)
        REFERENCES parent(id)
        ON DELETE CASCADE
) ENGINE=INNODB;
```

Este é um exemplo mais complexo no qual uma tabela `product_order` tem FOREIGN KEYs para duas outras tabelas. Uma FOREIGN KEY referencia um Index de duas colunas na tabela `product`. A outra referencia um Index de coluna única na tabela `customer`:

```sql
CREATE TABLE product (
    category INT NOT NULL, id INT NOT NULL,
    price DECIMAL,
    PRIMARY KEY(category, id)
)   ENGINE=INNODB;

CREATE TABLE customer (
    id INT NOT NULL,
    PRIMARY KEY (id)
)   ENGINE=INNODB;

CREATE TABLE product_order (
    no INT NOT NULL AUTO_INCREMENT,
    product_category INT NOT NULL,
    product_id INT NOT NULL,
    customer_id INT NOT NULL,

    PRIMARY KEY(no),
    INDEX (product_category, product_id),
    INDEX (customer_id),

    FOREIGN KEY (product_category, product_id)
      REFERENCES product(category, id)
      ON UPDATE CASCADE ON DELETE RESTRICT,

    FOREIGN KEY (customer_id)
      REFERENCES customer(id)
)   ENGINE=INNODB;
```

##### Adicionando FOREIGN KEY Constraints

Você pode adicionar uma FOREIGN KEY constraint a uma tabela existente usando a seguinte sintaxe [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"):

```sql
ALTER TABLE tbl_name
    ADD [CONSTRAINT [symbol FOREIGN KEY
    [index_name] (col_name, ...)
    REFERENCES tbl_name (col_name,...)
    [ON DELETE reference_option]
    [ON UPDATE reference_option]
```

A FOREIGN KEY pode ser autorreferencial (referenciando a mesma tabela). Ao adicionar uma FOREIGN KEY constraint a uma tabela usando [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), *lembre-se de primeiro criar um Index nas coluna(s) referenciada(s) pela FOREIGN KEY.*

##### Removendo FOREIGN KEY Constraints

Você pode remover uma FOREIGN KEY constraint usando a seguinte sintaxe [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"):

```sql
ALTER TABLE tbl_name DROP FOREIGN KEY fk_symbol;
```

Se a cláusula `FOREIGN KEY` definiu um nome `CONSTRAINT` quando você criou a constraint, você pode se referir a esse nome para remover a FOREIGN KEY constraint. Caso contrário, um nome de constraint foi gerado internamente e você deve usar esse valor. Para determinar o nome da FOREIGN KEY constraint, use [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement"):

```sql
mysql> SHOW CREATE TABLE child\G
*************************** 1. row ***************************
       Table: child
Create Table: CREATE TABLE `child` (
  `id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  KEY `par_ind` (`parent_id`),
  CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`)
  REFERENCES `parent` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1

mysql> ALTER TABLE child DROP FOREIGN KEY `child_ibfk_1`;
```

Adicionar e remover uma FOREIGN KEY na mesma instrução [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") é suportado para [`ALTER TABLE ... ALGORITHM=INPLACE`](alter-table.html "13.1.8 ALTER TABLE Statement"). Não é suportado para [`ALTER TABLE ... ALGORITHM=COPY`](alter-table.html "13.1.8 ALTER TABLE Statement").

##### Verificações de FOREIGN KEY

No MySQL, tabelas InnoDB e NDB suportam a verificação de FOREIGN KEY constraints. A verificação de FOREIGN KEY é controlada pela variável [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks), que está habilitada por padrão. Tipicamente, você mantém essa variável habilitada durante a operação normal para aplicar a integridade referencial. A variável [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks) tem o mesmo efeito nas tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") que tem nas tabelas [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine").

A variável [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks) é dinâmica e suporta escopos GLOBAL e SESSION. Para obter informações sobre o uso de system variables, veja [Seção 5.1.8, “Using System Variables”](using-system-variables.html "5.1.8 Using System Variables").

Desabilitar a verificação de FOREIGN KEY é útil quando:

* Removendo uma tabela que é referenciada por uma FOREIGN KEY constraint. Uma tabela referenciada só pode ser removida depois que [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks) for desabilitada. Ao remover uma tabela, as constraints definidas na tabela também são removidas.

* Recarregando tabelas em ordem diferente da exigida por seus relacionamentos de FOREIGN KEY. Por exemplo, [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") produz definições corretas de tabelas no dump file, incluindo FOREIGN KEY constraints para child tables. Para facilitar o recarregamento de dump files para tabelas com relacionamentos de FOREIGN KEY, [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") inclui automaticamente uma instrução no output do dump que desabilita [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks). Isso permite que você importe as tabelas em qualquer ordem caso o dump file contenha tabelas que não estejam corretamente ordenadas para FOREIGN KEYs. Desabilitar [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks) também acelera a operação de importação, evitando verificações de FOREIGN KEY.

* Executando operações [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"), para evitar a verificação de FOREIGN KEY.

* Executando uma operação [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") em uma tabela que possui um relacionamento de FOREIGN KEY.

Quando [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks) está desabilitada, as FOREIGN KEY constraints são ignoradas, com as seguintes exceções:

* Recriar uma tabela que foi previamente removida retorna um erro se a definição da tabela não estiver em conformidade com as FOREIGN KEY constraints que referenciam a tabela. A tabela deve ter os nomes e tipos de coluna corretos. Ela também deve ter Indexes nas chaves referenciadas. Se esses requisitos não forem satisfeitos, o MySQL retorna o Error 1005 que se refere a errno: 150 na mensagem de erro, o que significa que uma FOREIGN KEY constraint não foi formada corretamente.

* Alterar uma tabela retorna um erro (errno: 150) se uma definição de FOREIGN KEY estiver incorretamente formada para a tabela alterada.

* Remover um Index exigido por uma FOREIGN KEY constraint. A FOREIGN KEY constraint deve ser removida antes de remover o Index.

* Criar uma FOREIGN KEY constraint onde uma coluna referencia um tipo de coluna não correspondente.

Desabilitar [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks) tem estas implicações adicionais:

* É permitido remover um Database que contenha tabelas com FOREIGN KEYs que são referenciadas por tabelas fora do Database.

* É permitido remover uma tabela com FOREIGN KEYs referenciadas por outras tabelas.

* Habilitar [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks) não aciona uma table scan, o que significa que as linhas adicionadas a uma tabela enquanto [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks) está desabilitada não são verificadas quanto à consistência quando [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks) é reabilitada.

##### Definições e Metadados de FOREIGN KEY

Para visualizar uma definição de FOREIGN KEY, use [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement"):

```sql
mysql> SHOW CREATE TABLE child\G
*************************** 1. row ***************************
       Table: child
Create Table: CREATE TABLE `child` (
  `id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  KEY `par_ind` (`parent_id`),
  CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`)
  REFERENCES `parent` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1
```

Você pode obter informações sobre FOREIGN KEYs na tabela Information Schema [`KEY_COLUMN_USAGE`](information-schema-key-column-usage-table.html "24.3.12 The INFORMATION_SCHEMA KEY_COLUMN_USAGE Table"). Um exemplo de Query contra esta tabela é mostrado aqui:

```sql
mysql> SELECT TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME
       FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
       WHERE REFERENCED_TABLE_SCHEMA IS NOT NULL;
+--------------+------------+-------------+-----------------+
| TABLE_SCHEMA | TABLE_NAME | COLUMN_NAME | CONSTRAINT_NAME |
+--------------+------------+-------------+-----------------+
| test         | child      | parent_id   | child_ibfk_1    |
+--------------+------------+-------------+-----------------+
```

Você pode obter informações específicas das FOREIGN KEYs do `InnoDB` nas tabelas [`INNODB_SYS_FOREIGN`](information-schema-innodb-sys-foreign-table.html "24.4.20 The INFORMATION_SCHEMA INNODB_SYS_FOREIGN Table") e [`INNODB_SYS_FOREIGN_COLS`](information-schema-innodb-sys-foreign-cols-table.html "24.4.21 The INFORMATION_SCHEMA INNODB_SYS_FOREIGN_COLS Table"). Exemplos de Queries são mostrados aqui:

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN \G
*************************** 1. row ***************************
      ID: test/child_ibfk_1
FOR_NAME: test/child
REF_NAME: test/parent
  N_COLS: 1
    TYPE: 1

mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN_COLS \G
*************************** 1. row ***************************
          ID: test/child_ibfk_1
FOR_COL_NAME: parent_id
REF_COL_NAME: id
         POS: 0
```

##### Erros de FOREIGN KEY

No caso de um erro de FOREIGN KEY envolvendo tabelas `InnoDB` (geralmente Error 150 no MySQL Server), informações sobre o erro de FOREIGN KEY mais recente podem ser obtidas verificando o output de [`SHOW ENGINE INNODB STATUS`](show-engine.html "13.7.5.15 SHOW ENGINE Statement").

```sql
mysql> SHOW ENGINE INNODB STATUS\G
...
------------------------
LATEST FOREIGN KEY ERROR
------------------------
2014-10-16 18:35:18 0x7fc2a95c1700 Transaction:
TRANSACTION 1814, ACTIVE 0 sec inserting
mysql tables in use 1, locked 1
4 lock struct(s), heap size 1136, 3 row lock(s), undo log entries 3
MySQL thread id 2, OS thread handle 140474041767680, query id 74 localhost
root update
INSERT INTO child VALUES
    (NULL, 1)
    , (NULL, 2)
    , (NULL, 3)
    , (NULL, 4)
    , (NULL, 5)
    , (NULL, 6)
Foreign key constraint fails for table `mysql`.`child`:
,
  CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `parent`
  (`id`) ON DELETE CASCADE ON UPDATE CASCADE
Trying to add in child table, in index par_ind tuple:
DATA TUPLE: 2 fields;
 0: len 4; hex 80000003; asc     ;;
 1: len 4; hex 80000003; asc     ;;

But in parent table `mysql`.`parent`, in index PRIMARY,
the closest match we can find is record:
PHYSICAL RECORD: n_fields 3; compact format; info bits 0
 0: len 4; hex 80000004; asc     ;;
 1: len 6; hex 00000000070a; asc       ;;
 2: len 7; hex aa0000011d0134; asc       4;;
...
```

Aviso

As mensagens de erro [`ER_NO_REFERENCED_ROW_2`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_no_referenced_row_2) e [`ER_ROW_IS_REFERENCED_2`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_row_is_referenced_2) para operações de FOREIGN KEY expõem informações sobre parent tables, mesmo que o usuário não tenha privilégios de acesso à parent table. Para ocultar informações sobre parent tables, inclua os manipuladores de condição apropriados no código da aplicação e nos stored programs.