# Capítulo 3 Atualizando o MySQL

**Índice**

3.1 Antes de Começar

3.2 Caminhos de Atualização

3.3 Melhores Práticas de Atualização

3.4 O que o Processo de Atualização do MySQL Atualiza

3.5 Alterações no MySQL 9.5

3.6 Preparando Sua Instalação para Atualização

3.7 Atualizando Instalações Binárias ou Baseadas em Pacotes do MySQL no Unix/Linux

3.8 Atualizando o MySQL com o Repositório MySQL Yum

3.9 Atualizando o MySQL com o Repositório MySQL APT

3.10 Atualizando o MySQL com o Repositório SLES do MySQL

3.11 Atualizando o MySQL no Windows

3.12 Atualizando uma Instalação Docker do MySQL

3.13 Solução de Problemas de Atualização

3.14 Refazendo ou Reparando Tabelas ou Índices

3.15 Copiando Bancos de Dados do MySQL para Outra Máquina

Este capítulo descreve os passos para atualizar uma instalação do MySQL.

A atualização é um procedimento comum, pois você recebe correções de bugs dentro da mesma série de versões do MySQL ou recursos significativos entre as principais versões do MySQL. Você executa esse procedimento primeiro em alguns sistemas de teste para garantir que tudo funcione sem problemas e, em seguida, nos sistemas de produção.

Observação

Na discussão a seguir, os comandos do MySQL que devem ser executados usando uma conta MySQL com privilégios administrativos incluem `-u root` na linha de comando para especificar o usuário `root` do MySQL. Os comandos que exigem uma senha para `root` também incluem uma opção `-p`. Como `-p` é seguido por nenhum valor de opção, esses comandos solicitam a senha. Digite a senha quando solicitado e pressione Enter.

As instruções SQL podem ser executadas usando o cliente de linha de comando **mysql** (conecte-se como `root` para garantir que você tenha os privilégios necessários).