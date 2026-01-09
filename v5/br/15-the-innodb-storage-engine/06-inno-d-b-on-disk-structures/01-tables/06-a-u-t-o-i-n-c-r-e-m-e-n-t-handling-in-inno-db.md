#### 14.6.1.6 Gerenciamento de AUTO_INCREMENT no InnoDB

O `InnoDB` oferece um mecanismo de bloqueio configurável que pode melhorar significativamente a escalabilidade e o desempenho das instruções SQL que adicionam linhas a tabelas com colunas `AUTO_INCREMENT`. Para usar o mecanismo `AUTO_INCREMENT` com uma tabela `InnoDB`, uma coluna `AUTO_INCREMENT` deve ser definida como a primeira ou a única coluna de algum índice, de modo que seja possível realizar a consulta equivalente a um `SELECT MAX(ai_col)` indexado na tabela para obter o valor máximo da coluna. O índice não precisa ser um `PRIMARY KEY` ou `UNIQUE`, mas para evitar valores duplicados na coluna `AUTO_INCREMENT`, esses tipos de índice são recomendados.

Esta seção descreve os modos de bloqueio `AUTO_INCREMENT`, as implicações de uso das diferentes configurações dos modos de bloqueio `AUTO_INCREMENT` e como o `InnoDB` inicializa o contador `AUTO_INCREMENT`.

- Modos de bloqueio do AUTO_INCREMENT do InnoDB
- Implicações do uso do modo de bloqueio AUTO_INCREMENT do InnoDB
- Inicialização do contador de AUTO_INCREMENT do InnoDB
- Notas

##### Modos de bloqueio do AUTO_INCREMENT do InnoDB

Esta seção descreve os modos de bloqueio `AUTO_INCREMENT` usados para gerar valores de autoincremento e como cada modo de bloqueio afeta a replicação. O modo de bloqueio de autoincremento é configurado durante a inicialização usando a variável `innodb_autoinc_lock_mode`.

Os seguintes termos são usados para descrever as configurações de `innodb_autoinc_lock_mode`:

- `INSERT`-like\` declarações

  Todas as declarações que geram novas linhas em uma tabela, incluindo `INSERT`, `INSERT ... SELECT`, `REPLACE`, `REPLACE ... SELECT` e `LOAD DATA`. Inclui inserções de “inserções simples”, “inserções em lote” e inserções em “modo misto”.

- “Inserções simples”

  Declarações para as quais o número de linhas a serem inseridas pode ser determinado antecipadamente (quando a declaração é processada inicialmente). Isso inclui declarações `INSERT` e `REPLACE` de uma única linha e múltiplas linhas que não possuem uma subconsulta aninhada, mas não `INSERT ... ON DUPLICATE KEY UPDATE`.

- “Inserir em lote”

  Declarações para as quais o número de linhas a serem inseridas (e o número de valores de autoincremento necessários) não é conhecido antecipadamente. Isso inclui as declarações `INSERT ... SELECT`, `REPLACE ... SELECT` e `LOAD DATA`, mas não as declarações simples `INSERT`. O `InnoDB` atribui novos valores para a coluna `AUTO_INCREMENT` uma de cada vez à medida que cada linha é processada.

- “Inserções em modo misto”

  Estes são declarações de "inserção simples" que especificam o valor de autoincremento para algumas (mas não todas) das novas linhas. Um exemplo segue, onde `c1` é uma coluna `AUTO_INCREMENT` da tabela `t1`:

  ```sql
  INSERT INTO t1 (c1,c2) VALUES (1,'a'), (NULL,'b'), (5,'c'), (NULL,'d');
  ```

  Outro tipo de inserção em modo misto é `INSERT ... ON DUPLICATE KEY UPDATE`, que, no pior dos casos, é, na verdade, uma `INSERT` seguida de uma `UPDATE`, onde o valor alocado para a coluna `AUTO_INCREMENT` pode ou não ser usado durante a fase de atualização.

Existem três configurações possíveis para a variável `innodb_autoinc_lock_mode`. As configurações são 0, 1 ou 2, para os modos de bloqueio “tradicional”, “consecutivo” ou “interlaçado”, respectivamente.

- `innodb_autoinc_lock_mode = 0` (modo de bloqueio "tradicional")

  O modo de bloqueio tradicional oferece o mesmo comportamento que existia antes da introdução da variável `innodb_autoinc_lock_mode`. A opção de modo de bloqueio tradicional é fornecida para compatibilidade com versões anteriores, testes de desempenho e para contornar problemas com inserções em modo misto, devido às possíveis diferenças na semântica.

  Neste modo de bloqueio, todas as instruções semelhantes a `INSERT` obtêm um bloqueio especial de nível de tabela `AUTO-INC` para inserções em tabelas com colunas `AUTO_INCREMENT`. Esse bloqueio é normalmente mantido até o final da instrução (e não até o final da transação) para garantir que os valores de autoincremento sejam atribuídos em uma ordem previsível e repetiível para uma sequência dada de instruções `INSERT`, e para garantir que os valores de autoincremento atribuídos por qualquer instrução dada sejam consecutivos.

  No caso da replicação baseada em declarações, isso significa que, quando uma declaração SQL é replicada em um servidor de replica, os mesmos valores são usados para a coluna de autoincremento como no servidor de origem. O resultado da execução de múltiplas declarações `INSERT` é determinístico, e a replica reproduz os mesmos dados que no origem. Se os valores de autoincremento gerados por múltiplas declarações `INSERT` fossem intercalados, o resultado de duas declarações `INSERT` concorrentes seria não determinístico e não poderia ser propagado de forma confiável para um servidor de replicação usando a replicação baseada em declarações.

  Para esclarecer isso, considere um exemplo que usa essa tabela:

  ```sql
  CREATE TABLE t1 (
    c1 INT(11) NOT NULL AUTO_INCREMENT,
    c2 VARCHAR(10) DEFAULT NULL,
    PRIMARY KEY (c1)
  ) ENGINE=InnoDB;
  ```

  Suponha que haja duas transações em execução, cada uma inserindo linhas em uma tabela com uma coluna `AUTO_INCREMENT`. Uma transação está usando uma instrução `INSERT ... SELECT` que insere 1000 linhas, e outra está usando uma simples instrução `INSERT` que insere uma linha:

  ```sql
  Tx1: INSERT INTO t1 (c2) SELECT 1000 rows from another table ...
  Tx2: INSERT INTO t1 (c2) VALUES ('xxx');
  ```

  O `InnoDB` não pode prever antecipadamente quantos registros são recuperados da consulta `SELECT` na instrução `INSERT` no Tx1, e atribui os valores de autoincremento um de cada vez à medida que a instrução prossegue. Com um bloqueio de nível de tabela, mantido até o final da instrução, apenas uma instrução `INSERT` que faça referência à tabela `t1` pode ser executada de cada vez, e a geração de números de autoincremento por diferentes instruções não é interrompida. Os valores de autoincremento gerados pela instrução `INSERT ... SELECT` do Tx1 são consecutivos, e o valor de autoincremento (único) usado pela instrução `INSERT` no Tx2 é menor ou maior que todos os usados para o Tx1, dependendo da instrução que é executada primeiro.

  Enquanto as instruções SQL forem executadas na mesma ordem ao serem reexecutadas a partir do log binário (ao usar a replicação baseada em instruções ou em cenários de recuperação), os resultados serão os mesmos que quando Tx1 e Tx2 foram executados pela primeira vez. Assim, os bloqueios de nível de tabela mantidos até o final de uma instrução tornam as instruções `INSERT` com autoincremento seguras para uso com a replicação baseada em instruções. No entanto, esses bloqueios de nível de tabela limitam a concorrência e a escalabilidade quando várias transações estão executando instruções de inserção ao mesmo tempo.

  No exemplo anterior, se não houvesse bloqueio no nível da tabela, o valor da coluna de autoincremento usada para o `INSERT` em Tx2 dependeria exatamente de quando a instrução é executada. Se o `INSERT` de Tx2 for executado enquanto o `INSERT` de Tx1 estiver em execução (em vez de antes de começar ou depois de ser concluído), os valores específicos de autoincremento atribuídos pelas duas instruções `INSERT` serão não determinísticos e podem variar de execução para execução.

  No modo de bloqueio consecutivo, o `InnoDB` pode evitar o uso de bloqueios de nível de tabela `AUTO-INC` para declarações de "inserção simples" onde o número de linhas é conhecido antecipadamente, e ainda preservar a execução determinística e a segurança para a replicação baseada em declarações.

  Se você não estiver usando o log binário para reproduzir instruções SQL como parte da recuperação ou replicação, o modo de bloqueio entrelaçado pode ser usado para eliminar todo o uso de bloqueios `AUTO-INC` de nível de tabela para uma concorrência e desempenho ainda maiores, ao custo de permitir lacunas nos números de autoincremento atribuídos por uma instrução e, potencialmente, ter os números atribuídos por instruções executadas simultaneamente entrelaçadas.

- `innodb_autoinc_lock_mode = 1` (modo de bloqueio consecutivo)

  Este é o modo de bloqueio padrão. Nesse modo, as "inserções em lote" usam o bloqueio especial `AUTO-INC` ao nível da tabela e o mantêm até o final da instrução. Isso se aplica a todas as instruções `INSERT ... SELECT`, `REPLACE ... SELECT` e `LOAD DATA`. Apenas uma instrução que mantém o bloqueio `AUTO-INC` pode ser executada de cada vez. Se a tabela de origem da operação de inserção em lote for diferente da tabela de destino, o bloqueio `AUTO-INC` na tabela de destino é tomado após a aquisição de um bloqueio compartilhado na primeira linha selecionada da tabela de origem. Se a origem e o destino da operação de inserção em lote forem a mesma tabela, o bloqueio `AUTO-INC` é tomado após a aquisição de blocos compartilhados em todas as linhas selecionadas.

  Os “insertos simples” (para os quais o número de linhas a serem inseridas é conhecido antecipadamente) evitam os bloqueios de nível de tabela `AUTO-INC` obtendo o número necessário de valores de autoincremento sob o controle de um mutex (um bloqueio leve) que é mantido apenas durante a duração do processo de alocação, *não* até que a instrução seja concluída. Não é usado um bloqueio de nível de tabela `AUTO-INC` a menos que um bloqueio `AUTO-INC` seja mantido por outra transação. Se outra transação mantiver um bloqueio `AUTO-INC`, um “inserto simples” aguarda pelo bloqueio `AUTO-INC`, como se fosse um “inserto em massa”.

  Esse modo de bloqueio garante que, na presença de instruções `INSERT` onde o número de linhas não é conhecido antecipadamente (e onde os números de autoincremento são atribuídos à medida que a instrução avança), todos os valores de autoincremento atribuídos por qualquer instrução semelhante a `INSERT` sejam consecutivos, e as operações sejam seguras para a replicação baseada em instruções.

  Simplificando, esse modo de bloqueio melhora significativamente a escalabilidade, sendo seguro para uso com replicação baseada em declarações. Além disso, assim como no modo "tradicional", os números de autoincremento atribuídos por qualquer declaração são *consecutivos*. Não há *nenhuma mudança* na semântica em comparação com o modo "tradicional" para qualquer declaração que use autoincremento, com uma exceção importante.

  A exceção é para os “insertos em modo misto”, onde o usuário fornece valores explícitos para uma coluna `AUTO_INCREMENT` para algumas, mas não todas, as linhas em um “inserto simples” de várias linhas. Para esses insertos, o `InnoDB` aloca mais valores de autoincremento do que o número de linhas a serem inseridas. No entanto, todos os valores atribuídos automaticamente são gerados consecutivamente (e, portanto, são maiores que) o valor de autoincremento gerado pela declaração anterior mais recentemente executada. Os números “excedentes” são perdidos.

- `innodb_autoinc_lock_mode = 2` (modo de bloqueio interligado)

  Neste modo de bloqueio, nenhuma declaração semelhante ao `INSERT` usa o bloqueio `AUTO-INC` no nível da tabela, e múltiplas declarações podem ser executadas ao mesmo tempo. Este é o modo de bloqueio mais rápido e escalável, mas não é *seguro* ao usar replicação baseada em declarações ou cenários de recuperação quando as declarações SQL são regravadas a partir do log binário.

  Neste modo de bloqueio, os valores de autoincremento são garantidos como únicos e aumentam de forma monótona em todas as declarações "`INSERT`-like\`\` que estão sendo executadas simultaneamente. No entanto, como múltiplas declarações podem estar gerando números ao mesmo tempo (ou seja, a alocação de números é \*interligada\` entre as declarações), os valores gerados para as linhas inseridas por qualquer declaração dada podem não ser consecutivos.

  Se as únicas instruções que executam são "inserções simples", onde o número de linhas a serem inseridas é conhecido antecipadamente, não há lacunas nos números gerados para uma única instrução, exceto para "inserções em modo misto". No entanto, quando as "inserções em lote" são executadas, podem haver lacunas nos valores de autoincremento atribuídos por qualquer instrução dada.

##### Implicações do uso do modo de bloqueio AUTO_INCREMENT do InnoDB

- Usando o autoincremento com replicação

  Se você estiver usando a replicação baseada em declarações, defina `innodb_autoinc_lock_mode` para 0 ou 1 e use o mesmo valor na fonte e nas suas réplicas. Os valores de autoincremento não são garantidos para serem os mesmos nas réplicas e na fonte se você usar `innodb_autoinc_lock_mode` = 2 (“interleaved”) ou configurações onde a fonte e as réplicas não usam o mesmo modo de bloqueio.

  Se você estiver usando replicação baseada em linhas ou de formato misto, todos os modos de bloqueio de autoincremento são seguros, pois a replicação baseada em linhas não é sensível à ordem de execução das instruções SQL (e o formato misto usa replicação baseada em linhas para quaisquer instruções que sejam inseguras para a replicação baseada em instruções).

- Valores de autoincremento “perdidos” e lacunas na sequência

  Em todos os modos de bloqueio (0, 1 e 2), se uma transação que gerou valores de autoincremento for revertida, esses valores de autoincremento são “perdidos”. Uma vez que um valor é gerado para uma coluna de autoincremento, ele não pode ser revertido, independentemente de a instrução “`INSERT`-like`” ser concluída ou não, e independentemente de a transação contendo ser revertida ou não. Esses valores perdidos não são reutilizados. Assim, pode haver lacunas nos valores armazenados em uma coluna `AUTO_INCREMENT\` de uma tabela.

- Especificar NULL ou 0 para a coluna `AUTO_INCREMENT`

  Em todos os modos de bloqueio (0, 1 e 2), se um usuário especificar NULL ou 0 para a coluna `AUTO_INCREMENT` em uma `INSERT`, o `InnoDB` trata a linha como se o valor não tivesse sido especificado e gera um novo valor para ela.

- Atribuir um valor negativo à coluna `AUTO_INCREMENT`

  Em todos os modos de bloqueio (0, 1 e 2), o comportamento do mecanismo de autoincremento é indefinido se você atribuir um valor negativo à coluna `AUTO_INCREMENT`.

- Se o valor `AUTO_INCREMENT` ficar maior que o máximo inteiro para o tipo de inteiro especificado

  Em todos os modos de bloqueio (0, 1 e 2), o comportamento do mecanismo de autoincremento é indefinido se o valor se tornar maior que o inteiro máximo que pode ser armazenado no tipo de inteiro especificado.

- Lacunas nos valores de autoincremento para “inserções em lote”

  Com `innodb_autoinc_lock_mode` definido como 0 (“tradicional”) ou 1 (“consecutivo”), os valores de autoincremento gerados por qualquer declaração são consecutivos, sem lacunas, porque o bloqueio `AUTO-INC` de nível de tabela é mantido até o final da declaração, e apenas uma declaração desse tipo pode ser executada de cada vez.

  Com `innodb_autoinc_lock_mode` definido como 2 (“interleaved”), pode haver lacunas nos valores de autoincremento gerados por “inserções em lote”, mas apenas se houver instruções “`INSERT`-like” sendo executadas simultaneamente.

  Para os modos de bloqueio 1 ou 2, podem ocorrer lacunas entre as declarações sucessivas, pois, para inserções em massa, o número exato de valores de autoincremento necessários por cada declaração pode não ser conhecido e a superestimação é possível.

- Valores de autoincremento atribuídos por "inserções em modo misto"

  Considere um "inserto em modo misto", onde um "inserto simples" especifica o valor de autoincremento para algumas (mas não todas) das linhas resultantes. Tal declaração se comporta de maneira diferente nos modos de bloqueio 0, 1 e 2. Por exemplo, suponha que `c1` seja uma coluna `AUTO_INCREMENT` da tabela `t1`, e que o número de sequência gerado automaticamente mais recente seja 100.

  ```sql
  mysql> CREATE TABLE t1 (
      -> c1 INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      -> c2 CHAR(1)
      -> ) ENGINE = INNODB;
  ```

  Agora, considere a seguinte declaração de "inserção em modo misto":

  ```sql
  mysql> INSERT INTO t1 (c1,c2) VALUES (1,'a'), (NULL,'b'), (5,'c'), (NULL,'d');
  ```

  Com `innodb_autoinc_lock_mode` definido como 0 (“tradicional”), os quatro novos registros são:

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

  O próximo valor de autoincremento disponível é 103 porque os valores de autoincremento são alocados um de cada vez, não todos de uma vez no início da execução da instrução. Esse resultado é verdadeiro, independentemente de haver ou não instruções "`INSERT`-like" (de qualquer tipo) sendo executadas simultaneamente.

  Com `innodb_autoinc_lock_mode` definido como 1 (“consecutivo”), as quatro novas linhas também são:

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

  No entanto, neste caso, o próximo valor de autoincremento disponível é 105, e não 103, porque quatro valores de autoincremento são alocados no momento em que a instrução é processada, mas apenas dois são usados. Esse resultado é verdadeiro, independentemente de haver ou não instruções “`INSERT`-like\`” (de qualquer tipo) sendo executadas simultaneamente.

  Com `innodb_autoinc_lock_mode` definido como 2 (“interleaved”), os quatro novos registros são:

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

  Os valores de *`x`* e *`y`* são únicos e maiores do que quaisquer linhas geradas anteriormente. No entanto, os valores específicos de *`x`* e *`y`* dependem do número de valores de autoincremento gerados ao executar instruções simultaneamente.

  Por fim, considere a seguinte declaração, emitida quando o número de sequência gerado mais recentemente é 100:

  ```sql
  mysql> INSERT INTO t1 (c1,c2) VALUES (1,'a'), (NULL,'b'), (101,'c'), (NULL,'d');
  ```

  Com qualquer configuração do `innodb_autoinc_lock_mode`, essa declaração gera um erro de chave duplicada 23000 (`Não é possível escrever; chave duplicada na tabela`) porque o valor 101 é alocado para a linha `(NULL, 'b')` e a inserção da linha `(101, 'c')` falha.

- Modificando os valores da coluna `AUTO_INCREMENT` no meio de uma sequência de instruções `INSERT`

  Em todos os modos de bloqueio (0, 1 e 2), modificar o valor de uma coluna `AUTO_INCREMENT` no meio de uma sequência de instruções `INSERT` pode levar a erros de “Entrada duplicada”. Por exemplo, se você executar uma operação `UPDATE` que altera o valor de uma coluna `AUTO_INCREMENT` para um valor maior que o valor máximo atual de autoincremento, operações `INSERT` subsequentes que não especificam um valor de autoincremento não utilizado podem encontrar erros de “Entrada duplicada”. Esse comportamento é demonstrado no exemplo a seguir.

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

##### Inicialização do contador de AUTO_INCREMENT do InnoDB

Esta seção descreve como o `InnoDB` inicializa os contadores `AUTO_INCREMENT`.

Se você especificar uma coluna `AUTO_INCREMENT` para uma tabela `InnoDB`, o identificador da tabela no dicionário de dados `InnoDB` contém um contador especial chamado contador de autoincremento, que é usado para atribuir novos valores à coluna. Esse contador é armazenado apenas na memória principal, não no disco.

Para inicializar um contador de autoincremento após o reinício do servidor, o `InnoDB` executa o equivalente à seguinte instrução na primeira inserção em uma tabela que contém uma coluna `AUTO_INCREMENT`.

```sql
SELECT MAX(ai_col) FROM table_name FOR UPDATE;
```

O `InnoDB` incrementa o valor recuperado pela instrução e atribui-o à coluna e ao contador de autoincremento da tabela. Por padrão, o valor é incrementado em

1. Essa configuração padrão pode ser substituída pela configuração `auto_increment_increment`.

Se a tabela estiver vazia, o `InnoDB` usa o valor `1`. Esse padrão pode ser substituído pela configuração `auto_increment_offset`.

Se uma instrução `SHOW TABLE STATUS` examinar a tabela antes que o contador de autoincremento seja inicializado, o `InnoDB` inicializa, mas não incrementa o valor. O valor é armazenado para uso em inserções posteriores. Essa inicialização usa uma leitura de bloqueio exclusivo normal na tabela e o bloqueio dura até o final da transação. O `InnoDB` segue o mesmo procedimento para inicializar o contador de autoincremento para uma tabela recém-criada.

Depois que o contador de autoincremento foi inicializado, se você não especificar explicitamente um valor para uma coluna `AUTO_INCREMENT`, o `InnoDB` incrementa o contador e atribui o novo valor à coluna. Se você inserir uma linha que especifique explicitamente o valor da coluna e o valor for maior que o valor atual do contador, o contador é definido para o valor da coluna especificado.

O `InnoDB` usa o contador de incremento automático de memória enquanto o servidor estiver em execução. Quando o servidor é desligado e reiniciado, o `InnoDB` reinicia o contador para cada tabela na primeira `INSERT` na tabela, conforme descrito anteriormente.

A reinicialização do servidor também cancela o efeito da opção `AUTO_INCREMENT = N` nas instruções `CREATE TABLE` e `ALTER TABLE`, que você pode usar com tabelas `InnoDB` para definir o valor inicial do contador ou alterar o valor atual do contador.

##### Notas

- Quando uma coluna inteira `AUTO_INCREMENT` esgota seus valores, uma operação de `INSERT` subsequente retorna um erro de chave duplicada. Esse é o comportamento geral do MySQL.

- Quando você reiniciar o servidor MySQL, o `InnoDB` pode reutilizar um valor antigo que foi gerado para uma coluna `AUTO_INCREMENT`, mas nunca armazenado (ou seja, um valor que foi gerado durante uma transação antiga que foi revertida).
