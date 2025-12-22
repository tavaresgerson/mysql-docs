#### 7.4.2.1 Configuração do registo de erros

No MySQL 8.4, o registro de erros usa a arquitetura de componentes do MySQL descrita na Seção 7.5, Componentes do MySQL. O subsistema de registro de erros consiste em componentes que realizam a filtragem e gravação de eventos de registro, bem como uma variável do sistema que configura quais componentes devem ser carregados e ativados para alcançar o resultado de registro desejado.

Esta seção discute como carregar e habilitar componentes para registro de erros. Para instruções específicas para filtros de registro, consulte a Seção 7.4.2.4,  Tipos de filtragem de registro de erros. Para instruções específicas para o JSON e sinks de registro de sistema, consulte a Seção 7.4.2.7,  Registro de erros no formato JSON e a Seção 7.4.2.8,  Registro de erros no registro de sistema. Para detalhes adicionais sobre todos os componentes disponíveis, consulte a Seção 7.5.3,  Componentes de registro de erros.

O registro de erros baseado em componentes oferece as seguintes características:

- Eventos de registro que podem ser filtrados por componentes de filtro para afetar as informações disponíveis para gravação.
- Eventos de log que são produzidos por componentes de sink (escritor).
- Componentes de filtro e sink integrados que implementam o formato de registro de erros padrão.
- Um sink carregável que permite o registro no formato JSON.
- Um sumidouro carregável que permite o registo no registo do sistema.
- Variaveis de sistema que controlam quais componentes de registro devem ser carregados e ativados e como cada componente opera.

A configuração do registo de erros é descrita nos seguintes tópicos desta secção:

- Configuração do Registro de Erros Padrão
- Métodos de configuração do registo de erros
- Configuração do Registro de Erros Implícito
- Configuração do Registro de Erros Explicitos
- Alterar o método de configuração do registo de erros
- Solução de problemas de configuração
- Configurar vários sumidouros de log
- Suporte de esquema de desempenho de sincronização de logs

##### Configuração do Registro de Erros Padrão

A variável do sistema `log_error_services` controla quais componentes de log a serem carregados e quais componentes de log a serem ativados para registro de erros. Por padrão, `log_error_services` tem o valor mostrado aqui:

```
mysql> SELECT @@GLOBAL.log_error_services;
+----------------------------------------+
| @@GLOBAL.log_error_services            |
+----------------------------------------+
| log_filter_internal; log_sink_internal |
+----------------------------------------+
```

Esse valor indica que os eventos de log passam primeiro pelo componente de filtro `log_filter_internal` e, em seguida, pelo componente de sink `log_sink_internal`, ambos componentes embutidos. Um filtro modifica os eventos de log vistos por componentes nomeados mais tarde no valor `log_error_services`. Um sink é um destino para eventos de log. Normalmente, um sink processa eventos de log em mensagens de log que têm um formato específico e escreve essas mensagens em sua saída associada, como um arquivo ou o log do sistema.

A combinação de `log_filter_internal` e `log_sink_internal` implementa o filtro padrão de registro de erros e comportamento de saída. A ação desses componentes é afetada por outras opções de servidor e variáveis do sistema:

- O destino de saída é determinado pela opção `--log-error` (e, no Windows, `--pid-file` e `--console`). Estes determinam se as mensagens de erro devem ser escritas no console ou em um arquivo e, se em um arquivo, o nome do arquivo de registro de erro.
- As variáveis do sistema `log_error_verbosity` e `log_error_suppression_list` afetam quais tipos de eventos de log `log_filter_internal` permitem ou suprimem. Veja a Seção 7.4.2.5, "Filtro de Log de Erro Baseado em Prioridade (log\_filter\_internal) ").

Ao configurar o `log_error_services`, observe as seguintes características:

- Uma lista de componentes de log pode ser delimitada por pontos e vírgulas, opcionalmente seguido por espaços.
- O componente final no valor `log_error_services` não pode ser um filtro. Este é um erro porque qualquer alteração que tenha em eventos não teria efeito na saída:

  ```
  mysql> SET GLOBAL log_error_services = 'log_filter_internal';
  ERROR 1231 (42000): Variable 'log_error_services' can't be set to the value
  of 'log_filter_internal'
  ```

  Para corrigir o problema, inclua um sumidouro no final do valor:

  ```
  mysql> SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal';
  ```
- A ordem dos componentes nomeados em `log_error_services` é significativa, particularmente em relação à ordem relativa de filtros e sumidouros.

  ```
  log_filter_internal; log_sink_1; log_sink_2
  ```

  Neste caso, os eventos de log passam para o filtro embutido, em seguida, para o primeiro sumidouro, em seguida, para o segundo sumidouro.

  Compare isso com este valor `log_error_services`:

  ```
  log_sink_1; log_filter_internal; log_sink_2
  ```

  Neste caso, os eventos de log passam para o primeiro sink, em seguida, para o filtro embutido, em seguida, para o segundo sink. O primeiro sink recebe eventos não filtrados. O segundo sink recebe eventos filtrados. Você pode configurar o registro de erros desta forma se quiser um log que contenha mensagens para todos os eventos de log, e outro log que contenha mensagens apenas para um subconjunto de eventos de log.

##### Métodos de configuração do registo de erros

A configuração do log de erros envolve o carregamento e a ativação de componentes de log de erros conforme necessário e a realização de configurações específicas de componentes.

Existem dois métodos de configuração de registro de erros, \* implícito \* e \* explícito \*. Recomenda-se que um método de configuração seja selecionado e usado exclusivamente. O uso de ambos os métodos pode resultar em avisos na inicialização.

- - Configuração de log de erro implícito \*

  Este método de configuração carrega e habilita os componentes de log definidos pela variável `log_error_services`.

  - Os componentes de log são carregados no início da sequência de inicialização, antes do mecanismo de armazenamento `InnoDB`, tornando as informações registradas disponíveis mais cedo.
  - Ele evita a perda de informações de registro em buffer caso ocorra uma falha durante a inicialização.
  - A instalação de componentes de log de erro usando `INSTALL COMPONENT` não é necessária, simplificando a configuração de log de erro.

  Para utilizar este método, consulte Configuração do Registro de Erros Implícito.

- - Configuração de registro de erro explícito \*

  ::: info Note

  Este método de configuração é suportado para compatibilidade com versões anteriores.

  :::

  Este método de configuração requer o carregamento de componentes de log de erro usando `INSTALL COMPONENT` e, em seguida, configurando `log_error_services` para habilitar os componentes de log. `INSTALL COMPONENT` adiciona o componente à tabela `mysql.component` (uma tabela `InnoDB`), e os componentes a serem carregados na inicialização são lidos a partir desta tabela, que só é acessível após a inicialização do `InnoDB`.

  As informações registradas são armazenadas em buffer durante a sequência de inicialização, enquanto o motor de armazenamento `InnoDB` é inicializado, o que às vezes é prolongado por operações como recuperação e atualização do dicionário de dados que ocorrem durante a sequência de inicialização `InnoDB`.

  Para utilizar este método, consulte Configuração do Registro de Erros Explicitos.

##### Configuração do Registro de Erros Implícito

Este procedimento descreve como carregar e habilitar componentes de registro de erros implicitamente usando `log_error_services`.

Para carregar e habilitar componentes de registo de erros implicitamente:

1. Listar os componentes do log de erros no valor `log_error_services`.

   Para carregar e habilitar os componentes do log de erros na inicialização do servidor, defina `log_error_services` em um arquivo de opções. O exemplo a seguir configura o uso do sink de log JSON (`log_sink_json`) além do filtro e do sink de log incorporados (`log_filter_internal`, `log_sink_internal`).

   ```
   [mysqld]
   log_error_services='log_filter_internal; log_sink_internal; log_sink_json'
   ```

   ::: info Note

   Para usar o sink de registro JSON (`log_sink_syseventlog`) em vez do sink padrão (`log_sink_internal`), você substituiria `log_sink_internal` por `log_sink_json`.

   :::

   Para carregar e ativar o componente imediatamente e para reinicializações subsequentes, defina `log_error_services` usando `SET PERSIST`:

   ```
   SET PERSIST log_error_services = 'log_filter_internal; log_sink_internal; log_sink_json';
   ```
2. Se o componente de registro de erros expor quaisquer variáveis do sistema que devem ser definidas para a inicialização do componente ter sucesso, atribua a essas variáveis os valores apropriados. Você pode definir essas variáveis em um arquivo de opções ou usando `SET PERSIST`.

   Importância

   Ao implementar uma configuração implícita, defina `log_error_services` primeiro para carregar um componente e expor suas variáveis do sistema, e depois defina as variáveis do sistema do componente. Esta ordem de configuração é necessária independentemente de a atribuição de variável ser executada na linha de comando, em um arquivo de opção ou usando `SET PERSIST`.

Para desativar um componente de log, remova-o do valor `log_error_services`.

::: info Note

O carregamento de um componente de log implicitamente usando `log_error_services` não tem efeito na tabela `mysql.component`. Ele não adiciona o componente à tabela `mysql.component`, nem remove um componente instalado anteriormente usando `INSTALL COMPONENT` da tabela `mysql.component`.

:::

##### Configuração do Registro de Erros Explicitos

Este procedimento descreve como carregar e habilitar componentes de registro de erros explicitamente carregando componentes usando `INSTALL COMPONENT` e, em seguida, habilitando usando `log_error_services`.

Para carregar e habilitar os componentes de registo de erros explicitamente:

1. Carregar o componente usando `INSTALL COMPONENT` (a menos que ele esteja embutido ou já carregado). Por exemplo, para carregar o JSON log sink, emita a seguinte instrução:

   ```
   INSTALL COMPONENT 'file://component_log_sink_json';
   ```

   O carregamento de um componente usando `INSTALL COMPONENT` registra-o na tabela de sistema `mysql.component` para que o servidor o carrega automaticamente para inicializações subsequentes, depois que `InnoDB` é inicializado.

   O URN a ser usado ao carregar um componente de log com `INSTALL COMPONENT` é o nome do componente com o prefixo `file://component_`. Por exemplo, para o componente `log_sink_json`, o URN correspondente é `file://component_log_sink_json`. Para os URNs do componente de log de erro, consulte a Seção 7.5.3, Componentes de Log de Erro.
2. Se o componente de registro de erros expor quaisquer variáveis do sistema que devem ser definidas para a inicialização do componente ter sucesso, atribua a essas variáveis os valores apropriados. Você pode definir essas variáveis em um arquivo de opções ou usando `SET PERSIST`.
3. Ativar o componente listando-o no valor `log_error_services`.

   Importância

   Ao carregar componentes de log explicitamente usando `INSTALL COMPONENT`, não persista ou defina `log_error_services` em um arquivo de opção, que carrega componentes de log implicitamente na inicialização. Em vez disso, habilite componentes de log no tempo de execução usando uma instrução `SET GLOBAL`.

   O exemplo a seguir configura o uso do sink de log JSON (`log_sink_json`) além do filtro e do sink de log integrados (`log_filter_internal`, `log_sink_internal`).

   ```
   SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal; log_sink_json';
   ```

   ::: info Note

   Para usar o sink de registro JSON (`log_sink_syseventlog`) em vez do sink padrão (`log_sink_internal`), você substituiria `log_sink_internal` por `log_sink_json`.

   :::

Para desativar um componente de log, remova-o do valor `log_error_services` . Em seguida, se o componente for carregável e você também quiser descarregá-lo, use `UNINSTALL COMPONENT`. Também remova quaisquer configurações de variáveis de componente associadas que você definiu.

As tentativas de usar `UNINSTALL COMPONENT` para descarregar um componente carregável que ainda é nomeado no valor `log_error_services` produzem um erro.

##### Alterar o método de configuração do registo de erros

Se você já carregou componentes de registro de erros explicitamente usando `INSTALL COMPONENT` e deseja mudar para uma configuração implícita, conforme descrito em Configuração de registro de erros implícito, as seguintes etapas são recomendadas:

1. Defina `log_error_services` de volta à sua configuração padrão.

   ```
   SET GLOBAL log_error_services = 'log_filter_internal,log_sink_internal';
   ```
2. Use `UNINSTALL COMPONENT` para desinstalar todos os componentes de registro de carga que você instalou anteriormente. Por exemplo, se você instalou o JSON log sink anteriormente, desinstale como mostrado:

   ```
   UNINSTALL COMPONENT 'file://component_log_sink_json';
   ```
3. Remova qualquer configuração de variável do componente para o componente desinstalado. Por exemplo, se as variáveis do componente foram definidas em um arquivo de opção, remova as configurações do arquivo de opção. Se as variáveis do componente foram definidas usando `SET PERSIST`, use `RESET PERSIST` para limpar as configurações.
4. Siga os passos em Configuração de Log de Erro Implícito para reimplementar sua configuração.

Se você precisar reverter de uma configuração implícita para uma configuração explícita, execute as seguintes etapas:

1. Defina `log_error_services` de volta à sua configuração padrão para descarregar componentes de log carregados implicitamente.

   ```
   SET GLOBAL log_error_services = 'log_filter_internal,log_sink_internal';
   ```
2. Remova qualquer configuração de variável de componente associada aos componentes desinstalados. Por exemplo, se as variáveis de componente foram definidas em um arquivo de opção, remova as configurações do arquivo de opção. Se as variáveis de componente foram definidas usando `SET PERSIST`, use `RESET PERSIST` para limpar as configurações.
3. Reinicie o servidor para desinstalar os componentes de registo que foram carregados implicitamente.
4. Siga as etapas em Configuração de Log de Erro Explicito para reimplementar sua configuração.

##### Solução de problemas de configuração

Os componentes de log listados no valor `log_error_services` na inicialização são carregados implicitamente no início da sequência de inicialização do MySQL Server. Se o componente de log foi carregado anteriormente usando `INSTALL COMPONENT`, o servidor tenta carregar o componente novamente mais tarde na sequência de inicialização, o que produz o aviso Não é possível carregar o componente a partir do URN especificado: 'file://component\_`component_name`'.

Você pode verificar este aviso no registro de erros ou consultando a tabela de esquema de desempenho `error_log` usando a seguinte consulta:

```
SELECT error_code, data
  FROM performance_schema.error_log
 WHERE data LIKE "%'file://component_%"
   AND error_code="MY-013129" AND data LIKE "%MY-003529%";
```

Para evitar este aviso, siga as instruções em Alterar o método de configuração do registo de erros para ajustar a configuração do registo de erros. Deve ser usada uma configuração de registo de erros implícita ou explícita, mas não ambas.

Um erro semelhante ocorre quando se tenta carregar explicitamente um componente que foi carregado implicitamente no início. Por exemplo, se `log_error_services` lista o componente de sink de log JSON, esse componente é carregado implicitamente no início. Tentando carregar explicitamente o mesmo componente mais tarde, retornará este erro:

```
mysql> INSTALL COMPONENT 'file://component_log_sink_json';
ERROR 3529 (HY000): Cannot load component from specified URN: 'file://component_log_sink_json'.
```

##### Configurar vários sumidouros de log

É possível configurar vários sinks de log, o que permite o envio de saída para vários destinos. Para habilitar o sink de log JSON além do sink padrão (em vez de em vez dele), defina o valor `log_error_services` assim:

```
SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal; log_sink_json';
```

Para voltar a usar apenas o sink padrão e descarregar o sink do log do sistema, execute estas instruções:

```
SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal;
UNINSTALL COMPONENT 'file://component_log_sink_json';
```

##### Suporte de esquema de desempenho de sincronização de logs

Se os componentes de log habilitados incluírem um sink que forneça suporte ao Esquema de Desempenho, os eventos escritos no log de erro também serão escritos na tabela de Esquema de Desempenho `error_log`. Isso permite examinar o conteúdo do log de erro usando consultas SQL. Atualmente, os sinks de formato tradicional `log_sink_internal` e de formato JSON `log_sink_json` suportam essa capacidade.
