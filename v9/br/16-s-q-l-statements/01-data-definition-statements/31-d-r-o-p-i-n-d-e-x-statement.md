### 15.1.31 Declaração `DROP INDEX`

```
DROP INDEX index_name ON tbl_name
    [algorithm_option | lock_option] ...

algorithm_option:
    ALGORITHM [=] {DEFAULT | INPLACE | COPY}

lock_option:
    LOCK [=] {DEFAULT | NONE | SHARED | EXCLUSIVE}
```

`DROP INDEX` exclui o índice denominado *`index_name`* da tabela *`tbl_name`*. Esta declaração é mapeada para uma declaração `ALTER TABLE` para excluir o índice. Veja a Seção 15.1.11, “Declaração `ALTER TABLE`”.

Para excluir uma chave primária, o nome do índice é sempre `PRIMARY`, que deve ser especificado como um identificador citado porque `PRIMARY` é uma palavra reservada:

```
DROP INDEX `PRIMARY` ON t;
```

Os índices em colunas de largura variável das tabelas `NDB` são excluídos online; ou seja, sem nenhuma cópia da tabela. A tabela não é bloqueada contra o acesso de outros nós da API NDB Cluster, embora seja bloqueada contra outras operações no mesmo nó da API durante a duração da operação. Isso é feito automaticamente pelo servidor sempre que ele determinar que é possível fazê-lo; você não precisa usar nenhuma sintaxe SQL especial ou opções do servidor para fazer isso acontecer.

As cláusulas `ALGORITHM` e `LOCK` podem ser fornecidas para influenciar o método de cópia da tabela e o nível de concorrência para leitura e escrita da tabela enquanto seus índices estão sendo modificados. Elas têm o mesmo significado que para a declaração `ALTER TABLE`. Para mais informações, veja a Seção 15.1.11, “Declaração `ALTER TABLE`”

O MySQL NDB Cluster suporta operações online usando a mesma sintaxe `ALGORITHM=INPLACE` suportada no servidor MySQL padrão. Veja a Seção 25.6.12, “Operações Online com `ALTER TABLE` no NDB Cluster”, para mais informações.