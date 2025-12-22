## 7.4 Registros do Servidor MySQL

O MySQL Server tem vários logs que podem ajudá-lo a descobrir qual atividade está ocorrendo.

<table><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Tipo de tronco</th> <th>Informações escritas no log</th> </tr></thead><tbody><tr> <td>Registro de erros</td> <td>Problemas de arranque, funcionamento ou paragem<span><strong>- Não ,</strong></span></td> </tr><tr> <td>Registro geral de consultas</td> <td>Relações estabelecidas com clientes e declarações recebidas de clientes</td> </tr><tr> <td>Registro binário</td> <td>Declarações que alteram dados (também usadas para replicação)</td> </tr><tr> <td>Registro de relés</td> <td>Alterações de dados recebidas de um servidor de origem de replicação</td> </tr><tr> <td>Registro de consultas lento</td> <td>Consultas que levaram mais de [[<code>long_query_time</code>]] segundos para serem executadas</td> </tr><tr> <td>Registros DDL</td> <td>Operações DDL atômicas executadas por instruções DDL</td> </tr></tbody></table>

Por padrão, nenhum log é habilitado, exceto o log de erro no Windows. Para informações sobre o comportamento do log DDL, consulte Visualização de logs DDL. As seções específicas de logs a seguir fornecem informações sobre as opções do servidor que habilitam o registro.

Por padrão, o servidor escreve arquivos para todos os registros habilitados no diretório de dados. Você pode forçar o servidor a fechar e reabrir os arquivos de log (ou, em alguns casos, mudar para um novo arquivo de log) lavando os registros. A lavagem de log ocorre quando você emite uma instrução `FLUSH LOGS`; executa `mysqladmin` com um argumento `flush-logs` ou `refresh`; ou executa `mysqldump` com uma opção `--flush-logs`. Veja Seção 15.7.8.3, FLUSH Statement, Seção 6.5.2, mysqladmin  Seção MySQL Server Administration Program, e 6.5.4, mysqldump  A Database Backup Program. Além disso, o log binário é lavado quando o tamanho atinge o valor da variável do sistema \[\[CODE\_PH\_4]].

Você pode controlar a consulta geral e os registros de consulta lenta durante o tempo de execução. Você pode ativar ou desativar o registro, ou alterar o nome do arquivo de registro. Você pode dizer ao servidor para escrever entradas de consulta geral e consulta lenta para tabelas de registro, arquivos de registro, ou ambos. Para detalhes, consulte a Seção 7.4.1, Seleção de destino de saída de registro de consulta geral e registro de consulta lenta, Seção 7.4.3, O registro de consulta geral, e Seção 7.4.5, O registro de consulta lenta.

O log de retransmissão é usado apenas em réplicas, para manter alterações de dados do servidor de origem da réplica que também devem ser feitas na réplica.

Para obter informações sobre as operações de manutenção de registos, tais como a expiração dos ficheiros de registo antigos, ver secção 7.4.6, "Manutenção de registos de servidor".

Para obter informações sobre a segurança dos registos, ver Secção 8.1.2.3, Passwords and Logging.
