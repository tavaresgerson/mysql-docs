### 5.4.3 O General Query Log

O general query log é um registro geral do que o [**mysqld**] está fazendo. O Server grava informações neste Log quando Clients se conectam ou desconectam, e registra cada SQL statement recebida dos Clients. O general query log pode ser muito útil quando você suspeita de um erro em um Client e deseja saber exatamente o que o Client enviou ao [**mysqld**].

Cada linha que mostra quando um Client se conecta também inclui `using connection_type` para indicar o protocolo usado para estabelecer a conexão. *`connection_type`* é um de `TCP/IP` (conexão TCP/IP estabelecida sem SSL), `SSL/TLS` (conexão TCP/IP estabelecida com SSL), `Socket` (conexão de arquivo de socket Unix), `Named Pipe` (conexão de pipe nomeado do Windows), ou `Shared Memory` (conexão de memória compartilhada do Windows).

O [**mysqld**] grava statements no Query Log na ordem em que as recebe, o que pode diferir da ordem em que são executadas. Esta ordem de Logging contrasta com a do Binary Log, no qual as statements são gravadas após serem executadas, mas antes que quaisquer Locks sejam liberados. Além disso, o Query Log pode conter statements que apenas selecionam dados, enquanto tais statements nunca são gravadas no Binary Log.

Ao usar o Binary Logging baseado em statement (statement-based) em um Replication Source Server, as statements recebidas por suas Replicas são gravadas no Query Log de cada Replica. Statements são gravadas no Query Log da Source se um Client ler eventos com o utilitário [**mysqlbinlog**] e os passar para o Server.

No entanto, ao usar o Binary Logging baseado em linha (row-based), as atualizações são enviadas como alterações de linha em vez de SQL statements e, portanto, essas statements nunca são gravadas no Query Log quando [`binlog_format`] é `ROW`. Uma determinada atualização também pode não ser gravada no Query Log quando esta variável é definida como `MIXED`, dependendo da statement utilizada. Consulte [Section 16.2.1.1, “Advantages and Disadvantages of Statement-Based and Row-Based Replication”] para mais informações.

Por padrão, o general query log está desabilitado. Para especificar explicitamente o estado inicial do general query log, use [`--general_log[={0|1}]`]. Sem argumento ou com um argumento de 1, [`--general_log`] habilita o Log. Com um argumento de 0, esta opção desabilita o Log. Para especificar um nome de arquivo de Log, use [`--general_log_file=file_name`]. Para especificar o destino do Log, use a variável de sistema [`log_output`] (conforme descrito em [Section 5.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”]).

Nota

Se você especificar o destino de Log `TABLE`, consulte [Log Tables and “Too many open files” Errors].

Se você não especificar um nome para o arquivo do general query log, o nome padrão é `host_name.log`. O Server cria o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente.

Para desabilitar ou habilitar o general query log ou alterar o nome do arquivo de Log em tempo de execução (runtime), use as variáveis de sistema globais [`general_log`] e [`general_log_file`]. Defina [`general_log`] como 0 (ou `OFF`) para desabilitar o Log ou como 1 (ou `ON`) para habilitá-lo. Defina [`general_log_file`] para especificar o nome do arquivo de Log. Se um arquivo de Log já estiver aberto, ele será fechado e o novo arquivo será aberto.

Quando o general query log está habilitado, o Server grava a saída em todos os destinos especificados pela variável de sistema [`log_output`]. Se você habilitar o Log, o Server abre o arquivo de Log e grava mensagens de inicialização nele. No entanto, o Logging subsequente de Queries no arquivo não ocorre, a menos que o destino de Log `FILE` seja selecionado. Se o destino for `NONE`, o Server não grava Queries, mesmo que o General Log esteja habilitado. Definir o nome do arquivo de Log não tem efeito no Logging se o valor do destino de Log não contiver `FILE`.

Reinicializações do Server e o *flush* do Log não fazem com que um novo arquivo do general query log seja gerado (embora o *flush* o feche e o reabra). Para renomear o arquivo e criar um novo, use os seguintes comandos:

```sql
$> mv host_name.log host_name-old.log
$> mysqladmin flush-logs general
$> mv host_name-old.log backup-directory
```

No Windows, use **rename** em vez de **mv**.

Você também pode renomear o arquivo do general query log em tempo de execução, desabilitando o Log:

```sql
SET GLOBAL general_log = 'OFF';
```

Com o Log desabilitado, renomeie o arquivo de Log externamente (por exemplo, a partir da linha de comando). Em seguida, habilite o Log novamente:

```sql
SET GLOBAL general_log = 'ON';
```

Este método funciona em qualquer plataforma e não requer uma reinicialização do Server.

Para desabilitar ou habilitar o general query logging para a sessão atual, defina a variável de sessão [`sql_log_off`] como `ON` ou `OFF`. (Isso pressupõe que o general query log esteja habilitado.)

Senhas em statements gravadas no general query log são reescritas pelo Server para não aparecerem literalmente em texto simples (plain text). A reescrita de senha pode ser suprimida para o general query log, iniciando o Server com a opção [`--log-raw`]. Esta opção pode ser útil para fins de diagnóstico, para ver o texto exato das statements conforme recebidas pelo Server, mas por razões de segurança, não é recomendada para uso em produção. Consulte também [Section 6.1.2.3, “Passwords and Logging”].

Uma implicação da reescrita de senha é que statements que não podem ser *parsed* (analisadas) (devido, por exemplo, a erros de sintaxe) não são gravadas no general query log porque não se pode garantir que estejam livres de senhas. Casos de uso que exigem o Logging de todas as statements, incluindo aquelas com erros, devem usar a opção [`--log-raw`], lembrando que isso também ignora a reescrita de senha.

A reescrita de senha ocorre apenas quando senhas em plain text são esperadas. Para statements com sintaxe que espera um valor hash de senha, nenhuma reescrita ocorre. Se uma senha em plain text for fornecida erroneamente para tal sintaxe, a senha é registrada conforme fornecida, sem reescrita. Por exemplo, a seguinte statement é registrada conforme mostrado porque um valor hash de senha é esperado:

```sql
CREATE USER 'user1'@'localhost' IDENTIFIED BY PASSWORD 'not-so-secret';
```

A variável de sistema [`log_timestamps`] controla o fuso horário (time zone) dos timestamps nas mensagens gravadas no arquivo do general query log (assim como no arquivo do slow query log e no error log). Ela não afeta o fuso horário das mensagens do general query log e do slow query log gravadas em log tables, mas as linhas recuperadas dessas tabelas podem ser convertidas do fuso horário do sistema local para qualquer fuso horário desejado com [`CONVERT_TZ()`] ou configurando a variável de sistema de sessão [`time_zone`].