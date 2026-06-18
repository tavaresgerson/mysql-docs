### 15.1.12 Declaração CREATE DATABASE

```
CREATE {DATABASE | SCHEMA} [IF NOT EXISTS] db_name
    [create_option] ...

create_option: [DEFAULT] {
    CHARACTER SET [=] charset_name
  | COLLATE [=] collation_name
  | ENCRYPTION [=] {'Y' | 'N'}
}
```

`CREATE DATABASE` cria um banco de dados com o nome fornecido. Para usar essa declaração, você precisa do privilégio `CREATE` para o banco de dados. `CREATE SCHEMA` é um sinônimo de `CREATE DATABASE`.

Um erro ocorre se o banco de dados existir e você não especificar `IF NOT EXISTS`.

`CREATE DATABASE` não é permitido em uma sessão que tenha uma declaração `LOCK TABLES` ativa.

Cada `create_option` especifica uma característica do banco de dados. As características do banco de dados são armazenadas no dicionário de dados.

- A opção `CHARACTER SET` especifica o conjunto de caracteres padrão do banco de dados. A opção `COLLATE` especifica a agregação padrão do banco de dados. Para obter informações sobre os nomes dos conjuntos de caracteres e agregações, consulte o Capítulo 12, *Conjunto de caracteres, agregações, Unicode*.

  Para ver os conjuntos de caracteres e as codificações disponíveis, use as instruções `SHOW CHARACTER SET` e `SHOW COLLATION`, respectivamente. Veja a Seção 15.7.7.3, “Instrução SHOW CHARACTER SET”, e a Seção 15.7.7.4, “Instrução SHOW COLLATION”.

- A opção `ENCRYPTION`, introduzida no MySQL 8.0.16, define a criptografia padrão da base de dados, que é herdada pelas tabelas criadas na base de dados. Os valores permitidos são `'Y'` (criptografia habilitada) e `'N'` (criptografia desativada). Se a opção `ENCRYPTION` não for especificada, o valor da variável de sistema `default_table_encryption` define a criptografia padrão da base de dados. Se a variável de sistema `table_encryption_privilege_check` estiver habilitada, o privilégio `TABLE_ENCRYPTION_ADMIN` é necessário para especificar uma configuração de criptografia padrão que difere da configuração `default_table_encryption`. Para obter mais informações, consulte Definindo um Padrão de Criptografia para Esquemas e Espaços de Tabelas Gerais.

Um banco de dados no MySQL é implementado como um diretório que contém arquivos que correspondem às tabelas no banco de dados. Como não há tabelas em um banco de dados quando ele é criado inicialmente, a instrução `CREATE DATABASE` cria apenas um diretório sob o diretório de dados do MySQL. As regras para nomes de bancos de dados permitidos são fornecidas na Seção 11.2, “Nomes de Objetos do Esquema”. Se um nome de banco de dados contiver caracteres especiais, o nome do diretório do banco de dados contém versões codificadas desses caracteres, conforme descrito na Seção 11.2.4, “Mapeamento de Identificadores a Nomes de Arquivos”.

Criar um diretório de banco de dados criando manualmente um diretório sob o diretório de dados (por exemplo, com **mkdir**) não é suportado no MySQL 8.0.

Ao criar um banco de dados, deixe o servidor gerenciar o diretório e os arquivos nele. Manipular diretórios e arquivos de banco de dados diretamente pode causar inconsistências e resultados inesperados.

O MySQL não tem limite no número de bancos de dados. O sistema de arquivos subjacente pode ter um limite no número de diretórios.

Você também pode usar o programa **mysqladmin** para criar bancos de dados. Veja a Seção 6.5.2, “mysqladmin — Um programa de administração do servidor MySQL”.
