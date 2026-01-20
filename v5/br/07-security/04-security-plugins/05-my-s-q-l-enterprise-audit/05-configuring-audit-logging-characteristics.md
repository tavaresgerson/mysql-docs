#### 6.4.5.5 Configurando características de registro de auditoria

Esta seção descreve como configurar as características do registro de auditoria, como o arquivo para o qual o plugin de registro de auditoria escreve os eventos, o formato dos eventos escritos, se deve habilitar a compressão e criptografia do arquivo de log e a gestão de espaço.

- Convenções de Nomenclatura para Arquivos de Registro de Auditoria
- Selecionar formato de arquivo de registro de auditoria
- Compressão de arquivos de registro de auditoria
- Encriptar arquivos de registro de auditoria
- Descompactar e descriptografar manualmente arquivos de registro de auditoria
- Gestão de Espaço dos Arquivos de Registro de Auditoria
- Escreva estratégias para registro de auditoria

Para obter informações adicionais sobre as funções e variáveis do sistema que afetam o registro de auditoria, consulte Funções do Registro de Auditoria e Opções e variáveis do registro de auditoria.

O plugin do log de auditoria também pode controlar quais eventos auditados são escritos no arquivo do log de auditoria, com base no conteúdo do evento ou na conta de onde os eventos se originam. Veja Seção 6.4.5.7, “Filtragem do Log de Auditoria”.

##### Convenções de Nomenclatura para Arquivos de Registro de Auditoria

Para configurar o nome do arquivo de log de auditoria, defina a variável de sistema `audit_log_file` no início do servidor. O nome padrão é `audit.log` no diretório de dados do servidor. Para a melhor segurança, escreva o log de auditoria em um diretório acessível apenas ao servidor MySQL e aos usuários que tenham uma razão legítima para visualizar o log.

A partir do MySQL 5.7.21, o plugin interpreta o valor `audit_log_file` como composto por um nome de diretório opcional, um nome base e um sufixo opcional. Se a compressão ou criptografia estiverem habilitadas, o nome de arquivo efetivo (o nome realmente usado para criar o arquivo de log) difere do nome de arquivo configurado porque possui sufixos adicionais:

- Se a compressão estiver habilitada, o plugin adiciona um sufixo de `.gz`.

- Se a criptografia estiver habilitada, o plugin adiciona um sufixo de `.enc`. O plugin de log de auditoria armazena a senha de criptografia no chaveiro (consulte Criptografando arquivos de log de auditoria).

O nome efetivo do arquivo de registro de auditoria é o nome resultante da adição de sufixos de compressão e criptografia aplicáveis ao nome do arquivo configurado. Por exemplo, se o valor configurado de `audit_log_file` for `audit.log`, o nome efetivo do arquivo será um dos valores mostrados na tabela a seguir.

<table summary="nomes dos arquivos de registro de auditoria para várias combinações das funcionalidades de compressão e criptografia."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Recursos habilitados</th> <th>Nome eficaz do arquivo</th> </tr></thead><tbody><tr> <td>Sem compressão ou criptografia</td> <td><code>audit.log</code></td> </tr><tr> <td>Compressão</td> <td><code>audit.log.gz</code></td> </tr><tr> <td>Criptografia</td> <td><code>audit.log.enc</code></td> </tr><tr> <td>Compressão, criptografia</td> <td><code>audit.log.gz.enc</code></td> </tr></tbody></table>

Antes do MySQL 5.7.21, os nomes dos arquivos de log configurados e efetivos são os mesmos. Por exemplo, se o valor configurado de `audit_log_file` for `audit.log`, o plugin de log de auditoria escreverá em `audit.log`.

O plugin de registro de auditoria executa certas ações durante a inicialização e término com base no nome efetivo do arquivo de registro de auditoria:

A partir do MySQL 5.7.21:

- Durante a inicialização, o plugin verifica se um arquivo com o nome do arquivo de registro de auditoria já existe e renomeia-o, se existir. (Neste caso, o plugin assume que a invocação anterior do servidor saiu inesperadamente com o plugin de registro de auditoria em execução.) O plugin então escreve em um novo arquivo de registro de auditoria vazio.

- Durante a finalização, o plugin renomeia o arquivo de registro de auditoria.

- O renomeamento de arquivos (durante a inicialização ou término do plugin) ocorre de acordo com as regras habituais para rotação automática de arquivos de registro com base no tamanho; consulte Rotação Automática de Arquivos de Registro de Auditoria Manual.

Antes do MySQL 5.7.21, apenas os formatos de log XML estão disponíveis e o plugin realiza verificações rudimentares de integridade:

- Durante a inicialização, o plugin verifica se o arquivo termina com uma tag `<AUDIT>` e corta a tag antes de escrever quaisquer elementos `<AUDIT_RECORD>`. Se o arquivo de log existir, mas não terminar com `</AUDIT>` ou se a tag `<AUDIT>` não puder ser cortada, o plugin considera o arquivo malformado e renomeia-o. (Tal renomeação pode ocorrer se o servidor sair inesperadamente com o plugin de log de auditoria em execução.) O plugin então escreve em um novo arquivo de log de auditoria vazio.

- Na finalização, não ocorre renomeação de arquivos.

- Quando a renomeação ocorre na inicialização do plugin, o arquivo renomeado tem `.corrupted`, um timestamp e `.xml` adicionado ao final. Por exemplo, se o nome do arquivo for `audit.log`, o plugin renomeia-o para um valor como `audit.log.corrupted.15081807937726520.xml`. O valor do timestamp é semelhante a um timestamp Unix, com os últimos 7 dígitos representando a parte fracionária de segundo. Para obter informações sobre a interpretação do timestamp, consulte Gestão de Espaço de Arquivos de Log de Auditoria.

##### Selecionar o formato do arquivo de registro de auditoria

Para configurar o formato do arquivo de log de auditoria, defina a variável de sistema `audit_log_format` no momento do início do servidor. Esses formatos estão disponíveis:

- `NOVO`: Novo formato XML. Este é o padrão.

- `OLD`: Formato XML antigo.

- `JSON`: Formato JSON.

Para obter detalhes sobre cada formato, consulte Seção 6.4.5.4, "Formatos de arquivos de registro de auditoria".

Se você alterar `audit_log_format`, recomenda-se que você também altere `audit_log_file`. Por exemplo, se você definir `audit_log_format` para `JSON`, defina `audit_log_file` para `audit.json`. Caso contrário, os arquivos de log mais recentes terão um formato diferente dos arquivos mais antigos, mas todos terão o mesmo nome de base sem nada que indique quando o formato foi alterado.

Nota

Antes do MySQL 5.7.21, alterar o valor de `audit_log_format` pode resultar na gravação de entradas de log em um formato em um arquivo de log existente que contém entradas em um formato diferente. Para evitar esse problema, use o procedimento a seguir:

1. Pare o servidor.

2. Ou altere o valor da variável de sistema `audit_log_file` para que o plugin escreva em um arquivo diferente, ou renomeie manualmente o arquivo de log de auditoria atual.

3. Reinicie o servidor com o novo valor de `audit_log_format`. O plugin de log de auditoria cria um novo arquivo de log e escreve entradas nele no formato selecionado.

##### Compressão de arquivos de registro de auditoria

A compactação do arquivo de registro de auditoria está disponível a partir do MySQL 5.7.21. A compactação pode ser habilitada para qualquer formato de log.

Para configurar a compressão do arquivo de registro de auditoria, defina a variável de sistema `audit_log_compression` no início do servidor. Os valores permitidos são `NONE` (sem compressão; o padrão) e `GZIP` (compressão GNU Zip).

Se a compressão e a criptografia estiverem habilitadas, a compressão ocorrerá antes da criptografia. Para recuperar o arquivo original manualmente, primeiro descifre-o e, em seguida, descomprima-o. Consulte Descomprimindo e Descifrando Manuais Arquivos de Registro de Auditoria.

##### Encriptar arquivos de registro de auditoria

O criptografia do arquivo de registro de auditoria está disponível a partir do MySQL 5.7.21. A criptografia pode ser habilitada para qualquer formato de log. A criptografia é baseada em uma senha definida pelo usuário (com exceção da senha inicial, que o plugin de registro de auditoria gera). Para usar esse recurso, o conjunto de chaves MySQL deve estar habilitado, pois o registro de auditoria usa ele para armazenamento de senhas. Qualquer plugin de conjunto de chaves pode ser usado; para instruções, consulte Seção 6.4.4, “O Conjunto de Chaves MySQL”.

Para configurar a criptografia do arquivo de registro de auditoria, defina a variável de sistema `audit_log_encryption` no momento do início do servidor. Os valores permitidos são `NONE` (sem criptografia; o padrão) e `AES` (criptografia com o algoritmo AES-256-CBC).

Para definir ou obter uma senha de criptografia em tempo de execução, use essas funções de log de auditoria:

- Para definir a senha de criptografia atual, invocando `audit_log_encryption_password_set()`. Esta função armazena a nova senha no chaveiro. Se a criptografia estiver habilitada, também realiza uma operação de rotação de arquivo de log que renomeia o arquivo de log atual e inicia um novo arquivo de log criptografado com a senha. O renomeamento do arquivo ocorre de acordo com as regras usuais para rotação automática de arquivos de log baseada no tamanho; veja Manual de Rotação de Arquivos de Log de Auditoria.

  Os arquivos de registro de auditoria anteriormente escritos não são re-encriptados com a nova senha. Mantenha um registro da senha anterior, caso precise descriptografar esses arquivos manualmente.

- Para obter a senha de criptografia atual, invocando `audit_log_encryption_password_get()`, que recupera a senha do chaveiro.

Para obter informações adicionais sobre as funções de criptografia do log de auditoria, consulte Funções de Log de Auditoria.

Quando o plugin de registro de auditoria é inicializado, se ele encontrar que o criptografamento do arquivo de log está habilitado, ele verifica se o conjunto de chaves contém uma senha de criptografia do registro de auditoria. Se não, o plugin gera automaticamente uma senha de criptografia inicial aleatória e armazena-a no conjunto de chaves. Para descobrir essa senha, invoque `audit_log_encryption_password_get()`.

Se a compressão e a criptografia estiverem habilitadas, a compressão ocorrerá antes da criptografia. Para recuperar o arquivo original manualmente, primeiro descifre-o e, em seguida, descomprima-o. Consulte Descomprimindo e Descifrando Manuais Arquivos de Registro de Auditoria.

##### Descompactar e descriptografar manualmente os arquivos do registro de auditoria manualmente

Os arquivos de registro de auditoria podem ser descompactados e descriptografados usando ferramentas padrão. Isso deve ser feito apenas para arquivos de registro que tenham sido fechados (arquivos de arquivo) e não estejam mais em uso, e não para o arquivo de registro que o plugin de log de auditoria está escrevendo atualmente. Você pode reconhecer os arquivos de registro arquivados porque eles foram renomeados pelo plugin de log de auditoria para incluir um timestamp no nome do arquivo logo após o nome base.

Para essa discussão, vamos assumir que `audit_log_file` está definido como `audit.log`. Nesse caso, um arquivo de registro de auditoria arquivado tem um dos nomes mostrados na tabela a seguir.

<table summary="O arquivo de registro de auditoria arquivou os nomes dos arquivos para várias combinações das características de compressão e criptografia."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Recursos habilitados</th> <th>Nome do arquivo arquivado</th> </tr></thead><tbody><tr> <td>Sem compressão ou criptografia</td> <td><code>audit.<em><code>timestamp</code></em>.log</code></td> </tr><tr> <td>Compressão</td> <td><code>audit.<em><code>timestamp</code></em>.log.gz</code></td> </tr><tr> <td>Criptografia</td> <td><code>audit.<em><code>timestamp</code></em>.log.enc</code></td> </tr><tr> <td>Compressão, criptografia</td> <td><code>audit.<em><code>timestamp</code></em>.log.gz.enc</code></td> </tr></tbody></table>

Para descomprimir um arquivo de log compactado manualmente, use **gunzip**, **gzip -d** ou um comando equivalente. Por exemplo:

```sh
gunzip -c audit.timestamp.log.gz > audit.timestamp.log
```

Para descriptografar um arquivo de registro criptografado manualmente, use o comando **openssl**. Por exemplo:

```sh
openssl enc -d -aes-256-cbc -pass pass:password -md sha256
    -in audit.timestamp.log.enc
    -out audit.timestamp.log
```

Se a compressão e a criptografia estiverem habilitadas para o registro de auditoria, a compressão ocorrerá antes da criptografia. Nesse caso, o nome do arquivo terá os sufixos `.gz` e `.enc` adicionados, correspondendo à ordem em que essas operações ocorrem. Para recuperar o arquivo original manualmente, realize as operações em ordem inversa. Ou seja, primeiro decifre o arquivo e, em seguida, descomprima-o:

```sh
openssl enc -d -aes-256-cbc -pass pass:password -md sha256
    -in audit.timestamp.log.gz.enc
    -out audit.timestamp.log.gz
gunzip -c audit.timestamp.log.gz > audit.timestamp.log
```

##### Gestão de Espaço de Arquivos de Registro de Auditoria

O arquivo de registro de auditoria pode crescer bastante e consumir um grande espaço em disco. Para gerenciar o espaço usado, a rotação do log pode ser empregada. Isso envolve a rotação do arquivo de log atual renomeando-o, e depois abrindo um novo arquivo de log atual usando o nome original. A rotação pode ser realizada manualmente ou configurada para ocorrer automaticamente.

Para configurar a gestão do espaço do arquivo de registro de auditoria, use as seguintes variáveis de sistema:

- Se `audit_log_rotate_on_size` for 0 (o padrão), a rotação automática do arquivo de registro será desativada:

  - Não há rotação a menos que seja realizada manualmente.
  - Para rotear o arquivo atual, renomeie-o manualmente e, em seguida, habilite `audit_log_flush` para fechá-lo e abrir um novo arquivo de log atual usando o nome original; consulte Rotação Manual de Arquivo de Log de Auditoria.

- Se `audit_log_rotate_on_size` for maior que 0, a rotação automática do arquivo de registro de auditoria está habilitada:

  - A rotação automática ocorre quando uma escrita no arquivo de registro atual faz com que seu tamanho exceda o valor de `audit_log_rotate_on_size`, além de sob certas outras condições; veja Rotação Automática do Arquivo de Registro de Auditoria. Quando a rotação ocorre, o plugin de registro de auditoria renomeia o arquivo de registro atual e abre um novo arquivo de registro atual usando o nome original.

  - Com a rotação automática habilitada, `audit_log_flush` não tem efeito.

Nota

Para arquivos de log no formato JSON, a rotação também ocorre quando o valor da variável de sistema `audit_log_format_unix_timestamp` é alterado em tempo de execução. No entanto, isso não ocorre por motivos de gerenciamento de espaço, mas sim para que, para um arquivo de log no formato JSON específico, todos os registros no arquivo incluam ou não o campo `time`.

Nota

Os arquivos de registro rotados (renomeados) não são removidos automaticamente. Por exemplo, com a rotação de arquivos de registro baseada no tamanho, os arquivos de registro renomeados têm nomes únicos e acumulam indefinidamente. Eles não rodam para o final da sequência de nomes. Para evitar o uso excessivo de espaço, remova os arquivos antigos periodicamente, fazendo backup deles primeiro, se necessário.

As seções a seguir descrevem a rotação de arquivos de log com mais detalhes.

- Rotacionamento do arquivo de registro de auditoria manual
- Rotação automática do arquivo de registro de auditoria

###### Rotulagem manual do arquivo de registro de auditoria

Se `audit_log_rotate_on_size` for 0 (o padrão), não ocorrerá rotação de log, a menos que seja realizada manualmente. Nesse caso, o plugin de log de auditoria fecha e reabre o arquivo de log quando o valor de `audit_log_flush` muda de desativado para ativado. A renomeação do arquivo de log deve ser feita externamente ao servidor. Suponha que o nome do arquivo de log seja `audit.log` e que você queira manter os três arquivos de log mais recentes, alternando entre os nomes `audit.log.1` a `audit.log.3`. No Unix, realize a rotação manualmente da seguinte forma:

1. Do prompt de comando, renomeie os arquivos de log atuais:

   ```sql
   mv audit.log.2 audit.log.3
   mv audit.log.1 audit.log.2
   mv audit.log audit.log.1
   ```

   Essa estratégia sobrescreve o conteúdo atual do `audit.log.3`, estabelecendo um limite para o número de arquivos de log arquivados e o espaço que eles ocupam.

2. Neste ponto, o plugin ainda está escrevendo no arquivo de log atual, que foi renomeado para `audit.log.1`. Conecte-se ao servidor e limpe o arquivo de log para que o plugin o feche e abra um novo arquivo `audit.log`:

   ```sql
   SET GLOBAL audit_log_flush = ON;
   ```

   O `audit_log_flush` é especial porque seu valor permanece em `OFF`, para que você não precise desativá-lo explicitamente antes de ativá-lo novamente para realizar outro esvaziamento.

Nota

Para o registro no formato JSON, renomear manualmente os arquivos de registro de auditoria os torna indisponíveis para as funções de leitura de registro, pois o plugin de registro de auditoria não consegue mais determinar que fazem parte da sequência do arquivo de registro (consulte Seção 6.4.5.6, “Leitura de Arquivos de Registro de Auditoria”). Considere definir `audit_log_rotate_on_size` maior que 0 para usar a rotação baseada no tamanho.

###### Rotacionamento automático do arquivo de registro de auditoria

Se `audit_log_rotate_on_size` for maior que 0, definir `audit_log_flush` não terá efeito. Em vez disso, sempre que uma escrita no arquivo de log atual fizer com que seu tamanho exceda o valor de `audit_log_rotate_on_size`, o plugin de log de auditoria renomeia automaticamente o arquivo de log atual e abre um novo arquivo de log atual usando o nome original.

A rotação automática baseada no tamanho também ocorre nessas condições:

- Durante a inicialização do plugin, se um arquivo com o nome do arquivo de registro de auditoria já existir (consulte Convenções de Nomenclatura para Arquivos de Registro de Auditoria).

- Durante a finalização do plugin.

- Quando a função `audit_log_encryption_password_set()` é chamada para definir a senha de criptografia.

O plugin renomeia o arquivo original da seguinte forma:

- A partir do MySQL 5.7.21, o arquivo renomeado tem um timestamp inserido após seu nome base e antes de seu sufixo. Por exemplo, se o nome do arquivo for `audit.log`, o plugin o renomeia para um valor como `audit.20180115T140633.log`. O timestamp é um valor UTC no formato `YYYYMMDDThhmmss`. Para o registro XML, o timestamp indica o tempo de rotação. Para o registro JSON, o timestamp é o do último evento escrito no arquivo.

  Se os arquivos de registro estiverem criptografados, o nome original do arquivo já contém um timestamp indicando o horário de criação da senha de criptografia (consulte Convenções de Nomenclatura para Arquivos de Registro de Auditoria). Nesse caso, o nome do arquivo após a rotação contém dois timestamps. Por exemplo, um arquivo de registro criptografado com o nome `audit.log.20180110T130749-1.enc` é renomeado para um valor como `audit.20180115T140633.log.20180110T130749-1.enc`.

- Antes do MySQL 5.7.21, o arquivo renomeado tem um timestamp e `.xml` adicionado ao final. Por exemplo, se o nome do arquivo for `audit.log`, o plugin o renomeia para um valor como `audit.log.15159344437726520.xml`. O valor do timestamp é semelhante a um timestamp Unix, com os últimos 7 dígitos representando a parte fracionária de segundo. Ao inserir um ponto decimal, o valor pode ser interpretado usando a função `FROM_UNIXTIME()`:

  ```sql
  mysql> SELECT FROM_UNIXTIME(1515934443.7726520);
  +-----------------------------------+
  | FROM_UNIXTIME(1515934443.7726520) |
  +-----------------------------------+
  | 2018-01-14 06:54:03.772652        |
  +-----------------------------------+
  ```

##### Escreva estratégias para registro de auditoria

O plugin de registro de auditoria pode usar qualquer uma das várias estratégias para gravações de log. Independentemente da estratégia, o registro ocorre com esforço máximo, sem garantia de consistência.

Para especificar uma estratégia de gravação, defina a variável de sistema `audit_log_strategy` no início do servidor. Por padrão, o valor da estratégia é `ASYNCHRONOUS` e o plugin grava as informações de forma assíncrona em um buffer, aguardando se o buffer estiver cheio. Você pode instruir o plugin a não aguardar (`PERFORMANCE`) ou a gravar de forma síncrona, usando o cache do sistema de arquivos (`SEMISYNCHRONOUS`) ou forçando a saída com uma chamada `sync()` após cada solicitação de gravação (`SYNCHRONOUS`).

Para a estratégia de escrita assíncrona, a variável de sistema `audit_log_buffer_size` é o tamanho do buffer em bytes. Defina essa variável no início do servidor para alterar o tamanho do buffer. O plugin usa um único buffer, que ele aloca quando se inicializa e remove quando termina. O plugin não aloca esse buffer para estratégias de escrita não assíncronas.

A estratégia de registro assíncrono tem essas características:

- Impacto mínimo no desempenho e na escalabilidade do servidor.

- Bloqueio de threads que geram eventos de auditoria por um período o mais curto possível; ou seja, tempo para alocar o buffer mais tempo para copiar o evento para o buffer.

- A saída vai para o buffer. Um thread separado lida com as escritas do buffer no arquivo de log.

Com o registro assíncrono, a integridade do arquivo de registro pode ser comprometida se um problema ocorrer durante uma gravação no arquivo ou se o plugin não fechar corretamente (por exemplo, caso o host do servidor saia inesperadamente). Para reduzir esse risco, defina `audit_log_strategy` para usar o registro síncrono.

Uma desvantagem da estratégia `PERFORMANCE` é que ela exclui eventos quando o buffer está cheio. Para um servidor com alta carga, o log de auditoria pode ter eventos faltando.
