## 15.4 O Motor de Armazenamento CSV

O motor de armazenamento `CSV` armazena dados em arquivos de texto usando o formato de valores separados por vírgula.

O motor de armazenamento `CSV` é sempre compilado no servidor MySQL.

Para examinar a fonte do motor `CSV`, procure no diretório `storage/csv` de uma distribuição de fonte MySQL.

Quando você cria uma tabela `CSV`, o servidor cria um arquivo de formato de tabela no diretório do banco de dados. O arquivo começa com o nome da tabela e tem uma extensão `.frm`. O mecanismo de armazenamento também cria um arquivo de dados de texto simples com um nome que começa com o nome da tabela e tem uma extensão `.CSV`. Quando você armazena dados na tabela, o mecanismo de armazenamento os salva no arquivo de dados no formato de valores separados por vírgula.

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

Criar uma tabela `CSV` também cria um metafile correspondente que armazena o estado da tabela e o número de strings que existem na tabela. O nome deste arquivo é o mesmo que o nome da tabela com a extensão `CSM`.

Se você examinar o arquivo `test.CSV` no diretório do banco de dados criado ao executar as declarações anteriores, seu conteúdo deve parecer assim:

```sql
"1","record one"
"2","record two"
```

Esse formato pode ser lido e até mesmo escrito por aplicativos de planilha, como o Microsoft Excel.

### 15.4.1 Reparo e verificação de tabelas CSV

O motor de armazenamento `CSV` suporta as declarações `CHECK TABLE` e `REPAIR TABLE` para verificar e, se possível, reparar uma tabela `CSV` danificada.

Ao executar a declaração `CHECK TABLE`, o arquivo `CSV` é verificado quanto à validade, procurando os separadores de campo corretos, campos escamados (com aspas correspondentes ou ausentes), o número correto de campos em comparação com a definição da tabela e a existência de um metafile correspondente `CSV`. A primeira string inválida descoberta reporta um erro. A verificação de uma tabela válida produz uma saída como a mostrada abaixo:

```sql
mysql> CHECK TABLE csvtest;
+--------------+-------+----------+----------+
| Table        | Op    | Msg_type | Msg_text |
+--------------+-------+----------+----------+
| test.csvtest | check | status   | OK       |
+--------------+-------+----------+----------+
```

Uma verificação em uma tabela corrompida retorna um erro como

```sql
mysql> CHECK TABLE csvtest;
+--------------+-------+----------+----------+
| Table        | Op    | Msg_type | Msg_text |
+--------------+-------+----------+----------+
| test.csvtest | check | error    | Corrupt  |
+--------------+-------+----------+----------+
```

Para reparar uma tabela, use `REPAIR TABLE`(repair-table.html "13.7.2.5 REPAIR TABLE Statement"), que copia quantas strings válidas possíveis das informações existentes no arquivo `CSV`, e depois substitui o arquivo existente `CSV` com as strings recuperadas. Quaisquer strings além dos dados corrompidos são perdidas.

```sql
mysql> REPAIR TABLE csvtest;
+--------------+--------+----------+----------+
| Table        | Op     | Msg_type | Msg_text |
+--------------+--------+----------+----------+
| test.csvtest | repair | status   | OK       |
+--------------+--------+----------+----------+
```

Aviso

Durante a reparação, apenas as strings do arquivo `CSV` até a primeira string danificada são copiadas para a nova tabela. Todas as outras strings, desde a primeira string danificada até o final da tabela, são removidas, mesmo as strings válidas.

### 15.4.2 Limitações do CSV

O motor de armazenamento `CSV` não suporta indexação.

A partição não é suportada para tabelas que utilizam o mecanismo de armazenamento `CSV`.

Todas as tabelas que você criar usando o mecanismo de armazenamento `CSV` devem ter o atributo `NOT NULL` em todas as colunas.