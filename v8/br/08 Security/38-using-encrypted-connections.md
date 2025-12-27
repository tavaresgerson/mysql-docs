### 8.3.1 Configurando o MySQL para Usar Conexões Encriptadas

Existem vários parâmetros de configuração disponíveis para indicar se devem ser usadas conexões encriptadas e para especificar os arquivos de certificado e chave apropriados. Esta seção fornece orientações gerais sobre como configurar o servidor e os clientes para conexões encriptadas:

* Configuração de Inicialização no Nível do Servidor para Conexões Encriptadas
* Configuração e Monitoramento de Execução em Tempo Real no Nível do Servidor para Conexões Encriptadas
* Configuração de Conexões Encriptadas no Nível do Cliente
* Configurando a Encaminhamento de Certificados
* Configurando Conexões Encriptadas como Obrigatórias

Conexões encriptadas também podem ser usadas em outros contextos, conforme discutido nessas seções adicionais:

* Entre servidores de replicação de origem e replicação. Veja a Seção 19.3.1, “Configurando a Replicação para Usar Conexões Encriptadas”.
* Entre servidores de replicação de grupo. Veja a Seção 20.6.2, “Segurando Conexões de Comunicação de Grupo com Secure Socket Layer (SSL”)”).
* Por programas cliente baseados na API C do MySQL. Veja Suporte para Conexões Encriptadas.

As instruções para criar os arquivos de certificado e chave necessários estão disponíveis na Seção 8.3.3, “Criando Certificados e Chaves SSL e RSA”.

#### Configuração de Inicialização no Nível do Servidor para Conexões Encriptadas

Para exigir que os clientes se conectem usando conexões encriptadas, habilite a variável de sistema `require_secure_transport`. Veja Configurando Conexões Encriptadas como Obrigatórias.

Essas variáveis de sistema no lado do servidor especificam os arquivos de certificado e chave que o servidor usa ao permitir que os clientes estabeleçam conexões encriptadas:

* `ssl_ca`: O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA). (`ssl_capath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de certificados de CA.)
* `ssl_cert`: O nome do caminho do arquivo de certificado da chave pública do servidor. Este certificado pode ser enviado ao cliente e autenticado contra o certificado de CA que ele possui.
* `ssl_key`: O nome do caminho do arquivo de chave privada do servidor.

Por exemplo, para habilitar o servidor para conexões criptografadas, inicie-o com essas linhas no arquivo `my.cnf`, alterando os nomes dos arquivos conforme necessário:

```
[mysqld]
ssl_ca=ca.pem
ssl_cert=server-cert.pem
ssl_key=server-key.pem
```

Para especificar, além disso, que os clientes são obrigados a usar conexões criptografadas, habilite a variável de sistema `require_secure_transport`:

```
[mysqld]
ssl_ca=ca.pem
ssl_cert=server-cert.pem
ssl_key=server-key.pem
require_secure_transport=ON
```

Cada nome de variável de sistema de certificado e chave especifica um arquivo no formato PEM. Se você precisar criar os arquivos de certificado e chave necessários, consulte a Seção 8.3.3, “Criando Certificados e Chaves SSL e RSA”. Servidores MySQL compilados usando OpenSSL podem gerar automaticamente os arquivos de certificado e chave ausentes no início. Consulte a Seção 8.3.3.1, “Criando Certificados e Chaves SSL e RSA usando MySQL”. Alternativamente, se você tiver uma distribuição de fonte MySQL, pode testar sua configuração usando os arquivos de certificado e chave de demonstração no diretório `mysql-test/std_data`.

O servidor realiza a autodescoberta de arquivos de certificado e chave. Se não forem fornecidas opções explícitas de conexão criptografada para configurar conexões criptografadas, o servidor tenta habilitar o suporte para conexões criptografadas automaticamente no início:

* Se o servidor descobrir arquivos de certificado e chave válidos nomeados `ca.pem`, `server-cert.pem` e `server-key.pem` no diretório de dados, ele habilita o suporte para conexões criptografadas pelos clientes. (Os arquivos não precisam ter sido gerados automaticamente; o que importa é que eles tenham esses nomes e sejam válidos.)
* Se o servidor não encontrar arquivos de certificado e chave válidos no diretório de dados, ele continua executando, mas sem suporte para conexões criptografadas.

Se o servidor habilitar automaticamente o suporte para conexão criptografada, ele escreve uma nota no log de erro. Se o servidor descobrir que o certificado CA é autoassinado, ele escreve uma mensagem de alerta no log de erro. (O certificado é autoassinado se for criado automaticamente pelo servidor.)

O MySQL também fornece essas variáveis de sistema para o controle de conexão criptografada no lado do servidor:

*  `ssl_cipher`: A lista de cifrais permitidos para criptografia de conexão.
*  `ssl_crl`: O nome do caminho do arquivo que contém as listas de revogação de certificados. (`ssl_crlpath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de listas de revogação de certificados.)
*  `tls_version`, `tls_ciphersuites`: Quais protocolos de criptografia e cifrais o servidor permite para conexões criptografadas; consulte a Seção 8.3.2, “Protocolos e cifrais TLS de Conexão Criptografada”. Por exemplo, você pode configurar `tls_version` para impedir que os clientes usem protocolos menos seguros.

Se o servidor não conseguir criar um contexto TLS válido a partir das variáveis de sistema para o controle de conexão criptografada no lado do servidor, o servidor será executado sem suporte para conexões criptografadas.

#### Configuração e Monitoramento de Tempo de Execução no Lado do Servidor para Conexões Criptografadas

As variáveis de sistema `tls_xxx` e `ssl_xxx` são dinâmicas e podem ser definidas no tempo de execução, não apenas no início. Se alteradas com `SET GLOBAL`, os novos valores só se aplicam até o reinício do servidor. Se alteradas com `SET PERSIST`, os novos valores também são mantidos em reinicializações subsequentes do servidor. Consulte  Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”. No entanto, as alterações no tempo de execução nessas variáveis não afetam imediatamente o contexto TLS para novas conexões, conforme explicado mais adiante nesta seção.

Juntamente com a mudança que permite alterações no contexto TLS relacionadas às variáveis do sistema em tempo de execução, o servidor permite atualizações em tempo de execução do contexto TLS realmente usado para novas conexões. Essa capacidade pode ser útil, por exemplo, para evitar reiniciar um servidor MySQL que tem estado em execução por tanto tempo que seu certificado SSL expirou.

Para criar o contexto TLS inicial, o servidor usa os valores que as variáveis do sistema relacionadas ao contexto têm no momento do início. Para expor os valores do contexto, o servidor também inicializa um conjunto de variáveis de status correspondentes. A tabela a seguir mostra as variáveis do sistema que definem o contexto TLS e as variáveis de status correspondentes que expor os valores do contexto atualmente ativos.

**Tabela 8.12 Variáveis de Sistema e Status para Conexão Principal da Interface TLS do Contexto do Servidor**

<table><thead><tr> <th>Nome da Variável de Sistema</th> <th>Nome da Variável de Status Correspondente</th> </tr></thead><tbody><tr> <td><code>ssl_ca</code></td> <td><code>Current_tls_ca</code></td> </tr><tr> <td><code>ssl_capath</code></td> <td><code>Current_tls_capath</code></td> </tr><tr> <td><code>ssl_cert</code></td> <td><code>Current_tls_cert</code></td> </tr><tr> <td><code>ssl_cipher</code></td> <td><code>Current_tls_cipher</code></td> </tr><tr> <td><code>ssl_crl</code></td> <td><code>Current_tls_crl</code></td> </tr><tr> <td><code>ssl_crlpath</code></td> <td><code>Current_tls_crlpath</code></td> </tr><tr> <td><code>ssl_key</code></td> <td><code>Current_tls_key</code></td> </tr><tr> <td><code>tls_ciphersuites</code></td> <td><code>Current_tls_ciphersuites</code></td> </tr><tr> <td><code>tls_version</code></td> <td><code>Current_tls_version</code></td> </tr></tbody></table>

Esses valores ativos do contexto TLS também são exibidos como propriedades na tabela do Schema de Desempenho `tls_channel_status`, juntamente com as propriedades de quaisquer outros contextos TLS ativos.

Para reconfigurar o contexto TLS em tempo de execução, use este procedimento:

1. Defina cada variável de sistema relacionada ao contexto TLS que deve ser alterada para seu novo valor.
2. Execute `ALTER INSTANCE RELOAD TLS`. Esta instrução reconfigura o contexto ativo de TLS a partir dos valores atuais das variáveis de sistema relacionadas ao contexto TLS. Também define as variáveis de status relacionadas ao contexto para refletir os novos valores do contexto ativo. A instrução requer o privilégio `CONNECTION_ADMIN`.
3. Novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` usam o novo contexto de TLS. As conexões existentes permanecem inalteradas. Se as conexões existentes devem ser terminadas, use a instrução `KILL`.

Os membros de cada par de variáveis de sistema e status podem ter valores diferentes temporariamente devido à maneira como o procedimento de reconfiguração funciona:

* Alterações nas variáveis de sistema antes de `ALTER INSTANCE RELOAD TLS` não alteram o contexto de TLS. Neste ponto, essas alterações não têm efeito em novas conexões, e as variáveis de sistema e status relacionadas ao contexto podem ter valores diferentes. Isso permite que você faça quaisquer alterações necessárias nas variáveis de sistema individuais e, em seguida, atualize o contexto de TLS ativo de forma atômica com `ALTER INSTANCE RELOAD TLS` após todas as alterações nas variáveis de sistema terem sido feitas.
* Após `ALTER INSTANCE RELOAD TLS`, as variáveis de sistema e status correspondentes têm os mesmos valores. Isso permanece verdadeiro até a próxima alteração nas variáveis de sistema.

Em alguns casos, `ALTER INSTANCE RELOAD TLS` por si só pode ser suficiente para reconfigurar o contexto de TLS, sem alterar quaisquer variáveis de sistema. Suponha que o certificado no arquivo nomeado por `ssl_cert` tenha expirado. É suficiente substituir o conteúdo do arquivo existente por um certificado não expirado e executar `ALTER INSTANCE RELOAD TLS` para fazer com que o novo conteúdo do arquivo seja lido e usado para novas conexões.

O servidor implementa a configuração independente de criptografia de conexão para a interface de conexão administrativa. Consulte Suporte à Interface Administrativa para Conexões Encriptadas. Além disso, `ALTER INSTANCE RELOAD TLS` é estendido com uma cláusula `FOR CHANNEL` que permite especificar o canal (interface) para o qual deseja recarregar o contexto TLS. Consulte a Seção 15.1.5, “Instrução ALTER INSTANCE”. Não há variáveis de status para expor o contexto TLS da interface administrativa, mas a tabela do Schema de Desempenho `tls_channel_status` expõe propriedades TLS tanto para a interface principal quanto para a administrativa. Consulte a Seção 29.12.22.9, “A Tabela `tls_channel_status`”.

Atualizar o contexto TLS da interface principal tem esses efeitos:

* A atualização altera o contexto TLS usado para novas conexões na interface de conexão principal.
* A atualização também altera o contexto TLS usado para novas conexões na interface administrativa, a menos que algum valor de parâmetro TLS não padrão seja configurado para essa interface.
* A atualização não afeta o contexto TLS usado por outros plugins ou componentes do servidor habilitados, como a Replicação de Grupo ou o X Plugin:

  + Para aplicar a reconfiguração da interface principal às conexões de comunicação do grupo da Replicação de Grupo, que obtêm suas configurações do contexto TLS do sistema da interface do servidor, você deve executar `STOP GROUP_REPLICATION` seguido de `START GROUP_REPLICATION` para parar e reiniciar a Replicação de Grupo.
  + O X Plugin inicializa seu contexto TLS na inicialização do plugin, conforme descrito na Seção 22.5.3, “Usando Conexões Encriptadas com o X Plugin”. Esse contexto não muda posteriormente.

Por padrão, a ação `RELOAD TLS` é revertida com um erro e não tem efeito se os valores de configuração não permitirem a criação do novo contexto TLS. Os valores do contexto anterior continuam sendo usados para novas conexões. Se a cláusula opcional `NO ROLLBACK ON ERROR` for fornecida e o novo contexto não puder ser criado, o rollback não ocorre. Em vez disso, um aviso é gerado e a criptografia é desativada para novas conexões na interface à qual a declaração se aplica.

As opções que habilitam ou desabilitam conexões criptografadas em uma interface de conexão têm efeito apenas no início. Por exemplo, as opções  `--tls-version` e `--admin-tls-version` afetam apenas no início se as interfaces principal e administrativa suportam essas versões de TLS. Tais opções são ignoradas e não têm efeito na operação de `ALTER INSTANCE RELOAD TLS` em tempo de execução. Por exemplo, você pode definir `tls_version=''` para iniciar o servidor com conexões criptografadas desativadas na interface principal, depois reconfigurar o TLS e executar `ALTER INSTANCE RELOAD TLS` para habilitar conexões criptografadas em tempo de execução.

#### Configuração do Lado do Cliente para Conexões Criptografadas

Para uma lista completa das opções do cliente relacionadas ao estabelecimento de conexões criptografadas, consulte Opções de Comando para Conexões Criptografadas.

Por padrão, os programas cliente MySQL tentam estabelecer uma conexão criptografada se o servidor suportar conexões criptografadas, com controle adicional disponível através da opção `--ssl-mode`:

* Na ausência da opção `--ssl-mode`, os clientes tentam se conectar usando criptografia, revertendo para uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida. Esse é também o comportamento com a opção explícita `--ssl-mode=PREFERRED`.
* Com `--ssl-mode=REQUIRED`, os clientes exigem uma conexão criptografada e falham se uma não puder ser estabelecida.
* Com `--ssl-mode=DISABLED`, os clientes usam uma conexão não criptografada.
* Com `--ssl-mode=VERIFY_CA` ou `--ssl-mode=VERIFY_IDENTITY`, os clientes exigem uma conexão criptografada e também realizam verificação contra o certificado da CA do servidor e (com `VERIFY_IDENTITY`) contra o nome do host do servidor em seu certificado. Importante

O ajuste padrão, `--ssl-mode=PREFERRED`, produz uma conexão criptografada se os outros ajustes padrão não forem alterados. No entanto, para ajudar a prevenir ataques sofisticados de intermediário, é importante que o cliente verifique a identidade do servidor. As configurações `--ssl-mode=VERIFY_CA` e `--ssl-mode=VERIFY_IDENTITY` são uma escolha melhor do que o ajuste padrão para ajudar a prevenir esse tipo de ataque. `VERIFY_CA` faz com que o cliente verifique se o certificado do servidor é válido. `VERIFY_IDENTITY` faz com que o cliente verifique se o certificado do servidor é válido e também faz com que o cliente verifique se o nome do host que está usando corresponde à identidade no certificado do servidor. Para implementar uma dessas configurações, você deve primeiro garantir que o certificado da CA do servidor esteja disponível de forma confiável para todos os clientes que o usam em seu ambiente, caso contrário, problemas de disponibilidade resultarão. Por essa razão, elas não são o ajuste padrão.

Tentativas de estabelecer uma conexão não criptografada falham se a variável de sistema `require_secure_transport` for habilitada no lado do servidor para fazer com que o servidor exija conexões criptografadas. Veja Configurando Conexões Criptografadas como Obrigatórias.

As seguintes opções no lado do cliente identificam os arquivos de certificado e chave que os clientes usam ao estabelecer conexões criptografadas com o servidor. Elas são semelhantes às variáveis de sistema `ssl_ca`, `ssl_cert` e `ssl_key` usadas no lado do servidor, mas `--ssl-cert` e `--ssl-key` identificam a chave pública e privada do cliente:

* `--ssl-ca`: O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA). Esta opção, se usada, deve especificar o mesmo certificado usado pelo servidor. (`--ssl-capath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de certificados de CA.)
* `--ssl-cert`: O nome do caminho do arquivo de certificado da chave pública do cliente.
* `--ssl-key`: O nome do caminho do arquivo de chave privada do cliente.

Para uma segurança adicional em relação à criptografia padrão, os clientes podem fornecer um certificado de CA que corresponda ao usado pelo servidor e habilitar a verificação da identidade do nome do host. Dessa forma, o servidor e o cliente confiam no mesmo certificado de CA e o cliente verifica que o host ao qual se conectou é o pretendido:

* Para especificar o certificado de CA, use `--ssl-ca` (ou `--ssl-capath`) e especifique `--ssl-mode=VERIFY_CA`.
* Para habilitar a verificação da identidade do nome do host também, use `--ssl-mode=VERIFY_IDENTITY` em vez de `--ssl-mode=VERIFY_CA`.

::: info Nota

A verificação da identidade do nome do host com `VERIFY_IDENTITY` não funciona com certificados autoassinados que são criados automaticamente pelo servidor (consulte a Seção 8.3.3.1, “Criando Certificados SSL e RSA e Chaves usando MySQL”). Tais certificados autoassinados não contêm o nome do servidor como o valor do Nome Comum.

:::

O MySQL também fornece essas opções para o controle de conexões criptografadas no lado do cliente:

* `--ssl-cipher`: A lista de cifrações permitidas para a criptografia da conexão.
* `--ssl-crl`: O nome do caminho do arquivo que contém as listas de revogação de certificados. (`--ssl-crlpath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de listas de revogação de certificados.)
* `--tls-version`, `--tls-ciphersuites`: Os protocolos de criptografia e as suíte de cifra permitidos; veja a Seção 8.3.2, “Protocolos TLS de Conexão Criptografada e Cifras”.

Dependendo dos requisitos de criptografia da conta MySQL usada por um cliente, o cliente pode ser obrigado a especificar certas opções para se conectar usando criptografia ao servidor MySQL.

Suponha que você queira se conectar usando uma conta que não tem requisitos especiais de criptografia ou que foi criada usando uma instrução `CREATE USER` que incluía a cláusula `REQUIRE SSL`. Supondo que o servidor suporte conexões criptografadas, um cliente pode se conectar usando criptografia sem a opção `--ssl-mode` ou com a opção explícita `--ssl-mode=PREFERRED`:

```
mysql
```

Ou:

```
mysql --ssl-mode=PREFERRED
```

Para uma conta criada com uma cláusula `REQUIRE SSL`, a tentativa de conexão falha se uma conexão criptografada não puder ser estabelecida. Para uma conta sem requisitos especiais de criptografia, a tentativa cai em uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida. Para evitar a queda e falhar se uma conexão criptografada não puder ser obtida, conecte-se assim:

```
mysql --ssl-mode=REQUIRED
```

Se a conta tiver requisitos de segurança mais rigorosos, outras opções devem ser especificadas para estabelecer uma conexão criptografada:

* Para contas criadas com uma cláusula `REQUIRE X509`, os clientes devem especificar pelo menos `--ssl-cert` e `--ssl-key`. Além disso, `--ssl-ca` (ou `--ssl-capath`) é recomendado para que o certificado público fornecido pelo servidor possa ser verificado. Por exemplo (insira o comando em uma única linha):

```
  mysql --ssl-ca=ca.pem
        --ssl-cert=client-cert.pem
        --ssl-key=client-key.pem
  ```
* Para contas criadas com uma cláusula `REQUIRE ISSUER` ou `REQUIRE SUBJECT`, os requisitos de criptografia são os mesmos que para `REQUIRE X509`, mas o certificado deve corresponder à emissão ou ao assunto, respectivamente, especificados na definição da conta.

Para obter informações adicionais sobre a cláusula `REQUIRE`, consulte a Seção 15.7.1.3, “Instrução CREATE USER”.

Os servidores MySQL podem gerar arquivos de certificado e chave do cliente que os clientes podem usar para se conectar às instâncias do servidor MySQL. Veja a Seção 8.3.3, “Criando Certificados e Chaves SSL e RSA”.

Importante

Se um cliente que se conecta a uma instância do servidor MySQL usar um certificado SSL com a extensão `extendedKeyUsage` (uma extensão X.509 v3), o uso estendido da chave deve incluir autenticação de cliente (`clientAuth`). Se o certificado SSL for especificado apenas para autenticação do servidor (`serverAuth`) e outros propósitos que não sejam de certificado do cliente, a verificação do certificado falha e a conexão do cliente com a instância do servidor MySQL falha. Não há extensão `extendedKeyUsage` nos certificados SSL gerados pelo MySQL Server (como descrito na Seção 8.3.3.1, “Criando Certificados SSL e RSA e Chaves usando MySQL”), e os certificados SSL criados usando o comando `openssl` seguindo as instruções na Seção 8.3.3.2, “Criando Certificados SSL e Chaves usando openssl”. Se você usar seu próprio certificado do cliente criado de outra maneira, certifique-se de que qualquer extensão `extendedKeyUsage` inclua a autenticação do cliente.

Para impedir o uso de criptografia e sobrescrever outras opções `--ssl-xxx`, inicie o programa cliente com `--ssl-mode=DISABLED`:

```
mysql --ssl-mode=DISABLED
```

Para determinar se a conexão atual com o servidor usa criptografia, verifique o valor da variável de status `Ssl_cipher` da sessão. Se o valor estiver vazio, a conexão não está criptografada. Caso contrário, a conexão está criptografada e o valor indica o algoritmo de criptografia. Por exemplo:

```
mysql> SHOW SESSION STATUS LIKE 'Ssl_cipher';
+---------------+---------------------------+
| Variable_name | Value                     |
+---------------+---------------------------+
| Ssl_cipher    | DHE-RSA-AES128-GCM-SHA256 |
+---------------+---------------------------+
```

Para o cliente `mysql`, uma alternativa é usar o comando `STATUS` ou `\s` e verificar a linha `SSL`:

```
mysql> \s
...
SSL: Not in use
...
```

Ou:

```
mysql> \s
...
SSL: Cipher in use is DHE-RSA-AES128-GCM-SHA256
...
```

#### Configurando a Execução da Validação de Certificados

A opção `--tls-certificates-enforced-validation` habilita a validação do arquivo de certificado da chave pública do servidor, dos arquivos de certificado da Autoridade de Certificação (CA) e dos arquivos de lista de revogação de certificados no início do servidor:

```
mysqld --tls-certificates-enforced-validation
```

Se definida como `ON`, o servidor interrompe a execução do inicialização caso haja certificados inválidos. O servidor informa aos DBA fornecendo mensagens de depuração válidas, mensagens de erro ou ambas, dependendo do status dos certificados. Essa capacidade pode ser útil, por exemplo, para evitar reiniciar um servidor MySQL que tem estado em execução por tanto tempo que seu certificado SSL expirou.

Da mesma forma, quando você executa a declaração `ALTER INSTANCE RELOAD TLS` para alterar o contexto TLS em tempo de execução, os novos arquivos de certificado do servidor e da CA não são usados se a validação falhar. O servidor continua usando os certificados antigos neste caso. Para mais informações sobre como alterar o contexto TLS dinamicamente, consulte Configuração e Monitoramento de Configuração em Tempo de Execução no Site do Servidor para Conexões Encriptadas.

**Validando Certificados de CA**

Para uma conexão usando a interface principal do servidor:

* Se `--ssl_ca` for especificado, o servidor valida o respectivo certificado de CA e fornece ao DBA uma mensagem de aviso apropriada.
* Se `--ssl_capath` for especificado, o servidor valida todos os certificados de CA na pasta respectiva e fornece ao DBA uma mensagem de aviso apropriada.
* Se os parâmetros SSL não forem especificados, por padrão, o servidor valida o certificado de CA presente no diretório de dados e fornece ao DBA uma mensagem de aviso apropriada.

Para uma conexão usando a interface administrativa do servidor:

* Se `--admin_ssl_ca` for especificado, o servidor valida o respectivo certificado CA e dá ao DBA uma mensagem de aviso apropriada.
* Se `--admin_ssl_capath` for especificado, o servidor valida todos os certificados CA na pasta respectiva e dá ao DBA uma mensagem de aviso apropriada.
* Se os parâmetros SSL administrativos não forem especificados, por padrão, o servidor valida o certificado CA presente no diretório de dados e dá ao DBA uma mensagem de aviso apropriada.

**Validando o Certificado do Servidor**

Para uma conexão usando a interface principal do servidor:

* Se `--ssl_cert` não for especificado, o servidor valida o certificado do servidor no diretório de dados padrão.
* Se `--ssl_cert` for dado, o servidor valida o certificado do servidor, considerando `--ssl_crl`, se especificado.
* Se um DBA definir a opção de linha de comando para validar certificados, o servidor para em caso de certificados inválidos e uma mensagem de erro apropriada é exibida ao DBA. Caso contrário, o servidor emite mensagens de aviso ao DBA e o servidor começa.

Para uma conexão usando a interface administrativa do servidor:

* Se `--admin_ssl_cert` não for especificado, o servidor valida o certificado do servidor no diretório de dados padrão.
* Se `--admin_ssl_cert` for dado, o servidor valida o certificado do servidor, considerando `--admin_ssl_crl`, se especificado.
* Se um DBA definir a opção de linha de comando para validar certificados, o servidor para em caso de certificados inválidos e uma mensagem de erro apropriada é exibida ao DBA. Caso contrário, o servidor emite mensagens de aviso ao DBA e o servidor começa.

#### Configurando Conexões Encriptadas como Obrigatórias

Para algumas implantações do MySQL, pode ser não apenas desejável, mas obrigatório, usar conexões encriptadas (por exemplo, para satisfazer requisitos regulatórios). Esta seção discute as configurações que permitem fazer isso. Esses níveis de controle estão disponíveis:

* Você pode configurar o servidor para exigir que os clientes se conectem usando conexões criptografadas.
* Você pode solicitar que programas de clientes individuais exijam uma conexão criptografada, mesmo que o servidor permita, mas não exija criptografia.
* Você pode configurar contas individuais do MySQL para serem usáveis apenas por meio de conexões criptografadas.

Para exigir que os clientes se conectem usando conexões criptografadas, habilite a variável de sistema `require_secure_transport`. Por exemplo, coloque essas linhas no arquivo `my.cnf` do servidor:

```
[mysqld]
require_secure_transport=ON
```

Alternativamente, para definir e persistir o valor em tempo de execução, use a seguinte declaração:

```
SET PERSIST require_secure_transport=ON;
```

`SET PERSIST` define um valor para a instância do MySQL em execução. Ele também salva o valor, fazendo com que ele seja usado para reinicializações subsequentes do servidor. Veja a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”.

Com `require_secure_transport` habilitado, as conexões de clientes ao servidor são obrigadas a usar alguma forma de transporte seguro, e o servidor permite apenas conexões TCP/IP que usam SSL, ou conexões que usam um arquivo de soquete (no Unix) ou memória compartilhada (no Windows). O servidor rejeita tentativas de conexão não seguras, que falham com um erro `ER_SECURE_TRANSPORT_REQUIRED`.

Para solicitar que um programa de cliente exija uma conexão criptografada, independentemente de o servidor exigir criptografia, use um valor da opção `--ssl-mode` de `REQUIRED`, `VERIFY_CA` ou `VERIFY_IDENTITY`. Por exemplo:

```
mysql --ssl-mode=REQUIRED
mysqldump --ssl-mode=VERIFY_CA
mysqladmin --ssl-mode=VERIFY_IDENTITY
```

Para configurar uma conta do MySQL para ser usável apenas por meio de conexões criptografadas, inclua uma cláusula `REQUIRE` na declaração `CREATE USER` que cria a conta, especificando nessa cláusula as características de criptografia que você deseja. Por exemplo, para exigir uma conexão criptografada e o uso de um certificado X.509 válido, use `REQUIRE X509`:

```
CREATE USER 'jeffrey'@'localhost' REQUIRE X509;
```

Para obter informações adicionais sobre a cláusula `REQUIRE`, veja a Seção 15.7.1.3, “Declaração CREATE USER”.

Para modificar contas existentes que não têm requisitos de criptografia, use a declaração `ALTER USER`.