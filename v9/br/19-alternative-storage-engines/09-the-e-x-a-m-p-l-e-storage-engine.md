## 18.9 O Motor de Armazenamento EXAMPLE

O motor de armazenamento `EXAMPLE` é um motor fictício que não faz nada. Seu propósito é servir como um exemplo no código-fonte do MySQL que ilustra como começar a escrever novos motores de armazenamento. Como tal, ele é de interesse principalmente para desenvolvedores.

Para habilitar o motor de armazenamento `EXAMPLE` se você compilar o MySQL a partir do código-fonte, invocando o **CMake** com a opção `-DWITH_EXAMPLE_STORAGE_ENGINE`.

Para examinar o código-fonte do motor `EXAMPLE`, procure no diretório `storage/example` de uma distribuição de código-fonte do MySQL.

Ao criar uma tabela `EXAMPLE`, nenhum arquivo é criado. Nenhum dado pode ser armazenado na tabela. Os retornos de recuperação retornam um resultado vazio.

```
mysql> CREATE TABLE test (i INT) ENGINE = EXAMPLE;
Query OK, 0 rows affected (0.78 sec)

mysql> INSERT INTO test VALUES ROW(1), ROW(2), ROW(3);
ERROR 1031 (HY000): Table storage engine for 'test' doesn't »
                    have this option

mysql> SELECT * FROM test;
Empty set (0.31 sec)
```

O motor de armazenamento `EXAMPLE` não suporta indexação.

O motor de armazenamento `EXAMPLE` não suporta partição.