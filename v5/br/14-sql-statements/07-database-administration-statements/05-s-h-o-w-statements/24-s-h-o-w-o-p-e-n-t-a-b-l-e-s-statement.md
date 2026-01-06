#### 13.7.5.24. Mostrar mesas disponíveis

```sql
SHOW OPEN TABLES
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

`SHOW OPEN TABLES` lista as tabelas não `TEMPORARY` que estão atualmente abertas no cache de tabelas. Veja Seção 8.4.3.1, “Como o MySQL Abre e Fecha Tabelas”. A cláusula `FROM`, se presente, restringe as tabelas mostradas às presentes no banco de dados *`db_name`*. A cláusula `LIKE` (funções de comparação de strings)`, se presente, indica quais nomes de tabelas devem ser correspondidos. A cláusula `WHERE\` pode ser usada para selecionar linhas com condições mais gerais, conforme discutido em Seção 24.8, “Extensões para Declarações SHOW”.

A saída `SHOW OPEN TABLES` tem essas colunas:

- `Banco de dados`

  O banco de dados que contém a tabela.

- `Mesa`

  O nome da tabela.

- `Em uso`

  O número de bloqueios de tabela ou solicitações de bloqueio para a tabela. Por exemplo, se um cliente adquire um bloqueio para uma tabela usando `LOCK TABLE t1 WRITE`, `In_use` é 1. Se outro cliente emitir `LOCK TABLE t1 WRITE` enquanto a tabela permanece bloqueada, o cliente bloqueia na espera pelo bloqueio, mas a solicitação de bloqueio faz com que `In_use` seja 2. Se a contagem for zero, a tabela está aberta, mas não está sendo usada atualmente. `In_use` também é aumentada pela instrução `HANDLER ... OPEN` e diminuída pela instrução `HANDLER ... CLOSE`.

- `Nome_bloqueado`

  Se o nome da tabela está bloqueado. O bloqueio de nome é usado para operações como a remoção ou renomeação de tabelas.

Se você não tiver privilégios para uma tabela, ela não aparecerá na saída do comando `SHOW OPEN TABLES` (show-open-tables.html).
