## 23.1 Definindo Programas Armazenados

Cada programa armazenado contém um corpo que consiste em uma declaração SQL. Essa declaração pode ser uma declaração composta composta por várias declarações separadas por caracteres ponto e vírgula (`;`) . Por exemplo, o seguinte procedimento armazenado tem um corpo composto por um bloco `BEGIN ... END` que contém uma declaração `SET` e um loop `REPEAT` que, por sua vez, contém outra declaração `SET`:

```sql
CREATE PROCEDURE dorepeat(p1 INT)
BEGIN
  SET @x = 0;
  REPEAT SET @x = @x + 1; UNTIL @x > p1 END REPEAT;
END;
```

Se você usar o programa cliente **mysql** para definir um programa armazenado contendo caracteres ponto e vírgula, surge um problema. Por padrão, o próprio **mysql** reconhece o ponto e vírgula como um delimitador de declaração, então você deve redefinir o delimitador temporariamente para fazer com que o **mysql** transmita toda a definição do programa armazenado ao servidor.

Para redefinir o delimitador do **mysql**, use o comando `delimiter`. O exemplo a seguir mostra como fazer isso para o procedimento `dorepeat()` que foi mostrado anteriormente. O delimitador é alterado para `//` para permitir que toda a definição seja passada para o servidor como uma única declaração, e então restaurado para `;` antes de invocar o procedimento. Isso permite que o delimitador `;` usado no corpo do procedimento seja passado para o servidor em vez de ser interpretado pelo próprio **mysql**.

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

Você pode redefinir o delimitador para uma string diferente de `//`, e o delimitador pode consistir em um único caractere ou em vários caracteres. Você deve evitar o uso do caractere barra invertida (`\`) porque esse é o caractere de escape para o MySQL.

O que se segue é um exemplo de uma função que recebe um parâmetro, realiza uma operação usando uma função SQL e retorna o resultado. Neste caso, não é necessário usar `delimiter`, porque a definição da função não contém delimitadores internos de declaração `;`:

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