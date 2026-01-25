#### 8.2.1.1 Otimização da Cláusula WHERE

Esta seção discute otimizações que podem ser feitas para processar cláusulas `WHERE`. Os exemplos usam comandos `SELECT`, mas as mesmas otimizações se aplicam às cláusulas `WHERE` em comandos `DELETE` e `UPDATE`.

Nota

Como o trabalho no otimizador do MySQL está em andamento, nem todas as otimizações que o MySQL executa estão documentadas aqui.

Você pode ficar tentado a reescrever suas Queries para acelerar operações aritméticas, sacrificando a legibilidade. Como o MySQL executa otimizações semelhantes automaticamente, você pode frequentemente evitar esse trabalho e deixar a Query em uma forma mais compreensível e de fácil manutenção. Algumas das otimizações realizadas pelo MySQL são as seguintes:

* Remoção de parênteses desnecessários:

  ```sql
     ((a AND b) AND c OR (((a AND b) AND (c AND d))))
  -> (a AND b AND c) OR (a AND b AND c AND d)
  ```

* Constant folding (Agregação de constantes):

  ```sql
     (a<b AND b=c) AND a=5
  -> b>5 AND b=c AND a=5
  ```

* Remoção de condição constante:

  ```sql
     (b>=5 AND b=5) OR (b=6 AND 5=5) OR (b=7 AND 5=6)
  -> b=5 OR b=6
  ```

* Expressões constantes usadas por Indexes são avaliadas apenas uma vez.

* `COUNT(*)` em uma única tabela sem uma cláusula `WHERE` é recuperado diretamente das informações da tabela para tabelas `MyISAM` e `MEMORY`. Isso também é feito para qualquer expressão `NOT NULL` quando usada com apenas uma tabela.

* Detecção precoce de expressões constantes inválidas. O MySQL detecta rapidamente que alguns comandos `SELECT` são impossíveis e não retorna nenhuma linha.

* `HAVING` é mesclado com `WHERE` se você não usar `GROUP BY` ou funções agregadas (`COUNT()`, `MIN()`, e assim por diante).

* Para cada tabela em um JOIN, uma cláusula `WHERE` mais simples é construída para obter uma avaliação rápida do `WHERE` para a tabela e também para ignorar linhas o mais rápido possível.

* Todas as tabelas constantes são lidas primeiro, antes de qualquer outra tabela na Query. Uma tabela constante é qualquer uma das seguintes:

  + Uma tabela vazia ou uma tabela com uma linha.
  + Uma tabela usada com uma cláusula `WHERE` em uma `PRIMARY KEY` ou um `UNIQUE` Index, onde todas as partes do Index são comparadas a expressões constantes e são definidas como `NOT NULL`.

  Todas as tabelas a seguir são usadas como tabelas constantes:

  ```sql
  SELECT * FROM t WHERE primary_key=1;
  SELECT * FROM t1,t2
    WHERE t1.primary_key=1 AND t2.primary_key=t1.id;
  ```

* A melhor combinação de JOIN para unir as tabelas é encontrada tentando todas as possibilidades. Se todas as colunas nas cláusulas `ORDER BY` e `GROUP BY` vierem da mesma tabela, essa tabela será preferida primeiro ao realizar o JOIN.

* Se houver uma cláusula `ORDER BY` e uma cláusula `GROUP BY` diferente, ou se o `ORDER BY` ou `GROUP BY` contiver colunas de tabelas diferentes da primeira tabela na fila de JOIN, uma tabela temporária é criada.

* Se você usar o modificador `SQL_SMALL_RESULT`, o MySQL utiliza uma tabela temporária na memória.

* Cada Index da tabela é consultado e o melhor Index é usado, a menos que o otimizador acredite que seja mais eficiente usar um table scan (leitura completa da tabela). Anteriormente, um scan era usado se o melhor Index abrangesse mais de 30% da tabela, mas uma porcentagem fixa não determina mais a escolha entre usar um Index ou um scan. O otimizador agora é mais complexo e baseia sua estimativa em fatores adicionais, como tamanho da tabela, número de linhas e tamanho do bloco de I/O.

* Em alguns casos, o MySQL pode ler linhas do Index sem sequer consultar o arquivo de dados. Se todas as colunas usadas do Index forem numéricas, apenas a árvore de Index é usada para resolver a Query.

* Antes de cada linha ser exibida, aquelas que não correspondem à cláusula `HAVING` são ignoradas.

Alguns exemplos de Queries que são muito rápidas:

```sql
SELECT COUNT(*) FROM tbl_name;

SELECT MIN(key_part1),MAX(key_part1) FROM tbl_name;

SELECT MAX(key_part2) FROM tbl_name
  WHERE key_part1=constant;

SELECT ... FROM tbl_name
  ORDER BY key_part1,key_part2,... LIMIT 10;

SELECT ... FROM tbl_name
  ORDER BY key_part1 DESC, key_part2 DESC, ... LIMIT 10;
```

O MySQL resolve as seguintes Queries usando apenas a árvore de Index, assumindo que as colunas indexadas são numéricas:

```sql
SELECT key_part1,key_part2 FROM tbl_name WHERE key_part1=val;

SELECT COUNT(*) FROM tbl_name
  WHERE key_part1=val1 AND key_part2=val2;

SELECT MAX(key_part2) FROM tbl_name GROUP BY key_part1;
```

As seguintes Queries usam Indexing para recuperar as linhas em ordem classificada sem uma passagem de classificação separada:

```sql
SELECT ... FROM tbl_name
  ORDER BY key_part1,key_part2,... ;

SELECT ... FROM tbl_name
  ORDER BY key_part1 DESC, key_part2 DESC, ... ;
```