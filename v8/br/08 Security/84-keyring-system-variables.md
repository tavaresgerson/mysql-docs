#### 8.4.4.16 Variáveis do Sistema de Carteira de Chaves

Os plugins de Carteira de Chaves do MySQL suportam as seguintes variáveis de sistema. Use-as para configurar a operação do plugin de carteira de chaves. Essas variáveis não estão disponíveis a menos que o plugin de carteira de chaves apropriado esteja instalado (consulte a Seção 8.4.4.3, “Instalação do Plugin de Carteira de Chaves”).

*  `keyring_aws_cmk_id`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--keyring-aws-cmk-id=valor</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>keyring_aws_cmk_id</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O ID da chave do KMS obtido do servidor do AWS KMS e usado pelo plugin `keyring_aws`. Esta variável não está disponível a menos que o plugin esteja instalado.

  Esta variável é obrigatória. Se não for especificada, a inicialização do `keyring_aws` falha.
*  `keyring_aws_conf_file`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--keyring-aws-conf-file=nome_do_arquivo</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor Padrão</th> <td><code>específico da plataforma</code></td> </tr></tbody></table>

  A localização do arquivo de configuração para o plugin `keyring_aws`. Esta variável não está disponível a menos que o plugin esteja instalado.

  Na inicialização do plugin, o `keyring_aws` lê o ID da chave de acesso do segredo do AWS e a chave do arquivo de configuração. Para que o plugin `keyring_aws` comece com sucesso, o arquivo de configuração deve existir e conter informações válidas de chave de acesso do segredo, inicializadas conforme descrito na Seção 8.4.4.7, “Uso do plugin de Carteira de Chaves Amazon Web Services de carteira de chaves”.

O nome padrão do arquivo é `keyring_aws_conf`, localizado no diretório padrão do arquivo de chave.
* `keyring_aws_data_file`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--keyring-aws-data-file</code></td> </tr><tr><th>Variável do sistema</th> <td>`keyring_aws_data_file`</td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>específico da plataforma</code></td> </tr></tbody></table>

  A localização do arquivo de armazenamento para o plugin `keyring_aws`. Esta variável não está disponível, a menos que o plugin esteja instalado.

  Na inicialização do plugin, se o valor atribuído a `keyring_aws_data_file` especificar um arquivo que não existe, o plugin `keyring_aws` tenta criá-lo (assim como seu diretório pai, se necessário). Se o arquivo existir, o `keyring_aws` lê quaisquer chaves criptografadas contidas no arquivo em seu cache de memória. O `keyring_aws` não cache chaves não criptografadas na memória.

  O nome padrão do arquivo é `keyring_aws_data`, localizado no diretório padrão do arquivo de chave.
* `keyring_aws_region`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--keyring-aws-region=valor</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>keyring_aws_region</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Sugestão de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>us-east-1</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>af-south-1</code></p><p><code>ap-east-1</code></p><p><code>ap-northeast-1</code></p><p><code>ap-northeast-2</code></p><p><code>ap-northeast-3</code></p><p><code>ap-south-1</code></p><p><code>ap-southeast-1</code></p><p><code>ap-southeast-2</code></p><p><code>ca-central-1</code></p><p><code>cn-north-1</code></p><p><code>cn-northwest-1</code></p><p><code>eu-central-1</code></p><p><code>eu-north-1</code></p><p><code>eu-south-1</code></p><p><code>eu-west-1</code></p><p><code>eu-west-2</code></p><p><code>eu-west-3</code></p><p><code>me-south-1</code></p><p><code>sa-east-1</code></p><p><code>us-east-1</code></p><p><code>us-east-2</code></p><p><code>us-gov-east-1</code></p><p><code>us-iso-east-1</code></p><p><code>us-iso-west-1</code></p><p><code>us-isob-east-1</code></p><p><code>us-west-1</code></p><p><code>us-west-2</code></p></td> </tr></tbody></table>

A região da AWS para o plugin `keyring_aws`. Esta variável não está disponível a menos que o plugin esteja instalado.

Se não estiver definida, a região da AWS padrão é `us-east-1`. Assim, para qualquer outra região, essa variável deve ser definida explicitamente.
* `keyring_hashicorp_auth_path`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--keyring-hashicorp-auth-path=valor</code></td> </tr><tr><th>Variável do sistema</th> <td><code>keyring_hashicorp_auth_path</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>/v1/auth/approle/login</code></td> </tr></tbody></table>

  O caminho de autenticação onde a autenticação do AppRole é habilitada no servidor HashiCorp Vault, para uso pelo plugin `keyring_hashicorp`. Essa variável não está disponível a menos que o plugin esteja instalado.
* `keyring_hashicorp_ca_path`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--keyring-hashicorp-ca-path=nome_do_arquivo</code></td> </tr><tr><th>Variável do sistema</th> <td><code>keyring_hashicorp_ca_path</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>string vazia</code></td> </tr></tbody></table>

  O nome do caminho absoluto de um arquivo local acessível ao servidor MySQL que contém um certificado de autoridade de certificação (CA) formatado corretamente para uso pelo plugin `keyring_hashicorp`. Essa variável não está disponível a menos que o plugin esteja instalado.

Se essa variável não for definida, o plugin `keyring_hashicorp` abre uma conexão HTTPS sem usar a verificação de certificado do servidor e confia em qualquer certificado entregue pelo servidor HashiCorp Vault. Para que isso seja seguro, deve-se assumir que o servidor Vault não é malicioso e que não é possível um ataque de intermediário. Se essas suposições forem inválidas, defina `keyring_hashicorp_ca_path` para o caminho de um certificado CA confiável. (Por exemplo, para as instruções na Preparação de Certificado e Chave, este é o arquivo `company.crt`.)
*  `keyring_hashicorp_caching`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--keyring-hashicorp-caching[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>keyring_hashicorp_caching</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Se habilitar ou não a cache de chaves dinâmica de memória opcional usada pelo plugin `keyring_hashicorp` para armazenar chaves do servidor HashiCorp Vault. Essa variável não está disponível a menos que o plugin esteja instalado. Se a cache for habilitada, o plugin a preenche durante a inicialização. Caso contrário, o plugin preenche apenas a lista de chaves durante a inicialização.

  Habilitar a cache é um compromisso: melhora o desempenho, mas mantém uma cópia da informação sensível das chaves na memória, o que pode ser indesejável para fins de segurança.
*  `keyring_hashicorp_commit_auth_path`

  <table><tbody><tr><th>Variável do Sistema</th> <td><code>keyring_hashicorp_commit_auth_path</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Esta variável está associada a `keyring_hashicorp_auth_path`, a partir da qual ela obtém seu valor durante a inicialização do plugin `keyring_hashicorp`. Esta variável não está disponível, a menos que o plugin esteja instalado. Ela reflete o valor "comitado" realmente usado para a operação do plugin se a inicialização for bem-sucedida. Para informações adicionais, consulte a configuração keyring_hashicorp.
*  `keyring_hashicorp_commit_ca_path`

  <table><tbody><tr><th>Variável do Sistema</th> <td><code>keyring_hashicorp_commit_ca_path</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Esta variável está associada a `keyring_hashicorp_ca_path`, a partir da qual ela obtém seu valor durante a inicialização do plugin `keyring_hashicorp`. Esta variável não está disponível, a menos que o plugin esteja instalado. Ela reflete o valor "comitado" realmente usado para a operação do plugin se a inicialização for bem-sucedida. Para informações adicionais, consulte a configuração keyring_hashicorp.
*  `keyring_hashicorp_commit_caching`

  <table><tbody><tr><th>Variável do Sistema</th> <td><code>keyring_hashicorp_commit_caching</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Esta variável está associada a `keyring_hashicorp_caching`, a partir da qual ela obtém seu valor durante a inicialização do plugin `keyring_hashicorp`. Esta variável não está disponível, a menos que o plugin esteja instalado. Ela reflete o valor "comitado" realmente usado para a operação do plugin se a inicialização for bem-sucedida. Para informações adicionais, consulte a configuração keyring_hashicorp.
*  `keyring_hashicorp_commit_role_id`

<table><tbody><tr><th>Variável do Sistema</th> <td><code>keyring_hashicorp_commit_role_id</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Esta variável está associada a `keyring_hashicorp_role_id`, a partir da qual obtém o seu valor durante a inicialização do plugin `keyring_hashicorp`. Esta variável não está disponível a menos que o plugin esteja instalado. Reflete o valor "comitado" realmente usado para a operação do plugin se a inicialização for bem-sucedida. Para informações adicionais, consulte a Configuração keyring_hashicorp.
*  `keyring_hashicorp_commit_server_url`

  <table><tbody><tr><th>Variável do Sistema</th> <td><code>keyring_hashicorp_commit_server_url</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Esta variável está associada a `keyring_hashicorp_server_url`, a partir da qual obtém o seu valor durante a inicialização do plugin `keyring_hashicorp`. Esta variável não está disponível a menos que o plugin esteja instalado. Reflete o valor "comitado" realmente usado para a operação do plugin se a inicialização for bem-sucedida. Para informações adicionais, consulte a Configuração keyring_hashicorp.
*  `keyring_hashicorp_commit_store_path`

Esta variável está associada a `keyring_hashicorp_store_path`, a partir da qual ele obtém seu valor durante a inicialização do plugin `keyring_hashicorp`. Esta variável não está disponível, a menos que o plugin esteja instalado. Ela reflete o valor "comitado" realmente usado para a operação do plugin se a inicialização for bem-sucedida. Para informações adicionais, consulte Configuração keyring_hashicorp.
*  `keyring_hashicorp_role_id`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--keyring-hashicorp-role-id=value</code></td> </tr><tr><th>Variável do sistema</th> <td><code>keyring_hashicorp_role_id</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da dica <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>string vazia</code></td> </tr></tbody></table>

  O ID de autenticação do papel de AppRole do HashiCorp Vault, para uso pelo plugin `keyring_hashicorp`. Esta variável não está disponível, a menos que o plugin esteja instalado. O valor deve estar no formato UUID.

  Esta variável é obrigatória. Se não for especificada, a inicialização do `keyring_hashicorp` falha.
*  `keyring_hashicorp_secret_id`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--keyring-hashicorp-secret-id=value</code></td> </tr><tr><th>Variável do sistema</th> <td><code>keyring_hashicorp_secret_id</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da dica <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>string vazia</code></td> </tr></tbody></table>

  O ID de segredo de autenticação do papel de AppRole do HashiCorp Vault, para uso pelo plugin `keyring_hashicorp`. Esta variável não está disponível, a menos que o plugin esteja instalado. O valor deve estar no formato UUID.

  Esta variável é obrigatória. Se não for especificada, a inicialização do `keyring_hashicorp` falha.

O valor desta variável é sensível, portanto, seu valor é mascarado por caracteres `*` quando exibido.
*  `keyring_hashicorp_server_url`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--keyring-hashicorp-server-url=valor</code></td> </tr><tr><th>Variável do sistema</th> <td><code>keyring_hashicorp_server_url</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da dica <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>https://127.0.0.1:8200</code></td> </tr></tbody></table>

  O URL do servidor HashiCorp Vault, para uso do plugin `keyring_hashicorp`. Esta variável não está disponível, a menos que o plugin esteja instalado. O valor deve começar com `https://`.
*  `keyring_hashicorp_store_path`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--keyring-hashicorp-store-path=valor</code></td> </tr><tr><th>Variável do sistema</th> <td><code>keyring_hashicorp_store_path</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da dica <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>string vazia</code></td> </tr></tbody></table>

  Um caminho de armazenamento dentro do servidor HashiCorp Vault que é gravável quando as credenciais apropriadas do AppRole são fornecidas pelo plugin `keyring_hashicorp`. Esta variável não está disponível, a menos que o plugin esteja instalado. Para especificar as credenciais, defina as variáveis de sistema `keyring_hashicorp_role_id` e `keyring_hashicorp_secret_id` (por exemplo, conforme mostrado na configuração keyring_hashicorp).

  Esta variável é obrigatória. Se não for especificada, a inicialização do `keyring_hashicorp` falha.
*  `keyring_okv_conf_dir`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--keyring-okv-conf-dir=dir_name</code></td> </tr><tr><th>Variável do sistema</th> <td><code>keyring_okv_conf_dir</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da dica `SET_VAR`</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr><tr><th>Valor padrão</th> <td><code>string vazia</code></td> </tr></tbody></table>

  O nome do caminho do diretório que armazena as informações de configuração usadas pelo plugin `keyring_okv`. Essa variável não está disponível a menos que o plugin esteja instalado. A localização deve ser um diretório considerado para uso exclusivo pelo plugin `keyring_okv`. Por exemplo, não localize o diretório sob o diretório de dados.

  O valor padrão de `keyring_okv_conf_dir` é uma string vazia. Para que o plugin `keyring_okv` possa acessar o Oracle Key Vault, o valor deve ser definido para um diretório que contenha a configuração do Oracle Key Vault e materiais SSL. Para obter instruções sobre como configurar esse diretório, consulte a Seção 8.4.4.6, “Usando o plugin KMIP keyring_okv”.

  O diretório deve ter um modo restrito e ser acessível apenas à conta usada para executar o servidor MySQL. Por exemplo, em sistemas Unix e Unix-like, para usar o diretório `/usr/local/mysql/mysql-keyring-okv`, os seguintes comandos (executados como `root`) criam o diretório e definem seu modo e propriedade:

  ```
  cd /usr/local/mysql
  mkdir mysql-keyring-okv
  chmod 750 mysql-keyring-okv
  chown mysql mysql-keyring-okv
  chgrp mysql mysql-keyring-okv
  ```

  Se o valor atribuído a `keyring_okv_conf_dir` especificar um diretório que não existe ou que não contém informações de configuração que permitam a estabelecimento de uma conexão com o Oracle Key Vault, o `keyring_okv` escreve uma mensagem de erro no log de erro. Se uma tentativa de atribuição dinâmica a `keyring_okv_conf_dir` resultar em um erro, o valor da variável e a operação do keyring permanecem inalterados.
*  `keyring_operations`

<table><tbody><tr><th>Variável do Sistema</th> <td><code>keyring_operations</code></td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Dica de Aplicação de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

Se as operações de chaveiro estão habilitadas. Esta variável é usada durante operações de migração de chaves. Consulte a Seção 8.4.4.11, “Migrar Chaves entre Keystores de Chaveiro”. Os privilégios necessários para modificar esta variável são `ENCRYPTION_KEY_ADMIN`, além de `SYSTEM_VARIABLES_ADMIN` ou o privilégio desatualizado `SUPER`.