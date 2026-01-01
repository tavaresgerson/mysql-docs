#### 1.7.3.1 Restrições de Índices `PRIMARY KEY` e `UNIQUE`

Normalmente, ocorrem erros para declarações de alteração de dados (como `INSERT` ou `UPDATE`) que violam as restrições de chave primária, chave única ou chave estrangeira. Se você estiver usando um motor de armazenamento transacional, como `InnoDB`, o MySQL reverte automaticamente a declaração. Se você estiver usando um motor de armazenamento não transacional, o MySQL para de processar a declaração na linha para a qual ocorreu o erro e deixa as linhas restantes não processadas.

O MySQL suporta a palavra-chave `IGNORE` para `INSERT`, `UPDATE`, e assim por diante. Se você usá-la, o MySQL ignora violações de chave primária ou chave única e continua processando com a próxima linha. Veja a seção da declaração que você está usando.

Você pode obter informações sobre o número de linhas realmente inseridas ou atualizadas com a função C `mysql_info()`. Você também pode usar a declaração `SHOW WARNINGS`. Veja `mysql_info()` e a Seção 15.7.7.42, “Declaração SHOW WARNINGS”.

As tabelas `InnoDB` e `NDB` suportam chaves estrangeiras.