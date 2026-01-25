#### 1.6.3.2 FOREIGN KEY Constraints

Foreign keys permitem fazer referência cruzada a dados relacionados entre tables, e as foreign key constraints ajudam a manter esses dados distribuídos consistentes.

O MySQL suporta referências de foreign key `ON UPDATE` e `ON DELETE` nas instruções `CREATE TABLE` e `ALTER TABLE`. As ações referenciais disponíveis são `RESTRICT` (o padrão), `CASCADE`, `SET NULL` e `NO ACTION`.

`SET DEFAULT` também é suportado pelo MySQL Server, mas atualmente é rejeitado como inválido pelo `InnoDB`. Como o MySQL não oferece suporte à verificação de constraint diferida (deferred constraint checking), `NO ACTION` é tratado como `RESTRICT`. Para a sintaxe exata suportada pelo MySQL para foreign keys, consulte a Seção 13.1.18.5, “FOREIGN KEY Constraints”.

`MATCH FULL`, `MATCH PARTIAL` e `MATCH SIMPLE` são permitidos, mas seu uso deve ser evitado, pois fazem com que o MySQL Server ignore qualquer cláusula `ON DELETE` ou `ON UPDATE` usada na mesma instrução. As opções `MATCH` não têm nenhum outro efeito no MySQL, que, na prática, aplica a semântica `MATCH SIMPLE` em tempo integral.

O MySQL exige que as colunas de foreign key sejam indexadas; se você criar uma table com uma foreign key constraint, mas sem um Index na coluna específica, um Index será criado.

Você pode obter informações sobre foreign keys a partir da table `KEY_COLUMN_USAGE` do Information Schema. Um exemplo de uma Query nesta table é mostrado aqui:

```sql
mysql> SELECT TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME
     > FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
     > WHERE REFERENCED_TABLE_SCHEMA IS NOT NULL;
+--------------+---------------+-------------+-----------------+
| TABLE_SCHEMA | TABLE_NAME    | COLUMN_NAME | CONSTRAINT_NAME |
+--------------+---------------+-------------+-----------------+
| fk1          | myuser        | myuser_id   | f               |
| fk1          | product_order | customer_id | f2              |
| fk1          | product_order | product_id  | f1              |
+--------------+---------------+-------------+-----------------+
3 rows in set (0.01 sec)
```

Informações sobre foreign keys em tables `InnoDB` também podem ser encontradas nas tables `INNODB_SYS_FOREIGN` e `INNODB_SYS_FOREIGN_COLS`, no Database `INFORMATION_SCHEMA`.

Tables `InnoDB` e `NDB` suportam foreign keys.