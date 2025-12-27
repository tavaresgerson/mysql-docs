#### 8.3.3.2 Criando Certificados e Chaves SSL Usando o openssl

Esta seção descreve como usar o comando `openssl` para configurar arquivos de certificado e chave SSL para uso por servidores e clientes MySQL. O primeiro exemplo mostra um procedimento simplificado, como você pode usar a partir da linha de comando. O segundo mostra um script que contém mais detalhes. Os dois primeiros exemplos são destinados ao uso em Unix e ambos usam o comando `openssl` que faz parte do OpenSSL. O terceiro exemplo descreve como configurar arquivos SSL no Windows.

::: info Nota

Uma alternativa mais fácil para gerar os arquivos necessários para SSL do que o procedimento descrito aqui é permitir que o servidor os gere automaticamente; veja a Seção 8.3.3.1, “Criando Certificados e Chaves SSL e RSA usando MySQL”.

:::

Importante

Independentemente do método usado para gerar os arquivos de certificado e chave, o valor do Nome Comum usado para os certificados/ Chaves do servidor e do cliente deve ser diferente do valor do Nome Comum usado para o certificado da CA. Caso contrário, os arquivos de certificado e chave não funcionarão para servidores compilados usando o OpenSSL. Um erro típico nesse caso é:

```
ERROR 2026 (HY000): SSL connection error:
error:00000001:lib(0):func(0):reason(1)
```

Importante

Se um cliente se conectar a uma instância do servidor MySQL usa um certificado SSL com a extensão `extendedKeyUsage` (uma extensão X.509 v3), a utilização de chave deve incluir autenticação de cliente (`clientAuth`). Se o certificado SSL for especificado apenas para autenticação do servidor (`serverAuth`) e outros propósitos de certificado não relacionados ao cliente, a verificação do certificado falha e a conexão do cliente com a instância do servidor MySQL falha. Não há extensão `extendedKeyUsage` nos certificados SSL criados usando o comando `openssl` seguindo as instruções neste tópico. Se você usar seu próprio certificado cliente criado de outra maneira, certifique-se de que qualquer extensão `extendedKeyUsage` inclua autenticação de cliente.

*  Exemplo 1: Criando Arquivos SSL a partir da Linha de Comando em Unix
*  Exemplo 2: Criando Arquivos SSL Usando um Script em Unix
*  Exemplo 3: Criando Arquivos SSL no Windows

##### Exemplo 1: Criando Arquivos SSL a partir da Linha de Comando no Unix

O exemplo a seguir mostra um conjunto de comandos para criar arquivos de certificado e chave de cliente e servidor do MySQL. Você deve responder a várias solicitações dos comandos `openssl`. Para gerar arquivos de teste, você pode pressionar Enter para todas as solicitações. Para gerar arquivos para uso em produção, você deve fornecer respostas não vazias.

```
# Create clean environment
rm -rf newcerts
mkdir newcerts && cd newcerts

# Create CA certificate
openssl genrsa 2048 > ca-key.pem
openssl req -new -x509 -nodes -days 3600 \
        -key ca-key.pem -out ca.pem

# Create server certificate, remove passphrase, and sign it
# server-cert.pem = public key, server-key.pem = private key
openssl req -newkey rsa:2048 -days 3600 \
        -nodes -keyout server-key.pem -out server-req.pem
openssl rsa -in server-key.pem -out server-key.pem
openssl x509 -req -in server-req.pem -days 3600 \
        -CA ca.pem -CAkey ca-key.pem -set_serial 01 -out server-cert.pem

# Create client certificate, remove passphrase, and sign it
# client-cert.pem = public key, client-key.pem = private key
openssl req -newkey rsa:2048 -days 3600 \
        -nodes -keyout client-key.pem -out client-req.pem
openssl rsa -in client-key.pem -out client-key.pem
openssl x509 -req -in client-req.pem -days 3600 \
        -CA ca.pem -CAkey ca-key.pem -set_serial 01 -out client-cert.pem
```

Após gerar os certificados, verifique-os:

```
openssl verify -CAfile ca.pem server-cert.pem client-cert.pem
```

Você deve ver uma resposta como esta:

```
server-cert.pem: OK
client-cert.pem: OK
```

Para ver o conteúdo de um certificado (por exemplo, para verificar o intervalo de datas em que um certificado é válido), inicie o `openssl` da seguinte forma:

```
openssl x509 -text -in ca.pem
openssl x509 -text -in server-cert.pem
openssl x509 -text -in client-cert.pem
```

Agora você tem um conjunto de arquivos que podem ser usados da seguinte forma:

* `ca.pem`: Use este para definir a variável de sistema `ssl_ca` no lado do servidor e a opção `--ssl-ca` no lado do cliente. (O certificado CA, se usado, deve ser o mesmo em ambos os lados.)
* `server-cert.pem`, `server-key.pem`: Use estes para definir as variáveis de sistema `ssl_cert` e `ssl_key` no lado do servidor.
* `client-cert.pem`, `client-key.pem`: Use estes como argumentos para as opções `--ssl-cert` e `--ssl-key` no lado do cliente.

Para obter instruções de uso adicionais, consulte a Seção 8.3.1, “Configurando o MySQL para Usar Conexões Encriptadas”.

##### Exemplo 2: Criando Arquivos SSL Usando um Script no Unix

Aqui está um exemplo de script que mostra como configurar arquivos de certificado e chave para o MySQL. Após executar o script, use os arquivos para conexões SSL conforme descrito na Seção 8.3.1, “Configurando o MySQL para Usar Conexões Encriptadas”.

```
DIR=`pwd`/openssl
PRIV=$DIR/private

mkdir $DIR $PRIV $DIR/newcerts
cp /usr/share/ssl/openssl.cnf $DIR
replace ./demoCA $DIR -- $DIR/openssl.cnf

# Create necessary files: $database, $serial and $new_certs_dir
# directory (optional)

touch $DIR/index.txt
echo "01" > $DIR/serial

#
# Generation of Certificate Authority(CA)
#

openssl req -new -x509 -keyout $PRIV/cakey.pem -out $DIR/ca.pem \
    -days 3600 -config $DIR/openssl.cnf

# Sample output:
# Using configuration from /home/jones/openssl/openssl.cnf
# Generating a 1024 bit RSA private key
# ................++++++
# .........++++++
# writing new private key to '/home/jones/openssl/private/cakey.pem'
# Enter PEM pass phrase:
# Verifying password - Enter PEM pass phrase:
# -----
# You are about to be asked to enter information to be
# incorporated into your certificate request.
# What you are about to enter is what is called a Distinguished Name
# or a DN.
# There are quite a few fields but you can leave some blank
# For some fields there will be a default value,
# If you enter '.', the field will be left blank.
# -----
# Country Name (2 letter code) [AU]:FI
# State or Province Name (full name) [Some-State]:.
# Locality Name (eg, city) []:
# Organization Name (eg, company) [Internet Widgits Pty Ltd]:MySQL AB
# Organizational Unit Name (eg, section) []:
# Common Name (eg, YOUR name) []:MySQL admin
# Email Address []:

#
# Create server request and key
#
openssl req -new -keyout $DIR/server-key.pem -out \
    $DIR/server-req.pem -days 3600 -config $DIR/openssl.cnf

# Sample output:
# Using configuration from /home/jones/openssl/openssl.cnf
# Generating a 1024 bit RSA private key
# ..++++++
# ..........++++++
# writing new private key to '/home/jones/openssl/server-key.pem'
# Enter PEM pass phrase:
# Verifying password - Enter PEM pass phrase:
# -----
# You are about to be asked to enter information that will be
# incorporated into your certificate request.
# What you are about to enter is what is called a Distinguished Name
# or a DN.
# There are quite a few fields but you can leave some blank
# For some fields there will be a default value,
# If you enter '.', the field will be left blank.
# -----
# Country Name (2 letter code) [AU]:FI
# State or Province Name (full name) [Some-State]:.
# Locality Name (eg, city) []:
# Organization Name (eg, company) [Internet Widgits Pty Ltd]:MySQL AB
# Organizational Unit Name (eg, section) []:
# Common Name (eg, YOUR name) []:MySQL server
# Email Address []:
#
# Please enter the following 'extra' attributes
# to be sent with your certificate request
# A challenge password []:
# An optional company name []:

#
# Remove the passphrase from the key
#
openssl rsa -in $DIR/server-key.pem -out $DIR/server-key.pem

#
# Sign server cert
#
openssl ca -cert $DIR/ca.pem -policy policy_anything \
    -out $DIR/server-cert.pem -config $DIR/openssl.cnf \
    -infiles $DIR/server-req.pem

# Sample output:
# Using configuration from /home/jones/openssl/openssl.cnf
# Enter PEM pass phrase:
# Check that the request matches the signature
# Signature ok
# The Subjects Distinguished Name is as follows
# countryName           :PRINTABLE:'FI'
# organizationName      :PRINTABLE:'MySQL AB'
# commonName            :PRINTABLE:'MySQL admin'
# Certificate is to be certified until Sep 13 14:22:46 2003 GMT
# (365 days)
# Sign the certificate? [y/n]:y
#
#
# 1 out of 1 certificate requests certified, commit? [y/n]y
# Write out database with 1 new entries
# Data Base Updated

#
# Create client request and key
#
openssl req -new -keyout $DIR/client-key.pem -out \
    $DIR/client-req.pem -days 3600 -config $DIR/openssl.cnf

# Sample output:
# Using configuration from /home/jones/openssl/openssl.cnf
# Generating a 1024 bit RSA private key
# .....................................++++++
# .............................................++++++
# writing new private key to '/home/jones/openssl/client-key.pem'
# Enter PEM pass phrase:
# Verifying password - Enter PEM pass phrase:
# -----
# You are about to be asked to enter information that will be
# incorporated into your certificate request.
# What you are about to enter is what is called a Distinguished Name
# or a DN.
# There are quite a few fields but you can leave some blank
# For some fields there will be a default value,
# If you enter '.', the field will be left blank.
# -----
# Country Name (2 letter code) [AU]:FI
# State or Province Name (full name) [Some-State]:.
# Locality Name (eg, city) []:
# Organization Name (eg, company) [Internet Widgits Pty Ltd]:MySQL AB
# Organizational Unit Name (eg, section) []:
# Common Name (eg, YOUR name) []:MySQL user
# Email Address []:
#
# Please enter the following 'extra' attributes
# to be sent with your certificate request
# A challenge password []:
# An optional company name []:

#
# Remove the passphrase from the key
#
openssl rsa -in $DIR/client-key.pem -out $DIR/client-key.pem

#
# Sign client cert
#

openssl ca -cert $DIR/ca.pem -policy policy_anything \
    -out $DIR/client-cert.pem -config $DIR/openssl.cnf \
    -infiles $DIR/client-req.pem

# Sample output:
# Using configuration from /home/jones/openssl/openssl.cnf
# Enter PEM pass phrase:
# Check that the request matches the signature
# Signature ok
# The Subjects Distinguished Name is as follows
# countryName           :PRINTABLE:'FI'
# organizationName      :PRINTABLE:'MySQL AB'
# commonName            :PRINTABLE:'MySQL user'
# Certificate is to be certified until Sep 13 16:45:17 2003 GMT
# (365 days)
# Sign the certificate? [y/n]:y
#
#
# 1 out of 1 certificate requests certified, commit? [y/n]y
# Write out database with 1 new entries
# Data Base Updated

#
# Create a my.cnf file that you can use to test the certificates
#

cat <<EOF > $DIR/my.cnf
[client]
ssl-ca=$DIR/ca.pem
ssl-cert=$DIR/client-cert.pem
ssl-key=$DIR/client-key.pem
[mysqld]
ssl_ca=$DIR/ca.pem
ssl_cert=$DIR/server-cert.pem
ssl_key=$DIR/server-key.pem
EOF
```

##### Exemplo 3: Criando Arquivos SSL no Windows

Baixe o OpenSSL para Windows se ele não estiver instalado no seu sistema. Uma visão geral dos pacotes disponíveis pode ser vista aqui:

```
http://www.slproweb.com/products/Win32OpenSSL.html
```

Escolha o pacote Win32 OpenSSL Light ou Win64 OpenSSL Light, dependendo da sua arquitetura (32 bits ou 64 bits). O local de instalação padrão é `C:\OpenSSL-Win32` ou `C:\OpenSSL-Win64`, dependendo do pacote que você baixou. As instruções a seguir assumem um local padrão de `C:\OpenSSL-Win32`. Modifique conforme necessário se você estiver usando o pacote de 64 bits.

Se uma mensagem ocorrer durante a instalação, indicando `'...componente crítico está ausente: Microsoft Visual C++ 2019 Redistributables'`, cancele a instalação e baixe um dos seguintes pacotes também, novamente dependendo da sua arquitetura (32 bits ou 64 bits):

* Redistribuíveis do Visual C++ 2008 (x86), disponíveis em:

  ```
  http://www.microsoft.com/downloads/details.aspx?familyid=9B2DA534-3E03-4391-8A4D-074B9F2BC1BF
  ```
* Redistribuíveis do Visual C++ 2008 (x64), disponíveis em:

  ```
  http://www.microsoft.com/downloads/details.aspx?familyid=bd2a6171-e2d6-4230-b809-9a8d7548c1b6
  ```

Após instalar o pacote adicional, reinicie o procedimento de instalação do OpenSSL.

Durante a instalação, deixe o caminho de instalação padrão como `C:\OpenSSL-Win32` e também deixe a opção padrão `'Copiar arquivos DLL do OpenSSL para o diretório do sistema do Windows'` selecionada.

Quando a instalação estiver concluída, adicione `C:\OpenSSL-Win32\bin` à variável do caminho do sistema do seu servidor (dependendo da sua versão do Windows, as instruções de configuração de caminho podem diferir ligeiramente):

1. No desktop do Windows, clique com o botão direito no ícone Meu Computador e selecione Propriedades.
2. Selecione a aba Avançado do menu Propriedades do Sistema que aparece e clique no botão Variáveis de Ambiente.
3. Sob Variáveis de Sistema, selecione Caminho e, em seguida, clique no botão Editar. O diálogo Editar Variável de Sistema deve aparecer.
4. Adicione `';C:\OpenSSL-Win32\bin'` no final (observe o ponto e vírgula).
5. Pressione OK 3 vezes.
6. Verifique se o OpenSSL foi integrado corretamente à variável de caminho abrindo uma nova console de comando (`Início>Executar>cmd.exe`) e verificando se o OpenSSL está disponível:

   ```
   Microsoft Windows [Version ...]
   Copyright (c) 2006 Microsoft Corporation. All rights reserved.

   C:\Windows\system32>cd \

   C:\>openssl
   OpenSSL> exit <<< If you see the OpenSSL prompt, installation was successful.

   C:\>
   ```

Após o OpenSSL ter sido instalado, use instruções semelhantes às do Exemplo 1 (mostrado anteriormente nesta seção), com as seguintes alterações:

* Altere os seguintes comandos Unix:

  ```
  # Create clean environment
  rm -rf newcerts
  mkdir newcerts && cd newcerts
  ```

  Em Windows, use esses comandos em vez disso:

  ```
  # Create clean environment
  md c:\newcerts
  cd c:\newcerts
  ```
* Quando um caractere `'\'` for exibido no final de uma linha de comando, esse caractere `'\'` deve ser removido e as linhas de comando devem ser inseridas todas em uma única linha.

Após gerar os arquivos de certificado e chave, para usá-los em conexões SSL, consulte a Seção 8.3.1, “Configurando o MySQL para usar conexões criptografadas”.