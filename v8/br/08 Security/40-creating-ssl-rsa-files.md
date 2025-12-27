### 8.3.3 Criando Certificados e Chaves SSL e RSA

A discussão a seguir descreve como criar os arquivos necessários para o suporte SSL e RSA no MySQL. A criação de arquivos pode ser realizada usando as facilidades fornecidas pelo próprio MySQL ou invocando o comando `openssl` diretamente.

Os arquivos de certificado e chave SSL permitem que o MySQL suporte conexões criptografadas usando SSL. Veja a Seção 8.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”.

Os arquivos de chave RSA permitem que o MySQL suporte a troca segura de senhas em conexões não criptografadas para contas autenticadas pelo plugin `sha256_password` (desatualizado) ou `caching_sha2_password`. Veja a Seção 8.4.1.3, “Autenticação Pluggable SHA-256” e a Seção 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.