### 13.5.3 Instrução DEALLOCATE PREPARE

```sql
{DEALLOCATE | DROP} PREPARE stmt_name
```

Para desalocar uma prepared statement produzida com [`PREPARE`](prepare.html "13.5.1 Instrução PREPARE"), utilize uma instrução [`DEALLOCATE PREPARE`](deallocate-prepare.html "13.5.3 Instrução DEALLOCATE PREPARE") que se refira ao nome da prepared statement. Tentar executar uma prepared statement após desalocá-la resulta em um erro. Se muitas prepared statements forem criadas e não forem desalocadas, seja pela instrução `DEALLOCATE PREPARE` ou pelo fim da session, você poderá atingir o limite superior imposto pela system variable [`max_prepared_stmt_count`](server-system-variables.html#sysvar_max_prepared_stmt_count).

Para exemplos, veja [Seção 13.5, “Prepared Statements”](sql-prepared-statements.html "13.5 Prepared Statements").