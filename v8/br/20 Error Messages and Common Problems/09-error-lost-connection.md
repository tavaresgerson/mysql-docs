#### B.3.2.3 Conexão perdida com o servidor MySQL

Existem três causas prováveis para essa mensagem de erro.

Normalmente, indica problemas de conectividade de rede e você deve verificar o estado da sua rede se esse erro ocorrer com frequência. Se a mensagem de erro incluir “durante a consulta”, provavelmente esse é o caso que você está enfrentando.

Às vezes, o formulário “durante a consulta” acontece quando milhões de linhas estão sendo enviadas como parte de uma ou mais consultas. Se você sabe que isso está acontecendo, você deve tentar aumentar o `net_read_timeout` de seu valor padrão de 30 segundos para 60 segundos ou mais, suficiente para que a transferência de dados seja concluída.

Mais raramente, pode acontecer quando o cliente está tentando a conexão inicial com o servidor. Nesse caso, se o valor de `connect_timeout` estiver definido para apenas alguns segundos, você pode resolver o problema aumentando-o para dez segundos, talvez mais se você tiver uma distância muito longa ou uma conexão lenta. Você pode determinar se está enfrentando essa causa menos comum usando `SHOW GLOBAL STATUS LIKE 'Aborted_connects'`. Ele aumenta em um para cada tentativa de conexão inicial que o servidor aborrece. Você pode ver “leitura de pacote de autorização” como parte da mensagem de erro; se sim, isso também sugere que essa é a solução que você precisa.

Se a causa não for nenhuma das descritas acima, você pode estar enfrentando um problema com valores `BLOB` que são maiores que `max_allowed_packet`, o que pode causar esse erro com alguns clientes. Às vezes, você pode ver um erro `ER_NET_PACKET_TOO_LARGE` e isso confirma que você precisa aumentar `max_allowed_packet`.