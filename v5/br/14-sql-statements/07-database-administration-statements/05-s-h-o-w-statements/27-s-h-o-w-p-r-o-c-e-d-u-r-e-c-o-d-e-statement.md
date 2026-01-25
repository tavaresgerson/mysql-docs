#### 13.7.5.27 Instrução SHOW PROCEDURE CODE

```sql
SHOW PROCEDURE CODE proc_name
```

Esta instrução é uma extensão do MySQL que está disponível apenas para servidores que foram compilados com suporte a *debugging*. Ela exibe uma representação da implementação interna da `stored procedure` nomeada. Uma instrução semelhante, [`SHOW FUNCTION CODE`](show-function-code.html "13.7.5.19 SHOW FUNCTION CODE Statement"), exibe informações sobre *stored functions* (consulte [Seção 13.7.5.19, “SHOW FUNCTION CODE Statement”](show-function-code.html "13.7.5.19 SHOW FUNCTION CODE Statement")).

Para usar qualquer uma das instruções, você deve ser o proprietário da *routine* ou ter acesso `SELECT` à tabela `mysql.proc`.

Se a *routine* nomeada estiver disponível, cada instrução produz um *result set*. Cada linha no *result set* corresponde a uma “instrução” na *routine*. A primeira coluna é `Pos`, que é um número ordinal começando em 0. A segunda coluna é `Instruction`, que contém uma instrução SQL (geralmente alterada da fonte original), ou uma diretiva que tem significado apenas para o *stored-routine handler*.

```sql
mysql> DELIMITER //
mysql> CREATE PROCEDURE p1 ()
       BEGIN
         DECLARE fanta INT DEFAULT 55;
         DROP TABLE t2;
         LOOP
           INSERT INTO t3 VALUES (fanta);
           END LOOP;
         END//
Query OK, 0 rows affected (0.01 sec)

mysql> SHOW PROCEDURE CODE p1//
+-----+----------------------------------------+
| Pos | Instruction                            |
+-----+----------------------------------------+
|   0 | set fanta@0 55                         |
|   1 | stmt 9 "DROP TABLE t2"                 |
|   2 | stmt 5 "INSERT INTO t3 VALUES (fanta)" |
|   3 | jump 2                                 |
+-----+----------------------------------------+
4 rows in set (0.00 sec)

mysql> CREATE FUNCTION test.hello (s CHAR(20))
       RETURNS CHAR(50) DETERMINISTIC
       RETURN CONCAT('Hello, ',s,'!');
Query OK, 0 rows affected (0.00 sec)

mysql> SHOW FUNCTION CODE test.hello;
+-----+---------------------------------------+
| Pos | Instruction                           |
+-----+---------------------------------------+
|   0 | freturn 254 concat('Hello, ',s@0,'!') |
+-----+---------------------------------------+
1 row in set (0.00 sec)
```

Neste exemplo, as instruções não executáveis `BEGIN` e `END` desapareceram, e para a instrução `DECLARE variable_name`, apenas a parte executável aparece (a parte onde o valor *default* é atribuído). Para cada instrução que é retirada da fonte, há uma palavra-chave `stmt` seguida por um tipo (9 significa `DROP`, 5 significa [`INSERT`](insert.html "13.2.5 INSERT Statement"), e assim por diante). A linha final contém uma instrução `jump 2`, significando `GOTO instruction #2`.
