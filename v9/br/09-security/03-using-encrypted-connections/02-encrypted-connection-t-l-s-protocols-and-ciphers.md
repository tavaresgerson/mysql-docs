### 8.3.2 Conexão Encriptada Protocolos e Cifras TLS

O MySQL suporta vários protocolos e cifras TLS, e permite configurar quais protocolos e cifras permitir para conexões encriptadas. Também é possível determinar qual protocolo e cifra a sessão atual está usando.

* Protocolos TLS suportados
* Configuração do protocolo TLS da conexão
* Configuração do cifrador da conexão
* Negociação do protocolo TLS da conexão
* Monitoramento do protocolo e cifrador TLS da sessão atual do cliente

#### Protocolos TLS suportados

O MySQL 9.5 suporta os protocolos TLSv1.2 e TLSv1.3 para conexões. Para usar o TLSv1.3, tanto o servidor MySQL quanto o aplicativo cliente devem ser compilados usando o OpenSSL 1.1.1 ou superior. O componente de Replicação em Grupo suporta TLSv1.3 a partir do MySQL 8.0.18 (para detalhes, consulte a Seção 20.6.2, “Segurança das conexões de comunicação de grupo com Secure Socket Layer (SSL”)”).

O MySQL 9.5 não suporta os antigos protocolos TLSv1 e TLSv1.1.

Os protocolos TLS permitidos podem ser configurados tanto no lado do servidor quanto no lado do cliente para incluir apenas um subconjunto dos protocolos TLS suportados. A configuração em ambos os lados deve incluir pelo menos um protocolo em comum, ou as tentativas de conexão não podem negociar um protocolo a ser usado. Para detalhes, consulte Negociação do Protocolo TLS da Conexão.

O sistema hospedeiro pode permitir apenas certos protocolos TLS, o que significa que as conexões MySQL não podem usar protocolos não permitidos pelo hospedeiro, mesmo que o MySQL próprio os permita. Possíveis soluções para esse problema incluem as seguintes:

* Altere a configuração de host em todo o sistema para permitir protocolos TLS adicionais. Consulte a documentação do seu sistema operacional para obter instruções. Por exemplo, seu sistema pode ter um arquivo `/etc/ssl/openssl.cnf` que contém essas linhas para restringir os protocolos TLS a TLSv1.3 ou superior:

```
  [system_default_sect]
  MinProtocol = TLSv1.3
  ```

Mudar o valor para uma versão de protocolo mais baixa ou `None` torna o sistema mais permissivo. Essa solução tem a desvantagem de que permitir protocolos mais baixos (menos seguros) pode ter consequências adversas para a segurança.

* Se você não puder ou preferir não alterar a configuração de TLS do sistema hoste, mude as aplicações do MySQL para usar protocolos TLS mais altos (mais seguros) que sejam permitidos pelo sistema hoste. Isso pode não ser possível para versões mais antigas do MySQL que suportam apenas versões de protocolo mais baixas. Por exemplo, TLSv1 é o único protocolo suportado antes do MySQL 5.6.46, então tentativas de se conectar a um servidor anterior ao 5.6.46 falham mesmo se o cliente vier de uma versão mais nova do MySQL que suporte versões de protocolo mais altas. Nesses casos, pode ser necessário fazer uma atualização para uma versão do MySQL que suporte versões adicionais de TLS.

Configuração de sistema-wide do hoste: * Se a configuração do MySQL permitir TLSv1.2 e a configuração do seu sistema hoste permitir apenas conexões que usem TLSv1.2 ou versões mais altas, você pode estabelecer conexões MySQL usando apenas TLSv1.2.

* Suponha que a configuração do MySQL permita TLSv1.2, mas a configuração do seu sistema hoste permita apenas conexões que usem TLSv1.3 ou versões mais altas. Se esse for o caso, você não pode estabelecer conexões MySQL de forma alguma, porque nenhum protocolo permitido pelo MySQL é permitido pelo sistema hoste.

#### Configuração de Protocolo de Conexão TLS

No lado do servidor, o valor da variável de sistema `tls_version` determina quais protocolos TLS um servidor MySQL permite para conexões criptografadas. O valor `tls_version` se aplica a conexões de clientes, conexões de replicação de origem/replica regulares onde essa instância do servidor é a origem, conexões de comunicação de grupo de replicação de grupo e conexões de recuperação distribuída de replicação de grupo onde essa instância do servidor é o doador. A interface de conexão administrativa é configurada de forma semelhante, mas usa a variável de sistema `admin_tls_version` (consulte a Seção 7.1.12.2, “Gestão de Conexão Administrativa”). Esta discussão também se aplica a `admin_tls_version`.

O valor `tls_version` é uma lista de uma ou mais versões de protocolo TLS separadas por vírgula, que não é case-sensitive. Por padrão, essa variável lista todos os protocolos suportados pela biblioteca SSL usada para compilar o MySQL e pela versão do MySQL Server. Os ajustes padrão são, portanto, conforme mostrado nas Configurações Padrão de Protocolo TLS do MySQL Server.

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

`tls_version` pode ser alterado em tempo de execução. Consulte Configuração e Monitoramento de Configuração em Tempo de Execução no Lado do Servidor para Conexões Criptografadas.

No lado do cliente, a opção `--tls-version` especifica quais protocolos TLS um programa cliente permite para conexões ao servidor. O formato do valor da opção é o mesmo da variável de sistema `tls_version` descrita anteriormente (uma lista de uma ou mais versões de protocolo separadas por vírgula).

Para conexões de replicação de origem/replica onde essa instância do servidor é a replica, a opção `SOURCE_TLS_VERSION` para a declaração `CHANGE REPLICATION SOURCE TO` especifica quais protocolos TLS a replica permite para conexões à origem. O formato do valor da opção é o mesmo da variável de sistema `tls_version` descrita anteriormente. Veja a Seção 19.3.1, “Configurando a Replicação para Usar Conexões Encriptadas”.

Os protocolos que podem ser especificados para `SOURCE_TLS_VERSION` dependem da biblioteca SSL. Esta opção é independente e não afetada pelo valor da variável de sistema `tls_version` do servidor. Por exemplo, um servidor que atua como replica pode ser configurado com `tls_version` definido como TLSv1.3 para permitir apenas conexões de entrada que usam TLSv1.3, mas também configurado com `SOURCE_TLS_VERSION` definido como TLSv1.2 para permitir apenas TLSv1.2 para conexões de replica saindo para a origem.

Para a replicação em grupo, as conexões de recuperação distribuída onde essa instância do servidor é o membro que inicia a recuperação distribuída (ou seja, o cliente), a variável de sistema `group_replication_recovery_tls_version` especifica quais protocolos são permitidos pelo cliente. Novamente, essa opção é independente e não afetada pelo valor da variável de sistema `tls_version` do servidor, que se aplica quando essa instância do servidor é o doador. Um servidor de replicação em grupo geralmente participa da recuperação distribuída tanto como doador quanto como membro que se junta ao longo de sua participação no grupo, portanto, ambas as variáveis de sistema devem ser definidas. Veja a Seção 20.6.2, “Segurança das Conexões de Comunicação do Grupo com Secure Socket Layer (SSL”)”).

A configuração do protocolo TLS afeta qual protocolo uma conexão específica usa, conforme descrito na Negociação de Protocolo TLS da Conexão.

Os protocolos permitidos devem ser escolhidos para não deixar “buracos” na lista. Por exemplo, esses valores de configuração do servidor não têm buracos:

```
tls_version=TLSv1.2,TLSv1.3
tls_version=TLSv1.3
```

A proibição de buracos também se aplica em outros contextos de configuração, como para clientes ou réplicas.

A menos que você pretenda desativar conexões criptografadas, a lista de protocolos permitidos não deve estar vazia. Se você definir um parâmetro de versão TLS para a string vazia, conexões criptografadas não podem ser estabelecidas:

* `tls_version`: O servidor não permite conexões de entrada criptografadas.
* `--tls-version`: O cliente não permite conexões de saída criptografadas para o servidor.
* `SOURCE_TLS_VERSION`: A réplica não permite conexões de saída criptografadas para a fonte.
* `group_replication_recovery_tls_version`: O membro que se junta não permite conexões criptografadas para a conexão de recuperação distribuída.

#### Configuração de Criptografia da Conexão

Um conjunto padrão de cifra é aplicado às conexões criptografadas, que podem ser substituídas por meio da configuração explícita dos cifras permitidos. Durante o estabelecimento da conexão, ambos os lados de uma conexão devem permitir algum cifra em comum, caso contrário, a conexão falha. Dos cifras permitidos comuns a ambos os lados, a biblioteca SSL escolhe o que é suportado pelo certificado fornecido que tem a maior prioridade.

Para especificar uma ou mais cifras aplicáveis para conexões criptografadas que utilizam TLSv1.2:

* Defina a variável de sistema `ssl_cipher` no lado do servidor e use a opção `--ssl-cipher` para os programas cliente.

* Para conexões de replicação de origem/replica regulares, onde essa instância do servidor é a origem, defina a variável de sistema `ssl_cipher`. Onde essa instância do servidor é a replica, use a opção `SOURCE_SSL_CIPHER` para a declaração `CHANGE REPLICATION SOURCE TO`. Veja a Seção 19.3.1, “Configurando a Replicação para Usar Conexões Criptografadas”.

* Para um membro do grupo de replicação, para conexões de comunicação de grupo de replicação e também para conexões de recuperação distribuída de replicação de grupo onde essa instância do servidor é o doador, defina a variável de sistema `ssl_cipher`. Para conexões de recuperação distribuída de replicação de grupo onde essa instância do servidor é o membro que se junta, use a variável de sistema `group_replication_recovery_ssl_cipher`. Veja a Seção 20.6.2, “Segurando Conexões de Comunicação de Grupo com Secure Socket Layer (SSL)”).

Para conexões criptografadas que utilizam TLSv1.3, o OpenSSL 1.1.1 e superior suportam as seguintes suítes de cifras, todas as quais são habilitadas por padrão para uso com variáveis de sistema do servidor `--tls-ciphersuites` ou `--admin-tls-ciphersuites`:

```
TLS_AES_128_GCM_SHA256
TLS_AES_256_GCM_SHA384
TLS_CHACHA20_POLY1305_SHA256
TLS_AES_128_CCM_SHA256
```

Nota

No MySQL 9.5, o uso de `TLS_AES_128_CCM_8_SHA256` com as variáveis de sistema `--tls-ciphersuites` ou `--admin-tls-ciphersuites` gera uma advertência de depreciação.

Para configurar explicitamente as suíte de cifras TLSv1.3 permitidas, defina os seguintes parâmetros. Em cada caso, o valor de configuração é uma lista de nomes de suíte de cifras separados por vírgula.

* No lado do servidor, use a variável de sistema `tls_ciphersuites`. Se essa variável não for definida, seu valor padrão é `NULL`, o que significa que o servidor permite o conjunto padrão de suíte de cifras. Se a variável for definida como uma string vazia, nenhuma suíte de cifras é habilitada e conexões criptografadas não podem ser estabelecidas.

* No lado do cliente, use a opção `--tls-ciphersuites`. Se essa opção não for definida, o cliente permite o conjunto padrão de suíte de cifras. Se a opção for definida como uma string vazia, nenhuma suíte de cifras é habilitada e conexões criptografadas não podem ser estabelecidas.

* Para conexões de replicação de origem/replica regulares, onde essa instância do servidor é a origem, use a variável de sistema `tls_ciphersuites`. Onde essa instância do servidor é a replica, use a opção `SOURCE_TLS_CIPHERSUITES` para a declaração `CHANGE REPLICATION SOURCE TO`. Veja a Seção 19.3.1, “Configurando a Replicação para Usar Conexões Criptografadas”.

* Para um membro do grupo de replicação, para conexões de comunicação de grupo de replicação e também para conexões de recuperação distribuída de replicação de grupo onde essa instância do servidor é o doador, use a variável de sistema `tls_ciphersuites`. Para conexões de recuperação distribuída de replicação de grupo onde essa instância do servidor é o membro que se junta, use a variável de sistema `group_replication_recovery_tls_ciphersuites`. Veja a Seção 20.6.2, “Segurando Conexões de Comunicação de Grupo com Secure Socket Layer (SSL”)").

O suporte ao Ciphersuite exige que o servidor MySQL e o aplicativo cliente sejam compilados usando OpenSSL 1.1.1 ou superior.

Um determinado cifrado pode funcionar apenas com certos protocolos TLS, o que afeta o processo de negociação do protocolo TLS. Veja Negociação de Protocolo TLS de Conexão.

Para determinar quais cifrados um determinado servidor suporta, verifique o valor da variável de status `Ssl_cipher_list`:

```
SHOW SESSION STATUS LIKE 'Ssl_cipher_list';
```

A variável de status `Ssl_cipher_list` lista os cifrados SSL possíveis (vazio para conexões não SSL). Se o MySQL suportar TLSv1.3, o valor inclui os cifrados TLSv1.3 possíveis.

Observação

Os cifrados ECDSA só funcionam em combinação com um certificado SSL que use ECDSA para a assinatura digital, e não funcionam com certificados que usem RSA. O processo de geração automática do MySQL Server para certificados SSL não gera certificados assinados ECDSA, ele gera apenas certificados assinados RSA. Não selecione cifrados ECDSA a menos que você tenha um certificado ECDSA disponível.

Para conexões criptografadas que usam TLS.v1.3, o MySQL usa a lista de cifrados padrão da biblioteca SSL.

Para conexões criptografadas que usam TLSv1.2, o MySQL passa a seguinte lista de cifradores padrão para a biblioteca SSL quando usada com as variáveis de sistema do servidor `--ssl-cipher` e `--admin-ssl-cipher`.

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

Essas restrições de cifrado estão em vigor:

* Os seguintes cifrados são desatualizados e produzem uma mensagem de aviso quando usados com as variáveis de sistema do servidor `--ssl-cipher` e `--admin-ssl-cipher`:

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

* As seguintes categorias de cifrados são permanentemente restritas:

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

Se o servidor for iniciado com a variável de sistema `ssl_cert` definida para um certificado que utilize qualquer um dos cifradores ou categorias de cifradores restritos anteriores, o servidor será iniciado com o suporte para conexões criptografadas desativado.

#### Negociação do Protocolo TLS de Conexão

As tentativas de conexão no MySQL negociam o uso da versão mais alta do protocolo TLS disponível em ambos os lados para a qual um cifrador de criptografia compatível com o protocolo esteja disponível em ambos os lados. O processo de negociação depende de fatores como a biblioteca SSL usada para compilar o servidor e o cliente, a configuração do protocolo e do cifrador de criptografia TLS, e o tamanho da chave usado:

* Para que a tentativa de conexão seja bem-sucedida, a configuração do protocolo TLS do servidor e do cliente deve permitir algum protocolo em comum.
* Da mesma forma, a configuração do cifrador de criptografia do servidor e do cliente deve permitir algum cifrador em comum. Um cifrador específico pode funcionar apenas com certos protocolos TLS, portanto, um protocolo disponível para o processo de negociação não é escolhido a menos que haja também um cifrador compatível.
* Se o TLSv1.3 estiver disponível, ele será usado se possível. (Isso significa que a configuração do servidor e do cliente deve permitir o TLSv1.3, e ambos também devem permitir algum cifrador de criptografia compatível com o TLSv1.3.) Caso contrário, o MySQL continua na lista de protocolos disponíveis, usando o TLSv1.2 se possível, e assim por diante. A negociação prossegue de protocolos mais seguros para menos seguros. A ordem da negociação é independente da ordem em que os protocolos são configurados. Por exemplo, a ordem da negociação é a mesma, independentemente de `tls_version` ter o valor `TLSv1.2,TLSv1.3` ou `TLSv1.3,TLSv1.2`.
* Para melhor segurança, use um certificado com um tamanho de chave RSA de pelo menos 2048 bits.

Se o servidor e o cliente não tiverem um protocolo permitido em comum e um cifrador compatível com o protocolo em comum, o servidor termina a solicitação de conexão.

O MySQL permite especificar uma lista de protocolos a serem suportados. Essa lista é passada diretamente para a biblioteca SSL subjacente e, no final, cabe a essa biblioteca quais protocolos ela realmente habilita da lista fornecida. Consulte o código-fonte do MySQL e a documentação da OpenSSL [`SSL_CTX_new()`](https://www.openssl.org/docs/man1.1.0/ssl/SSL_CTX_new.html) para obter informações sobre como a biblioteca SSL lida com isso.

#### Monitoramento do Protocolo TLS e do Cifrador da Sessão de Cliente Atual

Para determinar qual protocolo de criptografia TLS e cifrador o cliente atual usa, verifique os valores da sessão das variáveis `Ssl_version` e `Ssl_cipher`:

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