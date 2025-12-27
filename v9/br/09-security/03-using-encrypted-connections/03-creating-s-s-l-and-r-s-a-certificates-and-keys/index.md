### 8.3.3 Criando Certificados e Chaves SSL e RSA

8.3.3.1 Criando Certificados e Chaves SSL e RSA usando o MySQL

8.3.3.2 Criando Certificados e Chaves SSL Usando o openssl

8.3.3.3 Criando Chaves RSA Usando o openssl

A discussão a seguir descreve como criar os arquivos necessários para o suporte SSL e RSA no MySQL. A criação de arquivos pode ser realizada usando as facilidades fornecidas pelo próprio MySQL ou invocando o comando **openssl** diretamente.

Os arquivos de certificado e chave SSL permitem que o MySQL suporte conexões criptografadas usando SSL. Veja a Seção 8.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”.

Os arquivos de chave RSA permitem que o MySQL suporte a troca segura de senhas em conexões não criptografadas para contas autenticadas pelo plugin `sha256_password` (desatualizado) ou `caching_sha2_password`. Veja a Seção 8.4.1.2, “Autenticação Desbloqueavel SHA-256” e a Seção 8.4.1.1, “Autenticação Desbloqueavel SHA-2”.