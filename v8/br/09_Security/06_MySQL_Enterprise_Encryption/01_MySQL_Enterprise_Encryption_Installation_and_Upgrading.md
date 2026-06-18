### 8.6.1 Instalação e atualização da criptografia do MySQL Enterprise

Em versões anteriores ao MySQL 8.0.30, as funções fornecidas pelo MySQL Enterprise Encryption eram instaladas criando-as individualmente, com base na `openssl_udf` biblioteca compartilhada. A partir do MySQL 8.0.30, as funções são fornecidas por um componente do MySQL `component_enterprise_encryption`, e a instalação do componente instala todas as funções. As funções da `openssl_udf` biblioteca compartilhada são desatualizadas a partir dessa versão e você deve atualizar para o componente.

- Instalação a partir do MySQL 8.0.30
- Instalação para o MySQL 8.0.29
- Atualizando a criptografia do MySQL Enterprise

#### Instalação a partir do MySQL 8.0.30

A partir do MySQL 8.0.30, as funções do MySQL Enterprise Encryption são fornecidas por um componente do MySQL `component_enterprise_encryption`, em vez de serem instaladas a partir da `openssl_udf` biblioteca compartilhada. Se você estiver atualizando para o MySQL 8.0.30 a partir de uma versão anterior em que você usou o MySQL Enterprise Encryption, as funções que você criou permanecem disponíveis e são suportadas. No entanto, essas funções legadas são desatualizadas a partir desta versão e é recomendável que você instale o componente em vez disso. As funções do componente são compatíveis com versões anteriores. Para obter informações sobre a atualização, consulte Atualizando o MySQL Enterprise Encryption.

Se você estiver atualizando, antes de instalar o componente, descarregue as funções legadas usando a instrução `DROP FUNCTION`:

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

Os nomes das funções devem ser especificados em minúsculas. As instruções exigem o privilégio `DROP` para o banco de dados `mysql`.

Para instalar o componente, execute uma declaração `INSTALL COMPONENT`:

```
INSTALL COMPONENT "file://component_enterprise_encryption";
```

O `INSTALL COMPONENT` requer o privilégio `INSERT` para a tabela de sistema `mysql.component`, pois adiciona uma linha a essa tabela para registrar o componente. Para verificar se o componente foi instalado, execute:

```
SELECT * FROM mysql.component;
```

Os componentes listados em `mysql.component` são carregados pelo serviço de carregamento durante a sequência de inicialização.

Se você precisar desinstalar o componente, emita uma declaração `UNINSTALL COMPONENT`:

```
UNINSTALL COMPONENT "file://component_enterprise_encryption";
```

Para mais detalhes, consulte a Seção 7.5.1, “Instalando e Desinstalando Componentes”.

A instalação do componente instala todas as funções, então você não precisa criá-las usando as instruções `CREATE FUNCTION` como antes do MySQL 8.0.30. A desinstalação do componente desinstala todas as funções.

Quando você tiver instalado o componente, se quiser que as funções do componente suportem descriptografia e verificação para conteúdo produzido pelas funções legadas antes do MySQL 8.0.30, defina a variável de sistema do componente `enterprise_encryption.rsa_support_legacy_padding` para `ON`. Além disso, se quiser alterar o comprimento máximo permitido para as chaves RSA geradas pelas funções do componente, use a variável de sistema do componente `enterprise_encryption.maximum_rsa_key_size` para definir um valor máximo apropriado. Para informações de configuração, consulte a Seção 8.6.2, “Configurando a Criptografia do MySQL Enterprise”.

#### Instalação para o MySQL 8.0.29

Antes do MySQL 8.0.29, as funções de criptografia do MySQL Enterprise estão localizadas em um arquivo de biblioteca de funções carregável instalado no diretório do plugin (o diretório nomeado pela variável de sistema `plugin_dir`). O nome da base da biblioteca de funções é `openssl_udf` e o sufixo depende da plataforma. Por exemplo, o nome do arquivo no Linux ou no Windows é `openssl_udf.so` ou `openssl_udf.dll`, respectivamente.

Para instalar funções do arquivo de biblioteca compartilhada `openssl_udf`, use a instrução `CREATE FUNCTION`. Para carregar todas as funções da biblioteca, use este conjunto de instruções, ajustando o sufixo do nome do arquivo conforme necessário:

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

Uma vez instalado, as funções permanecem instaladas após reinicializações do servidor. Se você precisar desativar as funções, use a instrução `DROP FUNCTION`:

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

Nas declarações `CREATE FUNCTION` e `DROP FUNCTION`, os nomes das funções devem ser especificados em minúsculas. Isso difere do uso deles no momento da invocação da função, para o qual você pode usar qualquer caso de letra.

As instruções `CREATE FUNCTION` e `DROP FUNCTION` exigem o privilégio `INSERT` e `DROP`, respectivamente, para o banco de dados `mysql`.

As funções fornecidas pela biblioteca compartilhada `openssl_udf` permitem um tamanho mínimo de chave de 1024 bits. Você pode definir um tamanho máximo de chave usando as variáveis de ambiente `MYSQL_OPENSSL_UDF_RSA_BITS_THRESHOLD`, `MYSQL_OPENSSL_UDF_DSA_BITS_THRESHOLD` e `MYSQL_OPENSSL_UDF_DH_BITS_THRESHOLD`, conforme descrito na Seção 8.6.2, “Configurando a Criptografia da MySQL Enterprise”. Se você não definir um tamanho máximo de chave, o limite superior é de 16384 para o algoritmo RSA e 10000 para o algoritmo DSA, conforme especificado pelo OpenSSL.

#### Atualizando a criptografia do MySQL Enterprise

Se você atualizar para o MySQL 8.0.30 ou uma versão posterior a partir de uma versão anterior em que você usou as funções fornecidas pela biblioteca compartilhada `openssl_udf`, as funções que você criou permanecem disponíveis e são suportadas. No entanto, essas funções legadas são desaconselhadas a partir do MySQL 8.0.30, e é recomendável que você instale o componente de criptografia do MySQL Enterprise `component_enterprise_encryption` em vez disso.

Ao fazer uma atualização, antes de instalar o componente, você deve desativar as funções legadas usando a instrução `DROP FUNCTION`. Para obter instruções sobre como fazer isso, consulte Instalação a partir do MySQL 8.0.30.

As funções do componente são compatíveis com versões anteriores:

- As chaves públicas e privadas RSA geradas pelas funções legadas podem ser usadas com as funções do componente.

- Os dados criptografados com as funções legadas podem ser descriptografados pelas funções do componente.

- As assinaturas criadas pelas funções legadas podem ser verificadas com as funções do componente.

Para que as funções de componente suportem a descriptografia e a verificação de conteúdo produzido pelas funções legadas, você deve definir a variável de sistema `enterprise_encryption.rsa_support_legacy_padding` para `ON` (o padrão é `OFF`). Para informações de configuração, consulte a Seção 8.6.2, “Configurando a Encriptação do MySQL Enterprise”.

As funções de legado não podem lidar com dados criptografados, chaves públicas e assinaturas criadas pelas funções de componente, devido às diferenças no alinhamento e no formato da chave usadas pelas funções de componente para atender aos padrões atuais.

As novas funções fornecidas pelo componente `component_enterprise_encryption` têm algumas diferenças de comportamento e suporte em relação às funções legadas fornecidas pela biblioteca compartilhada `openssl_udf`. As mais importantes são as seguintes:

- As funções de legado suportam o algoritmo DSA mais antigo e o método de troca de chaves Diffie-Hellman. As funções do componente usam apenas o algoritmo RSA geralmente preferido.

- Para as funções de legado, o tamanho mínimo da chave RSA é menor do que a melhor prática atual. As funções do componente seguem a melhor prática atual em relação ao tamanho mínimo da chave RSA.

- As funções de legado suportam apenas SHA2 para digests e exigem digests para assinaturas. As funções do componente também suportam SHA3 para digests (desde que o OpenSSL 1.1.1 esteja em uso) e não exigem digests para assinaturas, embora as suportem.

- A função herdeira `asymmetric_encrypt()` suporta criptografia usando chaves privadas. A função componente `asymmetric_encrypt()` aceita apenas uma chave pública. Recomenda-se que você também criptografie apenas usando chaves públicas com a função herdeira.

- As funções herdadas `create_dh_parameters()` e `asymmetric_derive()` para o método de troca de chaves Diffie-Hellman não são fornecidas pelo componente `component_enterprise_encryption`.

A Tabela 1 resume as diferenças técnicas no suporte e operação entre as funções legadas fornecidas pela biblioteca compartilhada `openssl_udf` e as funções fornecidas pelo componente `component_enterprise_encryption` do MySQL 8.0.30.

**Tabela 8.48 Funções de criptografia do MySQL Enterprise**

<table frame="all" summary="Compara a capacidade das funções de criptografia antes e a partir do MySQL 8.0.30."><thead><tr> <th scope="col"><p>Capacidade</p></th> <th scope="col"><p>Funções de legado (para MySQL 8.0.29)</p></th> <th scope="col"><p>Funções de componentes (a partir do MySQL 8.0.30)</p></th> </tr></thead><tbody><tr> <th><p>Método de criptografia</p></th> <td><p>RSA, DSA, Diffie-Hellman (DH)</p></td> <td><p>Apenas RSA</p></td> </tr><tr> <th><p>Chave para criptografia</p></th> <td><p>Privada ou pública</p></td> <td><p>Apenas para o público</p></td> </tr><tr> <th><p>Formato da chave RSA</p></th> <td><p>PKCS #1 v1.5</p></td> <td><p>PKCS #8</p></td> </tr><tr> <th><p>Tamanho mínimo da chave RSA</p></th> <td><p>1024 bits</p></td> <td><p>2048 bits</p></td> </tr><tr> <th>Limite máximo de tamanho da chave RSA</th> <td><p>Conjunto com variável de ambiente [[<code>MYSQL_OPENSSL_UDF_RSA_BITS_THRESHOLD</code>]], limite padrão é máximo de algoritmo 16384</p></td> <td><p>Conjunto com a variável de sistema [[<code>enterprise_encryption.maximum_rsa_key_size</code>]], limite padrão é 4096</p></td> </tr><tr> <th>Algoritmos de digestão</th> <td><p>SHA2</p></td> <td><p>SHA2, SHA3 (com OpenSSL 1.1.1)</p></td> </tr><tr> <th>Assinaturas</th> <td><p>Digest required</p></td> <td><p>Digestos suportados, mas não são obrigatórios. Pode-se usar qualquer sequência de comprimento arbitrário</p></td> </tr><tr> <th>Ajuste de saída</th> <td><p>RSAES-PKCS1-v1_5</p></td> <td><p>RSAES-OAEP</p></td> </tr><tr> <th>Acabamento de assinatura</th> <td><p>RSASSA-PKCS1-v1_5</p></td> <td><p>RSASSA-PSS</p></td> </tr></tbody></table>
