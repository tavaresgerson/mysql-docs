#### B.3.6.2 Problemas com a Tabela TEMPORARY

As tabelas temporárias criadas com [`CREATE TEMPORARY TABLE`](create-table.html) têm as seguintes limitações:

- As tabelas `TEMPORARY` são suportadas apenas pelos motores de armazenamento `InnoDB`, `MEMORY`, `MyISAM` e `MERGE`.

- As tabelas temporárias não são suportadas para o NDB Cluster.

- A instrução [`SHOW TABLES`](show-tables.html) não lista tabelas `TEMPORARY`.

- Para renomear tabelas `TEMPORARY`, o comando `RENAME TABLE` não funciona. Use `ALTER TABLE` em vez disso:

  ```sql
  ALTER TABLE old_name RENAME new_name;
  ```

- Você não pode referenciar uma tabela `TEMPORARY` mais de uma vez na mesma consulta. Por exemplo, o seguinte não funciona:

  ```sql
  SELECT * FROM temp_table JOIN temp_table AS t2;
  ```

  A declaração produz esse erro:

  ```sql
  ERROR 1137: Can't reopen table: 'temp_table'
  ```

- O erro "A tabela não pode ser reaberta" também ocorre se você se referir a uma tabela temporária várias vezes em uma função armazenada sob diferentes aliases, mesmo que as referências ocorram em diferentes instruções dentro da função. Isso pode ocorrer para tabelas temporárias criadas fora das funções armazenadas e referenciadas em múltiplas funções chamadoras e chamadas.

- Se uma tabela `TEMPORARY` for criada com o mesmo nome de uma tabela `NON-TEMPORARY` existente, a tabela `NON-TEMPORARY` será oculta até que a tabela `TEMPORARY` seja excluída, mesmo que as tabelas utilizem motores de armazenamento diferentes.

- Existem problemas conhecidos ao usar tabelas temporárias com replicação. Consulte [Seção 16.4.1.29, “Replicação e Tabelas Temporárias”](replication-features-temptables.html) para obter mais informações.
