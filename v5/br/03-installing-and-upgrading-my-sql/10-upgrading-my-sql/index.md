## 2.10 Atualização do MySQL

2.10.1 Antes de Começar

2.10.2 Caminhos de atualização

2.10.3 Alterações no MySQL 5.7

2.10.4 Atualização de Instalações Binárias ou Baseadas em Pacotes do MySQL no Unix/Linux

2.10.5 Atualização do MySQL com o Repositório MySQL Yum

2.10.6 Atualização do MySQL com o Repositório MySQL APT

2.10.7 Atualização do MySQL com o Repositório MySQL SLES

2.10.8 Atualização do MySQL no Windows

2.10.9 Atualizando uma Instalação Docker do MySQL

2.10.10 Atualização do MySQL com pacotes RPM baixados diretamente

2.10.11 Solução de problemas de atualização

2.10.12 Reestruturação ou reparo de tabelas ou índices

2.10.13 Copiar bancos de dados MySQL para outra máquina

Esta seção descreve os passos para atualizar uma instalação do MySQL.

A atualização é um procedimento comum, pois você recebe correções de bugs na mesma série de lançamentos do MySQL ou recursos significativos entre os principais lançamentos do MySQL. Você realiza esse procedimento primeiro em alguns sistemas de teste para garantir que tudo funcione sem problemas e, em seguida, nos sistemas de produção.

Nota

Na discussão a seguir, os comandos do MySQL que devem ser executados usando uma conta MySQL com privilégios administrativos incluem `-u root` na linha de comando para especificar o usuário `root` do MySQL. Os comandos que exigem uma senha para o `root` também incluem a opção `-p`. Como `-p` não é seguido por nenhum valor de opção, esses comandos solicitam a senha. Digite a senha quando solicitado e pressione Enter.

As instruções SQL podem ser executadas usando o cliente de linha de comando **mysql** (conecte-se como `root` para garantir que você tenha os privilégios necessários).
