#### 8.4.5.3 Instalação do Plugin do Keyring

Os consumidores do serviço de keyring exigem que um componente ou plugin do keyring seja instalado:

* Para usar um plugin do keyring, comece com as instruções aqui. (Além disso, para informações gerais sobre a instalação de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.)

* Para usar um componente do keyring em vez disso, comece com a Seção 8.4.5.2, “Instalação do Componente do Keyring”.

* Se você pretende usar as funções do keyring em conjunto com o componente ou plugin do keyring escolhido, instale as funções após instalar esse componente ou plugin, usando as instruções na Seção 8.4.5.15, “Funções de Gerenciamento de Chaves do Keyring de Uso Geral”.

Observação

Apenas um componente ou plugin do keyring deve ser habilitado de cada vez. Habilitar vários componentes ou plugins do keyring não é suportado e os resultados podem não ser os esperados.

Um componente do keyring deve ser habilitado na instância do Servidor MySQL se você precisar suportar o armazenamento seguro para valores de variáveis de sistema persistentes, em vez de um plugin do keyring, que não suportam a função. Veja Persistência de Variáveis de Sistema Sensíveis.

O MySQL fornece essas opções de plugin do keyring:

* `keyring_okv`: Um plugin KMIP 1.1 para uso com produtos de armazenamento de keyring de back-end compatíveis com KMIP, como o Oracle Key Vault e o Gemalto SafeNet KeySecure Appliance. Disponível nas distribuições da Edição Empresarial do MySQL.

* `keyring_aws`: Comunica-se com o Serviço de Gerenciamento de Chaves do Amazon Web Services como back-end para geração de chaves e usa um arquivo local para armazenamento de chaves. Disponível nas distribuições da Edição Empresarial do MySQL.

* `keyring_hashicorp`: Comunica-se com o Vault da HashiCorp para armazenamento de back-end. Disponível nas distribuições da Edição Empresarial do MySQL.

Para ser utilizado pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` durante o início do servidor.

O componente ou o plugin keyring deve ser carregado no início da sequência de inicialização do servidor, para que outros componentes possam acessá-lo conforme necessário durante sua própria inicialização. Por exemplo, o mecanismo de armazenamento `InnoDB` usa o keyring para criptografia de espaço de tabelas, então um componente ou um plugin keyring deve ser carregado e disponível antes da inicialização do `InnoDB`.

A instalação de cada plugin keyring é semelhante. As instruções a seguir descrevem como instalar o `keyring_okv`. Para usar um plugin keyring diferente, substitua seu nome por `keyring_okv`.

O nome base do arquivo da biblioteca do plugin `keyring_okv` é `keyring_okv`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e similares, `.dll` para Windows).

Para carregar o plugin, use a opção `--early-plugin-load` para nomear o arquivo da biblioteca do plugin que o contém. Por exemplo, em plataformas onde o sufixo do arquivo da biblioteca do plugin é `.so`, use essas linhas no arquivo `my.cnf` do servidor, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
[mysqld]
early-plugin-load=keyring_okv.so
```

Observação

`--early-plugin-load` está desatualizado e produz uma mensagem de aviso quando é usado. Veja a descrição desta opção para obter mais informações.

Antes de iniciar o servidor, verifique as notas do seu plugin keyring escolhido para obter instruções de configuração específicas para esse plugin:

* `keyring_okv`: Seção 8.4.5.6, “Usando o plugin keyring\_okv KMIP”.
* `keyring_aws`: Seção 8.4.5.8, “Usando o plugin keyring\_aws Amazon Web Services Keyring”

* `keyring_hashicorp`: Seção 8.4.5.10, “Usando o Plugin de Cadê-Chefe da HashiCorp Vault”

Após realizar qualquer configuração específica do plugin, inicie o servidor. Verifique a instalação do plugin examinando a tabela do Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (veja a Seção 7.6.2, “Obtendo Informações de Plugins do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'keyring%';
+--------------+---------------+
| PLUGIN_NAME  | PLUGIN_STATUS |
+--------------+---------------+
| keyring_okv  | ACTIVE        |
+--------------+---------------+
```

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

Os plugins podem ser carregados por métodos diferentes de `--early-plugin-load`, como a opção `--plugin-load` ou `--plugin-load-add` ou a declaração `INSTALL PLUGIN`. No entanto, os plugins de cadê-chefe carregados usando esses métodos podem estar disponíveis muito tarde na sequência de inicialização do servidor para certos componentes que usam o cadê-chefe, como o `InnoDB`:

* O carregamento do plugin usando `--plugin-load` ou `--plugin-load-add` ocorre após a inicialização do `InnoDB`.
* Os plugins instalados usando `INSTALL PLUGIN` são registrados na tabela do sistema `mysql.plugin` e carregados automaticamente para reinicializações subsequentes do servidor. No entanto, como `mysql.plugin` é uma tabela `InnoDB`, quaisquer plugins mencionados nela podem ser carregados durante a inicialização apenas após a inicialização do `InnoDB`.

Se nenhum componente ou plugin de cadê-chefe estiver disponível quando um componente tenta acessar o serviço de cadê-chefe, o serviço não poderá ser usado por esse componente. Como resultado, o componente pode não conseguir se inicializar ou pode inicializar com funcionalidade limitada. Por exemplo, se o `InnoDB` encontrar que existem espaços de tabelas criptografados durante a inicialização, ele tentará acessar o cadê-chefe. Se o cadê-chefe estiver indisponível, o `InnoDB` pode acessar apenas espaços de tabelas não criptografados. Para garantir que o `InnoDB` possa acessar espaços de tabelas criptografados também, use `--early-plugin-load` para carregar o plugin de cadê-chefe.

Nota

`--early-plugin-load` está desatualizado e gera uma mensagem de aviso quando usado. Consulte a descrição desta opção para obter mais informações.