### 13.1.25 Declaração DROP INDEX

```sql
DROP INDEX index_name ON tbl_name
    [algorithm_option | lock_option] ...

algorithm_option:
    ALGORITHM [=] {DEFAULT | INPLACE | COPY}

lock_option:
    LOCK [=] {DEFAULT | NONE | SHARED | EXCLUSIVE}
```

`DROP INDEX` exclui o índice denominado *`index_name`* da tabela *`tbl_name`*. Esta declaração é mapeada para uma declaração `ALTER TABLE` para excluir o índice. Veja Seção 13.1.8, “Declaração ALTER TABLE”.

Para excluir uma chave primária, o nome do índice é sempre `PRIMARY`, que deve ser especificado como um identificador entre aspas, pois `PRIMARY` é uma palavra reservada:

```sql
DROP INDEX `PRIMARY` ON t;
```

Os índices em colunas de largura variável das tabelas de `[NDB]` (mysql-cluster.html) são removidos online, ou seja, sem a necessidade de copiar nenhuma tabela. A tabela não é bloqueada contra o acesso de outros nós da API do NDB Cluster, embora seja bloqueada contra outras operações no mesmo nó da API durante a duração da operação. Isso é feito automaticamente pelo servidor sempre que ele determinar que é possível fazê-lo; você não precisa usar nenhuma sintaxe SQL especial ou opções do servidor para fazer isso acontecer.

As cláusulas `ALGORITHM` e `LOCK` podem ser usadas para influenciar o método de cópia da tabela e o nível de concorrência para leitura e escrita da tabela enquanto seus índices estão sendo modificados. Elas têm o mesmo significado que a instrução `ALTER TABLE`. Para mais informações, consulte Seção 13.1.8, “Instrução ALTER TABLE”

O NDB Cluster anteriormente suportava operações `DROP INDEX` online usando as palavras-chave `ONLINE` e `OFFLINE`. Essas palavras-chave não são mais suportadas no MySQL NDB Cluster 7.5 e versões posteriores, e seu uso causa um erro de sintaxe. Em vez disso, o MySQL NDB Cluster 7.5 e versões posteriores suportam operações online usando a mesma sintaxe `ALGORITHM=INPLACE` usada com o servidor MySQL padrão. Consulte Seção 21.6.12, “Operações online com ALTER TABLE no NDB Cluster” para obter mais informações.
