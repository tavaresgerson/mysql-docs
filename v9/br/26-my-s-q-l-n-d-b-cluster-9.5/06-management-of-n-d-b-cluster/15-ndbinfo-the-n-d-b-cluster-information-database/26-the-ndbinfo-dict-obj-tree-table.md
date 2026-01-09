#### 25.6.15.26 Tabela `dict_obj_tree` do ndbinfo dict_obj

A tabela `dict_obj_tree` fornece uma visualização baseada em árvore das informações da tabela a partir da tabela `dict_obj_info`. Isso é destinado principalmente para uso em testes, mas pode ser útil na visualização de hierarquias de objetos do banco de dados `NDB`.

A tabela `dict_obj_tree` contém as seguintes colunas:

* `type`

  Tipo do objeto `DICT`; faça uma junção com `dict_obj_types` para obter o nome do tipo de objeto

* `id`

  Identificador do objeto; o mesmo que a coluna `id` na tabela `dict_obj_info`

  Para arquivos de log de registro de dados de disco e arquivos de dados, este é o mesmo que o valor mostrado na coluna `LOGFILE_GROUP_NUMBER` da tabela `FILES` do Esquema de Informações; para arquivos de log de registro, também é o mesmo que o valor mostrado para a coluna `log_id` nas tabelas `logbuffers` e `logspaces` do ndbinfo

* `name`

  O nome totalmente qualificado do objeto; o mesmo que a coluna `fq_name` na tabela `dict_obj_info`

  Para uma tabela, isso é `database_name/def/table_name` (o mesmo que seu *`parent_name`*); para um índice de qualquer tipo, isso assume a forma `NDB$INDEX_index_id_CUSTOM`

* `parent_type`

  O tipo de objeto `DICT` do objeto pai deste objeto; faça uma junção com `dict_obj_types` para obter o nome do tipo de objeto

* `parent_id`

  Identificador do objeto pai deste objeto; o mesmo que a coluna `id` da tabela `dict_obj_info`

* `parent_name`

  Nome totalmente qualificado do objeto pai deste objeto; o mesmo que a coluna `fq_name` da tabela `dict_obj_info`

  Para uma tabela, isso tem a forma `database_name/def/table_name`. Para um índice, o nome é `sys/def/table_id/index_name`. Para uma chave primária, é `sys/def/table_id/PRIMARY`, e para uma chave única é `sys/def/table_id/uk_name$unique`

* `root_type`

O tipo de objeto *`DICT`* do objeto raiz; faça uma junção em `dict_obj_types` para obter o nome do tipo de objeto

* `root_id`

  Identificador do objeto raiz; o mesmo da coluna `id` da tabela `dict_obj_info`

* `root_name`

  Nome totalmente qualificado do objeto raiz; o mesmo da coluna `fq_name` da tabela `dict_obj_info`

* `level`

  Nível do objeto na hierarquia

* `path`

  Caminho completo para o objeto na hierarquia do objeto *`NDB`; os objetos são separados por uma seta para a direita (representada como `->`), começando com o objeto raiz à esquerda

* `indented_name`

  O `name` prefixado com uma seta para a direita (representada como `->`) com um número de espaços que o precedem, correspondendo à profundidade do objeto na hierarquia

A coluna `path` é útil para obter um caminho completo para um objeto de banco de dados *`NDB`* específico em uma única linha, enquanto a coluna `indented_name` pode ser usada para obter uma disposição em forma de árvore das informações completas da hierarquia para um objeto desejado.

*Exemplo*: Supondo a existência de um banco de dados `test` e nenhuma tabela existente chamada `t1` neste banco de dados, execute a seguinte instrução SQL:

```
CREATE TABLE test.t1 (
    a INT PRIMARY KEY,
    b INT,
    UNIQUE KEY(b)
)   ENGINE = NDB;
```

Você pode obter o caminho para a tabela recém-criada usando a consulta mostrada aqui:

```
mysql> SELECT path FROM ndbinfo.dict_obj_tree
    -> WHERE name LIKE 'test%t1';
+-------------+
| path        |
+-------------+
| test/def/t1 |
+-------------+
1 row in set (0.14 sec)
```

Você pode ver os caminhos para todos os objetos dependentes desta tabela usando o caminho para a tabela como nome do objeto raiz em uma consulta como esta:

```
mysql> SELECT path FROM ndbinfo.dict_obj_tree
    -> WHERE root_name = 'test/def/t1';
+----------------------------------------------------------+
| path                                                     |
+----------------------------------------------------------+
| test/def/t1                                              |
| test/def/t1 -> sys/def/13/b                              |
| test/def/t1 -> sys/def/13/b -> NDB$INDEX_15_CUSTOM       |
| test/def/t1 -> sys/def/13/b$unique                       |
| test/def/t1 -> sys/def/13/b$unique -> NDB$INDEX_16_UI    |
| test/def/t1 -> sys/def/13/PRIMARY                        |
| test/def/t1 -> sys/def/13/PRIMARY -> NDB$INDEX_14_CUSTOM |
+----------------------------------------------------------+
7 rows in set (0.16 sec)
```

Para obter uma visualização hierárquica da tabela `t1` com todos os seus objetos dependentes, execute uma consulta semelhante à seguinte, que seleciona o nome indeltado de cada objeto com `test/def/t1` como o nome do seu objeto raiz:

```
mysql> SELECT indented_name FROM ndbinfo.dict_obj_tree
    -> WHERE root_name = 'test/def/t1';
+----------------------------+
| indented_name              |
+----------------------------+
| test/def/t1                |
|   -> sys/def/13/b          |
|     -> NDB$INDEX_15_CUSTOM |
|   -> sys/def/13/b$unique   |
|     -> NDB$INDEX_16_UI     |
|   -> sys/def/13/PRIMARY    |
|     -> NDB$INDEX_14_CUSTOM |
+----------------------------+
7 rows in set (0.15 sec)
```

Ao trabalhar com tabelas de Dados de Disco, observe que, neste contexto, um espaço de tabelas ou grupo de arquivos de log é considerado um objeto raiz. Isso significa que você deve conhecer o nome de qualquer espaço de tabelas ou grupo de arquivos de log associado a uma determinada tabela, ou obter essa informação a partir de `SHOW CREATE TABLE` e, em seguida, consultar `INFORMATION_SCHEMA.FILES`, ou meios semelhantes, como mostrado aqui:

```
mysql> SHOW CREATE TABLE test.dt_1\G
*************************** 1. row ***************************
       Table: dt_1
Create Table: CREATE TABLE `dt_1` (
  `member_id` int unsigned NOT NULL AUTO_INCREMENT,
  `last_name` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `dob` date NOT NULL,
  `joined` date NOT NULL,
  PRIMARY KEY (`member_id`),
  KEY `last_name` (`last_name`,`first_name`)
) /*!50100 TABLESPACE `ts_1` STORAGE DISK */ ENGINE=ndbcluster DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)

mysql> SELECT DISTINCT TABLESPACE_NAME, LOGFILE_GROUP_NAME
    -> FROM INFORMATION_SCHEMA.FILES WHERE TABLESPACE_NAME='ts_1';
+-----------------+--------------------+
| TABLESPACE_NAME | LOGFILE_GROUP_NAME |
+-----------------+--------------------+
| ts_1            | lg_1               |
+-----------------+--------------------+
1 row in set (0.00 sec)
```

Agora você pode obter informações hierárquicas para a tabela, o espaço de tabelas e o grupo de arquivos de log da seguinte forma:

```
mysql> SELECT indented_name FROM ndbinfo.dict_obj_tree
    -> WHERE root_name = 'test/def/dt_1';
+----------------------------+
| indented_name              |
+----------------------------+
| test/def/dt_1              |
|   -> sys/def/23/last_name  |
|     -> NDB$INDEX_25_CUSTOM |
|   -> sys/def/23/PRIMARY    |
|     -> NDB$INDEX_24_CUSTOM |
+----------------------------+
5 rows in set (0.15 sec)

mysql> SELECT indented_name FROM ndbinfo.dict_obj_tree
    -> WHERE root_name = 'ts_1';
+-----------------+
| indented_name   |
+-----------------+
| ts_1            |
|   -> data_1.dat |
|   -> data_2.dat |
+-----------------+
3 rows in set (0.17 sec)

mysql> SELECT indented_name FROM ndbinfo.dict_obj_tree
    -> WHERE root_name LIKE 'lg_1';
+-----------------+
| indented_name   |
+-----------------+
| lg_1            |
|   -> undo_1.log |
|   -> undo_2.log |
+-----------------+
3 rows in set (0.16 sec)
```