#### 8.4.5.8 Usando o plugin keyring_aws Amazon Web Services Keyring

Nota

O plugin `keyring_aws` é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

Importante

O plugin keyring `keyring_aws` está desatualizado e está sendo substituído pelo componente AWS Keyring (`component_aws_keyring`). A desatualização do plugin significa que você deve esperar que o plugin seja removido em uma versão futura do MySQL. Para obter mais informações, incluindo informações sobre a migração do plugin `keyring_aws` para `component_aws_keyring`, consulte a Seção 8.4.5.9, “Usando o componente_keyring_aws do componente AWS Keyring”.

O plugin keyring `keyring_aws` comunica-se com o Serviço de Gerenciamento de Chaves do Amazon Web Services (AWS KMS) como um backend para geração de chaves e usa um arquivo local para armazenamento de chaves. Todo o material do keyring é gerado exclusivamente pelo servidor AWS, e não pelo `keyring_aws`.

A Edição Empresarial do MySQL pode trabalhar com `keyring_aws` em Red Hat Enterprise Linux, SUSE Linux Enterprise Server, Debian, Ubuntu, macOS e Windows. A Edição Empresarial do MySQL não suporta o uso de `keyring_aws` nessas plataformas:

* EL6
* Linux genérico (glibc2.12)
* SLES 12 (com versões após o MySQL Server 5.7)
* Solaris

A discussão aqui assume que você está familiarizado com o AWS em geral e o KMS em particular. Algumas fontes de informações pertinentes:

[Site do AWS](https://aws.amazon.com/kms/)
[Documentação do KMS](https://docs.aws.amazon.com/kms/)

As seções a seguir fornecem informações de configuração e uso para o plugin keyring `keyring_aws`:

* Configuração keyring_aws
* Operação keyring_aws
* Alterações de credenciais keyring_aws

Para instalar o `keyring_aws`, use as instruções gerais encontradas na Seção 8.4.5.3, “Instalação do Plugin Keyring”, juntamente com as informações de configuração específicas do plugin encontradas aqui.

O arquivo da biblioteca do plugin contém o plugin `keyring_aws` e duas funções carregáveis, `keyring_aws_rotate_cmk()` e `keyring_aws_rotate_keys()`.

Para configurar o `keyring_aws`, você deve obter uma chave de acesso secreta que forneça credenciais para a comunicação com o AWS KMS e escrevê-la em um arquivo de configuração:

1. Crie uma conta do AWS KMS.
2. Use o AWS KMS para criar um ID de chave de acesso secreta e uma chave de acesso secreta. A chave de acesso serve para verificar sua identidade e a de suas aplicações.

3. Use a conta do AWS KMS para criar um ID de chave do KMS. Na inicialização do MySQL, defina a variável de sistema `keyring_aws_cmk_id` com o valor do ID de chave do CMK. Essa variável é obrigatória e não tem um valor padrão. (Seu valor pode ser alterado em tempo de execução, se desejado, usando `SET GLOBAL`.)

4. Se necessário, crie o diretório onde o arquivo de configuração deve estar localizado. O diretório deve ter um modo restrito e ser acessível apenas à conta usada para executar o servidor MySQL. Por exemplo, em muitos sistemas Unix e Unix-like, como o Oracle Enterprise Linux, para usar `/usr/local/mysql/mysql-keyring/keyring_aws_conf` como o nome do arquivo, os seguintes comandos (executados como `root`) criam seu diretório pai e definem o modo e a propriedade do diretório:

   ```
   $> cd /usr/local/mysql
   $> mkdir mysql-keyring
   $> chmod 750 mysql-keyring
   $> chown mysql mysql-keyring
   $> chgrp mysql mysql-keyring
   ```

   Na inicialização do MySQL, defina a variável de sistema `keyring_aws_conf_file` para `/usr/local/mysql/mysql-keyring/keyring_aws_conf` para indicar a localização do arquivo de configuração ao servidor.

A localização do arquivo de configuração pode variar de acordo com a distribuição do Linux; o diretório para este arquivo também pode já ser fornecido por um módulo do sistema ou por outra aplicação, como o AppArmor. Por exemplo, sob o AppArmor em edições recentes do Ubuntu Linux, o diretório keyring é especificado como `/var/lib/mysql-keyring`. Consulte [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/index.html) para obter mais informações sobre o uso do AppArmor em sistemas Ubuntu; consulte também [este exemplo de arquivo de configuração MySQL](https://exampleconfig.com/view/mysql-ubuntu20-04-etc-apparmor-d-usr-sbin-mysqld). Para outras plataformas operacionais, consulte a documentação do sistema para obter orientações.

5. Prepare o arquivo de configuração `keyring_aws`, que deve conter duas linhas:

   * Linha 1: O ID da chave de acesso secreta
   * Linha 2: A chave de acesso secreta

   Por exemplo, se o ID da chave for `wwwwwwwwwwwwwEXAMPLE` e a chave for `xxxxxxxxxxxxx/yyyyyyy/zzzzzzzzEXAMPLEKEY`, o arquivo de configuração ficará assim:

   ```
   wwwwwwwwwwwwwEXAMPLE
   xxxxxxxxxxxxx/yyyyyyy/zzzzzzzzEXAMPLEKEY
   ```

Para ser usado durante o processo de inicialização do servidor, o `keyring_aws` deve ser carregado usando a opção `--early-plugin-load`. A variável de sistema `keyring_aws_cmk_id` é obrigatória e configura o ID da chave KMS obtido do servidor KMS da AWS. As variáveis de sistema `keyring_aws_conf_file` e `keyring_aws_data_file` opcionalmente configuram os locais dos arquivos usados pelo plugin `keyring_aws` para informações de configuração e armazenamento de dados. Os valores padrão da variável de localização do arquivo são específicos da plataforma. Para configurar os locais explicitamente, defina os valores da variável durante o inicialização. Por exemplo, use essas linhas no arquivo `my.cnf` do servidor, ajustando o sufixo `.so` e os locais dos arquivos para sua plataforma conforme necessário:

```
[mysqld]
early-plugin-load=keyring_aws.so
keyring_aws_cmk_id='arn:aws:kms:us-west-2:111122223333:key/abcd1234-ef56-ab12-cd34-ef56abcd1234'
keyring_aws_conf_file=/usr/local/mysql/mysql-keyring/keyring_aws_conf
keyring_aws_data_file=/usr/local/mysql/mysql-keyring/keyring_aws_data
```

Nota

`--early-plugin-load` está desatualizado e gera uma mensagem de aviso sempre que é usado. Consulte a descrição desta opção para obter mais informações.

Para que o plugin `keyring_aws` comece com sucesso, o arquivo de configuração deve existir e conter informações válidas de chave de acesso secreta, inicializadas conforme descrito anteriormente. O arquivo de armazenamento não precisa existir. Se não existir, o `keyring_aws` tenta criá-lo (assim como seu diretório pai, se necessário).

Importante

A região padrão do AWS é `us-east-1`. Para qualquer outra região, você deve definir explicitamente `keyring_aws_region` no `my.cnf`.

Para obter informações adicionais sobre as variáveis de sistema usadas para configurar o plugin `keyring_aws`, consulte a Seção 8.4.5.19, “Variáveis de sistema do keyring”.

Inicie o servidor MySQL e instale as funções associadas ao plugin `keyring_aws`. Esta é uma operação única, realizada executando as seguintes instruções, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
CREATE FUNCTION keyring_aws_rotate_cmk RETURNS INTEGER
  SONAME 'keyring_aws.so';
CREATE FUNCTION keyring_aws_rotate_keys RETURNS INTEGER
  SONAME 'keyring_aws.so';
```

Para obter informações adicionais sobre as funções `keyring_aws`, consulte a Seção 8.4.5.16, “Funções de gerenciamento de chaves do keyring específicas do plugin”.

##### operação keyring\_aws

Ao iniciar o plugin, o plugin `keyring_aws` lê o ID e a chave de acesso secreta do AWS de seu arquivo de configuração. Ele também lê quaisquer chaves criptografadas contidas em seu arquivo de armazenamento no cache de memória.

Durante a operação, o `keyring_aws` mantém chaves criptografadas no cache de memória e usa o arquivo de armazenamento como armazenamento persistente local. Cada operação do keyring é transacional: o `keyring_aws` altera com sucesso tanto o cache de chaves de memória quanto o arquivo de armazenamento do keyring, ou a operação falha e o estado do keyring permanece inalterado.

Para garantir que as chaves sejam descartadas apenas quando o arquivo de armazenamento correto do conjunto de chaves existe, o `keyring_aws` armazena um checksum SHA-256 do conjunto de chaves no arquivo. Antes de atualizar o arquivo, o plugin verifica se ele contém o checksum esperado.

O plugin `keyring_aws` suporta as funções que compõem a interface padrão do serviço de conjunto de chaves MySQL. As operações de conjunto de chaves realizadas por essas funções são acessíveis em dois níveis:

* Interface SQL: Em instruções SQL, chame as funções descritas na Seção 8.4.5.15, “Funções de Gerenciamento de Chaves de Conjunto de Chaves de Uso Geral”.

* Interface C: Em código em C, chame as funções do serviço de conjunto de chaves descritas na Seção 7.6.8.2, “O Serviço de Conjunto de Chaves”.

Exemplo (usando a interface SQL):

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Além disso, as funções `keyring_aws_rotate_cmk()` e `keyring_aws_rotate_keys()` “estende” a interface do plugin de conjunto de chaves para fornecer capacidades relacionadas à AWS que não são cobertas pela interface padrão do serviço de conjunto de chaves. Essas capacidades são acessíveis apenas chamando essas funções usando SQL. Não há funções correspondentes do serviço de chaves em C.

Para informações sobre as características dos valores de chave permitidos pelo `keyring_aws`, consulte a Seção 8.4.5.13, “Tipos e Comprimentos de Chaves de Conjunto de Chaves Suportáveis”.

##### keyring\_aws Alterações de Credenciais

Supondo que o plugin `keyring_aws` tenha sido inicializado corretamente no início do servidor, é possível alterar as credenciais usadas para se comunicar com o AWS KMS:

1. Use o AWS KMS para criar um novo ID de chave de acesso secreta e uma chave de acesso secreta.

2. Armazene as novas credenciais no arquivo de configuração (o arquivo nomeado pela variável de sistema `keyring_aws_conf_file`). O formato do arquivo é como descrito anteriormente.

3. Reinicie o plugin `keyring_aws` para que ele leia novamente o arquivo de configuração. Supondo que as novas credenciais sejam válidas, o plugin deve ser inicializado com sucesso.

Existem duas maneiras de reiniciar o plugin:

* Reinicie o servidor. Isso é mais simples e não tem efeitos colaterais, mas não é adequado para instalações que exigem o mínimo de tempo de inatividade do servidor com o menor número possível de reinicializações.

* Reinicie o plugin sem reiniciar o servidor executando as seguintes instruções, ajustando o sufixo `.so` para sua plataforma conforme necessário:

     ```
     UNINSTALL PLUGIN keyring_aws;
     INSTALL PLUGIN keyring_aws SONAME 'keyring_aws.so';
     ```

     Observação

     Além de carregar um plugin em tempo de execução, `INSTALL PLUGIN` tem o efeito colateral de registrar o plugin no sistema `mysql.plugin`. Por isso, se você decidir parar de usar `keyring_aws`, não é suficiente remover a opção `--early-plugin-load` do conjunto de opções usadas para iniciar o servidor. Isso para o plugin de carregar precocemente, mas o servidor ainda tenta carregá-lo quando chega ao ponto da sequência de inicialização onde ele carrega os plugins registrados em `mysql.plugin`.

Consequentemente, se você executar a sequência `UNINSTALL PLUGIN` mais `INSTALL PLUGIN` descrita acima para alterar as credenciais do AWS KMS, então para parar de usar `keyring_aws`, é necessário executar `UNINSTALL PLUGIN` novamente para desregistrar o plugin além de remover a opção `--early-plugin-load`.