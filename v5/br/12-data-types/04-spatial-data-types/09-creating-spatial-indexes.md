### 11.4.9 Criando Índices Espaciais

Para tabelas `InnoDB` e `MyISAM`, o MySQL pode criar índices espaciais usando uma sintaxe semelhante àquela para criar índices regulares, mas usando a palavra-chave `SPATIAL`. As colunas em índices espaciais devem ser declaradas como `NOT NULL`. Os seguintes exemplos demonstram como criar índices espaciais:

- Com `CREATE TABLE`:

  ```sql
  CREATE TABLE geom (g GEOMETRY NOT NULL, SPATIAL INDEX(g));
  ```

- Com `ALTER TABLE`:

  ```sql
  CREATE TABLE geom (g GEOMETRY NOT NULL);
  ALTER TABLE geom ADD SPATIAL INDEX(g);
  ```

- Com `CREATE INDEX`:

  ```sql
  CREATE TABLE geom (g GEOMETRY NOT NULL);
  CREATE SPATIAL INDEX g ON geom (g);
  ```

O `SPATIAL INDEX` cria um índice R-tree. Para motores de armazenamento que suportam indexação não espacial de colunas espaciais, o motor cria um índice B-tree. Um índice B-tree em valores espaciais é útil para consultas de valores exatos, mas não para varreduras de intervalo.

Para obter mais informações sobre a indexação de colunas espaciais, consulte a Seção 13.1.14, “Instrução CREATE INDEX”.

Para excluir índices espaciais, use `ALTER TABLE` ou `DROP INDEX`:

- Com `ALTER TABLE`:

  ```sql
  ALTER TABLE geom DROP INDEX g;
  ```

- Com `DROP INDEX`:

  ```sql
  DROP INDEX g ON geom;
  ```

Exemplo: Suponha que uma tabela `geom` contenha mais de 32.000 geometrias, que são armazenadas na coluna `g` do tipo `GEOMETRY`. A tabela também possui uma coluna `AUTO_INCREMENT` `fid` para armazenar valores de ID de objeto.

```sql
mysql> DESCRIBE geom;
+-------+----------+------+-----+---------+----------------+
| Field | Type     | Null | Key | Default | Extra          |
+-------+----------+------+-----+---------+----------------+
| fid   | int(11)  |      | PRI | NULL    | auto_increment |
| g     | geometry |      |     |         |                |
+-------+----------+------+-----+---------+----------------+
2 rows in set (0.00 sec)

mysql> SELECT COUNT(*) FROM geom;
+----------+
| count(*) |
+----------+
|    32376 |
+----------+
1 row in set (0.00 sec)
```

Para adicionar um índice espacial na coluna `g`, use esta instrução:

```sql
mysql> ALTER TABLE geom ADD SPATIAL INDEX(g);
Query OK, 32376 rows affected (4.05 sec)
Records: 32376  Duplicates: 0  Warnings: 0
```
