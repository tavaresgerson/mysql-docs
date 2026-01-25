#### 13.6.5.8 WHILE Statement

```sql
[begin_label:] WHILE search_condition DO
    statement_list
END WHILE [end_label]
```

A lista de statements dentro de um statement [`WHILE`](while.html "13.6.5.8 WHILE Statement") é repetida enquanto a expressão *`search_condition`* for verdadeira. A *`statement_list`* consiste em um ou mais SQL statements, cada um terminado por um ponto e vírgula (`;`), que é o delimitador de statement.

Um statement [`WHILE`](while.html "13.6.5.8 WHILE Statement") pode ser rotulado. Para as regras relativas ao uso de labels, consulte a [Seção 13.6.2, “Statement Labels”](statement-labels.html "13.6.2 Statement Labels").

Exemplo:

```sql
CREATE PROCEDURE dowhile()
BEGIN
  DECLARE v1 INT DEFAULT 5;

  WHILE v1 > 0 DO
    ...
    SET v1 = v1 - 1;
  END WHILE;
END;
```