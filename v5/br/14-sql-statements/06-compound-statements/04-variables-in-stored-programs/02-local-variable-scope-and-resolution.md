#### 13.6.4.2 Escopo e Resolução de Variáveis Locais

O escopo de uma variável local é o bloco [`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement") dentro do qual ela é declarada. A variável pode ser referenciada em blocos aninhados dentro do bloco de declaração, exceto naqueles blocos que declaram uma variável com o mesmo nome.

Como as variáveis locais estão em escopo apenas durante a execução do *Stored Program*, referências a elas não são permitidas em *Prepared Statements* criadas dentro de um *Stored Program*. O escopo do *Prepared Statement* é a sessão atual, e não o *Stored Program*, de modo que o *statement* poderia ser executado após o término do programa, momento em que as variáveis não estariam mais em escopo. Por exemplo, `SELECT ... INTO local_var` não pode ser usado como um *Prepared Statement*. Essa restrição também se aplica a parâmetros de *Stored Procedure* e *Function*. Consulte [Section 13.5.1, “PREPARE Statement”](prepare.html "13.5.1 PREPARE Statement").

Uma variável local não deve ter o mesmo nome de uma coluna de tabela. Se um *SQL statement*, como um *statement* [`SELECT ... INTO`](select.html "13.2.9 SELECT Statement"), contiver uma referência a uma coluna e a uma variável local declarada com o mesmo nome, o MySQL atualmente interpreta a referência como o nome de uma variável. Considere a seguinte definição de *procedure*:

```sql
CREATE PROCEDURE sp1 (x VARCHAR(5))
BEGIN
  DECLARE xname VARCHAR(5) DEFAULT 'bob';
  DECLARE newname VARCHAR(5);
  DECLARE xid INT;

  SELECT xname, id INTO newname, xid
    FROM table1 WHERE xname = xname;
  SELECT newname;
END;
```

O MySQL interpreta `xname` no *statement* [`SELECT`](select.html "13.2.9 SELECT Statement") como uma referência à *variável* `xname`, em vez de à *coluna* `xname`. Consequentemente, quando a *procedure* `sp1()` é chamada, a variável `newname` retorna o valor `'bob'`, independentemente do valor da coluna `table1.xname`.

De modo semelhante, a definição de *Cursor* na seguinte *procedure* contém um *statement* [`SELECT`](select.html "13.2.9 SELECT Statement") que referencia `xname`. O MySQL interpreta isso como uma referência à variável desse nome, em vez de uma referência a coluna.

```sql
CREATE PROCEDURE sp2 (x VARCHAR(5))
BEGIN
  DECLARE xname VARCHAR(5) DEFAULT 'bob';
  DECLARE newname VARCHAR(5);
  DECLARE xid INT;
  DECLARE done TINYINT DEFAULT 0;
  DECLARE cur1 CURSOR FOR SELECT xname, id FROM table1;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  OPEN cur1;
  read_loop: LOOP
    FETCH FROM cur1 INTO newname, xid;
    IF done THEN LEAVE read_loop; END IF;
    SELECT newname;
  END LOOP;
  CLOSE cur1;
END;
```

Consulte também [Section 23.8, “Restrictions on Stored Programs”](stored-program-restrictions.html "23.8 Restrictions on Stored Programs").