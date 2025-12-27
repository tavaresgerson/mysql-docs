#### 8.3.3.3 Criando Chaves RSA Usando o openssl

Esta seção descreve como usar o comando `openssl` para configurar os arquivos de chave RSA que permitem que o MySQL suporte a troca segura de senhas por meio de conexões não criptografadas para contas autenticadas pelos plugins `sha256_password` (desatualizado) e `caching_sha2_password`.

::: info Nota

Uma alternativa mais fácil para gerar os arquivos necessários para SSL do que o procedimento descrito aqui é permitir que o servidor os gere automaticamente; consulte a Seção 8.3.3.1, “Criando Certificados e Chaves SSL e RSA usando o MySQL”.

:::

Para criar os arquivos de chave pública e privada RSA, execute esses comandos enquanto estiver logado na conta do sistema usada para executar o servidor MySQL, para que os arquivos pertençam a essa conta:

```
openssl genrsa -out private_key.pem 2048
openssl rsa -in private_key.pem -pubout -out public_key.pem
```

Esses comandos criam chaves de 2.048 bits. Para criar chaves mais fortes, use um valor maior.

Em seguida, defina os modos de acesso para os arquivos de chave. A chave privada deve ser legível apenas pelo servidor, enquanto a chave pública pode ser distribuída livremente para os usuários clientes:

```
chmod 400 private_key.pem
chmod 444 public_key.pem
```