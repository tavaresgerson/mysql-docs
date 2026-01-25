### 3.6.9 Usando AUTO_INCREMENT

O atributo `AUTO_INCREMENT` pode ser usado para gerar uma identidade única para novas linhas (rows):

```sql
CREATE TABLE animals (
     id MEDIUMINT NOT NULL AUTO_INCREMENT,
     name CHAR(30) NOT NULL,
     PRIMARY KEY (id)
);

INSERT INTO animals (name) VALUES
    ('dog'),('cat'),('penguin'),
    ('lax'),('whale'),('ostrich');

SELECT * FROM animals;
```

O que retorna:

```sql
+----+---------+
| id | name    |
+----+---------+
|  1 | dog     |
|  2 | cat     |
|  3 | penguin |
|  4 | lax     |
|  5 | whale   |
|  6 | ostrich |
+----+---------+
```

Nenhum valor foi especificado para a coluna `AUTO_INCREMENT`, então o MySQL atribuiu números de sequência automaticamente. Você também pode atribuir 0 explicitamente à coluna para gerar números de sequência, a menos que o SQL mode [`NO_AUTO_VALUE_ON_ZERO`](sql-mode.html#sqlmode_no_auto_value_on_zero) esteja habilitado. Por exemplo:

```sql
INSERT INTO animals (id,name) VALUES(0,'groundhog');
```

Se a coluna for declarada como `NOT NULL`, também é possível atribuir `NULL` à coluna para gerar números de sequência. Por exemplo:

```sql
INSERT INTO animals (id,name) VALUES(NULL,'squirrel');
```

Quando você insere qualquer outro valor em uma coluna `AUTO_INCREMENT`, a coluna é definida com esse valor e a sequência é reiniciada de forma que o próximo valor gerado automaticamente siga sequencialmente o maior valor da coluna. Por exemplo:

```sql
INSERT INTO animals (id,name) VALUES(100,'rabbit');
INSERT INTO animals (id,name) VALUES(NULL,'mouse');
SELECT * FROM animals;
+-----+-----------+
| id  | name      |
+-----+-----------+
|   1 | dog       |
|   2 | cat       |
|   3 | penguin   |
|   4 | lax       |
|   5 | whale     |
|   6 | ostrich   |
|   7 | groundhog |
|   8 | squirrel  |
| 100 | rabbit    |
| 101 | mouse     |
+-----+-----------+
```

Atualizar um valor de coluna `AUTO_INCREMENT` existente em uma tabela `InnoDB` não reinicia a sequência `AUTO_INCREMENT`, como acontece com as tabelas `MyISAM` e `NDB`.

Você pode recuperar o valor `AUTO_INCREMENT` gerado automaticamente mais recente com a função SQL [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id) ou a função C API [`mysql_insert_id()`](/doc/c-api/5.7/en/mysql-insert-id.html). Essas funções são específicas da conexão (connection-specific), portanto, seus valores de retorno não são afetados por outra conexão que também esteja realizando INSERTs.

Use o menor tipo de dados integer para a coluna `AUTO_INCREMENT` que seja grande o suficiente para armazenar o valor máximo de sequência de que você precisa. Quando a coluna atinge o limite superior do tipo de dado, a próxima tentativa de gerar um número de sequência falha. Use o atributo `UNSIGNED`, se possível, para permitir um intervalo maior. Por exemplo, se você usar [`TINYINT`](integer-types.html "11.1.2 Tipos Integer (Valor Exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), o número de sequência máximo permitido é 127. Para [`TINYINT UNSIGNED`](integer-types.html "11.1.2 Tipos Integer (Valor Exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), o máximo é 255. Consulte [Seção 11.1.2, “Tipos Integer (Valor Exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT”](integer-types.html "11.1.2 Tipos Integer (Valor Exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") para ver os intervalos de todos os tipos integer.

Nota

Para um INSERT de múltiplas linhas, [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id) e [`mysql_insert_id()`](/doc/c-api/5.7/en/mysql-insert-id.html) retornam, na verdade, a chave `AUTO_INCREMENT` da *primeira* das linhas inseridas. Isso permite que INSERTs de múltiplas linhas sejam reproduzidos corretamente em outros servidores em uma configuração de replication.

Para começar com um valor `AUTO_INCREMENT` diferente de 1, defina esse valor usando [`CREATE TABLE`](create-table.html "13.1.18 Instrução CREATE TABLE") ou [`ALTER TABLE`](alter-table.html "13.1.8 Instrução ALTER TABLE"), desta forma:

```sql
mysql> ALTER TABLE tbl AUTO_INCREMENT = 100;
```

#### Notas do InnoDB

Para obter informações sobre o uso de `AUTO_INCREMENT` específico do `InnoDB`, consulte [Seção 14.6.1.6, “Tratamento de AUTO_INCREMENT no InnoDB”](innodb-auto-increment-handling.html "14.6.1.6 AUTO_INCREMENT Handling in InnoDB").

#### Notas do MyISAM

* Para tabelas `MyISAM`, você pode especificar `AUTO_INCREMENT` em uma coluna secundária em um Index de múltiplas colunas. Neste caso, o valor gerado para a coluna `AUTO_INCREMENT` é calculado como [`MAX(auto_increment_column)

  + 1 WHERE prefix=given-prefix`](aggregate-functions.html#function_max). Isso é útil quando você deseja agrupar dados em grupos ordenados.

  ```sql
  CREATE TABLE animals (
      grp ENUM('fish','mammal','bird') NOT NULL,
      id MEDIUMINT NOT NULL AUTO_INCREMENT,
      name CHAR(30) NOT NULL,
      PRIMARY KEY (grp,id)
  ) ENGINE=MyISAM;

  INSERT INTO animals (grp,name) VALUES
      ('mammal','dog'),('mammal','cat'),
      ('bird','penguin'),('fish','lax'),('mammal','whale'),
      ('bird','ostrich');

  SELECT * FROM animals ORDER BY grp,id;
  ```

  O que retorna:

  ```sql
  +--------+----+---------+
  | grp    | id | name    |
  +--------+----+---------+
  | fish   |  1 | lax     |
  | mammal |  1 | dog     |
  | mammal |  2 | cat     |
  | mammal |  3 | whale   |
  | bird   |  1 | penguin |
  | bird   |  2 | ostrich |
  +--------+----+---------+
  ```

  Neste caso (quando a coluna `AUTO_INCREMENT` faz parte de um Index de múltiplas colunas), os valores `AUTO_INCREMENT` são reutilizados se você excluir a row com o maior valor `AUTO_INCREMENT` em qualquer grupo. Isso acontece mesmo para tabelas `MyISAM`, para as quais os valores `AUTO_INCREMENT` normalmente não são reutilizados.

* Se a coluna `AUTO_INCREMENT` fizer parte de múltiplos Indexes, o MySQL gera valores de sequência usando o Index que começa com a coluna `AUTO_INCREMENT`, se houver. Por exemplo, se a tabela `animals` contivesse os Indexes `PRIMARY KEY (grp, id)` e `INDEX (id)`, o MySQL ignoraria a `PRIMARY KEY` para gerar valores de sequência. Como resultado, a tabela conteria uma única sequência, e não uma sequência por valor de `grp`.

#### Leitura Adicional

Mais informações sobre `AUTO_INCREMENT` estão disponíveis aqui:

* Como atribuir o atributo `AUTO_INCREMENT` a uma coluna: [Seção 13.1.18, “Instrução CREATE TABLE”](create-table.html "13.1.18 CREATE TABLE Statement"), e [Seção 13.1.8, “Instrução ALTER TABLE”](alter-table.html "13.1.8 ALTER TABLE Statement").

* Como o `AUTO_INCREMENT` se comporta dependendo do SQL mode [`NO_AUTO_VALUE_ON_ZERO`](sql-mode.html#sqlmode_no_auto_value_on_zero): [Seção 5.1.10, “SQL Modes do Servidor”](sql-mode.html "5.1.10 Server SQL Modes").

* Como usar a função [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id) para encontrar a row que contém o valor `AUTO_INCREMENT` mais recente: [Seção 12.15, “Funções de Informação”](information-functions.html "12.15 Information Functions").

* Definindo o valor `AUTO_INCREMENT` a ser usado: [Seção 5.1.7, “Variáveis de Sistema do Servidor”](server-system-variables.html "5.1.7 Server System Variables").

* [Seção 14.6.1.6, “Tratamento de AUTO_INCREMENT no InnoDB”](innodb-auto-increment-handling.html "14.6.1.6 AUTO_INCREMENT Handling in InnoDB")
* `AUTO_INCREMENT` e replication: [Seção 16.4.1.1, “Replication e AUTO_INCREMENT”](replication-features-auto-increment.html "16.4.1.1 Replication and AUTO_INCREMENT").

* Variáveis de sistema do servidor relacionadas a `AUTO_INCREMENT` ([`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) e [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset)) que podem ser usadas para replication: [Seção 5.1.7, “Variáveis de Sistema do Servidor”](server-system-variables.html "5.1.7 Server System Variables").