### 12.3.3 Conjunto de caracteres e classificação de banco de dados

Cada banco de dados tem um conjunto de caracteres do banco de dados e uma collation do banco de dados. As instruções `CREATE DATABASE` e `ALTER DATABASE` têm cláusulas opcionais para especificar o conjunto de caracteres do banco de dados e a collation:

```
CREATE DATABASE db_name
    [[DEFAULT] CHARACTER SET charset_name]
    [[DEFAULT] COLLATE collation_name]

ALTER DATABASE db_name
    [[DEFAULT] CHARACTER SET charset_name]
    [[DEFAULT] COLLATE collation_name]
```

A palavra-chave `SCHEMA` pode ser usada em vez de `DATABASE`.

As cláusulas `CHARACTER SET` e `COLLATE` permitem criar bancos de dados com diferentes conjuntos de caracteres e ordenações no mesmo servidor MySQL.

As opções de banco de dados são armazenadas no dicionário de dados e podem ser examinadas verificando a tabela do esquema de informações `SCHEMATA`.

Exemplo:

```
CREATE DATABASE db_name CHARACTER SET latin1 COLLATE latin1_swedish_ci;
```

O MySQL escolhe o conjunto de caracteres do banco de dados e a collation do banco de dados da seguinte maneira:

- Se ambos `CHARACTER SET charset_name` e `COLLATE collation_name` forem especificados, o conjunto de caracteres `charset_name` e a ordenação `collation_name` serão utilizados.

- Se `CHARACTER SET charset_name` for especificado sem `COLLATE`, o conjunto de caracteres `charset_name` e sua collation padrão serão usados. Para ver a collation padrão para cada conjunto de caracteres, use a instrução `SHOW CHARACTER SET` ou consulte a tabela `INFORMATION_SCHEMA` `CHARACTER_SETS`.

- Se `COLLATE collation_name` for especificado sem `CHARACTER SET`, o conjunto de caracteres associado a `collation_name` e à ordenação `collation_name` serão usados.

- Caso contrário (nem o `CHARACTER SET` nem o `COLLATE` sejam especificados), o conjunto de caracteres do servidor e a ordenação do servidor serão usados.

O conjunto de caracteres e a ordenação do banco de dados padrão podem ser determinados pelos valores das variáveis de sistema `character_set_database` e `collation_database`. O servidor define essas variáveis sempre que o banco de dados padrão muda. Se não houver um banco de dados padrão, as variáveis terão o mesmo valor que as variáveis de sistema do nível do servidor, `character_set_server` e `collation_server`.

Para ver o conjunto de caracteres padrão e a ordenação para um banco de dados específico, use as seguintes instruções:

```
USE db_name;
SELECT @@character_set_database, @@collation_database;
```

Alternativamente, para exibir os valores sem alterar o banco de dados padrão:

```
SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME
FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'db_name';
```

O conjunto de caracteres e a concordância do banco de dados afetam esses aspectos do funcionamento do servidor:

- Para as declarações `CREATE TABLE`, o conjunto de caracteres e a concordância do banco de dados são usados como valores padrão para as definições de tabela, caso o conjunto de caracteres e a concordância da tabela não sejam especificados. Para substituir isso, forneça as opções de tabela explícitas `CHARACTER SET` e `COLLATE`.

- Para declarações `LOAD DATA` que não incluem nenhuma cláusula `CHARACTER SET`, o servidor usa o conjunto de caracteres indicado pela variável de sistema `character_set_database` para interpretar as informações no arquivo. Para contornar isso, forneça uma cláusula `CHARACTER SET` explícita.

- Para rotinas armazenadas (procedimentos e funções), o conjunto de caracteres e a concordância do banco de dados em vigor no momento da criação da rotina são usados como conjunto de caracteres e concordância dos parâmetros de dados de caracteres para os quais a declaração não inclui o atributo `CHARACTER SET` ou um atributo `COLLATE`. Para contornar isso, forneça explicitamente `CHARACTER SET` e `COLLATE`.
