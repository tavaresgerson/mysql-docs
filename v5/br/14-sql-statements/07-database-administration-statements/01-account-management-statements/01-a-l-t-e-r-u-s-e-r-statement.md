#### 13.7.1.1 Declaração ALTER USER

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

A instrução `ALTER USER` modifica as contas do MySQL. Ela permite que as propriedades de autenticação, SSL/TLS, limite de recursos e gerenciamento de senhas sejam modificadas para contas existentes. Ela também pode ser usada para bloquear e desbloquear contas.

Para usar o `ALTER USER`, você deve ter o privilégio global `CREATE USER` ou o privilégio `UPDATE` para o banco de dados do sistema `mysql`. Quando a variável de sistema `read_only` é habilitada, o `ALTER USER` também requer o privilégio `SUPER`.

Por padrão, ocorre um erro se você tentar modificar um usuário que não existe. Se a cláusula `IF EXISTS` for fornecida, a instrução gera um aviso para cada usuário nomeado que não existe, em vez de um erro.

Importante

Em algumas circunstâncias, `ALTER USER` pode ser registrado nos logs do servidor ou no lado do cliente em um arquivo de histórico, como `~/.mysql_history`, o que significa que senhas em texto claro podem ser lidas por qualquer pessoa que tenha acesso de leitura a essas informações. Para obter informações sobre as condições sob as quais isso ocorre para os logs do servidor e como controlá-lo, consulte Seção 6.1.2.3, “Senhas e Registro”. Para informações semelhantes sobre o registro no lado do cliente, consulte Seção 4.5.1.3, “Registro do Cliente do MySQL”.

Há vários aspectos da declaração `ALTER USER`, descritos nos seguintes tópicos:

- Visão geral do alteração de usuário
- Opções de Autenticação de Usuário Alterar
- Alterar opções de SSL/TLS do usuário
- Opções de Limite de Recursos do Usuário
- Opções de Gerenciamento de Senhas do Usuário
- Opções de bloqueio de conta do usuário

##### ALTERAR USUÁRIO Visão geral

Para cada conta afetada, `ALTER USER` modifica a linha correspondente na tabela `mysql.user` do sistema para refletir as propriedades especificadas na declaração. Propriedades não especificadas retêm seus valores atuais.

Cada nome de conta usa o formato descrito na Seção 6.2.4, “Especificação de Nomes de Conta”. A parte do nome de conta que contém o nome do host, se omitida, tem como padrão `'%'`. Também é possível especificar `CURRENT_USER` ou `CURRENT_USER()` para se referir à conta associada à sessão atual.

Em apenas um caso, a conta pode ser especificada com a função `USER()`:

```sql
ALTER USER USER() IDENTIFIED BY 'auth_string';
```

Essa sintaxe permite que você mude sua própria senha sem precisar nomear sua conta literalmente.

Para a sintaxe de `ALTER USER` que permite que um valor de *`auth_option`* siga um valor de *`user`*, *`auth_option`* indica como a conta autentica, especificando um plugin de autenticação de conta, credenciais (por exemplo, uma senha) ou ambos. Cada valor de *`auth_option`* se aplica *apenas* à conta nomeada imediatamente antes dele.

De acordo com as especificações do *`user`*, a declaração pode incluir opções para SSL/TLS, limite de recursos, gerenciamento de senhas e propriedades de bloqueio. Todas essas opções são *globais* para a declaração e aplicam-se a *todas* as contas mencionadas na declaração.

Exemplo: Alterar a senha de uma conta e expira-la. Como resultado, o usuário deve se conectar com a senha nomeada e escolher uma nova na próxima conexão:

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

Exemplo: Bloquear ou desbloquear uma conta:

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

O valor `IDENTIFIED BY` após `jeffrey` aplica-se apenas à conta imediatamente anterior, portanto, ele altera a senha para `'jeffrey_new_password'` apenas para `jeffrey`. Para `jeanne`, não há um valor por conta (portanto, a senha permanece inalterada).

As propriedades restantes se aplicam globalmente a todas as contas mencionadas na declaração, portanto, para ambas as contas:

- Para usar SSL, são necessárias conexões.
- A conta pode ser usada para até duas conexões simultâneas.

Na ausência de um tipo específico de opção, a conta permanece inalterada nesse aspecto. Por exemplo, sem a opção de bloqueio, o estado de bloqueio da conta não é alterado.

##### Opções de Autenticação de Alterar Usuário

O nome da conta pode ser seguido por uma opção de autenticação *`auth_option`* que especifica o plugin de autenticação da conta, as credenciais ou ambos:

- *`auth_plugin`* nomeia um plugin de autenticação. O nome do plugin pode ser uma literal de string com aspas ou um nome não citado. Os nomes dos plugins são armazenados na coluna `plugin` da tabela `mysql.user` do sistema.

  Para a sintaxe de *`auth_option`* que não especifica um plugin de autenticação, o plugin padrão é indicado pelo valor da variável de sistema `default_authentication_plugin`. Para descrições de cada plugin, consulte Seção 6.4.1, “Plugins de Autenticação”.

- As credenciais são armazenadas na tabela `mysql.user` do sistema. Um valor de `'auth_string'` especifica as credenciais da conta, seja como uma string em texto claro (não criptografada) ou criptografada no formato esperado pelo plugin de autenticação associado à conta, respectivamente:

  - Para sintaxe que usa `BY 'auth_string'`, a string é em texto claro e é passada para o plugin de autenticação para possível hashing. O resultado retornado pelo plugin é armazenado na tabela `mysql.user`. Um plugin pode usar o valor conforme especificado, nesse caso, nenhum hashing ocorre.

  - Para a sintaxe que usa `AS 'auth_string'`, a string é assumida como já no formato exigido pelo plugin de autenticação e é armazenada como está na tabela `mysql.user`. Se um plugin exigir um valor criptografado, o valor deve estar já criptografado em um formato apropriado para o plugin, caso contrário, o valor não pode ser usado pelo plugin e a autenticação correta das conexões do cliente não pode ocorrer.

  - Se um plugin de autenticação não realizar hashing da string de autenticação, as cláusulas `BY 'auth_string'` e `AS 'auth_string'` terão o mesmo efeito: a string de autenticação é armazenada como está na tabela de sistema `mysql.user`.

`ALTER USER` permite essas sintáticas do *`auth_option`*:

- `IDENTIFICADO POR 'auth_string'`

  Configura o plugin de autenticação da conta como o plugin padrão, passa o valor `'auth_string'` em texto claro para o plugin para possível hashing e armazena o resultado na linha da conta na tabela de sistema `mysql.user`.

- `IDENTIFICADO COM auth_plugin`

  Define o plugin de autenticação da conta para *`auth_plugin`*, limpa as credenciais para uma string vazia (as credenciais estão associadas ao antigo plugin de autenticação, e não ao novo), e armazena o resultado na linha da conta na tabela `mysql.user` do sistema.

  Além disso, a senha está marcada como expirada. O usuário deve escolher uma nova senha na próxima conexão.

- `IDENTIFICADO COM auth_plugin POR 'auth_string'`

  Configura o plugin de autenticação da conta para *`auth_plugin`*, passa o valor `'auth_string'` em texto claro para o plugin para possível hashing e armazena o resultado na linha da conta na tabela `mysql.user` do sistema.

- `IDENTIFICADO COM auth_plugin COMO 'auth_string'`

  Define o plugin de autenticação da conta para *`auth_plugin`* e armazena o valor `'auth_string'` como está na linha da conta `mysql.user`. Se o plugin exigir uma string hash, presume-se que a string já esteja hash em o formato exigido pelo plugin.

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

Para obter informações adicionais sobre a configuração de senhas e plugins de autenticação, consulte Seção 6.2.10, “Atribuição de Senhas de Conta” e Seção 6.2.13, “Autenticação Personalizável”.

##### ALTERAR OPÇÕES DE SSL/TLS DO USUÁRIO

O MySQL pode verificar os atributos do certificado X.509, além da autenticação usual, que é baseada no nome do usuário e nas credenciais. Para informações de fundo sobre o uso do SSL/TLS com o MySQL, consulte Seção 6.3, “Usando Conexões Encriptadas”.

Para especificar opções relacionadas ao SSL/TLS para uma conta MySQL, use uma cláusula `REQUIRE` que especifique um ou mais valores de *`tls_option`*.

A ordem das opções `REQUIRE` não importa, mas nenhuma opção pode ser especificada duas vezes. A palavra-chave `AND` é opcional entre as opções `REQUIRE`.

`ALTER USER` permite esses valores de *`tls_option`*:

- `NÃO HÁ`

  Indica que todas as contas mencionadas na declaração não têm requisitos de SSL ou X.509. Conexões não criptografadas são permitidas se o nome do usuário e a senha forem válidos. Conexões criptografadas podem ser usadas, a critério do cliente, se o cliente tiver os arquivos de certificado e chave apropriados.

  ```sql
  ALTER USER 'jeffrey'@'localhost' REQUIRE NONE;
  ```

  Os clientes tentam estabelecer uma conexão segura por padrão. Para clientes que têm `REQUIRE NONE`, a tentativa de conexão é revertida para uma conexão não criptografada se uma conexão segura não puder ser estabelecida. Para exigir uma conexão criptografada, um cliente precisa especificar apenas a opção `--ssl-mode=REQUIRED`; a tentativa de conexão falha se uma conexão segura não puder ser estabelecida.

- `SSL`

  Instrui o servidor a permitir apenas conexões criptografadas para todas as contas nomeadas pelo comando.

  ```sql
  ALTER USER 'jeffrey'@'localhost' REQUIRE SSL;
  ```

  Os clientes tentam estabelecer uma conexão segura por padrão. Para contas que têm `REQUER SSL`, a tentativa de conexão falha se uma conexão segura não puder ser estabelecida.

- `X509`

  Para todas as contas mencionadas na declaração, é necessário que os clientes apresentem um certificado válido, mas o certificado exato, o emissor e o assunto não importam. O único requisito é que seja possível verificar sua assinatura com um dos certificados CA. O uso de certificados X.509 sempre implica criptografia, portanto, a opção `SSL` é desnecessária neste caso.

  ```sql
  ALTER USER 'jeffrey'@'localhost' REQUIRE X509;
  ```

  Para contas com `REQUIRE X509`, os clientes devem especificar as opções `--ssl-key` e `--ssl-cert` para se conectarem. (Recomenda-se, mas não é obrigatório, que a opção `--ssl-ca` também seja especificada para que o certificado público fornecido pelo servidor possa ser verificado.) Isso é válido para `ISSUER` e `SUBJECT` também, pois essas opções `REQUIRE` implicam os requisitos de `X509`.

- `ISSUER 'emissor'`

  Para todas as contas mencionadas na declaração, é necessário que os clientes apresentem um certificado X.509 válido emitido pela CA `'emissor'`. Se um cliente apresentar um certificado válido, mas com um emissor diferente, o servidor rejeitará a conexão. O uso de certificados X.509 sempre implica criptografia, portanto, a opção `SSL` não é necessária neste caso.

  ```sql
  ALTER USER 'jeffrey'@'localhost'
    REQUIRE ISSUER '/C=SE/ST=Stockholm/L=Stockholm/
      O=MySQL/CN=CA/emailAddress=ca@example.com';
  ```

  Como `ISSUER` implica nos requisitos de `X509`, os clientes devem especificar as opções `--ssl-key` e `--ssl-cert` para se conectarem. (Recomenda-se, mas não é obrigatório, que a opção `--ssl-ca` também seja especificada para que o certificado público fornecido pelo servidor possa ser verificado.)

- `ASSUNTO 'assunto'`

  Para todas as contas mencionadas na declaração, é necessário que os clientes apresentem um certificado X.509 válido contendo o sujeito *`subject`*. Se um cliente apresentar um certificado válido, mas com um sujeito diferente, o servidor rejeitará a conexão. O uso de certificados X.509 sempre implica criptografia, portanto, a opção `SSL` não é necessária neste caso.

  ```sql
  ALTER USER 'jeffrey'@'localhost'
    REQUIRE SUBJECT '/C=SE/ST=Stockholm/L=Stockholm/
      O=MySQL demo client certificate/
      CN=client/emailAddress=client@example.com';
  ```

  O MySQL faz uma comparação simples de strings do valor `'subject'` com o valor no certificado, então a maiúscula e a ordem dos componentes devem ser exatamente como estão no certificado.

  Como `SUBJECT` implica nos requisitos de `X509`, os clientes devem especificar as opções `--ssl-key` e `--ssl-cert` para se conectarem. (Recomenda-se, mas não é obrigatório, que a opção `--ssl-ca` também seja especificada para que o certificado público fornecido pelo servidor possa ser verificado.)

- `CIPHER 'cifra'`

  Para todas as contas mencionadas na declaração, é necessário um método de cifra específico para criptografar as conexões. Esta opção é necessária para garantir que sejam usadas cifras e comprimentos de chave de força suficiente. A criptografia pode ser fraca se forem usados algoritmos antigos que utilizam chaves de criptografia curtas.

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

##### ALTERAR USUÁRIO Opções de Limite de Recursos

É possível definir limites de uso dos recursos do servidor para uma conta, conforme discutido em Seção 6.2.16, “Definir Limites de Recursos da Conta”. Para fazer isso, use uma cláusula `WITH` que especifique um ou mais valores de *`resource_option`*.

A ordem das opções `WITH` não importa, exceto que, se um limite de recurso específico for especificado várias vezes, a última instância terá precedência.

`ALTER USER` permite esses valores de *`resource_option`*:

- `MAX_QUERIES_PER_HOUR count`, `MAX_UPDATES_PER_HOUR count`, `MAX_CONNECTIONS_PER_HOUR count`

  Para todas as contas mencionadas na declaração, essas opções restringem quantas consultas, atualizações e conexões ao servidor são permitidas para cada conta durante um período de uma hora. (Consultas para as quais os resultados são servidos a partir do cache de consultas não contam para o limite `MAX_QUERIES_PER_HOUR`.) Se *`count`* for `0` (o padrão), isso significa que não há limitação para a conta.

- `MAX_USER_CONNECTIONS`

  Para todas as contas mencionadas na declaração, restringe o número máximo de conexões simultâneas ao servidor por cada conta. Um valor de *`count`* não nulo especifica o limite para a conta explicitamente. Se *`count`* for `0` (o padrão), o servidor determina o número de conexões simultâneas para a conta a partir do valor global da variável de sistema `max_user_connections`. Se `max_user_connections` também for zero, não há limite para a conta.

Exemplo:

```sql
ALTER USER 'jeffrey'@'localhost'
  WITH MAX_QUERIES_PER_HOUR 500 MAX_UPDATES_PER_HOUR 100;
```

##### ALTERAR USUÁRIO Opções de Gerenciamento de Senhas

`ALTERAR USUÁRIO` suporta vários valores de `password_option` para a gestão da expiração da senha, para expirar manualmente a senha de uma conta ou estabelecer sua política de expiração da senha. As opções de política não expiram a senha. Em vez disso, elas determinam como o servidor aplica a expiração automática à conta com base na idade da senha da conta. Para uma conta específica, sua idade da senha é avaliada a partir da data e hora da última alteração da senha.

Esta seção descreve a sintaxe das opções de gerenciamento de senhas. Para informações sobre a definição de políticas para o gerenciamento de senhas, consulte Seção 6.2.11, “Gerenciamento de Senhas”.

Se várias opções de gerenciamento de senhas forem especificadas, a última terá precedência.

Essas opções se aplicam apenas às contas que utilizam um plugin de autenticação que armazena credenciais internamente no MySQL. Para contas que utilizam um plugin que realiza autenticação contra um sistema de credenciais externo ao MySQL, o gerenciamento de senhas deve ser realizado externamente contra esse sistema também. Para mais informações sobre o armazenamento interno de credenciais, consulte Seção 6.2.11, “Gerenciamento de Senhas”.

Uma sessão de cliente opera no modo restrito se a senha da conta expirou manualmente ou se a idade da senha for considerada maior que sua vida útil permitida de acordo com a política de expiração automática. No modo restrito, as operações realizadas durante a sessão resultam em um erro até que o usuário estabeleça uma nova senha de conta. Para obter informações sobre o modo restrito, consulte Seção 6.2.12, “Tratamento do servidor de senhas expiradas”.

Nota

Embora seja possível "redefinir" uma senha expirada, definindo-a para seu valor atual, é preferível, por questão de boa política, escolher uma senha diferente.

O `ALTER USER` permite esses valores de `password_option` para controlar a expiração da senha:

- `SENHA EXPIRA`

  Marca imediatamente a senha expirada para todas as contas nomeadas pelo comunicado.

  ```sql
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE;
  ```

- `DESATIVAR A EXPIRAÇÃO DA SENHA POR DEFECTO`

  Define todas as contas nomeadas pela declaração para que a política de expiração global seja aplicada, conforme especificado pela variável de sistema `default_password_lifetime`.

  ```sql
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE DEFAULT;
  ```

- `SENHA EXPIRA NUNCA`

  Essa opção de expiração substitui a política global para todas as contas nomeadas pelo extrato. Para cada uma, ela desabilita a expiração da senha para que a senha nunca expire.

  ```sql
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE NEVER;
  ```

- `INTERVALO DE EXPIRAÇÃO DA SENHA N DIAS`

  Esta opção de expiração substitui a política global para todas as contas nomeadas pelo extrato. Para cada uma, ela define a duração da senha para *`N`* dias. A seguinte declaração exige que a senha seja alterada a cada 180 dias:

  ```sql
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE INTERVAL 180 DAY;
  ```

##### ALTERAR USUÁRIO Opções de Bloqueio de Conta

O MySQL suporta o bloqueio e desbloqueio de contas usando as opções `ACCOUNT LOCK` e `ACCOUNT UNLOCK`, que especificam o estado de bloqueio de uma conta. Para uma discussão adicional, consulte Seção 6.2.15, “Bloqueio de Conta”.

Se várias opções de bloqueio de conta forem especificadas, a última tem precedência.
