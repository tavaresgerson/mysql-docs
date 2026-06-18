### 27.3.1 Sintaxe e exemplos de gatilho

Para criar um gatilho ou descartar um gatilho, use a instrução `CREATE TRIGGER` ou `DROP TRIGGER`, descritas na Seção 15.1.22, “Instrução CREATE TRIGGER”, e na Seção 15.1.34, “Instrução DROP TRIGGER”.

Aqui está um exemplo simples que associa um gatilho a uma tabela, para ser ativado para operações `INSERT`. O gatilho atua como um acumulador, somando os valores inseridos em uma das colunas da tabela.

```
mysql> CREATE TABLE account (acct_num INT, amount DECIMAL(10,2));
Query OK, 0 rows affected (0.03 sec)

mysql> CREATE TRIGGER ins_sum BEFORE INSERT ON account
       FOR EACH ROW SET @sum = @sum + NEW.amount;
Query OK, 0 rows affected (0.01 sec)
```

A declaração `CREATE TRIGGER` cria um gatilho chamado `ins_sum` que está associado à tabela `account`. Ela também inclui cláusulas que especificam o tempo de ação do gatilho, o evento de disparo e o que fazer quando o gatilho for ativado:

- A palavra-chave `BEFORE` indica o tempo de ação do gatilho. Neste caso, o gatilho é ativado antes de cada linha inserida na tabela. A outra palavra-chave permitida aqui é `AFTER`.

- A palavra-chave `INSERT` indica o evento de ativação, ou seja, o tipo de operação que ativa o gatilho. No exemplo, as operações `INSERT` causam a ativação do gatilho. Você também pode criar gatilhos para as operações `DELETE` e `UPDATE`.

- A declaração após `FOR EACH ROW` define o corpo do gatilho; ou seja, a declaração a ser executada sempre que o gatilho for ativado, o que ocorre uma vez para cada linha afetada pelo evento de ativação. No exemplo, o corpo do gatilho é um simples `SET` que acumula os valores inseridos na coluna `amount` em uma variável de usuário. A declaração refere-se à coluna como `NEW.amount`, o que significa “o valor da coluna `amount` a ser inserido na nova linha.”

Para usar o gatilho, defina a variável acumuladora para zero, execute uma instrução `INSERT` e, em seguida, veja qual valor a variável tem depois:

```
mysql> SET @sum = 0;
mysql> INSERT INTO account VALUES(137,14.98),(141,1937.50),(97,-100.00);
mysql> SELECT @sum AS 'Total amount inserted';
+-----------------------+
| Total amount inserted |
+-----------------------+
|               1852.48 |
+-----------------------+
```

Neste caso, o valor de `@sum` após a execução da declaração `INSERT` é `14.98 + 1937.50 - 100`, ou `1852.48`.

Para destruir o gatilho, use uma declaração `DROP TRIGGER`. Você deve especificar o nome do esquema se o gatilho não estiver no esquema padrão:

```
mysql> DROP TRIGGER test.ins_sum;
```

Se você excluir uma tabela, todos os gatilhos da tabela também serão excluídos.

Os nomes dos gatilhos existem no espaço de nome do esquema, o que significa que todos os gatilhos devem ter nomes únicos dentro de um esquema. Os gatilhos em diferentes esquemas podem ter o mesmo nome.

É possível definir múltiplos gatilhos para uma tabela que tenham o mesmo evento de gatilho e hora de ação. Por exemplo, você pode ter dois gatilhos `BEFORE UPDATE` para uma tabela. Por padrão, os gatilhos que têm o mesmo evento de gatilho e hora de ação são ativados na ordem em que foram criados. Para alterar a ordem dos gatilhos, especifique uma cláusula após `FOR EACH ROW` que indique `FOLLOWS` ou `PRECEDES` e o nome de um gatilho existente que também tenha o mesmo evento de gatilho e hora de ação. Com `FOLLOWS`, o novo gatilho é ativado após o gatilho existente. Com `PRECEDES`, o novo gatilho é ativado antes do gatilho existente.

Por exemplo, a seguinte definição de gatilho define outro gatilho `BEFORE INSERT` para a tabela `account`:

```
mysql> CREATE TRIGGER ins_transaction BEFORE INSERT ON account
       FOR EACH ROW PRECEDES ins_sum
       SET
       @deposits = @deposits + IF(NEW.amount>0,NEW.amount,0),
       @withdrawals = @withdrawals + IF(NEW.amount<0,-NEW.amount,0);
Query OK, 0 rows affected (0.01 sec)
```

Esse gatilho, `ins_transaction`, é semelhante ao `ins_sum`, mas acumula depósitos e levantamentos separadamente. Ele possui uma cláusula `PRECEDES` que faz com que ele se ative antes de `ins_sum`; sem essa cláusula, ele se ativaria após `ins_sum`, porque é criado após `ins_sum`.

Dentro do corpo do gatilho, as palavras-chave `OLD` e `NEW` permitem que você acesse as colunas nas linhas afetadas por um gatilho. `OLD` e `NEW` são extensões do MySQL para gatilhos; elas não são sensíveis ao caso.

Em um gatilho `INSERT`, apenas `NEW.col_name` pode ser usado; não há linha antiga. Em um gatilho `DELETE`, apenas `OLD.col_name` pode ser usado; não há nova linha. Em um gatilho `UPDATE`, você pode usar `OLD.col_name` para referenciar as colunas de uma linha antes que ela seja atualizada e `NEW.col_name` para referenciar as colunas da linha após ela ser atualizada.

Uma coluna com o nome `OLD` é somente de leitura. Você pode referenciá-la (se tiver o privilégio `SELECT`) , mas não modificá-la. Você pode referenciar uma coluna com o nome `NEW` se tiver o privilégio `SELECT` para ela. Em um gatilho `BEFORE`, você também pode alterar seu valor com `SET NEW.col_name = value` se tiver o privilégio `UPDATE` para ele. Isso significa que você pode usar um gatilho para modificar os valores a serem inseridos em uma nova linha ou usados para atualizar uma linha. (Tal declaração `SET` não tem efeito em um gatilho `AFTER` porque a alteração da linha já ocorreu.)

Em um gatilho `BEFORE`, o valor `NEW` para uma coluna `AUTO_INCREMENT` é 0, e não o número de sequência que é gerado automaticamente quando a nova linha é realmente inserida.

Usando o construtor `BEGIN ... END`, você pode definir um gatilho que executa múltiplas instruções. Dentro do bloco `BEGIN`, você também pode usar outras sintaxes permitidas em rotinas armazenadas, como condicionais e loops. No entanto, assim como para rotinas armazenadas, se você usar o programa **mysql** para definir um gatilho que executa múltiplas instruções, é necessário redefinir o delimitador da instrução **mysql** para que você possa usar o delimitador da instrução `;` dentro da definição do gatilho. O exemplo a seguir ilustra esses pontos. Ele define um gatilho `UPDATE` que verifica o novo valor a ser usado para atualizar cada linha e modifica o valor para estar dentro do intervalo de 0 a 100. Este deve ser um gatilho `BEFORE` porque o valor deve ser verificado antes de ser usado para atualizar a linha:

```
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

Pode ser mais fácil definir um procedimento armazenado separadamente e, em seguida, invocá-lo a partir do gatilho usando uma simples declaração `CALL`. Isso também é vantajoso se você quiser executar o mesmo código dentro de vários gatilhos.

Há limitações sobre o que pode aparecer nas declarações que um gatilho executa quando ativado:

- O gatilho não pode usar a instrução `CALL` para invocar procedimentos armazenados que retornam dados ao cliente ou que utilizam SQL dinâmico. (Os procedimentos armazenados são permitidos para retornar dados ao gatilho através dos parâmetros `OUT` ou `INOUT`.)

- O gatilho não pode usar declarações que explicitamente ou implicitamente iniciem ou terminem uma transação, como `START TRANSACTION`, `COMMIT` ou `ROLLBACK`. (`ROLLBACK to SAVEPOINT` é permitido porque não termina uma transação).

Veja também a Seção 27.8, “Restrições sobre Programas Armazenados”.

O MySQL lida com erros durante a execução de gatilhos da seguinte forma:

- Se um gatilho `BEFORE` falhar, a operação na linha correspondente não será realizada.

- Um gatilho `BEFORE` é ativado pela *tentativa* de inserir ou modificar a linha, independentemente de a tentativa ter sucesso posteriormente.

- Um gatilho `AFTER` é executado apenas se houver algum gatilho `BEFORE` e a operação de linha for executada com sucesso.

- Um erro durante um gatilho `BEFORE` ou `AFTER` resulta no fracasso de toda a declaração que causou a invocação do gatilho.

- Para tabelas transacionais, o cancelamento de uma instrução deve causar o retorno às alterações realizadas pela instrução. O cancelamento de um gatilho faz com que a instrução falhe, então o cancelamento do gatilho também causa o retorno às alterações. Para tabelas não transacionais, esse retorno não pode ser feito, então, embora a instrução falhe, quaisquer alterações realizadas antes do ponto do erro permanecem em vigor.

Os gatilhos podem conter referências diretas a tabelas por nome, como o gatilho denominado `testref` mostrado neste exemplo:

```
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

```
mysql> INSERT INTO test1 VALUES
       (1), (3), (1), (7), (1), (8), (4), (4);
Query OK, 8 rows affected (0.01 sec)
Records: 8  Duplicates: 0  Warnings: 0
```

Como resultado, as quatro tabelas contêm os seguintes dados:

```
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
