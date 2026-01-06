#### 6.4.4.1 Instalação do Plugin para Carteira de Chave

Os consumidores do serviço de chaveiros exigem que um plugin de chaveiro seja instalado. Esta seção descreve como instalar o plugin de chaveiro da sua escolha. Além disso, para informações gerais sobre a instalação de plugins, consulte Seção 5.5.1, “Instalando e Desinstalando Plugins”.

Se você pretende usar as funções do bloco de chaves em conjunto com o plugin de bloco de chaves escolhido, instale as funções após instalar esse plugin, seguindo as instruções na Seção 6.4.4.8, “Funções de Gerenciamento de Chaves do Bloco de Chaves de Uso Geral”.

Nota

Apenas um plugin de chave de acesso deve ser ativado de cada vez. A ativação de vários plugins de chave de acesso não é suportada e os resultados podem não ser os esperados.

O MySQL oferece essas opções de plugins de chave:

- `keyring_file`: Armazena os dados do bloco de chaves em um arquivo local ao hospedeiro do servidor. Disponível nas distribuições MySQL Community Edition e MySQL Enterprise Edition.

- `keyring_encrypted_file`: Armazena os dados do chaveiro em um arquivo criptografado e protegido por senha, localizado no host do servidor. Disponível nas distribuições da Edição Empresarial do MySQL.

- `keyring_okv`: Um plugin KMIP 1.1 para uso com produtos de armazenamento de chaveiro de back-end compatíveis com KMIP, como o Oracle Key Vault e o Gemalto SafeNet KeySecure Appliance. Disponível nas distribuições da MySQL Enterprise Edition.

- `keyring_aws`: Comunica-se com o Amazon Web Services Key Management Service como um backend para geração de chaves e utiliza um arquivo local para armazenamento de chaves. Disponível nas distribuições da Edição Empresarial do MySQL.

Para que o plugin possa ser usado pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` durante o início do servidor.

O plugin de chave de acesso deve ser carregado no início da sequência de inicialização do servidor, para que os componentes possam acessá-lo conforme necessário durante sua própria inicialização. Por exemplo, o mecanismo de armazenamento `InnoDB` usa a chave de acesso para a criptografia do espaço de tabelas, portanto, o plugin de chave de acesso deve ser carregado e disponível antes da inicialização do `InnoDB`.

A instalação de cada plugin de chave de acesso é semelhante. As instruções a seguir descrevem como instalar o `keyring_file`. Para usar um plugin de chave de acesso diferente, substitua seu nome pelo `keyring_file`.

O nome base do arquivo da biblioteca do plugin `keyring_file` é `keyring_file`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e sistemas semelhantes ao Unix, `.dll` para Windows).

Para carregar o plugin, use a opção `--early-plugin-load` para nomear o arquivo da biblioteca do plugin que o contém. Por exemplo, em plataformas onde o sufixo do arquivo da biblioteca do plugin é `.so`, use essas linhas no arquivo `my.cnf` do servidor, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```sql
[mysqld]
early-plugin-load=keyring_file.so
```

Importante

No MySQL 5.7.11, o valor padrão de `--early-plugin-load` é o nome do arquivo da biblioteca do plugin `keyring_file`, fazendo com que o plugin seja carregado por padrão. No MySQL 5.7.12 e versões superiores, o valor padrão de `--early-plugin-load` é vazio; para carregar o plugin `keyring_file`, você deve especificar explicitamente a opção com um nome de valor que nomeie o arquivo da biblioteca do plugin `keyring_file`.

A criptografia do espaço de tabelas `InnoDB` exige que o plugin de chave seja carregado antes da inicialização do `InnoDB`, portanto, essa alteração do valor padrão de `--early-plugin-load` introduz uma incompatibilidade para atualizações de 5.7.11 para 5.7.12 ou superior. Os administradores que criptografaram os espaços de tabelas `InnoDB` devem tomar medidas explícitas para garantir o carregamento contínuo do plugin de chave: Inicie o servidor com uma opção `--early-plugin-load` que nomeie o arquivo da biblioteca do plugin.

Antes de iniciar o servidor, verifique as notas do seu plugin de chave privada escolhido para obter instruções de configuração específicas para esse plugin:

- `keyring_file`: Seção 6.4.4.2, “Usando o plugin de cartela de chaves baseado em arquivo keyring\_file”.

- `keyring_encrypted_file`: Seção 6.4.4.3, “Usando o plugin de cartela de chaves com arquivo criptografado keyring\_encrypted\_file”.

- `keyring_okv`: Seção 6.4.4.4, “Usando o plugin KMIP keyring\_okv”.

- `keyring_aws`: Seção 6.4.4.5, “Usando o plugin Amazon Web Services Keyring keyring\_aws”

Após realizar qualquer configuração específica do plugin, inicie o servidor. Verifique a instalação do plugin examinando a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 5.5.2, “Obtendo Informações do Plugin do Servidor”). Por exemplo:

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

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor para obter mensagens de diagnóstico.

Os plugins podem ser carregados por métodos diferentes de `--early-plugin-load`, como as opções `--plugin-load` ou `--plugin-load-add` ou a instrução `INSTALL PLUGIN`. No entanto, os plugins do keyring carregados usando esses métodos podem estar disponíveis muito tarde na sequência de inicialização do servidor para certos componentes que usam o keyring, como o `InnoDB`:

- O carregamento do plugin usando `--plugin-load` ou `--plugin-load-add` ocorre após a inicialização do `InnoDB`.

- Os plugins instalados usando `INSTALL PLUGIN` são registrados na tabela `mysql.plugin` do sistema e carregados automaticamente para reinicializações subsequentes do servidor. No entanto, como `mysql.plugin` é uma tabela `InnoDB`, quaisquer plugins mencionados nela podem ser carregados durante a inicialização apenas após a inicialização do `InnoDB`.

Se nenhum plugin de chave de segurança estiver disponível quando um componente tenta acessar o serviço de chave de segurança, o serviço não poderá ser usado por esse componente. Como resultado, o componente pode falhar ao inicializar ou pode inicializar com funcionalidade limitada. Por exemplo, se o `InnoDB` encontrar que existem espaços de tabelas criptografados ao inicializá-lo, ele tentará acessar a chave de segurança. Se a chave de segurança estiver indisponível, o `InnoDB` pode acessar apenas espaços de tabelas não criptografados. Para garantir que o `InnoDB` possa acessar espaços de tabelas criptografados também, use `--early-plugin-load` para carregar o plugin de chave de segurança.
