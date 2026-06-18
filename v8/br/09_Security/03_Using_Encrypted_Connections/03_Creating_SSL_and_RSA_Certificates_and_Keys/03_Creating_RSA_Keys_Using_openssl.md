#### 8.3.3.3 Criando Chaves RSA Usando o openssl

Esta seção descreve como usar o comando **openssl** para configurar os arquivos de chave RSA que permitem que o MySQL suporte a troca segura de senhas em conexões não criptografadas para contas autenticadas pelos plugins `sha256_password` e `caching_sha2_password`.

Nota

Existem alternativas mais fáceis para gerar os arquivos necessários para o RSA do que o procedimento descrito aqui: deixe o servidor gerar automaticamente ou use o programa **mysql\_ssl\_rsa\_setup** (desatualizado a partir do MySQL 8.0.34). Veja a Seção 8.3.3.1, “Criando Certificados e Chaves SSL e RSA usando o MySQL”.

Para criar os arquivos de par de chaves privadas e públicas do RSA, execute esses comandos enquanto estiver logado na conta do sistema usada para executar o servidor MySQL, para que os arquivos pertençam a essa conta:

```
openssl genrsa -out private_key.pem 2048
openssl rsa -in private_key.pem -pubout -out public_key.pem
```

Esses comandos criam chaves de 2.048 bits. Para criar chaves mais fortes, use um valor maior.

Em seguida, defina os modos de acesso para os arquivos de chave. A chave privada deve ser legível apenas pelo servidor, enquanto a chave pública pode ser distribuída livremente para os usuários do cliente:

```
chmod 400 private_key.pem
chmod 444 public_key.pem
```
