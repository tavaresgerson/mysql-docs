### 13.1.1 Comando ALTER DATABASE

```sql
ALTER {DATABASE | SCHEMA} [db_name]
    alter_option ...
ALTER {DATABASE | SCHEMA} db_name
    UPGRADE DATA DIRECTORY NAME

alter_option: {
    [DEFAULT] CHARACTER SET [=] charset_name
  | [DEFAULT] COLLATE [=] collation_name
}
```

O `ALTER DATABASE` permite que você altere as características gerais de um Database. Essas características são armazenadas no arquivo `db.opt` no diretório do Database. Este comando requer o privilégio `ALTER` no Database. `ALTER SCHEMA` é um sinônimo para `ALTER DATABASE`.

O nome do Database pode ser omitido da primeira sintaxe, caso em que o comando se aplica ao Database padrão. Um erro ocorre se não houver um Database padrão.

* [Opções de Character Set e Collation](alter-database.html#alter-database-charset "Character Set and Collation Options")
* [Atualizando de Versões Anteriores ao MySQL 5.1](alter-database.html#alter-database-upgrading "Upgrading from Versions Older than MySQL 5.1")

#### Opções de Character Set e Collation

A cláusula `CHARACTER SET` altera o character set padrão do Database. A cláusula `COLLATE` altera o collation padrão do Database. Para obter informações sobre nomes de character set e collation, consulte [Capítulo 10, *Character Sets, Collations, Unicode*](charset.html "Chapter 10 Character Sets, Collations, Unicode").

Para ver os character sets e collations disponíveis, use os comandos [`SHOW CHARACTER SET`](show-character-set.html "13.7.5.3 SHOW CHARACTER SET Statement") e [`SHOW COLLATION`](show-collation.html "13.7.5.4 SHOW COLLATION Statement"), respectivamente. Consulte [Seção 13.7.5.3, “Comando SHOW CHARACTER SET”](show-character-set.html "13.7.5.3 SHOW CHARACTER SET Statement") e [Seção 13.7.5.4, “Comando SHOW COLLATION”](show-collation.html "13.7.5.4 SHOW COLLATION Statement").

Uma stored routine que usa os padrões do Database quando a rotina é criada inclui esses padrões como parte de sua definição. (Em uma stored routine, variáveis com tipos de dados de caractere usam os padrões do Database se o character set ou collation não forem especificados explicitamente. Consulte [Seção 13.1.16, “Comandos CREATE PROCEDURE e CREATE FUNCTION”](create-procedure.html "13.1.16 CREATE PROCEDURE and CREATE FUNCTION Statements").) Se você alterar o character set ou collation padrão de um Database, quaisquer stored routines que devam usar os novos padrões devem ser descartadas (dropped) e recriadas.

#### Atualizando de Versões Anteriores ao MySQL 5.1

A sintaxe que inclui a cláusula `UPGRADE DATA DIRECTORY NAME` atualiza o nome do diretório associado ao Database para usar a codificação implementada no MySQL 5.1 para mapear nomes de Database para nomes de diretórios de Database (consulte [Seção 9.2.4, “Mapeamento de Identificadores para Nomes de Arquivos”](identifier-mapping.html "9.2.4 Mapping of Identifiers to File Names")). Esta cláusula destina-se ao uso sob estas condições:

* É destinada ao atualizar o MySQL para 5.1 ou posterior a partir de versões mais antigas.

* Destina-se a atualizar o nome de um diretório de Database para o formato de codificação atual se o nome contiver caracteres especiais que necessitam de codificação.

* O comando é usado pelo [**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program") (conforme invocado pelo [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables")).

Por exemplo, se um Database no MySQL 5.0 tiver o nome `a-b-c`, o nome contém instâncias do caractere `-` (traço). No MySQL 5.0, o diretório do Database também é denominado `a-b-c`, o que não é necessariamente seguro para todos os sistemas de arquivos. No MySQL 5.1 e posterior, o mesmo nome de Database é codificado como `a@002db@002dc` para produzir um nome de diretório neutro para o sistema de arquivos (file system-neutral).

Quando uma instalação do MySQL é atualizada para 5.1 ou posterior a partir de uma versão mais antiga, o servidor exibe um nome como `a-b-c` (que está no formato antigo) como `#mysql50#a-b-c`, e você deve se referir ao nome usando o prefixo `#mysql50#`. Use `UPGRADE DATA DIRECTORY NAME` neste caso para instruir explicitamente o servidor a recodificar o nome do diretório do Database para o formato de codificação atual:

```sql
ALTER DATABASE `#mysql50#a-b-c` UPGRADE DATA DIRECTORY NAME;
```

Após executar este comando, você pode se referir ao Database como `a-b-c` sem o prefixo especial `#mysql50#`.

**Nota**

A cláusula `UPGRADE DATA DIRECTORY NAME` foi descontinuada (deprecated) no MySQL 5.7 e removida no MySQL 8.0. Se for necessário converter nomes de Database ou Table do MySQL 5.0, uma solução alternativa é atualizar uma instalação do MySQL 5.0 para MySQL 5.1 antes de atualizar para o MySQL 8.0.