### 7.4.3 O Log de Consultas Gerais

O log de consultas gerais é um registro geral do que o `mysqld` está fazendo. O servidor escreve informações neste log quando os clientes se conectam ou desconectam, e ele registra cada instrução SQL recebida dos clientes. O log de consultas gerais pode ser muito útil quando você suspeita de um erro em um cliente e deseja saber exatamente o que o cliente enviou para o `mysqld`.

Cada linha que mostra quando um cliente se conecta também inclui `using connection_type` para indicar o protocolo usado para estabelecer a conexão. *`connection_type`* é um dos `TCP/IP` (conexão TCP/IP estabelecida sem SSL), `SSL/TLS` (conexão TCP/IP estabelecida com SSL), `Socket` (conexão de arquivo socket Unix), `Named Pipe` (conexão de pipe nomeada do Windows) ou `Shared Memory` (conexão de memória compartilhada do Windows).

O `mysqld` escreve instruções no log de consultas na ordem em que as recebe, o que pode diferir da ordem em que são executadas. Esse registro em ordem é diferente do registro binário, para o qual as instruções são escritas após serem executadas, mas antes que quaisquer bloqueios sejam liberados. Além disso, o log de consultas pode conter instruções que selecionam dados apenas enquanto essas instruções nunca são escritas no log binário.

Ao usar o registro binário baseado em instruções em um servidor de fonte de replicação, as instruções recebidas por suas réplicas são escritas no log de consultas de cada réplica. As instruções são escritas no log de consultas da fonte se um cliente ler eventos com o utilitário `mysqlbinlog` e passá-los para o servidor.

No entanto, ao usar o registro binário baseado em linhas, as atualizações são enviadas como mudanças de linha em vez de instruções SQL, e, portanto, essas instruções nunca são escritas no log de consultas quando `binlog_format` é `ROW`. Uma atualização dada também pode não ser escrita no log de consultas quando essa variável é definida como `MIXED`, dependendo da instrução usada. Consulte a Seção 19.2.1.1, “Vantagens e Desvantagens da Replicação Baseada em Instruções e Baseada em Linhas”, para mais informações.

Por padrão, o log de consulta geral está desativado. Para especificar explicitamente o estado inicial do log de consulta geral, use `--general_log[={0|1}]`. Sem argumento ou com o argumento 1, `--general_log` habilita o log. Com o argumento 0, essa opção desabilita o log. Para especificar o nome de um arquivo de log, use `--general_log_file=nome_do_arquivo`. Para especificar o destino do log, use a variável de sistema `log_output` (como descrito na Seção 7.4.1, “Selecionando destinos de saída de log de consulta geral e de consulta lenta”).

::: info Nota

Se você especificar o destino `TABLE` do log, consulte Logs de tabelas e erros de “Muitos arquivos abertos”.

:::

Se você não especificar um nome para o arquivo de log de consulta geral, o nome padrão é `nome_do_host.log`. O servidor cria o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente.

Para desabilitar ou habilitar o log de consulta geral ou alterar o nome do arquivo de log em tempo de execução, use as variáveis de sistema globais `general_log` e `general_log_file`. Defina `general_log` para 0 (ou `OFF`) para desabilitar o log ou para 1 (ou `ON`) para habilitá-lo. Defina `general_log_file` para especificar o nome do arquivo de log. Se um arquivo de log já estiver aberto, ele é fechado e um novo arquivo é aberto.

Quando o log de consulta geral é habilitado, o servidor escreve a saída para quaisquer destinos especificados pela variável de sistema `log_output`. Se você habilitar o log, o servidor abre o arquivo de log e escreve mensagens de inicialização nele. No entanto, o registro adicional de consultas no arquivo não ocorre, a menos que o destino `FILE` seja selecionado. Se o destino for `NONE`, o servidor não escreve consultas, mesmo que o log geral esteja habilitado. Definir o nome do arquivo de log não tem efeito no registro se o valor do destino do log não contiver `FILE`.

Reinicializações do servidor e esvaziamento do log não geram um novo arquivo de log de consulta geral (embora o esvaziamento feche e abra o arquivo). Para renomear o arquivo e criar um novo, use os seguintes comandos:

```
$> mv host_name.log host_name-old.log
$> mysqladmin flush-logs general
$> mv host_name-old.log backup-directory
```

No Windows, use `rename` em vez de `mv`.

Você também pode renomear o arquivo de log de consulta geral em tempo de execução desabilitando o log:

```
SET GLOBAL general_log = 'OFF';
```

Com o log desabilitado, renomeie o arquivo de log externamente (por exemplo, a partir da linha de comando). Em seguida, habilite o log novamente:

```
SET GLOBAL general_log = 'ON';
```

Esse método funciona em qualquer plataforma e não requer reinício do servidor.

Para desabilitar ou habilitar o registro de consultas gerais para a sessão atual, defina a variável `sql_log_off` da sessão para `ON` ou `OFF`. (Isso pressupõe que o próprio log de consulta geral esteja habilitado.)

As senhas nas instruções escritas no log de consulta geral são reescritas pelo servidor para não ocorrerem literalmente em texto plano. A reescrita de senhas para o log de consulta geral pode ser suprimida ao iniciar o servidor com a opção `--log-raw`. Essa opção pode ser útil para fins de diagnóstico, para ver o texto exato das instruções recebidas pelo servidor, mas, por razões de segurança, não é recomendada para uso em produção. Veja também a Seção 8.1.2.3, “Senhas e Registro”.

Uma implicação da reescrita de senhas é que instruções que não podem ser analisadas (devido, por exemplo, a erros de sintaxe) não são escritas no log de consulta geral porque não é possível saber se estão livres de senha. Use casos que exigem o registro de todas as instruções, incluindo aquelas com erros, usando a opção `--log-raw`, tendo em mente que isso também ignora a reescrita de senhas.

A reescrita de senhas ocorre apenas quando senhas em texto plano são esperadas. Para instruções com sintaxe que esperam um valor de hash de senha, não ocorre reescrita. Se uma senha em texto plano for fornecida erroneamente para tal sintaxe, a senha é registrada como fornecida, sem reescrita.

A variável de sistema `log_timestamps` controla o fuso horário dos timestamps nas mensagens escritas no arquivo de log de consultas gerais (assim como no arquivo de log de consultas lentas e no log de erros). Ela não afeta o fuso horário das mensagens do log de consultas gerais e do log de consultas lentas escritas em tabelas de log, mas as linhas recuperadas dessas tabelas podem ser convertidas do fuso horário do sistema local para qualquer fuso horário desejado com `CONVERT_TZ()` ou definindo a variável de sistema `time_zone` da sessão.