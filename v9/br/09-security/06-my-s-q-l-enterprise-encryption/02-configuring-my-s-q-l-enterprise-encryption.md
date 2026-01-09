### 8.6.2 Configurando a Criptografia da MySQL Enterprise

A Criptografia da MySQL Enterprise permite que você limite a duração das chaves para um comprimento que ofereça segurança adequada para suas necessidades, equilibrando isso com o uso de recursos. Você também pode configurar as funções fornecidas pelo componente `component_enterprise_encryption` para suportar descriptografia e verificação de conteúdo produzido pelas antigas funções da biblioteca compartilhada `openssl_udf`.

#### Suporte à Descriptografia por Funções do Componente para Funções Legadas

Por padrão, as funções fornecidas pelo componente `component_enterprise_encryption` não descriptografam texto criptografado ou verificam assinaturas que foram produzidas pelas funções legadas fornecidas em versões anteriores pela biblioteca compartilhada `openssl_udf`. As funções do componente assumem que o texto criptografado usa o esquema de enchimento RSAES-OAEP e que as assinaturas usam o esquema de assinatura RSASSA-PSS. No entanto, o texto criptografado produzido pelas funções legadas usa o esquema de enchimento RSAES-PKCS1-v1_5 e as assinaturas produzidas pelas funções legadas usam o esquema de assinatura RSASSA-PKCS1-v1_5.

Se você deseja que as funções do componente suportem o conteúdo produzido pelas funções legadas, defina a variável de sistema `enterprise_encryption.rsa_support_legacy_padding` para `ON`. Essa variável está disponível quando o componente é instalado. Quando você a define para `ON`, as funções do componente primeiro tentam descriptografar ou verificar o conteúdo, assumindo que ele tem seus esquemas normais. Se isso não funcionar, elas também tentam descriptografar ou verificar o conteúdo, assumindo que ele tem os esquemas usados pelas funções antigas. Esse comportamento não é o padrão porque aumenta o tempo necessário para processar conteúdo que não pode ser descriptografado ou verificado. Se você não está lidando com conteúdo produzido pelas funções antigas, deixe a variável de sistema em `OFF` por padrão.

#### Limites de comprimento de chave

A quantidade de recursos de CPU necessários pelas funções de geração de chaves da Encriptação Empresarial do MySQL aumenta à medida que o comprimento da chave aumenta. Para algumas instalações, isso pode resultar em um uso de CPU inaceitável se as aplicações gerarem frequentemente chaves excessivamente longas.

As funções fornecidas pelo componente `component_enterprise_encryption` têm um comprimento mínimo de chave de 2048 bits para chaves RSA, o que está alinhado com a melhor prática atual para comprimentos mínimos de chave. A variável de sistema `enterprise_encryption.maximum_rsa_key_size` especifica o tamanho máximo da chave.