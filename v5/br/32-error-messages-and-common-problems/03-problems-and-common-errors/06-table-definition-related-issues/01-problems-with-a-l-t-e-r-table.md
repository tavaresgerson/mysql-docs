#### B.3.6.1 Problemas com ALTER TABLE

Se você receber um erro de chave duplicada ao usar [`ALTER TABLE`](alter-table.html) para alterar o conjunto de caracteres ou a concordância de uma coluna de caracteres, a causa é que a nova concordância da coluna mapeia duas chaves para o mesmo valor ou que a tabela está corrompida. No último caso, você deve executar [`REPAIR TABLE`](repair-table.html) na tabela. [`REPAIR TABLE`](repair-table.html) funciona para tabelas `MyISAM`, `ARCHIVE` e `CSV`.

Se o [`ALTER TABLE`](alter-table.html) morrer com o seguinte erro, o problema pode ser que o MySQL quebrou durante uma operação anterior de [`ALTER TABLE`](alter-table.html) e há uma tabela antiga chamada `A-xxx` ou `B-xxx` por aí:

```sql
Error on rename of './database/name.frm'
to './database/B-xxx.frm' (Errcode: 17)
```

Nesse caso, vá até o diretório de dados do MySQL e exclua todos os arquivos que tenham nomes começando com `A-` ou `B-`. (Você pode querer movê-los para outro lugar em vez de excluí-los.)

[`ALTER TABLE`](alter-table.html) funciona da seguinte maneira:

- Crie uma nova tabela chamada `A-xxx` com as alterações estruturais solicitadas.

- Copie todas as linhas da tabela original para `A-xxx`.

- Renomeie a tabela original para `B-xxx`.

- Renomeie `A-xxx` para o nome original da sua tabela.

- Exclua `B-xxx`.

Se algo der errado com a operação de renomeação, o MySQL tenta desfazer as alterações. Se algo der muito errado (embora isso não deva acontecer), o MySQL pode deixar a tabela antiga como `B-xxx`. Uma simples renomeação dos arquivos da tabela no nível do sistema deve recuperar seus dados.

Se você usar `ALTER TABLE` em uma tabela transacional ou se estiver usando o Windows, `ALTER TABLE` desbloqueia a tabela se você tiver feito um `LOCK TABLE` nela. Isso é feito porque o `InnoDB` e esses sistemas operacionais não podem descartar uma tabela que está em uso.
