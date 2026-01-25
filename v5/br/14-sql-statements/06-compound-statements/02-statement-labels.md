### 13.6.2 Rótulos de Statement

```sql
[begin_label:] BEGIN
    [statement_list]
END [end_label]

[begin_label:] LOOP
    statement_list
END LOOP [end_label]

[begin_label:] REPEAT
    statement_list
UNTIL search_condition
END REPEAT [end_label]

[begin_label:] WHILE search_condition DO
    statement_list
END WHILE [end_label]
```

Rótulos são permitidos para blocos [`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement") e para os statements [`LOOP`](loop.html "13.6.5.5 LOOP Statement"), [`REPEAT`](repeat.html "13.6.5.6 REPEAT Statement") e [`WHILE`](while.html "13.6.5.8 WHILE Statement"). O uso de rótulos para esses statements segue as seguintes regras:

* *`begin_label`* deve ser seguido por dois pontos.

* *`begin_label`* pode ser fornecido sem *`end_label`*. Se *`end_label`* estiver presente, ele deve ser o mesmo que *`begin_label`*.

* *`end_label`* não pode ser fornecido sem *`begin_label`*.

* Rótulos no mesmo nível de aninhamento devem ser distintos.
* Rótulos podem ter até 16 caracteres de comprimento.

Para referenciar um rótulo dentro da construção rotulada, use um statement [`ITERATE`](iterate.html "13.6.5.3 ITERATE Statement") ou [`LEAVE`](leave.html "13.6.5.4 LEAVE Statement"). O exemplo a seguir usa esses statements para continuar a iteração ou encerrar o loop:

```sql
CREATE PROCEDURE doiterate(p1 INT)
BEGIN
  label1: LOOP
    SET p1 = p1 + 1;
    IF p1 < 10 THEN ITERATE label1; END IF;
    LEAVE label1;
  END LOOP label1;
END;
```

O escopo de um rótulo de bloco não inclui o código para os handlers declarados dentro do bloco. Para detalhes, consulte [Section 13.6.7.2, “DECLARE ... HANDLER Statement”](declare-handler.html "13.6.7.2 DECLARE ... HANDLER Statement").