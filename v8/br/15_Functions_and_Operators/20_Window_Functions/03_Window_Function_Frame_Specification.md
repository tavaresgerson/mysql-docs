### 14.20.3 Especificação do quadro da função de janela

A definição de uma janela usada com uma função de janela pode incluir uma cláusula de moldura. Uma moldura é um subconjunto da partição atual e a cláusula de moldura especifica como definir o subconjunto.

Os quadros são determinados em relação à linha atual, o que permite que um quadro se mova dentro de uma partição, dependendo da localização da linha atual dentro de sua partição. Exemplos:

- Definindo um quadro para ser todas as linhas da partição do início até a linha atual, você pode calcular os totais em execução para cada linha.

- Ao definir um quadro para se estender por `N` linhas em ambos os lados da linha atual, você pode calcular médias móveis.

A consulta a seguir demonstra o uso de quadros em movimento para calcular totalizações em andamento dentro de cada grupo de valores `level` ordenados cronologicamente, bem como médias móveis calculadas a partir da linha atual e das linhas que a precedem e a seguem imediatamente:

```
mysql> SELECT
         time, subject, val,
         SUM(val) OVER (PARTITION BY subject ORDER BY time
                        ROWS UNBOUNDED PRECEDING)
           AS running_total,
         AVG(val) OVER (PARTITION BY subject ORDER BY time
                        ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING)
           AS running_average
       FROM observations;
+----------+---------+------+---------------+-----------------+
| time     | subject | val  | running_total | running_average |
+----------+---------+------+---------------+-----------------+
| 07:00:00 | st113   |   10 |            10 |          9.5000 |
| 07:15:00 | st113   |    9 |            19 |         14.6667 |
| 07:30:00 | st113   |   25 |            44 |         18.0000 |
| 07:45:00 | st113   |   20 |            64 |         22.5000 |
| 07:00:00 | xh458   |    0 |             0 |          5.0000 |
| 07:15:00 | xh458   |   10 |            10 |          5.0000 |
| 07:30:00 | xh458   |    5 |            15 |         15.0000 |
| 07:45:00 | xh458   |   30 |            45 |         20.0000 |
| 08:00:00 | xh458   |   25 |            70 |         27.5000 |
+----------+---------+------+---------------+-----------------+
```

Para a coluna `running_average`, não há uma linha de quadro antes da primeira ou após a última. Nesses casos, `AVG()` calcula a média das linhas disponíveis.

As funções agregadas usadas como funções de janela operam em linhas no quadro de linha atual, assim como essas funções de janela não agregadas:

```
FIRST_VALUE()
LAST_VALUE()
NTH_VALUE()
```

O SQL padrão especifica que as funções de janela que operam em toda a partição não devem ter a cláusula frame. O MySQL permite uma cláusula frame para essas funções, mas ignora-a. Essas funções usam toda a partição, mesmo que uma frame seja especificada:

```
CUME_DIST()
DENSE_RANK()
LAG()
LEAD()
NTILE()
PERCENT_RANK()
RANK()
ROW_NUMBER()
```

A cláusula de enquadramento, se houver, tem a seguinte sintaxe:

```
frame_clause:
    frame_units frame_extent

frame_units:
    {ROWS | RANGE}
```

Na ausência de uma cláusula de quadro, o quadro padrão depende da presença ou ausência de uma cláusula `ORDER BY`, conforme descrito mais adiante nesta seção.

O valor `frame_units` indica o tipo de relação entre a linha atual e as linhas do quadro:

- `ROWS`: O quadro é definido pelas posições iniciais e finais das linhas. Os deslocamentos são as diferenças nos números das linhas em relação ao número atual da linha.

- `RANGE`: O quadro é definido por linhas dentro de uma faixa de valores. Os desvios são diferenças nos valores das linhas em relação ao valor atual da linha.

O valor `frame_extent` indica os pontos de início e fim do quadro. Você pode especificar apenas o início do quadro (nesse caso, a linha atual é implicitamente o fim) ou usar `BETWEEN` para especificar ambos os pontos finais do quadro:

```
frame_extent:
    {frame_start | frame_between}

frame_between:
    BETWEEN frame_start AND frame_end

frame_start, frame_end: {
    CURRENT ROW
  | UNBOUNDED PRECEDING
  | UNBOUNDED FOLLOWING
  | expr PRECEDING
  | expr FOLLOWING
}
```

Com a sintaxe `BETWEEN`, `frame_start` não pode ocorrer depois de `frame_end`.

Os valores permitidos `frame_start` e `frame_end` têm esses significados:

- `CURRENT ROW`: Para `ROWS`, o limite é a linha atual. Para `RANGE`, o limite é os pares da linha atual.

- `UNBOUNDED PRECEDING`: A linha de partição vinculada é a primeira linha de partição.

- `UNBOUNDED FOLLOWING`: A linha de partição vinculada é a última linha da partição.

- `expr PRECEDING`: Para `ROWS`, o limite é `expr` linhas antes da linha atual. Para `RANGE`, o limite são as linhas com valores iguais ao valor da linha atual, menos `expr`; se o valor da linha atual for `NULL`, o limite são os pares da linha.

  Para `expr PRECEDING` (e `expr FOLLOWING`), `expr` pode ser um marcador de parâmetro `?` (para uso em uma declaração preparada), um literal numérico não negativo ou um intervalo temporal na forma `INTERVAL val unit`. Para expressões de `INTERVAL`, `val` especifica o valor do intervalo não negativo, e `unit` é uma palavra-chave que indica as unidades nas quais o valor deve ser interpretado. (Para detalhes sobre os especificadores `units` permitidos, consulte a descrição da função `DATE_ADD()` na Seção 14.7, “Funções de Data e Hora”.)

  `RANGE` em uma expressão numérica ou temporal `expr` requer `ORDER BY` em uma expressão numérica ou temporal, respectivamente.

  Exemplos de indicadores válidos `expr PRECEDING` e `expr FOLLOWING`:

  ```
  10 PRECEDING
  INTERVAL 5 DAY PRECEDING
  5 FOLLOWING
  INTERVAL '2:30' MINUTE_SECOND FOLLOWING
  ```

- `expr FOLLOWING`: Para `ROWS`, o limite é `expr` linhas após a linha atual. Para `RANGE`, o limite são as linhas com valores iguais ao valor da linha atual mais `expr`; se o valor da linha atual for `NULL`, o limite são os pares da linha.

  Para os valores permitidos de `expr`, consulte a descrição de `expr PRECEDING`.

A consulta a seguir demonstra `FIRST_VALUE()`, `LAST_VALUE()` e duas instâncias de `NTH_VALUE()`:

```
mysql> SELECT
         time, subject, val,
         FIRST_VALUE(val)  OVER w AS 'first',
         LAST_VALUE(val)   OVER w AS 'last',
         NTH_VALUE(val, 2) OVER w AS 'second',
         NTH_VALUE(val, 4) OVER w AS 'fourth'
       FROM observations
       WINDOW w AS (PARTITION BY subject ORDER BY time
                    ROWS UNBOUNDED PRECEDING);
+----------+---------+------+-------+------+--------+--------+
| time     | subject | val  | first | last | second | fourth |
+----------+---------+------+-------+------+--------+--------+
| 07:00:00 | st113   |   10 |    10 |   10 |   NULL |   NULL |
| 07:15:00 | st113   |    9 |    10 |    9 |      9 |   NULL |
| 07:30:00 | st113   |   25 |    10 |   25 |      9 |   NULL |
| 07:45:00 | st113   |   20 |    10 |   20 |      9 |     20 |
| 07:00:00 | xh458   |    0 |     0 |    0 |   NULL |   NULL |
| 07:15:00 | xh458   |   10 |     0 |   10 |     10 |   NULL |
| 07:30:00 | xh458   |    5 |     0 |    5 |     10 |   NULL |
| 07:45:00 | xh458   |   30 |     0 |   30 |     10 |     30 |
| 08:00:00 | xh458   |   25 |     0 |   25 |     10 |     30 |
+----------+---------+------+-------+------+--------+--------+
```

Cada função usa as linhas do quadro atual, que, conforme a definição da janela mostrada, se estende da primeira linha de partição até a linha atual. Para as chamadas `NTH_VALUE()`, o quadro atual nem sempre inclui a linha solicitada; nesses casos, o valor de retorno é `NULL`.

Na ausência de uma cláusula de quadro, o quadro padrão depende se uma cláusula `ORDER BY` está presente:

- Com `ORDER BY`: A estrutura padrão inclui linhas a partir do início da partição até a linha atual, incluindo todos os pares da linha atual (linhas iguais à linha atual de acordo com a cláusula `ORDER BY`). A estrutura padrão é equivalente a esta especificação de estrutura:

  ```
  RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ```

- Sem `ORDER BY`: A estrutura padrão inclui todas as linhas de partição (porque, sem `ORDER BY`, todas as linhas de partição são iguais). A estrutura padrão é equivalente a esta especificação de estrutura:

  ```
  RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ```

Como o quadro padrão difere dependendo da presença ou ausência de `ORDER BY`, adicionar `ORDER BY` a uma consulta para obter resultados determinísticos pode alterar os resultados. (Por exemplo, os valores produzidos por `SUM()` podem mudar.) Para obter os mesmos resultados, mas ordenados por `ORDER BY`, forneça uma especificação de quadro explícita a ser usada, independentemente de `ORDER BY` estar presente.

O significado de uma especificação de quadro pode não ser óbvio quando o valor da linha atual é `NULL`. Supondo que esse seja o caso, esses exemplos ilustram como várias especificações de quadro se aplicam:

- `ORDER BY X ASC RANGE BETWEEN 10 FOLLOWING AND 15 FOLLOWING`

  O quadro começa em `NULL` e termina em `NULL`, incluindo, portanto, apenas as linhas com o valor `NULL`.

- `ORDER BY X ASC RANGE BETWEEN 10 FOLLOWING AND UNBOUNDED FOLLOWING`

  O quadro começa em `NULL` e termina no final da partição. Como uma classificação `ASC` coloca os valores `NULL` primeiro, o quadro é toda a partição.

- `ORDER BY X DESC RANGE BETWEEN 10 FOLLOWING AND UNBOUNDED FOLLOWING`

  O quadro começa em `NULL` e termina no final da partição. Como uma classificação `DESC` coloca os valores `NULL` por último, o quadro é composto apenas pelos valores `NULL`.

- `ORDER BY X ASC RANGE BETWEEN 10 PRECEDING AND UNBOUNDED FOLLOWING`

  O quadro começa em `NULL` e termina no final da partição. Como uma classificação `ASC` coloca os valores `NULL` primeiro, o quadro é toda a partição.

- `ORDER BY X ASC RANGE BETWEEN 10 PRECEDING AND 10 FOLLOWING`

  O quadro começa em `NULL` e termina em `NULL`, incluindo, portanto, apenas as linhas com o valor `NULL`.

- `ORDER BY X ASC RANGE BETWEEN 10 PRECEDING AND 1 PRECEDING`

  O quadro começa em `NULL` e termina em `NULL`, incluindo, portanto, apenas as linhas com o valor `NULL`.

- `ORDER BY X ASC RANGE BETWEEN UNBOUNDED PRECEDING AND 10 FOLLOWING`

  O quadro começa no início da partição e para nas linhas com o valor `NULL`. Como uma classificação `ASC` coloca os valores `NULL` primeiro, o quadro é composto apenas pelos valores `NULL`.
