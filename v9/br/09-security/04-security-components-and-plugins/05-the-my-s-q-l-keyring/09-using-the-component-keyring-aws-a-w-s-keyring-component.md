#### 8.4.5.9 Uso do componente `component_keyring_aws` do AWS Keyring

Observação

`component_keyring_aws` é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para obter mais informações sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

O componente AWS Keyring é destinado a substituir o plugin AWS Keyring, que agora está desatualizado. Consulte Migração do plugin AWS keyring.

O componente `component_keyring_aws` armazena chaves criptografadas pelo AWS KMS, usando o serviço de Chave Gerida pelo Cliente (CMK), em um arquivo local ao hospedeiro do servidor.

`component_keyring_aws` suporta as funções que compõem a interface padrão do serviço MySQL Keyring. As operações de Keyring realizadas por essas funções são acessíveis em instruções SQL conforme descrito na Seção 8.4.5.15, “Funções de Gerenciamento de Chaves de Keyring de Uso Geral”.

Exemplo:

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

Para obter informações sobre as características dos valores de chave permitidos por `component_keyring_aws`, consulte a Seção 8.4.5.13, “Tipos e comprimentos de chaves de Keyring suportados”.

Para usar `component_keyring_aws` para gerenciamento de keystore, você deve:

1. Escrever um manifesto que indique ao servidor para carregar `component_keyring_aws`, conforme descrito na Seção 8.4.5.2, “Instalação do componente Keyring”.

   Para `component_keyring_aws`, o conteúdo do arquivo manifesto é mostrado aqui:

   ```
   {
     "components": "file://component_aws_keyring"
   }
   ```

2. Escrever um arquivo de configuração para `component_keyring_aws`, conforme descrito na Configuração do componente AWS Keyring.

O componente AWS Keyring suporta dois modos de autenticação, simples e nativo, conforme determinado pelo valor do parâmetro `aws_authentication.mode`, especificado em `component_keyring_aws.cnf`. Este parâmetro é obrigatório. A configuração do componente para suportar cada um desses modos pode ser encontrada no modo de autenticação simples e no modo de autenticação nativa, respectivamente.

* Configuração do componente AWS Keyring
* Modo de autenticação simples
* Modo de autenticação nativo
* Migração do plugin AWS keyring

##### Configuração do componente AWS Keyring

Quando se inicializa, `component_keyring_aws` lê um arquivo de configuração do componente `component_keyring_aws.cnf`, conforme descrito na Seção 8.4.5.2, “Instalação do componente Keyring”.

Em alguns casos, informações adicionais podem ser lidas de um arquivo de configuração AWS, um arquivo de credenciais ou ambos. Esses arquivos são descritos mais adiante nesta seção.

Se `component_keyring_aws` não conseguir encontrar o arquivo de configuração, um erro ocorre e o componente não pode ser inicializado.

O arquivo de configuração `component_keyring_aws.cnf` deve estar no formato JSON válido. Os itens de configuração suportados neste arquivo são mostrados na tabela a seguir:

**Tabela 8.31 Itens de configuração component_keyring_aws.cnf**

<table border="1" class="table" summary="Esta tabela fornece informações sobre os itens de configuração suportados no arquivo component_keyring_aws.cnf.">
<colgroup><col/><col/><col/><col/><col/><col/><col/></colgroup>
<thead><tr><th>Parâmetro</th><th>Pai</th><th>Descrição</th><th>Valido</th><th>Obrigatório</th><th>Padrão</th><th>Valores permitidos</th></tr></thead>
<tbody><tr><th><code class="literal">cmk_id</code></th><th>—</th><th>Identificador do CMK (Customer Managed Key) obtido do servidor KMS da AWS</th><th>—</th><th>Sim</th><th>—</th><th>—</th></tr>
<tr><th><code class="literal">data_file</code></th><th>—</th><th>Localização do arquivo de armazenamento JSON do componente</th><th>—</th><th>Sim</th><th>—</th></tr>
<tr><th><code class="literal">cache_keys</code></th><th>—</th><th><code class="literal">true</code>: Chaves armazenadas em cache na memória em texto plano; <code class="literal">false</code>: Chaves descriptografadas ao serem acessadas</th><th>—</th><th>Não</th><th><code class="literal">false</code></th><th><code class="literal">true</code>, <code class="literal">false</code></th></tr>
<tr><th><code class="literal">mode</code></th><th><code class="literal">aws_authentication</code></th><th>Modo de autenticação da AWS</th><th>—</th><th>Sim</th><th>—</th></tr>
<tr><th><code class="literal">profile</code></th><th><code class="literal">aws_authentication</code></th><th>Nome do perfil da AWS usado para autenticação nativa da AWS</th><th>Quando <code class="literal">aws_authentication.mode</code> é <code class="literal">native</code></th><th>Não</th><th><code class="literal">default</code></th></tr>
<tr><th><code class="literal">region</code></th><th><code class="literal">aws_authentication</code></th><th>Região da AWS</th><th>Quando <code class="literal">aws_authentication.mode</code> é <code class="literal">simple</code></th><th>Sim, quando <code class="literal">aws_authentication.mode</code> é <code class="literal">simple</code></th><th><code class="literal">us-east-1</code></th></tr>
<tr><th><code class="literal">access_key_id</code></th><th><code class="literal">aws_authentication</code></th><th>Identificador de chave de acesso da AWS</th><th>Quando <code class="literal">aws_authentication.mode</code> é <code class="literal">simple</code></th><th>Sim, quando <code class="literal">aws_authentication.mode</code> é <code class="literal">simple</code></th><th>—</th></tr>
<tr><th><code class="literal">access_key_secret</code></th><th><code class="literal">aws_authentication</code></th><th>Segredo da chave de acesso da AWS</th><th>Quando <code class="literal">aws_authentication.mode</code> é <code class="literal">simple</code></th><th>Sim, quando <code class="literal">aws_authentication.mode</code> é <code class="literal">simple</code></th><th>—</th></tr>
<tr><th><code class="literal">connect_timeout_ms</code></th><th><code class="literal">aws_connection</code></th><th>Timeout da conexão de rede</th><th> </th><th>Não</th><th><code class="literal">1000</code></th></tr>
<tr><th><code class="literal">host</code></th><th><code class="literal">aws_connection.proxy</code></th><th>Host do proxy</th><th>—</th><th>Não</th><th>—</th></tr>
<tr><th><code class="literal">port</code></th><th><code class="literal">aws_connection.proxy</code></th><th>Porta do proxy</th><th>—</th><th>Não</th><th>—</th></tr>
<tr><th><code class="literal">user</code></th><th><code class="literal">aws_connection.proxy</code></th><th>Nome do usuário do proxy</th><th>—</th><th>Não</th><th>—</th></tr>
<tr><th><code class="literal">password</code></th><th><code class="literal">aws_connection.proxy</code></th><th>Senha do usuário do proxy</th><th>—</th><th>Não</th><th>—</th></tr>
<tr><th><code class="literal">read_only</code></th><th>—</th><th>Quando <code class="literal">true</code>, operações que modificam o keyring não são permitidas</th><th>—</th><th>Não</th><th><code class="literal">false</code></th><th><code class="literal">true</code>, <code class="literal">false</code></th></tr></tbody></table>

`aws_authentication.region` tem o valor padrão `us-east-1` e deve ser definido explicitamente para qualquer outra região.

Os parâmetros do arquivo de configuração do componente que não são válidos são ignorados. Por exemplo, `aws_authentication.access_key_id` e `aws_authentication.access_key_secret` não têm efeito quando o `aws_authentication.mode` é `native`.

O administrador do banco de dados é responsável por criar quaisquer arquivos de configuração a serem usados e por garantir que seus conteúdos sejam corretos. Se ocorrer um erro, o inicialização do servidor falha; o administrador deve corrigir quaisquer problemas indicados por mensagens de diagnóstico no log de erro do servidor.

Importante

Qualquer arquivo de configuração que armazene um segredo de chave deve ter um modo restritivo e ser acessível apenas à conta usada para executar o servidor MySQL.

Dadas as informações dos itens do arquivo de configuração anteriores, para configurar `component_keyring_aws`, crie um arquivo de configuração do componente chamado `component_keyring_aws.cnf` no diretório indicado anteriormente.

Também é necessário um arquivo de dados de chave de leitura/escrita usando o formato JSON, cuja localização é determinada pelo item de configuração `data_file`; as instruções seguintes assumem que tal arquivo existe em `/usr/local/mysql/keyring.json`. Um exemplo de seu conteúdo é mostrado aqui:

```
{
  "version":"1.0","elements":
    [
      {
        "user":"mary@%",
        "data_id":"key0",
        "data_type":"AES",
        "data":"0102010078865A35D86559D92C3124146819057E927382E061F6EA7613DF2B9B
E72FB0E62C01A1CF92B96934CB08D42D231CF6828A420000006E306C06092A864886F70D010706A0
5F305D020100305806092A864886F70D010701301E060960864801650304012E3011040C19F809F2
7900EACEF99DE2B4020110802BEDA406610AF033504B601C5EC937EFB9F38BB631F68856FF7FA81E
637FCC400BA35900929E99E628E1B3E7",
        "extension":[]
      },
      {
        "user":"mary@%",
        "data_id":"key1",
        "data_type":"AES",
        "data":"0102010078865A35D86559D92C3124146819057E927382E061F6EA7613DF2B9B
E72FB0E62C017CAA36B2F756892C3AFCAA074A13E655000001043082010006092A864886F70D0107
06A081F23081EF0201003081E906092A864 886F70D010701301E060960864801650304012E30110
40CCDECB095F68DE68BC331A0730201108081BB52EF64775CCE3DD47ADD8C274A297EB1A6E988085
C0036D0AAE64DE50BB7D5AC020A12BF70",
        "extension":[]
      },
      {
        "user":"john@%",
        "data_id":"key2",
        "data_type":"AES",
        "data":"0102010078865A35D86559D92C3124146819057E927382E061F6EA7613DF2B9B
E72FB0E62C01BB9CC22B82E3DB50C76FD855DE0CB305000001043082010006092A864886F70D0107
06A081F23081EF0201003081E906092A864886F70D010701301E060960864801650304012E301104
0C778A6EDBA93A1FF27D82F5340201108081BB809B9599C191BF0DF1F7721DB2915F7A02A5928981
BF9264D9B76BE41046C3B5AF60006F4A",
        "extension":[]
        }
    ]
}
```

Nota

Cada um dos valores `data` mostrados acima consiste em uma única linha; os valores foram enquadrados aqui para caber dentro dos limites do espaço de visualização.

As operações de chaveiro são transacionais: o `component_keyring_aws` usa um arquivo de backup durante as operações de escrita para garantir que possa reverter ao arquivo original se uma operação falhar. O arquivo de backup tem o mesmo nome que o arquivo de dados com o sufixo `.backup`.

Os arquivos de configuração `component_keyring_aws` não podem ser colocados em qualquer lugar dentro do diretório de dados do servidor MySQL.

##### Modo de autenticação simples

Este modo oferece facilidade de uso quando mecanismos AWS mais avançados não são necessários. (Isso também simplifica a atualização do plugin de chaveira AWS legado para o componente; veja Migração do plugin de chaveira AWS.) Os arquivos `config` e `credentials` não são usados neste caso; a configuração é lida apenas do arquivo global `component_keyring_aws.cnf`. Para habilitar o modo de autenticação simples, defina `aws_authentication.mode` para `simple` neste arquivo.

No modo simples, o componente usa o ID de chave de acesso e o segredo obtidos da AWS, que também são definidos em `component_keyring_aws.cnf`, como os valores dos itens de configuração `aws_authentication.access_key_id` e `aws_authentication.access_key_secret`. Além disso, você deve especificar uma região usando `aws_authentication.region`.

O conteúdo de um exemplo de `component_keyring_aws.cnf` que atende aos requisitos para habilitar o modo de autenticação simples é mostrado aqui:

```
{
  "cmk_id": "arn:aws:kms:us-east-1:79566666666:key/d0111111-1111-1111-1111-999999999abd",
  "data_file": "/usr/local/mysql/keyring.json",
  "cache_keys": "true",
  "aws_authentication":
  {
    "mode": "simple",
    "region": "us-east-1",
    "access_key_id": "wwwwwwwwwwwwwEXAMPLE",
    "access_key_secret": "xxxxxxxxxxxxx/yyyyyyy/zzzzzzzzEXAMPLEKEY"
  }
}
```

##### Modo de autenticação nativo

Quando `aws_authentication.mode` é `native`, o componente de chaveira AWS usa o mecanismo padrão de configuração de autenticação da AWS (veja [AWS SDKs and Tools: Configuration](https://docs.aws.amazon.com/sdkref/latest/guide/creds-config-files.html)) e o perfil da AWS especificado no arquivo de configuração do componente. A fonte das credenciais da AWS neste caso é a cadeia de provedores de credenciais padrão da AWS (veja [AWS SDKs and Tools: Standardized credential providers](https://docs.aws.amazon.com/sdkref/latest/guide/standardized-credentials.html)).

Habilitar o modo de autenticação nativa da AWS com o componente de Chaveira AWS é mais complexo, mas oferece as seguintes vantagens:

* Conformidade com o comportamento padrão do cliente da AWS
* Suporte para métodos de configuração de autenticação diferentes de armazenar segredos de longo prazo no mesmo arquivo que outros itens de configuração.

* É possível aproveitar o papel conectado a um contêiner ou nó de computação da AWS, melhorando assim a segurança.

* Configuração mais flexível, pois uma gama mais ampla de parâmetros, como tempos de espera, proxy e uso de uma CA, está disponível com o modo alternativo.

Para habilitar a autenticação nativa da AWS, o `aws_authentication.mode` deve ser definido como `native` no arquivo `component_keyring_aws.cnf`, conforme mostrado aqui:

```
{
  "cmk_id": "arn:aws:kms:us-east-1:79566666666:key/d0111111-1111-1111-1111-999999999abd",
  "data_file": "/usr/local/mysql/keyring.json",
  "cache_keys": true,
  "aws_authentication":
  {
    "mode": "native"
  }
}
```

A configuração do componente para autenticação nativa da AWS é baseada em uma cadeia de provedores de credenciais. Cada provedor usa uma fonte diferente para as credenciais; fontes possíveis incluem arquivos, variáveis de ambiente e serviços externos. Os provedores são chamados na ordem especificada pela cadeia de provedores padrão descrita nos próximos parágrafos.

**Cadeia padrão de provedores de credenciais.** Uma cadeia de provedores de credenciais consiste em um ou mais provedores de credenciais. Cada provedor fornece credenciais tiradas de uma fonte diferente. Os provedores são chamados até que as credenciais sejam fornecidas e coletadas para uso posterior. A cadeia padrão consiste nos provedores de credenciais listados aqui, juntamente com as credenciais que cada um deles fornece:

[AWS SDKs and Tools: AWS access keys](https://docs.aws.amazon.com/sdkref/latest/guide/feature-static-credentials.html) para detalhes). Isso é conveniente em ambientes de desenvolvimento ou outros ambientes de curto prazo, mas não é recomendado para produção.

[AWS SDKs and Tools: AWS access keys](https://docs.aws.amazon.com/sdkref/latest/guide/feature-static-credentials.html)). Isso é recomendado para o servidor MySQL rodando fora da AWS.

[AWS SDKs e Ferramentas: Fornecedor de credenciais de provedor de papel](https://docs.aws.amazon.com/sdkref/latest/guide/feature-process-credentials.html)).

[AWS SDKs e Ferramentas: Fornecedor de credenciais de assumir papel](https://docs.aws.amazon.com/sdkref/latest/guide/feature-assume-role-credentials.html)).

[AWS SDKs e Ferramentas: Fornecedor de credenciais de Centro de Identidade do IAM](https://docs.aws.amazon.com/sdkref/latest/guide/feature-sso-credentials.html)).

[AWS SDKs e Ferramentas: Papel de tarefa do Amazon ECS](https://docs.aws.amazon.com/sdkref/latest/guide/developerguide/task-iam-roles.html)). Isso é recomendado quando o servidor MySQL está em execução dentro de um contêiner do AWS ECS.

[AWS SDKs e Ferramentas: Fornecedor de credenciais IMDS](https://docs.aws.amazon.com/sdkref/latest/guide/feature-imds-credentials.html)). Isso é recomendado quando o servidor MySQL está em execução em um nó do AWS EC2.

Para usar a autenticação nativa do AWS, o `aws_authentication.mode` deve ser definido como `native` no arquivo `component_keyring_aws.cnf`, conforme mostrado aqui:

```
{
  "cmk_id": "arn:aws:kms:us-east-1:79566666666:key/d0111111-1111-1111-1111-999999999abd",
  "data_file": "/usr/local/mysql/keyring.json",
  "cache_keys": true,
  "aws_authentication":
  {
    "mode": "native"
  }
}
```

O arquivo de configuração do AWS (`config`) usa o formato INI semelhante ao empregado no arquivo `my.cnf` do MySQL Server. Você pode especificar uma seção deste arquivo para ser lida definindo `aws_authentication.profile`. Por exemplo, definir `aws_authentication.profile` para `mysql` faz com que o componente leia a seção `[mysql]` do `config`, conforme mostrado aqui:

```
{
  "cmk_id": "arn:aws:kms:us-east-1:79566666666:key/d0111111-1111-1111-1111-999999999abd",
  "data_file": "/usr/local/mysql/keyring.json",
  "cache_keys": true,
  "aws_authentication":
  {
    "mode": "native",
    "profile": "mysql"
  }
}
```

Se `aws_authentication.profile` não for especificado, o componente tenta ler a seção do arquivo `config` rotulada `[default]`.

O componente de chaveira da AWS também suporta um arquivo de credenciais da AWS para atuar como fonte de credenciais para o provedor `ProfileConfigFileAWSCredentialsProvider`, conforme descrito mais adiante na discussão sobre o modo de autenticação nativo nesta seção. A localização do arquivo é determinada da mesma maneira que a dos arquivos `component_keyring_aws.cnf` e `config`. Para substituir o padrão do arquivo de credenciais (`%USERPROFILE%\.aws\credentials` para Windows, `~/.aws/credentials para Linux ou MacOS`), defina a variável de ambiente `AWS_SHARED_CREDENTIALS_FILE` para a localização desejada.

##### Migração do plugin de chaveira da AWS

Para migrar do plugin de chaveira da AWS para o componente de chaveira da AWS, é necessário realizar as seguintes etapas:

1. Crie uma configuração equivalente para o componente:

   1. Escreva um arquivo de manifesto local ou global `mysqld.my` (consulte a Seção 8.4.5.2, “Instalação do componente de chaveira”). O conteúdo do arquivo deve corresponder ao mostrado aqui:

      ```
      {
        "components": "file://component_keyring_aws"
      }
      ```

   2. Escreva um arquivo de configuração do componente `component_keyring_aws.cnf` conforme descrito na Seção 8.4.5.4, “Uso do componente de chaveira de arquivo `component_keyring_file`” (no exemplo para `component_keyring_file`). Veja também as instruções dadas para a seção de configuração de configuração simples. Em particular, o valor do item de configuração `cmk_id` usado pelo componente deve ser definido para o usado pelo plugin; da mesma forma, o valor do item `aws_region` deve ser definido para o valor de `keyring_aws_region`. Por exemplo:

      ```
      {
        "cmk_id": "arn:aws:kms:us-east-1:79566666666:key/d0111111-1111-1111-1111-999999999abd",
        "data_file": "/usr/local/mysql/keyring.json",
        "cache_keys": true,
        "aws_authentication":
        {
           "mode":"simple",
           "region": "us-east-1",
           "access_key_id": "wwwwwwwwwwwwwEXAMPLE",
           "access_key_secret": "xxxxxxxxxxxxx/yyyyyyy/zzzzzzzzEXAMPLEKEY"
         }
      }
      ```

      Os valores do ID de chave de acesso e do segredo mostrados acima devem ser copiados do arquivo de configuração `keyring_aws` usado pelo plugin de chaveira da AWS (consulte a Seção 8.4.5.8, “Uso do plugin de chaveira da AWS Amazon Web Services”).

2. Realize a migração de chaves conforme descrito na Seção 8.4.5.14, “Migrar Chaves entre Keystores do Carteiro de Chaves”.

3. Desinstale o plugin.