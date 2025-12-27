### 22.5.3 Usando Conexões Encriptadas com o Plugin X

Esta seção explica como configurar o Plugin X para usar conexões encriptadas. Para obter mais informações de fundo, consulte a Seção 8.3, “Usando Conexões Encriptadas”.

Para habilitar a configuração do suporte para conexões encriptadas, o Plugin X tem variáveis de sistema `mysqlx_ssl_xxx`, que podem ter valores diferentes dos variáveis de sistema `ssl_xxx` usadas com o MySQL Server. Por exemplo, o Plugin X pode ter arquivos de chave SSL, certificado e autoridade de certificado diferentes dos usados para o MySQL Server. Essas variáveis são descritas na Seção 22.5.6.2, “Opções do Plugin X e Variáveis de Sistema”. Da mesma forma, o Plugin X tem suas próprias variáveis de status `Mysqlx_ssl_xxx` que correspondem às variáveis de status `Ssl_xxx` do MySQL Server para conexões encriptadas. Veja a Seção 22.5.6.3, “Variáveis de Status do Plugin X”.

Na inicialização, o Plugin X determina seu contexto TLS para conexões encriptadas da seguinte forma:

* Se todas as variáveis de sistema `mysqlx_ssl_xxx` tiverem seus valores padrão, o Plugin X usa o mesmo contexto TLS da interface de conexão principal do MySQL Server, que é determinado pelos valores das variáveis de sistema `ssl_xxx`.

* Se qualquer variável `mysqlx_ssl_xxx` tiver um valor não padrão, o Plugin X usa o contexto TLS definido pelos valores de suas próprias variáveis de sistema. (Esse é o caso se qualquer variável de sistema `mysqlx_ssl_xxx` for definida para um valor diferente do padrão.)

Isso significa que, em um servidor com o Plugin X habilitado, você pode optar por ter conexões do Protocolo MySQL e do Protocolo X compartilhando a mesma configuração de encriptação, configurando apenas as variáveis `ssl_xxx`, ou ter configurações de encriptação separadas para conexões do Protocolo MySQL e do Protocolo X, configurando as variáveis `ssl_xxx` e `mysqlx_ssl_xxx` separadamente.

Para ter conexões com o Protocolo MySQL e o Protocolo X usando a mesma configuração de criptografia, defina apenas as variáveis de sistema `ssl_xxx` em `my.cnf`:

```
[mysqld]
ssl_ca=ca.pem
ssl_cert=server-cert.pem
ssl_key=server-key.pem
```

Para configurar a criptografia separadamente para conexões com o Protocolo MySQL e o Protocolo X, defina as variáveis de sistema `ssl_xxx` e `mysqlx_ssl_xxx` em `my.cnf`:

```
[mysqld]
ssl_ca=ca1.pem
ssl_cert=server-cert1.pem
ssl_key=server-key1.pem

mysqlx_ssl_ca=ca2.pem
mysqlx_ssl_cert=server-cert2.pem
mysqlx_ssl_key=server-key2.pem
```

Para obter informações gerais sobre a configuração do suporte à criptografia de conexões, consulte a Seção 8.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”. Essa discussão é escrita para o MySQL Server, mas os nomes dos parâmetros são semelhantes para o Plugin X. (Os nomes das variáveis de sistema `mysqlx_ssl_xxx` do Plugin X correspondem aos nomes das variáveis de sistema `ssl_xxx` do MySQL Server.)

A variável de sistema `tls_version` que determina as versões TLS permitidas para conexões com o Protocolo MySQL também se aplica às conexões com o Protocolo X. Portanto, as versões TLS permitidas para ambos os tipos de conexões são as mesmas.

A criptografia por conexão é opcional, mas um usuário específico pode ser obrigado a usar criptografia para conexões com o Protocolo MySQL e o Protocolo X, incluindo uma cláusula `REQUIRE` apropriada na instrução `CREATE USER` que cria o usuário. Para obter detalhes, consulte a Seção 15.7.1.3, “Instrução CREATE USER”. Alternativamente, para exigir que todos os usuários usem criptografia para conexões com o Protocolo X e o Protocolo MySQL, habilite a variável de sistema `require_secure_transport`. Para informações adicionais, consulte Configurando Conexões Criptografadas como Obrigatórias.