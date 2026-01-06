#### 8.4.4.6 Uso do Plugin `keyring_okv` do KMIP

::: info Nota

O plugin `keyring_okv` é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para obter mais informações sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

:::

O Protocolo de Interoperabilidade de Gerenciamento de Chaves (KMIP) permite a comunicação de chaves criptográficas entre um servidor de gerenciamento de chaves e seus clientes. O plugin `keyring_okv` usa o protocolo KMIP 1.1 para se comunicar de forma segura como um cliente de um backend KMIP. O material do keyring é gerado exclusivamente pelo backend, não pelo `keyring_okv`. O plugin funciona com esses produtos compatíveis com KMIP:

* Oracle Key Vault
* Gemalto SafeNet KeySecure Appliance
* Townsend Alliance Key Manager
* Entrust KeyControl

Cada instância do Servidor MySQL deve ser registrada separadamente como cliente para o KMIP. Se duas ou mais instâncias do Servidor MySQL usarem o mesmo conjunto de credenciais, elas podem interferir no funcionamento uma da outra.

O plugin `keyring_okv` suporta as funções que compõem a interface padrão do serviço de Keyring do MySQL. As operações de keyring realizadas por essas funções são acessíveis em dois níveis:

* Interface SQL: Em instruções SQL, chame as funções descritas na Seção 8.4.4.12, “Funções de Gerenciamento de Chaves de Keyring de Uso Geral”.
* Interface C: Em código em C, chame as funções do serviço keyring descritas na Seção 7.6.9.2, “O Serviço Keyring”.

Exemplo (usando a interface SQL):

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Para obter informações sobre as características dos valores de chave permitidos pelo `keyring_okv`, consulte a Seção 8.4.4.10, “Tipos e Comprimentos de Chaves de Keyring Suportáveis”.

Para instalar o `keyring_okv`, use as instruções gerais encontradas na Seção 8.4.4.3, “Instalação do Plugin Keyring”, juntamente com as informações de configuração específicas para o `keyring_okv` encontradas aqui.

* Configuração geral do keyring\_okv
* Configuração do keyring\_okv para o Oracle Key Vault
* Configuração do keyring\_okv para a Appliance Gemalto SafeNet KeySecure
* Configuração do keyring\_okv para o Townsend Alliance Key Manager
* Configuração do keyring\_okv para o Entrust KeyControl
* Protegendo a senha do arquivo de chave do keyring\_okv

##### Configuração geral do keyring\_okv

Independentemente do backend KMIP que o plugin `keyring_okv` usa para armazenamento de chaves, a variável de sistema `keyring_okv_conf_dir` configura a localização do diretório usado pelo `keyring_okv` para seus arquivos de suporte. O valor padrão é vazio, então você deve definir a variável para nomear um diretório configurado corretamente antes que o plugin possa se comunicar com o backend KMIP. A menos que você faça isso, o `keyring_okv` escreve uma mensagem no log de erro durante o inicialização do servidor que ele não consegue se comunicar:

```
[Warning] Plugin keyring_okv reported: 'For keyring_okv to be
initialized, please point the keyring_okv_conf_dir variable to a directory
containing Oracle Key Vault configuration file and ssl materials'
```

A variável `keyring_okv_conf_dir` deve nomear um diretório que contenha os seguintes itens:

* `okvclient.ora`: Um arquivo que contém detalhes do backend KMIP com o qual o `keyring_okv` se comunica.
* `ssl`: Um diretório que contém os arquivos de certificado e chave necessários para estabelecer uma conexão segura com o backend KMIP: `CA.pem`, `cert.pem` e `key.pem`. Se o arquivo de chave estiver protegido por senha, o diretório `ssl` pode conter um arquivo de texto de uma linha chamado `password.txt` contendo a senha necessária para descriptografar o arquivo de chave.

Tanto o arquivo `okvclient.ora` quanto o diretório `ssl` com os arquivos de certificado e chave são necessários para que o `keyring_okv` funcione corretamente. O procedimento usado para preencher o diretório de configuração com esses arquivos depende do backend KMIP usado com o `keyring_okv`, conforme descrito em outro lugar.

O diretório de configuração usado pelo `keyring_okv` como local para seus arquivos de suporte deve ter um modo restrito e ser acessível apenas à conta usada para executar o servidor MySQL. Por exemplo, em sistemas Unix e Unix-like, para usar o diretório `/usr/local/mysql/mysql-keyring-okv`, os seguintes comandos (executados como `root`) criam o diretório e definem seu modo e propriedade:

```
cd /usr/local/mysql
mkdir mysql-keyring-okv
chmod 750 mysql-keyring-okv
chown mysql mysql-keyring-okv
chgrp mysql mysql-keyring-okv
```

Para ser usado durante o processo de inicialização do servidor, o `keyring_okv` deve ser carregado usando a opção `--early-plugin-load`. Além disso, defina a variável de sistema `keyring_okv_conf_dir` para informar ao `keyring_okv` onde encontrar seu diretório de configuração. Por exemplo, use essas linhas no arquivo `my.cnf` do servidor, ajustando o sufixo `.so` e a localização do diretório conforme necessário:

```
[mysqld]
early-plugin-load=keyring_okv.so
keyring_okv_conf_dir=/usr/local/mysql/mysql-keyring-okv
```

Para obter informações adicionais sobre `keyring_okv_conf_dir`, consulte a Seção 8.4.4.16, “Variáveis do Sistema Keyring”.

##### Configurando o keyring\_okv para o Oracle Key Vault

A discussão aqui assume que você está familiarizado com o Oracle Key Vault. Algumas fontes de informações pertinentes:

Site do Oracle Key Vault
Documentação do Oracle Key Vault

Na terminologia do Oracle Key Vault, os clientes que usam o Oracle Key Vault para armazenar e recuperar objetos de segurança são chamados de endpoints. Para se comunicar com o Oracle Key Vault, é necessário se registrar como um endpoint e se inscrever baixando e instalando os arquivos de suporte do endpoint. Note que você deve registrar um endpoint separado para cada instância do servidor MySQL. Se duas ou mais instâncias do servidor MySQL usarem o mesmo endpoint, elas podem interferir no funcionamento umas das outras.

O seguinte procedimento resume brevemente o processo de configuração do `keyring_okv` para uso com o Oracle Key Vault:

1. Crie o diretório de configuração para o plugin `keyring_okv` a ser usado.
2. Registre um ponto de extremidade com o Oracle Key Vault para obter um token de inscrição.
3. Use o token de inscrição para obter o download do software cliente `okvclient.jar`.
4. Instale o software cliente para preencher o diretório de configuração `keyring_okv` que contém os arquivos de suporte do Oracle Key Vault.

Use o seguinte procedimento para configurar o `keyring_okv` e o Oracle Key Vault para trabalhar juntos. Esta descrição resume apenas como interagir com o Oracle Key Vault. Para detalhes, visite o site Oracle Key Vault e consulte o *Oracle Key Vault Administrator's Guide*.

1. Crie o diretório de configuração que contém os arquivos de suporte do Oracle Key Vault e certifique-se de que a variável de sistema `keyring_okv_conf_dir` esteja definida para o nome desse diretório (para detalhes, consulte  Configuração geral do keyring\_okv).
2. Faça login na console de gerenciamento do Oracle Key Vault como um usuário que tenha o papel de Administrador do Sistema.
3. Selecione a aba Pontos de extremidade para chegar à página Pontos de extremidade. Na página Pontos de extremidade, clique em Adicionar.
4. Forneça as informações do ponto de extremidade necessárias e clique em Registrar. O tipo de ponto de extremidade deve ser Outro. O registro bem-sucedido resulta em um token de inscrição.
5. Faça logout do servidor do Oracle Key Vault.
6. Conecte-se novamente ao servidor do Oracle Key Vault, desta vez sem fazer login. Use o token de inscrição do ponto de extremidade para registrar e solicitar o download do software `okvclient.jar`. Salve esse arquivo no seu sistema.
7. Instale o arquivo `okvclient.jar` usando o seguinte comando (você deve ter o JDK 1.4 ou superior):

   ```
   java -jar okvclient.jar -d dir_name [-v]
   ```

   O nome do diretório após a opção `-d` é a localização onde os arquivos extraídos serão instalados. A opção `-v`, se fornecida, produz informações de log que podem ser úteis se o comando falhar.

Quando o comando solicitar uma senha do ponto de extremidade do Oracle Key Vault, não forneça uma. Em vez disso, pressione **Enter**. (O resultado é que nenhuma senha é necessária quando o ponto de extremidade se conecta ao Oracle Key Vault.)

O comando anterior produz um arquivo `okvclient.ora`, que deve estar neste local sob o diretório nomeado pela opção `-d` no comando **java -jar** anterior:

```
   install_dir/conf/okvclient.ora
   ```

Os conteúdos esperados do arquivo incluem linhas que parecem assim:

```
   SERVER=host_ip:port_num
   STANDBY_SERVER=host_ip:port_num
   ```

A variável `SERVER` é obrigatória, e a variável `STANDBY_SERVER` é opcional. O plugin `keyring_okv` tenta se comunicar com o servidor que está rodando no host nomeado pela variável `SERVER` e fallbacka para `STANDBY_SERVER` se isso falhar.

::: info Nota

Se o arquivo existente não estiver nesse formato, crie um novo arquivo com as linhas mostradas no exemplo anterior. Além disso, considere fazer backup do arquivo `okvclient.ora` antes de executar o comando **okvutil**. Restaure o arquivo conforme necessário.

:::

Você pode especificar mais de um servidor de standby (até um máximo de 64). Se você fizer isso, o plugin `keyring_okv` itera sobre eles até que consiga estabelecer uma conexão e falha se não conseguir. Para adicionar servidores de standby adicionais, edite o arquivo `okvclient.ora` para especificar os endereços IP e os números de porta dos servidores como uma lista de endereços separados por vírgula no valor da variável `STANDBY_SERVER`. Por exemplo:

```
   STANDBY_SERVER=host_ip:port_num,host_ip:port_num,host_ip:port_num,host_ip:port_num
   ```

Certifique-se de que a lista de servidores de standby seja mantida curta, precisa e atualizada, e os servidores que não são mais válidos sejam removidos. Há uma espera de 20 segundos para cada tentativa de conexão, então a presença de uma longa lista de servidores inválidos pode afetar significativamente o tempo de conexão do plugin `keyring_okv` e, portanto, o tempo de inicialização do servidor.
8. Vá para o diretório do instalador do Oracle Key Vault e teste a configuração executando este comando:

```
   okvutil/bin/okvutil list
   ```

A saída deve parecer algo assim:

```
   Unique ID                               Type            Identifier
   255AB8DE-C97F-482C-E053-0100007F28B9	Symmetric Key	-
   264BF6E0-A20E-7C42-E053-0100007FB29C	Symmetric Key	-
   ```

Para um servidor do Oracle Key Vault novo (um servidor sem nenhuma chave nele), a saída parece assim, para indicar que não há chaves no vault:

```
   no objects found
   ```
9. Use este comando para extrair o diretório `ssl` contendo os materiais SSL do arquivo `okvclient.jar`:

```
   jar xf okvclient.jar ssl
   ```
10. Copie os arquivos de suporte do Oracle Key Vault (o arquivo `okvclient.ora` e o diretório `ssl`) para o diretório de configuração.
11. (Opcional) Se você deseja proteger a senha do arquivo de chave, use as instruções em Proteger a senha do arquivo de chave do keyring_okv.

Após completar o procedimento anterior, reinicie o servidor MySQL. Ele carrega o plugin `keyring_okv` e o `keyring_okv` usa os arquivos em seu diretório de configuração para se comunicar com o Oracle Key Vault.

##### Configurando `keyring_okv` para a Instância Gemalto SafeNet KeySecure

A Instância Gemalto SafeNet KeySecure usa o protocolo KMIP (versão 1.1 ou 1.2). O plugin de chave `keyring_okv` (que suporta KMIP 1.1) pode usar KeySecure como seu backend KMIP para armazenamento de chaves.

Use o seguinte procedimento para configurar `keyring_okv` e KeySecure para trabalhar juntos. A descrição resume apenas como interagir com KeySecure. Para detalhes, consulte a seção chamada Adicionar um Servidor KMIP no [Guia do Usuário do KeySecure](https://www2.gemalto.com/aws-marketplace/usage/vks/uploadedFiles/Support_and_Downloads/AWS/007-012362-001-keysecure-appliance-user-guide-v7.1.0.pdf).

1. Crie o diretório de configuração que contém os arquivos de suporte do KeySecure, e certifique-se de que a variável de sistema `keyring_okv_conf_dir` esteja definida para o nome desse diretório (para detalhes, consulte Configuração geral do keyring_okv).
2. No diretório de configuração, crie um subdiretório chamado `ssl` para usar para armazenar os arquivos de certificado SSL e chave necessários.
3. No diretório de configuração, crie um arquivo chamado `okvclient.ora`. Ele deve ter o seguinte formato:

```
   SERVER=host_ip:port_num
   STANDBY_SERVER=host_ip:port_num
   ```

Por exemplo, se o KeySecure estiver rodando no host 198.51.100.20 e ouvindo na porta 9002, e também rodando no host alternativo 203.0.113.125 e ouvindo na porta 8041, o arquivo `okvclient.ora` ficaria assim:

```
   SERVER=198.51.100.20:9002
   STANDBY_SERVER=203.0.113.125:8041
   ```

Você pode especificar mais de um servidor de espera (até um máximo de 64). Se você fizer isso, o plugin `keyring_okv` itera sobre eles até conseguir estabelecer uma conexão e falha se não conseguir. Para adicionar servidores de espera extras, edite o arquivo `okvclient.ora` para especificar os endereços IP e os números de porta dos servidores como uma lista de vírgulas separadas em um valor da variável `STANDBY_SERVER`. Por exemplo:

```
   STANDBY_SERVER=host_ip:port_num,host_ip:port_num,host_ip:port_num,host_ip:port_num
   ```

Certifique-se de que a lista de servidores de espera seja mantida curta, precisa e atualizada, e os servidores que não são mais válidos são removidos. Há uma espera de 20 segundos para cada tentativa de conexão, então a presença de uma longa lista de servidores inválidos pode afetar significativamente o tempo de conexão do plugin `keyring_okv` e, portanto, o tempo de inicialização do servidor.
4. Conecte-se à Console de Gerenciamento do KeySecure como administrador com credenciais para acesso a Autoridades de Certificado.
5. Navegue até Segurança >> ACs Locais e crie uma autoridade de certificado local (CA).
6. Vá para Listas de CA Confiáveis. Selecione Padrão e clique em Propriedades. Em seguida, selecione Editar para Lista de Autoridade de Certificado Confiável e adicione a CA recém-criada.
7. Baixe a CA e salve-a no diretório `ssl` como um arquivo chamado `CA.pem`.
8. Navegue até Segurança >> Solicitações de Certificado e crie um certificado. Em seguida, você pode baixar um arquivo `tar` compactado contendo arquivos PEM de certificado.
9. Extraia os arquivos PEM do arquivo baixado. Por exemplo, se o nome do arquivo for `csr_w_pk_pkcs8.gz`, descomprima e descompacte usando este comando:

```
   tar zxvf csr_w_pk_pkcs8.gz
   ```

Dois arquivos resultam da operação de extração: `certificate_request.pem` e `private_key_pkcs8.pem`.
10. Use este comando `openssl` para descriptografar a chave privada e criar um arquivo chamado `key.pem`:

```
    openssl pkcs8 -in private_key_pkcs8.pem -out key.pem
    ```
11. Copie o arquivo `key.pem` para o diretório `ssl`.
12. Copie o pedido de certificado em `certificate_request.pem` para a área de transferência.
13. Navegue até Segurança >> ACAs Locais. Selecione a mesma CA que você criou anteriormente (a que você baixou para criar o arquivo `CA.pem`) e clique em Assinar Pedido. Cole o Pedido de Certificado da área de transferência, escolha um propósito de certificado de Cliente (o chaveiro é um cliente do KeySecure) e clique em Assinar Pedido. O resultado é um certificado assinado com a CA selecionada em uma nova página.
14. Copie o certificado assinado para a área de transferência e, em seguida, armazene o conteúdo da área de transferência como um arquivo chamado `cert.pem` no diretório `ssl`.
15. (Opcional) Se você deseja proteger a senha do arquivo de chave, use as instruções em Proteger a senha do arquivo de chave do chaveiro.

Após completar o procedimento anterior, reinicie o servidor MySQL. Ele carrega o plugin `keyring_okv` e o `keyring_okv` usa os arquivos em seu diretório de configuração para se comunicar com o KeySecure.

##### Configurando keyring\_okv para o Townsend Alliance Key Manager

O Townsend Alliance Key Manager usa o protocolo KMIP. O plugin de chaveiro `keyring_okv` pode usar o Key Manager Alliance como seu backend KMIP para armazenamento de chaveiro. Para informações adicionais, consulte [Key Manager Alliance para MySQL](https://www.townsendsecurity.com/product/encryption-key-management-mysql).

##### Configurando keyring\_okv para o Entrust KeyControl

O Entrust KeyControl usa o protocolo KMIP. O plugin de chaveiro `keyring_okv` pode usar o Entrust KeyControl como seu backend KMIP para armazenamento de chaveiro. Para informações adicionais, consulte o [Guia de Integração Oracle MySQL e Entrust KeyControl com nShield HSM](https://www.entrust.com/-/media/documentation/integration-guides/oracle-mysql-enterprise-keycontrol-nshield-ig.pdf).

##### Proteger a senha do arquivo de chave keyring\_okv

Você pode, opcionalmente, proteger o arquivo de chave com uma senha e fornecer um arquivo contendo a senha para permitir que o arquivo de chave seja descriptografado. Para fazer isso, mude a localização para o diretório `ssl` e execute as seguintes etapas:

1. Criptografar o arquivo de chave `key.pem`. Por exemplo, use um comando como este e insira a senha de criptografia nas solicitações:

   ```
   $> openssl rsa -des3 -in key.pem -out key.pem.new
   Enter PEM pass phrase:
   Verifying - Enter PEM pass phrase:
   ```
2. Salve a senha de criptografia em um arquivo de texto de uma única linha chamado `password.txt` no diretório `ssl`.
3. Verifique se o arquivo de chave criptografado pode ser descriptografado usando o seguinte comando. O arquivo descriptografado deve ser exibido na consola:

   ```
   $> openssl rsa -in key.pem.new -passin file:password.txt
   ```
4. Remova o arquivo original `key.pem` e renomeie `key.pem.new` para `key.pem`.
5. Mude a propriedade e o modo de acesso do novo arquivo `key.pem` e do arquivo `password.txt` conforme necessário para garantir que tenham as mesmas restrições que outros arquivos no diretório `ssl`.