## 2.11 Desatualização do MySQL

2.11.1 Antes de Começar

2.11.2 Caminhos de Downgrade

2.11.3 Notas de Downgrade

2.11.4 Downgrading de Instalações Binárias e Baseadas em Pacotes no Unix/Linux

2.11.5 Solução de problemas de downgrade

Esta seção descreve os passos para fazer uma atualização para uma versão anterior de uma instalação do MySQL.

A desativação é uma operação menos comum que a ativação. Geralmente, é realizada devido a um problema de compatibilidade ou desempenho que ocorre em um sistema de produção e não foi descoberto durante a verificação inicial de ativação nos sistemas de teste. Assim como o procedimento de ativação descrito na Seção 2.10, “Ativação do MySQL”), realize e verifique o procedimento de desativação em alguns sistemas de teste antes de usá-lo em um sistema de produção.

Nota

Na discussão a seguir, os comandos do MySQL que devem ser executados usando uma conta MySQL com privilégios administrativos incluem `-u root` na linha de comando para especificar o usuário `root` do MySQL. Os comandos que exigem uma senha para o `root` também incluem a opção `-p`. Como `-p` não é seguido por nenhum valor de opção, esses comandos solicitam a senha. Digite a senha quando solicitado e pressione Enter.

As instruções SQL podem ser executadas usando o cliente de linha de comando **mysql** (conecte-se como `root` para garantir que você tenha os privilégios necessários).
