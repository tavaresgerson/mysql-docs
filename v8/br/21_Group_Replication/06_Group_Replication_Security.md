## 20.6 Segurança da Replicação em Grupo

Esta seção explica como proteger um grupo, assegurando as conexões entre os membros de um grupo, ou estabelecendo um perímetro de segurança usando uma lista de endereços IP.

### 20.6.1 Pilha de comunicação para gerenciamento de segurança de conexão

A partir do MySQL 8.0.27, a Replicação de Grupo pode proteger as conexões de comunicação de grupo entre os membros por um dos seguintes métodos:

* Utilizando sua própria implementação dos protocolos de segurança, incluindo TLS/SSL e o uso de uma lista de permissão para conexões do Sistema de Comunicação de Grupo (GCS) de entrada. Esta é a única opção para MySQL 8.0.26 e versões anteriores.

* Uso da segurança de conexão própria do MySQL Server em vez da implementação da Replicação por Grupo. Usar o protocolo MySQL significa que métodos padrão de autenticação de usuário podem ser usados para conceder (ou revogar) acesso ao grupo em vez da allowlist, e a funcionalidade mais recente do protocolo do servidor está sempre disponível na versão. Esta opção está disponível a partir do MySQL 8.0.27.

A escolha é feita definindo a variável de sistema `group_replication_communication_stack` para `XCOM` para usar a própria implementação do Grupo de Replicação (esta é a escolha padrão), ou para `MYSQL` para usar a segurança de conexão do MySQL Server.

A configuração adicional a seguir é necessária para que um grupo de replicação utilize a pilha de comunicação MySQL. É especialmente importante garantir que todos esses requisitos estejam atendidos quando você mudar de usar a pilha de comunicação XCom para a pilha de comunicação MySQL para seu grupo.

**Requisitos de Replicação em Grupo para o Conjunto de Comunicação MySQL**

* O endereço de rede configurado pela variável de sistema `group_replication_local_address` para cada membro do grupo deve ser definido para um dos endereços IP e portas nos quais o MySQL Server está ouvindo, conforme especificado pela variável de sistema `bind_address` para o servidor. A combinação de endereço IP e porta para cada membro deve ser única no grupo. É recomendável que a variável de sistema `group_replication_group_seeds` para cada membro do grupo seja configurada para conter todos os endereços locais de todos os membros do grupo.

* A pilha de comunicação MySQL suporta namespaces de rede, que a pilha de comunicação XCom não suporta. Se namespaces de rede forem usados com endereços locais de replicação de grupo para os membros do grupo (`group_replication_local_address`), esses devem ser configurados para cada membro do grupo usando a declaração `CHANGE REPLICATION SOURCE TO`. Além disso, a variável de sistema de servidor `report_host` para cada membro do grupo deve ser definida para relatar o namespace. Todos os membros do grupo devem usar o mesmo namespace para evitar possíveis problemas com resolução de endereços durante a recuperação distribuída.

* A variável de sistema `group_replication_ssl_mode` deve ser configurada para o ajuste necessário para comunicações em grupo. Essa variável de sistema controla se o TLS/SSL está habilitado ou desabilitado para comunicações em grupo. Para MySQL 8.0.26 e versões anteriores, a configuração TLS/SSL é sempre tirada das configurações SSL do servidor; para MySQL 8.0.27 e versões posteriores, quando o stack de comunicação MySQL é usado, a configuração TLS/SSL é tirada das configurações de recuperação distribuída da Replicação em Grupo. Este ajuste deve ser o mesmo em todos os membros do grupo, para evitar potenciais conflitos.

* As configurações para a opção do servidor `--ssl` ou `--skip-ssl` e para a variável do sistema de servidor `require_secure_transport` devem ser as mesmas em todos os membros do grupo, para evitar potenciais conflitos. Se `group_replication_ssl_mode` estiver definido como `REQUIRED`, `VERIFY_CA` ou `VERIFY_IDENTITY`, use `--ssl` e `require_secure_transport=ON`. Se `group_replication_ssl_mode` estiver definido como `DISABLED`, use `require_secure_transport=OFF`.

* Se o TLS/SSL estiver habilitado para comunicações em grupo, as configurações da Replicação de Grupo para a segurança da recuperação distribuída devem ser configuradas, se ainda não estiverem em vigor, ou validadas, se já estiverem. A pilha de comunicação MySQL usa essas configurações não apenas para conexões de recuperação distribuída membro a membro, mas também para a configuração TLS/SSL em comunicações de grupo em geral. As variáveis de sistema `group_replication_recovery_use_ssl` e as outras `group_replication_recovery_*` são explicadas na Seção 20.6.3.2, "Conexões de Camada de Sockets Segura (SSL) para Recuperação Distribuída" (Conexões para Recuperação Distribuída).

* A lista de permissão de replicação do grupo não é usada quando o grupo está usando a pilha de comunicação MySQL, portanto, as variáveis de sistema `group_replication_ip_allowlist` e `group_replication_ip_whitelist` são ignoradas e não precisam ser configuradas.

* A conta de usuário de replicação que a Replicação em Grupo usa para recuperação distribuída, conforme configurada usando a declaração `CHANGE REPLICATION SOURCE TO`, é usada para autenticação pelo conjunto de comunicação MySQL ao configurar conexões de Replicação em Grupo. Essa conta de usuário, que é a mesma em todos os membros do grupo, deve ter os seguintes privilégios:

+ `GROUP_REPLICATION_STREAM`. Esse privilégio é necessário para que a conta do usuário possa estabelecer conexões para Replicação de Grupo usando a pilha de comunicação MySQL.

+ `CONNECTION_ADMIN`. Este privilégio é necessário para que as conexões de Replicação de Grupo não sejam terminadas se um dos servidores envolvidos for colocado no modo offline. Se a pilha de comunicação do MySQL estiver em uso sem este privilégio, um membro que for colocado no modo offline é expulso do grupo.

Estes são, além dos privilégios `REPLICATION SLAVE` e `BACKUP_ADMIN` que todas as contas de usuário de replicação devem ter (consulte Seção 20.2.1.3, “Credenciais de usuário para recuperação distribuída”). Ao adicionar os novos privilégios, certifique-se de que você pule o registro binário em cada membro do grupo, emitindo `SET SQL_LOG_BIN=0` antes de emitir as declarações `GRANT`, e `SET SQL_LOG_BIN=1` após elas, para que a transação local não interfira na reinicialização da Replicação do Grupo.

`group_replication_communication_stack` é, de fato, um ajuste de configuração para todo o grupo, e o ajuste deve ser o mesmo em todos os membros do grupo. No entanto, isso não é monitorado pelas próprias verificações da Replicação de Grupo para ajustes de configuração para todo o grupo. Um membro com um valor diferente do restante do grupo não pode se comunicar com os outros membros, porque os protocolos de comunicação são incompatíveis, então não pode trocar informações sobre seus ajustes de configuração.

Isso significa que, embora o valor da variável do sistema possa ser alterado enquanto a Replicação em Grupo está em execução e tenha efeito após você reiniciar a Replicação em Grupo no membro do grupo, o membro ainda não pode se juntar ao grupo até que o ajuste tenha sido alterado em todos os membros. Portanto, você deve parar a Replicação em Grupo em todos os membros e alterar o valor da variável do sistema em todos eles antes de poder reiniciar o grupo. Como todos os membros estão parados, é necessário um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para que a alteração do valor tenha efeito. Você pode fazer as outras alterações necessárias nas configurações dos membros do grupo enquanto eles estão parados.

Para um grupo de corrida, siga este procedimento para alterar o valor de `group_replication_communication_stack` e os outros ajustes necessários para migrar um grupo do conjunto de comunicação XCom para o conjunto de comunicação MySQL, ou do conjunto de comunicação MySQL para o conjunto de comunicação XCom:

1. Parar a Replicação em Grupo em cada um dos membros do grupo, usando uma declaração `STOP GROUP_REPLICATION`. Parar o membro principal por último, para que você não desencadeie uma nova eleição principal e tenha que esperar que isso seja concluído.

2. Em cada um dos membros do grupo, defina a variável de sistema `group_replication_communication_stack` para a nova pilha de comunicação, `MYSQL` ou `XCOM`, conforme apropriado. Você pode fazer isso editando o arquivo de configuração do MySQL Server (tipicamente denominado `my.cnf` em sistemas Linux e Unix, ou `my.ini` em sistemas Windows), ou usando uma declaração `SET`. Por exemplo:

   ```
   SET PERSIST group_replication_communication_stack="MYSQL";
   ```

3. Se você estiver migrando o grupo de replicação do conjunto de comunicação XCom (o padrão) para o conjunto de comunicação MySQL, em cada um dos membros do grupo, configure ou reconfigure as variáveis de sistema necessárias para configurações apropriadas, conforme descrito na lista acima. Por exemplo, a variável de sistema `group_replication_local_address` deve ser definida para um dos endereços IP e portas nas quais o MySQL Server está ouvindo. Além disso, configure quaisquer namespaces de rede usando uma declaração [[`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement")].

4. Se você estiver migrando o grupo de replicação do stack de comunicação XCom (o padrão) para o stack de comunicação MySQL, em cada um dos membros do grupo, emita as declarações `GRANT` para dar à conta de usuário de replicação os privilégios `GROUP_REPLICATION_STREAM` e `CONNECTION_ADMIN`. Você precisará tirar os membros do grupo do estado de leitura somente que é aplicado quando a Replicação de Grupo é parada. Além disso, certifique-se de que você ignore o registro binário em cada membro do grupo emitindo as declarações `SET SQL_LOG_BIN=0` antes de emitir as declarações `GRANT` e `SET SQL_LOG_BIN=1` depois delas, para que a transação local não interfira na reinicialização da Replicação de Grupo. Por exemplo:

   ```
   SET GLOBAL SUPER_READ_ONLY=OFF;
   SET SQL_LOG_BIN=0;
   GRANT GROUP_REPLICATION_STREAM ON *.* TO rpl_user@'%';
   GRANT CONNECTION_ADMIN ON *.* TO rpl_user@'%';
   SET SQL_LOG_BIN=1;
   ```

5. Se você estiver migrando o grupo de replicação do conjunto de comunicação MySQL de volta ao conjunto de comunicação XCom, em cada um dos membros do grupo, reconfigure as variáveis do sistema na lista de requisitos acima para configurações adequadas para o conjunto de comunicação XCom. A Seção 20.9, “Variáveis de Replicação de Grupo”, lista as variáveis do sistema com seus padrões e requisitos para o conjunto de comunicação XCom.

Nota

* A pilha de comunicação XCom não suporta nomes de rede, portanto, o endereço local de replicação de grupo (`group_replication_local_address` variável do sistema) não pode usá-los. Desative-os emitindo uma declaração [[`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement")].

* Quando você retorna ao pilha de comunicação XCom, as configurações especificadas por `group_replication_recovery_use_ssl` e as outras variáveis de sistema `group_replication_recovery_*` não são usadas para garantir comunicações em grupo. Em vez disso, a variável de sistema de Replicação de Grupo `group_replication_ssl_mode` é usada para ativar o uso do SSL para conexões de comunicação em grupo e especificar o modo de segurança para as conexões, e o restante da configuração é tomado da configuração SSL do servidor. Para detalhes, consulte a Seção 20.6.2, “Segurando Conexões de Comunicação em Grupo com Secure Socket Layer (SSL)”).)

6. Para reiniciar o grupo, siga o processo na Seção 20.5.2, “Reiniciar um grupo”, que explica como inicializar com segurança um grupo onde as transações foram executadas e certificadas. Uma inicialização por um servidor com `group_replication_bootstrap_group=ON` é necessária para alterar a pilha de comunicação, porque todos os membros devem ser desligados.

7. Os membros agora se conectam uns com os outros usando a nova pilha de comunicação. Qualquer servidor que tenha `group_replication_communication_stack` definido (ou padrão, no caso do XCom) para a pilha de comunicação anterior não pode mais se juntar ao grupo. É importante notar que, como a Replicação de Grupo nem sequer pode ver a tentativa de adesão, ela não verifica e rejeita o membro que está tentando se juntar com uma mensagem de erro. Em vez disso, a tentativa de adesão falha silenciosamente quando a pilha de comunicação anterior desiste de tentar entrar em contato com a nova.

### 20.6.2 Segurança das conexões de comunicação do grupo com Secure Socket Layer (SSL)

As conexões de sockets seguras podem ser usadas para comunicações em grupo entre os membros de um grupo.

A variável do sistema de replicação de grupo `group_replication_ssl_mode` é usada para ativar o uso do SSL para conexões de comunicação em grupo e especificar o modo de segurança para as conexões. Este valor deve ser o mesmo em todos os membros do grupo; se for diferente, alguns membros podem não ser capazes de se juntar ao grupo. O ajuste padrão significa que o SSL não é usado. Esta variável tem os seguintes valores possíveis:

**Tabela 20.1 valores de configuração do modo grupo_replication_ssl**

<table summary="Lists the possible values for group_replication_ssl_mode and describes their effect on how replication group members connect to each other."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Value</th> <th><p>Descrição</p></th> </tr></thead><tbody><tr> <td><code>DISABLED</code></td> <td><p>Estabeleça uma conexão não criptografada (o padrão).</p></td> </tr><tr> <td><code>REQUIRED</code></td> <td><p>Estabeleça uma conexão segura, se o servidor suportar conexões seguras.</p></td> </tr><tr> <td><code>VERIFY_CA</code></td> <td><p>Como<code>REQUIRED</code>, mas também verifique o certificado TLS do servidor contra os certificados da Autoridade de Certificação (CA) configurados.</p></td> </tr><tr> <td><code>VERIFY_IDENTITY</code></td> <td><p>Como<code>VERIFY_CA</code>, mas também verifique se o certificado do servidor corresponde ao host ao qual a conexão é realizada.</p></td> </tr></tbody></table>

Se SSL for utilizado, os meios para configurar a conexão segura dependem de se o XCom ou a pilha de comunicação MySQL é utilizada para comunicação em grupo (há uma escolha entre as duas opções desde o MySQL 8.0.27).

**Ao usar a pilha de comunicação XCom (`group_replication_communication_stack=XCOM`):** O restante da configuração para as conexões de comunicação de grupo da Replicação de Grupo é tirada da configuração SSL do servidor. Para mais informações sobre as opções de configuração do SSL do servidor, consulte Opções de comando para conexões criptografadas. As opções SSL do servidor que são aplicadas às conexões de comunicação de grupo da Replicação de Grupo são as seguintes:

**Tabela 20.2 Opções SSL**

<table summary="Lists the server configuration options for SSL and describes their effect on the configuration of the Group Replication plugin for SSL."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Server Configuration</th> <th>Descrição</th> </tr></thead><tbody><tr> <td><code>ssl_key</code></td> <td>O nome do caminho do arquivo da chave privada SSL em formato PEM. Do lado do cliente, esta é a chave privada do cliente. Do lado do servidor, esta é a chave privada do servidor.</td> </tr><tr> <td><code>ssl_cert</code></td> <td>O nome do caminho do arquivo de certificado da chave pública SSL em formato PEM. Do lado do cliente, este é o certificado da chave pública do cliente. Do lado do servidor, este é o certificado da chave pública do servidor.</td> </tr><tr> <td><code>ssl_ca</code></td> <td>O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA) no formato PEM.</td> </tr><tr> <td><code>ssl_capath</code></td> <td>O nome do caminho do diretório que contém os arquivos de autoridade de certificação SSL (CA) de confiança em formato PEM.</td> </tr><tr> <td><code>ssl_crl</code></td> <td>O nome do caminho do arquivo que contém listas de revogação de certificados no formato PEM.</td> </tr><tr> <td><code>ssl_crlpath</code></td> <td>O nome do caminho do diretório que contém os arquivos da lista de revogação de certificados em formato PEM.</td> </tr><tr> <td><code>ssl_cipher</code></td> <td>Uma lista de cifra permitida para conexões criptografadas.</td> </tr><tr> <td><code>tls_version</code></td> <td>Uma lista dos protocolos TLS que o servidor permite para conexões criptografadas.</td> </tr><tr> <td><code>tls_ciphersuites</code></td> <td>Quais as suíte de cifra TLSv1.3 que o servidor permite para conexões criptografadas.</td> </tr></tbody></table>

Importante

* O suporte aos protocolos de conexão TLSv1 e TLSv1.1 é removido do MySQL Server a partir do MySQL 8.0.28. Os protocolos foram descontinuados no MySQL 8.0.26, embora os clientes do MySQL Server, incluindo as instâncias do servidor de Replicação de Grupo que atuam como clientes, não retornem avisos ao usuário se uma versão de protocolo TLS descontinuada for usada. Consulte a Remoção do Suporte aos Protocolos TLSv1 e TLSv1.1 para obter mais informações.

* O suporte ao protocolo TLSv1.3 está disponível no MySQL Server a partir do MySQL 8.0.16, desde que o MySQL Server tenha sido compilado usando o OpenSSL 1.1.1. O servidor verifica a versão do OpenSSL no início e, se for menor que 1.1.1, o TLSv1.3 é removido do valor padrão para as variáveis do sistema do servidor relacionadas às versões TLS (incluindo a variável de sistema `group_replication_recovery_tls_version`).

* A Replicação em Grupo suporta TLSv1.3 a partir do MySQL 8.0.18. No MySQL 8.0.16 e no MySQL 8.0.17, se o servidor suportar TLSv1.3, o protocolo não é suportado no motor de comunicação em grupo e não pode ser usado pela Replicação em Grupo.

* No MySQL 8.0.18, o TLSv1.3 pode ser usado na Replicação em Grupo para a conexão de recuperação distribuída, mas as variáveis de sistema `group_replication_recovery_tls_version` e `group_replication_recovery_tls_ciphersuites` não estão disponíveis. Portanto, os servidores doadores devem permitir o uso de pelo menos um conjunto de cifras TLSv1.3 que seja habilitado por padrão, conforme listado na Seção 8.3.2, "Protocolos e cifras de conexão TLS criptografadas". A partir do MySQL 8.0.19, você pode usar as opções para configurar o suporte ao cliente para qualquer seleção de conjuntos de cifras, incluindo apenas conjuntos de cifras não padrão, se desejar.

* Na lista de protocolos TLS especificados na variável de sistema `tls_version`, certifique-se de que as versões especificadas estejam consecutivas (por exemplo, `TLSv1.2,TLSv1.3`). Se houver alguma lacuna na lista de protocolos (por exemplo, se você especificou `TLSv1,TLSv1.2`, omitindo o TLS 1.1), a Replicação em Grupo pode não ser capaz de estabelecer conexões de comunicação em grupo.

Em um grupo de replicação, o OpenSSL negocia o uso do protocolo TLS mais alto que é suportado por todos os membros. Um membro que se junta e está configurado para usar apenas TLSv1.3 (`tls_version=TLSv1.3`) não pode se juntar a um grupo de replicação onde qualquer membro existente não suporte TLSv1.3, porque os membros do grupo, nesse caso, estão usando uma versão de protocolo TLS mais baixa. Para se juntar ao membro ao grupo, você deve configurar o membro que se junta para permitir também o uso de versões de protocolo TLS mais baixas suportadas pelos membros do grupo existentes. Por outro lado, se um membro que se junta não suporte TLSv1.3, mas os membros do grupo existentes todos o suportam e estão usando essa versão para conexões uns com os outros, o membro pode se juntar se os membros do grupo existentes já permitam o uso de uma versão de protocolo TLS mais adequada, ou se você os configurar para fazer isso. Nessa situação, o OpenSSL usa uma versão de protocolo TLS mais baixa para as conexões de cada membro para o membro que se junta. As conexões de cada membro com outros membros existentes continuam a usar o protocolo mais alto disponível que ambos os membros suportam.

A partir do MySQL 8.0.16, você pode alterar a variável de sistema `tls_version` em tempo de execução para alterar a lista de versões de protocolo TLS permitidas para o servidor. Observe que, para a Replicação por Grupo, a declaração `ALTER INSTANCE RELOAD TLS`, que reconfigura o contexto TLS do servidor a partir dos valores atuais das variáveis de sistema que definem o contexto, não altera o contexto TLS para a conexão de comunicação de grupo da Replicação por Grupo enquanto a Replicação por Grupo estiver em execução. Para aplicar a reconfiguração nessas conexões, você deve executar `STOP GROUP_REPLICATION` seguido de `START GROUP_REPLICATION` para reiniciar a Replicação por Grupo no membro ou membros onde você alterou a variável de sistema `tls_version`. Da mesma forma, se você deseja que todos os membros de um grupo usem uma versão de protocolo TLS mais alta ou mais baixa, você deve realizar um reinício contínuo da Replicação por Grupo nos membros após alterar a lista de versões de protocolo TLS permitidas, para que o OpenSSL negocie o uso da versão de protocolo TLS mais alta quando o reinício contínuo for concluído. Para obter instruções sobre como alterar a lista de versões de protocolo TLS em tempo de execução, consulte a Seção 8.3.2, “Protocolos e cifras de conexão TLS criptografada” e [Configuração e monitoramento de execução no lado do servidor para conexões criptografadas][(using-encrypted-connections.html#using-encrypted-connections-server-side-runtime-configuration "Server-Side Runtime Configuration and Monitoring for Encrypted Connections")].

O exemplo a seguir mostra uma seção de um arquivo `my.cnf` que configura o SSL em um servidor e ativa o SSL para conexões de comunicação do grupo de replicação:

```
[mysqld]
ssl_ca = "cacert.pem"
ssl_capath = "/.../ca_directory"
ssl_cert = "server-cert.pem"
ssl_cipher = "DHE-RSA-AEs256-SHA"
ssl_crl = "crl-server-revoked.crl"
ssl_crlpath = "/.../crl_directory"
ssl_key = "server-key.pem"
group_replication_ssl_mode= REQUIRED
```

Importante

A declaração `ALTER INSTANCE RELOAD TLS`, que reconfigura o contexto TLS do servidor a partir dos valores atuais das variáveis do sistema que definem o contexto, não altera o contexto TLS para as conexões de comunicação de grupo da Replicação de Grupo enquanto a Replicação de Grupo estiver em execução. Para aplicar a reconfiguração a essas conexões, você deve executar `STOP GROUP_REPLICATION` seguido por `START GROUP_REPLICATION` para reiniciar a Replicação de Grupo.

As conexões feitas entre um membro de junção e um membro existente para recuperação distribuída não estão cobertas pelas opções descritas acima. Essas conexões utilizam as opções dedicadas de recuperação distribuída SSL da Replicação por Grupo, que são descritas na Seção 20.6.3.2, "Conexões de Camada de Sockets Segura (SSL) para Recuperação Distribuída" (Conexões para Recuperação Distribuída).

**Ao usar a pilha de comunicação MySQL (group_replication_communication_stack=MYSQL):** As configurações de segurança para a recuperação distribuída do grupo são aplicadas às comunicações normais entre os membros do grupo. Veja a Seção 20.6.3, “Segurando Conexões de Recuperação Distribuída”, sobre como configurar as configurações de segurança.

### 20.6.3 Segurança de conexões de recuperação distribuída

Importante

Quando se utiliza a pilha de comunicação MySQL (`group_replication_communication_stack=MYSQL`) E conexões seguras entre membros (`group_replication_ssl_mode` não está configurada para `DISABLED`), as configurações de segurança discutidas nesta seção são aplicadas não apenas a conexões de recuperação distribuídas, mas também às comunicações de grupo entre membros em geral.

Quando um membro se junta ao grupo, a recuperação distribuída é realizada usando uma combinação de uma operação de clonagem remota, se disponível e apropriada, e uma conexão de replicação assíncrona. Para uma descrição completa da recuperação distribuída, consulte a Seção 20.5.4, “Recuperação Distribuída”.

Até o MySQL 8.0.20, os membros do grupo oferecem sua conexão padrão de cliente SQL para membros que participam da recuperação distribuída, conforme especificado pelas variáveis de sistema `hostname` e `port` do MySQL Server. A partir do MySQL 8.0.21, os membros do grupo podem anunciar uma lista alternativa de pontos finais de recuperação distribuída como conexões de cliente dedicadas para membros que participam da recuperação. Para mais detalhes, consulte a Seção 20.5.4.1, “Conexões para Recuperação Distribuída”. Observe que tais conexões oferecidas a um membro que participa da recuperação distribuída *não* são as mesmas conexões que são usadas pela Replicação de Grupo para comunicação entre membros online quando a pilha de comunicação XCom é usada para comunicações de grupo (`group_replication_communication_stack=XCOM`).

Para garantir conexões de recuperação distribuídas no grupo, certifique-se de que as credenciais do usuário para o usuário de replicação estejam adequadamente protegidas e use SSL para conexões de recuperação distribuídas, se possível.

#### 20.6.3.1 Credenciais de Usuário Seguro para Recuperação Distribuída

A transferência de estado do log binário requer um usuário de replicação com as permissões corretas para que a Replicação de Grupo possa estabelecer canais de replicação diretos entre membros. O mesmo usuário de replicação é usado para a recuperação distribuída em todos os membros do grupo. Se os membros do grupo foram configurados para suportar o uso de uma operação de clonagem remota como parte da recuperação distribuída, que está disponível a partir do MySQL 8.0.17, este usuário de replicação também é usado como o usuário de clonagem no doador e requer as permissões corretas para este papel também. Para instruções detalhadas sobre como configurar este usuário, consulte a Seção 20.2.1.3, “Credenciais de Usuário para Recuperação Distribuída”.

Para garantir as credenciais do usuário, você pode exigir SSL para conexões com a conta do usuário e (a partir do MySQL 8.0.21) pode fornecer as credenciais do usuário quando a Replicação por Grupo é iniciada, em vez de armazená-las nas tabelas de status da replica. Além disso, se você estiver usando autenticação de cache SHA-2, você deve configurar pares de chave RSA nos membros do grupo.

Importante

Quando estiver usando a pilha de comunicação MySQL (`group_replication_communication_stack=MYSQL`) E conexões seguras entre membros (`group_replication_ssl_mode` não está configurado para `DISABLED`), os usuários de recuperação devem ser configurados corretamente, pois também são os usuários para comunicações de grupo. Siga as instruções na Seção 20.6.3.1.2, “Usuário de Replicação com SSL” e na Seção 20.6.3.1.3, “Fornecer Credenciais de Usuário de Replicação de Forma Segura”.

##### 20.6.3.1.1 Usuário de replicação com o plugin de autenticação SHA-2 de cacheamento

Por padrão, os usuários criados no MySQL 8 utilizam a Seção 8.4.1.2, “Cacheamento de Autenticação SHA-2 Pluggable”. Se o usuário de replicação que você configura para recuperação distribuída utilizar o plugin de autenticação de cache SHA-2 e você não estiver usando SSL para conexões de recuperação distribuída, pares de chaves RSA são utilizados para troca de senha. Para mais informações sobre pares de chaves RSA, consulte a Seção 8.3.3, “Criando Certificados e Chaves SSL e RSA”.

Nessa situação, você pode copiar a chave pública do `rpl_user` para o membro que está se juntando, ou configurar os doadores para fornecer a chave pública quando solicitado. A abordagem mais segura é copiar a chave pública da conta de usuário de replicação para o membro que está se juntando. Em seguida, você precisa configurar a variável de sistema `group_replication_recovery_public_key_path` no membro que está se juntando com o caminho para a chave pública da conta de usuário de replicação.

A abordagem menos segura é definir `group_replication_recovery_get_public_key=ON` nos doadores para que eles forneçam a chave pública da conta de usuário de replicação aos membros que se juntam. Não há como verificar a identidade de um servidor, portanto, defina apenas `group_replication_recovery_get_public_key=ON` quando você tiver certeza de que não há risco de a identidade do servidor ser comprometida, por exemplo, por um ataque de homem no meio do caminho.

##### 20.6.3.1.2 Usuário de replicação com SSL

Um usuário de replicação que requer uma conexão SSL deve ser criado *antes* do servidor que está se juntando ao grupo (o membro que está se juntando) se conectar ao doador. Normalmente, isso é configurado no momento em que você está provisionando um servidor para se juntar ao grupo. Para criar um usuário de replicação para recuperação distribuída que requer uma conexão SSL, execute essas declarações em todos os servidores que vão participar do grupo:

```
mysql> SET SQL_LOG_BIN=0;
mysql> CREATE USER 'rec_ssl_user'@'%' IDENTIFIED BY 'password' REQUIRE SSL;
mysql> GRANT REPLICATION SLAVE ON *.* TO 'rec_ssl_user'@'%';
mysql> GRANT CONNECTION_ADMIN ON *.* TO 'rec_ssl_user'@'%';
mysql> GRANT BACKUP_ADMIN ON *.* TO 'rec_ssl_user'@'%';
mysql> GRANT GROUP_REPLICATION_STREAM ON *.* TO rec_ssl_user@'%';
mysql> FLUSH PRIVILEGES;
mysql> SET SQL_LOG_BIN=1;
```

Nota

O privilégio `GROUP_REPLICATION_STREAM` é necessário ao usar tanto a pilha de comunicação MySQL (`group_replication_communication_stack=MYSQL`) quanto conexões seguras entre membros (`group_replication_ssl_mode` não configurada para `DISABLED`). Veja a Seção 20.6.1, “Pilha de Comunicação para Gerenciamento de Segurança de Conexão”.

##### 20.6.3.1.3 Fornecer as Credenciais do Usuário de Replicação de forma Segura

Para fornecer as credenciais do usuário para o usuário de replicação, você pode defini-las permanentemente como as credenciais para o canal `group_replication_recovery`, usando uma declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`. Alternativamente, a partir do MySQL 8.0.21, você pode especiá-las na declaração `START GROUP_REPLICATION` a cada vez que o Replicação por Grupo é iniciado. As credenciais do usuário especificadas em [`START GROUP_REPLICATION`(start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement") têm precedência sobre quaisquer credenciais do usuário que tenham sido definidas usando uma declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`.

As credenciais do usuário definidas usando `CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") | `CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") são armazenadas em texto plano nos repositórios de metadados de replicação no servidor, mas as credenciais do usuário especificadas em `START GROUP_REPLICATION`](start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement") são salvas apenas na memória e são removidas por uma declaração `STOP GROUP_REPLICATION`](stop-group-replication.html "15.4.3.2 STOP GROUP_REPLICATION Statement") ou desligamento do servidor. Usar `START GROUP_REPLICATION` para especificar as credenciais do usuário, portanto, ajuda a proteger os servidores de replicação do grupo contra acesso não autorizado. No entanto, esse método não é compatível com o início automático da replicação do grupo, conforme especificado pela variável de sistema `group_replication_start_on_boot`.

Se você deseja definir as credenciais do usuário permanentemente usando uma declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`, emita essa declaração no membro que vai se juntar ao grupo:

```
mysql> CHANGE MASTER TO MASTER_USER='rec_ssl_user', MASTER_PASSWORD='password'
            FOR CHANNEL 'group_replication_recovery';

Or from MySQL 8.0.23:
mysql> CHANGE REPLICATION SOURCE TO SOURCE_USER='rec_ssl_user', SOURCE_PASSWORD='password'
            FOR CHANNEL 'group_replication_recovery';
```

Para fornecer as credenciais do usuário em `START GROUP_REPLICATION`(start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement"), faça esta declaração ao iniciar a Replicação em Grupo pela primeira vez ou após o reinício do servidor:

```
mysql> START GROUP_REPLICATION USER='rec_ssl_user', PASSWORD='password';
```

Importante

Se você mudar para usar `START GROUP_REPLICATION` para especificar as credenciais do usuário em um servidor que anteriormente forneceu as credenciais usando `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`, você deve completar os passos a seguir para obter os benefícios de segurança dessa mudança.

1. Parar a Replicação em Grupo no membro do grupo usando uma declaração `STOP GROUP_REPLICATION`. Embora seja possível realizar os dois passos a seguir enquanto a Replicação em Grupo está em execução, você precisa reiniciar a Replicação em Grupo para implementar as alterações.

2. Defina o valor da variável de sistema `group_replication_start_on_boot` para `OFF` (o padrão é `ON`).

3. Remova as credenciais de recuperação distribuídas das tabelas de status de replicação, emitindo esta declaração:

   ```
   mysql> CHANGE MASTER TO MASTER_USER='', MASTER_PASSWORD=''
               FOR CHANNEL 'group_replication_recovery';

   Or from MySQL 8.0.23:
   mysql> CHANGE REPLICATION SOURCE TO SOURCE_USER='', SOURCE_PASSWORD=''
               FOR CHANNEL 'group_replication_recovery';
   ```

4. Reinicie a replicação em grupo no membro do grupo usando uma declaração `START GROUP_REPLICATION` que especifica as credenciais de usuário de recuperação distribuída.

Sem essas etapas, as credenciais permanecem armazenadas nas tabelas de status da replica, e também podem ser transferidas para outros membros do grupo durante operações de clonagem remota para recuperação distribuída. O canal `group_replication_recovery` poderia então ser iniciado inadvertidamente com as credenciais armazenadas, seja no membro original ou nos membros que foram clonados a partir dele. Um início automático da Replicação do Grupo no inicialização do servidor (incluindo após uma operação de clonagem remota) usaria as credenciais de usuário armazenadas, e elas também seriam usadas se um operador não especificar as credenciais de recuperação distribuída como parte de `START GROUP_REPLICATION`(start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement").

#### 20.6.3.2 Conexões de Camada de Soquete Segura (SSL) para Recuperação Distribuída

Importante

Quando se utiliza a pilha de comunicação MySQL (`group_replication_communication_stack=MYSQL`) E conexões seguras entre membros (`group_replication_ssl_mode` não está configurada para `DISABLED`), as configurações de segurança discutidas nesta seção são aplicadas não apenas a conexões de recuperação distribuídas, mas também às comunicações de grupo entre membros em geral. Veja a Seção 20.6.1, “Pilha de Comunicação para Gerenciamento de Segurança de Conexão”.

Se a conexão de recuperação distribuída for feita usando a conexão padrão do cliente SQL ou um ponto de recuperação distribuído, para configurar a conexão de forma segura, você pode usar as opções de SSL dedicadas para recuperação distribuída do Grupo de Replicação. Essas opções correspondem às opções de SSL do servidor que são usadas para conexões de comunicação de grupo, mas elas são aplicadas apenas para conexões de recuperação distribuída. Por padrão, as conexões de recuperação distribuída não usam SSL, mesmo que você tenha ativado SSL para conexões de comunicação de grupo, e as opções de SSL do servidor não são aplicadas para conexões de recuperação distribuída. Você deve configurar essas conexões separadamente.

Se uma operação de clonagem remota for usada como parte da recuperação distribuída, a Replicação por Grupo configura automaticamente as opções de SSL do plugin de clonagem para corresponder às suas configurações para as opções de SSL de recuperação distribuída. (Para detalhes sobre como o plugin de clonagem usa SSL, consulte Configurando uma conexão criptografada para clonagem.)

As opções de recuperação distribuída SSL são as seguintes:

* `group_replication_recovery_use_ssl`: Defina para `ON` para que a Replicação em Grupo use SSL para conexões de recuperação distribuídas, incluindo operações de clonagem remota e transferência de estado de um log binário de um doador. Se o servidor ao qual você se conecta não usa a configuração padrão para isso (consulte Seção 8.3.1, “Configurando o MySQL para usar conexões criptografadas”), use as outras opções de recuperação distribuída SSL para determinar quais certificados e suítes de cifra usar.

* `group_replication_recovery_ssl_ca`: O nome do caminho do arquivo da Autoridade de Certificação (CA) a ser usado para conexões de recuperação distribuídas. A Replicação em grupo configura automaticamente a opção de clone SSL `clone_ssl_ca` para corresponder a isso.

`group_replication_recovery_ssl_capath`: O nome do caminho de um diretório que contém arquivos de certificado de autoridade de certificação SSL (CA) confiável.

* `group_replication_recovery_ssl_cert`: O nome do caminho do arquivo de certificado da chave pública SSL a ser usado para conexões de recuperação distribuída. A Replicação em grupo configura automaticamente a opção de clone SSL `clone_ssl_cert` para corresponder a isso.

* `group_replication_recovery_ssl_key`: O nome do caminho do arquivo da chave privada SSL a ser usado para conexões de recuperação distribuída. A Replicação em grupo configura automaticamente a opção de clone SSL `clone_ssl_cert` para corresponder a isso.

* `group_replication_recovery_ssl_verify_server_cert`: Faz com que a verificação da conexão de recuperação distribuída verifique o valor do Nome Comum do servidor no certificado enviado pelo doador. Definir esta opção para `ON` é o equivalente para conexões de recuperação distribuída para definir `VERIFY_IDENTITY` para a opção `group_replication_ssl_mode` para conexões de comunicação de grupo.

* `group_replication_recovery_ssl_crl`: O nome do caminho de um arquivo que contém listas de revogação de certificados.

* `group_replication_recovery_ssl_crlpath`: O nome do caminho de um diretório que contém listas de revogação de certificados.

* `group_replication_recovery_ssl_cipher`: Uma lista de cifras permitidas para criptografia de conexão para a conexão de recuperação distribuída. Especifique uma lista de um ou mais nomes de cifra, separados por colchetes. Para informações sobre quais cifras de criptografia o MySQL suporta, consulte a Seção 8.3.2, “Protocolos e cifras de conexão criptografada TLS”.

* `group_replication_recovery_tls_version`: Uma lista de vírgulas de um ou mais protocolos TLS permitidos para criptografia de conexão quando essa instância do servidor é o cliente na conexão de recuperação distribuída, ou seja, o membro que está se juntando. O padrão para essa variável do sistema depende das versões do protocolo TLS suportadas na versão do MySQL Server. Os membros do grupo envolvidos em cada conexão de recuperação distribuída, como cliente (membro que está se juntando) e servidor (doador), negociam a versão mais alta do protocolo que ambos estão configurados para suportar. Essa variável do sistema está disponível a partir do MySQL 8.0.19.

* `group_replication_recovery_tls_ciphersuites`: Uma lista de um ou mais cifragem permitidas, separadas por ponto e vírgula, quando o TLSv1.3 é usado para criptografia de conexão para a conexão de recuperação distribuída, e esta instância do servidor é o cliente na conexão de recuperação distribuída, ou seja, o membro que está se juntando. Se esta variável do sistema for definida como `NULL` quando o TLSv1.3 é usado (o que é o padrão se você não definir a variável do sistema), as cifragem que são habilitadas por padrão são permitidas, conforme listado na Seção 8.3.2, “Protocolos e cifragem de conexão criptografada”. Se esta variável do sistema for definida como a string vazia, nenhuma cifragem é permitida e, portanto, o TLSv1.3 não é usado. Esta variável do sistema está disponível a partir do MySQL 8.0.19.

### 20.6.4 Permissões de endereço IP de replicação de grupo

Quando e somente quando a pilha de comunicação XCom é usada para estabelecer comunicações em grupo (`group_replication_communication_stack=XCOM`), o plugin de Replicação de Grupo permite que você especifique uma lista de permissão de hosts a partir da qual uma conexão de Sistema de Comunicação em Grupo recebida pode ser aceita. Se você especificar uma lista de permissão em um servidor s1, então quando o servidor s2 está estabelecendo uma conexão com s1 com o propósito de envolver comunicação em grupo, s1 verifica primeiro a lista de permissão antes de aceitar a conexão de s2. Se s2 estiver na lista de permissão, então s1 aceita a tentativa de conexão por s2, caso contrário, s1 rejeita a tentativa de conexão por s2. A partir do MySQL 8.0.22, a variável de sistema `group_replication_ip_allowlist` é usada para especificar a lista de permissão, e para versões anteriores do MySQL 8.0.22, a variável de sistema `group_replication_ip_whitelist` é usada. A nova variável de sistema funciona da mesma maneira que a antiga variável de sistema, apenas a terminologia mudou.

Nota

Quando a pilha de comunicação MySQL é usada para estabelecer comunicações em grupo (`group_replication_communication_stack=MYSQL`), as configurações para `group_replication_ip_allowlist` e `group_replication_ip_whitelist` são ignoradas. Veja a Seção 20.6.1, “Pilha de Comunicação para Gerenciamento de Segurança de Conexão”.

Se você não especificar explicitamente uma lista de permissão, o motor de comunicação de grupo (XCom) analisa automaticamente as interfaces ativas no host e identifica aquelas com endereços em sub-redes privadas, juntamente com a máscara de sub-rede configurada para cada interface. Esses endereços, e o endereço IP `localhost` para IPv4 e (a partir do MySQL 8.0.14) IPv6 são usados para criar uma lista de permissão automática de Replicação de Grupo. Portanto, a lista de permissão automática inclui quaisquer endereços IP que sejam encontrados para o host nos seguintes intervalos após a máscara de sub-rede apropriada ter sido aplicada:

```
IPv4 (as defined in RFC 1918)
10/8 prefix       (10.0.0.0 - 10.255.255.255) - Class A
172.16/12 prefix  (172.16.0.0 - 172.31.255.255) - Class B
192.168/16 prefix (192.168.0.0 - 192.168.255.255) - Class C

IPv6 (as defined in RFC 4193 and RFC 5156)
fc00:/7 prefix    - unique-local addresses
fe80::/10 prefix  - link-local unicast addresses

127.0.0.1 - localhost for IPv4
::1       - localhost for IPv6
```

Uma entrada é adicionada ao log de erro, indicando os endereços que foram permitidos automaticamente para o host.

A lista automática de endereços privados não pode ser usada para conexões de servidores externos à rede privada, portanto, um servidor, mesmo que tenha interfaces em IPs públicos, não permite, por padrão, conexões de Replicação de Grupo de hosts externos. Para conexões de Replicação de Grupo entre instâncias de servidor que estão em máquinas diferentes, você deve fornecer endereços de IP público e especiá-los como uma lista explícita de permissão. Se você especificar qualquer entrada na lista de permissão, os endereços privados e `localhost` não são adicionados automaticamente, portanto, se você usar qualquer um desses, deve especiá-los explicitamente.

Para especificar uma lista de permissão manualmente, use a variável de sistema `group_replication_ip_allowlist` (MySQL 8.0.22 e posterior) ou `group_replication_ip_whitelist`. Antes do MySQL 8.0.24, você não pode alterar a lista de permissão em um servidor enquanto ele é um membro ativo de um grupo de replicação. Se o membro estiver ativo, você deve executar `STOP GROUP_REPLICATION` antes de alterar a lista de permissão, e [`START GROUP_REPLICATION`](start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement") depois. A partir do MySQL 8.0.24, você pode alterar a lista de permissão enquanto a Replicação por Grupo está em execução.

A allowlist deve conter o endereço IP ou o nome de host que é especificado na variável de sistema `group_replication_local_address` de cada membro. Este endereço não é o mesmo que o host e o protocolo SQL do servidor MySQL, e não é especificado na variável de sistema `bind_address` para a instância do servidor. Se um nome de host usado como endereço local de Replicação de Grupo para uma instância de servidor resolver tanto um endereço IPv4 quanto um IPv6, o endereço IPv4 é preferido para as conexões de Replicação de Grupo.

Os endereços IP especificados como pontos finais de recuperação distribuída e o endereço IP da conexão padrão do cliente SQL do membro, se este for usado para recuperação distribuída (que é o padrão), não precisam ser adicionados à lista de permissão. A lista de permissão é apenas para o endereço especificado por `group_replication_local_address` para cada membro. Um membro que se junta deve ter sua conexão inicial com o grupo permitida pela lista de permissão para recuperar o endereço ou endereços para recuperação distribuída.

Na lista de permissão, você pode especificar qualquer combinação dos seguintes itens:

* Endereços IPv4 (por exemplo, `198.51.100.44`) * Endereços IPv4 com notação CIDR (por exemplo, `192.0.2.21/24`)

* Endereços IPv6, a partir do MySQL 8.0.14 (por exemplo, `2001:db8:85a3:8d3:1319:8a2e:370:7348`)

* Endereços IPv6 com notação CIDR, a partir do MySQL 8.0.14 (por exemplo, `2001:db8:85a3:8d3::/64`)

* Nomes de hospedagem (por exemplo, `example.org`) * Nomes de hospedagem com notação CIDR (por exemplo, `www.example.com/24`)

Antes do MySQL 8.0.14, os nomes de host só podiam resolver para endereços IPv4. A partir do MySQL 8.0.14, os nomes de host podem resolver para endereços IPv4, endereços IPv6 ou ambos. Se um nome de host resolver para ambos um endereço IPv4 e um endereço IPv6, o endereço IPv4 é sempre usado para conexões de Replicação de Grupo. Você pode usar a notação CIDR em combinação com nomes de host ou endereços IP para permitir um bloco de endereços IP com um prefixo de rede particular, mas certifique-se de que todos os endereços IP na sub-rede especificada estejam sob seu controle.

Nota

Quando uma tentativa de conexão de um endereço IP é recusada porque o endereço não está na lista de permissão, a mensagem de recusa sempre imprime o endereço IP no formato IPv6. Os endereços IPv4 são precedidos por `::ffff:` neste formato (um endereço IPv6 mapeado para IPv4). Você não precisa usar este formato para especificar endereços IPv4 na lista de permissão; use o formato padrão IPv4 para eles.

Uma vírgula deve separar cada entrada na allowlist. Por exemplo:

```
mysql> SET GLOBAL group_replication_ip_allowlist="192.0.2.21/24,198.51.100.44,203.0.113.0/24,2001:db8:85a3:8d3:1319:8a2e:370:7348,example.org,www.example.com/24";
```

Para se juntar a um grupo de replicação, um servidor precisa ser permitido no membro inicial que o faz o pedido para se juntar ao grupo. Tipicamente, este seria o membro de bootstrap para o grupo de replicação, mas pode ser qualquer um dos servidores listados pela opção `group_replication_group_seeds` na configuração para o servidor que se junta ao grupo. Se algum dos membros iniciais do grupo estiver listado na opção `group_replication_group_seeds` com um endereço IPv6 quando um membro que se junta tem um IPv4 `group_replication_local_address`, ou vice-versa, você também deve configurar e permitir um endereço alternativo para o membro que se junta para o protocolo oferecido pelo membro inicial (ou um nome de host que resolva para um endereço para esse protocolo). Isso ocorre porque, quando um servidor se junta a um grupo de replicação, ele deve fazer o contato inicial com o membro inicial usando o protocolo que o membro inicial anuncia na opção `group_replication_group_seeds`, seja IPv4 ou IPv6. Se um membro que se junta não tiver um endereço permitido para o protocolo apropriado, sua tentativa de conexão é recusada. Para mais informações sobre a gestão de grupos de replicação mistos de IPv4 e IPv6, consulte a Seção 20.5.5, “Suporte para IPv6 e para Grupos Mistas de IPv6 e IPv4”.

Quando um grupo de replicação é reconfigurado (por exemplo, quando um novo primário é eleito ou um membro se junta ou sai), os membros do grupo reestabelecem conexões entre si. Se um membro do grupo só é permitido por servidores que não fazem mais parte do grupo de replicação após a reconfiguração, ele não consegue se reconectar aos servidores restantes do grupo de replicação que não o permitem. Para evitar esse cenário completamente, especifique a mesma lista de permissão para todos os servidores que são membros do grupo de replicação.

Nota

É possível configurar diferentes listas de permissão em diferentes membros do grupo de acordo com os requisitos de segurança que você deseja, por exemplo, para manter diferentes sub-redes separadas. Se você precisar configurar diferentes listas de permissão para atender aos seus requisitos de segurança, certifique-se de que há uma sobreposição suficiente entre as listas de permissão no grupo de replicação para maximizar a possibilidade de os servidores poderem se reconectar na ausência de seu membro original de semente.

Para os nomes de host, a resolução de nomes ocorre apenas quando um pedido de conexão é feito por outro servidor. Um nome de host que não pode ser resolvido não é considerado para validação na lista de permissão, e uma mensagem de aviso é escrita no log de erro. A verificação de DNS reversa confirmada (FCrDNS) é realizada para nomes de host resolvidos.

Aviso

Os nomes de host são inerentemente menos seguros do que os endereços IP em uma lista de permissão. A verificação FCrDNS oferece um bom nível de proteção, mas pode ser comprometida por certos tipos de ataque. Especifique nomes de host em sua lista de permissão apenas quando estritamente necessário e garanta que todos os componentes usados para resolução de nomes, como servidores DNS, estejam sob seu controle. Você também pode implementar a resolução de nomes localmente usando o arquivo hosts, para evitar o uso de componentes externos.