#### 8.4.4.2 Instalação do componente do cartela de identificação

Os consumidores do serviço de chaveiros exigem que um componente ou plugin do chaveiro seja instalado:

- Para usar um componente de chaveiro, comece pelas instruções aqui.

- Para usar um plugin de chave de segurança, comece com a Seção 8.4.4.3, “Instalação do Plugin de Chave de Segurança”.

- Se você pretende usar as funções do bloco de chaves em conjunto com o componente ou plugin de bloco de chaves escolhido, instale as funções após instalar esse componente ou plugin, seguindo as instruções na Seção 8.4.4.15, “Funções de Gerenciamento de Chaves do Bloco de Chaves de Uso Geral”.

Nota

Apenas um componente ou plugin do chaveiro deve ser ativado de cada vez. A ativação de vários componentes ou plugins do chaveiro não é suportada e os resultados podem não ser os esperados.

O MySQL oferece essas opções de componentes de chave:

- `component_keyring_file`: Armazena os dados do chaveiro em um arquivo local ao host do servidor. Disponível nas distribuições MySQL Community Edition e MySQL Enterprise Edition.

- `component_keyring_encrypted_file`: Armazena os dados do chaveiro em um arquivo criptografado e protegido por senha, localizado no host do servidor. Disponível nas distribuições da Edição Empresarial do MySQL.

- `component_keyring_oci`: Armazena dados do chaveiro no Vault da Oracle Cloud Infrastructure. Disponível nas distribuições da Edição Empresarial do MySQL.

Para que o componente seja utilizado pelo servidor, o arquivo da biblioteca de componentes deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin configurando o valor de `plugin_dir` durante o início do servidor.

Um componente ou plugin de chave de acesso deve ser carregado no início da sequência de inicialização do servidor, para que outros componentes possam acessá-lo conforme necessário durante sua própria inicialização. Por exemplo, o mecanismo de armazenamento `InnoDB` usa a chave de acesso para a criptografia do espaço de tabelas, portanto, um componente ou plugin de chave de acesso deve ser carregado e disponível antes da inicialização do `InnoDB`.

Nota

Um componente de chave de segurança deve estar habilitado na instância do servidor MySQL se você precisar suportar o armazenamento seguro para valores de variáveis de sistema persistentes. O plugin de chave de segurança não suporta essa função. Veja Persistência de Variáveis de Sistema Sensíveis.

Ao contrário dos plugins de chave de segurança, os componentes da chave de segurança não são carregados usando a opção de servidor `--early-plugin-load` ou configurados usando variáveis do sistema. Em vez disso, o servidor determina qual componente da chave de segurança deve ser carregado durante o inicialização usando um manifesto, e o componente carregado consulta seu próprio arquivo de configuração quando se inicializa. Portanto, para instalar um componente da chave de segurança, você deve:

1. Escreva um manifesto que indique ao servidor qual componente do conjunto de chaves deve ser carregado.

2. Escreva um arquivo de configuração para esse componente do conjunto de chaves.

O primeiro passo para instalar um componente de chaveiro é escrever um manifesto que indique qual componente deve ser carregado. Durante a inicialização, o servidor lê um arquivo de manifesto global ou um arquivo de manifesto global emparelhado com um arquivo de manifesto local:

- O servidor tenta ler seu arquivo de manifesto global do diretório onde o servidor está instalado.

- Se o arquivo de manifesto global indicar o uso de um arquivo de manifesto local, o servidor tentará ler seu arquivo de manifesto local do diretório de dados.

- Embora os arquivos de manifesto globais e locais estejam localizados em diretórios diferentes, o nome do arquivo é `mysqld.my` em ambos os locais.

- Não é um erro se um arquivo manifest não existir. Nesse caso, o servidor não tenta carregar nenhum componente associado ao arquivo.

Os arquivos de manifesto locais permitem configurar o carregamento de componentes para múltiplas instâncias do servidor, de modo que as instruções de carregamento para cada instância do servidor sejam específicas para uma determinada instância do diretório de dados. Isso permite que diferentes instâncias do MySQL usem componentes de chave diferentes.

Os arquivos de manifesto do servidor têm essas propriedades:

- Um arquivo de manifesto deve estar no formato JSON válido.

- Um arquivo de manifesto permite esses itens:

  - `"read_local_manifest"`: Este item é permitido apenas no arquivo de manifesto global. Se o item não estiver presente, o servidor usa apenas o arquivo de manifesto global. Se o item estiver presente, seu valor é `true` ou `false`, indicando se o servidor deve ler informações de carregamento de componentes do arquivo de manifesto local.

    Se o item `"read_local_manifest"` estiver presente no arquivo de manifesto global, juntamente com outros itens, o servidor verifica o valor do item `"read_local_manifest"` primeiro:

    - Se o valor for `false`, o servidor processa os outros itens no arquivo de manifesto global e ignora o arquivo de manifesto local.

    - Se o valor for `true`, o servidor ignora os outros itens no arquivo de manifesto global e tenta ler o arquivo de manifesto local.

  - `"components"`: Este item indica qual componente deve ser carregado. O valor do item é uma string que especifica um URN válido do componente, como `"file://component_keyring_file"`. Um URN de componente começa com `file://` e indica o nome base do arquivo de biblioteca localizado no diretório do plugin MySQL que implementa o componente.

- O acesso do servidor a um arquivo de manifesto deve ser apenas de leitura. Por exemplo, um arquivo de manifesto de servidor `mysqld.my` pode ser de propriedade de `root` e ser lido/escrito por `root`, mas deve ser apenas de leitura para a conta usada para executar o servidor MySQL. Se o arquivo de manifesto for encontrado durante a inicialização sendo lido/escrito nessa conta, o servidor escreve uma mensagem de aviso no log de erro sugerindo que o arquivo seja tornado apenas de leitura.

- O administrador do banco de dados tem a responsabilidade de criar quaisquer arquivos de manifesto a serem usados e de garantir que seu modo de acesso e conteúdo estejam corretos. Se ocorrer um erro, o início do servidor falha e o administrador deve corrigir quaisquer problemas indicados pelos diagnósticos no log de erro do servidor.

Dadas as propriedades do arquivo de manifesto anterior, para configurar o servidor para carregar `component_keyring_file`, crie um arquivo de manifesto global chamado `mysqld.my` no diretório de instalação do **mysqld** e, opcionalmente, crie um arquivo de manifesto local, também chamado `mysqld.my`, no diretório de dados. As instruções a seguir descrevem como carregar `component_keyring_file`. Para carregar um componente de chave diferente, substitua seu nome por `component_keyring_file`.

- Para usar apenas um arquivo de manifesto global, o conteúdo do arquivo é o seguinte:

  ```
  {
    "components": "file://component_keyring_file"
  }
  ```

  Crie este arquivo no diretório onde o **mysqld** está instalado.

- Como alternativa, para usar um par de arquivos de manifesto global e local, o arquivo global tem a seguinte aparência:

  ```
  {
    "read_local_manifest": true
  }
  ```

  Crie este arquivo no diretório onde o **mysqld** está instalado.

  O arquivo local parece assim:

  ```
  {
    "components": "file://component_keyring_file"
  }
  ```

  Crie este arquivo no diretório de dados.

Com o manifesto em vigor, proceda a configurar o componente de chave de segurança. Para fazer isso, verifique as notas do componente de chave de segurança escolhido para obter instruções de configuração específicas para esse componente:

- `component_keyring_file`: Seção 8.4.4.4, “Usando o componente\_keyring\_file Component Component File-Based”.

- `component_keyring_encrypted_file`: Seção 8.4.4.5, “Usando o componente\_keyring\_encrypted\_file Component Encriptado de Carteira de Arquivo”.

- `component_keyring_oci`: Seção 8.4.4.11, “Usando o componente de cartela de chaves do Oracle Cloud Infrastructure”.

Após realizar qualquer configuração específica do componente, inicie o servidor. Verifique a instalação do componente examinando a tabela do Schema de Desempenho `keyring_component_status`:

```
mysql> SELECT * FROM performance_schema.keyring_component_status;
+---------------------+-------------------------------------------------+
| STATUS_KEY          | STATUS_VALUE                                    |
+---------------------+-------------------------------------------------+
| Component_name      | component_keyring_file                          |
| Author              | Oracle Corporation                              |
| License             | GPL                                             |
| Implementation_name | component_keyring_file                          |
| Version             | 1.0                                             |
| Component_status    | Active                                          |
| Data_file           | /usr/local/mysql/keyring/component_keyring_file |
| Read_only           | No                                              |
+---------------------+-------------------------------------------------+
```

Um valor `Component_status` de `Active` indica que o componente foi inicializado com sucesso.

Se o componente não puder ser carregado, o início do servidor falha. Verifique o log de erro do servidor para mensagens de diagnóstico. Se o componente for carregado, mas não conseguir inicializar devido a problemas de configuração, o servidor será iniciado, mas o valor `Component_status` será `Disabled`. Verifique o log de erro do servidor, corrija os problemas de configuração e use a instrução `ALTER INSTANCE RELOAD KEYRING` para recarregar a configuração.

Os componentes do cartela de chaves devem ser carregados apenas usando um arquivo de manifesto, e não usando a instrução `INSTALL COMPONENT`. Os componentes do cartela de chaves carregados usando essa instrução podem estar disponíveis muito tarde na sequência de inicialização do servidor para certos componentes que usam o cartela de chaves, como `InnoDB`, porque eles são registrados na tabela de sistema `mysql.component` e carregados automaticamente para reinicializações subsequentes do servidor. Mas `mysql.component` é uma tabela `InnoDB`, então quaisquer componentes mencionados nela podem ser carregados durante a inicialização apenas após a inicialização de `InnoDB`.

Se nenhum componente ou plugin do chaveiro estiver disponível quando um componente tenta acessar o serviço do chaveiro, o serviço não poderá ser usado por esse componente. Como resultado, o componente pode falhar ao se inicializar ou pode se inicializar com funcionalidade limitada. Por exemplo, se o `InnoDB` encontrar que existem espaços de tabela criptografados ao se inicializar, ele tentará acessar o chaveiro. Se o chaveiro estiver indisponível, o `InnoDB` poderá acessar apenas espaços de tabela não criptografados.
