#### 1.6.3.1 Restrições de índice de chave primária e índice único

Normalmente, erros ocorrem em declarações de alteração de dados (como `INSERT` ou `UPDATE`) que violam as restrições de chave primária, chave única ou chave estrangeira. Se você estiver usando um mecanismo de armazenamento transacional, como o `InnoDB`, o MySQL reverte automaticamente a declaração. Se você estiver usando um mecanismo de armazenamento não transacional, o MySQL para de processar a declaração na linha para a qual o erro ocorreu e deixa as linhas restantes não processadas.

O MySQL suporta a palavra-chave `IGNORE` para `INSERT`, `UPDATE`, e assim por diante. Se você a usar, o MySQL ignora violações de chave primária ou chave única e continua processando a próxima linha. Veja a seção da declaração que você está usando (Seção 13.2.5, “Declaração de INSERT”, Seção 13.2.11, “Declaração de UPDATE”, e assim por diante).

Você pode obter informações sobre o número de linhas realmente inseridas ou atualizadas com a função C `mysql_info()`. Você também pode usar a instrução `SHOW WARNINGS`. Veja `mysql_info()` e a Seção 13.7.5.40, “Instrução SHOW WARNINGS”.

As tabelas `InnoDB` e `NDB` suportam chaves estrangeiras. Veja a Seção 1.6.3.2, “Restrições de Chave Estrangeira”.
