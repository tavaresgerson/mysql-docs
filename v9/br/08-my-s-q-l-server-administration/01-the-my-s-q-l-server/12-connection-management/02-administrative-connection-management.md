#### 7.1.12.2 Gerenciamento de Conexão Administrativa

Como mencionado no Gerenciamento de Volume de Conexão, para permitir a necessidade de realizar operações administrativas mesmo quando já estão estabelecidas `max_connections` conexões nas interfaces usadas para conexões comuns, o servidor MySQL permite uma única conexão administrativa para usuários que têm o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`).

O servidor também permite dedicar uma porta TCP/IP para conexões administrativas, conforme descrito nas seções seguintes.

* Características da Interface Administrativa
* Suporte da Interface Administrativa para Conexões Encriptadas

##### Características da Interface Administrativa

A interface de conexão administrativa tem essas características:

* O servidor habilita a interface apenas se a variável de sistema `admin_address` for definida no início para indicar o endereço IP para ela. Se `admin_address` não for definido, o servidor não mantém nenhuma interface administrativa.

* A variável de sistema `admin_port` especifica o número da porta TCP/IP da interface (padrão 33062).

* Não há limite no número de conexões administrativas, mas as conexões são permitidas apenas para usuários que têm o privilégio `SERVICE_CONNECTION_ADMIN`.

* A variável de sistema `create_admin_listener_thread` permite que os DBA escolham no início se a interface administrativa tem seu próprio fio separado. O padrão é `OFF`; ou seja, o fio do gerente para conexões comuns na interface principal também lida com as conexões da interface administrativa.

Essas linhas no arquivo `my.cnf` do servidor habilitam a interface administrativa na interface loopback e a configuram para usar o número de porta 33064 (ou seja, uma porta diferente do padrão):

```
[mysqld]
admin_address=127.0.0.1
admin_port=33064
```

Os programas clientes do MySQL se conectam à interface principal ou administrativa especificando os parâmetros de conexão apropriados. Se o servidor em execução no host local estiver usando os números de porta TCP/IP padrão de 3306 e 33062 para as interfaces principal e administrativa, esses comandos se conectam a essas interfaces:

```
mysql --protocol=TCP --port=3306
mysql --protocol=TCP --port=33062
```

##### Suporte à Interface Administrativa para Conexões Encriptadas

A interface administrativa tem seus próprios parâmetros de configuração para conexões encriptadas. Esses parâmetros correspondem aos parâmetros da interface principal, mas permitem a configuração independente de conexões encriptadas para a interface administrativa:

As variáveis de sistema `admin_tls_xxx` e `admin_ssl_xxx` são semelhantes às variáveis de sistema `tls_xxx` e `ssl_xxx`, mas elas configuram o contexto TLS para a interface administrativa em vez da interface principal.

Para informações gerais sobre a configuração do suporte à encriptação de conexão, consulte a Seção 8.3.1, “Configurando o MySQL para Usar Conexões Encriptadas”, e a Seção 8.3.2, “Protocolos e Cifras TLS de Conexão Encriptada”. Essa discussão é escrita para a interface de conexão principal, mas os nomes dos parâmetros são semelhantes para a interface de conexão administrativa. Use essa discussão junto com as observações a seguir, que fornecem informações específicas para a interface administrativa.

A configuração TLS para a interface administrativa segue estas regras:

* A interface administrativa suporta conexões encriptadas. Para conexões na interface, o contexto TLS aplicável depende se algum parâmetro TLS administrativo não padrão é configurado:

  + Se todos os parâmetros TLS administrativos tiverem seus valores padrão, a interface administrativa usa o mesmo contexto TLS que a interface principal.

+ Se qualquer parâmetro administrativo do TLS tiver um valor não padrão, a interface administrativa usará o contexto TLS definido por seus próprios parâmetros. (Esse é o caso se qualquer variável de sistema `admin_tls_xxx` ou `admin_ssl_xxx` estiver definida com um valor diferente do padrão.) Se um contexto TLS válido não puder ser criado a partir desses parâmetros, a interface administrativa retorna ao contexto TLS da interface principal.

* É possível desativar as conexões criptografadas para a interface administrativa configurando a variável de sistema `admin_tls_version` para o valor vazio para indicar que nenhuma versão do TLS é suportada. Por exemplo, essas linhas no arquivo `my.cnf` do servidor desativam as conexões criptografadas na interface administrativa:

  ```
  [mysqld]
  admin_tls_version=''
  ```

Exemplos:

* Esta configuração no arquivo `my.cnf` do servidor habilita a interface administrativa, mas não define nenhum dos parâmetros TLS específicos dessa interface:

  ```
  [mysqld]
  admin_address=127.0.0.1
  ```

Como resultado, a interface administrativa suporta conexões criptografadas (porque a criptografia é suportada por padrão quando a interface administrativa é habilitada) e usa o contexto TLS da interface principal. Quando os clientes se conectam à interface administrativa, eles devem usar os mesmos arquivos de certificado e chave que para conexões comuns na interface principal. Por exemplo (insira o comando em uma única linha):

  ```
  mysql --protocol=TCP --port=33062
        --ssl-ca=ca.pem
        --ssl-cert=client-cert.pem
        --ssl-key=client-key.pem
  ```

* Esta configuração do servidor habilita a interface administrativa e define os parâmetros do certificado e arquivo de chave TLS específicos dessa interface:

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