## 18.4 O Motor de Armazenamento CSV

18.4.1 Reparo e Verificação de Tabelas CSV

18.4.2 Limitações do CSV

O motor de armazenamento `CSV` armazena dados em arquivos de texto no formato de valores separados por vírgula.

O motor de armazenamento `CSV` é sempre compilado no servidor MySQL.

Para examinar a fonte do motor `CSV`, procure no diretório `storage/csv` de uma distribuição de código-fonte MySQL.

Ao criar uma tabela `CSV`, o servidor cria um arquivo de dados em texto simples com um nome que começa com o nome da tabela e tem a extensão `.CSV`. Ao armazenar dados na tabela, o motor de armazenamento os salva no arquivo de dados no formato de valores separados por vírgula.

```
mysql> CREATE TABLE test (i INT NOT NULL, c CHAR(10) NOT NULL)
    ->     ENGINE = CSV;
Query OK, 0 rows affected (0.06 sec)

mysql> INSERT INTO test
    ->     VALUES ROW(1,'record one'), ROW(2,'record two');
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

A criação de uma tabela `CSV` também cria um metaarquivo correspondente que armazena o estado da tabela e o número de linhas que existem na tabela. O nome desse arquivo é o mesmo do nome da tabela com a extensão `CSM`.

Se você examinar o arquivo `test.CSV` no diretório de banco de dados criado executando as declarações anteriores, seu conteúdo deve parecer assim:

```
"1","record one"
"2","record two"
```

Esse formato pode ser lido e até mesmo escrito por aplicativos de planilha, como o Microsoft Excel.