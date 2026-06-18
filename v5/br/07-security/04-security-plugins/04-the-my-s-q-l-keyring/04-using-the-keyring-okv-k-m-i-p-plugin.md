#### 6.4.4.4 Usando o plugin KMIP keyring_okv

Nota

O plugin `keyring_okv` é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

O Protocolo de Interoperabilidade de Gerenciamento de Chave (KMIP) permite a comunicação de chaves criptográficas entre um servidor de gerenciamento de chaves e seus clientes. O plugin `keyring_okv` utiliza o protocolo KMIP 1.1 para se comunicar de forma segura como um cliente de um backend KMIP. O material do keychain é gerado exclusivamente pelo backend, e não pelo `keyring_okv`. O plugin funciona com esses produtos compatíveis com o KMIP:

- Oracle Key Vault
- Gemalto SafeNet KeySecure Appliance
- Gerenciador de Chaves da Townsend Alliance

Cada instância do Servidor MySQL deve ser registrada separadamente como cliente para o KMIP. Se duas ou mais instâncias do Servidor MySQL usarem o mesmo conjunto de credenciais, elas podem interferir no funcionamento uma da outra.

O plugin `keyring_okv` suporta as funções que compõem a interface padrão do serviço de Keyring do MySQL. As operações de Keyring realizadas por essas funções são acessíveis em dois níveis:

- Interface SQL: Nas instruções SQL, consulte as funções descritas em Seção 6.4.4.8, “Funções de gerenciamento de chaves do carteiro de propósito geral”.

- Interface C: No código em C, chame as funções do serviço de chave de acesso descritas em Seção 5.5.6.2, “O Serviço de Chave de Acesso”.

Exemplo (usando a interface SQL):

```sql
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Para informações sobre as características dos valores-chave permitidos pelo `keyring_okv`, consulte a Seção 6.4.4.6, “Tipos e comprimentos de chave do keyring suportado”.

Para instalar o `keyring_okv`, use as instruções gerais encontradas em Seção 6.4.4.1, “Instalação do Plugin de Keychain”, juntamente com as informações de configuração específicas para o `keyring_okv` encontradas aqui.

- Configuração do chaveiro geral _okv
- Configurando o keyring_okv para o Oracle Key Vault
- Configurando o keyring_okv para a Gemalto SafeNet KeySecure Appliance
- Configurando keyring_okv para o Townsend Alliance Key Manager
- Protegendo a senha do arquivo de chave do keygen_okv

##### Chaveiro geral _okv Configuração

Independentemente do backend do KMIP que o plugin `keyring_okv` usa para armazenamento de chaveiros, a variável de sistema `keyring_okv_conf_dir` configura a localização do diretório usado pelo `keyring_okv` para seus arquivos de suporte. O valor padrão é vazio, então você deve definir a variável para nomear um diretório configurado corretamente antes que o plugin possa se comunicar com o backend do KMIP. Caso contrário, o `keyring_okv` escreverá uma mensagem no log de erro durante a inicialização do servidor que ele não consegue se comunicar:

```
[Warning] Plugin keyring_okv reported: 'For keyring_okv to be
initialized, please point the keyring_okv_conf_dir variable to a directory
containing Oracle Key Vault configuration file and ssl materials'
```

A variável `keyring_okv_conf_dir` deve nomear um diretório que contenha os seguintes itens:

- `okvclient.ora`: Um arquivo que contém detalhes do backend KMIP com o qual o `keyring_okv` se comunica.

- `ssl`: Um diretório que contém os arquivos de certificado e chave necessários para estabelecer uma conexão segura com o backend KMIP: `CA.pem`, `cert.pem` e `key.pem`. A partir do MySQL 5.7.20, se o arquivo de chave estiver protegido por senha, o diretório `ssl` pode conter um arquivo de texto de uma única linha chamado `password.txt`, contendo a senha necessária para descriptografar o arquivo de chave.

Tanto o arquivo `okvclient.ora` quanto o diretório `ssl` com os arquivos de certificado e chave são necessários para que o `keyring_okv` funcione corretamente. O procedimento usado para preencher o diretório de configuração com esses arquivos depende do backend KMIP usado com o `keyring_okv`, conforme descrito em outro lugar.

O diretório de configuração usado pelo `keyring_okv` como local para seus arquivos de suporte deve ter um modo restrito e ser acessível apenas à conta usada para executar o servidor MySQL. Por exemplo, em sistemas Unix e Unix-like, para usar o diretório `/usr/local/mysql/mysql-keyring-okv`, os seguintes comandos (executados como `root`) criam o diretório e definem seu modo e propriedade:

```sh
cd /usr/local/mysql
mkdir mysql-keyring-okv
chmod 750 mysql-keyring-okv
chown mysql mysql-keyring-okv
chgrp mysql mysql-keyring-okv
```

Para ser utilizado durante o processo de inicialização do servidor, o `keyring_okv` deve ser carregado usando a opção `--early-plugin-load` (server-options.html#option_mysqld_early-plugin-load). Além disso, defina a variável de sistema `keyring_okv_conf_dir` (keyring-system-variables.html#sysvar_keyring_okv_conf_dir) para indicar ao `keyring_okv` onde encontrar seu diretório de configuração. Por exemplo, use essas linhas no arquivo `my.cnf` do servidor, ajustando o sufixo `.so` e a localização do diretório conforme necessário para sua plataforma:

```
[mysqld]
early-plugin-load=keyring_okv.so
keyring_okv_conf_dir=/usr/local/mysql/mysql-keyring-okv
```

Para obter informações adicionais sobre `keyring_okv_conf_dir`, consulte Seção 6.4.4.12, “Variáveis do Sistema de Carteira de Chaves”.

##### Configurando o keyring_okv para o Oracle Key Vault

A discussão aqui pressupõe que você está familiarizado com o Oracle Key Vault. Algumas fontes de informações pertinentes:

- Site do Oracle Key Vault

- Documentação do Oracle Key Vault

Na terminologia do Oracle Key Vault, os clientes que usam o Oracle Key Vault para armazenar e recuperar objetos de segurança são chamados de pontos finais. Para se comunicar com o Oracle Key Vault, é necessário se registrar como um ponto final e se inscrever baixando e instalando os arquivos de suporte do ponto final. Observe que é necessário registrar um ponto final separado para cada instância do Servidor MySQL. Se duas ou mais instâncias do Servidor MySQL usarem o mesmo ponto final, elas podem interferir no funcionamento umas das outras.

O procedimento a seguir resume brevemente o processo de configuração do `keyring_okv` para uso com o Oracle Key Vault:

1. Crie o diretório de configuração para o plugin `keyring_okv` para uso.

2. Registre um ponto final no Oracle Key Vault para obter um token de inscrição.

3. Use o token de inscrição para obter o download do software cliente `okvclient.jar`.

4. Instale o software cliente para preencher o diretório de configuração `keyring_okv`, que contém os arquivos de suporte do Oracle Key Vault.

Use o procedimento a seguir para configurar o `keyring_okv` e o Oracle Key Vault para trabalhar juntos. Esta descrição resume apenas como interagir com o Oracle Key Vault. Para obter detalhes, visite o site Oracle Key Vault e consulte o *Guia do Administrador do Oracle Key Vault*.

1. Crie o diretório de configuração que contém os arquivos de suporte do Oracle Key Vault e certifique-se de que a variável de sistema `keyring_okv_conf_dir` esteja definida para o nome desse diretório (para detalhes, consulte Configuração geral do keyring_okv).

2. Faça login no console de gerenciamento do Oracle Key Vault como um usuário que tenha o papel de Administrador do sistema.

3. Selecione a guia Pontos de extremidade para chegar à página Pontos de extremidade. Na página Pontos de extremidade, clique em Adicionar.

4. Forneça as informações do ponto final necessárias e clique em Registrar. O tipo de ponto final deve ser Outro. O registro bem-sucedido resulta em um token de inscrição.

5. Faça logout do servidor do Oracle Key Vault.

6. Conecte-se novamente ao servidor do Oracle Key Vault, desta vez sem fazer login. Use o token de inscrição do endpoint para registrar e solicitar o download do software `okvclient.jar`. Salve esse arquivo no seu sistema.

7. Instale o arquivo `okvclient.jar` usando o comando a seguir (você deve ter o JDK 1.4 ou superior):

   ```sh
   java -jar okvclient.jar -d dir_name [-v]
   ```

   O nome do diretório após a opção `-d` é o local onde os arquivos extraídos serão instalados. A opção `-v`, se fornecida, gera informações de log que podem ser úteis se o comando falhar.

   Quando o comando solicitar uma senha do ponto de extremidade do Oracle Key Vault, não forneça uma. Em vez disso, pressione **Enter**. (O resultado é que não é necessária nenhuma senha quando o ponto de extremidade se conecta ao Oracle Key Vault.)

   O comando anterior produz um arquivo `okvclient.ora`, que deve estar neste local, sob o diretório nomeado pela opção `-d` no comando **java -jar** anterior:

   ```sh
   install_dir/conf/okvclient.ora
   ```

   O conteúdo esperado do arquivo inclui linhas que parecem assim:

   ```sh
   SERVER=host_ip:port_num
   STANDBY_SERVER=host_ip:port_num
   ```

   Nota

   Se o arquivo existente não estiver nesse formato, crie um novo arquivo com as linhas mostradas no exemplo anterior. Além disso, considere fazer um backup do arquivo `okvclient.ora` antes de executar o comando **okvutil**. Restaure o arquivo conforme necessário.

   O plugin `keyring_okv` tenta se comunicar com o servidor que está em execução no host nomeado pela variável `SERVER` e, se isso falhar, ele retorna para `STANDBY_SERVER`:

   - Para a variável `SERVER`, um ajuste no arquivo `okvclient.ora` é obrigatório.

   - Para a variável `STANDBY_SERVER`, um ajuste no arquivo `okvclient.ora` é opcional, a partir do MySQL 5.7.19. Antes do MySQL 5.7.19, um ajuste para `STANDBY_SERVER` é obrigatório; se o `okvclient.ora` for gerado sem ajuste para `STANDBY_SERVER`, o `keyring_okv` não consegue se inicializar. A solução é verificar o `oraclient.ora` e adicionar um ajuste “falso” para `STANDBY_SERVER`, se ele estiver ausente. Por exemplo:

     ```sql
     STANDBY_SERVER=127.0.0.1:5696
     ```

8. Vá para o diretório do instalador do Oracle Key Vault e teste a configuração executando este comando:

   ```sh
   okvutil/bin/okvutil list
   ```

   A saída deve parecer algo assim:

   ```sh
   Unique ID                               Type            Identifier
   255AB8DE-C97F-482C-E053-0100007F28B9	Symmetric Key	-
   264BF6E0-A20E-7C42-E053-0100007FB29C	Symmetric Key	-
   ```

   Para um servidor do Oracle Key Vault novo (um servidor sem nenhuma chave nele), a saída parece assim, para indicar que não há chaves no cofre:

   ```sh
   no objects found
   ```

9. Use este comando para extrair o diretório `ssl`, que contém os materiais SSL, do arquivo `okvclient.jar`:

   ```sh
   jar xf okvclient.jar ssl
   ```

10. Copie os arquivos de suporte do Oracle Key Vault (o arquivo `okvclient.ora` e o diretório `ssl`) para o diretório de configuração.

11. (Opcional) Se você deseja proteger o arquivo de chave com senha, use as instruções em Proteger a senha do arquivo de chave keyring_okv.

Após concluir o procedimento anterior, reinicie o servidor MySQL. Ele carrega o plugin `keyring_okv` e o `keyring_okv` usa os arquivos em seu diretório de configuração para se comunicar com o Oracle Key Vault.

##### Configurando o keyring_okv para a Unidade Gemalto SafeNet KeySecure

O dispositivo Gemalto SafeNet KeySecure utiliza o protocolo KMIP (versão 1.1 ou 1.2). A partir do MySQL 5.7.18, o plugin `keyring_okv` (que suporta o KMIP 1.1) pode usar o KeySecure como seu backend KMIP para armazenamento de chaves.

Use o procedimento a seguir para configurar o `keyring_okv` e o KeySecure para trabalhar juntos. A descrição resume apenas como interagir com o KeySecure. Para detalhes, consulte a seção intitulada "Adicionar um servidor KMIP" no [Guia do Usuário do KeySecure](https://www2.gemalto.com/aws-marketplace/usage/vks/uploadedFiles/Support_and_Downloads/AWS/007-012362-001-keysecure-appliance-user-guide-v7.1.0.pdf).

1. Crie o diretório de configuração que contém os arquivos de suporte do KeySecure e certifique-se de que a variável de sistema `keyring_okv_conf_dir` esteja definida para o nome desse diretório (para detalhes, consulte Configuração geral do keyring_okv).

2. No diretório de configuração, crie um subdiretório chamado `ssl` para armazenar os arquivos de certificado e chave SSL necessários.

3. No diretório de configuração, crie um arquivo chamado `okvclient.ora`. Ele deve ter o seguinte formato:

   ```sql
   SERVER=host_ip:port_num
   STANDBY_SERVER=host_ip:port_num
   ```

   Por exemplo, se o KeySecure estiver rodando no host 198.51.100.20 e ouvindo na porta 9002, o arquivo `okvclient.ora` ficaria assim:

   ```sh
   SERVER=198.51.100.20:9002
   STANDBY_SERVER=198.51.100.20:9002
   ```

4. Conecte-se ao Console de Gerenciamento KeySecure como administrador com credenciais para acesso às Autoridades de Certificação.

5. Acesse Segurança >> Autoridades Certificadoras Locais e crie uma autoridade certificadora local (CA).

6. Vá para Listas de Autoridades Certificadoras Confiáveis. Selecione Padrão e clique em Propriedades. Em seguida, selecione Editar para Lista de Autoridades Certificadoras Confiáveis e adicione a CA recém-criada.

7. Baixe a CA e salve-a no diretório `ssl` como um arquivo chamado `CA.pem`.

8. Vá para Segurança >> Solicitações de Certificado e crie um certificado. Em seguida, você pode baixar um arquivo **tar** compactado contendo arquivos PEM do certificado.

9. Extraia os arquivos PEM do arquivo baixado. Por exemplo, se o nome do arquivo for `csr_w_pk_pkcs8.gz`, descomprima e descompacte-o usando este comando:

   ```sh
   tar zxvf csr_w_pk_pkcs8.gz
   ```

   Duas pastas são geradas pela operação de extração: `certificate_request.pem` e `private_key_pkcs8.pem`.

10. Use este comando **openssl** para descriptografar a chave privada e criar um arquivo chamado `key.pem`:

    ```sh
    openssl pkcs8 -in private_key_pkcs8.pem -out key.pem
    ```

11. Copie o arquivo `key.pem` para o diretório `ssl`.

12. Copie o pedido de certificado em `certificate_request.pem` no clipboard.

13. Navegue até Segurança >> ACs Locais. Selecione a mesma CA que você criou anteriormente (a que você baixou para criar o arquivo `CA.pem`) e clique em Assinar Solicitação. Cole o Pedido de Certificado do clipboard, escolha um propósito de certificado de Cliente (o chaveiro é um cliente do KeySecure) e clique em Assinar Solicitação. O resultado é um certificado assinado com a CA selecionada em uma nova página.

14. Copie o certificado assinado para a área de transferência e, em seguida, armazene o conteúdo da área de transferência como um arquivo chamado `cert.pem` no diretório `ssl`.

15. (Opcional) Se você deseja proteger o arquivo de chave com senha, use as instruções em Proteger a senha do arquivo de chave keyring_okv.

Após concluir o procedimento anterior, reinicie o servidor MySQL. Ele carrega o plugin `keyring_okv` e o `keyring_okv` usa os arquivos em seu diretório de configuração para se comunicar com o KeySecure.

##### Configurando o keyring_okv para o Townsend Alliance Key Manager

O Townsend Alliance Key Manager utiliza o protocolo KMIP. O plugin `keyring_okv` pode usar o Alliance Key Manager como seu backend KMIP para armazenamento de chaves. Para obter informações adicionais, consulte [Alliance Key Manager para MySQL](https://www.townsendsecurity.com/product/encryption-key-management-mysql).

##### Protegendo a senha do arquivo de chave do porta-chaves_okv

A partir do MySQL 5.7.20, você pode, opcionalmente, proteger o arquivo de chave com uma senha e fornecer um arquivo contendo a senha para permitir que o arquivo de chave seja descriptografado. Para fazer isso, mude para o diretório `ssl` e execute os seguintes passos:

1. Criptografar o arquivo de chave `key.pem`. Por exemplo, use um comando como este e insira a senha de criptografia nas solicitações:

   ```sh
   $> openssl rsa -des3 -in key.pem -out key.pem.new
   Enter PEM pass phrase:
   Verifying - Enter PEM pass phrase:
   ```

2. Salve a senha de criptografia em um arquivo de texto de uma única linha chamado `password.txt` no diretório `ssl`.

3. Verifique se o arquivo de chave criptografado pode ser descriptografado usando o seguinte comando. O arquivo descriptografado deve ser exibido no console:

   ```sh
   $> openssl rsa -in key.pem.new -passin file:password.txt
   ```

4. Remova o arquivo original `key.pem` e renomeie `key.pem.new` para `key.pem`.

5. Altere a propriedade e o modo de acesso do novo arquivo `key.pem` e do arquivo `password.txt`, conforme necessário, para garantir que eles tenham as mesmas restrições que outros arquivos no diretório `ssl`.
