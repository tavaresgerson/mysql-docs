### 6.3.4 Capacidades Dependentes da Biblioteca SSL

O MySQL pode ser compilado usando OpenSSL ou yaSSL, ambos habilitando conexões criptografadas baseadas na API OpenSSL:

* As distribuições binárias do MySQL Enterprise Edition são compiladas usando OpenSSL. Não é possível usar yaSSL com o MySQL Enterprise Edition.

* As distribuições binárias do MySQL Community Edition são compiladas usando yaSSL.

* As distribuições de código-fonte do MySQL Community Edition podem ser compiladas usando OpenSSL ou yaSSL (consulte [Seção 2.8.6, “Configurando Suporte à Biblioteca SSL”](source-ssl-library-configuration.html "2.8.6 Configurando Suporte à Biblioteca SSL")).

Nota

É possível compilar o MySQL usando yaSSL como alternativa ao OpenSSL somente antes do MySQL 5.7.28. A partir do MySQL 5.7.28, o suporte ao yaSSL é removido e todas as builds do MySQL utilizam OpenSSL.

OpenSSL e yaSSL oferecem a mesma funcionalidade básica, mas as distribuições do MySQL compiladas usando OpenSSL possuem recursos adicionais:

* OpenSSL oferece suporte aos protocolos TLSv1, TLSv1.1 e TLSv1.2. yaSSL suporta apenas os protocolos TLSv1 e TLSv1.1.

* OpenSSL suporta uma sintaxe mais flexível para especificar ciphers (para a variável de sistema [`ssl_cipher`] e a opção de cliente [`--ssl-cipher`]), e suporta uma gama mais ampla de ciphers de criptografia para escolha. Consulte [Opções de Comando para Conexões Criptografadas](connection-options.html#encrypted-connection-options "Opções de Comando para Conexões Criptografadas") e [Seção 6.3.2, “Protocolos e Ciphers TLS de Conexão Criptografada”](encrypted-connection-protocols-ciphers.html "6.3.2 Protocolos e Ciphers TLS de Conexão Criptografada").

* OpenSSL suporta a variável de sistema [`ssl_capath`] e a opção de cliente [`--ssl-capath`]. As distribuições do MySQL compiladas usando yaSSL não suportam, pois yaSSL não busca em nenhum diretório nem segue uma árvore de certificados em cadeia (chained certificate tree). yaSSL exige que todos os componentes da árvore de certificados CA estejam contidos em uma única árvore de certificados CA e que cada certificado no arquivo tenha um valor SubjectName exclusivo. Para contornar essa limitação, concatene os arquivos de certificados individuais que compõem a árvore de certificados em um novo arquivo e especifique esse arquivo como o valor da variável de sistema [`ssl_ca`] e da opção [`--ssl-ca`].

* OpenSSL suporta a capacidade de lista de revogação de certificados (certificate revocation-list capability) (para as variáveis de sistema [`ssl_crl`] e [`ssl_crlpath`] e as opções de cliente [`--ssl-crl`] e [`--ssl-crlpath`]). Distribuições compiladas usando yaSSL não suportam porque as listas de revogação não funcionam com yaSSL. (yaSSL aceita essas opções, mas as ignora silenciosamente.)

* Contas que se autenticam usando o plugin `sha256_password` podem usar arquivos de chave RSA para troca segura de senhas em conexões não criptografadas. Consulte [Seção 6.4.1.5, “Autenticação Pluggable SHA-256”](sha256-pluggable-authentication.html "6.4.1.5 Autenticação Pluggable SHA-256").

* O server pode gerar automaticamente certificados SSL e RSA e arquivos de chave ausentes na inicialização. Consulte [Seção 6.3.3.1, “Criação de Certificados e Chaves SSL e RSA usando MySQL”](creating-ssl-rsa-files-using-mysql.html "6.3.3.1 Criação de Certificados e Chaves SSL e RSA usando MySQL").

* OpenSSL suporta mais modos de criptografia para as funções [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) e [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt). Consulte [Seção 12.13, “Funções de Criptografia e Compressão”](encryption-functions.html "12.13 Funções de Criptografia e Compressão").

Certas variáveis de sistema e status relacionadas ao OpenSSL estão presentes apenas se o MySQL foi compilado usando OpenSSL:

* [`auto_generate_certs`]
* [`sha256_password_auto_generate_rsa_keys`]
* [`sha256_password_private_key_path`]
* [`sha256_password_public_key_path`]
* [`Rsa_public_key`]

Para determinar se um server foi compilado usando OpenSSL, teste a existência de qualquer uma dessas variáveis. Por exemplo, esta instrução retorna uma linha se OpenSSL foi usado e um resultado vazio se yaSSL foi usado:

```sql
SHOW STATUS LIKE 'Rsa_public_key';
```