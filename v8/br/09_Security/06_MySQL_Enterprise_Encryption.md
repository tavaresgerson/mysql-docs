## 8.6 Encriptação da MySQL Enterprise

Nota

A Encriptação Empresarial do MySQL é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL inclui um conjunto de funções de criptografia que expõem as capacidades do OpenSSL no nível SQL. As funções permitem que os aplicativos empresariais realizem as seguintes operações:

* Implemente proteção de dados adicional usando criptografia assimétrica de chave pública

* Crie chaves públicas e privadas e assinaturas digitais
* Realize criptografia assimétrica e descriptografia
* Use hashing criptográfico para assinatura digital e verificação e validação de dados

Em versões anteriores ao MySQL 8.0.30, essas funções são baseadas na biblioteca compartilhada `openssl_udf`. A partir do MySQL 8.0.30, elas são fornecidas por um componente MySQL `component_enterprise_encryption`.

### 8.6.1 Instalação e atualização da criptografia da MySQL Enterprise

Em versões anteriores ao MySQL 8.0.30, as funções fornecidas pelo MySQL Enterprise Encryption são instaladas criando-as individualmente, com base na `openssl_udf` biblioteca compartilhada. A partir do MySQL 8.0.30, as funções são fornecidas por um componente MySQL `component_enterprise_encryption`, e a instalação do componente instala todas as funções. As funções da `openssl_udf` biblioteca compartilhada são descontinuadas a partir dessa versão, e você deve atualizar para o componente em vez disso.

* Instalação a partir do MySQL 8.0.30
* Instalação para o MySQL 8.0.29
* Atualização da criptografia do MySQL Enterprise

#### Instalação a partir do MySQL 8.0.30

A partir do MySQL 8.0.30, as funções de Encriptação do MySQL Enterprise são fornecidas por um componente do MySQL `component_enterprise_encryption`, em vez de serem instaladas a partir da `openssl_udf` biblioteca compartilhada. Se você estiver atualizando para o MySQL 8.0.30 a partir de uma versão anterior onde você usou Encriptação do MySQL Enterprise, as funções que você criou permanecem disponíveis e são suportadas. No entanto, essas funções legadas são desatualizadas a partir desta versão e é recomendável que você instale o componente em vez disso. As funções do componente são compatíveis com versões anteriores. Para informações sobre atualização, consulte Atualizando a Encriptação do MySQL Enterprise.

Se você estiver atualizando, antes de instalar o componente, descarregue as funções legadas usando a declaração `DROP FUNCTION`(drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions"):

```
DROP FUNCTION asymmetric_decrypt;
DROP FUNCTION asymmetric_derive;
DROP FUNCTION asymmetric_encrypt;
DROP FUNCTION asymmetric_sign;
DROP FUNCTION asymmetric_verify;
DROP FUNCTION create_asymmetric_priv_key;
DROP FUNCTION create_asymmetric_pub_key;
DROP FUNCTION create_dh_parameters;
DROP FUNCTION create_digest;
```

Os nomes das funções devem ser especificados em minúsculas. As declarações exigem o privilégio `DROP` para o banco de dados `mysql`.

Para instalar o componente, emita uma declaração `INSTALL COMPONENT` (install-component.html "15.7.4.3 INSTALL COMPONENT Statement"):

```
INSTALL COMPONENT "file://component_enterprise_encryption";
```

`INSTALL COMPONENT` requer o privilégio `INSERT` para a tabela do sistema `mysql.component`, pois adiciona uma linha a essa tabela para registrar o componente. Para verificar se o componente foi instalado, execute:

```
SELECT * FROM mysql.component;
```

Os componentes listados em `mysql.component` são carregados pelo serviço de carregamento durante a sequência de inicialização.

Se você precisar desinstalar o componente, emita uma declaração `UNINSTALL COMPONENT`.

```
UNINSTALL COMPONENT "file://component_enterprise_encryption";
```

Para mais detalhes, consulte a Seção 7.5.1, “Instalando e Desinstalando Componentes”.

Instalar o componente instala todas as funções, então você não precisa criá-las usando as declarações `CREATE FUNCTION` (create-function.html "15.1.14 CREATE FUNCTION Statement") como você faz antes do MySQL 8.0.30. Desinstalar o componente desinstala todas as funções.

Quando você tiver instalado o componente, se quiser que as funções do componente suportem descriptografia e verificação para conteúdo produzido pelas funções legadas antes do MySQL 8.0.30, defina a variável de sistema do componente `enterprise_encryption.rsa_support_legacy_padding` para `ON`. Além disso, se quiser alterar o comprimento máximo permitido para as chaves RSA geradas pelas funções do componente, use a variável de sistema do componente `enterprise_encryption.maximum_rsa_key_size` para definir um comprimento máximo apropriado. Para informações de configuração, consulte a Seção 8.6.2, “Configurando a Encriptação da Empresa MySQL”.

#### Instalação para o MySQL 8.0.29

Antes do MySQL 8.0.29, as funções de criptografia do MySQL Enterprise estão localizadas em um arquivo de biblioteca de funções carregável instalado no diretório do plugin (o diretório nomeado pela variável de sistema `plugin_dir`). O nome da base da biblioteca de funções é `openssl_udf` e o sufixo depende da plataforma. Por exemplo, o nome do arquivo no Linux ou no Windows é `openssl_udf.so` ou `openssl_udf.dll`, respectivamente.

Para instalar funções do arquivo da biblioteca compartilhada `openssl_udf`, use a declaração [[`CREATE FUNCTION`][(create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions")]]. Para carregar todas as funções da biblioteca, use este conjunto de declarações, ajustando o sufixo do nome do arquivo conforme necessário:

```
CREATE FUNCTION asymmetric_decrypt RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION asymmetric_derive RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION asymmetric_encrypt RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION asymmetric_sign RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION asymmetric_verify RETURNS INTEGER
  SONAME 'openssl_udf.so';
CREATE FUNCTION create_asymmetric_priv_key RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION create_asymmetric_pub_key RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION create_dh_parameters RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION create_digest RETURNS STRING
  SONAME 'openssl_udf.so';
```

Uma vez instalado, as funções permanecem instaladas após a reinicialização do servidor. Se você precisar descarregar as funções, use a declaração `DROP FUNCTION`(drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions"):

```
DROP FUNCTION asymmetric_decrypt;
DROP FUNCTION asymmetric_derive;
DROP FUNCTION asymmetric_encrypt;
DROP FUNCTION asymmetric_sign;
DROP FUNCTION asymmetric_verify;
DROP FUNCTION create_asymmetric_priv_key;
DROP FUNCTION create_asymmetric_pub_key;
DROP FUNCTION create_dh_parameters;
DROP FUNCTION create_digest;
```

Nas declarações `CREATE FUNCTION` e (create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions") e `DROP FUNCTION` e (drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions"), os nomes das funções devem ser especificados em minúsculas. Isso difere de seu uso no momento da invocação da função, para o qual você pode usar qualquer letra maiúscula.

As declarações `CREATE FUNCTION`(create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions") e `DROP FUNCTION`(drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions") exigem o privilégio `INSERT` e `DROP`, respectivamente, para o banco de dados `mysql`.

As funções fornecidas pela biblioteca compartilhada `openssl_udf` permitem um tamanho mínimo de chave de 1024 bits. Você pode definir um tamanho máximo de chave usando as variáveis de ambiente `MYSQL_OPENSSL_UDF_RSA_BITS_THRESHOLD`, `MYSQL_OPENSSL_UDF_DSA_BITS_THRESHOLD` e `MYSQL_OPENSSL_UDF_DH_BITS_THRESHOLD`, conforme descrito na Seção 8.6.2, “Configurando a Encriptação Empresarial do MySQL”. Se você não definir um tamanho máximo de chave, o limite superior é de 16384 para o algoritmo RSA e 10000 para o algoritmo DSA, conforme especificado pelo OpenSSL.

#### Atualizando a Encriptação do MySQL Enterprise

Se você atualizar para o MySQL 8.0.30 ou posterior a partir de uma versão anterior onde você usou as funções fornecidas pela biblioteca compartilhada `openssl_udf`, as funções que você criou permanecem disponíveis e são suportadas. No entanto, essas funções legadas são descontinuadas a partir do MySQL 8.0.30, e é recomendável que você instale o componente de criptografia da MySQL Enterprise `component_enterprise_encryption` em vez disso.

Quando você estiver atualizando, antes de instalar o componente, você deve descarregar as funções legadas usando a declaração `DROP FUNCTION`. Para obter instruções sobre como fazer isso, consulte Instalação a partir do MySQL 8.0.30.

As funções dos componentes são compatíveis para trás:

* As chaves públicas e privadas do RSA geradas pelas funções legadas podem ser usadas com as funções do componente.

* Dados criptografados com as funções legadas podem ser descriptografados pelas funções de componente.

* As assinaturas criadas pelas funções legadas podem ser verificadas com as funções do componente.

Para que as funções de componente possam suportar descriptografia e verificação para conteúdo produzido pelas funções legadas, você deve definir a variável de sistema `enterprise_encryption.rsa_support_legacy_padding` para `ON` (o padrão é `OFF`). Para informações de configuração, consulte a Seção 8.6.2, “Configurando a Encriptação da MySQL Enterprise”.

As funções de legado não podem lidar com dados criptografados, chaves públicas e assinaturas criadas pelas funções de componente, devido às diferenças no preenchimento e no formato de chave utilizadas pelas funções de componente para atender aos padrões atuais.

As novas funções fornecidas pelo componente `component_enterprise_encryption` têm algumas diferenças de comportamento e suporte em relação às funções legadas fornecidas pela biblioteca compartilhada `openssl_udf`. As mais importantes são as seguintes:

* As funções de legado suportam o algoritmo DSA mais antigo e o método de troca de chave Diffie-Hellman. As funções de componente usam apenas o algoritmo RSA geralmente preferido.

* Para as funções de legado, o tamanho mínimo da chave RSA é menor do que a melhor prática atual. As funções do componente seguem a melhor prática atual em relação ao tamanho mínimo da chave RSA.

* As funções de legado suportam apenas SHA2 para digests e exigem digests para assinaturas. As funções do componente também suportam SHA3 para digests (desde que o OpenSSL 1.1.1 esteja em uso) e não exigem digests para assinaturas, embora elas as suportem.

* A função de legado `asymmetric_encrypt()` suporta criptografia usando chaves privadas. A função de componente `asymmetric_encrypt()` só aceita uma chave pública. É recomendável que você também criptografie apenas usando chaves públicas com a função de legado.

* As funções de legado `create_dh_parameters()` e `asymmetric_derive()` para o método de troca de chave Diffie-Hellman não são fornecidas pelo componente `component_enterprise_encryption`.

A Tabela 1 resume as diferenças técnicas em suporte e operação entre as funções legadas fornecidas pela biblioteca compartilhada `openssl_udf` e as funções fornecidas pelo componente `component_enterprise_encryption` do MySQL 8.0.30.

**Tabela 8.48 Funções de criptografia do MySQL Enterprise**

<table frame="all" summary="Compares the capability of the encryption functions before and from MySQL 8.0.30."><col style="width: 30%"/><col style="width: 40%"/><col style="width: 40%"/><thead><tr> <th scope="col"><p>Capacidade</p></th> <th scope="col"><p>Funções de legado (para MySQL 8.0.29)</p></th> <th scope="col"><p>Funções de componente (de MySQL 8.0.30)</p></th> </tr></thead><tbody><tr> <th scope="row"><p>Método de criptografia</p></th> <td><p>RSA, DSA, Diffie-Hellman (DH)</p></td> <td><p>Apenas RSA</p></td> </tr><tr> <th scope="row"><p>Chave para criptografia</p></th> <td><p>Privada ou pública</p></td> <td><p>Somente para o público</p></td> </tr><tr> <th scope="row"><p>Formato da chave RSA</p></th> <td><p>PKCS #1 v1.5</p></td> <td><p>PKCS #8</p></td> </tr><tr> <th scope="row"><p>Tamanho mínimo da chave RSA</p></th> <td><p>1024 bits</p></td> <td><p>2048 bits</p></td> </tr><tr> <th scope="row">Limite máximo do tamanho da chave RSA</th> <td><p>Conjunto com variável de ambiente<code>MYSQL_OPENSSL_UDF_RSA_BITS_THRESHOLD</code>O limite padrão é máximo de 16384 para o algoritmo.</p></td> <td><p>Conjunto com variável do sistema<code>enterprise_encryption.maximum_rsa_key_size</code>O limite padrão é de 4096</p></td> </tr><tr> <th scope="row">Algoritmos de digestão</th> <td><p>SHA2</p></td> <td><p>SHA2, SHA3 (com OpenSSL 1.1.1)</p></td> </tr><tr> <th scope="row">Assinaturas</th> <td><p>Digestão necessária</p></td> <td><p>Digestes suportados, mas não necessários. Pode-se usar qualquer cadeia de comprimento arbitrário</p></td> </tr><tr> <th scope="row">Output padding</th> <td><p> RSAES-PKCS1-v1_5 </p></td> <td><p> RSAES-OAEP </p></td> </tr><tr> <th scope="row">Signature padding</th> <td><p> RSASSA-PKCS1-v1_5 </p></td> <td><p> RSASSA-PSS </p></td> </tr></tbody></table>

### 8.6.2 Configurando a Encriptação Empresarial do MySQL

O MySQL Enterprise Encryption permite limitar as chaves a uma extensão que ofereça segurança adequada para suas necessidades, equilibrando isso com o uso de recursos. Você também pode configurar as funções fornecidas pelo componente `component_enterprise_encryption` do MySQL 8.0.30, para suportar descriptografia e verificação para conteúdo produzido pelas funções da biblioteca compartilhada `openssl_udf` legadas.

#### Suporte à descriptografia por funções de componente para funções legadas

Por padrão, as funções fornecidas pelo componente `component_enterprise_encryption` do MySQL 8.0.30 não descriptografam texto criptografado ou não verificam assinaturas, que foram produzidas pelas funções legadas fornecidas em versões anteriores pela biblioteca compartilhada `openssl_udf`. As funções do componente assumem que o texto criptografado usa o esquema de recheio RSAES-OAEP e que as assinaturas usam o esquema de assinatura RSASSA-PSS. No entanto, o texto criptografado produzido pelas funções legadas usa o esquema de recheio RSAES-PKCS1-v1_5 e as assinaturas produzidas pelas funções legadas usam o esquema de assinatura RSASSA-PKCS1-v1_5.

Se você deseja que as funções do componente suportem conteúdo produzido pelas funções legadas antes do MySQL 8.0.30, defina a variável de sistema do componente `enterprise_encryption.rsa_support_legacy_padding` para `ON`. A variável de sistema está disponível quando o componente é instalado. Quando você a define para `ON`, as funções do componente tentam primeiro descriptografar ou verificar o conteúdo, assumindo que ele tem seus esquemas normais. Se isso não funcionar, elas também tentam descriptografar ou verificar o conteúdo, assumindo que ele tem os esquemas usados pelas funções legadas. Esse comportamento não é o padrão, pois aumenta o tempo necessário para processar conteúdo que não pode ser descriptografado ou verificado. Se você não está lidando com conteúdo produzido pelas funções legadas, deixe a variável de sistema no padrão para `OFF`.

#### Limites de comprimento da chave

A quantidade de recursos de CPU necessários pelas funções de geração de chave do MySQL Enterprise Encryption aumenta à medida que o comprimento da chave aumenta. Para algumas instalações, isso pode resultar em uso de CPU inaceitável se as aplicações gerarem frequentemente chaves excessivamente longas.

O OpenSSL especifica um comprimento mínimo de chave de 1024 bits para todas as chaves. O OpenSSL também especifica um comprimento máximo de chave de 16384 bits para chaves RSA, 10000 bits para chaves DSA e 10000 bits para chaves DH.

A partir do MySQL 8.0.30, as funções fornecidas pelo componente `component_enterprise_encryption` têm um comprimento mínimo de chave mais alto de 2048 bits para chaves RSA, o que está em conformidade com a melhor prática atual para comprimentos mínimos de chave. A variável de sistema do componente `enterprise_encryption.maximum_rsa_key_size` especifica o tamanho máximo da chave, e ela tem como padrão 4096 bits. Você pode alterar isso para permitir chaves até o comprimento máximo permitido pelo OpenSSL, 16384 bits.

Para as versões anteriores ao MySQL 8.0.30, as funções legadas fornecidas pela biblioteca compartilhada `openssl_udf` têm como padrão os limites mínimos e máximos do OpenSSL. Se os valores máximos forem muito altos, você pode especificar um comprimento de chave máximo menor usando as seguintes variáveis do sistema:

* `MYSQL_OPENSSL_UDF_DSA_BITS_THRESHOLD`: Comprimento máximo da chave do DSA em bits para `create_asymmetric_priv_key()`. Os valores mínimo e máximo para essa variável são 1024 e 10000.

* `MYSQL_OPENSSL_UDF_RSA_BITS_THRESHOLD`: Comprimento máximo da chave RSA em bits para `create_asymmetric_priv_key()`. Os valores mínimo e máximo para essa variável são 1024 e 16384.

* `MYSQL_OPENSSL_UDF_DH_BITS_THRESHOLD`: Comprimento máximo da chave em bits para `create_dh_parameters()`. Os valores mínimo e máximo para esta variável são 1024 e 10000.

Para usar qualquer uma dessas variáveis de ambiente, configure-as no ambiente do processo que inicia o servidor. Se configuradas, seus valores têm precedência sobre os comprimentos de chave máximos impostos pelo OpenSSL. Por exemplo, para definir um comprimento de chave máximo de 4096 bits para chaves DSA e RSA para `create_asymmetric_priv_key()`, configure essas variáveis:

```
export MYSQL_OPENSSL_UDF_DSA_BITS_THRESHOLD=4096
export MYSQL_OPENSSL_UDF_RSA_BITS_THRESHOLD=4096
```

O exemplo usa a sintaxe do Bourne shell. A sintaxe para outras caixas pode ser diferente.

### 8.6.3 Uso e exemplos de criptografia empresarial do MySQL

Para usar a Encriptação Empresarial do MySQL em aplicativos, invoque as funções apropriadas para as operações que você deseja realizar. Esta seção demonstra como realizar algumas tarefas representativas.

Nas versões anteriores ao MySQL 8.0.30, as funções da Encriptação do MySQL Enterprise são baseadas na `openssl_udf` biblioteca compartilhada. A partir do MySQL 8.0.30, as funções são fornecidas por um componente MySQL `component_enterprise_encryption`. Em alguns casos, o comportamento das funções do componente difere do comportamento das funções legadas fornecidas pelo `openssl_udf`. Para uma lista das diferenças, consulte a seção "Atualizando a Encriptação do MySQL Enterprise". Para obter detalhes completos sobre o comportamento de cada função do componente, consulte a Seção 8.6.4, "Referência de Função de Encriptação do MySQL Enterprise".

Se você instalar as funções legadas e, em seguida, atualizar para o MySQL 8.0.30 ou posterior, as funções que você criou permanecem disponíveis, são suportadas e continuam a funcionar da mesma maneira. No entanto, elas são descontinuadas a partir do MySQL 8.0.30, e é recomendável que você instale o componente de criptografia da MySQL Enterprise `component_enterprise_encryption` em vez disso. Para instruções de atualização, consulte Instalação a partir do MySQL 8.0.30.

As seguintes considerações gerais se aplicam ao escolher comprimentos de chave e algoritmos de criptografia:

* A força da criptografia para chaves privadas e públicas aumenta com o tamanho da chave, mas o tempo para geração da chave também aumenta.

* Para as funções de legado, a geração de chaves DH leva muito mais tempo do que as chaves RSA ou DSA. As funções de componente do MySQL 8.0.30 só suportam chaves RSA.

* As funções de criptografia assimétricas consomem mais recursos em comparação com as funções simétricas. Elas são adequadas para criptografar pequenas quantidades de dados e para criar e verificar assinaturas. Para criptografar grandes quantidades de dados, as funções de criptografia simétricas são mais rápidas. O MySQL Server fornece as funções `AES_ENCRYPT()` e `AES_DECRYPT()` para criptografia simétrica.

Os valores de cadeia chave podem ser criados em tempo de execução e armazenados em uma variável ou tabela usando `SET`, `SELECT` ou `INSERT`. Este exemplo funciona tanto com a função de componente quanto com a função legada:

```
SET @priv1 = create_asymmetric_priv_key('RSA', 2048);
SELECT create_asymmetric_priv_key('RSA', 2048) INTO @priv2;
INSERT INTO t (key_col) VALUES(create_asymmetric_priv_key('RSA', 1024));
```

Os valores de cadeia-chave armazenados em arquivos podem ser lidos usando a função `LOAD_FILE()` por usuários que possuem o privilégio `FILE`. As strings de digestão e assinatura podem ser manipuladas de maneira semelhante.

* Crie um par de chave privada/pública
* Use a chave pública para criptografar dados e a chave privada para descriptografá-los
* Gerar um digest de uma string
* Use o digest com um par de chaves

#### Crie um par de chave privada/pública

Este exemplo funciona tanto com as funções de componente quanto com as funções legadas:

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

Este exemplo funciona tanto com as funções de componente quanto com as funções legadas. Em ambos os casos, os membros do par de chave devem ser chaves RSA:

```
SET @ciphertext = asymmetric_encrypt(@algo, 'My secret text', @pub);
SET @plaintext = asymmetric_decrypt(@algo, @ciphertext, @priv);
```

#### Gerar um resumo de uma string

Este exemplo funciona tanto com as funções de componente quanto com as funções legadas:

```
-- Digest type
SET @dig_type = 'SHA512';

-- Generate digest string
SET @dig = create_digest(@dig_type, 'My text to digest');
```

#### Use o digest com um par de chave

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

Para as funções de legado, as assinaturas exigem um digest. Para as funções de componente, as assinaturas não exigem um digest e podem usar qualquer string de dados. O tipo de digest nestas funções refere-se ao algoritmo que é usado para assinar os dados, não ao algoritmo que foi usado para criar a entrada original para a assinatura. Este exemplo é para as funções de componente:

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

### 8.6.4 Referência à função de criptografia empresarial do MySQL

Nas versões do MySQL 8.0.30, as funções da Encriptação do MySQL Enterprise são fornecidas pelo componente `component_enterprise_encryption` do MySQL. Para suas descrições, consulte a Seção 8.6.5, “Descrição das funções do componente de Encriptação do MySQL Enterprise”.

Nas versões anteriores ao MySQL 8.0.30, as funções da Encriptação do MySQL Enterprise são baseadas na `openssl_udf` biblioteca compartilhada. As funções continuam disponíveis em versões posteriores se tiverem sido instaladas, mas são descontinuadas. Para suas descrições, consulte a Seção 8.6.6, “Descritores de funções legítimas da Encriptação do MySQL Enterprise”.

Para obter informações sobre a atualização para as novas funções de componente fornecidas pelo componente MySQL `component_enterprise_encryption`, e uma lista das diferenças de comportamento entre as funções legadas e as funções do componente, consulte Atualizando a Encriptação do MySQL Enterprise.

### 8.6.5 Descrições das funções do componente de criptografia da MySQL Enterprise

Nas versões do MySQL 8.0.30, as funções de Encriptação do MySQL Enterprise são fornecidas pelo componente MySQL `component_enterprise_encryption`. Esta referência descreve essas funções.

Para obter informações sobre a atualização para as novas funções de componente fornecidas pelo componente MySQL `component_enterprise_encryption`, e uma lista das diferenças de comportamento entre as funções legadas e as funções do componente, consulte Atualizando a Encriptação do MySQL Enterprise.

A referência para as funções de legado nas versões anteriores ao MySQL 8.0.30 com base na biblioteca compartilhada `openssl_udf` é a Seção 8.6.6, “Descrição de Função de Encriptação Empresarial do MySQL Legado”.

As funções de criptografia do MySQL Enterprise têm essas características gerais:

* Para argumentos do tipo errado ou um número incorreto de argumentos, cada função retorna um erro.

* Se os argumentos não forem adequados para permitir que uma função realize a operação solicitada, ela retorna `NULL` ou 0, conforme apropriado. Isso ocorre, por exemplo, se uma função não suportar um algoritmo especificado, uma chave tiver comprimento muito curto ou longo, ou uma string esperada ser uma string de chave em formato PEM não for uma chave válida.

* A biblioteca SSL subjacente cuida da inicialização da aleatoriedade.

O componente só suporta o algoritmo de criptografia RSA.

Para exemplos adicionais e discussão, consulte a Seção 8.6.3, “Uso e exemplos de criptografia empresarial do MySQL”.

* `asymmetric_decrypt(algorithm, data_str, priv_key_str)`(enterprise-encryption-functions.html#function_asymmetric-decrypt)

Descodifica uma cadeia criptografada usando o algoritmo e a cadeia de chave fornecidos, e retorna a cadeia de texto descodificada como uma cadeia binária. Se a descriptografia falhar, o resultado é `NULL`.

Para a versão de legado desta função utilizada antes do MySQL 8.0.29, consulte a Seção 8.6.6, “Descrição de funções de criptografia de empresa MySQL de legado”.

Por padrão, a função `component_enterprise_encryption` assume que o texto criptografado usa o esquema de preenchimento RSAES-OAEP. A função suporta a descriptografia de conteúdo criptografado pelas funções de biblioteca compartilhada legadas `openssl_udf`, se a variável de sistema `enterprise_encryption.rsa_support_legacy_padding` estiver definida como `ON` (o padrão é `OFF`). Quando `ON` está definido, a função também suporta o esquema de preenchimento RSAES-PKCS1-v1_5, conforme usado pelas funções de biblioteca compartilhada legadas `openssl_udf`. Quando `OFF` está definido, o conteúdo criptografado pelas funções legadas não pode ser descriptografado, e a função retorna saída nulo para tal conteúdo.

*`algorithm`* é o algoritmo de criptografia utilizado para criar a chave. O valor do algoritmo suportado é `'RSA'`.

*`data_str`* é a string criptografada para descriptografar, que foi criptografada com `asymmetric_encrypt()`.

*`priv_key_str`* é uma chave privada RSA codificada PEM válida. Para a descriptografia bem-sucedida, a string da chave deve corresponder à string da chave pública usada com `asymmetric_encrypt()` para produzir a string criptografada. O componente `asymmetric_encrypt()` só suporta criptografia usando uma chave pública, então a descriptografia ocorre com a chave privada correspondente.

Para um exemplo de uso, veja a descrição de `asymmetric_encrypt()`.

* `asymmetric_encrypt(algorithm, data_str, pub_key_str)`(enterprise-encryption-functions.html#function_asymmetric-encrypt)

Encripta uma string usando o algoritmo e a string de chave fornecidos, e retorna o texto cifrado resultante como uma string binária. Se a encriptação falhar, o resultado é `NULL`.

Para a versão de legado desta função utilizada antes do MySQL 8.0.29, consulte a Seção 8.6.6, “Descrição de funções de criptografia de empresa MySQL de legado”.

*`algorithm`* é o algoritmo de criptografia utilizado para criar a chave. O valor do algoritmo suportado é `'RSA'`.

*`data_str`* é a string a ser criptografada. O comprimento dessa string não pode ser maior que o comprimento da string de chave em bytes, menos 42 (para contabilizar o preenchimento).

*`pub_key_str`* é uma chave pública RSA codificada PEM válida. O componente `asymmetric_encrypt()` só suporta criptografia usando uma chave pública.

Para recuperar a cadeia original não criptografada, passe a cadeia criptografada para `asymmetric_decrypt()`, juntamente com a outra parte do par de chaves utilizado para criptografia, conforme o exemplo a seguir:

  ```
  -- Generate private/public key pair
  SET @priv = create_asymmetric_priv_key('RSA', 2048);
  SET @pub = create_asymmetric_pub_key('RSA', @priv);

  -- Encrypt using public key, decrypt using private key
  SET @ciphertext = asymmetric_encrypt('RSA', 'The quick brown fox', @pub);
  SET @plaintext = asymmetric_decrypt('RSA', @ciphertext, @priv);
  ```

Suponha que:

  ```
  SET @s = a string to be encrypted
  SET @priv = a valid private RSA key string in PEM format
  SET @pub = the corresponding public RSA key string in PEM format
  ```

Então, essas relações de identidade são válidas:

  ```
  asymmetric_decrypt('RSA', asymmetric_encrypt('RSA', @s, @pub), @priv) = @s
  ```

* `asymmetric_sign(algorithm, text, priv_key_str, digest_type)`(enterprise-encryption-functions.html#function_asymmetric-sign)

Assina uma string de digest ou uma string de dados usando uma chave privada e retorna a assinatura como uma string binária. Se a assinatura falhar, o resultado é `NULL`.

Para a versão de legado desta função utilizada antes do MySQL 8.0.29, consulte a Seção 8.6.6, “Descrição de funções de criptografia de empresa MySQL de legado”.

*`algorithm`* é o algoritmo de criptografia utilizado para criar a chave. O valor do algoritmo suportado é `'RSA'`.

*`text`* é uma string de dados ou uma string de digestão. A função aceita digestões, mas não as exige, pois também é capaz de lidar com strings de dados de comprimento arbitrário. Uma string de digestão pode ser gerada ao chamar `create_digest()`.

*`priv_key_str`* é a string da chave privada a ser usada para assinar a string de digest. Ela deve ser uma chave privada RSA codificada em PEM válida.

*`digest_type`* é o algoritmo a ser utilizado para assinar os dados. Os valores suportados de *`digest_type`* são `'SHA224'`, `'SHA256'`, `'SHA384'` e `'SHA512'`, quando o OpenSSL 1.0.1 está em uso. Se o OpenSSL 1.1.1 estiver em uso, os valores adicionais de *`digest_type`* `'SHA3-224'`, `'SHA3-256'`, `'SHA3-384'` e `'SHA3-512'` estão disponíveis.

Para um exemplo de uso, veja a descrição de `asymmetric_verify()`.

* `asymmetric_verify(algorithm, text, sig_str, pub_key_str, digest_type)`(enterprise-encryption-functions.html#function_asymmetric-verify)

Verifica se a string de assinatura corresponde à string de digestão e retorna 1 ou 0 para indicar se a verificação foi bem-sucedida ou não. Se a verificação falhar, o resultado é `NULL`.

Para a versão de legado desta função utilizada antes do MySQL 8.0.29, consulte a Seção 8.6.6, “Descrição de funções de criptografia de empresa MySQL de legado”.

Por padrão, a função `component_enterprise_encryption` assume que as assinaturas utilizem o esquema de assinatura RSASSA-PSS. A função suporta a verificação de assinaturas produzidas pelas funções de biblioteca compartilhada legadas `openssl_udf` se a variável de sistema `enterprise_encryption.rsa_support_legacy_padding` estiver definida como `ON` (o padrão é `OFF`). Quando `ON` estiver definido, a função também suporta o esquema de assinatura RSASSA-PKCS1-v1_5, conforme utilizado pelas funções de biblioteca compartilhada legadas `openssl_udf`. Quando `OFF` estiver definido, as assinaturas produzidas pelas funções legadas não podem ser verificadas, e a função retorna saída nulo para tal conteúdo.

*`algorithm`* é o algoritmo de criptografia utilizado para criar a chave. O valor do algoritmo suportado é `'RSA'`.

*`text`* é uma string de dados ou uma string de digestão. A função componente aceita digestões, mas não as exige, pois também é capaz de lidar com strings de dados de comprimento arbitrário. Uma string de digestão pode ser gerada ao chamar `create_digest()`.

*`sig_str`* é a string de assinatura a ser verificada. Uma string de assinatura pode ser gerada ao chamar `asymmetric_sign()`.

*`pub_key_str`* é a string da chave pública do signatário. Ela corresponde à chave privada passada para `asymmetric_sign()` para gerar a string de assinatura. Ela deve ser uma chave pública RSA codificada em PEM válida.

*`digest_type`* é o algoritmo que foi usado para assinar os dados. Os valores suportados de *`digest_type`* são `'SHA224'`, `'SHA256'`, `'SHA384'` e `'SHA512'`, quando o OpenSSL 1.0.1 está em uso. Se o OpenSSL 1.1.1 estiver em uso, os valores adicionais de *`digest_type`* `'SHA3-224'`, `'SHA3-256'`, `'SHA3-384'` e `'SHA3-512'` estão disponíveis.

  ```
  -- Set the encryption algorithm and digest type
  SET @algo = 'RSA';
  SET @dig_type = 'SHA512';

  -- Create private/public key pair
  SET @priv = create_asymmetric_priv_key(@algo, 2048);
  SET @pub = create_asymmetric_pub_key(@algo, @priv);

  -- Generate digest from string
  SET @dig = create_digest(@dig_type, 'The quick brown fox');

  -- Generate signature for digest and verify signature against digest
  SET @sig = asymmetric_sign(@algo, @dig, @priv, @dig_type);
  SET @verf = asymmetric_verify(@algo, @dig, @sig, @pub, @dig_type);
  ```

* `create_asymmetric_priv_key(algorithm, key_length)`(enterprise-encryption-functions.html#function_create-asymmetric-priv-key)

Cria uma chave privada usando o algoritmo e o comprimento de chave fornecidos, e retorna a chave como uma string binária no formato PEM. A chave está no formato PKCS #8. Se a geração da chave falhar, o resultado é `NULL`.

Para a versão de legado desta função utilizada antes do MySQL 8.0.29, consulte a Seção 8.6.6, “Descrição de funções de criptografia de empresa MySQL de legado”.

*`algorithm`* é o algoritmo de criptografia utilizado para criar a chave. O valor do algoritmo suportado é `'RSA'`.

*`key_length`* é o comprimento da chave em bits. Se você exceder o comprimento máximo permitido da chave ou especificar menos que o mínimo, a geração da chave falha e o resultado é uma saída nula. O comprimento mínimo permitido da chave em bits é 2048. O comprimento máximo permitido da chave é o valor da variável do sistema `enterprise_encryption.maximum_rsa_key_size`, que tem o valor padrão de 4096. Tem um ajuste máximo de 16384, que é o comprimento máximo permitido da chave para o algoritmo RSA. Veja a Seção 8.6.2, “Configurando a Encriptação da Empresa MySQL”.

Nota

Gerar chaves mais longas pode consumir recursos significativos do CPU. Limitar o comprimento da chave usando a variável de sistema `enterprise_encryption.maximum_rsa_key_size` permite que você forneça segurança adequada para suas necessidades, equilibrando isso com o uso de recursos.

Este exemplo cria uma chave privada RSA de 2048 bits e, em seguida, deriva uma chave pública a partir da chave privada:

  ```
  SET @priv = create_asymmetric_priv_key('RSA', 2048);
  SET @pub = create_asymmetric_pub_key('RSA', @priv);
  ```

* `create_asymmetric_pub_key(algorithm, priv_key_str)`(enterprise-encryption-functions.html#function_create-asymmetric-pub-key)

Desenha uma chave pública a partir da chave privada fornecida usando o algoritmo fornecido e retorna a chave como uma string binária no formato PEM. A chave está no formato PKCS #8. Se a derivação da chave falhar, o resultado é `NULL`.

Para a versão de legado desta função utilizada antes do MySQL 8.0.29, consulte a Seção 8.6.6, “Descrição de funções de criptografia de empresa MySQL de legado”.

*`algorithm`* é o algoritmo de criptografia utilizado para criar a chave. O valor do algoritmo suportado é `'RSA'`.

*`priv_key_str`* é uma chave privada RSA codificada PEM válida.

Para um exemplo de uso, veja a descrição de `create_asymmetric_priv_key()`.

* `create_digest(digest_type, str)`(enterprise-encryption-functions.html#function_create-digest)

Cria um resumo da string fornecida usando o tipo de digest fornecido e retorna o digest como uma string binária. Se a geração de digest falhar, o resultado é `NULL`.

Para a versão de legado desta função utilizada antes do MySQL 8.0.29, consulte a Seção 8.6.6, “Descrição de funções de criptografia de empresa MySQL de legado”.

A string de digest resultante é adequada para uso com `asymmetric_sign()` e `asymmetric_verify()`. As versões dos componentes dessas funções aceitam digests, mas não os exigem, pois são capazes de lidar com dados de comprimento arbitrário.

*`digest_type`* é o algoritmo de digest que deve ser usado para gerar a string de digest. Os valores suportados de *`digest_type`* são `'SHA224'`, `'SHA256'`, `'SHA384'` e `'SHA512'`, quando o OpenSSL 1.0.1 está em uso. Se o OpenSSL 1.1.1 estiver em uso, os valores adicionais de *`digest_type`* `'SHA3-224'`, `'SHA3-256'`, `'SHA3-384'` e `'SHA3-512'` estão disponíveis.

*`str`* é a string de dados não nula para a qual o digest deve ser gerado.

  ```
  SET @dig = create_digest('SHA512', 'The quick brown fox');
  ```

### 8.6.6 Descrição das funções de criptografia de legado da MySQL Enterprise

Nas versões anteriores ao MySQL 8.0.30, as funções da Encriptação do MySQL Enterprise são baseadas na `openssl_udf` biblioteca compartilhada. Esta referência descreve essas funções. As funções continuam disponíveis em versões posteriores se tiverem sido instaladas, mas são desaconselhadas.

Para obter informações sobre a atualização para as novas funções de componente fornecidas pelo componente MySQL `component_enterprise_encryption`, e uma lista das diferenças de comportamento entre as funções legadas e as funções do componente, consulte Atualizando a Encriptação do MySQL Enterprise.

A referência para as funções dos componentes é a Seção 8.6.5, “Descritores das funções do componente de criptografia empresarial MySQL”.

As funções de criptografia do MySQL Enterprise têm essas características gerais:

* Para argumentos do tipo errado ou um número incorreto de argumentos, cada função retorna um erro.

* Se os argumentos não forem adequados para permitir que uma função realize a operação solicitada, ela retorna `NULL` ou 0, conforme apropriado. Isso ocorre, por exemplo, se uma função não suportar um algoritmo especificado, uma chave tiver comprimento muito curto ou longo, ou uma string esperada ser uma string de chave no formato PEM não for uma chave válida.

* A biblioteca SSL subjacente cuida da inicialização da aleatoriedade.

Várias das funções legadas aceitam um argumento de algoritmo de criptografia. O seguinte quadro resume os algoritmos suportados por função.

**Tabela 8.49 Algoritmos suportados por função**

<table summary="Supported encryption algorithms by function."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Function</th> <th>Supported Algorithms</th> </tr></thead><tbody><tr> <td><code>asymmetric_decrypt()</code></td> <td>RSA</td> </tr><tr> <td><code>asymmetric_derive()</code></td> <td>DH</td> </tr><tr> <td><code>asymmetric_encrypt()</code></td> <td>RSA</td> </tr><tr> <td><code>asymmetric_sign()</code></td> <td>RSA, DSA</td> </tr><tr> <td><code>asymmetric_verify()</code></td> <td>RSA, DSA</td> </tr><tr> <td><code>create_asymmetric_priv_key()</code></td> <td>RSA, DSA, DH</td> </tr><tr> <td><code>create_asymmetric_pub_key()</code></td> <td>RSA, DSA, DH</td> </tr><tr> <td><code>create_dh_parameters()</code></td> <td>DH</td> </tr></tbody></table>

Nota

Embora você possa criar chaves usando qualquer um dos algoritmos de criptografia RSA, DSA ou DH, outras funções legadas que aceitam argumentos de chave podem aceitar apenas certos tipos de chaves. Por exemplo, `asymmetric_encrypt()` e `asymmetric_decrypt()` aceitam apenas chaves RSA.

Para exemplos adicionais e discussão, consulte a Seção 8.6.3, “Uso e exemplos de criptografia empresarial do MySQL”.

* `asymmetric_decrypt(algorithm, crypt_str, key_str)`

Descodifica uma cadeia criptografada usando o algoritmo e a cadeia de chave fornecidos, e retorna a cadeia de texto descodificada como uma cadeia binária. Se a descriptografia falhar, o resultado é `NULL`.

A função da biblioteca compartilhada `openssl_udf` não pode descriptografar conteúdo produzido pelas funções `component_enterprise_encryption` que estão disponíveis a partir do MySQL 8.0.30.

*`algorithm`* é o algoritmo de criptografia utilizado para criar a chave. O valor do algoritmo suportado é `'RSA'`.

*`crypt_str`* é a string criptografada para descriptografar, que foi criptografada com `asymmetric_encrypt()`.

*`key_str`* é uma chave pública ou privada RSA codificada PEM válida. Para a descriptografia bem-sucedida, a string da chave deve corresponder à string da chave pública ou privada usada com `asymmetric_encrypt()` para produzir a string criptografada.

Para um exemplo de uso, veja a descrição de `asymmetric_encrypt()`.

* `asymmetric_derive(pub_key_str, priv_key_str)`(enterprise-encryption-functions-legacy.html#function_asymmetric-derive)

Desenha uma chave simétrica usando a chave privada de uma das partes e a chave pública da outra, e retorna a chave resultante como uma string binária. Se a derivação da chave falhar, o resultado é `NULL`.

*`pub_key_str`* e *`priv_key_str`* são cadeias de caracteres de chave codificadas PEM válidas que foram criadas usando o algoritmo DH.

Suponha que você tenha dois pares de chaves públicas e privadas:

  ```
  SET @dhp = create_dh_parameters(1024);
  SET @priv1 = create_asymmetric_priv_key('DH', @dhp);
  SET @pub1 = create_asymmetric_pub_key('DH', @priv1);
  SET @priv2 = create_asymmetric_priv_key('DH', @dhp);
  SET @pub2 = create_asymmetric_pub_key('DH', @priv2);
  ```

Suponha que você use a chave privada de um par e a chave pública do outro par para criar uma cadeia de chave simétrica. Então, essa relação de identidade de chave simétrica é válida:

  ```
  asymmetric_derive(@pub1, @priv2) = asymmetric_derive(@pub2, @priv1)
  ```

Este exemplo requer chaves privadas/públicas DH como entradas, criadas usando um segredo simétrico compartilhado. Crie o segredo passando o comprimento da chave para `create_dh_parameters()`, em seguida, passe o segredo como o “comprimento da chave” para `create_asymmetric_priv_key()`.

  ```
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

* `asymmetric_encrypt(algorithm, str, key_str)`

Encripta uma string usando o algoritmo e a string de chave fornecidos, e retorna o texto cifrado resultante como uma string binária. Se a encriptação falhar, o resultado é `NULL`.

*`algorithm`* é o algoritmo de criptografia utilizado para criar a chave. O valor do algoritmo suportado é `'RSA'`.

*`str`* é a string a ser criptografada. O comprimento dessa string não pode ser maior que o comprimento da string de chave em bytes, menos 11 (para contabilizar o preenchimento).

*`key_str`* é uma chave pública ou privada RSA codificada PEM válida.

Para recuperar a cadeia original não criptografada, passe a cadeia criptografada para `asymmetric_decrypt()`, juntamente com a outra parte do par de chaves usado para criptografia, como no exemplo a seguir:

  ```
  -- Generate private/public key pair
  SET @priv = create_asymmetric_priv_key('RSA', 1024);
  SET @pub = create_asymmetric_pub_key('RSA', @priv);

  -- Encrypt using private key, decrypt using public key
  SET @ciphertext = asymmetric_encrypt('RSA', 'The quick brown fox', @priv);
  SET @plaintext = asymmetric_decrypt('RSA', @ciphertext, @pub);

  -- Encrypt using public key, decrypt using private key
  SET @ciphertext = asymmetric_encrypt('RSA', 'The quick brown fox', @pub);
  SET @plaintext = asymmetric_decrypt('RSA', @ciphertext, @priv);
  ```

Suponha que:

  ```
  SET @s = a string to be encrypted
  SET @priv = a valid private RSA key string in PEM format
  SET @pub = the corresponding public RSA key string in PEM format
  ```

Então, essas relações de identidade são válidas:

  ```
  asymmetric_decrypt('RSA', asymmetric_encrypt('RSA', @s, @priv), @pub) = @s
  asymmetric_decrypt('RSA', asymmetric_encrypt('RSA', @s, @pub), @priv) = @s
  ```

* `asymmetric_sign(algorithm, digest_str, priv_key_str, digest_type)`

Assina uma string de digest usando uma string de chave privada e retorna a assinatura como uma string binária. Se a assinatura falhar, o resultado é `NULL`.

*`algorithm`* é o algoritmo de criptografia utilizado para criar a chave. Os valores do algoritmo suportados são `'RSA'` e `'DSA'`.

*`digest_str`* é uma string de digestão. Uma string de digestão pode ser gerada ao chamar `create_digest()`.

*`priv_key_str`* é a string da chave privada a ser usada para assinar a string de digest. Pode ser uma chave privada RSA codificada em PEM válida ou uma chave privada DSA.

*`digest_type`* é o algoritmo a ser utilizado para assinar os dados. Os valores suportados de *`digest_type`* são `'SHA224'`, `'SHA256'`, `'SHA384'` e `'SHA512'`.

Para um exemplo de uso, veja a descrição de `asymmetric_verify()`.

* `asymmetric_verify(algorithm, digest_str, sig_str, pub_key_str, digest_type)`

Verifica se a string de assinatura corresponde à string de digestão e retorna 1 ou 0 para indicar se a verificação foi bem-sucedida ou não. Se a verificação falhar, o resultado é `NULL`.

A função da biblioteca compartilhada `openssl_udf` não pode verificar o conteúdo produzido pelas funções `component_enterprise_encryption` que estão disponíveis a partir do MySQL 8.0.30.

*`algorithm`* é o algoritmo de criptografia utilizado para criar a chave. Os valores do algoritmo suportados são `'RSA'` e `'DSA'`.

*`digest_str`* é a string de digestão. Uma string de digestão é necessária e pode ser gerada chamando `create_digest()`.

*`sig_str`* é a string de assinatura a ser verificada. Uma string de assinatura pode ser gerada ao chamar `asymmetric_sign()`.

*`pub_key_str`* é a string da chave pública do signatário. Ela corresponde à chave privada passada para `asymmetric_sign()` para gerar a string de assinatura. Ela deve ser uma chave pública RSA ou DSA codificada em PEM válida.

*`digest_type`* é o algoritmo que foi usado para assinar os dados. Os valores suportados de *`digest_type`* são `'SHA224'`, `'SHA256'`, `'SHA384'` e `'SHA512'`.

  ```
  -- Set the encryption algorithm and digest type
  SET @algo = 'RSA';
  SET @dig_type = 'SHA224';

  -- Create private/public key pair
  SET @priv = create_asymmetric_priv_key(@algo, 1024);
  SET @pub = create_asymmetric_pub_key(@algo, @priv);

  -- Generate digest from string
  SET @dig = create_digest(@dig_type, 'The quick brown fox');

  -- Generate signature for digest and verify signature against digest
  SET @sig = asymmetric_sign(@algo, @dig, @priv, @dig_type);
  SET @verf = asymmetric_verify(@algo, @dig, @sig, @pub, @dig_type);
  ```

* `create_asymmetric_priv_key(algorithm, {key_len|dh_secret})`

Cria uma chave privada usando o algoritmo e o comprimento de chave ou segredo DH fornecidos, e retorna a chave como uma string binária no formato PEM. A chave está no formato PKCS #1. Se a geração da chave falhar, o resultado é `NULL`.

*`algorithm`* é o algoritmo de criptografia utilizado para criar a chave. Os valores do algoritmo suportados são `'RSA'`, `'DSA'` e `'DH'`.

*`key_len`* é o comprimento da chave em bits para chaves RSA e DSA. Se você exceder o comprimento máximo permitido da chave ou especificar menos que o mínimo, a geração da chave falha e o resultado é uma saída nula. O comprimento mínimo permitido da chave em bits é 1.024, e o comprimento máximo permitido da chave é 16.384 para o algoritmo RSA ou 10.000 para o algoritmo DSA. Esses limites de comprimento de chave são restrições impostas pelo OpenSSL. Os administradores do servidor podem impor limites adicionais sobre o comprimento máximo da chave definindo as variáveis de ambiente `MYSQL_OPENSSL_UDF_RSA_BITS_THRESHOLD`, `MYSQL_OPENSSL_UDF_DSA_BITS_THRESHOLD` e `MYSQL_OPENSSL_UDF_DH_BITS_THRESHOLD`. Veja a Seção 8.6.2, “Configurando a Encriptação da Empresa MySQL”.

Nota

Gerar chaves mais longas pode consumir recursos significativos do CPU. Limitar o comprimento da chave usando as variáveis de ambiente permite que você forneça segurança adequada para suas necessidades, equilibrando isso com o uso de recursos.

*`dh_secret`* é um segredo compartilhado de DH, que deve ser passado em vez do comprimento da chave para as chaves de DH. Para criar o segredo, passe o comprimento da chave para `create_dh_parameters()`.

Este exemplo cria uma chave privada DSA de 2.048 bits, e depois deriva uma chave pública a partir da chave privada:

  ```
  SET @priv = create_asymmetric_priv_key('DSA', 2048);
  SET @pub = create_asymmetric_pub_key('DSA', @priv);
  ```

Para um exemplo que mostra a geração de chave DH, veja a descrição de `asymmetric_derive()`.

* `create_asymmetric_pub_key(algorithm, priv_key_str)`

Desenha uma chave pública a partir da chave privada fornecida usando o algoritmo fornecido e retorna a chave como uma string binária no formato PEM. A chave está no formato PKCS #1. Se a derivação da chave falhar, o resultado é `NULL`.

*`algorithm`* é o algoritmo de criptografia utilizado para criar a chave. Os valores do algoritmo suportados são `'RSA'`, `'DSA'` e `'DH'`.

*`priv_key_str`* é uma chave privada RSA, DSA ou DH válida codificada em PEM.

Para um exemplo de uso, veja a descrição de `create_asymmetric_priv_key()`.

* `create_dh_parameters(key_len)`

Cria um segredo compartilhado para gerar um par de chave privada/pública DH e retorna uma string binária que pode ser passada para `create_asymmetric_priv_key()`. Se a geração do segredo falhar, o resultado é `NULL`.

*`key_len`* é o comprimento da chave. Os comprimentos mínimos e máximos de chave em bits são 1.024 e 10.000. Esses limites de comprimento de chave são restrições impostas pelo OpenSSL. Os administradores do servidor podem impor limites adicionais sobre o comprimento máximo de chave definindo as variáveis de ambiente `MYSQL_OPENSSL_UDF_RSA_BITS_THRESHOLD`, `MYSQL_OPENSSL_UDF_DSA_BITS_THRESHOLD` e `MYSQL_OPENSSL_UDF_DH_BITS_THRESHOLD`. Veja a Seção 8.6.2, “Configurando a Encriptação da Empresa MySQL”.

Para um exemplo que mostra como usar o valor de retorno para gerar chaves simétricas, veja a descrição de `asymmetric_derive()`.

  ```
  SET @dhp = create_dh_parameters(1024);
  ```

* `create_digest(digest_type, str)`

Cria um resumo da string fornecida usando o tipo de digest fornecido e retorna o digest como uma string binária. Se a geração de digest falhar, o resultado é `NULL`.

A string de digest resultante é adequada para uso com `asymmetric_sign()` e `asymmetric_verify()`. Uma digest é necessária para essas funções.

*`digest_type`* é o algoritmo de digest que deve ser usado para gerar a string de digest. Os valores suportados de *`digest_type`* são `'SHA224'`, `'SHA256'`, `'SHA384'` e `'SHA512'`.

*`str`* é a string de dados não nula para a qual o digest deve ser gerado.

  ```
  SET @dig = create_digest('SHA512', 'The quick brown fox');
  ```
