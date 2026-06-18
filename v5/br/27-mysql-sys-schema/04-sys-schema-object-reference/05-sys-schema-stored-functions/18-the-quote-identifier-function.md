#### 26.4.5.18 A Função quote_identifier()

Dada uma string como argumento, esta função produz um identifier entre aspas adequado para inclusão em comandos SQL. Isso é útil quando um valor a ser usado como um identifier é uma reserved word ou contém caracteres backtick (`` ` ``). Ela foi adicionada no MySQL 5.7.14.

##### Parâmetros

`in_identifier TEXT`: O identifier a ser colocado entre aspas.

##### Valor de Retorno

Um valor `TEXT`.

##### Exemplo

```sql
mysql> SELECT sys.quote_identifier('plain');
+-------------------------------+
| sys.quote_identifier('plain') |
+-------------------------------+
| `plain`                       |
+-------------------------------+
mysql> SELECT sys.quote_identifier('trick`ier');
+-----------------------------------+
| sys.quote_identifier('trick`ier') |
+-----------------------------------+
| `trick``ier`                      |
+-----------------------------------+
mysql> SELECT sys.quote_identifier('integer');
+---------------------------------+
| sys.quote_identifier('integer') |
+---------------------------------+
| `integer`                       |
+---------------------------------+
```