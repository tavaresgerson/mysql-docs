### 6.3.2 Protocolos TLS e Ciphers de Conexão Criptografada

O MySQL suporta múltiplos protocolos TLS e *ciphers*, e permite configurar quais protocolos e *ciphers* devem ser permitidos para conexões criptografadas. Também é possível determinar qual protocolo e *cipher* a sessão atual utiliza.

* [Protocolos TLS de Conexão Suportados](encrypted-connection-protocols-ciphers.html#encrypted-connection-supported-protocols "Supported Connection TLS Protocols")
* [Configuração do Protocolo TLS de Conexão](encrypted-connection-protocols-ciphers.html#encrypted-connection-protocol-configuration "Connection TLS Protocol Configuration")
* [Protocolos TLS Descontinuados](encrypted-connection-protocols-ciphers.html#encrypted-connection-deprecated-protocols "Deprecated TLS Protocols")
* [Configuração de Cipher de Conexão](encrypted-connection-protocols-ciphers.html#encrypted-connection-cipher-configuration "Connection Cipher Configuration")
* [Negociação do Protocolo TLS de Conexão](encrypted-connection-protocols-ciphers.html#encrypted-connection-protocol-negotiation "Connection TLS Protocol Negotiation")
* [Monitoramento do Protocolo TLS e Cipher da Sessão Client Atual](encrypted-connection-protocols-ciphers.html#encrypted-connection-protocol-monitoring "Monitoring Current Client Session TLS Protocol and Cipher")

#### Protocolos TLS de Conexão Suportados

O MySQL suporta conexões criptografadas usando os protocolos TLSv1, TLSv1.1 e TLSv1.2, listados em ordem do menos seguro para o mais seguro. O conjunto de protocolos realmente permitido para conexões está sujeito a múltiplos fatores:

* Configuração do MySQL. Os protocolos TLS permitidos podem ser configurados tanto no lado do Server quanto no lado do Client para incluir apenas um subconjunto dos protocolos TLS suportados. A configuração em ambos os lados deve incluir pelo menos um protocolo em comum, ou as tentativas de conexão não conseguirão negociar um protocolo a ser usado. Para detalhes, consulte [Negociação do Protocolo TLS de Conexão](encrypted-connection-protocols-ciphers.html#encrypted-connection-protocol-negotiation "Connection TLS Protocol Negotiation").

* Configuração de Host em todo o Sistema (*System-wide host configuration*). O sistema *host* pode permitir apenas certos protocolos TLS, o que significa que as conexões MySQL não podem usar protocolos não permitidos, mesmo que o próprio MySQL os permita:

  + Suponha que a configuração do MySQL permita TLSv1, TLSv1.1 e TLSv1.2, mas a configuração do seu sistema *host* permita apenas conexões que utilizem TLSv1.2 ou superior. Neste caso, você não pode estabelecer conexões MySQL que utilizem TLSv1 ou TLSv1.1, mesmo que o MySQL esteja configurado para permiti-los, porque o sistema *host* não os permite.

  + Se a configuração do MySQL permitir TLSv1, TLSv1.1 e TLSv1.2, mas a configuração do seu sistema *host* permitir apenas conexões que utilizem TLSv1.3 ou superior, você não poderá estabelecer conexões MySQL de forma alguma, pois nenhum protocolo permitido pelo MySQL é permitido pelo sistema *host*.

  As soluções alternativas (*workarounds*) para este problema incluem:

  + Altere a configuração de *host system-wide* para permitir protocolos TLS adicionais. Consulte a documentação do seu sistema operacional para obter instruções. Por exemplo, seu sistema pode ter um arquivo `/etc/ssl/openssl.cnf` que contém estas linhas para restringir os protocolos TLS a TLSv1.2 ou superior:

    ```sql
    [system_default_sect]
    MinProtocol = TLSv1.2
    ```

    Alterar o valor para uma versão de protocolo inferior ou para `None` torna o sistema mais permissivo. Esta solução alternativa tem a desvantagem de que permitir protocolos mais baixos (menos seguros) pode ter consequências adversas de segurança.

  + Se você não puder ou preferir não alterar a configuração TLS do sistema *host*, altere as aplicações MySQL para usar protocolos TLS mais altos (mais seguros) que sejam permitidos pelo sistema *host*. Isso pode não ser possível para versões mais antigas do MySQL que suportam apenas versões de protocolo inferiores. Por exemplo, TLSv1 é o único protocolo suportado antes do MySQL 5.6.46, então as tentativas de conexão a um Server pré-5.6.46 falham, mesmo que o Client seja de uma versão mais nova do MySQL que suporte versões de protocolo mais altas. Nesses casos, pode ser necessário um *upgrade* para uma versão do MySQL que suporte versões TLS adicionais.

* A *library* SSL. Se a *library* SSL não suportar um protocolo específico, o MySQL também não suportará, e quaisquer partes da discussão a seguir que especifiquem esse protocolo não se aplicarão.

  + Quando compilado usando OpenSSL 1.0.1 ou superior, o MySQL suporta os protocolos TLSv1, TLSv1.1 e TLSv1.2.

  + Quando compilado usando yaSSL, o MySQL suporta os protocolos TLSv1 e TLSv1.1.

  Nota

  É possível compilar o MySQL usando yaSSL como alternativa ao OpenSSL somente antes do MySQL 5.7.28. A partir do MySQL 5.7.28, o suporte ao yaSSL é removido e todas as *builds* do MySQL usam OpenSSL.

#### Configuração do Protocolo TLS de Conexão

No lado do Server, o valor da System Variable [`tls_version`](server-system-variables.html#sysvar_tls_version) determina quais protocolos TLS um Server MySQL permite para conexões criptografadas. O valor de [`tls_version`](server-system-variables.html#sysvar_tls_version) se aplica a conexões de Clients e de *replica servers* usando replicação regular *source/replica*. O valor da variável é uma lista de uma ou mais versões de protocolo separadas por vírgula desta lista (sem distinção entre maiúsculas e minúsculas): TLSv1, TLSv1.1, TLSv1.2. Por padrão, esta variável lista todos os protocolos suportados pela *library* SSL usada para compilar o MySQL (`TLSv1,TLSv1.1,TLSv1.2` para OpenSSL, `TLSv1,TLSv1.1` para yaSSL). Para determinar o valor de [`tls_version`](server-system-variables.html#sysvar_tls_version) em tempo de execução, use esta instrução:

```sql
mysql> SHOW GLOBAL VARIABLES LIKE 'tls_version';
+---------------+-----------------------+
| Variable_name | Value                 |
+---------------+-----------------------+
| tls_version   | TLSv1,TLSv1.1,TLSv1.2 |
+---------------+-----------------------+
```

Para alterar o valor de [`tls_version`](server-system-variables.html#sysvar_tls_version), defina-o na inicialização do Server. Por exemplo, para permitir conexões que usem o protocolo TLSv1.1 ou TLSv1.2, mas proibir conexões que usem o protocolo TLSv1, menos seguro, use estas linhas no arquivo `my.cnf` do Server:

```sql
[mysqld]
tls_version=TLSv1.1,TLSv1.2
```

Para ser ainda mais restritivo e permitir apenas conexões TLSv1.2, defina [`tls_version`](server-system-variables.html#sysvar_tls_version) desta forma (assumindo que seu Server esteja compilado usando OpenSSL, pois yaSSL não suporta TLSv1.2):

```sql
[mysqld]
tls_version=TLSv1.2
```

Nota

A partir do MySQL 5.7.35, os protocolos de conexão TLSv1 e TLSv1.1 são descontinuados e o suporte a eles está sujeito a remoção em uma versão futura do MySQL. Consulte [Protocolos TLS Descontinuados](encrypted-connection-protocols-ciphers.html#encrypted-connection-deprecated-protocols "Deprecated TLS Protocols").

No lado do Client, a opção [`--tls-version`](connection-options.html#option_general_tls-version) especifica quais protocolos TLS um programa Client permite para conexões com o Server. O formato do valor da opção é o mesmo que para a System Variable [`tls_version`](server-system-variables.html#sysvar_tls_version) descrita anteriormente (uma lista de uma ou mais versões de protocolo separadas por vírgula).

Para replicação *source/replica*, a opção `MASTER_TLS_VERSION` para a instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") especifica quais protocolos TLS um *replica server* permite para conexões com a *source*. O formato do valor da opção é o mesmo que para a System Variable [`tls_version`](server-system-variables.html#sysvar_tls_version) descrita anteriormente. Consulte [Seção 16.3.8, “Configurando a Replicação para Usar Conexões Criptografadas”](replication-encrypted-connections.html "16.3.8 Setting Up Replication to Use Encrypted Connections").

Os protocolos que podem ser especificados para `MASTER_TLS_VERSION` dependem da *library* SSL. Esta opção é independente e não é afetada pelo valor [`tls_version`](server-system-variables.html#sysvar_tls_version) do Server. Por exemplo, um Server que atua como *replica* pode ser configurado com [`tls_version`](server-system-variables.html#sysvar_tls_version) definido como TLSv1.2 para permitir apenas conexões de entrada que usem TLSv1.2, mas também configurado com `MASTER_TLS_VERSION` definido como TLSv1.1 para permitir apenas TLSv1.1 para conexões de *replica* de saída para a *source*.

A configuração do protocolo TLS afeta qual protocolo uma determinada conexão usa, conforme descrito em [Negociação do Protocolo TLS de Conexão](encrypted-connection-protocols-ciphers.html#encrypted-connection-protocol-negotiation "Connection TLS Protocol Negotiation").

Os protocolos permitidos devem ser escolhidos de forma a não deixar "buracos" (*holes*) na lista. Por exemplo, estes valores de configuração do Server não têm buracos:

```sql
tls_version=TLSv1,TLSv1.1,TLSv1.2
tls_version=TLSv1.1,TLSv1.2
tls_version=TLSv1.2
```

Este valor tem um buraco e não deve ser usado:

```sql
tls_version=TLSv1,TLSv1.2       (TLSv1.1 is missing)
```

A proibição de buracos também se aplica em outros contextos de configuração, como para Clients ou Replicas.

A menos que você pretenda desabilitar conexões criptografadas, a lista de protocolos permitidos não deve estar vazia. Se você definir um parâmetro de versão TLS como uma *string* vazia, conexões criptografadas não poderão ser estabelecidas:

* [`tls_version`](server-system-variables.html#sysvar_tls_version): O Server não permite conexões de entrada criptografadas.

* [`--tls-version`](connection-options.html#option_general_tls-version): O Client não permite conexões de saída criptografadas para o Server.

* `MASTER_TLS_VERSION`: A Replica não permite conexões de saída criptografadas para a Source.

#### Protocolos TLS Descontinuados

A partir do MySQL 5.7.35, os protocolos de conexão TLSv1 e TLSv1.1 são descontinuados e o suporte a eles está sujeito a remoção em uma versão futura do MySQL. (Para contexto, consulte o memorando IETF [Deprecating TLSv1.0 and TLSv1.1](https://tools.ietf.org/id/draft-ietf-tls-oldversions-deprecate-02.html).) É recomendado que as conexões sejam feitas usando os protocolos mais seguros TLSv1.2 e TLSv1.3. O TLSv1.3 requer que tanto o Server MySQL quanto o aplicativo Client sejam compilados com OpenSSL 1.1.1 ou superior.

No lado do Server, esta descontinuação tem os seguintes efeitos:

* Se a System Variable [`tls_version`](server-system-variables.html#sysvar_tls_version) receber um valor contendo um protocolo TLS descontinuado durante a inicialização do Server, o Server registra um aviso (*warning*) para cada protocolo descontinuado no *error log*.

* Se um Client se conectar com sucesso usando um protocolo TLS descontinuado, o Server registra um aviso no *error log*.

No lado do Client, a descontinuação não tem efeito visível. Os Clients não emitem um aviso se configurados para permitir um protocolo TLS descontinuado. Isso inclui:

* Programas Client que suportam a opção [`--tls-version`](connection-options.html#option_general_tls-version) para especificar protocolos TLS para conexões com o Server MySQL.

* Instruções que permitem que Replicas especifiquem protocolos TLS para conexões com o *source server*. (A instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") tem uma opção `MASTER_TLS_VERSION`.)

#### Configuração de Cipher de Conexão

Um conjunto padrão de *ciphers* se aplica a conexões criptografadas, o qual pode ser substituído pela configuração explícita dos *ciphers* permitidos. Durante o estabelecimento da conexão, ambos os lados de uma conexão devem permitir algum *cipher* em comum ou a conexão falhará. Dos *ciphers* permitidos comuns a ambos os lados, a *library* SSL escolhe aquele suportado pelo certificado fornecido que tiver a prioridade mais alta.

Para especificar um ou mais *ciphers* para conexões criptografadas, defina a System Variable [`ssl_cipher`](server-system-variables.html#sysvar_ssl_cipher) no lado do Server e use a opção [`--ssl-cipher`](connection-options.html#option_general_ssl-cipher) para programas Client.

Para conexões de replicação *source/replica*, onde esta instância do Server é a *source*, defina a System Variable [`ssl_cipher`](server-system-variables.html#sysvar_ssl_cipher). Onde esta instância do Server é a *replica*, use a opção `MASTER_SSL_CIPHER` para a instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement"). Consulte [Seção 16.3.8, “Configurando a Replicação para Usar Conexões Criptografadas”](replication-encrypted-connections.html "16.3.8 Setting Up Replication to Use Encrypted Connections").

Um determinado *cipher* pode funcionar apenas com protocolos TLS específicos, o que afeta o processo de negociação do protocolo TLS. Consulte [Negociação do Protocolo TLS de Conexão](encrypted-connection-protocols-ciphers.html#encrypted-connection-protocol-negotiation "Connection TLS Protocol Negotiation").

Para determinar quais *ciphers* um determinado Server suporta, verifique o valor de sessão da Status Variable [`Ssl_cipher_list`](server-status-variables.html#statvar_Ssl_cipher_list):

```sql
SHOW SESSION STATUS LIKE 'Ssl_cipher_list';
```

A Status Variable [`Ssl_cipher_list`](server-status-variables.html#statvar_Ssl_cipher_list) lista os *ciphers* SSL possíveis (vazio para conexões não-SSL). O conjunto de *ciphers* disponíveis depende da sua versão do MySQL e se o MySQL foi compilado usando OpenSSL ou yaSSL e (para OpenSSL) a versão da *library* usada para compilar o MySQL.

Nota

Os *ciphers* ECDSA funcionam apenas em combinação com um certificado SSL que usa ECDSA para a assinatura digital, e não funcionam com certificados que usam RSA. O processo de geração automática do Server MySQL para certificados SSL não gera certificados assinados por ECDSA, ele gera apenas certificados assinados por RSA. Não selecione *ciphers* ECDSA a menos que você tenha um certificado ECDSA disponível.

O MySQL passa uma lista de *ciphers* padrão para a *library* SSL.

O MySQL passa esta lista de *ciphers* padrão para o OpenSSL:

```sql
ECDHE-ECDSA-AES128-GCM-SHA256
ECDHE-ECDSA-AES256-GCM-SHA384
ECDHE-RSA-AES128-GCM-SHA256
ECDHE-RSA-AES256-GCM-SHA384
ECDHE-ECDSA-AES128-SHA256
ECDHE-RSA-AES128-SHA256
ECDHE-ECDSA-AES256-SHA384
ECDHE-RSA-AES256-SHA384
DHE-RSA-AES128-GCM-SHA256
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
DHE-RSA-AES256-GCM-SHA384
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

O MySQL passa esta lista de *ciphers* padrão para o yaSSL:

```sql
DHE-RSA-AES256-SHA
DHE-RSA-AES128-SHA
AES128-RMD
DES-CBC3-RMD
DHE-RSA-AES256-RMD
DHE-RSA-AES128-RMD
DHE-RSA-DES-CBC3-RMD
AES256-SHA
RC4-SHA
RC4-MD5
DES-CBC3-SHA
DES-CBC-SHA
EDH-RSA-DES-CBC3-SHA
EDH-RSA-DES-CBC-SHA
AES128-SHA:AES256-RMD
```

A partir do MySQL 5.7.10, estas restrições de *cipher* estão em vigor:

* Os seguintes *ciphers* são permanentemente restritos:

  ```sql
  !DHE-DSS-DES-CBC3-SHA
  !DHE-RSA-DES-CBC3-SHA
  !ECDH-RSA-DES-CBC3-SHA
  !ECDH-ECDSA-DES-CBC3-SHA
  !ECDHE-RSA-DES-CBC3-SHA
  !ECDHE-ECDSA-DES-CBC3-SHA
  ```

* As seguintes categorias de *ciphers* são permanentemente restritas:

  ```sql
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

Se o Server for iniciado com a System Variable [`ssl_cert`](server-system-variables.html#sysvar_ssl_cert) definida para um certificado que usa qualquer um dos *ciphers* ou categorias de *cipher* restritos acima, o Server inicia com o suporte a conexões criptografadas desabilitado.

#### Negociação do Protocolo TLS de Conexão

As tentativas de conexão no MySQL negociam o uso da versão de protocolo TLS mais alta disponível em ambos os lados para a qual um *cipher* de criptografia compatível com o protocolo esteja disponível em ambos os lados. O processo de negociação depende de fatores como a *library* SSL usada para compilar o Server e o Client, a configuração do protocolo TLS e do *cipher* de criptografia, e qual tamanho de chave é usado:

* Para que uma tentativa de conexão seja bem-sucedida, a configuração do protocolo TLS do Server e do Client deve permitir algum protocolo em comum.

* Da mesma forma, a configuração do *cipher* de criptografia do Server e do Client deve permitir algum *cipher* em comum. Um determinado *cipher* pode funcionar apenas com protocolos TLS específicos, portanto, um protocolo disponível para o processo de negociação não é escolhido a menos que também haja um *cipher* compatível.

* Se o Server e o Client forem compilados usando OpenSSL, o TLSv1.2 será usado se possível. Se um ou ambos, Server e Client, forem compilados usando yaSSL, o TLSv1.1 será usado se possível. ("Possível" significa que a configuração do Server e do Client devem permitir o protocolo indicado, e ambos também devem permitir algum *cipher* de criptografia compatível com o protocolo.) Caso contrário, o MySQL continua através da lista de protocolos disponíveis, prosseguindo dos protocolos mais seguros para os menos seguros. A ordem de negociação é independente da ordem em que os protocolos são configurados. Por exemplo, a ordem de negociação é a mesma, independentemente de [`tls_version`](server-system-variables.html#sysvar_tls_version) ter um valor de `TLSv1,TLSv1.1,TLSv1.2` ou `TLSv1.2,TLSv1.1,TLSv1`.

  Nota

  Antes do MySQL 5.7.10, o MySQL suportava apenas TLSv1, tanto para OpenSSL quanto para yaSSL, e não existia System Variable ou opção de Client para especificar quais protocolos TLS permitir.

* O TLSv1.2 não funciona com todos os *ciphers* que possuem um tamanho de chave de 512 *bits* ou menos. Para usar este protocolo com tal chave, defina a System Variable [`ssl_cipher`](server-system-variables.html#sysvar_ssl_cipher) no lado do Server ou use a opção Client [`--ssl-cipher`](connection-options.html#option_general_ssl-cipher) para especificar o nome do *cipher* explicitamente:

  ```sql
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

* Para melhor segurança, use um certificado com um tamanho de chave RSA de pelo menos 2048 *bits*.

Se o Server e o Client não tiverem um protocolo permitido em comum e um *cipher* compatível com o protocolo em comum, o Server encerra a solicitação de conexão. Exemplos:

* Se o Server estiver configurado com [`tls_version=TLSv1.1,TLSv1.2`](server-system-variables.html#sysvar_tls_version):

  + As tentativas de conexão falham para Clients invocados com [`--tls-version=TLSv1`](connection-options.html#option_general_tls-version) e para Clients mais antigos que suportam apenas TLSv1.

  + Da mesma forma, as tentativas de conexão falham para Replicas configuradas com `MASTER_TLS_VERSION = 'TLSv1'` e para Replicas mais antigas que suportam apenas TLSv1.

* Se o Server estiver configurado com [`tls_version=TLSv1`](server-system-variables.html#sysvar_tls_version) ou for um Server mais antigo que suporta apenas TLSv1:

  + As tentativas de conexão falham para Clients invocados com [`--tls-version=TLSv1.1,TLSv1.2`](connection-options.html#option_general_tls-version).

  + Da mesma forma, as tentativas de conexão falham para Replicas configuradas com `MASTER_TLS_VERSION = 'TLSv1.1,TLSv1.2'`.

O MySQL permite especificar uma lista de protocolos a serem suportados. Esta lista é passada diretamente para a *library* SSL subjacente e cabe, em última análise, a essa *library* quais protocolos ela realmente habilita a partir da lista fornecida. Consulte o código-fonte do MySQL e a documentação do OpenSSL [`SSL_CTX_new()`](https://www.openssl.org/docs/man1.1.0/ssl/SSL_CTX_new.html) para obter informações sobre como a *library* SSL lida com isso.

#### Monitoramento do Protocolo TLS e Cipher da Sessão Client Atual

Para determinar qual protocolo TLS de criptografia e *cipher* a sessão Client atual usa, verifique os valores de sessão das Status Variables [`Ssl_version`](server-status-variables.html#statvar_Ssl_version) e [`Ssl_cipher`](server-status-variables.html#statvar_Ssl_cipher):

```sql
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
