### 15.1.14 Declaração `CREATE DATABASE`

```
CREATE {DATABASE | SCHEMA} [IF NOT EXISTS] db_name
    [create_option] ...

create_option: [DEFAULT] {
    CHARACTER SET [=] charset_name
  | COLLATE [=] collation_name
  | ENCRYPTION [=] {'Y' | 'N'}
}
```

`CREATE DATABASE` cria uma base de dados com o nome especificado. Para usar essa declaração, você precisa do privilégio `CREATE` para a base de dados. `CREATE SCHEMA` é um sinônimo de `CREATE DATABASE`.

Um erro ocorre se a base de dados já existir e você não especificar `IF NOT EXISTS`.

`CREATE DATABASE` não é permitido dentro de uma sessão que tenha uma declaração `LOCK TABLES` ativa.

Cada *`create_option`* especifica uma característica da base de dados. As características da base de dados são armazenadas no dicionário de dados.

* A opção `CHARACTER SET` especifica o conjunto de caracteres padrão da base de dados. A opção `COLLATE` especifica a collation padrão da base de dados. Para informações sobre os nomes de conjuntos de caracteres e collation, consulte o Capítulo 12, *Sets de Caracteres, Collations, Unicode*.

  Para ver os conjuntos de caracteres e collation disponíveis, use as declarações `SHOW CHARACTER SET` e `SHOW COLLATION`, respectivamente. Consulte a Seção 15.7.7.4, “Declaração SHOW CHARACTER SET”, e a Seção 15.7.7.5, “Declaração SHOW COLLATION”.

* A opção `ENCRYPTION` define o criptograma padrão da base de dados, que é herdado por tabelas criadas na base de dados. Os valores permitidos são `'Y'` (criptografia habilitada) e `'N'` (criptografia desabilitada). Se a opção `ENCRYPTION` não for especificada, o valor da variável de sistema `default_table_encryption` define o criptograma padrão da base de dados. Se a variável de sistema `table_encryption_privilege_check` estiver habilitada, o privilégio `TABLE_ENCRYPTION_ADMIN` é necessário para especificar um conjunto de criptografia padrão que difere do conjunto de criptografia `default_table_encryption`. Para mais informações, consulte Definindo um Criptograma Padrão para Schemas e General Tablespaces.

Um banco de dados no MySQL é implementado como um diretório que contém arquivos que correspondem às tabelas no banco de dados. Como não há tabelas em um banco de dados quando ele é criado inicialmente, a instrução `CREATE DATABASE` cria apenas um diretório sob o diretório de dados do MySQL. As regras para nomes de bancos de dados permitidos estão descritas na Seção 11.2, “Nomes de Objetos do Esquema”. Se um nome de banco de dados contiver caracteres especiais, o nome do diretório do banco de dados conterá versões codificadas desses caracteres, conforme descrito na Seção 11.2.4, “Mapeamento de Identificadores para Nomes de Arquivos”.

Criar um diretório de banco de dados manualmente criando um diretório sob o diretório de dados (por exemplo, com **mkdir**) não é suportado no MySQL 9.5.

Ao criar um banco de dados, deixe o servidor gerenciar o diretório e os arquivos nele. Manipular diretórios e arquivos de banco de dados diretamente pode causar inconsistências e resultados inesperados.

O MySQL não tem limite no número de bancos de dados. O sistema de arquivos subjacente pode ter um limite no número de diretórios.

Você também pode usar o programa **mysqladmin** para criar bancos de dados. Veja a Seção 6.5.2, “mysqladmin — Um Programa de Administração do Servidor MySQL”.