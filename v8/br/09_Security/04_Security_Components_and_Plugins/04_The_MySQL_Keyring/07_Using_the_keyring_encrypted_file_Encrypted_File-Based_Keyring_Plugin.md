#### 8.4.4.7 Usando o plugin de cartela de chaves criptografada com arquivo Encrypted File-Based Keyring

Nota

O plugin `keyring_encrypted_file` é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

O plugin de chave de acesso `keyring_encrypted_file` armazena os dados da chave de acesso em um arquivo criptografado e protegido por senha, localizado no host do servidor.

A partir do MySQL 8.0.34, este plugin é desatualizado e está sujeito à remoção em uma futura versão do MySQL. Em vez disso, considere usar o componente `component_encrypted_keyring_file` para armazenar dados do conjunto de chaves (consulte a Seção 8.4.4.5, “Usando o componente\_keyring\_encrypted\_file Component Encrypted File-Based Keyring”).

Aviso

Para a gestão de chaves de criptografia, o plugin `keyring_encrypted_file` não é destinado como uma solução de conformidade regulatória. Padrões de segurança como PCI, FIPS e outros exigem o uso de sistemas de gerenciamento de chaves para garantir, gerenciar e proteger as chaves de criptografia em cofres de chaves ou módulos de segurança de hardware (HSMs).

Para instalar o `keyring_encrypted_file`, use as instruções gerais encontradas na Seção 8.4.4.3, “Instalação do Plugin do Carteira de Chaves”, juntamente com as informações de configuração específicas para o `keyring_encrypted_file` encontradas aqui.

Para ser utilizado durante o processo de inicialização do servidor, `keyring_encrypted_file` deve ser carregado usando a opção `--early-plugin-load`. Para especificar a senha para criptografar o arquivo de dados do chaveiro, defina a variável de sistema `keyring_encrypted_file_password`. (A senha é obrigatória; se não for especificada durante a inicialização do servidor, a inicialização do `keyring_encrypted_file` falha.) A variável de sistema `keyring_encrypted_file_data` configura opcionalmente a localização do arquivo usado pelo plugin `keyring_encrypted_file` para armazenamento de dados. O valor padrão é específico da plataforma. Para configurar a localização do arquivo explicitamente, defina o valor da variável durante a inicialização. Por exemplo, use essas linhas no arquivo do servidor `my.cnf`, ajustando o sufixo `.so` e a localização do arquivo para sua plataforma conforme necessário e substituindo sua senha escolhida:

```
[mysqld]
early-plugin-load=keyring_encrypted_file.so
keyring_encrypted_file_data=/usr/local/mysql/mysql-keyring/keyring-encrypted
keyring_encrypted_file_password=password
```

Como o arquivo `my.cnf` armazena uma senha quando escrito como mostrado, ele deve ter um modo restrito e ser acessível apenas à conta usada para executar o servidor MySQL.

As operações de chaveiro são transacionais: o plugin `keyring_encrypted_file` usa um arquivo de backup durante as operações de escrita para garantir que possa retornar ao arquivo original se uma operação falhar. O arquivo de backup tem o mesmo nome que o valor da variável de sistema `keyring_encrypted_file_data`, com um sufixo de `.backup`.

Para obter informações adicionais sobre as variáveis do sistema usadas para configurar o plugin `keyring_encrypted_file`, consulte a Seção 8.4.4.19, “Variáveis do Sistema de Keychain”.

Para garantir que as chaves sejam descartadas apenas quando o arquivo de armazenamento correto do chaveiro existir, o `keyring_encrypted_file` armazena um checksum SHA-256 do chaveiro no arquivo. Antes de atualizar o arquivo, o plugin verifica se ele contém o checksum esperado. Além disso, o `keyring_encrypted_file` criptografa o conteúdo do arquivo usando AES antes de gravá-lo e descriptografa o conteúdo do arquivo após lê-lo.

O plugin `keyring_encrypted_file` suporta as funções que compõem a interface padrão do serviço de Keyring do MySQL. As operações de Keyring realizadas por essas funções são acessíveis em dois níveis:

- Interface SQL: Nas instruções SQL, chame as funções descritas na Seção 8.4.4.15, “Funções de Gerenciamento de Chave do Carteiro de Propósito Geral”.

- Interface C: No código em C, chame as funções do serviço de chave de registro descritas na Seção 7.6.9.2, “O Serviço de Chave de Registro”.

Exemplo (usando a interface SQL):

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Para obter informações sobre as características dos valores-chave permitidos por `keyring_encrypted_file`, consulte a Seção 8.4.4.13, “Tipos e comprimentos de chave do carteiro suportado”.
