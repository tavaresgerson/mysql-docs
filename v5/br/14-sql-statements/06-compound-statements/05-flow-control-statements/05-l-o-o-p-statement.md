#### 13.6.5.5 Instrução LOOP

```sql
[begin_label:] LOOP
    statement_list
END LOOP [end_label]
```

A instrução [`LOOP`](loop.html "13.6.5.5 LOOP Statement") implementa uma construção de loop simples, permitindo a execução repetida da lista de Statement, que consiste em um ou mais Statements, cada um terminado por um delimitador de Statement de ponto e vírgula (`;`). Os Statements dentro do loop são repetidos até que o loop seja terminado. Geralmente, isso é realizado com uma instrução [`LEAVE`](leave.html "13.6.5.4 LEAVE Statement"). Dentro de uma Stored Function, [`RETURN`](return.html "13.6.5.7 RETURN Statement") também pode ser usado, o que encerra a Function completamente.

Não incluir uma instrução de terminação de loop resulta em um loop infinito.

Uma instrução [`LOOP`](loop.html "13.6.5.5 LOOP Statement") pode ser rotulada. Para as regras relativas ao uso de rótulos, consulte a [Seção 13.6.2, “Statement Labels”](statement-labels.html "13.6.2 Statement Labels").

Exemplo:

```sql
CREATE PROCEDURE doiterate(p1 INT)
BEGIN
  label1: LOOP
    SET p1 = p1 + 1;
    IF p1 < 10 THEN
      ITERATE label1;
    END IF;
    LEAVE label1;
  END LOOP label1;
  SET @x = p1;
END;
```