#### 8.4.5.1 Componentes do Keyring em Relação aos Plugins do Keyring

O MySQL Keyring originalmente implementou as capacidades de keystore usando plugins do servidor, mas começou a transição para usar a infraestrutura de componentes. Esta seção compara brevemente os componentes e plugins do Keyring para fornecer uma visão geral de suas diferenças. Isso pode ajudá-lo a fazer a transição de plugins para componentes, ou, se você está apenas começando a usar o Keyring, pode ajudá-lo a escolher se deve usar um componente ou um plugin.

* O carregamento de plugins do Keyring usa a opção `--early-plugin-load` (desatualizada). O carregamento de componentes do Keyring usa um manifesto.

* A configuração do plugin do Keyring é baseada em variáveis de sistema específicas do plugin. Para os componentes do Keyring, não são usadas variáveis de sistema. Em vez disso, cada componente tem seu próprio arquivo de configuração.

* Os componentes do Keyring têm menos restrições do que os plugins do Keyring em relação aos tipos e comprimentos de chave. Veja a Seção 8.4.5.13, “Tipos e comprimentos de chave suportados do Keyring”.

  Nota

  `component_keyring_oci` pode gerar chaves do tipo `AES` com um tamanho de 16, 24 ou 32 bytes apenas.

* Os componentes do Keyring suportam o armazenamento seguro para valores de variáveis de sistema persistentes, enquanto os plugins do Keyring não suportam a função.

Um componente de chave de acesso deve estar habilitado na instância do servidor MySQL para suportar o armazenamento seguro de valores de variáveis de sistema persistentes. Os dados sensíveis que podem ser protegidos dessa maneira incluem itens como chaves privadas e senhas que aparecem nos valores das variáveis de sistema. No arquivo do sistema operacional onde as variáveis de sistema persistentes são armazenadas, os nomes e valores das variáveis de sistema sensíveis são armazenados em um formato criptografado, juntamente com uma chave de arquivo gerada para descriptografá-los. A chave de arquivo gerada é, por sua vez, criptografada usando uma chave mestre que é armazenada em um conjunto de chaves. Veja Persistência de Variáveis de Sistema Sensíveis.