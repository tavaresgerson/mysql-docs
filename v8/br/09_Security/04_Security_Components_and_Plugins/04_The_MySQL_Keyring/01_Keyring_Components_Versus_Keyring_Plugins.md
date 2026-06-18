#### 8.4.4.1 Componentes do cartela de identificação versus plugins do cartela de identificação

O Keyring do MySQL originalmente implementou as capacidades do keystore usando plugins do servidor, mas começou a migrar para usar a infraestrutura do componente no MySQL 8.0.24. Esta seção compara brevemente os componentes e plugins do Keyring para fornecer uma visão geral de suas diferenças. Isso pode ajudá-lo a fazer a transição de plugins para componentes, ou, se você está apenas começando a usar o Keyring, pode ajudá-lo a escolher se deve usar um componente ou um plugin.

- O carregamento do plugin do cartela de identificação utiliza a opção `--early-plugin-load`. O carregamento do componente do cartela de identificação utiliza um manifesto.

- A configuração do plugin para chaveiro é baseada em variáveis de sistema específicas do plugin. Para componentes do chaveiro, não são usadas variáveis de sistema. Em vez disso, cada componente tem seu próprio arquivo de configuração.

- Os componentes do cartela de identificação têm menos restrições do que os plugins de cartela de identificação em relação aos tipos e comprimentos das chaves. Veja a Seção 8.4.4.13, “Tipos e comprimentos de chaves suportados pela cartela de identificação”.

  Nota

  `component_keyring_oci` (como o plugin `keyring_oci`) só pode gerar chaves do tipo `AES` com um tamanho de 16, 24 ou 32 bytes.

- Os componentes do cartela de identificação suportam o armazenamento seguro de valores de variáveis do sistema persistentes, enquanto os plugins da cartela de identificação não suportam essa função.

  Um componente de chave de acesso deve estar habilitado na instância do servidor MySQL para suportar o armazenamento seguro de valores de variáveis de sistema persistentes. Os dados sensíveis que podem ser protegidos dessa maneira incluem itens como chaves privadas e senhas que aparecem nos valores das variáveis de sistema. No arquivo do sistema operacional onde as variáveis de sistema persistentes são armazenadas, os nomes e valores das variáveis de sistema sensíveis são armazenados em um formato criptografado, juntamente com uma chave de arquivo gerada para descriptografá-los. A chave de arquivo gerada é, por sua vez, criptografada usando uma chave mestre que é armazenada em um conjunto de chaves. Veja Persistência de Variáveis de Sistema Sensíveis.
