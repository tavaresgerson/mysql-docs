#### B.3.3.4 Como o MySQL lida com um disco cheio

Esta seção descreve como o MySQL responde a erros de disco cheio (como “sem espaço disponível no dispositivo”) e a erros de excedente de quota (como “escrita falhou” ou “limite de bloqueio do usuário atingido”).

Esta seção é relevante para gravações em tabelas `MyISAM`. Ela também se aplica para gravações em arquivos de log binário e arquivo de índice de log binário, exceto que as referências a “linha” e “registro” devem ser entendidas como “evento”.

Quando ocorre uma condição de disco cheio, o MySQL faz o seguinte:

* Verifica uma vez por minuto para ver se há espaço suficiente para escrever a linha atual. Se houver espaço suficiente, continua como se nada tivesse acontecido.

* A cada 10 minutos, escreve uma entrada no arquivo de log, avisando sobre a condição de disco cheio.

Para aliviar o problema, tome as seguintes ações:

* Para continuar, você só precisa liberar espaço de disco suficiente para inserir todos os registros.

* Alternativamente, para abortar o thread, use **mysqladmin kill**. O thread é abortado na próxima vez que verificar o disco (em um minuto).

* Outros threads podem estar aguardando a tabela que causou a condição de disco cheio. Se você tiver vários threads “bloqueados”, matar o thread que está aguardando a condição de disco cheio permite que os outros threads continuem.

As exceções ao comportamento anterior são quando você usa `REPAIR TABLE` ou `OPTIMIZE TABLE` ou quando os índices são criados em lote após `LOAD DATA` ou após uma declaração `ALTER TABLE`. Todas essas declarações podem criar grandes arquivos temporários que, se deixados sozinhos, causariam grandes problemas para o resto do sistema. Se o disco ficar cheio enquanto o MySQL estiver realizando alguma dessas operações, ele remove os grandes arquivos temporários e marca a tabela como falha. A exceção é que, para `ALTER TABLE`, a tabela antiga é deixada inalterada.