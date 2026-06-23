## 17.13 Encriptação de dados em repouso do InnoDB

O `InnoDB` suporta criptografia de dados em repouso para espaços de tabela por arquivo, espaços de tabela gerais, o espaço de tabela do sistema `mysql`, registros de refazer e registros de desfazer.

A partir do MySQL 8.0.16, também é possível definir um padrão de criptografia para esquemas e espaços de tabela gerais, o que permite que os administradores de banco de dados controlem se as tabelas criadas nesses esquemas e espaços de tabela são criptografadas.

As características e capacidades de criptografia de dados em repouso do `InnoDB` são descritas nos seguintes tópicos desta seção.

* Encriptação de dados em repouso
* Requisitos de encriptação
* Definição de um padrão de encriptação para esquemas e tabelas gerais
* Encriptação de tabelas por arquivo
* Encriptação de tabelas gerais
* Encriptação de arquivos de escrita dupla
* Encriptação de tabelas de sistema do sistema mysql
* Encriptação de log de refazer
* Encriptação de log de desfazer
* Rotação da chave mestre
* Uso de encriptação e recuperação
* Exportação de tabelas criptografadas
* Encriptação e replicação
* Identificação de tabelas criptografadas e esquemas
* Monitoramento do progresso da encriptação
* Notas sobre o uso de encriptação
* Limitações de encriptação

### Sobre a criptografia de dados em repouso

`InnoDB` utiliza uma arquitetura de chave de criptografia de dois níveis, composta por uma chave de criptografia mestre e chaves de espaço de tabelas. Quando um espaço de tabelas é criptografado, uma chave de espaço de tabelas é criptografada e armazenada no cabeçalho do espaço de tabelas. Quando uma aplicação ou um usuário autenticado deseja acessar dados de espaço de tabelas criptografados, `InnoDB` utiliza uma chave de criptografia mestre para descriptografar a chave de espaço de tabelas. A versão descriptografada de uma chave de espaço de tabelas nunca muda, mas a chave de criptografia mestre pode ser alterada conforme necessário. Essa ação é referida como *rotação da chave mestre*.

O recurso de criptografia de dados em repouso depende de um componente ou plugin de chave de criptografia mestre para gerenciamento de chaves.

Todas as edições do MySQL fornecem um componente `component_keyring_file` e um plugin `keyring_file`, cada um dos quais armazena dados do chaveiro em um arquivo localizado no host do servidor.

A Edição Empresarial do MySQL oferece componentes adicionais e plugins para chaveiro:

* `component_keyring_encrypted_file`: Armazena dados do chaveiro em um arquivo criptografado e protegido por senha, localizado no servidor.

* `keyring_encrypted_file`: Armazena dados do chaveiro em um arquivo criptografado e protegido por senha, localizado no servidor.

* `keyring_okv`: Um plugin KMIP 1.1 para uso com produtos de armazenamento de chave de rede compatíveis com KMIP. Os produtos compatíveis com KMIP suportados incluem soluções de gerenciamento de chave centralizadas, como o Oracle Key Vault, Gemalto KeySecure, o servidor de gerenciamento de chave Thales Vormetric e o Fornetix Key Orchestration.

* `keyring_aws`: Comunica-se com o Serviço de Gerenciamento de Chave do Amazon Web Services (AWS KMS) como um backend para geração de chave e utiliza um arquivo local para armazenamento de chave.

* `keyring_hashicorp`: Comunica-se com HashiCorp Vault para armazenamento de back end.

Aviso

Para a gestão de chaves de criptografia, os componentes `component_keyring_file` e `component_keyring_encrypted_file` e os plugins `keyring_file` e `keyring_encrypted_file` não são destinados como uma solução de conformidade regulatória. Padrões de segurança, como PCI, FIPS e outros, exigem o uso de sistemas de gestão de chaves para proteger, gerenciar e proteger as chaves de criptografia em cofres de chave ou módulos de segurança de hardware (HSMs).

Uma solução segura e robusta de gerenciamento de chave de criptografia é fundamental para a segurança e para o cumprimento de vários padrões de segurança. Quando o recurso de criptografia de dados em repouso utiliza uma solução centralizada de gerenciamento de chave, o recurso é referido como "MySQL Enterprise Transparent Data Encryption (TDE)".

O recurso de criptografia de dados em repouso suporta o algoritmo de criptografia baseado em blocos Advanced Encryption Standard (AES). Ele utiliza o modo de criptografia de bloco Electronic Codebook (ECB) para criptografia de chave de espaço de tabela e o modo de criptografia de bloco Cipher Block Chaining (CBC) para criptografia de dados.

Para perguntas frequentes sobre o recurso de criptografia de dados em repouso, consulte a Seção A.17, “Perguntas frequentes do MySQL 8.0: Criptografia de dados em repouso do InnoDB”.

### Pré-requisitos de criptografia

Um componente ou plugin de chaveiro deve ser instalado e configurado no início. O carregamento precoce garante que o componente ou plugin esteja disponível antes da inicialização do mecanismo de armazenamento `InnoDB`. Para instruções de instalação e configuração de chaveiro, consulte a Seção 8.4.4, “O Keyring MySQL”. As instruções mostram como garantir que o componente ou plugin escolhido esteja ativo.

Apenas um componente ou plugin do chaveiro deve ser ativado de cada vez. A ativação de vários componentes ou plugins do chaveiro não é suportada e os resultados podem não ser os esperados.

Importante

Uma vez que as tabelas criptografadas são criadas em uma instância do MySQL, o componente ou plugin do chaveiro que foi carregado ao criar a área de tabelas criptografada deve continuar a ser carregado no início. Não fazer isso resulta em erros ao iniciar o servidor e durante a recuperação do `InnoDB`.

* Ao criptografar dados de produção, certifique-se de tomar medidas para evitar a perda da chave de criptografia mestre. * Se a chave de criptografia mestre for perdida, os dados armazenados em arquivos de espaço de tabela criptografados não serão recuperáveis. * Se você usar o componente `component_keyring_file` ou `component_keyring_encrypted_file` ou o plugin `keyring_file` ou `keyring_encrypted_file`, crie um backup do arquivo de dados do chaveiro imediatamente após criar o primeiro arquivo de espaço de tabela criptografado, antes da rotação da chave mestre e após a rotação da chave mestre. Para cada componente, seu arquivo de configuração indica o local do arquivo de dados. A opção de configuração `keyring_file_data` define o local do arquivo de dados do chaveiro para o plugin `keyring_file`. A opção de configuração `keyring_encrypted_file_data` define o local do arquivo de dados do chaveiro para o plugin `keyring_encrypted_file`. Se você usar o plugin `keyring_okv` ou `keyring_aws`, certifique-se de que você realizou a configuração necessária. Para instruções, consulte a Seção 8.4.4, “O Keyring do MySQL”.

### Definindo um padrão de criptografia para esquemas e tabelas gerais

A partir do MySQL 8.0.16, a variável de sistema `default_table_encryption` define o ajuste de criptografia padrão para esquemas e espaços de tabela gerais. As operações `CREATE TABLESPACE` e `CREATE SCHEMA` aplicam o ajuste `default_table_encryption` quando uma cláusula `ENCRYPTION` não é especificada explicitamente.

As operações `ALTER SCHEMA` e (alter-database.html "15.1.2 ALTER DATABASE Statement") não aplicam a configuração `default_table_encryption`. Uma cláusula `ENCRYPTION` deve ser especificada explicitamente para alterar a criptografia de um esquema existente ou de um espaço de tabela geral.

A variável `default_table_encryption` pode ser definida para uma conexão individual do cliente ou globalmente usando a sintaxe `SET`. Por exemplo, a seguinte declaração habilita a criptografia de esquema e espaço de tabela padrão globalmente:

```
mysql> SET GLOBAL default_table_encryption=ON;
```

A configuração de criptografia padrão para um esquema também pode ser definida usando a cláusula `DEFAULT ENCRYPTION` ao criar ou alterar um esquema, como neste exemplo:

```
mysql> CREATE SCHEMA test DEFAULT ENCRYPTION = 'Y';
```

Se a cláusula `DEFAULT ENCRYPTION` não for especificada ao criar um esquema, o ajuste `default_table_encryption` é aplicado. A cláusula `DEFAULT ENCRYPTION` deve ser especificada para alterar o ajuste de criptografia padrão de um esquema existente. Caso contrário, o esquema retém seu ajuste de criptografia atual.

Por padrão, uma tabela herda a configuração de criptografia do esquema ou espaço de tabela geral em que é criada. Por exemplo, uma tabela criada em um esquema habilitado para criptografia é criptografada por padrão. Esse comportamento permite que um DBA controle o uso de criptografia de tabela definindo e aplicando criptografia padrão para esquemas e espaços de tabela gerais.

As configurações padrão de criptografia são aplicadas ao habilitar a variável de sistema `table_encryption_privilege_check`. Quando o `table_encryption_privilege_check` é habilitado, uma verificação de privilégio ocorre ao criar ou alterar um esquema ou espaço de tabela geral com uma configuração de criptografia que difere da configuração do `default_table_encryption`, ou ao criar ou alterar uma tabela com uma configuração de criptografia que difere da criptografia padrão do esquema. Quando o `table_encryption_privilege_check` é desativado (o padrão), a verificação de privilégio não ocorre e as operações anteriormente mencionadas são permitidas a prosseguir com um aviso.

O privilégio `TABLE_ENCRYPTION_ADMIN` é necessário para anular as configurações de criptografia padrão quando o `table_encryption_privilege_check` está habilitado. Um DBA pode conceder este privilégio para permitir que um usuário se afastem da configuração `default_table_encryption` ao criar ou alterar um esquema ou espaço de tabela geral, ou para se afastem da criptografia de esquema padrão ao criar ou alterar uma tabela. Este privilégio não permite se afassear da criptografia de um espaço de tabela geral ao criar ou alterar uma tabela. Uma tabela deve ter a mesma configuração de criptografia que o espaço de tabela geral em que reside.

### Criptografia do espaço de tabela por tabela de arquivo

A partir do MySQL 8.0.16, um espaço de tabela por tabela herda a criptografia padrão do esquema no qual a tabela é criada, a menos que uma cláusula `ENCRYPTION` seja especificada explicitamente na declaração `CREATE TABLE`. Antes do MySQL 8.0.16, a cláusula `ENCRYPTION` deve ser especificada para habilitar a criptografia.

```
mysql> CREATE TABLE t1 (c1 INT) ENCRYPTION = 'Y';
```

Para alterar a criptografia de um espaço de tabela existente por tabela, uma cláusula `ENCRYPTION` deve ser especificada.

```
mysql> ALTER TABLE t1 ENCRYPTION = 'Y';
```

A partir do MySQL 8.0.16, se a variável `table_encryption_privilege_check` estiver habilitada, especificar uma cláusula `ENCRYPTION` com um ajuste que difere do esquema de criptografia padrão requer o privilégio `TABLE_ENCRYPTION_ADMIN`. Veja Definindo um padrão de criptografia para esquemas e tabelas gerais.

### Criptografia de Espaço de Tabela Geral

A partir do MySQL 8.0.16, a variável `default_table_encryption` determina a criptografia de um espaço de tabela geral recém-criado, a menos que uma cláusula `ENCRYPTION` seja especificada explicitamente na declaração `CREATE TABLESPACE`. Antes do MySQL 8.0.16, uma cláusula `ENCRYPTION` deve ser especificada para habilitar a criptografia.

```
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' ENCRYPTION = 'Y' Engine=InnoDB;
```

Para alterar a encriptação de um espaço de tabela geral existente, uma cláusula `ENCRYPTION` deve ser especificada.

```
mysql> ALTER TABLESPACE ts1 ENCRYPTION = 'Y';
```

A partir do MySQL 8.0.16, se a variável `table_encryption_privilege_check` estiver habilitada, especificar uma cláusula `ENCRYPTION` com um ajuste que difere do ajuste `default_table_encryption` requer o privilégio `TABLE_ENCRYPTION_ADMIN`. Veja Definindo um padrão de criptografia para esquemas e tabelas gerais.

### Encriptação de Arquivos com Dupla Escrita

O suporte de criptografia para arquivos de dupla escrita está disponível a partir do MySQL 8.0.23. `InnoDB` criptografa automaticamente as páginas de arquivos de dupla escrita que pertencem a espaços de tabela criptografados. Não é necessária nenhuma ação. As páginas de arquivos de dupla escrita são criptografadas usando a chave de criptografia do espaço de tabela associado. A mesma página criptografada escrita em um arquivo de dados de um espaço de tabela também é escrita em um arquivo de dupla escrita. As páginas de arquivos de dupla escrita que pertencem a um espaço de tabela não criptografado permanecem não criptografadas.

Durante a recuperação, as páginas de arquivo criptografadas de escrita dupla são descriptografadas e verificadas quanto à corrupção.

### Espaço de tabela do sistema criptografado pelo mysql

O suporte de criptografia para o espaço de tabela do sistema `mysql` está disponível a partir do MySQL 8.0.16.

O espaço de tabela do sistema `mysql` contém as tabelas do banco de dados do sistema `mysql` e as tabelas do dicionário de dados MySQL. Ele não é criptografado por padrão. Para habilitar a criptografia para o espaço de tabela do sistema `mysql`, especifique o nome do espaço de tabela e a opção `ENCRYPTION` em uma declaração `ALTER TABLESPACE`.

```
mysql> ALTER TABLESPACE mysql ENCRYPTION = 'Y';
```

Para desativar a criptografia para o espaço de tabela do sistema `mysql`, configure `ENCRYPTION = 'N'` usando uma declaração `ALTER TABLESPACE`.

```
mysql> ALTER TABLESPACE mysql ENCRYPTION = 'N';
```

Para habilitar ou desabilitar o espaço de tabela do sistema `mysql`, é necessário o privilégio `CREATE TABLESPACE`(privileges-provided.html#priv_create-tablespace) em todas as tabelas da instância (`CREATE TABLESPACE on *.*)`.

### Criptografia do Log de Refazer

A criptografia dos dados do log de refazer é habilitada usando a opção de configuração `innodb_redo_log_encrypt`. A criptografia do log de refazer é desativada por padrão.

Assim como os dados do tablespace, a criptografia dos dados do log de refazer ocorre quando os dados do log de refazer são escritos no disco, e a descriptografia ocorre quando os dados do log de refazer são lidos do disco. Uma vez que os dados do log de refazer são lidos na memória, eles estão em forma não criptografada. Os dados do log de refazer são criptografados e descriptografados usando a chave de criptografia do tablespace.

Quando o `innodb_redo_log_encrypt` está habilitado, as páginas do log de refazer não criptografadas que estão presentes no disco permanecem não criptografadas, e novas páginas do log de refazer são escritas no disco em forma criptografada. Da mesma forma, quando o `innodb_redo_log_encrypt` está desativado, as páginas do log de refazer criptografadas que estão presentes no disco permanecem criptografadas, e novas páginas do log de refazer são escritas no disco em forma não criptografada.

A partir do MySQL 8.0.30, os metadados de criptografia do log de refazer, incluindo a chave de criptografia do tablespace, são armazenados no cabeçalho do arquivo de log de refazer com o LSN (Localizador de Sequência de Tempo) do ponto de verificação mais recente. Antes do MySQL 8.0.30, os metadados de criptografia do log de refazer, incluindo a chave de criptografia do tablespace, são armazenados no cabeçalho do primeiro arquivo de log de refazer (`ib_logfile0`). Se o arquivo de log de refazer com os metadados de criptografia for removido, a criptografia do log de refazer será desativada.

Uma vez que a criptografia do log de refazer é habilitada, um reinício normal sem o componente do chaveiro ou plugin ou sem a chave de criptografia não é possível, pois o `InnoDB` deve ser capaz de escanear as páginas de refazer durante o arranque, o que não é possível se as páginas do log de refazer estiverem criptografadas. Sem o componente do chaveiro ou plugin ou a chave de criptografia, apenas um arranque forçado sem os logs de refazer (`SRV_FORCE_NO_LOG_REDO`) é possível. Veja a Seção 17.21.3, “Forçando a Recuperação do InnoDB”.

### Desfazer criptografia do log

A desativação da criptografia dos dados do registro é habilitada usando a opção de configuração `innodb_undo_log_encrypt`. A desativação da criptografia do registro se aplica aos registros de desfazer que residem em [espaços de tabela de desfazer][(glossary.html#glos_undo_tablespace "undo tablespace")]. Veja a Seção 17.6.3.4, “Espaços de Tabela de Desfazer”. A criptografia dos dados do registro do registro de desfazer é desativada por padrão.

Assim como os dados do tablespace, a criptografia dos dados do log de desfazer ocorre quando os dados do log de desfazer são escritos no disco, e a descriptografia ocorre quando os dados do log de desfazer são lidos do disco. Uma vez que os dados do log de desfazer são lidos na memória, eles estão em forma não criptografada. Os dados do log de desfazer são criptografados e descriptografados usando a chave de criptografia do tablespace.

Quando o `innodb_undo_log_encrypt` está habilitado, as páginas do registro de desfazer não criptografadas que estão presentes no disco permanecem não criptografadas, e novas páginas do registro de desfazer são escritas no disco em forma criptografada. Da mesma forma, quando o `innodb_undo_log_encrypt` está desativado, as páginas do registro de desfazer criptografadas que estão presentes no disco permanecem criptografadas, e novas páginas do registro de desfazer são escritas no disco em forma não criptografada.

Os metadados de criptografia do log de desfazer, incluindo a chave de criptografia do tablespace, são armazenados no cabeçalho do arquivo de log de desfazer.

Nota

Quando a criptografia do registro de desfazer é desativada, o servidor continua exigindo o componente ou o plugin do chaveiro que foi usado para criptografar os dados do registro de desfazer, até que os espaços de tabela de desfazer que continham os dados criptografados do registro de desfazer sejam truncados. (Um cabeçalho de criptografia é removido apenas de um espaço de tabela de desfazer quando o espaço de tabela de desfazer é truncado.) Para obter informações sobre o truncamento de espaços de tabela de desfazer, consulte Truncar espaços de tabela de desfazer.

### Rotação da Chave Mestre

A chave de criptografia principal deve ser rotada periodicamente e sempre que você suspeitar que a chave tenha sido comprometida.

A rotação da chave mestre é uma operação atômica e de nível de instância. Toda vez que a chave de criptografia mestre é rotacionada, todas as chaves do espaço de tabelas na instância do MySQL são re-encriptadas e salvas de volta aos respectivos cabeçalhos do espaço de tabelas. Como uma operação atômica, a re-encriptação deve ser bem-sucedida para todas as chaves do espaço de tabelas uma vez que uma operação de rotação é iniciada. Se a rotação da chave mestre for interrompida por uma falha no servidor, `InnoDB` avança a operação no reinício do servidor. Para mais informações, consulte Criptografia e Recuperação.

A rotação da chave de criptografia mestre apenas altera a chave de criptografia mestre e re-encripta as chaves do espaço de tabela. Não descript ou re-encripta os dados associados ao espaço de tabela.

Para rotação da chave de criptografia principal, é necessário o privilégio `ENCRYPTION_KEY_ADMIN` (ou o privilégio descontinuado `SUPER`).

Para rotular a chave de criptografia mestre, execute:

```
mysql> ALTER INSTANCE ROTATE INNODB MASTER KEY;
```

`ALTER INSTANCE ROTATE INNODB MASTER KEY`](alter-instance.html#alter-instance-rotate-innodb-master-key) suporta operações DML concorrentes. No entanto, não pode ser executado concorrentemente com operações de criptografia de tablespace, e os bloqueios são tomados para evitar conflitos que poderiam surgir da execução concorrente. Se uma operação `ALTER INSTANCE ROTATE INNODB MASTER KEY`](alter-instance.html#alter-instance-rotate-innodb-master-key) estiver em execução, ela deve terminar antes que uma operação de criptografia de tablespace possa prosseguir, e vice-versa.

### Criptografia e Recuperação

Se ocorrer uma falha no servidor durante uma operação de criptografia, a operação é revertida quando o servidor é reiniciado. Para tabelas gerais, a operação de criptografia é retomada em um thread de segundo plano a partir da última página processada.

Se ocorrer uma falha no servidor durante a rotação da chave mestre, `InnoDB` continua a operação após o reinício do servidor.

O componente ou plugin do chaveiro deve ser carregado antes da inicialização do mecanismo de armazenamento, para que as informações necessárias para descriptografar as páginas de dados do espaço de tabela possam ser recuperadas dos cabeçalhos do espaço de tabela antes da inicialização e das atividades de recuperação do `InnoDB`, e o acesso aos dados do espaço de tabela. (Veja os Requisitos de criptografia.)

Quando a inicialização e recuperação do `InnoDB` começarem, a operação de rotação da chave mestre é retomada. Devido ao mau funcionamento do servidor, algumas chaves do tablespace já podem estar criptografadas usando a nova chave de criptografia mestre. O `InnoDB` lê os dados de criptografia de cada cabeçalho do tablespace e, se os dados indicarem que a chave do tablespace está criptografada usando a chave de criptografia mestre antiga, o `InnoDB` recupera a chave antiga do anel de chaves e a usa para descriptografar a chave do tablespace. O `InnoDB` então recripta a chave do tablespace usando a nova chave de criptografia mestre e salva a chave do tablespace recriptografada de volta ao cabeçalho do tablespace.

### Exportar tabelas espaciais criptografadas

O export de tablespace é suportado apenas para tablespaces por arquivo.

Quando um espaço de tabela criptografado é exportado, `InnoDB` gera uma *chave de transferência* que é usada para criptografar a chave do espaço de tabela. A chave criptografada do espaço de tabela e a chave de transferência são armazenadas em um arquivo `tablespace_name.cfp`. Este arquivo, juntamente com o arquivo do espaço de tabela criptografado, é necessário para realizar uma operação de importação. Na importação, `InnoDB` usa a chave de transferência para descriptografar a chave do espaço de tabela no arquivo `tablespace_name.cfp`. Para informações relacionadas, consulte a Seção 17.6.1.3, “Impor Tabelas InnoDB”.

### Criptografia e Replicação

* A declaração `ALTER INSTANCE ROTATE INNODB MASTER KEY`(alter-instance.html#alter-instance-rotate-innodb-master-key) é apenas suportada em ambientes de replicação onde a fonte e a replica executam uma versão do MySQL que suporta criptografia de tablespace.

As declarações bem-sucedidas `ALTER INSTANCE ROTATE INNODB MASTER KEY` são escritas no log binário para replicação em réplicas.

* Se uma declaração `ALTER INSTANCE ROTATE INNODB MASTER KEY`(alter-instance.html#alter-instance-rotate-innodb-master-key) falhar, ela não é registrada no log binário e não é replicada nas réplicas.

* A replicação de uma operação `ALTER INSTANCE ROTATE INNODB MASTER KEY`(alter-instance.html#alter-instance-rotate-innodb-master-key) falha se o componente ou plugin do chaveiro estiver instalado na fonte, mas não na replica.

* Se o plugin `keyring_file` ou `keyring_encrypted_file` estiver instalado tanto na fonte quanto em uma réplica, mas a réplica não tiver um arquivo de dados do chaveiro, a declaração `ALTER INSTANCE ROTATE INNODB MASTER KEY` (alter-instance.html#alter-instance-rotate-innodb-master-key) cria o arquivo de dados do chaveiro na réplica, assumindo que os dados do arquivo do chaveiro não estejam cacheados na memória. `ALTER INSTANCE ROTATE INNODB MASTER KEY` (alter-instance.html#alter-instance-rotate-innodb-master-key) usa dados do arquivo do chaveiro que estão cacheados na memória, se disponíveis.

### Identificando tabelas e esquemas criptografados ###

A tabela do esquema de informações `INNODB_TABLESPACES`, introduzida no MySQL 8.0.13, inclui uma coluna `ENCRYPTION` que pode ser usada para identificar espaços de tabela criptografados.

```
mysql> SELECT SPACE, NAME, SPACE_TYPE, ENCRYPTION FROM INFORMATION_SCHEMA.INNODB_TABLESPACES
       WHERE ENCRYPTION='Y'\G
*************************** 1. row ***************************
     SPACE: 4294967294
      NAME: mysql
SPACE_TYPE: General
ENCRYPTION: Y
*************************** 2. row ***************************
     SPACE: 2
      NAME: test/t1
SPACE_TYPE: Single
ENCRYPTION: Y
*************************** 3. row ***************************
     SPACE: 3
      NAME: ts1
SPACE_TYPE: General
ENCRYPTION: Y
```

Quando a opção `ENCRYPTION` é especificada em uma declaração `CREATE TABLE` ou `ALTER TABLE`, ela é registrada na coluna `CREATE_OPTIONS` de `INFORMATION_SCHEMA.TABLES`. Essa coluna pode ser consultada para identificar tabelas que residem em espaços de tabela criptografados por arquivo por tabela.

```
mysql> SELECT TABLE_SCHEMA, TABLE_NAME, CREATE_OPTIONS FROM INFORMATION_SCHEMA.TABLES
       WHERE CREATE_OPTIONS LIKE '%ENCRYPTION%';
+--------------+------------+----------------+
| TABLE_SCHEMA | TABLE_NAME | CREATE_OPTIONS |
+--------------+------------+----------------+
| test         | t1         | ENCRYPTION="Y" |
+--------------+------------+----------------+
```

Consulte a tabela do esquema de informações `INNODB_TABLESPACES` para obter informações sobre o espaço de tabela associado a um esquema e uma tabela em particular.

```
mysql> SELECT SPACE, NAME, SPACE_TYPE FROM INFORMATION_SCHEMA.INNODB_TABLESPACES WHERE NAME='test/t1';
+-------+---------+------------+
| SPACE | NAME    | SPACE_TYPE |
+-------+---------+------------+
|     3 | test/t1 | Single     |
+-------+---------+------------+
```

Você pode identificar esquemas com criptografia habilitada consultando a tabela do esquema de informações `SCHEMATA`.

```
mysql> SELECT SCHEMA_NAME, DEFAULT_ENCRYPTION FROM INFORMATION_SCHEMA.SCHEMATA
       WHERE DEFAULT_ENCRYPTION='YES';
+-------------+--------------------+
| SCHEMA_NAME | DEFAULT_ENCRYPTION |
+-------------+--------------------+
| test        | YES                |
+-------------+--------------------+
```

`SHOW CREATE SCHEMA` (show-create-database.html "15.7.7.6 SHOW CREATE DATABASE Statement") também mostra a cláusula `DEFAULT ENCRYPTION`.

### Monitoramento do progresso da criptografia

Você pode monitorar o progresso da criptografia de tabelas de espaço geral e do `mysql` espaço de tabela do sistema usando o Schema de Desempenho.

O instrumento de evento de etapa `stage/innodb/alter tablespace (encryption)` relata as informações `WORK_ESTIMATED` e `WORK_COMPLETED` para operações de criptografia de espaço de tabela geral.

O exemplo a seguir demonstra como habilitar o instrumento de evento de estágio `stage/innodb/alter tablespace (encryption)` e as tabelas relacionadas do consumidor para monitorar o progresso da criptografia do espaço de tabela geral ou do espaço de tabela de sistema [[`mysql`]. Para obter informações sobre os instrumentos de evento de estágio do Schema de Desempenho e os consumidores relacionados, consulte a Seção 29.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”.

1. Ative o instrumento `stage/innodb/alter tablespace (encryption)`:

   ```
   mysql> USE performance_schema;
   mysql> UPDATE setup_instruments SET ENABLED = 'YES'
          WHERE NAME LIKE 'stage/innodb/alter tablespace (encryption)';
   ```

2. Ative as tabelas de consumo de eventos de palco, que incluem `events_stages_current`, `events_stages_history` e `events_stages_history_long`.

   ```
   mysql> UPDATE setup_consumers SET ENABLED = 'YES' WHERE NAME LIKE '%stages%';
   ```

3. Execute uma operação de criptografia de tablespace. Neste exemplo, um tablespace geral chamado `ts1` é criptografado.

   ```
   mysql> ALTER TABLESPACE ts1 ENCRYPTION = 'Y';
   ```

4. Verifique o progresso da operação de criptografia consultando a tabela do Schema de desempenho `events_stages_current`. `WORK_ESTIMATED` relata o número total de páginas no espaço de tabelas. `WORK_COMPLETED` relata o número de páginas processadas.

   ```
   mysql> SELECT EVENT_NAME, WORK_ESTIMATED, WORK_COMPLETED FROM events_stages_current;
   +--------------------------------------------+----------------+----------------+
   | EVENT_NAME                                 | WORK_COMPLETED | WORK_ESTIMATED |
   +--------------------------------------------+----------------+----------------+
   | stage/innodb/alter tablespace (encryption) |           1056 |           1407 |
   +--------------------------------------------+----------------+----------------+
   ```

A tabela `events_stages_current` retorna um conjunto vazio se a operação de criptografia tiver sido concluída. Nesse caso, você pode verificar a tabela `events_stages_history` para visualizar os dados do evento da operação concluída. Por exemplo:

   ```
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED FROM events_stages_history;
   +--------------------------------------------+----------------+----------------+
   | EVENT_NAME                                 | WORK_COMPLETED | WORK_ESTIMATED |
   +--------------------------------------------+----------------+----------------+
   | stage/innodb/alter tablespace (encryption) |           1407 |           1407 |
   +--------------------------------------------+----------------+----------------+
   ```

### Notas sobre o uso de criptografia

* Planeje adequadamente ao alterar um espaço de tabela por arquivo existente com a opção `ENCRYPTION`. As tabelas que residem em espaços de tabela por arquivo são reconstruídas usando o algoritmo `COPY`. O algoritmo `INPLACE` é usado ao alterar o atributo `ENCRYPTION` de um espaço de tabela geral ou o espaço de tabelas do sistema `mysql`. O algoritmo `INPLACE` permite DML concorrente em tabelas que residem no espaço de tabela geral. O DDL concorrente é bloqueado.

* Quando um espaço de tabela geral ou o espaço de tabela `mysql` do sistema é criptografado, todas as tabelas que residem no espaço de tabela são criptografadas. Da mesma forma, uma tabela criada em um espaço de tabela criptografado é criptografada.

* Se o servidor sair ou for parado durante o funcionamento normal, é recomendável reiniciar o servidor usando as mesmas configurações de criptografia que foram configuradas anteriormente.

* A primeira chave de criptografia mestre é gerada quando o primeiro espaço de tabela novo ou existente é criptografado.

* A rotação da chave mestre re-encripta as chaves dos espaços de tabela, mas não altera a própria chave do espaço de tabela. Para alterar uma chave de espaço de tabela, você deve desativar e reativar a criptografia. Para espaços de tabela por arquivo, a re-encriptação do espaço de tabela é uma operação `ALGORITHM=COPY` que reconstrui a tabela. Para espaços de tabela gerais e o espaço de tabela do sistema `mysql`, é uma operação `ALGORITHM=INPLACE`, que não requer a reconstrução de tabelas que residem no espaço de tabela.

* Se uma tabela for criada com as opções `COMPRESSION` e `ENCRYPTION`, a compressão é realizada antes dos dados do espaço de tabela serem criptografados.

* Se um arquivo de dados de chave de acesso (o arquivo denominado por `keyring_file_data` ou `keyring_encrypted_file_data`) estiver vazio ou ausente, a primeira execução de [`ALTER INSTANCE ROTATE INNODB MASTER KEY`(alter-instance.html#alter-instance-rotate-innodb-master-key) cria uma chave de criptografia mestre.

* A desinstalação do componente `component_keyring_file` ou `component_keyring_encrypted_file` não remove um arquivo de dados de chave existente. A desinstalação do plugin `keyring_file` ou `keyring_encrypted_file` não remove um arquivo de dados de chave existente.

* É recomendável que você não coloque um arquivo de dados de chave de acesso no mesmo diretório que os arquivos de dados do espaço de tabela.

* A modificação do ajuste `keyring_file_data` ou `keyring_encrypted_file_data` em tempo de execução ou ao reiniciar o servidor pode fazer com que os espaços de tabela previamente criptografados tornem-se inacessíveis, resultando na perda de dados.

* O criptograma é suportado para as tabelas de índice `InnoDB` `FULLTEXT` que são criadas implicitamente ao adicionar um índice `FULLTEXT`. Para informações relacionadas, consulte Tabelas de índice de texto completo InnoDB.

### Limitações de criptografia

O Padrão de Criptografia Avançada (AES) é o único algoritmo de criptografia suportado. A criptografia de tablespace `InnoDB` utiliza o modo de criptografia de bloco de Código Eletrônico (ECB) para a criptografia da chave do tablespace e o modo de criptografia de bloco de Cadeia de Bloco (CBC) para a criptografia dos dados. O preenchimento não é usado com o modo de criptografia de bloco CBC. Em vez disso, `InnoDB` garante que o texto a ser criptografado seja um múltiplo do tamanho do bloco.

* O suporte à criptografia é suportado apenas para espaços de tabela por arquivo, espaços de tabela gerais e o espaço de tabela `mysql`. O suporte à criptografia para espaços de tabela gerais foi introduzido no MySQL 8.0.13. O suporte à criptografia para o espaço de tabela `mysql` está disponível a partir do MySQL 8.0.16. A criptografia não é suportada para outros tipos de espaço de tabela, incluindo o espaço de tabela `InnoDB` [espaço de tabela [(glossary.html#glos_system_tablespace "system tablespace")]].

* Não é possível mover ou copiar uma tabela de um espaço de tabela criptografado de tipo de espaço de tabela por arquivo, espaço de tabela geral ou o espaço de tabela `mysql` para um tipo de espaço de tabela que não suporte criptografia.

* Você não pode mover ou copiar uma tabela de um espaço de tabelas criptografado para um espaço de tabelas não criptografado. No entanto, é permitido mover uma tabela de um espaço de tabelas não criptografado para um criptografado. Por exemplo, você pode mover ou copiar uma tabela de um espaço de tabelas não criptografado ou de arquivo por tabela para um espaço de tabelas geral criptografado.

* Por padrão, a criptografia do espaço de tabelas só se aplica aos dados no espaço de tabelas. Os dados do log de refazer e do log de desfazer podem ser criptografados ao habilitar `innodb_redo_log_encrypt` e `innodb_undo_log_encrypt`. Consulte Criptografia de Log de Refazer e Criptografia de Log de Desfazer. Para informações sobre criptografia de arquivos de log binários e arquivos de log de relevo, consulte Seção 19.3.2, “Criptografando Arquivos de Log Binários e Arquivos de Log de Relevo”.

* Não é permitido alterar o mecanismo de armazenamento de uma tabela que reside em ou que anteriormente residia em um espaço de tabelas criptografado.