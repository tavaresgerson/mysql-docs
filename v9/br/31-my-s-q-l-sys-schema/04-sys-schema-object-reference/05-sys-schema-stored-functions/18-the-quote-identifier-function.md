#### 30.4.5.18 A função quote\_identifier()

Dado um argumento de string, essa função gera um identificador com aspas adequado para inclusão em instruções SQL. Isso é útil quando um valor a ser usado como identificador é uma palavra reservada ou contém caracteres de barra invertida (`` ` ``).

##### Parâmetros

`in_identifier TEXT`: O identificador a ser citado.

##### Valor de retorno

Um valor `TEXT`.

##### Exemplo

```
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