### B.3.1 Como Determinar a Causa de um Problema

Ao se deparar com um problema, a primeira coisa a fazer é descobrir qual programa ou equipamento está causando-o:

* Se você apresentar um dos seguintes sintomas, é provável que seja um problema de hardware (como memory, placa-mãe, CPU ou hard disk) ou um problema no kernel:

  + O teclado não funciona. Isso pode ser verificado pressionando a tecla Caps Lock. Se a luz do Caps Lock não mudar, você deve substituir o teclado. (Antes de fazer isso, tente reiniciar o computador e verificar todos os cabos do teclado.)

  + O ponteiro do mouse não se move.
  + A máquina não responde a *pings* de uma máquina remota.
  + Outros programas que não estão relacionados ao MySQL não se comportam corretamente.

  + Seu sistema reiniciou inesperadamente. (Um programa com falha em nível de usuário nunca deve ser capaz de derrubar seu sistema.)

  Neste caso, você deve começar verificando todos os seus cabos e executar alguma ferramenta de diagnóstico para checar seu hardware! Você também deve verificar se existem patches, updates ou service packs para o seu sistema operacional que possam resolver o problema. Verifique também se todas as suas libraries (como a `glibc`) estão atualizadas.

  É sempre bom usar uma máquina com memória ECC para descobrir problemas de memory precocemente.

* Se o seu teclado estiver bloqueado, você pode tentar recuperar o acesso fazendo login na sua máquina a partir de outra e executando `kbd_mode -a`.

* Examine o arquivo de log do sistema (`/var/log/messages` ou similar) em busca de motivos para o seu problema. Se você acredita que o problema está no MySQL, você também deve examinar os arquivos de log do MySQL. Consulte [Section 5.4, “MySQL Server Logs”](server-logs.html "5.4 MySQL Server Logs").

* Se você não acredita ter problemas de hardware, tente descobrir qual programa está causando os problemas. Tente usar **top**, **ps**, Gerenciador de Tarefas (*Task Manager*) ou algum programa similar, para verificar qual programa está consumindo toda a CPU ou está travando a máquina.

* Use **top**, **df** ou um programa similar para verificar se você está sem memory, disk space, file descriptors ou algum outro recurso crítico.

* Se o problema for algum processo descontrolado, você sempre pode tentar finalizá-lo (kill). Se ele não quiser morrer, provavelmente há um bug no sistema operacional.

Se você examinou todas as outras possibilidades e concluiu que o MySQL server ou um cliente MySQL está causando o problema, é hora de criar um relatório de bug (*bug report*); consulte [Section 1.5, “How to Report Bugs or Problems”](bug-reports.html "1.5 How to Report Bugs or Problems"). No bug report, tente fornecer uma descrição completa de como o sistema está se comportando e o que você acha que está acontecendo. Declare também por que você acredita que o MySQL está causando o problema. Leve em consideração todas as situações descritas neste capítulo. Declare quaisquer problemas exatamente como eles aparecem ao examinar seu sistema. Use o método de “copiar e colar” para qualquer output e mensagens de erro de programas e arquivos de log.

Tente descrever em detalhes qual programa não está funcionando e todos os sintomas que você observa. No passado, recebemos muitos bug reports que indicavam apenas “o sistema não funciona.” Isso não nos fornece nenhuma informação sobre qual pode ser o problema.

Se um programa falhar, é sempre útil saber as seguintes informações:

* O programa em questão causou um segmentation fault (ele fez um dump core)?

* O programa está consumindo todo o tempo de CPU disponível? Verifique com **top**. Deixe o programa rodar por um tempo, ele pode estar simplesmente avaliando algo computacionalmente intensivo.

* Se o server [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") estiver causando problemas, você consegue obter alguma resposta dele com [**mysqladmin -u root ping**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") ou [**mysqladmin -u root processlist**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program")?

* O que um programa client diz quando você tenta se conectar ao MySQL server? (Tente com [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), por exemplo.) O client trava (*jam*)? Você obtém algum output do programa?

Ao enviar um bug report, você deve seguir o esquema descrito em [Section 1.5, “How to Report Bugs or Problems”](bug-reports.html "1.5 How to Report Bugs or Problems").