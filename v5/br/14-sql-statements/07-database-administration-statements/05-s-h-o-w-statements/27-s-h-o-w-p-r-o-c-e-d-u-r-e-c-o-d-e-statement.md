#### 13.7.5.27. EXIBIR CÓDIGO DO PROCEDIMENTO Declaração

```sql
SHOW PROCEDURE CODE proc_name
```

Esta declaração é uma extensão do MySQL que está disponível apenas para servidores que foram construídos com suporte de depuração. Ela exibe uma representação da implementação interna do procedimento armazenado nomeado. Uma declaração semelhante, `SHOW FUNCTION CODE`, exibe informações sobre funções armazenadas (consulte Seção 13.7.5.19, “Declaração SHOW FUNCTION CODE”).

Para usar qualquer uma dessas declarações, você deve ser o proprietário da rotina ou ter acesso ao `mysql.proc` tabela com `SELECT` (select.html).

Se a rotina nomeada estiver disponível, cada instrução gera um conjunto de resultados. Cada linha do conjunto de resultados corresponde a uma “instrução” na rotina. A primeira coluna é `Pos`, que é um número ordinal começando com 0. A segunda coluna é `Instrução`, que contém uma instrução SQL (geralmente alterada a partir da fonte original) ou uma diretiva que tem significado apenas para o manipulador da rotina armazenada.

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

Neste exemplo, as instruções não executáveis `BEGIN` e `END` desapareceram, e para a instrução `DECLARE variable_name`, aparece apenas a parte executável (a parte onde o valor padrão é atribuído). Para cada instrução tirada da fonte, há uma palavra-código `stmt` seguida de um tipo (9 significa `DROP`, 5 significa `INSERT`, e assim por diante). A última linha contém uma instrução `jump 2`, o que significa `GOTO instrução #2`.
