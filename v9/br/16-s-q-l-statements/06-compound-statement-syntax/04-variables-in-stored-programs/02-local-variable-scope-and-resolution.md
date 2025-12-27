#### 15.6.4.2 Escopo e Resolução de Variáveis Locais

O escopo de uma variável local é o bloco `BEGIN ... END` dentro do qual ela é declarada. A variável pode ser referenciada em blocos aninhados dentro do bloco declarador, exceto aqueles blocos que declaram uma variável com o mesmo nome.

Como as variáveis locais estão em escopo apenas durante a execução do programa armazenado, as referências a elas não são permitidas em instruções preparadas criadas dentro de um programa armazenado. O escopo da instrução preparada é a sessão atual, não o programa armazenado, então a instrução poderia ser executada após o término do programa, momento em que as variáveis não estariam mais em escopo. Por exemplo, `SELECT ... INTO local_var` não pode ser usado como uma instrução preparada. Essa restrição também se aplica aos parâmetros de procedimentos e funções armazenados. Veja a Seção 15.5.1, “Instrução PREPARE”.

Uma variável local não deve ter o mesmo nome que uma coluna de tabela. Se uma instrução SQL, como uma instrução `SELECT ... INTO`, contém uma referência a uma coluna e uma variável local declarada com o mesmo nome, o MySQL atualmente interpreta a referência como o nome de uma *variável*. Considere a seguinte definição de procedimento:

```
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

O MySQL interpreta `xname` na instrução `SELECT` como uma referência à *variável* `xname` em vez da *coluna* `xname`. Consequentemente, quando o procedimento `sp1()` é chamado, a variável `newname` retorna o valor `'bob'` independentemente do valor da coluna `table1.xname`.

Da mesma forma, a definição de cursor na seguinte procedure contém uma instrução `SELECT` que se refere a `xname`. O MySQL interpreta isso como uma referência à variável com esse nome em vez de uma referência a uma coluna.

```
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

Veja também a Seção 27.10, “Restrições em Programas Armazenados”.