#### 10.2.1.1 Otimização da Cláusula WHERE

Esta seção discute as otimizações que podem ser feitas para o processamento das cláusulas `WHERE`. Os exemplos usam instruções `SELECT`, mas as mesmas otimizações se aplicam às cláusulas `WHERE` nas instruções `DELETE` e `UPDATE`.

::: info Nota

Como o trabalho no otimizador do MySQL está em andamento, nem todas as otimizações que o MySQL realiza estão documentadas aqui.

:::

Você pode ser tentado a reescrever suas consultas para tornar as operações aritméticas mais rápidas, sacrificando a legibilidade. Como o MySQL realiza otimizações semelhantes automaticamente, você pode muitas vezes evitar esse trabalho e deixar a consulta em uma forma mais compreensível e manobrável. Algumas das otimizações realizadas pelo MySQL incluem:

* Remoção de parênteses desnecessários:

  ```
     ((a AND b) AND c OR (((a AND b) AND (c AND d))))
  -> (a AND b AND c) OR (a AND b AND c AND d)
  ```
* Folding de constantes:

  ```
     (a<b AND b=c) AND a=5
  -> b>5 AND b=c AND a=5
  ```
* Remoção de condições constantes:

  ```
     (b>=5 AND b=5) OR (b=6 AND 5=5) OR (b=7 AND 5=6)
  -> b=5 OR b=6
  ```

Isso ocorre durante a preparação, em vez da fase de otimização, o que ajuda na simplificação de junções. Consulte a Seção 10.2.1.9, “Otimização de Junção Externa”, para mais informações e exemplos.
* Expressões constantes usadas por índices são avaliadas apenas uma vez.
* Comparativos de colunas de tipos numéricos com valores constantes são verificados e colados ou removidos para valores inválidos ou fora de faixa:

  ```
  # CREATE TABLE t (c TINYINT UNSIGNED NOT NULL);
    SELECT * FROM t WHERE c < 256;
  -≫ SELECT * FROM t WHERE 1;
  ```

Consulte a Seção 10.2.1.14, “Otimização de Constantes”, para obter mais informações.
* A função `COUNT(*)` em uma única tabela sem uma cláusula `WHERE` é recuperada diretamente das informações da tabela para as tabelas `MyISAM` e `MEMORY`. Isso também é feito para qualquer expressão `NOT NULL` quando usada com apenas uma tabela.
* Detecção precoce de expressões constantes inválidas. O MySQL detecta rapidamente que algumas instruções `SELECT` são impossíveis e não retorna nenhuma linha.
* A cláusula `HAVING` é unificada com `WHERE` se você não usar `GROUP BY` ou funções agregadas ( `COUNT()`, `MIN()` e assim por diante).
* Para cada tabela em uma junção, uma cláusula `WHERE` mais simples é construída para obter uma avaliação rápida do `WHERE` para a tabela e também para ignorar linhas o mais rápido possível.
* Todas as tabelas constantes são lidas primeiro antes de qualquer outra tabela na consulta. Uma tabela constante é qualquer uma das seguintes:

  + Uma tabela vazia ou uma tabela com uma única linha.
  + Uma tabela que é usada com uma cláusula `WHERE` em uma `PRIMARY KEY` ou um índice `UNIQUE`, onde todas as partes do índice são comparadas com expressões constantes e são definidas como `NOT NULL`.

Todas as seguintes tabelas são usadas como tabelas constantes:

```
  SELECT * FROM t WHERE primary_key=1;
  SELECT * FROM t1,t2
    WHERE t1.primary_key=1 AND t2.primary_key=t1.id;
  ```
* A melhor combinação de junção para unir as tabelas é encontrada tentando todas as possibilidades. Se todas as colunas nas cláusulas `ORDER BY` e `GROUP BY` vierem da mesma tabela, essa tabela é preferida primeiro ao realizar a junção.
* Se houver uma cláusula `ORDER BY` e uma cláusula `GROUP BY` diferente, ou se a `ORDER BY` ou `GROUP BY` contiver colunas de tabelas diferentes da primeira tabela na fila de junção, uma tabela temporária é criada.
* Se você usar o modificador `SQL_SMALL_RESULT`, o MySQL usa uma tabela temporária em memória.
* Cada índice da tabela é consultada, e o melhor índice é usado, a menos que o otimizador acredite que seja mais eficiente usar uma varredura da tabela. Em um momento, uma varredura foi usada com base no fato de que o melhor índice abrangia mais de 30% da tabela, mas uma porcentagem fixa não determina mais a escolha entre usar um índice ou uma varredura. O otimizador agora é mais complexo e baseia sua estimativa em fatores adicionais, como o tamanho da tabela, o número de linhas e o tamanho do bloco de E/S.
* Em alguns casos, o MySQL pode ler linhas do índice sem consultar o arquivo de dados. Se todas as colunas usadas do índice forem numéricas, apenas a árvore de índice é usada para resolver a consulta.
* Antes de cada linha ser exibida, aquelas que não correspondem à cláusula `HAVING` são ignoradas.

Alguns exemplos de consultas que são muito rápidas:

```
SELECT COUNT(*) FROM tbl_name;

SELECT MIN(key_part1),MAX(key_part1) FROM tbl_name;

SELECT MAX(key_part2) FROM tbl_name
  WHERE key_part1=constant;

SELECT ... FROM tbl_name
  ORDER BY key_part1,key_part2,... LIMIT 10;

SELECT ... FROM tbl_name
  ORDER BY key_part1 DESC, key_part2 DESC, ... LIMIT 10;
```

O MySQL resolve as seguintes consultas usando apenas a árvore de índice, assumindo que as colunas indexadas são numéricas:

```
SELECT key_part1,key_part2 FROM tbl_name WHERE key_part1=val;

SELECT COUNT(*) FROM tbl_name
  WHERE key_part1=val1 AND key_part2=val2;

SELECT MAX(key_part2) FROM tbl_name GROUP BY key_part1;
```

As seguintes consultas usam indexação para recuperar as linhas em ordem ordenada sem uma passagem de ordenação separada:

```
SELECT ... FROM tbl_name
  ORDER BY key_part1,key_part2,... ;

SELECT ... FROM tbl_name
  ORDER BY key_part1 DESC, key_part2 DESC, ... ;
```