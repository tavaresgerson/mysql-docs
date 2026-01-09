## 5.4 Registros do servidor MySQL

5.4.1 Selecionando destinos de saída do Log de consulta geral e do Log de consulta lenta

5.4.2 Diário de Erros

5.4.3 O Log de Consulta Geral

5.4.4 O Log Binário

5.4.5 O Log de Consultas Lentas

5.4.6 O Log do DDL

5.4.7 Manutenção do log do servidor

O MySQL Server tem vários logs que podem ajudá-lo a descobrir quais atividades estão ocorrendo.

<table summary="Tipos de log do MySQL Server e as informações escritas em cada log."><thead><tr> <th>Tipo de log (registro)</th> <th>Informações escritas no log</th> </tr></thead><tbody><tr> <td>Registro de erros</td> <td>Problemas encontrados ao iniciar, executar ou parar<a class="link" href="mysqld.html" title="4.3.1 mysqld — O Servidor MySQL"><span class="command"><strong>mysqld</strong></span></a></td> </tr><tr> <td>Registro de consulta geral</td> <td>Conexões com clientes estabelecidas e declarações recebidas dos clientes</td> </tr><tr> <td>Registro binário</td> <td>Declarações que alteram dados (também utilizadas para replicação)</td> </tr><tr> <td>Registro de relé</td> <td>Alterações de dados recebidas de um servidor de origem de replicação</td> </tr><tr> <td>Registro de consultas lentas</td> <td>Consultas que levaram mais de<a class="link" href="server-system-variables.html#sysvar_long_query_time">[[<code>long_query_time</code>]]</a>segundos para executar</td> </tr><tr> <td>Registro DDL (registro de metadados)</td> <td>Operações de metadados realizadas por declarações DDL</td> </tr></tbody></table>

Por padrão, nenhum log é ativado, exceto o log de erro no Windows. (O log DDL é sempre criado quando necessário e não tem opções configuráveis pelo usuário; veja Seção 5.4.6, “O Log DDL”.) As seções específicas dos logs fornecem informações sobre as opções do servidor que permitem a logon.

Por padrão, o servidor escreve arquivos para todos os logs habilitados no diretório de dados. Você pode forçar o servidor a fechar e reabrir os arquivos de log (ou, em alguns casos, alternar para um novo arquivo de log) ao limpar os logs. A limpeza de logs ocorre quando você emite uma declaração `FLUSH LOGS`; execute **mysqladmin** com um argumento `flush-logs` ou `refresh`; ou execute **mysqldump** com a opção `--flush-logs`. Veja Seção 13.7.6.3, “Instrução FLUSH”, Seção 4.5.2, “mysqladmin — Um Programa de Administração do Servidor MySQL” e Seção 4.5.4, “mysqldump — Um Programa de Backup de Bancos de Dados”. Além disso, o log binário é limpo quando seu tamanho atinge o valor da variável de sistema `max_binlog_size`.

Você pode controlar os registros de consultas gerais e consultas lentas durante a execução. Você pode habilitar ou desabilitar o registro ou alterar o nome do arquivo de registro. Você pode informar ao servidor para escrever as entradas de consultas gerais e consultas lentas em tabelas de registro, arquivos de registro ou em ambos. Para obter detalhes, consulte Seção 5.4.1, “Selecionando destinos de saída de registro de consulta geral e registro de consulta lenta”, Seção 5.4.3, “O registro de consulta geral” e Seção 5.4.5, “O registro de consulta lenta”.

O log de retransmissão é usado apenas em réplicas, para armazenar as alterações de dados do servidor de origem da replicação que também devem ser feitas na replica. Para discussão sobre o conteúdo e a configuração do log de retransmissão, consulte Seção 16.2.4.1, “O Log de Retransmissão”.

Para obter informações sobre operações de manutenção de logs, como a expiração de arquivos de log antigos, consulte Seção 5.4.7, “Manutenção de Logs do Servidor”.

Para obter informações sobre como manter os registros seguros, consulte Seção 6.1.2.3, “Senhas e Registro de Eventos”.
