#### B.3.3.4 Como o MySQL lida com um disco inteiro

Esta seção descreve como o MySQL responde a erros de disco cheio (como "sem espaço no dispositivo") e a erros de excedente de quota (como "escrever falhou" ou "limite de bloqueio do usuário atingido").

Esta seção é relevante para gravações em tabelas `MyISAM`. Ela também se aplica a gravações em arquivos de log binários e arquivos de índice de log binário, exceto que as referências a “linha” e “registro” devem ser entendidas como “evento”.

Quando ocorre uma condição de disco cheio, o MySQL faz o seguinte:

- Ele verifica a cada minuto se há espaço suficiente para escrever a linha atual. Se houver espaço suficiente, ele continua como se nada tivesse acontecido.

- A cada 10 minutos, ele escreve uma entrada no arquivo de log, alertando sobre a condição de disco cheio.

Para aliviar o problema, tome as seguintes ações:

- Para continuar, você só precisa liberar espaço suficiente no disco para inserir todos os registros.

- Como alternativa, para abortar o thread, use [**mysqladmin kill**](mysqladmin.html). O thread será abortado na próxima vez que verificar o disco (em um minuto).

- Outros threads podem estar esperando pela tabela que causou a condição de disco cheio. Se você tiver vários threads "bloqueados", matar o thread que está esperando a condição de disco cheio permite que os outros threads continuem.

As exceções ao comportamento anterior são quando você usa [`REPAIR TABLE`](repair-table.html) ou [`OPTIMIZE TABLE`](optimize-table.html) ou quando os índices são criados em lote após [`LOAD DATA`](load-data.html) ou após uma declaração de [`ALTER TABLE`](alter-table.html). Todas essas declarações podem criar grandes arquivos temporários que, se deixados sozinhos, causariam grandes problemas para o resto do sistema. Se o disco ficar cheio enquanto o MySQL estiver realizando alguma dessas operações, ele remove os grandes arquivos temporários e marca a tabela como falha. A exceção é que, para [`ALTER TABLE`](alter-table.html), a tabela antiga é deixada inalterada.
