### 8.3.11 Buscas Indexadas em Colunas TIMESTAMP

Valores temporais são armazenados em colunas `TIMESTAMP` como valores UTC, e os valores inseridos e recuperados de colunas `TIMESTAMP` são convertidos entre o time zone da sessão e UTC. (Este é o mesmo tipo de conversão realizada pela função `CONVERT_TZ()`. Se o time zone da sessão for UTC, não há, efetivamente, nenhuma conversão de time zone.)

Devido a convenções para alterações locais de time zone, como o Horário de Verão (Daylight Saving Time – DST), as conversões entre UTC e time zones não-UTC não são biunívocas (one-to-one) em ambas as direções. Valores UTC que são distintos podem não ser distintos em outro time zone. O exemplo a seguir mostra valores UTC distintos que se tornam idênticos em um time zone não-UTC:

```sql
mysql> CREATE TABLE tstable (ts TIMESTAMP);
mysql> SET time_zone = 'UTC'; -- insert UTC values
mysql> INSERT INTO tstable VALUES
       ('2018-10-28 00:30:00'),
       ('2018-10-28 01:30:00');
mysql> SELECT ts FROM tstable;
+---------------------+
| ts                  |
+---------------------+
| 2018-10-28 00:30:00 |
| 2018-10-28 01:30:00 |
+---------------------+
mysql> SET time_zone = 'MET'; -- retrieve non-UTC values
mysql> SELECT ts FROM tstable;
+---------------------+
| ts                  |
+---------------------+
| 2018-10-28 02:30:00 |
| 2018-10-28 02:30:00 |
+---------------------+
```

Note

Para usar time zones nomeados, como `'MET'` ou `'Europe/Amsterdam'`, as tabelas de time zone devem ser configuradas corretamente. Para instruções, consulte a Seção 5.1.13, “MySQL Server Time Zone Support”.

Você pode ver que os dois valores UTC distintos são os mesmos quando convertidos para o time zone `'MET'`. Este fenômeno pode levar a resultados diferentes para uma determinada Query em colunas `TIMESTAMP`, dependendo de o Optimizer usar ou não um Index para executar a Query.

Suponha que uma Query selecione valores da tabela mostrada anteriormente usando uma `WHERE` clause para buscar na coluna `ts` por um único valor específico, como um literal de timestamp fornecido pelo usuário:

```sql
SELECT ts FROM tstable
WHERE ts = 'literal';
```

Suponha, ainda, que a Query seja executada sob estas condições:

* O time zone da sessão não é UTC e possui uma mudança de DST (Horário de Verão). Por exemplo:

  ```sql
  SET time_zone = 'MET';
  ```

* Valores UTC únicos armazenados na coluna `TIMESTAMP` não são únicos no time zone da sessão devido às mudanças de DST. (O exemplo mostrado anteriormente ilustra como isso pode ocorrer.)

* A Query especifica um valor de busca que está dentro da hora de entrada do DST no time zone da sessão.

Sob essas condições, a comparação na `WHERE` clause ocorre de maneiras diferentes para buscas não-indexadas e buscas indexadas, e leva a resultados diferentes:

* Se não houver Index ou se o Optimizer não puder usá-lo, as comparações ocorrem no time zone da sessão. O Optimizer executa um Table Scan no qual ele recupera cada valor da coluna `ts`, o converte de UTC para o time zone da sessão e o compara ao valor de busca (também interpretado no time zone da sessão):

  ```sql
  mysql> SELECT ts FROM tstable
         WHERE ts = '2018-10-28 02:30:00';
  +---------------------+
  | ts                  |
  +---------------------+
  | 2018-10-28 02:30:00 |
  | 2018-10-28 02:30:00 |
  +---------------------+
  ```

  Como os valores `ts` armazenados são convertidos para o time zone da sessão, é possível que a Query retorne dois valores de timestamp que são distintos como valores UTC, mas iguais no time zone da sessão: Um valor que ocorre antes da mudança de DST, quando os relógios são ajustados, e um valor que ocorre após a mudança de DST.

* Se houver um Index utilizável, as comparações ocorrem em UTC. O Optimizer executa um Index Scan, convertendo primeiro o valor de busca do time zone da sessão para UTC e, em seguida, comparando o resultado com as entradas do Index UTC:

  ```sql
  mysql> ALTER TABLE tstable ADD INDEX (ts);
  mysql> SELECT ts FROM tstable
         WHERE ts = '2018-10-28 02:30:00';
  +---------------------+
  | ts                  |
  +---------------------+
  | 2018-10-28 02:30:00 |
  +---------------------+
  ```

  Neste caso, o valor de busca (convertido) é comparado apenas com as entradas do Index e, como as entradas do Index para os valores UTC distintos armazenados também são distintas, o valor de busca pode corresponder apenas a uma delas.

Devido à operação diferente do Optimizer para buscas não-indexadas e indexadas, a Query produz resultados diferentes em cada caso. O resultado da busca não-indexada retorna todos os valores que correspondem no time zone da sessão. A busca indexada não consegue fazer isso:

* Ela é realizada dentro do Storage Engine, que conhece apenas os valores UTC.

* Para os dois valores distintos de time zone da sessão que são mapeados para o mesmo valor UTC, a busca indexada corresponde apenas à entrada Index UTC correspondente e retorna apenas uma única row.

Na discussão anterior, o conjunto de dados armazenado em `tstable` consiste, por acaso, em valores UTC distintos. Nesses casos, todas as Queries que utilizam Index na forma mostrada correspondem a, no máximo, uma entrada Index.

Se o Index não for `UNIQUE`, é possível que a tabela (e o Index) armazene múltiplas instâncias de um determinado valor UTC. Por exemplo, a coluna `ts` pode conter múltiplas instâncias do valor UTC `'2018-10-28 00:30:00'`. Neste caso, a Query que utiliza Index retornaria cada uma delas (convertida para o valor MET `'2018-10-28 02:30:00'` no conjunto de resultados). Continua sendo verdade que as Queries que utilizam Index comparam o valor de busca convertido a um único valor nas entradas Index UTC, em vez de comparar múltiplos valores UTC que se convertem ao valor de busca no time zone da sessão.

Se for importante retornar todos os valores `ts` que correspondem no time zone da sessão, a solução (workaround) é suprimir o uso do Index com uma dica `IGNORE INDEX`:

```sql
mysql> SELECT ts FROM tstable
       IGNORE INDEX (ts)
       WHERE ts = '2018-10-28 02:30:00';
+---------------------+
| ts                  |
+---------------------+
| 2018-10-28 02:30:00 |
| 2018-10-28 02:30:00 |
+---------------------+
```

A mesma falta de mapeamento biunívoco (one-to-one) para conversões de time zone em ambas as direções ocorre em outros contextos também, como conversões realizadas com as funções `FROM_UNIXTIME()` e `UNIX_TIMESTAMP()`. Consulte a Seção 12.7, “Date and Time Functions”.