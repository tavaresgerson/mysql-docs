#### 15.7.1.3 Declaração CREATE USER

```
CREATE USER [IF NOT EXISTS]
    user [auth_option] [, user [auth_option]] ...
    DEFAULT ROLE role [, role ] ...
    [REQUIRE {NONE | tls_option [[AND] tls_option] ...}]
    [WITH resource_option [resource_option] ...]
    [password_option | lock_option] ...
    [COMMENT 'comment_string' | ATTRIBUTE 'json_object']

user:
    (see Section 8.2.4, “Specifying Account Names”)

auth_option: {
    IDENTIFIED BY 'auth_string' [AND 2fa_auth_option]
  | IDENTIFIED BY RANDOM PASSWORD [AND 2fa_auth_option]
  | IDENTIFIED WITH auth_plugin [AND 2fa_auth_option]
  | IDENTIFIED WITH auth_plugin BY 'auth_string' [AND 2fa_auth_option]
  | IDENTIFIED WITH auth_plugin BY RANDOM PASSWORD [AND 2fa_auth_option]
  | IDENTIFIED WITH auth_plugin AS 'auth_string' [AND 2fa_auth_option]
  | IDENTIFIED WITH auth_plugin [initial_auth_option]
}

2fa_auth_option: {
    IDENTIFIED BY 'auth_string' [AND 3fa_auth_option]
  | IDENTIFIED BY RANDOM PASSWORD [AND 3fa_auth_option]
  | IDENTIFIED WITH auth_plugin [AND 3fa_auth_option]
  | IDENTIFIED WITH auth_plugin BY 'auth_string' [AND 3fa_auth_option]
  | IDENTIFIED WITH auth_plugin BY RANDOM PASSWORD [AND 3fa_auth_option]
  | IDENTIFIED WITH auth_plugin AS 'auth_string' [AND 3fa_auth_option]
}

3fa_auth_option: {
    IDENTIFIED BY 'auth_string'
  | IDENTIFIED BY RANDOM PASSWORD
  | IDENTIFIED WITH auth_plugin
  | IDENTIFIED WITH auth_plugin BY 'auth_string'
  | IDENTIFIED WITH auth_plugin BY RANDOM PASSWORD
  | IDENTIFIED WITH auth_plugin AS 'auth_string'
}

initial_auth_option: {
    INITIAL AUTHENTICATION IDENTIFIED BY {RANDOM PASSWORD | 'auth_string'}
  | INITIAL AUTHENTICATION IDENTIFIED WITH auth_plugin AS 'auth_string'
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
    PASSWORD EXPIRE [DEFAULT | NEVER | INTERVAL N DAY]
  | PASSWORD HISTORY {DEFAULT | N}
  | PASSWORD REUSE INTERVAL {DEFAULT | N DAY}
  | PASSWORD REQUIRE CURRENT [DEFAULT | OPTIONAL]
  | FAILED_LOGIN_ATTEMPTS N
  | PASSWORD_LOCK_TIME {N | UNBOUNDED}
}

lock_option: {
    ACCOUNT LOCK
  | ACCOUNT UNLOCK
}
```

A declaração `CREATE USER` cria novas contas MySQL. Ela permite que autenticação, papel, SSL/TLS, limite de recursos, gerenciamento de senhas, comentário e propriedades de atributos sejam estabelecidos para novas contas. Ela também controla se as contas são bloqueadas ou desbloqueadas inicialmente.

Para usar `CREATE USER`, você deve ter o privilégio global `CREATE USER`, ou o privilégio `INSERT` para o esquema do sistema `mysql`. Quando a variável de sistema `read_only` é habilitada, `CREATE USER` também requer o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`).

Essas considerações de privilégio adicionais também se aplicam:

* A variável de sistema `authentication_policy` coloca certas restrições sobre como as cláusulas relacionadas à autenticação das declarações `CREATE USER` podem ser usadas; para detalhes, consulte a descrição dessa variável. Essas restrições não se aplicam se você tiver o privilégio `AUTHENTICATION_POLICY_ADMIN`.

* Para criar uma conta que use autenticação sem senha, você deve ter o privilégio `PASSWORDLESS_USER_ADMIN`.

A instrução `CREATE USER` falha com um erro se qualquer conta a ser criada tiver o atributo `DEFINER` para qualquer objeto armazenado. (Ou seja, a instrução falha se a criação de uma conta causar que a conta adote um objeto armazenado atualmente órfão.) Para realizar a operação de qualquer maneira, você deve ter o privilégio `SET_ANY_DEFINER` ou `ALLOW_NONEXISTENT_DEFINER`; nesse caso, a instrução tem sucesso com um aviso em vez de falhar com um erro. Para realizar a operação de criação de usuário sem nenhum desses privilégios, armazene os objetos órfãos, crie a conta e conceda seus privilégios, e depois recrie os objetos armazenados descartados. Para obter informações adicionais, incluindo como identificar qual objeto nomeia uma conta específica como o atributo `DEFINER`, consulte Objetos Armazenados Órfãos.

`CREATE USER` ou tem sucesso para todos os usuários nomeados ou é revertida e não tem efeito se ocorrer algum erro. Por padrão, um erro ocorre se você tentar criar um usuário que já existe. Se a cláusula `IF NOT EXISTS` for fornecida, a instrução produz um aviso para cada usuário nomeado que já existe, em vez de um erro.

Importante

Em algumas circunstâncias, `CREATE USER` pode ser registrado em logs do servidor ou no lado do cliente em um arquivo de histórico, como `~/.mysql_history`, o que significa que senhas em texto claro podem ser lidas por qualquer pessoa que tenha acesso de leitura a essas informações. Para informações sobre as condições sob as quais isso ocorre para os logs do servidor e como controlá-lo, consulte Seção 8.1.2.3, “Senhas e Registro”. Para informações semelhantes sobre o registro no lado do cliente, consulte Seção 6.5.1.3, “Registro do Cliente do MySQL”.

Existem vários aspectos da instrução `CREATE USER`, descritos nos seguintes tópicos:

* CRIAR USUÁRIO Visão geral
* CRIAR USUÁRIO Opções de autenticação
* CRIAR USUÁRIO Opções de autenticação multifator
* CRIAR USUÁRIO Opções de função
* CRIAR USUÁRIO Opções SSL/TLS
* CRIAR USUÁRIO Opções de limite de recursos
* CRIAR USUÁRIO Opções de gerenciamento de senhas
* CRIAR USUÁRIO Opções de comentário e atributo
* CRIAR USUÁRIO Opções de bloqueio de conta
* CRIAR USUÁRIO Registro binário

##### CRIAR USUÁRIO Visão geral

Para cada conta, o comando `CREATE USER` cria uma nova linha na tabela `mysql.user` do sistema. A linha da conta reflete as propriedades especificadas na instrução. Propriedades não especificadas são definidas com seus valores padrão:

* Autenticação: O plugin de autenticação padrão (determinado conforme descrito em O plugin de autenticação padrão), e credenciais vazias
* Papel padrão: `NONE`
* SSL/TLS: `NONE`
* Limites de recursos: Sem limite
* Gerenciamento de senhas: `PASSWORD EXPIRE DEFAULT PASSWORD HISTORY DEFAULT PASSWORD REUSE INTERVAL DEFAULT PASSWORD REQUIRE CURRENT DEFAULT`; o rastreamento de login falhado e o bloqueio temporário da conta são desativados

* Bloqueio de conta: `ACCOUNT UNLOCK`

Uma conta quando criada pela primeira vez não tem privilégios e o papel padrão `NONE`. Para atribuir privilégios ou papéis a essa conta, use uma ou mais instruções `GRANT`.

Cada nome de conta usa o formato descrito na Seção 8.2.4, “Especificando nomes de conta”. Por exemplo:

```
CREATE USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
```

A parte do nome da conta que representa o nome do host, se omitida, tem o valor padrão `'%'`. Você deve estar ciente de que, embora o MySQL 9.5 trate as concessões feitas a um usuário desse tipo como se tivessem sido concedidas a `'user'@'localhost'`, esse comportamento é desatualizado e, portanto, sujeito à remoção em uma versão futura do MySQL.

Cada valor `user` que nomeia uma conta pode ser seguido por um valor opcional `auth_option` que indica como a conta autentica. Esses valores permitem que plugins de autenticação de conta e credenciais (por exemplo, uma senha) sejam especificados. Cada valor `auth_option` se aplica *apenas* à conta nomeada imediatamente antes dele.

Seguindo as especificações de `user`, a declaração pode incluir opções para SSL/TLS, limite de recursos, gerenciamento de senhas e propriedades de bloqueio. Todas essas opções são *globais* para a declaração e se aplicam a *todas* as contas nomeadas na declaração.

Exemplo: Crie uma conta que use o plugin de autenticação de autenticação padrão e a senha fornecida. Marque a senha como expirada para que o usuário precise escolher uma nova na primeira conexão com o servidor:

```
CREATE USER 'jeffrey'@'localhost'
  IDENTIFIED BY 'new_password' PASSWORD EXPIRE;
```

Exemplo: Crie uma conta que use o plugin de autenticação `caching_sha2_password` e a senha fornecida. Exija que uma nova senha seja escolhida a cada 180 dias e habilite o rastreamento de login falhado, de modo que três senhas incorretas consecutivas causem o bloqueio temporário da conta por dois dias:

```
CREATE USER 'jeffrey'@'localhost'
  IDENTIFIED WITH caching_sha2_password BY 'new_password'
  PASSWORD EXPIRE INTERVAL 180 DAY
  FAILED_LOGIN_ATTEMPTS 3 PASSWORD_LOCK_TIME 2;
```

Exemplo: Crie várias contas, especificando algumas propriedades por conta e algumas propriedades globais:

```
CREATE USER
  'jeffrey'@'localhost' IDENTIFIED WITH caching_sha2_password
                                BY 'new_password1',
  'jeanne'@'localhost' IDENTIFIED WITH caching_sha2_password
                                BY 'new_password2'
  REQUIRE X509 WITH MAX_QUERIES_PER_HOUR 60
  PASSWORD HISTORY 5
  ACCOUNT LOCK;
```

Cada valor `auth_option` (`IDENTIFIED WITH ... BY` neste caso) se aplica apenas à conta nomeada imediatamente antes dela, então cada conta usa o plugin de autenticação imediatamente após ele e a senha.

As propriedades restantes se aplicam globalmente a todas as contas nomeadas na declaração, então para ambas as contas:

* As conexões devem ser feitas usando um certificado X.509 válido.
* Até 60 consultas por hora são permitidas.
* As alterações de senha não podem reutilizar nenhuma das cinco senhas mais recentes.

* A conta é inicialmente bloqueada, portanto, é um placeholder e não pode ser usada até que um administrador a desbloqueie.

##### Opções de Autenticação de USUÁRIO CRIAR

Um nome de conta pode ser seguido por uma opção de autenticação *`auth_option`* que especifica o plugin de autenticação da conta, as credenciais ou ambos.

Nota

O MySQL 9.5 suporta a autenticação multifator (MFA), de modo que as contas podem ter até três métodos de autenticação. Ou seja, as contas podem usar autenticação de dois fatores (2FA) ou autenticação de três fatores (3FA). A sintaxe e a semântica de *`auth_option`* permanecem inalteradas, mas *`auth_option`* pode ser seguido por especificações para métodos de autenticação adicionais. Esta seção descreve *`auth_option`*. Para detalhes sobre as cláusulas opcionais relacionadas ao MFA, consulte Opções de Autenticação de Multifator de CRIAR USUÁRIO.

Nota

As cláusulas para geração aleatória de senha aplicam-se apenas às contas que usam um plugin de autenticação que armazena as credenciais internamente no MySQL. Para contas que usam um plugin que realiza autenticação contra um sistema de credenciais externo ao MySQL, a gestão de senhas deve ser realizada externamente contra esse sistema também. Para mais informações sobre o armazenamento interno de credenciais, consulte Seção 8.2.15, “Gestão de Senhas”.

* *`auth_plugin`* nomeia um plugin de autenticação. O nome do plugin pode ser uma literal literal de string com aspas ou um nome não com aspas. Os nomes dos plugins são armazenados na coluna `plugin` da tabela `mysql.user` do sistema.

  Para a sintaxe de *`auth_option`* que não especifica um plugin de autenticação, o servidor atribui o plugin padrão, determinado como descrito em O Plugin de Autenticação Padrão. Para descrições de cada plugin, consulte Seção 8.4.1, “Plugins de Autenticação”.

* As credenciais armazenadas internamente são armazenadas na tabela `mysql.user` do sistema. Um valor de `'auth_string'` ou `PASSWORD ALEATÓRIA` especifica as credenciais da conta, seja como uma string em texto claro (não criptografada) ou hashada no formato esperado pelo plugin de autenticação associado à conta, respectivamente:

  + Para a sintaxe que usa `BY 'auth_string'`, a string é em texto claro e é passada para o plugin de autenticação para possível hash. O resultado retornado pelo plugin é armazenado na tabela `mysql.user`. Um plugin pode usar o valor conforme especificado, nesse caso, não ocorre hash.

  + Para a sintaxe que usa `BY PASSWORD ALEATÓRIA`, o MySQL gera uma senha aleatória e em texto claro e a passa para o plugin de autenticação para possível hash. O resultado retornado pelo plugin é armazenado na tabela `mysql.user`. Um plugin pode usar o valor conforme especificado, nesse caso, não ocorre hash.

    Senhas geradas aleatoriamente têm as características descritas na Geração de Senhas Aleatórias.

  + Para a sintaxe que usa `AS 'auth_string'`, a string é assumida como já no formato que o plugin de autenticação requer e é armazenada como está na tabela `mysql.user`. Se um plugin requer um valor hash, o valor deve já estar hashado em um formato apropriado para o plugin; caso contrário, o valor não pode ser usado pelo plugin e a autenticação correta das conexões do cliente não ocorre.

    Uma string hashada pode ser uma literal de string ou um valor hexadecimal. Este último corresponde ao tipo de valor exibido por `SHOW CREATE USER` para hashes de senha contendo caracteres não imprimíveis quando a variável de sistema `print_identified_with_as_hex` está habilitada.

    Importante

Embora mostremos `'auth_string'` com aspas, um valor hexadecimal usado para esse propósito *não* deve ser citado.

+ Se um plugin de autenticação não realizar hashing da string de autenticação, as cláusulas `BY 'auth_string'` e `AS 'auth_string'` têm o mesmo efeito: a string de autenticação é armazenada como está na tabela de sistema `mysql.user`.

`CREATE USER` permite essas sintaxes de ``auth_option``:

* `IDENTIFIED BY 'auth_string'`

  Define o plugin de autenticação da conta para o plugin padrão, passa o valor `'auth_string'` em texto claro para o plugin para possível hashing e armazena o resultado na linha da conta na tabela de sistema `mysql.user`.

* `IDENTIFIED BY RANDOM PASSWORD`

  Define o plugin de autenticação da conta para o plugin padrão, gera uma senha aleatória, passa o valor da senha em texto claro para o plugin para possível hashing e armazena o resultado na linha da conta na tabela de sistema `mysql.user`. A declaração também retorna a senha em texto claro em um conjunto de resultados para torná-la disponível para o usuário ou aplicativo que executa a declaração. Para detalhes sobre o conjunto de resultados e características de senhas geradas aleatoriamente, consulte Geração de Senha Aleatória.

* `IDENTIFIED WITH auth_plugin`

  Define o plugin de autenticação da conta para *`auth_plugin`*, limpa as credenciais para a string vazia e armazena o resultado na linha da conta na tabela de sistema `mysql.user`.

* `IDENTIFIED WITH auth_plugin BY 'auth_string'`

  Define o plugin de autenticação da conta para *`auth_plugin`*, passa o valor `'auth_string'` em texto claro para o plugin para possível hashing e armazena o resultado na linha da conta na tabela de sistema `mysql.user`.

* `IDENTIFIED WITH auth_plugin BY RANDOM PASSWORD`

Define o plugin de autenticação da conta para *`auth_plugin`*, gera uma senha aleatória, passa o valor da senha em texto claro para o plugin para possível hashing e armazena o resultado na linha da conta na tabela de sistema `mysql.user`. A instrução também retorna o valor da senha em texto claro em um conjunto de resultados para torná-lo disponível para o usuário ou aplicativo que executa a instrução. Para obter detalhes sobre o conjunto de resultados e as características das senhas geradas aleatoriamente, consulte Geração de Senha Aleatória.

* `IDENTIFIED WITH auth_plugin AS 'auth_string'`

Define o plugin de autenticação da conta para *`auth_plugin`* e armazena o valor `'auth_string'` como está na linha da conta `mysql.user`. Se o plugin exigir uma string hash, a string é assumida como já hashada no formato exigido pelo plugin.

Exemplo: Especifique a senha como texto claro; o plugin padrão é usado:

```
CREATE USER 'jeffrey'@'localhost'
  IDENTIFIED BY 'password';
```

Exemplo: Especifique o plugin de autenticação, juntamente com um valor de senha em texto claro:

```
CREATE USER 'jeffrey'@'localhost'
  IDENTIFIED WITH caching_sha2_password BY 'password';
```

Em cada caso, o valor da senha armazenado na linha da conta é o valor em texto claro `'password'` após ter sido hashado pelo plugin de autenticação associado à conta.

Para obter informações adicionais sobre a configuração de senhas e plugins de autenticação, consulte Seção 8.2.14, “Atribuição de Senhas de Conta”, e Seção 8.2.17, “Autenticação Personalizável”.

##### CRIAR USUÁRIO Opções de Autenticação Múltipla

A parte *`auth_option`* de `CREATE USER` define um método de autenticação para autenticação de um fator/autenticação de um fator (1FA/SFA). `CREATE USER` também suporta autenticação múltipla (MFA), de modo que as contas podem ter até três métodos de autenticação. Ou seja, as contas podem usar autenticação de dois fatores (2FA) ou autenticação de três fatores (3FA).

A variável de sistema `authentication_policy` define restrições para as instruções `CREATE USER` com cláusulas de autenticação multifator (MFA). Por exemplo, o ajuste `authentication_policy` controla o número de fatores de autenticação que as contas podem ter, e para cada fator, quais métodos de autenticação são permitidos. Veja Configurando a Política de Autenticação Multifator.

Para informações sobre regras específicas de fatores que determinam o plugin de autenticação padrão para cláusulas de autenticação que não nomeiam nenhum plugin, veja O Plugin de Autenticação Padrão.

Após *`auth_option`*, podem aparecer diferentes cláusulas MFA opcionais:

* *`2fa_auth_option`*: Especifica um método de autenticação de fator 2. O exemplo seguinte define `caching_sha2_password` como o método de autenticação de fator 1, e `authentication_ldap_sasl` como o método de autenticação de fator 2.

  ```
  CREATE USER 'u1'@'localhost'
    IDENTIFIED WITH caching_sha2_password
      BY 'sha2_password'
    AND IDENTIFIED WITH authentication_ldap_sasl
      AS 'uid=u1_ldap,ou=People,dc=example,dc=com';
  ```

* *`3fa_auth_option`*: Após *`2fa_auth_option`*, pode aparecer uma cláusula *`3fa_auth_option`* para especificar um método de autenticação de fator 3. O exemplo seguinte define `caching_sha2_password` como o método de autenticação de fator 1, `authentication_ldap_sasl` como o método de autenticação de fator 2, e `authentication_webauthn` como o método de autenticação de fator 3

  ```
  CREATE USER 'u1'@'localhost'
    IDENTIFIED WITH caching_sha2_password
      BY 'sha2_password'
    AND IDENTIFIED WITH authentication_ldap_sasl
      AS 'uid=u1_ldap,ou=People,dc=example,dc=com'
    AND IDENTIFIED WITH authentication_webauthn;
  ```

* *`initial_auth_option`*: Especifica um método de autenticação inicial para configurar a autenticação sem senha FIDO/FIDO2. Como mostrado a seguir, é necessário uma autenticação temporária usando uma senha aleatória gerada ou uma *`auth-string`* especificada pelo usuário para habilitar a autenticação sem senha WebAuthn.

  ```
  CREATE USER user
    IDENTIFIED WITH authentication_webauthn
    INITIAL AUTHENTICATION IDENTIFIED BY {RANDOM PASSWORD | 'auth_string'};
  ```

  Para informações sobre como configurar a autenticação sem senha usando a autenticação plugável WebAuthn, veja Autenticação Sem Senha WebAuthn.

##### Opções de Role CREATE USER
English (source):
```
CREATE USER 'joe'@'10.0.0.1' DEFAULT ROLE administrator, developer;
```
Portuguese (Brazilian):
```
  CREATE USER 'jeffrey'@'localhost' REQUIRE NONE;
  ```

A cláusula `DEFAULT ROLE` define quais papéis se tornam ativos quando o usuário se conecta ao servidor e se autentica, ou quando o usuário executa a instrução `SET ROLE DEFAULT` durante uma sessão.

Cada nome de papel usa o formato descrito na Seção 8.2.5, “Especificação de Nomes de Papel”. Por exemplo:

```
  CREATE USER 'jeffrey'@'localhost' REQUIRE SSL;
  ```

A parte do nome de papel que contém o nome do host, se omitida, tem como padrão `'%'`.

A cláusula `DEFAULT ROLE` permite uma lista de um ou mais nomes de papel separados por vírgula. Esses papéis devem existir no momento em que a instrução `CREATE USER` é executada; caso contrário, a instrução gera um erro (`ER_USER_DOES_NOT_EXIST`), e o usuário não é criado.

##### Opções de CREATE USER SSL/TLS

O MySQL pode verificar os atributos do certificado X.509 além da autenticação usual, que é baseada no nome do usuário e nas credenciais. Para informações de fundo sobre o uso de SSL/TLS com o MySQL, consulte a Seção 8.3, “Uso de Conexões Encriptadas”.

Para especificar opções relacionadas a SSL/TLS para uma conta MySQL, use uma cláusula `REQUIRE` que especifica um ou mais valores de *`tls_option`*.

A ordem das opções `REQUIRE` não importa, mas nenhuma opção pode ser especificada duas vezes. A palavra-chave `AND` é opcional entre as opções `REQUIRE`.

`CREATE USER` permite esses valores de *`tls_option`*:

* `NONE`

  Indica que todas as contas nomeadas pela instrução não têm requisitos de SSL ou X.509. Conexões não encriptadas são permitidas se o nome do usuário e a senha forem válidos. Conexões encriptadas podem ser usadas, a critério do cliente, se o cliente tiver os arquivos de certificado e chave apropriados.

  ```
  CREATE USER 'jeffrey'@'localhost' REQUIRE X509;
  ```

Os clientes tentam estabelecer uma conexão segura por padrão. Para clientes que têm `REQUIRE NONE`, a tentativa de conexão cai para uma conexão não criptografada se uma conexão segura não puder ser estabelecida. Para exigir uma conexão criptografada, um cliente precisa especificar apenas a opção `--ssl-mode=REQUIRED`; a tentativa de conexão falha se uma conexão segura não puder ser estabelecida.

`NONE` é o padrão se nenhuma opção `REQUIRE` relacionada ao SSL for especificada.

* `SSL`

  Diz ao servidor para permitir apenas conexões criptografadas para todas as contas nomeadas pelo comando.

  ```
  CREATE USER 'jeffrey'@'localhost'
    REQUIRE ISSUER '/C=SE/ST=Stockholm/L=Stockholm/
      O=MySQL/CN=CA/emailAddress=ca@example.com';
  ```

  Os clientes tentam estabelecer uma conexão segura por padrão. Para contas que têm `REQUIRE SSL`, a tentativa de conexão falha se uma conexão segura não puder ser estabelecida.

* `X509`

  Para todas as contas nomeadas pelo comando, exige que os clientes apresentem um certificado válido, mas o certificado exato, o emissor e o sujeito não importam. O único requisito é que seja possível verificar sua assinatura com um dos certificados CA. O uso de certificados X.509 sempre implica criptografia, então a opção `SSL` é desnecessária neste caso.

  ```
  CREATE USER 'jeffrey'@'localhost'
    REQUIRE SUBJECT '/C=SE/ST=Stockholm/L=Stockholm/
      O=MySQL demo client certificate/
      CN=client/emailAddress=client@example.com';
  ```

  Para contas com `REQUIRE X509`, os clientes devem especificar as opções `--ssl-key` e `--ssl-cert` para se conectar. (É recomendado, mas não obrigatório, que `--ssl-ca` também seja especificado para que o certificado público fornecido pelo servidor possa ser verificado.) Isso é verdade para `ISSUER` e `SUBJECT` também, porque essas opções `REQUIRE` implicam os requisitos de `X509`.

* `ISSUER 'issuer'`

Para todas as contas mencionadas na declaração, é necessário que os clientes apresentem um certificado X.509 válido emitido pela CA `'emissor'`. Se um cliente apresentar um certificado válido, mas com um emissor diferente, o servidor rejeita a conexão. O uso de certificados X.509 sempre implica criptografia, portanto, a opção `SSL` é desnecessária neste caso.

```
  CREATE USER 'jeffrey'@'localhost'
    REQUIRE CIPHER 'EDH-RSA-DES-CBC3-SHA';
  ```

Como `ISSUER` implica os requisitos de `X509`, os clientes devem especificar as opções `--ssl-key` e `--ssl-cert` para se conectarem. (Recomenda-se, mas não é obrigatório, que a opção `--ssl-ca` também seja especificada para que o certificado público fornecido pelo servidor possa ser verificado.)

* `SUBJECT 'subject'`

  Para todas as contas mencionadas na declaração, é necessário que os clientes apresentem um certificado X.509 válido contendo o sujeito *`subject`*. Se um cliente apresentar um certificado válido, mas com um sujeito diferente, o servidor rejeita a conexão. O uso de certificados X.509 sempre implica criptografia, portanto, a opção `SSL` é desnecessária neste caso.

```
CREATE USER 'jeffrey'@'localhost'
  REQUIRE SUBJECT '/C=SE/ST=Stockholm/L=Stockholm/
    O=MySQL demo client certificate/
    CN=client/emailAddress=client@example.com'
  AND ISSUER '/C=SE/ST=Stockholm/L=Stockholm/
    O=MySQL/CN=CA/emailAddress=ca@example.com'
  AND CIPHER 'EDH-RSA-DES-CBC3-SHA';
```

O MySQL faz uma simples comparação de strings do valor `'subject'` com o valor no certificado, portanto, a grafia maiúscula e a ordem dos componentes devem ser exatamente como estão no certificado.

Como `SUBJECT` implica os requisitos de `X509`, os clientes devem especificar as opções `--ssl-key` e `--ssl-cert` para se conectarem. (Recomenda-se, mas não é obrigatório, que a opção `--ssl-ca` também seja especificada para que o certificado público fornecido pelo servidor possa ser verificado.)

* `CIPHER 'cipher'`

  Para todas as contas mencionadas na declaração, é necessário um método de criptografia específico para criptografar as conexões. Esta opção é necessária para garantir que sejam usadas chaves e comprimentos de chave de força suficientes. A criptografia pode ser fraca se forem usados algoritmos antigos com chaves de criptografia curtas.

As opções `SUBJECT`, `ISSUER` e `CIPHER` podem ser combinadas na cláusula `REQUIRE`:

```
CREATE USER 'jeffrey'@'localhost'
  WITH MAX_QUERIES_PER_HOUR 500 MAX_UPDATES_PER_HOUR 100;
```

##### Opções de Gerenciamento de Senhas para CRIAR USUÁRIO

É possível definir limites de uso dos recursos do servidor por uma conta, conforme discutido na Seção 8.2.21, “Definindo Limites de Recursos de Conta”. Para isso, use uma cláusula `WITH` que especifique um ou mais valores de *`resource_option`*.

A ordem das cláusulas `WITH` não importa, exceto que, se um limite de recurso específico for especificado várias vezes, a última instância prevalece.

`CREATE USER` permite esses valores de *`resource_option`*:

* `MAX_QUERIES_PER_HOUR count`, `MAX_UPDATES_PER_HOUR count`, `MAX_CONNECTIONS_PER_HOUR count`

  Para todas as contas nomeadas pelo comando, essas opções restringem quantas consultas, atualizações e conexões ao servidor são permitidas para cada conta durante qualquer período de uma hora. Se `count` for `0` (o padrão), isso significa que não há limitação para a conta.

* `MAX_USER_CONNECTIONS count`

  Para todas as contas nomeadas pelo comando, restringe o número máximo de conexões simultâneas ao servidor por cada conta. Um `count` não nulo especifica o limite para a conta explicitamente. Se `count` for `0` (o padrão), o servidor determina o número de conexões simultâneas para a conta a partir do valor global da variável de sistema `max_user_connections`. Se `max_user_connections` também for zero, não há limite para a conta.

Exemplo:

```
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE;
  ```

##### Opções de Gerenciamento de Senhas para CRIAR USUÁRIO

`CREATE USER` suporta vários valores de *`password_option`* para gerenciamento de senhas:

* Opções de expiração da senha: Você pode expirar manualmente uma senha de conta e estabelecer sua política de expiração da senha. As opções de política não expiram a senha. Em vez disso, elas determinam como o servidor aplica a expiração automática à conta com base na idade da senha, que é avaliada a partir da data e hora da última alteração da senha da conta.

* Opções de reutilização da senha: Você pode restringir a reutilização da senha com base no número de alterações de senha, no tempo decorrido ou em ambos.

* Opções de verificação de senha: Você pode indicar se as tentativas de alterar a senha de uma conta devem especificar a senha atual, como uma verificação de que o usuário que está tentando fazer a alteração realmente conhece a senha atual.

* Opções de rastreamento de tentativas de login com senha incorreta: Você pode fazer com que o servidor rastreie as tentativas de login falhas e bloqueie temporariamente as contas para as quais muitas tentativas de senha incorretas consecutivas forem fornecidas. O número necessário de falhas e o tempo de bloqueio são configuráveis.

Esta seção descreve a sintaxe para as opções de gerenciamento de senhas. Para informações sobre a definição de políticas para o gerenciamento de senhas, consulte a Seção 8.2.15, “Gerenciamento de Senhas”.

Se várias opções de gerenciamento de senhas de um determinado tipo forem especificadas, a última tem precedência. Por exemplo, `PASSWORD EXPIRE DEFAULT PASSWORD EXPIRE NEVER` é o mesmo que `PASSWORD EXPIRE NEVER`.

Nota

Exceto pelas opções relacionadas ao rastreamento de logins falhados, as opções de gerenciamento de senhas aplicam-se apenas às contas que usam um plugin de autenticação que armazena credenciais internamente no MySQL. Para contas que usam um plugin que realiza autenticação contra um sistema de credenciais externo ao MySQL, o gerenciamento de senhas deve ser realizado externamente contra esse sistema também. Para obter mais informações sobre o armazenamento interno de credenciais, consulte a Seção 8.2.15, “Gerenciamento de Senhas”.

Um cliente tem uma senha expirada se a senha da conta expirou manualmente ou a idade da senha for considerada maior que sua vida útil permitida de acordo com a política de expiração automática. Nesse caso, o servidor desconecta o cliente ou restringe as operações permitidas a ele (consulte a Seção 8.2.16, “Tratamento do Servidor de Senhas Expirantes”). As operações realizadas por um cliente restrito resultam em um erro até que o usuário estabeleça uma nova senha de conta.

`CREATE USER` permite esses valores de `password_option` para controlar a expiração da senha:

* `PASSWORD EXPIRE`

  Marca imediatamente a senha como expirada para todas as contas nomeadas pelo comando.

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE DEFAULT;
  ```

* `PASSWORD EXPIRE DEFAULT`

  Define todas as contas nomeadas pelo comando para que a política de expiração global seja aplicada, conforme especificado pela variável de sistema `default_password_lifetime`.

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE NEVER;
  ```

* `PASSWORD EXPIRE NEVER`

  Esta opção de expiração substitui a política global para todas as contas nomeadas pelo comando. Para cada uma, desabilita a expiração da senha para que a senha nunca expire.

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE INTERVAL 180 DAY;
  ```

* `PASSWORD EXPIRE INTERVAL N DAY`

Esta opção de expiração substitui a política global para todas as contas nomeadas pelo extrato. Para cada uma, define a duração da senha para *`N`* dias. A seguinte declaração exige que a senha seja alterada a cada 180 dias:

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD HISTORY DEFAULT;
  ```

`CREATE USER` permite esses valores de *`password_option`* para controlar a reutilização de senhas anteriores com base no número mínimo de alterações de senha exigido:

* `PASSWORD HISTORY DEFAULT`

  Define todas as contas nomeadas pelo extrato para que a política global sobre o comprimento do histórico de senhas se aplique, para proibir a reutilização de senhas antes do número de alterações especificadas pela variável de sistema `password_history`.

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD HISTORY 6;
  ```

* `PASSWORD HISTORY N`

  Esta opção de comprimento do histórico substitui a política global para todas as contas nomeadas pelo extrato. Para cada uma, define o comprimento do histórico de senhas para *`N`* senhas, para proibir a reutilização de qualquer uma das *`N`* senhas mais recentemente escolhidas. A seguinte declaração proíbe a reutilização de qualquer uma das 6 senhas anteriores:

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD REUSE INTERVAL DEFAULT;
  ```

`CREATE USER` permite esses valores de *`password_option`* para controlar a reutilização de senhas anteriores com base no tempo decorrido:

* `PASSWORD REUSE INTERVAL DEFAULT`

  Define todas as declarações nomeadas pela conta para que a política global sobre o tempo decorrido se aplique, para proibir a reutilização de senhas mais recentes do que o número de dias especificado pela variável de sistema `password_reuse_interval`.

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD REUSE INTERVAL 360 DAY;
  ```

* `PASSWORD REUSE INTERVAL N DAY`

  Esta opção de tempo decorrido substitui a política global para todas as contas nomeadas pelo extrato. Para cada uma, define o intervalo de reutilização de senhas para *`N`* dias, para proibir a reutilização de senhas mais recentes do que esse número de dias. A seguinte declaração proíbe a reutilização de senhas por 360 dias:

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT;
  ```

`CREATE USER` permite esses valores de *`password_option`* para controlar se as tentativas de alterar a senha de uma conta devem especificar a senha atual, como uma verificação de que o usuário que tenta fazer a alteração realmente conhece a senha atual:

* `PASSWORD REQUIRE CURRENT`

  Esta opção de verificação substitui a política global para todas as contas nomeadas pelo comando. Para cada uma, exige que as alterações de senha especifiquem a senha atual.

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT OPTIONAL;
  ```

* `PASSWORD REQUIRE CURRENT OPTIONAL`

  Esta opção de verificação substitui a política global para todas as contas nomeadas pelo comando. Para cada uma, não exige que as alterações de senha especifiquem a senha atual. (A senha atual pode ser fornecida, mas não é obrigatória.)

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT DEFAULT;
  ```

* `PASSWORD REQUIRE CURRENT DEFAULT`

  Define todas as declarações nomeadas pela conta para que a política global sobre a verificação da senha seja aplicada, conforme especificado pela variável de sistema `password_require_current`.

  ```
CREATE USER 'jeffrey'@'localhost'
  FAILED_LOGIN_ATTEMPTS 4 PASSWORD_LOCK_TIME 2;
```

`CREATE USER` permite esses valores de *`password_option`* para controlar o rastreamento de tentativas de login falhas:

* `FAILED_LOGIN_ATTEMPTS N`

  Se rastrear as tentativas de login da conta que especificam uma senha incorreta. *`N`* deve ser um número de 0 a 32767. Um valor de 0 desativa o rastreamento de tentativas de login falhas. Valores maiores que 0 indicam quantos falhas consecutivas de senha causam bloqueio temporário da conta (se `PASSWORD_LOCK_TIME` também for diferente de zero).

* `PASSWORD_LOCK_TIME {N | UNBOUNDED}`

Quanto tempo para bloquear a conta após muitas tentativas de login consecutivas fornecer uma senha incorreta. *`N`* deve ser um número de 0 a 32767, ou `UNBOUNDED`. Um valor de 0 desativa o bloqueio temporário da conta. Valores maiores que 0 indicam quanto tempo bloquear a conta em dias. Um valor de `UNBOUNDED` faz com que a duração do bloqueio da conta seja ilimitada; uma vez bloqueada, a conta permanece no estado bloqueado até ser desbloqueada. Para informações sobre as condições sob as quais o desbloqueio ocorre, consulte Rastreamento de Tentativas de Login Falhas e Bloqueio Temporário de Conta.

Para que o rastreamento de tentativas de login falhas e o bloqueio temporário ocorram, as opções `FAILED_LOGIN_ATTEMPTS` e `PASSWORD_LOCK_TIME` de uma conta devem ser não nulos. A seguinte declaração cria uma conta que permanece bloqueada por dois dias após quatro tentativas consecutivas de senha falha:

```
  CREATE USER 'jon'@'localhost' COMMENT 'Some information about Jon';
  ```

##### CRIAR USUÁRIO Comentários e Opções de Atributo

Você também pode incluir um comentário ou atributo opcional ao criar um usuário, conforme descrito aqui:

* **Comentário do usuário**

  Para definir um comentário do usuário, adicione `COMMENT 'user_comment'` à declaração `CREATE USER`, onde *`user_comment`* é o texto do comentário do usuário.

  Exemplo (omitido quaisquer outras opções):

  ```
  CREATE USER 'jim'@'localhost'
      ATTRIBUTE '{"fname": "James", "lname": "Scott", "phone": "123-456-7890"}';
  ```

* **Atributo do usuário**

  Um atributo do usuário é um objeto JSON composto por uma ou mais pares chave-valor e é definido incluindo `ATTRIBUTE 'json_object'` como parte de `CREATE USER`. *`json_object`* deve ser um objeto JSON válido.

  Exemplo (omitido quaisquer outras opções):

  ```
mysql> SELECT * FROM INFORMATION_SCHEMA.USER_ATTRIBUTES
    ->    WHERE USER = 'jim' AND HOST = 'localhost'\G
*************************** 1. row ***************************
     USER: jim
     HOST: localhost
ATTRIBUTE: {"fname": "James", "lname": "Scott", "phone": "123-456-7890"}
1 row in set (0.00 sec)
```

Comentários de usuário e atributos de usuário são armazenados juntos na coluna `ATTRIBUTE` da tabela `USER_ATTRIBUTES` do Schema de Informações. Esta consulta exibe a linha nesta tabela inserida pela declaração mostrada anteriormente para criar o usuário `jim@localhost`:

```
mysql> CREATE USER 'jon'@'localhost' COMMENT 'Some information about Jon';
Query OK, 0 rows affected (0.06 sec)

mysql> SELECT * FROM INFORMATION_SCHEMA.USER_ATTRIBUTES
    ->    WHERE USER = 'jon' AND HOST = 'localhost';
+------+-----------+-------------------------------------------+
| USER | HOST      | ATTRIBUTE                                 |
+------+-----------+-------------------------------------------+
| jon  | localhost | {"comment": "Some information about Jon"} |
+------+-----------+-------------------------------------------+
1 row in set (0.00 sec)
```

A opção `COMMENT` na realidade fornece um atalho para definir um atributo de usuário cujo único elemento tem `comment` como sua chave e cujo valor é o argumento fornecido para a opção. Você pode ver isso executando a declaração `CREATE USER 'jon'@'localhost' COMMENT 'Algumas informações sobre Jon'`, e observando a linha que ela insere na tabela `USER_ATTRIBUTES`:

```
mysql> CREATE USER 'bill'@'localhost'
    ->        ATTRIBUTE '{"fname":"William", "lname":"Schmidt",
    ->        "comment":"Website developer"}';
Query OK, 0 rows affected (0.16 sec)
```

Você não pode usar `COMMENT` e `ATTRIBUTE` juntos na mesma declaração `CREATE USER`; tentar fazê-lo causa um erro de sintaxe. Para definir um comentário de usuário simultaneamente com a definição de um atributo de usuário, use `ATTRIBUTE` e inclua em seu argumento um valor com uma chave `comment`, assim:

```
mysql> SELECT
    ->   USER AS User,
    ->   HOST AS Host,
    ->   CONCAT(ATTRIBUTE->>"$.fname"," ",ATTRIBUTE->>"$.lname") AS 'Full Name',
    ->   ATTRIBUTE->>"$.comment" AS Comment
    -> FROM INFORMATION_SCHEMA.USER_ATTRIBUTES
    -> WHERE USER='bill' AND HOST='localhost';
+------+-----------+-----------------+-------------------+
| User | Host      | Full Name       | Comment           |
+------+-----------+-----------------+-------------------+
| bill | localhost | William Schmidt | Website developer |
+------+-----------+-----------------+-------------------+
1 row in set (0.00 sec)
```

Como o conteúdo da linha `ATTRIBUTE` é um objeto JSON, você pode usar qualquer função ou operador JSON MySQL apropriado para manipulá-lo, como mostrado aqui:



Para definir ou fazer alterações no comentário de usuário ou no atributo de usuário para um usuário existente, você pode usar uma opção `COMMENT` ou `ATTRIBUTE` com uma declaração `ALTER USER`.

Como o comentário de usuário e o atributo de usuário são armazenados juntos internamente em uma única coluna `JSON`, isso define um limite superior para seu tamanho combinado máximo; veja Requisitos de Armazenamento JSON, para mais informações.

Veja também a descrição da tabela do Esquema de Informações `USER_ATTRIBUTES` para mais informações e exemplos.

##### CREATE USER Opções de Registro Binário

O MySQL suporta o bloqueio e desbloqueio de contas usando as opções `ACCOUNT LOCK` e `ACCOUNT UNLOCK`, que especificam o estado de bloqueio de uma conta. Para uma discussão adicional, consulte Seção 8.2.20, “Bloqueio de Conta”.

Se várias opções de bloqueio de conta forem especificadas, a última tem precedência.

##### CREATE USER Registro Binário

A instrução `CREATE USER` é escrita no log binário se ela for bem-sucedida, mas não se ela falhar; nesse caso, ocorre um rollback e nenhuma alteração é feita. A instrução escrita no log binário inclui todos os usuários nomeados. Se a cláusula `IF NOT EXISTS` for fornecida, isso inclui até mesmo usuários que já existem e não foram criados.

A instrução escrita no log binário especifica um plugin de autenticação para cada usuário, determinado da seguinte forma:

* O plugin nomeado na instrução original, se um foi especificado.

* Caso contrário, o plugin de autenticação padrão. Em particular, se um usuário `u1` já existe e usa um plugin de autenticação não padrão, a instrução escrita no log binário para `CREATE USER IF NOT EXISTS u1` nomeia o plugin de autenticação padrão. (Se a instrução escrita no log binário deve especificar um plugin de autenticação não padrão para um usuário, inclua-o na instrução original.)

Se o servidor adicionar o plugin de autenticação padrão para quaisquer usuários não existentes na instrução escrita no log binário, ele escreve uma mensagem de aviso no log de erro, nomeando esses usuários.

Se a instrução original especificar a opção `FAILED_LOGIN_ATTEMPTS` ou `PASSWORD_LOCK_TIME`, a instrução escrita no log binário inclui a opção.

As instruções `CREATE USER` com cláusulas que suportam autenticação multifator (MFA) são escritas no log binário.

* As instruções `CREATE USER ... IDENTIFIED WITH .. INITIAL AUTHENTICATION IDENTIFIED WITH ...` são escritas no log binário como `CREATE USER .. IDENTIFIED WITH .. INITIAL AUTHENTICATION IDENTIFIED WITH .. AS 'password-hash'`, onde o *`password-hash`* é a *`string-de-autenticação`* especificada pelo usuário ou a senha aleatória gerada pelo servidor quando a cláusula `RANDOM PASSWORD` é especificada.