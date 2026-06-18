#### 8.4.4.6 Usando o plugin de cartela de chaves baseado em arquivo keyring\_file

O plugin de chave de segurança `keyring_file` armazena os dados da chave de segurança em um arquivo localizado no host do servidor.

A partir do MySQL 8.0.34, este plugin é desatualizado e está sujeito à remoção em uma futura versão do MySQL. Em vez disso, considere usar o componente `component_keyring_file` para armazenar dados do chaveiro (consulte a Seção 8.4.4.4, “Usando o componente\_chaveiro\_file File-Based Keyring Component”).

Aviso

Para a gestão de chaves de criptografia, o plugin `keyring_file` não é destinado como uma solução de conformidade regulatória. Padrões de segurança como PCI, FIPS e outros exigem o uso de sistemas de gerenciamento de chaves para garantir, gerenciar e proteger as chaves de criptografia em cofres de chaves ou módulos de segurança de hardware (HSMs).

Para instalar o `keyring_file`, use as instruções gerais encontradas na Seção 8.4.4.3, “Instalação do Plugin do Carteira de Chaves”, juntamente com as informações de configuração específicas para o `keyring_file` encontradas aqui.

Para ser utilizado durante o processo de inicialização do servidor, o `keyring_file` deve ser carregado usando a opção `--early-plugin-load`. A variável de sistema `keyring_file_data` configura opcionalmente a localização do arquivo usado pelo plugin `keyring_file` para armazenamento de dados. O valor padrão é específico da plataforma. Para configurar a localização do arquivo explicitamente, defina o valor da variável durante a inicialização. Por exemplo, use essas linhas no arquivo do servidor `my.cnf`, ajustando o sufixo `.so` e a localização do arquivo para sua plataforma conforme necessário:

```
[mysqld]
early-plugin-load=keyring_file.so
keyring_file_data=/usr/local/mysql/mysql-keyring/keyring
```

Se `keyring_file_data` for definido para uma nova localização, o plugin de chave de segurança cria um novo arquivo vazio que não contém nenhuma chave; isso significa que as tabelas criptografadas existentes não poderão mais ser acessadas.

As operações de chaveiro são transacionais: o plugin `keyring_file` usa um arquivo de backup durante as operações de escrita para garantir que possa retornar ao arquivo original se uma operação falhar. O arquivo de backup tem o mesmo nome que o valor da variável de sistema `keyring_file_data`, com um sufixo de `.backup`.

Para obter informações adicionais sobre `keyring_file_data`, consulte a Seção 8.4.4.19, “Variáveis do Sistema de Carteira de Chaves”.

Para garantir que as chaves sejam descartadas apenas quando o arquivo de armazenamento do chaveiro correto existir, o `keyring_file` armazena um checksum SHA-256 do chaveiro no arquivo. Antes de atualizar o arquivo, o plugin verifica se ele contém o checksum esperado.

O plugin `keyring_file` suporta as funções que compõem a interface padrão do serviço de Keyring do MySQL. As operações de Keyring realizadas por essas funções são acessíveis em dois níveis:

- Interface SQL: Nas instruções SQL, chame as funções descritas na Seção 8.4.4.15, “Funções de Gerenciamento de Chave do Carteiro de Propósito Geral”.

- Interface C: No código em C, chame as funções do serviço de chave de registro descritas na Seção 7.6.9.2, “O Serviço de Chave de Registro”.

Exemplo (usando a interface SQL):

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Para obter informações sobre as características dos valores-chave permitidos por `keyring_file`, consulte a Seção 8.4.4.13, “Tipos e comprimentos de chave do carteiro suportado”.
