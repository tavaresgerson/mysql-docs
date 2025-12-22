#### 7.1.9.4 Variáveis de sistema não persistentes e restritas a persistência

\[`SET PERSIST`] e \[`SET PERSIST_ONLY`] permitem que as variáveis globais do sistema sejam persistentes no arquivo de opção \[`mysqld-auto.cnf`] no diretório de dados (ver Seção 15.7.6.1, "Sintaxe SET para Atribuição de Variáveis"). No entanto, nem todas as variáveis do sistema podem ser persistentes ou podem ser persistentes apenas sob certas condições restritivas. Aqui estão algumas razões pelas quais uma variável do sistema pode ser não persistente ou persistente:

- As variáveis de sistema de sessão não podem ser persistentes. As variáveis de sessão não podem ser definidas na inicialização do servidor, portanto, não há razão para persisti-las.
- Uma variável de sistema global pode envolver dados sensíveis de tal forma que só deve ser configurável por um usuário com acesso direto ao servidor host.
- Uma variável de sistema global pode ser somente de leitura (isto é, definida apenas pelo servidor).
- Uma variável de sistema global pode ser destinada apenas a uso interno.

Variaveis de sistema não persistentes não podem ser persistentes sob nenhuma circunstância. Variaveis de sistema com restrição de persistência podem ser persistentes com `SET PERSIST_ONLY`, mas apenas por usuários para os quais as seguintes condições são satisfeitas:

- A variável do sistema `persist_only_admin_x509_subject` é definida como um valor de sujeito do certificado SSL X.509.
- O utilizador liga-se ao servidor através de uma ligação encriptada e fornece um certificado SSL com o valor Subject designado.
- O usuário tem privilégios suficientes para usar o `SET PERSIST_ONLY` (ver Seção 7.1.9.1, "Privilégios de variáveis do sistema").

Por exemplo, `protocol_version` é apenas lido e definido apenas pelo servidor, por isso não pode ser persistente sob quaisquer circunstâncias. Por outro lado, `bind_address` é persistente-restringido, por isso pode ser definido por usuários que satisfaçam as condições anteriores.

As seguintes variáveis do sistema não são persistentes. Esta lista pode mudar com o desenvolvimento contínuo.

```
audit_log_current_session
audit_log_filter_id
caching_sha2_password_digest_rounds
character_set_system
core_file
have_statement_timeout
have_symlink
hostname
innodb_version
keyring_hashicorp_auth_path
keyring_hashicorp_ca_path
keyring_hashicorp_caching
keyring_hashicorp_commit_auth_path
keyring_hashicorp_commit_ca_path
keyring_hashicorp_commit_caching
keyring_hashicorp_commit_role_id
keyring_hashicorp_commit_server_url
keyring_hashicorp_commit_store_path
keyring_hashicorp_role_id
keyring_hashicorp_secret_id
keyring_hashicorp_server_url
keyring_hashicorp_store_path
large_files_support
large_page_size
license
locked_in_memory
log_bin
log_bin_basename
log_bin_index
lower_case_file_system
ndb_version
ndb_version_string
persist_only_admin_x509_subject
persisted_globals_load
protocol_version
relay_log_basename
relay_log_index
server_uuid
skip_external_locking
system_time_zone
version_comment
version_compile_machine
version_compile_os
version_compile_zlib
```

As variáveis de sistema com restrição persistente são aquelas que são apenas de leitura e podem ser definidas na linha de comando ou em um arquivo de opção, além de `persist_only_admin_x509_subject` e `persisted_globals_load`. Esta lista pode mudar com o desenvolvimento em andamento.

```
audit_log_file
audit_log_format
auto_generate_certs
basedir
bind_address
caching_sha2_password_auto_generate_rsa_keys
caching_sha2_password_private_key_path
caching_sha2_password_public_key_path
character_sets_dir
datadir
ft_stopword_file
init_file
innodb_buffer_pool_load_at_startup
innodb_data_file_path
innodb_data_home_dir
innodb_dedicated_server
innodb_directories
innodb_force_load_corrupted
innodb_log_group_home_dir
innodb_page_size
innodb_read_only
innodb_temp_data_file_path
innodb_temp_tablespaces_dir
innodb_undo_directory
innodb_undo_tablespaces
lc_messages_dir
log_error
mecab_rc_file
named_pipe
pid_file
plugin_dir
port
relay_log
replica_load_tmpdir
secure_file_priv
sha256_password_auto_generate_rsa_keys
sha256_password_private_key_path
sha256_password_public_key_path
shared_memory
shared_memory_base_name
skip_networking
slave_load_tmpdir
socket
ssl_ca
ssl_capath
ssl_cert
ssl_crl
ssl_crlpath
ssl_key
tmpdir
version_tokens_session_number
```

Para configurar o servidor para habilitar variáveis de sistema com restrição de persistência, use o seguinte procedimento:

1. Verifique se o MySQL está configurado para suportar conexões criptografadas. Ver Seção 8.3.1, "Configurando o MySQL para usar conexões criptografadas".
2. Designe um certificado SSL X.509 Subject que signifique a capacidade de persistência de variáveis de sistema restritas a persistência, e gerar um certificado que tenha esse Subject.
3. Inicie o servidor com `persist_only_admin_x509_subject` definido para o valor Subject designado. Por exemplo, coloque estas linhas no seu arquivo `my.cnf` do servidor:

   ```
   [mysqld]
   persist_only_admin_x509_subject="subject-value"
   ```

   O formato do valor Subject é o mesmo utilizado para `CREATE USER ... REQUIRE SUBJECT`. Ver Secção 15.7.1.3, CREATE USER Statement.

   Você deve executar esta etapa diretamente no host do servidor MySQL porque o próprio `persist_only_admin_x509_subject` não pode ser persistido no tempo de execução.
4. Reinicie o servidor.
5. Distribuir o certificado SSL que tem o valor Subject designado para os utilizadores que devem ser autorizados a persistir em variáveis de sistema com restrição de persistência.

Suponha que `myclient-cert.pem` é o certificado SSL a ser usado por clientes que podem persistir variáveis de sistema com restrição de persistência. Mostrar o conteúdo do certificado usando o comando **openssl**:

```
$> openssl x509 -text -in myclient-cert.pem
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: 2 (0x2)
    Signature Algorithm: md5WithRSAEncryption
        Issuer: C=US, ST=IL, L=Chicago, O=MyOrg, OU=CA, CN=MyCN
        Validity
            Not Before: Oct 18 17:03:03 2018 GMT
            Not After : Oct 15 17:03:03 2028 GMT
        Subject: C=US, ST=IL, L=Chicago, O=MyOrg, OU=client, CN=MyCN
...
```

A saída **openssl** mostra que o valor do objeto do certificado é:

```
C=US, ST=IL, L=Chicago, O=MyOrg, OU=client, CN=MyCN
```

Para especificar o Subject para MySQL, use este formato:

```
/C=US/ST=IL/L=Chicago/O=MyOrg/OU=client/CN=MyCN
```

Configurar o arquivo `my.cnf` do servidor com o valor Subject:

```
[mysqld]
persist_only_admin_x509_subject="/C=US/ST=IL/L=Chicago/O=MyOrg/OU=client/CN=MyCN"
```

Reinicie o servidor para que a nova configuração entre em vigor.

Distribuir o certificado SSL (e quaisquer outros arquivos SSL associados) para os usuários apropriados. Tal usuário então se conecta ao servidor com o certificado e quaisquer outras opções SSL necessárias para estabelecer uma conexão criptografada.

Para usar o X.509, os clientes devem especificar as opções `--ssl-key` e `--ssl-cert` para se conectar. É recomendado, mas não necessário, que `--ssl-ca` também seja especificado para que o certificado público fornecido pelo servidor possa ser verificado. Por exemplo:

```
$> mysql --ssl-key=myclient-key.pem --ssl-cert=myclient-cert.pem --ssl-ca=mycacert.pem
```

Assumindo que o usuário tem privilégios suficientes para usar `SET PERSIST_ONLY`, as variáveis de sistema com restrição de persistência podem ser persistentes assim:

```
mysql> SET PERSIST_ONLY socket = '/tmp/mysql.sock';
Query OK, 0 rows affected (0.00 sec)
```

Se o servidor não estiver configurado para permitir a persistência de variáveis de sistema com restrição de persistência, ou se o utilizador não satisfazer as condições exigidas para essa capacidade, ocorre um erro:

```
mysql> SET PERSIST_ONLY socket = '/tmp/mysql.sock';
ERROR 1238 (HY000): Variable 'socket' is a non persistent read only variable
```
