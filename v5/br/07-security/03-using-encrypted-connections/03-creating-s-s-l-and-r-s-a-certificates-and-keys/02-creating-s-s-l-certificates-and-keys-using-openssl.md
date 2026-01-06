#### 6.3.3.2 Criando Certificados e Chaves SSL Usando o openssl

Esta seção descreve como usar o comando **openssl** para configurar arquivos de certificado e chave SSL para uso por servidores e clientes MySQL. O primeiro exemplo mostra um procedimento simplificado, como você pode usar a partir da linha de comando. O segundo exemplo mostra um script que contém mais detalhes. Os dois primeiros exemplos são destinados ao uso em Unix e ambos usam o comando **openssl** que faz parte do OpenSSL. O terceiro exemplo descreve como configurar arquivos SSL no Windows.

Nota

Existem alternativas mais fáceis para gerar os arquivos necessários para o SSL do que o procedimento descrito aqui: deixe o servidor gerar automaticamente ou use o programa **mysql\_ssl\_rsa\_setup**. Veja Seção 6.3.3.1, “Criando Certificados e Chaves SSL e RSA usando o MySQL”.

Importante

Independentemente do método que você usar para gerar os arquivos de certificado e chave, o valor do Nome Comum usado para os certificados/chaves do servidor e do cliente deve ser diferente do valor do Nome Comum usado para o certificado da CA. Caso contrário, os arquivos de certificado e chave não funcionarão para servidores compilados com o OpenSSL. Um erro típico nesse caso é:

```sql
ERROR 2026 (HY000): SSL connection error:
error:00000001:lib(0):func(0):reason(1)
```

Importante

Se um cliente que se conecta a uma instância do servidor MySQL usar um certificado SSL com a extensão `extendedKeyUsage` (uma extensão X.509 v3), o uso de chave estendido deve incluir a autenticação do cliente (`clientAuth`). Se o certificado SSL for especificado apenas para autenticação do servidor (`serverAuth`) e para outros fins que não sejam de certificado do cliente, a verificação do certificado falha e a conexão do cliente com a instância do servidor MySQL falha. Não há extensão `extendedKeyUsage` em certificados SSL criados usando o comando **openssl** seguindo as instruções neste tópico. Se você usar seu próprio certificado do cliente criado de outra maneira, certifique-se de que qualquer extensão `extendedKeyUsage` inclua a autenticação do cliente.

- Exemplo 1: Criação de arquivos SSL a partir da linha de comando no Unix
- Exemplo 2: Criação de arquivos SSL usando um script no Unix
- Exemplo 3: Criação de arquivos SSL no Windows

##### Exemplo 1: Criação de arquivos SSL a partir da linha de comando no Unix

O exemplo a seguir mostra um conjunto de comandos para criar arquivos de certificado e chave do servidor e do cliente do MySQL. Você deve responder a várias solicitações pelos comandos **openssl**. Para gerar arquivos de teste, você pode pressionar Enter para todas as solicitações. Para gerar arquivos para uso em produção, você deve fornecer respostas não vazias.

```sql
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

```sql
openssl verify -CAfile ca.pem server-cert.pem client-cert.pem
```

Você deve ver uma resposta como esta:

```sql
server-cert.pem: OK
client-cert.pem: OK
```

Para ver o conteúdo de um certificado (por exemplo, para verificar a faixa de datas em que o certificado é válido), invoque o **openssl** da seguinte forma:

```sql
openssl x509 -text -in ca.pem
openssl x509 -text -in server-cert.pem
openssl x509 -text -in client-cert.pem
```

Agora você tem um conjunto de arquivos que podem ser usados da seguinte forma:

- `ca.pem`: Use isso para definir a variável de sistema `ssl_ca` no lado do servidor e a opção `--ssl-ca` no lado do cliente. (O certificado CA, se usado, deve ser o mesmo em ambos os lados.)

- `server-cert.pem`, `server-key.pem`: Use-os para definir as variáveis de sistema `ssl_cert` (server-system-variables.html#sysvar\_ssl\_cert) e `ssl_key` (server-system-variables.html#sysvar\_ssl\_key) no lado do servidor.

- `client-cert.pem`, `client-key.pem`: Use esses como argumentos nas opções `--ssl-cert` e `--ssl-key` no lado do cliente.

Para obter instruções adicionais de uso, consulte Seção 6.3.1, “Configurando o MySQL para usar conexões criptografadas”.

##### Exemplo 2: Criação de arquivos SSL usando um script no Unix

Aqui está um exemplo de script que mostra como configurar arquivos de certificado SSL e chave para o MySQL. Após executar o script, use os arquivos para conexões SSL conforme descrito em Seção 6.3.1, “Configurando o MySQL para usar conexões criptografadas”.

```sql
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
# Using configuration from /home/finley/openssl/openssl.cnf
# Generating a 1024 bit RSA private key
# ................++++++
# .........++++++
# writing new private key to '/home/finley/openssl/private/cakey.pem'
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
# Common Name (eg, YOUR name) []:MySQL admin
# Email Address []:

#
# Create server request and key
#
openssl req -new -keyout $DIR/server-key.pem -out \
    $DIR/server-req.pem -days 3600 -config $DIR/openssl.cnf

# Sample output:
# Using configuration from /home/finley/openssl/openssl.cnf
# Generating a 1024 bit RSA private key
# ..++++++
# ..........++++++
# writing new private key to '/home/finley/openssl/server-key.pem'
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
# Using configuration from /home/finley/openssl/openssl.cnf
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
# Using configuration from /home/finley/openssl/openssl.cnf
# Generating a 1024 bit RSA private key
# .....................................++++++
# .............................................++++++
# writing new private key to '/home/finley/openssl/client-key.pem'
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
# Using configuration from /home/finley/openssl/openssl.cnf
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

##### Exemplo 3: Criando arquivos SSL no Windows

Baixe o OpenSSL para Windows se ele não estiver instalado no seu sistema. Uma visão geral dos pacotes disponíveis pode ser vista aqui:

```sql
http://www.slproweb.com/products/Win32OpenSSL.html
```

Escolha o pacote Win32 OpenSSL Light ou Win64 OpenSSL Light, dependendo da sua arquitetura (32 bits ou 64 bits). O local de instalação padrão é `C:\OpenSSL-Win32` ou `C:\OpenSSL-Win64`, dependendo do pacote que você baixou. As instruções a seguir assumem um local padrão de `C:\OpenSSL-Win32`. Modifique conforme necessário se você estiver usando o pacote de 64 bits.

Se uma mensagem ocorrer durante a instalação, indicando `'...componente crítico está ausente: Microsoft Visual C++ 2008 Redistributable'`, cancele a instalação e faça o download de um dos seguintes pacotes, novamente dependendo da sua arquitetura (32 bits ou 64 bits):

- Visual C++ 2008 Redistribuíveis (x86), disponível em:

  ```sql
  http://www.microsoft.com/downloads/details.aspx?familyid=9B2DA534-3E03-4391-8A4D-074B9F2BC1BF
  ```

- Visual C++ 2008 Redistribuíveis (x64), disponível em:

  ```sql
  http://www.microsoft.com/downloads/details.aspx?familyid=bd2a6171-e2d6-4230-b809-9a8d7548c1b6
  ```

Após instalar o pacote adicional, reinicie o procedimento de configuração do OpenSSL.

Durante a instalação, deixe o caminho de instalação padrão `C:\OpenSSL-Win32` e também deixe a opção padrão `'Copiar arquivos DLL do OpenSSL para o diretório do sistema do Windows'` selecionada.

Quando a instalação estiver concluída, adicione `C:\OpenSSL-Win32\bin` à variável Caminho do Sistema do Windows do seu servidor (dependendo da versão do Windows, as instruções de configuração do caminho podem variar ligeiramente):

1. No desktop do Windows, clique com o botão direito no ícone Meu Computador e selecione Propriedades.

2. Selecione a guia Avançado no menu Propriedades do sistema que aparece e clique no botão Variáveis de ambiente.

3. Em Variáveis do sistema, selecione Caminho e, em seguida, clique no botão Editar. O diálogo Editar variável do sistema deve aparecer.

4. Adicione `';C:\OpenSSL-Win32\bin'` no final (observe o ponto e vírgula).

5. Pressione OK 3 vezes.

6. Verifique se o OpenSSL foi corretamente integrado à variável Path abrindo um novo console de comando (**Início>Executar>cmd.exe**) e verificando se o OpenSSL está disponível:

   ```sql
   Microsoft Windows [Version ...]
   Copyright (c) 2006 Microsoft Corporation. All rights reserved.

   C:\Windows\system32>cd \

   C:\>openssl
   OpenSSL> exit <<< If you see the OpenSSL prompt, installation was successful.

   C:\>
   ```

Depois que o OpenSSL for instalado, use instruções semelhantes às do Exemplo 1 (mostrado anteriormente nesta seção), com as seguintes alterações:

- Altere os seguintes comandos Unix:

  ```sql
  # Create clean environment
  rm -rf newcerts
  mkdir newcerts && cd newcerts
  ```

  No Windows, use esses comandos:

  ```sql
  # Create clean environment
  md c:\newcerts
  cd c:\newcerts
  ```

- Quando um caractere `'\'` é exibido no final de uma linha de comando, esse caractere `'\'` deve ser removido e as linhas de comando devem ser inseridas todas em uma única linha.

Após gerar os arquivos de certificado e chave, para usá-los em conexões SSL, consulte Seção 6.3.1, “Configurando o MySQL para usar conexões criptografadas”.
