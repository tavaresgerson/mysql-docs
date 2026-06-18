#### 8.4.1.11 Autenticação FIDO Pluggable

Nota

A autenticação FIDO pluggable é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL suporta um método de autenticação que permite que os usuários se autentiquem no MySQL Server usando a autenticação FIDO. Esse método de autenticação é desatualizado a partir do MySQL 8.0.35 e está sujeito à remoção em uma futura versão do MySQL. Para funcionalidades semelhantes, considere fazer a atualização para o MySQL 8.2 (ou superior), onde os usuários podem se autenticar no MySQL Server usando a autenticação WebAuthn. Você precisa entender o modelo de lançamento para inovações e versões de suporte a longo prazo (LTS) do MySQL antes de prosseguir com a atualização. Para mais informações, consulte a Seção 3.2, “Caminhos de Atualização”.

FIDO significa Fast Identity Online, que fornece padrões de autenticação que não exigem o uso de senhas.

A autenticação FIDO pluggable oferece essas capacidades:

- O FIDO permite a autenticação no servidor MySQL usando dispositivos como cartões inteligentes, chaves de segurança e leitores biométricos.

- Como a autenticação pode ocorrer de outras formas além da senha, o FIDO permite a autenticação sem senha.

- Por outro lado, a autenticação de dispositivos é frequentemente usada em conjunto com a autenticação por senha, portanto, a autenticação FIDO pode ser usada com bons resultados para contas do MySQL que utilizam autenticação multifator; veja a Seção 8.2.18, “Autenticação Multifator”.

A tabela a seguir mostra os nomes dos arquivos de plugin e biblioteca. O sufixo do nome do arquivo pode variar no seu sistema. Sufixos comuns são `.so` para sistemas Unix e Unix-like e `.dll` para sistemas Windows. O arquivo deve estar localizado no diretório nomeado pela variável de sistema `plugin_dir`. Para informações sobre instalação, consulte Instalar FIDO Pluggable Authentication.

**Tabela 8.27 Nomes de plugins e bibliotecas para autenticação FIDO**

<table summary="Nomes para os plugins e o arquivo de biblioteca usados para autenticação FIDO."><thead><tr> <th>Plugin ou arquivo</th> <th>Nome do Plugin ou do Arquivo</th> </tr></thead><tbody><tr> <td>Plugin no lado do servidor</td> <td>[[<code>authentication_fido</code>]]</td> </tr><tr> <td>Plugin no lado do cliente</td> <td>[[<code>authentication_fido_client</code>]]</td> </tr><tr> <td>Arquivo da biblioteca</td> <td>[[<code>authentication_fido.so</code>]], [[<code>authentication_fido_client.so</code>]]</td> </tr></tbody></table>

Nota

Uma biblioteca `libfido2` deve estar disponível nos sistemas onde o plugin de autenticação FIDO seja usado, seja no lado do servidor ou no lado do cliente. Se uma máquina hospedeira tiver mais de um dispositivo FIDO, a biblioteca `libfido2` decide qual dispositivo usar para registro e autenticação. A biblioteca `libfido2` não oferece uma funcionalidade para seleção de dispositivos.

O plugin de autenticação FIDO no lado do servidor está incluído apenas na Edição Empresarial do MySQL. Ele não está incluído nas distribuições comunitárias do MySQL. O plugin no lado do cliente está incluído em todas as distribuições, incluindo as comunitárias, o que permite que clientes de qualquer distribuição se conectem a um servidor que tenha o plugin no lado do servidor carregado.

As seções a seguir fornecem informações de instalação e uso específicas para a autenticação FIDO pluggable:

- Instalando FIDO Pluggable Authentication
- Usando a Autenticação FIDO
- Autenticação sem Senha FIDO
- Desregistramento do Dispositivo FIDO
- Como funciona a Autenticação FIDO de Usuários do MySQL

Para obter informações gerais sobre autenticação plugável no MySQL, consulte a Seção 8.2.17, “Autenticação Plugável”.

##### Instalando FIDO Pluggable Authentication

Esta seção descreve como instalar o plugin de autenticação FIDO no lado do servidor. Para informações gerais sobre como instalar plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para que o plugin seja utilizado pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin configurando o valor de `plugin_dir` durante o início do servidor.

O nome de arquivo da biblioteca de plugins do lado do servidor é `authentication_fido`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para carregar o plugin na inicialização do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que o contém. Com esse método de carregamento de plugins, a opção deve ser fornecida toda vez que o servidor for iniciado.

Para carregar o plugin, coloque uma linha como esta em seu arquivo `my.cnf`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
[mysqld]
plugin-load-add=authentication_fido.so
```

Após modificar `my.cnf`, reinicie o servidor para que o novo ajuste entre em vigor.

Como alternativa, para carregar o plugin em tempo de execução, use esta declaração, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
INSTALL PLUGIN authentication_fido
  SONAME 'authentication_fido.so';
```

`INSTALL PLUGIN` carrega o plugin imediatamente e também o registra na tabela do sistema `mysql.plugins`, fazendo com que o servidor o carregue para cada inicialização normal subsequente, sem a necessidade de `--plugin-load-add`.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a instrução `SHOW PLUGINS` (consulte a Seção 7.6.2, “Obtendo Informações do Plugin do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME = 'authentication_fido';
+---------------------+---------------+
| PLUGIN_NAME         | PLUGIN_STATUS |
+---------------------+---------------+
| authentication_fido | ACTIVE        |
+---------------------+---------------+
```

Se um plugin não conseguir se inicializar, verifique o log de erros do servidor para mensagens de diagnóstico.

Para associar contas do MySQL ao plugin de autenticação FIDO, consulte Usar autenticação FIDO.

##### Usando a Autenticação FIDO

A autenticação FIDO é tipicamente usada no contexto da autenticação multifator (veja a Seção 8.2.18, “Autenticação Multifator”). Esta seção mostra como incorporar a autenticação baseada em dispositivos FIDO em uma conta multifator, usando o plugin `authentication_fido`.

Na discussão a seguir, assume-se que o servidor está em execução com o plugin de autenticação FIDO do lado do servidor habilitado, conforme descrito em Instalar o plugin de autenticação FIDO Fidoável, e que o plugin FIDO do lado do cliente está disponível no diretório de plugins no host do cliente.

Nota

No Windows, a autenticação FIDO funciona apenas se o processo do cliente estiver rodando como um usuário com privilégios de administrador.

Também se assume que a autenticação FIDO é usada em conjunto com a autenticação não FIDO (o que implica uma conta de 2FA ou 3FA). O FIDO também pode ser usado sozinho para criar contas de 1FA que se autenticam de forma sem senha. Nesse caso, o processo de configuração difere um pouco. Para instruções, consulte Autenticação sem Senha FIDO.

Uma conta configurada para usar o plugin `authentication_fido` está associada a um dispositivo FIDO. Por isso, é necessário um passo de registro do dispositivo único antes que a autenticação FIDO possa ocorrer. O processo de registro do dispositivo tem essas características:

- Qualquer dispositivo FIDO associado a uma conta deve ser registrado antes que a conta possa ser usada.

- Para a inscrição, é necessário que um dispositivo FIDO esteja disponível no host do cliente, caso contrário, a inscrição falhará.

- O usuário deve realizar a ação apropriada do dispositivo FIDO quando solicitado durante o registro (por exemplo, tocar no dispositivo ou realizar uma varredura biométrica).

- Para realizar o registro do dispositivo, o usuário cliente deve invocar o programa cliente **mysql** ou o Shell MySQL e especificar a opção `--fido-register-factor` para especificar o fator ou fatores para os quais um dispositivo está sendo registrado. Por exemplo, se a conta estiver configurada para usar FIDO como o segundo fator de autenticação, o usuário invoca o **mysql** com a opção `--fido-register-factor=2`.

- Se a conta do usuário estiver configurada com o plugin `authentication_fido` definido como o segundo ou terceiro fator, a autenticação para todos os fatores anteriores deve ser bem-sucedida antes que o passo de registro possa prosseguir.

- O servidor sabe, com base nas informações da conta do usuário, se o dispositivo FIDO requer registro ou já foi registrado. Quando o programa cliente se conecta, o servidor coloca a sessão do cliente no modo sandbox se o dispositivo precisar ser registrado, para que o registro ocorra antes que qualquer outra coisa possa ser feita. O modo sandbox usado para o registro do dispositivo FIDO é semelhante ao usado para o gerenciamento de senhas expiradas. Veja a Seção 8.2.16, “Gerenciamento do servidor de senhas expiradas”.

- No modo sandbox, não são permitidas declarações que não sejam `ALTER USER`. O registro é realizado usando formulários dessa declaração. Quando invocado com a opção `--fido-register-factor`, o cliente **mysql** gera as declarações `ALTER USER` necessárias para realizar o registro. Após o registro ter sido concluído, o servidor desativa a sessão do modo sandbox, e o cliente pode prosseguir normalmente. Para obter informações sobre as declarações `ALTER USER` geradas, consulte a descrição do `--fido-register-factor`.

- Quando o registro do dispositivo foi realizado para a conta, o servidor atualiza a linha da tabela do sistema `mysql.user` para essa conta para atualizar o status do registro do dispositivo e armazenar a chave pública e o ID de credencial.

- A etapa de registro pode ser realizada apenas pelo usuário nomeado na conta. Se um usuário tentar realizar o registro para outro usuário, ocorrerá um erro.

- O usuário deve usar o mesmo dispositivo FIDO durante o registro e autenticação. Se, após registrar um dispositivo FIDO no host do cliente, o dispositivo for redefinido ou um dispositivo diferente for inserido, a autenticação falhará. Nesse caso, o dispositivo associado à conta deve ser desregistrado e o registro deve ser feito novamente.

Suponha que você queira que uma conta se autentique primeiro usando o plugin `caching_sha2_password` e, em seguida, usando o plugin `authentication_fido`. Crie uma conta multifator usando uma declaração como esta:

```
CREATE USER 'u2'@'localhost'
  IDENTIFIED WITH caching_sha2_password
    BY 'sha2_password'
  AND IDENTIFIED WITH authentication_fido;
```

Para se conectar, forneça a senha do fator 1 para satisfazer a autenticação desse fator e, para iniciar o registro do dispositivo FIDO, defina o `--fido-register-factor` para o fator 2.

```
$> mysql --user=u2 --password1 --fido-register-factor=2
Enter password: (enter factor 1 password)
```

Depois que a senha do fator 1 for aceita, a sessão do cliente entra no modo sandbox para que o registro do dispositivo possa ser realizado para o fator 2. Durante o registro, você será solicitado a realizar a ação de dispositivo FIDO apropriada, como tocar no dispositivo ou realizar uma varredura biométrica.

Quando o processo de registro estiver concluído, a conexão com o servidor será permitida.

Nota

A conexão com o servidor é permitida após o registro, independentemente dos fatores de autenticação adicionais na cadeia de autenticação da conta. Por exemplo, se a conta no exemplo anterior fosse definida com um terceiro fator de autenticação (usando autenticação não FIDO), a conexão seria permitida após um registro bem-sucedido sem autenticar o terceiro fator. No entanto, conexões subsequentes exigiriam a autenticação de todos os três fatores.

##### Autenticação sem Senha FIDO

Esta seção descreve como o FIDO pode ser usado sozinho para criar contas de 1FA que se autenticam de forma sem senha. Neste contexto, “sem senha” significa que a autenticação ocorre, mas usa um método diferente de uma senha, como uma chave de segurança ou uma varredura biométrica. Isso não se refere a uma conta que usa um plugin de autenticação baseado em senha, para o qual a senha está vazia. Esse tipo de “sem senha” é completamente inseguro e não é recomendado.

Os seguintes pré-requisitos se aplicam ao uso do plugin `authentication_fido` para realizar autenticação sem senha:

- O usuário que cria uma conta de autenticação sem senha requer o privilégio `PASSWORDLESS_USER_ADMIN`, além do privilégio `CREATE USER`.

- O primeiro elemento do valor `authentication_policy` deve ser um asterisco (`*`) e não o nome de um plugin. Por exemplo, o valor padrão `authentication_policy` suporta a autenticação sem senha porque o primeiro elemento é um asterisco:

  ```
  authentication_policy='*,,'
  ```

  Para obter informações sobre a configuração do valor `authentication_policy`, consulte Configurando a Política de Autenticação Multifator.

Para usar `authentication_fido` como um método de autenticação sem senha, a conta deve ser criada com `authentication_fido` como o primeiro método de autenticação de fator. A cláusula `INITIAL AUTHENTICATION IDENTIFIED BY` também deve ser especificada para o primeiro fator (não é suportada com fatores 2º ou 3º). Esta cláusula especifica se uma senha gerada aleatoriamente ou especificada pelo usuário será usada para o registro do dispositivo FIDO. Após o registro do dispositivo, o servidor exclui a senha e modifica a conta para fazer com que `authentication_fido` seja o único método de autenticação (o método 1FA).

A sintaxe necessária para `CREATE USER` é a seguinte:

```
CREATE USER user
  IDENTIFIED WITH authentication_fido
  INITIAL AUTHENTICATION IDENTIFIED BY {RANDOM PASSWORD | 'auth_string'};
```

O exemplo a seguir usa a sintaxe `RANDOM PASSWORD`:

```
mysql> CREATE USER 'u1'@'localhost'
         IDENTIFIED WITH authentication_fido
         INITIAL AUTHENTICATION IDENTIFIED BY RANDOM PASSWORD;
+------+-----------+----------------------+-------------+
| user | host      | generated password   | auth_factor |
+------+-----------+----------------------+-------------+
| u1   | localhost | 9XHK]M{l2rnD;VXyHzeF |           1 |
+------+-----------+----------------------+-------------+
```

Para realizar o registro, o usuário deve autenticar-se no servidor com a senha associada à cláusula `INITIAL AUTHENTICATION IDENTIFIED BY`, seja a senha gerada aleatoriamente ou o valor `'auth_string'`. Se a conta foi criada como mostrado anteriormente, o usuário executa este comando e cola a senha gerada aleatoriamente anterior (`9XHK]M{l2rnD;VXyHzeF`) na prompt:

```
$> mysql --user=u1 --password --fido-register-factor=2
Enter password:
```

A opção `--fido-register-factor=2` é usada porque a cláusula `INITIAL AUTHENTICATION IDENTIFIED BY` está atuando atualmente como o primeiro método de autenticação por fator. Portanto, o usuário deve fornecer a senha temporária usando o segundo fator. Após o registro bem-sucedido, o servidor remove a senha temporária e revisa a entrada da conta na tabela do sistema `mysql.user` para listar `authentication_fido` como o único método de autenticação (1FA).

Ao criar uma conta de autenticação sem senha, é importante incluir a cláusula `INITIAL AUTHENTICATION IDENTIFIED BY` na instrução `CREATE USER`. O servidor aceitará uma instrução sem a cláusula, mas a conta resultante será inutilizável, pois não há como se conectar ao servidor para registrar o dispositivo. Suponha que você execute uma instrução como esta:

```
CREATE USER 'u2'@'localhost'
  IDENTIFIED WITH authentication_fido;
```

Tentativas subsequentes de usar a conta para se conectar falham assim:

```
$> mysql --user=u2 --skip-password
Failed to open FIDO device.
ERROR 1 (HY000): Unknown MySQL error
```

Nota

A autenticação sem senha é realizada usando o protocolo Universal 2nd Factor (U2F), que não suporta medidas de segurança adicionais, como a configuração de um PIN no dispositivo a ser registrado. Portanto, cabe ao titular do dispositivo garantir que ele seja manuseado de maneira segura.

##### Desregistramento do Dispositivo FIDO

É possível desinscrever dispositivos FIDO associados a uma conta MySQL. Isso pode ser desejável ou necessário em várias circunstâncias:

- Um dispositivo FIDO deve ser substituído por um dispositivo diferente. O dispositivo anterior deve ser desregistrado e o novo dispositivo registrado.

  Nesse caso, o proprietário da conta ou qualquer usuário que tenha o privilégio `CREATE USER` pode desinscrever o dispositivo. O proprietário da conta pode registrar o novo dispositivo.

- Um dispositivo FIDO é redefinido ou perdido. As tentativas de autenticação falharão até que o dispositivo atual seja desregistrado e um novo registro seja realizado.

  Nesse caso, o proprietário da conta, incapaz de se autenticar, não pode desinscrever o dispositivo atual e deve entrar em contato com o DBA (ou qualquer usuário que tenha o privilégio `CREATE USER` para fazer isso). Em seguida, o proprietário da conta pode reinscrever o dispositivo redefinido ou registrar um novo dispositivo.

A desativação de um dispositivo FIDO pode ser feita pelo proprietário da conta ou por qualquer usuário que tenha o privilégio `CREATE USER`. Use a seguinte sintaxe:

```
ALTER USER user {2 | 3} FACTOR UNREGISTER;
```

Para registrar um dispositivo novamente ou realizar um novo registro, consulte as instruções em Usar autenticação FIDO.

##### Como funciona a Autenticação FIDO de Usuários do MySQL

Esta seção fornece uma visão geral de como o MySQL e o FIDO trabalham juntos para autenticar usuários do MySQL. Para exemplos que mostram como configurar contas do MySQL para usar os plugins de autenticação FIDO, consulte Usar autenticação FIDO.

Uma conta que utiliza autenticação FIDO deve realizar uma etapa de registro inicial do dispositivo antes de poder se conectar ao servidor. Após o registro do dispositivo, a autenticação pode prosseguir. O processo de registro de dispositivos FIDO é o seguinte:

1. O servidor envia um desafio aleatório, ID do usuário e ID da parte de confiança (que identifica de forma única um servidor) ao cliente. O ID da parte de confiança é definido pela variável de sistema `authentication_fido_rp_id`. O valor padrão é `MySQL`.

2. O cliente recebe essa informação e a envia para o plugin de autenticação FIDO do lado do cliente, que, por sua vez, a fornece ao dispositivo FIDO.

3. Após o usuário realizar a ação apropriada no dispositivo (por exemplo, tocar no dispositivo ou realizar uma varredura biométrica), o dispositivo FIDO gera um par de chaves pública/privada, um handle de chave, um certificado X.509 e uma assinatura, que são retornados ao servidor.

4. O plugin de autenticação FIDO do lado do servidor verifica a assinatura. Após a verificação bem-sucedida, o servidor armazena o ID da credencial e a chave pública na tabela do sistema `mysql.user`.

Após o registro ter sido realizado com sucesso, a autenticação FIDO segue este processo:

1. O servidor envia um desafio aleatório, ID do usuário, ID da parte de confiança e credenciais ao cliente.

2. O cliente envia as mesmas informações para o dispositivo FIDO.

3. O dispositivo FIDO solicita ao usuário que realize a ação adequada do dispositivo, com base na seleção feita durante o registro.

4. Essa ação desbloqueia a chave privada e o desafio é assinado.

5. Esse desafio assinado é devolvido ao servidor.

6. O plugin de autenticação FIDO do lado do servidor verifica a assinatura com a chave pública e responde para indicar o sucesso ou o fracasso da autenticação.
