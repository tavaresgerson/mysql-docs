### 10.3.3 Conjunto de caracteres e classificação de banco de dados

Cada banco de dados tem um conjunto de caracteres do banco de dados e uma collation do banco de dados. As instruções `CREATE DATABASE` e `ALTER DATABASE` têm cláusulas opcionais para especificar o conjunto de caracteres do banco de dados e a collation:

```sql
CREATE DATABASE db_name
    DEFAULT] CHARACTER SET charset_name]
    DEFAULT] COLLATE collation_name]

ALTER DATABASE db_name
    DEFAULT] CHARACTER SET charset_name]
    DEFAULT] COLLATE collation_name]
```

A palavra-chave `SCHEMA` pode ser usada em vez de `DATABASE`.

Todas as opções de banco de dados são armazenadas em um arquivo de texto chamado `db.opt`, que pode ser encontrado no diretório do banco de dados.

As cláusulas `CHARACTER SET` e `COLLATE` permitem criar bancos de dados com diferentes conjuntos de caracteres e ordenações no mesmo servidor MySQL.

Exemplo:

```sql
CREATE DATABASE db_name CHARACTER SET latin1 COLLATE latin1_swedish_ci;
```

O MySQL escolhe o conjunto de caracteres do banco de dados e a collation do banco de dados da seguinte maneira:

- Se ambos `CHARACTER SET charset_name` e `COLLATE collation_name` forem especificados, o conjunto de caracteres *`charset_name`* e a ordenação *`collation_name`* serão usados.

- Se `CHARACTER SET charset_name` for especificado sem `COLLATE`, o conjunto de caracteres `charset_name`\* e sua collation padrão serão usados. Para ver a collation padrão para cada conjunto de caracteres, use a instrução `SHOW CHARACTER SET` ou consulte a tabela `INFORMATION_SCHEMA` `CHARACTER_SETS`.

- Se `COLLATE collation_name` for especificado sem `CHARACTER SET`, o conjunto de caracteres associado a *`collation_name`* e a collation *`collation_name`* serão usados.

- Caso contrário (nem `CHARACTER SET` nem `COLLATE` sejam especificados), o conjunto de caracteres do servidor e a ordenação do servidor serão usados.

O conjunto de caracteres e a ordenação do banco de dados padrão podem ser determinados pelos valores das variáveis de sistema `character_set_database` e `collation_database`. O servidor define essas variáveis sempre que o banco de dados padrão muda. Se não houver um banco de dados padrão, as variáveis terão o mesmo valor que as variáveis de sistema do nível do servidor, `character_set_server` e `collation_server`.

Para ver o conjunto de caracteres padrão e a ordenação para um banco de dados específico, use as seguintes instruções:

```sql
USE db_name;
SELECT @@character_set_database, @@collation_database;
```

Alternativamente, para exibir os valores sem alterar o banco de dados padrão:

```sql
SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME
FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'db_name';
```

O conjunto de caracteres e a concordância do banco de dados afetam esses aspectos do funcionamento do servidor:

- Para as instruções `CREATE TABLE`, o conjunto de caracteres e a concordância da base de dados são usados como valores padrão para as definições da tabela, caso o conjunto de caracteres e a concordância da tabela não sejam especificados. Para substituir isso, forneça opções de tabela explícitas `CHARACTER SET` e `COLLATE`.

- Para as instruções `LOAD DATA` que não incluem a cláusula `CHARACTER SET`, o servidor usa o conjunto de caracteres indicado pela variável de sistema `character_set_database` para interpretar as informações no arquivo. Para contornar isso, forneça uma cláusula `CHARACTER SET` explícita.

- Para rotinas armazenadas (procedimentos e funções), o conjunto de caracteres e a concordância do banco de dados em vigor no momento da criação da rotina são usados como conjunto de caracteres e concordância dos parâmetros de dados de caracteres para os quais a declaração não inclui o atributo `CHARACTER SET` ou `COLLATE`. Para contornar isso, forneça `CHARACTER SET` e `COLLATE` explicitamente.
