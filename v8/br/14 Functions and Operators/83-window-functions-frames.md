### 14.20.3 Especificação da Estrutura da Função Janela

A definição de uma janela usada com uma função de janela pode incluir uma cláusula de frame. Um frame é um subconjunto da partição atual e a cláusula de frame especifica como definir o subconjunto.

Os frames são determinados em relação à linha atual, o que permite que um frame se mova dentro de uma partição dependendo da localização da linha atual dentro de sua partição. Exemplos:

* Definindo um frame como sendo todas as linhas da partição do início até a linha atual, você pode calcular totais acumulados para cada linha.
* Definindo um frame como estendendo *`N`* linhas em ambos os lados da linha atual, você pode calcular médias móveis.

A consulta a seguir demonstra o uso de frames móveis para calcular totais acumulados dentro de cada grupo de valores de `level` ordenados temporalmente, bem como médias móveis calculadas a partir da linha atual e das linhas que a precedem e a seguem imediatamente:

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

Para a coluna `running_average`, não há linha de frame que preceida a primeira ou que siga a última. Nesses casos, `AVG()` calcula a média das linhas disponíveis.

As funções agregadas usadas como funções de janela operam em linhas no frame da linha atual, assim como essas funções de janela não agregadas:

```
FIRST_VALUE()
LAST_VALUE()
NTH_VALUE()
```

O SQL padrão especifica que funções de janela que operam em toda a partição não devem ter uma cláusula de frame. O MySQL permite uma cláusula de frame para tais funções, mas a ignora. Essas funções usam toda a partição, mesmo que um frame seja especificado:

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

A cláusula de frame, se fornecida, tem a seguinte sintaxe:

```
frame_clause:
    frame_units frame_extent

frame_units:
    {ROWS | RANGE}
```

Na ausência de uma cláusula de frame, o frame padrão depende se uma cláusula `ORDER BY` está presente, conforme descrito mais adiante nesta seção.

O valor *`frame_units`* indica o tipo de relação entre a linha atual e as linhas do frame:

* `ROWS`: O quadro é definido pelas posições iniciais e finais das linhas. Os desvios são diferenças nos números de linha em relação ao número atual de linha.
* `RANGE`: O quadro é definido pelas linhas dentro de uma faixa de valores. Os desvios são diferenças nos valores das linhas em relação ao valor atual da linha.

O valor *`frame_extent`* indica os pontos de início e fim do quadro. Você pode especificar apenas o início do quadro (nesse caso, a linha atual é implicitamente o fim) ou usar `BETWEEN` para especificar ambos os pontos finais do quadro:

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

Com a sintaxe `BETWEEN`, *`frame_start`* não pode ocorrer depois de *`frame_end`*.

Os valores permitidos de *`frame_start`* e *`frame_end`* têm esses significados:

* `CURRENT ROW`: Para `ROWS`, o limite é a linha atual. Para `RANGE`, o limite são os pares da linha atual.
* `UNBOUNDED PRECEDING`: O limite é a primeira linha da partição.
* `UNBOUNDED FOLLOWING`: O limite é a última linha da partição.
* `expr PRECEDING`: Para `ROWS`, o limite são as linhas *`expr`* antes da linha atual. Para `RANGE`, o limite são as linhas com valores iguais ao valor da linha atual menos *`expr`*; se o valor da linha atual for `NULL`, o limite são os pares da linha.

Para `expr PRECEDING` (e `expr FOLLOWING`), *`expr`* pode ser um marcador de parâmetro `?` (para uso em uma declaração preparada), um literal numérico não negativo ou um intervalo temporal na forma `INTERVAL val unit`. Para expressões `INTERVAL`, *`val`* especifica o valor do intervalo não negativo e *`unit`* é uma palavra-chave indicando as unidades nas quais o valor deve ser interpretado. (Para detalhes sobre os especificadores de *`units`* permitidos, consulte a descrição da função  `DATE_ADD()` na Seção 14.7, “Funções de Data e Hora”.)

`RANGE` em um *`expr`* numérico ou temporal requer `ORDER BY` em uma expressão numérica ou temporal, respectivamente.

Exemplos de indicadores válidos de *`expr PRECEDING`* e *`expr FOLLOWING`*:

```
  10 PRECEDING
  INTERVAL 5 DAY PRECEDING
  5 FOLLOWING
  INTERVAL '2:30' MINUTE_SECOND FOLLOWING
  ```
* `expr FOLLOWING`: Para `ROWS`, o limite é *`expr`* linhas após a linha atual. Para `RANGE`, o limite são as linhas com valores iguais ao valor da linha atual mais *`expr`*; se o valor da linha atual for `NULL`, o limite são os pares da linha.

Para valores permitidos de *`expr`*, consulte a descrição de `expr PRECEDING`.

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

Cada função usa as linhas no quadro atual, que, conforme a definição da janela mostrada, se estende da primeira linha da partição até a linha atual. Para as chamadas `NTH_VALUE()`, o quadro atual nem sempre inclui a linha solicitada; nesses casos, o valor de retorno é `NULL`.

Na ausência de uma cláusula de quadro, o quadro padrão depende da presença ou ausência de uma cláusula `ORDER BY`:

* Com `ORDER BY`: O quadro padrão inclui linhas da partição inicial até a linha atual, incluindo todos os pares da linha atual (linhas iguais à linha atual de acordo com a cláusula `ORDER BY`). O padrão é equivalente a esta especificação de quadro:

  ```
  RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ```
* Sem `ORDER BY`: O quadro padrão inclui todas as linhas da partição (porque, sem `ORDER BY`, todas as linhas da partição são pares). O padrão é equivalente a esta especificação de quadro:

  ```
  RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ```

Como o quadro padrão difere dependendo da presença ou ausência de `ORDER BY`, adicionar `ORDER BY` a uma consulta para obter resultados determinísticos pode alterar os resultados. (Por exemplo, os valores produzidos por `SUM()` podem mudar.) Para obter os mesmos resultados, mas ordenados por `ORDER BY`, forneça uma especificação de quadro explícita a ser usada independentemente da presença de `ORDER BY`.

O significado de uma especificação de quadro pode não ser óbvio quando o valor da linha atual é `NULL`. Assumindo que esse seja o caso, esses exemplos ilustram como várias especificações de quadro se aplicam:

* `ORDER BY X ASC RANGE BETWEEN 10 FOLLOWING AND 15 FOLLOWING`

O quadro começa em `NULL` e termina em `NULL`, incluindo assim apenas as linhas com o valor `NULL`.
* `ORDER BY X ASC RANGE BETWEEN 10 SEGUINDO E INDEFINIDO SEGUINDO`

  O quadro começa em `NULL` e termina no final da partição. Como uma ordenação `ASC` coloca os valores `NULL` primeiro, o quadro é toda a partição.
* `ORDER BY X DESC RANGE BETWEEN 10 SEGUINDO E INDEFINIDO SEGUINDO`

  O quadro começa em `NULL` e termina no final da partição. Como uma ordenação `DESC` coloca os valores `NULL` por último, o quadro são apenas os valores `NULL`.
* `ORDER BY X ASC RANGE BETWEEN 10 ANTERIOR E INDEFINIDO SEGUINDO`

  O quadro começa em `NULL` e termina no final da partição. Como uma ordenação `ASC` coloca os valores `NULL` primeiro, o quadro é toda a partição.
* `ORDER BY X ASC RANGE BETWEEN 10 ANTERIOR E 10 SEGUINDO`

  O quadro começa em `NULL` e termina em `NULL`, incluindo assim apenas as linhas com o valor `NULL`.
* `ORDER BY X ASC RANGE BETWEEN INDEFINIDO ANTERIOR E 10 SEGUINDO`

  O quadro começa no início da partição e termina em linhas com o valor `NULL`. Como uma ordenação `ASC` coloca os valores `NULL` primeiro, o quadro são apenas os valores `NULL`.