### 19.4.1 Uso de conexões criptografadas com o plugin X

Esta seção explica como configurar o X Plugin para usar conexões criptografadas. Para obter mais informações de fundo, consulte a Seção 6.3, “Usando Conexões Criptografadas”.

Para habilitar a configuração do suporte para conexões criptografadas, o X Plugin possui variáveis de sistema `mysqlx_ssl_xxx`, que podem ter valores diferentes das variáveis de sistema `ssl_xxx` usadas com o MySQL Server. Por exemplo, o X Plugin pode ter arquivos de chave SSL, certificado e autoridade de certificado que diferem dos usados para o MySQL Server. Essas variáveis são descritas na Seção 19.4.2.2, “Opções e Variáveis de Sistema do X Plugin”. Da mesma forma, o X Plugin possui suas próprias variáveis de status `Mysqlx_ssl_xxx` que correspondem às variáveis de status `Ssl_xxx` de conexão criptografada do MySQL Server. Veja a Seção 19.4.2.3, “Variáveis de Status do X Plugin”.

Na inicialização, o X Plugin determina sua configuração para conexões criptografadas da seguinte forma:

- Se todas as variáveis de sistema `mysqlx_ssl_xxx` tiverem seus valores padrão, o X Plugin configura conexões criptografadas usando os valores das variáveis de sistema `ssl_xxx` do MySQL Server.

- Se qualquer variável `mysqlx_ssl_xxx` tiver um valor não padrão, o X Plugin configura conexões criptografadas usando os valores de suas próprias variáveis de sistema. (Esse é o caso se qualquer variável de sistema `mysqlx_ssl_xxx` estiver definida com um valor diferente do padrão.)

Isso significa que, em um servidor com o X Plugin habilitado, você pode optar por permitir que as conexões do Protocolo MySQL e do X compartilhem a mesma configuração de criptografia, definindo apenas as variáveis `ssl_xxx`, ou configurar configurações de criptografia separadas para as conexões do Protocolo MySQL e do X, configurando as variáveis `ssl_xxx` e `mysqlx_ssl_xxx` separadamente.

Para ter conexões com o MySQL Protocol e o X Protocol usando a mesma configuração de criptografia, defina apenas as variáveis de sistema `ssl_xxx` no `my.cnf`:

```sql
[mysqld]
ssl_ca=ca.pem
ssl_cert=server-cert.pem
ssl_key=server-key.pem
```

Para configurar a criptografia separadamente para conexões com o Protocolo MySQL e o Protocolo X, defina as variáveis de sistema `ssl_xxx` e `mysqlx_ssl_xxx` em `my.cnf`:

```sql
[mysqld]
ssl_ca=ca1.pem
ssl_cert=server-cert1.pem
ssl_key=server-key1.pem

mysqlx_ssl_ca=ca2.pem
mysqlx_ssl_cert=server-cert2.pem
mysqlx_ssl_key=server-key2.pem
```

Para obter informações gerais sobre a configuração do suporte à criptografia de conexão, consulte a Seção 6.3.1, “Configurando o MySQL para usar conexões criptografadas”. Essa discussão é escrita para o MySQL Server, mas os nomes dos parâmetros são semelhantes para o X Plugin. (Os nomes das variáveis de sistema `mysqlx_ssl_xxx` do X Plugin correspondem aos nomes das variáveis de sistema `ssl_xxx` do MySQL Server.)

A variável de sistema `tls_version`, que determina as versões TLS permitidas para conexões com o Protocolo MySQL, também se aplica às conexões com o Protocolo X. Portanto, as versões TLS permitidas para ambos os tipos de conexões são as mesmas.

A criptografia por conexão é opcional, mas um usuário específico pode ser obrigado a usar criptografia para conexões com o Protocolo X e o Protocolo MySQL, incluindo uma cláusula `REQUIRE` apropriada na instrução `CREATE USER` que cria o usuário. Para obter detalhes, consulte a Seção 13.7.1.2, “Instrução CREATE USER”. Alternativamente, para exigir que todos os usuários usem criptografia para conexões com o Protocolo X e o Protocolo MySQL, habilite a variável de sistema `require_secure_transport`. Para obter informações adicionais, consulte Configurando Conexões Criptografadas como Obrigatórias.
