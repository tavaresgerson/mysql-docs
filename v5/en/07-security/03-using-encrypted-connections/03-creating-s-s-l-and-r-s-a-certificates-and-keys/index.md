### 6.3.3 Criação de Certificados e Chaves SSL e RSA

[6.3.3.1 Criação de Certificados e Chaves SSL e RSA usando MySQL](creating-ssl-rsa-files-using-mysql.html)

[6.3.3.2 Criação de Certificados e Chaves SSL usando openssl](creating-ssl-files-using-openssl.html)

[6.3.3.3 Criação de Chaves RSA usando openssl](creating-rsa-files-using-openssl.html)

A discussão a seguir descreve como criar os arquivos necessários para o suporte a SSL e RSA no MySQL. A criação de arquivos pode ser realizada usando recursos fornecidos pelo próprio MySQL ou invocando o comando **openssl** diretamente.

Arquivos de certificado e chave SSL permitem que o MySQL suporte conexões criptografadas usando SSL. Consulte [Seção 6.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”](using-encrypted-connections.html "6.3.1 Configurando o MySQL para Usar Conexões Criptografadas").

Arquivos de chave RSA permitem que o MySQL suporte a troca segura de senha em conexões não criptografadas para contas autenticadas pelo plugin `sha256_password`. Consulte [Seção 6.4.1.5, “Autenticação Plugável SHA-256”](sha256-pluggable-authentication.html "6.4.1.5 Autenticação Plugável SHA-256").