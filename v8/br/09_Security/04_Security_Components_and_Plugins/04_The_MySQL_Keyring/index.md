### 8.4.4 O Keyring do MySQL

8.4.4.1 Componentes do cartela de identificação versus plugins do cartela de identificação

8.4.4.2 Instalação do componente do cartela de identificação

8.4.4.3 Instalação do Plugin para Carteira de Chave

8.4.4.4 Usando o componente\_keyring\_file Componentes de cartela de chaves baseados em arquivos

8.4.4.5 Usando o componente\_keyring\_encrypted\_file Componente de cartela de chaves criptografado com arquivo

8.4.4.6 Usando o plugin de cartela de chaves baseado em arquivo keyring\_file

8.4.4.7 Usando o plugin de cartela de chaves com arquivo criptografado keyring\_encrypted\_file

8.4.4.8 Usando o plugin KMIP keyring\_okv

8.4.4.9 Usando o plugin Amazon Web Services Keyring keyring\_aws

8.4.4.10 Usando o Plugin de Carteira de Chaves HashiCorp Vault

8.4.4.11 Usando o componente de cartela de chaves do Oracle Cloud Infrastructure

8.4.4.12 Usando o Plugin de Carteira de Chaves do Oracle Cloud Infrastructure

8.4.4.13 Tipos e comprimentos de chaves de cartela de identificação suportados

8.4.4.14 Migração de Chaves entre Keystores do Keyring

8.4.4.15 Funções de gerenciamento de chaves do porta-chaves de uso geral

8.4.4.16 Funções de Gerenciamento de Chaves do Carteira de Plugins

8.4.4.17 Metadados do cartela de identificação

8.4.4.18 Opções de comando do cartela de identificação

8.4.4.19 Variáveis do Sistema de Carteira de Chave

O MySQL Server suporta um conjunto de chaves que permite que os componentes internos do servidor e os plugins armazem informações sensíveis de forma segura para recuperação posterior. A implementação inclui esses elementos:

- Componentes e plugins do Keyring que gerenciam um armazenamento de backup ou se comunicam com um backend de armazenamento. O uso do Keyring envolve a instalação de um dos componentes e plugins disponíveis. Tanto os componentes quanto os plugins do Keyring gerenciam os dados do Keyring, mas são configurados de maneira diferente e podem ter diferenças operacionais (consulte a Seção 8.4.4.1, “Componentes do Keyring versus Plugins do Keyring”).

  Estes componentes do chaveiro estão disponíveis:

  - `component_keyring_file`: Armazena os dados do bloco de chaves em um arquivo local ao hospedeiro do servidor. Disponível nas distribuições MySQL Community Edition e MySQL Enterprise Edition a partir do MySQL 8.0.24. Consulte a Seção 8.4.4.4, “Usando o componente\_keyring\_file Component Component File-Based Keyring”.

  - `component_keyring_encrypted_file`: Armazena os dados do bloco de chaves em um arquivo criptografado e protegido por senha, localizado no host do servidor. Disponível nas distribuições da Edição Empresarial do MySQL a partir do MySQL 8.0.24. Consulte a Seção 8.4.4.5, “Usando o componente\_keyring\_encrypted\_file Component Encrypted File-Based Keyring”.

  - `component_keyring_oci`: Armazena dados do chaveiro no Oracle Cloud Infrastructure Vault. Disponível nas distribuições da MySQL Enterprise Edition a partir do MySQL 8.0.31. Consulte a Seção 8.4.4.11, “Usando o componente de chaveiro do Oracle Cloud Infrastructure Vault”.

  Estes plugins para chaveiros estão disponíveis:

  - `keyring_file` (desatualizado a partir do MySQL 8.0.34): Armazena os dados do bloco de chaves em um arquivo localizado no host do servidor. Disponível nas distribuições MySQL Community Edition e MySQL Enterprise Edition. Consulte a Seção 8.4.4.6, “Usando o plugin de bloco de chaves baseado em arquivo keyring\_file”.

  - `keyring_encrypted_file` (desatualizado a partir do MySQL 8.0.34): Armazena os dados do bloco de chaves em um arquivo criptografado e protegido por senha, localizado no host do servidor. Disponível nas distribuições da Edição Empresarial do MySQL. Consulte a Seção 8.4.4.7, “Usando o plugin de bloco de chaves criptografado keyring\_encrypted\_file”.

  - `keyring_okv`: Um plugin KMIP 1.1 para uso com produtos de armazenamento de chaveiros de back-end compatíveis com KMIP, como o Oracle Key Vault e o Gemalto SafeNet KeySecure Appliance. Disponível nas distribuições da Edição Empresarial do MySQL. Veja a Seção 8.4.4.8, “Usando o plugin keyring\_okv KMIP”.

  - `keyring_aws`: Comunica-se com o Serviço de Gerenciamento de Chaves do Amazon Web Services para a geração de chaves e utiliza um arquivo local para armazenamento de chaves. Disponível nas distribuições da Edição Empresarial do MySQL. Consulte a Seção 8.4.4.9, “Usando o plugin keyring\_aws Amazon Web Services Keyring”.

  - `keyring_hashicorp`: Comunica-se com o HashiCorp Vault para armazenamento no back-end. Disponível nas distribuições da MySQL Enterprise Edition a partir do MySQL 8.0.18. Consulte a Seção 8.4.4.10, “Usando o Plugin de Keyring do HashiCorp Vault”.

  - `keyring_oci` (desatualizado a partir do MySQL 8.0.31): Comunica-se com o Oracle Cloud Infrastructure Vault para armazenamento de backend. Disponível nas distribuições da MySQL Enterprise Edition a partir do MySQL 8.0.22. Consulte a Seção 8.4.4.12, “Usando o Plugin de Keychain do Oracle Cloud Infrastructure Vault”.

- Uma interface de serviço de chave de chave para gerenciamento de chaves de chave. Este serviço é acessível em dois níveis:

  - Interface SQL: Nas instruções SQL, chame as funções descritas na Seção 8.4.4.15, “Funções de Gerenciamento de Chave do Carteiro de Propósito Geral”.

  - Interface C: No código em C, chame as funções do serviço de chave de registro descritas na Seção 7.6.9.2, “O Serviço de Chave de Registro”.

- Acesso a metadados principais:

  - A tabela Schema de Desempenho `keyring_keys` exibe metadados para as chaves no conjunto de chaves. Os metadados das chaves incluem IDs de chave, proprietários de chave e IDs de chave de backend. A tabela `keyring_keys` não exibe nenhum dado sensível do conjunto de chaves, como o conteúdo das chaves. Disponível a partir do MySQL 8.0.16. Veja a Seção 29.12.18.2, “A tabela keyring\_keys”.

  - A tabela Schema de Desempenho `keyring_component_status` fornece informações de status sobre o componente de chave de segurança em uso, se estiver instalado. Disponível a partir do MySQL 8.0.24. Consulte a Seção 29.12.18.1, “A tabela keyring\_component\_status”.

- Uma capacidade migratória fundamental. O MySQL suporta a migração de chaves entre keystores, permitindo que os administradores de banco de dados mudem uma instalação do MySQL de um keystore para outro. Veja a Seção 8.4.4.14, “Migrar Chaves entre Keystores de Keyring”.

- A implementação de plugins de chave de segurança é revisada a partir do MySQL 8.0.24 para usar a infraestrutura do componente. Isso é facilitado usando o plugin embutido chamado `daemon_keyring_proxy_plugin` que atua como uma ponte entre as APIs do serviço de componente e do plugin. Veja a Seção 7.6.8, “O Plugin de Ponte do Proxy de Chave de Segurança”.

Aviso

Para a gestão de chaves de criptografia, os componentes `component_keyring_file` e `component_keyring_encrypted_file` e os plugins `keyring_file` e `keyring_encrypted_file` não são destinados como uma solução de conformidade regulatória. Padrões de segurança como PCI, FIPS e outros exigem o uso de sistemas de gerenciamento de chaves para proteger, gerenciar e proteger as chaves de criptografia em cofres de chaves ou módulos de segurança de hardware (HSMs).

Entre os consumidores do serviço de chave de criptografia no MySQL estão:

- O mecanismo de armazenamento `InnoDB` utiliza o chaveiro para armazenar sua chave para a criptografia do espaço de tabelas. Veja a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”.

- O MySQL Enterprise Audit usa a chave de criptografia para armazenar a senha do arquivo de registro de auditoria. Veja Criptografar arquivos de registro de auditoria.

- A gestão de logs binários e logs de retransmissão suporta a criptografia baseada em chave de criptografia de arquivos de log. Com a criptografia de arquivos de log ativada, a chave de criptografia armazena as chaves usadas para criptografar senhas para os arquivos de log binários e arquivos de log de retransmissão. Consulte a Seção 19.3.2, “Criptografando Arquivos de Log Binários e Arquivos de Log de Retransmissão”.

- A chave mestre para descriptografar a chave do arquivo que descriptografa os valores persistentes de variáveis de sistema sensíveis é armazenada no conjunto de chaves. Um componente do conjunto de chaves deve ser habilitado na instância do servidor MySQL para suportar o armazenamento seguro dos valores persistentes de variáveis de sistema, em vez de um plugin de conjunto de chaves, que não suportam essa função. Veja Persistência de Variáveis de Sistema Sensíveis.

Para obter instruções gerais de instalação do bloco de teclas, consulte a Seção 8.4.4.2, “Instalação do Componente do Bloco de Teclas”, e a Seção 8.4.4.3, “Instalação do Plugin do Bloco de Teclas”. Para obter informações de instalação e configuração específicas de um componente ou plugin do bloco de teclas, consulte a seção que o descreve.

Para obter informações sobre o uso das funções do chaveiro, consulte a Seção 8.4.4.15, “Funções de Gerenciamento de Chaves do Chaveiro de Uso Geral”.

Componentes de cartela de identificação, plugins e funções acessam um serviço de cartela de identificação que fornece a interface para a cartela de identificação. Para obter informações sobre como acessar esse serviço e escrever plugins para a cartela de identificação, consulte a Seção 7.6.9.2, “O Serviço de Cartela de Identificação” e Escrevendo Plugins para a Cartela de Identificação.
