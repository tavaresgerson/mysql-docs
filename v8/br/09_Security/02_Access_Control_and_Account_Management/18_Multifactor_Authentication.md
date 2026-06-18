### 8.2.18 Autenticação Multifator

A autenticação envolve uma parte estabelecendo sua identidade para a satisfação de uma segunda parte. A autenticação multifatorial (MFA) é o uso de múltiplos valores de autenticação (ou “fatores”) durante o processo de autenticação. A MFA oferece maior segurança do que a autenticação de um fator/único fator (1FA/SFA), que usa apenas um método de autenticação, como uma senha. A MFA permite métodos de autenticação adicionais, como autenticação usando múltiplas senhas ou autenticação usando dispositivos como cartões inteligentes, chaves de segurança e leitores biométricos.

O MySQL 8.0.27 e versões superiores incluem suporte para autenticação multifator. Essa capacidade inclui formas de MFA que exigem até três valores de autenticação. Ou seja, o gerenciamento de contas do MySQL suporta contas que usam 2FA ou 3FA, além do suporte existente para 1FA.

Quando um cliente tenta se conectar ao servidor MySQL usando uma conta de fator único, o servidor invoca o plugin de autenticação indicado pela definição da conta e aceita ou rejeita a conexão, dependendo se o plugin relata sucesso ou falha.

Para uma conta que possui vários fatores de autenticação, o processo é semelhante. O servidor invoca os plugins de autenticação na ordem listada na definição da conta. Se um plugin relatar sucesso, o servidor aceita a conexão se o plugin for o último, ou prossegue para invocar o próximo plugin se houver algum restante. Se algum plugin relatar falha, o servidor rejeita a conexão.

As seções a seguir abordam a autenticação multifator no MySQL com mais detalhes.

- Elementos de suporte à Autenticação Multifator
- Configurando a Política de Autenticação Multifator
- Começando com Autenticação Multifator

#### Elementos de suporte à Autenticação Multifator

Os fatores de autenticação geralmente incluem esses tipos de informações:

- Algo que você conhece, como uma senha ou frase secreta.
- Algo que você tenha, como uma chave de segurança ou um cartão inteligente.
- Algo que você é; ou seja, uma característica biométrica, como uma impressão digital ou uma varredura facial.

O tipo de fator "algo que você sabe" depende de informações que são mantidas em segredo em ambos os lados do processo de autenticação. Infelizmente, os segredos podem ser comprometidos: alguém pode ver você digitar sua senha ou enganá-lo com um ataque de phishing, uma senha armazenada no lado do servidor pode ser exposta por uma violação de segurança, e assim por diante. A segurança pode ser melhorada usando múltiplas senhas, mas cada uma ainda pode ser comprometida. O uso dos outros tipos de fatores permite uma segurança melhorada com menos risco de comprometimento.

A implementação da autenticação multifator no MySQL compreende esses elementos:

- A variável de sistema `authentication_policy` controla quantos fatores de autenticação podem ser usados e os tipos de autenticação permitidos para cada fator. Isso significa que ela estabelece restrições para as instruções `CREATE USER` e `ALTER USER` em relação à autenticação multifator.

- `CREATE USER` e `ALTER USER` têm sintaxe que permite especificar vários métodos de autenticação para novas contas e para adicionar, modificar ou remover métodos de autenticação para contas existentes. Se uma conta usa 2FA ou 3FA, a tabela `mysql.user` do sistema armazena informações sobre os fatores de autenticação adicionais na coluna `User_attributes`.

- Para habilitar a autenticação no servidor MySQL usando contas que exigem múltiplas senhas, os programas cliente têm as opções `--password1`, `--password2` e `--password3` que permitem especificar até três senhas. Para aplicações que usam a API C, a opção `MYSQL_OPT_USER_PASSWORD` para a função `mysql_options4()` da API C habilita a mesma capacidade.

- O plugin `authentication_fido` do lado do servidor (desatualizado) permite a autenticação usando dispositivos. Este plugin de autenticação FIDO do lado do servidor está incluído apenas nas distribuições da Edição Empresarial do MySQL. Ele não está incluído nas distribuições comunitárias do MySQL. No entanto, o plugin `authentication_fido_client` do lado do cliente (desatualizado) está incluído em todas as distribuições, incluindo as comunitárias. Isso permite que clientes de qualquer distribuição se conectem a contas que usam `authentication_fido` para se autenticarem em um servidor que tenha esse plugin carregado. Veja a Seção 8.4.1.11, “FIDO Pluggable Authentication”.

- `authentication_fido` também permite a autenticação sem senha, se for o único plugin de autenticação usado por uma conta. Veja Autenticação sem Senha FIDO.

- A autenticação multifator pode usar métodos de autenticação MySQL não FIDO, o método de autenticação FIDO ou uma combinação de ambos.

- Esses privilégios permitem que os usuários realizem certas operações relacionadas à autenticação multifator restritas:

  - Um usuário que possui o privilégio `AUTHENTICATION_POLICY_ADMIN` não está sujeito às restrições impostas pela variável de sistema `authentication_policy`. (Uma mensagem de aviso é exibida para declarações que, de outra forma, não seriam permitidas.)

  - O privilégio `PASSWORDLESS_USER_ADMIN` permite a criação de contas de autenticação sem senha e a replicação de operações nelas.

#### Configurando a Política de Autenticação Multifator

A variável de sistema `authentication_policy` define a política de autenticação multifator. Especificamente, ela define quantos fatores de autenticação as contas podem ter (ou são obrigadas a ter) e os métodos de autenticação que podem ser usados para cada fator.

O valor de `authentication_policy` é uma lista de 1, 2 ou 3 elementos separados por vírgula. Cada elemento na lista corresponde a um fator de autenticação e pode ser o nome de um plugin de autenticação, um asterisco (`*`), vazio ou ausente. (Exceção: o elemento 1 não pode ser vazio ou ausente.) A lista inteira está entre aspas simples. Por exemplo, o seguinte valor de `authentication_policy` inclui um asterisco, o nome de um plugin de autenticação e um elemento vazio:

```
authentication_policy = '*,authentication_fido,'
```

Um asterisco (`*`) indica que um método de autenticação é necessário, mas qualquer método é permitido. Um elemento vazio indica que um método de autenticação é opcional e qualquer método é permitido. Um elemento ausente (sem asterisco, elemento vazio ou nome do plugin de autenticação) indica que um método de autenticação não é permitido. Quando um nome de plugin é especificado, esse método de autenticação é necessário para o respectivo fator ao criar ou modificar uma conta.

O valor padrão `authentication_policy` é `'*,,'` (um asterisco e dois elementos vazios), que requer um primeiro fator e, opcionalmente, permite o segundo e terceiro fatores. O valor padrão `authentication_policy` é, portanto, compatível com a backward existing de contas 1FA, mas também permite a criação ou modificação de contas para usar 2FA ou 3FA.

Um usuário que possui o privilégio `AUTHENTICATION_POLICY_ADMIN` não está sujeito às restrições impostas pelo ajuste `authentication_policy`. (Um aviso ocorre para declarações que, de outra forma, não seriam permitidas.)

Os valores de `authentication_policy` podem ser definidos em um arquivo de opções ou especificados usando uma declaração `SET GLOBAL`:

```
SET GLOBAL authentication_policy='*,*,';
```

Existem várias regras que regem a forma como o valor `authentication_policy` pode ser definido. Consulte a descrição da variável de sistema `authentication_policy` para uma conta completa dessas regras. A tabela a seguir fornece vários valores de exemplo de `authentication_policy` e a política estabelecida por cada um.

**Tabela 8.11 Exemplos de valores da política de autenticação**

<table summary="Exemplos de valores de autenticação_policy e seus significados."><thead><tr> <th>política_de_autenticação Valor</th> <th>Política eficaz</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>auth_plugin</code>]</td> <td>Permita apenas a criação ou alteração de contas com um fator.</td> </tr><tr> <td>[[PH_HTML_CODE_<code>auth_plugin</code>]</td> <td>Permita apenas a criação ou alteração de contas com dois fatores.</td> </tr><tr> <td>[[<code>'*,*,*'</code>]]</td> <td>Permita apenas a criação ou alteração de contas com três fatores.</td> </tr><tr> <td>[[<code>'*,'</code>]]</td> <td>Permita a criação ou alteração de contas com um ou dois fatores.</td> </tr><tr> <td>[[<code>'*,,'</code>]]</td> <td>Permita a criação ou alteração de contas com um, dois ou três fatores.</td> </tr><tr> <td>[[<code>'*,*,'</code>]]</td> <td>Permita a criação ou alteração de contas com dois ou três fatores.</td> </tr><tr> <td>[[<code>'*,<em class="replaceable"><code>auth_plugin</code>]]</em>'</code></td> <td>Permita a criação ou alteração de contas com dois fatores, onde o primeiro fator pode ser qualquer método de autenticação e o segundo fator deve ser o plugin nomeado.</td> </tr><tr> <td>[[<code>'<em class="replaceable"><code>auth_plugin</code>]]</em>,*,'</code></td> <td>Permita a criação ou alteração de contas com dois ou três fatores, onde o primeiro fator deve ser o plugin nomeado.</td> </tr><tr> <td>[[<code>'<em class="replaceable"><code>auth_plugin</code>]]</em>"</code></td> <td>Permita a criação ou alteração de contas com um ou dois fatores, onde o primeiro fator deve ser o plugin nomeado.</td> </tr><tr> <td>[[<code>'<em class="replaceable"><code>auth_plugin</code>]]</em>,<em class="replaceable">[[<code>auth_plugin</code>]]</em>,<em class="replaceable">[[<code>'*,*'</code><code>auth_plugin</code>]</em>'</code></td> <td>Permite criar ou alterar contas com três fatores, onde os fatores devem usar os plugins nomeados.</td> </tr></tbody></table>

#### Começando com Autenticação Multifator

Por padrão, o MySQL usa uma política de autenticação multifator que permite qualquer plugin de autenticação para o primeiro fator e, opcionalmente, permite o segundo e terceiro fatores de autenticação. Essa política é configurável; para detalhes, consulte Configurando a Política de Autenticação Multifator.

Nota

Não é permitido usar quaisquer plugins de armazenamento de credenciais internas (`caching_sha2_password` ou `mysql_native_password`) para o fator 2 ou 3.

Suponha que você queira que uma conta se autentique primeiro usando o plugin `caching_sha2_password` e, em seguida, usando o plugin SASL LDAP `authentication_ldap_sasl`. (Isso pressupõe que a autenticação LDAP já esteja configurada conforme descrito na Seção 8.4.1.7, “Autenticação Conectada a LDAP” e que o usuário tenha uma entrada no diretório LDAP que corresponda à string de autenticação mostrada no exemplo.) Crie a conta usando uma declaração como esta:

```
CREATE USER 'alice'@'localhost'
  IDENTIFIED WITH caching_sha2_password
    BY 'sha2_password'
  AND IDENTIFIED WITH authentication_ldap_sasl
    AS 'uid=u1_ldap,ou=People,dc=example,dc=com';
```

Para se conectar, o usuário deve fornecer duas senhas. Para habilitar a autenticação no servidor MySQL usando contas que exigem múltiplas senhas, os programas cliente têm as opções `--password1`, `--password2` e `--password3` que permitem especificar até três senhas. Essas opções são semelhantes à opção `--password`, pois podem receber um valor de senha após a opção na linha de comando (o que é inseguro) ou, se fornecido sem um valor de senha, o usuário será solicitado a fornecer uma. Para a conta recém-criada, os fatores 1 e 2 exigem senhas, então inicie o cliente **mysql** com as opções `--password1` e `--password2`. O **mysql** solicita cada senha uma a uma:

```
$> mysql --user=alice --password1 --password2
Enter password: (enter factor 1 password)
Enter password: (enter factor 2 password)
```

Suponha que você queira adicionar um terceiro fator de autenticação. Isso pode ser feito excluindo e recriando o usuário com um terceiro fator ou usando a sintaxe `ALTER USER user ADD factor`. Ambos os métodos são mostrados abaixo:

```
DROP USER 'alice'@'localhost';

CREATE USER 'alice'@'localhost'
  IDENTIFIED WITH caching_sha2_password
    BY 'sha2_password'
  AND IDENTIFIED WITH authentication_ldap_sasl
    AS 'uid=u1_ldap,ou=People,dc=example,dc=com'
  AND IDENTIFIED WITH authentication_fido;
```

A sintaxe `ADD factor` inclui o número do fator e a palavra-chave `FACTOR`:

```
ALTER USER 'alice'@'localhost' ADD 3 FACTOR IDENTIFIED WITH authentication_fido;
```

A sintaxe `ALTER USER user DROP factor` permite a remoção de um fator. O exemplo a seguir remove o terceiro fator (`authentication_fido`) que foi adicionado no exemplo anterior:

```
ALTER USER 'alice'@'localhost' DROP 3 FACTOR;
```

A sintaxe `ALTER USER user MODIFY factor` permite alterar o plugin ou a string de autenticação para um fator específico, desde que o fator exista. O exemplo a seguir modifica o segundo fator, alterando o método de autenticação de `authentication_ldap_sasl` para `authetication_fido`:

```
ALTER USER 'alice'@'localhost' MODIFY 2 FACTOR IDENTIFIED WITH authentication_fido;
```

Use `SHOW CREATE USER` para visualizar os métodos de autenticação definidos para uma conta:

```
SHOW CREATE USER 'u1'@'localhost'\G
*************************** 1. row ***************************
CREATE USER for u1@localhost: CREATE USER `u1`@`localhost`
IDENTIFIED WITH 'caching_sha2_password' AS 'sha2_password'
AND IDENTIFIED WITH 'authentication_fido' REQUIRE NONE
PASSWORD EXPIRE DEFAULT ACCOUNT UNLOCK PASSWORD HISTORY
DEFAULT PASSWORD REUSE INTERVAL DEFAULT PASSWORD REQUIRE
CURRENT DEFAULT
```
