#### B.3.6.1 Problemas com ALTER TABLE

Se você receber um erro de chave duplicada (`duplicate-key error`) ao usar `ALTER TABLE` para alterar o *character set* ou a *collation* de uma coluna de caracteres, a causa é que a nova *collation* da coluna mapeia duas chaves para o mesmo valor, ou que a tabela está corrompida. Neste último caso, você deve executar `REPAIR TABLE` na tabela. `REPAIR TABLE` funciona para tabelas `MyISAM`, `ARCHIVE` e `CSV`.

Se `ALTER TABLE` falhar com o seguinte erro, o problema pode ser que o MySQL travou durante uma operação anterior de `ALTER TABLE` e há uma tabela antiga chamada `A-xxx` ou `B-xxx` abandonada:

```sql
Error on rename of './database/name.frm'
to './database/B-xxx.frm' (Errcode: 17)
```

Neste caso, vá para o diretório de dados do MySQL e exclua todos os arquivos cujos nomes comecem com `A-` ou `B-`. (Você pode querer movê-los para outro lugar em vez de excluí-los.)

`ALTER TABLE` funciona da seguinte maneira:

* Cria uma nova tabela chamada `A-xxx` com as alterações estruturais solicitadas.
* Copia todas as linhas da tabela original para `A-xxx`.
* Renomeia a tabela original para `B-xxx`.
* Renomeia `A-xxx` para o nome da sua tabela original.
* Exclui `B-xxx`.

Se algo der errado com a operação de renomeação, o MySQL tenta desfazer as alterações. Se algo der gravemente errado (embora isso não deva acontecer), o MySQL pode deixar a tabela antiga como `B-xxx`. Uma simples renomeação dos arquivos da tabela no nível do sistema deve recuperar seus dados.

Se você usar `ALTER TABLE` em uma tabela transacional ou se estiver usando Windows, `ALTER TABLE` desbloqueia a tabela se você tiver executado um `LOCK TABLE` nela. Isso é feito porque o `InnoDB` e esses sistemas operacionais não podem descartar (drop) uma tabela que está em uso.