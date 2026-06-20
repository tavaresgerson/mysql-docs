# Capítulo 12 Funções e Operadores

As expressões podem ser usadas em vários pontos em declarações SQL, como nas cláusulas `ORDER BY` ou `HAVING` de declarações `SELECT`, na cláusula `WHERE` de um `SELECT`, `DELETE` ou `UPDATE`, ou em declarações `SET`. As expressões podem ser escritas usando valores de várias fontes, como valores literais, valores de coluna, `NULL`, variáveis, funções e operadores embutidos, funções carregáveis e funções armazenadas (um tipo de objeto armazenado).

Este capítulo descreve as funções e operadores embutidos que são permitidos para escrever expressões no MySQL. Para informações sobre funções carregáveis e funções armazenadas, consulte a Seção 5.6, “Funções Carregáveis do MySQL Server”, e a Seção 23.2, “Usando Rotinas Armazenadas”. Para as regras que descrevem como o servidor interpreta referências a diferentes tipos de funções, consulte a Seção 9.2.5, “Parágrafo de Nomes de Função e Resolução”.

Uma expressão que contém `NULL` sempre produz um valor de `NULL`, a menos que haja indicação em contrário na documentação de uma função ou operador específico.

Nota

Por padrão, não deve haver espaços em branco entre o nome de uma função e os parênteses que a seguem. Isso ajuda o analisador do MySQL a distinguir entre chamadas de função e referências a tabelas ou colunas que por acaso tenham o mesmo nome que uma função. No entanto, espaços ao redor dos argumentos da função são permitidos.

Para dizer ao servidor MySQL que aceite espaços após os nomes das funções, iniciando-o com a opção `--sql-mode=IGNORE_SPACE`. (Veja a Seção 5.1.10, “Modos SQL do servidor”.) Programas individuais de cliente podem solicitar esse comportamento usando a opção `CLIENT_IGNORE_SPACE` para `mysql_real_connect()`. Em qualquer caso, todos os nomes das funções se tornam palavras reservadas.

Por questões de brevidade, alguns exemplos neste capítulo exibem a saída do programa **mysql** em forma abreviada. Em vez de mostrar exemplos neste formato:

```sql
mysql> SELECT MOD(29,9);
+-----------+
| mod(29,9) |
+-----------+
|         2 |
+-----------+
1 rows in set (0.00 sec)
```

Este formato é usado em vez disso:

```sql
mysql> SELECT MOD(29,9);
        -> 2
```