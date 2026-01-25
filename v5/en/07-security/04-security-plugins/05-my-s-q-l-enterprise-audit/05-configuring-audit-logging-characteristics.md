#### 6.4.5.5 Configurando Características do Logging de Auditoria

Esta seção descreve como configurar as características do logging de auditoria, como o arquivo para o qual o plugin de log de auditoria escreve eventos, o formato dos eventos escritos, se deve habilitar a compressão e criptografia do arquivo de log, e o gerenciamento de espaço.

* [Convenções de Nomenclatura para Arquivos de Log de Auditoria](audit-log-logging-configuration.html#audit-log-file-name "Convenções de Nomenclatura para Arquivos de Log de Auditoria")
* [Selecionando o Formato do Arquivo de Log de Auditoria](audit-log-logging-configuration.html#audit-log-file-format "Selecionando o Formato do Arquivo de Log de Auditoria")
* [Comprimindo Arquivos de Log de Auditoria](audit-log-logging-configuration.html#audit-log-file-compression "Comprimindo Arquivos de Log de Auditoria")
* [Criptografando Arquivos de Log de Auditoria](audit-log-logging-configuration.html#audit-log-file-encryption "Criptografando Arquivos de Log de Auditoria")
* [Descomprimindo e Descriptografando Manualmente Arquivos de Log de Auditoria](audit-log-logging-configuration.html#audit-log-file-uncompression-decryption "Descomprimindo e Descriptografando Manualmente Arquivos de Log de Auditoria")
* [Gerenciamento de Espaço de Arquivos de Log de Auditoria](audit-log-logging-configuration.html#audit-log-space-management "Gerenciamento de Espaço de Arquivos de Log de Auditoria")
* [Estratégias de Escrita para Logging de Auditoria](audit-log-logging-configuration.html#audit-log-strategy "Estratégias de Escrita para Logging de Auditoria")

Para informações adicionais sobre as funções e variáveis de sistema que afetam o logging de auditoria, consulte [Funções do Log de Auditoria](audit-log-reference.html#audit-log-routines "Audit Log Functions") e [Opções e Variáveis do Log de Auditoria](audit-log-reference.html#audit-log-options-variables "Audit Log Options and Variables").

O plugin de log de auditoria também pode controlar quais eventos auditados são escritos no arquivo de log de auditoria, com base no conteúdo do evento ou na conta de origem dos eventos. Consulte [Seção 6.4.5.7, “Filtragem do Log de Auditoria”](audit-log-filtering.html "6.4.5.7 Audit Log Filtering").

##### Convenções de Nomenclatura para Arquivos de Log de Auditoria

Para configurar o nome do arquivo de log de auditoria, defina a variável de sistema [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file) na inicialização do servidor. O nome padrão é `audit.log` no diretório de dados do servidor. Para melhor segurança, escreva o log de auditoria em um diretório acessível apenas ao MySQL Server e a usuários com um motivo legítimo para visualizar o log.

A partir do MySQL 5.7.21, o plugin interpreta o valor de [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file) como composto por um nome de diretório inicial opcional, um nome base e um sufixo opcional. Se a compressão ou criptografia estiverem habilitadas, o nome efetivo do arquivo (o nome realmente usado para criar o arquivo de log) difere do nome configurado porque possui sufixos adicionais:

* Se a compressão estiver habilitada, o plugin adiciona o sufixo `.gz`.

* Se a criptografia estiver habilitada, o plugin adiciona o sufixo `.enc`. O plugin de log de auditoria armazena a senha de criptografia no Keyring (consulte [Criptografando Arquivos de Log de Auditoria](audit-log-logging-configuration.html#audit-log-file-encryption "Encrypting Audit Log Files").

O nome efetivo do arquivo de log de auditoria é o nome resultante da adição dos sufixos de compressão e criptografia aplicáveis ao nome do arquivo configurado. Por exemplo, se o valor configurado de [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file) for `audit.log`, o nome efetivo do arquivo é um dos valores mostrados na tabela a seguir.

<table summary="Nomes de arquivo efetivos de audit_log para várias combinações de recursos de compressão e criptografia."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Recursos Habilitados</th> <th>Nome Efetivo do Arquivo</th> </tr></thead><tbody><tr> <td>Sem compressão ou criptografia</td> <td><code>audit.log</code></td> </tr><tr> <td>Compressão</td> <td><code>audit.log.gz</code></td> </tr><tr> <td>Criptografia</td> <td><code>audit.log.enc</code></td> </tr><tr> <td>Compressão, criptografia</td> <td><code>audit.log.gz.enc</code></td> </tr> </tbody></table>

Antes do MySQL 5.7.21, os nomes dos arquivos de log configurados e efetivos são os mesmos. Por exemplo, se o valor configurado de [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file) for `audit.log`, o plugin de log de auditoria escreve em `audit.log`.

O plugin de log de auditoria executa certas ações durante a inicialização e o encerramento com base no nome efetivo do arquivo de log de auditoria:

A partir do MySQL 5.7.21:

* Durante a inicialização, o plugin verifica se um arquivo com o nome do arquivo de log de auditoria já existe e o renomeia se for o caso. (Neste caso, o plugin assume que a invocação anterior do servidor foi encerrada inesperadamente com o plugin de log de auditoria em execução.) O plugin então escreve em um novo arquivo de log de auditoria vazio.

* Durante o encerramento, o plugin renomeia o arquivo de log de auditoria.
* A renomeação de arquivo (seja durante a inicialização ou encerramento do plugin) ocorre de acordo com as regras usuais para a rotação automática de arquivos de log com base no tamanho; consulte [Rotação Manual do Arquivo de Log de Auditoria](audit-log-logging-configuration.html#audit-log-manual-rotation "Manual Audit Log File Rotation").

Antes do MySQL 5.7.21, apenas os formatos de log XML estavam disponíveis, e o plugin realiza uma verificação de integridade rudimentar:

* Durante a inicialização, o plugin verifica se o arquivo termina com uma tag `</AUDIT>` e trunca a tag antes de escrever quaisquer elementos `<AUDIT_RECORD>`. Se o arquivo de log existir, mas não terminar com `</AUDIT>` ou se a tag `</AUDIT>` não puder ser truncada, o plugin considera o arquivo malformado e o renomeia. (Essa renomeação pode ocorrer se o servidor for encerrado inesperadamente com o plugin de log de auditoria em execução.) O plugin então escreve em um novo arquivo de log de auditoria vazio.

* No encerramento, não ocorre renomeação de arquivo.
* Quando a renomeação ocorre na inicialização do plugin, o arquivo renomeado tem `.corrupted`, um timestamp e `.xml` adicionados ao final. Por exemplo, se o nome do arquivo for `audit.log`, o plugin o renomeia para um valor como `audit.log.corrupted.15081807937726520.xml`. O valor do timestamp é semelhante a um Unix timestamp, com os últimos 7 dígitos representando a parte fracionária do segundo. Para obter informações sobre a interpretação do timestamp, consulte [Gerenciamento de Espaço de Arquivos de Log de Auditoria](audit-log-logging-configuration.html#audit-log-space-management "Space Management of Audit Log Files").

##### Selecionando o Formato do Arquivo de Log de Auditoria

Para configurar o formato do arquivo de log de auditoria, defina a variável de sistema [`audit_log_format`](audit-log-reference.html#sysvar_audit_log_format) na inicialização do servidor. Estes formatos estão disponíveis:

* `NEW`: Novo formato XML. Este é o padrão.

* `OLD`: Formato XML antigo.
* `JSON`: Formato JSON.

Para detalhes sobre cada formato, consulte [Seção 6.4.5.4, “Formatos de Arquivo de Log de Auditoria”](audit-log-file-formats.html "6.4.5.4 Audit Log File Formats").

Se você alterar [`audit_log_format`](audit-log-reference.html#sysvar_audit_log_format), é recomendável que você também altere [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file). Por exemplo, se você definir [`audit_log_format`](audit-log-reference.html#sysvar_audit_log_format) como `JSON`, defina [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file) como `audit.json`. Caso contrário, arquivos de log mais recentes terão um formato diferente dos arquivos mais antigos, mas todos terão o mesmo nome base sem nada para indicar quando o formato mudou.

Note

Antes do MySQL 5.7.21, alterar o valor de [`audit_log_format`](audit-log-reference.html#sysvar_audit_log_format) pode resultar na escrita de entradas de log em um formato em um arquivo de log existente que contém entradas em um formato diferente. Para evitar esse problema, use o seguinte procedimento:

1. Pare o servidor.
2. Altere o valor da variável de sistema [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file) para que o plugin escreva em um arquivo diferente, ou renomeie o arquivo de log de auditoria atual manualmente.

3. Reinicie o servidor com o novo valor de [`audit_log_format`](audit-log-reference.html#sysvar_audit_log_format). O plugin de log de auditoria cria um novo arquivo de log e escreve entradas nele no formato selecionado.

##### Comprimindo Arquivos de Log de Auditoria

A compressão de arquivos de log de auditoria está disponível a partir do MySQL 5.7.21. A compressão pode ser habilitada para qualquer formato de log.

Para configurar a compressão do arquivo de log de auditoria, defina a variável de sistema [`audit_log_compression`](audit-log-reference.html#sysvar_audit_log_compression) na inicialização do servidor. Os valores permitidos são `NONE` (sem compressão; o padrão) e `GZIP` (compressão GNU Zip).

Se tanto a compressão quanto a criptografia estiverem habilitadas, a compressão ocorre antes da criptografia. Para recuperar o arquivo original manualmente, primeiro descriptografe-o e depois descomprima-o. Consulte [Descomprimindo e Descriptografando Manualmente Arquivos de Log de Auditoria](audit-log-logging-configuration.html#audit-log-file-uncompression-decryption "Manually Uncompressing and Decrypting Audit Log Files").

##### Criptografando Arquivos de Log de Auditoria

A criptografia de arquivos de log de auditoria está disponível a partir do MySQL 5.7.21. A criptografia pode ser habilitada para qualquer formato de log. A criptografia é baseada em uma senha definida pelo usuário (com exceção da senha inicial, que é gerada pelo plugin de log de auditoria). Para usar esse recurso, o Keyring do MySQL deve estar habilitado, pois o logging de auditoria o utiliza para armazenamento de senhas. Qualquer plugin Keyring pode ser usado; para instruções, consulte [Seção 6.4.4, “O Keyring do MySQL”](keyring.html "6.4.4 The MySQL Keyring").

Para configurar a criptografia do arquivo de log de auditoria, defina a variável de sistema [`audit_log_encryption`](audit-log-reference.html#sysvar_audit_log_encryption) na inicialização do servidor. Os valores permitidos são `NONE` (sem criptografia; o padrão) e `AES` (criptografia de cifra AES-256-CBC).

Para definir ou obter uma senha de criptografia em tempo de execução, use estas funções de log de auditoria:

* Para definir a senha de criptografia atual, invoque [`audit_log_encryption_password_set()`](audit-log-reference.html#function_audit-log-encryption-password-set). Esta função armazena a nova senha no Keyring. Se a criptografia estiver habilitada, ela também executa uma operação de rotação do arquivo de log que renomeia o arquivo de log atual e inicia um novo arquivo de log criptografado com a senha. A renomeação do arquivo ocorre de acordo com as regras usuais para a rotação automática de arquivos de log com base no tamanho; consulte [Rotação Manual do Arquivo de Log de Auditoria](audit-log-logging-configuration.html#audit-log-manual-rotation "Manual Audit Log File Rotation").

  Arquivos de log de auditoria escritos anteriormente não são recriptografados com a nova senha. Mantenha um registro da senha anterior caso precise descriptografar esses arquivos manualmente.

* Para obter a senha de criptografia atual, invoque [`audit_log_encryption_password_get()`](audit-log-reference.html#function_audit-log-encryption-password-get), que recupera a senha do Keyring.

Para informações adicionais sobre as funções de criptografia do log de auditoria, consulte [Funções do Log de Auditoria](audit-log-reference.html#audit-log-routines "Audit Log Functions").

Quando o plugin de log de auditoria é inicializado, se ele descobrir que a criptografia do arquivo de log está habilitada, ele verifica se o Keyring contém uma senha de criptografia do log de auditoria. Caso contrário, o plugin gera automaticamente uma senha de criptografia inicial aleatória e a armazena no Keyring. Para descobrir esta senha, invoque [`audit_log_encryption_password_get()`](audit-log-reference.html#function_audit-log-encryption-password-get).

Se tanto a compressão quanto a criptografia estiverem habilitadas, a compressão ocorre antes da criptografia. Para recuperar o arquivo original manualmente, primeiro descriptografe-o e depois descomprima-o. Consulte [Descomprimindo e Descriptografando Manualmente Arquivos de Log de Auditoria](audit-log-logging-configuration.html#audit-log-file-uncompression-decryption "Manually Uncompressing and Decrypting Audit Log Files").

##### Descomprimindo e Descriptografando Manualmente Arquivos de Log de Auditoria

Os arquivos de log de auditoria podem ser descomprimidos e descriptografados usando ferramentas padrão. Isso deve ser feito apenas para arquivos de log que foram fechados (arquivados) e não estão mais em uso, e não para o arquivo de log que o plugin de log de auditoria está escrevendo atualmente. Você pode reconhecer arquivos de log arquivados porque eles foram renomeados pelo plugin de log de auditoria para incluir um timestamp no nome do arquivo logo após o nome base.

Para esta discussão, assuma que [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file) está definido como `audit.log`. Nesse caso, um arquivo de log de auditoria arquivado tem um dos nomes mostrados na tabela a seguir.

<table summary="Nomes de arquivo arquivados de audit_log para várias combinações de recursos de compressão e criptografia."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Recursos Habilitados</th> <th>Nome do Arquivo Arquivado</th> </tr></thead><tbody><tr> <td>Sem compressão ou criptografia</td> <td><code>audit.<em><code>timestamp</code></em>.log</code></td> </tr><tr> <td>Compressão</td> <td><code>audit.<em><code>timestamp</code></em>.log.gz</code></td> </tr><tr> <td>Criptografia</td> <td><code>audit.<em><code>timestamp</code></em>.log.enc</code></td> </tr><tr> <td>Compressão, criptografia</td> <td><code>audit.<em><code>timestamp</code></em>.log.gz.enc</code></td> </tr></tbody></table>

Para descomprimir um arquivo de log comprimido manualmente, use **gunzip**, **gzip -d** ou um comando equivalente. Por exemplo:

```sql
gunzip -c audit.timestamp.log.gz > audit.timestamp.log
```

Para descriptografar um arquivo de log criptografado manualmente, use o comando **openssl**. Por exemplo:

```sql
openssl enc -d -aes-256-cbc -pass pass:password -md sha256
    -in audit.timestamp.log.enc
    -out audit.timestamp.log
```

Se tanto a compressão quanto a criptografia estiverem habilitadas para o logging de auditoria, a compressão ocorre antes da criptografia. Neste caso, o nome do arquivo tem os sufixos `.gz` e `.enc` adicionados, correspondendo à ordem em que essas operações ocorrem. Para recuperar o arquivo original manualmente, execute as operações na ordem inversa. Ou seja, primeiro descriptografe o arquivo e depois descomprima-o:

```sql
openssl enc -d -aes-256-cbc -pass pass:password -md sha256
    -in audit.timestamp.log.gz.enc
    -out audit.timestamp.log.gz
gunzip -c audit.timestamp.log.gz > audit.timestamp.log
```

##### Gerenciamento de Espaço de Arquivos de Log de Auditoria

O arquivo de log de auditoria tem o potencial de crescer bastante e consumir uma grande quantidade de espaço em disco. Para gerenciar o espaço utilizado, a rotação de log pode ser empregada. Isso envolve rotacionar o arquivo de log atual, renomeando-o, e em seguida, abrindo um novo arquivo de log atual usando o nome original. A rotação pode ser executada manualmente ou configurada para ocorrer automaticamente.

Para configurar o gerenciamento de espaço do arquivo de log de auditoria, use as seguintes variáveis de sistema:

* Se [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size) for 0 (o padrão), a rotação automática do arquivo de log está desabilitada:

  + Nenhuma rotação ocorre, a menos que seja realizada manualmente.
  + Para rotacionar o arquivo atual, renomeie-o manualmente e, em seguida, habilite [`audit_log_flush`](audit-log-reference.html#sysvar_audit_log_flush) para fechá-lo e abrir um novo arquivo de log atual usando o nome original; consulte [Rotação Manual do Arquivo de Log de Auditoria](audit-log-logging-configuration.html#audit-log-manual-rotation "Manual Audit Log File Rotation").

* Se [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size) for maior que 0, a rotação automática do arquivo de log de auditoria está habilitada:

  + A rotação automática ocorre quando uma escrita no arquivo de log atual faz com que seu tamanho exceda o valor de [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size), bem como sob certas outras condições; consulte [Rotação Automática do Arquivo de Log de Auditoria](audit-log-logging-configuration.html#audit-log-automatic-rotation "Automatic Audit Log File Rotation"). Quando a rotação ocorre, o plugin de log de auditoria renomeia o arquivo de log atual e abre um novo arquivo de log atual usando o nome original.

  + Com a rotação automática habilitada, [`audit_log_flush`](audit-log-reference.html#sysvar_audit_log_flush) não tem efeito.

Note

Para arquivos de log no formato JSON, a rotação também ocorre quando o valor da variável de sistema [`audit_log_format_unix_timestamp`](audit-log-reference.html#sysvar_audit_log_format_unix_timestamp) é alterado em tempo de execução. No entanto, isso não ocorre para fins de gerenciamento de espaço, mas sim para que, para um determinado arquivo de log no formato JSON, todos os registros no arquivo incluam ou não o campo `time`.

Note

Arquivos de log rotacionados (renomeados) não são removidos automaticamente. Por exemplo, com a rotação de arquivo de log baseada em tamanho, os arquivos de log renomeados têm nomes exclusivos e se acumulam indefinidamente. Eles não saem do final da sequência de nomes por rotação. Para evitar o uso excessivo de espaço, remova os arquivos antigos periodicamente, fazendo backup deles primeiro, se necessário.

As seções a seguir descrevem a rotação de arquivos de log em mais detalhes.

* [Rotação Manual do Arquivo de Log de Auditoria](audit-log-logging-configuration.html#audit-log-manual-rotation "Manual Audit Log File Rotation")
* [Rotação Automática do Arquivo de Log de Auditoria](audit-log-logging-configuration.html#audit-log-automatic-rotation "Automatic Audit Log File Rotation")

###### Rotação Manual do Arquivo de Log de Auditoria

Se [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size) for 0 (o padrão), nenhuma rotação de log ocorre, a menos que seja executada manualmente. Neste caso, o plugin de log de auditoria fecha e reabre o arquivo de log quando o valor de [`audit_log_flush`](audit-log-reference.html#sysvar_audit_log_flush) muda de desabilitado para habilitado. A renomeação do arquivo de log deve ser feita externamente ao servidor. Suponha que o nome do arquivo de log seja `audit.log` e você queira manter os três arquivos de log mais recentes, ciclando pelos nomes `audit.log.1` a `audit.log.3`. No Unix, execute a rotação manualmente assim:

1. Na linha de comando, renomeie os arquivos de log atuais:

   ```sql
   mv audit.log.2 audit.log.3
   mv audit.log.1 audit.log.2
   mv audit.log audit.log.1
   ```

   Esta estratégia sobrescreve o conteúdo atual de `audit.log.3`, estabelecendo um limite para o número de arquivos de log arquivados e o espaço que eles usam.

2. Neste ponto, o plugin ainda está escrevendo no arquivo de log atual, que foi renomeado para `audit.log.1`. Conecte-se ao servidor e faça o `flush` do arquivo de log para que o plugin o feche e reabra um novo arquivo `audit.log`:

   ```sql
   SET GLOBAL audit_log_flush = ON;
   ```

   [`audit_log_flush`](audit-log-reference.html#sysvar_audit_log_flush) é especial, pois seu valor permanece `OFF`, de modo que você não precisa desabilitá-lo explicitamente antes de habilitá-lo novamente para executar outro `flush`.

Note

Para o logging no formato JSON, renomear arquivos de log de auditoria manualmente os torna indisponíveis para as funções de leitura de log porque o plugin de log de auditoria não pode mais determinar que eles fazem parte da sequência de arquivos de log (consulte [Seção 6.4.5.6, “Lendo Arquivos de Log de Auditoria”](audit-log-file-reading.html "6.4.5.6 Reading Audit Log Files")). Considere definir [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size) maior que 0 para usar a rotação baseada em tamanho.

###### Rotação Automática do Arquivo de Log de Auditoria

Se [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size) for maior que 0, a definição de [`audit_log_flush`](audit-log-reference.html#sysvar_audit_log_flush) não tem efeito. Em vez disso, sempre que uma escrita no arquivo de log atual faz com que seu tamanho exceda o valor de [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size), o plugin de log de auditoria renomeia automaticamente o arquivo de log atual e abre um novo arquivo de log atual usando o nome original.

A rotação automática baseada em tamanho também ocorre nestas condições:

* Durante a inicialização do plugin, se um arquivo com o nome do arquivo de log de auditoria já existir (consulte [Convenções de Nomenclatura para Arquivos de Log de Auditoria](audit-log-logging-configuration.html#audit-log-file-name "Naming Conventions for Audit Log Files")).

* Durante o encerramento do plugin.
* Quando a função [`audit_log_encryption_password_set()`](audit-log-reference.html#function_audit-log-encryption-password-set) é chamada para definir a senha de criptografia.

O plugin renomeia o arquivo original da seguinte forma:

* A partir do MySQL 5.7.21, o arquivo renomeado tem um timestamp inserido após seu nome base e antes de seu sufixo. Por exemplo, se o nome do arquivo for `audit.log`, o plugin o renomeia para um valor como `audit.20180115T140633.log`. O timestamp é um valor UTC no formato `YYYYMMDDThhmmss`. Para logging XML, o timestamp indica o tempo de rotação. Para logging JSON, o timestamp é o do último evento escrito no arquivo.

  Se os arquivos de log estiverem criptografados, o nome original do arquivo já contém um timestamp indicando o tempo de criação da senha de criptografia (consulte [Convenções de Nomenclatura para Arquivos de Log de Auditoria](audit-log-logging-configuration.html#audit-log-file-name "Naming Conventions for Audit Log Files")). Neste caso, o nome do arquivo após a rotação contém dois timestamps. Por exemplo, um arquivo de log criptografado chamado `audit.log.20180110T130749-1.enc` é renomeado para um valor como `audit.20180115T140633.log.20180110T130749-1.enc`.

* Antes do MySQL 5.7.21, o arquivo renomeado tem um timestamp e `.xml` adicionados ao final. Por exemplo, se o nome do arquivo for `audit.log`, o plugin o renomeia para um valor como `audit.log.15159344437726520.xml`. O valor do timestamp é semelhante a um Unix timestamp, com os últimos 7 dígitos representando a parte fracionária do segundo. Ao inserir um ponto decimal, o valor pode ser interpretado usando a função [`FROM_UNIXTIME()`](date-and-time-functions.html#function_from-unixtime):

  ```sql
  mysql> SELECT FROM_UNIXTIME(1515934443.7726520);
  +-----------------------------------+
  | FROM_UNIXTIME(1515934443.7726520) |
  +-----------------------------------+
  | 2018-01-14 06:54:03.772652        |
  +-----------------------------------+
  ```

##### Estratégias de Escrita para Logging de Auditoria

O plugin de log de auditoria pode usar várias estratégias para escritas de log. Independentemente da estratégia, o logging ocorre na base de "melhor esforço", sem garantia de consistência.

Para especificar uma estratégia de escrita, defina a variável de sistema [`audit_log_strategy`](audit-log-reference.html#sysvar_audit_log_strategy) na inicialização do servidor. Por padrão, o valor da estratégia é `ASYNCHRONOUS` e o plugin registra assincronamente em um Buffer, esperando se o Buffer estiver cheio. Você pode instruir o plugin a não esperar (`PERFORMANCE`) ou a registrar de forma síncrona, usando caching do sistema de arquivos (`SEMISYNCHRONOUS`) ou forçando a saída com uma chamada `sync()` após cada solicitação de escrita (`SYNCHRONOUS`).

Para a estratégia de escrita assíncrona, a variável de sistema [`audit_log_buffer_size`](audit-log-reference.html#sysvar_audit_log_buffer_size) é o tamanho do Buffer em bytes. Defina esta variável na inicialização do servidor para alterar o tamanho do Buffer. O plugin usa um único Buffer, que ele aloca quando é inicializado e remove quando é encerrado. O plugin não aloca este Buffer para estratégias de escrita não assíncronas.

A estratégia de logging assíncrona tem estas características:

* Impacto mínimo no desempenho e escalabilidade do servidor.
* Bloqueio de Threads que geram eventos de auditoria pelo menor tempo possível; ou seja, tempo para alocar o Buffer mais tempo para copiar o evento para o Buffer.

* A saída vai para o Buffer. Uma Thread separada lida com as escritas do Buffer para o arquivo de log.

Com o logging assíncrono, a integridade do arquivo de log pode ser comprometida se ocorrer um problema durante uma escrita no arquivo ou se o plugin não for encerrado de forma limpa (por exemplo, no caso de o host do servidor ser encerrado inesperadamente). Para reduzir esse risco, defina [`audit_log_strategy`](audit-log-reference.html#sysvar_audit_log_strategy) para usar o logging síncrono.

Uma desvantagem da estratégia `PERFORMANCE` é que ela descarta eventos quando o Buffer está cheio. Para um servidor altamente carregado, o log de auditoria pode ter eventos ausentes.
