#### 19.1.2.2 Configuração de replicação

Cada réplica deve ter um ID de servidor único, conforme especificado pela variável de sistema `server_id`. Se você está configurando múltiplas réplicas, cada uma deve ter um valor único `server_id` que difira do da fonte e de qualquer outra réplica. Se o ID de servidor da réplica ainda não estiver definido ou o valor atual estiver em conflito com o valor que você escolheu para a fonte ou outra réplica, você deve alterá-lo.

O valor padrão `server_id` é

1. Você pode alterar o valor `server_id` dinamicamente emitindo uma declaração como esta:

```
SET GLOBAL server_id = 21;
```

Observe que um valor de 0 para o ID do servidor impede que uma réplica se conecte a uma fonte. Se esse valor de ID do servidor (que era o padrão em versões anteriores) foi definido anteriormente, você deve reiniciar o servidor para inicializar a réplica com seu novo ID de servidor não nulo. Caso contrário, um reinício do servidor não é necessário quando você altera o ID do servidor, a menos que você faça outras alterações de configuração que o exijam. Por exemplo, se o registro binário foi desativado no servidor e você deseja ativá-lo para sua réplica, um reinício do servidor é necessário para ativar isso.

Se você estiver desligando o servidor de replicação, pode editar a seção `[mysqld]` do arquivo de configuração para especificar um ID de servidor único. Por exemplo:

```
[mysqld]
server-id=21
```

O registro binário está habilitado por padrão em todos os servidores. Uma replica não precisa ter o registro binário habilitado para que a replicação ocorra. No entanto, o registro binário em uma replica significa que o log binário da replica pode ser usado para backups de dados e recuperação em caso de falha. Replicas que têm o registro binário habilitado também podem ser usadas como parte de uma topologia de replicação mais complexa. Por exemplo, você pode querer configurar servidores de replicação usando essa disposição em cadeia:

```
A -> B -> C
```

Aqui, `A` serve como fonte para a replica `B`, e `B` serve como fonte para a replica `C`. Para que isso funcione, `B` deve ser tanto uma fonte *e* uma replica. As atualizações recebidas de `A` devem ser registradas por `B` em seu log binário, a fim de serem passadas para `C`. Além do registro binário, essa topologia de replicação requer que a variável de sistema `log_replica_updates` (a partir do MySQL 8.0.26) ou `log_slave_updates` (antes do MySQL 8.0.26) seja habilitada. Com as atualizações de replica ativadas, a replica escreve as atualizações recebidas de uma fonte e realizadas pelo thread SQL da replica em seu próprio log binário. A variável de sistema `log_replica_updates` ou `log_slave_updates` é habilitada por padrão.

Se você precisar desativar o registro binário ou o registro de atualização de réplica em uma réplica, você pode fazer isso especificando as opções `--skip-log-bin` e `--log-replica-updates=OFF` ou `--log-slave-updates=OFF` para a réplica. Se você decidir reativar esses recursos na réplica, remova as opções relevantes e reinicie o servidor.
