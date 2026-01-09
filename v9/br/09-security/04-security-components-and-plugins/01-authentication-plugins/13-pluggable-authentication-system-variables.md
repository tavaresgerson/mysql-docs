#### 8.4.1.13 Variáveis do Sistema de Autenticação Conectable

Essas variáveis não estão disponíveis, a menos que o plugin do lado do servidor apropriado esteja instalado:

* `authentication_ldap_sasl` para variáveis do sistema com nomes na forma `authentication_ldap_sasl_xxx`

* `authentication_ldap_simple` para variáveis do sistema com nomes na forma `authentication_ldap_simple_xxx`

**Tabela 8.28 Resumo das Variáveis do Sistema de Plugin de Autenticação**

<table frame="box" rules="all" summary="Referência para variáveis do sistema de plugins de autenticação.">
<tr>
<th>Nome</th>
<th>Linha de comando</th>
<th>Arquivo de opção</th>
<th>Var do sistema</th>
<th>Var de status</th>
<th>Alcance</th>
<th>Dinâmico</th>
</tr>
<tr>
<th>authentication_kerberos_service_key_tab</th>
<th>Sim</th>
<th>Sim</th>
<th>Sim</th>
<th></th>
<th>Global</th>
<th>Não</th>
</tr>
<tr>
<th>authentication_kerberos_service_principal</th>
<th>Sim</th>
<th>Sim</th>
<th>Sim</th>
<th></th>
<th>Global</th>
<th>Sim</th>
</tr>
<tr>
<th>authentication_ldap_sasl_auth_method_name</th>
<th>Sim</th>
<th>Sim</th>
<th>Sim</th>
<th></th>
<th>Global</th>
<th>Sim</th>
</tr>
<tr>
<th>authentication_ldap_sasl_bind_base_dn</th>
<th>Sim</th>
<th>Sim</th>
<th>Sim</th>
<th></th>
<th>Global</th>
<th>Sim</th>
</tr>
<tr>
<th>authentication_ldap_sasl_bind_root_dn</th>
<th>Sim</th>
<th>Sim</th>
<th>Sim</th>
<th></th>
<th>Global</th>
<th>Sim</th>
</tr>
<tr>
<th>authentication_ldap_sasl_bind_root_pwd</th>
<th>Sim</th>
<th>Sim</th>
<th>Sim</th>
<th></th>
<th>Global</th>
<th>Sim</th>
</tr>
<tr>
<th>authentication_ldap_sasl_ca_path</th>
<th>Sim</th>
<th>Sim</th>
<th>Sim</th>
<th></th>
<th>Global</th>
<th>Sim</th>
</tr>
<tr>
<th>authentication_ldap_sasl_connect_timeout</th>
<th>Sim</th>
<th>Sim</th>
<th>Sim</th>
<th></th>
<th>Global</th>
<th>Sim</th>
</tr>
<tr>
<th>authentication_ldap_sasl_group_search_attr</th>
<th>Sim</th>
<th>Sim</th>
<th>Sim</th>
<th></th>
<th>Global</th>
<th>Sim</th>
</tr>
<tr>
<th>authentication_ldap_sasl_group_search_filter</th>
<th>Sim</th>
<th>Sim</th>
<th>Sim</th>
<th></th>
<th>Global</th>
<th>Sim</th>
</tr>
<tr>
<th>authentication_ldap_sasl_init_pool_size</th>
<th>Sim</th>
<th>Sim</th>
<th>Sim</th>
<th></th>
<th>Global</th>
<th>Sim</th>
</tr>
<tr>
<th>authentication_ldap_sasl_log_status</th>
<th>Sim</th>
<th>Sim</th>
<th>Sim</th>
<th></th>
<th>Global</th>
<th>Sim</th>
</tr>
<tr>
<th>authentication_ldap_sasl_max_pool_size</th>
<th>Sim</th>
<th>Sim</th>
<th>Sim</th>
<th></th>
<th>Global</th>
<th>Sim</th>
</tr>
<tr>
<th>authentication_ldap_sasl_referral</th>
<th>Sim</th>
<th>Sim</th>
<th>Sim</th>
<th></th>
<th>Global</th>
<th>Sim</th>
</tr>
<tr>
<th>authentication_ldap_sasl_response_timeout</th>
<th>Sim</th>
<th>Sim</th>
<th>Sim</th>
<th></th>
<th>Global</th>
<th>Sim</th>
</tr>
<tr>
<th>authentication_ldap_sasl_server_host</th>
<th>Sim</th>
<th>Sim</th>
<th>Sim</th>
<th></th>
<th>Global</th>
<th>Sim</th>
</tr>
<tr>
<th>authentication_ldap_sasl_server_port</th>
<th>Sim</th>
<th>Sim</th>
<th>Sim</th>
<th></th>
<th>Global</th>
<th>Sim</th>
</tr>
<tr>
<th>authentication_ldap_tls</th>
<th>Sim</th>
<th>Sim</th>
<th>Sim</th>
<th></th>
<th>Global</th>
<th>Sim</th>
</tr>
<tr>
<th>authentication_ldap_user_search_attr</th>
<th>Sim</th>
<th>Sim</th>
<th>Sim</th>
<th></th>
<th>Global</th>
<th>Sim</th>
</tr>
<tr>
<th>authentication_ldap_simple_auth_method_name</th>
<th>Sim</th>
<th>Sim</th>
<th>Sim</th>
<th></th>
<th>Global</th>
<th>Sim</th>
</tr>
<tr>
<th>authentication_ldap_simple_bind_base_dn</th>
<th>Sim</th>
<th>Sim</th>
<th>Sim</th>
<th></th>
<th>Global</th>
<th>Sim</th>
</tr>
<tr>
<th>authentication_ldap_simple_bind_root_dn</th>
<th>Sim</th>
<th>Sim</th>
<th>Sim</th>
<th></th>
<th>Global</th>
<th>Sim</th>
</tr>
<tr>
<th>authentication_ldap_simple_bind_root_pwd</th>
<th>Sim</th>
<th>Sim</th>
<th>Sim</th>
<th></th>
<th>Global</th>
<th>Sim</th>
</tr>
<tr>
<th>authentication_ldap_simple_ca_path</th>
<th>Sim</th>
<th>Sim</th>
<th>Sim

* `authentication_kerberos_service_key_tab`

  <table frame="box" rules="all" summary="Propriedades para authentication_kerberos_service_key_tab">
    
    <tbody>
      <tr><th>Formato de linha de comando</th> <td><code>--authentication-kerberos-service-key-tab=nome_do_arquivo</code></td> </tr>
      <tr><th>Variável do sistema</th> <td><code><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_key_tab">authentication_kerberos_service_key_tab</a></code></td> </tr>
      <tr><th>Alcance</th> <td>Global</td> </tr>
      <tr><th>Dinâmico</th> <td>Não</td> </tr>
      <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis">SET_VAR</a> Aplica-se</th> <td>Não</td> </tr>
      <tr><th>Tipo</th> <td>Nome do arquivo</td> </tr>
      <tr><th>Valor padrão</th> <td><code>datadir/mysql.keytab</code></td> </tr>
    </tbody>
  </table>

  O nome do arquivo da tabela de chaves do lado do servidor (“keytab”) que contém as chaves de serviço Kerberos para autenticar os ingressos do serviço MySQL recebidos dos clientes. O nome do arquivo deve ser fornecido como um nome de caminho absoluto. Se essa variável não for definida, o valor padrão é `mysql.keytab` no diretório de dados.

  O arquivo deve existir e conter uma chave válida para o nome do principal de serviço (SPN) ou a autenticação dos clientes falhará. (O SPN e a mesma chave também devem ser criados no servidor Kerberos.) O arquivo pode conter vários nomes de principais de serviço e suas respectivas combinações de chaves.

  O arquivo deve ser gerado pelo administrador do servidor Kerberos e copiado para um local acessível pelo servidor MySQL. O arquivo pode ser validado para garantir que esteja correto e tenha sido copiado corretamente usando este comando:

  ```
  klist -k file_name
  ```

Para obter informações sobre arquivos keytab, consulte <https://web.mit.edu/kerberos/krb5-latest/doc/basic/keytab_def.html>.

* `authentication_kerberos_service_principal`

  <table frame="box" rules="all" summary="Propriedades para authentication_kerberos_service_principal"><tr><th>Formato de linha de comando</th> <td><code>--authentication-kerberos-service-principal=nome</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_principal">authentication_kerberos_service_principal</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de configuração de variáveis"><code>SET_VAR</code></a> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>mysql/host_name@realm_name</code></td> </tr></tbody></table>

  O nome do principal de serviço Kerberos (SPN) que o servidor MySQL envia aos clientes.

  O valor é composto pelo nome do serviço (`mysql`), um nome de host e um nome de domínio. O valor padrão é `mysql/host_name@realm_name`. O domínio no nome do principal de serviço permite recuperar a chave de serviço exata.

  Para usar um valor não padrão, defina o valor usando o mesmo formato. Por exemplo, para usar um nome de host de `krbauth.example.com` e um domínio de `MYSQL.LOCAL`, defina `authentication_kerberos_service_principal` para `mysql/krbauth.example.com@MYSQL.LOCAL`.

  O nome do principal de serviço e a chave de serviço devem estar presentes na base de dados gerenciada pelo servidor KDC.

Pode haver nomes de métodos de autenticação de serviço que diferem apenas pelo nome do domínio.

* `authentication_ldap_sasl_auth_method_name`

  <table frame="box" rules="all" summary="Propriedades para authentication_ldap_sasl_auth_method_name"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_auth_method_name">authentication_ldap_sasl_auth_method_name</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Dicas de configuração da variável</a> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>SCRAM-SHA-256</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>SCRAM-SHA-1</code></p><p class="valid-value"><code>SCRAM-SHA-256</code></p><p class="valid-value"><code>GSSAPI</code></p></td> </tr></tbody></table>

  Para a autenticação SASL LDAP, o nome do método de autenticação. A comunicação entre o plugin de autenticação e o servidor LDAP ocorre de acordo com este método de autenticação para garantir a segurança da senha.

Estes valores de métodos de autenticação são permitidos:

+ `SCRAM-SHA-1`: Use um mecanismo de desafio-resposta SASL.

O plugin de autenticação `authentication_ldap_sasl_client` do lado do cliente comunica-se com o servidor SASL, usando a senha para criar um desafio e obter um buffer de solicitação SASL, e depois passa esse buffer para o plugin de autenticação `authentication_ldap_sasl` do lado do servidor. Os plugins SASL LDAP do lado do cliente e do lado do servidor usam mensagens SASL para a transmissão segura de credenciais dentro do protocolo LDAP, para evitar o envio da senha em texto claro entre o cliente e o servidor MySQL.

`SCRAM-SHA-1` está desatualizado a partir do MySQL 9.5.0 e está sujeito à remoção em uma futura versão do MySQL.

+ `SCRAM-SHA-256`: Use um mecanismo de desafio-resposta SASL.

Este método é semelhante ao `SCRAM-SHA-1`, mas é mais seguro. Ele requer um servidor OpenLDAP construído usando o Cyrus SASL 2.1.27 ou superior.

`SCRAM-SHA-256` é o valor padrão a partir do MySQL 9.5.0.

+ `GSSAPI`: Use Kerberos, um protocolo sem senha e baseado em ingressos.

O GSSAPI/Kerberos é suportado como um método de autenticação para clientes e servidores MySQL apenas no Linux. É útil em ambientes Linux onde as aplicações acessam o LDAP usando o Microsoft Active Directory, que tem Kerberos habilitado por padrão.

O plugin de autenticação `authentication_ldap_sasl_client` do lado do cliente obtém um ticket de serviço usando o ticket de concessão de ingressos (TGT) do Kerberos, mas não usa diretamente os serviços LDAP. O plugin de autenticação `authentication_ldap_sasl` do lado do servidor encaminha mensagens Kerberos entre o plugin do lado do cliente e o servidor LDAP. Usando as credenciais assim obtidas, o plugin do lado do servidor então comunica-se com o servidor LDAP para interpretar mensagens de autenticação LDAP e recuperar grupos LDAP.

* `authentication_ldap_sasl_bind_base_dn`

<table frame="box" rules="all" summary="Propriedades para autenticação_ldap_sasl_bind_base_dn">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_bind_base_dn">authentication_ldap_sasl_bind_base_dn</a></code></td>
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
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>NULL</code></td>
  </tr>
</table>

  Para a autenticação SASL LDAP, o nome distinto da base (DN). Esta variável pode ser usada para limitar o escopo das pesquisas ancorando-as em um determinado local (a “base”) dentro da árvore de pesquisa.

  Suponha que os membros de um conjunto de entradas de usuário do LDAP tenham cada uma a seguinte forma:

  ```
  uid=user_name,ou=People,dc=example,dc=com
  ```

  E que os membros de outro conjunto de entradas de usuário do LDAP tenham cada uma a seguinte forma:

  ```
  uid=user_name,ou=Admin,dc=example,dc=com
  ```

  Então, as pesquisas funcionam da seguinte maneira com diferentes valores de DN da base:

  + Se o DN da base for `ou=People,dc=example,dc=com`: As pesquisas encontram entradas de usuário apenas no primeiro conjunto.

  + Se o DN da base for `ou=Admin,dc=example,dc=com`: As pesquisas encontram entradas de usuário apenas no segundo conjunto.

  + Se o DN da base for `ou=dc=example,dc=com`: As pesquisas encontram entradas de usuário no primeiro ou segundo conjunto.

  Em geral, valores de DN da base mais específicos resultam em pesquisas mais rápidas porque limitam o escopo da pesquisa mais.

* `authentication_ldap_sasl_bind_root_dn`

  <table frame="box" rules="all" summary="Propriedades para authentication_ldap_sasl_bind_root_dn"><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-sasl-bind-root-dn=value</code></td> </tr><tr><th>Variável do Sistema</th> <td><code><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_bind_root_dn">authentication_ldap_sasl_bind_root_dn</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></table>

  Para a autenticação SASL LDAP, o nome distinto raiz (DN). Esta variável é usada em conjunto com `authentication_ldap_sasl_bind_root_pwd` como as credenciais para autenticar-se no servidor LDAP com o propósito de realizar pesquisas. A autenticação usa uma ou duas operações de vinculação LDAP, dependendo se o nome da conta MySQL nomeia um DN de usuário LDAP:

+ Se a conta não nomear um DN de usuário: `authentication_ldap_sasl` realiza uma ligação LDAP inicial usando `authentication_ldap_sasl_bind_root_dn` e `authentication_ldap_sasl_bind_root_pwd`. (Ambos são preenchidos por padrão, então, se não forem definidos, o servidor LDAP deve permitir conexões anônimas.) O handle de ligação LDAP resultante é usado para buscar o DN do usuário, com base no nome do usuário do cliente. `authentication_ldap_sasl` realiza uma segunda ligação usando o DN do usuário e a senha fornecida pelo cliente.

+ Se a conta nomear um DN de usuário: A primeira operação de ligação é desnecessária neste caso. `authentication_ldap_sasl` realiza uma única ligação usando o DN do usuário e a senha fornecida pelo cliente. Isso é mais rápido do que se a conta MySQL não especificar um DN de usuário LDAP.

* `authentication_ldap_sasl_bind_root_pwd`

  <table frame="box" rules="all" summary="Propriedades para authentication_ldap_sasl_bind_root_pwd"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-sasl-bind-root-pwd=value</code></td> </tr><tr><th>Variável do Sistema</th> <td><code><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_bind_root_pwd">authentication_ldap_sasl_bind_root_pwd</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Dicas de Definição de Variável"><code>SET_VAR</code></a></code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

Para a autenticação SASL LDAP, a senha para o nome distinto raiz. Esta variável é usada em conjunto com `authentication_ldap_sasl_bind_root_dn`. Veja a descrição dessa variável.

* `authentication_ldap_sasl_ca_path`

  <table frame="box" rules="all" summary="Propriedades para authentication_ldap_sasl_ca_path"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-ldap-sasl-ca-path=value</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_ca_path">authentication_ldap_sasl_ca_path</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Dicas de configuração da variável</a> Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Para a autenticação SASL LDAP, o caminho absoluto do arquivo da autoridade de certificação. Especifique este arquivo se desejar que o plugin de autenticação realize a verificação do certificado do servidor LDAP.

  Nota

  Além de definir a variável `authentication_ldap_sasl_ca_path` com o nome do arquivo, você deve adicionar os certificados apropriados da autoridade de certificação ao arquivo e habilitar a variável de sistema `authentication_ldap_sasl_tls`. Essas variáveis podem ser definidas para substituir a configuração padrão de TLS do OpenLDAP; consulte LDAP Pluggable Authentication e ldap.conf

* `authentication_ldap_sasl_connect_timeout`

<table frame="box" rules="all" summary="Propriedades para authentication_ldap_sasl_connect_timeout">
  <tr><th>Formato de Linha de Comando</th> <td><code>--authentication-ldap-sasl-connect-timeout=#</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_connect_timeout">authentication_ldap_sasl_connect_timeout</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>30</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code>31536000</code></td> </tr>
  <tr><th>Unidade</th> <td>segundos</td> </tr>
</table>

  Especifica o tempo (em segundos) que o servidor MySQL espera para se conectar ao servidor LDAP usando TCP.

  Quando uma conta MySQL autentica-se usando LDAP, o servidor MySQL tenta estabelecer uma conexão TCP com o servidor LDAP, que ele usa para enviar uma solicitação de vinculação LDAP sobre a conexão. Se o servidor LDAP não responder ao aperto de mão TCP após um período de tempo configurado, o MySQL abandona a tentativa de aperto de mão TCP e emite uma mensagem de erro. Se o ajuste de tempo de espera for zero, o servidor MySQL ignora essa configuração da variável do sistema. Para mais informações, consulte Configuração de Temporizadores para Autenticação Pluggable LDAP.

  Nota

Se você definir essa variável para um valor de tempo de espera maior que o valor padrão do sistema host, o tempo de espera mais curto do sistema será usado.

* `authentication_ldap_sasl_group_search_attr`

  <table frame="box" rules="all" summary="Propriedades para authentication_ldap_sasl_group_search_attr"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-ldap-sasl-group-search-attr=value</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_group_search_attr">authentication_ldap_sasl_group_search_attr</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variáveis"><code>SET_VAR</a></code> Dicas Aplicam-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>cn</code></td> </tr></tbody></table>

  Para a autenticação SASL LDAP, o nome do atributo que especifica os nomes de grupos nas entradas de diretório LDAP. Se `authentication_ldap_sasl_group_search_attr` tiver seu valor padrão de `cn`, as pesquisas retornam o valor `cn` como o nome do grupo. Por exemplo, se uma entrada LDAP com um valor de `uid` de `user1` tem um atributo `cn` de `mygroup`, pesquisas para `user1` retornam `mygroup` como o nome do grupo.

  Esta variável deve ser a string vazia se você não quiser autenticação de grupo ou proxy.

Se o atributo de busca de grupo for `isMemberOf`, a autenticação LDAP recupera diretamente o valor do atributo de usuário `isMemberOf` e atribui-o como informação de grupo. Se o atributo de busca de grupo não for `isMemberOf`, a autenticação LDAP procura por todos os grupos nos quais o usuário é membro. (Este é o comportamento padrão.) Esse comportamento é baseado em como as informações de grupo do LDAP podem ser armazenadas de duas maneiras: 1) Uma entrada de grupo pode ter um atributo chamado `memberUid` ou `member` com um valor que é um nome de usuário; 2) Uma entrada de usuário pode ter um atributo chamado `isMemberOf` com valores que são nomes de grupos.

* `authentication_ldap_sasl_group_search_filter`

  <table frame="box" rules="all" summary="Propriedades para authentication_kerberos_service_key_tab"><tbody><tr><th>Formato de linha de comando</th> <td><code>--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_kerberos_service_key_tab">authentication_kerberos_service_key_tab</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de hint de configuração de variável"><code>SET_VAR</code></a> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome de arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>datadir/mysql.keytab</code></td> </tr></tbody></table>

  Para a autenticação LDAP SASL, o filtro de busca de grupo personalizado.

O valor do filtro de pesquisa pode conter a notação `{UA}` e `{UD}` para representar o nome do usuário e o DN completo do usuário. Por exemplo, `{UA}` é substituído por um nome de usuário, como `"admin"`, enquanto `{UD}` é substituído por um DN completo, como `"uid=admin,ou=People,dc=example,dc=com"`. O valor a seguir é o padrão, que suporta tanto o OpenLDAP quanto o Active Directory:

```
  (|(&(objectClass=posixGroup)(memberUid={UA}))
    (&(objectClass=group)(member={UD})))
  ```6dxFRZCSQ3```
  uid=user_name,ou=People,dc=example,dc=com
  ```Y2KLQuCz0d```
  uid=user_name,ou=Admin,dc=example,dc=com
  ```7LvQjV7NV3```
  (|(&(objectClass=posixGroup)(memberUid={UA}))
    (&(objectClass=group)(member={UD})))
  ```pYs29wvSzG```
    host -t SRV _ldap._tcp.mem.local
    ```0qlPGHv6Td```
       nameserver 10.172.166.100
       ```dwur8djZaG```
       _ldap._tcp.mem.local. 86400 IN SRV 0 100 389 ldap1.mem.local.
       _ldap._tcp.mem.local. 86400 IN SRV 0 100 389 ldap2.mem.local.
       _ldap._tcp.mem.local. 86400 IN SRV 0 100 389 ldap3.mem.local.
       ```L7Sua5sxgb```

Com o DNS configurado como descrito, o plugin LDAP do lado do servidor pode descobrir os servidores LDAP e tenta autenticar em todos os domínios até que a autenticação seja bem-sucedida ou não haja mais servidores.

O Windows não precisa de configurações como as descritas. Dado o endereço do servidor LDAP no valor `authentication_ldap_simple_server_host`, a biblioteca LDAP do Windows busca todos os domínios e tenta autenticar.

* `authentication_ldap_simple_server_port`

  <table frame="box" rules="all" summary="Propriedades para authentication_ldap_sasl_auth_method_name"><tr><th>Formato de linha de comando</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_auth_method_name">authentication_ldap_sasl_auth_method_name</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de configuração de variáveis"><code>SET_VAR</a></code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>SCRAM-SHA-256</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>SCRAM-SHA-1</code></p><p class="valid-value"><code>SCRAM-SHA-256</code></p><p class="valid-value"><code>GSSAPI</code></p></td> </tr></tbody></table>

  Para autenticação simples LDAP, o número da porta TCP/IP do servidor LDAP.

  Se o número da porta do LDAP for configurado como 636 ou 3269, o plugin usa LDAPS (LDAP over SSL) em vez de LDAP. (LDAPS difere de `startTLS`.)

* `authentication_ldap_simple_tls`

<table frame="box" rules="all" summary="Propriedades para authentication_ldap_sasl_auth_method_name">
  <tr><th>Formato de linha de comando</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr>
  <tr><th>Variável do sistema</th> <td><code><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_auth_method_name">authentication_ldap_sasl_auth_method_name</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>String</td> </tr>
  <tr><th>Valor padrão</th> <td><code>SCRAM-SHA-256</code></td> </tr>
  <tr><th>Valores válidos</th> <td><p class="valid-value"><code>SCRAM-SHA-1</code></p><p class="valid-value"><code>SCRAM-SHA-256</code></p><p class="valid-value"><code>GSSAPI</code></p></td> </tr>
</table>

  Para autenticação LDAP simples, se as conexões do plugin com o servidor LDAP são seguras. Se essa variável estiver habilitada, o plugin usa TLS para se conectar de forma segura ao servidor LDAP. Essa variável pode ser definida para substituir a configuração padrão de TLS do OpenLDAP; consulte LDAP Pluggable Authentication e ldap.conf. Se você habilitar essa variável, também pode querer definir a variável `authentication_ldap_simple_ca_path`.

  Os plugins MySQL LDAP suportam o método StartTLS, que inicializa TLS em cima de uma conexão LDAP simples.

  LDAPS pode ser usado definindo a variável de sistema `authentication_ldap_simple_server_port`.

* `authentication_ldap_simple_user_search_attr`

  <table frame="box" rules="all" summary="Propriedades para authentication_ldap_sasl_auth_method_name"><tr><th>Formato de linha de comando</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_auth_method_name">authentication_ldap_sasl_auth_method_name</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>SCRAM-SHA-256</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>SCRAM-SHA-1</code></p><p class="valid-value"><code>SCRAM-SHA-256</code></p><p class="valid-value"><code>GSSAPI</code></p></td> </tr></table>

  Para autenticação simples LDAP, o nome do atributo que especifica os nomes de usuário nas entradas de diretório LDAP. Se o nome do nome de usuário do usuário não for fornecido, o plugin de autenticação busca o nome usando este atributo. Por exemplo, se o valor de `authentication_ldap_simple_user_search_attr` for `uid`, uma busca pelo nome do usuário `user1` encontra entradas com um valor de `uid` de `user1`.

* `authentication_webauthn_rp_id`

<table frame="box" rules="all" summary="Propriedades para authentication_ldap_sasl_auth_method_name">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--authentication-ldap-sasl_auth_method_name=value</code></td>
  </tr>
  <tr>
    <th>Variável do sistema</th>
    <td><code><a class="link" href="pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_auth_method_name">authentication_ldap_sasl_auth_method_name</a></code></td>
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
    <th>Hinta de definição de variável</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>SCRAM-SHA-256</code></td>
  </tr>
  <tr>
    <th>Valores válidos</th>
    <td><p class="valid-value"><code>SCRAM-SHA-1</code></p><p class="valid-value"><code>SCRAM-SHA-256</code></p><p class="valid-value"><code>GSSAPI</code></p></td>
  </tr>
</table>