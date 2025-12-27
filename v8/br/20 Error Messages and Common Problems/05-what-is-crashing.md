### B.3.1 Como Determinar o Que Está Causing um Problema

Quando você encontrar um problema, a primeira coisa que você deve fazer é descobrir qual programa ou peça de equipamento está causando:

* Se você tiver um dos seguintes sintomas, então é provavelmente um problema de hardware (como memória, placa-mãe, CPU ou disco rígido) ou problema no kernel:

  + O teclado não funciona. Isso normalmente pode ser verificado pressionando a tecla Caps Lock. Se a luz do Caps Lock não mudar, você deve substituir seu teclado. (Antes de fazer isso, você deve tentar reiniciar seu computador e verificar todos os cabos do teclado.)
  + O ponteiro do mouse não se move.
  + A máquina não responde aos pings de uma máquina remota.
  + Outros programas que não estão relacionados ao MySQL não se comportam corretamente.
  + Seu sistema reiniciou inesperadamente. (Um programa de nível de usuário defeituoso nunca deve ser capaz de derrubar seu sistema.)

Neste caso, você deve começar verificando todos os seus cabos e executar uma ferramenta de diagnóstico para verificar seu hardware! Você também deve verificar se há algum patch, atualização ou pacote de serviço para seu sistema operacional que possa resolver seu problema. Verifique também se todas as suas bibliotecas (como `glibc`) estão atualizadas.

É sempre bom usar uma máquina com memória ECC para descobrir problemas de memória precocemente.
* Se o seu teclado estiver bloqueado, você pode ser capaz de recuperá-lo ao fazer login na sua máquina de outra máquina e executar `kbd_mode -a`.
* Por favor, examine o arquivo de log do seu sistema (`/var/log/messages` ou similar) para encontrar as razões do seu problema. Se você acha que o problema está no MySQL, você também deve examinar os arquivos de log do MySQL. Veja a Seção 7.4, “Logs do Servidor MySQL”.
* Se você não acha que tem problemas de hardware, você deve tentar descobrir qual programa está causando os problemas. Tente usar **top**, `ps`, o Gerenciador de Tarefas ou algum programa semelhante para verificar qual programa está consumindo toda a CPU ou está bloqueando a máquina.
* Use **top**, **df** ou algum programa semelhante para verificar se você está sem memória, espaço em disco, descritores de arquivo ou algum outro recurso crítico.
* Se o problema for um processo descontrolado, você sempre pode tentar matá-lo. Se ele não quiser morrer, provavelmente há um bug no sistema operacional.

Se você examinou todas as outras possibilidades e concluiu que o servidor MySQL ou um cliente MySQL está causando o problema, é hora de criar um relatório de bug, veja a Seção 1.6, “Como Relatar Bugs ou Problemas”. No relatório de bug, tente dar uma descrição completa de como o sistema está se comportando e o que você acha que está acontecendo. Além disso, indique por que você acha que o MySQL está causando o problema. Considere todas as situações descritas neste capítulo. Indique quaisquer problemas exatamente como aparecem quando você examina seu sistema. Use o método “copiar e colar” para qualquer saída e mensagens de erro de programas e arquivos de log.

Tente descrever em detalhes qual programa não está funcionando e todos os sintomas que você vê. Recebemos no passado muitos relatórios de bugs que afirmam apenas “o sistema não funciona”. Isso não nos fornece nenhuma informação sobre o que poderia ser o problema.

Se um programa falhar, é sempre útil saber as seguintes informações:

* O programa em questão causou uma falha de segmentação (o programa travou)?
* O programa está ocupando todo o tempo de CPU disponível? Verifique com o **top**. Deixe o programa rodar por um tempo, ele pode estar simplesmente avaliando algo intensivamente computacional.
* Se o servidor **mysqld** está causando problemas, você consegue obter alguma resposta dele com **mysqladmin -u root ping** ou **mysqladmin -u root processlist**?
* O que um programa cliente diz quando você tenta se conectar ao servidor MySQL? (Tente com o **mysql**, por exemplo.) O cliente travou? Você obtém alguma saída do programa?

Ao enviar um relatório de erro, você deve seguir o esquema descrito na **Seção 1.6, "Como relatar erros ou problemas"**.