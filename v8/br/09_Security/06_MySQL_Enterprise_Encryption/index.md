## 8.6. Criptografia da MySQL Enterprise

8.6.1 Instalação e atualização da criptografia do MySQL Enterprise

8.6.2 Configurando a Encriptação do MySQL Enterprise

8.6.3 Uso e exemplos de criptografia do MySQL Enterprise

8.6.4 Referência da Função de Criptografia do MySQL Enterprise

8.6.5 Descrições de Função do Componente de Criptografia da MySQL Enterprise

8.6.6 Descrições de funções de criptografia do MySQL Enterprise Legacy

Nota

O MySQL Enterprise Encryption é uma extensão incluída na MySQL Enterprise Edition, um produto comercial. Para saber mais sobre produtos comerciais, <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL inclui um conjunto de funções de criptografia que expõem as capacidades do OpenSSL no nível do SQL. As funções permitem que os aplicativos empresariais realizem as seguintes operações:

- Implemente proteção de dados adicional usando criptografia assimétrica de chave pública

- Criar chaves públicas e privadas e assinaturas digitais

- Realizar criptografia e descriptografia assimétrica

- Use hashing criptográfico para assinatura digital e verificação e validação de dados

Em versões anteriores ao MySQL 8.0.30, essas funções são baseadas na biblioteca compartilhada `openssl_udf`. A partir do MySQL 8.0.30, elas são fornecidas por um componente do MySQL `component_enterprise_encryption`.
