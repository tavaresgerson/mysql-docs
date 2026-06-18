#### 8.4.5.5 Configurando características de registro de auditoria

Esta seção descreve como configurar as características do registro de auditoria, como o arquivo para o qual o plugin de registro de auditoria escreve os eventos, o formato dos eventos escritos, se deve habilitar a compressão e criptografia do arquivo de log e a gestão de espaço.

- Convenções de Nomenclatura para Arquivos de Registro de Auditoria
- Selecionar o formato do arquivo de registro de auditoria
- Habilitar a Tarefa de Limpeza do Registro de Auditoria
- Adicionar estatísticas de consulta para detecção de outliers
- Compressão de arquivos de registro de auditoria
- Encriptar arquivos de registro de auditoria
- Descompactar e descriptografar manualmente os arquivos do registro de auditoria manualmente
- Criptografia do arquivo de registro de auditoria antes do MySQL 8.0.17
- Gestão de Espaço de Arquivos de Registro de Auditoria
- Escreva estratégias para registro de auditoria

Nota

As capacidades de criptografia descritas aqui se aplicam a partir do MySQL 8.0.17, com exceção da seção que compara as capacidades de criptografia atuais com as capacidades anteriores, mais limitadas; consulte Criptografia de Arquivo de Registro de Auditoria Antes do MySQL 8.0.17.

Para obter informações adicionais sobre as funções e variáveis do sistema que afetam o registro de auditoria, consulte Funções do Registro de Auditoria e Opções e Variáveis do Registro de Auditoria.

O plugin do log de auditoria também pode controlar quais eventos auditados são escritos no arquivo do log de auditoria, com base no conteúdo do evento ou na conta de onde os eventos se originam. Veja a Seção 8.4.5.7, “Filtragem do Log de Auditoria”.

##### Convenções de Nomenclatura para Arquivos de Registro de Auditoria

Para configurar o nome do arquivo de log de auditoria, defina a variável de sistema `audit_log_file` no início do servidor. O nome padrão é `audit.log` no diretório de dados do servidor. Para maior segurança, escreva o log de auditoria em um diretório acessível apenas ao servidor MySQL e aos usuários que tenham uma razão legítima para visualizar o log.

O plugin interpreta o valor `audit_log_file` como composto por um nome de diretório opcional, um nome base e um sufixo opcional. Se a compressão ou criptografia estiverem habilitadas, o nome de arquivo efetivo (o nome realmente usado para criar o arquivo de log) difere do nome de arquivo configurado porque possui sufixos adicionais:

- Se a compressão estiver habilitada, o plugin adiciona um sufixo de `.gz`.

- Se a criptografia estiver habilitada, o plugin adiciona um sufixo de `.pwd_id.enc`, onde `pwd_id` indica a senha de criptografia a ser usada para operações de arquivos de registro. O plugin de log de auditoria armazena senhas de criptografia no chaveiro; veja Criptografando Arquivos de Registro de Auditoria.

O nome efetivo do arquivo de registro de auditoria é o nome resultante da adição de sufixos de compressão e criptografia aplicáveis ao nome do arquivo configurado. Por exemplo, se o valor configurado `audit_log_file` for `audit.log`, o nome efetivo do arquivo é um dos valores mostrados na tabela a seguir.

<table summary="nomes dos arquivos de registro de auditoria para várias combinações das funcionalidades de compressão e criptografia."><thead><tr> <th>Recursos habilitados</th> <th>Nome eficaz do arquivo</th> </tr></thead><tbody><tr> <td>Sem compressão ou criptografia</td> <td>[[<code>audit.log</code>]]</td> </tr><tr> <td>Compressão</td> <td>[[<code>audit.log.gz</code>]]</td> </tr><tr> <td>Criptografia</td> <td>[[<code>audit.log.<em class="replaceable"><code>pwd_id</code>]]</em>.enc</code></td> </tr><tr> <td>Compressão, criptografia</td> <td>[[<code>audit.log.gz.<em class="replaceable"><code>pwd_id</code>]]</em>.enc</code></td> </tr></tbody></table>

`pwd_id` indica o ID da senha usada para criptografar ou descriptografar um arquivo. O formato `pwd_id` é `pwd_timestamp-seq`, onde:

- `pwd_timestamp` é um valor UTC no formato `YYYYMMDDThhmmss` que indica quando a senha foi criada.

- `seq` é um número de sequência. Os números de sequência começam em 1 e aumentam para senhas que têm o mesmo valor de `pwd_timestamp`.

Aqui estão alguns exemplos de valores de ID de senha `pwd_id`:

```
20190403T142359-1
20190403T142400-1
20190403T142400-2
```

Para construir os IDs correspondentes do chaveiro para armazenar senhas no chaveiro, o plugin de log de auditoria adiciona um prefixo de `audit_log-` aos valores `pwd_id`. Para os IDs de senhas de exemplo mostrados, os IDs correspondentes do chaveiro são:

```
audit_log-20190403T142359-1
audit_log-20190403T142400-1
audit_log-20190403T142400-2
```

O ID da senha atualmente usado para criptografia pelo plugin de registro de auditoria é o que tem o maior valor de `pwd_timestamp`. Se várias senhas tiverem esse valor de `pwd_timestamp`, o ID da senha atual é o que tem o maior número de sequência. Por exemplo, no conjunto anterior de IDs de senha, dois deles têm o maior timestamp, `20190403T142400`, então o ID da senha atual é o que tem o maior número de sequência (`2`).

O plugin de registro de auditoria executa certas ações durante a inicialização e término com base no nome efetivo do arquivo de registro de auditoria:

- Durante a inicialização, o plugin verifica se um arquivo com o nome do arquivo de registro de auditoria já existe e renomeia-o, se existir. (Neste caso, o plugin assume que a invocação anterior do servidor saiu inesperadamente com o plugin de registro de auditoria em execução.) O plugin então escreve em um novo arquivo de registro de auditoria vazio.

- Durante a finalização, o plugin renomeia o arquivo de registro de auditoria.

- O renomeamento de arquivos (durante a inicialização ou término do plugin) ocorre de acordo com as regras habituais para rotação automática de arquivos de log baseada no tamanho; veja "Rotação Automática de Arquivos de Registro de Auditoria (Antes do MySQL 8.0.31)".

##### Selecionar o formato do arquivo de registro de auditoria

Para configurar o formato do arquivo de registro de auditoria, defina a variável de sistema `audit_log_format` no início do servidor. Esses formatos estão disponíveis:

- `NEW`: Novo formato XML. Este é o padrão.

- `OLD`: Formato XML antigo.

- `JSON`: Formato JSON. Escreve o log de auditoria como um array JSON. Apenas este formato suporta as estatísticas opcionais de tempo e tamanho da consulta, que estão disponíveis a partir do MySQL 8.0.30.

Para obter detalhes sobre cada formato, consulte a Seção 8.4.5.4, “Formatos de arquivos de registro de auditoria”.

##### Habilitar a Tarefa de Limpeza do Registro de Auditoria

A partir do MySQL 8.0.34, o MySQL Enterprise Audit oferece a capacidade de definir um intervalo de atualização para descartar o cache em memória automaticamente. Uma tarefa de limpeza configurada usando a variável de sistema `audit_log_flush_interval_seconds` tem um valor padrão de zero, o que significa que a tarefa não está agendada para ser executada.

Quando a tarefa é configurada para ser executada (o valor não é zero), o MySQL Enterprise Audit tenta chamar o componente de agendamento na sua inicialização e configurar um esvaziamento regular e recorrente de seu cache de memória:

- Se o registro de auditoria não conseguir encontrar uma implementação do serviço de registro do agendamento, ele não agendará o esvaziamento e continuará carregando.

- O log de auditoria implementa o serviço `dynamic_loader_services_loaded_notification` e escuta por novos registros de `mysql_scheduler` para que o log de auditoria possa registrar sua tarefa agendada no agendador recém-carregado.

- O log de auditoria só se registra na primeira implementação de agendamento carregada.

Da mesma forma, o MySQL Enterprise Audit chama o componente `scheduler` em sua desinicialização e desconfigura o esvaziamento recorrente que ele programou. Ele mantém uma referência ativa ao serviço de registro do agendamento até que a tarefa agendada seja desregistrada, garantindo que o componente `scheduler` não possa ser descarregado enquanto houver tarefas agendadas ativas. Todos os resultados da execução do agendamento e de suas tarefas são escritos no log de erros do servidor.

Para agendar uma tarefa de esvaziamento do log de auditoria:

1. Confirme que o componente `scheduler` está carregado e habilitado. O componente está habilitado (`ON`) por padrão (consulte `component_scheduler.enabled`).

   ```
   SELECT * FROM mysql.components;
   +--------------+--------------------+----------------------------+
   | component_id | component_group_id | component_urn              |
   +--------------+--------------------+----------------------------+
   |            1 |                  1 | file://component_scheduler |
   +--------------+--------------------+----------------------------+
   ```

2. Instale o plugin `audit_log`, se ele ainda não estiver instalado (consulte a Seção 8.4.5.2, “Instalando ou Desinstalando o MySQL Enterprise Audit”).

3. Inicie o servidor usando `audit_log_flush_interval_seconds` e defina o valor para um número maior que 59. O limite superior do valor varia de acordo com a plataforma. Por exemplo, para configurar a tarefa de limpeza para ocorrer a cada dois minutos:

   ```
   $> mysqld --audit_log_flush_interval_seconds=120
   ```

   Para mais informações, consulte a variável de sistema `audit_log_flush_interval_seconds`.

##### Adicionar estatísticas de consulta para detecção de outliers

No MySQL 8.0.30 e versões posteriores, você pode estender os arquivos de log no formato JSON com campos de dados opcionais para mostrar o tempo da consulta, o número de bytes enviados e recebidos, o número de linhas devolvidas ao cliente e o número de linhas examinadas. Esses dados estão disponíveis no log de consultas lentas para consultas qualificadas e, no contexto do log de auditoria, ajudam a detectar valores atípicos para a análise de atividades. Os campos de dados estendidos podem ser adicionados apenas quando o log de auditoria estiver no formato JSON (`audit_log_format=JSON`), que não é a configuração padrão.

As estatísticas da consulta são entregues ao log de auditoria por meio de serviços de componente que você configura como uma função de filtragem de log de auditoria. Os serviços são nomeados `mysql_audit_print_service_longlong_data_source` e `mysql_audit_print_service_double_data_source`. Você pode escolher o tipo de dados para cada item de saída. Para o tempo da consulta, `longlong` exibe o valor em microsegundos e `double` exibe o valor em segundos.

Você adiciona as estatísticas da consulta usando a função `audit_log_filter_set_filter()` do log de auditoria, como o elemento `service` da sintaxe de filtragem JSON, da seguinte forma:

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

Se você quiser parar de coletar as estatísticas da consulta, use a função de registro de auditoria `audit_log_filter_set_filter()` para remover o filtro, por exemplo:

```
SELECT audit_log_filter_remove_filter('QueryStatistics');
```

##### Compressão de arquivos de registro de auditoria

A compactação do arquivo de registro de auditoria pode ser habilitada para qualquer formato de registro.

Para configurar a compressão do arquivo de registro de auditoria, defina a variável de sistema `audit_log_compression` no início do servidor. Os valores permitidos são `NONE` (sem compressão; o padrão) e `GZIP` (compressão GNU Zip).

Se a compressão e a criptografia estiverem ativadas, a compressão ocorrerá antes da criptografia. Para recuperar o arquivo original manualmente, primeiro descifre-o e, em seguida, descomprima-o. Veja Descomprimindo e Descifrando Arquivos de Registro de Auditoria manualmente.

##### Encriptar arquivos de registro de auditoria

A criptografia do arquivo de registro de auditoria pode ser habilitada para qualquer formato de registro. A criptografia é baseada em senhas definidas pelo usuário (com exceção da senha inicial que o plugin de registro de auditoria gera). Para usar esse recurso, o conjunto de chaves MySQL deve estar habilitado, pois o registro de auditoria usa ele para armazenamento de senhas. Qualquer componente ou plugin do conjunto de chaves pode ser usado; para instruções, consulte a Seção 8.4.4, “O Conjunto de Chaves MySQL”.

Para configurar a criptografia do arquivo de registro de auditoria, defina a variável de sistema `audit_log_encryption` no início do servidor. Os valores permitidos são `NONE` (sem criptografia; o padrão) e `AES` (criptografia com cifra AES-256-CBC).

Para definir ou obter uma senha de criptografia em tempo de execução, use essas funções de log de auditoria:

- Para definir a senha de criptografia atual, invoque `audit_log_encryption_password_set()`. Esta função armazena a nova senha no chaveiro. Se a criptografia estiver habilitada, também realiza uma operação de rotação de arquivo de log que renomeia o arquivo de log atual e começa um novo arquivo de log criptografado com a senha. O renomeamento do arquivo ocorre de acordo com as regras usuais para rotação automática de arquivos de log baseada no tamanho; consulte "Rotação Automática de Arquivos de Registro de Auditoria Manual (Antes do MySQL 8.0.31)").

  Se a variável de sistema `audit_log_password_history_keep_days` não for nula, a invocação de `audit_log_encryption_password_set()` também faz com que as senhas de criptografia do log de auditoria arquivado antigas expirem. Para obter informações sobre o histórico das senhas do log de auditoria, incluindo o arquivamento e a expiração das senhas, consulte a descrição dessa variável.

- Para obter a senha de criptografia atual, invoque `audit_log_encryption_password_get()` sem argumento. Para obter uma senha por ID, passe um argumento que especifique o ID do conjunto de chaves da senha atual ou de uma senha arquivada.

  Para determinar quais IDs de chave de registro de log de auditoria existem, consulte a tabela do Schema de desempenho `keyring_keys`:

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

Para obter informações adicionais sobre as funções de criptografia do log de auditoria, consulte Funções de Log de Auditoria.

Quando o plugin de registro de auditoria é inicializado, se ele encontrar que o criptografamento do arquivo de log está habilitado, ele verifica se o conjunto de chaves contém uma senha de criptografia do registro de auditoria. Se não, o plugin gera automaticamente uma senha de criptografia inicial aleatória e a armazena no conjunto de chaves. Para descobrir essa senha, invoque `audit_log_encryption_password_get()`.

Se a compressão e a criptografia estiverem ativadas, a compressão ocorrerá antes da criptografia. Para recuperar o arquivo original manualmente, primeiro descifre-o e, em seguida, descomprima-o. Veja Descomprimindo e Descifrando Arquivos de Registro de Auditoria manualmente.

##### Descompactar e descriptografar manualmente os arquivos do registro de auditoria manualmente

Os arquivos de registro de auditoria podem ser descompactados e descriptografados usando ferramentas padrão. Isso deve ser feito apenas para arquivos de registro que tenham sido fechados (arquivos de arquivo) e não estejam mais em uso, e não para o arquivo de registro que o plugin de log de auditoria está escrevendo atualmente. Você pode reconhecer os arquivos de registro arquivados porque eles foram renomeados pelo plugin de log de auditoria para incluir um timestamp no nome do arquivo logo após o nome base.

Para essa discussão, vamos assumir que `audit_log_file` está definido como `audit.log`. Nesse caso, um arquivo de registro de auditoria arquivado tem um dos nomes mostrados na tabela a seguir.

<table summary="O arquivo de registro de auditoria arquivou os nomes dos arquivos para várias combinações das características de compressão e criptografia."><thead><tr> <th>Recursos habilitados</th> <th>Nome do arquivo arquivado</th> </tr></thead><tbody><tr> <td>Sem compressão ou criptografia</td> <td>[[<code>audit.<em class="replaceable"><code>timestamp</code>]]</em>.log</code></td> </tr><tr> <td>Compressão</td> <td>[[<code>audit.<em class="replaceable"><code>timestamp</code>]]</em>.log.gz</code></td> </tr><tr> <td>Criptografia</td> <td>[[<code>audit.<em class="replaceable"><code>timestamp</code>]]</em>.log.<em class="replaceable">[[<code>pwd_id</code>]]</em>.enc</code></td> </tr><tr> <td>Compressão, criptografia</td> <td>[[<code>audit.<em class="replaceable"><code>timestamp</code>]]</em>.log.gz.<em class="replaceable">[[<code>pwd_id</code>]]</em>.enc</code></td> </tr></tbody></table>

Como discutido nas Convenções de Nomenclatura para Arquivos de Registro de Auditoria, o formato `pwd_id` é `pwd_timestamp-seq`. Assim, os nomes dos arquivos de registro criptografados arquivados realmente contêm dois timestamps. O primeiro indica o tempo de rotação do arquivo, e o segundo indica quando a senha de criptografia foi criada.

Considere o seguinte conjunto de nomes de arquivos de registro criptografados arquivados:

```
audit.20190410T205827.log.20190403T185337-1.enc
audit.20190410T210243.log.20190403T185337-1.enc
audit.20190415T145309.log.20190414T223342-1.enc
audit.20190415T151322.log.20190414T223342-2.enc
```

Cada nome de arquivo tem um timestamp de hora de rotação único. Em contraste, os timestamps das senhas não são únicos:

- Os dois primeiros arquivos têm o mesmo ID de senha e número de sequência (`20190403T185337-1`). Eles têm a mesma senha de criptografia.

- Os dois últimos arquivos têm o mesmo ID de senha (`20190414T223342`) mas números de sequência diferentes (`1`, `2`). Esses arquivos têm senhas de criptografia diferentes.

Para descomprimir um arquivo de log compactado manualmente, use **gunzip**, **gzip -d** ou um comando equivalente. Por exemplo:

```
gunzip -c audit.timestamp.log.gz > audit.timestamp.log
```

Para descriptografar um arquivo de registro criptografado manualmente, use o comando **openssl**. Por exemplo:

```
openssl enc -d -aes-256-cbc -pass pass:password -md sha256
    -in audit.timestamp.log.pwd_id.enc
    -out audit.timestamp.log
```

Para executar esse comando, você deve obter `password`, a senha de criptografia. Para fazer isso, use `audit_log_encryption_password_get()`. Por exemplo, se o nome do arquivo de log de auditoria for `audit.20190415T151322.log.20190414T223342-2.enc`, o ID da senha é `20190414T223342-2` e o ID do conjunto de chaves é `audit-log-20190414T223342-2`. Retorne a senha do conjunto de chaves da seguinte maneira:

```
SELECT audit_log_encryption_password_get('audit-log-20190414T223342-2');
```

Se a compressão e a criptografia estiverem habilitadas para o registro de auditoria, a compressão ocorrerá antes da criptografia. Nesse caso, o nome do arquivo terá os sufixos `.gz` e `.pwd_id.enc` adicionados, correspondendo à ordem em que essas operações ocorrem. Para recuperar o arquivo original manualmente, realize as operações em ordem inversa. Ou seja, primeiro decifre o arquivo e, em seguida, descomprima-o:

```
openssl enc -d -aes-256-cbc -pass pass:password -md sha256
    -in audit.timestamp.log.gz.pwd_id.enc
    -out audit.timestamp.log.gz
gunzip -c audit.timestamp.log.gz > audit.timestamp.log
```

##### Criptografia do arquivo de registro de auditoria antes do MySQL 8.0.17

Esta seção abrange as diferenças nas capacidades de criptografia de arquivos de registro de auditoria anteriores e a partir do MySQL 8.0.17, que é quando o histórico de senhas foi implementado (o que inclui arquivamento e expiração de senhas). Também indica como o plugin de registro de auditoria lida com atualizações para o MySQL 8.0.17 ou superior a partir de versões inferiores a 8.0.17.

<table summary="Comparação da criptografia do log de auditoria antes e a partir do MySQL 8.0.17."><thead><tr> <th scope="col">Característica</th> <th scope="col">Antes do MySQL 8.0.17</th> <th scope="col">A partir do MySQL 8.0.17</th> </tr></thead><tbody><tr> <th>Número de senhas</th> <td>Apenas senha única</td> <td>Permitidas múltiplas senhas</td> </tr><tr> <th>Nomes de arquivos de registro criptografados</th> <td>Sufixo [[<code>.enc</code>]]</td> <td>[[<code>.<em class="replaceable"><code>pwd_id</code>]]</em>.enc</code>sufixo</td> </tr><tr> <th>Chaveiro de identificação com senha</th> <td>[[<code>audit_log</code>]]</td> <td>[[<code>audit_log-<em class="replaceable"><code>pwd_id</code>]]</em></code></td> </tr><tr> <th>Histórico de senhas</th> <td>Não</td> <td>Sim</td> </tr></tbody></table>

Antes do MySQL 8.0.17, não há histórico de senhas, então definir uma nova senha torna a senha antiga inacessível, impedindo que o MySQL Enterprise Audit leia os arquivos de log criptografados com a senha antiga. Se você antecipar a necessidade de descriptografar esses arquivos manualmente, você deve manter um registro das senhas anteriores.

Se o arquivo de registro de auditoria estiver criptografado quando você atualizar para o MySQL 8.0.17 ou uma versão superior a partir de uma versão anterior, o plugin de registro de auditoria executa essas ações de atualização:

- Durante a inicialização do plugin, o plugin verifica uma senha de criptografia com um ID de chave de segurança de `audit_log`. Se encontrar uma, o plugin duplica a senha usando um ID de chave de segurança no formato `audit_log-pwd_id` e usa-a como a senha de criptografia atual. (Para detalhes sobre a sintaxe de `pwd_id`, consulte Convenções de Nomenclatura para Arquivos de Registro de Auditoria.)

- Os arquivos de registro criptografados existentes têm um sufixo de `.enc`. O plugin não renomeia esses arquivos para ter um sufixo de `.pwd_id.enc`, mas pode lê-los desde que a chave com o ID de `audit_log` permaneça no conjunto de chaves.

- Quando a limpeza de senhas ocorre, se o plugin expira qualquer senha com um ID de chave de segurança no formato `audit_log-pwd_id`, ele também expira a senha com um ID de chave de segurança de `audit_log`, se existir. (Neste ponto, os arquivos de registro criptografados que têm um sufixo de `.enc` em vez de `.pwd_id.enc` tornam-se ilegíveis pelo plugin, então assume-se que você não os precisa mais.)

##### Gestão de Espaço de Arquivos de Registro de Auditoria

O arquivo de registro de auditoria pode crescer bastante e consumir um grande espaço em disco. Se você estiver coletando as estatísticas de tempo e tamanho de consulta opcionais, que estão disponíveis a partir do MySQL 8.0.30, isso aumenta os requisitos de espaço. As estatísticas de consulta são suportadas apenas com o formato JSON.

Para gerenciar o espaço utilizado, utilize esses métodos:

- Rotação do arquivo de registro. Isso envolve a rotação do arquivo de registro atual renomeando-o e, em seguida, abrindo um novo arquivo de registro atual usando o nome original. A rotação pode ser realizada manualmente ou configurada para ocorrer automaticamente.

- A poda de arquivos de log no formato JSON rotados, se a rotação automática estiver habilitada. A poda pode ser realizada com base na idade do arquivo de log (a partir do MySQL 8.0.24) ou no tamanho combinado do arquivo de log (a partir do MySQL 8.0.26).

Para configurar a gestão do espaço do arquivo de registro de auditoria, use as seguintes variáveis de sistema:

- Se `audit_log_rotate_on_size` for 0 (o padrão), a rotação automática do arquivo de registro será desativada.

  - Não há rotação a menos que seja realizada manualmente.
  - Para rotear o arquivo atual, use um dos seguintes métodos:

    - Antes do MySQL 8.0.31, renomeie manualmente o arquivo, depois habilite `audit_log_flush` para fechá-lo e abrir um novo arquivo de log atual usando o nome original. Esse método de rotação de arquivos e a variável `audit_log_flush` são desaconselhados no MySQL 8.0.31.

      Com esse método de rotação de arquivos, a poda de arquivos de log no formato JSON rotado não ocorre; `audit_log_max_size` e `audit_log_prune_seconds` não têm efeito.

    - A partir do MySQL 8.0.31, execute `SELECT audit_log_rotate();` para renomear o arquivo e abrir um novo arquivo de registro de auditoria usando o nome original.

      Com esse método de rotação de arquivos, a poda dos arquivos de log no formato JSON rotado ocorre se `audit_log_max_size` ou `audit_log_prune_seconds` tiver um valor maior que 0.

    Veja o arquivo de registro de auditoria manual (antes do MySQL 8.0.31) ”.

- Se `audit_log_rotate_on_size` for maior que 0, o registro de auditoria de arquivo de rotação automática está habilitado:

  - A rotação automática ocorre quando uma escrita no arquivo de registro atual faz com que seu tamanho exceda o valor `audit_log_rotate_on_size`, além de sob certas outras condições; veja Rotação Automática do Arquivo de Registro de Auditoria. Quando a rotação automática ocorre, o plugin de registro de auditoria renomeia o arquivo de registro atual e abre um novo arquivo de registro atual usando o nome original.

  - A poda dos arquivos de registro no formato JSON rotado ocorre se `audit_log_max_size` ou `audit_log_prune_seconds` tiver um valor maior que 0.

  - `audit_log_flush` não tem efeito.

Nota

Para os arquivos de log no formato JSON, a rotação também ocorre quando o valor da variável de sistema `audit_log_format_unix_timestamp` é alterado em tempo de execução. No entanto, isso não ocorre por motivos de gerenciamento de espaço, mas sim para que, para um arquivo de log no formato JSON específico, todos os registros no arquivo incluam ou não o campo `time`.

Nota

Os arquivos de registro rotados (renomeados) não são removidos automaticamente. Por exemplo, com a rotação de arquivos de registro baseada no tamanho, os arquivos de registro renomeados têm nomes únicos e acumulam indefinidamente. Eles não rodam para o final da sequência de nomes. Para evitar o uso excessivo de espaço:

- A partir do MySQL 8.0.24 (para arquivos de log no formato JSON): Habilitar o descarte de arquivos de log conforme descrito na Remoção de arquivos de registro de auditoria.

- Caso contrário (para arquivos que não são JSON ou antes do MySQL 8.0.24 para todos os formatos de log): Remova arquivos antigos periodicamente, fazendo uma cópia de segurança deles primeiro, se necessário. Se os arquivos de log de cópia de segurança estiverem criptografados, também faça uma cópia de segurança das senhas de criptografia correspondentes em um local seguro, caso você precise descriptografar os arquivos mais tarde.

As seções a seguir descrevem a rotação e a poda de arquivos de registro com mais detalhes.

- Rotacionar o arquivo de registro de auditoria manual (antes do MySQL 8.0.31)")
- Rotacionar o arquivo de registro de auditoria manual (a partir do MySQL 8.0.31)
- Rotacionamento automático do arquivo de registro de auditoria
- A poda do arquivo de registro de auditoria

###### Rotulagem manual do arquivo de registro de auditoria (antes do MySQL 8.0.31)

Nota

A partir do MySQL 8.0.31, a variável `audit_log_flush` e este método de rotação do arquivo de registro de auditoria estão desatualizados; espera-se que o suporte seja removido em uma versão futura do MySQL.

Se `audit_log_rotate_on_size` for 0 (o padrão), não ocorrerá rotação de log, a menos que seja realizada manualmente. Nesse caso, o plugin de log de auditoria fecha e reabre o arquivo de log quando o valor `audit_log_flush` muda de desativado para ativado. A renomeação do arquivo de log deve ser feita externamente ao servidor. Suponha que o nome do arquivo de log seja `audit.log` e que você queira manter os três arquivos de log mais recentes, alternando entre os nomes `audit.log.1` até `audit.log.3`. No Unix, realize a rotação manualmente da seguinte maneira:

1. Do prompt de comando, renomeie os arquivos de log atuais:

   ```
   mv audit.log.2 audit.log.3
   mv audit.log.1 audit.log.2
   mv audit.log audit.log.1
   ```

   Essa estratégia sobrescreve o conteúdo atual do `audit.log.3`, estabelecendo um limite para o número de arquivos de registro arquivados e o espaço que eles utilizam.

2. Neste ponto, o plugin ainda está escrevendo no arquivo de log atual, que foi renomeado para `audit.log.1`. Conecte-se ao servidor e limpe o arquivo de log para que o plugin o feche e abra um novo arquivo `audit.log`:

   ```
   SET GLOBAL audit_log_flush = ON;
   ```

   O `audit_log_flush` é especial porque seu valor permanece `OFF` para que você não precise desativá-lo explicitamente antes de ativá-lo novamente para realizar outro esvaziamento.

Nota

Se a compressão ou criptografia estiverem ativadas, os nomes dos arquivos de registro incluem sufixos que indicam as funcionalidades ativadas, além de um ID de senha se a criptografia estiver habilitada. Se os nomes dos arquivos incluir um ID de senha, certifique-se de manter o ID no nome de quaisquer arquivos que você renomear manualmente, para que o ID de senha que será usado para as operações de descriptografia possa ser determinado.

Nota

Para o registro no formato JSON, renomear manualmente os arquivos de registro de auditoria os torna indisponíveis para as funções de leitura de registro, pois o plugin de registro de auditoria não consegue mais determinar que fazem parte da sequência do arquivo de registro (consulte a Seção 8.4.5.6, “Leitura de Arquivos de Registro de Auditoria”). Considere definir `audit_log_rotate_on_size` maior que 0 para usar a rotação baseada no tamanho.

###### Rotacionamento manual do arquivo de registro de auditoria (a partir do MySQL 8.0.31)

Se `audit_log_rotate_on_size` for 0 (o padrão), não ocorrerá rotação de log, a menos que seja realizada manualmente.

Para rotular manualmente o arquivo de registro de auditoria, execute `SELECT audit_log_rotate();` para renomear o arquivo de registro de auditoria atual e abrir um novo arquivo de registro de auditoria. Os arquivos são renomeados de acordo com as convenções descritas nas Convenções de Nomenclatura para Arquivos de Registro de Auditoria.

O privilégio `AUDIT_ADMIN` é necessário para usar a função `audit_log_rotate()`.

Gerenciar o número de arquivos de registro arquivados (os arquivos que foram renomeados) e o espaço que eles ocupam é uma tarefa manual que envolve a remoção de arquivos de registro de auditoria arquivados que não são mais necessários do seu sistema de arquivos.

O conteúdo dos arquivos de registro de auditoria que são renomeados usando a função `audit_log_rotate()` pode ser lido pela função `audit_log_read()`.

###### Rotacionamento automático do arquivo de registro de auditoria

Se `audit_log_rotate_on_size` for maior que 0, definir `audit_log_flush` não terá efeito. Em vez disso, sempre que uma escrita no arquivo de log atual fizer com que seu tamanho exceda o valor de `audit_log_rotate_on_size`, o plugin de log de auditoria renomeia automaticamente o arquivo de log atual e abre um novo arquivo de log atual usando o nome original.

A rotação automática baseada no tamanho também ocorre nessas condições:

- Durante a inicialização do plugin, se um arquivo com o nome do arquivo de registro de auditoria já existir (consulte Convenções de Nomenclatura para Arquivos de Registro de Auditoria).

- Durante a finalização do plugin.

- Quando a função `audit_log_encryption_password_set()` é chamada para definir a senha de criptografia, se a criptografia estiver habilitada. (A rotação não ocorre se a criptografia estiver desativada.)

O plugin renomeia o arquivo original inserindo um timestamp logo após seu nome de base. Por exemplo, se o nome do arquivo for `audit.log`, o plugin renomeia-o para um valor como `audit.20210115T140633.log`. O timestamp é um valor UTC no formato `YYYYMMDDThhmmss`. Para registro em XML, o timestamp indica o tempo de rotação. Para registro em JSON, o timestamp é o do último evento escrito no arquivo.

Se os arquivos de registro estiverem criptografados, o nome original do arquivo já contém um timestamp indicando o tempo de criação da senha de criptografia (consulte as convenções de nomenclatura para arquivos de registro de auditoria). Nesse caso, o nome do arquivo após a rotação contém dois timestamps. Por exemplo, um arquivo de registro criptografado com o nome `audit.log.20210110T130749-1.enc` é renomeado para um valor como `audit.20210115T140633.log.20210110T130749-1.enc`.

###### A poda do arquivo de registro de auditoria

O plugin de registro de auditoria suporta a poda de arquivos de registro de auditoria em formato JSON rotados, se a rotação automática de arquivos de registro estiver habilitada. Para usar essa capacidade:

- Defina `audit_log_format` para `JSON`. (Além disso, considere também alterar `audit_log_file`; veja Selecionando o formato do arquivo de registro de auditoria.)

- Defina `audit_log_rotate_on_size` maior que 0 para especificar o tamanho em bytes em que a rotação automática do arquivo de log ocorre.

- Por padrão, não há poda de arquivos de log no formato JSON rotados automaticamente. Para habilitar a poda, defina uma dessas variáveis de sistema para um valor maior que 0:

  - Defina `audit_log_max_size` maior que 0 para especificar o limite em bytes no tamanho combinado dos arquivos de registro rotados, acima do qual os arquivos passam a ser sujeitos à poda. `audit_log_max_size` está disponível a partir do MySQL 8.0.26.

  - Defina `audit_log_prune_seconds` maior que 0 para especificar o número de segundos após os arquivos de log rotados passarem a ser sujeitos à poda. `audit_log_prune_seconds` está disponível a partir do MySQL 8.0.24.

  Valores não nulos de `audit_log_max_size` têm precedência sobre valores não nulos de `audit_log_prune_seconds`. Se ambos forem definidos como maiores que 0 na inicialização do plugin, um aviso é escrito no log de erro do servidor. Se um cliente definir ambos como maiores que 0 durante a execução, um aviso é retornado ao cliente.

  Nota

  As advertências para o log de erros são escritas como Notas, que são mensagens de informação. Para garantir que essas mensagens apareçam no log de erros e não sejam descartadas, certifique-se de que a granularidade do registro de erros seja suficiente para incluir mensagens de informação. Por exemplo, se você estiver usando a filtragem de log baseada em prioridade, conforme descrito na Seção 7.4.2.5, “Filtragem de Log de Erros Baseada em Prioridade (log\_filter\_internal)”, defina a variável de sistema `log_error_verbosity` para um valor de 3.

A poda dos arquivos de registro no formato JSON, se habilitada, ocorre da seguinte forma:

- Quando a rotação automática ocorre; para as condições sob as quais isso acontece, consulte Rotação automática do arquivo de registro de auditoria.

- Quando a variável de sistema global `audit_log_max_size` ou `audit_log_prune_seconds` é definida em tempo de execução.

Para a poda baseada no tamanho combinado do arquivo de registro rotado, se o tamanho combinado for maior que o limite especificado por `audit_log_max_size`, o plugin de registro de auditoria remove os arquivos mais antigos até que seu tamanho combinado não exceda o limite.

Para a poda baseada na idade do arquivo de registro rotado, o ponto de poda é o horário atual menos o valor de `audit_log_prune_seconds`. Em arquivos de registro em formato JSON rotados, a parte do timestamp de cada nome de arquivo indica o timestamp do último evento escrito no arquivo. O plugin de log de auditoria usa timestamps de nomes de arquivos para determinar quais arquivos contêm apenas eventos mais antigos que o ponto de poda e os remove.

##### Escreva estratégias para registro de auditoria

O plugin de registro de auditoria pode usar qualquer uma das várias estratégias para gravações de log. Independentemente da estratégia, o registro ocorre com esforço máximo, sem garantia de consistência.

Para especificar uma estratégia de escrita, defina a variável de sistema `audit_log_strategy` no início do servidor. Por padrão, o valor da estratégia é `ASYNCHRONOUS` e o plugin grava as informações de forma assíncrona em um buffer, aguardando se o buffer estiver cheio. Você pode instruir o plugin a não aguardar (`PERFORMANCE`) ou a gravar as informações de forma síncrona, usando o cache do sistema de arquivos (`SEMISYNCHRONOUS`) ou forçando a saída com uma chamada `sync()` após cada solicitação de escrita (`SYNCHRONOUS`).

Para a estratégia de escrita assíncrona, a variável de sistema `audit_log_buffer_size` é o tamanho do buffer em bytes. Defina essa variável no início do servidor para alterar o tamanho do buffer. O plugin usa um único buffer, que ele aloca ao inicializar e remove ao finalizar. O plugin não aloca esse buffer para estratégias de escrita não assíncronas.

A estratégia de registro assíncrono tem essas características:

- Impacto mínimo no desempenho e na escalabilidade do servidor.

- Bloqueio de threads que geram eventos de auditoria por um período o mais curto possível; ou seja, tempo para alocar o buffer mais tempo para copiar o evento para o buffer.

- A saída vai para o buffer. Um fio separado lida com as escritas do buffer no arquivo de log.

Com o registro assíncrono, a integridade do arquivo de registro pode ser comprometida se um problema ocorrer durante uma gravação no arquivo ou se o plugin não fechar corretamente (por exemplo, caso o host do servidor saia inesperadamente). Para reduzir esse risco, configure `audit_log_strategy` para usar o registro síncrono.

Uma desvantagem da estratégia `PERFORMANCE` é que ela exclui eventos quando o buffer está cheio. Para um servidor com alta carga, o log de auditoria pode ter eventos faltando.
