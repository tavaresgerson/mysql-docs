#### 13.7.5.24 Instrução SHOW OPEN TABLES

```sql
SHOW OPEN TABLES
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

A instrução `SHOW OPEN TABLES` lista as tables que não são `TEMPORARY` e que estão atualmente abertas no cache de tables. Veja Seção 8.4.3.1, “Como o MySQL Abre e Fecha Tables”. A cláusula `FROM`, se presente, restringe as tables exibidas àquelas presentes no *`db_name`* Database. A cláusula `LIKE`, se presente, indica quais nomes de table devem ser correspondidos. A cláusula `WHERE` pode ser fornecida para selecionar linhas usando condições mais gerais, conforme discutido em Seção 24.8, “Extensões às Instruções SHOW”.

O resultado da instrução `SHOW OPEN TABLES` possui estas colunas:

* `Database`

  O Database contendo a table.

* `Table`

  O nome da table.

* `In_use`

  O número de table Locks ou solicitações de Lock existentes para a table. Por exemplo, se um cliente adquire um Lock para uma table usando `LOCK TABLE t1 WRITE`, `In_use` é 1. Se outro cliente emite `LOCK TABLE t1 WRITE` enquanto a table permanece bloqueada, o cliente é bloqueado esperando pelo Lock, mas a solicitação de Lock faz com que `In_use` seja 2. Se a contagem for zero, a table está aberta, mas não está sendo usada atualmente. `In_use` também é incrementado pela instrução `HANDLER ... OPEN` e decrementado por `HANDLER ... CLOSE`.

* `Name_locked`

  Indica se o nome da table está bloqueado. O Lock de nome (Name locking) é usado para operações como descartar (dropping) ou renomear tables.

Se você não tiver privilégios para uma table, ela não aparecerá na saída de `SHOW OPEN TABLES`.