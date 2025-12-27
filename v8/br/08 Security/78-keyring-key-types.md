#### 8.4.4.10 Tipos e comprimentos de chaves de cartela de segurança suportados

O cartela de segurança do MySQL suporta chaves de diferentes tipos (algoritmos de criptografia) e comprimentos:

* Os tipos de chaves disponíveis dependem do plugin de cartela de segurança instalado.
* Os comprimentos de chave permitidos estão sujeitos a vários fatores:

  + Limites da interface de função carregável geral da cartela de segurança (para chaves gerenciadas usando uma das funções de cartela de segurança descritas na Seção 8.4.4.12, “Funções de Gerenciamento de Chaves de Cartela de Segurança de Propósito Geral”), ou limites das implementações do back-end. Esses limites de comprimento podem variar de acordo com o tipo de operação da chave.
  + Além dos limites gerais, plugins de cartela de segurança individuais podem impor restrições sobre os comprimentos de chave por tipo de chave.

 A Tabela 8.31, “Limites de Comprimento de Chaves de Cartela de Segurança Geral”, mostra os limites gerais de comprimento de chave. (Os limites inferiores para `keyring_aws` são impostos pela interface AWS KMS, não pelas funções de cartela de segurança.) Para plugins de cartela de segurança, a Tabela 8.32, “Tipos e Comprimentos de Chaves de Plugins de Cartela de Segurança”, mostra os tipos de chave que cada plugin de cartela de segurança permite, bem como quaisquer restrições de comprimento de chave específicas do plugin. Para a maioria dos componentes de cartela de segurança, os limites gerais de comprimento de chave se aplicam e não há restrições de tipo de chave.

::: info Nota

`component_keyring_oci` pode gerar chaves do tipo `AES` com um tamanho de 16, 24 ou 32 bytes apenas.

:::

**Tabela 8.31 Limites de Comprimento de Chaves de Cartela de Segurança Geral**

<table><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Operação da Chave</th> <th>Comprimento Máximo da Chave</th> </tr></thead><tbody><tr> <td>Gerar chave</td> <td><p class="valid-value"> 16,384 bytes (2,048 anteriormente); 1,024 para <code>keyring_aws</code> </p></td> </tr><tr> <td>Armazenar chave</td> <td><p class="valid-value"> 16,384 bytes (2,048 anteriormente); 4,096 para <code>keyring_aws</code> </p></td> </tr><tr> <td>Recuperar chave</td> <td><p class="valid-value"> 16,384 bytes (2,048 anteriormente); 4,096 para <code>keyring_aws</code> </p></td> </tr></tbody></table>

**Tabela 8.32 Tipos e Comprimentos de Chaves de Plugins de Cartela de Segurança**

<table><col style="width: 30%"/><col style="width: 25%"/><col style="width: 45%"/><thead><tr> <th>Nome do Plugin</th> <th>Tipo de Chave Permitido</th> <th>Restrições de Comprimento Específicas do Plugin</th> </tr></thead><tbody><tr> <th valign="top"><code>keyring_aws</code></th> <td><p class="valid-value"> <code>AES</code> </p><p class="valid-value"> <code>SECRET</code> </p></td> <td><p class="valid-value"> 16, 24 ou 32 bytes </p><p class="valid-value"> Nenhum </p></td> </tr><tr> <th valign="top"><code>keyring_hashicorp</code></th> <td><p class="valid-value"> <code>AES</code> </p><p class="valid-value"> <code>DSA</code> </p><p class="valid-value"> <code>RSA</code> </p><p class="valid-value"> <code>SECRET</code> </p></td> <td><p class="valid-value"> Nenhum </p><p class="valid-value"> Nenhum </p><p class="valid-value"> Nenhum </p><p class="valid-value"> Nenhum </p></td> </tr><tr> <th valign="top"><code>keyring_okv</code></th> <td><p class="valid-value"> <code>AES</code> </p><p class="valid-value"> <code>SECRET</code> </p></td> <td><p class="valid-value"> 16, 24 ou 32 bytes </p><p class="valid-value"> Nenhum </p></td> </tr></tbody></table>

O tipo de chave `SECRET` é destinado ao armazenamento geral de dados sensíveis usando o bloco de chaves MySQL, e é suportado pela maioria dos componentes do bloco de chaves e dos plugins do bloco de chaves. O bloco de chaves criptografa e descriptografa os dados `SECRET` como um fluxo de bytes ao armazená-los e recuperá-los.

Exemplos de operações do bloco de chaves envolvendo o tipo de chave `SECRET`:

```
SELECT keyring_key_generate('MySecret1', 'SECRET', 20);
SELECT keyring_key_remove('MySecret1');

SELECT keyring_key_store('MySecret2', 'SECRET', 'MySecretData');
SELECT keyring_key_fetch('MySecret2');
SELECT keyring_key_length_fetch('MySecret2');
SELECT keyring_key_type_fetch('MySecret2');
SELECT keyring_key_remove('MySecret2');
```