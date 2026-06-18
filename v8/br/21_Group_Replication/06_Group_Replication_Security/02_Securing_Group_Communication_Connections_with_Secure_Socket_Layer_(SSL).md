### 20.6.2 Segurança das conexões de comunicação do grupo com Secure Socket Layer (SSL)

As conexões de sockets seguros podem ser usadas para conexões de comunicação em grupo entre os membros de um grupo.

A variável do sistema de replicação em grupo `group_replication_ssl_mode` é usada para ativar o uso do SSL para conexões de comunicação em grupo e especificar o modo de segurança para as conexões. Esse valor deve ser o mesmo em todos os membros do grupo; se for diferente, alguns membros podem não conseguir se juntar ao grupo. O ajuste padrão significa que o SSL não é usado. Essa variável tem os seguintes valores possíveis:

**Tabela 20.1 Valores de configuração do modo grupo\_replication\_ssl**

<table summary="Lista os possíveis valores para o grupo_replication_ssl_mode e descreve seu efeito sobre a forma como os membros do grupo de replicação se conectam entre si."><thead><tr> <th>Valor</th> <th><p>Descrição</p></th> </tr></thead><tbody><tr> <td>[[<code>DISABLED</code>]]</td> <td><p>Estabeleça uma conexão não criptografada (padrão).</p></td> </tr><tr> <td>[[<code>REQUIRED</code>]]</td> <td><p>Estabeleça uma conexão segura, se o servidor suportar conexões seguras.</p></td> </tr><tr> <td>[[<code>VERIFY_CA</code>]]</td> <td><p>Como [[<code>REQUIRED</code>]], mas, além disso, verifique o certificado TLS do servidor contra os certificados da Autoridade de Certificação (CA) configurados.</p></td> </tr><tr> <td>[[<code>VERIFY_IDENTITY</code>]]</td> <td><p>Como [[<code>VERIFY_CA</code>]], mas, além disso, verifique se o certificado do servidor corresponde ao host ao qual a conexão é tentada.</p></td> </tr></tbody></table>

Se o SSL for usado, o meio para configurar a conexão segura depende se o XCom ou a pilha de comunicação MySQL é usada para comunicação em grupo (há uma escolha entre os dois desde o MySQL 8.0.27).

**Ao usar a pilha de comunicação XCom (`group_replication_communication_stack=XCOM`):** O restante da configuração para as conexões de comunicação de grupo da Replicação em Grupo é obtido da configuração SSL do servidor. Para obter mais informações sobre as opções de configuração do SSL do servidor, consulte Opções de comando para conexões criptografadas. As opções SSL do servidor que são aplicadas às conexões de comunicação de grupo da Replicação em Grupo são as seguintes:

**Tabela 20.2 Opções SSL**

<table summary="Lista as opções de configuração do servidor para SSL e descreve seu efeito na configuração do plugin de replicação de grupo para SSL."><thead><tr> <th>Configuração do servidor</th> <th>Descrição</th> </tr></thead><tbody><tr> <td>[[<code>ssl_key</code>]]</td> <td>O nome do caminho do arquivo de chave privada SSL no formato PEM. No lado do cliente, esta é a chave privada do cliente. No lado do servidor, esta é a chave privada do servidor.</td> </tr><tr> <td>[[<code>ssl_cert</code>]]</td> <td>O nome do caminho do arquivo de certificado da chave pública SSL no formato PEM. No lado do cliente, este é o certificado da chave pública do cliente. No lado do servidor, este é o certificado da chave pública do servidor.</td> </tr><tr> <td>[[<code>ssl_ca</code>]]</td> <td>O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA) no formato PEM.</td> </tr><tr> <td>[[<code>ssl_capath</code>]]</td> <td>O nome do caminho do diretório que contém os arquivos de certificado da autoridade de certificação SSL (CA) confiável no formato PEM.</td> </tr><tr> <td>[[<code>ssl_crl</code>]]</td> <td>O nome do caminho do arquivo que contém as listas de revogação de certificados no formato PEM.</td> </tr><tr> <td>[[<code>ssl_crlpath</code>]]</td> <td>O nome do caminho do diretório que contém os arquivos da lista de revogação de certificados no formato PEM.</td> </tr><tr> <td>[[<code>ssl_cipher</code>]]</td> <td>Uma lista de cifra permitida para conexões criptografadas.</td> </tr><tr> <td>[[<code>tls_version</code>]]</td> <td>Uma lista dos protocolos TLS que o servidor permite para conexões criptografadas.</td> </tr><tr> <td>[[<code>tls_ciphersuites</code>]]</td> <td>Quais as suites de cifra TLSv1.3 que o servidor permite para conexões criptografadas.</td> </tr></tbody></table>

Importante

- O suporte aos protocolos de conexão TLSv1 e TLSv1.1 foi removido do MySQL Server a partir do MySQL 8.0.28. Os protocolos foram descontinuados a partir do MySQL 8.0.26, embora os clientes do MySQL Server, incluindo as instâncias do servidor de replicação de grupo que atuam como clientes, não retornem avisos ao usuário se uma versão de protocolo TLS descontinuada for usada. Consulte a Remoção do Suporte aos Protocolos TLSv1 e TLSv1.1 para obter mais informações.

- O suporte ao protocolo TLSv1.3 está disponível no MySQL Server a partir do MySQL 8.0.16, desde que o MySQL Server tenha sido compilado com o OpenSSL 1.1.1. O servidor verifica a versão do OpenSSL no momento do início, e se for menor que 1.1.1, o TLSv1.3 é removido do valor padrão das variáveis do sistema do servidor relacionadas às versões do TLS (incluindo a variável de sistema `group_replication_recovery_tls_version`).

- A replicação em grupo suporta TLSv1.3 a partir do MySQL 8.0.18. No MySQL 8.0.16 e no MySQL 8.0.17, se o servidor suportar TLSv1.3, o protocolo não é suportado no motor de comunicação em grupo e não pode ser usado pela replicação em grupo.

- No MySQL 8.0.18, o TLSv1.3 pode ser usado na Replicação por Grupo para a conexão de recuperação distribuída, mas as variáveis de sistema `group_replication_recovery_tls_version` e `group_replication_recovery_tls_ciphersuites` não estão disponíveis. Portanto, os servidores doadores devem permitir o uso de pelo menos um conjunto de criptografia TLSv1.3 habilitado por padrão, conforme listado na Seção 8.3.2, “Protocolos e conjuntos de criptografia TLS de conexão encriptada”. A partir do MySQL 8.0.19, você pode usar as opções para configurar o suporte ao cliente para qualquer seleção de conjuntos de criptografia, incluindo apenas conjuntos de criptografia não padrão, se desejar.

- Na lista de protocolos TLS especificados na variável de sistema `tls_version`, certifique-se de que as versões especificadas estejam contiguas (por exemplo, `TLSv1.2,TLSv1.3`). Se houver lacunas na lista de protocolos (por exemplo, se você especificou `TLSv1,TLSv1.2`, omitindo o TLS 1.1), a Replicação em Grupo pode não conseguir estabelecer conexões de comunicação em grupo.

Em um grupo de replicação, o OpenSSL negocia o uso do protocolo TLS mais alto que é suportado por todos os membros. Um membro que se junta e está configurado para usar apenas TLSv1.3 (`tls_version=TLSv1.3`) não pode se juntar a um grupo de replicação onde qualquer membro existente não suporte TLSv1.3, porque os membros do grupo, nesse caso, estão usando uma versão de protocolo TLS mais baixa. Para que o membro se junte ao grupo, você deve configurar o membro que se junta para permitir também o uso de versões de protocolo TLS mais baixas suportadas pelos membros do grupo existentes. Por outro lado, se um membro que se junta não suporte TLSv1.3, mas os membros do grupo existentes todos o suportam e estão usando essa versão para conexões uns com os outros, o membro pode se juntar se os membros do grupo existentes já permitirem o uso de uma versão de protocolo TLS mais baixa adequada, ou se você configurá-los para fazer isso. Nessa situação, o OpenSSL usa uma versão de protocolo TLS mais baixa para as conexões de cada membro para o membro que se junta. As conexões de cada membro com outros membros existentes continuam a usar o protocolo mais alto disponível que ambos os membros suportam.

A partir do MySQL 8.0.16, você pode alterar a variável de sistema `tls_version` em tempo de execução para alterar a lista de versões de protocolo TLS permitidas para o servidor. Observe que, para a Replicação por Grupo, a instrução `ALTER INSTANCE RELOAD TLS`, que reconfigura o contexto TLS do servidor a partir dos valores atuais das variáveis de sistema que definem o contexto, não altera o contexto TLS para a conexão de comunicação do grupo da Replicação por Grupo enquanto a Replicação por Grupo estiver em execução. Para aplicar a reconfiguração a essas conexões, você deve executar `STOP GROUP_REPLICATION` seguido de `START GROUP_REPLICATION` para reiniciar a Replicação por Grupo nos membros ou membros onde você alterou a variável de sistema `tls_version`. Da mesma forma, se você deseja que todos os membros de um grupo mudem para usar uma versão de protocolo TLS mais alta ou mais baixa, você deve realizar um reinício contínuo da Replicação por Grupo nos membros após alterar a lista de versões de protocolo TLS permitidas, para que o OpenSSL negocie o uso da versão de protocolo TLS mais alta quando o reinício contínuo for concluído. Para obter instruções sobre como alterar a lista de versões de protocolo TLS em tempo de execução, consulte a Seção 8.3.2, “Protocolos e cifra de conexão TLS Encriptada” e Configuração e monitoramento em tempo de execução no lado do servidor para conexões encriptadas.

O exemplo a seguir mostra uma seção de um arquivo `my.cnf` que configura o SSL em um servidor e ativa o SSL para as conexões de comunicação do grupo de replicação de grupo:

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

A declaração `ALTER INSTANCE RELOAD TLS`, que reconfigura o contexto TLS do servidor a partir dos valores atuais das variáveis do sistema que definem o contexto, não altera o contexto TLS das conexões de comunicação do grupo da Replicação em Grupo enquanto a Replicação em Grupo estiver em execução. Para aplicar a reconfiguração a essas conexões, você deve executar `STOP GROUP_REPLICATION` seguido de `START GROUP_REPLICATION` para reiniciar a Replicação em Grupo.

As conexões feitas entre um membro de junção e um membro existente para recuperação distribuída não estão cobertas pelas opções descritas acima. Essas conexões utilizam as opções dedicadas de recuperação distribuída SSL da Replicação em Grupo, que são descritas na Seção 20.6.3.2, "Conexões de Camada de Soquete Segura (SSL) para Recuperação Distribuída" (Conexões para Recuperação Distribuída").

**Ao usar a pilha de comunicação MySQL (group\_replication\_communication\_stack=MYSQL):** As configurações de segurança para a recuperação distribuída do grupo são aplicadas às comunicações normais entre os membros do grupo. Veja a Seção 20.6.3, “Segurança das Conexões de Recuperação Distribuída”, para saber como configurar as configurações de segurança.
