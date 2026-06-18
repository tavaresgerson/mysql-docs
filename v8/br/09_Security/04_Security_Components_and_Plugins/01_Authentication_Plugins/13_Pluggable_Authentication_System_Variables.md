#### 8.4.1.13 Variáveis do Sistema de Autenticação Conectable

Essas variáveis não estão disponíveis, a menos que o plugin apropriado do lado do servidor esteja instalado:

- `authentication_ldap_sasl` para variáveis de sistema com nomes na forma `authentication_ldap_sasl_xxx`

- `authentication_ldap_simple` para variáveis de sistema com nomes na forma `authentication_ldap_simple_xxx`

**Tabela 8.29 Resumo das variáveis de sistema do plugin de autenticação**

<table summary="Referência para autenticação de variáveis do sistema de plugins."><thead><tr><th scope="col">Nome</th> <th scope="col">Linha de comando</th> <th scope="col">Arquivo de Opções</th> <th scope="col">Sistema Var</th> <th scope="col">Status Var</th> <th scope="col">Var Scope</th> <th scope="col">Dinâmico</th> </tr></thead><tbody><tr><th>authentication_fido_rp_id</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_kerberos_service_key_tab</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>authentication_kerberos_service_principal</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_auth_method_name</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_bind_base_dn</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_bind_root_dn</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_bind_root_pwd</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_ca_path</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_group_search_attr</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_group_search_filter</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_init_pool_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_log_status</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_max_pool_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>autenticação_ldap_sasl_referral</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_server_host</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_server_port</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>autenticação_ldap_sasl_tls</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_user_search_attr</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_simple_auth_method_name</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_simple_bind_base_dn</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>autenticação_ldap_simple_bind_root_dn</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>autenticação_ldap_simple_bind_root_pwd</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_simple_ca_path</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_simple_group_search_attr</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_simple_group_search_filter</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_simple_init_pool_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_simple_log_status</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_simple_max_pool_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>autenticação_ldap_simple_referral</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_simple_server_host</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_simple_server_port</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>autenticação_ldap_simple_tls</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_simple_user_search_attr</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>política_de_autenticação</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>nível_de_log_de_autenticação_windows</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>authentication_windows_use_principal_name</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr></tbody></table>

- `authentication_fido_rp_id`

  <table summary="Propriedades para autenticação_fido_rp_id"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-fido-rp-id=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.27</td> </tr><tr><th>Desatualizado</th> <td>8.0.35</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_fido_rp_id</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>MySQL</code>]]</td> </tr></tbody></table>

  Esta variável especifica o ID da parte dependente usada para o registro do dispositivo FIDO e autenticação FIDO. Se a autenticação FIDO for tentada e este valor não for o esperado pelo dispositivo FIDO, o dispositivo assume que não está se comunicando com o servidor correto e um erro ocorre. O comprimento máximo do valor é de 255 caracteres.

  Nota

  A partir do MySQL 8.0.35, essa variável do plugin está desatualizada e está sujeita à remoção em uma futura versão do MySQL.

- `authentication_kerberos_service_key_tab`

  <table summary="Propriedades para authentication_kerberos_service_key_tab"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-kerberos-service-key-tab=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.26</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_kerberos_service_key_tab</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>datadir/mysql.keytab</code>]]</td> </tr></tbody></table>

  O nome do arquivo de tabela de chaves do lado do servidor (”keytab”) que contém as chaves do serviço Kerberos para autenticar os ingressos do serviço MySQL recebidos dos clientes. O nome do arquivo deve ser fornecido como um nome de caminho absoluto. Se essa variável não for definida, o padrão é `mysql.keytab` no diretório de dados.

  O arquivo deve existir e conter uma chave válida para o nome do principal do serviço (SPN) ou a autenticação dos clientes falhará. (O SPN e a mesma chave também devem ser criados no servidor Kerberos.) O arquivo pode conter vários nomes de principais de serviço e suas respectivas combinações de chaves.

  O arquivo deve ser gerado pelo administrador do servidor Kerberos e copiado para um local acessível pelo servidor MySQL. O arquivo pode ser validado para garantir que ele esteja correto e que tenha sido copiado corretamente usando este comando:

  ```
  klist -k file_name
  ```

  Para obter informações sobre arquivos keytab, consulte <https://web.mit.edu/kerberos/krb5-latest/doc/basic/keytab_def.html>.

- `authentication_kerberos_service_principal`

  <table summary="Propriedades para autenticação_kerberos_service_principal"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-kerberos-service-principal=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.26</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_kerberos_service_principal</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>mysql/host_name@realm_name</code>]]</td> </tr></tbody></table>

  O nome do principal do serviço Kerberos (SPN) que o servidor MySQL envia aos clientes.

  O valor é composto pelo nome do serviço (`mysql`), um nome de host e um nome de domínio. O valor padrão é `mysql/host_name@realm_name`. O domínio no nome do principal do serviço permite a recuperação da chave exata do serviço.

  Para usar um valor não padrão, defina o valor usando o mesmo formato. Por exemplo, para usar um nome de host de `krbauth.example.com` e um domínio de `MYSQL.LOCAL`, defina `authentication_kerberos_service_principal` para `mysql/krbauth.example.com@MYSQL.LOCAL`.

  O nome do principal do serviço e a chave do serviço devem estar já presentes no banco de dados gerenciado pelo servidor KDC.

  Pode haver nomes de administradores de serviço que diferem apenas pelo nome do domínio.

- `authentication_ldap_sasl_auth_method_name`

  <table summary="Propriedades para authentication_ldap_sasl_auth_method_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-ldap-sasl-auth-method-name=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_ldap_sasl_auth_method_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>SCRAM-SHA-1</code>]]</td> </tr><tr><th>Valores válidos (≥ 8.0.23)</th> <td><p class="valid-value">[[<code>SCRAM-SHA-1</code>]]</p><p class="valid-value">[[<code>SCRAM-SHA-256</code>]]</p><p class="valid-value">[[<code>GSSAPI</code>]]</p></td> </tr><tr><th>Valores válidos (≥ 8.0.20, ≤ 8.0.22)</th> <td><p class="valid-value">[[<code>SCRAM-SHA-1</code>]]</p><p class="valid-value">[[<code>GSSAPI</code>]]</p></td> </tr><tr><th>Valores válidos (≤ 8.0.19)</th> <td>[[<code>SCRAM-SHA-1</code>]]</td> </tr></tbody></table>

  Para autenticação SASL LDAP, o nome do método de autenticação. A comunicação entre o plugin de autenticação e o servidor LDAP ocorre de acordo com este método de autenticação para garantir a segurança da senha.

  Estes valores dos métodos de autenticação são permitidos:

  - `SCRAM-SHA-1`: Use um mecanismo de desafio-resposta SASL.

    O plugin `authentication_ldap_sasl_client` do lado do cliente comunica-se com o servidor SASL, usando a senha para criar um desafio e obter um buffer de solicitação SASL, e depois passa esse buffer para o plugin SASL LDAP do lado do servidor. Os plugins SASL LDAP do lado do cliente e do lado do servidor usam mensagens SASL para a transmissão segura de credenciais dentro do protocolo LDAP, para evitar o envio da senha em texto claro entre o cliente e o servidor MySQL.

  - `SCRAM-SHA-256`: Use um mecanismo de desafio-resposta SASL.

    Esse método é semelhante ao `SCRAM-SHA-1`, mas é mais seguro. Ele está disponível no MySQL 8.0.23 e versões posteriores. Ele requer um servidor OpenLDAP construído usando o Cyrus SASL 2.1.27 ou versões posteriores.

  - `GSSAPI`: Use o Kerberos, um protocolo sem senha e baseado em ingressos.

    O GSSAPI/Kerberos é suportado como método de autenticação para clientes e servidores MySQL apenas no Linux. É útil em ambientes Linux onde as aplicações acessam o LDAP usando o Microsoft Active Directory, que tem o Kerberos habilitado por padrão.

    O plugin `authentication_ldap_sasl_client` do lado do cliente obtém um ticket de serviço usando o ticket de concessão de ticket (TGT) do Kerberos, mas não usa diretamente os serviços LDAP. O plugin `authentication_ldap_sasl` do lado do servidor encaminha as mensagens do Kerberos entre o plugin do lado do cliente e o servidor LDAP. Usando as credenciais assim obtidas, o plugin do lado do servidor então se comunica com o servidor LDAP para interpretar mensagens de autenticação LDAP e recuperar grupos LDAP.

- `authentication_ldap_sasl_bind_base_dn`

  <table summary="Propriedades para autenticação_ldap_sasl_bind_base_dn"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-ldap-sasl-bind-base-dn=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_ldap_sasl_bind_base_dn</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

  Para a autenticação SASL LDAP, o nome distinto de base (DN). Essa variável pode ser usada para limitar o escopo das pesquisas ancorando-as em um determinado local (a "base") dentro da árvore de pesquisa.

  Suponha que os membros de um conjunto de entradas de usuário do LDAP tenham cada um essa forma:

  ```
  uid=user_name,ou=People,dc=example,dc=com
  ```

  E que os membros de outro conjunto de entradas de usuário do LDAP tenham cada um essa forma:

  ```
  uid=user_name,ou=Admin,dc=example,dc=com
  ```

  Em seguida, as pesquisas funcionam da seguinte forma para diferentes valores de DN de base:

  - Se o DN de base for `ou=People,dc=example,dc=com`: As pesquisas encontram entradas de usuário apenas no primeiro conjunto.

  - Se o DN de base for `ou=Admin,dc=example,dc=com`: As pesquisas encontram entradas de usuário apenas no segundo conjunto.

  - Se o DN de base for `ou=dc=example,dc=com`: As pesquisas encontram entradas de usuário no primeiro ou segundo conjunto.

  Em geral, valores de DN de base mais específicos resultam em pesquisas mais rápidas, pois limitam o escopo da pesquisa mais.

- `authentication_ldap_sasl_bind_root_dn`

  <table summary="Propriedades para autenticação_ldap_sasl_bind_root_dn"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-ldap-sasl-bind-root-dn=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_ldap_sasl_bind_root_dn</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

  Para a autenticação SASL LDAP, o nome distinto raiz (DN). Esta variável é usada em conjunto com `authentication_ldap_sasl_bind_root_pwd` como credenciais para autenticar-se no servidor LDAP com o propósito de realizar pesquisas. A autenticação usa uma ou duas operações de vinculação LDAP, dependendo se o nome da conta MySQL nomeia um DN de usuário LDAP:

  - Se a conta não nomear um DN do usuário, o `authentication_ldap_sasl` realiza uma ligação LDAP inicial usando `authentication_ldap_sasl_bind_root_dn` e `authentication_ldap_sasl_bind_root_pwd`. (Ambos são preenchidos por padrão, então, se não forem definidos, o servidor LDAP deve permitir conexões anônimas.) O handle de ligação LDAP resultante é usado para buscar o DN do usuário, com base no nome do usuário do cliente. O `authentication_ldap_sasl` realiza uma segunda ligação usando o DN do usuário e a senha fornecida pelo cliente.

  - Se a conta nomear um DN do usuário: A primeira operação de vinculação é desnecessária neste caso. `authentication_ldap_sasl` realiza uma única vinculação usando o DN do usuário e a senha fornecida pelo cliente. Isso é mais rápido do que se a conta do MySQL não especificar um DN de usuário LDAP.

- `authentication_ldap_sasl_bind_root_pwd`

  <table summary="Propriedades para autenticação_ldap_sasl_bind_root_pwd"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-ldap-sasl-bind-root-pwd=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_ldap_sasl_bind_root_pwd</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

  Para autenticação SASL LDAP, a senha para o nome distinto raiz. Esta variável é usada em conjunto com `authentication_ldap_sasl_bind_root_dn`. Veja a descrição dessa variável.

- `authentication_ldap_sasl_ca_path`

  <table summary="Propriedades para autenticação_ldap_sasl_ca_path"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-ldap-sasl-ca-path=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_ldap_sasl_ca_path</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

  Para autenticação SASL LDAP, o caminho absoluto do arquivo da autoridade de certificação. Especifique este arquivo se desejar que o plugin de autenticação realize a verificação do certificado do servidor LDAP.

  Nota

  Além de definir a variável `authentication_ldap_sasl_ca_path` com o nome do arquivo, você deve adicionar os certificados da autoridade de certificação apropriada ao arquivo e habilitar a variável de sistema `authentication_ldap_sasl_tls`. Essas variáveis podem ser definidas para substituir a configuração padrão de TLS do OpenLDAP; consulte LDAP Pluggable Authentication e ldap.conf

- `authentication_ldap_sasl_group_search_attr`

  <table summary="Propriedades para autenticação_ldap_sasl_group_search_attr"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-ldap-sasl-group-search-attr=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_ldap_sasl_group_search_attr</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>cn</code>]]</td> </tr></tbody></table>

  Para a autenticação SASL LDAP, o nome do atributo que especifica os nomes dos grupos nas entradas de diretório do LDAP. Se `authentication_ldap_sasl_group_search_attr` tiver seu valor padrão de `cn`, as pesquisas retornarão o valor `cn` como o nome do grupo. Por exemplo, se uma entrada LDAP com um valor de `uid` de `user1` tiver um atributo `cn` de `mygroup`, pesquisas para `user1` retornarão `mygroup` como o nome do grupo.

  Esta variável deve ser uma string vazia se você não quiser autenticação de grupo ou proxy.

  Se o atributo de busca de grupo for `isMemberOf`, a autenticação LDAP recupera diretamente o valor do atributo de usuário `isMemberOf` e atribui-o como informação de grupo. Se o atributo de busca de grupo não for `isMemberOf`, a autenticação LDAP procura por todos os grupos nos quais o usuário é membro. (Este é o comportamento padrão.) Esse comportamento é baseado na forma como as informações de grupo do LDAP podem ser armazenadas de duas maneiras: 1) Uma entrada de grupo pode ter um atributo nomeado `memberUid` ou `member` com um valor que é um nome de usuário; 2) Uma entrada de usuário pode ter um atributo nomeado `isMemberOf` com valores que são nomes de grupo.

- `authentication_ldap_sasl_group_search_filter`

  <table summary="Propriedades para autenticação_fido_rp_id"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-fido-rp-id=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.27</td> </tr><tr><th>Desatualizado</th> <td>8.0.35</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_fido_rp_id</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>MySQL</code>]]</td> </tr></tbody></table>0

  Para autenticação SASL LDAP, o filtro de pesquisa de grupo personalizado.

  O valor do filtro de pesquisa pode conter a notação `{UA}` e `{UD}` para representar o nome do usuário e o DN completo do usuário. Por exemplo, `{UA}` é substituído por um nome de usuário como `"admin"`, enquanto `{UD}` é substituído por um DN completo como `"uid=admin,ou=People,dc=example,dc=com"`. O valor seguinte é o padrão, que suporta tanto o OpenLDAP quanto o Active Directory:

  ```
  (|(&(objectClass=posixGroup)(memberUid={UA}))
    (&(objectClass=group)(member={UD})))
  ```

  Em alguns casos, para o cenário do usuário, `memberOf` é um atributo de usuário simples que não contém informações de grupo. Para maior flexibilidade, um prefixo opcional `{GA}` pode ser usado com o atributo de busca de grupo. Qualquer atributo de grupo com o prefixo {GA} é tratado como um atributo de usuário com nomes de grupo. Por exemplo, com um valor de `{GA}MemberOf`, se o valor do grupo for o DN, o primeiro valor do atributo do DN do grupo é retornado como o nome do grupo.

- `authentication_ldap_sasl_init_pool_size`

  <table summary="Propriedades para autenticação_fido_rp_id"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-fido-rp-id=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.27</td> </tr><tr><th>Desatualizado</th> <td>8.0.35</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_fido_rp_id</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>MySQL</code>]]</td> </tr></tbody></table>1

  Para autenticação SASL LDAP, o tamanho inicial do conjunto de conexões ao servidor LDAP. Escolha o valor para essa variável com base no número médio de solicitações de autenticação concorrentes ao servidor LDAP.

  O plugin usa `authentication_ldap_sasl_init_pool_size` e `authentication_ldap_sasl_max_pool_size` juntos para a gestão do pool de conexões:

  - Quando o plugin de autenticação é inicializado, ele cria `authentication_ldap_sasl_init_pool_size` conexões, a menos que `authentication_ldap_sasl_max_pool_size=0` para desativar o pool.

  - Se o plugin receber um pedido de autenticação quando não houver conexões livres no pool de conexões atual, o plugin pode criar uma nova conexão, até o tamanho máximo do pool de conexões dado por `authentication_ldap_sasl_max_pool_size`.

  - Se o plugin receber uma solicitação quando o tamanho do pool já estiver no máximo e não houver conexões livres, a autenticação falhará.

  - Quando o plugin é descarregado, ele fecha todas as conexões agrupadas.

  Alterações nas configurações das variáveis do sistema de plugins podem não ter efeito em conexões já no pool. Por exemplo, modificar o host, a porta ou as configurações de TLS do servidor LDAP não afeta conexões existentes. No entanto, se os valores originais das variáveis fossem inválidos e o pool de conexões não pudesse ser inicializado, o plugin tentará reinicializar o pool para o próximo pedido LDAP. Nesse caso, os novos valores das variáveis do sistema são usados para a tentativa de reinicialização.

  Se `authentication_ldap_sasl_max_pool_size=0` estiver desativado, cada conexão LDAP aberta pelo plugin usa os valores das variáveis do sistema naquela época.

- `authentication_ldap_sasl_log_status`

  <table summary="Propriedades para autenticação_fido_rp_id"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-fido-rp-id=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.27</td> </tr><tr><th>Desatualizado</th> <td>8.0.35</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_fido_rp_id</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>MySQL</code>]]</td> </tr></tbody></table>2

  Para autenticação SASL LDAP, o nível de registro para mensagens escritas no log de erro. A tabela a seguir mostra os valores permitidos do nível e seus significados.

  **Tabela 8.30 Níveis de log para autenticação\_ldap\_sasl\_log\_status**

  <table summary="Propriedades para autenticação_fido_rp_id"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-fido-rp-id=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.27</td> </tr><tr><th>Desatualizado</th> <td>8.0.35</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_fido_rp_id</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>MySQL</code>]]</td> </tr></tbody></table>3

  O nível de registro 6 está disponível a partir do MySQL 8.0.18.

  Do lado do cliente, as mensagens podem ser registradas na saída padrão definindo a variável de ambiente `AUTHENTICATION_LDAP_CLIENT_LOG`. Os valores permitidos e padrão são os mesmos que para `authentication_ldap_sasl_log_status`.

  A variável de ambiente `AUTHENTICATION_LDAP_CLIENT_LOG` só se aplica à autenticação SASL LDAP. Ela não tem efeito para a autenticação LDAP simples, porque o plugin do cliente nesse caso é `mysql_clear_password`, que não sabe nada sobre operações LDAP.

- `authentication_ldap_sasl_max_pool_size`

  <table summary="Propriedades para autenticação_fido_rp_id"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-fido-rp-id=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.27</td> </tr><tr><th>Desatualizado</th> <td>8.0.35</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_fido_rp_id</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>MySQL</code>]]</td> </tr></tbody></table>4

  Para autenticação SASL LDAP, o tamanho máximo do conjunto de conexões ao servidor LDAP. Para desabilitar o agrupamento de conexões, defina essa variável para 0.

  Essa variável é usada em conjunto com `authentication_ldap_sasl_init_pool_size`. Veja a descrição dessa variável.

- `authentication_ldap_sasl_referral`

  <table summary="Propriedades para autenticação_fido_rp_id"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-fido-rp-id=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.27</td> </tr><tr><th>Desatualizado</th> <td>8.0.35</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_fido_rp_id</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>MySQL</code>]]</td> </tr></tbody></table>5

  Para autenticação SASL LDAP, se deseja habilitar a referência de pesquisa LDAP. Consulte Referência de Pesquisa LDAP.

  Essa variável pode ser definida para substituir a configuração padrão de referência do OpenLDAP; consulte LDAP Pluggable Authentication e ldap.conf

- `authentication_ldap_sasl_server_host`

  <table summary="Propriedades para autenticação_fido_rp_id"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-fido-rp-id=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.27</td> </tr><tr><th>Desatualizado</th> <td>8.0.35</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_fido_rp_id</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>MySQL</code>]]</td> </tr></tbody></table>6

  O host do servidor LDAP para autenticação SASL LDAP; este pode ser um nome de host ou um endereço IP.

- `authentication_ldap_sasl_server_port`

  <table summary="Propriedades para autenticação_fido_rp_id"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-fido-rp-id=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.27</td> </tr><tr><th>Desatualizado</th> <td>8.0.35</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_fido_rp_id</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>MySQL</code>]]</td> </tr></tbody></table>7

  Para autenticação SASL LDAP, o número da porta TCP/IP do servidor LDAP.

  A partir do MySQL 8.0.14, se o número da porta LDAP estiver configurado como 636 ou 3269, o plugin usa LDAPS (LDAP over SSL) em vez de LDAP. (LDAPS difere de `startTLS`.)

- `authentication_ldap_sasl_tls`

  <table summary="Propriedades para autenticação_fido_rp_id"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-fido-rp-id=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.27</td> </tr><tr><th>Desatualizado</th> <td>8.0.35</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_fido_rp_id</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>MySQL</code>]]</td> </tr></tbody></table>8

  Para autenticação SASL LDAP, se as conexões do plugin com o servidor LDAP são seguras. Se essa variável estiver habilitada, o plugin usa TLS para se conectar de forma segura ao servidor LDAP. Essa variável pode ser definida para substituir a configuração padrão de TLS do OpenLDAP; consulte LDAP Pluggable Authentication e ldap.conf. Se você habilitar essa variável, também pode querer definir a variável `authentication_ldap_sasl_ca_path`.

  Os plugins do MySQL LDAP suportam o método StartTLS, que inicia o TLS em cima de uma conexão LDAP simples.

  A partir do MySQL 8.0.14, o LDAPS pode ser usado definindo a variável de sistema `authentication_ldap_sasl_server_port`.

- `authentication_ldap_sasl_user_search_attr`

  <table summary="Propriedades para autenticação_fido_rp_id"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-fido-rp-id=value</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.27</td> </tr><tr><th>Desatualizado</th> <td>8.0.35</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_fido_rp_id</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>MySQL</code>]]</td> </tr></tbody></table>9

  Para a autenticação SASL LDAP, o nome do atributo que especifica os nomes de usuário nas entradas do diretório LDAP. Se o nome do nome distinto de um usuário não for fornecido, o plugin de autenticação procura pelo nome usando este atributo. Por exemplo, se o valor `authentication_ldap_sasl_user_search_attr` for `uid`, uma busca pelo nome do usuário `user1` encontra entradas com um valor `uid` de `user1`.

- `authentication_ldap_simple_auth_method_name`

  <table summary="Propriedades para authentication_kerberos_service_key_tab"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-kerberos-service-key-tab=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.26</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_kerberos_service_key_tab</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>datadir/mysql.keytab</code>]]</td> </tr></tbody></table>0

  Para autenticação simples LDAP, o nome do método de autenticação. A comunicação entre o plugin de autenticação e o servidor LDAP ocorre de acordo com este método de autenticação.

  Nota

  Para todos os métodos de autenticação LDAP simples, recomenda-se também definir os parâmetros TLS para exigir que a comunicação com o servidor LDAP ocorra por meio de conexões seguras.

  Estes valores dos métodos de autenticação são permitidos:

  - `SIMPLE`: Use autenticação LDAP simples. Esse método utiliza uma ou duas operações de vinculação LDAP, dependendo se o nome da conta MySQL identifica o nome distinto de um usuário LDAP. Veja a descrição de `authentication_ldap_simple_bind_root_dn`.

  - `AD-FOREST`: Uma variação de `SIMPLE`, de modo que a autenticação procure todos os domínios na floresta do Active Directory, realizando uma ligação LDAP a cada domínio do Active Directory até que o usuário seja encontrado em algum domínio.

- `authentication_ldap_simple_bind_base_dn`

  <table summary="Propriedades para authentication_kerberos_service_key_tab"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-kerberos-service-key-tab=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.26</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_kerberos_service_key_tab</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>datadir/mysql.keytab</code>]]</td> </tr></tbody></table>1

  Para autenticação simples LDAP, o nome distinto de base (DN). Essa variável pode ser usada para limitar o escopo das pesquisas ancorando-as em um determinado local (a "base") dentro da árvore de pesquisa.

  Suponha que os membros de um conjunto de entradas de usuário do LDAP tenham cada um essa forma:

  ```
  uid=user_name,ou=People,dc=example,dc=com
  ```

  E que os membros de outro conjunto de entradas de usuário do LDAP tenham cada um essa forma:

  ```
  uid=user_name,ou=Admin,dc=example,dc=com
  ```

  Em seguida, as pesquisas funcionam da seguinte forma para diferentes valores de DN de base:

  - Se o DN de base for `ou=People,dc=example,dc=com`: As pesquisas encontram entradas de usuário apenas no primeiro conjunto.

  - Se o DN de base for `ou=Admin,dc=example,dc=com`: As pesquisas encontram entradas de usuário apenas no segundo conjunto.

  - Se o DN de base for `ou=dc=example,dc=com`: As pesquisas encontram entradas de usuário no primeiro ou segundo conjunto.

  Em geral, valores de DN de base mais específicos resultam em pesquisas mais rápidas, pois limitam o escopo da pesquisa mais.

- `authentication_ldap_simple_bind_root_dn`

  <table summary="Propriedades para authentication_kerberos_service_key_tab"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-kerberos-service-key-tab=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.26</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_kerberos_service_key_tab</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>datadir/mysql.keytab</code>]]</td> </tr></tbody></table>2

  Para a autenticação simples LDAP, o nome distinto raiz (DN). Esta variável é usada em conjunto com `authentication_ldap_simple_bind_root_pwd` como as credenciais para autenticar-se no servidor LDAP com o propósito de realizar pesquisas. A autenticação utiliza uma ou duas operações de vinculação LDAP, dependendo se o nome da conta MySQL nomeia um DN de usuário LDAP:

  - Se a conta não nomear um DN do usuário, o `authentication_ldap_simple` realiza uma ligação LDAP inicial usando `authentication_ldap_simple_bind_root_dn` e `authentication_ldap_simple_bind_root_pwd`. (Ambos são preenchidos por padrão, então, se não forem definidos, o servidor LDAP deve permitir conexões anônimas.) O handle de ligação LDAP resultante é usado para buscar o DN do usuário, com base no nome do usuário do cliente. O `authentication_ldap_simple` realiza uma segunda ligação usando o DN do usuário e a senha fornecida pelo cliente.

  - Se a conta nomear um DN do usuário: A primeira operação de vinculação é desnecessária neste caso. `authentication_ldap_simple` realiza uma única vinculação usando o DN do usuário e a senha fornecida pelo cliente. Isso é mais rápido do que se a conta do MySQL não especificar um DN de usuário LDAP.

- `authentication_ldap_simple_bind_root_pwd`

  <table summary="Propriedades para authentication_kerberos_service_key_tab"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-kerberos-service-key-tab=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.26</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_kerberos_service_key_tab</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>datadir/mysql.keytab</code>]]</td> </tr></tbody></table>3

  Para autenticação simples LDAP, a senha para o nome distinto raiz. Esta variável é usada em conjunto com `authentication_ldap_simple_bind_root_dn`. Veja a descrição dessa variável.

- `authentication_ldap_simple_ca_path`

  <table summary="Propriedades para authentication_kerberos_service_key_tab"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-kerberos-service-key-tab=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.26</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_kerberos_service_key_tab</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>datadir/mysql.keytab</code>]]</td> </tr></tbody></table>4

  Para autenticação simples LDAP, o caminho absoluto do arquivo da autoridade de certificação. Especifique este arquivo se desejar que o plugin de autenticação realize a verificação do certificado do servidor LDAP.

  Nota

  Além de definir a variável `authentication_ldap_simple_ca_path` com o nome do arquivo, você deve adicionar os certificados da autoridade de certificação apropriada ao arquivo e habilitar a variável de sistema `authentication_ldap_simple_tls`. Essas variáveis podem ser definidas para substituir a configuração padrão de TLS do OpenLDAP; consulte LDAP Pluggable Authentication e ldap.conf

- `authentication_ldap_simple_group_search_attr`

  <table summary="Propriedades para authentication_kerberos_service_key_tab"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-kerberos-service-key-tab=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.26</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_kerberos_service_key_tab</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>datadir/mysql.keytab</code>]]</td> </tr></tbody></table>5

  Para autenticação simples LDAP, o nome do atributo que especifica os nomes dos grupos nas entradas de diretório LDAP. Se `authentication_ldap_simple_group_search_attr` tiver seu valor padrão de `cn`, as pesquisas retornarão o valor `cn` como o nome do grupo. Por exemplo, se uma entrada LDAP com um valor de `uid` de `user1` tiver um atributo `cn` de `mygroup`, pesquisas para `user1` retornarão `mygroup` como o nome do grupo.

  Se o atributo de busca de grupo for `isMemberOf`, a autenticação LDAP recupera diretamente o valor do atributo de usuário `isMemberOf` e atribui-o como informação de grupo. Se o atributo de busca de grupo não for `isMemberOf`, a autenticação LDAP procura por todos os grupos nos quais o usuário é membro. (Este é o comportamento padrão.) Esse comportamento é baseado na forma como as informações de grupo do LDAP podem ser armazenadas de duas maneiras: 1) Uma entrada de grupo pode ter um atributo nomeado `memberUid` ou `member` com um valor que é um nome de usuário; 2) Uma entrada de usuário pode ter um atributo nomeado `isMemberOf` com valores que são nomes de grupo.

- `authentication_ldap_simple_group_search_filter`

  <table summary="Propriedades para authentication_kerberos_service_key_tab"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-kerberos-service-key-tab=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.26</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_kerberos_service_key_tab</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>datadir/mysql.keytab</code>]]</td> </tr></tbody></table>6

  Para autenticação LDAP simples, o filtro de pesquisa de grupo personalizado.

  O valor do filtro de pesquisa pode conter a notação `{UA}` e `{UD}` para representar o nome do usuário e o DN completo do usuário. Por exemplo, `{UA}` é substituído por um nome de usuário como `"admin"`, enquanto `{UD}` é substituído por um DN completo como `"uid=admin,ou=People,dc=example,dc=com"`. O valor seguinte é o padrão, que suporta tanto o OpenLDAP quanto o Active Directory:

  ```
  (|(&(objectClass=posixGroup)(memberUid={UA}))
    (&(objectClass=group)(member={UD})))
  ```

  Em alguns casos, para o cenário do usuário, `memberOf` é um atributo de usuário simples que não contém informações de grupo. Para maior flexibilidade, um prefixo opcional `{GA}` pode ser usado com o atributo de busca de grupo. Qualquer atributo de grupo com o prefixo {GA} é tratado como um atributo de usuário com nomes de grupo. Por exemplo, com um valor de `{GA}MemberOf`, se o valor do grupo for o DN, o primeiro valor do atributo do DN do grupo é retornado como o nome do grupo.

- `authentication_ldap_simple_init_pool_size`

  <table summary="Propriedades para authentication_kerberos_service_key_tab"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-kerberos-service-key-tab=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.26</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_kerberos_service_key_tab</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>datadir/mysql.keytab</code>]]</td> </tr></tbody></table>7

  Para autenticação simples LDAP, o tamanho inicial do conjunto de conexões ao servidor LDAP. Escolha o valor para essa variável com base no número médio de solicitações de autenticação concorrentes ao servidor LDAP.

  O plugin usa `authentication_ldap_simple_init_pool_size` e `authentication_ldap_simple_max_pool_size` juntos para a gestão do pool de conexões:

  - Quando o plugin de autenticação é inicializado, ele cria `authentication_ldap_simple_init_pool_size` conexões, a menos que `authentication_ldap_simple_max_pool_size=0` para desativar o pool.

  - Se o plugin receber um pedido de autenticação quando não houver conexões livres no pool de conexões atual, o plugin pode criar uma nova conexão, até o tamanho máximo do pool de conexões dado por `authentication_ldap_simple_max_pool_size`.

  - Se o plugin receber uma solicitação quando o tamanho do pool já estiver no máximo e não houver conexões livres, a autenticação falhará.

  - Quando o plugin é descarregado, ele fecha todas as conexões agrupadas.

  Alterações nas configurações das variáveis do sistema de plugins podem não ter efeito em conexões já no pool. Por exemplo, modificar o host, a porta ou as configurações de TLS do servidor LDAP não afeta conexões existentes. No entanto, se os valores originais das variáveis fossem inválidos e o pool de conexões não pudesse ser inicializado, o plugin tentará reinicializar o pool para o próximo pedido LDAP. Nesse caso, os novos valores das variáveis do sistema são usados para a tentativa de reinicialização.

  Se `authentication_ldap_simple_max_pool_size=0` estiver desativado, cada conexão LDAP aberta pelo plugin usa os valores das variáveis do sistema naquela época.

- `authentication_ldap_simple_log_status`

  <table summary="Propriedades para authentication_kerberos_service_key_tab"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-kerberos-service-key-tab=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.26</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_kerberos_service_key_tab</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>datadir/mysql.keytab</code>]]</td> </tr></tbody></table>8

  Para autenticação simples LDAP, o nível de registro para mensagens escritas no log de erro. A tabela a seguir mostra os valores permitidos do nível e seus significados.

  **Tabela 8.31 Níveis de log para autenticação\_ldap\_simple\_log\_status**

  <table summary="Propriedades para authentication_kerberos_service_key_tab"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-kerberos-service-key-tab=file_name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.26</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_kerberos_service_key_tab</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>datadir/mysql.keytab</code>]]</td> </tr></tbody></table>9

  O nível de registro 6 está disponível a partir do MySQL 8.0.18.

- `authentication_ldap_simple_max_pool_size`

  <table summary="Propriedades para autenticação_kerberos_service_principal"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-kerberos-service-principal=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.26</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_kerberos_service_principal</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>mysql/host_name@realm_name</code>]]</td> </tr></tbody></table>0

  Para autenticação simples LDAP, o tamanho máximo do conjunto de conexões ao servidor LDAP. Para desabilitar o agrupamento de conexões, defina essa variável para 0.

  Essa variável é usada em conjunto com `authentication_ldap_simple_init_pool_size`. Veja a descrição dessa variável.

- `authentication_ldap_simple_referral`

  <table summary="Propriedades para autenticação_kerberos_service_principal"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-kerberos-service-principal=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.26</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_kerberos_service_principal</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>mysql/host_name@realm_name</code>]]</td> </tr></tbody></table>1

  Para autenticação simples LDAP, veja se deseja habilitar a referência de pesquisa LDAP. Consulte Referência de Pesquisa LDAP.

- `authentication_ldap_simple_server_host`

  <table summary="Propriedades para autenticação_kerberos_service_principal"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-kerberos-service-principal=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.26</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_kerberos_service_principal</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>mysql/host_name@realm_name</code>]]</td> </tr></tbody></table>2

  Para autenticação simples LDAP, o host do servidor LDAP. Os valores permitidos para essa variável dependem do método de autenticação:

  - Para `authentication_ldap_simple_auth_method_name=SIMPLE`: O host do servidor LDAP pode ser um nome de host ou um endereço IP.

  - Para `authentication_ldap_simple_auth_method_name=AD-FOREST`. O host do servidor LDAP pode ser o nome de domínio do Active Directory. Por exemplo, para um URL de servidor LDAP de `ldap://example.mem.local:389`, o nome de domínio pode ser `mem.local`.

    Uma configuração de floresta do Active Directory pode ter vários domínios (IPs de servidores LDAP), que podem ser descobertos usando o DNS. Em sistemas Unix e similares, pode ser necessário um ajuste adicional para configurar seu servidor DNS com registros SRV que especifiquem os servidores LDAP do domínio do Active Directory. Para obter informações sobre SRV DNS, consulte o RFC 2782.

    Suponha que sua configuração tenha essas propriedades:

    - O servidor de nomes que fornece informações sobre os domínios do Active Directory tem o endereço IP `10.172.166.100`.

    - Os servidores LDAP têm os nomes `ldap1.mem.local` a `ldap3.mem.local` e os endereços IP `10.172.166.101` a `10.172.166.103`.

    Você deseja que os servidores LDAP sejam descobertos usando pesquisas SRV. Por exemplo, na linha de comando, um comando como este deve listar os servidores LDAP:

    ```
    host -t SRV _ldap._tcp.mem.local
    ```

    Realize a configuração do DNS da seguinte forma:

    1. Adicione uma linha a `/etc/resolv.conf` para especificar o servidor de nomes que fornece informações sobre os domínios do Active Directory:

       ```
       nameserver 10.172.166.100
       ```

    2. Configure o arquivo de zona apropriado para o servidor de nomes com registros SRV para os servidores LDAP:

       ```
       _ldap._tcp.mem.local. 86400 IN SRV 0 100 389 ldap1.mem.local.
       _ldap._tcp.mem.local. 86400 IN SRV 0 100 389 ldap2.mem.local.
       _ldap._tcp.mem.local. 86400 IN SRV 0 100 389 ldap3.mem.local.
       ```

    3. Também pode ser necessário especificar o endereço IP dos servidores LDAP em `/etc/hosts` se o host do servidor não puder ser resolvido. Por exemplo, adicione linhas como esta ao arquivo:

       ```
       10.172.166.101 ldap1.mem.local
       10.172.166.102 ldap2.mem.local
       10.172.166.103 ldap3.mem.local
       ```

    Com o DNS configurado conforme descrito, o plugin LDAP do lado do servidor pode descobrir os servidores LDAP e tenta autenticar em todos os domínios até que a autenticação seja bem-sucedida ou não haja mais servidores.

    O Windows não precisa de configurações como as descritas acima. Dado o endereço do servidor LDAP no valor `authentication_ldap_simple_server_host`, a biblioteca LDAP do Windows pesquisa todos os domínios e tenta autenticar.

- `authentication_ldap_simple_server_port`

  <table summary="Propriedades para autenticação_kerberos_service_principal"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-kerberos-service-principal=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.26</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_kerberos_service_principal</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>mysql/host_name@realm_name</code>]]</td> </tr></tbody></table>3

  Para autenticação simples LDAP, o número da porta TCP/IP do servidor LDAP.

  A partir do MySQL 8.0.14, se o número da porta LDAP estiver configurado como 636 ou 3269, o plugin usa LDAPS (LDAP over SSL) em vez de LDAP. (LDAPS difere de `startTLS`.)

- `authentication_ldap_simple_tls`

  <table summary="Propriedades para autenticação_kerberos_service_principal"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-kerberos-service-principal=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.26</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_kerberos_service_principal</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>mysql/host_name@realm_name</code>]]</td> </tr></tbody></table>4

  Para autenticação simples LDAP, se as conexões do plugin com o servidor LDAP são seguras. Se essa variável estiver habilitada, o plugin usa TLS para se conectar de forma segura ao servidor LDAP. Essa variável pode ser definida para substituir a configuração padrão de TLS do OpenLDAP; consulte LDAP Pluggable Authentication e ldap.conf. Se você habilitar essa variável, também pode querer definir a variável `authentication_ldap_simple_ca_path`.

  Os plugins do MySQL LDAP suportam o método StartTLS, que inicia o TLS em cima de uma conexão LDAP simples.

  A partir do MySQL 8.0.14, o LDAPS pode ser usado definindo a variável de sistema `authentication_ldap_simple_server_port`.

- `authentication_ldap_simple_user_search_attr`

  <table summary="Propriedades para autenticação_kerberos_service_principal"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--authentication-kerberos-service-principal=name</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.26</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>authentication_kerberos_service_principal</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>mysql/host_name@realm_name</code>]]</td> </tr></tbody></table>5

  Para autenticação simples LDAP, o nome do atributo que especifica os nomes de usuário nas entradas do diretório LDAP. Se o nome do nome distinto de um usuário não for fornecido, o plugin de autenticação procura pelo nome usando este atributo. Por exemplo, se o valor `authentication_ldap_simple_user_search_attr` for `uid`, uma busca pelo nome do usuário `user1` encontra entradas com um valor `uid` de `user1`.
