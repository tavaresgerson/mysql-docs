### 11.4.9 Criação de Indexes Espaciais

Para tabelas `InnoDB` e `MyISAM`, o MySQL pode criar indexes espaciais usando sintaxe similar à usada para criar indexes regulares, mas utilizando a palavra-chave `SPATIAL`. Colunas em indexes espaciais devem ser declaradas como `NOT NULL`. Os exemplos a seguir demonstram como criar indexes espaciais:

* Com `CREATE TABLE`:

  ```sql
  CREATE TABLE geom (g GEOMETRY NOT NULL, SPATIAL INDEX(g));
  ```

* Com `ALTER TABLE`:

  ```sql
  CREATE TABLE geom (g GEOMETRY NOT NULL);
  ALTER TABLE geom ADD SPATIAL INDEX(g);
  ```

* Com `CREATE INDEX`:

  ```sql
  CREATE TABLE geom (g GEOMETRY NOT NULL);
  CREATE SPATIAL INDEX g ON geom (g);
  ```

`SPATIAL INDEX` cria um Index R-tree. Para storage engines que suportam indexação não-espacial de colunas espaciais, o engine cria um Index B-tree. Um Index B-tree em valores espaciais é útil para buscas de valor exato (exact-value lookups), mas não para range scans.

Para mais informações sobre a indexação de colunas espaciais, consulte a Seção 13.1.14, “CREATE INDEX Statement”.

Para remover indexes espaciais, use `ALTER TABLE` ou `DROP INDEX`:

* Com `ALTER TABLE`:

  ```sql
  ALTER TABLE geom DROP INDEX g;
  ```

* Com `DROP INDEX`:

  ```sql
  DROP INDEX g ON geom;
  ```

Exemplo: Suponha que uma tabela `geom` contenha mais de 32.000 geometrias, que são armazenadas na coluna `g` do tipo `GEOMETRY`. A tabela também possui uma coluna `AUTO_INCREMENT` chamada `fid` para armazenar valores de ID de objeto.

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

Para adicionar um Index espacial na coluna `g`, use esta instrução:

```sql
mysql> ALTER TABLE geom ADD SPATIAL INDEX(g);
Query OK, 32376 rows affected (4.05 sec)
Records: 32376  Duplicates: 0  Warnings: 0
```