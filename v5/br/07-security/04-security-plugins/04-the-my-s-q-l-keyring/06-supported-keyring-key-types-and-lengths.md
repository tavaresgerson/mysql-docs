#### 6.4.4.6 Tipos e comprimentos de chave de cartela de identificação suportados

O MySQL Keyring suporta chaves de diferentes tipos (algoritmos de criptografia) e comprimentos:

- Os tipos de chave disponíveis dependem do plugin de chaveira instalado.

- As comprimentos de chave permitidos estão sujeitos a vários fatores:

  - Limites de carga de interface de função geral do cartela de chaves (para chaves gerenciadas usando uma das funções do cartela de chaves descritas em Seção 6.4.4.8, “Funções de Gerenciamento de Chaves do Cartela de Propósito Geral”), ou limites de implementação do back-end. Esses limites de comprimento podem variar de acordo com o tipo de operação da chave.

  - Além dos limites gerais, os plugins de chaveiros individuais podem impor restrições sobre o comprimento das chaves por tipo de chave.

A Tabela 6.23, “Limites Gerais de Comprimento de Chaves do Keyring” (keyring-key-types.html#keyring-general-key-length-limits-table) mostra os limites gerais de comprimento de chave. (Os limites inferiores para `keyring_aws` são impostos pela interface do AWS KMS, e não pelas funções do keyring.) A Tabela 6.24, “Tipos e Comprimentos de Chaves de Plugin do Keyring” (keyring-key-types.html#keyring-key-types-table) mostra os tipos de chave que cada plugin do keyring permite, bem como quaisquer restrições de comprimento de chave específicas do plugin.

**Tabela 6.23 Limites de comprimento de chave do Keychain Geral**

<table summary="Limites gerais para as comprimentos das chaves do chaveiro."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Operação chave</th> <th>Comprimento máximo de chave</th> </tr></thead><tbody><tr> <td>Chave de acesso</td> <td><p>2.048 bytes; 1.024 para <code>keyring_aws</code></p></td> </tr><tr> <td>Armazenar chave</td> <td><p>2.048 bytes</p></td> </tr><tr> <td>Obter a chave</td> <td><p>2.048 bytes</p></td> </tr></tbody></table>

**Tabela 6.24 Tipos e comprimentos de chaves do plug-in do cartela**

<table summary="Tipos e comprimentos principais suportados pelos plugins de chaveiro.">
  <thead>
    <tr>
      <th>Nome do plug-in</th>
      <th>Tipo de chave permitido</th>
      <th>Restrições de comprimento específicas do plug-in</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th valign="top"><code>keyring_aws</code></th>
      <td>
        <p> <code>AES</code> </p>
      </td>
      <td>
        <p> 16, 24, or 32 bytes </p>
      </td>
    </tr>
    <tr>
      <th valign="top"><code>keyring_encrypted_file</code></th>
      <td>
        <p> <code>AES</code> </p>
        <p> <code>DSA</code> </p>
        <p> <code>RSA</code> </p>
      </td>
      <td>
        <p> None </p>
        <p> None </p>
        <p> None </p>
      </td>
    </tr>
    <tr>
      <th valign="top"><code>keyring_file</code></th>
      <td>
        <p> <code>AES</code> </p>
        <p> <code>DSA</code> </p>
        <p> <code>RSA</code> </p>
      </td>
      <td>
        <p> None </p>
        <p> None </p>
        <p> None </p>
      </td>
    </tr>
    <tr>
      <th valign="top"><code>keyring_okv</code></th>
      <td>
        <p> <code>AES</code> </p>
      </td>
      <td>
        <p> 16, 24, or 32 bytes </p>
      </td>
    </tr>
  </tbody>
</table>
