#### 8.4.5.13 Tipos e comprimentos de chaves do carteiro de chaves suportado

O carteiro de chaves do MySQL suporta chaves de diferentes tipos (algoritmos de criptografia) e comprimentos:

* Os tipos de chaves disponíveis dependem do plugin de carteiro de chaves instalado.

* Os comprimentos de chave permitidos estão sujeitos a vários fatores:

  + Limites da interface de função carregável do carteiro geral (para chaves gerenciadas usando uma das funções de carteiro descritas na Seção 8.4.5.15, “Funções de gerenciamento de chaves de carteiro de propósito geral”), ou limites das implementações do back-end. Esses limites de comprimento podem variar de acordo com o tipo de operação da chave.

  + Além dos limites gerais, plugins de carteiro de chaves individuais podem impor restrições sobre os comprimentos de chave por tipo de chave.

A Tabela 8.32, “Limites de comprimento de chave do carteiro geral”, mostra os limites gerais de comprimento de chave. (Os limites inferiores para `keyring_aws` são impostos pela interface AWS KMS, não pelas funções de carteiro de chaves.) Para plugins de carteiro de chaves, a Tabela 8.33, “Tipos e comprimentos de chaves de plugins de carteiro de chaves”, mostra os tipos de chaves que cada plugin de carteiro de chaves permite, bem como quaisquer restrições de comprimento de chave específicas do plugin. Para a maioria dos componentes de carteiro de chaves, os limites gerais de comprimento de chave se aplicam e não há restrições de tipo de chave.

Nota

`component_keyring_oci` pode gerar chaves do tipo `AES` com um tamanho de 16, 24 ou 32 bytes apenas.

**Tabela 8.32 Limites de comprimento de chave do carteiro geral**

<table summary="Limites gerais para as comprimentos de chaves do bloco de anotações."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Operação da chave</th> <th>Comprimento máximo da chave</th> </tr></thead><tbody><tr> <td>Gerar chave</td> <td><p class="valid-value"> 16.384 bytes (2.048 anteriormente); 1.024 para <code class="literal">keyring_aws</code> </p></td> </tr><tr> <td>Armazenar chave</td> <td><p class="valid-value"> 16.384 bytes (2.048 anteriormente); 4.096 para <code class="literal">keyring_aws</code> </p></td> </tr><tr> <td>Recuperar chave</td> <td><p class="valid-value"> 16.384 bytes (2.048 anteriormente); 4.096 para <code class="literal">keyring_aws</code> </p></td> </tr></tbody></table>

**Tabela 8.33 Tipos e comprimentos de chaves do plugin do bloco de anotações**

<table summary="Tipos e comprimentos de chaves suportados por plugins de chaveira."><col style="width: 30%"/><col style="width: 25%"/><col style="width: 45%"/><thead><tr> <th scope="col">Nome do Plugin</th> <th scope="col">Tipo de Chave Permitido</th> <th scope="col">Restrições de Comprimento Específicas do Plugin</th> </tr></thead><tbody><tr> <th scope="row" valign="top"><code class="literal">keyring_aws</code></th> <td><p class="valid-value"> <code class="literal">AES</code> </p><p class="valid-value"> <code class="literal">SECRET</code> </p></td> <td><p class="valid-value"> 16, 24 ou 32 bytes </p><p class="valid-value"> Nenhum </p></td> </tr><tr> <th scope="row" valign="top"><code class="literal">keyring_hashicorp</code></th> <td><p class="valid-value"> <code class="literal">AES</code> </p><p class="valid-value"> <code class="literal">DSA</code> </p><p class="valid-value"> <code class="literal">RSA</code> </p><p class="valid-value"> <code class="literal">SECRET</code> </p></td> <td><p class="valid-value"> Nenhum </p><p class="valid-value"> Nenhum </p><p class="valid-value"> Nenhum </p><p class="valid-value"> Nenhum </p></td> </tr><tr> <th scope="row" valign="top"><code class="literal">keyring_okv</code></th> <td><p class="valid-value"> <code class="literal">AES</code> </p><p class="valid-value"> <code class="literal">SECRET</code> </p></td> <td><p class="valid-value"> 16, 24 ou 32 bytes </p><p class="valid-value"> Nenhum </p></td> </tr></tbody></table>

O tipo de chave `SECRET` é destinado ao armazenamento de dados sensíveis de uso geral usando a chaveira MySQL e é suportado pela maioria dos componentes da chaveira e plugins da chaveira. A chaveira criptografa e descriptografa os dados `SECRET` como um fluxo de bytes ao armazenar e recuperar.

Exemplos de operações da chaveira envolvendo o tipo de chave `SECRET`:

```
SELECT keyring_key_generate('MySecret1', 'SECRET', 20);
SELECT keyring_key_remove('MySecret1');

SELECT keyring_key_store('MySecret2', 'SECRET', 'MySecretData');
SELECT keyring_key_fetch('MySecret2');
SELECT keyring_key_length_fetch('MySecret2');
SELECT keyring_key_type_fetch('MySecret2');
SELECT keyring_key_remove('MySecret2');
```