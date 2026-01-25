## 6.3 Usando Conexões Criptografadas

[6.3.1 Configurando o MySQL para Usar Conexões Criptografadas](using-encrypted-connections.html)

[6.3.2 Protocolos TLS e Ciphers de Conexão Criptografada](encrypted-connection-protocols-ciphers.html)

[6.3.3 Criando Certificates e Keys SSL e RSA](creating-ssl-rsa-files.html)

[6.3.4 Capacidades Dependentes da Library SSL](ssl-libraries.html)

[6.3.5 Conectando-se ao MySQL Remotamente a Partir do Windows com SSH](windows-and-ssh.html)

Com uma conexão não criptografada entre o client MySQL e o server, alguém com acesso à rede poderia monitorar todo o seu tráfego e inspecionar os dados sendo enviados ou recebidos entre o client e o server.

Quando você precisa mover informações por uma rede de forma segura, uma conexão não criptografada é inaceitável. Para tornar qualquer tipo de dado ilegível, use encryption. Os algoritmos de encryption devem incluir elementos de segurança para resistir a muitos tipos de ataques conhecidos, como a alteração da ordem das mensagens criptografadas ou a repetição de dados duas vezes (replaying).

O MySQL suporta conexões criptografadas entre clients e o server usando o protocolo TLS (Transport Layer Security). O TLS é às vezes referido como SSL (Secure Sockets Layer), mas o MySQL, na verdade, não usa o protocolo SSL para conexões criptografadas devido à sua encryption ser fraca (veja [Seção 6.3.2, “Protocolos TLS e Ciphers de Conexão Criptografada”](encrypted-connection-protocols-ciphers.html "6.3.2 Encrypted Connection TLS Protocols and Ciphers")).

O TLS usa algoritmos de encryption para garantir que os dados recebidos por uma rede pública possam ser confiáveis. Ele possui mecanismos para detectar alteração, perda ou repetição (replay) de dados. O TLS também incorpora algoritmos que fornecem verificação de identidade usando o padrão X.509.

O X.509 torna possível identificar alguém na Internet. Em termos básicos, deve existir alguma entidade chamada “Certificate Authority” (ou CA) que atribui certificates eletrônicos a quem precisar deles. Os Certificates dependem de algoritmos de encryption assimétrica que possuem duas encryption keys (uma public key e uma secret key). O proprietário de um certificate pode apresentá-lo a terceiros como prova de identidade. Um certificate consiste na public key de seu proprietário. Quaisquer dados criptografados usando esta public key só podem ser descriptografados usando a secret key correspondente, que é mantida pelo proprietário do certificate.

O MySQL pode ser compilado para suporte a conexões criptografadas usando OpenSSL ou yaSSL. Para uma comparação dos dois pacotes, veja [Seção 6.3.4, “Capacidades Dependentes da Library SSL”](ssl-libraries.html "6.3.4 SSL Library-Dependent Capabilities"). Para informações sobre os protocolos de encryption e os ciphers que cada pacote suporta, veja [Seção 6.3.2, “Protocolos TLS e Ciphers de Conexão Criptografada”](encrypted-connection-protocols-ciphers.html "6.3.2 Encrypted Connection TLS Protocols and Ciphers").

Nota

É possível compilar o MySQL usando yaSSL como alternativa ao OpenSSL apenas antes do MySQL 5.7.28. A partir do MySQL 5.7.28, o suporte ao yaSSL foi removido e todas as builds do MySQL usam OpenSSL.

Por padrão, os programas MySQL tentam conectar-se usando encryption se o server suportar conexões criptografadas, retornando a uma conexão não criptografada caso uma conexão criptografada não possa ser estabelecida. Para informações sobre options que afetam o uso de conexões criptografadas, veja [Seção 6.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”](using-encrypted-connections.html "6.3.1 Configuring MySQL to Use Encrypted Connections") e [Opções de Comando para Conexões Criptografadas](connection-options.html#encrypted-connection-options "Command Options for Encrypted Connections").

O MySQL realiza a encryption por conexão, e o uso de encryption para um determinado user pode ser opcional ou obrigatório. Isso permite que você escolha uma conexão criptografada ou não criptografada de acordo com os requisitos de aplicações individuais. Para informações sobre como exigir que os users utilizem conexões criptografadas, veja a discussão da cláusula `REQUIRE` do comando [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") em [Seção 13.7.1.2, “CREATE USER Statement”](create-user.html "13.7.1.2 CREATE USER Statement"). Veja também a descrição da variável de sistema [`require_secure_transport`](server-system-variables.html#sysvar_require_secure_transport) em [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

Conexões criptografadas podem ser usadas entre servers source e replica. Veja [Seção 16.3.8, “Configurando a Replication para Usar Conexões Criptografadas”](replication-encrypted-connections.html "16.3.8 Setting Up Replication to Use Encrypted Connections").

Para informações sobre o uso de conexões criptografadas a partir da MySQL C API, veja [Suporte para Conexões Criptografadas](/doc/c-api/5.7/en/c-api-encrypted-connections.html).

Também é possível conectar-se usando encryption de dentro de uma conexão SSH com o host do server MySQL. Para um exemplo, veja [Seção 6.3.5, “Conectando-se ao MySQL Remotamente a Partir do Windows com SSH”](windows-and-ssh.html "6.3.5 Connecting to MySQL Remotely from Windows with SSH").

Diversas melhorias foram feitas no suporte a conexões criptografadas no MySQL 5.7. A linha do tempo a seguir resume as alterações:

* 5.7.3: No lado do client, uma option explícita [`--ssl`](connection-options.html#option_general_ssl) não é mais consultiva, mas prescritiva. Dado um server habilitado para suportar conexões criptografadas, um programa client pode exigir uma conexão criptografada especificando apenas a option [`--ssl`](connection-options.html#option_general_ssl). (Anteriormente, era necessário que o client especificasse a option [`--ssl-ca`](connection-options.html#option_general_ssl-ca), ou todas as três options: [`--ssl-ca`](connection-options.html#option_general_ssl-ca), [`--ssl-key`](connection-options.html#option_general_ssl-key) e [`--ssl-cert`](connection-options.html#option_general_ssl-cert).) A tentativa de conexão falha se uma conexão criptografada não puder ser estabelecida. Outras options `--ssl-xxx` no lado do client são consultivas na ausência de [`--ssl`](connection-options.html#option_general_ssl): O client tenta conectar-se usando encryption, mas retorna a uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida.

* 5.7.5: O valor da option [`--ssl`](server-options.html#option_mysqld_ssl) do lado do server é habilitado por padrão.

  Para servers compilados usando OpenSSL, as variáveis de sistema [`auto_generate_certs`](server-system-variables.html#sysvar_auto_generate_certs) e [`sha256_password_auto_generate_rsa_keys`](server-system-variables.html#sysvar_sha256_password_auto_generate_rsa_keys) estão disponíveis para habilitar a autogeração e a autodiscovery de files de certificate e key SSL/RSA na inicialização (startup). Para autodiscovery de certificate e key, se [`--ssl`](server-options.html#option_mysqld_ssl) estiver habilitado e outras options `--ssl-xxx` *não* forem fornecidas para configurar conexões criptografadas explicitamente, o server tenta habilitar o suporte a conexões criptografadas automaticamente na inicialização se descobrir os files de certificate e key necessários no data directory.

* 5.7.6: O utilitário [**mysql_ssl_rsa_setup**](mysql-ssl-rsa-setup.html "4.4.5 mysql_ssl_rsa_setup — Create SSL/RSA Files") está disponível para facilitar a geração manual de files de certificate e key SSL/RSA. A autodiscovery de files SSL/RSA na inicialização é expandida para se aplicar a todos os servers, sejam eles compilados usando OpenSSL ou yaSSL. (Isso significa que [`auto_generate_certs`](server-system-variables.html#sysvar_auto_generate_certs) não precisa estar habilitada para que a autodiscovery ocorra.)

  Se o server descobrir na inicialização que o CA certificate é self-signed, ele grava um warning no error log. (O certificate é self-signed se criado automaticamente pelo server, ou manualmente usando [**mysql_ssl_rsa_setup**](mysql-ssl-rsa-setup.html "4.4.5 mysql_ssl_rsa_setup — Create SSL/RSA Files").)

* 5.7.7: A C client library tenta estabelecer uma conexão criptografada por padrão se o server suportar conexões criptografadas. Isso afeta os programas client da seguinte forma:

  + Na ausência de uma option [`--ssl`](connection-options.html#option_general_ssl), os clients tentam conectar-se usando encryption, retornando a uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida.

  + A presença de uma option explícita [`--ssl`](connection-options.html#option_general_ssl) ou um sinônimo ([`--ssl=1`](connection-options.html#option_general_ssl), [`--enable-ssl`](connection-options.html#option_general_ssl)) é prescritiva: Os clients exigem uma conexão criptografada e falham se uma não puder ser estabelecida.

  + Com uma option [`--ssl=0`](connection-options.html#option_general_ssl) ou um sinônimo ([`--skip-ssl`](connection-options.html#option_general_ssl), [`--disable-ssl`](connection-options.html#option_general_ssl)), os clients usam uma conexão não criptografada.

  Esta mudança também afeta releases subsequentes dos MySQL Connectors que são baseados na C client library: Connector/C++ e Connector/ODBC.

* 5.7.8: A variável de sistema [`require_secure_transport`](server-system-variables.html#sysvar_require_secure_transport) está disponível para controlar se as conexões client com o server devem usar alguma forma de secure transport.

* 5.7.10: O suporte ao protocolo TLS é estendido do TLSv1 para incluir também TLSv1.1 e TLSv1.2. A variável de sistema [`tls_version`](server-system-variables.html#sysvar_tls_version) no lado do server e a option [`--tls-version`](connection-options.html#option_general_tls-version) no lado do client permitem que o nível de suporte seja selecionado. Veja [Seção 6.3.2, “Protocolos TLS e Ciphers de Conexão Criptografada”](encrypted-connection-protocols-ciphers.html "6.3.2 Encrypted Connection TLS Protocols and Ciphers").

* 5.7.11: Os programas client MySQL suportam uma option [`--ssl-mode`](connection-options.html#option_general_ssl-mode) que permite especificar o estado de segurança da conexão com o server. A option [`--ssl-mode`](connection-options.html#option_general_ssl-mode) abrange as capacidades das options do lado do client [`--ssl`](connection-options.html#option_general_ssl) e [`--ssl-verify-server-cert`](connection-options.html#option_general_ssl-verify-server-cert). Consequentemente, [`--ssl`](connection-options.html#option_general_ssl) e [`--ssl-verify-server-cert`](connection-options.html#option_general_ssl-verify-server-cert) são depreciadas e serão removidas no MySQL 8.0.

* 5.7.28: O suporte ao yaSSL é removido. Todas as builds do MySQL usam OpenSSL.

* 5.7.35: Os protocolos TLSv1 e TLSv1.1 são depreciados.