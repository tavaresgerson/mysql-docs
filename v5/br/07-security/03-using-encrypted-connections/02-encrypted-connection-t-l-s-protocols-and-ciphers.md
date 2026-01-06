### 6.3.2 Conexão Encriptada Protocolos e Cifras TLS

O MySQL suporta vários protocolos e cifra TLS e permite configurar quais protocolos e cifra devem ser permitidos para conexões criptografadas. Também é possível determinar qual protocolo e cifra a sessão atual está usando.

- Protocolos de conexão TLS suportados
- Configuração do Protocolo TLS de Conexão
- Protocolos TLS obsoletos
- Configuração do Cipher de Conexão
- Negociação do Protocolo TLS de Conexão
- Monitoramento do Protocolo TLS e dos Cifradores da Sessão Atual do Cliente

#### Protocolos de conexão TLS suportados

O MySQL suporta conexões criptografadas usando os protocolos TLSv1, TLSv1.1 e TLSv1.2, listados em ordem de menos seguro para mais seguro. O conjunto de protocolos realmente permitido para conexões está sujeito a vários fatores:

- Configuração do MySQL. Os protocolos TLS permitidos podem ser configurados tanto no lado do servidor quanto no lado do cliente para incluir apenas um subconjunto dos protocolos TLS suportados. A configuração em ambos os lados deve incluir pelo menos um protocolo em comum, caso contrário, as tentativas de conexão não poderão negociar um protocolo a ser usado. Para obter detalhes, consulte Negociação de Protocolo TLS de Conexão.

- Configuração do host em todo o sistema. O sistema do host pode permitir apenas certos protocolos TLS, o que significa que as conexões do MySQL não podem usar protocolos não permitidos, mesmo que o MySQL próprio os permita:

  - Suponha que a configuração do MySQL permita TLSv1, TLSv1.1 e TLSv1.2, mas a configuração do sistema do seu host permita apenas conexões que utilizem TLSv1.2 ou superior. Nesse caso, você não poderá estabelecer conexões MySQL que utilizem TLSv1 ou TLSv1.1, mesmo que o MySQL esteja configurado para permitir, porque o sistema do host não permite.

  - Se a configuração do MySQL permitir TLSv1, TLSv1.1 e TLSv1.2, mas a configuração do sistema do seu host permitir apenas conexões que utilizem TLSv1.3 ou versões superiores, você não poderá estabelecer conexões com o MySQL, pois nenhum protocolo permitido pelo MySQL é permitido pelo sistema do host.

  As soluções para este problema incluem:

  - Altere a configuração do host em todo o sistema para permitir protocolos TLS adicionais. Consulte a documentação do seu sistema operacional para obter instruções. Por exemplo, seu sistema pode ter um arquivo `/etc/ssl/openssl.cnf` que contém essas linhas para restringir os protocolos TLS a TLSv1.2 ou superior:

    ```sql
    [system_default_sect]
    MinProtocol = TLSv1.2
    ```

    Alterar o valor para uma versão de protocolo mais baixa ou `None` torna o sistema mais permissivo. Essa solução tem a desvantagem de que permitir protocolos mais baixos (menos seguros) pode ter consequências de segurança adversas.

  - Se você não puder ou preferir não alterar a configuração do TLS do sistema hospedeiro, mude as aplicações do MySQL para usar protocolos TLS mais altos (mais seguros) que sejam permitidos pelo sistema hospedeiro. Isso pode não ser possível para versões mais antigas do MySQL que suportam apenas versões de protocolo mais baixas. Por exemplo, TLSv1 é o único protocolo suportado antes do MySQL 5.6.46, então as tentativas de se conectar a um servidor anterior a 5.6.46 falham mesmo que o cliente seja de uma versão mais recente do MySQL que suporte versões de protocolo mais altas. Nesses casos, pode ser necessário fazer uma atualização para uma versão do MySQL que suporte versões adicionais de TLS.

- A biblioteca SSL. Se a biblioteca SSL não suportar um protocolo específico, o MySQL também não o suporta, e quaisquer partes da discussão a seguir que especifiquem esse protocolo não se aplicam.

  - Quando compilado com o OpenSSL 1.0.1 ou superior, o MySQL suporta os protocolos TLSv1, TLSv1.1 e TLSv1.2.

  - Quando compilado com o yaSSL, o MySQL suporta os protocolos TLSv1 e TLSv1.1.

  Nota

  É possível compilar o MySQL usando o yaSSL como alternativa ao OpenSSL apenas antes do MySQL 5.7.28. A partir do MySQL 5.7.28, o suporte ao yaSSL é removido e todas as compilações do MySQL usam o OpenSSL.

#### Configuração do Protocolo TLS de Conexão

No lado do servidor, o valor da variável de sistema `tls_version` determina quais protocolos TLS um servidor MySQL permite para conexões criptografadas. O valor de `tls_version` se aplica a conexões de clientes e de servidores replicados usando replicação de origem/replica regular. O valor da variável é uma lista de uma ou mais versões de protocolo separadas por vírgula desta lista (não case-sensitive): TLSv1, TLSv1.1, TLSv1.2. Por padrão, esta variável lista todos os protocolos suportados pela biblioteca SSL usada para compilar o MySQL (`TLSv1,TLSv1.1,TLSv1.2` para OpenSSL, `TLSv1,TLSv1.1` para yaSSL). Para determinar o valor de `tls_version` em tempo de execução, use esta declaração:

```sql
mysql> SHOW GLOBAL VARIABLES LIKE 'tls_version';
+---------------+-----------------------+
| Variable_name | Value                 |
+---------------+-----------------------+
| tls_version   | TLSv1,TLSv1.1,TLSv1.2 |
+---------------+-----------------------+
```

Para alterar o valor de `tls_version`, defina-o durante o início do servidor. Por exemplo, para permitir conexões que utilizam o protocolo TLSv1.1 ou TLSv1.2, mas proibir conexões que utilizam o protocolo TLSv1 menos seguro, use essas linhas no arquivo `my.cnf` do servidor:

```sql
[mysqld]
tls_version=TLSv1.1,TLSv1.2
```

Para ser ainda mais restritivo e permitir apenas conexões TLSv1.2, defina `tls_version` da seguinte forma (assumindo que seu servidor foi compilado usando OpenSSL, pois o yaSSL não suporta TLSv1.2):

```sql
[mysqld]
tls_version=TLSv1.2
```

Nota

A partir do MySQL 5.7.35, os protocolos de conexão TLSv1 e TLSv1.1 são desatualizados e o suporte a eles está sujeito à remoção em uma versão futura do MySQL. Consulte Protocolos TLS Desatualizados.

Do lado do cliente, a opção `--tls-version` especifica quais protocolos TLS um programa cliente permite para conexões com o servidor. O formato do valor da opção é o mesmo da variável de sistema `tls_version` descrita anteriormente (uma lista de uma ou mais versões de protocolos separadas por vírgula).

Para a replicação de origem/replica, a opção `MASTER_TLS_VERSION` da instrução `CHANGE MASTER TO` especifica quais protocolos TLS um servidor replica permite para conexões à origem. O formato do valor da opção é o mesmo que para a variável de sistema `tls_version` (server-system-variables.html#sysvar\_tls\_version) descrita anteriormente. Veja Seção 16.3.8, “Configurando a Replicação para Usar Conexões Encriptadas”.

Os protocolos que podem ser especificados para `MASTER_TLS_VERSION` dependem da biblioteca SSL. Esta opção é independente e não afetada pelo valor da variável do servidor `tls_version`. Por exemplo, um servidor que atua como replica pode ser configurado com `tls_version` definido como TLSv1.2 para permitir apenas conexões de entrada que usam TLSv1.2, mas também configurado com `MASTER_TLS_VERSION` definido como TLSv1.1 para permitir apenas TLSv1.1 para conexões de replica saindo para a fonte.

A configuração do protocolo TLS afeta o protocolo utilizado por uma conexão específica, conforme descrito em Negociação de Protocolo TLS de Conexão.

Os protocolos permitidos devem ser escolhidos para não deixar "buracos" na lista. Por exemplo, esses valores de configuração do servidor não têm buracos:

```sql
tls_version=TLSv1,TLSv1.1,TLSv1.2
tls_version=TLSv1.1,TLSv1.2
tls_version=TLSv1.2
```

Esse valor tem um buraco e não deve ser usado:

```sql
tls_version=TLSv1,TLSv1.2       (TLSv1.1 is missing)
```

A proibição de buracos também se aplica em outros contextos de configuração, como para clientes ou réplicas.

A menos que você pretenda desativar as conexões criptografadas, a lista de protocolos permitidos não deve estar vazia. Se você definir um parâmetro de versão TLS para a string vazia, as conexões criptografadas não podem ser estabelecidas:

- `tls_version`: O servidor não permite conexões recebidas criptografadas.

- `--tls-version`: O cliente não permite conexões saídas criptografadas para o servidor.

- `MASTER_TLS_VERSION`: A replica não permite conexões saídas criptografadas para a fonte.

#### Protocolos TLS obsoletos

A partir do MySQL 5.7.35, os protocolos de conexão TLSv1 e TLSv1.1 são desatualizados e o suporte a eles está sujeito à remoção em uma versão futura do MySQL. (Para informações de fundo, consulte o memorando do IETF [Deprecating TLSv1.0 and TLSv1.1](https://tools.ietf.org/id/draft-ietf-tls-oldversions-deprecate-02.html).) Recomenda-se que as conexões sejam feitas usando os protocolos TLSv1.2 e TLSv1.3, que são mais seguros. O TLSv1.3 exige que o servidor MySQL e o aplicativo cliente sejam compilados com o OpenSSL 1.1.1 ou superior.

No lado do servidor, essa depreciação tem os seguintes efeitos:

- Se a variável de sistema `tls_version` receber um valor que contenha um protocolo TLS obsoleto durante a inicialização do servidor, o servidor escreverá um aviso para cada protocolo obsoleto no log de erros.

- Se um cliente se conectar com sucesso usando um protocolo TLS desatualizado, o servidor escreve uma mensagem de aviso no log de erros.

Do lado do cliente, a depreciação não tem efeito visível. Os clientes não emitem um aviso se configurados para permitir um protocolo TLS obsoleto. Isso inclui:

- Programas de cliente que suportam a opção `--tls-version` para especificar os protocolos TLS para conexões ao servidor MySQL.

- Declarações que permitem que as réplicas especifiquem os protocolos TLS para conexões ao servidor de origem. (`CHANGE MASTER TO` tem uma opção `MASTER_TLS_VERSION`.

#### Configuração do Cipher de Conexão

Um conjunto padrão de cifra é aplicado às conexões criptografadas, que podem ser substituídas por meio da configuração explícita dos cifras permitidos. Durante o estabelecimento da conexão, ambos os lados de uma conexão devem permitir algum cifrado em comum, caso contrário, a conexão falha. Dos cifrados permitidos comuns a ambos os lados, a biblioteca SSL escolhe o que é suportado pelo certificado fornecido que tem a maior prioridade.

Para especificar um ou mais algoritmos de criptografia para conexões criptografadas, defina a variável de sistema `ssl_cipher` no lado do servidor e use a opção `--ssl-cipher` nos programas cliente.

Para conexões de replicação de origem/replica, onde essa instância do servidor é a origem, defina a variável de sistema `ssl_cipher`. Onde essa instância do servidor é a replica, use a opção `MASTER_SSL_CIPHER` para a declaração `ALTERAR MASTER PARA` (change-master-to.html). Veja Seção 16.3.8, “Configurando a Replicação para Usar Conexões Encriptadas”.

Um cifrador pode funcionar apenas com certos protocolos TLS, o que afeta o processo de negociação do protocolo TLS. Veja Negociação de Protocolo TLS de Conexão.

Para determinar quais cifras um servidor específico suporta, verifique o valor da sessão da variável de status `Ssl_cipher_list`:

```sql
SHOW SESSION STATUS LIKE 'Ssl_cipher_list';
```

A variável de status `Ssl_cipher_list` lista os possíveis cifradores SSL (vazio para conexões não SSL). O conjunto de cifradores disponíveis depende da versão do MySQL e se o MySQL foi compilado com o OpenSSL ou o yaSSL, e (para o OpenSSL) da versão da biblioteca usada para compilar o MySQL.

Nota

Os cifradores ECDSA só funcionam em combinação com um certificado SSL que usa ECDSA para a assinatura digital, e não funcionam com certificados que usam RSA. O processo de geração automática do MySQL Server para certificados SSL não gera certificados assinados com ECDSA, ele gera apenas certificados assinados com RSA. Não selecione cifradores ECDSA a menos que você tenha um certificado ECDSA disponível.

O MySQL passa uma lista de cifra padrão para a biblioteca SSL.

O MySQL passa essa lista de cifra padrão para o OpenSSL:

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

O MySQL passa essa lista de cifra padrão para o yaSSL:

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

A partir do MySQL 5.7.10, essas restrições de cifra estão em vigor:

- Os seguintes cifrados estão permanentemente restritos:

  ```sql
  !DHE-DSS-DES-CBC3-SHA
  !DHE-RSA-DES-CBC3-SHA
  !ECDH-RSA-DES-CBC3-SHA
  !ECDH-ECDSA-DES-CBC3-SHA
  !ECDHE-RSA-DES-CBC3-SHA
  !ECDHE-ECDSA-DES-CBC3-SHA
  ```

- As seguintes categorias de cifra são permanentemente restritas:

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

Se o servidor for iniciado com a variável de sistema `ssl_cert` definida com um certificado que utiliza qualquer um dos cifradores ou categorias de cifradores restritos anteriores, o servidor será iniciado com o suporte para conexões criptografadas desativado.

#### Negociação do Protocolo TLS de Conexão

As tentativas de conexão no MySQL negociam o uso da versão mais alta do protocolo TLS disponível em ambos os lados, para a qual um algoritmo de criptografia compatível com o protocolo esteja disponível em ambos os lados. O processo de negociação depende de fatores como a biblioteca SSL usada para compilar o servidor e o cliente, a configuração do protocolo e do algoritmo de criptografia TLS, e o tamanho da chave utilizado:

- Para que a tentativa de conexão seja bem-sucedida, a configuração do protocolo TLS do servidor e do cliente deve permitir algum protocolo em comum.

- Da mesma forma, a configuração da criptografia do servidor e do cliente deve permitir que alguns algoritmos sejam usados em comum. Um determinado algoritmo pode funcionar apenas com certos protocolos TLS, então um protocolo disponível para o processo de negociação não é escolhido a menos que haja também um algoritmo compatível.

- Se o servidor e o cliente forem compilados com o OpenSSL, o TLSv1.2 será usado, se possível. Se o servidor e o cliente forem compilados com o yaSSL, o TLSv1.1 será usado, se possível. (“Possível” significa que a configuração do servidor e do cliente deve permitir o protocolo indicado e ambos devem permitir também algum algoritmo de criptografia compatível com o protocolo.) Caso contrário, o MySQL continua na lista de protocolos disponíveis, passando de protocolos mais seguros para menos seguros. A ordem de negociação é independente da ordem em que os protocolos são configurados. Por exemplo, a ordem de negociação é a mesma, independentemente de `tls_version` ter um valor de `TLSv1,TLSv1.1,TLSv1.2` ou `TLSv1.2,TLSv1.1,TLSv1`.

  Nota

  Antes do MySQL 5.7.10, o MySQL suporta apenas TLSv1, tanto para OpenSSL quanto para yaSSL, e não há nenhuma variável de sistema ou opção do cliente para especificar quais protocolos TLS devem ser permitidos.

- O TLSv1.2 não funciona com todos os criptogramas que têm um tamanho de chave de 512 bits ou menos. Para usar este protocolo com uma chave desse tamanho, defina a variável de sistema `ssl_cipher` no lado do servidor ou use a opção de cliente `--ssl-cipher` para especificar o nome do criptograma explicitamente:

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

- Para uma melhor segurança, use um certificado com um tamanho de chave RSA de pelo menos 2048 bits.

Se o servidor e o cliente não tiverem um protocolo permitido em comum e um cifrador compatível com o protocolo em comum, o servidor encerra a solicitação de conexão. Exemplos:

- Se o servidor estiver configurado com `tls_version=TLSv1.1,TLSv1.2`:

  - As tentativas de conexão falham para clientes invocados com `--tls-version=TLSv1`, e para clientes mais antigos que suportam apenas TLSv1.

  - Da mesma forma, as tentativas de conexão falham para réplicas configuradas com `MASTER_TLS_VERSION = 'TLSv1'`, e para réplicas mais antigas que suportam apenas TLSv1.

- Se o servidor estiver configurado com `tls_version=TLSv1` ou for um servidor mais antigo que suporte apenas TLSv1:

  - As tentativas de conexão falham para clientes invocados com `--tls-version=TLSv1.1,TLSv1.2`.

  - Da mesma forma, as tentativas de conexão falham para réplicas configuradas com `MASTER_TLS_VERSION = 'TLSv1.1,TLSv1.2'`.

O MySQL permite especificar uma lista de protocolos a serem suportados. Essa lista é passada diretamente para a biblioteca SSL subjacente e, no final, cabe a essa biblioteca determinar quais protocolos são realmente habilitados a partir da lista fornecida. Consulte o código-fonte do MySQL e a documentação da OpenSSL [`SSL_CTX_new()`](https://www.openssl.org/docs/man1.1.0/ssl/SSL_CTX_new.html) para obter informações sobre como a biblioteca SSL lida com isso.

#### Monitoramento da sessão atual do cliente TLS Protocol e Cipher

Para determinar qual protocolo de criptografia TLS e qual cifra a sessão atual do cliente utiliza, verifique os valores das variáveis de status `Ssl_version` e `Ssl_cipher`:

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
