## 23.3 Usando gatilhos

Um gatilho é um objeto de banco de dados com nome que está associado a uma tabela e que é ativado quando um evento específico ocorre para a tabela. Alguns usos dos gatilhos são realizar verificações de valores a serem inseridos em uma tabela ou realizar cálculos em valores envolvidos em uma atualização.

Um gatilho é definido para ser ativado quando uma declaração insere, atualiza ou exclui linhas na tabela associada. Essas operações de linha são eventos de gatilho. Por exemplo, as linhas podem ser inseridas por declarações `INSERT` ou `LOAD DATA`, e um gatilho de inserção é ativado para cada linha inserida. Um gatilho pode ser configurado para ser ativado antes ou depois do evento do gatilho. Por exemplo, você pode ter um gatilho ativado antes de cada linha que é inserida em uma tabela ou depois de cada linha que é atualizada.

Importante

Os gatilhos do MySQL são ativados apenas para alterações feitas em tabelas por meio de instruções SQL. Isso inclui alterações em tabelas básicas que sustentam vistas atualizáveis. Os gatilhos não são ativados para alterações em tabelas feitas por APIs que não transmitem instruções SQL para o servidor MySQL. Isso significa que os gatilhos não são ativados por atualizações feitas usando a API `NDB`.

Os gatilhos não são ativados por alterações nas tabelas `INFORMATION_SCHEMA` ou `performance_schema`. Essas tabelas são, na verdade, visualizações e os gatilhos não são permitidos em visualizações.

As seções a seguir descrevem a sintaxe para criar e descartar gatilhos, mostram alguns exemplos de como usá-los e indicam como obter metadados de gatilho.

### Recursos adicionais

* Você pode achar os [Fóruns de Usuários do MySQL][(https://forums.mysql.com/list.php?20)] úteis ao trabalhar com gatilhos.

* Para respostas a perguntas comumente feitas sobre gatilhos no MySQL, consulte a Seção A.5, “Perguntas frequentes do MySQL 5.7: gatilhos”.

* Há algumas restrições sobre o uso de gatilhos; veja a Seção 23.8, “Restrições sobre programas armazenados”.

* O registro binário para gatilhos ocorre conforme descrito na Seção 23.7, “Registro binário de programas armazenados”.

### 23.3.1 Sintaxe e exemplos de gatilho

Para criar um gatilho ou descartar um gatilho, use a declaração `CREATE TRIGGER` ou `DROP TRIGGER`, descrita na Seção 13.1.20, "Declaração CREATE TRIGGER", e na Seção 13.1.31, "Declaração DROP TRIGGER".

Aqui está um exemplo simples que associa um gatilho a uma tabela, para ser ativado para operações de `INSERT`. O gatilho atua como um acumulador, somando os valores inseridos em uma das colunas da tabela.

```sql
mysql> CREATE TABLE account (acct_num INT, amount DECIMAL(10,2));
Query OK, 0 rows affected (0.03 sec)

mysql> CREATE TRIGGER ins_sum BEFORE INSERT ON account
       FOR EACH ROW SET @sum = @sum + NEW.amount;
Query OK, 0 rows affected (0.01 sec)
```

A declaração `CREATE TRIGGER` cria um gatilho denominado `ins_sum` que está associado à tabela `account`. Ela também inclui cláusulas que especificam o tempo da ação do gatilho, o evento de ativação e o que fazer quando o gatilho é ativado:

* A palavra-chave `BEFORE` indica o tempo de ação do gatilho. Neste caso, o gatilho é ativado antes de cada linha inserida na tabela. A outra palavra-chave permitida aqui é `AFTER`.

* A palavra-chave `INSERT` indica o evento desencadeador, ou seja, o tipo de operação que ativa o gatilho. No exemplo, as operações `INSERT` causam a ativação do gatilho. Você também pode criar gatilhos para as operações `DELETE` e `UPDATE`.

* A declaração após `FOR EACH ROW` define o corpo do gatilho; ou seja, a declaração a ser executada cada vez que o gatilho é ativado, o que ocorre uma vez para cada linha afetada pelo evento desencadeador. No exemplo, o corpo do gatilho é um simples `SET` que acumula em uma variável de usuário os valores inseridos na coluna `amount`. A declaração se refere à coluna como `NEW.amount`, o que significa “o valor da coluna `amount` a ser inserido na nova linha.”

Para usar o gatilho, defina a variável acumuladora como zero, execute uma instrução `INSERT` e, em seguida, veja qual valor a variável tem depois disso:

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

Neste caso, o valor de `@sum` após a execução da declaração `INSERT` é `14.98 + 1937.50 - 100`, ou `1852.48`.

Para destruir o gatilho, use uma declaração `DROP TRIGGER`. Você deve especificar o nome do esquema se o gatilho não estiver no esquema padrão:

```sql
mysql> DROP TRIGGER test.ins_sum;
```

Se você excluir uma tabela, todos os gatilhos da tabela também serão excluídos.

Os nomes dos gatilhos existem no espaço de nome do esquema, o que significa que todos os gatilhos devem ter nomes únicos dentro de um esquema. Os gatilhos em diferentes esquemas podem ter o mesmo nome.

A partir do MySQL 5.7.2, é possível definir múltiplos gatilhos para uma tabela específica que tenham o mesmo evento de gatilho e tempo de ação. Por exemplo, você pode ter dois gatilhos `BEFORE UPDATE` para uma tabela. Por padrão, os gatilhos que têm o mesmo evento de gatilho e tempo de ação são ativados na ordem em que foram criados. Para afetar a ordem do gatilho, especifique uma cláusula após `FOR EACH ROW` que indique `FOLLOWS` ou `PRECEDES` e o nome de um gatilho existente que também tenha o mesmo evento de gatilho e tempo de ação. Com `FOLLOWS`, o novo gatilho é ativado após o gatilho existente. Com `PRECEDES`, o novo gatilho é ativado antes do gatilho existente.

Por exemplo, a seguinte definição de gatilho define outro gatilho `BEFORE INSERT` para a tabela `account`:

```sql
mysql> CREATE TRIGGER ins_transaction BEFORE INSERT ON account
       FOR EACH ROW PRECEDES ins_sum
       SET
       @deposits = @deposits + IF(NEW.amount>0,NEW.amount,0),
       @withdrawals = @withdrawals + IF(NEW.amount<0,-NEW.amount,0);
Query OK, 0 rows affected (0.01 sec)
```

Esse gatilho, `ins_transaction`, é semelhante ao `ins_sum`, mas acumula depósitos e retiradas separadamente. Ele possui uma cláusula `PRECEDES` que faz com que ele se ative antes de `ins_sum`; sem essa cláusula, ele se ativaria após `ins_sum`, pois é criado após `ins_sum`.

Antes do MySQL 5.7.2, não pode haver múltiplos gatilhos para uma determinada tabela que tenham o mesmo evento de gatilho e hora de ação. Por exemplo, não pode haver dois gatilhos `BEFORE UPDATE` para uma tabela. Para contornar isso, você pode definir um gatilho que execute múltiplos comandos usando a construção de comando composto `BEGIN ... END` após `FOR EACH ROW`. (Um exemplo aparece mais tarde nesta seção.)

Dentro do corpo do gatilho, as palavras-chave `OLD` e `NEW` permitem que você acesse as colunas nas linhas afetadas por um gatilho. `OLD` e `NEW` são extensões do MySQL para gatilhos; elas não são sensíveis ao caso.

Em um gatilho `INSERT`, apenas `NEW.col_name` pode ser usado; não há linha antiga. Em um gatilho `DELETE`, apenas `OLD.col_name` pode ser usado; não há nova linha. Em um gatilho `UPDATE`, você pode usar `OLD.col_name` para referir-se às colunas de uma linha antes que ela seja atualizada e `NEW.col_name` para referir-se às colunas da linha após ela ser atualizada.

Uma coluna com o nome `OLD` é somente leitura. Você pode referenciá-la (se tiver o privilégio `SELECT`) , mas não modificá-la. Você pode referenciar uma coluna com o nome `NEW` se tiver o privilégio `SELECT` para ela. Em um gatilho `BEFORE`, você também pode alterar seu valor com `SET NEW.col_name = value` se tiver o privilégio `UPDATE` para ele. Isso significa que você pode usar um gatilho para modificar os valores a serem inseridos em uma nova linha ou usados para atualizar uma linha. (Tal declaração `SET` não tem efeito em um gatilho `AFTER` porque a alteração da linha já ocorreu.)

Em um gatilho `BEFORE`, o valor `NEW` para uma coluna `AUTO_INCREMENT` é 0, não o número de sequência que é gerado automaticamente quando a nova linha é inserida.

Usando o construtor `BEGIN ... END`, você pode definir um gatilho que executa múltiplas instruções. Dentro do bloco `BEGIN`, você também pode usar outras sintaxes permitidas em rotinas armazenadas, como condicionais e loops. No entanto, assim como para rotinas armazenadas, se você usar o programa **mysql** para definir um gatilho que executa múltiplas instruções, é necessário redefinir o delimitador da instrução **mysql** para que você possa usar o delimitador da instrução `;` dentro da definição do gatilho. O exemplo a seguir ilustra esses pontos. Ele define um gatilho `UPDATE` que verifica o novo valor a ser usado para atualizar cada linha e modifica o valor para estar dentro do intervalo de 0 a 100. Isso deve ser um gatilho [[`BEFORE`] porque o valor deve ser verificado antes de ser usado para atualizar a linha:

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

Pode ser mais fácil definir um procedimento armazenado separadamente e, em seguida, invocá-lo a partir do gatilho usando uma simples declaração `CALL`. Isso também é vantajoso se você quiser executar o mesmo código dentro de vários gatilhos.

Há limitações sobre o que pode aparecer em declarações que um gatilho executa quando ativado:

* O gatilho não pode usar a declaração `CALL` para invocar procedimentos armazenados que retornam dados ao cliente ou que utilizam SQL dinâmico. (Os procedimentos armazenados são permitidos para retornar dados ao gatilho através dos parâmetros `OUT` ou `INOUT`.)

* O gatilho não pode usar declarações que explicitamente ou implicitamente comecem ou terminem uma transação, como `START TRANSACTION`, `COMMIT` ou `ROLLBACK`. (`ROLLBACK to SAVEPOINT` é permitido porque não termina uma transação).

Veja também a Seção 23.8, “Restrições sobre programas armazenados”.

O MySQL lida com erros durante a execução de gatilho da seguinte forma:

* Se um gatilho `BEFORE` falhar, a operação na linha correspondente não é realizada.

* Um gatilho `BEFORE` é ativado pela *tentativa* de inserir ou modificar a linha, independentemente de a tentativa ter sucesso posteriormente.

* Um gatilho `AFTER` é executado apenas se houver algum gatilho `BEFORE` e a operação de linha for executada com sucesso.

* Um erro durante um `BEFORE` ou `AFTER` resulta no fracasso de toda a declaração que causou a invocação do gatilho.

* Para tabelas transacionais, o fracasso de uma declaração deve causar o retorno às condições anteriores de todas as alterações realizadas pela declaração. O fracasso de um gatilho faz com que a declaração falhe, então o fracasso do gatilho também causa o retorno às condições anteriores. Para tabelas não transacionais, não é possível realizar esse retorno, então, embora a declaração falhe, quaisquer alterações realizadas antes do ponto do erro permanecem em vigor.

Os gatilhos podem conter referências diretas a tabelas por nome, como o gatilho denominado `testref` mostrado neste exemplo:

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

### 23.3.2 Metadados do gatilho

Para obter metadados sobre gatilhos:

* Consulte a tabela `TRIGGERS` do banco de dados `INFORMATION_SCHEMA`. Veja a Seção 24.3.29, “A tabela TRIGGERS do INFORMATION\_SCHEMA”.

* Utilize a declaração `SHOW CREATE TRIGGER`. Veja a Seção 13.7.5.11, “Declaração SHOW CREATE TRIGGER”.

* Utilize a declaração `SHOW TRIGGERS`. Veja a Seção 13.7.5.38, “Declaração SHOW TRIGGERS”.