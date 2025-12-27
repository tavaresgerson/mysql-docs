### 12.9.2 O Conjunto de Caracteres utf8mb3 (Codificação Unicode UTF-8 de 3 Bytes)

O conjunto de caracteres `utf8mb3` tem essas características:

* Suporta apenas caracteres BMP (sem suporte para caracteres suplementares)

* Requer no máximo três bytes por caractere multibyte.

Aplicações que usam dados UTF-8, mas exigem suporte para caracteres suplementares, devem usar `utf8mb4` em vez de `utf8mb3` (consulte a Seção 12.9.1, “O Conjunto de Caracteres utf8mb4 (Codificação Unicode UTF-8 de 4 Bytes”)”).

Exatamente o mesmo conjunto de caracteres está disponível em `utf8mb3` e `ucs2`. Ou seja, eles têm o mesmo repertório.

Nota

O conjunto de caracteres recomendado para o MySQL é `utf8mb4`. Todas as novas aplicações devem usar `utf8mb4`.

O conjunto de caracteres `utf8mb3` está desatualizado. `utf8mb3` continua sendo suportado pelo tempo de vida das séries de lançamentos MySQL 8.0.x e MySQL 8.4.x LTS.

Espere que `utf8mb3` seja removido em um futuro lançamento principal do MySQL.

Como alterar conjuntos de caracteres pode ser uma tarefa complexa e demorada, você deve começar a se preparar para essa mudança agora, usando `utf8mb4` para novas aplicações. Para obter orientações sobre a conversão de aplicações existentes que usam utfmb3, consulte a Seção 12.9.8, “Conversão entre Conjuntos de Caracteres Unicode de 3 Bytes e 4 Bytes”.

`utf8mb3` pode ser usado em cláusulas de `CHARACTER SET` e `utf8mb3_collation_substring` em cláusulas `COLLATE`, onde *`collation_substring`* é `bin`, `czech_ci`, `danish_ci`, `esperanto_ci`, `estonian_ci`, e assim por diante. Por exemplo:

```
CREATE TABLE t (s1 CHAR(1)) CHARACTER SET utf8mb3;
SELECT * FROM t WHERE s1 COLLATE utf8mb3_general_ci = 'x';
DECLARE x VARCHAR(5) CHARACTER SET utf8mb3 COLLATE utf8mb3_danish_ci;
SELECT CAST('a' AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_czech_ci;
```

Em declarações como `SHOW CREATE TABLE` ou `SELECT CHARACTER_SET_NAME FROM INFORMATION_SCHEMA.COLUMNS` ou `SELECT COLLATION_NAME FROM INFORMATION_SCHEMA.COLUMNS`, conjuntos de caracteres ou nomes de collation prefixados com `utf8` ou `utf8_` são exibidos usando `utf8mb3` ou `utf8mb3_`, respectivamente.

`utf8mb3` também é válido (mas desatualizado) em contextos diferentes das cláusulas `CHARACTER SET`. Por exemplo:

```
mysqld --character-set-server=utf8mb3
```

```
SET NAMES 'utf8mb3'; /* and other SET statements that have similar effect */
SELECT _utf8mb3 'a';
```

Para obter informações sobre o armazenamento do tipo de dados em relação a conjuntos de caracteres multibyte, consulte os requisitos de armazenamento do tipo de string.