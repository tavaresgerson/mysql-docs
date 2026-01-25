## 14.14 Criptografia de Dados em Repouso do InnoDB (`Data-at-Rest Encryption`)

O `InnoDB` suporta criptografia de dados em repouso (`data-at-rest encryption`) para *tablespaces file-per-table*.

* Sobre a Criptografia de Dados em Repouso
* Pré-requisitos de Criptografia
* Habilitando a Criptografia de Tablespace File-Per-Table
* Rotação da Master Key
* Criptografia e Recuperação
* Exportando Tablespaces Criptografados
* Criptografia e Replicação
* Identificando Tablespaces Criptografados
* Notas de Uso da Criptografia
* Limitações da Criptografia

### Sobre a Criptografia de Dados em Repouso

O `InnoDB` utiliza uma arquitetura de chave de criptografia de dois níveis, consistindo em uma *master encryption key* e *tablespace keys*. Quando um *tablespace* é criptografado, uma *tablespace key* é criptografada e armazenada no *header* do *tablespace*. Quando um aplicativo ou usuário autenticado deseja acessar dados criptografados, o `InnoDB` usa uma *master encryption key* para descriptografar a *tablespace key*. A versão descriptografada de uma *tablespace key* nunca muda, mas a *master encryption key* pode ser alterada conforme necessário. Essa ação é denominada *master key rotation* (rotação da *master key*).

O recurso de criptografia de dados em repouso depende de um *keyring plugin* para o gerenciamento da *master encryption key*.

Todas as edições do MySQL fornecem o *plugin* `keyring_file`, que armazena dados de *keyring* em um arquivo local no *host* do servidor.

O MySQL Enterprise Edition oferece *keyring plugins* adicionais:

* `keyring_encrypted_file`: Armazena dados de *keyring* em um arquivo criptografado e protegido por senha, local no *host* do servidor.

* `keyring_okv`: Um *plugin* KMIP 1.1 para uso com produtos de armazenamento *keyring back end* compatíveis com KMIP. Produtos compatíveis com KMIP suportados incluem soluções centralizadas de gerenciamento de chaves, como Oracle Key Vault, Gemalto KeySecure, Thales Vormetric key management server e Fornetix Key Orchestration.

* `keyring_aws`: Comunica-se com o Amazon Web Services Key Management Service (AWS KMS) como um *back end* para geração de chaves e usa um arquivo local para armazenamento de chaves.

Aviso

Para o gerenciamento de chaves de criptografia, os *plugins* `keyring_file` e `keyring_encrypted_file` não são projetados como uma solução de conformidade regulatória. Padrões de segurança como PCI, FIPS e outros exigem o uso de sistemas de gerenciamento de chaves para proteger, gerenciar e preservar chaves de criptografia em *key vaults* ou módulos de segurança de hardware (HSMs).

Uma solução de gerenciamento de chave de criptografia segura e robusta é crítica para a segurança e para a conformidade com vários padrões de segurança. Quando o recurso de criptografia de dados em repouso utiliza uma solução centralizada de gerenciamento de chaves, o recurso é denominado “MySQL Enterprise Transparent Data Encryption (TDE)”.

O recurso de criptografia de dados em repouso suporta o *Advanced Encryption Standard* (AES), um *algorithm* de criptografia baseado em blocos. Ele usa o modo de criptografia de bloco *Electronic Codebook* (ECB) para criptografia da *tablespace key* e o modo de criptografia de bloco *Cipher Block Chaining* (CBC) para criptografia de dados.

Para perguntas frequentes sobre o recurso de criptografia de dados em repouso, consulte a Seção A.17, “MySQL 5.7 FAQ: InnoDB Data-at-Rest Encryption”.

### Pré-requisitos de Criptografia

* Um *keyring plugin* deve ser instalado e configurado. A instalação do *keyring plugin* é realizada na inicialização usando a opção `early-plugin-load`. O carregamento antecipado garante que o *plugin* esteja disponível antes da inicialização do *storage engine* `InnoDB`. Para obter instruções de instalação e configuração do *keyring plugin*, consulte a Seção 6.4.4, “The MySQL Keyring”.

  Apenas um *keyring plugin* deve ser habilitado por vez. A habilitação de múltiplos *keyring plugins* não é suportada, e os resultados podem não ser os esperados.

  Importante

  Uma vez que *tablespaces* criptografados são criados em uma *Instance* MySQL, o *keyring plugin* que foi carregado ao criar o *tablespace* criptografado deve continuar a ser carregado na inicialização usando a opção `early-plugin-load`. Não fazer isso resulta em erros ao iniciar o servidor e durante a recuperação do `InnoDB`.

  Para verificar se um *keyring plugin* está ativo, use a instrução `SHOW PLUGINS` ou consulte a tabela `PLUGINS` do Information Schema. Por exemplo:

  ```sql
  mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
         FROM INFORMATION_SCHEMA.PLUGINS
         WHERE PLUGIN_NAME LIKE 'keyring%';
  +--------------+---------------+
  | PLUGIN_NAME  | PLUGIN_STATUS |
  +--------------+---------------+
  | keyring_file | ACTIVE        |
  +--------------+---------------+
  ```

* Ao criptografar dados de produção, certifique-se de tomar medidas para evitar a perda da *master encryption key*. *Se a master encryption key for perdida, os dados armazenados em arquivos de tablespace criptografados são irrecuperáveis.* Se você usar o *plugin* `keyring_file` ou `keyring_encrypted_file`, crie um *backup* do arquivo de dados do *keyring* imediatamente após criar o primeiro *tablespace* criptografado, antes da *master key rotation* e após a *master key rotation*. A opção de configuração `keyring_file_data` define a localização do arquivo de dados do *keyring* para o *plugin* `keyring_file`. A opção de configuração `keyring_encrypted_file_data` define a localização do arquivo de dados do *keyring* para o *plugin* `keyring_encrypted_file`. Se você usar o *plugin* `keyring_okv` ou `keyring_aws`, certifique-se de ter realizado a configuração necessária. Para obter instruções, consulte a Seção 6.4.4, “The MySQL Keyring”.

### Habilitando a Criptografia de Tablespace File-Per-Table

Para habilitar a criptografia para um novo *tablespace file-per-table*, especifique a opção `ENCRYPTION` em uma instrução `CREATE TABLE`. O exemplo a seguir pressupõe que `innodb_file_per_table` esteja habilitado.

```sql
mysql> CREATE TABLE t1 (c1 INT) ENCRYPTION='Y';
```

Para habilitar a criptografia para um *tablespace file-per-table* existente, especifique a opção `ENCRYPTION` em uma instrução `ALTER TABLE`.

```sql
mysql> ALTER TABLE t1 ENCRYPTION='Y';
```

Para desabilitar a criptografia para um *tablespace file-per-table*, defina `ENCRYPTION='N'` usando `ALTER TABLE`.

```sql
mysql> ALTER TABLE t1 ENCRYPTION='N';
```

### Rotação da Master Key

A *master encryption key* deve ser rotacionada periodicamente e sempre que houver suspeita de que a chave tenha sido comprometida.

A *Master Key Rotation* é uma operação atômica no nível da *Instance*. Toda vez que a *master encryption key* é rotacionada, todas as *tablespace keys* na *Instance* MySQL são recriptografadas e salvas de volta nos seus respectivos *tablespace headers*. Como uma operação atômica, a recriptografia deve ser bem-sucedida para todas as *tablespace keys* assim que uma operação de rotação é iniciada. Se a *master key rotation* for interrompida por uma falha do servidor, o `InnoDB` avança a operação na reinicialização do servidor. Para mais informações, consulte Criptografia e Recuperação.

Rotacionar a *master encryption key* apenas altera a *master encryption key* e recriptografa as *tablespace keys*. Isso não descriptografa ou recriptografa os dados associados ao *tablespace*.

A rotação da *master encryption key* requer o privilégio `SUPER`.

Para rotacionar a *master encryption key*, execute:

```sql
mysql> ALTER INSTANCE ROTATE INNODB MASTER KEY;
```

`ALTER INSTANCE ROTATE INNODB MASTER KEY` suporta DML concorrente. No entanto, ele não pode ser executado concomitantemente com operações de criptografia de *tablespace*, e *locks* são aplicados para evitar conflitos que possam surgir da execução concorrente. Se uma operação `ALTER INSTANCE ROTATE INNODB MASTER KEY` estiver em execução, ela deve ser concluída antes que uma operação de criptografia de *tablespace* possa prosseguir, e vice-versa.

### Criptografia e Recuperação

Se ocorrer uma falha do servidor durante uma operação de criptografia, a operação é avançada (*rolled forward*) quando o servidor é reiniciado.

Se ocorrer uma falha do servidor durante a *master key rotation*, o `InnoDB` continua a operação na reinicialização do servidor.

O *keyring plugin* deve ser carregado antes da inicialização do *storage engine* para que as informações necessárias para descriptografar as páginas de dados do *tablespace* possam ser recuperadas dos *tablespace headers* antes que as atividades de inicialização e recuperação do `InnoDB` acessem os dados do *tablespace*. (Consulte Pré-requisitos de Criptografia.)

Quando a inicialização e a recuperação do `InnoDB` começam, a operação de *master key rotation* é retomada. Devido à falha do servidor, algumas *tablespace keys* já podem estar criptografadas usando a nova *master encryption key*. O `InnoDB` lê os dados de criptografia de cada *tablespace header* e, se os dados indicarem que a *tablespace key* está criptografada usando a *master encryption key* antiga, o `InnoDB` recupera a chave antiga do *keyring* e a usa para descriptografar a *tablespace key*. O `InnoDB` então recriptografa a *tablespace key* usando a nova *master encryption key* e salva a *tablespace key* recriptografada de volta no *tablespace header*.

### Exportando Tablespaces Criptografados

Quando um *tablespace* criptografado é exportado, o `InnoDB` gera uma *transfer key* que é usada para criptografar a *tablespace key*. A *tablespace key* criptografada e a *transfer key* são armazenadas em um arquivo `tablespace_name.cfp`. Este arquivo, juntamente com o arquivo de *tablespace* criptografado, é necessário para realizar uma operação de *Import*. No *Import*, o `InnoDB` usa a *transfer key* para descriptografar a *tablespace key* no arquivo `tablespace_name.cfp`. Para obter informações relacionadas, consulte a Seção 14.6.1.3, “Importing InnoDB Tables”.

### Criptografia e Replicação

* A instrução `ALTER INSTANCE ROTATE INNODB MASTER KEY` é suportada apenas em ambientes de *Replication* onde a *source* e as *replicas* executam uma versão do MySQL que suporta criptografia de dados em repouso.

* Instruções `ALTER INSTANCE ROTATE INNODB MASTER KEY` bem-sucedidas são escritas no *binary log* para *Replication* nas *replicas*.

* Se uma instrução `ALTER INSTANCE ROTATE INNODB MASTER KEY` falhar, ela não é registrada no *binary log* e não é replicada nas *replicas*.

* A *Replication* de uma operação `ALTER INSTANCE ROTATE INNODB MASTER KEY` falha se o *keyring plugin* estiver instalado na *source*, mas não na *replica*.

* Se o *plugin* `keyring_file` ou `keyring_encrypted_file` estiver instalado tanto na *source* quanto em uma *replica*, mas a *replica* não tiver um arquivo de dados do *keyring*, a instrução `ALTER INSTANCE ROTATE INNODB MASTER KEY` replicada cria o arquivo de dados do *keyring* na *replica*, assumindo que os dados do arquivo *keyring* não estejam em *cache* na memória. `ALTER INSTANCE ROTATE INNODB MASTER KEY` usa dados de arquivo *keyring* que estejam em *cache* na memória, se disponíveis.

### Identificando Tablespaces Criptografados

Quando a opção `ENCRYPTION` é especificada em uma instrução `CREATE TABLE` ou `ALTER TABLE`, ela é registrada na coluna `CREATE_OPTIONS` da tabela `TABLES` do Information Schema. Esta coluna pode ser consultada para identificar tabelas que residem em *tablespaces file-per-table* criptografados.

```sql
mysql> SELECT TABLE_SCHEMA, TABLE_NAME, CREATE_OPTIONS FROM INFORMATION_SCHEMA.TABLES
       WHERE CREATE_OPTIONS LIKE '%ENCRYPTION%';
+--------------+------------+----------------+
| TABLE_SCHEMA | TABLE_NAME | CREATE_OPTIONS |
+--------------+------------+----------------+
| test         | t1         | ENCRYPTION="Y" |
+--------------+------------+----------------+
```

Consulte `INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES` para recuperar informações sobre o *tablespace* associado a um determinado *schema* e *table*.

```sql
mysql> SELECT SPACE, NAME, SPACE_TYPE FROM INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES WHERE NAME='test/t1';
+-------+---------+------------+
| SPACE | NAME    | SPACE_TYPE |
+-------+---------+------------+
|     3 | test/t1 | Single     |
+-------+---------+------------+
```

### Notas de Uso da Criptografia

* Planeje adequadamente ao alterar um *tablespace* existente com a opção `ENCRYPTION`. A *table* é reconstruída usando o *Algorithm* `COPY`. O *Algorithm* `INPLACE` não é suportado.

* Se o servidor for encerrado ou parado durante a operação normal, é recomendável reiniciar o servidor usando as mesmas configurações de criptografia configuradas anteriormente.

* A primeira *master encryption key* é gerada quando o primeiro *tablespace* novo ou existente é criptografado.

* A *Master Key Rotation* recriptografa as *tablespaces keys*, mas não altera a *tablespace key* em si. Para alterar uma *tablespace key*, você deve desabilitar e reabilitar a criptografia, o que é uma operação `ALGORITHM=COPY` que reconstrói a *table*.

* Se uma *table* for criada com as opções `COMPRESSION` e `ENCRYPTION`, a compressão é realizada antes que os dados do *tablespace* sejam criptografados.

* Se um arquivo de dados do *keyring* (o arquivo nomeado por `keyring_file_data` ou `keyring_encrypted_file_data`) estiver vazio ou ausente, a primeira execução de `ALTER INSTANCE ROTATE INNODB MASTER KEY` cria uma *master encryption key*.

* Desinstalar o *plugin* `keyring_file` ou `keyring_encrypted_file` não remove um arquivo de dados do *keyring* existente.

* É recomendável que você não coloque um arquivo de dados do *keyring* no mesmo diretório dos arquivos de dados do *tablespace*.

* Modificar a configuração de `keyring_file_data` ou `keyring_encrypted_file_data` em tempo de execução ou ao reiniciar o servidor pode fazer com que *tablespaces* criptografados anteriormente se tornem inacessíveis, resultando em perda de dados.

### Limitações da Criptografia

* O *Advanced Encryption Standard* (AES) é o único *encryption algorithm* suportado. A criptografia de dados em repouso do `InnoDB` usa o modo de criptografia de bloco *Electronic Codebook* (ECB) para criptografia da *tablespace key* e o modo de criptografia de bloco *Cipher Block Chaining* (CBC) para criptografia de dados. O *Padding* não é usado com o modo de criptografia de bloco CBC. Em vez disso, o `InnoDB` garante que o texto a ser criptografado seja um múltiplo do tamanho do bloco.

* A alteração do atributo `ENCRYPTION` de uma *table* é realizada usando o *Algorithm* `COPY`. O *Algorithm* `INPLACE` não é suportado.

* A criptografia é suportada apenas para *tablespaces file-per-table*. A criptografia não é suportada para outros tipos de *tablespace*, incluindo *general tablespaces* e o *system tablespace*.

* Não é possível mover ou copiar uma *table* de um *tablespace file-per-table* criptografado para um tipo de *tablespace* que não suporte criptografia.

* A criptografia se aplica apenas aos dados no *tablespace*. Os dados não são criptografados no *redo log*, *undo log* ou *binary log*.

* Não é permitido alterar o *storage engine* de uma *table* que reside, ou residiu anteriormente, em um *tablespace* criptografado.

* A criptografia não é suportada para as *index tables* `FULLTEXT` do `InnoDB` que são criadas implicitamente ao adicionar um *Index* `FULLTEXT`. Para obter informações relacionadas, consulte InnoDB Full-Text Index Tables.
