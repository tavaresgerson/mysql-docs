## 6.6. Criptografia da MySQL Enterprise

Nota

O MySQL Enterprise Encryption é uma extensão incluída na MySQL Enterprise Edition, um produto comercial. Para saber mais sobre produtos comerciais, <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL inclui um conjunto de funções de criptografia com base na biblioteca OpenSSL, que expõem as capacidades da OpenSSL ao nível do SQL. Essas funções permitem que os aplicativos empresariais realizem as seguintes operações:

- Implemente proteção de dados adicional usando criptografia assimétrica de chave pública

- Criar chaves públicas e privadas e assinaturas digitais

- Realizar criptografia e descriptografia assimétrica

- Use hashing criptográfico para assinatura digital e verificação e validação de dados

O MySQL Enterprise Encryption suporta os algoritmos criptográficos RSA, DSA e DH.

O MySQL Enterprise Encryption é fornecido como uma biblioteca de funções carregáveis, das quais as funções individuais podem ser instaladas individualmente.
