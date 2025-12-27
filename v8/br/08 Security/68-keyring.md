### 8.4.4 O Keyring do MySQL


O MySQL Server suporta um keyring que permite que componentes internos do servidor e plugins armazem informações sensíveis de forma segura para recuperação posterior. A implementação inclui esses elementos:

* Componentes e plugins do keyring que gerenciam um armazenamento de suporte ou se comunicam com um backend de armazenamento. O uso do keyring envolve a instalação de um dos componentes e plugins disponíveis. Tanto os componentes quanto os plugins do keyring gerenciam os dados do keyring, mas são configurados de maneira diferente e podem ter diferenças operacionais (veja a Seção 8.4.4.1, “Componentes do Keyring em Relação aos Plugins do Keyring”).

Esses componentes do keyring estão disponíveis:

+ `component_keyring_file`: Armazena os dados do keyring em um arquivo local ao host do servidor. Disponível nas distribuições da Edição Comunitária e da Edição Empresarial do MySQL. Veja a Seção 8.4.4.4, “Usando o componente\_keyring\_file Component Keyring com Arquivo de Suporte”.
+ `component_keyring_encrypted_file`: Armazena os dados do keyring em um arquivo criptografado e protegido por senha local ao host do servidor. Disponível nas distribuições da Edição Empresarial do MySQL. Veja a Seção 8.4.4.5, “Usando o componente\_keyring\_encrypted\_file Component Keyring com Arquivo Criptografado”.
+ `component_keyring_oci`: Armazena os dados do keyring no Vault da Oracle Cloud Infrastructure. Disponível nas distribuições da Edição Empresarial do MySQL. Veja a Seção 8.4.4.9, “Usando o Component Keyring do Vault da Oracle Cloud Infrastructure”.

Esses plugins do keyring estão disponíveis:

+ `keyring_okv`: Um plugin KMIP 1.1 para uso com produtos de armazenamento de chave de porta-chave compatíveis com KMIP, como o Oracle Key Vault e o Gemalto SafeNet KeySecure Appliance. Disponível nas distribuições da Edição Empresarial do MySQL. Veja a Seção 8.4.4.6, “Usando o plugin keyring\_okv KMIP”.
+ `keyring_aws`: Comunica-se com o Serviço de Gerenciamento de Chaves do Amazon Web Services para geração de chaves e usa um arquivo local para armazenamento de chaves. Disponível nas distribuições da Edição Empresarial do MySQL. Veja a Seção 8.4.4.7, “Usando o plugin keyring\_aws Amazon Web Services Keyring”.
+ `keyring_hashicorp`: Comunica-se com o HashiCorp Vault para armazenamento de porta-chave de back end. Disponível nas distribuições da Edição Empresarial do MySQL. Veja a Seção 8.4.4.8, “Usando o plugin keyring HashiCorp Vault”.
* Uma interface de serviço de porta-chave para gerenciamento de chaves de porta-chave. Este serviço é acessível em dois níveis:

+ Interface SQL: Em instruções SQL, chame as funções descritas na Seção 8.4.4.12, “Funções de gerenciamento de chaves de porta-chave de propósito geral”.
+ Interface C: Em código em C, chame as funções do serviço de porta-chave descritas na Seção 7.6.9.2, “O Serviço de Porta-chave”.
* Acesso a metadados de chaves:

+ A tabela `keyring_keys` do Schema de Desempenho exibe metadados para as chaves no keyring. Os metadados das chaves incluem IDs de chave, proprietários de chave e IDs de chave do backend. A tabela `keyring_keys` não exibe dados sensíveis do keyring, como o conteúdo das chaves. Veja a Seção 29.12.18.2, “A tabela keyring_keys”.
  + A tabela `keyring_component_status` do Schema de Desempenho fornece informações de status sobre o componente do keyring em uso, se estiver instalado. Veja a Seção 29.12.18.1, “A tabela keyring_component_status”.
* Uma capacidade de migração de chaves. O MySQL suporta a migração de chaves entre keystores, permitindo que os DBAs mudem uma instalação do MySQL de um keystore para outro. Veja a Seção 8.4.4.11, “Migrar chaves entre keystores do keyring”.
* A implementação de plugins do keyring é revisada para usar a infraestrutura do componente. Isso é facilitado usando o plugin embutido chamado `daemon_keyring_proxy_plugin` que atua como uma ponte entre as APIs do serviço de componente e do plugin. Veja a Seção 7.6.8, “O plugin Keyring Proxy Bridge”. Aviso

Para a gestão de chaves de criptografia, os componentes `component_keyring_file` e `component_keyring_encrypted_file` não são destinados como uma solução de conformidade regulatória. Padrões de segurança como PCI, FIPS e outros exigem o uso de sistemas de gerenciamento de chaves para proteger, gerenciar e proteger as chaves de criptografia em cofres de chaves ou módulos de segurança de hardware (HSMs).

Dentro do MySQL, os consumidores do serviço de keyring incluem:

* O mecanismo de armazenamento `InnoDB` usa o chaveiro para armazenar sua chave para a criptografia do espaço de tabelas. Veja a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”.
* O MySQL Enterprise Audit usa o chaveiro para armazenar a senha da criptografia do arquivo de log de auditoria. Veja Criptografando Arquivos de Log de Auditoria.
* O gerenciamento de log binário e log de retransmissão suporta a criptografia baseada em chaveiro dos arquivos de log. Com a criptografia de arquivos de log ativada, o chaveiro armazena as chaves usadas para criptografar senhas para os arquivos de log binário e arquivos de log de retransmissão. Veja a Seção 19.3.2, “Criptografando Arquivos de Log Binário e Arquivos de Log de Retransmissão”.
* A chave mestre para descriptografar a chave do arquivo que descriptografa os valores persistentes de variáveis de sistema sensíveis é armazenada no chaveiro. Um componente do chaveiro deve ser habilitado na instância do MySQL Server para suportar o armazenamento seguro para valores persistentes de variáveis de sistema, em vez de um plugin do chaveiro, que não suportam a função. Veja Variáveis de Sistema Sensíveis Persistentes.

Para instruções gerais de instalação do chaveiro, veja a Seção 8.4.4.2, “Instalação do Componente do Chaveiro” e a Seção 8.4.4.3, “Instalação do Plugin do Chaveiro”. Para informações de instalação e configuração específicas para um componente ou plugin do chaveiro dado, veja a seção que o descreve.

Para informações sobre o uso das funções do chaveiro, veja a Seção 8.4.4.12, “Funções de Gerenciamento de Chaves de Propósito Geral do Chaveiro”.

Componentes, plugins e funções do chaveiro acessam um serviço do chaveiro que fornece a interface para o chaveiro. Para informações sobre como acessar esse serviço e escrever plugins do chaveiro, veja a Seção 7.6.9.2, “O Serviço do Chaveiro” e Escrevendo Plugins do Chaveiro.