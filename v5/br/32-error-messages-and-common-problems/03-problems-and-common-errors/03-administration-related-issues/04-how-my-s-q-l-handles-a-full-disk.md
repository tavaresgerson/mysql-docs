#### B.3.3.4 Como o MySQL Lida com um Disco Cheio

Esta seção descreve como o MySQL responde a erros de disco cheio (como "no space left on device" – sem espaço restante no dispositivo) e a erros de cota excedida (como "write failed" – falha na escrita – ou "user block limit reached" – limite de bloco do usuário atingido).

Esta seção é relevante para escritas em tabelas `MyISAM`. Ela também se aplica a escritas em arquivos Binary Log e ao arquivo Index do Binary Log, exceto que as referências a “row” e “record” devem ser entendidas como “event.”

Quando uma condição de disco cheio ocorre, o MySQL faz o seguinte:

* Ele verifica uma vez a cada minuto se há espaço suficiente para escrever a row atual. Se houver espaço suficiente, ele continua como se nada tivesse acontecido.

* A cada 10 minutos, ele escreve uma entrada no arquivo de log, alertando sobre a condição de disco cheio.

Para aliviar o problema, tome as seguintes ações:

* Para continuar, você só precisa liberar espaço em disco suficiente para inserir todos os records.

* Alternativamente, para abortar o Thread, use [**mysqladmin kill**](mysqladmin.html "4.5.2 mysqladmin — Um Programa de Administração do Servidor MySQL"). O Thread é abortado na próxima vez que ele verifica o disco (em um minuto).

* Outros Threads podem estar esperando pela tabela que causou a condição de disco cheio. Se você tiver vários Threads “locked” (travados), encerrar o Thread que está aguardando a condição de disco cheio permite que os outros Threads continuem.

Exceções ao comportamento anterior ocorrem quando você usa [`REPAIR TABLE`](repair-table.html "13.7.2.5 Instrução REPAIR TABLE") ou [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 Instrução OPTIMIZE TABLE") ou quando os Indexes são criados em lote após [`LOAD DATA`](load-data.html "13.2.6 Instrução LOAD DATA") ou após uma instrução [`ALTER TABLE`](alter-table.html "13.1.8 Instrução ALTER TABLE"). Todas essas instruções podem criar grandes arquivos temporários que, se não forem gerenciados, causariam grandes problemas para o restante do sistema. Se o disco ficar cheio enquanto o MySQL estiver realizando qualquer uma dessas operações, ele remove os grandes arquivos temporários e marca a tabela como *crashed* (falhada). A exceção é que para o [`ALTER TABLE`](alter-table.html "13.1.8 Instrução ALTER TABLE"), a tabela antiga permanece inalterada.