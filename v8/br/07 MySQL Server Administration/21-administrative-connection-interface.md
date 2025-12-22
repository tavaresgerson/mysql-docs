#### 7.1.12.2 Gestão da ligação administrativa

Como mencionado no Gerenciamento de Volume de Conexão, para permitir a necessidade de realizar operações administrativas mesmo quando as conexões `max_connections` já estão estabelecidas nas interfaces usadas para conexões comuns, o servidor MySQL permite uma única conexão administrativa para usuários que têm o privilégio `CONNECTION_ADMIN` (ou o privilégio depreciado `SUPER`).

O servidor também permite dedicar uma porta TCP/IP para conexões administrativas, conforme descrito nas seções seguintes.

- Características da interface administrativa
- Suporte de interface administrativa para conexões criptografadas

##### Características da interface administrativa

A interface de ligação administrativa tem as seguintes características:

- O servidor ativa a interface somente se a variável do sistema `admin_address` for definida na inicialização para indicar o endereço IP para ela. Se `admin_address` não for definido, o servidor não mantém nenhuma interface administrativa.
- A variável de sistema `admin_port` especifica o número de porta TCP/IP da interface (padrão 33062).
- Não há limite no número de conexões administrativas, mas as conexões são permitidas apenas para usuários que têm o privilégio `SERVICE_CONNECTION_ADMIN`.
- A variável do sistema `create_admin_listener_thread` permite que os DBAs escolham no início se a interface administrativa tem seu próprio thread separado. O padrão é `OFF`; isto é, o thread de gerenciamento para conexões comuns na interface principal também lida com conexões para a interface administrativa.

Estas linhas no arquivo `my.cnf` do servidor permitem a interface administrativa na interface de loopback e configurá-la para usar o número de porta 33064 (ou seja, uma porta diferente da predefinida):

```
[mysqld]
admin_address=127.0.0.1
admin_port=33064
```

Se o servidor executado no host local estiver usando os números de porta TCP/IP padrão de 3306 e 33062 para as interfaces principal e administrativa, esses comandos se conectam a essas interfaces:

```
mysql --protocol=TCP --port=3306
mysql --protocol=TCP --port=33062
```

##### Suporte de interface administrativa para conexões criptografadas

A interface administrativa tem seus próprios parâmetros de configuração para conexões criptografadas. Estes correspondem aos parâmetros da interface principal, mas permitem a configuração independente de conexões criptografadas para a interface administrativa:

As variáveis de sistema `admin_tls_xxx` e `admin_ssl_xxx` são como as variáveis de sistema `tls_xxx` e `ssl_xxx`, mas configuram o contexto TLS para a interface administrativa em vez da interface principal.

Para informações gerais sobre como configurar o suporte de criptografia de conexão, consulte a Seção 8.3.1, "Configurando o MySQL para usar conexões criptografadas", e a Seção 8.3.2, "Protocolos e cifras TLS de conexão criptografadas". Essa discussão é escrita para a interface de conexão principal, mas os nomes de parâmetros são semelhantes para a interface de conexão administrativa. Use essa discussão junto com as seguintes observações, que fornecem informações específicas para a interface administrativa.

A configuração do TLS para a interface administrativa segue as seguintes regras:

- A interface administrativa suporta conexões criptografadas. Para conexões na interface, o contexto TLS aplicável depende de se algum parâmetro administrativo TLS não padrão é configurado:

  - Se todos os parâmetros administrativos do TLS tiverem seus valores padrão, a interface administrativa utilizará o mesmo contexto do TLS que a interface principal.
  - Se qualquer parâmetro administrativo do TLS tiver um valor não padrão, a interface administrativa usará o contexto do TLS definido por seus próprios parâmetros. (Este é o caso se qualquer variável do sistema `admin_tls_xxx` ou `admin_ssl_xxx` for definida para um valor diferente do padrão.) Se um contexto TLS válido não puder ser criado a partir desses parâmetros, a interface administrativa recairá no contexto TLS da interface principal.
- É possível desativar conexões criptografadas para a interface administrativa, definindo a variável de sistema `admin_tls_version` para o valor vazio para indicar que nenhuma versão do TLS é suportada. Por exemplo, estas linhas no arquivo do servidor `my.cnf` desativam conexões criptografadas na interface administrativa:

  ```
  [mysqld]
  admin_tls_version=''
  ```

Exemplos:

- Esta configuração no arquivo do servidor `my.cnf` permite a interface administrativa, mas não define nenhum dos parâmetros TLS específicos para essa interface:

  ```
  [mysqld]
  admin_address=127.0.0.1
  ```

  Como resultado, a interface administrativa suporta conexões criptografadas (porque a criptografia é suportada por padrão quando a interface administrativa é habilitada) e usa o contexto TLS da interface principal.

  ```
  mysql --protocol=TCP --port=33062
        --ssl-ca=ca.pem
        --ssl-cert=client-cert.pem
        --ssl-key=client-key.pem
  ```
- Esta configuração de servidor permite a interface administrativa e define os parâmetros do certificado TLS e dos ficheiros-chave específicos para essa interface:

  ```
  [mysqld]
  admin_address=127.0.0.1
  admin_ssl_ca=admin-ca.pem
  admin_ssl_cert=admin-server-cert.pem
  admin_ssl_key=admin-server-key.pem
  ```

  Como resultado, a interface administrativa suporta conexões criptografadas usando seu próprio contexto TLS. Quando os clientes se conectam à interface administrativa, eles devem usar arquivos de certificado e chave específicos para essa interface.

  ```
  mysql --protocol=TCP --port=33062
        --ssl-ca=admin-ca.pem
        --ssl-cert=admin-client-cert.pem
        --ssl-key=admin-client-key.pem
  ```
