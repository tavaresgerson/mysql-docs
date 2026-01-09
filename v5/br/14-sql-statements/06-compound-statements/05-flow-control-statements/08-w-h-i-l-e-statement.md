#### 13.6.5.8 Instrução WHILE

```sql
[begin_label:] WHILE search_condition DO
    statement_list
END WHILE [end_label]
```

A lista de declarações dentro de uma instrução `WHILE é repetida enquanto a expressão *`search_condition`* for verdadeira. *`statement_list`* consiste em uma ou mais instruções SQL, cada uma terminada por um delimitador de instrução ponto-e-vírgula (`;\`).

Uma declaração `WHILE` (while.html) pode ser rotulada. Para as regras sobre o uso de rótulos, consulte Seção 13.6.2, "Rotulagem de Declarações".

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
