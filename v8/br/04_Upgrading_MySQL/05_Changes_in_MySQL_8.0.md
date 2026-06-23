## 3.5 Alterações no MySQL 8.0

Antes de fazer a atualização para o MySQL 8.0, revise as alterações descritas nesta seção para identificar aquelas que se aplicam à sua instalação e aplicações atuais do MySQL. Realize as ações recomendadas.

As alterações marcadas como **Alterações Incompatíveis** são incompatibilidades com versões anteriores do MySQL e podem exigir sua atenção *antes da atualização*. Nosso objetivo é evitar essas alterações, mas, ocasionalmente, elas são necessárias para corrigir problemas que seriam piores do que uma incompatibilidade entre as versões. Se um problema de atualização aplicável à sua instalação envolver uma incompatibilidade, siga as instruções fornecidas na descrição.

* Alterações no Dicionário de Dados
* `caching_sha2_password` como o Plugin de Autenticação Preferencial
* Alterações na Configuração
* Alterações no Servidor
* Alterações no InnoDB
* Alterações no SQL
* Definições Padrão Alteradas
* Regressões de Desempenho Válidas

### Alterações no Dicionário de Dados

O MySQL Server 8.0 incorpora um dicionário de dados global que contém informações sobre os objetos do banco de dados em tabelas transacionais. Nas versões anteriores do MySQL, os dados do dicionário eram armazenados em arquivos de metadados e em tabelas de sistema não transacionais. Como resultado, o procedimento de atualização exige que você verifique a prontidão da atualização da sua instalação, verificando os pré-requisitos específicos. Para mais informações, consulte a Seção 3.6, “Preparando sua instalação para atualização”. Um servidor habilitado para dicionário de dados implica algumas diferenças operacionais gerais; consulte a Seção 16.7, “Diferenças de uso do dicionário de dados”.

### `caching_sha2_password` como o Plugin de Autenticação Preferido

Os plugins de autenticação `caching_sha2_password` e `sha256_password` oferecem criptografia de senha mais segura do que o plugin `mysql_native_password`, e o `caching_sha2_password` oferece melhor desempenho do que o `sha256_password`. Devido a essas características de segurança e desempenho superiores do `caching_sha2_password`, ele é, a partir do MySQL 8.0, o plugin de autenticação preferido, e também é o plugin de autenticação padrão em vez do `mysql_native_password`. Essa mudança afeta tanto o servidor quanto a biblioteca de cliente `libmysqlclient`:

* Para o servidor, o valor padrão da variável de sistema `default_authentication_plugin` muda de `mysql_native_password` para `caching_sha2_password`.

Essa alteração se aplica apenas a novas contas criadas após a instalação ou atualização para o MySQL 8.0 ou superior. Para contas já existentes em uma instalação atualizada, seu plugin de autenticação permanece inalterado. Os usuários existentes que desejam mudar para `caching_sha2_password` podem fazer isso usando a declaração `ALTER USER`(alter-user.html "15.7.1.1 ALTER USER Statement"):

  ```
  ALTER USER user
    IDENTIFIED WITH caching_sha2_password
    BY 'password';
  ```

* A biblioteca `libmysqlclient` trata o `caching_sha2_password` como o plugin de autenticação padrão, em vez do `mysql_native_password`.

As seções a seguir discutem as implicações do papel mais proeminente do `caching_sha2_password`:

* `caching_sha2_password` Problemas e Soluções de Compatibilidade
* Clientes e Conectivos Compatíveis com o `caching_sha2_password`
* `caching_sha2_password` e a Conta Administrativa Principal
* `caching_sha2_password` e Replicação

#### `caching_sha2_password` Problemas e Soluções de Compatibilidade

Importante

Se a sua instalação do MySQL deve atender a clientes anteriores à versão 8.0 e você encontrar problemas de compatibilidade após a atualização para o MySQL 8.0 ou superior, a maneira mais simples de resolver esses problemas e restaurar a compatibilidade pré-8.0 é reconfigurar o servidor para retornar ao plugin de autenticação padrão anterior (`mysql_native_password`). Por exemplo, use essas linhas no arquivo de opção do servidor:

```
[mysqld]
default_authentication_plugin=mysql_native_password
```

Essa configuração permite que os clientes anteriores à versão 8.0 se conectem aos servidores 8.0 até que os clientes e conectores utilizados na sua instalação sejam atualizados para saber sobre `caching_sha2_password`. No entanto, a configuração deve ser vista como temporária, não como uma solução de longo prazo ou permanente, porque ela faz com que novas contas criadas com a configuração em vigor desconsidere a segurança de autenticação aprimorada fornecida por `caching_sha2_password`.

O uso de `caching_sha2_password` oferece uma criptografia de senha mais segura do que `mysql_native_password` (e, consequentemente, uma autenticação de conexão do cliente melhorada). No entanto, ele também tem implicações de compatibilidade que podem afetar as instalações existentes do MySQL:

* Clientes e conectores que não foram atualizados para saber sobre `caching_sha2_password` podem ter problemas para se conectar a um servidor MySQL 8.0 configurado com `caching_sha2_password` como o plugin de autenticação padrão, mesmo para usar contas que não se autenticam com `caching_sha2_password`. Esse problema ocorre porque o servidor especifica o nome do seu plugin de autenticação padrão para os clientes. Se um cliente ou conector é baseado em uma implementação de protocolo cliente/servidor que não lida adequadamente com um plugin de autenticação padrão não reconhecido, ele pode falhar com um erro como um desses:

  ```
  Authentication plugin 'caching_sha2_password' is not supported
  ```

  ```
  Authentication plugin 'caching_sha2_password' cannot be loaded:
  dlopen(/usr/local/mysql/lib/plugin/caching_sha2_password.so, 2):
  image not found
  ```

  ```
  Warning: mysqli_connect(): The server requested authentication
  method unknown to the client [caching_sha2_password]
  ```

Para obter informações sobre como escrever conectores para lidar graciosamente com solicitações do servidor para plugins de autenticação padrão desconhecidos, consulte Considerações sobre Conexão de Conectivos de Plugin de Autenticação.

* Os clientes que utilizam uma conta que se autentica com `caching_sha2_password` devem usar uma conexão segura (feita usando TCP com credenciais TLS/SSL, um arquivo de soquete Unix ou memória compartilhada) ou uma conexão não criptografada que suporte a troca de senha usando um par de chaves RSA. Este requisito de segurança não se aplica a `mysql_native_passsword`, portanto, a transição para `caching_sha2_password` pode exigir configuração adicional (consulte Seção 8.4.1.2, “Cacheamento de Autenticação Plugável SHA-2”). No entanto, as conexões dos clientes no MySQL 8.0 preferem o uso de TLS/SSL por padrão, portanto, os clientes que já se conformam a essa preferência podem não precisar de configuração adicional.

* Clientes e conectores que não foram atualizados para saber sobre `caching_sha2_password` *não podem* se conectar a contas que se autenticam com `caching_sha2_password`, porque eles não reconhecem este plugin como válido. (Esta é uma instância particular de como os requisitos de compatibilidade de plugins de autenticação cliente/servidor se aplicam, conforme discutido em Compatibilidade de Plugins de Autenticação Cliente/Servidor). Para contornar esse problema, faça um novo link dos clientes contra `libmysqlclient` a partir do MySQL 8.0 ou superior, ou obtenha um conector atualizado que reconheça `caching_sha2_password`.

* Como o `caching_sha2_password` também é agora o plugin de autenticação padrão na biblioteca de clientes `libmysqlclient`, a autenticação requer um percurso adicional no protocolo cliente/servidor para conexões de clientes MySQL 8.0 para contas que utilizam `mysql_native_password` (o plugin de autenticação padrão anterior), a menos que o programa cliente seja invocado com uma opção `--default-auth=mysql_native_password`.

A biblioteca de clientes `libmysqlclient` para versões pré-8.0 do MySQL é capaz de se conectar a servidores MySQL 8.0 (exceto para contas que se autenticam com `caching_sha2_password`). Isso significa que clientes pré-8.0 com base em `libmysqlclient` também devem ser capazes de se conectar. Exemplos:

* Os clientes padrão do MySQL, como **mysql** e **mysqladmin**, são baseados em `libmysqlclient`.

* O driver DBD::mysql para Perl DBI é baseado em `libmysqlclient`.

* O MySQL Connector/Python tem um módulo de extensão C que é baseado em `libmysqlclient`. Para usá-lo, inclua a opção `use_pure=False` no momento da conexão.

Quando uma instalação existente do MySQL 8.0 é atualizada para o MySQL 8.0.4 ou superior, alguns clientes `libmysqlclient` mais antigos podem ser atualizados “automaticamente” se estiverem vinculados dinamicamente, porque eles usam a nova biblioteca de clientes instalada pelo upgrade. Por exemplo, se o driver DBD::mysql para Perl DBI usa vinculação dinâmica, ele pode usar o `libmysqlclient` no lugar após uma atualização para o MySQL 8.0.4 ou superior, com este resultado:

* Antes da atualização, os scripts DBI que utilizam DBD::mysql podem se conectar a um servidor MySQL 8.0, exceto para contas que se autenticam com `caching_sha2_password`.

* Após a atualização, os mesmos scripts também poderão usar contas `caching_sha2_password`.

No entanto, os resultados anteriores ocorrem porque as instâncias de `libmysqlclient` de instalações do MySQL 8.0 anteriores a 8.0.4 são binariamente compatíveis: ambas utilizam um número de versão da biblioteca compartilhada de 21. Para clientes vinculados ao `libmysqlclient` do MySQL 5.7 ou versões anteriores, eles se conectam a uma biblioteca compartilhada com um número de versão diferente que não é binariamente compatível. Neste caso, o cliente deve ser recompilado contra `libmysqlclient` a partir de 8.0.4 ou superior para compatibilidade total com servidores MySQL 8.0 e contas `caching_sha2_password`.

O MySQL Connector/J 5.1 a 8.0.8 pode se conectar aos servidores MySQL 8.0, exceto para contas que se autenticam com `caching_sha2_password`. (É necessário o Connector/J 8.0.9 ou superior para se conectar às contas `caching_sha2_password`.

Os clientes que utilizam uma implementação do protocolo cliente/servidor que não é `libmysqlclient` podem precisar ser atualizados para uma versão mais recente que entenda o novo plugin de autenticação. Por exemplo, no PHP, a conectividade com o MySQL geralmente é baseada em `mysqlnd`, que atualmente não conhece `caching_sha2_password`. Até que uma versão atualizada do `mysqlnd` esteja disponível, a maneira de habilitar os clientes PHP para se conectarem ao MySQL 8.0 é reconfigurar o servidor para reverter para `mysql_native_password` como o plugin de autenticação padrão, conforme discutido anteriormente.

Se um cliente ou conector suportar uma opção para especificar explicitamente um plugin de autenticação padrão, use-a para nomear um plugin diferente de `caching_sha2_password`. Exemplos:

* Alguns clientes do MySQL suportam a opção `--default-auth`. (Clientes padrão do MySQL, como **mysql** e **mysqladmin**, suportam essa opção, mas podem se conectar com sucesso a servidores 8.0 sem ela. No entanto, outros clientes podem suportar uma opção semelhante. Se sim, vale a pena tentar.)

* Os programas que utilizam a API C `libmysqlclient` podem chamar a função `mysql_options()` com a opção `MYSQL_DEFAULT_AUTH`.

* Os scripts do MySQL Connector/Python que utilizam a implementação nativa do protocolo cliente/servidor do Python podem especificar a opção de conexão `auth_plugin`. (Alternativamente, use a Extensão C do Connector/Python, que é capaz de se conectar aos servidores MySQL 8.0 sem a necessidade de `auth_plugin`.).

#### Clientes e Conectores Compatíveis com o `caching_sha2_password`

Se houver um cliente ou conector disponível que tenha sido atualizado para saber sobre `caching_sha2_password`, usar é a melhor maneira de garantir a compatibilidade ao se conectar a um servidor MySQL 8.0 configurado com `caching_sha2_password` como o plugin de autenticação padrão.

Esses clientes e conectores foram atualizados para suportar `caching_sha2_password`:

* A biblioteca de clientes `libmysqlclient` no MySQL 8.0 (8.0.4 ou superior). Clientes padrão do MySQL, como **mysql** e **mysqladmin**, são baseados em `libmysqlclient`, portanto, também são compatíveis.

* A biblioteca de clientes `libmysqlclient` no MySQL 5.7 (5.7.23 ou superior). Clientes padrão do MySQL, como **mysql** e **mysqladmin**, são baseados em `libmysqlclient`, portanto, também são compatíveis.

* MySQL Connector/C++ 1.1.11 ou superior ou 8.0.7 ou superior. * MySQL Connector/J 8.0.9 ou superior. * MySQL Connector/NET 8.0.10 ou superior (através do protocolo MySQL clássico).

* MySQL Connector/Node.js 8.0.9 ou superior.
* PHP: a extensão X DevAPI PHP (mysql_xdevapi) suporta `caching_sha2_password`.

PHP: as extensões PDO_MySQL e ext/mysqli não suportam `caching_sha2_password`. Além disso, quando usadas com versões do PHP anteriores a 7.1.16 e PHP 7.2 antes de 7.2.4, elas não conseguem se conectar com `default_authentication_plugin=caching_sha2_password`, mesmo que `caching_sha2_password` não seja usada.

#### `caching_sha2_password` e a Conta Administrativa Principal

Para as atualizações do MySQL 8.0, o plugin de autenticação para contas existentes permanece inalterado, incluindo o plugin para a conta administrativa `'root'@'localhost'`.

Para novas instalações do MySQL 8.0, ao inicializar o diretório de dados (usando as instruções na Seção 2.9.1, “Inicializando o diretório de dados”), a conta `'root'@'localhost'` é criada, e essa conta usa `caching_sha2_password` por padrão. Para se conectar ao servidor após a inicialização do diretório de dados, você deve, portanto, usar um cliente ou conector que suporte `caching_sha2_password`. Se você puder fazer isso, mas prefere que a conta `root` use `mysql_native_password` após a instalação, instale o MySQL e inicialize o diretório de dados como você normalmente faria. Em seguida, conecte-se ao servidor como `root` e use `ALTER USER` da seguinte forma para alterar o plugin de autenticação da conta e a senha:

```
ALTER USER 'root'@'localhost'
  IDENTIFIED WITH mysql_native_password
  BY 'password';
```

Se o cliente ou o conector que você usa ainda não suporta `caching_sha2_password`, você pode usar um procedimento de inicialização de diretório de dados modificado que associa a conta `root` com `mysql_native_password` assim que a conta for criada. Para fazer isso, use uma dessas técnicas:

* Forneça uma opção `--default-authentication-plugin=mysql_native_password` juntamente com `--initialize` ou `--initialize-insecure`.

* Defina `default_authentication_plugin` como `mysql_native_password` em um arquivo de opções e nomeie esse arquivo de opções usando uma opção `--defaults-file` juntamente com `--initialize` ou `--initialize-insecure`. (Neste caso, se você continuar a usar esse arquivo de opções para futuras iniciações do servidor, novas contas serão criadas com `mysql_native_password` em vez de `caching_sha2_password`, a menos que você remova a configuração `default_authentication_plugin` do arquivo de opções.)

#### `caching_sha2_password` e Replicação

Em cenários de replicação para os quais todos os servidores foram atualizados para MySQL 8.0.4 ou superior, as conexões de replicação aos servidores de origem podem usar contas que se autenticam com `caching_sha2_password`. Para essas conexões, o mesmo requisito se aplica aos outros clientes que usam contas que se autenticam com `caching_sha2_password`: Use uma conexão segura ou troca de senha baseada em RSA.

Para se conectar a uma conta `caching_sha2_password` para replicação de fonte/replica:

* Use qualquer uma das seguintes opções `CHANGE MASTER TO`(change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement"):

  ```
  MASTER_SSL = 1
  GET_MASTER_PUBLIC_KEY = 1
  MASTER_PUBLIC_KEY_PATH='path to RSA public key file'
  ```

* Alternativamente, você pode usar as opções relacionadas à chave pública RSA se as chaves necessárias forem fornecidas na inicialização do servidor.

Para se conectar a uma conta `caching_sha2_password` para Replicação de Grupo:

* Para MySQL construído usando OpenSSL, defina qualquer uma das seguintes variáveis do sistema:

  ```
  SET GLOBAL group_replication_recovery_use_ssl = ON;
  SET GLOBAL group_replication_recovery_get_public_key = 1;
  SET GLOBAL group_replication_recovery_public_key_path = 'path to RSA public key file';
  ```

* Alternativamente, você pode usar as opções relacionadas à chave pública RSA se as chaves necessárias forem fornecidas na inicialização do servidor.

### Alterações de Configuração

* **Mudança incompatível**: Um mecanismo de armazenamento MySQL agora é responsável por fornecer seu próprio manipulador de particionamento, e o servidor MySQL não fornece mais suporte genérico para particionamento. `InnoDB` e `NDB` são os únicos mecanismos de armazenamento que fornecem um manipulador de particionamento nativo que é suportado no MySQL 8.0. Uma tabela particionada usando qualquer outro mecanismo de armazenamento deve ser alterada — ou para convertê-la para `InnoDB` ou `NDB`, ou para remover sua particionamento — *antes* de fazer a atualização do servidor, caso contrário, não pode ser usada posteriormente.

Para obter informações sobre a conversão das tabelas `MyISAM` para `InnoDB`, consulte a Seção 17.6.1.5, “Conversão de tabelas de MyISAM para InnoDB”.

Uma declaração de criação de tabela que resultaria em uma tabela particionada usando um mecanismo de armazenamento sem tal suporte falha com um erro (ER_CHECK_NOT_IMPLEMENTED) no MySQL 8.0. Se você importar bancos de dados de um arquivo de dump criado no MySQL 5.7 (ou anterior) usando **mysqldump** em um servidor MySQL 8.0, você deve garantir que quaisquer declarações que criem tabelas particionadas também não especifiquem um mecanismo de armazenamento não suportado, removendo quaisquer referências à partição ou especificando o mecanismo de armazenamento como `InnoDB` ou permitindo que ele seja definido como `InnoDB` por padrão.

Nota

O procedimento descrito na Seção 3.6, “Preparando sua instalação para atualização”, descreve como identificar as tabelas particionadas que devem ser alteradas antes da atualização para o MySQL 8.0.

Consulte a Seção 26.6.2, “Limitações de Partição Relacionadas a Motores de Armazenamento”, para obter mais informações.

* **Mudança incompatível**: Vários códigos de erro do servidor não são usados e foram removidos (para uma lista, consulte Recursos removidos no MySQL 8.0). As aplicações que testam especificamente para qualquer um deles devem ser atualizadas.

* **Altera��o importante**: O conjunto de caracteres predefinido mudou de `latin1` para `utf8mb4`. Essas variáveis do sistema são afetadas:

+ O valor padrão das variáveis de sistema `character_set_server` e `character_set_database` mudou de `latin1` para `utf8mb4`.

+ O valor padrão das variáveis de sistema `collation_server` e `collation_database` mudou de `latin1_swedish_ci` para `utf8mb4_0900_ai_ci`.

Como resultado, o conjunto de caracteres padrão e a correção de caracteres para novos objetos diferem dos anteriores, a menos que um conjunto de caracteres e uma correção de caracteres explícitos sejam especificados. Isso inclui bancos de dados e objetos dentro deles, como tabelas, visualizações e programas armazenados. Supondo que os padrões anteriores tenham sido usados, uma maneira de preservá-los é iniciar o servidor com essas linhas no arquivo `my.cnf`:

  ```
  [mysqld]
  character_set_server=latin1
  collation_server=latin1_swedish_ci
  ```

Em um ambiente replicado, ao fazer a atualização do MySQL 5.7 para o 8.0, é recomendável alterar o conjunto de caracteres padrão de volta ao conjunto de caracteres usado no MySQL 5.7 antes da atualização. Após a conclusão da atualização, o conjunto de caracteres padrão pode ser alterado para `utf8mb4`.

Além disso, você deve estar ciente de que o MySQL 8.0 aplica verificações em caracteres permitidos em um conjunto de caracteres específico, o que o MySQL 5.7 não faz; esse é um problema conhecido. Isso significa que, antes de tentar fazer a atualização, você deve garantir que nenhum comentário contenha caracteres que não estejam definidos para o conjunto de caracteres em uso. Você pode corrigir isso de duas maneiras:

+ Altere o conjunto de caracteres para um que inclua o(s) caractere(s) em questão.

+ Remova o(s) caractere(s) ofensor(es).

O que precede se aplica a comentários de tabela, arquivo e índice.

* **Mudança incompatível**: a partir do MySQL 8.0.11, é proibido iniciar o servidor com uma configuração `lower_case_table_names` que seja diferente da configuração usada quando o servidor foi inicializado. A restrição é necessária porque as codificações usadas por vários campos de tabelas do dicionário de dados são baseadas na configuração `lower_case_table_names` que foi definida quando o servidor foi inicializado, e reiniciar o servidor com uma configuração diferente introduziria inconsistências em relação ao modo como os identificadores são ordenados e comparados.

### Alterações no servidor

* No MySQL 8.0.11, vários recursos desatualizados relacionados à gestão de contas foram removidos, como o uso da declaração `GRANT` para modificar características não de privilégio das contas de usuário, o modo SQL `NO_AUTO_CREATE_USER`, a função `PASSWORD()` e a variável de sistema `old_passwords`.

A replicação de declarações que se referem a essas funcionalidades removidas do MySQL 5.7 para o MySQL 8.0 pode causar falha na replicação. As aplicações que utilizam qualquer uma das funcionalidades removidas devem ser revisadas para evitar essas funcionalidades e utilizar alternativas quando possível, conforme descrito nas funcionalidades removidas no MySQL 8.0.

Para evitar falha de inicialização no MySQL 8.0, remova qualquer instância de `NO_AUTO_CREATE_USER` das configurações da variável de sistema `sql_mode` nos arquivos de opção do MySQL.

Carregar um arquivo de implantação que inclui o modo `NO_AUTO_CREATE_USER` SQL nas definições de programas armazenados em um servidor MySQL 8.0 causa uma falha. A partir do MySQL 5.7.24 e do MySQL 8.0.13, o **mysqldump** remove `NO_AUTO_CREATE_USER` das definições de programas armazenados. Arquivos de implantação criados com uma versão anterior do `mysqldump` devem ser modificados manualmente para remover as instâncias de `NO_AUTO_CREATE_USER`.

* No MySQL 8.0.11, esses modos de compatibilidade de SQL obsoletos foram removidos: `DB2`, `MAXDB`, `MSSQL`, `MYSQL323`, `MYSQL40`, `ORACLE`, `POSTGRESQL`, `NO_FIELD_OPTIONS`, `NO_KEY_OPTIONS`, `NO_TABLE_OPTIONS`. Eles não podem mais ser atribuídos à variável de sistema `sql_mode` ou usados como valores permitidos para a opção **mysqldump** `--compatible`.

A remoção de `MAXDB` significa que o tipo de dados `TIMESTAMP` para `CREATE TABLE` ou `ALTER TABLE` não é mais tratado como `DATETIME`.

A replicação de declarações que se referem aos modos de SQL removidos do MySQL 5.7 para 8.0 pode causar falha na replicação. Isso inclui a replicação de declarações `CREATE` para programas armazenados (procedimentos e funções armazenados, gatilhos e eventos) que são executados enquanto o valor atual `sql_mode` inclui qualquer um dos modos removidos. As aplicações que utilizam qualquer um dos modos removidos devem ser revisadas para evitar isso.

* O texto de muitas mensagens de erro do MySQL 8.0 foi revisado e aprimorado para fornecer mais e melhor informações do que no MySQL 5.7. Se sua aplicação depende de conteúdo ou formatação específica de mensagens de erro, você deve testar essas informações e estar preparado para atualizar a aplicação conforme necessário antes de realizar uma atualização.

* a partir do MySQL 8.0.3, os tipos de dados espaciais permitem um atributo `SRID`, para indicar explicitamente o sistema de referência espacial (SRS) para os valores armazenados na coluna. Veja a Seção 13.4.1, “Tipos de Dados Espaciais”.

Uma coluna espacial com um atributo explícito `SRID` é restrita ao SRID: a coluna aceita apenas valores com essa ID, e os índices `SPATIAL` na coluna passam a ser utilizados pelo otimizador. O otimizador ignora os índices `SPATIAL` em colunas espaciais sem o atributo `SRID`. Veja a Seção 10.3.3, “Otimização de Índices Espaciais”. Se você deseja que o otimizador considere índices `SPATIAL` em colunas espaciais que não são restritas ao SRID, cada uma dessas colunas deve ser modificada:

+ Verifique se todos os valores na coluna têm o mesmo SRID. Para determinar os SRIDs contidos em uma coluna de geometria *`col_name`*, use a seguinte consulta:

    ```
    SELECT DISTINCT ST_SRID(col_name) FROM tbl_name;
    ```

Se a consulta retornar mais de uma linha, a coluna contém uma mistura de SRIDs. Nesse caso, modifique o conteúdo para que todos os valores tenham o mesmo SRID.

+ Redefina a coluna para ter um atributo explícito `SRID`.

+ Recrie o índice `SPATIAL`.
* Várias funções espaciais foram removidas no MySQL 8.0.0 devido a uma mudança no namespace de funções espaciais que implementou um prefixo `ST_` para funções que realizam uma operação exata ou um prefixo `MBR` para funções que realizam uma operação com base em retângulos de delimitação mínima. O uso de funções espaciais removidas em definições de coluna geradas pode causar uma falha de atualização. Antes de atualizar, execute [**mysqlcheck --check-upgrade**][(mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program")] para funções espaciais removidas e substitua qualquer uma que você encontrar com suas substituições com nomes `ST_` ou `MBR`. Para uma lista de funções espaciais removidas, consulte Funções Removidas no MySQL 8.0.

* O privilégio `BACKUP_ADMIN` é concedido automaticamente aos usuários com o privilégio `RELOAD` ao realizar uma atualização in-place para o MySQL 8.0.3 ou superior.

* A partir do MySQL 8.0.13, devido às diferenças entre o modo de replicação baseado em linha ou misto e o modo de replicação baseado em declaração na forma como as tabelas temporárias são manipuladas, há novas restrições para alternar o formato de registro binário em tempo real.

+ `SET @@SESSION.binlog_format` não pode ser usado se a sessão tiver quaisquer tabelas temporárias abertas.

+ `SET @@global.binlog_format` e `SET @@persist.binlog_format` não podem ser usados se qualquer canal de replicação tiver tabelas temporárias abertas. `SET @@persist_only.binlog_format` é permitido se os canais de replicação tiverem tabelas temporárias abertas, porque, ao contrário de `PERSIST`, `PERSIST_ONLY` não modifica o valor da variável global do sistema em tempo de execução.

+ `SET @@global.binlog_format` e `SET @@persist.binlog_format` não podem ser usados se houver algum aplicativo de canal de replicação em execução. Isso ocorre porque a mudança só se torna efetiva em um canal de replicação quando seu aplicativo é reiniciado, momento em que o canal de replicação pode ter tabelas temporárias abertas. Esse comportamento é mais restritivo do que antes. `SET @@persist_only.binlog_format` é permitido se houver algum aplicativo de canal de replicação em execução.

+ A partir do MySQL 8.0.27, a configuração de um ajuste de sessão para `internal_tmp_mem_storage_engine` requer o privilégio `SESSION_VARIABLES_ADMIN` ou `SYSTEM_VARIABLES_ADMIN`.

+ A partir do MySQL 8.0.27, o plugin clone permite operações DDL concorrentes na instância do servidor MySQL doador enquanto uma operação de clonagem está em andamento. Anteriormente, uma bloqueio de backup era mantido durante a operação de clonagem, impedindo DDL concorrente no doador. Para reverter ao comportamento anterior de bloquear DDL concorrente no doador durante uma operação de clonagem, habilite a variável `clone_block_ddl`. Veja a Seção 7.6.7.4, “Clonagem e DDL Concorrente”.

* A partir do MySQL 8.0.30, os componentes do log de erro listados no valor `log_error_services` ao iniciar são carregados implicitamente no início da sequência de inicialização do MySQL Server. Se você instalou anteriormente componentes de log de erro carregáveis usando `INSTALL COMPONENT` e listou esses componentes em um ajuste `log_error_services` que é lido ao iniciar (de um arquivo de opção, por exemplo), sua configuração deve ser atualizada para evitar avisos de inicialização. Para mais informações, consulte Métodos de Configuração do Log de Erro.

### Alterações no InnoDB

* As visualizações com base no sistema `INFORMATION_SCHEMA` foram substituídas por visualizações internas do sistema em tabelas do dicionário de dados. As visualizações afetadas `InnoDB` `INFORMATION_SCHEMA` foram renomeadas:

**Tabela 3.1 Renomeada: Visões do Schema de Informações InnoDB**

  <table summary="InnoDB Information Schema views that were renamed in MySQL 8.0."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Old Name</th> <th>New Name</th> </tr></thead><tbody><tr> <td><code>INNODB_SYS_COLUMNS</code></td> <td><code>INNODB_COLUMNS</code></td> </tr><tr> <td><code>INNODB_SYS_DATAFILES</code></td> <td><code>INNODB_DATAFILES</code></td> </tr><tr> <td><code>INNODB_SYS_FIELDS</code></td> <td><code>INNODB_FIELDS</code></td> </tr><tr> <td><code>INNODB_SYS_FOREIGN</code></td> <td><code>INNODB_FOREIGN</code></td> </tr><tr> <td><code>INNODB_SYS_FOREIGN_COLS</code></td> <td><code>INNODB_FOREIGN_COLS</code></td> </tr><tr> <td><code>INNODB_SYS_INDEXES</code></td> <td><code>INNODB_INDEXES</code></td> </tr><tr> <td><code>INNODB_SYS_TABLES</code></td> <td><code>INNODB_TABLES</code></td> </tr><tr> <td><code>INNODB_SYS_TABLESPACES</code></td> <td><code>INNODB_TABLESPACES</code></td> </tr><tr> <td><code>INNODB_SYS_TABLESTATS</code></td> <td><code>INNODB_TABLESTATS</code></td> </tr><tr> <td><code>INNODB_SYS_VIRTUAL</code></td> <td><code>INNODB_VIRTUAL</code></td> </tr></tbody></table>

Após a atualização para o MySQL 8.0.3 ou superior, atualize quaisquer scripts que façam referência a nomes de visualizações anteriores `InnoDB` `INFORMATION_SCHEMA`.

* A versão da biblioteca zlib incluída no MySQL foi elevada da versão 1.2.3 para a versão 1.2.11.

A função zlib `compressBound()` no zlib 1.2.11 retorna uma estimativa ligeiramente mais alta do tamanho do buffer necessário para comprimir um determinado comprimento de bytes do que a função zlib versão 1.2.3. A função `compressBound()` é chamada pelas funções `InnoDB` que determinam o tamanho máximo de linha permitido ao criar tabelas `InnoDB` comprimidas ou ao inserir e atualizar linhas em tabelas `InnoDB` comprimidas. Como resultado, as operações [[`CREATE TABLE ... ROW_FORMAT=COMPRESSED`][(create-table.html "15.1.20 CREATE TABLE Statement")]], `INSERT` e `UPDATE` com tamanhos de linha muito próximos ao tamanho máximo de linha que foram bem-sucedidas em versões anteriores podem agora falhar. Para evitar esse problema, teste as declarações `CREATE TABLE` para tabelas `InnoDB` comprimidas com grandes linhas em uma instância de teste do MySQL 8.0 antes da atualização.

* Com a introdução do recurso `--innodb-directories`, a localização dos arquivos de tabela por tabela e dos arquivos de espaço de tabela geral criados com um caminho absoluto ou em um local fora do diretório de dados deve ser adicionada ao valor do argumento `innodb_directories`. Caso contrário, `InnoDB` não será capaz de localizar esses arquivos durante a recuperação. Para visualizar as localizações dos arquivos de espaço de tabela, consulte a tabela do Esquema de Informações `FILES`:

  ```
  SELECT TABLESPACE_NAME, FILE_NAME FROM INFORMATION_SCHEMA.FILES \G
  ```

* Os registros de desfazer não podem mais residir no espaço de tabela do sistema. No MySQL 8.0, os registros de desfazer residem em dois espaços de tabela de desfazer por padrão. Para mais informações, consulte a Seção 17.6.3.4, “Espaços de Tabela de Desfazer”.

Ao fazer a atualização do MySQL 5.7 para o MySQL 8.0, quaisquer espaços de tabela de desfazer que existam na instância do MySQL 5.7 são removidos e substituídos por dois novos espaços de tabela de desfazer padrão. Os espaços de tabela de desfazer padrão são criados na localização definida pela variável `innodb_undo_directory`. Se a variável `innodb_undo_directory` não for definida, os espaços de tabela de desfazer são criados no diretório de dados. A atualização do MySQL 5.7 para o MySQL 8.0 requer um desligamento lento que garante que os espaços de tabela de desfazer na instância do MySQL 5.7 estejam vazios, permitindo que sejam removidos com segurança.

Ao atualizar para o MySQL 8.0.14 ou posterior a partir de uma versão anterior do MySQL 8.0, os espaços de tabela que existem na instância pré-upgrade, resultante de uma configuração `innodb_undo_tablespaces` maior que 2, são tratados como espaços de tabela definidos pelo usuário, que podem ser desativados e eliminados usando a sintaxe `ALTER UNDO TABLESPACE`(alter-tablespace.html "15.1.10 ALTER TABLESPACE Statement") e `DROP UNDO TABLESPACE`(drop-tablespace.html "15.1.33 DROP TABLESPACE Statement"), respectivamente, após a atualização. A atualização dentro da série de versões do MySQL 8.0 nem sempre requer um desligamento lento, o que significa que os espaços de tabela de desfazer existentes podem conter registros de desfazer. Portanto, os espaços de tabela de desfazer existentes não são removidos pelo processo de atualização.

* **Mudança incompatível**: a partir do MySQL 8.0.17, a cláusula `CREATE TABLESPACE ... ADD DATAFILE` (create-tablespace.html "15.1.21 CREATE TABLESPACE Statement") não permite referências circulares de diretório. Por exemplo, a referência circular de diretório (`/../`) na seguinte declaração não é permitida:

  ```
  CREATE TABLESPACE ts1 ADD DATAFILE ts1.ibd 'any_directory/../ts1.ibd';
  ```

Uma exceção à restrição existe no Linux, onde uma referência circular de diretório é permitida se o diretório anterior for um link simbólico. Por exemplo, o caminho do arquivo de dados no exemplo acima é permitido se *`any_directory`* for um link simbólico. (Ainda é permitido que os caminhos dos arquivos de dados comecem com '`../`'.

Para evitar problemas de atualização, remova quaisquer referências circulares de diretório dos caminhos dos arquivos de dados do espaço de tabela antes de atualizar para o MySQL 8.0.17 ou superior. Para inspecionar os caminhos do espaço de tabela, consulte a tabela do esquema de informações `INNODB_DATAFILES`.

* Devido a uma regressão introduzida no MySQL 8.0.14, a atualização in-place em um sistema de arquivos case-sensitive de um MySQL 5.7 ou uma versão do MySQL 8.0 anterior ao MySQL 8.0.14 para MySQL 8.0.16 falhou para instâncias com tabelas particionadas e `lower_case_table_names=1`. O erro foi causado por um problema de desalinhamento de casos relacionado aos nomes de arquivos de tabela particionada. A correção que introduziu a regressão foi revertida, o que permite que as atualizações do MySQL 8.0.17 do MySQL 5.7 ou das versões do MySQL 8.0 anteriores ao MySQL 8.0.14 funcionem normalmente. No entanto, a regressão ainda está presente nas versões MySQL 8.0.14, 8.0.15 e 8.0.16.

A atualização in-place em um sistema de arquivos sensível ao caso gramatical de um MySQL 8.0.14, 8.0.15 ou 8.0.16 para MySQL 8.0.17 falha com o seguinte erro ao iniciar o servidor após a atualização de binários ou pacotes para MySQL 8.0.17, se houver tabelas particionadas e `lower_case_table_names=1`:

  ```
  Upgrading from server version version_number with
  partitioned tables and lower_case_table_names == 1 on a case sensitive file
  system may cause issues, and is therefore prohibited. To upgrade anyway, restart
  the new server version with the command line option 'upgrade=FORCE'. When
  upgrade is completed, please execute 'RENAME TABLE part_table_name
  TO new_table_name; RENAME TABLE new_table_name
  TO part_table_name;' for each of the partitioned tables.
  Please see the documentation for further information.
  ```

Se você encontrar esse erro ao fazer uma atualização para o MySQL 8.0.17, realize a solução de trabalho a seguir:

1. Reinicie o servidor com `--upgrade=force` para forçar a operação de atualização a prosseguir.

2. Identifique os nomes dos arquivos de tabela particionada com delimitadores de nome de partição em minúsculas `(#p#` ou `#sp#`):

     ```
     mysql> SELECT FILE_NAME FROM INFORMATION_SCHEMA.FILES WHERE FILE_NAME LIKE '%#p#%' OR FILE_NAME LIKE '%#sp#%';
     ```

3. Para cada arquivo identificado, renomeie a tabela associada usando um nome temporário, e depois renomeie a tabela de volta ao seu nome original.

     ```
     mysql> RENAME TABLE table_name TO temporary_table_name;
     mysql> RENAME TABLE temporary_table_name TO table_name;
     ```

4. Verifique se não há delimitadores de nome de partição em maiúsculas ou minúsculas nos nomes dos arquivos de tabela particionada (deve ser retornado um conjunto de resultados vazio).

     ```
     mysql> SELECT FILE_NAME FROM INFORMATION_SCHEMA.FILES WHERE FILE_NAME LIKE '%#p#%' OR FILE_NAME LIKE '%#sp#%';
     Empty set (0.00 sec)
     ```

5. Execute `ANALYZE TABLE` em cada tabela renomeada para atualizar as estatísticas do otimizador nas tabelas `mysql.innodb_index_stats` e `mysql.innodb_table_stats`.

Devido à regressão ainda presente nas versões MySQL 8.0.14, 8.0.15 e 8.0.16, a importação de tabelas particionadas do MySQL 8.0.14, 8.0.15 ou 8.0.16 para o MySQL 8.0.17 não é suportada em sistemas de arquivos sensíveis ao caso em que `lower_case_table_names=1`. Tentar fazer isso resulta em um erro de “Espaço de tabelas ausente para a tabela”.

* O MySQL utiliza strings de delimitador ao construir nomes de espaço de tabela e nomes de arquivos para partições de tabela. Uma string de delimitador “ `#p#` ” precede os nomes de partição, e uma string de delimitador “ `#sp#` ” precede os nomes de subpartição, conforme mostrado:

  ```
        schema_name.table_name#p#partition_name#sp#subpartition_name
        table_name#p#partition_name#sp#subpartition_name.ibd
  ```

Historicamente, as strings de delimitador eram maiúsculas (`#P#` e `#SP#`) em sistemas de arquivos sensíveis ao caso, como o Linux, e minúsculas (`#p#` e `#sp#`) em sistemas de arquivos insensíveis ao caso, como o Windows. A partir do MySQL 8.0.19, as strings de delimitador são minúsculas em todos os sistemas de arquivos. Essa mudança previne problemas ao migrar diretórios de dados entre sistemas de arquivos sensíveis ao caso e insensíveis ao caso. As strings de delimitador maiúsculas não são mais usadas.

Além disso, os nomes dos espaços de partição e os nomes dos arquivos gerados com base nos nomes de partição ou subpartição especificados pelo usuário, que podem ser especificados em maiúsculas ou minúsculas, agora são gerados (e armazenados internamente) em minúsculas, independentemente da configuração `lower_case_table_names`, para garantir a insensibilidade ao caso. Por exemplo, se uma partição de tabela é criada com o nome `PART_1`, o nome do espaço de tabela e o nome do arquivo são gerados em minúsculas:

  ```
        schema_name.table_name#p#part_1
        table_name#p#part_1.ibd
  ```

Durante a atualização, o MySQL verifica e modifica, se necessário:

+ Divida os nomes dos arquivos no disco e no dicionário de dados para garantir delimitadores em minúsculas e nomes de partição.

+ Metadados de partição no dicionário de dados para questões relacionadas introduzidas por correções de bugs anteriores.

+ Dados de estatísticas `InnoDB` para questões relacionadas introduzidas por correções de bugs anteriores.

Durante as operações de importação de tablespace, os nomes dos arquivos de tablespace de partição são verificados e modificados, se necessário, para garantir delimitadores em minúsculas e nomes de partição.

* A partir do MySQL 8.0.21, um aviso é escrito no log de erro durante a inicialização ou ao fazer uma atualização do MySQL 5.7, se os arquivos de dados do espaço de tabela forem encontrados em diretórios desconhecidos. Os diretórios conhecidos são aqueles definidos pelas variáveis `datadir`, `innodb_data_home_dir` e `innodb_directories`. Para tornar um diretório conhecido, adicione-o à configuração `innodb_directories`. Tornar os diretórios conhecidos garante que os arquivos de dados possam ser encontrados durante a recuperação de falha. Para mais informações, consulte Descoberta de Tablespace Durante a Recuperação de Falha.

* **Alterações importantes**: A partir do MySQL 8.0.30, a variável `innodb_redo_log_capacity` controla a quantidade de espaço em disco ocupada pelos arquivos de registro de revisão. Com essa mudança, o número padrão de arquivos de registro de revisão e sua localização também foram alterados. A partir do MySQL 8.0.30, `InnoDB` mantém 32 arquivos de registro de revisão no diretório `#innodb_redo` no diretório de dados. Anteriormente, `InnoDB` criava dois arquivos de registro de revisão no diretório de dados por padrão, e o número e o tamanho dos arquivos de registro de revisão eram controlados pelas variáveis `innodb_log_files_in_group` e `innodb_log_file_size`. Essas duas variáveis são agora desatualizadas.

Quando a configuração `innodb_redo_log_capacity` é definida, as configurações `innodb_log_files_in_group` e `innodb_log_file_size` são ignoradas; caso contrário, essas configurações são usadas para calcular a configuração `innodb_redo_log_capacity` (`innodb_log_files_in_group` * `innodb_log_file_size` = `innodb_redo_log_capacity`). Se nenhuma dessas variáveis for definida, a capacidade do log de refazer é definida pelo valor padrão de `innodb_redo_log_capacity`, que é de 104857600 bytes (100 MB).

Como é geralmente exigido para qualquer atualização, essa mudança requer um desligamento limpo antes da atualização.

Para mais informações sobre esse recurso, consulte a Seção 17.6.5, “Registro de Refazer”.

* Antes do MySQL 5.7.35, não havia limitação de tamanho para índices em tabelas com formato de linha redundante ou compacto. A partir do MySQL 5.7.35, o limite é de 767 bytes. Uma atualização de uma versão do MySQL antes do 5.7.35 para o MySQL 8.0 pode produzir tabelas inacessíveis. Se uma tabela com formato de linha redundante ou compacto tiver um índice maior que 767 bytes, exclua o índice e recriá-lo antes de uma atualização para o MySQL 8.0. A mensagem de erro é:

  ```
  mysql> ERROR 1709 (HY000): Index column size too large. The maximum column size is 767 bytes.
  ```

### Alterações no SQL

* **Mudança incompatível**: a partir do MySQL 8.0.13, os qualificadores descontinuados `ASC` ou `DESC` para as cláusulas `GROUP BY` foram removidos. As consultas que anteriormente dependiam da classificação `GROUP BY` podem produzir resultados diferentes das versões anteriores do MySQL. Para produzir um determinado ordem de classificação, forneça uma cláusula `ORDER BY`.

As consultas e definições de programas armazenados do MySQL 8.0.12 ou versões anteriores que utilizam os qualificadores `ASC` ou `DESC` para cláusulas `GROUP BY` devem ser alteradas. Caso contrário, a atualização para o MySQL 8.0.13 ou versões posteriores pode falhar, assim como a replicação para servidores replica de MySQL 8.0.13 ou versões posteriores.

* Algumas palavras-chave podem estar reservadas no MySQL 8.0 que não estavam reservadas no MySQL 5.7. Veja a Seção 11.3, “Palavras-chave e Palavras Reservadas”. Isso pode fazer com que palavras anteriormente usadas como identificadores se tornem ilegais. Para corrigir as declarações afetadas, use a citação de identificadores. Veja a Seção 11.2, “Nomes de Objetos do Esquema”.

* Após a atualização, é recomendável testar as dicas de otimização especificadas no código da aplicação para garantir que as dicas ainda sejam necessárias para alcançar a estratégia de otimização desejada. As melhorias do otimizador podem, às vezes, tornar certas dicas de otimização desnecessárias. Em alguns casos, uma dica de otimização desnecessária pode até ser contraproducente.

* **Mudança incompatível**: Em MySQL 5.7, especificar uma definição `FOREIGN KEY` para uma tabela `InnoDB` sem uma cláusula `CONSTRAINT symbol`, ou especificar a palavra-chave `CONSTRAINT` sem uma `symbol`, faz com que o `InnoDB` use um nome de restrição gerado. Esse comportamento mudou no MySQL 8.0, com `InnoDB` usando o valor `FOREIGN KEY index_name` em vez de um nome gerado. Como os nomes de restrição devem ser únicos por esquema (banco de dados), a mudança causou erros devido a nomes de índices de chave estrangeira que não eram únicos por esquema. Para evitar tais erros, o novo comportamento de nomeação de restrições foi revertido no MySQL 8.0.16, e `InnoDB` usa novamente um nome de restrição gerado.

Para a consistência com `InnoDB`, as versões de `NDB` baseadas em MySQL 8.0.16 ou superior utilizam um nome de restrição gerado se a cláusula `CONSTRAINT symbol` não for especificada, ou a palavra-chave `CONSTRAINT` é especificada sem um `symbol`. As versões de `NDB` baseadas em MySQL 5.7 e versões anteriores de MySQL 8.0 utilizavam o valor `FOREIGN KEY index_name`.

As mudanças descritas acima podem introduzir incompatibilidades para aplicações que dependem do comportamento anterior de nomeação de restrição de chave estrangeira.

* O tratamento dos valores das variáveis do sistema pelas funções de controle de fluxo do MySQL, como `IFNULL()` e `CASE()`, mudou no MySQL 8.0.22; os valores das variáveis do sistema são agora tratados como valores de coluna do mesmo conjunto de caracteres e collation, e não como constantes. Algumas consultas que utilizam essas funções com variáveis do sistema que anteriormente eram bem-sucedidas podem ser posteriormente rejeitadas com mistura ilegal de collation. Nesses casos, realize a conversão da variável do sistema para o conjunto de caracteres e collation corretos.

* **Mudança incompatível**: O MySQL 8.0.28 corrige um problema em versões anteriores do MySQL 8.0, em que a função `CONVERT()` às vezes permitia lançamentos inválidos de valores `BINARY` em conjuntos de caracteres não binários. As aplicações que podem ter dependido desse comportamento devem ser verificadas e, se necessário, modificadas antes da atualização.

Em particular, quando `CONVERT()` foi usado como parte de uma expressão para uma coluna gerada indexada, a mudança no comportamento da função pode resultar em corrupção do índice após uma atualização para o MySQL 8.0.28. Você pode evitar que isso aconteça seguindo esses passos:

1. Antes de realizar a atualização, corrija qualquer dado de entrada inválido.

2. Desça e, em seguida, recrie o índice.

Você também pode forçar a reconstrução de uma tabela usando `ALTER TABLE table FORCE`](alter-table.html "15.1.9 ALTER TABLE Statement"), em vez disso.

3. Atualize o software do MySQL.

Se você não puder validar os dados de entrada previamente, não deve recriar o índice ou reconstruir a tabela até que realize a atualização para o MySQL 8.0.28.

### Mudanças nos Padrões de Servidor Padrão

O MySQL 8.0 vem com configurações padrão aprimoradas, visando a melhor experiência possível desde o momento em que é instalado. Essas mudanças são impulsionadas pelo fato de que a tecnologia está avançando (máquinas têm mais CPUs, usam SSDs e assim por diante), mais dados estão sendo armazenados, o MySQL está evoluindo (InnoDB, Replicação de Grupo, AdminAPI) e assim por diante. O quadro a seguir resume as configurações padrão que foram alteradas para fornecer a melhor experiência do MySQL para a maioria dos usuários.

<table summary="Summary of which MySQL Server defaults changed in this release."><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th>Option/Parameter</th> <th>Old Default</th> <th>New Default</th> </tr></thead><tbody><tr> <td>Server changes</td> <td></td> <td></td> </tr><tr> <td><code>character_set_server</code></td> <td>latin1</td> <td>utf8mb4</td> </tr><tr> <td><code>collation_server</code></td> <td>latin1_swedish_ci</td> <td>utf8mb4_0900_ai_ci</td> </tr><tr> <td><code>explicit_defaults_for_timestamp</code></td> <td>OFF</td> <td>ON</td> </tr><tr> <td><code>optimizer_trace_max_mem_size</code></td> <td>16KB</td> <td>1MB</td> </tr><tr> <td><code>validate_password_check_user_name</code></td> <td>OFF</td> <td>ON</td> </tr><tr> <td><code>back_log</code></td> <td>-1 (autosize) changed from : back_log = 50 + (max_connections / 5)</td> <td>-1 (autosize) changed to : back_log = max_connections</td> </tr><tr> <td><code>max_allowed_packet</code></td> <td>4194304 (4MB)</td> <td>67108864 (64MB)</td> </tr><tr> <td><code>max_error_count</code></td> <td>64</td> <td>1024</td> </tr><tr> <td><code>event_scheduler</code></td> <td>OFF</td> <td>ON</td> </tr><tr> <td><code>table_open_cache</code></td> <td>2000</td> <td>4000</td> </tr><tr> <td><code>log_error_verbosity</code></td> <td>3 (Notes)</td> <td>2 (Warning)</td> </tr><tr> <td><code>local_infile</code></td> <td>ON (5.7)</td> <td>OFF</td> </tr><tr> <td>InnoDB changes</td> <td></td> <td></td> </tr><tr> <td><code>innodb_undo_tablespaces</code></td> <td>0</td> <td>2</td> </tr><tr> <td><code>innodb_undo_log_truncate</code></td> <td>OFF</td> <td>ON</td> </tr><tr> <td><code>innodb_flush_method</code></td> <td>NULL</td> <td>fsync (Unix), unbuffered (Windows)</td> </tr><tr> <td><code>innodb_autoinc_lock_mode</code></td> <td>1 (consecutive)</td> <td>2 (interleaved)</td> </tr><tr> <td><code>innodb_flush_neighbors</code></td> <td>1 (enable)</td> <td>0 (disable)</td> </tr><tr> <td><code>innodb_max_dirty_pages_pct_lwm</code></td> <td>0 (%)</td> <td>10 (%)</td> </tr><tr> <td><code>innodb_max_dirty_pages_pct</code></td> <td>75 (%)</td> <td>90 (%)</td> </tr><tr> <td>Performance Schema changes</td> <td></td> <td></td> </tr><tr> <td><code>performance-schema-instrument='wait/lock/metadata/sql/%=ON'</code></td> <td>OFF</td> <td>ON</td> </tr><tr> <td><code>performance-schema-instrument='memory/%=COUNTED'</code></td> <td>OFF</td> <td>COUNTED</td> </tr><tr> <td><code>performance-schema-consumer-events-transactions-current=ON</code></td> <td>OFF</td> <td>ON</td> </tr><tr> <td><code>performance-schema-consumer-events-transactions-history=ON</code></td> <td>OFF</td> <td>ON</td> </tr><tr> <td><code>performance-schema-instrument='transaction%=ON'</code></td> <td>OFF</td> <td>ON</td> </tr><tr> <td>Replication changes</td> <td></td> <td></td> </tr><tr> <td><code>log_bin</code></td> <td>OFF</td> <td>ON</td> </tr><tr> <td><code>server_id</code></td> <td>0</td> <td>1</td> </tr><tr> <td><code>log-slave-updates</code></td> <td>OFF</td> <td>ON</td> </tr><tr> <td><code>expire_logs_days</code></td> <td>0</td> <td>30</td> </tr><tr> <td><code>master-info-repository</code></td> <td>FILE</td> <td>TABLE</td> </tr><tr> <td><code>relay-log-info-repository</code></td> <td>FILE</td> <td>TABLE</td> </tr><tr> <td><code>transaction-write-set-extraction</code></td> <td>OFF</td> <td>XXHASH64</td> </tr><tr> <td><code>slave_rows_search_algorithms</code></td> <td>INDEX_SCAN, TABLE_SCAN</td> <td>INDEX_SCAN, HASH_SCAN</td> </tr><tr> <td><code>slave_pending_jobs_size_max</code></td> <td>16M</td> <td>128M</td> </tr><tr> <td><code>gtid_executed_compression_period</code></td> <td>1000</td> <td>0</td> </tr><tr> <td>Group Replication changes</td> <td></td> <td></td> </tr><tr> <td><code>group_replication_autorejoin_tries</code></td> <td>0</td> <td>3</td> </tr><tr> <td><code>group_replication_exit_state_action</code></td> <td>ABORT_SERVER</td> <td>READ_ONLY</td> </tr><tr> <td><code>group_replication_member_expel_timeout</code></td> <td>0</td> <td>5</td> </tr></tbody></table>

Para mais informações sobre as opções ou variáveis que foram adicionadas, consulte as alterações de opções e variáveis para o MySQL 8.0, no *Referência da versão do servidor MySQL*.

As seções a seguir explicam as mudanças nos padrões e qualquer impacto que possam ter em sua implantação.

**Padrões de servidor**

* O valor padrão da variável de sistema `character_set_server` e a opção de linha de comando `--character-set-server` mudou de `latin1` para `utf8mb4`. Este é o conjunto de caracteres padrão do servidor. Neste momento, UTF8MB4 é o codificação de caracteres dominante para a web, e essa mudança facilita a vida da grande maioria dos usuários do MySQL. A atualização de 5.7 para 8.0 não altera o conjunto de caracteres para quaisquer objetos de banco de dados existentes, mas, a menos que você defina explicitamente `character_set_server` (ou seja, de volta ao valor anterior, ou para um novo), um novo esquema usa `utf8mb4` como padrão. Recomendamos que você mude para `utf8mb4` sempre que possível.

* O valor padrão da variável do sistema `collation_server` e do argumento de linha de comando `--collation-server` mudou de `latin1_swedish_ci` para `utf8mb4_0900_ai_ci`. Este é o collation padrão do servidor, a ordem dos caracteres em um conjunto de caracteres. Há uma ligação entre as colatões e os conjuntos de caracteres, pois cada conjunto de caracteres vem com uma lista de colatões possíveis. A atualização de 5.7 para 8.0 não altera nenhuma colatação para quaisquer objetos de banco de dados existentes, mas tem efeito para novos objetos.

* O valor padrão da variável de sistema `explicit_defaults_for_timestamp` mudou de `OFF` (comportamento legítimo do MySQL) para `ON` (comportamento padrão do SQL). Esta opção foi originalmente introduzida no 5.6 e foi `OFF` no 5.6 e 5.7.

* O valor padrão da variável de sistema `optimizer_trace_max_mem_size` mudou de `16KB` para `1MB`. O antigo padrão fazia com que o rastreamento do otimizador fosse truncado para qualquer consulta não trivial. Essa mudança garante rastros úteis do otimizador para a maioria das consultas.

* O valor padrão da variável de sistema `validate_password_check_user_name` mudou de `OFF` para `ON`. Isso significa que, quando o plugin `validate_password` é habilitado, por padrão, ele agora rejeita senhas que correspondem ao nome do usuário da sessão atual.

* O algoritmo de autoajuste para a variável de sistema `back_log` foi alterado. O valor para autoajuste (-1) agora é definido pelo valor de `max_connections`, que é maior do que o calculado por `50 + (max_connections / 5)`. A fila `back_log` acumula solicitações de conexão IP entrantes em situações em que o servidor não consegue acompanhar as solicitações entrantes. No pior dos casos, com o número de clientes tentando se reconectar ao mesmo tempo, por exemplo, após uma falha na rede, todos podem ser armazenados em buffer e os loops de tentativa de rejeição são evitados.

* O valor padrão da variável de sistema `max_allowed_packet` mudou de `4194304` (4M) para `67108864` (64M). A principal vantagem dessa configuração maior é a menor chance de receber erros sobre um inserto ou consulta sendo maior que `max_allowed_packet`. Deveria ser tão grande quanto o maior da Seção 13.3.4, “Os tipos BLOB e TEXT”, que você deseja usar. Para reverter ao comportamento anterior, defina `max_allowed_packet=4194304`.

O valor padrão da variável de sistema `max_error_count` mudou de `64` para `1024`. Isso garante que o MySQL gere um número maior de avisos, como uma declaração de UPDATE que afeta milhares de linhas e muitas delas geram avisos de conversão. É comum que muitas ferramentas façam atualizações em lote, para ajudar a reduzir o atraso de replicação. Ferramentas externas, como pt-online-schema-change, têm como padrão 1000, e gh-ost tem como padrão 100. O MySQL 8.0 cobre o histórico completo de erros para esses dois casos de uso. Não há alocações estáticas, então essa mudança afeta apenas o consumo de memória para declarações que geram muitos avisos.

* O valor padrão da variável de sistema `event_scheduler` mudou de `OFF` para `ON`. Em outras palavras, o cronograma de eventos é habilitado por padrão. Isso é um habilitador para novos recursos no SYS, por exemplo, "cancelar transações ociosas".

* O valor padrão da variável de sistema `table_open_cache` mudou de `2000` para `4000`. Esta é uma alteração menor que aumenta a concorrência de sessões no acesso à tabela.

* O valor padrão da variável de sistema `log_error_verbosity` mudou de `3` (Notas) para `2` (Aviso). O objetivo é tornar o log de erro do MySQL 8.0 menos verbose por padrão.

**Padrões do InnoDB**

* **Mudança incompatível** O valor padrão da variável de sistema `innodb_undo_tablespaces` mudou de `0` para `2`. A configuração do número de espaços de tabelas de desfazer usados pelo InnoDB. No MySQL 8.0, o valor mínimo para `innodb_undo_tablespaces` é 2 e os segmentos de rollback não podem ser criados no espaço de tabelas do sistema. Assim, este é um caso em que você não pode voltar ao comportamento do 5.7. O propósito desta mudança é ser capaz de truncar automaticamente os registros de desfazer (ver próximo item), reclamando o espaço em disco usado por (transações) ocasionais, como um **mysqldump**.

* O valor padrão da variável de sistema `innodb_undo_log_truncate` mudou de `OFF` para `ON`. Quando habilitado, as tabelas de desfazer que excedem o valor limite definido por `innodb_max_undo_log_size` são marcadas para corte. Apenas tabelas de desfazer podem ser cortadas. Não é suportada a redução de logs de desfazer que residem no espaço de tabelas do sistema. Uma atualização de 5.7 para 8.0 converte automaticamente o sistema para usar tabelas de desfazer, usando o espaço de tabelas do sistema não é uma opção no 8.0.

O valor padrão da variável de sistema `innodb_flush_method` mudou de `NULL` para `fsync` em sistemas semelhantes ao Unix e de `NULL` para `unbuffered` em sistemas Windows. Isso é mais uma limpeza de terminologia e opção, sem qualquer impacto tangível. Para Unix, essa é apenas uma mudança de documentação, pois o padrão `fsync` também estava presente em 5.7 (o padrão `NULL` significava `fsync`). Da mesma forma, em Windows, o padrão `innodb_flush_method` significava `NULL` em 5.7, e é substituído pelo padrão `unbuffered` em 8.0, que, em combinação com o padrão existente `innodb_use_native_aio=ON`, tem o mesmo efeito.

* **Mudança incompatível** O valor padrão da variável de sistema `innodb_autoinc_lock_mode` mudou de `1` (consecutivo) para `2` (entrelaçado). A mudança para o modo de bloqueio entrelaçado como configuração padrão reflete a mudança de replicação baseada em declarações para replicação baseada em linhas como o tipo de replicação padrão, o que ocorreu no MySQL 5.7. *A replicação baseada em declarações* requer o modo de auto-incremento consecutivo para garantir que os valores de auto-incremento sejam atribuídos em uma ordem previsível e repetida para uma sequência dada de declarações SQL, enquanto a *replicação baseada em linhas* não é sensível à ordem de execução das declarações SQL. Assim, esta mudança é conhecida por ser incompatível com a replicação baseada em declarações, e pode quebrar algumas aplicações ou suítes de teste geradas pelo usuário que dependem de auto-incremento sequencial. O valor anterior pode ser restaurado definindo `innodb_autoinc_lock_mode=1;`

* O valor padrão da variável de sistema `innodb_flush_neighbors` muda de `1` (ativado) para `0` (desativado). Isso é feito porque o IO rápido (SSDs) é o padrão para implantação. Esperamos que, para a maioria dos usuários, isso resulte em um pequeno ganho de desempenho. Os usuários que estão usando discos rígidos mais lentos podem observar uma perda de desempenho e são incentivados a voltar aos valores padrão anteriores, definindo `innodb_flush_neighbors=1`.

* O valor padrão da variável de sistema `innodb_max_dirty_pages_pct_lwm` mudou de `0` (%) para `10` (%). Com `innodb_max_dirty_pages_pct_lwm=10`, o InnoDB aumenta sua atividade de esvaziamento quando >10% do buffer pool contém páginas modificadas (‘sujas’). O propósito dessa mudança é fazer um pequeno sacrifício no desempenho máximo, em troca de um desempenho mais consistente.

* O valor padrão da variável de sistema `innodb_max_dirty_pages_pct` mudou de `75` (%) para `90` (%). Essa mudança se combina com a mudança para `innodb_max_dirty_pages_pct_lwm` e, juntas, garantem um comportamento suave de limpeza do InnoDB, evitando surtos de limpeza. Para reverter ao comportamento anterior, defina `innodb_max_dirty_pages_pct=75` e `innodb_max_dirty_pages_pct_lwm=0`.

**Padrões de Schema de Desempenho**

* O instrumentação de Meta Dados de Schema de Desempenho (MDL) é ativada por padrão. O padrão compilado para `performance-schema-instrument='wait/lock/metadata/sql/%=ON'` mudou de `OFF` para `ON`. Isso é um habilitador para adicionar vistas orientadas a MDL em SYS.

* A instrumentação de Memória do Schema de Desempenho é ativada por padrão. O valor compilado padrão para `performance-schema-instrument='memory/%=COUNTED'` mudou de `OFF` para `COUNTED`. Isso é importante porque a contabilidade é incorreta se a instrumentação for ativada após o início do servidor, e você pode obter um saldo negativo por não ter feito uma alocação, mas ao capturar um espaço livre.

* A instrumentação de Schema de desempenho de transação é ativada por padrão. O padrão compilado para `performance-schema-consumer-events-transactions-current=ON`, `performance-schema-consumer-events-transactions-history=ON` e `performance-schema-instrument='transaction%=ON'` mudou de `OFF` para `ON`.

**Padrões de replicação**

O valor padrão da variável de sistema `log_bin` mudou de `OFF` para `ON`. Em outras palavras, o registro binário é habilitado por padrão. Quase todas as instalações de produção têm o registro binário habilitado, pois é usado para replicação e recuperação em um ponto no tempo. Assim, ao habilitar o registro binário por padrão, eliminamos uma etapa de configuração, e habilitá-lo posteriormente requer um **mysqld** reiniciado. Habilitar por padrão também oferece melhor cobertura de teste e torna mais fácil identificar regresiones de desempenho. Lembre-se também de definir `server_id` (consulte a mudança seguinte). O comportamento padrão de 8.0 é como se você tivesse emitido `./mysqld --log-bin --server-id=1`. Se você estiver em 8.0 e deseja o comportamento de 5.7, pode emitir `./mysqld --skip-log-bin --server-id=0`.

* O valor padrão da variável de sistema `server_id` mudou de `0` para `1` (combina com a mudança para `log_bin=ON`). O servidor pode ser iniciado com este ID padrão, mas na prática, você deve definir o `server-id` de acordo com a infraestrutura de replicação que está sendo implantada, para evitar ter IDs de servidor duplicados.

* O valor padrão da variável de sistema `log-slave-updates` mudou de `OFF` para `ON`. Isso faz com que uma replica registre eventos replicados em seu próprio log binário. Esta opção é necessária para a Replicação em Grupo e também garante o comportamento correto em várias configurações de cadeia de replicação, que se tornaram a norma hoje.

* O valor padrão da variável de sistema `expire_logs_days` mudou de `0` para `30`. O novo valor padrão `30` faz com que o **mysqld** elimine periodicamente os logs binários não utilizados que têm mais de 30 dias. Essa mudança ajuda a evitar o desperdício de grandes quantidades de espaço em disco em logs binários que não são mais necessários para fins de replicação ou recuperação. O valor antigo de `0` desativa qualquer purga automática de logs binários.

* O valor padrão das variáveis de sistema `master_info_repository` e `relay_log_info_repository` muda de `FILE` para `TABLE`. Assim, no 8.0, os metadados de replicação são armazenados no InnoDB por padrão. Isso aumenta a confiabilidade para tentar alcançar uma replicação segura em caso de falha por padrão.

* O valor padrão da variável de sistema `transaction-write-set-extraction` mudou de `OFF` para `XXHASH64`. Essa mudança habilita os conjuntos de escrita de transação por padrão. Ao usar Conjuntos de Escrita de Transação, a fonte precisa fazer um trabalho um pouco maior para gerar os conjuntos de escrita, mas o resultado é útil na detecção de conflitos. Este é um requisito para a Replicação em Grupo e o novo padrão facilita a habilitação da paralelização dos conjuntos de escrita do log binário na fonte para acelerar a replicação.

* O valor padrão da variável de sistema `slave_rows_search_algorithms` mudou de `INDEX_SCAN,TABLE_SCAN` para `INDEX_SCAN,HASH_SCAN`. Essa mudança acelera a replicação baseada em linha, reduzindo o número de varreduras de tabela que o aplicativo de aplicação de replicação precisa fazer para aplicar as alterações em uma tabela sem uma chave primária.

* O valor padrão da variável de sistema `slave_pending_jobs_size_max` mudou de `16M` para `128M`. Essa mudança aumenta a quantidade de memória disponível para réplicas multithread.

* O valor padrão da variável de sistema `gtid_executed_compression_period` mudou de `1000` para `0`. Essa mudança garante que a compressão da tabela `mysql.gtid_executed` ocorra apenas implicitamente, conforme necessário.

**Padrões de Replicação em Grupo**

* O valor padrão de `group_replication_autorejoin_tries` mudou de 0 para 3, o que significa que a reconexão automática é habilitada por padrão. Esta variável do sistema especifica o número de tentativas que um membro faz para reconectar automaticamente ao grupo se for expulso, ou se não conseguir entrar em contato com a maioria do grupo antes de atingir o ajuste do `group_replication_unreachable_majority_timeout`.

* O valor padrão de `group_replication_exit_state_action` mudou de `ABORT_SERVER` para `READ_ONLY`. Isso significa que, quando um membro sai do grupo, por exemplo, após uma falha na rede, a instância se torna somente de leitura, em vez de ser desligada.

* O valor padrão de `group_replication_member_expel_timeout` mudou de 0 para 5, o que significa que um membro suspeito de ter perdido contato com o grupo é responsável pela expulsão 5 segundos após o período de detecção de 5 segundos.

A maioria desses valores padrão é razoavelmente boa tanto para ambientes de desenvolvimento quanto para produção. Uma exceção a isso é a opção `--innodb-dedicated-server`, cujo valor padrão permanece `OFF`, embora recomenda `ON` para ambientes de produção. A razão para optar por `OFF` é que ela torna ambientes compartilhados, como os laptops dos desenvolvedores, inutilizáveis, porque ela ocupa *toda* a memória que encontra.

Para ambientes de produção, recomendamos o uso de `--innodb-dedicated-server`, que determina valores para as seguintes variáveis do InnoDB (se não especificadas explicitamente), com base na memória disponível: `innodb_buffer_pool_size`, `innodb_log_file_size` e `innodb_flush_method`. Veja a Seção 17.8.12, “Habilitar Configuração Automática do InnoDB para um Servidor MySQL Dedicado”.

Embora as novas configurações padrão sejam as melhores opções para a maioria dos casos de uso, existem casos especiais, bem como razões legítimas para usar as configurações existentes do 5.7. Por exemplo, algumas pessoas preferem atualizar para o 8.0 com o menor número possível de mudanças em seus aplicativos ou ambiente operacional. Recomendamos avaliar todas as novas configurações padrão e usar quantas puder. A maioria das novas configurações padrão pode ser testada no 5.7, então você pode validar as novas configurações padrão no ambiente de produção do 5.7 antes de atualizar para o 8.0. Para as poucas configurações padrão onde você precisa do valor antigo do 5.7, defina a variável de configuração correspondente ou a opção de inicialização no seu ambiente operacional.

O MySQL 8.0 possui a tabela do Gerador de Desempenho `variables_info`, que mostra para cada variável do sistema a fonte de onde foi definida mais recentemente, bem como sua faixa de valores. Isso fornece acesso SQL a tudo o que é necessário saber sobre uma variável de configuração e seus valores.

### Regressões de desempenho válidas

Espera-se que haja regreções de desempenho entre as versões 5.7 e 8.0 do MySQL. O MySQL 8.0 tem mais recursos, altera os valores padrão, é mais robusto e adiciona funcionalidades de segurança e informações diagnósticas adicionais. Aqui estão as razões válidas para as regreções entre essas versões, que incluem opções de mediação potenciais. Esta não é uma lista exaustiva.

Alterações relacionadas a valores padrão que mudam entre as versões MySQL 5.7 e 8.0:

* Os registros binários são desativados por padrão no 5.7 e ativados por padrão no 8.0.

*Mediação*: Desative o registro binário especificando a opção `--skip-log-bin` ou `--disable-log-bin` na inicialização.

* O conjunto de caracteres padrão mudou de `latin1` para `utf8mb4` no 8.0. Embora `utf8mb4` realize significativamente melhor no 8.0 do que no 5.7, `latin1` seja mais rápido do que `utf8mb4`.

*Mediação*: Use `latin1` no 8.0 se `utf8mb4` não for necessário.

O Dicionário de Dados Transacional (data-dictionary.html "Chapter 16 MySQL Data Dictionary") (DDL atômico) foi introduzido no 8.0.

* Isso aumenta a robustez/fiabilidade às custas do desempenho do DDL (cargas intensivas de CREATE/DROP), mas não deve impactar a carga de DML (SELECT/INSERT/UPDATE/DELETE).

*Mediação*: Nenhuma

Os cifradores e algoritmos TLS mais modernos [(encrypted-connections.html "8.3 Using Encrypted Connections")], utilizados a partir de 5.7.28, têm efeito quando o TLS (SSL) está habilitado (o padrão):

* Antes do MySQL 5.7.28, o MySQL utiliza a biblioteca yaSSL para a edição comunitária e OpenSSL para a edição empresarial.

A partir do MySQL 5.7.28, o MySQL usa apenas o OpenSSL com seus cifradores TLS mais fortes, que são mais caros em termos de desempenho.

A atualização para o MySQL 8.0 a partir do MySQL 5.7.28 ou versões anteriores pode causar uma regressão no desempenho do TLS.

*Mediação*: Nenhuma (se o TLS for necessário por razões de segurança)

A instrumentação do [Performance Schema (PFS)] (performance-schema.html "Chapter 29 MySQL Performance Schema") é muito mais ampla no 8.0 do que no 5.7:

* O PFS não pode ser desativado no MySQL 8.0, mas pode ser desativado. Alguns instrumentos de esquema de desempenho ainda existirão mesmo quando desativado, mas o custo será menor.

*Mediação*: Configure performance_schema = OFF na versão 8.0, ou desative a instrumentação do esquema de desempenho com maior granularidade se for necessário algum, mas não todos, os recursos da PFS.

A opção de truncar espaços de tabela de desfazer é habilitada por padrão no 8.0, o que pode impactar significativamente o desempenho:

* Historicamente, o InnoDB armazenava os registros de desfazer nos espaços de tabela do sistema, mas não havia nenhuma maneira de recuperar o espaço usado pelos registros de desfazer. O espaço de tabela do sistema só crescia e não diminuía, e essa característica inspirou solicitações de recursos para corrigir isso.

O MySQL 8.0 mudou o log de desfazer para tabelas separadas, o que permite tanto o corte manual quanto o automático do log de desfazer.

No entanto, a auto-truncção tem um custo de desempenho permanente e pode potencialmente causar travamentos.

*Mediação*: Configure innodb_undo_log_truncate = OFF na versão 8.0 e, se necessário, trunque manualmente os registros de desfazer. Para informações relacionadas, consulte o artigo "Truncar espaços de tabelas de desfazer".

As classes de caracteres `[[:alpha:]]` ou `[[:digit:]]` não funcionam tão bem com funções de expressão regular, como `REGEXP()` e `RLIKE()` no MySQL 8.0, como faziam no MySQL 5.7. Isso ocorre devido à substituição, no MySQL 8.0, da biblioteca de expressão regular Spencer pela biblioteca ICU, que usa UTF-16 internamente.

*Mediação*: Em vez de `[[:alpha:]]`, use `[a-zA-Z]`; em vez de `[[:digit:]]`, use `[0-9]`.