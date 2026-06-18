### 10.9.6 Estatísticas do otimizador

A tabela do dicionário de dados `column_statistics` armazena estatísticas de histograma sobre os valores das colunas, para uso do otimizador na construção dos planos de execução das consultas. Para realizar a gestão do histograma, use a instrução `ANALYZE TABLE`.

A tabela `column_statistics` tem essas características:

- A tabela contém estatísticas para colunas de todos os tipos de dados, exceto os tipos de geometria (dados espaciais) e `JSON`.

- A tabela é persistente, para que as estatísticas das colunas não precisem ser criadas toda vez que o servidor for iniciado.

- O servidor executa as atualizações na tabela; os usuários

A tabela `column_statistics` não é diretamente acessível pelos usuários porque faz parte do dicionário de dados. As informações do histograma estão disponíveis usando `INFORMATION_SCHEMA.COLUMN_STATISTICS`, que é implementado como uma visualização na tabela do dicionário de dados. `COLUMN_STATISTICS` tem essas colunas:

- `SCHEMA_NAME`, `TABLE_NAME`, `COLUMN_NAME`: Os nomes do esquema, da tabela e da coluna para os quais as estatísticas se aplicam.

- `HISTOGRAM`: Um valor `JSON` que descreve as estatísticas da coluna, armazenado como um histograma.

Os histogramas de colunas contêm recipientes para partes da faixa de valores armazenados na coluna. Os histogramas são objetos `JSON` para permitir flexibilidade na representação das estatísticas da coluna. Aqui está um exemplo de objeto de histograma:

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

- `buckets`: Os buckets do histograma. A estrutura do bucket depende do tipo de histograma.

  Para histogramas de `singleton`, os buckets contêm dois valores:

  - Valor 1: O valor para o bucket. O tipo depende do tipo de dado da coluna.

  - Valor 2: Um duplo que representa a frequência cumulativa para o valor. Por exemplo, .25 e .75 indicam que 25% e 75% dos valores na coluna são menores ou iguais ao valor do bucket.

  Para histogramas de `equi-height`, os buckets contêm quatro valores:

  - Valores 1, 2: Os valores de menor e maior inclusivos para o bucket. O tipo depende do tipo de dado da coluna.

  - Valor 3: Um duplo que representa a frequência cumulativa para o valor. Por exemplo, .25 e .75 indicam que 25% e 75% dos valores na coluna são menores ou iguais ao valor superior do bucket.

  - Valor 4: O número de valores distintos na faixa do valor inferior do bucket até o seu valor superior.

- `null-values`: Um número entre 0,0 e 1,0 que indica a fração dos valores da coluna que são valores SQL `NULL`. Se for 0, a coluna não contém valores `NULL`.

- `last-updated`: Quando o histograma foi gerado, como um valor UTC no formato `YYYY-MM-DD hh:mm:ss.uuuuuu`.

- `sampling-rate`: Um número entre 0,0 e 1,0 que indica a fração de dados que foi amostrada para criar o histograma. Um valor de 1 significa que todos os dados foram lidos (sem amostragem).

- `histogram-type`: O tipo de histograma:

  - `singleton`: Um balde representa um único valor na coluna. Este tipo de histograma é criado quando o número de valores distintos na coluna é igual ou menor que o número de baldes especificados na declaração `ANALYZE TABLE` que gerou o histograma.

  - `equi-height`: Um balde representa uma faixa de valores. Esse tipo de histograma é criado quando o número de valores distintos na coluna é maior que o número de baldes especificados na declaração `ANALYZE TABLE` que gerou o histograma.

- `number-of-buckets-specified`: O número de buckets especificados na declaração `ANALYZE TABLE` que gerou o histograma.

- `data-type`: O tipo de dados que este histograma contém. Isso é necessário ao ler e analisar histogramas de armazenamento persistente para a memória. O valor é um dos `int`, `uint` (inteiro sem sinal), `double`, `decimal`, `datetime` ou `string` (inclui strings de caracteres e binárias).

- `collation-id`: O ID de agregação dos dados do histograma. É mais significativo quando o valor de `data-type` é `string`. Os valores correspondem aos valores da coluna `ID` na tabela do Schema de Informações `COLLATIONS`.

Para extrair valores específicos dos objetos de histograma, você pode usar operações `JSON`. Por exemplo:

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

O otimizador utiliza estatísticas de histograma, se aplicável, para colunas de qualquer tipo de dado para o qual as estatísticas são coletadas. O otimizador aplica estatísticas de histograma para determinar estimativas de linha com base na seletividade (efeito de filtragem) das comparações de valores de coluna contra valores constantes. Predicados dessas formas se qualificam para o uso de histograma:

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

Por exemplo, essas declarações contêm predicados que se qualificam para o uso de histogramas:

```
SELECT * FROM orders WHERE amount BETWEEN 100.0 AND 300.0;
SELECT * FROM tbl WHERE col1 = 15 AND col2 > 100;
```

O requisito de comparação com um valor constante inclui funções que são constantes, como `ABS()` e `FLOOR()`:

```
SELECT * FROM tbl WHERE col1 < ABS(-34);
```

As estatísticas de histograma são úteis principalmente para colunas não indexadas. Adicionar um índice a uma coluna para a qual as estatísticas de histograma sejam aplicáveis também pode ajudar o otimizador a fazer estimativas de linhas. As compensações são:

- Um índice deve ser atualizado quando os dados da tabela são modificados.
- Um histograma é criado ou atualizado apenas quando necessário, portanto, não adiciona sobrecarga quando os dados da tabela são modificados. Por outro lado, as estatísticas ficam progressivamente desatualizadas quando ocorrem modificações na tabela, até a próxima atualização.

O otimizador prefere as estimativas de linha do otimizador de intervalo em vez das obtidas a partir das estatísticas do histograma. Se o otimizador determinar que o otimizador de intervalo deve ser aplicado, ele não usará as estatísticas do histograma.

Para colunas indexadas, as estimativas de linha podem ser obtidas para comparações de igualdade usando mergulhos no índice (consulte a Seção 10.2.1.2, “Otimização de intervalo”). Nesse caso, as estatísticas do histograma não são necessariamente úteis, pois os mergulhos no índice podem fornecer estimativas melhores.

Em alguns casos, o uso de estatísticas de histograma pode não melhorar a execução da consulta (por exemplo, se as estatísticas estiverem desatualizadas). Para verificar se esse é o caso, use `ANALYZE TABLE` para regenerar as estatísticas do histograma e, em seguida, execute a consulta novamente.

Como alternativa, para desabilitar as estatísticas do histograma, use `ANALYZE TABLE` para excluí-las. Um método diferente de desabilitar as estatísticas do histograma é desativar a bandeira `condition_fanout_filter` da variável de sistema `optimizer_switch` (embora isso possa desativar outras otimizações também):

```
SET optimizer_switch='condition_fanout_filter=off';
```

Se as estatísticas do histograma forem usadas, o efeito resultante será visível usando `EXPLAIN`. Considere a seguinte consulta, onde não há índice disponível para a coluna `col1`:

```
SELECT * FROM t1 WHERE col1 < 24;
```

Se as estatísticas do histograma indicarem que 57% das linhas em `t1` satisfazem o predicado `col1 < 24`, o filtro pode ocorrer mesmo na ausência de um índice, e `EXPLAIN` mostra 57,00 na coluna `filtered`.
