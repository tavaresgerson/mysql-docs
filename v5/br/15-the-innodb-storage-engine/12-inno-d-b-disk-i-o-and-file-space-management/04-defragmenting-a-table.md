### 14.12.4 Desfragmentação de uma tabela

Inserções aleatórias em um índice secundário ou suas exclusões podem fazer com que o índice se fragmente. A fragmentação significa que a ordem física das páginas do índice no disco não está próxima da ordem dos registros nas páginas, ou que há muitas páginas não utilizadas nos blocos de 64 páginas que foram alocados ao índice.

Um sintoma da fragmentação é que uma tabela ocupa mais espaço do que “deveria”. Quanto exatamente isso é, é difícil determinar. Todos os dados e índices do `InnoDB` são armazenados em árvores B, e seu fator de preenchimento pode variar de 50% a 100%. Outro sintoma da fragmentação é que uma varredura de tabela, como esta, leva mais tempo do que “deveria”:

```sql
SELECT COUNT(*) FROM t WHERE non_indexed_column <> 12345;
```

A consulta anterior exige que o MySQL realize uma varredura completa da tabela, o tipo de consulta mais lento para uma grande tabela.

Para acelerar a varredura do índice, você pode realizar periodicamente uma operação `ALTER TABLE` "nulo", o que faz com que o MySQL reconstrua a tabela:

```sql
ALTER TABLE tbl_name ENGINE=INNODB
```

Você também pode usar `ALTER TABLE tbl_name FORCE` para realizar uma operação de alteração "nulo" que reconstrui a tabela.

Tanto `ALTER TABLE tbl_name ENGINE=INNODB` quanto `ALTER TABLE tbl_name FORCE` usam DDL online. Para mais informações, consulte a Seção 14.13, “InnoDB e DDL online”.

Outra maneira de realizar uma operação de desfragmentação é usar o **mysqldump** para drenar a tabela para um arquivo de texto, excluir a tabela e recarregar a partir do arquivo de dump.

Se as inserções em um índice forem sempre ascendentes e os registros forem excluídos apenas do final, o algoritmo de gerenciamento do espaço de arquivos do `InnoDB` garante que a fragmentação no índice não ocorra.
