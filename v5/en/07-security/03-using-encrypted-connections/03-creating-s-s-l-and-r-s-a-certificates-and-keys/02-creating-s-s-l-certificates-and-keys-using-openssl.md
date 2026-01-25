#### 6.3.3.2 Criando Certificados e Chaves SSL Usando openssl

Esta seção descreve como usar o comando **openssl** para configurar arquivos de Certificate e Key SSL para uso por servidores e clients MySQL. O primeiro exemplo mostra um procedimento simplificado, como o que você usaria na linha de comando. O segundo mostra um script que contém mais detalhes. Os dois primeiros exemplos são destinados ao uso em Unix e ambos utilizam o comando **openssl** que faz parte do OpenSSL. O terceiro exemplo descreve como configurar arquivos SSL no Windows.

Note

Existem alternativas mais fáceis para gerar os arquivos necessários para SSL do que o procedimento descrito aqui: Permita que o server os autogere ou use o programa [**mysql_ssl_rsa_setup**](mysql-ssl-rsa-setup.html "4.4.5 mysql_ssl_rsa_setup — Create SSL/RSA Files"). Consulte [Seção 6.3.3.1, “Criando Certificados e Chaves SSL e RSA usando MySQL”](creating-ssl-rsa-files-using-mysql.html "6.3.3.1 Creating SSL and RSA Certificates and Keys using MySQL").

Importante

Qualquer que seja o método que você utilize para gerar os arquivos de Certificate e Key, o valor do Common Name usado para os certificates/keys do server e do client deve ser diferente do valor do Common Name usado para o CA certificate. Caso contrário, os arquivos de Certificate e Key não funcionarão para servers compilados usando OpenSSL. Um erro típico neste caso é:

```sql
ERROR 2026 (HY000): SSL connection error:
error:00000001:lib(0):func(0):reason(1)
```

Importante

Se um client que se conecta a uma instância do MySQL server usar um SSL certificate com a extensão `extendedKeyUsage` (uma extensão X.509 v3), o extended key usage deve incluir autenticação de client (`clientAuth`). Se o SSL certificate for especificado apenas para autenticação de server (`serverAuth`) e outros propósitos que não sejam de client certificate, a verificação do certificate falhará e a conexão do client com a instância do MySQL server falhará. Não há extensão `extendedKeyUsage` em SSL certificates criados usando o comando **openssl** seguindo as instruções neste tópico. Se você usar seu próprio client certificate criado de outra forma, certifique-se de que qualquer extensão `extendedKeyUsage` inclua autenticação de client.

* [Exemplo 1: Criando Arquivos SSL a Partir da Linha de Comando no Unix](creating-ssl-files-using-openssl.html#creating-ssl-files-using-openssl-unix-command-line "Example 1: Creating SSL Files from the Command Line on Unix")
* [Exemplo 2: Criando Arquivos SSL Usando um Script no Unix](creating-ssl-files-using-openssl.html#creating-ssl-files-using-openssl-unix-script "Example 2: Creating SSL Files Using a Script on Unix")
* [Exemplo 3: Criando Arquivos SSL no Windows](creating-ssl-files-using-openssl.html#creating-ssl-files-using-openssl-windows "Example 3: Creating SSL Files on Windows")

##### Exemplo 1: Criando Arquivos SSL a Partir da Linha de Comando no Unix

O exemplo a seguir mostra um conjunto de comandos para criar arquivos de Certificate e Key do MySQL server e client. Você deve responder a vários prompts dos comandos **openssl**. Para gerar arquivos de teste, você pode pressionar Enter em todos os prompts. Para gerar arquivos para uso em produção, você deve fornecer respostas não vazias.

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

Após gerar os certificates, verifique-os:

```sql
openssl verify -CAfile ca.pem server-cert.pem client-cert.pem
```

Você deverá ver uma resposta como esta:

```sql
server-cert.pem: OK
client-cert.pem: OK
```

Para ver o conteúdo de um certificate (por exemplo, para verificar o intervalo de datas durante o qual um certificate é válido), invoque **openssl** desta forma:

```sql
openssl x509 -text -in ca.pem
openssl x509 -text -in server-cert.pem
openssl x509 -text -in client-cert.pem
```

Agora você tem um conjunto de arquivos que podem ser usados da seguinte forma:

* `ca.pem`: Use isto para definir a variável de sistema [`ssl_ca`](server-system-variables.html#sysvar_ssl_ca) no lado do server e a opção [`--ssl-ca`](connection-options.html#option_general_ssl-ca) no lado do client. (O CA certificate, se usado, deve ser o mesmo em ambos os lados.)

* `server-cert.pem`, `server-key.pem`: Use isto para definir as variáveis de sistema [`ssl_cert`](server-system-variables.html#sysvar_ssl_cert) e [`ssl_key`](server-system-variables.html#sysvar_ssl_key) no lado do server.

* `client-cert.pem`, `client-key.pem`: Use isto como argumentos para as opções [`--ssl-cert`](connection-options.html#option_general_ssl-cert) e [`--ssl-key`](connection-options.html#option_general_ssl-key) no lado do client.

Para instruções de uso adicionais, consulte [Seção 6.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”](using-encrypted-connections.html "6.3.1 Configuring MySQL to Use Encrypted Connections").

##### Exemplo 2: Criando Arquivos SSL Usando um Script no Unix

Aqui está um script de exemplo que mostra como configurar arquivos de Certificate e Key SSL para MySQL. Após executar o script, use os arquivos para conexões SSL conforme descrito em [Seção 6.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”](using-encrypted-connections.html "6.3.1 Configuring MySQL to Use Encrypted Connections").

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

##### Exemplo 3: Criando Arquivos SSL no Windows

Faça o Download do OpenSSL para Windows se ele não estiver instalado no seu sistema. Uma visão geral dos pacotes disponíveis pode ser vista aqui:

```sql
http://www.slproweb.com/products/Win32OpenSSL.html
```

Escolha o pacote Win32 OpenSSL Light ou Win64 OpenSSL Light, dependendo da sua arquitetura (32-bit ou 64-bit). O local de instalação padrão é `C:\OpenSSL-Win32` ou `C:\OpenSSL-Win64`, dependendo do pacote que você baixou. As instruções a seguir pressupõem um local padrão de `C:\OpenSSL-Win32`. Modifique isso conforme necessário se você estiver usando o pacote de 64-bit.

Se ocorrer uma mensagem durante a instalação indicando `'...critical component is missing: Microsoft Visual C++ 2008 Redistributables'`, cancele a instalação e faça o download de um dos seguintes pacotes também, novamente dependendo da sua arquitetura (32-bit ou 64-bit):

* Visual C++ 2008 Redistributables (x86), disponível em:

  ```sql
  http://www.microsoft.com/downloads/details.aspx?familyid=9B2DA534-3E03-4391-8A4D-074B9F2BC1BF
  ```

* Visual C++ 2008 Redistributables (x64), disponível em:

  ```sql
  http://www.microsoft.com/downloads/details.aspx?familyid=bd2a6171-e2d6-4230-b809-9a8d7548c1b6
  ```

Após instalar o pacote adicional, reinicie o procedimento de instalação do OpenSSL.

Durante a instalação, mantenha o caminho de instalação padrão `C:\OpenSSL-Win32`, e também mantenha selecionada a opção padrão `'Copy OpenSSL DLL files to the Windows system directory'` (Copiar arquivos DLL do OpenSSL para o diretório do sistema Windows).

Quando a instalação terminar, adicione `C:\OpenSSL-Win32\bin` à variável Windows System Path do seu server (dependendo da sua versão do Windows, as seguintes instruções de configuração de Path podem diferir ligeiramente):

1. Na área de trabalho do Windows, clique com o botão direito do mouse no ícone Meu Computador e selecione Propriedades.

2. Selecione a aba Avançado no menu Propriedades do Sistema que aparece e clique no botão Variáveis de Ambiente (Environment Variables).

3. Em Variáveis do Sistema (System Variables), selecione Path e clique no botão Editar (Edit). A caixa de diálogo Editar Variável do Sistema (Edit System Variable) deve aparecer.

4. Adicione `';C:\OpenSSL-Win32\bin'` ao final (observe o ponto e vírgula).

5. Pressione OK 3 vezes.
6. Verifique se o OpenSSL foi integrado corretamente na variável Path abrindo um novo console de comando (**Iniciar>Executar>cmd.exe**) e verificando se o OpenSSL está disponível:

   ```sql
   Microsoft Windows [Version ...]
   Copyright (c) 2006 Microsoft Corporation. All rights reserved.

   C:\Windows\system32>cd \

   C:\>openssl
   OpenSSL> exit <<< If you see the OpenSSL prompt, installation was successful.

   C:\>
   ```

Após o OpenSSL ter sido instalado, use instruções semelhantes às do Exemplo 1 (mostrado anteriormente nesta seção), com as seguintes alterações:

* Altere os seguintes comandos Unix:

  ```sql
  # Create clean environment
  rm -rf newcerts
  mkdir newcerts && cd newcerts
  ```

  No Windows, use estes comandos em seu lugar:

  ```sql
  # Create clean environment
  md c:\newcerts
  cd c:\newcerts
  ```

* Quando um caractere `'\'` for mostrado no final de uma linha de comando, este caractere `'\'` deve ser removido e as linhas de comando devem ser digitadas todas em uma única linha.

Após gerar os arquivos de Certificate e Key, para usá-los em conexões SSL, consulte [Seção 6.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”](using-encrypted-connections.html "6.3.1 Configuring MySQL to Use Encrypted Connections").