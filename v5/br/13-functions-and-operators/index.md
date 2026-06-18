# Capítulo 12 Funções e Operadores

**Índice**

12.1 Referência de Funções e Operadores Integrados (Built-In)

12.2 Referência de Funções Carregáveis (Loadable)

12.3 Conversão de Tipos na Avaliação de Expressões

12.4 Operadores :   12.4.1 Precedência de Operadores

    12.4.2 Funções e Operadores de Comparação

    12.4.3 Operadores Lógicos

    12.4.4 Operadores de Atribuição

12.5 Funções de Controle de Fluxo

12.6 Funções e Operadores Numéricos :   12.6.1 Operadores Aritméticos

    12.6.2 Funções Matemáticas

12.7 Funções de Data e Hora

12.8 Funções e Operadores de String :   12.8.1 Funções e Operadores de Comparação de String

    12.8.2 Expressões Regulares

    12.8.3 Conjunto de Caracteres (Character Set) e Collation dos Resultados de Funções

12.9 Funções de Pesquisa Full-Text :   12.9.1 Pesquisas Full-Text em Linguagem Natural

    12.9.2 Pesquisas Full-Text Booleanas

    12.9.3 Pesquisas Full-Text com Query Expansion

    12.9.4 Stopwords de Full-Text

    12.9.5 Restrições de Full-Text

    12.9.6 Ajustando a Pesquisa Full-Text do MySQL

    12.9.7 Adicionando um Collation Definido pelo Usuário para Indexação Full-Text

    12.9.8 Parser Full-Text ngram

    12.9.9 Plugin Parser Full-Text MeCab

12.10 Funções e Operadores de Cast

12.11 Funções XML

12.12 Funções e Operadores de Bit

12.13 Funções de Criptografia e Compressão

12.14 Funções de Locking

12.15 Funções de Informação

12.16 Funções de Análise Espacial :   12.16.1 Referência de Funções Espaciais

    12.16.2 Manipulação de Argumentos por Funções Espaciais

    12.16.3 Funções Que Criam Valores Geometry a Partir de Valores WKT

    12.16.4 Funções Que Criam Valores Geometry a Partir de Valores WKB

    12.16.5 Funções Específicas do MySQL Que Criam Valores Geometry

    12.16.6 Funções de Conversão de Formato Geometry

    12.16.7 Funções de Propriedades Geometry

    12.16.8 Funções de Operadores Espaciais

    12.16.9 Funções Que Testam Relações Espaciais Entre Objetos Geometry

    12.16.10 Funções Geohash Espaciais

    12.16.11 Funções GeoJSON Espaciais

    12.16.12 Funções de Conveniência Espaciais

12.17 Funções JSON :   12.17.1 Referência de Funções JSON

    12.17.2 Funções Que Criam Valores JSON

    12.17.3 Funções Que Pesquisam Valores JSON

    12.17.4 Funções Que Modificam Valores JSON

    12.17.5 Funções Que Retornam Atributos de Valores JSON

    12.17.6 Funções de Utilidade JSON

12.18 Funções Usadas com Identificadores Globais de Transação (GTIDs)

12.19 Funções Agregadas (Aggregate) :   12.19.1 Descrições de Funções Agregadas

    12.19.2 Modificadores GROUP BY

    12.19.3 Manipulação de GROUP BY pelo MySQL

    12.19.4 Detecção de Dependência Funcional

12.20 Funções Diversas

12.21 Matemática de Precisão :   12.21.1 Tipos de Valores Numéricos

    12.21.2 Características do Tipo de Dados DECIMAL

    12.21.3 Manipulação de Expressões

    12.21.4 Comportamento de Arredondamento

    12.21.5 Exemplos de Matemática de Precisão

Expressões podem ser usadas em vários pontos em comandos SQL, como nas cláusulas `ORDER BY` ou `HAVING` de comandos `SELECT`, na cláusula `WHERE` de comandos `SELECT`, `DELETE` ou `UPDATE`, ou em comandos `SET`. Expressões podem ser escritas usando valores de diversas fontes, como valores literais, valores de coluna, `NULL`, variáveis, funções e operadores built-in (integrados), funções carregáveis (loadable) e stored functions (um tipo de objeto armazenado).

Este capítulo descreve as funções e operadores built-in (integrados) permitidos para escrever Expressões no MySQL. Para informações sobre funções carregáveis (loadable functions) e stored functions, consulte a Seção 5.6, “Funções Carregáveis do Servidor MySQL”, e a Seção 23.2, “Usando Stored Routines”. Para as regras que descrevem como o servidor interpreta referências a diferentes tipos de funções, consulte a Seção 9.2.5, “Análise e Resolução de Nomes de Funções”.

Uma Expression que contém `NULL` sempre produz um valor `NULL`, a menos que seja indicado o contrário na documentação para uma função ou operador específico.

Nota

Por padrão, não deve haver espaço em branco entre um nome de função e o parêntese que o segue. Isso ajuda o parser do MySQL a distinguir entre chamadas de função e referências a tabelas ou colunas que por acaso têm o mesmo nome de uma função. No entanto, espaços ao redor dos argumentos da função são permitidos.

Para instruir o servidor MySQL a aceitar espaços após nomes de funções, inicie-o com a opção `--sql-mode=IGNORE_SPACE`. (Consulte a Seção 5.1.10, “Modos SQL do Servidor”.) Programas cliente individuais podem solicitar este comportamento usando a opção `CLIENT_IGNORE_SPACE` para `mysql_real_connect()`. Em ambos os casos, todos os nomes de função tornam-se palavras reservadas.

Por uma questão de brevidade, alguns exemplos neste capítulo exibem a saída do programa **mysql** em formato abreviado. Em vez de mostrar exemplos neste formato:

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
