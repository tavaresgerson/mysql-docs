#### 25.6.2.4 NDB Cluster: Erros do Transportador NDB

Esta seção lista códigos de erro, nomes e mensagens que são escritos no log do cluster no caso de erros do transportador.

0x00:   TE\_NO\_ERROR

    Sem erro

0x01:   TE\_ERROR\_CLOSING\_SOCKET

    Erro encontrado durante a fechamento da conexão de rede

0x02:   TE\_ERROR\_IN\_SELECT\_BEFORE\_ACCEPT

    Erro encontrado antes do aceitação. O transportador tentará novamente

0x03:   TE\_INVALID\_MESSAGE\_LENGTH

    Erro encontrado na mensagem (tamanho de mensagem inválido)

0x04:   TE\_INVALID\_CHECKSUM

    Erro encontrado na mensagem (checksum)

0x05:   TE\_COULD\_NOT\_CREATE\_SOCKET

    Erro encontrado ao criar a conexão de rede (não é possível criar a conexão de rede)

0x06:   TE\_COULD\_NOT\_BIND\_SOCKET

    Erro encontrado ao vincular a conexão de rede do servidor

0x07:   TE\_LISTEN\_FAILED

    Erro encontrado ao ouvir a conexão de rede do servidor

0x08:   TE\_ACCEPT\_RETURN\_ERROR

    Erro encontrado durante a aceitação (erro de retorno da aceitação)

0x0b:   TE\_SHM\_DISCONNECT

    O nó remoto se desconectou

0x0c:   TE\_SHM\_IPC\_STAT

    Não foi possível verificar o segmento SHM

0x0d:   TE\_SHM\_UNABLE\_TO\_CREATE\_SEGMENT

    Não foi possível criar o segmento SHM

0x0e:   TE\_SHM\_UNABLE\_TO\_ATTACH\_SEGMENT

    Não foi possível anexar o segmento SHM

0x0f:   TE\_SHM\_UNABLE\_TO\_REMOVE\_SEGMENT

    Não foi possível remover o segmento SHM

0x10:   TE\_TOO\_SMALL\_SIGID

    ID de sinal muito pequeno

0x11:   TE\_TOO\_LARGE\_SIGID

    ID de sinal muito grande

0x12:   TE\_WAIT\_STACK\_FULL

    A pilha de espera estava cheia

0x13:   TE\_RECEIVE\_BUFFER\_FULL

    O buffer de recebimento estava cheio

0x14:   TE\_SIGNAL\_LOST\_SEND\_BUFFER\_FULL

    O buffer de envio estava cheio e a tentativa de enviar com força falhou

0x15:   TE\_SIGNAL\_LOST

    O envio falhou por motivo desconhecido (perda de sinal)

0x16:   TE\_SEND\_BUFFER\_FULL

    O buffer de envio estava cheio, mas dormir por um tempo resolveu o problema

0x21: TE\_SHM\_IPC\_PERMANENTE

Erro permanente do Shm ipc

Observação

Os códigos de erro do transportador de 0x17 a 0x20 e 0x22 estão reservados para conexões SCI, que não são suportadas nesta versão do NDB Cluster, e, portanto, não estão incluídos aqui.