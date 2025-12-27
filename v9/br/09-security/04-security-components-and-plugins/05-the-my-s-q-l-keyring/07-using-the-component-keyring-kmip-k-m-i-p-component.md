#### 8.4.5.7 Usando o componente `component_keyring_kmip` do Keyring KMIP

Observação

`component_keyring_kmip` é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para obter mais informações sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

O componente Key Management Interoperability Protocol (KMIP) Keyring foi criado para substituir o plugin Keyring `keyring_okv`, que agora está desatualizado. Consulte Migração do Plugin KMIP.

O Key Management Interoperability Protocol (KMIP) permite a comunicação de chaves criptográficas entre um servidor de gerenciamento de chaves e seus clientes. O componente Keyring `component_keyring_kmip` utiliza o protocolo KMIP 1.1 para se comunicar de forma segura como cliente de um back-end KMIP. O material do Keyring é gerado exclusivamente pelo back-end, e não pelo `component_keyring_kmip`. O componente funciona com o Oracle Key Vault e qualquer outro produto que use o protocolo KMIP 1.1.

`component_keyring_kmip` suporta as funções que compõem a interface padrão do serviço Keyring do MySQL. As operações do Keyring realizadas por essas funções são acessíveis em instruções SQL, conforme descrito na Seção 8.4.5.15, “Funções de Gerenciamento de Chaves do Keyring de Uso Geral”.

Para usar `component_keyring_kmip` para gerenciamento de keystore, você deve:

1. Escrever um manifesto que instrua o servidor a carregar `component_keyring_kmip`, conforme descrito na Seção 8.4.5.2, “Instalação do Componente Keyring”.

2. Escrever um arquivo de configuração para `component_keyring_kmip`, conforme descrito aqui.

* Notas de Configuração
* Configurando o `component_keyring_kmip` para o Oracle Key Vault
* Protegendo a senha do arquivo de chave do `component_keyring_kmip`
* Migração do Plugin KMIP

Quando é inicializado, o `component_keyring_kmip` lê um arquivo de configuração global ou um arquivo de configuração global emparelhado com um arquivo de configuração local:

* O componente tenta ler seu arquivo de configuração global do diretório onde o arquivo da biblioteca do componente está instalado (ou seja, o diretório do plugin do servidor).

* Se o arquivo de configuração global indicar o uso de um arquivo de configuração local, o componente tenta ler seu arquivo de configuração local do diretório de dados.

* Embora os arquivos de configuração global e local estejam localizados em diretórios diferentes, o nome do arquivo é `component_keyring_kmip.cnf` em ambos os locais.

* É um erro que nenhum arquivo de configuração exista. O `component_keyring_kmip` não pode ser inicializado sem uma configuração válida.

Os arquivos de configuração do `component_keyring_kmip` têm essas propriedades:

* Um arquivo de configuração deve estar no formato JSON válido.
* Um arquivo de configuração permite esses itens de configuração:

  + `"kmip_configuration_directory"`: Indica o caminho de um diretório com qualquer configuração de servidor de vault suportada. O servidor MySQL requer certificados TLS para se comunicar com o servidor KMIP e espera que esses certificados estejam no diretório `config_dir/ssl`. O servidor MySQL procura os seguintes arquivos no diretório:

    - `CA.pem`
    - `cert.pem`
    - `key.pem` (se a chave estiver protegida por senha, consulte Protegendo a senha do arquivo de chave do componente\_keyring\_kmip)

Apenas os certificados do subdiretório `ssl/` são usados. Se os certificados estiverem protegidos por senha, então o `password.txt` precisa estar presente no subdiretório `ssl/`.

Se você usa o Oracle Key Vault, nem `okvclient.jar` nem `okvclient.ora` são usados para a configuração do componente. `okvclient.ora` contém as opções `SERVER=` e `STANDBY_SERVER=` que você passa diretamente ao configurar o plugin `keyring_okv`. Assim, o arquivo não é usado. O `okvclient.jar` contém o `libokvcsdk.so` (a biblioteca do SDK C), mas ele não é necessário pelo servidor.

  + `"cache_keys"`: Se o valor for `true`, as chaves são armazenadas em cache na memória em texto plano. Se o valor for `false`, as chaves são obtidas do servidor de backend sempre que acessadas.

  + `"server"`: O host principal com o número de porta.

  + `"standby_server"`: O host secundário com o número de porta.

A configuração parece assim:

```
{
     "kmip_configuration_directory":"path to directory that contains SSL certificates"
     "cache_keys": true/false
     "server": "primary_host:primary_port",
     "standby_server": [
       "secondary_one_host:secondary_one_port,
       "secondary_two_host:secondary_two_port",
       "secondary_three_host:secondary_thre_port",
     ]
}
```

##### Configurando o componente\_keyring\_kmip para o Oracle Key Vault

A discussão aqui assume que você está familiarizado com o Oracle Key Vault (OKV). Algumas fontes de informações pertinentes:

* Site do Oracle Key Vault

[Documentação do Oracle Key Vault](https://docs.oracle.com/en/database/oracle/key-vault/index.html)

Na terminologia do Oracle Key Vault, os clientes que usam o Oracle Key Vault para armazenar e recuperar objetos de segurança são chamados de endpoints. Para se comunicar com o Oracle Key Vault, é necessário se registrar como um endpoint e se inscrever baixando e instalando os arquivos de suporte do endpoint. Note que você deve registrar um endpoint separado para cada instância do servidor MySQL. Se duas ou mais instâncias do servidor MySQL usarem o mesmo endpoint, elas podem interferir no funcionamento do outro.

Para executar quaisquer comandos, você precisa recuperar o arquivo `okvrestclipackage.zip`. Este arquivo tem os diretórios `bin`, `lib` e `conf`.

`kmip_configuration_directory` tem `okvclient.jar`, `okvclient.ora` e `ssl`. Para permitir que o arquivo `okvclient.jar` faça o download do ponto de extremidade do servidor OKV, execute o seguinte comando:

```
${OKVRESTCLI}/bin/okv admin endpoint download --endpoint $EPNAME --location
ENDPOINT
```

Para criar o diretório `ssl`, execute o seguinte comando:

```
jar -xvf okvclient.jar ssl
```

Um arquivo de exemplo `component_keyring_kmip.cnf` parece o seguinte:

```
{
  "kmip_configuration_directory":"path to directory that contains the ssl/ directory and SSL certificates"
     "cache_keys": true
     "server": "VALID_OKV_SERVER_IP:VALID_OKV_SERVER_PORT"
     "standby_server": "VALID_OKV_STANDBY_SERVER:VALID_OKV_STANDBY_SERVER_PORT"
}
```

##### Protegendo a senha do arquivo de chave component\_keyring\_kmip

Você pode, opcionalmente, proteger o arquivo de chave com uma senha e fornecer um arquivo contendo a senha para permitir que o arquivo de chave seja descriptografado. Para fazer isso, mude para o diretório `ssl` e execute as seguintes etapas:

1. Criptografar o arquivo de chave `key.pem`. Por exemplo, use um comando como este, e insira a senha de criptografia nas solicitações:

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

##### Migração do plugin KMIP

Para migrar do plugin de chaveira KMIP para o componente de chaveira KMIP, você deve realizar as seguintes etapas:

1. Escreva um arquivo de manifesto local ou global `mysqld.my` (consulte a Seção 8.4.5.2, “Instalação do componente de chaveira”). O conteúdo do arquivo deve corresponder ao mostrado aqui:

   ```
   {
     "components": "file://component_keyring_kmip"
   }
   ```

2. Escreva um arquivo de configuração para o componente. Consulte as Notas de Configuração.

3. Realize qualquer migração de chaves que possa ser necessária. Consulte a Seção 8.4.5.14, “Migrar Chaves entre Keystores do Keyring” para obter mais informações.

4. Desinstale o plugin usando `UNINSTALL PLUGIN`. Consulte Desinstalação de Plugins.

5. Remova todas as referências ao plugin no `my.cnf` e em quaisquer outros arquivos de configuração do MySQL. Certifique-se de remover a linha mostrada aqui:

   ```
   early-plugin-load=keyring_okv.so
   ```

   Além disso, você deve remover referências a quaisquer variáveis específicas do plugin OKV keyring (opções equivalentes listadas anteriormente). As variáveis que são persistidas (salvadas em `mysqld-auto.cnf`) devem ser removidas da configuração do servidor usando `RESET PERSIST`.

6. Reinicie o **mysqld** para que as alterações tenham efeito.