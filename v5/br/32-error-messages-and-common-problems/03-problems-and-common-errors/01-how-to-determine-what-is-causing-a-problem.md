### B.3.1 Como determinar o que está causando um problema

Quando você encontrar um problema, a primeira coisa que você deve fazer é descobrir qual programa ou peça de equipamento está causando isso:

- Se você tiver um dos seguintes sintomas, provavelmente é um problema de hardware (como memória, placa-mãe, CPU ou disco rígido) ou um problema no kernel:

  - O teclado não funciona. Isso geralmente pode ser verificado pressionando a tecla Caps Lock. Se a luz do Caps Lock não mudar, você deve substituir o teclado. (Antes de fazer isso, tente reiniciar o computador e verifique todos os cabos do teclado.)

  - O ponteiro do mouse não se move.

  - A máquina não responde aos pings de uma máquina remota.

  - Outros programas que não estão relacionados ao MySQL não funcionam corretamente.

  - Seu sistema reiniciou inesperadamente. (Um programa de nível de usuário com defeito nunca deveria ser capaz de derrubar seu sistema.)

  Nesse caso, você deve começar verificando todos os seus cabos e executando uma ferramenta de diagnóstico para verificar seu hardware! Você também deve verificar se há algum patch, atualização ou pacote de serviço para o seu sistema operacional que possa resolver o problema. Verifique também se todas as suas bibliotecas (como `glibc`) estão atualizadas.

  É sempre bom usar uma máquina com memória ECC para descobrir problemas de memória precocemente.

- Se o seu teclado estiver bloqueado, você poderá recuperá-lo ao fazer login na sua máquina de outra máquina e executar `kbd_mode -a`.

- Por favor, examine seu arquivo de log do sistema (`/var/log/messages` ou semelhante) para encontrar as razões do seu problema. Se você acha que o problema está no MySQL, você também deve examinar os arquivos de log do MySQL. Veja [Seção 5.4, “Logs do Servidor MySQL”](server-logs.html).

- Se você não acha que tem problemas de hardware, tente descobrir qual programa está causando os problemas. Tente usar **top**, **ps**, o Gerenciador de Tarefas ou algum programa semelhante para verificar qual programa está usando toda a CPU ou bloqueando a máquina.

- Use **top**, **df** ou um programa semelhante para verificar se você está sem memória, espaço em disco, descritores de arquivo ou algum outro recurso crítico.

- Se o problema for um processo descontrolado, você sempre pode tentar matá-lo. Se ele não quiser morrer, provavelmente há um bug no sistema operacional.

Se você examinou todas as outras possibilidades e concluiu que o servidor MySQL ou um cliente MySQL está causando o problema, é hora de criar um relatório de erro, veja [Seção 1.5, “Como Relatar Erros ou Problemas”](bug-reports.html). No relatório de erro, tente fornecer uma descrição completa de como o sistema está se comportando e o que você acha que está acontecendo. Além disso, explique por que você acha que o MySQL está causando o problema. Considere todas as situações descritas neste capítulo. Descreva quaisquer problemas exatamente como eles aparecem quando você examina seu sistema. Use o método “copiar e colar” para qualquer saída e mensagens de erro de programas e arquivos de log.

Tente descrever em detalhes qual programa não está funcionando e todos os sintomas que você observa. No passado, recebemos muitos relatórios de erros que afirmam apenas “o sistema não funciona”. Isso não nos fornece nenhuma informação sobre o que poderia ser o problema.

Se um programa falhar, é sempre útil saber as seguintes informações:

- O programa em questão causou uma falha de segmentação (o programa travou)?

- O programa está ocupando todo o tempo de CPU disponível? Verifique com o **top**. Deixe o programa rodar por um tempo, pode ser que ele esteja apenas avaliando algo intensivo em termos de processamento.

- Se o servidor [**mysqld**](mysqld.html) estiver causando problemas, você consegue obter alguma resposta dele com [**mysqladmin -u root ping**](mysqladmin.html) ou [**mysqladmin -u root processlist**](mysqladmin.html)?

- O que um programa cliente diz quando você tenta se conectar ao servidor MySQL? (Tente com \[**mysql**]\(mysql.html], por exemplo.) O cliente travam? Você obtém algum tipo de saída do programa?

Ao enviar um relatório de erro, você deve seguir o esquema descrito em [Seção 1.5, “Como relatar erros ou problemas”](bug-reports.html).
