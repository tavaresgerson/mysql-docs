### 5.4.3 O Log de Consulta Geral

O log de consulta geral é um registro geral do que o **mysqld** está fazendo. O servidor escreve informações neste log quando os clientes se conectam ou desconectam, e ele registra cada instrução SQL recebida dos clientes. O log de consulta geral pode ser muito útil quando você suspeita de um erro em um cliente e deseja saber exatamente o que o cliente enviou para **mysqld**.

Cada linha que mostra quando um cliente se conecta também inclui `using connection_type` para indicar o protocolo usado para estabelecer a conexão. *`connection_type`* é um dos `TCP/IP` (conexão TCP/IP estabelecida sem SSL), `SSL/TLS` (conexão TCP/IP estabelecida com SSL), `Socket` (conexão de arquivo de socket Unix), `Named Pipe` (conexão de pipe nomeado do Windows) ou `Shared Memory` (conexão de memória compartilhada do Windows).

**mysqld** escreve declarações no log de consulta na ordem em que as recebe, o que pode diferir da ordem em que são executadas. Esse registro em ordem é diferente do log binário, para o qual as declarações são escritas após serem executadas, mas antes que quaisquer bloqueios sejam liberados. Além disso, o log de consulta pode conter declarações que selecionam dados apenas enquanto essas declarações nunca são escritas no log binário.

Ao usar o registro binário baseado em instruções em um servidor de origem de replicação, as instruções recebidas por suas réplicas são escritas no log de consulta de cada réplica. As instruções são escritas no log de consulta da fonte se um cliente ler eventos com o utilitário **mysqlbinlog** e os passar para o servidor.

No entanto, ao usar o registro binário baseado em linhas, as atualizações são enviadas como alterações de linha, em vez de instruções SQL, e, portanto, essas instruções nunca são escritas no log de consulta quando [`binlog_format`](https://pt.wikipedia.org/wiki/Replicação_bin%C3%A1ria#sysvar_binlog_format) é `ROW`. Uma atualização específica também pode não ser escrita no log de consulta quando essa variável estiver definida como `MIXED`, dependendo da instrução usada. Consulte [Seção 16.2.1.1, “Vantagens e Desvantagens da Replicação Baseada em Instruções e Replicação Baseada em Linhas”](https://pt.wikipedia.org/wiki/Rep%C3%A1o_SBR-RBR), para obter mais informações.

Por padrão, o log de consultas gerais está desativado. Para especificar explicitamente o estado inicial do log de consultas gerais, use `--general_log[={0|1}]`. Sem argumento ou com argumento igual a 1, `--general_log` habilita o log. Com argumento igual a 0, essa opção desativa o log. Para especificar o nome de um arquivo de log, use `--general_log_file=file_name`. Para especificar o destino do log, use a variável de sistema `log_output` (como descrito em Seção 5.4.1, “Selecionando destinos de saída de log de consultas gerais e log de consultas lentas”).

Nota

Se você especificar o destino de registro `TABLE`, consulte Tabelas de registro e erros de "Muitos arquivos abertos".

Se você não especificar um nome para o arquivo de log de consulta geral, o nome padrão é `host_name.log`. O servidor cria o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente.

Para desabilitar ou habilitar o log de consultas gerais ou alterar o nome do arquivo de log em tempo de execução, use as variáveis de sistema globais `general_log` e `general_log_file`. Defina `general_log` para 0 (ou `OFF`) para desabilitar o log ou para 1 (ou `ON`) para habilitá-lo. Defina `general_log_file` para especificar o nome do arquivo de log. Se um arquivo de log já estiver aberto, ele será fechado e o novo arquivo será aberto.

Quando o log de consulta geral é habilitado, o servidor escreve a saída para quaisquer destinos especificados pela variável de sistema `log_output`. Se você habilitar o log, o servidor abre o arquivo de log e escreve mensagens de inicialização nele. No entanto, o registro adicional de consultas no arquivo não ocorre, a menos que o destino `FILE` seja selecionado. Se o destino for `NONE`, o servidor não escreve consultas, mesmo que o log geral seja habilitado. Definir o nome do arquivo de log não tem efeito no registro se o valor do destino do log não contiver `FILE`.

O reinício do servidor e o esvaziamento do log não geram um novo arquivo de log de consulta geral (embora o esvaziamento o feche e o abra novamente). Para renomear o arquivo e criar um novo, use os seguintes comandos:

```sql
$> mv host_name.log host_name-old.log
$> mysqladmin flush-logs general
$> mv host_name-old.log backup-directory
```

No Windows, use **rename** em vez de **mv**.

Você também pode renomear o arquivo de log de consulta geral durante a execução, desativando o log:

```sql
SET GLOBAL general_log = 'OFF';
```

Com o registro desativado, renomeie o arquivo de registro externamente (por exemplo, a partir da linha de comando). Em seguida, ative o registro novamente:

```sql
SET GLOBAL general_log = 'ON';
```

Esse método funciona em qualquer plataforma e não requer reinício do servidor.

Para desabilitar ou habilitar o registro de consultas gerais para a sessão atual, defina a variável de sessão `sql_log_off` para `ON` ou `OFF`. (Isso pressupõe que o próprio log de consulta geral esteja habilitado.)

As senhas nas declarações escritas no log de consulta geral são reescritas pelo servidor para não ocorrerem literalmente em texto simples. A reescrita de senhas pode ser suprimida para o log de consulta geral iniciando o servidor com a opção `--log-raw`. Esta opção pode ser útil para fins de diagnóstico, para ver o texto exato das declarações recebidas pelo servidor, mas por razões de segurança não é recomendada para uso em produção. Veja também Seção 6.1.2.3, “Senhas e Registro”.

Uma implicação da reescrita de senhas é que as declarações que não podem ser analisadas (devido, por exemplo, a erros de sintaxe) não são escritas no log de consulta geral, porque não é possível saber se elas estão livres de senhas. Casos de uso que exigem o registro de todas as declarações, incluindo aquelas com erros, devem usar a opção `--log-raw`, tendo em mente que isso também ignora a reescrita de senhas.

A reescrita da senha ocorre apenas quando se espera uma senha em texto simples. Para declarações com sintaxe que esperam um valor de hash de senha, não ocorre reescrita. Se uma senha em texto simples for fornecida erroneamente para tal sintaxe, a senha é registrada como fornecida, sem reescrita. Por exemplo, a seguinte declaração é registrada conforme mostrado porque um valor de hash de senha é esperado:

```sql
CREATE USER 'user1'@'localhost' IDENTIFIED BY PASSWORD 'not-so-secret';
```

A variável de sistema `log_timestamps` controla o fuso horário dos timestamps nas mensagens escritas no arquivo de log de consultas gerais (assim como no arquivo de log de consultas lentas e no log de erros). Ela não afeta o fuso horário das mensagens do arquivo de log de consultas gerais e do arquivo de log de consultas lentas escritas em tabelas de log, mas as linhas recuperadas dessas tabelas podem ser convertidas do fuso horário do sistema local para qualquer fuso horário desejado com `CONVERT_TZ()` ou definindo a variável de sistema `time_zone` da sessão.
