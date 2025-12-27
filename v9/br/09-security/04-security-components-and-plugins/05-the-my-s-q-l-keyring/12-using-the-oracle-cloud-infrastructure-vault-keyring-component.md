#### 8.4.5.12 Usando o componente de cartela de chave do Oracle Cloud Infrastructure

Observação

O componente de cartela de chave do Oracle Cloud Infrastructure está incluído na Edição Empresarial do MySQL, um produto comercial. Para obter mais informações sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

`component_keyring_oci` faz parte da infraestrutura do componente que se comunica com o Oracle Cloud Infrastructure Vault para armazenamento no back-end. Nenhuma informação de chave é armazenada permanentemente no armazenamento local do servidor MySQL. Todas as chaves são armazenadas no Oracle Cloud Infrastructure Vault, tornando este componente muito adequado para clientes do Oracle Cloud Infrastructure MySQL para gerenciamento de suas chaves da Edição Empresarial do MySQL.

`component_keyring_oci` substitui o antigo plugin `keyring_oci` (já não disponível) e emprega a infraestrutura do componente. Para obter mais informações, consulte a Seção 8.4.5.1, “Componentes de cartela de chave versus plugins de cartela de chave”.

Observação

Só deve ser habilitado um componente ou plugin de cartela de chave de cada vez. Habilitar vários componentes ou plugins de cartela de chave não é suportado e os resultados podem não ser os esperados.

Para usar `component_keyring_oci` para gerenciamento de cartela de chaves, você deve:

1. Escrever um manifesto que instrua o servidor a carregar `component_keyring_oci`, conforme descrito na Seção 8.4.5.2, “Instalação do componente de cartela de chave”.

2. Escrever um arquivo de configuração para `component_keyring_oci`, conforme descrito aqui.

* Notas de configuração
* Verificar a instalação do componente
* Uso do componente de cartela de chave Vault

##### Notas de configuração

Ao inicializar, `component_keyring_oci` lê um arquivo de configuração global ou um arquivo de configuração global emparelhado com um arquivo de configuração local:

* O componente tenta ler seu arquivo de configuração global do diretório onde o arquivo da biblioteca do componente está instalado (ou seja, o diretório do plugin do servidor).

* Se o arquivo de configuração global indicar o uso de um arquivo de configuração local, o componente tenta ler seu arquivo de configuração local do diretório de dados.

* Embora os arquivos de configuração global e local estejam localizados em diretórios diferentes, o nome do arquivo é `component_keyring_oci.cnf` em ambos os locais.

* É um erro que nenhum arquivo de configuração exista. O `component_keyring_oci` não pode ser inicializado sem uma configuração válida.

Os arquivos de configuração local permitem configurar múltiplas instâncias do servidor para usar `component_keyring_oci`, de modo que a configuração do componente para cada instância do servidor seja específica de uma instância do diretório de dados dado. Isso permite que o mesmo componente de chaveiro seja usado com um Vault distinto da Oracle Cloud Infrastructure para cada instância.

Você deve estar familiarizado com os conceitos da Oracle Cloud Infrastructure, mas a documentação a seguir pode ser útil ao configurar recursos para serem usados pelo `component_keyring_oci`:

[Visão geral do Vault](https://docs.cloud.oracle.com/iaas/Content/KeyManagement/Concepts/keyoverview.htm)

[Chaves e OCIDs Requeridos](https://docs.cloud.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm)

[Gerenciamento de Chaves](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingkeys.htm)

[Gerenciamento de Compartimentos](https://docs.cloud.oracle.com/en-us/iaas/Content/Identity/Tasks/managingcompartments.htm)

[Gerenciamento de Vaults](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingvaults.htm)

[Gerenciamento de Segredos](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingsecrets.htm)

Os arquivos de configuração `component_keyring_oci` têm essas propriedades:

* Um arquivo de configuração deve estar no formato JSON válido.
* Um arquivo de configuração permite esses itens de configuração:

  + `"read_local_config"`: Este item é permitido apenas no arquivo de configuração global. Se o item não estiver presente, o componente usa apenas o arquivo de configuração global. Se o item estiver presente, seu valor é `true` ou `false`, indicando se o componente deve ler informações de configuração do arquivo de configuração local.

    Se o item `"read_local_config"` estiver presente no arquivo de configuração global junto com outros itens, o componente verifica o valor do item `"read_local_config"` primeiro:

    - Se o valor for `false`, o componente processa os outros itens no arquivo de configuração global e ignora o arquivo de configuração local.

    - Se o valor for `true`, o componente ignora os outros itens no arquivo de configuração global e tenta ler o arquivo de configuração local.

[Chaves e OCIDs Requeridos](https://docs.cloud.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm).

    Este valor é obrigatório.

[Chaves e OCIDs Requeridos](https://docs.cloud.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm).

    Este valor é obrigatório.

[Gerenciamento de Compartimentos](https://docs.cloud.oracle.com/en-us/iaas/Content/Identity/Tasks/managingcompartments.htm).

    Este valor é obrigatório.

[Gerenciamento de Vaults](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingvaults.htm).

    Este valor é obrigatório.

[Gerenciamento de Vaults](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingvaults.htm).

    Este valor é obrigatório.

[Gerenciamento de Vaults](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingvaults.htm).

Este valor é obrigatório.

[Gerenciamento de Vaults](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingvaults.htm).

    Este valor é obrigatório.

[Gerenciamento de Vaults](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingvaults.htm).

    Este valor é obrigatório.

[Gerenciamento de Chaves](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingkeys.htm).

    Este valor é obrigatório.

[Chaves e OCIDs Requeridas](https://docs.cloud.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm).

    Este valor é obrigatório.

  + `“key_fingerprint”`: O cache do fingerprint da chave privada RSA que o componente `component_keyring_oci` usa para autenticação na Oracle Cloud Infrastructure. Para obter o cache do fingerprint ao criar as chaves da API, execute este comando:

    ```
    openssl rsa -pubout -outform DER -in ~/.oci/oci_api_key.pem | openssl md5 -c
    ```

    Alternativamente, obtenha o cache do fingerprint na Console, que exibe automaticamente o cache do fingerprint ao carregar a chave pública RSA. Para obter informações sobre como obter caches de fingerprint, consulte [Chaves e OCIDs Requeridas](https://docs.cloud.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm).

    Este valor é obrigatório.

  + `“ca_certificate”`: O nome do caminho do arquivo do pacote de certificados da CA que o componente `component_keyring_oci` usa para verificação de certificados na Oracle Cloud Infrastructure. O arquivo contém um ou mais certificados para verificação de pares. Se nenhum arquivo for especificado, o pacote de CA padrão instalado no sistema é usado. Se o valor for definido como `disabled` (sensível a maiúsculas e minúsculas), o `component_keyring_oci` não realiza nenhuma verificação de certificados.

    Em sistemas Windows, isso deve ser definido como `disabled`, ou para o caminho de um arquivo de pacote de certificados da CA.

Dadas as propriedades do arquivo de configuração anterior, para configurar o `component_keyring_oci`, crie um arquivo de configuração global chamado `component_keyring_oci.cnf` no diretório onde o arquivo da biblioteca `component_keyring_oci` está instalado, e, opcionalmente, crie um arquivo de configuração local, também chamado `component_keyring_oci.cnf`, no diretório de dados.

##### Verificar a Instalação do Componente

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

O valor `Component_status` de `Active` indica que o componente foi inicializado com sucesso.

Se o componente não puder ser carregado, o inicialização do servidor falha. Verifique o log de erro do servidor para mensagens de diagnóstico. Se o componente for carregado, mas não conseguir ser inicializado devido a problemas de configuração, o servidor será iniciado, mas o valor `Component_status` será `Disabled`. Verifique o log de erro do servidor, corrija os problemas de configuração e use a instrução `ALTER INSTANCE RELOAD KEYRING` para recarregar a configuração.

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

##### Uso do Componente Vault Keyring

O `component_keyring_oci` suporta as funções que compõem a interface padrão do serviço MySQL Keyring. As operações de Keyring realizadas por essas funções são acessíveis em instruções SQL conforme descrito na Seção 8.4.5.15, “Funções de Gerenciamento de Chaves do Keyring de Uso Geral”.

Exemplo:

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Para obter informações sobre as características dos valores de chave permitidos pelo `component_keyring_oci`, consulte a Seção 8.4.5.13, “Tipos e Comprimentos de Chaves de Keyring Suportáveis”.