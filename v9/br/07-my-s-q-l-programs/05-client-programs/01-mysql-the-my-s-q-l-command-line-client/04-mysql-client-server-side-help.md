#### 6.5.1.4 Ajuda do cliente MySQL no lado do servidor

```
mysql> help search_string
```

Se você fornecer um argumento para o comando `help`, o **mysql** usa-o como uma string de pesquisa para acessar a ajuda no lado do servidor a partir do conteúdo do Manual de Referência do MySQL. O funcionamento adequado deste comando requer que as tabelas de ajuda no banco de dados **mysql** sejam inicializadas com informações sobre os tópicos de ajuda (consulte a Seção 7.1.17, “Suporte à Ajuda no Lado do Servidor”).

Se não houver correspondência para a string de pesquisa, a pesquisa falha:

```
mysql> help me

Nothing found
Please try to run 'help contents' for a list of all accessible topics
```

Use **conteúdo da ajuda** para ver uma lista das categorias de ajuda:

```
mysql> help contents
You asked for help about help category: "Contents"
For more information, type 'help <item>', where <item> is one of the
following categories:
   Account Management
   Administration
   Data Definition
   Data Manipulation
   Data Types
   Functions
   Functions and Modifiers for Use with GROUP BY
   Geographic Features
   Language Structure
   Plugins
   Storage Engines
   Stored Routines
   Table Maintenance
   Transactions
   Triggers
```

Se a string de pesquisa corresponder a vários itens, o **mysql** exibe uma lista dos tópicos correspondentes:

```
mysql> help logs
Many help items for your request exist.
To make a more specific request, please type 'help <item>',
where <item> is one of the following topics:
   SHOW
   SHOW BINARY LOGS
   SHOW ENGINE
   SHOW LOGS
```

Use um tópico como string de pesquisa para ver a entrada de ajuda para esse tópico:

```
mysql> help show binary logs
Name: 'SHOW BINARY LOGS'
Description:
Syntax:
SHOW BINARY LOGS

Lists the binary log files on the server. This statement is used as
part of the procedure described in [purge-binary-logs], that shows how
to determine which logs can be purged.
```

```
mysql> SHOW BINARY LOGS;
+---------------+-----------+-----------+
| Log_name      | File_size | Encrypted |
+---------------+-----------+-----------+
| binlog.000015 |    724935 | Yes       |
| binlog.000016 |    733481 | Yes       |
+---------------+-----------+-----------+
```

A string de pesquisa pode conter os caracteres curinga `%` e `_`. Esses têm o mesmo significado que as operações de correspondência de padrões realizadas com o operador `LIKE`. Por exemplo, `HELP rep%` retorna uma lista de tópicos que começam com `rep`:

```
mysql> HELP rep%
Many help items for your request exist.
To make a more specific request, please type 'help <item>',
where <item> is one of the following
topics:
   REPAIR TABLE
   REPEAT FUNCTION
   REPEAT LOOP
   REPLACE
   REPLACE FUNCTION
```