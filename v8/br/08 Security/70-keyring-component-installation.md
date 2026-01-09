#### 8.4.4.2 Instalação do Componente do Chaveiro

Os consumidores do serviço de chaveiro exigem que um componente ou plugin do chaveiro seja instalado:

* Para usar um componente do chaveiro, comece com as instruções aqui.
* Para usar um plugin do chaveiro, comece com a Seção 8.4.4.3, “Instalação do Plugin do Chaveiro”.
* Se você pretende usar as funções do chaveiro em conjunto com o componente ou plugin do chaveiro escolhido, instale as funções após instalar esse componente ou plugin, usando as instruções na Seção 8.4.4.12, “Funções de Gerenciamento de Chaves do Chaveiro de Uso Geral”.

::: info Nota

Apenas um componente ou plugin do chaveiro deve ser habilitado de cada vez. Habilitar vários componentes ou plugins do chaveiro não é suportado e os resultados podem não ser os esperados.

:::

O MySQL fornece essas opções de componentes do chaveiro:

* `component_keyring_file`: Armazena os dados do chaveiro em um arquivo local ao host do servidor. Disponível nas distribuições MySQL Community Edition e MySQL Enterprise Edition.
* `component_keyring_encrypted_file`: Armazena os dados do chaveiro em um arquivo criptografado e protegido por senha local ao host do servidor. Disponível nas distribuições MySQL Enterprise Edition.
* `component_keyring_oci`: Armazena os dados do chaveiro no Vault da Oracle Cloud Infrastructure. Disponível nas distribuições MySQL Enterprise Edition.

Para ser utilizável pelo servidor, o arquivo da biblioteca do componente deve estar localizado no diretório do plugin do MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` na inicialização do servidor.

Um componente ou plugin do chaveiro deve ser carregado no início da sequência de inicialização do servidor para que outros componentes possam acessá-lo conforme necessário durante sua própria inicialização. Por exemplo, o motor de armazenamento `InnoDB` usa o chaveiro para criptografia de espaço de tabela, então um componente ou plugin do chaveiro deve ser carregado e disponível antes da inicialização do `InnoDB`.

::: info Nota

Um componente de chave de segurança deve estar habilitado na instância do servidor MySQL se você precisar suportar o armazenamento seguro para valores persistentes de variáveis do sistema. O plugin de chave de segurança não suporta essa função. Veja Persistência de Variáveis de Sistema Sensíveis.

:::

Diferentemente dos plugins de chave de segurança, os componentes de chave de segurança não são carregados usando a opção de servidor `--early-plugin-load` ou configurados usando variáveis de sistema. Em vez disso, o servidor determina qual componente de chave de segurança carregar durante o inicialização usando um manifesto, e o componente carregado consulta seu próprio arquivo de configuração ao se inicializar. Portanto, para instalar um componente de chave de segurança, você deve:

1. Escrever um manifesto que indique ao servidor qual componente de chave de segurança carregar.
2. Escrever um arquivo de configuração para esse componente de chave de segurança.

O primeiro passo para instalar um componente de chave de segurança é escrever um manifesto que indique qual componente carregar. Durante o inicialização, o servidor lê um arquivo de manifesto global ou um arquivo de manifesto global emparelhado com um arquivo de manifesto local:

* O servidor tenta ler seu arquivo de manifesto global do diretório onde o servidor está instalado.
* Se o arquivo de manifesto global indicar o uso de um arquivo de manifesto local, o servidor tenta ler seu arquivo de manifesto local do diretório de dados.
* Embora os arquivos de manifesto global e local estejam localizados em diretórios diferentes, o nome do arquivo é `mysqld.my` em ambos os locais.
* Não é um erro que um arquivo de manifesto não exista. Nesse caso, o servidor não tenta carregar nenhum componente associado ao arquivo.

Arquivos de manifesto locais permitem configurar o carregamento de componentes para múltiplas instâncias do servidor, de modo que as instruções de carregamento para cada instância do servidor são específicas para uma determinada instância do diretório de dados. Isso permite que diferentes instâncias do MySQL usem componentes de chave de segurança diferentes.

Arquivos de manifesto do servidor têm essas propriedades:

* Um arquivo de manifesto deve estar no formato JSON válido.
* Um arquivo de manifesto permite esses itens:

+ `"read_local_manifest"`: Este item é permitido apenas no arquivo de manifesto global. Se o item não estiver presente, o servidor usa apenas o arquivo de manifesto global. Se o item estiver presente, seu valor é `true` ou `false`, indicando se o servidor deve ler informações de carregamento de componentes do arquivo de manifesto local.

Se o item `"read_local_manifest"` estiver presente no arquivo de manifesto global junto com outros itens, o servidor verifica o valor do item `"read_local_manifest"` primeiro:

- Se o valor for `false`, o servidor processa os outros itens no arquivo de manifesto global e ignora o arquivo de manifesto local.
- Se o valor for `true`, o servidor ignora os outros itens no arquivo de manifesto global e tenta ler o arquivo de manifesto local.
+ `"components"`: Este item indica qual componente deve ser carregado. O valor do item é uma string que especifica uma URN de componente válida, como `"file://component_keyring_file"`. Uma URN de componente começa com `file://` e indica o nome base do arquivo de biblioteca localizado no diretório do plugin MySQL que implementa o componente.
* O acesso do servidor a um arquivo de manifesto deve ser apenas de leitura. Por exemplo, um arquivo de manifesto do servidor `mysqld.my` pode ser de propriedade de `root` e ser lido/escrito por `root`, mas deve ser lido apenas para a conta usada para executar o servidor MySQL. Se o arquivo de manifesto for encontrado durante a inicialização como sendo lido/escrito por aquela conta, o servidor escreve uma mensagem de aviso no log de erro sugerindo que o arquivo seja tornado apenas de leitura.
* O administrador da base de dados tem a responsabilidade de criar quaisquer arquivos de manifesto a serem usados e de garantir que seu modo de acesso e conteúdo sejam corretos. Se ocorrer um erro, a inicialização do servidor falha e o administrador deve corrigir quaisquer problemas indicados pelos diagnósticos no log de erro do servidor.

Dadas as propriedades do arquivo de manifesto anterior, para configurar o servidor para carregar o `component_keyring_file`, crie um arquivo de manifesto global chamado `mysqld.my` no diretório de instalação do `mysqld` e, opcionalmente, crie um arquivo de manifesto local, também chamado `mysqld.my`, no diretório de dados. As instruções a seguir descrevem como carregar o `component_keyring_file`. Para carregar um componente de cartela de chaves diferente, substitua seu nome por `component_keyring_file`.

* Para usar apenas um arquivo de manifesto global, o conteúdo do arquivo é o seguinte:

  ```
  {
    "components": "file://component_keyring_file"
  }
  ```

  Crie este arquivo no diretório onde o `mysqld` está instalado.
* Alternativamente, para usar um par de arquivos de manifesto global e local, o arquivo global é o seguinte:

  ```
  {
    "read_local_manifest": true
  }
  ```

  Crie este arquivo no diretório onde o `mysqld` está instalado.

  O arquivo local é o seguinte:

  ```
  {
    "components": "file://component_keyring_file"
  }
  ```

  Crie este arquivo no diretório de dados.

Com o manifesto em vigor, proceda a configurar o componente de cartela de chaves. Para fazer isso, consulte as notas do componente escolhido para obter instruções de configuração específicas para esse componente:

* `component_keyring_file`: Seção 8.4.4.4, “Usando o componente_keyring_file Componente de Cartela de Chaves Baseado em Arquivo”.
* `component_keyring_encrypted_file`: Seção 8.4.4.5, “Usando o componente_keyring_encrypted_file Componente de Cartela de Chaves Encriptado Baseado em Arquivo”.
* `component_keyring_oci`: Seção 8.4.4.9, “Usando o Componente de Cartela de Chaves Oracle Cloud Infrastructure Vault”.

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

Se o componente não puder ser carregado, o inicialização do servidor falhará. Verifique o log de erro do servidor para mensagens de diagnóstico. Se o componente for carregado, mas não conseguir inicializar devido a problemas de configuração, o servidor será iniciado, mas o valor `Component_status` será `Disabled`. Verifique o log de erro do servidor, corrija os problemas de configuração e use a instrução `ALTER INSTANCE RELOAD KEYRING` para recarregar a configuração.

Os componentes do Keychain devem ser carregados apenas usando um arquivo de manifesto, não usando a instrução `INSTALL COMPONENT`. Componentes do Keychain carregados usando essa instrução podem estar disponíveis muito tarde na sequência de inicialização do servidor para certos componentes que usam o keychain, como o `InnoDB`, porque eles são registrados na tabela `mysql.component` do sistema e carregados automaticamente para reinicializações subsequentes do servidor. Mas `mysql.component` é uma tabela `InnoDB`, então quaisquer componentes nomeados nela podem ser carregados durante a inicialização apenas após a inicialização do `InnoDB`.

Se nenhum componente ou plugin do Keychain estiver disponível quando um componente tenta acessar o serviço do keychain, o serviço não poderá ser usado por esse componente. Como resultado, o componente pode não conseguir inicializar ou pode inicializar com funcionalidade limitada. Por exemplo, se o `InnoDB` encontrar que existem espaços de tabelas criptografados quando ele inicializa, ele tentará acessar o keychain. Se o keychain estiver indisponível, o `InnoDB` pode acessar apenas espaços de tabelas não criptografados.