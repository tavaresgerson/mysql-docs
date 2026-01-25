#### 6.4.4.5 Utilizando o Plugin Keyring Amazon Web Services keyring_aws

Nota

O plugin `keyring_aws` é uma extensão incluída no MySQL Enterprise Edition, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

O plugin Keyring `keyring_aws` se comunica com o Amazon Web Services Key Management Service (AWS KMS) como um back end para geração de Key e utiliza um arquivo local para armazenamento de Key. Todo o material do Keyring é gerado exclusivamente pelo servidor AWS, e não pelo `keyring_aws`.

O MySQL Enterprise Edition pode funcionar com `keyring_aws` no Red Hat Enterprise Linux, SUSE Linux Enterprise Server, Debian, Ubuntu, macOS e Windows. O MySQL Enterprise Edition não oferece suporte ao uso de `keyring_aws` nestas plataformas:

* EL6
* Generic Linux (glibc2.12)
* Solaris

A discussão aqui pressupõe que você esteja familiarizado com o AWS em geral e o KMS em particular. Algumas fontes de informação pertinentes:

* [Site do AWS](https://aws.amazon.com/kms/)
* [Documentação do KMS](https://docs.aws.amazon.com/kms/)

As seções a seguir fornecem informações de configuração e uso para o plugin Keyring `keyring_aws`:

* [Configuração do keyring_aws](keyring-aws-plugin.html#keyring-aws-plugin-configuration "keyring_aws Configuration")
* [Operação do keyring_aws](keyring-aws-plugin.html#keyring-aws-plugin-operation "keyring_aws Operation")
* [Mudanças de Credenciais do keyring_aws](keyring-aws-plugin.html#keyring-aws-plugin-credential-changes "keyring_aws Credential Changes")

##### Configuração do keyring_aws

Para instalar `keyring_aws`, utilize as instruções gerais encontradas na [Seção 6.4.4.1, “Instalação de Plugins Keyring”](keyring-plugin-installation.html "6.4.4.1 Keyring Plugin Installation"), juntamente com as informações de configuração específicas do plugin encontradas aqui.

O arquivo de biblioteca do plugin contém o plugin `keyring_aws` e duas funções carregáveis, [`keyring_aws_rotate_cmk()`](keyring-functions-plugin-specific.html#function_keyring-aws-rotate-cmk) e [`keyring_aws_rotate_keys()`](keyring-functions-plugin-specific.html#function_keyring-aws-rotate-keys).

Para configurar `keyring_aws`, você deve obter uma secret access key que fornece Credentials para comunicação com o AWS KMS e escrevê-la em um arquivo de configuração:

1. Crie uma conta AWS KMS.
2. Use o AWS KMS para criar um secret access key ID e uma secret access key. A access key serve para verificar sua identidade e a de suas aplicações.

3. Use a conta AWS KMS para criar um customer master key (CMK) ID. Na startup do MySQL, defina a variável de sistema [`keyring_aws_cmk_id`](keyring-system-variables.html#sysvar_keyring_aws_cmk_id) para o valor do CMK ID. Esta variável é obrigatória e não possui default. (Seu valor pode ser alterado em runtime, se desejado, usando [`SET GLOBAL`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment").)

4. Se necessário, crie o diretório onde o arquivo de configuração deve ser localizado. O diretório deve ter um modo restritivo e ser acessível apenas à conta usada para executar o MySQL server. Por exemplo, em muitos sistemas Unix e tipo Unix, como o Oracle Enterprise Linux, para usar `/usr/local/mysql/mysql-keyring/keyring_aws_conf` como nome do arquivo, os comandos a seguir (executados como `root`) criam o diretório pai e definem o modo e a propriedade do diretório:

   ```sql
   $> cd /usr/local/mysql
   $> mkdir mysql-keyring
   $> chmod 750 mysql-keyring
   $> chown mysql mysql-keyring
   $> chgrp mysql mysql-keyring
   ```

   Na startup do MySQL, defina a variável de sistema [`keyring_aws_conf_file`](keyring-system-variables.html#sysvar_keyring_aws_conf_file) como `/usr/local/mysql/mysql-keyring/keyring_aws_conf` para indicar a localização do arquivo de configuração ao server.

   A localização do arquivo de configuração pode variar conforme a distribuição Linux; o diretório para este arquivo também pode já ser fornecido por um módulo do sistema ou outra aplicação, como o AppArmor. Por exemplo, sob o AppArmor em edições recentes do Ubuntu Linux, o diretório keyring é especificado como `/var/lib/mysql-keyring`. Consulte [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/index.html) para obter mais informações sobre como usar o AppArmor em sistemas Ubuntu; consulte também [este exemplo de arquivo de configuração do MySQL](https://exampleconfig.com/view/mysql-ubuntu20-04-etc-apparmor-d-usr-sbin-mysqld). Para outras plataformas operacionais, consulte a documentação do sistema para orientação.

5. Prepare o arquivo de configuração `keyring_aws`, que deve conter duas linhas:

   * Linha 1: O secret access key ID
   * Linha 2: O secret access key

   Por exemplo, se o Key ID for `wwwwwwwwwwwwwEXAMPLE` e a Key for `xxxxxxxxxxxxx/yyyyyyy/zzzzzzzzEXAMPLEKEY`, o arquivo de configuração se parecerá com isto:

   ```sql
   wwwwwwwwwwwwwEXAMPLE
   xxxxxxxxxxxxx/yyyyyyy/zzzzzzzzEXAMPLEKEY
   ```

Para ser utilizável durante o processo de startup do server, `keyring_aws` deve ser carregado usando a opção [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load). A variável de sistema [`keyring_aws_cmk_id`](keyring-system-variables.html#sysvar_keyring_aws_cmk_id) é obrigatória e configura o customer master key (CMK) ID obtido do AWS KMS server. As variáveis de sistema [`keyring_aws_conf_file`](keyring-system-variables.html#sysvar_keyring_aws_conf_file) e [`keyring_aws_data_file`](keyring-system-variables.html#sysvar_keyring_aws_data_file) configuram opcionalmente as localizações dos arquivos usados pelo plugin `keyring_aws` para informações de configuração e armazenamento de dados. Os valores default da variável de localização do arquivo são específicos da plataforma. Para configurar as localizações explicitamente, defina os valores das variáveis na startup. Por exemplo, use estas linhas no arquivo `my.cnf` do server, ajustando o sufixo `.so` e as localizações dos arquivos para sua plataforma, conforme necessário:

```sql
[mysqld]
early-plugin-load=keyring_aws.so
keyring_aws_cmk_id='arn:aws:kms:us-west-2:111122223333:key/abcd1234-ef56-ab12-cd34-ef56abcd1234'
keyring_aws_conf_file=/usr/local/mysql/mysql-keyring/keyring_aws_conf
keyring_aws_data_file=/usr/local/mysql/mysql-keyring/keyring_aws_data
```

Para que o plugin `keyring_aws` inicie com sucesso, o arquivo de configuração deve existir e conter informações válidas de secret access key, inicializadas conforme descrito anteriormente. O arquivo de storage não precisa existir. Se não existir, `keyring_aws` tenta criá-lo (assim como seu diretório pai, se necessário).

Importante

A AWS region default é `us-east-1`. Para qualquer outra region, você também deve definir [`keyring_aws_region`](keyring-system-variables.html#sysvar_keyring_aws_region) explicitamente em `my.cnf`.

Para obter informações adicionais sobre as variáveis de sistema usadas para configurar o plugin `keyring_aws`, consulte a [Seção 6.4.4.12, “Variáveis de Sistema Keyring”](keyring-system-variables.html "6.4.4.12 Keyring System Variables").

Inicie o MySQL server e instale as funções associadas ao plugin `keyring_aws`. Esta é uma operação única, realizada pela execução das seguintes instruções, ajustando o sufixo `.so` para sua plataforma, conforme necessário:

```sql
CREATE FUNCTION keyring_aws_rotate_cmk RETURNS INTEGER
  SONAME 'keyring_aws.so';
CREATE FUNCTION keyring_aws_rotate_keys RETURNS INTEGER
  SONAME 'keyring_aws.so';
```

Para obter informações adicionais sobre as funções `keyring_aws`, consulte a [Seção 6.4.4.9, “Funções de Gerenciamento de Key Keyring Específicas do Plugin”](keyring-functions-plugin-specific.html "6.4.4.9 Plugin-Specific Keyring Key-Management Functions").

##### Operação do keyring_aws

Na startup do plugin, o plugin `keyring_aws` lê o AWS secret access key ID e a Key do seu arquivo de configuração. Ele também lê quaisquer Key criptografadas contidas em seu arquivo de storage para o seu Cache in-memory.

Durante a operação, `keyring_aws` mantém as Key criptografadas no Cache in-memory e usa o arquivo de storage como persistent storage local. Cada operação Keyring é transacional: `keyring_aws` muda com sucesso o Key Cache in-memory e o arquivo de storage Keyring, ou a operação falha e o estado do Keyring permanece inalterado.

Para garantir que as Key sejam descarregadas (flushed) apenas quando o arquivo de storage Keyring correto existir, `keyring_aws` armazena um Checksum SHA-256 do Keyring no arquivo. Antes de atualizar o arquivo, o plugin verifica se ele contém o Checksum esperado.

O plugin `keyring_aws` oferece suporte às funções que compõem o service interface Keyring padrão do MySQL. As operações Keyring executadas por estas funções são acessíveis em dois níveis:

* SQL interface: Em comandos SQL, chame as funções descritas na [Seção 6.4.4.8, “Funções de Gerenciamento de Key Keyring de Propósito Geral”](keyring-functions-general-purpose.html "6.4.4.8 General-Purpose Keyring Key-Management Functions").

* C interface: Em código na linguagem C, chame as service functions Keyring descritas na [Seção 5.5.6.2, “O Keyring Service”](keyring-service.html "5.5.6.2 The Keyring Service").

Exemplo (usando o SQL interface):

```sql
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Além disso, as funções [`keyring_aws_rotate_cmk()`](keyring-functions-plugin-specific.html#function_keyring-aws-rotate-cmk) e [`keyring_aws_rotate_keys()`](keyring-functions-plugin-specific.html#function_keyring-aws-rotate-keys) “estendem” o interface do plugin Keyring para fornecer capacidades relacionadas ao AWS não cobertas pelo service interface Keyring padrão. Essas capacidades são acessíveis apenas chamando estas funções usando SQL. Não existem service functions de Key em linguagem C correspondentes.

Para obter informações sobre as características dos Key values permitidos por `keyring_aws`, consulte a [Seção 6.4.4.6, “Tipos e Tamanhos de Key Keyring Suportados”](keyring-key-types.html "6.4.4.6 Supported Keyring Key Types and Lengths").

##### Mudanças de Credenciais do keyring_aws

Assumindo que o plugin `keyring_aws` tenha sido inicializado corretamente na startup do server, é possível alterar as Credentials usadas para comunicação com o AWS KMS:

1. Use o AWS KMS para criar um novo secret access key ID e secret access key.

2. Armazene as novas Credentials no arquivo de configuração (o arquivo nomeado pela variável de sistema [`keyring_aws_conf_file`](keyring-system-variables.html#sysvar_keyring_aws_conf_file)). O formato do arquivo é o descrito anteriormente.

3. Reinicialize o plugin `keyring_aws` para que ele releia o arquivo de configuração. Assumindo que as novas Credentials sejam válidas, o plugin deve inicializar com sucesso.

   Existem duas maneiras de reinicializar o plugin:

   * Reiniciar o server. Isso é mais simples e não tem efeitos colaterais, mas não é adequado para instalações que exigem tempo de inatividade mínimo do server com o menor número possível de restarts.

   * Reinicializar o plugin sem reiniciar o server executando as seguintes instruções, ajustando o sufixo `.so` para sua plataforma conforme necessário:

     ```sql
     UNINSTALL PLUGIN keyring_aws;
     INSTALL PLUGIN keyring_aws SONAME 'keyring_aws.so';
     ```

     Nota

     Além de carregar um plugin em runtime, [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") tem o efeito colateral de registrar o plugin na tabela do sistema `mysql.plugin`. Por causa disso, se você decidir parar de usar `keyring_aws`, não é suficiente remover a opção [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) do conjunto de opções usadas para iniciar o server. Isso impede que o plugin seja carregado cedo (early), mas o server ainda tentará carregá-lo quando chegar ao ponto na sequência de startup onde carrega os plugins registrados em `mysql.plugin`.

     Consequentemente, se você executar a sequência [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement") mais [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") descrita acima para alterar as Credentials do AWS KMS, para parar de usar `keyring_aws`, será necessário executar [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement") novamente para desregistrar o plugin, além de remover a opção [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) option.