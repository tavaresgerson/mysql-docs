#### 6.4.4.3 Usando o Plugin Keyring Baseado em Arquivo Criptografado keyring_encrypted_file

Nota

O plugin `keyring_encrypted_file` é uma extensão incluída no MySQL Enterprise Edition, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

O plugin Keyring `keyring_encrypted_file` armazena os dados do Keyring em um File criptografado e protegido por senha local ao host do Server. Uma senha deve ser especificada para o File. Este plugin está disponível a partir do MySQL 5.7.21.

Aviso

Para gerenciamento de chaves de criptografia, o plugin `keyring_encrypted_file` não se destina a ser uma solução de conformidade regulatória. Padrões de segurança como PCI, FIPS e outros exigem o uso de sistemas de gerenciamento de chaves para proteger, gerenciar e resguardar chaves de criptografia em *key vaults* ou módulos de segurança de hardware (HSMs).

Para instalar o `keyring_encrypted_file`, use as instruções gerais encontradas em [Seção 6.4.4.1, “Instalação do Plugin Keyring”](keyring-plugin-installation.html "6.4.4.1 Keyring Plugin Installation"), juntamente com as informações de configuração específicas do `keyring_encrypted_file` encontradas aqui.

Para ser utilizável durante o processo de startup do Server, o `keyring_encrypted_file` deve ser carregado usando a opção [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load). Para especificar a senha para criptografar o File de Data do Keyring, defina a system variable [`keyring_encrypted_file_password`](keyring-system-variables.html#sysvar_keyring_encrypted_file_password). (A senha é obrigatória; se não for especificada no startup do Server, a inicialização do `keyring_encrypted_file` falhará.) A system variable [`keyring_encrypted_file_data`](keyring-system-variables.html#sysvar_keyring_encrypted_file_data) configura opcionalmente a localização do File usado pelo plugin `keyring_encrypted_file` para armazenamento de Data. O valor default depende da plataforma. Para configurar a localização do File explicitamente, defina o valor da variável no startup. Por exemplo, use estas linhas no File `my.cnf` do Server, ajustando o sufixo `.so` e a localização do File para sua plataforma conforme necessário e substituindo pela senha escolhida:

```sql
[mysqld]
early-plugin-load=keyring_encrypted_file.so
keyring_encrypted_file_data=/usr/local/mysql/mysql-keyring/keyring-encrypted
keyring_encrypted_file_password=password
```

Como o File `my.cnf` armazena uma senha conforme mostrado, ele deve ter um modo restritivo e ser acessível apenas à conta usada para executar o MySQL Server.

As operações de Keyring são transacionais: O plugin `keyring_encrypted_file` usa um File de Backup durante as operações de escrita para garantir que possa reverter para o File original se uma operação falhar. O File de Backup tem o mesmo nome do valor da system variable [`keyring_encrypted_file_data`](keyring-system-variables.html#sysvar_keyring_encrypted_file_data) com um sufixo de `.backup`.

Para informações adicionais sobre as system variables usadas para configurar o plugin `keyring_encrypted_file`, consulte [Seção 6.4.4.12, “System Variables do Keyring”](keyring-system-variables.html "6.4.4.12 Keyring System Variables").

Para garantir que as chaves sejam descarregadas (flushed) apenas quando o File de armazenamento do Keyring correto existir, o `keyring_encrypted_file` armazena um Checksum SHA-256 do Keyring no File. Antes de atualizar o File, o plugin verifica se ele contém o Checksum esperado. Além disso, o `keyring_encrypted_file` criptografa o conteúdo do File usando AES antes de escrever o File, e descriptografa o conteúdo do File após a leitura.

O plugin `keyring_encrypted_file` suporta as funções que compõem a interface de serviço padrão do MySQL Keyring. As operações de Keyring realizadas por essas funções são acessíveis em dois níveis:

* Interface SQL: Em comandos SQL, chame as funções descritas em [Seção 6.4.4.8, “Funções de Gerenciamento de Chaves Keyring de Propósito Geral”](keyring-functions-general-purpose.html "6.4.4.8 General-Purpose Keyring Key-Management Functions").

* Interface C: Em código C-language, chame as funções de serviço Keyring descritas em [Seção 5.5.6.2, “O Serviço Keyring”](keyring-service.html "5.5.6.2 The Keyring Service").

Exemplo (usando a interface SQL):

```sql
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Para obter informações sobre as características dos valores de chaves permitidas pelo `keyring_encrypted_file`, consulte [Seção 6.4.4.6, “Tipos e Comprimentos de Chaves Keyring Suportados”](keyring-key-types.html "6.4.4.6 Supported Keyring Key Types and Lengths").
