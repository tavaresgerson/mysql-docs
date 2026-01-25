#### 4.5.1.4 Ajuda Server-Side do Cliente mysql

```sql
mysql> help search_string
```

Se você fornecer um argumento para o comando `help`, o **mysql** o utiliza como uma string de busca para acessar a ajuda server-side a partir do conteúdo do Manual de Referência do MySQL. O funcionamento adequado deste comando requer que as tabelas de `help` no `database` `mysql` sejam inicializadas com informações de tópicos de ajuda (consulte a Seção 5.1.14, “Suporte a Ajuda Server-Side”).

Se não houver correspondência para a string de busca, a busca falha:

```sql
mysql> help me

Nothing found
Please try to run 'help contents' for a list of all accessible topics
```

Use **help contents** para ver uma lista das categorias de ajuda:

```sql
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

Se a string de busca corresponder a múltiplos itens, o **mysql** mostra uma lista de tópicos correspondentes:

```sql
mysql> help logs
Many help items for your request exist.
To make a more specific request, please type 'help <item>',
where <item> is one of the following topics:
   SHOW
   SHOW BINARY LOGS
   SHOW ENGINE
   SHOW LOGS
```

Use um tópico como a string de busca para ver a entrada de ajuda para aquele tópico:

```sql
mysql> help show binary logs
Name: 'SHOW BINARY LOGS'
Description:
Syntax:
SHOW BINARY LOGS
SHOW MASTER LOGS

Lists the binary log files on the server. This statement is used as
part of the procedure described in [purge-binary-logs], that shows how
to determine which logs can be purged.
```

```sql
mysql> SHOW BINARY LOGS;
+---------------+-----------+
| Log_name      | File_size |
+---------------+-----------+
| binlog.000015 |    724935 |
| binlog.000016 |    733481 |
+---------------+-----------+
```

A string de busca pode conter os caracteres `wildcard` `%` e `_`. Estes têm o mesmo significado que nas operações de pattern-matching realizadas com o operador `LIKE`. Por exemplo, `HELP rep%` retorna uma lista de tópicos que começam com `rep`:

```sql
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