### 6.6.2 Uso e exemplos de criptografia da MySQL Enterprise

Para usar a Encriptação Empresarial do MySQL em aplicativos, invocando as funções apropriadas para as operações que você deseja realizar. Esta seção demonstra como realizar algumas tarefas representativas:

- Criar um par de chaves privada/pública usando criptografia RSA
- Use a chave privada para criptografar dados e a chave pública para descriptografá-los
- Gerar um resumo a partir de uma string
- Use o digest com um par de chaves
- Criar uma chave simétrica
- Limitar o uso da CPU por operações de geração de chaves

#### Crie um par de chaves privada/pública usando criptografia RSA

```sql
-- Encryption algorithm; can be 'DSA' or 'DH' instead
SET @algo = 'RSA';
-- Key length in bits; make larger for stronger keys
SET @key_len = 1024;

-- Create private key
SET @priv = create_asymmetric_priv_key(@algo, @key_len);
-- Derive corresponding public key from private key, using same algorithm
SET @pub = create_asymmetric_pub_key(@algo, @priv);
```

Agora você pode usar o par de chaves para criptografar e descriptografar dados, assinar e verificar dados ou gerar chaves simétricas.

#### Use a chave privada para criptografar os dados e a chave pública para descriptografá-los

Isso exige que os membros do par de chaves sejam chaves RSA.

```sql
SET @ciphertext = asymmetric_encrypt(@algo, 'My secret text', @priv);
SET @plaintext = asymmetric_decrypt(@algo, @ciphertext, @pub);
```

Por outro lado, você pode criptografar usando a chave pública e descriptografar usando a chave privada.

```sql
SET @ciphertext = asymmetric_encrypt(@algo, 'My secret text', @pub);
SET @plaintext = asymmetric_decrypt(@algo, @ciphertext, @priv);
```

Em qualquer caso, o algoritmo especificado para as funções de criptografia e descriptografia deve corresponder ao usado para gerar as chaves.

#### Gerar um resumo de uma string

```sql
-- Digest type; can be 'SHA256', 'SHA384', or 'SHA512' instead
SET @dig_type = 'SHA224';

-- Generate digest string
SET @dig = create_digest(@dig_type, 'My text to digest');
```

#### Use o digest com um par de chaves

O par de chaves pode ser usado para assinar dados e, em seguida, verificar se a assinatura corresponde ao digest.

```sql
-- Encryption algorithm; could be 'DSA' instead; keys must
-- have been created using same algorithm
SET @algo = 'RSA';

-- Generate signature for digest and verify signature against digest
SET @sig = asymmetric_sign(@algo, @dig, @priv, @dig_type);
-- Verify signature against digest
SET @verf = asymmetric_verify(@algo, @dig, @sig, @pub, @dig_type);
```

#### Crie uma chave simétrica

Isso requer chaves privadas/públicas DH como entradas, criadas usando um segredo simétrico compartilhado. Crie o segredo passando o comprimento da chave para `create_dh_parameters()`, depois passe o segredo como o “comprimento da chave” para `create_asymmetric_priv_key()`.

```sql
-- Generate DH shared symmetric secret
SET @dhp = create_dh_parameters(1024);
-- Generate DH key pairs
SET @algo = 'DH';
SET @priv1 = create_asymmetric_priv_key(@algo, @dhp);
SET @pub1 = create_asymmetric_pub_key(@algo, @priv1);
SET @priv2 = create_asymmetric_priv_key(@algo, @dhp);
SET @pub2 = create_asymmetric_pub_key(@algo, @priv2);

-- Generate symmetric key using public key of first party,
-- private key of second party
SET @sym1 = asymmetric_derive(@pub1, @priv2);

-- Or use public key of second party, private key of first party
SET @sym2 = asymmetric_derive(@pub2, @priv1);
```

Valores de cadeia chave podem ser criados em tempo de execução e armazenados em uma variável ou tabela usando `SET`, `SELECT` ou `INSERT`:

```sql
SET @priv1 = create_asymmetric_priv_key('RSA', 1024);
SELECT create_asymmetric_priv_key('RSA', 1024) INTO @priv2;
INSERT INTO t (key_col) VALUES(create_asymmetric_priv_key('RSA', 1024));
```

Os valores de cadeia de caracteres chave armazenados em arquivos podem ser lidos usando a função `LOAD_FILE()` por usuários que possuem o privilégio `FILE`.

As cadeias de digestão e assinatura podem ser manipuladas de maneira semelhante.

#### Limite o uso da CPU por operações de geração de chaves

As funções de criptografia `create_asymmetric_priv_key()` e `create_dh_parameters()` aceitam um parâmetro de comprimento de chave, e a quantidade de recursos de CPU necessários por essas funções aumenta à medida que o comprimento da chave aumenta. Para algumas instalações, isso pode resultar em um uso de CPU inaceitável se as aplicações gerarem frequentemente chaves excessivamente longas.

O OpenSSL impõe um comprimento mínimo de chave de 1.024 bits para todas as chaves. O OpenSSL também impõe um comprimento máximo de chave de 10.000 bits e 16.384 bits para as chaves DSA e RSA, respectivamente, para `create_asymmetric_priv_key()`, e um comprimento máximo de chave de 10.000 bits para `create_dh_parameters()`. Se esses valores máximos forem muito altos, três variáveis de ambiente estão disponíveis a partir do MySQL 5.7.17 para permitir que os administradores do servidor MySQL definam comprimentos máximos mais baixos para a geração de chaves, e assim limitar o uso da CPU:

- `MYSQL_OPENSSL_UDF_DSA_BITS_THRESHOLD`: Comprimento máximo da chave DSA em bits para `create_asymmetric_priv_key()`. Os valores mínimo e máximo para essa variável são 1.024 e 10.000.

- `MYSQL_OPENSSL_UDF_RSA_BITS_THRESHOLD`: Comprimento máximo da chave RSA em bits para `create_asymmetric_priv_key()`. Os valores mínimo e máximo para essa variável são 1.024 e 16.384.

- `MYSQL_OPENSSL_UDF_DH_BITS_THRESHOLD`: Comprimento máximo da chave em bits para `create_dh_parameters()`. Os valores mínimo e máximo para essa variável são 1.024 e 10.000.

Para usar qualquer uma dessas variáveis de ambiente, defina-as no ambiente do processo que inicia o servidor. Se definidas, seus valores têm precedência sobre as comprimentos máximos de chave impostos pelo OpenSSL. Por exemplo, para definir um comprimento máximo de chave de 4.096 bits para chaves DSA e RSA para `create_asymmetric_priv_key()`, defina essas variáveis:

```sql
export MYSQL_OPENSSL_UDF_DSA_BITS_THRESHOLD=4096
export MYSQL_OPENSSL_UDF_RSA_BITS_THRESHOLD=4096
```

O exemplo usa a sintaxe do shell Bourne. A sintaxe para outros shells pode ser diferente.
