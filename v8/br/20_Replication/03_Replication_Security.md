## 19.3 Segurança da replicação

Para proteger contra o acesso não autorizado aos dados armazenados e transferidos entre os servidores de origem de replicação e as réplicas, configure todos os servidores envolvidos usando as medidas de segurança que você escolheria para qualquer instância do MySQL em sua instalação, conforme descrito no Capítulo 8, *Segurança*. Além disso, para servidores em uma topologia de replicação, considere implementar as seguintes medidas de segurança:

* Configure fontes e réplicas para usar conexões criptografadas para transferir o log binário, que protege esses dados em movimento. A criptografia para essas conexões deve ser ativada usando uma declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`, além de configurar os servidores para suportar conexões de rede criptografadas. Veja a Seção 19.3.1, “Configurando a Replicação para Usar Conexões Criptografadas”.

* Criptografar os arquivos de log binários e os arquivos de log de origem e réplicas, o que protege esses dados em repouso, e também quaisquer dados em uso no cache de log binário. A criptografia de log binário é ativada usando a variável de sistema `binlog_encryption`. Veja a Seção 19.3.2, “Criptografar arquivos de log binários e arquivos de log de origem e réplicas”.

* Aplique verificações de privilégio em aplicadores de replicação, que ajudam a proteger os canais de replicação contra o uso não autorizado ou acidental de operações privilegiadas ou indesejadas. As verificações de privilégio são implementadas configurando uma conta `PRIVILEGE_CHECKS_USER`, que o MySQL usa para verificar se você autorizou cada transação específica para esse canal. Veja a Seção 19.3.3, “Verificações de Privilégio de Replicação”.

Para a Replicação por Grupo, a criptografia do log binário e as verificações de privilégio podem ser usadas como uma medida de segurança nos membros do grupo de replicação. Você também deve considerar criptografar as conexões entre os membros do grupo, que incluem conexões de comunicação de grupo e conexões de recuperação distribuídas, e aplicar a listagem de endereços IP para excluir hosts não confiáveis. Para informações sobre essas medidas de segurança específicas para a Replicação por Grupo, consulte a Seção 20.6, “Segurança da Replicação por Grupo”.

### 19.3.1 Configurando a Replicação para Usar Conexões Encriptadas

Para usar uma conexão criptografada para a transferência do log binário necessário durante a replicação, tanto o servidor de origem quanto o servidor de replicação devem suportar conexões de rede criptografadas. Se qualquer um dos servidores não suportar conexões criptografadas (porque não foi compilado ou configurado para elas), a replicação através de uma conexão criptografada não é possível.

Configurar conexões criptografadas para replicação é semelhante a fazer isso para conexões cliente/servidor. Você deve obter (ou criar) um certificado de segurança adequado que você pode usar na fonte e um certificado semelhante (da mesma autoridade de certificação) em cada replica. Você também deve obter arquivos de chave adequados.

Para obter mais informações sobre a configuração de um servidor e um cliente para conexões criptografadas, consulte a Seção 8.3.1, “Configurando o MySQL para usar conexões criptografadas”.

Para habilitar conexões criptografadas na fonte, você deve criar ou obter os arquivos de certificado e chave adequados, e, em seguida, adicionar os seguintes parâmetros de configuração à seção `[mysqld]` do arquivo fonte `my.cnf`, alterando os nomes dos arquivos conforme necessário:

```
[mysqld]
ssl_ca=cacert.pem
ssl_cert=server-cert.pem
ssl_key=server-key.pem
```

Os caminhos para os arquivos podem ser relativos ou absolutos; recomendamos que você sempre use caminhos completos para esse propósito.

Os parâmetros de configuração são os seguintes:

* `ssl_ca`: O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA). (`ssl_capath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de certificado da CA.)

* `ssl_cert`: O nome do caminho do arquivo de certificado da chave pública do servidor. Este certificado pode ser enviado ao cliente e autenticado contra o certificado da CA que ele possui.

* `ssl_key`: O nome do caminho do arquivo da chave privada do servidor.

Para habilitar conexões criptografadas na replica, use a declaração `CHANGE REPLICATION SOURCE TO` (MySQL 8.0.23 e posterior) ou a declaração `CHANGE MASTER TO` (change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") (anterior ao MySQL 8.0.23).

* Para nomear os arquivos de certificado e chave privada SSL da réplica usando `CHANGE REPLICATION SOURCE TO`(change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") (`CHANGE MASTER TO`(change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement")), adicione as opções apropriadas `SOURCE_SSL_xxx` (`MASTER_SSL_xxx`) assim:

  ```
      -> SOURCE_SSL_CA = 'ca_file_name',
      -> SOURCE_SSL_CAPATH = 'ca_directory_name',
      -> SOURCE_SSL_CERT = 'cert_file_name',
      -> SOURCE_SSL_KEY = 'key_file_name',
  ```

Essas opções correspondem às opções `--ssl-xxx` com os mesmos nomes, conforme descrito nas Opções de comando para conexões criptografadas. Para que essas opções tenham efeito, o `SOURCE_SSL=1` também deve ser definido. Para uma conexão de replicação, especificar um valor para qualquer uma das opções `SOURCE_SSL_CA` ou `SOURCE_SSL_CAPATH` corresponde a definir o `--ssl-mode=VERIFY_CA`. A tentativa de conexão só terá sucesso se um certificado válido da Autoridade de Certificação (CA) for encontrado usando as informações especificadas.

* Para ativar a verificação de identidade do nome do host, adicione a opção `SOURCE_SSL_VERIFY_SERVER_CERT`, assim:

  ```
      -> SOURCE_SSL_VERIFY_SERVER_CERT=1,
  ```

Esta opção corresponde à opção `--ssl-verify-server-cert`, que é descontinuada no MySQL 5.7 e removida no MySQL 8.0. Para uma conexão de replicação, especificar `MASTER_SSL_VERIFY_SERVER_CERT=1` corresponde a definir `--ssl-mode=VERIFY_IDENTITY`, conforme descrito nas Opções de comando para conexões criptografadas. Para que esta opção tenha efeito, também deve ser definida `SOURCE_SSL=1`. A verificação da identidade do nome do host não funciona com certificados autoassinados.

* Para ativar as verificações da lista de revogação de certificados (CRL), adicione a opção `SOURCE_SSL_CRL` ou `SOURCE_SSL_CRLPATH`, conforme mostrado aqui:

  ```
      -> SOURCE_SSL_CRL = 'crl_file_name',
      -> SOURCE_SSL_CRLPATH = 'crl_directory_name',
  ```

Essas opções correspondem às opções `--ssl-xxx` com os mesmos nomes, conforme descrito nas Opções de comando para conexões criptografadas. Se não forem especificadas, nenhuma verificação de CRL será realizada.

* Para especificar listas de cifra, suíte de cifra e protocolos de criptografia permitidos pela replica para a conexão de replicação, use as opções `SOURCE_SSL_CIPHER`, `SOURCE_TLS_VERSION` e `SOURCE_TLS_CIPHERSUITES`, como este:

  ```
      -> SOURCE_SSL_CIPHER = 'cipher_list',
      -> SOURCE_TLS_VERSION = 'protocol_list',
      -> SOURCE_TLS_CIPHERSUITES = 'ciphersuite_list',
  ```

+ A opção `SOURCE_SSL_CIPHER` especifica uma lista de pontos-e-vírgulas de um ou mais cifrados permitidos pela replica para a conexão de replicação.

+ A opção `SOURCE_TLS_VERSION` especifica uma lista de protocolos de criptografia TLS separados por vírgula permitidos pela réplica para a conexão de replicação, em um formato semelhante ao da variável de sistema `tls_version`. O procedimento de conexão negocia o uso da versão mais alta de TLS que tanto a fonte quanto a réplica permitem. Para poder se conectar, a réplica deve ter pelo menos uma versão de TLS em comum com a fonte.

+ A opção `SOURCE_TLS_CIPHERSUITES` (disponível a partir do MySQL 8.0.19) especifica uma lista de colchetes separados por vírgula de uma ou mais suítes de cifra que são permitidas pela replica para a conexão de replicação se o TLSv1.3 for usado para a conexão. Se esta opção for definida como `NULL` quando o TLSv1.3 for usado (o que é o padrão se você não definir a opção), as suítes de cifra habilitadas por padrão são permitidas. Se você definir a opção para uma string vazia, nenhuma suíte de cifra é permitida e, portanto, o TLSv1.3 não é usado.

Os protocolos, cifra e suites de cifra que você pode especificar nessas listas dependem da biblioteca SSL usada para compilar o MySQL. Para informações sobre os formatos, os valores permitidos e os padrões se você não especificar as opções, consulte a Seção 8.3.2, “Protocolos e cifra de conexão criptografada TLS”.

Nota

Nos releases do MySQL 8.0.16 a 8.0.18, o MySQL suporta TLSv1.3, mas a opção `SOURCE_TLS_CIPHERSUITES` não está disponível. Nesses releases, se o TLSv1.3 for usado para conexões entre uma fonte e uma replica, a fonte deve permitir o uso de pelo menos um conjunto de cifras TLSv1.3 que seja habilitado por padrão. A partir do MySQL 8.0.19, você pode usar a opção para especificar qualquer seleção de conjuntos de cifras, incluindo apenas conjuntos de cifras não padrão, se desejar.

* Após as informações de origem terem sido atualizadas, inicie o processo de replicação na réplica, da seguinte forma:

  ```
  mysql> START SLAVE;
  ```

Começando com o MySQL 8.0.22, `START REPLICA` é preferido, conforme mostrado aqui:

  ```
  mysql> START REPLICA;
  ```

Você pode usar a declaração `SHOW REPLICA STATUS`(show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") (antes do MySQL 8.0.22, `SHOW SLAVE STATUS`) para confirmar que uma conexão criptografada foi estabelecida com sucesso.

* Exigir conexões criptografadas na replica não garante que a fonte exija conexões criptografadas das réplicas. Se você deseja garantir que a fonte aceite apenas réplicas que se conectem usando conexões criptografadas, crie uma conta de usuário de replicação na fonte usando a opção `REQUIRE SSL`, e, em seguida, conceda ao usuário o privilégio `REPLICATION SLAVE`. Por exemplo:

  ```
  mysql> CREATE USER 'repl'@'%.example.com' IDENTIFIED BY 'password'
      -> REQUIRE SSL;
  mysql> GRANT REPLICATION SLAVE ON *.*
      -> TO 'repl'@'%.example.com';
  ```

Se você tiver uma conta de usuário de replicação existente na fonte, pode adicionar `REQUIRE SSL` a ela com esta declaração:

  ```
  mysql> ALTER USER 'repl'@'%.example.com' REQUIRE SSL;
  ```

### 19.3.2 Criptografando arquivos de registro binários e arquivos de registro de relevo

A partir do MySQL 8.0.14, os arquivos de registro binários e os arquivos de registro de relevo podem ser criptografados, ajudando a proteger esses arquivos e os dados potencialmente sensíveis contidos neles de serem mal utilizados por atacantes externos, além de serem visualizados por usuários do sistema operacional onde eles estão armazenados. O algoritmo de criptografia usado para os arquivos, o algoritmo de cifra AES (Padrão Avançado de Criptografia), é integrado ao MySQL Server e não pode ser configurado.

Você habilita essa criptografia em um servidor MySQL definindo a variável de sistema `binlog_encryption` como `ON`. `OFF` é o padrão. A variável de sistema define a criptografia para arquivos de log binários e arquivos de log de releio. O registro binário não precisa ser habilitado no servidor para habilitar a criptografia, então você pode criptografar os arquivos de log de releio em uma replica que não tenha um log binário. Para usar a criptografia, um componente ou plugin de chave deve ser instalado e configurado para fornecer o serviço de chave do servidor MySQL. Para obter instruções sobre como fazer isso, consulte a Seção 8.4.4, “O Keyring MySQL”. Qualquer componente ou plugin de chave compatível pode ser usado para armazenar as chaves de criptografia de log binário.

Quando você inicia o servidor pela primeira vez com a criptografia habilitada, uma nova chave de criptografia de log binário é gerada antes de os logs binários e os logs de retransmissão serem inicializados. Essa chave é usada para criptografar uma senha de arquivo para cada arquivo de log binário (se o servidor tiver criptografia binária habilitada) e arquivo de log de retransmissão (se o servidor tiver canais de replicação), e chaves adicionais geradas a partir das senhas de arquivo são usadas para criptografar os dados nos arquivos. A chave de criptografia de log binário que está atualmente em uso no servidor é chamada de chave mestre de log binário. A arquitetura de chave de criptografia de duas camadas significa que a chave mestre de log binário pode ser rotada (replaçada por uma nova chave mestre) conforme necessário, e apenas a senha de arquivo para cada arquivo precisa ser re-criptografada com a nova chave mestre, não todo o arquivo. Os arquivos de log de retransmissão são criptografados para todos os canais, incluindo novos canais que são criados após a criptografia ser ativada. O arquivo de índice de log binário e o arquivo de índice de log de retransmissão nunca são criptografados.

Se você ativar o criptogramação enquanto o servidor estiver em execução, uma nova chave de criptogramação do log binário será gerada naquela época. A exceção é se o criptogramação estava ativa anteriormente no servidor e foi então desativada, nesse caso, a chave de criptogramação do log binário que estava em uso antes é usada novamente. O arquivo de log binário e os arquivos de log de releio são rotados imediatamente e as senhas dos arquivos novos e todos os arquivos de log binário subsequentes e os arquivos de log de releio são criptografados usando essa chave de criptogramação do log binário. Os arquivos de log binário e os arquivos de log de releio existentes que ainda estão presentes no servidor não são criptografados, mas você pode excluí-los se eles não forem mais necessários.

Se você desativar a criptografia alterando a variável de sistema `binlog_encryption` para `OFF`, o arquivo de registro binário e os arquivos de registro de relé são rolados imediatamente e todo o registro subsequente é descriptografado. Arquivos criptografados anteriormente não são descriptografados automaticamente, mas o servidor ainda é capaz de lê-los. O privilégio `BINLOG_ENCRYPTION_ADMIN` é necessário para ativar ou desativar a criptografia enquanto o servidor está em execução.

Os arquivos de registro binários criptografados e não criptografados podem ser distinguidos usando o número mágico no início do cabeçalho do arquivo para arquivos de registro criptografados (`0xFD62696E`), que difere do usado para arquivos de registro não criptografados (`0xFE62696E`). A declaração [`SHOW BINARY LOGS`(show-binary-logs.html "15.7.7.1 SHOW BINARY LOGS Statement")] mostra se cada arquivo de registro binário é criptografado ou não criptografado.

Quando os arquivos de registro binários foram criptografados, o **mysqlbinlog** não pode lê-los diretamente, mas pode lê-los do servidor usando a opção `--read-from-remote-server`. A partir do MySQL 8.0.14, o **mysqlbinlog** retorna um erro adequado se você tentar ler um arquivo de registro binário criptografado diretamente, mas as versões mais antigas do **mysqlbinlog** não reconhecem o arquivo como um arquivo de registro binário. Se você fazer backup de arquivos de registro binário criptografados usando o **mysqlbinlog**, note que as cópias dos arquivos que são geradas usando o **mysqlbinlog** são armazenadas em um formato não criptografado.

A criptografia de log binário pode ser combinada com a compressão de transações de log binário (disponível a partir do MySQL 8.0.20). Para mais informações sobre compressão de transações de log binário, consulte a Seção 7.4.4.5, “Compressão de Transações de Log Binário”.

#### 19.3.2.1 Âmbito da criptografia do log binário

Quando a criptografia de log binário está ativa para uma instância do servidor MySQL, a cobertura de criptografia é a seguinte:

* Os dados em repouso que são escritos nos arquivos de registro binários e nos arquivos de registro de relevo são criptografados a partir do momento em que a criptografia é iniciada, usando a arquitetura de criptografia de duas camadas descrita acima. Os arquivos de registro binários e os arquivos de registro de relevo existentes que estavam presentes no servidor quando você iniciou a criptografia não são criptografados. Você pode limpar esses arquivos quando eles não forem mais necessários.

* Os dados em movimento no fluxo de eventos de replicação, que são enviados aos clientes do MySQL, incluindo o **mysqlbinlog**, são descriptografados para transmissão e, portanto, devem ser protegidos durante a transmissão pelo uso de criptografia de conexão (consulte Seção 8.3, “Usando conexões criptografadas” e Seção 19.3.1, “Configurando a replicação para usar conexões criptografadas”).

* Os dados em uso que são mantidos nos caches de transação e declaração de log binário durante uma transação estão em formato não criptografado no buffer de memória que armazena o cache. Os dados são escritos em um arquivo temporário no disco se ultrapassarem o espaço disponível no buffer de memória. A partir do MySQL 8.0.17, quando a criptografia do log binário está ativa no servidor, os arquivos temporários usados para manter o cache do log binário são criptografados usando AES-CTR (modo de contagem de AES) para criptografia de fluxo. Como os arquivos temporários são voláteis e ligados a um único processo, eles são criptografados usando criptografia de camada única, usando uma senha de arquivo gerada aleatoriamente e um vetor de inicialização que existem apenas na memória e nunca são armazenados em disco ou no chaveiro. Após cada transação ser comprometida, o cache do log binário é redefinido: o buffer de memória é limpo, qualquer arquivo temporário usado para manter o cache do log binário é truncado e uma nova senha de arquivo e vetor de inicialização são gerados aleatoriamente para uso com a próxima transação. Esse redefinimento também ocorre quando o servidor é reiniciado após um desligamento normal ou uma parada inesperada.

Nota

Se você usar `LOAD DATA` quando o `binlog_format=STATEMENT` está definido, o que não é recomendado, pois a declaração é considerada insegura para replicação baseada em declaração, um arquivo temporário contendo os dados é criado na replica onde as alterações são aplicadas. Esses arquivos temporários não são criptografados quando a criptografia de log binário está ativa no servidor. Use o formato de registro binário baseado em linha ou misto, que não criam os arquivos temporários.

#### 19.3.2.2 Chaves de criptografia de log binário

As chaves de criptografia de log binário usadas para criptografar as senhas dos arquivos dos arquivos de log são chaves de 256 bits que são geradas especificamente para cada instância do servidor MySQL usando o serviço de chaveiro do MySQL Server (veja a Seção 8.4.4, “O Keyring MySQL”). O serviço de chaveiro lida com a criação, recuperação e remoção das chaves de criptografia de log binário. Uma instância do servidor cria e remove apenas as chaves geradas para si mesma, mas pode ler as chaves geradas para outras instâncias se elas estiverem armazenadas no chaveiro, como no caso de uma instância do servidor que foi clonada por cópia de arquivo.

Importante

As chaves de criptografia do log binário para uma instância do servidor MySQL devem ser incluídas em seus procedimentos de backup e recuperação, porque, se as chaves necessárias para descriptografar as senhas dos arquivos de log binário atuais e retidos ou dos arquivos de log de relevo forem perdidas, pode não ser possível iniciar o servidor.

O formato das chaves de criptografia de registro binário no chaveiro é o seguinte:

```
MySQLReplicationKey_{UUID}_{SEQ_NO}
```

Por exemplo:

```
MySQLReplicationKey_00508583-b5ce-11e8-a6a5-0010e0734796_1
```

`{UUID}` é o UUID verdadeiro gerado pelo servidor MySQL (o valor da variável de sistema `server_uuid`). `{SEQ_NO}` é o número de sequência para a chave de criptografia do log binário, que é incrementado em 1 para cada nova chave que é gerada no servidor.

A chave de criptografia do log binário que atualmente está em uso no servidor é chamada de chave mestre do log binário. O número de sequência para a chave mestre do log binário atual é armazenado no chaveiro. A chave mestre do log binário é usada para criptografar a senha do arquivo de log de cada novo arquivo, que é uma senha de arquivo gerada aleatoriamente específica ao arquivo de log que é usado para criptografar os dados do arquivo. A senha do arquivo é criptografada usando AES-CBC (modo de Cadeia de Bloco de Chave AES) com a chave de criptografia binária de log 256 bits e um vetor de inicialização aleatório (IV), e é armazenada no cabeçalho do arquivo de log. Os dados do arquivo são criptografados usando AES-CTR (modo de Contador AES) com uma chave de 256 bits gerada a partir da senha do arquivo e um nonce também gerado a partir da senha do arquivo. É tecnicamente possível descriptografar um arquivo criptografado offline, se a chave de criptografia binária de log usada para criptografar a senha do arquivo é conhecida, usando ferramentas disponíveis no kit de criptografia OpenSSL.

Se você usar a cópia de arquivos para clonar uma instância do servidor MySQL que tem criptografia ativa, garantindo que seus arquivos de log binário e arquivos de log de relevo estejam criptografados, certifique-se de que o chaveiro também seja copiado, para que o servidor clonado possa ler as chaves de criptografia do log binário do servidor fonte. Quando a criptografia é ativada no servidor clonado (seja no início ou posteriormente), o servidor clonado reconhece que as chaves de criptografia do log binário usadas com os arquivos copiados incluem o UUID gerado do servidor fonte. Ele gera automaticamente uma nova chave de criptografia do log binário usando seu próprio UUID gerado e usa essa chave para criptografar as senhas dos arquivos do log binário e dos arquivos de log de relevo subsequentes. Os arquivos copiados continuam a ser lidos usando as chaves do servidor fonte.

#### 19.3.2.3 Rotação da Chave Mestre de Registro Binário

Quando a criptografia do log binário está habilitada, você pode rotular a chave mestre do log binário a qualquer momento, enquanto o servidor estiver em execução, emitindo `ALTER INSTANCE ROTATE BINLOG MASTER KEY`(alter-instance.html#alter-instance-rotate-binlog-master-key). Quando a chave mestre do log binário é rotacionada manualmente usando essa declaração, as senhas dos novos e dos arquivos subsequentes são criptografadas usando a nova chave mestre do log binário, e também as senhas dos arquivos de log de retransmissão dos arquivos de log binário criptografados existentes são re-criptografadas usando a nova chave mestre do log binário, para que a criptografia seja renovada completamente. Você pode rotular a chave mestre do log binário regularmente para cumprir a política de segurança da sua organização, e também se suspeitar que a chave mestre atual ou qualquer uma das chaves anteriores do log binário tenha sido comprometida.

Quando você rotação manualmente a chave mestre do log binário, o MySQL Server realiza as seguintes ações em sequência:

1. Uma nova chave de criptografia de registro binário é gerada com o próximo número de sequência disponível, armazenada no chaveiro, e usada como a nova chave mestre do registro binário.

2. Os arquivos de registro binário e de registro de relé são rotados em todos os canais.

3. A nova chave mestre de registro binário é usada para criptografar as senhas dos arquivos de registro binário e de registro de retransmissão, e os arquivos subsequentes até que a chave seja alterada novamente.

4. As senhas dos arquivos de registro binário criptografados existentes e dos arquivos de registro de relevo no servidor são re-encriptadas, por sua vez, usando a nova chave mestre de registro binário, começando com os arquivos mais recentes. Quaisquer arquivos não criptografados são ignorados.

5. As chaves de criptografia de registro binário que não são mais utilizadas para quaisquer arquivos após o processo de re-criptografia são removidas do chaveiro.

O privilégio `BINLOG_ENCRYPTION_ADMIN` é necessário para emitir [`ALTER INSTANCE ROTATE BINLOG MASTER KEY`](alter-instance.html#alter-instance-rotate-binlog-master-key), e a declaração não pode ser usada se a variável de sistema `binlog_encryption` estiver definida como `OFF`.

Como o passo final do processo de rotação da chave mestre do log binário, todas as chaves de criptografia do log binário que não se aplicam mais a nenhum arquivo de log binário ou arquivo de log de releio são limpadas do chaveiro. Se um arquivo de log binário retido ou arquivo de log de releio não puder ser inicializado para re-criptografia, as chaves de criptografia do log binário relevantes não são excluídas, caso os arquivos possam ser recuperados no futuro. Por exemplo, isso pode ser o caso se um arquivo listado em um arquivo de índice de log binário não puder ser lido atualmente, ou se um canal não conseguir ser inicializado. Se o UUID do servidor mudar, por exemplo, porque um backup criado usando o MySQL Enterprise Backup é usado para configurar uma nova réplica, emitir `ALTER INSTANCE ROTATE BINLOG MASTER KEY` no novo servidor não exclui quaisquer chaves de criptografia do log binário anteriores que incluam o UUID do servidor original.

Se nenhum dos primeiros quatro passos do processo de rotação da chave mestre do log binário puder ser completado corretamente, uma mensagem de erro será emitida explicando a situação e as consequências para o status de criptografia dos arquivos de log binário e dos arquivos de log de releio. Arquivos que foram criptografados anteriormente são sempre deixados em estado criptografado, mas suas senhas de arquivo ainda podem ser criptografadas usando uma chave mestre binária antiga do log. Se você vir esses erros, tente primeiro o processo novamente, emitindo `ALTER INSTANCE ROTATE BINLOG MASTER KEY` novamente. Em seguida, investigue o status dos arquivos individuais para ver o que está bloqueando o processo, especialmente se suspeitar que a chave mestre binária atual ou qualquer uma das chaves anteriores do log binário possa ter sido comprometida.

Se o passo final do processo de rotação da chave mestre do log binário não puder ser completado corretamente, uma mensagem de alerta é emitida explicando a situação. A mensagem de alerta identifica se o processo não conseguiu limpar as chaves auxiliares no chaveiro para a rotação da chave mestre do log binário, ou não conseguiu limpar as chaves de criptografia de log binário não utilizadas. Você pode optar por ignorar a mensagem, pois as chaves são chaves auxiliares ou não estão mais em uso, ou você pode emitir `ALTER INSTANCE ROTATE BINLOG MASTER KEY` novamente para tentar novamente o processo.

Se o servidor parar e for reiniciado com a criptografia do log binário ainda definida como `ON` durante o processo de rotação da chave mestre do log binário, novos arquivos de log binário e arquivos de log de releio após o reinício serão criptografados usando a nova chave mestre do log binário. No entanto, a re-encriptação de arquivos existentes não será continuada, então os arquivos que não foram re-encriptados antes do servidor parar serão mantidos criptografados usando a chave mestre do log binário anterior. Para completar a re-encriptação e limpar as chaves de criptografia de log binário não utilizadas, execute novamente `ALTER INSTANCE ROTATE BINLOG MASTER KEY`(alter-instance.html#alter-instance-rotate-binlog-master-key) após o reinício.

As ações não são escritas no log binário e não são executadas em réplicas. A rotação da chave mestre do log binário pode, portanto, ser realizada em ambientes de replicação, incluindo uma mistura de versões do MySQL. Para agendar a rotação regular da chave mestre do log binário em todos os servidores aplicáveis de origem e réplica, você pode habilitar o Cronograma de Eventos do MySQL em cada servidor e emitir a declaração `ALTER INSTANCE ROTATE BINLOG MASTER KEY`(alter-instance.html#alter-instance-rotate-binlog-master-key) usando uma declaração `CREATE EVENT`. Se você rotular a chave mestre do log binário porque suspeita que a chave mestre atual ou qualquer uma das chaves anteriores do log binário possam ter sido comprometidas, emita a declaração em todos os servidores aplicáveis de origem e réplica. Emitir a declaração em servidores individuais garante que você possa verificar a conformidade imediata, mesmo no caso de réplicas que estão atrasadas, pertencem a múltiplas topologias de replicação ou que não estão atualmente ativas na topologia de replicação, mas têm arquivos de log binário e log de releio.

A variável de sistema `binlog_rotate_encryption_master_key_at_startup` controla se a chave mestre do log binário é rotada automaticamente quando o servidor é reiniciado. Se esta variável de sistema for definida como `ON`, uma nova chave de criptografia do log binário é gerada e usada como a nova chave mestre do log binário sempre que o servidor é reiniciado. Se for definida como `OFF`, que é a configuração padrão, a chave mestre do log binário existente é usada novamente após o reinício. Quando a chave mestre do log binário é rotada no início, as senhas dos arquivos do log binário e do log de releio existentes são criptografadas usando a nova chave. As senhas dos arquivos do log binário criptografado existente e dos arquivos de log de releio não são re-criptografadas, portanto, permanecem criptografadas usando a chave antiga, que permanece disponível no chaveiro.

### 19.3.3 Verificação de privilégios de replicação

Por padrão, a replicação do MySQL (incluindo a Replicação por Grupo) não realiza verificações de privilégios quando as transações que já foram aceitas por outro servidor são aplicadas em uma réplica ou membro do grupo. A partir do MySQL 8.0.18, você pode criar uma conta de usuário com os privilégios apropriados para aplicar as transações que normalmente são replicadas em um canal, e especificar isso como a conta `PRIVILEGE_CHECKS_USER` para o aplicador de replicação, usando uma declaração `CHANGE REPLICATION SOURCE TO` (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") (a partir do MySQL 8.0.23) ou declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23). O MySQL, em seguida, verifica cada transação contra os privilégios da conta do usuário para verificar se você autorizou a operação para esse canal. A conta também pode ser usada com segurança por um administrador para aplicar ou reaplicar transações da saída do **mysqlbinlog**, por exemplo, para recuperar de um erro de replicação no canal.

O uso de uma conta `PRIVILEGE_CHECKS_USER` ajuda a proteger um canal de replicação contra o uso não autorizado ou acidental de operações privilegiadas ou indesejadas. A conta `PRIVILEGE_CHECKS_USER` oferece uma camada adicional de segurança em situações como essas:

* Você está replicando entre uma instância de servidor na rede da sua organização e uma instância de servidor em outra rede, como uma instância fornecida por um provedor de serviços em nuvem.

* Você deseja ter múltiplas implantações locais ou fora do local administradas como unidades separadas, sem conceder privilégios de uma conta de administrador em todas as implantações.

* Você deseja ter uma conta de administrador que permita que um administrador realize apenas operações diretamente relevantes ao canal de replicação e aos bancos de dados que ele replica, em vez de ter privilégios amplos na instância do servidor.

Você pode aumentar a segurança de um canal de replicação onde as verificações de privilégio são aplicadas, adicionando uma ou ambas as opções à declaração `CHANGE REPLICATION SOURCE TO` (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") | `CHANGE MASTER TO` quando você especificar a conta `PRIVILEGE_CHECKS_USER` para o canal:

* A opção `REQUIRE_ROW_FORMAT` (disponível a partir do MySQL 8.0.19) faz com que o canal de replicação aceite apenas eventos de replicação baseados em linhas. Quando `REQUIRE_ROW_FORMAT` é definido, você deve usar o registro binário baseado em linhas (`binlog_format=ROW`) no servidor de origem. No MySQL 8.0.18, `REQUIRE_ROW_FORMAT` não está disponível, mas o uso de registro binário baseado em linhas para canais de replicação protegidos ainda é fortemente recomendado. Com o registro binário baseado em declarações, alguns privilégios de nível de administrador podem ser necessários para que a conta `PRIVILEGE_CHECKS_USER` execute transações com sucesso.

* A opção `REQUIRE_TABLE_PRIMARY_KEY_CHECK` (disponível a partir do MySQL 8.0.20) faz com que o canal de replicação use sua própria política para verificações de chave primária. Definir `ON` significa que as chaves primárias são sempre necessárias, e definir `OFF` significa que as chaves primárias nunca são necessárias. O ajuste padrão, `STREAM`, define o valor da variável de sistema `sql_require_primary_key` da sessão usando o valor que é replicado da fonte para cada transação. Quando `PRIVILEGE_CHECKS_USER` é definido, definir `REQUIRE_TABLE_PRIMARY_KEY_CHECK` para `ON` ou `OFF` significa que a conta de usuário não precisa de privilégios de nível de administração de sessão para definir variáveis de sessão restritas, que são necessárias para alterar o valor de `sql_require_primary_key`. Também normaliza o comportamento em todos os canais de replicação para diferentes fontes.

Você concede o privilégio `REPLICATION_APPLIER` para permitir que uma conta de usuário apareça como o `PRIVILEGE_CHECKS_USER` para um fio de aplicação de replicação e execute as instruções de uso interno `BINLOG` usadas pelo mysqlbinlog. O nome de usuário e o nome do host para a conta `PRIVILEGE_CHECKS_USER` devem seguir a sintaxe descrita na Seção 8.2.4, “Especificação de Nomes de Conta”, e o usuário não deve ser um usuário anônimo (com um nome de usuário em branco) ou o `CURRENT_USER`. Para criar uma nova conta, use `CREATE USER`. Para conceder a esta conta o privilégio `REPLICATION_APPLIER`, use a declaração `GRANT`. Por exemplo, para criar uma conta de usuário `priv_repl`, que pode ser usada manualmente por um administrador de qualquer host no domínio `example.com`, e que requer uma conexão criptografada, emita as seguintes declarações:

```
mysql> SET sql_log_bin = 0;
mysql> CREATE USER 'priv_repl'@'%.example.com' IDENTIFIED BY 'password' REQUIRE SSL;
mysql> GRANT REPLICATION_APPLIER ON *.* TO 'priv_repl'@'%.example.com';
mysql> SET sql_log_bin = 1;
```

As declarações `SET sql_log_bin` são usadas para que as declarações de gerenciamento de conta não sejam adicionadas ao log binário e enviadas para os canais de replicação (consulte Seção 15.4.1.3, "Declaração SET sql_log_bin").

Importante

O plugin de autenticação `caching_sha2_password` é o padrão para novos usuários criados a partir do MySQL 8.0 (para detalhes, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação SHA-2 Pluggable”). Para se conectar a um servidor usando uma conta de usuário que autentica com este plugin, você deve configurar uma conexão criptografada conforme descrito na Seção 19.3.1, “Configuração da Replicação para Usar Conexões Criptografadas”, ou habilitar a conexão não criptografada para suportar a troca de senha usando um par de chaves RSA.

Após configurar a conta do usuário, use a declaração `GRANT` para conceder privilégios adicionais para permitir que a conta do usuário faça as alterações no banco de dados que você espera que o thread do aplicável realize, como atualizar tabelas específicas mantidas no servidor. Esses mesmos privilégios permitem que um administrador use a conta se precisar executar qualquer uma dessas transações manualmente no canal de replicação. Se uma operação inesperada for realizada para a qual você não concedeu os privilégios apropriados, a operação é desativada e o thread do aplicável de replicação para com um erro. A Seção 19.3.3.1, “Privilegios para a Conta de REPLICAÇÃO PRIVILEGE_CHECKS_USER”, explica quais privilégios adicionais a conta precisa. Por exemplo, para conceder à conta de usuário `priv_repl` o privilégio `INSERT` para adicionar linhas à tabela `cust` em `db1`, emita a seguinte declaração:

```
mysql> GRANT INSERT ON db1.cust TO 'priv_repl'@'%.example.com';
```

Você atribui a conta `PRIVILEGE_CHECKS_USER` para um canal de replicação usando uma declaração (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") (do MySQL 8.0.23) ou uma declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23). Se a replicação estiver em execução, emita `STOP REPLICA` (ou antes do MySQL 8.0.22, `STOP SLAVE`) antes da declaração `CHANGE MASTER TO`, e `START REPLICA` depois dela. O uso de registro binário baseado em linha é fortemente recomendado quando `PRIVILEGE_CHECKS_USER` está definido, e a partir do MySQL 8.0.19, você pode usar a declaração para definir `REQUIRE_ROW_FORMAT` para impor isso.

Quando você reiniciar o canal de replicação, as verificações de privilégios dinâmicos são aplicadas a partir desse ponto em diante. No entanto, os privilégios globais estáticos não estão ativos no contexto do aplicável até que você recarregue as tabelas de concessão, porque esses privilégios não são alterados para um cliente conectado. Para ativar privilégios estáticos, realize uma operação de `FLUSH PRIVILEGES` ou execute um comando **mysqladmin flush-privileges** ou **mysqladmin reload**.

Por exemplo, para iniciar verificações de privilégios no canal `channel_1` em uma replica em execução no MySQL 8.0.23 e posterior, execute as seguintes declarações:

```
mysql> STOP REPLICA FOR CHANNEL 'channel_1';
mysql> CHANGE REPLICATION SOURCE TO
     >    PRIVILEGE_CHECKS_USER = 'priv_repl'@'%.example.com',
     >    REQUIRE_ROW_FORMAT = 1 FOR CHANNEL 'channel_1';
mysql> FLUSH PRIVILEGES;
mysql> START REPLICA FOR CHANNEL 'channel_1';
```

Antes do MySQL 8.0.23, você pode usar as instruções mostradas aqui:

```
mysql> STOP SLAVE FOR CHANNEL 'channel_1';
mysql> CHANGE MASTER TO
     >    PRIVILEGE_CHECKS_USER = 'priv_repl'@'%.example.com',
     >    REQUIRE_ROW_FORMAT = 1 FOR CHANNEL 'channel_1';
mysql> FLUSH PRIVILEGES;
mysql> START SLAVE FOR CHANNEL 'channel_1';
```

Se você não especificar um canal e não houver outros canais, a declaração é aplicada ao canal padrão. O nome do usuário e o nome do host para a conta `PRIVILEGE_CHECKS_USER` de um canal são mostrados na tabela do Schema de desempenho `replication_applier_configuration`, onde são adequadamente escapados para que possam ser copiados diretamente em declarações SQL para executar transações individuais.

Em MySQL 8.0.31 e versões posteriores, se você estiver usando o plugin `Rewriter`, você deve conceder à conta de usuário `PRIVILEGE_CHECKS_USER` o privilégio `SKIP_QUERY_REWRITE`. Isso impede que as declarações emitidas por esse usuário sejam reescritas. Consulte a Seção 7.6.4, “O plugin de reescrita de consulta de reescrita”, para obter mais informações.

Quando `REQUIRE_ROW_FORMAT` é definido para um canal de replicação, o aplicador de replicação não cria ou exclui tabelas temporárias, e, portanto, não define a variável de sistema de sessão `pseudo_thread_id`. Não executa instruções `LOAD DATA INFILE`, e, portanto, não tenta operações de arquivo para acessar ou excluir os arquivos temporários associados às cargas de dados (registrados como `Format_description_log_event`). Não executa eventos `INTVAR`, `RAND` e `USER_VAR`, que são usados para reproduzir o estado de conexão do cliente para replicação baseada em declarações. (Uma exceção é os eventos `USER_VAR` que estão associados a consultas DDL, que são executados.) Não executa quaisquer declarações que sejam registradas dentro de transações DML. Se o aplicador de replicação detectar algum desses tipos de evento ao tentar colocar ou aplicar uma transação, o evento não é aplicado e a replicação é interrompida com um erro.

Você pode definir `REQUIRE_ROW_FORMAT` para um canal de replicação, independentemente de você definir uma conta `PRIVILEGE_CHECKS_USER`. As restrições implementadas ao definir essa opção aumentam a segurança do canal de replicação, mesmo sem verificações de privilégio. Você também pode especificar a opção `--require-row-format` quando usar **mysqlbinlog**, para impor eventos de replicação baseados em linhas no **mysqlbinlog** de saída.

**Contexto de segurança.** Por padrão, quando um thread de aplicação de replicação é iniciado com uma conta de usuário especificada como `PRIVILEGE_CHECKS_USER`, o contexto de segurança é criado usando papéis padrão, ou com todos os papéis se `activate_all_roles_on_login` estiver definido como `ON`.

Você pode usar papéis para fornecer um conjunto de privilégios geral para contas que são usadas como contas `PRIVILEGE_CHECKS_USER`, como no exemplo a seguir. Aqui, em vez de conceder o privilégio `INSERT` para a tabela `db1.cust` diretamente para uma conta de usuário, como no exemplo anterior, este privilégio é concedido ao papel `priv_repl_role` juntamente com o privilégio `REPLICATION_APPLIER`. O papel é então usado para conceder o conjunto de privilégios a duas contas de usuário, que agora podem ser usadas como contas `PRIVILEGE_CHECKS_USER`:

```
mysql> SET sql_log_bin = 0;
mysql> CREATE USER 'priv_repa'@'%.example.com'
                  IDENTIFIED BY 'password'
                  REQUIRE SSL;
mysql> CREATE USER 'priv_repb'@'%.example.com'
                  IDENTIFIED BY 'password'
                  REQUIRE SSL;
mysql> CREATE ROLE 'priv_repl_role';
mysql> GRANT REPLICATION_APPLIER TO 'priv_repl_role';
mysql> GRANT INSERT ON db1.cust TO 'priv_repl_role';
mysql> GRANT 'priv_repl_role' TO
                  'priv_repa'@'%.example.com',
                  'priv_repb'@'%.example.com';
mysql> SET DEFAULT ROLE 'priv_repl_role' TO
                  'priv_repa'@'%.example.com',
                  'priv_repb'@'%.example.com';
mysql> SET sql_log_bin = 1;
```

Tenha em atenção que, quando o fio do aplicável de replicação cria o contexto de segurança, ele verifica os privilégios para a conta `PRIVILEGE_CHECKS_USER`, mas não realiza validação de senha e não realiza verificações relacionadas à gestão da conta, como verificar se a conta está bloqueada. O contexto de segurança que é criado permanece inalterado durante a vida útil do fio do aplicável de replicação.

**Limitação.** Apenas no MySQL 8.0.18, se o replicador **mysqld** for reiniciado imediatamente após a emissão de uma declaração `RESET REPLICA` (devido a uma saída inesperada do servidor ou reinício deliberado), o ajuste da conta `PRIVILEGE_CHECKS_USER`, que está na tabela `mysql.slave_relay_log_info`, é perdido e deve ser respecionado. Ao usar verificações de privilégios nessa versão, sempre verifique se elas estão em vigor após um reinício e respecione-as, se necessário. A partir do MySQL 8.0.19, o ajuste da conta `PRIVILEGE_CHECKS_USER` é preservado nessa situação, então ele é recuperado da tabela e reaplicado ao canal.

#### 19.3.3.1 Prêmios para a Conta de Replicação PRIVILEGE_CHECKS_USER

A conta de usuário que é especificada usando a declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` como a conta `PRIVILEGE_CHECKS_USER` para um canal de replicação deve ter o privilégio `REPLICATION_APPLIER`, caso contrário, o fio aplicador de replicação não começa. Como explicado na Seção 19.3.3, “Verificações de Privilégios de Replicação”, a conta requer outros privilégios que são suficientes para aplicar todas as transações esperadas esperadas no canal de replicação. Esses privilégios são verificados apenas quando as transações relevantes são executadas.

O uso de registro binário baseado em linha (`binlog_format=ROW`) é fortemente recomendado para canais de replicação que são protegidos usando uma conta `PRIVILEGE_CHECKS_USER`. Com o registro binário baseado em declaração, alguns privilégios de nível de administrador podem ser necessários para a conta `PRIVILEGE_CHECKS_USER` para executar transações com sucesso. A partir do MySQL 8.0.19, o ajuste `REQUIRE_ROW_FORMAT` pode ser aplicado a canais protegidos, o que restringe o canal de executar eventos que exigiriam esses privilégios.

O privilégio `REPLICATION_APPLIER` permite explicitamente ou implicitamente que a conta `PRIVILEGE_CHECKS_USER` realize as seguintes operações que um fio de replicação precisa realizar:

* Definir o valor das variáveis do sistema `gtid_next`, `original_commit_timestamp`, `original_server_version`, `immediate_server_version` e `pseudo_replica_mode` ou `pseudo_slave_mode`, para aplicar metadados e comportamentos apropriados ao executar transações.

* Executar declarações de uso interno `BINLOG` para aplicar a saída do **mysqlbinlog**, desde que a conta também tenha permissão para as tabelas e operações nessas declarações.

* Atualizar as tabelas do sistema `mysql.gtid_executed`, `mysql.slave_relay_log_info`, `mysql.slave_worker_info` e `mysql.slave_master_info`, para atualizar os metadados de replicação. (Se os eventos acessarem essas tabelas explicitamente para outros propósitos, você deve conceder os privilégios apropriados nas tabelas.)

* Aplicar um log binário `Table_map_log_event`, que fornece metadados da tabela, mas não realiza nenhuma alteração no banco de dados.

Se a opção `REQUIRE_TABLE_PRIMARY_KEY_CHECK` da declaração (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") | `CHANGE MASTER TO` estiver definida como a opção padrão de `STREAM`, a conta `PRIVILEGE_CHECKS_USER` precisa de privilégios suficientes para definir variáveis de sessão restritas, para que possa alterar o valor da variável de sistema `sql_require_primary_key` para a duração de uma sessão, de modo a corresponder ao ajuste replicado da fonte. O privilégio `SESSION_VARIABLES_ADMIN` concede à conta essa capacidade. Este privilégio também permite que a conta aplique a saída **mysqlbinlog** que foi criada usando a opção `--disable-log-bin`. Se você definir `REQUIRE_TABLE_PRIMARY_KEY_CHECK` para `ON` ou `OFF`, a replica sempre usa esse valor para a variável de sistema `sql_require_primary_key` nas operações de replicação, e assim não precisa desses privilégios de nível de administração de sessão.

Se a criptografia de tabela estiver em uso, a variável de sistema `table_encryption_privilege_check` é definida como `ON`, e o ajuste de criptografia para o tablespace envolvido em qualquer evento difere do ajuste de criptografia padrão do servidor aplicando (especificado pela variável de sistema `default_table_encryption`), a conta `PRIVILEGE_CHECKS_USER` precisa do privilégio `TABLE_ENCRYPTION_ADMIN` para sobrepor o ajuste de criptografia padrão. É fortemente recomendado que você não conceda este privilégio. Em vez disso, garanta que o ajuste de criptografia padrão em uma replica corresponda ao status de criptografia dos tablespaces que ela replica, e que os membros do grupo de replicação tenham o mesmo ajuste de criptografia padrão, para que o privilégio não seja necessário.

Para executar transações replicadas específicas do log de relevo, ou transações do **mysqlbinlog** conforme necessário, a conta `PRIVILEGE_CHECKS_USER` deve ter os seguintes privilégios:

* Para uma inserção de linha em formato de registro (que são registrados como `Write_rows_log_event`), o privilégio `INSERT` na tabela relevante.

* Para uma atualização de linha registrada no formato de linha (que são registradas como `Update_rows_log_event`), o privilégio `UPDATE` na tabela relevante.

* Para uma exclusão de linha registrada no formato de linha (que são registradas como `Delete_rows_log_event`), o privilégio `DELETE` na tabela relevante.

Se a contabilização binária baseada em declarações estiver em uso (o que não é recomendado com uma conta `PRIVILEGE_CHECKS_USER`), para um comunicado de controle de transação, como `BEGIN` ou `COMMIT` ou comunicado de DML registrado em formato de declaração (que são registrados como um `Query_log_event`), a conta `PRIVILEGE_CHECKS_USER` precisa de privilégios para executar a declaração contida no evento.

Se operações `LOAD DATA` precisam ser realizadas no canal de replicação, use o registro binário baseado em linha (`binlog_format=ROW`). Com este formato de registro, o privilégio `FILE` não é necessário para executar o evento, então não dê este privilégio à conta `PRIVILEGE_CHECKS_USER`. O uso de registro binário baseado em linha é fortemente recomendado para canais de replicação que são protegidos usando uma conta `PRIVILEGE_CHECKS_USER`. Se `REQUIRE_ROW_FORMAT` estiver definido para o canal, o registro binário baseado em linha é necessário. O `Format_description_log_event`, que exclui quaisquer arquivos temporários criados por eventos [`LOAD DATA`(load-data.html "15.2.9 LOAD DATA Statement")], é processado sem verificações de privilégio. Para mais informações, consulte a Seção 19.5.1.19, “Replicação e CARREGAR DADOS”.

Se a variável de sistema `init_replica` ou `init_slave` estiver definida para especificar uma ou mais instruções SQL a serem executadas quando o thread de SQL de replicação for iniciado, a conta `PRIVILEGE_CHECKS_USER` deve ter os privilégios necessários para executar essas instruções.

Recomenda-se que você nunca conceda quaisquer privilégios de ACL à conta `PRIVILEGE_CHECKS_USER`, incluindo `CREATE USER`, `CREATE ROLE`, `DROP ROLE` e `GRANT OPTION`, e não permita que a conta atualize a tabela `mysql.user`. Com esses privilégios, a conta poderia ser usada para criar ou modificar contas de usuário no servidor. Para evitar que as declarações de ACL emitidas no servidor de origem sejam replicadas para o canal protegido para execução (onde elas falham na ausência desses privilégios), você pode emitir `SET sql_log_bin = 0` antes de todas as declarações de ACL e `SET sql_log_bin = 1` depois delas, para omitir as declarações do log binário da fonte. Alternativamente, você pode definir um banco de dados atual dedicado antes de executar todas as declarações de ACL e usar um filtro de replicação (`--binlog-ignore-db`) para filtrar esse banco de dados na replica.

#### 19.3.3.2 Verificação de privilégios para canais de replicação de grupo

A partir do MySQL 8.0.19, além de garantir a replicação assíncrona e semi-síncrona, você pode optar por usar uma conta `PRIVILEGE_CHECKS_USER` para proteger os dois tópicos de aplicação de replicação usados pelo Grupo de Replicação. O tópico `group_replication_applier` em cada membro do grupo é usado para aplicar as transações do grupo, e o tópico `group_replication_recovery` em cada membro do grupo é usado para transferência de estado do log binário como parte da recuperação distribuída quando o membro se junta ou se junta novamente ao grupo.

Para garantir um desses fios, pare a Replicação em Grupo, em seguida, emita a declaração `CHANGE REPLICATION SOURCE TO` (change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") (do MySQL 8.0.23) ou a declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) com a opção `PRIVILEGE_CHECKS_USER`, especificando `group_replication_applier` ou `group_replication_recovery` como o nome do canal. Por exemplo:

```
mysql> STOP GROUP_REPLICATION;
mysql> CHANGE MASTER TO PRIVILEGE_CHECKS_USER = 'gr_repl'@'%.example.com'
          FOR CHANNEL 'group_replication_recovery';
mysql> FLUSH PRIVILEGES;
mysql> START GROUP_REPLICATION;

Or from MySQL 8.0.23:
mysql> STOP GROUP_REPLICATION;
mysql> CHANGE REPLICATION SOURCE TO PRIVILEGE_CHECKS_USER = 'gr_repl'@'%.example.com'
          FOR CHANNEL 'group_replication_recovery';
mysql> FLUSH PRIVILEGES;
mysql> START GROUP_REPLICATION;
```

Para os canais de Replicação por Grupo, a configuração `REQUIRE_ROW_FORMAT` é habilitada automaticamente quando o canal é criado e não pode ser desativada, portanto, você não precisa especiá-la.

Importante

Em MySQL 8.0.19, certifique-se de que não emite a declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` com a opção `PRIVILEGE_CHECKS_USER` enquanto a Replicação por Grupo está em execução. Essa ação faz com que os arquivos de registro de relevo para o canal sejam apagados, o que pode causar a perda de transações que foram recebidas e colocadas em fila no registro de relevo, mas ainda não aplicadas.

A Replicação em Grupo exige que todas as tabelas que devem ser replicadas pelo grupo tenham uma chave primária definida, ou uma chave primária equivalente, onde a equivalente é uma chave única não nula. Em vez de usar os verificações realizadas pela variável de sistema `sql_require_primary_key`, a Replicação em Grupo tem seu próprio conjunto de verificações interno para chaves primárias ou equivalentes de chave primária. Você pode definir a opção `REQUIRE_TABLE_PRIMARY_KEY_CHECK` da declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` para `ON` para um canal de Replicação em Grupo. No entanto, esteja ciente de que você pode encontrar algumas transações que são permitidas sob os verificações internas da Replicação em Grupo, mas não são permitidas sob os verificações realizadas quando você define `sql_require_primary_key = ON` ou `REQUIRE_TABLE_PRIMARY_KEY_CHECK = ON`. Por essa razão, os novos e atualizados canais de Replicação em Grupo a partir do MySQL 8.0.20 (quando a opção foi introduzida) têm `REQUIRE_TABLE_PRIMARY_KEY_CHECK` definido como o padrão de `STREAM`, em vez de `ON`.

Se uma operação de clonagem remota for usada para recuperação distribuída na Replicação em Grupo (consulte a Seção 20.5.4.2, “Clonagem para Recuperação Distribuída”), a partir do MySQL 8.0.19, a conta `PRIVILEGE_CHECKS_USER` e as configurações relacionadas do doador são clonadas para o membro que está se juntando. Se o membro que está se juntando estiver configurado para iniciar a Replicação em Grupo no momento do boot, ele usará automaticamente a conta para verificações de privilégios nos canais de replicação apropriados.

Em MySQL 8.0.18, devido a várias limitações, é recomendável que você não use uma conta `PRIVILEGE_CHECKS_USER` com canais de Replicação por Grupo.

#### 19.3.3.3 Recuperação de verificações de privilégios de replicação falha

Se uma verificação de privilégio contra a conta `PRIVILEGE_CHECKS_USER` falhar, a transação não é executada e a replicação é interrompida para o canal. Os detalhes do erro e da última transação aplicada são registrados na tabela do Schema de desempenho `replication_applier_status_by_worker`. Siga este procedimento para recuperar do erro:

1. Identifique o evento replicado que causou o erro e verifique se o evento é esperado ou não e se é proveniente de uma fonte confiável. Você pode usar **mysqlbinlog** para recuperar e exibir os eventos que foram registrados por volta do momento do erro. Para obter instruções sobre como fazer isso, consulte a Seção 9.5, “Recuperação Ponto em Tempo (Incremental)”).

2. Se o evento replicado não for esperado ou não vier de uma fonte conhecida e confiável, investigue a causa. Se você puder identificar por que o evento ocorreu e não há considerações de segurança, proceda a corrigir o erro conforme descrito abaixo.

3. Se a conta `PRIVILEGE_CHECKS_USER` deveria ter sido permitida para executar a transação, mas foi mal configurada, conceda os privilégios ausentes à conta, use uma declaração `FLUSH PRIVILEGES` (flush.html#flush-privileges) ou execute um comando **mysqladmin flush-privileges** ou **mysqladmin reload** para recarregar as tabelas de concessão, e, em seguida, reinicie a replicação para o canal.

4. Se a transação precisar ser executada e você tiver verificado que é confiável, mas a conta `PRIVILEGE_CHECKS_USER` não deve ter esse privilégio normalmente, você pode conceder o privilégio necessário à conta `PRIVILEGE_CHECKS_USER` temporariamente. Após o evento replicado ter sido aplicado, remova o privilégio da conta e tome as medidas necessárias para garantir que o evento não ocorra novamente se for evitável.

5. Se a transação for uma ação administrativa que só deveria ter ocorrido na fonte e não na réplica, ou só deveria ter ocorrido em um único membro do grupo de replicação, pule a transação no(s) servidor(es) onde ela parou a replicação, em seguida, emita `START REPLICA` para reiniciar a replicação no canal. Para evitar a situação no futuro, você pode emitir tais declarações administrativas com `SET sql_log_bin = 0` antes delas e `SET sql_log_bin = 1` depois delas, para que elas não sejam registradas na fonte.

6. Se a transação for uma declaração DDL ou DML que não deveria ter ocorrido em nenhum dos servidores fonte ou réplica, ignore a transação nos servidores onde ela parou a replicação, desfaça a transação manualmente no servidor onde ela ocorreu originalmente, e, em seguida, emita `START REPLICA` para reiniciar a replicação.

Para pular uma transação, se GTIDs estiverem em uso, realize uma transação vazia que tenha o GTID da transação que falhou, por exemplo:

```
SET GTID_NEXT='aaa-bbb-ccc-ddd:N';
BEGIN;
COMMIT;
SET GTID_NEXT='AUTOMATIC';
```

Se os GTIDs não estiverem em uso, emita uma declaração `SET GLOBAL sql_replica_skip_counter` ou `SET GLOBAL sql_slave_skip_counter` para pular o evento. Para instruções sobre como usar esse método alternativo e mais detalhes sobre como pular transações, consulte a Seção 19.1.7.3, “Pular Transações”.