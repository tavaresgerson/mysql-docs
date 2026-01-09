### 8.3.1 Configurando o MySQL para Usar Conexões Encriptadas

Vários parâmetros de configuração estão disponíveis para indicar se devem ser usadas conexões encriptadas e para especificar os arquivos de certificado e chave apropriados. Esta seção fornece orientações gerais sobre como configurar o servidor e os clientes para conexões encriptadas:

* Configuração de Inicialização no Servidor para Conexões Encriptadas
* Configuração e Monitoramento de Tempo de Execução no Servidor para Conexões Encriptadas

* Configuração do Cliente para Conexões Encriptadas
* Configuração da Enforcagem da Validação de Certificado
* Configuração de Conexões Encriptadas como Obrigatórias

Conexões encriptadas também podem ser usadas em outros contextos, conforme discutido nessas seções adicionais:

* Entre servidores de replicação de origem e replicação. Veja a Seção 19.3.1, “Configurando a Replicação para Usar Conexões Encriptadas”.
* Entre servidores de replicação de grupo. Veja a Seção 20.6.2, “Segurando Conexões de Comunicação de Grupo com Secure Socket Layer (SSL”)”).
* Por programas cliente baseados na API C do MySQL. Veja Suporte para Conexões Encriptadas.

As instruções para criar os arquivos de certificado e chave necessários estão disponíveis na Seção 8.3.3, “Criando Certificados e Chaves SSL e RSA”.

#### Configuração de Inicialização no Servidor para Conexões Encriptadas

Para exigir que os clientes se conectem usando conexões encriptadas, habilite a variável de sistema `require_secure_transport`. Veja Configurando Conexões Encriptadas como Obrigatórias.

Essas variáveis de sistema no lado do servidor especificam os arquivos de certificado e chave que o servidor usa ao permitir que os clientes estabeleçam conexões encriptadas:

* `ssl_ca`: O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA). (`ssl_capath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de certificados de CA.)

* `ssl_cert`: O nome do caminho do arquivo de certificado público do servidor. Esse certificado pode ser enviado ao cliente e autenticado contra o certificado da CA que ele possui.

* `ssl_key`: O nome do caminho do arquivo de chave privada do servidor.

Por exemplo, para habilitar o servidor para conexões criptografadas, inicie-o com essas linhas no arquivo `my.cnf`, alterando os nomes dos arquivos conforme necessário:

```
[mysqld]
ssl_ca=ca.pem
ssl_cert=server-cert.pem
ssl_key=server-key.pem
```

Para especificar, além disso, que os clientes devem usar conexões criptografadas, habilite a variável de sistema `require_secure_transport`:

```
[mysqld]
ssl_ca=ca.pem
ssl_cert=server-cert.pem
ssl_key=server-key.pem
require_secure_transport=ON
```

Cada nome de variável de sistema de certificado e chave nomeia um arquivo no formato PEM. Se você precisar criar os arquivos de certificado e chave necessários, consulte a Seção 8.3.3, “Criando Certificados e Chaves SSL e RSA”. Servidores MySQL compilados usando OpenSSL podem gerar automaticamente os arquivos de certificado e chave ausentes no início. Consulte a Seção 8.3.3.1, “Criando Certificados e Chaves SSL e RSA usando MySQL”. Alternativamente, se você tiver uma distribuição de fonte MySQL, pode testar sua configuração usando os arquivos de certificado e chave de demonstração em seu diretório `mysql-test/std_data`.

O servidor realiza a autodescoberta de arquivos de certificado e chave. Se não forem fornecidas opções explícitas de conexão criptografada para configurar conexões criptografadas, o servidor tenta habilitar o suporte para conexões criptografadas automaticamente no início:

* Se o servidor descobrir arquivos de certificado e chave válidos com os nomes `ca.pem`, `server-cert.pem` e `server-key.pem` no diretório de dados, ele habilita o suporte para conexões criptografadas pelos clientes. (Os arquivos não precisam ter sido gerados automaticamente; o que importa é que eles tenham esses nomes e sejam válidos.)

* Se o servidor não encontrar arquivos de certificado e chave válidos no diretório de dados, ele continua executando, mas sem suporte para conexões criptografadas.

Se o servidor habilitar automaticamente o suporte para conexões criptografadas, ele escreve uma nota no log de erro. Se o servidor descobrir que o certificado CA é autoassinado, ele escreve uma mensagem de alerta no log de erro. (O certificado é autoassinado se for criado automaticamente pelo servidor.)

O MySQL também fornece essas variáveis de sistema para o controle de conexões criptografadas no lado do servidor:

* `ssl_cipher`: A lista de cifrais permitidos para criptografia de conexão.

* `ssl_crl`: O nome do caminho do arquivo que contém listas de revogação de certificados. (`ssl_crlpath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de listas de revogação de certificados.)

* `tls_version`, `tls_ciphersuites`: Quais protocolos de criptografia e suíte de cifrais o servidor permite para conexões criptografadas; consulte a Seção 8.3.2, “Protocolos TLS de Conexão Criptografada e Suíte de Cifra”. Por exemplo, você pode configurar `tls_version` para impedir que os clientes usem protocolos menos seguros.

Se o servidor não conseguir criar um contexto TLS válido a partir das variáveis de sistema para o controle de conexões criptografadas no lado do servidor, o servidor executa sem suporte para conexões criptografadas.

#### Configuração e Monitoramento de Execução no Lado do Servidor para Conexões Criptografadas
```
mysql
```
```
mysql --ssl-mode=PREFERRED
```
```
mysql --ssl-mode=REQUIRED
```
```
  mysql --ssl-ca=ca.pem
        --ssl-cert=client-cert.pem
        --ssl-key=client-key.pem
  ```
```
mysql --ssl-mode=DISABLED
```
```
mysql> SHOW SESSION STATUS LIKE 'Ssl_cipher';
+---------------+---------------------------+
| Variable_name | Value                     |
+---------------+---------------------------+
| Ssl_cipher    | DHE-RSA-AES128-GCM-SHA256 |
+---------------+---------------------------+
```
```
mysql> \s
...
SSL: Not in use
...
```
```
mysql> \s
...
SSL: Cipher in use is DHE-RSA-AES128-GCM-SHA256
...
```
```
mysqld --tls-certificates-enforced-validation
```
```
[mysqld]
require_secure_transport=ON
```
```
SET PERSIST require_secure_transport=ON;
```
```
mysql --ssl-mode=REQUIRED
mysqldump --ssl-mode=VERIFY_CA
mysqladmin --ssl-mode=VERIFY_IDENTITY
```
```
CREATE USER 'jeffrey'@'localhost' REQUIRE X509;
```




























































































































































As variáveis de sistema `tls_xxx` e `ssl_xxx` são dinâmicas e podem ser definidas em tempo de execução, não apenas no momento do início. Se alteradas com `SET GLOBAL`, os novos valores só se aplicam até o reinício do servidor. Se alteradas com `SET PERSIST`, os novos valores também são mantidos em reinícios subsequentes do servidor. Veja a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”. No entanto, as alterações em tempo de execução nessas variáveis não afetam imediatamente o contexto TLS para novas conexões, conforme explicado mais adiante nesta seção.

Juntamente com a alteração que permite alterações em tempo de execução nas variáveis de sistema relacionadas ao contexto TLS, o servidor permite atualizações em tempo de execução do contexto TLS real usado para novas conexões. Essa capacidade pode ser útil, por exemplo, para evitar o reinício de um servidor MySQL que tem estado em execução por tanto tempo que seu certificado SSL expirou.

Para criar o contexto TLS inicial, o servidor usa os valores que as variáveis de sistema relacionadas ao contexto têm no momento do início. Para expor os valores do contexto, o servidor também inicializa um conjunto de variáveis de status correspondentes. A tabela a seguir mostra as variáveis de sistema que definem o contexto TLS e as variáveis de status correspondentes que expor os valores do contexto atualmente ativos.

**Tabela 8.12 Variáveis de Sistema e Status para Conexão Principal do Servidor Interface TLS Context**

<table summary="As variáveis de sistema que definem o contexto TLS do servidor e as variáveis de status correspondentes que exibem os valores ativos do contexto."><col style="width: 45%"/><col style="width: 55%"/><thead><tr> <th>Nome da Variável de Sistema</th> <th>Nome da Variável de Status Correspondente</th> </tr></thead><tbody><tr> <td><a class="link" href="server-system-variables.html#sysvar_ssl_ca"><code>ssl_ca</code></a></td> <td><a class="link" href="server-status-variables.html#statvar_Current_tls_ca"><code>Current_tls_ca</code></a></td> </tr><tr> <td><a class="link" href="server-system-variables.html#sysvar_ssl_capath"><code>ssl_capath</code></a></td> <td><a class="link" href="server-status-variables.html#statvar_Current_tls_capath"><code>Current_tls_capath</code></a></td> </tr><tr> <td><a class="link" href="server-system-variables.html#sysvar_ssl_cert"><code>ssl_cert</code></a></td> <td><a class="link" href="server-status-variables.html#statvar_Current_tls_cert"><code>Current_tls_cert</code></a></td> </tr><tr> <td><a class="link" href="server-system-variables.html#sysvar_ssl_cipher"><code>ssl_cipher</code></a></td> <td><a class="link" href="server-status-variables.html#statvar_Current_tls_cipher"><code>Current_tls_cipher</code></a></td> </tr><tr> <td><a class="link" href="server-system-variables.html#sysvar_ssl_crl"><code>ssl_crl</code></a></td> <td><a class="link" href="server-status-variables.html#statvar_Current_tls_crl"><code>Current_tls_crl</code></a></td> </tr><tr> <td><a class="link" href="server-system-variables.html#sysvar_ssl_crlpath"><code>ssl_crlpath</code></a></td> <td><a class="link" href="server-status-variables.html#statvar_Current_tls_crlpath"><code>Current_tls_crlpath</code></a></td> </tr><tr> <td><a class="link" href="server-system-variables.html#sysvar_ssl_key"><code>ssl_key</code></a></td> <td><a class="link" href="server-status-variables.html#statvar_Current_tls_key"><code>Current_tls_key</code></a></td> </tr><tr> <td><a class="link" href="server-system-variables.html#tls_ciphersuites"><code>tls_ciphersuites</code></a></td> <td><a class="link" href="server-status-variables.html#statvar_Current_tls_ciphersuites"><code>Current_tls_ciphersuites</code></a></td> </tr><tr> <td><a class="link" href="server-system-variables.html#tls_version"><code>tls_version</code></a></td> <td><a class="link" href="server-status-variables.html#statvar_Current_tls_version"><code>Current_tls_version</code></a></td> </tr></tbody></table>

Esses valores ativos do contexto TLS também são exibidos como propriedades na tabela do Gerenciamento de Desempenho `tls_channel_status`, juntamente com as propriedades de quaisquer outros contextos TLS ativos.

Para reconfigurar o contexto TLS em tempo de execução, use o seguinte procedimento:

1. Defina cada variável de sistema relacionada ao contexto TLS que deve ser alterada para seu novo valor.

2. Execute `ALTER INSTANCE RELOAD TLS`. Essa instrução reconfigura o contexto ativo do TLS a partir dos valores atuais das variáveis de sistema relacionadas ao contexto TLS. Ela também define as variáveis de status relacionadas ao contexto para refletir os novos valores do contexto ativo. A instrução requer o privilégio `CONNECTION_ADMIN`.

3. Novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` usam o novo contexto TLS. As conexões existentes permanecem inalteradas. Se as conexões existentes devem ser terminadas, use a instrução `KILL`.

Os membros de cada par de variáveis de sistema e status podem ter valores diferentes temporariamente devido à maneira como o procedimento de reconfiguração funciona:

* Alterações nas variáveis de sistema antes de `ALTER INSTANCE RELOAD TLS` não alteram o contexto TLS. Neste ponto, essas alterações não têm efeito em novas conexões, e as variáveis de sistema e status relacionadas ao contexto podem ter valores diferentes. Isso permite que você faça quaisquer alterações necessárias nas variáveis de sistema individuais e, em seguida, atualize o contexto ativo do TLS de forma atômica com `ALTER INSTANCE RELOAD TLS` após todas as alterações nas variáveis de sistema terem sido feitas.

* Após `ALTER INSTANCE RELOAD TLS`, as variáveis de sistema e status correspondentes têm os mesmos valores. Isso permanece verdadeiro até a próxima alteração nas variáveis de sistema.

Em alguns casos, `ALTER INSTANCE RELOAD TLS` por si só pode ser suficiente para reconfigurar o contexto TLS, sem alterar nenhuma variável do sistema. Suponha que o certificado no arquivo nomeado por `ssl_cert` tenha expirado. Basta substituir o conteúdo do arquivo existente por um certificado não expirado e executar `ALTER INSTANCE RELOAD TLS` para fazer com que o novo conteúdo do arquivo seja lido e usado para novas conexões.

O servidor implementa uma configuração independente de criptografia de conexão para a interface de conexão administrativa. Consulte Suporte à Interface Administrativa para Conexões Encriptadas. Além disso, `ALTER INSTANCE RELOAD TLS` é estendido com uma cláusula `FOR CHANNEL` que permite especificar o canal (interface) para o qual deseja recarregar o contexto TLS. Consulte Seção 15.1.5, “Instrução ALTER INSTANCE”. Não há variáveis de status para expor o contexto do TLS da interface administrativa, mas a tabela do Schema de Desempenho `tls_channel_status` expõe propriedades TLS tanto para a interface principal quanto para a interface administrativa. Consulte Seção 29.12.22.11, “A tabela tls\_channel\_status”.

A atualização do contexto TLS da interface principal tem esses efeitos:

* A atualização altera o contexto TLS usado para novas conexões na interface de conexão principal.

* A atualização também altera o contexto TLS usado para novas conexões na interface administrativa, a menos que algum valor de parâmetro TLS não padrão seja configurado para essa interface.

* A atualização não afeta o contexto TLS usado por outros plugins ou componentes do servidor habilitados, como a Replicação de Grupo ou o X Plugin:

+ Para aplicar a reconfiguração da interface principal às conexões de comunicação do grupo da replicação, que obtêm suas configurações das variáveis de sistema relacionadas ao contexto TLS do servidor, você deve executar `STOP GROUP_REPLICATION` seguido de `START GROUP_REPLICATION` para interromper e reiniciar a replicação do grupo.

+ O X Plugin inicializa seu contexto TLS na inicialização do plugin, conforme descrito na Seção 22.5.3, “Usando Conexões Encriptadas com o X Plugin”. Esse contexto não muda posteriormente.

Por padrão, a ação `RELOAD TLS` é revertida com um erro e não tem efeito se os valores de configuração não permitirem a criação do novo contexto TLS. Os valores anteriores do contexto continuam sendo usados para novas conexões. Se a cláusula opcional `NO ROLLBACK ON ERROR` for fornecida e o novo contexto não puder ser criado, o rollback não ocorre. Em vez disso, um aviso é gerado e a criptografia é desabilitada para novas conexões na interface à qual a declaração se aplica.

As opções que habilitam ou desabilitam conexões encriptadas em uma interface de conexão têm efeito apenas no início. Por exemplo, as opções `--tls-version` e `--admin-tls-version` afetam apenas no início se as interfaces principal e administrativa suportam essas versões de TLS. Tais opções são ignoradas e não têm efeito na operação de `ALTER INSTANCE RELOAD TLS` em tempo de execução. Por exemplo, você pode definir `tls_version=''` para iniciar o servidor com conexões encriptadas desativadas na interface principal, então reconfigurar o TLS e executar `ALTER INSTANCE RELOAD TLS` para habilitar conexões encriptadas em tempo de execução.

#### Configuração do Lado do Cliente para Conexões Encriptadas

Para uma lista completa das opções do cliente relacionadas ao estabelecimento de conexões encriptadas, consulte Opções de Comando para Conexões Encriptadas.

Por padrão, os programas clientes do MySQL tentam estabelecer uma conexão criptografada se o servidor suportar conexões criptografadas, com controle adicional disponível através da opção `--ssl-mode`:

* Na ausência da opção `--ssl-mode`, os clientes tentam se conectar usando criptografia, revertendo para uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida. Esse é também o comportamento com a opção explícita `--ssl-mode=PREFERRED`.

* Com `--ssl-mode=REQUIRED`, os clientes exigem uma conexão criptografada e falham se uma não puder ser estabelecida.

* Com `--ssl-mode=DISABLED`, os clientes usam uma conexão não criptografada.

* Com `--ssl-mode=VERIFY_CA` ou `--ssl-mode=VERIFY_IDENTITY`, os clientes exigem uma conexão criptografada e também realizam verificação contra o certificado da CA do servidor e (com `VERIFY_IDENTITY`) contra o nome do host do servidor em seu certificado.

Importante

A configuração padrão, `--ssl-mode=PREFERRED`, produz uma conexão criptografada se as outras configurações padrão não forem alteradas. No entanto, para ajudar a prevenir ataques sofisticados de intermediário, é importante que o cliente verifique a identidade do servidor. As configurações `--ssl-mode=VERIFY_CA` e `--ssl-mode=VERIFY_IDENTITY` são uma escolha melhor do que a configuração padrão para ajudar a prevenir esse tipo de ataque. `VERIFY_CA` faz com que o cliente verifique se o certificado do servidor é válido. `VERIFY_IDENTITY` faz com que o cliente verifique se o certificado do servidor é válido e também faz com que o cliente verifique se o nome do host que está usando corresponde à identidade no certificado do servidor. Para implementar uma dessas configurações, você deve primeiro garantir que o certificado da Autoridade de Certificação (CA) do servidor esteja disponível de forma confiável para todos os clientes que o usam em seu ambiente, caso contrário, problemas de disponibilidade ocorrerão. Por essa razão, elas não são a configuração padrão.

Tentativas de estabelecer uma conexão não criptografada falham se a variável de sistema `require_secure_transport` for habilitada no lado do servidor para fazer com que o servidor exija conexões criptografadas. Veja Configurando Conexões Criptografadas como Obrigatórias.

As seguintes opções no lado do cliente identificam os arquivos de certificado e chave que os clientes usam ao estabelecer conexões criptografadas com o servidor. Eles são semelhantes às variáveis de sistema `ssl_ca`, `ssl_cert` e `ssl_key` usadas no lado do servidor, mas `--ssl-cert` e `--ssl-key` identificam a chave pública e privada do cliente:

* `--ssl-ca`: O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA). Esta opção, se usada, deve especificar o mesmo certificado usado pelo servidor. (`--ssl-capath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de certificados da CA.)

* `--ssl-cert`: O nome do caminho do arquivo de certificado público da chave privada do cliente.

* `--ssl-key`: O nome do caminho do arquivo de chave privada do cliente.

Para uma segurança adicional em relação à criptografia padrão, os clientes podem fornecer um certificado CA que corresponda ao usado pelo servidor e habilitar a verificação da identidade do nome do host. Dessa forma, o servidor e o cliente confiam no mesmo certificado CA e o cliente verifica se o host ao qual se conectou é o pretendido:

* Para especificar o certificado CA, use `--ssl-ca` (ou `--ssl-capath`) e especifique `--ssl-mode=VERIFY_CA`.

* Para habilitar a verificação da identidade do nome do host também, use `--ssl-mode=VERIFY_IDENTITY` em vez de `--ssl-mode=VERIFY_CA`.

Observação

A verificação da identidade do nome do host com `VERIFY_IDENTITY` não funciona com certificados autoassinados que são criados automaticamente pelo servidor (consulte a Seção 8.3.3.1, “Criando Certificados e Chaves SSL e RSA usando MySQL”). Esses certificados autoassinados não contêm o nome do servidor como o valor Common Name.

O MySQL também fornece essas opções para o controle de conexão criptografada do lado do cliente:

* `--ssl-cipher`: A lista de cifra permitidos para a criptografia da conexão.

* `--ssl-crl`: O nome do caminho do arquivo que contém listas de revogação de certificados. (`--ssl-crlpath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de listas de revogação de certificados.)

* `--tls-version`, `--tls-ciphersuites`: Os protocolos e cifra de cifragem permitidos; consulte a Seção 8.3.2, “Protocolos e cifra de cifragem TLS de Conexão Criptografada”.

Dependendo dos requisitos de criptografia da conta MySQL usada por um cliente, o cliente pode ser obrigado a especificar certas opções para se conectar usando criptografia ao servidor MySQL.

Suponha que você queira se conectar usando uma conta que não tenha requisitos especiais de criptografia ou que tenha sido criada usando uma instrução `CREATE USER` que incluísse a cláusula `REQUIRE SSL`. Supondo que o servidor suporte conexões criptografadas, um cliente pode se conectar usando criptografia sem a opção `--ssl-mode` ou com a opção explícita `--ssl-mode=PREFERRED`:



Ou:



Para uma conta criada com uma cláusula `REQUIRE SSL`, a tentativa de conexão falha se uma conexão criptografada não puder ser estabelecida. Para uma conta sem requisitos especiais de criptografia, a tentativa cai em uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida. Para evitar a queda e falhar se uma conexão criptografada não puder ser obtida, conecte-se assim:



Se a conta tiver requisitos de segurança mais rigorosos, outras opções devem ser especificadas para estabelecer uma conexão criptografada:

* Para contas criadas com uma cláusula `REQUIRE X509`, os clientes devem especificar pelo menos `--ssl-cert` e `--ssl-key`. Além disso, `--ssl-ca` (ou `--ssl-capath`) é recomendado para que o certificado público fornecido pelo servidor possa ser verificado. Por exemplo (insira o comando em uma única linha):

  

* Para contas criadas com uma cláusula `REQUIRE ISSUER` ou `REQUIRE SUBJECT`, os requisitos de criptografia são os mesmos que para `REQUIRE X509`, mas o certificado deve corresponder ao emissor ou ao assunto, respectivamente, especificados na definição da conta.

Para informações adicionais sobre a cláusula `REQUIRE`, consulte a Seção 15.7.1.3, “Instrução CREATE USER”.

Os servidores MySQL podem gerar arquivos de certificado e chave do cliente que os clientes podem usar para se conectar às instâncias do servidor MySQL. Veja a Seção 8.3.3, “Criando Certificados e Chaves SSL e RSA”.

Importante

Se um cliente que se conecta a uma instância do servidor MySQL usar um certificado SSL com a extensão `extendedKeyUsage` (uma extensão X.509 v3), o uso estendido da chave deve incluir a autenticação do cliente (`clientAuth`). Se o certificado SSL for especificado apenas para autenticação do servidor (`serverAuth`) e para outros fins que não sejam de certificado do cliente, a verificação do certificado falha e a conexão do cliente com a instância do servidor MySQL falha. Não há extensão `extendedKeyUsage` nos certificados SSL gerados pelo MySQL Server (como descrito na Seção 8.3.3.1, “Criando Certificados SSL e RSA e Chaves usando MySQL”), e os certificados SSL criados usando o comando **openssl** seguindo as instruções na Seção 8.3.3.2, “Criando Certificados SSL e Chaves Usando openssl”. Se você usar seu próprio certificado do cliente criado de outra maneira, certifique-se de que qualquer extensão `extendedKeyUsage` inclua a autenticação do cliente.

Para impedir o uso de criptografia e substituir outras opções `--ssl-xxx`, inicie o programa cliente com `--ssl-mode=DISABLED`:



Para determinar se a conexão atual com o servidor usa criptografia, verifique o valor da variável de sessão `Ssl_cipher` status. Se o valor estiver vazio, a conexão não está criptografada. Caso contrário, a conexão está criptografada e o valor indica o algoritmo de criptografia. Por exemplo:



Para o cliente **mysql**, uma alternativa é usar o comando `STATUS` ou `\s` e verificar a linha `SSL`:



Ou:



#### Configurando a Execução da Validação de Certificados

A opção `--tls-certificates-enforced-validation` habilita a validação do arquivo de certificado da chave pública do servidor, dos arquivos de certificado da Autoridade de Certificação (CA) e dos arquivos de lista de revogação de certificados no momento do inicialização do servidor:



Se configurado como `ON`, o servidor interrompe a execução do inicializador em caso de certificados inválidos. O servidor informa aos administradores de banco de dados (DBAs) fornecendo mensagens de depuração válidas, mensagens de erro ou ambas, dependendo do status dos certificados. Essa capacidade pode ser útil, por exemplo, para evitar reiniciar um servidor MySQL que já está em execução há tanto tempo que seu certificado SSL expirou.

Da mesma forma, quando você executa a instrução `ALTER INSTANCE RELOAD TLS`, para alterar o contexto TLS em tempo de execução, os novos arquivos de certificado do servidor e da CA não são usados se a validação falhar. Nesse caso, o servidor continua usando os certificados antigos. Para obter mais informações sobre como alterar o contexto TLS dinamicamente, consulte Configuração e monitoramento de execução no lado do servidor para conexões criptografadas.

**Validação de Certificados de CA**

Para uma conexão usando a interface principal do servidor:

* Se `--ssl_ca` for especificado, o servidor valida o respectivo certificado de CA e fornece ao DBA uma mensagem de aviso apropriada.

* Se `--ssl_capath` for especificado, o servidor valida todos os certificados de CA na pasta respectiva e fornece ao DBA uma mensagem de aviso apropriada.

* Se os parâmetros SSL não forem especificados, por padrão, o servidor valida o certificado de CA presente no diretório de dados e fornece ao DBA uma mensagem de aviso apropriada.

Para uma conexão usando a interface administrativa do servidor:

* Se `--admin_ssl_ca` for especificado, o servidor valida o respectivo certificado de CA e fornece ao DBA uma mensagem de aviso apropriada.

* Se `--admin_ssl_capath` for especificado, o servidor valida todos os certificados de CA na pasta respectiva e fornece ao DBA uma mensagem de aviso apropriada.

* Se os parâmetros SSL administrativos não forem especificados, o servidor valida o certificado da CA presente no diretório de dados e fornece uma mensagem de aviso apropriada ao DBA.

**Validação do Certificado do Servidor**

Para uma conexão usando a interface principal do servidor:

* Se `--ssl_cert` não for especificado, o servidor valida o certificado do servidor no diretório de dados padrão.

* Se `--ssl_cert` for fornecido, o servidor valida o certificado do servidor, considerando `--ssl_crl`, se especificado.

* Se um DBA definir a opção de linha de comando para validar certificados, o servidor para em caso de certificados inválidos e uma mensagem de erro apropriada é exibida ao DBA. Caso contrário, o servidor emite mensagens de aviso ao DBA e o servidor inicia.

Para uma conexão usando a interface administrativa do servidor:

* Se `--admin_ssl_cert` não for especificado, o servidor valida o certificado do servidor no diretório de dados padrão.

* Se `--admin_ssl_cert` for fornecido, o servidor valida o certificado do servidor, considerando `--admin_ssl_crl`, se especificado.

* Se um DBA definir a opção de linha de comando para validar certificados, o servidor para em caso de certificados inválidos e uma mensagem de erro apropriada é exibida ao DBA. Caso contrário, o servidor emite mensagens de aviso ao DBA e o servidor inicia.

#### Configurando Conexões Encriptadas como Obrigatórias

Para algumas implantações do MySQL, pode ser não apenas desejável, mas obrigatório, usar conexões encriptadas (por exemplo, para atender a requisitos regulatórios). Esta seção discute as configurações que permitem fazer isso. Esses níveis de controle estão disponíveis:

* Você pode configurar o servidor para exigir que os clientes se conectem usando conexões encriptadas.

* Você pode solicitar que programas de clientes individuais exijam uma conexão criptografada, mesmo que o servidor permita, mas não exija criptografia.

* Você pode configurar contas individuais do MySQL para serem utilizáveis apenas por meio de conexões criptografadas.

Para exigir que os clientes se conectem usando conexões criptografadas, habilite a variável de sistema `require_secure_transport`. Por exemplo, coloque essas linhas no arquivo `my.cnf` do servidor:



Alternativamente, para definir e persistir o valor em tempo de execução, use a seguinte declaração:



`SET PERSIST` define um valor para a instância do MySQL em execução. Ele também salva o valor, fazendo com que ele seja usado para reinicializações subsequentes do servidor. Veja a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”.

Com `require_secure_transport` habilitado, as conexões dos clientes ao servidor são obrigadas a usar alguma forma de transporte seguro, e o servidor permite apenas conexões TCP/IP que usam SSL, ou conexões que usam um arquivo de soquete (no Unix) ou memória compartilhada (no Windows). O servidor rejeita tentativas de conexão não seguras, que falham com um erro `ER_SECURE_TRANSPORT_REQUIRED`.

Para invocar um programa de cliente de modo que ele exija uma conexão criptografada, independentemente de o servidor exigir criptografia, use um valor da opção `--ssl-mode` de `REQUIRED`, `VERIFY_CA` ou `VERIFY_IDENTITY`. Por exemplo:



Para configurar uma conta do MySQL para ser utilizável apenas por meio de conexões criptografadas, inclua uma cláusula `REQUIRE` na declaração `CREATE USER` que cria a conta, especificando nessa cláusula as características de criptografia que você deseja. Por exemplo, para exigir uma conexão criptografada e o uso de um certificado X.509 válido, use `REQUIRE X509`:



Para obter informações adicionais sobre a cláusula `REQUIRE`, consulte a Seção 15.7.1.3, “Declaração CREATE USER”.

Para modificar contas existentes que não têm requisitos de criptografia, use a instrução `ALTER USER`.