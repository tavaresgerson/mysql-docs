## 15.4 A Storage Engine CSV

15.4.1 Reparando e Verificando Tabelas CSV

15.4.2 Limitações do CSV

A `CSV` storage engine armazena dados em arquivos de texto usando o formato de valores separados por vírgula (comma-separated values).

A `CSV` storage engine é sempre compilada no MySQL server.

Para examinar o código-fonte da `CSV` engine, procure no diretório `storage/csv` de uma distribuição de código-fonte do MySQL.

Quando você cria uma tabela `CSV`, o server cria um arquivo de formato de tabela no `database` directory. O arquivo começa com o nome da tabela e tem a extensão `.frm`. A storage engine também cria um arquivo de dados em texto simples cujo nome começa com o nome da tabela e tem a extensão `.CSV`. Quando você armazena dados na tabela, a storage engine os salva no arquivo de dados no formato de valores separados por vírgula (comma-separated values).

```sql
mysql> CREATE TABLE test (i INT NOT NULL, c CHAR(10) NOT NULL)
       ENGINE = CSV;
Query OK, 0 rows affected (0.06 sec)

mysql> INSERT INTO test VALUES(1,'record one'),(2,'record two');
Query OK, 2 rows affected (0.05 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> SELECT * FROM test;
+---+------------+
| i | c          |
+---+------------+
| 1 | record one |
| 2 | record two |
+---+------------+
2 rows in set (0.00 sec)
```

A criação de uma tabela `CSV` também gera um metafile correspondente que armazena o estado da tabela e o número de `rows` existentes na tabela. O nome deste arquivo é o mesmo nome da tabela com a extensão `CSM`.

Se você examinar o arquivo `test.CSV` no `database` directory criado pela execução das declarações anteriores, seu conteúdo deve ser semelhante a este:

```sql
"1","record one"
"2","record two"
```

Este formato pode ser lido, e até mesmo escrito, por aplicativos de planilha eletrônica como o Microsoft Excel.