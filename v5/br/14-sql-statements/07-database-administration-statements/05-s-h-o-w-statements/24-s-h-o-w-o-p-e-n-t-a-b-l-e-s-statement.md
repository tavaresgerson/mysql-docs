#### 13.7.5.24 Instrução SHOW OPEN TABLES

```sql
SHOW OPEN TABLES
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

A instrução [`SHOW OPEN TABLES`](show-open-tables.html "13.7.5.24 SHOW OPEN TABLES Statement") lista as tables que não são `TEMPORARY` e que estão atualmente abertas no cache de tables. Veja [Seção 8.4.3.1, “Como o MySQL Abre e Fecha Tables”](table-cache.html "8.4.3.1 How MySQL Opens and Closes Tables"). A cláusula `FROM`, se presente, restringe as tables exibidas àquelas presentes no *`db_name`* Database. A cláusula [`LIKE`](string-comparison-functions.html#operator_like), se presente, indica quais nomes de table devem ser correspondidos. A cláusula `WHERE` pode ser fornecida para selecionar linhas usando condições mais gerais, conforme discutido em [Seção 24.8, “Extensões às Instruções SHOW”](extended-show.html "24.8 Extensions to SHOW Statements").

O resultado da instrução [`SHOW OPEN TABLES`](show-open-tables.html "13.7.5.24 SHOW OPEN TABLES Statement") possui estas colunas:

* `Database`

  O Database contendo a table.

* `Table`

  O nome da table.

* `In_use`

  O número de table Locks ou solicitações de Lock existentes para a table. Por exemplo, se um cliente adquire um Lock para uma table usando `LOCK TABLE t1 WRITE`, `In_use` é 1. Se outro cliente emite `LOCK TABLE t1 WRITE` enquanto a table permanece bloqueada, o cliente é bloqueado esperando pelo Lock, mas a solicitação de Lock faz com que `In_use` seja 2. Se a contagem for zero, a table está aberta, mas não está sendo usada atualmente. `In_use` também é incrementado pela instrução [`HANDLER ... OPEN`](handler.html "13.2.4 HANDLER Statement") e decrementado por [`HANDLER ... CLOSE`](handler.html "13.2.4 HANDLER Statement").

* `Name_locked`

  Indica se o nome da table está bloqueado. O Lock de nome (Name locking) é usado para operações como descartar (dropping) ou renomear tables.

Se você não tiver privilégios para uma table, ela não aparecerá na saída de [`SHOW OPEN TABLES`](show-open-tables.html "13.7.5.24 SHOW OPEN TABLES Statement").