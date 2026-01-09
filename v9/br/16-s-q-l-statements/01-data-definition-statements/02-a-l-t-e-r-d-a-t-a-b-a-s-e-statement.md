### 15.1.2 Declaração `ALTER DATABASE`

```
ALTER {DATABASE | SCHEMA} [db_name]
    alter_option ...

alter_option: {
    [DEFAULT] CHARACTER SET [=] charset_name
  | [DEFAULT] COLLATE [=] collation_name
  | [DEFAULT] ENCRYPTION [=] {'Y' | 'N'}
  | READ ONLY [=] {DEFAULT | 0 | 1}
}
```

A declaração `ALTER DATABASE` permite que você altere as características gerais de um banco de dados. Essas características são armazenadas no dicionário de dados. Essa declaração requer o privilégio `ALTER` no banco de dados. `ALTER SCHEMA` é um sinônimo de `ALTER DATABASE`.

Se o nome do banco de dados for omitido, a declaração se aplica ao banco de dados padrão. Nesse caso, ocorrerá um erro se não houver um banco de dados padrão.

Para qualquer *`alter_option`* omitido da declaração, o banco de dados mantém seu valor de opção atual, com a exceção de que alterar o conjunto de caracteres pode alterar a concordância e vice-versa.

* Opções de Conjunto de Caracteres e Concordância
* Opção de Criptografia
* Opção de Apenas Leitura

#### Opções de Conjunto de Caracteres e Concordância

A opção `CHARACTER SET` altera o conjunto de caracteres padrão do banco de dados. A opção `COLLATE` altera a concordância padrão do banco de dados. Para informações sobre os nomes de conjuntos de caracteres e concordâncias, consulte o Capítulo 12, *Conjunto de Caracteres, Concordâncias, Unicode*.

Para ver os conjuntos de caracteres e concordâncias disponíveis, use as declarações `SHOW CHARACTER SET` e `SHOW COLLATION`, respectivamente. Veja a Seção 15.7.7.4, “Declaração SHOW CHARACTER SET”, e a Seção 15.7.7.5, “Declaração SHOW COLLATION”.

Uma rotina armazenada que usa os padrões do banco de dados quando a rotina é criada inclui esses padrões como parte de sua definição. (Em uma rotina armazenada, variáveis com tipos de dados de caracteres usam os padrões do banco de dados se o conjunto de caracteres ou a concordância não forem especificados explicitamente. Veja a Seção 15.1.21, “Declarações CREATE PROCEDURE e CREATE FUNCTION”.) Se você alterar o conjunto de caracteres padrão ou a concordância para um banco de dados, quaisquer rotinas armazenadas que devam usar os novos padrões devem ser excluídas e recriadas.

#### Opção de Criptografia

A opção `ENCRYPTION` define a criptografia padrão do banco de dados, que é herdada pelas tabelas criadas no banco de dados. Os valores permitidos são `'Y'` (criptografia habilitada) e `'N'` (criptografia desabilitada).

O esquema do sistema `mysql` não pode ser configurado para criptografia padrão. As tabelas existentes nele fazem parte do espaço de tabelas geral `mysql`, que pode ser criptografado. O `information_schema` contém apenas visualizações. Não é possível criar nenhuma tabela nele. Não há nada no disco para criptografar. Todas as tabelas no `performance_schema` usam o motor `PERFORMANCE_SCHEMA`, que é puramente de memória. Não é possível criar nenhuma outra tabela nele. Não há nada no disco para criptografar.

Apenas as tabelas recém-criadas herdam a criptografia padrão do banco de dados. Para as tabelas existentes associadas ao banco de dados, sua criptografia permanece inalterada. Se a variável de sistema `table_encryption_privilege_check` estiver habilitada, o privilégio `TABLE_ENCRYPTION_ADMIN` é necessário para especificar uma configuração de criptografia padrão que difira do valor da variável de sistema `default_table_encryption`. Para mais informações, consulte Definindo um Padrão de Criptografia para Esquemas e Espaços de Tabelas Gerais.

#### Opção de Apenas Leitura

A opção `READ ONLY` controla se é permitido modificar o banco de dados e os objetos dentro dele. Os valores permitidos são `DEFAULT` ou `0` (não apenas de leitura) e `1` (somente de leitura). Esta opção é útil para migração de bancos de dados, pois um banco de dados para o qual `READ ONLY` está habilitado pode ser migrado para outra instância do MySQL sem preocupação de que o banco de dados possa ser alterado durante a operação.

Com o NDB Cluster, tornar um banco de dados apenas de leitura em um servidor **mysqld** é sincronizado com outros servidores **mysqld** no mesmo cluster, de modo que o banco de dados se torne apenas de leitura em todos os servidores **mysqld**.

A opção `READ ONLY` (Apenas de Leitura), se habilitada, é exibida na tabela `INFORMATION_SCHEMA` `SCHEMATA_EXTENSIONS`. Veja a Seção 28.3.38, “A Tabela INFORMATION_SCHEMA SCHEMATA_EXTENSIONS”.

A opção `READ ONLY` (Apenas de Leitura) não pode ser habilitada para esses esquemas do sistema: `mysql`, `information_schema`, `performance_schema`.

Nas instruções `ALTER DATABASE`, a opção `READ ONLY` (Apenas de Leitura) interage com outras instâncias dela mesma e com outras opções da seguinte forma:

* Um erro ocorre se múltiplas instâncias de `READ ONLY` (Apenas de Leitura) entrarem em conflito (por exemplo, `READ ONLY = 1 READ ONLY = 0`).

* Uma instrução `ALTER DATABASE` que contém apenas (sem conflitos) opções `READ ONLY` (Apenas de Leitura) é permitida mesmo para um banco de dados apenas de leitura.

* Uma mistura de (sem conflitos) opções `READ ONLY` (Apenas de Leitura) com outras opções é permitida se o estado apenas de leitura do banco de dados, antes ou depois da instrução, permitir modificações. Se o estado apenas de leitura antes e depois proibir mudanças, um erro ocorre.

Esta instrução é bem-sucedida, independentemente de o banco de dados ser apenas de leitura ou não:

```
  ALTER DATABASE mydb READ ONLY = 0 DEFAULT COLLATE utf8mb4_bin;
  ```

Esta instrução é bem-sucedida se o banco de dados não for apenas de leitura, mas falha se já estiver apenas de leitura:

```
  ALTER DATABASE mydb READ ONLY = 1 DEFAULT COLLATE utf8mb4_bin;
  ```

Habilitar `READ ONLY` (Apenas de Leitura) afeta todos os usuários do banco de dados, com essas exceções que não estão sujeitas a verificações de apenas de leitura:

* Instruções executadas pelo servidor como parte da inicialização do servidor, reinício, atualização ou replicação.

* Instruções em um arquivo nomeado na inicialização do servidor pela variável de sistema `init_file`.

* Tabelas `TEMPORARY` (Temporárias); é possível criar, alterar, excluir e escrever em tabelas `TEMPORARY` (Temporárias) em um banco de dados apenas de leitura.

* Inserções e atualizações não SQL no NDB Cluster.

Além das operações excecionais listadas acima, a ativação de `LEITURA-SELETA` proíbe operações de escrita no banco de dados e seus objetos, incluindo suas definições, dados e metadados. A lista a seguir detalha as declarações e operações SQL afetadas:

* O próprio banco de dados:

  + `CREATE DATABASE`
  + `ALTER DATABASE` (exceto para alterar a opção `LEITURA-SELETA`)

  + `DROP DATABASE`
* Visualizações:

  + `CREATE VIEW`
  + `ALTER VIEW`
  + `DROP VIEW`
  + Selecionar de visualizações que invocam funções com efeitos colaterais.

  + Atualizar visualizações atualizáveis.
  + Declarações que criam ou excluem objetos em um banco de dados gravável são rejeitadas se afetarem os metadados de uma visualização em um banco de dados de leitura-seleta (por exemplo, tornando a visualização válida ou inválida).

* Rotinas armazenadas:

  + `CREATE PROCEDURE`
  + `DROP PROCEDURE`
  + `CALL` (de procedimentos com efeitos colaterais)

  + `CREATE FUNCTION`
  + `DROP FUNCTION`
  + `SELECT` (de funções com efeitos colaterais)

  + Para procedimentos e funções, as verificações de leitura-seleta seguem o comportamento de pré-bloqueio. Para as declarações `CALL`, as verificações de leitura-seleta são feitas por declaração, então, se alguma declaração condicionalmente executada escrever para um banco de dados de leitura-seleta não for executada, a chamada ainda terá sucesso. Por outro lado, para uma função chamada dentro de uma `SELECT`, a execução do corpo da função acontece em modo pré-bloqueado. Enquanto alguma declaração dentro da função escrever para um banco de dados de leitura-seleta, a execução da função falhará com um erro, independentemente de a declaração realmente ser executada.

* Gatilhos:

  + `CREATE TRIGGER`
  + `DROP TRIGGER`
  + Invocação do gatilho.
* Eventos:

  + `CREATE EVENT`
  + `ALTER EVENT`
  + `DROP EVENT`
  + Execução do evento:

- A execução de um evento na base de dados falha porque isso mudaria o timestamp da última execução, que é o metadados do evento armazenado no dicionário de dados. A falha na execução do evento também tem o efeito de fazer com que o agendamento de eventos seja interrompido.

- Se um evento escreve em um objeto em uma base de dados somente leitura, a execução do evento falha com um erro, mas o agendamento de eventos não é interrompido.

* Tabelas:

  + `CREATE TABLE`
  + `ALTER TABLE`
  + `CREATE INDEX`
  + `DROP INDEX`
  + `RENAME TABLE`
  + `TRUNCATE TABLE`
  + `DROP TABLE`
  + `DELETE`
  + `INSERT`
  + `IMPORT TABLE`
  + `LOAD DATA`
  + `LOAD XML`
  + `REPLACE`
  + `UPDATE`
  + Para chaves estrangeiras em cascata, onde a tabela filha está em uma base de dados somente leitura, as atualizações e exclusões na tabela pai são rejeitadas, mesmo que a tabela filha não seja diretamente afetada.

  + Para uma tabela `MERGE`, como `CREATE TABLE s1.t(i int) ENGINE MERGE UNION (s2.t, s3.t), INSERT_METHOD=...`, o seguinte comportamento se aplica:

    - A inserção na tabela `MERGE` (`INSERT into s1.t`) falha se pelo menos uma das tabelas `s1`, `s2`, `s3` for somente leitura, independentemente do método de inserção. A inserção é recusada mesmo que ela realmente acabe em uma tabela gravável.

    - A exclusão da tabela `MERGE` (`DROP TABLE s1.t`) é bem-sucedida desde que `s1` não seja somente leitura. É permitido excluir uma tabela `MERGE` que se refere a uma base de dados somente leitura.

Uma declaração `ALTER DATABASE` bloqueia até que todas as transações concorrentes que já acessaram um objeto na base de dados que está sendo alterada tenham sido concluídas. Por outro lado, uma transação de escrita acessando um objeto em uma base de dados que está sendo alterada em uma `ALTER DATABASE` concorrente bloqueia até que a `ALTER DATABASE` tenha sido concluída.

Se o plugin Clone for usado para clonar um diretório de dados local ou remoto, os bancos de dados no clone manterão o estado de leitura somente que tinham no diretório de dados de origem. O estado de leitura somente não afeta o próprio processo de clonagem. Se não for desejável ter o mesmo estado de leitura somente no banco de dados do clone, a opção deve ser alterada explicitamente para o clone após o término do processo de clonagem, usando operações `ALTER DATABASE` no clone.

Ao clonar de um doador para um receptor, se o receptor tiver um banco de dados de usuário que é de leitura somente, a clonagem falha com uma mensagem de erro. A clonagem pode ser repetida após tornar o banco de dados legível.

`LEITURA SOMENTE` é permitido para `ALTER DATABASE`, mas não para `CREATE DATABASE`. No entanto, para um banco de dados de leitura somente, a declaração produzida por `SHOW CREATE DATABASE` inclui `LEITURA SOMENTE=1` dentro de um comentário para indicar seu status de leitura somente:

```
mysql> ALTER DATABASE mydb READ ONLY = 1;
mysql> SHOW CREATE DATABASE mydb\G
*************************** 1. row ***************************
       Database: mydb
Create Database: CREATE DATABASE `mydb`
                 /*!40100 DEFAULT CHARACTER SET utf8mb4
                          COLLATE utf8mb4_0900_ai_ci */
                 /*!80016 DEFAULT ENCRYPTION='N' */
                 /* READ ONLY = 1 */
```

Se o servidor executar uma declaração `CREATE DATABASE` contendo tal comentário, o servidor ignora o comentário e a opção `LEITURA SOMENTE` não é processada. Isso tem implicações para o **mysqldump**, que usa `SHOW CREATE DATABASE` para produzir declarações `CREATE DATABASE` na saída do dump:

* Em um arquivo de dump, a declaração `CREATE DATABASE` para um banco de dados de leitura somente contém a opção `LEITURA SOMENTE` com comentário.
* O arquivo de dump pode ser restaurado normalmente, mas, como o servidor ignora a opção `LEITURA SOMENTE` com comentário, o banco de dados restaurado *não* é de leitura somente. Se o banco de dados deve ser de leitura somente após ser restaurado, você deve executar `ALTER DATABASE` manualmente para torná-lo assim.

Suponha que `mydb` seja de leitura somente e você o faça o dump da seguinte forma:

```
$> mysqldump --databases mydb > mydb.sql
```

Uma operação de restauração mais tarde deve ser seguida por `ALTER DATABASE` se `mydb` ainda deve ser de leitura somente:

```
$> mysql
mysql> SOURCE mydb.sql;
mysql> ALTER DATABASE mydb READ ONLY = 1;
```

O MySQL Enterprise Backup não está sujeito a esse problema. Ele faz backup e restaura um banco de dados somente de leitura como qualquer outro, mas habilita a opção `LEIA-SE` no momento da restauração, se ela estiver habilitada no momento do backup.

O `ALTER DATABASE` é escrito no log binário, então uma alteração na opção `LEIA-SE` em um servidor de origem de replicação também afeta as réplicas. Para evitar que isso aconteça, o registro binário deve ser desativado antes da execução da instrução `ALTER DATABASE`. Por exemplo, para se preparar para migrar um banco de dados sem afetar as réplicas, realize essas operações:

1. Dentro de uma única sessão, desabilite o registro binário e habilite `LEIA-SE` para o banco de dados:

   ```
   mysql> SET sql_log_bin = OFF;
   mysql> ALTER DATABASE mydb READ ONLY = 1;
   ```

2. Faça o dump do banco de dados, por exemplo, com **mysqldump**:

   ```
   $> mysqldump --databases mydb > mydb.sql
   ```

3. Dentro de uma única sessão, desabilite o registro binário e desabilite `LEIA-SE` para o banco de dados:

   ```
   mysql> SET sql_log_bin = OFF;
   mysql> ALTER DATABASE mydb READ ONLY = 0;
   ```