### 2.8.6 Configurando Suporte à Biblioteca SSL

Uma biblioteca SSL é necessária para o suporte a conexões criptografadas, entropia para a geração de números aleatórios e outras operações relacionadas à criptografia.

Se você compilar o MySQL a partir de uma distribuição de código-fonte, o `CMake` configura a distribuição para usar a biblioteca OpenSSL instalada por padrão.

Para compilar usando o OpenSSL, use este procedimento:

1. Certifique-se de que o OpenSSL 1.0.1 ou uma versão mais recente esteja instalado no seu sistema. Se a versão instalada do OpenSSL for mais antiga que 1.0.1, o `CMake` produz um erro durante a configuração do MySQL. Se for necessário obter o OpenSSL, visite <http://www.openssl.org>.
2. A opção `WITH_SSL` do `CMake` determina qual biblioteca SSL usar para compilar o MySQL (veja a Seção 2.8.7, “Opções de Configuração de Código-Fonte do MySQL”). O padrão é `-DWITH_SSL=system`, que usa o OpenSSL. Para tornar isso explícito, especifique essa opção. Por exemplo:

   ```
   cmake . -DWITH_SSL=system
   ```

   Esse comando configura a distribuição para usar a biblioteca OpenSSL instalada. Alternativamente, para especificar explicitamente o caminho do nome da instalação do OpenSSL, use a seguinte sintaxe. Isso pode ser útil se você tiver várias versões do OpenSSL instaladas, para evitar que o `CMake` escolha a versão errada:

   ```
   cmake . -DWITH_SSL=path_name
   ```

   Pacotes de sistema alternativos do OpenSSL são suportados usando `WITH_SSL=openssl11` no EL7 ou `WITH_SSL=openssl3` no EL8. Os plugins de autenticação, como LDAP e Kerberos, são desativados, pois não suportam essas versões alternativas do OpenSSL.
3. Compile e instale a distribuição.

Para verificar se um servidor `mysqld` suporta conexões criptografadas, examine o valor da variável de sistema `tls_version`:

```
mysql> SHOW VARIABLES LIKE 'tls_version';
+---------------+-----------------+
| Variable_name | Value           |
+---------------+-----------------+
| tls_version   | TLSv1.2,TLSv1.3 |
+---------------+-----------------+
```

Se o valor contiver versões TLS, então o servidor suporta conexões criptografadas, caso contrário, não.