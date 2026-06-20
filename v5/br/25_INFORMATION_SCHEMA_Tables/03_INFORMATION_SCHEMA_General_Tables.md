## 24.3 Tabelas gerais do esquema de informações

As seções a seguir descrevem o que pode ser denominado como o conjunto “geral” das tabelas `INFORMATION_SCHEMA`. São as tabelas que não estão associadas a motores de armazenamento, componentes ou plugins específicos.

### 24.3.1 Informações do esquema da tabela geral de referência

A tabela a seguir resume as tabelas gerais de `INFORMATION_SCHEMA`. Para mais detalhes, consulte as descrições das tabelas individuais.

**Tabela 24.2 SCHEMAS DE INFORMAÇÃO Tabelas Gerais**

<table frame="box" rules="all" summary="A reference that lists INFORMATION_SCHEMA general tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>CHARACTER_SETS</code></td> <td>Conjunto de caracteres disponíveis</td> </tr><tr><td><code>COLLATION_CHARACTER_SET_APPLICABILITY</code></td> <td>Conjunto de caracteres aplicável a cada combinação de ordenação</td> </tr><tr><td><code>COLLATIONS</code></td> <td>Colagens para cada conjunto de caracteres</td> </tr><tr><td><code>COLUMN_PRIVILEGES</code></td> <td>Privilegios definidos em colunas</td> </tr><tr><td><code>COLUMNS</code></td> <td>Colunas em cada tabela</td> </tr><tr><td><code>ENGINES</code></td> <td>Propriedades do motor de armazenamento</td> </tr><tr><td><code>EVENTS</code></td> <td>Gestor de eventos eventos</td> </tr><tr><td><code>FILES</code></td> <td>Arquivos que armazenam dados do espaço de tabela</td> </tr><tr><td><code>GLOBAL_STATUS</code></td> <td>Variáveis de status global</td> </tr><tr><td><code>GLOBAL_VARIABLES</code></td> <td>Variáveis do sistema global</td> </tr><tr><td><code>KEY_COLUMN_USAGE</code></td> <td>Quais colunas-chave têm restrições</td> </tr><tr><td><code>ndb_transid_mysql_connection_map</code></td> <td>Informações sobre transações do NDB</td> </tr><tr><td><code>OPTIMIZER_TRACE</code></td> <td>Informações produzidas pela atividade de rastreamento do otimizador</td> </tr><tr><td><code>PARAMETERS</code></td> <td>Parâmetros de rotina armazenados e valores de retorno de função armazenados</td> </tr><tr><td><code>PARTITIONS</code></td> <td>Informações sobre a partição da mesa</td> </tr><tr><td><code>PLUGINS</code></td> <td>Informações sobre o plugin</td> </tr><tr><td><code>PROCESSLIST</code></td> <td>Informações sobre os threads atualmente em execução</td> </tr><tr><td><code>PROFILING</code></td> <td>Informações de perfil de declaração</td> </tr><tr><td><code>REFERENTIAL_CONSTRAINTS</code></td> <td>Informações de chave estrangeira</td> </tr><tr><td><code>ROUTINES</code></td> <td>Informações de rotina armazenadas</td> </tr><tr><td><code>SCHEMA_PRIVILEGES</code></td> <td>Privilegios definidos em esquemas</td> </tr><tr><td><code>SCHEMATA</code></td> <td>Informações do esquema</td> </tr><tr><td><code>SESSION_STATUS</code></td> <td>Variáveis de status para a sessão atual</td> </tr><tr><td><code>SESSION_VARIABLES</code></td> <td>Variáveis do sistema para a sessão atual</td> </tr><tr><td><code>STATISTICS</code></td> <td>Estatísticas de índice de tabela</td> </tr><tr><td><code>TABLE_CONSTRAINTS</code></td> <td>Quais tabelas têm restrições</td> </tr><tr><td><code>TABLE_PRIVILEGES</code></td> <td>Privilegios definidos em tabelas</td> </tr><tr><td><code>TABLES</code></td> <td>Informações sobre a tabela</td> </tr><tr><td><code>TABLESPACES</code></td> <td>Informações sobre o tablespace</td> </tr><tr><td><code>TRIGGERS</code></td> <td>Informações de gatilho</td> </tr><tr><td><code>USER_PRIVILEGES</code></td> <td>Privilegios definidos globalmente por usuário</td> </tr><tr><td><code>VIEWS</code></td> <td>Ver informações</td> </tr></tbody></table>

### 24.3.2 A tabela INFORMATION_SCHEMA CHARACTER_SETS

A tabela `CHARACTER_SETS` fornece informações sobre os conjuntos de caracteres disponíveis.

A tabela `CHARACTER_SETS` tem essas colunas:

* `CHARACTER_SET_NAME`

O nome do conjunto de caracteres.

* `DEFAULT_COLLATE_NAME`

A agregação padrão para o conjunto de caracteres.

* `DESCRIPTION`

Uma descrição do conjunto de caracteres.

* `MAXLEN`

O número máximo de bytes necessários para armazenar um caractere.

#### Notas

As informações sobre o conjunto de caracteres também estão disponíveis na declaração `SHOW CHARACTER SET`. Veja a Seção 13.7.5.3, “Declaração SHOW CHARACTER SET”. As seguintes declarações são equivalentes:

```sql
SELECT * FROM INFORMATION_SCHEMA.CHARACTER_SETS
  [WHERE CHARACTER_SET_NAME LIKE 'wild']

SHOW CHARACTER SET
  [LIKE 'wild']
```

### 24.3.3 A tabela INFORMATION_SCHEMA COLLATIONS
### 24.3.4 A tabela INFORMATION_SCHEMA SCHEMAS
### 24.3.5 A tabela INFORMATION_SCHEMA SCHEMA_PRIVILEGES
### 24.3.6 A tabela INFORMATION_SCHEMA SCHEMA_USAGE
### 24.3.7 A tabela INFORMATION_SCHEMA SCHEMA_USAGE_PRIVILEGES
### 24.3.8 A tabela INFORMATION_SCHEMA SCHEMA_USAGE_ROLES
### 24.3.9 A tabela INFORMATION_SCHEMA SCHEMA_USAGE_SCHEMA_PRIVILEGES
### 24.3.10 A tabela INFORMATION_SCHEMA SCHEMA_USAGE_SCHEMA_USAGE
### 24.3.11 A tabela INFORMATION_SCHEMA SCHEMA_USAGE_SCHEMA_USAGE_PRIVILEGES
### 24.3.12 A tabela INFORMATION_SCHEMA SCHEMA_USAGE_SCHEMA_USAGE_ROLES

A tabela `COLLATIONS` fornece informações sobre as colatões para cada conjunto de caracteres.

A tabela `COLLATIONS` tem essas colunas:

* `COLLATION_NAME`

O nome da agregação.

* `CHARACTER_SET_NAME`

O nome do conjunto de caracteres com o qual a correção está associada.

* `ID`

O ID de agregação.

* `IS_DEFAULT`

Se a ordenação é a padrão para seu conjunto de caracteres.

* `IS_COMPILED`

Se o conjunto de caracteres é compilado no servidor.

* `SORTLEN`

Isso está relacionado à quantidade de memória necessária para ordenar strings expressas no conjunto de caracteres.

#### Notas

Informações sobre cotação também estão disponíveis na declaração `SHOW COLLATION`. Veja a Seção 13.7.5.4, “Declaração SHOW COLLATION”. As seguintes declarações são equivalentes:

```sql
SELECT COLLATION_NAME FROM INFORMATION_SCHEMA.COLLATIONS
  [WHERE COLLATION_NAME LIKE 'wild']

SHOW COLLATION
  [LIKE 'wild']
```

### 24.3.4 A tabela de COLATION_CHARACTER_SET_APPLICABILITY do INFORMATION_SCHEMA

A tabela `COLLATION_CHARACTER_SET_APPLICABILITY` indica qual conjunto de caracteres é aplicável para qual ordenação.

A tabela `COLLATION_CHARACTER_SET_APPLICABILITY` tem essas colunas:

* `COLLATION_NAME`

O nome da agregação.

* `CHARACTER_SET_NAME`

O nome do conjunto de caracteres com o qual a correção está associada.

#### Notas

As colunas `COLLATION_CHARACTER_SET_APPLICABILITY` são equivalentes às duas primeiras colunas exibidas pela declaração `SHOW COLLATION`.

### 24.3.5 A tabela INFORMATION_SCHEMA COLUMNS

A tabela `COLUMNS` fornece informações sobre as colunas das tabelas.

A tabela `COLUMNS` tem essas colunas:

* `TABLE_CATALOG`

O nome do catálogo ao qual a tabela que contém a coluna pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

O nome do esquema (banco de dados) ao qual a tabela que contém a coluna pertence.

* `TABLE_NAME`

O nome da tabela que contém a coluna.

* `COLUMN_NAME`

O nome da coluna.

* `ORDINAL_POSITION`

A posição da coluna na tabela. `ORDINAL_POSITION` é necessária porque você pode querer dizer `ORDER BY ORDINAL_POSITION`. Ao contrário de `SHOW COLUMNS`, `SELECT` da tabela `COLUMNS` não tem ordenação automática.

* `COLUMN_DEFAULT`

O valor padrão da coluna. Este é `NULL` se a coluna tiver um valor padrão explícito de `NULL`, ou se a definição da coluna não incluir nenhuma cláusula de `DEFAULT`.

* `IS_NULLABLE`

A coluna nulidade. O valor é `YES` se os valores de `NULL` puderem ser armazenados na coluna, `NO` se não puderem.

* `DATA_TYPE`

O tipo de dados da coluna.

O valor `DATA_TYPE` é apenas o nome do tipo sem nenhuma outra informação. O valor `COLUMN_TYPE` contém o nome do tipo e, possivelmente, outras informações, como a precisão ou o comprimento.

* `CHARACTER_MAXIMUM_LENGTH`

Para colunas de texto, o comprimento máximo em caracteres.

* `CHARACTER_OCTET_LENGTH`

Para colunas de texto, o comprimento máximo em bytes.

* `NUMERIC_PRECISION`

Para colunas numéricas, a precisão numérica.

* `NUMERIC_SCALE`

Para colunas numéricas, a escala numérica.

* `DATETIME_PRECISION`

Para colunas temporais, a precisão de segundos fracionários.

* `CHARACTER_SET_NAME`

Para colunas de cadeia de caracteres, o nome do conjunto de caracteres.

* `COLLATION_NAME`

Para colunas de cadeia de caracteres, o nome da correção.

* `COLUMN_TYPE`

O tipo de dados da coluna.

O valor `DATA_TYPE` é apenas o nome do tipo sem nenhuma outra informação. O valor `COLUMN_TYPE` contém o nome do tipo e, possivelmente, outras informações, como a precisão ou o comprimento.

* `COLUMN_KEY`

Se a coluna está indexada:

+ Se `COLUMN_KEY` estiver vazio, a coluna não está indexada ou está indexada apenas como uma coluna secundária em um índice de múltiplas colunas, não exclusivo.

+ Se `COLUMN_KEY` é `PRI`, a coluna é uma `PRIMARY KEY` ou é uma das colunas de uma `PRIMARY KEY` de múltiplas colunas.

+ Se `COLUMN_KEY` é `UNI`, a coluna é a primeira coluna de um índice `UNIQUE`. (Um índice `UNIQUE` permite múltiplos valores de `NULL`, mas você pode determinar se a coluna permite `NULL` verificando a coluna `Null`.

+ Se `COLUMN_KEY` é `MUL`, a coluna é a primeira coluna de um índice não único, na qual múltiplas ocorrências de um valor dado são permitidas na coluna.

Se mais de um dos valores de `COLUMN_KEY` se aplica a uma coluna específica de uma tabela, o `COLUMN_KEY` exibe o valor com a maior prioridade, na ordem `PRI`, `UNI`, `MUL`.

Um índice `UNIQUE` pode ser exibido como `PRI` se não puder conter valores `NULL` e não houver `PRIMARY KEY` na tabela. Um índice `UNIQUE` pode ser exibido como `MUL` se várias colunas formarem um índice `UNIQUE` composto; embora a combinação das colunas seja única, cada coluna ainda pode conter múltiplas ocorrências de um valor dado.

* `EXTRA`

Qualquer informação adicional disponível sobre uma coluna específica. O valor não está vazio nestes casos:

+ `auto_increment` para colunas que possuem o atributo `AUTO_INCREMENT`.

+ `on update CURRENT_TIMESTAMP` para as colunas `TIMESTAMP` ou `DATETIME` que possuem o atributo `ON UPDATE CURRENT_TIMESTAMP`.

+ `STORED GENERATED` ou `VIRTUAL GENERATED` para colunas geradas.

* `PRIVILEGES`

Os privilégios que você tem para a coluna.

* `COLUMN_COMMENT`

Qualquer comentário incluído na definição da coluna.

* `GENERATION_EXPRESSION`

Para colunas geradas, exibe a expressão usada para calcular os valores das colunas. Vazia para colunas não geradas. Para informações sobre colunas geradas, consulte a Seção 13.1.18.7, “CREATE TABLE e Colunas Geradas”.

#### Notas

* Em `SHOW COLUMNS`, o `Type` display inclui valores de várias colunas diferentes de `COLUMNS`.

* `CHARACTER_OCTET_LENGTH` deve ser o mesmo que `CHARACTER_MAXIMUM_LENGTH`, exceto para conjuntos de caracteres multibyte.

* `CHARACTER_SET_NAME` pode ser derivado de `COLLATION_NAME`. Por exemplo, se você digitar `SHOW FULL COLUMNS FROM t`, e você vê na coluna `COLLATION_NAME` um valor de `latin1_swedish_ci`, o conjunto de caracteres é o que está antes do primeiro underscore: `latin1`.

As informações da coluna também estão disponíveis na declaração `SHOW COLUMNS`. Veja a Seção 13.7.5.5, “Declaração SHOW COLUMNS”. As seguintes declarações são quase equivalentes:

```sql
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE table_name = 'tbl_name'
  [AND table_schema = 'db_name']
  [AND column_name LIKE 'wild']

SHOW COLUMNS
  FROM tbl_name
  [FROM db_name]
  [LIKE 'wild']
```

### 24.3.6 A tabela Tabela de PRIVILEGIOS_COLUNA do esquema de informações (INFORMATION_SCHEMA COLUMN_PRIVILEGES)

A tabela `COLUMN_PRIVILEGES` fornece informações sobre privilégios de coluna. Ela obtém seus valores da tabela `mysql.columns_priv` do sistema.

A tabela `COLUMN_PRIVILEGES` tem essas colunas:

* `GRANTEE`

O nome da conta à qual o privilégio é concedido, no formato `'user_name'@'host_name'`.

* `TABLE_CATALOG`

O nome do catálogo ao qual a tabela que contém a coluna pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

O nome do esquema (banco de dados) ao qual a tabela que contém a coluna pertence.

* `TABLE_NAME`

O nome da tabela que contém a coluna.

* `COLUMN_NAME`

O nome da coluna.

* `PRIVILEGE_TYPE`

O privilégio concedido. O valor pode ser qualquer privilégio que possa ser concedido no nível da coluna; veja a Seção 13.7.1.4, "Declaração GRANT". Cada string lista um único privilégio, portanto, há uma string por privilégio da coluna detido pelo beneficiário.

Na saída de `SHOW FULL COLUMNS`, os privilégios estão em uma única coluna e em minúsculas, por exemplo, `select,insert,update,references`. Em `COLUMN_PRIVILEGES`, há um privilégio por string, em maiúsculas.

* `IS_GRANTABLE`

`YES` se o usuário tiver o privilégio `GRANT OPTION`, `NO` caso contrário. A saída não lista `GRANT OPTION` como uma string separada com `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Notas

* `COLUMN_PRIVILEGES` é uma tabela não padrão `INFORMATION_SCHEMA`.

As seguintes afirmações *não* são equivalentes:

```sql
SELECT ... FROM INFORMATION_SCHEMA.COLUMN_PRIVILEGES

SHOW GRANTS ...
```

### 24.3.7 A tabela de ENGINES do INFORMATION_SCHEMA

A tabela `ENGINES` fornece informações sobre os motores de armazenamento. Isso é particularmente útil para verificar se um motor de armazenamento é suportado ou para ver qual é o motor padrão.

A tabela `ENGINES` tem essas colunas:

* `ENGINE`

O nome do motor de armazenamento.

* `SUPPORT`

O nível de suporte do servidor para o motor de armazenamento, conforme mostrado na tabela a seguir.

  <table summary="Values for the SUPPORT column in the INFORMATION_SCHEMA.ENGINES table."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Value</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>YES</code></td> <td>O motor é suportado e está ativo</td> </tr><tr> <td><code>DEFAULT</code></td> <td>Como<code>YES</code>, além disso, este é o motor padrão</td> </tr><tr> <td><code>NO</code></td> <td>O motor não é suportado</td> </tr><tr> <td><code>DISABLED</code></td> <td>O motor é suportado, mas foi desativado</td> </tr></tbody></table>

Um valor de `NO` significa que o servidor foi compilado sem suporte para o motor, portanto, não pode ser habilitado em tempo de execução.

Um valor de `DISABLED` ocorre porque o servidor foi iniciado com uma opção que desativa o motor, ou porque não foram fornecidas todas as opções necessárias para ativá-lo. No último caso, o log de erro deve conter um motivo que indique por que a opção está desativada. Veja a Seção 5.4.2, “O Log de Erro”.

Você também pode ver `DISABLED` para um motor de armazenamento se o servidor foi compilado para o suporte, mas foi iniciado com uma opção `--skip-engine_name`. Para o motor de armazenamento `NDB`, `DISABLED` significa que o servidor foi compilado com suporte para NDB Cluster, mas não foi iniciado com a opção `--ndbcluster`.

Todos os servidores MySQL suportam as tabelas `MyISAM`. Não é possível desabilitar `MyISAM`.

* `COMMENT`

Uma breve descrição do motor de armazenamento.

* `TRANSACTIONS`

Se o motor de armazenamento suporta transações.

* `XA`

Se o motor de armazenamento suporta transações XA.

* `SAVEPOINTS`

Se o motor de armazenamento suporta pontos de salvamento.

#### Notas

* `ENGINES` é uma tabela não padrão `INFORMATION_SCHEMA`.

As informações do motor de armazenamento também estão disponíveis na declaração `SHOW ENGINES`. Veja a Seção 13.7.5.16, “Declaração SHOW ENGINES”. As seguintes declarações são equivalentes:

```sql
SELECT * FROM INFORMATION_SCHEMA.ENGINES

SHOW ENGINES
```

### 24.3.8 A tabela Tabela de eventos do INFORMATION_SCHEMA

A tabela `EVENTS` fornece informações sobre os eventos do Gerenciador de Eventos, que são discutidos na Seção 23.4, “Usando o Cronograma de Eventos”.

A tabela `EVENTS` tem essas colunas:

* `EVENT_CATALOG`

O nome do catálogo ao qual o evento pertence. Esse valor é sempre `def`.

* `EVENT_SCHEMA`

O nome do esquema (banco de dados) ao qual o evento pertence.

* `EVENT_NAME`

O nome do evento.

* `DEFINER`

A conta nomeada na cláusula `DEFINER` (frequentemente o usuário que criou o evento), no formato `'user_name'@'host_name'`.

* `TIME_ZONE`

O fuso horário do evento, que é o fuso horário usado para agendar o evento e que está em vigor dentro do evento conforme ele é executado. O valor padrão é `SYSTEM`.

* `EVENT_BODY`

A linguagem utilizada para as declarações na cláusula `DO` do evento. O valor é sempre `SQL`.

* `EVENT_DEFINITION`

O texto da declaração SQL que compõe a cláusula `DO` do evento; em outras palavras, a declaração executada por este evento.

* `EVENT_TYPE`

O tipo de repetição do evento, seja `ONE TIME` (transitória) ou `RECURRING` (repetitiva).

* `EXECUTE_AT`

Para um evento único, esse é o valor `DATETIME` especificado na cláusula `AT` da declaração `CREATE EVENT` usada para criar o evento, ou da última declaração `ALTER EVENT` que modificou o evento. O valor mostrado nesta coluna reflete a adição ou subtração de qualquer valor `INTERVAL` incluído na cláusula `AT` do evento. Por exemplo, se um evento é criado usando `ON SCHEDULE AT CURRENT_TIMESTAMP + '1:6' DAY_HOUR`, e o evento foi criado em 2018-02-09 14:05:30, o valor mostrado nesta coluna seria `'2018-02-10 20:05:30'`. Se o cronograma do evento é determinado por uma cláusula `EVERY` em vez de uma cláusula `AT` (ou seja, se o evento é recorrente), o valor desta coluna é `NULL`.

* `INTERVAL_VALUE`

Para um evento recorrente, o número de intervalos a serem esperados entre as execuções do evento. Para um evento transitório, o valor é sempre `NULL`.

* `INTERVAL_FIELD`

As unidades de tempo usadas para o intervalo que um evento recorrente espera antes de se repetir. Para um evento transitório, o valor é sempre `NULL`.

* `SQL_MODE`

O modo SQL em vigor quando o evento foi criado ou alterado, e sob o qual o evento é executado. Para os valores permitidos, consulte a Seção 5.1.10, “Modos SQL do servidor”.

* `STARTS`

A data e a hora de início de um evento periódico. Isso é exibido como um valor `DATETIME`, e é `NULL` se não houver data e hora de início definidos para o evento. Para um evento transitório, esta coluna é sempre `NULL`. Para um evento periódico cuja definição inclui uma cláusula `STARTS`, esta coluna contém o valor correspondente `DATETIME`. Assim como a coluna `EXECUTE_AT`, esse valor resolve quaisquer expressões usadas. Se não houver cláusula `STARTS` afetando o cronograma do evento, esta coluna é `NULL`

* `ENDS`

Para um evento recorrente cuja definição inclui uma cláusula `ENDS`, esta coluna contém o valor correspondente `DATETIME`. Como no caso da coluna `EXECUTE_AT`, este valor resolve quaisquer expressões utilizadas. Se não houver nenhuma cláusula `ENDS` que afete o momento do evento, esta coluna é `NULL`.

* `STATUS`

O status do evento. Um dos `ENABLED`, `DISABLED` ou `SLAVESIDE_DISABLED`. `SLAVESIDE_DISABLED` indica que a criação do evento ocorreu em outro servidor MySQL que atua como fonte de replicação e foi replicado para o servidor MySQL atual que está atuando como replica, mas o evento não está sendo executado atualmente na replica. Para mais informações, consulte a Seção 16.4.1.16, “Replicação de Recursos Convocados”.

* `ON_COMPLETION`

Um dos dois valores `PRESERVE` ou `NOT PRESERVE`.

* `CREATED`

A data e a hora em que o evento foi criado. Este é um valor `TIMESTAMP`.

* `LAST_ALTERED`

A data e a hora em que o evento foi modificado pela última vez. Este é um valor `TIMESTAMP`. Se o evento não foi modificado desde sua criação, este valor é o mesmo que o valor `CREATED`.

* `LAST_EXECUTED`

A data e a hora em que o evento foi executado pela última vez. Este é um valor `DATETIME`. Se o evento nunca tiver sido executado, esta coluna é `NULL`.

`LAST_EXECUTED` indica quando o evento começou. Como resultado, a coluna `ENDS` nunca é menor que `LAST_EXECUTED`.

* `EVENT_COMMENT`

O texto do comentário, se o evento tiver um. Se não, este valor está vazio.

* `ORIGINATOR`

O ID do servidor do MySQL no qual o evento foi criado; utilizado na replicação. Este valor pode ser atualizado por `ALTER EVENT` para o ID do servidor no qual essa declaração ocorre, se executada em uma fonte de replicação. O valor padrão é 0.

* `CHARACTER_SET_CLIENT`

O valor da sessão da variável de sistema `character_set_client` quando o evento foi criado.

* `COLLATION_CONNECTION`

O valor da sessão da variável de sistema `collation_connection` quando o evento foi criado.

* `DATABASE_COLLATION`

A agregação do banco de dados com o qual o evento está associado.

#### Notas

* `EVENTS` é uma tabela não padrão `INFORMATION_SCHEMA`.

* Os horários da tabela `EVENTS` são exibidos usando o fuso horário do evento, o fuso horário da sessão atual ou UTC, conforme descrito na Seção 23.4.4, “Metadados do evento”.

* Para mais informações sobre `SLAVESIDE_DISABLED` e a coluna `ORIGINATOR`, consulte a Seção 16.4.1.16, “Replicação de Características Invocadas”.

#### Exemplo

Suponha que o usuário `'jon'@'ghidora'` crie um evento chamado `e_daily`, e então o modifique alguns minutos depois usando uma declaração `ALTER EVENT`, conforme mostrado aqui:

```sql
DELIMITER |

CREATE EVENT e_daily
    ON SCHEDULE
      EVERY 1 DAY
    COMMENT 'Saves total number of sessions then clears the table each day'
    DO
      BEGIN
        INSERT INTO site_activity.totals (time, total)
          SELECT CURRENT_TIMESTAMP, COUNT(*)
            FROM site_activity.sessions;
        DELETE FROM site_activity.sessions;
      END |

DELIMITER ;

ALTER EVENT e_daily
    ENABLE;
```

(Observe que os comentários podem ocupar várias strings.)

Esse usuário pode, então, executar a seguinte declaração `SELECT`, e obter a saída mostrada:

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.EVENTS
       WHERE EVENT_NAME = 'e_daily'
       AND EVENT_SCHEMA = 'myschema'\G
*************************** 1. row ***************************
       EVENT_CATALOG: def
        EVENT_SCHEMA: myschema
          EVENT_NAME: e_daily
             DEFINER: jon@ghidora
           TIME_ZONE: SYSTEM
          EVENT_BODY: SQL
    EVENT_DEFINITION: BEGIN
        INSERT INTO site_activity.totals (time, total)
          SELECT CURRENT_TIMESTAMP, COUNT(*)
            FROM site_activity.sessions;
        DELETE FROM site_activity.sessions;
      END
          EVENT_TYPE: RECURRING
          EXECUTE_AT: NULL
      INTERVAL_VALUE: 1
      INTERVAL_FIELD: DAY
            SQL_MODE: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                      NO_ZERO_IN_DATE,NO_ZERO_DATE,
                      ERROR_FOR_DIVISION_BY_ZERO,
                      NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
              STARTS: 2018-08-08 11:06:34
                ENDS: NULL
              STATUS: ENABLED
       ON_COMPLETION: NOT PRESERVE
             CREATED: 2018-08-08 11:06:34
        LAST_ALTERED: 2018-08-08 11:06:34
       LAST_EXECUTED: 2018-08-08 16:06:34
       EVENT_COMMENT: Saves total number of sessions then clears the
                      table each day
          ORIGINATOR: 1
CHARACTER_SET_CLIENT: utf8
COLLATION_CONNECTION: utf8_general_ci
  DATABASE_COLLATION: latin1_swedish_ci
```

As informações sobre o evento também estão disponíveis na declaração `SHOW EVENTS`. Veja a Seção 13.7.5.18, “Declaração SHOW EVENTS”. As seguintes declarações são equivalentes:

```sql
SELECT
    EVENT_SCHEMA, EVENT_NAME, DEFINER, TIME_ZONE, EVENT_TYPE, EXECUTE_AT,
    INTERVAL_VALUE, INTERVAL_FIELD, STARTS, ENDS, STATUS, ORIGINATOR,
    CHARACTER_SET_CLIENT, COLLATION_CONNECTION, DATABASE_COLLATION
  FROM INFORMATION_SCHEMA.EVENTS
  WHERE table_schema = 'db_name'
  [AND column_name LIKE 'wild']

SHOW EVENTS
  [FROM db_name]
  [LIKE 'wild']
```

### 24.3.9 A tabela de arquivos do esquema de informação INFORMATION_SCHEMA

A tabela `FILES` fornece informações sobre os arquivos nos quais os dados do espaço de tabela do MySQL são armazenados.

A tabela `FILES` fornece informações sobre os arquivos de dados `InnoDB`. No NDB Cluster, essa tabela também fornece informações sobre os arquivos nos quais as tabelas de Dados de Disco do NDB Cluster são armazenadas. Para informações adicionais específicas de `InnoDB`, consulte as Notas do InnoDB, mais adiante nesta seção; para informações adicionais específicas do NDB Cluster, consulte as Notas do NDB.

A tabela `FILES` tem essas colunas:

* `FILE_ID`

Para `InnoDB`: O ID do espaço de tabelas, também referido como `space_id` ou `fil_space_t::id`.

Para `NDB`: Um identificador de arquivo. Os valores da coluna `FILE_ID` são gerados automaticamente.

* `FILE_NAME`

Para `InnoDB`: O nome do arquivo de dados. Os espaços de tabela por arquivo e espaços de tabela gerais têm uma extensão de nome de arquivo `.ibd`. Os espaços de tabelas desfazer são prefixados por `undo`. O espaço de tabela do sistema é prefixado por `ibdata`. Os espaços de tabela temporários são prefixados por `ibtmp`. O nome do arquivo inclui o caminho do arquivo, que pode ser relativo ao diretório de dados do MySQL (o valor da variável do sistema `datadir`).

Para `NDB`: O nome de um arquivo de registro `UNDO` criado por `CREATE LOGFILE GROUP` ou `ALTER LOGFILE GROUP`, ou de um arquivo de dados criado por `CREATE TABLESPACE` ou `ALTER TABLESPACE`.

* `FILE_TYPE`

Para `InnoDB`: O tipo de arquivo do tablespace. Existem três tipos de arquivo possíveis para os arquivos `InnoDB`. `TABLESPACE` é o tipo de arquivo para qualquer tablespace de sistema, geral ou por arquivo, que contém tabelas, índices ou outras formas de dados do usuário. `TEMPORARY` é o tipo de arquivo para tablespaces temporários. `UNDO LOG` é o tipo de arquivo para tablespaces de desfazer, que contêm registros de desfazer.

Para `NDB`: Um dos valores `UNDO LOG`, `DATAFILE` ou `TABLESPACE`.

* `TABLESPACE_NAME`

O nome do tablespace com o qual o arquivo está associado.

* `TABLE_CATALOG`

Esse valor sempre está vazio.

* `TABLE_SCHEMA`

Isso é sempre `NULL`.

* `TABLE_NAME`

Isso é sempre `NULL`.

* `LOGFILE_GROUP_NAME`

Para `InnoDB`: Isso é sempre `NULL`.

Para `NDB`: O nome do grupo de arquivos de registro ao qual o arquivo de registro ou arquivo de dados pertence.

* `LOGFILE_GROUP_NUMBER`

Para `InnoDB`: Isso é sempre `NULL`.

Para o arquivo de registro de desfazer de dados de disco, o número de identificação autogerado do grupo de arquivos de registro ao qual o arquivo de registro pertence. Isso é o mesmo valor mostrado para a coluna `id` na tabela `ndbinfo.dict_obj_info` e a coluna `log_id` nas tabelas `ndbinfo.logspaces` e `ndbinfo.logspaces` para este arquivo de registro de desfazer.

* `ENGINE`

Para `InnoDB`: Isso é sempre `InnoDB`.

Para `NDB`: Isso é sempre `ndbcluster`.

* `FULLTEXT_KEYS`

Isso é sempre `NULL`.

* `DELETED_ROWS`

Isso é sempre `NULL`.

* `UPDATE_COUNT`

Isso é sempre `NULL`.

* `FREE_EXTENTS`

Para `InnoDB`: O número de extensões totalmente livres no arquivo de dados atual.

Para `NDB`: O número de extensões que ainda não foram usadas pelo arquivo.

* `TOTAL_EXTENTS`

Para `InnoDB`: O número de extensões completas usadas no arquivo de dados atual. Qualquer extensão parcial no final do arquivo não é contada.

Para `NDB`: O número total de extensões alocadas para o arquivo.

* `EXTENT_SIZE`

Para `InnoDB`: O tamanho do intervalo é de 1048576 (1 MB) para arquivos com tamanho de página de 4 KB, 8 KB ou 16 KB. O tamanho do intervalo é de 2097152 bytes (2 MB) para arquivos com tamanho de página de 32 KB e 4194304 (4 MB) para arquivos com tamanho de página de 64 KB. `FILES` não reporta o tamanho de página de `InnoDB`. O tamanho do página é definido pela variável de sistema `innodb_page_size`. As informações sobre o tamanho do intervalo também podem ser recuperadas da tabela `INNODB_SYS_TABLESPACES`, onde `FILES.FILE_ID = INNODB_SYS_TABLESPACES.SPACE`.

Para `NDB`: O tamanho de uma extensão do arquivo em bytes.

* `INITIAL_SIZE`

Para `InnoDB`: O tamanho inicial do arquivo em bytes.

Para `NDB`: O tamanho do arquivo em bytes. Este é o mesmo valor que foi usado na cláusula `INITIAL_SIZE` da declaração `CREATE LOGFILE GROUP`, `ALTER LOGFILE GROUP`, `CREATE TABLESPACE` ou `ALTER TABLESPACE` usada para criar o arquivo.

* `MAXIMUM_SIZE`

Para `InnoDB`: O número máximo de bytes permitido no arquivo. O valor é `NULL` para todos os arquivos de dados, exceto os arquivos de dados de espaço de tabela de sistema predefinidos. O tamanho máximo do arquivo de espaço de tabela do sistema é definido por `innodb_data_file_path`. O tamanho máximo do arquivo de espaço de tabela temporário é definido por `innodb_temp_data_file_path`. Um valor `NULL` para um arquivo de dados de espaço de tabela de sistema predefinido indica que um limite de tamanho de arquivo não foi definido explicitamente.

Para `NDB`: Esse valor é sempre o mesmo que o valor de `INITIAL_SIZE`.

* `AUTOEXTEND_SIZE`

O tamanho automático de expansão do espaço de tabela. Para `NDB`, `AUTOEXTEND_SIZE` é sempre `NULL`.

* `CREATION_TIME`

Isso é sempre `NULL`.

* `LAST_UPDATE_TIME`

Isso é sempre `NULL`.

* `LAST_ACCESS_TIME`

Isso é sempre `NULL`.

* `RECOVER_TIME`

Isso é sempre `NULL`.

* `TRANSACTION_COUNTER`

Isso é sempre `NULL`.

* `VERSION`

Para `InnoDB`: Isso é sempre `NULL`.

Para `NDB`: O número da versão do arquivo.

* `ROW_FORMAT`

Para `InnoDB`: Isso é sempre `NULL`.

Para `NDB`: Um dos `FIXED` ou `DYNAMIC`.

* `TABLE_ROWS`

Isso é sempre `NULL`.

* `AVG_ROW_LENGTH`

Isso é sempre `NULL`.

* `DATA_LENGTH`

Isso é sempre `NULL`.

* `MAX_DATA_LENGTH`

Isso é sempre `NULL`.

* `INDEX_LENGTH`

Isso é sempre `NULL`.

* `DATA_FREE`

Para `InnoDB`: O valor total do espaço livre (em bytes) para todo o espaço de tabelas. Os espaços de tabelas de sistema predefinidos, que incluem o espaço de tabelas de sistema e os espaços de tabelas temporárias, podem ter um ou mais arquivos de dados.

Para `NDB`: Isso é sempre `NULL`.

* `CREATE_TIME`

Isso é sempre `NULL`.

* `UPDATE_TIME`

Isso é sempre `NULL`.

* `CHECK_TIME`

Isso é sempre `NULL`.

* `CHECKSUM`

Isso é sempre `NULL`.

* `STATUS`

Para `InnoDB`: Este valor é `NORMAL` por padrão. Os espaços de tabela por tabela `InnoDB` podem relatar `IMPORTING`, o que indica que o espaço de tabela ainda não está disponível.

Para `NDB`: Isso é sempre `NORMAL`.

* `EXTRA`

Para `InnoDB`: Isso é sempre `NULL`.

Para `NDB`: Esta coluna mostra qual nó de dados pertence o arquivo de dados ou o arquivo de registro de desfazer (cada nó de dados tem sua própria cópia de cada arquivo); para arquivos de registro de desfazer, também mostra o tamanho do buffer de registro de desfazer. Suponha que você use esta declaração em um NDB Cluster com quatro nós de dados:

  ```sql
  CREATE LOGFILE GROUP mygroup
      ADD UNDOFILE 'new_undo.dat'
      INITIAL_SIZE 2G
      ENGINE NDB;
  ```

Após executar a declaração `CREATE LOGFILE GROUP` com sucesso, você deve ver um resultado semelhante ao mostrado aqui para esta consulta contra a tabela `FILES`:

  ```sql
  mysql> SELECT LOGFILE_GROUP_NAME, FILE_TYPE, EXTRA
           FROM INFORMATION_SCHEMA.FILES
           WHERE FILE_NAME = 'new_undo.dat';

  +--------------------+-----------+-----------------------------------------+
  | LOGFILE_GROUP_NAME | FILE_TYPE | EXTRA                                   |
  +--------------------+-----------+-----------------------------------------+
  | mygroup            | UNDO LOG  | CLUSTER_NODE=5;UNDO_BUFFER_SIZE=8388608 |
  | mygroup            | UNDO LOG  | CLUSTER_NODE=6;UNDO_BUFFER_SIZE=8388608 |
  | mygroup            | UNDO LOG  | CLUSTER_NODE=7;UNDO_BUFFER_SIZE=8388608 |
  | mygroup            | UNDO LOG  | CLUSTER_NODE=8;UNDO_BUFFER_SIZE=8388608 |
  +--------------------+-----------+-----------------------------------------+
  ```

#### Notas

* `FILES` é uma tabela não padrão `INFORMATION_SCHEMA`.

#### Notas do InnoDB

As seguintes notas se aplicam aos arquivos de dados `InnoDB`.

* Os dados relatados por `FILES` são relatados a partir do cache `InnoDB` de memória para arquivos abertos. Em comparação, `INNODB_SYS_DATAFILES` relata dados da tabela interna do dicionário de dados `InnoDB` `SYS_DATAFILES`.

* Os dados reportados por `FILES` incluem dados de espaço de tabela temporário. Esses dados não estão disponíveis na tabela do dicionário de dados interno `InnoDB` `SYS_DATAFILES`, e, portanto, não são reportados por `INNODB_SYS_DATAFILES`.

* Os dados dos espaços de tabela são reportados por `FILES`.

* A consulta a seguir retorna todos os dados pertinentes aos espaços de tabela `InnoDB`.

  ```sql
  SELECT
    FILE_ID, FILE_NAME, FILE_TYPE, TABLESPACE_NAME, FREE_EXTENTS,
    TOTAL_EXTENTS, EXTENT_SIZE, INITIAL_SIZE, MAXIMUM_SIZE,
    AUTOEXTEND_SIZE, DATA_FREE, STATUS
  FROM INFORMATION_SCHEMA.FILES WHERE ENGINE='InnoDB'\G
  ```

#### Notas do NDB

* A tabela `FILES` fornece informações apenas sobre os *arquivos* de dados do disco; não é possível usá-la para determinar a alocação ou disponibilidade de espaço em disco para as tabelas individuais `NDB`. No entanto, é possível ver quanto espaço é alocado para cada tabela `NDB` que tem dados armazenados em disco — bem como quanto espaço ainda está disponível para o armazenamento de dados em disco para essa tabela — usando **ndb_desc**.

* Os valores de `CREATION_TIME`, `LAST_UPDATE_TIME` e `LAST_ACCESSED` são os relatados pelo sistema operacional e não são fornecidos pelo motor de armazenamento `NDB`. Quando nenhum valor é fornecido pelo sistema operacional, essas colunas exibem `NULL`.

* A diferença entre as colunas `TOTAL EXTENTS` e `FREE_EXTENTS` é o número de extensões atualmente em uso pelo arquivo:

  ```sql
  SELECT TOTAL_EXTENTS - FREE_EXTENTS AS extents_used
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = 'myfile.dat';
  ```

Para aproximar a quantidade de espaço em disco utilizado pelo arquivo, multiplique essa diferença pelo valor da coluna `EXTENT_SIZE`, que fornece o tamanho de uma extensão para o arquivo em bytes:

  ```sql
  SELECT (TOTAL_EXTENTS - FREE_EXTENTS) * EXTENT_SIZE AS bytes_used
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = 'myfile.dat';
  ```

Da mesma forma, você pode estimar a quantidade de espaço disponível em um arquivo específico, multiplicando `FREE_EXTENTS` por `EXTENT_SIZE`:

  ```sql
  SELECT FREE_EXTENTS * EXTENT_SIZE AS bytes_free
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = 'myfile.dat';
  ```

Importante

Os valores dos bytes produzidos pelas consultas anteriores são apenas aproximações e sua precisão é inversamente proporcional ao valor de `EXTENT_SIZE`. Isso significa que quanto maior o `EXTENT_SIZE` se torna, menos precisas são as aproximações.

É importante também lembrar que, uma vez que uma extensão é usada, ela não pode ser liberada novamente sem descartar o arquivo de dados do qual faz parte. Isso significa que as exclusões de uma tabela de Dados de disco *não* liberam espaço em disco.

O tamanho da extensão pode ser definido em uma declaração `CREATE TABLESPACE`. Para mais informações, consulte a Seção 13.1.19, “Declaração CREATE TABLESPACE”.

* Uma string adicional está presente na tabela `FILES` após a criação de um grupo de arquivo de registro. Essa string tem `NULL` para o valor da coluna `FILE_NAME` e `0` para o valor da coluna `FILE_ID`; o valor da coluna `FILE_TYPE` é sempre `UNDO LOG`, e o da coluna `STATUS` é sempre `NORMAL`. O valor da coluna `ENGINE` para essa string é sempre `ndbcluster`.

A coluna `FREE_EXTENTS` nesta string mostra o número total de extensões livres disponíveis para todos os arquivos de desfazer pertencentes a um grupo de arquivos de registro específico, cujo nome e número são mostrados nas colunas `LOGFILE_GROUP_NAME` e `LOGFILE_GROUP_NUMBER`, respectivamente.

Suponha que não haja grupos de arquivos de registro existentes em seu NDB Cluster e que você crie um deles usando a seguinte declaração:

  ```sql
  mysql> CREATE LOGFILE GROUP lg1
           ADD UNDOFILE 'undofile.dat'
           INITIAL_SIZE = 16M
           UNDO_BUFFER_SIZE = 1M
           ENGINE = NDB;
  ```

Agora você pode ver esta string `NULL` ao fazer uma consulta na tabela `FILES`:

  ```sql
  mysql> SELECT DISTINCT
           FILE_NAME AS File,
           FREE_EXTENTS AS Free,
           TOTAL_EXTENTS AS Total,
           EXTENT_SIZE AS Size,
           INITIAL_SIZE AS Initial
           FROM INFORMATION_SCHEMA.FILES;
  +--------------+---------+---------+------+----------+
  | File         | Free    | Total   | Size | Initial  |
  +--------------+---------+---------+------+----------+
  | undofile.dat |    NULL | 4194304 |    4 | 16777216 |
  | NULL         | 4184068 |    NULL |    4 |     NULL |
  +--------------+---------+---------+------+----------+
  ```

O número total de extensões gratuitas disponíveis para registro de desfazer é sempre um pouco menor que a soma dos valores da coluna `TOTAL_EXTENTS` para todos os arquivos de desfazer no grupo de arquivos de registro, devido ao sobrecarga necessária para manter os arquivos de desfazer. Isso pode ser visto ao adicionar um segundo arquivo de desfazer ao grupo de arquivos de registro, e depois repetir a consulta anterior contra a tabela `FILES`:

  ```sql
  mysql> ALTER LOGFILE GROUP lg1
           ADD UNDOFILE 'undofile02.dat'
           INITIAL_SIZE = 4M
           ENGINE = NDB;

  mysql> SELECT DISTINCT
           FILE_NAME AS File,
           FREE_EXTENTS AS Free,
           TOTAL_EXTENTS AS Total,
           EXTENT_SIZE AS Size,
           INITIAL_SIZE AS Initial
           FROM INFORMATION_SCHEMA.FILES;
  +----------------+---------+---------+------+----------+
  | File           | Free    | Total   | Size | Initial  |
  +----------------+---------+---------+------+----------+
  | undofile.dat   |    NULL | 4194304 |    4 | 16777216 |
  | undofile02.dat |    NULL | 1048576 |    4 |  4194304 |
  | NULL           | 5223944 |    NULL |    4 |     NULL |
  +----------------+---------+---------+------+----------+
  ```

O espaço livre em bytes disponível para registro de desfazer em tabelas de Dados de disco usando este grupo de arquivos de registro pode ser aproximado multiplicando o número de extensões livres pelo tamanho inicial:

  ```sql
  mysql> SELECT
           FREE_EXTENTS AS 'Free Extents',
           FREE_EXTENTS * EXTENT_SIZE AS 'Free Bytes'
           FROM INFORMATION_SCHEMA.FILES
           WHERE LOGFILE_GROUP_NAME = 'lg1'
           AND FILE_NAME IS NULL;
  +--------------+------------+
  | Free Extents | Free Bytes |
  +--------------+------------+
  |      5223944 |   20895776 |
  +--------------+------------+
  ```

Se você criar uma tabela de Dados de disco do NDB Cluster e, em seguida, inserir algumas strings nela, você pode ver aproximadamente quanto espaço permanece para o registro de desfazer, por exemplo:

  ```sql
  mysql> CREATE TABLESPACE ts1
           ADD DATAFILE 'data1.dat'
           USE LOGFILE GROUP lg1
           INITIAL_SIZE 512M
           ENGINE = NDB;

  mysql> CREATE TABLE dd (
           c1 INT NOT NULL PRIMARY KEY,
           c2 INT,
           c3 DATE
           )
           TABLESPACE ts1 STORAGE DISK
           ENGINE = NDB;

  mysql> INSERT INTO dd VALUES
           (NULL, 1234567890, '2007-02-02'),
           (NULL, 1126789005, '2007-02-03'),
           (NULL, 1357924680, '2007-02-04'),
           (NULL, 1642097531, '2007-02-05');

  mysql> SELECT
           FREE_EXTENTS AS 'Free Extents',
           FREE_EXTENTS * EXTENT_SIZE AS 'Free Bytes'
           FROM INFORMATION_SCHEMA.FILES
           WHERE LOGFILE_GROUP_NAME = 'lg1'
           AND FILE_NAME IS NULL;
  +--------------+------------+
  | Free Extents | Free Bytes |
  +--------------+------------+
  |      5207565 |   20830260 |
  +--------------+------------+
  ```

* Uma string adicional está presente na tabela `FILES` para qualquer espaço de tabela do NDB Cluster, independentemente de quaisquer arquivos de dados estarem associados ao espaço de tabela. Essa string tem `NULL` para o valor da coluna `FILE_NAME`, e o valor da coluna `FILE_ID` é sempre `0`. O valor mostrado na coluna `FILE_TYPE` é sempre `TABLESPACE`, e o da coluna `STATUS` é sempre `NORMAL`. O valor da coluna `ENGINE` para esta string é sempre `ndbcluster`.

* Para informações adicionais e exemplos de criação e eliminação de objetos de dados de disco do NDB Cluster, consulte a Seção 21.6.11, “Tabelas de Dados de Disco do NDB Cluster”.

* a partir do MySQL 5.7.31, você deve ter o privilégio `PROCESS` para consultar esta tabela.

### 24.3.10 As tabelas INFORMATION_SCHEMA GLOBAL_STATUS e SESSION_STATUS

Nota

O valor da variável de sistema `show_compatibility_56` afeta as informações disponíveis nas tabelas descritas aqui. Para detalhes, consulte a descrição dessa variável na Seção 5.1.7, “Variáveis do sistema do servidor”.

Nota

As informações disponíveis nas tabelas descritas aqui também estão disponíveis no Schema de Desempenho. As tabelas `INFORMATION_SCHEMA` são desaconselhadas em preferência às tabelas do Schema de Desempenho e são removidas no MySQL 8.0. Para obter conselhos sobre a migração das tabelas `INFORMATION_SCHEMA` para as tabelas do Schema de Desempenho, consulte a Seção 25.20, “Migrando para as tabelas do Schema de Sistema e Variáveis de Estado”.

As tabelas `GLOBAL_STATUS` e `SESSION_STATUS` fornecem informações sobre as variáveis de status do servidor. Seus conteúdos correspondem às informações produzidas pelas declarações `SHOW GLOBAL STATUS` e `SHOW SESSION STATUS` (ver Seção 13.7.5.35, “Declaração SHOW STATUS”).

#### Notas

* A coluna `VARIABLE_VALUE` para cada uma dessas tabelas é definida como `VARCHAR(1024)`.

### 24.3.11 Tabelas INFORMATION_SCHEMA GLOBAL_VARIABLES e SESSION_VARIABLES

Nota

O valor da variável de sistema `show_compatibility_56` afeta as informações disponíveis nas tabelas descritas aqui. Para detalhes, consulte a descrição dessa variável na Seção 5.1.7, “Variáveis do Sistema do Servidor”.

Nota

As informações disponíveis nas tabelas descritas aqui também estão disponíveis no Schema de Desempenho. As tabelas `INFORMATION_SCHEMA` são desatualizadas em preferência às tabelas do Schema de Desempenho e são removidas no MySQL 8.0. Para obter conselhos sobre a migração das tabelas `INFORMATION_SCHEMA` para as tabelas do Schema de Desempenho, consulte a Seção 25.20, “Migrando para as tabelas do Schema de Sistema e Variáveis de Estado”.

As tabelas `GLOBAL_VARIABLES` e `SESSION_VARIABLES` fornecem informações sobre as variáveis de status do servidor. Seus conteúdos correspondem às informações produzidas pelas declarações `SHOW GLOBAL VARIABLES` e `SHOW SESSION VARIABLES` (ver Seção 13.7.5.39, “Declaração SHOW VARIABLES”).

#### Notas

* A coluna `VARIABLE_VALUE` para cada uma dessas tabelas é definida como `VARCHAR(1024)`. Para variáveis com valores muito longos que não são completamente exibidos, use `SELECT` como uma solução alternativa. Por exemplo:

  ```sql
  SELECT @@GLOBAL.innodb_data_file_path;
  ```

### 24.3.12 Tabela INFORMATION_SCHEMA KEY_COLUMN_USAGE

A tabela `KEY_COLUMN_USAGE` descreve quais colunas principais têm restrições.

A tabela `KEY_COLUMN_USAGE` tem essas colunas:

* `CONSTRAINT_CATALOG`

O nome do catálogo ao qual a restrição pertence. Esse valor é sempre `def`.

* `CONSTRAINT_SCHEMA`

O nome do esquema (banco de dados) ao qual a restrição pertence.

* `CONSTRAINT_NAME`

O nome da restrição.

* `TABLE_CATALOG`

O nome do catálogo ao qual a tabela pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

O nome do esquema (banco de dados) ao qual a tabela pertence.

* `TABLE_NAME`

O nome da tabela que possui a restrição.

* `COLUMN_NAME`

O nome da coluna que possui a restrição.

Se a restrição for uma chave estrangeira, então esta é a coluna da chave estrangeira, e não a coluna que a chave estrangeira referencia.

* `ORDINAL_POSITION`

A posição da coluna dentro da restrição, não a posição da coluna dentro da tabela. As posições das colunas são numeradas a partir do número 1.

* `POSITION_IN_UNIQUE_CONSTRAINT`

`NULL` para restrições exclusivas e de chave primária. Para restrições de chave estrangeira, esta coluna é a posição ordinal na chave da tabela que está sendo referenciada.

* `REFERENCED_TABLE_SCHEMA`

O nome do esquema (banco de dados) referenciado pela restrição.

* `REFERENCED_TABLE_NAME`

O nome da tabela referenciada pela restrição.

* `REFERENCED_COLUMN_NAME`

O nome da coluna referenciado pela restrição.

Suponha que existam duas tabelas chamadas `t1` e `t3` que têm as seguintes definições:

```sql
CREATE TABLE t1
(
    s1 INT,
    s2 INT,
    s3 INT,
    PRIMARY KEY(s3)
) ENGINE=InnoDB;

CREATE TABLE t3
(
    s1 INT,
    s2 INT,
    s3 INT,
    KEY(s1),
    CONSTRAINT CO FOREIGN KEY (s2) REFERENCES t1(s3)
) ENGINE=InnoDB;
```

Para essas duas tabelas, a tabela `KEY_COLUMN_USAGE` tem duas strings:

* Uma string com `CONSTRAINT_NAME` = `'PRIMARY'`, `TABLE_NAME` = `'t1'`, `COLUMN_NAME` = `'s3'`, `ORDINAL_POSITION` = `1`, `POSITION_IN_UNIQUE_CONSTRAINT` = `NULL`.

* Uma string com `CONSTRAINT_NAME` = `'CO'`, `TABLE_NAME` = `'t3'`, `COLUMN_NAME` = `'s2'`, `ORDINAL_POSITION` = `1`, `POSITION_IN_UNIQUE_CONSTRAINT` = `1`.

### 24.3.13 Tabela INFORMATION_SCHEMA ndb_transid_mysql_connection_map

A tabela `ndb_transid_mysql_connection_map` fornece uma mapeo entre as transações `NDB`, coordenadores de transações `NDB` e servidores MySQL conectados a um NDB Cluster como nós de API. Essas informações são usadas ao preencher as tabelas `server_operations` e `server_transactions` do banco de dados de informações do NDB Cluster `ndbinfo`.

A tabela `ndb_transid_mysql_connection_map` tem essas colunas:

* `mysql_connection_id`

O ID de conexão do servidor MySQL.

* `node_id`

O ID do nó do coordenador de transação.

* `ndb_transid`

O ID de transação `NDB`.

#### Notas

O valor `mysql_connection_id` é o mesmo que o ID de conexão ou sessão mostrado na saída de `SHOW PROCESSLIST`.

Não há declarações `SHOW` associadas a esta tabela.

Esta é uma tabela não padrão, específica para o NDB Cluster. É implementada como um plugin `INFORMATION_SCHEMA`; você pode verificar se ela é suportada verificando a saída do `SHOW PLUGINS`. Se o suporte ao `ndb_transid_mysql_connection_map` estiver habilitado, a saída desta declaração inclui um plugin com esse nome, do tipo `INFORMATION SCHEMA`, e com status `ACTIVE`, conforme mostrado aqui (usando texto em negrito):

```sql
mysql> SHOW PLUGINS;
+----------------------------------+--------+--------------------+---------+---------+
| Name                             | Status | Type               | Library | License |
+----------------------------------+--------+--------------------+---------+---------+
| binlog                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| mysql_native_password            | ACTIVE | AUTHENTICATION     | NULL    | GPL     |
| CSV                              | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| MEMORY                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| MRG_MYISAM                       | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| MyISAM                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| PERFORMANCE_SCHEMA               | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| BLACKHOLE                        | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ARCHIVE                          | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndbcluster                       | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndbinfo                          | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndb_transid_mysql_connection_map | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| InnoDB                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| INNODB_TRX                       | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_LOCKS                     | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_LOCK_WAITS                | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMP                       | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMP_RESET                 | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMPMEM                    | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMPMEM_RESET              | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| partition                        | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
+----------------------------------+--------+--------------------+---------+---------+
22 rows in set (0.00 sec)
```

O plugin é ativado por padrão. Você pode desativá-lo (ou forçar o servidor a não funcionar a menos que o plugin seja iniciado) iniciando o servidor com a opção `--ndb-transid-mysql-connection-map`. Se o plugin estiver desativado, o status é mostrado por `SHOW PLUGINS` como `DISABLED`. O plugin não pode ser ativado ou desativado em tempo real.

Embora os nomes desta tabela e suas colunas sejam exibidos em letras minúsculas, você pode usar letras maiúsculas ou minúsculas ao se referir a eles em declarações SQL.

Para que esta tabela seja criada, o MySQL Server deve ser um binário fornecido com a distribuição do NDB Cluster, ou um binário construído a partir das fontes do NDB Cluster com suporte ao mecanismo de armazenamento `NDB`. Não está disponível no servidor padrão MySQL 5.7.

### 24.3.14 A tabela INFO_SCHEMA_OPTIMIZER_TRACE

A tabela `OPTIMIZER_TRACE` fornece informações produzidas pela capacidade de rastreamento do otimizador para instruções rastreadas. Para habilitar o rastreamento, use a variável de sistema `optimizer_trace`. Para obter detalhes, consulte a Seção 8.15, “Rastreamento do Otimizador”.

A tabela `OPTIMIZER_TRACE` tem essas colunas:

* `QUERY`

O texto da declaração traçada.

* `TRACE`

A traçada, no formato `JSON`.

* `MISSING_BYTES_BEYOND_MAX_MEM_SIZE`

Cada rastro lembrado é uma cadeia que é estendida à medida que a otimização progride e anexa dados a ela. A variável `optimizer_trace_max_mem_size` define um limite sobre a quantidade total de memória usada por todos os rastros lembrados atualmente. Se esse limite for atingido, o rastro atual não é estendido (e, portanto, é incompleto), e a coluna `MISSING_BYTES_BEYOND_MAX_MEM_SIZE` mostra o número de bytes que faltam no rastro.

* `INSUFFICIENT_PRIVILEGES`

Se uma consulta rastreada usar visualizações ou rotinas armazenadas que tenham `SQL SECURITY` com um valor de `DEFINER`, pode ser que um usuário diferente do definidor seja negado a ver o rastreamento da consulta. Nesse caso, o rastreamento é mostrado como vazio e `INSUFFICIENT_PRIVILEGES` tem um valor de 1. Caso contrário, o valor é 0.

### 24.3.15 A Tabela de PARÂMETROS do INFORMATION_SCHEMA

A tabela `PARAMETERS` fornece informações sobre os parâmetros para rotinas armazenadas (procedimentos e funções armazenadas), e sobre os valores de retorno para funções armazenadas. A tabela `PARAMETERS` não inclui funções integrais (nativas) ou funções carregáveis. As informações dos parâmetros são semelhantes ao conteúdo da coluna `param_list` na tabela `mysql.proc`.

A tabela `PARAMETERS` tem essas colunas:

* `SPECIFIC_CATALOG`

O nome do catálogo ao qual a rotina que contém o parâmetro pertence. Esse valor é sempre `def`.

* `SPECIFIC_SCHEMA`

O nome do esquema (banco de dados) ao qual a rotina que contém o parâmetro pertence.

* `SPECIFIC_NAME`

O nome da rotina que contém o parâmetro.

* `ORDINAL_POSITION`

Para os parâmetros sucessivos de um procedimento ou função armazenada, os valores de `ORDINAL_POSITION` são 1, 2, 3, e assim por diante. Para uma função armazenada, também há uma string que se aplica ao valor de retorno da função (como descrito pela cláusula `RETURNS`). O valor de retorno não é um parâmetro verdadeiro, então a string que o descreve tem essas características únicas:

+ O valor de `ORDINAL_POSITION` é 0.  
+ Os valores de `PARAMETER_NAME` e `PARAMETER_MODE` são `NULL` porque o valor de retorno não tem nome e o modo não se aplica.

* `PARAMETER_MODE`

O modo do parâmetro. Esse valor é um dos `IN`, `OUT` ou `INOUT`. Para um valor de retorno de função armazenada, esse valor é `NULL`.

* `PARAMETER_NAME`

O nome do parâmetro. Para um valor de retorno de função armazenada, esse valor é `NULL`.

* `DATA_TYPE`

O tipo de dados do parâmetro.

O valor `DATA_TYPE` é apenas o nome do tipo sem nenhuma outra informação. O valor `DTD_IDENTIFIER` contém o nome do tipo e, possivelmente, outras informações, como a precisão ou o comprimento.

* `CHARACTER_MAXIMUM_LENGTH`

Para parâmetros de cadeia, o comprimento máximo em caracteres.

* `CHARACTER_OCTET_LENGTH`

Para parâmetros de cadeia, o comprimento máximo em bytes.

* `NUMERIC_PRECISION`

Para parâmetros numéricos, a precisão numérica.

* `NUMERIC_SCALE`

Para parâmetros numéricos, a escala numérica.

* `DATETIME_PRECISION`

Para os parâmetros temporais, a precisão de segundos fracionários.

* `CHARACTER_SET_NAME`

Para parâmetros de cadeia de caracteres, o nome do conjunto de caracteres.

* `COLLATION_NAME`

Para parâmetros de cadeia de caracteres, o nome da correção.

* `DTD_IDENTIFIER`

O tipo de dados do parâmetro.

O valor `DATA_TYPE` é apenas o nome do tipo sem nenhuma outra informação. O valor `DTD_IDENTIFIER` contém o nome do tipo e, possivelmente, outras informações, como a precisão ou o comprimento.

* `ROUTINE_TYPE`

`PROCEDURE` para procedimentos armazenados, `FUNCTION` para funções armazenadas.

### 24.3.16 A tabela de PARTITIONS do esquema de informação

A tabela `PARTITIONS` fornece informações sobre partições de tabela. Cada string desta tabela corresponde a uma partição ou subpartição individual de uma tabela particionada. Para mais informações sobre particionamento de tabelas, consulte o Capítulo 22, *Particionamento*.

A tabela `PARTITIONS` tem essas colunas:

* `TABLE_CATALOG`

O nome do catálogo ao qual a tabela pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

O nome do esquema (banco de dados) ao qual a tabela pertence.

* `TABLE_NAME`

O nome da tabela que contém a partição.

* `PARTITION_NAME`

O nome da partição.

* `SUBPARTITION_NAME`

Se a string da tabela `PARTITIONS` representar uma subpartição, o nome da subpartição; caso contrário, `NULL`.

* `PARTITION_ORDINAL_POSITION`

Todas as partições são indexadas na mesma ordem em que são definidas, com `1` sendo o número atribuído à primeira partição. A indexação pode mudar à medida que as partições são adicionadas, excluídas e reorganizadas; o número mostrado neste campo reflete a ordem atual, levando em conta quaisquer mudanças na indexação.

* `SUBPARTITION_ORDINAL_POSITION`

As subpartições dentro de uma partição dada também são indexadas e reindexadas da mesma maneira que as partições são indexadas dentro de uma tabela.

* `PARTITION_METHOD`

Um dos valores `RANGE`, `LIST`, `HASH`, `LINEAR HASH`, `KEY` ou `LINEAR KEY`; ou seja, um dos tipos de particionamento disponíveis, conforme discutido na Seção 22.2, “Tipos de Particionamento”.

* `SUBPARTITION_METHOD`

Um dos valores `HASH`, `LINEAR HASH`, `KEY` ou `LINEAR KEY`; ou seja, um dos tipos de subpartição disponíveis, conforme discutido na Seção 22.2.6, “Subpartição”.

* `PARTITION_EXPRESSION`

A expressão para a função de particionamento usada na declaração `CREATE TABLE` ou `ALTER TABLE` que criou o esquema de particionamento atual da tabela.

Por exemplo, considere uma tabela dividida criada no banco de dados `test` usando esta declaração:

  ```sql
  CREATE TABLE tp (
      c1 INT,
      c2 INT,
      c3 VARCHAR(25)
  )
  PARTITION BY HASH(c1 + c2)
  PARTITIONS 4;
  ```

A coluna `PARTITION_EXPRESSION` em uma string da tabela `PARTITIONS` para uma partição desta tabela exibe `c1 + c2`, conforme mostrado aqui:

  ```sql
  mysql> SELECT DISTINCT PARTITION_EXPRESSION
         FROM INFORMATION_SCHEMA.PARTITIONS
         WHERE TABLE_NAME='tp' AND TABLE_SCHEMA='test';
  +----------------------+
  | PARTITION_EXPRESSION |
  +----------------------+
  | c1 + c2              |
  +----------------------+
  ```

Para uma tabela `NDB` que não é explicitamente particionada, essa coluna está vazia. Para tabelas que utilizam outros motores de armazenamento e que não são particionadas, essa coluna é `NULL`.

* `SUBPARTITION_EXPRESSION`

Isso funciona da mesma maneira para a expressão de subpartição que define a subpartição para uma tabela, como o `PARTITION_EXPRESSION` faz com a expressão de partição usada para definir a partição de uma tabela.

Se a tabela não tiver subpartições, esta coluna é `NULL`.

* `PARTITION_DESCRIPTION`

Esta coluna é usada para as partições RANGE e LIST. Para uma partição `RANGE`, ela contém o valor definido na cláusula `VALUES LESS THAN` da partição, que pode ser um inteiro ou `MAXVALUE`. Para uma partição `LIST`, esta coluna contém os valores definidos na cláusula `VALUES IN` da partição, que é uma lista de valores inteiros separados por vírgula.

Para divisões cuja `PARTITION_METHOD` é diferente de `RANGE` ou `LIST`, esta coluna é sempre `NULL`.

* `TABLE_ROWS`

O número de strings de tabela na partição.

Para tabelas `InnoDB` particionadas, o número de strings fornecido na coluna `TABLE_ROWS` é apenas um valor estimado utilizado na otimização do SQL e pode não ser sempre exato.

Para as tabelas `NDB`, você também pode obter essas informações usando o utilitário **ndb_desc**.

* `AVG_ROW_LENGTH`

O comprimento médio das strings armazenadas nesta partição ou subpartição, em bytes. Isso é o mesmo que `DATA_LENGTH` dividido por `TABLE_ROWS`.

Para as tabelas `NDB`, você também pode obter essas informações usando o utilitário **ndb_desc**.

* `DATA_LENGTH`

O comprimento total de todas as strings armazenadas nesta partição ou subpartição, em bytes; ou seja, o número total de bytes armazenados na partição ou subpartição.

Para as tabelas `NDB`, você também pode obter essas informações usando o utilitário **ndb_desc**.

* `MAX_DATA_LENGTH`

O número máximo de bytes que podem ser armazenados nesta partição ou subpartição.

Para as tabelas `NDB`, você também pode obter essas informações usando o utilitário **ndb_desc**.

* `INDEX_LENGTH`

O comprimento do arquivo de índice para esta partição ou subpartição, em bytes.

Para partições de tabelas `NDB`, independentemente de as tabelas utilizarem partição implícita ou explícita, o valor da coluna `INDEX_LENGTH` é sempre 0. No entanto, você pode obter informações equivalentes usando o utilitário **ndb_desc**.

* `DATA_FREE`

O número de bytes alocados para a partição ou subpartição, mas não utilizados.

Para as tabelas `NDB`, você também pode obter essas informações usando o utilitário **ndb_desc**.

* `CREATE_TIME`

O momento em que a partição ou subpartição foi criada.

* `UPDATE_TIME`

O horário em que a partição ou subpartição foi modificada pela última vez.

* `CHECK_TIME`

A última vez que a tabela a qual esta partição ou subpartição pertence foi verificada.

Para as tabelas `InnoDB` particionadas, o valor é sempre `NULL`.

* `CHECKSUM`

O valor do checksum, se houver; caso contrário, `NULL`.

* `PARTITION_COMMENT`

O texto do comentário, se a partição tiver um. Se não, este valor está vazio.

O comprimento máximo para um comentário de partição é definido como 1024 caracteres, e a largura de exibição da coluna `PARTITION_COMMENT` também é de 1024 caracteres, para corresponder a esse limite.

* `NODEGROUP`

Este é o grupo de nós ao qual a partição pertence. Para as tabelas do NDB Cluster, este é sempre `default`. Para tabelas particionadas que utilizam motores de armazenamento diferentes de `NDB`, o valor também é `default`. Caso contrário, esta coluna está vazia.

* `TABLESPACE_NAME`

O nome do tablespace ao qual a partição pertence. O valor é sempre `DEFAULT`, a menos que a tabela utilize o mecanismo de armazenamento `NDB` (consulte as *Notas* no final desta seção).

#### Notas

* `PARTITIONS` é uma tabela não padrão `INFORMATION_SCHEMA`.

* Uma tabela que utiliza qualquer mecanismo de armazenamento diferente de `NDB` e que não esteja particionada tem uma string na tabela `PARTITIONS`. No entanto, os valores das colunas `PARTITION_NAME`, `SUBPARTITION_NAME`, `PARTITION_ORDINAL_POSITION`, `SUBPARTITION_ORDINAL_POSITION`, `PARTITION_METHOD`, `SUBPARTITION_METHOD`, `PARTITION_EXPRESSION`, `SUBPARTITION_EXPRESSION` e `PARTITION_DESCRIPTION` são todos `NULL`. Além disso, a coluna `PARTITION_COMMENT` neste caso está em branco.

* Uma tabela `NDB` que não está explicitamente particionada tem uma string na tabela `PARTITIONS` para cada nó de dados no cluster NDB. Para cada string desse tipo:

As colunas `SUBPARTITION_NAME`, `SUBPARTITION_ORDINAL_POSITION`, `SUBPARTITION_METHOD`, `SUBPARTITION_EXPRESSION`, `CREATE_TIME`, `UPDATE_TIME`, `CHECK_TIME`, `CHECKSUM` e `TABLESPACE_NAME` são todas `NULL`.

+ O `PARTITION_METHOD` é sempre `KEY`.

+ A coluna `NODEGROUP` é `default`.

+ As colunas `PARTITION_EXPRESSION` e `PARTITION_COMMENT` estão vazias.

### 24.3.17 A tabela de PLUGS do INFORMATION_SCHEMA

A tabela `PLUGINS` fornece informações sobre plugins do servidor.

A tabela `PLUGINS` tem essas colunas:

* `PLUGIN_NAME`

O nome usado para se referir ao plugin em declarações como `INSTALL PLUGIN` e `UNINSTALL PLUGIN`.

* `PLUGIN_VERSION`

A versão do descritor de tipo geral do plugin.

* `PLUGIN_STATUS`

O status do plugin, um dos `ACTIVE`, `INACTIVE`, `DISABLED` ou `DELETED`.

* `PLUGIN_TYPE`

O tipo de plugin, como `STORAGE ENGINE`, `INFORMATION_SCHEMA` ou `AUTHENTICATION`.

* `PLUGIN_TYPE_VERSION`

A versão do descritor específico do tipo do plugin.

* `PLUGIN_LIBRARY`

O nome do arquivo de biblioteca compartilhada do plugin. Este é o nome usado para se referir ao arquivo do plugin em declarações como `INSTALL PLUGIN` e `UNINSTALL PLUGIN`. Este arquivo está localizado no diretório nomeado pela variável de sistema `plugin_dir`. Se o nome da biblioteca for `NULL`, o plugin é compilado e não pode ser desinstalado com `UNINSTALL PLUGIN`.

* `PLUGIN_LIBRARY_VERSION`

Versão da interface da API do plugin.

* `PLUGIN_AUTHOR`

O autor do plugin.

* `PLUGIN_DESCRIPTION`

Uma breve descrição do plugin.

* `PLUGIN_LICENSE`

Como o plugin é licenciado (por exemplo, `GPL`).

* `LOAD_OPTION`

Como o plugin foi carregado. O valor é `OFF`, `ON`, `FORCE` ou `FORCE_PLUS_PERMANENT`. Veja a Seção 5.5.1, “Instalando e Desinstalando Plugins”.

#### Notas

* `PLUGINS` é uma tabela não padrão `INFORMATION_SCHEMA`.

* Para plugins instalados com `INSTALL PLUGIN`, os valores `PLUGIN_NAME` e `PLUGIN_LIBRARY` também são registrados na tabela `mysql.plugin`.

* Para informações sobre as estruturas de dados dos plugins que formam a base das informações na tabela `PLUGINS`, consulte a API do Plugin MySQL.

As informações sobre os plugins também estão disponíveis na declaração `SHOW PLUGINS`. Veja a Seção 13.7.5.25, “Declaração SHOW PLUGINS”. Essas declarações são equivalentes:

```sql
SELECT
  PLUGIN_NAME, PLUGIN_STATUS, PLUGIN_TYPE,
  PLUGIN_LIBRARY, PLUGIN_LICENSE
FROM INFORMATION_SCHEMA.PLUGINS;

SHOW PLUGINS;
```

### 24.3.18 A tabela INFORMATION_SCHEMA PROCESSLIST

A lista de processos do MySQL indica as operações atualmente realizadas pelo conjunto de threads que estão sendo executadas dentro do servidor. A tabela `PROCESSLIST` é uma fonte de informações sobre os processos. Para uma comparação desta tabela com outras fontes, consulte Fontes de Informações sobre Processos.

A tabela `PROCESSLIST` tem essas colunas:

* `ID`

O identificador de conexão. Este é o mesmo valor exibido na coluna `Id` da declaração `SHOW PROCESSLIST`, exibida na coluna `PROCESSLIST_ID` da tabela do Gerador de Desempenho `threads`, e retornado pela função `CONNECTION_ID()` dentro do thread.

* `USER`

O usuário do MySQL que emitiu a declaração. Um valor de `system user` refere-se a um thread não cliente gerado pelo servidor para lidar com tarefas internamente, por exemplo, um thread de manipulação de string atrasada ou um thread de E/S ou SQL usado em hosts replicados. Para `system user`, não há um host especificado na coluna `Host`. `unauthenticated user` refere-se a um thread que se tornou associado a uma conexão com cliente, mas para o qual a autenticação do usuário do cliente ainda não ocorreu. `event_scheduler` refere-se ao thread que monitora eventos agendados (ver Seção 23.4, “Usando o Cronograma de Eventos”).

* `HOST`

O nome do host do cliente que emite a declaração (exceto para `system user`, para o qual não há nenhum nome de host). O nome do host para conexões TCP/IP é relatado no formato `host_name:client_port` para facilitar a determinação de qual cliente está fazendo o que.

* `DB`

O banco de dados padrão para o tópico, ou `NULL` se nenhum tiver sido selecionado.

* `COMMAND`

O tipo de comando que o thread está executando em nome do cliente, ou `Sleep` se a sessão estiver inativa. Para descrições dos comandos do thread, consulte a Seção 8.14, “Examinando Informações do Thread (Processo) do Servidor” (Informações). O valor desta coluna corresponde aos comandos `COM_xxx` do protocolo cliente/servidor e às variáveis de status `Com_xxx`. Consulte a Seção 5.1.9, “Variáveis de Status do Servidor”.

* `TIME`

O tempo em segundos que o thread esteve em seu estado atual. Para um thread de replicação SQL, o valor é o número de segundos entre o timestamp do último evento replicado e o tempo real do host da replica. Veja a Seção 16.2.3, “Threads de Replicação”.

* `STATE`

Uma ação, evento ou estado que indica o que o thread está fazendo. Para descrições dos valores de `STATE`, consulte a Seção 8.14, “Examinando informações do thread do servidor (processo”) (Informações).

A maioria dos estados corresponde a operações muito rápidas. Se um thread permanecer em um estado específico por muitos segundos, pode haver um problema que precisa ser investigado.

* `INFO`

A declaração que o thread está executando, ou `NULL` se não estiver executando nenhuma declaração. A declaração pode ser a uma enviada ao servidor, ou uma declaração interna se a declaração executar outras declarações. Por exemplo, se uma declaração `CALL` executar um procedimento armazenado que está executando uma declaração `SELECT`, o valor `INFO` mostra a declaração `SELECT`.

#### Notas

* `PROCESSLIST` é uma tabela não padrão `INFORMATION_SCHEMA`.

* Assim como a saída da declaração `SHOW PROCESSLIST`, a tabela `PROCESSLIST` fornece informações sobre todos os tópicos, mesmo aqueles pertencentes a outros usuários, se você tiver o privilégio `PROCESS`. Caso contrário (sem o privilégio `PROCESS`, os usuários não anônimos têm acesso às informações sobre seus próprios tópicos, mas não sobre os tópicos de outros usuários, e os usuários anônimos não têm acesso às informações dos tópicos.

* Se uma declaração SQL se referir à tabela `PROCESSLIST`, o MySQL preenche toda a tabela uma vez, quando a execução da declaração começa, portanto, há consistência de leitura durante a declaração. Não há consistência de leitura para uma transação de múltiplas declarações.

As seguintes declarações são equivalentes:

```sql
SELECT * FROM INFORMATION_SCHEMA.PROCESSLIST

SHOW FULL PROCESSLIST
```

### 24.3.19 A tabela de perfilamento INFORMATION_SCHEMA

A tabela `PROFILING` fornece informações de perfilagem de declarações. Seu conteúdo corresponde às informações produzidas pelas declarações `SHOW PROFILE` e `SHOW PROFILES` (consulte Seção 13.7.5.30, “Declaração SHOW PROFILE”). A tabela está vazia, a menos que a variável de sessão `profiling` esteja definida como 1.

Nota

Essa tabela é desatualizada; espere que ela seja removida em uma versão futura do MySQL. Use o Selo de Desempenho em vez disso; veja a Seção 25.19.1, “Profilagem de consulta usando o Selo de Desempenho”.

A tabela `PROFILING` tem essas colunas:

* `QUERY_ID`

Um identificador de declaração numérica.

* `SEQ`

Um número de sequência que indica a ordem de exibição das strings com o mesmo valor de `QUERY_ID`.

* `STATE`

O perfil indica o estado ao qual as medições da string se aplicam.

* `DURATION`

Quanto tempo a execução da declaração permaneceu no estado dado, em segundos.

* `CPU_USER`, `CPU_SYSTEM`

Uso do CPU do usuário e do sistema, em segundos.

* `CONTEXT_VOLUNTARY`, `CONTEXT_INVOLUNTARY`

Quantas trocas de contexto voluntárias e involuntárias ocorreram.

* `BLOCK_OPS_IN`, `BLOCK_OPS_OUT`

O número de operações de entrada e saída de bloco.

* `MESSAGES_SENT`, `MESSAGES_RECEIVED`

O número de mensagens de comunicação enviadas e recebidas.

* `PAGE_FAULTS_MAJOR`, `PAGE_FAULTS_MINOR`

O número de falhas de página principais e secundárias.

* `SWAPS`

Quantas trocas ocorreram.

* `SOURCE_FUNCTION`, `SOURCE_FILE` e `SOURCE_LINE`

Informações que indicam onde no código-fonte o estado perfilado é executado.

#### Notas

* `PROFILING` é uma tabela não padrão `INFORMATION_SCHEMA`.

As informações de perfilamento também estão disponíveis nas declarações `SHOW PROFILE` e `SHOW PROFILES`. Veja a Seção 13.7.5.30, “Declaração SHOW PROFILE”. Por exemplo, as seguintes consultas são equivalentes:

```sql
SHOW PROFILE FOR QUERY 2;

SELECT STATE, FORMAT(DURATION, 6) AS DURATION
FROM INFORMATION_SCHEMA.PROFILING
WHERE QUERY_ID = 2 ORDER BY SEQ;
```

### 24.3.20 Tabela de CONSTITÊNCIAS REFERENCIÁIS do INFORMATION_SCHEMA

A tabela `REFERENTIAL_CONSTRAINTS` fornece informações sobre chaves estrangeiras.

A tabela `REFERENTIAL_CONSTRAINTS` tem essas colunas:

* `CONSTRAINT_CATALOG`

O nome do catálogo ao qual a restrição pertence. Esse valor é sempre `def`.

* `CONSTRAINT_SCHEMA`

O nome do esquema (banco de dados) ao qual a restrição pertence.

* `CONSTRAINT_NAME`

O nome da restrição.

* `UNIQUE_CONSTRAINT_CATALOG`

O nome do catálogo que contém a restrição única que a restrição refere. Esse valor é sempre `def`.

* `UNIQUE_CONSTRAINT_SCHEMA`

O nome do esquema (banco de dados) que contém a restrição exclusiva que a restrição refere.

* `UNIQUE_CONSTRAINT_NAME`

O nome da restrição única que a restrição refere.

* `MATCH_OPTION`

O valor do atributo `MATCH`. O único valor válido neste momento é `NONE`.

* `UPDATE_RULE`

O valor do atributo `ON UPDATE`. Os valores possíveis são `CASCADE`, `SET NULL`, `SET DEFAULT`, `RESTRICT`, `NO ACTION`.

* `DELETE_RULE`

O valor do atributo `ON DELETE`. Os valores possíveis são `CASCADE`, `SET NULL`, `SET DEFAULT`, `RESTRICT`, `NO ACTION`.

* `TABLE_NAME`

O nome da tabela. Esse valor é o mesmo que na tabela `TABLE_CONSTRAINTS`.

* `REFERENCED_TABLE_NAME`

O nome da tabela referenciada pela restrição.

### 24.3.21 A tabela de rotinas do INFORMATION_SCHEMA

A tabela `ROUTINES` fornece informações sobre rotinas armazenadas (procedimentos armazenados e funções armazenadas). A tabela `ROUTINES` não inclui funções integrais (nativas) ou funções carregáveis.

A coluna denominada “`mysql.proc` Nome” indica a coluna da tabela `mysql.proc` que corresponde à coluna da tabela `INFORMATION_SCHEMA` `ROUTINES`, se houver.

A tabela `ROUTINES` tem essas colunas:

* `SPECIFIC_NAME`

O nome da rotina.

* `ROUTINE_CATALOG`

O nome do catálogo ao qual a rotina pertence. Esse valor é sempre `def`.

* `ROUTINE_SCHEMA`

O nome do esquema (banco de dados) ao qual a rotina pertence.

* `ROUTINE_NAME`

O nome da rotina.

* `ROUTINE_TYPE`

`PROCEDURE` para procedimentos armazenados, `FUNCTION` para funções armazenadas.

* `DATA_TYPE`

Se a rotina for uma função armazenada, o tipo de dados do valor de retorno. Se a rotina for um procedimento armazenado, esse valor é vazio.

O valor `DATA_TYPE` é apenas o nome do tipo sem nenhuma outra informação. O valor `DTD_IDENTIFIER` contém o nome do tipo e, possivelmente, outras informações, como a precisão ou o comprimento.

* `CHARACTER_MAXIMUM_LENGTH`

Para valores de retorno de string de função armazenada, o comprimento máximo em caracteres. Se a rotina for um procedimento armazenado, esse valor é `NULL`.

* `CHARACTER_OCTET_LENGTH`

Para valores de retorno de string de função armazenada, o comprimento máximo em bytes. Se a rotina for um procedimento armazenado, esse valor é `NULL`.

* `NUMERIC_PRECISION`

Para valores de retorno numéricos de função armazenada, a precisão numérica. Se a rotina for um procedimento armazenado, esse valor é `NULL`.

* `NUMERIC_SCALE`

Para valores de retorno numéricos de função armazenada, a escala numérica. Se a rotina for um procedimento armazenado, esse valor é `NULL`.

* `DATETIME_PRECISION`

Para valores de retorno temporais de função armazenada, a precisão de frações de segundo. Se a rotina for um procedimento armazenado, esse valor é `NULL`.

* `CHARACTER_SET_NAME`

Para valores de retorno de cadeia de caracteres de função armazenada, o nome do conjunto de caracteres. Se a rotina for um procedimento armazenado, esse valor é `NULL`.

* `COLLATION_NAME`

Para valores de retorno de cadeia de caracteres de função armazenada, o nome da correção. Se a rotina for um procedimento armazenado, esse valor é `NULL`.

* `DTD_IDENTIFIER`

Se a rotina for uma função armazenada, o tipo de dados do valor de retorno. Se a rotina for um procedimento armazenado, esse valor é vazio.

O valor `DATA_TYPE` é apenas o nome do tipo sem nenhuma outra informação. O valor `DTD_IDENTIFIER` contém o nome do tipo e, possivelmente, outras informações, como a precisão ou o comprimento.

* `ROUTINE_BODY`

A linguagem utilizada para a definição rotineira. Esse valor é sempre `SQL`.

* `ROUTINE_DEFINITION`

O texto da declaração SQL executada pela rotina.

* `EXTERNAL_NAME`

Esse valor é sempre `NULL`.

* `EXTERNAL_LANGUAGE`

A linguagem da rotina armazenada. O MySQL calcula `EXTERNAL_LANGUAGE` da seguinte forma:

+ Se `mysql.proc.language='SQL'`, `EXTERNAL_LANGUAGE` é `NULL`

+ Caso contrário, `EXTERNAL_LANGUAGE` é o que está em `mysql.proc.language`. No entanto, ainda não temos idiomas externos, então é sempre `NULL`.

* `PARAMETER_STYLE`

Esse valor é sempre `SQL`.

* `IS_DETERMINISTIC`

`YES` ou `NO`, dependendo se a rotina é definida com a característica `DETERMINISTIC`.

* `SQL_DATA_ACCESS`

A característica de acesso aos dados para a rotina. O valor é um dos `CONTAINS SQL`, `NO SQL`, `READS SQL DATA` ou `MODIFIES SQL DATA`.

* `SQL_PATH`

Esse valor é sempre `NULL`.

* `SECURITY_TYPE`

A característica da rotina `SQL SECURITY`. O valor é um dos `DEFINER` ou `INVOKER`.

* `CREATED`

A data e a hora em que a rotina foi criada. Este é um valor `TIMESTAMP`.

* `LAST_ALTERED`

A data e a hora em que a rotina foi modificada pela última vez. Este é um valor `TIMESTAMP`. Se a rotina não foi modificada desde sua criação, este valor é o mesmo que o valor `CREATED`.

* `SQL_MODE`

O modo SQL em vigor quando a rotina foi criada ou alterada, e sob o qual a rotina é executada. Para os valores permitidos, consulte a Seção 5.1.10, “Modos SQL do servidor”.

* `ROUTINE_COMMENT`

O texto do comentário, se a rotina tiver um. Se não, este valor está vazio.

* `DEFINER`

A conta nomeada na cláusula `DEFINER` (frequentemente o usuário que criou a rotina), no formato `'user_name'@'host_name'`.

* `CHARACTER_SET_CLIENT`

O valor de sessão da variável de sistema `character_set_client` quando a rotina foi criada.

* `COLLATION_CONNECTION`

O valor de sessão da variável de sistema `collation_connection` quando a rotina foi criada.

* `DATABASE_COLLATION`

A agregação do banco de dados com o qual a rotina está associada.

#### Notas

* Para ver informações sobre uma rotina, você deve ser o usuário nomeado na cláusula `DEFINER` ou ter acesso `SELECT` à tabela `mysql.proc`. Se você não tiver privilégios para a própria rotina, o valor exibido para a coluna `ROUTINE_DEFINITION` é `NULL`.

* Informações sobre os valores de retorno de funções armazenadas também estão disponíveis na tabela `PARAMETERS`. A string de valor de retorno para uma função armazenada pode ser identificada como a string que tem um valor de `ORDINAL_POSITION` de 0.

### 24.3.22 A tabela SCHEMATA do INFORMATION_SCHEMA

Um esquema é um banco de dados, portanto, a tabela `SCHEMATA` fornece informações sobre bancos de dados.

A tabela `SCHEMATA` tem essas colunas:

* `CATALOG_NAME`

O nome do catálogo ao qual o esquema pertence. Esse valor é sempre `def`.

* `SCHEMA_NAME`

O nome do esquema.

* `DEFAULT_CHARACTER_SET_NAME`

O conjunto de caracteres padrão do esquema.

* `DEFAULT_COLLATION_NAME`

O esquema de collation padrão.

* `SQL_PATH`

Esse valor é sempre `NULL`.

Os nomes dos esquemas também estão disponíveis na declaração `SHOW DATABASES`. Veja a Seção 13.7.5.14, “Declaração SHOW DATABASES”. As seguintes declarações são equivalentes:

```sql
SELECT SCHEMA_NAME AS `Database`
  FROM INFORMATION_SCHEMA.SCHEMATA
  [WHERE SCHEMA_NAME LIKE 'wild']

SHOW DATABASES
  [LIKE 'wild']
```

Você só verá os bancos de dados para os quais você tem algum tipo de privilégio, a menos que você tenha o privilégio global `SHOW DATABASES`.

Cuidado

Como um privilégio global é considerado um privilégio para todas as bases de dados, *qualquer* privilégio global permite que um usuário veja todos os nomes de banco de dados com `SHOW DATABASES` ou examinando a tabela `INFORMATION_SCHEMA` `SCHEMATA`.

### 24.3.23 A tabela Tabela de PRIVILEGIOS_SCHEMA de INFORMATION_SCHEMA

A tabela `SCHEMA_PRIVILEGES` fornece informações sobre privilégios de esquema (banco de dados). Ela obtém seus valores da tabela do sistema `mysql.db`.

A tabela `SCHEMA_PRIVILEGES` tem essas colunas:

* `GRANTEE`

O nome da conta à qual o privilégio é concedido, no formato `'user_name'@'host_name'`.

* `TABLE_CATALOG`

O nome do catálogo ao qual o esquema pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

O nome do esquema.

* `PRIVILEGE_TYPE`

O privilégio concedido. O valor pode ser qualquer privilégio que possa ser concedido no nível do esquema; veja a Seção 13.7.1.4, "Declaração GRANT". Cada string lista um único privilégio, portanto, há uma string por privilégio de esquema detido pelo beneficiário.

* `IS_GRANTABLE`

`YES` se o usuário tiver o privilégio `GRANT OPTION`, `NO` caso contrário. A saída não lista `GRANT OPTION` como uma string separada com `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Notas

* `SCHEMA_PRIVILEGES` é uma tabela não padrão `INFORMATION_SCHEMA`.

As seguintes afirmações *não* são equivalentes:

```sql
SELECT ... FROM INFORMATION_SCHEMA.SCHEMA_PRIVILEGES

SHOW GRANTS ...
```

### 24.3.24 A tabela de estatísticas do INFORMATION_SCHEMA

A tabela `STATISTICS` fornece informações sobre índices de tabela.

A tabela `STATISTICS` tem essas colunas:

* `TABLE_CATALOG`

O nome do catálogo ao qual a tabela que contém o índice pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

O nome do esquema (banco de dados) ao qual a tabela que contém o índice pertence.

* `TABLE_NAME`

O nome da tabela que contém o índice.

* `NON_UNIQUE`

0 se o índice não pode conter duplicatas, 1 se pode.

* `INDEX_SCHEMA`

O nome do esquema (banco de dados) ao qual o índice pertence.

* `INDEX_NAME`

O nome do índice. Se o índice for a chave primária, o nome é sempre `PRIMARY`.

* `SEQ_IN_INDEX`

O número de sequência da coluna no índice, começando com 1.

* `COLUMN_NAME`

O nome da coluna. Veja também a descrição para a coluna `EXPRESSION`.

* `COLLATION`

Como a coluna é ordenada no índice. Isso pode ter valores `A` (crescente), `D` (decrescente) ou `NULL` (não ordenado).

* `CARDINALITY`

Uma estimativa do número de valores únicos no índice. Para atualizar esse número, execute `ANALYZE TABLE` ou (para as tabelas `MyISAM`), **myisamchk -a**.

`CARDINALITY` é contado com base em estatísticas armazenadas como inteiros, portanto, o valor não é necessariamente exato, mesmo para tabelas pequenas. Quanto maior a cardinalidade, maior a chance de o MySQL usar o índice ao realizar junções.

* `SUB_PART`

O prefixo do índice. Ou seja, o número de caracteres indexados se a coluna estiver apenas parcialmente indexada, `NULL` se toda a coluna estiver indexada.

Nota

Os prefixos *limits* são medidos em bytes. No entanto, os prefixos *lengths* para especificações de índice nas declarações `CREATE TABLE`, `ALTER TABLE` e `CREATE INDEX` são interpretados como número de caracteres para tipos de string não binários (`CHAR`, `VARCHAR`, `TEXT`) e número de bytes para tipos de string binários (`BINARY`, `VARBINARY`, `BLOB`). Tenha isso em conta ao especificar um comprimento de prefixo para uma coluna de string não binária que utiliza um conjunto de caracteres multibyte.

Para informações adicionais sobre prefixos de índice, consulte a Seção 8.3.4, “Indeks de Coluna”, e a Seção 13.1.14, “Instrução CREATE INDEX”.

* `PACKED`

Indica como a chave é embalada. `NULL` se não for o caso.

* `NULLABLE`

Contém `YES` se a coluna pode conter valores de `NULL` e `''` se

* `INDEX_TYPE`

O método de índice utilizado (`BTREE`, `FULLTEXT`, `HASH`, `RTREE`).

* `COMMENT`

Informações sobre o índice não descritas em sua própria coluna, como `disabled`, se o índice estiver desativado.

* `INDEX_COMMENT`

Qualquer comentário fornecido para o índice com um atributo `COMMENT` quando o índice foi criado.

#### Notas

* Não existe uma tabela padrão `INFORMATION_SCHEMA` para índices. A lista de colunas do MySQL é semelhante àquela que o SQL Server 2000 retorna para `sp_statistics`, exceto que `QUALIFIER` e `OWNER` são substituídos por `CATALOG` e `SCHEMA`, respectivamente.

Informações sobre índices de tabela também estão disponíveis na declaração `SHOW INDEX`. Veja a Seção 13.7.5.22, “Declaração SHOW INDEX”. As seguintes declarações são equivalentes:

```sql
SELECT * FROM INFORMATION_SCHEMA.STATISTICS
  WHERE table_name = 'tbl_name'
  AND table_schema = 'db_name'

SHOW INDEX
  FROM tbl_name
  FROM db_name
```

### 24.3.25 A Tabela de TABELAS do SCHEMA DE INFORMAÇÃO

A tabela `TABLES` fornece informações sobre tabelas em bancos de dados.

A tabela `TABLES` tem essas colunas:

* `TABLE_CATALOG`

O nome do catálogo ao qual a tabela pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

O nome do esquema (banco de dados) ao qual a tabela pertence.

* `TABLE_NAME`

O nome da tabela.

* `TABLE_TYPE`

`BASE TABLE` para uma tabela, `VIEW` para uma visualização ou `SYSTEM VIEW` para uma tabela `INFORMATION_SCHEMA`.

A tabela `TABLES` não lista as tabelas `TEMPORARY`.

* `ENGINE`

O mecanismo de armazenamento para a tabela. Veja o Capítulo 14, *O mecanismo de armazenamento InnoDB*, e o Capítulo 15, *Mecanismos de armazenamento alternativos*.

Para tabelas particionadas, `ENGINE` mostra o nome do motor de armazenamento usado por todas as partições.

* `VERSION`

O número da versão do arquivo `.frm` da tabela.

* `ROW_FORMAT`

O formato de armazenamento em string (`Fixed`, `Dynamic`, `Compressed`, `Redundant`, `Compact`). Para as tabelas `MyISAM`, `Dynamic` corresponde ao que o **myisamchk -dvv** reporta como `Packed`. O formato da tabela `InnoDB` é `Redundant` ou `Compact` ao usar o formato de arquivo `Antelope`, ou `Compressed` ou `Dynamic` ao usar o formato de arquivo `Barracuda`.

* `TABLE_ROWS`

O número de strings. Algumas engines de armazenamento, como `MyISAM`, armazenam o contagem exata. Para outras engines de armazenamento, como `InnoDB`, esse valor é uma aproximação e pode variar do valor real em até 40% a 50%. Nesses casos, use `SELECT COUNT(*)` para obter uma contagem precisa.

`TABLE_ROWS` é `NULL` para as tabelas `INFORMATION_SCHEMA`.

Para as tabelas `InnoDB`, o número de strings é apenas uma estimativa grosseira usada na otimização do SQL. (Isso também é verdadeiro se a tabela `InnoDB` estiver particionada.)

* `AVG_ROW_LENGTH`

O comprimento médio da string.

Consulte as notas no final desta seção para informações relacionadas.

* `DATA_LENGTH`

Para `MyISAM`, `DATA_LENGTH` é o comprimento do arquivo de dados, em bytes.

Para `InnoDB`, `DATA_LENGTH` é a quantidade aproximada de espaço alocada para o índice agrupado, em bytes. Especificamente, é o tamanho do índice agrupado, em páginas, multiplicado pelo tamanho da página `InnoDB`.

Consulte as notas no final desta seção para obter informações sobre outros motores de armazenamento.

* `MAX_DATA_LENGTH`

Para `MyISAM`, `MAX_DATA_LENGTH` é o comprimento máximo do arquivo de dados. Este é o número total de bytes de dados que podem ser armazenados na tabela, dado o tamanho do ponteiro de dados utilizado.

Não utilizada para `InnoDB`.

Consulte as notas no final desta seção para obter informações sobre outros motores de armazenamento.

* `INDEX_LENGTH`

Para `MyISAM`, `INDEX_LENGTH` é o comprimento do arquivo de índice, em bytes.

Para `InnoDB`, `INDEX_LENGTH` é a quantidade aproximada de espaço alocado para índices não agrupados, em bytes. Especificamente, é a soma dos tamanhos dos índices não agrupados, em páginas, multiplicada pelo tamanho da página `InnoDB`.

Consulte as notas no final desta seção para obter informações sobre outros motores de armazenamento.

* `DATA_FREE`

O número de bytes alocados, mas não utilizados.

As tabelas `InnoDB` relatam o espaço livre do espaço de tabelas ao qual a tabela pertence. Para uma tabela localizada no espaço de tabelas compartilhado, este é o espaço livre do espaço de tabelas compartilhado. Se você estiver usando vários espaços de tabelas e a tabela tenha seu próprio espaço de tabelas, o espaço livre é apenas para essa tabela. Espaço livre significa o número de bytes em extensões completamente livres, menos uma margem de segurança. Mesmo que o espaço livre seja exibido como 0, é possível inserir strings, desde que novas extensões não precisem ser alocadas.

Para o NDB Cluster, `DATA_FREE` mostra o espaço alocado em disco para, mas não utilizado por, uma tabela ou fragmento de dados de disco. (O uso do recurso de dados em memória é relatado pela coluna `DATA_LENGTH`.

Para tabelas particionadas, esse valor é apenas uma estimativa e pode não ser absolutamente correto. Um método mais preciso de obter essas informações, nesses casos, é consultar a tabela `INFORMATION_SCHEMA` `PARTITIONS`, conforme mostrado neste exemplo:

  ```sql
  SELECT SUM(DATA_FREE)
      FROM  INFORMATION_SCHEMA.PARTITIONS
      WHERE TABLE_SCHEMA = 'mydb'
      AND   TABLE_NAME   = 'mytable';
  ```

Para mais informações, consulte a Seção 24.3.16, “A tabela de PARTITIONS do INFORMATION_SCHEMA”.

* `AUTO_INCREMENT`

O próximo valor de `AUTO_INCREMENT`.

* `CREATE_TIME`

Quando a tabela foi criada.

* `UPDATE_TIME`

Quando o arquivo de dados foi atualizado pela última vez. Para alguns motores de armazenamento, este valor é `NULL`. Por exemplo, `InnoDB` armazena várias tabelas em seu espaço de tabela de sistema e o timestamp do arquivo de dados não se aplica. Mesmo com o modo de arquivo por tabela, com cada tabela `InnoDB` em um arquivo separado `.ibd`, a mudança de buffer pode atrasar a escrita no arquivo de dados, então o tempo de modificação do arquivo é diferente do momento da última inserção, atualização ou exclusão. Para `MyISAM`, o timestamp do arquivo de dados é usado; no entanto, no Windows, o timestamp não é atualizado por atualizações, então o valor é impreciso.

`UPDATE_TIME` exibe um valor de marca-passo para as últimas tabelas `UPDATE`, `INSERT` ou `DELETE` realizadas em `InnoDB` que não estão particionadas. Para MVCC, o valor de marca-passo reflete o tempo de `COMMIT`, que é considerado o último horário de atualização. Os timestamps não são persistidos quando o servidor é reiniciado ou quando a tabela é ejetada do cache do dicionário de dados `InnoDB`.

A coluna `UPDATE_TIME` também exibe essas informações para tabelas particionadas `InnoDB`.

* `CHECK_TIME`

Quando a tabela foi verificada pela última vez. Nem todos os mecanismos de armazenamento são atualizados dessa vez, no caso, o valor é sempre `NULL`.

Para tabelas `InnoDB` particionadas, `CHECK_TIME` é sempre `NULL`.

* `TABLE_COLLATION`

A tabela de collation padrão. A saída não lista explicitamente o conjunto de caracteres padrão da tabela, mas o nome da collation começa com o nome do conjunto de caracteres.

* `CHECKSUM`

O valor do checksum ao vivo, se houver.

* `CREATE_OPTIONS`

Opções extras usadas com `CREATE TABLE`.

`CREATE_OPTIONS` mostra `partitioned` se a tabela estiver particionada.

`CREATE_OPTIONS` mostra a cláusula `ENCRYPTION` especificada para tabelas criadas em espaços de tabela por tabela.

Ao criar uma tabela com o modo estrito desativado, o formato de string padrão do mecanismo de armazenamento é usado se o formato de string especificado não for suportado. O formato de string real da tabela é relatado na coluna `ROW_FORMAT`. `CREATE_OPTIONS` mostra o formato de string que foi especificado na declaração `CREATE TABLE`.

Ao alterar o motor de armazenamento de uma tabela, as opções da tabela que não são aplicáveis ao novo motor de armazenamento são mantidas na definição da tabela para permitir a reversão da tabela com suas opções previamente definidas para o motor de armazenamento original, se necessário. A coluna `CREATE_OPTIONS` pode mostrar opções retidas.

* `TABLE_COMMENT`

O comentário usado ao criar a tabela (ou informações sobre o motivo pelo qual o MySQL não conseguiu acessar as informações da tabela).

#### Notas

* Para as tabelas `NDB`, a saída desta declaração mostra valores apropriados para as colunas `AVG_ROW_LENGTH` e `DATA_LENGTH`, com exceção de que as colunas `BLOB` não são consideradas.

* Para as tabelas de `NDB`, `DATA_LENGTH` inclui dados armazenados na memória principal; as colunas `MAX_DATA_LENGTH` e `DATA_FREE` se aplicam aos dados em disco.

* Para as tabelas de dados de disco do NDB Cluster, `MAX_DATA_LENGTH` mostra o espaço alocado para a parte de disco de uma tabela ou fragmento de dados de disco. (O uso do recurso de dados em memória é relatado pela coluna `DATA_LENGTH`.)

* Para as tabelas `MEMORY`, os valores `DATA_LENGTH`, `MAX_DATA_LENGTH` e `INDEX_LENGTH` aproximam o valor real da memória alocada. O algoritmo de alocação reserva memória em grandes quantidades para reduzir o número de operações de alocação.

* Para as visualizações, todas as colunas `TABLES` são `NULL`, exceto que `TABLE_NAME` indica o nome da visualização e `TABLE_COMMENT` diz `VIEW`.

As informações sobre a tabela também estão disponíveis nas declarações `SHOW TABLE STATUS` e `SHOW TABLES`. Veja a Seção 13.7.5.36, “Declaração SHOW TABLE STATUS”, e a Seção 13.7.5.37, “Declaração SHOW TABLES”. As seguintes declarações são equivalentes:

```sql
SELECT
    TABLE_NAME, ENGINE, VERSION, ROW_FORMAT, TABLE_ROWS, AVG_ROW_LENGTH,
    DATA_LENGTH, MAX_DATA_LENGTH, INDEX_LENGTH, DATA_FREE, AUTO_INCREMENT,
    CREATE_TIME, UPDATE_TIME, CHECK_TIME, TABLE_COLLATION, CHECKSUM,
    CREATE_OPTIONS, TABLE_COMMENT
  FROM INFORMATION_SCHEMA.TABLES
  WHERE table_schema = 'db_name'
  [AND table_name LIKE 'wild']

SHOW TABLE STATUS
  FROM db_name
  [LIKE 'wild']
```

As seguintes declarações são equivalentes:

```sql
SELECT
  TABLE_NAME, TABLE_TYPE
  FROM INFORMATION_SCHEMA.TABLES
  WHERE table_schema = 'db_name'
  [AND table_name LIKE 'wild']

SHOW FULL TABLES
  FROM db_name
  [LIKE 'wild']
```

### 24.3.26 A tabela TABELASPACES de INFORMATION_SCHEMA

Esta tabela não é utilizada. Outras tabelas `INFORMATION_SCHEMA` podem fornecer informações relacionadas:

* Para `NDB`, a tabela `INFORMATION_SCHEMA` `FILES` fornece informações relacionadas ao espaço de tabela.

* Para `InnoDB`, as tabelas `INFORMATION_SCHEMA`, `INNODB_SYS_TABLESPACES` e `INNODB_SYS_DATAFILES` fornecem metadados do espaço de tabelas.

### 24.3.27 A tabela CONSTRAINTS da tabela INFORMATION_SCHEMA

A tabela `TABLE_CONSTRAINTS` descreve quais tabelas possuem restrições.

A tabela `TABLE_CONSTRAINTS` tem essas colunas:

* `CONSTRAINT_CATALOG`

O nome do catálogo ao qual a restrição pertence. Esse valor é sempre `def`.

* `CONSTRAINT_SCHEMA`

O nome do esquema (banco de dados) ao qual a restrição pertence.

* `CONSTRAINT_NAME`

O nome da restrição.

* `TABLE_SCHEMA`

O nome do esquema (banco de dados) ao qual a tabela pertence.

* `TABLE_NAME`

O nome da tabela.

* `CONSTRAINT_TYPE`

O tipo de restrição. O valor pode ser `UNIQUE`, `PRIMARY KEY`, `FOREIGN KEY` ou `CHECK`. Esta é uma coluna `CHAR` (não `ENUM`) O valor `CHECK` não está disponível até que o MySQL suporte `CHECK`.

As informações do `UNIQUE` e `PRIMARY KEY` são as mesmas que as obtidas a partir da coluna `Key_name` no resultado do `SHOW INDEX`, quando a coluna `Non_unique` está em `0`.

### 24.3.28 A tabela TABLE_PRIVILEGES do esquema de informações INFORMATION_SCHEMA

A tabela `TABLE_PRIVILEGES` fornece informações sobre privilégios de tabela. Ela obtém seus valores da tabela do sistema `mysql.tables_priv`.

A tabela `TABLE_PRIVILEGES` tem essas colunas:

* `GRANTEE`

O nome da conta à qual o privilégio é concedido, no formato `'user_name'@'host_name'`.

* `TABLE_CATALOG`

O nome do catálogo ao qual a tabela pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

O nome do esquema (banco de dados) ao qual a tabela pertence.

* `TABLE_NAME`

O nome da tabela.

* `PRIVILEGE_TYPE`

O privilégio concedido. O valor pode ser qualquer privilégio que possa ser concedido no nível da tabela; veja a Seção 13.7.1.4, "Declaração GRANT". Cada string lista um único privilégio, portanto, há uma string por privilégio de tabela mantido pelo beneficiário.

* `IS_GRANTABLE`

`YES` se o usuário tiver o privilégio `GRANT OPTION`, `NO` caso contrário. A saída não lista `GRANT OPTION` como uma string separada com `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Notas

* `TABLE_PRIVILEGES` é uma tabela não padrão `INFORMATION_SCHEMA`.

As seguintes afirmações *não* são equivalentes:

```sql
SELECT ... FROM INFORMATION_SCHEMA.TABLE_PRIVILEGES

SHOW GRANTS ...
```

### 24.3.29 A tabela TRIGGERS do esquema de informações (INFORMATION_SCHEMA)

A tabela `TRIGGERS` fornece informações sobre os gatilhos. Para ver informações sobre os gatilhos de uma tabela, você deve ter o privilégio `TRIGGER` para a tabela.

A tabela `TRIGGERS` tem essas colunas:

* `TRIGGER_CATALOG`

O nome do catálogo ao qual o gatilho pertence. Esse valor é sempre `def`.

* `TRIGGER_SCHEMA`

O nome do esquema (banco de dados) ao qual o gatilho pertence.

* `TRIGGER_NAME`

O nome do gatilho.

* `EVENT_MANIPULATION`

O evento desencadeador. Este é o tipo de operação na tabela associada para a qual o gatilho é ativado. O valor é `INSERT` (uma string foi inserida), `DELETE` (uma string foi excluída) ou `UPDATE` (uma string foi modificada).

* `EVENT_OBJECT_CATALOG`, `EVENT_OBJECT_SCHEMA` e `EVENT_OBJECT_TABLE`

Como observado na Seção 23.3, “Usando gatilhos”, cada gatilho está associado exatamente a uma tabela. Essas colunas indicam o catálogo e o esquema (banco de dados) em que essa tabela ocorre, e o nome da tabela, respectivamente. O valor `EVENT_OBJECT_CATALOG` é sempre `def`.

* `ACTION_ORDER`

A posição ordinal da ação do gatilho na lista de gatilhos na mesma tabela com os mesmos valores de `EVENT_MANIPULATION` e `ACTION_TIMING`.

* `ACTION_CONDITION`

Esse valor é sempre `NULL`.

* `ACTION_STATEMENT`

O corpo do gatilho; ou seja, a declaração executada quando o gatilho é ativado. Este texto usa codificação UTF-8.

* `ACTION_ORIENTATION`

Esse valor é sempre `ROW`.

* `ACTION_TIMING`

Se o gatilho é ativado antes ou depois do evento desencadeador. O valor é `BEFORE` ou `AFTER`.

* `ACTION_REFERENCE_OLD_TABLE`

Esse valor é sempre `NULL`.

* `ACTION_REFERENCE_NEW_TABLE`

Esse valor é sempre `NULL`.

* `ACTION_REFERENCE_OLD_ROW` e `ACTION_REFERENCE_NEW_ROW`

Os identificadores de coluna antigos e novos, respectivamente. O valor `ACTION_REFERENCE_OLD_ROW` é sempre `OLD` e o valor `ACTION_REFERENCE_NEW_ROW` é sempre `NEW`.

* `CREATED`

A data e a hora em que o gatilho foi criado. Este é um valor `TIMESTAMP(2)` (com uma parte fracionária em centésimos de segundos) para gatilhos criados no MySQL 5.7.2 ou posterior, `NULL` para gatilhos criados antes de 5.7.2.

* `SQL_MODE`

O modo SQL em vigor quando o gatilho foi criado e sob o qual o gatilho é executado. Para os valores permitidos, consulte a Seção 5.1.10, “Modos SQL do servidor”.

* `DEFINER`

A conta nomeada na cláusula `DEFINER` (frequentemente o usuário que criou o gatilho), no formato `'user_name'@'host_name'`.

* `CHARACTER_SET_CLIENT`

O valor da sessão da variável de sistema `character_set_client` quando o gatilho foi criado.

* `COLLATION_CONNECTION`

O valor da sessão da variável de sistema `collation_connection` quando o gatilho foi criado.

* `DATABASE_COLLATION`

A agregação do banco de dados com o qual o gatilho está associado.

#### Exemplo

O exemplo a seguir utiliza o gatilho `ins_sum`, definido na Seção 23.3, “Usando gatilhos”:

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.TRIGGERS
       WHERE TRIGGER_SCHEMA='test' AND TRIGGER_NAME='ins_sum'\G
*************************** 1. row ***************************
           TRIGGER_CATALOG: def
            TRIGGER_SCHEMA: test
              TRIGGER_NAME: ins_sum
        EVENT_MANIPULATION: INSERT
      EVENT_OBJECT_CATALOG: def
       EVENT_OBJECT_SCHEMA: test
        EVENT_OBJECT_TABLE: account
              ACTION_ORDER: 1
          ACTION_CONDITION: NULL
          ACTION_STATEMENT: SET @sum = @sum + NEW.amount
        ACTION_ORIENTATION: ROW
             ACTION_TIMING: BEFORE
ACTION_REFERENCE_OLD_TABLE: NULL
ACTION_REFERENCE_NEW_TABLE: NULL
  ACTION_REFERENCE_OLD_ROW: OLD
  ACTION_REFERENCE_NEW_ROW: NEW
                   CREATED: 2018-08-08 10:10:12.61
                  SQL_MODE: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                            NO_ZERO_IN_DATE,NO_ZERO_DATE,
                            ERROR_FOR_DIVISION_BY_ZERO,
                            NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
                   DEFINER: me@localhost
      CHARACTER_SET_CLIENT: utf8
      COLLATION_CONNECTION: utf8_general_ci
        DATABASE_COLLATION: latin1_swedish_ci
```

Informações sobre gatilho também estão disponíveis na declaração `SHOW TRIGGERS`. Veja a Seção 13.7.5.38, “Declaração SHOW TRIGGERS”.

### 24.3.30 A tabela INFORMATION_SCHEMA.USER_PRIVILEGES

A tabela `USER_PRIVILEGES` fornece informações sobre privilégios globais. Ela obtém seus valores da tabela do sistema `mysql.user`.

A tabela `USER_PRIVILEGES` tem essas colunas:

* `GRANTEE`

O nome da conta à qual o privilégio é concedido, no formato `'user_name'@'host_name'`.

* `TABLE_CATALOG`

O nome do catálogo. Esse valor é sempre `def`.

* `PRIVILEGE_TYPE`

O privilégio concedido. O valor pode ser qualquer privilégio que possa ser concedido a nível global; veja a Seção 13.7.1.4, "Declaração de GRANDE". Cada string lista um único privilégio, portanto, há uma string por privilégio global detido pelo beneficiário.

* `IS_GRANTABLE`

`YES` se o usuário tiver o privilégio `GRANT OPTION`, `NO` caso contrário. A saída não lista `GRANT OPTION` como uma string separada com `PRIVILEGE_TYPE='GRANT OPTION'`.

#### Notas

* `USER_PRIVILEGES` é uma tabela não padrão `INFORMATION_SCHEMA`.

As seguintes afirmações *não* são equivalentes:

```sql
SELECT ... FROM INFORMATION_SCHEMA.USER_PRIVILEGES

SHOW GRANTS ...
```

### 24.3.31 A Tabela INFORMATION_SCHEMA VIEWS

A tabela `VIEWS` fornece informações sobre visualizações em bancos de dados. Você deve ter o privilégio `SHOW VIEW` para acessar essa tabela.

A tabela `VIEWS` tem essas colunas:

* `TABLE_CATALOG`

O nome do catálogo ao qual a visualização pertence. Esse valor é sempre `def`.

* `TABLE_SCHEMA`

O nome do esquema (banco de dados) ao qual a visão pertence.

* `TABLE_NAME`

O nome da vista.

* `VIEW_DEFINITION`

A declaração `SELECT` que fornece a definição da visão. Essa coluna tem a maioria do que você vê na coluna `Create Table` que a `SHOW CREATE VIEW` produz. Ignorar as palavras antes de `SELECT` e ignorar as palavras `WITH CHECK OPTION`. Suponha que a declaração original fosse:

  ```sql
  CREATE VIEW v AS
    SELECT s2,s1 FROM t
    WHERE s1 > 5
    ORDER BY s1
    WITH CHECK OPTION;
  ```

Então, a definição de visualização é a seguinte:

  ```sql
  SELECT s2,s1 FROM t WHERE s1 > 5 ORDER BY s1
  ```

* `CHECK_OPTION`

O valor do atributo `CHECK_OPTION`. O valor é um dos `NONE`, `CASCADE` ou `LOCAL`.

* `IS_UPDATABLE`

O MySQL define uma bandeira, chamada de bandeira de atualização de visão, no momento `CREATE VIEW`. A bandeira é definida como `YES` (verdadeiro) se `UPDATE` e `DELETE` (e operações semelhantes) forem legais para a visão. Caso contrário, a bandeira é definida como `NO` (falso). A coluna `IS_UPDATABLE` na tabela `VIEWS` exibe o status desta bandeira.

Se uma visão não for atualizável, declarações como `UPDATE`, `DELETE` e `INSERT` são ilegais e são rejeitadas. (Mesmo que uma visão seja atualizável, pode não ser possível inseri-la nela; para detalhes, consulte a Seção 23.5.3, “Visões atualizáveis e inseríveis”.)

A bandeira `IS_UPDATABLE` pode ser pouco confiável se uma visão depender de uma ou mais outras visões, e uma dessas visões subjacentes for atualizada. Independentemente do valor `IS_UPDATABLE`, o servidor mantém o controle da atualizabilidade de uma visão e rejeita corretamente as operações de mudança de dados para visões que não são atualizáveis. Se o valor `IS_UPDATABLE` para uma visão se tornou impreciso devido a mudanças em visões subjacentes, o valor pode ser atualizado por meio da exclusão e recriação da visão.

* `DEFINER`

A conta do usuário que criou a visualização, no formato `'user_name'@'host_name'`.

* `SECURITY_TYPE`

A vista `SQL SECURITY` característica. O valor é um dos `DEFINER` ou `INVOKER`.

* `CHARACTER_SET_CLIENT`

O valor de sessão da variável de sistema `character_set_client` quando a visualização foi criada.

* `COLLATION_CONNECTION`

O valor de sessão da variável de sistema `collation_connection` quando a visualização foi criada.

#### Notas

O MySQL permite diferentes configurações `sql_mode` para indicar ao servidor o tipo de sintaxe SQL a ser suportado. Por exemplo, você pode usar o modo SQL `ANSI` para garantir que o MySQL interprete corretamente o operador de concatenação padrão SQL, a barra dupla (`||`), em suas consultas. Se você criar uma visão que concatene itens, pode se preocupar que alterar a configuração `sql_mode` para um valor diferente de `ANSI` possa fazer com que a visão se torne inválida. Mas isso não é o caso. Independentemente de como você escreva uma definição de visão, o MySQL sempre a armazena da mesma maneira, em uma forma canônica. Aqui está um exemplo que mostra como o servidor altera um operador de concatenação de barra dupla para uma função `CONCAT()`:

```sql
mysql> SET sql_mode = 'ANSI';
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE VIEW test.v AS SELECT 'a' || 'b' as col1;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT VIEW_DEFINITION FROM INFORMATION_SCHEMA.VIEWS
       WHERE TABLE_SCHEMA = 'test' AND TABLE_NAME = 'v';
+----------------------------------+
| VIEW_DEFINITION                  |
+----------------------------------+
| select concat('a','b') AS `col1` |
+----------------------------------+
1 row in set (0.00 sec)
```

A vantagem de armazenar uma definição de visualização em forma canônica é que as alterações feitas posteriormente no valor de `sql_mode` não afetam os resultados da visualização. No entanto, uma consequência adicional é que os comentários anteriores a `SELECT` são removidos da definição pelo servidor.