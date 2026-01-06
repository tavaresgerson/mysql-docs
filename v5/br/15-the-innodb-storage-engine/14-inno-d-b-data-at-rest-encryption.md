## 14.14 Criptografia de Dados em Repouso do InnoDB

O `InnoDB` suporta criptografia de dados em repouso para espaços de tabelas por arquivo.

- Sobre a criptografia de dados em repouso
- Requisitos de criptografia
- Ativar a criptografia do espaço de tabela por tabela
- Rotação da Chave Mestre
- Criptografia e Recuperação
- Exportar tabelas espaciais criptografadas
- Criptografia e Replicação
- Identificando Espaços de Tabela Encriptados
- Observações sobre o uso de criptografia
- Limitações de criptografia

### Sobre a criptografia de dados em repouso

O `InnoDB` utiliza uma arquitetura de chave de criptografia em duas camadas, composta por uma chave de criptografia mestre e chaves de espaço de tabela. Quando um espaço de tabela é criptografado, uma chave de espaço de tabela é criptografada e armazenada no cabeçalho do espaço de tabela. Quando uma aplicação ou usuário autenticado deseja acessar dados criptografados, o `InnoDB` usa uma chave de criptografia mestre para descriptografar a chave de espaço de tabela. A versão descriptografada de uma chave de espaço de tabela nunca muda, mas a chave de criptografia mestre pode ser alterada conforme necessário. Essa ação é referida como *rotação da chave mestre*.

O recurso de criptografia de dados em repouso depende de um plugin de chave de criptografia mestre para gerenciamento de chaves.

Todas as edições do MySQL fornecem um plugin `keyring_file`, que armazena os dados do bloco de chaves em um arquivo localizado no host do servidor.

A Edição Empresarial do MySQL oferece plugins adicionais para chaveiros:

- `keyring_encrypted_file`: Armazena os dados do chaveiro em um arquivo criptografado e protegido por senha, localizado no host do servidor.

- `keyring_okv`: Um plugin KMIP 1.1 para uso com produtos de armazenamento de chaveira de back-end compatíveis com KMIP. Os produtos compatíveis com KMIP suportados incluem soluções de gerenciamento centralizado de chaves, como o Oracle Key Vault, o Gemalto KeySecure, o servidor de gerenciamento de chaves Thales Vormetric e o Fornetix Key Orchestration.

- `keyring_aws`: Comunica-se com o Amazon Web Services Key Management Service (AWS KMS) como um backend para a geração de chaves e utiliza um arquivo local para armazenamento de chaves.

Aviso

Para a gestão de chaves de criptografia, os plugins `keyring_file` e `keyring_encrypted_file` não são destinados como uma solução de conformidade regulatória. Padrões de segurança como PCI, FIPS e outros exigem o uso de sistemas de gerenciamento de chaves para proteger, gerenciar e proteger as chaves de criptografia em cofres de chaves ou módulos de segurança de hardware (HSMs).

Uma solução segura e robusta de gerenciamento de chaves de criptografia é fundamental para a segurança e para a conformidade com vários padrões de segurança. Quando o recurso de criptografia de dados em repouso utiliza uma solução centralizada de gerenciamento de chaves, o recurso é denominado "MySQL Enterprise Transparent Data Encryption (TDE)".

O recurso de criptografia de dados em repouso suporta o algoritmo de criptografia baseada em blocos do Padrão de Criptografia Avançada (AES). Ele utiliza o modo de criptografia de blocos de Código Eletrônico (ECB) para a criptografia da chave do espaço de tabela e o modo de criptografia de blocos de Cadeia de Blocos de Cifra (CBC) para a criptografia dos dados.

Para perguntas frequentes sobre o recurso de criptografia de dados em repouso, consulte a Seção A.17, “Perguntas frequentes do MySQL 5.7: Criptografia de dados em repouso do InnoDB”.

### Requisitos de criptografia

- Um plugin de chave de acesso deve ser instalado e configurado. A instalação do plugin de chave de acesso é realizada durante o início do sistema usando a opção `early-plugin-load`. O carregamento antecipado garante que o plugin esteja disponível antes da inicialização do motor de armazenamento `InnoDB`. Para obter instruções sobre a instalação e configuração do plugin de chave de acesso, consulte a Seção 6.4.4, “O MySQL Keyring”.

  Apenas um plugin de chave de acesso deve ser ativado de cada vez. A ativação de vários plugins de chave de acesso não é suportada e os resultados podem não ser os esperados.

  Importante

  Uma vez que as tabelas criptografadas são criadas em uma instância do MySQL, o plugin de chave de criptografia que foi carregado ao criar a tabela criptografada deve continuar sendo carregado durante o início usando a opção `early-plugin-load`. Caso contrário, isso resultará em erros ao iniciar o servidor e durante a recuperação do `InnoDB`.

  Para verificar se um plugin de chave de segurança está ativo, use a instrução `SHOW PLUGINS` ou consulte a tabela do esquema de informações `PLUGINS`. Por exemplo:

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

- Ao criptografar dados de produção, certifique-se de tomar medidas para evitar a perda da chave de criptografia mestre. *Se a chave de criptografia mestre for perdida, os dados armazenados em arquivos de espaço de tabelas criptografados não serão recuperáveis.* Se você usar o plugin `keyring_file` ou `keyring_encrypted_file`, crie um backup do arquivo de dados do bloco de chaves imediatamente após criar o primeiro espaço de tabelas criptografado, antes da rotação da chave mestre e após a rotação da chave mestre. A opção de configuração `keyring_file_data` define a localização do arquivo de dados do bloco de chaves para o plugin `keyring_file`. A opção de configuração `keyring_encrypted_file_data` define a localização do arquivo de dados do bloco de chaves para o plugin `keyring_encrypted_file`. Se você usar o plugin `keyring_okv` ou `keyring_aws`, certifique-se de que você realizou a configuração necessária. Para obter instruções, consulte a Seção 6.4.4, “O Bloco de Chaves MySQL”.

### Ativar a criptografia do espaço de tabela por tabela

Para habilitar a criptografia para um novo espaço de tabela por arquivo, especifique a opção `ENCRYPTION` em uma instrução `CREATE TABLE`. O exemplo a seguir assume que `innodb_file_per_table` está habilitado.

```sql
mysql> CREATE TABLE t1 (c1 INT) ENCRYPTION='Y';
```

Para habilitar a criptografia para um espaço de tabela de arquivos existente, especifique a opção `ENCRYPTION` em uma instrução `ALTER TABLE`.

```sql
mysql> ALTER TABLE t1 ENCRYPTION='Y';
```

Para desativar a criptografia para o espaço de tabela por tabela, defina `ENCRYPTION='N'` usando `ALTER TABLE`.

```sql
mysql> ALTER TABLE t1 ENCRYPTION='N';
```

### Rotação da Chave Mestre

A chave de criptografia principal deve ser rotada periodicamente e sempre que você suspeitar que a chave tenha sido comprometida.

A rotação da chave mestre é uma operação atômica e de nível de instância. Cada vez que a chave de criptografia mestre é rotacionada, todas as chaves do espaço de tabelas na instância do MySQL são re-encriptadas e salvas de volta aos respectivos cabeçalhos do espaço de tabelas. Como uma operação atômica, a re-encriptação deve ser bem-sucedida para todas as chaves do espaço de tabelas uma vez que uma operação de rotação é iniciada. Se a rotação da chave mestre for interrompida por uma falha no servidor, o `InnoDB` avança a operação na reinicialização do servidor. Para mais informações, consulte Criptografia e Recuperação.

A rotação da chave de criptografia mestre altera apenas a chave de criptografia mestre e recripta as chaves do espaço de tabela. Não descriptografa nem recripta os dados do espaço de tabela associados.

Para rotear a chave de criptografia mestre, é necessário o privilégio `SUPER`.

Para rotear a chave de criptografia mestre, execute:

```sql
mysql> ALTER INSTANCE ROTATE INNODB MASTER KEY;
```

A opção `ALTER INSTANCE ROTATE INNODB MASTER KEY` suporta operações DML concorrentes. No entanto, não pode ser executada de forma concorrente com operações de criptografia de tablespace, e são tomadas bloqueadas para evitar conflitos que possam surgir da execução concorrente. Se uma operação `ALTER INSTANCE ROTATE INNODB MASTER KEY` estiver em execução, ela deve ser concluída antes que uma operação de criptografia de tablespace possa prosseguir, e vice-versa.

### Criptografia e Recuperação

Se ocorrer uma falha no servidor durante uma operação de criptografia, a operação é recomeçada quando o servidor é reiniciado.

Se ocorrer uma falha no servidor durante a rotação da chave mestre, o `InnoDB` continua a operação após o reinício do servidor.

O plugin de chave de acesso deve ser carregado antes da inicialização do mecanismo de armazenamento, para que as informações necessárias para descriptografar as páginas de dados do espaço de tabelas possam ser recuperadas dos cabeçalhos do espaço de tabelas antes que as atividades de inicialização e recuperação do `InnoDB` acessem os dados do espaço de tabelas. (Veja os requisitos de criptografia.)

Quando a inicialização e recuperação do `InnoDB` começam, a operação de rotação da chave mestre é retomada. Devido ao falha do servidor, algumas chaves do espaço de tabelas já podem estar criptografadas usando a nova chave de criptografia mestre. O `InnoDB` lê os dados de criptografia de cada cabeçalho do espaço de tabelas e, se os dados indicarem que a chave do espaço de tabelas está criptografada usando a antiga chave de criptografia mestre, o `InnoDB` recupera a chave antiga do conjunto de chaves e a usa para descriptografar a chave do espaço de tabelas. O `InnoDB` então recripta a chave do espaço de tabelas usando a nova chave de criptografia mestre e salva a chave recriptada de volta ao cabeçalho do espaço de tabelas.

### Exportar tabelas espaciais criptografadas

Quando um espaço de tabela criptografado é exportado, o `InnoDB` gera uma *chave de transferência* que é usada para criptografar a chave do espaço de tabela. A chave criptografada do espaço de tabela e a chave de transferência são armazenadas em um arquivo `tablespace_name.cfp`. Esse arquivo, juntamente com o arquivo do espaço de tabela criptografado, é necessário para realizar uma operação de importação. Na importação, o `InnoDB` usa a chave de transferência para descriptografar a chave do espaço de tabela no arquivo `tablespace_name.cfp`. Para informações relacionadas, consulte a Seção 14.6.1.3, “Importando Tabelas InnoDB”.

### Criptografia e Replicação

- A instrução `ALTER INSTANCE ROTATE INNODB MASTER KEY` só é suportada em ambientes de replicação onde a fonte e as réplicas executam uma versão do MySQL que suporta criptografia de dados em repouso.

- As instruções bem-sucedidas `ALTER INSTANCE ROTATE INNODB MASTER KEY` são escritas no log binário para replicação nas réplicas.

- Se uma instrução `ALTER INSTANCE ROTATE INNODB MASTER KEY` falhar, ela não é registrada no log binário e não é replicada nas réplicas.

- A replicação de uma operação `ALTER INSTANCE ROTATE INNODB MASTER KEY` falha se o plugin de chave de registro estiver instalado na fonte, mas não na replica.

- Se o plugin `keyring_file` ou `keyring_encrypted_file` estiver instalado tanto na fonte quanto em uma réplica, mas a réplica não tiver um arquivo de dados do bloco de chaves, a instrução `ALTER INSTANCE ROTATE INNODB MASTER KEY` replicada cria o arquivo de dados do bloco de chaves na réplica, assumindo que os dados do arquivo de bloco de chaves não estejam em cache na memória. `ALTER INSTANCE ROTATE INNODB MASTER KEY` usa os dados do arquivo de bloco de chaves que estão em cache na memória, se disponíveis.

### Identificando Espaços de Tabela Encriptados

Quando a opção `ENCRYPTION` é especificada em uma instrução `CREATE TABLE` ou `ALTER TABLE`, ela é registrada na coluna `CREATE_OPTIONS` da tabela `TABLES` do esquema de informações. Essa coluna pode ser consultada para identificar tabelas que residem em espaços de arquivos criptografados por tabela.

```sql
mysql> SELECT TABLE_SCHEMA, TABLE_NAME, CREATE_OPTIONS FROM INFORMATION_SCHEMA.TABLES
       WHERE CREATE_OPTIONS LIKE '%ENCRYPTION%';
+--------------+------------+----------------+
| TABLE_SCHEMA | TABLE_NAME | CREATE_OPTIONS |
+--------------+------------+----------------+
| test         | t1         | ENCRYPTION="Y" |
+--------------+------------+----------------+
```

Faça uma consulta à tabela `INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES` para obter informações sobre o tablespace associado a um esquema e uma tabela específicos.

```sql
mysql> SELECT SPACE, NAME, SPACE_TYPE FROM INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES WHERE NAME='test/t1';
+-------+---------+------------+
| SPACE | NAME    | SPACE_TYPE |
+-------+---------+------------+
|     3 | test/t1 | Single     |
+-------+---------+------------+
```

### Observações sobre o uso de criptografia

- Planeje adequadamente quando alterar um espaço de tabela existente com a opção `ENCRYPTION`. A tabela é reconstruída usando o algoritmo `COPY`. O algoritmo `INPLACE` não é suportado.

- Se o servidor sair ou for parado durante o funcionamento normal, recomenda-se reiniciar o servidor usando as mesmas configurações de criptografia configuradas anteriormente.

- A primeira chave de criptografia mestre é gerada quando o primeiro espaço de tabela novo ou existente é criptografado.

- A rotação da chave mestre recripta as chaves dos espaços de tabela, mas não altera a própria chave do espaço de tabela. Para alterar uma chave de espaço de tabela, você deve desabilitar e reativar a criptografia, que é uma operação `ALGORITHM=COPY` que reconstrui a tabela.

- Se uma tabela for criada com as opções `COMPRESSION` e `ENCRYPTION`, a compressão é realizada antes de os dados do espaço de tabela serem criptografados.

- Se um arquivo de dados de chave de registro (o arquivo nomeado por `keyring_file_data` ou `keyring_encrypted_file_data`) estiver vazio ou ausente, a primeira execução da instrução `ALTER INSTANCE ROTATE INNODB MASTER KEY` cria uma chave de criptografia mestre.

- A desinstalação do plugin `keyring_file` ou `keyring_encrypted_file` não remove um arquivo de dados de chave existente.

- Recomenda-se que você não coloque um arquivo de dados de chave de registro no mesmo diretório que os arquivos de dados do espaço de tabelas.

- A modificação da configuração `keyring_file_data` ou `keyring_encrypted_file_data` durante a execução ou ao reiniciar o servidor pode fazer com que os espaços de tabela criptografados anteriormente tornem-se inacessíveis, resultando na perda de dados.

### Limitações de criptografia

- O Padrão de Criptografia Avançada (AES) é o único algoritmo de criptografia suportado. A criptografia de dados em repouso do `InnoDB` usa o modo de criptografia de bloco de código eletrônico (ECB) para a criptografia da chave do espaço de tabela e o modo de criptografia de bloco de cadeia de cifra (CBC) para a criptografia dos dados. O enchimento não é usado com o modo de criptografia de bloco CBC. Em vez disso, o `InnoDB` garante que o texto a ser criptografado seja um múltiplo do tamanho do bloco.

- A alteração do atributo `ENCRYPTION` de uma tabela é realizada usando o algoritmo `COPY`. O algoritmo `INPLACE` não é suportado.

- A criptografia só é suportada para espaços de tabela por arquivo. A criptografia não é suportada para outros tipos de espaços de tabela, incluindo espaços de tabela gerais e o espaço de tabela do sistema.

- Você não pode mover ou copiar uma tabela de um espaço de tabela criptografado por tabela para um tipo de espaço de tabela que não suporte criptografia.

- A criptografia só se aplica aos dados no espaço de tabelas. Os dados não são criptografados no log de reversão, no log de desfazer ou no log binário.

- Não é permitido alterar o motor de armazenamento de uma tabela que esteja localizada em um espaço de tabelas criptografado ou que tenha estado localizada em um espaço de tabelas criptografado.

- A criptografia não é suportada para as tabelas de índice `FULLTEXT` do `InnoDB` que são criadas implicitamente ao adicionar um índice `FULLTEXT`. Para informações relacionadas, consulte Tabelas de índice de texto completo do InnoDB.
