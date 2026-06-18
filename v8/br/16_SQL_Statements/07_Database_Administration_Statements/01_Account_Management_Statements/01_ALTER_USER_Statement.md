#### 15.7.1.1 Declaração ALTER USER

```
ALTER USER [IF EXISTS]
    user [auth_option] [, user [auth_option]] ...
    [REQUIRE {NONE | tls_option [[AND] tls_option] ...}]
    [WITH resource_option [resource_option] ...]
    [password_option | lock_option] ...
    [COMMENT 'comment_string' | ATTRIBUTE 'json_object']

ALTER USER [IF EXISTS]
    USER() user_func_auth_option

ALTER USER [IF EXISTS]
    user [registration_option]

ALTER USER [IF EXISTS]
    USER() [registration_option]

ALTER USER [IF EXISTS]
    user DEFAULT ROLE
    {NONE | ALL | role [, role ] ...}

user:
    (see Section 8.2.4, “Specifying Account Names”)

auth_option: {
    IDENTIFIED BY 'auth_string'
        [REPLACE 'current_auth_string']
        [RETAIN CURRENT PASSWORD]
  | IDENTIFIED BY RANDOM PASSWORD
        [REPLACE 'current_auth_string']
        [RETAIN CURRENT PASSWORD]
  | IDENTIFIED WITH auth_plugin
  | IDENTIFIED WITH auth_plugin BY 'auth_string'
        [REPLACE 'current_auth_string']
        [RETAIN CURRENT PASSWORD]
  | IDENTIFIED WITH auth_plugin BY RANDOM PASSWORD
        [REPLACE 'current_auth_string']
        [RETAIN CURRENT PASSWORD]
  | IDENTIFIED WITH auth_plugin AS 'auth_string'
  | DISCARD OLD PASSWORD
  | ADD factor factor_auth_option [ADD factor factor_auth_option]
  | MODIFY factor factor_auth_option [MODIFY factor factor_auth_option]
  | DROP factor [DROP factor]
}

user_func_auth_option: {
    IDENTIFIED BY 'auth_string'
        [REPLACE 'current_auth_string']
        [RETAIN CURRENT PASSWORD]
  | DISCARD OLD PASSWORD
}

factor_auth_option: {
    IDENTIFIED BY 'auth_string'
  | IDENTIFIED BY RANDOM PASSWORD
  | IDENTIFIED WITH auth_plugin BY 'auth_string'
  | IDENTIFIED WITH auth_plugin BY RANDOM PASSWORD
  | IDENTIFIED WITH auth_plugin AS 'auth_string'
}

registration_option: {
    factor INITIATE REGISTRATION
  | factor FINISH REGISTRATION SET CHALLENGE_RESPONSE AS 'auth_string'
  | factor UNREGISTER
}

factor: {2 | 3} FACTOR

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

A declaração `ALTER USER` modifica as contas do MySQL. Ela permite que a autenticação, o papel, SSL/TLS, limite de recursos, gerenciamento de senhas, comentário e propriedades de atributos sejam modificados para contas existentes. Também pode ser usada para bloquear e desbloquear contas.

Na maioria dos casos, `ALTER USER` requer o privilégio global `CREATE USER` ou o privilégio `UPDATE` para o esquema de sistema `mysql`. As exceções são:

- Qualquer cliente que se conecte ao servidor usando uma conta não anônima pode alterar a senha dessa conta. (Em particular, você pode alterar sua própria senha.) Para ver qual conta o servidor autenticou você, invocando a função `CURRENT_USER()`:

  ```
  SELECT CURRENT_USER();
  ```

- Para a sintaxe `DEFAULT ROLE`, `ALTER USER` requer esses privilégios:

  - Para definir os papéis padrão para outro usuário, é necessário o privilégio global `CREATE USER` ou o privilégio `UPDATE` para a tabela de sistema `mysql.default_roles`.

  - Definir os papéis padrão para você não requer privilégios especiais, desde que os papéis que você deseja como padrão tenham sido concedidos a você.

- Para fazer declarações que modifiquem senhas secundárias, são necessários esses privilégios:

  - O privilégio `APPLICATION_PASSWORD_ADMIN` é necessário para usar a cláusula `RETAIN CURRENT PASSWORD` ou `DISCARD OLD PASSWORD` para declarações `ALTER USER` que se aplicam à sua própria conta. O privilégio é necessário para manipular sua própria senha secundária, pois a maioria dos usuários exige apenas uma senha.

  - Se uma conta deve ser autorizada a manipular senhas secundárias para todas as contas, ela requer o privilégio `CREATE USER` em vez de `APPLICATION_PASSWORD_ADMIN`.

Quando a variável de sistema `read_only` está habilitada, o `ALTER USER` também requer o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`).

A partir do MySQL 8.0.27, essas considerações sobre privilégios adicionais se aplicam:

- A variável de sistema `authentication_policy` estabelece certas restrições sobre como as cláusulas relacionadas à autenticação das instruções `ALTER USER` podem ser usadas; para detalhes, consulte a descrição dessa variável. Essas restrições não se aplicam se você tiver o privilégio `AUTHENTICATION_POLICY_ADMIN`.

- Para modificar uma conta que utiliza autenticação sem senha, você deve ter o privilégio `PASSWORDLESS_USER_ADMIN`.

Por padrão, ocorre um erro se você tentar modificar um usuário que não existe. Se a cláusula `IF EXISTS` for fornecida, a instrução gera um aviso para cada usuário nomeado que não existe, em vez de um erro.

Importante

Em algumas circunstâncias, `ALTER USER` pode ser registrado em logs do servidor ou no lado do cliente em um arquivo de histórico, como `~/.mysql_history`, o que significa que senhas em texto claro podem ser lidas por qualquer pessoa que tenha acesso de leitura a essas informações. Para obter informações sobre as condições sob as quais isso ocorre para os logs do servidor e como controlá-lo, consulte a Seção 8.1.2.3, “Senhas e Registro”. Para informações semelhantes sobre o registro no lado do cliente, consulte a Seção 6.5.1.3, “Registro do Cliente do MySQL”.

Há vários aspectos da declaração `ALTER USER`, descritos nos seguintes tópicos:

- ALTERAR USUÁRIO Visão geral
- Opções de Autenticação de Alterar Usuário
- Alterar opções de autenticação multifator do usuário
- ALTERAR USUÁRIO Opções de registro
- Alterar opções de função do usuário
- ALTERAR OPÇÕES DE SSL/TLS DO USUÁRIO
- ALTERAR USUÁRIO Opções de Limite de Recursos
- ALTERAR USUÁRIO Opções de Gerenciamento de Senhas
- ALTERAR USUÁRIO Comentários e Opções de Atributos
- ALTERAR USUÁRIO Opções de Bloqueio de Conta
- Alterar Usuário de Registro Binário

##### ALTERAR USUÁRIO Visão geral

Para cada conta afetada, `ALTER USER` modifica a linha correspondente na tabela do sistema `mysql.user` para refletir as propriedades especificadas na declaração. Propriedades não especificadas retêm seus valores atuais.

Cada nome de conta usa o formato descrito na Seção 8.2.4, “Especificando Nomes de Conta”. A parte do nome de conta que contém o nome do host, se omitida, tem como padrão `'%'`. Também é possível especificar `CURRENT_USER` ou `CURRENT_USER()` para se referir à conta associada à sessão atual.

Em apenas um caso, a conta pode ser especificada com a função `USER()`:

```
ALTER USER USER() IDENTIFIED BY 'auth_string';
```

Essa sintaxe permite alterar sua própria senha sem nomear sua conta literalmente. (A sintaxe também suporta as cláusulas `REPLACE`, `RETAIN CURRENT PASSWORD` e `DISCARD OLD PASSWORD`, descritas em Opções de Autenticação de ALTER USER.)

Para a sintaxe `ALTER USER` que permite que um valor `auth_option` siga um valor `user`, `auth_option` indica como a conta autentica, especificando um plugin de autenticação de conta, credenciais (por exemplo, uma senha) ou ambos. Cada valor `auth_option` se aplica *apenas* à conta nomeada imediatamente antes dele.

De acordo com as especificações do `user`, a declaração pode incluir opções para SSL/TLS, limite de recursos, gerenciamento de senhas e propriedades de bloqueio. Todas essas opções são *globais* para a declaração e aplicam-se a *todas* as contas mencionadas na declaração.

Exemplo: Alterar a senha de uma conta e expira-la. Como resultado, o usuário deve se conectar com a senha nomeada e escolher uma nova na próxima conexão:

```
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED BY 'new_password' PASSWORD EXPIRE;
```

Exemplo: Modifique uma conta para usar o plugin de autenticação `caching_sha2_password` e a senha fornecida. Exija que uma nova senha seja escolhida a cada 180 dias e habilite o rastreamento de tentativas de login malsucedidas, de modo que três senhas incorretas consecutivas causem bloqueio temporário da conta por dois dias:

```
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED WITH caching_sha2_password BY 'new_password'
  PASSWORD EXPIRE INTERVAL 180 DAY
  FAILED_LOGIN_ATTEMPTS 3 PASSWORD_LOCK_TIME 2;
```

Exemplo: Bloquear ou desbloquear uma conta:

```
ALTER USER 'jeffrey'@'localhost' ACCOUNT LOCK;
ALTER USER 'jeffrey'@'localhost' ACCOUNT UNLOCK;
```

Exemplo: Exigir uma conta para se conectar usando SSL e estabelecer um limite de 20 conexões por hora:

```
ALTER USER 'jeffrey'@'localhost'
  REQUIRE SSL WITH MAX_CONNECTIONS_PER_HOUR 20;
```

Exemplo: Alterar várias contas, especificando algumas propriedades por conta e algumas propriedades globais:

```
ALTER USER
  'jeffrey'@'localhost'
    IDENTIFIED BY 'jeffrey_new_password',
  'jeanne'@'localhost',
  'josh'@'localhost'
    IDENTIFIED BY 'josh_new_password'
    REPLACE 'josh_current_password'
    RETAIN CURRENT PASSWORD
  REQUIRE SSL WITH MAX_USER_CONNECTIONS 2
  PASSWORD HISTORY 5;
```

O valor `IDENTIFIED BY` que segue `jeffrey` aplica-se apenas à conta imediatamente anterior, portanto, ele altera a senha para `'jeffrey_new_password'` apenas para `jeffrey`. Para `jeanne`, não há um valor por conta (portanto, a senha permanece inalterada). Para `josh`, `IDENTIFIED BY` estabelece uma nova senha (`'josh_new_password'`), `REPLACE` é especificado para verificar se o usuário que emite a declaração `ALTER USER` conhece a senha atual (`'josh_current_password'`), e essa senha atual também é mantida como a senha secundária da conta. (Como resultado, `josh` pode se conectar com a senha primária ou secundária.)

As propriedades restantes se aplicam globalmente a todas as contas mencionadas na declaração, portanto, para ambas as contas:

- Para usar SSL, são necessárias conexões.

- A conta pode ser usada para até duas conexões simultâneas.

- As alterações de senha não podem reutilizar nenhuma das cinco senhas mais recentes.

Exemplo: Descarte a senha secundária para `josh`, deixando a conta com apenas sua senha primária:

```
ALTER USER 'josh'@'localhost' DISCARD OLD PASSWORD;
```

Na ausência de um tipo específico de opção, a conta permanece inalterada nesse aspecto. Por exemplo, sem a opção de bloqueio, o estado de bloqueio da conta não é alterado.

##### Opções de Autenticação de Alterar Usuário

O nome da conta pode ser seguido por uma opção de autenticação `auth_option` que especifica o plugin de autenticação da conta, as credenciais ou ambos. Também pode incluir uma cláusula de verificação de senha que especifica a senha atual da conta a ser substituída e cláusulas que gerenciam se uma conta tem uma senha secundária.

Nota

As cláusulas para geração de senha aleatória, verificação de senha e senhas secundárias aplicam-se apenas às contas que utilizam um plugin de autenticação que armazena as credenciais internamente no MySQL. Para contas que utilizam um plugin que realiza autenticação contra um sistema de credenciais externo ao MySQL, o gerenciamento de senhas também deve ser realizado externamente contra esse sistema. Para obter mais informações sobre o armazenamento interno de credenciais, consulte a Seção 8.2.15, “Gerenciamento de Senhas”.

- `auth_plugin` nomeia um plugin de autenticação. O nome do plugin pode ser uma literal de string com aspas ou um nome não citado. Os nomes dos plugins são armazenados na coluna `plugin` da tabela do sistema `mysql.user`.

  Para a sintaxe `auth_option` que não especifica um plugin de autenticação, o servidor atribui o plugin padrão, conforme descrito em O Plugin de Autenticação Padrão. Para descrições de cada plugin, consulte a Seção 8.4.1, “Plugins de Autenticação”.

- As credenciais armazenadas internamente são armazenadas na tabela do sistema `mysql.user`. Um valor `'auth_string'` ou `RANDOM PASSWORD` especifica as credenciais da conta, seja como uma string em texto claro (não criptografada) ou hashada no formato esperado pelo plugin de autenticação associado à conta, respectivamente:

  - Para sintaxe que usa `BY 'auth_string'`, a string é em texto claro e é passada para o plugin de autenticação para possível hashing. O resultado retornado pelo plugin é armazenado na tabela `mysql.user`. Um plugin pode usar o valor conforme especificado, nesse caso, não ocorre hashing.

  - Para sintaxe que usa `BY RANDOM PASSWORD`, o MySQL gera uma senha aleatória e a passa como texto claro para o plugin de autenticação para possível hashing. O resultado retornado pelo plugin é armazenado na tabela `mysql.user`. Um plugin pode usar o valor conforme especificado, nesse caso, não ocorre hashing.

    As senhas geradas aleatoriamente estão disponíveis a partir do MySQL 8.0.18 e possuem as características descritas na Geração de Senhas Aleatórias.

  - Para sintaxe que usa `AS 'auth_string'`, a string é assumida como já no formato exigido pelo plugin de autenticação e é armazenada como está na tabela `mysql.user`. Se um plugin exigir um valor hashado, o valor deve estar já hashado em um formato apropriado para o plugin; caso contrário, o valor não pode ser usado pelo plugin e a autenticação correta das conexões do cliente não ocorre.

    A partir do MySQL 8.0.17, uma string hash pode ser uma literal de string ou um valor hexadecimal. Este último corresponde ao tipo de valor exibido pelo `SHOW CREATE USER` para hashes de senhas que contêm caracteres não imprimíveis quando a variável de sistema `print_identified_with_as_hex` está habilitada.

  - Se um plugin de autenticação não realizar a hash do string de autenticação, as cláusulas `BY 'auth_string'` e `AS 'auth_string'` terão o mesmo efeito: o string de autenticação é armazenado como está na tabela do sistema `mysql.user`.

- A cláusula `REPLACE 'current_auth_string'` realiza a verificação da senha e está disponível a partir do MySQL 8.0.13. Se fornecida:

  - `REPLACE` especifica a senha atual da conta a ser substituída, como uma string em texto claro (não criptografada).

  - A cláusula deve ser fornecida se as alterações de senha para a conta forem necessárias para especificar a senha atual, como uma verificação de que o usuário que está tentando fazer a alteração realmente conhece a senha atual.

  - A cláusula é opcional, pois a mudança da senha da conta pode, mas não precisa, especificar a senha atual.

  - A declaração falha se a cláusula for fornecida, mas não corresponder à senha atual, mesmo que a cláusula seja opcional.

  - `REPLACE` pode ser especificado apenas ao alterar a senha da conta do usuário atual.

  Para obter mais informações sobre a verificação da senha, especificando a senha atual, consulte a Seção 8.2.15, “Gerenciamento de Senhas”.

- As cláusulas `RETAIN CURRENT PASSWORD` e `DISCARD OLD PASSWORD` implementam a capacidade de senha dupla e estão disponíveis a partir do MySQL 8.0.14. Ambas são opcionais, mas, se fornecidas, têm os seguintes efeitos:

  - `RETAIN CURRENT PASSWORD` mantém a senha atual da conta como sua senha secundária, substituindo qualquer senha secundária existente. A nova senha se torna a senha primária, mas os clientes podem usar a conta para se conectar ao servidor usando a senha primária ou secundária. (Exceção: Se a nova senha especificada pela declaração `ALTER USER` for vazia, a senha secundária também ficará vazia, mesmo que `RETAIN CURRENT PASSWORD` seja fornecida.)

  - Se você especificar `RETAIN CURRENT PASSWORD` para uma conta que tem uma senha primária vazia, a declaração falha.

  - Se uma conta tiver uma senha secundária e você alterar sua senha primária sem especificar `RETAIN CURRENT PASSWORD`, a senha secundária permanecerá inalterada.

  - Se você alterar o plugin de autenticação atribuído à conta, a senha secundária será descartada. Se você alterar o plugin de autenticação e também especificar `RETAIN CURRENT PASSWORD`, a declaração falhará.

  - `DISCARD OLD PASSWORD` descarta a senha secundária, se existir. A conta mantém apenas sua senha primária, e os clientes podem usar a conta para se conectar ao servidor apenas com a senha primária.

  Para obter mais informações sobre o uso de senhas duplas, consulte a Seção 8.2.15, “Gerenciamento de Senhas”.

`ALTER USER` permite essas sintáticas `auth_option`:

- `IDENTIFIED BY 'auth_string' [REPLACE 'current_auth_string'] [RETAIN CURRENT PASSWORD]`

  Configura o plugin de autenticação da conta como o plugin padrão, passa o valor em texto claro `'auth_string'` para o plugin para possível hashing e armazena o resultado na linha da conta na tabela do sistema `mysql.user`.

  A cláusula `REPLACE`, se fornecida, especifica a senha atual da conta, conforme descrito anteriormente nesta seção.

  A cláusula `RETAIN CURRENT PASSWORD`, se fornecida, faz com que a senha atual da conta seja mantida como sua senha secundária, conforme descrito anteriormente nesta seção.

- `IDENTIFIED BY RANDOM PASSWORD [REPLACE 'current_auth_string'] [RETAIN CURRENT PASSWORD]`

  Configura o plugin de autenticação da conta como o plugin padrão, gera uma senha aleatória, passa o valor da senha em texto claro para o plugin para possível hashing e armazena o resultado na linha da conta na tabela do sistema `mysql.user`. A instrução também retorna a senha em texto claro em um conjunto de resultados para torná-la disponível para o usuário ou aplicativo que executa a instrução. Para obter detalhes sobre o conjunto de resultados e as características das senhas geradas aleatoriamente, consulte Geração de Senhas Aleatórias.

  A cláusula `REPLACE`, se fornecida, especifica a senha atual da conta, conforme descrito anteriormente nesta seção.

  A cláusula `RETAIN CURRENT PASSWORD`, se fornecida, faz com que a senha atual da conta seja mantida como sua senha secundária, conforme descrito anteriormente nesta seção.

- `IDENTIFIED WITH auth_plugin`

  Define o plugin de autenticação da conta para `auth_plugin`, limpa as credenciais para uma string vazia (as credenciais estão associadas ao antigo plugin de autenticação, e não ao novo), e armazena o resultado na linha da conta na tabela do sistema `mysql.user`.

  Além disso, a senha está marcada como expirada. O usuário deve escolher uma nova senha na próxima conexão.

- `IDENTIFIED WITH auth_plugin BY 'auth_string' [REPLACE 'current_auth_string'] [RETAIN CURRENT PASSWORD]`

  Configura o plugin de autenticação da conta para `auth_plugin`, passa o valor em texto claro `'auth_string'` para o plugin para possível hashing e armazena o resultado na linha da conta na tabela do sistema `mysql.user`.

  A cláusula `REPLACE`, se fornecida, especifica a senha atual da conta, conforme descrito anteriormente nesta seção.

  A cláusula `RETAIN CURRENT PASSWORD`, se fornecida, faz com que a senha atual da conta seja mantida como sua senha secundária, conforme descrito anteriormente nesta seção.

- `IDENTIFIED WITH auth_plugin BY RANDOM PASSWORD [REPLACE 'current_auth_string'] [RETAIN CURRENT PASSWORD]`

  Configura o plugin de autenticação da conta para `auth_plugin`, gera uma senha aleatória, passa o valor da senha em texto claro para o plugin para possível hashing e armazena o resultado na linha da conta na tabela do sistema `mysql.user`. A instrução também retorna a senha em texto claro em um conjunto de resultados para torná-la disponível para o usuário ou aplicativo que executa a instrução. Para obter detalhes sobre o conjunto de resultados e as características das senhas geradas aleatoriamente, consulte Geração de Senhas Aleatórias.

  A cláusula `REPLACE`, se fornecida, especifica a senha atual da conta, conforme descrito anteriormente nesta seção.

  A cláusula `RETAIN CURRENT PASSWORD`, se fornecida, faz com que a senha atual da conta seja mantida como sua senha secundária, conforme descrito anteriormente nesta seção.

- `IDENTIFIED WITH auth_plugin AS 'auth_string'`

  Define o plugin de autenticação da conta para `auth_plugin` e armazena o valor `'auth_string'` como está na linha da conta `mysql.user`. Se o plugin exigir uma string hash, presume-se que a string já esteja hashada no formato exigido pelo plugin.

- `DISCARD OLD PASSWORD`

  Descarte a senha secundária da conta, se houver, conforme descrito anteriormente nesta seção.

Exemplo: Especifique a senha como texto claro; o plugin padrão é usado:

```
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED BY 'password';
```

Exemplo: Especifique o plugin de autenticação, juntamente com um valor de senha em texto claro:

```
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED WITH mysql_native_password
             BY 'password';
```

Exemplo: Como no exemplo anterior, mas, além disso, especifique a senha atual como um valor em texto claro para atender a qualquer requisito da conta que o usuário que faz a alteração saiba que a senha:

```
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED WITH mysql_native_password
             BY 'password'
             REPLACE 'current_password';
```

A declaração anterior falha, a menos que o usuário atual seja `jeffrey` porque `REPLACE` é permitido apenas para alterações na senha do usuário atual.

Exemplo: Estabeleça uma nova senha primária e mantenha a senha existente como senha secundária:

```
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED BY 'new_password'
  RETAIN CURRENT PASSWORD;
```

Exemplo: Descarte a senha secundária, deixando a conta com apenas sua senha primária:

```
ALTER USER 'jeffery'@'localhost' DISCARD OLD PASSWORD;
```

Exemplo: Especifique o plugin de autenticação, juntamente com um valor de senha criptografada:

```
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED WITH mysql_native_password
             AS '*6C8989366EAF75BB670AD8EA7A7FC1176A95CEF4';
```

Para obter informações adicionais sobre a definição de senhas e plugins de autenticação, consulte a Seção 8.2.14, “Atribuição de Senhas de Conta”, e a Seção 8.2.17, “Autenticação Personalizável”.

##### Alterar opções de autenticação multifator do usuário

A partir do MySQL 8.0.27, as cláusulas `ALTER USER`, `ADD`, `MODIFY` e `DROP` permitem que fatores de autenticação sejam adicionados, modificados ou removidos. Em cada caso, a cláusula especifica uma operação a ser realizada em um fator de autenticação e, opcionalmente, uma operação em outro fator de autenticação. Para cada operação, o item `factor` especifica a palavra-chave `FACTOR`, precedida pelo número 2 ou 3, para indicar se a operação se aplica ao segundo ou terceiro fator de autenticação. (1 não é permitido neste contexto. Para agir no primeiro fator de autenticação, use a sintaxe descrita em ALTER USER Authentication Options.)

As restrições da cláusula de autenticação multifator `ALTER USER` são definidas pela variável de sistema `authentication_policy`. Por exemplo, o ajuste `authentication_policy` controla o número de fatores de autenticação que as contas podem ter e, para cada fator, quais métodos de autenticação são permitidos. Veja Configurando a Política de Autenticação Multifator.

Quando `ALTER USER` adiciona, modifica ou exclui o segundo e terceiro fatores em uma única instrução, as operações são executadas sequencialmente, mas se qualquer operação na sequência falhar, toda a instrução `ALTER USER` falhará.

Para `ADD`, cada fator nomeado não pode já existir ou não pode ser adicionado. Para `MODIFY` e `DROP`, cada fator nomeado deve existir para ser modificado ou excluído. Se forem definidos um segundo e um terceiro fator, a exclusão do segundo fator faz com que o terceiro fator assuma seu lugar como o segundo fator.

Essa declaração elimina os fatores de autenticação 2 e 3, o que tem o efeito de converter a conta de 3FA para 1FA:

```
ALTER USER 'user' DROP 2 FACTOR 3 FACTOR;
```

Para exemplos adicionais de `ADD`, `MODIFY` e `DROP`, consulte Começando com Autenticação Multifator.

Para obter informações sobre as regras específicas dos fatores que determinam o plugin de autenticação padrão para cláusulas de autenticação que não nomeiam um plugin, consulte o plugin de autenticação padrão.

##### ALTERAR USUÁRIO Opções de registro

A partir do MySQL 8.0.27, o `ALTER USER` possui cláusulas que permitem que dispositivos FIDO sejam registrados e desregistrados. Para mais informações, consulte o uso da autenticação FIDO, Desregistro de Dispositivos FIDO e a descrição da opção do cliente **mysql** `--fido-register-factor`.

A opção **mysql** client `--fido-register-factor` (cliente **mysql** `--fido-register-factor`), usada para o registro do dispositivo FIDO, faz com que o cliente **mysql** gere e execute as instruções `INITIATE REGISTRATION` e `FINISH REGISTRATION`. Essas instruções não são destinadas à execução manual.

##### Alterar opções de função do usuário

`ALTER USER ... DEFAULT ROLE` define quais papéis se tornam ativos quando o usuário se conecta ao servidor e se autentica, ou quando o usuário executa a instrução `SET ROLE DEFAULT` durante uma sessão.

`ALTER USER ... DEFAULT ROLE` é uma sintaxe alternativa para `SET DEFAULT ROLE` (consulte a Seção 15.7.1.9, “Instrução SET DEFAULT ROLE”). No entanto, `ALTER USER` pode definir o padrão apenas para um único usuário, enquanto `SET DEFAULT ROLE` pode definir o padrão para vários usuários. Por outro lado, você pode especificar `CURRENT_USER` como o nome do usuário para a instrução `ALTER USER`, enquanto não é possível para `SET DEFAULT ROLE`.

Cada nome de conta do usuário usa o formato descrito anteriormente.

Cada nome de papel usa o formato descrito na Seção 8.2.5, “Especificação de Nomes de Papel”. Por exemplo:

```
ALTER USER 'joe'@'10.0.0.1' DEFAULT ROLE administrator, developer;
```

A parte do nome do host do nome do papel, se omitida, tem como padrão `'%'`.

A cláusula que segue as palavras-chave `DEFAULT ROLE` permite esses valores:

- `NONE`: Defina o padrão para `NONE` (sem papéis).

- `ALL`: Defina o padrão para todas as funções concedidas à conta.

- `role [, role ] ...`: Defina o padrão para os papéis nomeados, que devem existir e estar concedidos à conta no momento em que o `ALTER USER ... DEFAULT ROLE` é executado.

##### ALTERAR OPÇÕES DE SSL/TLS DO USUÁRIO

O MySQL pode verificar os atributos do certificado X.509, além da autenticação usual, que é baseada no nome do usuário e nas credenciais. Para informações de fundo sobre o uso do SSL/TLS com o MySQL, consulte a Seção 8.3, “Usando Conexões Encriptadas”.

Para especificar opções relacionadas ao SSL/TLS para uma conta MySQL, use uma cláusula `REQUIRE` que especifica um ou mais valores `tls_option`.

A ordem das opções `REQUIRE` não importa, mas nenhuma opção pode ser especificada duas vezes. A palavra-chave `AND` é opcional entre as opções `REQUIRE`.

`ALTER USER` permite esses valores `tls_option`:

- `NONE`

  Indica que todas as contas mencionadas na declaração não têm requisitos de SSL ou X.509. Conexões não criptografadas são permitidas se o nome do usuário e a senha forem válidos. Conexões criptografadas podem ser usadas, a critério do cliente, se o cliente tiver os arquivos de certificado e chave apropriados.

  ```
  ALTER USER 'jeffrey'@'localhost' REQUIRE NONE;
  ```

  Os clientes tentam estabelecer uma conexão segura por padrão. Para clientes que têm `REQUIRE NONE`, a tentativa de conexão é redirecionada para uma conexão não criptografada se uma conexão segura não puder ser estabelecida. Para exigir uma conexão criptografada, um cliente precisa especificar apenas a opção `--ssl-mode=REQUIRED`; a tentativa de conexão falha se uma conexão segura não puder ser estabelecida.

- `SSL`

  Instrui o servidor a permitir apenas conexões criptografadas para todas as contas nomeadas pelo comando.

  ```
  ALTER USER 'jeffrey'@'localhost' REQUIRE SSL;
  ```

  Os clientes tentam estabelecer uma conexão segura por padrão. Para contas que possuem `REQUIRE SSL`, a tentativa de conexão falha se uma conexão segura não puder ser estabelecida.

- `X509`

  Para todas as contas mencionadas na declaração, é necessário que os clientes apresentem um certificado válido, mas o certificado exato, o emissor e o assunto não importam. O único requisito é que seja possível verificar sua assinatura com um dos certificados CA. O uso de certificados X.509 sempre implica criptografia, portanto, a opção `SSL` é desnecessária neste caso.

  ```
  ALTER USER 'jeffrey'@'localhost' REQUIRE X509;
  ```

  Para contas com `REQUIRE X509`, os clientes devem especificar as opções `--ssl-key` e `--ssl-cert` para se conectar. (Recomenda-se, mas não é obrigatório, que `--ssl-ca` também seja especificado para que o certificado público fornecido pelo servidor possa ser verificado.) Isso é válido para `ISSUER` e `SUBJECT` também, pois essas opções `REQUIRE` implicam os requisitos de `X509`.

- `ISSUER 'issuer'`

  Para todas as contas mencionadas na declaração, é necessário que os clientes apresentem um certificado X.509 válido emitido pela CA `'issuer'`. Se um cliente apresentar um certificado válido, mas com um emissor diferente, o servidor rejeitará a conexão. O uso de certificados X.509 sempre implica criptografia, portanto, a opção `SSL` não é necessária neste caso.

  ```
  ALTER USER 'jeffrey'@'localhost'
    REQUIRE ISSUER '/C=SE/ST=Stockholm/L=Stockholm/
      O=MySQL/CN=CA/emailAddress=ca@example.com';
  ```

  Como `ISSUER` implica nos requisitos de `X509`, os clientes devem especificar as opções `--ssl-key` e `--ssl-cert` para se conectar. (Recomenda-se, mas não é obrigatório, que `--ssl-ca` também seja especificado para que o certificado público fornecido pelo servidor possa ser verificado.)

- `SUBJECT 'subject'`

  Para todas as contas mencionadas na declaração, é necessário que os clientes apresentem um certificado X.509 válido contendo o assunto `subject`. Se um cliente apresentar um certificado válido, mas com um assunto diferente, o servidor rejeitará a conexão. O uso de certificados X.509 sempre implica criptografia, portanto, a opção `SSL` não é necessária neste caso.

  ```
  ALTER USER 'jeffrey'@'localhost'
    REQUIRE SUBJECT '/C=SE/ST=Stockholm/L=Stockholm/
      O=MySQL demo client certificate/
      CN=client/emailAddress=client@example.com';
  ```

  O MySQL faz uma comparação simples de strings do valor `'subject'` com o valor no certificado, então a maiúscula e a ordem dos componentes devem ser exatamente como estão no certificado.

  Como `SUBJECT` implica nos requisitos de `X509`, os clientes devem especificar as opções `--ssl-key` e `--ssl-cert` para se conectar. (Recomenda-se, mas não é obrigatório, que `--ssl-ca` também seja especificado para que o certificado público fornecido pelo servidor possa ser verificado.)

- `CIPHER 'cipher'`

  Para todas as contas mencionadas na declaração, é necessário um método de cifra específico para criptografar as conexões. Esta opção é necessária para garantir que sejam usadas cifras e comprimentos de chave de força suficiente. A criptografia pode ser fraca se forem usados algoritmos antigos que utilizam chaves de criptografia curtas.

  ```
  ALTER USER 'jeffrey'@'localhost'
    REQUIRE CIPHER 'EDH-RSA-DES-CBC3-SHA';
  ```

As opções `SUBJECT`, `ISSUER` e `CIPHER` podem ser combinadas na cláusula `REQUIRE`:

```
ALTER USER 'jeffrey'@'localhost'
  REQUIRE SUBJECT '/C=SE/ST=Stockholm/L=Stockholm/
    O=MySQL demo client certificate/
    CN=client/emailAddress=client@example.com'
  AND ISSUER '/C=SE/ST=Stockholm/L=Stockholm/
    O=MySQL/CN=CA/emailAddress=ca@example.com'
  AND CIPHER 'EDH-RSA-DES-CBC3-SHA';
```

##### ALTERAR USUÁRIO Opções de Limite de Recursos

É possível definir limites de uso dos recursos do servidor para uma conta, conforme discutido na Seção 8.2.21, “Definir Limites de Recursos da Conta”. Para fazer isso, use uma cláusula `WITH` que especifica um ou mais valores `resource_option`.

A ordem das opções `WITH` não importa, exceto que, se um limite de recurso específico for especificado várias vezes, a última instância prevalece.

`ALTER USER` permite esses valores `resource_option`:

- `MAX_QUERIES_PER_HOUR count`, `MAX_UPDATES_PER_HOUR count`, `MAX_CONNECTIONS_PER_HOUR count`

  Para todas as contas mencionadas na declaração, essas opções restringem quantas consultas, atualizações e conexões ao servidor são permitidas para cada conta durante um período de uma hora. Se `count` for `0` (o padrão), isso significa que não há nenhuma limitação para a conta.

- `MAX_USER_CONNECTIONS count`

  Para todas as contas mencionadas na declaração, restringe o número máximo de conexões simultâneas ao servidor por cada conta. Um valor não nulo de `count` especifica o limite para a conta explicitamente. Se `count` for igual a `0` (o padrão), o servidor determina o número de conexões simultâneas para a conta a partir do valor global da variável de sistema `max_user_connections`. Se `max_user_connections` também for zero, não há limite para a conta.

Exemplo:

```
ALTER USER 'jeffrey'@'localhost'
  WITH MAX_QUERIES_PER_HOUR 500 MAX_UPDATES_PER_HOUR 100;
```

##### ALTERAR USUÁRIO Opções de Gerenciamento de Senhas

O `ALTER USER` suporta vários valores `password_option` para a gestão de senhas:

- Opções de expiração da senha: Você pode expirar uma senha de conta manualmente e definir sua política de expiração da senha. As opções da política não expiram a senha. Em vez disso, elas determinam como o servidor aplica a expiração automática à conta com base na idade da senha, que é avaliada a partir da data e hora da última alteração da senha da conta.

- Opções de reutilização da senha: Você pode restringir a reutilização da senha com base no número de alterações de senha, no tempo decorrido ou em ambos.

- Opções que exigem verificação da senha: Você pode indicar se as tentativas de alterar a senha de uma conta devem especificar a senha atual, como uma verificação de que o usuário que está tentando fazer a alteração realmente conhece a senha atual.

- Opções de rastreamento de logins falhos com senha incorreta: Você pode fazer com que o servidor rastreie tentativas de login falhas e bloqueie temporariamente as contas para as quais muitas senhas incorretas consecutivas forem fornecidas. O número necessário de falhas e o tempo de bloqueio são configuráveis.

Esta seção descreve a sintaxe das opções de gerenciamento de senhas. Para obter informações sobre a definição de políticas para o gerenciamento de senhas, consulte a Seção 8.2.15, “Gerenciamento de Senhas”.

Se forem especificadas várias opções de gerenciamento de senhas de um determinado tipo, a última prevalece. Por exemplo, `PASSWORD EXPIRE DEFAULT PASSWORD EXPIRE NEVER` é o mesmo que `PASSWORD EXPIRE NEVER`.

Nota

Exceto pelas opções relacionadas ao rastreamento de logins falhos, as opções de gerenciamento de senhas aplicam-se apenas às contas que utilizam um plugin de autenticação que armazena as credenciais internamente no MySQL. Para contas que utilizam um plugin que realiza autenticação contra um sistema de credenciais externo ao MySQL, o gerenciamento de senhas também deve ser realizado externamente contra esse sistema. Para obter mais informações sobre o armazenamento interno de credenciais, consulte a Seção 8.2.15, “Gerenciamento de Senhas”.

Um cliente tem uma senha expirada se a senha da conta expirou manualmente ou a idade da senha é considerada maior que sua vida útil permitida de acordo com a política de expiração automática. Nesse caso, o servidor desconecta o cliente ou restringe as operações permitidas a ele (veja a Seção 8.2.16, “Tratamento do servidor de senhas expiradas”). As operações realizadas por um cliente restrito resultam em um erro até que o usuário estabeleça uma nova senha de conta.

Nota

Embora seja possível "redefinir" uma senha expirada, definindo-a para seu valor atual, é preferível, por questão de boa prática, escolher uma senha diferente. Os administradores de banco de dados podem impor a não reutilização estabelecendo uma política apropriada de reutilização de senhas. Veja a Política de Reutilização de Senhas.

`ALTER USER` permite esses valores `password_option` para controlar a expiração da senha:

- `PASSWORD EXPIRE`

  Marca imediatamente a senha expirada para todas as contas nomeadas pelo comunicado.

  ```
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE;
  ```

- `PASSWORD EXPIRE DEFAULT`

  Define todas as contas nomeadas pela declaração para que a política de expiração global seja aplicada, conforme especificado pela variável de sistema `default_password_lifetime`.

  ```
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE DEFAULT;
  ```

- `PASSWORD EXPIRE NEVER`

  Essa opção de expiração substitui a política global para todas as contas nomeadas pelo extrato. Para cada uma, ela desabilita a expiração da senha para que a senha nunca expire.

  ```
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE NEVER;
  ```

- `PASSWORD EXPIRE INTERVAL N DAY`

  Esta opção de expiração substitui a política global para todas as contas nomeadas pelo extrato. Para cada uma, ela define a duração da senha para `N` dias. A seguinte declaração exige que a senha seja alterada a cada 180 dias:

  ```
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE INTERVAL 180 DAY;
  ```

`ALTER USER` permite esses valores `password_option` para controlar a reutilização de senhas anteriores com base no número mínimo de alterações de senha exigido:

- `PASSWORD HISTORY DEFAULT`

  Define todas as contas nomeadas pela declaração para que a política global sobre o comprimento do histórico de senhas seja aplicada, para proibir a reutilização de senhas antes do número de alterações especificadas pela variável de sistema `password_history`.

  ```
  ALTER USER 'jeffrey'@'localhost' PASSWORD HISTORY DEFAULT;
  ```

- `PASSWORD HISTORY N`

  Esta opção de histórico de senhas substitui a política global para todas as contas nomeadas pelo relatório. Para cada uma, define o comprimento do histórico de senhas em `N` senhas, para proibir o uso repetido de qualquer uma das `N` senhas mais recentemente escolhidas. O seguinte relatório proíbe o uso repetido de qualquer uma das 6 senhas anteriores:

  ```
  ALTER USER 'jeffrey'@'localhost' PASSWORD HISTORY 6;
  ```

`ALTER USER` permite esses valores `password_option` para controlar a reutilização de senhas anteriores com base no tempo decorrido:

- `PASSWORD REUSE INTERVAL DEFAULT`

  Define todas as declarações nomeadas pela conta para que a política global sobre o tempo decorrido seja aplicada, proibindo a reutilização de senhas mais recentes do que o número de dias especificado pela variável de sistema `password_reuse_interval`.

  ```
  ALTER USER 'jeffrey'@'localhost' PASSWORD REUSE INTERVAL DEFAULT;
  ```

- `PASSWORD REUSE INTERVAL N DAY`

  Esta opção de tempo excedido substitui a política global para todas as contas nomeadas pelo relatório. Para cada uma, define o intervalo de reutilização da senha para `N` dias, para proibir a reutilização de senhas mais antigas que esse número de dias. O seguinte relatório proíbe a reutilização de senhas por 360 dias:

  ```
  ALTER USER 'jeffrey'@'localhost' PASSWORD REUSE INTERVAL 360 DAY;
  ```

`ALTER USER` permite esses valores `password_option` para controlar se as tentativas de alterar a senha de uma conta devem especificar a senha atual, como uma verificação de que o usuário que tenta fazer a alteração realmente conhece a senha atual:

- `PASSWORD REQUIRE CURRENT`

  Esta opção de verificação substitui a política global para todas as contas mencionadas na declaração. Para cada uma delas, exige que as alterações de senha especifiquem a senha atual.

  ```
  ALTER USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT;
  ```

- `PASSWORD REQUIRE CURRENT OPTIONAL`

  Esta opção de verificação substitui a política global para todas as contas mencionadas na declaração. Para cada uma delas, não é necessário que as alterações de senha especifiquem a senha atual (a senha atual pode ser fornecida, mas não é obrigatória).

  ```
  ALTER USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT OPTIONAL;
  ```

- `PASSWORD REQUIRE CURRENT DEFAULT`

  Define todas as declarações nomeadas pela conta para que a política global sobre verificação de senha seja aplicada, conforme especificado pela variável de sistema `password_require_current`.

  ```
  ALTER USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT DEFAULT;
  ```

A partir do MySQL 8.0.19, o `ALTER USER` permite esses valores `password_option` para controlar o rastreamento de logins falhos:

- `FAILED_LOGIN_ATTEMPTS N`

  Se rastrear tentativas de login de contas que especificam uma senha incorreta. `N` deve ser um número entre 0 e 32767. Um valor de 0 desativa o rastreamento de tentativas de login malsucedidas. Valores maiores que 0 indicam quantos falhas consecutivas de senha causam bloqueio temporário da conta (se `PASSWORD_LOCK_TIME` também for diferente de zero).

- `PASSWORD_LOCK_TIME {N | UNBOUNDED}`

  Quanto tempo para bloquear a conta após muitas tentativas de login consecutivas fornecer uma senha incorreta. `N` deve ser um número de 0 a 32767, ou `UNBOUNDED`. Um valor de 0 desativa o bloqueio temporário da conta. Valores maiores que 0 indicam quanto tempo para bloquear a conta em dias. Um valor de `UNBOUNDED` faz com que a duração do bloqueio da conta seja ilimitada; uma vez bloqueada, a conta permanece no estado bloqueado até ser desbloqueada. Para informações sobre as condições sob as quais o desbloqueio ocorre, consulte Rastreamento de Login Falhado e Bloqueio Temporário de Conta.

Para que o rastreamento de logins falhos e o bloqueio temporário ocorram, as opções `FAILED_LOGIN_ATTEMPTS` e `PASSWORD_LOCK_TIME` de uma conta devem ser não nulos. A seguinte declaração modifica uma conta de modo que ela permaneça bloqueada por dois dias após quatro falhas consecutivas na senha:

```
ALTER USER 'jeffrey'@'localhost'
  FAILED_LOGIN_ATTEMPTS 4 PASSWORD_LOCK_TIME 2;
```

##### ALTERAR USUÁRIO Comentários e Opções de Atributos

O MySQL 8.0.21 e versões superiores suportam comentários de usuários e atributos de usuário, conforme descrito na Seção 15.7.1.3, “Instrução CREATE USER”. Esses podem ser modificados usando `ALTER USER` por meio das opções `COMMENT` e `ATTRIBUTE`, respectivamente. Você não pode especificar ambas as opções na mesma instrução `ALTER USER`; tentar fazer isso resulta em um erro de sintaxe.

O comentário do usuário e o atributo do usuário são armazenados na tabela Schema de Informações `USER_ATTRIBUTES` como um objeto JSON; o comentário do usuário é armazenado como o valor para uma chave `comment` na coluna ATTRIBUTE desta tabela, conforme mostrado mais adiante nesta discussão. O texto `COMMENT` pode ser qualquer texto citado arbitrário e substitui qualquer comentário do usuário existente. O valor `ATTRIBUTE` deve ser a representação de string válida de um objeto JSON. Isso é combinado com qualquer atributo do usuário existente como se a função `JSON_MERGE_PATCH()` tivesse sido usada no atributo do usuário existente e no novo; para quaisquer chaves que sejam reutilizadas, o novo valor substitui o antigo, conforme mostrado aqui:

```
mysql> SELECT * FROM INFORMATION_SCHEMA.USER_ATTRIBUTES
    ->     WHERE USER='bill' AND HOST='localhost';
+------+-----------+----------------+
| USER | HOST      | ATTRIBUTE      |
+------+-----------+----------------+
| bill | localhost | {"foo": "bar"} |
+------+-----------+----------------+
1 row in set (0.11 sec)

mysql> ALTER USER 'bill'@'localhost' ATTRIBUTE '{"baz": "faz", "foo": "moo"}';
Query OK, 0 rows affected (0.22 sec)

mysql> SELECT * FROM INFORMATION_SCHEMA.USER_ATTRIBUTES
    ->     WHERE USER='bill' AND HOST='localhost';
+------+-----------+------------------------------+
| USER | HOST      | ATTRIBUTE                    |
+------+-----------+------------------------------+
| bill | localhost | {"baz": "faz", "foo": "moo"} |
+------+-----------+------------------------------+
1 row in set (0.00 sec)
```

Para remover uma chave e seu valor do atributo do usuário, defina a chave para JSON `null` (deve ser minúscula e não cotada), assim:

```
mysql> ALTER USER 'bill'@'localhost' ATTRIBUTE '{"foo": null}';
Query OK, 0 rows affected (0.08 sec)

mysql> SELECT * FROM INFORMATION_SCHEMA.USER_ATTRIBUTES
    ->     WHERE USER='bill' AND HOST='localhost';
+------+-----------+----------------+
| USER | HOST      | ATTRIBUTE      |
+------+-----------+----------------+
| bill | localhost | {"baz": "faz"} |
+------+-----------+----------------+
1 row in set (0.00 sec)
```

Para definir um comentário de usuário existente como uma string vazia, use `ALTER USER ... COMMENT ''`. Isso deixa um valor vazio `comment` na tabela `USER_ATTRIBUTES`; para remover completamente o comentário do usuário, use `ALTER USER ... ATTRIBUTE ...` com o valor da chave da coluna definido como JSON `null` (não citado, em minúsculas). Isso é ilustrado pela seguinte sequência de instruções SQL:

```
mysql> ALTER USER 'bill'@'localhost' COMMENT 'Something about Bill';
Query OK, 0 rows affected (0.06 sec)

mysql> SELECT * FROM INFORMATION_SCHEMA.USER_ATTRIBUTES
    ->     WHERE USER='bill' AND HOST='localhost';
+------+-----------+---------------------------------------------------+
| USER | HOST      | ATTRIBUTE                                         |
+------+-----------+---------------------------------------------------+
| bill | localhost | {"baz": "faz", "comment": "Something about Bill"} |
+------+-----------+---------------------------------------------------+
1 row in set (0.00 sec)

mysql> ALTER USER 'bill'@'localhost' COMMENT '';
Query OK, 0 rows affected (0.09 sec)

mysql> SELECT * FROM INFORMATION_SCHEMA.USER_ATTRIBUTES
    ->     WHERE USER='bill' AND HOST='localhost';
+------+-----------+-------------------------------+
| USER | HOST      | ATTRIBUTE                     |
+------+-----------+-------------------------------+
| bill | localhost | {"baz": "faz", "comment": ""} |
+------+-----------+-------------------------------+
1 row in set (0.00 sec)

mysql> ALTER USER 'bill'@'localhost' ATTRIBUTE '{"comment": null}';
Query OK, 0 rows affected (0.07 sec)

mysql> SELECT * FROM INFORMATION_SCHEMA.USER_ATTRIBUTES
    ->     WHERE USER='bill' AND HOST='localhost';
+------+-----------+----------------+
| USER | HOST      | ATTRIBUTE      |
+------+-----------+----------------+
| bill | localhost | {"baz": "faz"} |
+------+-----------+----------------+
1 row in set (0.00 sec)
```

##### ALTERAR USUÁRIO Opções de Bloqueio de Conta

O MySQL suporta o bloqueio e desbloqueio de contas usando as opções `ACCOUNT LOCK` e `ACCOUNT UNLOCK`, que especificam o estado de bloqueio de uma conta. Para uma discussão adicional, consulte a Seção 8.2.20, “Bloqueio de Conta”.

Se várias opções de bloqueio de conta forem especificadas, a última tem precedência.

`ALTER USER ... ACCOUNT UNLOCK` desbloqueia qualquer conta nomeada pela declaração que esteja temporariamente bloqueada devido a muitos tentativas de login malsucedidas. Veja a Seção 8.2.15, “Gerenciamento de Senhas”.

##### Alterar Usuário de Registro Binário

`ALTER USER` é escrito no log binário se ele for bem-sucedido, mas não se ele falhar; nesse caso, ocorre um rollback e nenhuma alteração é feita. Uma declaração escrita no log binário inclui todos os usuários nomeados. Se a cláusula `IF EXISTS` for fornecida, isso inclui até mesmo usuários que não existem e não foram alterados.

Se a declaração original alterar as credenciais de um usuário, a declaração escrita no log binário especifica o plugin de autenticação aplicável para esse usuário, determinado da seguinte forma:

- O plugin mencionado na declaração original, se um foi especificado.

- Caso contrário, o plugin associado à conta do usuário, se o usuário existir, ou o plugin de autenticação padrão, se o usuário não existir. (Se a declaração escrita no log binário precisar especificar um plugin de autenticação específico para um usuário, inclua-o na declaração original.)

Se o servidor adicionar o plugin de autenticação padrão para quaisquer usuários na declaração escrita no log binário, ele escreverá uma mensagem de aviso no log de erros, nomeando esses usuários.

Se a declaração original especificar a opção `FAILED_LOGIN_ATTEMPTS` ou `PASSWORD_LOCK_TIME`, a declaração escrita no log binário incluirá a opção.

As declarações `ALTER USER` com cláusulas que suportam autenticação multifator (MFA) são escritas no log binário, com exceção das declarações `ALTER USER user factor INITIATE REGISTRATION`.

- As declarações `ALTER USER user factor FINISH REGISTRATION SET CHALLENGE_RESPONSE AS 'auth_string'` são escritas no log binário como `ALTER USER user MODIFY factor IDENTIFIED WITH authentication_fido AS fido_hash_string`;

- Em um contexto de replicação, o usuário de replicação precisa do privilégio `PASSWORDLESS_USER_ADMIN` para executar operações `ALTER USER ... MODIFY` em contas configuradas para autenticação sem senha usando o plugin `authentication_fido`.
