## 15.9 O Motor de Armazenamento EXAMPLE

O mecanismo de armazenamento `EXAMPLE` é um mecanismo de stub que não faz nada. Seu propósito é servir como um exemplo no código-fonte do MySQL que ilustra como começar a escrever novos mecanismos de armazenamento. Como tal, ele é de interesse principalmente para desenvolvedores.

Para habilitar o mecanismo de armazenamento `EXAMPLE` ao construir o MySQL a partir do código-fonte, invocando o **CMake** com a opção `-DWITH_EXAMPLE_STORAGE_ENGINE`.

Para examinar a fonte do motor `EXAMPLE`, procure no diretório `storage/example` de uma distribuição de fonte MySQL.

Quando você cria uma tabela `Exemplo`, o servidor cria um arquivo de formato de tabela no diretório do banco de dados. O arquivo começa com o nome da tabela e tem a extensão `.frm`. Não são criados outros arquivos. Não é possível armazenar dados na tabela. Os resultados dos acessos retornam um resultado vazio.

```sql
mysql> CREATE TABLE test (i INT) ENGINE = EXAMPLE;
Query OK, 0 rows affected (0.78 sec)

mysql> INSERT INTO test VALUES(1),(2),(3);
ERROR 1031 (HY000): Table storage engine for 'test' doesn't »
                    have this option

mysql> SELECT * FROM test;
Empty set (0.31 sec)
```

O mecanismo de armazenamento `EXAMPLE` não suporta indexação.
