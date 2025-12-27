### 13.4.10 Criando Índices Espaciais

Para as tabelas `InnoDB` e `MyISAM`, o MySQL pode criar índices espaciais usando a sintaxe semelhante àquela para criar índices regulares, mas usando a palavra-chave `SPATIAL`. As colunas em índices espaciais devem ser declaradas como `NOT NULL`. Os seguintes exemplos demonstram como criar índices espaciais:

* Com  `CREATE TABLE`:

  ```
  CREATE TABLE geom (g GEOMETRY NOT NULL SRID 4326, SPATIAL INDEX(g));
  ```
* Com  `ALTER TABLE`:

  ```
  CREATE TABLE geom (g GEOMETRY NOT NULL SRID 4326);
  ALTER TABLE geom ADD SPATIAL INDEX(g);
  ```
* Com  `CREATE INDEX`:

  ```
  CREATE TABLE geom (g GEOMETRY NOT NULL SRID 4326);
  CREATE SPATIAL INDEX g ON geom (g);
  ```

O `SPATIAL INDEX` cria um índice R-tree. Para motores de armazenamento que suportam indexação não espacial de colunas espaciais, o motor cria um índice B-tree. Um índice B-tree em valores espaciais é útil para buscas de valor exato, mas não para varreduras de intervalo.

O otimizador pode usar índices espaciais definidos em colunas que são restritas por SRID. Para mais informações, consulte a Seção 13.4.1, “Tipos de Dados Espaciais”, e a Seção 10.3.3, “Otimização de Índices ESPACIAIS”.

Para mais informações sobre indexação de colunas espaciais, consulte a Seção 15.1.15, “Instrução CREATE INDEX”.

Para descartar índices espaciais, use `ALTER TABLE` ou  `DROP INDEX`:

* Com  `ALTER TABLE`:

  ```
  ALTER TABLE geom DROP INDEX g;
  ```
* Com  `DROP INDEX`:

  ```
  DROP INDEX g ON geom;
  ```

Exemplo: Suponha que uma tabela `geom` contenha mais de 32.000 geómetras, que são armazenadas na coluna `g` do tipo `GEOMETRY`. A tabela também tem uma coluna `fid` de `AUTO_INCREMENT` para armazenar valores de ID de objeto.

```
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

```
mysql> ALTER TABLE geom ADD SPATIAL INDEX(g);
Query OK, 32376 rows affected (4.05 sec)
Records: 32376  Duplicates: 0  Warnings: 0
```