## 8.3 Usando conexões criptografadas

Com uma conexão não criptografada entre o cliente MySQL e o servidor, alguém com acesso à rede poderia assistir a todo o seu tráfego e inspecionar os dados enviados ou recebidos entre o cliente e o servidor.

Quando você precisa mover informações de forma segura em uma rede, uma conexão não criptografada é inaceitável. Para tornar qualquer tipo de dados ilegível, use criptografia. Os algoritmos de criptografia devem incluir elementos de segurança para resistir a muitos tipos de ataques conhecidos, como alterar a ordem de mensagens criptografadas ou repetir dados duas vezes.

O MySQL suporta conexões criptografadas entre clientes e o servidor usando o protocolo TLS (Segurança de Camada de Transporte). O TLS é às vezes referido como SSL (Secure Sockets Layer), mas o MySQL não usa realmente o protocolo SSL para conexões criptografadas porque sua criptografia é fraca (veja Seção 8.3.2, “Protocolos e cifra TLS de conexão criptografada”).

O TLS utiliza algoritmos de criptografia para garantir que os dados recebidos em uma rede pública possam ser confiáveis. Ele possui mecanismos para detectar alterações, perda ou repetição de dados. O TLS também incorpora algoritmos que fornecem verificação de identidade usando o padrão X.509.

O X.509 permite identificar alguém na Internet. Em termos básicos, deve haver alguma entidade chamada "Autoridade de Certificação" (ou CA) que atribui certificados eletrônicos a qualquer pessoa que os precise. Os certificados dependem de algoritmos de criptografia assimétrica que têm duas chaves de criptografia (uma chave pública e uma chave secreta). O proprietário do certificado pode apresentar o certificado a outra parte como prova de identidade. Um certificado consiste na chave pública do seu proprietário. Qualquer dado criptografado usando essa chave pública pode ser descriptografado apenas usando a chave secreta correspondente, que é mantida pelo proprietário do certificado.

O suporte para conexões criptografadas no MySQL é fornecido usando o OpenSSL. Para informações sobre os protocolos de criptografia e cifras suportados pelo OpenSSL, consulte a Seção 8.3.2, “Protocolos e cifras de conexão criptografada TLS”.

Por padrão, as instâncias do MySQL estabelecem uma ligação a uma biblioteca OpenSSL instalada disponível no momento da execução para suporte a conexões criptografadas e outras operações relacionadas à criptografia. Você pode compilar o MySQL a partir de fonte e usar a opção `WITH_SSL` **CMake** para especificar o caminho de uma versão específica da OpenSSL instalada ou um pacote alternativo do OpenSSL no sistema. Nesse caso, o MySQL seleciona essa versão. Para obter instruções sobre como fazer isso, consulte a Seção 2.8.6, “Configurando o suporte à biblioteca de SSL”.

De MySQL 8.0.11 a 8.0.17, era possível compilar o MySQL usando wolfSSL como uma alternativa ao OpenSSL. A partir do MySQL 8.0.18, o suporte ao wolfSSL é removido e todos os builds do MySQL usam o OpenSSL.

Você pode verificar qual versão da biblioteca OpenSSL está sendo usada em tempo de execução usando a variável de status do sistema `Tls_library_version`, que está disponível a partir do MySQL 8.0.30.

Se você compilar o MySQL com uma versão do OpenSSL e quiser mudar para uma versão diferente sem recompilar, pode fazer isso editando o caminho do carregador de bibliotecas dinâmicas (`LD_LIBRARY_PATH` em sistemas Unix ou `PATH` em sistemas Windows). Remova o caminho da versão compilada do OpenSSL e adicione o caminho da versão de substituição, colocando-o antes de qualquer outra biblioteca OpenSSL no caminho. No momento do início, quando o MySQL não encontrar a versão do OpenSSL especificada com `WITH_SSL` no caminho, ele usa a primeira versão especificada no caminho.

Por padrão, os programas do MySQL tentam se conectar usando criptografia se o servidor suportar conexões criptografadas, revertendo para uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida. Para informações sobre as opções que afetam o uso de conexões criptografadas, consulte a Seção 8.3.1, “Configurando o MySQL para usar conexões criptografadas” e Opções de comando para conexões criptografadas.

O MySQL realiza a criptografia em uma base por conexão, e o uso de criptografia para um usuário específico pode ser opcional ou obrigatório. Isso permite que você escolha uma conexão criptografada ou não criptografada de acordo com as necessidades das aplicações individuais. Para obter informações sobre como exigir que os usuários usem conexões criptografadas, consulte a discussão da cláusula `REQUIRE` da declaração `CREATE USER` na Seção 15.7.1.3, “Declaração CREATE USER”. Veja também a descrição da variável de sistema `require_secure_transport` na Seção 7.1.8, “Variáveis do Sistema do Servidor”

Conexões criptografadas podem ser usadas entre servidores de origem e replicação. Veja a Seção 19.3.1, “Configurando a Replicação para Usar Conexões Criptografadas”.

Para obter informações sobre o uso de conexões criptografadas da API C do MySQL, consulte Suporte para Conexões Criptografadas.

Também é possível se conectar usando criptografia dentro de uma conexão SSH ao host do servidor MySQL. Para um exemplo, consulte a Seção 8.3.4, “Conectando-se ao MySQL remotamente a partir do Windows com SSH”.

### 8.3.1 Configurando o MySQL para usar conexões criptografadas

Vários parâmetros de configuração estão disponíveis para indicar se deve usar conexões criptografadas e especificar os arquivos de certificado e chave apropriados. Esta seção fornece orientações gerais sobre a configuração do servidor e dos clientes para conexões criptografadas:

* Configuração de inicialização do lado do servidor para conexões criptografadas
* [Configuração e monitoramento do lado do servidor do tempo de execução para conexões criptografadas][(using-encrypted-connections.html#using-encrypted-connections-server-side-runtime-configuration "Server-Side Runtime Configuration and Monitoring for Encrypted Connections")]

* Configuração do lado do cliente para conexões criptografadas
* Configurar conexões criptografadas como obrigatórias

As conexões criptografadas também podem ser usadas em outros contextos, conforme discutido nessas seções adicionais:

* Entre os servidores de replicação de origem e de replicação de réplica. Veja a Seção 19.3.1, “Configurando a Replicação para Usar Conexões Encriptadas”.

* Entre servidores de Replicação de Grupo. Consulte a Seção 20.6.2, “Segurando conexões de comunicação de grupo com Secure Socket Layer (SSL)”).

* Por programas de clientes que são baseados na API C do MySQL. Veja Suporte para Conexões Encriptadas.

As instruções para criar os arquivos de certificado e chave necessários estão disponíveis na Seção 8.3.3, “Criando certificados e chaves SSL e RSA”.

#### Configuração de inicialização do lado do servidor para conexões criptografadas

No lado do servidor, a opção `--ssl` especifica que o servidor permite, mas não exige conexões criptografadas. Essa opção é habilitada por padrão, portanto, não precisa ser especificada explicitamente.

Para exigir que os clientes se conectem usando conexões criptografadas, habilite a variável de sistema `require_secure_transport`. Veja Configurando Conexões Criptografadas como Obrigatórias.

Essas variáveis do sistema do lado do servidor especificam os arquivos de certificado e chave que o servidor usa ao permitir que os clientes estabeleçam conexões criptografadas:

* `ssl_ca`: O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA). (`ssl_capath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de certificado da CA.)

* `ssl_cert`: O nome do caminho do arquivo de certificado da chave pública do servidor. Este certificado pode ser enviado ao cliente e autenticado contra o certificado da CA que ele possui.

* `ssl_key`: O nome do caminho do arquivo da chave privada do servidor.

Por exemplo, para habilitar o servidor para conexões criptografadas, comece-o com essas linhas no arquivo `my.cnf`, alterando os nomes dos arquivos conforme necessário:

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

Cada certificado e sistema de variáveis de chave nomeiam um arquivo no formato PEM. Se você precisar criar os arquivos de certificado e chave necessários, consulte a Seção 8.3.3, “Criando Certificados e Chaves SSL e RSA”. Servidores MySQL compilados usando OpenSSL podem gerar automaticamente os arquivos de certificado e chave ausentes no início. Consulte a Seção 8.3.3.1, “Criando Certificados e Chaves SSL e RSA usando MySQL”. Alternativamente, se você tiver uma distribuição de fonte MySQL, pode testar sua configuração usando os arquivos de certificado e chave de demonstração em seu diretório `mysql-test/std_data`.

O servidor realiza a autodetecção de arquivos de certificado e chave. Se não forem fornecidas opções explícitas de conexão criptografada, exceto `--ssl` (possivelmente juntamente com `ssl_cipher`) para configurar conexões criptografadas, o servidor tenta habilitar o suporte de conexão criptografada automaticamente na inicialização:

* Se o servidor descobrir arquivos de certificado e chave válidos com os nomes `ca.pem`, `server-cert.pem` e `server-key.pem` no diretório de dados, ele habilitará o suporte para conexões criptografadas pelos clientes. (Os arquivos não precisam ter sido gerados automaticamente; o que importa é que eles tenham esses nomes e sejam válidos.)

* Se o servidor não encontrar arquivos de certificado e chave válidos no diretório de dados, ele continuará executando, mas sem suporte para conexões criptografadas.

Se o servidor habilitar automaticamente o suporte para conexão criptografada, ele escreve uma nota no log de erro. Se o servidor descobrir que o certificado CA é autoassinado, ele escreve um aviso no log de erro. (O certificado é autoassinado se criado automaticamente pelo servidor ou manualmente usando **mysql_ssl_rsa_setup**.

O MySQL também fornece essas variáveis de sistema para o controle de conexão criptografada do lado do servidor:

* `ssl_cipher`: A lista de cifra permitida para criptografia de conexão.

* `ssl_crl`: O nome do caminho do arquivo que contém listas de revogação de certificados. (`ssl_crlpath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de listas de revogação de certificados.)

* `tls_version`, `tls_ciphersuites`: Quais protocolos de criptografia e conjuntos de cifras o servidor permite para conexões criptografadas; consulte a Seção 8.3.2, “Protocolos e cifras TLS de conexão criptografada”. Por exemplo, você pode configurar `tls_version` para impedir que os clientes usem protocolos menos seguros.

Se o servidor não conseguir criar um contexto TLS válido a partir das variáveis do sistema para o controle de conexão criptografada do lado do servidor, o servidor será executado sem suporte para conexões criptografadas.

#### Configuração e monitoramento do runtime do lado do servidor para conexões criptografadas

Antes do MySQL 8.0.16, as variáveis de sistema `tls_xxx` e `ssl_xxx` que configuram o suporte a conexão criptografada podem ser definidas apenas na inicialização do servidor. Essas variáveis de sistema, portanto, determinam o contexto TLS que o servidor usa para todas as novas conexões.

A partir do MySQL 8.0.16, as variáveis de sistema `tls_xxx` e `ssl_xxx` são dinâmicas e podem ser definidas em tempo de execução, não apenas no momento do início. Se alteradas com [`SET GLOBAL`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment"), os novos valores só se aplicam até o reinício do servidor. Se alteradas com [`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment"), os novos valores também são aplicados em reinícios subsequentes do servidor. Veja a Seção 15.7.6.1, “Sintaxe de definição para atribuição de variáveis”. No entanto, as alterações em tempo de execução nessas variáveis não afetam imediatamente o contexto TLS para novas conexões, conforme explicado mais adiante nesta seção.

Juntamente com a mudança no MySQL 8.0.16 que permite alterações ao vivo nas variáveis de sistema relacionadas ao contexto TLS, o servidor permite atualizações ao vivo para o contexto TLS real usado para novas conexões. Essa capacidade pode ser útil, por exemplo, para evitar reiniciar um servidor MySQL que tem sido executado por tanto tempo que seu certificado SSL expirou.

Para criar o contexto inicial do TLS, o servidor utiliza os valores que as variáveis de sistema relacionadas ao contexto têm no momento do início. Para expor os valores do contexto, o servidor também inicializa um conjunto de variáveis de status correspondentes. O quadro a seguir mostra as variáveis de sistema que definem o contexto do TLS e as variáveis de status correspondentes que expor os valores do contexto atualmente ativos.

**Tabela 8.12 Variáveis do sistema e de status para a interface de conexão principal do servidor TLS**

<table summary="The system variables that define the server TLS context and the corresponding status variables that expose active context values."><col style="width: 45%"/><col style="width: 55%"/><thead><tr> <th>System Variable Name</th> <th>Corresponding Status Variable Name</th> </tr></thead><tbody><tr> <td><code>ssl_ca</code></td> <td><code>Current_tls_ca</code></td> </tr><tr> <td><code>ssl_capath</code></td> <td><code>Current_tls_capath</code></td> </tr><tr> <td><code>ssl_cert</code></td> <td><code>Current_tls_cert</code></td> </tr><tr> <td><code>ssl_cipher</code></td> <td><code>Current_tls_cipher</code></td> </tr><tr> <td><code>ssl_crl</code></td> <td><code>Current_tls_crl</code></td> </tr><tr> <td><code>ssl_crlpath</code></td> <td><code>Current_tls_crlpath</code></td> </tr><tr> <td><code>ssl_key</code></td> <td><code>Current_tls_key</code></td> </tr><tr> <td><code>tls_ciphersuites</code></td> <td><code>Current_tls_ciphersuites</code></td> </tr><tr> <td><code>tls_version</code></td> <td><code>Current_tls_version</code></td> </tr></tbody></table>

A partir do MySQL 8.0.21, esses valores ativos do contexto TLS também são exibidos como propriedades na tabela do Gerador de desempenho `tls_channel_status`, juntamente com as propriedades de quaisquer outros contextos TLS ativos.

Para reconfigurar o contexto TLS em tempo de execução, use este procedimento:

1. Defina cada variável do sistema relacionada ao contexto TLS que deve ser alterada para seu novo valor.

2. Execute `ALTER INSTANCE RELOAD TLS`](alter-instance.html#alter-instance-reload-tls). Esta declaração reconfigura o contexto ativo do TLS a partir dos valores atuais das variáveis de sistema relacionadas ao contexto do TLS. Também define as variáveis de status relacionadas ao contexto para refletir os novos valores do contexto ativo. A declaração requer o privilégio `CONNECTION_ADMIN`.

3. As novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` utilizam o novo contexto TLS. As conexões existentes permanecem sem alterações. Se as conexões existentes devem ser terminadas, use a declaração `KILL`.

Os membros de cada par de variáveis de sistema e status podem ter valores diferentes temporariamente devido à forma como o procedimento de reconfiguração funciona:

* Alterações nas variáveis do sistema antes de `ALTER INSTANCE RELOAD TLS` não alteram o contexto TLS. Neste ponto, essas alterações não têm efeito em novas conexões, e as variáveis de sistema e de status relacionadas ao contexto podem ter valores diferentes. Isso permite que você faça quaisquer alterações necessárias nas variáveis individuais do sistema e, em seguida, atualize o contexto TLS ativo atomicamente com `ALTER INSTANCE RELOAD TLS` após todas as alterações nas variáveis do sistema terem sido feitas.

* Após `ALTER INSTANCE RELOAD TLS`(alter-instance.html#alter-instance-reload-tls), as variáveis de sistema e status correspondentes têm os mesmos valores. Isso permanece verdadeiro até a próxima alteração nas variáveis do sistema.

Em alguns casos, `ALTER INSTANCE RELOAD TLS` por si só pode ser suficiente para reconfigurar o contexto TLS, sem alterar quaisquer variáveis do sistema. Suponha que o certificado no arquivo denominado por `ssl_cert` tenha expirado. É suficiente substituir o conteúdo do arquivo existente por um certificado não expirado e executar `ALTER INSTANCE RELOAD TLS` para fazer com que o novo conteúdo do arquivo seja lido e utilizado para novas conexões.

A partir do MySQL 8.0.21, o servidor implementa uma configuração independente de criptografia de conexão para a interface de conexão administrativa. Consulte Suporte à Interface Administrativa para Conexões Encriptadas. Além disso, `ALTER INSTANCE RELOAD TLS` (alter-instance.html#alter-instance-reload-tls) é estendido com uma cláusula `FOR CHANNEL` que permite especificar o canal (interface) para o qual se deseja recarregar o contexto TLS. Consulte Seção 15.1.5, “Instrução ALTER INSTANCE”. Não há variáveis de status para expor o contexto TLS da interface administrativa, mas a tabela `tls_channel_status` do Schema de Desempenho expõe propriedades TLS tanto para as interfaces principal quanto administrativa. Consulte Seção 29.12.21.9, “A tabela tls_channel_status”.

Atualizar o contexto principal da interface TLS tem esses efeitos:

* A atualização altera o contexto TLS usado para novas conexões na interface de conexão principal.

* A atualização também altera o contexto TLS usado para novas conexões na interface administrativa, a menos que algum valor de parâmetro TLS não padrão seja configurado para essa interface.

* A atualização não afeta o contexto TLS utilizado por outros plugins ou componentes de servidor habilitados, como a Replicação de Grupo ou o X Plugin:

+ Para aplicar a reconfiguração da interface principal nas conexões de comunicação de grupo da Replicação em grupo, que obtêm suas configurações das variáveis de sistema relacionadas ao contexto TLS do servidor, você deve executar `STOP GROUP_REPLICATION` seguido por `START GROUP_REPLICATION`](start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement") para parar e reiniciar a Replicação em grupo.

+ X O plugin inicializa seu contexto TLS na inicialização do plugin, conforme descrito na Seção 22.5.3, “Usando conexões criptografadas com o X Plugin”. Esse contexto não muda posteriormente.

Por padrão, a ação `RELOAD TLS` é revertida com um erro e não tem efeito se os valores de configuração não permitirem a criação do novo contexto TLS. Os valores dos contextos anteriores continuam a ser usados para novas conexões. Se a cláusula opcional `NO ROLLBACK ON ERROR` for dada e o novo contexto não puder ser criado, o rollback não ocorre. Em vez disso, um aviso é gerado e a criptografia é desativada para novas conexões na interface à qual a declaração se aplica.

As opções que permitem ou desabilitam conexões criptografadas em uma interface de conexão têm efeito apenas no momento do início. Por exemplo, as opções `--ssl` e `--admin-ssl` afetam apenas no momento do início se as interfaces principal e administrativa suportam conexões criptografadas. Tais opções são ignoradas e não têm efeito sobre o funcionamento do [`ALTER INSTANCE RELOAD TLS`(alter-instance.html#alter-instance-reload-tls) em tempo de execução. Por exemplo, você pode usar `--ssl=OFF` para iniciar o servidor com conexões criptografadas desativadas na interface principal, depois reconfigurar o TLS e executar [`ALTER INSTANCE RELOAD TLS`(alter-instance.html#alter-instance-reload-tls) para habilitar conexões criptografadas em tempo de execução.

#### Configuração do lado do cliente para conexões criptografadas

Para uma lista completa das opções do cliente relacionadas à configuração de conexões criptografadas, consulte Opções de comando para conexões criptografadas.

Por padrão, os programas de cliente MySQL tentam estabelecer uma conexão criptografada se o servidor suportar conexões criptografadas, com controle adicional disponível através da opção `--ssl-mode`:

* Na ausência de uma opção `--ssl-mode`, os clientes tentam se conectar usando criptografia, revertendo para uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida. Esse também é o comportamento com uma opção explícita `--ssl-mode=PREFERRED`.

* Com `--ssl-mode=REQUIRED`, os clientes exigem uma conexão criptografada e falham se não puder ser estabelecida.

* Com `--ssl-mode=DISABLED`, os clientes usam uma conexão não criptografada.

* Com `--ssl-mode=VERIFY_CA` ou `--ssl-mode=VERIFY_IDENTITY`, os clientes exigem uma conexão criptografada e também realizam verificação contra o certificado da CA do servidor e (com `VERIFY_IDENTITY`) contra o nome do host do servidor em seu certificado.

Importante

A configuração padrão, `--ssl-mode=PREFERRED`, produz uma conexão criptografada se os outros ajustes padrão não forem alterados. No entanto, para ajudar a prevenir ataques sofisticados de homem no meio, é importante que o cliente verifique a identidade do servidor. Os ajustes `--ssl-mode=VERIFY_CA` e `--ssl-mode=VERIFY_IDENTITY` são uma escolha melhor do que a configuração padrão para ajudar a prevenir esse tipo de ataque. `VERIFY_CA` faz com que o cliente verifique se o certificado do servidor é válido. `VERIFY_IDENTITY` faz com que o cliente verifique se o certificado do servidor é válido, e também faz com que o cliente verifique se o nome de host que o cliente está usando corresponde à identidade no certificado do servidor. Para implementar um desses ajustes, você deve primeiro garantir que o certificado da CA do servidor esteja disponível de forma confiável para todos os clientes que o usam em seu ambiente, caso contrário, problemas de disponibilidade resultarão. Por essa razão, eles não são a configuração padrão.

As tentativas de estabelecer uma conexão não criptografada falham se a variável de sistema `require_secure_transport` estiver habilitada no lado do servidor, fazendo com que o servidor exija conexões criptografadas. Veja Configurando Conexões Criptografadas como Obrigatórias.

As seguintes opções do lado do cliente identificam os arquivos de certificado e chave que os clientes usam ao estabelecer conexões criptografadas com o servidor. Eles são semelhantes às variáveis de sistema `ssl_ca`, `ssl_cert` e `ssl_key` usadas do lado do servidor, mas `--ssl-cert` e `--ssl-key` identificam a chave pública e privada do cliente:

* `--ssl-ca`: O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA). Esta opção, se utilizada, deve especificar o mesmo certificado utilizado pelo servidor. (`--ssl-capath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de certificado da CA.)

* `--ssl-cert`: O nome do caminho do arquivo de certificado da chave pública do cliente.

* `--ssl-key`: O nome do caminho do arquivo da chave privada do cliente.

Para uma segurança adicional em relação àquela fornecida pela criptografia padrão, os clientes podem fornecer um certificado CA que corresponda ao utilizado pelo servidor e habilitar a verificação da identidade do nome do host. Dessa forma, o servidor e o cliente colocam sua confiança no mesmo certificado CA e o cliente verifica que o host ao qual se conectou é o pretendido:

* Para especificar o certificado CA, use `--ssl-ca` (ou `--ssl-capath`) e especifique `--ssl-mode=VERIFY_CA`.

* Para habilitar a verificação de identidade do nome do host também, use `--ssl-mode=VERIFY_IDENTITY` em vez de `--ssl-mode=VERIFY_CA`.

Nota

A verificação de identidade do nome do host com `VERIFY_IDENTITY` não funciona com certificados autoassinados que são criados automaticamente pelo servidor ou manualmente usando **mysql_ssl_rsa_setup** (consulte Seção 8.3.3.1, “Criando certificados e chaves SSL e RSA usando MySQL”). Esses certificados autoassinados não contêm o nome do servidor como valor de Nome Comum.

Antes do MySQL 8.0.12, a verificação de identidade do nome do host também não funciona com certificados que especificam o Nome Comum usando caracteres especiais, porque esse nome é comparado literalmente ao nome do servidor.

O MySQL também oferece essas opções para controle de conexão criptografada do lado do cliente:

* `--ssl-cipher`: A lista de cifra permitida para criptografia de conexão.

* `--ssl-crl`: O nome do caminho do arquivo que contém listas de revogação de certificados. (`--ssl-crlpath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de listas de revogação de certificados.)

* `--tls-version`, `--tls-ciphersuites`: Os protocolos e conjuntos de cifras de criptografia permitidos; ver Seção 8.3.2, “Protocolos e cifras de conexão criptografada TLS”.

Dependendo dos requisitos de criptografia da conta MySQL utilizada por um cliente, o cliente pode ser obrigado a especificar certas opções para se conectar usando criptografia ao servidor MySQL.

Suponha que você queira se conectar usando uma conta que não tenha requisitos especiais de criptografia ou que tenha sido criada usando uma declaração `CREATE USER` que incluísse a cláusula `REQUIRE SSL`. Supondo que o servidor suporte conexões criptografadas, um cliente pode se conectar usando criptografia sem a opção `--ssl-mode` ou com uma opção explícita `--ssl-mode=PREFERRED`:

```
mysql
```

Ou:

```
mysql --ssl-mode=PREFERRED
```

Para uma conta criada com uma cláusula `REQUIRE SSL`, a tentativa de conexão falha se uma conexão criptografada não puder ser estabelecida. Para uma conta sem requisitos especiais de criptografia, a tentativa retorna a uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida. Para evitar a falha e o retorno se uma conexão criptografada não puder ser obtida, conecte-se da seguinte forma:

```
mysql --ssl-mode=REQUIRED
```

Se a conta tiver requisitos de segurança mais rigorosos, outras opções devem ser especificadas para estabelecer uma conexão criptografada:

* Para contas criadas com uma cláusula `REQUIRE X509`, os clientes devem especificar pelo menos `--ssl-cert` e `--ssl-key`. Além disso, `--ssl-ca` (ou `--ssl-capath`) é recomendado para que o certificado público fornecido pelo servidor possa ser verificado. Por exemplo (entre no comando em uma única linha):

  ```
  mysql --ssl-ca=ca.pem
        --ssl-cert=client-cert.pem
        --ssl-key=client-key.pem
  ```

* Para contas criadas com uma cláusula `REQUIRE ISSUER` ou `REQUIRE SUBJECT`, os requisitos de criptografia são os mesmos que para `REQUIRE X509`, mas o certificado deve corresponder à emissão ou ao assunto, respectivamente, especificados na definição da conta.

Para informações adicionais sobre a cláusula `REQUIRE`, consulte a Seção 15.7.1.3, “Instrução CREATE USER”.

Os servidores MySQL podem gerar arquivos de certificado e chave do cliente que os clientes podem usar para se conectar às instâncias do servidor MySQL. Veja a Seção 8.3.3, “Criando certificados e chaves SSL e RSA”.

Importante

Se um cliente que se conecta a uma instância do servidor MySQL usar um certificado SSL com a extensão `extendedKeyUsage` (uma extensão X.509 v3), o uso de chave estendido deve incluir autenticação do cliente (`clientAuth`). Se o certificado SSL for especificado apenas para autenticação do servidor (`serverAuth`) e para outros propósitos que não sejam certificados de cliente, a verificação do certificado falha e a conexão do cliente com a instância do servidor MySQL falha. Não há extensão `extendedKeyUsage` em certificados SSL gerados pelo MySQL Server (como descrito na Seção 8.3.3.1, “Criando Certificados e Chaves SSL e RSA Usando MySQL”), e os certificados SSL criados usando o comando **openssl** seguindo as instruções na Seção 8.3.3.2, “Criando Certificados e Chaves SSL Usando openssl”. Se você usar seu próprio certificado de cliente criado de outra maneira, certifique-se de que qualquer extensão `extendedKeyUsage` inclua autenticação do cliente.

Para impedir o uso de criptografia e substituir outras opções do `--ssl-xxx`, invoque o programa cliente com `--ssl-mode=DISABLED`:

```
mysql --ssl-mode=DISABLED
```

Para determinar se a conexão atual com o servidor utiliza criptografia, verifique o valor da sessão da variável de status `Ssl_cipher`. Se o valor estiver vazio, a conexão não está criptografada. Caso contrário, a conexão está criptografada e o valor indica o algoritmo de criptografia. Por exemplo:

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

#### Configurando conexões criptografadas como obrigatórias

Para algumas implantações do MySQL, pode não ser apenas desejável, mas obrigatório, usar conexões criptografadas (por exemplo, para satisfazer requisitos regulatórios). Esta seção discute as configurações que permitem fazer isso. Esses níveis de controle estão disponíveis:

* Você pode configurar o servidor para exigir que os clientes se conectem usando conexões criptografadas.

* Você pode invocar programas individuais de cliente para exigir uma conexão criptografada, mesmo que o servidor permita, mas não exija criptografia.

* Você pode configurar contas individuais do MySQL para serem utilizáveis apenas em conexões criptografadas.

Para exigir que os clientes se conectem usando conexões criptografadas, habilite a variável de sistema `require_secure_transport`. Por exemplo, coloque essas linhas no arquivo do servidor `my.cnf`:

```
[mysqld]
require_secure_transport=ON
```

Como alternativa, para definir e persistir o valor no tempo de execução, use esta declaração:

```
SET PERSIST require_secure_transport=ON;
```

`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") define um valor para a instância MySQL em execução. Também salva o valor, fazendo com que ele seja usado para reinicializações subsequentes do servidor. Veja a Seção 15.7.6.1, “Sintaxe SET para atribuição de variáveis”.

Com `require_secure_transport` habilitado, as conexões do cliente ao servidor exigem o uso de algum tipo de transporte seguro, e o servidor permite apenas conexões TCP/IP que utilizam SSL, ou conexões que utilizam um arquivo de soquete (em Unix) ou memória compartilhada (em Windows). O servidor rejeita tentativas de conexão não seguras, que falham com um erro `ER_SECURE_TRANSPORT_REQUIRED`.

Para invocar um programa cliente que exija uma conexão criptografada, independentemente de o servidor exigir criptografia, use um valor de opção `--ssl-mode` de `REQUIRED`, `VERIFY_CA` ou `VERIFY_IDENTITY`. Por exemplo:

```
mysql --ssl-mode=REQUIRED
mysqldump --ssl-mode=VERIFY_CA
mysqladmin --ssl-mode=VERIFY_IDENTITY
```

Para configurar uma conta MySQL para ser utilizável apenas em conexões criptografadas, inclua uma cláusula `REQUIRE` na declaração `CREATE USER` que cria a conta, especificando naquela cláusula as características de criptografia que você deseja. Por exemplo, para exigir uma conexão criptografada e o uso de um certificado X.509 válido, use `REQUIRE X509`:

```
CREATE USER 'jeffrey'@'localhost' REQUIRE X509;
```

Para informações adicionais sobre a cláusula `REQUIRE`, consulte a Seção 15.7.1.3, “Instrução CREATE USER”.

Para modificar contas existentes que não possuem requisitos de criptografia, use a declaração `ALTER USER`.

### 8.3.2 Conexão Encriptada Protocolos e cifra TLS

O MySQL suporta vários protocolos e cifras TLS e permite configurar quais protocolos e cifras permitir para conexões criptografadas. Também é possível determinar qual protocolo e cifra a sessão atual usa.

* Protocolos TLS suportados
* Remoção do suporte aos protocolos TLSv1 e TLSv1.1
* Configuração do protocolo de conexão TLS
* Configuração do cifrador de conexão
* Negociação do protocolo TLS de conexão
* Monitoramento do protocolo e cifrador atual da sessão do cliente

#### Protocolos TLS suportados

O conjunto de protocolos permitidos para conexões a uma instância específica do servidor MySQL está sujeito a vários fatores, conforme descrito a seguir:

Versão do MySQL Server: * Até e incluindo o MySQL 8.0.15, o MySQL suporta os protocolos TLSv1, TLSv1.1 e TLSv1.2.

* A partir do MySQL 8.0.16, o MySQL também suporta o protocolo TLSv1.3. Para usar o TLSv1.3, tanto o servidor MySQL quanto o aplicativo cliente devem ser compilados usando OpenSSL 1.1.1 ou superior. O componente de Replicação de Grupo suporta TLSv1.3 a partir do MySQL 8.0.18 (para detalhes, consulte a Seção 20.6.2, “Segurando Conexões de Comunicação de Grupo com Secure Socket Layer (SSL)”).)

* A partir do MySQL 8.0.26, os protocolos TLSv1 e TLSv1.1 são desaconselhados. Essas versões de protocolo são antigas, lançadas em 1996 e 2006, respectivamente, e os algoritmos usados são fracos e desatualizados. Para informações de fundo, consulte o memorando do IETF [Deprecating TLSv1.0 and TLSv1.1][(https://tools.ietf.org/id/draft-ietf-tls-oldversions-deprecate-02.html)].

* A partir do MySQL 8.0.28, o MySQL não suporta mais os protocolos TLSv1 e TLSv1.1. A partir desta versão, os clientes não podem estabelecer uma conexão TLS/SSL com o protocolo definido como TLSv1 ou TLSv1.1. Para mais detalhes, consulte Remoção do suporte aos protocolos TLSv1 e TLSv1.1.

**Tabela 8.13 Suporte ao Protocolo TLS do MySQL Server**

    <table><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>MySQL Server Release</th> <th>Protocolos TLS suportados</th> </tr></thead><tbody><tr> <td>MySQL 8.0.15 e versões anteriores</td> <td>TLSv1, TLSv1.1, TLSv1.2</td> </tr><tr> <td>MySQL 8.0.16 e MySQL 8.0.17</td> <td>TLSv1, TLSv1.1, TLSv1.2, TLSv1.3 (exceto Replicação de Grupo)</td> </tr><tr> <td>MySQL 8.0.18 a MySQL 8.0.25</td> <td>TLSv1, TLSv1.1, TLSv1.2, TLSv1.3 (incluindo Replicação por Grupo)</td> </tr><tr> <td>MySQL 8.0.26 e MySQL 8.0.27</td> <td>TLSv1 (desatualizado), TLSv1.1 (desatualizado), TLSv1.2, TLSv1.3</td> </tr><tr> <td>MySQL 8.0.28 e superior</td> <td>TLSv1.2, TLSv1.3</td> </tr></tbody></table>

Biblioteca SSL: Se a biblioteca SSL não suportar um protocolo específico, o MySQL também não o faz, e quaisquer partes da discussão a seguir que especifiquem esse protocolo não se aplicam. Em particular, note que, para usar TLSv1.3, tanto o servidor MySQL quanto o aplicativo cliente devem ser compilados usando OpenSSL 1.1.1 ou superior. O MySQL Server verifica a versão do OpenSSL no início e, se for inferior a 1.1.1, o TLSv1.3 é removido do valor padrão para as variáveis do sistema do servidor relacionadas às versões TLS (`tls_version`, `admin_tls_version` e `group_replication_recovery_tls_version`).

Configuração da instância do MySQL:   Os protocolos TLS permitidos podem ser configurados tanto no lado do servidor quanto no lado do cliente para incluir apenas um subconjunto dos protocolos TLS suportados. A configuração em ambos os lados deve incluir pelo menos um protocolo em comum, ou as tentativas de conexão não podem negociar um protocolo a ser usado. Para obter detalhes, consulte Negociação de protocolo TLS de conexão.

Configuração do host em todo o sistema: O sistema do host pode permitir apenas certos protocolos TLS, o que significa que as conexões do MySQL não podem usar protocolos não permitidos, mesmo que o próprio MySQL os permita:

* Suponha que a configuração do MySQL permita TLSv1, TLSv1.1 e TLSv1.2, mas a configuração do seu sistema de hospedagem permita apenas conexões que utilizem TLSv1.2 ou superior. Nesse caso, você não pode estabelecer conexões MySQL que utilizem TLSv1 ou TLSv1.1, mesmo que o MySQL esteja configurado para permitir essas conexões, porque o sistema de hospedagem não as permite.

* Se a configuração do MySQL permitir TLSv1, TLSv1.1 e TLSv1.2, mas a configuração do sistema do seu host permite apenas conexões que utilizem TLSv1.3 ou superior, você não poderá estabelecer conexões no MySQL, porque nenhum protocolo permitido pelo MySQL é permitido pelo sistema do host.

As soluções para este problema incluem:

* Altere a configuração do host em todo o sistema para permitir protocolos TLS adicionais. Consulte a documentação do seu sistema operacional para obter instruções. Por exemplo, seu sistema pode ter um arquivo `/etc/ssl/openssl.cnf` que contém essas linhas para restringir os protocolos TLS a TLSv1.2 ou superior:

      ```
      [system_default_sect]
      MinProtocol = TLSv1.2
      ```

Mudar o valor para uma versão de protocolo mais baixa ou `None` torna o sistema mais permissivo. Essa solução tem a desvantagem de que permitir protocolos mais baixos (menos seguros) pode ter consequências adversas à segurança.

* Se você não pode ou não quer alterar a configuração TLS do sistema hoste, mude as aplicações do MySQL para usar protocolos TLS mais altos (mais seguros) que sejam permitidos pelo sistema hoste. Isso pode não ser possível para versões mais antigas do MySQL que suportam apenas versões de protocolo mais baixas. Por exemplo, TLSv1 é o único protocolo suportado antes do MySQL 5.6.46, então as tentativas de se conectar a um servidor pré-5.6.46 falham mesmo que o cliente seja de uma versão mais recente do MySQL que suporte versões de protocolo mais altas. Nesses casos, pode ser necessário fazer uma atualização para uma versão do MySQL que suporte versões adicionais de TLS.

#### Remoção do suporte aos protocolos TLSv1 e TLSv1.1

O suporte aos protocolos de conexão TLSv1 e TLSv1.1 é removido a partir do MySQL 8.0.28. Os protocolos foram descontinuados a partir do MySQL 8.0.26. Para informações de fundo, consulte [RFC 8996][(https://tools.ietf.org/html/rfc8996)] (Descontinuando TLS 1.0 e TLS 1.1). É recomendável que as conexões sejam feitas usando os protocolos mais seguros TLSv1.2 e TLSv1.3. O TLSv1.3 exige que o servidor MySQL e o aplicativo cliente sejam compilados com OpenSSL 1.1.1.

O suporte ao TLSv1 e ao TLSv1.1 foi removido porque essas versões de protocolo são antigas, lançadas em 1996 e 2006, respectivamente. Os algoritmos usados são fracos e desatualizados. A menos que você esteja usando versões muito antigas do MySQL Server ou dos conectores, é improvável que você tenha conexões usando TLSv1.0 ou TLSv1.1. Os conectores e clientes do MySQL selecionam a versão TLS mais alta disponível por padrão.

Nas versões onde os protocolos de conexão TLSv1 e TLSv1.1 não são suportados (a partir do MySQL 8.0.28 em diante), os clientes, incluindo o MySQL Shell, que suportam a opção `--tls-version` para especificar protocolos TLS para conexões ao servidor MySQL, não podem fazer uma conexão TLS/SSL com o protocolo definido como TLSv1 ou TLSv1.1. Se um cliente tentar se conectar usando esses protocolos, para conexões TCP, a conexão falha e um erro é retornado ao cliente. Para conexões de soquete, se `--ssl-mode` estiver definido como `REQUIRED`, a conexão falha, caso contrário, a conexão é feita, mas com TLS/SSL desativado.

No lado do servidor, os seguintes ajustes são feitos a partir do MySQL 8.0.28:

* Os valores padrão das variáveis de sistema `tls_version` e `admin_tls_version` do servidor já não incluem TLSv1 e TLSv1.1.

* O valor padrão da variável do sistema de replicação de grupo `group_replication_recovery_tls_version` não inclui TLSv1 e TLSv1.1.

* Para replicação assíncrona, as réplicas não podem definir o protocolo para as conexões ao servidor de origem como TLSv1 ou TLSv1.1 (a opção `SOURCE_TLS_VERSION` da declaração [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement")).

Nas versões onde os protocolos de conexão TLSv1 e TLSv1.1 são descontinuados (MySQL 8.0.26 e MySQL 8.0.27), o servidor escreve um aviso no log de erro se eles estiverem incluídos nos valores da variável de sistema `tls_version` ou `admin_tls_version`, e se um cliente se conectar com sucesso usando eles. Um aviso também é retornado se você definir os protocolos descontinuados no tempo de execução e os implementar usando a declaração `ALTER INSTANCE RELOAD TLS`. Os clientes, incluindo réplicas que especificam protocolos TLS para conexões com o servidor de origem e membros do grupo de replicação de grupo que especificam protocolos TLS para conexões de recuperação distribuída, não emitem avisos se estiverem configurados para permitir um protocolo TLS descontinuado.

Para mais informações, consulte [MySQL 8.0 suporta TLS 1.0 e 1.1?][(faqs-security.html#faq-mysql-tls-versions "A.9.7.")]

#### Configuração do Protocolo TLS de Conexão

No lado do servidor, o valor da variável de sistema `tls_version` determina quais protocolos TLS um servidor MySQL permite para conexões criptografadas. O valor de `tls_version` se aplica a conexões de clientes, conexões regulares de replicação de origem/replica onde essa instância do servidor é a origem, conexões de comunicação de grupo de replicação de grupo e conexões de recuperação distribuída de replicação de grupo onde essa instância do servidor é o doador. A interface de conexão administrativa é configurada de forma semelhante, mas usa a variável de sistema `admin_tls_version` (ver Seção 7.1.12.2, “Gestão de Conexão Administrativa”). Esta discussão também se aplica a `admin_tls_version`.

O valor `tls_version` é uma lista de uma ou mais versões do protocolo TLS separadas por vírgula, que não é sensível ao caso. Por padrão, essa variável lista todos os protocolos que são suportados pela biblioteca SSL usada para compilar o MySQL e pelo lançamento do MySQL Server. Os ajustes padrão, portanto, são os mostrados na Tabela 8.14, “Configurações padrão do protocolo TLS do MySQL Server”.

**Tabela 8.14 Configurações padrão do protocolo TLS do servidor MySQL**

<table><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>MySQL Server Release</th> <th><code>tls_version</code>Configuração Predefinida</th> </tr></thead><tbody><tr> <td>MySQL 8.0.15 e versões anteriores</td> <td><p> <code>TLSv1,TLSv1.1,TLSv1.2</code> </p></td> </tr><tr> <td>MySQL 8.0.16 e MySQL 8.0.17</td> <td><p> <code class="literal">TLSv1,TLSv1.1,TLSv1.2,TLSv1.3 (with OpenSSL 1.1.1)</code> </p><p> <code> TLSv1,TLSv1.1,TLSv1.2 (otherwise) </code> </p><p>A Replicação em grupo não suporta TLSv1.3</p></td> </tr><tr> <td>MySQL 8.0.18 a MySQL 8.0.25</td> <td><p> <code class="literal"> TLSv1,TLSv1.1,TLSv1.2,TLSv1.3 (with OpenSSL 1.1.1)</code> </p><p> <code> TLSv1,TLSv1.1,TLSv1.2 (otherwise) </code> </p><p>O Replicação em grupo suporta TLSv1.3</p></td> </tr><tr> <td>MySQL 8.0.26 e MySQL 8.0.27</td> <td><p> <code class="literal">TLSv1,TLSv1.1,TLSv1.2,TLSv1.3 (with OpenSSL 1.1.1)</code> </p><p> <code> TLSv1,TLSv1.1,TLSv1.2 (otherwise) </code> </p><p>TLSv1 e TLSv1.1 são desaconselhados</p></td> </tr><tr> <td>MySQL 8.0.28 e superior</td> <td><p> <code>TLSv1.2,TLSv1.3</code> </p></td> </tr></tbody></table>

Para determinar o valor de `tls_version` no momento da execução, use esta declaração:

```
mysql> SHOW GLOBAL VARIABLES LIKE 'tls_version';
+---------------+-----------------------+
| Variable_name | Value                 |
+---------------+-----------------------+
| tls_version   | TLSv1.2,TLSv1.3       |
+---------------+-----------------------+
```

Para alterar o valor de `tls_version`, configure-o na inicialização do servidor. Por exemplo, para permitir conexões que utilizem o protocolo TLSv1.2 ou TLSv1.3, mas proibir conexões que utilizem os protocolos TLSv1 e TLSv1.1 menos seguros, use essas linhas no arquivo `my.cnf` do servidor:

```
[mysqld]
tls_version=TLSv1.2,TLSv1.3
```

Para ser ainda mais restritivo e permitir apenas conexões TLSv1.3, configure `tls_version` da seguinte forma:

```
[mysqld]
tls_version=TLSv1.3
```

A partir do MySQL 8.0.16, `tls_version` pode ser alterado em tempo de execução. Consulte [Configuração e monitoramento de execução no lado do servidor para conexões criptografadas][(using-encrypted-connections.html#using-encrypted-connections-server-side-runtime-configuration "Server-Side Runtime Configuration and Monitoring for Encrypted Connections")].

Do lado do cliente, a opção `--tls-version` especifica quais protocolos TLS um programa cliente permite para conexões ao servidor. O formato do valor da opção é o mesmo que para a variável de sistema `tls_version` descrita anteriormente (uma lista de uma ou mais versões de protocolo separadas por vírgula).

Para conexões de replicação de origem/replica onde essa instância do servidor é a replica, a opção `SOURCE_TLS_VERSION` | `MASTER_TLS_VERSION` para a declaração `CHANGE REPLICATION SOURCE TO` (do MySQL 8.0.23) ou a declaração [`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (antes do MySQL 8.0.23) especifica quais protocolos TLS a replica permite para conexões à origem. O formato do valor da opção é o mesmo que para a variável de sistema `tls_version` descrita anteriormente. Veja a Seção 19.3.1, “Configurando a Replicação para Usar Conexões Encriptadas”.

Os protocolos que podem ser especificados para `SOURCE_TLS_VERSION` | `MASTER_TLS_VERSION` dependem da biblioteca SSL. Esta opção é independente e não afetada pelo valor do servidor `tls_version`. Por exemplo, um servidor que atua como replica pode ser configurado com `tls_version` definido como TLSv1.3 para permitir apenas conexões de entrada que utilizem TLSv1.3, mas também configurado com `SOURCE_TLS_VERSION` | `MASTER_TLS_VERSION` definido como TLSv1.2 para permitir apenas TLSv1.2 para conexões de replica saindo da fonte.

Para a Replicação em Grupo, as conexões de recuperação distribuída onde essa instância do servidor é o membro que está participando e inicia a recuperação distribuída (ou seja, o cliente), a variável de sistema `group_replication_recovery_tls_version` especifica quais protocolos são permitidos pelo cliente. Novamente, essa opção é independente e não afetada pelo valor do servidor `tls_version`, que se aplica quando essa instância do servidor é o doador. Um servidor de Replicação em Grupo geralmente participa da recuperação distribuída tanto como doador quanto como membro que está participando ao longo de sua participação no grupo, portanto, ambas as variáveis de sistema devem ser definidas. Veja a Seção 20.6.2, “Segurando Conexões de Comunicação em Grupo com Secure Socket Layer (SSL)”).

A configuração do protocolo TLS afeta o protocolo que uma conexão específica utiliza, conforme descrito na Negociação de Protocolo TLS de Conexão.

Os protocolos permitidos devem ser escolhidos para não deixar "buracos" na lista. Por exemplo, esses valores de configuração do servidor não têm buracos:

```
tls_version=TLSv1,TLSv1.1,TLSv1.2,TLSv1.3
tls_version=TLSv1.1,TLSv1.2,TLSv1.3
tls_version=TLSv1.2,TLSv1.3
tls_version=TLSv1.3
```

Esses valores têm buracos e não devem ser usados:

```
tls_version=TLSv1,TLSv1.2       (TLSv1.1 is missing)
tls_version=TLSv1.1,TLSv1.3     (TLSv1.2 is missing)
```

A proibição de buracos também se aplica em outros contextos de configuração, como para clientes ou réplicas.

A menos que você pretenda desabilitar conexões criptografadas, a lista de protocolos permitidos não deve estar vazia. Se você definir um parâmetro de versão TLS para a string vazia, conexões criptografadas não podem ser estabelecidas:

* `tls_version`: O servidor não permite conexões recebidas criptografadas.

* `--tls-version`: O cliente não permite conexões saídas criptografadas para o servidor.

* `SOURCE_TLS_VERSION` | `MASTER_TLS_VERSION`: A replica não permite conexões saídas criptografadas para a fonte.

* `group_replication_recovery_tls_version`: O membro que está se juntando não permite conexões criptografadas à conexão de recuperação distribuída.

#### Configuração do Cipher de Conexão

Um conjunto padrão de cifra é aplicado a conexões criptografadas, que pode ser sobrescrito ao configurar explicitamente as cifras permitidas. Durante o estabelecimento da conexão, ambos os lados de uma conexão devem permitir alguma cifra em comum ou a conexão falha. Das cifras permitidas comuns a ambos os lados, a biblioteca SSL escolhe a que é suportada pelo certificado fornecido que tem a maior prioridade.

Para especificar um ou mais cifra(s) aplicável(is) para conexões criptografadas que utilizam protocolos TLS até TLSv1.2:

* Defina a variável de sistema `ssl_cipher` no lado do servidor e use a opção `--ssl-cipher` para os programas do cliente.

* Para conexões de replicação de fonte/replica regulares, onde essa instância do servidor é a fonte, defina a variável de sistema `ssl_cipher`. Onde essa instância do servidor é a replica, use a opção `SOURCE_SSL_CIPHER` | `MASTER_SSL_CIPHER` para a declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou a declaração [`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (antes do MySQL 8.0.23). Veja a Seção 19.3.1, “Configurando a Replicação para Usar Conexões Encriptadas”.

* Para um membro do grupo de replicação de grupo, para conexões de comunicação de replicação de grupo e também para conexões de recuperação distribuída de replicação de grupo onde essa instância do servidor é o doador, defina a variável de sistema `ssl_cipher`. Para conexões de recuperação distribuída de replicação de grupo onde essa instância do servidor é o membro que se junta, use a variável de sistema `group_replication_recovery_ssl_cipher`. Veja a Seção 20.6.2, “Segurando Conexões de Comunicação de Grupo com Secure Socket Layer (SSL)”).

Para conexões criptografadas que utilizam TLSv1.3, o OpenSSL 1.1.1 e versões superiores suportam as seguintes suítes de cifras, das quais as três primeiras são ativadas por padrão:

```
TLS_AES_128_GCM_SHA256
TLS_AES_256_GCM_SHA384
TLS_CHACHA20_POLY1305_SHA256
TLS_AES_128_CCM_SHA256
```

Nota

Antes do MySQL 8.0.35, o `TLS_AES_128_CCM_8_SHA256` era suportado para uso com as variáveis do sistema do servidor `--tls-ciphersuites` ou `--admin-tls-ciphersuites`. `TLS_AES_128_CCM_8_SHA256` gera um aviso de depreciação se configurado para MySQL 8.0.35 e versões posteriores.

Para configurar as suíte de cifras TLSv1.3 permitidas explicitamente, defina os seguintes parâmetros. Em cada caso, o valor de configuração é uma lista de zero ou mais nomes de suíte de cifras separados por colon.

* No lado do servidor, use a variável de sistema `tls_ciphersuites`. Se essa variável não for definida, seu valor padrão é `NULL`, o que significa que o servidor permite o conjunto padrão de suítes de cifra. Se a variável for definida como uma string vazia, nenhuma suítes de cifra será habilitada e conexões criptografadas não poderão ser estabelecidas.

* Do lado do cliente, use a opção `--tls-ciphersuites`. Se esta opção não for definida, o cliente permite o conjunto padrão de suítes de cifra. Se a opção for definida como uma string vazia, nenhuma suítes de cifra é habilitada e conexões criptografadas não podem ser estabelecidas.

* Para conexões de replicação de fonte/replica regulares, onde essa instância do servidor é a fonte, use a variável de sistema `tls_ciphersuites`. Onde essa instância do servidor é a replica, use a opção `SOURCE_TLS_CIPHERSUITES` | `MASTER_TLS_CIPHERSUITES` para a declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou a declaração [`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (antes do MySQL 8.0.23). Veja a Seção 19.3.1, “Configurando a Replicação para Usar Conexões Encriptadas”.

* Para um membro do grupo de replicação de grupo, para conexões de comunicação de replicação de grupo e também para conexões de recuperação distribuída de replicação de grupo onde essa instância do servidor é o doador, use a variável de sistema `tls_ciphersuites`. Para conexões de recuperação distribuída de replicação de grupo onde essa instância do servidor é o membro que se junta, use a variável de sistema `group_replication_recovery_tls_ciphersuites`. Veja a Seção 20.6.2, “Segurando Conexões de Comunicação de Grupo com Secure Socket Layer (SSL)”).

Nota

O suporte do Ciphersuite está disponível a partir do MySQL 8.0.16, mas exige que o servidor MySQL e o aplicativo cliente sejam compilados usando OpenSSL 1.1.1 ou superior.

Nos releases MySQL 8.0.16 a 8.0.18, a variável de sistema `group_replication_recovery_tls_ciphersuites` e a opção `SOURCE_TLS_CIPHERSUITES` | `MASTER_TLS_CIPHERSUITES` para a declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou a declaração [`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (antes do MySQL 8.0.23) não estão disponíveis. Nesses releases, se TLSv1.3 for usado para conexões de replicação de origem/replica, ou na Replicação em Grupo para recuperação distribuída (suportada a partir do MySQL 8.0.18), os servidores de origem da replicação ou servidores doador da Replicação em Grupo devem permitir o uso de pelo menos um conjunto de criptografia TLSv1.3 que é habilitado por padrão. A partir do MySQL 8.0.19, você pode usar as opções para configurar o suporte ao cliente para qualquer seleção de conjuntos de criptografia, incluindo apenas conjuntos de criptografia não padrão, se desejar.

Um cifrador específico pode funcionar apenas com certos protocolos TLS, o que afeta o processo de negociação de protocolo TLS. Veja Negociação de protocolo TLS de conexão.

Para determinar quais cifras um servidor específico suporta, verifique o valor da sessão da variável de status `Ssl_cipher_list`:

```
SHOW SESSION STATUS LIKE 'Ssl_cipher_list';
```

A variável de status `Ssl_cipher_list` lista os possíveis cifradores SSL (vazio para conexões não SSL). Se o MySQL suportar TLSv1.3, o valor inclui as possíveis suítes de ciframento TLSv1.3.

Nota

Os cifradores ECDSA só funcionam em combinação com um certificado SSL que utiliza ECDSA para a assinatura digital, e não funcionam com certificados que utilizam RSA. O processo de geração automática do MySQL Server para certificados SSL não gera certificados assinados com ECDSA, ele gera apenas certificados assinados com RSA. Não selecione cifradores ECDSA a menos que você tenha um certificado ECDSA disponível.

Para conexões criptografadas que utilizam TLS.v1.3, o MySQL usa a lista de cifras padrão da biblioteca SSL.

Para conexões criptografadas que utilizam protocolos TLS até o TLSv1.2, o MySQL passa a seguinte lista de cifra padrão para a biblioteca SSL.

```
ECDHE-ECDSA-AES128-GCM-SHA256
ECDHE-ECDSA-AES256-GCM-SHA384
ECDHE-RSA-AES128-GCM-SHA256
ECDHE-RSA-AES256-GCM-SHA384
ECDHE-ECDSA-CHACHA20-POLY1305
ECDHE-RSA-CHACHA20-POLY1305
ECDHE-ECDSA-AES256-CCM
ECDHE-ECDSA-AES128-CCM
DHE-RSA-AES128-GCM-SHA256
DHE-RSA-AES256-GCM-SHA384
DHE-RSA-AES256-CCM
DHE-RSA-AES128-CCM
DHE-RSA-CHACHA20-POLY1305
```

Essas restrições de criptografia estão em vigor:

* a partir do MySQL 8.0.35, os seguintes cifradores são desaconselhados e produzem uma mensagem de alerta quando usados com as variáveis do sistema do servidor `--ssl-cipher` e `--admin-ssl-cipher`:

  ```
  ECDHE-ECDSA-AES128-SHA256
  ECDHE-RSA-AES128-SHA256
  ECDHE-ECDSA-AES256-SHA384
  ECDHE-RSA-AES256-SHA384
  DHE-DSS-AES128-GCM-SHA256
  DHE-RSA-AES128-SHA256
  DHE-DSS-AES128-SHA256
  DHE-DSS-AES256-GCM-SHA384
  DHE-RSA-AES256-SHA256
  DHE-DSS-AES256-SHA256
  ECDHE-RSA-AES128-SHA
  ECDHE-ECDSA-AES128-SHA
  ECDHE-RSA-AES256-SHA
  ECDHE-ECDSA-AES256-SHA
  DHE-DSS-AES128-SHA
  DHE-RSA-AES128-SHA
  TLS_DHE_DSS_WITH_AES_256_CBC_SHA
  DHE-RSA-AES256-SHA
  AES128-GCM-SHA256
  DH-DSS-AES128-GCM-SHA256
  ECDH-ECDSA-AES128-GCM-SHA256
  AES256-GCM-SHA384
  DH-DSS-AES256-GCM-SHA384
  ECDH-ECDSA-AES256-GCM-SHA384
  AES128-SHA256
  DH-DSS-AES128-SHA256
  ECDH-ECDSA-AES128-SHA256
  AES256-SHA256
  DH-DSS-AES256-SHA256
  ECDH-ECDSA-AES256-SHA384
  AES128-SHA
  DH-DSS-AES128-SHA
  ECDH-ECDSA-AES128-SHA
  AES256-SHA
  DH-DSS-AES256-SHA
  ECDH-ECDSA-AES256-SHA
  DH-RSA-AES128-GCM-SHA256
  ECDH-RSA-AES128-GCM-SHA256
  DH-RSA-AES256-GCM-SHA384
  ECDH-RSA-AES256-GCM-SHA384
  DH-RSA-AES128-SHA256
  ECDH-RSA-AES128-SHA256
  DH-RSA-AES256-SHA256
  ECDH-RSA-AES256-SHA384
  ECDHE-RSA-AES128-SHA
  ECDHE-ECDSA-AES128-SHA
  ECDHE-RSA-AES256-SHA
  ECDHE-ECDSA-AES256-SHA
  DHE-DSS-AES128-SHA
  DHE-RSA-AES128-SHA
  TLS_DHE_DSS_WITH_AES_256_CBC_SHA
  DHE-RSA-AES256-SHA
  AES128-SHA
  DH-DSS-AES128-SHA
  ECDH-ECDSA-AES128-SHA
  AES256-SHA
  DH-DSS-AES256-SHA
  ECDH-ECDSA-AES256-SHA
  DH-RSA-AES128-SHA
  ECDH-RSA-AES128-SHA
  DH-RSA-AES256-SHA
  ECDH-RSA-AES256-SHA
  DES-CBC3-SHA
  ```

* Os seguintes cifrados são permanentemente restritos:

  ```
  !DHE-DSS-DES-CBC3-SHA
  !DHE-RSA-DES-CBC3-SHA
  !ECDH-RSA-DES-CBC3-SHA
  !ECDH-ECDSA-DES-CBC3-SHA
  !ECDHE-RSA-DES-CBC3-SHA
  !ECDHE-ECDSA-DES-CBC3-SHA
  ```

* As seguintes categorias de cifra são permanentemente restritas:

  ```
  !aNULL
  !eNULL
  !EXPORT
  !LOW
  !MD5
  !DES
  !RC2
  !RC4
  !PSK
  !SSLv3
  ```

Se o servidor for iniciado com a variável de sistema `ssl_cert` definida para um certificado que utiliza qualquer um dos cifrados ou categorias de cifrado restritos anteriores, o servidor inicia com o suporte para conexões criptografadas desativado.

#### Negociação do Protocolo TLS de Conexão

As tentativas de conexão no MySQL negociam o uso da versão mais alta do protocolo TLS disponível em ambos os lados, para a qual um algoritmo de criptografia compatível com o protocolo esteja disponível em ambos os lados. O processo de negociação depende de fatores como a biblioteca SSL usada para compilar o servidor e o cliente, a configuração do protocolo e do algoritmo de criptografia TLS, e o tamanho da chave usado:

* Para que a tentativa de conexão seja bem-sucedida, a configuração do protocolo TLS do servidor e do cliente deve permitir algum protocolo em comum.

* Da mesma forma, a configuração do cifrador de criptografia do servidor e do cliente deve permitir algum cifrador comum. Um cifrador dado pode funcionar apenas com protocolos TLS específicos, portanto, um protocolo disponível para o processo de negociação não é escolhido a menos que também haja um cifrador compatível.

* Se o TLSv1.3 estiver disponível, ele é usado, se possível. (Isso significa que tanto a configuração do servidor quanto a do cliente devem permitir o TLSv1.3, e ambos também devem permitir algum cifrado compatível com o TLSv1.3.) Caso contrário, o MySQL continua na lista de protocolos disponíveis, usando TLSv1.2, se possível, e assim por diante. A negociação prossegue de protocolos mais seguros para menos seguros. A ordem da negociação é independente da ordem em que os protocolos são configurados. Por exemplo, a ordem da negociação é a mesma, independentemente de `tls_version` ter um valor de `TLSv1,TLSv1.1,TLSv1.2,TLSv1.3` ou `TLSv1.3,TLSv1.2,TLSv1.1,TLSv1`.

* O TLSv1.2 não funciona com todos os cifradores que têm um tamanho de chave de 512 bits ou menos. Para usar este protocolo com uma chave desse tipo, defina a variável de sistema `ssl_cipher` no lado do servidor ou use a opção `--ssl-cipher` do cliente para especificar explicitamente o nome do cifrador:

  ```
  AES128-SHA
  AES128-SHA256
  AES256-SHA
  AES256-SHA256
  CAMELLIA128-SHA
  CAMELLIA256-SHA
  DES-CBC3-SHA
  DHE-RSA-AES256-SHA
  RC4-MD5
  RC4-SHA
  SEED-SHA
  ```

* Para uma melhor segurança, use um certificado com um tamanho de chave RSA de pelo menos 2048 bits.

Se o servidor e o cliente não tiverem um protocolo permitido em comum e um cifrador compatível com o protocolo em comum, o servidor termina a solicitação de conexão. Exemplos:

* Se o servidor estiver configurado com `tls_version=TLSv1.1,TLSv1.2`:

+ As tentativas de conexão falham para clientes invocados com `--tls-version=TLSv1`, e para clientes mais antigos que suportam apenas TLSv1.

+ Da mesma forma, as tentativas de conexão falham para réplicas configuradas com `MASTER_TLS_VERSION = 'TLSv1'`, e para réplicas mais antigas que suportam apenas TLSv1.

* Se o servidor estiver configurado com `tls_version=TLSv1` ou for um servidor mais antigo que suporte apenas TLSv1:

+ As tentativas de conexão falham para clientes invocados com `--tls-version=TLSv1.1,TLSv1.2`.

+ Da mesma forma, as tentativas de conexão falham para réplicas configuradas com `MASTER_TLS_VERSION = 'TLSv1.1,TLSv1.2'`.

O MySQL permite especificar uma lista de protocolos a serem suportados. Essa lista é passada diretamente para a biblioteca SSL subjacente e, em última análise, cabe a essa biblioteca quais protocolos ela realmente permite da lista fornecida. Consulte o código-fonte do MySQL e a documentação do OpenSSL `SSL_CTX_new()` (https://www.openssl.org/docs/man1.1.0/ssl/SSL_CTX_new.html) para obter informações sobre como a biblioteca SSL lida com isso.

#### Monitoramento do Protocolo TLS e Cipher da Sessão Atual do Cliente

Para determinar qual protocolo de criptografia TLS e qual cifra a sessão atual do cliente utiliza, verifique os valores da sessão das variáveis de status `Ssl_version` e `Ssl_cipher`:

```
mysql> SELECT * FROM performance_schema.session_status
       WHERE VARIABLE_NAME IN ('Ssl_version','Ssl_cipher');
+---------------+---------------------------+
| VARIABLE_NAME | VARIABLE_VALUE            |
+---------------+---------------------------+
| Ssl_cipher    | DHE-RSA-AES128-GCM-SHA256 |
| Ssl_version   | TLSv1.2                   |
+---------------+---------------------------+
```

Se a conexão não estiver criptografada, ambas as variáveis terão um valor vazio.

### 8.3.3 Criando certificados e chaves SSL e RSA

A discussão a seguir descreve como criar os arquivos necessários para o suporte SSL e RSA no MySQL. A criação de arquivos pode ser realizada usando as facilidades fornecidas pelo próprio MySQL, ou invocando o comando **openssl** diretamente.

Os certificados SSL e os arquivos de chave permitem que o MySQL suporte conexões criptografadas usando SSL. Veja a Seção 8.3.1, “Configurando o MySQL para usar conexões criptografadas”.

Os arquivos de chave RSA permitem que o MySQL suporte a troca segura de senhas em conexões não criptografadas para contas autenticadas pelo plugin `sha256_password` ou `caching_sha2_password`. Veja a Seção 8.4.1.3, “Autenticação Plugável SHA-256”, e a Seção 8.4.1.2, “Cacheamento da Autenticação Plugável SHA-2”.

#### 8.3.3.1 Criando certificados e chaves SSL e RSA usando MySQL

O MySQL oferece essas maneiras de criar os arquivos de certificado SSL e chave e os arquivos de par de chave RSA necessários para suportar conexões criptografadas usando SSL e troca segura de senhas usando RSA em conexões não criptografadas, se esses arquivos estiverem faltando:

* O servidor pode gerar automaticamente esses arquivos na inicialização, para as distribuições do MySQL.

* Os usuários podem invocar o utilitário **mysql_ssl_rsa_setup** manualmente (descontinuado a partir do MySQL 8.0.34).

* Para alguns tipos de distribuição, como pacotes RPM e DEB, a invocação de **mysql_ssl_rsa_setup** ocorre durante a inicialização do diretório de dados. Nesse caso, a distribuição do MySQL não precisa ter sido compilada com OpenSSL, desde que o comando **openssl** esteja disponível.

Importante

A autogeração do servidor e o **mysql_ssl_rsa_setup** ajudam a reduzir a barreira para o uso do SSL, facilitando a geração dos arquivos necessários. No entanto, os certificados gerados por esses métodos são autoassinados, o que pode não ser muito seguro. Após ganhar experiência usando esses arquivos, considere obter material de certificado/chave de uma autoridade de certificado registrada.

Importante

Se um cliente que se conecta a uma instância do servidor MySQL usar um certificado SSL com a extensão `extendedKeyUsage` (uma extensão X.509 v3), o uso de chave estendida deve incluir autenticação de cliente (`clientAuth`). Se o certificado SSL for especificado apenas para autenticação do servidor (`serverAuth`) e para outros propósitos que não sejam certificados de cliente, a verificação do certificado falha e a conexão do cliente com a instância do servidor MySQL falha. Não há extensão `extendedKeyUsage` em certificados SSL gerados pelo MySQL Server. Se você usar seu próprio certificado de cliente criado de outra maneira, certifique-se de que qualquer extensão `extendedKeyUsage` inclua autenticação de cliente.

* Geração automática de arquivos SSL e RSA * Geração manual de arquivos SSL e RSA usando mysql_ssl_rsa_setup * Características dos arquivos SSL e RSA

##### Geração automática de arquivos SSL e RSA

Para as distribuições do MySQL compiladas usando OpenSSL, o servidor MySQL tem a capacidade de gerar automaticamente os arquivos SSL e RSA ausentes no início. As variáveis de sistema `auto_generate_certs`, `sha256_password_auto_generate_rsa_keys` e `caching_sha2_password_auto_generate_rsa_keys` controlam a geração automática desses arquivos. Essas variáveis são ativadas por padrão. Elas podem ser ativadas no início e inspecionadas, mas não podem ser definidas no tempo de execução.

Ao iniciar, o servidor gera automaticamente os arquivos de certificado e chave SSL do lado do servidor e do lado do cliente no diretório de dados se a variável de sistema `auto_generate_certs` estiver habilitada, não são especificadas outras opções SSL além de `--ssl`, e os arquivos SSL do lado do servidor estão ausentes do diretório de dados. Esses arquivos permitem conexões criptografadas do cliente usando SSL; veja Seção 8.3.1, “Configurando o MySQL para usar conexões criptografadas”.

1. O servidor verifica o diretório de dados em busca de arquivos SSL com os seguintes nomes:

   ```
   ca.pem
   server-cert.pem
   server-key.pem
   ```

2. Se algum desses arquivos estiver presente, o servidor não cria arquivos SSL. Caso contrário, ele os cria, além de alguns arquivos adicionais:

   ```
   ca.pem               Self-signed CA certificate
   ca-key.pem           CA private key
   server-cert.pem      Server certificate
   server-key.pem       Server private key
   client-cert.pem      Client certificate
   client-key.pem       Client private key
   ```

3. Se o servidor gerar automaticamente os arquivos SSL, ele usa os nomes dos arquivos `ca.pem`, `server-cert.pem` e `server-key.pem` para definir as variáveis do sistema correspondentes (`ssl_ca`, `ssl_cert`, `ssl_key`).

Ao inicializar, o servidor gera automaticamente arquivos de par de chave privada/pública RSA no diretório de dados se todas essas condições forem verdadeiras: A variável de sistema `sha256_password_auto_generate_rsa_keys` ou `caching_sha2_password_auto_generate_rsa_keys` estiver habilitada; não houver opções RSA especificadas; os arquivos RSA estiverem ausentes do diretório de dados. Esses arquivos de par de chave permitem a troca segura de senhas usando RSA em conexões não criptografadas para contas autenticadas pelo plugin `sha256_password` ou `caching_sha2_password`; consulte Seção 8.4.1.3, “Autenticação Conectada por SHA-256”, e Seção 8.4.1.2, “Cacheamento da Autenticação Conectada por SHA-2”.

1. O servidor verifica o diretório de dados em busca de arquivos RSA com os seguintes nomes:

   ```
   private_key.pem      Private member of private/public key pair
   public_key.pem       Public member of private/public key pair
   ```

2. Se algum desses arquivos estiver presente, o servidor não cria arquivos RSA. Caso contrário, ele os cria.

3. Se o servidor gerar automaticamente os arquivos RSA, ele usa seus nomes para definir as variáveis do sistema correspondentes (`sha256_password_private_key_path` e `sha256_password_public_key_path`; `caching_sha2_password_private_key_path` e `caching_sha2_password_public_key_path`).

##### Gerando arquivos SSL e RSA manualmente usando mysql_ssl_rsa_setup

As distribuições do MySQL incluem um utilitário **mysql_ssl_rsa_setup** (descontinuado a partir do MySQL 8.0.34) que pode ser invocado manualmente para gerar arquivos SSL e RSA. Este utilitário está incluído em todas as distribuições do MySQL, mas ele exige que o comando **openssl** esteja disponível. Para instruções de uso, consulte a Seção 6.4.3, “mysql_ssl_rsa_setup — Crie arquivos SSL/RSA”.

##### Características dos arquivos SSL e RSA

Os arquivos SSL e RSA criados automaticamente pelo servidor ou ao invocar **mysql_ssl_rsa_setup** têm essas características:

* O SSL e o RSA têm um tamanho de 2048 bits.
* O certificado da CA SSL é autoassinado.
* Os certificados do servidor e do cliente SSL são assinados com o certificado e a chave da CA, usando o algoritmo de assinatura `sha256WithRSAEncryption`.

* Os certificados SSL utilizam esses valores de Nome Comum (CN), com o tipo de certificado apropriado (CA, Servidor, Cliente):

  ```
  ca.pem:         MySQL_Server_suffix_Auto_Generated_CA_Certificate
  server-cert.pm: MySQL_Server_suffix_Auto_Generated_Server_Certificate
  client-cert.pm: MySQL_Server_suffix_Auto_Generated_Client_Certificate
  ```

O valor *`suffix`* é baseado no número da versão do MySQL. Para arquivos gerados pelo **mysql_ssl_rsa_setup**, o sufixo pode ser especificado explicitamente usando a opção `--suffix`.

Para arquivos gerados pelo servidor, se os valores CN resultantes excederem 64 caracteres, a parte `_suffix` do nome é omitida.

* Os arquivos SSL têm valores em branco para País (C), Estado ou Província (ST), Organização (O), Nome da Unidade da Organização (OU) e endereço de e-mail.

* Os arquivos SSL criados pelo servidor ou pelo **mysql_ssl_rsa_setup** são válidos por dez anos a partir do momento da geração.

* Os arquivos RSA não expiram. * Os arquivos SSL têm números de série diferentes para cada par de certificado/chave (1 para CA, 2 para servidor, 3 para cliente).

* Arquivos criados automaticamente pelo servidor pertencem à conta que executa o servidor. Arquivos criados usando **mysql_ssl_rsa_setup** pertencem ao usuário que invocou esse programa. Isso pode ser alterado em sistemas que suportam a chamada de sistema `chown()` se o programa for invocado por `root` e a opção `--uid` for dada para especificar o usuário que deve possuir os arquivos.

* Em sistemas Unix e Unix-like, o modo de acesso ao arquivo é 644 para arquivos de certificado (ou seja, legíveis por qualquer pessoa) e 600 para arquivos de chave (ou seja, acessíveis apenas pela conta que executa o servidor).

Para ver o conteúdo de um certificado SSL (por exemplo, para verificar a faixa de datas em que ele é válido), invoque o **openssl** diretamente:

```
openssl x509 -text -in ca.pem
openssl x509 -text -in server-cert.pem
openssl x509 -text -in client-cert.pem
```

É também possível verificar as informações de expiração do certificado SSL usando esta declaração SQL:

```
mysql> SHOW STATUS LIKE 'Ssl_server_not%';
+-----------------------+--------------------------+
| Variable_name         | Value                    |
+-----------------------+--------------------------+
| Ssl_server_not_after  | Apr 28 14:16:39 2027 GMT |
| Ssl_server_not_before | May  1 14:16:39 2017 GMT |
+-----------------------+--------------------------+
```

#### 8.3.3.2 Criando certificados SSL e chaves usando o openssl

Esta seção descreve como usar o comando **openssl** para configurar certificados SSL e arquivos de chave para uso por servidores e clientes MySQL. O primeiro exemplo mostra um procedimento simplificado, como você pode usar a partir da linha de comando. O segundo exemplo mostra um script que contém mais detalhes. Os dois primeiros exemplos são destinados ao uso em Unix e ambos usam o comando **openssl** que faz parte do OpenSSL. O terceiro exemplo descreve como configurar arquivos SSL no Windows.

Nota

Existem alternativas mais fáceis para gerar os arquivos necessários para SSL do que o procedimento descrito aqui: deixe o servidor gerar automaticamente ou use o programa **mysql_ssl_rsa_setup** (desatualizado a partir da versão 8.0.34). Veja a Seção 8.3.3.1, “Criando Certificados e Chaves SSL e RSA usando MySQL”.

Importante

Qualquer método que você use para gerar os arquivos de certificado e chave, o valor do Nome Comum usado para os certificados/chaves do servidor e do cliente deve ser diferente do valor do Nome Comum usado para o certificado da CA. Caso contrário, os arquivos de certificado e chave não funcionarão para servidores compilados usando OpenSSL. Um erro típico nesse caso é:

```
ERROR 2026 (HY000): SSL connection error:
error:00000001:lib(0):func(0):reason(1)
```

Importante

Se um cliente que se conecta a uma instância do servidor MySQL usar um certificado SSL com a extensão `extendedKeyUsage` (uma extensão X.509 v3), o uso de chave estendido deve incluir autenticação de cliente (`clientAuth`). Se o certificado SSL for especificado apenas para autenticação do servidor (`serverAuth`) e para outros fins que não sejam certificados de cliente, a verificação do certificado falha e a conexão do cliente com a instância do servidor MySQL falha. Não há extensão `extendedKeyUsage` em certificados SSL criados usando o comando **openssl** seguindo as instruções neste tópico. Se você usar seu próprio certificado de cliente criado de outra maneira, certifique-se de que qualquer extensão `extendedKeyUsage` inclua autenticação de cliente.

* Exemplo 1: Criação de arquivos SSL a partir da linha de comando no Unix
* Exemplo 2: Criação de arquivos SSL usando um script no Unix
* Exemplo 3: Criação de arquivos SSL no Windows

##### Exemplo 1: Criação de arquivos SSL a partir da linha de comando no Unix

O exemplo a seguir mostra um conjunto de comandos para criar arquivos de certificado e chave do servidor MySQL e do cliente. Você deve responder a várias solicitações pelos comandos **openssl**. Para gerar arquivos de teste, você pode pressionar Enter em todas as solicitações. Para gerar arquivos para uso em produção, você deve fornecer respostas não vazias.

```
# Create clean environment
rm -rf newcerts
mkdir newcerts && cd newcerts

# Create CA certificate
openssl genrsa 2048 > ca-key.pem
openssl req -new -x509 -nodes -days 3600 \
        -key ca-key.pem -out ca.pem

# Create server certificate, remove passphrase, and sign it
# server-cert.pem = public key, server-key.pem = private key
openssl req -newkey rsa:2048 -days 3600 \
        -nodes -keyout server-key.pem -out server-req.pem
openssl rsa -in server-key.pem -out server-key.pem
openssl x509 -req -in server-req.pem -days 3600 \
        -CA ca.pem -CAkey ca-key.pem -set_serial 01 -out server-cert.pem

# Create client certificate, remove passphrase, and sign it
# client-cert.pem = public key, client-key.pem = private key
openssl req -newkey rsa:2048 -days 3600 \
        -nodes -keyout client-key.pem -out client-req.pem
openssl rsa -in client-key.pem -out client-key.pem
openssl x509 -req -in client-req.pem -days 3600 \
        -CA ca.pem -CAkey ca-key.pem -set_serial 01 -out client-cert.pem
```

Após gerar os certificados, verifique-os:

```
openssl verify -CAfile ca.pem server-cert.pem client-cert.pem
```

Você deve ver uma resposta como esta:

```
server-cert.pem: OK
client-cert.pem: OK
```

Para ver o conteúdo de um certificado (por exemplo, para verificar a faixa de datas sobre a qual um certificado é válido), invoque o **openssl** da seguinte forma:

```
openssl x509 -text -in ca.pem
openssl x509 -text -in server-cert.pem
openssl x509 -text -in client-cert.pem
```

Agora você tem um conjunto de arquivos que podem ser usados da seguinte forma:

* `ca.pem`: Use isso para definir a variável de sistema `ssl_ca` no lado do servidor e a opção `--ssl-ca` no lado do cliente. (O certificado CA, se usado, deve ser o mesmo em ambos os lados.)

* `server-cert.pem`, `server-key.pem`: Use esses para definir as variáveis de sistema `ssl_cert` e `ssl_key` no lado do servidor.

* `client-cert.pem`, `client-key.pem`: Use esses como argumentos para as opções `--ssl-cert` e `--ssl-key` no lado do cliente.

Para obter instruções adicionais de uso, consulte a Seção 8.3.1, “Configurando o MySQL para usar conexões criptografadas”.

##### Exemplo 2: Criação de arquivos SSL usando um script no Unix

Aqui está um exemplo de script que mostra como configurar certificados SSL e arquivos de chave para o MySQL. Após executar o script, use os arquivos para conexões SSL conforme descrito na Seção 8.3.1, “Configurando o MySQL para usar conexões criptografadas”.

```
DIR=`pwd`/openssl
PRIV=$DIR/private

mkdir $DIR $PRIV $DIR/newcerts
cp /usr/share/ssl/openssl.cnf $DIR
replace ./demoCA $DIR -- $DIR/openssl.cnf

# Create necessary files: $database, $serial and $new_certs_dir
# directory (optional)

touch $DIR/index.txt
echo "01" > $DIR/serial

#
# Generation of Certificate Authority(CA)
#

openssl req -new -x509 -keyout $PRIV/cakey.pem -out $DIR/ca.pem \
    -days 3600 -config $DIR/openssl.cnf

# Sample output:
# Using configuration from /home/jones/openssl/openssl.cnf
# Generating a 1024 bit RSA private key
# ................++++++
# .........++++++
# writing new private key to '/home/jones/openssl/private/cakey.pem'
# Enter PEM pass phrase:
# Verifying password - Enter PEM pass phrase:
# -----
# You are about to be asked to enter information to be
# incorporated into your certificate request.
# What you are about to enter is what is called a Distinguished Name
# or a DN.
# There are quite a few fields but you can leave some blank
# For some fields there will be a default value,
# If you enter '.', the field will be left blank.
# -----
# Country Name (2 letter code) [AU]:FI
# State or Province Name (full name) [Some-State]:.
# Locality Name (eg, city) []:
# Organization Name (eg, company) [Internet Widgits Pty Ltd]:MySQL AB
# Organizational Unit Name (eg, section) []:
# Common Name (eg, YOUR name) []:MySQL admin
# Email Address []:

#
# Create server request and key
#
openssl req -new -keyout $DIR/server-key.pem -out \
    $DIR/server-req.pem -days 3600 -config $DIR/openssl.cnf

# Sample output:
# Using configuration from /home/jones/openssl/openssl.cnf
# Generating a 1024 bit RSA private key
# ..++++++
# ..........++++++
# writing new private key to '/home/jones/openssl/server-key.pem'
# Enter PEM pass phrase:
# Verifying password - Enter PEM pass phrase:
# -----
# You are about to be asked to enter information that will be
# incorporated into your certificate request.
# What you are about to enter is what is called a Distinguished Name
# or a DN.
# There are quite a few fields but you can leave some blank
# For some fields there will be a default value,
# If you enter '.', the field will be left blank.
# -----
# Country Name (2 letter code) [AU]:FI
# State or Province Name (full name) [Some-State]:.
# Locality Name (eg, city) []:
# Organization Name (eg, company) [Internet Widgits Pty Ltd]:MySQL AB
# Organizational Unit Name (eg, section) []:
# Common Name (eg, YOUR name) []:MySQL server
# Email Address []:
#
# Please enter the following 'extra' attributes
# to be sent with your certificate request
# A challenge password []:
# An optional company name []:

#
# Remove the passphrase from the key
#
openssl rsa -in $DIR/server-key.pem -out $DIR/server-key.pem

#
# Sign server cert
#
openssl ca -cert $DIR/ca.pem -policy policy_anything \
    -out $DIR/server-cert.pem -config $DIR/openssl.cnf \
    -infiles $DIR/server-req.pem

# Sample output:
# Using configuration from /home/jones/openssl/openssl.cnf
# Enter PEM pass phrase:
# Check that the request matches the signature
# Signature ok
# The Subjects Distinguished Name is as follows
# countryName           :PRINTABLE:'FI'
# organizationName      :PRINTABLE:'MySQL AB'
# commonName            :PRINTABLE:'MySQL admin'
# Certificate is to be certified until Sep 13 14:22:46 2003 GMT
# (365 days)
# Sign the certificate? [y/n]:y
#
#
# 1 out of 1 certificate requests certified, commit? [y/n]y
# Write out database with 1 new entries
# Data Base Updated

#
# Create client request and key
#
openssl req -new -keyout $DIR/client-key.pem -out \
    $DIR/client-req.pem -days 3600 -config $DIR/openssl.cnf

# Sample output:
# Using configuration from /home/jones/openssl/openssl.cnf
# Generating a 1024 bit RSA private key
# .....................................++++++
# .............................................++++++
# writing new private key to '/home/jones/openssl/client-key.pem'
# Enter PEM pass phrase:
# Verifying password - Enter PEM pass phrase:
# -----
# You are about to be asked to enter information that will be
# incorporated into your certificate request.
# What you are about to enter is what is called a Distinguished Name
# or a DN.
# There are quite a few fields but you can leave some blank
# For some fields there will be a default value,
# If you enter '.', the field will be left blank.
# -----
# Country Name (2 letter code) [AU]:FI
# State or Province Name (full name) [Some-State]:.
# Locality Name (eg, city) []:
# Organization Name (eg, company) [Internet Widgits Pty Ltd]:MySQL AB
# Organizational Unit Name (eg, section) []:
# Common Name (eg, YOUR name) []:MySQL user
# Email Address []:
#
# Please enter the following 'extra' attributes
# to be sent with your certificate request
# A challenge password []:
# An optional company name []:

#
# Remove the passphrase from the key
#
openssl rsa -in $DIR/client-key.pem -out $DIR/client-key.pem

#
# Sign client cert
#

openssl ca -cert $DIR/ca.pem -policy policy_anything \
    -out $DIR/client-cert.pem -config $DIR/openssl.cnf \
    -infiles $DIR/client-req.pem

# Sample output:
# Using configuration from /home/jones/openssl/openssl.cnf
# Enter PEM pass phrase:
# Check that the request matches the signature
# Signature ok
# The Subjects Distinguished Name is as follows
# countryName           :PRINTABLE:'FI'
# organizationName      :PRINTABLE:'MySQL AB'
# commonName            :PRINTABLE:'MySQL user'
# Certificate is to be certified until Sep 13 16:45:17 2003 GMT
# (365 days)
# Sign the certificate? [y/n]:y
#
#
# 1 out of 1 certificate requests certified, commit? [y/n]y
# Write out database with 1 new entries
# Data Base Updated

#
# Create a my.cnf file that you can use to test the certificates
#

cat <<EOF > $DIR/my.cnf
[client]
ssl-ca=$DIR/ca.pem
ssl-cert=$DIR/client-cert.pem
ssl-key=$DIR/client-key.pem
[mysqld]
ssl_ca=$DIR/ca.pem
ssl_cert=$DIR/server-cert.pem
ssl_key=$DIR/server-key.pem
EOF
```

##### Exemplo 3: Criação de arquivos SSL no Windows

Baixe o OpenSSL para Windows se ele não estiver instalado no seu sistema. Uma visão geral dos pacotes disponíveis pode ser vista aqui:

```
http://www.slproweb.com/products/Win32OpenSSL.html
```

Escolha o pacote Win32 OpenSSL Light ou Win64 OpenSSL Light, dependendo da sua arquitetura (32 bits ou 64 bits). O local de instalação padrão é `C:\OpenSSL-Win32` ou `C:\OpenSSL-Win64`, dependendo do pacote que você baixou. As instruções seguintes assumem um local padrão de `C:\OpenSSL-Win32`. Modifique conforme necessário se você estiver usando o pacote de 64 bits.

Se uma mensagem ocorrer durante a configuração e indicar `'...critical component is missing: Microsoft Visual C++ 2019 Redistributables'`, cancele a configuração e faça o download de um dos seguintes pacotes, novamente, dependendo da sua arquitetura (32 bits ou 64 bits):

* Redistribuíveis Visual C++ 2008 (x86), disponíveis em:

  ```
  http://www.microsoft.com/downloads/details.aspx?familyid=9B2DA534-3E03-4391-8A4D-074B9F2BC1BF
  ```

* Redistribuíveis Visual C++ 2008 (x64), disponíveis em:

  ```
  http://www.microsoft.com/downloads/details.aspx?familyid=bd2a6171-e2d6-4230-b809-9a8d7548c1b6
  ```

Após instalar o pacote adicional, reinicie o procedimento de configuração do OpenSSL.

Durante a instalação, deixe o caminho de instalação padrão `C:\OpenSSL-Win32` como padrão e também deixe a opção padrão `'Copy OpenSSL DLL files to the Windows system directory'` selecionada.

Quando a instalação estiver concluída, adicione `C:\OpenSSL-Win32\bin` à variável do caminho do sistema do Windows do seu servidor (dependendo da versão do Windows, as instruções de configuração do caminho podem variar ligeiramente):

1. No desktop do Windows, clique com o botão direito no ícone Meu Computador e selecione Propriedades.

2. Selecione a guia Avançado do menu Propriedades do sistema que aparece e clique no botão Variáveis de ambiente.

3. Em Variáveis do sistema, selecione Caminho e, em seguida, clique no botão Editar. O diálogo Editar variável do sistema deve aparecer.

4. Adicione `';C:\OpenSSL-Win32\bin'` ao final (observe o ponto e vírgula).

5. Pressione OK 3 vezes.
6. Verifique se o OpenSSL foi corretamente integrado na variável Path abrindo uma nova console de comando (**Início>Executar>cmd.exe**) e verificando se o OpenSSL está disponível:

   ```
   Microsoft Windows [Version ...]
   Copyright (c) 2006 Microsoft Corporation. All rights reserved.

   C:\Windows\system32>cd \

   C:\>openssl
   OpenSSL> exit <<< If you see the OpenSSL prompt, installation was successful.

   C:\>
   ```

Depois que o OpenSSL tiver sido instalado, use instruções semelhantes às do Exemplo 1 (mostrado anteriormente nesta seção), com as seguintes alterações:

* Altere os seguintes comandos Unix:

  ```
  # Create clean environment
  rm -rf newcerts
  mkdir newcerts && cd newcerts
  ```

Em Windows, use esses comandos em vez disso:

  ```
  # Create clean environment
  md c:\newcerts
  cd c:\newcerts
  ```

* Quando um caractere `'\'` é exibido no final de uma linha de comando, este caractere `'\'` deve ser removido e as linhas de comando devem ser inseridas todas em uma única linha.

Após gerar os arquivos de certificado e chave, para usá-los em conexões SSL, consulte a Seção 8.3.1, “Configurando o MySQL para usar conexões criptografadas”.

#### 8.3.3.3 Criando Chaves RSA Usando o openssl

Esta seção descreve como usar o comando **openssl** para configurar os arquivos de chave RSA que permitem que o MySQL suporte a troca segura de senhas em conexões não criptografadas para contas autenticadas pelos plugins `sha256_password` e `caching_sha2_password`.

Nota

Existem alternativas mais fáceis para gerar os arquivos necessários para o RSA do que o procedimento descrito aqui: deixe o servidor gerar automaticamente ou use o programa **mysql_ssl_rsa_setup** (desatualizado a partir do MySQL 8.0.34). Veja a Seção 8.3.3.1, “Criando Certificados e Chaves SSL e RSA usando MySQL”.

Para criar os arquivos de par de chave privada e pública RSA, execute esses comandos enquanto estiver logado na conta do sistema usada para executar o servidor MySQL, para que os arquivos pertençam a essa conta:

```
openssl genrsa -out private_key.pem 2048
openssl rsa -in private_key.pem -pubout -out public_key.pem
```

Esses comandos criam chaves de 2.048 bits. Para criar chaves mais fortes, use um valor maior.

Em seguida, defina os modos de acesso para os arquivos de chave. A chave privada deve ser legível apenas pelo servidor, enquanto a chave pública pode ser livremente distribuída para os usuários do cliente:

```
chmod 400 private_key.pem
chmod 444 public_key.pem
```

### 8.3.4 Conectando-se ao MySQL remotamente a partir do Windows com SSH

Esta seção descreve como obter uma conexão criptografada a um servidor MySQL remoto com SSH. As informações foram fornecidas por David Carlson `<dcarlson@mplcomm.com>`.

1. Instale um cliente SSH em sua máquina Windows. Para uma comparação de clientes SSH, consulte <http://en.wikipedia.org/wiki/Comparison_of_SSH_clients>.

2. Inicie o cliente SSH do Windows. Defina `Host_Name = yourmysqlserver_URL_or_IP`. Defina `userid=your_userid` para fazer login no seu servidor. Este valor `userid` pode não ser o mesmo que o nome de usuário da sua conta MySQL.

3. Configure o encaminhamento de porta. Faça um encaminhamento remoto (Configure `local_port: 3306`, `remote_host: yourmysqlservername_or_ip`, `remote_port: 3306`) ou um encaminhamento local (Configure `port: 3306`, `host: localhost`, `remote port: 3306`).

4. Salve tudo, caso contrário, você terá que fazer tudo novamente na próxima vez.
5. Faça login no seu servidor com a sessão SSH que você acabou de criar.
6. Na sua máquina com Windows, inicie algum aplicativo ODBC (como o Access).

7. Crie um novo arquivo no Windows e faça uma ligação ao MySQL usando o driver ODBC da mesma maneira que você normalmente faz, exceto que digite `localhost` para o servidor de host MySQL, não *`yourmysqlservername`*.

Neste ponto, você deve ter uma conexão ODBC para o MySQL, criptografada usando SSH.

### 8.3.5 Reutilizar sessões SSL

A partir do MySQL 8.0.29, os programas cliente do MySQL podem optar por retomar uma sessão SSL anterior, desde que o servidor tenha a sessão em sua cache de execução. Esta seção descreve as condições que são favoráveis para a reutilização da sessão SSL, as variáveis do servidor usadas para gerenciar e monitorar a cache de sessão e as opções de linha de comando do cliente para armazenar e reutilizar os dados da sessão.

* Configuração e monitoramento de execução no lado do servidor para reutilização de sessões SSL
* Configuração no lado do cliente para reutilização de sessões SSL

Cada troca completa de TLS pode ser custosa tanto em termos de computação quanto de sobrecarga de rede, menos custosa se o TLSv1.3 for usado. Ao extrair um ticket de sessão de uma sessão estabelecida e, em seguida, submeter esse ticket ao estabelecer a próxima conexão, o custo geral é reduzido se a sessão puder ser reutilizada. Por exemplo, considere o benefício de ter páginas da web que podem abrir múltiplas conexões e gerar mais rápido.

Em geral, as seguintes condições devem ser atendidas antes que as sessões SSL possam ser reutilizadas:

* O servidor deve manter sua cache de sessão na memória. * O tempo de expiração da cache de sessão do lado do servidor não deve ter expirado. * Cada cliente deve manter uma cache de sessões ativas e mantê-la segura.

As aplicações C podem usar as capacidades da API C para habilitar a reutilização de sessões para conexões criptografadas (consulte Reutilização de Sessão SSL).

#### Configuração e monitoramento de execução no lado do servidor para reutilização de sessões SSL

Para criar o contexto inicial do TLS, o servidor utiliza os valores que as variáveis de sistema relacionadas ao contexto têm no início. Para expor os valores do contexto, o servidor também inicializa um conjunto de variáveis de status correspondentes. O seguinte quadro mostra as variáveis de sistema que definem o cache de sessão de execução do servidor e as variáveis de status correspondentes que expor os valores do cache de sessão atualmente ativos.

**Tabela 8.15 Variáveis de sistema e status para reutilização de sessão**

<table summary="The system variables that define caching for session reuse and the corresponding status variables that expose active session-cache values."><col style="width: 45%"/><col style="width: 55%"/><thead><tr> <th>System Variable Name</th> <th>Corresponding Status Variable Name</th> </tr></thead><tbody><tr> <td><code>ssl_session_cache_mode</code></td> <td><code>Ssl_session_cache_mode</code></td> </tr><tr> <td><code>ssl_session_cache_timeout</code></td> <td><code>Ssl_session_cache_timeout</code></td> </tr></tbody></table>

Nota

Quando o valor da variável do servidor `ssl_session_cache_mode` é `ON`, que é o modo padrão, o valor da variável de status `Ssl_session_cache_mode` é `SERVER`.

As variáveis de cache de sessão SSL se aplicam tanto aos canais TLS `mysql_main` quanto `mysql_admin`. Seus valores também são exibidos como propriedades na tabela do Gerador de desempenho `tls_channel_status`, juntamente com as propriedades de quaisquer outros contextos TLS ativos.

Para reconfigurar o cache de sessão SSL em tempo de execução, use este procedimento:

1. Defina cada variável de sistema relacionada ao cache que deve ser alterada para seu novo valor. Por exemplo, altere o valor do tempo de espera do cache do padrão (300 segundos) para 600 segundos:

   ```
   mysql> SET GLOBAL ssl_session_cache_timeout = 600;
   ```

Os membros de cada par de variáveis de sistema e status podem ter valores diferentes temporariamente devido à forma como o procedimento de reconfiguração funciona.

   ```
   mysql> SHOW VARIABLES LIKE 'ssl_session_cache_timeout';
   +---------------------------+-------+
   | Variable_name             | Value |
   +---------------------------+-------+
   | ssl_session_cache_timeout | 600   |
   +---------------------------+-------+
   1 row in set (0.00 sec)

   mysql> SHOW STATUS LIKE 'Ssl_session_cache_timeout';
   +---------------------------+-------+
   | Variable_name             | Value |
   +---------------------------+-------+
   | Ssl_session_cache_timeout | 300   |
   +---------------------------+-------+
   1 row in set (0.00 sec)
   ```

Para obter informações adicionais sobre a definição de valores variáveis, consulte Atribuição de variáveis do sistema.

2. Execute `ALTER INSTANCE RELOAD TLS`(alter-instance.html#alter-instance-reload-tls). Esta declaração reconfigura o contexto TLS ativo a partir dos valores atuais das variáveis do sistema relacionadas ao cache. Também define as variáveis de status relacionadas ao cache para refletir os novos valores ativos do cache. A declaração requer o privilégio `CONNECTION_ADMIN`.

   ```
   mysql> ALTER INSTANCE RELOAD TLS;
   Query OK, 0 rows affected (0.01 sec)

   mysql> SHOW VARIABLES LIKE 'ssl_session_cache_timeout';
   +---------------------------+-------+
   | Variable_name             | Value |
   +---------------------------+-------+
   | ssl_session_cache_timeout | 600   |
   +---------------------------+-------+
   1 row in set (0.00 sec)

   mysql> SHOW STATUS LIKE 'Ssl_session_cache_timeout';
   +---------------------------+-------+
   | Variable_name             | Value |
   +---------------------------+-------+
   | Ssl_session_cache_timeout | 600   |
   +---------------------------+-------+
   1 row in set (0.00 sec)
   ```

As novas conexões estabelecidas após a execução de `ALTER INSTANCE RELOAD TLS` utilizam o novo contexto TLS. As conexões existentes permanecem sem alterações.

#### Configuração do lado do cliente para reutilização de sessão SSL

Todos os programas cliente do MySQL são capazes de reutilizar uma sessão anterior para novas conexões criptografadas feitas ao mesmo servidor, desde que você tenha armazenado os dados da sessão enquanto a conexão original ainda estava ativa. Os dados da sessão são armazenados em um arquivo e você especifica esse arquivo quando invoca o cliente novamente.

Para armazenar e reutilizar dados de sessão SSL, use este procedimento:

1. Inicie o **mysql** para estabelecer uma conexão criptografada com um servidor que executa o MySQL 8.0.29 ou superior.

2. Use o comando **ssl_session_data_print** para especificar o caminho de um arquivo onde você pode armazenar os dados da sessão atualmente ativos de forma segura. Por exemplo:

   ```
   mysql> ssl_session_data_print ~/private-dir/session.txt
   ```

Os dados da sessão são obtidos na forma de uma string ANSI codificada PEM terminada por nulo. Se você omitir o caminho e o nome do arquivo, a string é impressa na saída padrão.

3. Do prompt do seu interpretador de comandos, invoque qualquer programa cliente MySQL para estabelecer uma nova conexão criptografada ao mesmo servidor. Para reutilizar os dados da sessão, especifique a opção de linha de comando `--ssl-session-data` e o argumento do arquivo.

Por exemplo, estabeleça uma nova conexão usando **mysql**:

   ```
   mysql -u admin -p --ssl-session-data=~/private-dir/session.txt
   ```

e, em seguida, **mysqlshow** cliente:

   ```
   mysqlshow -u admin -p --ssl-session-data=~/private-dir/session.txt
   Enter password: *****
   +--------------------+
   |     Databases      |
   +--------------------+
   | information_schema |
   | mysql              |
   | performance_schema |
   | sys                |
   | world              |
   +--------------------+
   ```

Em cada exemplo, o cliente tenta retomar a sessão original enquanto estabelece uma nova conexão com o mesmo servidor.

Para confirmar se o **mysql** reutilizou uma sessão, veja a saída do comando `status`. Se a conexão atualmente ativa do **mysql** tiver retomado a sessão, as informações de status incluem `SSL session reused: true`.

Além de **mysql** e **mysqlshow**, a reutilização de sessões SSL se aplica a **mysqladmin**, **mysqlbinlog**, **mysqlcheck**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **mysqlbinlog**, **

Várias condições podem impedir a recuperação bem-sucedida dos dados da sessão. Por exemplo, se a sessão não estiver totalmente conectada, não é uma sessão SSL, o servidor ainda não enviou os dados da sessão ou a sessão SSL simplesmente não é reutilizável. Mesmo com dados de sessão armazenados corretamente, o cache de sessão do servidor pode expirar. Independentemente da causa, um erro é retornado por padrão se você especificar `--ssl-session-data`, mas a sessão não pode ser reutilizada. Por exemplo:

```
mysqlshow -u admin -p --ssl-session-data=~/private-dir/session.txt
Enter password: *****
ERROR:
--ssl-session-data specified but the session was not reused.
```

Para suprimir a mensagem de erro e estabelecer a conexão criando silenciosamente uma nova sessão, especifique `--ssl-session-data-continue-on-failed-reuse` na linha de comando, juntamente com `--ssl-session-data`. Se o tempo limite de cache do servidor expirar, você pode armazenar os dados da sessão novamente no mesmo arquivo. O tempo limite de cache padrão do servidor pode ser estendido (consulte Configuração e monitoramento do runtime do lado do servidor para reutilização de sessão SSL).