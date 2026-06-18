### 8.6.2 Configurando a Encriptação do MySQL Enterprise

O MySQL Enterprise Encryption permite que você limite a duração das chaves para fornecer segurança adequada às suas necessidades, equilibrando isso com o uso de recursos. Você também pode configurar as funções fornecidas pelo componente `component_enterprise_encryption` a partir do MySQL 8.0.30, para suportar a descriptografia e a verificação de conteúdo produzido pelas funções da biblioteca compartilhada `openssl_udf` do legado.

#### Suporte à descriptografia por funções de componente para funções legadas

Por padrão, as funções fornecidas pelo componente `component_enterprise_encryption` do MySQL 8.0.30 não descriptografam texto criptografado ou verificam assinaturas, que foram produzidas pelas funções legadas fornecidas em versões anteriores pela biblioteca compartilhada `openssl_udf`. As funções do componente assumem que o texto criptografado usa o esquema de enchimento RSAES-OAEP e que as assinaturas usam o esquema de assinatura RSASSA-PSS. No entanto, o texto criptografado produzido pelas funções legadas usa o esquema de enchimento RSAES-PKCS1-v1\_5 e as assinaturas produzidas pelas funções legadas usam o esquema de assinatura RSASSA-PKCS1-v1\_5.

Se você deseja que as funções do componente suportem o conteúdo produzido pelas funções legadas antes do MySQL 8.0.30, defina a variável de sistema do componente `enterprise_encryption.rsa_support_legacy_padding` para `ON`. A variável de sistema está disponível quando o componente é instalado. Quando você a define para `ON`, as funções do componente tentam primeiro descriptografar ou verificar o conteúdo, assumindo que ele tem seus esquemas normais. Se isso não funcionar, elas também tentam descriptografar ou verificar o conteúdo, assumindo que ele tem os esquemas usados pelas funções legadas. Esse comportamento não é padrão porque aumenta o tempo necessário para processar conteúdo que não pode ser descriptografado ou verificado. Se você não está lidando com conteúdo produzido pelas funções legadas, deixe a variável de sistema no valor padrão `OFF`.

#### Limites de comprimento de chave

A quantidade de recursos de CPU necessários pelas funções de geração de chaves do MySQL Enterprise Encryption aumenta à medida que o comprimento da chave aumenta. Para algumas instalações, isso pode resultar em um uso de CPU inaceitável se as aplicações gerarem frequentemente chaves excessivamente longas.

O OpenSSL especifica um comprimento mínimo de chave de 1024 bits para todas as chaves. O OpenSSL também especifica um comprimento máximo de chave de 16384 bits para chaves RSA, 10000 bits para chaves DSA e 10000 bits para chaves DH.

A partir do MySQL 8.0.30, as funções fornecidas pelo componente `component_enterprise_encryption` têm um comprimento mínimo de chave maior de 2048 bits para chaves RSA, o que está alinhado com a melhor prática atual para comprimentos mínimos de chave. A variável de sistema do componente `enterprise_encryption.maximum_rsa_key_size` especifica o tamanho máximo da chave, e ela tem o valor padrão de 4096 bits. Você pode alterar isso para permitir chaves até o comprimento máximo permitido pelo OpenSSL, 16384 bits.

Para versões anteriores ao MySQL 8.0.30, as funções legadas fornecidas pela biblioteca compartilhada `openssl_udf` têm como padrão os limites mínimos e máximos do OpenSSL. Se os valores máximos forem muito altos, você pode especificar um comprimento de chave máximo menor usando as seguintes variáveis de sistema:

- `MYSQL_OPENSSL_UDF_DSA_BITS_THRESHOLD`: Comprimento máximo da chave DSA em bits para `create_asymmetric_priv_key()`. Os valores mínimo e máximo para essa variável são 1024 e 10000.

- `MYSQL_OPENSSL_UDF_RSA_BITS_THRESHOLD`: Comprimento máximo da chave RSA em bits para `create_asymmetric_priv_key()`. Os valores mínimo e máximo para essa variável são 1024 e 16384.

- `MYSQL_OPENSSL_UDF_DH_BITS_THRESHOLD`: Comprimento máximo da chave em bits para `create_dh_parameters()`. Os valores mínimo e máximo para essa variável são 1024 e 10000.

Para usar qualquer uma dessas variáveis de ambiente, defina-as no ambiente do processo que inicia o servidor. Se definidas, seus valores têm precedência sobre as comprimentos máximos de chave impostos pelo OpenSSL. Por exemplo, para definir um comprimento máximo de chave de 4096 bits para chaves DSA e RSA para `create_asymmetric_priv_key()`, defina essas variáveis:

```
export MYSQL_OPENSSL_UDF_DSA_BITS_THRESHOLD=4096
export MYSQL_OPENSSL_UDF_RSA_BITS_THRESHOLD=4096
```

O exemplo usa a sintaxe do shell Bourne. A sintaxe para outros shells pode ser diferente.
