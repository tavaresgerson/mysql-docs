#### 15.7.8.8 Declaração de RESTART

```
RESTART
```

Esta declaração para o MySQL para parar e reiniciar o servidor. Ela requer o privilégio `SHUTDOWN`.

Uma utilização para `RESTART` é quando não é possível ou conveniente obter acesso à linha de comando ao servidor MySQL no host do servidor para reiniciá-lo. Por exemplo, `SET PERSIST_ONLY` pode ser usado em tempo de execução para fazer alterações na configuração de variáveis de sistema que podem ser definidas apenas no início do servidor, mas o servidor ainda deve ser reiniciado para que essas alterações tenham efeito. A declaração `RESTART` fornece uma maneira de fazer isso dentro das sessões do cliente, sem exigir acesso à linha de comando no host do servidor.

Nota

Após executar uma declaração `RESTART`, o cliente pode esperar que a conexão atual seja perdida. Se o auto-reconexão estiver habilitado, a conexão é restabelecida após o reinício do servidor. Caso contrário, a conexão deve ser restabelecida manualmente.

Uma operação bem-sucedida de `RESTART` requer que o **mysqld** esteja em execução em um ambiente que tenha um processo de monitoramento disponível para detectar um desligamento do servidor realizado para fins de reinício:

* Na presença de um processo de monitoramento, `RESTART` faz com que o **mysqld** termine para que o processo de monitoramento possa determinar que deve iniciar uma nova instância do **mysqld**.

* Se não houver processo de monitoramento presente, `RESTART` falha com um erro.

Essas plataformas fornecem o suporte de monitoramento necessário para a declaração `RESTART`:

* Windows, quando o **mysqld** é iniciado como um serviço do Windows ou de forma independente. (O **mysqld** se divide, e um processo atua como monitor para o outro, que atua como o servidor.)

* Sistemas Unix e semelhantes que usam systemd ou **mysqld_safe** para gerenciar o **mysqld**.

Para configurar um ambiente de monitoramento de modo que o **mysqld** habilite a declaração `RESTART`:

1. Defina a variável de ambiente `MYSQLD_PARENT_PID` com o valor do ID de processo do processo que inicia o **mysqld**, antes de iniciar o **mysqld**.

2. Quando o **mysqld** realiza uma parada devido ao uso da instrução `RESTART`, ele retorna o código de saída 16.

3. Quando o processo de monitoramento detecta um código de saída de 16, ele reinicia o **mysqld**. Caso contrário, ele sai.

Aqui está um exemplo mínimo conforme implementado no shell **bash**:

```
#!/bin/bash

export MYSQLD_PARENT_PID=$$

export MYSQLD_RESTART_EXIT=16

while true ; do
  bin/mysqld mysqld options here
  if [ $? -ne $MYSQLD_RESTART_EXIT ]; then
    break
  fi
done
```

No Windows, o forking usado para implementar `RESTART` torna mais difícil determinar o processo do servidor para o qual se deseja anexar para depuração. Para aliviar isso, iniciar o servidor com `--gdb` suprime o forking, além de suas outras ações realizadas para configurar um ambiente de depuração. Em configurações não de depuração, `--no-monitor` pode ser usado apenas para suprimir o forking do processo de monitoramento. Para um servidor iniciado com `--gdb` ou `--no-monitor`, a execução de `RESTART` faz com que o servidor simplesmente saia sem reiniciar.

A variável de status `Com_restart` rastreia o número de instruções `RESTART`. Como as variáveis de status são inicializadas para cada inicialização do servidor e não persistem em reinicializações, `Com_restart` normalmente tem um valor de zero, mas pode ser diferente de zero se as instruções `RESTART` forem executadas, mas falharem.