## 6.3 Usando Conexões Encriptadas

Com uma conexão não criptografada entre o cliente MySQL e o servidor, alguém com acesso à rede poderia assistir a todo o seu tráfego e inspecionar os dados enviados ou recebidos entre o cliente e o servidor.

Quando você precisa mover informações de forma segura em uma rede, uma conexão não criptografada é inaceitável. Para tornar qualquer tipo de dados ilegível, use criptografia. Os algoritmos de criptografia devem incluir elementos de segurança para resistir a muitos tipos de ataques conhecidos, como alterar a ordem de mensagens criptografadas ou repetir dados duas vezes.

O MySQL suporta conexões criptografadas entre clientes e o servidor usando o protocolo TLS (Segurança de Camada de Transporte). O TLS é às vezes referido como SSL (Secure Sockets Layer), mas o MySQL não usa realmente o protocolo SSL para conexões criptografadas porque sua criptografia é fraca (veja Seção 6.3.2, “Protocolos e cifra TLS de conexão criptografada”).

O TLS utiliza algoritmos de criptografia para garantir que os dados recebidos em uma rede pública possam ser confiáveis. Ele possui mecanismos para detectar alterações, perda ou repetição de dados. O TLS também incorpora algoritmos que fornecem verificação de identidade usando o padrão X.509.

O X.509 permite identificar alguém na Internet. Em termos básicos, deve haver alguma entidade chamada "Autoridade de Certificação" (ou CA) que atribui certificados eletrônicos a qualquer pessoa que os precise. Os certificados dependem de algoritmos de criptografia assimétrica que têm duas chaves de criptografia (uma chave pública e uma chave secreta). O proprietário do certificado pode apresentar o certificado a outra parte como prova de identidade. Um certificado consiste na chave pública do seu proprietário. Qualquer dado criptografado usando essa chave pública pode ser descriptografado apenas usando a chave secreta correspondente, que é mantida pelo proprietário do certificado.

O MySQL pode ser compilado para suporte a conexão criptografada usando OpenSSL ou yaSSL. Para uma comparação entre os dois pacotes, consulte a Seção 6.3.4, “Capacidades dependentes da biblioteca SSL”. Para informações sobre os protocolos de criptografia e cifras suportados por cada pacote, consulte a Seção 6.3.2, “Protocolos e cifras de conexão criptografada TLS”.

Nota

É possível compilar o MySQL usando yaSSL como uma alternativa ao OpenSSL apenas antes do MySQL 5.7.28. A partir do MySQL 5.7.28, o suporte ao yaSSL é removido e todas as compilações do MySQL usam o OpenSSL.

Por padrão, os programas do MySQL tentam se conectar usando criptografia se o servidor suportar conexões criptografadas, revertendo para uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida. Para informações sobre as opções que afetam o uso de conexões criptografadas, consulte a Seção 6.3.1, “Configurando o MySQL para usar conexões criptografadas” e Opções de comando para conexões criptografadas.

O MySQL realiza a criptografia em uma base por conexão, e o uso de criptografia para um usuário específico pode ser opcional ou obrigatório. Isso permite que você escolha uma conexão criptografada ou não criptografada de acordo com as necessidades das aplicações individuais. Para obter informações sobre como exigir que os usuários usem conexões criptografadas, consulte a discussão da cláusula `REQUIRE` da declaração `CREATE USER` na Seção 13.7.1.2, “Declaração CREATE USER”. Veja também a descrição da variável de sistema `require_secure_transport` na Seção 5.1.7, “Variáveis do Sistema do Servidor”

Conexões criptografadas podem ser usadas entre servidores de origem e replicação. Veja a Seção 16.3.8, “Configurando a Replicação para Usar Conexões Criptografadas”.

Para obter informações sobre o uso de conexões criptografadas da API C do MySQL, consulte Suporte para Conexões Criptografadas.

Também é possível se conectar usando criptografia dentro de uma conexão SSH ao host do servidor MySQL. Para um exemplo, consulte a Seção 6.3.5, “Conectando-se ao MySQL remotamente a partir do Windows com SSH”.

Várias melhorias foram feitas no suporte para conexões criptografadas no MySQL 5.7. O cronograma a seguir resume as mudanças:

* 5.7.3: Do lado do cliente, uma opção explícita `--ssl` não é mais orientadora, mas prescrita. Dado um servidor habilitado para suportar conexões criptografadas, um programa cliente pode exigir uma conexão criptografada, especificando apenas a opção `--ssl`. (Anteriormente, era necessário que o cliente especificasse a opção `--ssl-ca`, ou as três opções `--ssl-ca`, `--ssl-key` e `--ssl-cert`. A tentativa de conexão falha se uma conexão criptografada não puder ser estabelecida. Outras opções `--ssl-xxx` do lado do cliente são orientadoras na ausência de `--ssl`: O cliente tenta se conectar usando criptografia, mas retorna a uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida.

* 5.7.5: O valor da opção `--ssl` do lado do servidor é ativado por padrão.

Para servidores compilados usando OpenSSL, as variáveis de sistema `auto_generate_certs` e `sha256_password_auto_generate_rsa_keys` estão disponíveis para habilitar a autogeração e autodescoberta de arquivos de certificado e chave SSL/RSA no início. Para autodescoberta de certificado e chave, se `--ssl` estiver habilitado e outras opções de `--ssl-xxx` *não* forem fornecidas para configurar conexões criptografadas explicitamente, o servidor tenta habilitar o suporte para conexões criptografadas automaticamente no início se descobrir os arquivos de certificado e chave necessários no diretório de dados.

* 5.7.6: O utilitário `mysql_ssl_rsa_setup` está disponível para facilitar a geração manual de certificados e arquivos de chave SSL/RSA. A autodescoberta de arquivos SSL/RSA no início é expandida para aplicar a todos os servidores, independentemente de serem compilados com OpenSSL ou yaSSL. (Isso significa que `auto_generate_certs` não precisa ser habilitado para que a autodescoberta ocorra.)

Se o servidor descobrir no início que o certificado CA é autoassinado, ele escreve um aviso no log de erro. (O certificado é autoassinado se criado automaticamente pelo servidor ou manualmente usando `mysql_ssl_rsa_setup`.)

* 5.7.7: A biblioteca de cliente C tenta estabelecer uma conexão criptografada por padrão, se o servidor suportar conexões criptografadas. Isso afeta os programas do cliente da seguinte forma:

+ Na ausência de uma opção `--ssl`, os clientes tentam se conectar usando criptografia, revertendo para uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida.

+ A presença de uma opção explícita `--ssl` ou um sinônimo (`--ssl=1`, `--enable-ssl`) é prescritiva: os clientes exigem uma conexão criptografada e falham se não puder ser estabelecida.

+ Com uma opção `--ssl=0` ou um sinônimo (`--skip-ssl`, `--disable-ssl`), os clientes usam uma conexão não criptografada.

Essa mudança também afeta as versões subsequentes dos Conectadores MySQL que são baseados na biblioteca de clientes C: Conectador/C++ e Conectador/ODBC.

* 5.7.8: A variável de sistema `require_secure_transport` está disponível para controlar se as conexões do cliente ao servidor devem usar algum tipo de transporte seguro.

* 5.7.10: O suporte ao protocolo TLS é estendido do TLSv1 para incluir também o TLSv1.1 e o TLSv1.2. A variável de sistema `tls_version` no lado do servidor e a opção `--tls-version` no lado do cliente permitem que o nível de suporte seja selecionado. Veja a Seção 6.3.2, “Protocolos e cifras de conexão criptografada TLS”.

* 5.7.11: Os programas de cliente MySQL suportam a opção `--ssl-mode` que permite especificar o estado de segurança da conexão com o servidor. A opção `--ssl-mode` compreende as capacidades das opções `--ssl` e `--ssl-verify-server-cert` do lado do cliente. Consequentemente, `--ssl` e `--ssl-verify-server-cert` são desatualizados e são removidos no MySQL 8.0.

* 5.7.28: O suporte para yaSSL é removido. Todos os builds do MySQL usam OpenSSL.

* 5.7.35: Os protocolos TLSv1 e TLSv1.1 são desaconselhados.

### 6.3.1 Configurando o MySQL para usar conexões criptografadas

Vários parâmetros de configuração estão disponíveis para indicar se deve usar conexões criptografadas e especificar os arquivos de certificado e chave apropriados. Esta seção fornece orientações gerais sobre a configuração do servidor e dos clientes para conexões criptografadas:

* Configuração de inicialização do lado do servidor para conexões criptografadas
* Configuração do lado do cliente para conexões criptografadas
* Configurar conexões criptografadas como obrigatórias

As conexões criptografadas também podem ser usadas em outros contextos, conforme discutido nessas seções adicionais:

* Entre os servidores de origem e os servidores replicados. Veja a Seção 16.3.8, “Configurando a Replicação para Usar Conexões Encriptadas”.

* Entre servidores de Replicação de Grupo. Consulte a Seção 17.6.2, “Suporte SSL (Secure Socket Layer) para Replicação de Grupo” (Suporte).

* Por programas de clientes que são baseados na API C do MySQL. Veja Suporte para Conexões Encriptadas.

As instruções para criar os arquivos de certificado e chave necessários estão disponíveis na Seção 6.3.3, “Criando certificados e chaves SSL e RSA”.

#### Configuração de inicialização do lado do servidor para conexões criptografadas

No lado do servidor, a opção `--ssl` especifica que o servidor permite, mas não exige conexões criptografadas. Essa opção é habilitada por padrão, portanto, não precisa ser especificada explicitamente.

Para exigir que os clientes se conectem usando conexões criptografadas, habilite a variável de sistema `require_secure_transport`. Veja Configurando Conexões Criptografadas como Obrigatórias.

Essas variáveis do sistema do lado do servidor especificam os arquivos de certificado e chave que o servidor usa ao permitir que os clientes estabeleçam conexões criptografadas:

* `ssl_ca`: O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA). (`ssl_capath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de certificado da CA.)

* `ssl_cert`: O nome do caminho do arquivo de certificado da chave pública do servidor. Este certificado pode ser enviado ao cliente e autenticado contra o certificado da CA que ele possui.

* `ssl_key`: O nome do caminho do arquivo da chave privada do servidor.

Por exemplo, para habilitar o servidor para conexões criptografadas, comece-o com essas linhas no arquivo `my.cnf`, alterando os nomes dos arquivos conforme necessário:

```sql
[mysqld]
ssl_ca=ca.pem
ssl_cert=server-cert.pem
ssl_key=server-key.pem
```

Para especificar, além disso, que os clientes devem usar conexões criptografadas, habilite a variável de sistema `require_secure_transport`:

```sql
[mysqld]
ssl_ca=ca.pem
ssl_cert=server-cert.pem
ssl_key=server-key.pem
require_secure_transport=ON
```

Cada certificado e sistema de variáveis de chave nomeiam um arquivo no formato PEM. Se você precisar criar os arquivos de certificado e chave necessários, consulte a Seção 6.3.3, “Criando Certificados e Chaves SSL e RSA”. Servidores MySQL compilados usando OpenSSL podem gerar automaticamente os arquivos de certificado e chave ausentes no início. Consulte a Seção 6.3.3.1, “Criando Certificados e Chaves SSL e RSA usando MySQL”. Alternativamente, se você tiver uma distribuição de fonte MySQL, pode testar sua configuração usando os arquivos de certificado e chave de demonstração em seu diretório `mysql-test/std_data`.

O servidor realiza a autodetecção de arquivos de certificado e chave. Se não forem fornecidas opções explícitas de conexão criptografada, exceto `--ssl` (possivelmente juntamente com `ssl_cipher`) para configurar conexões criptografadas, o servidor tenta habilitar o suporte de conexão criptografada automaticamente na inicialização:

* Se o servidor descobrir arquivos de certificado e chave válidos com os nomes `ca.pem`, `server-cert.pem` e `server-key.pem` no diretório de dados, ele habilitará o suporte para conexões criptografadas pelos clientes. (Os arquivos não precisam ter sido gerados automaticamente; o que importa é que eles tenham esses nomes e sejam válidos.)

* Se o servidor não encontrar arquivos de certificado e chave válidos no diretório de dados, ele continuará executando, mas sem suporte para conexões criptografadas.

Se o servidor habilitar automaticamente o suporte para conexão criptografada, ele escreve uma nota no log de erro. Se o servidor descobrir que o certificado CA é autoassinado, ele escreve um aviso no log de erro. (O certificado é autoassinado se criado automaticamente pelo servidor ou manualmente usando `mysql_ssl_rsa_setup`.)

O MySQL também fornece essas variáveis de sistema para o controle de conexão criptografada do lado do servidor:

* `ssl_cipher`: A lista de cifras permitidas para criptografia de conexão.

* `ssl_crl`: O nome do caminho do arquivo que contém listas de revogação de certificados. (`ssl_crlpath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de listas de revogação de certificados.)

* `tls_version`: Quais protocolos de criptografia o servidor permite para conexões criptografadas; veja a Seção 6.3.2, “Protocolos e cifra de conexão criptografada TLS”. Por exemplo, você pode configurar `tls_version` para impedir que os clientes usem protocolos menos seguros.

#### Configuração do lado do cliente para conexões criptografadas

Para uma lista completa das opções do cliente relacionadas à configuração de conexões criptografadas, consulte Opções de comando para conexões criptografadas.

Por padrão, os programas de cliente MySQL tentam estabelecer uma conexão criptografada se o servidor suportar conexões criptografadas, com controle adicional disponível através da opção `--ssl-mode`:

* Na ausência de uma opção `--ssl-mode`, os clientes tentam se conectar usando criptografia, revertendo para uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida. Esse também é o comportamento com uma opção explícita `--ssl-mode=PREFERRED`.

* Com `--ssl-mode=REQUIRED`, os clientes exigem uma conexão criptografada e falham se não puder ser estabelecida.

* Com `--ssl-mode=DISABLED`, os clientes usam uma conexão não criptografada.

* Com `--ssl-mode=VERIFY_CA` ou `--ssl-mode=VERIFY_IDENTITY`, os clientes exigem uma conexão criptografada e também realizam verificação contra o certificado da CA do servidor e (com `VERIFY_IDENTITY`) contra o nome do host do servidor em seu certificado.

Importante

A configuração padrão, `--ssl-mode=PREFERRED`, produz uma conexão criptografada se os outros ajustes padrão não forem alterados. No entanto, para ajudar a prevenir ataques sofisticados de homem no meio, é importante que o cliente verifique a identidade do servidor. Os ajustes `--ssl-mode=VERIFY_CA` e `--ssl-mode=VERIFY_IDENTITY` são uma escolha melhor do que a configuração padrão para ajudar a prevenir esse tipo de ataque. `VERIFY_CA` faz com que o cliente verifique se o certificado do servidor é válido. `VERIFY_IDENTITY` faz com que o cliente verifique se o certificado do servidor é válido e também faz com que o cliente verifique se o nome de host que está usando corresponde à identidade no certificado do servidor. Para implementar um desses ajustes, você deve primeiro garantir que o certificado da CA do servidor esteja disponível de forma confiável para todos os clientes que o usam em seu ambiente, caso contrário, problemas de disponibilidade resultarão. Por essa razão, eles não são a configuração padrão.

As tentativas de estabelecer uma conexão não criptografada falham se a variável de sistema `require_secure_transport` estiver habilitada no lado do servidor, fazendo com que o servidor exija conexões criptografadas. Veja Configurando Conexões Criptografadas como Obrigatórias.

As seguintes opções do lado do cliente identificam os arquivos de certificado e chave que os clientes usam ao estabelecer conexões criptografadas com o servidor. Eles são semelhantes às variáveis de sistema `ssl_ca`, `ssl_cert` e `ssl_key` usadas do lado do servidor, mas `--ssl-cert` e `--ssl-key` identificam a chave pública e privada do cliente:

* `--ssl-ca`: O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA). Esta opção, se utilizada, deve especificar o mesmo certificado utilizado pelo servidor. (`--ssl-capath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de certificado da CA.)

* `--ssl-cert`: O nome do caminho do arquivo de certificado da chave pública do cliente.

* `--ssl-key`: O nome do caminho do arquivo da chave privada do cliente.

Para uma segurança adicional em relação àquela fornecida pela criptografia padrão, os clientes podem fornecer um certificado CA que corresponda ao utilizado pelo servidor e habilitar a verificação da identidade do nome do host. Dessa forma, o servidor e o cliente colocam sua confiança no mesmo certificado CA e o cliente verifica que o host ao qual se conectou é o pretendido:

* Para especificar o certificado CA, use `--ssl-ca` (ou `--ssl-capath`) e especifique `--ssl-mode=VERIFY_CA`.

* Para habilitar a verificação de identidade do nome do host também, use `--ssl-mode=VERIFY_IDENTITY` em vez de `--ssl-mode=VERIFY_CA`.

Nota

A verificação de identidade do nome do host com `VERIFY_IDENTITY` não funciona com certificados autoassinados que são criados automaticamente pelo servidor ou manualmente usando `mysql_ssl_rsa_setup` (consulte a Seção 6.3.3.1, “Criando certificados SSL e RSA e chaves usando MySQL”). Esses certificados autoassinados não contêm o nome do servidor como valor de Nome Comum.

Antes do MySQL 5.7.23, a verificação de identidade do nome do host também não funciona com certificados que especificam o Nome Comum usando caracteres especiais, porque esse nome é comparado literalmente ao nome do servidor.

O MySQL também oferece essas opções para controle de conexão criptografada do lado do cliente:

* `--ssl-cipher`: A lista de cifra permitida para criptografia de conexão.

* `--ssl-crl`: O nome do caminho do arquivo que contém listas de revogação de certificados. (`--ssl-crlpath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de listas de revogação de certificados.)

* `--tls-version`: Os protocolos de criptografia permitidos; veja a Seção 6.3.2, “Protocolos e cifra de conexão criptografada TLS”.

Dependendo dos requisitos de criptografia da conta MySQL utilizada por um cliente, o cliente pode ser obrigado a especificar certas opções para se conectar usando criptografia ao servidor MySQL.

Suponha que você queira se conectar usando uma conta que não tenha requisitos especiais de criptografia ou que tenha sido criada usando uma declaração `CREATE USER` que incluísse a cláusula `REQUIRE SSL`. Supondo que o servidor suporte conexões criptografadas, um cliente pode se conectar usando criptografia sem a opção `--ssl-mode` ou com uma opção explícita `--ssl-mode=PREFERRED`:

```sql
mysql
```

Ou:

```sql
mysql --ssl-mode=PREFERRED
```

Para uma conta criada com uma cláusula `REQUIRE SSL`, a tentativa de conexão falha se uma conexão criptografada não puder ser estabelecida. Para uma conta sem requisitos especiais de criptografia, a tentativa retorna a uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida. Para evitar a falha e o retorno se uma conexão criptografada não puder ser obtida, conecte-se da seguinte forma:

```sql
mysql --ssl-mode=REQUIRED
```

Se a conta tiver requisitos de segurança mais rigorosos, outras opções devem ser especificadas para estabelecer uma conexão criptografada:

* Para contas criadas com uma cláusula `REQUIRE X509`, os clientes devem especificar pelo menos `--ssl-cert` e `--ssl-key`. Além disso, `--ssl-ca` (ou `--ssl-capath`) é recomendado para que o certificado público fornecido pelo servidor possa ser verificado. Por exemplo (entre no comando em uma única linha):

  ```sql
  mysql --ssl-ca=ca.pem
        --ssl-cert=client-cert.pem
        --ssl-key=client-key.pem
  ```

* Para contas criadas com uma cláusula `REQUIRE ISSUER` ou `REQUIRE SUBJECT`, os requisitos de criptografia são os mesmos que para `REQUIRE X509`, mas o certificado deve corresponder à emissão ou ao assunto, respectivamente, especificados na definição da conta.

Para informações adicionais sobre a cláusula `REQUIRE`, consulte a Seção 13.7.1.2, “Instrução CREATE USER”.

Os servidores MySQL podem gerar arquivos de certificado e chave do cliente que os clientes podem usar para se conectar às instâncias do servidor MySQL. Veja a Seção 6.3.3, “Criando certificados e chaves SSL e RSA”.

Importante

Se um cliente que se conecta a uma instância do servidor MySQL usar um certificado SSL com a extensão `extendedKeyUsage` (uma extensão X.509 v3), o uso de chave estendido deve incluir autenticação do cliente (`clientAuth`). Se o certificado SSL for especificado apenas para autenticação do servidor (`serverAuth`) e para outros propósitos que não sejam certificados de cliente, a verificação do certificado falha e a conexão do cliente com a instância do servidor MySQL falha. Não há extensão `extendedKeyUsage` em certificados SSL gerados pelo MySQL Server (como descrito na Seção 6.3.3.1, “Criando Certificados SSL e RSA e Chaves usando MySQL”), e os certificados SSL criados usando o comando **openssl** seguindo as instruções na Seção 6.3.3.2, “Criando Certificados SSL e Chaves usando openssl”. Se você usar seu próprio certificado de cliente criado de outra maneira, certifique-se de que qualquer extensão `extendedKeyUsage` inclua autenticação do cliente.

Para impedir o uso de criptografia e substituir outras opções de `--ssl-xxx`, invoque o programa cliente com `--ssl-mode=DISABLED`:

```sql
mysql --ssl-mode=DISABLED
```

Para determinar se a conexão atual com o servidor utiliza criptografia, verifique o valor da sessão da variável de status `Ssl_cipher`. Se o valor estiver vazio, a conexão não está criptografada. Caso contrário, a conexão está criptografada e o valor indica o algoritmo de criptografia. Por exemplo:

```sql
mysql> SHOW SESSION STATUS LIKE 'Ssl_cipher';
+---------------+---------------------------+
| Variable_name | Value                     |
+---------------+---------------------------+
| Ssl_cipher    | DHE-RSA-AES128-GCM-SHA256 |
+---------------+---------------------------+
```

Para o cliente **mysql**, uma alternativa é usar o comando `STATUS` ou `\s` e verificar a linha `SSL`:

```sql
mysql> \s
...
SSL: Not in use
...
```

Ou:

```sql
mysql> \s
...
SSL: Cipher in use is DHE-RSA-AES128-GCM-SHA256
...
```

#### Configurando conexões criptografadas como obrigatórias

Para algumas implantações do MySQL, pode não ser apenas desejável, mas obrigatório, usar conexões criptografadas (por exemplo, para satisfazer requisitos regulatórios). Esta seção discute as configurações que permitem fazer isso. Esses níveis de controle estão disponíveis:

* Você pode configurar o servidor para exigir que os clientes se conectem usando conexões criptografadas.

* Você pode invocar programas individuais de cliente para exigir uma conexão criptografada, mesmo que o servidor permita, mas não exija criptografia.

* Você pode configurar contas individuais do MySQL para serem utilizáveis apenas em conexões criptografadas.

Para exigir que os clientes se conectem usando conexões criptografadas, habilite a variável de sistema `require_secure_transport`. Por exemplo, coloque essas linhas no arquivo do servidor `my.cnf`:

```sql
[mysqld]
require_secure_transport=ON
```

Com `require_secure_transport` habilitado, as conexões do cliente ao servidor exigem o uso de algum tipo de transporte seguro, e o servidor permite apenas conexões TCP/IP que utilizam SSL, ou conexões que utilizam um arquivo de soquete (em Unix) ou memória compartilhada (em Windows). O servidor rejeita tentativas de conexão não seguras, que falham com um erro `ER_SECURE_TRANSPORT_REQUIRED`.

Para invocar um programa cliente que exija uma conexão criptografada, independentemente de o servidor exigir criptografia, use um valor de opção `--ssl-mode`, `REQUIRED`, `VERIFY_CA` ou `VERIFY_IDENTITY`. Por exemplo:

```sql
mysql --ssl-mode=REQUIRED
mysqldump --ssl-mode=VERIFY_CA
mysqladmin --ssl-mode=VERIFY_IDENTITY
```

Para configurar uma conta MySQL para ser utilizável apenas em conexões criptografadas, inclua uma cláusula `REQUIRE` na declaração `CREATE USER` que cria a conta, especificando naquela cláusula as características de criptografia que você deseja. Por exemplo, para exigir uma conexão criptografada e o uso de um certificado X.509 válido, use `REQUIRE X509`:

```sql
CREATE USER 'jeffrey'@'localhost' REQUIRE X509;
```

Para informações adicionais sobre a cláusula `REQUIRE`, consulte a Seção 13.7.1.2, “Instrução CREATE USER”.

Para modificar contas existentes que não possuem requisitos de criptografia, use a declaração `ALTER USER`.

### 6.3.2 Conexão Encriptada Protocolos e cifra TLS

O MySQL suporta vários protocolos e cifras TLS e permite configurar quais protocolos e cifras permitir para conexões criptografadas. Também é possível determinar qual protocolo e cifra a sessão atual usa.

* Protocolos de conexão TLS suportados
* Configuração do protocolo de conexão TLS
* Protocolos TLS obsoletos
* Configuração do cifrador de conexão
* Negociação do protocolo TLS de conexão
* Monitoramento do protocolo e cifrador TLS da sessão atual do cliente

#### Protocolos de conexão suportados TLS

O MySQL suporta conexões criptografadas usando os protocolos TLSv1, TLSv1.1 e TLSv1.2, listados na ordem de menos seguro para mais seguro. O conjunto de protocolos realmente permitido para conexões está sujeito a vários fatores:

* Configuração do MySQL. Os protocolos TLS permitidos podem ser configurados tanto no lado do servidor quanto no lado do cliente para incluir apenas um subconjunto dos protocolos TLS suportados. A configuração em ambos os lados deve incluir pelo menos um protocolo em comum, ou as tentativas de conexão não podem negociar um protocolo a ser usado. Para obter detalhes, consulte Negociação de protocolo TLS de conexão.

* Configuração de anfitrião em todo o sistema. O sistema de anfitrião pode permitir apenas certos protocolos TLS, o que significa que as conexões MySQL não podem usar protocolos não permitidos, mesmo que o MySQL próprio os permita:

Suponha que a configuração do MySQL permita TLSv1, TLSv1.1 e TLSv1.2, mas a configuração do sistema do seu host permita apenas conexões que utilizem TLSv1.2 ou superior. Nesse caso, você não pode estabelecer conexões MySQL que utilizem TLSv1 ou TLSv1.1, mesmo que o MySQL esteja configurado para permitir essas conexões, porque o sistema do host não as permite.

+ Se a configuração do MySQL permitir TLSv1, TLSv1.1 e TLSv1.2, mas a configuração do sistema do seu host permite apenas conexões que utilizem TLSv1.3 ou superior, você não poderá estabelecer conexões no MySQL, porque nenhum protocolo permitido pelo MySQL é permitido pelo sistema do host.

As soluções para este problema incluem:

+ Altere a configuração do host em todo o sistema para permitir protocolos TLS adicionais. Consulte a documentação do seu sistema operacional para obter instruções. Por exemplo, seu sistema pode ter um arquivo `/etc/ssl/openssl.cnf` que contém essas linhas para restringir os protocolos TLS a TLSv1.2 ou superior:

    ```sql
    [system_default_sect]
    MinProtocol = TLSv1.2
    ```

Mudar o valor para uma versão de protocolo mais baixa ou `None` torna o sistema mais permissivo. Essa solução tem a desvantagem de que permitir protocolos mais baixos (menos seguros) pode ter consequências adversas à segurança.

+ Se você não puder ou não quiser alterar a configuração TLS do sistema hoste, mude as aplicações do MySQL para usar protocolos TLS mais altos (mais seguros) que sejam permitidos pelo sistema hoste. Isso pode não ser possível para versões mais antigas do MySQL que suportam apenas versões de protocolo mais baixas. Por exemplo, TLSv1 é o único protocolo suportado antes do MySQL 5.6.46, então as tentativas de se conectar a um servidor pré-5.6.46 falham mesmo que o cliente seja de uma versão mais recente do MySQL que suporte versões de protocolo mais altas. Nesses casos, pode ser necessário fazer uma atualização para uma versão do MySQL que suporte versões adicionais de TLS.

* A biblioteca SSL. Se a biblioteca SSL não suportar um protocolo específico, o MySQL também não o faz, e quaisquer partes da discussão a seguir que especifiquem esse protocolo não se aplicam.

+ Quando compilado com OpenSSL 1.0.1 ou superior, o MySQL suporta os protocolos TLSv1, TLSv1.1 e TLSv1.2.

+ Quando compilado com yaSSL, o MySQL suporta os protocolos TLSv1 e TLSv1.1.

Nota

É possível compilar o MySQL usando yaSSL como uma alternativa ao OpenSSL apenas antes do MySQL 5.7.28. A partir do MySQL 5.7.28, o suporte ao yaSSL é removido e todas as compilações do MySQL usam o OpenSSL.

#### Configuração do Protocolo TLS de Conexão

No lado do servidor, o valor da variável de sistema `tls_version` determina quais protocolos TLS um servidor MySQL permite para conexões criptografadas. O valor de `tls_version` se aplica a conexões de clientes e de servidores replicados que utilizam replicação de fonte/replica regular. O valor da variável é uma lista de uma ou mais versões de protocolo separadas por vírgula desta lista (não sensível ao caso): TLSv1, TLSv1.1, TLSv1.2. Por padrão, esta variável lista todos os protocolos suportados pela biblioteca SSL usada para compilar o MySQL (`TLSv1,TLSv1.1,TLSv1.2` para OpenSSL, `TLSv1,TLSv1.1` para yaSSL). Para determinar o valor de `tls_version` em tempo de execução, use esta declaração:

```sql
mysql> SHOW GLOBAL VARIABLES LIKE 'tls_version';
+---------------+-----------------------+
| Variable_name | Value                 |
+---------------+-----------------------+
| tls_version   | TLSv1,TLSv1.1,TLSv1.2 |
+---------------+-----------------------+
```

Para alterar o valor de `tls_version`, configure-o na inicialização do servidor. Por exemplo, para permitir conexões que utilizem o protocolo TLSv1.1 ou TLSv1.2, mas proibir conexões que utilizem o protocolo TLSv1 menos seguro, use essas linhas no arquivo do servidor `my.cnf`:

```sql
[mysqld]
tls_version=TLSv1.1,TLSv1.2
```

Para ser ainda mais restritivo e permitir apenas conexões TLSv1.2, configure `tls_version` da seguinte forma (assumindo que seu servidor foi compilado usando OpenSSL, porque o yaSSL não suporta TLSv1.2):

```sql
[mysqld]
tls_version=TLSv1.2
```

Nota

A partir do MySQL 5.7.35, os protocolos de conexão TLSv1 e TLSv1.1 são desatualizados e o suporte para eles está sujeito à remoção em uma versão futura do MySQL. Veja Protocolos TLS Desatualizados.

Do lado do cliente, a opção `--tls-version` especifica quais protocolos TLS um programa cliente permite para conexões ao servidor. O formato do valor da opção é o mesmo que para a variável de sistema `tls_version` descrita anteriormente (uma lista de uma ou mais versões de protocolo separadas por vírgula).

Para a replicação de origem/replica, a opção `MASTER_TLS_VERSION` para a declaração `CHANGE MASTER TO` especifica quais protocolos TLS um servidor replica permite para conexões à origem. O formato do valor da opção é o mesmo que para a variável de sistema `tls_version`, descrita anteriormente. Veja a Seção 16.3.8, “Configurando a Replicação para Usar Conexões Encriptadas”.

Os protocolos que podem ser especificados para `MASTER_TLS_VERSION` dependem da biblioteca SSL. Esta opção é independente e não afetada pelo valor do servidor `tls_version`. Por exemplo, um servidor que atua como replica pode ser configurado com `tls_version` definido como TLSv1.2 para permitir apenas conexões de entrada que utilizem TLSv1.2, mas também configurado com `MASTER_TLS_VERSION` definido como TLSv1.1 para permitir apenas TLSv1.1 para conexões de replica saindo da fonte.

A configuração do protocolo TLS afeta o protocolo que uma conexão específica utiliza, conforme descrito na Negociação de Protocolo TLS de Conexão.

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

A menos que você pretenda desabilitar conexões criptografadas, a lista de protocolos permitidos não deve estar vazia. Se você definir um parâmetro de versão TLS para a string vazia, conexões criptografadas não podem ser estabelecidas:

* `tls_version`: O servidor não permite conexões recebidas criptografadas.

* `--tls-version`: O cliente não permite conexões saídas criptografadas para o servidor.

* `MASTER_TLS_VERSION`: A replica não permite conexões saídas criptografadas para a fonte.

#### Protocolos TLS descontinuados

A partir do MySQL 5.7.35, os protocolos de conexão TLSv1 e TLSv1.1 são desatualizados e o suporte a eles está sujeito à remoção em uma versão futura do MySQL. (Para informações de fundo, consulte o memorando do IETF [Deprecating TLSv1.0 and TLSv1.1][(https://tools.ietf.org/id/draft-ietf-tls-oldversions-deprecate-02.html)].). É recomendável que as conexões sejam feitas usando os protocolos mais seguros TLSv1.2 e TLSv1.3. O TLSv1.3 exige que o servidor MySQL e o aplicativo cliente sejam compilados com OpenSSL 1.1.1 ou superior.

No lado do servidor, essa depreciação tem os seguintes efeitos:

* Se a variável de sistema `tls_version` receber um valor contendo um protocolo TLS obsoleto durante o início do servidor, o servidor escreve um aviso para cada protocolo obsoleto no log de erro.

* Se um cliente se conectar com sucesso usando um protocolo TLS obsoleto, o servidor escreve um aviso no log de erro.

Do lado do cliente, a depreciação não tem efeito visível. Os clientes não emitem um aviso se configurados para permitir um protocolo TLS depreciado. Isso inclui:

* Programas de cliente que suportam a opção `--tls-version` para especificar protocolos TLS para conexões ao servidor MySQL.

* Declarações que permitem que as réplicas especifiquem os protocolos TLS para conexões ao servidor de origem. (`CHANGE MASTER TO` tem uma opção `MASTER_TLS_VERSION`.)

#### Configuração do Cipher de Conexão

Um conjunto padrão de cifra é aplicado a conexões criptografadas, que pode ser sobrescrito ao configurar explicitamente as cifras permitidas. Durante o estabelecimento da conexão, ambos os lados de uma conexão devem permitir alguma cifra em comum ou a conexão falha. Das cifras permitidas comuns a ambos os lados, a biblioteca SSL escolhe a que é suportada pelo certificado fornecido que tem a maior prioridade.

Para especificar um ou mais cifradores para conexões criptografadas, defina a variável de sistema `ssl_cipher` no lado do servidor e use a opção `--ssl-cipher` para os programas do cliente.

Para conexões de replicação de origem/replica, onde essa instância do servidor é a origem, defina a variável de sistema `ssl_cipher`. Onde essa instância do servidor é a replica, use a opção `MASTER_SSL_CIPHER` para a declaração `CHANGE MASTER TO`. Veja a Seção 16.3.8, “Configurando a Replicação para Usar Conexões Encriptadas”.

Um cifrador específico pode funcionar apenas com certos protocolos TLS, o que afeta o processo de negociação de protocolo TLS. Veja Negociação de protocolo TLS de conexão.

Para determinar quais cifras um servidor específico suporta, verifique o valor da sessão da variável de status `Ssl_cipher_list`:

```sql
SHOW SESSION STATUS LIKE 'Ssl_cipher_list';
```

A variável de status `Ssl_cipher_list` lista os possíveis cifradores SSL (vazio para conexões sem SSL). O conjunto de cifradores disponíveis depende da versão do MySQL e se o MySQL foi compilado com OpenSSL ou yaSSL, e (para OpenSSL) da versão da biblioteca usada para compilar o MySQL.

Nota

Os cifradores ECDSA só funcionam em combinação com um certificado SSL que utiliza ECDSA para a assinatura digital, e não funcionam com certificados que utilizam RSA. O processo de geração automática do MySQL Server para certificados SSL não gera certificados assinados com ECDSA, ele gera apenas certificados assinados com RSA. Não selecione cifradores ECDSA a menos que você tenha um certificado ECDSA disponível.

MySQL passa uma lista de cifra padrão para a biblioteca SSL.

MySQL passa essa lista de cifra padrão para o OpenSSL:

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

MySQL passa essa lista de cifra padrão para o yaSSL:

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

* Os seguintes cifrados são permanentemente restritos:

  ```sql
  !DHE-DSS-DES-CBC3-SHA
  !DHE-RSA-DES-CBC3-SHA
  !ECDH-RSA-DES-CBC3-SHA
  !ECDH-ECDSA-DES-CBC3-SHA
  !ECDHE-RSA-DES-CBC3-SHA
  !ECDHE-ECDSA-DES-CBC3-SHA
  ```

* As seguintes categorias de cifra são permanentemente restritas:

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

Se o servidor for iniciado com a variável de sistema `ssl_cert` definida para um certificado que utiliza qualquer um dos cifrados ou categorias de cifrado restritos anteriores, o servidor inicia com o suporte para conexões criptografadas desativado.

#### Negociação do Protocolo TLS de Conexão

As tentativas de conexão no MySQL negociam o uso da versão mais alta do protocolo TLS disponível em ambos os lados, para a qual um algoritmo de criptografia compatível com o protocolo esteja disponível em ambos os lados. O processo de negociação depende de fatores como a biblioteca SSL usada para compilar o servidor e o cliente, a configuração do protocolo e do algoritmo de criptografia TLS, e o tamanho da chave usado:

* Para que a tentativa de conexão seja bem-sucedida, a configuração do protocolo TLS do servidor e do cliente deve permitir algum protocolo em comum.

* Da mesma forma, a configuração do cifrador de criptografia do servidor e do cliente deve permitir algum cifrador comum. Um cifrador dado pode funcionar apenas com protocolos TLS específicos, portanto, um protocolo disponível para o processo de negociação não é escolhido a menos que também haja um cifrador compatível.

* Se o servidor e o cliente forem compilados usando OpenSSL, o TLSv1.2 é usado, se possível. Se o servidor e o cliente forem compilados usando yaSSL, o TLSv1.1 é usado, se possível. (“Possível” significa que a configuração do servidor e do cliente deve permitir o protocolo indicado, e ambos também devem permitir algum cifrado compatível com o protocolo.) Caso contrário, o MySQL continua na lista de protocolos disponíveis, passando de protocolos mais seguros para menos seguros. A ordem de negociação é independente da ordem em que os protocolos são configurados. Por exemplo, a ordem de negociação é a mesma, independentemente de `tls_version` ter um valor de `TLSv1,TLSv1.1,TLSv1.2` ou `TLSv1.2,TLSv1.1,TLSv1`.

Nota

Antes do MySQL 5.7.10, o MySQL suporta apenas TLSv1, tanto para OpenSSL quanto para yaSSL, e não existe nenhuma variável do sistema ou opção do cliente para especificar quais protocolos TLS devem ser permitidos.

* O TLSv1.2 não funciona com todos os cifradores que têm um tamanho de chave de 512 bits ou menos. Para usar este protocolo com uma chave desse tipo, defina a variável de sistema `ssl_cipher` no lado do servidor ou use a opção `--ssl-cipher` do cliente para especificar explicitamente o nome do cifrador:

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

* Para uma melhor segurança, use um certificado com um tamanho de chave RSA de pelo menos 2048 bits.

Se o servidor e o cliente não tiverem um protocolo permitido em comum e um cifrador compatível com o protocolo em comum, o servidor termina a solicitação de conexão. Exemplos:

* Se o servidor estiver configurado com `tls_version=TLSv1.1,TLSv1.2`:

+ As tentativas de conexão falham para clientes invocados com `--tls-version=TLSv1`, e para clientes mais antigos que suportam apenas TLSv1.

+ Da mesma forma, as tentativas de conexão falham para réplicas configuradas com `MASTER_TLS_VERSION = 'TLSv1'`, e para réplicas mais antigas que suportam apenas TLSv1.

* Se o servidor estiver configurado com `tls_version=TLSv1` ou for um servidor mais antigo que suporte apenas TLSv1:

+ As tentativas de conexão falham para clientes invocados com `--tls-version=TLSv1.1,TLSv1.2`.

+ Da mesma forma, as tentativas de conexão falham para réplicas configuradas com `MASTER_TLS_VERSION = 'TLSv1.1,TLSv1.2'`.

O MySQL permite especificar uma lista de protocolos a serem suportados. Essa lista é passada diretamente para a biblioteca SSL subjacente e, em última análise, cabe a essa biblioteca quais protocolos ela realmente permite da lista fornecida. Consulte o código-fonte do MySQL e a documentação do OpenSSL `SSL_CTX_new()` (https://www.openssl.org/docs/man1.1.0/ssl/SSL_CTX_new.html) para obter informações sobre como a biblioteca SSL lida com isso.

#### Monitoramento do Protocolo TLS e Cipher da Sessão Atual do Cliente

Para determinar qual protocolo de criptografia TLS e qual cifra a sessão atual do cliente utiliza, verifique os valores da sessão das variáveis de status `Ssl_version` e `Ssl_cipher`:

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

### 6.3.3 Criando Certificados e Chaves SSL e RSA

A discussão a seguir descreve como criar os arquivos necessários para o suporte SSL e RSA no MySQL. A criação de arquivos pode ser realizada usando as facilidades fornecidas pelo próprio MySQL, ou invocando o comando **openssl** diretamente.

Os certificados SSL e os arquivos de chave permitem que o MySQL suporte conexões criptografadas usando SSL. Veja a Seção 6.3.1, “Configurando o MySQL para usar conexões criptografadas”.

Os arquivos de chave RSA permitem que o MySQL suporte a troca segura de senhas em conexões não criptografadas para contas autenticadas pelo plugin `sha256_password`. Veja a Seção 6.4.1.5, “Autenticação Plugável SHA-256”.

#### 6.3.3.1 Criando certificados e chaves SSL e RSA usando MySQL

O MySQL oferece essas maneiras de criar os arquivos de certificado SSL e chave e os arquivos de par de chave RSA necessários para suportar conexões criptografadas usando SSL e troca segura de senhas usando RSA em conexões não criptografadas, se esses arquivos estiverem faltando:

* O servidor pode gerar automaticamente esses arquivos na inicialização, para distribuições MySQL compiladas usando OpenSSL.

* Os usuários podem invocar o utilitário `mysql_ssl_rsa_setup` manualmente.

* Para alguns tipos de distribuição, como pacotes RPM e DEB, a invocação `mysql_ssl_rsa_setup` ocorre durante a inicialização do diretório de dados. Nesse caso, a distribuição do MySQL não precisa ter sido compilada com OpenSSL, desde que o comando **openssl** esteja disponível.

Importante

A autogeração do servidor e `mysql_ssl_rsa_setup` ajudam a reduzir a barreira para o uso do SSL, facilitando a geração dos arquivos necessários. No entanto, os certificados gerados por esses métodos são autoassinados, o que pode não ser muito seguro. Após ganhar experiência usando esses arquivos, considere obter material de certificado/chave de uma autoridade de certificados registrada.

Importante

Se um cliente que se conecta a uma instância do servidor MySQL usar um certificado SSL com a extensão `extendedKeyUsage` (uma extensão X.509 v3), o uso de chave estendido deve incluir autenticação de cliente (`clientAuth`). Se o certificado SSL for especificado apenas para autenticação do servidor (`serverAuth`) e para outros propósitos de certificado não relacionados ao cliente, a verificação do certificado falha e a conexão do cliente com a instância do servidor MySQL falha. Não há extensão `extendedKeyUsage` em certificados SSL gerados pelo MySQL Server. Se você usar seu próprio certificado de cliente criado de outra maneira, certifique-se de que qualquer extensão `extendedKeyUsage` inclua autenticação de cliente.

* Geração automática de arquivos SSL e RSA * Geração manual de arquivos SSL e RSA usando mysql_ssl_rsa_setup * Características dos arquivos SSL e RSA

##### Geração automática de arquivos SSL e RSA

Para as distribuições do MySQL compiladas com OpenSSL, o servidor MySQL tem a capacidade de gerar automaticamente os arquivos SSL e RSA ausentes no início. As variáveis de sistema `auto_generate_certs` e `sha256_password_auto_generate_rsa_keys` controlam a geração automática desses arquivos. Essas variáveis são ativadas por padrão. Elas podem ser ativadas no início e inspecionadas, mas não podem ser definidas no tempo de execução.

Ao iniciar, o servidor gera automaticamente os arquivos de certificado e chave SSL do lado do servidor e do lado do cliente no diretório de dados se a variável de sistema `auto_generate_certs` estiver habilitada, não são especificadas outras opções SSL além de `--ssl`, e os arquivos SSL do lado do servidor estão ausentes do diretório de dados. Esses arquivos permitem conexões criptografadas do cliente usando SSL; veja Seção 6.3.1, “Configurando o MySQL para usar conexões criptografadas”.

1. O servidor verifica o diretório de dados em busca de arquivos SSL com os seguintes nomes:

   ```sql
   ca.pem
   server-cert.pem
   server-key.pem
   ```

2. Se algum desses arquivos estiver presente, o servidor não cria arquivos SSL. Caso contrário, ele os cria, além de alguns arquivos adicionais:

   ```sql
   ca.pem               Self-signed CA certificate
   ca-key.pem           CA private key
   server-cert.pem      Server certificate
   server-key.pem       Server private key
   client-cert.pem      Client certificate
   client-key.pem       Client private key
   ```

3. Se o servidor gerar automaticamente os arquivos SSL, ele usa os nomes dos arquivos `ca.pem`, `server-cert.pem` e `server-key.pem` para definir as variáveis do sistema correspondentes (`ssl_ca`, `ssl_cert`, `ssl_key`).

Ao inicializar, o servidor gera automaticamente arquivos de par de chave privada/pública RSA no diretório de dados se todas essas condições forem verdadeiras: A variável de sistema `sha256_password_auto_generate_rsa_keys` estiver habilitada; não houver opções RSA especificadas; os arquivos RSA estiverem ausentes do diretório de dados. Esses arquivos de par de chave permitem a troca segura de senhas usando RSA em conexões não criptografadas para contas autenticadas pelo plugin `sha256_password`; consulte a Seção 6.4.1.5, “Autenticação Conectada SHA-256”.

1. O servidor verifica o diretório de dados em busca de arquivos RSA com os seguintes nomes:

   ```sql
   private_key.pem      Private member of private/public key pair
   public_key.pem       Public member of private/public key pair
   ```

2. Se algum desses arquivos estiver presente, o servidor não cria arquivos RSA. Caso contrário, ele os cria.

3. Se o servidor gerar automaticamente os arquivos RSA, ele usa seus nomes para definir as variáveis do sistema correspondentes (`sha256_password_private_key_path`, `sha256_password_public_key_path`).

##### Gerando arquivos SSL e RSA manualmente usando mysql_ssl_rsa_setup

As distribuições do MySQL incluem uma ferramenta `mysql_ssl_rsa_setup` que pode ser invocada manualmente para gerar arquivos SSL e RSA. Esta ferramenta está incluída em todas as distribuições do MySQL, mas exige que o comando **openssl** esteja disponível. Para instruções de uso, consulte a Seção 4.4.5, “mysql_ssl_rsa_setup — Crie arquivos SSL/RSA”.

##### Características dos arquivos SSL e RSA

Os arquivos SSL e RSA criados automaticamente pelo servidor ou ao invocar `mysql_ssl_rsa_setup` têm essas características:

* As chaves SSL e RSA têm um tamanho de 2048 bits.
* O certificado da CA SSL é autoassinado.
* Os certificados do servidor e do cliente SSL são assinados com o certificado e a chave da CA, usando o algoritmo de assinatura `sha256WithRSAEncryption`.

* Os certificados SSL utilizam esses valores de Nome Comum (CN), com o tipo de certificado apropriado (CA, Servidor, Cliente):

  ```sql
  ca.pem:         MySQL_Server_suffix_Auto_Generated_CA_Certificate
  server-cert.pm: MySQL_Server_suffix_Auto_Generated_Server_Certificate
  client-cert.pm: MySQL_Server_suffix_Auto_Generated_Client_Certificate
  ```

O valor *`suffix` é baseado no número da versão do MySQL. Para arquivos gerados por `mysql_ssl_rsa_setup`, o sufixo pode ser especificado explicitamente usando a opção `--suffix`.

Para arquivos gerados pelo servidor, se os valores CN resultantes excederem 64 caracteres, a parte `_suffix` do nome é omitida.

* Os arquivos SSL têm valores em branco para País (C), Estado ou Província (ST), Organização (O), Nome da Unidade da Organização (OU) e endereço de e-mail.

* Arquivos SSL criados pelo servidor ou pelo `mysql_ssl_rsa_setup` são válidos por dez anos a partir do momento da geração.

* Os arquivos RSA não expiram. * Os arquivos SSL têm números de série diferentes para cada par de certificado/chave (1 para CA, 2 para servidor, 3 para cliente).

* Arquivos criados automaticamente pelo servidor pertencem à conta que executa o servidor. Arquivos criados usando `mysql_ssl_rsa_setup` pertencem ao usuário que invocou esse programa. Isso pode ser alterado em sistemas que suportam a chamada de sistema `chown()` se o programa for invocado por `root` e a opção `--uid` for dada para especificar o usuário que deve possuir os arquivos.

* Em sistemas Unix e Unix-like, o modo de acesso ao arquivo é 644 para arquivos de certificado (ou seja, legíveis por qualquer pessoa) e 600 para arquivos de chave (ou seja, acessíveis apenas pela conta que executa o servidor).

Para ver o conteúdo de um certificado SSL (por exemplo, para verificar a faixa de datas em que ele é válido), invoque o **openssl** diretamente:

```sql
openssl x509 -text -in ca.pem
openssl x509 -text -in server-cert.pem
openssl x509 -text -in client-cert.pem
```

É também possível verificar as informações de expiração do certificado SSL usando esta declaração SQL:

```sql
mysql> SHOW STATUS LIKE 'Ssl_server_not%';
+-----------------------+--------------------------+
| Variable_name         | Value                    |
+-----------------------+--------------------------+
| Ssl_server_not_after  | Apr 28 14:16:39 2027 GMT |
| Ssl_server_not_before | May  1 14:16:39 2017 GMT |
+-----------------------+--------------------------+
```

#### 6.3.3.2 Criando certificados SSL e chaves usando o openssl

Esta seção descreve como usar o comando **openssl** para configurar certificados SSL e arquivos de chave para uso por servidores e clientes MySQL. O primeiro exemplo mostra um procedimento simplificado, como você pode usar a partir da linha de comando. O segundo exemplo mostra um script que contém mais detalhes. Os dois primeiros exemplos são destinados ao uso em Unix e ambos usam o comando **openssl** que faz parte do OpenSSL. O terceiro exemplo descreve como configurar arquivos SSL no Windows.

Nota

Existem alternativas mais fáceis para gerar os arquivos necessários para SSL do que o procedimento descrito aqui: deixe o servidor gerar automaticamente ou use o programa `mysql_ssl_rsa_setup`. Veja a Seção 6.3.3.1, “Criando Certificados e Chaves SSL e RSA usando MySQL”.

Importante

Qualquer método que você use para gerar os arquivos de certificado e chave, o valor do Nome Comum usado para os certificados/chaves do servidor e do cliente deve ser diferente do valor do Nome Comum usado para o certificado da CA. Caso contrário, os arquivos de certificado e chave não funcionarão para servidores compilados usando OpenSSL. Um erro típico nesse caso é:

```sql
ERROR 2026 (HY000): SSL connection error:
error:00000001:lib(0):func(0):reason(1)
```

Importante

Se um cliente que se conecta a uma instância do servidor MySQL usar um certificado SSL com a extensão `extendedKeyUsage` (uma extensão X.509 v3), o uso de chave estendido deve incluir autenticação de cliente (`clientAuth`). Se o certificado SSL for especificado apenas para autenticação do servidor (`serverAuth`) e para outros fins que não sejam certificados de cliente, a verificação do certificado falha e a conexão do cliente com a instância do servidor MySQL falha. Não há extensão `extendedKeyUsage` em certificados SSL criados usando o comando **openssl** seguindo as instruções neste tópico. Se você usar seu próprio certificado de cliente criado de outra maneira, certifique-se de que qualquer extensão `extendedKeyUsage` inclua autenticação de cliente.

* Exemplo 1: Criação de arquivos SSL a partir da linha de comando no Unix
* Exemplo 2: Criação de arquivos SSL usando um script no Unix
* Exemplo 3: Criação de arquivos SSL no Windows

##### Exemplo 1: Criação de arquivos SSL a partir da linha de comando no Unix

O exemplo a seguir mostra um conjunto de comandos para criar arquivos de certificado e chave do servidor MySQL e do cliente. Você deve responder a várias solicitações pelos comandos **openssl**. Para gerar arquivos de teste, você pode pressionar Enter em todas as solicitações. Para gerar arquivos para uso em produção, você deve fornecer respostas não vazias.

```sql
# Create clean environment
rm -rf newcerts
mkdir newcerts && cd newcerts

# Create CA certificate
openssl genrsa 2048 > ca-key.pem
openssl req -new -x509 -nodes -days 3600 \
        -key ca-key.pem -out ca.pem

# Create server certificate, remove passphrase, and sign it
# server-cert.pem = public key, server-key.pem = private key
openssl req -newkey rsa:2048 -days 3600 \
        -nodes -keyout server-key.pem -out server-req.pem
openssl rsa -in server-key.pem -out server-key.pem
openssl x509 -req -in server-req.pem -days 3600 \
        -CA ca.pem -CAkey ca-key.pem -set_serial 01 -out server-cert.pem

# Create client certificate, remove passphrase, and sign it
# client-cert.pem = public key, client-key.pem = private key
openssl req -newkey rsa:2048 -days 3600 \
        -nodes -keyout client-key.pem -out client-req.pem
openssl rsa -in client-key.pem -out client-key.pem
openssl x509 -req -in client-req.pem -days 3600 \
        -CA ca.pem -CAkey ca-key.pem -set_serial 01 -out client-cert.pem
```

Após gerar os certificados, verifique-os:

```sql
openssl verify -CAfile ca.pem server-cert.pem client-cert.pem
```

Você deve ver uma resposta como esta:

```sql
server-cert.pem: OK
client-cert.pem: OK
```

Para ver o conteúdo de um certificado (por exemplo, para verificar a faixa de datas sobre a qual um certificado é válido), invoque o **openssl** da seguinte forma:

```sql
openssl x509 -text -in ca.pem
openssl x509 -text -in server-cert.pem
openssl x509 -text -in client-cert.pem
```

Agora você tem um conjunto de arquivos que podem ser usados da seguinte forma:

* `ca.pem`: Use isso para definir a variável de sistema `ssl_ca` no lado do servidor e a opção `--ssl-ca` no lado do cliente. (O certificado CA, se usado, deve ser o mesmo em ambos os lados.)

* `server-cert.pem`, `server-key.pem`: Use esses para definir as variáveis de sistema `ssl_cert` e `ssl_key` no lado do servidor.

* `client-cert.pem`, `client-key.pem`: Use esses como argumentos para as opções `--ssl-cert` e `--ssl-key` no lado do cliente.

Para obter instruções adicionais de uso, consulte a Seção 6.3.1, “Configurando o MySQL para usar conexões criptografadas”.

##### Exemplo 2: Criação de arquivos SSL usando um script no Unix

Aqui está um exemplo de script que mostra como configurar certificados SSL e arquivos de chave para o MySQL. Após executar o script, use os arquivos para conexões SSL conforme descrito na Seção 6.3.1, “Configurando o MySQL para usar conexões criptografadas”.

```sql
DIR=`pwd`/openssl
PRIV=$DIR/private

mkdir $DIR $PRIV $DIR/newcerts
cp /usr/share/ssl/openssl.cnf $DIR
replace ./demoCA $DIR -- $DIR/openssl.cnf

# Create necessary files: $database, $serial and $new_certs_dir
# directory (optional)

touch $DIR/index.txt
echo "01" > $DIR/serial

#
# Generation of Certificate Authority(CA)
#

openssl req -new -x509 -keyout $PRIV/cakey.pem -out $DIR/ca.pem \
    -days 3600 -config $DIR/openssl.cnf

# Sample output:
# Using configuration from /home/finley/openssl/openssl.cnf
# Generating a 1024 bit RSA private key
# ................++++++
# .........++++++
# writing new private key to '/home/finley/openssl/private/cakey.pem'
# Enter PEM pass phrase:
# Verifying password - Enter PEM pass phrase:
# -----
# You are about to be asked to enter information that will be
# incorporated into your certificate request.
# What you are about to enter is what is called a Distinguished Name
# or a DN.
# There are quite a few fields but you can leave some blank
# For some fields there will be a default value,
# If you enter '.', the field will be left blank.
# -----
# Country Name (2 letter code) [AU]:FI
# State or Province Name (full name) [Some-State]:.
# Locality Name (eg, city) []:
# Organization Name (eg, company) [Internet Widgits Pty Ltd]:MySQL AB
# Organizational Unit Name (eg, section) []:
# Common Name (eg, YOUR name) []:MySQL admin
# Email Address []:

#
# Create server request and key
#
openssl req -new -keyout $DIR/server-key.pem -out \
    $DIR/server-req.pem -days 3600 -config $DIR/openssl.cnf

# Sample output:
# Using configuration from /home/finley/openssl/openssl.cnf
# Generating a 1024 bit RSA private key
# ..++++++
# ..........++++++
# writing new private key to '/home/finley/openssl/server-key.pem'
# Enter PEM pass phrase:
# Verifying password - Enter PEM pass phrase:
# -----
# You are about to be asked to enter information that will be
# incorporated into your certificate request.
# What you are about to enter is what is called a Distinguished Name
# or a DN.
# There are quite a few fields but you can leave some blank
# For some fields there will be a default value,
# If you enter '.', the field will be left blank.
# -----
# Country Name (2 letter code) [AU]:FI
# State or Province Name (full name) [Some-State]:.
# Locality Name (eg, city) []:
# Organization Name (eg, company) [Internet Widgits Pty Ltd]:MySQL AB
# Organizational Unit Name (eg, section) []:
# Common Name (eg, YOUR name) []:MySQL server
# Email Address []:
#
# Please enter the following 'extra' attributes
# to be sent with your certificate request
# A challenge password []:
# An optional company name []:

#
# Remove the passphrase from the key
#
openssl rsa -in $DIR/server-key.pem -out $DIR/server-key.pem

#
# Sign server cert
#
openssl ca -cert $DIR/ca.pem -policy policy_anything \
    -out $DIR/server-cert.pem -config $DIR/openssl.cnf \
    -infiles $DIR/server-req.pem

# Sample output:
# Using configuration from /home/finley/openssl/openssl.cnf
# Enter PEM pass phrase:
# Check that the request matches the signature
# Signature ok
# The Subjects Distinguished Name is as follows
# countryName           :PRINTABLE:'FI'
# organizationName      :PRINTABLE:'MySQL AB'
# commonName            :PRINTABLE:'MySQL admin'
# Certificate is to be certified until Sep 13 14:22:46 2003 GMT
# (365 days)
# Sign the certificate? [y/n]:y
#
#
# 1 out of 1 certificate requests certified, commit? [y/n]y
# Write out database with 1 new entries
# Data Base Updated

#
# Create client request and key
#
openssl req -new -keyout $DIR/client-key.pem -out \
    $DIR/client-req.pem -days 3600 -config $DIR/openssl.cnf

# Sample output:
# Using configuration from /home/finley/openssl/openssl.cnf
# Generating a 1024 bit RSA private key
# .....................................++++++
# .............................................++++++
# writing new private key to '/home/finley/openssl/client-key.pem'
# Enter PEM pass phrase:
# Verifying password - Enter PEM pass phrase:
# -----
# You are about to be asked to enter information that will be
# incorporated into your certificate request.
# What you are about to enter is what is called a Distinguished Name
# or a DN.
# There are quite a few fields but you can leave some blank
# For some fields there will be a default value,
# If you enter '.', the field will be left blank.
# -----
# Country Name (2 letter code) [AU]:FI
# State or Province Name (full name) [Some-State]:.
# Locality Name (eg, city) []:
# Organization Name (eg, company) [Internet Widgits Pty Ltd]:MySQL AB
# Organizational Unit Name (eg, section) []:
# Common Name (eg, YOUR name) []:MySQL user
# Email Address []:
#
# Please enter the following 'extra' attributes
# to be sent with your certificate request
# A challenge password []:
# An optional company name []:

#
# Remove the passphrase from the key
#
openssl rsa -in $DIR/client-key.pem -out $DIR/client-key.pem

#
# Sign client cert
#

openssl ca -cert $DIR/ca.pem -policy policy_anything \
    -out $DIR/client-cert.pem -config $DIR/openssl.cnf \
    -infiles $DIR/client-req.pem

# Sample output:
# Using configuration from /home/finley/openssl/openssl.cnf
# Enter PEM pass phrase:
# Check that the request matches the signature
# Signature ok
# The Subjects Distinguished Name is as follows
# countryName           :PRINTABLE:'FI'
# organizationName      :PRINTABLE:'MySQL AB'
# commonName            :PRINTABLE:'MySQL user'
# Certificate is to be certified until Sep 13 16:45:17 2003 GMT
# (365 days)
# Sign the certificate? [y/n]:y
#
#
# 1 out of 1 certificate requests certified, commit? [y/n]y
# Write out database with 1 new entries
# Data Base Updated

#
# Create a my.cnf file that you can use to test the certificates
#

cat <<EOF > $DIR/my.cnf
[client]
ssl-ca=$DIR/ca.pem
ssl-cert=$DIR/client-cert.pem
ssl-key=$DIR/client-key.pem
[mysqld]
ssl_ca=$DIR/ca.pem
ssl_cert=$DIR/server-cert.pem
ssl_key=$DIR/server-key.pem
EOF
```

##### Exemplo 3: Criação de arquivos SSL no Windows

Baixe o OpenSSL para Windows se ele não estiver instalado no seu sistema. Uma visão geral dos pacotes disponíveis pode ser vista aqui:

```sql
http://www.slproweb.com/products/Win32OpenSSL.html
```

Escolha o pacote Win32 OpenSSL Light ou Win64 OpenSSL Light, dependendo da sua arquitetura (32 bits ou 64 bits). O local de instalação padrão é `C:\OpenSSL-Win32` ou `C:\OpenSSL-Win64`, dependendo do pacote que você baixou. As instruções seguintes assumem um local padrão de `C:\OpenSSL-Win32`. Modifique conforme necessário se você estiver usando o pacote de 64 bits.

Se uma mensagem ocorrer durante a configuração e indicar `'...critical component is missing: Microsoft Visual C++ 2008 Redistributables'`, cancele a configuração e faça o download de um dos seguintes pacotes, novamente, dependendo da sua arquitetura (32 bits ou 64 bits):

* Redistribuíveis Visual C++ 2008 (x86), disponíveis em:

  ```sql
  http://www.microsoft.com/downloads/details.aspx?familyid=9B2DA534-3E03-4391-8A4D-074B9F2BC1BF
  ```

* Redistribuíveis Visual C++ 2008 (x64), disponíveis em:

  ```sql
  http://www.microsoft.com/downloads/details.aspx?familyid=bd2a6171-e2d6-4230-b809-9a8d7548c1b6
  ```

Após instalar o pacote adicional, reinicie o procedimento de configuração do OpenSSL.

Durante a instalação, deixe o caminho de instalação padrão `C:\OpenSSL-Win32` como padrão e também deixe a opção padrão `'Copy OpenSSL DLL files to the Windows system directory'` selecionada.

Quando a instalação estiver concluída, adicione `C:\OpenSSL-Win32\bin` à variável do caminho do sistema do Windows do seu servidor (dependendo da versão do Windows, as instruções de configuração do caminho podem variar ligeiramente):

1. No desktop do Windows, clique com o botão direito no ícone Meu Computador e selecione Propriedades.

2. Selecione a guia Avançado do menu Propriedades do sistema que aparece e clique no botão Variáveis de ambiente.

3. Em Variáveis do sistema, selecione Caminho e, em seguida, clique no botão Editar. O diálogo Editar variável do sistema deve aparecer.

4. Adicione `';C:\OpenSSL-Win32\bin'` ao final (observe o ponto e vírgula).

5. Pressione OK 3 vezes.
6. Verifique se o OpenSSL foi corretamente integrado na variável Path abrindo uma nova console de comando (**Início>Executar>cmd.exe**) e verificando se o OpenSSL está disponível:

   ```sql
   Microsoft Windows [Version ...]
   Copyright (c) 2006 Microsoft Corporation. All rights reserved.

   C:\Windows\system32>cd \

   C:\>openssl
   OpenSSL> exit <<< If you see the OpenSSL prompt, installation was successful.

   C:\>
   ```

Depois que o OpenSSL tiver sido instalado, use instruções semelhantes às do Exemplo 1 (mostrado anteriormente nesta seção), com as seguintes alterações:

* Altere os seguintes comandos Unix:

  ```sql
  # Create clean environment
  rm -rf newcerts
  mkdir newcerts && cd newcerts
  ```

Em Windows, use esses comandos em vez disso:

  ```sql
  # Create clean environment
  md c:\newcerts
  cd c:\newcerts
  ```

* Quando um caractere `'\'` é exibido no final de uma linha de comando, este caractere `'\'` deve ser removido e as linhas de comando devem ser inseridas todas em uma única linha.

Após gerar os arquivos de certificado e chave, para usá-los em conexões SSL, consulte a Seção 6.3.1, “Configurando o MySQL para usar conexões criptografadas”.

#### 6.3.3.3 Criando Chaves RSA Usando o openssl

Esta seção descreve como usar o comando **openssl** para configurar os arquivos de chave RSA que permitem que o MySQL suporte a troca segura de senhas em conexões não criptografadas para contas autenticadas pelo plugin `sha256_password`.

Nota

Existem alternativas mais fáceis para gerar os arquivos necessários para o RSA do que o procedimento descrito aqui: deixe o servidor gerar automaticamente ou use o programa `mysql_ssl_rsa_setup`. Veja a Seção 6.3.3.1, “Criando Certificados e Chaves SSL e RSA usando MySQL”.

Para criar os arquivos de par de chave privada e pública RSA, execute esses comandos enquanto estiver logado na conta do sistema usada para executar o servidor MySQL, para que os arquivos pertençam a essa conta:

```sql
openssl genrsa -out private_key.pem 2048
openssl rsa -in private_key.pem -pubout -out public_key.pem
```

Esses comandos criam chaves de 2.048 bits. Para criar chaves mais fortes, use um valor maior.

Em seguida, defina os modos de acesso para os arquivos de chave. A chave privada deve ser legível apenas pelo servidor, enquanto a chave pública pode ser livremente distribuída para os usuários do cliente:

```sql
chmod 400 private_key.pem
chmod 444 public_key.pem
```

### 6.3.4 Capacidades dependentes da biblioteca SSL

O MySQL pode ser compilado usando OpenSSL ou yaSSL, ambos os quais permitem conexões criptografadas com base na API OpenSSL:

* As distribuições binárias da Edição Empresarial do MySQL são compiladas usando o OpenSSL. Não é possível usar o yaSSL com a Edição Empresarial do MySQL.

As distribuições binárias da Edição Comunitária do MySQL são compiladas usando o yaSSL.

As distribuições de código-fonte da Edição Comunitária do MySQL podem ser compiladas usando o OpenSSL ou o yaSSL (consulte a Seção 2.8.6, “Configurando o suporte à biblioteca SSL”).

Nota

É possível compilar o MySQL usando yaSSL como uma alternativa ao OpenSSL apenas antes do MySQL 5.7.28. A partir do MySQL 5.7.28, o suporte ao yaSSL é removido e todas as compilações do MySQL usam o OpenSSL.

OpenSSL e yaSSL oferecem a mesma funcionalidade básica, mas as distribuições do MySQL compiladas usando OpenSSL possuem recursos adicionais:

* O OpenSSL suporta os protocolos TLSv1, TLSv1.1 e TLSv1.2. O yaSSL suporta apenas os protocolos TLSv1 e TLSv1.1.

* O OpenSSL suporta uma sintaxe mais flexível para especificar cifras (para a variável de sistema `ssl_cipher` e a opção de cliente `--ssl-cipher`), e suporta uma gama mais ampla de cifras de criptografia para escolher. Veja Opções de comando para conexões criptografadas e Seção 6.3.2, “Protocolos e cifras de conexão criptografada TLS”.

* O OpenSSL suporta a variável de sistema `ssl_capath` e a opção de cliente `--ssl-capath`. As distribuições do MySQL compiladas usando o yaSSL não o fazem porque o yaSSL não procura em nenhum diretório e não segue uma árvore de certificados encadeada. O yaSSL exige que todos os componentes da árvore de certificados CA estejam contidos em uma única árvore de certificados CA e que cada certificado no arquivo tenha um valor de SubjectName único. Para contornar essa limitação, concatene os arquivos de certificado individuais que compõem a árvore de certificados em um novo arquivo e especifique esse arquivo como o valor da variável de sistema `ssl_ca` e da opção `--ssl-ca`.

* O OpenSSL suporta a capacidade de lista de revogação de certificados (para as variáveis de sistema `ssl_crl` e `ssl_crlpath` e as opções de cliente `--ssl-crl` e `--ssl-crlpath`). As distribuições compiladas usando o yaSSL não o fazem porque as listas de revogação não funcionam com o yaSSL. (O yaSSL aceita essas opções, mas ignora-as silenciosamente.)

* As contas que se autenticam usando o plugin `sha256_password` podem usar arquivos de chave RSA para troca segura de senhas em conexões não criptografadas. Veja a Seção 6.4.1.5, “Autenticação Conectada a SHA-256”.

* O servidor pode gerar automaticamente os arquivos de certificado e chave SSL e RSA ausentes no início. Veja a Seção 6.3.3.1, “Criando certificados e chaves SSL e RSA usando MySQL”.

* O OpenSSL suporta mais modos de criptografia para as funções `AES_ENCRYPT()` e `AES_DECRYPT()`. Veja a Seção 12.13, “Funções de Criptografia e Compressão”

Algumas variáveis de sistema e status relacionadas ao OpenSSL estão presentes apenas se o MySQL foi compilado usando OpenSSL:

* `auto_generate_certs`
* `sha256_password_auto_generate_rsa_keys`
* `sha256_password_private_key_path`
* `sha256_password_public_key_path`
* `Rsa_public_key`

Para determinar se um servidor foi compilado usando OpenSSL, teste a existência de alguma dessas variáveis. Por exemplo, esta declaração retorna uma linha se OpenSSL foi usado e um resultado vazio se o yaSSL foi usado:

```sql
SHOW STATUS LIKE 'Rsa_public_key';
```

### 6.3.5 Conectando-se ao MySQL remotamente a partir do Windows com SSH

Esta seção descreve como obter uma conexão criptografada a um servidor MySQL remoto com SSH. As informações foram fornecidas por David Carlson `<dcarlson@mplcomm.com>`.

1. Instale um cliente SSH em sua máquina Windows. Para uma comparação de clientes SSH, consulte <http://en.wikipedia.org/wiki/Comparison_of_SSH_clients>.

2. Inicie o cliente SSH do Windows. Defina `Host_Name = yourmysqlserver_URL_or_IP`. Defina `userid=your_userid` para fazer login no seu servidor. Este valor `userid` pode não ser o mesmo que o nome de usuário da sua conta MySQL.

3. Configure o encaminhamento de porta. Faça um encaminhamento remoto (Configure `local_port: 3306`, `remote_host: yourmysqlservername_or_ip`, `remote_port: 3306`) ou um encaminhamento local (Configure `port: 3306`, `host: localhost`, `remote port: 3306`).

4. Salve tudo; caso contrário, você terá que refazê-lo na próxima vez.
5. Faça login no seu servidor com a sessão SSH que você acabou de criar.
6. Na sua máquina com Windows, inicie algum aplicativo ODBC (como o Access).

7. Crie um novo arquivo no Windows e faça uma ligação ao MySQL usando o driver ODBC da mesma maneira que você normalmente faz, exceto que digite `localhost` para o servidor de host MySQL, não *`yourmysqlservername`*.

Neste ponto, você deve ter uma conexão ODBC para o MySQL, criptografada usando SSH.