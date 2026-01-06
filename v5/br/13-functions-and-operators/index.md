# Capítulo 12 Funções e Operadores

**Índice**

12.1 Função integrada e referência ao operador

12.2 Referência de Função Carregável

12.3 Conversão de Tipo na Avaliação de Expressões

12.4 Operadores:   12.4.1 Precedência do Operador

```
12.4.2 Comparison Functions and Operators

12.4.3 Logical Operators

12.4.4 Assignment Operators
```

12.5 Funções de Controle de Fluxo

12.6 Funções e operadores numéricos:   12.6.1 Operadores aritméticos

```
12.6.2 Mathematical Functions
```

12.7 Funções de data e hora

12.8 Funções e operadores de strings:   12.8.1 Funções e operadores de comparação de strings

```
12.8.2 Regular Expressions

12.8.3 Character Set and Collation of Function Results
```

12.9 Funções de pesquisa de texto completo:   12.9.1 Pesquisas de texto completo em linguagem natural

```
12.9.2 Boolean Full-Text Searches

12.9.3 Full-Text Searches with Query Expansion

12.9.4 Full-Text Stopwords

12.9.5 Full-Text Restrictions

12.9.6 Fine-Tuning MySQL Full-Text Search

12.9.7 Adding a User-Defined Collation for Full-Text Indexing

12.9.8 ngram Full-Text Parser

12.9.9 MeCab Full-Text Parser Plugin
```

12.10 Funções e operadores de cast

12.11 Funções XML

12.12 Funções e operadores de bits

12.13 Funções de Criptografia e Compressão

12.14 Funções de bloqueio

12.15 Funções de Informação

12.16 Funções de Análise Espacial:   12.16.1 Referência de Função Espacial

```
12.16.2 Argument Handling by Spatial Functions

12.16.3 Functions That Create Geometry Values from WKT Values

12.16.4 Functions That Create Geometry Values from WKB Values

12.16.5 MySQL-Specific Functions That Create Geometry Values

12.16.6 Geometry Format Conversion Functions

12.16.7 Geometry Property Functions

12.16.8 Spatial Operator Functions

12.16.9 Functions That Test Spatial Relations Between Geometry Objects

12.16.10 Spatial Geohash Functions

12.16.11 Spatial GeoJSON Functions

12.16.12 Spatial Convenience Functions
```

12.17 Funções JSON:   12.17.1 Referência de Funções JSON

```
12.17.2 Functions That Create JSON Values

12.17.3 Functions That Search JSON Values

12.17.4 Functions That Modify JSON Values

12.17.5 Functions That Return JSON Value Attributes

12.17.6 JSON Utility Functions
```

12.18 Funções usadas com Identificadores de Transação Global (GTIDs)

12.19 Funções Agregadas:   12.19.1 Descrições das Funções Agregadas

```
12.19.2 GROUP BY Modifiers

12.19.3 MySQL Handling of GROUP BY

12.19.4 Detection of Functional Dependence
```

12.20 Funções Diversas

12.21 Matemática de Precisão:   12.21.1 Tipos de Valores Numéricos

```
12.21.2 DECIMAL Data Type Characteristics

12.21.3 Expression Handling

12.21.4 Rounding Behavior

12.21.5 Precision Math Examples
```

As expressões podem ser usadas em vários pontos nas instruções SQL, como nas cláusulas `ORDER BY` ou `HAVING` das instruções `SELECT`, na cláusula `WHERE` de uma instrução `SELECT`, `DELETE` ou `UPDATE`, ou nas instruções `SET`. As expressões podem ser escritas usando valores de várias fontes, como valores literais, valores de colunas, `NULL`, variáveis, funções e operadores embutidos, funções carregáveis e funções armazenadas (um tipo de objeto armazenado).

Este capítulo descreve as funções e operadores integrados que são permitidos para escrever expressões no MySQL. Para informações sobre funções carregáveis e funções armazenadas, consulte a Seção 5.6, “Funções Carregáveis do MySQL Server”, e a Seção 23.2, “Uso de Rotinas Armazenadas”. Para as regras que descrevem como o servidor interpreta referências a diferentes tipos de funções, consulte a Seção 9.2.5, “Análise e Resolução de Nomes de Função”.

Uma expressão que contém `NULL` sempre produz um valor `NULL`, a menos que haja indicação em contrário na documentação de uma função ou operador específico.

Nota

Por padrão, não deve haver espaços em branco entre o nome de uma função e o parêntese que a segue. Isso ajuda o analisador do MySQL a distinguir entre chamadas de função e referências a tabelas ou colunas que tenham o mesmo nome que uma função. No entanto, espaços ao redor dos argumentos da função são permitidos.

Para informar ao servidor MySQL que aceite espaços após os nomes de funções, iniciando-o com a opção `--sql-mode=IGNORE_SPACE`. (Veja a Seção 5.1.10, “Modos SQL do Servidor”.) Programas individuais de cliente podem solicitar esse comportamento usando a opção `CLIENT_IGNORE_SPACE` para `mysql_real_connect()`. Em ambos os casos, todos os nomes de funções se tornam palavras reservadas.

Por questões de brevidade, alguns exemplos neste capítulo mostram o resultado do programa **mysql** em forma abreviada. Em vez de mostrar exemplos neste formato:

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
