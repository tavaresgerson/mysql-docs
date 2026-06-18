### 2.8.6 Configurando Suporte à Biblioteca SSL

Uma biblioteca SSL é necessária para o suporte de conexões criptografadas, entropia para a geração de números aleatórios e outras operações relacionadas à criptografia.

Se você compilar o MySQL a partir de uma distribuição de código-fonte, o **CMake** configura a distribuição para usar a biblioteca OpenSSL instalada por padrão.

Para compilar usando o OpenSSL, use este procedimento:

1. Certifique-se de que o OpenSSL 1.0.1 ou uma versão mais recente esteja instalado no seu sistema. Se a versão do OpenSSL instalada for mais antiga que 1.0.1, o **CMake** produz um erro durante a configuração do MySQL. Se for necessário obter o OpenSSL, visite <http://www.openssl.org>.

2. A opção `WITH_SSL` **CMake** determina qual biblioteca SSL deve ser usada para compilar o MySQL (consulte a Seção 2.8.7, “Opções de Configuração de Fonte do MySQL”). O padrão é `-DWITH_SSL=system`, que usa o OpenSSL. Para tornar isso explícito, especifique essa opção. Por exemplo:

   ```
   cmake . -DWITH_SSL=system
   ```

   Esse comando configura a distribuição para usar a biblioteca OpenSSL instalada. Alternativamente, para especificar explicitamente o nome do caminho da instalação do OpenSSL, use a seguinte sintaxe. Isso pode ser útil se você tiver várias versões do OpenSSL instaladas, para evitar que o **CMake** escolha a versão errada:

   ```
   cmake . -DWITH_SSL=path_name
   ```

   Pacotes alternativos do sistema OpenSSL são suportados a partir do MySQL 8.0.30 usando `WITH_SSL=openssl11` no EL7 ou `WITH_SSL=openssl3` no EL8. Os plugins de autenticação, como LDAP e Kerberos, são desativados, pois não suportam essas versões alternativas do OpenSSL.

3. Compile e instale a distribuição.

Para verificar se um servidor **mysqld** suporta conexões criptografadas, examine o valor da variável de sistema `have_ssl`:

```
mysql> SHOW VARIABLES LIKE 'have_ssl';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| have_ssl      | YES   |
+---------------+-------+
```

Se o valor for `YES`, o servidor suporta conexões criptografadas. Se o valor for `DISABLED`, o servidor é capaz de suportar conexões criptografadas, mas não foi iniciado com as opções apropriadas `--ssl-xxx` para permitir o uso de conexões criptografadas; consulte a Seção 8.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”.
