### 13.1.11 Instrução CREATE DATABASE

```sql
CREATE {DATABASE | SCHEMA} [IF NOT EXISTS] db_name
    [create_option] ...

create_option: [DEFAULT] {
    CHARACTER SET [=] charset_name
  | COLLATE [=] collation_name
}
```

O `CREATE DATABASE` cria um Database com o nome fornecido. Para usar esta instrução, você precisa do privilégio `CREATE` para o Database. `CREATE SCHEMA` é um sinônimo para `CREATE DATABASE`.

Ocorre um erro se o Database já existir e você não tiver especificado `IF NOT EXISTS`.

O `CREATE DATABASE` não é permitido dentro de uma sessão que tenha uma instrução `LOCK TABLES` ativa.

Cada *`create_option`* especifica uma característica do Database. As características do Database são armazenadas no arquivo `db.opt` no diretório do Database. A opção `CHARACTER SET` especifica o *character set* padrão do Database. A opção `COLLATE` especifica a *collation* padrão do Database. Para obter informações sobre nomes de *character set* e *collation*, consulte Chapter 10, *Character Sets, Collations, Unicode*.

Para ver os *character sets* e *collations* disponíveis, use as instruções `SHOW CHARACTER SET` e `SHOW COLLATION`, respectivamente. Consulte Section 13.7.5.3, “SHOW CHARACTER SET Statement”, e Section 13.7.5.4, “SHOW COLLATION Statement”.

Um Database no MySQL é implementado como um diretório que contém arquivos que correspondem às Tables do Database. Como não há Tables em um Database quando ele é criado inicialmente, a instrução `CREATE DATABASE` cria apenas um diretório sob o diretório de dados do MySQL e o arquivo `db.opt`. As regras para nomes de Database permitidos são fornecidas em Section 9.2, “Schema Object Names”. Se um nome de Database contiver caracteres especiais, o nome do diretório do Database conterá versões codificadas desses caracteres, conforme descrito em Section 9.2.4, “Mapping of Identifiers to File Names”.

Se você criar manualmente um diretório sob o diretório de dados (por exemplo, com **mkdir**), o Server o considera um diretório de Database e ele aparece na saída de `SHOW DATABASES`.

Ao criar um Database, permita que o Server gerencie o diretório e os arquivos contidos nele. A manipulação direta de diretórios e arquivos de Database pode causar inconsistências e resultados inesperados.

O MySQL não tem limite para o número de Databases. O *file system* subjacente pode ter um limite para o número de diretórios.

Você também pode usar o programa **mysqladmin** para criar Databases. Consulte Section 4.5.2, “mysqladmin — A MySQL Server Administration Program”.