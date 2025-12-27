## 8.6 Encriptação do MySQL Enterprise

8.6.1 Instalação e Atualização da Encriptação do MySQL Enterprise

8.6.2 Configuração da Encriptação do MySQL Enterprise

8.6.3 Uso e Exemplos da Encriptação do MySQL Enterprise

8.6.4 Referência de Funções do Componente de Encriptação do MySQL Enterprise

8.6.5 Descrições das Funções do Componente de Encriptação do MySQL Enterprise

Nota

A Encriptação do MySQL Enterprise é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

A Edição Empresarial do MySQL inclui um conjunto de funções de encriptação que expõem as capacidades do OpenSSL ao nível do SQL. As funções permitem que os aplicativos empresariais realizem as seguintes operações:

* Implementar proteção de dados adicional usando criptografia assimétrica de chave pública
* Criar chaves públicas e privadas e assinaturas digitais
* Realizar encriptação e descriptografia assimétrica
* Usar hashing criptográfico para assinatura digital e verificação e validação de dados

Essas funções são fornecidas pelo componente `component_enterprise_encryption` do MySQL.