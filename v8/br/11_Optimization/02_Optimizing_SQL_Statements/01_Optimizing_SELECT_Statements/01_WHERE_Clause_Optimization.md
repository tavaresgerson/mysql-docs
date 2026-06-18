#### 10.2.1.1 Otimização da cláusula WHERE

Esta seção discute as otimizações que podem ser feitas para processar cláusulas `WHERE`. Os exemplos usam instruções `SELECT`, mas as mesmas otimizações se aplicam a cláusulas `WHERE` em instruções `DELETE` e `UPDATE`.

Nota

Como o trabalho no otimizador do MySQL está em andamento, nem todas as otimizações que o MySQL realiza estão documentadas aqui.

Você pode ter a tentação de reescrever suas consultas para tornar as operações aritméticas mais rápidas, sacrificando a legibilidade. Como o MySQL realiza otimizações semelhantes automaticamente, você pode muitas vezes evitar esse trabalho e deixar a consulta em uma forma mais compreensível e manobrável. Algumas das otimizações realizadas pelo MySQL incluem:

- Remoção de parênteses desnecessários:

  ```
     ((a AND b) AND c OR (((a AND b) AND (c AND d))))
  -> (a AND b AND c) OR (a AND b AND c AND d)
  ```

- Dobramento constante:

  ```
     (a<b AND b=c) AND a=5
  -> b>5 AND b=c AND a=5
  ```

- Remoção da condição constante:

  ```
     (b>=5 AND b=5) OR (b=6 AND 5=5) OR (b=7 AND 5=6)
  -> b=5 OR b=6
  ```

  No MySQL 8.0.14 e versões posteriores, isso ocorre durante a preparação, em vez da fase de otimização, o que ajuda na simplificação das junções. Consulte a Seção 10.2.1.9, “Otimização de Junções Externas”, para obter mais informações e exemplos.

- Expressões constantes usadas por índices são avaliadas apenas uma vez.

- A partir do MySQL 8.0.16, as comparações de colunas de tipos numéricos com valores constantes são verificadas e eliminadas ou modificadas para valores inválidos ou fora da faixa:

  ```
  # CREATE TABLE t (c TINYINT UNSIGNED NOT NULL);
    SELECT * FROM t WHERE c < 256;
  -≫ SELECT * FROM t WHERE 1;
  ```

  Consulte a Seção 10.2.1.14, “Otimização de Dobramento Constante”, para obter mais informações.

- `COUNT(*)` em uma única tabela sem um `WHERE` é recuperado diretamente das informações da tabela para as tabelas `MyISAM` e `MEMORY`. Isso também é feito para qualquer expressão `NOT NULL` quando usada com apenas uma tabela.

- Detecção precoce de expressões constantes inválidas. O MySQL rapidamente detecta que algumas instruções `SELECT` são impossíveis e não retorna nenhuma linha.

- `HAVING` é mesclado com `WHERE` se você não usar `GROUP BY` ou funções agregadas (`COUNT()`, `MIN()` e assim por diante).

- Para cada tabela em uma junção, é construído um `WHERE` mais simples para obter uma avaliação rápida do `WHERE` para a tabela e também para ignorar linhas o mais rápido possível.

- Todas as tabelas constantes são lidas primeiro antes de qualquer outra tabela na consulta. Uma tabela constante é qualquer uma das seguintes:

  - Uma tabela vazia ou uma tabela com uma única linha.
  - Uma tabela que é usada com uma cláusula `WHERE` em um índice `PRIMARY KEY` ou `UNIQUE`, onde todas as partes do índice são comparadas a expressões constantes e são definidas como `NOT NULL`.

  Todas as tabelas a seguir são usadas como tabelas constantes:

  ```
  SELECT * FROM t WHERE primary_key=1;
  SELECT * FROM t1,t2
    WHERE t1.primary_key=1 AND t2.primary_key=t1.id;
  ```

- A melhor combinação de junção para unir as tabelas é encontrada tentando todas as possibilidades. Se todas as colunas nas cláusulas `ORDER BY` e `GROUP BY` vierem da mesma tabela, essa tabela é preferida primeiro durante a junção.

- Se houver uma cláusula `ORDER BY` e uma cláusula `GROUP BY` diferente, ou se a `ORDER BY` ou `GROUP BY` contiver colunas de tabelas diferentes da primeira tabela na fila de junção, uma tabela temporária será criada.

- Se você usar o modificador `SQL_SMALL_RESULT`, o MySQL usa uma tabela temporária de memória.

- Cada índice de tabela é pesquisado, e o melhor índice é usado, a menos que o otimizador acredite que seja mais eficiente usar uma varredura da tabela. Em um momento, uma varredura era usada com base no fato de que o melhor índice abrangia mais de 30% da tabela, mas uma porcentagem fixa não determina mais a escolha entre usar um índice ou uma varredura. O otimizador agora é mais complexo e baseia sua estimativa em fatores adicionais, como o tamanho da tabela, o número de linhas e o tamanho do bloco de E/S.

- Em alguns casos, o MySQL pode ler linhas do índice sem consultar o arquivo de dados. Se todas as colunas usadas no índice forem numéricas, apenas a árvore do índice é usada para resolver a consulta.

- Antes de cada linha ser exibida, as que não corresponderem à cláusula `HAVING` são ignoradas.

Alguns exemplos de consultas muito rápidas:

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

O MySQL resolve as seguintes consultas usando apenas a árvore de índices, assumindo que as colunas indexadas são numéricas:

```
SELECT key_part1,key_part2 FROM tbl_name WHERE key_part1=val;

SELECT COUNT(*) FROM tbl_name
  WHERE key_part1=val1 AND key_part2=val2;

SELECT MAX(key_part2) FROM tbl_name GROUP BY key_part1;
```

As seguintes consultas utilizam a indexação para recuperar as linhas em ordem de classificação sem uma passagem de classificação separada:

```
SELECT ... FROM tbl_name
  ORDER BY key_part1,key_part2,... ;

SELECT ... FROM tbl_name
  ORDER BY key_part1 DESC, key_part2 DESC, ... ;
```
