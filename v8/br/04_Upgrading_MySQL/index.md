# Capítulo 3: Atualização do MySQL

**Índice**

3.1 Antes de Começar

3.2 Caminhos de atualização

3.3 Práticas de Atualização de Melhoria

3.4 O que o processo de atualização do MySQL atualiza

3.5 Alterações no MySQL 8.0

3.6 Preparando sua instalação para atualização

3.7 Atualização de Instalações Binárias ou Baseadas em Pacotes do MySQL no Unix/Linux

3.8 Atualização do MySQL com o Repositório MySQL Yum

3.9 Atualização do MySQL com o Repositório MySQL APT

3.10 Atualização do MySQL com o Repositório MySQL SLES

3.11 Atualização do MySQL no Windows

3.12 Atualizando uma Instalação Docker do MySQL

3.13 Solução de problemas de atualização

3.14 Reestruturação ou reparo de tabelas ou índices

3.15 Copiar bancos de dados MySQL para outra máquina

Este capítulo descreve os passos para atualizar uma instalação do MySQL.

A atualização é um procedimento comum, pois você recebe correções de bugs na mesma série de lançamentos do MySQL ou recursos significativos entre os principais lançamentos do MySQL. Você realiza esse procedimento primeiro em alguns sistemas de teste para garantir que tudo funcione sem problemas e, em seguida, nos sistemas de produção.

Nota

Na discussão a seguir, os comandos do MySQL que devem ser executados usando uma conta MySQL com privilégios administrativos incluem `-u root` na linha de comando para especificar o usuário `root` do MySQL. Os comandos que exigem uma senha para `root` também incluem uma opção `-p`. Como `-p` é seguido por nenhum valor de opção, esses comandos solicitam a senha. Digite a senha quando solicitado e pressione Enter.

As instruções SQL podem ser executadas usando o cliente de linha de comando **mysql** (conecte-se como `root` para garantir que você tenha os privilégios necessários).
