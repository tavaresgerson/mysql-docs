## 2.11 Downgrading MySQL

2.11.1 Antes de Começar

2.11.2 Caminhos de Downgrade

2.11.3 Notas sobre Downgrade

2.11.4 Fazendo o Downgrade de Instalações Binárias e Baseadas em Pacotes no Unix/Linux

2.11.5 Solução de Problemas de Downgrade

Esta seção descreve os passos para fazer o downgrade de uma instalação MySQL.

O Downgrade é uma operação menos comum que o upgrade. O Downgrade é tipicamente realizado devido a um problema de compatibilidade ou performance que ocorre em um sistema de produção, e que não foi descoberto durante a verificação inicial do upgrade nos sistemas de teste. Assim como no procedimento de upgrade (Seção 2.10, “Upgrading MySQL”), realize e verifique o procedimento de downgrade primeiro em alguns sistemas de teste, antes de utilizá-lo em um sistema de produção.

Nota

Na discussão a seguir, os comandos MySQL que devem ser executados usando uma conta MySQL com privilégios administrativos incluem `-u root` na linha de comando para especificar o usuário MySQL `root`. Comandos que exigem uma senha para o `root` também incluem a opção `-p`. Como `-p` não é seguido por nenhum valor de opção, tais comandos solicitam a senha. Digite a senha quando solicitado e pressione Enter.

As instruções SQL podem ser executadas utilizando o cliente de linha de comando **mysql** (conecte-se como `root` para garantir que você tenha os privilégios necessários).