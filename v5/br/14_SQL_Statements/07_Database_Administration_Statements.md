## 13.7 Declarações de Administração de Banco de Dados

### 13.7.1 Declarações de Gestão de Conta

As informações da conta do MySQL são armazenadas nas tabelas do banco de dados do sistema `mysql`. Este banco de dados e o sistema de controle de acesso são discutidos extensivamente no Capítulo 5, *Administração do Servidor MySQL*, que você deve consultar para obter detalhes adicionais.

Importante

Algumas versões do MySQL introduzem mudanças nas tabelas de concessão para adicionar novos privilégios ou recursos. Para garantir que você possa aproveitar quaisquer novas capacidades, atualize suas tabelas de concessão para a estrutura atual sempre que atualizar o MySQL. Veja a Seção 2.10, “Atualizando o MySQL”.

Quando a variável de sistema `read_only` é habilitada, as declarações de gerenciamento de contas exigem o privilégio `SUPER`, além de quaisquer outros privilégios necessários. Isso ocorre porque elas modificam tabelas no banco de dados do sistema `mysql`.

#### 13.7.1.1 Declaração ALTER USER

```sql
ALTER USER [IF EXISTS]
    user [auth_option] [, user [auth_option]] ...
    [REQUIRE {NONE | tls_option [[AND] tls_option] ...}]
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

A declaração `ALTER USER` modifica as contas do MySQL. Ela permite que as propriedades de autenticação, SSL/TLS, limite de recursos e gerenciamento de senha sejam modificadas para contas existentes. Ela também pode ser usada para bloquear e desbloquear contas.

Para usar `ALTER USER`, você deve ter o privilégio global `CREATE USER` ou o privilégio `UPDATE` para o banco de dados do sistema `mysql`. Quando a variável de sistema `read_only` é habilitada, `ALTER USER` requer adicionalmente o privilégio `SUPER`.

Por padrão, ocorre um erro se você tentar modificar um usuário que não existe. Se a cláusula `IF EXISTS` for fornecida, a declaração produz um aviso para cada usuário nomeado que não existe, em vez de um erro.

Importante

Em algumas circunstâncias, `ALTER USER` pode ser registrado em logs do servidor ou no lado do cliente em um arquivo de histórico, como `~/.mysql_history`, o que significa que senhas em texto claro podem ser lidas por qualquer pessoa que tenha acesso de leitura a essas informações. Para informações sobre as condições sob as quais isso ocorre para os logs do servidor e como controlá-lo, consulte a Seção 6.1.2.3, “Senhas e Registro”. Para informações semelhantes sobre o registro no lado do cliente, consulte a Seção 4.5.1.3, “Registro do Cliente do MySQL”.

Há vários aspectos da declaração `ALTER USER`, descritos nos seguintes tópicos:

* VISÃO GERAL DO USUÁRIO * Opções de Autenticação do USUÁRIO * Opções SSL/TLS do USUÁRIO * Opções de Limite de Recursos * Opções de Gerenciamento de Senha * Opções de Bloqueio de Conta *

##### ALTER USER Visão geral

Para cada conta afetada, `ALTER USER` modifica a string correspondente na tabela do sistema `mysql.user` para refletir as propriedades especificadas na declaração. As propriedades não especificadas retêm seus valores atuais.

Cada nome de conta usa o formato descrito na Seção 6.2.4, “Especificação de Nomes de Conta”. A parte do nome de conta que representa o nome do host, se omitida, tem como padrão `'%'`. Também é possível especificar `CURRENT_USER` ou `CURRENT_USER()` para se referir à conta associada à sessão atual.

Em apenas um caso, a conta pode ser especificada com a função `USER()`:

```sql
ALTER USER USER() IDENTIFIED BY 'auth_string';
```

Essa sintaxe permite que você mude sua própria senha sem nomear sua conta literalmente.

Para a sintaxe de `ALTER USER` que permite que um valor *`auth_option`* siga um valor *`user`*, *`auth_option`* indica como a conta autentica, especificando um plugin de autenticação de conta, credenciais (por exemplo, uma senha) ou ambos. Cada valor de *`auth_option`* aplica-se *apenas* à conta nomeada imediatamente anterior a ele.

De acordo com as especificações do *`user`*, a declaração pode incluir opções para SSL/TLS, limite de recursos, gerenciamento de senhas e propriedades de bloqueio. Todas essas opções são * globais * para a declaração e aplicam-se a *todas* as contas mencionadas na declaração.

Exemplo: Alterar a senha de uma conta e expira-la. Como resultado, o usuário deve se conectar com a senha indicada e escolher uma nova na próxima conexão:

```sql
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED BY 'new_password' PASSWORD EXPIRE;
```

Exemplo: Modifique uma conta para usar o plugin de autenticação `sha256_password` e a senha fornecida. Exija que uma nova senha seja escolhida a cada 180 dias:

```sql
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED WITH sha256_password BY 'new_password'
  PASSWORD EXPIRE INTERVAL 180 DAY;
```

Exemplo: Acelerar ou desacelerar uma conta:

```sql
ALTER USER 'jeffrey'@'localhost' ACCOUNT LOCK;
ALTER USER 'jeffrey'@'localhost' ACCOUNT UNLOCK;
```

Exemplo: Exigir uma conta para se conectar usando SSL e estabelecer um limite de 20 conexões por hora:

```sql
ALTER USER 'jeffrey'@'localhost'
  REQUIRE SSL WITH MAX_CONNECTIONS_PER_HOUR 20;
```

Exemplo: Alterar várias contas, especificando algumas propriedades por conta e algumas propriedades globais:

```sql
ALTER USER
  'jeffrey'@'localhost' IDENTIFIED BY 'new_password',
  'jeanne'@'localhost'
  REQUIRE SSL WITH MAX_USER_CONNECTIONS 2;
```

O valor `IDENTIFIED BY` que segue `jeffrey` aplica-se apenas à conta imediatamente anterior, portanto, ele altera a senha para `'jeffrey_new_password'` apenas para `jeffrey`. Para `jeanne`, não há valor por conta (portanto, a senha permanece inalterada).

As propriedades restantes se aplicam globalmente a todas as contas mencionadas na declaração, portanto, para ambas as contas:

* Conexões são necessárias para usar SSL. * A conta pode ser usada para um máximo de duas conexões simultâneas.

Na ausência de um tipo específico de opção, a conta permanece inalterada nesse aspecto. Por exemplo, sem opção de bloqueio, o estado de bloqueio da conta não é alterado.

ALTERAR OPÇÕES DE AUTENTICAÇÃO DO USUÁRIO

Um nome de conta pode ser seguido por uma opção de autenticação *`auth_option`* que especifica o plugin de autenticação da conta, as credenciais ou ambos:

* *`auth_plugin`* nomeia um plugin de autenticação. O nome do plugin pode ser uma literal de cadeia de caracteres citada ou um nome não citado. Os nomes dos plugins são armazenados na coluna `plugin` da tabela do sistema `mysql.user`.

Para a sintaxe *`auth_option`* que não especifica um plugin de autenticação, o plugin padrão é indicado pelo valor da variável do sistema `default_authentication_plugin`. Para descrições de cada plugin, consulte a Seção 6.4.1, “Plugins de Autenticação”.

* As credenciais são armazenadas na tabela do sistema `mysql.user`. Um valor `'auth_string'` especifica as credenciais da conta, seja como uma string em texto claro (não encriptada) ou em formato hashado conforme esperado pelo plugin de autenticação associado à conta, respectivamente:

+ Para sintaxe que usa `BY 'auth_string'`, a string é texto claro e é passada para o plugin de autenticação para possível hashing. O resultado retornado pelo plugin é armazenado na tabela `mysql.user`. Um plugin pode usar o valor conforme especificado, nesse caso, não ocorre hashing.

+ Para a sintaxe que usa `AS 'auth_string'`, a string é assumida como já no formato que o plugin de autenticação requer e é armazenada como é na tabela `mysql.user`. Se um plugin requer um valor hashado, o valor deve já estar hashado em um formato apropriado para o plugin, ou o valor não pode ser usado pelo plugin e a autenticação correta das conexões do cliente não pode ocorrer.

+ Se um plugin de autenticação não realizar a criptografia da string de autenticação, as cláusulas `BY 'auth_string'` e `AS 'auth_string'` têm o mesmo efeito: a string de autenticação é armazenada como está na tabela do sistema `mysql.user`.

`ALTER USER` permite essas sintáticas *`auth_option`*:

* `IDENTIFIED BY 'auth_string'`

Define o plugin de autenticação da conta como o plugin padrão, passa o valor em texto claro `'auth_string'` para o plugin para possível hashing e armazena o resultado na string da conta na tabela do sistema `mysql.user`.

* `IDENTIFIED WITH auth_plugin`

Define o plugin de autenticação da conta para *`auth_plugin`*, limpa as credenciais para uma string vazia (as credenciais estão associadas ao antigo plugin de autenticação, não ao novo), e armazena o resultado na string da conta na tabela do sistema `mysql.user`.

Além disso, a senha está marcada como expirada. O usuário deve escolher uma nova senha na próxima conexão.

* `IDENTIFIED WITH auth_plugin BY 'auth_string'`

Define o plugin de autenticação da conta para *`auth_plugin`*, passa o valor em texto claro `'auth_string'` para o plugin para possível hashing e armazena o resultado na string da conta na tabela do sistema `mysql.user`.

* `IDENTIFIED WITH auth_plugin AS 'auth_string'`

Define o plugin de autenticação da conta para *`auth_plugin`* e armazena o valor `'auth_string'` como está na string da conta `mysql.user`. Se o plugin exigir uma string hasheada, a string é assumida como já hasheada no formato exigido pelo plugin.

Exemplo: Especifique a senha como texto claro; o plugin padrão é usado:

```sql
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED BY 'password';
```

Exemplo: Especifique o plugin de autenticação, juntamente com um valor de senha em texto claro:

```sql
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED WITH mysql_native_password
             BY 'password';
```

Exemplo: Especifique o plugin de autenticação, juntamente com um valor de senha criptografada:

```sql
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED WITH mysql_native_password
             AS '*6C8989366EAF75BB670AD8EA7A7FC1176A95CEF4';
```

Para obter informações adicionais sobre a definição de senhas e plugins de autenticação, consulte a Seção 6.2.10, “Atribuição de senhas de conta”, e a Seção 6.2.13, “Autenticação substituível”.

ALTERAR OPÇÕES DE SSL/TLS DO USUÁRIO

O MySQL pode verificar os atributos do certificado X.509 além da autenticação usual, que é baseada no nome do usuário e nas credenciais. Para informações de fundo sobre o uso do SSL/TLS com o MySQL, consulte a Seção 6.3, “Usando conexões criptografadas”.

Para especificar opções relacionadas ao SSL/TLS para uma conta MySQL, use uma cláusula `REQUIRE` que especifica um ou mais valores *`tls_option`*.

A ordem das opções de `REQUIRE` não importa, mas nenhuma opção pode ser especificada duas vezes. A palavra-chave `AND` é opcional entre as opções de `REQUIRE`.

`ALTER USER` permite esses valores de *`tls_option`*:

* `NONE`

Indica que todas as contas mencionadas na declaração não possuem requisitos SSL ou X.509. Conexões não criptografadas são permitidas se o nome do usuário e a senha forem válidos. Conexões criptografadas podem ser usadas, a critério do cliente, se o cliente tiver os arquivos de certificado e chave apropriados.

  ```sql
  ALTER USER 'jeffrey'@'localhost' REQUIRE NONE;
  ```

Os clientes tentam estabelecer uma conexão segura por padrão. Para clientes que possuem `REQUIRE NONE`, a tentativa de conexão é redirecionada para uma conexão não criptografada se uma conexão segura não puder ser estabelecida. Para exigir uma conexão criptografada, um cliente precisa especificar apenas a opção [[`--ssl-mode=REQUIRED`]; a tentativa de conexão falha se uma conexão segura não puder ser estabelecida.

* `SSL`

Diz ao servidor para permitir apenas conexões criptografadas para todas as contas nomeadas pela declaração.

  ```sql
  ALTER USER 'jeffrey'@'localhost' REQUIRE SSL;
  ```

Os clientes tentam estabelecer uma conexão segura por padrão. Para contas que possuem `REQUIRE SSL`, a tentativa de conexão falha se uma conexão segura não puder ser estabelecida.

* `X509`

Para todas as contas mencionadas na declaração, é necessário que os clientes apresentem um certificado válido, mas o certificado exato, o emissor e o assunto não importam. O único requisito é que seja possível verificar sua assinatura com um dos certificados da CA. O uso de certificados X.509 sempre implica criptografia, portanto, a opção `SSL` é desnecessária neste caso.

  ```sql
  ALTER USER 'jeffrey'@'localhost' REQUIRE X509;
  ```

Para contas com `REQUIRE X509`, os clientes devem especificar as opções `--ssl-key` e `--ssl-cert` para se conectar. (Recomenda-se, mas não é necessário, que também seja especificado `--ssl-ca` para que o certificado público fornecido pelo servidor possa ser verificado.) Isso também é válido para `ISSUER` e `SUBJECT`, pois essas opções `REQUIRE` implicam os requisitos de `X509`.

* `ISSUER 'issuer'`

Para todas as contas mencionadas na declaração, é necessário que os clientes apresentem um certificado X.509 válido emitido pela CA `'issuer'`. Se um cliente apresentar um certificado que é válido, mas tem um emissor diferente, o servidor rejeita a conexão. O uso de certificados X.509 sempre implica criptografia, portanto, a opção `SSL` não é necessária neste caso.

  ```sql
  ALTER USER 'jeffrey'@'localhost'
    REQUIRE ISSUER '/C=SE/ST=Stockholm/L=Stockholm/
      O=MySQL/CN=CA/emailAddress=ca@example.com';
  ```

Como o `ISSUER` implica os requisitos do `X509`, os clientes devem especificar as opções `--ssl-key` e `--ssl-cert` para se conectar. (Recomenda-se, mas não é necessário, que também seja especificado o `--ssl-ca` para que o certificado público fornecido pelo servidor possa ser verificado.)

* `SUBJECT 'subject'`

Para todas as contas mencionadas na declaração, é necessário que os clientes apresentem um certificado X.509 válido contendo o sujeito *`subject`*. Se um cliente apresentar um certificado que é válido, mas tem um sujeito diferente, o servidor rejeita a conexão. O uso de certificados X.509 sempre implica criptografia, portanto, a opção `SSL` é desnecessária neste caso.

  ```sql
  ALTER USER 'jeffrey'@'localhost'
    REQUIRE SUBJECT '/C=SE/ST=Stockholm/L=Stockholm/
      O=MySQL demo client certificate/
      CN=client/emailAddress=client@example.com';
  ```

O MySQL faz uma simples comparação de string do valor `'subject'` com o valor no certificado, portanto, a ordem das letras e dos componentes devem ser exatamente como estão presentes no certificado.

Como o `SUBJECT` implica os requisitos do `X509`, os clientes devem especificar as opções `--ssl-key` e `--ssl-cert` para se conectar. (Recomenda-se, mas não é necessário, que também seja especificado o `--ssl-ca` para que o certificado público fornecido pelo servidor possa ser verificado.)

* `CIPHER 'cipher'`

Para todas as contas mencionadas na declaração, é necessário um método de cifra específico para criptografar as conexões. Esta opção é necessária para garantir que sejam usadas cifras e comprimentos de chave de força suficiente. A criptografia pode ser fraca se algoritmos antigos que utilizam chaves de criptografia curtas forem usados.

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

ALTERAR OPÇÕES DE LIMITE DE RECURSOS DO USUÁRIO

É possível estabelecer limites de uso de recursos do servidor por uma conta, conforme discutido na Seção 6.2.16, “Definindo Limites de Recursos de Conta”. Para fazer isso, use uma cláusula `WITH` que especifica um ou mais valores de *`resource_option`*.

A ordem das opções do `WITH` não importa, exceto que, se um limite de recurso específico for especificado várias vezes, a última instância prevalece.

`ALTER USER` permite esses valores de *`resource_option`*:

* `MAX_QUERIES_PER_HOUR count`, `MAX_UPDATES_PER_HOUR count`, `MAX_CONNECTIONS_PER_HOUR count`

Para todas as contas mencionadas na declaração, essas opções restringem quantas consultas, atualizações e conexões ao servidor são permitidas para cada conta durante qualquer período de uma hora. (Consultas para as quais os resultados são servidos a partir do cache de consulta não contam para o limite `MAX_QUERIES_PER_HOUR`.) Se *`count`* é `0` (o padrão), isso significa que não há limitação para a conta.

* `MAX_USER_CONNECTIONS count`

Para todas as contas mencionadas na declaração, restringe o número máximo de conexões simultâneas ao servidor por cada conta. Um *`count`* não nulo especifica o limite para a conta explicitamente. Se *`count`* é `0` (o padrão), o servidor determina o número de conexões simultâneas para a conta a partir do valor global da variável de sistema `max_user_connections`. Se `max_user_connections` também for zero, não há limite para a conta.

Exemplo:

```sql
ALTER USER 'jeffrey'@'localhost'
  WITH MAX_QUERIES_PER_HOUR 500 MAX_UPDATES_PER_HOUR 100;
```

ALTERAR OPÇÕES DE GESTÃO DE SENHAS DO USUÁRIO

`ALTER USER` suporta vários valores *`password_option`* para gerenciamento da expiração da senha, para expirar manualmente uma senha de conta ou estabelecer sua política de expiração de senha. As opções de política não expiram a senha. Em vez disso, elas determinam como o servidor aplica a expiração automática à conta com base na idade da senha da conta. Para uma conta específica, sua idade de senha é avaliada a partir da data e hora da última alteração da senha.

Esta seção descreve a sintaxe para as opções de gerenciamento de senhas. Para informações sobre a definição de políticas para gerenciamento de senhas, consulte a Seção 6.2.11, “Gerenciamento de Senhas”.

Se várias opções de gerenciamento de senha forem especificadas, a última prevalece.

Essas opções se aplicam apenas a contas que utilizam um plugin de autenticação que armazena as credenciais internamente no MySQL. Para contas que utilizam um plugin que realiza autenticação contra um sistema de credenciais que é externo ao MySQL, o gerenciamento de senhas deve ser realizado externamente contra esse sistema também. Para mais informações sobre o armazenamento de credenciais internas, consulte a Seção 6.2.11, “Gerenciamento de Senhas”.

Uma sessão de cliente opera no modo restrito se a senha da conta expirou manualmente ou se a idade da senha é considerada maior que sua vida útil permitida de acordo com a política de expiração automática. No modo restrito, as operações realizadas dentro da sessão resultam em um erro até que o usuário estabeleça uma nova senha de conta. Para informações sobre o modo restrito, consulte a Seção 6.2.12, “Tratamento do servidor de senhas expiradas”.

Nota

Embora seja possível "redefinir" uma senha expirada, definindo-a para seu valor atual, é preferível, por questão de boa política, escolher uma senha diferente.

`ALTER USER` permite esses valores *`password_option`* para o controle da expiração da senha:

* `PASSWORD EXPIRE`

Marca imediatamente a senha expirada para todas as contas nomeadas na declaração.

  ```sql
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE;
  ```

* `PASSWORD EXPIRE DEFAULT`

Define todas as contas nomeadas pela declaração para que a política de expiração global seja aplicada, conforme especificado pela variável de sistema `default_password_lifetime`.

  ```sql
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE DEFAULT;
  ```

* `PASSWORD EXPIRE NEVER`

Esta opção de expiração substitui a política global para todas as contas nomeadas pelo extrato. Para cada uma, ela desativa a expiração da senha, para que a senha nunca expire.

  ```sql
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE NEVER;
  ```

* `PASSWORD EXPIRE INTERVAL N DAY`

Esta opção de expiração substitui a política global para todas as contas nomeadas pelo comunicado. Para cada uma, ela define a vida útil da senha como *`N`* dias. A seguinte declaração exige que a senha seja alterada a cada 180 dias:

  ```sql
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE INTERVAL 180 DAY;
  ```

ALTERAR OPÇÕES DE BLOQUEAMENTO DE CONTA

O MySQL suporta o bloqueio e o desbloqueio de contas usando as opções `ACCOUNT LOCK` e `ACCOUNT UNLOCK`, que especificam o estado de bloqueio para uma conta. Para uma discussão adicional, consulte a Seção 6.2.15, “Bloqueio de Conta”.

Se várias opções de bloqueio de conta forem especificadas, a última prevalece.

#### 13.7.1.2 Declaração CREATE USER

```sql
CREATE USER [IF NOT EXISTS]
    user [auth_option] [, user [auth_option]] ...
    [REQUIRE {NONE | tls_option [[AND] tls_option] ...}]
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

A declaração `CREATE USER` cria novas contas no MySQL. Ela permite que autenticação, SSL/TLS, limite de recursos e propriedades de gerenciamento de senha sejam estabelecidas para novas contas, e controla se as contas são inicialmente bloqueadas ou desbloqueadas.

Para usar `CREATE USER`, você deve ter o privilégio global `CREATE USER`, ou o privilégio `INSERT` para o banco de dados do sistema `mysql`. Quando a variável de sistema `read_only` é habilitada, `CREATE USER` requer adicionalmente o privilégio `SUPER`.

Um erro ocorre se você tentar criar uma conta que já existe. Se a cláusula `IF NOT EXISTS` for fornecida, a declaração produz um aviso para cada conta nomeada que já existe, em vez de um erro.

Importante

Em algumas circunstâncias, `CREATE USER` pode ser registrado em logs do servidor ou no lado do cliente em um arquivo de histórico, como `~/.mysql_history`, o que significa que senhas em texto claro podem ser lidas por qualquer pessoa que tenha acesso de leitura a essas informações. Para informações sobre as condições sob as quais isso ocorre para os logs do servidor e como controlá-lo, consulte a Seção 6.1.2.3, “Senhas e Registro”. Para informações semelhantes sobre o registro no lado do cliente, consulte a Seção 4.5.1.3, “Registro do Cliente do MySQL”.

Há vários aspectos da declaração `CREATE USER`, descritos nos seguintes tópicos:

* CRIAR USUÁRIO Visão geral
* CRIAR USUÁRIO Opções de autenticação
* CRIAR USUÁRIO Opções SSL/TLS
* CRIAR USUÁRIO Opções de limite de recursos
* CRIAR USUÁRIO Opções de gerenciamento de senha
* CRIAR USUÁRIO Opções de bloqueio de conta

##### CRIAR USUÁRIO Visão geral

Para cada conta, `CREATE USER` cria uma nova string na tabela do sistema [[`mysql.user`]. A string da conta reflete as propriedades especificadas na declaração. As propriedades não especificadas são definidas com seus valores padrão:

* Autenticação: O plugin de autenticação definido pela variável de sistema `default_authentication_plugin`, e credenciais vazias

* SSL/TLS: `NONE`
* Limites de recursos: Sem limite
* Gerenciamento de senhas: `PASSWORD EXPIRE DEFAULT`

* Bloqueio da conta: `ACCOUNT UNLOCK`

Uma conta que é criada pela primeira vez não tem privilégios. Para atribuir privilégios a esta conta, use uma ou mais declarações `GRANT`.

Cada nome de conta usa o formato descrito na Seção 6.2.4, “Especificação de Nomes de Conta”. Por exemplo:

```sql
CREATE USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
```

A parte do nome de host do nome da conta, se omitida, tem como padrão `'%'`.

Cada valor *`user`* que nomeia uma conta pode ser seguido por um valor opcional *`auth_option`* que indica como a conta autentica. Esses valores permitem que plugins de autenticação de conta e credenciais (por exemplo, uma senha) sejam especificados. Cada valor *`auth_option`* se aplica *apenas* à conta nomeada imediatamente anterior a ele.

De acordo com as especificações do *`user`*, a declaração pode incluir opções para SSL/TLS, limite de recursos, gerenciamento de senhas e propriedades de bloqueio. Todas essas opções são * globais * para a declaração e aplicam-se a *todas* as contas mencionadas na declaração.

Exemplo: Crie uma conta que utilize o plugin de autenticação padrão e a senha fornecida. Marque a senha como expirada para que o usuário precise escolher uma nova na primeira conexão com o servidor:

```sql
CREATE USER 'jeffrey'@'localhost'
  IDENTIFIED BY 'new_password' PASSWORD EXPIRE;
```

Exemplo: Crie uma conta que utilize o plugin de autenticação `sha256_password` e a senha fornecida. Exija que uma nova senha seja escolhida a cada 180 dias:

```sql
CREATE USER 'jeffrey'@'localhost'
  IDENTIFIED WITH sha256_password BY 'new_password'
  PASSWORD EXPIRE INTERVAL 180 DAY;
```

Exemplo: Crie várias contas, especificando algumas propriedades por conta e algumas propriedades globais:

```sql
CREATE USER
  'jeffrey'@'localhost' IDENTIFIED WITH mysql_native_password
                                   BY 'new_password1',
  'jeanne'@'localhost' IDENTIFIED WITH sha256_password
                                  BY 'new_password2'
  REQUIRE X509 WITH MAX_QUERIES_PER_HOUR 60
  ACCOUNT LOCK;
```

Cada valor *`auth_option`* (`IDENTIFIED WITH ... BY` neste caso) aplica-se apenas à conta imediatamente anterior a ele, portanto, cada conta usa o plugin de autenticação e a senha imediatamente subsequente.

As propriedades restantes se aplicam globalmente a todas as contas mencionadas na declaração, portanto, para ambas as contas:

* As conexões devem ser feitas usando um certificado X.509 válido. * Até 60 consultas por hora são permitidas. * A conta é bloqueada inicialmente, portanto, efetivamente é um marcador e não pode ser usada até que um administrador a desbloqueie.

##### CRIAR USUÁRIO Opções de Autenticação

Um nome de conta pode ser seguido por uma opção de autenticação *`auth_option`* que especifica o plugin de autenticação da conta, as credenciais ou ambos:

* *`auth_plugin`* nomeia um plugin de autenticação. O nome do plugin pode ser uma literal de cadeia de caracteres citada ou um nome não citado. Os nomes dos plugins são armazenados na coluna `plugin` da tabela do sistema `mysql.user`.

Para a sintaxe *`auth_option`* que não especifica um plugin de autenticação, o plugin padrão é indicado pelo valor da variável do sistema `default_authentication_plugin`. Para descrições de cada plugin, consulte a Seção 6.4.1, “Plugins de Autenticação”.

* As credenciais são armazenadas na tabela do sistema `mysql.user`. Um valor `'auth_string'` especifica as credenciais da conta, seja como uma string em texto claro (não encriptada) ou em formato hashado conforme esperado pelo plugin de autenticação associado à conta, respectivamente:

+ Para sintaxe que usa `BY 'auth_string'`, a string é texto claro e é passada para o plugin de autenticação para possível hashing. O resultado retornado pelo plugin é armazenado na tabela `mysql.user`. Um plugin pode usar o valor conforme especificado, nesse caso, não ocorre hashing.

+ Para a sintaxe que usa `AS 'auth_string'`, a string é assumida como já no formato que o plugin de autenticação requer e é armazenada como é na tabela `mysql.user`. Se um plugin requer um valor hashado, o valor deve já estar hashado em um formato apropriado para o plugin, ou o valor não pode ser usado pelo plugin e a autenticação correta das conexões do cliente não pode ocorrer.

+ Se um plugin de autenticação não realizar a criptografia da string de autenticação, as cláusulas `BY 'auth_string'` e `AS 'auth_string'` têm o mesmo efeito: a string de autenticação é armazenada como está na tabela do sistema `mysql.user`.

`CREATE USER` permite essas sintáticas *`auth_option`*:

* `IDENTIFIED BY 'auth_string'`

Define o plugin de autenticação da conta como o plugin padrão, passa o valor em texto claro `'auth_string'` para o plugin para possível hashing e armazena o resultado na string da conta na tabela do sistema `mysql.user`.

* `IDENTIFIED WITH auth_plugin`

Define o plugin de autenticação da conta para *`auth_plugin`*, limpa as credenciais para uma string vazia e armazena o resultado na string da conta na tabela do sistema `mysql.user`.

* `IDENTIFIED WITH auth_plugin BY 'auth_string'`

Define o plugin de autenticação da conta para *`auth_plugin`*, passa o valor em texto claro `'auth_string'` para o plugin para possível hashing e armazena o resultado na string da conta na tabela do sistema `mysql.user`.

* `IDENTIFIED WITH auth_plugin AS 'auth_string'`

Define o plugin de autenticação da conta para *`auth_plugin`* e armazena o valor `'auth_string'` como está na string da conta `mysql.user`. Se o plugin exigir uma string hasheada, a string é assumida como já hasheada no formato exigido pelo plugin.

* `IDENTIFIED BY PASSWORD 'auth_string'`

Define o plugin de autenticação da conta como o plugin padrão e armazena o valor `'auth_string'` como está na string de conta `mysql.user`. Se o plugin requer uma string hasheada, a string é assumida como já hasheada no formato exigido pelo plugin.

Nota

A sintaxe `IDENTIFIED BY PASSWORD` é desatualizada; espere que ela seja removida em um lançamento futuro do MySQL.

Exemplo: Especifique a senha como texto claro; o plugin padrão é usado:

```sql
CREATE USER 'jeffrey'@'localhost'
  IDENTIFIED BY 'password';
```

Exemplo: Especifique o plugin de autenticação, juntamente com um valor de senha em texto claro:

```sql
CREATE USER 'jeffrey'@'localhost'
  IDENTIFIED WITH mysql_native_password BY 'password';
```

Em cada caso, o valor da senha armazenado na string da conta é o valor em texto claro `'password'` após ter sido criptografado pelo plugin de autenticação associado à conta.

Para obter informações adicionais sobre a definição de senhas e plugins de autenticação, consulte a Seção 6.2.10, “Atribuição de senhas de conta”, e a Seção 6.2.13, “Autenticação substituível”.

##### CRIAR OPÇÕES DE USUÁRIO SSL/TLS

O MySQL pode verificar os atributos do certificado X.509 além da autenticação usual, que é baseada no nome do usuário e nas credenciais. Para informações de fundo sobre o uso do SSL/TLS com o MySQL, consulte a Seção 6.3, “Usando conexões criptografadas”.

Para especificar opções relacionadas ao SSL/TLS para uma conta MySQL, use uma cláusula `REQUIRE` que especifica um ou mais valores *`tls_option`*.

A ordem das opções de `REQUIRE` não importa, mas nenhuma opção pode ser especificada duas vezes. A palavra-chave `AND` é opcional entre as opções de `REQUIRE`.

`CREATE USER` permite esses valores de *`tls_option`*:

* `NONE`

Indica que todas as contas mencionadas na declaração não possuem requisitos SSL ou X.509. Conexões não criptografadas são permitidas se o nome do usuário e a senha forem válidos. Conexões criptografadas podem ser usadas, a critério do cliente, se o cliente tiver os arquivos de certificado e chave apropriados.

  ```sql
  CREATE USER 'jeffrey'@'localhost' REQUIRE NONE;
  ```

Os clientes tentam estabelecer uma conexão segura por padrão. Para clientes que possuem `REQUIRE NONE`, a tentativa de conexão cai para uma conexão não criptografada se uma conexão segura não puder ser estabelecida. Para exigir uma conexão criptografada, um cliente precisa especificar apenas a opção [[`--ssl-mode=REQUIRED`]; a tentativa de conexão falha se uma conexão segura não puder ser estabelecida.

`NONE` é o padrão se não forem especificadas opções relacionadas ao SSL `REQUIRE`.

* `SSL`

Diz ao servidor para permitir apenas conexões criptografadas para todas as contas nomeadas pela declaração.

  ```sql
  CREATE USER 'jeffrey'@'localhost' REQUIRE SSL;
  ```

Os clientes tentam estabelecer uma conexão segura por padrão. Para contas que possuem `REQUIRE SSL`, a tentativa de conexão falha se uma conexão segura não puder ser estabelecida.

* `X509`

Para todas as contas mencionadas na declaração, é necessário que os clientes apresentem um certificado válido, mas o certificado exato, o emissor e o assunto não importam. O único requisito é que seja possível verificar sua assinatura com um dos certificados da CA. O uso de certificados X.509 sempre implica criptografia, portanto, a opção `SSL` é desnecessária neste caso.

  ```sql
  CREATE USER 'jeffrey'@'localhost' REQUIRE X509;
  ```

Para contas com `REQUIRE X509`, os clientes devem especificar as opções `--ssl-key` e `--ssl-cert` para se conectar. (Recomenda-se, mas não é necessário, que também seja especificado `--ssl-ca` para que o certificado público fornecido pelo servidor possa ser verificado.) Isso também é válido para `ISSUER` e `SUBJECT`, pois essas opções `REQUIRE` implicam os requisitos de `X509`.

* `ISSUER 'issuer'`

Para todas as contas mencionadas na declaração, é necessário que os clientes apresentem um certificado X.509 válido emitido pela CA `'issuer'`. Se um cliente apresentar um certificado que é válido, mas tem um emissor diferente, o servidor rejeita a conexão. O uso de certificados X.509 sempre implica criptografia, portanto, a opção `SSL` é desnecessária neste caso.

  ```sql
  CREATE USER 'jeffrey'@'localhost'
    REQUIRE ISSUER '/C=SE/ST=Stockholm/L=Stockholm/
      O=MySQL/CN=CA/emailAddress=ca@example.com';
  ```

Como `ISSUER` implica os requisitos de `X509`, os clientes devem especificar as opções `--ssl-key` e `--ssl-cert` para se conectar. (Recomenda-se, mas não é necessário, que `--ssl-ca` também seja especificado para que o certificado público fornecido pelo servidor possa ser verificado.)

* `SUBJECT 'subject'`

Para todas as contas mencionadas na declaração, é necessário que os clientes apresentem um certificado X.509 válido contendo o sujeito *`subject`*. Se um cliente apresentar um certificado que é válido, mas tem um sujeito diferente, o servidor rejeita a conexão. O uso de certificados X.509 sempre implica criptografia, portanto, a opção `SSL` não é necessária neste caso.

  ```sql
  CREATE USER 'jeffrey'@'localhost'
    REQUIRE SUBJECT '/C=SE/ST=Stockholm/L=Stockholm/
      O=MySQL demo client certificate/
      CN=client/emailAddress=client@example.com';
  ```

O MySQL faz uma simples comparação de string do valor `'subject'` ao valor no certificado, portanto, a ordem das letras e dos componentes devem ser exatamente como estão presentes no certificado.

Como `SUBJECT` implica os requisitos de `X509`, os clientes devem especificar as opções `--ssl-key` e `--ssl-cert` para se conectar. (Recomenda-se, mas não é necessário, que `--ssl-ca` também seja especificado para que o certificado público fornecido pelo servidor possa ser verificado.)

* `CIPHER 'cipher'`

Para todas as contas mencionadas na declaração, é necessário um método de cifra específico para criptografar as conexões. Esta opção é necessária para garantir que sejam usadas cifras e comprimentos de chave de força suficiente. A criptografia pode ser fraca se algoritmos antigos que utilizam chaves de criptografia curtas forem usados.

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

##### CRIAR USUÁRIO Opções de Limite de Recursos

É possível estabelecer limites de uso de recursos do servidor por uma conta, conforme discutido na Seção 6.2.16, “Definindo Limites de Recursos de Conta”. Para fazer isso, use uma cláusula `WITH` que especifica um ou mais valores *`resource_option`*.

A ordem das opções do `WITH` não importa, exceto que, se um limite de recurso específico for especificado várias vezes, a última instância prevalece.

`CREATE USER` permite esses valores de *`resource_option`*:

* `MAX_QUERIES_PER_HOUR count`, `MAX_UPDATES_PER_HOUR count`, `MAX_CONNECTIONS_PER_HOUR count`

Para todas as contas mencionadas na declaração, essas opções restringem quantas consultas, atualizações e conexões ao servidor são permitidas para cada conta durante qualquer período de uma hora. (Consultas para as quais os resultados são servidos a partir do cache de consulta não contam para o limite `MAX_QUERIES_PER_HOUR`.) Se *`count`* é `0` (o padrão), isso significa que não há limitação para a conta.

* `MAX_USER_CONNECTIONS count`

Para todas as contas mencionadas na declaração, restringe o número máximo de conexões simultâneas ao servidor por cada conta. Um *`count`* não nulo especifica o limite para a conta explicitamente. Se *`count`* é `0` (o padrão), o servidor determina o número de conexões simultâneas para a conta a partir do valor global da variável de sistema `max_user_connections`. Se `max_user_connections` também for zero, não há limite para a conta.

Exemplo:

```sql
CREATE USER 'jeffrey'@'localhost'
  WITH MAX_QUERIES_PER_HOUR 500 MAX_UPDATES_PER_HOUR 100;
```

##### CRIAR USUÁRIO Opções de Gerenciamento de Senhas

As senhas das contas têm uma idade, calculada a partir da data e hora da última alteração da senha.

`CREATE USER` suporta vários valores *`password_option`* para gerenciamento da expiração da senha, para expirar manualmente uma senha de conta ou estabelecer sua política de expiração de senha. As opções de política não expiram a senha. Em vez disso, elas determinam como o servidor aplica a expiração automática à conta com base na idade da senha da conta. Para uma conta específica, sua idade de senha é avaliada a partir da data e hora da última alteração da senha.

Esta seção descreve a sintaxe para as opções de gerenciamento de senhas. Para informações sobre a definição de políticas para gerenciamento de senhas, consulte a Seção 6.2.11, “Gerenciamento de Senhas”.

Se várias opções de gerenciamento de senha forem especificadas, a última prevalece.

Essas opções se aplicam apenas a contas que utilizam um plugin de autenticação que armazena as credenciais internamente no MySQL. Para contas que utilizam um plugin que realiza autenticação contra um sistema de credenciais que é externo ao MySQL, o gerenciamento de senhas deve ser realizado externamente contra esse sistema também. Para mais informações sobre o armazenamento de credenciais internas, consulte a Seção 6.2.11, “Gerenciamento de Senhas”.

Uma sessão de cliente opera no modo restrito se a senha da conta expirou manualmente ou se a idade da senha é considerada maior que sua vida útil permitida de acordo com a política de expiração automática. No modo restrito, as operações realizadas dentro da sessão resultam em um erro até que o usuário estabeleça uma nova senha de conta. Para informações sobre o modo restrito, consulte a Seção 6.2.12, “Tratamento do servidor de senhas expiradas”.

`CREATE USER` permite esses valores *`password_option`* para o controle da expiração da senha:

* `PASSWORD EXPIRE`

Marca imediatamente a senha expirada para todas as contas nomeadas na declaração.

  ```sql
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE;
  ```

* `PASSWORD EXPIRE DEFAULT`

Define todas as contas nomeadas pela declaração para que a política de expiração global seja aplicada, conforme especificado pela variável de sistema `default_password_lifetime`.

  ```sql
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE DEFAULT;
  ```

* `PASSWORD EXPIRE NEVER`

Esta opção de expiração substitui a política global para todas as contas nomeadas pelo extrato. Para cada uma, ela desativa a expiração da senha, para que a senha nunca expire.

  ```sql
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE NEVER;
  ```

* `PASSWORD EXPIRE INTERVAL N DAY`

Esta opção de expiração substitui a política global para todas as contas nomeadas pelo comunicado. Para cada uma, ela define a vida útil da senha para *`N`* dias. A seguinte declaração exige que a senha seja alterada a cada 180 dias:

  ```sql
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE INTERVAL 180 DAY;
  ```

##### CRIAR OPÇÕES DE BLOQUEAMENTO DE CONTA

O MySQL suporta o bloqueio e o desbloqueio de contas usando as opções `ACCOUNT LOCK` e `ACCOUNT UNLOCK`, que especificam o estado de bloqueio para uma conta. Para uma discussão adicional, consulte a Seção 6.2.15, “Bloqueio de Conta”.

Se várias opções de bloqueio de conta forem especificadas, a última prevalece.

#### 13.7.1.3 Declaração DROP USER

```sql
DROP USER [IF EXISTS] user [, user] ...
```

A declaração `DROP USER` remove uma ou mais contas do MySQL e seus privilégios. Ela remove as strings de privilégio para a conta de todas as tabelas de concessão.

Para usar `DROP USER`, você deve ter o privilégio global `CREATE USER`, ou o privilégio `DELETE` para o banco de dados do sistema `mysql`. Quando a variável de sistema `read_only` é habilitada, `DROP USER` requer adicionalmente o privilégio `SUPER`.

Um erro ocorre se você tentar excluir uma conta que não existe. Se a cláusula `IF EXISTS` for fornecida, a declaração produz um aviso para cada usuário nomeado que não existe, em vez de um erro.

Cada nome de conta usa o formato descrito na Seção 6.2.4, “Especificação de Nomes de Conta”. Por exemplo:

```sql
DROP USER 'jeffrey'@'localhost';
```

A parte do nome de host do nome da conta, se omitida, tem como padrão `'%'`.

Importante

`DROP USER` não fecha automaticamente nenhuma sessão de usuário aberta. Em vez disso, no caso de um usuário com uma sessão aberta ser descartado, a declaração não entra em vigor até que a sessão desse usuário seja fechada. Uma vez que a sessão é fechada, o usuário é descartado e a próxima tentativa desse usuário de fazer login falha. *Isso é por design*.

`DROP USER` não exclui ou invalida automaticamente bancos de dados ou objetos dentro deles que o usuário antigo criou. Isso inclui programas ou visualizações armazenadas para as quais os nomes dos usuários excluídos são indicados pelo atributo `DEFINER`. Tentativas de acessar tais objetos podem produzir um erro se forem executados em contexto de segurança do definidor. (Para informações sobre contexto de segurança, consulte a Seção 23.6, “Controle de Acesso a Objetos Armazenados”.)

#### 13.7.1.4 Declaração de concessão

```sql
GRANT
    priv_type [(column_list)]
      [, priv_type [(column_list)]] ...
    ON [object_type] priv_level
    TO user [auth_option] [, user [auth_option]] ...
    [REQUIRE {NONE | tls_option [[AND] tls_option] ...}]
    [WITH {GRANT OPTION | resource_option} ...]

GRANT PROXY ON user
    TO user [, user] ...
    [WITH GRANT OPTION]

object_type: {
    TABLE
  | FUNCTION
  | PROCEDURE
}

priv_level: {
    *
  | *.*
  | db_name.*
  | db_name.tbl_name
  | tbl_name
  | db_name.routine_name
}

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
  | MAX_QUERIES_PER_HOUR count
  | MAX_UPDATES_PER_HOUR count
  | MAX_CONNECTIONS_PER_HOUR count
  | MAX_USER_CONNECTIONS count
}
```

A declaração `GRANT` concede privilégios às contas de usuário do MySQL. Existem vários aspectos da declaração `GRANT`, descritos nos seguintes tópicos:

* Visão Geral do GRANT
* Diretrizes para Cotação de Objetos
* Privilegios Apoiados pelo MySQL
* Nomes e Senhas de Conta
* Privilegios Globais
* Privilegios de Banco de Dados
* Privilegios de Tabela
* Privilegios de Coluna
* Privilegios de Rotina Armazenada
* Privilegios de Usuário Proxy
* Criação Implícita de Conta
* Outras Características da Conta
* Versões de GRANT do MySQL e SQL Padrão

##### GRUPO DE TRABALHO Geral Visão Geral

A declaração `GRANT` concede privilégios às contas de usuário do MySQL.

Para conceder um privilégio com `GRANT`, você deve ter o privilégio `GRANT OPTION`, e você deve ter os privilégios que está concedendo. (Alternativamente, se você tiver o privilégio `UPDATE` para as tabelas de concessão no banco de dados do sistema `mysql`, você pode conceder qualquer conta qualquer privilégio. Quando a variável do sistema `read_only` é habilitada, `GRANT` requer adicionalmente o privilégio `SUPER`.

A declaração `REVOKE` está relacionada com `GRANT` e permite que os administradores removam privilégios de conta. Veja a Seção 13.7.1.6, “Declaração REVOKE”.

Cada nome de conta usa o formato descrito na Seção 6.2.4, “Especificação de Nomes de Conta”. Por exemplo:

```sql
GRANT ALL ON db1.* TO 'jeffrey'@'localhost';
```

A parte do nome de host da conta, se omitida, tem como padrão `'%'`.

Normalmente, um administrador de banco de dados primeiro usa `CREATE USER` para criar uma conta e definir suas características não privilegiadas, como sua senha, se ela usa conexões seguras e limites de acesso a recursos do servidor, e depois usa `GRANT` para definir seus privilégios. `ALTER USER` pode ser usado para alterar as características não privilegiadas de contas existentes. Por exemplo:

```sql
CREATE USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
GRANT ALL ON db1.* TO 'jeffrey'@'localhost';
GRANT SELECT ON db2.invoice TO 'jeffrey'@'localhost';
ALTER USER 'jeffrey'@'localhost' WITH MAX_QUERIES_PER_HOUR 90;
```

Nota

Os exemplos mostrados aqui não incluem a cláusula `IDENTIFIED`. Assume-se que você estabeleça senhas com `CREATE USER` no momento da criação da conta para evitar a criação de contas inseguras.

Nota

Se uma conta mencionada em uma declaração `GRANT` não existir, o `GRANT` pode criá-la nas condições descritas mais adiante na discussão do modo `NO_AUTO_CREATE_USER` SQL. Também é possível usar o `GRANT` para especificar características de contas que não são privilégios, como se elas utilizam conexões seguras e limites de acesso a recursos do servidor.

No entanto, o uso de `GRANT` para criar contas ou definir características não privilegiadas é desaconselhável no MySQL 5.7. Em vez disso, realize essas tarefas usando `CREATE USER` ou `ALTER USER`.

Do programa **mysql**, `GRANT` responde com `Query OK, 0 rows affected` quando executado com sucesso. Para determinar quais privilégios resultam da operação, use `SHOW GRANTS`. Veja a Seção 13.7.5.21, “Declaração SHOW GRANTS”.

Importante

Em algumas circunstâncias, `GRANT` pode ser registrado em logs do servidor ou no lado do cliente em um arquivo de histórico, como `~/.mysql_history`, o que significa que senhas em texto claro podem ser lidas por qualquer pessoa que tenha acesso de leitura a essas informações. Para informações sobre as condições sob as quais isso ocorre para os logs do servidor e como controlá-lo, consulte a Seção 6.1.2.3, “Senhas e Registro”. Para informações semelhantes sobre o registro no lado do cliente, consulte a Seção 4.5.1.3, “Registro do Cliente do mysql”.

`GRANT` suporta nomes de host com até 60 caracteres. Os nomes de usuário podem ter até 32 caracteres. Os nomes de banco de dados, tabela, coluna e rotina podem ter até 64 caracteres.

Aviso

*Não tente alterar o comprimento permitido para nomes de usuário alterando a tabela do sistema `mysql.user`. Isso resulta em comportamento imprevisível, que pode até tornar impossível para os usuários fazer login no servidor MySQL*. Nunca altere a estrutura das tabelas no banco de dados do sistema `mysql` de qualquer maneira, exceto pelo procedimento descrito na Seção 2.10, "Atualizando o MySQL".

##### Diretrizes para citação de objetos

Vários objetos nas declarações de `GRANT` estão sujeitos a citação, embora a citação seja opcional em muitos casos: nomes de conta, banco de dados, tabela, coluna e rotina. Por exemplo, se um valor *`user_name`* ou *`host_name`* em um nome de conta é legal como um identificador não citado, você não precisa citar. No entanto, aspas são necessárias para especificar uma string *`user_name`* contendo caracteres especiais (como `-`), ou uma string *`host_name`* contendo caracteres especiais ou caracteres de comodinho, como `%` (por exemplo, `'test-user'@'%.com'`). Cite o nome do usuário e o nome do host separadamente.

Para especificar valores citados:

* Cite o banco de dados, a tabela, a coluna e os nomes das rotinas como identificadores.

* Cite nomes de usuários e nomes de hosts como identificadores ou como strings.

* Citar as senhas como strings.

Para as diretrizes de citação de strings e de identificadores, consulte a Seção 9.1.1, “Literais de String”, e a Seção 9.2, “Nomes de Objetos do Esquema”.

Os caracteres `_` e `%` são permitidos ao especificar nomes de banco de dados em declarações `GRANT` que concedem privilégios ao nível do banco de dados (`GRANT ... ON db_name.*`). Isso significa, por exemplo, que para usar um caractere `_` como parte de um nome de banco de dados, especifí-lo usando o caractere de fuga `\` como `\_` na declaração `GRANT`, para evitar que o usuário possa acessar bancos de dados adicionais que correspondem ao padrão de caracteres (*), por exemplo, `` GRANT ... ON `foo\_bar`.* TO ... ``.

Emitir várias declarações `GRANT` contendo caracteres curinga pode não ter o efeito esperado em declarações DML; ao resolver concessões que envolvem caracteres curinga, o MySQL leva em consideração apenas a primeira concessão que corresponde. Em outras palavras, se um usuário tiver duas concessões de nível de banco de dados usando caracteres curinga que correspondem ao mesmo banco de dados, a concessão que foi criada primeiro é aplicada. Considere o banco de dados `db` e a tabela `t` criados usando as declarações mostradas aqui:

```sql
mysql> CREATE DATABASE db;
Query OK, 1 row affected (0.01 sec)

mysql> CREATE TABLE db.t (c INT);
Query OK, 0 rows affected (0.01 sec)

mysql> INSERT INTO db.t VALUES ROW(1);
Query OK, 1 row affected (0.00 sec)
```

Em seguida (assumindo que a conta corrente seja a conta MySQL `root` ou outra conta com os privilégios necessários), criamos um usuário `u` e, em seguida, emitimos duas instruções `GRANT` contendo caracteres asteriscos, da seguinte forma:

```sql
mysql> CREATE USER u;
Query OK, 0 rows affected (0.01 sec)

mysql> GRANT SELECT ON `d_`.* TO u;
Query OK, 0 rows affected (0.01 sec)

mysql> GRANT INSERT ON `d%`.* TO u;
Query OK, 0 rows affected (0.00 sec)

mysql> EXIT
```

```sql
Bye
```

Se encerrarmos a sessão e, em seguida, efetuarmos o login novamente com o cliente **mysql**, desta vez como **u**, vemos que esta conta tem apenas o privilégio fornecido pela primeira concessão correspondente, mas não a segunda:

```sql
$> mysql -uu -hlocalhost
```

```sql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 10
Server version: 5.7.52-tr Source distribution

Copyright (c) 2000, 2023, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input
statement.

mysql> TABLE db.t;
+------+
| c    |
+------+
|    1 |
+------+
1 row in set (0.00 sec)

mysql> INSERT INTO db.t VALUES ROW(2);
ERROR 1142 (42000): INSERT command denied to user 'u'@'localhost' for table 't'
```

Quando um nome de banco de dados não é usado para conceder privilégios ao nível do banco de dados, mas como um qualificador para conceder privilégios a algum outro objeto, como uma tabela ou rotina (por exemplo, `GRANT ... ON db_name.tbl_name`), o MySQL interpreta caracteres de comodinho como caracteres literais.

##### Privilegios suportados pelo MySQL

O quadro a seguir resume os tipos de privilégio *`priv_type`* permitidos que podem ser especificados para as declarações `GRANT` e `REVOKE`, e os níveis em que cada privilégio pode ser concedido. Para informações adicionais sobre cada privilégio, consulte a Seção 6.2.2, “Privilegios fornecidos pelo MySQL”.

**Tabela 13.8 Privilegios Permitidos para GRANDE e REVOGAÇÃO**

<table><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Privilege</th> <th>Significado e Níveis de Financiamento</th> </tr></thead><tbody><tr> <td><code>ALL [PRIVILEGES]</code></td> <td>Concede todos os privilégios no nível de acesso especificado, exceto<code>GRANT OPTION</code>e<code>PROXY</code>.</td> </tr><tr> <td><code>ALTER</code></td> <td>Ative o uso de<code>ALTER TABLE</code>Níveis: Global, banco de dados, tabela.</td> </tr><tr> <td><code>ALTER ROUTINE</code></td> <td>Habilitar as rotinas armazenadas para serem alteradas ou excluídas. Níveis: Global, banco de dados, rotina.</td> </tr><tr> <td><code>CREATE</code></td> <td>Habilitar a criação de banco de dados e tabela. Níveis: Global, banco de dados, tabela.</td> </tr><tr> <td><code>CREATE ROUTINE</code></td> <td>Ative a criação de rotinas armazenadas. Níveis: Global, banco de dados.</td> </tr><tr> <td><code>CREATE TABLESPACE</code></td> <td>Habilitar a criação, alteração ou eliminação de espaços de tabela e grupos de arquivos de registro. Nível: Global.</td> </tr><tr> <td><code>CREATE TEMPORARY TABLES</code></td> <td>Ative o uso de<a class="link" href="create-table.html" title="13.1.18 CREATE TABLE Statement"><code>CREATE TEMPORARY TABLE</code></a>Níveis: Global, banco de dados.</td> </tr><tr> <td><code>CREATE USER</code></td> <td>Ative o uso de<code>CREATE USER</code>,<code>DROP USER</code>,<code>RENAME USER</code>, e<a class="link" href="revoke.html" title="13.7.1.6 REVOKE Statement"><code>REVOKE ALL PRIVILEGES</code></a>. Nível: Global.</td> </tr><tr> <td><code>CREATE VIEW</code></td> <td>Habilitar a criação ou alteração de visualizações. Níveis: Global, banco de dados, tabela.</td> </tr><tr> <td><code>DELETE</code></td> <td>Ative o uso de<code>DELETE</code>. Nível: Global, banco de dados, tabela.</td> </tr><tr> <td><code>DROP</code></td> <td>Ative a possibilidade de descartar bancos de dados, tabelas e visualizações. Níveis: Global, banco de dados, tabela.</td> </tr><tr> <td><code>EVENT</code></td> <td>Ative o uso de eventos para o Agendamento de eventos. Níveis: Global, banco de dados.</td> </tr><tr> <td><code>EXECUTE</code></td> <td>Permitir que o usuário execute rotinas armazenadas. Níveis: Global, banco de dados, rotina.</td> </tr><tr> <td><code>FILE</code></td> <td>Permitir que o usuário faça o servidor ler ou escrever arquivos. Nível: Global.</td> </tr><tr> <td><code>GRANT OPTION</code></td> <td>Habilitar privilégios para serem concedidos a outras contas ou removidos delas. Níveis: Global, banco de dados, tabela, rotina, proxy.</td> </tr><tr> <td><code>INDEX</code></td> <td>Ative a criação ou eliminação de índices. Níveis: Global, banco de dados, tabela.</td> </tr><tr> <td><code>INSERT</code></td> <td>Ative o uso de<code>INSERT</code>Níveis: Global, banco de dados, tabela, coluna.</td> </tr><tr> <td><code>LOCK TABLES</code></td> <td>Ative o uso de<code>LOCK TABLES</code>nas mesas para as quais você tem<code>SELECT</code>privilégio. Níveis: Global, banco de dados.</td> </tr><tr> <td><code>PROCESS</code></td> <td>Permitir que o usuário veja todos os processos com<a class="link" href="show-processlist.html" title="13.7.5.29 SHOW PROCESSLIST Statement"><code>SHOW PROCESSLIST</code></a>. Nível: Global.</td> </tr><tr> <td><code>PROXY</code></td> <td>Ative o proxeamento de usuários. Nível: De usuário para usuário.</td> </tr><tr> <td><code>REFERENCES</code></td> <td>Ative a criação de chave estrangeira. Níveis: Global, banco de dados, tabela, coluna.</td> </tr><tr> <td><code>RELOAD</code></td> <td>Ative o uso de<code>FLUSH</code>operações. Nível: Global.</td> </tr><tr> <td><code>REPLICATION CLIENT</code></td> <td>Permitir que o usuário peça onde estão os servidores de origem ou replicação. Nível: Global.</td> </tr><tr> <td><code>REPLICATION SLAVE</code></td> <td>Ative as réplicas para ler eventos de log binário da fonte. Nível: Global.</td> </tr><tr> <td><code>SELECT</code></td> <td>Ative o uso de<code>SELECT</code>Níveis: Global, banco de dados, tabela, coluna.</td> </tr><tr> <td><code>SHOW DATABASES</code></td> <td>Ativar<code>SHOW DATABASES</code>para mostrar todos os bancos de dados. Nível: Global.</td> </tr><tr> <td><code>SHOW VIEW</code></td> <td>Ative o uso de<code>SHOW CREATE VIEW</code>Níveis: Global, banco de dados, tabela.</td> </tr><tr> <td><code>SHUTDOWN</code></td> <td>Ative o uso de<strong>mysqladmin shutdown</strong>. Nível: Global.</td> </tr><tr> <td><code>SUPER</code></td> <td>Ative o uso de outras operações administrativas, como<code>CHANGE MASTER TO</code>,<code>KILL</code>,<code>PURGE BINARY LOGS</code>,<a class="link" href="set-variable.html" title="13.7.4.1 SET Syntax for Variable Assignment"><code>SET GLOBAL</code></a>, e<a class="link" href="mysqladmin.html" title="4.5.2 mysqladmin — A MySQL Server Administration Program"><span class="command"><strong>mysqladmin debug</strong></span></a>comando. Nível: Global.</td> </tr><tr> <td><code>TRIGGER</code></td> <td>Ative operações de gatilho. Níveis: Global, banco de dados, tabela.</td> </tr><tr> <td><code>UPDATE</code></td> <td>Ative o uso de<code>UPDATE</code>Níveis: Global, banco de dados, tabela, coluna.</td> </tr><tr> <td><code>USAGE</code></td> <td>Sinônimo de “sem privilégios”</td> </tr></tbody></table>

Um gatilho é associado a uma tabela. Para criar ou descartar um gatilho, você deve ter o privilégio `TRIGGER` para a tabela, não para o gatilho.

Nas declarações `GRANT`, o privilégio `ALL [PRIVILEGES]` ou `PROXY` deve ser nomeado por si mesmo e não pode ser especificado juntamente com outros privilégios. `ALL [PRIVILEGES]` representa todos os privilégios disponíveis para o nível em que os privilégios devem ser concedidos, exceto os privilégios `GRANT OPTION` e `PROXY`.

`USAGE` pode ser especificado para criar um usuário que não tenha privilégios, ou para especificar as cláusulas `REQUIRE` ou `WITH` para uma conta sem alterar seus privilégios existentes. (No entanto, o uso de `GRANT` para definir características sem privilégios é desaconselhado.

As informações da conta do MySQL são armazenadas nas tabelas do banco de dados do sistema `mysql`. Para obter detalhes adicionais, consulte a Seção 6.2, “Controle de Acesso e Gerenciamento de Conta”, que discute extensivamente o banco de dados do sistema `mysql` e o sistema de controle de acesso.

Se as tabelas de concessão contiverem strings de privilégio que contenham nomes de banco de dados ou tabelas com letras maiúsculas e minúsculas misturadas e a variável de sistema `lower_case_table_names` estiver definida com um valor não nulo, `REVOKE` não pode ser usado para revogar esses privilégios. É necessário manipular as tabelas de concessão diretamente. (`GRANT` não cria tais strings quando `lower_case_table_names` está definido, mas tais strings podem ter sido criadas antes de definir essa variável.)

Os privilégios podem ser concedidos em vários níveis, dependendo da sintaxe usada para a cláusula `ON`. Para `REVOKE`, a mesma sintaxe `ON` especifica quais privilégios devem ser removidos.

Para os níveis global, de banco de dados, de tabela e de rotina, `GRANT ALL` atribui apenas os privilégios que existem no nível que você está concedendo. Por exemplo, `GRANT ALL ON db_name.*` é uma declaração de nível de banco de dados, portanto, não concede privilégios exclusivos do nível global, como `FILE`. A concessão de `ALL` não atribui o privilégio `GRANT OPTION` ou `PROXY`.

A cláusula *`object_type`*, se presente, deve ser especificada como `TABLE`, `FUNCTION` ou `PROCEDURE` quando o objeto a seguir for uma tabela, uma função armazenada ou um procedimento armazenado.

Os privilégios que um usuário possui para uma base de dados, tabela, coluna ou rotina são formados aditivamente como o `OR` lógico dos privilégios da conta em cada um dos níveis de privilégio, incluindo o nível global. Não é possível negar um privilégio concedido em um nível superior pela ausência desse privilégio em um nível inferior. Por exemplo, esta declaração concede os privilégios `SELECT` e `INSERT` globalmente:

```sql
GRANT SELECT, INSERT ON *.* TO u1;
```

Os privilégios concedidos globalmente se aplicam a todas as bases de dados, tabelas e colunas, mesmo que não tenham sido concedidos em nenhum desses níveis inferiores.

Os detalhes do procedimento de verificação de privilégios são apresentados na Seção 6.2.6, “Controle de Acesso, Etapa 2: Solicitação de Verificação”.

Se você estiver usando privilégios de tabela, coluna ou rotina para até um usuário, o servidor examina os privilégios de tabela, coluna e rotina para todos os usuários e isso desacelera um pouco o MySQL. Da mesma forma, se você limitar o número de consultas, atualizações ou conexões para qualquer usuário, o servidor deve monitorar esses valores.

O MySQL permite que você conceda privilégios em bancos de dados ou tabelas que não existem. Para tabelas, os privilégios a serem concedidos devem incluir o privilégio `CREATE`. *Esse comportamento é por design*, e visa permitir que o administrador do banco de dados prepare contas e privilégios de usuário para bancos de dados ou tabelas que devem ser criados posteriormente.

Importante

*O MySQL não revoga automaticamente quaisquer privilégios quando você exclui um banco de dados ou uma tabela*. No entanto, se você excluir uma rotina, quaisquer privilégios concedidos a nível de rotina para essa rotina serão revogados.

##### Nomes de contas e senhas

Um valor *`user`* em uma declaração `GRANT` indica uma conta MySQL à qual a declaração se aplica. Para acomodar a concessão de direitos a usuários de hosts arbitrários, o MySQL suporta a especificação do valor *`user`* na forma `'user_name'@'host_name'`.

Você pode especificar caracteres especiais no nome do host. Por exemplo, `'user_name'@'%.example.com'` se aplica a *`user_name`* para qualquer host no domínio `example.com`, e `'user_name'@'198.51.100.%'` se aplica a *`user_name`* para qualquer host na sub-rede de classe C `198.51.100`.

O formulário simples `'user_name'` é sinônimo de `'user_name'@'%'`.

*O MySQL não suporta caracteres asteriscos em nomes de usuários*. Para se referir a um usuário anônimo, especifique uma conta com um nome de usuário vazio com a declaração `GRANT`:

```sql
GRANT ALL ON test.* TO ''@'localhost' ...;
```

Neste caso, qualquer usuário que se conecte ao host local com a senha correta para o usuário anônimo terá permissão para acessar, com os privilégios associados à conta do usuário anônimo.

Para obter informações adicionais sobre os valores de nome de usuário e nome de host em nomes de contas, consulte a Seção 6.2.4, “Especificação de Nomes de Conta”.

Aviso

Se você permitir que usuários anônimos locais se conectem ao servidor MySQL, também deve conceder privilégios a todos os usuários locais, conforme `'user_name'@'localhost'`. Caso contrário, a conta de usuário anônimo para `localhost` na tabela de sistema `mysql.user` é usada quando usuários nomeados tentam fazer login no servidor MySQL a partir da máquina local. Para obter detalhes, consulte a Seção 6.2.5, “Controle de Acesso, Etapa 1: Verificação de Conexão”.

Para determinar se esse problema se aplica a você, execute a seguinte consulta, que lista quaisquer usuários anônimos:

```sql
SELECT Host, User FROM mysql.user WHERE User='';
```

Para evitar o problema descrito acima, exclua a conta de usuário anônimo local usando esta declaração:

```sql
DROP USER ''@'localhost';
```

Para a sintaxe de `GRANT` que permite que um valor *`auth_option`* siga um valor *`user`*, *`auth_option`* começa com `IDENTIFIED` e indica como a conta autentica, especificando um plugin de autenticação de conta, credenciais (por exemplo, uma senha) ou ambos. A sintaxe da cláusula *`auth_option`* é a mesma que para a declaração `CREATE USER`. Para detalhes, consulte a Seção 13.7.1.2, “Declaração CREATE USER”.

Nota

O uso de `GRANT` para definir características de autenticação de conta é descontinuado no MySQL 5.7. Em vez disso, estabeleça ou mude as características de autenticação usando `CREATE USER` ou `ALTER USER`. Espere que essa capacidade `GRANT` seja removida em uma versão futura do MySQL.

Quando o `IDENTIFIED` está presente e você tem o privilégio de concessão global (`GRANT OPTION`), qualquer senha especificada se torna a nova senha da conta, mesmo que a conta exista e já tenha uma senha. Sem o `IDENTIFIED`, a senha da conta permanece inalterada.

##### Prêmios globais

Os privilégios globais são administrativos ou aplicam-se a todas as bases de dados em um servidor específico. Para atribuir privilégios globais, use a sintaxe `ON *.*`:

```sql
GRANT ALL ON *.* TO 'someuser'@'somehost';
GRANT SELECT, INSERT ON *.* TO 'someuser'@'somehost';
```

Os privilégios `CREATE TABLESPACE`, `CREATE USER`, `FILE`, `PROCESS`, `RELOAD`, `REPLICATION CLIENT`, `REPLICATION SLAVE`, `SHOW DATABASES`, `SHUTDOWN` e `SUPER` são administrativos e só podem ser concedidos globalmente.

Outros privilégios podem ser concedidos globalmente ou em níveis mais específicos.

`GRANT OPTION` concedido a nível global para qualquer privilégio global aplica-se a todos os privilégios globais.

O MySQL armazena privilégios globais na tabela de sistema `mysql.user`.

##### Permissões de banco de dados

Os privilégios de banco de dados se aplicam a todos os objetos em um banco de dados específico. Para atribuir privilégios de nível de banco de dados, use a sintaxe `ON db_name.*`:

```sql
GRANT ALL ON mydb.* TO 'someuser'@'somehost';
GRANT SELECT, INSERT ON mydb.* TO 'someuser'@'somehost';
```

Se você usar a sintaxe `ON *` (em vez de `ON *.*`), os privilégios são atribuídos ao nível do banco de dados para o banco de dados padrão. Um erro ocorre se não houver um banco de dados padrão.

Os privilégios `CREATE`, `DROP`, `EVENT`, `GRANT OPTION`, `LOCK TABLES` e `REFERENCES` podem ser especificados no nível do banco de dados. Privilegios de tabela ou rotina também podem ser especificados no nível do banco de dados, no caso, eles se aplicam a todas as tabelas ou rotinas no banco de dados.

MySQL armazena os privilégios do banco de dados na tabela do sistema `mysql.db`.

##### Tabela de privilégios

Os privilégios de tabela se aplicam a todas as colunas de uma tabela específica. Para atribuir privilégios de nível de tabela, use a sintaxe `ON db_name.tbl_name`:

```sql
GRANT ALL ON mydb.mytbl TO 'someuser'@'somehost';
GRANT SELECT, INSERT ON mydb.mytbl TO 'someuser'@'somehost';
```

Se você especificar *`tbl_name`* em vez de *`db_name.tbl_name`*, a declaração se aplica a *`tbl_name`* no banco de dados padrão. Um erro ocorre se não houver um banco de dados padrão.

Os valores permitidos *`priv_type`* ao nível da tabela são `ALTER`, `CREATE VIEW`, `CREATE`, `DELETE`, `DROP`, `GRANT OPTION`, `INDEX`, `INSERT`, `REFERENCES`, `SELECT`, `SHOW VIEW`, `TRIGGER` e `UPDATE`.

Os privilégios de nível de tabela se aplicam a tabelas e visualizações de base. Eles não se aplicam a tabelas criadas com `CREATE TEMPORARY TABLE`, mesmo que os nomes das tabelas correspondam. Para informações sobre os privilégios de tabela da tabela `TEMPORARY`, consulte a Seção 13.1.18.2, “Declaração CREATE TEMPORARY TABLE”.

MySQL armazena privilégios de tabela na tabela do sistema `mysql.tables_priv`.

##### Coluna Privilegios

Os privilégios de coluna se aplicam a colunas individuais em uma tabela específica. Cada privilégio a ser concedido no nível da coluna deve ser seguido pela coluna ou colunas, encerradas entre parênteses.

```sql
GRANT SELECT (col1), INSERT (col1, col2) ON mydb.mytbl TO 'someuser'@'somehost';
```

Os valores *`priv_type`* permitidos para uma coluna (ou seja, quando você usa uma cláusula *`column_list`*) são `INSERT`, `REFERENCES`, `SELECT` e `UPDATE`.

MySQL armazena privilégios de coluna na tabela `mysql.columns_priv` do sistema.

##### Privilegios de rotina armazenados

Os privilégios `ALTER ROUTINE`, `CREATE ROUTINE`, `EXECUTE` e `GRANT OPTION` aplicam-se a rotinas armazenadas (procedimentos e funções). Eles podem ser concedidos nos níveis global e de banco de dados. Exceto para `CREATE ROUTINE`, esses privilégios podem ser concedidos no nível da rotina para rotinas individuais.

```sql
GRANT CREATE ROUTINE ON mydb.* TO 'someuser'@'somehost';
GRANT EXECUTE ON PROCEDURE mydb.myproc TO 'someuser'@'somehost';
```

Os valores *`priv_type`* permitidos ao nível de rotina são `ALTER ROUTINE`, `EXECUTE` e `GRANT OPTION`. `CREATE ROUTINE` não é um privilégio ao nível de rotina, pois você deve ter o privilégio ao nível global ou do banco de dados para criar uma rotina em primeiro lugar.

MySQL armazena privilégios de nível de rotina na tabela do sistema `mysql.procs_priv`.

##### Permissões de Usuário Proxy

O privilégio `PROXY` permite que um usuário seja um representante de outro. O usuário proxy assume ou assume a identidade do usuário representado; ou seja, assume os privilégios do usuário representado.

```sql
GRANT PROXY ON 'localuser'@'localhost' TO 'externaluser'@'somehost';
```

Quando `PROXY` é concedido, ele deve ser o único privilégio mencionado na declaração `GRANT`, a cláusula `REQUIRE` não pode ser concedida, e a única opção `WITH` permitida é `WITH GRANT OPTION`.

A proxy exige que o usuário da proxy se autentique por meio de um plugin que retorne o nome do usuário proxy ao servidor quando o usuário da proxy se conectar, e que o usuário da proxy tenha o privilégio `PROXY` para o usuário proxy. Para detalhes e exemplos, consulte a Seção 6.2.14, “Usuários de Proxy”.

MySQL armazena privilégios de proxy na tabela de sistema `mysql.proxies_priv`.

##### Criação Implícita de Conta

Se uma conta mencionada em uma declaração `GRANT` não existir, a ação tomada depende do modo SQL `NO_AUTO_CREATE_USER`:

* Se `NO_AUTO_CREATE_USER` não estiver habilitado, `GRANT` cria a conta. * Isso é muito inseguro* a menos que você especifique uma senha não vazia usando `IDENTIFIED BY`.

* Se `NO_AUTO_CREATE_USER` estiver habilitado, `GRANT` falha e não cria a conta, a menos que você especifique uma senha não vazia usando `IDENTIFIED BY` ou nomeie um plugin de autenticação usando `IDENTIFIED WITH`.

Se a conta já existir, `IDENTIFIED WITH` é proibido, pois é destinado apenas para uso ao criar novas contas.

##### Outras características da conta

O MySQL pode verificar os atributos do certificado X.509 além da autenticação usual, que é baseada no nome do usuário e nas credenciais. Para informações de fundo sobre o uso do SSL com o MySQL, consulte a Seção 6.3, “Usando conexões criptografadas”.

A cláusula opcional `REQUIRE` especifica opções relacionadas ao SSL para uma conta MySQL. A sintaxe é a mesma da declaração `CREATE USER`. Para detalhes, consulte a Seção 13.7.1.2, “Declaração CREATE USER”.

Nota

O uso de `GRANT` para definir as características de SSL da conta é descontinuado no MySQL 5.7. Em vez disso, estabeleça ou mude as características SSL usando `CREATE USER` ou `ALTER USER`. Espere que essa capacidade `GRANT` seja removida em uma versão futura do MySQL.

A cláusula opcional `WITH` é usada para esses propósitos:

* Para permitir que um usuário conceda privilégios a outros usuários
* Para especificar limites de recursos para um usuário

A cláusula `WITH GRANT OPTION` permite que o usuário conceda a outros usuários quaisquer privilégios que o usuário tenha no nível de privilégio especificado.

Para conceder o privilégio `GRANT OPTION` a uma conta sem alterar seus privilégios, faça o seguinte:

```sql
GRANT USAGE ON *.* TO 'someuser'@'somehost' WITH GRANT OPTION;
```

Tenha cuidado com quem você concede o privilégio do `GRANT OPTION`, pois dois usuários com diferentes privilégios podem combinar os privilégios!

Você não pode conceder a outro usuário um privilégio que você mesmo não possui; o privilégio `GRANT OPTION` permite que você atribua apenas os privilégios que você mesmo possui.

Tenha em atenção que, ao conceder a um utilizador o privilégio `GRANT OPTION` num determinado nível de privilégio, quaisquer privilégios que o utilizador possua (ou que lhe possam ser concedidos no futuro) nesse nível também podem ser concedidos por esse utilizador a outros utilizadores. Suponha que conceda a um utilizador o privilégio `INSERT` numa base de dados. Se, em seguida, conceder o privilégio `SELECT` na base de dados e especificar `WITH GRANT OPTION`, esse utilizador pode conceder a outros utilizadores não só o privilégio `SELECT`, mas também `INSERT`. Se, em seguida, conceder o privilégio `UPDATE` ao utilizador na base de dados, o utilizador pode conceder `INSERT`, `SELECT` e `UPDATE`.

Para um usuário não administrativo, você não deve conceder o privilégio `ALTER` globalmente ou para o banco de dados do sistema `mysql`. Se você fizer isso, o usuário pode tentar subverter o sistema de privilégios renomeando as tabelas!

Para informações adicionais sobre os riscos de segurança associados a privilégios específicos, consulte a Seção 6.2.2, “Privilégios fornecidos pelo MySQL”.

É possível estabelecer limites de uso de recursos do servidor por uma conta, conforme discutido na Seção 6.2.16, “Definindo Limites de Recursos de Conta”. Para fazer isso, use uma cláusula `WITH` que especifica um ou mais valores *`resource_option`*. Limites não especificados retêm seus valores atuais. A sintaxe é a mesma que para a declaração `CREATE USER`. Para detalhes, consulte a Seção 13.7.1.2, “Declaração CREATE USER”.

Nota

O uso de `GRANT` para definir limites de recursos da conta é descontinuado no MySQL 5.7. Em vez disso, estabeleça ou mude os limites de recursos usando `CREATE USER` ou `ALTER USER`. Espere que essa capacidade `GRANT` seja removida em uma versão futura do MySQL.

##### Versões de MySQL e SQL Padrão do GRANT

As maiores diferenças entre as versões MySQL e SQL padrão do `GRANT` são:

* O MySQL associa privilégios à combinação de um nome de host e nome de usuário e não apenas ao nome de usuário.

* O SQL padrão não possui privilégios globais ou de nível de banco de dados, e não suporta todos os tipos de privilégio que o MySQL suporta.

* O MySQL não suporta o privilégio padrão SQL `UNDER`.

* Os privilégios SQL padrão são estruturados de forma hierárquica. Se você remover um usuário, todos os privilégios que o usuário recebeu serão revogados. Isso também é válido no MySQL se você usar `DROP USER`. Veja a Seção 13.7.1.3, “Instrução DROP USER”.

* No SQL padrão, quando você exclui uma tabela, todos os privilégios da tabela são revogados. No SQL padrão, quando você revoga um privilégio, todos os privilégios que foram concedidos com base nesse privilégio também são revogados. No MySQL, os privilégios podem ser excluídos com as declarações `DROP USER` ou `REVOKE`.

* Em MySQL, é possível ter o privilégio `INSERT` apenas para algumas das colunas de uma tabela. Nesse caso, ainda é possível executar instruções `INSERT` na tabela, desde que você insira valores apenas para as colunas para as quais você tem o privilégio `INSERT`. As colunas omitidas são definidas com seus valores padrão implícitos se o modo SQL rigoroso não estiver habilitado. No modo rigoroso, a declaração é rejeitada se qualquer uma das colunas omitidas não tiver um valor padrão. (O SQL padrão exige que você tenha o privilégio `INSERT` em todas as colunas.) Para informações sobre o modo SQL rigoroso e valores padrão de tipo de dados implícitos, consulte a Seção 5.1.10, “Modos SQL do servidor”, e a Seção 11.6, “Valores padrão de tipo de dados”.

#### 13.7.1.5 Declaração de RENOMEAR USUÁRIO

```sql
RENAME USER old_user TO new_user
    [, old_user TO new_user] ...
```

A declaração `RENAME USER` renomeia contas existentes do MySQL. Um erro ocorre para contas antigas que não existem ou novas contas que já existem.

Para usar `RENAME USER`, você deve ter o privilégio global `CREATE USER`, ou o privilégio `UPDATE` para o banco de dados do sistema `mysql`. Quando a variável de sistema `read_only` é habilitada, `RENAME USER` requer adicionalmente o privilégio `SUPER`.

Cada nome de conta usa o formato descrito na Seção 6.2.4, “Especificação de Nomes de Conta”. Por exemplo:

```sql
RENAME USER 'jeffrey'@'localhost' TO 'jeff'@'127.0.0.1';
```

A parte do nome de host do nome da conta, se omitida, tem como padrão `'%'`.

`RENAME USER` faz com que os privilégios mantidos pelo usuário antigo sejam os mantidos pelo novo usuário. No entanto, `RENAME USER` não descarta ou invalida automaticamente bancos de dados ou objetos dentro deles que o usuário antigo criou. Isso inclui programas ou visualizações armazenadas para as quais os nomes dos atributos `DEFINER` são fornecidos pelo usuário antigo. Tentativas de acessar tais objetos podem produzir um erro se forem executadas em contexto de segurança do definidor. (Para informações sobre contexto de segurança, consulte a Seção 23.6, “Controle de Acesso a Objetos Armazenados”.)

As alterações de privilégio entram em vigor conforme indicado na Seção 6.2.9, “Quando as Alterações de Privilegio Entram em Vigor”.

#### 13.7.1.6 Declaração de REVOGAÇÃO

```sql
REVOKE
    priv_type [(column_list)]
      [, priv_type [(column_list)]] ...
    ON [object_type] priv_level
    FROM user [, user] ...

REVOKE ALL [PRIVILEGES], GRANT OPTION
    FROM user [, user] ...

REVOKE PROXY ON user
    FROM user [, user] ...
```

A declaração `REVOKE` permite que os administradores do sistema revirem privilégios de contas do MySQL.

Para obter detalhes sobre os níveis em que os privilégios existem, os valores permitidos *`priv_type`*, *`priv_level`* e *`object_type`*, e a sintaxe para especificar usuários e senhas, consulte a Seção 13.7.1.4, “Declaração GRANT”.

Quando a variável de sistema `read_only` é habilitada, `REVOKE` requer o privilégio `SUPER`, além de quaisquer outros privilégios necessários descritos na discussão a seguir.

Cada nome de conta usa o formato descrito na Seção 6.2.4, “Especificação de Nomes de Conta”. Por exemplo:

```sql
REVOKE INSERT ON *.* FROM 'jeffrey'@'localhost';
```

A parte do nome de host do nome da conta, se omitida, tem como padrão `'%'`.

Para usar a sintaxe do primeiro `REVOKE`, você deve ter o privilégio `GRANT OPTION`, e você deve ter os privilégios que você está revogando.

Para revogar todos os privilégios, use a segunda sintaxe, que exclui todos os privilégios globais, de banco de dados, de tabela, de coluna e de rotina para o(s) usuário(s) nomeado(s):

```sql
REVOKE ALL PRIVILEGES, GRANT OPTION FROM user [, user] ...
```

Para usar essa sintaxe `REVOKE`, você deve ter o privilégio global `CREATE USER`, ou o privilégio `UPDATE` para o banco de dados do sistema `mysql`.

As contas de usuários das quais os privilégios devem ser revogados devem existir, mas os privilégios que devem ser revogados não precisam ser concedidos atualmente a eles.

`REVOKE` remove privilégios, mas não remove strings da tabela do sistema `mysql.user`. Para remover uma conta de usuário completamente, use `DROP USER`. Veja a Seção 13.7.1.3, “Declaração DROP USER”.

Se as tabelas de concessão contiverem strings de privilégio que contenham nomes de banco de dados ou tabelas com letras maiúsculas e minúsculas misturadas e a variável `lower_case_table_names` estiver definida com um valor não nulo, `REVOKE` não pode ser usado para revogar esses privilégios. É necessário manipular as tabelas de concessão diretamente. (`GRANT` não cria tais strings quando `lower_case_table_names` está definido, mas tais strings podem ter sido criadas antes de definir a variável.)

Quando executado com sucesso a partir do programa **mysql**, `REVOKE` responde com `Query OK, 0 rows affected`. Para determinar quais privilégios permanecem após a operação, use `SHOW GRANTS`. Veja a Seção 13.7.5.21, “Declaração SHOW GRANTS”.

#### 13.7.1.7 Declaração de definição de senha

```sql
SET PASSWORD [FOR user] = password_option

password_option: {
    'auth_string'
  | PASSWORD('auth_string')
}
```

A declaração `SET PASSWORD` atribui uma senha a uma conta de usuário do MySQL. `'auth_string'` representa uma senha em texto claro (não criptografada).

Nota

* A sintaxe `SET PASSWORD ... = PASSWORD('auth_string')` é desatualizada no MySQL 5.7 e foi removida no MySQL 8.0.

* A sintaxe de `SET PASSWORD ... = 'auth_string'` não é descontinuada, mas `ALTER USER` é a declaração preferida para alterações de contas, incluindo a atribuição de senhas. Por exemplo:

  ```sql
  ALTER USER user IDENTIFIED BY 'auth_string';
  ```

Importante

Em algumas circunstâncias, `SET PASSWORD` pode ser registrado em logs do servidor ou no lado do cliente em um arquivo de histórico, como `~/.mysql_history`, o que significa que senhas em texto claro podem ser lidas por qualquer pessoa que tenha acesso de leitura a essas informações. Para informações sobre as condições sob as quais isso ocorre para os logs do servidor e como controlá-lo, consulte a Seção 6.1.2.3, “Senhas e Registro”. Para informações semelhantes sobre o registro no lado do cliente, consulte a Seção 4.5.1.3, “Registro do Cliente do mysql”.

`SET PASSWORD` pode ser usado com ou sem uma cláusula `FOR` que nomeia explicitamente uma conta de usuário:

* Com uma cláusula `FOR user`, a declaração define a senha para a conta designada, que deve existir:

  ```sql
  SET PASSWORD FOR 'jeffrey'@'localhost' = 'auth_string';
  ```

* Sem a cláusula `FOR user`, a declaração define a senha para o usuário atual:

  ```sql
  SET PASSWORD = 'auth_string';
  ```

Qualquer cliente que se conecte ao servidor usando uma conta não anônima pode alterar a senha dessa conta. (Em particular, você pode alterar sua própria senha.) Para ver qual conta o servidor a autenticou, invoque a função `CURRENT_USER()`:

  ```sql
  SELECT CURRENT_USER();
  ```

Se uma cláusula `FOR user` for fornecida, o nome da conta usa o formato descrito na Seção 6.2.4, “Especificação de Nomes de Conta”. Por exemplo:

```sql
SET PASSWORD FOR 'bob'@'%.example.org' = 'auth_string';
```

A parte do nome de host do nome da conta, se omitida, tem como padrão `'%'`.

Definir a senha para uma conta nomeada (com uma cláusula `FOR`) requer o privilégio `UPDATE` para o banco de dados do sistema `mysql`. Definir a senha para si mesmo (para uma conta não anônima sem cláusula `FOR`) não requer privilégios especiais. Quando a variável de sistema `read_only` é habilitada, `SET PASSWORD` requer o privilégio `SUPER`, além de quaisquer outros privilégios necessários.

A senha pode ser especificada das seguintes formas:

* Use uma string sem `PASSWORD()`

  ```sql
  SET PASSWORD FOR 'jeffrey'@'localhost' = 'password';
  ```

`SET PASSWORD` interpreta a string como uma string em texto claro, passa-a para o plugin de autenticação associado à conta e armazena o resultado retornado pelo plugin na string da conta na tabela do sistema `mysql.user`. (O plugin recebe a oportunidade de criptografar o valor no formato de criptografia que ele espera. O plugin pode usar o valor conforme especificado, nesse caso, não ocorre criptografia.)

* Use a função `PASSWORD()` (descontinuada no MySQL 5.7)

  ```sql
  SET PASSWORD FOR 'jeffrey'@'localhost' = PASSWORD('password');
  ```

O argumento `PASSWORD()` é a senha em texto claro (não criptografada). `PASSWORD()` encripta a senha e retorna a cadeia de caracteres criptografada da senha para armazenamento na string de conta na tabela do sistema `mysql.user`.

A função `PASSWORD()` encripta a senha usando o método de encriptação determinado pelo valor da variável de sistema `old_passwords`. Certifique-se de que `old_passwords` tenha o valor correspondente ao método de encriptação esperado pelo plugin de autenticação associado à conta. Por exemplo, se a conta usa o plugin `mysql_native_password`, o valor de `old_passwords` deve ser 0:

  ```sql
  SET old_passwords = 0;
  SET PASSWORD FOR 'jeffrey'@'localhost' = PASSWORD('password');
  ```

Se o valor de `old_passwords` for diferente do requerido pelo plugin de autenticação, o valor da senha criptografada retornado por `PASSWORD()` não pode ser utilizado pelo plugin e a autenticação correta das conexões do cliente não pode ocorrer.

A tabela a seguir mostra, para cada método de hashing de senha, o valor permitido de `old_passwords` e quais plugins de autenticação usam o método de hashing.

<table summary="For each password hashing method, the permitted value of old_passwords and which authentication plugins use the hashing method"><col style="width: 40%"/><col style="width: 20%"/><col style="width: 40%"/><thead><tr> <th>Método de hashing de senha</th> <th>senhas antigas Valor</th> <th>Plugin de Autenticação Associada</th> </tr></thead><tbody><tr> <th>MySQL 4.1 native hashing</th> <td>0</td> <td><code>mysql_native_password</code></td> </tr><tr> <th>SHA-256 hashing</th> <td>2</td> <td><code>sha256_password</code></td> </tr></tbody></table>

Para obter informações adicionais sobre a definição de senhas e plugins de autenticação, consulte a Seção 6.2.10, “Atribuição de senhas de conta”, e a Seção 6.2.13, “Autenticação substituível”.

### 13.7.2 Declarações de manutenção de tabela

#### 13.7.2.1 Declaração de Tabela de Análise

```sql
ANALYZE [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name [, tbl_name] ...
```

`ANALYZE TABLE` realiza uma análise de distribuição de chaves e armazena a distribuição para a(s) tabela(s) nomeada(s). Para as tabelas `MyISAM`, essa declaração é equivalente ao uso de **myisamchk --analyze**.

Essa declaração exige privilégios `SELECT` e `INSERT` para a tabela.

A tabela `ANALYZE TABLE` funciona com as tabelas `InnoDB`, `NDB` e `MyISAM`. Não funciona com vistas.

`ANALYZE TABLE` é suportado para tabelas particionadas e você pode usar `ALTER TABLE ... ANALYZE PARTITION` para analisar uma ou mais partições; para mais informações, consulte Seção 13.1.8, “Instrução ALTER TABLE”, e Seção 22.3.4, “Manutenção de Partições”.

Durante a análise, a tabela é bloqueada com um bloqueio de leitura para `InnoDB` e `MyISAM`.

`ANALYZE TABLE` remove a tabela do cache de definição de tabela, o que requer um bloqueio de esvaziamento. Se houver instruções ou transações em andamento que ainda estão usando a tabela, as instruções e transações subsequentes devem esperar que essas operações sejam concluídas antes de o bloqueio de esvaziamento ser liberado. Como o próprio `ANALYZE TABLE` geralmente termina rapidamente, pode não ser aparente que as transações ou instruções com atraso que envolvem a mesma tabela são devidas ao bloqueio de esvaziamento restante.

Por padrão, o servidor escreve as declarações `ANALYZE TABLE` no log binário para que elas sejam replicadas para as réplicas. Para suprimir o registro, especifique a palavra-chave opcional `NO_WRITE_TO_BINLOG` ou seu alias `LOCAL`.

* Saída da TABELA DE ANÁLISE * Análise da Distribuição de Chave * Outras Considerações

##### ANÁLISE DE TABELA de Saída

`ANALYZE TABLE` retorna um conjunto de resultados com as colunas mostradas na tabela a seguir.

<table summary="Columns of the ANALYZE TABLE result set."><col style="width: 15%"/><col style="width: 60%"/><thead><tr> <th>Column</th> <th>Valor</th> </tr></thead><tbody><tr> <td><code>Table</code></td> <td>O nome da tabela</td> </tr><tr> <td><code>Op</code></td> <td>Sempre<code>analyze</code></td> </tr><tr> <td><code>Msg_type</code></td> <td><code>status</code>,<code>error</code>,<code>info</code>,<code>note</code>, ou<code>warning</code></td> </tr><tr> <td><code>Msg_text</code></td> <td>Uma mensagem informativa</td> </tr></tbody></table>

##### Análise da Distribuição de Chave

Se a tabela não tiver sido alterada desde a última análise da distribuição de chaves, a tabela não será analisada novamente.

O MySQL utiliza a distribuição de chave armazenada para decidir a ordem de junção da tabela para junções em algo que não é uma constante. Além disso, as distribuições de chave podem ser usadas para decidir quais índices usar para uma tabela específica dentro de uma consulta.

Para verificar a cardinalidade da distribuição de chaves armazenada, use a declaração `SHOW INDEX` ou a tabela `INFORMATION_SCHEMA` `STATISTICS`. Veja a Seção 13.7.5.22, “Declaração SHOW INDEX”, e a Seção 24.3.24, “A Tabela de Estatísticas do INFORMATION_SCHEMA”.

Para as tabelas `InnoDB`, `ANALYZE TABLE` determina a cardinalidade do índice realizando mergulhos aleatórios em cada um dos árvores do índice e atualizando as estimativas da cardinalidade do índice conforme necessário. Como essas são apenas estimativas, execuções repetidas de `ANALYZE TABLE` podem produzir números diferentes. Isso torna `ANALYZE TABLE` rápido em tabelas `InnoDB`, mas não 100% preciso, porque não leva em conta todas as strings.

Você pode tornar as estatísticas coletadas por `ANALYZE TABLE` mais precisas e mais estáveis ao habilitar `innodb_stats_persistent`, conforme explicado na Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas de Optimizer Persistente”. Quando o `innodb_stats_persistent` é habilitado, é importante executar o `ANALYZE TABLE` após mudanças importantes nos dados da coluna de índice, pois as estatísticas não são recalculadas periodicamente (como após o reinício do servidor).

Se `innodb_stats_persistent` estiver habilitado, você pode alterar o número de mergulhos aleatórios modificando a variável de sistema `innodb_stats_persistent_sample_pages`. Se `innodb_stats_persistent` estiver desativado, modifique `innodb_stats_transient_sample_pages` em vez disso.

Para mais informações sobre a análise da distribuição de chaves em `InnoDB`, consulte a Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas de Optimizador Persistente”, e a Seção 14.8.11.3, “Estimativa da Complexidade da Tabela ANALYZE para Tabelas InnoDB”.

O MySQL utiliza estimativas de cardinalidade de índices na otimização de junções. Se uma junção não for otimizada da maneira correta, tente executar `ANALYZE TABLE`. Nos poucos casos em que `ANALYZE TABLE` não produz valores suficientes para suas tabelas específicas, você pode usar `FORCE INDEX` com suas consultas para forçar o uso de um índice específico, ou definir a variável de sistema `max_seeks_for_key` para garantir que o MySQL prefira buscas de índice em vez de varreduras de tabela. Veja a Seção B.3.5, “Problemas Relacionados ao Otimizador”.

##### Outras considerações

`ANALYZE TABLE` limpa as estatísticas da tabela do esquema de informações `INNODB_SYS_TABLESTATS` e define a coluna `STATS_INITIALIZED` para `Uninitialized`. As estatísticas são coletadas novamente na próxima vez que a tabela é acessada.

#### 13.7.2.2 Declaração de tabela de verificação

```sql
CHECK TABLE tbl_name [, tbl_name] ... [option] ...

option: {
    FOR UPGRADE
  | QUICK
  | FAST
  | MEDIUM
  | EXTENDED
  | CHANGED
}
```

`CHECK TABLE` verifica uma tabela ou tabelas em busca de erros. Para as tabelas `MyISAM`, as estatísticas chave também são atualizadas. `CHECK TABLE` também pode verificar visões em busca de problemas, como tabelas que são referenciadas na definição da visão e que não existem mais.

Para verificar uma tabela, você deve ter algum privilégio para isso.

`CHECK TABLE` funciona para as tabelas `InnoDB`, `MyISAM`, `ARCHIVE` e `CSV`.

Antes de executar `CHECK TABLE` em tabelas `InnoDB`, consulte as Notas de uso de Tabela CHECK para Tabelas InnoDB.

`CHECK TABLE` é suportado para tabelas particionadas, e você pode usar `ALTER TABLE ... CHECK PARTITION` para verificar uma ou mais partições; para mais informações, consulte Seção 13.1.8, “Instrução ALTER TABLE”, e Seção 22.3.4, “Manutenção de Partições”.

`CHECK TABLE` ignora colunas geradas virtualmente que não estão indexadas.

* SAIBA TABELA de Saída
* Verificar a compatibilidade da versão
* Verificar a consistência dos dados
* Notas de uso de CHECK TABLE para tabelas InnoDB
* Notas de uso de CHECK TABLE para tabelas MyISAM

##### VER TABELA de Saída

`CHECK TABLE` retorna um conjunto de resultados com as colunas mostradas na tabela a seguir.

<table summary="Columns of the CHECK TABLE result set."><col style="width: 15%"/><col style="width: 60%"/><thead><tr> <th>Column</th> <th>Valor</th> </tr></thead><tbody><tr> <td><code>Table</code></td> <td>O nome da tabela</td> </tr><tr> <td><code>Op</code></td> <td>Sempre<code>check</code></td> </tr><tr> <td><code>Msg_type</code></td> <td><code>status</code>,<code>error</code>,<code>info</code>,<code>note</code>, ou<code>warning</code></td> </tr><tr> <td><code>Msg_text</code></td> <td>Uma mensagem informativa</td> </tr></tbody></table>

A declaração pode gerar muitas strings de informações para cada tabela verificada. A última string tem um valor de `Msg_type` de `status` e o `Msg_text` normalmente deve ser `OK`. Para uma tabela `MyISAM`, se você não obtém `OK` ou `Table is already up to date`, normalmente deve executar uma reparação da tabela. Veja a Seção 7.6, “Manutenção e Recuperação de Quebra de Tabela MyISAM”. `Table is already up to date` significa que o motor de armazenamento da tabela indicada que não era necessário verificar a tabela.

##### Verificar a compatibilidade da versão

A opção `FOR UPGRADE` verifica se as tabelas nomeadas são compatíveis com a versão atual do MySQL. Com `FOR UPGRADE`, o servidor verifica cada tabela para determinar se houve alguma alteração incompatível em qualquer um dos tipos de dados ou índices da tabela desde que a tabela foi criada. Se não houver, a verificação é bem-sucedida. Caso contrário, se houver uma possível incompatibilidade, o servidor executa uma verificação completa na tabela (que pode levar algum tempo). Se a verificação completa for bem-sucedida, o servidor marca o arquivo `.frm` da tabela com o número da versão MySQL atual. Marcar o arquivo `.frm` garante que as verificações adicionais para a tabela com a mesma versão do servidor sejam rápidas.

Pode ocorrer incompatibilidade porque o formato de armazenamento de um tipo de dados mudou ou porque sua ordem de classificação mudou. Nosso objetivo é evitar essas mudanças, mas, ocasionalmente, elas são necessárias para corrigir problemas que seriam piores do que uma incompatibilidade entre as versões.

`FOR UPGRADE` descobre essas incompatibilidades:

* A ordem de indexação para espaço final nas colunas `TEXT` para as tabelas `InnoDB` e `MyISAM` mudou entre o MySQL 4.1 e 5.0.

* O método de armazenamento do novo tipo de dados `DECIMAL` - DECIMAL, NUMERIC") foi alterado entre MySQL 5.0.3 e 5.0.5.

* Se a sua tabela foi criada por uma versão diferente do servidor MySQL do que a que você está executando atualmente, `FOR UPGRADE` indica que a tabela tem um arquivo `.frm` com uma versão incompatível. Neste caso, o conjunto de resultados retornado por `CHECK TABLE` contém uma string com um valor `Msg_type` de `error` e um valor `Msg_text` de `` Table upgrade required. Please do "REPAIR TABLE `tbl_name`" to fix it! ``

* Algumas vezes, são feitas alterações nos conjuntos de caracteres ou nas codificações que exigem a reconstrução dos índices da tabela. Para obter detalhes sobre essas alterações, consulte a Seção 2.10.3, “Alterações no MySQL 5.7”. Para informações sobre a reconstrução de tabelas, consulte a Seção 2.10.12, “Reconstrução ou reparo de tabelas ou índices”.

* O tipo de dados `YEAR(2)` é desatualizado e o suporte para ele é removido no MySQL 5.7.5. Para tabelas que contêm colunas `YEAR(2)`, `CHECK TABLE` recomenda `REPAIR TABLE`, que converte colunas `YEAR(2)` de 2 dígitos em colunas `YEAR` de 4 dígitos.

* A partir do MySQL 5.7.2, o tempo de criação do gatilho é mantido. Se executado contra uma tabela que possui gatilhos, `CHECK TABLE ... FOR UPGRADE` exibe este aviso para cada gatilho criado antes do MySQL 5.7.2:

  ```sql
  Trigger db_name.tbl_name.trigger_name does not have CREATED attribute.
  ```

O aviso é apenas informativo. Não há alteração no gatilho.

* A partir do MySQL 5.7.7, uma tabela é relatada como necessitando de uma reconstrução se contiver antigas colunas temporais no formato pré-5.6.4 (as colunas `TIME`, `DATETIME` e `TIMESTAMP`) sem suporte para precisão de frações de segundo) e a variável de sistema `avoid_temporal_upgrade` está desativada. Isso ajuda o procedimento de atualização do MySQL a detectar e atualizar tabelas que contenham antigas colunas temporais. Se `avoid_temporal_upgrade` estiver habilitado, `FOR UPGRADE` ignora as colunas temporais antigas presentes na tabela; consequentemente, o procedimento de atualização não as atualiza.

Para verificar as tabelas que contêm colunas temporais e precisam de uma reconstrução, desative `avoid_temporal_upgrade` antes de executar `CHECK TABLE ... FOR UPGRADE`.

* As advertências são emitidas para tabelas que utilizam particionamento não nativo, pois o particionamento não nativo é descontinuado no MySQL 5.7 e removido no MySQL 8.0. Veja o Capítulo 22, *Particionamento*.

##### Verificação da Consistência dos Dados

A tabela a seguir mostra as outras opções de verificação que podem ser fornecidas. Essas opções são passadas para o motor de armazenamento, que pode usá-las ou ignorá-las.

<table summary="Other CHECK TABLE options."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Type</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>QUICK</code></td> <td>Não escaneie as strings para verificar se há links incorretos. Aplica-se a<code>InnoDB</code>e<code>MyISAM</code>tabelas e visualizações.</td> </tr><tr> <td><code>FAST</code></td> <td>Verifique apenas as tabelas que não foram fechadas corretamente. Ignorado para<code>InnoDB</code>; aplica-se apenas a<code>MyISAM</code>tabelas e visualizações.</td> </tr><tr> <td><code>CHANGED</code></td> <td>Verifique apenas as tabelas que foram alteradas desde a última verificação ou que não foram fechadas corretamente. Ignorado para<code>InnoDB</code>; aplica-se apenas a<code>MyISAM</code>tabelas e visualizações.</td> </tr><tr> <td><code>MEDIUM</code></td> <td>Escanear as strings para verificar se os links excluídos são válidos. Isso também calcula um checksum de chave para as strings e verifica isso com um checksum calculado para as chaves. Ignorado para<code>InnoDB</code>; aplica-se apenas a<code>MyISAM</code>tabelas e visualizações.</td> </tr><tr> <td><code>EXTENDED</code></td> <td>Faça uma pesquisa completa de chaves para todas as chaves de cada string. Isso garante que a tabela seja 100% consistente, mas leva um longo tempo. Ignorado para<code>InnoDB</code>; aplica-se apenas a<code>MyISAM</code>tabelas e visualizações.</td> </tr></tbody></table>

Se nenhuma das opções `QUICK`, `MEDIUM` ou `EXTENDED` for especificada, o tipo de verificação padrão para tabelas de formato dinâmico `MyISAM` é `MEDIUM`. Isso tem o mesmo resultado que executar **myisamchk --medium-check *`tbl_name`*** na tabela. O tipo de verificação padrão também é `MEDIUM` para tabelas de formato estático `MyISAM`, a menos que `CHANGED` ou `FAST` seja especificado. Nesse caso, o padrão é `QUICK`. A varredura de string é ignorada para `CHANGED` e `FAST` porque as strings são raramente corrompidas.

Você pode combinar as opções de verificação, como no exemplo a seguir, que faz uma verificação rápida na tabela para determinar se ela foi fechada corretamente:

```sql
CHECK TABLE test_table FAST QUICK;
```

Nota

Se o `CHECK TABLE` não encontrar problemas com uma tabela marcada como “corrompida” ou “não fechada corretamente”, o `CHECK TABLE` pode remover a marca.

Se uma tabela estiver corrompida, o problema provavelmente está nos índices e não na parte de dados. Todos os tipos de verificação anteriores verificam os índices minuciosamente e, portanto, devem encontrar a maioria dos erros.

Para verificar uma tabela que você acredita estar correta, não use opções de verificação ou a opção `QUICK`. Esta última deve ser usada quando você está com pressa e pode arcar com o pequeno risco de que `QUICK` não encontre um erro no arquivo de dados. (Na maioria dos casos, em uso normal, o MySQL deve encontrar qualquer erro no arquivo de dados. Se isso acontecer, a tabela é marcada como “corrompida” e não pode ser usada até que seja reparada.)

`FAST` e `CHANGED` são, na maioria dos casos, destinados a serem usados a partir de um script (por exemplo, para ser executado a partir do **cron**) para verificar tabelas periodicamente. Na maioria dos casos, `FAST` deve ser preferido em detrimento de `CHANGED`. (O único caso em que não é preferido é quando você suspeita que encontrou um bug no código do `MyISAM`.)

`EXTENDED` deve ser usado apenas depois de ter realizado uma verificação normal, mas ainda obter erros de uma tabela quando o MySQL tenta atualizar uma string ou encontrar uma string por chave. Isso é muito improvável se uma verificação normal tiver sido bem-sucedida.

O uso de `CHECK TABLE ... EXTENDED` pode influenciar os planos de execução gerados pelo otimizador de consulta.

Alguns problemas relatados por `CHECK TABLE` não podem ser corrigidos automaticamente:

* `Found row where the auto_increment column has the value 0`.

Isso significa que você tem uma string na tabela onde a coluna de índice `AUTO_INCREMENT` contém o valor 0. (É possível criar uma string onde a coluna `AUTO_INCREMENT` é 0, definindo explicitamente a coluna para 0 com uma declaração `UPDATE`.

Isso não é um erro em si, mas pode causar problemas se você decidir descartar a tabela e restaurá-la ou realizar um `ALTER TABLE` na tabela. Neste caso, a coluna `AUTO_INCREMENT` muda o valor de acordo com as regras das colunas `AUTO_INCREMENT`, o que pode causar problemas como um erro de chave duplicada.

Para se livrar do aviso, execute uma declaração `UPDATE` para definir a coluna para algum valor diferente de 0.

##### CHECK TABLE Notas de uso para tabelas InnoDB

As seguintes notas se aplicam às tabelas `InnoDB`:

* Se o `CHECK TABLE` encontrar uma página corrupta, o servidor sai para evitar a propagação do erro (Bug #10132). Se a corrupção ocorrer em um índice secundário, mas os dados da tabela forem legíveis, a execução do `CHECK TABLE` ainda pode causar a saída do servidor.

* Se o `CHECK TABLE` encontrar um campo `DB_TRX_ID` ou `DB_ROLL_PTR` corrompido em um índice agrupado, o `CHECK TABLE` pode fazer com que o `InnoDB` acesse um registro inválido do registro de desfazer, resultando em uma saída do servidor relacionada ao MVCC.

* Se o `CHECK TABLE` encontrar erros nas tabelas ou índices do `InnoDB`, ele reporta um erro e, geralmente, marca o índice e, às vezes, a tabela como corrompida, impedindo o uso adicional do índice ou da tabela. Esses erros incluem um número incorreto de entradas em um índice secundário ou links incorretos.

* Se o `CHECK TABLE` encontrar um número incorreto de entradas em um índice secundário, ele reporta um erro, mas não causa a saída do servidor ou impede o acesso ao arquivo.

* `CHECK TABLE` examina a estrutura da página de índice, depois examina cada entrada chave. Não valida o ponteiro da chave para um registro agrupado ou não segue o caminho para os ponteiros de `BLOB`.

* Quando uma tabela `InnoDB` é armazenada em seu próprio arquivo `.ibd`, as primeiras 3 páginas do arquivo `.ibd` contêm informações de cabeçalho em vez de dados de tabela ou índice. A declaração `CHECK TABLE` não detecta inconsistências que afetam apenas os dados de cabeçalho. Para verificar todo o conteúdo de um arquivo `InnoDB` `.ibd`, use o comando **innochecksum**.

* Ao executar `CHECK TABLE` em grandes tabelas de `InnoDB`, outros threads podem ser bloqueados durante a execução de `CHECK TABLE`. Para evitar tempos de espera, o limiar de espera do semaforo (600 segundos) é estendido por 2 horas (7200 segundos) para operações de `CHECK TABLE`. Se `InnoDB` detectar espera de semaforo de 240 segundos ou mais, ele começa a imprimir a saída do monitor `InnoDB` no log de erro. Se um pedido de bloqueio exceder o limiar de espera do semaforo, `InnoDB` interrompe o processo. Para evitar a possibilidade de um tempo de espera de espera de semaforo completamente, execute `CHECK TABLE QUICK` em vez de `CHECK TABLE`.

* A funcionalidade `CHECK TABLE` para os índices `InnoDB` e `SPATIAL` inclui uma verificação de validade de árvore R e uma verificação para garantir que o número de strings da árvore R corresponda ao índice agrupado.

* `CHECK TABLE` suporta índices secundários em colunas geradas virtualmente, que são suportados por `InnoDB`.

##### CHECK TABLE Notas de uso para tabelas MyISAM

As seguintes notas se aplicam às tabelas `MyISAM`:

* `CHECK TABLE` atualiza as estatísticas-chave para as tabelas `MyISAM`.

* Se a saída de `CHECK TABLE` não retornar `OK` ou `Table is already up to date`, você normalmente deve executar uma reparação da tabela. Veja a Seção 7.6, “Manutenção e Recuperação de Quebra de Tabela MyISAM”.

* Se nenhuma das opções `CHECK TABLE` dos tipos de verificação `QUICK`, `MEDIUM` ou `EXTENDED` estiver especificada, o tipo de verificação padrão para as tabelas de formato dinâmico `MyISAM` é `MEDIUM`. Isso tem o mesmo resultado que executar **myisamchk --medium-check *`tbl_name`*** na tabela. O tipo de verificação padrão também é `MEDIUM` para as tabelas de formato estático `MyISAM`, a menos que `CHANGED` ou `FAST` esteja especificado. Nesse caso, o padrão é [[`QUICK`]. O varrimento de string é ignorado para `CHANGED` e `FAST` porque as strings são raramente corrompidas.

#### 13.7.2.3 Declaração da Tabela CHECKSUM

```sql
CHECKSUM TABLE tbl_name [, tbl_name] ... [QUICK | EXTENDED]
```

`CHECKSUM TABLE` relata um checksum para o conteúdo de uma tabela. Você pode usar essa declaração para verificar se o conteúdo é o mesmo antes e depois de um backup, rollback ou outra operação que tenha como objetivo colocar os dados de volta a um estado conhecido.

Essa declaração exige o privilégio `SELECT` para a tabela.

Esta declaração não é suportada para visualizações. Se você executar `CHECKSUM TABLE` contra uma visualização, o valor `Checksum` é sempre `NULL`, e um aviso é retornado.

Para uma tabela inexistente, `CHECKSUM TABLE` retorna `NULL` e gera um aviso.

Durante a operação de verificação de checksum, a tabela é bloqueada com um bloqueio de leitura para `InnoDB` e `MyISAM`.

##### Considerações de desempenho

Por padrão, toda a tabela é lida string por string e o checksum é calculado. Para tabelas grandes, isso pode levar muito tempo, portanto, você só realizará essa operação ocasionalmente. Esse cálculo de string por string é o que você obtém com a cláusula `EXTENDED`, com `InnoDB` e todos os outros motores de armazenamento, exceto `MyISAM`, e com as tabelas `MyISAM` que não foram criadas com a cláusula `CHECKSUM=1`.

Para as tabelas `MyISAM` criadas com a cláusula `CHECKSUM=1`, `CHECKSUM TABLE` ou `CHECKSUM TABLE ... QUICK`, o checksum da tabela “viva” que pode ser retornado muito rapidamente. Se a tabela não atender a todas essas condições, o método `QUICK` retorna `NULL`. O método `QUICK` não é suportado com tabelas `InnoDB`. Consulte a Seção 13.1.18, “Instrução CREATE TABLE”, para a sintaxe da cláusula `CHECKSUM`.

O valor do checksum depende do formato da string da tabela. Se o formato da string mudar, o checksum também mudará. Por exemplo, o formato de armazenamento para tipos temporais, como `TIME`, `DATETIME` e `TIMESTAMP`, mudou no MySQL 5.6 antes do MySQL 5.6.5, então, se uma tabela 5.5 for atualizada para o MySQL 5.6, o valor do checksum pode mudar.

Importante

Se os checksums de duas tabelas forem diferentes, é quase certo que as tabelas sejam diferentes de alguma forma. No entanto, como a função de hashing usada pelo `CHECKSUM TABLE` não é garantida para não ser livre de colisões, há uma pequena chance de que duas tabelas que não são idênticas possam produzir o mesmo checksum.

#### 13.7.2.4 Declaração de otimização de tabela

```sql
OPTIMIZE [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name [, tbl_name] ...
```

`OPTIMIZE TABLE` reorganiza o armazenamento físico dos dados da tabela e dos dados de índice associados, para reduzir o espaço de armazenamento e melhorar a eficiência de I/O ao acessar a tabela. As mudanças exatas feitas em cada tabela dependem do mecanismo de armazenamento utilizado por essa tabela.

Use `OPTIMIZE TABLE` nesses casos, dependendo do tipo de tabela:

* Após realizar operações de inserção, atualização ou exclusão substanciais em uma tabela `InnoDB` que possui seu próprio arquivo .ibd, pois foi criada com a opção `innodb_file_per_table` habilitada. A tabela e os índices são reorganizados e o espaço em disco pode ser recuperado para uso pelo sistema operacional.

* Após realizar operações de inserção, atualização ou exclusão substanciais em colunas que fazem parte de um índice `FULLTEXT` em uma tabela `InnoDB`. Defina a opção de configuração `innodb_optimize_fulltext_only=1` primeiro. Para manter o período de manutenção do índice em um tempo razoável, defina a opção `innodb_ft_num_word_optimize` para especificar quantas palavras devem ser atualizadas no índice de pesquisa e execute uma sequência de declarações `OPTIMIZE TABLE` até que o índice de pesquisa esteja totalmente atualizado.

* Após excluir uma grande parte de uma tabela `MyISAM` ou `ARCHIVE`, ou fazer muitas alterações em uma tabela `MyISAM` ou `ARCHIVE` com strings de comprimento variável (tabelas que possuem as colunas `VARCHAR`, `VARBINARY`, `BLOB` ou `TEXT`). As strings excluídas são mantidas em uma lista vinculada e as operações subsequentes de `INSERT` reutilizam as posições antigas das strings. Você pode usar `OPTIMIZE TABLE` para recuperar o espaço não utilizado e para desfragmentar o arquivo de dados. Após alterações extensas em uma tabela, essa declaração também pode melhorar o desempenho das declarações que usam a tabela, às vezes de forma significativa.

Essa declaração exige privilégios `SELECT` e `INSERT` para a tabela.

`OPTIMIZE TABLE` funciona para as tabelas `InnoDB`, `MyISAM` e `ARCHIVE`. `OPTIMIZE TABLE` também é suportado para colunas dinâmicas de tabelas `NDB` de memória. Não funciona para colunas de largura fixa de tabelas de memória, nem para tabelas de Dados em Disco. O desempenho de `OPTIMIZE` em tabelas NDB Cluster pode ser ajustado usando `--ndb-optimization-delay`, que controla o tempo de espera entre os lotes de processamento de strings por `OPTIMIZE TABLE`. Para mais informações, consulte Problemas anteriores do NDB Cluster resolvidos no NDB Cluster 8.0.

Para as tabelas do NDB Cluster, `OPTIMIZE TABLE` pode ser interrompido, por exemplo, ao matar o thread SQL que está executando a operação `OPTIMIZE`.

Por padrão, `OPTIMIZE TABLE` *não* funciona para tabelas criadas usando qualquer outro mecanismo de armazenamento e retorna um resultado indicando essa falta de suporte. Você pode fazer `OPTIMIZE TABLE` funcionar para outros mecanismos de armazenamento iniciando `mysqld` com a opção `--skip-new`. Neste caso, `OPTIMIZE TABLE` é apenas mapeado para `ALTER TABLE`.

Essa declaração não funciona com visualizações.

`OPTIMIZE TABLE` é suportado para tabelas particionadas. Para obter informações sobre o uso desta declaração com tabelas particionadas e particionamento de tabela, consulte a Seção 22.3.4, “Manutenção de Partições”.

Por padrão, o servidor escreve as declarações `OPTIMIZE TABLE` no log binário para que elas sejam replicadas para as réplicas. Para suprimir o registro, especifique a palavra-chave opcional `NO_WRITE_TO_BINLOG` ou seu alias `LOCAL`.

* Saída de Tabela OTIMIZADA
* Detalhes do InnoDB
* Detalhes do MyISAM
* Outras Considerações

##### OBTENGA O RESULTADO DA TABELA OTIMIZADA

`OPTIMIZE TABLE` retorna um conjunto de resultados com as colunas mostradas na tabela a seguir.

<table summary="Columns of the OPTIMIZE TABLE result set."><col style="width: 15%"/><col style="width: 60%"/><thead><tr> <th>Column</th> <th>Valor</th> </tr></thead><tbody><tr> <td><code>Table</code></td> <td>O nome da tabela</td> </tr><tr> <td><code>Op</code></td> <td>Sempre<code>optimize</code></td> </tr><tr> <td><code>Msg_type</code></td> <td><code>status</code>,<code>error</code>,<code>info</code>,<code>note</code>, ou<code>warning</code></td> </tr><tr> <td><code>Msg_text</code></td> <td>Uma mensagem informativa</td> </tr></tbody></table>

A tabela `OPTIMIZE TABLE` captura e lança quaisquer erros que ocorram durante a cópia das estatísticas da tabela do arquivo antigo para o arquivo recém-criado. Por exemplo, se o ID do usuário do proprietário do arquivo `.frm`, `.MYD` ou `.MYI` for diferente do ID do usuário do processo `mysqld`, a `OPTIMIZE TABLE` gera um erro de "não é possível alterar a propriedade do arquivo", a menos que a `mysqld` seja iniciada pelo usuário `root`.

##### Detalhes do InnoDB

Para as tabelas de `InnoDB`, `OPTIMIZE TABLE` é mapeado para `ALTER TABLE ... FORCE`, que reconstrui a tabela para atualizar estatísticas de índice e liberar espaço não utilizado no índice agrupado. Isso é exibido na saída de `OPTIMIZE TABLE` quando você executa-o em uma tabela de `InnoDB`, como mostrado aqui:

```sql
mysql> OPTIMIZE TABLE foo;
+----------+----------+----------+-------------------------------------------------------------------+
| Table    | Op       | Msg_type | Msg_text                                                          |
+----------+----------+----------+-------------------------------------------------------------------+
| test.foo | optimize | note     | Table does not support optimize, doing recreate + analyze instead |
| test.foo | optimize | status   | OK                                                                |
+----------+----------+----------+-------------------------------------------------------------------+
```

`OPTIMIZE TABLE` utiliza DDL online para tabelas regulares e particionadas `InnoDB`, o que reduz o tempo de inatividade para operações DML concorrentes. A reconstrução da tabela desencadeada por `OPTIMIZE TABLE` é concluída no local. Uma bloqueio exclusivo de tabela é tomado apenas brevemente durante a fase de preparação e a fase de compromisso da operação. Durante a fase de preparação, os metadados são atualizados e uma tabela intermediária é criada. Durante a fase de compromisso, as alterações dos metadados da tabela são comprometidas.

`OPTIMIZE TABLE` reconstrui a tabela usando o método de cópia de tabela nas seguintes condições:

* Quando a variável de sistema `old_alter_table` estiver habilitada.

* Quando o servidor é iniciado com a opção `--skip-new`.

`OPTIMIZE TABLE` usando DDL online não é suportado para tabelas `InnoDB` que contêm índices `FULLTEXT`. O método de cópia de tabela é usado em vez disso.

`InnoDB` armazena dados usando um método de alocação de página e não sofre fragmentação da mesma forma que os motores de armazenamento legados (como `MyISAM`) o fazem. Ao considerar se deve ou não executar `OPTIMIZE TABLE`, considere a carga de trabalho das transações que o seu servidor deve processar:

* É esperado algum nível de fragmentação. `InnoDB` preenche páginas apenas 93% cheias, para deixar espaço para atualizações sem precisar dividir as páginas.

As operações de exclusão podem deixar lacunas que deixam as páginas menos preenchidas do que o desejado, o que pode justificar a otimização da tabela.

* As atualizações das strings geralmente reescrevem os dados na mesma página, dependendo do tipo de dados e do formato da string, quando há espaço suficiente disponível. Veja a Seção 14.9.1.5, “Como a compressão funciona para tabelas InnoDB” e a Seção 14.11, “Formatos de string InnoDB”.

* Cargas de trabalho de alta concorrência podem deixar lacunas nos índices ao longo do tempo, pois o `InnoDB` retém várias versões dos mesmos dados devido ao seu mecanismo MVCC. Veja a Seção 14.3, “Multiversão InnoDB”.

##### Detalhes do MyISAM

Para as tabelas de `MyISAM`, `OPTIMIZE TABLE` funciona da seguinte forma:

1. Se a tabela tiver strings excluídas ou divididas, repare a tabela. 2. Se as páginas do índice não estiverem ordenadas, ordene-as. 3. Se as estatísticas da tabela não estiverem atualizadas (e a reparação não puder ser realizada por meio da ordenação do índice), atualize-as.

##### Outras considerações

`OPTIMIZE TABLE` é realizado online para tabelas regulares e particionadas `InnoDB`. Caso contrário, o MySQL bloqueia a tabela durante o tempo em que o `OPTIMIZE TABLE` está em execução.

`OPTIMIZE TABLE` não ordena índices de árvore R, como índices espaciais nas colunas de `POINT`. (Bug #23578)

#### 13.7.2.5 Declaração de REPARAR TÁBLIA

```sql
REPAIR [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name [, tbl_name] ...
    [QUICK] [EXTENDED] [USE_FRM]
```

`REPAIR TABLE` repara uma tabela possivelmente corrompida, apenas para determinados motores de armazenamento.

Essa declaração exige privilégios `SELECT` e `INSERT` para a tabela.

Embora normalmente você nunca deva ter que executar `REPAIR TABLE`, se um desastre ocorrer, essa declaração é muito provável que devolva todos os seus dados de uma tabela `MyISAM`. Se suas tabelas forem corrompidas com frequência, tente encontrar a razão para isso, para eliminar a necessidade de usar `REPAIR TABLE`. Veja a Seção B.3.3.3, “O que fazer se o MySQL continua a falhar”, e a Seção 15.2.4, “Problemas com a tabela MyISAM”.

`REPAIR TABLE` verifica a tabela para verificar se é necessário um upgrade. Se for o caso, ele realiza o upgrade, seguindo as mesmas regras que `CHECK TABLE ... FOR UPGRADE`. Consulte a Seção 13.7.2.2, “Declaração CHECK TABLE”, para obter mais informações.

Importante

* Faça um backup de uma tabela antes de realizar uma operação de reparo de tabela; em algumas circunstâncias, a operação pode causar perda de dados. As possíveis causas incluem, mas não estão limitadas a, erros no sistema de arquivos. Veja o Capítulo 7, *Backup e Recuperação*.

* Se o servidor sair durante uma operação `REPAIR TABLE`, é essencial, após o seu reinício, executar imediatamente outra declaração `REPAIR TABLE` para a tabela antes de realizar qualquer outra operação nela. No pior dos casos, você pode ter um novo arquivo de índice limpo sem informações sobre o arquivo de dados, e então a próxima operação que você realizar pode sobrescrever o arquivo de dados. Esse é um cenário improvável, mas possível, que destaca o valor de fazer um backup primeiro.

* Caso uma tabela na fonte seja corrompida e você execute `REPAIR TABLE` nela, quaisquer alterações resultantes na tabela original não serão propagadas às réplicas.

* Suporte ao motor de armazenamento e particionamento de Tabela de REPARO * Opções de REPARO DE TÁBUA * Saída de REPARO DE TÁBUA * Considerações sobre a reparação de tabela

##### Suporte ao motor de armazenamento e particionamento da tabela de reparo

`REPAIR TABLE` funciona para as tabelas `MyISAM`, `ARCHIVE` e `CSV`. Para as tabelas `MyISAM`, ele tem o mesmo efeito que **myisamchk --recover *`tbl_name`*** por padrão. Esta declaração não funciona com vistas.

`REPAIR TABLE` é suportado para tabelas particionadas. No entanto, a opção `USE_FRM` não pode ser usada com esta declaração em uma tabela particionada.

Você pode usar `ALTER TABLE ... REPAIR PARTITION` para reparar uma ou mais partições; para mais informações, consulte a Seção 13.1.8, “Instrução ALTER TABLE”, e a Seção 22.3.4, “Manutenção de Partições”.

##### Opções de REPARAR TÁBUA

* `NO_WRITE_TO_BINLOG` ou `LOCAL`

Por padrão, o servidor escreve as declarações `REPAIR TABLE` no log binário para que elas sejam replicadas para réplicas. Para suprimir o registro, especifique a palavra-chave opcional `NO_WRITE_TO_BINLOG` ou seu alias `LOCAL`.

* `QUICK`

Se você usar a opção `QUICK`, `REPAIR TABLE` tenta reparar apenas o arquivo de índice, e não o arquivo de dados. Esse tipo de reparo é semelhante ao realizado pelo **myisamchk --recover --quick**.

* `EXTENDED`

Se você usar a opção `EXTENDED`, o MySQL cria a string do índice string a string em vez de criar um índice de cada vez com classificação. Esse tipo de reparo é semelhante ao realizado pelo **myisamchk --safe-recover**.

* `USE_FRM`

A opção `USE_FRM` está disponível para uso se o arquivo de índice `.MYI` estiver ausente ou se seu cabeçalho estiver corrompido. Esta opção informa ao MySQL que não deve confiar nas informações no cabeçalho do arquivo `.MYI` e que deve recriá-lo usando informações do arquivo `.frm`. Esse tipo de reparo não pode ser feito com **myisamchk**.

Cuidado

Use a opção `USE_FRM` *apenas* se você não puder usar os modos regulares `REPAIR`. Informar ao servidor para ignorar o arquivo `.MYI` torna os metadados importantes da tabela armazenados no `.MYI` indisponíveis para o processo de reparo, o que pode ter consequências prejudiciais:

+ O valor atual de `AUTO_INCREMENT` é perdido.

+ O link para os registros excluídos na tabela é perdido, o que significa que o espaço livre para os registros excluídos permanece não ocupado posteriormente.

+ O cabeçalho `.MYI` indica se a tabela está comprimida. Se o servidor ignorar essa informação, não poderá determinar se uma tabela está comprimida e a reparação pode causar alterações ou perda dos conteúdos da tabela. Isso significa que `USE_FRM` não deve ser usado com tabelas comprimidas. Isso não deve ser necessário, de qualquer forma: as tabelas comprimidas são apenas de leitura, portanto, não devem ficar corrompidas.

Se você usar `USE_FRM` para uma tabela que foi criada por uma versão diferente do servidor MySQL do que a que você está executando atualmente, `REPAIR TABLE` não tenta reparar a tabela. Nesse caso, o conjunto de resultados retornado por `REPAIR TABLE` contém uma string com um valor de `Msg_type` de `error` e um valor de `Msg_text` de `Failed repairing incompatible .FRM file`.

Se o `USE_FRM` for usado, o `REPAIR TABLE` não verifica a tabela para verificar se é necessário um upgrade.

##### SAÍDA DE REPARAÇÃO DE TÁBUA

`REPAIR TABLE` retorna um conjunto de resultados com as colunas mostradas na tabela a seguir.

<table summary="Columns of the REPAIR TABLE result set."><col style="width: 15%"/><col style="width: 60%"/><thead><tr> <th>Column</th> <th>Valor</th> </tr></thead><tbody><tr> <td><code>Table</code></td> <td>O nome da tabela</td> </tr><tr> <td><code>Op</code></td> <td>Sempre<code>repair</code></td> </tr><tr> <td><code>Msg_type</code></td> <td><code>status</code>,<code>error</code>,<code>info</code>,<code>note</code>, ou<code>warning</code></td> </tr><tr> <td><code>Msg_text</code></td> <td>Uma mensagem informativa</td> </tr></tbody></table>

A declaração `REPAIR TABLE` pode gerar muitas strings de informações para cada tabela reparada. A última string tem um valor `Msg_type` de `status` e `Msg_test`, que normalmente deveria ser `OK`. Para uma tabela `MyISAM`, se você não obtiver `OK`, deve tentar repará-la com **myisamchk --safe-recover**. (`REPAIR TABLE` não implementa todas as opções do **myisamchk**. Com **myisamchk --safe-recover**, você também pode usar opções que `REPAIR TABLE` não suporta, como `--max-record-length`.)

A tabela `REPAIR TABLE` captura e lança quaisquer erros que ocorram durante a cópia das estatísticas da tabela do arquivo antigo corrompido para o arquivo recém-criado. Por exemplo, se o ID do usuário do proprietário do arquivo `.frm`, `.MYD` ou `.MYI` for diferente do ID do usuário do processo `mysqld`, a `REPAIR TABLE` gera um erro de "não é possível alterar a propriedade do arquivo" a menos que `mysqld` seja iniciado pelo usuário `root`.

##### Considerações sobre a reparação de tabelas

`REPAIR TABLE` atualiza uma tabela se ela contiver colunas temporais antigas no formato pré-5.6.4 (as colunas `TIME`, `DATETIME` e `TIMESTAMP` sem suporte para precisão de frações de segundo) e a variável de sistema `avoid_temporal_upgrade` está desativada. Se `avoid_temporal_upgrade` estiver ativado, `REPAIR TABLE` ignora as colunas temporais antigas presentes na tabela e não as atualiza.

Para atualizar tabelas que contêm colunas temporais, desative `avoid_temporal_upgrade` antes de executar `REPAIR TABLE`.

Você pode aumentar o desempenho do `REPAIR TABLE` definindo certas variáveis do sistema. Veja a Seção 8.6.3, “Otimizando as declarações de tabela REPAIR”.

### 13.7.3 Declarações de função plugin e carregável

#### 13.7.3.1 Declaração de função CREATE para funções carregáveis

```sql
CREATE [AGGREGATE] FUNCTION function_name
    RETURNS {STRING|INTEGER|REAL|DECIMAL}
    SONAME shared_library_name
```

Essa declaração carrega a função carregável denominada *`function_name`*. (`CREATE FUNCTION` também é usada para criar funções armazenadas; veja Seção 13.1.16, “Declarações CREATE PROCEDURE e CREATE FUNCTION”).

Uma função carregável é uma maneira de ampliar o MySQL com uma nova função que funciona como uma função nativa (incorporada) do MySQL, como `ABS()` ou `CONCAT()`. Veja Adicionando uma função carregável.

*`function_name`* é o nome que deve ser usado em declarações SQL para invocar a função. A cláusula `RETURNS` indica o tipo do valor de retorno da função. `DECIMAL` é um valor legal após `RETURNS`, mas atualmente as funções `DECIMAL` retornam valores de string e devem ser escritas como funções `STRING`.

A palavra-chave `AGGREGATE`, se fornecida, indica que a função é uma função agregada (grupo). Uma função agregada funciona exatamente como uma função agregada nativa do MySQL, como `SUM()` ou `COUNT()`.

*`shared_library_name`* é o nome base do arquivo da biblioteca compartilhada que contém o código que implementa a função. O arquivo deve estar localizado no diretório do plugin. Esse diretório é dado pelo valor da variável de sistema `plugin_dir`. Para mais informações, consulte a Seção 5.6.1, “Instalando e Desinstalando Funções Carregáveis”.

O `CREATE FUNCTION` requer o privilégio `INSERT` para o banco de dados do sistema `mysql`, pois adiciona uma string à tabela do sistema `mysql.func` para registrar a função.

Durante a sequência normal de inicialização, o servidor carrega as funções registradas na tabela `mysql.func`. Se o servidor for iniciado com a opção `--skip-grant-tables`, as funções registradas na tabela não são carregadas e ficam indisponíveis.

Nota

Para atualizar a biblioteca compartilhada associada a uma função carregável, emita uma declaração `DROP FUNCTION`, atualize a biblioteca compartilhada e, em seguida, emita uma declaração `CREATE FUNCTION`. Se você atualizar a biblioteca compartilhada primeiro e, em seguida, usar `DROP FUNCTION`, o servidor pode ser desligado inesperadamente.

#### 13.7.3.2 Declaração da função DROP para funções carregáveis

```sql
DROP FUNCTION [IF EXISTS] function_name
```

Essa declaração descarta a função carregável nomeada *`function_name`*. (`DROP FUNCTION` também é usada para descartar funções armazenadas; veja Seção 13.1.27, “Declarações DROP PROCEDURE e DROP FUNCTION”).

`DROP FUNCTION` é o complemento de `CREATE FUNCTION`. Ele requer o privilégio `DELETE` para o banco de dados do sistema `mysql`, pois ele remove a string da tabela do sistema `mysql.func` que registra a função.

Durante a sequência normal de inicialização, o servidor carrega as funções registradas na tabela `mysql.func`. Como o `DROP FUNCTION` remove a string `mysql.func` para a função removida, o servidor não carrega a função durante os reinícios subsequentes.

Nota

Para atualizar a biblioteca compartilhada associada a uma função carregável, emita uma declaração `DROP FUNCTION`, atualize a biblioteca compartilhada e, em seguida, emita uma declaração `CREATE FUNCTION`. Se você atualizar a biblioteca compartilhada primeiro e, em seguida, usar `DROP FUNCTION`, o servidor pode ser desligado inesperadamente.

#### 13.7.3.3 Declaração de INSTALAÇÃO do PLUGIN

```sql
INSTALL PLUGIN plugin_name SONAME 'shared_library_name'
```

Esta declaração instala um plugin do servidor. Ela requer o privilégio `INSERT` para a tabela do sistema `mysql.plugin`, porque adiciona uma string a essa tabela para registrar o plugin.

*`plugin_name`* é o nome do plugin conforme definido na estrutura do descritor do plugin contida no arquivo da biblioteca (veja Estruturas de dados do plugin). Os nomes dos plugins não são sensíveis ao caso. Para compatibilidade máxima, os nomes dos plugins devem ser limitados a letras ASCII, dígitos e sublinhados, pois são usados em arquivos de código-fonte C, strings de comando de shell, scripts de shell M4 e Bourne e ambientes SQL.

*`shared_library_name`* é o nome da biblioteca compartilhada que contém o código do plugin. O nome inclui a extensão do nome do arquivo (por exemplo, `libmyplugin.so`, `libmyplugin.dll` ou `libmyplugin.dylib`).

A biblioteca compartilhada deve estar localizada no diretório do plugin (o diretório nomeado pela variável de sistema `plugin_dir`). A biblioteca deve estar no próprio diretório do plugin, e não em um subdiretório. Por padrão, `plugin_dir` é o diretório `plugin` sob o diretório nomeado pela variável de configuração `pkglibdir`, mas ele pode ser alterado definindo o valor de `plugin_dir` na inicialização do servidor. Por exemplo, defina seu valor em um arquivo `my.cnf`:

```sql
[mysqld]
plugin_dir=/path/to/plugin/directory
```

Se o valor de `plugin_dir` for um nome de caminho relativo, ele é considerado relativo ao diretório de base do MySQL (o valor da variável de sistema `basedir`).

`INSTALL PLUGIN` carrega e inicializa o código do plugin para tornar o plugin disponível para uso. Um plugin é inicializado executando sua função de inicialização, que lida com qualquer configuração que o plugin deve realizar antes de ser usado. Quando o servidor é desligado, ele executa a função de desinicialização para cada plugin que está carregado, para que o plugin tenha a chance de realizar qualquer limpeza final.

`INSTALL PLUGIN` também registra o plugin, adicionando uma string que indica o nome do plugin e o nome do arquivo da biblioteca à tabela do sistema `mysql.plugin`. Durante a sequência normal de inicialização, o servidor carrega e inicializa os plugins registrados em `mysql.plugin`. Isso significa que um plugin é instalado com `INSTALL PLUGIN` apenas uma vez, não toda vez que o servidor é iniciado. Se o servidor for iniciado com a opção `--skip-grant-tables`, os plugins registrados na tabela `mysql.plugin` não são carregados e não estão disponíveis.

Uma biblioteca de plugins pode conter vários plugins. Para que cada um deles seja instalado, use uma declaração separada `INSTALL PLUGIN`. Cada declaração nomeia um plugin diferente, mas todos eles especificam o mesmo nome da biblioteca.

`INSTALL PLUGIN` faz com que o servidor leia os arquivos de opção (`my.cnf`) assim como durante a inicialização do servidor. Isso permite que o plugin identifique quaisquer opções relevantes desses arquivos. É possível adicionar opções de plugin a um arquivo de opção mesmo antes de carregar um plugin (se o prefixo `loose` for usado). Também é possível desinstalar um plugin, editar `my.cnf`, e instalar o plugin novamente. Reiniciar o plugin dessa maneira permite que ele receba os novos valores de opção sem uma reinicialização do servidor.

Para opções que controlam o carregamento de plugins individualmente na inicialização do servidor, consulte a Seção 5.5.1, “Instalando e Desinstalando Plugins”. Se você precisar carregar plugins para uma única inicialização do servidor quando a opção `--skip-grant-tables` for fornecida (que indica ao servidor que não leia as tabelas do sistema), use a opção `--plugin-load`. Consulte a Seção 5.1.6, “Opções de comando do servidor”.

Para remover um plugin, use a declaração `UNINSTALL PLUGIN`.

Para obter informações adicionais sobre o carregamento de plugins, consulte a Seção 5.5.1, “Instalando e Desinstalando Plugins”.

Para ver quais plugins estão instalados, use a declaração `SHOW PLUGINS` ou consulte a tabela `INFORMATION_SCHEMA` ou `PLUGINS`.

Se você recompilar uma biblioteca de plugins e precisar instalá-la novamente, você pode usar qualquer um dos seguintes métodos:

* Use `UNINSTALL PLUGIN` para desinstalar todos os plugins na biblioteca, instale o novo arquivo de biblioteca de plugins no diretório de plugins e, em seguida, use `INSTALL PLUGIN` para instalar todos os plugins na biblioteca. Esse procedimento tem a vantagem de poder ser usado sem parar o servidor. No entanto, se a biblioteca de plugins contiver muitos plugins, você deve emitir muitas declarações `INSTALL PLUGIN` e `UNINSTALL PLUGIN`.

* Parar o servidor, instalar o novo arquivo da biblioteca de plugins no diretório do plugin e reiniciar o servidor.

#### 13.7.3.4 Declaração de DESINSTALA PLUGIN

```sql
UNINSTALL PLUGIN plugin_name
```

Essa declaração remove um plugin de servidor instalado. `UNINSTALL PLUGIN` é o complemento de `INSTALL PLUGIN`. Requer o privilégio `DELETE` para a tabela do sistema `mysql.plugin`, porque remove a string daquela tabela que registra o plugin.

*`plugin_name`* deve ser o nome de algum plugin que está listado na tabela `mysql.plugin`. O servidor executa a função de desinicialização do plugin e remove a string do plugin da tabela do sistema `mysql.plugin`, para que os subsequentes reinícios do servidor não carreguem e inicializem o plugin. `UNINSTALL PLUGIN` não remove o arquivo de biblioteca compartilhada do plugin.

Você não pode desinstalar um plugin se qualquer tabela que o use estiver aberta.

A remoção de plugins tem implicações para o uso de tabelas associadas. Por exemplo, se um plugin de análise de texto completo estiver associado a um índice `FULLTEXT` na tabela, a desinstalação do plugin torna a tabela inutilizável. Qualquer tentativa de acessar a tabela resulta em um erro. A tabela não pode ser aberta, portanto, você não pode descartar um índice para o qual o plugin é usado. Isso significa que a desinstalação de um plugin é algo a ser feito com cuidado, a menos que você não se preocupe com o conteúdo da tabela. Se você está desinstalando um plugin sem a intenção de reinstalá-lo posteriormente e se preocupa com o conteúdo da tabela, você deve descartar a tabela com **mysqldump** e remover a cláusula `WITH PARSER` da declaração `CREATE TABLE` descartada para que você possa recarregar a tabela posteriormente. Se você não se preocupa com a tabela, `DROP TABLE` pode ser usado mesmo que quaisquer plugins associados à tabela estejam ausentes.

Para obter informações adicionais sobre o carregamento de plugins, consulte a Seção 5.5.1, “Instalando e Desinstalando Plugins”.

### 13.7.4 Declarações SET

A declaração `SET` tem várias formas. As descrições para as formas que não estão associadas a uma capacidade específica do servidor aparecem em subseções desta seção:

* `SET var_name = value` permite que você atribua valores a variáveis que afetam o funcionamento do servidor ou dos clientes. Veja a Seção 13.7.4.1, “Sintaxe SET para Atribuição de Variáveis”.

* `SET CHARACTER SET` e `SET NAMES` atribuem valores às variáveis de conjunto de caracteres e collation associadas à conexão atual com o servidor. Veja a Seção 13.7.4.2, “Declaração SET CHARACTER SET”, e a Seção 13.7.4.3, “Declaração SET NAMES”.

As descrições para as outras formas aparecem em outros lugares, agrupadas com outras declarações relacionadas à capacidade que elas ajudam a implementar:

* `SET PASSWORD` atribui senhas de conta. Veja a Seção 13.7.1.7, “Declaração SET PASSWORD”.

* `SET TRANSACTION ISOLATION LEVEL` define o nível de isolamento para o processamento de transações. Veja a Seção 13.3.6, “Instrução SET TRANSACTION”.

#### 13.7.4.1 Sintaxe de definição para atribuição de variáveis

```sql
SET variable = expr [, variable = expr] ...

variable: {
    user_var_name
  | param_name
  | local_var_name
  | {GLOBAL | @@GLOBAL.} system_var_name
  | [SESSION | @@SESSION. | @@] system_var_name
}
```

A sintaxe `SET` para atribuição de variáveis permite que você atribua valores a diferentes tipos de variáveis que afetam o funcionamento do servidor ou dos clientes:

* Variáveis definidas pelo usuário. Veja a Seção 9.4, “Variáveis Definidas pelo Usuário”.

* Parâmetros de procedimentos e funções armazenados, e variáveis locais de programas armazenados. Veja a Seção 13.6.4, “Variáveis em Programas Armazenados”.

* Variáveis do sistema. Veja a Seção 5.1.7, “Variáveis do sistema do servidor”. As variáveis do sistema também podem ser definidas na inicialização do servidor, conforme descrito na Seção 5.1.8, “Usando variáveis do sistema”.

Uma declaração `SET` que atribui valores variáveis não é escrita no log binário, portanto, em cenários de replicação, ela afeta apenas o host no qual você a executa. Para afetar todos os hosts de replicação, execute a declaração em cada host.

As seções a seguir descrevem a sintaxe de `SET` para definir variáveis. Elas utilizam o operador de atribuição `=`, mas o operador de atribuição `:=` também é permitido para esse propósito.

* Atribuição de variáveis definidas pelo usuário
* Atribuição de variáveis locais e parâmetros
* Atribuição de variáveis do sistema
* Gerenciamento de erros do SET
* Atribuição de múltiplas variáveis
* Referências de variáveis do sistema em expressões

##### Atribuição de variável definida pelo usuário

As variáveis definidas pelo usuário são criadas localmente dentro de uma sessão e existem apenas dentro do contexto dessa sessão; veja a Seção 9.4, “Variáveis Definidas pelo Usuário”.

Uma variável definida pelo usuário é escrita como `@var_name` e recebe um valor de expressão da seguinte forma:

```sql
SET @var_name = expr;
```

Exemplos:

```sql
SET @name = 43;
SET @total_tax = (SELECT SUM(tax) FROM taxable_transactions);
```

Como demonstrado por essas declarações, *`expr`* pode variar de simples (um valor literal) a mais complexo (o valor retornado por uma subconsulta escalar).

A tabela do Schema de Desempenho `user_variables_by_thread` contém informações sobre variáveis definidas pelo usuário. Veja a Seção 25.12.10, “Tabelas de Variáveis Definidas pelo Usuário do Schema de Desempenho”.

##### Atribuição de Parâmetros e Variáveis Locais

`SET` se aplica a parâmetros e variáveis locais no contexto do objeto armazenado no qual são definidos. O procedimento a seguir utiliza o parâmetro do procedimento `increment` e a variável local `counter`:

```sql
CREATE PROCEDURE p(increment INT)
BEGIN
  DECLARE counter INT DEFAULT 0;
  WHILE counter < 10 DO
    -- ... do work ...
    SET counter = counter + increment;
  END WHILE;
END;
```

##### Atribuição de variável de sistema

O servidor MySQL mantém variáveis de sistema que configuram sua operação. Uma variável de sistema pode ter um valor global que afeta a operação do servidor como um todo, um valor de sessão que afeta a sessão atual ou ambos. Muitas variáveis de sistema são dinâmicas e podem ser alteradas em tempo de execução usando a declaração `SET` para afetar a operação da instância atual do servidor. (Para tornar uma configuração de variável de sistema global permanente, de modo que ela se aplique em reinicializações do servidor, você também deve configurá-la em um arquivo de opções.)

Se você alterar uma variável do sistema de sessão, o valor permanecerá em vigor dentro da sua sessão até que você altere a variável para um valor diferente ou a sessão termine. A alteração não tem efeito em outras sessões.

Se você alterar uma variável do sistema global, o valor é lembrado e usado para inicializar o valor da sessão para novas sessões até que você altere a variável para um valor diferente ou o servidor saia. A mudança é visível para qualquer cliente que acesse o valor global. No entanto, a mudança afeta o valor correspondente da sessão apenas para clientes que se conectam após a mudança. A alteração da variável global não afeta o valor da sessão para nenhuma sessão de cliente atual (nem mesmo a sessão na qual a alteração do valor global ocorre).

Nota

Definir um valor de variável de sistema global sempre requer privilégios especiais. Definir um valor de variável de sistema de sessão normalmente não requer privilégios especiais e pode ser feito por qualquer usuário, embora haja exceções. Para mais informações, consulte a Seção 5.1.8.1, “Privilégios de variáveis de sistema”.

A discussão a seguir descreve as opções de sintaxe para definir variáveis do sistema:

* Para atribuir um valor a uma variável de sistema global, antecipe o nome da variável com a palavra-chave `GLOBAL` ou o qualificador `@@GLOBAL.`:

  ```sql
  SET GLOBAL max_connections = 1000;
  SET @@GLOBAL.max_connections = 1000;
  ```

* Para atribuir um valor a uma variável do sistema de sessão, antecipe o nome da variável com a palavra-chave `SESSION` ou `LOCAL`, com o qualificador `@@SESSION.`, `@@LOCAL.` ou `@@`, ou sem nenhuma palavra-chave ou modificador:

  ```sql
  SET SESSION sql_mode = 'TRADITIONAL';
  SET LOCAL sql_mode = 'TRADITIONAL';
  SET @@SESSION.sql_mode = 'TRADITIONAL';
  SET @@LOCAL.sql_mode = 'TRADITIONAL';
  SET @@sql_mode = 'TRADITIONAL';
  SET sql_mode = 'TRADITIONAL';
  ```

Um cliente pode alterar suas próprias variáveis de sessão, mas não as de outros clientes.

Para definir o valor de uma variável de sistema global para o valor padrão compilado do MySQL ou uma variável de sistema de sessão para o valor global correspondente atual, defina a variável para o valor `DEFAULT`. Por exemplo, as seguintes duas declarações são idênticas para definir o valor de sessão de `max_join_size` para o valor global atual:

```sql
SET @@SESSION.max_join_size = DEFAULT;
SET @@SESSION.max_join_size = @@GLOBAL.max_join_size;
```

Para exibir os nomes e valores das variáveis do sistema:

* Utilize a declaração `SHOW VARIABLES`; veja a Seção 13.7.5.39, “Declaração SHOW VARIABLES”.

* Várias tabelas do Schema de Desempenho fornecem informações sobre variáveis do sistema. Veja a Seção 25.12.13, “Tabelas de Variáveis do Sistema do Schema de Desempenho”.

##### Gerenciamento de Erros SET

Se qualquer atribuição de variável em uma declaração `SET` falhar, toda a declaração falha e nenhuma variável é alterada.

`SET` produz um erro nas circunstâncias descritas aqui. A maioria dos exemplos mostra declarações `SET` que usam sintaxe de palavras-chave (por exemplo, `GLOBAL` ou `SESSION`, mas os princípios também são verdadeiros para declarações que usam os modificadores correspondentes (por exemplo, `@@GLOBAL.` ou `@@SESSION.`).

* Uso de `SET` (qualquer variante) para definir uma variável somente leitura:

  ```sql
  mysql> SET GLOBAL version = 'abc';
  ERROR 1238 (HY000): Variable 'version' is a read only variable
  ```

* Uso de `GLOBAL` para definir uma variável que tenha apenas um valor de sessão:

  ```sql
  mysql> SET GLOBAL sql_log_bin = ON;
  ERROR 1231 (42000): Variable 'sql_log_bin' can't be
  set to the value of 'ON'
  ```

* Uso de `SESSION` para definir uma variável que tenha apenas um valor global:

  ```sql
  mysql> SET SESSION max_connections = 1000;
  ERROR 1229 (HY000): Variable 'max_connections' is a
  GLOBAL variable and should be set with SET GLOBAL
  ```

* Omissão de `GLOBAL` para definir uma variável que possui apenas um valor global:

  ```sql
  mysql> SET max_connections = 1000;
  ERROR 1229 (HY000): Variable 'max_connections' is a
  GLOBAL variable and should be set with SET GLOBAL
  ```

Os modificadores `@@GLOBAL.`, `@@SESSION.` e `@@` aplicam-se apenas a variáveis de sistema. Um erro ocorre para tentativas de aplicá-los a variáveis definidas pelo usuário, parâmetros de procedimentos ou funções armazenadas, ou variáveis locais de programas armazenados.

* Nem todas as variáveis do sistema podem ser definidas como `DEFAULT`. Nesses casos, atribuir `DEFAULT` resulta em um erro.

* Um erro ocorre para tentativas de atribuir `DEFAULT` a variáveis definidas pelo usuário, parâmetros de procedimento armazenado ou função, ou variáveis locais de programa armazenado.

##### Atribuição de variáveis múltiplas

Uma declaração `SET` pode conter múltiplas atribuições de variáveis, separadas por vírgulas. Esta declaração atribui um valor a uma variável definida pelo usuário e a uma variável do sistema:

```sql
SET @x = 1, SESSION sql_mode = '';
```

Se você definir várias variáveis de sistema em uma única declaração, a palavra-chave mais recente `GLOBAL` ou `SESSION` na declaração é usada para atribuições subsequentes que não possuem palavra-chave especificada.

Exemplos de atribuição de variáveis múltiplas:

```sql
SET GLOBAL sort_buffer_size = 1000000, SESSION sort_buffer_size = 1000000;
SET @@GLOBAL.sort_buffer_size = 1000000, @@LOCAL.sort_buffer_size = 1000000;
SET GLOBAL max_connections = 1000, sort_buffer_size = 1000000;
```

Os modificadores `@@GLOBAL.`, `@@SESSION.` e `@@` aplicam-se apenas à variável de sistema imediatamente seguinte, e não a quaisquer variáveis de sistema restantes. Esta declaração define o valor global `sort_buffer_size` para 50000 e o valor da sessão para 1.000.000:

```sql
SET @@GLOBAL.sort_buffer_size = 50000, sort_buffer_size = 1000000;
```

##### Referências de variáveis do sistema em expressões

Para se referir ao valor de uma variável de sistema em expressões, use um dos modificadores `@@`. Por exemplo, você pode recuperar os valores das variáveis de sistema em uma declaração `SELECT` assim:

```sql
SELECT @@GLOBAL.sql_mode, @@SESSION.sql_mode, @@sql_mode;
```

Nota

Uma referência a uma variável de sistema em uma expressão como `@@var_name` (com `@@` em vez de `@@GLOBAL.` ou `@@SESSION.`) retorna o valor da sessão se existir e o valor global caso contrário. Isso difere de `SET @@var_name = expr`, que sempre se refere ao valor da sessão.

#### 13.7.4.2 Declaração de conjunto de caracteres de caractere

```sql
SET {CHARACTER SET | CHARSET}
    {'charset_name' | DEFAULT}
```

Essa declaração mapeia todas as cadeias de caracteres enviadas entre o servidor e o cliente atual com o mapeamento especificado. `SET CHARACTER SET` define três variáveis do sistema de sessão: `character_set_client` e `character_set_results` são definidos para o conjunto de caracteres especificado, e `character_set_connection` para o valor de `character_set_database`. Veja a Seção 10.4, “Conjunto de caracteres e codificações de conexão”.

*`charset_name`* pode ser citado ou não citado.

O mapeamento do conjunto de caracteres padrão pode ser restaurado usando o valor [[`DEFAULT`]. O padrão depende da configuração do servidor.

Alguns conjuntos de caracteres não podem ser usados como conjunto de caracteres do cliente. Tentar usá-los com `SET CHARACTER SET` produz um erro. Veja Conjuntos de caracteres do cliente impermissíveis.

#### 13.7.4.3 Declaração de NOME DE SET

```sql
SET NAMES {'charset_name'
    [COLLATE 'collation_name'] | DEFAULT}
```

Essa declaração define as variáveis do sistema de sessão `character_set_client`, `character_set_connection` e `character_set_results` para o conjunto de caracteres especificado. Definindo `character_set_connection` para `charset_name`, também define `collation_connection` para a collation padrão para `charset_name`. Ver Seção 10.4, “Conjunto de caracteres e collation de conexão”.

A cláusula opcional `COLLATE` pode ser usada para especificar uma collation explicitamente. Se fornecida, a collation deve ser uma das collation permitidas para *`charset_name`*.

*`charset_name`* e *`collation_name`* podem ser citados ou não citados.

O mapeamento padrão pode ser restaurado usando um valor de `DEFAULT`. O padrão depende da configuração do servidor.

Alguns conjuntos de caracteres não podem ser usados como conjunto de caracteres do cliente. Tentar usá-los com `SET NAMES` produz um erro. Veja Conjuntos de caracteres do cliente impermissíveis.

### 13.7.5 Declarações SHOW

`SHOW` tem muitas formas que fornecem informações sobre bancos de dados, tabelas, colunas ou informações de status sobre o servidor. Esta seção descreve as seguintes:

```sql
SHOW {BINARY | MASTER} LOGS
SHOW BINLOG EVENTS [IN 'log_name'] [FROM pos] [LIMIT [offset,] row_count]
SHOW {CHARACTER SET | CHARSET} [like_or_where]
SHOW COLLATION [like_or_where]
SHOW [FULL] COLUMNS FROM tbl_name [FROM db_name] [like_or_where]
SHOW CREATE DATABASE db_name
SHOW CREATE EVENT event_name
SHOW CREATE FUNCTION func_name
SHOW CREATE PROCEDURE proc_name
SHOW CREATE TABLE tbl_name
SHOW CREATE TRIGGER trigger_name
SHOW CREATE VIEW view_name
SHOW DATABASES [like_or_where]
SHOW ENGINE engine_name {STATUS | MUTEX}
SHOW [STORAGE] ENGINES
SHOW ERRORS [LIMIT [offset,] row_count]
SHOW EVENTS
SHOW FUNCTION CODE func_name
SHOW FUNCTION STATUS [like_or_where]
SHOW GRANTS FOR user
SHOW INDEX FROM tbl_name [FROM db_name]
SHOW MASTER STATUS
SHOW OPEN TABLES [FROM db_name] [like_or_where]
SHOW PLUGINS
SHOW PROCEDURE CODE proc_name
SHOW PROCEDURE STATUS [like_or_where]
SHOW PRIVILEGES
SHOW [FULL] PROCESSLIST
SHOW PROFILE [types] [FOR QUERY n] [OFFSET n] [LIMIT n]
SHOW PROFILES
SHOW RELAYLOG EVENTS [IN 'log_name'] [FROM pos] [LIMIT [offset,] row_count]
SHOW SLAVE HOSTS
SHOW SLAVE STATUS [FOR CHANNEL channel]
SHOW [GLOBAL | SESSION] STATUS [like_or_where]
SHOW TABLE STATUS [FROM db_name] [like_or_where]
SHOW [FULL] TABLES [FROM db_name] [like_or_where]
SHOW TRIGGERS [FROM db_name] [like_or_where]
SHOW [GLOBAL | SESSION] VARIABLES [like_or_where]
SHOW WARNINGS [LIMIT [offset,] row_count]

like_or_where: {
    LIKE 'pattern'
  | WHERE expr
}
```

Se a sintaxe de uma declaração `SHOW` dada incluir uma parte `LIKE 'pattern'`, `'pattern'` é uma string que pode conter os caracteres de comodinho de SQL `%` e `_`. O padrão é útil para restringir a saída da declaração para valores que correspondem.

Várias declarações `SHOW` também aceitam uma cláusula `WHERE` que oferece mais flexibilidade na especificação de quais strings devem ser exibidas. Veja a Seção 24.8, “Extensões para Declarações SHOW”.

Muitas APIs do MySQL (como o PHP) permitem que você trate o resultado retornado de uma declaração `SHOW` como se fosse um conjunto de resultados de uma declaração `SELECT`; veja o Capítulo 27, *Conectores e APIs*, ou a documentação da sua API para mais informações. Além disso, você pode trabalhar em SQL com resultados de consultas em tabelas no banco de dados `INFORMATION_SCHEMA`, o que não é fácil de fazer com resultados de declarações `SHOW`. Veja o Capítulo 24, *Tabelas do INFORMATION\_SCHEMA*.

#### 13.7.5.1 Declaração de LOGOS BINÁRIO DE EXIBIÇÃO

```sql
SHOW BINARY LOGS
SHOW MASTER LOGS
```

Lista os arquivos de registro binários no servidor. Esta declaração é usada como parte do procedimento descrito na Seção 13.4.1.1, "Declaração PURGE BINARY LOGS", que mostra como determinar quais logs podem ser apagados. Um usuário com o privilégio `SUPER` ou `REPLICATION CLIENT` pode executar esta declaração.

```sql
mysql> SHOW BINARY LOGS;
+---------------+-----------+
| Log_name      | File_size |
+---------------+-----------+
| binlog.000015 |    724935 |
| binlog.000016 |    733481 |
+---------------+-----------+
```

`SHOW MASTER LOGS` é equivalente a `SHOW BINARY LOGS`.

#### 13.7.5.2 Declaração de eventos SHOW BINLOG

```sql
SHOW BINLOG EVENTS
   [IN 'log_name']
   [FROM pos]
   [LIMIT [offset,] row_count]
```

Mostra os eventos no log binário. Se você não especificar `'log_name'`, o primeiro log binário é exibido. `SHOW BINLOG EVENTS` requer o privilégio `REPLICATION SLAVE`.

A cláusula `LIMIT` tem a mesma sintaxe que a da declaração [[`SELECT`]. Consulte a Seção 13.2.9, “Declaração SELECT”.

Nota

Emitir um `SHOW BINLOG EVENTS` sem a cláusula `LIMIT` pode iniciar um processo que consome muito tempo e recursos, pois o servidor retorna ao cliente o conteúdo completo do log binário (que inclui todas as declarações executadas pelo servidor que modificam dados). Como alternativa ao `SHOW BINLOG EVENTS`, use o utilitário **mysqlbinlog** para salvar o log binário em um arquivo de texto para exame e análise posteriores. Veja a Seção 4.6.7, “mysqlbinlog — Utilitário para Processamento de Arquivos de Log Binário”.

`SHOW BINLOG EVENTS` exibe os seguintes campos para cada evento no log binário:

* `Log_name`

O nome do arquivo que está sendo listado.

* `Pos`

A posição em que o evento ocorre.

* `Event_type`

Um identificador que descreve o tipo de evento.

* `Server_id`

O ID do servidor do servidor em que o evento se originou.

* `End_log_pos`

A posição na qual o próximo evento começa, que é igual a `Pos` mais o tamanho do evento.

* `Info`

Mais informações detalhadas sobre o tipo de evento. O formato dessas informações depende do tipo de evento.

Nota

Alguns eventos relacionados ao estabelecimento de variáveis de usuário e sistema não estão incluídos na saída do `SHOW BINLOG EVENTS`. Para obter uma cobertura completa dos eventos dentro de um log binário, use **mysqlbinlog**.

Nota

`SHOW BINLOG EVENTS` *não* funciona com arquivos de registro de relé. Você pode usar `SHOW RELAYLOG EVENTS` para esse propósito.

#### 13.7.5.3 Declaração de conjunto de caracteres #### 13.7.5.3 Declaração de conjunto de caracteres

```sql
SHOW {CHARACTER SET | CHARSET}
    [LIKE 'pattern' | WHERE expr]
```

A declaração `SHOW CHARACTER SET` mostra todos os conjuntos de caracteres disponíveis. A cláusula `LIKE`, se presente, indica quais nomes de conjuntos de caracteres devem ser correspondidos. A cláusula `WHERE` pode ser usada para selecionar strings com condições mais gerais, conforme discutido na Seção 24.8, “Extensões para Declarações SHOW”. Por exemplo:

```sql
mysql> SHOW CHARACTER SET LIKE 'latin%';
+---------+-----------------------------+-------------------+--------+
| Charset | Description                 | Default collation | Maxlen |
+---------+-----------------------------+-------------------+--------+
| latin1  | cp1252 West European        | latin1_swedish_ci |      1 |
| latin2  | ISO 8859-2 Central European | latin2_general_ci |      1 |
| latin5  | ISO 8859-9 Turkish          | latin5_turkish_ci |      1 |
| latin7  | ISO 8859-13 Baltic          | latin7_general_ci |      1 |
+---------+-----------------------------+-------------------+--------+
```

A saída `SHOW CHARACTER SET` tem essas colunas:

* `Charset`

O nome do conjunto de caracteres.

* `Description`

Uma descrição do conjunto de caracteres.

* `Default collation`

A agregação padrão para o conjunto de caracteres.

* `Maxlen`

O número máximo de bytes necessários para armazenar um caractere.

O conjunto de caracteres `filename` é para uso interno apenas; consequentemente, `SHOW CHARACTER SET` não o exibe.

As informações sobre o conjunto de caracteres também estão disponíveis na tabela `INFORMATION_SCHEMA` `CHARACTER_SETS`.

#### 13.7.5.4 Declaração de Colagem SHOW

```sql
SHOW COLLATION
    [LIKE 'pattern' | WHERE expr]
```

Esta declaração lista as colatações suportadas pelo servidor. Por padrão, a saída do `SHOW COLLATION` inclui todas as colatações disponíveis. A cláusula `LIKE`, se presente, indica quais nomes de colatação devem ser correspondidos. A cláusula `WHERE` pode ser dada para selecionar strings usando condições mais gerais, conforme discutido na Seção 24.8, “Extensões para Declarações SHOW”. Por exemplo:

```sql
mysql> SHOW COLLATION WHERE Charset = 'latin1';
+-------------------+---------+----+---------+----------+---------+
| Collation         | Charset | Id | Default | Compiled | Sortlen |
+-------------------+---------+----+---------+----------+---------+
| latin1_german1_ci | latin1  |  5 |         | Yes      |       1 |
| latin1_swedish_ci | latin1  |  8 | Yes     | Yes      |       1 |
| latin1_danish_ci  | latin1  | 15 |         | Yes      |       1 |
| latin1_german2_ci | latin1  | 31 |         | Yes      |       2 |
| latin1_bin        | latin1  | 47 |         | Yes      |       1 |
| latin1_general_ci | latin1  | 48 |         | Yes      |       1 |
| latin1_general_cs | latin1  | 49 |         | Yes      |       1 |
| latin1_spanish_ci | latin1  | 94 |         | Yes      |       1 |
+-------------------+---------+----+---------+----------+---------+
```

A saída `SHOW COLLATION` tem essas colunas:

* `Collation`

O nome da agregação.

* `Charset`

O nome do conjunto de caracteres com o qual a correção está associada.

* `Id`

O ID de agregação.

* `Default`

Se a ordenação é a padrão para seu conjunto de caracteres.

* `Compiled`

Se o conjunto de caracteres é compilado no servidor.

* `Sortlen`

Isso está relacionado à quantidade de memória necessária para ordenar strings expressas no conjunto de caracteres.

Para ver a collation padrão para cada conjunto de caracteres, use a seguinte declaração. `Default` é uma palavra reservada, portanto, para usá-la como um identificador, ela deve ser citada como tal:

```sql
mysql> SHOW COLLATION WHERE `Default` = 'Yes';
+---------------------+----------+----+---------+----------+---------+
| Collation           | Charset  | Id | Default | Compiled | Sortlen |
+---------------------+----------+----+---------+----------+---------+
| big5_chinese_ci     | big5     |  1 | Yes     | Yes      |       1 |
| dec8_swedish_ci     | dec8     |  3 | Yes     | Yes      |       1 |
| cp850_general_ci    | cp850    |  4 | Yes     | Yes      |       1 |
| hp8_english_ci      | hp8      |  6 | Yes     | Yes      |       1 |
| koi8r_general_ci    | koi8r    |  7 | Yes     | Yes      |       1 |
| latin1_swedish_ci   | latin1   |  8 | Yes     | Yes      |       1 |
...
```

Informações sobre coligação também estão disponíveis na tabela `INFORMATION_SCHEMA` `COLLATIONS`. Veja a Seção 24.3.3, “A tabela INFORMATION_SCHEMA COLLATIONS”.

#### 13.7.5.5 Declaração de COLUMNS

```sql
SHOW [FULL] {COLUMNS | FIELDS}
    {FROM | IN} tbl_name
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

`SHOW COLUMNS` exibe informações sobre as colunas de uma tabela específica. Também funciona para visualizações. `SHOW COLUMNS` exibe informações apenas para as colunas para as quais você tem algum privilégio.

```sql
mysql> SHOW COLUMNS FROM City;
+-------------+----------+------+-----+---------+----------------+
| Field       | Type     | Null | Key | Default | Extra          |
+-------------+----------+------+-----+---------+----------------+
| ID          | int(11)  | NO   | PRI | NULL    | auto_increment |
| Name        | char(35) | NO   |     |         |                |
| CountryCode | char(3)  | NO   | MUL |         |                |
| District    | char(20) | NO   |     |         |                |
| Population  | int(11)  | NO   |     | 0       |                |
+-------------+----------+------+-----+---------+----------------+
```

Uma alternativa à sintaxe de `tbl_name FROM db_name` é *`db_name.tbl_name`*. Essas duas declarações são equivalentes:

```sql
SHOW COLUMNS FROM mytable FROM mydb;
SHOW COLUMNS FROM mydb.mytable;
```

A palavra-chave opcional `FULL` faz com que a saída inclua a correção de coluna e comentários, bem como os privilégios que você tem para cada coluna.

A cláusula `LIKE`, se presente, indica quais nomes de colunas devem ser correspondidos. A cláusula `WHERE` pode ser usada para selecionar strings com condições mais gerais, conforme discutido na Seção 24.8, “Extensões para Declarações SHOW”.

Os tipos de dados podem diferir do que você espera, com base em uma declaração `CREATE TABLE`, porque o MySQL às vezes altera os tipos de dados quando você cria ou altera uma tabela. As condições sob as quais isso ocorre são descritas na Seção 13.1.18.6, “Alterações Silenciosas de Especificação de Coluna”.

`SHOW COLUMNS` exibe os seguintes valores para cada coluna da tabela:

* `Field`

O nome da coluna.

* `Type`

O tipo de dados da coluna.

* `Collation`

A agregação para colunas de texto não binárias, ou `NULL` para outras colunas. Esse valor é exibido apenas se você usar a palavra-chave `FULL`.

* `Null`

A coluna nulidade. O valor é `YES` se os valores de `NULL` puderem ser armazenados na coluna, `NO` se não puderem.

* `Key`

Se a coluna está indexada:

+ Se `Key` estiver vazio, a coluna não está indexada ou está indexada apenas como uma coluna secundária em um índice de múltiplas colunas, não exclusivo.

+ Se `Key` é `PRI`, a coluna é uma `PRIMARY KEY` ou é uma das colunas de uma `PRIMARY KEY` de múltiplas colunas.

+ Se `Key` é `UNI`, a coluna é a primeira coluna de um índice `UNIQUE`. (Um índice `UNIQUE` permite múltiplos valores de `NULL`, mas você pode determinar se a coluna permite `NULL` verificando o campo `Null`.

+ Se `Key` é `MUL`, a coluna é a primeira coluna de um índice não único em que múltiplas ocorrências de um valor dado são permitidas na coluna.

Se mais de um dos valores de `Key` se aplica a uma coluna específica de uma tabela, `Key` exibe o valor com a maior prioridade, na ordem `PRI`, `UNI`, `MUL`.

Um índice `UNIQUE` pode ser exibido como `PRI` se ele não puder conter valores `NULL` e não houver `PRIMARY KEY` na tabela. Um índice `UNIQUE` pode ser exibido como `MUL` se várias colunas formarem um índice composto `UNIQUE`; embora a combinação das colunas seja única, cada coluna ainda pode conter múltiplas ocorrências de um valor dado.

* `Default`

O valor padrão da coluna. Este é `NULL` se a coluna tiver um padrão explícito de `NULL`, ou se a definição da coluna não incluir nenhuma cláusula de `DEFAULT`.

* `Extra`

Qualquer informação adicional disponível sobre uma coluna específica. O valor não está vazio nestes casos:

+ `auto_increment` para colunas que possuem o atributo `AUTO_INCREMENT`.

+ `on update CURRENT_TIMESTAMP` para as colunas `TIMESTAMP` ou `DATETIME` que possuem o atributo `ON UPDATE CURRENT_TIMESTAMP`.

+ `VIRTUAL GENERATED` ou `STORED GENERATED` para colunas geradas.

* `Privileges`

Os privilégios que você tem para a coluna. Esse valor é exibido apenas se você usar a palavra-chave `FULL`.

* `Comment`

Qualquer comentário incluído na definição da coluna. Esse valor é exibido apenas se você usar a palavra-chave `FULL`.

As informações das colunas da tabela também estão disponíveis na tabela `INFORMATION_SCHEMA` `COLUMNS`. Veja a Seção 24.3.5, “A tabela INFORMATION_SCHEMA COLUMNS”.

Você pode listar as colunas de uma tabela com o comando **mysqlshow *`db_name`* *`tbl_name`***.

A declaração `DESCRIBE` fornece informações semelhantes às da declaração `SHOW COLUMNS`. Veja a Seção 13.8.1, “Declaração DESCRIBE”.

As declarações `SHOW CREATE TABLE`, `SHOW TABLE STATUS` e `SHOW INDEX` também fornecem informações sobre tabelas. Veja a Seção 13.7.5, “Declarações SHOW”.

#### 13.7.5.6 Declaração SHOW CREATE DATABASE

```sql
SHOW CREATE {DATABASE | SCHEMA} [IF NOT EXISTS] db_name
```

Mostra a declaração `CREATE DATABASE` que cria o banco de dados nomeado. Se a declaração `SHOW` incluir uma cláusula `IF NOT EXISTS`, a saída também inclui tal cláusula. `SHOW CREATE SCHEMA` é sinônimo de `SHOW CREATE DATABASE`.

```sql
mysql> SHOW CREATE DATABASE test\G
*************************** 1. row ***************************
       Database: test
Create Database: CREATE DATABASE `test`
                 /*!40100 DEFAULT CHARACTER SET latin1 */

mysql> SHOW CREATE SCHEMA test\G
*************************** 1. row ***************************
       Database: test
Create Database: CREATE DATABASE `test`
                 /*!40100 DEFAULT CHARACTER SET latin1 */
```

A tabela e os nomes das colunas de `SHOW CREATE DATABASE` são citados de acordo com o valor da opção `sql_quote_show_create`. Veja a Seção 5.1.7, “Variáveis do Sistema do Servidor”.

#### 13.7.5.7 Declaração SHOW CREATE EVENT

```sql
SHOW CREATE EVENT event_name
```

Essa declaração exibe a declaração `CREATE EVENT` necessária para recriar um evento específico. Ela exige o privilégio `EVENT` para o banco de dados a partir do qual o evento deve ser exibido. Por exemplo (usando o mesmo evento `e_daily` definido e alterado na Seção 13.7.5.18, “Declaração de MOSTRA DE EVENTOS”):

```sql
mysql> SHOW CREATE EVENT myschema.e_daily\G
*************************** 1. row ***************************
               Event: e_daily
            sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                      NO_ZERO_IN_DATE,NO_ZERO_DATE,
                      ERROR_FOR_DIVISION_BY_ZERO,
                      NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
           time_zone: SYSTEM
        Create Event: CREATE DEFINER=`jon`@`ghidora` EVENT `e_daily`
                        ON SCHEDULE EVERY 1 DAY
                        STARTS CURRENT_TIMESTAMP + INTERVAL 6 HOUR
                        ON COMPLETION NOT PRESERVE
                        ENABLE
                        COMMENT 'Saves total number of sessions then
                                clears the table each day'
                        DO BEGIN
                          INSERT INTO site_activity.totals (time, total)
                            SELECT CURRENT_TIMESTAMP, COUNT(*)
                              FROM site_activity.sessions;
                          DELETE FROM site_activity.sessions;
                        END
character_set_client: utf8
collation_connection: utf8_general_ci
  Database Collation: latin1_swedish_ci
```

`character_set_client` é o valor da sessão da variável de sistema `character_set_client` quando o evento foi criado. `collation_connection` é o valor da sessão da variável de sistema `collation_connection` quando o evento foi criado. `Database Collation` é a collation do banco de dados com o qual o evento está associado.

A saída reflete o status atual do evento (`ENABLE`) e não o status com o qual foi criado.

#### 13.7.5.8 Declaração SHOW CREATE FUNCTION

```sql
SHOW CREATE FUNCTION func_name
```

Esta declaração é semelhante a `SHOW CREATE PROCEDURE`, mas para funções armazenadas. Veja a Seção 13.7.5.9, “Declaração SHOW CREATE PROCEDURE”.

#### 13.7.5.9 Declaração SHOW CREATE PROCEDURE

```sql
SHOW CREATE PROCEDURE proc_name
```

Essa declaração é uma extensão do MySQL. Ela retorna a string exata que pode ser usada para recriar o procedimento armazenado nomeado. Uma declaração semelhante, `SHOW CREATE FUNCTION`, exibe informações sobre funções armazenadas (consulte Seção 13.7.5.8, “Declaração SHOW CREATE FUNCTION”).

Para usar qualquer uma dessas declarações, você deve ser o usuário nomeado na cláusula da rotina `DEFINER` ou ter acesso ao `mysql.proc` da tabela `SELECT`. Se você não tiver privilégios para a própria rotina, o valor exibido para a coluna `Create Procedure` ou `Create Function` é `NULL`.

```sql
mysql> SHOW CREATE PROCEDURE test.citycount\G
*************************** 1. row ***************************
           Procedure: citycount
            sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                      NO_ZERO_IN_DATE,NO_ZERO_DATE,
                      ERROR_FOR_DIVISION_BY_ZERO,
                      NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
    Create Procedure: CREATE DEFINER=`me`@`localhost`
                      PROCEDURE `citycount`(IN country CHAR(3), OUT cities INT)
                      BEGIN
                        SELECT COUNT(*) INTO cities FROM world.city
                        WHERE CountryCode = country;
                      END
character_set_client: utf8
collation_connection: utf8_general_ci
  Database Collation: latin1_swedish_ci

mysql> SHOW CREATE FUNCTION test.hello\G
*************************** 1. row ***************************
            Function: hello
            sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                      NO_ZERO_IN_DATE,NO_ZERO_DATE,
                      ERROR_FOR_DIVISION_BY_ZERO,
                      NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
     Create Function: CREATE DEFINER=`me`@`localhost`
                      FUNCTION `hello`(s CHAR(20))
                      RETURNS char(50) CHARSET latin1
                      DETERMINISTIC
                      RETURN CONCAT('Hello, ',s,'!')
character_set_client: utf8
collation_connection: utf8_general_ci
  Database Collation: latin1_swedish_ci
```

`character_set_client` é o valor da sessão da variável de sistema `character_set_client` quando a rotina foi criada. `collation_connection` é o valor da sessão da variável de sistema `collation_connection` quando a rotina foi criada. `Database Collation` é a collation do banco de dados com o qual a rotina está associada.

#### 13.7.5.10 Declaração SHOW CREATE TABLE

```sql
SHOW CREATE TABLE tbl_name
```

Mostra a declaração `CREATE TABLE` que cria a tabela nomeada. Para usar essa declaração, você deve ter algum privilégio para a tabela. Essa declaração também funciona com visualizações.

```sql
mysql> SHOW CREATE TABLE t\G
*************************** 1. row ***************************
       Table: t
Create Table: CREATE TABLE `t` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `s` char(60) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1
```

`SHOW CREATE TABLE` cita tabelas e nomes de colunas de acordo com o valor da opção `sql_quote_show_create`. Veja a Seção 5.1.7, “Variáveis do Sistema do Servidor”.

Ao alterar o mecanismo de armazenamento de uma tabela, as opções da tabela que não são aplicáveis ao novo mecanismo de armazenamento são mantidas na definição da tabela para permitir a reversão da tabela com suas opções previamente definidas para o mecanismo de armazenamento original, se necessário. Por exemplo, ao alterar o mecanismo de armazenamento de InnoDB para MyISAM, as opções específicas do InnoDB, como `ROW_FORMAT=COMPACT`, são mantidas.

```sql
mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) ROW_FORMAT=COMPACT ENGINE=InnoDB;
mysql> ALTER TABLE t1 ENGINE=MyISAM;
mysql> SHOW CREATE TABLE t1\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t1` (
  `c1` int(11) NOT NULL,
  PRIMARY KEY (`c1`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT
```

Ao criar uma tabela com o modo estrito desativado, o formato de string padrão do mecanismo de armazenamento é usado se o formato de string especificado não for suportado. O formato de string real da tabela é relatado na coluna `Row_format` em resposta ao `SHOW TABLE STATUS`. `SHOW CREATE TABLE` mostra o formato de string que foi especificado na declaração `CREATE TABLE`.

#### 13.7.5.11 Declaração SHOW CREATE TRIGGER

```sql
SHOW CREATE TRIGGER trigger_name
```

Essa declaração mostra a declaração `CREATE TRIGGER` que cria o gatilho nomeado. Essa declaração requer o privilégio `TRIGGER` para a tabela associada ao gatilho.

```sql
mysql> SHOW CREATE TRIGGER ins_sum\G
*************************** 1. row ***************************
               Trigger: ins_sum
              sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                        NO_ZERO_IN_DATE,NO_ZERO_DATE,
                        ERROR_FOR_DIVISION_BY_ZERO,
                        NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
SQL Original Statement: CREATE DEFINER=`me`@`localhost` TRIGGER ins_sum
                        BEFORE INSERT ON account
                        FOR EACH ROW SET @sum = @sum + NEW.amount
  character_set_client: utf8
  collation_connection: utf8_general_ci
    Database Collation: latin1_swedish_ci
               Created: 2018-08-08 10:10:07.90
```

A saída `SHOW CREATE TRIGGER` tem essas colunas:

* `Trigger`: O nome do gatilho.  
* `sql_mode`: O modo SQL em vigor quando o gatilho é executado.

* `SQL Original Statement`: A declaração `CREATE TRIGGER` que define o gatilho.

* `character_set_client`: O valor da sessão da variável de sistema `character_set_client` quando o gatilho foi criado.

* `collation_connection`: O valor da sessão da variável de sistema `collation_connection` quando o gatilho foi criado.

* `Database Collation`: A agregação do banco de dados com o qual o gatilho está associado.

* `Created`: A data e a hora em que o gatilho foi criado. Este é um valor `TIMESTAMP(2)` (com uma parte fracionária em centésimos de segundos) para gatilhos criados no MySQL 5.7.2 ou posterior, `NULL` para gatilhos criados antes de 5.7.2.

As informações de gatilho também estão disponíveis na tabela `INFORMATION_SCHEMA` `TRIGGERS`. Veja a Seção 24.3.29, “A tabela TRIGGERS do INFORMATION_SCHEMA”.

#### 13.7.5.12 Declaração SHOW CREATE USER

```sql
SHOW CREATE USER user
```

Essa declaração mostra a declaração `CREATE USER` que cria o usuário nomeado. Um erro ocorre se o usuário não existir. A declaração requer o privilégio `SELECT` para o banco de dados do sistema `mysql`, exceto para exibir informações para o usuário atual.

Para nomear a conta, use o formato descrito na Seção 6.2.4, “Especificação de Nomes de Conta”. A parte do nome de conta que representa o nome do host, se omitida, tem como padrão `'%'`. Também é possível especificar `CURRENT_USER` ou `CURRENT_USER()` para se referir à conta associada à sessão atual.

```sql
mysql> SHOW CREATE USER 'root'@'localhost'\G
*************************** 1. row ***************************
CREATE USER for root@localhost: CREATE USER 'root'@'localhost'
IDENTIFIED WITH 'mysql_native_password'
AS '*2470C0C06DEE42FD1618BB99005ADCA2EC9D1E19'
REQUIRE NONE PASSWORD EXPIRE DEFAULT ACCOUNT UNLOCK
```

O formato de saída é afetado pela configuração da variável de sistema `log_builtin_as_identified_by_password`.

Para exibir os privilégios concedidos a uma conta, use a declaração `SHOW GRANTS`. Veja a Seção 13.7.5.21, “Declaração SHOW GRANTS”.

#### 13.7.5.13 Declaração SHOW CREATE VIEW

```sql
SHOW CREATE VIEW view_name
```

Esta declaração mostra a declaração `CREATE VIEW` que cria a visão nomeada.

```sql
mysql> SHOW CREATE VIEW v\G
*************************** 1. row ***************************
                View: v
         Create View: CREATE ALGORITHM=UNDEFINED
                      DEFINER=`bob`@`localhost`
                      SQL SECURITY DEFINER VIEW
                      `v` AS select 1 AS `a`,2 AS `b`
character_set_client: utf8
collation_connection: utf8_general_ci
```

`character_set_client` é o valor da sessão da variável de sistema `character_set_client` quando a visualização foi criada. `collation_connection` é o valor da sessão da variável de sistema `collation_connection` quando a visualização foi criada.

O uso de `SHOW CREATE VIEW` requer o privilégio `SHOW VIEW`, e o privilégio `SELECT` para a visão em questão.

As informações também estão disponíveis na tabela `INFORMATION_SCHEMA` `VIEWS`. Veja a Seção 24.3.31, “A tabela VIEWS do INFORMATION_SCHEMA”.

O MySQL permite que você use diferentes configurações `sql_mode` para informar ao servidor o tipo de sintaxe SQL a ser suportado. Por exemplo, você pode usar o modo SQL `ANSI` para garantir que o MySQL interprete corretamente o operador de concatenação padrão SQL, a barra dupla (`||`), em suas consultas. Se você criar uma visão que concatene itens, pode se preocupar que alterar a configuração `sql_mode` para um valor diferente de `ANSI` possa fazer com que a visão se torne inválida. Mas isso não é o caso. Independentemente de como você escreva uma definição de visão, o MySQL sempre a armazena da mesma maneira, em uma forma canônica. Aqui está um exemplo que mostra como o servidor altera um operador de concatenação de barra dupla para uma função `CONCAT()`:

```sql
mysql> SET sql_mode = 'ANSI';
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE VIEW test.v AS SELECT 'a' || 'b' as col1;
Query OK, 0 rows affected (0.01 sec)

mysql> SHOW CREATE VIEW test.v\G
*************************** 1. row ***************************
                View: v
         Create View: CREATE VIEW "v" AS select concat('a','b') AS "col1"
...
1 row in set (0.00 sec)
```

A vantagem de armazenar uma definição de visualização em forma canônica é que as alterações feitas posteriormente no valor de `sql_mode` não afetam os resultados da visualização. No entanto, uma consequência adicional é que os comentários anteriores a `SELECT` são removidos da definição pelo servidor.

#### 13.7.5.14 Declaração de DATABASES SHOW

```sql
SHOW {DATABASES | SCHEMAS}
    [LIKE 'pattern' | WHERE expr]
```

`SHOW DATABASES` lista os bancos de dados no host do servidor MySQL. `SHOW SCHEMAS` é sinônimo de `SHOW DATABASES`. A cláusula `LIKE`, se presente, indica quais nomes de banco de dados devem ser correspondidos. A cláusula `WHERE` pode ser usada para selecionar strings com condições mais gerais, conforme discutido na Seção 24.8, “Extensões para Declarações SHOW”.

Você só verá os bancos de dados para os quais você tem algum tipo de privilégio, a menos que você tenha o privilégio global [[`SHOW DATABASES`]. Você também pode obter essa lista usando o comando **mysqlshow**.

Se o servidor foi iniciado com a opção `--skip-show-database`, você não pode usar essa declaração de forma alguma, a menos que você tenha o privilégio `SHOW DATABASES`.

O MySQL implementa bancos de dados como diretórios no diretório de dados, portanto, essa declaração simplesmente lista diretórios nesse local. No entanto, a saída pode incluir nomes de diretórios que não correspondem a bancos de dados reais.

As informações do banco de dados também estão disponíveis na tabela `INFORMATION_SCHEMA` `SCHEMATA`. Veja a Seção 24.3.22, “A tabela INFORMATION_SCHEMA SCHEMATA”.

Cuidado

Como um privilégio global é considerado um privilégio para todas as bases de dados, *qualquer* privilégio global permite que um usuário veja todos os nomes de banco de dados com `SHOW DATABASES` ou examinando a tabela `INFORMATION_SCHEMA` `SCHEMATA`.

#### 13.7.5.15 Declaração do motor de exibição

```sql
SHOW ENGINE engine_name {STATUS | MUTEX}
```

`SHOW ENGINE` exibe informações operacionais sobre um motor de armazenamento. Requer o privilégio `PROCESS`. A declaração tem essas variantes:

```sql
SHOW ENGINE INNODB STATUS
SHOW ENGINE INNODB MUTEX
SHOW ENGINE PERFORMANCE_SCHEMA STATUS
```

`SHOW ENGINE INNODB STATUS` exibe informações extensas do monitor padrão `InnoDB` sobre o estado do motor de armazenamento `InnoDB`. Para informações sobre o monitor padrão e outros monitores `InnoDB` que fornecem informações sobre o processamento de `InnoDB`, consulte a Seção 14.18, “Monitores InnoDB”.

`SHOW ENGINE INNODB MUTEX` exibe as estatísticas de mutex e bloqueio rw-lock de `InnoDB`.

Nota

Os mutexes e rwlocks também podem ser monitorados usando as tabelas do Schema de Desempenho. Veja a Seção 14.17.2, “Monitoramento de Esperas de Mutex InnoDB Usando o Schema de Desempenho”.

A saída `SHOW ENGINE INNODB MUTEX` foi removida no MySQL 5.7.2. Foi revisada e reintroduzida no MySQL 5.7.8.

Em MySQL 5.7.8, a coleta de estatísticas de mutex é configurada dinamicamente usando as seguintes opções:

* Para habilitar a coleta de estatísticas de mutex, execute:

  ```sql
  SET GLOBAL innodb_monitor_enable='latch';
  ```

* Para redefinir as estatísticas do mutex, execute:

  ```sql
  SET GLOBAL innodb_monitor_reset='latch';
  ```

* Para desativar a coleta de estatísticas de mutex, execute:

  ```sql
  SET GLOBAL innodb_monitor_disable='latch';
  ```

A coleta de estatísticas de mutex para `SHOW ENGINE INNODB MUTEX` também pode ser habilitada definindo `innodb_monitor_enable='all'`, ou desabilitada definindo `innodb_monitor_disable='all'`.

A saída `SHOW ENGINE INNODB MUTEX` tem essas colunas:

* `Type`

Sempre `InnoDB`.

* `Name`

Antes do MySQL 5.7.8, o campo `Name` relata o arquivo de origem onde o mutex é implementado e o número da string no arquivo onde o mutex é criado. O número da string é específico para sua versão do MySQL. A partir do MySQL 5.7.8, apenas o nome do mutex é relatado. O nome do arquivo e o número da string ainda são relatados para rwlocks.

* `Status`

O status do mutex.

Antes do MySQL 5.7.8, o campo `Status` exibe vários valores se `WITH_DEBUG` foi definido no momento da compilação do MySQL. Se `WITH_DEBUG` não foi definido, a declaração exibe apenas o valor do campo `os_waits`. No último caso (sem `WITH_DEBUG`, as informações sobre as quais a saída é baseada são insuficientes para distinguir entre mútuos regulares e mútuos que protegem rwlocks (que permitem múltiplos leitores ou um único escritor). Consequentemente, a saída pode parecer conter várias strings para o mesmo mútuo. Os valores do campo `Status` antes do MySQL 5.7.8 incluem:

+ `count` indica quantas vezes o mutex foi solicitado.

+ `spin_waits` indica quantas vezes o spinlock teve que ser executado.

+ `spin_rounds` indica o número de rodadas de spinlock. (`spin_rounds` dividido por `spin_waits` fornece o número médio de rodadas.)

+ `os_waits` indica o número de espera do sistema operacional. Isso ocorre quando o spinlock não funcionou (o mutex não foi bloqueado durante o spinlock e foi necessário ceder ao sistema operacional e esperar).

+ `os_yields` indica o número de vezes que um thread que tenta bloquear um mutex desistiu de seu timeslice e cedeu ao sistema operacional (pela suposição de que permitir que outros threads corram libera o mutex para que ele possa ser bloqueado).

+ `os_wait_times` indica o tempo (em ms) gasto em espera do sistema operacional. No MySQL 5.7, o temporizador está desativado e esse valor é sempre 0.

A partir do MySQL 5.7.8, o campo `Status` relata o número de giros, espera e chamadas. As estatísticas para mutantes de sistema operacional de nível baixo, que são implementados fora de `InnoDB`, não são relatadas.

+ `spins` indica o número de giros.
  + `waits` indica o número de espera de mutex.

+ `calls` indica quantas vezes o mutex foi solicitado.

`SHOW ENGINE INNODB MUTEX` não lista mutxes e blocos de bloqueio rw para cada bloco do pool de buffers, pois a quantidade de saída seria esmagadora em sistemas com um grande pool de buffers. `SHOW ENGINE INNODB MUTEX`, no entanto, imprime valores agregados de `BUF_BLOCK_MUTEX` de rotação, espera e chamada para mutxes e blocos de bloqueio rw do pool de buffers. `SHOW ENGINE INNODB MUTEX` também não lista quaisquer mutxes ou blocos de bloqueio rw que nunca tenham sido aguardados (`os_waits=0`). Assim, `SHOW ENGINE INNODB MUTEX` exibe apenas informações sobre mutxes e blocos de bloqueio rw fora do pool de buffers que causaram pelo menos uma espera em nível de sistema operacional.

Use `SHOW ENGINE PERFORMANCE_SCHEMA STATUS` para inspecionar a operação interna do código do Schema de Desempenho:

```sql
mysql> SHOW ENGINE PERFORMANCE_SCHEMA STATUS\G
...
*************************** 3. row ***************************
  Type: performance_schema
  Name: events_waits_history.size
Status: 76
*************************** 4. row ***************************
  Type: performance_schema
  Name: events_waits_history.count
Status: 10000
*************************** 5. row ***************************
  Type: performance_schema
  Name: events_waits_history.memory
Status: 760000
...
*************************** 57. row ***************************
  Type: performance_schema
  Name: performance_schema.memory
Status: 26459600
...
```

Esta declaração visa ajudar o DBA a entender os efeitos que as diferentes opções do Schema de Desempenho têm nos requisitos de memória.

Os valores de `Name` consistem em duas partes, que nomeiam um buffer interno e um atributo de buffer, respectivamente. Interprete os nomes dos buffers da seguinte forma:

* Um buffer interno que não é exibido como uma tabela é nomeado entre parênteses. Exemplos: `(pfs_cond_class).size`, `(pfs_mutex_class).memory`.

* Um buffer interno que é exibido como uma tabela no banco de dados `performance_schema` é nomeado com base na tabela, sem parênteses. Exemplos: `events_waits_history.size`, `mutex_instances.count`.

* Um valor que se aplica ao Schema de Desempenho como um todo começa com `performance_schema`. Exemplo: `performance_schema.memory`.

Os atributos de buffer têm esses significados:

* `size` é o tamanho do registro interno utilizado pela implementação, como o tamanho de uma string em uma tabela. Os valores de `size` não podem ser alterados.

* `count` é o número de registros internos, como o número de strings em uma tabela. Os valores de `count` podem ser alterados usando as opções de configuração do Gerador de Desempenho.

* Para uma tabela, `tbl_name.memory` é o produto de `size` e `count`. Para o Schema de Desempenho como um todo, `performance_schema.memory` é a soma de toda a memória usada (a soma de todos os outros valores de `memory`).

Em alguns casos, há uma relação direta entre um parâmetro de configuração do Schema de Desempenho e um valor de `SHOW ENGINE`. Por exemplo, `events_waits_history_long.count` corresponde a `performance_schema_events_waits_history_long_size`. Em outros casos, a relação é mais complexa. Por exemplo, `events_waits_history.count` corresponde a `performance_schema_events_waits_history_size` (o número de strings por thread) multiplicado por `performance_schema_max_thread_instances` (o número de threads).

**MOSTRE O STATUS DO MOTOR DE EXIBIÇÃO NDB.** Se o servidor tiver o motor de armazenamento `NDB` habilitado, `SHOW ENGINE NDB STATUS` exibe informações de status do clúster, como o número de nós de dados conectados, a string de conexão do clúster e as épocas do log binário do clúster, além de contagem de vários objetos da API do Cluster criados pelo MySQL Server quando conectado ao clúster. A saída de exemplo desta declaração é mostrada aqui:

```sql
mysql> SHOW ENGINE NDB STATUS;
+------------+-----------------------+--------------------------------------------------+
| Type       | Name                  | Status                                           |
+------------+-----------------------+--------------------------------------------------+
| ndbcluster | connection            | cluster_node_id=7,
  connected_host=198.51.100.103, connected_port=1186, number_of_data_nodes=4,
  number_of_ready_data_nodes=3, connect_count=0                                         |
| ndbcluster | NdbTransaction        | created=6, free=0, sizeof=212                    |
| ndbcluster | NdbOperation          | created=8, free=8, sizeof=660                    |
| ndbcluster | NdbIndexScanOperation | created=1, free=1, sizeof=744                    |
| ndbcluster | NdbIndexOperation     | created=0, free=0, sizeof=664                    |
| ndbcluster | NdbRecAttr            | created=1285, free=1285, sizeof=60               |
| ndbcluster | NdbApiSignal          | created=16, free=16, sizeof=136                  |
| ndbcluster | NdbLabel              | created=0, free=0, sizeof=196                    |
| ndbcluster | NdbBranch             | created=0, free=0, sizeof=24                     |
| ndbcluster | NdbSubroutine         | created=0, free=0, sizeof=68                     |
| ndbcluster | NdbCall               | created=0, free=0, sizeof=16                     |
| ndbcluster | NdbBlob               | created=1, free=1, sizeof=264                    |
| ndbcluster | NdbReceiver           | created=4, free=0, sizeof=68                     |
| ndbcluster | binlog                | latest_epoch=155467, latest_trans_epoch=148126,
  latest_received_binlog_epoch=0, latest_handled_binlog_epoch=0,
  latest_applied_binlog_epoch=0                                                         |
+------------+-----------------------+--------------------------------------------------+
```

A coluna `Status` em cada uma dessas strings fornece informações sobre a conexão do servidor MySQL com o clúster e sobre o status do log binário do clúster, respectivamente. As informações `Status` estão na forma de um conjunto de pares nome/valor separados por vírgula.

A coluna `Status` da string `connection` contém os pares nome/valor descritos na tabela a seguir.

<table summary="Name and value pairs found in the connection row Status column in the output of the SHOW ENGINE NDB STATUS statement."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Name</th> <th>Valor</th> </tr></thead><tbody><tr> <td><code>cluster_node_id</code></td> <td>O ID do nó do servidor MySQL no clúster</td> </tr><tr> <td><code>connected_host</code></td> <td>O nome de domínio ou endereço IP do servidor de gerenciamento de clúster ao qual o servidor MySQL está conectado</td> </tr><tr> <td><code>connected_port</code></td> <td>O porto usado pelo servidor MySQL para se conectar ao servidor de gerenciamento (<code>connected_host</code>)</td> </tr><tr> <td><code>number_of_data_nodes</code></td> <td>O número de nós de dados configurados para o clúster (ou seja, o número de<code>[ndbd]</code>seções no aglomerado<code>config.ini</code>arquivo)</td> </tr><tr> <td><code>number_of_ready_data_nodes</code></td> <td>O número de nós de dados no clúster que estão realmente em execução</td> </tr><tr> <td><code>connect_count</code></td> <td>O número de vezes que isso<strong>mysqld</strong>conectou ou reconectou-se aos nós de dados do cluster</td> </tr></tbody></table>

A coluna `Status` da string `binlog` contém informações relacionadas à Replicação de NDB Cluster. Os pares nome/valor que ela contém são descritos na tabela a seguir.

<table summary="Name and value pairs found in the binlog row Status column in the output of the SHOW ENGINE NDB STATUS statement."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Name</th> <th>Valor</th> </tr></thead><tbody><tr> <td><code>latest_epoch</code></td> <td>A época mais recente que mais recentemente foi executada neste servidor MySQL (ou seja, o número de sequência da transação mais recente executada no servidor)</td> </tr><tr> <td><code>latest_trans_epoch</code></td> <td>A época mais recente processada pelos nós de dados do clúster</td> </tr><tr> <td><code>latest_received_binlog_epoch</code></td> <td>A época mais recente recebida pelo thread de registro binário</td> </tr><tr> <td><code>latest_handled_binlog_epoch</code></td> <td>A época mais recente processada pelo thread de log binário (para gravação no log binário)</td> </tr><tr> <td><code>latest_applied_binlog_epoch</code></td> <td>A época mais recente, na verdade, é escrita no log binário</td> </tr></tbody></table>

Consulte a Seção 21.7, “Replicação de aglomerado NDB”, para obter mais informações.

As strings restantes da saída de `SHOW ENGINE NDB STATUS` que provavelmente serão úteis na monitorização do grupo estão listadas aqui por `Name`:

* `NdbTransaction`: O número e o tamanho dos objetos `NdbTransaction` que foram criados. Um `NdbTransaction` é criado cada vez que uma operação de esquema de tabela (como `CREATE TABLE` ou `ALTER TABLE`) é realizada em uma tabela `NDB`.

* `NdbOperation`: O número e o tamanho dos objetos `NdbOperation` que foram criados.

* `NdbIndexScanOperation`: O número e o tamanho dos objetos `NdbIndexScanOperation` que foram criados.

* `NdbIndexOperation`: O número e o tamanho dos objetos `NdbIndexOperation` que foram criados.

* `NdbRecAttr`: O número e o tamanho dos objetos `NdbRecAttr` que foram criados. Geralmente, um deles é criado a cada vez que uma declaração de manipulação de dados é realizada por um nó SQL.

* `NdbBlob`: O número e o tamanho dos objetos `NdbBlob` que foram criados. Um `NdbBlob` é criado para cada nova operação que envolve uma coluna `BLOB` em uma tabela `NDB`.

* `NdbReceiver`: O número e o tamanho de qualquer objeto `NdbReceiver` que foram criados. O número na coluna `created` é o mesmo que o número de nós de dados no clúster ao qual o servidor MySQL se conectou.

Nota

`SHOW ENGINE NDB STATUS` retorna um resultado vazio se nenhuma operação envolvendo as tabelas `NDB` tiver sido realizada durante a sessão atual pelo cliente MySQL que está acessando o nó SQL em que esta declaração é executada.

#### 13.7.5.16 Declaração sobre motores de exibição

```sql
SHOW [STORAGE] ENGINES
```

`SHOW ENGINES` exibe informações de status sobre os motores de armazenamento do servidor. Isso é particularmente útil para verificar se um motor de armazenamento é suportado ou para ver qual é o motor padrão.

Para informações sobre os motores de armazenamento do MySQL, consulte o Capítulo 14, *O Motor de Armazenamento InnoDB*, e o Capítulo 15, *Motores de Armazenamento Alternativos*.

```sql
mysql> SHOW ENGINES\G
*************************** 1. row ***************************
      Engine: InnoDB
     Support: DEFAULT
     Comment: Supports transactions, row-level locking, and foreign keys
Transactions: YES
          XA: YES
  Savepoints: YES
*************************** 2. row ***************************
      Engine: MRG_MYISAM
     Support: YES
     Comment: Collection of identical MyISAM tables
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 3. row ***************************
      Engine: MEMORY
     Support: YES
     Comment: Hash based, stored in memory, useful for temporary tables
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 4. row ***************************
      Engine: BLACKHOLE
     Support: YES
     Comment: /dev/null storage engine (anything you write to it disappears)
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 5. row ***************************
      Engine: MyISAM
     Support: YES
     Comment: MyISAM storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 6. row ***************************
      Engine: CSV
     Support: YES
     Comment: CSV storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 7. row ***************************
      Engine: ARCHIVE
     Support: YES
     Comment: Archive storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 8. row ***************************
      Engine: PERFORMANCE_SCHEMA
     Support: YES
     Comment: Performance Schema
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 9. row ***************************
      Engine: FEDERATED
     Support: YES
     Comment: Federated MySQL storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
```

A saída do `SHOW ENGINES` pode variar de acordo com a versão do MySQL utilizada e outros fatores.

A saída `SHOW ENGINES` tem essas colunas:

* `Engine`

O nome do motor de armazenamento.

* `Support`

O nível de suporte do servidor para o motor de armazenamento, conforme mostrado na tabela a seguir.

  <table summary="Values for the Support column in the output of the SHOW ENGINES statement."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Value</th> <th>Significado</th> </tr></thead><tbody><tr> <td><code>YES</code></td> <td>O motor é suportado e está ativo</td> </tr><tr> <td><code>DEFAULT</code></td> <td>Como<code>YES</code>, além disso, este é o motor padrão</td> </tr><tr> <td><code>NO</code></td> <td>O motor não é suportado</td> </tr><tr> <td><code>DISABLED</code></td> <td>O motor é suportado, mas foi desativado</td> </tr></tbody></table>

Um valor de `NO` significa que o servidor foi compilado sem suporte para o motor, portanto, não pode ser habilitado em tempo de execução.

Um valor de `DISABLED` ocorre porque o servidor foi iniciado com uma opção que desativa o motor, ou porque não foram fornecidas todas as opções necessárias para ativá-lo. No último caso, o log de erro deve conter um motivo que indique por que a opção está desativada. Veja a Seção 5.4.2, “O Log de Erro”.

Você também pode ver `DISABLED` para um motor de armazenamento se o servidor foi compilado para o suporte a ele, mas foi iniciado com uma opção `--skip-engine_name`. Para o motor de armazenamento `NDB`, `DISABLED` significa que o servidor foi compilado com suporte para NDB Cluster, mas não foi iniciado com a opção `--ndbcluster`.

Todos os servidores MySQL suportam as tabelas `MyISAM`. Não é possível desabilitar `MyISAM`.

* `Comment`

Uma breve descrição do motor de armazenamento.

* `Transactions`

Se o motor de armazenamento suporta transações.

* `XA`

Se o motor de armazenamento suporta transações XA.

* `Savepoints`

Se o motor de armazenamento suporta pontos de salvamento.

As informações do motor de armazenamento também estão disponíveis na tabela `INFORMATION_SCHEMA` `ENGINES`. Veja a Seção 24.3.7, “A tabela INFORMATION\_SCHEMA ENGINES”.

#### 13.7.5.17 Declaração de ERROS DE EXIBIÇÃO

```sql
SHOW ERRORS [LIMIT [offset,] row_count]
SHOW COUNT(*) ERRORS
```

`SHOW ERRORS` é uma declaração diagnóstica que é semelhante a `SHOW WARNINGS`, exceto que exibe informações apenas para erros, em vez de erros, avisos e notas.

A cláusula `LIMIT` tem a mesma sintaxe que a declaração `SELECT`. Veja a Seção 13.2.9, “Declaração SELECT”.

A declaração `SHOW COUNT(*) ERRORS` exibe o número de erros. Você também pode recuperar esse número a partir da variável `error_count`:

```sql
SHOW COUNT(*) ERRORS;
SELECT @@error_count;
```

`SHOW ERRORS` e `error_count` aplicam-se apenas a erros, não a avisos ou notas. Em outros aspectos, são semelhantes a `SHOW WARNINGS` e `warning_count`. Em particular, `SHOW ERRORS` não pode exibir informações para mais de `max_error_count` mensagens, e `error_count` pode exceder o valor de `max_error_count` se o número de erros exceder `max_error_count`.

Para mais informações, consulte a Seção 13.7.5.40, “Declaração de AVISOS”.

#### 13.7.5.18 Declaração sobre eventos de exibição

```sql
SHOW EVENTS
    [{FROM | IN} schema_name]
    [LIKE 'pattern' | WHERE expr]
```

Essa declaração exibe informações sobre eventos do Gerenciador de Eventos, que são discutidos na Seção 23.4, “Usando o Cronograma de Eventos”. Ela requer o privilégio `EVENT` para o banco de dados do qual os eventos devem ser exibidos.

Na sua forma mais simples, `SHOW EVENTS` lista todos os eventos no esquema atual:

```sql
mysql> SELECT CURRENT_USER(), SCHEMA();
+----------------+----------+
| CURRENT_USER() | SCHEMA() |
+----------------+----------+
| jon@ghidora    | myschema |
+----------------+----------+
1 row in set (0.00 sec)

mysql> SHOW EVENTS\G
*************************** 1. row ***************************
                  Db: myschema
                Name: e_daily
             Definer: jon@ghidora
           Time zone: SYSTEM
                Type: RECURRING
          Execute at: NULL
      Interval value: 1
      Interval field: DAY
              Starts: 2018-08-08 11:06:34
                Ends: NULL
              Status: ENABLED
          Originator: 1
character_set_client: utf8
collation_connection: utf8_general_ci
  Database Collation: latin1_swedish_ci
```

Para ver eventos para um esquema específico, use a cláusula `FROM`. Por exemplo, para ver eventos para o esquema `test`, use a seguinte declaração:

```sql
SHOW EVENTS FROM test;
```

A cláusula `LIKE`, se presente, indica quais nomes de eventos devem ser correspondidos. A cláusula `WHERE` pode ser usada para selecionar strings com condições mais gerais, conforme discutido na Seção 24.8, “Extensões para Declarações SHOW”.

A saída `SHOW EVENTS` tem essas colunas:

* `Db`

O nome do esquema (banco de dados) ao qual o evento pertence.

* `Name`

O nome do evento.

* `Definer`

A conta do usuário que criou o evento, no formato `'user_name'@'host_name'`.

* `Time zone`

O fuso horário do evento, que é o fuso horário usado para agendar o evento e que está em vigor dentro do evento conforme ele é executado. O valor padrão é `SYSTEM`.

* `Type`

O tipo de repetição do evento, seja `ONE TIME` (transitória) ou `RECURRING` (repetitiva).

* `Execute At`

Para um evento único, esse é o valor `DATETIME` especificado na cláusula `AT` da declaração `CREATE EVENT` usada para criar o evento, ou do último `ALTER EVENT` que modificou o evento. O valor mostrado nesta coluna reflete a adição ou subtração de qualquer valor `INTERVAL` incluído na cláusula `AT` do evento. Por exemplo, se um evento é criado usando `ON SCHEDULE AT CURRENT_TIMESTAMP + '1:6' DAY_HOUR`, e o evento foi criado em 2018-02-09 14:05:30, o valor mostrado nesta coluna seria `'2018-02-10 20:05:30'`. Se o cronograma do evento é determinado por uma cláusula `EVERY` em vez de uma cláusula `AT` (ou seja, se o evento é recorrente), o valor desta coluna é `NULL`.

* `Interval Value`

Para um evento recorrente, o número de intervalos a serem esperados entre as execuções do evento. Para um evento transitório, o valor desta coluna é sempre `NULL`.

* `Interval Field`

As unidades de tempo usadas para o intervalo que um evento recorrente espera antes de se repetir. Para um evento transitório, o valor desta coluna é sempre `NULL`.

* `Starts`

A data e a hora de início de um evento periódico. Isso é exibido como um valor `DATETIME`, e é `NULL` se não houver data e hora de início definidos para o evento. Para um evento transitório, esta coluna é sempre `NULL`. Para um evento periódico cuja definição inclui uma cláusula `STARTS`, esta coluna contém o valor correspondente `DATETIME`. Assim como a coluna `Execute At`, esse valor resolve quaisquer expressões usadas. Se não houver cláusula `STARTS` que afete o cronograma do evento, esta coluna é `NULL`

* `Ends`

Para um evento recorrente cuja definição inclui uma cláusula `ENDS`, esta coluna contém o valor correspondente `DATETIME`. Assim como a coluna `Execute At`, este valor resolve quaisquer expressões utilizadas. Se não houver nenhuma cláusula `ENDS` que afete o momento do evento, esta coluna é `NULL`.

* `Status`

O status do evento. Um dos `ENABLED`, `DISABLED` ou `SLAVESIDE_DISABLED`. `SLAVESIDE_DISABLED` indica que a criação do evento ocorreu em outro servidor MySQL que atua como fonte de replicação e foi replicado para o servidor MySQL atual que está atuando como replica, mas o evento não está sendo executado atualmente na replica. Para mais informações, consulte a Seção 16.4.1.16, “Replicação de Recursos Convocados”.

* `Originator`

O ID do servidor do MySQL no qual o evento foi criado; utilizado na replicação. Este valor pode ser atualizado por `ALTER EVENT` para o ID do servidor no qual essa declaração ocorre, se executada em um servidor fonte. O valor padrão é 0.

* `character_set_client`

O valor da sessão da variável de sistema `character_set_client` quando o evento foi criado.

* `collation_connection`

O valor da sessão da variável de sistema `collation_connection` quando o evento foi criado.

* `Database Collation`

A agregação do banco de dados com o qual o evento está associado.

Para mais informações sobre `SLAVESIDE_DISABLED` e a coluna `Originator`, consulte a Seção 16.4.1.16, “Replicação de Características Invocadas”.

Os horários exibidos por `SHOW EVENTS` são fornecidos no fuso horário do evento, conforme discutido na Seção 23.4.4, “Metadados do evento”.

As informações sobre eventos também estão disponíveis na tabela `INFORMATION_SCHEMA` `EVENTS`. Veja a Seção 24.3.8, “A tabela de eventos do INFORMATION_SCHEMA”.

A declaração de ação do evento não é exibida na saída de `SHOW EVENTS`. Use a tabela `SHOW CREATE EVENT` ou `INFORMATION_SCHEMA` `EVENTS`.

#### 13.7.5.19 Código da função de exibição de declaração

```sql
SHOW FUNCTION CODE func_name
```

Esta declaração é semelhante a `SHOW PROCEDURE CODE`, mas para funções armazenadas. Veja a Seção 13.7.5.27, “Declaração SHOW PROCEDURE CODE”.

#### 13.7.5.20 Declaração de status da função de exibição

```sql
SHOW FUNCTION STATUS
    [LIKE 'pattern' | WHERE expr]
```

Esta declaração é semelhante a `SHOW PROCEDURE STATUS`, mas para funções armazenadas. Veja a Seção 13.7.5.28, “Declaração SHOW PROCEDURE STATUS”.

#### 13.7.5.21 Declaração de GRANTS SHOW

```sql
SHOW GRANTS [FOR user]
```

Essa declaração exibe os privilégios que são atribuídos a uma conta de usuário do MySQL, na forma de declarações `GRANT` que devem ser executadas para duplicar as atribuições de privilégios.

Nota

Para exibir informações não privilegiadas para contas do MySQL, use a declaração `SHOW CREATE USER`. Veja a Seção 13.7.5.12, “Declaração SHOW CREATE USER”.

`SHOW GRANTS` exige o privilégio `SELECT` para o banco de dados do sistema `mysql`, exceto para exibir privilégios para o usuário atual.

Para nomear a conta para `SHOW GRANTS`, use o mesmo formato que para a declaração `GRANT` (por exemplo, `'jeffrey'@'localhost'`):

```sql
mysql> SHOW GRANTS FOR 'jeffrey'@'localhost';
+------------------------------------------------------------------+
| Grants for jeffrey@localhost                                     |
+------------------------------------------------------------------+
| GRANT USAGE ON *.* TO `jeffrey`@`localhost`                      |
| GRANT SELECT, INSERT, UPDATE ON `db1`.* TO `jeffrey`@`localhost` |
+------------------------------------------------------------------+
```

A parte do host, se omitida, tem como padrão `'%'`. Para informações adicionais sobre a especificação de nomes de contas, consulte a Seção 6.2.4, “Especificação de Nomes de Contas”.

Para exibir os privilégios concedidos ao usuário atual (a conta que você está usando para se conectar ao servidor), você pode usar qualquer uma das seguintes declarações:

```sql
SHOW GRANTS;
SHOW GRANTS FOR CURRENT_USER;
SHOW GRANTS FOR CURRENT_USER();
```

Se o `SHOW GRANTS FOR CURRENT_USER` (ou qualquer sintaxe equivalente) for usado em um contexto de definição, como dentro de um procedimento armazenado que é executado com privilégios de definição em vez de de invocação, as concessões exibidas são as da definição e não da invocação.

`SHOW GRANTS` não exibe privilégios que estão disponíveis para a conta nomeada, mas que são concedidos a uma conta diferente. Por exemplo, se uma conta anônima existir, a conta nomeada pode ser capaz de usar seus privilégios, mas `SHOW GRANTS` não os exibe.

A saída `SHOW GRANTS` não inclui cláusulas `IDENTIFIED BY PASSWORD`. Use a declaração `SHOW CREATE USER` em vez disso. Veja a Seção 13.7.5.12, “Declaração SHOW CREATE USER”.

#### 13.7.5.22 Declaração de índice de exibição

```sql
SHOW {INDEX | INDEXES | KEYS}
    {FROM | IN} tbl_name
    [{FROM | IN} db_name]
    [WHERE expr]
```

`SHOW INDEX` retorna informações de índice de tabela. O formato se assemelha ao da chamada `SQLStatistics` no ODBC. Esta declaração requer algum privilégio para qualquer coluna na tabela.

```sql
mysql> SHOW INDEX FROM City\G
*************************** 1. row ***************************
        Table: city
   Non_unique: 0
     Key_name: PRIMARY
 Seq_in_index: 1
  Column_name: ID
    Collation: A
  Cardinality: 4188
     Sub_part: NULL
       Packed: NULL
         Null:
   Index_type: BTREE
      Comment:
Index_comment:
*************************** 2. row ***************************
        Table: city
   Non_unique: 1
     Key_name: CountryCode
 Seq_in_index: 1
  Column_name: CountryCode
    Collation: A
  Cardinality: 232
     Sub_part: NULL
       Packed: NULL
         Null:
   Index_type: BTREE
      Comment:
Index_comment:
```

Uma alternativa à sintaxe de `tbl_name FROM db_name` é *`db_name`.*`tbl_name`*. Essas duas declarações são equivalentes:

```sql
SHOW INDEX FROM mytable FROM mydb;
SHOW INDEX FROM mydb.mytable;
```

A cláusula `WHERE` pode ser usada para selecionar strings com condições mais gerais, conforme discutido na Seção 24.8, “Extensões para Declarações SHOW”.

`SHOW INDEX` retorna os seguintes campos:

* `Table`

O nome da tabela.

* `Non_unique`

0 se o índice não pode conter duplicatas, 1 se pode.

* `Key_name`

O nome do índice. Se o índice for a chave primária, o nome é sempre `PRIMARY`.

* `Seq_in_index`

O número de sequência da coluna no índice, começando com 1.

* `Column_name`

O nome da coluna.

* `Collation`

Como a coluna é ordenada no índice. Isso pode ter valores `A` (crescente) ou `NULL` (não ordenado).

* `Cardinality`

Uma estimativa do número de valores únicos no índice. Para atualizar esse número, execute `ANALYZE TABLE` ou (para as tabelas `MyISAM`), **myisamchk -a**.

`Cardinality` é contado com base em estatísticas armazenadas como inteiros, portanto, o valor não é necessariamente exato, mesmo para tabelas pequenas. Quanto maior a cardinalidade, maior a chance de o MySQL usar o índice ao realizar junções.

* `Sub_part`

O prefixo do índice. Ou seja, o número de caracteres indexados se a coluna estiver apenas parcialmente indexada, `NULL` se toda a coluna estiver indexada.

Nota

Os prefixos *limits* são medidos em bytes. No entanto, os prefixos *lengths* para especificações de índice nas declarações de `CREATE TABLE`, `ALTER TABLE` e `CREATE INDEX` são interpretados como número de caracteres para tipos de string não binários (`CHAR`, `VARCHAR`, `TEXT`) e número de bytes para tipos de string binários (`BINARY`, `VARBINARY`, `BLOB`). Tenha isso em conta ao especificar um comprimento de prefixo para uma coluna de string não binária que utiliza um conjunto de caracteres multibyte.

Para informações adicionais sobre prefixos de índice, consulte a Seção 8.3.4, “Indeks de Coluna”, e a Seção 13.1.14, “Instrução CREATE INDEX”.

* `Packed`

Indica como a chave é embalada. `NULL` se não for o caso.

* `Null`

Contém `YES` se a coluna pode conter valores de `NULL` e `''` se

* `Index_type`

O método de índice utilizado (`BTREE`, `FULLTEXT`, `HASH`, `RTREE`).

* `Comment`

Informações sobre o índice não descritas em sua própria coluna, como `disabled`, se o índice estiver desativado.

* `Index_comment`

Qualquer comentário fornecido para o índice com o atributo `COMMENT` quando o índice foi criado.

Informações sobre índices de tabela também estão disponíveis na tabela `INFORMATION_SCHEMA` `STATISTICS`. Veja a Seção 24.3.24, “A tabela de estatísticas do INFORMATION_SCHEMA”.

Você pode listar os índices de uma tabela com o comando **mysqlshow -k *`db_name`* *`tbl_name`***.

#### 13.7.5.23 Declaração de status do mestre

```sql
SHOW MASTER STATUS
```

Essa declaração fornece informações de status sobre os arquivos de registro binário da fonte. Requer o privilégio `SUPER` ou `REPLICATION CLIENT`.

Exemplo:

```sql
mysql> SHOW MASTER STATUS\G
*************************** 1. row ***************************
             File: source-bin.000002
         Position: 1307
     Binlog_Do_DB: test
 Binlog_Ignore_DB: manual, mysql
Executed_Gtid_Set: 3E11FA47-71CA-11E1-9E33-C80AA9429562:1-5
1 row in set (0.00 sec)
```

Quando os IDs de transação globais estão em uso, `Executed_Gtid_Set` mostra o conjunto de GTIDs para as transações que foram executadas na fonte. Isso é o mesmo que o valor para a variável de sistema `gtid_executed` neste servidor, bem como o valor para `Executed_Gtid_Set` na saída de `SHOW SLAVE STATUS` neste servidor.

#### 13.7.5.24 Declaração de mostrador aberto de mesas

```sql
SHOW OPEN TABLES
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

`SHOW OPEN TABLES` lista as tabelas não `TEMPORARY` que estão atualmente abertas no cache de tabelas. Veja a Seção 8.4.3.1, “Como o MySQL abre e fecha tabelas”. A cláusula `FROM`, se presente, restringe as tabelas mostradas às presentes no banco de dados *`db_name`*. A cláusula `LIKE`, se presente, indica quais nomes de tabela devem ser correspondidos. A cláusula `WHERE` pode ser dada para selecionar strings usando condições mais gerais, conforme discutido na Seção 24.8, “Extensões para Declarações SHOW”.

A saída `SHOW OPEN TABLES` tem essas colunas:

* `Database`

O banco de dados que contém a tabela.

* `Table`

O nome da tabela.

* `In_use`

O número de bloqueios de tabela ou solicitações de bloqueio para a tabela. Por exemplo, se um cliente adquire um bloqueio para uma tabela usando `LOCK TABLE t1 WRITE`, `In_use` é 1. Se outro cliente emite `LOCK TABLE t1 WRITE` enquanto a tabela permanece bloqueada, o cliente bloqueia a espera pelo bloqueio, mas a solicitação de bloqueio faz com que `In_use` seja 2. Se o contador for zero, a tabela está aberta, mas não está sendo usada atualmente. A `In_use` também é aumentada pela declaração `HANDLER ... OPEN` e diminuída por `HANDLER ... CLOSE`.

* `Name_locked`

Se o nome da tabela está bloqueado. O bloqueio de nome é usado para operações como a remoção ou renomeação de tabelas.

Se você não tiver privilégios para uma tabela, ela não aparecerá na saída do `SHOW OPEN TABLES`.

#### 13.7.5.25 Declaração de PLUGINS SHOW

```sql
SHOW PLUGINS
```

`SHOW PLUGINS` exibe informações sobre plugins do servidor.

Exemplo de saída de `SHOW PLUGINS`:

```sql
mysql> SHOW PLUGINS\G
*************************** 1. row ***************************
   Name: binlog
 Status: ACTIVE
   Type: STORAGE ENGINE
Library: NULL
License: GPL
*************************** 2. row ***************************
   Name: CSV
 Status: ACTIVE
   Type: STORAGE ENGINE
Library: NULL
License: GPL
*************************** 3. row ***************************
   Name: MEMORY
 Status: ACTIVE
   Type: STORAGE ENGINE
Library: NULL
License: GPL
*************************** 4. row ***************************
   Name: MyISAM
 Status: ACTIVE
   Type: STORAGE ENGINE
Library: NULL
License: GPL
...
```

A saída `SHOW PLUGINS` tem essas colunas:

* `Name`

O nome usado para se referir ao plugin em declarações como `INSTALL PLUGIN` e `UNINSTALL PLUGIN`.

* `Status`

O status do plugin, um dos `ACTIVE`, `INACTIVE`, `DISABLED` ou `DELETED`.

* `Type`

O tipo de plugin, como `STORAGE ENGINE`, `INFORMATION_SCHEMA` ou `AUTHENTICATION`.

* `Library`

O nome do arquivo de biblioteca compartilhada do plugin. Este é o nome usado para se referir ao arquivo do plugin em declarações como `INSTALL PLUGIN` e `UNINSTALL PLUGIN`. Este arquivo está localizado no diretório nomeado pela variável de sistema `plugin_dir`. Se o nome da biblioteca for `NULL`, o plugin é compilado e não pode ser desinstalado com `UNINSTALL PLUGIN`.

* `License`

Como o plugin é licenciado (por exemplo, `GPL`).

Para plugins instalados com `INSTALL PLUGIN`, os valores `Name` e `Library` também são registrados na tabela do sistema `mysql.plugin`.

Para informações sobre as estruturas de dados dos plugins que formam a base das informações exibidas pelo `SHOW PLUGINS`, consulte a API do Plugin MySQL.

As informações sobre os plugins também estão disponíveis na tabela `INFORMATION_SCHEMA` `.PLUGINS`. Veja a Seção 24.3.17, “A tabela INFORMATION_SCHEMA PLUGINS”.

#### 13.7.5.26 Declaração de PRÉVIAS DE EXIBIÇÃO

```sql
SHOW PRIVILEGES
```

`SHOW PRIVILEGES` mostra a lista de privilégios do sistema que o servidor MySQL suporta. A lista exata dos privilégios depende da versão do seu servidor.

```sql
mysql> SHOW PRIVILEGES\G
*************************** 1. row ***************************
Privilege: Alter
  Context: Tables
  Comment: To alter the table
*************************** 2. row ***************************
Privilege: Alter routine
  Context: Functions,Procedures
  Comment: To alter or drop stored functions/procedures
*************************** 3. row ***************************
Privilege: Create
  Context: Databases,Tables,Indexes
  Comment: To create new databases and tables
*************************** 4. row ***************************
Privilege: Create routine
  Context: Databases
  Comment: To use CREATE FUNCTION/PROCEDURE
*************************** 5. row ***************************
Privilege: Create temporary tables
  Context: Databases
  Comment: To use CREATE TEMPORARY TABLE
...
```

Os privilégios pertencentes a um usuário específico são exibidos pela declaração `SHOW GRANTS`. Consulte a Seção 13.7.5.21, “Declaração SHOW GRANTS”, para obter mais informações.

#### 13.7.5.27 CÓDIGO DO PROCEDIMENTO DE MOSTRA Declaração

```sql
SHOW PROCEDURE CODE proc_name
```

Essa declaração é uma extensão do MySQL que está disponível apenas para servidores que foram construídos com suporte de depuração. Ela exibe uma representação da implementação interna do procedimento armazenado nomeado. Uma declaração semelhante, `SHOW FUNCTION CODE`, exibe informações sobre funções armazenadas (consulte Seção 13.7.5.19, “Declaração SHOW FUNCTION CODE”).

Para usar qualquer uma dessas declarações, você deve ser o proprietário da rotina ou ter acesso ao `mysql.proc` da tabela `SELECT`.

Se a rotina nomeada estiver disponível, cada declaração produz um conjunto de resultados. Cada string do conjunto de resultados corresponde a uma “instrução” na rotina. A primeira coluna é `Pos`, que é um número ordinal começando com 0. A segunda coluna é `Instruction`, que contém uma declaração SQL (geralmente alterada a partir da fonte original) ou uma diretriz que tem significado apenas para o manipulador da rotina armazenada.

```sql
mysql> DELIMITER //
mysql> CREATE PROCEDURE p1 ()
       BEGIN
         DECLARE fanta INT DEFAULT 55;
         DROP TABLE t2;
         LOOP
           INSERT INTO t3 VALUES (fanta);
           END LOOP;
         END//
Query OK, 0 rows affected (0.01 sec)

mysql> SHOW PROCEDURE CODE p1//
+-----+----------------------------------------+
| Pos | Instruction                            |
+-----+----------------------------------------+
|   0 | set fanta@0 55                         |
|   1 | stmt 9 "DROP TABLE t2"                 |
|   2 | stmt 5 "INSERT INTO t3 VALUES (fanta)" |
|   3 | jump 2                                 |
+-----+----------------------------------------+
4 rows in set (0.00 sec)

mysql> CREATE FUNCTION test.hello (s CHAR(20))
       RETURNS CHAR(50) DETERMINISTIC
       RETURN CONCAT('Hello, ',s,'!');
Query OK, 0 rows affected (0.00 sec)

mysql> SHOW FUNCTION CODE test.hello;
+-----+---------------------------------------+
| Pos | Instruction                           |
+-----+---------------------------------------+
|   0 | freturn 254 concat('Hello, ',s@0,'!') |
+-----+---------------------------------------+
1 row in set (0.00 sec)
```

Neste exemplo, as declarações não executáveis `BEGIN` e `END` desapareceram, e para a declaração `DECLARE variable_name`, apenas a parte executável aparece (a parte onde o padrão é atribuído). Para cada declaração que é tirada da fonte, há uma palavra de código `stmt`, seguida por um tipo (9 significa `DROP`, 5 significa `INSERT`, e assim por diante). A última string contém uma instrução `jump 2`, significando `GOTO instruction #2`.

#### 13.7.5.28 Declaração de status do procedimento de exibição

```sql
SHOW PROCEDURE STATUS
    [LIKE 'pattern' | WHERE expr]
```

Essa declaração é uma extensão do MySQL. Ela retorna características de um procedimento armazenado, como o banco de dados, nome, tipo, criador, datas de criação e modificação e informações sobre o conjunto de caracteres. Uma declaração semelhante, `SHOW FUNCTION STATUS`, exibe informações sobre funções armazenadas (consulte Seção 13.7.5.20, “Declaração SHOW FUNCTION STATUS”).

Para usar qualquer uma dessas declarações, você deve ser o proprietário da rotina ou ter acesso ao `mysql.proc` da tabela `SELECT`.

A cláusula `LIKE`, se presente, indica quais nomes de procedimentos ou funções devem ser correspondidos. A cláusula `WHERE` pode ser usada para selecionar strings com condições mais gerais, conforme discutido na Seção 24.8, “Extensões para Declarações SHOW”.

```sql
mysql> SHOW PROCEDURE STATUS LIKE 'sp1'\G
*************************** 1. row ***************************
                  Db: test
                Name: sp1
                Type: PROCEDURE
             Definer: testuser@localhost
            Modified: 2018-08-08 13:54:11
             Created: 2018-08-08 13:54:11
       Security_type: DEFINER
             Comment:
character_set_client: utf8
collation_connection: utf8_general_ci
  Database Collation: latin1_swedish_ci

mysql> SHOW FUNCTION STATUS LIKE 'hello'\G
*************************** 1. row ***************************
                  Db: test
                Name: hello
                Type: FUNCTION
             Definer: testuser@localhost
            Modified: 2020-03-10 11:09:33
             Created: 2020-03-10 11:09:33
       Security_type: DEFINER
             Comment:
character_set_client: utf8
collation_connection: utf8_general_ci
  Database Collation: latin1_swedish_ci
```

`character_set_client` é o valor de sessão da variável de sistema `character_set_client` quando a rotina foi criada. `collation_connection` é o valor de sessão da variável de sistema `collation_connection` quando a rotina foi criada. `Database Collation` é a agregação do banco de dados com o qual a rotina está associada.

As informações de rotina armazenadas também estão disponíveis nas tabelas `INFORMATION_SCHEMA` `PARAMETERS` e `ROUTINES`. Veja a Seção 24.3.15, “A Tabela de PARÂMETROS do INFORMATION\_SCHEMA”, e a Seção 24.3.21, “A Tabela de ROUTINES do INFORMATION\_SCHEMA”.

#### 13.7.5.29 Declaração SHOW PROCESSLIST

```sql
SHOW [FULL] PROCESSLIST
```

A lista de processos do MySQL indica as operações atualmente realizadas pelo conjunto de threads que estão sendo executadas dentro do servidor. A declaração `SHOW PROCESSLIST` é uma fonte de informações sobre os processos. Para uma comparação desta declaração com outras fontes, consulte Fontes de Informações sobre Processos.

Se você tiver o privilégio `PROCESS`, poderá ver todas as mensagens, mesmo aquelas pertencentes a outros usuários. Caso contrário (sem o privilégio `PROCESS`, usuários não anônimos têm acesso às informações sobre suas próprias mensagens, mas não sobre as mensagens de outros usuários, e usuários anônimos não têm acesso às informações sobre as mensagens.

Sem a palavra-chave `FULL`, `SHOW PROCESSLIST` exibe apenas os primeiros 100 caracteres de cada declaração no campo `Info`.

A declaração `SHOW PROCESSLIST` é muito útil se você receber a mensagem de erro “existem muitas conexões” e quiser descobrir o que está acontecendo. O MySQL reserva uma conexão extra para ser usada por contas que têm o privilégio `SUPER`, para garantir que os administradores sempre possam se conectar e verificar o sistema (assumindo que você não está dando esse privilégio a todos os seus usuários).

Os threads podem ser mortos com a declaração `KILL`. Veja a Seção 13.7.6.4, “Declaração KILL”.

Exemplo de saída do `SHOW PROCESSLIST`:

```sql
mysql> SHOW FULL PROCESSLIST\G
*************************** 1. row ***************************
     Id: 1
   User: system user
   Host:
     db: NULL
Command: Connect
   Time: 1030455
  State: Waiting for master to send event
   Info: NULL
*************************** 2. row ***************************
     Id: 2
   User: system user
   Host:
     db: NULL
Command: Connect
   Time: 1004
  State: Has read all relay log; waiting for the slave
         I/O thread to update it
   Info: NULL
*************************** 3. row ***************************
     Id: 3112
   User: replikator
   Host: artemis:2204
     db: NULL
Command: Binlog Dump
   Time: 2144
  State: Has sent all binlog to slave; waiting for binlog to be updated
   Info: NULL
*************************** 4. row ***************************
     Id: 3113
   User: replikator
   Host: iconnect2:45781
     db: NULL
Command: Binlog Dump
   Time: 2086
  State: Has sent all binlog to slave; waiting for binlog to be updated
   Info: NULL
*************************** 5. row ***************************
     Id: 3123
   User: stefan
   Host: localhost
     db: apollon
Command: Query
   Time: 0
  State: NULL
   Info: SHOW FULL PROCESSLIST
```

A saída `SHOW PROCESSLIST` tem essas colunas:

* `Id`

O identificador de conexão. Este é o mesmo valor exibido na coluna `ID` da tabela `INFORMATION_SCHEMA` `PROCESSLIST`, exibida na coluna `PROCESSLIST_ID` da tabela do Schema de Desempenho `threads`, e retornada pela função `CONNECTION_ID()` dentro do thread.

* `User`

O usuário do MySQL que emitiu a declaração. Um valor de `system user` refere-se a um thread não cliente gerado pelo servidor para lidar com tarefas internamente, por exemplo, um thread de manipulação de string atrasada ou um thread de E/S ou SQL usado em hosts replicados. Para `system user`, não há um host especificado na coluna `Host`. `unauthenticated user` refere-se a um thread que se tornou associado a uma conexão com cliente, mas para o qual a autenticação do usuário do cliente ainda não ocorreu. `event_scheduler` refere-se ao thread que monitora eventos agendados (ver Seção 23.4, “Usando o Cronograma de Eventos”).

* `Host`

O nome do host do cliente que emite a declaração (exceto para `system user`, para o qual não há nenhum nome de host). O nome do host para conexões TCP/IP é relatado no formato `host_name:client_port` para facilitar a determinação de qual cliente está fazendo o que.

* `db`

O banco de dados padrão para o tópico, ou `NULL` se nenhum tiver sido selecionado.

* `Command`

O tipo de comando que o thread está executando em nome do cliente, ou `Sleep` se a sessão estiver inativa. Para descrições dos comandos do thread, consulte a Seção 8.14, “Examinando Informações do Thread (Processo) do Servidor” (Informações). O valor desta coluna corresponde aos comandos `COM_xxx` do protocolo cliente/servidor e às variáveis de status `Com_xxx`. Consulte a Seção 5.1.9, “Variáveis de Status do Servidor”.

* `Time`

O tempo em segundos que o thread esteve em seu estado atual. Para um thread de replicação SQL, o valor é o número de segundos entre o timestamp do último evento replicado e o tempo real do host da replica. Veja a Seção 16.2.3, “Threads de Replicação”.

* `State`

Uma ação, evento ou estado que indica o que o thread está fazendo. Para descrições dos valores de `State`, consulte a Seção 8.14, “Examinando informações do thread do servidor (processo”) (Informações).

A maioria dos estados corresponde a operações muito rápidas. Se um thread permanecer em um estado específico por muitos segundos, pode haver um problema que precisa ser investigado.

* `Info`

A declaração que o thread está executando, ou `NULL` se não estiver executando nenhuma declaração. A declaração pode ser a que é enviada ao servidor, ou uma declaração interna se a declaração executar outras declarações. Por exemplo, se uma declaração `CALL` executar um procedimento armazenado que está executando uma declaração `SELECT`, o valor `Info` mostra a declaração `SELECT`.

#### 13.7.5.30 Declaração de PROFILO DE EXIBIÇÃO

```sql
SHOW PROFILE [type [, type] ... ]
    [FOR QUERY n]
    [LIMIT row_count [OFFSET offset]]

type: {
    ALL
  | BLOCK IO
  | CONTEXT SWITCHES
  | CPU
  | IPC
  | MEMORY
  | PAGE FAULTS
  | SOURCE
  | SWAPS
}
```

As declarações `SHOW PROFILE` e `SHOW PROFILES` exibem informações de perfilagem que indicam o uso de recursos para declarações executadas durante o curso da sessão atual.

Nota

As declarações `SHOW PROFILE` e `SHOW PROFILES` são desaconselhadas; espere que elas sejam removidas em uma versão futura do MySQL. Use o Gerador de Desempenho em vez disso; veja a Seção 25.19.1, “Profilagem de Consulta Usando o Gerador de Desempenho”.

Para controlar o perfil, use a variável de sessão `profiling`, que tem um valor padrão de 0 (`OFF`). Ative o perfil definindo `profiling` para 1 ou `ON`:

```sql
mysql> SET profiling = 1;
```

`SHOW PROFILES` exibe uma lista das declarações mais recentes enviadas ao servidor. O tamanho da lista é controlado pela variável de sessão `profiling_history_size`, que tem um valor padrão de 15. O valor máximo é

Definir o valor em 0 tem o efeito prático de desabilitar o perfil.

Todas as declarações são perfiladas, exceto `SHOW PROFILE` e `SHOW PROFILES`, portanto nenhuma dessas declarações aparece na lista de perfilamento. As declarações malformadas são perfiladas. Por exemplo, `SHOW PROFILING` é uma declaração ilegal, e ocorre um erro de sintaxe se você tentar executá-la, mas ela aparece na lista de perfilamento.

`SHOW PROFILE` exibe informações detalhadas sobre uma única declaração. Sem a cláusula `FOR QUERY n`, a saída se refere à declaração mais recentemente executada. Se `FOR QUERY n` for incluído, `SHOW PROFILE` exibe informações para a declaração *`n`*. Os valores de *`n`* correspondem aos valores de `Query_ID` exibidos por `SHOW PROFILES`.

A cláusula `LIMIT row_count` pode ser usada para limitar a saída para *`row_count`* strings. Se `LIMIT` for fornecida, `OFFSET offset` pode ser adicionado para começar a saída *`offset`* strings no conjunto completo de strings.

Por padrão, `SHOW PROFILE` exibe as colunas `Status` e `Duration`. Os valores de `Status` são semelhantes aos dos valores de `State` exibidos por `SHOW PROCESSLIST`, embora possa haver algumas diferenças menores na interpretação das duas declarações para alguns valores de status (consulte a Seção 8.14, “Examinando Informações do Fundo do Servidor (Processo”) Informações”).

Os valores opcionais *`type`* podem ser especificados para exibir tipos específicos de informações adicionais:

* `ALL` exibe todas as informações
* `BLOCK IO` exibe contagens para operações de entrada e saída de bloco

* `CONTEXT SWITCHES` exibe contagens para alternâncias de contexto voluntárias e involuntárias

* `CPU` exibe os tempos de uso do CPU do usuário e do sistema

* `IPC` exibe contagens de mensagens enviadas e recebidas

* `MEMORY` não é implementado atualmente
* `PAGE FAULTS` exibe contagens para falhas de página principais e secundárias

* `SOURCE` exibe os nomes das funções do código-fonte, juntamente com o nome e o número da string do arquivo em que a função ocorre

* `SWAPS` exibe contagens de troca

O perfil é ativado por sessão. Quando uma sessão termina, suas informações de perfil são perdidas.

```sql
mysql> SELECT @@profiling;
+-------------+
| @@profiling |
+-------------+
|           0 |
+-------------+
1 row in set (0.00 sec)

mysql> SET profiling = 1;
Query OK, 0 rows affected (0.00 sec)

mysql> DROP TABLE IF EXISTS t1;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> CREATE TABLE T1 (id INT);
Query OK, 0 rows affected (0.01 sec)

mysql> SHOW PROFILES;
+----------+----------+--------------------------+
| Query_ID | Duration | Query                    |
+----------+----------+--------------------------+
|        0 | 0.000088 | SET PROFILING = 1        |
|        1 | 0.000136 | DROP TABLE IF EXISTS t1  |
|        2 | 0.011947 | CREATE TABLE t1 (id INT) |
+----------+----------+--------------------------+
3 rows in set (0.00 sec)

mysql> SHOW PROFILE;
+----------------------+----------+
| Status               | Duration |
+----------------------+----------+
| checking permissions | 0.000040 |
| creating table       | 0.000056 |
| After create         | 0.011363 |
| query end            | 0.000375 |
| freeing items        | 0.000089 |
| logging slow query   | 0.000019 |
| cleaning up          | 0.000005 |
+----------------------+----------+
7 rows in set (0.00 sec)

mysql> SHOW PROFILE FOR QUERY 1;
+--------------------+----------+
| Status             | Duration |
+--------------------+----------+
| query end          | 0.000107 |
| freeing items      | 0.000008 |
| logging slow query | 0.000015 |
| cleaning up        | 0.000006 |
+--------------------+----------+
4 rows in set (0.00 sec)

mysql> SHOW PROFILE CPU FOR QUERY 2;
+----------------------+----------+----------+------------+
| Status               | Duration | CPU_user | CPU_system |
+----------------------+----------+----------+------------+
| checking permissions | 0.000040 | 0.000038 |   0.000002 |
| creating table       | 0.000056 | 0.000028 |   0.000028 |
| After create         | 0.011363 | 0.000217 |   0.001571 |
| query end            | 0.000375 | 0.000013 |   0.000028 |
| freeing items        | 0.000089 | 0.000010 |   0.000014 |
| logging slow query   | 0.000019 | 0.000009 |   0.000010 |
| cleaning up          | 0.000005 | 0.000003 |   0.000002 |
+----------------------+----------+----------+------------+
7 rows in set (0.00 sec)
```

Nota

O perfilamento é apenas parcialmente funcional em algumas arquiteturas. Para valores que dependem da chamada de sistema `getrusage()`, `NULL` é retornado em sistemas como o Windows que não suportam a chamada. Além disso, o perfilamento é por processo e não por thread. Isso significa que a atividade em threads dentro do servidor que não são suas próprias pode afetar as informações de temporização que você vê.

As informações de perfilamento também estão disponíveis na tabela `INFORMATION_SCHEMA` `PROFILING`. Veja a Seção 24.3.19, “A tabela INFORMATION_SCHEMA PROFILING”. Por exemplo, as seguintes consultas são equivalentes:

```sql
SHOW PROFILE FOR QUERY 2;

SELECT STATE, FORMAT(DURATION, 6) AS DURATION
FROM INFORMATION_SCHEMA.PROFILING
WHERE QUERY_ID = 2 ORDER BY SEQ;
```

#### 13.7.5.31 Declaração de PROFILES de PROVA

```sql
SHOW PROFILES
```

A declaração `SHOW PROFILES`, juntamente com `SHOW PROFILE`, exibe informações de perfilagem que indicam o uso de recursos para declarações executadas durante o curso da sessão atual. Para mais informações, consulte a Seção 13.7.5.30, “Declaração SHOW PROFILE”.

Nota

As declarações `SHOW PROFILE` e `SHOW PROFILES` são descontinuadas; espere que elas sejam removidas em uma versão futura do MySQL. Use o Gerador de Desempenho em vez disso; veja Seção 25.19.1, “Profilagem de consulta usando o Gerador de Desempenho”.

#### 13.7.5.32 **AFIRMAÇÃO DO RELAYLOG EVENTS**

```sql
SHOW RELAYLOG EVENTS
    [IN 'log_name']
    [FROM pos]
    [LIMIT [offset,] row_count]
    [channel_option]

channel_option:
    FOR CHANNEL channel
```

Mostra os eventos no registro de retransmissão de uma réplica. Se você não especificar `'log_name'`, o primeiro registro de retransmissão é exibido. Esta declaração não tem efeito na fonte. `SHOW RELAYLOG EVENTS` requer o privilégio `REPLICATION SLAVE`.

A cláusula `LIMIT` tem a mesma sintaxe que a declaração `SELECT`. Veja a Seção 13.2.9, “Declaração SELECT”.

Nota

Emitir um `SHOW RELAYLOG EVENTS` sem a cláusula `LIMIT` pode iniciar um processo que consome muito tempo e recursos, pois o servidor retorna ao cliente o conteúdo completo do log de retransmissão (incluindo todas as declarações que modificam dados que foram recebidos pela replica).

A cláusula opcional `FOR CHANNEL channel` permite que você nomeie qual canal de replicação a declaração se aplica. Fornecer a cláusula `FOR CHANNEL channel` aplica a declaração a um canal de replicação específico. Se nenhum canal estiver nomeado e não houver canais extras, a declaração se aplica ao canal padrão.

Ao utilizar múltiplos canais de replicação, se uma declaração `SHOW RELAYLOG EVENTS` não tiver um canal definido usando uma cláusula `FOR CHANNEL channel`, um erro é gerado. Consulte a Seção 16.2.2, “Canais de Replicação”, para obter mais informações.

`SHOW RELAYLOG EVENTS` exibe os seguintes campos para cada evento no registro de relé:

* `Log_name`

O nome do arquivo que está sendo listado.

* `Pos`

A posição em que o evento ocorre.

* `Event_type`

Um identificador que descreve o tipo de evento.

* `Server_id`

O ID do servidor do servidor em que o evento se originou.

* `End_log_pos`

O valor de `End_log_pos` para este evento no log binário da fonte.

* `Info`

Mais informações detalhadas sobre o tipo de evento. O formato dessas informações depende do tipo de evento.

Nota

Alguns eventos relacionados ao estabelecimento de variáveis de usuário e sistema não estão incluídos na saída do `SHOW RELAYLOG EVENTS`. Para obter uma cobertura completa dos eventos dentro de um registro de relé, use **mysqlbinlog**.

#### 13.7.5.33 Declaração de HOSTS de SLAVE

```sql
SHOW SLAVE HOSTS
```

Exibe uma lista de réplicas atualmente registradas com a fonte.

`SHOW SLAVE HOSTS` deve ser executado em um servidor que atue como fonte de replicação. `SHOW SLAVE HOSTS` requer o privilégio `REPLICATION SLAVE`. A declaração exibe informações sobre servidores que estão ou estiveram conectados como réplicas, com cada string do resultado correspondendo a um servidor de réplica, conforme mostrado aqui:

```sql
mysql> SHOW SLAVE HOSTS;
+------------+-----------+------+-----------+--------------------------------------+
| Server_id  | Host      | Port | Master_id | Slave_UUID                           |
+------------+-----------+------+-----------+--------------------------------------+
|  192168010 | iconnect2 | 3306 | 192168011 | 14cb6624-7f93-11e0-b2c0-c80aa9429562 |
| 1921680101 | athena    | 3306 | 192168011 | 07af4990-f41f-11df-a566-7ac56fdaf645 |
+------------+-----------+------+-----------+--------------------------------------+
```

* `Server_id`: O ID único do servidor da replica, conforme configurado no arquivo de opções do servidor de replicação, ou na string de comando com `--server-id=value`.

* `Host`: O nome do host do servidor de replicação conforme especificado na replica com a opção `--report-host`. Isso pode diferir do nome da máquina conforme configurado no sistema operacional.

* `User`: O nome de usuário do servidor de replicação, conforme especificado na replicação com a opção `--report-user`. A saída da declaração inclui esta coluna apenas se o servidor de origem for iniciado com a opção `--show-slave-auth-info`.

* `Password`: A senha do servidor de replicação, conforme especificado na replicação com a opção `--report-password`. A saída da declaração inclui esta coluna apenas se o servidor de origem for iniciado com a opção `--show-slave-auth-info`.

* `Port`: O porto da fonte para a qual o servidor de replicação está ouvindo, conforme especificado na replica com a opção `--report-port`.

Um zero nesta coluna significa que o porto de replicação (`--report-port`) não foi definido.

* `Master_id`: O ID único do servidor de origem que a replicação do servidor está replicando. Este é o ID do servidor em que o `SHOW SLAVE HOSTS` é executado, portanto, este mesmo valor é listado para cada string no resultado.

* `Slave_UUID`: O ID globalmente único desta réplica, conforme gerado na réplica e encontrado no arquivo `auto.cnf` da réplica.

#### 13.7.5.34 Declaração de Estado de Escravo

```sql
SHOW SLAVE STATUS [FOR CHANNEL channel]
```

Essa declaração fornece informações sobre o status dos parâmetros essenciais dos threads replicados. Requer o privilégio `SUPER` ou `REPLICATION CLIENT`.

Se você emitir essa declaração usando o cliente **mysql**, pode usar um `\G` como terminador de declaração em vez de um ponto e vírgula para obter um layout vertical mais legível:

```sql
mysql> SHOW SLAVE STATUS\G
*************************** 1. row ***************************
               Slave_IO_State: Waiting for master to send event
                  Master_Host: localhost
                  Master_User: repl
                  Master_Port: 13000
                Connect_Retry: 60
              Master_Log_File: source-bin.000002
          Read_Master_Log_Pos: 1307
               Relay_Log_File: replica-relay-bin.000003
                Relay_Log_Pos: 1508
        Relay_Master_Log_File: source-bin.000002
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes
              Replicate_Do_DB:
          Replicate_Ignore_DB:
           Replicate_Do_Table:
       Replicate_Ignore_Table:
      Replicate_Wild_Do_Table:
  Replicate_Wild_Ignore_Table:
                   Last_Errno: 0
                   Last_Error:
                 Skip_Counter: 0
          Exec_Master_Log_Pos: 1307
              Relay_Log_Space: 1858
              Until_Condition: None
               Until_Log_File:
                Until_Log_Pos: 0
           Master_SSL_Allowed: No
           Master_SSL_CA_File:
           Master_SSL_CA_Path:
              Master_SSL_Cert:
            Master_SSL_Cipher:
               Master_SSL_Key:
        Seconds_Behind_Master: 0
Master_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error:
               Last_SQL_Errno: 0
               Last_SQL_Error:
  Replicate_Ignore_Server_Ids:
             Master_Server_Id: 1
                  Master_UUID: 3e11fa47-71ca-11e1-9e33-c80aa9429562
             Master_Info_File: /var/mysqld.2/data/master.info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
      Slave_SQL_Running_State: Reading event from the relay log
           Master_Retry_Count: 10
                  Master_Bind:
      Last_IO_Error_Timestamp:
     Last_SQL_Error_Timestamp:
               Master_SSL_Crl:
           Master_SSL_Crlpath:
           Retrieved_Gtid_Set: 3e11fa47-71ca-11e1-9e33-c80aa9429562:1-5
            Executed_Gtid_Set: 3e11fa47-71ca-11e1-9e33-c80aa9429562:1-5
                Auto_Position: 1
         Replicate_Rewrite_DB:
                 Channel_name:
           Master_TLS_Version: TLSv1.2
```

O Schema de Desempenho fornece tabelas que exibem informações de replicação. Isso é semelhante às informações disponíveis a partir da declaração `SHOW SLAVE STATUS`, mas representadas em formato de tabela. Para detalhes, consulte a Seção 25.12.11, “Tabelas de Replicação do Schema de Desempenho”.

A lista a seguir descreve os campos retornados por `SHOW SLAVE STATUS`. Para informações adicionais sobre a interpretação de seus significados, consulte a Seção 16.1.7.1, “Verificação do Status de Replicação”.

* `Slave_IO_State`

Uma cópia do campo `State` do `SHOW PROCESSLIST` de saída para o thread de I/O de replicação. Isso lhe diz o que o thread está fazendo: tentando se conectar à fonte, esperando eventos da fonte, reconectando-se à fonte, e assim por diante. Para uma lista de estados possíveis, consulte a Seção 8.14.6, “Estados de Replicação de I/O de Replicação”.

* `Master_Host`

O host de origem ao qual a replica está conectada.

* `Master_User`

O nome de usuário da conta usada para se conectar à fonte.

* `Master_Port`

O porto costumava se conectar à fonte.

* `Connect_Retry`

O número de segundos entre as tentativas de reconexão (padrão 60). Isso pode ser definido com a declaração `CHANGE MASTER TO`.

* `Master_Log_File`

O nome do arquivo binário de registro de origem do qual a thread de E/S está atualmente lendo.

* `Read_Master_Log_Pos`

A posição no arquivo de registro binário de origem atual até a qual a thread de E/S leu.

* `Relay_Log_File`

O nome do arquivo de registro do relé do qual o thread SQL está atualmente lendo e executando.

* `Relay_Log_Pos`

A posição no arquivo de registro atual do relé até a qual o thread SQL leu e executou.

* `Relay_Master_Log_File`

O nome do arquivo de log binário de origem que contém o evento mais recente executado pelo thread SQL.

* `Slave_IO_Running`

Se a thread de E/S foi iniciada e se conectou com sucesso à fonte. Internamente, o estado dessa thread é representado por um dos seguintes três valores:

+ **MYSQL\_SLAVE\_NOT\_RUN.** A thread de I/O da replica não está em execução. Para este estado, `Slave_IO_Running` é `No`.

+ **MYSQL\_SLAVE\_RUN\_NOT\_CONNECT.** A thread de I/O da replica está em execução, mas não está conectada a uma fonte de replicação. Para este estado, `Slave_IO_Running` é `Connecting`.

+ **MYSQL\_SLAVE\_RUN\_CONNECT.** A thread de I/O da replica está em execução e está conectada a uma fonte de replicação. Para este estado, `Slave_IO_Running` é `Yes`.

O valor da variável de status do sistema `Slave_running` corresponde a este valor.

* `Slave_SQL_Running`

Se o thread SQL foi iniciado.

* `Replicate_Do_DB`, `Replicate_Ignore_DB`

As listas de bancos de dados que foram especificadas com as opções `--replicate-do-db` e `--replicate-ignore-db`, se houver.

* `Replicate_Do_Table`, `Replicate_Ignore_Table`, `Replicate_Wild_Do_Table`, `Replicate_Wild_Ignore_Table`

As listas de tabelas que foram especificadas com as opções `--replicate-do-table`, `--replicate-ignore-table`, `--replicate-wild-do-table` e `--replicate-wild-ignore-table`, se houver.

* `Last_Errno`, `Last_Error`

Essas colunas são aliases para `Last_SQL_Errno` e `Last_SQL_Error`.

A emissão de `RESET MASTER` ou `RESET SLAVE` redefinirá os valores mostrados nessas colunas.

Nota

Quando o thread de replicação SQL recebe um erro, ele reporta o erro primeiro e, em seguida, para o thread SQL. Isso significa que há uma pequena janela de tempo durante a qual `SHOW SLAVE STATUS` mostra um valor não nulo para `Last_SQL_Errno`, embora `Slave_SQL_Running` ainda mostre `Yes`.

* `Skip_Counter`

O valor atual da variável de sistema `sql_slave_skip_counter`. Veja a Seção 13.4.2.4, “Sintaxe de SET GLOBAL sql_slave_skip_counter”.

* `Exec_Master_Log_Pos`

A posição no arquivo de log binário de origem para a qual o thread SQL leu e executou, marcando o início da próxima transação ou evento a ser processado. Você pode usar esse valor com a opção `MASTER_LOG_POS` da declaração `CHANGE MASTER TO` ao iniciar uma nova replica a partir de uma replica existente, para que a nova replica leia a partir desse ponto. As coordenadas fornecidas por (`Relay_Master_Log_File`, `Exec_Master_Log_Pos`) no log binário da fonte correspondem às coordenadas fornecidas por (`Relay_Log_File`, `Relay_Log_Pos`) no log de relevo.

Inconsistências na sequência de transações do log de relevo que foram executadas podem fazer com que esse valor seja uma “marca de baixa água”. Em outras palavras, as transações que aparecem antes da posição são garantidas como tendo sido comprometidas, mas as transações após a posição podem ter sido comprometidas ou não. Se essas lacunas precisam ser corrigidas, use `START SLAVE UNTIL SQL_AFTER_MTS_GAPS`. Veja a Seção 16.4.1.32, “Replicação e Inconsistências de Transações” para mais informações.

* `Relay_Log_Space`

O tamanho total combinado de todos os arquivos de registro de relé existentes.

* `Until_Condition`, `Until_Log_File`, `Until_Log_Pos`

Os valores especificados na cláusula `UNTIL` da declaração `START SLAVE`.

`Until_Condition` tem esses valores:

+ `None` se não foi especificada nenhuma cláusula `UNTIL`

+ `Master` se a replica estiver lendo até uma posição dada no log binário da fonte

+ `Relay` se a replica estiver lendo até uma posição dada em seu log de relé

+ `SQL_BEFORE_GTIDS` se o thread de replicação SQL estiver processando transações até atingir a primeira transação cujo GTID está listado no `gtid_set`.

+ `SQL_AFTER_GTIDS` se as threads da replica estão processando todas as transações até que a última transação no `gtid_set` tenha sido processada por ambas as threads.

+ `SQL_AFTER_MTS_GAPS` se os threads SQL de uma replica multithread estiverem em execução até que mais lacunas não sejam encontradas no log de relevo.

`Until_Log_File` e `Until_Log_Pos` indicam o nome e a posição do arquivo de registro que definem as coordenadas em que o thread SQL para de execução.

Para mais informações sobre as cláusulas de `UNTIL`, consulte a Seção 13.4.2.5, “Declaração START SLAVE”.

* `Master_SSL_Allowed`, `Master_SSL_CA_File`, `Master_SSL_CA_Path`, `Master_SSL_Cert`, `Master_SSL_Cipher`, `Master_SSL_CRL_File`, `Master_SSL_CRL_Path`, `Master_SSL_Key`, `Master_SSL_Verify_Server_Cert`

Esses campos mostram os parâmetros SSL usados pela replica para se conectar à fonte, se houver.

`Master_SSL_Allowed` tem esses valores:

+ `Yes` se uma conexão SSL com a fonte for permitida

+ `No` se uma conexão SSL com a fonte não for permitida

+ `Ignored` se uma conexão SSL for permitida, mas o servidor replica não tiver o suporte SSL habilitado

Os valores dos outros campos relacionados ao SSL correspondem aos valores das opções `MASTER_SSL_CA`, `MASTER_SSL_CAPATH`, `MASTER_SSL_CERT`, `MASTER_SSL_CIPHER`, `MASTER_SSL_CRL`, `MASTER_SSL_CRLPATH`, `MASTER_SSL_KEY` e `MASTER_SSL_VERIFY_SERVER_CERT` para a declaração `CHANGE MASTER TO`. Ver Seção 13.4.2.1, “Declaração CHANGE MASTER TO”.

* `Seconds_Behind_Master`

Este campo indica quão "tarde" a réplica é:

+ Quando a réplica está processando ativamente as atualizações, este campo mostra a diferença entre o timestamp atual na réplica e o timestamp original registrado na fonte para o evento que está sendo processado na réplica.

+ Quando nenhum evento está sendo processado na replica, esse valor é 0.

Em essência, este campo mede a diferença de tempo em segundos entre o thread de SQL replica e o thread de I/O replica. Se a conexão de rede entre a fonte e a replica for rápida, o thread de I/O replica está muito próximo da fonte, então este campo é uma boa aproximação de quão atrasado o thread de SQL replica está em comparação com a fonte. Se a rede for lenta, isso *não* é uma boa aproximação; o thread de SQL replica pode muitas vezes estar atualizado com o thread de I/O replica que lê lentamente, então `Seconds_Behind_Master` geralmente mostra um valor de 0, mesmo que o thread de I/O esteja atrasado em comparação com a fonte. Em outras palavras, *esta coluna é útil apenas para redes rápidas*.

Essa computação da diferença de tempo funciona mesmo se a fonte e a réplica não tiverem tempos de relógio idênticos, desde que a diferença, calculada quando a thread de E/S da réplica começa, permaneça constante a partir daí. Quaisquer alterações, incluindo atualizações do NTP, podem levar a desalinhamentos de relógio que podem tornar o cálculo do `Seconds_Behind_Master` menos confiável.

No MySQL 5.7, este campo é `NULL` (definido como indefinido ou desconhecido) se o SQL do thread da replica não estiver em execução ou se o SQL do thread estiver consumindo todo o log de releio e o thread de I/O da replica não estiver em execução. (Em versões mais antigas do MySQL, este campo era `NULL` se o SQL do thread da replica ou o thread de I/O da replica não estivesse em execução ou não estivesse conectado à fonte.) Se o thread de I/O estiver em execução, mas o log de releio estiver esgotado, `Seconds_Behind_Master` é definido como 0.

O valor de `Seconds_Behind_Master` é baseado nos timestamps armazenados nos eventos, que são preservados através da replicação. Isso significa que, se uma fonte M1 é ela própria uma réplica de M0, qualquer evento do log binário de M1 que tenha origem no log binário de M0 terá o timestamp de M0 para esse evento. Isso permite que o MySQL replique `TIMESTAMP` com sucesso. No entanto, o problema para `Seconds_Behind_Master` é que, se M1 também receber atualizações diretas dos clientes, o valor de `Seconds_Behind_Master` flutua aleatoriamente porque, às vezes, o último evento de M1 tem origem em M0 e, outras vezes, é o resultado de uma atualização direta em M1.

Ao usar uma replica multithread, você deve ter em mente que esse valor é baseado em `Exec_Master_Log_Pos`, e, portanto, pode não refletir a posição da transação mais recentemente comprometida.

* `Last_IO_Errno`, `Last_IO_Error`

O número do erro e a mensagem de erro do erro mais recente que fez com que o thread de I/O parasse. Um número de erro de 0 e uma mensagem de string vazia significam “sem erro”. Se o valor `Last_IO_Error` não estiver vazio, os valores de erro também aparecem no log de erro da replica.

As informações sobre erros de E/S incluem um timestamp que mostra quando o erro mais recente da thread de E/S ocorreu. Esse timestamp usa o formato *`YYMMDD hh:mm:ss`*, e aparece na coluna `Last_IO_Error_Timestamp`.

A emissão de `RESET MASTER` ou `RESET SLAVE` redefinirá os valores mostrados nessas colunas.

* `Last_SQL_Errno`, `Last_SQL_Error`

O número do erro e a mensagem de erro do erro mais recente que causou o término do thread SQL. Um número de erro de 0 e uma mensagem de string vazia significam “sem erro”. Se o valor `Last_SQL_Error` não estiver vazio, os valores de erro também aparecem no log de erro da replica.

Se a replica for multithreading, o thread SQL é o coordenador para os threads de trabalho. Neste caso, o campo `Last_SQL_Error` mostra exatamente o que a coluna `Last_Error_Message` na tabela do Gerador de Desempenho `replication_applier_status_by_coordinator` mostra. O valor do campo é modificado para sugerir que pode haver mais falhas nos outros threads de trabalho, que podem ser vistos na tabela `replication_applier_status_by_worker` que mostra o status de cada thread de trabalho. Se essa tabela não estiver disponível, o log de erro da replica pode ser usado. O log ou a tabela `replication_applier_status_by_worker` também deve ser usado para saber mais sobre a falha mostrada por `SHOW SLAVE STATUS` ou a tabela do coordenador.

As informações sobre erros SQL incluem um timestamp que mostra quando o erro mais recente do thread SQL ocorreu. Esse timestamp usa o formato *`YYMMDD hh:mm:ss`*, e aparece na coluna `Last_SQL_Error_Timestamp`.

A emissão de `RESET MASTER` ou `RESET SLAVE` redefinirá os valores mostrados nessas colunas.

Em MySQL 5.7, todos os códigos e mensagens de erro exibidos nas colunas `Last_SQL_Errno` e `Last_SQL_Error` correspondem aos valores de erro listados na Referência de Mensagem de Erro do Servidor. Isso não era sempre verdade nas versões anteriores. (Bug #11760365, Bug #52768)

* `Replicate_Ignore_Server_Ids`

Em MySQL 5.7, você define uma replica para ignorar eventos de 0 ou mais fontes usando a opção `IGNORE_SERVER_IDS` da declaração `CHANGE MASTER TO`. Por padrão, essa opção está em branco e geralmente é modificada apenas quando se usa uma configuração de replicação circular ou outra multifonte. A mensagem exibida para `Replicate_Ignore_Server_Ids` quando não está em branco consiste em uma lista delimitada por vírgula de um ou mais números, indicando os IDs do servidor a serem ignorados. Por exemplo:

  ```sql
  	Replicate_Ignore_Server_Ids: 2, 6, 9
  ```

Nota

`Ignored_server_ids` também mostra os IDs dos servidores a serem ignorados, mas é uma lista delimitada por espaços, que é precedida pelo número total de IDs dos servidores a serem ignorados. Por exemplo, se uma declaração `CHANGE MASTER TO` contendo a opção `IGNORE_SERVER_IDS = (2,6,9)` tiver sido emitida para dizer a uma réplica que ignore fontes com o ID do servidor 2, 6 ou 9, essa informação aparece conforme mostrado aqui:

  ```sql
  	Ignored_server_ids: 3, 2, 6, 9
  ```

O primeiro número (neste caso `3`) mostra o número de IDs de servidor que estão sendo ignorados.

O filtro `Replicate_Ignore_Server_Ids` é realizado pela thread de E/S, e não pela thread SQL, o que significa que os eventos que são filtrados não são escritos no log do relé. Isso difere das ações de filtragem realizadas por opções do servidor, como `--replicate-do-table`, que se aplicam à thread SQL.

* `Master_Server_Id`

O valor `server_id` da fonte.

* `Master_UUID`

O valor `server_uuid` da fonte.

* `Master_Info_File`

A localização do arquivo `master.info`.

* `SQL_Delay`

O número de segundos que a réplica deve ficar em atraso em relação à fonte.

* `SQL_Remaining_Delay`

Quando `Slave_SQL_Running_State` é `Waiting until MASTER_DELAY seconds after master executed event`, este campo contém o número de segundos de atraso restantes. Em outros momentos, este campo é `NULL`.

* `Slave_SQL_Running_State`

O estado do thread de SQL (análogo a `Slave_IO_State`). O valor é idêntico ao valor do `State` do thread de SQL, conforme exibido por `SHOW PROCESSLIST`. A Seção 8.14.7, “Estados de Replicação do Thread de SQL”, fornece uma lista dos possíveis estados

* `Master_Retry_Count`

O número de vezes que a réplica pode tentar se reconectar à fonte no caso de uma conexão perdida. Esse valor pode ser definido usando a opção `MASTER_RETRY_COUNT` da declaração `CHANGE MASTER TO` (preferida) ou a opção de servidor mais antiga `--master-retry-count` (ainda compatível com versões anteriores).

* `Master_Bind`

A interface de rede à qual a réplica está vinculada, se houver. Isso é definido usando a opção `MASTER_BIND` para a declaração `CHANGE MASTER TO`.

* `Last_IO_Error_Timestamp`

Um marcador de tempo no formato *`YYMMDD hh:mm:ss`* que mostra quando ocorreu a última falha de E/S.

* `Last_SQL_Error_Timestamp`

Um marcador de tempo no formato *`YYMMDD hh:mm:ss`* que mostra quando ocorreu o erro SQL mais recente.

* `Retrieved_Gtid_Set`

O conjunto de IDs de transação global correspondente a todas as transações recebidas por esta réplica. Vazio se os GTIDs não estiverem em uso. Consulte Conjuntos de GTIDs para obter mais informações.

Este é o conjunto de todos os GTIDs que existem ou existiram nos registros do relé. Cada GTID é adicionado assim que o `Gtid_log_event` é recebido. Isso pode fazer com que as transações parcialmente transmitidas tenham seus GTIDs incluídos no conjunto.

Quando todos os registros de relé são perdidos devido à execução de `RESET SLAVE` ou `CHANGE MASTER TO`, ou devido aos efeitos da opção `--relay-log-recovery`, o conjunto é limpo. Quando `relay_log_purge = 1`, o registro mais recente do relé é sempre mantido e o conjunto não é limpo.

* `Executed_Gtid_Set`

O conjunto de IDs de transação global escritos no log binário. Isso é o mesmo que o valor para a variável de sistema global `gtid_executed` neste servidor, bem como o valor para `Executed_Gtid_Set` na saída de `SHOW MASTER STATUS` neste servidor. Vazio se os GTIDs não estiverem em uso. Consulte Conjuntos de GTIDs para obter mais informações.

* `Auto_Position`

1 se o autoposicionamento estiver em uso; caso contrário, 0.

* `Replicate_Rewrite_DB`

O valor `Replicate_Rewrite_DB` exibe todas as regras de filtragem de replicação que foram especificadas. Por exemplo, se a seguinte regra de filtro de replicação foi definida:

  ```sql
  CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB=((db1,db2), (db3,db4));
  ```

o valor `Replicate_Rewrite_DB` exibe:

  ```sql
  Replicate_Rewrite_DB: (db1,db2),(db3,db4)
  ```

Para mais informações, consulte a Seção 13.4.2.2, “Declaração de REPLICAÇÃO DE CAMADA DE MUDANÇA”.

* `Channel_name`

O canal de replicação que está sendo exibido. Sempre há um canal de replicação padrão, e mais canais de replicação podem ser adicionados. Consulte a Seção 16.2.2, “Canais de replicação”, para obter mais informações.

* `Master_TLS_Version`

A versão TLS utilizada na fonte. Para informações sobre a versão TLS, consulte a Seção 6.3.2, “Protocolos e cifras de conexão criptografada TLS”. Esta coluna foi adicionada no MySQL 5.7.10.

#### 13.7.5.35 Declaração de Estado de Situação

```sql
SHOW [GLOBAL | SESSION] STATUS
    [LIKE 'pattern' | WHERE expr]
```

Nota

O valor da variável de sistema `show_compatibility_56` afeta as informações disponíveis e os privilégios necessários para a declaração descrita aqui. Para obter detalhes, consulte a descrição dessa variável na Seção 5.1.7, “Variáveis do sistema do servidor”.

`SHOW STATUS` fornece informações sobre o status do servidor (consulte a Seção 5.1.9, “Variáveis de Status do Servidor”). Esta declaração não requer privilégio algum. Ela exige apenas a capacidade de se conectar ao servidor.

Informações de status variáveis também estão disponíveis nessas fontes:

* Tabelas do Schema de desempenho. Veja a Seção 25.12.14, “Tabelas de variáveis de status do Schema de desempenho”.

* As tabelas `GLOBAL_STATUS` e `SESSION_STATUS`. Veja a Seção 24.3.10, “As tabelas INFORMATION_SCHEMA GLOBAL_STATUS e SESSION_STATUS”.

* O comando **mysqladmin status-extendido**. Veja a Seção 4.5.2, “mysqladmin — Um programa de administração do servidor MySQL”.

Para `SHOW STATUS`, uma cláusula `LIKE`, se presente, indica quais nomes de variáveis devem ser correspondidos. Uma cláusula `WHERE` pode ser dada para selecionar strings usando condições mais gerais, conforme discutido na Seção 24.8, “Extensões para Declarações SHOW”.

`SHOW STATUS` aceita um modificador opcional de escopo da variável `GLOBAL` ou `SESSION`:

* Com o modificador `GLOBAL`, a declaração exibe os valores de status global. Uma variável de status global pode representar o status de algum aspecto do próprio servidor (por exemplo, `Aborted_connects`,) ou o status agregado sobre todas as conexões ao MySQL (por exemplo, `Bytes_received` e `Bytes_sent`). Se uma variável não tiver um valor global, o valor da sessão é exibido.

* Com o modificador `SESSION`, a declaração exibe os valores das variáveis de status para a conexão atual. Se uma variável não tiver um valor de sessão, o valor global é exibido. `LOCAL` é sinônimo de `SESSION`.

* Se não houver nenhum modificador, o padrão é `SESSION`.

O escopo de cada variável de status é listado na Seção 5.1.9, “Variáveis de Status do Servidor”.

Cada invocação da declaração `SHOW STATUS` utiliza uma tabela temporária interna e incrementa o valor global `Created_tmp_tables`.

Aqui, é mostrado um resultado parcial. A lista de nomes e valores pode diferir para o seu servidor. O significado de cada variável é dado na Seção 5.1.9, “Variáveis de Status do Servidor”.

```sql
mysql> SHOW STATUS;
+--------------------------+------------+
| Variable_name            | Value      |
+--------------------------+------------+
| Aborted_clients          | 0          |
| Aborted_connects         | 0          |
| Bytes_received           | 155372598  |
| Bytes_sent               | 1176560426 |
| Connections              | 30023      |
| Created_tmp_disk_tables  | 0          |
| Created_tmp_tables       | 8340       |
| Created_tmp_files        | 60         |
...
| Open_tables              | 1          |
| Open_files               | 2          |
| Open_streams             | 0          |
| Opened_tables            | 44600      |
| Questions                | 2026873    |
...
| Table_locks_immediate    | 1920382    |
| Table_locks_waited       | 0          |
| Threads_cached           | 0          |
| Threads_created          | 30022      |
| Threads_connected        | 1          |
| Threads_running          | 1          |
| Uptime                   | 80380      |
+--------------------------+------------+
```

Com uma cláusula `LIKE`, a declaração exibe apenas as strings para aquelas variáveis com nomes que correspondem ao padrão:

```sql
mysql> SHOW STATUS LIKE 'Key%';
+--------------------+----------+
| Variable_name      | Value    |
+--------------------+----------+
| Key_blocks_used    | 14955    |
| Key_read_requests  | 96854827 |
| Key_reads          | 162040   |
| Key_write_requests | 7589728  |
| Key_writes         | 3813196  |
+--------------------+----------+
```

#### 13.7.5.36 Declaração de Status da Tabela SHOW

```sql
SHOW TABLE STATUS
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

`SHOW TABLE STATUS` funciona como `SHOW TABLES`, mas fornece uma grande quantidade de informações sobre cada tabela que não é `TEMPORARY`. Você também pode obter essa lista usando o comando **mysqlshow --status *`db_name`***. A cláusula `LIKE`, se presente, indica quais nomes de tabela devem ser correspondidos. A cláusula `WHERE` pode ser usada para selecionar strings com condições mais gerais, conforme discutido na Seção 24.8, “Extensões para Declarações SHOW”.

Essa declaração também exibe informações sobre visualizações.

A saída `SHOW TABLE STATUS` tem essas colunas:

* `Name`

O nome da tabela.

* `Engine`

O mecanismo de armazenamento para a tabela. Veja o Capítulo 14, *O mecanismo de armazenamento InnoDB*, e o Capítulo 15, *Mecanismos de armazenamento alternativos*.

Para tabelas particionadas, `Engine` mostra o nome do motor de armazenamento usado por todas as partições.

* `Version`

O número da versão do arquivo `.frm` da tabela.

* `Row_format`

O formato de armazenamento em string (`Fixed`, `Dynamic`, `Compressed`, `Redundant`, `Compact`). Para as tabelas `MyISAM`, `Dynamic` corresponde ao que o **myisamchk -dvv** reporta como `Packed`. O formato da tabela `InnoDB` é `Redundant` ou `Compact` ao usar o formato de arquivo `Antelope`, ou `Compressed` ou `Dynamic` ao usar o formato de arquivo `Barracuda`.

* `Rows`

O número de strings. Algumas engines de armazenamento, como `MyISAM`, armazenam o contagem exata. Para outras engines de armazenamento, como `InnoDB`, esse valor é uma aproximação e pode variar do valor real em até 40% a 50%. Nesses casos, use `SELECT COUNT(*)` para obter uma contagem precisa.

O valor `Rows` é `NULL` para as tabelas `INFORMATION_SCHEMA`.

Para as tabelas `InnoDB`, o número de strings é apenas uma estimativa grosseira usada na otimização do SQL. (Isso também é verdadeiro se a tabela `InnoDB` estiver particionada.)

* `Avg_row_length`

O comprimento médio da string.

Consulte as notas no final desta seção para informações relacionadas.

* `Data_length`

Para `MyISAM`, `Data_length` é o comprimento do arquivo de dados, em bytes.

Para `InnoDB`, `Data_length` é a quantidade aproximada de espaço alocada para o índice agrupado, em bytes. Especificamente, é o tamanho do índice agrupado, em páginas, multiplicado pelo tamanho da página `InnoDB`.

Consulte as notas no final desta seção para obter informações sobre outros motores de armazenamento.

* `Max_data_length`

Para `MyISAM`, `Max_data_length` é o comprimento máximo do arquivo de dados. Este é o número total de bytes de dados que podem ser armazenados na tabela, dado o tamanho do ponteiro de dados utilizado.

Não utilizada para `InnoDB`.

Consulte as notas no final desta seção para obter informações sobre outros motores de armazenamento.

* `Index_length`

Para `MyISAM`, `Index_length` é o comprimento do arquivo de índice, em bytes.

Para `InnoDB`, `Index_length` é a quantidade aproximada de espaço alocada para índices não agrupados, em bytes. Especificamente, é a soma dos tamanhos dos índices não agrupados, em páginas, multiplicada pelo tamanho da página `InnoDB`.

Consulte as notas no final desta seção para obter informações sobre outros motores de armazenamento.

* `Data_free`

O número de bytes alocados, mas não utilizados.

As tabelas `InnoDB` relatam o espaço livre do espaço de tabelas ao qual a tabela pertence. Para uma tabela localizada no espaço de tabelas compartilhado, este é o espaço livre do espaço de tabelas compartilhado. Se você estiver usando vários espaços de tabelas e a tabela tenha seu próprio espaço de tabelas, o espaço livre é apenas para essa tabela. Espaço livre significa o número de bytes em extensões completamente livres, menos uma margem de segurança. Mesmo que o espaço livre seja exibido como 0, é possível inserir strings, desde que novas extensões não precisem ser alocadas.

Para o NDB Cluster, `Data_free` mostra o espaço alocado em disco para, mas não utilizado por, uma tabela ou fragmento de dados de disco. (O uso do recurso de dados em memória é relatado pela coluna `Data_length`.

Para tabelas particionadas, esse valor é apenas uma estimativa e pode não ser absolutamente correto. Um método mais preciso de obter essas informações, nesses casos, é consultar a tabela `INFORMATION_SCHEMA` `PARTITIONS`, conforme mostrado neste exemplo:

  ```sql
  SELECT SUM(DATA_FREE)
      FROM  INFORMATION_SCHEMA.PARTITIONS
      WHERE TABLE_SCHEMA = 'mydb'
      AND   TABLE_NAME   = 'mytable';
  ```

Para mais informações, consulte a Seção 24.3.16, “A tabela de PARTITIONS do INFORMATION\_SCHEMA”.

* `Auto_increment`

O próximo valor `AUTO_INCREMENT`.

* `Create_time`

Quando a tabela foi criada.

* `Update_time`

Quando o arquivo de dados foi atualizado pela última vez. Para alguns motores de armazenamento, este valor é `NULL`. Por exemplo, `InnoDB` armazena várias tabelas em seu espaço de tabela de sistema e o timestamp do arquivo de dados não se aplica. Mesmo com o modo de arquivo por tabela, com cada tabela `InnoDB` em um arquivo `.ibd` separado, a mudança de buffer pode atrasar a escrita no arquivo de dados, então o tempo de modificação do arquivo é diferente do momento da última inserção, atualização ou exclusão. Para `MyISAM`, o timestamp do arquivo de dados é usado; no entanto, no Windows, o timestamp não é atualizado por atualizações, então o valor é impreciso.

`Update_time` exibe um valor de marca-horário para a última tabela `UPDATE`, `INSERT` ou `DELETE` realizada em tabelas `InnoDB` que não estão particionadas. Para MVCC, o valor do marca-horário reflete o tempo de `COMMIT`, que é considerado o último horário de atualização. Os marca-horários não são persistidos quando o servidor é reiniciado ou quando a tabela é ejetada do cache do dicionário de dados `InnoDB`.

A coluna `Update_time` também exibe essas informações para tabelas particionadas `InnoDB`.

* `Check_time`

Quando a tabela foi verificada pela última vez. Nem todos os motores de armazenamento são atualizados dessa vez, no caso, o valor é sempre `NULL`.

Para tabelas `InnoDB` particionadas, `Check_time` é sempre `NULL`.

* `Collation`

A tabela de collation padrão. A saída não lista explicitamente o conjunto de caracteres padrão da tabela, mas o nome da collation começa com o nome do conjunto de caracteres.

* `Checksum`

O valor do checksum ao vivo, se houver.

* `Create_options`

Opções extras usadas com `CREATE TABLE`.

`Create_options` mostra `partitioned` para uma tabela particionada.

`Create_options` mostra a opção `ENCRYPTION` especificada ao criar ou alterar um espaço de tabela por tabela.

Ao criar uma tabela com o modo estrito desativado, o formato de string padrão do mecanismo de armazenamento é usado se o formato de string especificado não for suportado. O formato de string real da tabela é relatado na coluna `Row_format`. `Create_options` mostra o formato de string que foi especificado na declaração `CREATE TABLE`.

Ao alterar o motor de armazenamento de uma tabela, as opções da tabela que não são aplicáveis ao novo motor de armazenamento são mantidas na definição da tabela para permitir a reversão da tabela com suas opções previamente definidas para o motor de armazenamento original, se necessário. `Create_options` pode mostrar opções retidas.

* `Comment`

O comentário usado ao criar a tabela (ou informações sobre o motivo pelo qual o MySQL não conseguiu acessar as informações da tabela).

##### Notas

* Para as tabelas `InnoDB`, `SHOW TABLE STATUS` não fornece estatísticas precisas, exceto pelo tamanho físico reservado pela tabela. O número de strings é apenas uma estimativa grosseira usada na otimização do SQL.

* Para as tabelas `NDB`, a saída desta declaração mostra valores apropriados para as colunas `Avg_row_length` e `Data_length`, com exceção de que as colunas `BLOB` não são consideradas.

* Para as tabelas `NDB`, `Data_length` inclui dados armazenados apenas na memória principal; as colunas `Max_data_length` e `Data_free` se aplicam aos dados em disco.

* Para as tabelas de dados de disco do NDB Cluster, `Max_data_length` mostra o espaço alocado para a parte de disco de uma tabela ou fragmento de dados de disco. (O uso do recurso de dados em memória é relatado pela coluna `Data_length`.)

* Para as tabelas `MEMORY`, os valores `Data_length`, `Max_data_length` e `Index_length` aproximam o valor real da memória alocada. O algoritmo de alocação reserva memória em grandes quantidades para reduzir o número de operações de alocação.

* Para visualizações, todas as colunas exibidas por `SHOW TABLE STATUS` são `NULL`, exceto que `Name` indica o nome da visualização e `Comment` diz `VIEW`.

As informações da tabela também estão disponíveis na tabela `INFORMATION_SCHEMA` `TABLES`. Veja a Seção 24.3.25, “A tabela TABLES do INFORMATION_SCHEMA”.

#### 13.7.5.37 Declaração SHOW TABLES

```sql
SHOW [FULL] TABLES
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

`SHOW TABLES` lista as tabelas não `TEMPORARY` em um banco de dados dado. Você também pode obter essa lista usando o comando **mysqlshow *`db_name`***. A cláusula `LIKE`, se presente, indica quais nomes de tabela devem ser correspondidos. A cláusula `WHERE` pode ser dada para selecionar strings usando condições mais gerais, conforme discutido na Seção 24.8, “Extensões para Declarações SHOW”.

A correspondência realizada pela cláusula `LIKE` depende da configuração da variável de sistema `lower_case_table_names`.

Essa declaração também lista quaisquer visões no banco de dados. O modificador opcional `FULL` faz com que `SHOW TABLES` exiba uma segunda coluna de saída com valores de `BASE TABLE` para uma tabela, `VIEW` para uma visão ou `SYSTEM VIEW` para uma tabela `INFORMATION_SCHEMA`.

Se você não tiver privilégios para uma tabela ou visão base, ela não aparecerá na saída do `SHOW TABLES` ou **mysqlshow db_name**.

As informações da tabela também estão disponíveis na tabela `INFORMATION_SCHEMA` `TABLES`. Veja a Seção 24.3.25, “A tabela TABLES do INFORMATION_SCHEMA”.

#### 13.7.5.38 Declaração de TRIGGERS SHOW

```sql
SHOW TRIGGERS
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

`SHOW TRIGGERS` lista os gatilhos atualmente definidos para tabelas em um banco de dados (o banco de dados padrão, a menos que uma cláusula `FROM` seja dada). Esta declaração retorna resultados apenas para bancos e tabelas para as quais você tem o privilégio `TRIGGER`. A cláusula `LIKE`, se presente, indica quais nomes de tabelas (não nomes de gatilho) devem ser correspondidos e faz com que a declaração exiba gatilhos para essas tabelas. A cláusula `WHERE` pode ser dada para selecionar strings usando condições mais gerais, conforme discutido na Seção 24.8, “Extensões para Declarações SHOW”.

Para o gatilho `ins_sum` definido na Seção 23.3, “Usando gatilhos”, a saída do `SHOW TRIGGERS` é conforme mostrado aqui:

```sql
mysql> SHOW TRIGGERS LIKE 'acc%'\G
*************************** 1. row ***************************
             Trigger: ins_sum
               Event: INSERT
               Table: account
           Statement: SET @sum = @sum + NEW.amount
              Timing: BEFORE
             Created: 2018-08-08 10:10:12.61
            sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                      NO_ZERO_IN_DATE,NO_ZERO_DATE,
                      ERROR_FOR_DIVISION_BY_ZERO,
                      NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
             Definer: me@localhost
character_set_client: utf8
collation_connection: utf8_general_ci
  Database Collation: latin1_swedish_ci
```

A saída `SHOW TRIGGERS` tem essas colunas:

* `Trigger`

O nome do gatilho.

* `Event`

O evento desencadeador. Este é o tipo de operação na tabela associada para a qual o gatilho é ativado. O valor é `INSERT` (uma string foi inserida), `DELETE` (uma string foi excluída) ou `UPDATE` (uma string foi modificada).

* `Table`

A tabela para a qual o gatilho é definido.

* `Statement`

O corpo do gatilho; ou seja, a declaração executada quando o gatilho é ativado.

* `Timing`

Se o gatilho é ativado antes ou depois do evento desencadeador. O valor é `BEFORE` ou `AFTER`.

* `Created`

A data e a hora em que o gatilho foi criado. Este é um valor `TIMESTAMP(2)` (com uma parte fracionária em centésimos de segundos) para gatilhos criados no MySQL 5.7.2 ou posterior, `NULL` para gatilhos criados antes de 5.7.2.

* `sql_mode`

O modo SQL em vigor quando o gatilho foi criado e sob o qual o gatilho é executado. Para os valores permitidos, consulte a Seção 5.1.10, “Modos SQL do servidor”.

* `Definer`

A conta do usuário que criou o gatilho, no formato `'user_name'@'host_name'`.

* `character_set_client`

O valor da sessão da variável de sistema `character_set_client` quando o gatilho foi criado.

* `collation_connection`

O valor da sessão da variável de sistema `collation_connection` quando o gatilho foi criado.

* `Database Collation`

A agregação do banco de dados com o qual o gatilho está associado.

As informações de gatilho também estão disponíveis na tabela `INFORMATION_SCHEMA` `TRIGGERS`. Veja a Seção 24.3.29, “A tabela TRIGGERS do INFORMATION_SCHEMA”.

#### 13.7.5.39 Declaração de variáveis SHOW

```sql
SHOW [GLOBAL | SESSION] VARIABLES
    [LIKE 'pattern' | WHERE expr]
```

Nota

O valor da variável de sistema `show_compatibility_56` afeta as informações disponíveis e os privilégios necessários para a declaração descrita aqui. Para obter detalhes, consulte a descrição dessa variável na Seção 5.1.7, “Variáveis do sistema do servidor”.

`SHOW VARIABLES` mostra os valores das variáveis do sistema do MySQL (veja a Seção 5.1.7, “Variáveis do sistema do servidor”). Esta declaração não requer qualquer privilégio. Ela requer apenas a capacidade de se conectar ao servidor.

As informações sobre variáveis do sistema também estão disponíveis nessas fontes:

Tabelas do Schema de desempenho. Veja a Seção 25.12.13, “Tabelas de variáveis do sistema do Schema de desempenho”.

* As tabelas `GLOBAL_VARIABLES` e `SESSION_VARIABLES`. Veja a Seção 24.3.11, “As tabelas INFORMATION_SCHEMA GLOBAL_VARIABLES e SESSION_VARIABLES”.

* O comando **mysqladmin variables**. Veja a Seção 4.5.2, “mysqladmin — Um programa de administração do servidor MySQL”.

Para `SHOW VARIABLES`, uma cláusula `LIKE`, se presente, indica quais nomes de variáveis devem ser correspondidos. Uma cláusula `WHERE` pode ser dada para selecionar strings usando condições mais gerais, conforme discutido na Seção 24.8, “Extensões para Declarações SHOW”.

`SHOW VARIABLES` aceita um modificador opcional de escopo da variável `GLOBAL` ou `SESSION`:

* Com o modificador `GLOBAL`, a declaração exibe os valores das variáveis de sistema global. Esses são os valores usados para inicializar as variáveis de sessão correspondentes para novas conexões ao MySQL. Se uma variável não tiver um valor global, nenhum valor é exibido.

* Com o modificador `SESSION`, a declaração exibe os valores das variáveis do sistema que estão em vigor para a conexão atual. Se uma variável não tiver um valor de sessão, o valor global é exibido. `LOCAL` é sinônimo de `SESSION`.

* Se não houver nenhum modificador, o padrão é `SESSION`.

O escopo de cada variável do sistema é listado na Seção 5.1.7, “Variáveis do sistema do servidor”.

`SHOW VARIABLES` está sujeito a um limite de largura de exibição dependente da versão. Para variáveis com valores muito longos que não são completamente exibidos, use `SELECT` como uma solução alternativa. Por exemplo:

```sql
SELECT @@GLOBAL.innodb_data_file_path;
```

A maioria das variáveis do sistema pode ser definida na inicialização do servidor (variáveis de leitura somente como `version_comment` são exceções). Muitas podem ser alteradas em tempo de execução com a declaração `SET`. Veja Seção 5.1.8, “Usando Variáveis do Sistema”, e Seção 13.7.4.1, “Sintaxe SET para Atribuição de Variáveis”.

Aqui é mostrado um resultado parcial. A lista de nomes e valores pode diferir para o seu servidor. A Seção 5.1.7, “Variáveis do Sistema do Servidor”, descreve o significado de cada variável, e a Seção 5.1.1, “Configurando o Servidor”, fornece informações sobre o ajuste delas.

```sql
mysql> SHOW VARIABLES;
+-----------------------------------------+---------------------------+
| Variable_name                           | Value                     |
+-----------------------------------------+---------------------------+
| auto_increment_increment                | 1                         |
| auto_increment_offset                   | 1                         |
| autocommit                              | ON                        |
| automatic_sp_privileges                 | ON                        |
| back_log                                | 50                        |
| basedir                                 | /home/jon/bin/mysql-5.5   |
| big_tables                              | OFF                       |
| binlog_cache_size                       | 32768                     |
| binlog_direct_non_transactional_updates | OFF                       |
| binlog_format                           | STATEMENT                 |
| binlog_stmt_cache_size                  | 32768                     |
| bulk_insert_buffer_size                 | 8388608                   |
...
| max_allowed_packet                      | 4194304                   |
| max_binlog_cache_size                   | 18446744073709547520      |
| max_binlog_size                         | 1073741824                |
| max_binlog_stmt_cache_size              | 18446744073709547520      |
| max_connect_errors                      | 100                       |
| max_connections                         | 151                       |
| max_delayed_threads                     | 20                        |
| max_error_count                         | 64                        |
| max_heap_table_size                     | 16777216                  |
| max_insert_delayed_threads              | 20                        |
| max_join_size                           | 18446744073709551615      |
...

| thread_handling                         | one-thread-per-connection |
| thread_stack                            | 262144                    |
| time_format                             | %H:%i:%s                  |
| time_zone                               | SYSTEM                    |
| timestamp                               | 1316689732                |
| tmp_table_size                          | 16777216                  |
| tmpdir                                  | /tmp                      |
| transaction_alloc_block_size            | 8192                      |
| transaction_isolation                   | REPEATABLE-READ           |
| transaction_prealloc_size               | 4096                      |
| transaction_read_only                   | OFF                       |
| tx_isolation                            | REPEATABLE-READ           |
| tx_read_only                            | OFF                       |
| unique_checks                           | ON                        |
| updatable_views_with_limit              | YES                       |
| version                                 | 5.7.44                    |
| version_comment                         | Source distribution       |
| version_compile_machine                 | x86_64                    |
| version_compile_os                      | Linux                     |
| wait_timeout                            | 28800                     |
| warning_count                           | 0                         |
+-----------------------------------------+---------------------------+
```

Com uma cláusula `LIKE`, a declaração exibe apenas as strings para aquelas variáveis com nomes que correspondem ao padrão. Para obter a string para uma variável específica, use uma cláusula `LIKE` como mostrado:

```sql
SHOW VARIABLES LIKE 'max_join_size';
SHOW SESSION VARIABLES LIKE 'max_join_size';
```

Para obter uma lista de variáveis cujos nomes correspondem a um padrão, use o caractere curinga `%` em uma cláusula `LIKE`:

```sql
SHOW VARIABLES LIKE '%size%';
SHOW GLOBAL VARIABLES LIKE '%size%';
```

Os caracteres curinga podem ser usados em qualquer posição dentro do padrão que deve ser correspondido. De forma estrita, porque `_` é um curinga que corresponde a qualquer caractere único, você deve escapar `\_` para correspondê-lo literalmente. Na prática, isso raramente é necessário.

#### 13.7.5.40 Declaração de ATENÇÕES

```sql
SHOW WARNINGS [LIMIT [offset,] row_count]
SHOW COUNT(*) WARNINGS
```

`SHOW WARNINGS` é uma declaração de diagnóstico que exibe informações sobre as condições (erros, avisos e notas) resultantes da execução de uma declaração na sessão atual. Os avisos são gerados para declarações DML, como `INSERT`, `UPDATE` e `LOAD DATA`, bem como declarações DDL, como `CREATE TABLE` e `ALTER TABLE`.

A cláusula `LIMIT` tem a mesma sintaxe que a declaração `SELECT`. Veja a Seção 13.2.9, “Declaração SELECT”.

`SHOW WARNINGS` também é usado após `EXPLAIN`, para exibir as informações extensas geradas por `EXPLAIN`. Veja a Seção 8.8.3, “Formato de Saída de EXPLAIN Extendido”.

`SHOW WARNINGS` exibe informações sobre as condições resultantes da execução da declaração não diagnóstica mais recente na sessão atual. Se a declaração mais recente resultou em um erro durante a análise, `SHOW WARNINGS` mostra as condições resultantes, independentemente do tipo de declaração (diagnóstica ou não diagnóstica).

A declaração diagnóstica `SHOW COUNT(*) WARNINGS` exibe o número total de erros, avisos e notas. Você também pode recuperar esse número a partir da variável de sistema `warning_count`:

```sql
SHOW COUNT(*) WARNINGS;
SELECT @@warning_count;
```

Uma diferença nesses enunciados é que o primeiro é um enunciado diagnóstico que não limpa a lista de mensagens. O segundo, porque é um enunciado `SELECT`, é considerado não diagnóstico e limpa a lista de mensagens.

Uma declaração diagnóstica relacionada, `SHOW ERRORS`, mostra apenas condições de erro (exclui avisos e notas), e a declaração `SHOW COUNT(*) ERRORS` exibe o número total de erros. Veja a Seção 13.7.5.17, “Declaração SHOW ERRORS”. `GET DIAGNOSTICS` pode ser usado para examinar informações para condições individuais. Veja a Seção 13.6.7.3, “Declaração GET DIAGNOSTICS”.

Aqui está um exemplo simples que mostra avisos de conversão de dados para `INSERT`. O exemplo assume que o modo SQL rigoroso está desativado. Com o modo rigoroso ativado, os avisos se tornariam erros e terminariam o `INSERT`.

```sql
mysql> CREATE TABLE t1 (a TINYINT NOT NULL, b CHAR(4));
Query OK, 0 rows affected (0.05 sec)

mysql> INSERT INTO t1 VALUES(10,'mysql'), (NULL,'test'), (300,'xyz');
Query OK, 3 rows affected, 3 warnings (0.00 sec)
Records: 3  Duplicates: 0  Warnings: 3

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Warning
   Code: 1265
Message: Data truncated for column 'b' at row 1
*************************** 2. row ***************************
  Level: Warning
   Code: 1048
Message: Column 'a' cannot be null
*************************** 3. row ***************************
  Level: Warning
   Code: 1264
Message: Out of range value for column 'a' at row 3
3 rows in set (0.00 sec)
```

A variável de sistema `max_error_count` controla o número máximo de mensagens de erro, aviso e nota para as quais o servidor armazena informações, e, portanto, o número de mensagens que o `SHOW WARNINGS` exibe. Para alterar o número de mensagens que o servidor pode armazenar, altere o valor de `max_error_count`. O padrão é 64.

`max_error_count` controla apenas quantas mensagens são armazenadas, não quantas são contadas. O valor de `warning_count` não é limitado por `max_error_count`, mesmo que o número de mensagens geradas exceda `max_error_count`. O exemplo a seguir demonstra isso. A declaração `ALTER TABLE` produz três mensagens de aviso (o modo SQL estrito é desativado para o exemplo, para evitar que um erro ocorra após um único problema de conversão). Apenas uma mensagem é armazenada e exibida porque `max_error_count` foi definida como 1, mas todas as três são contadas (como mostrado pelo valor de `warning_count`):

```sql
mysql> SHOW VARIABLES LIKE 'max_error_count';
+-----------------+-------+
| Variable_name   | Value |
+-----------------+-------+
| max_error_count | 64    |
+-----------------+-------+
1 row in set (0.00 sec)

mysql> SET max_error_count=1, sql_mode = '';
Query OK, 0 rows affected (0.00 sec)

mysql> ALTER TABLE t1 MODIFY b CHAR;
Query OK, 3 rows affected, 3 warnings (0.00 sec)
Records: 3  Duplicates: 0  Warnings: 3

mysql> SHOW WARNINGS;
+---------+------+----------------------------------------+
| Level   | Code | Message                                |
+---------+------+----------------------------------------+
| Warning | 1263 | Data truncated for column 'b' at row 1 |
+---------+------+----------------------------------------+
1 row in set (0.00 sec)

mysql> SELECT @@warning_count;
+-----------------+
| @@warning_count |
+-----------------+
|               3 |
+-----------------+
1 row in set (0.01 sec)
```

Para desabilitar o armazenamento de mensagens, defina `max_error_count` para 0. Neste caso, `warning_count` ainda indica quantos avisos ocorreram, mas as mensagens não são armazenadas e não podem ser exibidas.

A variável de sistema `sql_notes` controla se as mensagens de nota devem incrementar `warning_count` e se o servidor as armazena. Por padrão, `sql_notes` é 1, mas se definido como 0, as notas não incrementam `warning_count` e o servidor não as armazena:

```sql
mysql> SET sql_notes = 1;
mysql> DROP TABLE IF EXISTS test.no_such_table;
Query OK, 0 rows affected, 1 warning (0.00 sec)
mysql> SHOW WARNINGS;
+-------+------+------------------------------------+
| Level | Code | Message                            |
+-------+------+------------------------------------+
| Note  | 1051 | Unknown table 'test.no_such_table' |
+-------+------+------------------------------------+
1 row in set (0.00 sec)

mysql> SET sql_notes = 0;
mysql> DROP TABLE IF EXISTS test.no_such_table;
Query OK, 0 rows affected (0.00 sec)
mysql> SHOW WARNINGS;
Empty set (0.00 sec)
```

O servidor MySQL envia para cada cliente um contador que indica o número total de erros, avisos e notas resultantes da declaração mais recente executada por esse cliente. A partir da API C, esse valor pode ser obtido chamando `mysql_warning_count()`. Veja mysql_warning_count().

No cliente **mysql**, você pode habilitar e desabilitar a exibição automática de avisos usando os comandos `warnings` e `nowarning`, respectivamente, ou seus atalhos, `\W` e `\w` (consulte Seção 4.5.1.2, “Comandos do cliente mysql”). Por exemplo:

```sql
mysql> \W
Show warnings enabled.
mysql> SELECT 1/0;
+------+
| 1/0  |
+------+
| NULL |
+------+
1 row in set, 1 warning (0.03 sec)

Warning (Code 1365): Division by 0
mysql> \w
Show warnings disabled.
```

### 13.7.6 Outras declarações administrativas

#### 13.7.6.1 Declaração BINLOG

```sql
BINLOG 'str'
```

`BINLOG` é uma declaração de uso interno. Ela é gerada pelo programa **mysqlbinlog** como a representação imprimível de certos eventos em arquivos de log binário. (Veja a Seção 4.6.7, “mysqlbinlog — Utilitário para Processamento de Arquivos de Log Binário”.) O valor `'str'` é uma string codificada em base 64 que o servidor decodifica para determinar a mudança de dados indicada pelo evento correspondente. Esta declaração requer o privilégio `SUPER`.

Essa declaração pode executar apenas eventos de descrição de formato e eventos de string.

#### 13.7.6.2 Declaração de índice de cache

```sql
CACHE INDEX {
      tbl_index_list [, tbl_index_list] ...
    | tbl_name PARTITION (partition_list)
  }
  IN key_cache_name

tbl_index_list:
  tbl_name [{INDEX|KEY} (index_name[, index_name] ...)]

partition_list: {
    partition_name[, partition_name] ...
  | ALL
}
```

A declaração `CACHE INDEX` atribui índices de tabela a um cache de chave específico. Ela se aplica apenas às tabelas `MyISAM`, incluindo tabelas `MyISAM` particionadas. Após os índices terem sido atribuídos, eles podem ser pré-carregados no cache, se desejado, com `LOAD INDEX INTO CACHE`.

A seguinte declaração atribui índices das tabelas `t1`, `t2` e `t3` ao cache de chave denominado `hot_cache`:

```sql
mysql> CACHE INDEX t1, t2, t3 IN hot_cache;
+---------+--------------------+----------+----------+
| Table   | Op                 | Msg_type | Msg_text |
+---------+--------------------+----------+----------+
| test.t1 | assign_to_keycache | status   | OK       |
| test.t2 | assign_to_keycache | status   | OK       |
| test.t3 | assign_to_keycache | status   | OK       |
+---------+--------------------+----------+----------+
```

A sintaxe de `CACHE INDEX` permite que você especifique que apenas determinados índices de uma tabela devem ser atribuídos ao cache. No entanto, a implementação atribui todos os índices da tabela ao cache, portanto, não há motivo para especificar algo além do nome da tabela.

O cache de chave referido em uma declaração `CACHE INDEX` pode ser criado definindo seu tamanho com uma declaração de definição de parâmetro ou nas configurações de parâmetros do servidor. Por exemplo:

```sql
SET GLOBAL keycache1.key_buffer_size=128*1024;
```

Os parâmetros de cache principais são acessados como membros de uma variável de sistema estruturada. Veja a Seção 5.1.8.3, “Variáveis de sistema estruturadas”.

Uma cache chave deve existir antes de você atribuir índices a ela, ou ocorrerá um erro:

```sql
mysql> CACHE INDEX t1 IN non_existent_cache;
ERROR 1284 (HY000): Unknown key cache 'non_existent_cache'
```

Por padrão, os índices de tabela são atribuídos ao cache de chave principal (padrão) criado na inicialização do servidor. Quando um cache de chave é destruído, todos os índices atribuídos a ele são reatribuídos ao cache de chave principal padrão.

A atribuição de índice afeta o servidor globalmente: se um cliente atribuir um índice a um cache específico, esse cache é usado para todas as consultas que envolvem o índice, independentemente de qual cliente emite as consultas.

`CACHE INDEX` é suportado para tabelas `MyISAM` particionadas. Você pode atribuir um ou mais índices para uma, várias ou todas as partições a um cache de chave dado. Por exemplo, você pode fazer o seguinte:

```sql
CREATE TABLE pt (c1 INT, c2 VARCHAR(50), INDEX i(c1))
    ENGINE=MyISAM
    PARTITION BY HASH(c1)
    PARTITIONS 4;

SET GLOBAL kc_fast.key_buffer_size = 128 * 1024;
SET GLOBAL kc_slow.key_buffer_size = 128 * 1024;

CACHE INDEX pt PARTITION (p0) IN kc_fast;
CACHE INDEX pt PARTITION (p1, p3) IN kc_slow;
```

O conjunto anterior de declarações realiza as seguintes ações:

* Cria uma tabela particionada com 4 particionamentos; esses particionamentos são automaticamente nomeados `p0`, ..., `p3`; essa tabela tem um índice denominado `i` na coluna `c1`.

* Cria 2 caches principais nomeados `kc_fast` e `kc_slow`

* Atribui o índice para a partição `p0` ao cache de chave `kc_fast` e o índice para as partições `p1` e `p3` ao cache de chave [[`kc_slow`]; o índice para a partição restante (`p2`) usa o cache de chave padrão do servidor.

Se, em vez disso, você deseja atribuir os índices para todas as partições na tabela `pt` a um cache de chave única denominado `kc_all`, você pode usar uma das duas seguintes declarações:

```sql
CACHE INDEX pt PARTITION (ALL) IN kc_all;

CACHE INDEX pt IN kc_all;
```

As duas declarações que acabamos de mostrar são equivalentes, e emitir qualquer uma delas tem exatamente o mesmo efeito. Em outras palavras, se você deseja atribuir índices para todas as partições de uma tabela dividida ao mesmo cache de chave, a cláusula `PARTITION (ALL)` é opcional.

Ao atribuir índices para múltiplas partições a um cache de chave, as partições não precisam ser contínuas, e você não precisa listar seus nomes em qualquer ordem específica. Os índices para quaisquer partições que não sejam explicitamente atribuídas a um cache de chave de servidor usam automaticamente o cache de chave padrão do servidor.

O pré-carregamento do índice também é suportado para tabelas `MyISAM` particionadas. Para mais informações, consulte a Seção 13.7.6.5, “Instrução LOAD INDEX INTO CACHE”.

#### 13.7.6.3 Declaração FLUSH

```sql
FLUSH [NO_WRITE_TO_BINLOG | LOCAL] {
    flush_option [, flush_option] ...
  | tables_option
}

flush_option: {
    BINARY LOGS
  | DES_KEY_FILE
  | ENGINE LOGS
  | ERROR LOGS
  | GENERAL LOGS
  | HOSTS
  | LOGS
  | PRIVILEGES
  | OPTIMIZER_COSTS
  | QUERY CACHE
  | RELAY LOGS [FOR CHANNEL channel]
  | SLOW LOGS
  | STATUS
  | USER_RESOURCES
}

tables_option: {
    table_synonym
  | table_synonym tbl_name [, tbl_name] ...
  | table_synonym WITH READ LOCK
  | table_synonym tbl_name [, tbl_name] ... WITH READ LOCK
  | table_synonym tbl_name [, tbl_name] ... FOR EXPORT
}

table_synonym: {
    TABLE
  | TABLES
}
```

A declaração `FLUSH` possui várias formas variantes que limpam ou recarregam vários caches internos, limpem tabelas ou adquiram bloqueios. Para executar `FLUSH`, você deve ter o privilégio `RELOAD`. Opções específicas de limpeza podem exigir privilégios adicionais, conforme indicado nas descrições das opções.

Nota

Não é possível emitir declarações `FLUSH` dentro de funções ou gatilhos armazenados. No entanto, você pode usar `FLUSH` em procedimentos armazenados, desde que esses não sejam chamados a partir de funções ou gatilhos armazenados. Veja a Seção 23.8, “Restrições em Programas Armazenados”.

Por padrão, o servidor escreve as declarações `FLUSH` no log binário para que elas sejam replicadas para as réplicas. Para suprimir o registro, especifique a palavra-chave opcional `NO_WRITE_TO_BINLOG` ou seu alias `LOCAL`.

Nota

`FLUSH LOGS`, `FLUSH BINARY LOGS`, `FLUSH TABLES WITH READ LOCK` (com ou sem uma lista de tabelas) e `FLUSH TABLES tbl_name ... FOR EXPORT` não são escritos no log binário em nenhum caso, porque eles causariam problemas se replicados para uma réplica.

A declaração `FLUSH` causa um commit implícito. Veja a Seção 13.3.3, “Declarações que causam um commit implícito”.

A ferramenta **mysqladmin** oferece uma interface de string de comando para algumas operações de limpeza, usando comandos como `flush-hosts`, `flush-logs`, `flush-privileges`, `flush-status` e `flush-tables`. Veja a Seção 4.5.2, “mysqladmin — Um programa de administração do servidor MySQL”.

Enviar um sinal `SIGHUP` para o servidor faz com que várias operações de limpeza ocorram, que são semelhantes a várias formas da declaração `FLUSH`. Os sinais podem ser enviados pela conta do sistema `root` ou pela conta do sistema que possui o processo do servidor. Isso permite que as operações de limpeza sejam realizadas sem precisar se conectar ao servidor, o que requer uma conta MySQL que tenha privilégios suficientes para essas operações. Veja a Seção 4.10, “Tratamento de Sinais Unix no MySQL”.

A declaração `RESET` é semelhante à `FLUSH`. Consulte a Seção 13.7.6.6, “Declaração RESET”, para obter informações sobre o uso de `RESET` com replicação.

A lista a seguir descreve os valores permitidos da declaração `FLUSH` *`flush_option`*. Para descrições dos valores permitidos de *`tables_option`*, consulte a Sintaxe de FLUSH TABLES.

* `FLUSH BINARY LOGS`

Fecha e reabre qualquer arquivo de registro binário para o qual o servidor está escrevendo. Se o registro binário estiver habilitado, o número de sequência do arquivo de registro binário é incrementado em um em relação ao arquivo anterior.

Essa operação não afeta as tabelas utilizadas para os registros binários e relés (contidos nos sistemas controlados pelas variáveis de sistema `master_info_repository` e `relay_log_info_repository`).

* `FLUSH DES_KEY_FILE`

Recarrega as chaves DES do arquivo que foi especificado com a opção `--des-key-file` no momento de inicialização do servidor.

Nota

As funções `DES_ENCRYPT()` e `DES_DECRYPT()` são descontinuadas no MySQL 5.7, removidas no MySQL 8.0 e não devem mais ser usadas. Consequentemente, `--des-key-file` e `DES_KEY_FILE` também são descontinuadas e removidas no MySQL 8.0.

* `FLUSH ENGINE LOGS`

Fecha e reabre quaisquer registros flutuáveis para motores de armazenamento instalados. Isso faz com que `InnoDB` limpe seus registros no disco.

* `FLUSH ERROR LOGS`

Fecha e reabre qualquer arquivo de registro de erro para o qual o servidor está escrevendo.

* `FLUSH GENERAL LOGS`

Fecha e reabre qualquer arquivo de registro de consulta geral para o qual o servidor está escrevendo.

Essa operação não afeta as tabelas utilizadas para o log de consulta geral (consulte a Seção 5.4.1, “Selecionando destinos de saída do log de consulta geral e do log de consulta lenta”).

* `FLUSH HOSTS`

Esvazia o cache do host e a tabela do Schema de desempenho `host_cache` que expõe o conteúdo do cache e desbloqueia quaisquer hosts bloqueados.

Para informações sobre por que o esvaziamento do cache do host pode ser aconselhável ou desejável, consulte a Seção 5.1.11.2, “Consultas DNS e o Cache do Host”.

Nota

A declaração `TRUNCATE TABLE performance_schema.host_cache`, ao contrário de `FLUSH HOSTS`, não é escrita no log binário. Para obter o mesmo comportamento do último, especifique `NO_WRITE_TO_BINLOG` ou `LOCAL` como parte da declaração `FLUSH HOSTS`.

* `FLUSH LOGS`

Fecha e reabre qualquer arquivo de registro para o qual o servidor está escrevendo.

O efeito dessa operação é equivalente aos efeitos combinados dessas operações:

  ```sql
  FLUSH BINARY LOGS
  FLUSH ENGINE LOGS
  FLUSH ERROR LOGS
  FLUSH GENERAL LOGS
  FLUSH RELAY LOGS
  FLUSH SLOW LOGS
  ```

* `FLUSH OPTIMIZER_COSTS`

Re-leia as tabelas do modelo de custo para que o otimizador comece a usar as estimativas de custo atuais armazenadas nelas.

O servidor escreve um aviso no log de erro para quaisquer entradas de tabela de modelo de custo não reconhecidas. Para informações sobre essas tabelas, consulte a Seção 8.9.5, “O Modelo de Custo do Optimizador”. Esta operação afeta apenas as sessões que começam subsequentemente ao esvaziamento. As sessões existentes continuam a usar as estimativas de custo que estavam em vigor quando começaram.

* `FLUSH PRIVILEGES`

Re-leia os privilégios das tabelas de concessão no banco de dados do sistema `mysql`.

Recarregar as tabelas de concessão é necessário para permitir atualizações dos privilégios e usuários do MySQL apenas se você fizer tais alterações diretamente nas tabelas de concessão; não é necessário para declarações de gerenciamento de contas, como `GRANT` ou `REVOKE`, que entram em vigor imediatamente. Consulte a Seção 6.2.9, “Quando as Alterações de Privilegio Entram em Vigor”, para obter mais informações.

Se a opção `--skip-grant-tables` foi especificada na inicialização do servidor para desabilitar o sistema de privilégios do MySQL, `FLUSH PRIVILEGES` fornece uma maneira de habilitar o sistema de privilégios no runtime.

Libera a memória cacheada pelo servidor como resultado das declarações `GRANT`, `CREATE USER`, `CREATE SERVER` e `INSTALL PLUGIN`. Essa memória não é liberada pelas declarações correspondentes `REVOKE`, `DROP USER`, `DROP SERVER` e `UNINSTALL PLUGIN`, portanto, para um servidor que executa muitas instâncias das declarações que causam cache, o uso de memória cacheada aumenta, a menos que seja liberada com `FLUSH PRIVILEGES`.

* `FLUSH QUERY CACHE`

Desfragmente o cache de consulta para utilizar melhor sua memória. `FLUSH QUERY CACHE` não remove nenhuma consulta do cache, ao contrário de `FLUSH TABLES` ou `RESET QUERY CACHE`.

Nota

O cache de consulta é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A depreciação inclui `FLUSH QUERY CACHE`.

* `FLUSH RELAY LOGS [FOR CHANNEL channel]`

Fecha e reabre qualquer arquivo de registro de releio para o qual o servidor está escrevendo. Se o registro de releio estiver habilitado, o número de sequência do arquivo de registro de releio é incrementado em um em relação ao arquivo anterior.

A cláusula `FOR CHANNEL channel` permite que você nomeie qual canal de replicação a operação se aplica. Execute `FLUSH RELAY LOGS FOR CHANNEL channel` para limpar o log do relé para um canal de replicação específico. Se nenhum canal estiver nomeado e não houver canais de replicação adicionais, a operação se aplica ao canal padrão. Se nenhum canal estiver nomeado e houver vários canais de replicação, a operação se aplica a todos os canais de replicação, com exceção do canal `group_replication_applier`. Para mais informações, consulte a Seção 16.2.2, “Canais de Replicação”.

Essa operação não afeta as tabelas utilizadas para os registros binários e relés (contidos nos controles das variáveis de sistema `master_info_repository` e `relay_log_info_repository`).

* `FLUSH SLOW LOGS`

Fecha e reabre qualquer arquivo de registro de consulta lenta para o qual o servidor está escrevendo.

Essa operação não afeta as tabelas utilizadas para o registro de consultas lentas (consulte a Seção 5.4.1, “Selecionando destinos de saída do registro de consulta geral e do registro de consulta lenta”).

* `FLUSH STATUS`

Mostra os indicadores de status.

Essa operação adiciona os valores das variáveis de status de sessão do thread atual aos valores globais e redefre os valores de sessão para zero. Algumas variáveis globais também podem ser redefinidas para zero. Ela também redefre os contadores para caches de chave (padrão e nomeados) para zero e define `Max_used_connections` para o número atual de conexões abertas. Esta informação pode ser útil ao depurar uma consulta. Veja a Seção 1.5, “Como relatar bugs ou problemas”.

`FLUSH STATUS` não é afetado por `read_only` ou `super_read_only`, e é sempre escrito no log binário.

Nota

O valor da variável de sistema `show_compatibility_56` afeta o funcionamento desta opção `FLUSH`. Para obter mais detalhes, consulte a descrição dessa variável na Seção 5.1.7, “Variáveis do sistema do servidor”.

* `FLUSH USER_RESOURCES`

Redefine todos os indicadores de recursos por hora do usuário para zero.

A redefinição dos indicadores de recursos permite que os clientes que atingiram seus limites de conexão, consulta ou atualização por hora retomem a atividade imediatamente. `FLUSH USER_RESOURCES` não se aplica ao limite de conexões simultâneas máximas que é controlado pela variável de sistema `max_user_connections`. Veja a Seção 6.2.16, “Definindo Limites de Recursos da Conta”.

##### Sintaxe de FLUSH TABLES

`FLUSH TABLES` esvazia tabelas e, dependendo da variante usada, adquire bloqueios. Qualquer variante `TABLES` usada em uma declaração `FLUSH` deve ser a única opção usada. `FLUSH TABLE` é sinônimo de `FLUSH TABLES`.

Nota

As descrições aqui que indicam que as tabelas são apagadas ao serem fechadas se aplicam de maneira diferente para `InnoDB`, que apaga o conteúdo da tabela no disco, mas as deixa abertas. Isso ainda permite que os arquivos de tabela sejam copiados enquanto as tabelas estão abertas, desde que nenhuma outra atividade as modifique.

* `FLUSH TABLES`

Fecha todas as tabelas abertas, obriga todas as tabelas em uso a serem fechadas e descarrega o cache de consultas e o cache de declarações preparadas. `FLUSH TABLES` também remove todos os resultados de consulta do cache de consultas, como a declaração `RESET QUERY CACHE`. Para informações sobre cache de consultas e cache de declarações preparadas, consulte a Seção 8.10.3, “O Cache de Consulta MySQL” e a Seção 8.10.4, “Cache de Declarações Preparadas e Programas Armazenados”.

`FLUSH TABLES` não é permitido quando há um `LOCK TABLES ... READ` ativo. Para esvaziar e bloquear tabelas, use `FLUSH TABLES tbl_name ... WITH READ LOCK` em vez disso.

* `FLUSH TABLES tbl_name [, tbl_name] ...`

Com uma lista de um ou mais nomes de tabela separados por vírgula, essa operação é como `FLUSH TABLES` sem nomes, exceto que o servidor esvazia apenas as tabelas nomeadas. Se uma tabela nomeada não existir, não ocorre nenhum erro.

* `FLUSH TABLES WITH READ LOCK`

Fecha todas as tabelas abertas e bloqueia todas as tabelas para todos os bancos de dados com um bloqueio de leitura global.

Essa operação é uma maneira muito conveniente de obter backups se você tiver um sistema de arquivos como Veritas ou ZFS que possa fazer instantâneos no tempo. Use `UNLOCK TABLES` para liberar o bloqueio.

`FLUSH TABLES WITH READ LOCK` adquire um bloqueio de leitura global em vez de bloqueios de tabela, portanto, não está sujeito ao mesmo comportamento que `LOCK TABLES` e `UNLOCK TABLES` em relação ao bloqueio de tabela e aos compromissos implícitos:

+ `UNLOCK TABLES` compromete implicitamente qualquer transação ativa apenas se quaisquer tabelas estiverem atualmente bloqueadas com `LOCK TABLES`. O compromisso não ocorre para `UNLOCK TABLES` após `FLUSH TABLES WITH READ LOCK`, pois a última declaração não adquire bloqueios de tabela.

+ Começar uma transação faz com que as chaves de tabela adquiridas com `LOCK TABLES` sejam liberadas, como se você tivesse executado `UNLOCK TABLES`. Começar uma transação não libera uma chave de leitura global adquirida com `FLUSH TABLES WITH READ LOCK`.

Antes do MySQL 5.7.19, `FLUSH TABLES WITH READ LOCK` não é compatível com transações XA.

`FLUSH TABLES WITH READ LOCK` não impede que o servidor insira strings nas tabelas de log (consulte a Seção 5.4.1, “Selecionando destinos de saída de log de consulta geral e log de consulta lenta”).

* `FLUSH TABLES tbl_name [, tbl_name] ... WITH READ LOCK`

Elimina e adquire bloqueios de leitura para as tabelas nomeadas.

Como essa operação obtém bloqueios de tabela, ela exige o privilégio `LOCK TABLES` para cada tabela, além do privilégio `RELOAD`.

A operação primeiro adquire bloqueios de metadados exclusivos para as tabelas, então ela espera por transações que tenham essas tabelas abertas para serem concluídas. Em seguida, a operação descarta as tabelas do cache de tabela, reabre as tabelas, adquire blocos de tabela (como `LOCK TABLES ... READ`) e desclassifica os blocos de metadados de exclusivos para compartilhados. Após a operação adquirir blocos e desclassificar os blocos de metadados, outras sessões podem ler, mas não modificar as tabelas.

Esta operação só se aplica a tabelas de base existentes (não `TEMPORARY)`). Se um nome se refere a uma tabela de base, essa tabela é usada. Se se refere a uma tabela `TEMPORARY`, ela é ignorada. Se um nome se aplica a uma visão, ocorre um erro `ER_WRONG_OBJECT`. Caso contrário, ocorre um erro `ER_NO_SUCH_TABLE`.

Use `UNLOCK TABLES` para liberar as trancas, `LOCK TABLES` para liberar as trancas e adquirir outras trancas, ou `START TRANSACTION` para liberar as trancas e iniciar uma nova transação.

Essa variante `FLUSH TABLES` permite que as tabelas sejam esvaziadas e bloqueadas em uma única operação. Ela oferece uma solução para a restrição de que `FLUSH TABLES` não é permitido quando há um `LOCK TABLES ... READ` ativo.

Essa operação não realiza um `UNLOCK TABLES` implícito, portanto, um erro resulta se você realizar a operação enquanto houver algum `LOCK TABLES` ativo ou usar-a uma segunda vez sem liberar primeiro as chaves adquiridas.

Se uma tabela limpa foi aberta com `HANDLER`, o manipulador é implicitamente limpo e perde sua posição.

* `FLUSH TABLES tbl_name [, tbl_name] ... FOR EXPORT`

Essa variante `FLUSH TABLES` se aplica às tabelas `InnoDB`. Ela garante que as alterações nas tabelas nomeadas tenham sido descarregadas no disco, para que cópias binárias das tabelas possam ser feitas enquanto o servidor está em execução.

Como a operação `FLUSH TABLES ... FOR EXPORT` adquire bloqueios em tabelas em preparação para a exportação, ela requer os privilégios `LOCK TABLES` e `SELECT` para cada tabela, além do privilégio `RELOAD`.

A operação funciona da seguinte forma:

1. Adquire bloqueios de metadados compartilhados para as tabelas nomeadas. A operação bloqueia enquanto outras sessões tiverem transações ativas que tenham modificado essas tabelas ou que possuam bloqueios de tabela para elas. Quando os bloqueios são adquiridos, a operação bloqueia as transações que tentam atualizar as tabelas, permitindo que as operações de leitura apenas continuem.

2. Verifica se todos os motores de armazenamento das tabelas suportam `FOR EXPORT`. Se algum não o fizer, ocorre um erro `ER_ILLEGAL_HA` e a operação falha.

3. A operação notifica o motor de armazenamento para cada tabela, preparando-a para exportação. O motor de armazenamento deve garantir que quaisquer alterações pendentes sejam escritas no disco.

4. A operação coloca a sessão no modo de tabelas bloqueadas, de modo que as chaves de metadados adquiridas anteriormente não sejam liberadas quando a operação `FOR EXPORT` for concluída.

Esta operação só se aplica a tabelas de base existentes (não `TEMPORARY`). Se um nome se refere a uma tabela de base, essa tabela é usada. Se se refere a uma tabela `TEMPORARY`, ela é ignorada. Se um nome se aplica a uma visão, ocorre um erro `ER_WRONG_OBJECT`. Caso contrário, ocorre um erro `ER_NO_SUCH_TABLE`.

`InnoDB` suporta `FOR EXPORT` para tabelas que possuem seu próprio arquivo `.ibd` (ou seja, tabelas criadas com a configuração `innodb_file_per_table` habilitada). `InnoDB` garante que, quando notificado pela operação `FOR EXPORT`, quaisquer alterações tenham sido descarregadas no disco. Isso permite que uma cópia binária do conteúdo da tabela seja feita enquanto a operação `FOR EXPORT` está em vigor, porque o arquivo `.ibd` é consistente com a transação e pode ser copiado enquanto o servidor está em execução. `FOR EXPORT` não se aplica aos arquivos de espaço de sistema de tabelas do sistema `InnoDB`, ou aos `InnoDB` tabelas que possuem índices `FULLTEXT`.

`FLUSH TABLES ...FOR EXPORT` é suportado para tabelas particionadas `InnoDB`.

Quando notificado por `FOR EXPORT`, `InnoDB` escreve em disco certos tipos de dados que normalmente são mantidos na memória ou em buffers de disco separados, fora dos arquivos do espaço de tabela. Para cada tabela, `InnoDB` também produz um arquivo denominado `table_name.cfg` no mesmo diretório do banco de dados da tabela. O arquivo `.cfg` contém metadados necessários para reimportar os arquivos do espaço de tabela posteriormente, no mesmo ou em um servidor diferente.

Quando a operação `FOR EXPORT` for concluída, o `InnoDB` limpou todas as páginas sujas dos arquivos de dados de tabela. As entradas de buffer de alteração são unidas antes da limpeza. Neste ponto, as tabelas estão bloqueadas e quiescentes: As tabelas estão em um estado consistente em transação no disco e você pode copiar os arquivos do espaço de tabelas `.ibd` juntamente com os arquivos correspondentes `.cfg` para obter um instantâneo consistente dessas tabelas.

Para o procedimento de reimpor os dados da tabela copiada em uma instância MySQL, consulte a Seção 14.6.1.3, “Importando tabelas InnoDB”.

Depois de terminar com as tabelas, use `UNLOCK TABLES` para liberar as chaves, `LOCK TABLES` para liberar as chaves e adquirir outras chaves, ou `START TRANSACTION` para liberar as chaves e iniciar uma nova transação.

Enquanto qualquer uma dessas declarações estiver em vigor na sessão, as tentativas de usar `FLUSH TABLES ... FOR EXPORT` produzem um erro:

  ```sql
  FLUSH TABLES ... WITH READ LOCK
  FLUSH TABLES ... FOR EXPORT
  LOCK TABLES ... READ
  LOCK TABLES ... WRITE
  ```

Enquanto `FLUSH TABLES ... FOR EXPORT` está em vigor na sessão, as tentativas de usar qualquer uma dessas declarações produzem um erro:

  ```sql
  FLUSH TABLES WITH READ LOCK
  FLUSH TABLES ... WITH READ LOCK
  FLUSH TABLES ... FOR EXPORT
  ```

#### 13.7.6.4 Declaração de eliminação

```sql
KILL [CONNECTION | QUERY] processlist_id
```

Cada conexão com `mysqld` é executada em um thread separado. Você pode matar um thread com a declaração `KILL processlist_id`.

Os identificadores do processo thread podem ser determinados a partir da coluna `ID` da tabela `INFORMATION_SCHEMA` `PROCESSLIST`, da coluna `Id` da saída `SHOW PROCESSLIST` e da coluna `PROCESSLIST_ID` da tabela do Schema de Desempenho [[`threads`]. O valor do thread atual é retornado pela função `CONNECTION_ID()`.

`KILL` permite um modificador opcional `CONNECTION` ou `QUERY`:

* `KILL CONNECTION` é o mesmo que `KILL` sem modificador: Ele termina a conexão associada ao *`processlist_id`* dado, após terminar qualquer declaração que a conexão esteja executando.

* `KILL QUERY` termina a declaração que a conexão está executando atualmente, mas deixa a própria conexão intacta.

A capacidade de ver quais threads estão disponíveis para serem eliminadas depende do privilégio `PROCESS`:

* Sem `PROCESS`, você só pode ver seus próprios tópicos.

* Com `PROCESS`, você pode ver todas as discussões.

A capacidade de matar threads e declarações depende do privilégio `SUPER`:

* Sem `SUPER`, você pode matar apenas suas próprias threads e declarações.

* Com `SUPER`, você pode matar todas as threads e declarações.

Você também pode usar os comandos **mysqladmin processlist** e **mysqladmin kill** para examinar e matar os threads.

Nota

Você não pode usar `KILL` com a biblioteca do servidor MySQL embutido porque o servidor embutido funciona apenas dentro dos threads do aplicativo host. Não cria nenhum thread de conexão por si só.

Quando você usa `KILL`, uma bandeira de eliminação específica para o thread é definida para o thread. Na maioria dos casos, pode levar algum tempo para o thread morrer, porque a bandeira de eliminação é verificada apenas em intervalos específicos:

* Durante as operações de `SELECT`, para os loops de `ORDER BY` e `GROUP BY`, a bandeira é verificada após a leitura de um bloco de strings. Se a bandeira de eliminação estiver definida, a declaração é interrompida.

* As operações `ALTER TABLE` que fazem uma cópia de tabela verificam a bandeira de eliminação periodicamente para cada algumas strings copiadas lidas da tabela original. Se a bandeira de eliminação estiver definida, a declaração é abortada e a tabela temporária é excluída.

A declaração `KILL` retorna sem esperar confirmação, mas a verificação da bandeira de eliminação interrompe a operação em um período razoavelmente curto. Interromper a operação para realizar qualquer limpeza necessária também leva algum tempo.

* Durante as operações de `UPDATE` ou `DELETE`, a bandeira de eliminação é verificada após cada bloco lido e após cada string atualizada ou excluída. Se a bandeira de eliminação estiver definida, a declaração é abortada. Se você não estiver usando transações, as alterações não são revertidas.

* `GET_LOCK()` interrompe e retorna `NULL`.

* Se o thread estiver no manipulador de bloqueio de tabela (estado: `Locked`, o bloqueio de tabela é rapidamente abortado.

* Se o thread estiver aguardando espaço livre em um chamado de escrita, a escrita é aborrecida com uma mensagem de erro de "disco cheio".

Aviso

Matar uma operação de `REPAIR TABLE` ou `OPTIMIZE TABLE` em uma tabela `MyISAM` resulta em uma tabela corrompida e inutilizável. Quaisquer leituras ou escritas em tal tabela falham até que você otimize ou a repare novamente (sem interrupção).

#### 13.7.6.5 Declaração de índice de carga na memória cache

```sql
LOAD INDEX INTO CACHE
  tbl_index_list [, tbl_index_list] ...

tbl_index_list:
  tbl_name
    [PARTITION (partition_list)]
    [{INDEX|KEY} (index_name[, index_name] ...)]
    [IGNORE LEAVES]

partition_list: {
    partition_name[, partition_name] ...
  | ALL
}
```

A declaração `LOAD INDEX INTO CACHE` pré-carrega um índice de tabela na cache de chave para a qual foi atribuída por uma declaração explícita `CACHE INDEX`, ou na cache de chave padrão, caso contrário.

`LOAD INDEX INTO CACHE` aplica-se apenas às tabelas `MyISAM`, incluindo tabelas `MyISAM` particionadas. Além disso, índices em tabelas particionadas podem ser pré-carregados para uma, várias ou todas as particionamentos.

O modificador `IGNORE LEAVES` faz com que apenas os blocos dos nós não-folha do índice sejam pré-carregados.

`IGNORE LEAVES` também é suportado para tabelas particionadas `MyISAM`.

A seguinte declaração pré-carrega os nós (blocos de índice) dos índices para as tabelas `t1` e `t2`:

```sql
mysql> LOAD INDEX INTO CACHE t1, t2 IGNORE LEAVES;
+---------+--------------+----------+----------+
| Table   | Op           | Msg_type | Msg_text |
+---------+--------------+----------+----------+
| test.t1 | preload_keys | status   | OK       |
| test.t2 | preload_keys | status   | OK       |
+---------+--------------+----------+----------+
```

Essa declaração pré-carrega todos os blocos do índice de `t1`. Pré-carrega apenas blocos para os nós não-folha de `t2`.

A sintaxe de `LOAD INDEX INTO CACHE` permite que você especifique que apenas determinados índices de uma tabela devem ser pré-carregados. No entanto, a implementação pré-carrega todos os índices da tabela no cache, portanto, não há motivo para especificar algo além do nome da tabela.

É possível pré-carregar índices em partições específicas de tabelas `MyISAM` particionadas. Por exemplo, das seguintes duas declarações, a primeira pré-carrega índices para a partição `p0` de uma tabela particionada `pt`, enquanto a segunda pré-carrega os índices para as partições `p1` e `p3` da mesma tabela:

```sql
LOAD INDEX INTO CACHE pt PARTITION (p0);
LOAD INDEX INTO CACHE pt PARTITION (p1, p3);
```

Para pré-carregar os índices para todas as partições na tabela `pt`, você pode usar uma das duas seguintes declarações:

```sql
LOAD INDEX INTO CACHE pt PARTITION (ALL);

LOAD INDEX INTO CACHE pt;
```

As duas declarações que acabamos de mostrar são equivalentes, e emitir qualquer uma delas tem exatamente o mesmo efeito. Em outras palavras, se você deseja pré-carregar índices para todas as partições de uma tabela particionada, a cláusula `PARTITION (ALL)` é opcional.

Quando pré-carregamos índices para múltiplas partições, as partições não precisam ser contínuas e você não precisa listar seus nomes em qualquer ordem específica.

`LOAD INDEX INTO CACHE ... IGNORE LEAVES` falha, a menos que todos os índices em uma tabela tenham o mesmo tamanho de bloco. Para determinar os tamanhos de bloco de índice para uma tabela, use **myisamchk -dv** e verifique a coluna `Blocksize`.

#### 13.7.6.6 Declaração de RESET

```sql
RESET reset_option [, reset_option] ...

reset_option: {
    MASTER
  | QUERY CACHE
  | SLAVE
}
```

A declaração `RESET` é usada para limpar o estado de várias operações do servidor. Você deve ter o privilégio `RELOAD` para executar `RESET`.

`RESET` atua como uma versão mais forte da declaração `FLUSH`. Veja a Seção 13.7.6.3, “Declaração FLUSH”.

A declaração `RESET` causa um commit implícito. Veja a Seção 13.3.3, “Declarações que causam um commit implícito”.

A lista a seguir descreve os valores permitidos da declaração `RESET` *`reset_option`*:

* `RESET MASTER`

Exclui todos os registros binários listados no arquivo de índice, refaz o arquivo de índice do registro binário para estar vazio e cria um novo arquivo de registro binário.

* `RESET QUERY CACHE`

Remove todos os resultados da consulta do cache da consulta.

Nota

O cache de consulta é descontinuado a partir do MySQL 5.7.20 e é removido no MySQL 8.0. A depreciação inclui `RESET QUERY CACHE`.

* `RESET SLAVE`

Faz com que a réplica esqueça sua posição de replicação nos logs binários de origem. Também redefine o log de relevo, excluindo quaisquer arquivos de log de relevo existentes e iniciando um novo.

#### 13.7.6.7 Declaração de Desativação

```sql
SHUTDOWN
```

Essa declaração para com o servidor MySQL. Ela requer o privilégio `SHUTDOWN`.

`SHUTDOWN` oferece uma interface de nível SQL para a mesma funcionalidade disponível usando o comando **mysqladmin shutdown** ou a função API em C `mysql_shutdown()`. Uma sequência bem-sucedida `SHUTDOWN` consiste em verificar os privilégios, validar os argumentos e enviar um pacote OK ao cliente. Em seguida, o servidor é desligado.

A variável de status `Com_shutdown` acompanha o número de declarações `SHUTDOWN`. Como as variáveis de status são inicializadas para cada inicialização do servidor e não persistem em reinicializações, `Com_shutdown` normalmente tem um valor de zero, mas pode ser não nulo se as declarações `SHUTDOWN` foram executadas, mas falharam.

Outra maneira de parar o servidor é enviá-lo um sinal `SIGTERM`, que pode ser feito por `root` ou pela conta que possui o processo do servidor. `SIGTERM` permite que o desligamento do servidor seja realizado sem precisar se conectar ao servidor. Veja a Seção 4.10, “Tratamento de Sinais Unix no MySQL”.