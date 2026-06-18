### 12.9.2 O conjunto de caracteres utf8mb3 (codificação Unicode UTF-8 de 3 bytes)

O conjunto de caracteres `utf8mb3` tem essas características:

- Suporta apenas caracteres BMP (sem suporte para caracteres suplementares)

- Requer no máximo três bytes por caractere multibyte.

Aplicações que utilizam dados UTF-8, mas exigem suporte para caracteres adicionais, devem usar `utf8mb4` em vez de `utf8mb3` (consulte a Seção 12.9.1, “O conjunto de caracteres utf8mb4 (codificação Unicode UTF-8 de 4 bytes”)”).

Exatamente o mesmo conjunto de caracteres está disponível em `utf8mb3` e `ucs2`. Ou seja, eles têm o mesmo repertório.

Nota

O conjunto de caracteres recomendado para o MySQL é `utf8mb4`. Todas as novas aplicações devem usar `utf8mb4`.

O conjunto de caracteres `utf8mb3` está desatualizado. `utf8mb3` continua sendo suportado para a vida útil das séries de lançamentos LTS do MySQL 8.0.x e seguintes, bem como no MySQL 8.0.

Espere que o `utf8mb3` seja removido em uma futura versão principal do MySQL.

Como a mudança de conjuntos de caracteres pode ser uma tarefa complexa e demorada, você deve começar a se preparar para essa mudança agora, usando `utf8mb4` para novos aplicativos. Para obter orientações sobre a conversão de aplicativos existentes que utilizam utfmb3, consulte a Seção 12.9.8, “Conversão entre conjuntos de caracteres Unicode de 3 e 4 bytes”.

`utf8mb3` pode ser usado em cláusulas `CHARACTER SET` e `utf8mb3_collation_substring` em cláusulas `COLLATE`, onde `collation_substring` é `bin`, `czech_ci`, `danish_ci`, `esperanto_ci`, `estonian_ci` e assim por diante. Por exemplo:

```
CREATE TABLE t (s1 CHAR(1)) CHARACTER SET utf8mb3;
SELECT * FROM t WHERE s1 COLLATE utf8mb3_general_ci = 'x';
DECLARE x VARCHAR(5) CHARACTER SET utf8mb3 COLLATE utf8mb3_danish_ci;
SELECT CAST('a' AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_czech_ci;
```

Antes do MySQL 8.0.29, as instâncias de `utf8mb3` nas instruções eram convertidas para `utf8`. No MySQL 8.0.30 e versões posteriores, o inverso é verdadeiro, de modo que em instruções como `SHOW CREATE TABLE` ou `SELECT CHARACTER_SET_NAME FROM INFORMATION_SCHEMA.COLUMNS` ou `SELECT COLLATION_NAME FROM INFORMATION_SCHEMA.COLUMNS`, os usuários veem o nome do conjunto de caracteres ou da collation prefixado com `utf8mb3` ou `utf8mb3_`.

`utf8mb3` também é válido (mas desatualizado) em contextos diferentes das cláusulas `CHARACTER SET`. Por exemplo:

```
mysqld --character-set-server=utf8mb3
```

```
SET NAMES 'utf8mb3'; /* and other SET statements that have similar effect */
SELECT _utf8mb3 'a';
```

Para obter informações sobre o armazenamento de tipos de dados relacionados a conjuntos de caracteres multibytes, consulte os requisitos de armazenamento do tipo de string.
