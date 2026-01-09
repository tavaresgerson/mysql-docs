#### 25.6.2.4 NDB Cluster: Erros do Transportador NDB

Esta seção lista códigos de erro, nomes e mensagens que são escritos no log do cluster no caso de erros do transportador.

0x00:   TE_NO_ERROR

    Sem erro

0x01:   TE_ERROR_CLOSING_SOCKET

    Erro encontrado durante a fechamento da conexão de rede

0x02:   TE_ERROR_IN_SELECT_BEFORE_ACCEPT

    Erro encontrado antes do aceitação. O transportador tentará novamente

0x03:   TE_INVALID_MESSAGE_LENGTH

    Erro encontrado na mensagem (tamanho de mensagem inválido)

0x04:   TE_INVALID_CHECKSUM

    Erro encontrado na mensagem (checksum)

0x05:   TE_COULD_NOT_CREATE_SOCKET

    Erro encontrado ao criar a conexão de rede (não é possível criar a conexão de rede)

0x06:   TE_COULD_NOT_BIND_SOCKET

    Erro encontrado ao vincular a conexão de rede do servidor

0x07:   TE_LISTEN_FAILED

    Erro encontrado ao ouvir a conexão de rede do servidor

0x08:   TE_ACCEPT_RETURN_ERROR

    Erro encontrado durante a aceitação (erro de retorno da aceitação)

0x0b:   TE_SHM_DISCONNECT

    O nó remoto se desconectou

0x0c:   TE_SHM_IPC_STAT

    Não foi possível verificar o segmento SHM

0x0d:   TE_SHM_UNABLE_TO_CREATE_SEGMENT

    Não foi possível criar o segmento SHM

0x0e:   TE_SHM_UNABLE_TO_ATTACH_SEGMENT

    Não foi possível anexar o segmento SHM

0x0f:   TE_SHM_UNABLE_TO_REMOVE_SEGMENT

    Não foi possível remover o segmento SHM

0x10:   TE_TOO_SMALL_SIGID

    ID de sinal muito pequeno

0x11:   TE_TOO_LARGE_SIGID

    ID de sinal muito grande

0x12:   TE_WAIT_STACK_FULL

    A pilha de espera estava cheia

0x13:   TE_RECEIVE_BUFFER_FULL

    O buffer de recebimento estava cheio

0x14:   TE_SIGNAL_LOST_SEND_BUFFER_FULL

    O buffer de envio estava cheio e a tentativa de enviar com força falhou

0x15:   TE_SIGNAL_LOST

    O envio falhou por motivo desconhecido (perda de sinal)

0x16:   TE_SEND_BUFFER_FULL

    O buffer de envio estava cheio, mas dormir por um tempo resolveu o problema

0x21: TE_SHM_IPC_PERMANENTE

Erro permanente do Shm ipc

Observação

Os códigos de erro do transportador de 0x17 a 0x20 e 0x22 estão reservados para conexões SCI, que não são suportadas nesta versão do NDB Cluster, e, portanto, não estão incluídos aqui.