### 13.1.11 Declaração CREATE DATABASE

```sql
CREATE {DATABASE | SCHEMA} [IF NOT EXISTS] db_name
    [create_option] ...

create_option: [DEFAULT] {
    CHARACTER SET [=] charset_name
  | COLLATE [=] collation_name
}
```

`CREATE DATABASE` cria um banco de dados com o nome fornecido. Para usar essa instrução, você precisa do privilégio `CREATE` para o banco de dados. `CREATE SCHEMA` é um sinônimo de `CREATE DATABASE`.

Um erro ocorre se o banco de dados existir e você não especificar `IF NOT EXISTS`.

A instrução `CREATE DATABASE` não é permitida dentro de uma sessão que tenha uma instrução `LOCK TABLES` ativa.

Cada `create_option` especifica uma característica do banco de dados. As características do banco de dados são armazenadas no arquivo `db.opt` no diretório do banco de dados. A opção `CHARACTER SET` especifica o conjunto de caracteres padrão do banco de dados. A opção `COLLATE` especifica a collation padrão do banco de dados. Para informações sobre os nomes dos conjuntos de caracteres e collation, consulte Capítulo 10, *Caracteres, Collations, Unicode*.

Para ver os conjuntos de caracteres e as codificações disponíveis, use as instruções `SHOW CHARACTER SET` e `SHOW COLLATION`, respectivamente. Veja Seção 13.7.5.3, “Instrução SHOW CHARACTER SET” e Seção 13.7.5.4, “Instrução SHOW COLLATION”.

Um banco de dados no MySQL é implementado como um diretório que contém arquivos que correspondem às tabelas no banco de dados. Como não há tabelas em um banco de dados quando ele é criado inicialmente, a instrução `CREATE DATABASE` cria apenas um diretório sob o diretório de dados do MySQL e o arquivo `db.opt`. As regras para nomes de bancos de dados permitidos estão descritas na Seção 9.2, “Nomes de Objetos do Esquema”. Se um nome de banco de dados contiver caracteres especiais, o nome do diretório do banco de dados contém versões codificadas desses caracteres, conforme descrito na Seção 9.2.4, “Mapeamento de Identificadores para Nomes de Arquivos”.

Se você criar manualmente um diretório sob o diretório de dados (por exemplo, com **mkdir**), o servidor o considera um diretório de banco de dados e ele aparece na saída de `SHOW DATABASES`.

Ao criar um banco de dados, deixe o servidor gerenciar o diretório e os arquivos nele. Manipular diretórios e arquivos de banco de dados diretamente pode causar inconsistências e resultados inesperados.

O MySQL não tem limite no número de bancos de dados. O sistema de arquivos subjacente pode ter um limite no número de diretórios.

Você também pode usar o programa **mysqladmin** para criar bancos de dados. Veja Seção 4.5.2, “mysqladmin — Um programa de administração do servidor MySQL”.
