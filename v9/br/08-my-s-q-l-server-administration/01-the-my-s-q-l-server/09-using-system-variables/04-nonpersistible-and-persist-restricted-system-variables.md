#### 7.1.9.4 Variáveis de Sistema Não Persistidas e Restrições de Persistência

`SET PERSIST` e `SET PERSIST_ONLY` permitem que as variáveis de sistema globais sejam persistidas no arquivo de opção `mysqld-auto.cnf` no diretório de dados (veja a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”). No entanto, nem todas as variáveis de sistema podem ser persistidas ou podem ser persistidas apenas sob certas condições restritivas. Aqui estão algumas razões pelas quais uma variável de sistema pode ser não persistida ou ter restrições de persistência:

* As variáveis de sistema de sessão não podem ser persistidas. As variáveis de sessão não podem ser definidas no início do servidor, então não há motivo para persisti-las.

* Uma variável de sistema global pode envolver dados sensíveis, de modo que deve ser definida apenas por um usuário com acesso direto ao host do servidor.

* Uma variável de sistema global pode ser apenas de leitura (ou seja, definida apenas pelo servidor). Nesse caso, ela não pode ser definida por usuários, seja no início do servidor ou em tempo de execução.

* Uma variável de sistema global pode ser destinada apenas para uso interno.

Variáveis de sistema não persistidas não podem ser persistidas sob nenhuma circunstância. Variáveis de sistema com restrições de persistência podem ser persistidas com `SET PERSIST_ONLY`, mas apenas por usuários para os quais as seguintes condições sejam atendidas:

* A variável de sistema `persist_only_admin_x509_subject` é definida com um valor de Sujeito X.509 de certificado SSL.

* O usuário se conecta ao servidor usando uma conexão criptografada e fornece um certificado SSL com o valor do Sujeito designado.

* O usuário tem privilégios suficientes para usar `SET PERSIST_ONLY` (veja a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”).

Por exemplo, `protocol_version` é somente de leitura e definido apenas pelo servidor, portanto, não pode ser persistido sob nenhuma circunstância. Por outro lado, `bind_address` é restrito à persistência, portanto, pode ser definido por usuários que satisfaçam as condições anteriores.

As seguintes variáveis de sistema não são persistidas. Esta lista pode mudar com o desenvolvimento contínuo.

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

As variáveis de sistema restritas à persistência são aquelas que são somente de leitura e podem ser definidas na linha de comando ou em um arquivo de opção, exceto `persist_only_admin_x509_subject` e `persisted_globals_load`. Esta lista pode mudar com o desenvolvimento contínuo.

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

Para configurar o servidor para habilitar a persistência de variáveis de sistema restritas à persistência, use este procedimento:

1. Certifique-se de que o MySQL está configurado para suportar conexões criptografadas. Veja a Seção 8.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”.

2. Designe um valor de Sujeito X.509 de certificado SSL que indique a capacidade de persistir variáveis de sistema restritas à persistência, e gere um certificado que tenha esse Sujeito. Veja a Seção 8.3.3, “Criando Certificados SSL e RSA e Chaves”.

3. Inicie o servidor com `persist_only_admin_x509_subject` definido para o valor de Sujeito designado. Por exemplo, coloque essas linhas no seu arquivo `my.cnf` do servidor:

   ```
   [mysqld]
   persist_only_admin_x509_subject="subject-value"
   ```

   O formato do valor do Sujeito é o mesmo usado para `CREATE USER ... REQUIRE SUBJECT`. Veja a Seção 15.7.1.3, “Instrução CREATE USER”.

   Você deve realizar essa etapa diretamente no host do servidor MySQL porque `persist_only_admin_x509_subject` em si não pode ser persistido em tempo de execução.

4. Reinicie o servidor.
5. Distribua o certificado SSL que tem o valor de Sujeito designado para os usuários que devem ser autorizados a persistir variáveis de sistema restritas à persistência.

Suponha que `myclient-cert.pem` seja o certificado SSL a ser usado por clientes que podem persistir variáveis de sistema restritas. Exiba o conteúdo do certificado usando o comando **openssl**:

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

A saída do **openssl** mostra que o valor do Sujeito do certificado é:

```
C=US, ST=IL, L=Chicago, O=MyOrg, OU=client, CN=MyCN
```

Para especificar o Sujeito para o MySQL, use este formato:

```
/C=US/ST=IL/L=Chicago/O=MyOrg/OU=client/CN=MyCN
```

Configure o arquivo `my.cnf` do servidor com o valor do Sujeito:

```
[mysqld]
persist_only_admin_x509_subject="/C=US/ST=IL/L=Chicago/O=MyOrg/OU=client/CN=MyCN"
```

Reinicie o servidor para que a nova configuração entre em vigor.

Distribua o certificado SSL (e quaisquer outros arquivos SSL associados) aos usuários apropriados. Esse usuário, em seguida, se conecta ao servidor com o certificado e quaisquer outras opções SSL necessárias para estabelecer uma conexão criptografada.

Para usar o X.509, os clientes devem especificar as opções `--ssl-key` e `--ssl-cert` para se conectar. É recomendado, mas não obrigatório, que `--ssl-ca` também seja especificado para que o certificado público fornecido pelo servidor possa ser verificado. Por exemplo:

```
$> mysql --ssl-key=myclient-key.pem --ssl-cert=myclient-cert.pem --ssl-ca=mycacert.pem
```

Supondo que o usuário tenha privilégios suficientes para usar `SET PERSIST_ONLY`, as variáveis de sistema restritas podem ser persistidas da seguinte forma:

```
mysql> SET PERSIST_ONLY socket = '/tmp/mysql.sock';
Query OK, 0 rows affected (0.00 sec)
```

Se o servidor não estiver configurado para habilitar a persistência de variáveis de sistema restritas, ou o usuário não satisfaça as condições necessárias para essa capacidade, ocorrerá um erro:

```
mysql> SET PERSIST_ONLY socket = '/tmp/mysql.sock';
ERROR 1238 (HY000): Variable 'socket' is a non persistent read only variable
```