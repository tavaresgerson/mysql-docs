#### 8.4.4.3 Instalação do Plugin para Carteira de Chave

Os consumidores do serviço de chaveiros exigem que um componente ou plugin do chaveiro seja instalado:

- Para usar um plugin de chave de acesso, comece pelas instruções aqui. (Além disso, para informações gerais sobre a instalação de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.)

- Para usar um componente de chave de segurança, comece com a Seção 8.4.4.2, “Instalação do componente de chave de segurança”.

- Se você pretende usar as funções do bloco de chaves em conjunto com o componente ou plugin de bloco de chaves escolhido, instale as funções após instalar esse componente ou plugin, seguindo as instruções na Seção 8.4.4.15, “Funções de Gerenciamento de Chaves do Bloco de Chaves de Uso Geral”.

Nota

Apenas um componente ou plugin do chaveiro deve ser ativado de cada vez. A ativação de vários componentes ou plugins do chaveiro não é suportada e os resultados podem não ser os esperados.

Um componente de chave de acesso deve ser habilitado na instância do servidor MySQL se você precisar suportar o armazenamento seguro para valores de variáveis de sistema persistentes, em vez de um plugin de chave de acesso, que não suportam essa função. Veja Persistência de Variáveis de Sistema Sensíveis.

O MySQL oferece essas opções de plugins de chave:

- `keyring_file` (desatualizado a partir do MySQL 8.0.34): Armazena os dados do chaveiro em um arquivo localizado no host do servidor. Disponível nas distribuições MySQL Community Edition e MySQL Enterprise Edition. Para obter instruções sobre como instalar o componente que substitui este plugin, consulte a Seção 8.4.4.2, “Instalação do Componente do Chaveiro”.

- `keyring_encrypted_file` (desatualizado a partir do MySQL 8.0.34): Armazena os dados do bloco de chaves em um arquivo criptografado e protegido por senha, localizado no host do servidor. Disponível nas distribuições da Edição Empresarial do MySQL. Para obter instruções sobre como instalar o componente que substitui este plugin, consulte a Seção 8.4.4.2, “Instalação do Componente do Bloco de Chaves”.

- `keyring_okv`: Um plugin KMIP 1.1 para uso com produtos de armazenamento de chaveiros de back-end compatíveis com KMIP, como o Oracle Key Vault e o Gemalto SafeNet KeySecure Appliance. Disponível nas distribuições da MySQL Enterprise Edition.

- `keyring_aws`: Comunica-se com o Serviço de Gerenciamento de Chaves do Amazon Web Services como um backend para a geração de chaves e utiliza um arquivo local para armazenamento de chaves. Disponível nas distribuições da Edição Empresarial do MySQL.

- `keyring_hashicorp`: Comunica-se com o HashiCorp Vault para armazenamento no back-end. Disponível nas distribuições da Edição Empresarial do MySQL.

- `keyring_oci` (desatualizado a partir do MySQL 8.0.31): Comunica-se com o Oracle Cloud Infrastructure Vault para armazenamento de backend. Consulte a Seção 8.4.4.12, “Usando o Oracle Cloud Infrastructure Vault Keyring Plugin”.

Para que o plugin seja utilizado pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin configurando o valor de `plugin_dir` durante o início do servidor.

Um componente ou plugin de chave de acesso deve ser carregado no início da sequência de inicialização do servidor, para que outros componentes possam acessá-lo conforme necessário durante sua própria inicialização. Por exemplo, o mecanismo de armazenamento `InnoDB` usa a chave de acesso para a criptografia do espaço de tabelas, portanto, um componente ou plugin de chave de acesso deve ser carregado e disponível antes da inicialização do `InnoDB`.

A instalação de cada plugin de chaveiro é semelhante. As instruções a seguir descrevem como instalar o `keyring_file`. Para usar um plugin de chaveiro diferente, substitua seu nome pelo `keyring_file`.

O nome base do arquivo da biblioteca de plugins `keyring_file` é `keyring_file`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para carregar o plugin, use a opção `--early-plugin-load` para nomear o arquivo da biblioteca do plugin que o contém. Por exemplo, em plataformas onde o sufixo do arquivo da biblioteca do plugin é `.so`, use essas linhas no arquivo do servidor `my.cnf`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
[mysqld]
early-plugin-load=keyring_file.so
```

Antes de iniciar o servidor, verifique as notas do seu plugin de chave privada escolhido para obter instruções de configuração específicas para esse plugin:

- `keyring_file`: Seção 8.4.4.6, “Usando o plugin de cartela de chaves baseado em arquivo keyring\_file”.

- `keyring_encrypted_file`: Seção 8.4.4.7, “Usando o plugin de cartela de chaves criptografada keyring\_encrypted\_file”.

- `keyring_okv`: Seção 8.4.4.8, “Usando o plugin KMIP keyring\_okv”.

- `keyring_aws`: Seção 8.4.4.9, “Usando o plugin Amazon Web Services Keyring keyring\_aws”

- `keyring_hashicorp`: Seção 8.4.4.10, “Usando o Plugin de Carteira de Chaves HashiCorp Vault”

- `keyring_oci`: Seção 8.4.4.12, “Usando o Plugin de Carteira de Chaves do Oracle Cloud Infrastructure”

Após realizar qualquer configuração específica do plugin, inicie o servidor. Verifique a instalação do plugin examinando a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte a Seção 7.6.2, “Obtendo Informações do Plugin do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'keyring%';
+--------------+---------------+
| PLUGIN_NAME  | PLUGIN_STATUS |
+--------------+---------------+
| keyring_file | ACTIVE        |
+--------------+---------------+
```

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor para obter mensagens de diagnóstico.

Os plugins podem ser carregados por métodos diferentes do `--early-plugin-load`, como a opção `--plugin-load` ou `--plugin-load-add` ou a instrução `INSTALL PLUGIN`. No entanto, os plugins do keyring carregados usando esses métodos podem estar disponíveis muito tarde na sequência de inicialização do servidor para certos componentes que usam o keyring, como `InnoDB`:

- O carregamento do plugin usando `--plugin-load` ou `--plugin-load-add` ocorre após a inicialização de `InnoDB`.

- Os plugins instalados usando `INSTALL PLUGIN` são registrados na tabela do sistema `mysql.plugin` e carregados automaticamente para reinicializações subsequentes do servidor. No entanto, como `mysql.plugin` é uma tabela `InnoDB`, quaisquer plugins mencionados nela podem ser carregados durante a inicialização apenas após a inicialização do `InnoDB`.

Se nenhum componente ou plugin do chaveiro estiver disponível quando um componente tenta acessar o serviço de chaveiro, o serviço não poderá ser usado por esse componente. Como resultado, o componente pode falhar ao se inicializar ou pode se inicializar com funcionalidade limitada. Por exemplo, se `InnoDB` encontrar que existem espaços de tabela criptografados ao se inicializar, ele tentará acessar o chaveiro. Se o chaveiro estiver indisponível, `InnoDB` poderá acessar apenas espaços de tabela não criptografados. Para garantir que `InnoDB` possa acessar espaços de tabela criptografados também, use `--early-plugin-load` para carregar o plugin do chaveiro.
