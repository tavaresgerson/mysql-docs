### 6.3.1 Configurando o MySQL para usar conexões criptografadas

Vários parâmetros de configuração estão disponíveis para indicar se devem ser usadas conexões criptografadas e para especificar os arquivos de certificado e chave apropriados. Esta seção fornece orientações gerais sobre a configuração do servidor e dos clientes para conexões criptografadas:

- Configuração de inicialização do servidor para conexões criptografadas (usando-conexões-criptografadas.html#usando-configuracao-de-inicializacao-do-servidor-para-conexoes-criptografadas)
- Configuração no lado do cliente para conexões criptografadas
- Configurar conexões criptografadas como obrigatórias

As conexões criptografadas também podem ser usadas em outros contextos, conforme discutido nessas seções adicionais:

- Entre os servidores de origem e os servidores de replicação. Consulte Seção 16.3.8, “Configurando a replicação para usar conexões criptografadas”.

- Entre os servidores de replicação em grupo. Consulte Seção 17.6.2, “Suporte SSL (Secure Socket Layer) para replicação em grupo”.

- Por meio de programas cliente que são baseados na API C do MySQL. Veja Suporte para Conexões Encriptadas.

As instruções para criar os arquivos de certificado e chave necessários estão disponíveis em Seção 6.3.3, “Criando Certificados e Chaves SSL e RSA”.

#### Configuração de inicialização no lado do servidor para conexões criptografadas

No lado do servidor, a opção `--ssl` especifica que o servidor permite, mas não exige, conexões criptografadas. Esta opção está habilitada por padrão, portanto, não precisa ser especificada explicitamente.

Para exigir que os clientes se conectem usando conexões criptografadas, habilite a variável de sistema `require_secure_transport`. Veja Configurando Conexões Criptografadas como Obrigatórias.

Essas variáveis de sistema no lado do servidor especificam os arquivos de certificado e chave que o servidor usa ao permitir que os clientes estabeleçam conexões criptografadas:

- `ssl_ca`: O nome do caminho do arquivo de certificado da Autoridade de Certificação (CA). (`ssl_capath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de certificados da CA.)

- `ssl_cert`: O nome do caminho do arquivo de certificado da chave pública do servidor. Este certificado pode ser enviado ao cliente e autenticado contra o certificado da CA que ele possui.

- `ssl_key`: O nome do caminho do arquivo de chave privada do servidor.

Por exemplo, para habilitar o servidor para conexões criptografadas, inicie-o com essas linhas no arquivo `my.cnf`, alterando os nomes dos arquivos conforme necessário:

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

Cada certificado e sistema de variáveis de chave nomeiam um arquivo no formato PEM. Se você precisar criar os arquivos de certificado e chave necessários, consulte Seção 6.3.3, “Criando Certificados e Chaves SSL e RSA”. Servidores MySQL compilados com OpenSSL podem gerar automaticamente os arquivos de certificado e chave ausentes durante o inicialização. Consulte Seção 6.3.3.1, “Criando Certificados e Chaves SSL e RSA usando MySQL”. Alternativamente, se você tiver uma distribuição de fonte MySQL, pode testar sua configuração usando os arquivos de certificado e chave de demonstração no diretório `mysql-test/std_data`.

O servidor realiza a autodescoberta de arquivos de certificado e chave. Se não forem fornecidas opções explícitas de conexão criptografada, exceto `--ssl` (possível junto com `ssl_cipher`), para configurar conexões criptografadas, o servidor tenta habilitar o suporte à conexão criptografada automaticamente durante o início:

- Se o servidor descobrir arquivos de certificado e chave válidos com os nomes `ca.pem`, `server-cert.pem` e `server-key.pem` no diretório de dados, ele habilitará o suporte para conexões criptografadas pelos clientes. (Os arquivos não precisam ter sido gerados automaticamente; o importante é que tenham esses nomes e sejam válidos.)

- Se o servidor não encontrar arquivos de certificado e chave válidos no diretório de dados, ele continuará executando, mas sem suporte para conexões criptografadas.

Se o servidor habilitar automaticamente o suporte à conexão criptografada, ele escreve uma nota no log de erro. Se o servidor descobrir que o certificado CA é autoassinado, ele escreve uma mensagem de alerta no log de erro. (O certificado é autoassinado se for criado automaticamente pelo servidor ou manualmente usando **mysql\_ssl\_rsa\_setup**.)

O MySQL também fornece essas variáveis de sistema para o controle de conexão criptografada no lado do servidor:

- `ssl_cipher`: A lista de cifras permitidas para criptografia de conexão.

- `ssl_crl`: O nome do caminho do arquivo que contém as listas de revogação de certificados. (`ssl_crlpath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de listas de revogação de certificados.)

- `tls_version`: Quais protocolos de criptografia o servidor permite para conexões criptografadas; veja Seção 6.3.2, “Protocolos e cifra TLS de Conexão Encriptada”. Por exemplo, você pode configurar `tls_version` para impedir que os clientes usem protocolos menos seguros.

#### Configuração no lado do cliente para conexões criptografadas

Para uma lista completa das opções do cliente relacionadas à configuração de conexões criptografadas, consulte Opções de comando para conexões criptografadas.

Por padrão, os programas clientes do MySQL tentam estabelecer uma conexão criptografada se o servidor suportar conexões criptografadas, com controle adicional disponível através da opção `--ssl-mode`:

- Na ausência da opção `--ssl-mode`, os clientes tentam se conectar usando criptografia, revertendo para uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida. Esse é também o comportamento com a opção explícita `--ssl-mode=PREFERRED`.

- Com `--ssl-mode=REQUERIDO`, os clientes exigem uma conexão criptografada e falham se não puderem ser estabelecidas.

- Com `--ssl-mode=DESABILITADO`, os clientes usam uma conexão não criptografada.

- Com `--ssl-mode=VERIFY_CA` ou `--ssl-mode=VERIFY_IDENTITY`, os clientes exigem uma conexão criptografada e também realizam a verificação contra o certificado da CA do servidor e (com `VERIFY_IDENTITY`) contra o nome do host do servidor em seu certificado.

Importante

A configuração padrão, `--ssl-mode=PREFERRED`, produz uma conexão criptografada se as outras configurações padrão não forem alteradas. No entanto, para ajudar a prevenir ataques sofisticados de intermediário, é importante que o cliente verifique a identidade do servidor. As configurações `--ssl-mode=VERIFY_CA` e `--ssl-mode=VERIFY_IDENTITY` são uma escolha melhor do que a configuração padrão para ajudar a prevenir esse tipo de ataque. `VERIFY_CA` faz com que o cliente verifique se o certificado do servidor é válido. `VERIFY_IDENTITY` faz com que o cliente verifique se o certificado do servidor é válido e também faz com que o cliente verifique se o nome do host que está sendo usado pelo cliente corresponde à identidade no certificado do servidor. Para implementar uma dessas configurações, você deve primeiro garantir que o certificado CA do servidor esteja disponível de forma confiável para todos os clientes que o utilizam no seu ambiente, caso contrário, problemas de disponibilidade ocorrerão. Por essa razão, elas não são a configuração padrão.

As tentativas de estabelecer uma conexão não criptografada falham se a variável de sistema `require_secure_transport` estiver habilitada no lado do servidor para exigir conexões criptografadas. Veja Configurando Conexões Criptografadas como Obrigatórias.

As seguintes opções no lado do cliente identificam os arquivos de certificado e chave que os clientes usam ao estabelecer conexões criptografadas com o servidor. Eles são semelhantes às variáveis de sistema `ssl_ca`, `ssl_cert` e `ssl_key` usadas no lado do servidor, mas `--ssl-cert` e `--ssl-key` identificam a chave pública e privada do cliente:

- `--ssl-ca`: O nome do caminho do arquivo do certificado da Autoridade de Certificação (CA). Esta opção, se usada, deve especificar o mesmo certificado usado pelo servidor. (`--ssl-capath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de certificados da CA.)

- `--ssl-cert`: O nome do caminho do arquivo de certificado da chave pública do cliente.

- `--ssl-key`: O nome do caminho do arquivo de chave privada do cliente.

Para uma segurança adicional em relação à criptografia padrão, os clientes podem fornecer um certificado de CA que corresponda ao utilizado pelo servidor e habilitar a verificação da identidade do nome do host. Dessa forma, o servidor e o cliente confiam no mesmo certificado de CA e o cliente verifica se o host ao qual se conectou é o pretendido:

- Para especificar o certificado CA, use `--ssl-ca` (ou `--ssl-capath`), e especifique `--ssl-mode=VERIFY_CA`.

- Para habilitar a verificação de identidade do nome do host também, use `--ssl-mode=VERIFY_IDENTITY` em vez de `--ssl-mode=VERIFY_CA`.

Nota

A verificação de identidade do nome do host com `VERIFY_IDENTITY` não funciona com certificados autoassinados que são criados automaticamente pelo servidor ou manualmente usando **mysql\_ssl\_rsa\_setup** (consulte Seção 6.3.3.1, “Criando Certificados SSL e RSA e Chaves usando MySQL”). Esses certificados autoassinados não contêm o nome do servidor como o valor do Nome Comum.

Antes do MySQL 5.7.23, a verificação de identidade do nome do host também não funciona com certificados que especificam o Nome Comum usando asteriscos, porque esse nome é comparado literalmente ao nome do servidor.

O MySQL também oferece essas opções para controle de conexão criptografada no lado do cliente:

- `--ssl-cipher`: A lista de cifras permitidas para criptografia de conexão.

- `--ssl-crl`: O nome do caminho do arquivo que contém as listas de revogação de certificados. (`--ssl-crlpath` é semelhante, mas especifica o nome do caminho de um diretório de arquivos de listas de revogação de certificados.)

- `--tls-version`: Os protocolos de criptografia permitidos; consulte Seção 6.3.2, “Protocolos e cifra de conexão TLS criptografada”.

Dependendo dos requisitos de criptografia da conta MySQL usada por um cliente, o cliente pode ser obrigado a especificar certas opções para se conectar usando criptografia ao servidor MySQL.

Suponha que você queira se conectar usando uma conta que não tenha requisitos de criptografia especiais ou que tenha sido criada usando uma declaração `CREATE USER` que incluísse a cláusula `REQUIRE SSL`. Supondo que o servidor suporte conexões criptografadas, um cliente pode se conectar usando criptografia sem a opção `--ssl-mode` ou com a opção explícita `--ssl-mode=PREFERRED`:

```sql
mysql
```

Ou:

```sql
mysql --ssl-mode=PREFERRED
```

Para uma conta criada com uma cláusula `REQUER SSL`, a tentativa de conexão falha se uma conexão criptografada não puder ser estabelecida. Para uma conta sem requisitos especiais de criptografia, a tentativa retorna a uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida. Para evitar a falha e a interrupção se uma conexão criptografada não puder ser obtida, conecte-se da seguinte maneira:

```sql
mysql --ssl-mode=REQUIRED
```

Se a conta tiver requisitos de segurança mais rigorosos, outras opções devem ser especificadas para estabelecer uma conexão criptografada:

- Para contas criadas com uma cláusula `REQUIRE X509`, os clientes devem especificar pelo menos `--ssl-cert` e `--ssl-key`. Além disso, `--ssl-ca` (ou `--ssl-capath`) é recomendado para que o certificado público fornecido pelo servidor possa ser verificado. Por exemplo (insira o comando em uma única linha):

  ```sql
  mysql --ssl-ca=ca.pem
        --ssl-cert=client-cert.pem
        --ssl-key=client-key.pem
  ```

- Para contas criadas com uma cláusula `REQUER EMISSOR` ou `REQUER ASSUNTO`, os requisitos de criptografia são os mesmos que para `REQUER X509`, mas o certificado deve corresponder à emissão ou ao assunto, respectivamente, especificados na definição da conta.

Para obter informações adicionais sobre a cláusula `REQUIRE`, consulte Seção 13.7.1.2, "Instrução CREATE USER".

Os servidores MySQL podem gerar arquivos de certificado e chave do cliente que os clientes podem usar para se conectar às instâncias do servidor MySQL. Veja Seção 6.3.3, “Criando Certificados e Chaves SSL e RSA”.

Importante

Se um cliente que se conecta a uma instância do servidor MySQL usar um certificado SSL com a extensão `extendedKeyUsage` (uma extensão X.509 v3), o uso de chave estendido deve incluir a autenticação do cliente (`clientAuth`). Se o certificado SSL for especificado apenas para autenticação do servidor (`serverAuth`) e para outros fins que não sejam de certificado do cliente, a verificação do certificado falha e a conexão do cliente com a instância do servidor MySQL falha. Não há extensão `extendedKeyUsage` em certificados SSL gerados pelo MySQL Server (como descrito em Seção 6.3.3.1, “Criando Certificados SSL e RSA e Chaves Usando MySQL”), e certificados SSL criados usando o comando **openssl** seguindo as instruções em Seção 6.3.3.2, “Criando Certificados SSL e Chaves Usando openssl”. Se você usar seu próprio certificado do cliente criado de outra maneira, certifique-se de que qualquer extensão `extendedKeyUsage` inclua a autenticação do cliente.

Para impedir o uso de criptografia e ignorar outras opções `--ssl-xxx`, inicie o programa cliente com `--ssl-mode=DESABILITADO`:

```sql
mysql --ssl-mode=DISABLED
```

Para determinar se a conexão atual com o servidor usa criptografia, verifique o valor da variável de status `Ssl_cipher`. Se o valor estiver vazio, a conexão não está criptografada. Caso contrário, a conexão está criptografada e o valor indica o algoritmo de criptografia. Por exemplo:

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

#### Configurar conexões criptografadas como obrigatórias

Para algumas implantações do MySQL, pode ser não apenas desejável, mas também obrigatório, usar conexões criptografadas (por exemplo, para atender a requisitos regulatórios). Esta seção discute as configurações que permitem fazer isso. Esses níveis de controle estão disponíveis:

- Você pode configurar o servidor para exigir que os clientes se conectem usando conexões criptografadas.

- Você pode solicitar que os programas de clientes individuais exijam uma conexão criptografada, mesmo que o servidor permita, mas não exija criptografia.

- Você pode configurar contas individuais do MySQL para serem usadas apenas por meio de conexões criptografadas.

Para exigir que os clientes se conectem usando conexões criptografadas, habilite a variável de sistema `require_secure_transport`. Por exemplo, coloque essas linhas no arquivo `my.cnf` do servidor:

```sql
[mysqld]
require_secure_transport=ON
```

Com `require_secure_transport` habilitado, as conexões do cliente ao servidor exigem o uso de algum tipo de transporte seguro, e o servidor permite apenas conexões TCP/IP que utilizam SSL ou conexões que utilizam um arquivo de soquete (no Unix) ou memória compartilhada (no Windows). O servidor rejeita tentativas de conexão não seguras, que falham com um erro `ER_SECURE_TRANSPORT_REQUIRED`.

Para invocar um programa cliente de modo que ele exija uma conexão criptografada, independentemente de o servidor exigir criptografia ou não, use um valor da opção `--ssl-mode` de `REQUIRED`, `VERIFY_CA` ou `VERIFY_IDENTITY`. Por exemplo:

```sql
mysql --ssl-mode=REQUIRED
mysqldump --ssl-mode=VERIFY_CA
mysqladmin --ssl-mode=VERIFY_IDENTITY
```

Para configurar uma conta MySQL para ser usada apenas por meio de conexões criptografadas, inclua uma cláusula `REQUIRE` na instrução `CREATE USER` que cria a conta, especificando nas cláusulas as características de criptografia que você deseja. Por exemplo, para exigir uma conexão criptografada e o uso de um certificado X.509 válido, use `REQUIRE X509`:

```sql
CREATE USER 'jeffrey'@'localhost' REQUIRE X509;
```

Para obter informações adicionais sobre a cláusula `REQUIRE`, consulte Seção 13.7.1.2, "Instrução CREATE USER".

Para modificar contas existentes que não têm requisitos de criptografia, use a instrução `ALTER USER`.
