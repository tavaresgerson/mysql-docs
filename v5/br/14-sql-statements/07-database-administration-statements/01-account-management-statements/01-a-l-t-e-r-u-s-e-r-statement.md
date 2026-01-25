#### 13.7.1.1 Instrução ALTER USER

```sql
ALTER USER [IF EXISTS]
    user [auth_option] [, user [auth_option ...
    [REQUIRE {NONE | tls_option AND] tls_option] ...}]
    [WITH resource_option [resource_option] ...]
    [password_option | lock_option] ...

ALTER USER [IF EXISTS]
    USER() IDENTIFIED BY 'auth_string'

user:
    (see Section 6.2.4, “Specifying Account Names”)

auth_option: {
    IDENTIFIED BY 'auth_string'
  | IDENTIFIED WITH auth_plugin
  | IDENTIFIED WITH auth_plugin BY 'auth_string'
  | IDENTIFIED WITH auth_plugin AS 'auth_string'
}

tls_option: {
   SSL
 | X509
 | CIPHER 'cipher'
 | ISSUER 'issuer'
 | SUBJECT 'subject'
}

resource_option: {
    MAX_QUERIES_PER_HOUR count
  | MAX_UPDATES_PER_HOUR count
  | MAX_CONNECTIONS_PER_HOUR count
  | MAX_USER_CONNECTIONS count
}

password_option: {
    PASSWORD EXPIRE
  | PASSWORD EXPIRE DEFAULT
  | PASSWORD EXPIRE NEVER
  | PASSWORD EXPIRE INTERVAL N DAY
}

lock_option: {
    ACCOUNT LOCK
  | ACCOUNT UNLOCK
}
```

A instrução [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") modifica contas MySQL. Ela permite que propriedades de authentication, SSL/TLS, limite de resource e gerenciamento de password sejam modificadas para contas existentes. Também pode ser usada para Lock e Unlock de contas.

Para usar [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement"), você deve ter o privilégio global [`CREATE USER`](privileges-provided.html#priv_create-user) ou o privilégio [`UPDATE`](privileges-provided.html#priv_update) para o Database de sistema `mysql`. Quando a variável de sistema [`read_only`](server-system-variables.html#sysvar_read_only) estiver habilitada, [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") exige adicionalmente o privilégio [`SUPER`](privileges-provided.html#priv_super).

Por padrão, ocorre um error se você tentar modificar um user que não existe. Se a cláusula `IF EXISTS` for fornecida, a instrução produz um warning para cada user nomeado que não existe, em vez de um error.

Importante

Em algumas circunstâncias, [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") pode ser registrado em logs do Server ou no lado do Client em um arquivo de histórico, como `~/.mysql_history`, o que significa que passwords em cleartext podem ser lidas por qualquer pessoa que tenha acesso de leitura a essa informação. Para obter informações sobre as condições sob as quais isso ocorre para os logs do Server e como controlá-lo, consulte [Seção 6.1.2.3, “Passwords and Logging”](password-logging.html "6.1.2.3 Passwords and Logging"). Para informações semelhantes sobre logging no lado do Client, consulte [Seção 4.5.1.3, “mysql Client Logging”](mysql-logging.html "4.5.1.3 mysql Client Logging").

Existem vários aspectos na instrução [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement"), descritos nos tópicos a seguir:

* [Visão Geral do ALTER USER](alter-user.html#alter-user-overview "ALTER USER Overview")
* [Opções de Authentication do ALTER USER](alter-user.html#alter-user-authentication "ALTER USER Authentication Options")
* [Opções SSL/TLS do ALTER USER](alter-user.html#alter-user-tls "ALTER USER SSL/TLS Options")
* [Opções de Limite de Resource do ALTER USER](alter-user.html#alter-user-resource-limits "ALTER USER Resource-Limit Options")
* [Opções de Gerenciamento de Password do ALTER USER](alter-user.html#alter-user-password-management "ALTER USER Password-Management Options")
* [Opções de Locking de Conta do ALTER USER](alter-user.html#alter-user-account-locking "ALTER USER Account-Locking Options")

##### Visão Geral do ALTER USER

Para cada conta afetada, [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") modifica a linha correspondente na tabela de sistema `mysql.user` para refletir as propriedades especificadas na instrução. Propriedades não especificadas mantêm seus valores atuais.

Cada nome de conta usa o formato descrito na [Seção 6.2.4, “Specifying Account Names”](account-names.html "6.2.4 Specifying Account Names"). A parte do nome do Host da conta, se omitida, assume o padrão `'%'`. Também é possível especificar [`CURRENT_USER`](information-functions.html#function_current-user) ou [`CURRENT_USER()`](information-functions.html#function_current-user) para se referir à conta associada à Session atual.

Em apenas um caso, a conta pode ser especificada com a função [`USER()`](information-functions.html#function_user):

```sql
ALTER USER USER() IDENTIFIED BY 'auth_string';
```

Esta sintaxe permite alterar seu próprio password sem nomear explicitamente sua conta.

Para a sintaxe [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") que permite que um valor *`auth_option`* siga um valor *`user`*, *`auth_option`* indica como a conta autentica, especificando um authentication plugin da conta, credentials (por exemplo, um password) ou ambos. Cada valor *`auth_option`* se aplica *apenas* à conta nomeada imediatamente antes dele.

Após as especificações de *`user`*, a instrução pode incluir opções para propriedades SSL/TLS, limite de resource, gerenciamento de password e locking. Todas essas opções são *globais* para a instrução e se aplicam a *todas* as contas nomeadas na instrução.

Exemplo: Altera o password de uma conta e o expira. Como resultado, o user deve se conectar com o password nomeado e escolher um novo na próxima connection:

```sql
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED BY 'new_password' PASSWORD EXPIRE;
```

Exemplo: Modifica uma conta para usar o authentication plugin `sha256_password` e o password fornecido. Exige que um novo password seja escolhido a cada 180 dias:

```sql
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED WITH sha256_password BY 'new_password'
  PASSWORD EXPIRE INTERVAL 180 DAY;
```

Exemplo: Lock ou Unlock de uma conta:

```sql
ALTER USER 'jeffrey'@'localhost' ACCOUNT LOCK;
ALTER USER 'jeffrey'@'localhost' ACCOUNT UNLOCK;
```

Exemplo: Exige que uma conta se conecte usando SSL e estabelece um limite de 20 connections por hora:

```sql
ALTER USER 'jeffrey'@'localhost'
  REQUIRE SSL WITH MAX_CONNECTIONS_PER_HOUR 20;
```

Exemplo: Altera múltiplas contas, especificando algumas propriedades por conta e algumas propriedades globais:

```sql
ALTER USER
  'jeffrey'@'localhost' IDENTIFIED BY 'new_password',
  'jeanne'@'localhost'
  REQUIRE SSL WITH MAX_USER_CONNECTIONS 2;
```

O valor `IDENTIFIED BY` que segue `jeffrey` se aplica apenas à conta imediatamente anterior a ele, então ele altera o password para `'jeffrey_new_password'` apenas para `jeffrey`. Para `jeanne`, não há valor por conta (assim, deixando o password inalterado).

As propriedades restantes se aplicam globalmente a todas as contas nomeadas na instrução, então, para ambas as contas:

* As Connections são obrigadas a usar SSL.
* A conta pode ser usada para um máximo de duas Connections simultâneas.

Na ausência de um tipo particular de opção, a conta permanece inalterada nesse aspecto. Por exemplo, sem uma opção de locking, o estado de locking da conta não é alterado.

##### Opções de Authentication do ALTER USER

Um nome de conta pode ser seguido por uma opção de authentication *`auth_option`* que especifica o authentication plugin da conta, credentials, ou ambos:

* *`auth_plugin`* nomeia um authentication plugin. O nome do plugin pode ser um string literal entre aspas ou um nome sem aspas. Os nomes dos Plugins são armazenados na coluna `plugin` da tabela de sistema `mysql.user`.

  Para a sintaxe *`auth_option`* que não especifica um authentication plugin, o default plugin é indicado pelo valor da variável de sistema [`default_authentication_plugin`](server-system-variables.html#sysvar_default_authentication_plugin). Para descrições de cada plugin, consulte [Seção 6.4.1, “Authentication Plugins”](authentication-plugins.html "6.4.1 Authentication Plugins").

* Credentials são armazenadas na tabela de sistema `mysql.user`. Um valor `'auth_string'` especifica credentials da conta, seja como um string (não criptografada) em cleartext ou Hashed no formato esperado pelo authentication plugin associado à conta, respectivamente:

  + Para a sintaxe que usa `BY 'auth_string'`, a string é cleartext e é passada para o authentication plugin para possível hashing. O resultado retornado pelo plugin é armazenado na tabela `mysql.user`. Um plugin pode usar o valor conforme especificado, caso em que nenhum hashing ocorre.

  + Para a sintaxe que usa `AS 'auth_string'`, presume-se que a string já esteja no formato que o authentication plugin exige, e é armazenada como está na tabela `mysql.user`. Se um plugin exigir um valor Hashed, o valor já deve estar Hashed em um formato apropriado para o plugin, ou o valor não poderá ser usado pelo plugin e a authentication correta das Connections Client não poderá ocorrer.

  + Se um authentication plugin não realizar hashing da string de authentication, as cláusulas `BY 'auth_string'` e `AS 'auth_string'` terão o mesmo efeito: A string de authentication é armazenada como está na tabela de sistema `mysql.user`.

[`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") permite estas sintaxes *`auth_option`*:

* `IDENTIFIED BY 'auth_string'`

  Define o authentication plugin da conta para o default plugin, passa o valor `'auth_string'` em cleartext para o plugin para possível hashing e armazena o resultado na linha da conta na tabela de sistema `mysql.user`.

* `IDENTIFIED WITH auth_plugin`

  Define o authentication plugin da conta para *`auth_plugin`*, limpa as credentials para a string vazia (as credentials estão associadas ao authentication plugin antigo, não ao novo) e armazena o resultado na linha da conta na tabela de sistema `mysql.user`.

  Além disso, o password é marcado como expired (expirado). O user deve escolher um novo ao se conectar novamente.

* `IDENTIFIED WITH auth_plugin BY 'auth_string'`

  Define o authentication plugin da conta para *`auth_plugin`*, passa o valor `'auth_string'` em cleartext para o plugin para possível hashing e armazena o resultado na linha da conta na tabela de sistema `mysql.user`.

* `IDENTIFIED WITH auth_plugin AS 'auth_string'`

  Define o authentication plugin da conta para *`auth_plugin`* e armazena o valor `'auth_string'` como está na linha da conta `mysql.user`. Se o plugin exigir uma string Hashed, presume-se que a string já esteja Hashed no formato que o plugin exige.

Exemplo: Especifica o password como cleartext; o default plugin é usado:

```sql
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED BY 'password';
```

Exemplo: Especifica o authentication plugin, juntamente com um valor de password em cleartext:

```sql
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED WITH mysql_native_password
             BY 'password';
```

Exemplo: Especifica o authentication plugin, juntamente com um valor de password Hashed:

```sql
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED WITH mysql_native_password
             AS '*6C8989366EAF75BB670AD8EA7A7FC1176A95CEF4';
```

Para informações adicionais sobre a definição de passwords e authentication plugins, consulte [Seção 6.2.10, “Assigning Account Passwords”](assigning-passwords.html "6.2.10 Assigning Account Passwords") e [Seção 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication").

##### Opções SSL/TLS do ALTER USER

O MySQL pode verificar atributos de certificado X.509, além da authentication usual baseada no nome de user e credentials. Para informações básicas sobre o uso de SSL/TLS com MySQL, consulte [Seção 6.3, “Using Encrypted Connections”](encrypted-connections.html "6.3 Using Encrypted Connections").

Para especificar opções relacionadas a SSL/TLS para uma conta MySQL, use uma cláusula `REQUIRE` que especifique um ou mais valores *`tls_option`*.

A ordem das opções `REQUIRE` não importa, mas nenhuma opção pode ser especificada duas vezes. A palavra-chave `AND` é opcional entre as opções `REQUIRE`.

[`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") permite estes valores *`tls_option`*:

* `NONE`

  Indica que todas as contas nomeadas pela instrução não têm requisitos SSL ou X.509. Conexões não criptografadas são permitidas se o nome de user e o password forem válidos. Conexões criptografadas podem ser usadas, a critério do Client, se o Client tiver os arquivos de certificado e key apropriados.

  ```sql
  ALTER USER 'jeffrey'@'localhost' REQUIRE NONE;
  ```

  Os Clients tentam estabelecer uma conexão segura por padrão. Para Clients que têm `REQUIRE NONE`, a tentativa de connection retorna a uma conexão não criptografada se uma conexão segura não puder ser estabelecida. Para exigir uma conexão criptografada, um Client precisa especificar apenas a opção [`--ssl-mode=REQUIRED`](connection-options.html#option_general_ssl-mode); a tentativa de connection falha se uma conexão segura não puder ser estabelecida.

* `SSL`

  Informa ao Server para permitir apenas conexões criptografadas para todas as contas nomeadas pela instrução.

  ```sql
  ALTER USER 'jeffrey'@'localhost' REQUIRE SSL;
  ```

  Os Clients tentam estabelecer uma conexão segura por padrão. Para contas que têm `REQUIRE SSL`, a tentativa de connection falha se uma conexão segura não puder ser estabelecida.

* `X509`

  Para todas as contas nomeadas pela instrução, exige que os Clients apresentem um certificado válido, mas o certificado exato, issuer e subject não importam. O único requisito é que seja possível verificar sua signature com um dos certificados CA. O uso de certificados X.509 sempre implica em criptografia, então a opção `SSL` é desnecessária neste caso.

  ```sql
  ALTER USER 'jeffrey'@'localhost' REQUIRE X509;
  ```

  Para contas com `REQUIRE X509`, os Clients devem especificar as opções [`--ssl-key`](connection-options.html#option_general_ssl-key) e [`--ssl-cert`](connection-options.html#option_general_ssl-cert) para se conectar. (É recomendável, mas não obrigatório, que [`--ssl-ca`](connection-options.html#option_general_ssl-ca) também seja especificado para que o certificado público fornecido pelo Server possa ser verificado.) Isso também é verdade para `ISSUER` e `SUBJECT` porque essas opções `REQUIRE` implicam nos requisitos de `X509`.

* `ISSUER 'issuer'`

  Para todas as contas nomeadas pela instrução, exige que os Clients apresentem um certificado X.509 válido emitido pelo CA `'issuer'`. Se um Client apresentar um certificado que é válido, mas tem um issuer diferente, o Server rejeita a connection. O uso de certificados X.509 sempre implica em criptografia, então a opção `SSL` é desnecessária neste caso.

  ```sql
  ALTER USER 'jeffrey'@'localhost'
    REQUIRE ISSUER '/C=SE/ST=Stockholm/L=Stockholm/
      O=MySQL/CN=CA/emailAddress=ca@example.com';
  ```

  Como `ISSUER` implica nos requisitos de `X509`, os Clients devem especificar as opções [`--ssl-key`](connection-options.html#option_general_ssl-key) e [`--ssl-cert`](connection-options.html#option_general_ssl-cert) para se conectar. (É recomendável, mas não obrigatório, que [`--ssl-ca`](connection-options.html#option_general_ssl-ca) também seja especificado para que o certificado público fornecido pelo Server possa ser verificado.)

* `SUBJECT 'subject'`

  Para todas as contas nomeadas pela instrução, exige que os Clients apresentem um certificado X.509 válido contendo o subject *`subject`*. Se um Client apresentar um certificado que é válido, mas tem um subject diferente, o Server rejeita a connection. O uso de certificados X.509 sempre implica em criptografia, então a opção `SSL` é desnecessária neste caso.

  ```sql
  ALTER USER 'jeffrey'@'localhost'
    REQUIRE SUBJECT '/C=SE/ST=Stockholm/L=Stockholm/
      O=MySQL demo client certificate/
      CN=client/emailAddress=client@example.com';
  ```

  O MySQL realiza uma simples comparação de string do valor `'subject'` com o valor no certificado, portanto, a capitalização e a ordem dos componentes devem ser fornecidas exatamente como presentes no certificado.

  Como `SUBJECT` implica nos requisitos de `X509`, os Clients devem especificar as opções [`--ssl-key`](connection-options.html#option_general_ssl-key) e [`--ssl-cert`](connection-options.html#option_general_ssl-cert) para se conectar. (É recomendável, mas não obrigatório, que [`--ssl-ca`](connection-options.html#option_general_ssl-ca) também seja especificado para que o certificado público fornecido pelo Server possa ser verificado.)

* `CIPHER 'cipher'`

  Para todas as contas nomeadas pela instrução, exige um método Cipher específico para criptografar Connections. Esta opção é necessária para garantir que Ciphers e key lengths de força suficiente sejam usados. A criptografia pode ser fraca se forem usados algoritmos antigos que utilizam short encryption keys.

  ```sql
  ALTER USER 'jeffrey'@'localhost'
    REQUIRE CIPHER 'EDH-RSA-DES-CBC3-SHA';
  ```

As opções `SUBJECT`, `ISSUER` e `CIPHER` podem ser combinadas na cláusula `REQUIRE`:

```sql
ALTER USER 'jeffrey'@'localhost'
  REQUIRE SUBJECT '/C=SE/ST=Stockholm/L=Stockholm/
    O=MySQL demo client certificate/
    CN=client/emailAddress=client@example.com'
  AND ISSUER '/C=SE/ST=Stockholm/L=Stockholm/
    O=MySQL/CN=CA/emailAddress=ca@example.com'
  AND CIPHER 'EDH-RSA-DES-CBC3-SHA';
```

##### Opções de Limite de Resource do ALTER USER

É possível impor limites ao uso de resources do Server por uma conta, conforme discutido na [Seção 6.2.16, “Setting Account Resource Limits”](user-resources.html "6.2.16 Setting Account Resource Limits"). Para fazer isso, use uma cláusula `WITH` que especifique um ou mais valores *`resource_option`*.

A ordem das opções `WITH` não importa, exceto que, se um determinado limite de resource for especificado várias vezes, a última instância terá precedência.

[`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") permite estes valores *`resource_option`*:

* `MAX_QUERIES_PER_HOUR count`, `MAX_UPDATES_PER_HOUR count`, `MAX_CONNECTIONS_PER_HOUR count`

  Para todas as contas nomeadas pela instrução, essas opções restringem quantas Queries, Updates e Connections ao Server são permitidas a cada conta durante um determinado período de uma hora. (Queries cujos resultados são servidos a partir do Query Cache não contam para o limite `MAX_QUERIES_PER_HOUR`.) Se *`count`* for `0` (o padrão), isso significa que não há limitação para a conta.

* `MAX_USER_CONNECTIONS count`

  Para todas as contas nomeadas pela instrução, restringe o número máximo de Connections simultâneas ao Server por cada conta. Um *`count`* diferente de zero especifica o limite para a conta explicitamente. Se *`count`* for `0` (o padrão), o Server determina o número de Connections simultâneas para a conta a partir do valor global da variável de sistema [`max_user_connections`](server-system-variables.html#sysvar_max_user_connections). Se [`max_user_connections`](server-system-variables.html#sysvar_max_user_connections) também for zero, não há limite para a conta.

Exemplo:

```sql
ALTER USER 'jeffrey'@'localhost'
  WITH MAX_QUERIES_PER_HOUR 500 MAX_UPDATES_PER_HOUR 100;
```

##### Opções de Gerenciamento de Password do ALTER USER

[`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") suporta vários valores *`password_option`* para gerenciamento de expiration de password, para expirar manualmente um password de conta ou estabelecer sua política de expiration de password. As opções de política não expiram o password. Em vez disso, elas determinam como o Server aplica a expiration automática à conta com base na idade do password da conta. Para uma determinada conta, a idade do password é avaliada a partir da data e hora da alteração mais recente do password.

Esta seção descreve a sintaxe para opções de gerenciamento de password. Para obter informações sobre o estabelecimento de políticas para gerenciamento de password, consulte [Seção 6.2.11, “Password Management”](password-management.html "6.2.11 Password Management").

Se múltiplas opções de gerenciamento de password forem especificadas, a última terá precedência.

Essas opções se aplicam apenas a contas que usam um authentication plugin que armazena credentials internamente no MySQL. Para contas que usam um plugin que realiza authentication contra um sistema de credentials externo ao MySQL, o gerenciamento de password deve ser tratado externamente contra esse sistema também. Para obter mais informações sobre o armazenamento interno de credentials, consulte [Seção 6.2.11, “Password Management”](password-management.html "6.2.11 Password Management").

Uma Session Client opera em modo restrito se o password da conta foi expirado manualmente ou se a idade do password for considerada maior do que seu tempo de vida permitido pela política de expiration automática. No modo restrito, as operações realizadas dentro da Session resultam em um error até que o user estabeleça um novo password de conta. Para obter informações sobre o modo restrito, consulte [Seção 6.2.12, “Server Handling of Expired Passwords”](expired-password-handling.html "6.2.12 Server Handling of Expired Passwords").

Nota

Embora seja possível "resetar" um password expirado definindo-o para seu valor atual, é preferível, como uma questão de boa política, escolher um password diferente.

[`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") permite estes valores *`password_option`* para controlar a expiration de password:

* `PASSWORD EXPIRE`

  Marca imediatamente o password como expired (expirado) para todas as contas nomeadas pela instrução.

  ```sql
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE;
  ```

* `PASSWORD EXPIRE DEFAULT`

  Define todas as contas nomeadas pela instrução para que a política de expiration global se aplique, conforme especificado pela variável de sistema [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime).

  ```sql
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE DEFAULT;
  ```

* `PASSWORD EXPIRE NEVER`

  Esta opção de expiration sobrescreve a política global para todas as contas nomeadas pela instrução. Para cada uma, desabilita a expiration de password para que ele nunca expire.

  ```sql
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE NEVER;
  ```

* `PASSWORD EXPIRE INTERVAL N DAY`

  Esta opção de expiration sobrescreve a política global para todas as contas nomeadas pela instrução. Para cada uma, define o tempo de vida do password para *`N`* days. A instrução a seguir exige que o password seja alterado a cada 180 dias:

  ```sql
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE INTERVAL 180 DAY;
  ```

##### Opções de Locking de Conta do ALTER USER

O MySQL suporta locking e unlocking de contas usando as opções `ACCOUNT LOCK` e `ACCOUNT UNLOCK`, que especificam o estado de locking para uma conta. Para discussão adicional, consulte [Seção 6.2.15, “Account Locking”](account-locking.html "6.2.15 Account Locking").

Se múltiplas opções de locking de conta forem especificadas, a última terá precedência.