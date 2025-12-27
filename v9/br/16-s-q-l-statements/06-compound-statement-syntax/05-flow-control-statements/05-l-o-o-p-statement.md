#### 15.6.5.5 Estrutura `LOOP`

```
[begin_label:] LOOP
    statement_list
END LOOP [end_label]
```

A estrutura `LOOP` implementa uma construção de loop simples, permitindo a execução repetida da lista de instruções, que consiste em uma ou mais instruções, cada uma terminada por um delimitador de instrução ponto e vírgula (`;`). As instruções dentro do loop são repetidas até que o loop seja encerrado. Normalmente, isso é feito com uma instrução `LEAVE`. Dentro de uma função armazenada, também pode ser usado `RETURN`, que sai completamente da função.

Ignorar a inclusão de uma instrução de término de loop resulta em um loop infinito.

A estrutura `LOOP` pode ser etiquetada. Para as regras sobre o uso de etiquetas, consulte a Seção 15.6.2, “Etiqueta de Instrução”.

Exemplo:

```
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