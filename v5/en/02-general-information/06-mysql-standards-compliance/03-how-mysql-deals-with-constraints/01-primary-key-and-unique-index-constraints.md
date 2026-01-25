#### 1.6.3.1 Restrições de PRIMARY KEY e UNIQUE Index

Normalmente, erros ocorrem para *statements* de alteração de dados (como `INSERT` ou `UPDATE`) que violariam restrições de *primary-key*, *unique-key* ou *foreign-key*. Se você estiver usando um *storage engine* transacional, como `InnoDB`, o MySQL automaticamente faz o *rollback* do *statement*. Se você estiver usando um *storage engine* não transacional, o MySQL para de processar o *statement* na linha em que o erro ocorreu e deixa quaisquer linhas restantes sem processamento.

O MySQL suporta a palavra-chave `IGNORE` para `INSERT`, `UPDATE` e assim por diante. Se você a usar, o MySQL ignora violações de *primary-key* ou *unique-key* e continua o processamento com a próxima linha. Consulte a seção para o *statement* que você está usando (Seção 13.2.5, “INSERT Statement”, Seção 13.2.11, “UPDATE Statement”, e assim por diante).

Você pode obter informações sobre o número de linhas realmente inseridas ou atualizadas com a função `mysql_info()` da C API. Você também pode usar o *statement* `SHOW WARNINGS`. Consulte `mysql_info()`, e Seção 13.7.5.40, “SHOW WARNINGS Statement”.

As tabelas `InnoDB` e `NDB` suportam *foreign keys*. Consulte a Seção 1.6.3.2, “FOREIGN KEY Constraints”.