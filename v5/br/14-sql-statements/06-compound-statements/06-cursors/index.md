### 13.6.6 Cursors

[13.6.6.1 Instrução CLOSE de Cursor](close.html)

[13.6.6.2 Instrução DECLARE de Cursor](declare-cursor.html)

[13.6.6.3 Instrução FETCH de Cursor](fetch.html)

[13.6.6.4 Instrução OPEN de Cursor](open.html)

[13.6.6.5 Restrições em Cursors do Lado do Servidor](cursor-restrictions.html)

O MySQL suporta cursors dentro de stored programs. A sintaxe é a mesma utilizada no SQL embarcado. Cursors possuem as seguintes propriedades:

* Asensitive: O servidor pode ou não fazer uma cópia de sua tabela de resultado (result table).
* Read only: Não é atualizável (not updatable).
* Nonscrollable: Pode ser percorrido apenas em uma direção e não pode pular linhas.

As declarações de Cursor devem aparecer antes das declarações de handler e depois das declarações de variável e condição.

Exemplo:

```sql
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