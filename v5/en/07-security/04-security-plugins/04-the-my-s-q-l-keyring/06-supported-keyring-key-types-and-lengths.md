#### 6.4.4.6 Tipos e Comprimentos de Keyring Key Suportados

O MySQL Keyring suporta Keys de diferentes tipos (algoritmos de criptografia) e comprimentos:

* Os tipos de Key disponíveis dependem de qual Keyring Plugin está instalado.

* Os comprimentos de Key permitidos estão sujeitos a múltiplos fatores:

  + Limites gerais da interface de função carregável do Keyring (para Keys gerenciadas usando uma das funções do Keyring descritas na [Seção 6.4.4.8, “General-Purpose Keyring Key-Management Functions”](keyring-functions-general-purpose.html "6.4.4.8 General-Purpose Keyring Key-Management Functions")), ou limites das implementações de back end. Estes limites de comprimento podem variar conforme o tipo de operação da Key.

  + Além dos limites gerais, Keyring Plugins individuais podem impor restrições sobre os comprimentos de Key por tipo de Key.

A [Tabela 6.23, “General Keyring Key Length Limits”](keyring-key-types.html#keyring-general-key-length-limits-table "Table 6.23 General Keyring Key Length Limits") mostra os limites gerais de comprimento de Key. (Os limites inferiores para `keyring_aws` são impostos pela interface AWS KMS, e não pelas funções do Keyring.) A [Tabela 6.24, “Keyring Plugin Key Types and Lengths”](keyring-key-types.html#keyring-key-types-table "Table 6.24 Keyring Plugin Key Types and Lengths") mostra os tipos de Key que cada Keyring Plugin permite, bem como quaisquer restrições de comprimento de Key específicas do Plugin.

**Tabela 6.23 Limites Gerais de Comprimento de Key do Keyring**

<table summary="Limites gerais sobre os comprimentos de Key do Keyring."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Operação da Key</th> <th>Comprimento Máximo da Key</th> </tr></thead><tbody><tr> <td>Gerar Key</td> <td><p> 2.048 bytes; 1.024 para <code>keyring_aws</code> </p></td> </tr><tr> <td>Armazenar Key</td> <td><p> 2.048 bytes </p></td> </tr><tr> <td>Buscar Key</td> <td><p> 2.048 bytes </p></td> </tr> </tbody></table>

**Tabela 6.24 Tipos e Comprimentos de Key do Keyring Plugin**

<table summary="Tipos e comprimentos de Key suportados por Keyring Plugins."><col style="width: 30%"/><col style="width: 25%"/><col style="width: 45%"/><thead><tr> <th>Nome do Plugin</th> <th>Tipo de Key Permitido</th> <th>Restrições de Comprimento Específicas do Plugin</th> </tr></thead><tbody><tr> <th valign="top"><code>keyring_aws</code></th> <td><p> <code>AES</code> </p></td> <td><p> 16, 24, ou 32 bytes </p></td> </tr><tr> <th valign="top"><code>keyring_encrypted_file</code></th> <td><p> <code>AES</code> </p><p> <code>DSA</code> </p><p> <code>RSA</code> </p></td> <td><p> Nenhuma </p><p> Nenhuma </p><p> Nenhuma </p></td> </tr><tr> <th valign="top"><code>keyring_file</code></th> <td><p> <code>AES</code> </p><p> <code>DSA</code> </p><p> <code>RSA</code> </p></td> <td><p> Nenhuma </p><p> Nenhuma </p><p> Nenhuma </p></td> </tr><tr> <th valign="top"><code>keyring_okv</code></th> <td><p> <code>AES</code> </p></td> <td><p> 16, 24, ou 32 bytes </p></td> </tr> </tbody></table>