#### 13.6.5.6 Instrução REPEAT

```sql
[begin_label:] REPEAT
    statement_list
UNTIL search_condition
END REPEAT [end_label]
```

A lista de instruções dentro de uma instrução [`REPEAT`](repeat.html "13.6.5.6 REPEAT Statement") é repetida até que a expressão *`search_condition`* seja verdadeira. Assim, um [`REPEAT`](repeat.html "13.6.5.6 REPEAT Statement") sempre entra no loop pelo menos uma vez. A *`statement_list`* consiste em uma ou mais instruções, cada uma terminada por um ponto e vírgula (`;`), o delimitador de instrução.

Uma instrução [`REPEAT`](repeat.html "13.6.5.6 REPEAT Statement") pode ser rotulada. Para as regras relativas ao uso de rótulos, consulte a [Seção 13.6.2, “Rótulos de Instrução”](statement-labels.html "13.6.2 Statement Labels").

Exemplo:

```sql
mysql> delimiter //

mysql> CREATE PROCEDURE dorepeat(p1 INT)
       BEGIN
         SET @x = 0;
         REPEAT
           SET @x = @x + 1;
         UNTIL @x > p1 END REPEAT;
       END
       //
Query OK, 0 rows affected (0.00 sec)

mysql> CALL dorepeat(1000)//
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @x//
+------+
| @x   |
+------+
| 1001 |
+------+
1 row in set (0.00 sec)
```