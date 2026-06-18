### 23.3.1 Sintaxe e Exemplos de Trigger

Para criar um Trigger ou eliminar um Trigger, use as instruções `CREATE TRIGGER` ou `DROP TRIGGER`, descritas na Seção 13.1.20, “Instrução CREATE TRIGGER”, e na Seção 13.1.31, “Instrução DROP TRIGGER”.

Aqui está um exemplo simples que associa um Trigger a uma tabela, para ser ativado em operações de `INSERT`. O Trigger atua como um acumulador, somando os valores inseridos em uma das colunas da tabela.

```sql
mysql> CREATE TABLE account (acct_num INT, amount DECIMAL(10,2));
Query OK, 0 rows affected (0.03 sec)

mysql> CREATE TRIGGER ins_sum BEFORE INSERT ON account
       FOR EACH ROW SET @sum = @sum + NEW.amount;
Query OK, 0 rows affected (0.01 sec)
```

A instrução `CREATE TRIGGER` cria um Trigger nomeado `ins_sum` que está associado à tabela `account`. Ela também inclui cláusulas que especificam o tempo de ação do Trigger, o evento de acionamento e o que fazer quando o Trigger for ativado:

* A palavra-chave `BEFORE` indica o tempo de ação do Trigger. Neste caso, o Trigger é ativado antes de cada linha inserida na tabela. A outra palavra-chave permitida aqui é `AFTER`.

* A palavra-chave `INSERT` indica o evento do Trigger; isto é, o tipo de operação que ativa o Trigger. No exemplo, operações de `INSERT` causam a ativação do Trigger. Você também pode criar Triggers para operações de `DELETE` e `UPDATE`.

* A instrução após `FOR EACH ROW` define o corpo do Trigger; isto é, a instrução a ser executada toda vez que o Trigger for ativado, o que ocorre uma vez para cada linha afetada pelo evento de acionamento. No exemplo, o corpo do Trigger é um simples `SET` que acumula em uma variável de usuário os valores inseridos na coluna `amount`. A instrução se refere à coluna como `NEW.amount`, o que significa "o valor da coluna `amount` a ser inserido na nova linha".

Para usar o Trigger, defina a variável acumuladora como zero, execute uma instrução `INSERT` e, em seguida, verifique qual valor a variável terá depois:

```sql
mysql> SET @sum = 0;
mysql> INSERT INTO account VALUES(137,14.98),(141,1937.50),(97,-100.00);
mysql> SELECT @sum AS 'Total amount inserted';
+-----------------------+
| Total amount inserted |
+-----------------------+
|               1852.48 |
+-----------------------+
```

Neste caso, o valor de `@sum` após a execução da instrução `INSERT` é `14.98 + 1937.50 - 100`, ou `1852.48`.

Para destruir o Trigger, use uma instrução `DROP TRIGGER`. Você deve especificar o nome do schema se o Trigger não estiver no schema padrão:

```sql
mysql> DROP TRIGGER test.ins_sum;
```

Se você eliminar uma tabela, quaisquer Triggers para essa tabela também serão eliminados.

Nomes de Triggers existem no namespace do schema, o que significa que todos os Triggers devem ter nomes exclusivos dentro de um schema. Triggers em schemas diferentes podem ter o mesmo nome.

A partir do MySQL 5.7.2, é possível definir múltiplos Triggers para uma determinada tabela que tenham o mesmo evento de Trigger e tempo de ação. Por exemplo, você pode ter dois Triggers `BEFORE UPDATE` para uma tabela. Por padrão, Triggers que têm o mesmo evento de Trigger e tempo de ação ativam na ordem em que foram criados. Para afetar a ordem de ativação, especifique uma cláusula após `FOR EACH ROW` que indique `FOLLOWS` ou `PRECEDES` e o nome de um Trigger existente que também tenha o mesmo evento de Trigger e tempo de ação. Com `FOLLOWS`, o novo Trigger ativa após o Trigger existente. Com `PRECEDES`, o novo Trigger ativa antes do Trigger existente.

Por exemplo, a seguinte definição de Trigger define outro Trigger `BEFORE INSERT` para a tabela `account`:

```sql
mysql> CREATE TRIGGER ins_transaction BEFORE INSERT ON account
       FOR EACH ROW PRECEDES ins_sum
       SET
       @deposits = @deposits + IF(NEW.amount>0,NEW.amount,0),
       @withdrawals = @withdrawals + IF(NEW.amount<0,-NEW.amount,0);
Query OK, 0 rows affected (0.01 sec)
```

Este Trigger, `ins_transaction`, é semelhante a `ins_sum`, mas acumula depósitos e saques separadamente. Ele tem uma cláusula `PRECEDES` que faz com que ele seja ativado antes de `ins_sum`; sem essa cláusula, ele seria ativado após `ins_sum` porque foi criado depois de `ins_sum`.

Antes do MySQL 5.7.2, não pode haver múltiplos Triggers para uma determinada tabela que tenham o mesmo evento de Trigger e tempo de ação. Por exemplo, você não pode ter dois Triggers `BEFORE UPDATE` para uma tabela. Para contornar isso, você pode definir um Trigger que executa múltiplas instruções usando a construção de instrução composta `BEGIN ... END` após `FOR EACH ROW`. (Um exemplo aparece mais adiante nesta seção.)

Dentro do corpo do Trigger, as palavras-chave `OLD` e `NEW` permitem que você acesse colunas nas linhas afetadas por um Trigger. `OLD` e `NEW` são extensões MySQL para Triggers; elas não diferenciam maiúsculas de minúsculas.

Em um Trigger de `INSERT`, apenas `NEW.col_name` pode ser usado; não há linha antiga. Em um Trigger de `DELETE`, apenas `OLD.col_name` pode ser usado; não há linha nova. Em um Trigger de `UPDATE`, você pode usar `OLD.col_name` para se referir às colunas de uma linha antes de ser atualizada e `NEW.col_name` para se referir às colunas da linha após ser atualizada.

Uma coluna nomeada com `OLD` é somente leitura. Você pode se referir a ela (se tiver o privilégio `SELECT`), mas não modificá-la. Você pode se referir a uma coluna nomeada com `NEW` se tiver o privilégio `SELECT` para ela. Em um Trigger `BEFORE`, você também pode alterar seu valor com `SET NEW.col_name = value` se tiver o privilégio `UPDATE` para ela. Isso significa que você pode usar um Trigger para modificar os valores a serem inseridos em uma nova linha ou usados para atualizar uma linha. (Tal instrução `SET` não tem efeito em um Trigger `AFTER` porque a alteração da linha já ocorreu.)

Em um Trigger `BEFORE`, o valor `NEW` para uma coluna `AUTO_INCREMENT` é 0, não o número de sequência que é gerado automaticamente quando a nova linha é realmente inserida.

Ao usar a construção `BEGIN ... END`, você pode definir um Trigger que executa múltiplas instruções. Dentro do bloco `BEGIN`, você também pode usar outras sintaxes que são permitidas em stored routines (rotinas armazenadas), como condicionais e loops. No entanto, assim como para stored routines, se você usar o programa **mysql** para definir um Trigger que executa múltiplas instruções, é necessário redefinir o delimitador de instrução **mysql** para que você possa usar o delimitador de instrução `;` dentro da definição do Trigger. O exemplo a seguir ilustra esses pontos. Ele define um Trigger de `UPDATE` que verifica o novo valor a ser usado para atualizar cada linha e modifica o valor para que esteja no intervalo de 0 a 100. Isso deve ser um Trigger `BEFORE` porque o valor deve ser verificado antes de ser usado para atualizar a linha:

```sql
mysql> delimiter //
mysql> CREATE TRIGGER upd_check BEFORE UPDATE ON account
       FOR EACH ROW
       BEGIN
           IF NEW.amount < 0 THEN
               SET NEW.amount = 0;
           ELSEIF NEW.amount > 100 THEN
               SET NEW.amount = 100;
           END IF;
       END;//
mysql> delimiter ;
```

Pode ser mais fácil definir uma stored procedure separadamente e depois invocá-la a partir do Trigger usando uma simples instrução `CALL`. Isso também é vantajoso se você quiser executar o mesmo código dentro de vários Triggers.

Existem limitações sobre o que pode aparecer nas instruções que um Trigger executa quando ativado:

* O Trigger não pode usar a instrução `CALL` para invocar stored procedures que retornam dados ao cliente ou que usam SQL dinâmico. (Stored procedures são permitidas a retornar dados ao Trigger por meio de parâmetros `OUT` ou `INOUT`.)

* O Trigger não pode usar instruções que explícita ou implicitamente iniciam ou encerram uma transaction, como `START TRANSACTION`, `COMMIT` ou `ROLLBACK`. (`ROLLBACK to SAVEPOINT` é permitido porque não encerra uma transaction.).

Consulte também a Seção 23.8, “Restrições em Programas Armazenados”.

O MySQL trata erros durante a execução do Trigger da seguinte forma:

* Se um Trigger `BEFORE` falhar, a operação na linha correspondente não é executada.

* Um Trigger `BEFORE` é ativado pela *tentativa* de inserir ou modificar a linha, independentemente de a tentativa ser bem-sucedida posteriormente.

* Um Trigger `AFTER` é executado apenas se todos os Triggers `BEFORE` e a operação de linha forem executados com sucesso.

* Um erro durante um Trigger `BEFORE` ou `AFTER` resulta na falha de toda a instrução que causou a invocação do Trigger.

* Para tabelas transacionais, a falha de uma instrução deve causar o rollback de todas as alterações realizadas pela instrução. A falha de um Trigger faz com que a instrução falhe, portanto, a falha do Trigger também causa o rollback. Para tabelas não transacionais, tal rollback não pode ser feito, então, embora a instrução falhe, quaisquer alterações realizadas antes do ponto do erro permanecem em vigor.

Triggers podem conter referências diretas a tabelas por nome, como o Trigger nomeado `testref` mostrado neste exemplo:

```sql
CREATE TABLE test1(a1 INT);
CREATE TABLE test2(a2 INT);
CREATE TABLE test3(a3 INT NOT NULL AUTO_INCREMENT PRIMARY KEY);
CREATE TABLE test4(
  a4 INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  b4 INT DEFAULT 0
);

delimiter |

CREATE TRIGGER testref BEFORE INSERT ON test1
  FOR EACH ROW
  BEGIN
    INSERT INTO test2 SET a2 = NEW.a1;
    DELETE FROM test3 WHERE a3 = NEW.a1;
    UPDATE test4 SET b4 = b4 + 1 WHERE a4 = NEW.a1;
  END;
|

delimiter ;

INSERT INTO test3 (a3) VALUES
  (NULL), (NULL), (NULL), (NULL), (NULL),
  (NULL), (NULL), (NULL), (NULL), (NULL);

INSERT INTO test4 (a4) VALUES
  (0), (0), (0), (0), (0), (0), (0), (0), (0), (0);
```

Suponha que você insira os seguintes valores na tabela `test1` conforme mostrado aqui:

```sql
mysql> INSERT INTO test1 VALUES
       (1), (3), (1), (7), (1), (8), (4), (4);
Query OK, 8 rows affected (0.01 sec)
Records: 8  Duplicates: 0  Warnings: 0
```

Como resultado, as quatro tabelas contêm os seguintes dados:

```sql
mysql> SELECT * FROM test1;
+------+
| a1   |
+------+
|    1 |
|    3 |
|    1 |
|    7 |
|    1 |
|    8 |
|    4 |
|    4 |
+------+
8 rows in set (0.00 sec)

mysql> SELECT * FROM test2;
+------+
| a2   |
+------+
|    1 |
|    3 |
|    1 |
|    7 |
|    1 |
|    8 |
|    4 |
|    4 |
+------+
8 rows in set (0.00 sec)

mysql> SELECT * FROM test3;
+----+
| a3 |
+----+
|  2 |
|  5 |
|  6 |
|  9 |
| 10 |
+----+
5 rows in set (0.00 sec)

mysql> SELECT * FROM test4;
+----+------+
| a4 | b4   |
+----+------+
|  1 |    3 |
|  2 |    0 |
|  3 |    1 |
|  4 |    2 |
|  5 |    0 |
|  6 |    0 |
|  7 |    1 |
|  8 |    1 |
|  9 |    0 |
| 10 |    0 |
+----+------+
10 rows in set (0.00 sec)
```