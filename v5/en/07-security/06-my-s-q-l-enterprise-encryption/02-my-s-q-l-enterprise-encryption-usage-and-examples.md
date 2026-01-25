### 6.6.2 Uso e Exemplos de MySQL Enterprise Encryption

Para usar o MySQL Enterprise Encryption em aplicações, invoque as funções apropriadas para as operações que você deseja realizar. Esta seção demonstra como executar algumas tarefas representativas:

* [Criação de um par de chaves privada/pública usando criptografia RSA](enterprise-encryption-usage.html#enterprise-encryption-usage-create-key-pair "Criação de um par de chaves privada/pública usando criptografia RSA")
* [Uso da chave privada para criptografar dados e da chave pública para descriptografá-los](enterprise-encryption-usage.html#enterprise-encryption-usage-encrypt-decrypt "Uso da chave privada para criptografar dados e da chave pública para descriptografá-los")
* [Geração de um digest a partir de uma string](enterprise-encryption-usage.html#enterprise-encryption-usage-create-digest "Geração de um digest a partir de uma string")
* [Uso do digest com um par de chaves](enterprise-encryption-usage.html#enterprise-encryption-usage-digital-signing "Uso do digest com um par de chaves")
* [Criação de uma chave simétrica](enterprise-encryption-usage.html#enterprise-encryption-usage-create-symmetic-key "Criação de uma chave simétrica")
* [Limitação do uso de CPU por operações de geração de chaves](enterprise-encryption-usage.html#enterprise-encryption-usage-limit-cpu "Limitação do uso de CPU por operações de geração de chaves")

#### Criação de um par de chaves privada/pública usando criptografia RSA

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

Agora você pode usar o par de chaves para criptografar e descriptografar dados, assinar e verificar dados, ou gerar chaves simétricas.

#### Uso da chave privada para criptografar dados e da chave pública para descriptografá-los

Isso exige que os membros do par de chaves sejam chaves RSA.

```sql
SET @ciphertext = asymmetric_encrypt(@algo, 'My secret text', @priv);
SET @plaintext = asymmetric_decrypt(@algo, @ciphertext, @pub);
```

Inversamente, você pode criptografar usando a chave pública e descriptografar usando a chave privada.

```sql
SET @ciphertext = asymmetric_encrypt(@algo, 'My secret text', @pub);
SET @plaintext = asymmetric_decrypt(@algo, @ciphertext, @priv);
```

Em ambos os casos, o algoritmo especificado para as funções de criptografia e descriptografia deve coincidir com o usado para gerar as chaves.

#### Geração de um digest a partir de uma string

```sql
-- Digest type; can be 'SHA256', 'SHA384', or 'SHA512' instead
SET @dig_type = 'SHA224';

-- Generate digest string
SET @dig = create_digest(@dig_type, 'My text to digest');
```

#### Uso do digest com um par de chaves

O par de chaves pode ser usado para assinar dados e, em seguida, verificar se a signature (assinatura) corresponde ao digest.

```sql
-- Encryption algorithm; could be 'DSA' instead; keys must
-- have been created using same algorithm
SET @algo = 'RSA';

-- Generate signature for digest and verify signature against digest
SET @sig = asymmetric_sign(@algo, @dig, @priv, @dig_type);
-- Verify signature against digest
SET @verf = asymmetric_verify(@algo, @dig, @sig, @pub, @dig_type);
```

#### Criação de uma chave simétrica

Isso requer chaves privadas/públicas DH como entradas, criadas usando um segredo simétrico compartilhado. Crie o segredo passando o comprimento da chave (key length) para [`create_dh_parameters()`](enterprise-encryption-functions.html#function_create-dh-parameters) e, em seguida, passe o segredo como o "comprimento da chave" para [`create_asymmetric_priv_key()`](enterprise-encryption-functions.html#function_create-asymmetric-priv-key).

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

Valores de string de chave podem ser criados em tempo de execução e armazenados em uma variável ou tabela usando [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment"), [`SELECT`](select.html "13.2.9 SELECT Statement") ou [`INSERT`](insert.html "13.2.5 INSERT Statement"):

```sql
SET @priv1 = create_asymmetric_priv_key('RSA', 1024);
SELECT create_asymmetric_priv_key('RSA', 1024) INTO @priv2;
INSERT INTO t (key_col) VALUES(create_asymmetric_priv_key('RSA', 1024));
```

Valores de string de chave armazenados em arquivos podem ser lidos usando a função [`LOAD_FILE()`](string-functions.html#function_load-file) por usuários que possuem o privilégio [`FILE`](privileges-provided.html#priv_file).

Strings de digest e signature podem ser tratadas de forma semelhante.

#### Limitação do uso de CPU por operações de geração de chaves

As funções de criptografia [`create_asymmetric_priv_key()`](enterprise-encryption-functions.html#function_create-asymmetric-priv-key) e [`create_dh_parameters()`](enterprise-encryption-functions.html#function_create-dh-parameters) aceitam um parâmetro de comprimento de chave (key length), e a quantidade de recursos de CPU exigidos por essas funções aumenta à medida que o comprimento da chave aumenta. Para algumas instalações, isso pode resultar em uso inaceitável de CPU se as aplicações gerarem chaves excessivamente longas com frequência.

O OpenSSL impõe um comprimento mínimo de chave de 1.024 bits para todas as chaves. O OpenSSL também impõe um comprimento máximo de chave de 10.000 bits e 16.384 bits para chaves DSA e RSA, respectivamente, para [`create_asymmetric_priv_key()`](enterprise-encryption-functions.html#function_create-asymmetric-priv-key), e um comprimento máximo de chave de 10.000 bits para [`create_dh_parameters()`](enterprise-encryption-functions.html#function_create-dh-parameters). Se esses valores máximos forem muito altos, três variáveis de ambiente estão disponíveis a partir do MySQL 5.7.17 para permitir que administradores do servidor MySQL definam comprimentos máximos menores para a geração de chaves e, assim, limitem o uso de CPU:

* `MYSQL_OPENSSL_UDF_DSA_BITS_THRESHOLD`: Comprimento máximo de chave DSA em bits para [`create_asymmetric_priv_key()`](enterprise-encryption-functions.html#function_create-asymmetric-priv-key). Os valores mínimo e máximo para esta variável são 1.024 e 10.000.

* `MYSQL_OPENSSL_UDF_RSA_BITS_THRESHOLD`: Comprimento máximo de chave RSA em bits para [`create_asymmetric_priv_key()`](enterprise-encryption-functions.html#function_create-asymmetric-priv-key). Os valores mínimo e máximo para esta variável são 1.024 e 16.384.

* `MYSQL_OPENSSL_UDF_DH_BITS_THRESHOLD`: Comprimento máximo de chave em bits para [`create_dh_parameters()`](enterprise-encryption-functions.html#function_create-dh-parameters). Os valores mínimo e máximo para esta variável são 1.024 e 10.000.

Para usar qualquer uma dessas variáveis de ambiente, defina-as no ambiente do processo que inicia o servidor. Se definidos, seus valores têm precedência sobre os comprimentos máximos de chave impostos pelo OpenSSL. Por exemplo, para definir um comprimento máximo de chave de 4.096 bits para chaves DSA e RSA para [`create_asymmetric_priv_key()`](enterprise-encryption-functions.html#function_create-asymmetric-priv-key), defina estas variáveis:

```sql
export MYSQL_OPENSSL_UDF_DSA_BITS_THRESHOLD=4096
export MYSQL_OPENSSL_UDF_RSA_BITS_THRESHOLD=4096
```

O exemplo usa a sintaxe Bourne shell. A sintaxe para outros shells pode diferir.
