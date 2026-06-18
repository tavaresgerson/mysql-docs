### 15.1.36 Declaração de RENOMEAR Tabela

```
RENAME TABLE
    tbl_name TO new_tbl_name
    [, tbl_name2 TO new_tbl_name2] ...
```

`RENAME TABLE` renomeia uma ou mais tabelas. Você deve ter os privilégios `ALTER` e `DROP` para a tabela original e os privilégios `CREATE` e `INSERT` para a nova tabela.

Por exemplo, para renomear uma tabela chamada `old_table` para `new_table`, use esta declaração:

```
RENAME TABLE old_table TO new_table;
```

Essa declaração é equivalente à seguinte declaração `ALTER TABLE`:

```
ALTER TABLE old_table RENAME new_table;
```

`RENAME TABLE`, ao contrário de `ALTER TABLE`, pode renomear várias tabelas em uma única instrução:

```
RENAME TABLE old_table1 TO new_table1,
             old_table2 TO new_table2,
             old_table3 TO new_table3;
```

As operações de renomeação são realizadas da esquerda para a direita. Portanto, para trocar dois nomes de tabela, faça o seguinte (supondo que uma tabela com o nome intermediário `tmp_table` ainda não exista):

```
RENAME TABLE old_table TO tmp_table,
             new_table TO old_table,
             tmp_table TO new_table;
```

As bloquagens de metadados em tabelas são adquiridas em ordem alfabética, o que, em alguns casos, pode fazer a diferença no resultado da operação quando várias transações são executadas simultaneamente. Veja a Seção 10.11.4, “Bloqueio de Metadados”.

A partir do MySQL 8.0.13, você pode renomear tabelas bloqueadas com uma declaração `LOCK TABLES` desde que estejam bloqueadas com um bloqueio `WRITE` ou sejam o resultado da renomeação de tabelas bloqueadas com `WRITE` em etapas anteriores de uma operação de renomeação de múltiplas tabelas. Por exemplo, isso é permitido:

```
LOCK TABLE old_table1 WRITE;
RENAME TABLE old_table1 TO new_table1,
             new_table1 TO new_table2;
```

Isso não é permitido:

```
LOCK TABLE old_table1 READ;
RENAME TABLE old_table1 TO new_table1,
             new_table1 TO new_table2;
```

Antes do MySQL 8.0.13, para executar `RENAME TABLE`, não deve haver tabelas bloqueadas com `LOCK TABLES`.

Com as condições de bloqueio da tabela de transação atendidas, a operação de renomeação é realizada de forma atômica; nenhuma outra sessão pode acessar nenhuma das tabelas enquanto a renomeação estiver em andamento.

Se ocorrerem erros durante um `RENAME TABLE`, a declaração falhará e nenhuma alteração será feita.

Você pode usar `RENAME TABLE` para mover uma tabela de um banco de dados para outro:

```
RENAME TABLE current_db.tbl_name TO other_db.tbl_name;
```

Usar esse método para mover todas as tabelas de um banco de dados para outro, na verdade, renomeia o banco de dados (uma operação para a qual o MySQL não tem uma única instrução), exceto que o banco de dados original continua a existir, embora sem tabelas.

Assim como `RENAME TABLE`, `ALTER TABLE ... RENAME` também pode ser usado para mover uma tabela para um banco de dados diferente. Independentemente da instrução usada, se a operação de renomeação mover a tabela para um banco de dados localizado em um sistema de arquivos diferente, o sucesso do resultado é específico da plataforma e depende das chamadas de sistema operacional subjacentes usadas para mover os arquivos da tabela.

Se uma tabela tiver gatilhos, as tentativas de renomear a tabela para um banco de dados diferente falham com um erro de Gatilho no esquema errado (`ER_TRG_IN_WRONG_SCHEMA`).

Uma tabela não criptografada pode ser movida para um banco de dados com criptografia habilitada e vice-versa. No entanto, se a variável `table_encryption_privilege_check` estiver habilitada, o privilégio `TABLE_ENCRYPTION_ADMIN` é necessário se o ajuste de criptografia da tabela for diferente da criptografia padrão do banco de dados.

Para renomear as tabelas `TEMPORARY`, o `RENAME TABLE` não funciona. Use o `ALTER TABLE` em vez disso.

`RENAME TABLE` funciona para visualizações, exceto que visualizações não podem ser renomeadas para um banco de dados diferente.

Quaisquer privilégios concedidos especificamente para uma tabela ou visão renomeada não são migrados para o novo nome. Eles devem ser alterados manualmente.

`RENAME TABLE tbl_name TO new_tbl_name` altera os nomes das restrições de chave estrangeira geradas internamente e os nomes das restrições de chave estrangeira definidas pelo usuário que começam com a string “\*`tbl_name`**ibfk*” para refletir o novo nome da tabela. `InnoDB` interpreta os nomes das restrições de chave estrangeira que começam com a string “*`tbl_name`\**ibfk*” como nomes gerados internamente.

Os nomes das restrições de chave estrangeira que apontam para a tabela renomeada são atualizados automaticamente, a menos que haja um conflito, caso em que a declaração falha com um erro. Um conflito ocorre se o nome da restrição renomeada já existir. Nesses casos, você deve descartar e recriar as chaves estrangeiras para que elas funcionem corretamente.

`RENAME TABLE tbl_name TO new_tbl_name` altera os nomes de restrições gerados internamente e definidos pelo usuário `CHECK` que começam com a string “\*`tbl_name`**chk*” para refletir o novo nome da tabela. O MySQL interpreta os nomes de restrições `CHECK` que começam com a string “*`tbl_name`\**chk*” como nomes gerados internamente. Exemplo:

```
mysql> SHOW CREATE TABLE t1\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t1` (
  `i1` int(11) DEFAULT NULL,
  `i2` int(11) DEFAULT NULL,
  CONSTRAINT `t1_chk_1` CHECK ((`i1` > 0)),
  CONSTRAINT `t1_chk_2` CHECK ((`i2` < 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.02 sec)

mysql> RENAME TABLE t1 TO t3;
Query OK, 0 rows affected (0.03 sec)

mysql> SHOW CREATE TABLE t3\G
*************************** 1. row ***************************
       Table: t3
Create Table: CREATE TABLE `t3` (
  `i1` int(11) DEFAULT NULL,
  `i2` int(11) DEFAULT NULL,
  CONSTRAINT `t3_chk_1` CHECK ((`i1` > 0)),
  CONSTRAINT `t3_chk_2` CHECK ((`i2` < 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.01 sec)
```
