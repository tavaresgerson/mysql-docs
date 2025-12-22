### 7.4.3 Registro Geral de Consultas

O log de consulta geral é um registro geral do que `mysqld` está fazendo. O servidor escreve informações para este log quando os clientes se conectam ou se desconectam, e registra cada instrução SQL recebida dos clientes. O log de consulta geral pode ser muito útil quando você suspeita de um erro em um cliente e quer saber exatamente o que o cliente enviou para `mysqld`.

Cada linha que mostra quando um cliente se conecta também inclui `using connection_type` para indicar o protocolo usado para estabelecer a conexão. `connection_type` é um dos `TCP/IP` (conexão TCP/IP estabelecida sem SSL), `SSL/TLS` (conexão TCP/IP estabelecida com SSL), `Socket` (conexão de arquivo de soquete Unix), `Named Pipe` (conexão de tubo com nome do Windows), ou `Shared Memory` (conexão de memória compartilhada do Windows).

`mysqld` escreve instruções para o log de consulta na ordem em que as recebe, que pode diferir da ordem em que são executadas. Esta ordem de registro é em contraste com a do log binário, para o qual as instruções são escritas após serem executadas, mas antes de quaisquer bloqueios serem liberados. Além disso, o log de consulta pode conter instruções que apenas selecionam dados, enquanto essas instruções nunca são escritas no log binário.

Ao usar o registro binário baseado em instruções em um servidor de origem de replicação, as instruções recebidas por suas réplicas são escritas no registro de consulta de cada réplica.

No entanto, ao usar o registro binário baseado em linhas, as atualizações são enviadas como alterações de linhas em vez de instruções SQL, e, portanto, essas instruções nunca são escritas no registro de consulta quando `binlog_format` é `ROW`.

Por padrão, o log de consulta geral está desativado. Para especificar o estado inicial do log de consulta geral explicitamente, use `--general_log[={0|1}]`. Sem argumento ou com um argumento de 1, `--general_log` habilita o log. Com um argumento de 0, esta opção desativa o log. Para especificar um nome de arquivo de log, use `--general_log_file=file_name`. Para especificar o destino do log, use a variável de sistema `log_output` (como descrito na Seção 7.4.1, Selecionando Log de consulta geral e Destinos de saída de consulta lenta).

::: info Note

Se você especificar o `TABLE` destino do log, veja Tabelas de log e Arquivos abertos em excesso Erros.

:::

Se você não especificar nenhum nome para o arquivo de registro de consulta geral, o nome padrão é `host_name.log`. O servidor cria o arquivo no diretório de dados a menos que um nome de caminho absoluto seja dado para especificar um diretório diferente.

Para desativar ou habilitar o registro de consulta geral ou alterar o nome do arquivo de registro no tempo de execução, use as variáveis de sistema globais `general_log` e `general_log_file`. Defina `general_log` para 0 (ou `OFF`) para desativar o registro ou para 1 (ou `ON`) para habilitá-lo. Defina `general_log_file` para especificar o nome do arquivo de registro. Se um arquivo de registro já estiver aberto, ele será fechado e o novo arquivo será aberto.

Quando o log de consulta geral está habilitado, o servidor escreve a saída para qualquer destino especificado pela variável de sistema `log_output`. Se você habilitar o log, o servidor abre o arquivo de log e escreve mensagens de inicialização para ele. No entanto, o log de consultas adicionais para o arquivo não ocorre a menos que o destino de log `FILE` seja selecionado. Se o destino for `NONE`, o servidor não escreve consultas mesmo que o log geral esteja habilitado. A definição do nome do arquivo de log não tem efeito no log se o valor de log de destino não contiver `FILE`.

Reinicializações do servidor e lavagem de logs não fazem com que um novo arquivo de log de consulta geral seja gerado (embora o lavagem o feche e reabra).

```
$> mv host_name.log host_name-old.log
$> mysqladmin flush-logs general
$> mv host_name-old.log backup-directory
```

No Windows, use **rename** em vez de **mv**.

Você também pode renomear o arquivo de registro de consulta geral no tempo de execução desativando o registro:

```
SET GLOBAL general_log = 'OFF';
```

Com o log desativado, renomeie o arquivo de log externamente (por exemplo, a partir da linha de comando).

```
SET GLOBAL general_log = 'ON';
```

Este método funciona em qualquer plataforma e não requer um reinicio do servidor.

Para desativar ou habilitar o registro de consultas gerais para a sessão atual, defina a variável de sessão `sql_log_off` para `ON` ou `OFF`. (Isto assume que o próprio registro de consultas gerais está habilitado.)

As senhas nas instruções escritas no log de consulta geral são reescritas pelo servidor para não ocorrer literalmente em texto simples. A reescritura de senhas pode ser suprimida para o log de consulta geral iniciando o servidor com a opção `--log-raw`. Esta opção pode ser útil para fins de diagnóstico, para ver o texto exato das instruções recebidas pelo servidor, mas por razões de segurança não é recomendada para uso de produção.

Uma implicação da reescrita de senha é que as instruções que não podem ser analisadas (devido, por exemplo, a erros de sintaxe) não são escritas no log de consulta geral porque não podem ser conhecidas como livres de senha.

A reescrita de senha ocorre apenas quando senhas de texto simples são esperadas. Para instruções com sintaxe que esperam um valor de hash de senha, nenhuma reescrita ocorre. Se uma senha de texto simples for fornecida erroneamente para tal sintaxe, a senha é registrada como dada, sem reescrita.

A variável de sistema `log_timestamps` controla o fuso horário das marcas de tempo nas mensagens escritas no arquivo de registro de consulta geral (bem como no arquivo de registro de consulta lenta e no registro de erros). Ela não afeta o fuso horário do registro de consulta geral e das mensagens de registro de consulta lenta escritas nas tabelas de registro, mas as linhas recuperadas dessas tabelas podem ser convertidas do fuso horário do sistema local para qualquer fuso horário desejado com `CONVERT_TZ()` ou definindo a variável de sistema `time_zone` de sessão.
