## 3.5 Alterações no MySQL 8.0

Antes de atualizar para o MySQL 8.0, revise as alterações descritas nesta seção para identificar aquelas que se aplicam à sua instalação e aplicações atuais do MySQL. Realize as ações recomendadas.

As alterações marcadas como **Alterações incompatíveis** são incompatibilidades com versões anteriores do MySQL e podem exigir sua atenção *antes da atualização*. Nosso objetivo é evitar essas alterações, mas, ocasionalmente, elas são necessárias para corrigir problemas que seriam piores do que uma incompatibilidade entre as versões. Se um problema de atualização aplicável à sua instalação envolver uma incompatibilidade, siga as instruções fornecidas na descrição.

- Alterações no Dicionário de Dados
- caching\_sha2\_password como o plugin de autenticação preferido
- Alterações na configuração
- Alterações no servidor
- Alterações no InnoDB
- Alterações no SQL
- Mudanças nos padrões de servidor padrão
- Regressões de desempenho válidas

### Alterações no Dicionário de Dados

O MySQL Server 8.0 incorpora um dicionário de dados global que contém informações sobre os objetos do banco de dados em tabelas transacionais. Em versões anteriores do MySQL, os dados do dicionário eram armazenados em arquivos de metadados e em tabelas de sistema não transacionais. Como resultado, o procedimento de atualização exige que você verifique a prontidão da atualização da sua instalação, verificando os pré-requisitos específicos. Para mais informações, consulte a Seção 3.6, “Preparando sua instalação para atualização”. Um servidor habilitado para dicionário de dados implica algumas diferenças operacionais gerais; consulte a Seção 16.7, “Diferenças no uso do dicionário de dados”.

### caching\_sha2\_password como o plugin de autenticação preferido

Os plugins de autenticação `caching_sha2_password` e `sha256_password` oferecem criptografia de senha mais segura do que o plugin `mysql_native_password`, e o `caching_sha2_password` oferece melhor desempenho do que o `sha256_password`. Devido a essas características de segurança e desempenho superiores do `caching_sha2_password`, ele é, a partir do MySQL 8.0, o plugin de autenticação preferido, e também é o plugin de autenticação padrão em vez do `mysql_native_password`. Essa mudança afeta tanto o servidor quanto a biblioteca de cliente `libmysqlclient`:

- Para o servidor, o valor padrão da variável de sistema `default_authentication_plugin` muda de `mysql_native_password` para `caching_sha2_password`.

  Essa alteração só se aplica a novas contas criadas após a instalação ou atualização para o MySQL 8.0 ou superior. Para contas já existentes em uma instalação atualizada, seu plugin de autenticação permanece inalterado. Os usuários existentes que desejam mudar para `caching_sha2_password` podem fazer isso usando a declaração `ALTER USER`:

  ```
  ALTER USER user
    IDENTIFIED WITH caching_sha2_password
    BY 'password';
  ```

- A biblioteca `libmysqlclient` trata o `caching_sha2_password` como o plugin de autenticação padrão, em vez do `mysql_native_password`.

As seções a seguir discutem as implicações do papel mais proeminente do `caching_sha2_password`:

- Problemas de compatibilidade e soluções para caching\_sha2\_password
- Clientes e Conectores compatíveis com caching\_sha2\_password
- caching\_sha2\_password e a conta administrativa raiz
- caching\_sha2\_password e replicação

#### Problemas de compatibilidade e soluções para caching\_sha2\_password

Importante

Se a sua instalação do MySQL deve atender clientes anteriores à versão 8.0 e você encontrar problemas de compatibilidade após a atualização para o MySQL 8.0 ou superior, a maneira mais simples de resolver esses problemas e restaurar a compatibilidade pré-8.0 é reconfigurar o servidor para retornar ao plugin de autenticação padrão anterior (`mysql_native_password`). Por exemplo, use essas linhas no arquivo de opção do servidor:

```
[mysqld]
default_authentication_plugin=mysql_native_password
```

Essa configuração permite que os clientes anteriores à versão 8.0 se conectem aos servidores 8.0 até que os clientes e conectores em uso na sua instalação sejam atualizados para saber sobre `caching_sha2_password`. No entanto, essa configuração deve ser vista como temporária, não como uma solução de longo prazo ou permanente, pois faz com que novas contas criadas com a configuração em vigor desistam da segurança de autenticação aprimorada fornecida por `caching_sha2_password`.

O uso de `caching_sha2_password` oferece uma criptografia de senha mais segura do que `mysql_native_password` (e, consequentemente, uma autenticação de conexão com o cliente melhorada). No entanto, ele também tem implicações de compatibilidade que podem afetar as instalações do MySQL existentes:

- Clientes e conectores que não foram atualizados para saber sobre `caching_sha2_password` podem ter problemas para se conectar a um servidor MySQL 8.0 configurado com `caching_sha2_password` como o plugin de autenticação padrão, mesmo para usar contas que não se autenticam com `caching_sha2_password`. Esse problema ocorre porque o servidor especifica o nome do seu plugin de autenticação padrão para os clientes. Se um cliente ou conector é baseado em uma implementação de protocolo cliente/servidor que não lida adequadamente com um plugin de autenticação padrão não reconhecido, ele pode falhar com um erro como um dos seguintes:

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

  Para obter informações sobre como escrever conectores para lidar de forma elegante com solicitações do servidor para plugins de autenticação padrão desconhecidos, consulte Considerações sobre a escrita de Conectores de Plugin de Autenticação.

- Os clientes que utilizam uma conta que se autentica com `caching_sha2_password` devem usar uma conexão segura (feita usando TCP com credenciais TLS/SSL, um arquivo de soquete Unix ou memória compartilhada) ou uma conexão não criptografada que suporte a troca de senhas usando um par de chaves RSA. Este requisito de segurança não se aplica a `mysql_native_passsword`, portanto, a transição para `caching_sha2_password` pode exigir configuração adicional (consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Alinhavel SHA-2”). No entanto, as conexões de clientes no MySQL 8.0 preferem o uso de TLS/SSL por padrão, portanto, os clientes que já atendem a essa preferência podem não precisar de configuração adicional.

- Clientes e conectores que não foram atualizados para saber sobre `caching_sha2_password` *não podem* se conectar a contas que se autenticam com `caching_sha2_password` porque eles não reconhecem esse plugin como válido. (Esta é uma instância particular de como os requisitos de compatibilidade de plugins de autenticação cliente/servidor se aplicam, conforme discutido em Compatibilidade de Plugins de Autenticação Cliente/Servidor.) Para contornar esse problema, faça um novo link dos clientes contra `libmysqlclient` a partir do MySQL 8.0 ou superior, ou obtenha um conector atualizado que reconheça `caching_sha2_password`.

- Como o `caching_sha2_password` também é agora o plugin de autenticação padrão na biblioteca de clientes `libmysqlclient`, a autenticação requer um percurso adicional no protocolo cliente/servidor para conexões de clientes do MySQL 8.0 para contas que usam `mysql_native_password` (o plugin de autenticação padrão anterior), a menos que o programa cliente seja invocado com uma opção `--default-auth=mysql_native_password`.

A biblioteca de clientes `libmysqlclient` para versões anteriores ao MySQL 8.0 é capaz de se conectar a servidores MySQL 8.0 (exceto para contas que autenticam-se com `caching_sha2_password`). Isso significa que clientes anteriores ao 8.0 baseados em `libmysqlclient` também devem ser capazes de se conectar. Exemplos:

- Clientes padrão do MySQL, como **mysql** e **mysqladmin**, são baseados em `libmysqlclient`.

- O driver DBD::mysql para Perl DBI é baseado em `libmysqlclient`.

- O MySQL Connector/Python tem um módulo de extensão C que é baseado em `libmysqlclient`. Para usá-lo, inclua a opção `use_pure=False` no momento da conexão.

Quando uma instalação existente do MySQL 8.0 é atualizada para o MySQL 8.0.4 ou superior, alguns clientes baseados no `libmysqlclient` mais antigos podem ser atualizados “automática”mente se estiverem vinculados dinamicamente, porque eles usam a nova biblioteca de clientes instalada pelo upgrade. Por exemplo, se o driver DBD::mysql para Perl DBI usa vinculação dinâmica, ele pode usar o `libmysqlclient` no lugar após uma atualização para o MySQL 8.0.4 ou superior, com este resultado:

- Antes da atualização, os scripts do DBI que utilizam o DBD::mysql podem se conectar a um servidor MySQL 8.0, exceto para contas que se autenticam com `caching_sha2_password`.

- Após a atualização, os mesmos scripts também poderão usar contas `caching_sha2_password`.

No entanto, os resultados anteriores ocorrem porque as instâncias `libmysqlclient` das instalações do MySQL 8.0 anteriores à versão 8.0.4 são binariamente compatíveis: ambas usam um número de versão da biblioteca compartilhada maior que 21. Para clientes vinculados ao `libmysqlclient` do MySQL 5.7 ou versões anteriores, eles se conectam a uma biblioteca compartilhada com um número de versão diferente que não é binariamente compatível. Neste caso, o cliente deve ser recompilado contra `libmysqlclient` a partir de 8.0.4 ou superior para obter total compatibilidade com os servidores do MySQL 8.0 e as contas `caching_sha2_password`.

O MySQL Connector/J 5.1 a 8.0.8 pode se conectar a servidores MySQL 8.0, exceto para contas que se autenticam com `caching_sha2_password`. (É necessário o Connector/J 8.0.9 ou superior para se conectar às contas `caching_sha2_password`.)

Os clientes que utilizam uma implementação do protocolo cliente/servidor diferente de `libmysqlclient` podem precisar ser atualizados para uma versão mais recente que entenda o novo plugin de autenticação. Por exemplo, no PHP, a conectividade com o MySQL geralmente é baseada em `mysqlnd`, que atualmente não conhece `caching_sha2_password`. Até que uma versão atualizada de `mysqlnd` esteja disponível, a maneira de permitir que os clientes PHP se conectem ao MySQL 8.0 é reconfigurar o servidor para reverter para `mysql_native_password` como o plugin de autenticação padrão, conforme discutido anteriormente.

Se um cliente ou conector suportar uma opção para especificar explicitamente um plugin de autenticação padrão, use-a para nomear um plugin diferente de `caching_sha2_password`. Exemplos:

- Alguns clientes do MySQL suportam a opção `--default-auth`. (Clientes padrão do MySQL, como **mysql** e **mysqladmin**, suportam essa opção, mas podem se conectar com sucesso a servidores 8.0 sem ela. No entanto, outros clientes podem suportar uma opção semelhante. Se for o caso, vale a pena tentar.)

- Os programas que utilizam a API C `libmysqlclient` podem chamar a função `mysql_options()` com a opção `MYSQL_DEFAULT_AUTH`.

- Os scripts do MySQL Connector/Python que utilizam a implementação nativa do protocolo cliente/servidor do Python podem especificar a opção de conexão `auth_plugin`. (Alternativamente, use a Extensão C do Connector/Python, que é capaz de se conectar aos servidores MySQL 8.0 sem a necessidade de `auth_plugin`.)

#### Clientes e Conectores compatíveis com caching\_sha2\_password

Se houver um cliente ou conector atualizado para saber sobre `caching_sha2_password`, usar esse é a melhor maneira de garantir a compatibilidade ao se conectar a um servidor MySQL 8.0 configurado com `caching_sha2_password` como o plugin de autenticação padrão.

Esses clientes e conectores foram atualizados para suportar `caching_sha2_password`:

- A biblioteca de clientes `libmysqlclient` no MySQL 8.0 (8.0.4 ou superior). Clientes padrão do MySQL, como **mysql** e **mysqladmin**, são baseados em `libmysqlclient`, portanto, também são compatíveis.

- A biblioteca de clientes `libmysqlclient` no MySQL 5.7 (5.7.23 ou superior). Clientes padrão do MySQL, como **mysql** e **mysqladmin**, são baseados em `libmysqlclient`, portanto, também são compatíveis.

- MySQL Connector/C++ 1.1.11 ou superior ou 8.0.7 ou superior.

- MySQL Connector/J 8.0.9 ou superior.

- MySQL Connector/NET 8.0.10 ou superior (através do protocolo MySQL clássico).

- MySQL Connector/Node.js 8.0.9 ou superior.

- PHP: a extensão X DevAPI PHP (mysql\_xdevapi) suporta `caching_sha2_password`.

  PHP: as extensões PDO\_MySQL e ext/mysqli não suportam `caching_sha2_password`. Além disso, quando usadas com versões do PHP anteriores a 7.1.16 e PHP 7.2 antes de 7.2.4, elas não conseguem se conectar com `default_authentication_plugin=caching_sha2_password`, mesmo que `caching_sha2_password` não seja usado.

#### caching\_sha2\_password e a conta administrativa raiz

Para as atualizações para o MySQL 8.0, o plugin de autenticação para contas existentes permanece inalterado, incluindo o plugin para a conta administrativa `'root'@'localhost'`.

Para novas instalações do MySQL 8.0, ao inicializar o diretório de dados (usando as instruções na Seção 2.9.1, “Inicializando o Diretório de Dados”), a conta `'root'@'localhost'` é criada, e essa conta usa `caching_sha2_password` por padrão. Para se conectar ao servidor após a inicialização do diretório de dados, você deve, portanto, usar um cliente ou conector que suporte `caching_sha2_password`. Se você puder fazer isso, mas prefere que a conta `root` use `mysql_native_password` após a instalação, instale o MySQL e inicie o diretório de dados como de costume. Em seguida, conecte-se ao servidor como `root` e use `ALTER USER` da seguinte forma para alterar o plugin de autenticação da conta e a senha:

```
ALTER USER 'root'@'localhost'
  IDENTIFIED WITH mysql_native_password
  BY 'password';
```

Se o cliente ou o conector que você usa ainda não suportar `caching_sha2_password`, você pode usar um procedimento de inicialização de diretório de dados modificado que associa a conta `root` com `mysql_native_password` assim que a conta for criada. Para fazer isso, use uma das seguintes técnicas:

- Forneça uma opção `--default-authentication-plugin=mysql_native_password` junto com `--initialize` ou `--initialize-insecure`.

- Defina `default_authentication_plugin` para `mysql_native_password` em um arquivo de opções e nomeie esse arquivo de opções usando uma opção `--defaults-file` juntamente com `--initialize` ou `--initialize-insecure`. (Neste caso, se você continuar a usar esse arquivo de opções para inicializações subsequentes do servidor, novas contas serão criadas com `mysql_native_password` em vez de `caching_sha2_password`, a menos que você remova a configuração `default_authentication_plugin` do arquivo de opções.)

#### caching\_sha2\_password e replicação

Em cenários de replicação nos quais todos os servidores foram atualizados para o MySQL 8.0.4 ou superior, as conexões de replica para os servidores de origem podem usar contas que se autenticam com `caching_sha2_password`. Para essas conexões, o mesmo requisito se aplica aos outros clientes que usam contas que se autenticam com `caching_sha2_password`: Use uma conexão segura ou troca de senha baseada em RSA.

Para se conectar a uma conta `caching_sha2_password` para replicação de origem/replica:

- Use qualquer uma das seguintes opções `CHANGE MASTER TO`:

  ```
  MASTER_SSL = 1
  GET_MASTER_PUBLIC_KEY = 1
  MASTER_PUBLIC_KEY_PATH='path to RSA public key file'
  ```

- Alternativamente, você pode usar as opções relacionadas à chave pública RSA se as chaves necessárias forem fornecidas durante a inicialização do servidor.

Para se conectar a uma conta `caching_sha2_password` para a Replicação em Grupo:

- Para o MySQL construído com o OpenSSL, defina qualquer uma das seguintes variáveis de sistema:

  ```
  SET GLOBAL group_replication_recovery_use_ssl = ON;
  SET GLOBAL group_replication_recovery_get_public_key = 1;
  SET GLOBAL group_replication_recovery_public_key_path = 'path to RSA public key file';
  ```

- Alternativamente, você pode usar as opções relacionadas à chave pública RSA se as chaves necessárias forem fornecidas durante a inicialização do servidor.

### Alterações na configuração

- **Mudança incompatível**: Agora, o mecanismo de armazenamento MySQL é responsável por fornecer seu próprio manipulador de particionamento, e o servidor MySQL não oferece mais suporte genérico para particionamento. `InnoDB` e `NDB` são os únicos mecanismos de armazenamento que fornecem um manipulador de particionamento nativo que é suportado no MySQL 8.0. Uma tabela particionada usando qualquer outro mecanismo de armazenamento deve ser alterada — ou para convertê-la para `InnoDB` ou `NDB`, ou para removê-la — *antes* de fazer a atualização do servidor, caso contrário, ela não poderá ser usada depois.

  Para obter informações sobre a conversão de tabelas `MyISAM` para `InnoDB`, consulte a Seção 17.6.1.5, “Conversão de tabelas de MyISAM para InnoDB”.

  Uma declaração de criação de tabela que resultaria em uma tabela particionada usando um mecanismo de armazenamento sem suporte a tal falha com um erro (ER\_CHECK\_NOT\_IMPLEMENTED) no MySQL 8.0. Se você importar bancos de dados de um arquivo de dump criado no MySQL 5.7 (ou versões anteriores) usando **mysqldump** para um servidor MySQL 8.0, você deve garantir que quaisquer declarações que criem tabelas particionadas também não especifiquem um mecanismo de armazenamento não suportado, removendo quaisquer referências à partição ou especificando o mecanismo de armazenamento como `InnoDB` ou permitindo que ele seja definido como `InnoDB` por padrão.

  Nota

  O procedimento descrito na Seção 3.6, “Preparando sua instalação para atualização”, descreve como identificar tabelas particionadas que precisam ser alteradas antes da atualização para o MySQL 8.0.

  Consulte a Seção 26.6.2, “Limitações de Partição Relacionadas aos Motores de Armazenamento”, para obter mais informações.

- **Mudança incompatível**: Vários códigos de erro do servidor não são usados e foram removidos (para uma lista, consulte Recursos removidos no MySQL 8.0). As aplicações que testam especificamente para qualquer um deles devem ser atualizadas.

- **Mudança importante**: O conjunto de caracteres padrão mudou de `latin1` para `utf8mb4`. Essas variáveis de sistema são afetadas:

  - O valor padrão das variáveis de sistema `character_set_server` e `character_set_database` mudou de `latin1` para `utf8mb4`.

  - O valor padrão das variáveis de sistema `collation_server` e `collation_database` mudou de `latin1_swedish_ci` para `utf8mb4_0900_ai_ci`.

  Como resultado, o conjunto de caracteres padrão e a ordenação para novos objetos diferem dos anteriores, a menos que um conjunto de caracteres e uma ordenação explícitos sejam especificados. Isso inclui bancos de dados e objetos dentro deles, como tabelas, visualizações e programas armazenados. Supondo que os padrões anteriores foram usados, uma maneira de preservá-los é iniciar o servidor com essas linhas no arquivo `my.cnf`:

  ```
  [mysqld]
  character_set_server=latin1
  collation_server=latin1_swedish_ci
  ```

  Em um ambiente replicado, ao fazer a atualização do MySQL 5.7 para o 8.0, é recomendável alterar o conjunto de caracteres padrão de volta ao conjunto de caracteres usado no MySQL 5.7 antes da atualização. Após a conclusão da atualização, o conjunto de caracteres padrão pode ser alterado para `utf8mb4`.

  Além disso, você deve estar ciente de que o MySQL 8.0 impõe verificações sobre caracteres permitidos em um conjunto de caracteres específico, o que o MySQL 5.7 não faz; esse é um problema conhecido. Isso significa que, antes de tentar fazer a atualização, você deve garantir que nenhum comentário contenha caracteres que não estejam definidos para o conjunto de caracteres em uso. Você pode corrigir isso de duas maneiras:

  - Altere o conjunto de caracteres para um que inclua o(s) caractere(s) em questão.

  - Remova o(s) caractere(s) ofensivo(s).

  O que precede se aplica a comentários de tabela, arquivo e índice.

- **Mudança incompatível**: A partir do MySQL 8.0.11, é proibido iniciar o servidor com uma configuração `lower_case_table_names` diferente daquela usada quando o servidor foi inicializado. A restrição é necessária porque as codificações usadas por vários campos de tabelas do dicionário de dados são baseadas na configuração `lower_case_table_names` definida quando o servidor foi inicializado, e reiniciar o servidor com uma configuração diferente introduziria inconsistências em relação à ordem e comparação dos identificadores.

### Alterações no servidor

- No MySQL 8.0.11, várias funcionalidades desatualizadas relacionadas à gestão de contas foram removidas, como o uso da instrução `GRANT` para modificar características não de privilégio das contas de usuário, o modo SQL `NO_AUTO_CREATE_USER`, a função `PASSWORD()` e a variável de sistema `old_passwords`.

  A replicação de declarações do MySQL 5.7 para o 8.0 que se referem a essas funcionalidades removidas pode causar falha na replicação. As aplicações que utilizam qualquer uma das funcionalidades removidas devem ser revisadas para evitar essas funcionalidades e usar alternativas quando possível, conforme descrito nas funcionalidades removidas no MySQL 8.0.

  Para evitar o fracasso de uma startup no MySQL 8.0, remova qualquer instância de `NO_AUTO_CREATE_USER` das configurações da variável de sistema `sql_mode` nos arquivos de opções do MySQL.

  Carregar um arquivo de dump que inclui o modo `NO_AUTO_CREATE_USER` SQL nas definições de programas armazenados em um servidor MySQL 8.0 causa uma falha. A partir do MySQL 5.7.24 e do MySQL 8.0.13, o **mysqldump** remove `NO_AUTO_CREATE_USER` das definições de programas armazenados. Arquivos de dump criados com uma versão anterior do `mysqldump` devem ser modificados manualmente para remover as instâncias de `NO_AUTO_CREATE_USER`.

- No MySQL 8.0.11, esses modos de compatibilidade de SQL obsoletos foram removidos: `DB2`, `MAXDB`, `MSSQL`, `MYSQL323`, `MYSQL40`, `ORACLE`, `POSTGRESQL`, `NO_FIELD_OPTIONS`, `NO_KEY_OPTIONS`, `NO_TABLE_OPTIONS`. Eles não podem mais ser atribuídos à variável de sistema `sql_mode` ou usados como valores permitidos para a opção **mysqldump** `--compatible`.

  A remoção de `MAXDB` significa que o tipo de dados `TIMESTAMP` para `CREATE TABLE` ou `ALTER TABLE` não é mais tratado como `DATETIME`.

  A replicação de declarações do MySQL 5.7 para 8.0 que se referem aos modos de SQL removidos pode causar falha na replicação. Isso inclui a replicação de declarações `CREATE` para programas armazenados (procedimentos e funções armazenados, gatilhos e eventos) que são executados enquanto o valor atual de `sql_mode` inclui qualquer um dos modos removidos. As aplicações que utilizam qualquer um dos modos removidos devem ser revisadas para evitar isso.

- O texto de muitas mensagens de erro do MySQL 8.0 foi revisado e aprimorado para fornecer mais e melhor informações do que no MySQL 5.7. Se sua aplicação depende de conteúdo ou formatação específicas das mensagens de erro, você deve testar essas informações e estar preparado para atualizar a aplicação conforme necessário antes de realizar a atualização.

- A partir do MySQL 8.0.3, os tipos de dados espaciais permitem o atributo `SRID`, para indicar explicitamente o sistema de referência espacial (SRS) para os valores armazenados na coluna. Veja a Seção 13.4.1, “Tipos de Dados Espaciais”.

  Uma coluna espacial com o atributo explícito `SRID` é restrita ao SRID: a coluna aceita apenas valores com esse ID, e os índices `SPATIAL` na coluna passam a ser usados pelo otimizador. O otimizador ignora os índices `SPATIAL` em colunas espaciais sem o atributo `SRID`. Veja a Seção 10.3.3, “Otimização de Índices Espaciais”. Se você quiser que o otimizador considere os índices `SPATIAL` em colunas espaciais que não são restritas ao SRID, cada coluna deve ser modificada:

  - Verifique se todos os valores na coluna têm o mesmo SRID. Para determinar os SRIDs contidos em uma coluna de geometria `col_name`, use a seguinte consulta:

    ```
    SELECT DISTINCT ST_SRID(col_name) FROM tbl_name;
    ```

    Se a consulta retornar mais de uma linha, a coluna contém uma mistura de SRIDs. Nesse caso, modifique seu conteúdo para que todos os valores tenham o mesmo SRID.

  - Redefina a coluna para ter um atributo explícito `SRID`.

  - Recrie o índice `SPATIAL`.

- Várias funções espaciais foram removidas no MySQL 8.0.0 devido a uma mudança no namespace das funções espaciais que implementou um prefixo `ST_` para funções que realizam uma operação exata ou um prefixo `MBR` para funções que realizam uma operação com base em retângulos de delimitação mínima. O uso de funções espaciais removidas em definições de colunas geradas pode causar uma falha na atualização. Antes de atualizar, execute **mysqlcheck --check-upgrade** para funções espaciais removidas e substitua quaisquer que você encontrar por suas substituições nomeadas `ST_` ou `MBR`. Para uma lista de funções espaciais removidas, consulte Recursos removidos no MySQL 8.0.

- O privilégio `BACKUP_ADMIN` é concedido automaticamente aos usuários com o privilégio `RELOAD` ao realizar uma atualização local para o MySQL 8.0.3 ou superior.

- A partir do MySQL 8.0.13, devido às diferenças entre o modo de replicação baseado em linhas ou misto e o modo de replicação baseado em instruções, na forma como as tabelas temporárias são tratadas, há novas restrições para alternar o formato de registro binário em tempo de execução.

  - `SET @@SESSION.binlog_format` não pode ser usado se a sessão tiver tabelas temporárias abertas.

  - `SET @@global.binlog_format` e `SET @@persist.binlog_format` não podem ser usados se houver tabelas temporárias abertas em qualquer canal de replicação. `SET @@persist_only.binlog_format` é permitido se os canais de replicação tiverem tabelas temporárias abertas, pois, ao contrário de `PERSIST`, `PERSIST_ONLY` não modifica o valor da variável global de sistema em tempo de execução.

  - `SET @@global.binlog_format` e `SET @@persist.binlog_format` não podem ser usados se qualquer aplicativo de canal de replicação estiver em execução. Isso ocorre porque a alteração só tem efeito em um canal de replicação quando seu aplicativo é reiniciado, momento em que o canal de replicação pode ter tabelas temporárias abertas. Esse comportamento é mais restritivo do que antes. `SET @@persist_only.binlog_format` é permitido se qualquer aplicativo de canal de replicação estiver em execução.

  - A partir do MySQL 8.0.27, a configuração de um ajuste de sessão para `internal_tmp_mem_storage_engine` requer o privilégio `SESSION_VARIABLES_ADMIN` ou `SYSTEM_VARIABLES_ADMIN`.

  - A partir do MySQL 8.0.27, o plugin clone permite operações DDL concorrentes na instância do servidor MySQL doador enquanto uma operação de clonagem está em andamento. Anteriormente, um bloqueio de backup era mantido durante a operação de clonagem, impedindo operações DDL concorrentes no doador. Para reverter ao comportamento anterior de bloquear operações DDL concorrentes no doador durante uma operação de clonagem, habilite a variável `clone_block_ddl`. Consulte a Seção 7.6.7.4, “Clonagem e DDL Concorrente”.

- A partir do MySQL 8.0.30, os componentes do log de erro listados no valor `log_error_services` ao iniciar o servidor são carregados implicitamente no início da sequência de inicialização do MySQL Server. Se você instalou componentes de log de erro carregáveis anteriormente usando `INSTALL COMPONENT` e listou esses componentes em um ajuste `log_error_services` que é lido ao iniciar (de um arquivo de opção, por exemplo), sua configuração deve ser atualizada para evitar avisos de inicialização. Para mais informações, consulte Métodos de Configuração do Log de Erro.

### Alterações no InnoDB

- As visualizações `INFORMATION_SCHEMA` baseadas em tabelas de sistema `InnoDB` foram substituídas por visualizações internas do sistema em tabelas do dicionário de dados. As visualizações `InnoDB` `INFORMATION_SCHEMA` afetadas foram renomeadas:

  **Tabela 3.1: Nomes Renomeados de Visualizações do Esquema de Informações InnoDB**

  <table summary="Visões do esquema de informações InnoDB que foram renomeadas no MySQL 8.0."><thead><tr> <th>Antigo Nome</th> <th>Novo nome</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>INNODB_SYS_INDEXES</code>]</td> <td>[[PH_HTML_CODE_<code>INNODB_SYS_INDEXES</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>INNODB_SYS_TABLES</code>]</td> <td>[[PH_HTML_CODE_<code>INNODB_TABLES</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>INNODB_SYS_TABLESPACES</code>]</td> <td>[[PH_HTML_CODE_<code>INNODB_TABLESPACES</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>INNODB_SYS_TABLESTATS</code>]</td> <td>[[PH_HTML_CODE_<code>INNODB_TABLESTATS</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>INNODB_SYS_VIRTUAL</code>]</td> <td>[[PH_HTML_CODE_<code>INNODB_VIRTUAL</code>]</td> </tr><tr> <td>[[<code>INNODB_SYS_INDEXES</code>]]</td> <td>[[<code>INNODB_COLUMNS</code><code>INNODB_SYS_INDEXES</code>]</td> </tr><tr> <td>[[<code>INNODB_SYS_TABLES</code>]]</td> <td>[[<code>INNODB_TABLES</code>]]</td> </tr><tr> <td>[[<code>INNODB_SYS_TABLESPACES</code>]]</td> <td>[[<code>INNODB_TABLESPACES</code>]]</td> </tr><tr> <td>[[<code>INNODB_SYS_TABLESTATS</code>]]</td> <td>[[<code>INNODB_TABLESTATS</code>]]</td> </tr><tr> <td>[[<code>INNODB_SYS_VIRTUAL</code>]]</td> <td>[[<code>INNODB_VIRTUAL</code>]]</td> </tr></tbody></table>

  Após a atualização para o MySQL 8.0.3 ou superior, atualize quaisquer scripts que façam referência a nomes de visualizações anteriores `InnoDB` `INFORMATION_SCHEMA`.

- A versão da biblioteca zlib incluída no MySQL foi elevada da versão 1.2.3 para a versão 1.2.11.

  A função zlib `compressBound()` na versão zlib 1.2.11 retorna uma estimativa ligeiramente maior do tamanho do buffer necessário para comprimir um determinado comprimento de bytes do que a função zlib versão 1.2.3. A função `compressBound()` é chamada por funções `InnoDB` que determinam o tamanho máximo de linha permitido ao criar tabelas `InnoDB` comprimidas ou ao inserir e atualizar linhas em tabelas `InnoDB` comprimidas. Como resultado, as operações `CREATE TABLE ... ROW_FORMAT=COMPRESSED`, `INSERT` e `UPDATE` com tamanhos de linha muito próximos do tamanho máximo de linha que foram bem-sucedidas em versões anteriores podem agora falhar. Para evitar esse problema, teste as instruções `CREATE TABLE` para tabelas `InnoDB` comprimidas com linhas grandes em uma instância de teste do MySQL 8.0 antes de fazer a atualização.

- Com a introdução do recurso `--innodb-directories`, a localização dos arquivos de espaço de tabela e de espaço de tabela geral criados com um caminho absoluto ou em um local fora do diretório de dados deve ser adicionada ao valor do argumento `innodb_directories`. Caso contrário, o `InnoDB` não será capaz de localizar esses arquivos durante a recuperação. Para visualizar as localizações dos arquivos de espaço de tabela, consulte a tabela Schema de Informações `FILES`:

  ```
  SELECT TABLESPACE_NAME, FILE_NAME FROM INFORMATION_SCHEMA.FILES \G
  ```

- Os registros de desfazer não podem mais residir no espaço de tabela do sistema. No MySQL 8.0, os registros de desfazer residem em dois espaços de tabela de desfazer por padrão. Para obter mais informações, consulte a Seção 17.6.3.4, “Espaços de Tabela de Desfazer”.

  Ao atualizar do MySQL 5.7 para o MySQL 8.0, todas as tabelas de desfazer existentes na instância do MySQL 5.7 são removidas e substituídas por dois novos espaços de tabelas de desfazer padrão. Os espaços de tabelas de desfazer padrão são criados na localização definida pela variável `innodb_undo_directory`. Se a variável `innodb_undo_directory` estiver indefinida, os espaços de tabelas de desfazer são criados no diretório de dados. A atualização do MySQL 5.7 para o MySQL 8.0 requer um desligamento lento que garante que os espaços de tabelas de desfazer na instância do MySQL 5.7 estejam vazios, permitindo que sejam removidos com segurança.

  Ao atualizar para o MySQL 8.0.14 ou uma versão posterior a partir de uma versão anterior do MySQL 8.0, as tabelas de desfazer que existem na instância pré-atualização, resultantes de uma configuração `innodb_undo_tablespaces` maior que 2, são tratadas como tabelas de desfazer definidas pelo usuário, que podem ser desativadas e excluídas usando a sintaxe `ALTER UNDO TABLESPACE` e `DROP UNDO TABLESPACE`, respectivamente, após a atualização. A atualização dentro da série de versões do MySQL 8.0 nem sempre requer um desligamento lento, o que significa que as tabelas de desfazer existentes podem conter registros de desfazer. Portanto, as tabelas de desfazer existentes não são removidas pelo processo de atualização.

- **Mudança incompatível**: a partir do MySQL 8.0.17, a cláusula `CREATE TABLESPACE ... ADD DATAFILE` não permite referências circulares de diretórios. Por exemplo, a referência circular de diretório (`/../`) na seguinte declaração não é permitida:

  ```
  CREATE TABLESPACE ts1 ADD DATAFILE ts1.ibd 'any_directory/../ts1.ibd';
  ```

  Existe uma exceção à restrição no Linux, onde uma referência circular de diretório é permitida se o diretório anterior for um link simbólico. Por exemplo, o caminho do arquivo de dados no exemplo acima é permitido se `any_directory` for um link simbólico. (Ainda é permitido que os caminhos dos arquivos de dados comecem com '`../`'.)

  Para evitar problemas de atualização, remova quaisquer referências circulares de diretórios dos caminhos dos arquivos de dados do espaço de tabelas antes de atualizar para o MySQL 8.0.17 ou superior. Para inspecionar os caminhos do espaço de tabelas, execute a consulta na tabela Schema de Informações `INNODB_DATAFILES`.

- Devido a uma regressão introduzida no MySQL 8.0.14, a atualização local em um sistema de arquivos case-sensitive de um MySQL 5.7 ou uma versão do MySQL 8.0 anterior ao MySQL 8.0.14 para o MySQL 8.0.16 falhou para instâncias com tabelas particionadas e `lower_case_table_names=1`. O erro foi causado por uma incompatibilidade de caso relacionada aos nomes de arquivos das tabelas particionadas. A correção que introduziu a regressão foi revertida, o que permite que as atualizações do MySQL 8.0.17 de versões do MySQL 5.7 ou MySQL 8.0 anteriores ao MySQL 8.0.14 funcionem normalmente. No entanto, a regressão ainda está presente nas versões MySQL 8.0.14, 8.0.15 e 8.0.16.

  A atualização in-place em um sistema de arquivos case-sensitive de MySQL 8.0.14, 8.0.15 ou 8.0.16 para MySQL 8.0.17 falha com o seguinte erro ao iniciar o servidor após a atualização de binários ou pacotes para MySQL 8.0.17, se houver tabelas particionadas e `lower_case_table_names=1`:

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

  Se você encontrar esse erro ao atualizar para o MySQL 8.0.17, execute a solução alternativa a seguir:

  1. Reinicie o servidor com `--upgrade=force` para forçar a operação de atualização a prosseguir.

  2. Identifique os nomes de arquivos de tabela particionada com delimitadores de nome de partição em minúsculas `(#p#` ou `#sp#`):

     ```
     mysql> SELECT FILE_NAME FROM INFORMATION_SCHEMA.FILES WHERE FILE_NAME LIKE '%#p#%' OR FILE_NAME LIKE '%#sp#%';
     ```

  3. Para cada arquivo identificado, renomeie a tabela associada usando um nome temporário e, em seguida, renomeie a tabela de volta ao seu nome original.

     ```
     mysql> RENAME TABLE table_name TO temporary_table_name;
     mysql> RENAME TABLE temporary_table_name TO table_name;
     ```

  4. Verifique se não há delimitadores de nome de partição em maiúsculas ou minúsculas nos nomes dos arquivos de tabela particionados (deve ser retornado um conjunto de resultados vazio).

     ```
     mysql> SELECT FILE_NAME FROM INFORMATION_SCHEMA.FILES WHERE FILE_NAME LIKE '%#p#%' OR FILE_NAME LIKE '%#sp#%';
     Empty set (0.00 sec)
     ```

  5. Execute `ANALYZE TABLE` em cada tabela renomeada para atualizar as estatísticas do otimizador nas tabelas `mysql.innodb_index_stats` e `mysql.innodb_table_stats`.

  Devido à regressão ainda presente nas versões 8.0.14, 8.0.15 e 8.0.16 do MySQL, a importação de tabelas particionadas do MySQL 8.0.14, 8.0.15 ou 8.0.16 para o MySQL 8.0.17 não é suportada em sistemas de arquivos case-sensitive onde `lower_case_table_names=1`. Tentar fazê-lo resulta em um erro de “Tablespace is missing for table” (Tablespace está ausente para a tabela).

- O MySQL usa strings de delimitador ao construir nomes de espaço de tabela e nomes de arquivos para partições de tabela. Uma string de delimitador “ `#p#` ” precede os nomes de partição, e uma string de delimitador “ `#sp#` ” precede os nomes de subpartição, conforme mostrado:

  ```
        schema_name.table_name#p#partition_name#sp#subpartition_name
        table_name#p#partition_name#sp#subpartition_name.ibd
  ```

  Historicamente, as strings de delimitador eram maiúsculas (`#P#` e `#SP#`) em sistemas de arquivos sensíveis ao caso, como o Linux, e minúsculas (`#p#` e `#sp#`) em sistemas de arquivos insensíveis ao caso, como o Windows. A partir do MySQL 8.0.19, as strings de delimitador são minúsculas em todos os sistemas de arquivos. Essa mudança previne problemas ao migrar diretórios de dados entre sistemas de arquivos sensíveis ao caso e insensíveis ao caso. As strings de delimitador maiúsculas não são mais usadas.

  Além disso, os nomes dos espaços de partição e os nomes dos arquivos gerados com base nos nomes de partição ou subpartição especificados pelo usuário, que podem ser especificados em maiúsculas ou minúsculas, agora são gerados (e armazenados internamente) em minúsculas, independentemente da configuração `lower_case_table_names`, para garantir a insensibilidade à letra inicial. Por exemplo, se uma partição de tabela for criada com o nome `PART_1`, o nome do espaço de partição e o nome do arquivo são gerados em minúsculas:

  ```
        schema_name.table_name#p#part_1
        table_name#p#part_1.ibd
  ```

  Durante a atualização, o MySQL verifica e modifica, se necessário:

  - Divida os nomes dos arquivos no disco e no dicionário de dados para garantir delimitadores em minúsculas e nomes de partições.

  - Metadados da partição no dicionário de dados para questões relacionadas introduzidas por correções de bugs anteriores.

  - Dados de estatísticas `InnoDB` para problemas relacionados introduzidos por correções de bugs anteriores.

  Durante as operações de importação de tablespace, os nomes dos arquivos de tablespace de partição no disco são verificados e modificados, se necessário, para garantir delimitadores em minúsculas e nomes de partição.

- A partir do MySQL 8.0.21, um aviso é escrito no log de erro durante a inicialização ou ao fazer uma atualização do MySQL 5.7, se os arquivos de dados do espaço de tabela forem encontrados em diretórios desconhecidos. Os diretórios conhecidos são aqueles definidos pelas variáveis `datadir`, `innodb_data_home_dir` e `innodb_directories`. Para tornar um diretório conhecido, adicione-o à configuração `innodb_directories`. Tornar diretórios conhecidos garante que os arquivos de dados possam ser encontrados durante a recuperação de falhas. Para mais informações, consulte Recuperação de Falha Durante a Recuperação do Espaço de Tabela.

- **Mudança importante**: A partir do MySQL 8.0.30, a variável `innodb_redo_log_capacity` controla a quantidade de espaço em disco ocupada pelos arquivos de log de refazer. Com essa mudança, o número padrão de arquivos de log de refazer e sua localização também foram alterados. A partir do MySQL 8.0.30, `InnoDB` mantém 32 arquivos de log de refazer no diretório `#innodb_redo` no diretório de dados. Anteriormente, `InnoDB` criava dois arquivos de log de refazer no diretório de dados por padrão, e o número e o tamanho dos arquivos de log de refazer eram controlados pelas variáveis `innodb_log_files_in_group` e `innodb_log_file_size`. Essas duas variáveis agora estão desatualizadas.

  Quando a configuração `innodb_redo_log_capacity` é definida, as configurações `innodb_log_files_in_group` e `innodb_log_file_size` são ignoradas; caso contrário, essas configurações são usadas para calcular a configuração `innodb_redo_log_capacity` (`innodb_log_files_in_group` \* `innodb_log_file_size` = `innodb_redo_log_capacity`). Se nenhuma dessas variáveis for definida, a capacidade do log de refazer é definida pelo valor padrão da `innodb_redo_log_capacity`, que é de 104857600 bytes (100 MB).

  Como é geralmente exigido para qualquer atualização, essa mudança requer um desligamento limpo antes da atualização.

  Para obter mais informações sobre esse recurso, consulte a Seção 17.6.5, “Registro de Refazer”.

- Antes do MySQL 5.7.35, não havia limitação de tamanho para índices em tabelas com formato de linha redundante ou compacto. A partir do MySQL 5.7.35, o limite é de 767 bytes. Uma atualização de uma versão do MySQL antes de 5.7.35 para o MySQL 8.0 pode produzir tabelas inacessíveis. Se uma tabela com formato de linha redundante ou compacto tiver um índice maior que 767 bytes, exclua o índice e recrie-o antes de fazer a atualização para o MySQL 8.0. A mensagem de erro é:

  ```
  mysql> ERROR 1709 (HY000): Index column size too large. The maximum column size is 767 bytes.
  ```

### Alterações no SQL

- **Mudança incompatível**: A partir do MySQL 8.0.13, os qualificadores desatualizados `ASC` ou `DESC` para as cláusulas `GROUP BY` foram removidos. Consultas que anteriormente dependiam da classificação `GROUP BY` podem produzir resultados diferentes das versões anteriores do MySQL. Para produzir uma determinada ordem de classificação, forneça uma cláusula `ORDER BY`.

  As consultas e definições de programas armazenados do MySQL 8.0.12 ou versões inferiores que utilizam os qualificadores `ASC` ou `DESC` para as cláusulas `GROUP BY` devem ser alteradas. Caso contrário, a atualização para o MySQL 8.0.13 ou versões superiores pode falhar, assim como a replicação para servidores replicados do MySQL 8.0.13 ou versões superiores.

- Alguns termos podem estar reservados no MySQL 8.0 que não estavam reservados no MySQL 5.7. Veja a Seção 11.3, “Palavras-chave e Palavras Reservadas”. Isso pode fazer com que palavras anteriormente usadas como identificadores se tornem ilegais. Para corrigir as declarações afetadas, use a citação de identificadores. Veja a Seção 11.2, “Nomes de Objetos do Esquema”.

- Após a atualização, recomenda-se que você teste as dicas de otimização especificadas no código do aplicativo para garantir que as dicas ainda sejam necessárias para alcançar a estratégia de otimização desejada. As melhorias no otimizador podem, às vezes, tornar certas dicas de otimização desnecessárias. Em alguns casos, uma dica de otimização desnecessária pode até ser contraproducente.

- **Mudança incompatível**: Em MySQL 5.7, especificar uma definição `FOREIGN KEY` para uma tabela `InnoDB` sem uma cláusula `CONSTRAINT symbol`, ou especificar a palavra-chave `CONSTRAINT` sem uma `symbol`, faz com que `InnoDB` use um nome de restrição gerado. Esse comportamento mudou no MySQL 8.0, com `InnoDB` usando o valor `FOREIGN KEY index_name` em vez de um nome gerado. Como os nomes de restrições devem ser únicos por esquema (banco de dados), a mudança causou erros devido a nomes de índices de chaves estrangeiras que não eram únicos por esquema. Para evitar tais erros, o novo comportamento de nomeação de restrições foi revertido no MySQL 8.0.16, e `InnoDB` usa novamente um nome de restrição gerado.

  Para garantir a consistência com `InnoDB`, as versões de `NDB` baseadas no MySQL 8.0.16 ou superior utilizam um nome de restrição gerado se a cláusula `CONSTRAINT symbol` não for especificada ou se a palavra-chave `CONSTRAINT` for especificada sem um `symbol`. As versões de `NDB` baseadas no MySQL 5.7 e em versões anteriores do MySQL 8.0 utilizavam o valor `FOREIGN KEY index_name`.

  As mudanças descritas acima podem introduzir incompatibilidades para aplicativos que dependem do comportamento anterior de nomeação da restrição de chave estrangeira.

- O controle de fluxo das funções de controle de variáveis do sistema do MySQL, como `IFNULL()` e `CASE()`, mudou no MySQL 8.0.22; os valores das variáveis do sistema agora são tratados como valores de coluna do mesmo caractere e collation, em vez de como constantes. Algumas consultas que usavam essas funções com variáveis do sistema que anteriormente eram bem-sucedidas podem ser rejeitadas posteriormente com a mensagem "Combinação ilegal de collations". Nesses casos, converta a variável do sistema para o conjunto de caracteres e collation corretos.

- **Mudança incompatível**: O MySQL 8.0.28 corrige um problema em versões anteriores do MySQL 8.0, em que a função `CONVERT()` às vezes permitia conversões inválidas de valores `BINARY` para conjuntos de caracteres não binários. As aplicações que podem ter dependido desse comportamento devem ser verificadas e, se necessário, modificadas antes da atualização.

  Em particular, quando `CONVERT()` foi usado como parte de uma expressão para uma coluna gerada com índice, a mudança no comportamento da função pode resultar em corrupção do índice após a atualização para o MySQL 8.0.28. Você pode evitar que isso aconteça seguindo estes passos:

  1. Antes de realizar a atualização, corrija qualquer dado de entrada inválido.

  2. Desça e, em seguida, recree o índice.

     Você também pode forçar a reconstrução de uma tabela usando `ALTER TABLE table FORCE`, em vez disso.

  3. Atualize o software MySQL.

  Se você não puder validar os dados de entrada previamente, não deve recriar o índice ou reconstruir a tabela até que realize a atualização para o MySQL 8.0.28.

### Mudanças nos padrões de servidor padrão

O MySQL 8.0 vem com configurações padrão aprimoradas, visando a melhor experiência possível desde o lançamento. Essas mudanças são impulsionadas pelo fato de que a tecnologia está avançando (máquinas têm mais CPUs, usam SSDs, etc.), mais dados estão sendo armazenados, o MySQL está evoluindo (InnoDB, Replicação de Grupo, AdminAPI), etc. A tabela a seguir resume as configurações padrão que foram alteradas para proporcionar a melhor experiência do MySQL para a maioria dos usuários.

<table summary="Resumo das alterações dos padrões do MySQL Server nesta versão."><thead><tr> <th>Opção/Parâmetro</th> <th>Antigo Padrão</th> <th>Novo padrão</th> </tr></thead><tbody><tr> <td><span class="emphasis"><em>Alterações no servidor</em></span></td> <td></td> <td></td> </tr><tr> <td>[[PH_HTML_CODE_<code>log_error_verbosity</code>]</td> <td>latim1</td> <td>utf8mb4</td> </tr><tr> <td>[[PH_HTML_CODE_<code>log_error_verbosity</code>]</td> <td>latin1_swedish_ci</td> <td>utf8mb4_0900_ai_ci</td> </tr><tr> <td>[[PH_HTML_CODE_<code>innodb_undo_tablespaces</code>]</td> <td>OFF</td> <td>ON</td> </tr><tr> <td>[[PH_HTML_CODE_<code>innodb_undo_log_truncate</code>]</td> <td>16 KB</td> <td>1 MB</td> </tr><tr> <td>[[PH_HTML_CODE_<code>innodb_flush_method</code>]</td> <td>OFF</td> <td>ON</td> </tr><tr> <td>[[PH_HTML_CODE_<code>innodb_autoinc_lock_mode</code>]</td> <td>-1 (autosize) alterado de : back_log = 50 + (max_connections / 5)</td> <td>-1 (autosize) alterado para : back_log = max_connections</td> </tr><tr> <td>[[PH_HTML_CODE_<code>innodb_flush_neighbors</code>]</td> <td>4194304 (4MB)</td> <td>67108864 (64MB)</td> </tr><tr> <td>[[PH_HTML_CODE_<code>innodb_max_dirty_pages_pct_lwm</code>]</td> <td>64</td> <td>1024</td> </tr><tr> <td>[[PH_HTML_CODE_<code>innodb_max_dirty_pages_pct</code>]</td> <td>OFF</td> <td>ON</td> </tr><tr> <td>[[PH_HTML_CODE_<code>performance-schema-instrument='wait/lock/metadata/sql/%=ON'</code>]</td> <td>2000</td> <td>4000</td> </tr><tr> <td>[[<code>log_error_verbosity</code>]]</td> <td>3 (Notas)</td> <td>2 (Aviso)</td> </tr><tr> <td>[[<code>collation_server</code><code>log_error_verbosity</code>]</td> <td>ON (5,7)</td> <td>OFF</td> </tr><tr> <td><span class="emphasis"><em>Alterações no InnoDB</em></span></td> <td></td> <td></td> </tr><tr> <td>[[<code>innodb_undo_tablespaces</code>]]</td> <td>0</td> <td>2</td> </tr><tr> <td>[[<code>innodb_undo_log_truncate</code>]]</td> <td>OFF</td> <td>ON</td> </tr><tr> <td>[[<code>innodb_flush_method</code>]]</td> <td>NULL</td> <td>fsync (Unix), sem buffer (Windows)</td> </tr><tr> <td>[[<code>innodb_autoinc_lock_mode</code>]]</td> <td>1 (consecutivo)</td> <td>2 (entrelaçado)</td> </tr><tr> <td>[[<code>innodb_flush_neighbors</code>]]</td> <td>1 (ativar)</td> <td>0 (desativar)</td> </tr><tr> <td>[[<code>innodb_max_dirty_pages_pct_lwm</code>]]</td> <td>0 (%)</td> <td>10 (%)</td> </tr><tr> <td>[[<code>innodb_max_dirty_pages_pct</code>]]</td> <td>75 (%)</td> <td>90 (%)</td> </tr><tr> <td><span class="emphasis"><em>Alterações no esquema de desempenho</em></span></td> <td></td> <td></td> </tr><tr> <td>[[<code>performance-schema-instrument='wait/lock/metadata/sql/%=ON'</code>]]</td> <td>OFF</td> <td>ON</td> </tr><tr> <td>[[<code>explicit_defaults_for_timestamp</code><code>log_error_verbosity</code>]</td> <td>OFF</td> <td>CONTADO</td> </tr><tr> <td>[[<code>explicit_defaults_for_timestamp</code><code>log_error_verbosity</code>]</td> <td>OFF</td> <td>ON</td> </tr><tr> <td>[[<code>explicit_defaults_for_timestamp</code><code>innodb_undo_tablespaces</code>]</td> <td>OFF</td> <td>ON</td> </tr><tr> <td>[[<code>explicit_defaults_for_timestamp</code><code>innodb_undo_log_truncate</code>]</td> <td>OFF</td> <td>ON</td> </tr><tr> <td><span class="emphasis"><em>Alterações de replicação</em></span></td> <td></td> <td></td> </tr><tr> <td>[[<code>explicit_defaults_for_timestamp</code><code>innodb_flush_method</code>]</td> <td>OFF</td> <td>ON</td> </tr><tr> <td>[[<code>explicit_defaults_for_timestamp</code><code>innodb_autoinc_lock_mode</code>]</td> <td>0</td> <td>1</td> </tr><tr> <td>[[<code>explicit_defaults_for_timestamp</code><code>innodb_flush_neighbors</code>]</td> <td>OFF</td> <td>ON</td> </tr><tr> <td>[[<code>explicit_defaults_for_timestamp</code><code>innodb_max_dirty_pages_pct_lwm</code>]</td> <td>0</td> <td>30</td> </tr><tr> <td>[[<code>explicit_defaults_for_timestamp</code><code>innodb_max_dirty_pages_pct</code>]</td> <td>ARQUIVO</td> <td>TABELA</td> </tr><tr> <td>[[<code>explicit_defaults_for_timestamp</code><code>performance-schema-instrument='wait/lock/metadata/sql/%=ON'</code>]</td> <td>ARQUIVO</td> <td>TABELA</td> </tr><tr> <td>[[<code>optimizer_trace_max_mem_size</code><code>log_error_verbosity</code>]</td> <td>OFF</td> <td>XXHASH64</td> </tr><tr> <td>[[<code>optimizer_trace_max_mem_size</code><code>log_error_verbosity</code>]</td> <td>INDEX_SCAN, TABLE_SCAN</td> <td>INDEX_SCAN, HASH_SCAN</td> </tr><tr> <td>[[<code>optimizer_trace_max_mem_size</code><code>innodb_undo_tablespaces</code>]</td> <td>16M</td> <td>128M</td> </tr><tr> <td>[[<code>optimizer_trace_max_mem_size</code><code>innodb_undo_log_truncate</code>]</td> <td>1000</td> <td>0</td> </tr><tr> <td><span class="emphasis"><em>Alterações na replicação em grupo</em></span></td> <td></td> <td></td> </tr><tr> <td>[[<code>optimizer_trace_max_mem_size</code><code>innodb_flush_method</code>]</td> <td>0</td> <td>3</td> </tr><tr> <td>[[<code>optimizer_trace_max_mem_size</code><code>innodb_autoinc_lock_mode</code>]</td> <td>ABORT_SERVER</td> <td>LEITURA_PROIBIDA</td> </tr><tr> <td>[[<code>optimizer_trace_max_mem_size</code><code>innodb_flush_neighbors</code>]</td> <td>0</td> <td>5</td> </tr></tbody></table>

Para obter mais informações sobre as opções ou variáveis adicionadas, consulte Mudanças de Opções e Variáveis para o MySQL 8.0, no *Referência da Versão do MySQL Server*.

As seções a seguir explicam as alterações nos padrões e qualquer impacto que possam ter em sua implantação.

**Padrões de servidor**

- O valor padrão da variável de sistema `character_set_server` e da opção de linha de comando `--character-set-server` mudou de `latin1` para `utf8mb4`. Este é o conjunto de caracteres padrão do servidor. Neste momento, o UTF8MB4 é o codificação de caracteres dominante para a web, e essa mudança facilita a vida da grande maioria dos usuários do MySQL. A atualização de 5.7 para 8.0 não altera o conjunto de caracteres para nenhum objeto de banco de dados existente, mas, a menos que você defina explicitamente `character_set_server` (ou seja, de volta ao valor anterior ou a um novo), um novo esquema usa `utf8mb4` por padrão. Recomendamos que você mude para `utf8mb4` sempre que possível.

- O valor padrão da variável de sistema `collation_server` e do argumento de linha de comando `--collation-server` mudou de `latin1_swedish_ci` para `utf8mb4_0900_ai_ci`. Esse é o collation padrão do servidor, a ordem dos caracteres em um conjunto de caracteres. Há uma relação entre collation e conjuntos de caracteres, pois cada conjunto de caracteres vem com uma lista de collation possíveis. A atualização de 5.7 para 8.0 não altera nenhuma collation para nenhum objeto de banco de dados existente, mas entra em vigor para novos objetos.

- O valor padrão da variável de sistema `explicit_defaults_for_timestamp` mudou de `OFF` (comportamento herdado do MySQL) para `ON` (comportamento padrão do SQL). Esta opção foi originalmente introduzida no 5.6 e foi `OFF` nos 5.6 e 5.7.

- O valor padrão da variável de sistema `optimizer_trace_max_mem_size` mudou de `16KB` para `1MB`. O valor padrão antigo fazia com que o rastreamento do otimizador fosse truncado para qualquer consulta não trivial. Essa mudança garante rastros úteis do otimizador para a maioria das consultas.

- O valor padrão da variável de sistema `validate_password_check_user_name` mudou de `OFF` para `ON`. Isso significa que, quando o plugin `validate_password` está habilitado, ele rejeita, por padrão, senhas que correspondem ao nome do usuário da sessão atual.

- O algoritmo de autoajuste para a variável de sistema `back_log` foi alterado. O valor para autoajuste (-1) agora é definido pelo valor de `max_connections`, que é maior do que o calculado por `50 + (max_connections / 5)`. As filas `back_log` aglomeram as solicitações de conexão IP entrantes em situações em que o servidor não consegue atender às solicitações entrantes. No pior dos casos, com o número de clientes `max_connections` tentando se reconectar ao mesmo tempo, por exemplo, após uma falha na rede, todos podem ser armazenados em buffer e os loops de rejeição e tentativa são evitados.

- O valor padrão da variável de sistema `max_allowed_packet` mudou de `4194304` (4M) para `67108864` (64M). A principal vantagem dessa maior configuração é a menor chance de receber erros sobre um inserção ou consulta maior que `max_allowed_packet`. Ela deve ser tão grande quanto o maior tipo de seção 13.3.4, “Os tipos BLOB e TEXT”, que você deseja usar. Para reverter ao comportamento anterior, defina `max_allowed_packet=4194304`.

- O valor padrão da variável de sistema `max_error_count` mudou de `64` para `1024`. Isso garante que o MySQL trate um número maior de avisos, como uma instrução UPDATE que afeta milhares de linhas e muitas delas geram avisos de conversão. É comum que muitas ferramentas façam atualizações em lote, para ajudar a reduzir o atraso na replicação. Ferramentas externas como pt-online-schema-change têm um padrão de 1000, e gh-ost tem um padrão de 100. O MySQL 8.0 cobre o histórico completo de erros para esses dois casos de uso. Não há alocações estáticas, então essa mudança afeta apenas o consumo de memória para instruções que geram muitos avisos.

- O valor padrão da variável de sistema `event_scheduler` mudou de `OFF` para `ON`. Em outras palavras, o agendamento de eventos está habilitado por padrão. Isso é um habilitador para novos recursos no SYS, por exemplo, "cancelar transações ociosas".

- O valor padrão da variável de sistema `table_open_cache` mudou de `2000` para `4000`. Esta é uma alteração menor que aumenta a concorrência de sessões no acesso à tabela.

- O valor padrão da variável de sistema `log_error_verbosity` mudou de `3` (Notas) para `2` (Aviso). O objetivo é tornar o log de erros do MySQL 8.0 menos verbose por padrão.

**Padrões do InnoDB**

- **Mudança incompatível** O valor padrão da variável de sistema `innodb_undo_tablespaces` mudou de `0` para `2`. Configura o número de espaços de tabelas de desfazer usados pelo InnoDB. No MySQL 8.0, o valor mínimo para `innodb_undo_tablespaces` é 2 e os segmentos de rollback não podem mais ser criados no espaço de tabelas do sistema. Portanto, este é um caso em que você não pode voltar ao comportamento do 5.7. O propósito desta mudança é poder truncar automaticamente os registros de desfazer (veja o próximo item), recuperando o espaço em disco usado por transações (ocasionais) longas, como um **mysqldump**.

- O valor padrão da variável de sistema `innodb_undo_log_truncate` mudou de `OFF` para `ON`. Quando habilitado, as tabelas de undo que excedem o valor limite definido por `innodb_max_undo_log_size` são marcadas para truncação. Somente as tabelas de undo podem ser truncadas. A truncação de logs de undo que residem no espaço de tabelas do sistema não é suportada. Uma atualização de 5.7 para 8.0 converte automaticamente o sistema para usar espaços de tabelas de undo, e usar o espaço de tabelas do sistema não é uma opção no 8.0.

- O valor padrão da variável de sistema `innodb_flush_method` mudou de `NULL` para `fsync` em sistemas semelhantes ao Unix e de `NULL` para `unbuffered` em sistemas Windows. Isso é mais uma questão de limpeza de terminologia e opções, sem qualquer impacto tangível. Para o Unix, essa é apenas uma mudança de documentação, pois o padrão era `fsync` também em 5.7 (o padrão `NULL` significava `fsync`). Da mesma forma, em Windows, o padrão `innodb_flush_method` `NULL` significava `async_unbuffered` em 5.7, e é substituído pelo padrão `unbuffered` em 8.0, que, em combinação com o padrão existente `innodb_use_native_aio=ON`, tem o mesmo efeito.

- **Mudança incompatível** O valor padrão da variável de sistema `innodb_autoinc_lock_mode` mudou de `1` (consecutivo) para `2` (interlaçado). A mudança para o modo de bloqueio interlaçado como configuração padrão reflete a mudança da replicação baseada em declarações para a replicação baseada em linhas como tipo de replicação padrão, o que ocorreu no MySQL 5.7. *Replicação baseada em declarações* requer o modo de bloqueio de autoincremento consecutivo para garantir que os valores de autoincremento sejam atribuídos em uma ordem previsível e repetiível para uma sequência dada de declarações SQL, enquanto a *replicação baseada em linhas* não é sensível à ordem de execução das declarações SQL. Assim, essa mudança é conhecida por ser incompatível com a replicação baseada em declarações e pode quebrar algumas aplicações ou suíte de testes geradas pelo usuário que dependem do autoincremento sequencial. O valor padrão anterior pode ser restaurado definindo `innodb_autoinc_lock_mode=1;`

- O valor padrão da variável de sistema `innodb_flush_neighbors` muda de `1` (ativado) para `0` (desativado). Isso é feito porque o I/O rápido (SSDs) é agora o padrão para implantação. Esperamos que, para a maioria dos usuários, isso resulte em um pequeno ganho de desempenho. Usuários que estão usando discos rígidos mais lentos podem notar uma perda de desempenho e são incentivados a retornar aos valores padrão anteriores, configurando `innodb_flush_neighbors=1`.

- O valor padrão da variável de sistema `innodb_max_dirty_pages_pct_lwm` mudou de `0` (%) para `10` (%). Com `innodb_max_dirty_pages_pct_lwm=10`, o InnoDB aumenta sua atividade de esvaziamento quando >10% do pool de buffers contém páginas modificadas (‘sujas’). O objetivo dessa mudança é compensar um pouco o desempenho máximo, em troca de um desempenho mais consistente.

- O valor padrão da variável de sistema `innodb_max_dirty_pages_pct` mudou de `75` (%) para `90` (%). Essa mudança se combina com a alteração de `innodb_max_dirty_pages_pct_lwm` e, juntas, garantem um comportamento suave de esvaziamento do InnoDB, evitando picos de esvaziamento. Para reverter ao comportamento anterior, defina `innodb_max_dirty_pages_pct=75` e `innodb_max_dirty_pages_pct_lwm=0`.

**Padrões de Schema de Desempenho**

- A instrumentação de Metadados de Schema de Desempenho (MDL) está ativada por padrão. O valor predefinido compilado para `performance-schema-instrument='wait/lock/metadata/sql/%=ON'` mudou de `OFF` para `ON`. Isso é uma habilitação para adicionar visualizações orientadas MDL em SYS.

- A instrumentação de Memória do Schema de Desempenho está ativada por padrão. O valor predefinido para `performance-schema-instrument='memory/%=COUNTED'` mudou de `OFF` para `COUNTED`. Isso é importante porque a contabilidade ficará incorreta se a instrumentação estiver ativada após o início do servidor, e você pode obter um saldo negativo por não ter alocado, mas ter detectado um espaço livre.

- A instrumentação de transações do Schema de desempenho está ativada por padrão. O valor predefinido compilado para `performance-schema-consumer-events-transactions-current=ON`, `performance-schema-consumer-events-transactions-history=ON` e `performance-schema-instrument='transaction%=ON'` foi alterado de `OFF` para `ON`.

**Padrões de replicação**

- O valor padrão da variável de sistema `log_bin` mudou de `OFF` para `ON`. Em outras palavras, o registro binário está habilitado por padrão. Quase todas as instalações em produção têm o log binário habilitado, pois é usado para replicação e recuperação em um ponto no tempo. Assim, ao habilitar o log binário por padrão, eliminamos uma etapa de configuração, e habilitá-lo mais tarde requer um reinício do **mysqld**. Habilitar por padrão também oferece uma melhor cobertura de testes e torna mais fácil identificar regressão de desempenho. Lembre-se de também definir `server_id` (veja a mudança seguinte). O comportamento padrão de 8.0 é como se você tivesse emitido `./mysqld --log-bin --server-id=1`. Se você estiver no 8.0 e quiser o comportamento do 5.7, pode emitir `./mysqld --skip-log-bin --server-id=0`.

- O valor padrão da variável de sistema `server_id` mudou de `0` para `1` (combinado com a mudança para `log_bin=ON`). O servidor pode ser iniciado com esse ID padrão, mas, na prática, você deve definir o `server-id` de acordo com a infraestrutura de replicação que está sendo implantada, para evitar a existência de IDs de servidor duplicados.

- O valor padrão da variável de sistema `log-slave-updates` mudou de `OFF` para `ON`. Isso faz com que uma replica registre eventos replicados em seu próprio log binário. Esta opção é necessária para a Replicação em Grupo e também garante o comportamento correto em várias configurações de cadeias de replicação, que se tornaram a norma hoje.

- O valor padrão da variável de sistema `expire_logs_days` mudou de `0` para `30`. O novo valor padrão `30` faz com que o **mysqld** elimine periodicamente os logs binários não utilizados que têm mais de 30 dias. Essa mudança ajuda a evitar o desperdício de espaço em disco em logs binários que não são mais necessários para fins de replicação ou recuperação. O valor antigo de `0` desativa qualquer purga automática de logs binários.

- O valor padrão das variáveis de sistema `master_info_repository` e `relay_log_info_repository` muda de `FILE` para `TABLE`. Assim, no 8.0, os metadados de replicação são armazenados no InnoDB por padrão. Isso aumenta a confiabilidade para tentar alcançar uma replicação segura contra falhas por padrão.

- O valor padrão da variável de sistema `transaction-write-set-extraction` mudou de `OFF` para `XXHASH64`. Essa mudança habilita os conjuntos de escrita de transações por padrão. Ao usar conjuntos de escrita de transações, a fonte precisa fazer um pouco mais de trabalho para gerar os conjuntos de escrita, mas o resultado é útil na detecção de conflitos. Esse é um requisito para a Replicação em Grupo e o novo padrão facilita a habilitação da paralelização da escrita do log binário na fonte para acelerar a replicação.

- O valor padrão da variável de sistema `slave_rows_search_algorithms` mudou de `INDEX_SCAN,TABLE_SCAN` para `INDEX_SCAN,HASH_SCAN`. Essa mudança acelera a replicação baseada em linhas, reduzindo o número de varreduras de tabela que o aplicativo de replicação precisa fazer para aplicar as alterações em uma tabela sem uma chave primária.

- O valor padrão da variável de sistema `slave_pending_jobs_size_max` mudou de `16M` para `128M`. Essa mudança aumenta a quantidade de memória disponível para réplicas multithread.

- O valor padrão da variável de sistema `gtid_executed_compression_period` mudou de `1000` para `0`. Essa mudança garante que a compressão da tabela `mysql.gtid_executed` ocorra apenas de forma implícita, conforme necessário.

**Padrões de Replicação em Grupo**

- O valor padrão de `group_replication_autorejoin_tries` mudou de 0 para 3, o que significa que a reinserção automática está habilitada por padrão. Esta variável de sistema especifica o número de tentativas que um membro faz para se reinserir automaticamente no grupo se for expulso ou se não conseguir entrar em contato com a maioria do grupo antes que o ajuste `group_replication_unreachable_majority_timeout` seja alcançado.

- O valor padrão de `group_replication_exit_state_action` mudou de `ABORT_SERVER` para `READ_ONLY`. Isso significa que, quando um membro sai do grupo, por exemplo, após uma falha na rede, a instância se torna somente de leitura, em vez de ser desligada.

- O valor padrão de `group_replication_member_expel_timeout` mudou de 0 para 5, o que significa que um membro suspeito de ter perdido o contato com o grupo é sujeito à expulsão 5 segundos após o período de detecção de 5 segundos.

A maioria desses valores padrão é razoavelmente boa tanto para ambientes de desenvolvimento quanto para produção. Uma exceção a isso é a opção `--innodb-dedicated-server`, cujo valor padrão permanece `OFF`, embora recomendação `ON` para ambientes de produção. A razão para optar por `OFF` é que ele torna ambientes compartilhados, como laptops de desenvolvedores, inutilizáveis, porque ele usa *toda* a memória que encontra.

Para ambientes de produção, recomendamos o uso de `--innodb-dedicated-server`, que determina valores para as seguintes variáveis do InnoDB (se não forem especificadas explicitamente), com base na memória disponível: `innodb_buffer_pool_size`, `innodb_log_file_size` e `innodb_flush_method`. Veja a Seção 17.8.12, “Habilitar Configuração Automática do InnoDB para um Servidor MySQL Dedicado”.

Embora as novas configurações padrão sejam as melhores opções para a maioria dos casos de uso, existem casos especiais, além de razões legadas, para usar as configurações padrão existentes da versão 5.7. Por exemplo, algumas pessoas preferem atualizar para a versão 8.0 com o menor número possível de alterações em seus aplicativos ou ambiente operacional. Recomendamos avaliar todas as novas configurações padrão e usar quantas puder. A maioria das novas configurações padrão pode ser testada na versão 5.7, então você pode validar as novas configurações padrão na produção da versão 5.7 antes de atualizar para a versão 8.0. Para as poucas configurações padrão em que você precisa do valor antigo da versão 5.7, defina a variável de configuração ou opção de inicialização correspondente em seu ambiente operacional.

O MySQL 8.0 possui a tabela `variables_info` do Gerenciamento de Desempenho, que mostra para cada variável do sistema a origem de onde ela foi definida mais recentemente, bem como sua faixa de valores. Isso fornece acesso SQL a tudo o que há para saber sobre uma variável de configuração e seus valores.

### Regressões de desempenho válidas

Espera-se que haja regressão no desempenho entre as versões 5.7 e 8.0 do MySQL. O MySQL 8.0 tem mais recursos, altera os valores padrão, é mais robusto e adiciona funcionalidades de segurança e informações diagnósticas adicionais. Aqui estão as razões válidas para as regreções entre essas versões, que incluem opções de mediação potenciais. Esta não é uma lista exaustiva.

Alterações relacionadas a valores padrão que mudam entre as versões 5.7 e 8.0 do MySQL:

- Os logs binários estão desativados por padrão no 5.7 e ativados por padrão no 8.0.

  *Mediação*: Desative o registro binário especificando a opção `--skip-log-bin` ou `--disable-log-bin` na inicialização.

- O conjunto de caracteres padrão mudou de `latin1` para `utf8mb4` na versão 8.0. Embora `utf8mb4` tenha um desempenho significativamente melhor na versão 8.0 do que na versão 5.7, `latin1` é mais rápido que `utf8mb4`.

  *Mediação*: Use `latin1` em 8.0 se `utf8mb4` não for necessário.

O Dicionário de Dados Transacionais (DDL atômico) foi introduzido no 8.0.

- Isso aumenta a robustez/fiabilidade em detrimento do desempenho do DDL (cargas intensivas de CREATE/DROP), mas não deve afetar a carga de DML (SELECT/INSERT/UPDATE/DELETE).

  *Mediação*: Nenhuma

Os cifradores/algoritmos TLS mais modernos usados a partir da versão 5.7.28 têm efeito quando o TLS (SSL) está habilitado (padrão):

- Antes do MySQL 5.7.28, o MySQL utiliza a biblioteca yaSSL para a edição comunitária e o OpenSSL para a edição empresarial.

  A partir do MySQL 5.7.28, o MySQL usa apenas o OpenSSL com seus cifradores TLS mais fortes, que são mais caros em termos de desempenho.

  A atualização para o MySQL 8.0 a partir do MySQL 5.7.28 ou versões anteriores pode causar uma regressão no desempenho do TLS.

  *Mediação*: Nenhuma (se o TLS for necessário por razões de segurança)

A instrumentação do Schema de Desempenho (PFS) é muito mais ampla no 8.0 do que no 5.7:

- O PFS não pode ser desativado no MySQL 8.0, mas pode ser desativado. Alguns instrumentos do esquema de desempenho ainda existirão mesmo quando desativados, mas o overhead será menor.

  *Mediação*: Configure performance\_schema = OFF na versão 8.0, ou desative a instrumentação do esquema de desempenho com maior granularidade se for necessário usar algumas, mas não todas, as funcionalidades do PFS.

A opção de truncar espaços de tabelas de desfazer está habilitada por padrão no 8.0, o que pode impactar significativamente o desempenho:

- Historicamente, o InnoDB armazenava os registros de desfazer nas tabelas do sistema, mas não havia como recuperar o espaço usado pelos registros de desfazer. O espaço das tabelas do sistema só crescia e não diminuía, e isso gerou solicitações de recursos para corrigir isso.

  O MySQL 8.0 transferiu o log de desfazer para tabelas separadas, o que permite a redução manual e automática do log de desfazer.

  No entanto, a truncação automática tem um custo de desempenho permanente e pode causar possíveis travamentos.

  *Mediação*: Configure innodb\_undo\_log\_truncate = OFF na versão 8.0 e trque os logs de desfazer manualmente conforme necessário. Para informações relacionadas, consulte Truncagem de Espaços de Tabelas de Desfazer.

As classes de caracteres `[[:alpha:]]` ou `[[:digit:]]` não funcionam tão bem com funções de expressão regular como `REGEXP()` e `RLIKE()` no MySQL 8.0 quanto faziam no MySQL 5.7. Isso ocorre devido à substituição na MySQL 8.0 da biblioteca de expressão regular Spencer pela biblioteca ICU, que usa UTF-16 internamente.

*Mediação*: Em vez de `[[:alpha:]]`, use `[a-zA-Z]`; em vez de `[[:digit:]]`, use `[0-9]`.
