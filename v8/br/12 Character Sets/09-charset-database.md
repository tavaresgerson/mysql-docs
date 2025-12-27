### 12.3.3 Conjunto de caracteres e ordenação de banco de dados

Cada banco de dados tem um conjunto de caracteres de banco de dados e uma ordenação de banco de dados. As instruções `CREATE DATABASE` e `ALTER DATABASE` têm cláusulas opcionais para especificar o conjunto de caracteres de banco de dados e a ordenação de banco de dados:

```
CREATE DATABASE db_name
    [[DEFAULT] CHARACTER SET charset_name]
    [[DEFAULT] COLLATE collation_name]

ALTER DATABASE db_name
    [[DEFAULT] CHARACTER SET charset_name]
    [[DEFAULT] COLLATE collation_name]
```

A palavra-chave `SCHEMA` pode ser usada em vez de `DATABASE`.

As cláusulas `CHARACTER SET` e `COLLATE` permitem criar bancos de dados com diferentes conjuntos de caracteres e ordenações de banco de dados no mesmo servidor MySQL.

As opções do banco de dados são armazenadas no dicionário de dados e podem ser examinadas verificando a tabela `SCHEMATA` do esquema `INFORMATION_SCHEMA`.

Exemplo:

```
CREATE DATABASE db_name CHARACTER SET latin1 COLLATE latin1_swedish_ci;
```

O MySQL escolhe o conjunto de caracteres de banco de dados e a ordenação de banco de dados da seguinte maneira:

* Se tanto `CHARACTER SET charset_name` quanto `COLLATE collation_name` forem especificados, o conjunto de caracteres *`charset_name`* e a ordenação *`collation_name`* serão usados.
* Se `CHARACTER SET charset_name` for especificado sem `COLLATE`, o conjunto de caracteres *`charset_name`* e sua ordenação padrão serão usados. Para ver a ordenação padrão para cada conjunto de caracteres, use a instrução `SHOW CHARACTER SET` ou consulte a tabela `CHARACTER_SETS` do esquema `INFORMATION_SCHEMA`.
* Se `COLLATE collation_name` for especificado sem `CHARACTER SET`, o conjunto de caracteres associado a *`collation_name`* e a ordenação *`collation_name`* serão usados.
* Caso contrário (nem `CHARACTER SET` nem `COLLATE` forem especificados), o conjunto de caracteres do servidor e a ordenação do servidor serão usados.

O conjunto de caracteres e a ordenação para o banco de dados padrão podem ser determinados pelos valores das variáveis de sistema `character_set_database` e `collation_database`. O servidor define essas variáveis sempre que o banco de dados padrão muda. Se não houver banco de dados padrão, as variáveis terão o mesmo valor que as variáveis de sistema correspondentes ao nível do servidor, `character_set_server` e `collation_server`.

Para ver o conjunto de caracteres e a ordenação padrão para um determinado banco de dados, use essas instruções:

```
USE db_name;
SELECT @@character_set_database, @@collation_database;
```VDnTcGcfVT```

O conjunto de caracteres do banco de dados e a collation afetam esses aspectos do funcionamento do servidor:

* Para as instruções `CREATE TABLE`, o conjunto de caracteres do banco de dados e a collation são usados como valores padrão para as definições da tabela, se o conjunto de caracteres e a collation da tabela não forem especificados. Para sobrescrever isso, forneça opções de tabela explícitas `CHARACTER SET` e `COLLATE`.
* Para as instruções `LOAD DATA` que não incluem a cláusula `CHARACTER SET`, o servidor usa o conjunto de caracteres indicado pela variável de sistema `character_set_database` para interpretar as informações no arquivo. Para sobrescrever isso, forneça uma cláusula `CHARACTER SET` explícita.
* Para rotinas armazenadas (procedimentos e funções), o conjunto de caracteres do banco de dados e a collation em vigor no momento da criação da rotina são usados como conjunto de caracteres e collation dos parâmetros de dados de caracteres para os quais a declaração não inclui o atributo `CHARACTER SET` ou `COLLATE`. Para sobrescrever isso, forneça `CHARACTER SET` e `COLLATE` explicitamente.