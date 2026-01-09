#### 8.4.5.19 Variáveis do Sistema de Carteira de Chave

Os plugins de carteira de chave do MySQL suportam as seguintes variáveis de sistema. Use-as para configurar a operação do plugin de carteira de chave. Essas variáveis não estão disponíveis a menos que o plugin de carteira de chave apropriado esteja instalado (consulte a Seção 8.4.5.3, “Instalação do Plugin de Carteira de Chave”).

* `keyring_aws_cmk_id`

  <table frame="box" rules="all" summary="Propriedades para keyring_aws_cmk_id"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--keyring-aws-cmk-id=valor</code></td> </tr><tr><th>Variável de Sistema</th> <td><code class="literal"><a class="link" href="keyring-system-variables.html#sysvar_keyring_aws_cmk_id">keyring_aws_cmk_id</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de Sintaxe de Definição de Hinta</th> <td><code class="literal">SET_VAR</code></a> Aplica-se</td> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O ID da chave do KMS obtido do servidor do KMS da AWS e usado pelo plugin `keyring_aws`. Esta variável não está disponível a menos que o plugin esteja instalado.

  Esta variável é obrigatória. Se não for especificada, a inicialização do `keyring_aws` falha.

* `keyring_aws_conf_file`

<table frame="box" rules="all" summary="Propriedades para keyring_aws_conf_file">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--keyring-aws-conf-file=nome_do_arquivo</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="keyring-system-variables.html#sysvar_keyring_aws_conf_file">keyring_aws_conf_file</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável">SET_VAR</a> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Nome do arquivo</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">específico da plataforma</code></td> </tr>
</table>

  Localização do arquivo de configuração do plugin `keyring_aws`. Essa variável não está disponível a menos que o plugin esteja instalado.

  Ao iniciar o plugin, o `keyring_aws` lê o ID da chave de acesso secreta AWS e a chave do arquivo de configuração. Para que o plugin `keyring_aws` comece com sucesso, o arquivo de configuração deve existir e conter informações válidas da chave de acesso secreta, conforme descrito na Seção 8.4.5.8, “Usando o plugin keyring\_aws Amazon Web Services Keyring”.

  O nome padrão do arquivo é `keyring_aws_conf`, localizado no diretório padrão do arquivo de chaveira.

* `keyring_aws_data_file`

<table frame="box" rules="all" summary="Propriedades para keyring_aws_data_file">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--keyring-aws-data-file</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code class="literal"><a class="link" href="keyring-system-variables.html#sysvar_keyring_aws_data_file">keyring_aws_data_file</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">platform specific</code></td>
  </tr>
</table>

  Localização do arquivo de armazenamento para o plugin `keyring_aws`. Esta variável não está disponível a menos que o plugin esteja instalado.

  Ao iniciar o plugin, se o valor atribuído a `keyring_aws_data_file` especificar um arquivo que não existe, o plugin `keyring_aws` tenta criá-lo (assim como seu diretório pai, se necessário). Se o arquivo existir, o `keyring_aws` lê quaisquer chaves criptografadas contidas no arquivo em sua cache de memória. O `keyring_aws` não cache chaves não criptografadas na memória.

  O nome padrão do arquivo é `keyring_aws_data`, localizado no diretório padrão do arquivo de chave.

* `keyring_aws_region`

<table frame="box" rules="all" summary="Propriedades para keyring_aws_region">
<tr><th>Formato de Linha de Comando</th> <td><code class="literal">--keyring-aws-region=valor</code></td> </tr>
<tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="keyring-system-variables.html#sysvar_keyring_aws_region">keyring_aws_region</a></code></td> </tr>
<tr><th>Alcance</th> <td>Global</td> </tr>
<tr><th>Dinâmica</th> <td>Sim</td> </tr>
<tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Definição de Variável"><code class="literal">SET_VAR</a></th> <td>Não</td> </tr>
<tr><th>Tipo</th> <td>Enumeração</td> </tr>
<tr><th>Valor Padrão</th> <td><code class="literal">us-east-1</code></td> </tr>
<tr><th>Valores Válidos</th> <td><p class="valid-value"><code class="literal">af-south-1</code></p><p class="valid-value"><code class="literal">ap-east-1</code></p><p class="valid-value"><code class="literal">ap-northeast-1</code></p><p class="valid-value"><code class="literal">ap-northeast-2</code></p><p class="valid-value"><code class="literal">ap-northeast-3</code></p><p class="valid-value"><code class="literal">ap-south-1</code></p><p class="valid-value"><code class="literal">ap-southeast-1</code></p><p class="valid-value"><code class="literal">ap-southeast-2</code></p><p class="valid-value"><code class="literal">ca-central-1</code></p><p class="valid-value"><code class="literal">cn-north-1</code></p><p class="valid-value"><code class="literal">cn-northwest-1</code></p><p class="valid-value"><code class="literal">eu-central-1</code></p><p class="valid-value"><code class="literal">eu-north-1</code></p><p class="valid-value"><code class="literal">eu-south-1</code></p><p class="valid-value"><code class="literal">eu-west-1</code></p><p class="valid-value"><code class="literal">eu-west-2</code></p><p class="valid-value"><code class="literal">eu-west-3</code></p><p class="valid-value"><code class="literal">me-south-1</code></p><p class="valid-value"><code class="literal">sa-east-1</code></p><p class="valid-value"><code class="literal">us-east-1</code></p><p class="valid-value"><code class="literal">us-east-2</code></p><p class="valid-value"><code class="literal">us-gov-east-1</code></p><p class="valid-value"><code class="literal">us-iso-east-1</code></p><p class="valid-value"><code class="literal">us-iso-west-1</code></p><p class="valid-value"><code class="literal">us-west-1</code></p><p class="valid-value"><code class="literal">us-west-2</code></p></td> </tr>
</tbody></table>

A região AWS para o plugin `keyring_aws`. Essa variável não está disponível, a menos que o plugin esteja instalado.

Se não estiver definida, a região AWS padrão é `us-east-1`. Portanto, para qualquer outra região, essa variável deve ser definida explicitamente.

* `keyring_hashicorp_auth_path`

  <table frame="box" rules="all" summary="Propriedades para keyring_hashicorp_auth_path"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--keyring-hashicorp-auth-path=valor</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr><tr><th>Variável do sistema</th> <td><code class="literal"><a class="link" href="keyring-system-variables.html#sysvar_keyring_hashicorp_auth_path">keyring_hashicorp_auth_path</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code class="literal">SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">/v1/auth/approle/login</code></td> </tr></tbody></table>

  O caminho de autenticação onde a autenticação AppRole é habilitada no servidor HashiCorp Vault, para uso pelo plugin `keyring_hashicorp`. Essa variável não está disponível, a menos que o plugin esteja instalado.

* `keyring_hashicorp_ca_path`

<table frame="box" rules="all" summary="Propriedades para keyring_hashicorp_ca_path">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--keyring-hashicorp-ca-path=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Desatualizado</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code class="literal"><a class="link" href="keyring-system-variables.html#sysvar_keyring_hashicorp_ca_path">keyring_hashicorp_ca_path</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">string vazia</code></td>
  </tr>
</table>

  O nome do caminho absoluto de um arquivo local acessível ao servidor MySQL que contém um certificado de autoridade de certificação TLS formatado corretamente para uso pelo plugin `keyring_hashicorp`. Esta variável não está disponível a menos que o plugin seja instalado.

  Se esta variável não for definida, o plugin `keyring_hashicorp` abre uma conexão HTTPS sem usar a verificação de certificado do servidor e confia em qualquer certificado entregue pelo servidor HashiCorp Vault. Para que isso seja seguro, deve-se assumir que o servidor Vault não é malicioso e que não é possível um ataque de intermediário. Se essas suposições forem inválidas, defina `keyring_hashicorp_ca_path` para o caminho de um certificado de CA confiável. (Por exemplo, para as instruções em Preparação de Certificado e Chave, este é o arquivo `company.crt`.)

* `keyring_hashicorp_caching`

<table frame="box" rules="all" summary="Propriedades para keyring_hashicorp_caching">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code class="literal">--keyring-hashicorp-caching[={OFF|ON}]</code></td>
  </tr>
  <tr>
    <th>Desatualizado</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="keyring-system-variables.html#sysvar_keyring_hashicorp_caching">keyring_hashicorp_caching</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável"><code class="literal">SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">OFF</code></td>
  </tr>
  </tbody></table>

  Se habilitar ou desabilitar o cache de chaves de memória opcional usado pelo plugin `keyring_hashicorp` para armazenar chaves do servidor HashiCorp Vault. Essa variável não está disponível a menos que o plugin esteja instalado. Se o cache for habilitado, o plugin o preenche durante a inicialização. Caso contrário, o plugin preenche apenas a lista de chaves durante a inicialização.

  Habilitar o cache é um compromisso: melhora o desempenho, mas mantém uma cópia da informação sensível das chaves na memória, o que pode ser indesejável para fins de segurança.

* `keyring_hashicorp_commit_auth_path`

<table frame="box" rules="all" summary="Propriedades para keyring_hashicorp_commit_auth_path">
  <tr>
    <th>Desatualizado</th> <td>Sim</td>
  </tr>
  <tr>
    <th>Variável de sistema</th> <td><code class="literal"><a class="link" href="keyring-system-variables.html#sysvar_keyring_hashicorp_commit_auth_path">keyring_hashicorp_commit_auth_path</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th> <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th> <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th> <td>String</td>
  </tr>
</table>

  Esta variável está associada a `keyring_hashicorp_auth_path`, da qual ela obtém seu valor durante a inicialização do plugin `keyring_hashicorp`. Esta variável não está disponível a menos que o plugin seja instalado. Ela reflete o valor "comitado" realmente usado para a operação do plugin se a inicialização for bem-sucedida. Para obter informações adicionais, consulte a configuração keyring\_hashicorp.

* `keyring_hashicorp_commit_ca_path`

<table frame="box" rules="all" summary="Propriedades para keyring_hashicorp_commit_ca_path">
  <tr>
    <th>Desatualizado</th> <td>Sim</td>
  </tr>
  <tr>
    <th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="keyring-system-variables.html#sysvar_keyring_hashicorp_commit_ca_path">keyring_hashicorp_commit_ca_path</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th> <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th> <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th> <td>String</td>
  </tr>
</table>

  Esta variável está associada a `keyring_hashicorp_ca_path`, da qual ela obtém seu valor durante a inicialização do plugin `keyring_hashicorp`. Esta variável não está disponível a menos que o plugin seja instalado. Ela reflete o valor "comitado" realmente usado para a operação do plugin se a inicialização for bem-sucedida. Para obter informações adicionais, consulte Configuração keyring\_hashicorp.

* `keyring_hashicorp_commit_caching`

<table frame="box" rules="all" summary="Propriedades para keyring_hashicorp_commit_caching">
  <tr>
    <th>Desatualizado</th> <td>Sim</td>
  </tr>
  <tr>
    <th>Variável de sistema</th> <td><code class="literal"><a class="link" href="keyring-system-variables.html#sysvar_keyring_hashicorp_commit_caching">keyring_hashicorp_commit_caching</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th> <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th> <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th> <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th> <td>String</td>
  </tr>
</table>

Esta variável está associada a `keyring_hashicorp_caching`, da qual ela obtém seu valor durante a inicialização do plugin `keyring_hashicorp`. Esta variável não está disponível a menos que o plugin seja instalado. Ela reflete o valor "comitado" realmente usado para a operação do plugin se a inicialização for bem-sucedida. Para obter informações adicionais, consulte a configuração keyring\_hashicorp.

* `keyring_hashicorp_commit_role_id`

<table frame="box" rules="all" summary="Propriedades para keyring_aws_conf_file">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code class="literal">--keyring-aws-conf-file=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="keyring-system-variables.html#sysvar_keyring_aws_conf_file">keyring_aws_conf_file</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável"><code class="literal">SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">específico da plataforma</code></td>
  </tr>
</tbody></table>0

Esta variável está associada a `keyring_hashicorp_role_id`, da qual ela obtém seu valor durante a inicialização do plugin `keyring_hashicorp`. Esta variável não está disponível a menos que o plugin seja instalado. Ela reflete o valor "comitado" realmente usado para a operação do plugin se a inicialização for bem-sucedida. Para informações adicionais, consulte Configuração keyring\_hashicorp.

* `keyring_hashicorp_commit_server_url`

<table frame="box" rules="all" summary="Propriedades para keyring_aws_conf_file">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code class="literal">--keyring-aws-conf-file=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="keyring-system-variables.html#sysvar_keyring_aws_conf_file">keyring_aws_conf_file</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável"><code class="literal">SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">específico da plataforma</code></td>
  </tr>
</tbody></table>1

Esta variável está associada a `keyring_hashicorp_server_url`, da qual ela obtém seu valor durante a inicialização do plugin `keyring_hashicorp`. Esta variável não está disponível a menos que o plugin seja instalado. Ela reflete o valor "comitado" realmente usado para a operação do plugin se a inicialização for bem-sucedida. Para informações adicionais, consulte Configuração keyring\_hashicorp.

* `keyring_hashicorp_commit_store_path`

<table frame="box" rules="all" summary="Propriedades para keyring_aws_conf_file">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--keyring-aws-conf-file=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code class="literal"><a class="link" href="keyring-system-variables.html#sysvar_keyring_aws_conf_file">keyring_aws_conf_file</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></th></a> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">específico da plataforma</code></td>
  </tr>
</tbody></table>

Esta variável está associada a `keyring_hashicorp_store_path`, a partir da qual obtém seu valor durante a inicialização do plugin `keyring_hashicorp`. Esta variável não está disponível a menos que o plugin seja instalado. Ela reflete o valor "comitado" realmente usado para a operação do plugin, se a inicialização for bem-sucedida. Para obter informações adicionais, consulte Configuração keyring\_hashicorp.

* `keyring_hashicorp_role_id`

<table frame="box" rules="all" summary="Propriedades para keyring_aws_conf_file">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code class="literal">--keyring-aws-conf-file=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="keyring-system-variables.html#sysvar_keyring_aws_conf_file">keyring_aws_conf_file</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável"><code class="literal">SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">específico da plataforma</code></td>
  </tr>
</table>
3

O ID da função de autenticação HashiCorp Vault AppRole, para uso do plugin `keyring_hashicorp`. Essa variável não está disponível a menos que o plugin esteja instalado. O valor deve estar no formato UUID.

Esta variável é obrigatória. Se não for especificada, a inicialização do `keyring_hashicorp` falha.

* `keyring_hashicorp_secret_id`

<table frame="box" rules="all" summary="Propriedades para keyring_aws_conf_file">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--keyring-aws-conf-file=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code class="literal"><a class="link" href="keyring-system-variables.html#sysvar_keyring_aws_conf_file">keyring_aws_conf_file</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmica</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">específico da plataforma</code></td>
  </tr>
</table>
4

O ID do segredo de autenticação do HashiCorp Vault AppRole, para uso do plugin `keyring_hashicorp`. Essa variável não está disponível a menos que o plugin esteja instalado. O valor deve estar no formato UUID.

Essa variável é obrigatória. Se não for especificada, a inicialização do `keyring_hashicorp` falha.

O valor dessa variável é sensível, portanto, seu valor é mascarado por caracteres `*` quando exibido.

* `keyring_hashicorp_server_url`

<table frame="box" rules="all" summary="Propriedades para keyring_aws_conf_file">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code class="literal">--keyring-aws-conf-file=file_name</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="keyring-system-variables.html#sysvar_keyring_aws_conf_file">keyring_aws_conf_file</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável"><code class="literal">SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">específico da plataforma</code></td>
  </tr>
</table>
5. O URL do servidor HashiCorp Vault, para uso do plugin `keyring_hashicorp`. Essa variável não está disponível a menos que o plugin esteja instalado. O valor deve começar com `https://`.

* `keyring_hashicorp_store_path`

<table frame="box" rules="all" summary="Propriedades para keyring_aws_conf_file">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code class="literal">--keyring-aws-conf-file=nome_do_arquivo</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="keyring-system-variables.html#sysvar_keyring_aws_conf_file">keyring_aws_conf_file</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável"><code class="literal">SET_VAR</a></th></a> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">específico da plataforma</code></td>
  </tr>
</tbody></table>6

  Um caminho de armazenamento dentro do servidor HashiCorp Vault que é gravável quando as credenciais do AppRole apropriadas são fornecidas pelo plugin `keyring_hashicorp`. Esta variável não está disponível a menos que esse plugin esteja instalado. Para especificar as credenciais, defina as variáveis de sistema `keyring_hashicorp_role_id` e `keyring_hashicorp_secret_id` (por exemplo, conforme mostrado na Configuração do keyring\_hashicorp).

  Esta variável é obrigatória. Se não for especificada, a inicialização do `keyring_hashicorp` falha.

* `keyring_okv_conf_dir`

<table frame="box" rules="all" summary="Propriedades para keyring_aws_conf_file">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--keyring-aws-conf-file=nome_arquivo</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code class="literal"><a class="link" href="keyring-system-variables.html#sysvar_keyring_aws_conf_file">keyring_aws_conf_file</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Não</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável"><code class="literal">SET_VAR</a></code></a> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Nome do arquivo</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">específico da plataforma</code></td> </tr>
</table>7

  O nome do caminho do diretório que armazena as informações de configuração usadas pelo plugin `keyring_okv`. Essa variável não está disponível a menos que o plugin esteja instalado. A localização deve ser um diretório considerado para uso exclusivo pelo plugin `keyring_okv`. Por exemplo, não localize o diretório sob o diretório de dados.

  O valor padrão `keyring_okv_conf_dir` está vazio. Para que o plugin `keyring_okv` possa acessar o Oracle Key Vault, o valor deve ser definido para um diretório que contenha a configuração do Oracle Key Vault e materiais SSL. Para obter instruções sobre como configurar esse diretório, consulte a Seção 8.4.5.6, “Usando o plugin KMIP keyring\_okv”.

O diretório deve ter um modo restrito e ser acessível apenas à conta usada para executar o servidor MySQL. Por exemplo, em sistemas Unix e Unix-like, para usar o diretório `/usr/local/mysql/mysql-keyring-okv`, os seguintes comandos (executados como `root`) criam o diretório e definem seu modo e propriedade:

```
  cd /usr/local/mysql
  mkdir mysql-keyring-okv
  chmod 750 mysql-keyring-okv
  chown mysql mysql-keyring-okv
  chgrp mysql mysql-keyring-okv
  ```

Se o valor atribuído a `keyring_okv_conf_dir` especificar um diretório que não existe ou que não contém informações de configuração que permitam a estabelecimento de uma conexão com o Oracle Key Vault, o `keyring_okv` escreve uma mensagem de erro no log de erro. Se uma tentativa de atribuição dinâmica a `keyring_okv_conf_dir` resultar em um erro, o valor da variável e a operação do keyring permanecem inalterados.

* `keyring_operations`

<table frame="box" rules="all" summary="Propriedades para keyring_aws_conf_file">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code class="literal">--keyring-aws-conf-file=file_name</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="keyring-system-variables.html#sysvar_keyring_aws_conf_file">keyring_aws_conf_file</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de Configuração</th>
    <td><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração do SET_VAR">Hinta de SET_VAR</a> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code class="literal">específico da plataforma</code></td>
  </tr>
  </tbody>
</table>8

Se as operações de chave de bolso estão habilitadas. Esta variável é usada durante as operações de migração de chaves. Consulte a Seção 8.4.5.14, “Migrar Chaves entre Keystores de Chave de Bolso”. Os privilégios necessários para modificar esta variável são `ENCRYPTION_KEY_ADMIN`, além de `SYSTEM_VARIABLES_ADMIN` ou o privilégio desatualizado `SUPER`.