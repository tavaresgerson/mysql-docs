### 10.9.6 Estatísticas do otimizador

A tabela `column_statistics` (estatísticas da coluna) armazena estatísticas de histograma sobre os valores das colunas, para uso do otimizador na construção dos planos de execução das consultas. Para realizar a gestão de histograma, use a instrução `ANALYZE TABLE` (analisar a tabela).

A tabela `column_statistics` tem as seguintes características:

* A tabela contém estatísticas para colunas de todos os tipos de dados, exceto os tipos de geometria (dados espaciais) e `JSON`.

* A tabela é persistente, para que as estatísticas da coluna não precisem ser criadas cada vez que o servidor é iniciado.

* O servidor realiza atualizações na tabela; os usuários não.

A tabela `column_statistics` não é diretamente acessível pelos usuários porque faz parte do dicionário de dados. As informações do histograma estão disponíveis usando `INFORMATION_SCHEMA.COLUMN_STATISTICS`, que é implementada como uma visão na tabela do dicionário de dados. `COLUMN_STATISTICS` tem as seguintes colunas:

* `SCHEMA_NAME`, `TABLE_NAME`, `COLUMN_NAME`: Os nomes do esquema, da tabela e da coluna para os quais as estatísticas se aplicam.

* `HISTOGRAM`: Um valor `JSON` que descreve as estatísticas da coluna, armazenado como um histograma.

Os histogramas de coluna contêm buckets para partes do intervalo de valores armazenados na coluna. Os histogramas são objetos `JSON` para permitir flexibilidade na representação das estatísticas da coluna. Aqui está um exemplo de objeto de histograma:

```
{
  "buckets": [
    [
      1,
      0.3333333333333333
    ],
    [
      2,
      0.6666666666666666
    ],
    [
      3,
      1
    ]
  ],
  "null-values": 0,
  "last-updated": "2017-03-24 13:32:40.000000",
  "sampling-rate": 1,
  "histogram-type": "singleton",
  "number-of-buckets-specified": 128,
  "data-type": "int",
  "collation-id": 8
}
```

Os objetos de histograma têm essas chaves:

* `buckets`: Os buckets do histograma. A estrutura do bucket depende do tipo de histograma.

  Para histogramas `singleton`, os buckets contêm dois valores:

  + Valor 1: O valor do bucket. O tipo depende do tipo de dados da coluna.

  + Valor 2: Um duplo que representa a frequência cumulativa para o valor. Por exemplo, .25 e .75 indicam que 25% e 75% dos valores na coluna são menores ou iguais ao valor do bucket.

Para histogramas de `altura_equivalente`, os buckets contêm quatro valores:

+ Valores 1, 2: Os valores inferiores e superiores inclusivos para o bucket. O tipo depende do tipo de dado da coluna.

+ Valor 3: Um número que representa a frequência cumulativa para o valor. Por exemplo, .25 e .75 indicam que 25% e 75% dos valores na coluna são menores ou iguais ao valor superior do bucket.

+ Valor 4: O número de valores distintos na faixa do valor inferior do bucket até seu valor superior.

* `valores_nulos`: Um número entre 0,0 e 1,0 indicando a fração de valores da coluna que são valores `NULL` do SQL. Se 0, a coluna não contém valores `NULL`.

* `última_atualização`: Quando o histograma foi gerado, como um valor UTC no formato *`YYYY-MM-DD hh:mm:ss.uuuuuu`*.

* `taxa-de-coleta`: Um número entre 0,0 e 1,0 indicando a fração de dados que foram coletados para criar o histograma. Um valor de 1 significa que todos os dados foram lidos (sem coleta).

* `tipo-histograma`: O tipo de histograma:

  + `singleton`: Um bucket representa um único valor na coluna. Esse tipo de histograma é criado quando o número de valores distintos na coluna é menor ou igual ao número de buckets especificados na declaração `ANALYZE TABLE` que gerou o histograma.

  + `altura_equivalente`: Um bucket representa uma faixa de valores. Esse tipo de histograma é criado quando o número de valores distintos na coluna é maior que o número de buckets especificados na declaração `ANALYZE TABLE` que gerou o histograma.

* `número-de-buckets-especificados`: O número de buckets especificados na declaração `ANALYZE TABLE` que gerou o histograma.

* `data-type`: O tipo de dados que este histograma contém. Isso é necessário ao ler e analisar histogramas de armazenamento persistente para a memória. O valor é um dos `int`, `uint` (inteiro sem sinal), `double`, `decimal`, `datetime` ou `string` (inclui strings de caracteres e binárias).

* `collation-id`: O ID de colagem para os dados do histograma. É principalmente significativo quando o valor de `data-type` é `string`. Os valores correspondem aos valores da coluna `ID` na tabela `COLLATIONS` do Schema de Informações.

Para extrair valores específicos dos objetos do histograma, você pode usar operações `JSON`. Por exemplo:

```
mysql> SELECT
         TABLE_NAME, COLUMN_NAME,
         HISTOGRAM->>'$."data-type"' AS 'data-type',
         JSON_LENGTH(HISTOGRAM->>'$."buckets"') AS 'bucket-count'
       FROM INFORMATION_SCHEMA.COLUMN_STATISTICS;
+-----------------+-------------+-----------+--------------+
| TABLE_NAME      | COLUMN_NAME | data-type | bucket-count |
+-----------------+-------------+-----------+--------------+
| country         | Population  | int       |          226 |
| city            | Population  | int       |         1024 |
| countrylanguage | Language    | string    |          457 |
+-----------------+-------------+-----------+--------------+
```

O otimizador usa estatísticas de histograma, se aplicável, para colunas de qualquer tipo de dados para o qual estatísticas são coletadas. O otimizador aplica estatísticas de histograma para determinar estimativas de linha com base na seletividade (efeito de filtragem) das comparações de valores de coluna contra valores constantes. Predicados dessa forma se qualificam para o uso de histograma:

```
col_name = constant
col_name <> constant
col_name != constant
col_name > constant
col_name < constant
col_name >= constant
col_name <= constant
col_name IS NULL
col_name IS NOT NULL
col_name BETWEEN constant AND constant
col_name NOT BETWEEN constant AND constant
col_name IN (constant[, constant] ...)
col_name NOT IN (constant[, constant] ...)
```

Por exemplo, essas declarações contêm predicados que se qualificam para o uso de histograma:

```
SELECT * FROM orders WHERE amount BETWEEN 100.0 AND 300.0;
SELECT * FROM tbl WHERE col1 = 15 AND col2 > 100;
```

O requisito de comparação contra um valor constante inclui funções que são constantes, como `ABS()` e `FLOOR()`:

```
SELECT * FROM tbl WHERE col1 < ABS(-34);
```

As estatísticas de histograma são úteis principalmente para colunas não indexadas. Adicionar um índice a uma coluna para a qual as estatísticas de histograma são aplicáveis também pode ajudar o otimizador a fazer estimativas de linha. As compensações são:

* Um índice deve ser atualizado quando os dados da tabela são modificados.
* Um histograma é criado ou atualizado apenas sob demanda, portanto, não adiciona sobrecarga quando os dados da tabela são modificados. Por outro lado, as estatísticas se tornam progressivamente mais desatualizadas quando ocorrem modificações na tabela, até a próxima vez que são atualizadas.

O otimizador prefere as estimativas de linha do otimizador de intervalo em relação às obtidas a partir das estatísticas do histograma. Se o otimizador determinar que o otimizador de intervalo deve ser aplicado, ele não usará as estatísticas do histograma.

Para colunas indexadas, as estimativas de linha podem ser obtidas para comparações de igualdade usando mergulhos no índice (consulte a Seção 10.2.1.2, “Otimização de Intervalo”). Nesse caso, as estatísticas do histograma não são necessariamente úteis, pois os mergulhos no índice podem fornecer melhores estimativas.

Em alguns casos, o uso de estatísticas do histograma pode não melhorar a execução da consulta (por exemplo, se as estatísticas estiverem desatualizadas). Para verificar se esse é o caso, use `ANALYZE TABLE` para regenerar as estatísticas do histograma e, em seguida, execute a consulta novamente.

Alternativamente, para desabilitar as estatísticas do histograma, use `ANALYZE TABLE` para excluí-las. Um método diferente de desabilitar as estatísticas do histograma é desativar a bandeira `condition_fanout_filter` da variável de sistema `optimizer_switch` (embora isso possa desativar outras otimizações também):

```
SET optimizer_switch='condition_fanout_filter=off';
```

Se as estatísticas do histograma forem usadas, o efeito resultante é visível usando `EXPLAIN`. Considere a seguinte consulta, onde não há índice disponível para a coluna `col1`:

```
SELECT * FROM t1 WHERE col1 < 24;
```

Se as estatísticas do histograma indicarem que 57% das linhas em `t1` satisfazem o predicado `col1 < 24`, o filtro pode ocorrer mesmo na ausência de um índice, e `EXPLAIN` mostra 57,00 na coluna `filtered`.