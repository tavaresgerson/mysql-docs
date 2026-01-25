#### 6.4.4.4 Usando o Plugin KMIP keyring_okv

Nota

O plugin `keyring_okv` é uma extensão incluída no MySQL Enterprise Edition, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

O Key Management Interoperability Protocol (KMIP) permite a comunicação de chaves criptográficas entre um servidor de gerenciamento de chaves e seus clientes. O plugin de Keyring `keyring_okv` usa o protocolo KMIP 1.1 para se comunicar de forma segura como um cliente de um *back end* KMIP. O material do Keyring é gerado exclusivamente pelo *back end*, não pelo `keyring_okv`. O plugin funciona com estes produtos compatíveis com KMIP:

* Oracle Key Vault
* Gemalto SafeNet KeySecure Appliance
* Townsend Alliance Key Manager

Cada instância do MySQL Server deve ser registrada separadamente como um cliente para KMIP. Se duas ou mais instâncias do MySQL Server usarem o mesmo conjunto de credenciais, elas podem interferir no funcionamento umas das outras.

O plugin `keyring_okv` suporta as funções que compõem a interface de serviço padrão do MySQL Keyring. As operações de Keyring executadas por essas funções são acessíveis em dois níveis:

* Interface SQL: Em instruções SQL, chame as funções descritas em [Section 6.4.4.8, “Funções de Gerenciamento de Chaves de Keyring de Propósito Geral”](keyring-functions-general-purpose.html "6.4.4.8 Funções de Gerenciamento de Chaves de Keyring de Propósito Geral").

* Interface C: Em código C-language, chame as funções de serviço de Keyring descritas em [Section 5.5.6.2, “O Serviço de Keyring”](keyring-service.html "5.5.6.2 O Serviço de Keyring").

Exemplo (usando a interface SQL):

```sql
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Para informações sobre as características dos valores de chave permitidos por `keyring_okv`, [Section 6.4.4.6, “Tipos e Comprimentos de Chave de Keyring Suportados”](keyring-key-types.html "6.4.4.6 Supported Keyring Key Types and Lengths").

Para instalar `keyring_okv`, use as instruções gerais encontradas em [Section 6.4.4.1, “Instalação do Plugin de Keyring”](keyring-plugin-installation.html "6.4.4.1 Instalação do Plugin de Keyring"), juntamente com as informações de configuração específicas do `keyring_okv` encontradas aqui.

* [Configuração Geral do keyring_okv](keyring-okv-plugin.html#keyring-okv-configuration "General keyring_okv Configuration")
* [Configurando o keyring_okv para Oracle Key Vault](keyring-okv-plugin.html#keyring-okv-oracle-key-vault "Configurando o keyring_okv para Oracle Key Vault")
* [Configurando o keyring_okv para Gemalto SafeNet KeySecure Appliance](keyring-okv-plugin.html#keyring-okv-keysecure "Configurando o keyring_okv para Gemalto SafeNet KeySecure Appliance")
* [Configurando o keyring_okv para Townsend Alliance Key Manager](keyring-okv-plugin.html#keyring-okv-alliance "Configurando o keyring_okv para Townsend Alliance Key Manager")
* [Protegendo o Arquivo de Chave do keyring_okv com Senha](keyring-okv-plugin.html#keyring-okv-encrypt-key-file "Password-Protecting the keyring_okv Key File")

##### Configuração Geral do keyring_okv

Independentemente de qual *back end* KMIP o plugin `keyring_okv` usa para armazenamento de Keyring, a variável de sistema [`keyring_okv_conf_dir`](keyring-system-variables.html#sysvar_keyring_okv_conf_dir) configura a localização do diretório usado por `keyring_okv` para seus arquivos de suporte. O valor padrão é vazio, então você deve configurar a variável para nomear um diretório devidamente configurado antes que o plugin possa se comunicar com o *back end* KMIP. A menos que você faça isso, `keyring_okv` escreve uma mensagem no error log durante a inicialização do servidor de que não consegue se comunicar:

```sql
[Warning] Plugin keyring_okv reported: 'For keyring_okv to be
initialized, please point the keyring_okv_conf_dir variable to a directory
containing Oracle Key Vault configuration file and ssl materials'
```

A variável [`keyring_okv_conf_dir`](keyring-system-variables.html#sysvar_keyring_okv_conf_dir) deve nomear um diretório que contenha os seguintes itens:

* `okvclient.ora`: Um arquivo que contém detalhes do *back end* KMIP com o qual `keyring_okv` se comunica.

* `ssl`: Um diretório que contém os arquivos de certificado e chave necessários para estabelecer uma conexão segura com o *back end* KMIP: `CA.pem`, `cert.pem` e `key.pem`. A partir do MySQL 5.7.20, se o arquivo de chave for protegido por senha, o diretório `ssl` pode conter um arquivo de texto de linha única chamado `password.txt` contendo a senha necessária para descriptografar o arquivo de chave.

Tanto o arquivo `okvclient.ora` quanto o diretório `ssl` com os arquivos de certificado e chave são necessários para que `keyring_okv` funcione corretamente. O procedimento usado para popular o diretório de configuração com esses arquivos depende do *back end* KMIP usado com `keyring_okv`, conforme descrito em outros locais.

O diretório de configuração usado por `keyring_okv` como local para seus arquivos de suporte deve ter um modo restritivo e ser acessível apenas à conta usada para executar o MySQL Server. Por exemplo, em sistemas Unix e semelhantes ao Unix, para usar o diretório `/usr/local/mysql/mysql-keyring-okv`, os seguintes comandos (executados como `root`) criam o diretório e definem seu modo e propriedade:

```sql
cd /usr/local/mysql
mkdir mysql-keyring-okv
chmod 750 mysql-keyring-okv
chown mysql mysql-keyring-okv
chgrp mysql mysql-keyring-okv
```

Para ser utilizável durante o processo de inicialização do servidor, `keyring_okv` deve ser carregado usando a opção [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load). Além disso, defina a variável de sistema [`keyring_okv_conf_dir`](keyring-system-variables.html#sysvar_keyring_okv_conf_dir) para informar ao `keyring_okv` onde encontrar seu diretório de configuração. Por exemplo, use estas linhas no arquivo `my.cnf` do servidor, ajustando o sufixo `.so` e a localização do diretório para sua plataforma conforme necessário:

```sql
[mysqld]
early-plugin-load=keyring_okv.so
keyring_okv_conf_dir=/usr/local/mysql/mysql-keyring-okv
```

Para informações adicionais sobre [`keyring_okv_conf_dir`](keyring-system-variables.html#sysvar_keyring_okv_conf_dir), consulte [Section 6.4.4.12, “Variáveis de Sistema de Keyring”](keyring-system-variables.html "6.4.4.12 Keyring System Variables").

##### Configurando o keyring_okv para Oracle Key Vault

A discussão aqui pressupõe que você esteja familiarizado com o Oracle Key Vault. Algumas fontes de informação pertinentes:

* [Site do Oracle Key Vault](http://www.oracle.com/technetwork/database/options/key-management/overview/index.html)

* [Documentação do Oracle Key Vault](http://www.oracle.com/technetwork/database/options/key-management/documentation/index.html)

Na terminologia do Oracle Key Vault, os clientes que usam o Oracle Key Vault para armazenar e recuperar objetos de segurança são chamados de *endpoints*. Para se comunicar com o Oracle Key Vault, é necessário se registrar como um *endpoint* e se inscrever baixando e instalando arquivos de suporte de *endpoint*. Observe que você deve registrar um *endpoint* separado para cada instância do MySQL Server. Se duas ou mais instâncias do MySQL Server usarem o mesmo *endpoint*, elas podem interferir no funcionamento umas das outras.

O procedimento a seguir resume brevemente o processo de configuração do `keyring_okv` para uso com o Oracle Key Vault:

1. Crie o diretório de configuração para o plugin `keyring_okv` usar.

2. Registre um *endpoint* no Oracle Key Vault para obter um token de inscrição (*enrollment token*).

3. Use o token de inscrição para obter o download do software cliente `okvclient.jar`.

4. Instale o software cliente para popular o diretório de configuração do `keyring_okv` que contém os arquivos de suporte do Oracle Key Vault.

Use o procedimento a seguir para configurar o `keyring_okv` e o Oracle Key Vault para trabalharem juntos. Esta descrição apenas resume como interagir com o Oracle Key Vault. Para obter detalhes, visite o [site do Oracle Key Vault](http://www.oracle.com/technetwork/database/options/key-management/overview/index.html) e consulte o *Oracle Key Vault Administrator's Guide*.

1. Crie o diretório de configuração que contém os arquivos de suporte do Oracle Key Vault e certifique-se de que a variável de sistema [`keyring_okv_conf_dir`](keyring-system-variables.html#sysvar_keyring_okv_conf_dir) esteja definida para nomear esse diretório (para detalhes, consulte [Configuração Geral do keyring_okv](keyring-okv-plugin.html#keyring-okv-configuration "General keyring_okv Configuration")).

2. Faça login no console de gerenciamento do Oracle Key Vault como um usuário que tenha a função de Administrador do Sistema.

3. Selecione a aba *Endpoints* para chegar à página *Endpoints*. Na página *Endpoints*, clique em *Add*.

4. Forneça as informações de *endpoint* necessárias e clique em *Register*. O tipo de *endpoint* deve ser *Other*. O registro bem-sucedido resulta em um token de inscrição.

5. Saia do servidor Oracle Key Vault.
6. Conecte-se novamente ao servidor Oracle Key Vault, desta vez sem fazer login. Use o token de inscrição do *endpoint* para se inscrever e solicitar o download do software `okvclient.jar`. Salve este arquivo em seu sistema.

7. Instale o arquivo `okvclient.jar` usando o seguinte comando (você deve ter JDK 1.4 ou superior):

   ```sql
   java -jar okvclient.jar -d dir_name [-v]
   ```

   O nome do diretório após a opção `-d` é o local onde instalar os arquivos extraídos. A opção `-v`, se fornecida, faz com que as informações de *log* sejam produzidas, o que pode ser útil se o comando falhar.

   Quando o comando solicitar uma senha de *endpoint* do Oracle Key Vault, não a forneça. Em vez disso, pressione **Enter**. (O resultado é que nenhuma senha é necessária quando o *endpoint* se conecta ao Oracle Key Vault.)

   O comando anterior produz um arquivo `okvclient.ora`, que deve estar neste local sob o diretório nomeado pela opção `-d` no comando **java -jar** anterior:

   ```sql
   install_dir/conf/okvclient.ora
   ```

   O conteúdo esperado do arquivo inclui linhas que se parecem com isto:

   ```sql
   SERVER=host_ip:port_num
   STANDBY_SERVER=host_ip:port_num
   ```

   Nota

   Se o arquivo existente não estiver neste formato, crie um novo arquivo com as linhas mostradas no exemplo anterior. Além disso, considere fazer backup do arquivo `okvclient.ora` antes de executar o comando **okvutil**. Restaure o arquivo conforme necessário.

   O plugin `keyring_okv` tenta se comunicar com o servidor em execução no *host* nomeado pela variável `SERVER` e recorre a `STANDBY_SERVER` se isso falhar:

   * Para a variável `SERVER`, uma configuração no arquivo `okvclient.ora` é obrigatória.

   * Para a variável `STANDBY_SERVER`, uma configuração no arquivo `okvclient.ora` é opcional, a partir do MySQL 5.7.19. Antes do MySQL 5.7.19, uma configuração para `STANDBY_SERVER` é obrigatória; se `okvclient.ora` for gerado sem uma configuração para `STANDBY_SERVER`, `keyring_okv` falha ao inicializar. A solução alternativa é verificar `oraclient.ora` e adicionar uma configuração "dummy" para `STANDBY_SERVER`, se estiver faltando. Por exemplo:

     ```sql
     STANDBY_SERVER=127.0.0.1:5696
     ```

8. Vá para o diretório do instalador do Oracle Key Vault e teste a configuração executando este comando:

   ```sql
   okvutil/bin/okvutil list
   ```

   A saída deve se parecer com algo assim:

   ```sql
   Unique ID                               Type            Identifier
   255AB8DE-C97F-482C-E053-0100007F28B9	Symmetric Key	-
   264BF6E0-A20E-7C42-E053-0100007FB29C	Symmetric Key	-
   ```

   Para um servidor Oracle Key Vault novo (um servidor sem nenhuma chave), a saída se parece com isto, indicando que não há chaves no *vault*:

   ```sql
   no objects found
   ```

9. Use este comando para extrair o diretório `ssl` contendo materiais SSL do arquivo `okvclient.jar`:

   ```sql
   jar xf okvclient.jar ssl
   ```

10. Copie os arquivos de suporte do Oracle Key Vault (o arquivo `okvclient.ora` e o diretório `ssl`) para o diretório de configuração.

11. (Opcional) Se você deseja proteger o arquivo de chave com senha, use as instruções em [Protegendo o Arquivo de Chave do keyring_okv com Senha](keyring-okv-plugin.html#keyring-okv-encrypt-key-file "Password-Protecting the keyring_okv Key File").

Após concluir o procedimento anterior, reinicie o MySQL Server. Ele carrega o plugin `keyring_okv` e `keyring_okv` usa os arquivos em seu diretório de configuração para se comunicar com o Oracle Key Vault.

##### Configurando o keyring_okv para Gemalto SafeNet KeySecure Appliance

O Gemalto SafeNet KeySecure Appliance usa o protocolo KMIP (versão 1.1 ou 1.2). A partir do MySQL 5.7.18, o plugin de Keyring `keyring_okv` (que suporta KMIP 1.1) pode usar o KeySecure como seu *back end* KMIP para armazenamento de Keyring.

Use o procedimento a seguir para configurar `keyring_okv` e KeySecure para trabalharem juntos. A descrição apenas resume como interagir com o KeySecure. Para obter detalhes, consulte a seção chamada *Add a KMIP Server* no [KeySecure User Guide](https://www2.gemalto.com/aws-marketplace/usage/vks/uploadedFiles/Support_and_Downloads/AWS/007-012362-001-keysecure-appliance-user-guide-v7.1.0.pdf).

1. Crie o diretório de configuração que contém os arquivos de suporte do KeySecure e certifique-se de que a variável de sistema [`keyring_okv_conf_dir`](keyring-system-variables.html#sysvar_keyring_okv_conf_dir) esteja definida para nomear esse diretório (para detalhes, consulte [Configuração Geral do keyring_okv](keyring-okv-plugin.html#keyring-okv-configuration "General keyring_okv Configuration")).

2. No diretório de configuração, crie um subdiretório chamado `ssl` para usar no armazenamento dos arquivos de certificado e chave SSL necessários.

3. No diretório de configuração, crie um arquivo chamado `okvclient.ora`. Ele deve ter o seguinte formato:

   ```sql
   SERVER=host_ip:port_num
   STANDBY_SERVER=host_ip:port_num
   ```

   Por exemplo, se o KeySecure estiver rodando no host 198.51.100.20 e escutando na porta 9002, o arquivo `okvclient.ora` se parecerá com isto:

   ```sql
   SERVER=198.51.100.20:9002
   STANDBY_SERVER=198.51.100.20:9002
   ```

4. Conecte-se ao KeySecure Management Console como um administrador com credenciais para acesso a Autoridades Certificadoras (*Certificate Authorities*).

5. Navegue até *Security >> Local CAs* e crie uma autoridade certificadora local (CA).

6. Vá para *Trusted CA Lists*. Selecione *Default* e clique em *Properties*. Em seguida, selecione *Edit* para *Trusted Certificate Authority List* e adicione a CA que acabou de ser criada.

7. Baixe a CA e salve-a no diretório `ssl` como um arquivo chamado `CA.pem`.

8. Navegue até *Security >> Certificate Requests* e crie um certificado. Em seguida, você pode baixar um arquivo **tar** compactado contendo arquivos PEM de certificado.

9. Extraia os arquivos PEM do arquivo baixado. Por exemplo, se o nome do arquivo for `csr_w_pk_pkcs8.gz`, descompacte-o e desempacote-o usando este comando:

   ```sql
   tar zxvf csr_w_pk_pkcs8.gz
   ```

   Dois arquivos resultam da operação de extração: `certificate_request.pem` e `private_key_pkcs8.pem`.

10. Use este comando **openssl** para descriptografar a chave privada e criar um arquivo chamado `key.pem`:

    ```sql
    openssl pkcs8 -in private_key_pkcs8.pem -out key.pem
    ```

11. Copie o arquivo `key.pem` para o diretório `ssl`.

12. Copie a solicitação de certificado em `certificate_request.pem` para a área de transferência (*clipboard*).

13. Navegue até *Security >> Local CAs*. Selecione a mesma CA que você criou anteriormente (aquela que você baixou para criar o arquivo `CA.pem`) e clique em *Sign Request*. Cole a Solicitação de Certificado da área de transferência, escolha um propósito de certificado de *Client* (o Keyring é um cliente do KeySecure) e clique em *Sign Request*. O resultado é um certificado assinado com a CA selecionada em uma nova página.

14. Copie o certificado assinado para a área de transferência e salve o conteúdo da área de transferência como um arquivo chamado `cert.pem` no diretório `ssl`.

15. (Opcional) Se você deseja proteger o arquivo de chave com senha, use as instruções em [Protegendo o Arquivo de Chave do keyring_okv com Senha](keyring-okv-plugin.html#keyring-okv-encrypt-key-file "Password-Protecting the keyring_okv Key File").

Após concluir o procedimento anterior, reinicie o MySQL Server. Ele carrega o plugin `keyring_okv` e `keyring_okv` usa os arquivos em seu diretório de configuração para se comunicar com o KeySecure.

##### Configurando o keyring_okv para Townsend Alliance Key Manager

O Townsend Alliance Key Manager usa o protocolo KMIP. O plugin de Keyring `keyring_okv` pode usar o Alliance Key Manager como seu *back end* KMIP para armazenamento de Keyring. Para informações adicionais, consulte [Alliance Key Manager for MySQL](https://www.townsendsecurity.com/product/encryption-key-management-mysql).

##### Protegendo o Arquivo de Chave do keyring_okv com Senha

A partir do MySQL 5.7.20, você pode opcionalmente proteger o arquivo de chave com uma senha e fornecer um arquivo contendo a senha para permitir que o arquivo de chave seja descriptografado. Para fazer isso, mude para o diretório `ssl` e execute estas etapas:

1. Criptografe o arquivo de chave `key.pem`. Por exemplo, use um comando como este e digite a senha de criptografia nos prompts:

   ```sql
   $> openssl rsa -des3 -in key.pem -out key.pem.new
   Enter PEM pass phrase:
   Verifying - Enter PEM pass phrase:
   ```

2. Salve a senha de criptografia em um arquivo de texto de linha única chamado `password.txt` no diretório `ssl`.

3. Verifique se o arquivo de chave criptografado pode ser descriptografado usando o seguinte comando. O arquivo descriptografado deve ser exibido no console:

   ```sql
   $> openssl rsa -in key.pem.new -passin file:password.txt
   ```

4. Remova o arquivo `key.pem` original e renomeie `key.pem.new` para `key.pem`.

5. Altere a propriedade e o modo de acesso do novo arquivo `key.pem` e do arquivo `password.txt` conforme necessário para garantir que eles tenham as mesmas restrições que outros arquivos no diretório `ssl`.