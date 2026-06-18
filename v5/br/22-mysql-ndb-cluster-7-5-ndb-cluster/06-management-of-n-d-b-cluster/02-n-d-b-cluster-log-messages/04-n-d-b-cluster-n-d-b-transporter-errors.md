#### 21.6.2.4 NDB Cluster: Erros do Transporter NDB

Esta seção lista os códigos de erro, nomes e mensagens que são gravados no log do cluster no caso de erros do Transporter.

0x00 :   TE_NO_ERROR

    Nenhum erro

0x01 :   TE_ERROR_CLOSING_SOCKET

    Erro encontrado durante o fechamento do socket

0x02 :   TE_ERROR_IN_SELECT_BEFORE_ACCEPT

    Erro encontrado antes do accept. O Transporter tentará novamente

0x03 :   TE_INVALID_MESSAGE_LENGTH

    Erro encontrado na mensagem (comprimento de mensagem inválido)

0x04 :   TE_INVALID_CHECKSUM

    Erro encontrado na mensagem (checksum)

0x05 :   TE_COULD_NOT_CREATE_SOCKET

    Erro encontrado ao criar o socket (não foi possível criar o socket)

0x06 :   TE_COULD_NOT_BIND_SOCKET

    Erro encontrado ao realizar o bind do socket do servidor

0x07 :   TE_LISTEN_FAILED

    Erro encontrado ao escutar o socket do servidor

0x08 :   TE_ACCEPT_RETURN_ERROR

    Erro encontrado durante o accept (erro de retorno do accept)

0x0b :   TE_SHM_DISCONNECT

    O node remoto foi desconectado

0x0c :   TE_SHM_IPC_STAT

    Não foi possível verificar o segmento shm

0x0d :   TE_SHM_UNABLE_TO_CREATE_SEGMENT

    Não foi possível criar o segmento shm

0x0e :   TE_SHM_UNABLE_TO_ATTACH_SEGMENT

    Não foi possível anexar (attach) o segmento shm

0x0f :   TE_SHM_UNABLE_TO_REMOVE_SEGMENT

    Não foi possível remover o segmento shm

0x10 :   TE_TOO_SMALL_SIGID

    ID de Sig muito pequeno

0x11 :   TE_TOO_LARGE_SIGID

    ID de Sig muito grande

0x12 :   TE_WAIT_STACK_FULL

    A stack de espera estava cheia

0x13 :   TE_RECEIVE_BUFFER_FULL

    O Receive Buffer estava cheio

0x14 :   TE_SIGNAL_LOST_SEND_BUFFER_FULL

    O Send Buffer estava cheio, e tentar forçar o Send falhou

0x15 :   TE_SIGNAL_LOST

    O Send falhou por razão desconhecida (signal lost)

0x16 :   TE_SEND_BUFFER_FULL

    O Send Buffer estava cheio, mas esperar por um momento resolveu

0x21 :   TE_SHM_IPC_PERMANENT

    Erro permanente de Shm ipc

Nota

Os códigos de erro do Transporter 0x17 a 0x20 e 0x22 são reservados para conexões SCI, que não são suportadas nesta versão do NDB Cluster, e, portanto, não estão incluídos aqui.
