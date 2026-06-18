#### 8.4.4.9 Usando o plugin Amazon Web Services Keyring do keyring\_aws

Nota

O plugin `keyring_aws` é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

O plugin de chaveira `keyring_aws` comunica-se com o Serviço de Gerenciamento de Chaves do Amazon Web Services (AWS KMS) como um backend para a geração de chaves e utiliza um arquivo local para armazenamento de chaves. Todo o material da chaveira é gerado exclusivamente pelo servidor da AWS, e não pelo `keyring_aws`.

A Edição Empresarial do MySQL pode funcionar com `keyring_aws` no Red Hat Enterprise Linux, SUSE Linux Enterprise Server, Debian, Ubuntu, macOS e Windows. A Edição Empresarial do MySQL não suporta o uso de `keyring_aws` nessas plataformas:

- EL6
- Linux genérico (glibc2.12)
- SLES 12 (com versões posteriores ao MySQL Server 5.7)
- Solaris

A discussão aqui pressupõe que você está familiarizado com o AWS em geral e o KMS em particular. Algumas fontes de informações pertinentes:

- Site da AWS
- Documentação do KMS

As seções a seguir fornecem informações de configuração e uso para o plugin `keyring_aws` keyring:

- chaveiro\_aws Configuração
- chaveiro\_aws Operação
- chave\_aws Alterações de credenciais

##### chaveiro\_aws Configuração

Para instalar o `keyring_aws`, use as instruções gerais encontradas na Seção 8.4.4.3, “Instalação do Plugin do Carteira de Chaves”, juntamente com as informações de configuração específicas do plugin encontradas aqui.

O arquivo da biblioteca de plugins contém o plugin `keyring_aws` e duas funções carregáveis, `keyring_aws_rotate_cmk()` e `keyring_aws_rotate_keys()`.

Para configurar o `keyring_aws`, você deve obter uma chave de acesso secreta que forneça credenciais para a comunicação com o AWS KMS e escrevê-la em um arquivo de configuração:

1. Crie uma conta do AWS KMS.

2. Use o AWS KMS para criar uma ID de chave de acesso secreta e uma chave de acesso secreta. A chave de acesso serve para verificar sua identidade e a de suas aplicações.

3. Use a conta do AWS KMS para criar um ID de chave do KMS. Ao iniciar o MySQL, defina a variável de sistema `keyring_aws_cmk_id` com o valor do ID do CMK. Essa variável é obrigatória e não tem um valor padrão. (Seu valor pode ser alterado em tempo de execução, se desejar, usando `SET GLOBAL`.)

4. Se necessário, crie o diretório onde o arquivo de configuração deve estar localizado. O diretório deve ter um modo restrito e ser acessível apenas à conta usada para executar o servidor MySQL. Por exemplo, em muitos sistemas Unix e semelhantes, como o Oracle Enterprise Linux, para usar `/usr/local/mysql/mysql-keyring/keyring_aws_conf` como o nome do arquivo, os seguintes comandos (executados como `root`) criam seu diretório pai e definem o modo e a propriedade do diretório:

   ```
   $> cd /usr/local/mysql
   $> mkdir mysql-keyring
   $> chmod 750 mysql-keyring
   $> chown mysql mysql-keyring
   $> chgrp mysql mysql-keyring
   ```

   Na inicialização do MySQL, defina a variável de sistema `keyring_aws_conf_file` para `/usr/local/mysql/mysql-keyring/keyring_aws_conf` para indicar o local do arquivo de configuração para o servidor.

   A localização do arquivo de configuração pode variar de acordo com a distribuição do Linux; o diretório para este arquivo também pode já ter sido fornecido por um módulo do sistema ou por outra aplicação, como o AppArmor. Por exemplo, sob o AppArmor em edições recentes do Ubuntu Linux, o diretório do chaveiro é especificado como `/var/lib/mysql-keyring`. Veja Ubuntu Server: AppArmor para mais informações sobre o uso do AppArmor em sistemas Ubuntu; veja também este exemplo de arquivo de configuração do MySQL. Para outras plataformas operacionais, consulte a documentação do sistema para obter orientações.

5. Prepare o arquivo de configuração `keyring_aws`, que deve conter duas linhas:

   - Linha 1: A ID da chave de acesso secreta
   - Linha 2: A chave de acesso secreta

   Por exemplo, se o ID da chave for `wwwwwwwwwwwwwEXAMPLE` e a chave for `xxxxxxxxxxxxx/yyyyyyy/zzzzzzzzEXAMPLEKEY`, o arquivo de configuração ficará assim:

   ```
   wwwwwwwwwwwwwEXAMPLE
   xxxxxxxxxxxxx/yyyyyyy/zzzzzzzzEXAMPLEKEY
   ```

Para ser utilizado durante o processo de inicialização do servidor, o `keyring_aws` deve ser carregado usando a opção `--early-plugin-load`. A variável de sistema `keyring_aws_cmk_id` é obrigatória e configura o ID da chave do KMS obtido do servidor do KMS da AWS. As variáveis de sistema `keyring_aws_conf_file` e `keyring_aws_data_file` configuram opcionalmente os locais dos arquivos usados pelo plugin `keyring_aws` para informações de configuração e armazenamento de dados. Os valores padrão da variável de localização do arquivo são específicos da plataforma. Para configurar os locais explicitamente, defina os valores da variável durante a inicialização. Por exemplo, use essas linhas no arquivo do servidor `my.cnf`, ajustando o sufixo `.so` e os locais dos arquivos para sua plataforma conforme necessário:

```
[mysqld]
early-plugin-load=keyring_aws.so
keyring_aws_cmk_id='arn:aws:kms:us-west-2:111122223333:key/abcd1234-ef56-ab12-cd34-ef56abcd1234'
keyring_aws_conf_file=/usr/local/mysql/mysql-keyring/keyring_aws_conf
keyring_aws_data_file=/usr/local/mysql/mysql-keyring/keyring_aws_data
```

Para que o plugin `keyring_aws` comece com sucesso, o arquivo de configuração deve existir e conter informações válidas da chave de acesso secreta, inicializadas conforme descrito anteriormente. O arquivo de armazenamento não precisa existir. Se não existir, o `keyring_aws` tentará criá-lo (assim como seu diretório pai, se necessário).

Importante

A região padrão da AWS é `us-east-1`. Para qualquer outra região, você também deve definir `keyring_aws_region` explicitamente em `my.cnf`.

Para obter informações adicionais sobre as variáveis do sistema usadas para configurar o plugin `keyring_aws`, consulte a Seção 8.4.4.19, “Variáveis do Sistema de Keychain”.

Inicie o servidor MySQL e instale as funções associadas ao plugin `keyring_aws`. Esta é uma operação única, realizada executando as seguintes instruções, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
CREATE FUNCTION keyring_aws_rotate_cmk RETURNS INTEGER
  SONAME 'keyring_aws.so';
CREATE FUNCTION keyring_aws_rotate_keys RETURNS INTEGER
  SONAME 'keyring_aws.so';
```

Para obter informações adicionais sobre as funções `keyring_aws`, consulte a Seção 8.4.4.16, “Funções de Gerenciamento de Chaves do Carteiro Específicas de Plugin”.

##### chaveiro\_aws Operação

Ao iniciar o plugin, o plugin `keyring_aws` lê o ID da chave de acesso secreta da AWS e a chave de seu arquivo de configuração. Ele também lê quaisquer chaves criptografadas contidas em seu arquivo de armazenamento em seu cache de memória.

Durante a operação, `keyring_aws` mantém chaves criptografadas no cache de memória e usa o arquivo de armazenamento como armazenamento persistente local. Cada operação do chaveiro é transacional: `keyring_aws` altera com sucesso tanto o cache de chave de memória quanto o arquivo de armazenamento do chaveiro, ou a operação falha e o estado do chaveiro permanece inalterado.

Para garantir que as chaves sejam descartadas apenas quando o arquivo de armazenamento do chaveiro correto existir, o `keyring_aws` armazena um checksum SHA-256 do chaveiro no arquivo. Antes de atualizar o arquivo, o plugin verifica se ele contém o checksum esperado.

O plugin `keyring_aws` suporta as funções que compõem a interface padrão do serviço de Keyring do MySQL. As operações de Keyring realizadas por essas funções são acessíveis em dois níveis:

- Interface SQL: Nas instruções SQL, chame as funções descritas na Seção 8.4.4.15, “Funções de Gerenciamento de Chave do Carteiro de Propósito Geral”.

- Interface C: No código em C, chame as funções do serviço de chave de registro descritas na Seção 7.6.9.2, “O Serviço de Chave de Registro”.

Exemplo (usando a interface SQL):

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Além disso, as funções `keyring_aws_rotate_cmk()` e `keyring_aws_rotate_keys()` “aumentam” a interface do plugin de chave de acesso para fornecer funcionalidades relacionadas à AWS que não são abrangidas pela interface padrão do serviço de chave de acesso. Essas funcionalidades só podem ser acessadas chamando essas funções usando SQL. Não há funções correspondentes do serviço de chave de acesso em C.

Para obter informações sobre as características dos valores-chave permitidos por `keyring_aws`, consulte a Seção 8.4.4.13, “Tipos e comprimentos de chave do carteiro suportado”.

##### chave\_aws Alterações de credenciais

Supondo que o plugin `keyring_aws` tenha sido inicializado corretamente ao iniciar o servidor, é possível alterar as credenciais usadas para se comunicar com o AWS KMS:

1. Use o AWS KMS para criar uma nova ID de chave de acesso secreta e uma chave de acesso secreta.

2. Armazene as novas credenciais no arquivo de configuração (o arquivo nomeado pela variável de sistema `keyring_aws_conf_file`). O formato do arquivo é conforme descrito anteriormente.

3. Reinicie o plugin `keyring_aws` para que ele leia novamente o arquivo de configuração. Supondo que as novas credenciais sejam válidas, o plugin deve ser iniciado com sucesso.

   Existem duas maneiras de reinicializar o plugin:

   - Reinicie o servidor. Isso é mais simples e não tem efeitos colaterais, mas não é adequado para instalações que exigem o mínimo de tempo de inatividade do servidor com o menor número possível de reinicializações.

   - Reinicie o plugin sem reiniciar o servidor executando as seguintes instruções, ajustando o sufixo `.so` para sua plataforma conforme necessário:

     ```
     UNINSTALL PLUGIN keyring_aws;
     INSTALL PLUGIN keyring_aws SONAME 'keyring_aws.so';
     ```

     Nota

     Além de carregar um plugin em tempo de execução, `INSTALL PLUGIN` tem o efeito colateral de registrar o plugin no `mysql.plugin` sistema de tabela. Por isso, se você decidir parar de usar `keyring_aws`, não é suficiente remover a opção `--early-plugin-load` do conjunto de opções usadas para iniciar o servidor. Isso impede que o plugin seja carregado precocemente, mas o servidor ainda tenta carregá-lo quando chega ao ponto da sequência de inicialização onde ele carrega os plugins registrados em `mysql.plugin`.

     Portanto, se você executar a sequência `UNINSTALL PLUGIN` mais `INSTALL PLUGIN` descrita acima para alterar as credenciais do AWS KMS, então para parar de usar `keyring_aws`, é necessário executar novamente `UNINSTALL PLUGIN` para desinscrever o plugin, além de remover a opção `--early-plugin-load`.
