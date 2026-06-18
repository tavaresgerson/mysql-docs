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

A declaração `CREATE USER` cria novas contas do MySQL. Ela permite que a autenticação, o papel, o SSL/TLS, o limite de recursos, a gestão de senhas, o comentário e as propriedades de atributos sejam estabelecidos para novas contas. Ela também controla se as contas são bloqueadas ou desbloqueadas inicialmente.

Para usar `CREATE USER`, você deve ter o privilégio global `CREATE USER` ou o privilégio `INSERT` para o esquema de sistema `mysql`. Quando a variável de sistema `read_only` é habilitada, `CREATE USER` também requer o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`).

A partir do MySQL 8.0.27, essas considerações sobre privilégios adicionais se aplicam:

- A variável de sistema `authentication_policy` estabelece certas restrições sobre como as cláusulas relacionadas à autenticação das instruções `CREATE USER` podem ser usadas; para detalhes, consulte a descrição dessa variável. Essas restrições não se aplicam se você tiver o privilégio `AUTHENTICATION_POLICY_ADMIN`.

- Para criar uma conta que utilize autenticação sem senha, você deve ter o privilégio `PASSWORDLESS_USER_ADMIN`.

A partir do MySQL 8.0.22, `CREATE USER` falha com um erro se qualquer conta a ser criada tiver o nome como o atributo `DEFINER` para qualquer objeto armazenado. (Ou seja, a declaração falha se a criação de uma conta causar que a conta adote um objeto armazenado atualmente órfão.) Para realizar a operação de qualquer maneira, você deve ter o privilégio `SET_USER_ID`; nesse caso, a declaração tem sucesso com um aviso em vez de falhar com um erro. Sem `SET_USER_ID`, para realizar a operação de criação de usuário, armazene os objetos órfãos, crie a conta e conceda seus privilégios, e depois re-armazene os objetos armazenados. Para obter informações adicionais, incluindo como identificar qual objeto nomeia uma conta dada como o atributo `DEFINER`, consulte Objetos Armazenados Órfãos.

`CREATE USER` ou tem sucesso para todos os usuários nomeados ou desfaz e não tem efeito se ocorrer algum erro. Por padrão, um erro ocorre se você tentar criar um usuário que já existe. Se a cláusula `IF NOT EXISTS` for fornecida, a instrução produz um aviso para cada usuário nomeado que já existe, em vez de um erro.

Importante

Em algumas circunstâncias, `CREATE USER` pode ser registrado em logs do servidor ou no lado do cliente em um arquivo de histórico, como `~/.mysql_history`, o que significa que senhas em texto claro podem ser lidas por qualquer pessoa que tenha acesso de leitura a essas informações. Para obter informações sobre as condições sob as quais isso ocorre para os logs do servidor e como controlá-lo, consulte a Seção 8.1.2.3, “Senhas e Registro”. Para informações semelhantes sobre o registro no lado do cliente, consulte a Seção 6.5.1.3, “Registro do Cliente do MySQL”.

Há vários aspectos da declaração `CREATE USER`, descritos nos seguintes tópicos:

- Crie usuário Visão geral
- Criar usuário Opções de autenticação
- Criar opções de autenticação multifator do usuário
- Criar opções de função do usuário
- Criar opções de SSL/TLS para o usuário
- Criar usuário Opções de limite de recursos
- Crie opções de gerenciamento de senhas para o usuário
- Criar Usuário Comentários e Opções de Atributos
- Criar opções de bloqueio de conta do usuário
- Crie o Usuário de Registro Binário

##### Crie usuário Visão geral

Para cada conta, o `CREATE USER` cria uma nova linha na tabela do sistema `mysql.user`. A linha da conta reflete as propriedades especificadas na declaração. As propriedades não especificadas são definidas com seus valores padrão:

- Autenticação: O plugin de autenticação padrão (determinado conforme descrito em O plugin de autenticação padrão) e credenciais vazias

- Papel padrão: `NONE`

- SSL/TLS: `NONE`

- Limites de recursos: Sem limite

- Gestão de senhas: `PASSWORD EXPIRE DEFAULT PASSWORD HISTORY DEFAULT PASSWORD REUSE INTERVAL DEFAULT PASSWORD REQUIRE CURRENT DEFAULT`; Rastreamento de logins falhos e bloqueio temporário de contas estão desativados

- Bloqueio da conta: `ACCOUNT UNLOCK`

Uma conta criada pela primeira vez não tem privilégios e a função padrão é `NONE`. Para atribuir privilégios ou funções a essa conta, use uma ou mais instruções `GRANT`.

Cada nome de conta usa o formato descrito na Seção 8.2.4, “Especificação de Nomes de Conta”. Por exemplo:

```
CREATE USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
```

A parte do nome do host do nome da conta, se omitida, tem como padrão `'%'`. Você deve estar ciente de que, embora o MySQL 8.0 trate as concessões feitas a um usuário desse tipo como se tivessem sido concedidas a `'user'@'localhost'`, esse comportamento é desaconselhável a partir do MySQL 8.0.35 e, portanto, está sujeito à remoção em uma versão futura do MySQL.

Cada valor `user` que identifica uma conta pode ser seguido por um valor opcional `auth_option` que indica como a conta autentica. Esses valores permitem que plugins de autenticação de conta e credenciais (por exemplo, uma senha) sejam especificados. Cada valor `auth_option` se aplica *apenas* à conta nomeada imediatamente antes dele.

De acordo com as especificações do `user`, a declaração pode incluir opções para SSL/TLS, limite de recursos, gerenciamento de senhas e propriedades de bloqueio. Todas essas opções são *globais* para a declaração e aplicam-se a *todas* as contas mencionadas na declaração.

Exemplo: Crie uma conta que utilize o plugin de autenticação padrão e a senha fornecida. Marque a senha como expirada para que o usuário precise escolher uma nova senha na primeira conexão com o servidor:

```
CREATE USER 'jeffrey'@'localhost'
  IDENTIFIED BY 'new_password' PASSWORD EXPIRE;
```

Exemplo: Crie uma conta que utilize o plugin de autenticação `caching_sha2_password` e a senha fornecida. Exija que uma nova senha seja escolhida a cada 180 dias e habilite o rastreamento de tentativas de login malsucedidas, de modo que três senhas incorretas consecutivas causem bloqueio temporário da conta por dois dias:

```
CREATE USER 'jeffrey'@'localhost'
  IDENTIFIED WITH caching_sha2_password BY 'new_password'
  PASSWORD EXPIRE INTERVAL 180 DAY
  FAILED_LOGIN_ATTEMPTS 3 PASSWORD_LOCK_TIME 2;
```

Exemplo: Crie várias contas, especificando algumas propriedades por conta e algumas propriedades globais:

```
CREATE USER
  'jeffrey'@'localhost' IDENTIFIED WITH mysql_native_password
                                   BY 'new_password1',
  'jeanne'@'localhost' IDENTIFIED WITH caching_sha2_password
                                  BY 'new_password2'
  REQUIRE X509 WITH MAX_QUERIES_PER_HOUR 60
  PASSWORD HISTORY 5
  ACCOUNT LOCK;
```

Cada valor `auth_option` (`IDENTIFIED WITH ... BY` neste caso) aplica-se apenas à conta imediatamente anterior a ele, portanto, cada conta usa o plugin de autenticação e a senha imediatamente subsequente.

As propriedades restantes se aplicam globalmente a todas as contas mencionadas na declaração, portanto, para ambas as contas:

- As conexões devem ser feitas usando um certificado X.509 válido.

- São permitidas até 60 consultas por hora.

- As alterações de senha não podem reutilizar nenhuma das cinco senhas mais recentes.

- A conta é bloqueada inicialmente, então, na prática, é um localizador e não pode ser usado até que um administrador a desbloqueie.

##### Criar usuário Opções de autenticação

O nome da conta pode ser seguido por uma opção de autenticação `auth_option` que especifica o plugin de autenticação da conta, as credenciais ou ambos.

Nota

Antes do MySQL 8.0.27, `auth_option` define o único método pelo qual uma conta autentica. Ou seja, todas as contas usam autenticação de um fator/único fator (1FA/SFA). O MySQL 8.0.27 e versões posteriores suportam autenticação multifator (MFA), de modo que as contas podem ter até três métodos de autenticação. Ou seja, as contas podem usar autenticação de dois fatores (2FA) ou autenticação de três fatores (3FA). A sintaxe e a semântica de `auth_option` permanecem inalteradas, mas `auth_option` pode ser seguido por especificações para métodos de autenticação adicionais. Esta seção descreve `auth_option`. Para detalhes sobre as cláusulas adicionais relacionadas ao MFA opcionais, consulte Opções de Autenticação Multifator CREATE USER.

Nota

As cláusulas para a geração de senhas aleatórias aplicam-se apenas às contas que utilizam um plugin de autenticação que armazena as credenciais internamente no MySQL. Para contas que utilizam um plugin que realiza autenticação contra um sistema de credenciais externo ao MySQL, a gestão de senhas também deve ser realizada externamente contra esse sistema. Para obter mais informações sobre o armazenamento interno de credenciais, consulte a Seção 8.2.15, “Gestão de Senhas”.

- `auth_plugin` nomeia um plugin de autenticação. O nome do plugin pode ser uma literal de string com aspas ou um nome não citado. Os nomes dos plugins são armazenados na coluna `plugin` da tabela do sistema `mysql.user`.

  Para a sintaxe `auth_option` que não especifica um plugin de autenticação, o servidor atribui o plugin padrão, conforme descrito em O Plugin de Autenticação Padrão. Para descrições de cada plugin, consulte a Seção 8.4.1, “Plugins de Autenticação”.

- As credenciais armazenadas internamente são armazenadas na tabela do sistema `mysql.user`. Um valor `'auth_string'` ou `RANDOM PASSWORD` especifica as credenciais da conta, seja como uma string em texto claro (não criptografada) ou hashada no formato esperado pelo plugin de autenticação associado à conta, respectivamente:

  - Para sintaxe que usa `BY 'auth_string'`, a string é em texto claro e é passada para o plugin de autenticação para possível hashing. O resultado retornado pelo plugin é armazenado na tabela `mysql.user`. Um plugin pode usar o valor conforme especificado, nesse caso, não ocorre hashing.

  - Para sintaxe que usa `BY RANDOM PASSWORD`, o MySQL gera uma senha aleatória e a passa como texto claro para o plugin de autenticação para possível hashing. O resultado retornado pelo plugin é armazenado na tabela `mysql.user`. Um plugin pode usar o valor conforme especificado, nesse caso, não ocorre hashing.

    As senhas geradas aleatoriamente estão disponíveis a partir do MySQL 8.0.18 e possuem as características descritas na Geração de Senhas Aleatórias.

  - Para sintaxe que usa `AS 'auth_string'`, a string é assumida como já no formato exigido pelo plugin de autenticação e é armazenada como está na tabela `mysql.user`. Se um plugin exigir um valor hashado, o valor deve estar já hashado em um formato apropriado para o plugin; caso contrário, o valor não pode ser usado pelo plugin e a autenticação correta das conexões do cliente não ocorre.

    A partir do MySQL 8.0.17, uma string hash pode ser uma literal de string ou um valor hexadecimal. Este último corresponde ao tipo de valor exibido pelo `SHOW CREATE USER` para hashes de senhas que contêm caracteres não imprimíveis quando a variável de sistema `print_identified_with_as_hex` está habilitada.

    Importante

    Embora mostremos `'auth_string'` com aspas, um valor hexadecimal usado para esse propósito *não* deve ser citado.

  - Se um plugin de autenticação não realizar a hash do string de autenticação, as cláusulas `BY 'auth_string'` e `AS 'auth_string'` terão o mesmo efeito: o string de autenticação é armazenado como está na tabela do sistema `mysql.user`.

`CREATE USER` permite essas sintáticas `auth_option`:

- `IDENTIFIED BY 'auth_string'`

  Configura o plugin de autenticação da conta como o plugin padrão, passa o valor em texto claro `'auth_string'` para o plugin para possível hashing e armazena o resultado na linha da conta na tabela do sistema `mysql.user`.

- `IDENTIFIED BY RANDOM PASSWORD`

  Configura o plugin de autenticação da conta como o plugin padrão, gera uma senha aleatória, passa o valor da senha em texto claro para o plugin para possível hashing e armazena o resultado na linha da conta na tabela do sistema `mysql.user`. A instrução também retorna a senha em texto claro em um conjunto de resultados para torná-la disponível para o usuário ou aplicativo que executa a instrução. Para obter detalhes sobre o conjunto de resultados e as características das senhas geradas aleatoriamente, consulte Geração de Senhas Aleatórias.

- `IDENTIFIED WITH auth_plugin`

  Define o plugin de autenticação da conta para `auth_plugin`, limpa as credenciais para uma string vazia e armazena o resultado na linha da conta na tabela do sistema `mysql.user`.

- `IDENTIFIED WITH auth_plugin BY 'auth_string'`

  Configura o plugin de autenticação da conta para `auth_plugin`, passa o valor em texto claro `'auth_string'` para o plugin para possível hashing e armazena o resultado na linha da conta na tabela do sistema `mysql.user`.

- `IDENTIFIED WITH auth_plugin BY RANDOM PASSWORD`

  Configura o plugin de autenticação da conta para `auth_plugin`, gera uma senha aleatória, passa o valor da senha em texto claro para o plugin para possível hashing e armazena o resultado na linha da conta na tabela do sistema `mysql.user`. A instrução também retorna a senha em texto claro em um conjunto de resultados para torná-la disponível para o usuário ou aplicativo que executa a instrução. Para obter detalhes sobre o conjunto de resultados e as características das senhas geradas aleatoriamente, consulte Geração de Senhas Aleatórias.

- `IDENTIFIED WITH auth_plugin AS 'auth_string'`

  Define o plugin de autenticação da conta para `auth_plugin` e armazena o valor `'auth_string'` como está na linha da conta `mysql.user`. Se o plugin exigir uma string hash, presume-se que a string já esteja hashada no formato exigido pelo plugin.

Exemplo: Especifique a senha como texto claro; o plugin padrão é usado:

```
CREATE USER 'jeffrey'@'localhost'
  IDENTIFIED BY 'password';
```

Exemplo: Especifique o plugin de autenticação, juntamente com um valor de senha em texto claro:

```
CREATE USER 'jeffrey'@'localhost'
  IDENTIFIED WITH mysql_native_password BY 'password';
```

Em cada caso, o valor da senha armazenado na linha da conta é o valor em texto claro `'password'` após ser criptografado pelo plugin de autenticação associado à conta.

Para obter informações adicionais sobre a definição de senhas e plugins de autenticação, consulte a Seção 8.2.14, “Atribuição de Senhas de Conta”, e a Seção 8.2.17, “Autenticação Personalizável”.

##### Criar opções de autenticação multifator do usuário

A parte `auth_option` de `CREATE USER` define um método de autenticação para autenticação de um fator/único fator (1FA/SFA). A partir do MySQL 8.0.27, `CREATE USER` possui cláusulas que suportam autenticação multifator (MFA), de modo que as contas podem ter até três métodos de autenticação. Ou seja, as contas podem usar autenticação de dois fatores (2FA) ou autenticação de três fatores (3FA).

A variável de sistema `authentication_policy` define restrições para as instruções `CREATE USER` com cláusulas de autenticação multifator (MFA). Por exemplo, o ajuste `authentication_policy` controla o número de fatores de autenticação que as contas podem ter e, para cada fator, quais métodos de autenticação são permitidos. Veja Configurando a Política de Autenticação Multifator.

Para obter informações sobre as regras específicas dos fatores que determinam o plugin de autenticação padrão para cláusulas de autenticação que não nomeiam nenhum plugin, consulte o plugin de autenticação padrão.

Após `auth_option`, podem aparecer diferentes cláusulas de MFA opcionais:

- `2fa_auth_option`: Especifica um método de autenticação de fator 2. O exemplo a seguir define `caching_sha2_password` como o método de autenticação de fator 1 e `authentication_ldap_sasl` como o método de autenticação de fator 2.

  ```
  CREATE USER 'u1'@'localhost'
    IDENTIFIED WITH caching_sha2_password
      BY 'sha2_password'
    AND IDENTIFIED WITH authentication_ldap_sasl
      AS 'uid=u1_ldap,ou=People,dc=example,dc=com';
  ```

- `3fa_auth_option`: Após `2fa_auth_option`, pode aparecer uma cláusula `3fa_auth_option` para especificar um método de autenticação de fator 3. O exemplo a seguir define `caching_sha2_password` como o método de autenticação de fator 1, `authentication_ldap_sasl` como o método de autenticação de fator 2 e `authentication_fido` como o método de autenticação de fator 3

  ```
  CREATE USER 'u1'@'localhost'
    IDENTIFIED WITH caching_sha2_password
      BY 'sha2_password'
    AND IDENTIFIED WITH authentication_ldap_sasl
      AS 'uid=u1_ldap,ou=People,dc=example,dc=com'
    AND IDENTIFIED WITH authentication_fido;
  ```

- `initial_auth_option`: Especifica um método de autenticação inicial para configurar a autenticação sem senha FIDO. Como mostrado a seguir, é necessário uma autenticação temporária usando uma senha aleatória gerada ou um `auth-string` especificado pelo usuário para habilitar a autenticação sem senha FIDO.

  ```
  CREATE USER user
    IDENTIFIED WITH authentication_fido
    INITIAL AUTHENTICATION IDENTIFIED BY {RANDOM PASSWORD | 'auth_string'};
  ```

  Para obter informações sobre a configuração da autenticação sem senha usando a autenticação FIDO pluggable, consulte Autenticação sem senha FIDO.

##### Criar opções de função do usuário

A cláusula `DEFAULT ROLE` define quais papéis se tornam ativos quando o usuário se conecta ao servidor e se autentica, ou quando o usuário executa a instrução `SET ROLE DEFAULT` durante uma sessão.

Cada nome de papel usa o formato descrito na Seção 8.2.5, “Especificação de Nomes de Papel”. Por exemplo:

```
CREATE USER 'joe'@'10.0.0.1' DEFAULT ROLE administrator, developer;
```

A parte do nome do host do nome do papel, se omitida, tem como padrão `'%'`.

A cláusula `DEFAULT ROLE` permite uma lista de um ou mais nomes de papéis separados por vírgula. Esses papéis devem existir no momento em que `CREATE USER` é executado; caso contrário, a declaração gera um erro (`ER_USER_DOES_NOT_EXIST`), e o usuário não é criado.

##### Criar opções de SSL/TLS para o usuário

O MySQL pode verificar os atributos do certificado X.509, além da autenticação usual, que é baseada no nome do usuário e nas credenciais. Para informações de fundo sobre o uso do SSL/TLS com o MySQL, consulte a Seção 8.3, “Usando Conexões Encriptadas”.

Para especificar opções relacionadas ao SSL/TLS para uma conta MySQL, use uma cláusula `REQUIRE` que especifica um ou mais valores `tls_option`.

A ordem das opções `REQUIRE` não importa, mas nenhuma opção pode ser especificada duas vezes. A palavra-chave `AND` é opcional entre as opções `REQUIRE`.

`CREATE USER` permite esses valores `tls_option`:

- `NONE`

  Indica que todas as contas mencionadas na declaração não têm requisitos de SSL ou X.509. Conexões não criptografadas são permitidas se o nome do usuário e a senha forem válidos. Conexões criptografadas podem ser usadas, a critério do cliente, se o cliente tiver os arquivos de certificado e chave apropriados.

  ```
  CREATE USER 'jeffrey'@'localhost' REQUIRE NONE;
  ```

  Os clientes tentam estabelecer uma conexão segura por padrão. Para clientes que têm `REQUIRE NONE`, a tentativa de conexão é redirecionada para uma conexão não criptografada se uma conexão segura não puder ser estabelecida. Para exigir uma conexão criptografada, um cliente precisa especificar apenas a opção `--ssl-mode=REQUIRED`; a tentativa de conexão falha se uma conexão segura não puder ser estabelecida.

  `NONE` é o padrão se nenhuma opção relacionada ao SSL `REQUIRE` for especificada.

- `SSL`

  Instrui o servidor a permitir apenas conexões criptografadas para todas as contas nomeadas pelo comando.

  ```
  CREATE USER 'jeffrey'@'localhost' REQUIRE SSL;
  ```

  Os clientes tentam estabelecer uma conexão segura por padrão. Para contas que possuem `REQUIRE SSL`, a tentativa de conexão falha se uma conexão segura não puder ser estabelecida.

- `X509`

  Para todas as contas mencionadas na declaração, é necessário que os clientes apresentem um certificado válido, mas o certificado exato, o emissor e o assunto não importam. O único requisito é que seja possível verificar sua assinatura com um dos certificados CA. O uso de certificados X.509 sempre implica criptografia, portanto, a opção `SSL` é desnecessária neste caso.

  ```
  CREATE USER 'jeffrey'@'localhost' REQUIRE X509;
  ```

  Para contas com `REQUIRE X509`, os clientes devem especificar as opções `--ssl-key` e `--ssl-cert` para se conectar. (Recomenda-se, mas não é obrigatório, que `--ssl-ca` também seja especificado para que o certificado público fornecido pelo servidor possa ser verificado.) Isso é válido para `ISSUER` e `SUBJECT` também, pois essas opções `REQUIRE` implicam os requisitos de `X509`.

- `ISSUER 'issuer'`

  Para todas as contas mencionadas na declaração, é necessário que os clientes apresentem um certificado X.509 válido emitido pela CA `'issuer'`. Se um cliente apresentar um certificado válido, mas com um emissor diferente, o servidor rejeitará a conexão. O uso de certificados X.509 sempre implica criptografia, portanto, a opção `SSL` não é necessária neste caso.

  ```
  CREATE USER 'jeffrey'@'localhost'
    REQUIRE ISSUER '/C=SE/ST=Stockholm/L=Stockholm/
      O=MySQL/CN=CA/emailAddress=ca@example.com';
  ```

  Como `ISSUER` implica nos requisitos de `X509`, os clientes devem especificar as opções `--ssl-key` e `--ssl-cert` para se conectar. (Recomenda-se, mas não é obrigatório, que `--ssl-ca` também seja especificado para que o certificado público fornecido pelo servidor possa ser verificado.)

- `SUBJECT 'subject'`

  Para todas as contas mencionadas na declaração, é necessário que os clientes apresentem um certificado X.509 válido contendo o assunto `subject`. Se um cliente apresentar um certificado válido, mas com um assunto diferente, o servidor rejeitará a conexão. O uso de certificados X.509 sempre implica criptografia, portanto, a opção `SSL` não é necessária neste caso.

  ```
  CREATE USER 'jeffrey'@'localhost'
    REQUIRE SUBJECT '/C=SE/ST=Stockholm/L=Stockholm/
      O=MySQL demo client certificate/
      CN=client/emailAddress=client@example.com';
  ```

  O MySQL faz uma comparação simples de strings do valor `'subject'` com o valor no certificado, então a maiúscula e a ordem dos componentes devem ser exatamente como estão no certificado.

  Como `SUBJECT` implica nos requisitos de `X509`, os clientes devem especificar as opções `--ssl-key` e `--ssl-cert` para se conectar. (Recomenda-se, mas não é obrigatório, que `--ssl-ca` também seja especificado para que o certificado público fornecido pelo servidor possa ser verificado.)

- `CIPHER 'cipher'`

  Para todas as contas mencionadas na declaração, é necessário um método de cifra específico para criptografar as conexões. Esta opção é necessária para garantir que sejam usadas cifras e comprimentos de chave de força suficiente. A criptografia pode ser fraca se forem usados algoritmos antigos que utilizam chaves de criptografia curtas.

  ```
  CREATE USER 'jeffrey'@'localhost'
    REQUIRE CIPHER 'EDH-RSA-DES-CBC3-SHA';
  ```

As opções `SUBJECT`, `ISSUER` e `CIPHER` podem ser combinadas na cláusula `REQUIRE`:

```
CREATE USER 'jeffrey'@'localhost'
  REQUIRE SUBJECT '/C=SE/ST=Stockholm/L=Stockholm/
    O=MySQL demo client certificate/
    CN=client/emailAddress=client@example.com'
  AND ISSUER '/C=SE/ST=Stockholm/L=Stockholm/
    O=MySQL/CN=CA/emailAddress=ca@example.com'
  AND CIPHER 'EDH-RSA-DES-CBC3-SHA';
```

##### Criar usuário Opções de limite de recursos

É possível definir limites de uso dos recursos do servidor para uma conta, conforme discutido na Seção 8.2.21, “Definir Limites de Recursos da Conta”. Para fazer isso, use uma cláusula `WITH` que especifica um ou mais valores `resource_option`.

A ordem das opções `WITH` não importa, exceto que, se um limite de recurso específico for especificado várias vezes, a última instância prevalece.

`CREATE USER` permite esses valores `resource_option`:

- `MAX_QUERIES_PER_HOUR count`, `MAX_UPDATES_PER_HOUR count`, `MAX_CONNECTIONS_PER_HOUR count`

  Para todas as contas mencionadas na declaração, essas opções restringem quantas consultas, atualizações e conexões ao servidor são permitidas para cada conta durante um período de uma hora. Se `count` for `0` (o padrão), isso significa que não há nenhuma limitação para a conta.

- `MAX_USER_CONNECTIONS count`

  Para todas as contas mencionadas na declaração, restringe o número máximo de conexões simultâneas ao servidor por cada conta. Um valor não nulo de `count` especifica o limite para a conta explicitamente. Se `count` for igual a `0` (o padrão), o servidor determina o número de conexões simultâneas para a conta a partir do valor global da variável de sistema `max_user_connections`. Se `max_user_connections` também for zero, não há limite para a conta.

Exemplo:

```
CREATE USER 'jeffrey'@'localhost'
  WITH MAX_QUERIES_PER_HOUR 500 MAX_UPDATES_PER_HOUR 100;
```

##### Crie opções de gerenciamento de senhas para o usuário

O `CREATE USER` suporta vários valores `password_option` para a gestão de senhas:

- Opções de expiração da senha: Você pode expirar uma senha de conta manualmente e definir sua política de expiração da senha. As opções da política não expiram a senha. Em vez disso, elas determinam como o servidor aplica a expiração automática à conta com base na idade da senha, que é avaliada a partir da data e hora da última alteração da senha da conta.

- Opções de reutilização da senha: Você pode restringir a reutilização da senha com base no número de alterações de senha, no tempo decorrido ou em ambos.

- Opções que exigem verificação da senha: Você pode indicar se as tentativas de alterar a senha de uma conta devem especificar a senha atual, como uma verificação de que o usuário que está tentando fazer a alteração realmente conhece a senha atual.

- Opções de rastreamento de logins falhos com senha incorreta: Você pode fazer com que o servidor rastreie tentativas de login falhas e bloqueie temporariamente as contas para as quais muitas senhas incorretas consecutivas forem fornecidas. O número necessário de falhas e o tempo de bloqueio são configuráveis.

Esta seção descreve a sintaxe das opções de gerenciamento de senhas. Para obter informações sobre a definição de políticas para o gerenciamento de senhas, consulte a Seção 8.2.15, “Gerenciamento de Senhas”.

Se forem especificadas várias opções de gerenciamento de senhas de um determinado tipo, a última prevalece. Por exemplo, `PASSWORD EXPIRE DEFAULT PASSWORD EXPIRE NEVER` é o mesmo que `PASSWORD EXPIRE NEVER`.

Nota

Exceto pelas opções relacionadas ao rastreamento de logins falhos, as opções de gerenciamento de senhas aplicam-se apenas às contas que utilizam um plugin de autenticação que armazena as credenciais internamente no MySQL. Para contas que utilizam um plugin que realiza autenticação contra um sistema de credenciais externo ao MySQL, o gerenciamento de senhas também deve ser realizado externamente contra esse sistema. Para obter mais informações sobre o armazenamento interno de credenciais, consulte a Seção 8.2.15, “Gerenciamento de Senhas”.

Um cliente tem uma senha expirada se a senha da conta expirou manualmente ou a idade da senha é considerada maior que sua vida útil permitida de acordo com a política de expiração automática. Nesse caso, o servidor desconecta o cliente ou restringe as operações permitidas a ele (veja a Seção 8.2.16, “Tratamento do servidor de senhas expiradas”). As operações realizadas por um cliente restrito resultam em um erro até que o usuário estabeleça uma nova senha de conta.

`CREATE USER` permite esses valores `password_option` para controlar a expiração da senha:

- `PASSWORD EXPIRE`

  Marca imediatamente a senha expirada para todas as contas nomeadas pelo comunicado.

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE;
  ```

- `PASSWORD EXPIRE DEFAULT`

  Define todas as contas nomeadas pela declaração para que a política de expiração global seja aplicada, conforme especificado pela variável de sistema `default_password_lifetime`.

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE DEFAULT;
  ```

- `PASSWORD EXPIRE NEVER`

  Essa opção de expiração substitui a política global para todas as contas nomeadas pelo extrato. Para cada uma, ela desabilita a expiração da senha para que a senha nunca expire.

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE NEVER;
  ```

- `PASSWORD EXPIRE INTERVAL N DAY`

  Esta opção de expiração substitui a política global para todas as contas nomeadas pelo extrato. Para cada uma, ela define a duração da senha para `N` dias. A seguinte declaração exige que a senha seja alterada a cada 180 dias:

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE INTERVAL 180 DAY;
  ```

`CREATE USER` permite esses valores `password_option` para controlar a reutilização de senhas anteriores com base no número mínimo de alterações de senha exigido:

- `PASSWORD HISTORY DEFAULT`

  Define todas as contas nomeadas pela declaração para que a política global sobre o comprimento do histórico de senhas seja aplicada, para proibir a reutilização de senhas antes do número de alterações especificadas pela variável de sistema `password_history`.

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD HISTORY DEFAULT;
  ```

- `PASSWORD HISTORY N`

  Esta opção de histórico de senhas substitui a política global para todas as contas nomeadas pelo relatório. Para cada uma, define o comprimento do histórico de senhas em `N` senhas, para proibir o uso repetido de qualquer uma das `N` senhas mais recentemente escolhidas. O seguinte relatório proíbe o uso repetido de qualquer uma das 6 senhas anteriores:

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD HISTORY 6;
  ```

`CREATE USER` permite esses valores `password_option` para controlar a reutilização de senhas anteriores com base no tempo decorrido:

- `PASSWORD REUSE INTERVAL DEFAULT`

  Define todas as declarações nomeadas pela conta para que a política global sobre o tempo decorrido seja aplicada, proibindo a reutilização de senhas mais recentes do que o número de dias especificado pela variável de sistema `password_reuse_interval`.

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD REUSE INTERVAL DEFAULT;
  ```

- `PASSWORD REUSE INTERVAL N DAY`

  Esta opção de tempo excedido substitui a política global para todas as contas nomeadas pelo relatório. Para cada uma, define o intervalo de reutilização da senha para `N` dias, para proibir a reutilização de senhas mais antigas que esse número de dias. O seguinte relatório proíbe a reutilização de senhas por 360 dias:

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD REUSE INTERVAL 360 DAY;
  ```

`CREATE USER` permite esses valores `password_option` para controlar se as tentativas de alterar a senha de uma conta devem especificar a senha atual, como uma verificação de que o usuário que tenta fazer a alteração realmente conhece a senha atual:

- `PASSWORD REQUIRE CURRENT`

  Esta opção de verificação substitui a política global para todas as contas mencionadas na declaração. Para cada uma delas, exige que as alterações de senha especifiquem a senha atual.

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT;
  ```

- `PASSWORD REQUIRE CURRENT OPTIONAL`

  Esta opção de verificação substitui a política global para todas as contas mencionadas na declaração. Para cada uma delas, não é necessário que as alterações de senha especifiquem a senha atual (a senha atual pode ser fornecida, mas não é obrigatória).

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT OPTIONAL;
  ```

- `PASSWORD REQUIRE CURRENT DEFAULT`

  Define todas as declarações nomeadas pela conta para que a política global sobre verificação de senha seja aplicada, conforme especificado pela variável de sistema `password_require_current`.

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT DEFAULT;
  ```

A partir do MySQL 8.0.19, o `CREATE USER` permite esses valores `password_option` para controlar o rastreamento de logins falhos:

- `FAILED_LOGIN_ATTEMPTS N`

  Se rastrear tentativas de login de contas que especificam uma senha incorreta. `N` deve ser um número entre 0 e 32767. Um valor de 0 desativa o rastreamento de tentativas de login malsucedidas. Valores maiores que 0 indicam quantos falhas consecutivas de senha causam bloqueio temporário da conta (se `PASSWORD_LOCK_TIME` também for diferente de zero).

- `PASSWORD_LOCK_TIME {N | UNBOUNDED}`

  Quanto tempo para bloquear a conta após muitas tentativas de login consecutivas fornecer uma senha incorreta. `N` deve ser um número de 0 a 32767, ou `UNBOUNDED`. Um valor de 0 desativa o bloqueio temporário da conta. Valores maiores que 0 indicam quanto tempo para bloquear a conta em dias. Um valor de `UNBOUNDED` faz com que a duração do bloqueio da conta seja ilimitada; uma vez bloqueada, a conta permanece no estado bloqueado até ser desbloqueada. Para informações sobre as condições sob as quais o desbloqueio ocorre, consulte Rastreamento de Login Falhado e Bloqueio Temporário de Conta.

Para que o rastreamento de logins falhos e o bloqueio temporário ocorram, as opções `FAILED_LOGIN_ATTEMPTS` e `PASSWORD_LOCK_TIME` de uma conta devem ser não nulos. A seguinte declaração cria uma conta que permanece bloqueada por dois dias após quatro falhas consecutivas na senha:

```
CREATE USER 'jeffrey'@'localhost'
  FAILED_LOGIN_ATTEMPTS 4 PASSWORD_LOCK_TIME 2;
```

##### Criar Usuário Comentários e Opções de Atributos

A partir do MySQL 8.0.21, você pode criar uma conta com um comentário ou atributo opcional, conforme descrito aqui:

- **Comentário do usuário**

  Para definir um comentário do usuário, adicione `COMMENT 'user_comment'` à declaração `CREATE USER`, onde `user_comment` é o texto do comentário do usuário.

  Exemplo (omitiendo outras opções):

  ```
  CREATE USER 'jon'@'localhost' COMMENT 'Some information about Jon';
  ```

- **Atributo do usuário**

  Um atributo de usuário é um objeto JSON composto por um ou mais pares chave-valor e é definido incluindo `ATTRIBUTE 'json_object'` como parte de `CREATE USER`. `json_object` deve ser um objeto JSON válido.

  Exemplo (omitiendo outras opções):

  ```
  CREATE USER 'jim'@'localhost'
      ATTRIBUTE '{"fname": "James", "lname": "Scott", "phone": "123-456-7890"}';
  ```

Os comentários dos usuários e os atributos dos usuários são armazenados juntos na coluna `ATTRIBUTE` da tabela do Schema de Informações `USER_ATTRIBUTES`. Esta consulta exibe a linha desta tabela inserida pela declaração mostrada anteriormente para criar o usuário `jim@localhost`:

```
mysql> SELECT * FROM INFORMATION_SCHEMA.USER_ATTRIBUTES
    ->    WHERE USER = 'jim' AND HOST = 'localhost'\G
*************************** 1. row ***************************
     USER: jim
     HOST: localhost
ATTRIBUTE: {"fname": "James", "lname": "Scott", "phone": "123-456-7890"}
1 row in set (0.00 sec)
```

A opção `COMMENT` na realidade fornece um atalho para definir um atributo do usuário cujo único elemento tem `comment` como sua chave e cujo valor é o argumento fornecido para a opção. Você pode ver isso executando a declaração `CREATE USER 'jon'@'localhost' COMMENT 'Some information about Jon'` e observando a linha que ela insere na tabela `USER_ATTRIBUTES`:

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

Você não pode usar `COMMENT` e `ATTRIBUTE` juntos na mesma declaração `CREATE USER`; tentar fazer isso causa um erro de sintaxe. Para definir um comentário do usuário simultaneamente com a definição de um atributo do usuário, use `ATTRIBUTE` e inclua em seu argumento um valor com uma chave `comment`, assim:

```
mysql> CREATE USER 'bill'@'localhost'
    ->        ATTRIBUTE '{"fname":"William", "lname":"Schmidt",
    ->        "comment":"Website developer"}';
Query OK, 0 rows affected (0.16 sec)
```

Como o conteúdo da linha `ATTRIBUTE` é um objeto JSON, você pode usar qualquer função ou operador JSON MySQL apropriado para manipulá-lo, como mostrado aqui:

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

Para definir ou fazer alterações no comentário do usuário ou no atributo do usuário para um usuário existente, você pode usar uma opção `COMMENT` ou `ATTRIBUTE` com uma instrução `ALTER USER`.

Como o comentário do usuário e o atributo do usuário são armazenados juntos internamente em uma única coluna `JSON`, isso estabelece um limite superior para o tamanho combinado deles; consulte Requisitos de Armazenamento JSON para obter mais informações.

Veja também a descrição da tabela Schema de Informações `USER_ATTRIBUTES` para obter mais informações e exemplos.

##### Criar opções de bloqueio de conta do usuário

O MySQL suporta o bloqueio e desbloqueio de contas usando as opções `ACCOUNT LOCK` e `ACCOUNT UNLOCK`, que especificam o estado de bloqueio de uma conta. Para uma discussão adicional, consulte a Seção 8.2.20, “Bloqueio de Conta”.

Se várias opções de bloqueio de conta forem especificadas, a última tem precedência.

##### Crie o Usuário de Registro Binário

`CREATE USER` é escrito no log binário se ele for bem-sucedido, mas não se ele falhar; nesse caso, ocorre um rollback e nenhuma alteração é feita. Uma declaração escrita no log binário inclui todos os usuários nomeados. Se a cláusula `IF NOT EXISTS` for fornecida, isso inclui até mesmo usuários que já existem e não foram criados.

A declaração escrita no log binário especifica um plugin de autenticação para cada usuário, determinado da seguinte forma:

- O plugin mencionado na declaração original, se um foi especificado.

- Caso contrário, o plugin de autenticação padrão. Em particular, se um usuário `u1` já existir e usar um plugin de autenticação não padrão, a declaração escrita no log binário para `CREATE USER IF NOT EXISTS u1` nomeia o plugin de autenticação padrão. (Se a declaração escrita no log binário precisar especificar um plugin de autenticação não padrão para um usuário, inclua-o na declaração original.)

Se o servidor adicionar o plugin de autenticação padrão para usuários não existentes na declaração escrita no log binário, ele escreverá uma mensagem de aviso no log de erros, nomeando esses usuários.

Se a declaração original especificar a opção `FAILED_LOGIN_ATTEMPTS` ou `PASSWORD_LOCK_TIME`, a declaração escrita no log binário incluirá a opção.

As declarações `CREATE USER` com cláusulas que suportam a autenticação multifator (MFA) são escritas no log binário.

- As declarações `CREATE USER ... IDENTIFIED WITH .. INITIAL AUTHENTICATION IDENTIFIED WITH ...` são escritas no log binário como `CREATE USER .. IDENTIFIED WITH .. INITIAL AUTHENTICATION IDENTIFIED WITH .. AS 'password-hash'`, onde o `password-hash` é o `auth-string` especificado pelo usuário ou a senha aleatória gerada pelo servidor quando a cláusula `RANDOM PASSWORD` é especificada.
