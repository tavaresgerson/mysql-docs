### 8.3.2 Conexão Encriptada Protocolos e Cifras TLS

O MySQL suporta vários protocolos e cifras TLS, e permite configurar quais protocolos e cifras permitir para conexões encriptadas. Também é possível determinar qual protocolo e cifra a sessão atual usa.

*  Protocolos TLS suportados
*  Remoção do suporte aos protocolos TLSv1 e TLSv1.1
*  Configuração do protocolo TLS da conexão
*  Configuração da cifra da conexão
*  Negociação do protocolo TLS da conexão
*  Monitoramento do protocolo e cifra do TLS da sessão atual do cliente

#### Protocolos TLS suportados

O MySQL 8.4 suporta os protocolos TLSv1.2 e TLSv1.3 para conexões. Para usar o TLSv1.3, tanto o servidor MySQL quanto o aplicativo cliente devem ser compilados usando o OpenSSL 1.1.1 ou superior. O componente de Replicação em Grupo suporta TLSv1.3 a partir do MySQL 8.0.18 (para detalhes, consulte a Seção 20.6.2, “Segurança das conexões de comunicação de grupo com Secure Socket Layer (SSL”)").

O MySQL 8.4 não suporta os antigos protocolos TLSv1 e TLSv1.1.

Os protocolos TLS permitidos podem ser configurados tanto no lado do servidor quanto no lado do cliente para incluir apenas um subconjunto dos protocolos TLS suportados. A configuração em ambos os lados deve incluir pelo menos um protocolo em comum, ou as tentativas de conexão não podem negociar um protocolo a ser usado. Para detalhes, consulte Negociação do Protocolo TLS da Conexão.

O sistema hospedeiro pode permitir apenas certos protocolos TLS, o que significa que as conexões MySQL não podem usar protocolos não permitidos pelo hospedeiro, mesmo que o MySQL próprio os permita. Possíveis soluções para esse problema incluem as seguintes:

* Altere a configuração de host em todo o sistema para permitir protocolos TLS adicionais. Consulte a documentação do seu sistema operacional para obter instruções. Por exemplo, seu sistema pode ter um arquivo `/etc/ssl/openssl.cnf` que contém essas linhas para restringir os protocolos TLS a TLSv1.3 ou superior:

  ```
  [system_default_sect]
  MinProtocol = TLSv1.3
  ```

Alterar o valor para uma versão de protocolo mais baixa ou `None` torna o sistema mais permissivo. Essa solução tem a desvantagem de que permitir protocolos mais baixos (menos seguros) pode ter consequências adversas para a segurança.
* Se você não puder ou preferir não alterar a configuração do sistema hospedeiro TLS, altere as aplicações do MySQL para usar protocolos TLS mais seguros (TLSv1.2 ou superior) que sejam permitidos pelo sistema hospedeiro. Isso pode não ser possível para versões mais antigas do MySQL que suportam apenas versões de protocolo mais baixas. Por exemplo, TLSv1 é o único protocolo suportado antes do MySQL 5.6.46, então tentativas de se conectar a um servidor anterior a 5.6.46 falham mesmo que o cliente seja de uma versão mais recente do MySQL que suporte versões de protocolo mais altas. Nesse caso, pode ser necessário fazer uma atualização para uma versão do MySQL que suporte versões adicionais de TLS.

Configuração do sistema: * Se a configuração do MySQL permitir TLSv1.2 e a configuração do sistema hospedeiro permitir apenas conexões que usem TLSv1.2 ou superior, você pode estabelecer conexões do MySQL usando apenas TLSv1.2.
    * Suponha que a configuração do MySQL permita TLSv1.2, mas a configuração do sistema hospedeiro permita apenas conexões que usem TLSv1.3 ou superior. Se esse for o caso, você não poderá estabelecer conexões do MySQL, porque nenhum protocolo permitido pelo MySQL é permitido pelo sistema hospedeiro.

#### Remoção do Suporte aos Protocolos TLSv1 e TLSv1.1

O suporte aos protocolos de conexão TLSv1 e TLSv1.1 foi descontinuado e removido no MySQL 8.0. Para informações de fundo, consulte [RFC 8996](https://tools.ietf.org/html/rfc8996) (Deprecating TLS 1.0 and TLS 1.1). No MySQL 8.4, as conexões podem ser feitas usando apenas os protocolos TLSv1.2 e TLSv1.3 mais seguros. TLSv1.3 exige que tanto o servidor do MySQL quanto o aplicativo cliente sejam compilados com OpenSSL 1.1.1.

Para mais informações, consulte O MySQL 8.4 suporta TLS 1.0 e 1.1?

#### Configuração do Protocolo de Conexão TLS

No lado do servidor, o valor da variável de sistema `tls_version` determina quais protocolos TLS um servidor MySQL permite para conexões criptografadas. O valor `tls_version` se aplica a conexões de clientes, conexões de replicação de origem/replica regulares onde essa instância do servidor é a origem, conexões de comunicação de grupo de replicação de grupo e conexões de recuperação distribuída de replicação de grupo onde essa instância do servidor é o doador. A interface de conexão administrativa é configurada de forma semelhante, mas usa a variável de sistema `admin_tls_version` (consulte a Seção 7.1.12.2, “Gestão de Conexão Administrativa”). Esta discussão também se aplica a `admin_tls_version`.

O valor `tls_version` é uma lista de uma ou mais versões de protocolos TLS separadas por vírgula, que não é case-sensitive. Por padrão, essa variável lista todos os protocolos suportados pela biblioteca SSL usada para compilar o MySQL e pela versão do MySQL Server. Os ajustes padrão, portanto, são os mostrados em Configurações Padrão de Protocolo TLS do MySQL Server.

Para determinar o valor de `tls_version` em tempo de execução, use esta instrução:

```
mysql> SHOW GLOBAL VARIABLES LIKE 'tls_version';
+---------------+-----------------------+
| Variable_name | Value                 |
+---------------+-----------------------+
| tls_version   | TLSv1.2,TLSv1.3       |
+---------------+-----------------------+
```

Para alterar o valor de `tls_version`, defina-o na inicialização do servidor. Por exemplo, para permitir conexões que usam o protocolo TLSv1.2 ou TLSv1.3, mas proibir conexões que usam qualquer outro protocolo, use essas linhas no arquivo `my.cnf` do servidor:

```
[mysqld]
tls_version=TLSv1.2,TLSv1.3
```

Para ser ainda mais restritivo e permitir apenas conexões TLSv1.3, defina `tls_version` da seguinte forma:

```
[mysqld]
tls_version=TLSv1.3
```

`tls_version` pode ser alterado em tempo de execução. Consulte Configuração e Monitoramento em Tempo de Execução no Lado do Servidor para Conexões Criptografadas.

No lado do cliente, a opção `--tls-version` especifica quais protocolos TLS um programa cliente permite para conexões ao servidor. O formato do valor da opção é o mesmo que para a variável de sistema `tls_version` descrita anteriormente (uma lista de uma ou mais versões de protocolo separadas por vírgula).

Para conexões de replicação de origem/replica onde essa instância do servidor é a replica, a opção `SOURCE_TLS_VERSION` para a declaração `CHANGE REPLICATION SOURCE TO` especifica quais protocolos TLS a replica permite para conexões à origem. O formato do valor da opção é o mesmo que para a variável de sistema `tls_version` descrita anteriormente. Veja a Seção 19.3.1, “Configurando a Replicação para Usar Conexões Encriptadas”.

Os protocolos que podem ser especificados para `SOURCE_TLS_VERSION` dependem da biblioteca SSL. Essa opção é independente e não afetada pelo valor da variável de sistema `tls_version` do servidor. Por exemplo, um servidor que atua como replica pode ser configurado com `tls_version` definido como TLSv1.3 para permitir apenas conexões de entrada que usam TLSv1.3, mas também configurado com `SOURCE_TLS_VERSION` definido como TLSv1.2 para permitir apenas TLSv1.2 para conexões de replica saindo da replica para a origem.

Para conexões de recuperação distribuída de replicação de grupo onde essa instância do servidor é o membro que está se juntando e inicia a recuperação distribuída (ou seja, o cliente), a variável de sistema `group_replication_recovery_tls_version` especifica quais protocolos são permitidos pelo cliente. Novamente, essa opção é independente e não afetada pelo valor da variável de sistema `tls_version` do servidor, que se aplica quando essa instância do servidor é o doador. Um servidor de replicação de grupo geralmente participa da recuperação distribuída tanto como doador quanto como membro que está se juntando ao longo de sua participação no grupo, então ambas essas variáveis de sistema devem ser definidas. Veja a Seção 20.6.2, “Segurando Conexões de Comunicação de Grupo com Secure Socket Layer (SSL)”).

A configuração do protocolo TLS afeta qual protocolo uma conexão específica usa, conforme descrito na Negociação de Protocolo TLS da Conexão.

Os protocolos permitidos devem ser escolhidos para não deixar “buracos” na lista. Por exemplo, esses valores de configuração do servidor não têm buracos:

```
tls_version=TLSv1.2,TLSv1.3
tls_version=TLSv1.3
```

A proibição de buracos também se aplica em outros contextos de configuração, como para clientes ou réplicas.

A menos que você pretenda desabilitar conexões criptografadas, a lista de protocolos permitidos não deve estar vazia. Se você definir um parâmetro de versão TLS para a string vazia, conexões criptografadas não podem ser estabelecidas:

*  `tls_version`: O servidor não permite conexões de entrada criptografadas.
*  `--tls-version`: O cliente não permite conexões de saída criptografadas para o servidor.
* `SOURCE_TLS_VERSION`: A réplica não permite conexões de saída criptografadas para a fonte.
*  `group_replication_recovery_tls_version`: O membro que está se juntando não permite conexões criptografadas para a conexão de recuperação distribuída.

#### Configuração de Criptografia de Conexão

Um conjunto padrão de criptografias é aplicado a conexões criptografadas, que pode ser substituído explicitamente configurando as criptografias permitidas. Durante o estabelecimento da conexão, ambos os lados de uma conexão devem permitir alguma criptografia comum ou a conexão falha. Das criptografias permitidas comuns a ambos os lados, a biblioteca SSL escolhe a que é suportada pelo certificado fornecido que tem a maior prioridade.

Para especificar uma ou mais criptografias aplicáveis para conexões criptografadas que usam TLSv1.2:

* Defina a variável de sistema `ssl_cipher` no lado do servidor e use a opção `--ssl-cipher` nos programas cliente.
* Para conexões de replicação de origem/replica regulares, onde esta instância do servidor é a origem, defina a variável de sistema `ssl_cipher`. Onde esta instância do servidor é a replica, use a opção `SOURCE_SSL_CIPHER` na declaração `ALTERAR A ORIGEM DA REPLICA`. Consulte a Seção 19.3.1, “Configurando a Replicação para Usar Conexões Encriptadas”.
* Para um membro do grupo de replicação, para conexões de comunicação de grupo de replicação e também para conexões de recuperação distribuída de replicação de grupo onde esta instância do servidor é o doador, defina a variável de sistema `ssl_cipher`. Para conexões de recuperação distribuída de replicação de grupo onde esta instância do servidor é o membro que se junta, use a variável de sistema `group_replication_recovery_ssl_cipher`. Consulte a Seção 20.6.2, “Segurando Conexões de Comunicação de Grupo com Secure Socket Layer (SSL”)”).

Para conexões encriptadas que usam TLSv1.3, o OpenSSL 1.1.1 e versões superiores suportam as seguintes suítes de cifra, todas as quais são habilitadas por padrão para uso com as variáveis de sistema `--tls-ciphersuites` ou `--admin-tls-ciphersuites` do servidor:

```
TLS_AES_128_GCM_SHA256
TLS_AES_256_GCM_SHA384
TLS_CHACHA20_POLY1305_SHA256
TLS_AES_128_CCM_SHA256
```

::: info Nota

No MySQL 8.4, o uso de `TLS_AES_128_CCM_8_SHA256` com as variáveis de sistema `--tls-ciphersuites` ou `--admin-tls-ciphersuites` gera uma advertência de depreciação.

:::

Para configurar as suítes de cifra TLSv1.3 permitidas explicitamente, defina os seguintes parâmetros. Em cada caso, o valor de configuração é uma lista de nomes de suítes de cifra separados por vírgula.

* No lado do servidor, use a variável de sistema `tls_ciphersuites`. Se essa variável não for definida, seu valor padrão é `NULL`, o que significa que o servidor permite o conjunto padrão de ciphersuites. Se a variável for definida como uma string vazia, nenhuma ciphersuite será habilitada e conexões criptografadas não poderão ser estabelecidas.
* No lado do cliente, use a opção `--tls-ciphersuites`. Se essa opção não for definida, o cliente permite o conjunto padrão de ciphersuites. Se a opção for definida como uma string vazia, nenhuma ciphersuite será habilitada e conexões criptografadas não poderão ser estabelecidas.
* Para conexões de replicação de origem/replica regulares, onde essa instância do servidor é a origem, use a variável de sistema `tls_ciphersuites`. Onde essa instância do servidor é a replica, use a opção `SOURCE_TLS_CIPHERSUITES` para a declaração `CHANGE REPLICATION SOURCE TO`. Veja a Seção 19.3.1, “Configurando a Replicação para Usar Conexões Criptografadas”.
* Para um membro do grupo de replicação, para conexões de comunicação de grupo de replicação e também para conexões de recuperação distribuída de replicação de grupo onde essa instância do servidor é o doador, use a variável de sistema `tls_ciphersuites`. Para conexões de recuperação distribuída de replicação de grupo onde essa instância do servidor é o membro que se junta, use a variável de sistema `group_replication_recovery_tls_ciphersuites`. Veja a Seção 20.6.2, “Segurando Conexões de Comunicação de Grupo com Secure Socket Layer (SSL”)").

O suporte a ciphersuites requer que o servidor MySQL e o aplicativo cliente sejam compilados usando OpenSSL 1.1.1 ou superior.

Um dado cifrado pode funcionar apenas com certos protocolos TLS, o que afeta o processo de negociação de protocolo TLS. Veja Negociação de Protocolo TLS da Conexão.

Para determinar quais ciphers um dado servidor suporta, verifique o valor da sessão da variável de status `Ssl_cipher_list`:

```
SHOW SESSION STATUS LIKE 'Ssl_cipher_list';
```

A variável de status `Ssl_cipher_list` lista os possíveis cifradores SSL (vazio para conexões não SSL). Se o MySQL suportar o TLSv1.3, o valor inclui os possíveis cifradores TLSv1.3.

::: info Nota

Os cifradores ECDSA só funcionam em combinação com um certificado SSL que use ECDSA para a assinatura digital, e não funcionam com certificados que usem RSA. O processo de geração automática do MySQL Server para certificados SSL não gera certificados assinados com ECDSA, ele gera apenas certificados assinados com RSA. Não selecione cifradores ECDSA a menos que você tenha um certificado ECDSA disponível.

:::

Para conexões criptografadas que usem TLS.v1.3, o MySQL usa a lista de cifradores padrão da biblioteca SSL.

Para conexões criptografadas que usem TLSv1.2, o MySQL passa a seguinte lista de cifres padrão para a biblioteca SSL quando usada com as variáveis de sistema `--ssl-cipher` e `--admin-ssl-cipher`.

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

Essas restrições de cifres estão em vigor:

* Os seguintes cifres são desatualizados e produzem uma mensagem de aviso quando usados com as variáveis de sistema `--ssl-cipher` e `--admin-ssl-cipher`:

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
* Os seguintes cifres são permanentemente restritos:

  ```
  !DHE-DSS-DES-CBC3-SHA
  !DHE-RSA-DES-CBC3-SHA
  !ECDH-RSA-DES-CBC3-SHA
  !ECDH-ECDSA-DES-CBC3-SHA
  !ECDHE-RSA-DES-CBC3-SHA
  !ECDHE-ECDSA-DES-CBC3-SHA
  ```
* As seguintes categorias de cifres são permanentemente restritas:

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

Se o servidor for iniciado com a variável de sistema `ssl_cert` definida para um certificado que use qualquer um dos cifres restritos anteriores ou categorias de cifres, o servidor inicia com suporte para conexões criptografadas desativado.

#### Negociação do Protocolo de Conexão TLS

As tentativas de conexão no MySQL negociam o uso da versão mais alta do protocolo TLS disponível em ambos os lados para a qual um cifrador de criptografia compatível com o protocolo esteja disponível em ambos os lados. O processo de negociação depende de fatores como a biblioteca SSL usada para compilar o servidor e o cliente, a configuração do protocolo e cifrador de criptografia TLS, e o tamanho da chave usado:

* Para que a tentativa de conexão seja bem-sucedida, a configuração do protocolo TLS do servidor e do cliente deve permitir algum protocolo em comum.
* Da mesma forma, a configuração da chave de criptografia do servidor e do cliente deve permitir alguma criptografia em comum. Uma determinada criptografia pode funcionar apenas com certos protocolos TLS, portanto, um protocolo disponível para o processo de negociação não é escolhido a menos que haja também uma criptografia compatível.
* Se o TLSv1.3 estiver disponível, ele é usado, se possível. (Isso significa que a configuração do servidor e do cliente deve permitir o TLSv1.3, e ambos também devem permitir alguma criptografia de encriptação compatível com o TLSv1.3.) Caso contrário, o MySQL continua na lista de protocolos disponíveis, usando o TLSv1.2, se possível, e assim por diante. A negociação prossegue de protocolos mais seguros para menos seguros. A ordem da negociação é independente da ordem em que os protocolos são configurados. Por exemplo, a ordem da negociação é a mesma, independentemente de `tls_version` ter um valor de `TLSv1.2,TLSv1.3` ou `TLSv1.3,TLSv1.2`.
* Para maior segurança, use um certificado com um tamanho de chave RSA de pelo menos 2048 bits.

Se o servidor e o cliente não tiverem um protocolo permitido em comum e uma criptografia compatível com o protocolo em comum, o servidor termina a solicitação de conexão.

O MySQL permite especificar uma lista de protocolos a serem suportados. Essa lista é passada diretamente para a biblioteca SSL subjacente e, no final, cabe a essa biblioteca quais protocolos ela realmente habilita da lista fornecida. Consulte o código-fonte do MySQL e a documentação do `SSL_CTX_new()` do OpenSSL para obter informações sobre como a biblioteca SSL lida com isso.

#### Monitoramento do Protocolo TLS e da Criptografia da Sessão Ativa do Cliente

Para determinar qual protocolo de encriptação TLS e criptografia o cliente atual está usando, verifique os valores das variáveis de status `Ssl_version` e `Ssl_cipher`:

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

Se a conexão não estiver encriptada, ambas as variáveis têm um valor vazio.