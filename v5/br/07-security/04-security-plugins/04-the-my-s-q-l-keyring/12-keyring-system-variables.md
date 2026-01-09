#### 6.4.4.12 Variáveis do Sistema de Carteira de Chave

Os plugins do Keyring do MySQL suportam as seguintes variáveis de sistema. Use-as para configurar a operação do plugin do Keyring. Essas variáveis não estão disponíveis a menos que o plugin do Keyring apropriado esteja instalado (consulte Seção 6.4.4.1, “Instalação do Plugin do Keyring”).

- `keyring_aws_cmk_id`

  <table frame="box" rules="all" summary="Propriedades para keyring_aws_cmk_id"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-cmk-id=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_cmk_id</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O ID da chave mestre do cliente (CMK) obtido do servidor AWS KMS e usado pelo plugin `keyring_aws`. Essa variável não está disponível, a menos que o plugin esteja instalado.

  Esta variável é obrigatória. Se não for especificada, a inicialização do `keyring_aws` falhará.

- `keyring_aws_conf_file`

  <table frame="box" rules="all" summary="Propriedades para keyring_aws_conf_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-conf-file=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_conf_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>

  Localização do arquivo de configuração do plugin `keyring_aws`. Essa variável não está disponível, a menos que o plugin esteja instalado.

  Ao iniciar o plugin, o `keyring_aws` lê o ID da chave de acesso secreta da AWS e a chave do arquivo de configuração. Para que o plugin `keyring_aws` comece com sucesso, o arquivo de configuração deve existir e conter informações válidas da chave de acesso secreta, conforme descrito na Seção 6.4.4.5, “Usando o plugin keyring_aws Amazon Web Services Keyring”.

  O nome padrão do arquivo é `keyring_aws_conf`, localizado no diretório padrão do arquivo de chaveiro. A localização deste diretório padrão é a mesma da variável de sistema `keyring_file_data`. Consulte a descrição dessa variável para obter detalhes, bem como considerações a serem levadas em conta se você criar o diretório manualmente.

- `keyring_aws_data_file`

  <table frame="box" rules="all" summary="Propriedades para keyring_aws_data_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-data-file</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_data_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>

  O local do arquivo de armazenamento para o plugin `keyring_aws`. Essa variável não está disponível, a menos que o plugin esteja instalado.

  Ao iniciar o plugin, se o valor atribuído a `keyring_aws_data_file` especificar um arquivo que não existe, o plugin `keyring_aws` tentará criá-lo (assim como seu diretório pai, se necessário). Se o arquivo existir, o `keyring_aws` lê quaisquer chaves criptografadas contidas no arquivo em seu cache de memória. O `keyring_aws` não armazena chaves não criptografadas na memória.

  O nome padrão do arquivo é `keyring_aws_data`, localizado no diretório padrão do arquivo de chaveiro. A localização deste diretório padrão é a mesma da variável de sistema `keyring_file_data`. Consulte a descrição dessa variável para obter detalhes, bem como considerações a serem levadas em conta se você criar o diretório manualmente.

- `keyring_aws_region`

  <table frame="box" rules="all" summary="Propriedades para keyring_aws_region"><tbody><tr><th>Formato de linha de comando</th> <td>[[PH_HTML_CODE_<code>ap-southeast-2</code>]</td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável do sistema</th> <td>[[PH_HTML_CODE_<code>ap-southeast-2</code>]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[PH_HTML_CODE_<code>cn-north-1</code>]</td> </tr><tr><th>Valores válidos (≥ 5.7.39)</th> <td><p>[[PH_HTML_CODE_<code>cn-northwest-1</code>]</p><p>[[PH_HTML_CODE_<code>eu-central-1</code>]</p><p>[[PH_HTML_CODE_<code>eu-north-1</code>]</p><p>[[PH_HTML_CODE_<code>eu-south-1</code>]</p><p>[[PH_HTML_CODE_<code>eu-west-1</code>]</p><p>[[PH_HTML_CODE_<code>eu-west-2</code>]</p><p>[[PH_HTML_CODE_<code>eu-west-3</code>]</p><p>[[<code>ap-southeast-2</code>]]</p><p>[[<code>keyring_aws_region</code><code>ap-southeast-2</code>]</p><p>[[<code>cn-north-1</code>]]</p><p>[[<code>cn-northwest-1</code>]]</p><p>[[<code>eu-central-1</code>]]</p><p>[[<code>eu-north-1</code>]]</p><p>[[<code>eu-south-1</code>]]</p><p>[[<code>eu-west-1</code>]]</p><p>[[<code>eu-west-2</code>]]</p><p>[[<code>eu-west-3</code>]]</p><p>[[<code>us-east-1</code><code>ap-southeast-2</code>]</p><p>[[<code>us-east-1</code><code>ap-southeast-2</code>]</p><p>[[<code>us-east-1</code><code>cn-north-1</code>]</p><p>[[<code>us-east-1</code><code>cn-northwest-1</code>]</p><p>[[<code>us-east-1</code><code>eu-central-1</code>]</p><p>[[<code>us-east-1</code><code>eu-north-1</code>]</p><p>[[<code>us-east-1</code><code>eu-south-1</code>]</p><p>[[<code>us-east-1</code><code>eu-west-1</code>]</p><p>[[<code>us-east-1</code><code>eu-west-2</code>]</p><p>[[<code>us-east-1</code><code>eu-west-3</code>]</p></td> </tr><tr><th>Valores válidos (≥ 5.7.27, ≤ 5.7.38)</th> <td><p>[[<code>af-south-1</code><code>ap-southeast-2</code>]</p><p>[[<code>af-south-1</code><code>ap-southeast-2</code>]</p><p>[[<code>af-south-1</code><code>cn-north-1</code>]</p><p>[[<code>af-south-1</code><code>cn-northwest-1</code>]</p><p>[[<code>af-south-1</code><code>eu-central-1</code>]</p><p>[[<code>af-south-1</code><code>eu-north-1</code>]</p><p>[[<code>af-south-1</code><code>eu-south-1</code>]</p><p>[[<code>af-south-1</code><code>eu-west-1</code>]</p><p>[[<code>af-south-1</code><code>eu-west-2</code>]</p><p>[[<code>af-south-1</code><code>eu-west-3</code>]</p><p>[[<code>ap-east-1</code><code>ap-southeast-2</code>]</p><p>[[<code>ap-east-1</code><code>ap-southeast-2</code>]</p><p>[[<code>ap-east-1</code><code>cn-north-1</code>]</p><p>[[<code>ap-east-1</code><code>cn-northwest-1</code>]</p><p>[[<code>ap-east-1</code><code>eu-central-1</code>]</p><p>[[<code>ap-east-1</code><code>eu-north-1</code>]</p><p>[[<code>ap-east-1</code><code>eu-south-1</code>]</p></td> </tr><tr><th>Valores válidos (≥ 5.7.19, ≤ 5.7.26)</th> <td><p>[[<code>ap-east-1</code><code>eu-west-1</code>]</p><p>[[<code>ap-east-1</code><code>eu-west-2</code>]</p><p>[[<code>ap-east-1</code><code>eu-west-3</code>]</p><p>[[<code>ap-northeast-1</code><code>ap-southeast-2</code>]</p><p>[[<code>ap-northeast-1</code><code>ap-southeast-2</code>]</p><p>[[<code>ap-northeast-1</code><code>cn-north-1</code>]</p><p>[[<code>ap-northeast-1</code><code>cn-northwest-1</code>]</p><p>[[<code>ap-northeast-1</code><code>eu-central-1</code>]</p><p>[[<code>ap-northeast-1</code><code>eu-north-1</code>]</p><p>[[<code>ap-northeast-1</code><code>eu-south-1</code>]</p><p>[[<code>ap-northeast-1</code><code>eu-west-1</code>]</p></td> </tr></tbody></table>

  A região da AWS para o plugin `keyring_aws`. Essa variável não está disponível, a menos que o plugin esteja instalado.

  Se não estiver definida, a região da AWS será a `us-east-1`. Portanto, para qualquer outra região, essa variável deve ser definida explicitamente.

- `keyring_encrypted_file_data`

  <table frame="box" rules="all" summary="Propriedades para keyring_encrypted_file_data"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-encrypted-file-data=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_encrypted_file_data</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>

  O nome do caminho do arquivo de dados usado para armazenamento seguro de dados pelo plugin `keyring_encrypted_file`. Essa variável não está disponível a menos que o plugin esteja instalado. A localização do arquivo deve estar em um diretório considerado para uso exclusivo por plugins de keyring. Por exemplo, não localize o arquivo sob o diretório de dados.

  As operações do cartela de chaves são transacionais: o plugin `keyring_encrypted_file` usa um arquivo de backup durante as operações de escrita para garantir que possa retornar ao arquivo original se uma operação falhar. O arquivo de backup tem o mesmo nome que o valor da variável de sistema `keyring_encrypted_file_data` com um sufixo de `.backup`.

  Não use o mesmo arquivo de dados `keyring_encrypted_file` para múltiplas instâncias do MySQL. Cada instância deve ter seu próprio arquivo de dados único.

  O nome padrão do arquivo é `keyring_encrypted`, localizado em um diretório específico da plataforma e depende do valor da opção **CMake** `INSTALL_LAYOUT`, conforme mostrado na tabela a seguir. Para especificar o diretório padrão do arquivo explicitamente se você estiver compilando a partir da fonte, use a opção **CMake** `INSTALL_MYSQLKEYRINGDIR`.

  <table summary="O valor padrão keyring_encrypted_file_data para diferentes valores de INSTALL_LAYOUT."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>[[<code>INSTALL_LAYOUT</code>]] Valor</th> <th>Valor padrão [[<code>keyring_encrypted_file_data</code>]]</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CÓDIGO_<code>DEB</code>], [[PH_HTML_CÓDIGO_<code>RPM</code>], [[PH_HTML_CÓDIGO_<code>SLES</code>], [[PH_HTML_CÓDIGO_<code>SVR4</code>]</td> <td>[[<code>/var/lib/mysql-keyring/keyring_encrypted</code>]]</td> </tr><tr> <td>Caso contrário</td> <td>[[<code>keyring/keyring_encrypted</code>]] sob o[[<code>CMAKE_INSTALL_PREFIX</code>]]valor</td> </tr></tbody></table>

  Ao iniciar o plugin, se o valor atribuído a `keyring_encrypted_file_data` especificar um arquivo que não existe, o plugin `keyring_encrypted_file` tentará criá-lo (assim como seu diretório pai, se necessário).

  Se você criar o diretório manualmente, ele deve ter um modo restrito e ser acessível apenas à conta usada para executar o servidor MySQL. Por exemplo, em sistemas Unix e Unix-like, para usar o diretório `/usr/local/mysql/mysql-keyring`, os seguintes comandos (executados como `root`) criam o diretório e definem seu modo e propriedade:

  ```sql
  cd /usr/local/mysql
  mkdir mysql-keyring
  chmod 750 mysql-keyring
  chown mysql mysql-keyring
  chgrp mysql mysql-keyring
  ```

  Se o plugin `keyring_encrypted_file` não conseguir criar ou acessar seu arquivo de dados, ele escreve uma mensagem de erro no log de erros. Se uma tentativa de atribuição dinâmica a `keyring_encrypted_file_data` resultar em um erro, o valor da variável permanece inalterado.

  Importante

  Uma vez que o plugin `keyring_encrypted_file` tenha criado seu arquivo de dados e começado a usá-lo, é importante não removê-lo. A perda do arquivo faz com que os dados criptografados usando suas chaves se tornem inacessíveis. (É permitido renomear ou mover o arquivo, desde que você mude o valor de `keyring_encrypted_file_data` para corresponder.)

- `senha do arquivo criptografado do carteiro de dados`

  <table frame="box" rules="all" summary="Propriedades para keyring_encrypted_file_password"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-encrypted-file-password=password</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.21</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_encrypted_file_password</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A senha usada pelo plugin `keyring_encrypted_file`. Essa variável não está disponível, a menos que o plugin esteja instalado.

  Esta variável é obrigatória. Se não for especificada, a inicialização de `keyring_encrypted_file` falhará.

  Se essa variável for especificada em um arquivo de opção, o arquivo deve ter um modo restrito e ser acessível apenas à conta usada para executar o servidor MySQL.

  Importante

  Depois que o valor de `keyring_encrypted_file_password` for definido, alterá-lo não rotacione a senha do chaveiro e pode tornar o servidor inacessível. Se uma senha incorreta for fornecida, o plugin `keyring_encrypted_file` não poderá carregar as chaves do arquivo do chaveiro criptografado.

  O valor da senha não pode ser exibido em tempo de execução com `SHOW VARIABLES` (show-variables.html) ou na tabela do Schema de Desempenho `global_variables` (performance-schema-system-variable-tables.html) porque o valor de exibição é ofuscado.

- `keyring_file_data`

  <table frame="box" rules="all" summary="Propriedades para keyring_file_data"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-file-data=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.11</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_file_data</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>

  O nome do caminho do arquivo de dados usado para armazenamento seguro de dados pelo plugin `keyring_file`. Essa variável não está disponível, a menos que o plugin esteja instalado. A localização do arquivo deve estar em um diretório considerado para uso exclusivo por plugins de gerenciamento de chaves. Por exemplo, não localize o arquivo sob o diretório de dados.

  As operações do cartela de chaves são transacionais: o plugin `keyring_file` usa um arquivo de backup durante as operações de escrita para garantir que possa retornar ao arquivo original se uma operação falhar. O arquivo de backup tem o mesmo nome que o valor da variável de sistema `keyring_file_data` com um sufixo de `.backup`.

  Não use o mesmo arquivo de dados `keyring_file` para múltiplas instâncias do MySQL. Cada instância deve ter seu próprio arquivo de dados único.

  O nome padrão do arquivo é `keyring`, localizado em um diretório específico da plataforma e depende do valor da opção **CMake** `INSTALL_LAYOUT`, conforme mostrado na tabela a seguir. Para especificar o diretório padrão do arquivo explicitamente se você estiver compilando a partir da fonte, use a opção **CMake** `INSTALL_MYSQLKEYRINGDIR`.

  <table summary="O valor padrão keyring_file_data para diferentes valores de INSTALL_LAYOUT."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>[[<code>INSTALL_LAYOUT</code>]] Valor</th> <th>Valor padrão [[<code>keyring_file_data</code>]]</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CÓDIGO_<code>DEB</code>], [[PH_HTML_CÓDIGO_<code>RPM</code>], [[PH_HTML_CÓDIGO_<code>SLES</code>], [[PH_HTML_CÓDIGO_<code>SVR4</code>]</td> <td>[[<code>/var/lib/mysql-keyring/keyring</code>]]</td> </tr><tr> <td>Caso contrário</td> <td>[[<code>keyring/keyring</code>]] sob o[[<code>CMAKE_INSTALL_PREFIX</code>]]valor</td> </tr></tbody></table>

  Ao iniciar o plugin, se o valor atribuído a `keyring_file_data` especificar um arquivo que não existe, o plugin `keyring_file` tentará criá-lo (assim como seu diretório pai, se necessário).

  Se você criar o diretório manualmente, ele deve ter um modo restrito e ser acessível apenas à conta usada para executar o servidor MySQL. Por exemplo, em sistemas Unix e Unix-like, para usar o diretório `/usr/local/mysql/mysql-keyring`, os seguintes comandos (executados como `root`) criam o diretório e definem seu modo e propriedade:

  ```sql
  cd /usr/local/mysql
  mkdir mysql-keyring
  chmod 750 mysql-keyring
  chown mysql mysql-keyring
  chgrp mysql mysql-keyring
  ```

  Se o plugin `keyring_file` não conseguir criar ou acessar seu arquivo de dados, ele escreve uma mensagem de erro no log de erros. Se uma tentativa de atribuição dinâmica a `keyring_file_data` resultar em um erro, o valor da variável permanece inalterado.

  Importante

  Uma vez que o plugin `keyring_file` tenha criado seu arquivo de dados e começado a usá-lo, é importante não removê-lo. Por exemplo, o `InnoDB` usa o arquivo para armazenar a chave mestre usada para descriptografar os dados nas tabelas que usam a criptografia do espaço de tabelas `InnoDB`; veja Seção 14.14, “Criptografia de Dados em Repouso do InnoDB”. A perda do arquivo faz com que os dados nessas tabelas se tornem inacessíveis. (É permitido renomear ou mover o arquivo, desde que você mude o valor de `keyring_file_data` para corresponder.) Recomenda-se que você crie um backup separado do arquivo de dados do bloco de inicialização imediatamente após criar a primeira tabela criptografada e antes e depois da rotação da chave mestre.

- `keyring_okv_conf_dir`

  <table frame="box" rules="all" summary="Propriedades para keyring_okv_conf_dir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-okv-conf-dir=dir_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.12</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_okv_conf_dir</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td>[[<code>empty string</code>]]</td> </tr></tbody></table>

  O nome do caminho do diretório que armazena as informações de configuração usadas pelo plugin `keyring_okv`. Essa variável não está disponível a menos que o plugin esteja instalado. O local deve ser um diretório considerado para uso exclusivo pelo plugin `keyring_okv`. Por exemplo, não localize o diretório sob o diretório de dados.

  O valor padrão de `keyring_okv_conf_dir` é vazio. Para que o plugin `keyring_okv` possa acessar o Oracle Key Vault, o valor deve ser definido para um diretório que contenha a configuração e os materiais SSL do Oracle Key Vault. Para obter instruções sobre como configurar esse diretório, consulte Seção 6.4.4.4, “Usando o plugin keyring_okv KMIP”.

  O diretório deve ter um modo restrito e ser acessível apenas à conta usada para executar o servidor MySQL. Por exemplo, em sistemas Unix e Unix-like, para usar o diretório `/usr/local/mysql/mysql-keyring-okv`, os seguintes comandos (executados como `root`) criam o diretório e definem seu modo e propriedade:

  ```sql
  cd /usr/local/mysql
  mkdir mysql-keyring-okv
  chmod 750 mysql-keyring-okv
  chown mysql mysql-keyring-okv
  chgrp mysql mysql-keyring-okv
  ```

  Se o valor atribuído a `keyring_okv_conf_dir` especificar um diretório que não existe ou que não contém informações de configuração que permitam estabelecer uma conexão com o Oracle Key Vault, o `keyring_okv` escreve uma mensagem de erro no log de erro. Se uma tentativa de atribuição dinâmica a `keyring_okv_conf_dir` resultar em um erro, o valor da variável e a operação do keyring permanecem inalterados.

- `operações do carteiro de bolso`

  <table frame="box" rules="all" summary="Propriedades para keyring_aws_conf_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--keyring-aws-conf-file=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>keyring_aws_conf_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>platform specific</code>]]</td> </tr></tbody></table>

  Se as operações de chaveiro estão habilitadas. Esta variável é usada durante as operações de migração de chaves. Consulte Seção 6.4.4.7, “Migração de Chaves entre Keystores de Chaveiro”.
