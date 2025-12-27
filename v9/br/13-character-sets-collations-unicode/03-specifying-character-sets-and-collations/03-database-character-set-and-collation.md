### 12.3.3 Conjunto de Caracteres e Colagem de Banco de Dados

Cada banco de dados tem um conjunto de caracteres de banco de dados e uma colagem de banco de dados. As instruções `CREATE DATABASE` e `ALTER DATABASE` têm cláusulas opcionais para especificar o conjunto de caracteres e a colagem de banco de dados:

```
CREATE DATABASE db_name
    [[DEFAULT] CHARACTER SET charset_name]
    [[DEFAULT] COLLATE collation_name]

ALTER DATABASE db_name
    [[DEFAULT] CHARACTER SET charset_name]
    [[DEFAULT] COLLATE collation_name]
```

A palavra-chave `SCHEMA` pode ser usada em vez de `DATABASE`.

As cláusulas `CHARACTER SET` e `COLLATE` permitem criar bancos de dados com diferentes conjuntos de caracteres e colagens no mesmo servidor MySQL.

As opções do banco de dados são armazenadas no dicionário de dados e podem ser examinadas verificando a tabela `SCHEMATA` do esquema `INFORMATION_SCHEMA`.

Exemplo:

```
CREATE DATABASE db_name CHARACTER SET latin1 COLLATE latin1_swedish_ci;
```

O MySQL escolhe o conjunto de caracteres e a colagem de banco de dados do seguinte modo:

* Se tanto `CHARACTER SET charset_name` quanto `COLLATE collation_name` forem especificados, o conjunto de caracteres *`charset_name`* e a colagem *`collation_name`* serão usados.

* Se `CHARACTER SET charset_name` for especificado sem `COLLATE`, o conjunto de caracteres *`charset_name`* e sua colagem padrão serão usados. Para ver a colagem padrão para cada conjunto de caracteres, use a instrução `SHOW CHARACTER SET` ou consulte a tabela `CHARACTER_SETS` do esquema `INFORMATION_SCHEMA`.

* Se `COLLATE collation_name` for especificado sem `CHARACTER SET`, o conjunto de caracteres associado a *`collation_name`* e a colagem *`collation_name`* serão usados.

* Caso contrário (nem `CHARACTER SET` nem `COLLATE` forem especificados), o conjunto de caracteres do servidor e a colagem do servidor serão usados.

O conjunto de caracteres e a ordenação do banco de dados padrão podem ser determinados pelos valores das variáveis de sistema `character_set_database` e `collation_database`. O servidor define essas variáveis sempre que o banco de dados padrão muda. Se não houver um banco de dados padrão, as variáveis terão o mesmo valor que as variáveis de sistema do nível do servidor, `character_set_server` e `collation_server`.

Para ver o conjunto de caracteres e a ordenação padrão de um banco de dados específico, use essas instruções:

```
USE db_name;
SELECT @@character_set_database, @@collation_database;
```

Alternativamente, para exibir os valores sem alterar o banco de dados padrão:

```
SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME
FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'db_name';
```

O conjunto de caracteres e a ordenação do banco de dados afetam esses aspectos do funcionamento do servidor:

* Para as instruções `CREATE TABLE`, o conjunto de caracteres e a ordenação do banco de dados são usados como valores padrão para as definições de tabelas, caso o conjunto de caracteres e a ordenação da tabela não sejam especificados. Para sobrescrever isso, forneça opções de tabela explícitas `CHARACTER SET` e `COLLATE`.

* Para as instruções `LOAD DATA` que não incluem uma cláusula `CHARACTER SET`, o servidor usa o conjunto de caracteres indicado pela variável de sistema `character_set_database` para interpretar as informações no arquivo. Para sobrescrever isso, forneça uma cláusula `CHARACTER SET` explícita.

* Para rotinas armazenadas (procedimentos e funções), o conjunto de caracteres e a ordenação do banco de dados em vigor no momento da criação da rotina são usados como conjunto de caracteres e ordenação dos parâmetros de dados de caracteres para os quais a declaração não inclui `CHARACTER SET` ou um atributo `COLLATE`. Para sobrescrever isso, forneça `CHARACTER SET` e `COLLATE` explicitamente.