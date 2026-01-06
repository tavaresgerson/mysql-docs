#### 6.3.3.3 Criando Chaves RSA Usando o openssl

Esta seção descreve como usar o comando **openssl** para configurar os arquivos de chave RSA que permitem que o MySQL suporte a troca segura de senhas em conexões não criptografadas para contas autenticadas pelo plugin `sha256_password`.

Nota

Existem alternativas mais fáceis para gerar os arquivos necessários para o RSA do que o procedimento descrito aqui: deixe o servidor gerar automaticamente ou use o programa **mysql\_ssl\_rsa\_setup**. Veja Seção 6.3.3.1, “Criando Certificados e Chaves SSL e RSA Usando o MySQL”.

Para criar os arquivos de par de chaves privadas e públicas do RSA, execute esses comandos enquanto estiver logado na conta do sistema usada para executar o servidor MySQL, para que os arquivos pertençam a essa conta:

```sql
openssl genrsa -out private_key.pem 2048
openssl rsa -in private_key.pem -pubout -out public_key.pem
```

Esses comandos criam chaves de 2.048 bits. Para criar chaves mais fortes, use um valor maior.

Em seguida, defina os modos de acesso para os arquivos de chave. A chave privada deve ser legível apenas pelo servidor, enquanto a chave pública pode ser distribuída livremente para os usuários do cliente:

```sql
chmod 400 private_key.pem
chmod 444 public_key.pem
```
