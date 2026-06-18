### 15.1.2 Declaração ALTER DATABASE

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

`ALTER DATABASE` permite que você mude as características gerais de um banco de dados. Essas características são armazenadas no dicionário de dados. Essa declaração requer o privilégio `ALTER` no banco de dados. `ALTER SCHEMA` é sinônimo de `ALTER DATABASE`.

Se o nome do banco de dados for omitido, a instrução se aplica ao banco de dados padrão. Nesse caso, ocorrerá um erro se não houver um banco de dados padrão.

Para qualquer `alter_option` omitido na declaração, o banco de dados mantém seu valor de opção atual, com a exceção de que a alteração do conjunto de caracteres pode alterar a collation e vice-versa.

- Conjunto de caracteres e opções de cotação
- Opção de criptografia
- Opção de leitura apenas

#### Conjunto de caracteres e opções de cotação

A opção `CHARACTER SET` altera o conjunto de caracteres padrão do banco de dados. A opção `COLLATE` altera a concordância padrão do banco de dados. Para obter informações sobre os nomes dos conjuntos de caracteres e concordâncias, consulte o Capítulo 12, \* Conjuntos de caracteres, concordâncias, Unicode \*.

Para ver os conjuntos de caracteres e as codificações disponíveis, use as instruções `SHOW CHARACTER SET` e `SHOW COLLATION`, respectivamente. Veja a Seção 15.7.7.3, “Instrução SHOW CHARACTER SET”, e a Seção 15.7.7.4, “Instrução SHOW COLLATION”.

Uma rotina armazenada que usa os padrões do banco de dados quando a rotina é criada inclui esses padrões como parte de sua definição. (Em uma rotina armazenada, variáveis com tipos de dados de caracteres usam os padrões do banco de dados se o conjunto de caracteres ou a ordenação não forem especificados explicitamente. Veja a Seção 15.1.17, “Instruções CREATE PROCEDURE e CREATE FUNCTION”.) Se você alterar o conjunto de caracteres padrão ou a ordenação de um banco de dados, todas as rotinas armazenadas que devem usar os novos padrões devem ser excluídas e recriadas.

#### Opção de criptografia

A opção `ENCRYPTION`, introduzida no MySQL 8.0.16, define a criptografia padrão do banco de dados, que é herdada pelas tabelas criadas no banco de dados. Os valores permitidos são `'Y'` (criptografia habilitada) e `'N'` (criptografia desativada).

O esquema do sistema `mysql` não pode ser configurado para criptografia padrão. As tabelas existentes nele fazem parte do espaço de tabelas geral `mysql`, que pode ser criptografado. O `information_schema` contém apenas visualizações. Não é possível criar quaisquer tabelas nele. Não há nada no disco para criptografar. Todas as tabelas no `performance_schema` usam o motor `PERFORMANCE_SCHEMA`, que é puramente de memória. Não é possível criar outras tabelas nele. Não há nada no disco para criptografar.

Apenas as tabelas recém-criadas herdam a criptografia padrão do banco de dados. Para as tabelas existentes associadas ao banco de dados, sua criptografia permanece inalterada. Se a variável de sistema `table_encryption_privilege_check` estiver habilitada, o privilégio `TABLE_ENCRYPTION_ADMIN` é necessário para especificar um ajuste de criptografia padrão que difira do valor da variável de sistema `default_table_encryption`. Para obter mais informações, consulte Definindo um padrão de criptografia para esquemas e general\_tablespaces.

#### Opção de leitura apenas

A opção `READ ONLY`, introduzida no MySQL 8.0.22, controla se é permitido modificar o banco de dados e os objetos dentro dele. Os valores permitidos são `DEFAULT` ou `0` (não apenas de leitura) e `1` (somente de leitura). Esta opção é útil para a migração de bancos de dados, pois um banco de dados para o qual o `READ ONLY` está habilitado pode ser migrado para outra instância do MySQL sem preocupação de que o banco de dados possa ser alterado durante a operação.

Com o NDB Cluster, tornar um banco de dados somente leitura em um servidor **mysqld** é sincronizado com outros servidores **mysqld** no mesmo cluster, de modo que o banco de dados se torne somente leitura em todos os servidores **mysqld**.

A opção `READ ONLY`, se habilitada, é exibida na tabela `INFORMATION_SCHEMA` `SCHEMATA_EXTENSIONS`. Veja a Seção 28.3.32, “A Tabela INFORMATION\_SCHEMA SCHEMATA\_EXTENSIONS”.

A opção `READ ONLY` não pode ser habilitada para esses esquemas do sistema: `mysql`, `information_schema`, `performance_schema`.

Nas declarações `ALTER DATABASE`, a opção `READ ONLY` interage com outras instâncias da mesma e com outras opções da seguinte forma:

- Um erro ocorre se múltiplas instâncias de `READ ONLY` entrarem em conflito (por exemplo, `READ ONLY = 1 READ ONLY = 0`).

- Uma declaração `ALTER DATABASE` que contenha apenas opções `READ ONLY` (não conflitantes) é permitida, mesmo para um banco de dados somente de leitura.

- Uma combinação de opções `READ ONLY` (não conflitantes) com outras opções é permitida se o estado de leitura somente do banco de dados, antes ou depois da declaração, permitir modificações. Se o estado de leitura somente antes e depois proibir alterações, ocorrerá um erro.

  Esta declaração funciona independentemente de o banco de dados ser somente de leitura ou não:

  ```
  ALTER DATABASE mydb READ ONLY = 0 DEFAULT COLLATE utf8mb4_bin;
  ```

  Essa afirmação é válida se o banco de dados não for somente de leitura, mas inválida se ele já estiver somente de leitura:

  ```
  ALTER DATABASE mydb READ ONLY = 1 DEFAULT COLLATE utf8mb4_bin;
  ```

Ativação de `READ ONLY` afeta todos os usuários do banco de dados, com essas exceções que não estão sujeitas a verificações de leitura somente:

- Declarações executadas pelo servidor como parte da inicialização, reinício, atualização ou replicação do servidor.

- Declarações em um arquivo nomeado na inicialização do servidor pela variável de sistema `init_file`.

- Tabelas `TEMPORARY`; é possível criar, alterar, excluir e escrever em tabelas `TEMPORARY` em um banco de dados somente leitura.

- Inserções e atualizações não-SQL no NDB Cluster.

Além das operações excecionais listadas acima, a ativação de `READ ONLY` proíbe operações de escrita no banco de dados e seus objetos, incluindo suas definições, dados e metadados. A lista a seguir detalha as declarações e operações SQL afetadas:

- O banco de dados em si:

  - `CREATE DATABASE`

  - `ALTER DATABASE` (exceto para alterar a opção `READ ONLY`)

  - `DROP DATABASE`

- Visões:

  - `CREATE VIEW`

  - `ALTER VIEW`

  - `DROP VIEW`

  - Selecionando vistas que invocam funções com efeitos colaterais.

  - Atualizando visualizações atualizáveis.

  - As declarações que criam ou excluem objetos em um banco de dados gravável são rejeitadas se elas afetarem os metadados de uma visualização em um banco de dados somente de leitura (por exemplo, tornando a visualização válida ou inválida).

- Rotinas armazenadas:

  - `CREATE PROCEDURE`

  - `DROP PROCEDURE`

  - `CALL` (de procedimentos com efeitos colaterais)

  - `CREATE FUNCTION`

  - `DROP FUNCTION`

  - `SELECT` (de funções com efeitos colaterais)

  - Para procedimentos e funções, as verificações de leitura seguem o comportamento de pré-bloqueio. Para as instruções `CALL`, as verificações de leitura são feitas por instrução, portanto, se uma instrução executada condicionalmente que escreve em um banco de dados de leitura não for executada, a chamada ainda terá sucesso. Por outro lado, para uma função chamada dentro de um `SELECT`, a execução do corpo da função ocorre no modo pré-bloqueado. Enquanto uma alguma instrução dentro da função escrever em um banco de dados de leitura, a execução da função falhará com um erro, independentemente de a instrução ser realmente executada ou

- Descobrir os gatilhos:

  - `CREATE TRIGGER`
  - `DROP TRIGGER`
  - Inicie a invocação.

- Eventos:

  - `CREATE EVENT`
  - `ALTER EVENT`
  - `DROP EVENT`
  - Execução do evento:

    - A execução de um evento no banco de dados falha porque isso mudaria o timestamp da última execução, que é o metadado do evento armazenado no dicionário de dados. O erro na execução do evento também faz com que o agendamento de eventos pare.

    - Se um evento escrever em um banco de dados somente leitura, a execução do evento falha com um erro, mas o agendamento do evento não é interrompido.

- Tabelas:

  - `CREATE TABLE`

  - `ALTER TABLE`

  - `CREATE INDEX`

  - `DROP INDEX`

  - `RENAME TABLE`

  - `TRUNCATE TABLE`

  - `DROP TABLE`

  - `DELETE`

  - `INSERT`

  - `IMPORT TABLE`

  - `LOAD DATA`

  - `LOAD XML`

  - `REPLACE`

  - `UPDATE`

  - Para chaves estrangeiras em cascata onde a tabela filha está em um banco de dados de leitura somente, as atualizações e exclusões na tabela pai são rejeitadas, mesmo que a tabela filha não seja diretamente afetada.

  - Para uma tabela `MERGE` como `CREATE TABLE s1.t(i int) ENGINE MERGE UNION (s2.t, s3.t), INSERT_METHOD=...`, o seguinte comportamento se aplica:

    - A inserção na tabela `MERGE` (`INSERT into s1.t`) falha se pelo menos um dos `s1`, `s2`, `s3` for de leitura somente, independentemente do método de inserção. A inserção é recusada mesmo que ela realmente termine em uma tabela gravável.

    - A remoção da tabela `MERGE` (`DROP TABLE s1.t`) é permitida desde que `s1` não seja de leitura somente. É permitido excluir uma tabela `MERGE` que faça referência a um banco de dados de leitura somente.

Uma declaração `ALTER DATABASE` é bloqueada até que todas as transações concorrentes que já acessaram um objeto no banco de dados que está sendo alterado tenham sido confirmadas. Por outro lado, uma transação de escrita que acessa um objeto em um banco de dados que está sendo alterado em uma transação concorrente `ALTER DATABASE` é bloqueada até que a `ALTER DATABASE` seja confirmada.

Se o plugin Clone for usado para clonar um diretório de dados local ou remoto, os bancos de dados no clone manterão o estado de leitura somente que tinham no diretório de dados de origem. O estado de leitura somente não afeta o próprio processo de clonagem. Se não for desejável ter o mesmo estado de leitura somente do banco de dados no clone, a opção deve ser alterada explicitamente para o clone após o processo de clonagem ter sido concluído, usando operações `ALTER DATABASE` no clone.

Quando se clona de um dador para um receptor, se o receptor tiver um banco de dados de usuários que é apenas de leitura, a clonagem falha com uma mensagem de erro. A clonagem pode ser repetida após tornar o banco de dados legível.

`READ ONLY` é permitido para `ALTER DATABASE`, mas não para `CREATE DATABASE`. No entanto, para um banco de dados de leitura somente, a declaração produzida por `SHOW CREATE DATABASE` inclui `READ ONLY=1` dentro de um comentário para indicar seu status de leitura somente:

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

Se o servidor executar uma instrução `CREATE DATABASE` que contenha esse comentário, o servidor ignora o comentário e a opção `READ ONLY` não é processada. Isso tem implicações para **mysqldump** e **mysqlpump**, que usam `SHOW CREATE DATABASE` para gerar instruções `CREATE DATABASE` na saída do dump:

- Em um arquivo de lixo, a declaração `CREATE DATABASE` para um banco de dados somente leitura contém a opção `READ ONLY` com comentários.

- O arquivo de implantação pode ser restaurado normalmente, mas, como o servidor ignora a opção `READ ONLY` comentada, o banco de dados restaurado *não* é somente de leitura. Se o banco de dados for tornar-se somente de leitura após a restauração, você deve executar `ALTER DATABASE` manualmente para torná-lo assim.

Suponha que `mydb` seja apenas de leitura e você o faça o dump da seguinte forma:

```
$> mysqldump --databases mydb > mydb.sql
```

Uma operação de restauração posterior deve ser seguida por `ALTER DATABASE` se `mydb` ainda deve ser lido apenas:

```
$> mysql
mysql> SOURCE mydb.sql;
mysql> ALTER DATABASE mydb READ ONLY = 1;
```

O MySQL Enterprise Backup não está sujeito a esse problema. Ele faz backup e restaura um banco de dados somente de leitura como qualquer outro, mas habilita a opção `READ ONLY` no momento da restauração, se ela estiver habilitada no momento do backup.

`ALTER DATABASE` é escrito no log binário, portanto, uma alteração na opção `READ ONLY` em um servidor de origem de replicação também afeta as réplicas. Para evitar que isso aconteça, o registro binário deve ser desativado antes da execução da instrução `ALTER DATABASE`. Por exemplo, para se preparar para migrar um banco de dados sem afetar as réplicas, realize as seguintes operações:

1. Em uma única sessão, desative o registro binário e habilite `READ ONLY` para o banco de dados:

   ```
   mysql> SET sql_log_bin = OFF;
   mysql> ALTER DATABASE mydb READ ONLY = 1;
   ```

2. Descarte o banco de dados, por exemplo, com **mysqldump** ou **mysqlpump**:

   ```
   $> mysqldump --databases mydb > mydb.sql
   ```

3. Em uma única sessão, desative o registro binário e desative `READ ONLY` para o banco de dados:

   ```
   mysql> SET sql_log_bin = OFF;
   mysql> ALTER DATABASE mydb READ ONLY = 0;
   ```
