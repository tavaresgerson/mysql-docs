#### 6.4.4.2 Usando o plugin de cartela de chaves baseado em arquivo keyring_file

O plugin `keyring_file` armazena os dados do bloco de chaves em um arquivo localizado no host do servidor.

Aviso

Para a gestão de chaves de criptografia, o plugin `keyring_file` não é destinado como uma solução de conformidade regulatória. Padrões de segurança como PCI, FIPS e outros exigem o uso de sistemas de gerenciamento de chaves para garantir, gerenciar e proteger as chaves de criptografia em cofres de chaves ou módulos de segurança de hardware (HSMs).

Para instalar o `keyring_file`, use as instruções gerais encontradas em Seção 6.4.4.1, “Instalação do Plugin do Keychain”, juntamente com as informações de configuração específicas para o `keyring_file` encontradas aqui.

Para ser utilizado durante o processo de inicialização do servidor, o `keyring_file` deve ser carregado usando a opção `--early-plugin-load` (opções do servidor.html#opção_mysqld_early-plugin-load). A variável de sistema `keyring_file_data` (variáveis de sistema de keyring) configura opcionalmente a localização do arquivo usado pelo plugin `keyring_file` para armazenamento de dados. O valor padrão é específico da plataforma. Para configurar a localização do arquivo explicitamente, defina o valor da variável durante a inicialização. Por exemplo, use essas linhas no arquivo `my.cnf` do servidor, ajustando o sufixo `.so` e a localização do arquivo para sua plataforma conforme necessário:

```sql
[mysqld]
early-plugin-load=keyring_file.so
keyring_file_data=/usr/local/mysql/mysql-keyring/keyring
```

Se `keyring_file_data` estiver configurado para uma nova localização, o plugin de chaveiro cria um novo arquivo vazio que não contém nenhuma chave; isso significa que as tabelas criptografadas existentes não poderão mais ser acessadas.

As operações do cartela de chaves são transacionais: o plugin `keyring_file` usa um arquivo de backup durante as operações de escrita para garantir que possa retornar ao arquivo original se uma operação falhar. O arquivo de backup tem o mesmo nome que o valor da variável de sistema `keyring_file_data` com um sufixo de `.backup`.

Para obter informações adicionais sobre `keyring_file_data`, consulte Seção 6.4.4.12, “Variáveis do Sistema de Carteira de Chaves”.

A partir do MySQL 5.7.17, para garantir que as chaves sejam descartadas apenas quando o arquivo de armazenamento do chaveiro correto existir, o `keyring_file` armazena um checksum SHA-256 do chaveiro no arquivo. Antes de atualizar o arquivo, o plugin verifica se ele contém o checksum esperado.

O plugin `keyring_file` suporta as funções que compõem a interface padrão do serviço de Keyring do MySQL. As operações de Keyring realizadas por essas funções são acessíveis em dois níveis:

- Interface SQL: Nas instruções SQL, consulte as funções descritas em Seção 6.4.4.8, “Funções de gerenciamento de chaves do carteiro de propósito geral”.

- Interface C: No código em C, chame as funções do serviço de chave de acesso descritas em Seção 5.5.6.2, “O Serviço de Chave de Acesso”.

Exemplo (usando a interface SQL):

```sql
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Para obter informações sobre as características dos valores-chave permitidos pelo `keyring_file`, consulte Seção 6.4.4.6, “Tipos e comprimentos de chave do keyring suportado”.
