## 24.8 Extensões para declarações SHOW

Algumas extensões das declarações `SHOW` (show\.html) acompanham a implementação do `INFORMATION_SCHEMA`:

- `SHOW` pode ser usado para obter informações sobre a estrutura da própria `INFORMATION_SCHEMA`.

- Várias instruções `SHOW` aceitam uma cláusula `WHERE` que oferece mais flexibilidade na especificação de quais linhas serão exibidas.

  A bandeira `IS_UPDATABLE` pode não ser confiável se uma visualização depender de uma ou mais outras visualizações e uma dessas visualizações subjacentes for atualizada. Independentemente do valor `IS_UPDATABLE`, o servidor mantém o controle da atualizabilidade de uma visualização e rejeita corretamente as operações de alteração de dados para visualizações que não são atualizáveis. Se o valor `IS_UPDATABLE` para uma visualização se tornar impreciso devido a alterações em visualizações subjacentes, o valor pode ser atualizado excluindo e recriando a visualização.

`INFORMATION_SCHEMA` é um banco de dados de informações, então seu nome está incluído na saída de `SHOW DATABASES`. Da mesma forma, `SHOW TABLES` (exibir tabelas) pode ser usado com `INFORMATION_SCHEMA` para obter uma lista de suas tabelas:

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

``SHOW COLUMNS` e ``DESCRIBE` podem exibir informações sobre as colunas em tabelas individuais do `INFORMATION_SCHEMA`.

As instruções `SHOW` que aceitam uma cláusula de comparação de strings `LIKE` para limitar as linhas exibidas também permitem uma cláusula `WHERE` que especifica condições mais gerais que as linhas selecionadas devem satisfazer:

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

A cláusula `WHERE`, se presente, é avaliada em relação aos nomes das colunas exibidos pela instrução `SHOW`. Por exemplo, a instrução `SHOW CHARACTER SET` produz essas colunas de saída:

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

Para usar uma cláusula `WHERE` com `SHOW CHARACTER SET`, você deve referenciar esses nomes de colunas. Como exemplo, a seguinte declaração exibe informações sobre os conjuntos de caracteres para os quais a collation padrão contém a string `'japanese'`:

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

Esta declaração exibe os conjuntos de caracteres multibyte:

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
