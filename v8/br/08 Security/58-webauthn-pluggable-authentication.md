#### 8.4.1.11 Autenticação Pluggable WebAuthn

::: info Nota

A autenticação WebAuthn é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

:::

A Edição Empresarial do MySQL suporta um método de autenticação que permite que os usuários se autentiquem no MySQL Server usando a autenticação WebAuthn.

WebAuthn significa Autenticação Web, que é um padrão da web publicado pelo World Wide Web Consortium (W3C) e APIs de aplicativos da web que adicionam autenticação baseada em FIDO a navegadores e plataformas suportadas.

A autenticação pluggable WebAuthn substitui a autenticação pluggable FIDO, que está desatualizada. A autenticação pluggable WebAuthn suporta dispositivos FIDO e FIDO2.

A autenticação pluggable WebAuthn oferece essas capacidades:

* A WebAuthn permite a autenticação no MySQL Server usando dispositivos como cartões inteligentes, chaves de segurança e leitores biométricos.
* Como a autenticação pode ocorrer de forma diferente da fornecimento de uma senha, a WebAuthn permite a autenticação sem senha.
* Por outro lado, a autenticação de dispositivo é frequentemente usada em conjunto com a autenticação por senha, então a autenticação WebAuthn pode ser usada com sucesso para contas do MySQL que usam autenticação multifator; consulte a Seção 8.2.18, “Autenticação Multifator”.

A tabela a seguir mostra os nomes dos arquivos de plugin e biblioteca. O sufixo do nome do arquivo pode diferir no seu sistema. Sufixos comuns são `.so` para sistemas Unix e Unix-like, e `.dll` para Windows. O arquivo deve estar localizado no diretório nomeado pela variável de sistema `plugin_dir`. Para informações de instalação, consulte Instalando Autenticação Pluggable WebAuthn.

**Tabela 8.26 Nomes de Plugin e Biblioteca para Autenticação WebAuthn**

<table><thead><tr> <th>Plugin ou Arquivo</th> <th>Nome do Plugin ou Arquivo</th> </tr></thead><tbody><tr> <td>Plugin do lado do servidor</td> <td><code>authentication_webauthn</code></td> </tr><tr> <td>Plugin do lado do cliente</td> <td><code>authentication_webauthn_client</code></td> </tr><tr> <td>Arquivo de biblioteca</td> <td><code>authentication_webauthn.so</code>, <code>authentication_webauthn_client.so</code></td> </tr></tbody></table>

::: info Nota

A biblioteca `libfido2` deve estar disponível em sistemas onde o plugin de autenticação WebAuthn do lado do servidor ou do lado do cliente é usado.

:::

O plugin de autenticação WebAuthn do lado do servidor está incluído apenas na Edição Empresarial do MySQL. Ele não está incluído nas distribuições comunitárias do MySQL. O plugin do lado do cliente está incluído em todas as distribuições, incluindo as distribuições comunitárias, o que permite que clientes de qualquer distribuição se conectem a um servidor que tenha o plugin do lado do servidor carregado.

As seções a seguir fornecem informações de instalação e uso específicas para a autenticação de autenticação plugável WebAuthn:

*  Instalando Autenticação de Autenticação Plugável WebAuthn
*  Usando Autenticação de Autenticação WebAuthn
*  Autenticação WebAuthn sem Senha
*  Desregistrando Dispositivos para WebAuthn
*  Como a Autenticação WebAuthn de Usuários do MySQL Funciona

Para informações gerais sobre autenticação plugável no MySQL, consulte a Seção 8.2.17, “Autenticação Plugável”.

##### Instalando Autenticação de Autenticação Plugável WebAuthn

Esta seção descreve como instalar o plugin de autenticação WebAuthn do lado do servidor. Para informações gerais sobre como instalar plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para ser utilizável pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin do MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` no início do servidor.

O nome base do arquivo da biblioteca de plugins do lado do servidor é `authentication_webauthn`. O sufixo do nome do arquivo difere conforme a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Antes de instalar o plugin do lado do servidor, defina um nome único para o ID da parte confiável (usado para registro e autenticação de dispositivos), que é o servidor MySQL. Inicie o servidor usando a opção `--loose-authentication-webauthn-rp-id=value`. O exemplo aqui especifica o valor `mysql.com` como o ID da parte confiável. Substitua esse valor por um que atenda às suas necessidades.

```
$> mysqld [options] --loose-authentication-webauthn-rp-id=mysql.com
```

::: info Nota

Para replicação, use o mesmo valor `authentication_webauthn_rp_id` em todos os nós se um usuário estiver esperando para se conectar a vários servidores.

:::

Para definir a parte confiável e carregar o plugin no início do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que o contém, ajustando o sufixo `.so` para sua plataforma conforme necessário. Com esse método de carregamento de plugins, a opção deve ser dada toda vez que o servidor for iniciado.

```
$> mysqld [options]
    --loose-authentication-webauthn-rp-id=mysql.com
    --plugin-load-add=authentication_webauthn.so
```

Para definir a parte confiável e carregar o plugin, coloque linhas como esta no seu arquivo `my.cnf`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
[mysqld]
plugin-load-add=authentication_webauthn.so
authentication_webauthn_rp_id=mysql.com
```

Após modificar o `my.cnf`, reinicie o servidor para fazer com que o novo ajuste entre em vigor.

Alternativamente, para carregar o plugin em tempo de execução, use esta declaração, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
INSTALL PLUGIN authentication_webauthn
  SONAME 'authentication_webauthn.so';
```

 `INSTALL PLUGIN` carrega o plugin imediatamente e também o registra na tabela `mysql.plugins` do sistema para fazer com que o servidor o carregue para cada inicialização normal subsequente sem a necessidade de `--plugin-load-add`.

Para verificar a instalação do plugin, examine a tabela do esquema de informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (veja a Seção 7.6.2, “Obtendo Informações de Plugins do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME = 'authentication_webauthn';
+-------------------------+---------------+
| PLUGIN_NAME             | PLUGIN_STATUS |
+-------------------------+---------------+
| authentication_webauthn | ACTIVE        |
+-------------------------+---------------+
```

Se um plugin não conseguir inicializar, verifique o log de erro do servidor para mensagens de diagnóstico.

Para associar contas MySQL ao plugin de autenticação WebAuthn, consulte Usar autenticação WebAuthn.

##### Usar autenticação WebAuthn

A autenticação WebAuthn é tipicamente usada no contexto da autenticação multifator (consulte a Seção 8.2.18, “Autenticação Multifator”). Esta seção mostra como incorporar a autenticação baseada em dispositivos WebAuthn em uma conta multifator, usando o plugin `authentication_webauthn`.

No contexto da discussão a seguir, assume-se que o servidor está rodando com o plugin de autenticação WebAuthn do lado do servidor habilitado, conforme descrito em Instalando Pluggable Authentication WebAuthn, e que o plugin WebAuthn do lado do cliente está disponível no diretório de plugins do host do cliente.

::: info Nota

No Windows, a autenticação WebAuthn só funciona se o processo do cliente estiver rodando como um usuário com privilégios de administrador. Também pode ser necessário adicionar a localização do seu dispositivo FIDO/FIDO2 ao ambiente variável `PATH` do host do cliente.

:::

Também assume-se que a autenticação WebAuthn é usada em conjunto com a autenticação não WebAuthn (o que implica em uma conta de 2FA ou 3FA). O WebAuthn também pode ser usado por si só para criar contas de 1FA que se autenticam de forma sem senha. Neste caso, o processo de configuração difere um pouco. Para instruções, consulte Autenticação WebAuthn Sem Senha.

Uma conta configurada para usar o plugin `authentication_webauthn` está associada a um dispositivo Fast Identity Online (FIDO/FIDO2). Por isso, é necessário realizar uma etapa de registro do dispositivo única antes que a autenticação WebAuthn possa ocorrer. O processo de registro do dispositivo tem estas características:

* Qualquer dispositivo FIDO/FIDO2 associado a uma conta deve ser registrado antes que a conta possa ser usada.
* O registro exige que um dispositivo FIDO/FIDO2 esteja disponível no host do cliente, ou o registro falha.
* Espera-se que o usuário realize a ação apropriada do dispositivo FIDO/FIDO2 quando solicitado durante o registro (por exemplo, tocando no dispositivo ou realizando uma varredura biométrica).
* Para realizar o registro do dispositivo, o usuário do cliente deve invocar o programa cliente `mysql` e especificar a opção `--register-factor` para especificar o fator ou fatores para os quais um dispositivo está sendo registrado. Por exemplo, se a conta estiver configurada para usar o WebAuthn como o segundo fator de autenticação, o usuário invoca o `mysql` com a opção `--register-factor=2`.
* Se a conta do usuário estiver configurada com o plugin `authentication_webauthn` definido como o segundo ou terceiro fator, a autenticação para todos os fatores anteriores deve ser bem-sucedida antes que o passo de registro possa prosseguir.
* O servidor sabe, com base nas informações na conta do usuário, se o dispositivo FIDO/FIDO2 requer registro ou já foi registrado. Quando o programa cliente se conecta, o servidor coloca a sessão no modo sandbox se o dispositivo precisar ser registrado, para que o registro ocorra antes que qualquer outra coisa possa ser feita. O modo sandbox usado para o registro de dispositivos FIDO/FIDO2 é semelhante ao usado para o tratamento de senhas expiradas. Veja a Seção 8.2.16, “Tratamento do servidor de senhas expiradas”.
* No modo sandbox, não são permitidas declarações além de `ALTER USER`. O registro é realizado usando formas desta declaração. Quando invocado com a opção `--register-factor`, o cliente `mysql` gera as declarações `ALTER USER` necessárias para realizar o registro. Após o registro ter sido concluído, o servidor desativa a sessão do modo sandbox, e o cliente pode prosseguir normalmente. Para informações sobre as declarações `ALTER USER` geradas, consulte a descrição da opção `--register-factor`.
* Quando o registro do dispositivo foi realizado para a conta, o servidor atualiza a linha da tabela `mysql.user` para essa conta para atualizar o status de registro do dispositivo e armazenar a chave pública e o ID de credencial. (O servidor não retém o ID de credencial após o registro de um dispositivo FIDO2.)
* O passo de registro pode ser realizado apenas pelo usuário nomeado pela conta. Se um usuário tentar realizar o registro para outro usuário, ocorre um erro.
* O usuário deve usar o mesmo dispositivo FIDO/FIDO2 durante o registro e autenticação. Se, após registrar um dispositivo FIDO/FIDO2 no host do cliente, o dispositivo for redefinido ou um dispositivo diferente for inserido, a autenticação falha. Nesse caso, o dispositivo associado à conta deve ser desregistrado e o registro deve ser feito novamente.

Suponha que você queira que uma conta se autentique primeiro usando o plugin `caching_sha2_password`, depois usando o plugin `authentication_webauthn`. Crie uma conta multifator usando uma instrução como esta:

```
CREATE USER 'u2'@'localhost'
  IDENTIFIED WITH caching_sha2_password
    BY 'sha2_password'
  AND IDENTIFIED WITH authentication_webauthn;
```

Para se conectar, forneça a senha do fator 1 para satisfazer a autenticação para esse fator, e para iniciar o registro do dispositivo FIDO/FIDO2, defina o `--register-factor` para o fator 2.

```
$> mysql --user=u2 --password1 --register-factor=2
Enter password: (enter factor 1 password)
Please insert FIDO device and follow the instruction. Depending on the device,
you may have to perform gesture action multiple times.
1. Perform gesture action (Skip this step if you are prompted to enter device PIN).
2. Enter PIN for token device:
3. Perform gesture action for registration to complete.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 8
```

Após a senha do fator 1 ser aceita, a sessão do cliente entra no modo sandbox para que o registro do dispositivo possa ser realizado para o fator 2. Durante o registro, você é solicitado a realizar a ação apropriada do dispositivo FIDO/FIDO2, como tocar no dispositivo ou realizar uma varredura biométrica.

Opcionalmente, você pode invocar o programa cliente `mysql` e especificar a opção `--plugin-authentication-webauthn-client-preserve-privacy`. Se o dispositivo FIDO2 contiver várias credenciais detectáveis (chaves residentes) para um ID de parte que responde (RP) dado, essa opção permite escolher uma chave a ser usada para a asserção. Por padrão, a opção está definida como `FALSE`, indicando que as asserções devem ser criadas usando todas as chaves residentes para um ID de RP dado. Quando especificada com essa opção, o `mysql` solicita um PIN do dispositivo e lista todas as credenciais disponíveis para o ID de RP dado. Selecione uma chave e, em seguida, realize as instruções online restantes para completar a autenticação. O exemplo aqui assume que `mysql.com` é um ID de RP válido:

```
$> mysql --user=u2 --password1 --register-factor=2
     --plugin-authentication-webauthn-client-preserve-privacy
Enter password: (enter factor 1 password)
Enter PIN for token device:
Found following credentials for RP ID: mysql.com
[1]`u2`@`127.0.0.1`
[2]`u2`@`%`
Please select one(1...N):
1
Please insert FIDO device and perform gesture action for authentication to complete.
+----------------+
| CURRENT_USER() |
+----------------+
| u2@127.0.0.1   |
+----------------+
```

A opção `--plugin-authentication-webauthn-client-preserve-privacy` não tem efeito em dispositivos FIDO que não suportam a funcionalidade de chaves residentes.

Quando o processo de registro estiver concluído, a conexão com o servidor será permitida.

::: info Nota

A conexão com o servidor é permitida após o registro, independentemente dos fatores de autenticação adicionais na cadeia de autenticação da conta. Por exemplo, se a conta no exemplo anterior fosse definida com um terceiro fator de autenticação (usando autenticação não WebAuthn), a conexão seria permitida após um registro bem-sucedido sem autenticar o terceiro fator. No entanto, conexões subsequentes exigiriam autenticar todos os três fatores.


:::

##### Autenticação WebAuthn Sem Senha

Esta seção descreve como o WebAuthn pode ser usado por si só para criar contas de 1FA que se autenticam de maneira sem senha. Neste contexto, “sem senha” significa que a autenticação ocorre, mas usa um método diferente de uma senha, como uma chave de segurança ou varredura biométrica. Isso não se refere a uma conta que usa um plugin de autenticação baseado em senha para o qual a senha está vazia. Esse tipo de “sem senha” é completamente inseguro e não é recomendado.

Os seguintes pré-requisitos se aplicam ao uso do plugin `authentication_webauthn` para alcançar a autenticação sem senha:

* O usuário que cria uma conta de autenticação sem senha requer o privilégio `PASSWORDLESS_USER_ADMIN`, além do privilégio `CREATE USER`.
* O primeiro elemento do valor `authentication_policy` deve ser um asterisco (`*`) e não o nome de um plugin. Por exemplo, o valor padrão de `authentication_policy` suporta a habilitação da autenticação sem senha porque o primeiro elemento é um asterisco:

  ```
  authentication_policy='*,,'
  ```

  Para obter informações sobre a configuração do valor `authentication_policy`, consulte Configurando a Política de Autenticação Multifator.

Para usar `authentication_webauthn` como um método de autenticação sem senha, a conta deve ser criada com `authentication_webauthn` como o primeiro método de autenticação. A cláusula `INITIAL AUTHENTICATION IDENTIFIED BY` também deve ser especificada para o primeiro fator (não é suportada com fatores 2 ou 3). Esta cláusula especifica se uma senha gerada aleatoriamente ou especificada pelo usuário será usada para o registro do dispositivo FIDO/FIDO2. Após o registro do dispositivo, o servidor exclui a senha e modifica a conta para tornar `authentication_webauthn` o único método de autenticação (o método 1FA).

A sintaxe `CREATE USER` necessária é a seguinte:

```
CREATE USER user
  IDENTIFIED WITH authentication_webauthn
  INITIAL AUTHENTICATION IDENTIFIED BY {RANDOM PASSWORD | 'auth_string'};
```

O exemplo seguinte usa a sintaxe `RANDOM PASSWORD`:

```
mysql> CREATE USER 'u1'@'localhost'
         IDENTIFIED WITH authentication_webauthn
         INITIAL AUTHENTICATION IDENTIFIED BY RANDOM PASSWORD;
+------+-----------+----------------------+-------------+
| user | host      | generated password   | auth_factor |
+------+-----------+----------------------+-------------+
| u1   | localhost | 9XHK]M{l2rnD;VXyHzeF |           1 |
+------+-----------+----------------------+-------------+
```

Para realizar o registro, o usuário deve autenticar-se no servidor com a senha associada à cláusula `INITIAL AUTHENTICATION IDENTIFIED BY`, seja a senha gerada aleatoriamente, seja o valor `'auth_string'`. Se a conta foi criada como mostrado acima, o usuário executa este comando e cola a senha gerada aleatoriamente anterior (`9XHK]M{l2rnD;VXyHzeF`) na prompt:

```
$> mysql --user=u1 --password --register-factor=2
Enter password:
Please insert FIDO device and follow the instruction. Depending on the device,
you may have to perform gesture action multiple times.
1. Perform gesture action (Skip this step if you are prompted to enter device PIN).
2. Enter PIN for token device:
3. Perform gesture action for registration to complete.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 10
```

Alternativamente, use a opção `--plugin-authentication-webauthn-client-preserve-privacy` para selecionar uma credencial detectável para autenticação.

```
$> mysql --user=u1 --password --register-factor=2
     --plugin-authentication-webauthn-client-preserve-privacy
Enter password:
Enter PIN for token device:
Found following credentials for RP ID: mysql.com
[1]`u1`@`127.0.0.1`
[2]`u1`@`%`
Please select one(1...N):
1
Please insert FIDO device and perform gesture action for authentication to complete.
+----------------+
| CURRENT_USER() |
+----------------+
| u1@127.0.0.1   |
+----------------+
```

A opção `--register-factor=2` é usada porque a cláusula `INITIAL AUTHENTICATION IDENTIFIED BY` está atuando atualmente como o primeiro método de autenticação de fator. O usuário deve, portanto, fornecer a senha temporária usando o segundo fator. Em um registro bem-sucedido, o servidor remove a senha temporária e revisa a entrada da conta na tabela de sistema `mysql.user` para listar `authentication_webauthn` como o único método de autenticação (1FA).

Ao criar uma conta de autenticação sem senha, é importante incluir a cláusula `IDENTIFICADO PELO PRIMEIRO FATOR DE AUTENTICAÇÃO` na instrução `CREATE USER`. O servidor aceita uma instrução sem a cláusula, mas a conta resultante fica inutilizável porque não há como se conectar ao servidor para registrar o dispositivo. Suponha que você execute uma instrução como esta:

```
CREATE USER 'u2'@'localhost'
  IDENTIFIED WITH authentication_webauthn;
```

Tentativas subsequentes de usar a conta para se conectar falham assim:

```
$> mysql --user=u2 --skip-password
mysql: [Warning] Using a password on the command line can be insecure.
No FIDO device on client host.
ERROR 1 (HY000): Unknown MySQL error
```

::: info Nota

A autenticação sem senha é alcançada usando o protocolo Universal 2nd Factor (U2F), que não suporta medidas de segurança adicionais, como definir um PIN no dispositivo a ser registrado. Portanto, cabe ao titular do dispositivo garantir que o dispositivo seja manuseado de maneira segura.

:::

##### Desregistração do Dispositivo para WebAuthn

É possível desregistrar dispositivos FIDO/FIDO2 associados a uma conta MySQL. Isso pode ser desejável ou necessário em várias circunstâncias:

* Um dispositivo FIDO/FIDO2 deve ser substituído por um dispositivo diferente. O dispositivo anterior deve ser desregistrado e o novo dispositivo registrado.

  Neste caso, o proprietário da conta ou qualquer usuário que tenha o privilégio de `CREATE USER` pode desregistrar o dispositivo. O proprietário da conta pode registrar o novo dispositivo.
* Um dispositivo FIDO/FIDO2 é redefinido ou perdido. As tentativas de autenticação falharão até que o dispositivo atual seja desregistrado e uma nova inscrição seja realizada.

  Neste caso, o proprietário da conta, incapaz de se autenticar, não pode desregistrar o dispositivo atual e deve entrar em contato com o DBA (ou qualquer usuário que tenha o privilégio de `CREATE USER`) para fazê-lo. Então, o proprietário da conta pode reregistrar o dispositivo redefinido ou registrar um novo dispositivo.

Desregistrar um dispositivo FIDO/FIDO2 pode ser feito pelo proprietário da conta ou por qualquer usuário que tenha o privilégio de `CREATE USER`. Use a seguinte sintaxe:

```
ALTER USER user {2 | 3} FACTOR UNREGISTER;
```

Para re-registrar um dispositivo ou realizar uma nova inscrição, consulte as instruções em Usar Autenticação WebAuthn.

##### Como a Autenticação WebAuthn de Usuários do MySQL Funciona

Esta seção fornece uma visão geral de como o MySQL e o WebAuthn trabalham juntos para autenticar usuários do MySQL. Para exemplos que mostram como configurar contas do MySQL para usar os plugins de autenticação WebAuthn, consulte Usar Autenticação WebAuthn.

Uma conta que usa a autenticação WebAuthn deve realizar uma etapa de registro inicial do dispositivo antes de poder se conectar ao servidor. Após o registro do dispositivo, a autenticação pode prosseguir. O processo de registro do dispositivo WebAuthn é o seguinte:

1. O servidor envia um desafio aleatório, ID do usuário e ID da parte de confiança (que identifica de forma única um servidor) ao cliente no formato JSON. O ID da parte de confiança é definido pela variável de sistema `authentication_webauthn_rp_id`. O valor padrão é `mysql.com`.
2. O cliente recebe essa informação e a envia ao plugin de autenticação WebAuthn do lado do cliente, que, por sua vez, a fornece ao dispositivo FIDO/FIDO2. O cliente também envia uma capacidade de 1 byte, com o bit RESIDENT_KEYS definido como `ON` (se for um dispositivo FIDO2) ou `OFF`.
3. Após o usuário ter realizado a ação apropriada do dispositivo (por exemplo, tocar no dispositivo ou realizar uma varredura biométrica), o dispositivo FIDO/FIDO2 gera um par de chaves pública/privada, um handle de chave, um certificado X.509 e uma assinatura, que é devolvido ao servidor.
4. O plugin de autenticação WebAuthn do lado do servidor verifica a assinatura. Com a verificação bem-sucedida, o servidor armazena o ID da credencial (apenas para dispositivos FIDO) e a chave pública na tabela de sistema `mysql.user`.

Após o registro ter sido realizado com sucesso, a autenticação WebAuthn segue este processo:

1. O servidor envia um desafio aleatório, ID do usuário, ID da parte de confiança e credenciais ao cliente. O desafio é convertido para o formato Base64 seguro para URL.
2. O cliente envia as mesmas informações para o dispositivo. O cliente consulta o dispositivo para verificar se ele suporta o protocolo Client-to-Authenticator Protocols (CTAP2). O suporte ao CTAP2 indica que o dispositivo é compatível com o protocolo FIDO2.
3. O dispositivo FIDO/FIDO2 solicita ao usuário que realize a ação apropriada do dispositivo, com base na seleção feita durante o registro.

   Se o dispositivo for compatível com o FIDO2, ele assina com todas as chaves privadas disponíveis no dispositivo para um ID de parte de confiança específico. Opcionalmente, ele pode solicitar ao usuário que escolha uma da lista também. Se o dispositivo não for compatível com o FIDO2, ele busca a chave privada correta.
4. Essa ação desbloqueia a chave privada e o desafio é assinado.
5. Esse desafio assinado é retornado ao servidor.
6. O plugin de autenticação WebAuthn do lado do servidor verifica a assinatura com a chave pública e responde para indicar o sucesso ou falha da autenticação.