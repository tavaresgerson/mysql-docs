# Capítulo 14 Funções e Operadores

**Índice**

14.1 Referência de Funções e Operadores Iniciais

14.2 Referência de Funções Carregáveis

14.3 Conversão de Tipo na Avaliação de Expressões

14.4 Operadores :   14.4.1 Precedência dos Operadores

    14.4.2 Funções e Operadores de Comparação

    14.4.3 Operadores Lógicos

    14.4.4 Operadores de Atribuição

14.5 Funções de Controle de Fluxo

14.6 Funções e Operadores Numéricos :   14.6.1 Operadores Aritméticos

    14.6.2 Funções Matemáticas

14.7 Funções de Data e Hora

14.8 Funções e Operadores de String :   14.8.1 Funções e Operadores de Comparação de String

    14.8.2 Expressões Regulares

    14.8.3 Conjunto de Caracteres e Cotação dos Resultados das Funções

14.9 Funções de Busca de Texto Completo :   14.9.1 Pesquisas de Texto Completo em Língua Natural

    14.9.2 Pesquisas de Texto Completo Booleanas

    14.9.3 Pesquisas de Texto Completo com Expansão de Consulta

    14.9.4 Palavras-Chave de Texto Completo

    14.9.5 Restrições de Texto Completo

    14.9.6 Ajuste Fíno da Busca de Texto Completo MySQL

    14.9.7 Adicionando uma Cotação Definida pelo Usuário para o Índex de Texto Completo

    14.9.8 Parser de Texto Completo ngram

    14.9.9 Plugin de Parser de Texto Completo MeCab

14.10 Funções e Operadores de Casting

14.11 Funções XML

14.12 Funções de Bit

14.13 Funções de Criptografia e Compressão

14.14 Funções de Bloqueio

14.15 Funções de Informação

14.16 Funções de Análise Espacial :   14.16.1 Referência de Funções Espaciais

    14.16.2 Manipulação de Argumentos por Funções Espaciais

    14.16.3 Funções que Criam Valores de Geometria a partir de Valores WKT

    14.16.4 Funções que Criam Valores de Geometria a partir de Valores WKB

    14.16.5 Funções Específicas de MySQL que Criam Valores de Geometria

    14.16.6 Funções de Conversão de Formatos de Geometria

    14.16.7 Funções de Propriedade de Geometria

    14.16.8 Funções de Operadores Espaciais

14.16.9 Funções que testam relações espaciais entre objetos geométricos

    14.16.10 Funções GeoHash espaciais

    14.16.11 Funções GeoJSON espaciais

    14.16.12 Funções agregadas espaciais

    14.16.13 Funções de conveniência espaciais

14.17 Funções JSON:   14.17.1 Referência de funções JSON

    14.17.2 Funções que criam valores JSON

    14.17.3 Funções que buscam valores JSON

    14.17.4 Funções que modificam valores JSON

    14.17.5 Funções que retornam atributos de valores JSON

    14.17.6 Funções de tabela JSON

    14.17.7 Funções de validação de esquema JSON

    14.17.8 Funções de utilidade JSON

14.18 Funções de replicação:   14.18.1 Funções de replicação por grupo

    14.18.2 Funções usadas com identificadores de transação global (GTIDs)

    14.18.3 Funções de falha de canal de replicação assíncrona

    14.18.4 Funções de sincronização baseadas em posição

14.19 Funções agregadas:   14.19.1 Descrições das funções agregadas

    14.19.2 Modificadores de GROUP BY

    14.19.3 Tratamento do MySQL de GROUP BY

    14.19.4 Detecção de dependência funcional

14.20 Funções de janela:   14.20.1 Descrições das funções de janela

    14.20.2 Conceitos e sintaxe das funções de janela

    14.20.3 Especificação do quadro da função de janela

    14.20.4 Janelas nomeadas

    14.20.5 Restrições das funções de janela

14.21 Funções vetoriais

14.22 Funções do Schema de desempenho

14.23 Funções internas

14.24 Funções mistas

14.25 Matemática de precisão:   14.25.1 Tipos de valores numéricos

    14.25.2 Características do tipo de dados DECIMAL

    14.25.3 Tratamento de expressões

    14.25.4 Comportamento de arredondamento

    14.25.5 Exemplos de matemática de precisão

As expressões podem ser usadas em vários pontos nas instruções SQL, como nas cláusulas `ORDER BY` ou `HAVING` das instruções `SELECT`, na cláusula `WHERE` de uma instrução `SELECT`, `DELETE` ou `UPDATE`, ou nas instruções `SET`. As expressões podem ser escritas usando valores de várias fontes, como valores literais, valores de colunas, `NULL`, variáveis, funções e operadores embutidos, funções carregáveis e funções armazenadas (um tipo de objeto armazenado).

Este capítulo descreve as funções e operadores embutidos que são permitidos para escrever expressões no MySQL. Para informações sobre funções carregáveis e funções armazenadas, consulte a Seção 7.7, “Funções Carregáveis do MySQL Server”, e a Seção 27.2, “Usando Rotinas Armazenadas”. Para as regras que descrevem como o servidor interpreta referências a diferentes tipos de funções, consulte a Seção 11.2.5, “Análise e Resolução de Nomes de Funções”.

Uma expressão que contém `NULL` sempre produz um valor `NULL`, a menos que haja indicação em contrário na documentação de uma função ou operador específico.

Nota

Por padrão, não deve haver espaços em branco entre o nome de uma função e o parêntese que a segue. Isso ajuda o analisador do MySQL a distinguir entre chamadas de função e referências a tabelas ou colunas que tenham o mesmo nome que uma função. No entanto, espaços ao redor dos argumentos da função são permitidos.

Para informar ao servidor MySQL que deve aceitar espaços após os nomes de funções, iniciando-o com a opção `--sql-mode=IGNORE_SPACE`. (Veja a Seção 7.1.11, “Modos SQL do Servidor”.) Programas clientes individuais podem solicitar esse comportamento usando a opção `CLIENT_IGNORE_SPACE` para `mysql_real_connect()`. Em ambos os casos, todos os nomes de funções se tornam palavras reservadas.

Por questões de brevidade, alguns exemplos neste capítulo exibem a saída do programa **mysql** em forma abreviada. Em vez de mostrar exemplos neste formato:

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