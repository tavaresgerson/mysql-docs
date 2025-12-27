#### 8.4.4.8 Uso do Plugin de Carteira de Chaves HashiCorp Vault

::: info Nota

O plugin `keyring_hashicorp` é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para obter mais informações sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

:::

O plugin `keyring_hashicorp` comunica-se com o HashiCorp Vault para armazenamento no back-end. O plugin suporta a autenticação do AppRole do HashiCorp Vault. Nenhuma informação de chave é armazenada permanentemente no armazenamento local do servidor MySQL. (Um cache de chaves de memória opcional pode ser usado como armazenamento intermediário.) A geração aleatória de chaves é realizada no lado do servidor MySQL, com as chaves subsequentemente armazenadas no HashiCorp Vault.

O plugin `keyring_hashicorp` suporta as funções que compõem a interface padrão do serviço de Carteira MySQL. As operações de carteira realizadas por essas funções são acessíveis em dois níveis:

* Interface SQL: Em instruções SQL, chame as funções descritas na Seção 8.4.4.12, “Funções de Gerenciamento de Chaves de Carteira de Uso Geral”.
* Interface C: Em código em C, chame as funções do serviço de carteira descritas na Seção 7.6.9.2, “O Serviço de Carteira”.

Exemplo (usando a interface SQL):

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Para obter informações sobre as características dos valores de chave permitidos pelo `keyring_hashicorp`, consulte a Seção 8.4.4.10, “Tipos e Comprimentos de Chaves de Carteira Suportáveis”.

Para instalar o `keyring_hashicorp`, use as instruções gerais encontradas na Seção 8.4.4.3, “Instalação do Plugin de Carteira”, juntamente com as informações de configuração específicas para o `keyring_hashicorp` encontradas aqui. A configuração específica do plugin inclui a preparação dos arquivos de certificado e chave necessários para conectar ao HashiCorp Vault, bem como a configuração do próprio HashiCorp Vault. As seções a seguir fornecem as instruções necessárias.

* Preparação de Certificado e Chave
* Configuração do HashiCorp Vault
* Configuração do `keyring_hashicorp`

O plugin `keyring_hashicorp` requer uma conexão segura com o servidor HashiCorp Vault, utilizando o protocolo HTTPS. Uma configuração típica inclui um conjunto de arquivos de certificado e chave:

* `company.crt`: Um certificado CA personalizado pertencente à organização. Este arquivo é usado tanto pelo servidor HashiCorp Vault quanto pelo plugin `keyring_hashicorp`.
* `vault.key`: A chave privada da instância do servidor HashiCorp Vault. Este arquivo é usado pelo servidor HashiCorp Vault.
* `vault.crt`: O certificado da instância do servidor HashiCorp Vault. Este arquivo deve ser assinado pelo certificado CA da organização.

As instruções a seguir descrevem como criar os arquivos de certificado e chave usando o OpenSSL. (Se você já tiver esses arquivos, prossiga com a Configuração do HashiCorp Vault.) As instruções mostradas se aplicam a plataformas Linux e podem exigir ajustes para outras plataformas.

Importante

Os certificados gerados por essas instruções são autoassinados, o que pode não ser muito seguro. Após ganhar experiência usando esses arquivos, considere obter material de certificado/chave de uma autoridade de certificação registrada.

1. Prepare as chaves da empresa e do servidor HashiCorp Vault.

   Use os seguintes comandos para gerar os arquivos de chave:

   ```
   openssl genrsa -aes256 -out company.key 4096
   openssl genrsa -aes256 -out vault.key 2048
   ```

   Os comandos geram arquivos contendo a chave privada da empresa (`company.key`) e a chave privada do servidor Vault (`vault.key`). As chaves são chaves RSA aleatórias de 4.096 e 2.048 bits, respectivamente.

   Cada comando solicita uma senha. Para fins de teste, a senha não é necessária. Para desabilitar, omita o argumento `-aes256`.

   Os arquivos de chave contêm informações sensíveis e devem ser armazenados em um local seguro. A senha (também sensível) será necessária mais tarde, então anote-a e armazene em um local seguro.

   (Opcional) Para verificar o conteúdo e a validade do arquivo de chave, use os seguintes comandos:

   ```
   openssl rsa -in company.key -check
   openssl rsa -in vault.key -check
   ```
2. Crie o certificado CA da empresa.

Use o seguinte comando para criar um arquivo de certificado CA da empresa chamado `company.crt`, que seja válido por 365 dias (insira o comando em uma única linha):

```
   openssl req -x509 -new -nodes -key company.key
     -sha256 -days 365 -out company.crt
   ```

Se você usou o argumento `-aes256` para realizar a criptografia da chave durante a geração da chave, você será solicitado a fornecer a senha da chave da empresa durante a criação do certificado CA. Você também será solicitado a fornecer informações sobre o detentor do certificado (ou seja, você ou sua empresa), conforme mostrado aqui:

```
   Country Name (2 letter code) [AU]:
   State or Province Name (full name) [Some-State]:
   Locality Name (eg, city) []:
   Organization Name (eg, company) [Internet Widgits Pty Ltd]:
   Organizational Unit Name (eg, section) []:
   Common Name (e.g. server FQDN or YOUR name) []:
   Email Address []:
   ```

Responda aos prompts com os valores apropriados.
3. Crie um pedido de assinatura de certificado.

Para criar um certificado de servidor HashiCorp Vault, um Pedido de Assinatura de Certificado (CSR) deve ser preparado para a chave do servidor recém-criada. Crie um arquivo de configuração chamado `request.conf`, contendo as seguintes linhas. Se o servidor HashiCorp Vault não estiver rodando no host local, substitua os valores de CN e IP apropriados e faça quaisquer outras alterações necessárias.

```
   [req]
   distinguished_name = vault
   x509_entensions = v3_req
   prompt = no

   [vault]
   C = US
   ST = CA
   L = RWC
   O = Company
   CN = 127.0.0.1

   [v3_req]
   subjectAltName = @alternatives
   authorityKeyIdentifier = keyid,issuer
   basicConstraints = CA:TRUE

   [alternatives]
   IP = 127.0.0.1
   ```

Use este comando para criar o pedido de assinatura:

```
   openssl req -new -key vault.key -config request.conf -out request.csr
   ```

O arquivo de saída (`request.csr`) é um arquivo intermediário que serve como entrada para a criação do certificado do servidor.
4. Crie o certificado de servidor HashiCorp Vault.

Assine as informações combinadas da chave do servidor HashiCorp Vault (`vault.key`) e do CSR (`request.csr`) com o certificado da empresa (`company.crt`) para criar o certificado de servidor HashiCorp Vault (`vault.crt`). Use o seguinte comando para fazer isso (insira o comando em uma única linha):

```
   openssl x509 -req -in request.csr
     -CA company.crt -CAkey company.key -CAcreateserial
     -out vault.crt -days 365 -sha256
   ```

Para tornar o certificado de servidor `vault.crt` útil, adicione o conteúdo do certificado da empresa `company.crt`. Isso é necessário para que o certificado da empresa seja entregue junto com o certificado do servidor em solicitações.

```
   cat company.crt >> vault.crt
   ```

Se você exibir o conteúdo do arquivo `vault.crt`, ele deve parecer assim:

```
   -----BEGIN CERTIFICATE-----
   ... content of HashiCorp Vault server certificate ...
   -----END CERTIFICATE-----
   -----BEGIN CERTIFICATE-----
   ... content of company certificate ...
   -----END CERTIFICATE-----
   ```

##### Configuração do HashiCorp Vault

As instruções a seguir descrevem como criar uma configuração do HashiCorp Vault que facilita o teste do plugin `keyring_hashicorp`.

Importante

Uma configuração de teste é semelhante a uma configuração de produção, mas o uso da HashiCorp Vault em produção implica em considerações de segurança adicionais, como o uso de certificados não autoassinados e o armazenamento do certificado da empresa no repositório de confiança do sistema. Você deve implementar quaisquer etapas de segurança adicionais necessárias para atender aos seus requisitos operacionais.

Essas instruções assumem a disponibilidade dos arquivos de certificado e chave criados na Preparação de Certificado e Chave. Consulte essa seção se você não tiver esses arquivos.

1. Faça o download do binário do HashiCorp Vault.

   Baixe o binário do HashiCorp Vault apropriado para sua plataforma em <https://www.vaultproject.io/downloads.html>.

   Extraia o conteúdo do arquivo para produzir o comando **vault** executável, que é usado para realizar operações do HashiCorp Vault. Se necessário, adicione o diretório onde você instalou o comando ao caminho do sistema.

   (Opcional) O HashiCorp Vault suporta opções de autocompletar que facilitam o uso. Para mais informações, consulte <https://learn.hashicorp.com/vault/getting-started/install#command-completion>.
2. Crie o arquivo de configuração do servidor do HashiCorp Vault.

   Prepare um arquivo de configuração chamado `config.hcl` com o seguinte conteúdo. Para os valores `tls_cert_file`, `tls_key_file` e `path`, substitua os nomes de caminho apropriados para o seu sistema.

   ```
   listener "tcp" {
     address="127.0.0.1:8200"
     tls_cert_file="/home/username/certificates/vault.crt"
     tls_key_file="/home/username/certificates/vault.key"
   }

   storage "file" {
     path = "/home/username/vaultstorage/storage"
   }

   ui = true
   ```
3. Inicie o servidor do HashiCorp Vault.

   Para iniciar o servidor Vault, use o seguinte comando, onde a opção `-config` especifica o caminho do arquivo de configuração recém-criado:

   ```
   vault server -config=config.hcl
   ```

   Durante essa etapa, você pode ser solicitado a fornecer uma senha para a chave privada do servidor Vault armazenada no arquivo `vault.key`.

   O servidor deve começar, exibindo algumas informações na console (IP, porta e assim por diante).

Para que você possa inserir os comandos restantes, coloque o comando **vault server** em segundo plano ou abra outro terminal antes de continuar.
4. Inicie o servidor HashiCorp Vault.

   ::: info Nota

   As operações descritas nesta etapa são necessárias apenas ao iniciar o Vault pela primeira vez, para obter a chave de destrancamento e o token de raiz. Reinicializações subsequentes da instância do Vault exigem apenas o desbloqueio usando a chave de destrancamento.

   :::

   Execute os seguintes comandos (assumindo a sintaxe do shell Bourne):

   ```
   export VAULT_SKIP_VERIFY=1
   vault operator init -n 1 -t 1
   ```

   O primeiro comando habilita o comando **vault** a ignorar temporariamente o fato de que nenhum certificado da empresa foi adicionado ao armazenamento de confiança do sistema. Isso compensa o fato de que nossa CA autoassinada não está adicionada a esse armazenamento. (Para uso em produção, um certificado como esse deve ser adicionado.)

   O segundo comando cria uma única chave de destrancamento com a exigência de que uma única chave de destrancamento esteja presente para o desbloqueio. (Para uso em produção, uma instância teria várias chaves de destrancamento, com até tantas chaves sendo necessárias para serem inseridas para desbloqueá-la. As chaves de destrancamento devem ser entregues aos guardiões das chaves dentro da empresa. O uso de uma única chave pode ser considerado um problema de segurança porque isso permite que o vault seja desbloqueado por um único guardião da chave.)

   O Vault deve responder com informações sobre a chave de destrancamento e o token de raiz, além de algum texto adicional (os valores reais da chave de destrancamento e do token de raiz diferem dos mostrados aqui):

   ```
   ...
   Unseal Key 1: I2xwcFQc892O0Nt2pBiRNlnkHzTUrWS+JybL39BjcOE=
   Initial Root Token: s.vTvXeo3tPEYehfcd9WH7oUKz
   ...
   ```

   Armazene a chave de destrancamento e o token de raiz em um local seguro.
5. Desbloqueie o servidor HashiCorp Vault.

   Use este comando para desbloquear o servidor Vault:

   ```
   vault operator unseal
   ```

   Quando solicitado para inserir a chave de destrancamento, use a chave obtida anteriormente durante a inicialização do Vault.

   O Vault deve produzir uma saída indicando que a configuração está completa e o vault está desbloqueado.
6. Faça login no servidor HashiCorp Vault e verifique seu status.

   Prepare as variáveis de ambiente necessárias para fazer login como root:

   ```
   vault login s.vTvXeo3tPEYehfcd9WH7oUKz
   ```

Para o valor do token nesse comando, substitua o conteúdo do token raiz obtido anteriormente durante a inicialização do Vault.

Verifique o status do servidor do Vault:

```
   vault status
   ```

A saída deve conter essas linhas (entre outras):

```
   ...
   Initialized     true
   Sealed          false
   ...
   ```
7. Configure a autenticação e o armazenamento do Vault HashiCorp.

   ::: info Nota

   As operações descritas nesta etapa são necessárias apenas na primeira vez que a instância do Vault for executada. Elas não precisam ser repetidas posteriormente.

   :::

   Ative o método de autenticação AppRole e verifique se ele está na lista de métodos de autenticação:

   ```
   vault auth enable approle
   vault auth list
   ```

   Ative o motor de armazenamento Vault KeyValue:

   ```
   vault secrets enable -version=1 kv
   ```

   Crie e configure um papel para uso com o plugin `keyring_hashicorp` (insira o comando em uma única linha):

   ```
   vault write auth/approle/role/mysql token_num_uses=0
     token_ttl=20m token_max_ttl=30m secret_id_num_uses=0
   ```
8. Adicione uma política de segurança AppRole.

   ::: info Nota

   As operações descritas nesta etapa são necessárias apenas na primeira vez que a instância do Vault for executada. Elas não precisam ser repetidas posteriormente.

   :::

   Prepare uma política que permita que o papel criado anteriormente acesse segredos apropriados. Crie um novo arquivo chamado `mysql.hcl` com o seguinte conteúdo:

   ```
   path "kv/mysql/*" {
     capabilities = ["create", "read", "update", "delete", "list"]
   }
   ```

   ::: info Nota

   `kv/mysql/` neste exemplo pode precisar de ajuste de acordo com as políticas de instalação local e os requisitos de segurança. Se assim for, faça o mesmo ajuste em qualquer outro lugar onde `kv/mysql/` aparece nessas instruções.

   :::

   Importe o arquivo de política para o servidor do Vault para criar uma política chamada `mysql-policy`, depois atribua a política ao novo papel:

   ```
   vault policy write mysql-policy mysql.hcl
   vault write auth/approle/role/mysql policies=mysql-policy
   ```

   Obtenha o ID do papel recém-criado e armazene-o em um local seguro:

   ```
   vault read auth/approle/role/mysql/role-id
   ```

   Gere um ID de segredo para o papel e armazene-o em um local seguro:

   ```
   vault write -f auth/approle/role/mysql/secret-id
   ```

Após a geração das credenciais de ID de papel de papel de papel e ID secreta do papel de papel, espera-se que elas permaneçam válidas indefinidamente. Não é necessário gerar novamente e o plugin `keyring_hashicorp` pode ser configurado com elas para uso contínuo. Para obter mais informações sobre a autenticação AuthRole, visite <https://www.vaultproject.io/docs/auth/approle.html>.

##### Configuração do `keyring_hashicorp`

O arquivo da biblioteca do plugin contém o plugin `keyring_hashicorp` e uma função carregável, `keyring_hashicorp_update_config()`. Quando o plugin inicializa e termina, ele carrega e descarrega automaticamente a função. Não é necessário carregar e descarregar a função manualmente.

O plugin `keyring_hashicorp` suporta os parâmetros de configuração mostrados na tabela a seguir. Para especificar esses parâmetros, atribua valores às variáveis de sistema correspondentes.

<table><col style="width: 35%"/><col style="width: 50%"/><col style="width: 15%"/><thead><tr> <th>Parâmetro de Configuração</th> <th>Variável de Sistema</th> <th>Obrigatório</th> </tr></thead><tbody><tr> <th>URL do Servidor HashiCorp</th> <td><code>keyring_hashicorp_server_url</code></td> <td>Não</td> </tr><tr> <th>ID do papel de papel de papel</th> <td><code>keyring_hashicorp_role_id</code></td> <td>Sim</td> </tr><tr> <th>ID secreto do papel de papel de papel</th> <td><code>keyring_hashicorp_secret_id</code></td> <td>Sim</td> </tr><tr> <th>Caminho de armazenamento</th> <td><code>keyring_hashicorp_store_path</code></td> <td>Sim</td> </tr><tr> <th>Caminho de autorização</th> <td><code>keyring_hashicorp_auth_path</code></td> <td>Não</td> </tr><tr> <th>Caminho do certificado CA</th> <td><code>keyring_hashicorp_ca_path</code></td> <td>Não</td> </tr><tr> <th>Controle de cache</th> <td><code>keyring_hashicorp_caching</code></td> <td>Não</td> </tr></tbody></table>

Para ser utilizável durante o processo de inicialização do servidor, o `keyring_hashicorp` deve ser carregado usando a opção `--early-plugin-load`. Como indicado na tabela anterior, várias variáveis de sistema relacionadas ao plugin são obrigatórias e também devem ser definidas. Por exemplo, use essas linhas no arquivo `my.cnf` do servidor, ajustando o sufixo `.so` e as localizações dos arquivos para sua plataforma, conforme necessário:

```
[mysqld]
early-plugin-load=keyring_hashicorp.so
keyring_hashicorp_role_id='ee3b495c-d0c9-11e9-8881-8444c71c32aa'
keyring_hashicorp_secret_id='0512af29-d0ca-11e9-95ee-0010e00dd718'
keyring_hashicorp_store_path='/v1/kv/mysql'
keyring_hashicorp_auth_path='/v1/auth/approle/login'
```

::: info Nota

De acordo com a documentação da [HashiCorp](https://www.vaultproject.io/api-docs), todas as rotas de API são prefixadas com uma versão do protocolo (que você pode ver no exemplo anterior como `/v1/` nos valores de `keyring_hashicorp_store_path` e `keyring_hashicorp_auth_path`). Se a HashiCorp desenvolver novas versões de protocolo, pode ser necessário alterar `/v1/` para algo diferente na sua configuração.

:::

O servidor MySQL autentica-se contra o HashiCorp Vault usando a autenticação AppRole. A autenticação bem-sucedida requer que dois segredos sejam fornecidos ao Vault, um ID de role e um ID de segredo, que são semelhantes em conceito ao nome de usuário e senha. Os valores de ID de role e ID de segredo a serem usados são aqueles obtidos durante o procedimento de configuração do HashiCorp Vault realizado anteriormente. Para especificar os dois IDs, atribua seus respectivos valores às variáveis de sistema `keyring_hashicorp_role_id` e `keyring_hashicorp_secret_id`. O procedimento de configuração também resulta em um caminho de armazenamento de `/v1/kv/mysql`, que é o valor a ser atribuído a `keyring_hashicorp_commit_store_path`.

No momento da inicialização do plugin, o `keyring_hashicorp` tenta se conectar ao servidor HashiCorp Vault usando os valores de configuração. Se a conexão for bem-sucedida, o plugin armazena os valores nas variáveis de sistema correspondentes que têm `_commit_` em seu nome. Por exemplo, após a conexão bem-sucedida, o plugin armazena os valores de `keyring_hashicorp_role_id` e `keyring_hashicorp_store_path` em `keyring_hashicorp_commit_role_id` e `keyring_hashicorp_commit_store_path`.

A reconfiguração em tempo de execução pode ser realizada com a assistência da função `keyring_hashicorp_update_config()`:

1. Use as instruções `SET` para atribuir os novos valores desejados às variáveis do sistema de configuração mostradas na tabela anterior. Essas atribuições, por si só, não têm efeito na operação em andamento do plugin.
2. Inicie `keyring_hashicorp_update_config()` para fazer o plugin se reconectar ao servidor HashiCorp Vault usando os novos valores das variáveis.
3. Se a conexão for bem-sucedida, o plugin armazenará os valores de configuração atualizados nas variáveis do sistema correspondentes que têm `_commit_` em seu nome.

Por exemplo, se você configurou o HashiCorp Vault para ouvir na porta 8201 em vez da porta padrão 8200, configure o `keyring_hashicorp` da seguinte maneira:

```
mysql> SET GLOBAL keyring_hashicorp_server_url = 'https://127.0.0.1:8201';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT keyring_hashicorp_update_config();
+--------------------------------------+
| keyring_hashicorp_update_config()    |
+--------------------------------------+
| Configuration update was successful. |
+--------------------------------------+
1 row in set (0.03 sec)
```

Se o plugin não conseguir se conectar ao HashiCorp Vault durante a inicialização ou reconfiguração e não houvesse uma conexão existente, as variáveis do sistema `_commit_` são definidas como `'Not committed'` para variáveis de string e `OFF` para variáveis de valor booleano. Se o plugin não conseguir se conectar, mas houvesse uma conexão existente, essa conexão permanece ativa e as variáveis `_commit_` refletem os valores usados para ela.

::: info Nota

Se você não definir as variáveis do sistema obrigatórias na inicialização do servidor ou se ocorrer algum outro erro de inicialização do plugin, a inicialização falhará. Nesse caso, você pode usar o procedimento de reconfiguração em tempo de execução para inicializar o plugin sem reiniciar o servidor.

:::

Para obter informações adicionais sobre as variáveis do sistema específicas do plugin `keyring_hashicorp` e as funções, consulte a Seção 8.4.4.16, “Variáveis do Sistema Keyring”, e a Seção 8.4.4.13, “Funções de Gerenciamento de Chaves do Keyring Específicas do Plugin”.