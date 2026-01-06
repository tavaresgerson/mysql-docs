### 24.3.29 A tabela INFORMATION\_SCHEMA TRIGGERS

A tabela `TRIGGERS` fornece informações sobre os gatilhos. Para ver informações sobre os gatilhos de uma tabela, você deve ter o privilégio `TRIGGER` para a tabela.

A tabela `TRIGGERS` tem as seguintes colunas:

- `TRIGGER_CATALOG`

  O nome do catálogo ao qual o gatilho pertence. Esse valor é sempre `def`.

- `TRIGGER_SCHEMA`

  O nome do esquema (banco de dados) ao qual o gatilho pertence.

- `TRIGGER_NAME`

  O nome do gatilho.

- `EVENT_MANIPULATION`

  O evento desencadeador. Este é o tipo de operação na tabela associada para a qual o gatilho é ativado. O valor é `INSERT` (uma linha foi inserida), `DELETE` (uma linha foi excluída) ou `UPDATE` (uma linha foi modificada).

- `EVENT_OBJECT_CATALOG`, `EVENT_OBJECT_SCHEMA` e `EVENT_OBJECT_TABLE`

  Como observado na Seção 23.3, “Usando gatilhos”, cada gatilho está associado exatamente a uma tabela. Essas colunas indicam o catálogo e o esquema (banco de dados) em que essa tabela ocorre, e o nome da tabela, respectivamente. O valor `EVENT_OBJECT_CATALOG` é sempre `def`.

- `AÇÃO_ORDEM`

  A posição ordinal da ação do gatilho na lista de gatilhos na mesma tabela com os mesmos valores de `EVENT_MANIPULATION` e `ACTION_TIMING`.

- `AÇÃO_CONDICIONAL`

  Esse valor é sempre `NULL`.

- `DECLARAÇÃO DE AÇÃO`

  O corpo do gatilho; ou seja, a declaração executada quando o gatilho é ativado. Este texto usa codificação UTF-8.

- `AÇÃO_ORIENTAÇÃO`

  Esse valor é sempre `ROW`.

- `AÇÃO_TIMING`

  Se o gatilho é ativado antes ou depois do evento que o desencadeia. O valor é `BEFORE` ou `AFTER`.

- `AÇÃO_REFERÊNCIA_TABELA_VELHA`

  Esse valor é sempre `NULL`.

- `AÇÃO_REFERÊNCIA_NOVO_TABELA`

  Esse valor é sempre `NULL`.

- `AÇÃO_REFERÊNCIA_VELHA_LINHA` e `AÇÃO_REFERÊNCIA_NOVA_LINHA`

  Os identificadores de coluna antigos e novos, respectivamente. O valor `ACTION_REFERENCE_OLD_ROW` é sempre `OLD` e o valor `ACTION_REFERENCE_NEW_ROW` é sempre `NEW`.

- `CREADO`

  A data e a hora em que o gatilho foi criado. Este é um valor `TIMESTAMP(2)` (com uma parte fracionária em centésimos de segundo) para gatilhos criados no MySQL 5.7.2 ou posterior, `NULL` para gatilhos criados antes de 5.7.2.

- `SQL_MODE`

  O modo SQL em vigor quando o gatilho foi criado e sob o qual o gatilho é executado. Para os valores permitidos, consulte Seção 5.1.10, “Modos SQL do Servidor”.

- `DEFINIR`

  A conta nomeada na cláusula `DEFINER` (geralmente o usuário que criou o gatilho), no formato `'user_name'@'host_name'`.

- `CHARACTER_SET_CLIENT`

  O valor da sessão da variável de sistema `character_set_client` quando o gatilho foi criado.

- `COLLATION_CONNECTION`

  O valor da sessão da variável de sistema `collation_connection` quando o gatilho foi criado.

- `DATABASE_COLLATION`

  A agregação do banco de dados com o qual o gatilho está associado.

#### Exemplo

O exemplo a seguir utiliza o gatilho `ins_sum` definido em Seção 23.3, “Usando gatilhos”:

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

As informações sobre gatilhos também estão disponíveis na instrução `SHOW TRIGGERS`. Consulte Seção 13.7.5.38, “Instrução SHOW TRIGGERS”.
