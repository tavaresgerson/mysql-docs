### 15.6.6 Cursor

15.6.6.1 Declaração de Cursor CLOSE

15.6.6.2 Declaração de Cursor DECLARE

15.6.6.3 Declaração de Cursor FETCH

15.6.6.4 Declaração de Cursor OPEN

15.6.6.5 Restrições para Cursors no Lado do Servidor

O MySQL suporta cursors dentro de programas armazenados. A sintaxe é a mesma da SQL embutida. Os cursors têm essas propriedades:

* Asensitive: O servidor pode ou não fazer uma cópia de sua tabela de resultados

* Apenas leitura: Não é atualizável
* Não rolagem: Pode ser percorrido apenas em uma direção e não pode pular linhas

As declarações de cursor devem aparecer antes das declarações de manipulador e depois das declarações de variáveis e condições.

Exemplo:

```
CREATE PROCEDURE curdemo()
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE a CHAR(16);
  DECLARE b, c INT;
  DECLARE cur1 CURSOR FOR SELECT id,data FROM test.t1;
  DECLARE cur2 CURSOR FOR SELECT i FROM test.t2;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  OPEN cur1;
  OPEN cur2;

  read_loop: LOOP
    FETCH cur1 INTO a, b;
    FETCH cur2 INTO c;
    IF done THEN
      LEAVE read_loop;
    END IF;
    IF b < c THEN
      INSERT INTO test.t3 VALUES (a,b);
    ELSE
      INSERT INTO test.t3 VALUES (a,c);
    END IF;
  END LOOP;

  CLOSE cur1;
  CLOSE cur2;
END;
```