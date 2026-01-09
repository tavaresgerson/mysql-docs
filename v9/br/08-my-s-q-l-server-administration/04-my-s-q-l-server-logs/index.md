## 7.4 Logs do Servidor MySQL

7.4.1 Selecionando destinos de saída do Log de Consultas Gerais e do Log de Consultas Lentas

7.4.2 O Log de Erros

7.4.3 O Log de Consultas Gerais

7.4.4 O Log Binário

7.4.5 O Log de Consultas Lentas

7.4.6 Manutenção do Log do Servidor

O Servidor MySQL tem vários logs que podem ajudá-lo a descobrir quais atividades estão ocorrendo.

<table summary="Tipos de log do servidor MySQL e as informações escritas em cada log."><thead><tr> <th>Tipo de Log</th> <th>Informações Escritas no Log</th> </tr></thead><tbody><tr> <td>Log de Erros</td> <td>Problemas encontrados ao iniciar, executar ou parar <a class="link" href="mysqld.html" title="6.3.1 mysqld — O Servidor MySQL"><span class="command"><strong>mysqld</strong></span></a></td> </tr><tr> <td>Log de Consultas Gerais</td> <td>Conexões estabelecidas com clientes e instruções recebidas dos clientes</td> </tr><tr> <td>Log Binário</td> <td>Instruções que alteram dados (também usadas para replicação)</td> </tr><tr> <td>Log de Relevo</td> <td>Alterações de dados recebidas de um servidor de origem de replicação</td> </tr><tr> <td>Log de Consultas Lentas</td> <td>Consultas que levaram mais de <a class="link" href="server-system-variables.html#sysvar_long_query_time"><code class="literal">long_query_time</code></a> segundos para executar</td> </tr><tr> <td>Logs de DDL</td> <td>Operações DDL atômicas realizadas por instruções DDL</td> </tr></tbody></table>

Por padrão, nenhum log está habilitado, exceto o log de erros no Windows. Para obter informações sobre o comportamento do log de DDL, consulte Visualizar Logs de DDL. As seções específicas de log a seguir fornecem informações sobre as opções do servidor que habilitam o registro.

Por padrão, o servidor escreve arquivos para todos os logs habilitados no diretório de dados. Você pode forçar o servidor a fechar e reabrir os arquivos de log (ou, em alguns casos, alternar para um novo arquivo de log) ao limpar os logs. A limpeza de logs ocorre quando você emite uma declaração `FLUSH LOGS`; execute **mysqladmin** com um argumento `flush-logs` ou `refresh`; ou execute **mysqldump** com a opção `--flush-logs`. Veja a Seção 15.7.8.3, “Declaração FLUSH”, a Seção 6.5.2, “mysqladmin — Um Programa de Administração do Servidor MySQL” e a Seção 6.5.4, “mysqldump — Um Programa de Backup de Bancos de Dados”. Além disso, o log binário é limpo quando seu tamanho atinge o valor da variável de sistema `max_binlog_size`.

Você pode controlar os logs de consultas gerais e consultas lentas durante a execução. Você pode habilitar ou desabilitar o registro ou alterar o nome do arquivo de log. Você pode dizer ao servidor para escrever entradas de consultas gerais e consultas lentas em tabelas de log, arquivos de log ou ambos. Para detalhes, veja a Seção 7.4.1, “Selecionando Destinos de Saída de Log de Consulta Geral e Log de Consulta Lenta”, a Seção 7.4.3, “O Log de Consulta Geral” e a Seção 7.4.5, “O Log de Consulta Lenta”.

O log de retransmissão é usado apenas em réplicas, para armazenar alterações de dados do servidor de origem da replicação que também devem ser feitas na replica. Para discussão sobre o conteúdo e a configuração do log de retransmissão, veja a Seção 19.2.4.1, “O Log de Retransmissão”.

Para informações sobre operações de manutenção de logs, como a expiração de arquivos de log antigos, veja a Seção 7.4.6, “Manutenção de Log do Servidor”.

Para informações sobre como manter os logs seguros, veja a Seção 8.1.2.3, “Senhas e Registro”.