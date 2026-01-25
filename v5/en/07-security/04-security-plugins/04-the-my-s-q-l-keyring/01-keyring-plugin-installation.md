#### 6.4.4.1 Instalação do Plugin Keyring

Os consumidores do serviço Keyring exigem que um plugin keyring esteja instalado. Esta seção descreve como instalar o plugin keyring de sua escolha. Além disso, para informações gerais sobre a instalação de plugins, consulte [Seção 5.5.1, “Instalando e Desinstalando Plugins”](plugin-loading.html "5.5.1 Instaling and Uninstalling Plugins").

Se você pretende usar as funções de Keyring em conjunto com o plugin keyring escolhido, instale as funções após a instalação desse plugin, usando as instruções na [Seção 6.4.4.8, “Funções de Gerenciamento de Chaves de Uso Geral do Keyring”](keyring-functions-general-purpose.html "6.4.4.8 General-Purpose Keyring Key-Management Functions").

Nota

Apenas um plugin keyring deve ser habilitado por vez. Habilitar múltiplos plugins keyring não é suportado e os resultados podem não ser os antecipados.

O MySQL fornece estas opções de plugin keyring:

* `keyring_file`: Armazena dados do Keyring em um arquivo local no host do server. Disponível nas distribuições MySQL Community Edition e MySQL Enterprise Edition.

* `keyring_encrypted_file`: Armazena dados do Keyring em um arquivo criptografado e protegido por senha, local no host do server. Disponível nas distribuições MySQL Enterprise Edition.

* `keyring_okv`: Um plugin KMIP 1.1 para uso com produtos de Keyring storage de back end compatíveis com KMIP, como Oracle Key Vault e Gemalto SafeNet KeySecure Appliance. Disponível nas distribuições MySQL Enterprise Edition.

* `keyring_aws`: Comunica-se com o Amazon Web Services Key Management Service como um back end para geração de chaves e usa um arquivo local para key storage. Disponível nas distribuições MySQL Enterprise Edition.

Para ser utilizável pelo server, o arquivo da biblioteca do plugin deve estar localizado no diretório de plugins do MySQL (o diretório nomeado pela variável de sistema [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir)). Se necessário, configure a localização do diretório de plugins definindo o valor de [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) na inicialização do server.

O plugin keyring deve ser carregado cedo durante a sequência de inicialização do server para que os componentes possam acessá-lo conforme necessário durante sua própria inicialização. Por exemplo, o `InnoDB` storage engine usa o Keyring para tablespace encryption, portanto, o plugin keyring deve ser carregado e estar disponível antes da inicialização do `InnoDB`.

A instalação para cada plugin keyring é semelhante. As instruções a seguir descrevem como instalar o `keyring_file`. Para usar um plugin keyring diferente, substitua `keyring_file` pelo nome dele.

O nome base do arquivo da biblioteca do plugin `keyring_file` é `keyring_file`. O sufixo do nome do arquivo difere por plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para carregar o plugin, use a opção [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) para nomear o arquivo da biblioteca do plugin que o contém. Por exemplo, em plataformas onde o sufixo do arquivo da biblioteca do plugin é `.so`, use estas linhas no arquivo `my.cnf` do server, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```sql
[mysqld]
early-plugin-load=keyring_file.so
```

Importante

No MySQL 5.7.11, o valor padrão de [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) é o nome do arquivo da biblioteca do plugin `keyring_file`, fazendo com que esse plugin seja carregado por padrão. No MySQL 5.7.12 e superior, o valor padrão de [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) é vazio; para carregar o plugin `keyring_file`, você deve especificar explicitamente a opção com um valor que nomeie o arquivo da biblioteca do plugin `keyring_file`.

A `InnoDB` tablespace encryption exige que o plugin keyring a ser usado seja carregado antes da inicialização do `InnoDB`, portanto, essa alteração do valor padrão de [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) introduz uma incompatibilidade para upgrades da versão 5.7.11 para 5.7.12 ou superior. Os administradores que têm tablespaces `InnoDB` criptografados devem tomar medidas explícitas para garantir o carregamento contínuo do plugin keyring: Inicie o server com uma opção [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) que nomeie o arquivo da biblioteca do plugin.

Antes de iniciar o server, verifique as notas do plugin keyring escolhido para obter instruções de configuração específicas desse plugin:

* `keyring_file`: [Seção 6.4.4.2, “Usando o Plugin Keyring Baseado em Arquivo keyring_file”](keyring-file-plugin.html "6.4.4.2 Using the keyring_file File-Based Keyring Plugin").

* `keyring_encrypted_file`: [Seção 6.4.4.3, “Usando o Plugin Keyring Baseado em Arquivo Criptografado keyring_encrypted_file”](keyring-encrypted-file-plugin.html "6.4.4.3 Using the keyring_encrypted_file Encrypted File-Based Keyring Plugin").

* `keyring_okv`: [Seção 6.4.4.4, “Usando o Plugin KMIP keyring_okv”](keyring-okv-plugin.html "6.4.4.4 Using the keyring_okv KMIP Plugin").

* `keyring_aws`: [Seção 6.4.4.5, “Usando o Plugin Keyring Amazon Web Services keyring_aws”](keyring-aws-plugin.html "6.4.4.5 Using the keyring_aws Amazon Web Services Keyring Plugin")

Após executar qualquer configuração específica do plugin, inicie o server. Verifique a instalação do plugin examinando a tabela Information Schema [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") ou use a instrução [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") (consulte [Seção 5.5.2, “Obtendo Informações sobre Plugins do Server”](obtaining-plugin-information.html "5.5.2 Obtaining Server Plugin Information")). Por exemplo:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'keyring%';
+--------------+---------------+
| PLUGIN_NAME  | PLUGIN_STATUS |
+--------------+---------------+
| keyring_file | ACTIVE        |
+--------------+---------------+
```

Se o plugin falhar ao inicializar, verifique o error log do server para mensagens de diagnóstico.

Plugins podem ser carregados por métodos que não sejam o [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load), como a opção [`--plugin-load`](server-options.html#option_mysqld_plugin-load) ou [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) ou a instrução [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement"). No entanto, plugins keyring carregados usando esses métodos podem estar disponíveis muito tarde na sequência de inicialização do server para certos componentes que usam o Keyring, como o `InnoDB`:

* O carregamento de plugins usando [`--plugin-load`](server-options.html#option_mysqld_plugin-load) ou [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) ocorre após a inicialização do `InnoDB`.

* Plugins instalados usando [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") são registrados na tabela de sistema `mysql.plugin` e carregados automaticamente para reinicializações subsequentes do server. No entanto, como `mysql.plugin` é uma tabela `InnoDB`, quaisquer plugins nela nomeados só podem ser carregados durante a inicialização após a inicialização do `InnoDB`.

Se nenhum plugin keyring estiver disponível quando um componente tentar acessar o serviço Keyring, o serviço não poderá ser usado por esse componente. Como resultado, o componente pode falhar ao inicializar ou pode inicializar com funcionalidade limitada. Por exemplo, se o `InnoDB` encontrar tablespaces criptografados ao inicializar, ele tentará acessar o Keyring. Se o Keyring não estiver disponível, o `InnoDB` só poderá acessar tablespaces não criptografados. Para garantir que o `InnoDB` possa acessar tablespaces criptografados também, use [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) para carregar o plugin keyring.