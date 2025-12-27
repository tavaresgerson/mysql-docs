### 15.1.41 Declaração `RENAME TABLE`

```
RENAME TABLE
    tbl_name TO new_tbl_name
    [, tbl_name2 TO new_tbl_name2] ...
```

A declaração `RENAME TABLE` renomeia uma ou mais tabelas. Você deve ter privilégios de `ALTER` e `DROP` para a tabela original e privilégios de `CREATE` e `INSERT` para a nova tabela.

Por exemplo, para renomear uma tabela chamada `old_table` para `new_table`, use esta declaração:

```
RENAME TABLE old_table TO new_table;
```

Essa declaração é equivalente à seguinte declaração `ALTER TABLE`:

```
ALTER TABLE old_table RENAME new_table;
```

A declaração `RENAME TABLE`, ao contrário de `ALTER TABLE`, pode renomear várias tabelas em uma única declaração:

```
RENAME TABLE old_table1 TO new_table1,
             old_table2 TO new_table2,
             old_table3 TO new_table3;
```

As operações de renomeação são realizadas da esquerda para a direita. Assim, para trocar dois nomes de tabela, faça isso (assumindo que uma tabela com o nome intermediário `tmp_table` ainda não existe):

```
RENAME TABLE old_table TO tmp_table,
             new_table TO old_table,
             tmp_table TO new_table;
```

As bloquagens de metadados nas tabelas são adquiridas em ordem de nome, o que, em alguns casos, pode fazer a diferença no resultado da operação quando várias transações são executadas simultaneamente. Veja a Seção 10.11.4, “Bloqueio de Metadados”.

Você pode renomear tabelas bloqueadas com uma declaração `LOCK TABLES`, desde que estejam bloqueadas com um bloqueio `WRITE` ou sejam o produto da renomeação de tabelas com bloqueio `WRITE` de etapas anteriores em uma operação de renomeação de várias tabelas. Por exemplo, isso é permitido:

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

Com as condições de bloqueio de tabela de transação satisfeitas, a operação de renomeação é realizada de forma atomizada; nenhuma outra sessão pode acessar nenhuma das tabelas enquanto a renomeação estiver em andamento.

Se ocorrer algum erro durante uma `RENAME TABLE`, a declaração falha e nenhuma mudança é feita.

Você pode usar `RENAME TABLE` para mover uma tabela de um banco de dados para outro:

```
RENAME TABLE current_db.tbl_name TO other_db.tbl_name;
```csuKabwZkt```