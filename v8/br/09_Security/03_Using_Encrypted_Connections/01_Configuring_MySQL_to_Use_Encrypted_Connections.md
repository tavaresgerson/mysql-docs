### 8.3.1 Configurando o MySQL para usar conexões criptografadas

Vários parâmetros de configuração estão disponíveis para indicar se devem ser usadas conexões criptografadas e para especificar os arquivos de certificado e chave apropriados. Esta seção fornece orientações gerais sobre a configuração do servidor e dos clientes para conexões criptografadas:

- Configuração de inicialização no lado do servidor para conexões criptografadas

- Configuração e monitoramento do tempo de execução no lado do servidor para conexões criptografadas

- Configuração no lado do cliente para conexões criptografadas

- Configurar conexões criptografadas como obrigatórias

As conexões criptografadas também podem ser usadas em outros contextos, conforme discutido nessas seções adicionais:

- Entre os servidores de replicação de origem e de replicação de réplica. Consulte a Seção 19.3.1, “Configurando a replicação para usar conexões criptografadas”.

- Entre os servidores de replicação em grupo. Consulte a Seção 20.6.2, “Segurança das conexões de comunicação em grupo com Secure Socket Layer (SSL”)”).

- Por meio de programas cliente que são baseados na API C do MySQL. Consulte Suporte para Conexões Encriptadas.

As instruções para criar os arquivos de certificado e chave necessários estão disponíveis na Seção 8.3.3, “Criando Certificados e Chaves SSL e RSA”.

#### Configuração de inicialização no lado do servidor para conexões criptografadas

No lado do servidor, a opção `--ssl` especifica que o servidor permite, mas não exige, conexões criptografadas. Esta opção está habilitada por padrão, portanto, não precisa ser especificada explicitamente.

Para exigir que os clientes se conectem usando conexões criptografadas, habilite a variável de sistema `require_secure_transport`. Consulte Configurando Conexões Criptografadas como Obrigatórias.

Essas variáveis de sistema no lado do servidor especificam os arquivos de certificado e chave que o servidor usa ao permitir que os clientes estabeleçam conexões criptografadas:

- `ssl_ca`: O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA). (`ssl_capath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de certificados da CA.)

- `ssl_cert`: O nome do caminho do arquivo de certificado da chave pública do servidor. Este certificado pode ser enviado ao cliente e autenticado contra o certificado da CA que ele possui.

- `ssl_key`: O nome do caminho do arquivo de chave privada do servidor.

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

Cada certificado e sistema de variáveis de chave nomeiam um arquivo no formato PEM. Se você precisar criar os arquivos de certificado e chave necessários, consulte a Seção 8.3.3, “Criando Certificados e Chaves SSL e RSA”. Servidores MySQL compilados usando o OpenSSL podem gerar automaticamente os arquivos de certificado e chave ausentes durante o inicialização. Consulte a Seção 8.3.3.1, “Criando Certificados e Chaves SSL e RSA usando o MySQL”. Alternativamente, se você tiver uma distribuição de fonte MySQL, pode testar sua configuração usando os arquivos de certificado e chave de demonstração em seu diretório `mysql-test/std_data`.

O servidor realiza a autodescoberta de arquivos de certificado e chave. Se não forem fornecidas opções explícitas de conexão criptografada, exceto `--ssl` (possível junto com `ssl_cipher`) para configurar conexões criptografadas, o servidor tentará habilitar o suporte à conexão criptografada automaticamente na inicialização:

- Se o servidor descobrir arquivos de certificado e chave válidos com os nomes `ca.pem`, `server-cert.pem` e `server-key.pem` no diretório de dados, ele habilitará o suporte para conexões criptografadas pelos clientes. (Os arquivos não precisam ter sido gerados automaticamente; o importante é que tenham esses nomes e sejam válidos.)

- Se o servidor não encontrar arquivos de certificado e chave válidos no diretório de dados, ele continuará executando, mas sem suporte para conexões criptografadas.

Se o servidor habilitar automaticamente o suporte à conexão criptografada, ele escreve uma nota no log de erro. Se o servidor descobrir que o certificado da CA é autoassinado, ele escreve uma mensagem de alerta no log de erro. (O certificado é autoassinado se for criado automaticamente pelo servidor ou manualmente usando **mysql\_ssl\_rsa\_setup**.)

O MySQL também fornece essas variáveis de sistema para o controle de conexão criptografada no lado do servidor:

- `ssl_cipher`: A lista de cifra permitida para a criptografia da conexão.

- `ssl_crl`: O nome do caminho do arquivo que contém listas de revogação de certificados. (`ssl_crlpath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de listas de revogação de certificados.)

- `tls_version`, `tls_ciphersuites`: Quais protocolos de criptografia e conjuntos de cifra o servidor permite para conexões criptografadas; consulte a Seção 8.3.2, “Protocolos e cifra TLS de Conexão Criptografada”. Por exemplo, você pode configurar `tls_version` para impedir que os clientes usem protocolos menos seguros.

Se o servidor não conseguir criar um contexto TLS válido a partir das variáveis do sistema para o controle de conexão criptografada no lado do servidor, o servidor será executado sem suporte para conexões criptografadas.

#### Configuração e monitoramento do tempo de execução no lado do servidor para conexões criptografadas

Antes do MySQL 8.0.16, as variáveis de sistema `tls_xxx` e `ssl_xxx` que configuram o suporte à conexão criptografada só podem ser definidas durante o início do servidor. Essas variáveis de sistema, portanto, determinam o contexto TLS que o servidor usa para todas as novas conexões.

A partir do MySQL 8.0.16, as variáveis de sistema `tls_xxx` e `ssl_xxx` são dinâmicas e podem ser definidas em tempo de execução, não apenas no momento do início. Se alteradas com `SET GLOBAL`, os novos valores só se aplicam até o reinício do servidor. Se alteradas com `SET PERSIST`, os novos valores também são mantidos em reinícios subsequentes do servidor. Consulte a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”. No entanto, as alterações em tempo de execução nessas variáveis não afetam imediatamente o contexto TLS para novas conexões, conforme explicado mais adiante nesta seção.

Juntamente com a mudança no MySQL 8.0.16 que permite alterações em tempo de execução nas variáveis de sistema relacionadas ao contexto TLS, o servidor permite atualizações em tempo de execução do contexto TLS real usado para novas conexões. Essa capacidade pode ser útil, por exemplo, para evitar reiniciar um servidor MySQL que tem estado em execução por tanto tempo que seu certificado SSL expirou.

Para criar o contexto inicial do TLS, o servidor usa os valores que as variáveis de sistema relacionadas ao contexto têm ao iniciar. Para expor os valores do contexto, o servidor também inicializa um conjunto de variáveis de status correspondentes. A tabela a seguir mostra as variáveis de sistema que definem o contexto do TLS e as variáveis de status correspondentes que expor os valores do contexto atualmente ativos.

**Tabela 8.12 Variáveis de sistema e status para a interface de conexão principal do servidor TLS**

<table summary="As variáveis de sistema que definem o contexto TLS do servidor e as variáveis de status correspondentes que exibem os valores do contexto ativo."><thead><tr> <th>Nome da variável do sistema</th> <th>Nome da variável de status correspondente</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CODE_<code>ssl_crlpath</code>]</td> <td>[[PH_HTML_CODE_<code>ssl_crlpath</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>ssl_key</code>]</td> <td>[[PH_HTML_CODE_<code>Current_tls_key</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>tls_ciphersuites</code>]</td> <td>[[PH_HTML_CODE_<code>Current_tls_ciphersuites</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>tls_version</code>]</td> <td>[[PH_HTML_CODE_<code>Current_tls_version</code>]</td> </tr><tr> <td>[[<code>ssl_crl</code>]]</td> <td>[[<code>Current_tls_crl</code>]]</td> </tr><tr> <td>[[<code>ssl_crlpath</code>]]</td> <td>[[<code>Current_tls_ca</code><code>ssl_crlpath</code>]</td> </tr><tr> <td>[[<code>ssl_key</code>]]</td> <td>[[<code>Current_tls_key</code>]]</td> </tr><tr> <td>[[<code>tls_ciphersuites</code>]]</td> <td>[[<code>Current_tls_ciphersuites</code>]]</td> </tr><tr> <td>[[<code>tls_version</code>]]</td> <td>[[<code>Current_tls_version</code>]]</td> </tr></tbody></table>

A partir do MySQL 8.0.21, esses valores de contexto TLS ativos também são exibidos como propriedades na tabela do Gerenciador de Desempenho `tls_channel_status`, juntamente com as propriedades de quaisquer outros contextos TLS ativos.

Para reconfigurar o contexto TLS em tempo de execução, use este procedimento:

1. Defina cada variável de sistema relacionada ao contexto TLS que deve ser alterada para seu novo valor.

2. Execute `ALTER INSTANCE RELOAD TLS`. Esta declaração reconfigura o contexto TLS ativo a partir dos valores atuais das variáveis de sistema relacionadas ao contexto TLS. Também define as variáveis de status relacionadas ao contexto para refletir os novos valores do contexto ativo. A declaração requer o privilégio `CONNECTION_ADMIN`.

3. Novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` utilizam o novo contexto TLS. As conexões existentes permanecem inalteradas. Se as conexões existentes devem ser encerradas, use a instrução `KILL`.

Os membros de cada par de variáveis de sistema e status podem ter valores diferentes temporariamente devido à forma como o procedimento de reconfiguração funciona:

- Alterações nas variáveis do sistema antes de `ALTER INSTANCE RELOAD TLS` não alteram o contexto TLS. Neste ponto, essas alterações não têm efeito em novas conexões, e as variáveis de sistema e status relacionadas ao contexto podem ter valores diferentes. Isso permite que você faça quaisquer alterações necessárias nas variáveis individuais do sistema e, em seguida, atualize o contexto TLS ativo atomicamente com `ALTER INSTANCE RELOAD TLS` após todas as alterações nas variáveis do sistema terem sido feitas.

- Após `ALTER INSTANCE RELOAD TLS`, as variáveis de sistema e status correspondentes têm os mesmos valores. Isso permanece verdadeiro até a próxima alteração nas variáveis de sistema.

Em alguns casos, o `ALTER INSTANCE RELOAD TLS` por si só pode ser suficiente para reconfigurar o contexto TLS, sem alterar nenhuma variável do sistema. Suponha que o certificado no arquivo nomeado por `ssl_cert` tenha expirado. Basta substituir o conteúdo do arquivo existente por um certificado não expirado e executar `ALTER INSTANCE RELOAD TLS` para que o novo conteúdo do arquivo seja lido e utilizado para novas conexões.

A partir do MySQL 8.0.21, o servidor implementa a configuração independente de criptografia de conexão para a interface de conexão administrativa. Consulte Suporte à Interface Administrativa para Conexões Criptografadas. Além disso, o `ALTER INSTANCE RELOAD TLS` é estendido com uma cláusula `FOR CHANNEL` que permite especificar o canal (interface) para o qual será recarregado o contexto TLS. Consulte a Seção 15.1.5, “Instrução ALTER INSTANCE”. Não há variáveis de status para expor o contexto TLS da interface administrativa, mas a tabela `tls_channel_status` do Schema de Desempenho expõe propriedades TLS tanto para a interface principal quanto para a administrativa. Consulte a Seção 29.12.21.9, “A tabela tls\_channel\_status”.

A atualização do contexto da interface principal TLS tem esses efeitos:

- A atualização altera o contexto TLS usado para novas conexões na interface de conexão principal.

- A atualização também altera o contexto TLS usado para novas conexões na interface administrativa, a menos que algum valor de parâmetro TLS não padrão seja configurado para essa interface.

- A atualização não afeta o contexto TLS usado por outros plugins ou componentes do servidor habilitados, como a Replicação de Grupo ou o X Plugin:

  - Para aplicar a reconfiguração da interface principal nas conexões de comunicação de grupo da Replicação em Grupo, que obtêm suas configurações das variáveis de sistema relacionadas ao contexto TLS do servidor, você deve executar `STOP GROUP_REPLICATION` seguido de `START GROUP_REPLICATION` para parar e reiniciar a Replicação em Grupo.

  - O X Plugin inicia seu contexto TLS na inicialização do plugin, conforme descrito na Seção 22.5.3, “Usando Conexões Encriptadas com o X Plugin”. Esse contexto não muda posteriormente.

Por padrão, a ação `RELOAD TLS` é revertida com um erro e não tem efeito se os valores de configuração não permitirem a criação do novo contexto TLS. Os valores do contexto anterior continuam sendo usados para novas conexões. Se a cláusula opcional `NO ROLLBACK ON ERROR` for fornecida e o novo contexto não puder ser criado, o rollback não ocorre. Em vez disso, um aviso é gerado e a criptografia é desativada para novas conexões na interface à qual a declaração se aplica.

As opções que permitem ou desabilitam conexões criptografadas em uma interface de conexão têm efeito apenas no momento do início. Por exemplo, as opções `--ssl` e `--admin-ssl` afetam apenas no momento do início se as interfaces principal e administrativa suportam conexões criptografadas. Tais opções são ignoradas e não têm efeito na operação do `ALTER INSTANCE RELOAD TLS` em tempo de execução. Por exemplo, você pode usar `--ssl=OFF` para iniciar o servidor com conexões criptografadas desativadas na interface principal, depois reconfigurar o TLS e executar `ALTER INSTANCE RELOAD TLS` para habilitar conexões criptografadas em tempo de execução.

#### Configuração no lado do cliente para conexões criptografadas

Para uma lista completa das opções do cliente relacionadas à configuração de conexões criptografadas, consulte Opções de comando para conexões criptografadas.

Por padrão, os programas clientes do MySQL tentam estabelecer uma conexão criptografada se o servidor suportar conexões criptografadas, com controle adicional disponível através da opção `--ssl-mode`:

- Na ausência de uma opção `--ssl-mode`, os clientes tentam se conectar usando criptografia, revertendo para uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida. Esse é também o comportamento com uma opção explícita `--ssl-mode=PREFERRED`.

- Com `--ssl-mode=REQUIRED`, os clientes exigem uma conexão criptografada e falham se não puderem ser estabelecidas.

- Com `--ssl-mode=DISABLED`, os clientes usam uma conexão não criptografada.

- Com `--ssl-mode=VERIFY_CA` ou `--ssl-mode=VERIFY_IDENTITY`, os clientes exigem uma conexão criptografada e também realizam verificação contra o certificado da CA do servidor e (com `VERIFY_IDENTITY`) contra o nome do host do servidor em seu certificado.

Importante

A configuração padrão, `--ssl-mode=PREFERRED`, produz uma conexão criptografada se os outros ajustes padrão não forem alterados. No entanto, para ajudar a prevenir ataques sofisticados de intermediário, é importante que o cliente verifique a identidade do servidor. Os ajustes `--ssl-mode=VERIFY_CA` e `--ssl-mode=VERIFY_IDENTITY` são uma escolha melhor do que a configuração padrão para ajudar a prevenir esse tipo de ataque. `VERIFY_CA` faz com que o cliente verifique se o certificado do servidor é válido. `VERIFY_IDENTITY` faz com que o cliente verifique se o certificado do servidor é válido e também faz com que o cliente verifique se o nome do host que está usando corresponde à identidade no certificado do servidor. Para implementar um desses ajustes, você deve primeiro garantir que o certificado CA do servidor esteja disponível de forma confiável para todos os clientes que o usam em seu ambiente, caso contrário, problemas de disponibilidade ocorrerão. Por essa razão, eles não são a configuração padrão.

As tentativas de estabelecer uma conexão não criptografada falham se a variável de sistema `require_secure_transport` estiver habilitada no lado do servidor para exigir conexões criptografadas. Consulte Configurando Conexões Criptografadas como Obrigatórias.

As seguintes opções no lado do cliente identificam os arquivos de certificado e chave que os clientes usam ao estabelecer conexões criptografadas com o servidor. Eles são semelhantes às variáveis de sistema `ssl_ca`, `ssl_cert` e `ssl_key` usadas no lado do servidor, mas `--ssl-cert` e `--ssl-key` identificam a chave pública e privada do cliente:

- `--ssl-ca`: O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA). Esta opção, se usada, deve especificar o mesmo certificado utilizado pelo servidor. (`--ssl-capath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de certificados da CA.)

- `--ssl-cert`: O nome do caminho do arquivo de certificado da chave pública do cliente.

- `--ssl-key`: O nome do caminho do arquivo de chave privada do cliente.

Para uma segurança adicional em relação à criptografia padrão, os clientes podem fornecer um certificado de CA que corresponda ao utilizado pelo servidor e habilitar a verificação da identidade do nome do host. Dessa forma, o servidor e o cliente confiam no mesmo certificado de CA e o cliente verifica se o host ao qual se conectou é o pretendido:

- Para especificar o certificado da CA, use `--ssl-ca` (ou `--ssl-capath`) e especifique `--ssl-mode=VERIFY_CA`.

- Para habilitar a verificação de identidade do nome do host também, use `--ssl-mode=VERIFY_IDENTITY` em vez de `--ssl-mode=VERIFY_CA`.

Nota

A verificação de identidade do nome do host com `VERIFY_IDENTITY` não funciona com certificados autoassinados que são criados automaticamente pelo servidor ou manualmente usando **mysql\_ssl\_rsa\_setup** (consulte a Seção 8.3.3.1, “Criando Certificados e Chaves SSL e RSA Usando o MySQL”). Esses certificados autoassinados não contêm o nome do servidor como valor do Nome Comum.

Antes do MySQL 8.0.12, a verificação de identidade do nome do host também não funciona com certificados que especificam o Nome Comum usando asteriscos, porque esse nome é comparado literalmente ao nome do servidor.

O MySQL também oferece essas opções para controle de conexão criptografada no lado do cliente:

- `--ssl-cipher`: A lista de cifra permitida para a criptografia da conexão.

- `--ssl-crl`: O nome do caminho do arquivo que contém listas de revogação de certificados. (`--ssl-crlpath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de listas de revogação de certificados.)

- `--tls-version`, `--tls-ciphersuites`: Os protocolos de criptografia e as suites de cifra permitidos; consulte a Seção 8.3.2, “Protocolos e cifra de conexão TLS criptografada”.

Dependendo dos requisitos de criptografia da conta MySQL usada por um cliente, o cliente pode ser obrigado a especificar certas opções para se conectar usando criptografia ao servidor MySQL.

Suponha que você queira se conectar usando uma conta que não tenha requisitos de criptografia especiais ou que tenha sido criada usando uma declaração `CREATE USER` que incluísse a cláusula `REQUIRE SSL`. Supondo que o servidor suporte conexões criptografadas, um cliente pode se conectar usando criptografia sem a opção `--ssl-mode` ou com uma opção explícita `--ssl-mode=PREFERRED`:

```
mysql
```

Ou:

```
mysql --ssl-mode=PREFERRED
```

Para uma conta criada com uma cláusula `REQUIRE SSL`, a tentativa de conexão falha se uma conexão criptografada não puder ser estabelecida. Para uma conta sem requisitos especiais de criptografia, a tentativa retorna a uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida. Para evitar a falha e a interrupção se uma conexão criptografada não puder ser obtida, conecte-se da seguinte maneira:

```
mysql --ssl-mode=REQUIRED
```

Se a conta tiver requisitos de segurança mais rigorosos, outras opções devem ser especificadas para estabelecer uma conexão criptografada:

- Para contas criadas com uma cláusula `REQUIRE X509`, os clientes devem especificar pelo menos `--ssl-cert` e `--ssl-key`. Além disso, `--ssl-ca` (ou `--ssl-capath`) é recomendado para que o certificado público fornecido pelo servidor possa ser verificado. Por exemplo (insira o comando em uma única linha):

  ```
  mysql --ssl-ca=ca.pem
        --ssl-cert=client-cert.pem
        --ssl-key=client-key.pem
  ```

- Para contas criadas com uma cláusula `REQUIRE ISSUER` ou `REQUIRE SUBJECT`, os requisitos de criptografia são os mesmos que para `REQUIRE X509`, mas o certificado deve corresponder à emissão ou ao assunto, respectivamente, especificados na definição da conta.

Para obter informações adicionais sobre a cláusula `REQUIRE`, consulte a Seção 15.7.1.3, “Instrução CREATE USER”.

Os servidores MySQL podem gerar arquivos de certificado e chave do cliente que os clientes podem usar para se conectar às instâncias do servidor MySQL. Veja a Seção 8.3.3, “Criando Certificados e Chaves SSL e RSA”.

Importante

Se um cliente que se conecta a uma instância do servidor MySQL usar um certificado SSL com a extensão `extendedKeyUsage` (uma extensão X.509 v3), o uso de chave estendido deve incluir a autenticação do cliente (`clientAuth`). Se o certificado SSL for especificado apenas para autenticação do servidor (`serverAuth`) e para outros fins que não sejam de certificado do cliente, a verificação do certificado falha e a conexão do cliente com a instância do servidor MySQL falha. Não há extensão `extendedKeyUsage` em certificados SSL gerados pelo MySQL Server (como descrito na Seção 8.3.3.1, “Criando Certificados SSL e RSA e Chaves Usando MySQL”), e os certificados SSL criados usando o comando **openssl** seguindo as instruções na Seção 8.3.3.2, “Criando Certificados e Chaves SSL Usando openssl”. Se você usar seu próprio certificado do cliente criado de outra maneira, certifique-se de que qualquer extensão `extendedKeyUsage` inclua a autenticação do cliente.

Para impedir o uso de criptografia e ignorar outras opções `--ssl-xxx`, inicie o programa cliente com `--ssl-mode=DISABLED`:

```
mysql --ssl-mode=DISABLED
```

Para determinar se a conexão atual com o servidor usa criptografia, verifique o valor da sessão da variável de status `Ssl_cipher`. Se o valor estiver vazio, a conexão não está criptografada. Caso contrário, a conexão está criptografada e o valor indica o algoritmo de criptografia. Por exemplo:

```
mysql> SHOW SESSION STATUS LIKE 'Ssl_cipher';
+---------------+---------------------------+
| Variable_name | Value                     |
+---------------+---------------------------+
| Ssl_cipher    | DHE-RSA-AES128-GCM-SHA256 |
+---------------+---------------------------+
```

Para o cliente **mysql**, uma alternativa é usar o comando `STATUS` ou `\s` e verificar a linha `SSL`:

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

#### Configurar conexões criptografadas como obrigatórias

Para algumas implantações do MySQL, pode ser não apenas desejável, mas também obrigatório, usar conexões criptografadas (por exemplo, para atender a requisitos regulatórios). Esta seção discute as configurações que permitem fazer isso. Esses níveis de controle estão disponíveis:

- Você pode configurar o servidor para exigir que os clientes se conectem usando conexões criptografadas.

- Você pode solicitar que os programas de clientes individuais exijam uma conexão criptografada, mesmo que o servidor permita, mas não exija criptografia.

- Você pode configurar contas individuais do MySQL para serem usadas apenas por meio de conexões criptografadas.

Para exigir que os clientes se conectem usando conexões criptografadas, habilite a variável de sistema `require_secure_transport`. Por exemplo, coloque essas linhas no arquivo do servidor `my.cnf`:

```
[mysqld]
require_secure_transport=ON
```

Alternativamente, para definir e persistir o valor em tempo de execução, use esta declaração:

```
SET PERSIST require_secure_transport=ON;
```

`SET PERSIST` define um valor para a instância do MySQL em execução. Ele também salva o valor, fazendo com que ele seja usado para reinicializações subsequentes do servidor. Veja a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”.

Com o `require_secure_transport` ativado, as conexões do cliente ao servidor exigem o uso de algum tipo de transporte seguro, e o servidor permite apenas conexões TCP/IP que utilizam SSL, ou conexões que utilizam um arquivo de soquete (no Unix) ou memória compartilhada (no Windows). O servidor rejeita tentativas de conexão não seguras, que falham com um erro `ER_SECURE_TRANSPORT_REQUIRED`.

Para invocar um programa cliente de modo que ele exija uma conexão criptografada, independentemente de o servidor exigir criptografia ou não, use um valor de opção `--ssl-mode` de `REQUIRED`, `VERIFY_CA` ou `VERIFY_IDENTITY`. Por exemplo:

```
mysql --ssl-mode=REQUIRED
mysqldump --ssl-mode=VERIFY_CA
mysqladmin --ssl-mode=VERIFY_IDENTITY
```

Para configurar uma conta MySQL para ser usada apenas por meio de conexões criptografadas, inclua uma cláusula `REQUIRE` na instrução `CREATE USER` que cria a conta, especificando naquela cláusula as características de criptografia que você deseja. Por exemplo, para exigir uma conexão criptografada e o uso de um certificado X.509 válido, use `REQUIRE X509`:

```
CREATE USER 'jeffrey'@'localhost' REQUIRE X509;
```

Para obter informações adicionais sobre a cláusula `REQUIRE`, consulte a Seção 15.7.1.3, “Instrução CREATE USER”.

Para modificar contas existentes que não têm requisitos de criptografia, use a declaração `ALTER USER`.
