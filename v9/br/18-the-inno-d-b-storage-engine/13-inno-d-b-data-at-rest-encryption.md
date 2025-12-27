## Criptografia de Dados em Repouso do InnoDB

O `InnoDB` suporta a criptografia de dados em repouso para espaços de tabelas por arquivo, espaços de tabelas gerais, o espaço de tabelas do sistema `mysql`, logs de redo e logs de undo.

Você pode definir um padrão de criptografia para esquemas e espaços de tabelas gerais; isso permite que os administradores de banco de dados controlem se as tabelas criadas nesses esquemas e espaços de tabelas serão criptografadas.

As funcionalidades e capacidades de criptografia de dados em repouso do `InnoDB` são descritas nos seguintes tópicos nesta seção.

* Sobre a Criptografia de Dados em Repouso
* Pré-requisitos de Criptografia
* Definindo um Padrão de Criptografia para Esquemas e Espaços de Tabelas Gerais
* Criptografia de Espaço de Tabelas por Arquivo
* Criptografia de Espaço de Tabelas Gerais
* Criptografia de Arquivo de Dupla Escrita
* Criptografia de Espaço de Tabelas do Sistema `mysql`
* Criptografia de Log de Redo
* Criptografia de Log de Undo
* Rotação da Chave Mestre
* Uso de Criptografia e Recuperação
* Exportação de Espaços de Tabelas Criptografadas
* Criptografia e Replicação
* Identificação de Espaços de Tabelas e Esquemas Criptografados
* Monitoramento do Progresso da Criptografia
* Notas de Uso de Criptografia
* Limitações da Criptografia

Todas as edições do MySQL fornecem um componente `component_keyring_file`, que armazena dados do bloco de chaves em um arquivo local ao servidor.

A Edição Empresarial do MySQL oferece componentes e plugins adicionais do bloco de chaves:

* `component_keyring_encrypted_file`: Armazena dados do bloco de chaves em um arquivo criptografado e protegido por senha local ao servidor.

* `keyring_okv`: Um plugin KMIP 1.1 para uso com produtos de armazenamento de bloco de chaves compatíveis com KMIP. Os produtos compatíveis com KMIP suportados incluem soluções de gerenciamento de chaves centralizadas, como o Oracle Key Vault, o Gemalto KeySecure, o servidor de gerenciamento de chaves Thales Vormetric e o Fornetix Key Orchestration.

* `keyring_aws`: Comunica-se com o Serviço de Gerenciamento de Chaves do Amazon Web Services (AWS KMS) como um backend para geração de chaves e usa um arquivo local para armazenamento de chaves.

* `keyring_hashicorp`: Comunica-se com o Vault da HashiCorp para armazenamento backend.

Aviso

Para o gerenciamento de chaves de criptografia, os componentes `component_keyring_file` e `component_keyring_encrypted_file` não são destinados como uma solução de conformidade regulatória. Padrões de segurança como PCI, FIPS e outros exigem o uso de sistemas de gerenciamento de chaves para proteger, gerenciar e proteger chaves de criptografia em cofres de chaves ou módulos de segurança de hardware (HSMs).

Uma solução robusta e segura de gerenciamento de chaves de criptografia é crítica para a segurança e para a conformidade com vários padrões de segurança. Quando a funcionalidade de criptografia em repouso usa uma solução de gerenciamento de chaves centralizada, a funcionalidade é referida como “MySQL Enterprise Transparent Data Encryption (TDE)”.

O recurso de criptografia de dados em repouso suporta o algoritmo de criptografia baseada em blocos do Padrão de Criptografia Avançada (AES). Ele utiliza o modo de criptografia de blocos de Código Eletrônico (ECB) para a criptografia da chave do espaço de tabela e o modo de criptografia de blocos de Cadeia de Blocos de Cifra (CBC) para a criptografia dos dados.

Para perguntas frequentes sobre o recurso de criptografia de dados em repouso, consulte a Seção A.17, “Perguntas Frequentes do MySQL 9.5: Criptografia de Dados em Repouso do InnoDB”.

### Pré-requisitos de Criptografia

* Um componente ou plugin de chave deve ser instalado e configurado na inicialização. O carregamento antecipado garante que o componente ou plugin esteja disponível antes da inicialização do motor de armazenamento `InnoDB`. Para instruções de instalação e configuração do chaveiro, consulte a Seção 8.4.5, “O Chaveiro MySQL”. As instruções mostram como garantir que o componente ou plugin escolhido esteja ativo.

  Apenas um componente ou plugin de chave deve ser habilitado de cada vez. Habilitar vários componentes ou plugins de chave não é suportado e os resultados podem não ser os esperados.

  Importante

  Uma vez que os espaços de tabela criptografados são criados em uma instância do MySQL, o componente ou plugin de chaveiro que foi carregado ao criar o espaço de tabela criptografado deve continuar sendo carregado na inicialização. Falhar em fazer isso resulta em erros ao iniciar o servidor e durante a recuperação do `InnoDB`.

* Ao criptografar dados de produção, certifique-se de tomar medidas para evitar a perda da chave de criptografia mestre. * Se a chave de criptografia mestre for perdida, os dados armazenados em arquivos de espaço de tabelas criptografados não serão recuperáveis.* Se você usar o componente `component_keyring_file` ou `component_keyring_encrypted_file`, crie um backup do arquivo de dados do anel de chaves imediatamente após criar o primeiro espaço de tabelas criptografado, antes da rotação da chave mestre e após a rotação da chave mestre. Para cada componente, seu arquivo de configuração indica a localização do arquivo de dados do anel de chaves. Se você usar o plugin `keyring_okv` ou `keyring_aws`, certifique-se de que você realizou a configuração necessária. Para obter instruções, consulte a Seção 8.4.5, “O Anel de Chaves do MySQL”.

### Definindo um Padrão de Criptografia para Esquemas e Espaços de Tabelas Gerais

A variável de sistema `default_table_encryption` define o ajuste de criptografia padrão para esquemas e espaços de tabelas gerais. As operações `CREATE TABLESPACE` e `CREATE SCHEMA` aplicam o ajuste `default_table_encryption` quando uma cláusula `ENCRYPTION` não é especificada explicitamente.

As operações `ALTER SCHEMA` e `ALTER TABLESPACE` não aplicam o ajuste `default_table_encryption`. Uma cláusula `ENCRYPTION` deve ser especificada explicitamente para alterar a criptografia de um esquema ou espaço de tabelas geral existente.

A variável `default_table_encryption` pode ser definida para uma conexão de cliente individual ou globalmente usando a sintaxe `SET`. Por exemplo, a seguinte declaração habilita a criptografia padrão de esquemas e espaços de tabelas globalmente:

```
mysql> SET GLOBAL default_table_encryption=ON;
```

O ajuste de criptografia padrão para um esquema também pode ser definido usando a cláusula `DEFAULT ENCRYPTION` ao criar ou alterar um esquema, como neste exemplo:

```
mysql> CREATE SCHEMA test DEFAULT ENCRYPTION = 'Y';
```

Se a cláusula `DEFAULT ENCRYPTION` não for especificada ao criar um esquema, o ajuste `default_table_encryption` é aplicado. A cláusula `DEFAULT ENCRYPTION` deve ser especificada para alterar o ajuste de criptografia padrão de um esquema existente. Caso contrário, o esquema mantém seu ajuste de criptografia atual.

Por padrão, uma tabela herda o ajuste de criptografia do esquema ou do espaço de tabelas geral em que é criada. Por exemplo, uma tabela criada em um esquema habilitado para criptografia é criptografada por padrão. Esse comportamento permite que um DBA controle o uso da criptografia de tabelas definindo e aplicando ajustes padrão de criptografia de esquemas e espaços de tabelas gerais.

Os ajustes de criptografia são aplicados ao habilitar a variável de sistema `table_encryption_privilege_check`. Quando `table_encryption_privilege_check` é habilitado, uma verificação de privilégio ocorre ao criar ou alterar um esquema ou espaço de tabelas geral com um ajuste de criptografia que difere do ajuste `default_table_encryption`, ou ao criar ou alterar uma tabela com um ajuste de criptografia que difere da criptografia padrão do esquema. Quando `table_encryption_privilege_check` é desabilitado (o padrão), a verificação de privilégio não ocorre e as operações mencionadas anteriormente são permitidas a prosseguir com um aviso.

O privilégio `TABLE_ENCRYPTION_ADMIN` é necessário para anular as configurações de criptografia padrão quando o `table_encryption_privilege_check` estiver habilitado. Um DBA pode conceder este privilégio para permitir que um usuário se afaste da configuração `default_table_encryption` ao criar ou alterar um esquema ou espaço de tabelas geral, ou para se desviar da criptografia padrão do esquema ao criar ou alterar uma tabela. Este privilégio não permite que se afastem da criptografia de um espaço de tabelas geral ao criar ou alterar uma tabela. Uma tabela deve ter a mesma configuração de criptografia do espaço de tabelas geral em que está inserida.

### Criptografia de Espaço de Tabelas por Tabela

Um espaço de tabelas por tabela herda a criptografia padrão do esquema em que a tabela é criada, a menos que uma cláusula `ENCRYPTION` seja especificada explicitamente na instrução `CREATE TABLE`.

```
mysql> CREATE TABLE t1 (c1 INT) ENCRYPTION = 'Y';
```

Para alterar a criptografia de um espaço de tabelas por tabela existente, uma cláusula `ENCRYPTION` deve ser especificada.

```
mysql> ALTER TABLE t1 ENCRYPTION = 'Y';
```

Quando o `table_encryption_privilege_check` está habilitado, especificando uma cláusula `ENCRYPTION` com uma configuração que difere da criptografia padrão do esquema, é necessário o privilégio `TABLE_ENCRYPTION_ADMIN`. Consulte Definindo um Padrão de Criptografia para Esquemas e Espaços de Tabelas Gerais.

### Criptografia de Espaço de Tabelas Geral

A variável `default_table_encryption` determina a criptografia de um espaço de tabelas geral recém-criado, a menos que uma cláusula `ENCRYPTION` seja especificada explicitamente na instrução `CREATE TABLESPACE`.

```
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' ENCRYPTION = 'Y' Engine=InnoDB;
```

Para alterar a criptografia de um espaço de tabelas geral existente, uma cláusula `ENCRYPTION` deve ser especificada.

```
mysql> ALTER TABLESPACE ts1 ENCRYPTION = 'Y';
```

Se `table_encryption_privilege_check` estiver habilitado, especificar uma cláusula `ENCRYPTION` com uma configuração diferente da configuração `default_table_encryption` requer o privilégio `TABLE_ENCRYPTION_ADMIN`. Veja Definindo um padrão de criptografia para esquemas e espaços de tabelas gerais.

### Criptografia de Arquivos de Redo

No MySQL 9.5, o `InnoDB` criptografa automaticamente as páginas de arquivo de redo que pertencem a espaços de tabelas criptografados. Não é necessário realizar nenhuma ação. As páginas de arquivo de redo criptografadas são criptografadas usando a chave de criptografia do espaço de tabelas associado. A mesma página criptografada escrita em um arquivo de dados de espaço de tabelas também é escrita em um arquivo de redo. As páginas de redo de arquivo que pertencem a um espaço de tabelas não criptografado permanecem não criptografadas.

Durante a recuperação, as páginas de redo criptografadas são descriptografadas e verificadas quanto à corrupção.

### Criptografia de Espaço de Tabelas do Sistema `mysql`

O espaço de tabelas `mysql` contém o banco de dados `mysql` e as tabelas do dicionário de dados do MySQL. Ele é não criptografado por padrão. Para habilitar a criptografia para o espaço de tabelas `mysql`, especifique o nome do espaço de tabelas e a opção `ENCRYPTION` em uma instrução `ALTER TABLESPACE`.

```
mysql> ALTER TABLESPACE mysql ENCRYPTION = 'Y';
```

Para desabilitar a criptografia para o espaço de tabelas `mysql`, defina `ENCRYPTION = 'N'` usando uma instrução `ALTER TABLESPACE`.

```
mysql> ALTER TABLESPACE mysql ENCRYPTION = 'N';
```

Habilitar ou desabilitar a criptografia para o espaço de tabelas `mysql` requer o privilégio `CREATE TABLESPACE` em todas as tabelas na instância (`CREATE TABLESPACE on *.*`).

### Criptografia de Log de Redo

A criptografia dos dados do log de redo é habilitada usando a opção de configuração `innodb_redo_log_encrypt`. A criptografia do log de redo é desabilitada por padrão.

Assim como os dados do tablespace, a criptografia dos dados do log de redo ocorre quando os dados do log de redo são escritos em disco, e a descriptografia ocorre quando os dados do log de redo são lidos em disco. Uma vez que os dados do log de redo são lidos na memória, eles estão na forma não criptografada. Os dados do log de redo são criptografados e descriptografados usando a chave de criptografia do tablespace.

Quando `innodb_redo_log_encrypt` está habilitado, as páginas do log de redo não criptografadas que estão presentes em disco permanecem não criptografadas, e novas páginas do log de redo são escritas em disco na forma criptografada. Da mesma forma, quando `innodb_redo_log_encrypt` está desabilitado, as páginas do log de redo criptografadas que estão presentes em disco permanecem criptografadas, e novas páginas do log de redo são escritas em disco na forma não criptografada.

Os metadados da criptografia do log de redo, incluindo a chave de criptografia do tablespace, são armazenados no cabeçalho do arquivo do log de redo com o LSN (Local Sequence Number) do ponto de verificação mais recente. Se o arquivo do log de redo com os metadados de criptografia for removido, a criptografia do log de redo será desabilitada.

Uma vez que a criptografia do log de redo é habilitada, um reinício normal sem o componente ou o plugin do keyring ou sem a chave de criptografia não é possível, pois o `InnoDB` deve ser capaz de escanear as páginas do log de redo durante o inicialização, o que não é possível se as páginas do log de redo estiverem criptografadas. Sem o componente ou o plugin do keyring ou a chave de criptografia, apenas um reinício forçado sem os logs do redo (`SRV_FORCE_NO_LOG_REDO`) é possível. Veja a Seção 17.20.3, “Forçando a Recuperação do InnoDB”.

### Criptografia do Log de Anulação

A criptografia dos dados do log de anulação é habilitada usando a opção de configuração `innodb_undo_log_encrypt`. A criptografia do log de anulação se aplica aos logs de anulação que residem em tablespaces de anulação. Veja a Seção 17.6.3.4, “Tablespaces de Anulação”. A criptografia dos dados do log de anulação é desabilitada por padrão.

Assim como os dados do tablespace, a criptografia dos dados do log de desfazer ocorre quando os dados do log de desfazer são escritos no disco, e a descriptografia ocorre quando os dados do log de desfazer são lidos do disco. Uma vez que os dados do log de desfazer são lidos na memória, eles estão na forma não criptografada. Os dados do log de desfazer são criptografados e descriptografados usando a chave de criptografia do tablespace.

Quando o `innodb_undo_log_encrypt` é habilitado, as páginas do log de desfazer não criptografadas que estão presentes no disco permanecem não criptografadas, e novas páginas do log de desfazer são escritas no disco na forma criptografada. Da mesma forma, quando o `innodb_undo_log_encrypt` é desabilitado, as páginas do log de desfazer criptografadas que estão presentes no disco permanecem criptografadas, e novas páginas do log de desfazer são escritas no disco na forma não criptografada.

Os metadados de criptografia do log de desfazer, incluindo a chave de criptografia do tablespace, são armazenados no cabeçalho do arquivo do log de desfazer.

Nota

Quando a criptografia do log de desfazer é desabilitada, o servidor continua a exigir o componente ou plugin do chaveiro que foi usado para criptografar os dados do log de desfazer até que os tablespaces de desfazer que continham os dados criptografados do log de desfazer sejam truncados. (Um cabeçalho de criptografia é removido de um tablespace de desfazer apenas quando o tablespace de desfazer é truncado.) Para obter informações sobre o truncamento de tablespaces de desfazer, consulte Truncar Tablespaces de Desfazer.

### Rotação da Chave Mestre

A chave de criptografia mestre deve ser rotada periodicamente e sempre que você suspeitar que a chave tenha sido comprometida.

A rotação da chave de criptografia mestre é uma operação atômica e de nível de instância. Cada vez que a chave de criptografia mestre é rotacionada, todas as chaves do espaço de tabelas na instância do MySQL são re-criptografadas e salvas de volta aos respectivos cabeçalhos do espaço de tabelas. Como uma operação atômica, a re-criptografia deve ser bem-sucedida para todas as chaves do espaço de tabelas uma vez que uma operação de rotação é iniciada. Se a rotação da chave mestre for interrompida por uma falha no servidor, o `InnoDB` avança a operação na reinicialização do servidor. Para mais informações, consulte Criptografia e Recuperação.

Rotular a chave de criptografia mestre apenas altera a chave de criptografia mestre e re-criptografa as chaves do espaço de tabelas. Não descriptografa ou re-criptografa os dados associados do espaço de tabelas.

Rotular a chave de criptografia mestre requer o privilégio `ENCRYPTION_KEY_ADMIN` (ou o privilégio desatualizado `SUPER`).

Para rotular a chave de criptografia mestre, execute:

```
mysql> ALTER INSTANCE ROTATE INNODB MASTER KEY;
```

`ALTER INSTANCE ROTATE INNODB MASTER KEY` suporta DML concorrente. No entanto, não pode ser executado concorrentemente com operações de criptografia de espaço de tabelas, e são tomadas bloqueadas para evitar conflitos que possam surgir da execução concorrente. Se uma operação `ALTER INSTANCE ROTATE INNODB MASTER KEY` estiver em execução, ela deve terminar antes que uma operação de criptografia de espaço de tabelas possa prosseguir, e vice-versa.

### Criptografia e Recuperação

Se uma falha no servidor ocorrer durante uma operação de criptografia, a operação é avançada na reinicialização do servidor. Para espaços de tabelas gerais, a operação de criptografia é retomada em um thread de segundo plano a partir da última página processada.

Se uma falha no servidor ocorrer durante a rotação da chave mestre, o `InnoDB` continua a operação na reinicialização do servidor.

O componente ou plugin de chave de fenda deve ser carregado antes da inicialização do mecanismo de armazenamento, para que as informações necessárias para recuperar as páginas de dados do espaço de tabelas possam ser obtidas dos cabeçalhos do espaço de tabelas antes que as atividades de inicialização e recuperação do `InnoDB` acessem os dados do espaço de tabelas. (Veja os Pré-requisitos de Criptografia.)

Quando a inicialização e recuperação do `InnoDB` começam, a operação de rotação da chave mestre é retomada. Devido ao falecimento do servidor, algumas chaves do espaço de tabelas podem já estar criptografadas usando a nova chave de criptografia mestre. O `InnoDB` lê os dados de criptografia de cada cabeçalho do espaço de tabelas e, se os dados indicarem que a chave do espaço de tabelas está criptografada usando a antiga chave de criptografia mestre, o `InnoDB` recupera a chave antiga da chave de fenda e a usa para descriptografar a chave do espaço de tabelas. O `InnoDB` então recriptografa a chave do espaço de tabelas usando a nova chave de criptografia mestre e salva a chave recriptografada do espaço de tabelas de volta ao cabeçalho do espaço de tabelas.

### Exportação de Espaços de Tabelas Criptografados

A exportação de espaço de tabelas é suportada apenas para espaços de tabelas por arquivo.

Quando um espaço de tabelas criptografado é exportado, o `InnoDB` gera uma *chave de transferência* que é usada para criptografar a chave do espaço de tabelas. A chave criptografada do espaço de tabelas e a chave de transferência são armazenadas em um arquivo `tablespace_name.cfp`. Esse arquivo, juntamente com o arquivo criptografado do espaço de tabelas, é necessário para realizar uma operação de importação. Na importação, o `InnoDB` usa a chave de transferência para descriptografar a chave do espaço de tabelas no arquivo `tablespace_name.cfp`. Para informações relacionadas, consulte a Seção 17.6.1.3, “Importando Tabelas do `InnoDB’”.

### Criptografia e Replicação

* A instrução `ALTER INSTANCE ROTATE INNODB MASTER KEY` é suportada apenas em ambientes de replicação onde a fonte e a replica executam uma versão do MySQL que suporta criptografia de espaço de tabelas.

* As instruções bem-sucedidas de `ALTER INSTANCE ROTATE INNODB MASTER KEY` são escritas no log binário para replicação em réplicas.

* Se uma instrução `ALTER INSTANCE ROTATE INNODB MASTER KEY` falhar, ela não é registrada no log binário e não é replicada em réplicas.

* A replicação de uma operação `ALTER INSTANCE ROTATE INNODB MASTER KEY` falha se o componente de chave de registro ou o plugin estiver instalado na fonte, mas não na réplica.

### Identificação de Espaços de Tabelas e Esquemas Encriptados

A tabela do Esquema de Informações `INNODB_TABLESPACES` inclui uma coluna `ENCRYPTION` que pode ser usada para identificar espaços de tabelas encriptados.

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

Quando a opção `ENCRYPTION` é especificada em uma instrução `CREATE TABLE` ou `ALTER TABLE`, ela é registrada na coluna `CREATE_OPTIONS` de `INFORMATION_SCHEMA.TABLES`. Essa coluna pode ser consultada para identificar tabelas que residem em espaços de tabelas encriptados por arquivo.

```
mysql> SELECT TABLE_SCHEMA, TABLE_NAME, CREATE_OPTIONS FROM INFORMATION_SCHEMA.TABLES
       WHERE CREATE_OPTIONS LIKE '%ENCRYPTION%';
+--------------+------------+----------------+
| TABLE_SCHEMA | TABLE_NAME | CREATE_OPTIONS |
+--------------+------------+----------------+
| test         | t1         | ENCRYPTION="Y" |
+--------------+------------+----------------+
```

Consulte a tabela do Esquema de Informações `INNODB_TABLESPACES` para recuperar informações sobre o espaço de tabelas associado a um esquema e uma tabela específicos.

```
mysql> SELECT SPACE, NAME, SPACE_TYPE FROM INFORMATION_SCHEMA.INNODB_TABLESPACES WHERE NAME='test/t1';
+-------+---------+------------+
| SPACE | NAME    | SPACE_TYPE |
+-------+---------+------------+
|     3 | test/t1 | Single     |
+-------+---------+------------+
```

Você pode identificar esquemas com criptografia habilitada consultando a tabela do Esquema de Informações `SCHEMATA`.

```
mysql> SELECT SCHEMA_NAME, DEFAULT_ENCRYPTION FROM INFORMATION_SCHEMA.SCHEMATA
       WHERE DEFAULT_ENCRYPTION='YES';
+-------------+--------------------+
| SCHEMA_NAME | DEFAULT_ENCRYPTION |
+-------------+--------------------+
| test        | YES                |
+-------------+--------------------+
```

A instrução `SHOW CREATE SCHEMA` também mostra a cláusula `DEFAULT ENCRYPTION`.

### Monitoramento do Progresso da Criptografia

Você pode monitorar o progresso da criptografia de espaços de tabelas e do espaço de tabelas do sistema `mysql` usando o Gerenciador de Desempenho.

O evento instrumento `stage/innodb/alter tablespace (encryption)` do estágio `stage/innodb/alter tablespace (encryption)` relata as informações `WORK_ESTIMATED` e `WORK_COMPLETED` para operações de criptografia de espaços de tabelas gerais.

O exemplo a seguir demonstra como habilitar o instrumento do evento `stage/innodb/alter tablespace (encryption)` e as tabelas de consumidor relacionadas para monitorar o progresso da criptografia do espaço de tabelas geral ou do espaço de tabelas do sistema `mysql`. Para obter informações sobre os instrumentos de evento de estágio do Schema de Desempenho e as tabelas de consumidor relacionadas, consulte a Seção 29.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”.

1. Habilite o instrumento `stage/innodb/alter tablespace (encryption)`:

   ```
   mysql> USE performance_schema;
   mysql> UPDATE setup_instruments SET ENABLED = 'YES'
          WHERE NAME LIKE 'stage/innodb/alter tablespace (encryption)';
   ```

2. Habilite as tabelas de consumidor de evento de estágio, que incluem `events_stages_current`, `events_stages_history` e `events_stages_history_long`.

   ```
   mysql> UPDATE setup_consumers SET ENABLED = 'YES' WHERE NAME LIKE '%stages%';
   ```

3. Execute uma operação de criptografia de espaço de tabelas. Neste exemplo, um espaço de tabelas geral chamado `ts1` é criptografado.

   ```
   mysql> ALTER TABLESPACE ts1 ENCRYPTION = 'Y';
   ```

4. Verifique o progresso da operação de criptografia consultando a tabela `events_stages_current` do Schema de Desempenho. `WORK_ESTIMATED` relata o número total de páginas no espaço de tabelas. `WORK_COMPLETED` relata o número de páginas processadas.

   ```
   mysql> SELECT EVENT_NAME, WORK_ESTIMATED, WORK_COMPLETED FROM events_stages_current;
   +--------------------------------------------+----------------+----------------+
   | EVENT_NAME                                 | WORK_COMPLETED | WORK_ESTIMATED |
   +--------------------------------------------+----------------+----------------+
   | stage/innodb/alter tablespace (encryption) |           1056 |           1407 |
   +--------------------------------------------+----------------+----------------+
   ```

   A tabela `events_stages_current` retorna um conjunto vazio se a operação de criptografia tiver sido concluída. Neste caso, você pode consultar a tabela `events_stages_history` para visualizar os dados do evento da operação concluída. Por exemplo:

   ```
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED FROM events_stages_history;
   +--------------------------------------------+----------------+----------------+
   | EVENT_NAME                                 | WORK_COMPLETED | WORK_ESTIMATED |
   +--------------------------------------------+----------------+----------------+
   | stage/innodb/alter tablespace (encryption) |           1407 |           1407 |
   +--------------------------------------------+----------------+----------------+
   ```

### Notas de Uso da Criptografia

* Planeje adequadamente ao alterar um espaço de tabelas existente por arquivo por tabela com a opção `ENCRYPTION`. As tabelas que residem em espaços de tabelas por arquivo são reconstruídas usando o algoritmo `COPY`. O algoritmo `INPLACE` é usado ao alterar o atributo `ENCRYPTION` de um espaço de tabelas geral ou do espaço de tabelas do sistema `mysql`. O algoritmo `INPLACE` permite DML concorrente em tabelas que residem no espaço de tabelas geral. O DDL concorrente é bloqueado.

* Quando um espaço de tabelas geral ou o espaço de tabelas do sistema `mysql` é criptografado, todas as tabelas que estão nele também são criptografadas. Da mesma forma, uma tabela criada em um espaço de tabelas criptografado também é criptografada.

* Se o servidor sair ou for parado durante a operação normal, recomenda-se reiniciar o servidor usando as mesmas configurações de criptografia que foram configuradas anteriormente.

* A primeira chave de criptografia mestre é gerada quando o primeiro novo ou existente espaço de tabelas é criptografado.

* A rotação da chave mestre recripta as chaves dos espaços de tabelas, mas não altera a própria chave do espaço de tabelas. Para alterar uma chave de espaço de tabelas, você deve desabilitar e reativar a criptografia. Para espaços de tabelas por arquivo e o espaço de tabelas do sistema `mysql`, é uma operação `ALGORITHM=INPLACE`, que não requer a reconstrução das tabelas que estão no espaço de tabelas.

* Se uma tabela for criada com as opções `COMPRESSION` e `ENCRYPTION`, a compressão é realizada antes de os dados do espaço de tabelas serem criptografados.

* A desinstalação do componente `component_keyring_file` ou `component_keyring_encrypted_file` não remove um arquivo de dados de chave existente.

* Recomenda-se que você não coloque um arquivo de dados de chave de chave sob o mesmo diretório que os arquivos de dados do espaço de tabelas.

* A criptografia é suportada para as tabelas de índices `FULLTEXT` do `InnoDB` que são criadas implicitamente ao adicionar um índice `FULLTEXT`. Para informações relacionadas, consulte Tabelas de Índices Full-Text do InnoDB.

### Limitações de Criptografia

* O Padrão de Criptografia Avançada (AES) é o único algoritmo de criptografia suportado. A criptografia do espaço de tabelas `InnoDB` usa o modo de criptografia de blocos de Código Eletrônico (ECB) para a criptografia da chave do espaço de tabelas e o modo de criptografia de blocos de Cadeia de Blocos (CBC) para a criptografia dos dados. O enchimento não é usado com o modo de criptografia de blocos CBC. Em vez disso, o `InnoDB` garante que o texto a ser criptografado seja um múltiplo do tamanho do bloco.

* A criptografia é suportada apenas para espaços de tabelas por arquivo, espaços de tabelas gerais e o espaço de tabelas `mysql` do sistema. A criptografia não é suportada para outros tipos de espaço de tabelas, incluindo o espaço de tabelas `InnoDB` do sistema.

* Você não pode mover ou copiar uma tabela de um espaço de tabelas por arquivo criptografado, espaço de tabelas geral ou o espaço de tabelas `mysql` do sistema para um tipo de espaço de tabelas que não suporte criptografia.

* Você não pode mover ou copiar uma tabela de um espaço de tabelas criptografado para um espaço de tabelas não criptografado. No entanto, mover uma tabela de um espaço de tabelas não criptografado para um criptografado é permitido. Por exemplo, você pode mover ou copiar uma tabela de um espaço de tabelas por arquivo ou geral não criptografado para um espaço de tabelas geral criptografado.

* Por padrão, a criptografia do espaço de tabelas só se aplica aos dados no espaço de tabelas. Os dados do log de recuperação e do log de desfazer podem ser criptografados ao habilitar `innodb_redo_log_encrypt` e `innodb_undo_log_encrypt`. Consulte Criptografia de Log de Recuperação e Criptografia de Log de Desfazer. Para informações sobre a criptografia de arquivos de log binário e arquivos de log de retransmissão, consulte Seção 19.3.2, “Criptografar Arquivos de Log Binário e Arquivos de Log de Retransmissão”.

* Não é permitido alterar o motor de armazenamento de uma tabela que reside em ou anteriormente residiu em um espaço de tabelas criptografado.