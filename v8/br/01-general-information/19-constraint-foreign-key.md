#### 1.7.3.2 Restrições da chave externa

As chaves estrangeiras permitem que você faça referências cruzadas de dados relacionados entre tabelas, e as restrições de chaves estrangeiras ajudam a manter esses dados espalhados consistentes.

O MySQL suporta as referências de chave estrangeira \[`ON UPDATE`] e \[`ON DELETE`] nas instruções \[`CREATE TABLE`] e \[`ALTER TABLE`]. As ações referenciais disponíveis são \[`RESTRICT`], \[`CASCADE`], \[`SET NULL`], e \[`NO ACTION`] (o padrão).

`SET DEFAULT` também é suportado pelo MySQL Server, mas é atualmente rejeitado como inválido pelo `InnoDB`. Uma vez que o MySQL não suporta a verificação de restrição diferida, `NO ACTION` é tratado como `RESTRICT`. Para a sintaxe exata suportada pelo MySQL para chaves externas, consulte a Seção 15.1.20.5, FOREIGN KEY Constraints.

`MATCH FULL`, `MATCH PARTIAL`, e `MATCH SIMPLE` são permitidos, mas seu uso deve ser evitado, pois eles fazem com que o Servidor MySQL ignore qualquer cláusula `ON DELETE` ou `ON UPDATE` usada na mesma instrução. `MATCH` opções não têm qualquer outro efeito no MySQL, que efetivamente impõe a semântica `MATCH SIMPLE` em tempo integral.

O MySQL exige que as colunas de chave externa sejam indexadas; se você criar uma tabela com uma restrição de chave externa, mas sem índice em uma determinada coluna, um índice é criado.

Você pode obter informações sobre chaves estrangeiras a partir da tabela do Esquema de Informações `KEY_COLUMN_USAGE`. Um exemplo de uma consulta contra esta tabela é mostrado aqui:

```
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

Informações sobre chaves estrangeiras nas tabelas `InnoDB` também podem ser encontradas nas tabelas `INNODB_FOREIGN` e `INNODB_FOREIGN_COLS`, no banco de dados `INFORMATION_SCHEMA`.

As tabelas `InnoDB` e `NDB` suportam chaves estrangeiras.
