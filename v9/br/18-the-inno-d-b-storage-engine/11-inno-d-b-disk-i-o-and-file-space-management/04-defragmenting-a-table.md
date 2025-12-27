### 17.11.4 Desfragmentação de uma Tabela

Inserções aleatórias em um índice secundário ou deletações dele podem fazer com que o índice se fragmente. Fragmentação significa que a ordem física das páginas do índice no disco não está próxima da ordem de registro das páginas, ou que há muitas páginas não usadas nos blocos de 64 páginas alocados ao índice.

Um sintoma da fragmentação é que uma tabela ocupa mais espaço do que “deveria”. Quanto exatamente isso é, é difícil determinar. Todos os dados e índices `InnoDB` são armazenados em árvores B, e seu fator de preenchimento pode variar de 50% a 100%. Outro sintoma da fragmentação é que uma varredura da tabela, como esta, leva mais tempo do que “deveria”:

```
SELECT COUNT(*) FROM t WHERE non_indexed_column <> 12345;
```

A consulta anterior exige que o MySQL realize uma varredura completa da tabela, o tipo mais lento de consulta para uma grande tabela.

Para acelerar as varreduras de índice, você pode realizar periodicamente uma operação `ALTER TABLE` “nulo”, que faz com que o MySQL reconstrua a tabela:

```
ALTER TABLE tbl_name ENGINE=INNODB
```

Você também pode usar `ALTER TABLE tbl_name FORCE` para realizar uma operação `ALTER` “nulo` que reconstrui a tabela.

Tanto `ALTER TABLE tbl_name ENGINE=INNODB` quanto `ALTER TABLE tbl_name FORCE` usam DDL online. Para mais informações, consulte a Seção 17.12, “InnoDB e DDL Online”.

Outra maneira de realizar uma operação de desfragmentação é usar **mysqldump** para drenar a tabela para um arquivo de texto, deletar a tabela e recarregá-la a partir do arquivo de dump.

Se as inserções em um índice forem sempre ascendentes e os registros forem excluídos apenas da extremidade, o algoritmo de gerenciamento de espaço de dados `InnoDB` garante que a fragmentação no índice não ocorra.