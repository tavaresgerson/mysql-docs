#### 8.4.4.12 Usando o Plugin de Carteira de Chaves do Oracle Cloud Infrastructure

Nota

O plugin `keyring_oci` é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

O plugin `keyring_oci` é um plugin de chaveiro que se comunica com o Oracle Cloud Infrastructure Vault para armazenamento no back-end. Nenhuma informação de chave é armazenada permanentemente no armazenamento local do servidor MySQL. Todas as chaves são armazenadas no Oracle Cloud Infrastructure Vault, tornando este plugin muito adequado para clientes do Oracle Cloud Infrastructure MySQL para gerenciamento de suas chaves da Edição Empresarial do MySQL.

A partir do MySQL 8.0.31, este plugin é desatualizado e está sujeito à remoção em uma futura versão do MySQL. Em vez disso, considere usar o componente `component_keyring_oci` para armazenar dados do chaveiro (consulte a Seção 8.4.4.11, “Usando o componente de chaveiro do Oracle Cloud Infrastructure Vault”).

O plugin `keyring_oci` suporta as funções que compõem a interface padrão do serviço de Keyring do MySQL. As operações de Keyring realizadas por essas funções são acessíveis em dois níveis:

- Interface SQL: Nas instruções SQL, chame as funções descritas na Seção 8.4.4.15, “Funções de Gerenciamento de Chave do Carteiro de Propósito Geral”.

- Interface C: No código em C, chame as funções do serviço de chave de registro descritas na Seção 7.6.9.2, “O Serviço de Chave de Registro”.

Exemplo (usando a interface SQL):

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Para obter informações sobre as características dos valores-chave permitidos por `keyring_oci`, consulte a Seção 8.4.4.13, “Tipos e comprimentos de chave do carteiro suportado”.

Para instalar o `keyring_oci`, use as instruções gerais encontradas na Seção 8.4.4.3, “Instalação do Plugin do Keychain”, juntamente com as informações de configuração específicas para o `keyring_oci` encontradas aqui. A configuração específica do plugin envolve a definição de várias variáveis do sistema para indicar os nomes ou valores dos recursos da Oracle Cloud Infrastructure.

Você deve estar familiarizado com os conceitos do Oracle Cloud Infrastructure, mas a documentação a seguir pode ser útil ao configurar os recursos que serão usados pelo plugin \[\[`keyring_oci`]\_\_:

- Visão geral do Vault

- Identificador de recursos

- Chaves e OCIDs exigidas

- Gerenciamento de Chaves

- Gerenciamento de compartimentos

- Gerenciamento de Vaults

- Gerenciar Segredos

O plugin `keyring_oci` suporta os parâmetros de configuração mostrados na tabela a seguir. Para especificar esses parâmetros, atribua valores às variáveis de sistema correspondentes.

<table summary="parâmetros de configuração do keyring_oci e variáveis de sistema correspondentes."><thead><tr> <th scope="col">Parâmetro de configuração</th> <th scope="col">Variável do sistema</th> <th scope="col">Obrigatório</th> </tr></thead><tbody><tr> <th>Usuário OCID</th> <td>[[PH_HTML_CODE_<code>keyring_oci_key_fingerprint</code>]</td> <td>Sim</td> </tr><tr> <th>Locação OCID</th> <td>[[PH_HTML_CODE_<code>keyring_oci_key_fingerprint</code>]</td> <td>Sim</td> </tr><tr> <th>Compartimento OCID</th> <td>[[<code>keyring_oci_compartment</code>]]</td> <td>Sim</td> </tr><tr> <th>Vault OCID</th> <td>[[<code>keyring_oci_virtual_vault</code>]]</td> <td>Sim</td> </tr><tr> <th>Chave mestre OCID</th> <td>[[<code>keyring_oci_master_key</code>]]</td> <td>Sim</td> </tr><tr> <th>Ponto final do servidor de criptografia</th> <td>[[<code>keyring_oci_encryption_endpoint</code>]]</td> <td>Sim</td> </tr><tr> <th>Endpoint do servidor de gerenciamento de chaves</th> <td>[[<code>keyring_oci_management_endpoint</code>]]</td> <td>Sim</td> </tr><tr> <th>Ponto final do servidor dos armazéns</th> <td>[[<code>keyring_oci_vaults_endpoint</code>]]</td> <td>Sim</td> </tr><tr> <th>Endpoint do servidor do Secrets</th> <td>[[<code>keyring_oci_secrets_endpoint</code>]]</td> <td>Sim</td> </tr><tr> <th>Arquivo de chave privada RSA</th> <td>[[<code>keyring_oci_key_file</code>]]</td> <td>Sim</td> </tr><tr> <th>Digitalização da chave privada RSA</th> <td>[[<code>keyring_oci_key_fingerprint</code>]]</td> <td>Sim</td> </tr><tr> <th>Arquivo de pacote de certificado CA</th> <td>[[<code>keyring_oci_tenancy</code><code>keyring_oci_key_fingerprint</code>]</td> <td>Não</td> </tr></tbody></table>

Para ser utilizado durante o processo de inicialização do servidor, o `keyring_oci` deve ser carregado usando a opção `--early-plugin-load`. Como indicado na tabela anterior, várias variáveis de sistema relacionadas aos plugins são obrigatórias e também devem ser definidas:

- A Oracle Cloud Infrastructure utiliza extensamente os IDs do Oracle Cloud (OCIDs) para designar recursos, e vários parâmetros `keyring_oci` especificam os valores do OCID dos recursos a serem usados. Consequentemente, antes de usar o plugin `keyring_oci`, esses pré-requisitos devem ser atendidos:

  - Um usuário para a conexão com a Oracle Cloud Infrastructure deve existir. Crie o usuário, se necessário, e atribua o ID do usuário ao `keyring_oci_user` variável de sistema.

  - A entidade do Oracle Cloud Infrastructure a ser usada deve existir, assim como o compartimento MySQL dentro da entidade e o cofre dentro do compartimento. Crie esses recursos, se necessário, e certifique-se de que o usuário está habilitado a usá-los. Atribua os OCIDs para a entidade, o compartimento e o cofre às variáveis de sistema `keyring_oci_tenancy`, `keyring_oci_compartment` e `keyring_oci_virtual_vault`.

  - Um chave mestre para criptografia deve existir. Crie-a, se necessário, e atribua seu OCID à variável de sistema `keyring_oci_master_key`.

- Vários pontos de extremidade do servidor devem ser especificados. Esses pontos de extremidade são específicos do cofre e a Oracle Cloud Infrastructure os atribui no momento da criação do cofre. Obtenha seus valores na página de detalhes do cofre e atribua-os às variáveis de sistema `keyring_oci_encryption_endpoint`, `keyring_oci_management_endpoint`, `keyring_oci_vaults_endpoint` e `keyring_oci_secrets_endpoint`.

- A API da Oracle Cloud Infrastructure utiliza um par de chaves privadas/públicas RSA para autenticação. Para criar esse par de chaves e obter o rastro da chave, use as instruções em Chaves e OCIDs exigidas. Atribua o nome do arquivo da chave privada e o rastro da chave às variáveis de sistema `keyring_oci_key_file` e `keyring_oci_key_fingerprint`.

Além das variáveis de sistema obrigatórias, `keyring_oci_ca_certificate` pode ser opcionalmente definido para especificar um arquivo de pacote de certificado de autoridade de certificação (CA) para autenticação de pares. Em sistemas Windows, essa variável deve ser definida como `disabled`, ou para o caminho de um arquivo de pacote de certificado de CA.

Importante

Se você copiar um parâmetro do Console da Oracle Cloud Infrastructure, o valor copiado pode incluir uma parte inicial `https://`. Remova essa parte ao definir a variável de sistema `keyring_oci` correspondente.

Por exemplo, para carregar e configurar `keyring_oci`, use essas linhas no arquivo do servidor `my.cnf` (ajuste o sufixo `.so` e a localização do arquivo conforme necessário para sua plataforma):

```
[mysqld]
early-plugin-load=keyring_oci.so
keyring_oci_user=ocid1.user.oc1..longAlphaNumericString
keyring_oci_tenancy=ocid1.tenancy.oc1..longAlphaNumericString
keyring_oci_compartment=ocid1.compartment.oc1..longAlphaNumericString
keyring_oci_virtual_vault=ocid1.vault.oc1.iad.shortAlphaNumericString.longAlphaNumericString
keyring_oci_master_key=ocid1.key.oc1.iad.shortAlphaNumericString.longAlphaNumericString
keyring_oci_encryption_endpoint=shortAlphaNumericString-crypto.kms.us-ashburn-1.oraclecloud.com
keyring_oci_management_endpoint=shortAlphaNumericString-management.kms.us-ashburn-1.oraclecloud.com
keyring_oci_vaults_endpoint=vaults.us-ashburn-1.oci.oraclecloud.com
keyring_oci_secrets_endpoint=secrets.vaults.us-ashburn-1.oci.oraclecloud.com
keyring_oci_key_file=file_name
keyring_oci_key_fingerprint=12:34:56:78:90:ab:cd:ef:12:34:56:78:90:ab:cd:ef
```

Para obter informações adicionais sobre as variáveis de sistema específicas do plugin `keyring_oci`, consulte a Seção 8.4.4.19, “Variáveis do Sistema de Keychain”.

O plugin `keyring_oci` não suporta reconfiguração em tempo de execução e nenhuma de suas variáveis de sistema pode ser modificada em tempo de execução. Para alterar os parâmetros de configuração, faça o seguinte:

- Modifique as configurações dos parâmetros no arquivo `my.cnf`, ou use `SET PERSIST_ONLY` para parâmetros que são persistentes em `mysqld-auto.conf`.

- Reinicie o servidor.
