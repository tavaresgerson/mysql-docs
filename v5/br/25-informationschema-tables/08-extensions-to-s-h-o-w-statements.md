## 24.8 Extensões às Instruções SHOW

Algumas extensões às instruções [`SHOW`](show.html "13.7.5 SHOW Statements") acompanham a implementação do `INFORMATION_SCHEMA`:

* O [`SHOW`](show.html "13.7.5 SHOW Statements") pode ser usado para obter informações sobre a estrutura do próprio `INFORMATION_SCHEMA`.

* Várias instruções [`SHOW`](show.html "13.7.5 SHOW Statements") aceitam uma cláusula `WHERE` que oferece maior flexibilidade na especificação de quais linhas exibir.

O flag `IS_UPDATABLE` pode não ser confiável se uma view depender de uma ou mais views subjacentes, e uma dessas views for atualizada. Independentemente do valor de `IS_UPDATABLE`, o servidor rastreia a capacidade de atualização de uma view e rejeita corretamente as operações de alteração de dados em views que não são atualizáveis. Se o valor de `IS_UPDATABLE` para uma view se tornou impreciso devido a alterações nas views subjacentes, o valor pode ser atualizado excluindo e recriando a view.

O `INFORMATION_SCHEMA` é um Database de informações, portanto, seu nome está incluído na saída de [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement"). Da mesma forma, [`SHOW TABLES`](show-tables.html "13.7.5.37 SHOW TABLES Statement") pode ser usado com `INFORMATION_SCHEMA` para obter uma lista de suas tables:

```sql
mysql> SHOW TABLES FROM INFORMATION_SCHEMA;
+---------------------------------------+
| Tables_in_INFORMATION_SCHEMA          |
+---------------------------------------+
| CHARACTER_SETS                        |
| COLLATIONS                            |
| COLLATION_CHARACTER_SET_APPLICABILITY |
| COLUMNS                               |
| COLUMN_PRIVILEGES                     |
| ENGINES                               |
| EVENTS                                |
| FILES                                 |
| GLOBAL_STATUS                         |
| GLOBAL_VARIABLES                      |
| KEY_COLUMN_USAGE                      |
| PARTITIONS                            |
| PLUGINS                               |
| PROCESSLIST                           |
| REFERENTIAL_CONSTRAINTS               |
| ROUTINES                              |
| SCHEMATA                              |
| SCHEMA_PRIVILEGES                     |
| SESSION_STATUS                        |
| SESSION_VARIABLES                     |
| STATISTICS                            |
| TABLES                                |
| TABLE_CONSTRAINTS                     |
| TABLE_PRIVILEGES                      |
| TRIGGERS                              |
| USER_PRIVILEGES                       |
| VIEWS                                 |
+---------------------------------------+
```

[`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") e [`DESCRIBE`](describe.html "13.8.1 DESCRIBE Statement") podem exibir informações sobre as columns em tables individuais do `INFORMATION_SCHEMA`.

As instruções [`SHOW`](show.html "13.7.5 SHOW Statements") que aceitam uma cláusula [`LIKE`](string-comparison-functions.html#operator_like) para limitar as linhas exibidas também permitem uma cláusula `WHERE` que especifica condições mais gerais que as linhas selecionadas devem satisfazer:

```sql
SHOW CHARACTER SET
SHOW COLLATION
SHOW COLUMNS
SHOW DATABASES
SHOW FUNCTION STATUS
SHOW INDEX
SHOW OPEN TABLES
SHOW PROCEDURE STATUS
SHOW STATUS
SHOW TABLE STATUS
SHOW TABLES
SHOW TRIGGERS
SHOW VARIABLES
```

A cláusula `WHERE`, se presente, é avaliada em relação aos nomes das columns exibidas pela instrução [`SHOW`](show.html "13.7.5 SHOW Statements"). Por exemplo, a instrução [`SHOW CHARACTER SET`](show-character-set.html "13.7.5.3 SHOW CHARACTER SET Statement") produz estas columns de saída:

```sql
mysql> SHOW CHARACTER SET;
+----------+-----------------------------+---------------------+--------+
| Charset  | Description                 | Default collation   | Maxlen |
+----------+-----------------------------+---------------------+--------+
| big5     | Big5 Traditional Chinese    | big5_chinese_ci     |      2 |
| dec8     | DEC West European           | dec8_swedish_ci     |      1 |
| cp850    | DOS West European           | cp850_general_ci    |      1 |
| hp8      | HP West European            | hp8_english_ci      |      1 |
| koi8r    | KOI8-R Relcom Russian       | koi8r_general_ci    |      1 |
| latin1   | cp1252 West European        | latin1_swedish_ci   |      1 |
| latin2   | ISO 8859-2 Central European | latin2_general_ci   |      1 |
...
```

Para usar uma cláusula `WHERE` com [`SHOW CHARACTER SET`](show-character-set.html "13.7.5.3 SHOW CHARACTER SET Statement"), você deve se referir a esses nomes de column. Como exemplo, a instrução a seguir exibe informações sobre os character sets para os quais o default collation contém a string `'japanese'`:

```sql
mysql> SHOW CHARACTER SET WHERE `Default collation` LIKE '%japanese%';
+---------+---------------------------+---------------------+--------+
| Charset | Description               | Default collation   | Maxlen |
+---------+---------------------------+---------------------+--------+
| ujis    | EUC-JP Japanese           | ujis_japanese_ci    |      3 |
| sjis    | Shift-JIS Japanese        | sjis_japanese_ci    |      2 |
| cp932   | SJIS for Windows Japanese | cp932_japanese_ci   |      2 |
| eucjpms | UJIS for Windows Japanese | eucjpms_japanese_ci |      3 |
+---------+---------------------------+---------------------+--------+
```

Esta instrução exibe os character sets multibyte:

```sql
mysql> SHOW CHARACTER SET WHERE Maxlen > 1;
+---------+---------------------------+---------------------+--------+
| Charset | Description               | Default collation   | Maxlen |
+---------+---------------------------+---------------------+--------+
| big5    | Big5 Traditional Chinese  | big5_chinese_ci     |      2 |
| ujis    | EUC-JP Japanese           | ujis_japanese_ci    |      3 |
| sjis    | Shift-JIS Japanese        | sjis_japanese_ci    |      2 |
| euckr   | EUC-KR Korean             | euckr_korean_ci     |      2 |
| gb2312  | GB2312 Simplified Chinese | gb2312_chinese_ci   |      2 |
| gbk     | GBK Simplified Chinese    | gbk_chinese_ci      |      2 |
| utf8    | UTF-8 Unicode             | utf8_general_ci     |      3 |
| ucs2    | UCS-2 Unicode             | ucs2_general_ci     |      2 |
| cp932   | SJIS for Windows Japanese | cp932_japanese_ci   |      2 |
| eucjpms | UJIS for Windows Japanese | eucjpms_japanese_ci |      3 |
+---------+---------------------------+---------------------+--------+
```