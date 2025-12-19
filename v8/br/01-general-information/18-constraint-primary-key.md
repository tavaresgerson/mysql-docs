#### 1.7.3.1 Restrições de chave primária e de índice único

Normalmente, erros ocorrem para instruções de alteração de dados (como `INSERT` ou `UPDATE`) que violam restrições de chave primária, chave única ou chave estrangeira. Se você estiver usando um mecanismo de armazenamento transacional como `InnoDB`, o MySQL reverterá automaticamente a instrução. Se você estiver usando um mecanismo de armazenamento não transacional, o MySQL interromperá o processamento da instrução na linha para a qual o erro ocorreu e deixará as linhas restantes sem processamento.

O MySQL suporta uma palavra-chave `IGNORE` para `INSERT`, `UPDATE`, e assim por diante. Se você a usar, o MySQL ignora violações de chave primária ou chave única e continua o processamento com a próxima linha. Veja a seção para a instrução que você está usando (Seção 15.2.7, INSERT Statement, Seção 15.2.17, UPDATE Statement, e assim por diante).

Você pode obter informações sobre o número de linhas realmente inseridas ou atualizadas com a função `mysql_info()` C API. Você também pode usar a instrução `SHOW WARNINGS`. Veja `mysql_info()`, e Seção 15.7.7.42, SHOW WARNINGS Statement.

As tabelas `InnoDB` e `NDB` suportam chaves estrangeiras. Veja Seção 1.7.3.2, CONTRIBUIÇÕES DA CHAVE EXTRANGERA.
