#### B.3.2.3 Conexão perdida com o servidor MySQL

Existem três causas prováveis para essa mensagem de erro.

Normalmente, isso indica problemas de conectividade à rede e você deve verificar a condição da sua rede se esse erro ocorrer com frequência. Se a mensagem de erro incluir "durante a consulta", provavelmente esse é o caso que você está enfrentando.

Às vezes, o formulário "durante a consulta" ocorre quando milhões de linhas estão sendo enviadas como parte de uma ou mais consultas. Se você souber que isso está acontecendo, tente aumentar [`net_read_timeout`](server-system-variables.html#sysvar_net_read_timeout) do seu valor padrão de 30 segundos para 60 segundos ou mais, suficiente para que a transferência de dados seja concluída.

Mais raramente, isso pode acontecer quando o cliente está tentando a conexão inicial com o servidor. Nesse caso, se o valor de [`connect_timeout`](server-system-variables.html#sysvar_connect_timeout) estiver definido para apenas alguns segundos, você pode resolver o problema aumentando-o para dez segundos, talvez mais se você tiver uma distância muito longa ou uma conexão lenta. Você pode determinar se está enfrentando essa causa menos comum usando `SHOW GLOBAL STATUS LIKE 'Aborted_connects'`. Ele aumenta em um para cada tentativa de conexão inicial que o servidor interrompe. Você pode ver “leitura do pacote de autorização” como parte da mensagem de erro; se sim, isso também sugere que essa é a solução que você precisa.

Se a causa não for nenhuma das descritas acima, você pode estar enfrentando um problema com valores de [`BLOB`](blob.html) maiores que [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet), o que pode causar esse erro com alguns clientes. Às vezes, você pode ver um erro [`ER_NET_PACKET_TOO_LARGE`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_net_packet_too_large) e isso confirma que você precisa aumentar [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet).
