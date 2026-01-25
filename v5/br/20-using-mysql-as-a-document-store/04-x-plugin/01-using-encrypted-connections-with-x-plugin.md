### 19.4.1 Usando Conexões Criptografadas com o X Plugin

Esta seção explica como configurar o X Plugin para usar conexões criptografadas. Para mais informações conceituais, consulte a Seção 6.3, “Usando Conexões Criptografadas”.

Para habilitar a configuração de suporte a conexões criptografadas, o X Plugin possui as system variables `mysqlx_ssl_xxx`, que podem ter valores diferentes das system variables `ssl_xxx` usadas com o MySQL Server. Por exemplo, o X Plugin pode ter arquivos SSL de key, certificate e certificate authority que diferem daqueles usados para o MySQL Server. Essas variables são descritas na Seção 19.4.2.2, “Opções e System Variables do X Plugin”. Da mesma forma, o X Plugin tem suas próprias status variables `Mysqlx_ssl_xxx` que correspondem às status variables `Ssl_xxx` de conexão criptografada do MySQL Server. Consulte a Seção 19.4.2.3, “Status Variables do X Plugin”.

Na inicialização, o X Plugin determina sua configuração para conexões criptografadas da seguinte forma:

* Se todas as system variables `mysqlx_ssl_xxx` tiverem seus valores default, o X Plugin configura as conexões criptografadas usando os valores das system variables `ssl_xxx` do MySQL Server.

* Se qualquer variable `mysqlx_ssl_xxx` tiver um valor não-default, o X Plugin configura as conexões criptografadas usando os valores de suas próprias system variables. (Este é o caso se qualquer system variable `mysqlx_ssl_xxx` for definida com um valor diferente do seu default.)

Isso significa que, em um server com o X Plugin habilitado, você pode optar por fazer com que as conexões do MySQL Protocol e X Protocol compartilhem a mesma configuração de encryption, definindo apenas as variables `ssl_xxx`, ou ter configurações de encryption separadas para conexões MySQL Protocol e X Protocol, configurando as variables `ssl_xxx` e `mysqlx_ssl_xxx` separadamente.

Para que as conexões MySQL Protocol e X Protocol usem a mesma configuração de encryption, defina apenas as system variables `ssl_xxx` em `my.cnf`:

```sql
[mysqld]
ssl_ca=ca.pem
ssl_cert=server-cert.pem
ssl_key=server-key.pem
```

Para configurar a encryption separadamente para conexões MySQL Protocol e X Protocol, defina as system variables `ssl_xxx` e `mysqlx_ssl_xxx` em `my.cnf`:

```sql
[mysqld]
ssl_ca=ca1.pem
ssl_cert=server-cert1.pem
ssl_key=server-key1.pem

mysqlx_ssl_ca=ca2.pem
mysqlx_ssl_cert=server-cert2.pem
mysqlx_ssl_key=server-key2.pem
```

Para informações gerais sobre como configurar o suporte à encryption de conexão, consulte a Seção 6.3.1, “Configuring MySQL to Use Encrypted Connections”. Essa discussão é escrita para o MySQL Server, mas os nomes dos parâmetros são semelhantes para o X Plugin. (Os nomes das system variables `mysqlx_ssl_xxx` do X Plugin correspondem aos nomes das system variables `ssl_xxx` do MySQL Server.)

A system variable `tls_version` que determina as versões TLS permitidas para conexões MySQL Protocol também se aplica às conexões X Protocol. As versões TLS permitidas para ambos os tipos de conexões são, portanto, as mesmas.

A Encryption por conexão é opcional, mas um user específico pode ser obrigado a usar encryption para conexões X Protocol e MySQL Protocol, incluindo uma cláusula `REQUIRE` apropriada na instrução `CREATE USER` que cria o user. Para detalhes, consulte a Seção 13.7.1.2, “CREATE USER Statement”. Alternativamente, para exigir que todos os users utilizem encryption para conexões X Protocol e MySQL Protocol, habilite a system variable `require_secure_transport`. Para informações adicionais, consulte Configuring Encrypted Connections as Mandatory.