#### 1.7.3.2 Restrições de Chave Estrangeira

As chaves estrangeiras permitem que você faça referências cruzadas entre dados relacionados em tabelas, e as restrições de chave estrangeira ajudam a manter esses dados dispersos consistentes.

O MySQL suporta referências de chave estrangeira `ON UPDATE` e `ON DELETE` nas instruções `CREATE TABLE` e `ALTER TABLE`. As ações referenciais disponíveis são `RESTRICT`, `CASCADE`, `SET NULL` e `NO ACTION` (o padrão).

`SET DEFAULT` também é suportado pelo MySQL Server, mas atualmente é rejeitado como inválido pelo `InnoDB`. Como o MySQL não suporta verificação de restrições diferida, `NO ACTION` é tratado como `RESTRICT`. Para a sintaxe exata suportada pelo MySQL para chaves estrangeiras, consulte a Seção 15.1.20.5, “Restrições de Chave Estrangeira”.

`MATCH FULL`, `MATCH PARTIAL` e `MATCH SIMPLE` são permitidos, mas seu uso deve ser evitado, pois fazem com que o MySQL Server ignore qualquer cláusula `ON DELETE` ou `ON UPDATE` usada na mesma instrução. As opções `MATCH` não têm nenhum outro efeito no MySQL, que, na verdade, impõe a semântica `MATCH SIMPLE` em tempo integral.

O MySQL exige que as colunas de chave estrangeira sejam indexadas; se você criar uma tabela com uma restrição de chave estrangeira, mas sem índice em uma coluna específica, um índice é criado.

Você pode obter informações sobre chaves estrangeiras da tabela do Schema de Informações `KEY_COLUMN_USAGE`. Um exemplo de consulta contra essa tabela é mostrado aqui:

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

Informações sobre chaves estrangeiras em tabelas `InnoDB` também podem ser encontradas nas tabelas `INNODB_FOREIGN` e `INNODB_FOREIGN_COLS`, no banco de dados `INFORMATION_SCHEMA`.

As tabelas `InnoDB` e `NDB` suportam chaves estrangeiras.