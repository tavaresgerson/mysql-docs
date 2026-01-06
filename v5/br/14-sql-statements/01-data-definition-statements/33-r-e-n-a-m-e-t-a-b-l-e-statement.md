### 13.1.33 Declaração de RENOMEAR Tabela

```sql
RENAME TABLE
    tbl_name TO new_tbl_name
    [, tbl_name2 TO new_tbl_name2] ...
```

`RENAME TABLE` renomeia uma ou mais tabelas. Você deve ter privilégios de `ALTER` (`privileges-provided.html#priv_alter`) e `DROP` (`privileges-provided.html#priv_drop`) para a tabela original e privilégios de `CREATE` (`privileges-provided.html#priv_create`) e `INSERT` (`privileges-provided.html#priv_insert`) para a nova tabela.

Por exemplo, para renomear uma tabela chamada `old_table` para `new_table`, use esta instrução:

```sql
RENAME TABLE old_table TO new_table;
```

Essa declaração é equivalente à seguinte declaração `ALTER TABLE`:

```sql
ALTER TABLE old_table RENAME new_table;
```

Diferentemente de `ALTER TABLE`, a instrução `RENAME TABLE` pode renomear várias tabelas em uma única declaração:

```sql
RENAME TABLE old_table1 TO new_table1,
             old_table2 TO new_table2,
             old_table3 TO new_table3;
```

As operações de renomeação são realizadas da esquerda para a direita. Portanto, para trocar dois nomes de tabela, faça o seguinte (supondo que uma tabela com o nome intermediário `tmp_table` ainda não exista):

```sql
RENAME TABLE old_table TO tmp_table,
             new_table TO old_table,
             tmp_table TO new_table;
```

As bloquagens de metadados em tabelas são adquiridas em ordem alfabética, o que, em alguns casos, pode fazer a diferença no resultado da operação quando várias transações são executadas simultaneamente. Consulte Seção 8.11.4, “Bloqueio de Metadados”.

Para executar `RENAME TABLE`, não podem haver transações ativas ou tabelas bloqueadas com `LOCK TABLES`. Com as condições de bloqueio de tabelas da transação atendidas, a operação de renomeação é realizada de forma atômica; nenhuma outra sessão pode acessar nenhuma das tabelas enquanto a renomeação estiver em andamento.

Se ocorrerem erros durante uma `RENAME TABLE`, a instrução falhará e nenhuma alteração será feita.

Você pode usar `RENAME TABLE` para mover uma tabela de um banco de dados para outro:

```sql
RENAME TABLE current_db.tbl_name TO other_db.tbl_name;
```

Usar esse método para mover todas as tabelas de um banco de dados para outro, na verdade, renomeia o banco de dados (uma operação para a qual o MySQL não tem uma única instrução), exceto que o banco de dados original continua a existir, embora sem tabelas.

Assim como `RENAME TABLE`, `ALTER TABLE ... RENAME` também pode ser usado para mover uma tabela para um banco de dados diferente. Independentemente da instrução usada, se a operação de renomeação mover a tabela para um banco de dados localizado em um sistema de arquivos diferente, o sucesso do resultado é específico da plataforma e depende das chamadas do sistema operacional subjacentes usadas para mover os arquivos da tabela.

Se uma tabela tiver gatilhos, as tentativas de renomear a tabela para um banco de dados diferente falham com um erro de gatilho no esquema errado (`ER_TRG_IN_WRONG_SCHEMA`).

Para renomear tabelas `TEMPORARY`, o comando `RENAME TABLE` não funciona. Use `ALTER TABLE` (alter-table.html) em vez disso.

A opção `RENAME TABLE` funciona para visualizações, exceto que visualizações não podem ser renomeadas para um banco de dados diferente.

Quaisquer privilégios concedidos especificamente para uma tabela ou visão renomeada não são migrados para o novo nome. Eles devem ser alterados manualmente.

`RENAME TABLE tbl_name TO new_tbl_name` altera os nomes internos das restrições de chave estrangeira e os nomes de restrições de chave estrangeira definidos pelo usuário que começam com a string “*`tbl_name`**ibfk*” para refletir o novo nome da tabela. O `InnoDB` interpreta os nomes de restrições de chave estrangeira que começam com a string “*`tbl_name`**ibfk*” como nomes gerados internamente.

Os nomes das restrições de chave estrangeira que apontam para a tabela renomeada são atualizados automaticamente, a menos que haja um conflito, caso em que a declaração falha com um erro. Um conflito ocorre se o nome da restrição renomeada já existir. Nesses casos, você deve descartar e recriar as chaves estrangeiras para que elas funcionem corretamente.
