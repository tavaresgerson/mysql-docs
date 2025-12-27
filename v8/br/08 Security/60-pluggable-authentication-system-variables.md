#### 8.4.1.13 Variáveis do Sistema de Autenticação Conectable

Essas variáveis não estão disponíveis, a menos que o plugin do lado do servidor apropriado esteja instalado:

* `authentication_ldap_sasl` para variáveis do sistema com nomes na forma `authentication_ldap_sasl_xxx`
* `authentication_ldap_simple` para variáveis do sistema com nomes na forma `authentication_ldap_simple_xxx`

**Tabela 8.28 Resumo das Variáveis do Sistema de Plugin de Autenticação**

<table><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th>Nome</th> <th>Linha de Comando</th> <th>Arquivo de Opções</th> <th>Variável do Sistema</th> <th>Variável de Status</th> <th>Alcance da Variável</th> <th>Dinâmica</th> </tr></thead><tbody><tr><th>authentication_kerberos_service_key_tab</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Não</td> </tr><tr><th>authentication_kerberos_service_principal</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_auth_method_name</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_bind_base_dn</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_bind_root_dn</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_bind_root_pwd</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_ca_path</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_connect_timeout</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_group_search_attr</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_group_search_filter</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_init_pool_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_log_status</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_max_pool_size</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_referral</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_response_timeout</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_server_host</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_server_port</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_tls</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_sasl_user_search_attr</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_simple_auth_method_name</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_simple_bind_base_dn</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_simple_bind_root_dn</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_simple_bind_root_pwd</th> <td>Sim</td> <td>Sim</td> <td>Sim</td> <td></td> <td>Global</td> <td>Sim</td> </tr><tr><th>authentication_ldap_simple_ca_path</th> <td>Sim</td> <td>

* `authentication_kerberos_service_key_tab`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-kerberos-service-key-tab=nome_do_arquivo</code></td> </tr><tr><th>Variável do sistema</th> <td>`authentication_kerberos_service_key_tab`</td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Dica de `SET_VAR` Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>datadir/mysql.keytab</code></td> </tr></tbody></table>

  O nome do arquivo da tabela de chaves do lado do servidor (“keytab”) que contém as chaves de serviço Kerberos para autenticar os ingressos do serviço MySQL recebidos dos clientes. O nome do arquivo deve ser fornecido como um nome de caminho absoluto. Se essa variável não for definida, o valor padrão é `mysql.keytab` no diretório de dados.

  O arquivo deve existir e conter uma chave válida para o nome do principal de serviço (SPN) ou a autenticação dos clientes falhará. (O SPN e a mesma chave também devem ser criados no servidor Kerberos.) O arquivo pode conter vários nomes de principais de serviço e suas respectivas combinações de chaves.

  O arquivo deve ser gerado pelo administrador do servidor Kerberos e copiado para um local acessível pelo servidor MySQL. O arquivo pode ser validado para garantir que esteja correto e tenha sido copiado corretamente usando este comando:

  ```
  klist -k file_name
  ```

  Para obter informações sobre arquivos keytab, consulte <https://web.mit.edu/kerberos/krb5-latest/doc/basic/keytab_def.html>.
*  `authentication_kerberos_service_principal`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-kerberos-service-principal=nome</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_kerberos_service_principal</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>mysql/nome_do_host@nome_do_reino</code></td> </tr></tbody></table>

  O nome do principal de serviço Kerberos (SPN) que o servidor MySQL envia aos clientes.

  O valor é composto pelo nome do serviço (`mysql`), um nome de host e um nome de reino. O valor padrão é `mysql/nome_do_host@nome_do_reino`. O reino no nome do principal de serviço permite recuperar a chave de serviço exata.

  Para usar um valor não padrão, defina o valor usando o mesmo formato. Por exemplo, para usar um nome de host de `krbauth.example.com` e um reino de `MYSQL.LOCAL`, defina `authentication_kerberos_service_principal` para `mysql/krbauth.example.com@MYSQL.LOCAL`.

  O nome do principal de serviço e a chave de serviço devem estar presentes no banco de dados gerenciado pelo servidor KDC.

  Pode haver nomes de principais de serviço que diferem apenas pelo nome do reino.
*  `authentication_ldap_sasl_auth_method_name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-sasl-auth-method-name=valor</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>SCRAM-SHA-1</code></td> </tr><tr><th>Valores Válidos</th> <td><p class="valid-value"><code>SCRAM-SHA-1</code></p><p class="valid-value"><code>SCRAM-SHA-256</code></p><p class="valid-value"><code>GSSAPI</code></p></td> </tr></tbody></table>

Para a autenticação SASL LDAP, o nome do método de autenticação. A comunicação entre o plugin de autenticação e o servidor LDAP ocorre de acordo com este método de autenticação para garantir a segurança da senha.

Estes valores do método de autenticação são permitidos:

+ `SCRAM-SHA-1`: Use um mecanismo de desafio-resposta SASL.

O plugin `authentication_ldap_sasl_client` do lado do cliente comunica-se com o servidor SASL, usando a senha para criar um desafio e obter um buffer de solicitação SASL, e depois passa esse buffer para o plugin `authentication_ldap_sasl` do lado do servidor. Os plugins SASL LDAP do lado do cliente e do lado do servidor usam mensagens SASL para a transmissão segura de credenciais dentro do protocolo LDAP, para evitar o envio da senha em texto claro entre o cliente e o servidor MySQL.
+ `SCRAM-SHA-256`: Use um mecanismo de desafio-resposta SASL.

Este método é semelhante ao `SCRAM-SHA-1`, mas é mais seguro. Ele requer um servidor OpenLDAP construído usando o Cyrus SASL 2.1.27 ou superior.
+ `GSSAPI`: Use Kerberos, um protocolo sem senha e baseado em ingressos.

O GSSAPI/Kerberos é suportado como um método de autenticação para clientes e servidores MySQL apenas no Linux. É útil em ambientes Linux onde as aplicações acessam o LDAP usando o Microsoft Active Directory, que tem Kerberos habilitado por padrão.

O plugin `authentication_ldap_sasl_client` do lado do cliente obtém um ingresso de serviço usando o ingresso de concessão de ingresso (TGT) do Kerberos, mas não usa diretamente os serviços LDAP. O plugin `authentication_ldap_sasl` do lado do servidor encaminha mensagens Kerberos entre o plugin do lado do cliente e o servidor LDAP. Usando as credenciais assim obtidas, o plugin do lado do servidor então comunica-se com o servidor LDAP para interpretar mensagens de autenticação LDAP e recuperar grupos LDAP.
* `authentication_ldap_sasl_bind_base_dn`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-sasl-bind-base-dn=valor</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Para a autenticação LDAP SASL, o nome distinto da base (DN). Esta variável pode ser usada para limitar o alcance das pesquisas ancorando-as em um determinado local (a “base”) dentro da árvore de pesquisa.

  Suponha que os membros de um conjunto de entradas de usuário LDAP tenham cada uma a seguinte forma:

  ```
  uid=user_name,ou=People,dc=example,dc=com
  ```

  E que os membros de outro conjunto de entradas de usuário LDAP tenham cada uma a seguinte forma:

  ```
  uid=user_name,ou=Admin,dc=example,dc=com
  ```

  Então, as pesquisas funcionam da seguinte forma com diferentes valores de DN da base:

  + Se o DN da base for `ou=People,dc=example,dc=com`: As pesquisas encontram entradas de usuário apenas no primeiro conjunto.
  + Se o DN da base for `ou=Admin,dc=example,dc=com`: As pesquisas encontram entradas de usuário apenas no segundo conjunto.
  + Se o DN da base for `ou=dc=example,dc=com`: As pesquisas encontram entradas de usuário no primeiro ou segundo conjunto.

  Em geral, valores de DN da base mais específicos resultam em pesquisas mais rápidas porque limitam mais o escopo da pesquisa.
*  `authentication_ldap_sasl_bind_root_dn`

Para a autenticação SASL LDAP, o nome distinto raiz (DN). Esta variável é usada em conjunto com `authentication_ldap_sasl_bind_root_pwd` como as credenciais para autenticar-se no servidor LDAP com o propósito de realizar pesquisas. A autenticação usa uma ou duas operações de vinculação LDAP, dependendo se a conta do MySQL nomeia um DN de usuário LDAP:

  + Se a conta não nomear um DN de usuário: `authentication_ldap_sasl` realiza uma vinculação LDAP inicial usando `authentication_ldap_sasl_bind_root_dn` e `authentication_ldap_sasl_bind_root_pwd`. (Ambas são vazias por padrão, então se não forem definidas, o servidor LDAP deve permitir conexões anônimas.) O handle de vinculação LDAP resultante é usado para pesquisar o DN de usuário, com base no nome do usuário do cliente. `authentication_ldap_sasl` realiza uma segunda vinculação usando o DN de usuário e a senha fornecida pelo cliente.
  + Se a conta nomear um DN de usuário: A primeira operação de vinculação é desnecessária neste caso. `authentication_ldap_sasl` realiza uma única vinculação usando o DN de usuário e a senha fornecida pelo cliente. Isso é mais rápido do que se a conta do MySQL não especificar um DN de usuário LDAP.
*  `authentication_ldap_sasl_bind_root_pwd`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-ldap-sasl-bind-root-pwd=value</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_ldap_sasl_bind_root_pwd</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Para a autenticação SASL LDAP, a senha para o nome distinto raiz. Esta variável é usada em conjunto com `authentication_ldap_sasl_bind_root_dn`. Veja a descrição daquela variável.
*  `authentication_ldap_sasl_ca_path`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-sasl-ca-path=valor</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_ldap_sasl_ca_path</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Para a autenticação LDAP SASL, o caminho absoluto do arquivo da autoridade de certificação. Especifique este arquivo se desejar que o plugin de autenticação LDAP realize a verificação do certificado do servidor LDAP.

  ::: info Nota

  Além de definir a variável `authentication_ldap_sasl_ca_path` com o nome do arquivo, você deve adicionar os certificados apropriados da autoridade de certificação ao arquivo e habilitar a variável de sistema `authentication_ldap_sasl_tls`. Essas variáveis podem ser definidas para substituir a configuração padrão de TLS do OpenLDAP; consulte LDAP Pluggable Authentication e ldap.conf

  :::

* `authentication_ldap_sasl_connect_timeout`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-sasl-connect-timeout=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_ldap_sasl_connect_timeout</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>30</code></td> </tr><tr><th>Valor Mínima</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>31536000</code></td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

  Especifica o tempo (em segundos) que o servidor MySQL espera para se conectar ao servidor LDAP usando TCP.

Quando uma conta do MySQL autentica-se usando LDAP, o servidor MySQL tenta estabelecer uma conexão TCP com o servidor LDAP, que ele usa para enviar uma solicitação de vinculação LDAP sobre a conexão. Se o servidor LDAP não responder ao aperto de mão TCP após um período de tempo configurado, o MySQL abandona a tentativa de aperto de mão TCP e emite uma mensagem de erro. Se o ajuste de tempo limite for zero, o servidor MySQL ignora essa configuração da variável do sistema. Para mais informações, consulte Configurando Tempo Limite para Autenticação Conectada (LDAP).

  ::: info Nota

  Se você definir essa variável para um valor de tempo limite maior que o valor padrão do sistema do host, o tempo limite do sistema mais curto será usado.

  :::

*  `authentication_ldap_sasl_group_search_attr`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-sasl-group-search-attr=value</code></td> </tr><tr><th>Variável do Sistema</th> <td>`authentication_ldap_sasl_group_search_attr`</td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>cn</code></td> </tr></tbody></table>

  Para a autenticação LDAP SASL, o nome do atributo que especifica os nomes de grupos nas entradas de diretório do LDAP. Se `authentication_ldap_sasl_group_search_attr` tiver seu valor padrão de `cn`, as pesquisas retornam o valor `cn` como o nome do grupo. Por exemplo, se uma entrada LDAP com um valor de `uid` de `user1` tem um atributo `cn` de `mygroup`, pesquisas para `user1` retornam `mygroup` como o nome do grupo.

  Esta variável deve ser a string vazia se você não quiser autenticação de grupo ou proxy.

Se o atributo de busca de grupo for `isMemberOf`, a autenticação LDAP recupera diretamente o valor do atributo de usuário `isMemberOf` e atribui-o como informação de grupo. Se o atributo de busca de grupo não for `isMemberOf`, a autenticação LDAP procura por todos os grupos nos quais o usuário é membro. (Este último é o comportamento padrão.) Esse comportamento é baseado na forma como as informações de grupo do LDAP podem ser armazenadas de duas maneiras: 1) Uma entrada de grupo pode ter um atributo chamado `memberUid` ou `member` com um valor que é um nome de usuário; 2) Uma entrada de usuário pode ter um atributo chamado `isMemberOf` com valores que são nomes de grupos.
*  `authentication_ldap_sasl_group_search_filter`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-ldap-sasl-group-search-filter=value</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_ldap_sasl_group_search_filter</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>(|(&amp;(objectClass=posixGroup)(memberUid=%s))(&amp;(objectClass=group)(member=%s)))</code></td> </tr></tbody></table>

  Para a autenticação LDAP SASL, o filtro de busca de grupo personalizado.

  O valor do filtro de busca pode conter a notação `{UA}` e `{UD}` para representar o nome do usuário e o DN completo do usuário. Por exemplo, `{UA}` é substituído por um nome de usuário, como `"admin"`, enquanto `{UD}` é substituído por um DN completo, como `"uid=admin,ou=People,dc=example,dc=com"`. O seguinte valor é o padrão, que suporta tanto o OpenLDAP quanto o Active Directory:

  ```
  (|(&(objectClass=posixGroup)(memberUid={UA}))
    (&(objectClass=group)(member={UD})))
  ```

Em alguns casos, para o cenário do usuário, `memberOf` é um atributo de usuário simples que não contém informações de grupo. Para maior flexibilidade, um prefixo opcional `{GA}` pode ser usado com o atributo de busca de grupo. Qualquer atributo de grupo com o prefixo {GA} é tratado como um atributo de usuário com nomes de grupo. Por exemplo, com um valor de `{GA}MemberOf`, se o valor do grupo for o DN, o primeiro valor do atributo do DN do grupo é retornado como o nome do grupo.
*  `authentication_ldap_sasl_init_pool_size`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-ldap-sasl-init-pool-size=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_ldap_sasl_init_pool_size</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hint de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>10</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>32767</code></td> </tr><tr><th>Unidade</th> <td>conexões</td> </tbody></table>

  Para a autenticação LDAP SASL, o tamanho inicial do pool de conexões ao servidor LDAP. Escolha o valor para essa variável com base no número médio de solicitações de autenticação concorrentes ao servidor LDAP.

  O plugin usa `authentication_ldap_sasl_init_pool_size` e `authentication_ldap_sasl_max_pool_size` juntos para a gestão do pool de conexões:

+ Quando o plugin de autenticação é inicializado, ele cria conexões `authentication_ldap_sasl_init_pool_size`, a menos que `authentication_ldap_sasl_max_pool_size=0` para desativar o pool.
+ Se o plugin receber um pedido de autenticação quando não houver conexões livres no pool de conexões atual, o plugin pode criar uma nova conexão, até o tamanho máximo do pool de conexões dado por `authentication_ldap_sasl_max_pool_size`.
+ Se o plugin receber um pedido quando o tamanho do pool já estiver no máximo e não houver conexões livres, a autenticação falha.
+ Quando o plugin é descarregado, ele fecha todas as conexões em pool.
+ Alterações nas configurações das variáveis do sistema do plugin podem não ter efeito nas conexões já no pool. Por exemplo, modificar o host, a porta ou as configurações de TLS do servidor LDAP não afeta as conexões existentes. No entanto, se os valores originais das variáveis fossem inválidos e o pool não pudesse ser inicializado, o plugin tenta reinicializar o pool para o próximo pedido LDAP. Nesse caso, os novos valores das variáveis do sistema são usados para a tentativa de reinicialização.
+ Se `authentication_ldap_sasl_max_pool_size=0` para desativar o pool, cada conexão LDAP aberta pelo plugin usa os valores que as variáveis do sistema têm naquele momento.
*  `authentication_ldap_sasl_log_status`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-sasl-log-status=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_ldap_sasl_log_status</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>6</code></td> </tr></tbody></table>

Para a autenticação SASL LDAP, o nível de registro para as mensagens escritas no log de erro. A tabela a seguir mostra os valores permitidos do nível e seus significados.

**Tabela 8.29 Níveis de registro para autenticação\_ldap\_sasl\_log\_status**

<table><thead><tr> <th>Opção</th> <th>Tipos de mensagens registradas</th> </tr></thead><tbody><tr> <td><code>1</code></td> <td>Sem mensagens</td> </tr><tr> <td><code>2</code></td> <td>Mensagens de erro</td> </tr><tr> <td><code>3</code></td> <td>Mensagens de erro e aviso</td> </tr><tr> <td><code>4</code></td> <td>Mensagens de erro, aviso e informações</td> </tr><tr> <td><code>5</code></td> <td>O mesmo que o nível anterior, mais mensagens de depuração do MySQL</td> </tr><tr> <td><code>6</code></td> <td>O mesmo que o nível anterior, mais mensagens de depuração da biblioteca LDAP</td> </tr></tbody></table>

No lado do cliente, as mensagens podem ser registradas na saída padrão definindo a variável de ambiente `AUTHENTICATION_LDAP_CLIENT_LOG`. Os valores permitidos e padrão são os mesmos que para `authentication_ldap_sasl_log_status`.

A variável de ambiente `AUTHENTICATION_LDAP_CLIENT_LOG` aplica-se apenas à autenticação SASL LDAP. Não tem efeito para a autenticação LDAP simples, porque o plugin do cliente nesse caso é `mysql_clear_password`, que não sabe nada sobre operações LDAP.
*  `authentication_ldap_sasl_max_pool_size`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-ldap-sasl-max-pool-size=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_ldap_sasl_max_pool_size</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>1000</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>32767</code></td> </tr><tr><th>Unidade</th> <td>conexões</td> </tr></tbody></table>

Para a autenticação SASL LDAP, o tamanho máximo do pool de conexões ao servidor LDAP. Para desabilitar o pool de conexões, defina essa variável para 0.

Esta variável é usada em conjunto com `authentication_ldap_sasl_init_pool_size`. Veja a descrição dessa variável.
*  `authentication_ldap_sasl_referral`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-ldap-sasl-referral[={OFF|ON}]</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_ldap_sasl_referral</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Para a autenticação SASL LDAP, se habilitar a referência de busca LDAP. Veja Referência de Busca LDAP.

  Essa variável pode ser definida para substituir a configuração padrão de referência OpenLDAP; veja LDAP Pluggable Authentication e ldap.conf
*  `authentication_ldap_sasl_response_timeout`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-ldap-sasl-response-timeout=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code>authentication_ldap_sasl_response_timeout</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>30</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>31536000</code></td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

  Especifica o tempo (em segundos) que o servidor MySQL espera que o servidor LDAP responda a uma solicitação de vinculação LDAP.

Quando uma conta do MySQL autentica-se usando LDAP, o servidor MySQL envia uma solicitação de vinculação LDAP ao servidor LDAP. Se o servidor LDAP não responder à solicitação após um período de tempo configurado, o MySQL abandona a solicitação e emite uma mensagem de erro. Se o ajuste de tempo limite for zero, o servidor MySQL ignora essa configuração da variável do sistema. Para mais informações, consulte Configurando Limites de Tempo para Autenticação Conectada (LDAP).
*  `authentication_ldap_sasl_server_host`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-sasl-server-host=host_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_ldap_sasl_server_host</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O host do servidor LDAP para autenticação LDAP SASL; isso pode ser um nome de host ou endereço IP.
*  `authentication_ldap_sasl_server_port`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-sasl-server-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_ldap_sasl_server_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>389</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>32376</code></td> </tr></tbody></table>

  Para autenticação LDAP SASL, o número de porta TCP/IP do servidor LDAP.

  Se o número de porta do LDAP for configurado como 636 ou 3269, o plugin usa LDAPS (LDAP over SSL) em vez de LDAP. (LDAPS difere de `startTLS`.)
*  `authentication_ldap_sasl_tls`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-sasl-tls[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_ldap_sasl_tls</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Para a autenticação LDAP SASL, se as conexões do plugin com o servidor LDAP são seguras. Se esta variável for habilitada, o plugin usa TLS para se conectar de forma segura ao servidor LDAP. Esta variável pode ser definida para substituir a configuração padrão de TLS do OpenLDAP; consulte LDAP Pluggable Authentication e ldap.conf. Se você habilitar esta variável, também pode querer definir a variável `authentication_ldap_sasl_ca_path`.

  Os plugins LDAP do MySQL suportam o método StartTLS, que inicia o TLS em cima de uma conexão LDAP simples.

  LDAPS pode ser usado definindo a variável de sistema `authentication_ldap_sasl_server_port`.
*  `authentication_ldap_sasl_user_search_attr`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-sasl-user-search-attr=value</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_ldap_sasl_user_search_attr</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>uid</code></td> </tr></tbody></table>

Para autenticação SASL LDAP, o nome do atributo que especifica os nomes de usuário nas entradas de diretório LDAP. Se o nome de distinção do usuário não for fornecido, o plugin de autenticação procura pelo nome usando este atributo. Por exemplo, se o valor de `authentication_ldap_sasl_user_search_attr` for `uid`, uma busca pelo nome do usuário `user1` encontra entradas com um valor de `uid` de `user1`.
*  `authentication_ldap_simple_auth_method_name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-simple-auth-method-name=value</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_ldap_simple_auth_method_name</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Dica de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>SIMPLE</code></td> </tr><tr><th>Valores Válidos</th> <td><p class="valid-value"><code>SIMPLE</code></p><p class="valid-value"><code>AD-FOREST</code></p></td> </tr></tbody></table>

  Para autenticação LDAP simples, o nome do método de autenticação. A comunicação entre o plugin de autenticação e o servidor LDAP ocorre de acordo com este método de autenticação.

  ::: info Nota

  Para todos os métodos de autenticação LDAP simples, recomenda-se também definir os parâmetros TLS para exigir que a comunicação com o servidor LDAP ocorra por conexões seguras.

  :::

+ `SIMPLE`: Use autenticação LDAP simples. Esse método usa uma ou duas operações de vinculação LDAP, dependendo se a conta MySQL nomeia o nome distinto de usuário LDAP. Veja a descrição de `authentication_ldap_simple_bind_root_dn`.
  + `AD-FOREST`: Uma variação de `SIMPLE`, de modo que a autenticação busca todos os domínios na floresta do Active Directory, realizando uma vinculação LDAP a cada domínio do Active Directory até que o usuário seja encontrado em algum domínio.
*  `authentication_ldap_simple_bind_base_dn`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-simple-bind-base-dn=value</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_ldap_simple_bind_base_dn</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Para autenticação LDAP simples, o nome distinto de base (DN). Essa variável pode ser usada para limitar o escopo das buscas ancorando-as em um determinado local (a “base”) dentro da árvore de busca.

  Suponha que os membros de um conjunto de entradas de usuário LDAP tenham a seguinte forma:

  ```
  uid=user_name,ou=People,dc=example,dc=com
  ```

  E que os membros de outro conjunto de entradas de usuário LDAP tenham a seguinte forma:

  ```
  uid=user_name,ou=Admin,dc=example,dc=com
  ```

  Então, as buscas funcionam da seguinte maneira com diferentes valores de DN de base:

  + Se o DN de base for `ou=People,dc=example,dc=com`: As buscas encontram entradas de usuário apenas no primeiro conjunto.
  + Se o DN de base for `ou=Admin,dc=example,dc=com`: As buscas encontram entradas de usuário apenas no segundo conjunto.
  + Se o DN de base for `ou=dc=example,dc=com`: As buscas encontram entradas de usuário no primeiro ou segundo conjunto.

  Em geral, valores de DN de base mais específicos resultam em buscas mais rápidas porque limitam mais o escopo da busca.
*  `authentication_ldap_simple_bind_root_dn`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-simple-bind-root-dn=valor</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_ldap_simple_bind_root_dn</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Dica de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Para a autenticação simples LDAP, o nome distinto raiz (DN). Esta variável é usada em conjunto com `authentication_ldap_simple_bind_root_pwd` como as credenciais para autenticar-se no servidor LDAP com o propósito de realizar pesquisas. A autenticação usa uma ou duas operações de vinculação LDAP, dependendo se o nome da conta MySQL nomeia um DN de usuário LDAP:

  + Se a conta não nomeia um DN de usuário: `authentication_ldap_simple` realiza uma vinculação LDAP inicial usando `authentication_ldap_simple_bind_root_dn` e `authentication_ldap_simple_bind_root_pwd`. (Ambos são preenchidos por padrão, então se não forem definidos, o servidor LDAP deve permitir conexões anônimas.) O handle de vinculação LDAP resultante é usado para pesquisar o DN de usuário, com base no nome do usuário do cliente. `authentication_ldap_simple` realiza uma segunda vinculação usando o DN do usuário e a senha fornecida pelo cliente.
  + Se a conta nomeia um DN de usuário: A primeira operação de vinculação é desnecessária neste caso. `authentication_ldap_simple` realiza uma única vinculação usando o DN do usuário e a senha fornecida pelo cliente. Isso é mais rápido do que se a conta MySQL não especificar um DN de usuário LDAP.
*  `authentication_ldap_simple_bind_root_pwd`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-simple-bind-root-pwd=valor</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_ldap_simple_bind_root_pwd</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Para autenticação simples LDAP, a senha para o nome distinto raiz. Esta variável é usada em conjunto com `authentication_ldap_simple_bind_root_dn`. Consulte a descrição daquela variável.
*  `authentication_ldap_simple_ca_path`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-simple-ca-path=valor</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_ldap_simple_ca_path</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Para autenticação simples LDAP, o caminho absoluto do arquivo da autoridade de certificação. Especifique este arquivo se for desejado que o plugin de autenticação LDAP realize a verificação do certificado do servidor LDAP.

  ::: info Nota

  Além de definir a variável `authentication_ldap_simple_ca_path` com o nome do arquivo, você deve adicionar os certificados apropriados da autoridade de certificação ao arquivo e habilitar a variável de sistema `authentication_ldap_simple_tls`. Essas variáveis podem ser definidas para substituir a configuração padrão de TLS do OpenLDAP; consulte LDAP Pluggable Authentication e ldap.conf

  :::

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-simple-connect-timeout=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_ldap_simple_connect_timeout</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>30</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>31536000</code></td> </tr><tr><th>Unidade</th> <td>segundos</td> </tr></tbody></table>

  Especifica o tempo (em segundos) que o servidor MySQL espera para se conectar ao servidor LDAP usando TCP.

  Quando uma conta MySQL autentica-se usando LDAP, o servidor MySQL tenta estabelecer uma conexão TCP com o servidor LDAP, que ele usa para enviar uma solicitação de vinculação LDAP sobre a conexão. Se o servidor LDAP não responder ao aperto de mão TCP após um período de tempo configurado, o MySQL abandona a tentativa de aperto de mão TCP e emite uma mensagem de erro. Se o ajuste de tempo de espera for zero, o servidor MySQL ignora essa configuração da variável do sistema. Para mais informações, consulte Configurando Temporizadores para LDAP Pluggable Authentication.

  ::: info Nota

  Se você definir essa variável para um valor de tempo de espera maior que o valor padrão do sistema do host, o tempo de espera do sistema mais curto é usado.

  :::

Para autenticação simples LDAP, o nome do atributo que especifica os nomes dos grupos nas entradas de diretório LDAP. Se `authentication_ldap_simple_group_search_attr` tiver seu valor padrão de `cn`, as pesquisas retornam o valor `cn` como o nome do grupo. Por exemplo, se uma entrada LDAP com um valor de `uid` de `user1` tiver um atributo `cn` de `mygroup`, pesquisas por `user1` retornam `mygroup` como o nome do grupo.

Se o atributo de pesquisa de grupo for `isMemberOf`, a autenticação LDAP recupera diretamente o valor do atributo de usuário `isMemberOf` e atribui-o como informação de grupo. Se o atributo de pesquisa de grupo não for `isMemberOf`, a autenticação LDAP pesquisa por todos os grupos onde o usuário é membro. (Este é o comportamento padrão.) Esse comportamento é baseado em como as informações de grupo LDAP podem ser armazenadas de duas maneiras: 1) Uma entrada de grupo pode ter um atributo nomeado `memberUid` ou `member` com um valor que é um nome de usuário; 2) Uma entrada de usuário pode ter um atributo nomeado `isMemberOf` com valores que são nomes de grupo.
* `authentication_ldap_simple_group_search_filter`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-simple-group-search-filter=value</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_ldap_simple_group_search_filter</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>(|(&amp;(objectClass=posixGroup)(memberUid=%s))(&amp;(objectClass=group)(member=%s)))</code></td> </tr></tbody></table>

Para autenticação simples LDAP, o filtro de pesquisa de grupo personalizado.

O valor do filtro de busca pode conter a notação `{UA}` e `{UD}` para representar o nome do usuário e o DN completo do usuário. Por exemplo, `{UA}` é substituído por um nome de usuário, como `"admin"`, enquanto `{UD}` é substituído por um DN completo, como `"uid=admin,ou=People,dc=example,dc=com"`. O valor padrão é o seguinte, que suporta tanto o OpenLDAP quanto o Active Directory:

```
  (|(&(objectClass=posixGroup)(memberUid={UA}))
    (&(objectClass=group)(member={UD})))
  ```

Em alguns casos, para o cenário de usuário, `memberOf` é um atributo de usuário simples que não contém informações de grupo. Para maior flexibilidade, um prefixo opcional `{GA}` pode ser usado com o atributo de busca de grupo. Qualquer atributo de grupo com o prefixo {GA} é tratado como um atributo de usuário com nomes de grupo. Por exemplo, com um valor de `{GA}MemberOf`, se o valor do grupo for o DN, o primeiro valor do atributo do DN do grupo é retornado como o nome do grupo.
*  `authentication_ldap_simple_init_pool_size`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-simple-init-pool-size=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_ldap_simple_init_pool_size</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hint de <code>SET_VAR</code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>10</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>32767</code></td> </tr><tr><th>Unidade</th> <td>conexões</td> </tr></tbody></table>

Para autenticação LDAP simples, o tamanho inicial do pool de conexões ao servidor LDAP. Escolha o valor para essa variável com base no número médio de solicitações de autenticação concorrentes ao servidor LDAP.

O plugin usa `authentication_ldap_simple_init_pool_size` e `authentication_ldap_simple_max_pool_size` juntos para gerenciar o pool de conexões:

+ Quando o plugin de autenticação é inicializado, ele cria `authentication_ldap_simple_init_pool_size` conexões, a menos que `authentication_ldap_simple_max_pool_size=0` para desativar o pool.
+ Se o plugin receber uma solicitação de autenticação quando não houver conexões livres no pool de conexões atual, o plugin pode criar uma nova conexão, até o tamanho máximo do pool de conexões dado por `authentication_ldap_simple_max_pool_size`.
+ Se o plugin receber uma solicitação quando o tamanho do pool já estiver no máximo e não houver conexões livres, a autenticação falha.
+ Quando o plugin é descarregado, ele fecha todas as conexões em pool.

As alterações nas configurações das variáveis do sistema do plugin podem não ter efeito nas conexões já no pool. Por exemplo, modificar o host, a porta ou as configurações de TLS do servidor LDAP não afeta as conexões existentes. No entanto, se os valores originais das variáveis fossem inválidos e o pool não pudesse ser inicializado, o plugin tentará reinicializar o pool para a próxima solicitação LDAP. Neste caso, os novos valores das variáveis do sistema são usados para a tentativa de reinicialização.

Se `authentication_ldap_simple_max_pool_size=0` para desativar o pool, cada conexão LDAP aberta pelo plugin usa os valores que as variáveis do sistema têm naquele momento.
*  `authentication_ldap_simple_log_status`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-simple-log-status=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_ldap_simple_log_status</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>6</code></td> </tr></tbody></table>

Para autenticação simples LDAP, o nível de registro para as mensagens escritas no log de erro. A tabela a seguir mostra os valores permitidos para o nível e seus significados.

**Tabela 8.30 Níveis de registro para autenticação\_ldap\_simple\_log\_status**

<table><thead><tr> <th>Opção</th> <th>Tipos de mensagens registradas</th> </tr></thead><tbody><tr> <td><code>1</code></td> <td>Sem mensagens</td> </tr><tr> <td><code>2</code></td> <td>Mensagens de erro</td> </tr><tr> <td><code>3</code></td> <td>Mensagens de erro e aviso</td> </tr><tr> <td><code>4</code></td> <td>Mensagens de erro, aviso e informações</td> </tr><tr> <td><code>5</code></td> <td>O mesmo que o nível anterior, mais mensagens de depuração do MySQL</td> </tr><tr> <td><code>6</code></td> <td>O mesmo que o nível anterior, mais mensagens de depuração da biblioteca LDAP</td> </tr></tbody></table>
*  `authentication_ldap_simple_max_pool_size`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-ldap-simple-max-pool-size=#</code></td> </tr><tr><th>Variável do sistema</th> <td>`authentication_ldap_simple_max_pool_size`</td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Dica `SET_VAR` Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>1000</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor máximo</th> <td><code>32767</code></td> </tr><tr><th>Unidade</th> <td>conexões</td> </tr></tbody></table>

Para autenticação simples LDAP, o tamanho máximo do pool de conexões ao servidor LDAP. Para desabilitar o pool de conexões, defina essa variável para 0.

Esta variável é usada em conjunto com `authentication_ldap_simple_init_pool_size`. Veja a descrição dessa variável.
*  `authentication_ldap_simple_referral`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-simple-referral[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_ldap_simple_referral</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Para autenticação simples LDAP, se habilitar a referência de busca LDAP. Consulte Referência de Busca LDAP.
*  `authentication_ldap_simple_response_timeout`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-simple-response-timeout=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_ldap_simple_response_timeout</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>30</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>31536000</code></td> </tr><tr><th>Unidade</th> <td>segundos</td> </tbody></table>

  Especifica o tempo (em segundos) que o servidor MySQL espera que o servidor LDAP responda a uma solicitação de vinculação LDAP.

  Quando uma conta MySQL autentica-se usando LDAP, o servidor MySQL envia uma solicitação de vinculação LDAP para o servidor LDAP. Se o servidor LDAP não responder à solicitação após um tempo configurado, o MySQL abandona a solicitação e emite uma mensagem de erro. Se o ajuste de tempo de espera for zero, o servidor MySQL ignora essa configuração da variável do sistema. Para mais informações, consulte Configurando Temporizadores para LDAP Pluggable Authentication.
*  `authentication_ldap_simple_server_host`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-simple-server-host=host_name</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_ldap_simple_server_host</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de `SET_VAR`</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tbody></table>

  Para a autenticação LDAP simples, o host do servidor LDAP. Os valores permitidos para esta variável dependem do método de autenticação:

  + Para `authentication_ldap_simple_auth_method_name=SIMPLE`: O host do servidor LDAP pode ser um nome de host ou endereço IP.
  + Para `authentication_ldap_simple_auth_method_name=AD-FOREST`. O host do servidor LDAP pode ser o nome de domínio do Active Directory. Por exemplo, para um URL de servidor LDAP de `ldap://example.mem.local:389`, o nome de domínio pode ser `mem.local`.

    Uma configuração de floresta do Active Directory pode ter múltiplos domínios (IPs de servidores LDAP), que podem ser descobertos usando o DNS. Em sistemas Unix e Unix-like, pode ser necessário configurar adicionalmente o seu servidor DNS com registros SRV que especifiquem os servidores LDAP para o domínio do Active Directory. Para informações sobre SRV DNS, consulte [RFC 2782](https://tools.ietf.org/html/rfc2782).

    Suponha que sua configuração tenha estas propriedades:

    - O servidor de nomes que fornece informações sobre domínios do Active Directory tem o endereço IP `10.172.166.100`.
    - Os servidores LDAP têm os nomes `ldap1.mem.local` a `ldap3.mem.local` e endereços IP `10.172.166.101` a `10.172.166.103`.

    Você deseja que os servidores LDAP sejam descobertos usando pesquisas SRV. Por exemplo, na linha de comando, um comando como este deve listar os servidores LDAP:

    ```
    host -t SRV _ldap._tcp.mem.local
    ```

    Realize a configuração DNS da seguinte forma:

    1. Adicione uma linha no `/etc/resolv.conf` para especificar o servidor de nomes que fornece informações sobre domínios do Active Directory:

2. Configure o arquivo de zona apropriado para o servidor de nomes com registros SRV para os servidores LDAP:

```
       nameserver 10.172.166.100
       ```
3. Também pode ser necessário especificar o endereço IP dos servidores LDAP em `/etc/hosts` se o host do servidor não puder ser resolvido. Por exemplo, adicione linhas como esta ao arquivo:

```
       _ldap._tcp.mem.local. 86400 IN SRV 0 100 389 ldap1.mem.local.
       _ldap._tcp.mem.local. 86400 IN SRV 0 100 389 ldap2.mem.local.
       _ldap._tcp.mem.local. 86400 IN SRV 0 100 389 ldap3.mem.local.
       ```
Com o DNS configurado como descrito, o plugin LDAP do lado do servidor pode descobrir os servidores LDAP e tenta autenticar em todos os domínios até que a autenticação seja bem-sucedida ou não haja mais servidores.

O Windows não precisa de configurações como as descritas. Dado o host do servidor LDAP na variável `authentication_ldap_simple_server_host`, a biblioteca LDAP do Windows busca todos os domínios e tenta autenticar.
*  `authentication_ldap_simple_server_port`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-simple-server-port=port_num</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_ldap_simple_server_port</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>389</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>32376</code></td> </tr></tbody></table>

Para autenticação LDAP simples, o número de porta TCP/IP do servidor LDAP.

Se o número de porta do LDAP for configurado como 636 ou 3269, o plugin usa LDAPS (LDAP over SSL) em vez de LDAP. (LDAPS difere de `startTLS`.)
*  `authentication_ldap_simple_tls`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-simple-tls[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_ldap_simple_tls</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Para a autenticação LDAP simples, se as conexões do plugin com o servidor LDAP são seguras. Se esta variável for habilitada, o plugin usa TLS para se conectar de forma segura ao servidor LDAP. Esta variável pode ser definida para substituir a configuração padrão de TLS do OpenLDAP; consulte LDAP Pluggable Authentication e ldap.conf. Se você habilitar esta variável, também pode querer definir a variável `authentication_ldap_simple_ca_path`.

  Os plugins MySQL LDAP suportam o método StartTLS, que inicia o TLS em cima de uma conexão LDAP simples.

  LDAPS pode ser usado definindo a variável de sistema `authentication_ldap_simple_server_port`.
*  `authentication_ldap_simple_user_search_attr`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-simple-user-search-attr=value</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>authentication_ldap_simple_user_search_attr</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>uid</code></td> </tr></tbody></table>

Para autenticação simples LDAP, o nome do atributo que especifica os nomes de usuário nas entradas de diretório LDAP. Se o nome de distinção do usuário não for fornecido, o plugin de autenticação procura pelo nome usando este atributo. Por exemplo, se o valor `authentication_ldap_simple_user_search_attr` for `uid`, uma busca pelo nome do usuário `user1` encontra entradas com um valor de `uid` de `user1`.
*  `authentication_webauthn_rp_id`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-webauthn-rp-id=value</code></td> </tr><tr><th>Variável do Sistema</th> <td>`authentication_webauthn_rp_id`</td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Dica de `SET_VAR` Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Esta variável especifica o ID da parte de confiança usado para a instalação do plugin no lado do servidor, registro de dispositivos e autenticação WebAuthn. Se a autenticação WebAuthn for tentada e este valor não for o esperado pelo dispositivo, o dispositivo assume que não está falando com o servidor correto e um erro ocorre. O comprimento máximo do valor é de 255 caracteres.