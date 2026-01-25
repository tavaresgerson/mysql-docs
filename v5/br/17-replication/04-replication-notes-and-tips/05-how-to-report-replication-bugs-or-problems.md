### 16.4.5 Como Reportar Bugs ou Problemas de Replication

Quando você determinar que não há erro do usuário envolvido, e a Replication ainda não funciona ou está instável, é hora de nos enviar um relatório de bug. Precisamos obter o máximo de informações possível para rastrear o bug. Por favor, dedique tempo e esforço na preparação de um bom relatório de bug.

Se você tiver um caso de teste repetível que demonstre o bug, insira-o em nosso Database de bugs usando as instruções fornecidas na [Seção 1.5, “Como Reportar Bugs ou Problemas”](bug-reports.html "1.5 How to Report Bugs or Problems"). Se você tiver um problema “fantasma” (aquele que você não pode duplicar à vontade), use o seguinte procedimento:

1. Verifique se nenhum erro do usuário está envolvido. Por exemplo, se você atualizar a réplica fora da replication thread, os dados ficam fora de sincronia e você pode ter violações de unique key nas atualizações. Neste caso, o SQL thread de replication para e espera que você limpe as tabelas manualmente para sincronizá-las. *Este não é um problema de replication. É um problema de interferência externa que causa a falha da replication.*

2. Execute a réplica com as opções [`--log-slave-updates`](replication-options-binary-log.html#sysvar_log_slave_updates) e [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin). Estas opções fazem com que a réplica registre as atualizações que recebe da origem em seus próprios Binary Logs.

3. Salve todas as evidências antes de redefinir o estado da replication. Se não tivermos nenhuma informação ou apenas informações incompletas, torna-se difícil ou impossível rastrear o problema. As evidências que você deve coletar são:

   * Todos os Binary Log Files da origem
   * Todos os Binary Log Files da réplica
   * A saída de [`SHOW MASTER STATUS`](show-master-status.html "13.7.5.23 SHOW MASTER STATUS Statement") da origem no momento em que você descobriu o problema
   * A saída de [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") da réplica no momento em que você descobriu o problema
   * Logs de erro da origem e da réplica
4. Use [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") para examinar os Binary Logs. O seguinte deve ser útil para encontrar a instrução problemática. *`log_file`* e *`log_pos`* são os valores `Master_Log_File` e `Read_Master_Log_Pos` de [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement").

   ```sql
   $> mysqlbinlog --start-position=log_pos log_file | head
   ```

Depois de coletar as evidências do problema, tente primeiro isolá-lo como um caso de teste separado. Em seguida, insira o problema com o máximo de informações possível em nosso Database de bugs usando as instruções na [Seção 1.5, “Como Reportar Bugs ou Problemas”](bug-reports.html "1.5 How to Report Bugs or Problems").