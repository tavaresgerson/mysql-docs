#### 8.4.4.13 Tipos e comprimentos de chave de cartela de identificação suportados

O MySQL Keyring suporta chaves de diferentes tipos (algoritmos de criptografia) e comprimentos:

- Os tipos de chave disponíveis dependem do plugin de chaveira instalado.

- As comprimentos de chave permitidos estão sujeitos a vários fatores:

  - Limites gerais de interface de função carregável do cartela de chaves (para chaves gerenciadas usando uma das funções do cartela de chaves descritas na Seção 8.4.4.15, “Funções de Gerenciamento de Chaves do Cartela de Propósito Geral”), ou limites de implementações do back-end. Esses limites de comprimento podem variar de acordo com o tipo de operação da chave.

  - Além dos limites gerais, os plugins de chaveiros individuais podem impor restrições sobre o comprimento das chaves por tipo de chave.

A Tabela 8.32, “Limites Gerais de Comprimento de Chaves do Carteira”, mostra os limites gerais de comprimento de chave. (Os limites inferiores para `keyring_aws` são impostos pela interface do AWS KMS, e não pelas funções da carteira.) Para os plugins da carteira, a Tabela 8.33, “Tipos e Comprimentos de Chaves de Plugins da Carteira”, mostra os tipos de chave que cada plugin da carteira permite, bem como quaisquer restrições de comprimento de chave específicas do plugin. Para a maioria dos componentes da carteira, os limites gerais de comprimento de chave se aplicam e não há restrições de tipo de chave.

Nota

`component_keyring_oci` (como o plugin `keyring_oci`) só pode gerar chaves do tipo `AES` com um tamanho de 16, 24 ou 32 bytes.

**Tabela 8.32 Limites de comprimento de chave do Keychain Geral**

<table summary="Limites gerais para as comprimentos das chaves do chaveiro."><thead><tr> <th>Operação chave</th> <th>Comprimento máximo de chave</th> </tr></thead><tbody><tr> <td>Chave de acesso</td> <td><p class="valid-value">16.384 bytes (2.048 antes do MySQL 8.0.18); 1.024 para [[<code>keyring_aws</code>]]</p></td> </tr><tr> <td>Armazenar chave</td> <td><p class="valid-value">16.384 bytes (2.048 antes do MySQL 8.0.18); 4.096 para [[<code>keyring_aws</code>]]</p></td> </tr><tr> <td>Obter a chave</td> <td><p class="valid-value">16.384 bytes (2.048 antes do MySQL 8.0.18); 4.096 para [[<code>keyring_aws</code>]]</p></td> </tr></tbody></table>

**Tabela 8.33 Tipos e comprimentos de chaves do plug-in de cartela**

<table summary="Tipos e comprimentos principais suportados pelos plugins de chaveiro."><thead><tr> <th scope="col">Nome do Plugin</th> <th scope="col">Tipo de chave permitido</th> <th scope="col">Restrições de comprimento específicas de plugins</th> </tr></thead><tbody><tr> <th valign="top">[[PH_HTML_CODE_<code>DSA</code>]</th> <td><p class="valid-value"> [[PH_HTML_CODE_<code>DSA</code>] </p><p class="valid-value"> [[PH_HTML_CODE_<code>SECRET</code>] </p></td> <td><p class="valid-value">16, 24 ou 32 bytes</p><p class="valid-value">Nenhum</p></td> </tr><tr> <th valign="top">[[PH_HTML_CODE_<code>keyring_hashicorp</code>]</th> <td><p class="valid-value"> [[PH_HTML_CODE_<code>AES</code>] </p><p class="valid-value"> [[PH_HTML_CODE_<code>DSA</code>] </p><p class="valid-value"> [[PH_HTML_CODE_<code>RSA</code>] </p><p class="valid-value"> [[PH_HTML_CODE_<code>SECRET</code>] </p></td> <td><p class="valid-value">Nenhum</p><p class="valid-value">Nenhum</p><p class="valid-value">Nenhum</p><p class="valid-value">Nenhum</p></td> </tr><tr> <th valign="top">[[PH_HTML_CODE_<code>keyring_oci</code>]</th> <td><p class="valid-value"> [[PH_HTML_CODE_<code>AES</code>] </p><p class="valid-value"> [[<code>DSA</code>]] </p><p class="valid-value"> [[<code>AES</code><code>DSA</code>] </p><p class="valid-value"> [[<code>SECRET</code>]] </p></td> <td><p class="valid-value">Nenhum</p><p class="valid-value">Nenhum</p><p class="valid-value">Nenhum</p><p class="valid-value">Nenhum</p></td> </tr><tr> <th valign="top">[[<code>keyring_hashicorp</code>]]</th> <td><p class="valid-value"> [[<code>AES</code>]] </p><p class="valid-value"> [[<code>DSA</code>]] </p><p class="valid-value"> [[<code>RSA</code>]] </p><p class="valid-value"> [[<code>SECRET</code>]] </p></td> <td><p class="valid-value">Nenhum</p><p class="valid-value">Nenhum</p><p class="valid-value">Nenhum</p><p class="valid-value">Nenhum</p></td> </tr><tr> <th valign="top">[[<code>keyring_oci</code>]]</th> <td><p class="valid-value"> [[<code>AES</code>]] </p></td> <td><p class="valid-value">16, 24 ou 32 bytes</p></td> </tr><tr> <th valign="top">[[<code>SECRET</code><code>DSA</code>]</th> <td><p class="valid-value"> [[<code>SECRET</code><code>DSA</code>] </p><p class="valid-value"> [[<code>SECRET</code><code>SECRET</code>] </p></td> <td><p class="valid-value">16, 24 ou 32 bytes</p><p class="valid-value">Nenhum</p></td> </tr></tbody></table>

O tipo de chave `SECRET`, disponível a partir do MySQL 8.0.19, é destinado ao armazenamento geral de dados sensíveis usando o chaveiro MySQL e é suportado pela maioria dos componentes do chaveiro e dos plugins do chaveiro. O chaveiro criptografa e descriptografa os dados `SECRET` como um fluxo de bytes durante o armazenamento e a recuperação.

Exemplos de operações com chaveiros que envolvem o tipo de chave `SECRET`:

```
SELECT keyring_key_generate('MySecret1', 'SECRET', 20);
SELECT keyring_key_remove('MySecret1');

SELECT keyring_key_store('MySecret2', 'SECRET', 'MySecretData');
SELECT keyring_key_fetch('MySecret2');
SELECT keyring_key_length_fetch('MySecret2');
SELECT keyring_key_type_fetch('MySecret2');
SELECT keyring_key_remove('MySecret2');
```
