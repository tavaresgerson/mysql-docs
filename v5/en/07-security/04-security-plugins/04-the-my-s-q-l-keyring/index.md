### 6.4.4 O Keyring do MySQL

[6.4.4.1 Instalação do Plugin Keyring](keyring-plugin-installation.html)

[6.4.4.2 Usando o Plugin Keyring Baseado em Arquivo keyring_file](keyring-file-plugin.html)

[6.4.4.3 Usando o Plugin Keyring Baseado em Arquivo Criptografado keyring_encrypted_file](keyring-encrypted-file-plugin.html)

[6.4.4.4 Usando o Plugin KMIP keyring_okv](keyring-okv-plugin.html)

[6.4.4.5 Usando o Plugin Keyring Amazon Web Services keyring_aws](keyring-aws-plugin.html)

[6.4.4.6 Tipos e Tamanhos de Keyring Key Suportados](keyring-key-types.html)

[6.4.4.7 Migrando Keys Entre Keyring Keystores](keyring-key-migration.html)

[6.4.4.8 Funções Key-Management de Propósito Geral do Keyring](keyring-functions-general-purpose.html)

[6.4.4.9 Funções Key-Management do Keyring Específicas do Plugin](keyring-functions-plugin-specific.html)

[6.4.4.10 Metadados do Keyring](keyring-metadata.html)

[6.4.4.11 Opções de Comando do Keyring](keyring-options.html)

[6.4.4.12 Variáveis de Sistema do Keyring](keyring-system-variables.html)

O MySQL Server suporta um *keyring* que permite que componentes internos do servidor e *plugins* armazenem informações confidenciais de forma segura para posterior recuperação. A implementação abrange estes elementos:

* Plugins Keyring que gerenciam um armazenamento de suporte (*backing store*) ou se comunicam com um *storage back end*. Estes *plugins* Keyring estão disponíveis:

  + `keyring_file`: Armazena dados do Keyring em um arquivo local no host do servidor. Disponível nas distribuições MySQL Community Edition e MySQL Enterprise Edition a partir do MySQL 5.7.11. Consulte [Seção 6.4.4.2, “Usando o Plugin Keyring Baseado em Arquivo keyring_file”](keyring-file-plugin.html "6.4.4.2 Usando o Plugin Keyring Baseado em Arquivo keyring_file").

  + `keyring_encrypted_file`: Armazena dados do Keyring em um arquivo criptografado e protegido por senha local ao host do servidor. Disponível nas distribuições MySQL Enterprise Edition a partir do MySQL 5.7.21. Consulte [Seção 6.4.4.3, “Usando o Plugin Keyring Baseado em Arquivo Criptografado keyring_encrypted_file”](keyring-encrypted-file-plugin.html "6.4.4.3 Usando o Plugin Keyring Baseado em Arquivo Criptografado keyring_encrypted_file").

  + `keyring_okv`: Um *plugin* KMIP 1.1 para uso com produtos de armazenamento *back end* Keyring compatíveis com KMIP, como Oracle Key Vault e Gemalto SafeNet KeySecure Appliance. Disponível nas distribuições MySQL Enterprise Edition a partir do MySQL 5.7.12. Consulte [Seção 6.4.4.4, “Usando o Plugin KMIP keyring_okv”](keyring-okv-plugin.html "6.4.4.4 Usando o Plugin KMIP keyring_okv").

  + `keyring_aws`: Comunica-se com o Amazon Web Services Key Management Service para geração de *key* e usa um arquivo local para armazenamento de *key*. Disponível nas distribuições MySQL Enterprise Edition a partir do MySQL 5.7.19. Consulte [Seção 6.4.4.5, “Usando o Plugin Keyring Amazon Web Services keyring_aws”](keyring-aws-plugin.html "6.4.4.5 Usando o Plugin Keyring Amazon Web Services keyring_aws").

* Uma interface de *service* Keyring para *key management* do Keyring (MySQL 5.7.13 e superior). Este *service* é acessível em dois níveis:

  + Interface SQL: Em comandos SQL, chame as funções descritas na [Seção 6.4.4.8, “Funções Key-Management de Propósito Geral do Keyring”](keyring-functions-general-purpose.html "6.4.4.8 Funções Key-Management de Propósito Geral do Keyring").

  + Interface C: Em código C, chame as funções do *service* Keyring descritas na [Seção 5.5.6.2, “O Keyring Service”](keyring-service.html "5.5.6.2 O Keyring Service").

* Uma capacidade de migração de *key*. O MySQL 5.7.21 e superior suporta a migração de *keys* entre *keystores*, permitindo que DBAs mudem uma instalação MySQL de um *keystore* para outro. Consulte [Seção 6.4.4.7, “Migrando Keys Entre Keyring Keystores”](keyring-key-migration.html "6.4.4.7 Migrando Keys Entre Keyring Keystores").

Aviso

Para *key management* de criptografia, os *plugins* `keyring_file` e `keyring_encrypted_file` não são destinados a ser uma solução de conformidade regulatória. Padrões de segurança como PCI, FIPS e outros exigem o uso de sistemas de *key management* para proteger, gerenciar e resguardar *encryption keys* em *key vaults* ou *hardware security modules* (HSMs).

Dentro do MySQL, os consumidores do *keyring service* incluem:

* O *storage engine* `InnoDB` usa o Keyring para armazenar sua *key* para criptografia de *tablespace*. Consulte [Seção 14.14, “Criptografia de Dados em Repouso (Data-at-Rest) do InnoDB”](innodb-data-encryption.html "14.14 Criptografia de Dados em Repouso (Data-at-Rest) do InnoDB").

* O MySQL Enterprise Audit usa o Keyring para armazenar a senha de criptografia do arquivo de *audit log*. Consulte [Criptografando Arquivos de Audit Log](audit-log-logging-configuration.html#audit-log-file-encryption "Criptografando Arquivos de Audit Log").

Para instruções gerais de instalação do Keyring, consulte [Seção 6.4.4.1, “Instalação do Plugin Keyring”](keyring-plugin-installation.html "6.4.4.1 Instalação do Plugin Keyring"). Para informações de instalação e configuração específicas de um determinado *plugin* Keyring, consulte a seção que descreve esse *plugin*.

Para informações sobre o uso das funções do Keyring, consulte [Seção 6.4.4.8, “Funções Key-Management de Propósito Geral do Keyring”](keyring-functions-general-purpose.html "6.4.4.8 Funções Key-Management de Propósito Geral do Keyring").

Os *plugins* e funções Keyring acessam um *keyring service* que fornece a interface para o Keyring. Para informações sobre como acessar este *service* e escrever *plugins* Keyring, consulte [Seção 5.5.6.2, “O Keyring Service”](keyring-service.html "5.5.6.2 O Keyring Service") e [Escrevendo Keyring Plugins](/doc/extending-mysql/5.7/en/writing-keyring-plugins.html).