\-- title: MySQL 8.4 Manual de Referência :: 2.8.6 Configurando a Biblioteca SSL Suporte url: <https://dev.mysql.com/doc/refman/8.4/en/source-ssl-library-configuration.html> ordem: 60 ---

### 2.8.6 Configuração de suporte de biblioteca SSL

É necessária uma biblioteca SSL para suporte de conexões criptografadas, entropia para geração de números aleatórios e outras operações relacionadas à criptografia.

Se você compilar o MySQL a partir de uma distribuição de origem, **CMake** configura a distribuição para usar a biblioteca OpenSSL instalada por padrão.

Para compilar usando OpenSSL, use este procedimento:

1. Certifique-se de que o OpenSSL 1.0.1 ou mais recente está instalado no seu sistema. Se a versão instalada do OpenSSL é mais antiga do que 1.0.1, **CMake** produz um erro no momento da configuração do MySQL. Se for necessário obter o OpenSSL, visite \[<http://www.openssl.org>]
2. A opção `WITH_SSL` **CMake** determina qual biblioteca SSL usar para compilar o MySQL (ver Seção 2.8.7, Opções de Configuração de Fonte do MySQL). O padrão é `-DWITH_SSL=system`, que usa o OpenSSL. Para tornar isso explícito, especifique essa opção. Por exemplo:

   ```
   cmake . -DWITH_SSL=system
   ```

   Esse comando configura a distribuição para usar a biblioteca OpenSSL instalada. Alternativamente, para especificar explicitamente o nome do caminho para a instalação do OpenSSL, use a seguinte sintaxe. Isso pode ser útil se você tiver várias versões do OpenSSL instaladas, para evitar que o **CMake** escolha a versão errada:

   ```
   cmake . -DWITH_SSL=path_name
   ```

   Pacotes de sistema OpenSSL alternativos são suportados usando `WITH_SSL=openssl11` no EL7 ou `WITH_SSL=openssl3` no EL8. Plugins de autenticação, como LDAP e Kerberos, estão desativados, pois não suportam essas versões alternativas do OpenSSL.
3. Compilar e instalar a distribuição.

Para verificar se um servidor **mysqld** suporta conexões criptografadas, examine o valor da variável do sistema `tls_version`:

```
mysql> SHOW VARIABLES LIKE 'tls_version';
+---------------+-----------------+
| Variable_name | Value           |
+---------------+-----------------+
| tls_version   | TLSv1.2,TLSv1.3 |
+---------------+-----------------+
```

Se o valor contém versões TLS, o servidor suporta conexões criptografadas, caso contrário,

Para obter informações adicionais, consulte a Secção 8.3.1, "Configuração do MySQL para utilização de conexões encriptadas".
