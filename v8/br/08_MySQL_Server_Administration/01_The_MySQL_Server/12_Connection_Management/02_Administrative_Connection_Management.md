#### 7.1.12.2 Gerenciamento de Conexão Administrativa

Como mencionado na Gestão de Volume de Conexão, para permitir a necessidade de realizar operações administrativas mesmo quando as conexões `max_connections` já estão estabelecidas nas interfaces usadas para conexões comuns, o servidor MySQL permite uma única conexão administrativa para usuários que possuem o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`).

Além disso, a partir do MySQL 8.0.14, o servidor permite a dedicação de uma porta TCP/IP para conexões administrativas, conforme descrito nas seções a seguir.

- Características da Interface Administrativa
- Suporte de interface administrativa para conexões criptografadas

##### Características da Interface Administrativa

A interface de conexão administrativa tem essas características:

- O servidor permite a interface apenas se a variável de sistema `admin_address` for definida na inicialização para indicar o endereço IP. Se `admin_address` não for definido, o servidor não mantém nenhuma interface administrativa.

- A variável de sistema `admin_port` especifica o número da porta TCP/IP da interface (padrão 33062).

- Não há limite no número de conexões administrativas, mas as conexões são permitidas apenas para usuários que tenham o privilégio `SERVICE_CONNECTION_ADMIN`.

- A variável de sistema `create_admin_listener_thread` permite que os administradores de banco de dados escolham, durante o início, se a interface administrativa tem seu próprio fio separado. O padrão é `OFF`; ou seja, o fio do administrador para conexões comuns na interface principal também lida com conexões para a interface administrativa.

Essas linhas no arquivo do servidor `my.cnf` habilitam a interface administrativa na interface de loopback e configuram-na para usar o número de porta 33044 (ou seja, uma porta diferente da padrão):

```
[mysqld]
admin_address=127.0.0.1
admin_port=33064
```

Os programas clientes do MySQL se conectam à interface principal ou administrativa especificando os parâmetros de conexão apropriados. Se o servidor em execução no host local estiver usando os números de porta TCP/IP padrão 3306 e 33062 para as interfaces principal e administrativa, esses comandos se conectam a essas interfaces:

```
mysql --protocol=TCP --port=3306
mysql --protocol=TCP --port=33062
```

##### Suporte de interface administrativa para conexões criptografadas

Antes do MySQL 8.0.21, a interface administrativa suporta conexões criptografadas usando a configuração de criptografia de conexão que se aplica à interface principal. A partir do MySQL 8.0.21, a interface administrativa tem seus próprios parâmetros de configuração para conexões criptografadas. Esses parâmetros correspondem aos parâmetros da interface principal, mas permitem a configuração independente de conexões criptografadas para a interface administrativa:

- As variáveis de sistema `admin_tls_xxx` e `admin_ssl_xxx` são semelhantes às variáveis de sistema `tls_xxx` e `ssl_xxx`, mas elas configuram o contexto TLS para a interface administrativa em vez da interface principal.

- A opção `--admin-ssl` é semelhante à opção `--ssl`, mas permite ou desabilita o suporte para conexões criptografadas na interface administrativa, em vez da interface principal.

  Como o suporte para conexões criptografadas está habilitado por padrão, normalmente não é necessário especificar `--admin-ssl`. A partir do MySQL 8.0.26, `--admin-ssl` está desatualizado e está sujeito à remoção em uma versão futura do MySQL.

Para obter informações gerais sobre a configuração do suporte à criptografia de conexão, consulte a Seção 8.3.1, “Configurando o MySQL para usar conexões criptografadas”, e a Seção 8.3.2, “Protocolos e cifra TLS de conexão criptografada”. Essa discussão é escrita para a interface de conexão principal, mas os nomes dos parâmetros são semelhantes para a interface de conexão administrativa. Use essa discussão juntamente com as observações a seguir, que fornecem informações específicas para a interface administrativa.

A configuração do TLS para a interface administrativa segue estas regras:

- Se `--admin-ssl` estiver habilitado (o padrão), a interface administrativa suporta conexões criptografadas. Para conexões na interface, o contexto TLS aplicável depende se algum parâmetro TLS administrativo não padrão estiver configurado:

  - Se todos os parâmetros administrativos do TLS tiverem seus valores padrão, a interface administrativa usará o mesmo contexto de TLS que a interface principal.

  - Se qualquer parâmetro administrativo do TLS tiver um valor não padrão, a interface administrativa usará o contexto do TLS definido por seus próprios parâmetros. (Esse é o caso se qualquer variável de sistema `admin_tls_xxx` ou `admin_ssl_xxx` estiver definida com um valor diferente do padrão.) Se um contexto de TLS válido não puder ser criado a partir desses parâmetros, a interface administrativa retorna ao contexto do TLS da interface principal.

- Se `--admin-ssl` estiver desativado (por exemplo, especificando `--admin-ssl=OFF`, as conexões criptografadas para a interface administrativa serão desativadas. Isso é verdadeiro mesmo que os parâmetros TLS administrativos tenham valores não padrão, pois a desativação de `--admin-ssl` tem precedência.

  Também é possível desativar as conexões criptografadas na interface administrativa sem especificar `--admin-ssl` na forma negada. Defina a variável de sistema `admin_tls_version` para o valor vazio para indicar que nenhuma versão de TLS é suportada. Por exemplo, essas linhas no arquivo do servidor `my.cnf` desativam as conexões criptografadas na interface administrativa:

  ```
  [mysqld]
  admin_tls_version=''
  ```

Exemplos:

- Essa configuração no arquivo do servidor `my.cnf` habilita a interface administrativa, mas não define nenhum dos parâmetros TLS específicos dessa interface:

  ```
  [mysqld]
  admin_address=127.0.0.1
  ```

  Como resultado, a interface administrativa suporta conexões criptografadas (porque a criptografia é suportada por padrão quando a interface administrativa é habilitada) e usa o contexto da interface principal TLS. Quando os clientes se conectam à interface administrativa, eles devem usar os mesmos arquivos de certificado e chave que para conexões comuns na interface principal. Por exemplo (insira o comando em uma única linha):

  ```
  mysql --protocol=TCP --port=33062
        --ssl-ca=ca.pem
        --ssl-cert=client-cert.pem
        --ssl-key=client-key.pem
  ```

- Essa configuração do servidor permite a interface administrativa e define os parâmetros do certificado TLS e do arquivo de chave específicos para essa interface:

  ```
  [mysqld]
  admin_address=127.0.0.1
  admin_ssl_ca=admin-ca.pem
  admin_ssl_cert=admin-server-cert.pem
  admin_ssl_key=admin-server-key.pem
  ```

  Como resultado, a interface administrativa suporta conexões criptografadas usando seu próprio contexto TLS. Quando os clientes se conectam à interface administrativa, eles devem usar arquivos de certificado e chave específicos para essa interface. Por exemplo (insira o comando em uma única linha):

  ```
  mysql --protocol=TCP --port=33062
        --ssl-ca=admin-ca.pem
        --ssl-cert=admin-client-cert.pem
        --ssl-key=admin-client-key.pem
  ```
