### 8.6.3 Uso e exemplos de criptografia da MySQL Enterprise

Para usar a Encriptação Empresarial do MySQL em aplicativos, invocando as funções apropriadas para as operações que você deseja realizar. Esta seção demonstra como realizar algumas tarefas representativas.

Em versões anteriores ao MySQL 8.0.30, as funções da Encriptação do MySQL Enterprise são baseadas na biblioteca compartilhada `openssl_udf`. A partir do MySQL 8.0.30, as funções são fornecidas por um componente do MySQL `component_enterprise_encryption`. Em alguns casos, o comportamento das funções do componente difere do comportamento das funções legadas fornecidas pelo `openssl_udf`. Para uma lista das diferenças, consulte Atualizando a Encriptação do MySQL Enterprise. Para obter detalhes completos sobre o comportamento de cada função do componente, consulte a Seção 8.6.4, “Referência de Funções da Encriptação do MySQL Enterprise”.

Se você instalar as funções legadas e depois atualizar para o MySQL 8.0.30 ou uma versão posterior, as funções que você criou continuarão disponíveis, serão suportadas e continuarão a funcionar da mesma maneira. No entanto, elas serão descontinuadas a partir do MySQL 8.0.30, e é recomendável que você instale o componente de criptografia do MySQL Enterprise `component_enterprise_encryption`. Para obter instruções sobre a atualização, consulte Instalação a partir do MySQL 8.0.30.

As seguintes considerações gerais se aplicam ao escolher comprimentos de chave e algoritmos de criptografia:

- A força da criptografia para chaves privadas e públicas aumenta com o tamanho da chave, mas o tempo para a geração da chave também aumenta.

- Para as funções de legado, a geração de chaves DH leva muito mais tempo do que as chaves RSA ou DSA. As funções de componente a partir do MySQL 8.0.30 só suportam chaves RSA.

- As funções de criptografia assimétricas consomem mais recursos em comparação com as funções simétricas. Elas são adequadas para criptografar pequenas quantidades de dados e para criar e verificar assinaturas. Para criptografar grandes quantidades de dados, as funções de criptografia simétricas são mais rápidas. O MySQL Server fornece as funções `AES_ENCRYPT()` e `AES_DECRYPT()` para criptografia simétrica.

Valores de cadeia chave podem ser criados em tempo de execução e armazenados em uma variável ou tabela usando `SET`, `SELECT` ou `INSERT`. Este exemplo funciona tanto com a função de componente quanto com a função legada:

```
SET @priv1 = create_asymmetric_priv_key('RSA', 2048);
SELECT create_asymmetric_priv_key('RSA', 2048) INTO @priv2;
INSERT INTO t (key_col) VALUES(create_asymmetric_priv_key('RSA', 1024));
```

Os valores de cadeia de chave armazenados em arquivos podem ser lidos usando a função `LOAD_FILE()` por usuários que possuem o privilégio `FILE`. Strings de digestão e assinatura podem ser manipuladas de maneira semelhante.

- Crie um par de chave pública/privada
- Use a chave pública para criptografar os dados e a chave privada para descriptografá-los
- Gerar um resumo de uma string
- Use o digest com um par de chaves

#### Crie um par de chave pública/privada

Este exemplo funciona tanto com as funções do componente quanto com as funções legadas:

```
-- Encryption algorithm
SET @algo = 'RSA';
-- Key length in bits; make larger for stronger keys
SET @key_len = 2048;

-- Create private key
SET @priv = create_asymmetric_priv_key(@algo, @key_len);
-- Derive corresponding public key from private key, using same algorithm
SET @pub = create_asymmetric_pub_key(@algo, @priv);
```

Você pode usar o par de chaves para criptografar e descriptografar dados ou para assinar e verificar dados.

#### Use a chave pública para criptografar os dados e a chave privada para descriptografá-los

Este exemplo funciona tanto com as funções de componente quanto com as funções legadas. Em ambos os casos, os membros do par de chaves devem ser chaves RSA:

```
SET @ciphertext = asymmetric_encrypt(@algo, 'My secret text', @pub);
SET @plaintext = asymmetric_decrypt(@algo, @ciphertext, @priv);
```

#### Gerar um resumo de uma string

Este exemplo funciona tanto com as funções do componente quanto com as funções legadas:

```
-- Digest type
SET @dig_type = 'SHA512';

-- Generate digest string
SET @dig = create_digest(@dig_type, 'My text to digest');
```

#### Use o digest com um par de chaves

O par de chaves pode ser usado para assinar dados e, em seguida, verificar se a assinatura corresponde ao digest. Este exemplo funciona tanto com as funções de componente quanto com as funções legadas:

```
-- Encryption algorithm; keys must
-- have been created using same algorithm
SET @algo = 'RSA';
–- Digest algorithm to sign the data
SET @dig_type = 'SHA512';

-- Generate signature for digest and verify signature against digest
SET @sig = asymmetric_sign(@algo, @dig, @priv, @dig_type);
-- Verify signature against digest
SET @verf = asymmetric_verify(@algo, @dig, @sig, @pub, @dig_type);
```

Para as funções de legado, as assinaturas exigem um digest. Para as funções de componente, as assinaturas não exigem um digest e podem usar qualquer string de dados. O tipo de digest nessas funções refere-se ao algoritmo que é usado para assinar os dados, não ao algoritmo que foi usado para criar a entrada original para a assinatura. Este exemplo é para as funções de componente:

```
-- Encryption algorithm; keys must
-- have been created using same algorithm
SET @algo = 'RSA';
–- Arbitrary text string for signature
SET @text = repeat('j', 256);
–- Digest algorithm to sign the data
SET @dig_type = 'SHA512';

-- Generate signature for digest and verify signature against digest
SET @sig = asymmetric_sign(@algo, @text, @priv, @dig_type);
-- Verify signature against digest
SET @verf = asymmetric_verify(@algo, @text, @sig, @pub, @dig_type);
```
