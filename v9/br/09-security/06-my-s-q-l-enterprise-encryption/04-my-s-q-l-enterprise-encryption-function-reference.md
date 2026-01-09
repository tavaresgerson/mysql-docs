### 8.6.4 Referência das Funções de Criptografia do MySQL Enterprise

As funções de criptografia do MySQL Enterprise são fornecidas pelo componente `component_enterprise_encryption` do MySQL. Consulte a Seção 8.6.5, “Descrição das Funções do Componente de Criptografia do MySQL Enterprise”.

**Tabela 8.49 Funções de Criptografia do MySQL Enterprise**

<table frame="box" rules="all" summary="Uma referência que lista as funções de criptografia da MySQL Enterprise.">
<col style="width: 28%"/><col style="width: 71%"/>
<thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>asymmetric_decrypt()</code></td> <td> Decriptografar texto cifrado usando chave privada ou pública </td> </tr><tr><td><code>asymmetric_derive()</code></td> <td> Derivar chave simétrica a partir de chaves assimétricas </td> </tr><tr><td><code>asymmetric_encrypt()</code></td> <td> Criptografar texto claro usando chave privada ou pública </td> </tr><tr><td><code>asymmetric_sign()</code></td> <td> Gerar assinatura a partir do digest </td> </tr><tr><td><code>asymmetric_verify()</code></td> <td> Verificar se a assinatura corresponde ao digest </td> </tr><tr><td><code>create_asymmetric_priv_key()</code></td> <td> Criar chave privada </td> </tr><tr><td><code>create_asymmetric_pub_key()</code></td> <td> Criar chave pública </td> </tr><tr><td><code>create_dh_parameters()</code></td> <td> Gerar segredo compartilhado DH </td> </tr><tr><td><code>create_digest()</code></td> <td> Gerar digest a partir de uma string </td> </tr></tbody></table>