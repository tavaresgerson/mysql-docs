## 8.6 Criptografia da MySQL Enterprise

::: info Nota

A Criptografia da MySQL Enterprise é uma extensão incluída na MySQL Enterprise Edition, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

:::

A MySQL Enterprise Edition inclui um conjunto de funções de criptografia que expõem as capacidades do OpenSSL ao nível do SQL. As funções permitem que os aplicativos empresariais realizem as seguintes operações:

* Implementar proteção de dados adicional usando criptografia assimétrica de chave pública
* Criar chaves públicas e privadas e assinaturas digitais
* Realizar criptografia e descriptografia assimétricas
* Usar hashing criptográfico para assinatura digital e verificação e validação de dados

Essas funções são fornecidas pelo componente `component_enterprise_encryption` do MySQL.