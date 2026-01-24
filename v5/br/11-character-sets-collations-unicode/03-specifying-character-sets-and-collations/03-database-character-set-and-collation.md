### 10.3.3 Character Set e Collation do Database

Todo Database possui um database character set e um database collation. As instruções `CREATE DATABASE` e `ALTER DATABASE` possuem cláusulas opcionais para especificar o character set e o collation do Database:

```sql
CREATE DATABASE db_name
    DEFAULT] CHARACTER SET charset_name]
    DEFAULT] COLLATE collation_name]

ALTER DATABASE db_name
    DEFAULT] CHARACTER SET charset_name]
    DEFAULT] COLLATE collation_name]
```

A palavra-chave `SCHEMA` pode ser usada em vez de `DATABASE`.

Todas as opções do Database são armazenadas em um arquivo de texto chamado `db.opt`, que pode ser encontrado no diretório do Database.

As cláusulas `CHARACTER SET` e `COLLATE` tornam possível criar Databases com diferentes character sets e collations no mesmo servidor MySQL.

Exemplo:

```sql
CREATE DATABASE db_name CHARACTER SET latin1 COLLATE latin1_swedish_ci;
```

O MySQL escolhe o database character set e o database collation da seguinte maneira:

* Se ambos `CHARACTER SET charset_name` e `COLLATE collation_name` forem especificados, o character set *`charset_name`* e o collation *`collation_name`* são usados.

* Se `CHARACTER SET charset_name` for especificado sem `COLLATE`, o character set *`charset_name`* e seu collation padrão são usados. Para ver o collation padrão para cada character set, use a instrução `SHOW CHARACTER SET` ou faça Query na tabela `CHARACTER_SETS` do `INFORMATION_SCHEMA`.

* Se `COLLATE collation_name` for especificado sem `CHARACTER SET`, o character set associado a *`collation_name`* e o collation *`collation_name`* são usados.

* Caso contrário (se nem `CHARACTER SET` nem `COLLATE` forem especificados), o server character set e o server collation são usados.

O character set e o collation para o Database padrão podem ser determinados a partir dos valores das variáveis de sistema `character_set_database` e `collation_database`. O servidor define essas variáveis sempre que o Database padrão é alterado. Se não houver um Database padrão, as variáveis terão o mesmo valor que as variáveis de sistema de nível de servidor correspondentes, `character_set_server` e `collation_server`.

Para ver o character set e o collation padrão de um determinado Database, use estas instruções:

```sql
USE db_name;
SELECT @@character_set_database, @@collation_database;
```

Alternativamente, para exibir os valores sem mudar o Database padrão:

```sql
SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME
FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'db_name';
```

O database character set e collation afetam os seguintes aspectos da operação do servidor:

* Para instruções `CREATE TABLE`, o database character set e collation são usados como valores padrão para as definições de tabela, caso o table character set e collation não sejam especificados. Para sobrescrever isso, forneça opções de tabela `CHARACTER SET` e `COLLATE` explícitas.

* Para instruções `LOAD DATA` que não incluem uma cláusula `CHARACTER SET`, o servidor usa o character set indicado pela variável de sistema `character_set_database` para interpretar as informações no arquivo. Para sobrescrever isso, forneça uma cláusula `CHARACTER SET` explícita.

* Para stored routines (procedures e functions), o database character set e collation em vigor no momento da criação da rotina são usados como o character set e collation dos parâmetros de dados de caracteres para os quais a declaração não inclui um atributo `CHARACTER SET` ou `COLLATE`. Para sobrescrever isso, forneça `CHARACTER SET` e `COLLATE` explicitamente.