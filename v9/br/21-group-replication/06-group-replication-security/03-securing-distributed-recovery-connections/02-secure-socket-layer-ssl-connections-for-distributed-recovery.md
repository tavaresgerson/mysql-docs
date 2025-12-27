#### 20.6.3.2 Conexões SSL (Secure Socket Layer) para Recuperação Distribuída

Importante

Ao usar a pilha de comunicação MySQL (`group_replication_communication_stack=MYSQL`) E conexões seguras entre os membros (`group_replication_ssl_mode` não está definido como `DISABLED`), as configurações de segurança discutidas nesta seção são aplicadas não apenas às conexões de recuperação distribuída, mas às comunicações em grupo entre os membros em geral. Consulte a Seção 20.6.1, “Pilha de Comunicação para Gerenciamento de Segurança de Conexão”.

Se a conexão de recuperação distribuída for feita usando a conexão padrão do cliente SQL ou um ponto final de recuperação distribuída, para configurar a conexão de forma segura, você pode usar as opções dedicadas de SSL para recuperação distribuída do Grupo de Replicação. Essas opções correspondem às opções SSL do servidor que são usadas para conexões de comunicação em grupo, mas elas são aplicadas apenas para conexões de recuperação distribuída. Por padrão, as conexões de recuperação distribuída não usam SSL, mesmo que você tenha ativado SSL para conexões de comunicação em grupo, e as opções SSL do servidor não são aplicadas para conexões de recuperação distribuída. Você deve configurar essas conexões separadamente.

Se uma operação de clonagem remota for usada como parte da recuperação distribuída, o Grupo de Replicação configura automaticamente as opções SSL do plugin de clonagem para corresponder às suas configurações para as opções SSL de recuperação distribuída. (Para detalhes de como o plugin de clonagem usa SSL, consulte Configurando uma Conexão Encriptada para Clonagem.)

As opções SSL de recuperação distribuída são as seguintes:

* `group_replication_recovery_use_ssl`: Defina para `ON` para fazer com que a Replicação em Grupo use SSL para conexões de recuperação distribuídas, incluindo operações de clonagem remota e transferência de estado de um log binário de um doador. Se o servidor ao qual você se conecta não usar a configuração padrão para isso (veja a Seção 8.3.1, “Configurando o MySQL para usar conexões criptografadas”), use as outras opções de recuperação distribuída SSL para determinar quais certificados e suítes de criptografia usar.

* `group_replication_recovery_ssl_ca`: O nome do caminho do arquivo da Autoridade de Certificação (CA) a ser usado para conexões de recuperação distribuídas. A Replicação em Grupo configura automaticamente a opção de SSL de clonagem `clone_ssl_ca` para corresponder a isso.

  `group_replication_recovery_ssl_capath`: O nome do caminho de um diretório que contém arquivos de certificado de autoridade de certificação (CA) de certificados confiáveis.

* `group_replication_recovery_ssl_cert`: O nome do caminho do arquivo de certificado da chave pública SSL a ser usado para conexões de recuperação distribuídas. A Replicação em Grupo configura automaticamente a opção de SSL de clonagem `clone_ssl_cert` para corresponder a isso.

* `group_replication_recovery_ssl_key`: O nome do caminho do arquivo de chave privada SSL a ser usado para conexões de recuperação distribuídas. A Replicação em Grupo configura automaticamente a opção de SSL de clonagem `clone_ssl_cert` para corresponder a isso.

* `group_replication_recovery_ssl_verify_server_cert`: Faz com que a conexão de recuperação distribuída verifique o valor do Nome Comum do servidor no certificado enviado pelo doador. Definir essa opção para `ON` é o equivalente para conexões de recuperação distribuída de definir `VERIFY_IDENTITY` para a opção `group_replication_ssl_mode` para conexões de comunicação em grupo.

* `group_replication_recovery_ssl_crl`: O nome do caminho de um arquivo que contém listas de revogação de certificados.

* `group_replication_recovery_ssl_crlpath`: O nome do caminho de um diretório que contém listas de revogação de certificados.

* `group_replication_recovery_ssl_cipher`: Uma lista de cifrares permitidos para a criptografia de conexão para a conexão de recuperação distribuída. Especifique uma lista de um ou mais nomes de cifrares, separados por colchetes. Para obter informações sobre os cifrares de criptografia suportados pelo MySQL, consulte a Seção 8.3.2, “Protocolos e cifrares TLS de conexão criptografada”.

* `group_replication_recovery_tls_version`: Uma lista separada por vírgulas de um ou mais protocolos TLS permitidos para a criptografia de conexão quando essa instância do servidor é o cliente na conexão de recuperação distribuída, ou seja, o membro que se junta. O valor padrão desta variável de sistema depende das versões dos protocolos TLS suportadas na versão do MySQL Server. Os membros do grupo envolvidos em cada conexão de recuperação distribuída como cliente (membro que se junta) e servidor (doador) negociam a versão de protocolo mais alta que ambos estão configurados para suportar.

* `group_replication_recovery_tls_ciphersuites`: Uma lista separada por colchetes de um ou mais cifrares permitidos quando o TLSv1.3 é usado para a criptografia de conexão na conexão de recuperação distribuída, e essa instância do servidor é o cliente na conexão de recuperação distribuída, ou seja, o membro que se junta. Se esta variável de sistema for definida como `NULL` quando o TLSv1.3 for usado (o que é o padrão se você não definir a variável de sistema), as cifrares habilitadas por padrão são permitidas, conforme listadas na Seção 8.3.2, “Protocolos e cifrares TLS de conexão criptografada”. Se esta variável de sistema for definida como uma string vazia, nenhuma suite de cifrares é permitida, e o TLSv1.3, portanto, não é usado.