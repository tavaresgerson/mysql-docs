## 15.9 O Mecanismo de Armazenamento EXAMPLE

O mecanismo de armazenamento `EXAMPLE` (Exemplo) é um mecanismo *stub* (de rascunho) que não faz nada. Seu propósito é servir como um exemplo no código-fonte do MySQL, ilustrando como começar a escrever novos mecanismos de armazenamento (*Storage Engines*). Como tal, é de interesse primário para desenvolvedores.

Para habilitar o mecanismo de armazenamento `EXAMPLE`, caso você compile o MySQL a partir do código-fonte, invoque o **CMake** com a opção `-DWITH_EXAMPLE_STORAGE_ENGINE`.

Para examinar o código-fonte do mecanismo `EXAMPLE`, procure no diretório `storage/example` de uma distribuição do código-fonte do MySQL.

Quando você cria uma tabela `EXAMPLE`, o server cria um arquivo de formato de tabela no diretório do Database. O arquivo começa com o nome da tabela e possui a extensão `.frm`. Nenhum outro arquivo é criado. Nenhum dado pode ser armazenado na tabela. Os *Retrievals* (Recuperações) retornam um resultado vazio.

```sql
mysql> CREATE TABLE test (i INT) ENGINE = EXAMPLE;
Query OK, 0 rows affected (0.78 sec)

mysql> INSERT INTO test VALUES(1),(2),(3);
ERROR 1031 (HY000): Table storage engine for 'test' doesn't »
                    have this option

mysql> SELECT * FROM test;
Empty set (0.31 sec)
```

O mecanismo de armazenamento `EXAMPLE` não suporta *indexing*.