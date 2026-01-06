### 11.2.5 Limitações do ANO(2) de 2 dígitos e migração para o ANO de 4 dígitos

Esta seção descreve os problemas que podem ocorrer ao usar o tipo de dados de 2 dígitos `YEAR(2)` e fornece informações sobre a conversão de colunas existentes de `YEAR(2)` em colunas com valores de ano de 4 dígitos, que podem ser declaradas como `YEAR` com uma largura de exibição implícita de 4 caracteres, ou, de forma equivalente, como `YEAR(4)` com uma largura de exibição explícita.

Embora o intervalo interno de valores para `YEAR`/`YEAR(4)` e o tipo descontinuado `YEAR(2)` seja o mesmo (`1901` a `2155`, e `0000`), a largura de exibição para `YEAR(2)` torna esse tipo inerentemente ambíguo porque os valores exibidos indicam apenas os dois últimos dígitos dos valores internos e omitem os dígitos do século. O resultado pode ser uma perda de informações em certas circunstâncias. Por essa razão, evite usar `YEAR(2)` em suas aplicações e use `YEAR`/`YEAR(4)` sempre que você precisar de um tipo de dado com valor de ano. A partir do MySQL 5.7.5, o suporte para `YEAR(2)` é removido e as colunas existentes de `YEAR(2)` de 2 dígitos devem ser convertidas em colunas `YEAR` de 4 dígitos para serem novamente utilizáveis.

#### ANO(2) Limitações

Os problemas com o tipo de dados `YEAR(2)` incluem ambiguidade dos valores exibidos e possível perda de informações quando os valores são descarregados e carregados novamente ou convertidos em strings.

- Os valores de `YEAR(2)` exibidos podem ser ambíguos. É possível que até três valores de `YEAR(2)` que têm valores internos diferentes tenham o mesmo valor exibido, como demonstra o seguinte exemplo:

  ```sql
  mysql> CREATE TABLE t (y2 YEAR(2), y4 YEAR);
  Query OK, 0 rows affected, 1 warning (0.01 sec)

  mysql> INSERT INTO t (y2) VALUES(1912),(2012),(2112);
  Query OK, 3 rows affected (0.00 sec)
  Records: 3  Duplicates: 0  Warnings: 0

  mysql> UPDATE t SET y4 = y2;
  Query OK, 3 rows affected (0.00 sec)
  Rows matched: 3  Changed: 3  Warnings: 0

  mysql> SELECT * FROM t;
  +------+------+
  | y2   | y4   |
  +------+------+
  |   12 | 1912 |
  |   12 | 2012 |
  |   12 | 2112 |
  +------+------+
  3 rows in set (0.00 sec)
  ```

- Se você usar o **mysqldump** para fazer o dump da tabela criada no exemplo anterior, o arquivo de dump representará todos os valores `y2` usando a mesma representação de 2 dígitos (`12`). Se você recarregar a tabela a partir do arquivo de dump, todas as linhas resultantes terão o valor interno `2012` e o valor exibido será `12`, perdendo assim as distinções entre eles.

- A conversão de um valor de dados `YEAR` de 2 ou 4 dígitos para o formato de string utiliza a largura de exibição do tipo de dados. Suponha que uma coluna `YEAR(2)` e uma coluna `YEAR`/`YEAR(4)` contenham ambos o valor `1970`. Ao atribuir cada coluna a uma string, o resultado é um valor de `'70'` ou `'1970'`, respectivamente. Ou seja, ocorre perda de informações na conversão de `YEAR(2)` para string.

- Os valores fora da faixa de `1970` a `2069` são armazenados incorretamente quando inseridos em uma coluna `YEAR(2)` em uma tabela `CSV`. Por exemplo, ao inserir `2211`, o valor de exibição é `11`, mas o valor interno é `2011`.

Para evitar esses problemas, use o tipo de dado de 4 dígitos `YEAR` ou `YEAR(4)` em vez do tipo de dado de 2 dígitos `YEAR(2)`. Sugestões sobre estratégias de migração aparecem mais adiante nesta seção.

#### Suporte reduzido/removido para YEAR(2) no MySQL 5.7

Antes do MySQL 5.7.5, o suporte para `YEAR(2)` foi reduzido. A partir do MySQL 5.7.5, o suporte para `YEAR(2)` foi removido.

- As definições de coluna `YEAR(2)` para novas tabelas produzem avisos ou erros:

  - Antes do MySQL 5.7.5, as definições de colunas `YEAR(2)` para novas tabelas são convertidas (com uma advertência `ER_INVALID_YEAR_COLUMN_LENGTH`) para colunas `YEAR` de 4 dígitos:

    ```sql
    mysql> CREATE TABLE t1 (y YEAR(2));
    Query OK, 0 rows affected, 1 warning (0.04 sec)

    mysql> SHOW WARNINGS\G
    *************************** 1. row ***************************
      Level: Warning
       Code: 1818
    Message: YEAR(2) column type is deprecated. Creating YEAR(4) column instead.
    1 row in set (0.00 sec)

    mysql> SHOW CREATE TABLE t1\G
    *************************** 1. row ***************************
           Table: t1
    Create Table: CREATE TABLE `t1` (
      `y` year(4) DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1
    1 row in set (0.00 sec)
    ```

  - A partir do MySQL 5.7.5, as definições de colunas `YEAR(2)` para novas tabelas geram um erro `ER_INVALID_YEAR_COLUMN_LENGTH`:

    ```sql
    mysql> CREATE TABLE t1 (y YEAR(2));
    ERROR 1818 (HY000): Supports only YEAR or YEAR(4) column.
    ```

- A coluna `YEAR(2)` em tabelas existentes permanecerá como `YEAR(2)`:

  - Antes do MySQL 5.7.5, o `YEAR(2)` é processado em consultas da mesma forma que em versões mais antigas do MySQL.

  - A partir do MySQL 5.7.5, as colunas `YEAR(2)` em consultas produzem avisos ou erros.

- Vários programas ou declarações convertem automaticamente as colunas `YEAR(2)` em colunas `YEAR` de 4 dígitos:

  - Declarações `ALTER TABLE` que resultam na reconstrução de uma tabela.

  - `REPAIR TABLE` (que `CHECK TABLE` recomenda que você use, se encontrar uma tabela que contém colunas `YEAR(2)`)

  - **mysql\_upgrade** (que usa `REPAIR TABLE`).

  - Exportação com **mysqldump** e recarga do arquivo de exportação. Diferente das conversões realizadas pelos três itens anteriores, uma exportação e recarga pode alterar os valores dos dados.

  Uma atualização do MySQL geralmente envolve pelo menos um dos dois últimos itens. No entanto, em relação ao `YEAR(2)`, **mysql\_upgrade** é preferível a **mysqldump**, que, como mencionado, pode alterar os valores dos dados.

#### Migrando de YEAR(2) para ANO de 4 dígitos

Para converter colunas de `YEAR(2)` de 2 dígitos em colunas de `YEAR` de 4 dígitos, você pode fazer isso manualmente a qualquer momento sem precisar fazer uma atualização. Como alternativa, você pode fazer uma atualização para uma versão do MySQL com suporte reduzido ou removido para `YEAR(2)` (MySQL 5.6.6 ou posterior), e então o MySQL converterá automaticamente as colunas `YEAR(2)`. Neste último caso, evite fazer uma atualização realizando um dump e um reload dos seus dados, pois isso pode alterar os valores dos dados. Além disso, se você estiver usando replicação, há considerações de atualização que você deve levar em conta.

Para converter colunas de `ANO(2)` de 2 dígitos para `ANO` de 4 dígitos manualmente, use `ALTER TABLE` ou `REPAIR TABLE`. Suponha que uma tabela `t1` tenha esta definição:

```sql
CREATE TABLE t1 (ycol YEAR(2) NOT NULL DEFAULT '70');
```

Modifique a coluna usando `ALTER TABLE` da seguinte forma:

```sql
ALTER TABLE t1 FORCE;
```

A instrução `ALTER TABLE` converte a tabela sem alterar os valores de `YEAR(2)`. Se o servidor for uma fonte de replicação, a instrução `ALTER TABLE` replica para as réplicas e faz a mudança correspondente na tabela de cada uma delas.

Outro método de migração é realizar uma atualização binária: Atualize o MySQL in loco sem drenar e recarregar seus dados. Em seguida, execute o **mysql\_upgrade**, que usa o comando `REPAIR TABLE` para converter colunas `YEAR(2)` de 2 dígitos em colunas `YEAR` de 4 dígitos, sem alterar os valores dos dados. Se o servidor for uma fonte de replicação, as instruções `REPAIR TABLE` são replicadas para as réplicas e fazem as alterações correspondentes na tabela de cada uma, a menos que você invoque o **mysql\_upgrade** com a opção `--skip-write-binlog`.

As atualizações dos servidores de replicação geralmente envolvem a atualização das réplicas para uma versão mais recente do MySQL, seguida da atualização da fonte. Por exemplo, se uma fonte e uma réplica executam o MySQL 5.5, uma sequência típica de atualização envolve a atualização da réplica para 5.6 e, em seguida, a atualização da fonte para 5.6. No que diz respeito ao tratamento diferente de `YEAR(2)` a partir do MySQL 5.6.6, essa sequência de atualização resulta em um problema: Suponha que a réplica tenha sido atualizada, mas ainda não a fonte. Então, ao criar uma tabela contendo uma coluna `YEAR(2)` de 2 dígitos na fonte, resulta em uma tabela contendo uma coluna `YEAR` de 4 dígitos na réplica. Consequentemente, as seguintes operações têm um resultado diferente na fonte e na réplica, se você usar a replicação baseada em declarações:

- Inserindo o número `0`. O valor resultante tem um valor interno de `2000` na fonte, mas `0000` na replica.

- Conversão de `YEAR(2)` em string. Esta operação usa o valor de exibição de `YEAR(2)` na fonte, mas `YEAR(4)` na réplica.

Para evitar tais problemas, modifique todas as colunas `YEAR(2)` de 2 dígitos na fonte para colunas `YEAR` de 4 dígitos antes de fazer a atualização. (Use `ALTER TABLE`, conforme descrito anteriormente.) Isso permite que a atualização seja feita normalmente (primeiramente a réplica, depois a fonte) sem introduzir diferenças entre a fonte e a réplica de `YEAR(2)` para `YEAR(4)` .

Um método de migração deve ser evitado: não armazene seus dados com **mysqldump** e não recarregue o arquivo de dump após a atualização. Isso pode alterar os valores de `YEAR(2)`, conforme descrito anteriormente.

Uma migração de colunas de `YEAR(2)` de 2 dígitos para colunas de `YEAR` de 4 dígitos também deve envolver a análise do código do aplicativo para verificar a possibilidade de comportamento alterado em condições como essas:

- O código que espera a seleção de uma coluna `YEAR` para produzir exatamente dois dígitos.

- O código que não considera o tratamento diferente para inserções de `0` numérico: inserir `0` em `YEAR(2)` ou `YEAR(4)` resulta em um valor interno de `2000` ou `0000`, respectivamente.
