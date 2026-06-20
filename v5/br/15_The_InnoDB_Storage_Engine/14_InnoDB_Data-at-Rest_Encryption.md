## 14.14 Encriptação de dados em repouso do InnoDB

`InnoDB` suporta criptografia de dados em repouso para espaços de tabela por tabela.

* Sobre a criptografia de dados em repouso
* Requisitos de criptografia
* Habilitação da criptografia de tablespace de arquivo por tabela
* Rotação da chave mestre
* Criptografia e recuperação
* Exportação de tablespaces criptografados
* Criptografia e replicação
* Identificação de tablespaces criptografados
* Notas sobre o uso da criptografia
* Limitações da criptografia

### Sobre a criptografia de dados em repouso

`InnoDB` utiliza uma arquitetura de chave de criptografia de dois níveis, composta por uma chave de criptografia mestre e chaves de espaço de tabelas. Quando um espaço de tabelas é criptografado, uma chave de espaço de tabelas é criptografada e armazenada no cabeçalho do espaço de tabelas. Quando uma aplicação ou um usuário autenticado deseja acessar dados criptografados, `InnoDB` usa uma chave de criptografia mestre para descriptografar a chave de espaço de tabelas. A versão descriptografada de uma chave de espaço de tabelas nunca muda, mas a chave de criptografia mestre pode ser alterada conforme necessário. Essa ação é referida como *rotação da chave mestre*.

O recurso de criptografia de dados em repouso depende de um plugin de chave de criptografia mestre para gerenciamento de chave.

Todas as edições do MySQL fornecem um plugin `keyring_file`, que armazena dados do chaveiro em um arquivo localizado no host do servidor.

A Edição Empresarial do MySQL oferece plugins adicionais para chaveiro:

* `keyring_encrypted_file`: Armazena dados do chaveiro em um arquivo criptografado e protegido por senha, localizado no servidor.

* `keyring_okv`: Um plugin KMIP 1.1 para uso com produtos de armazenamento de chave de rede compatíveis com KMIP. Os produtos compatíveis com KMIP suportados incluem soluções de gerenciamento de chave centralizadas, como o Oracle Key Vault, Gemalto KeySecure, o servidor de gerenciamento de chave Thales Vormetric e o Fornetix Key Orchestration.

* `keyring_aws`: Comunica-se com o Serviço de Gerenciamento de Chave do Amazon Web Services (AWS KMS) como um backend para geração de chave e utiliza um arquivo local para armazenamento de chave.

Aviso

Para o gerenciamento de chaves de criptografia, os plugins `keyring_file` e `keyring_encrypted_file` não são destinados como uma solução de conformidade regulatória. Padrões de segurança, como PCI, FIPS e outros, exigem o uso de sistemas de gerenciamento de chaves para proteger, gerenciar e proteger as chaves de criptografia em cofres de chave ou módulos de segurança de hardware (HSMs).

Uma solução segura e robusta de gerenciamento de chave de criptografia é fundamental para a segurança e para o cumprimento de vários padrões de segurança. Quando o recurso de criptografia de dados em repouso utiliza uma solução centralizada de gerenciamento de chave, o recurso é referido como "MySQL Enterprise Transparent Data Encryption (TDE)".

O recurso de criptografia de dados em repouso suporta o algoritmo de criptografia baseado em blocos Advanced Encryption Standard (AES). Ele utiliza o modo de criptografia de bloco Electronic Codebook (ECB) para criptografia de chave de espaço de tabela e o modo de criptografia de bloco Cipher Block Chaining (CBC) para criptografia de dados.

Para perguntas frequentes sobre o recurso de criptografia de dados em repouso, consulte a Seção A.17, “Perguntas frequentes do MySQL 5.7: Criptografia de dados em repouso do InnoDB”.

### Pré-requisitos de criptografia

* Um plugin de chave deve ser instalado e configurado. A instalação do plugin de chave é realizada no início usando a opção `early-plugin-load`. O carregamento antecipado garante que o plugin esteja disponível antes da inicialização do motor de armazenamento `InnoDB`. Para instruções de instalação e configuração do plugin de chave, consulte a Seção 6.4.4, “O Keyring MySQL”.

Apenas um plugin de chaveiro deve ser habilitado de cada vez. A habilitação de vários plugins de chaveiro não é suportada e os resultados podem não ser os esperados.

Importante

Uma vez que as tabelas criptografadas são criadas em uma instância do MySQL, o plugin de chave de criptografia que foi carregado ao criar o espaço de tabelas criptografado deve continuar a ser carregado no início usando a opção `early-plugin-load`. Não fazer isso resulta em erros ao iniciar o servidor e durante a recuperação do `InnoDB`.

Para verificar se um plugin de chave de segurança está ativo, use a declaração `SHOW PLUGINS` ou consulte a tabela do Esquema de Informações `PLUGINS`. Por exemplo:

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

* Ao criptografar dados de produção, certifique-se de tomar medidas para evitar a perda da chave de criptografia mestre. * Se a chave de criptografia mestre for perdida, os dados armazenados em arquivos de espaço de tabela criptografados não serão recuperáveis. * Se você usar o plugin `keyring_file` ou `keyring_encrypted_file`, crie um backup do arquivo de dados do chaveiro imediatamente após criar o primeiro arquivo de espaço de tabela criptografado, antes da rotação da chave mestre e após a rotação da chave mestre. A opção de configuração `keyring_file_data` define a localização do arquivo de dados do chaveiro para o plugin `keyring_file`. A opção de configuração `keyring_encrypted_file_data` define a localização do arquivo de dados do chaveiro para o plugin `keyring_encrypted_file`. Se você usar o plugin `keyring_okv` ou `keyring_aws`, certifique-se de que você realizou a configuração necessária. Para instruções, consulte a Seção 6.4.4, “O Keyring do MySQL”.

### Habilitar a criptografia do espaço de tabela por tabela

Para habilitar a criptografia para um novo espaço de tabela por arquivo, especifique a opção `ENCRYPTION` em uma declaração `CREATE TABLE`. O exemplo a seguir assume que `innodb_file_per_table` está habilitado.

```sql
mysql> CREATE TABLE t1 (c1 INT) ENCRYPTION='Y';
```

Para habilitar a criptografia para um espaço de tabela de arquivo existente, especifique a opção `ENCRYPTION` em uma declaração `ALTER TABLE`.

```sql
mysql> ALTER TABLE t1 ENCRYPTION='Y';
```

Para desativar a criptografia para o espaço de tabela por tabela, configure `ENCRYPTION='N'` usando `ALTER TABLE`.

```sql
mysql> ALTER TABLE t1 ENCRYPTION='N';
```

### Rotação da Chave Mestre

A chave de criptografia principal deve ser rotada periodicamente e sempre que você suspeitar que a chave tenha sido comprometida.

A rotação da chave mestre é uma operação atômica e de nível de instância. Toda vez que a chave de criptografia mestre é rotacionada, todas as chaves do espaço de tabelas na instância do MySQL são re-encriptadas e salvas de volta aos respectivos cabeçalhos do espaço de tabelas. Como uma operação atômica, a re-encriptação deve ser bem-sucedida para todas as chaves do espaço de tabelas uma vez que uma operação de rotação é iniciada. Se a rotação da chave mestre for interrompida por uma falha no servidor, `InnoDB` avança a operação no reinício do servidor. Para mais informações, consulte Criptografia e Recuperação.

A rotação da chave de criptografia mestre apenas altera a chave de criptografia mestre e re-encripta as chaves do espaço de tabela. Não descript ou re-encripta os dados associados ao espaço de tabela.

Para rotação da chave de criptografia principal, é necessário o privilégio `SUPER`.

Para rotular a chave de criptografia mestre, execute:

```sql
mysql> ALTER INSTANCE ROTATE INNODB MASTER KEY;
```

`ALTER INSTANCE ROTATE INNODB MASTER KEY` suporta operações DML concorrentes. No entanto, não pode ser executado concorrentemente com operações de criptografia de tablespace, e são tomadas assegurações para evitar conflitos que poderiam surgir da execução concorrente. Se uma operação `ALTER INSTANCE ROTATE INNODB MASTER KEY` estiver em execução, ela deve terminar antes que uma operação de criptografia de tablespace possa prosseguir, e vice-versa.

### Criptografia e Recuperação

Se ocorrer uma falha no servidor durante uma operação de criptografia, a operação é revertida quando o servidor é reiniciado.

Se ocorrer uma falha no servidor durante a rotação da chave mestre, `InnoDB` continua a operação após o reinício do servidor.

O plugin de chave de acesso deve ser carregado antes da inicialização do mecanismo de armazenamento, para que as informações necessárias para descriptografar as páginas de dados do espaço de tabela possam ser recuperadas dos cabeçalhos do espaço de tabela antes da inicialização e das atividades de recuperação do `InnoDB`, permitindo o acesso aos dados do espaço de tabela. (Veja os Requisitos de criptografia.)

Quando a inicialização e recuperação do `InnoDB` começarem, a operação de rotação da chave mestre é retomada. Devido ao mau funcionamento do servidor, algumas chaves do tablespace já podem estar criptografadas usando a nova chave de criptografia mestre. O `InnoDB` lê os dados de criptografia de cada cabeçalho do tablespace e, se os dados indicarem que a chave do tablespace está criptografada usando a chave de criptografia mestre antiga, o `InnoDB` recupera a chave antiga do anel de chaves e a usa para descriptografar a chave do tablespace. O `InnoDB` então recripta a chave do tablespace usando a nova chave de criptografia mestre e salva a chave do tablespace recriptografada de volta ao cabeçalho do tablespace.

### Exportar tabelas espaciais criptografadas

Quando um espaço de tabela criptografado é exportado, `InnoDB` gera uma *chave de transferência* que é usada para criptografar a chave do espaço de tabela. A chave criptografada do espaço de tabela e a chave de transferência são armazenadas em um arquivo `tablespace_name.cfp`. Este arquivo, juntamente com o arquivo do espaço de tabela criptografado, é necessário para realizar uma operação de importação. Na importação, `InnoDB` usa a chave de transferência para descriptografar a chave do espaço de tabela no arquivo `tablespace_name.cfp`. Para informações relacionadas, consulte a Seção 14.6.1.3, “Impor Tabelas InnoDB”.

### Criptografia e Replicação

* A declaração `ALTER INSTANCE ROTATE INNODB MASTER KEY` é apenas suportada em ambientes de replicação onde a fonte e as réplicas executam uma versão do MySQL que suporta criptografia de dados em repouso.

* As declarações bem-sucedidas do `ALTER INSTANCE ROTATE INNODB MASTER KEY` são escritas no log binário para replicação em réplicas.

* Se uma declaração `ALTER INSTANCE ROTATE INNODB MASTER KEY` falhar, ela não é registrada no log binário e não é replicada nas réplicas.

* A replicação de uma operação `ALTER INSTANCE ROTATE INNODB MASTER KEY` falha se o plugin de chave de segurança estiver instalado na fonte, mas não na replica.

* Se o plugin `keyring_file` ou `keyring_encrypted_file` estiver instalado tanto na fonte quanto em uma réplica, mas a réplica não tiver um arquivo de dados de chave, a declaração `ALTER INSTANCE ROTATE INNODB MASTER KEY` replicada cria o arquivo de dados de chave na réplica, assumindo que os dados do arquivo de chave não estejam cacheados na memória. `ALTER INSTANCE ROTATE INNODB MASTER KEY` usa dados do arquivo de chave que estão cacheados na memória, se disponíveis.

### Identificando Espaços de Tabela Encriptados

Quando a opção `ENCRYPTION` é especificada em uma declaração `CREATE TABLE` ou `ALTER TABLE`, ela é registrada na coluna `CREATE_OPTIONS` da tabela do Esquema de Informações `TABLES`. Essa coluna pode ser consultada para identificar tabelas que residem em espaços de tabela criptografados por arquivo por tabela.

```sql
mysql> SELECT TABLE_SCHEMA, TABLE_NAME, CREATE_OPTIONS FROM INFORMATION_SCHEMA.TABLES
       WHERE CREATE_OPTIONS LIKE '%ENCRYPTION%';
+--------------+------------+----------------+
| TABLE_SCHEMA | TABLE_NAME | CREATE_OPTIONS |
+--------------+------------+----------------+
| test         | t1         | ENCRYPTION="Y" |
+--------------+------------+----------------+
```

Faça uma consulta a `INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES` para obter informações sobre o tablespace associado a um esquema e uma tabela em particular.

```sql
mysql> SELECT SPACE, NAME, SPACE_TYPE FROM INFORMATION_SCHEMA.INNODB_SYS_TABLESPACES WHERE NAME='test/t1';
+-------+---------+------------+
| SPACE | NAME    | SPACE_TYPE |
+-------+---------+------------+
|     3 | test/t1 | Single     |
+-------+---------+------------+
```

### Notas sobre o uso de criptografia

* Planeje adequadamente ao alterar um espaço de tabela existente com a opção `ENCRYPTION`. A tabela é reconstruída usando o algoritmo `COPY`. O algoritmo `INPLACE` não é suportado.

* Se o servidor sair ou for parado durante o funcionamento normal, é recomendável reiniciar o servidor usando as mesmas configurações de criptografia que foram configuradas anteriormente.

* A primeira chave de criptografia mestre é gerada quando o primeiro espaço de tabela novo ou existente é criptografado.

* A rotação da chave mestre re-encripta as chaves dos espaços de tabela, mas não altera a própria chave do espaço de tabela. Para alterar uma chave de espaço de tabela, você deve desabilitar e reativar a criptografia, que é uma operação `ALGORITHM=COPY` que reconstrui a tabela.

* Se uma tabela for criada com as opções `COMPRESSION` e `ENCRYPTION`, a compressão é realizada antes dos dados do espaço de tabela serem criptografados.

* Se um arquivo de dados de chave de acesso (o arquivo denominado por `keyring_file_data` ou `keyring_encrypted_file_data`) estiver vazio ou ausente, a primeira execução de `ALTER INSTANCE ROTATE INNODB MASTER KEY` cria uma chave de criptografia mestre.

* A desinstalação do plugin `keyring_file` ou `keyring_encrypted_file` não remove um arquivo de dados de chave existente.

* É recomendável que você não coloque um arquivo de dados de chave de acesso no mesmo diretório que os arquivos de dados do espaço de tabela.

* A modificação do ajuste `keyring_file_data` ou `keyring_encrypted_file_data` em tempo de execução ou ao reiniciar o servidor pode fazer com que os espaços de tabela previamente criptografados tornem-se inacessíveis, resultando na perda de dados.

### Limitações de criptografia

O Padrão de Criptografia Avançada (AES) é o único algoritmo de criptografia suportado. A criptografia de dados em repouso `InnoDB` utiliza o modo de criptografia de bloco de Código Eletrônico (ECB) para a criptografia da chave do espaço de tabela e o modo de criptografia de bloco de Cadeia de Bloco (CBC) para a criptografia dos dados. O preenchimento não é usado com o modo de criptografia de bloco CBC. Em vez disso, `InnoDB` garante que o texto a ser criptografado seja um múltiplo do tamanho do bloco.

* A alteração do atributo `ENCRYPTION` de uma tabela é realizada usando o algoritmo `COPY`. O algoritmo `INPLACE` não é suportado.

* O criptograma é suportado apenas para espaços de tabela por arquivo. O criptograma não é suportado para outros tipos de espaço de tabela, incluindo espaços de tabela gerais e o espaço de tabela do sistema.

* Não é possível mover ou copiar uma tabela de um espaço de tabela criptografado para um tipo de espaço de tabela que não suporte criptografia.

* A criptografia só se aplica aos dados no espaço de tabela. Os dados não são criptografados no log de refazer, no log de desfazer ou no log binário.

* Não é permitido alterar o mecanismo de armazenamento de uma tabela que reside em ou que anteriormente residia em um espaço de tabelas criptografado.

* A criptografia não é suportada para as tabelas de índice `InnoDB` `FULLTEXT` que são criadas implicitamente ao adicionar um índice `FULLTEXT`. Para informações relacionadas, consulte Tabelas de índice de texto completo InnoDB.