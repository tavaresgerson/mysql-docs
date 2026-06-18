## 23.1 Definindo Stored Programs

Cada stored program contém um corpo que consiste em uma instrução SQL. Esta instrução pode ser uma instrução composta formada por várias instruções separadas por caracteres de ponto e vírgula (`;`). Por exemplo, a seguinte stored procedure tem um corpo composto por um bloco `BEGIN ... END` que contém uma instrução `SET` e um loop `REPEAT` que, por sua vez, contém outra instrução `SET`:

```sql
CREATE PROCEDURE dorepeat(p1 INT)
BEGIN
  SET @x = 0;
  REPEAT SET @x = @x + 1; UNTIL @x > p1 END REPEAT;
END;
```

Se você usar o programa cliente **mysql** para definir um stored program contendo caracteres de ponto e vírgula, surge um problema. Por padrão, o próprio **mysql** reconhece o ponto e vírgula como um statement delimiter, então você deve redefinir o delimiter temporariamente para fazer com que o **mysql** passe toda a definição do stored program para o server.

Para redefinir o delimiter do **mysql**, use o comando `delimiter`. O exemplo a seguir mostra como fazer isso para a stored procedure `dorepeat()` recém-exibida. O delimiter é alterado para `//` para permitir que toda a definição seja passada para o server como uma única instrução e, em seguida, restaurado para `;` antes de invocar a stored procedure. Isso permite que o delimiter `;` usado no corpo da stored procedure seja repassado para o server, em vez de ser interpretado pelo próprio **mysql**.

```sql
mysql> delimiter //

mysql> CREATE PROCEDURE dorepeat(p1 INT)
    -> BEGIN
    ->   SET @x = 0;
    ->   REPEAT SET @x = @x + 1; UNTIL @x > p1 END REPEAT;
    -> END
    -> //
Query OK, 0 rows affected (0.00 sec)

mysql> delimiter ;

mysql> CALL dorepeat(1000);
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @x;
+------+
| @x   |
+------+
| 1001 |
+------+
1 row in set (0.00 sec)
```

Você pode redefinir o delimiter para uma string diferente de `//`, e o delimiter pode consistir em um único caractere ou múltiplos caracteres. Você deve evitar o uso do caractere de barra invertida (`\`) porque ele é o escape character do MySQL.

O seguinte é um exemplo de uma function que recebe um parâmetro, executa uma operação usando uma SQL function e retorna o resultado. Neste caso, é desnecessário usar `delimiter` porque a definição da function não contém delimitadores de instrução internos `;`:

```sql
mysql> CREATE FUNCTION hello (s CHAR(20))
mysql> RETURNS CHAR(50) DETERMINISTIC
    -> RETURN CONCAT('Hello, ',s,'!');
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT hello('world');
+----------------+
| hello('world') |
+----------------+
| Hello, world!  |
+----------------+
1 row in set (0.00 sec)
```