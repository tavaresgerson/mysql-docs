### 10.3.3 Character Set e Collation do Database

Todo `Database` possui um character set e uma collation de `Database`. As instruções `CREATE DATABASE` e `ALTER DATABASE` possuem cláusulas opcionais para especificar o character set e a collation do `Database`:

```sql
CREATE DATABASE db_name
    DEFAULT] CHARACTER SET charset_name]
    DEFAULT] COLLATE collation_name]

ALTER DATABASE db_name
    DEFAULT] CHARACTER SET charset_name]
    DEFAULT] COLLATE collation_name]
```

A palavra-chave `SCHEMA` pode ser usada em vez de `DATABASE`.

Todas as opções do `Database` são armazenadas em um arquivo de texto chamado `db.opt`, que pode ser encontrado no diretório do `Database`.

As cláusulas `CHARACTER SET` e `COLLATE` possibilitam a criação de `Databases` com diferentes character sets e collations no mesmo `server` MySQL.

Exemplo:

```sql
CREATE DATABASE db_name CHARACTER SET latin1 COLLATE latin1_swedish_ci;
```

O MySQL escolhe o character set e a collation do `Database` da seguinte maneira:

* Se ambos `CHARACTER SET charset_name` e `COLLATE collation_name` forem especificados, o character set *`charset_name`* e a collation *`collation_name`* são usados.

* Se `CHARACTER SET charset_name` for especificado sem `COLLATE`, o character set *`charset_name`* e sua collation padrão são usados. Para ver a collation padrão de cada character set, use a instrução `SHOW CHARACTER SET` ou faça uma `Query` na tabela `CHARACTER_SETS` do `INFORMATION_SCHEMA`.

* Se `COLLATE collation_name` for especificado sem `CHARACTER SET`, o character set associado a *`collation_name`* e a collation *`collation_name`* são usados.

* Caso contrário (se nem `CHARACTER SET` nem `COLLATE` forem especificados), o character set do `server` e a collation do `server` são usados.

O character set e a collation para o `Database` padrão podem ser determinados a partir dos valores das system variables `character_set_database` e `collation_database`. O `server` define essas variáveis sempre que o `Database` padrão é alterado. Se não houver um `Database` padrão, as variáveis terão o mesmo valor das correspondentes system variables de nível de `server`, `character_set_server` e `collation_server`.

Para ver o character set e a collation padrão para um determinado `Database`, use estas instruções:

```sql
USE db_name;
SELECT @@character_set_database, @@collation_database;
```

Alternativamente, para exibir os valores sem alterar o `Database` padrão:

```sql
SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME
FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'db_name';
```

O character set e a collation do `Database` afetam estes aspectos da operação do `server`:

* Para instruções `CREATE TABLE`, o character set e a collation do `Database` são usados como valores padrão para as definições de tabela, caso o character set e a collation da tabela não sejam especificados. Para sobrescrever isso, forneça opções explícitas de tabela `CHARACTER SET` e `COLLATE`.

* Para instruções `LOAD DATA` que não incluem uma cláusula `CHARACTER SET`, o `server` usa o character set indicado pela system variable `character_set_database` para interpretar as informações no arquivo. Para sobrescrever isso, forneça uma cláusula `CHARACTER SET` explícita.

* Para stored routines (procedures e functions), o character set e a collation do `Database` em vigor no momento da criação da rotina são usados como o character set e a collation dos parâmetros de dados de caracteres cuja declaração não inclui um atributo `CHARACTER SET` ou `COLLATE`. Para sobrescrever isso, forneça `CHARACTER SET` e `COLLATE` explicitamente.