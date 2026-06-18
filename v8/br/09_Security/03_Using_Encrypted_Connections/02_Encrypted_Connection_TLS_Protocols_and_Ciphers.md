### 8.3.2 Conexão Encriptada Protocolos e Cifras TLS

O MySQL suporta vários protocolos e cifra TLS e permite configurar quais protocolos e cifra devem ser permitidos para conexões criptografadas. Também é possível determinar qual protocolo e cifra a sessão atual está usando.

- Protocolos TLS suportados
- Remoção do suporte aos protocolos TLSv1 e TLSv1.1
- Configuração do Protocolo TLS de Conexão
- Configuração do Cipher de Conexão
- Negociação do Protocolo TLS de Conexão
- Monitoramento da sessão atual do cliente TLS Protocol e Cipher

#### Protocolos TLS suportados

O conjunto de protocolos permitidos para conexões a uma instância específica do servidor MySQL está sujeito a vários fatores, conforme descrito a seguir:

Lançamento do MySQL Server: \* Até e incluindo o MySQL 8.0.15, o MySQL suporta os protocolos TLSv1, TLSv1.1 e TLSv1.2.

```
* As of MySQL 8.0.16, MySQL also supports the TLSv1.3 protocol. To use TLSv1.3, both the MySQL server and the client application must be compiled using OpenSSL 1.1.1 or higher. The Group Replication component supports TLSv1.3 from MySQL 8.0.18 (for details, see Section 20.6.2, “Securing Group Communication Connections with Secure Socket Layer (SSL)”")).

* As of MySQL 8.0.26, the TLSv1 and TLSv1.1 protocols are deprecated. These protocol versions are old, released in 1996 and 2006, respectively, and the algorithms used are weak and outdated. For background, refer to the IETF memo Deprecating TLSv1.0 and TLSv1.1.

* As of MySQL 8.0.28, MySQL no longer supports the TLSv1 and TLSv1.1 protocols. From this release, clients cannot make a TLS/SSL connection with the protocol set to TLSv1 or TLSv1.1. For more details, see Removal of Support for the TLSv1 and TLSv1.1 Protocols.

**Table 8.13 MySQL Server TLS Protocol Support**

<table><thead><tr> <th>MySQL Server Release</th> <th>TLS Protocols Supported</th> </tr></thead><tbody><tr> <td>MySQL 8.0.15 and below</td> <td>TLSv1, TLSv1.1, TLSv1.2</td> </tr><tr> <td>MySQL 8.0.16 and MySQL 8.0.17</td> <td>TLSv1, TLSv1.1, TLSv1.2, TLSv1.3 (except Group Replication)</td> </tr><tr> <td>MySQL 8.0.18 through MySQL 8.0.25</td> <td>TLSv1, TLSv1.1, TLSv1.2, TLSv1.3 (including Group Replication)</td> </tr><tr> <td>MySQL 8.0.26 and MySQL 8.0.27</td> <td>TLSv1 (deprecated), TLSv1.1 (deprecated), TLSv1.2, TLSv1.3</td> </tr><tr> <td>MySQL 8.0.28 and above</td> <td>TLSv1.2, TLSv1.3</td> </tr></tbody></table>
```

Biblioteca SSL: Se a biblioteca SSL não suportar um protocolo específico, o MySQL também não o suporta, e quaisquer partes da discussão a seguir que especifiquem esse protocolo não se aplicam. Em particular, note que, para usar o TLSv1.3, tanto o servidor MySQL quanto o aplicativo cliente devem ser compilados usando o OpenSSL 1.1.1 ou superior. O MySQL Server verifica a versão do OpenSSL no início e, se for menor que 1.1.1, o TLSv1.3 é removido do valor padrão das variáveis do sistema do servidor relacionadas às versões do TLS (`tls_version`, `admin_tls_version` e `group_replication_recovery_tls_version`).

Configuração da instância do MySQL:   Os protocolos TLS permitidos podem ser configurados tanto no lado do servidor quanto no lado do cliente para incluir apenas um subconjunto dos protocolos TLS suportados. A configuração em ambos os lados deve incluir pelo menos um protocolo em comum, caso contrário, as tentativas de conexão não poderão negociar um protocolo a ser usado. Para obter detalhes, consulte Negociação de Protocolo TLS de Conexão.

Configuração do host em todo o sistema:   O sistema do host pode permitir apenas certos protocolos TLS, o que significa que as conexões do MySQL não podem usar protocolos não permitidos, mesmo que o MySQL próprio os permita:

````
* Suppose that MySQL configuration permits TLSv1, TLSv1.1, and TLSv1.2, but your host system configuration permits only connections that use TLSv1.2 or higher. In this case, you cannot establish MySQL connections that use TLSv1 or TLSv1.1, even though MySQL is configured to permit them, because the host system does not permit them.

* If MySQL configuration permits TLSv1, TLSv1.1, and TLSv1.2, but your host system configuration permits only connections that use TLSv1.3 or higher, you cannot establish MySQL connections at all, because no protocol permitted by MySQL is permitted by the host system.

Workarounds for this issue include:

* Change the system-wide host configuration to permit additional TLS protocols. Consult your operating system documentation for instructions. For example, your system may have an `/etc/ssl/openssl.cnf` file that contains these lines to restrict TLS protocols to TLSv1.2 or higher:

  ```
  [system_default_sect]
  MinProtocol = TLSv1.2
  ```

  Changing the value to a lower protocol version or `None` makes the system more permissive. This workaround has the disadvantage that permitting lower (less secure) protocols may have adverse security consequences.

* If you cannot or prefer not to change the host system TLS configuration, change MySQL applications to use higher (more secure) TLS protocols that are permitted by the host system. This may not be possible for older versions of MySQL that support only lower protocol versions. For example, TLSv1 is the only supported protocol prior to MySQL 5.6.46, so attempts to connect to a pre-5.6.46 server fail even if the client is from a newer MySQL version that supports higher protocol versions. In such cases, an upgrade to a version of MySQL that supports additional TLS versions may be required.
````

#### Remoção do suporte aos protocolos TLSv1 e TLSv1.1

O suporte aos protocolos de conexão TLSv1 e TLSv1.1 foi removido a partir do MySQL 8.0.28. Esses protocolos foram desaconselhados a partir do MySQL 8.0.26. Para informações de fundo, consulte o RFC 8996 (Desaconselhamento do TLS 1.0 e TLS 1.1). Recomenda-se que as conexões sejam feitas usando os protocolos TLSv1.2 e TLSv1.3, que são mais seguros. O TLSv1.3 exige que o servidor MySQL e o aplicativo cliente sejam compilados com o OpenSSL 1.1.1.

O suporte para TLSv1 e TLSv1.1 foi removido porque essas versões de protocolo são antigas, lançadas em 1996 e 2006, respectivamente. Os algoritmos usados são fracos e desatualizados. A menos que você esteja usando versões muito antigas do MySQL Server ou dos conectores, é improvável que você tenha conexões usando TLSv1.0 ou TLSv1.1. Os conectores e clientes do MySQL selecionam a versão TLS mais alta disponível por padrão.

Nas versões onde os protocolos de conexão TLSv1 e TLSv1.1 não são suportados (a partir do MySQL 8.0.28 em diante), clientes, incluindo o MySQL Shell, que suportam a opção `--tls-version` para especificar protocolos TLS para conexões ao servidor MySQL, não podem fazer uma conexão TLS/SSL com o protocolo definido como TLSv1 ou TLSv1.1. Se um cliente tentar se conectar usando esses protocolos, para conexões TCP, a conexão falha e um erro é retornado ao cliente. Para conexões de soquete, se `--ssl-mode` for definido como `REQUIRED`, a conexão falha, caso contrário, a conexão é feita, mas com TLS/SSL desativado.

No lado do servidor, os seguintes ajustes foram alterados a partir do MySQL 8.0.28:

- Os valores padrão das variáveis de sistema `tls_version` e `admin_tls_version` do servidor já não incluem TLSv1 e TLSv1.1.

- O valor padrão da variável de sistema de replicação de grupo `group_replication_recovery_tls_version` já não inclui TLSv1 e TLSv1.1.

- Para a replicação assíncrona, as réplicas não podem definir o protocolo para as conexões ao servidor de origem como TLSv1 ou TLSv1.1 (a opção `SOURCE_TLS_VERSION` da declaração `CHANGE REPLICATION SOURCE TO`).

Nas versões em que os protocolos de conexão TLSv1 e TLSv1.1 são desatualizados (MySQL 8.0.26 e MySQL 8.0.27), o servidor escreve uma mensagem de aviso no log de erro se eles estiverem incluídos nos valores da variável de sistema `tls_version` ou `admin_tls_version` e se um cliente se conectar com sucesso usando eles. Uma mensagem de aviso também é retornada se você definir os protocolos desatualizados em tempo de execução e implementá-los usando a instrução `ALTER INSTANCE RELOAD TLS`. Os clientes, incluindo réplicas que especificam protocolos TLS para conexões com o servidor de origem e membros do grupo de replicação em grupo que especificam protocolos TLS para conexões de recuperação distribuída, não emitem avisos se estiverem configurados para permitir um protocolo TLS desatualizado.

Para obter mais informações, consulte O MySQL 8.0 suporta TLS 1.0 e 1.1?

#### Configuração do Protocolo TLS de Conexão

No lado do servidor, o valor da variável de sistema `tls_version` determina quais protocolos TLS um servidor MySQL permite para conexões criptografadas. O valor `tls_version` se aplica a conexões de clientes, conexões de replicação de origem/replica regulares onde essa instância do servidor é a fonte, conexões de comunicação do grupo de replicação em grupo e conexões de recuperação distribuída de replicação em grupo onde essa instância do servidor é o doador. A interface de conexão administrativa é configurada de maneira semelhante, mas usa a variável de sistema `admin_tls_version` (consulte a Seção 7.1.12.2, “Gestão de Conexão Administrativa”). Esta discussão também se aplica ao `admin_tls_version`.

O valor `tls_version` é uma lista de uma ou mais versões do protocolo TLS separadas por vírgula, que não é case-sensitive. Por padrão, essa variável lista todos os protocolos suportados pela biblioteca SSL usada para compilar o MySQL e pela versão do MySQL Server. Os ajustes padrão, portanto, são os mostrados na Tabela 8.14, “Configurações Padrão do Protocolo TLS do MySQL Server”.

**Tabela 8.14 Configurações padrão do protocolo TLS do servidor MySQL**

<table><thead><tr> <th>Lançamento do MySQL Server</th> <th>[[<code>tls_version</code>]] Definição padrão</th> </tr></thead><tbody><tr> <td>MySQL 8.0.15 e versões anteriores</td> <td><p> [[<code>TLSv1,TLSv1.1,TLSv1.2</code>]] </p></td> </tr><tr> <td>MySQL 8.0.16 e MySQL 8.0.17</td> <td><p> [[<code>TLSv1,TLSv1.1,TLSv1.2,TLSv1.3 (with OpenSSL 1.1.1)</code>]] </p><p> [[<code> TLSv1,TLSv1.1,TLSv1.2 (otherwise) </code>]] </p><p>A replicação em grupo não suporta TLSv1.3</p></td> </tr><tr> <td>MySQL 8.0.18 até MySQL 8.0.25</td> <td><p> [[<code> TLSv1,TLSv1.1,TLSv1.2,TLSv1.3 (with OpenSSL 1.1.1)</code>]] </p><p> [[<code> TLSv1,TLSv1.1,TLSv1.2 (otherwise) </code>]] </p><p>A replicação em grupo suporta TLSv1.3</p></td> </tr><tr> <td>MySQL 8.0.26 e MySQL 8.0.27</td> <td><p> [[<code>TLSv1,TLSv1.1,TLSv1.2,TLSv1.3 (with OpenSSL 1.1.1)</code>]] </p><p> [[<code> TLSv1,TLSv1.1,TLSv1.2 (otherwise) </code>]] </p><p>TLSv1 e TLSv1.1 estão desatualizados</p></td> </tr><tr> <td>MySQL 8.0.28 e superior</td> <td><p> [[<code>TLSv1.2,TLSv1.3</code>]] </p></td> </tr></tbody></table>

Para determinar o valor de `tls_version` em tempo de execução, use esta instrução:

```
mysql> SHOW GLOBAL VARIABLES LIKE 'tls_version';
+---------------+-----------------------+
| Variable_name | Value                 |
+---------------+-----------------------+
| tls_version   | TLSv1.2,TLSv1.3       |
+---------------+-----------------------+
```

Para alterar o valor de `tls_version`, defina-o no início do servidor. Por exemplo, para permitir conexões que utilizam o protocolo TLSv1.2 ou TLSv1.3, mas proibir conexões que utilizam os protocolos TLSv1 e TLSv1.1 menos seguros, use essas linhas no arquivo do servidor `my.cnf`:

```
[mysqld]
tls_version=TLSv1.2,TLSv1.3
```

Para ser ainda mais restritivo e permitir apenas conexões TLSv1.3, defina `tls_version` da seguinte forma:

```
[mysqld]
tls_version=TLSv1.3
```

A partir do MySQL 8.0.16, `tls_version` pode ser alterado em tempo de execução. Consulte Configuração e monitoramento em tempo de execução no lado do servidor para conexões criptografadas.

Do lado do cliente, a opção `--tls-version` especifica quais protocolos TLS um programa cliente permite para conexões com o servidor. O formato do valor da opção é o mesmo da variável de sistema `tls_version` descrita anteriormente (uma lista de uma ou mais versões de protocolo separadas por vírgula).

Para conexões de replicação de origem/replica onde essa instância do servidor é a replica, a opção `SOURCE_TLS_VERSION` | `MASTER_TLS_VERSION` para a declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou a declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23) especifica quais protocolos TLS a replica permite para conexões à origem. O formato do valor da opção é o mesmo que para a variável de sistema `tls_version` descrita anteriormente. Veja a Seção 19.3.1, “Configurando a Replicação para Usar Conexões Encriptadas”.

Os protocolos que podem ser especificados para `SOURCE_TLS_VERSION` | `MASTER_TLS_VERSION` dependem da biblioteca SSL. Esta opção é independente e não afetada pelo valor do servidor `tls_version`. Por exemplo, um servidor que atua como replica pode ser configurado com `tls_version` definido como TLSv1.3 para permitir apenas conexões de entrada que utilizam TLSv1.3, mas também configurado com `SOURCE_TLS_VERSION` | `MASTER_TLS_VERSION` definido como TLSv1.2 para permitir apenas TLSv1.2 para conexões de replica de saída para a origem.

Para a replicação em grupo, as conexões de recuperação distribuída onde essa instância do servidor é o membro que está se juntando e inicia a recuperação distribuída (ou seja, o cliente), a variável de sistema `group_replication_recovery_tls_version` especifica quais protocolos são permitidos pelo cliente. Novamente, essa opção é independente e não afetada pelo valor do servidor `tls_version`, que se aplica quando essa instância do servidor é o doador. Um servidor de replicação em grupo geralmente participa da recuperação distribuída tanto como doador quanto como membro que está se juntando ao longo de sua participação no grupo, portanto, ambas as variáveis de sistema devem ser definidas. Veja a Seção 20.6.2, “Segurança das Conexões de Comunicação de Grupo com Secure Socket Layer (SSL”)”).

A configuração do protocolo TLS afeta o protocolo utilizado por uma conexão específica, conforme descrito na Negação de Protocolo TLS da Conexão.

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

A menos que você pretenda desativar as conexões criptografadas, a lista de protocolos permitidos não deve estar vazia. Se você definir um parâmetro de versão TLS para a string vazia, as conexões criptografadas não podem ser estabelecidas:

- `tls_version`: O servidor não permite conexões recebidas criptografadas.

- `--tls-version`: O cliente não permite conexões saídas criptografadas para o servidor.

- `SOURCE_TLS_VERSION` | `MASTER_TLS_VERSION`: A réplica não permite conexões saídas criptografadas para a fonte.

- `group_replication_recovery_tls_version`: O membro de conexão não permite conexões criptografadas à conexão de recuperação distribuída.

#### Configuração do Cipher de Conexão

Um conjunto padrão de cifra é aplicado às conexões criptografadas, que podem ser substituídas por meio da configuração explícita dos cifras permitidos. Durante o estabelecimento da conexão, ambos os lados de uma conexão devem permitir algum cifrado em comum, caso contrário, a conexão falha. Dos cifrados permitidos comuns a ambos os lados, a biblioteca SSL escolhe o que é suportado pelo certificado fornecido que tem a maior prioridade.

Para especificar um ou mais algoritmos de criptografia aplicáveis para conexões criptografadas que utilizam protocolos TLS até o TLSv1.2:

- Defina a variável de sistema `ssl_cipher` no lado do servidor e use a opção `--ssl-cipher` nos programas do cliente.

- Para conexões de replicação de origem/replica regulares, onde essa instância do servidor é a origem, defina a variável de sistema `ssl_cipher`. Onde essa instância do servidor é a replica, use a opção `SOURCE_SSL_CIPHER` | `MASTER_SSL_CIPHER` para a declaração `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou a declaração `CHANGE MASTER TO` (antes do MySQL 8.0.23). Veja a Seção 19.3.1, “Configurando a Replicação para Usar Conexões Encriptadas”.

- Para um membro do grupo de replicação em grupo, para conexões de comunicação do grupo de replicação em grupo e também para conexões de recuperação distribuída de replicação em grupo, onde essa instância do servidor é o doador, defina a variável de sistema `ssl_cipher`. Para conexões de recuperação distribuída de replicação em grupo onde essa instância do servidor é o membro que está se juntando, use a variável de sistema `group_replication_recovery_ssl_cipher`. Consulte a Seção 20.6.2, “Segurança das Conexões de Comunicação do Grupo com Secure Socket Layer (SSL”)”).

Para conexões criptografadas que utilizam TLSv1.3, o OpenSSL 1.1.1 e versões superiores suportam as seguintes suítes de criptografia, das quais as três primeiras são ativadas por padrão:

```
TLS_AES_128_GCM_SHA256
TLS_AES_256_GCM_SHA384
TLS_CHACHA20_POLY1305_SHA256
TLS_AES_128_CCM_SHA256
```

Nota

Antes do MySQL 8.0.35, o `TLS_AES_128_CCM_8_SHA256` era suportado para uso com as variáveis de sistema do servidor `--tls-ciphersuites` ou `--admin-tls-ciphersuites`. `TLS_AES_128_CCM_8_SHA256` gera uma mensagem de aviso de depreciação se configurado para o MySQL 8.0.35 e versões posteriores.

Para configurar explicitamente as suíte de cifras TLSv1.3 permitidas, defina os seguintes parâmetros. Em cada caso, o valor de configuração é uma lista de zero ou mais nomes de suíte de cifras separados por vírgula.

- No lado do servidor, use a variável de sistema `tls_ciphersuites`. Se essa variável não for definida, seu valor padrão é `NULL`, o que significa que o servidor permite o conjunto padrão de suítes de cifra. Se a variável for definida como uma string vazia, nenhuma suíte de cifra será habilitada e conexões criptografadas não poderão ser estabelecidas.

- Do lado do cliente, use a opção `--tls-ciphersuites`. Se essa opção não for definida, o cliente permite o conjunto padrão de suítes de cifra. Se a opção for definida como uma string vazia, nenhuma suíte de cifra será habilitada e conexões criptografadas não poderão ser estabelecidas.

- Para conexões de replicação de origem/replica regulares, onde essa instância do servidor é a origem, use a variável de sistema `tls_ciphersuites`. Onde essa instância do servidor é a replica, use a opção `SOURCE_TLS_CIPHERSUITES` | `MASTER_TLS_CIPHERSUITES` para a instrução `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou a instrução `CHANGE MASTER TO` (antes do MySQL 8.0.23). Veja a Seção 19.3.1, “Configurando a Replicação para Usar Conexões Encriptadas”.

- Para um membro do grupo de replicação em grupo, para conexões de comunicação do grupo de replicação em grupo e também para conexões de recuperação distribuída de replicação em grupo, onde essa instância do servidor é o doador, use a variável de sistema `tls_ciphersuites`. Para conexões de recuperação distribuída de replicação em grupo onde essa instância do servidor é o membro que está se juntando, use a variável de sistema `group_replication_recovery_tls_ciphersuites`. Consulte a Seção 20.6.2, “Segurança das conexões de comunicação de grupo com Secure Socket Layer (SSL”)”).

Nota

O suporte ao Ciphersuite está disponível a partir do MySQL 8.0.16, mas exige que o servidor MySQL e o aplicativo cliente sejam compilados usando o OpenSSL 1.1.1 ou superior.

Nos lançamentos do MySQL 8.0.16 a 8.0.18, a variável de sistema `group_replication_recovery_tls_ciphersuites` e a opção `SOURCE_TLS_CIPHERSUITES` | `MASTER_TLS_CIPHERSUITES` para a instrução `CHANGE REPLICATION SOURCE TO` (a partir do MySQL 8.0.23) ou a instrução `CHANGE MASTER TO` (antes do MySQL 8.0.23) não estão disponíveis. Nesses lançamentos, se o TLSv1.3 for usado para conexões de replicação de origem/replica, ou na Replicação em Grupo para recuperação distribuída (suportada a partir do MySQL 8.0.18), os servidores de origem da replicação ou do doador da Replicação em Grupo devem permitir o uso de pelo menos um conjunto de criptografia TLSv1.3 habilitado por padrão. A partir do MySQL 8.0.19, você pode usar as opções para configurar o suporte ao cliente para qualquer seleção de conjuntos de criptografia, incluindo apenas conjuntos de criptografia não padrão, se desejar.

Um cifrador pode funcionar apenas com certos protocolos TLS, o que afeta o processo de negociação do protocolo TLS. Veja Negociação de Protocolo TLS da Conexão.

Para determinar quais cifras um servidor específico suporta, verifique o valor da sessão da variável de status `Ssl_cipher_list`:

```
SHOW SESSION STATUS LIKE 'Ssl_cipher_list';
```

A variável de status `Ssl_cipher_list` lista os possíveis cifradores SSL (vazio para conexões não SSL). Se o MySQL suportar TLSv1.3, o valor inclui os possíveis cifradores TLSv1.3.

Nota

Os cifradores ECDSA só funcionam em combinação com um certificado SSL que usa ECDSA para a assinatura digital, e não funcionam com certificados que usam RSA. O processo de geração automática do MySQL Server para certificados SSL não gera certificados assinados com ECDSA, ele gera apenas certificados assinados com RSA. Não selecione cifradores ECDSA a menos que você tenha um certificado ECDSA disponível.

Para conexões criptografadas que utilizam TLS.v1.3, o MySQL usa a lista de conjuntos de cifras padrão da biblioteca SSL.

Para conexões criptografadas que utilizam os protocolos TLS até o TLSv1.2, o MySQL passa a seguinte lista de cifra padrão para a biblioteca SSL.

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

Estão em vigor as seguintes restrições de criptografia:

- A partir do MySQL 8.0.35, os seguintes cifrados são desaconselhados e geram uma mensagem de aviso quando usados com as variáveis do sistema do servidor `--ssl-cipher` e `--admin-ssl-cipher`:

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

- Os seguintes cifrados estão permanentemente restritos:

  ```
  !DHE-DSS-DES-CBC3-SHA
  !DHE-RSA-DES-CBC3-SHA
  !ECDH-RSA-DES-CBC3-SHA
  !ECDH-ECDSA-DES-CBC3-SHA
  !ECDHE-RSA-DES-CBC3-SHA
  !ECDHE-ECDSA-DES-CBC3-SHA
  ```

- As seguintes categorias de cifra são permanentemente restritas:

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

Se o servidor for iniciado com a variável de sistema `ssl_cert` definida para um certificado que utiliza qualquer um dos cifradores ou categorias de cifradores restritos anteriores, o servidor será iniciado com o suporte para conexões criptografadas desativado.

#### Negociação do Protocolo TLS de Conexão

As tentativas de conexão no MySQL negociam o uso da versão mais alta do protocolo TLS disponível em ambos os lados, para a qual um algoritmo de criptografia compatível com o protocolo esteja disponível em ambos os lados. O processo de negociação depende de fatores como a biblioteca SSL usada para compilar o servidor e o cliente, a configuração do protocolo e do algoritmo de criptografia TLS, e o tamanho da chave utilizado:

- Para que a tentativa de conexão seja bem-sucedida, a configuração do protocolo TLS do servidor e do cliente deve permitir algum protocolo em comum.

- Da mesma forma, a configuração da criptografia do servidor e do cliente deve permitir que alguns algoritmos sejam usados em comum. Um determinado algoritmo pode funcionar apenas com certos protocolos TLS, então um protocolo disponível para o processo de negociação não é escolhido a menos que haja também um algoritmo compatível.

- Se o TLSv1.3 estiver disponível, ele será usado, se possível. (Isso significa que tanto a configuração do servidor quanto a do cliente devem permitir o TLSv1.3, e ambos também devem permitir algum algoritmo de criptografia compatível com o TLSv1.3.) Caso contrário, o MySQL continua na lista de protocolos disponíveis, usando o TLSv1.2, se possível, e assim por diante. A negociação prossegue de protocolos mais seguros para menos seguros. A ordem da negociação é independente da ordem em que os protocolos são configurados. Por exemplo, a ordem da negociação é a mesma, independentemente de `tls_version` ter um valor de `TLSv1,TLSv1.1,TLSv1.2,TLSv1.3` ou `TLSv1.3,TLSv1.2,TLSv1.1,TLSv1`.

- O TLSv1.2 não funciona com todos os criptogramas que têm um tamanho de chave de 512 bits ou menos. Para usar este protocolo com uma chave desse tamanho, defina a variável de sistema `ssl_cipher` no lado do servidor ou use a opção `--ssl-cipher` do cliente para especificar o nome do criptograma explicitamente:

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

- Para uma melhor segurança, use um certificado com um tamanho de chave RSA de pelo menos 2048 bits.

Se o servidor e o cliente não tiverem um protocolo permitido em comum e um cifrador compatível com o protocolo em comum, o servidor encerra a solicitação de conexão. Exemplos:

- Se o servidor estiver configurado com `tls_version=TLSv1.1,TLSv1.2`:

  - As tentativas de conexão falham para clientes invocados com `--tls-version=TLSv1` e para clientes mais antigos que suportam apenas TLSv1.

  - Da mesma forma, as tentativas de conexão falham para réplicas configuradas com `MASTER_TLS_VERSION = 'TLSv1'` e para réplicas mais antigas que suportam apenas TLSv1.

- Se o servidor estiver configurado com `tls_version=TLSv1` ou for um servidor mais antigo que suporte apenas TLSv1:

  - As tentativas de conexão falham para clientes invocados com `--tls-version=TLSv1.1,TLSv1.2`.

  - Da mesma forma, as tentativas de conexão falham para réplicas configuradas com `MASTER_TLS_VERSION = 'TLSv1.1,TLSv1.2'`.

O MySQL permite especificar uma lista de protocolos a serem suportados. Essa lista é passada diretamente para a biblioteca SSL subjacente e, no final, cabe a essa biblioteca determinar quais protocolos ela realmente habilita da lista fornecida. Consulte o código-fonte do MySQL e a documentação do OpenSSL `SSL_CTX_new()` para obter informações sobre como a biblioteca SSL lida com isso.

#### Monitoramento da sessão atual do cliente TLS Protocol e Cipher

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
