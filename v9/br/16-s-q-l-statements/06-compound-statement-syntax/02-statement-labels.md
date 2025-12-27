### 15.6.2 Etiquetas de Blocos

```
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

Etiquetas são permitidas para blocos `BEGIN ... END` e para as instruções `LOOP`, `REPEAT` e `WHILE`. O uso de etiquetas para essas instruções segue estas regras:

* *`begin_label`* deve ser seguido por um colon.

* *`begin_label`* pode ser dado sem *`end_label`*. Se *`end_label`* estiver presente, ele deve ser o mesmo que *`begin_label`*.

* *`end_label`* não pode ser dado sem *`begin_label`*.

* Etiquetas no mesmo nível de indentação devem ser distintas.
* As etiquetas podem ter até 16 caracteres.

Para referenciar uma etiqueta dentro da estrutura etiquetada, use uma instrução `ITERATE` ou `LEAVE`. O exemplo a seguir usa essas instruções para continuar a iterar ou terminar o loop:

```
CREATE PROCEDURE doiterate(p1 INT)
BEGIN
  label1: LOOP
    SET p1 = p1 + 1;
    IF p1 < 10 THEN ITERATE label1; END IF;
    LEAVE label1;
  END LOOP label1;
END;
```

O escopo de uma etiqueta de bloco não inclui o código para manipuladores declarados dentro do bloco. Para detalhes, consulte a Seção 15.6.7.2, “Instrução DECLARE ... HANDLER”.