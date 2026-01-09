#### 7.5.6.2 Componente de Estatísticas de Controle de Fluxo de Replicação em Grupo

O componente de Estatísticas de Controle de Fluxo de Replicação em Grupo (`component_group_replication_flow_control_stats`) permite o uso de várias variáveis de status globais que fornecem informações sobre a execução do controle de fluxo de replicação em grupo. Este componente está disponível no MySQL 9.5 e versões posteriores como parte da Edição Empresarial do MySQL.

* Propósito: Suporte às variáveis de status globais de Replicação em Grupo, além das normalmente presentes para medir estatísticas relacionadas à execução do controle de fluxo.

* URN: `file://component_group_replication_flow_control_stats`

Antes de instalar o componente de Estatísticas de Controle de Fluxo de Replicação em Grupo, o plugin de Replicação em Grupo deve ser instalado usando `INSTALL PLUGIN` ou `--plugin-load-add` (consulte a Seção 20.2.1.2, “Configurando uma Instância para Replicação em Grupo”); caso contrário, a instrução `INSTALL COMPONENT` é rejeitada com o erro Não é possível satisfazer a dependência para o serviço 'group_replication_flow_control_metrics_service' requerido pelo componente 'mysql:group_replication_flow_control_stats'. Se você tentar desinstalar o plugin de Replicação em Grupo quando o componente de Estatísticas de Controle de Fluxo de Replicação em Grupo estiver instalado, `UNINSTALL PLUGIN` falha com o erro Plugin 'group_replication' não pode ser desinstalado agora. Por favor, desinstale o componente 'component_group_replication_flow_control_stats' e depois desinstale o plugin group_replication.

Dadas essas condições, o componente de Estatísticas de Controle de Fluxo de Replicação em Grupo pode ser instalado e desinstalado usando `INSTALL COMPONENT` e `UNINSTALL COMPONENT`, respectivamente. Consulte as descrições dessas instruções, bem como a Seção 7.5.1, “Instalando e Desinstalando Componentes”, para obter mais informações.

O componente de Controle de Fluxo de Replicação em Grupo fornece as variáveis de status globais listadas aqui com seus significados:

* `Gr_flow_control_throttle_active_count`: O número de transações atualmente sendo reprimidas.

* `Gr_flow_control_throttle_count`: O número de transações que foram reprimidas.

* `Gr_flow_control_throttle_last_throttle_timestamp`: A data e hora mais recentes em que uma transação foi reprimida.

* `Gr_flow_control_throttle_time_sum`: O tempo em microsegundos que as transações foram reprimidas.

Os valores dessas variáveis podem ser obtidos consultando a tabela `global_status` do Schema de Desempenho, conforme mostrado aqui:

```
mysql> SELECT * FROM performance_schema.global_status
    -> WHERE VARIABLE_NAME LIKE 'Gr_flow_control%';
+--------------------------------------------------+---------------------+
| VARIABLE_NAME	                                  | VARIABLE_VALUE      |
+--------------------------------------------------+---------------------+
| Gr_flow_control_throttle_active_count	          | 10                  |
+--------------------------------------------------+---------------------+
| Gr_flow_control_throttle_count	                 | 10                  |
+--------------------------------------------------+---------------------+
| Gr_flow_control_throttle_last_throttle_timestamp | 2024-07-01 12:50:56 |
+--------------------------------------------------+---------------------+
| Gr_flow_control_throttle_time_sum	              | 10                  |
+--------------------------------------------------+---------------------+
```

Você também pode observar esses valores na saída do `SHOW GLOBAL STATUS`, assim:

```
mysql> SHOW GLOBAL STATUS LIKE 'Gr_flow_control%';
+--------------------------------------------------+---------------------+
| Variable_Name	                                  | Value               |
+--------------------------------------------------+---------------------+
| Gr_flow_control_throttle_active_count	          | 10                  |
+--------------------------------------------------+---------------------+
| Gr_flow_control_throttle_count	                 | 10                  |
+--------------------------------------------------+---------------------+
| Gr_flow_control_throttle_last_throttle_timestamp | 2024-07-01 12:50:56 |
+--------------------------------------------------+---------------------+
| Gr_flow_control_throttle_time_sum	              | 10                  |
+--------------------------------------------------+---------------------+
```

Todas as variáveis de status listadas anteriormente são redefinidas sempre que um dos seguintes eventos ocorrer:

* O servidor é reiniciado.
* O grupo é inicializado.
* Um novo membro se junta ou um membro se junta automaticamente.

Como elas refletem o que o membro local observa, todas essas variáveis de status têm escopo de membro.