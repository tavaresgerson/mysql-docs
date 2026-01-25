### 13.1.33 Declaração RENAME TABLE

```sql
RENAME TABLE
    tbl_name TO new_tbl_name
    [, tbl_name2 TO new_tbl_name2] ...
```

A declaração [`RENAME TABLE`](rename-table.html "13.1.33 RENAME TABLE Statement") renomeia uma ou mais tabelas. Você deve ter os privilégios [`ALTER`](privileges-provided.html#priv_alter) e [`DROP`](privileges-provided.html#priv_drop) para a tabela original, e os privilégios [`CREATE`](privileges-provided.html#priv_create) e [`INSERT`](privileges-provided.html#priv_insert) para a nova tabela.

Por exemplo, para renomear uma tabela chamada `old_table` para `new_table`, use esta declaração:

```sql
RENAME TABLE old_table TO new_table;
```

Essa declaração é equivalente à seguinte declaração [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"):

```sql
ALTER TABLE old_table RENAME new_table;
```

`RENAME TABLE`, diferentemente de [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), pode renomear múltiplas tabelas dentro de uma única declaração:

```sql
RENAME TABLE old_table1 TO new_table1,
             old_table2 TO new_table2,
             old_table3 TO new_table3;
```

As operações de renomeação são realizadas da esquerda para a direita. Assim, para trocar dois nomes de tabelas, faça o seguinte (assumindo que uma tabela com o nome intermediário `tmp_table` não exista):

```sql
RENAME TABLE old_table TO tmp_table,
             new_table TO old_table,
             tmp_table TO new_table;
```

Os Locks de Metadata nas tabelas são adquiridos na ordem dos nomes, o que, em alguns casos, pode fazer diferença no resultado da operação quando múltiplas transactions são executadas concorrentemente. Consulte [Seção 8.11.4, “Metadata Locking”](metadata-locking.html "8.11.4 Metadata Locking").

Para executar `RENAME TABLE`, não deve haver transactions ativas ou tabelas com Lock aplicado usando `LOCK TABLES`. Uma vez satisfeitas as condições de Locking de tabela, a operação de renomeação é feita atomicamente; nenhuma outra session pode acessar nenhuma das tabelas enquanto a renomeação estiver em andamento.

Se ocorrerem erros durante uma declaração `RENAME TABLE`, a declaração falha e nenhuma alteração é feita.

Você pode usar `RENAME TABLE` para mover uma tabela de um Database para outro:

```sql
RENAME TABLE current_db.tbl_name TO other_db.tbl_name;
```

Usar este método para mover todas as tabelas de um Database para outro diferente efetivamente renomeia o Database (uma operação para a qual o MySQL não possui uma única declaração), exceto que o Database original continua a existir, embora sem tabelas.

Assim como `RENAME TABLE`, `ALTER TABLE ... RENAME` também pode ser usado para mover uma tabela para um Database diferente. Independentemente da declaração utilizada, se a operação de renomeação mover a tabela para um Database localizado em um sistema de arquivos diferente (file system), o sucesso do resultado é específico da plataforma e depende das chamadas subjacentes do sistema operacional usadas para mover os arquivos da tabela.

Se uma tabela tiver triggers, as tentativas de renomear a tabela para um Database diferente falham com um erro Trigger in wrong schema ([`ER_TRG_IN_WRONG_SCHEMA`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_trg_in_wrong_schema)).

Para renomear tabelas `TEMPORARY`, `RENAME TABLE` não funciona. Use [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") em vez disso.

`RENAME TABLE` funciona para views, exceto que views não podem ser renomeadas para um Database diferente.

Quaisquer privilégios concedidos especificamente para uma tabela ou view renomeada não são migrados para o novo nome. Eles devem ser alterados manualmente.

`RENAME TABLE tbl_name TO new_tbl_name` altera os nomes de constraints de Foreign Key gerados internamente e os nomes de constraints de Foreign Key definidos pelo usuário que começam com a string “*`tbl_name`*_ibfk_” para refletir o novo nome da tabela. O `InnoDB` interpreta os nomes de constraints de Foreign Key que começam com a string “*`tbl_name`*_ibfk_” como nomes gerados internamente.

Os nomes de constraints de Foreign Key que apontam para a tabela renomeada são atualizados automaticamente, a menos que haja um conflito, caso em que a declaração falha com um erro. Ocorre um conflito se o nome da constraint renomeada já existir. Nesses casos, você deve descartar (drop) e recriar as Foreign Keys para que funcionem corretamente.