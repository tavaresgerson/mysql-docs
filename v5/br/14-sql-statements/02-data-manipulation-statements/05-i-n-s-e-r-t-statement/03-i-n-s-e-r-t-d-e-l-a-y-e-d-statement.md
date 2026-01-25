#### 13.2.5.3 Instrução INSERT DELAYED

```sql
INSERT DELAYED ...
```

A opção `DELAYED` para a instrução [`INSERT`](insert.html "13.2.5 INSERT Statement") é uma extensão MySQL ao SQL padrão. Em versões anteriores do MySQL, ela podia ser usada para certos tipos de tables (como `MyISAM`), de forma que, quando um cliente utilizava [`INSERT DELAYED`](insert-delayed.html "13.2.5.3 INSERT DELAYED Statement"), ele recebia uma confirmação ("okay") do server imediatamente, e a row era enfileirada para ser inserida quando a table não estivesse em uso por nenhum outro Thread.

Inserts e replaces com `DELAYED` foram descontinuados (deprecated) no MySQL 5.6. No MySQL 5.7, o `DELAYED` não é suportado. O server reconhece, mas ignora, a keyword `DELAYED`, trata o insert como um insert não-delayed, e gera o warning `ER_WARN_LEGACY_SYNTAX_CONVERTED`: INSERT DELAYED is no longer supported. The statement was converted to INSERT. A keyword `DELAYED` está programada para remoção em um release futuro.