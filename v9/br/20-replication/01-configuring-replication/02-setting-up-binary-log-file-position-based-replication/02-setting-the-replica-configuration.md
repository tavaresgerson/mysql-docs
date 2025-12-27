#### 19.1.2.2 Configuração da Replicação

Cada replica deve ter um ID de servidor único, conforme especificado pela variável de sistema `server_id`. Se você está configurando múltiplas replicas, cada uma deve ter um valor de `server_id` único que difere do da fonte e de qualquer outra replica. Se o ID de servidor da replica ainda não estiver definido ou se o valor atual estiver em conflito com o valor que você escolheu para a fonte ou para outra replica, você deve alterá-lo.

O valor padrão de `server_id` é

1. Você pode alterar o valor de `server_id` dinamicamente, emitindo uma declaração como esta:

```
SET GLOBAL server_id = 21;
```

Lembre-se de que um valor de 0 para o ID de servidor impede que uma replica se conecte a uma fonte. Se esse valor de ID de servidor (que era o padrão em versões anteriores) foi definido anteriormente, você deve reiniciar o servidor para inicializar a replica com seu novo ID de servidor não nulo. Caso contrário, um reinício do servidor não é necessário quando você altera o ID de servidor, a menos que você faça outras alterações de configuração que o exijam. Por exemplo, se o registro binário foi desativado no servidor e você deseja ativá-lo para sua replica, é necessário reiniciar o servidor para ativar isso.

Se você está desligando o servidor de replicação, você pode editar a seção `[mysqld]` do arquivo de configuração para especificar um ID de servidor único. Por exemplo:

```
[mysqld]
server-id=21
```

O registro binário é ativado por padrão em todos os servidores. Uma replica não é obrigada a ter o registro binário ativado para que a replicação ocorra. No entanto, o registro binário em uma replica significa que o log binário da replica pode ser usado para backups de dados e recuperação em caso de falha. Replicas que têm o registro binário ativado também podem ser usadas como parte de uma topologia de replicação mais complexa. Por exemplo, você pode querer configurar servidores de replicação usando essa disposição em cadeia:

```
A -> B -> C
```

Aqui, `A` serve como a fonte para a réplica `B`, e `B` serve como a fonte para a réplica `C`. Para que isso funcione, `B` deve ser tanto uma fonte *e* uma réplica. As atualizações recebidas de `A` devem ser registradas por `B` em seu log binário, a fim de serem passadas para `C`. Além do registro binário, essa topologia de replicação requer que a variável de sistema `log_replica_updates` esteja habilitada. Com as atualizações de replicação habilitadas, a réplica escreve as atualizações recebidas de uma fonte e realizadas pelo thread SQL da réplica em seu próprio log binário. `log_replica_updates` está habilitado por padrão.

Se você precisar desabilitar o registro binário ou o registro de atualizações de réplica em uma réplica, você pode fazer isso especificando as opções `--skip-log-bin` e `--log-replica-updates=OFF` para a réplica. Se você decidir reativar esses recursos na réplica, remova as opções relevantes e reinicie o servidor.