### 10.3.14 Consultas indexadas por colunas TIMESTAMP

Os valores temporais são armazenados em colunas `TIMESTAMP` como valores UTC e os valores inseridos e recuperados a partir de colunas `TIMESTAMP` são convertidos entre o fuso horário da sessão e UTC. (Esse é o mesmo tipo de conversão realizada pela função `CONVERT_TZ()`. Se o fuso horário da sessão for UTC, não há conversão de fuso horário.)

Devido às convenções para mudanças de fuso horário local, como o horário de verão (DST), as conversões entre fuso horário UTC e não UTC não são um para um em ambas as direções. Valores UTC distintos podem não ser distintos em outro fuso horário. O exemplo a seguir mostra valores UTC distintos que se tornam idênticos em um fuso horário não UTC:

```
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

Observação

Para usar fusos horários nomeados, como `'MET'` ou `'Europe/Amsterdam'`, as tabelas de fuso horário devem ser configuradas corretamente. Para obter instruções, consulte a Seção 7.1.15, “Suporte ao Fuso Horário do MySQL Server”.

Você pode ver que os dois valores UTC distintos são os mesmos quando convertidos para o fuso horário `'MET'`. Esse fenômeno pode levar a resultados diferentes para uma consulta específica da coluna `TIMESTAMP`, dependendo se o otimizador usa um índice para executar a consulta.

Suponha que uma consulta selecione valores da tabela mostrada anteriormente usando uma cláusula `WHERE` para buscar a coluna `ts` por um valor específico fornecido pelo usuário, como um literal de timestamp fornecido pelo usuário:

```
SELECT ts FROM tstable
WHERE ts = 'literal';
```

Suponha ainda que a consulta seja executada nessas condições:

* O fuso horário da sessão não é UTC e tem uma mudança de DST. Por exemplo:

  ```
  SET time_zone = 'MET';
  ```

* Valores UTC distintos armazenados na coluna `TIMESTAMP` não são únicos no fuso horário da sessão devido às mudanças de DST. (O exemplo mostrado anteriormente ilustra como isso pode ocorrer.)

* A consulta especifica um valor de pesquisa que está dentro da hora de entrada na DST no fuso horário da sessão.

Nestas condições, a comparação na cláusula `WHERE` ocorre de maneiras diferentes para consultas não indexadas e indexadas e leva a resultados diferentes:

* Se não houver índice ou se o otimizador não puder usá-lo, as comparações ocorrem no fuso horário da sessão. O otimizador realiza uma varredura da tabela, na qual recupera cada valor da coluna `ts`, converte-o do UTC para o fuso horário da sessão e compara-o com o valor de pesquisa (também interpretado no fuso horário da sessão):

  ```
  mysql> SELECT ts FROM tstable
         WHERE ts = '2018-10-28 02:30:00';
  +---------------------+
  | ts                  |
  +---------------------+
  | 2018-10-28 02:30:00 |
  | 2018-10-28 02:30:00 |
  +---------------------+
  ```

  Como os valores `ts` armazenados são convertidos para o fuso horário da sessão, é possível que a consulta retorne dois valores de timestamp que são valores distintos em UTC, mas iguais no fuso horário da sessão: Um valor que ocorre antes da mudança da DST quando os relógios são alterados e um valor que ocorreu após a mudança da DST.

* Se houver um índice utilizável, as comparações ocorrem em UTC. O otimizador realiza uma varredura do índice, primeiro convertendo o valor de pesquisa do fuso horário da sessão para UTC, então comparando o resultado com as entradas do índice em UTC:

  ```
  mysql> ALTER TABLE tstable ADD INDEX (ts);
  mysql> SELECT ts FROM tstable
         WHERE ts = '2018-10-28 02:30:00';
  +---------------------+
  | ts                  |
  +---------------------+
  | 2018-10-28 02:30:00 |
  +---------------------+
  ```

  Neste caso, o valor de pesquisa (convertido) é correspondido apenas às entradas do índice, e como as entradas do índice para os valores distintos armazenados em UTC também são distintas, o valor de pesquisa pode corresponder apenas a uma delas.

Devido à operação diferente do otimizador para consultas não indexadas e indexadas, a consulta produz resultados diferentes em cada caso. O resultado da consulta não indexada retorna todos os valores que correspondem no fuso horário da sessão. A consulta indexada não pode fazer isso:

* É realizada dentro do motor de armazenamento, que conhece apenas os valores em UTC.

* Para os dois valores distintos do fuso horário de sessão que correspondem ao mesmo valor UTC, a pesquisa indexada corresponde apenas à entrada de índice correspondente UTC e retorna apenas uma única linha.

Na discussão anterior, o conjunto de dados armazenado em `tstable` acontece de consistir em valores UTC distintos. Nesses casos, todas as consultas que utilizam o índice na forma mostrada correspondem a, no máximo, uma única entrada de índice.

Se o índice não for `UNIQUE`, é possível que a tabela (e o índice) armazene múltiplas instâncias de um dado valor UTC. Por exemplo, a coluna `ts` pode conter múltiplas instâncias do valor UTC `'2018-10-28 00:30:00'`. Neste caso, a consulta que utiliza o índice retornaria cada uma delas (convertidas para o valor MET `'2018-10-28 02:30:00'` no conjunto de resultados). Resta claro que as consultas que utilizam o índice correspondem ao valor de pesquisa convertido a um único valor nas entradas de índice UTC, em vez de corresponder a múltiplos valores UTC que convertem para o valor de pesquisa no fuso horário de sessão.

Se for importante retornar todos os valores `ts` que correspondem no fuso horário de sessão, a solução é suprimir o uso do índice com uma dica `IGNORE INDEX`:

```
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

A mesma falta de mapeamento um-para-um para conversões de fuso horário em ambas as direções ocorre também em outros contextos, como conversões realizadas com as funções `FROM_UNIXTIME()` e `UNIX_TIMESTAMP()`. Veja a Seção 14.7, “Funções de Data e Hora”.