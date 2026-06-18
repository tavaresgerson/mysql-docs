#### 7.4.2.1 Configuração do Log de Erros

No MySQL 8.0, o registro de erros utiliza a arquitetura de componentes do MySQL descrita na Seção 7.5, “Componentes do MySQL”. O subsistema de log de erros consiste em componentes que realizam a filtragem e a escrita de eventos de log, além de uma variável de sistema que configura quais componentes devem ser carregados e habilitados para obter o resultado de registro desejado.

Esta seção discute como carregar e habilitar componentes para registro de erros. Para instruções específicas sobre filtros de log, consulte a Seção 7.4.2.4, “Tipos de Filtragem de Log de Erro”. Para instruções específicas sobre os sumidouros de log JSON e de log do sistema, consulte a Seção 7.4.2.7, “Registro de Erros no Formato JSON”, e a Seção 7.4.2.8, “Registro de Erros no Log do Sistema”. Para detalhes adicionais sobre todos os componentes de log disponíveis, consulte a Seção 7.5.3, “Componentes do Log de Erro”.

O registro de erros baseado em componentes oferece essas funcionalidades:

- Registre eventos que possam ser filtrados por componentes de filtro para afetar as informações disponíveis para escrita.

- Registre eventos que são emitidos por componentes de saída (escritores). Vários componentes de saída podem ser habilitados para gravar a saída do log de erro em múltiplos destinos.

- Componentes de filtro e pia integrados que implementam o formato padrão do log de erros.

- Um repositório de dados que permite a autenticação no formato JSON.

- Um repositório de pia que permite o registro no log do sistema.

- Variáveis do sistema que controlam quais componentes do log devem ser carregados e ativados e como cada componente opera.

A configuração do log de erros é descrita nos seguintes tópicos desta seção:

- Configuração do Log de Erros Padrão
- Métodos de Configuração do Log de Erros
- Configuração do Log de Erros Implícito
- Configuração do Log de Erros Explicito
- Mudando o método de configuração do log de erros
- Problemas de configuração
- Configurando Vários Canais de Registro
- Suporte ao esquema de desempenho do Sink de logs

##### Configuração do Log de Erros Padrão

A variável de sistema `log_error_services` controla quais componentes de log carregáveis devem ser carregados (a partir do MySQL 8.0.30) e quais componentes de log devem ser habilitados para registro de erros. Por padrão, `log_error_services` tem esse valor:

```
mysql> SELECT @@GLOBAL.log_error_services;
+----------------------------------------+
| @@GLOBAL.log_error_services            |
+----------------------------------------+
| log_filter_internal; log_sink_internal |
+----------------------------------------+
```

Esse valor indica que os eventos de log passam primeiro pelo componente de filtro `log_filter_internal` e, em seguida, pelo componente de destino `log_sink_internal`, ambos componentes embutidos. Um filtro modifica os eventos de log vistos pelos componentes mencionados posteriormente no valor `log_error_services`. Um destino é um local para eventos de log. Normalmente, um destino processa os eventos de log em mensagens de log com um formato específico e escreve essas mensagens em sua saída associada, como um arquivo ou o log do sistema.

A combinação de `log_filter_internal` e `log_sink_internal` implementa o comportamento padrão de filtragem e saída do log de erros. A ação desses componentes é afetada por outras opções do servidor e variáveis do sistema:

- O destino de saída é determinado pela opção `--log-error` (e, no Windows, `--pid-file` e `--console`). Estes determinam se as mensagens de erro devem ser escritas no console ou em um arquivo e, se para um arquivo, o nome do arquivo de registro de erros. Veja a Seção 7.4.2.2, “Configuração Padrão do Destino do Registro de Erros”.

- As variáveis de sistema `log_error_verbosity` e `log_error_suppression_list` afetam quais tipos de eventos de log `log_filter_internal` permitem ou suprimem. Veja a Seção 7.4.2.5, “Filtragem do Log de Erros Baseada em Prioridade (log\_filter\_internal)”.

Ao configurar `log_error_services`, esteja ciente das seguintes características:

- Uma lista de componentes de log pode ser delimitada por ponto e vírgula ou (a partir do MySQL 8.0.12) por vírgula, opcionalmente seguida por um espaço. Um determinado ajuste não pode usar tanto o ponto e vírgula quanto a vírgula como delimitadores. A ordem dos componentes é importante porque o servidor executa os componentes na ordem listada.

- O componente final no valor `log_error_services` não pode ser um filtro. Esse é um erro porque quaisquer alterações que ele fizer nos eventos não terão efeito na saída:

  ```
  mysql> SET GLOBAL log_error_services = 'log_filter_internal';
  ERROR 1231 (42000): Variable 'log_error_services' can't be set to the value
  of 'log_filter_internal'
  ```

  Para corrigir o problema, inclua um pires no final do valor:

  ```
  mysql> SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal';
  ```

- A ordem dos componentes mencionados no `log_error_services` é importante, especialmente em relação à ordem relativa dos filtros e dos poços. Considere este valor `log_error_services`:

  ```
  log_filter_internal; log_sink_1; log_sink_2
  ```

  Neste caso, os eventos de log são passados para o filtro integrado, depois para o primeiro ralo e, em seguida, para o segundo ralo. Ambos os ralos recebem os eventos de log filtrados.

  Compare isso com esse valor `log_error_services`:

  ```
  log_sink_1; log_filter_internal; log_sink_2
  ```

  Nesse caso, os eventos de log são passados para o primeiro ralo, depois para o filtro embutido e, em seguida, para o segundo ralo. O primeiro ralo recebe eventos não filtrados. O segundo ralo recebe eventos filtrados. Você pode configurar o registro de erros dessa maneira se quiser um log que contenha mensagens para todos os eventos de log e outro log que contenha mensagens apenas para um subconjunto de eventos de log.

##### Métodos de Configuração do Log de Erros

A configuração do log de erros envolve carregar e habilitar os componentes do log de erros conforme necessário e realizar a configuração específica de cada componente.

Existem dois métodos de configuração do log de erros, *implicito* e *explícito*. Recomenda-se que um método de configuração seja selecionado e usado exclusivamente. O uso de ambos os métodos pode resultar em avisos durante a inicialização. Para obter mais informações, consulte Problemas de Configuração de Solução de Problemas.

- *Configuração do Log de Erros Implícito* (introduzido no MySQL 8.0.30)

  Este método de configuração carrega e habilita os componentes de log definidos pela variável `log_error_services`. Os componentes carregáveis que ainda não estão carregados são carregados implicitamente durante o início antes que o mecanismo de armazenamento `InnoDB` esteja totalmente disponível. Este método de configuração tem as seguintes vantagens:

  - Os componentes do log são carregados no início da sequência de inicialização, antes do mecanismo de armazenamento `InnoDB`, tornando as informações registradas disponíveis mais cedo.

  - Isso evita a perda de informações de log armazenadas, caso ocorra uma falha durante a inicialização.

  - A instalação de componentes de registro de erros usando `INSTALL COMPONENT` não é necessária, simplificando a configuração do registro de erros.

  Para usar esse método, consulte Configuração do Log de Erro Implícito.

- *Configuração do Log de Erros Explicito*

  Nota

  Este método de configuração é suportado para compatibilidade reversa. O método de configuração implícito, introduzido no MySQL 8.0.30, é recomendado.

  Este método de configuração requer o carregamento dos componentes do log de erros usando `INSTALL COMPONENT` e, em seguida, a configuração de `log_error_services` para habilitar os componentes do log. `INSTALL COMPONENT` adiciona o componente à tabela `mysql.component` (uma tabela `InnoDB`), e os componentes a serem carregados ao iniciar são lidos a partir desta tabela, que só é acessível após `InnoDB` ser inicializada.

  As informações registradas são armazenadas em um buffer durante a sequência de inicialização, enquanto o motor de armazenamento `InnoDB` está sendo inicializado, o que às vezes é prolongado por operações como recuperação e atualização do dicionário de dados que ocorrem durante a sequência de inicialização `InnoDB`.

  Para usar esse método, consulte Configuração do Log de Erros Explicito.

##### Configuração do Log de Erros Implícito

Este procedimento descreve como carregar e habilitar componentes de registro de erros implicitamente usando `log_error_services`. Para uma discussão sobre os métodos de configuração do log de erros, consulte Métodos de Configuração do Log de Erros.

Para carregar e habilitar componentes de registro de erros implicitamente:

1. Liste os componentes do log de erro no valor `log_error_services`.

   Para carregar e habilitar os componentes do log de erros na inicialização do servidor, defina `log_error_services` em um arquivo de opções. O seguinte exemplo configura o uso do canal de saída de log JSON (`log_sink_json`), além do filtro e canal de saída de log embutidos (`log_filter_internal`, `log_sink_internal`).

   ```
   [mysqld]
   log_error_services='log_filter_internal; log_sink_internal; log_sink_json'
   ```

   Nota

   Para usar o canal de registro JSON (`log_sink_syseventlog`) em vez do canal padrão (`log_sink_internal`), você substituiria `log_sink_internal` por `log_sink_json`.

   Para carregar e habilitar o componente imediatamente e para reinicializações subsequentes, defina `log_error_services` usando `SET PERSIST`:

   ```
   SET PERSIST log_error_services = 'log_filter_internal; log_sink_internal; log_sink_json';
   ```

2. Se o componente de log de erros exibe quaisquer variáveis de sistema que devem ser definidas para que a inicialização do componente seja bem-sucedida, atribua valores apropriados a essas variáveis. Você pode definir essas variáveis em um arquivo de opções ou usando `SET PERSIST`.

   Importante

   Ao implementar uma configuração implícita, defina `log_error_services` primeiro para carregar um componente e expor suas variáveis de sistema, e, em seguida, defina as variáveis de sistema do componente posteriormente. Essa ordem de configuração é necessária, independentemente de a atribuição de variáveis ser realizada na linha de comando, em um arquivo de opção ou usando `SET PERSIST`.

Para desabilitar um componente de registro, remova-o do valor `log_error_services`. Além disso, remova todas as configurações de variáveis de componentes associados que você definiu.

Nota

Carregar um componente de logue implicitamente usando `log_error_services` não tem efeito na tabela `mysql.component`. Não adiciona o componente à tabela `mysql.component`, nem remove um componente previamente instalado usando `INSTALL COMPONENT` da tabela `mysql.component`.

##### Configuração do Log de Erros Explicito

Este procedimento descreve como carregar e habilitar explicitamente os componentes de registro de erros, carregando os componentes usando `INSTALL COMPONENT` e, em seguida, habilitando-os usando `log_error_services`. Para uma discussão sobre os métodos de configuração do log de erros, consulte Métodos de Configuração do Log de Erros.

Para carregar e habilitar componentes de registro de erros explicitamente:

1. Carregue o componente usando `INSTALL COMPONENT` (a menos que ele esteja embutido ou já carregado). Por exemplo, para carregar o canal de registro JSON, execute a seguinte instrução:

   ```
   INSTALL COMPONENT 'file://component_log_sink_json';
   ```

   Ao carregar um componente usando `INSTALL COMPONENT`, ele é registrado na tabela de sistema `mysql.component`, de modo que o servidor o carregue automaticamente para as próximas inicializações, após o `InnoDB` ser inicializado.

   O URN a ser utilizado ao carregar um componente de log com `INSTALL COMPONENT` é o nome do componente precedido por `file://component_`. Por exemplo, para o componente `log_sink_json`, o URN correspondente é `file://component_log_sink_json`. Para os URNs de componentes de log de erro, consulte a Seção 7.5.3, “Componentes de Log de Erro”.

2. Se o componente de log de erros exibe quaisquer variáveis de sistema que devem ser definidas para que a inicialização do componente seja bem-sucedida, atribua valores apropriados a essas variáveis. Você pode definir essas variáveis em um arquivo de opções ou usando `SET PERSIST`.

3. Ative o componente listando-o no valor `log_error_services`.

   Importante

   A partir do MySQL 8.0.30, ao carregar componentes de log explicitamente usando `INSTALL COMPONENT`, não persista ou defina `log_error_services` em um arquivo de opção, que carrega componentes de log implicitamente ao iniciar. Em vez disso, habilite os componentes de log em tempo de execução usando uma declaração `SET GLOBAL`.

   O exemplo a seguir configura o uso do canal de registro JSON (`log_sink_json`), além do filtro e canal de registro integrados (`log_filter_internal`, `log_sink_internal`).

   ```
   SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal; log_sink_json';
   ```

   Nota

   Para usar o canal de registro JSON (`log_sink_syseventlog`) em vez do canal padrão (`log_sink_internal`), você substituiria `log_sink_internal` por `log_sink_json`.

Para desabilitar um componente de registro, remova-o do valor `log_error_services`. Em seguida, se o componente for carregável e você também quiser descarregá-lo, use `UNINSTALL COMPONENT`. Também remova quaisquer configurações de variáveis de componentes associados que você definiu.

Tentativas de usar `UNINSTALL COMPONENT` para descarregar um componente carregável que ainda está nomeado no valor `log_error_services` produzem um erro.

##### Mudando o método de configuração do log de erros

Se você já carregou componentes do log de erros explicitamente usando `INSTALL COMPONENT` e deseja mudar para uma configuração implícita, conforme descrito na Configuração Implícita do Log de Erros, os seguintes passos são recomendados:

1. Redefina `log_error_services` para a configuração padrão.

   ```
   SET GLOBAL log_error_services = 'log_filter_internal,log_sink_internal';
   ```

2. Use `UNINSTALL COMPONENT` para desinstalar quaisquer componentes de registro carregáveis que você instalou anteriormente. Por exemplo, se você instalou o canal de registro JSON anteriormente, desinstale-o conforme mostrado:

   ```
   UNINSTALL COMPONENT 'file://component_log_sink_json';
   ```

3. Remova todas as configurações de variáveis do componente desinstalado. Por exemplo, se as variáveis do componente foram definidas em um arquivo de opções, remova as configurações do arquivo de opções. Se as variáveis do componente foram definidas usando `SET PERSIST`, use `RESET PERSIST` para limpar as configurações.

4. Siga os passos na Configuração do Log de Erro Implícito para reimplementar sua configuração.

Se você precisar reverter uma configuração implícita para uma explícita, siga os passos abaixo:

1. Configure `log_error_services` de volta à configuração padrão para descarregar componentes de log carregados implicitamente.

   ```
   SET GLOBAL log_error_services = 'log_filter_internal,log_sink_internal';
   ```

2. Remova todas as configurações de variáveis de componentes associadas aos componentes desinstalados. Por exemplo, se as variáveis de componentes foram definidas em um arquivo de opções, remova as configurações do arquivo de opções. Se as variáveis de componentes foram definidas usando `SET PERSIST`, use `RESET PERSIST` para limpar as configurações.

3. Reinicie o servidor para desinstalar os componentes de registro que foram carregados implicitamente.

4. Siga os passos na Configuração do Log de Erro Explicito para reimplementar sua configuração.

##### Problemas de configuração

A partir do MySQL 8.0.30, os componentes de log listados no valor `log_error_services` ao iniciar o servidor são carregados implicitamente no início da sequência de inicialização do MySQL Server. Se o componente de log foi carregado anteriormente usando `INSTALL COMPONENT`, o servidor tenta carregá-lo novamente mais tarde na sequência de inicialização, o que produz o seguinte aviso:

```
Cannot load component from specified URN: 'file://component_component_name'
```

Você pode verificar esse aviso no log de erros ou consultando a tabela do Schema de Desempenho `error_log` usando a seguinte consulta:

```
SELECT error_code, data
  FROM performance_schema.error_log
 WHERE data LIKE "%'file://component_%"
   AND error_code="MY-013129" AND data LIKE "%MY-003529%";
```

Para evitar esse aviso, siga as instruções na seção Alterar o método de configuração do log de erros para ajustar a configuração do log de erros. Deve-se usar uma configuração de log de erros implícita ou explícita, mas não ambas.

Um erro semelhante ocorre ao tentar carregar explicitamente um componente que foi carregado implicitamente durante o inicialização. Por exemplo, se `log_error_services` lista o componente de canal de registro JSON, esse componente é carregado implicitamente durante o inicialização. Se tentar carregar explicitamente o mesmo componente mais tarde, ele retornará esse erro:

```
mysql> INSTALL COMPONENT 'file://component_log_sink_json';
ERROR 3529 (HY000): Cannot load component from specified URN: 'file://component_log_sink_json'.
```

##### Configurando Vários Canais de Registro

É possível configurar vários pontos de saída de logs, o que permite enviar a saída para vários destinos. Para habilitar o ponto de saída de logs JSON, além (e não em vez de) o ponto de saída padrão, defina o valor `log_error_services` da seguinte forma:

```
SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal; log_sink_json';
```

Para voltar a usar apenas o repositório padrão e descarregar o repositório de log do sistema, execute as seguintes instruções:

```
SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal;
UNINSTALL COMPONENT 'file://component_log_sink_json';
```

##### Suporte ao esquema de desempenho do Sink de logs

Se habilitado, os componentes de registro incluem um canal que fornece suporte ao Schema de Desempenho, e os eventos escritos no log de erro também são escritos na tabela do Schema de Desempenho `error_log`. Isso permite examinar o conteúdo do log de erro usando consultas SQL. Atualmente, os canais de formato tradicional `log_sink_internal` e de formato JSON `log_sink_json` suportam essa capacidade. Veja a Seção 29.12.21.2, “A tabela error\_log”.
