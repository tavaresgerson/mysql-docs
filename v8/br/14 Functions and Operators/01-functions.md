# Capítulo 14 Funções e Operadores

Expressões podem ser usadas em vários pontos nas instruções SQL, como nas cláusulas `ORDER BY` ou `HAVING` das instruções `SELECT`, na cláusula `WHERE` de uma instrução `SELECT`, `DELETE` ou `UPDATE`, ou em instruções `SET`. Expressões podem ser escritas usando valores de várias fontes, como valores literais, valores de colunas, `NULL`, variáveis, funções e operadores embutidos, funções carregáveis e funções armazenadas (um tipo de objeto armazenado).

Este capítulo descreve as funções e operadores embutidos que são permitidos para escrever expressões no MySQL. Para informações sobre funções carregáveis e funções armazenadas, consulte a Seção 7.7, “Funções Carregáveis do MySQL Server”, e a Seção 27.2, “Uso de Rotinas Armazenadas”. Para as regras que descrevem como o servidor interpreta referências a diferentes tipos de funções, consulte a Seção 11.2.5, “Análise e Resolução de Nomes de Funções”.

Uma expressão que contém `NULL` sempre produz um valor `NULL`, a menos que haja indicação em contrário na documentação de uma função ou operador específico.

::: info Nota

Por padrão, não deve haver espaços em branco entre o nome de uma função e o parêntese que a segue. Isso ajuda o analisador do MySQL a distinguir entre chamadas de função e referências a tabelas ou colunas que tenham o mesmo nome que uma função. No entanto, espaços ao redor dos argumentos da função são permitidos.

Para informar ao servidor MySQL que ele deve aceitar espaços após os nomes de funções, iniciando-o com a opção `--sql-mode=IGNORE_SPACE`. (Veja a Seção 7.1.11, “Modos SQL do Servidor”.) Programas clientes individuais podem solicitar esse comportamento usando a opção `CLIENT_IGNORE_SPACE` para `mysql_real_connect()`. Em ambos os casos, todos os nomes de funções se tornam palavras reservadas.


:::

Por falta de espaço, alguns exemplos neste capítulo exibem a saída do programa `mysql` em forma abreviada. Em vez de mostrar exemplos neste formato:

```
mysql> SELECT MOD(29,9);
+-----------+
| mod(29,9) |
+-----------+
|         2 |
+-----------+
1 rows in set (0.00 sec)
```

Este formato é usado em vez disso:

```
mysql> SELECT MOD(29,9);
        -> 2
```