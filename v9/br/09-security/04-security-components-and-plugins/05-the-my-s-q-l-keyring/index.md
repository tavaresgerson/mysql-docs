### 8.4.5 O Keyring do MySQL

8.4.5.1 Componentes do Keyring e Plugins do Keyring

8.4.5.2 Instalação de Componentes do Keyring

8.4.5.3 Instalação de Plugins do Keyring

8.4.5.4 Uso do componente_keyring_file Componente do Keyring com Arquivo de Dados

8.4.5.5 Uso do componente_keyring_encrypted_file Componente do Keyring com Arquivo Encriptado

8.4.5.6 Uso do plugin_keyring_okv Plugin KMIP do HashiCorp

8.4.5.7 Uso do componente_keyring_kmip Componente KMIP do HashiCorp

8.4.5.8 Uso do plugin_keyring_aws Plugin do Keyring do Amazon Web Services

8.4.5.9 Uso do componente_keyring_aws Componente AWS do Keyring do HashiCorp

8.4.5.10 Uso do plugin_vault_keyring Plugin do Keyring do Vault da HashiCorp

8.4.5.11 Uso do componente_vault_keyring Plugin do Keyring do Vault da HashiCorp

8.4.5.12 Uso do componente_vault_keyring Plugin do Keyring do Vault da Oracle Cloud Infrastructure

8.4.5.13 Tipos e comprimentos de chaves suportados pelo Keyring

8.4.5.14 Migração de chaves entre Keyring Keystores

8.4.5.15 Funções de gerenciamento de chaves do Keyring de propósito geral

8.4.5.16 Funções de gerenciamento de chaves do Keyring específicas de plugins

8.4.5.17 Metadados do Keyring

8.4.5.18 Opções de comando do Keyring

O servidor MySQL suporta um keyring que permite que componentes e plugins internos do servidor armazenem informações sensíveis de forma segura para recuperação posterior. A implementação compreende esses elementos:

* Componentes e plugins do Keyring que gerenciam um armazenamento de suporte ou se comunicam com um backend de armazenamento. O uso do Keyring envolve a instalação de um dos componentes e plugins disponíveis. Tanto os componentes quanto os plugins do Keyring gerenciam dados do keyring, mas são configurados de maneira diferente e podem ter diferenças operacionais (consulte a Seção 8.4.5.1, “Componentes do Keyring Versus Plugins do Keyring”).

  Esses componentes do Keyring estão disponíveis:

+ `component_keyring_file`: Armazena dados do carteiro em um arquivo local ao hospedeiro do servidor. Disponível nas distribuições MySQL Community Edition e MySQL Enterprise Edition. Veja a Seção 8.4.5.4, “Usando o componente_keyring_file Componente de Carteiro com Arquivo Baseado em Arquivo”.

  + `component_keyring_encrypted_file`: Armazena dados do carteiro em um arquivo criptografado e protegido por senha local ao hospedeiro do servidor. Disponível nas distribuições MySQL Enterprise Edition. Veja a Seção 8.4.5.5, “Usando o componente_keyring_encrypted_file Componente de Carteiro com Arquivo Baseado em Arquivo Criptografado”.

  + `component_keyring_oci`: Armazena dados do carteiro no Vault da Oracle Cloud Infrastructure. Disponível nas distribuições MySQL Enterprise Edition. Veja a Seção 8.4.5.12, “Usando o componente_keyring_oci Vault de Infraestrutura da Nuvem da Oracle”.

  + `component_keyring_aws`: Comunica-se com o Serviço de Gerenciamento de Chaves da Amazon Web Services para geração de chaves e usa um arquivo local para armazenamento de chaves. Disponível nas distribuições MySQL Enterprise Edition. Veja a Seção 8.4.5.9, “Usando o componente_keyring_aws Componente de Carteiro AWS”.

  + `component_keyring_hashicorp`: Comunica-se com o Vault da HashiCorp para armazenamento no back-end. Disponível nas distribuições MySQL Enterprise Edition. Veja a Seção 8.4.5.11, “Usando o componente_keyring_hashicorp Vault de Chaves”.

Estes plugins de carteiro estão disponíveis:

  + `keyring_okv`: Um plugin KMIP 1.1 para uso com produtos de armazenamento de carteiro de back-end compatíveis com KMIP, como o Oracle Key Vault e o Gemalto SafeNet KeySecure Appliance. Disponível nas distribuições MySQL Enterprise Edition. Veja a Seção 8.4.5.6, “Usando o plugin_keyring_okv KMIP”.

+ `keyring_aws`: (*Descontinuado*) Comunica-se com o Serviço de Gerenciamento de Chaves do Amazon Web Services para geração e criptografia de chaves, usando um arquivo local para armazenamento de chaves. Disponível nas distribuições da Edição Empresarial do MySQL. Veja a Seção 8.4.5.8, “Usando o Plugin de Cadastro de Chaves Amazon Web Services keyring_aws”.

  + (*Descontinuado*) `keyring_hashicorp`: Comunica-se com o HashiCorp Vault para armazenamento de dados no back-end. Disponível nas distribuições da Edição Empresarial do MySQL. Veja a Seção 8.4.5.10, “Usando o Plugin de Cadastro de Chaves HashiCorp Vault”.

* Uma interface de serviço de cadastro de chaves para gerenciamento de chaves do cadastro de chaves. Este serviço é acessível em dois níveis:

  + Interface SQL: Em instruções SQL, chame as funções descritas na Seção 8.4.5.15, “Funções de Gerenciamento de Chaves de Cadastro de Propósito Geral”.

  + Interface C: Em código em C, chame as funções do serviço de cadastro de chaves descritas na Seção 7.6.8.2, “O Serviço de Cadastro de Chaves”.

* Acesso a metadados de chaves:

  + A tabela `keyring_keys` do Schema de Desempenho exibe metadados para as chaves no cadastro de chaves. Os metadados das chaves incluem IDs de chave, proprietários de chave e IDs de chave de back-end. A tabela `keyring_keys` não exibe nenhum dado sensível do cadastro de chaves, como o conteúdo das chaves. Veja a Seção 29.12.18.2, “A tabela keyring_keys”.

  + A tabela `keyring_component_status` do Schema de Desempenho fornece informações de status sobre o componente de cadastro de chaves em uso, se um estiver instalado. Veja a Seção 29.12.18.1, “A tabela keyring_component_status”.

* Uma capacidade de migração de chaves. O MySQL suporta a migração de chaves entre cadastros de chaves, permitindo que os DBAs mudem uma instalação do MySQL de um cadastro de chaves para outro. Veja a Seção 8.4.5.14, “Migrando Chaves Entre Cadastros de Chaves de Cadastro”.

* A implementação de plugins de chave de segurança é revisada para usar a infraestrutura do componente. Isso é facilitado usando o plugin embutido chamado `daemon_keyring_proxy_plugin` que atua como uma ponte entre o plugin e as APIs do serviço de componente. Veja a Seção 7.6.7, “O Plugin de Ponte do Proxy de Chave de Segurança”.

Aviso

Para a gestão de chaves de criptografia, os componentes `component_keyring_file` e `component_keyring_encrypted_file` não são destinados como uma solução de conformidade regulatória. Padrões de segurança como PCI, FIPS e outros exigem o uso de sistemas de gestão de chaves para proteger, gerenciar e proteger as chaves de criptografia em cofres de chaves ou módulos de segurança de hardware (HSMs).

Dentro do MySQL, os consumidores do serviço de chave de segurança incluem:

* O motor de armazenamento `InnoDB` usa a chave de segurança para armazenar sua chave para a criptografia de espaço de tabela. Veja a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”.

* O MySQL Enterprise Audit usa a chave de segurança para armazenar a senha de criptografia do arquivo de log de auditoria. Veja Criptografando Arquivos de Log de Auditoria.

* O gerenciamento de log binário e log de retransmissão suporta a criptografia baseada em chave de arquivos de log. Com a criptografia de arquivos de log ativada, a chave de segurança armazena as chaves usadas para criptografar as senhas dos arquivos de log binário e arquivos de log de retransmissão. Veja a Seção 19.3.2, “Criptografando Arquivos de Log Binário e Arquivos de Log de Retransmissão”.

* A chave mestre para descriptografar a chave do arquivo que descriptografa os valores persistentes de variáveis de sistema sensíveis é armazenada na chave de segurança. Um componente de chave de segurança deve ser habilitado na instância do Servidor MySQL para suportar o armazenamento seguro para valores de variáveis de sistema persistentes, em vez de um plugin de chave de segurança, que não suportam a função. Veja Variáveis de Sistema Sensíveis Persistentes.

Para obter instruções gerais de instalação do bloco de teclas, consulte a Seção 8.4.5.2, “Instalação do Componente do Bloco de Teclas”, e a Seção 8.4.5.3, “Instalação do Plugin do Bloco de Teclas”. Para obter informações de instalação e configuração específicas de um componente ou plugin do bloco de teclas, consulte a seção que o descreve.

Para uma comparação geral dos componentes e plugins do bloco de teclas, consulte a Seção 8.4.5.1, “Componentes do Bloco de Teclas Versus Plugins do Bloco de Teclas”.

Para obter informações sobre o uso das funções do bloco de teclas, consulte a Seção 8.4.5.15, “Funções de Gerenciamento de Chaves do Bloco de Teclas de Uso Geral”.

Os componentes, plugins e funções do bloco de teclas acessam um serviço do bloco de teclas que fornece a interface para o bloco de teclas. Para obter informações sobre como acessar esse serviço e escrever plugins do bloco de teclas, consulte a Seção 7.6.8.2, “O Serviço do Bloco de Teclas”, e Escrever Plugins do Bloco de Teclas.