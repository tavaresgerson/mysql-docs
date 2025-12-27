#### 7.4.2.1 Configuração do Log de Erros

No MySQL 8.4, o registro de erros utiliza a arquitetura de componentes do MySQL descrita na Seção 7.5, “Componentes do MySQL”. O subsistema de log de erros consiste em componentes que realizam a filtragem e a escrita de eventos de log, além de uma variável de sistema que configura quais componentes carregar e habilitar para obter o resultado de log desejado.

Esta seção discute como carregar e habilitar componentes para o registro de erros. Para instruções específicas sobre filtros de log, consulte a Seção 7.4.2.4, “Tipos de Filtragem de Log de Erros”. Para instruções específicas sobre os sinks (escritores) de log JSON e de log do sistema, consulte a Seção 7.4.2.7, “Registro de Erros no Formato JSON”, e a Seção 7.4.2.8, “Registro de Erros no Log do Sistema”. Para detalhes adicionais sobre todos os componentes de log disponíveis, consulte a Seção 7.5.3, “Componentes do Log de Erros”.

O registro de erros baseado em componentes oferece essas funcionalidades:

* Eventos de log que podem ser filtrados por componentes de filtro para afetar as informações disponíveis para escrita.
* Eventos de log que são emitidos por componentes de sink (escritor). Múltiplos sinks (escritores) podem ser habilitados para escrever a saída do log de erros em múltiplos destinos.
* Componentes de filtro e sink embutidos que implementam o formato padrão do log de erros.
* Um sink (escritor) carregável que habilita o registro no formato JSON.
* Um sink (escritor) carregável que habilita o registro no log do sistema.
* Variáveis de sistema que controlam quais componentes de log carregar e habilitar e como cada componente opera.

A configuração do log de erros é descrita sob os seguintes tópicos nesta seção:

* A Configuração Padrão do Log de Erros
* Métodos de Configuração do Log de Erros
* Configuração Implícita do Log de Erros
* Configuração Explícita do Log de Erros
* Alterar o Método de Configuração do Log de Erros
* Solução de Problemas de Configuração
* Configuração de Múltiplos Sinks (Escritores)
* Suporte ao Esquema de Desempenho do Sink (Escritor)

A variável de sistema `log_error_services` controla quais componentes de log carregáveis devem ser carregados e quais componentes de log devem ser habilitados para registro de erros. Por padrão, `log_error_services` tem o valor mostrado aqui:

```
mysql> SELECT @@GLOBAL.log_error_services;
+----------------------------------------+
| @@GLOBAL.log_error_services            |
+----------------------------------------+
| log_filter_internal; log_sink_internal |
+----------------------------------------+
```

Esse valor indica que os eventos de log passam primeiro pelo componente de filtro `log_filter_internal`, depois pelo componente de destino `log_sink_internal`, ambos componentes internos. Um filtro modifica os eventos de log vistos pelos componentes listados posteriormente no valor de `log_error_services`. Um destino é um local para eventos de log. Tipicamente, um destino processa eventos de log em mensagens de log com um formato específico e escreve essas mensagens para sua saída associada, como um arquivo ou o log do sistema.

A combinação de `log_filter_internal` e `log_sink_internal` implementa o comportamento padrão de filtragem e saída do log de erro. A ação desses componentes é afetada por outras opções do servidor e variáveis de sistema:

* O destino da saída é determinado pela opção `--log-error` (e, no Windows, `--pid-file` e `--console`). Essas determinam se os erros devem ser escritos na console ou em um arquivo e, se em um arquivo, o nome do arquivo de log de erro. Veja a Seção 7.4.2.2, “Configuração de Destino Padrão do Log de Erro”.
* As variáveis de sistema `log_error_verbosity` e `log_error_suppression_list` afetam quais tipos de eventos de log `log_filter_internal` permite ou suprime. Veja a Seção 7.4.2.5, “Filtragem Prioritária do Log de Erro (log\_filter\_internal”)”).

Ao configurar `log_error_services`, esteja ciente das seguintes características:

* Uma lista de componentes de log pode ser delimitada por vírgulas ou pontos e vírgulas, opcionalmente seguidas por espaços. Um determinado ajuste não pode usar tanto o separador ponto e vírgula quanto o ponto e vírgula. A ordem dos componentes é significativa porque o servidor executa os componentes na ordem listada.
* O componente final no valor de `log_error_services` não pode ser um filtro. Isso é um erro porque quaisquer alterações que ele faça nos eventos não teriam efeito na saída:

```
  mysql> SET GLOBAL log_error_services = 'log_filter_internal';
  ERROR 1231 (42000): Variable 'log_error_services' can't be set to the value
  of 'log_filter_internal'
  ```

Para corrigir o problema, inclua um sink no final do valor:

```
  mysql> SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal';
  ```
* A ordem dos componentes nomeados em `log_error_services` é significativa, especialmente em relação à ordem relativa dos filtros e sinks. Considere este valor de `log_error_services`:

```
  log_filter_internal; log_sink_1; log_sink_2
  ```

Neste caso, os eventos de log passam para o filtro embutido, depois para o primeiro sink, depois para o segundo sink. Ambos os sinks recebem os eventos de log filtrados.

Compare isso com este valor de `log_error_services`:

```
  log_sink_1; log_filter_internal; log_sink_2
  ```

Neste caso, os eventos de log passam para o primeiro sink, depois para o filtro embutido, depois para o segundo sink. O primeiro sink recebe eventos não filtrados. O segundo sink recebe eventos filtrados. Você pode configurar o registro de erros dessa maneira se quiser um log que contenha mensagens para todos os eventos de log e outro log que contenha mensagens apenas para um subconjunto de eventos de log.

##### Métodos de Configuração do Log de Erros

A configuração do log de erros envolve carregar e habilitar componentes de log de erros conforme necessário e realizar a configuração específica do componente.

Existem dois métodos de configuração do log de erros, *implicito* e *explícito*. Recomenda-se que um método de configuração seja selecionado e usado exclusivamente. O uso de ambos os métodos pode resultar em avisos no momento do inicialização. Para mais informações, consulte Problemas de Configuração de Solução de Problemas.

* *Configuração Implícita do Log de Erros*

Este método de configuração carrega e habilita os componentes de log definidos pela variável `log_error_services`. Componentes carregáveis que ainda não estão carregados são carregados implicitamente no momento do inicialização antes que o motor de armazenamento `InnoDB` esteja totalmente disponível. Este método de configuração tem as seguintes vantagens:

Componentes de log são carregados no início da sequência de inicialização, antes do motor de armazenamento `InnoDB`, tornando as informações registradas disponíveis mais cedo.
  + Evita a perda de informações de log armazenadas em buffer caso ocorra uma falha durante a inicialização.
  + Não é necessário instalar componentes de log de erro usando `INSTALL COMPONENT`, simplificando a configuração do log de erro.

  Para usar esse método, consulte Configuração Implícita de Log de Erro.

* *Configuração Explicita de Log de Erro*

  ::: info Nota

  Este método de configuração é suportado para compatibilidade reversa. O método de configuração implícita é recomendado.

  :::

  Este método de configuração requer o carregamento de componentes de log de erro usando `INSTALL COMPONENT` e, em seguida, a configuração de `log_error_services` para habilitar os componentes de log. `INSTALL COMPONENT` adiciona o componente à tabela `mysql.component` (uma tabela `InnoDB`) e os componentes a serem carregados durante a inicialização são lidos dessa tabela, que só é acessível após o `InnoDB` ser inicializado.

  As informações registradas são armazenadas em buffer durante a sequência de inicialização enquanto o motor de armazenamento `InnoDB` é inicializado, o que às vezes é prolongado por operações como recuperação e atualização do dicionário de dados que ocorrem durante a sequência de inicialização do `InnoDB`.

  Para usar esse método, consulte Configuração Explicita de Log de Erro.

##### Configuração Implícita de Log de Erro

Este procedimento descreve como carregar e habilitar componentes de log de erro implicitamente usando `log_error_services`. Para uma discussão sobre os métodos de configuração de log de erro, consulte Métodos de Configuração de Log de Erro.

Para carregar e habilitar componentes de log de erro implicitamente:

1. Liste os componentes de log de erro na valor `log_error_services`.

   Para carregar e habilitar os componentes de log de erro durante a inicialização do servidor, defina `log_error_services` em um arquivo de opção. O seguinte exemplo configura o uso do canal de log JSON (`log_sink_json`) além do filtro e canal de log interno embutido (`log_filter_internal`, `log_sink_internal`).

   ```
   [mysqld]
   log_error_services='log_filter_internal; log_sink_internal; log_sink_json'
   ```

   ::: info Nota

Para usar o canal de registro JSON (`log_sink_syseventlog`) em vez do canal padrão (`log_sink_internal`), você deve substituir `log_sink_internal` por `log_sink_json`.

:::

   Para carregar e habilitar o componente imediatamente e em reinicializações subsequentes, defina `log_error_services` usando `SET PERSIST`:

   ```
   SET PERSIST log_error_services = 'log_filter_internal; log_sink_internal; log_sink_json';
   ```
2. Se o componente de log de erro expor quaisquer variáveis de sistema que precisem ser definidas para que a inicialização do componente seja bem-sucedida, atribua esses valores apropriados às variáveis. Você pode definir essas variáveis em um arquivo de opção ou usando `SET PERSIST`.

   Importante

   Ao implementar uma configuração implícita, defina `log_error_services` primeiro para carregar um componente e expor suas variáveis de sistema, e depois defina as variáveis de sistema do componente posteriormente. Essa ordem de configuração é necessária, independentemente de a atribuição de variáveis ser realizada na linha de comando, em um arquivo de opção ou usando `SET PERSIST`.

Para desabilitar um componente de registro, remova-o do valor `log_error_services`. Também remova quaisquer configurações de variáveis de componente associadas que você definiu.

::: info Nota

Carregar um componente de registro implicitamente usando `log_error_services` não tem efeito na tabela `mysql.component`. Não adiciona o componente à tabela `mysql.component`, nem remove um componente previamente instalado usando `INSTALL COMPONENT` da tabela `mysql.component`.

:::

##### Configuração Explicita de Log de Erro

Este procedimento descreve como carregar e habilitar componentes de registro de erro explicitamente, carregando componentes usando `INSTALL COMPONENT` e, em seguida, habilitando usando `log_error_services`. Para uma discussão sobre os métodos de configuração de log de erro, consulte Métodos de Configuração de Log de Erro.

Para carregar e habilitar componentes de registro de erro explicitamente:

1. Carregue o componente usando `INSTALL COMPONENT` (a menos que ele seja embutido ou já carregado). Por exemplo, para carregar o canal de registro JSON, execute a seguinte declaração:

   ```
   INSTALL COMPONENT 'file://component_log_sink_json';
   ```

Carregar um componente usando `INSTALE COMPONENTE` o registra na tabela `mysql.component` do sistema, para que o servidor o carregue automaticamente para as próximas inicializações, após o `InnoDB` ser inicializado.

A URN a ser usada ao carregar um componente de log usando `INSTALE COMPONENTE` é o nome do componente precedido por `file://component_`. Por exemplo, para o componente `log_sink_json`, a URN correspondente é `file://component_log_sink_json`. Para URNs de componentes de log de erro, consulte a Seção 7.5.3, “Componentes de Log de Erro”.

2. Se o componente de log de erro expor quaisquer variáveis de sistema que devem ser definidas para que a inicialização do componente seja bem-sucedida, atribua esses valores apropriados às variáveis. Você pode definir essas variáveis em um arquivo de opção ou usando `SET PERSIST`.

3. Ative o componente listando-o no valor `log_error_services`.

   Importante

   Ao carregar componentes de log explicitamente usando `INSTALE COMPONENTE`, não defina ou persista `log_error_services` em um arquivo de opção, que carrega componentes de log implicitamente na inicialização. Em vez disso, ative os componentes de log em tempo de execução usando uma declaração `SET GLOBAL`.

   O seguinte exemplo configura o uso do sink de log JSON (`log_sink_json`) além do filtro e sink de log embutido (`log_filter_internal`, `log_sink_internal`).

   ```
   SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal; log_sink_json';
   ```

   ::: info Nota

   Para usar o sink de log JSON (`log_sink_syseventlog`) em vez do sink padrão (`log_sink_internal`), você substituiria `log_sink_internal` por `log_sink_json`.

   :::

Se você já carregou componentes do log de erros explicitamente usando `INSTALL COMPONENT` e deseja mudar para uma configuração implícita, conforme descrito na Configuração Implícita do Log de Erros, os seguintes passos são recomendados:

1. Defina `log_error_services` de volta à sua configuração padrão.

   ```
   SET GLOBAL log_error_services = 'log_filter_internal,log_sink_internal';
   ```
2. Use `UNINSTALL COMPONENT` para desinstalar quaisquer componentes de registro carregáveis que você instalou anteriormente. Por exemplo, se você instalou o canal de log JSON anteriormente, desinstale-o conforme mostrado:

   ```
   UNINSTALL COMPONENT 'file://component_log_sink_json';
   ```
3. Remova quaisquer configurações de variáveis de componente para o componente desinstalado. Por exemplo, se as variáveis do componente foram definidas em um arquivo de opção, remova as configurações do arquivo de opção. Se as variáveis do componente foram definidas usando `SET PERSIST`, use `RESET PERSIST` para limpar as configurações.
4. Siga os passos na Configuração Implícita do Log de Erros para reimplementar sua configuração.

Se você precisar reverter de uma configuração implícita para uma explícita, realize os seguintes passos:

1. Defina `log_error_services` de volta à sua configuração padrão para descarregar componentes de log carregados implicitamente.

   ```
   SET GLOBAL log_error_services = 'log_filter_internal,log_sink_internal';
   ```
2. Remova quaisquer configurações de variáveis de componente associadas aos componentes desinstalados. Por exemplo, se as variáveis do componente foram definidas em um arquivo de opção, remova as configurações do arquivo de opção. Se as variáveis do componente foram definidas usando `SET PERSIST`, use `RESET PERSIST` para limpar as configurações.
3. Reinicie o servidor para desinstalar os componentes de log carregados implicitamente.
4. Siga os passos na Configuração Explicita do Log de Erros para reimplementar sua configuração.

##### Solução de Problemas de Configuração

Os componentes de log listados no valor `log_error_services` durante o início do MySQL Server são carregados implicitamente no início da sequência de inicialização do servidor. Se o componente de log foi carregado anteriormente usando `INSTALL COMPONENT`, o servidor tenta carregar o componente novamente mais tarde na sequência de inicialização, o que produz o aviso "Não é possível carregar o componente a partir da URN especificada: 'file://component_`component_name'".

Você pode verificar esse aviso no log de erro ou consultando a tabela `error_log` do Schema de Desempenho usando a seguinte consulta:

```
SELECT error_code, data
  FROM performance_schema.error_log
 WHERE data LIKE "%'file://component_%"
   AND error_code="MY-013129" AND data LIKE "%MY-003529%";
```

Para evitar esse aviso, siga as instruções na seção "Mudando o método de configuração do log de erro" para ajustar a configuração do seu log de erro. Deve-se usar uma configuração de log de erro explícita ou implícita, mas não ambas.

Um erro semelhante ocorre ao tentar carregar explicitamente um componente que foi carregado implicitamente durante o início. Por exemplo, se `log_error_services` lista o componente de canal de log JSON, esse componente é carregado implicitamente durante o início. Tentar carregar explicitamente o mesmo componente mais tarde retorna esse erro:

```
mysql> INSTALL COMPONENT 'file://component_log_sink_json';
ERROR 3529 (HY000): Cannot load component from specified URN: 'file://component_log_sink_json'.
```

##### Configuração de Vários Canais de Log

É possível configurar vários canais de log, o que permite enviar a saída para vários destinos. Para habilitar o canal de log JSON além (em vez de em vez de) o canal padrão, defina o valor `log_error_services` da seguinte forma:

```
SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal; log_sink_json';
```

Para reverter para o uso apenas do canal padrão e descarregar o canal de log do sistema, execute as seguintes instruções:

```
SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal;
UNINSTALL COMPONENT 'file://component_log_sink_json';
```

##### Suporte do Schema de Desempenho do Canal de Log

Se os componentes habilitados incluem um canal que fornece suporte ao Schema de Desempenho, os eventos escritos no log de erro também são escritos na tabela `error_log` do Schema de Desempenho. Isso permite examinar o conteúdo do log de erro usando consultas SQL. Atualmente, os canais de formato tradicional `log_sink_internal` e de formato JSON `log_sink_json` suportam essa capacidade. Veja a Seção 29.12.22.2, “A Tabela `error_log'”.