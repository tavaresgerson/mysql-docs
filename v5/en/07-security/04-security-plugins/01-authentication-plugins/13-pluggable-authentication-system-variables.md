#### 6.4.1.13 Variáveis de Sistema de Autenticação Pluggable

Estas variáveis não estão disponíveis a menos que o Plugin de lado do servidor apropriado esteja instalado:

* `authentication_ldap_sasl` para variáveis de sistema com nomes do formato `authentication_ldap_sasl_xxx`

* `authentication_ldap_simple` para variáveis de sistema com nomes do formato `authentication_ldap_simple_xxx`

**Tabela 6.20 Resumo das Variáveis de Sistema do Plugin de Autenticação**

| Nome | Linha de Comando | Arquivo de Opções | Variável de Sistema | Variável de Status | Escopo da Variável | Dinâmico |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| authentication_ldap_sasl_auth_method_name | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_sasl_bind_base_dn | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_sasl_bind_root_dn | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_sasl_bind_root_pwd | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_sasl_ca_path | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_sasl_group_search_attr | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_sasl_group_search_filter | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_sasl_init_pool_size | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_sasl_log_status | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_sasl_max_pool_size | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_sasl_server_host | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_sasl_server_port | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_sasl_tls | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_sasl_user_search_attr | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_simple_auth_method_name | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_simple_bind_base_dn | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_simple_bind_root_dn | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_simple_bind_root_pwd | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_simple_ca_path | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_simple_group_search_attr | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_simple_group_search_filter | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_simple_init_pool_size | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_simple_log_status | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_simple_max_pool_size | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_simple_server_host | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_simple_server_port | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_simple_tls | Sim | Sim | Sim | | Global | Sim |
| authentication_ldap_simple_user_search_attr | Sim | Sim | Sim | | Global | Sim |
| authentication_windows_log_level | Sim | Sim | Sim | | Global | Não |
| authentication_windows_use_principal_name | Sim | Sim | Sim | | Global | Não |

* [`authentication_ldap_sasl_auth_method_name`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_auth_method_name)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>SCRAM-SHA-1</code></td> </tr><tr><th>Valores Válidos</th> <td><code>SCRAM-SHA-1</code></td> </tr></tbody></table>

  Para autenticação SASL LDAP, o nome do método de autenticação. A comunicação entre o Plugin de autenticação e o servidor LDAP ocorre de acordo com este método de autenticação para garantir a segurança da senha.

  Estes valores de método de autenticação são permitidos:

  + `SCRAM-SHA-1`: Usa um mecanismo SASL challenge-response.

    O Plugin `authentication_ldap_sasl_client` do lado do cliente se comunica com o servidor SASL, usando a senha para criar um *challenge* e obter um buffer de requisição SASL, então passa este buffer para o Plugin `authentication_ldap_sasl` do lado do servidor. Os Plugins SASL LDAP do lado do cliente e do servidor usam mensagens SASL para transmissão segura de credenciais dentro do protocolo LDAP, para evitar o envio da senha em texto não criptografado entre o cliente e o servidor MySQL.

* [`authentication_ldap_sasl_bind_base_dn`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_bind_base_dn)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Para autenticação SASL LDAP, o distinguished name (DN) base. Esta variável pode ser usada para limitar o escopo das buscas, ancorando-as em um determinado local (a "base") dentro da árvore de pesquisa.

  Suponha que os membros de um conjunto de entradas de usuário LDAP tenham cada um este formato:

  ```sql
  uid=user_name,ou=People,dc=example,dc=com
  ```

  E que os membros de outro conjunto de entradas de usuário LDAP tenham cada um este formato:

  ```sql
  uid=user_name,ou=Admin,dc=example,dc=com
  ```

  Então, as buscas funcionam assim para diferentes valores de DN base:

  + Se o DN base for `ou=People,dc=example,dc=com`: As buscas encontram entradas de usuário apenas no primeiro conjunto.

  + Se o DN base for `ou=Admin,dc=example,dc=com`: As buscas encontram entradas de usuário apenas no segundo conjunto.

  + Se o DN base for `ou=dc=example,dc=com`: As buscas encontram entradas de usuário no primeiro ou segundo conjunto.

  Em geral, valores de DN base mais específicos resultam em buscas mais rápidas porque limitam mais o escopo da pesquisa.

* [`authentication_ldap_sasl_bind_root_dn`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_bind_root_dn)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_root_dn"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-bind-root-dn=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_bind_root_dn</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Para autenticação SASL LDAP, o distinguished name (DN) root. Esta variável é usada em conjunto com [`authentication_ldap_sasl_bind_root_pwd`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_bind_root_pwd) como as credenciais para autenticar no servidor LDAP com o propósito de realizar buscas. A autenticação usa uma ou duas operações de bind LDAP, dependendo se a conta MySQL nomeia um DN de usuário LDAP:

  + Se a conta não nomear um DN de usuário: `authentication_ldap_sasl` executa um bind LDAP inicial usando [`authentication_ldap_sasl_bind_root_dn`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_bind_root_dn) e [`authentication_ldap_sasl_bind_root_pwd`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_bind_root_pwd). (Ambos estão vazios por padrão, portanto, se não estiverem definidos, o servidor LDAP deve permitir conexões anônimas.) O handle de bind LDAP resultante é usado para buscar o DN do usuário, com base no nome de usuário do cliente. `authentication_ldap_sasl` executa um segundo bind usando o DN do usuário e a senha fornecida pelo cliente.

  + Se a conta nomear um DN de usuário: A primeira operação de bind é desnecessária neste caso. `authentication_ldap_sasl` executa um único bind usando o DN do usuário e a senha fornecida pelo cliente. Isso é mais rápido do que se a conta MySQL não especificar um DN de usuário LDAP.

* [`authentication_ldap_sasl_bind_root_pwd`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_bind_root_pwd)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_root_pwd"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-bind-root-pwd=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_bind_root_pwd</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Para autenticação SASL LDAP, a senha para o distinguished name root. Esta variável é usada em conjunto com [`authentication_ldap_sasl_bind_root_dn`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_bind_root_dn). Veja a descrição dessa variável.

* [`authentication_ldap_sasl_ca_path`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_ca_path)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_ca_path"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-ca-path=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_ca_path</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Para autenticação SASL LDAP, o caminho absoluto do arquivo da Certificate Authority (Autoridade Certificadora). Especifique este arquivo se desejar que o Plugin de autenticação realize a verificação do certificado do servidor LDAP.

  Note

  Além de definir a variável [`authentication_ldap_sasl_ca_path`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_ca_path) com o nome do arquivo, você deve adicionar os certificados de autoridade apropriados ao arquivo e habilitar a variável de sistema [`authentication_ldap_sasl_tls`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_tls). Essas variáveis podem ser definidas para substituir a configuração OpenLDAP TLS padrão; veja [Autenticação Pluggable LDAP e ldap.conf](ldap-pluggable-authentication.html#ldap-pluggable-authentication-ldap-conf "Autenticação Pluggable LDAP e ldap.conf")

* [`authentication_ldap_sasl_group_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_group_search_attr)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_group_search_attr"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-group-search-attr=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_group_search_attr</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>cn</code></td> </tr></tbody></table>

  Para autenticação SASL LDAP, o nome do atributo que especifica nomes de grupo em entradas de diretório LDAP. Se [`authentication_ldap_sasl_group_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_group_search_attr) tiver seu valor padrão de `cn`, as buscas retornarão o valor `cn` como o nome do grupo. Por exemplo, se uma entrada LDAP com um valor `uid` de `user1` tiver um atributo `cn` de `mygroup`, as buscas por `user1` retornarão `mygroup` como o nome do grupo.

  Esta variável deve ser uma string vazia se você não quiser nenhuma autenticação de grupo ou proxy.

  A partir do MySQL 5.7.21, se o atributo de busca de grupo for `isMemberOf`, a autenticação LDAP recupera diretamente o valor do atributo de usuário `isMemberOf` e o atribui como informação de grupo. Se o atributo de busca de grupo não for `isMemberOf`, a autenticação LDAP busca todos os grupos dos quais o usuário é membro. (Este último é o comportamento padrão.) Este comportamento baseia-se em como a informação do grupo LDAP pode ser armazenada de duas maneiras: 1) Uma entrada de grupo pode ter um atributo nomeado `memberUid` ou `member` com um valor que é um nome de usuário; 2) Uma entrada de usuário pode ter um atributo nomeado `isMemberOf` com valores que são nomes de grupo.

* [`authentication_ldap_sasl_group_search_filter`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_group_search_filter)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_group_search_filter"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-group-search-filter=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.21</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_group_search_filter</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>(|(&amp;(objectClass=posixGroup)(memberUid=%s))(&amp;(objectClass=group)(member=%s)))</code></td> </tr></tbody></table>

  Para autenticação SASL LDAP, o filtro de busca de grupo personalizado.

  A partir do MySQL 5.7.22, o valor do filtro de busca pode conter a notação `{UA}` e `{UD}` para representar o nome de usuário e o DN de usuário completo. Por exemplo, `{UA}` é substituído por um nome de usuário como `"admin"`, enquanto `{UD}` é substituído por um DN de usuário completo como `"uid=admin,ou=People,dc=example,dc=com"`. O valor a seguir é o padrão, que suporta tanto OpenLDAP quanto Active Directory:

  ```sql
  (|(&(objectClass=posixGroup)(memberUid={UA}))
    (&(objectClass=group)(member={UD})))
  ```

  Anteriormente, se o atributo de busca de grupo fosse `isMemberOf` ou `memberOf`, ele era tratado como um atributo de usuário que possui informações de grupo. No entanto, em alguns casos para o cenário de usuário, `memberOf` era um atributo de usuário simples que não continha informações de grupo. Para flexibilidade adicional, um prefixo `{GA}` opcional pode agora ser usado com o atributo de busca de grupo. (Anteriormente, presumia-se que se o atributo de busca de grupo fosse `isMemberOf`, ele seria tratado de forma diferente. Agora, qualquer atributo de grupo com um prefixo {GA} é tratado como um atributo de usuário com nomes de grupo.) Por exemplo, com um valor de `{GA}MemberOf`, se o valor do grupo for o DN, o primeiro valor do atributo do DN do grupo será retornado como o nome do grupo.

  No MySQL 5.7.21, o filtro de busca usava a notação `%s`, expandindo-o para o nome de usuário para OpenLDAP (`&(objectClass=posixGroup)(memberUid=%s)`) e para o DN de usuário completo para Active Directory (`&(objectClass=group)(member=%s)`).

* [`authentication_ldap_sasl_init_pool_size`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_init_pool_size)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_init_pool_size"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-init-pool-size=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_init_pool_size</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>10</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>32767</code></td> </tr><tr><th>Unidade</th> <td>conexões</td> </tr></tbody></table>

  Para autenticação SASL LDAP, o tamanho inicial do Pool de conexões para o servidor LDAP. Escolha o valor para esta variável com base no número médio de requisições de autenticação concorrentes para o servidor LDAP.

  O Plugin usa [`authentication_ldap_sasl_init_pool_size`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_init_pool_size) e [`authentication_ldap_sasl_max_pool_size`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_max_pool_size) em conjunto para o gerenciamento do Pool de conexões:

  + Quando o Plugin de autenticação inicializa, ele cria [`authentication_ldap_sasl_init_pool_size`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_init_pool_size) conexões, a menos que [`authentication_ldap_sasl_max_pool_size=0`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_max_pool_size) para desabilitar o *pooling*.

  + Se o Plugin receber uma requisição de autenticação quando não houver conexões livres no Pool de conexões atual, o Plugin pode criar uma nova conexão, até o tamanho máximo do Pool de conexões dado por [`authentication_ldap_sasl_max_pool_size`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_max_pool_size).

  + Se o Plugin receber uma requisição quando o tamanho do Pool já estiver no máximo e não houver conexões livres, a autenticação falhará.

  + Quando o Plugin é descarregado, ele fecha todas as conexões em Pool.

  Alterações nas configurações das variáveis de sistema do Plugin podem não ter efeito nas conexões que já estão no Pool. Por exemplo, modificar o host do servidor LDAP, a porta ou as configurações de TLS não afeta as conexões existentes. No entanto, se os valores originais da variável fossem inválidos e o Pool de conexões não pudesse ser inicializado, o Plugin tentará reiniciar o Pool para a próxima requisição LDAP. Neste caso, os novos valores da variável de sistema serão usados para a tentativa de reinicialização.

  Se [`authentication_ldap_sasl_max_pool_size=0`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_max_pool_size) para desabilitar o *pooling*, cada conexão LDAP aberta pelo Plugin usa os valores que as variáveis de sistema possuem naquele momento.

* [`authentication_ldap_sasl_log_status`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_log_status)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_log_status"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-log-status=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_log_status</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>5</code></td> </tr></tbody></table>

  Para autenticação SASL LDAP, o nível de log para mensagens escritas no error log. A tabela a seguir mostra os valores de nível permitidos e seus significados.

  **Tabela 6.21 Níveis de Log para authentication_ldap_sasl_log_status**

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>SCRAM-SHA-1</code></td> </tr><tr><th>Valores Válidos</th> <td><code>SCRAM-SHA-1</code></td> </tr></tbody></table>

  No lado do cliente, as mensagens podem ser registradas na saída padrão definindo a variável de ambiente `AUTHENTICATION_LDAP_CLIENT_LOG`. Os valores permitidos e padrão são os mesmos de [`authentication_ldap_sasl_log_status`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_log_status).

  A variável de ambiente `AUTHENTICATION_LDAP_CLIENT_LOG` aplica-se apenas à autenticação SASL LDAP. Não tem efeito para a autenticação simple LDAP porque o Plugin cliente, nesse caso, é `mysql_clear_password`, que não sabe nada sobre operações LDAP.

* [`authentication_ldap_sasl_max_pool_size`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_max_pool_size)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>SCRAM-SHA-1</code></td> </tr><tr><th>Valores Válidos</th> <td><code>SCRAM-SHA-1</code></td> </tr></tbody></table>

  Para autenticação SASL LDAP, o tamanho máximo do Pool de conexões para o servidor LDAP. Para desabilitar o Pool de conexões, defina esta variável como 0.

  Esta variável é usada em conjunto com [`authentication_ldap_sasl_init_pool_size`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_init_pool_size). Veja a descrição dessa variável.

* [`authentication_ldap_sasl_server_host`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_server_host)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>SCRAM-SHA-1</code></td> </tr><tr><th>Valores Válidos</th> <td><code>SCRAM-SHA-1</code></td> </tr></tbody></table>

  O host do servidor LDAP para autenticação SASL LDAP; este pode ser um nome de host ou endereço IP.

* [`authentication_ldap_sasl_server_port`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_server_port)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>SCRAM-SHA-1</code></td> </tr><tr><th>Valores Válidos</th> <td><code>SCRAM-SHA-1</code></td> </tr></tbody></table>

  Para autenticação SASL LDAP, o número da porta TCP/IP do servidor LDAP.

  A partir do MySQL 5.7.25, se o número da porta LDAP for configurado como 636 ou 3269, o Plugin usará LDAPS (LDAP sobre SSL) em vez de LDAP. (LDAPS difere de `startTLS`.)

* [`authentication_ldap_sasl_tls`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_tls)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>SCRAM-SHA-1</code></td> </tr><tr><th>Valores Válidos</th> <td><code>SCRAM-SHA-1</code></td> </tr></tbody></table>

  Para autenticação SASL LDAP, se as conexões do Plugin com o servidor LDAP são seguras. Se esta variável estiver habilitada, o Plugin usa TLS para se conectar de forma segura ao servidor LDAP. Esta variável pode ser configurada para substituir a configuração OpenLDAP TLS padrão; veja [Autenticação Pluggable LDAP e ldap.conf](ldap-pluggable-authentication.html#ldap-pluggable-authentication-ldap-conf "Autenticação Pluggable LDAP e ldap.conf"). Se você habilitar esta variável, você também pode querer definir a variável [`authentication_ldap_sasl_ca_path`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_ca_path).

  Os Plugins LDAP do MySQL suportam o método StartTLS, que inicializa TLS em cima de uma conexão LDAP simples.

  A partir do MySQL 5.7.25, o LDAPS pode ser usado definindo a variável de sistema [`authentication_ldap_sasl_server_port`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_server_port).

* [`authentication_ldap_sasl_user_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_user_search_attr)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>SCRAM-SHA-1</code></td> </tr><tr><th>Valores Válidos</th> <td><code>SCRAM-SHA-1</code></td> </tr></tbody></table>

  Para autenticação SASL LDAP, o nome do atributo que especifica nomes de usuário em entradas de diretório LDAP. Se um distinguished name de usuário não for fornecido, o Plugin de autenticação buscará o nome usando este atributo. Por exemplo, se o valor de [`authentication_ldap_sasl_user_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_sasl_user_search_attr) for `uid`, uma busca pelo nome de usuário `user1` encontrará entradas com um valor `uid` de `user1`.

* [`authentication_ldap_simple_auth_method_name`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_auth_method_name)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>SCRAM-SHA-1</code></td> </tr><tr><th>Valores Válidos</th> <td><code>SCRAM-SHA-1</code></td> </tr></tbody></table>

  Para autenticação simple LDAP, o nome do método de autenticação. A comunicação entre o Plugin de autenticação e o servidor LDAP ocorre de acordo com este método de autenticação.

  Note

  Para todos os métodos de autenticação simple LDAP, é recomendado também definir os parâmetros TLS para exigir que a comunicação com o servidor LDAP ocorra por meio de conexões seguras.

  Estes valores de método de autenticação são permitidos:

  + `SIMPLE`: Usa autenticação simple LDAP. Este método usa uma ou duas operações de bind LDAP, dependendo se a conta MySQL nomeia um distinguished name de usuário LDAP. Veja a descrição de [`authentication_ldap_simple_bind_root_dn`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_bind_root_dn).

  + `AD-FOREST`: Uma variação de `SIMPLE`, de modo que a autenticação busca em todos os domínios na *Active Directory forest* (Floresta do Active Directory), realizando um bind LDAP em cada domínio do Active Directory até que o usuário seja encontrado em algum domínio.

* [`authentication_ldap_simple_bind_base_dn`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_bind_base_dn)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Para autenticação simple LDAP, o distinguished name (DN) base. Esta variável pode ser usada para limitar o escopo das buscas, ancorando-as em um determinado local (a "base") dentro da árvore de pesquisa.

  Suponha que os membros de um conjunto de entradas de usuário LDAP tenham cada um este formato:

  ```sql
  uid=user_name,ou=People,dc=example,dc=com
  ```

  E que os membros de outro conjunto de entradas de usuário LDAP tenham cada um este formato:

  ```sql
  uid=user_name,ou=Admin,dc=example,dc=com
  ```

  Então, as buscas funcionam assim para diferentes valores de DN base:

  + Se o DN base for `ou=People,dc=example,dc=com`: As buscas encontram entradas de usuário apenas no primeiro conjunto.

  + Se o DN base for `ou=Admin,dc=example,dc=com`: As buscas encontram entradas de usuário apenas no segundo conjunto.

  + Se o DN base for `ou=dc=example,dc=com`: As buscas encontram entradas de usuário no primeiro ou segundo conjunto.

  Em geral, valores de DN base mais específicos resultam em buscas mais rápidas porque limitam mais o escopo da pesquisa.

* [`authentication_ldap_simple_bind_root_dn`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_bind_root_dn)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>SCRAM-SHA-1</code></td> </tr><tr><th>Valores Válidos</th> <td><code>SCRAM-SHA-1</code></td> </tr></tbody></table>

  Para autenticação simple LDAP, o distinguished name (DN) root. Esta variável é usada em conjunto com [`authentication_ldap_simple_bind_root_pwd`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_bind_root_pwd) como as credenciais para autenticar no servidor LDAP com o propósito de realizar buscas. A autenticação usa uma ou duas operações de bind LDAP, dependendo se a conta MySQL nomeia um DN de usuário LDAP:

  + Se a conta não nomear um DN de usuário: `authentication_ldap_simple` executa um bind LDAP inicial usando [`authentication_ldap_simple_bind_root_dn`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_bind_root_dn) e [`authentication_ldap_simple_bind_root_pwd`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_bind_root_pwd). (Ambos estão vazios por padrão, portanto, se não estiverem definidos, o servidor LDAP deve permitir conexões anônimas.) O handle de bind LDAP resultante é usado para buscar o DN do usuário, com base no nome de usuário do cliente. `authentication_ldap_simple` executa um segundo bind usando o DN do usuário e a senha fornecida pelo cliente.

  + Se a conta nomear um DN de usuário: A primeira operação de bind é desnecessária neste caso. `authentication_ldap_simple` executa um único bind usando o DN do usuário e a senha fornecida pelo cliente. Isso é mais rápido do que se a conta MySQL não especificar um DN de usuário LDAP.

* [`authentication_ldap_simple_bind_root_pwd`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_bind_root_pwd)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>SCRAM-SHA-1</code></td> </tr><tr><th>Valores Válidos</th> <td><code>SCRAM-SHA-1</code></td> </tr></tbody></table>

  Para autenticação simple LDAP, a senha para o distinguished name root. Esta variável é usada em conjunto com [`authentication_ldap_simple_bind_root_dn`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_bind_root_dn). Veja a descrição dessa variável.

* [`authentication_ldap_simple_ca_path`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_ca_path)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Para autenticação simple LDAP, o caminho absoluto do arquivo da Certificate Authority. Especifique este arquivo se desejar que o Plugin de autenticação realize a verificação do certificado do servidor LDAP.

  Note

  Além de definir a variável [`authentication_ldap_simple_ca_path`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_ca_path) com o nome do arquivo, você deve adicionar os certificados de autoridade apropriados ao arquivo e habilitar a variável de sistema [`authentication_ldap_simple_tls`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_tls). Essas variáveis podem ser definidas para substituir a configuração OpenLDAP TLS padrão; veja [Autenticação Pluggable LDAP e ldap.conf](ldap-pluggable-authentication.html#ldap-pluggable-authentication-ldap-conf "Autenticação Pluggable LDAP e ldap.conf")

* [`authentication_ldap_simple_group_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_group_search_attr)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Para autenticação simple LDAP, o nome do atributo que especifica nomes de grupo em entradas de diretório LDAP. Se [`authentication_ldap_simple_group_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_group_search_attr) tiver seu valor padrão de `cn`, as buscas retornarão o valor `cn` como o nome do grupo. Por exemplo, se uma entrada LDAP com um valor `uid` de `user1` tiver um atributo `cn` de `mygroup`, as buscas por `user1` retornarão `mygroup` como o nome do grupo.

  A partir do MySQL 5.7.21, se o atributo de busca de grupo for `isMemberOf`, a autenticação LDAP recupera diretamente o valor do atributo de usuário `isMemberOf` e o atribui como informação de grupo. Se o atributo de busca de grupo não for `isMemberOf`, a autenticação LDAP busca todos os grupos dos quais o usuário é membro. (Este último é o comportamento padrão.) Este comportamento baseia-se em como a informação do grupo LDAP pode ser armazenada de duas maneiras: 1) Uma entrada de grupo pode ter um atributo nomeado `memberUid` ou `member` com um valor que é um nome de usuário; 2) Uma entrada de usuário pode ter um atributo nomeado `isMemberOf` com valores que são nomes de grupo.

* [`authentication_ldap_simple_group_search_filter`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_group_search_filter)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Para autenticação simple LDAP, o filtro de busca de grupo personalizado.

  A partir do MySQL 5.7.22, o valor do filtro de busca pode conter a notação `{UA}` e `{UD}` para representar o nome de usuário e o DN de usuário completo. Por exemplo, `{UA}` é substituído por um nome de usuário como `"admin"`, enquanto `{UD}` é substituído por um DN de usuário completo como `"uid=admin,ou=People,dc=example,dc=com"`. O valor a seguir é o padrão, que suporta tanto OpenLDAP quanto Active Directory:

  ```sql
  (|(&(objectClass=posixGroup)(memberUid={UA}))
    (&(objectClass=group)(member={UD})))
  ```

  Anteriormente, se o atributo de busca de grupo fosse `isMemberOf` ou `memberOf`, ele era tratado como um atributo de usuário que possui informações de grupo. No entanto, em alguns casos para o cenário de usuário, `memberOf` era um atributo de usuário simples que não continha informações de grupo. Para flexibilidade adicional, um prefixo `{GA}` opcional pode agora ser usado com o atributo de busca de grupo. (Anteriormente, presumia-se que se o atributo de busca de grupo fosse `isMemberOf`, ele seria tratado de forma diferente. Agora, qualquer atributo de grupo com um prefixo {GA} é tratado como um atributo de usuário com nomes de grupo.) Por exemplo, com um valor de `{GA}MemberOf`, se o valor do grupo for o DN, o primeiro valor do atributo do DN do grupo será retornado como o nome do grupo.

  No MySQL 5.7.21, o filtro de busca usava a notação `%s`, expandindo-o para o nome de usuário para OpenLDAP (`&(objectClass=posixGroup)(memberUid=%s)`) e para o DN de usuário completo para Active Directory (`&(objectClass=group)(member=%s)`).

* [`authentication_ldap_simple_init_pool_size`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_init_pool_size)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Para autenticação simple LDAP, o tamanho inicial do Pool de conexões para o servidor LDAP. Escolha o valor para esta variável com base no número médio de requisições de autenticação concorrentes para o servidor LDAP.

  O Plugin usa [`authentication_ldap_simple_init_pool_size`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_init_pool_size) e [`authentication_ldap_simple_max_pool_size`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_max_pool_size) em conjunto para o gerenciamento do Pool de conexões:

  + Quando o Plugin de autenticação inicializa, ele cria [`authentication_ldap_simple_init_pool_size`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_init_pool_size) conexões, a menos que [`authentication_ldap_simple_max_pool_size=0`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_max_pool_size) para desabilitar o *pooling*.

  + Se o Plugin receber uma requisição de autenticação quando não houver conexões livres no Pool de conexões atual, o Plugin pode criar uma nova conexão, até o tamanho máximo do Pool de conexões dado por [`authentication_ldap_simple_max_pool_size`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_max_pool_size).

  + Se o Plugin receber uma requisição quando o tamanho do Pool já estiver no máximo e não houver conexões livres, a autenticação falhará.

  + Quando o Plugin é descarregado, ele fecha todas as conexões em Pool.

  Alterações nas configurações das variáveis de sistema do Plugin podem não ter efeito nas conexões que já estão no Pool. Por exemplo, modificar o host do servidor LDAP, a porta ou as configurações de TLS não afeta as conexões existentes. No entanto, se os valores originais da variável fossem inválidos e o Pool de conexões não pudesse ser inicializado, o Plugin tentará reiniciar o Pool para a próxima requisição LDAP. Neste caso, os novos valores da variável de sistema serão usados para a tentativa de reinicialização.

  Se [`authentication_ldap_simple_max_pool_size=0`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_max_pool_size) para desabilitar o *pooling*, cada conexão LDAP aberta pelo Plugin usa os valores que as variáveis de sistema possuem naquele momento.

* [`authentication_ldap_simple_log_status`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_log_status)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Para autenticação simple LDAP, o nível de log para mensagens escritas no error log. A tabela a seguir mostra os valores de nível permitidos e seus significados.

  **Tabela 6.22 Níveis de Log para authentication_ldap_simple_log_status**

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

* [`authentication_ldap_simple_max_pool_size`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_max_pool_size)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Para autenticação simple LDAP, o tamanho máximo do Pool de conexões para o servidor LDAP. Para desabilitar o Pool de conexões, defina esta variável como 0.

  Esta variável é usada em conjunto com [`authentication_ldap_simple_init_pool_size`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_init_pool_size). Veja a descrição dessa variável.

* [`authentication_ldap_simple_server_host`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_server_host)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Para autenticação simple LDAP, o host do servidor LDAP. Os valores permitidos para esta variável dependem do método de autenticação:

  + Para [`authentication_ldap_simple_auth_method_name=SIMPLE`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_auth_method_name): O host do servidor LDAP pode ser um nome de host ou endereço IP.

  + Para [`authentication_ldap_simple_auth_method_name=AD-FOREST`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_auth_method_name). O host do servidor LDAP pode ser um nome de domínio do Active Directory. Por exemplo, para uma URL de servidor LDAP de `ldap://example.mem.local:389`, o nome do domínio pode ser `mem.local`.

    Uma configuração de *Active Directory forest* pode ter múltiplos domínios (IPs de servidor LDAP), que podem ser descobertos usando DNS. Em sistemas Unix e semelhantes a Unix, alguma configuração adicional pode ser necessária para configurar seu servidor DNS com registros SRV que especificam os servidores LDAP para o domínio do Active Directory. Para obter informações sobre DNS SRV, consulte [RFC 2782](https://tools.ietf.org/html/rfc2782).

    Suponha que sua configuração tenha estas propriedades:

    - O servidor de nomes que fornece informações sobre domínios do Active Directory tem o endereço IP `10.172.166.100`.

    - Os servidores LDAP têm nomes `ldap1.mem.local` a `ldap3.mem.local` e endereços IP `10.172.166.101` a `10.172.166.103`.

    Você deseja que os servidores LDAP sejam detectáveis usando buscas SRV. Por exemplo, na linha de comando, um comando como este deve listar os servidores LDAP:

    ```sql
    host -t SRV _ldap._tcp.mem.local
    ```

    Execute a configuração de DNS da seguinte forma:

    1. Adicione uma linha a `/etc/resolv.conf` para especificar o servidor de nomes que fornece informações sobre domínios do Active Directory:

       ```sql
       nameserver 10.172.166.100
       ```

    2. Configure o arquivo de zona apropriado para o servidor de nomes com registros SRV para os servidores LDAP:

       ```sql
       _ldap._tcp.mem.local. 86400 IN SRV 0 100 389 ldap1.mem.local.
       _ldap._tcp.mem.local. 86400 IN SRV 0 100 389 ldap2.mem.local.
       _ldap._tcp.mem.local. 86400 IN SRV 0 100 389 ldap3.mem.local.
       ```

    3. Também pode ser necessário especificar o endereço IP para os servidores LDAP em `/etc/hosts` se o host do servidor não puder ser resolvido. Por exemplo, adicione linhas como esta ao arquivo:

       ```sql
       10.172.166.101 ldap1.mem.local
       10.172.166.102 ldap2.mem.local
       10.172.166.103 ldap3.mem.local
       ```

    Com o DNS configurado como descrito acima, o Plugin LDAP do lado do servidor pode descobrir os servidores LDAP e tenta autenticar em todos os domínios até que a autenticação seja bem-sucedida ou não haja mais servidores.

    O Windows não precisa de tais configurações como as descritas. Dado o host do servidor LDAP no valor de [`authentication_ldap_simple_server_host`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_server_host), a biblioteca LDAP do Windows busca em todos os domínios e tenta autenticar.

* [`authentication_ldap_simple_server_port`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_server_port)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Para autenticação simple LDAP, o número da porta TCP/IP do servidor LDAP.

  A partir do MySQL 5.7.25, se o número da porta LDAP for configurado como 636 ou 3269, o Plugin usará LDAPS (LDAP sobre SSL) em vez de LDAP. (LDAPS difere de `startTLS`.)

* [`authentication_ldap_simple_tls`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_tls)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Para autenticação simple LDAP, se as conexões do Plugin com o servidor LDAP são seguras. Se esta variável estiver habilitada, o Plugin usa TLS para se conectar de forma segura ao servidor LDAP. Esta variável pode ser configurada para substituir a configuração OpenLDAP TLS padrão; veja [Autenticação Pluggable LDAP e ldap.conf](ldap-pluggable-authentication.html#ldap-pluggable-authentication-ldap-conf "Autenticação Pluggable LDAP e ldap.conf"). Se você habilitar esta variável, você também pode querer definir a variável [`authentication_ldap_simple_ca_path`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_ca_path).

  Os Plugins LDAP do MySQL suportam o método StartTLS, que inicializa TLS em cima de uma conexão LDAP simples.

  A partir do MySQL 5.7.25, o LDAPS pode ser usado definindo a variável de sistema [`authentication_ldap_simple_server_port`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_server_port).

* [`authentication_ldap_simple_user_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_user_search_attr)

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_root_dn"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--authentication-ldap-sasl-bind-root-dn=value</code></td> </tr><tr><th>Introduzido</th> <td>5.7.19</td> </tr><tr><th>Variável de Sistema</th> <td><code>authentication_ldap_sasl_bind_root_dn</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  Para autenticação simple LDAP, o nome do atributo que especifica nomes de usuário em entradas de diretório LDAP. Se um distinguished name de usuário não for fornecido, o Plugin de autenticação buscará o nome usando este atributo. Por exemplo, se o valor de [`authentication_ldap_simple_user_search_attr`](pluggable-authentication-system-variables.html#sysvar_authentication_ldap_simple_user_search_attr) for `uid`, uma busca pelo nome de usuário `user1` encontrará entradas com um valor `uid` de `user1`.