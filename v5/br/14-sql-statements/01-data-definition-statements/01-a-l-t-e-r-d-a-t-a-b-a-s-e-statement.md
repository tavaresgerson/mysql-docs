### 13.1.1 Declaração ALTER DATABASE

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

`ALTER DATABASE` permite que você altere as características gerais de um banco de dados. Essas características são armazenadas no arquivo `db.opt` no diretório do banco de dados. Esta declaração requer o privilégio `ALTER` no banco de dados. `ALTER SCHEMA` é um sinônimo de `ALTER DATABASE`.

O nome do banco de dados pode ser omitido da primeira sintaxe, caso em que a declaração se aplica ao banco de dados padrão. Um erro ocorre se não houver um banco de dados padrão.

- Conjunto de caracteres e opções de cotação
- Atualização a partir de versões mais antigas do MySQL 5.1

#### Conjunto de caracteres e opções de cotação

A cláusula `CHARACTER SET` altera o conjunto de caracteres padrão do banco de dados. A cláusula `COLLATE` altera a concordância padrão do banco de dados. Para obter informações sobre os nomes dos conjuntos de caracteres e concordâncias, consulte \[Capítulo 10, *Caracteres, Concordâncias, Unicode*] (charset.html).

Para ver os conjuntos de caracteres e as codificações disponíveis, use as instruções `SHOW CHARACTER SET` e `SHOW COLLATION`, respectivamente. Veja Seção 13.7.5.3, “Instrução SHOW CHARACTER SET” e Seção 13.7.5.4, “Instrução SHOW COLLATION”.

Uma rotina armazenada que usa os padrões do banco de dados quando a rotina é criada inclui esses padrões como parte de sua definição. (Em uma rotina armazenada, variáveis com tipos de dados de caracteres usam os padrões do banco de dados se o conjunto de caracteres ou a ordenação não forem especificados explicitamente. Veja Seção 13.1.16, “Instruções CREATE PROCEDURE e CREATE FUNCTION”.) Se você alterar o conjunto de caracteres padrão ou a ordenação de um banco de dados, todas as rotinas armazenadas que devem usar os novos padrões devem ser excluídas e recriadas.

#### Atualizando versões mais antigas do MySQL 5.1

A sintaxe que inclui a cláusula `UPGRADE DATA DIRECTORY NAME` atualiza o nome do diretório associado ao banco de dados para usar a codificação implementada no MySQL 5.1 para mapear nomes de bancos de dados a nomes de diretórios de bancos de dados (consulte Seção 9.2.4, “Mapeamento de Identificadores a Nomes de Arquivos”). Esta cláusula é para uso sob estas condições:

- É necessário fazer isso ao atualizar o MySQL para a versão 5.1 ou superior a versões mais antigas.

- O objetivo é atualizar o nome do diretório do banco de dados para o formato de codificação atual, se o nome contiver caracteres especiais que precisam de codificação.

- A declaração é usada pelo **mysqlcheck** (como invocado pelo **mysql\_upgrade**).

Por exemplo, se um banco de dados no MySQL 5.0 tiver o nome `a-b-c`, o nome contém instâncias do caractere `-` (barra). No MySQL 5.0, o diretório do banco de dados também é chamado `a-b-c`, o que não é necessariamente seguro para todos os sistemas de arquivos. No MySQL 5.1 e versões posteriores, o mesmo nome do banco de dados é codificado como `a@002db@002dc` para produzir um nome de diretório neutro em relação ao sistema de arquivos.

Quando uma instalação do MySQL é atualizada para o MySQL 5.1 ou posterior a partir de uma versão mais antiga, o servidor exibe um nome como `a-b-c` (que está no formato antigo) como `#mysql50#a-b-c`, e você deve referenciar o nome usando o prefixo `#mysql50#`. Use `UPGRADE DATA DIRECTORY NAME` neste caso para informar explicitamente ao servidor para re-codificar o nome do diretório do banco de dados para o formato de codificação atual:

```sql
ALTER DATABASE `#mysql50#a-b-c` UPGRADE DATA DIRECTORY NAME;
```

Após executar essa declaração, você pode se referir ao banco de dados como `a-b-c` sem o prefixo especial `#mysql50#`.

Nota

A cláusula `UPGRADE DATA DIRECTORY NAME` é desaconselhada no MySQL 5.7 e removida no MySQL 8.0. Se for necessário converter nomes de bancos de dados ou tabelas do MySQL 5.0, uma solução alternativa é atualizar uma instalação do MySQL 5.0 para o MySQL 5.1 antes de fazer a atualização para o MySQL 8.0.
