#### 13.7.1.2 Instrução CREATE USER

```sql
CREATE USER [IF NOT EXISTS]
    user [auth_option] [, user [auth_option ...
    [REQUIRE {NONE | tls_option AND] tls_option] ...}]
    [WITH resource_option [resource_option] ...]
    [password_option | lock_option] ...

user:
    (see Section 6.2.4, “Specifying Account Names”)

auth_option: {
    IDENTIFIED BY 'auth_string'
  | IDENTIFIED WITH auth_plugin
  | IDENTIFIED WITH auth_plugin BY 'auth_string'
  | IDENTIFIED WITH auth_plugin AS 'auth_string'
  | IDENTIFIED BY PASSWORD 'auth_string'
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

A instrução [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") cria novas contas MySQL. Ela permite que propriedades de authentication, SSL/TLS, limite de recursos e gerenciamento de password sejam estabelecidas para novas contas, e controla se as contas são inicialmente locked ou unlocked.

Para usar [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), você deve ter o privilege global [`CREATE USER`](privileges-provided.html#priv_create-user), ou o privilege [`INSERT`](privileges-provided.html#priv_insert) para o database de sistema `mysql`. Quando a System Variable [`read_only`](server-system-variables.html#sysvar_read_only) está habilitada, [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") requer adicionalmente o privilege [`SUPER`](privileges-provided.html#priv_super).

Ocorre um erro se você tentar criar uma conta que já existe. Se a cláusula `IF NOT EXISTS` for fornecida, a instrução gera um warning para cada conta nomeada que já existe, em vez de um error.

Importante

Em algumas circunstâncias, [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") pode ser registrado nos logs do server ou no lado do client em um arquivo de histórico como `~/.mysql_history`, o que significa que passwords em texto simples (cleartext) podem ser lidas por qualquer pessoa que tenha acesso de leitura a essa informação. Para obter informações sobre as condições sob as quais isso ocorre nos logs do server e como controlá-lo, consulte [Seção 6.1.2.3, “Passwords e Logging”](password-logging.html "6.1.2.3 Passwords and Logging"). Para obter informações semelhantes sobre o logging do lado do client, consulte [Seção 4.5.1.3, “Logging do Cliente mysql”](mysql-logging.html "4.5.1.3 mysql Client Logging").

Há vários aspectos na instrução [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), descritos nos tópicos a seguir:

* [Visão Geral do CREATE USER](create-user.html#create-user-overview "CREATE USER Overview")
* [Opções de Authentication do CREATE USER](create-user.html#create-user-authentication "CREATE USER Authentication Options")
* [Opções SSL/TLS do CREATE USER](create-user.html#create-user-tls "CREATE USER SSL/TLS Options")
* [Opções de Limite de Recursos do CREATE USER](create-user.html#create-user-resource-limits "CREATE USER Resource-Limit Options")
* [Opções de Gerenciamento de Password do CREATE USER](create-user.html#create-user-password-management "CREATE USER Password-Management Options")
* [Opções de Account-Locking do CREATE USER](create-user.html#create-user-account-locking "CREATE USER Account-Locking Options")

##### Visão Geral do CREATE USER

Para cada conta, [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") cria uma nova linha na System Table `mysql.user`. A linha da conta reflete as propriedades especificadas na instrução. Propriedades não especificadas são definidas com seus valores default:

* Authentication: O authentication plugin definido pela System Variable [`default_authentication_plugin`](server-system-variables.html#sysvar_default_authentication_plugin), e credenciais vazias
* SSL/TLS: `NONE`
* Limites de recursos: Ilimitado
* Gerenciamento de password: `PASSWORD EXPIRE DEFAULT`
* Account locking: `ACCOUNT UNLOCK`

Uma conta, quando criada pela primeira vez, não possui privileges. Para atribuir privileges a esta conta, use uma ou mais instruções [`GRANT`](grant.html "13.7.1.4 GRANT Statement").

Cada nome de conta usa o formato descrito na [Seção 6.2.4, “Especificando Nomes de Conta”](account-names.html "6.2.4 Specifying Account Names"). Por exemplo:

```sql
CREATE USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
```

A parte do nome do host do nome da conta, se omitida, assume o default para `'%'`.

Cada valor *`user`* que nomeia uma conta pode ser seguido por um valor opcional *`auth_option`* que indica como a conta se autentica. Esses valores permitem que authentication plugins e credenciais da conta (por exemplo, um password) sejam especificados. Cada valor *`auth_option`* se aplica *apenas* à conta nomeada imediatamente antes dele.

Seguindo as especificações *`user`*, a instrução pode incluir opções para propriedades de SSL/TLS, limite de recursos, gerenciamento de password e locking. Todas essas opções são *globais* para a instrução e se aplicam a *todas* as contas nomeadas na instrução.

Exemplo: Cria uma conta que usa o authentication plugin default e o password fornecido. Marca o password como expirado para que o user deva escolher um novo na primeira conexão ao server:

```sql
CREATE USER 'jeffrey'@'localhost'
  IDENTIFIED BY 'new_password' PASSWORD EXPIRE;
```

Exemplo: Cria uma conta que usa o authentication plugin `sha256_password` e o password fornecido. Requer que um novo password seja escolhido a cada 180 dias:

```sql
CREATE USER 'jeffrey'@'localhost'
  IDENTIFIED WITH sha256_password BY 'new_password'
  PASSWORD EXPIRE INTERVAL 180 DAY;
```

Exemplo: Cria múltiplas contas, especificando algumas propriedades por conta e algumas propriedades globais:

```sql
CREATE USER
  'jeffrey'@'localhost' IDENTIFIED WITH mysql_native_password
                                   BY 'new_password1',
  'jeanne'@'localhost' IDENTIFIED WITH sha256_password
                                  BY 'new_password2'
  REQUIRE X509 WITH MAX_QUERIES_PER_HOUR 60
  ACCOUNT LOCK;
```

Cada valor *`auth_option`* (`IDENTIFIED WITH ... BY` neste caso) aplica-se apenas à conta nomeada imediatamente antes dele, portanto, cada conta usa o authentication plugin e o password que o seguem imediatamente.

As propriedades restantes aplicam-se globalmente a todas as contas nomeadas na instrução, de modo que para ambas as contas:

* As conexões devem ser feitas usando um certificado X.509 válido.
* São permitidas até 60 Queries por hora.
* A conta está inicialmente locked, portanto, é efetivamente um placeholder e não pode ser usada até que um administrator a desbloqueie.

##### Opções de Authentication do CREATE USER

Um nome de conta pode ser seguido por uma opção de authentication *`auth_option`* que especifica o authentication plugin da conta, credenciais ou ambos:

* *`auth_plugin`* nomeia um authentication plugin. O nome do plugin pode ser um literal de string entre aspas ou um nome sem aspas. Os nomes dos plugins são armazenados na coluna `plugin` da System Table `mysql.user`.

  Para a sintaxe *`auth_option`* que não especifica um authentication plugin, o plugin default é indicado pelo valor da System Variable [`default_authentication_plugin`](server-system-variables.html#sysvar_default_authentication_plugin). Para descrições de cada plugin, consulte [Seção 6.4.1, “Authentication Plugins”](authentication-plugins.html "6.4.1 Authentication Plugins").

* As credenciais são armazenadas na System Table `mysql.user`. Um valor `'auth_string'` especifica as credenciais da conta, seja como um string cleartext (não criptografado) ou hashed no formato esperado pelo authentication plugin associado à conta, respectivamente:

  + Para a sintaxe que usa `BY 'auth_string'`, o string é cleartext e é passado para o authentication plugin para possível hashing. O resultado retornado pelo plugin é armazenado na tabela `mysql.user`. Um plugin pode usar o valor conforme especificado, caso em que não ocorre hashing.

  + Para a sintaxe que usa `AS 'auth_string'`, o string é assumido como já estando no formato que o authentication plugin requer, e é armazenado como está na tabela `mysql.user`. Se um plugin requer um valor hashed, o valor deve estar previamente hashed em um formato apropriado para o plugin, ou o valor não poderá ser usado pelo plugin e a authentication correta das conexões client não poderá ocorrer.

  + Se um authentication plugin não realizar hashing do string de authentication, as cláusulas `BY 'auth_string'` e `AS 'auth_string'` terão o mesmo efeito: O string de authentication é armazenado como está na System Table `mysql.user`.

[`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") permite estas sintaxes *`auth_option`*:

* `IDENTIFIED BY 'auth_string'`

  Define o authentication plugin da conta para o plugin default, passa o valor cleartext `'auth_string'` para o plugin para possível hashing e armazena o resultado na linha da conta na System Table `mysql.user`.

* `IDENTIFIED WITH auth_plugin`

  Define o authentication plugin da conta para *`auth_plugin`*, limpa as credenciais para o string vazio e armazena o resultado na linha da conta na System Table `mysql.user`.

* `IDENTIFIED WITH auth_plugin BY 'auth_string'`

  Define o authentication plugin da conta para *`auth_plugin`*, passa o valor cleartext `'auth_string'` para o plugin para possível hashing e armazena o resultado na linha da conta na System Table `mysql.user`.

* `IDENTIFIED WITH auth_plugin AS 'auth_string'`

  Define o authentication plugin da conta para *`auth_plugin`* e armazena o valor `'auth_string'` como está na linha da conta `mysql.user`. Se o plugin requer um string hashed, o string é assumido como já hashed no formato que o plugin requer.

* `IDENTIFIED BY PASSWORD 'auth_string'`

  Define o authentication plugin da conta para o plugin default e armazena o valor `'auth_string'` como está na linha da conta `mysql.user`. Se o plugin requer um string hashed, o string é assumido como já hashed no formato que o plugin requer.

  Note

  A sintaxe `IDENTIFIED BY PASSWORD` está deprecated; espere que ela seja removida em um futuro release do MySQL.

Exemplo: Especificar o password como cleartext; o plugin default é usado:

```sql
CREATE USER 'jeffrey'@'localhost'
  IDENTIFIED BY 'password';
```

Exemplo: Especificar o authentication plugin, juntamente com um valor de password cleartext:

```sql
CREATE USER 'jeffrey'@'localhost'
  IDENTIFIED WITH mysql_native_password BY 'password';
```

Em cada caso, o valor do password armazenado na linha da conta é o valor cleartext `'password'` depois de ter sido hashed pelo authentication plugin associado à conta.

Para informações adicionais sobre a definição de passwords e authentication plugins, consulte [Seção 6.2.10, “Atribuindo Account Passwords”](assigning-passwords.html "6.2.10 Assigning Account Passwords") e [Seção 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication").

##### Opções SSL/TLS do CREATE USER

O MySQL pode verificar atributos de certificado X.509, além da authentication usual baseada no nome de user e nas credenciais. Para informações básicas sobre o uso de SSL/TLS com MySQL, consulte [Seção 6.3, “Usando Conexões Criptografadas”](encrypted-connections.html "6.3 Using Encrypted Connections").

Para especificar opções relacionadas a SSL/TLS para uma conta MySQL, use uma cláusula `REQUIRE` que especifique um ou mais valores *`tls_option`*.

A ordem das opções `REQUIRE` não importa, mas nenhuma opção pode ser especificada duas vezes. A palavra-chave `AND` é opcional entre as opções `REQUIRE`.

[`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") permite estes valores *`tls_option`*:

* `NONE`

  Indica que todas as contas nomeadas pela instrução não têm requisitos de SSL ou X.509. Conexões não criptografadas são permitidas se o nome de user e o password forem válidos. Conexões criptografadas podem ser usadas, a critério do client, se o client tiver os arquivos de certificado e Key apropriados.

  ```sql
  CREATE USER 'jeffrey'@'localhost' REQUIRE NONE;
  ```

  Os Clients tentam estabelecer uma conexão segura por default. Para clients que têm `REQUIRE NONE`, a tentativa de conexão reverte para uma conexão não criptografada se uma conexão segura não puder ser estabelecida. Para exigir uma conexão criptografada, um client precisa especificar apenas a opção [`--ssl-mode=REQUIRED`](connection-options.html#option_general_ssl-mode); a tentativa de conexão falhará se uma conexão segura não puder ser estabelecida.

  `NONE` é o default se nenhuma opção `REQUIRE` relacionada a SSL for especificada.

* `SSL`

  Informa ao server para permitir apenas conexões criptografadas para todas as contas nomeadas pela instrução.

  ```sql
  CREATE USER 'jeffrey'@'localhost' REQUIRE SSL;
  ```

  Os Clients tentam estabelecer uma conexão segura por default. Para contas que têm `REQUIRE SSL`, a tentativa de conexão falhará se uma conexão segura não puder ser estabelecida.

* `X509`

  Para todas as contas nomeadas pela instrução, requer que os clients apresentem um certificado válido, mas o certificado exato, o issuer e o subject não importam. O único requisito é que seja possível verificar sua signature com um dos certificados CA. O uso de certificados X.509 sempre implica encryption, portanto, a opção `SSL` é desnecessária neste caso.

  ```sql
  CREATE USER 'jeffrey'@'localhost' REQUIRE X509;
  ```

  Para contas com `REQUIRE X509`, os clients devem especificar as opções [`--ssl-key`](connection-options.html#option_general_ssl-key) e [`--ssl-cert`](connection-options.html#option_general_ssl-cert) para se conectar. (É recomendado, mas não obrigatório, que [`--ssl-ca`](connection-options.html#option_general_ssl-ca) também seja especificado para que o certificado público fornecido pelo server possa ser verificado.) Isso também é verdade para `ISSUER` e `SUBJECT`, porque essas opções `REQUIRE` implicam os requisitos de `X509`.

* `ISSUER 'issuer'`

  Para todas as contas nomeadas pela instrução, exige que os clients apresentem um certificado X.509 válido emitido por CA *`'issuer'`*. Se um client apresentar um certificado válido, mas com um issuer diferente, o server rejeita a conexão. O uso de certificados X.509 sempre implica encryption, portanto, a opção `SSL` é desnecessária neste caso.

  ```sql
  CREATE USER 'jeffrey'@'localhost'
    REQUIRE ISSUER '/C=SE/ST=Stockholm/L=Stockholm/
      O=MySQL/CN=CA/emailAddress=ca@example.com';
  ```

  Como `ISSUER` implica os requisitos de `X509`, os clients devem especificar as opções [`--ssl-key`](connection-options.html#option_general_ssl-key) e [`--ssl-cert`](connection-options.html#option_general_ssl-cert) para se conectar. (É recomendado, mas não obrigatório, que [`--ssl-ca`](connection-options.html#option_general_ssl-ca) também seja especificado para que o certificado público fornecido pelo server possa ser verificado.)

* `SUBJECT 'subject'`

  Para todas as contas nomeadas pela instrução, exige que os clients apresentem um certificado X.509 válido contendo o subject *`subject`*. Se um client apresentar um certificado válido, mas com um subject diferente, o server rejeita a conexão. O uso de certificados X.509 sempre implica encryption, portanto, a opção `SSL` é desnecessária neste caso.

  ```sql
  CREATE USER 'jeffrey'@'localhost'
    REQUIRE SUBJECT '/C=SE/ST=Stockholm/L=Stockholm/
      O=MySQL demo client certificate/
      CN=client/emailAddress=client@example.com';
  ```

  O MySQL faz uma comparação de string simples do valor `'subject'` com o valor no certificado, portanto, a caixa das letras (lettercase) e a ordem dos componentes devem ser fornecidas exatamente como presentes no certificado.

  Como `SUBJECT` implica os requisitos de `X509`, os clients devem especificar as opções [`--ssl-key`](connection-options.html#option_general_ssl-key) e [`--ssl-cert`](connection-options.html#option_general_ssl-cert) para se conectar. (É recomendado, mas não obrigatório, que [`--ssl-ca`](connection-options.html#option_general_ssl-ca) também seja especificado para que o certificado público fornecido pelo server possa ser verificado.)

* `CIPHER 'cipher'`

  Para todas as contas nomeadas pela instrução, requer um método Cipher específico para criptografar conexões. Esta opção é necessária para garantir que Ciphers e Key lengths de força suficiente sejam usados. A encryption pode ser fraca se forem usados algoritmos antigos que utilizam Key lengths curtos.

  ```sql
  CREATE USER 'jeffrey'@'localhost'
    REQUIRE CIPHER 'EDH-RSA-DES-CBC3-SHA';
  ```

As opções `SUBJECT`, `ISSUER` e `CIPHER` podem ser combinadas na cláusula `REQUIRE`:

```sql
CREATE USER 'jeffrey'@'localhost'
  REQUIRE SUBJECT '/C=SE/ST=Stockholm/L=Stockholm/
    O=MySQL demo client certificate/
    CN=client/emailAddress=client@example.com'
  AND ISSUER '/C=SE/ST=Stockholm/L=Stockholm/
    O=MySQL/CN=CA/emailAddress=ca@example.com'
  AND CIPHER 'EDH-RSA-DES-CBC3-SHA';
```

##### Opções de Limite de Recursos do CREATE USER

É possível estabelecer limites para o uso de recursos do server por uma conta, conforme discutido na [Seção 6.2.16, “Definindo Limites de Recursos da Conta”](user-resources.html "6.2.16 Setting Account Resource Limits"). Para fazer isso, use uma cláusula `WITH` que especifique um ou mais valores *`resource_option`*.

A ordem das opções `WITH` não importa, exceto que, se um determinado limite de recurso for especificado várias vezes, a última instância terá precedência.

[`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") permite estes valores *`resource_option`*:

* `MAX_QUERIES_PER_HOUR count`, `MAX_UPDATES_PER_HOUR count`, `MAX_CONNECTIONS_PER_HOUR count`

  Para todas as contas nomeadas pela instrução, estas opções restringem o número de Queries, Updates e conexões ao server permitidos para cada conta durante um determinado período de uma hora. (Queries cujos resultados são servidos a partir do Query Cache não contam para o limite `MAX_QUERIES_PER_HOUR`.) Se *`count`* for `0` (o default), isso significa que não há limitação para a conta.

* `MAX_USER_CONNECTIONS count`

  Para todas as contas nomeadas pela instrução, restringe o número máximo de conexões simultâneas ao server por cada conta. Um *`count`* diferente de zero especifica o limite para a conta explicitamente. Se *`count`* for `0` (o default), o server determina o número de conexões simultâneas para a conta a partir do valor global da System Variable [`max_user_connections`](server-system-variables.html#sysvar_max_user_connections). Se [`max_user_connections`](server-system-variables.html#sysvar_max_user_connections) também for zero, não há limite para a conta.

Exemplo:

```sql
CREATE USER 'jeffrey'@'localhost'
  WITH MAX_QUERIES_PER_HOUR 500 MAX_UPDATES_PER_HOUR 100;
```

##### Opções de Gerenciamento de Password do CREATE USER

Os account passwords têm uma idade, avaliada a partir da data e hora da alteração mais recente do password.

[`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") suporta vários valores *`password_option`* para gerenciamento de expiração de password, para expirar um password de conta manualmente ou estabelecer sua política de expiração de password. As opções de política não expiram o password. Em vez disso, elas determinam como o server aplica a expiração automática à conta com base na idade do password da conta. Para uma determinada conta, a idade do seu password é avaliada a partir da data e hora da alteração de password mais recente.

Esta seção descreve a sintaxe para opções de gerenciamento de password. Para obter informações sobre o estabelecimento de políticas para gerenciamento de password, consulte [Seção 6.2.11, “Gerenciamento de Password”](password-management.html "6.2.11 Password Management").

Se várias opções de gerenciamento de password forem especificadas, a última terá precedência.

Estas opções se aplicam apenas a contas que usam um authentication plugin que armazena credenciais internamente no MySQL. Para contas que usam um plugin que executa a authentication em um sistema de credenciais externo ao MySQL, o gerenciamento de password também deve ser tratado externamente contra esse sistema. Para obter mais informações sobre o armazenamento interno de credenciais, consulte [Seção 6.2.11, “Gerenciamento de Password”](password-management.html "6.2.11 Password Management").

Uma sessão client opera em restricted mode se o password da conta tiver expirado manualmente ou se a idade do password for considerada maior do que sua vida útil permitida de acordo com a política de expiração automática. No restricted mode, as operações realizadas na sessão resultam em um error até que o user estabeleça um novo account password. Para obter informações sobre restricted mode, consulte [Seção 6.2.12, “Tratamento de Passwords Expirados pelo Server”](expired-password-handling.html "6.2.12 Server Handling of Expired Passwords").

[`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") permite estes valores *`password_option`* para controlar a expiração de password:

* `PASSWORD EXPIRE`

  Marca imediatamente o password como expirado para todas as contas nomeadas pela instrução.

  ```sql
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE;
  ```

* `PASSWORD EXPIRE DEFAULT`

  Define todas as contas nomeadas pela instrução para que a política de expiração global se aplique, conforme especificado pela System Variable [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime).

  ```sql
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE DEFAULT;
  ```

* `PASSWORD EXPIRE NEVER`

  Esta opção de expiração anula a política global para todas as contas nomeadas pela instrução. Para cada uma, desabilita a expiração de password para que o password nunca expire.

  ```sql
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE NEVER;
  ```

* `PASSWORD EXPIRE INTERVAL N DAY`

  Esta opção de expiração anula a política global para todas as contas nomeadas pela instrução. Para cada uma, define a vida útil do password para *`N`* dias. A instrução a seguir requer que o password seja alterado a cada 180 dias:

  ```sql
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE INTERVAL 180 DAY;
  ```

##### Opções de Account-Locking do CREATE USER

O MySQL suporta o account locking e unlocking usando as opções `ACCOUNT LOCK` e `ACCOUNT UNLOCK`, que especificam o estado de locking para uma conta. Para discussão adicional, consulte [Seção 6.2.15, “Account Locking”](account-locking.html "6.2.15 Account Locking").

Se múltiplas opções de account-locking forem especificadas, a última terá precedência.