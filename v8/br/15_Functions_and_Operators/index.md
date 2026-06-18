# Capítulo 14 Funções e Operadores

**Índice**

14.1 Função integrada e referência ao operador

14.2 Referência de Função Carregável

14.3 Conversão de Tipo na Avaliação de Expressões

14.4 Operadores:   14.4.1 Precedência do Operador

```
14.4.2 Comparison Functions and Operators

14.4.3 Logical Operators

14.4.4 Assignment Operators
```

14.5 Funções de controle de fluxo

14.6 Funções e operadores numéricos:   14.6.1 Operadores aritméticos

```
14.6.2 Mathematical Functions
```

14.7 Funções de data e hora

14.8 Funções e operadores de strings:   14.8.1 Funções e operadores de comparação de strings

```
14.8.2 Regular Expressions

14.8.3 Character Set and Collation of Function Results
```

14.9 Funções de pesquisa de texto completo:   14.9.1 Pesquisas de texto completo em linguagem natural

```
14.9.2 Boolean Full-Text Searches

14.9.3 Full-Text Searches with Query Expansion

14.9.4 Full-Text Stopwords

14.9.5 Full-Text Restrictions

14.9.6 Fine-Tuning MySQL Full-Text Search

14.9.7 Adding a User-Defined Collation for Full-Text Indexing

14.9.8 ngram Full-Text Parser

14.9.9 MeCab Full-Text Parser Plugin
```

14.10 Funções e operadores de cast

14.11 Funções XML

14.12 Funções e operadores de bits

14.13 Funções de Criptografia e Compressão

14.14 Funções de bloqueio

14.15 Funções de Informação

14.16 Funções de Análise Espacial:   14.16.1 Referência de Função Espacial

```
14.16.2 Argument Handling by Spatial Functions

14.16.3 Functions That Create Geometry Values from WKT Values

14.16.4 Functions That Create Geometry Values from WKB Values

14.16.5 MySQL-Specific Functions That Create Geometry Values

14.16.6 Geometry Format Conversion Functions

14.16.7 Geometry Property Functions

14.16.8 Spatial Operator Functions

14.16.9 Functions That Test Spatial Relations Between Geometry Objects

14.16.10 Spatial Geohash Functions

14.16.11 Spatial GeoJSON Functions

14.16.12 Spatial Aggregate Functions

14.16.13 Spatial Convenience Functions
```

14.17 Funções JSON:   14.17.1 Referência de Funções JSON

```
14.17.2 Functions That Create JSON Values

14.17.3 Functions That Search JSON Values

14.17.4 Functions That Modify JSON Values

14.17.5 Functions That Return JSON Value Attributes

14.17.6 JSON Table Functions

14.17.7 JSON Schema Validation Functions

14.17.8 JSON Utility Functions
```

14.18 Funções de Replicação:   14.18.1 Funções de Replicação de Grupo

```
14.18.2 Functions Used with Global Transaction Identifiers (GTIDs)

14.18.3 Asynchronous Replication Channel Failover Functions

14.18.4 Position-Based Synchronization Functions
```

14.19 Funções Agregadas:   14.19.1 Descrições das Funções Agregadas

```
14.19.2 GROUP BY Modifiers

14.19.3 MySQL Handling of GROUP BY

14.19.4 Detection of Functional Dependence
```

14.20 Funções de Janela:   14.20.1 Descrições das Funções de Janela

```
14.20.2 Window Function Concepts and Syntax

14.20.3 Window Function Frame Specification

14.20.4 Named Windows

14.20.5 Window Function Restrictions
```

14.21 Funções do Schema de Desempenho

14.22 Funções Internas

14.23 Funções Diversas

14.24 Matemática de Precisão:   14.24.1 Tipos de Valores Numéricos

```
14.24.2 DECIMAL Data Type Characteristics

14.24.3 Expression Handling

14.24.4 Rounding Behavior

14.24.5 Precision Math Examples
```

As expressões podem ser usadas em vários pontos nas instruções SQL, como nas cláusulas `ORDER BY` ou `HAVING` das instruções `SELECT`, na cláusula `WHERE` de uma instrução `SELECT`, `DELETE` ou `UPDATE`, ou nas instruções `SET`. As expressões podem ser escritas usando valores de várias fontes, como valores literais, valores de coluna, `NULL`, variáveis, funções e operadores embutidos, funções carregáveis e funções armazenadas (um tipo de objeto armazenado).

Este capítulo descreve as funções e operadores integrados que são permitidos para escrever expressões no MySQL. Para informações sobre funções carregáveis e funções armazenadas, consulte a Seção 7.7, “Funções Carregáveis do MySQL Server”, e a Seção 27.2, “Uso de Rotinas Armazenadas”. Para as regras que descrevem como o servidor interpreta referências a diferentes tipos de funções, consulte a Seção 11.2.5, “Análise e Resolução de Nomes de Função”.

Uma expressão que contém `NULL` sempre produz um valor `NULL`, a menos que haja indicação em contrário na documentação de uma função ou operador específico.

Nota

Por padrão, não deve haver espaços em branco entre o nome de uma função e o parêntese que a segue. Isso ajuda o analisador do MySQL a distinguir entre chamadas de função e referências a tabelas ou colunas que tenham o mesmo nome que uma função. No entanto, espaços ao redor dos argumentos da função são permitidos.

Para informar ao servidor MySQL que aceite espaços após os nomes de funções, iniciando-o com a opção `--sql-mode=IGNORE_SPACE`. (Veja a Seção 7.1.11, “Modos SQL do Servidor”.) Programas individuais de clientes podem solicitar esse comportamento usando a opção `CLIENT_IGNORE_SPACE` para `mysql_real_connect()`. Em ambos os casos, todos os nomes de funções se tornam palavras reservadas.

Por questões de brevidade, alguns exemplos neste capítulo mostram o resultado do programa **mysql** em forma abreviada. Em vez de mostrar exemplos neste formato:

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
