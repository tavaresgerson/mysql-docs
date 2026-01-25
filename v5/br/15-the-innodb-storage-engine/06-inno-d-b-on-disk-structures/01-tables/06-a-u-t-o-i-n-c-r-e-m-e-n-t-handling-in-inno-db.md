#### 14.6.1.6 Manuseio do AUTO_INCREMENT no InnoDB

O `InnoDB` oferece um mecanismo de Lock configurável que pode melhorar significativamente a escalabilidade e o desempenho de declarações SQL que adicionam linhas a tabelas com colunas `AUTO_INCREMENT`. Para usar o mecanismo `AUTO_INCREMENT` com uma tabela `InnoDB`, uma coluna `AUTO_INCREMENT` deve ser definida como a primeira ou a única coluna de algum Index, de modo que seja possível realizar o equivalente a um lookup indexado de `SELECT MAX(ai_col)` na tabela para obter o valor máximo da coluna. Não é obrigatório que o Index seja uma `PRIMARY KEY` ou `UNIQUE`, mas para evitar valores duplicados na coluna `AUTO_INCREMENT`, esses tipos de Index são recomendados.

Esta seção descreve os modos de Lock do `AUTO_INCREMENT`, as implicações de uso das diferentes configurações de modo de Lock do `AUTO_INCREMENT` e como o `InnoDB` inicializa o contador `AUTO_INCREMENT`.

* Modos de Lock do InnoDB AUTO_INCREMENT
* Implicações de Uso dos Modos de Lock do InnoDB AUTO_INCREMENT
* Inicialização do Contador AUTO_INCREMENT do InnoDB
* Notas

##### Modos de Lock do InnoDB AUTO_INCREMENT

Esta seção descreve os modos de Lock `AUTO_INCREMENT` usados para gerar valores de auto-incremento e como cada modo de Lock afeta a Replication. O modo de Lock de auto-incremento é configurado na inicialização usando a variável `innodb_autoinc_lock_mode`.

Os seguintes termos são usados na descrição das configurações de `innodb_autoinc_lock_mode`:

* Declarações “tipo `INSERT`” (`“INSERT`-like” statements)

  Todas as declarações que geram novas linhas em uma tabela, incluindo `INSERT`, `INSERT ... SELECT`, `REPLACE`, `REPLACE ... SELECT` e `LOAD DATA`. Inclui “simple-inserts” (inserts simples), “bulk-inserts” (inserts em massa) e inserts de “mixed-mode” (modo misto).

* “Simple inserts” (Inserts Simples)

  Declarações para as quais o número de linhas a serem inseridas pode ser determinado antecipadamente (quando a declaração é processada inicialmente). Isso inclui declarações `INSERT` e `REPLACE` de linha única e de múltiplas linhas que não possuem uma subquery aninhada, mas não `INSERT ... ON DUPLICATE KEY UPDATE`.

* “Bulk inserts” (Inserts em Massa)

  Declarações para as quais o número de linhas a serem inseridas (e o número de valores de auto-incremento necessários) não é conhecido antecipadamente. Isso inclui as declarações `INSERT ... SELECT`, `REPLACE ... SELECT` e `LOAD DATA`, mas não o `INSERT` simples. O `InnoDB` atribui novos valores para a coluna `AUTO_INCREMENT` um de cada vez à medida que cada linha é processada.

* “Mixed-mode inserts” (Inserts de Modo Misto)

  São declarações de “simple insert” que especificam o valor de auto-incremento para algumas (mas não todas) as novas linhas. Um exemplo é o seguinte, onde `c1` é uma coluna `AUTO_INCREMENT` da tabela `t1`:

  ```sql
  INSERT INTO t1 (c1,c2) VALUES (1,'a'), (NULL,'b'), (5,'c'), (NULL,'d');
  ```

  Outro tipo de insert de “mixed-mode” é o `INSERT ... ON DUPLICATE KEY UPDATE`, que, no pior caso, é na verdade um `INSERT` seguido por um `UPDATE`, onde o valor alocado para a coluna `AUTO_INCREMENT` pode ou não ser usado durante a fase de Update.

Existem três configurações possíveis para a variável `innodb_autoinc_lock_mode`. As configurações são 0, 1 ou 2, para os modos de Lock “traditional” (tradicional), “consecutive” (consecutivo) ou “interleaved” (intercalado), respectivamente.

* `innodb_autoinc_lock_mode = 0` (Modo de Lock “traditional”)

  O modo de Lock tradicional fornece o mesmo comportamento que existia antes da introdução da variável `innodb_autoinc_lock_mode`. A opção de modo de Lock tradicional é fornecida para compatibilidade com versões anteriores, testes de desempenho e solução de problemas com inserts de “mixed-mode”, devido a possíveis diferenças de semântica.

  Neste modo de Lock, todas as declarações “tipo `INSERT`” obtêm um Lock especial `AUTO-INC` de nível de tabela para inserts em tabelas com colunas `AUTO_INCREMENT`. Este Lock é normalmente mantido até o final da declaração (não até o final da Transaction) para garantir que os valores de auto-incremento sejam atribuídos em uma ordem previsível e repetível para uma determinada sequência de declarações `INSERT` e para garantir que os valores de auto-incremento atribuídos por qualquer declaração sejam consecutivos.

  No caso de Replication baseada em declaração, isso significa que quando uma declaração SQL é replicada em um servidor réplica, os mesmos valores são usados para a coluna de auto-incremento que foram usados no servidor de origem. O resultado da execução de múltiplas declarações `INSERT` é determinístico, e a réplica reproduz os mesmos dados que na origem. Se os valores de auto-incremento gerados por múltiplas declarações `INSERT` fossem intercalados, o resultado de duas declarações `INSERT` concorrentes seria não determinístico e não poderia ser propagado de forma confiável para um servidor réplica usando Replication baseada em declaração.

  Para tornar isso claro, considere um exemplo que usa esta tabela:

  ```sql
  CREATE TABLE t1 (
    c1 INT(11) NOT NULL AUTO_INCREMENT,
    c2 VARCHAR(10) DEFAULT NULL,
    PRIMARY KEY (c1)
  ) ENGINE=InnoDB;
  ```

  Suponha que existam duas Transactions em execução, cada uma inserindo linhas em uma tabela com uma coluna `AUTO_INCREMENT`. Uma Transaction está usando uma declaração `INSERT ... SELECT` que insere 1000 linhas, e a outra está usando uma declaração `INSERT` simples que insere uma linha:

  ```sql
  Tx1: INSERT INTO t1 (c2) SELECT 1000 rows from another table ...
  Tx2: INSERT INTO t1 (c2) VALUES ('xxx');
  ```

  O `InnoDB` não pode dizer antecipadamente quantas linhas são recuperadas pelo `SELECT` na declaração `INSERT` na Tx1, e atribui os valores de auto-incremento um de cada vez à medida que a declaração avança. Com um Lock de nível de tabela, mantido até o final da declaração, apenas uma declaração `INSERT` referente à tabela `t1` pode ser executada por vez, e a geração de números de auto-incremento por diferentes declarações não é intercalada. Os valores de auto-incremento gerados pela declaração `INSERT ... SELECT` da Tx1 são consecutivos, e o (único) valor de auto-incremento usado pela declaração `INSERT` na Tx2 é menor ou maior do que todos os usados para a Tx1, dependendo de qual declaração é executada primeiro.

  Contanto que as declarações SQL sejam executadas na mesma ordem quando reexecutadas a partir do Binary Log (ao usar Replication baseada em declaração, ou em cenários de recuperação), os resultados são os mesmos de quando Tx1 e Tx2 foram executadas pela primeira vez. Assim, Locks de nível de tabela mantidos até o final de uma declaração tornam as declarações `INSERT` que usam auto-incremento seguras para uso com Replication baseada em declaração. No entanto, esses Locks de nível de tabela limitam a concorrência e a escalabilidade quando múltiplas Transactions estão executando declarações de insert ao mesmo tempo.

  No exemplo anterior, se não houvesse Lock de nível de tabela, o valor da coluna de auto-incremento usado para o `INSERT` na Tx2 dependeria de quando exatamente a declaração é executada. Se o `INSERT` da Tx2 for executado enquanto o `INSERT` da Tx1 estiver em execução (em vez de antes de começar ou depois de terminar), os valores de auto-incremento específicos atribuídos pelas duas declarações `INSERT` serão não determinísticos e podem variar de uma execução para outra.

  No modo de Lock consecutivo, o `InnoDB` pode evitar o uso de Locks `AUTO-INC` de nível de tabela para declarações de “simple insert” onde o número de linhas é conhecido antecipadamente, e ainda assim preservar a execução determinística e a segurança para Replication baseada em declaração.

  Se você não estiver usando o Binary Log para reexecutar declarações SQL como parte de cenários de recuperação ou Replication, o modo de Lock intercalado pode ser usado para eliminar todo o uso de Locks `AUTO-INC` de nível de tabela para uma concorrência e desempenho ainda maiores, ao custo de permitir lacunas nos números de auto-incremento atribuídos por uma declaração e potencialmente ter os números atribuídos por declarações em execução concorrente intercalados.

* `innodb_autoinc_lock_mode = 1` (Modo de Lock “consecutive”)

  Este é o modo de Lock padrão. Neste modo, “bulk inserts” usam o Lock `AUTO-INC` especial de nível de tabela e o mantêm até o final da declaração. Isso se aplica a todas as declarações `INSERT ... SELECT`, `REPLACE ... SELECT` e `LOAD DATA`. Apenas uma declaração mantendo o Lock `AUTO-INC` pode ser executada por vez. Se a tabela de origem da operação de bulk insert for diferente da tabela de destino, o Lock `AUTO-INC` na tabela de destino é obtido após um Lock compartilhado ser obtido na primeira linha selecionada da tabela de origem. Se a origem e o destino da operação de bulk insert forem a mesma tabela, o Lock `AUTO-INC` é obtido depois que Locks compartilhados são obtidos em todas as linhas selecionadas.

  “Simple inserts” (para os quais o número de linhas a serem inseridas é conhecido antecipadamente) evitam Locks `AUTO-INC` de nível de tabela, obtendo o número necessário de valores de auto-incremento sob o controle de um Mutex (um Lock leve) que é mantido apenas durante o processo de alocação, *não* até que a declaração seja concluída. Nenhum Lock `AUTO-INC` de nível de tabela é usado, a menos que um Lock `AUTO-INC` esteja sendo mantido por outra Transaction. Se outra Transaction mantiver um Lock `AUTO-INC`, um “simple insert” aguarda o Lock `AUTO-INC`, como se fosse um “bulk insert”.

  Este modo de Lock garante que, na presença de declarações `INSERT` onde o número de linhas não é conhecido antecipadamente (e onde números de auto-incremento são atribuídos à medida que a declaração avança), todos os valores de auto-incremento atribuídos por qualquer declaração “tipo `INSERT`” são consecutivos, e as operações são seguras para Replication baseada em declaração.

  Simplificando, este modo de Lock melhora significativamente a escalabilidade enquanto é seguro para uso com Replication baseada em declaração. Além disso, assim como no modo de Lock “traditional”, os números de auto-incremento atribuídos por qualquer declaração são *consecutivos*. Não há *nenhuma mudança* na semântica em comparação com o modo “traditional” para qualquer declaração que use auto-incremento, com uma exceção importante.

  A exceção é para “mixed-mode inserts”, onde o usuário fornece valores explícitos para uma coluna `AUTO_INCREMENT` para algumas, mas não todas, as linhas em um “simple insert” de múltiplas linhas. Para tais inserts, o `InnoDB` aloca mais valores de auto-incremento do que o número de linhas a serem inseridas. No entanto, todos os valores atribuídos automaticamente são gerados consecutivamente (e, portanto, são maiores do que) o valor de auto-incremento gerado pela declaração anterior executada mais recentemente. Números “em excesso” são perdidos.

* `innodb_autoinc_lock_mode = 2` (Modo de Lock “interleaved”)

  Neste modo de Lock, nenhuma declaração “tipo `INSERT`” usa o Lock `AUTO-INC` de nível de tabela, e múltiplas declarações podem ser executadas ao mesmo tempo. Este é o modo de Lock mais rápido e escalável, mas *não é seguro* ao usar Replication baseada em declaração ou cenários de recuperação quando declarações SQL são reexecutadas a partir do Binary Log.

  Neste modo de Lock, os valores de auto-incremento têm garantia de serem únicos e monotonicamente crescentes em todas as declarações “tipo `INSERT`” em execução concorrente. No entanto, como múltiplas declarações podem estar gerando números ao mesmo tempo (ou seja, a alocação de números é *intercalada* entre as declarações), os valores gerados para as linhas inseridas por qualquer declaração podem não ser consecutivos.

  Se as únicas declarações em execução forem “simple inserts” onde o número de linhas a serem inseridas é conhecido antecipadamente, não há lacunas nos números gerados para uma única declaração, exceto para “mixed-mode inserts”. No entanto, quando “bulk inserts” são executados, pode haver lacunas nos valores de auto-incremento atribuídos por qualquer declaração.

##### Implicações de Uso dos Modos de Lock do InnoDB AUTO_INCREMENT

* Uso de auto-incremento com Replication

  Se você estiver usando Replication baseada em declaração, defina `innodb_autoinc_lock_mode` para 0 ou 1 e use o mesmo valor na origem e em suas réplicas. Não é garantido que os valores de auto-incremento serão os mesmos nas réplicas que na origem se você usar `innodb_autoinc_lock_mode` = 2 (“interleaved”) ou configurações onde a origem e as réplicas não usam o mesmo modo de Lock.

  Se você estiver usando Replication baseada em linha (row-based) ou formato misto (mixed-format), todos os modos de Lock de auto-incremento são seguros, uma vez que a Replication baseada em linha não é sensível à ordem de execução das declarações SQL (e o formato misto usa Replication baseada em linha para quaisquer declarações que não são seguras para Replication baseada em declaração).

* Valores de auto-incremento “perdidos” e lacunas de sequência

  Em todos os modos de Lock (0, 1 e 2), se uma Transaction que gerou valores de auto-incremento fizer Rollback, esses valores de auto-incremento são “perdidos”. Uma vez que um valor é gerado para uma coluna de auto-incremento, ele não pode ser revertido, independentemente de a declaração “tipo `INSERT`” ser concluída e de a Transaction contida fazer Rollback. Tais valores perdidos não são reutilizados. Assim, pode haver lacunas nos valores armazenados em uma coluna `AUTO_INCREMENT` de uma tabela.

* Especificando NULL ou 0 para a coluna `AUTO_INCREMENT`

  Em todos os modos de Lock (0, 1 e 2), se um usuário especificar NULL ou 0 para a coluna `AUTO_INCREMENT` em um `INSERT`, o `InnoDB` trata a linha como se o valor não tivesse sido especificado e gera um novo valor para ela.

* Atribuindo um valor negativo à coluna `AUTO_INCREMENT`

  Em todos os modos de Lock (0, 1 e 2), o comportamento do mecanismo de auto-incremento é indefinido se você atribuir um valor negativo à coluna `AUTO_INCREMENT`.

* Se o valor `AUTO_INCREMENT` se tornar maior do que o inteiro máximo para o tipo inteiro especificado

  Em todos os modos de Lock (0, 1 e 2), o comportamento do mecanismo de auto-incremento é indefinido se o valor se tornar maior do que o inteiro máximo que pode ser armazenado no tipo inteiro especificado.

* Lacunas nos valores de auto-incremento para “bulk inserts”

  Com `innodb_autoinc_lock_mode` definido como 0 (“traditional”) ou 1 (“consecutive”), os valores de auto-incremento gerados por qualquer declaração são consecutivos, sem lacunas, porque o Lock `AUTO-INC` de nível de tabela é mantido até o final da declaração, e apenas uma declaração desse tipo pode ser executada por vez.

  Com `innodb_autoinc_lock_mode` definido como 2 (“interleaved”), pode haver lacunas nos valores de auto-incremento gerados por “bulk inserts”, mas apenas se houver declarações “tipo `INSERT`” em execução concorrente.

  Para os modos de Lock 1 ou 2, podem ocorrer lacunas entre declarações sucessivas porque para bulk inserts o número exato de valores de auto-incremento exigido por cada declaração pode não ser conhecido e a superestimação é possível.

* Valores de auto-incremento atribuídos por “mixed-mode inserts”

  Considere um “mixed-mode insert”, onde um “simple insert” especifica o valor de auto-incremento para algumas (mas não todas) as linhas resultantes. Tal declaração se comporta de maneira diferente nos modos de Lock 0, 1 e 2. Por exemplo, assuma que `c1` é uma coluna `AUTO_INCREMENT` da tabela `t1` e que o número de sequência gerado automaticamente mais recente é 100.

  ```sql
  mysql> CREATE TABLE t1 (
      -> c1 INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      -> c2 CHAR(1)
      -> ) ENGINE = INNODB;
  ```

  Agora, considere a seguinte declaração de “mixed-mode insert”:

  ```sql
  mysql> INSERT INTO t1 (c1,c2) VALUES (1,'a'), (NULL,'b'), (5,'c'), (NULL,'d');
  ```

  Com `innodb_autoinc_lock_mode` definido como 0 (“traditional”), as quatro novas linhas são:

  ```sql
  mysql> SELECT c1, c2 FROM t1 ORDER BY c2;
  +-----+------+
  | c1  | c2   |
  +-----+------+
  |   1 | a    |
  | 101 | b    |
  |   5 | c    |
  | 102 | d    |
  +-----+------+
  ```

  O próximo valor de auto-incremento disponível é 103 porque os valores de auto-incremento são alocados um de cada vez, e não todos de uma vez no início da execução da declaração. Este resultado é verdadeiro, independentemente de haver ou não declarações “tipo `INSERT`” em execução concorrente (de qualquer tipo).

  Com `innodb_autoinc_lock_mode` definido como 1 (“consecutive”), as quatro novas linhas também são:

  ```sql
  mysql> SELECT c1, c2 FROM t1 ORDER BY c2;
  +-----+------+
  | c1  | c2   |
  +-----+------+
  |   1 | a    |
  | 101 | b    |
  |   5 | c    |
  | 102 | d    |
  +-----+------+
  ```

  No entanto, neste caso, o próximo valor de auto-incremento disponível é 105, não 103, porque quatro valores de auto-incremento são alocados no momento em que a declaração é processada, mas apenas dois são usados. Este resultado é verdadeiro, independentemente de haver ou não declarações “tipo `INSERT`” em execução concorrente (de qualquer tipo).

  Com `innodb_autoinc_lock_mode` definido como 2 (“interleaved”), as quatro novas linhas são:

  ```sql
  mysql> SELECT c1, c2 FROM t1 ORDER BY c2;
  +-----+------+
  | c1  | c2   |
  +-----+------+
  |   1 | a    |
  |   x | b    |
  |   5 | c    |
  |   y | d    |
  +-----+------+
  ```

  Os valores de *`x`* e *`y`* são únicos e maiores do que qualquer linha gerada anteriormente. No entanto, os valores específicos de *`x`* e *`y`* dependem do número de valores de auto-incremento gerados pelas declarações em execução concorrente.

  Finalmente, considere a seguinte declaração, emitida quando o número de sequência gerado mais recentemente é 100:

  ```sql
  mysql> INSERT INTO t1 (c1,c2) VALUES (1,'a'), (NULL,'b'), (101,'c'), (NULL,'d');
  ```

  Com qualquer configuração de `innodb_autoinc_lock_mode`, esta declaração gera um erro de chave duplicada (duplicate-key error) 23000 (`Can't write; duplicate key in table`) porque 101 é alocado para a linha `(NULL, 'b')` e a inserção da linha `(101, 'c')` falha.

* Modificação de valores da coluna `AUTO_INCREMENT` no meio de uma sequência de declarações `INSERT`

  Em todos os modos de Lock (0, 1 e 2), modificar um valor da coluna `AUTO_INCREMENT` no meio de uma sequência de declarações `INSERT` pode levar a erros de “Duplicate entry”. Por exemplo, se você realizar uma operação `UPDATE` que altera um valor da coluna `AUTO_INCREMENT` para um valor maior do que o valor atual máximo de auto-incremento, operações `INSERT` subsequentes que não especificam um valor de auto-incremento não utilizado podem encontrar erros de “Duplicate entry”. Este comportamento é demonstrado no exemplo a seguir.

  ```sql
  mysql> CREATE TABLE t1 (
      -> c1 INT NOT NULL AUTO_INCREMENT,
      -> PRIMARY KEY (c1)
      ->  ) ENGINE = InnoDB;

  mysql> INSERT INTO t1 VALUES(0), (0), (3);

  mysql> SELECT c1 FROM t1;
  +----+
  | c1 |
  +----+
  |  1 |
  |  2 |
  |  3 |
  +----+

  mysql> UPDATE t1 SET c1 = 4 WHERE c1 = 1;

  mysql> SELECT c1 FROM t1;
  +----+
  | c1 |
  +----+
  |  2 |
  |  3 |
  |  4 |
  +----+

  mysql> INSERT INTO t1 VALUES(0);
  ERROR 1062 (23000): Duplicate entry '4' for key 'PRIMARY'
  ```

##### Inicialização do Contador AUTO_INCREMENT do InnoDB

Esta seção descreve como o `InnoDB` inicializa os contadores `AUTO_INCREMENT`.

Se você especificar uma coluna `AUTO_INCREMENT` para uma tabela `InnoDB`, o manipulador da tabela (table handle) no dicionário de dados do `InnoDB` contém um contador especial chamado contador de auto-incremento que é usado na atribuição de novos valores para a coluna. Este contador é armazenado apenas na memória principal, não em disco.

Para inicializar um contador de auto-incremento após um restart do servidor, o `InnoDB` executa o equivalente da seguinte declaração no primeiro insert em uma tabela que contém uma coluna `AUTO_INCREMENT`.

```sql
SELECT MAX(ai_col) FROM table_name FOR UPDATE;
```

O `InnoDB` incrementa o valor recuperado pela declaração e o atribui à coluna e ao contador de auto-incremento para a tabela. Por padrão, o valor é incrementado por 1. Este padrão pode ser sobrescrito pela configuração `auto_increment_increment`.

Se a tabela estiver vazia, o `InnoDB` usa o valor 1. Este padrão pode ser sobrescrito pela configuração `auto_increment_offset`.

Se uma declaração `SHOW TABLE STATUS` examinar a tabela antes que o contador de auto-incremento seja inicializado, o `InnoDB` inicializa, mas não incrementa o valor. O valor é armazenado para uso por inserts posteriores. Esta inicialização usa uma leitura normal de Lock exclusivo na tabela, e o Lock dura até o final da Transaction. O `InnoDB` segue o mesmo procedimento para inicializar o contador de auto-incremento para uma tabela recém-criada.

Depois que o contador de auto-incremento é inicializado, se você não especificar explicitamente um valor para uma coluna `AUTO_INCREMENT`, o `InnoDB` incrementa o contador e atribui o novo valor à coluna. Se você inserir uma linha que especifica explicitamente o valor da coluna, e o valor for maior do que o valor atual do contador, o contador é definido para o valor da coluna especificado.

O `InnoDB` usa o contador de auto-incremento em memória enquanto o servidor estiver em execução. Quando o servidor é parado e reiniciado, o `InnoDB` reinicializa o contador para cada tabela no primeiro `INSERT` para a tabela, conforme descrito anteriormente.

Um restart do servidor também cancela o efeito da opção de tabela `AUTO_INCREMENT = N` nas declarações `CREATE TABLE` e `ALTER TABLE`, que você pode usar com tabelas `InnoDB` para definir o valor inicial do contador ou alterar o valor atual do contador.

##### Notas

* Quando uma coluna inteira `AUTO_INCREMENT` fica sem valores, uma operação `INSERT` subsequente retorna um erro de chave duplicada. Este é um comportamento geral do MySQL.

* Ao reiniciar o servidor MySQL, o `InnoDB` pode reutilizar um valor antigo que foi gerado para uma coluna `AUTO_INCREMENT`, mas nunca foi armazenado (ou seja, um valor que foi gerado durante uma Transaction antiga que foi revertida).