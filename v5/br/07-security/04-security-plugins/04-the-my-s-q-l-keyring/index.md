### 6.4.4 O Keyring do MySQL

O MySQL Server suporta um conjunto de chaves que permite que os componentes internos do servidor e os plugins armazem informações sensíveis de forma segura para recuperação posterior. A implementação inclui esses elementos:

- Plugins de chaveiro que gerenciam um armazenamento de backup ou se comunicam com um backend de armazenamento. Esses plugins de chaveiro estão disponíveis:

  - `keyring_file`: Armazena os dados do bloco de chaves em um arquivo local ao hospedeiro do servidor. Disponível nas distribuições MySQL Community Edition e MySQL Enterprise Edition a partir do MySQL 5.7.11. Consulte Seção 6.4.4.2, “Usando o plugin de bloco de chaves baseado em arquivo keyring_file”.

  - `keyring_encrypted_file`: Armazena os dados do bloco de chaves em um arquivo criptografado e protegido por senha, localizado no host do servidor. Disponível nas distribuições da MySQL Enterprise Edition a partir do MySQL 5.7.21. Consulte Seção 6.4.4.3, “Uso do plugin de bloco de chaves com arquivo criptografado keyring_encrypted_file”.

  - `keyring_okv`: Um plugin KMIP 1.1 para uso com produtos de armazenamento de chaveiro de backend compatíveis com KMIP, como o Oracle Key Vault e o Gemalto SafeNet KeySecure Appliance. Disponível nas distribuições da MySQL Enterprise Edition a partir do MySQL 5.7.12. Veja Seção 6.4.4.4, “Usando o plugin KMIP keyring_okv”.

  - `keyring_aws`: Comunica-se com o Serviço de Gerenciamento de Chaves do Amazon Web Services para a geração de chaves e utiliza um arquivo local para armazenamento de chaves. Disponível nas distribuições da MySQL Enterprise Edition a partir do MySQL 5.7.19. Consulte Seção 6.4.4.5, “Uso do plugin keyring_aws do Amazon Web Services Keyring”.

- Uma interface de serviço de chave de chave para gerenciamento de chaves de chave (MySQL 5.7.13 e superior). Este serviço é acessível em dois níveis:

  - Interface SQL: Nas instruções SQL, consulte as funções descritas em Seção 6.4.4.8, “Funções de gerenciamento de chaves do carteiro de propósito geral”.

  - Interface C: No código em C, chame as funções do serviço de chave de acesso descritas em Seção 5.5.6.2, “O Serviço de Chave de Acesso”.

- Uma capacidade migratória fundamental. O MySQL 5.7.21 e versões superiores suportam a migração de chaves entre keystores, permitindo que os administradores de banco de dados mudem uma instalação do MySQL de um keystore para outro. Consulte Seção 6.4.4.7, “Migração de Chaves entre Keystores de Keyring”.

Aviso

Para a gestão de chaves de criptografia, os plugins `keyring_file` e `keyring_encrypted_file` não são destinados como uma solução de conformidade regulatória. Padrões de segurança como PCI, FIPS e outros exigem o uso de sistemas de gerenciamento de chaves para proteger, gerenciar e proteger as chaves de criptografia em cofres de chaves ou módulos de segurança de hardware (HSMs).

Entre os consumidores do serviço de chave de criptografia no MySQL estão:

- O mecanismo de armazenamento `InnoDB` usa o chaveiro para armazenar sua chave para a criptografia do espaço de tabelas. Veja Seção 14.14, “Criptografia de Dados em Repouso do InnoDB”.

- O MySQL Enterprise Audit usa a chave de criptografia para armazenar a senha do arquivo de registro de auditoria. Consulte Criptografando arquivos de registro de auditoria.

Para obter instruções gerais de instalação do bloco de teclas, consulte Seção 6.4.4.1, “Instalação do Plugin do Bloco de Teclas”. Para obter informações de instalação e configuração específicas de um plugin de bloco de teclas determinado, consulte a seção que descreve esse plugin.

Para obter informações sobre o uso das funções do chaveiro, consulte Seção 6.4.4.8, “Funções de gerenciamento de chaves do chaveiro de propósito geral”.

Os plugins e funções de chaveiro acessam um serviço de chaveiro que fornece a interface para o chaveiro. Para obter informações sobre como acessar esse serviço e escrever plugins de chaveiro, consulte Seção 5.5.6.2, “O Serviço de Chaveiro” e Escrevendo Plugins de Chaveiro.
