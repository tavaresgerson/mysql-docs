#### 8.4.4.19 Variáveis do Sistema de Carteira de Chave

Os plugins do Keyring do MySQL suportam as seguintes variáveis de sistema. Use-as para configurar a operação do plugin do Keyring. Essas variáveis não estão disponíveis a menos que o plugin do Keyring apropriado esteja instalado (consulte a Seção 8.4.4.3, “Instalação do Plugin do Keyring”).

- `keyring_aws_cmk_id`

  <table summary="Propriedades para keyring_aws_cmk_id"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-cmk-id=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_cmk_id</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  O ID da chave do KMS obtido do servidor do KMS da AWS e usado pelo plugin `keyring_aws`. Essa variável não está disponível, a menos que o plugin esteja instalado.

  Esta variável é obrigatória. Se não for especificada, a inicialização de `keyring_aws` falhará.

- `keyring_aws_conf_file`

  <table summary="Propriedades para keyring_aws_conf_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-conf-file=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_conf_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>

  Localização do arquivo de configuração do plugin `keyring_aws`. Essa variável não está disponível, a menos que o plugin esteja instalado.

  Ao iniciar o plugin, o `keyring_aws` lê o ID da chave de acesso secreta da AWS e a chave do arquivo de configuração. Para que o plugin `keyring_aws` comece com sucesso, o arquivo de configuração deve existir e conter informações válidas da chave de acesso secreta, conforme descrito na Seção 8.4.4.9, “Usando o plugin Amazon Web Services Keyring keyring\_aws”.

  O nome padrão do arquivo é `keyring_aws_conf`, localizado no diretório padrão do arquivo de chave. A localização deste diretório padrão é a mesma da variável de sistema `keyring_file_data`. Consulte a descrição dessa variável para obter detalhes, bem como considerações a serem levadas em conta se você criar o diretório manualmente.

- `keyring_aws_data_file`

  <table summary="Propriedades para keyring_aws_data_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-data-file</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_data_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>

  O local do arquivo de armazenamento para o plugin `keyring_aws`. Esta variável não está disponível, a menos que o plugin esteja instalado.

  Ao iniciar o plugin, se o valor atribuído a `keyring_aws_data_file` especificar um arquivo que não existe, o plugin `keyring_aws` tenta criá-lo (assim como seu diretório pai, se necessário). Se o arquivo existir, o `keyring_aws` lê quaisquer chaves criptografadas contidas no arquivo em seu cache de memória. O `keyring_aws` não armazena chaves não criptografadas na memória.

  O nome padrão do arquivo é `keyring_aws_data`, localizado no diretório padrão do arquivo de chave. A localização deste diretório padrão é a mesma da variável de sistema `keyring_file_data`. Consulte a descrição dessa variável para obter detalhes, bem como considerações a serem levadas em conta se você criar o diretório manualmente.

- `keyring_aws_region`

  <table summary="Propriedades para keyring_aws_region"><tbody><tr><th>Formato de linha de comando</th> <td>[[PH_HTML_CODE_<code>ap-southeast-1</code>]</td> </tr><tr><th>Variável do sistema</th> <td>[[PH_HTML_CODE_<code>ap-southeast-1</code>]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[PH_HTML_CODE_<code>ca-central-1</code>] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[PH_HTML_CODE_<code>cn-north-1</code>]</td> </tr><tr><th>Valores válidos (≥ 8.0.30)</th> <td><p class="valid-value">[[PH_HTML_CODE_<code>cn-northwest-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-central-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-north-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-south-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-west-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-west-2</code>]</p><p class="valid-value">[[<code>ap-southeast-1</code>]]</p><p class="valid-value">[[<code>keyring_aws_region</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>ca-central-1</code>]]</p><p class="valid-value">[[<code>cn-north-1</code>]]</p><p class="valid-value">[[<code>cn-northwest-1</code>]]</p><p class="valid-value">[[<code>eu-central-1</code>]]</p><p class="valid-value">[[<code>eu-north-1</code>]]</p><p class="valid-value">[[<code>eu-south-1</code>]]</p><p class="valid-value">[[<code>eu-west-1</code>]]</p><p class="valid-value">[[<code>eu-west-2</code>]]</p><p class="valid-value">[[<code>SET_VAR</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-south-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-west-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-west-2</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>ap-southeast-1</code>]</p></td> </tr><tr><th>Valores válidos (≥ 8.0.17, ≤ 8.0.29)</th> <td><p class="valid-value">[[<code>us-east-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-south-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-west-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-west-2</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-south-1</code>]</p></td> </tr><tr><th>Valores válidos (≤ 8.0.16)</th> <td><p class="valid-value">[[<code>af-south-1</code><code>eu-west-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-west-2</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-south-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-west-1</code>]</p></td> </tr></tbody></table>

  A região da AWS para o plugin `keyring_aws`. Essa variável não está disponível, a menos que o plugin esteja instalado.

  Se não estiver definida, a região da AWS será a `us-east-1`. Portanto, para qualquer outra região, essa variável deve ser definida explicitamente.

- `keyring_encrypted_file_data`

  <table summary="Propriedades para keyring_encrypted_file_data"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-encrypted-file-data=file_name</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.34</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_encrypted_file_data</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>

  Nota

  A partir do MySQL 8.0.34, o plugin `keyring_encrypted_file` está desatualizado e está sujeito à remoção em uma versão futura do MySQL. Considere usar o `component_keyring_encrypted_file` em vez disso; o componente `component_keyring_encrypted_file` substitui o plugin `keyring_encrypted_file`.

  O nome do caminho do arquivo de dados usado para armazenamento seguro de dados pelo plugin `keyring_encrypted_file`. Esta variável não está disponível, a menos que o plugin esteja instalado. A localização do arquivo deve estar em um diretório considerado para uso exclusivo por plugins de chave de segurança. Por exemplo, não localize o arquivo sob o diretório de dados.

  As operações de chaveiro são transacionais: o plugin `keyring_encrypted_file` usa um arquivo de backup durante as operações de escrita para garantir que possa retornar ao arquivo original se uma operação falhar. O arquivo de backup tem o mesmo nome que o valor da variável de sistema `keyring_encrypted_file_data`, com um sufixo de `.backup`.

  Não use o mesmo arquivo de dados `keyring_encrypted_file` para múltiplas instâncias do MySQL. Cada instância deve ter seu próprio arquivo de dados único.

  O nome padrão do arquivo é `keyring_encrypted`, localizado em um diretório específico da plataforma e depende do valor da opção `INSTALL_LAYOUT` **CMake**, conforme mostrado na tabela a seguir. Para especificar o diretório padrão do arquivo explicitamente se você estiver compilando a partir da fonte, use a opção `INSTALL_MYSQLKEYRINGDIR` **CMake**.

  <table summary="O valor padrão keyring_encrypted_file_data para diferentes valores de INSTALL_LAYOUT."><thead><tr> <th>[[<code>INSTALL_LAYOUT</code>]] Valor</th> <th>Valor padrão [[<code>keyring_encrypted_file_data</code>]]</th> </tr></thead><tbody><tr> <td>[[<code>DEB</code>]], [[<code>RPM</code>]], [[<code>SVR4</code>]]</td> <td>[[<code>/var/lib/mysql-keyring/keyring_encrypted</code>]]</td> </tr><tr> <td>Caso contrário</td> <td>[[<code>keyring/keyring_encrypted</code>]] sob o valor [[<code>CMAKE_INSTALL_PREFIX</code>]]</td> </tr></tbody></table>

  Ao iniciar o plugin, se o valor atribuído a `keyring_encrypted_file_data` especificar um arquivo que não existe, o plugin `keyring_encrypted_file` tentará criá-lo (assim como seu diretório pai, se necessário).

  Se você criar o diretório manualmente, ele deve ter um modo restrito e ser acessível apenas à conta usada para executar o servidor MySQL. Por exemplo, em sistemas Unix e Unix-like, para usar o diretório `/usr/local/mysql/mysql-keyring`, os seguintes comandos (executados como `root`) criam o diretório e definem seu modo e propriedade:

  ```
  cd /usr/local/mysql
  mkdir mysql-keyring
  chmod 750 mysql-keyring
  chown mysql mysql-keyring
  chgrp mysql mysql-keyring
  ```

  Se o plugin `keyring_encrypted_file` não conseguir criar ou acessar seu arquivo de dados, ele escreve uma mensagem de erro no log de erros. Se uma tentativa de atribuição de tempo de execução para `keyring_encrypted_file_data` resultar em um erro, o valor da variável permanece inalterado.

  Importante

  Uma vez que o plugin `keyring_encrypted_file` tenha criado seu arquivo de dados e começado a usá-lo, é importante não removê-lo. A perda do arquivo faz com que os dados criptografados usando suas chaves se tornem inacessíveis. (É permitido renomear ou mover o arquivo, desde que você mude o valor de `keyring_encrypted_file_data` para corresponder.)

- `keyring_encrypted_file_password`

  <table summary="Propriedades para keyring_encrypted_file_password"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-encrypted-file-password=password</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.34</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_encrypted_file_password</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

  Nota

  A partir do MySQL 8.0.34, o plugin `keyring_encrypted_file` está desatualizado e está sujeito à remoção em uma versão futura do MySQL. Considere usar o `component_keyring_encrypted_file` em vez disso; o componente `component_keyring_encrypted_file` substitui o plugin `keyring_encrypted_file`.

  A senha usada pelo plugin `keyring_encrypted_file`. Essa variável não está disponível, a menos que o plugin esteja instalado.

  Esta variável é obrigatória. Se não for especificada, a inicialização de `keyring_encrypted_file` falhará.

  Se essa variável for especificada em um arquivo de opção, o arquivo deve ter um modo restrito e ser acessível apenas à conta usada para executar o servidor MySQL.

  Importante

  Uma vez que o valor `keyring_encrypted_file_password` tenha sido definido, alterá-lo não rotira a senha do chaveiro e pode tornar o servidor inacessível. Se uma senha incorreta for fornecida, o plugin `keyring_encrypted_file` não consegue carregar chaves do arquivo de chaveiro criptografado.

  O valor da senha não pode ser exibido em tempo de execução com `SHOW VARIABLES` ou na tabela do Schema de Desempenho `global_variables` porque o valor de exibição é ofuscado.

- `keyring_file_data`

  <table summary="Propriedades para keyring_file_data"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-file-data=file_name</code>]]</td> </tr><tr><th>Desatualizado</th> <td>8.0.34</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_file_data</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>

  Nota

  A partir do MySQL 8.0.34, o plugin `keyring_file` está desatualizado e está sujeito à remoção em uma versão futura do MySQL. Considere usar o `component_keyring_file` em vez disso; o componente `component_keyring_file` substitui o plugin `keyring_file`.

  O nome do caminho do arquivo de dados usado para armazenamento seguro de dados pelo plugin `keyring_file`. Esta variável não está disponível, a menos que o plugin esteja instalado. A localização do arquivo deve estar em um diretório considerado para uso exclusivo por plugins de chave de segurança. Por exemplo, não localize o arquivo sob o diretório de dados.

  As operações de chaveiro são transacionais: o plugin `keyring_file` usa um arquivo de backup durante as operações de escrita para garantir que possa retornar ao arquivo original se uma operação falhar. O arquivo de backup tem o mesmo nome que o valor da variável de sistema `keyring_file_data`, com um sufixo de `.backup`.

  Não use o mesmo arquivo de dados `keyring_file` para múltiplas instâncias do MySQL. Cada instância deve ter seu próprio arquivo de dados único.

  O nome padrão do arquivo é `keyring`, localizado em um diretório específico da plataforma e depende do valor da opção `INSTALL_LAYOUT` **CMake**, conforme mostrado na tabela a seguir. Para especificar o diretório padrão do arquivo explicitamente se você estiver compilando a partir da fonte, use a opção `INSTALL_MYSQLKEYRINGDIR` **CMake**.

  <table summary="O valor padrão keyring_file_data para diferentes valores de INSTALL_LAYOUT."><thead><tr> <th>[[<code>INSTALL_LAYOUT</code>]] Valor</th> <th>Valor padrão [[<code>keyring_file_data</code>]]</th> </tr></thead><tbody><tr> <td>[[<code>DEB</code>]], [[<code>RPM</code>]], [[<code>SVR4</code>]]</td> <td>[[<code>/var/lib/mysql-keyring/keyring</code>]]</td> </tr><tr> <td>Caso contrário</td> <td>[[<code>keyring/keyring</code>]] sob o valor [[<code>CMAKE_INSTALL_PREFIX</code>]]</td> </tr></tbody></table>

  Ao iniciar o plugin, se o valor atribuído a `keyring_file_data` especificar um arquivo que não existe, o plugin `keyring_file` tentará criá-lo (assim como seu diretório pai, se necessário).

  Se você criar o diretório manualmente, ele deve ter um modo restrito e ser acessível apenas à conta usada para executar o servidor MySQL. Por exemplo, em sistemas Unix e Unix-like, para usar o diretório `/usr/local/mysql/mysql-keyring`, os seguintes comandos (executados como `root`) criam o diretório e definem seu modo e propriedade:

  ```
  cd /usr/local/mysql
  mkdir mysql-keyring
  chmod 750 mysql-keyring
  chown mysql mysql-keyring
  chgrp mysql mysql-keyring
  ```

  Se o plugin `keyring_file` não conseguir criar ou acessar seu arquivo de dados, ele escreve uma mensagem de erro no log de erros. Se uma tentativa de atribuição de tempo de execução para `keyring_file_data` resultar em um erro, o valor da variável permanece inalterado.

  Importante

  Uma vez que o plugin `keyring_file` tenha criado seu arquivo de dados e começado a usá-lo, é importante não removê-lo. Por exemplo, o `InnoDB` usa o arquivo para armazenar a chave mestre usada para descriptografar os dados em tabelas que usam a criptografia do espaço de tabelas `InnoDB`; veja a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”. A perda do arquivo faz com que os dados nessas tabelas se tornem inacessíveis. (É permitido renomear ou mover o arquivo, desde que você mude o valor de `keyring_file_data` para corresponder.) Recomenda-se que você crie um backup separado do arquivo de dados do chaveiro imediatamente após criar a primeira tabela criptografada e antes e depois da rotação da chave mestre.

- `keyring_hashicorp_auth_path`

  <table summary="Propriedades para keyring_hashicorp_auth_path"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-hashicorp-auth-path=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.18</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_hashicorp_auth_path</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>/v1/auth/approle/login</code>]]</td> </tr></tbody></table>

  O caminho de autenticação onde a autenticação do AppRole está habilitada no servidor HashiCorp Vault, para uso do plugin `keyring_hashicorp`. Esta variável não está disponível, a menos que o plugin esteja instalado.

- `keyring_hashicorp_ca_path`

  <table summary="Propriedades para keyring_aws_conf_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-conf-file=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_conf_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>0

  O nome do caminho absoluto de um arquivo local acessível ao servidor MySQL que contém uma autoridade de certificação TLS formatada corretamente para uso pelo plugin `keyring_hashicorp`. Essa variável não está disponível, a menos que o plugin esteja instalado.

  Se essa variável não for definida, o plugin `keyring_hashicorp` abre uma conexão HTTPS sem usar a verificação de certificado do servidor e confia em qualquer certificado entregue pelo servidor HashiCorp Vault. Para que isso seja seguro, deve-se assumir que o servidor Vault não é malicioso e que não é possível um ataque de intermediário. Se essas suposições forem inválidas, defina `keyring_hashicorp_ca_path` para o caminho de um certificado de CA confiável. (Por exemplo, para as instruções na Preparação de Certificados e Chaves, este é o arquivo `company.crt`.)

- `keyring_hashicorp_caching`

  <table summary="Propriedades para keyring_aws_conf_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-conf-file=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_conf_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>1

  Se deve habilitar o cache de chaves opcional em memória usado pelo plugin `keyring_hashicorp` para armazenar chaves do servidor HashiCorp Vault. Essa variável não está disponível a menos que o plugin esteja instalado. Se o cache estiver habilitado, o plugin o preencherá durante a inicialização. Caso contrário, o plugin preencherá apenas a lista de chaves durante a inicialização.

  Ativação do cache é um compromisso: melhora o desempenho, mas mantém uma cópia de informações sensíveis na memória, o que pode ser indesejável para fins de segurança.

- `keyring_hashicorp_commit_auth_path`

  <table summary="Propriedades para keyring_aws_conf_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-conf-file=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_conf_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>2

  Essa variável está associada a `keyring_hashicorp_auth_path`, da qual ela obtém seu valor durante a inicialização do plugin `keyring_hashicorp`. Essa variável não está disponível a menos que o plugin esteja instalado. Ela reflete o valor "assinado" realmente usado para a operação do plugin se a inicialização for bem-sucedida. Para obter informações adicionais, consulte Configuração keyring\_hashicorp.

- `keyring_hashicorp_commit_ca_path`

  <table summary="Propriedades para keyring_aws_conf_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-conf-file=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_conf_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>3

  Essa variável está associada a `keyring_hashicorp_ca_path`, da qual ela obtém seu valor durante a inicialização do plugin `keyring_hashicorp`. Essa variável não está disponível a menos que o plugin esteja instalado. Ela reflete o valor "assinado" realmente usado para a operação do plugin se a inicialização for bem-sucedida. Para obter informações adicionais, consulte Configuração keyring\_hashicorp.

- `keyring_hashicorp_commit_caching`

  <table summary="Propriedades para keyring_aws_conf_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-conf-file=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_conf_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>4

  Essa variável está associada a `keyring_hashicorp_caching`, da qual ela obtém seu valor durante a inicialização do plugin `keyring_hashicorp`. Essa variável não está disponível a menos que o plugin esteja instalado. Ela reflete o valor "assinado" realmente usado para a operação do plugin se a inicialização for bem-sucedida. Para obter informações adicionais, consulte Configuração keyring\_hashicorp.

- `keyring_hashicorp_commit_role_id`

  <table summary="Propriedades para keyring_aws_conf_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-conf-file=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_conf_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>5

  Essa variável está associada a `keyring_hashicorp_role_id`, da qual ela obtém seu valor durante a inicialização do plugin `keyring_hashicorp`. Essa variável não está disponível a menos que o plugin esteja instalado. Ela reflete o valor "assinado" realmente usado para a operação do plugin se a inicialização for bem-sucedida. Para obter informações adicionais, consulte Configuração keyring\_hashicorp.

- `keyring_hashicorp_commit_server_url`

  <table summary="Propriedades para keyring_aws_conf_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-conf-file=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_conf_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>6

  Essa variável está associada a `keyring_hashicorp_server_url`, da qual ela obtém seu valor durante a inicialização do plugin `keyring_hashicorp`. Essa variável não está disponível a menos que o plugin esteja instalado. Ela reflete o valor "assinado" realmente usado para a operação do plugin se a inicialização for bem-sucedida. Para obter informações adicionais, consulte Configuração keyring\_hashicorp.

- `keyring_hashicorp_commit_store_path`

  <table summary="Propriedades para keyring_aws_conf_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-conf-file=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_conf_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>7

  Essa variável está associada a `keyring_hashicorp_store_path`, da qual ela obtém seu valor durante a inicialização do plugin `keyring_hashicorp`. Essa variável não está disponível a menos que o plugin esteja instalado. Ela reflete o valor "assinado" realmente usado para a operação do plugin se a inicialização for bem-sucedida. Para obter informações adicionais, consulte Configuração keyring\_hashicorp.

- `keyring_hashicorp_role_id`

  <table summary="Propriedades para keyring_aws_conf_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-conf-file=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_conf_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>8

  O ID de papel de autenticação HashiCorp Vault AppRole, para uso do plugin `keyring_hashicorp`. Esta variável não está disponível a menos que o plugin esteja instalado. O valor deve estar no formato UUID.

  Esta variável é obrigatória. Se não for especificada, a inicialização de `keyring_hashicorp` falhará.

- `keyring_hashicorp_secret_id`

  <table summary="Propriedades para keyring_aws_conf_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-conf-file=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_conf_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>9

  O ID do segredo de autenticação do AppRole do HashiCorp Vault, para uso do plugin `keyring_hashicorp`. Esta variável não está disponível, a menos que o plugin esteja instalado. O valor deve estar no formato UUID.

  Esta variável é obrigatória. Se não for especificada, a inicialização de `keyring_hashicorp` falhará.

  O valor desta variável é sensível, portanto, seu valor é mascarado por `*` caracteres quando exibido.

- `keyring_hashicorp_server_url`

  <table summary="Propriedades para keyring_aws_data_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-data-file</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_data_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>0

  O URL do servidor HashiCorp Vault, para uso do plugin `keyring_hashicorp`. Essa variável não está disponível, a menos que o plugin esteja instalado. O valor deve começar com `https://`.

- `keyring_hashicorp_store_path`

  <table summary="Propriedades para keyring_aws_data_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-data-file</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_data_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>1

  Um caminho de armazenamento dentro do servidor HashiCorp Vault que é gravável quando as credenciais do AppRole apropriadas são fornecidas pelo plugin `keyring_hashicorp`. Esta variável não está disponível a menos que esse plugin esteja instalado. Para especificar as credenciais, defina as variáveis de sistema `keyring_hashicorp_role_id` e `keyring_hashicorp_secret_id` (por exemplo, conforme mostrado na configuração keyring\_hashicorp).

  Esta variável é obrigatória. Se não for especificada, a inicialização de `keyring_hashicorp` falhará.

- `keyring_oci_ca_certificate`

  <table summary="Propriedades para keyring_aws_data_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-data-file</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_data_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>2

  O nome do caminho do arquivo do pacote de certificados CA que o plugin `keyring_oci` usa para a verificação de certificados da Oracle Cloud Infrastructure. Essa variável não está disponível, a menos que o plugin esteja instalado.

  O arquivo contém um ou mais certificados para verificação entre pares. Se nenhum arquivo for especificado, o pacote CA padrão instalado no sistema é usado. Se o valor for `disabled` (sensível a maiúsculas e minúsculas), `keyring_oci` não realiza nenhuma verificação de certificados.

- `keyring_oci_compartment`

  <table summary="Propriedades para keyring_aws_data_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-data-file</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_data_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>3

  O ID do compartimento de locação que o plugin `keyring_oci` usa como local das chaves do MySQL. Essa variável não está disponível, a menos que o plugin esteja instalado.

  Antes de usar `keyring_oci`, você deve criar um compartimento ou subcompartimento MySQL, se ele não existir. Esse compartimento não deve conter chaves de vault ou segredos de vault. Ele não deve ser usado por sistemas que não sejam o MySQL Keyring.

  Para obter informações sobre a gestão de compartimentos e a obtenção do OCID, consulte Gerenciamento de compartimentos.

  Esta variável é obrigatória. Se não for especificada, a inicialização de `keyring_oci` falhará.

- `keyring_oci_encryption_endpoint`

  <table summary="Propriedades para keyring_aws_data_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-data-file</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_data_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>4

  O ponto final do servidor de criptografia da Oracle Cloud Infrastructure que o plugin `keyring_oci` usa para gerar o texto cifrado para novas chaves. Essa variável não está disponível, a menos que o plugin esteja instalado.

  O ponto de extremidade de criptografia é específico do cofre e a Oracle Cloud Infrastructure atribui-o no momento da criação do cofre. Para obter o OCID do ponto de extremidade, consulte os detalhes da configuração do seu cofre `keyring_oci`, usando as instruções em Gerenciamento de cofres.

  Esta variável é obrigatória. Se não for especificada, a inicialização de `keyring_oci` falhará.

- `keyring_oci_key_file`

  <table summary="Propriedades para keyring_aws_data_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-data-file</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_data_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>5

  O nome do caminho do arquivo que contém a chave privada RSA que o plugin `keyring_oci` usa para a autenticação da Oracle Cloud Infrastructure. Essa variável não está disponível, a menos que o plugin esteja instalado.

  Você também deve fazer o upload da chave pública RSA correspondente usando o Console. O Console exibe o valor do cache da chave, que você pode usar para definir a variável de sistema `keyring_oci_key_fingerprint`.

  Para obter informações sobre a geração e o upload de chaves de API, consulte Chaves e OCIDs exigidas.

  Esta variável é obrigatória. Se não for especificada, a inicialização de `keyring_oci` falhará.

- `keyring_oci_key_fingerprint`

  <table summary="Propriedades para keyring_aws_data_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-data-file</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_data_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>6

  A impressão digital da chave privada RSA que o plugin `keyring_oci` usa para autenticação na Oracle Cloud Infrastructure. Essa variável não está disponível, a menos que o plugin esteja instalado.

  Para obter a impressão digital da chave ao criar as chaves da API, execute este comando:

  ```
  openssl rsa -pubout -outform DER -in ~/.oci/oci_api_key.pem | openssl md5 -c
  ```

  Alternativamente, obtenha a impressão digital do Console, que exibe automaticamente a impressão digital quando você carrega a chave pública RSA.

  Para obter informações sobre como obter as principais impressões digitais, consulte Chaves e OCIDs exigidas.

  Esta variável é obrigatória. Se não for especificada, a inicialização de `keyring_oci` falhará.

- `keyring_oci_management_endpoint`

  <table summary="Propriedades para keyring_aws_data_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-data-file</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_data_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>7

  O ponto final do servidor de gerenciamento de chaves da Oracle Cloud Infrastructure que o plugin `keyring_oci` usa para listar chaves existentes. Essa variável não está disponível, a menos que o plugin esteja instalado.

  O ponto de extremidade de gerenciamento da chave é específico do cofre e a Oracle Cloud Infrastructure atribui-o no momento da criação do cofre. Para obter o OCID do ponto de extremidade, consulte os detalhes da configuração do seu cofre `keyring_oci`, usando as instruções em Gerenciamento de cofres.

  Esta variável é obrigatória. Se não for especificada, a inicialização de `keyring_oci` falhará.

- `keyring_oci_master_key`

  <table summary="Propriedades para keyring_aws_data_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-data-file</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_data_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>8

  O OCID da chave de criptografia mestre da Oracle Cloud Infrastructure que o plugin `keyring_oci` usa para criptografar segredos. Essa variável não está disponível, a menos que o plugin esteja instalado.

  Antes de usar `keyring_oci`, você deve criar uma chave criptográfica para o compartimento da Oracle Cloud Infrastructure, se ele não existir. Forneça um nome específico para MySQL para a chave gerada e não use-o para outros fins.

  Para obter informações sobre a criação de chaves, consulte Gerenciamento de Chaves.

  Esta variável é obrigatória. Se não for especificada, a inicialização de `keyring_oci` falhará.

- `keyring_oci_secrets_endpoint`

  <table summary="Propriedades para keyring_aws_data_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-data-file</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_data_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>9

  O ponto final do servidor de segredos da Oracle Cloud Infrastructure que o plugin `keyring_oci` usa para listar, criar e aposentar segredos. Essa variável não está disponível, a menos que o plugin esteja instalado.

  O ponto de extremidade de segredos é específico do cofre e a Oracle Cloud Infrastructure atribui-o no momento da criação do cofre. Para obter o OCID do ponto de extremidade, consulte os detalhes da configuração do seu cofre `keyring_oci`, usando as instruções em Gerenciamento de cofres.

  Esta variável é obrigatória. Se não for especificada, a inicialização de `keyring_oci` falhará.

- `keyring_oci_tenancy`

  <table summary="Propriedades para keyring_aws_region"><tbody><tr><th>Formato de linha de comando</th> <td>[[PH_HTML_CODE_<code>ap-southeast-1</code>]</td> </tr><tr><th>Variável do sistema</th> <td>[[PH_HTML_CODE_<code>ap-southeast-1</code>]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[PH_HTML_CODE_<code>ca-central-1</code>] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[PH_HTML_CODE_<code>cn-north-1</code>]</td> </tr><tr><th>Valores válidos (≥ 8.0.30)</th> <td><p class="valid-value">[[PH_HTML_CODE_<code>cn-northwest-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-central-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-north-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-south-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-west-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-west-2</code>]</p><p class="valid-value">[[<code>ap-southeast-1</code>]]</p><p class="valid-value">[[<code>keyring_aws_region</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>ca-central-1</code>]]</p><p class="valid-value">[[<code>cn-north-1</code>]]</p><p class="valid-value">[[<code>cn-northwest-1</code>]]</p><p class="valid-value">[[<code>eu-central-1</code>]]</p><p class="valid-value">[[<code>eu-north-1</code>]]</p><p class="valid-value">[[<code>eu-south-1</code>]]</p><p class="valid-value">[[<code>eu-west-1</code>]]</p><p class="valid-value">[[<code>eu-west-2</code>]]</p><p class="valid-value">[[<code>SET_VAR</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-south-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-west-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-west-2</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>ap-southeast-1</code>]</p></td> </tr><tr><th>Valores válidos (≥ 8.0.17, ≤ 8.0.29)</th> <td><p class="valid-value">[[<code>us-east-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-south-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-west-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-west-2</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-south-1</code>]</p></td> </tr><tr><th>Valores válidos (≤ 8.0.16)</th> <td><p class="valid-value">[[<code>af-south-1</code><code>eu-west-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-west-2</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-south-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-west-1</code>]</p></td> </tr></tbody></table>0

  O ID de organização da entidade da Infraestrutura da Nuvem da Oracle que o plugin `keyring_oci` usa como local do compartimento do MySQL. Essa variável não está disponível, a menos que o plugin esteja instalado.

  Antes de usar `keyring_oci`, você deve criar uma locação, caso ela não exista. Para obter o OCID da locação no Console, use as instruções em Chaves e OCIDs Requeridos.

  Esta variável é obrigatória. Se não for especificada, a inicialização de `keyring_oci` falhará.

- `keyring_oci_user`

  <table summary="Propriedades para keyring_aws_region"><tbody><tr><th>Formato de linha de comando</th> <td>[[PH_HTML_CODE_<code>ap-southeast-1</code>]</td> </tr><tr><th>Variável do sistema</th> <td>[[PH_HTML_CODE_<code>ap-southeast-1</code>]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[PH_HTML_CODE_<code>ca-central-1</code>] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[PH_HTML_CODE_<code>cn-north-1</code>]</td> </tr><tr><th>Valores válidos (≥ 8.0.30)</th> <td><p class="valid-value">[[PH_HTML_CODE_<code>cn-northwest-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-central-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-north-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-south-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-west-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-west-2</code>]</p><p class="valid-value">[[<code>ap-southeast-1</code>]]</p><p class="valid-value">[[<code>keyring_aws_region</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>ca-central-1</code>]]</p><p class="valid-value">[[<code>cn-north-1</code>]]</p><p class="valid-value">[[<code>cn-northwest-1</code>]]</p><p class="valid-value">[[<code>eu-central-1</code>]]</p><p class="valid-value">[[<code>eu-north-1</code>]]</p><p class="valid-value">[[<code>eu-south-1</code>]]</p><p class="valid-value">[[<code>eu-west-1</code>]]</p><p class="valid-value">[[<code>eu-west-2</code>]]</p><p class="valid-value">[[<code>SET_VAR</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-south-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-west-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-west-2</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>ap-southeast-1</code>]</p></td> </tr><tr><th>Valores válidos (≥ 8.0.17, ≤ 8.0.29)</th> <td><p class="valid-value">[[<code>us-east-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-south-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-west-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-west-2</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-south-1</code>]</p></td> </tr><tr><th>Valores válidos (≤ 8.0.16)</th> <td><p class="valid-value">[[<code>af-south-1</code><code>eu-west-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-west-2</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-south-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-west-1</code>]</p></td> </tr></tbody></table>1

  O ID de usuário da Infraestrutura de Nuvem da Oracle que o plugin `keyring_oci` usa para conexões na nuvem. Essa variável não está disponível, a menos que o plugin esteja instalado.

  Antes de usar o `keyring_oci`, esse usuário deve existir e ter acesso para usar os recursos de locação, compartimento e cofre configurados da Oracle Cloud Infrastructure.

  Para obter o ID de usuário OCID do Console, use as instruções em Chaves e ID de usuário OCs necessários.

  Esta variável é obrigatória. Se não for especificada, a inicialização de `keyring_oci` falhará.

- `keyring_oci_vaults_endpoint`

  <table summary="Propriedades para keyring_aws_region"><tbody><tr><th>Formato de linha de comando</th> <td>[[PH_HTML_CODE_<code>ap-southeast-1</code>]</td> </tr><tr><th>Variável do sistema</th> <td>[[PH_HTML_CODE_<code>ap-southeast-1</code>]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[PH_HTML_CODE_<code>ca-central-1</code>] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[PH_HTML_CODE_<code>cn-north-1</code>]</td> </tr><tr><th>Valores válidos (≥ 8.0.30)</th> <td><p class="valid-value">[[PH_HTML_CODE_<code>cn-northwest-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-central-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-north-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-south-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-west-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-west-2</code>]</p><p class="valid-value">[[<code>ap-southeast-1</code>]]</p><p class="valid-value">[[<code>keyring_aws_region</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>ca-central-1</code>]]</p><p class="valid-value">[[<code>cn-north-1</code>]]</p><p class="valid-value">[[<code>cn-northwest-1</code>]]</p><p class="valid-value">[[<code>eu-central-1</code>]]</p><p class="valid-value">[[<code>eu-north-1</code>]]</p><p class="valid-value">[[<code>eu-south-1</code>]]</p><p class="valid-value">[[<code>eu-west-1</code>]]</p><p class="valid-value">[[<code>eu-west-2</code>]]</p><p class="valid-value">[[<code>SET_VAR</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-south-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-west-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-west-2</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>ap-southeast-1</code>]</p></td> </tr><tr><th>Valores válidos (≥ 8.0.17, ≤ 8.0.29)</th> <td><p class="valid-value">[[<code>us-east-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-south-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-west-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-west-2</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-south-1</code>]</p></td> </tr><tr><th>Valores válidos (≤ 8.0.16)</th> <td><p class="valid-value">[[<code>af-south-1</code><code>eu-west-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-west-2</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-south-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-west-1</code>]</p></td> </tr></tbody></table>2

  O ponto final do servidor de armazém da Oracle Cloud Infrastructure que o plugin `keyring_oci` usa para obter o valor dos segredos. Essa variável não está disponível, a menos que o plugin esteja instalado.

  O ponto final do vault é específico do vault e a Oracle Cloud Infrastructure atribui-o no momento da criação do vault. Para obter o OCID do ponto final, consulte os detalhes da configuração do seu vault `keyring_oci`, usando as instruções em Gerenciamento de Vaults.

  Esta variável é obrigatória. Se não for especificada, a inicialização de `keyring_oci` falhará.

- `keyring_oci_virtual_vault`

  <table summary="Propriedades para keyring_aws_region"><tbody><tr><th>Formato de linha de comando</th> <td>[[PH_HTML_CODE_<code>ap-southeast-1</code>]</td> </tr><tr><th>Variável do sistema</th> <td>[[PH_HTML_CODE_<code>ap-southeast-1</code>]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[PH_HTML_CODE_<code>ca-central-1</code>] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[PH_HTML_CODE_<code>cn-north-1</code>]</td> </tr><tr><th>Valores válidos (≥ 8.0.30)</th> <td><p class="valid-value">[[PH_HTML_CODE_<code>cn-northwest-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-central-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-north-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-south-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-west-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-west-2</code>]</p><p class="valid-value">[[<code>ap-southeast-1</code>]]</p><p class="valid-value">[[<code>keyring_aws_region</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>ca-central-1</code>]]</p><p class="valid-value">[[<code>cn-north-1</code>]]</p><p class="valid-value">[[<code>cn-northwest-1</code>]]</p><p class="valid-value">[[<code>eu-central-1</code>]]</p><p class="valid-value">[[<code>eu-north-1</code>]]</p><p class="valid-value">[[<code>eu-south-1</code>]]</p><p class="valid-value">[[<code>eu-west-1</code>]]</p><p class="valid-value">[[<code>eu-west-2</code>]]</p><p class="valid-value">[[<code>SET_VAR</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-south-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-west-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-west-2</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>ap-southeast-1</code>]</p></td> </tr><tr><th>Valores válidos (≥ 8.0.17, ≤ 8.0.29)</th> <td><p class="valid-value">[[<code>us-east-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-south-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-west-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-west-2</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-south-1</code>]</p></td> </tr><tr><th>Valores válidos (≤ 8.0.16)</th> <td><p class="valid-value">[[<code>af-south-1</code><code>eu-west-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-west-2</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-south-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-west-1</code>]</p></td> </tr></tbody></table>3

  O ID de domínio único (OCID) do Vault da Oracle Cloud Infrastructure que o plugin `keyring_oci` usa para operações de criptografia. Essa variável não está disponível, a menos que o plugin esteja instalado.

  Antes de usar `keyring_oci`, você deve criar um novo cofre no compartimento MySQL, se ele não existir. (Alternativamente, você pode reutilizar um cofre existente que esteja em um compartimento pai do compartimento MySQL.) Os usuários do compartimento podem ver e usar apenas as chaves em seus respectivos compartimentos.

  Para obter informações sobre como criar um cofre e obter o ID do cofre, consulte Gerenciar cofres.

  Esta variável é obrigatória. Se não for especificada, a inicialização de `keyring_oci` falhará.

- `keyring_okv_conf_dir`

  <table summary="Propriedades para keyring_aws_region"><tbody><tr><th>Formato de linha de comando</th> <td>[[PH_HTML_CODE_<code>ap-southeast-1</code>]</td> </tr><tr><th>Variável do sistema</th> <td>[[PH_HTML_CODE_<code>ap-southeast-1</code>]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[PH_HTML_CODE_<code>ca-central-1</code>] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[PH_HTML_CODE_<code>cn-north-1</code>]</td> </tr><tr><th>Valores válidos (≥ 8.0.30)</th> <td><p class="valid-value">[[PH_HTML_CODE_<code>cn-northwest-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-central-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-north-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-south-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-west-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-west-2</code>]</p><p class="valid-value">[[<code>ap-southeast-1</code>]]</p><p class="valid-value">[[<code>keyring_aws_region</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>ca-central-1</code>]]</p><p class="valid-value">[[<code>cn-north-1</code>]]</p><p class="valid-value">[[<code>cn-northwest-1</code>]]</p><p class="valid-value">[[<code>eu-central-1</code>]]</p><p class="valid-value">[[<code>eu-north-1</code>]]</p><p class="valid-value">[[<code>eu-south-1</code>]]</p><p class="valid-value">[[<code>eu-west-1</code>]]</p><p class="valid-value">[[<code>eu-west-2</code>]]</p><p class="valid-value">[[<code>SET_VAR</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-south-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-west-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-west-2</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>ap-southeast-1</code>]</p></td> </tr><tr><th>Valores válidos (≥ 8.0.17, ≤ 8.0.29)</th> <td><p class="valid-value">[[<code>us-east-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-south-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-west-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-west-2</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-south-1</code>]</p></td> </tr><tr><th>Valores válidos (≤ 8.0.16)</th> <td><p class="valid-value">[[<code>af-south-1</code><code>eu-west-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-west-2</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-south-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-west-1</code>]</p></td> </tr></tbody></table>4

  O nome do caminho do diretório que armazena as informações de configuração usadas pelo plugin `keyring_okv`. Essa variável não está disponível, a menos que o plugin esteja instalado. O local deve ser um diretório considerado para uso exclusivo pelo plugin `keyring_okv`. Por exemplo, não localize o diretório sob o diretório de dados.

  O valor padrão `keyring_okv_conf_dir` está vazio. Para que o plugin `keyring_okv` possa acessar o Oracle Key Vault, o valor deve ser definido para um diretório que contenha a configuração e os materiais SSL do Oracle Key Vault. Para obter instruções sobre como configurar esse diretório, consulte a Seção 8.4.4.8, “Usando o plugin keyring\_okv KMIP”.

  O diretório deve ter um modo restrito e ser acessível apenas à conta usada para executar o servidor MySQL. Por exemplo, em sistemas Unix e Unix-like, para usar o diretório `/usr/local/mysql/mysql-keyring-okv`, os seguintes comandos (executados como `root`) criam o diretório e definem seu modo e propriedade:

  ```
  cd /usr/local/mysql
  mkdir mysql-keyring-okv
  chmod 750 mysql-keyring-okv
  chown mysql mysql-keyring-okv
  chgrp mysql mysql-keyring-okv
  ```

  Se o valor atribuído a `keyring_okv_conf_dir` especificar um diretório que não existe ou que não contém informações de configuração que permitam estabelecer uma conexão com o Oracle Key Vault, `keyring_okv` escreve uma mensagem de erro no log de erros. Se uma tentativa de atribuição dinâmica a `keyring_okv_conf_dir` resultar em um erro, o valor da variável e a operação do chaveiro permanecem inalterados.

- `keyring_operations`

  <table summary="Propriedades para keyring_aws_region"><tbody><tr><th>Formato de linha de comando</th> <td>[[PH_HTML_CODE_<code>ap-southeast-1</code>]</td> </tr><tr><th>Variável do sistema</th> <td>[[PH_HTML_CODE_<code>ap-southeast-1</code>]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[PH_HTML_CODE_<code>ca-central-1</code>] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[PH_HTML_CODE_<code>cn-north-1</code>]</td> </tr><tr><th>Valores válidos (≥ 8.0.30)</th> <td><p class="valid-value">[[PH_HTML_CODE_<code>cn-northwest-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-central-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-north-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-south-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-west-1</code>]</p><p class="valid-value">[[PH_HTML_CODE_<code>eu-west-2</code>]</p><p class="valid-value">[[<code>ap-southeast-1</code>]]</p><p class="valid-value">[[<code>keyring_aws_region</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>ca-central-1</code>]]</p><p class="valid-value">[[<code>cn-north-1</code>]]</p><p class="valid-value">[[<code>cn-northwest-1</code>]]</p><p class="valid-value">[[<code>eu-central-1</code>]]</p><p class="valid-value">[[<code>eu-north-1</code>]]</p><p class="valid-value">[[<code>eu-south-1</code>]]</p><p class="valid-value">[[<code>eu-west-1</code>]]</p><p class="valid-value">[[<code>eu-west-2</code>]]</p><p class="valid-value">[[<code>SET_VAR</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-south-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-west-1</code>]</p><p class="valid-value">[[<code>SET_VAR</code><code>eu-west-2</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>ap-southeast-1</code>]</p></td> </tr><tr><th>Valores válidos (≥ 8.0.17, ≤ 8.0.29)</th> <td><p class="valid-value">[[<code>us-east-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-south-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-west-1</code>]</p><p class="valid-value">[[<code>us-east-1</code><code>eu-west-2</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-south-1</code>]</p></td> </tr><tr><th>Valores válidos (≤ 8.0.16)</th> <td><p class="valid-value">[[<code>af-south-1</code><code>eu-west-1</code>]</p><p class="valid-value">[[<code>af-south-1</code><code>eu-west-2</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>ap-southeast-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>ca-central-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>cn-north-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>cn-northwest-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-central-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-north-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-south-1</code>]</p><p class="valid-value">[[<code>ap-east-1</code><code>eu-west-1</code>]</p></td> </tr></tbody></table>5

  Se as operações de chaveiro estão habilitadas. Esta variável é usada durante as operações de migração de chaves. Consulte a Seção 8.4.4.14, “Migrar Chaves entre Keystores de Chaveiro”. Os privilégios necessários para modificar esta variável são `ENCRYPTION_KEY_ADMIN`, além de `SYSTEM_VARIABLES_ADMIN` ou o privilégio desatualizado `SUPER`.
