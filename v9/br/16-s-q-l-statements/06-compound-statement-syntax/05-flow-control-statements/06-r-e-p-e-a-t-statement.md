#### 15.6.5.6 Declaração `REPEAT`

```
[begin_label:] REPEAT
    statement_list
UNTIL search_condition
END REPEAT [end_label]
```

A lista de declarações dentro de uma declaração `REPEAT` é repetida até que a expressão ``search_condition`` seja verdadeira. Assim, uma `REPEAT` sempre entra no loop pelo menos uma vez. *`statement_list`* consiste em uma ou mais declarações, cada uma terminada por um delimitador de declaração ponto-e-vírgula (`;`).

A declaração `REPEAT` pode ser rotulada. Para as regras sobre o uso de rótulos, consulte a Seção 15.6.2, “Rotulagem de Declarações”.

Exemplo:

```
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