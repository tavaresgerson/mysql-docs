#### B.3.6.1 Problemas com ALTER TABLE

Se você receber um erro de chave duplicada ao usar `ALTER TABLE` para alterar o conjunto de caracteres ou a collation de uma coluna de caracteres, a causa é que a nova collation da coluna mapeia duas chaves para o mesmo valor ou que a tabela está corrompida. No último caso, você deve executar `REPAIR TABLE` na tabela. `REPAIR TABLE` funciona para tabelas `MyISAM`, `ARCHIVE` e `CSV`.

Se você usar `ALTER TABLE` em uma tabela transacional ou se estiver usando o Windows, `ALTER TABLE` desbloqueia a tabela se você tiver feito um `LOCK TABLE` nela. Isso é feito porque o `InnoDB` e esses sistemas operacionais não podem descartar uma tabela que está em uso.