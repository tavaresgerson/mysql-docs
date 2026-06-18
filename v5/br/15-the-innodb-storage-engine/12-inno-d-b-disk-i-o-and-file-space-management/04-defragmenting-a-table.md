### 14.12.4 Desfragmentando uma Tabela

Inserções ou exclusões aleatórias em um *secondary Index* podem fazer com que o *Index* fique fragmentado. *Fragmentation* significa que a ordenação física das páginas do *Index* no disco não está próxima da ordenação dos *records* do *Index* nas páginas, ou que existem muitas páginas não utilizadas nos blocos de 64 páginas que foram alocados para o *Index*.

Um sintoma de *Fragmentation* é que uma tabela ocupa mais *space* do que "deveria" ocupar. É difícil determinar exatamente quanto é isso. Todos os dados e *Indexes* do `InnoDB` são armazenados em *B-trees*, e seu fator de preenchimento pode variar de 50% a 100%. Outro sintoma de *Fragmentation* é que um *Table Scan* como este leva mais tempo do que "deveria" levar:

```sql
SELECT COUNT(*) FROM t WHERE non_indexed_column <> 12345;
```

A *Query* anterior exige que o MySQL execute um *Full Table Scan*, o tipo de *Query* mais lento para uma tabela grande.

Para acelerar os *Index Scans*, você pode realizar periodicamente uma operação `ALTER TABLE` "nula", que faz com que o MySQL reconstrua a tabela:

```sql
ALTER TABLE tbl_name ENGINE=INNODB
```

Você também pode usar `ALTER TABLE tbl_name FORCE` para realizar uma operação *alter* "nula" que reconstrói a tabela.

Tanto `ALTER TABLE tbl_name ENGINE=INNODB` quanto `ALTER TABLE tbl_name FORCE` usam *Online DDL*. Para mais informações, consulte a Seção 14.13, “InnoDB and Online DDL”.

Outra forma de realizar uma operação de desfragmentação é usar o **mysqldump** para despejar a tabela em um arquivo de texto, *drop* (excluir) a tabela e recarregá-la a partir do arquivo despejado (*dump file*).

Se as inserções em um *Index* forem sempre ascendentes e os *records* forem excluídos apenas do final, o algoritmo de gerenciamento de espaço de arquivo do `InnoDB` garante que a *Fragmentation* no *Index* não ocorra.