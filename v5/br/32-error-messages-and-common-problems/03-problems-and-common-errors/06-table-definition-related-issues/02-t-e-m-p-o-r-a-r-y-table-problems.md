#### B.3.6.2 Problemas com Tabelas TEMPORARY

Tabelas temporárias criadas com [`CREATE TEMPORARY TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") possuem as seguintes limitações:

*   Tabelas `TEMPORARY` são suportadas apenas pelos mecanismos de armazenamento `InnoDB`, `MEMORY`, `MyISAM` e `MERGE`.

*   Tabelas temporárias não são suportadas para o NDB Cluster.
*   O statement [`SHOW TABLES`](show-tables.html "13.7.5.37 SHOW TABLES Statement") não lista tabelas `TEMPORARY`.

*   Para renomear tabelas `TEMPORARY`, o `RENAME TABLE` não funciona. Use [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") em vez disso:

    ```sql
  ALTER TABLE old_name RENAME new_name;
  ```

*   Você não pode referenciar uma tabela `TEMPORARY` mais de uma vez na mesma Query. Por exemplo, o seguinte não funciona:

    ```sql
  SELECT * FROM temp_table JOIN temp_table AS t2;
  ```

    O statement produz este erro:

    ```sql
  ERROR 1137: Can't reopen table: 'temp_table'
  ```

*   O erro *Can't reopen table* também ocorre se você referenciar uma tabela temporária várias vezes em uma stored function usando aliases diferentes, mesmo que as referências ocorram em statements diferentes dentro da função. Ele pode ocorrer para tabelas temporárias criadas fora de stored functions e referenciadas em múltiplas funções chamadoras e chamadas (calling and callee functions).

*   Se uma tabela `TEMPORARY` for criada com o mesmo nome de uma tabela não-`TEMPORARY` existente, a tabela não-`TEMPORARY` fica oculta até que a tabela `TEMPORARY` seja descartada (dropped), mesmo que as tabelas usem mecanismos de armazenamento diferentes.

*   Existem problemas conhecidos no uso de tabelas temporárias com Replication. Consulte [Section 16.4.1.29, “Replication and Temporary Tables”](replication-features-temptables.html "16.4.1.29 Replication and Temporary Tables"), para mais informações.