## 2.10 Atualizando o MySQL

2.10.1 Antes de Começar

2.10.2 Caminhos de Upgrade

2.10.3 Alterações no MySQL 5.7

2.10.4 Atualizando Instalações do MySQL Baseadas em Binários ou Pacotes no Unix/Linux

2.10.5 Atualizando o MySQL com o Repositório Yum do MySQL

2.10.6 Atualizando o MySQL com o Repositório APT do MySQL

2.10.7 Atualizando o MySQL com o Repositório SLES do MySQL

2.10.8 Atualizando o MySQL no Windows

2.10.9 Atualizando uma Instalação Docker do MySQL

2.10.10 Atualizando o MySQL com Pacotes RPM Baixados Diretamente

2.10.11 Solução de Problemas de Upgrade

2.10.12 Reconstruindo ou Reparando Tables ou Indexes

2.10.13 Copiando Databases MySQL para Outra Máquina

Esta seção descreve os passos para atualizar uma instalação do MySQL.

O Upgrade é um procedimento comum, pois permite obter correções de bugs dentro da mesma série de lançamento do MySQL ou recursos significativos entre lançamentos principais do MySQL. Você deve realizar este procedimento primeiro em alguns sistemas de teste para garantir que tudo funcione sem problemas, e depois nos sistemas de produção.

Nota

Na discussão a seguir, os comandos MySQL que devem ser executados usando uma conta MySQL com privilégios administrativos incluem `-u root` na linha de comando para especificar o usuário `root` do MySQL. Comandos que exigem uma senha para `root` também incluem a opção `-p`. Como `-p` não é seguido por um valor de opção, esses comandos solicitam a senha. Digite a senha quando solicitado e pressione Enter.

As instruções SQL podem ser executadas usando o cliente de linha de comando **mysql** (conecte-se como `root` para garantir que você tenha os privilégios necessários).