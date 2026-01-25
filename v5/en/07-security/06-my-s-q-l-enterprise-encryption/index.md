## 6.6 MySQL Enterprise Encryption

[6.6.1 Instalação do MySQL Enterprise Encryption](enterprise-encryption-installation.html)

[6.6.2 Uso e Exemplos do MySQL Enterprise Encryption](enterprise-encryption-usage.html)

[6.6.3 Referência de Funções do MySQL Enterprise Encryption](enterprise-encryption-function-reference.html)

[6.6.4 Descrições das Funções do MySQL Enterprise Encryption](enterprise-encryption-functions.html)

Nota

MySQL Enterprise Encryption é uma extensão incluída no MySQL Enterprise Edition, um produto comercial. Para saber mais sobre produtos comerciais, acesse <https://www.mysql.com/products/>.

O MySQL Enterprise Edition inclui um conjunto de funções de encryption baseadas na biblioteca OpenSSL que expõem as capacidades do OpenSSL no nível SQL. Essas funções permitem que aplicações Enterprise realizem as seguintes operações:

* Implementar proteção de dados adicional usando public-key asymmetric cryptography
* Criar chaves públicas e privadas e digital signatures
* Executar asymmetric encryption e decryption
* Usar cryptographic hashing para digital signing e verificação e validação de dados

O MySQL Enterprise Encryption suporta os algoritmos criptográficos RSA, DSA e DH.

O MySQL Enterprise Encryption é fornecido como uma library de loadable functions, a partir da qual as funções individuais podem ser instaladas individualmente.