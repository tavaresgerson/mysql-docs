### 13.1.25 Instrução DROP INDEX

```sql
DROP INDEX index_name ON tbl_name
    [algorithm_option | lock_option] ...

algorithm_option:
    ALGORITHM [=] {DEFAULT | INPLACE | COPY}

lock_option:
    LOCK [=] {DEFAULT | NONE | SHARED | EXCLUSIVE}
```

A instrução [`DROP INDEX`](drop-index.html "13.1.25 DROP INDEX Statement") remove o Index nomeado *`index_name`* da tabela *`tbl_name`*. Esta instrução é mapeada para uma instrução [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") para remover o Index. Consulte [Seção 13.1.8, “Instrução ALTER TABLE”](alter-table.html "13.1.8 ALTER TABLE Statement").

Para remover uma Primary Key, o nome do Index é sempre `PRIMARY`, que deve ser especificado como um identificador entre aspas, pois `PRIMARY` é uma palavra reservada:

```sql
DROP INDEX `PRIMARY` ON t;
```

Indexes em colunas de largura variável de tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") são removidos online; ou seja, sem qualquer cópia da tabela. A tabela não é Locked contra acesso de outros nós de API do NDB Cluster, embora seja Locked contra outras operações no *mesmo* nó de API durante a duração da operação. Isso é feito automaticamente pelo server sempre que ele determina que é possível; você não precisa usar nenhuma sintaxe SQL especial ou opções de server para que isso ocorra.

Cláusulas `ALGORITHM` e `LOCK` podem ser fornecidas para influenciar o método de cópia da tabela e o nível de concorrência para leitura e escrita da tabela enquanto seus Indexes estão sendo modificados. Elas têm o mesmo significado que na instrução [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"). Para mais informações, consulte [Seção 13.1.8, “Instrução ALTER TABLE”](alter-table.html "13.1.8 ALTER TABLE Statement")

Anteriormente, o NDB Cluster suportava operações `DROP INDEX` online usando as palavras-chave `ONLINE` e `OFFLINE`. Estas palavras-chave não são mais suportadas no MySQL NDB Cluster 7.5 e posteriores, e seu uso causa um erro de sintaxe. Em vez disso, o MySQL NDB Cluster 7.5 e posteriores suportam operações online usando a mesma sintaxe `ALGORITHM=INPLACE` utilizada com o MySQL Server padrão. Consulte [Seção 21.6.12, “Online Operations with ALTER TABLE in NDB Cluster”](mysql-cluster-online-operations.html "21.6.12 Online Operations with ALTER TABLE in NDB Cluster"), para mais informações.