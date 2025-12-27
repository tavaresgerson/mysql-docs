#### 15.7.7.26 Declaração `SHOW OPEN TABLES`

```
SHOW OPEN TABLES
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

`SHOW OPEN TABLES` lista as tabelas não `TEMPORARY` que estão atualmente abertas no cache de tabelas. Veja a Seção 10.4.3.1, “Como o MySQL Abre e Fecha Tabelas”. A cláusula `FROM`, se presente, restringe as tabelas mostradas às presentes no banco de dados *`db_name`*. A cláusula `LIKE`, se presente, indica quais nomes de tabela devem ser correspondidos. A cláusula `WHERE` pode ser usada para selecionar linhas com condições mais gerais, conforme discutido na Seção 28.8, “Extensões para Declarações SHOW”.

A saída de `SHOW OPEN TABLES` tem essas colunas:

* `Database`

  O banco de dados que contém a tabela.

* `Table`

  O nome da tabela.

* `In_use`

  O número de bloqueios de tabela ou solicitações de bloqueio para a tabela. Por exemplo, se um cliente adquire um bloqueio para uma tabela usando `LOCK TABLE t1 WRITE`, `In_use` é 1. Se outro cliente emitir `LOCK TABLE t1 WRITE` enquanto a tabela permanece bloqueada, o cliente é bloqueado, aguardando o bloqueio, mas a solicitação de bloqueio faz com que `In_use` seja 2. Se a contagem for zero, a tabela está aberta, mas não está sendo usada atualmente. `In_use` também é aumentada pela declaração `HANDLER ... OPEN` e diminuída pela declaração `HANDLER ... CLOSE`.

* `Name_locked`

  Se o nome da tabela está bloqueado. O bloqueio de nome é usado para operações como a remoção ou renomeação de tabelas.

Se você não tiver privilégios para uma tabela, ela não aparece na saída de `SHOW OPEN TABLES`.