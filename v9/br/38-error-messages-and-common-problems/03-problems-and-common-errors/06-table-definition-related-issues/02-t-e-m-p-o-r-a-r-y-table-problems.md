#### B.3.6.2 Problemas com tabelas temporárias

Tabelas temporárias criadas com `CREATE TEMPORARY TABLE` têm as seguintes limitações:

* As tabelas `TEMPORARY` são suportadas apenas pelos motores de armazenamento `InnoDB`, `MEMORY`, `MyISAM` e `MERGE`.

* As tabelas temporárias não são suportadas para o NDB Cluster.
* A instrução `SHOW TABLES` não lista as tabelas `TEMPORARY`.

* Para renomear tabelas `TEMPORARY`, a instrução `RENAME TABLE` não funciona. Use `ALTER TABLE` em vez disso:

  ```
  ALTER TABLE old_name RENAME new_name;
  ```

* Você não pode referenciar uma tabela `TEMPORARY` mais de uma vez na mesma consulta. Por exemplo, o seguinte não funciona:

  ```
  SELECT * FROM temp_table JOIN temp_table AS t2;
  ```

  A instrução produz esse erro:

  ```
  ERROR 1137: Can't reopen table: 'temp_table'
  ```

  Você pode contornar esse problema se sua consulta permitir o uso de uma expressão de tabela comum (CTE) em vez de uma tabela `TEMPORARY`. Por exemplo, isso falha com o erro "Não é possível reabrir a tabela":

  ```
  CREATE TEMPORARY TABLE t SELECT 1 AS col_a, 2 AS col_b;
  SELECT * FROM t AS t1 JOIN t AS t2;
  ```

  Para evitar o erro, use uma cláusula `WITH`) que defina uma CTE, em vez da tabela `TEMPORARY`:

  ```
  WITH cte AS (SELECT 1 AS col_a, 2 AS col_b)
  SELECT * FROM cte AS t1 JOIN cte AS t2;
  ```

* O erro "Não é possível reabrir a tabela" também ocorre se você referenciar uma tabela temporária várias vezes em uma função armazenada sob diferentes aliases, mesmo que as referências ocorram em diferentes instruções dentro da função. Isso pode ocorrer para tabelas temporárias criadas fora de funções armazenadas e referenciadas em múltiplas funções chamadoras e chamadas.

* Se uma `TEMPORARY` for criada com o mesmo nome de uma tabela existente não `TEMPORARY`, a tabela não `TEMPORARY` é oculta até que a tabela `TEMPORARY` seja removida, mesmo que as tabelas usem motores de armazenamento diferentes.

* Há problemas conhecidos ao usar tabelas temporárias com replicação. Consulte a Seção 19.5.1.32, “Replicação e Tabelas Temporárias”, para obter mais informações.