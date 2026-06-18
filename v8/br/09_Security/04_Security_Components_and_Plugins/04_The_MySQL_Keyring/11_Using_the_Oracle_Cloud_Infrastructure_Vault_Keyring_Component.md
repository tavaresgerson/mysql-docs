#### 8.4.4.11 Usando o componente de cartela de chaves do Oracle Cloud Infrastructure

Nota

O componente de chave de criptografia Vault do Oracle Cloud Infrastructure está incluído na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

`component_keyring_oci` faz parte da infraestrutura do componente que se comunica com o Oracle Cloud Infrastructure Vault para armazenamento de back-end. Nenhuma informação chave é armazenada permanentemente no armazenamento local do servidor MySQL. Todas as chaves são armazenadas no Oracle Cloud Infrastructure Vault, tornando este componente muito adequado para clientes do Oracle Cloud Infrastructure MySQL para gerenciamento de suas chaves da Oracle Enterprise Edition.

No MySQL 8.0.24, o MySQL Keyring começou a migrar de plugins para usar a infraestrutura do componente. A introdução do `component_keyring_oci` no MySQL 8.0.31 é uma continuação desse esforço. Para mais informações, consulte Componentes do Keyring versus Plugins do Keyring.

Nota

Apenas um componente ou plugin do chaveiro deve ser ativado de cada vez. A ativação de vários componentes ou plugins do chaveiro não é suportada e os resultados podem não ser os esperados.

Para usar `component_keyring_oci` para a gestão do keystore, você deve:

1. Escreva um manifesto que indique ao servidor para carregar `component_keyring_oci`, conforme descrito na Seção 8.4.4.2, “Instalação do componente do Keychain”.

2. Escreva um arquivo de configuração para `component_keyring_oci`, conforme descrito aqui.

Depois de criar um manifesto e um arquivo de configuração, você deve ser capaz de acessar as chaves que foram criadas usando o plugin `keyring_oci`, desde que você especifique o mesmo conjunto de opções de configuração para inicializar o componente de chave. A compatibilidade reversa integrada do `component_keyring_oci` simplifica a migração do plugin de chave para o componente.

- Notas de configuração
- Verifique a instalação do componente
- Uso do componente de cartela para chaveiro

##### Notas de configuração

Quando é inicializado, o `component_keyring_oci` lê um arquivo de configuração global ou um arquivo de configuração global emparelhado com um arquivo de configuração local:

- O componente tenta ler seu arquivo de configuração global do diretório onde o arquivo da biblioteca do componente está instalado (ou seja, o diretório do plugin do servidor).

- Se o arquivo de configuração global indicar o uso de um arquivo de configuração local, o componente tentará ler seu arquivo de configuração local do diretório de dados.

- Embora os arquivos de configuração global e local estejam localizados em diretórios diferentes, o nome do arquivo é `component_keyring_oci.cnf` em ambos os locais.

- É um erro porque não existe nenhum arquivo de configuração. `component_keyring_oci` não pode ser inicializado sem uma configuração válida.

Os arquivos de configuração locais permitem configurar múltiplas instâncias do servidor para usar `component_keyring_oci`, de modo que a configuração do componente para cada instância do servidor seja específica de uma instância de diretório de dados dado. Isso permite que o mesmo componente de chave de registro seja usado com um Vault distinto da Oracle Cloud Infrastructure para cada instância.

Você deve estar familiarizado com os conceitos da Oracle Cloud Infrastructure, mas a documentação a seguir pode ser útil ao configurar os recursos a serem usados pelo `component_keyring_oci`:

- Visão geral do Vault

- Chaves e OCIDs exigidas

- Gerenciamento de Chaves

- Gerenciamento de compartimentos

- Gerenciamento de Vaults

- Gerenciar Segredos

Os arquivos de configuração `component_keyring_oci` têm essas propriedades:

- O arquivo de configuração deve estar no formato JSON válido.
- Um arquivo de configuração permite esses itens de configuração:

  - `"read_local_config"`: Este item é permitido apenas no arquivo de configuração global. Se o item não estiver presente, o componente usará apenas o arquivo de configuração global. Se o item estiver presente, seu valor é `true` ou `false`, indicando se o componente deve ler informações de configuração do arquivo de configuração local.

    Se o item `"read_local_config"` estiver presente no arquivo de configuração global junto com outros itens, o componente verifica o valor do item `"read_local_config"` primeiro:

    - Se o valor for `false`, o componente processa os outros itens no arquivo de configuração global e ignora o arquivo de configuração local.

    - Se o valor for `true`, o componente ignora os outros itens no arquivo de configuração global e tenta ler o arquivo de configuração local.

  - `“user”`: O ID de usuário da Oracle Cloud Infrastructure que o `component_keyring_oci` usa para as conexões. Antes de usar o `component_keyring_oci`, a conta de usuário deve existir e ter acesso para usar os recursos de locação, compartimento e cofre configurados da Oracle Cloud Infrastructure. Para obter o ID de usuário do usuário a partir do Console, use as instruções em Chaves e ID de usuário necessários.

    Este valor é obrigatório.

  - `“tenancy”`: O ID de entidade da infraestrutura da Oracle Cloud que o `component_keyring_oci` usa como local do compartimento MySQL. Antes de usar o `component_keyring_oci`, você deve criar uma entidade se ela não existir. Para obter o ID de entidade do Console, use as instruções em Chaves e ID de entidade exigidas.

    Este valor é obrigatório.

  - `“compartment”`: O ID do compartimento de senha que o `component_keyring_oci` usa como local das chaves do MySQL. Antes de usar o `component_keyring_oci`, você deve criar um compartimento ou subcompartimento do MySQL, se ele não existir. Esse compartimento não deve conter chaves do cofre ou segredos do cofre. Ele não deve ser usado por sistemas que não sejam o Keychain do MySQL. Para obter informações sobre a gestão de compartimentos e obter o ID do compartimento, consulte Gerenciamento de Compartimentos.

    Este valor é obrigatório.

  - `“virtual_vault”`: O ID do vault da Oracle Cloud Infrastructure que o `component_keyring_oci` usa para operações de criptografia. Antes de usar `component_keyring_oci`, você deve criar um novo vault no compartimento MySQL, se ele não existir. (Alternativamente, você pode reutilizar um vault existente que esteja em um compartimento pai do compartimento MySQL.) Os usuários do compartimento podem ver e usar apenas as chaves em seus respectivos compartimentos. Para obter informações sobre como criar um vault e obter o ID do vault, consulte Gerenciamento de Vaults.

    Este valor é obrigatório.

  - `“encryption_endpoint”`: O ponto final do servidor de criptografia da Oracle Cloud Infrastructure que o `component_keyring_oci` usa para gerar informações criptografadas ou codificadas (texto cifrado) para novas chaves. O ponto final de criptografia é específico do cofre e a Oracle Cloud Infrastructure atribui-o no momento da criação do cofre. Para obter o OCID do ponto final, consulte os detalhes da configuração do seu cofre keyring\_oci, usando as instruções em Gerenciamento de Cofres.

    Este valor é obrigatório.

  - `"management_endpoint"`: O ponto final do servidor de gerenciamento de chaves da Oracle Cloud Infrastructure que o `component_keyring_oci` usa para listar chaves existentes. O ponto final de gerenciamento de chaves é específico do cofre e a Oracle Cloud Infrastructure atribui-o no momento da criação do cofre. Para obter o OCID do ponto final, consulte os detalhes da configuração do seu cofre keyring\_oci, usando as instruções em Gerenciando cofres.

    Este valor é obrigatório.

  - `“vaults_endpoint”`: O ponto final do servidor de cofres da Oracle Cloud Infrastructure que o `component_keyring_oci` usa para obter o valor dos segredos. O ponto final dos cofres é específico do cofre e a Oracle Cloud Infrastructure atribui-o no momento da criação do cofre. Para obter o OCID do ponto final, consulte os detalhes da configuração do seu cofre keyring\_oci, usando as instruções em Gerenciamento de cofres.

    Este valor é obrigatório.

  - `“secrets_endpoint”`: O ponto final do servidor de segredos da Oracle Cloud Infrastructure que o `component_keyring_oci` usa para listar, criar e aposentar segredos. O ponto final de segredos é específico do cofre e a Oracle Cloud Infrastructure atribui-o no momento da criação do cofre. Para obter o OCID do ponto final, consulte os detalhes da configuração do seu cofre keyring\_oci, usando as instruções em Gerenciamento de Cofres.

    Este valor é obrigatório.

  - `“master_key”`: O código OCID da chave de criptografia mestre da Oracle Cloud Infrastructure que o `component_keyring_oci` usa para criptografar segredos. Antes de usar o `component_keyring_oci`, você deve criar uma chave criptográfica para o compartimento da Oracle Cloud Infrastructure, se ele não existir. Forneça um nome específico para MySQL para a chave gerada e não use-o para outros fins. Para obter informações sobre a criação de chaves, consulte Gerenciamento de Chaves.

    Este valor é obrigatório.

  - `“key_file”`: O nome do caminho do arquivo que contém a chave privada RSA que o `component_keyring_oci` usa para a autenticação da Oracle Cloud Infrastructure. Você também deve fazer o upload da chave pública RSA correspondente usando o Console. O Console exibe o valor do cache do certificado, que você pode usar para definir o valor do `"key_fingerprint"`. Para obter informações sobre a geração e o upload de chaves de API, consulte Chaves e OCIDs Requeridas.

    Este valor é obrigatório.

  - `“key_fingerprint”`: A impressão digital da chave privada RSA que `component_keyring_oci` usa para autenticação na Oracle Cloud Infrastructure. Para obter a impressão digital da chave ao criar as chaves de API, execute este comando:

    ```
    openssl rsa -pubout -outform DER -in ~/.oci/oci_api_key.pem | openssl md5 -c
    ```

    Alternativamente, obtenha a impressão digital do Console, que exibe automaticamente a impressão digital quando você carrega a chave pública RSA. Para obter informações sobre como obter impressões digitais de chaves, consulte Chaves e OCIDs exigidas.

    Este valor é obrigatório.

  - `“ca_certificate”`: O nome do caminho do arquivo do pacote de certificados CA que o componente `component_keyring_oci` usa para a verificação de certificados da Oracle Cloud Infrastructure. O arquivo contém um ou mais certificados para verificação de pares. Se nenhum arquivo for especificado, o pacote de CA padrão instalado no sistema é usado. Se o valor for definido como `disabled` (sensível a maiúsculas e minúsculas), `component_keyring_oci` não realiza nenhuma verificação de certificados.

    Nos sistemas Windows, isso deve ser definido como `disabled`, ou para o caminho de um arquivo de pacote de certificado de CA.

Dadas as propriedades do arquivo de configuração anterior, para configurar o `component_keyring_oci`, crie um arquivo de configuração global chamado `component_keyring_oci.cnf` no diretório onde o arquivo da biblioteca `component_keyring_oci` está instalado e, opcionalmente, crie um arquivo de configuração local, também chamado `component_keyring_oci.cnf`, no diretório de dados.

##### Verifique a instalação do componente

Após realizar qualquer configuração específica do componente, inicie o servidor. Verifique a instalação do componente examinando a tabela do Schema de Desempenho `keyring_component_status`:

```
mysql> SELECT * FROM performance_schema.keyring_component_status;
+---------------------+--------------------------------------------------------------------+
| STATUS_KEY          | STATUS_VALUE                                                       |
+---------------------+--------------------------------------------------------------------+
| Component_name      | component_keyring_oci                                              |
| Author              | Oracle Corporation                                                 |
| License             | PROPRIETARY                                                        |
| Implementation_name | component_keyring_oci                                              |
| Version             | 1.0                                                                |
| Component_status    | Active                                                             |
| user                | ocid1.user.oc1..aaaaaaaasqly<...>                                  |
| tenancy             | ocid1.tenancy.oc1..aaaaaaaai<...>                                  |
| compartment         | ocid1.compartment.oc1..aaaaaaaah2swh<...>                          |
| virtual_vault       | ocid1.vault.oc1.iad.bbo5xyzkaaeuk.abuwcljtmvxp4r<...>              |
| master_key          | ocid1.key.oc1.iad.bbo5xyzkaaeuk.abuwcljrbsrewgap<...>              |
| encryption_endpoint | bbo5xyzkaaeuk-crypto.kms.us-<...>                                  |
| management_endpoint | bbo5xyzkaaeuk-management.kms.us-<...>                              |
| vaults_endpoint     | vaults.us-<...>                                                    |
| secrets_endpoint    | secrets.vaults.us-<...>                                            |
| key_file            | ~/.oci/oci_api_key.pem                                             |
| key_fingerprint     | ca:7c:e1:fa:86:b6:40:af:39:d6<...>                                 |
| ca_certificate      | disabled                                                           |
+---------------------+--------------------------------------------------------------------+
```

Um valor `Component_status` de `Active` indica que o componente foi inicializado com sucesso.

Se o componente não puder ser carregado, o início do servidor falha. Verifique o log de erro do servidor para mensagens de diagnóstico. Se o componente for carregado, mas não conseguir inicializar devido a problemas de configuração, o servidor será iniciado, mas o valor `Component_status` será `Disabled`. Verifique o log de erro do servidor, corrija os problemas de configuração e use a instrução `ALTER INSTANCE RELOAD KEYRING` para recarregar a configuração.

É possível consultar o servidor MySQL para obter a lista de chaves existentes. Para ver quais chaves existem, examine a tabela do Schema de Desempenho `keyring_keys`.

```
mysql> SELECT * FROM performance_schema.keyring_keys;
+-----------------------------+--------------+----------------+
| KEY_ID                      | KEY_OWNER    | BACKEND_KEY_ID |
+-----------------------------+--------------+----------------+
| audit_log-20210322T130749-1 |              |                |
| MyKey                       | me@localhost |                |
| YourKey                     | me@localhost |                |
+-----------------------------+--------------+----------------+
```

##### Uso do componente de cartela para chaveiro

O `component_keyring_oci` suporta as funções que compõem a interface padrão do serviço de cartela de chaves do MySQL. As operações de cartela de chaves realizadas por essas funções são acessíveis em instruções SQL, conforme descrito na Seção 8.4.4.15, “Funções de Gerenciamento de Chaves de Cartela de Chaves de Uso Geral”.

Exemplo:

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Para obter informações sobre as características dos valores-chave permitidos por `component_keyring_oci`, consulte a Seção 8.4.4.13, “Tipos e comprimentos de chave do carteiro suportado”.
