#### 6.3.3.3 Criação de Chaves RSA Usando openssl

Esta seção descreve como usar o comando **openssl** para configurar os arquivos de chave RSA que permitem ao MySQL oferecer suporte à troca segura de senhas em conexões não criptografadas para contas autenticadas pelo *plugin* `sha256_password`.

Nota

Existem alternativas mais fáceis para gerar os arquivos necessários para RSA do que o procedimento descrito aqui: Permita que o servidor os autogere ou use o programa [**mysql_ssl_rsa_setup**](mysql-ssl-rsa-setup.html "4.4.5 mysql_ssl_rsa_setup — Create SSL/RSA Files"). Consulte [Seção 6.3.3.1, “Criação de Certificados e Chaves SSL e RSA usando MySQL”](creating-ssl-rsa-files-using-mysql.html "6.3.3.1 Criação de Certificados e Chaves SSL e RSA usando MySQL").

Para criar os arquivos de par de chaves (*key-pair*) *private* e *public* RSA, execute estes comandos enquanto estiver logado na conta do sistema usada para executar o servidor MySQL, para que os arquivos sejam de propriedade dessa conta:

```sql
openssl genrsa -out private_key.pem 2048
openssl rsa -in private_key.pem -pubout -out public_key.pem
```

Esses comandos criam chaves de 2.048 bits. Para criar chaves mais fortes, use um valor maior.

Em seguida, defina os modos de acesso para os arquivos de *key*. A *private key* deve ser legível apenas pelo servidor, enquanto a *public key* pode ser distribuída livremente aos usuários *client*:

```sql
chmod 400 private_key.pem
chmod 444 public_key.pem
```