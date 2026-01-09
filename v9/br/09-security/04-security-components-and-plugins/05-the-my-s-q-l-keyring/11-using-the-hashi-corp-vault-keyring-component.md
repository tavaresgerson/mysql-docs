#### 8.4.5.11 Usando o Componente HashiCorp Vault Keyring

Nota

O componente `component_keyring_hashicorp` é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para obter mais informações sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

O componente `component_keyring_hashicorp` comunica-se com o HashiCorp Vault para armazenamento no back-end e suporta a autenticação do HashiCorp Vault AppRole. Nenhuma informação de chave é armazenada permanentemente no armazenamento local do servidor MySQL. (Um cache de chaves de memória opcional pode ser usado como armazenamento intermediário.) A geração aleatória de chaves é realizada no lado do servidor MySQL, com as chaves subsequentemente armazenadas no HashiCorp Vault.

O `component_keyring_hashicorp` é destinado a substituir o plugin `keyring_hashicorp` (que agora está desatualizado) e utiliza a infraestrutura do componente. Para obter mais informações, consulte Componentes de Keyring em Relação a Plugins de Keyring.

Os componentes `keyring_hashicorp` suportam as funções que compõem a interface padrão do serviço de Keyring do MySQL. As operações de Keyring realizadas por essas funções são acessíveis em dois níveis:

* Interface SQL: Em instruções SQL, chame as funções descritas na Seção 8.4.5.15, “Funções de Gerenciamento de Chaves de Keyring de Uso Geral”.

* Interface C: Em código em C, chame as funções do serviço de Keyring descritas na Seção 7.6.8.2, “O Serviço de Keyring”.

Exemplo (usando a interface SQL):

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Para obter informações sobre as características dos valores de chave permitidos pelo `keyring_hashicorp`, consulte a Seção 8.4.5.13, “Tipos e Comprimentos de Chaves de Keyring Suportáveis”.

Para instalar o `component_keyring_hashicorp`, use as instruções gerais encontradas na Seção 8.4.5.2, “Instalação do Componente Keychain”, juntamente com as informações de configuração específicas para o `component_keyring_hashicorp` encontradas aqui. A configuração específica do componente inclui a preparação dos arquivos de certificado e chave necessários para se conectar ao HashiCorp Vault, bem como a configuração do próprio HashiCorp Vault. As seções a seguir fornecem as instruções necessárias.

* Preparação do Certificado e da Chave
* Configuração do HashiCorp Vault
* Configuração do `component_keyring_hashicorp`
* Migração do Plugin HashiCorp Vault

##### Preparação do Certificado e da Chave

O componente `keyring_hashicorp` requer uma conexão segura com o servidor HashiCorp Vault, utilizando o protocolo HTTPS. Uma configuração típica inclui um conjunto de arquivos de certificado e chave:

* `company.crt`: Um certificado CA personalizado pertencente à organização. Este arquivo é usado tanto pelo servidor HashiCorp Vault quanto pelo plugin `keyring_hashicorp`.

* `vault.key`: A chave privada da instância do servidor HashiCorp Vault. Este arquivo é usado pelo servidor HashiCorp Vault.

* `vault.crt`: O certificado da instância do servidor HashiCorp Vault. Este arquivo deve ser assinado pelo certificado CA da organização.

As instruções a seguir descrevem como criar os arquivos de certificado e chave usando o OpenSSL. (Se você já tiver esses arquivos, prossiga para a Configuração do HashiCorp Vault.) As instruções mostradas se aplicam a plataformas Linux e podem exigir ajustes para outras plataformas.

Importante

Certificados gerados por essas instruções são autoassinados, o que pode não ser muito seguro. Após ganhar experiência usando esses arquivos, considere obter material de certificado/chave de uma autoridade de certificação registrada.

1. Prepare as chaves da empresa e do servidor HashiCorp Vault.

Use os seguintes comandos para gerar os arquivos de chave:

```
   openssl genrsa -aes256 -out company.key 4096
   openssl genrsa -aes256 -out vault.key 2048
   ```

Os comandos geram arquivos que contêm a chave privada da empresa (`company.key`) e a chave privada do servidor do Vault (`vault.key`). As chaves são chaves RSA geradas aleatoriamente de 4.096 e 2.048 bits, respectivamente.

Cada comando solicita uma senha. Para fins de teste, a senha não é necessária. Para desabilitar, omita o argumento `-aes256`.

Os arquivos de chave contêm informações sensíveis e devem ser armazenados em um local seguro. A senha (também sensível) é necessária mais tarde, então anote-a e armazene em um local seguro.

(Opcional) Para verificar o conteúdo e a validade do arquivo de chave, use os seguintes comandos:

```
   openssl rsa -in company.key -check
   openssl rsa -in vault.key -check
   ```

2. Crie o certificado da CA da empresa.

   Use o seguinte comando para criar um arquivo de certificado da CA da empresa chamado `company.crt` que seja válido por 365 dias (insira o comando em uma única linha):

   ```
   openssl req -x509 -new -nodes -key company.key
     -sha256 -days 365 -out company.crt
   ```

   Se você usou o argumento `-aes256` para realizar a criptografia da chave durante a geração da chave, você será solicitado a fornecer a senha da chave da empresa durante a criação do certificado da CA. Você também será solicitado informações sobre o detentor do certificado (ou seja, você ou sua empresa), conforme mostrado aqui:

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

   Para criar um certificado de servidor do HashiCorp Vault, um Pedido de Assinatura de Certificado (CSR) deve ser preparado para a chave do servidor recém-criada. Crie um arquivo de configuração chamado `request.conf` contendo as seguintes linhas. Se o servidor do HashiCorp Vault não estiver rodando no host local, substitua os valores de CN e IP apropriados e faça quaisquer outras alterações necessárias.

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

4. Crie o certificado do servidor HashiCorp Vault.

   Assine as informações combinadas da chave do servidor HashiCorp Vault (`vault.key`) e do CSR (`request.csr`) com o certificado da empresa (`company.crt`) para criar o certificado do servidor HashiCorp Vault (`vault.crt`). Use o seguinte comando para fazer isso (entre o comando em uma única linha):

   ```
   openssl x509 -req -in request.csr
     -CA company.crt -CAkey company.key -CAcreateserial
     -out vault.crt -days 365 -sha256
   ```

   Para tornar o certificado do servidor `vault.crt` útil, adicione o conteúdo do certificado da empresa `company.crt` a ele. Isso é necessário para que o certificado da empresa seja entregue junto com o certificado do servidor em solicitações.

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

As instruções a seguir descrevem como criar uma configuração do HashiCorp Vault que facilita o teste do componente `component_keyring_hashicorp`.

Importante

Uma configuração de teste é semelhante a uma configuração de produção, mas o uso da HashiCorp Vault em produção implica em considerações de segurança adicionais, como o uso de certificados não autoassinados e o armazenamento do certificado da empresa no armazenamento de confiança do sistema. Você deve implementar quaisquer etapas de segurança adicionais necessárias para atender aos seus requisitos operacionais.

Essas instruções assumem a disponibilidade dos arquivos de certificado e chave criados na Preparação de Certificado e Chave. Veja essa seção se você não tiver esses arquivos.

1. Obtenha o binário do HashiCorp Vault.

   Descarregue o binário do HashiCorp Vault apropriado para sua plataforma em <https://www.vaultproject.io/downloads.html>.

Extraia o conteúdo do arquivo para produzir o comando executável **vault**, que é usado para realizar operações do HashiCorp Vault. Se necessário, adicione o diretório onde você instalou o comando ao caminho do sistema.

(Opcional) O HashiCorp Vault suporta opções de autocompletar que facilitam o uso. Para mais informações, consulte <https://learn.hashicorp.com/vault/getting-started/install#command-completion>.

2. Crie o arquivo de configuração do servidor HashiCorp Vault.

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

3. Inicie o servidor HashiCorp Vault.

   Para iniciar o servidor Vault, use o seguinte comando, onde a opção `-config` especifica o caminho do arquivo de configuração recém-criado:

   ```
   vault server -config=config.hcl
   ```

   Durante essa etapa, você pode ser solicitado a fornecer uma senha para a chave privada do servidor Vault armazenada no arquivo `vault.key`.

   O servidor deve começar a funcionar, exibindo algumas informações na consola (IP, porta, etc.).

   Para que você possa inserir os comandos restantes, coloque o comando **vault server** em segundo plano ou abra outro terminal antes de continuar.

4. Inicie o servidor HashiCorp Vault.

   Observação

   As operações descritas nesta etapa são necessárias apenas ao iniciar o Vault pela primeira vez, para obter a chave de desbloqueio e o token raiz. Reinicializações subsequentes da instância do Vault requerem apenas o desbloqueio usando a chave de desbloqueio.

   Emissão dos seguintes comandos (assumindo sintaxe de shell Bourne):

   ```
   export VAULT_SKIP_VERIFY=1
   vault operator init -n 1 -t 1
   ```

O primeiro comando permite que o comando **vault** ignore temporariamente o fato de que nenhum certificado da empresa foi adicionado ao armazenamento de confiança do sistema. Isso compensa o fato de que nossa CA autoassinada não está adicionada a esse armazenamento. (Para uso em produção, um certificado como esse deve ser adicionado.)

O segundo comando cria uma única chave de desasembramento com a exigência de que uma única chave de desasembramento esteja presente para a desasembramento. (Para uso em produção, uma instância teria várias chaves de desasembramento, com até tantas chaves sendo necessárias para serem inseridas para desasembrar. As chaves de desasembramento devem ser entregues aos guardiões das chaves dentro da empresa. O uso de uma única chave pode ser considerado um problema de segurança porque isso permite que o vault seja desasembrado por um único guardião da chave.)

O vault deve responder com informações sobre a chave de desasembramento e o token raiz, além de algum texto adicional (os valores reais da chave de desasembramento e do token raiz diferem dos mostrados aqui):

```
   ...
   Unseal Key 1: I2xwcFQc892O0Nt2pBiRNlnkHzTUrWS+JybL39BjcOE=
   Initial Root Token: s.vTvXeo3tPEYehfcd9WH7oUKz
   ...
   ```

Armazene a chave de desasembramento e o token raiz em um local seguro.

5. Desasembler o servidor HashiCorp Vault.

   Use este comando para desasembler o servidor Vault:

   ```
   vault operator unseal
   ```

   Quando solicitado para inserir a chave de desasembramento, use a chave obtida anteriormente durante a inicialização do Vault.

   O vault deve produzir uma saída indicando que a configuração está completa e o vault está desasembrado.

6. Faça login no servidor HashiCorp Vault e verifique seu status.

   Prepare as variáveis de ambiente necessárias para fazer login como root:

   ```
   vault login s.vTvXeo3tPEYehfcd9WH7oUKz
   ```

   Para o valor do token nesse comando, substitua o conteúdo do token raiz obtido anteriormente durante a inicialização do Vault.

   Verifique o status do servidor Vault:

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

7. Configure a autenticação e o armazenamento do HashiCorp Vault.

   Nota

As operações descritas nesta etapa são necessárias apenas na primeira vez que a instância do Vault é executada. Elas não precisam ser repetidas posteriormente.

Ative o método de autenticação AppRole e verifique se ele está na lista de métodos de autenticação:

```
   vault auth enable approle
   vault auth list
   ```

Ative o mecanismo de armazenamento de Vault KeyValue:

```
   vault secrets enable -version=1 kv
   ```

Crie e configure um papel para uso com o plugin `keyring_hashicorp` (insira o comando em uma única linha):

```
   vault write auth/approle/role/mysql token_num_uses=0
     token_ttl=20m token_max_ttl=30m secret_id_num_uses=0
   ```

8. Adicione uma política de segurança AppRole.

   Observação

   As operações descritas nesta etapa são necessárias apenas na primeira vez que a instância do Vault é executada. Elas não precisam ser repetidas posteriormente.

   Prepare uma política para permitir que o papel criado anteriormente acesse segredos apropriados. Crie um novo arquivo chamado `mysql.hcl` com o seguinte conteúdo:

   ```
   path "kv/mysql/*" {
     capabilities = ["create", "read", "update", "delete", "list"]
   }
   ```

   Observação

   `kv/mysql/` neste exemplo pode precisar de ajuste de acordo com as políticas de instalação locais e os requisitos de segurança. Se necessário, faça o mesmo ajuste em qualquer outro lugar onde `kv/mysql/` aparece nessas instruções.

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

   Após a geração das credenciais do ID do papel e do ID de segredo do AppRole, espera-se que elas permaneçam válidas indefinidamente. Elas não precisam ser geradas novamente e o plugin `keyring_hashicorp` pode ser configurado com elas para uso contínuo. Para mais informações sobre a autenticação AuthRole, visite <https://www.vaultproject.io/docs/auth/approle.html>.

##### configuração do componente_keyring_hashicorp

Quando é inicializado, o `component_keyring_hashicorp` lê um arquivo de configuração global do componente chamado `component_keyring_hashicorp.cnf` no `plugin_dir`. Se este arquivo contiver `{"read_local_config": true}`, o componente ignora quaisquer outros itens no arquivo global e, em vez disso, tenta ler suas informações de configuração de um arquivo de configuração local (também chamado `component_keyring_hashicorp.cnf`) no diretório de dados MySQL (`datadir`).

Se o componente não encontrar o arquivo de configuração global ou (em casos em que procura um) um arquivo de configuração local, ele não poderá ser iniciado.

O arquivo de configuração `component_keyring_hashicorp.cnf` ou os arquivos de configuração devem estar no formato JSON válido.

Os itens de configuração suportados em `component_keyring_hashicorp.cnf` são mostrados na tabela a seguir:

<table summary="itens de configuração do componente keyring_hashicorp."><tr><th style="width: 15%">Item de Configuração</th><th style="width: 20%">Descrição</th><th style="width: 10%">Obrigatório</th><th style="width: 20%">Valores Válidos</th><th style="width: 15%">Padrão</th><th style="width: 20%">Variável do Sistema Correspondente"></tr></thead><tbody><tr><th><code>auth_mode</code></th><td>Se usar autenticação com AppRole ou com base em token.</td><th>Não.</th><th><code>approle</code>, <code>token</code></th><th><code>approle</code></th><th><code>None</code></th><th><code>keyring_hashicorp_auth_path</code></th></tr><tr><th><code>auth_path</code></th><td>Caminho de autenticação onde a autenticação com AppRole é habilitada no servidor HashiCorp Vault.</td><th>Não.</th><th>Caminho válido do sistema de arquivos estilo Unix; não pode ser vazio.</th><th><code>/v1/auth/approle/login</code></th><th><code>keyring_hashicorp_ca_path</code></th></tr><tr><th><code>ca_path</code></th><td>Caminho para o arquivo local (acessível ao servidor MySQL) contendo o certificado da autoridade TLS formatado corretamente.</td><th>Não</th><th>Caminho válido do sistema de arquivos para o sistema que hospeda o servidor MySQL. O caminho deve ser absoluto.</th><th><code>String vazio</code></th><th><code>keyring_hashicorp_ca_path</code></th></tr><tr><th><code>caching</code></th><td>Se habilitar o cache de chave em memória. Se habilitado, o <code>component_keyring_hashicorp</code> o preenche durante a inicialização; apenas a lista de chaves é preenchida.</td><th>Não.</th><th><code>ON</code>, <code>OFF</code></th><th><code>OFF</code></th><th><code>keyring_hashicorp_caching</code></th></tr><tr><th><code>role_id</code></th><td>ID da autenticação AppRole do HashiCorp Vault.</td><th>Sim, quando <code>auth_mode</code> é <code>approle</code>.</th><th>Deve ser no formato UUID válido.</th><th><code>String vazio</code></th><th><code>keyring_hashicorp_role_id</code></th></tr><tr><th><code>secret_id</code></th><td>ID do segredo da autenticação AppRole, no formato UUID.</td><th>Sim, quando <code>auth_mode</code> é <code>approle</code>.</th><th>Deve ser no formato UUID válido.</th><th><code>String vazio</code></th><th><code>keyring_hashicorp_secret_id</code></th></tr><tr><th><code>server_url</code></th><td>URL do servidor HashiCorp Vault.</td><th>Não.</th><th>Uma URL válida que comece com <code>https://</code>.</th><th><code>https://12

Observação

`component_keyring_hashicorp` não suporta nenhuma das variáveis de sistema fornecidas pelo plugin `keyring_hashicorp`; estas últimas são mostradas na última coluna da tabela anterior para ajudar na migração do plugin para o componente. Consulte Migração do Plugin HashiCorp Vault para obter mais informações.

Para ser utilizável durante o processo de inicialização do servidor, `component_keyring_hashicorp` deve ser carregado usando um arquivo de manifesto `mysqld.my` (consulte Seção 8.4.5.2, “Instalação do Componente Keyring”). Este arquivo deve conter o seguinte item:

```
{
  "components": "file://component_keyring_hashicorp"
}
```

Observação

Um arquivo `mysqld.my` ou outro arquivo de manifesto pode conter referências a vários componentes; para simplicidade, mostramos aqui apenas o item que carrega o componente HashiCorp Keyring.

Os conteúdos de um arquivo de exemplo `component_keyring_hashicorp.cnf` usando autenticação de AppRole são mostrados aqui:

```
{
  "server_url" : "https://my.vault.server.fqdn:8200",
  "role_id" : "12345678-abcd-bcde-cdef-12345678abcd",
  "secret_id" : "12345678-abcd-bcde-cdef-12345678abcd",
  "store_path" : "/v1/kv/mysql",
  "auth_path" : "/v1/auth/approle/login",
  "ca_path" : "/export/home/hashicorp/vault.crt",
  "caching" : "ON"
}
```

Este exemplo mostra um arquivo de configuração de amostra para uma configuração usando autenticação baseada em token:

```
{
  "server_url" : "https://my.vault.server.fqdn:8200",
  "store_path" : "/v1/kv/mysql",
  "auth_path" : "/v1/auth/approle/login",
  "ca_path" : "/export/home/hashicorp/vault.crt",
  "caching" : "ON",
  "auth_mode" : "token",
  "token_path" : "/export/home/hashicorp/token.txt"
}
```

Observação

Todas as rotas da API HashiCorp são prefixadas com uma versão do protocolo (que você pode ver no exemplo anterior como `/v1/`). Se a HashiCorp desenvolver novas versões de protocolo, pode ser necessário alterar `/v1/` para algo mais em sua configuração.

O MySQL Server autentica-se contra o HashiCorp Vault usando a autenticação AppRole. A autenticação bem-sucedida requer que dois segredos sejam fornecidos ao Vault, um ID de papel e um ID de segredo, que são semelhantes em conceito ao nome de usuário e senha. Os valores do ID de papel e do ID de segredo a serem usados são aqueles obtidos durante o procedimento de configuração do HashiCorp Vault realizado anteriormente. Para especificar os dois IDs, atribua seus respectivos valores a `role_id` e `secret_id`. O procedimento de configuração também resulta na rota de armazenamento `/v1/kv/mysql`, que é usada para `store_path` em `component_keyring_hashicorp.cnf`.

##### Migração do Plugin HashiCorp Vault

Para migrar do plugin de chaveira HashiCorp para o componente de chaveira HashiCorp Vault, é necessário configurar o carregamento do componente, criar uma configuração do componente equivalente à usada pelo plugin, parar o carregamento do plugin e remover quaisquer referências ao plugin ou às suas variáveis de sistema associadas de todos os arquivos de configuração. Você pode realizar essas tarefas executando as etapas mostradas aqui:

1. Crie ou modifique um arquivo de manifesto local ou global `mysqld.my` (consulte a Seção 8.4.5.2, “Instalação do Componente de Chaveira”). O conteúdo do arquivo deve incluir (completamente) o item `components` mostrado aqui:

   ```
   {
     "components": "file://component_keyring_hashicorp"
   }
   ```

2. Obtenha os valores de qualquer uma das seguintes opções de inicialização que você encontrar no arquivo `my.conf` do servidor MySQL:

   * `--keyring-hashicorp-auth-path`
   * `--keyring-hashicorp-server-url`
   * `--keyring-hashicorp-role-id`
   * `--keyring-hashicorp-secret-id`
   * `--keyring-hashicorp-store-path`
   * `--keyring-hashicorp-caching`

   Nota

   Os Componentes MySQL não são compatíveis com `--early-plugin-load`, então esse valor não é necessário pelo `component_keyring_hashicorp`.

Uma parte desse arquivo de configuração é mostrada aqui:

```
   [mysqld]
   early-plugin-load=keyring_hashicorp.so
   keyring_hashicorp_role_id='ee3b495c-d0c9-11e9-8881-8444c71c32aa'
   keyring_hashicorp_secret_id='0512af29-d0ca-11e9-95ee-0010e00dd718'
   keyring_hashicorp_store_path='/v1/kv/mysql'
   keyring_hashicorp_auth_path='/v1/auth/approle/login'
   keyring_hashicorp_ca_path='/export/home/hashicorp/vault.crt'
   keyring_hashicorp_caching='ON'
   ```

3. Escreva um arquivo de configuração do componente `component_keyring_hashicorp.cnf` (consulte Configuração do componente `keyring_hashicorp`) que defina cada um dos itens de configuração com o valor obtido no passo anterior para sua variável de sistema equivalente, conforme mostrado aqui:

```
   {
     "server_url" : "https://my.vault.server.fqdn:8200",
     "role_id" : "ee3b495c-d0c9-11e9-8881-8444c71c32aa",
     "secret_id" : "0512af29-d0ca-11e9-95ee-0010e00dd718",
     "store_path" : "/v1/kv/mysql",
     "auth_path" : "/v1/auth/approle/login",
     "ca_path" : "/export/home/hashicorp/vault.crt",
     "caching" : "ON"
   }
   ```

4. Realize qualquer migração de chaves que possa ser necessária. Consulte a Seção 8.4.5.14, “Migrar Chaves entre Keystores do Keyring”, para obter mais informações.

5. Desinstale o plugin usando `UNINSTALL PLUGIN`. Consulte Desinstalação de Plugins.

6. Remova quaisquer referências ao plugin em `my.cnf` e em quaisquer outros arquivos de configuração do MySQL. Certifique-se de remover a linha mostrada aqui:

   ```
   early-plugin-load=keyring_hashicorp.so
   ```

   Além disso, você deve remover referências a quaisquer variáveis específicas do plugin de chaveira HashiCorp (opções equivalentes listadas anteriormente). Variáveis que foram persistidas (salvadas em `mysqld-auto.cnf`) devem ser removidas da configuração do servidor usando `RESET PERSIST`.

7. Reinicie o **mysqld** para que as alterações tenham efeito.