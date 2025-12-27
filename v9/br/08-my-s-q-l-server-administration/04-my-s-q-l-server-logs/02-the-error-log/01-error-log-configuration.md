#### 7.4.2.1 Configuração do Log de Erros

No MySQL 9.5, o registro de erros utiliza a arquitetura de componentes do MySQL descrita na Seção 7.5, “Componentes do MySQL”. O subsistema de log de erros consiste em componentes que realizam a filtragem e a escrita de eventos de log, além de uma variável de sistema que configura quais componentes carregar e habilitar para obter o resultado de log desejado.

Esta seção discute como carregar e habilitar componentes para o registro de erros. Para instruções específicas sobre filtros de log, consulte a Seção 7.4.2.4, “Tipos de Filtragem de Log de Erros”. Para instruções específicas sobre os sinks (escritores) de log JSON e de log do sistema, consulte a Seção 7.4.2.7, “Registro de Erros no Formato JSON”, e a Seção 7.4.2.8, “Registro de Erros no Log do Sistema”. Para detalhes adicionais sobre todos os componentes de log disponíveis, consulte a Seção 7.5.3, “Componentes do Log de Erros”.

O registro de erros baseado em componentes oferece essas funcionalidades:

* Eventos de log que podem ser filtrados por componentes de filtro para afetar as informações disponíveis para escrita.

* Eventos de log que são emitidos por componentes de sink (escritor). Múltiplos componentes de sink podem ser habilitados para escrever a saída do log de erros em múltiplos destinos.

* Componentes de filtro e sink embutidos que implementam o formato padrão do log de erros.

* Um sink carregável que habilita o registro no formato JSON.

* Um sink carregável que habilita o registro no log do sistema.

* Variáveis de sistema que controlam quais componentes de log carregar e habilitar e como cada componente opera.

A configuração do log de erros é descrita sob os seguintes tópicos nesta seção:

* Configuração Padrão do Log de Erros
* Métodos de Configuração do Log de Erros
* Configuração Implícita do Log de Erros
* Configuração Explicita do Log de Erros
* Alterar o Método de Configuração do Log de Erros
* Solução de Problemas com Configurações
* Configuração de Múltiplos Sinks de Log
* Suporte ao Esquema de Desempenho do Sink de Log

##### Configuração do Log de Erros Padrão

A variável de sistema `log_error_services` controla quais componentes de log carregáveis devem ser carregados e quais componentes de log devem ser habilitados para registro de erros. Por padrão, `log_error_services` tem o valor mostrado aqui:

```
mysql> SELECT @@GLOBAL.log_error_services;
+----------------------------------------+
| @@GLOBAL.log_error_services            |
+----------------------------------------+
| log_filter_internal; log_sink_internal |
+----------------------------------------+
```

Esse valor indica que os eventos de log passam primeiro pelo componente de filtro `log_filter_internal`, depois pelo componente de canal `log_sink_internal`, ambos componentes internos. Um filtro modifica os eventos de log vistos pelos componentes listados posteriormente no valor de `log_error_services`. Um canal é um destino para eventos de log. Tipicamente, um canal processa eventos de log em mensagens de log com um formato específico e escreve essas mensagens em sua saída associada, como um arquivo ou o log do sistema.

A combinação de `log_filter_internal` e `log_sink_internal` implementa o comportamento padrão de filtragem e saída do log de erros. A ação desses componentes é afetada por outras opções do servidor e variáveis de sistema:

* O destino da saída é determinado pela opção `--log-error` (e, no Windows, `--pid-file` e `--console`). Essas opções determinam se os mensagens de erro devem ser escritas na console ou em um arquivo e, se em um arquivo, o nome do arquivo de log de erros. Veja a Seção 7.4.2.2, “Configuração de Destino do Log de Erros Padrão”.

* As variáveis de sistema `log_error_verbosity` e `log_error_suppression_list` afetam quais tipos de eventos de log o `log_filter_internal` permite ou suprime. Veja a Seção 7.4.2.5, “Filtragem Prioritária do Log de Erros (log\_filter\_internal)”).

Ao configurar `log_error_services`, esteja ciente das seguintes características:

* Uma lista de componentes de log pode ser delimitada por ponto-e-vírgula ou vírgulas, opcionalmente seguidas por espaços. Um determinado ajuste não pode usar tanto o ponto-e-vírgula quanto a vírgula como delimitador. A ordem dos componentes é significativa porque o servidor executa os componentes na ordem listada.

* O componente final no valor `log_error_services` não pode ser um filtro. Esse é um erro porque quaisquer alterações que ele fizer nos eventos não terão efeito na saída:

  ```
  mysql> SET GLOBAL log_error_services = 'log_filter_internal';
  ERROR 1231 (42000): Variable 'log_error_services' can't be set to the value
  of 'log_filter_internal'
  ```

  Para corrigir o problema, inclua um canal de saída no final do valor:

  ```
  mysql> SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal';
  ```

* A ordem dos componentes nomeados no `log_error_services` é significativa, particularmente em relação à ordem relativa dos filtros e canais de saída. Considere este valor `log_error_services`:

  ```
  log_filter_internal; log_sink_1; log_sink_2
  ```

  Neste caso, os eventos de log passam pelo filtro embutido, depois pelo primeiro canal de saída, depois pelo segundo canal de saída. Ambos os canais de saída recebem os eventos de log filtrados.

  Compare isso com este valor `log_error_services`:

  ```
  log_sink_1; log_filter_internal; log_sink_2
  ```

  Neste caso, os eventos de log passam pelo primeiro canal de saída, depois pelo filtro embutido, depois pelo segundo canal de saída. O primeiro canal de saída recebe eventos não filtrados. O segundo canal de saída recebe eventos filtrados. Você pode configurar o registro de erros dessa maneira se quiser um log que contenha mensagens para todos os eventos de log e outro log que contenha mensagens apenas para um subconjunto de eventos de log.

##### Métodos de Configuração do Log de Erros

A configuração do log de erros envolve carregar e habilitar os componentes do log de erros conforme necessário e realizar a configuração específica de cada componente.

Existem dois métodos de configuração do log de erros, *implicito* e *explícito*. Recomenda-se que um método de configuração seja selecionado e usado exclusivamente. O uso de ambos os métodos pode resultar em avisos durante o inicialização. Para mais informações, consulte Problemas de Configuração de Solução de Problemas.

*Configuração de Log de Erros Implícito*

Este método de configuração carrega e habilita os componentes de log definidos pela variável `log_error_services`. Componentes carregáveis que ainda não estão carregados são carregados implicitamente no início do processo de inicialização antes que o motor de armazenamento `InnoDB` esteja totalmente disponível. Este método de configuração tem as seguintes vantagens:

+ Os componentes de log são carregados no início da sequência de inicialização, antes do motor de armazenamento `InnoDB`, tornando as informações registradas disponíveis mais cedo.

+ Evita a perda de informações de log armazenadas em buffer caso ocorra uma falha durante a inicialização.

+ Não é necessário instalar componentes de log de erros usando `INSTALL COMPONENT`, simplificando a configuração do log de erros.

Para usar este método, consulte Configuração de Log de Erros Implícito.

*Configuração de Log de Erros Explícita*

Nota

Este método de configuração é suportado para compatibilidade com versões anteriores. O método de configuração implícito é recomendado.

Este método de configuração requer o carregamento de componentes de log de erros usando `INSTALL COMPONENT` e, em seguida, a configuração de `log_error_services` para habilitar os componentes de log. `INSTALL COMPONENT` adiciona o componente à tabela `mysql.component` (uma tabela `InnoDB`) e os componentes a serem carregados no início são lidos a partir desta tabela, que só é acessível após o `InnoDB` ser inicializado.

As informações registradas são armazenadas em buffer durante a sequência de inicialização enquanto o motor de armazenamento `InnoDB` está sendo inicializado, o que às vezes é prolongado por operações como recuperação e atualização do dicionário de dados que ocorrem durante a sequência de inicialização do `InnoDB`.

Para usar este método, consulte Configuração de Log de Erros Explícita.

##### Configuração de Log de Erros Implícito

Este procedimento descreve como carregar e habilitar componentes de registro de erros implicitamente usando `log_error_services`. Para uma discussão sobre os métodos de configuração do log de erros, consulte Métodos de Configuração do Log de Erros.

Para carregar e habilitar componentes de registro de erros implicitamente:

1. Liste os componentes do log de erros no valor `log_error_services`.

   Para carregar e habilitar os componentes do log de erros no início do servidor, defina `log_error_services` em um arquivo de opção. O seguinte exemplo configura o uso do canal de registro JSON (`log_sink_json`) além do filtro e canal de registro internos (`log_filter_internal`, `log_sink_internal`).

   ```
   [mysqld]
   log_error_services='log_filter_internal; log_sink_internal; log_sink_json'
   ```

   Observação

   Para usar o canal de registro JSON (`log_sink_syseventlog`) em vez do canal padrão (`log_sink_internal`), substitua `log_sink_internal` por `log_sink_json`.

   Para carregar e habilitar o componente imediatamente e para reinicializações subsequentes, defina `log_error_services` usando `SET PERSIST`:

   ```
   SET PERSIST log_error_services = 'log_filter_internal; log_sink_internal; log_sink_json';
   ```

2. Se o componente do log de erros expor quaisquer variáveis de sistema que devem ser definidas para que a inicialização do componente seja bem-sucedida, atribua esses valores apropriados. Você pode definir essas variáveis em um arquivo de opção ou usando `SET PERSIST`.

   Importante

   Ao implementar uma configuração implícita, defina `log_error_services` primeiro para carregar um componente e expor suas variáveis de sistema, e defina as variáveis de sistema do componente depois. Essa ordem de configuração é necessária independentemente de a atribuição de variáveis ser realizada na linha de comando, em um arquivo de opção ou usando `SET PERSIST`.

Para desabilitar um componente de log, remova-o do valor `log_error_services`. Também remova quaisquer configurações de variáveis de sistema do componente que você definiu.

Observação

Carregar um componente de registro implicitamente usando `log_error_services` não tem efeito na tabela `mysql.component`. Ele não adiciona o componente à tabela `mysql.component`, nem remove um componente previamente instalado usando `INSTALL COMPONENT` da tabela `mysql.component`.

##### Configuração Explicita do Log de Erros

Este procedimento descreve como carregar e habilitar componentes de registro de erros explicitamente, carregando componentes usando `INSTALL COMPONENT` e, em seguida, habilitando usando `log_error_services`. Para uma discussão sobre os métodos de configuração do log de erros, consulte Métodos de Configuração do Log de Erros.

Para carregar e habilitar componentes de registro de erros explicitamente:

1. Carregue o componente usando `INSTALL COMPONENT` (a menos que ele seja embutido ou já carregado). Por exemplo, para carregar o canal de registro JSON, execute a seguinte instrução:

   ```
   INSTALL COMPONENT 'file://component_log_sink_json';
   ```

   Carregar um componente usando `INSTALL COMPONENT` o registra na tabela `mysql.component` do sistema, para que o servidor o carregue automaticamente para as inicializações subsequentes, após o `InnoDB` ser inicializado.

   A URN a ser usada ao carregar um componente de registro com `INSTALL COMPONENT` é o nome do componente precedido por `file://component_`. Por exemplo, para o componente `log_sink_json`, a URN correspondente é `file://component_log_sink_json`. Para URNs de componentes de log de erros, consulte a Seção 7.5.3, “Componentes de Log de Erros”.

2. Se o componente de log de erros exposto quaisquer variáveis de sistema que devem ser definidas para que a inicialização do componente seja bem-sucedida, atribua esses valores apropriados. Você pode definir essas variáveis em um arquivo de opção ou usando `SET PERSIST`.

3. Habilite o componente listando-o no valor `log_error_services`.

   Importante

Ao carregar componentes de logue explicitamente usando `INSTALL COMPONENT`, não persista ou defina `log_error_services` em um arquivo de opção, que carrega componentes de logue implicitamente ao iniciar. Em vez disso, habilite os componentes de logue em tempo de execução usando uma declaração `SET GLOBAL`.

O seguinte exemplo configura o uso do canal de logue JSON (`log_sink_json`) além do filtro e canal de logue embutido (`log_filter_internal`, `log_sink_internal`).

```
   SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal; log_sink_json';
   ```

Nota

Para usar o canal de logue JSON (`log_sink_syseventlog`) em vez do canal padrão (`log_sink_internal`), você substitui `log_sink_internal` por `log_sink_json`.

Para desabilitar um componente de logue, remova-o do valor `log_error_services`. Em seguida, se o componente for carregável e você também quiser descarregá-lo, use `UNINSTALL COMPONENT`. Também remova quaisquer configurações de variáveis de componentes associadas que você definiu.

Tentativas de usar `UNINSTALL COMPONENT` para descarregar um componente carregável que ainda está nomeado no valor `log_error_services` produzem um erro.

##### Mudando o Método de Configuração do Log de Erros

Se você já carregou componentes de logue de erro explicitamente usando `INSTALL COMPONENT` e deseja mudar para uma configuração implícita, conforme descrito na Configuração Implícita do Log de Erros, os seguintes passos são recomendados:

1. Defina `log_error_services` de volta à sua configuração padrão.

```
   SET GLOBAL log_error_services = 'log_filter_internal,log_sink_internal';
   ```

2. Use `UNINSTALL COMPONENT` para desinstalar quaisquer componentes de logue carregáveis que você instalou anteriormente. Por exemplo, se você instalou o canal de logue JSON anteriormente, desinstale-o conforme mostrado:

   ```
   UNINSTALL COMPONENT 'file://component_log_sink_json';
   ```

3. Remova todas as configurações de variáveis de componente para o componente desinstalado. Por exemplo, se as variáveis de componente foram definidas em um arquivo de opções, remova as configurações do arquivo de opções. Se as variáveis de componente foram definidas usando `SET PERSIST`, use `RESET PERSIST` para limpar as configurações.

4. Siga os passos na Configuração do Log de Erro Implícito para reimplementar sua configuração.

Se você precisar reverter de uma configuração implícita para uma explícita, realize os seguintes passos:

1. Defina `log_error_services` de volta à sua configuração padrão para descarregar componentes de log carregados implicitamente.

   ```
   SET GLOBAL log_error_services = 'log_filter_internal,log_sink_internal';
   ```

2. Remova todas as configurações de variáveis de componente associadas aos componentes desinstalados. Por exemplo, se as variáveis de componente foram definidas em um arquivo de opções, remova as configurações do arquivo de opções. Se as variáveis de componente foram definidas usando `SET PERSIST`, use `RESET PERSIST` para limpar as configurações.

3. Reinicie o servidor para desinstalar os componentes de log que foram carregados implicitamente.

4. Siga os passos na Configuração do Log de Erro Explicito para reimplementar sua configuração.

##### Solução de Problemas de Configuração

Os componentes de log listados no valor `log_error_services` ao iniciar são carregados implicitamente no início da sequência de inicialização do MySQL Server. Se o componente de log foi carregado anteriormente usando `INSTALL COMPONENT`, o servidor tenta carregar o componente novamente mais tarde na sequência de inicialização, o que produz o aviso Não é possível carregar o componente a partir de URN especificado: 'file://component\_*component_name*'

Você pode verificar esse aviso no log de erro ou consultando a tabela `error_log` do Schema de Desempenho usando a seguinte consulta:

```
SELECT error_code, data
  FROM performance_schema.error_log
 WHERE data LIKE "%'file://component_%"
   AND error_code="MY-013129" AND data LIKE "%MY-003529%";
```

Para evitar esse aviso, siga as instruções na seção "Mudando o método de configuração do log de erros" para ajustar a configuração do seu log de erros. Deve-se usar uma configuração de log de erros explícita ou implícita, mas não ambas.

Um erro semelhante ocorre ao tentar carregar explicitamente um componente que foi carregado implicitamente durante o inicialização. Por exemplo, se `log_error_services` lista o componente de canal de registro JSON, esse componente é carregado implicitamente durante o inicialização. Tentar carregar explicitamente o mesmo componente mais tarde retorna esse erro:

```
mysql> INSTALL COMPONENT 'file://component_log_sink_json';
ERROR 3529 (HY000): Cannot load component from specified URN: 'file://component_log_sink_json'.
```

##### Configuração de Múltiplos Canos de Registro

É possível configurar múltiplos canais de registro, o que permite enviar a saída para múltiplos destinos. Para habilitar o canal de registro JSON além (em vez de em vez de) o canal padrão, defina o valor `log_error_services` da seguinte forma:

```
SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal; log_sink_json';
```

Para reverter para o uso apenas do canal padrão e descarregar o canal de registro do sistema, execute essas instruções:

```
SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal;
UNINSTALL COMPONENT 'file://component_log_sink_json';
```

##### Suporte ao Esquema de Desempenho do Canal de Registro

Se os componentes habilitados incluem um canal que fornece suporte ao Schema de Desempenho, os eventos escritos no log de erros também são escritos na tabela `error\_log` do Schema de Desempenho. Isso permite examinar o conteúdo do log de erros usando consultas SQL. Atualmente, os canais de registro `log_sink_internal` no formato tradicional e `log_sink_json` no formato JSON suportam essa capacidade. Veja a Seção 29.12.22.3, “A tabela error\_log”.