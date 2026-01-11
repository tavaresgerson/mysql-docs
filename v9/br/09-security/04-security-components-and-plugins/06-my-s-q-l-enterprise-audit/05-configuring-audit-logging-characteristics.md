#### 8.4.6.5 Configurando as Características do Registro de Auditoria

Esta seção descreve como configurar as características do registro de auditoria, como o arquivo para o qual o plugin de registro de auditoria escreve eventos, o formato dos eventos escritos, se a compressão e criptografia dos arquivos de registro devem ser habilitadas e a gestão de espaço.

* Convenções de Nomenclatura para Arquivos de Registro de Auditoria
* Selecionando o Formato do Arquivo de Registro de Auditoria
* Habilitando a Tarefa de Limpeza do Registro de Auditoria
* Adicionando Estatísticas de Consulta para Detecção de Anomalias
* Compressando Arquivos de Registro de Auditoria
* Criptografando Arquivos de Registro de Auditoria
* Descompactando e Decriptografando Manualmente Arquivos de Registro de Auditoria
* Gestão de Espaço dos Arquivos de Registro de Auditoria
* Estratégias de Escrita para Registro de Auditoria

Para obter informações adicionais sobre as funções e variáveis do sistema que afetam o registro de auditoria, consulte Funções de Registro de Auditoria e Opções e Variáveis de Registro de Auditoria.

O plugin de registro de auditoria também pode controlar quais eventos auditados são escritos no arquivo de registro de auditoria, com base no conteúdo do evento ou na conta de onde os eventos se originam. Consulte a Seção 8.4.6.7, “Filtragem do Registro de Auditoria”.

##### Convenções de Nomenclatura para Arquivos de Registro de Auditoria

Para configurar o nome do arquivo de registro de auditoria, defina a variável de sistema `audit_log_file` no início do servidor. O nome padrão é `audit.log` no diretório de dados do servidor. Para a melhor segurança, escreva o registro de auditoria em um diretório acessível apenas ao servidor MySQL e aos usuários que têm um motivo legítimo para visualizar o log.

O plugin interpreta o valor `audit_log_file` como composto por um nome de diretório opcional, um nome base e um sufixo opcional. Se a compressão ou criptografia estiverem habilitadas, o nome efetivo do arquivo (o nome realmente usado para criar o arquivo de log) difere do nome configurado porque tem sufixos adicionais:

* Se a compressão estiver habilitada, o plugin adiciona um sufixo de `.gz`.

* Se a criptografia estiver habilitada, o plugin adiciona um sufixo de `.pwd_id.enc`, onde *`pwd_id`* indica qual senha de criptografia usar para operações de arquivo de registro. O plugin de log de auditoria armazena senhas de criptografia no chaveiro; veja Criptografar Arquivos de Registro de Auditoria.

O nome efetivo do arquivo de log de auditoria é o nome resultante da adição de sufixos de compressão e criptografia aplicáveis ao nome do arquivo configurado. Por exemplo, se o valor configurado de `audit_log_file` for `audit.log`, o nome efetivo do arquivo é um dos valores mostrados na tabela a seguir.

<table summary="nomes de arquivos de log de auditoria efetivos para várias combinações das características de compressão e criptografia."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Recursos Ativados</th> <th>Nome do Arquivo Efetivo</th> </tr></thead><tbody><tr> <td>Sem compressão ou criptografia</td> <td><code>audit.log</code></td> </tr><tr> <td>Compressão</td> <td><code>audit.log.gz</code></td> </tr><tr> <td>Criptografia</td> <td><code>audit.log.<em><code>pwd_id</code></em>.enc</code></td> </tr><tr> <td>Compressão, criptografia</td> <td><code>audit.log.gz.<em><code>pwd_id</code></em>.enc</code></td> </tr></tbody></table>

*`pwd_id`* indica o ID da senha usada para criptografar ou descriptografar um arquivo. O formato de *`pwd_id`* é *`pwd_timestamp-seq`*, onde:

* *`pwd_timestamp`* é um valor UTC no formato `YYYYMMDDThhmmss` indicando quando a senha foi criada.

* *`seq`* é um número de sequência. Os números de sequência começam em 1 e aumentam para senhas que têm o mesmo valor de *`pwd_timestamp`*.

Aqui estão alguns exemplos de valores de ID de senha *`pwd_id`*:

```
20190403T142359-1
20190403T142400-1
20190403T142400-2
```

Para construir os IDs correspondentes do chaveiro para armazenar senhas no chaveiro, o plugin de log de auditoria adiciona um prefixo de `audit_log-` aos valores de *`pwd_id`*. Para os IDs de senhas mostrados anteriormente, os IDs correspondentes do chaveiro são:

```
audit_log-20190403T142359-1
audit_log-20190403T142400-1
audit_log-20190403T142400-2
```

O ID da senha atualmente usado para criptografia pelo plugin de log de auditoria é o que tem o maior valor de *`pwd_timestamp`*. Se várias senhas tiverem esse valor de *`pwd_timestamp`*, o ID da senha atual é o que tem o maior número de sequência. Por exemplo, no conjunto de IDs de senhas anterior, dois deles têm o maior timestamp, `20190403T142400`, então o ID da senha atual é o que tem o maior número de sequência (`2`).

O plugin de log de auditoria realiza certas ações durante a inicialização e término com base no nome efetivo do arquivo de log de auditoria:

* Durante a inicialização, o plugin verifica se um arquivo com o nome do arquivo de log de auditoria já existe e renomeia-o se existir. (Neste caso, o plugin assume que a invocação do servidor anterior saiu inesperadamente com o plugin de log de auditoria em execução.) O plugin então escreve em um novo arquivo de log de auditoria vazio.

* Durante o término, o plugin renomeia o arquivo de log de auditoria.
* O renomeamento de arquivo (seja durante a inicialização ou término do plugin) ocorre de acordo com as regras usuais para rotação automática de arquivos de log baseada no tamanho; veja Rotação Automática de Arquivos de Log de Log de Auditoria.

##### Selecionando o Formato do Arquivo de Log de Auditoria

Para configurar o formato do arquivo de log de auditoria, defina a variável de sistema `audit_log_format` na inicialização do servidor. Esses formatos estão disponíveis:

* `NEW`: Formato XML de novo estilo. Este é o padrão.

* `OLD`: Formato XML de estilo antigo.
* `JSON`: Formato JSON. Escreve o log de auditoria como um array JSON. Apenas este formato suporta as estatísticas opcionais de tempo de consulta e tamanho.

Para obter detalhes sobre cada formato, consulte a Seção 8.4.6.4, “Formas de arquivos de registro de auditoria”.

##### Habilitando a Tarefa de Limpeza do Registro de Auditoria

O MySQL Enterprise Audit fornece a capacidade de definir um intervalo de atualização para descartar o cache em memória automaticamente. Uma tarefa de limpeza configurada usando a variável de sistema `audit_log_flush_interval_seconds` tem um valor padrão de zero, o que significa que a tarefa não está agendada para ser executada.

Quando a tarefa é configurada para ser executada (o valor é diferente de zero), o MySQL Enterprise Audit tenta chamar o componente de agendamento na sua inicialização e configurar uma limpeza regular e recorrente do seu cache de memória:

* Se o log de auditoria não encontrar uma implementação do serviço de registro de agendamento, ele não agende a limpeza e continua a carregar.

* O log de auditoria implementa o serviço `dynamic_loader_services_loaded_notification` e escuta por novas inscrições de `mysql_scheduler` para que o log de auditoria possa registrar sua tarefa agendada no novo agendamento carregado.

* O log de auditoria só se registra no primeiro componente de agendamento carregado.

Da mesma forma, o MySQL Enterprise Audit chama o componente `scheduler` na sua desinicialização e desconfigura a limpeza recorrente que ele havia agendado. Ele mantém uma referência ativa ao serviço de registro de agendamento até que a tarefa agendada seja desregistrada, garantindo que o componente `scheduler` não possa ser descarregado enquanto houver tarefas agendadas ativas. Todos os resultados da execução do agendamento e de suas tarefas são escritos no log de erro do servidor.

Para agendar uma tarefa de limpeza do registro de auditoria:

1. Confirme que o componente `scheduler` está carregado e habilitado. O componente é habilitado (`ON`) por padrão (consulte `component_scheduler.enabled`).

```
   SELECT * FROM mysql.components;
   +--------------+--------------------+----------------------------+
   | component_id | component_group_id | component_urn              |
   +--------------+--------------------+----------------------------+
   |            1 |                  1 | file://component_scheduler |
   +--------------+--------------------+----------------------------+
   ```

2. Instale o plugin `audit_log`, se ele ainda não estiver instalado (consulte a Seção 8.4.6.2, “Instalando ou Desinstalando o Auditoria do MySQL Enterprise”).

3. Inicie o servidor usando `audit_log_flush_interval_seconds` e defina o valor para um número maior que 59. O limite superior do valor varia de acordo com a plataforma. Por exemplo, para configurar a tarefa de varredura a cada dois minutos:

   ```
   $> mysqld --audit_log_flush_interval_seconds=120
   ```

   Para mais informações, consulte a variável de sistema `audit_log_flush_interval_seconds`.

##### Adicionando Estatísticas de Consulta para Detecção de Valores Atípicos

No MySQL 9.5, você pode estender os arquivos de log no formato JSON com campos de dados opcionais para mostrar o tempo da consulta, o número de bytes enviados e recebidos, o número de linhas devolvidas ao cliente e o número de linhas examinadas. Esses dados estão disponíveis no log de consultas lentas para consultas qualificadas e, no contexto do log de auditoria, ajudam de maneira semelhante a detectar valores atípicos para a análise de atividades. Os campos de dados estendidos podem ser adicionados apenas quando o log de auditoria estiver no formato JSON (`audit_log_format=JSON`), que não é o ajuste padrão.

As estatísticas de consulta são entregues ao log de auditoria por meio de serviços de componente que você configura como uma função de filtragem de log de auditoria. Os serviços são nomeados `mysql_audit_print_service_longlong_data_source` e `mysql_audit_print_service_double_data_source`. Você pode escolher qualquer tipo de dado para cada item de saída. Para o tempo da consulta, `longlong` exibe o valor em microsegundos e `double` exibe o valor em segundos.

Você adiciona as estatísticas de consulta usando a função de log de auditoria `audit_log_filter_set_filter()`, como o elemento `service` da sintaxe de filtragem JSON, da seguinte forma:

```
SELECT audit_log_filter_set_filter('QueryStatistics',
                                   '{ "filter": { "class": { "name": "general", "event": { "name": "status", "print" : '
                                   '{ "service": { "implementation": "mysql_server", "tag": "query_statistics", "element": [ '
                                   '{ "name": "query_time",     "type": "double" }, '
                                   '{ "name": "bytes_sent",     "type": "longlong" }, '
                                   '{ "name": "bytes_received", "type": "longlong" }, '
                                   '{ "name": "rows_sent",      "type": "longlong" }, '
                                   '{ "name": "rows_examined",  "type": "longlong" } ] } } } } } }');
```

Para que os campos `bytes_sent` e `bytes_received` sejam preenchidos, a variável de sistema `log_slow_extra` deve ser definida como `ON`. Se o valor da variável de sistema for `OFF`, um valor nulo será escrito no arquivo de log para esses campos.

Se você deseja parar de coletar as estatísticas de consultas, use a função de log de auditoria `audit_log_filter_set_filter()` para remover o filtro, por exemplo:

```
SELECT audit_log_filter_remove_filter('QueryStatistics');
```

##### Compactação de Arquivos de Log de Auditoria

A compactação de arquivos de log de auditoria pode ser habilitada para qualquer formato de registro.

Para configurar a compactação de arquivos de log de auditoria, defina a variável de sistema `audit_log_compression` no início do servidor. Os valores permitidos são `NONE` (sem compactação; o padrão) e `GZIP` (compactação com GNU Zip).

Se a compactação e a criptografia estiverem habilitadas, a compactação ocorrerá antes da criptografia. Para recuperar o arquivo original manualmente, primeiro descifre-o e, em seguida, descompacte-o. Veja Descompactação e Desciframento Manuais de Arquivos de Log de Auditoria.

##### Criptografia de Arquivos de Log de Auditoria

A criptografia de arquivos de log de auditoria pode ser habilitada para qualquer formato de registro. A criptografia é baseada em senhas definidas pelo usuário (com exceção da senha inicial que o plugin de log de auditoria gera). Para usar essa funcionalidade, o conjunto de chaves MySQL deve estar habilitado, pois o registro de auditoria usa ele para armazenamento de senhas. Qualquer componente ou plugin do conjunto de chaves pode ser usado; consulte a Seção 8.4.5, “O Conjunto de Chaves MySQL” para instruções.

Para configurar a criptografia de arquivos de log de auditoria, defina a variável de sistema `audit_log_encryption` no início do servidor. Os valores permitidos são `NONE` (sem criptografia; o padrão) e `AES` (criptografia com cifra AES-256-CBC).

Para definir ou obter uma senha de criptografia em tempo de execução, use essas funções de log de auditoria:

* Para definir a senha de criptografia atual, invocando `audit_log_encryption_password_set()`. Esta função armazena a nova senha no chaveiro. Se a criptografia estiver habilitada, também realiza uma operação de rotação de arquivo de log que renomeia o arquivo de log atual e começa um novo arquivo de log criptografado com a senha. O renomeamento de arquivos ocorre de acordo com as regras usuais para rotação automática de arquivos de log baseada em tamanho; consulte a descrição da variável Manual de Rotação de Arquivos de Log de Auditoria.

  Se a variável de sistema `audit_log_password_history_keep_days` não for zero, invocando `audit_log_encryption_password_set()` também faz a expiração das senhas antigas de criptografia de log arquivadas. Para obter informações sobre o histórico de senhas de log de auditoria, incluindo arquivamento e expiração de senhas, consulte a descrição dessa variável.

* Para obter a senha de criptografia atual, invocando `audit_log_encryption_password_get()` sem argumento. Para obter uma senha por ID, passe um argumento que especifique o ID do chaveiro da senha atual ou uma senha arquivada.

  Para determinar quais IDs de chaveiro de log de auditoria existem, consulte a tabela `keyring_keys` do Schema de Desempenho:

  ```
  mysql> SELECT KEY_ID FROM performance_schema.keyring_keys
         WHERE KEY_ID LIKE 'audit_log%'
         ORDER BY KEY_ID;
  +-----------------------------+
  | KEY_ID                      |
  +-----------------------------+
  | audit_log-20190415T152248-1 |
  | audit_log-20190415T153507-1 |
  | audit_log-20190416T125122-1 |
  | audit_log-20190416T141608-1 |
  +-----------------------------+
  ```

Para obter informações adicionais sobre as funções de criptografia de log de auditoria, consulte Funções de Log de Auditoria.

Quando o plugin de log de auditoria é inicializado, se ele encontrar que a criptografia de arquivo de log está habilitada, ele verifica se o chaveiro contém uma senha de criptografia de log. Se não, o plugin gera automaticamente uma senha de criptografia inicial aleatória e a armazena no chaveiro. Para descobrir essa senha, invocando `audit_log_encryption_password_get()`.

Se a compressão e a criptografia estiverem habilitadas, a compressão ocorre antes da criptografia. Para recuperar o arquivo original manualmente, primeiro descomprima-o e depois descomprima-o. Consulte Descomprimindo e Descifrando Manuais de Arquivos de Log de Auditoria.

##### Descompactar e Desencriptar Manualmente os Arquivos de Registro de Auditoria

Os arquivos de registro de auditoria podem ser descompactados e desencriptados usando ferramentas padrão. Isso deve ser feito apenas para arquivos de log que tenham sido fechados (arquivos arquivados) e não estejam mais em uso, e não para o arquivo de log que o plugin de registro de auditoria está escrevendo atualmente. Você pode reconhecer os arquivos de log arquivados porque eles foram renomeados pelo plugin de registro de auditoria para incluir um timestamp no nome do arquivo logo após o nome base.

Para esta discussão, vamos assumir que `audit_log_file` está definido como `audit.log`. Nesse caso, um arquivo de registro de auditoria arquivado tem um dos nomes mostrados na tabela a seguir.

<table summary="nomes de arquivos de log de auditoria arquivados para várias combinações das características de compressão e criptografia."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Recursos Ativados</th> <th>Nome do Arquivo Arquivado</th> </tr></thead><tbody><tr> <td>Sem compressão ou criptografia</td> <td><code>audit.<em><code>timestamp</code></em>.log</code></td> </tr><tr> <td>Compressão</td> <td><code>audit.<em><code>timestamp</code></em>.log.gz</code></td> </tr><tr> <td>Criptografia</td> <td><code>audit.<em><code>timestamp</code></em>.log.<em><code>pwd_id</code></em>.enc</code></td> </tr><tr> <td>Compressão, criptografia</td> <td><code>audit.<em><code>timestamp</code></em>.log.gz.<em><code>pwd_id</code></em>.enc</code></td> </tr></tbody></table>

Como discutido nas Convenções de Nomenclatura para Arquivos de Registro de Auditoria, o formato *`pwd_id`* é *`pwd_timestamp-seq`*. Assim, os nomes dos arquivos de registro criptografados arquivados realmente contêm dois timestamps. O primeiro indica o tempo de rotação do arquivo, e o segundo indica quando a senha de criptografia foi criada.

Considere o seguinte conjunto de nomes de arquivos de registro criptografados arquivados:

```
audit.20190410T205827.log.20190403T185337-1.enc
audit.20190410T210243.log.20190403T185337-1.enc
audit.20190415T145309.log.20190414T223342-1.enc
audit.20190415T151322.log.20190414T223342-2.enc
```

Cada nome de arquivo tem um timestamp de rotação único. Em contraste, os timestamps das senhas não são únicos:

* Os dois primeiros arquivos têm o mesmo ID de senha e número de sequência (`20190403T185337-1`). Eles têm a mesma senha de criptografia.

* Os dois últimos arquivos têm o mesmo ID de senha (`20190414T223342`) mas números de sequência diferentes (`1`, `2`). Esses arquivos têm senhas de criptografia diferentes.

Para descomprimir manualmente um arquivo de registro comprimido, use **gunzip**, **gzip -d** ou comando equivalente. Por exemplo:

```
gunzip -c audit.timestamp.log.gz > audit.timestamp.log
```

Para descriptografar manualmente um arquivo de registro criptografado, use o comando **openssl**. Por exemplo:

```
openssl enc -d -aes-256-cbc -pass pass:password -md sha256
    -in audit.timestamp.log.pwd_id.enc
    -out audit.timestamp.log
```

Para executar esse comando, você deve obter *`password`*, a senha de criptografia. Para fazer isso, use `audit_log_encryption_password_get()`. Por exemplo, se o nome do arquivo de registro de auditoria for `audit.20190415T151322.log.20190414T223342-2.enc`, o ID da senha é `20190414T223342-2` e o ID do chaveiro é `audit-log-20190414T223342-2`. Recupere a senha do chaveiro assim:

```
SELECT audit_log_encryption_password_get('audit-log-20190414T223342-2');
```

Se a compressão e a criptografia estiverem habilitadas para o registro de auditoria, a compressão ocorre antes da criptografia. Nesse caso, o nome do arquivo tem os sufixos `.gz` e `.pwd_id.enc` adicionados, correspondendo à ordem em que essas operações ocorrem. Para recuperar o arquivo original manualmente, realize as operações em ordem inversa. Ou seja, primeiro descriptografar o arquivo, depois descomprimir:

```
openssl enc -d -aes-256-cbc -pass pass:password -md sha256
    -in audit.timestamp.log.gz.pwd_id.enc
    -out audit.timestamp.log.gz
gunzip -c audit.timestamp.log.gz > audit.timestamp.log
```

##### Gerenciamento de Espaço de Arquivos de Registro de Auditoria

O arquivo de registro de auditoria tem o potencial de crescer bastante e consumir uma grande quantidade de espaço em disco. Se você está coletando as estatísticas opcionais de tempo e tamanho da consulta, isso aumenta os requisitos de espaço. As estatísticas da consulta são suportadas apenas com o formato JSON.

Para gerenciar o espaço usado, empregue esses métodos:

* Rotação do arquivo de log. Isso envolve rotular o arquivo de log atual renomeando-o, e depois abrindo um novo arquivo de log atual usando o nome original. A rotação pode ser realizada manualmente ou configurada para ocorrer automaticamente.

* Remoção de arquivos de log rotados no formato JSON, se a rotação automática estiver habilitada. A remoção pode ser realizada com base na idade do arquivo de log ou no tamanho combinado do arquivo de log.

Para configurar o gerenciamento de espaço de arquivo de registro de auditoria, use as seguintes variáveis de sistema:

* Se `audit_log_rotate_on_size` for 0 (o padrão), a rotação automática do arquivo de log é desabilitada.

  + Não há rotação, a menos que seja realizada manualmente.
  + Para rotular o arquivo atual, use um dos seguintes métodos:

    - Execute `SELECT audit_log_rotate();` para renomear o arquivo e abrir um novo arquivo de registro de auditoria usando o nome original.

    Com esse método de rotação de arquivo, a remoção de arquivos de log rotados no formato JSON ocorre se `audit_log_max_size` ou `audit_log_prune_seconds` tiver um valor maior que 0.

    - Renomeie manualmente o arquivo, e depois habilite `audit_log_flush` para fechá-lo e abrir um novo arquivo de log atual usando o nome original. Esse método de rotação de arquivo e a variável `audit_log_flush` são desatualizados.

    Com esse método de rotação de arquivo, a remoção de arquivos de log rotados no formato JSON não ocorre; `audit_log_max_size` e `audit_log_prune_seconds` não têm efeito.

    Veja Rotação Manual de Arquivo de Registro de Auditoria, para mais informações.

* Se `audit_log_rotate_on_size` for maior que 0, a rotação automática do arquivo de registro de auditoria é habilitada:

  + A rotação automática ocorre quando uma escrita no arquivo de registro de log atual faz com que seu tamanho exceda o valor de `audit_log_rotate_on_size`, além de sob certas outras condições; veja Rotação Automática do Arquivo de Registro de Auditoria. Quando a rotação automática ocorre, o plugin de registro de auditoria renomeia o arquivo de registro atual e abre um novo arquivo de registro atual usando o nome original.

  + A poda de arquivos de registro de auditoria no formato JSON ocorre se `audit_log_max_size` ou `audit_log_prune_seconds` tiver um valor maior que 0.

  + `audit_log_flush` não tem efeito.

Nota

Para arquivos de registro de auditoria no formato JSON, a rotação também ocorre quando o valor da variável de sistema `audit_log_format_unix_timestamp` é alterado em tempo de execução. No entanto, isso não ocorre por motivos de gerenciamento de espaço, mas sim para que, para um determinado arquivo de registro de auditoria no formato JSON, todos os registros no arquivo incluam ou não o campo `time`.

Nota

Arquivos de registro rotados (renomeados) não são removidos automaticamente. Por exemplo, com a rotação de arquivos de registro baseada no tamanho, os arquivos de registro renomeados têm nomes únicos e acumulam indefinidamente. Eles não rodam para o final da sequência de nomes. Para evitar o uso excessivo de espaço:

* Para arquivos de registro de JSON: Habilite a poda de arquivos de registro conforme descrito na Poda de Arquivos de Registro de Auditoria.
* Caso contrário: Remova arquivos antigos periodicamente, fazendo backup deles primeiro, conforme necessário. Se os arquivos de registro em backup estiverem criptografados, também faça backup das senhas de criptografia correspondentes em um local seguro, caso precise descriptografar os arquivos mais tarde.

As seções a seguir descrevem a rotação e poda de arquivos de registro em detalhes.

* Rotação Manual do Arquivo de Registro de Auditoria
* Rotação Manual do Arquivo de Registro de Auditoria (Método Antigo)")
* Rotação Automática do Arquivo de Registro de Auditoria
* Poda de Arquivos de Registro de Auditoria

###### Rotação Manual do Arquivo de Registro de Auditoria

Se `audit_log_rotate_on_size` for 0 (o padrão), não ocorrerá rotação de log, a menos que seja realizada manualmente.

Para rotular manualmente o arquivo de registro de auditoria, execute `SELECT audit_log_rotate();` para renomear o arquivo de registro de auditoria atual e abrir um novo arquivo de registro de auditoria. Os arquivos são renomeados de acordo com as convenções descritas nas Convenções de Nomenclatura para Arquivos de Registro de Auditoria.

O privilégio `AUDIT_ADMIN` é necessário para usar a função `audit_log_rotate()`.

A gestão do número de arquivos de registro arquivados (os arquivos que foram renomeados) e do espaço que eles ocupam é uma tarefa manual que envolve a remoção de arquivos de registro de auditoria arquivados que não são mais necessários do seu sistema de arquivos.

O conteúdo dos arquivos de registro de auditoria que são renomeados usando a função `audit_log_rotate()` pode ser lido pela função `audit_log_read()`.

###### Rotação Manual do Arquivo de Registro de Auditoria (Método Antigo)

Observação

A variável `audit_log_flush` e este método de rotação de arquivos de registro de auditoria estão desatualizados; o suporte será removido em uma versão futura do MySQL.

Se `audit_log_rotate_on_size` for 0 (o padrão), não ocorrerá rotação de log, a menos que seja realizada manualmente. Neste caso, o plugin de registro de auditoria fecha e reabre o arquivo de log quando o valor de `audit_log_flush` muda de desativado para ativado. A renomeação do arquivo de log deve ser feita externamente ao servidor. Suponha que o nome do arquivo de log seja `audit.log` e que você queira manter os três arquivos de log mais recentes, passando pelos nomes `audit.log.1` a `audit.log.3`. No Unix, realize a rotação manualmente da seguinte forma:

1. A partir da linha de comando, renomeie os arquivos de log atuais:

   ```
   mv audit.log.2 audit.log.3
   mv audit.log.1 audit.log.2
   mv audit.log audit.log.1
   ```

   Essa estratégia sobrescreve o conteúdo do `audit.log.3` atual, limitando o número de arquivos de registro arquivados e o espaço que eles ocupam.

2. Neste ponto, o plugin ainda está escrevendo no arquivo de log atual, que foi renomeado para `audit.log.1`. Conecte-se ao servidor e limpe o arquivo de log para que o plugin o feche e abra um novo arquivo `audit.log`:

   ```
   SET GLOBAL audit_log_flush = ON;
   ```

   `audit_log_flush` é especial porque seu valor permanece `OFF` para que você não precise desabilitá-lo explicitamente antes de habilitá-lo novamente para realizar outro limpe.

Observação

Se a compressão ou criptografia estiverem habilitadas, os nomes dos arquivos de log incluem sufixos que indicam as funcionalidades habilitadas, além de um ID de senha se a criptografia estiver habilitada. Se os nomes dos arquivos incluir um ID de senha, certifique-se de reter o ID no nome de quaisquer arquivos que renomeie manualmente para que o ID de senha a ser usado para operações de descriptografia possa ser determinado.

Observação

Para o registro no formato JSON, renomear manualmente os arquivos de log de auditoria os torna indisponíveis para as funções de leitura de log, pois o plugin de log de auditoria não pode mais determinar que fazem parte da sequência do arquivo de log (consulte a Seção 8.4.6.6, “Leitura de Arquivos de Log de Auditoria”). Considere definir `audit_log_rotate_on_size` maior que 0 para usar a rotação baseada em tamanho.

###### Rotação Automática de Arquivos de Log de Auditoria

Se `audit_log_rotate_on_size` for maior que 0, definir `audit_log_flush` não tem efeito. Em vez disso, sempre que uma escrita no arquivo de log atual faz com que seu tamanho exceda o valor de `audit_log_rotate_on_size`, o plugin de log de auditoria renomeia automaticamente o arquivo de log atual e abre um novo arquivo de log atual usando o nome original.

A rotação baseada em tamanho automática também ocorre nessas condições:

* Durante a inicialização do plugin, se um arquivo com o nome do arquivo de log de auditoria já existir (consulte Convenções de Nomenclatura para Arquivos de Log de Auditoria).

* Durante a finalização do plugin.
* Quando a função `audit_log_encryption_password_set()` for chamada para definir a senha de criptografia, se a criptografia estiver habilitada. (A rotação não ocorre se a criptografia estiver desativada.)

O plugin renomeia o arquivo original inserindo um timestamp logo após seu nome de base. Por exemplo, se o nome do arquivo for `audit.log`, o plugin renomeia-o para um valor como `audit.20210115T140633.log`. O timestamp é um valor UTC no formato `YYYYMMDDThhmmss`. Para registro em XML, o timestamp indica o tempo de rotação. Para registro em JSON, o timestamp é o do último evento escrito no arquivo.

Se os arquivos de log estiverem criptografados, o nome original do arquivo já contém um timestamp indicando o tempo de criação da senha de criptografia (consulte Convenções de Nomenclatura para Arquivos de Log de Auditoria). Nesse caso, o nome do arquivo após a rotação contém dois timestamps. Por exemplo, um arquivo de log criptografado com o nome `audit.log.20210110T130749-1.enc` é renomeado para um valor como `audit.20210115T140633.log.20210110T130749-1.enc`.

###### Remoção de Arquivos de Log de Auditoria

O plugin de log de auditoria suporta a remoção de arquivos de log de auditoria criptografados no formato JSON, se a rotação automática de arquivos de log estiver habilitada. Para usar essa capacidade:

* Defina `audit_log_format` para `JSON`. (Além disso, considere também alterar `audit_log_file`; consulte Selecionando o Formato de Arquivo de Log de Auditoria.)

* Defina `audit_log_rotate_on_size` maior que 0 para especificar o tamanho em bytes em que a rotação automática de arquivos de log ocorre.

* Por padrão, não ocorre remoção de arquivos de log JSON rotados automaticamente. Para habilitar a remoção, defina uma dessas variáveis de sistema para um valor maior que 0:

  + Defina `audit_log_max_size` maior que 0 para especificar o limite em bytes sobre o tamanho combinado de arquivos de log rotados acima do qual os arquivos passam a estar sujeitos à remoção.

Defina `audit_log_prune_seconds` maior que 0 para especificar o número de segundos após os arquivos de log rotados passarem a ser sujeitos à poda.

Valores não nulos de `audit_log_max_size` têm precedência sobre valores não nulos de `audit_log_prune_seconds`. Se ambos forem definidos como maiores que 0 na inicialização do plugin, uma mensagem de aviso é escrita no log de erro do servidor. Se um cliente definir ambos como maiores que 0 durante a execução, uma mensagem de aviso é retornada ao cliente.

Observação

Mensagens de aviso no log de erro são escritas como Notas, que são mensagens de informação. Para garantir que essas mensagens apareçam no log de erro e não sejam descartadas, certifique-se de que a granularidade do registro de erros é suficiente para incluir mensagens de informação. Por exemplo, se você estiver usando a filtragem de log com base na prioridade, conforme descrito na Seção 7.4.2.5, “Filtragem de Log de Auditoria com Base em Prioridade (log_filter_internal”)"), defina a variável de sistema `log_error_verbosity` para um valor de 3.

A poda de arquivos de log no formato JSON, se habilitada, ocorre da seguinte forma:

* Quando a rotação automática ocorre; para as condições sob as quais isso acontece, consulte Rotação Automática de Arquivos de Log de Auditoria.
* Quando a variável de sistema `audit_log_max_size` ou `audit_log_prune_seconds` global é definida durante a execução.

Para a poda com base no tamanho combinado de arquivos de log rotados, se o tamanho combinado for maior que o limite especificado por `audit_log_max_size`, o plugin de log de auditoria remove os arquivos mais antigos até que seu tamanho combinado não exceda o limite.

Para a poda com base na idade do arquivo de registro girado, o ponto de poda é o horário atual menos o valor de `audit_log_prune_seconds`. Em arquivos de registro em formato JSON girados, a parte do timestamp de cada nome de arquivo indica o timestamp do último evento escrito no arquivo. O plugin de log de auditoria usa timestamps de nomes de arquivos para determinar quais arquivos contêm apenas eventos mais antigos que o ponto de poda e os remove.

##### Estratégias de Escrita para Registro de Auditoria

O plugin de log de auditoria pode usar qualquer uma das várias estratégias para gravações de logs. Independentemente da estratégia, a gravação de logs ocorre com esforço máximo, sem garantia de consistência.

Para especificar uma estratégia de escrita, defina a variável de sistema `audit_log_strategy` no início do servidor. Por padrão, o valor da estratégia é `ASYNCHRONOUS` e o plugin grava de forma assíncrona em um buffer, aguardando se o buffer estiver cheio. Você pode instruir o plugin a não aguardar (`PERFORMANCE`) ou a gravar de forma síncrona, usando o cache do sistema de arquivos (`SEMISYNCHRONOUS`) ou forçando a saída com uma chamada `sync()` após cada solicitação de escrita (`SYNCHRONOUS`).

Em muitos casos, o plugin escreve diretamente em um log de auditoria em formato JSON se a consulta atual for muito grande para o buffer. A estratégia de escrita determina como o plugin incrementa o contador de escrita direta. Você pode acompanhar o número de escritas diretas com a variável de status `Audit_log_direct_writes`.

Para a estratégia de escrita assíncrona, a variável de sistema `audit_log_buffer_size` é o tamanho do buffer em bytes. Defina essa variável no início do servidor para alterar o tamanho do buffer. O plugin usa um único buffer, que aloca quando se inicializa e remove quando se termina. O plugin não aloca esse buffer para estratégias de escrita não assíncronas.

A estratégia de registro assíncrono tem essas características:

* Impacto mínimo no desempenho e na escalabilidade do servidor.
* Bloqueio de threads que geram eventos de auditoria por um período o mais curto possível; ou seja, o tempo para alocar o buffer mais o tempo para copiar o evento para o buffer.

* A saída vai para o buffer. Um thread separado lida com as escritas do buffer no arquivo de log.

Com o registro assíncrono, a integridade do arquivo de log pode ser comprometida se ocorrer um problema durante uma escrita no arquivo ou se o plugin não fechar corretamente (por exemplo, no caso de o host do servidor sair inesperadamente). Para reduzir esse risco, defina `audit_log_strategy` para usar o registro síncrono.

A desvantagem da estratégia `PERFORMANCE` é que ela elimina eventos quando o buffer está cheio. Para um servidor com alta carga, o log de auditoria pode ter eventos ausentes.