#### 6.4.4.2 Usando o Plugin de Keyring Baseado em Arquivo keyring_file

O plugin de Keyring `keyring_file` armazena dados do Keyring em um arquivo local ao host do servidor.

Aviso

Para gerenciamento de encryption key, o plugin `keyring_file` não se destina a ser uma solução de conformidade regulatória. Padrões de segurança como PCI, FIPS e outros exigem o uso de sistemas de gerenciamento de key para proteger, gerenciar e resguardar encryption keys em key vaults ou hardware security modules (HSMs).

Para instalar o `keyring_file`, use as instruções gerais encontradas na [Seção 6.4.4.1, “Instalação do Plugin de Keyring”](keyring-plugin-installation.html "6.4.4.1 Instalação do Plugin de Keyring"), juntamente com as informações de configuração específicas do `keyring_file` encontradas aqui.

Para ser utilizável durante o processo de inicialização do servidor (startup), o `keyring_file` deve ser carregado usando a opção [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load). A system variable [`keyring_file_data`](keyring-system-variables.html#sysvar_keyring_file_data) configura opcionalmente a localização do arquivo usado pelo plugin `keyring_file` para armazenamento de dados. O valor padrão é específico da plataforma. Para configurar explicitamente a localização do arquivo, defina o valor da variável no startup. Por exemplo, use estas linhas no arquivo `my.cnf` do servidor, ajustando o sufixo `.so` e a localização do arquivo conforme necessário para sua plataforma:

```sql
[mysqld]
early-plugin-load=keyring_file.so
keyring_file_data=/usr/local/mysql/mysql-keyring/keyring
```

Se [`keyring_file_data`](keyring-system-variables.html#sysvar_keyring_file_data) for definida para uma nova localização, o plugin de Keyring cria um novo arquivo vazio que não contém keys; isso significa que quaisquer tabelas criptografadas existentes não poderão mais ser acessadas.

As operações de Keyring são transacionais: O plugin `keyring_file` usa um arquivo de backup durante as operações de gravação (write operations) para garantir que ele possa reverter (roll back) para o arquivo original se uma operação falhar. O arquivo de backup tem o mesmo nome que o valor da system variable [`keyring_file_data`](keyring-system-variables.html#sysvar_keyring_file_data) com o sufixo `.backup`.

Para informações adicionais sobre [`keyring_file_data`](keyring-system-variables.html#sysvar_keyring_file_data), consulte [Seção 6.4.4.12, “System Variables do Keyring”](keyring-system-variables.html "6.4.4.12 Keyring System Variables").

A partir do MySQL 5.7.17, para garantir que as keys sejam descarregadas (flushed) somente quando o arquivo de armazenamento de Keyring correto existir, o `keyring_file` armazena um Checksum SHA-256 do Keyring no arquivo. Antes de atualizar o arquivo, o plugin verifica se ele contém o Checksum esperado.

O plugin `keyring_file` suporta as funções que compõem o standard MySQL Keyring service interface. As operações de Keyring realizadas por essas funções são acessíveis em dois níveis:

* SQL interface: Em SQL statements, chame as funções descritas na [Seção 6.4.4.8, “Funções de Gerenciamento de Key de Keyring de Propósito Geral”](keyring-functions-general-purpose.html "6.4.4.8 Funções de Gerenciamento de Key de Keyring de Propósito Geral").

* C interface: Em código de linguagem C, chame as funções de Keyring service descritas na [Seção 5.5.6.2, “O Keyring Service”](keyring-service.html "5.5.6.2 O Keyring Service").

Exemplo (usando a SQL interface):

```sql
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Para obter informações sobre as características dos key values permitidos pelo `keyring_file`, consulte [Seção 6.4.4.6, “Tipos e Comprimentos de Key de Keyring Suportados”](keyring-key-types.html "6.4.4.6 Tipos e Comprimentos de Key de Keyring Suportados").