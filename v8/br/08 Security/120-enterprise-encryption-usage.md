### 8.6.3 Uso e Exemplos de Criptografia Empresarial do MySQL

Para usar a Criptografia Empresarial do MySQL em aplicações, invocando as funções apropriadas para as operações que deseja realizar. Esta seção demonstra como realizar algumas tarefas representativas.

As funções de Criptografia Empresarial do MySQL são fornecidas por um componente do MySQL `component_enterprise_encryption`. Para obter informações sobre essas funções, consulte a Seção 8.6.4, “Referência de Funções de Criptografia Empresarial do MySQL”.

As seguintes considerações gerais se aplicam ao escolher comprimentos de chave e algoritmos de criptografia:

* A força da criptografia para chaves privadas e públicas aumenta com o tamanho da chave, mas o tempo de geração da chave também aumenta.
* As funções do componente suportam apenas chaves RSA.
* As funções de criptografia assimétrica consomem mais recursos em comparação com as funções simétricas. Elas são adequadas para criptografar pequenas quantidades de dados e criar e verificar assinaturas. Para criptografar grandes quantidades de dados, as funções de criptografia simétrica são mais rápidas. O MySQL Server fornece as funções `AES_ENCRYPT()` e `AES_DECRYPT()` para criptografia simétrica.

Os valores de strings de chave podem ser criados em tempo de execução e armazenados em uma variável ou tabela usando `SET`, `SELECT` ou `INSERT`, como mostrado aqui:

```
SET @priv1 = create_asymmetric_priv_key('RSA', 2048);
SELECT create_asymmetric_priv_key('RSA', 2048) INTO @priv2;
INSERT INTO t (key_col) VALUES(create_asymmetric_priv_key('RSA', 1024));
```

Os valores de strings de chave armazenados em arquivos podem ser lidos usando a função `LOAD_FILE()` por usuários que têm o privilégio `FILE`. Strings de digestas e assinaturas podem ser manipuladas de maneira semelhante.

* Crie um par de chave privada/pública
* Use a chave pública para criptografar dados e a chave privada para descriptografá-los
* Gerencie uma digest com uma string
* Use a digest com um par de chaves

#### Crie um par de chave privada/pública

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

#### Use a chave pública para criptografar dados e a chave privada para descriptografá-los


Este exemplo funciona tanto com as funções componentes quanto com as funções legadas. Em ambos os casos, os membros do par de chaves devem ser chaves RSA:

```
SET @ciphertext = asymmetric_encrypt(@algo, 'My secret text', @pub);
SET @plaintext = asymmetric_decrypt(@algo, @ciphertext, @priv);
```

#### Gerar um digest a partir de uma string

Este exemplo funciona tanto com as funções componentes quanto com as funções legadas:

```
-- Digest type
SET @dig_type = 'SHA512';

-- Generate digest string
SET @dig = create_digest(@dig_type, 'My text to digest');
```

#### Usar o digest com um par de chaves

O par de chaves pode ser usado para assinar dados e, em seguida, verificar se a assinatura corresponde ao digest. Este exemplo funciona tanto com as funções componentes quanto com as funções legadas:

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

Para as funções legadas, as assinaturas requerem um digest. Para as funções componentes, as assinaturas não requerem um digest e podem usar qualquer string de dados. O tipo de digest nessas funções refere-se ao algoritmo que é usado para assinar os dados, não ao algoritmo que foi usado para criar a entrada original para a assinatura. Este exemplo é para as funções componentes:

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